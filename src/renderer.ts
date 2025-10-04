import figlet from 'figlet';
import gradient from 'gradient-string';
import { FontError } from './utils/errors.js';

function centerText(text: string): string {
  const terminalWidth = process.stdout.columns || 80;
  const lines = text.split('\n');

  return lines
    .map((line) => {
      // Strip ANSI codes to get true line length
      const plainLine = line.replace(/\x1b\[[0-9;]*m/g, '');
      const padding = Math.max(0, Math.floor((terminalWidth - plainLine.length) / 2));
      return ' '.repeat(padding) + line;
    })
    .join('\n');
}

function rightAlignText(text: string): string {
  const terminalWidth = process.stdout.columns || 80;
  const lines = text.split('\n');

  return lines
    .map((line) => {
      // Strip ANSI codes to get true line length
      const plainLine = line.replace(/\x1b\[[0-9;]*m/g, '');
      const padding = Math.max(0, terminalWidth - plainLine.length);
      return ' '.repeat(padding) + line;
    })
    .join('\n');
}

export function renderLogo(
  text: string,
  palette: string[],
  font: string = 'Standard',
  direction: string = 'vertical',
  align: string = 'left'
): string {
  try {
    const asciiArt = figlet.textSync(text, {
      font: font as figlet.Fonts,
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true,
    });

    // Create gradient function
    const gradientFn = gradient(palette);

    let coloredArt: string;

    switch (direction) {
      case 'horizontal':
        // Apply gradient horizontally (left to right on each line)
        const lines = asciiArt.split('\n');
        const coloredLines = lines.map((line) => {
          if (line.trim() === '') {
            return line;
          }
          return gradientFn(line);
        });
        coloredArt = coloredLines.join('\n');
        break;

      case 'diagonal':
        // Create a custom diagonal gradient by applying different gradients per line
        const diagonalLines = asciiArt.split('\n');
        const lineCount = diagonalLines.length;
        coloredArt = diagonalLines
          .map((line, index) => {
            if (line.trim() === '') {
              return line;
            }
            // Create a gradient that shifts based on line position
            const shiftedPalette = palette.map((color, colorIndex) => {
              const shift = (index / lineCount) * palette.length;
              return palette[Math.floor(colorIndex + shift) % palette.length];
            });
            return gradient(shiftedPalette)(line);
          })
          .join('\n');
        break;

      case 'vertical':
      default:
        // Apply gradient vertically (top to bottom across all lines)
        coloredArt = gradientFn.multiline(asciiArt);
        break;
    }

    // Apply alignment
    if (align === 'center') {
      return centerText(coloredArt);
    } else if (align === 'right') {
      return rightAlignText(coloredArt);
    }

    return coloredArt;
  } catch (error) {
    if (error instanceof Error && error.message.includes('font')) {
      throw new FontError(font);
    }
    throw error;
  }
}
