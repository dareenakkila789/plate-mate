/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // A fresh, warm green for primary — evokes freshness, growth, kindness
        primary: "#42f57e",         // Medium Green (Material Green 500)

        // Secondary: a soft, calming beige/off-white, not too cold
        secondary: "#F5F5DC",       // Beige

        // Accent: warm orange for joy, calls to action, energy
        accent: "#E07A5F",          // Deep Orange (Material Orange 400)

        // Background: very light cream for warmth and softness
        background: "#FFFDF7",      // Creamy off-white

        text: {
          dark: "#333333",          // Dark gray (less harsh than black)
          light: "#333333",         // Medium gray for secondary text
          white: "#FFFFFF",         // White
        },

        // Muted: soft gray with a hint of warmth for borders/cards
        muted: "#D6CCC2",           

        // Highlight: gentle yellow for tags or highlights, gentle and friendly
        highlight: "#FFF9C4",       // Light Yellow (Material Yellow 100)
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'soft': '0 4px 6px rgba(0, 0, 0, 0.05)',
        'medium': '0 6px 12px rgba(0, 0, 0, 0.08)',
      },
    },
  },
  plugins: [],
}
