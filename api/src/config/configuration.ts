export default () => ({
  port: process.env.PORT || 3000,
  pokedex: {
    host: process.env.POKEDEX_API_HOST,
  },
});
