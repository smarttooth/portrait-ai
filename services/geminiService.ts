import { GoogleGenAI } from "@google/genai";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is available.");
  }
  return new GoogleGenAI({ apiKey });
};

// Converts a base64 string (data:image/png;base64,...) to raw base64 for Gemini
const cleanBase64 = (dataUrl: string) => {
  return dataUrl.split(',')[1];
};

export const generateStyledImage = async (
  imageBase64: string,
  prompt: string
): Promise<string> => {
  const ai = getClient();
  const rawBase64 = cleanBase64(imageBase64);

  // We use the 'gemini-2.5-flash-image' model for efficient image editing/generation
  const model = "gemini-2.5-flash-image";

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png', // Assuming canvas export is PNG
              data: rawBase64,
            },
          },
          {
            text: `Act as a professional photo editor. Transform this image using the following style or instruction: "${prompt}". Maintain the composition and main subject (portrait) but apply the artistic style vigorously. Return ONLY the image.`,
          },
        ],
      },
    });

    // Extract image from response
    // The response might contain an image in the candidates
    const parts = response.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated");

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in response");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};
