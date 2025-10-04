import { renderLogo } from './renderer.js';
import { renderInkLogo } from './InkRenderer.js';
import {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
} from './palettes.js';
import type { Fonts } from 'figlet';

export const DEFAULT_PALETTE: PaletteName = 'grad-blue';
export const DEFAULT_FONT = 'Standard';
export const DEFAULT_DIRECTION = 'vertical';

export interface RenderOptions {
  palette?: PaletteName | string[] | string;
  font?: Fonts | string;
  direction?: 'vertical' | 'horizontal' | 'diagonal';
  align?: 'left' | 'center' | 'right';
}

// cfonts upstream fonts / dir: https://github.com/dominikwilkowski/cfonts/tree/released/fonts
// cfont 'console' is excluded due to `Type '"console"' is not assignable to type` error/blocker
export type BlockFont =
  | '3d'
  | 'block'
  | 'chrome'
  | 'grid'
  | 'huge'
  | 'pallet'
  | 'shade'
  | 'simple'
  | 'simple3d'
  | 'simpleBlock'
  | 'slick'
  | 'tiny';

export interface RenderInkOptions {
  palette?: PaletteName | string[] | string;
  font?: BlockFont;
  letterSpacing?: number;
  lineHeight?: number;
  skipLines?: boolean;
  align?: 'left' | 'center' | 'right';
}

export function resolveColors(
  palette: PaletteName | string[] | string
): string[] {
  if (Array.isArray(palette)) {
    return palette;
  }

  const colors = resolvePalette(palette);
  if (!colors) {
    throw new Error(`Unknown palette: ${palette}`);
  }

  return colors;
}

export async function render(
  text: string,
  options: RenderOptions = {}
): Promise<string> {
  const {
    palette = DEFAULT_PALETTE,
    font = DEFAULT_FONT,
    direction = DEFAULT_DIRECTION,
    align = 'left',
  } = options;

  const paletteColors = resolveColors(palette);
  return renderLogo(text, paletteColors, font, direction, align);
}

export async function renderFilled(
  text: string,
  options: RenderInkOptions = {}
): Promise<void> {
  const { palette = DEFAULT_PALETTE, font, letterSpacing, lineHeight, skipLines, align = 'left' } = options;

  // Validate letter spacing
  if (letterSpacing !== undefined && letterSpacing < 0) {
    throw new Error('Letter spacing must be 0 or greater');
  }

  // Validate line height
  if (lineHeight !== undefined && lineHeight < 1) {
    throw new Error('Line height must be 1 or greater');
  }

  const paletteColors = resolveColors(palette);
  return renderInkLogo(text, paletteColors, { font, letterSpacing, lineHeight, skipLines, align });
}

export {
  PALETTES,
  type PaletteName,
  resolvePalette,
  getPaletteNames,
  getDefaultPalette,
  getPalettePreview,
};

export type { Fonts };
