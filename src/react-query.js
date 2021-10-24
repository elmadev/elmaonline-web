import { QueryClient } from 'react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    // in ms
    staleTime: 300000,
  },
});
