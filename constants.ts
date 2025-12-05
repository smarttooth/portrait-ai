import { FilterConfig } from './types';

export const FILTERS: FilterConfig[] = [
  {
    id: 'normal',
    name: 'Original',
    cssFilter: 'none',
  },
  {
    id: 'studio',
    name: 'Studio Pro',
    cssFilter: 'contrast(105%) brightness(105%) saturate(105%)',
    overlayColor: 'rgba(255, 255, 255, 0.05)',
    overlayBlend: 'soft-light',
  },
  {
    id: 'matte',
    name: 'Matte',
    cssFilter: 'contrast(90%) brightness(110%) saturate(85%)',
    overlayColor: 'rgba(20, 20, 20, 0.1)',
    overlayBlend: 'screen',
  },
  {
    id: 'vivid',
    name: 'Vivid',
    cssFilter: 'saturate(130%) contrast(110%)',
  },
  {
    id: 'cocoa',
    name: 'Cocoa',
    cssFilter: 'grayscale(100%) contrast(110%) brightness(110%)',
    overlayColor: 'rgba(80, 60, 50, 0.15)',
    overlayBlend: 'multiply',
  },
  {
    id: 'noir',
    name: 'Noir',
    cssFilter: 'grayscale(100%) contrast(140%) brightness(90%)',
  },
  {
    id: 'silvertone',
    name: 'Silvertone',
    cssFilter: 'grayscale(100%) contrast(95%) brightness(110%)',
    overlayColor: 'rgba(200, 200, 220, 0.1)',
    overlayBlend: 'overlay',
  },
  {
    id: 'analog',
    name: 'Analog 1970',
    cssFilter: 'sepia(30%) saturate(120%) contrast(90%) brightness(105%)',
    overlayColor: 'rgba(255, 220, 180, 0.1)',
    overlayBlend: 'multiply',
  },
  {
    id: 'polaroid',
    name: 'Polaroid',
    cssFilter: 'contrast(110%) brightness(110%) saturate(80%) sepia(20%)',
    overlayColor: 'rgba(255, 200, 200, 0.1)',
    overlayBlend: 'soft-light',
  },
  {
    id: 'warmth',
    name: 'Golden Hour',
    cssFilter: 'saturate(110%) brightness(105%) sepia(10%)',
    overlayColor: 'rgba(255, 180, 0, 0.15)',
    overlayBlend: 'overlay',
  },
  {
    id: 'peach',
    name: 'Soft Peach',
    cssFilter: 'contrast(100%) brightness(108%) saturate(110%)',
    overlayColor: 'rgba(255, 200, 180, 0.15)',
    overlayBlend: 'screen',
  },
  {
    id: 'cool',
    name: 'Arctic',
    cssFilter: 'saturate(90%) brightness(105%) contrast(110%)',
    overlayColor: 'rgba(0, 100, 200, 0.1)',
    overlayBlend: 'overlay',
  },
  {
    id: 'dramatic',
    name: 'Dramatic',
    cssFilter: 'contrast(135%) saturate(80%) brightness(95%)',
  },
  {
    id: 'fade',
    name: 'Faded',
    cssFilter: 'contrast(85%) brightness(115%) saturate(80%)',
    overlayColor: 'rgba(226, 218, 196, 0.2)',
    overlayBlend: 'multiply',
  },
  {
    id: 'emerald',
    name: 'Forest',
    cssFilter: 'contrast(105%) saturate(90%) brightness(100%)',
    overlayColor: 'rgba(10, 80, 40, 0.15)',
    overlayBlend: 'screen',
  },
  {
    id: 'duotone_subtle',
    name: 'Urban',
    cssFilter: 'contrast(120%) saturate(0%) brightness(110%)',
    overlayColor: 'rgba(40, 20, 60, 0.2)',
    overlayBlend: 'lighten',
  },
  {
    id: 'dreamy',
    name: 'Dreamy',
    cssFilter: 'blur(0.5px) brightness(115%) contrast(95%) saturate(110%)',
    overlayColor: 'rgba(255, 230, 255, 0.1)',
    overlayBlend: 'screen',
  }
];

export const AI_STYLES = [
  "Professional Studio Photography, Rembrandt Lighting",
  "Cinematic Movie Scene, Teal and Orange",
  "Vintage 1950s Kodak Film Portrait",
  "Cyberpunk Neon Portrait, High Detail",
  "Soft Watercolor Painting Style",
  "Vogue Magazine Fashion Shoot",
  "Black and White Noir Detective Style",
  "Ethereal Fantasy Elf Portrait",
];