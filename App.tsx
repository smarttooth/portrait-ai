import React, { useState, useCallback, useRef } from 'react';
import { Upload, Download, Wand2, ImageIcon, Loader2, Sliders, X, RefreshCcw } from './components/Icons';
import MainCanvas, { MainCanvasHandle } from './components/MainCanvas';
import FilterPreview from './components/FilterPreview';
import { FILTERS, AI_STYLES } from './constants';
import { FilterConfig, Tab, GeneratedImage } from './types';
import { generateStyledImage } from './services/geminiService';

const App: React.FC = () => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterConfig>(FILTERS[0]);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PRESETS);
  
  // AI State
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mainCanvasRef = useRef<MainCanvasHandle>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          setImageSrc(e.target.result);
          setGeneratedImage(null); // Reset generated image on new upload
          setActiveFilter(FILTERS[0]);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const handleDownload = () => {
    if (activeTab === Tab.AI_LAB && generatedImage) {
      const link = document.createElement('a');
      link.download = `portrait-ai-${Date.now()}.png`;
      link.href = generatedImage.url;
      link.click();
    } else {
      mainCanvasRef.current?.download();
    }
  };

  const handleGenerateAI = async () => {
    if (!imageSrc || !aiPrompt.trim()) return;
    
    // Get current canvas state as base image for AI
    const currentCanvasData = mainCanvasRef.current?.getDataURL();
    if (!currentCanvasData) return;

    setIsGenerating(true);
    setError(null);

    try {
      const resultDataUrl = await generateStyledImage(currentCanvasData, aiPrompt);
      setGeneratedImage({
        id: Date.now().toString(),
        url: resultDataUrl,
        prompt: aiPrompt
      });
    } catch (err: any) {
      setError(err.message || "Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const applyAiStyle = (style: string) => {
    setAiPrompt(style);
    // Optional: auto-submit or let user click generate. Let's let user click to confirm.
  };

  // Render
  return (
    <div className="flex flex-col h-full max-h-screen bg-gray-950 text-gray-100 font-sans">
      {/* Header */}
      <header className="flex-none flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/80 backdrop-blur-md z-10">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-gradient-to-tr from-purple-600 to-blue-600 rounded-lg shadow-lg">
             <Wand2 className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Portrait Pro <span className="font-light text-gray-400">AI</span>
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
          <button 
            onClick={triggerUpload}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full transition-all text-sm font-medium border border-gray-700"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          
          <button 
            disabled={!imageSrc}
            onClick={handleDownload}
            className={`flex items-center space-x-2 px-6 py-2 rounded-full transition-all text-sm font-medium shadow-lg
              ${imageSrc 
                ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-purple-900/20' 
                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
          >
            <Download className="w-4 h-4" />
            <span>Download</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Left/Main Canvas Area */}
        <div className="flex-1 p-6 flex items-center justify-center relative bg-grid-gray-900/20">
          {!imageSrc ? (
            <div 
              onClick={triggerUpload}
              className="group cursor-pointer flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-700 rounded-2xl hover:border-purple-500 hover:bg-gray-900/50 transition-all duration-300"
            >
              <div className="w-20 h-20 mb-4 rounded-full bg-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-10 h-10 text-gray-400 group-hover:text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-300">Upload a Portrait</h3>
              <p className="text-sm text-gray-500 mt-2 text-center max-w-xs">
                Drag & drop or click to start editing with professional filters and AI.
              </p>
            </div>
          ) : (
            <>
              {activeTab === Tab.AI_LAB && generatedImage ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-800 shadow-2xl">
                    <img src={generatedImage.url} alt="AI Generated" className="max-w-full max-h-full object-contain shadow-lg" />
                    <button 
                      onClick={() => setGeneratedImage(null)}
                      className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black/80 text-white rounded-full backdrop-blur-md transition-colors"
                      title="Back to Editor"
                    >
                      <X className="w-5 h-5" />
                    </button>
                </div>
              ) : (
                <MainCanvas 
                  ref={mainCanvasRef} 
                  imageSrc={imageSrc} 
                  activeFilter={activeFilter} 
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Bottom Control Panel */}
      {imageSrc && (
        <div className="flex-none bg-gray-900 border-t border-gray-800 flex flex-col z-20 shadow-[0_-5px_25px_rgba(0,0,0,0.3)]">
          {/* Tabs */}
          <div className="flex items-center px-4 border-b border-gray-800">
             <button 
               onClick={() => setActiveTab(Tab.PRESETS)}
               className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === Tab.PRESETS ? 'border-purple-500 text-purple-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
             >
               <Sliders className="w-4 h-4" />
               <span>Presets</span>
             </button>
             <button 
               onClick={() => setActiveTab(Tab.AI_LAB)}
               className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === Tab.AI_LAB ? 'border-blue-500 text-blue-400' : 'border-transparent text-gray-400 hover:text-gray-200'}`}
             >
               <Wand2 className="w-4 h-4" />
               <span>AI Lab</span>
             </button>
          </div>

          {/* Controls Area */}
          <div className="h-48 relative">
            {activeTab === Tab.PRESETS && (
              <div className="absolute inset-0 overflow-x-auto no-scrollbar flex items-center space-x-4 px-6">
                {FILTERS.map((filter) => (
                  <FilterPreview 
                    key={filter.id} 
                    filter={filter} 
                    imageSrc={imageSrc} 
                    isSelected={activeFilter.id === filter.id}
                    onClick={setActiveFilter}
                  />
                ))}
              </div>
            )}

            {activeTab === Tab.AI_LAB && (
              <div className="absolute inset-0 p-6 flex flex-row items-start space-x-8">
                <div className="flex-1 h-full flex flex-col space-y-4">
                   <div className="flex space-x-2">
                     <input 
                        type="text" 
                        value={aiPrompt}
                        onChange={(e) => setAiPrompt(e.target.value)}
                        placeholder="Describe a style... e.g. 'Cyberpunk neon lights, high contrast'"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                     />
                     <button 
                        onClick={handleGenerateAI}
                        disabled={isGenerating || !aiPrompt}
                        className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium text-sm transition-colors flex items-center space-x-2"
                     >
                       {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                       <span>Generate</span>
                     </button>
                   </div>
                   
                   {error && (
                     <p className="text-red-400 text-xs">{error}</p>
                   )}

                   <div className="flex-1 overflow-y-auto no-scrollbar">
                     <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Suggested Styles</p>
                     <div className="flex flex-wrap gap-2">
                       {AI_STYLES.map(style => (
                         <button 
                           key={style}
                           onClick={() => applyAiStyle(style)}
                           className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-md text-xs text-gray-300 transition-colors text-left"
                         >
                           {style}
                         </button>
                       ))}
                     </div>
                   </div>
                </div>

                <div className="w-64 h-full border-l border-gray-800 pl-8 flex flex-col justify-center text-sm text-gray-400">
                  <h4 className="font-semibold text-gray-200 mb-2">How it works</h4>
                  <p className="leading-relaxed text-xs">
                    The AI Lab uses Gemini to radically transform your photo based on your text description. This takes a few seconds but creates unique, generative art.
                  </p>
                  {generatedImage && (
                     <button 
                       onClick={() => setGeneratedImage(null)}
                       className="mt-4 flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-xs font-medium"
                     >
                       <RefreshCcw className="w-3 h-3" />
                       <span>Reset to Original</span>
                     </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
