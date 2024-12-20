module.exports = {
    preset: 'ts-jest',  // This enables TypeScript support in Jest
    testEnvironment: 'jest-environment-jsdom',
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",  // Ensures TypeScript files are transformed
    },
    moduleNameMapper: {
      '^@components/(.*)$': '<rootDir>/components/$1',
      '^@services/(.*)$': '<rootDir>/services/$1',
      '^@types$': '<rootDir>/types/index.ts',
      '^@styles/(.*)$': '<rootDir>/styles/$1',
      '\\.(css|less)$': 'identity-obj-proxy',  // Mock CSS imports using identity-obj-proxy
    },
  };
  