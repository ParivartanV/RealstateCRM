export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
  // Suppress 'from' warning by always providing a default
  // This is a workaround for Vite+PostCSS+Tailwind
  processOptions: {
    from: undefined,
  },
};
