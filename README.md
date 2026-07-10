# Book Nook

Book Nook is a clean, modern React Native bookstore app built with Expo Router. It focuses on the assessment requirements: polished bookstore screens, explicit book-detail lifecycle handling, Zustand cart state, a subtle Reanimated add-to-cart animation, mock API data, and meaningful tests.

## Features

- Home catalog with search, featured books, categories, and paginated FlashList rendering.
- Book details screen that fetches a selected book with `useEffect`, including loading, error, cleanup, and success states.
- Cart powered by Zustand with add, remove, increase, decrease, item totals, and automatic total updates.
- Checkout screen with order summary, shipping, payment preview, and success navigation.
- Success screen with confirmation state and continue-shopping action.
- Subtle book-cover animation toward the cart action using React Native Reanimated.
- Mock API with 24 realistic books, simulated latency, pagination, search, and simulated failures.

## Technical Decisions

- **Expo SDK 57**: The project follows the versioned Expo v57 setup already present in the repository.
- **Expo Router**: File-based routes keep navigation simple: home, details, cart, checkout, and success.
- **NativeWind**: Utility classes provide concise, consistent styling around the white/orange minimalist design system.
- **Zustand**: Cart behavior is small, synchronous, and shared across screens, so a lightweight store is the clearest fit.
- **React Query**: The home catalog uses `useInfiniteQuery` for paginated catalog fetching and cache management.
- **useEffect for Details**: The details screen intentionally uses `useEffect` to demonstrate request lifecycle management.
- **FlashList**: The catalog uses FlashList for efficient rendering as the data set grows.
- **expo-image**: Covers use memory/disk caching and transitions for a smoother book-browsing feel.

## Project Structure

```text
src/
  app/             Expo Router screens
  components/      Reusable UI components
  features/        Feature-specific modules
  hooks/           Shared hooks
  services/        Mock API and data
  store/           Zustand stores
  types/           Shared TypeScript types
  utils/           Formatting helpers
  __tests__/       Jest and React Native Testing Library tests
```

## Setup

```bash
npm install
```

Expo SDK 57 / React Native 0.86 expects Node `20.19.4` or newer. This machine currently reports Node `20.19.0`, which may produce engine warnings.

## Run the App

```bash
npm start
npm run ios
npm run android
npm run web
```

## Run Tests

```bash
npm test
```

The test suite covers:

- Price formatting component.
- Cart store add/remove/quantity/total behavior.
- Mock book API success, pagination, and failure states.
- Checkout summary total calculation and rendering.

## Performance Notes

- FlashList renders the home catalog efficiently with `numColumns` and lazy page loading.
- Book card rendering is memoized with `React.memo`.
- Search input is debounced before triggering catalog queries.
- Images use `expo-image` caching and transitions.
- Business logic is separated from UI to keep render paths small and testable.