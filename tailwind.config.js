module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
customForms: (theme) => ({
      default: {
        input: {
          "&:focus": {
            outline: "none",
            boxShadow: "none",
            borderColor: "none",
          },
        },
      },
    }),
    extend: {
        lineClamp: {
        7: '7',
        8: '8',
        9: '9',
        10: '10',
         12: '12',
      },
      fontFamily: {
       sacramento: ["Sacramento", "cursive"],
             'sans': ['"Nunito Sans"', 'sans-serif'],
      },
    },
  },
  plugins: [
     require('@tailwindcss/forms')({
   strategy: 'class',
 }),
  require('@tailwindcss/line-clamp'),
  ],
}
