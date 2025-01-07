/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    // If you're also using Next.js in the root "app" or "components" folder:
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Add any other paths where you have .js/.jsx/.ts/.tsx/.mdx files
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  // DaisyUI configuration
  daisyui: {
    // You can list as many built-in or custom themes as you like
    themes: [
      "light",      // built-in theme
      "dark",       // built-in theme
      "corporate",  // built-in theme
      {
        // Example of a custom theme override (you can rename it "mycrustdata" or anything)
        crustdata: {
          "primary": "#0033A0",
          "secondary": "#EBEBEB",
          "accent": "#1FAA59",
          "neutral": "#2A2E37",
          "base-100": "#FFFFFF",
          "info": "#0070f3",
          "success": "#36D399",
          "warning": "#FBBD23",
          "error": "#F87272",
        },
      },
    ],
  },
  // Include the daisyUI plugin (and any other Tailwind plugins you want)
  plugins: [
    require("daisyui"),
    // e.g., require("@tailwindcss/typography") if you need it
  ],
};
