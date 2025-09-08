module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.(t|j)sx?$": "babel-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx"],
  // e2eディレクトリはJestの対象外（Playwright専用）
  testPathIgnorePatterns: ["/node_modules/", "/.next/", "/e2e/"],
  setupFilesAfterEnv: ["@testing-library/jest-dom", "<rootDir>/jest.setup.js"],
};
