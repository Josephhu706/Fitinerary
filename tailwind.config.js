const colors = require('tailwindcss/colors')

module.exports = {
    content: [],
    theme: {
        extend: {
            colors: {
                "at-light-green": "#44ba9f",
                "at-green": "#286d5d",
                "light-grey": "#f1f1f1",
                cyan: colors.cyan,
                violet: colors.violet,
                slate: colors.slate
            },
        },
        fontFamily: {
            Poppins: ["Poppins, sans-serif"],
        },
        flex: {
            "1": "1 1 0%",
            "2": "2 2 0%",
        },
        container: {
            center: true,
            screens: {
                lg: "1024px",
                xl: "1124px",
                "2xl": "1124px",
                'xsm': "300px",
                "md":"768px"
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}