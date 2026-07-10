import { jest } from '@jest/globals';

jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

jest.mock('expo-router', () => ({
  Link: ({ children }: { children: unknown }) => children,
  Redirect: () => null,
  Stack: () => null,
  router: {
    back: jest.fn(),
    push: jest.fn(),
    replace: jest.fn(),
  },
  useLocalSearchParams: () => ({ id: 'alchemist' }),
}));

jest.mock('expo-image', () => {
  const { Image } = require('react-native');

  return { Image };
});