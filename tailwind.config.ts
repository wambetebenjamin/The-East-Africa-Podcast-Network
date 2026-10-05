import type { Config } from 'tailwindcss';

/**
 * Design tokens extracted from design-source/podca-gh-pages (see DESIGN-SOURCE-ANALYSIS.md).
 * Primary #f23a2e, Poppins 200/300/400/700/900, zip shadow + radius scales.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx,mdx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
    './content/**/*.mdx',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#f23a2e', // $primary / $red — scss/bootstrap/_variables.scss:45
          dark: '#d93227',
        },
        ink: '#25262a', // $gray-1 headings
        body: '#4d4d4d', // body text (lighten #000 30%)
        footer: {
          DEFAULT: '#333333', // .site-footer bg (lighten #000 20%)
          text: '#737373', // footer p
          link: '#999999', // footer a
        },
        section: '#cccccc', // .bg-light in zip
        line: '#edf0f5', // $gray-4 borders
        cardline: '#e6e6e6', // post entry border
        menuhover: '#f4f5f9', // dropdown li hover
        btnsecondary: '#e6e7e9', // .btn.btn-secondary
        night: '#0a0a0a',
      },
      fontFamily: {
        sans: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // zip: body 1.1rem/200; nav 15px; footer-heading 20px
        body: ['17.6px', { lineHeight: '1.7', fontWeight: '200' }],
        nav: ['15px', { lineHeight: '1.5' }],
        'meta-sm': ['11px', { lineHeight: '1.4' }],
      },
      maxWidth: {
        container: '1140px', // BS4 container (zip grid)
      },
      boxShadow: {
        card: '0 5px 40px -10px rgba(0,0,0,.1)', // .podcast-entry
        'btn-hover': '0 5px 20px -7px rgba(0,0,0,.9)', // .btn:hover
        'feature-hover': '0 10px 40px -5px rgba(0,0,0,.4)', // .feature-block-1:hover
        dropdown: '0 0 4px 0 rgba(0,0,0,.25)', // .dropdown
        offcanvas: '-10px 0 20px -10px rgba(0,0,0,.1)', // .site-mobile-menu
        panel: '0 0 20px -5px rgba(0,0,0,.3)', // .text-inner
      },
      borderRadius: {
        DEFAULT: '4px', // .post-entry, .block-25 img
        btn: '0.25rem', // BS4 .btn
      },
      transitionTimingFunction: {
        podca: 'cubic-bezier(.25,.25,.75,.75)', // AOS 'slide' easing (linear)
      },
    },
  },
  plugins: [],
};

export default config;
