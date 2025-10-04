import React from 'react';
import { render, Text } from 'ink';
import BigText from 'ink-big-text';
import type { CFontProps } from 'ink-big-text';
import Gradient from 'ink-gradient';
import cfonts from 'cfonts';
import gradient from 'gradient-string';

interface LogoProps {
  text: string;
  colors: string[];
  font?: CFontProps['font'];
  letterSpacing?: number;
  lineHeight?: number;
}

const Logo: React.FC<LogoProps> = ({
  text,
  colors,
  font = 'block',
  letterSpacing,
  lineHeight,
}) => {
  // ink-gradient with custom colors
  if (colors.length > 0) {
    return (
      <Gradient colors={colors}>
        <BigText text={text} font={font} letterSpacing={letterSpacing} lineHeight={lineHeight} />
      </Gradient>
    );
  }

  // Default gradient
  return (
    <Gradient name="rainbow">
      <BigText text={text} font={font} letterSpacing={letterSpacing} lineHeight={lineHeight} />
    </Gradient>
  );
};

export function renderInkLogo(
  text: string,
  palette: string[],
  options?: { font?: CFontProps['font']; letterSpacing?: number; lineHeight?: number; skipLines?: boolean }
): Promise<void> {
  // If skipLines is enabled, use cfonts directly for more control
  if (options?.skipLines) {
    return new Promise((resolve) => {
      const cfontResult = cfonts.render(text, {
        font: options?.font || 'block',
        colors: ['white'], // Use single color, we'll apply gradient separately
        letterSpacing: options?.letterSpacing ?? 1,
        lineHeight: 1,
        space: false,
      });

      // Check if render was successful
      if (cfontResult && typeof cfontResult === 'object' && 'string' in cfontResult) {
        let output = cfontResult.string as string;

        // Strip ANSI color codes from cfonts output
        output = output.replace(/\x1b\[[0-9;]*m/g, '');

        // Replace solid blocks with lower seven eighths block (▇) to create horizontal gaps
        // Keep border characters (╔ ╗ ║ ═ ╝ ╚ ╦ ╩ ╠ ╣ ╬) intact
        output = output.replace(/█/g, '▇');

        // Apply gradient using gradient-string
        const gradientFn = gradient(palette);
        const coloredOutput = gradientFn.multiline(output);

        // Output directly to console
        console.log(coloredOutput);

        resolve();
      } else {
        resolve();
      }
    });
  }

  // Default: use Ink rendering
  return new Promise((resolve) => {
    const { unmount } = render(
      <Logo
        text={text}
        colors={palette}
        font={options?.font}
        letterSpacing={options?.letterSpacing}
        lineHeight={options?.lineHeight}
      />
    );

    // Automatically unmount after rendering to allow process to exit
    setTimeout(() => {
      unmount();

      // Reset terminal state to prevent corruption
      // SGR reset (colors, styles)
      process.stdout.write('\x1b[0m');
      // Ensure cursor is visible
      process.stdout.write('\x1b[?25h');
      // Clear to end of line to remove any artifacts
      process.stdout.write('\x1b[K');

      resolve();
    }, 100);
  });
}
