import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const colors = {
  navy: '#0B1A2B',
  darkNavy: '#060E18',
  midNavy: '#112240',
  gold: '#C4A44E',
  goldLight: '#D4B96A',
  goldDark: '#A68A3A',
  cream: '#F8F6F1',
  white: '#FFFFFF',
  offWhite: '#FAFAF8',
  grey: '#8A8A8A',
  greyLight: '#E8E6E1',
  text: '#1E1E1E',
  textMid: '#3A3A3A',
  textLight: '#5A5A5A',
  textFaint: '#999999'
}