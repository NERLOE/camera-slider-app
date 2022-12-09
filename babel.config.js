module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@contexts": "./src/contexts",
          "@components": "./src/components",
          "@utils": "./src/utils",
          "@screens": "./src/screens",
          "@assets": "./src/assets",
          "@constants": "./src/constants",
          "~": "./src",
        },
      },
    ],
  ],
};
