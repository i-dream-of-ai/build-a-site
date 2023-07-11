import postcss from 'postcss';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export async function generateCSS(html: string): Promise<string> {
  let result = await postcss([
      tailwindcss({
        content: [{ raw: html, extension: 'html' }],
        theme: {
          extend: {
            maskImage: {
              'radial': 'radial-gradient(100% 100% at top right, white, transparent)'
            }
          }
        },
        variants: {
          extend: {},
        },
        plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
      }),
      autoprefixer,
    ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
  
    return result.css;
}