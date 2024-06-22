const path = require("path");

module.exports = {
  // Other webpack configurations...
  resolve: {
    fallback: {
      os: require.resolve("os-browserify/browser"),
      crypto: require.resolve("crypto-browserify"),
    },
  },
  // Add your entry, output, and other configurations here...
};
