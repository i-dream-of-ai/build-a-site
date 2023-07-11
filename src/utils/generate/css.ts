import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

export async function generateCSS(html: string): Promise<string> {
    let result = await postcss([
        tailwindcss({
          content: [{ raw: html, extension: 'html' }],
          theme: {
            extend: {},
          },
          variants: {
            extend: {},
          },
          plugins: [require('@tailwindcss/typography'), require('@tailwindcss/forms')],
        }),
      ]).process('@tailwind base; @tailwind components; @tailwind utilities;', { from: undefined });
    
      return result.css;
}
