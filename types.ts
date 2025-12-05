export interface FilterConfig {
  id: string;
  name: string;
  cssFilter: string; // The standard CSS filter string (e.g. 'grayscale(1)')
  overlayColor?: string; // Optional hex or rgba color
  overlayBlend?: GlobalCompositeOperation; // Blend mode for the overlay
}

export enum Tab {
  PRESETS = 'PRESETS',
  AI_LAB = 'AI_LAB',
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}
