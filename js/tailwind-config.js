tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#facc15',
                secondary: '#1A1A1A',
                accent: '#FF4081',
            },
            fontFamily: {
                sans: ['Halcom', 'sans-serif'],
                heading: ['Halcom', 'sans-serif'],
            },
            animation: {
                'scale-down': 'scaleDown 500ms forwards',
                'scale-up': 'scaleUp 500ms forwards',
            },
            keyframes: {
                scaleDown: {
                    '0%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                    '100%': { transform: 'scale(1.1) translateY(40px)', opacity: '0' },
                },
                scaleUp: {
                    '0%': { transform: 'scale(1.1) translateY(-40px)', opacity: '0' },
                    '100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                },
            },
        }
    }
}
