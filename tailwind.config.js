/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        lsm: "350px",

        esm: "400px",

        em: "480px",

        ew: "510px",

        vem: "560px",

        sm: "640px",
        // => @media (min-width: 640px) { ... }

        md: "768px",
        // => @media (min-width: 768px) { ... }

        mmd: "816px",

        emd: "999px",

        lg: "1024px",
        // => @media (min-width: 1024px) { ... }

        xlg: "1150px",

        xl: "1280px",
        // => @media (min-width: 1280px) { ... }

        exl: "1300px",

        "1xl": "1440px",

        "2xl": "1536px",
        // => @media (min-width: 1536px) { ... }

        "3xl": "1600px",
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "-ms-overflow-style": "none" /* Internet Explorer 10+ */,
          "scrollbar-width": "none" /* Firefox */,
          "&::-webkit-scrollbar": {
            display: "none" /* WebKit browsers */,
          },
        },
      });
    },
  ],
};
