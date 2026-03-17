/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ui: {
          bg: "#0f172a",
          card: "#1e293b",
          primary: "#22c55e",
          secondary: "#38bdf8",
          text: "#e2e8f0",
          muted: "#94a3b8",
          deep: "#020617"
        }
      },
      boxShadow: {
        soft: "0 12px 35px rgba(2, 6, 23, 0.25)",
        card: "0 10px 30px rgba(0, 0, 0, 0.4)"
      }
    }
  },
  plugins: []
};
