/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#191919",
        foreground: "#ffffff",
        primary: "#00bcd4",
        secondary: "#4fc3f7",
        accent: "#64ffda",
        muted: "#6b7280",
        border: "#333333",
      },
      backgroundColor: {
        DEFAULT: "#191919",
      },
      textColor: {
        DEFAULT: "#ffffff",
      },
    },
  },
  plugins: [],
};
