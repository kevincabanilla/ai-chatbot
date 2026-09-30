module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/unit-tests/**/*.test.ts?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^@shared/(.*)$": "<rootDir>/shared/$1",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  modulePathIgnorePatterns: ["<rootDir>/.vercel/"],
  setupFilesAfterEnv: ["<rootDir>/tests/unit-tests/setup.ts"],
  transform: {
    "^.+\\.[tj]sx?$": [
      "babel-jest",
      {
        plugins: [require.resolve("./tests/unit-tests/vite-env-plugin.cjs")],
        presets: [
          ["@babel/preset-env", { targets: { node: "current" }, modules: "commonjs" }],
          ["@babel/preset-react", { runtime: "automatic" }],
          ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
        ],
      },
    ],
  },
  clearMocks: true,
};
