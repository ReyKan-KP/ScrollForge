import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Theme = 
  | 'minimal' 
  | 'dark' 
  | 'sepia' 
  | 'fantasy' 
  | 'pastel' 
  | 'cyberpunk' 
  | 'vintage' 
  | 'ocean' 
  | 'forest' 
  | 'noir' 
  | 'cozy';

export const themes: Theme[] = [
  'minimal', 
  'dark', 
  'sepia', 
  'fantasy', 
  'pastel', 
  'cyberpunk', 
  'vintage', 
  'ocean', 
  'forest', 
  'noir', 
  'cozy'
];

export function setTheme(theme: Theme) {
  if (typeof document === 'undefined') return;
  
  // Remove all theme classes
  document.body.classList.remove(
    'theme-minimal',
    'theme-dark',
    'theme-sepia',
    'theme-fantasy',
    'theme-pastel',
    'theme-cyberpunk',
    'theme-vintage',
    'theme-ocean',
    'theme-forest',
    'theme-noir',
    'theme-cozy'
  )
  
  // Add the selected theme class
  document.body.classList.add(`theme-${theme}`)
  
  // Store user preference
  localStorage.setItem('scroll-forge-theme', theme)
}

export function getTheme(): Theme {
  if (typeof document === 'undefined') return 'minimal';
  
  // Check localStorage first
  const savedTheme = localStorage.getItem('scroll-forge-theme') as Theme | null;
  if (savedTheme && themes.includes(savedTheme)) {
    return savedTheme;
  }
  
  // Fallback to system preference or default
  return 'minimal';
}
