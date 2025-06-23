import type { Middleware } from "@reduxjs/toolkit";

import { refreshUserToken } from "../features/authSlice";

export const authMiddleware: Middleware = 
  (store) => 
    (next) =>
      async(action) => {
        const result = next(action);
        const state = store.getState();

        // Check if we need to refresh the token
        if(state.auth.isAuthenticated && state.auth.lastTokenRefresh) {
          const lastRefresh = new Date(state.auth.lastTokenRefresh);
          const now = new Date();
          
          // Fix: Correct calculation of minutes since last refresh
          const minutesSinceLastRefresh = (now.getTime() - lastRefresh.getTime()) / (1000 * 60);

          // Add some logging for debugging
          console.debug('Token refresh check:', {
            lastRefresh: lastRefresh.toISOString(),
            now: now.toISOString(),
            minutesSinceLastRefresh,
            shouldRefresh: minutesSinceLastRefresh > 14
          });

          // Refresh token if more than 14 minutes have passed
          // if(minutesSinceLastRefresh > 14 && action.type !== refreshUserToken.pending.type) {
          //   // Prevent refresh loop by checking if we're not already refreshing
          //   if (!action.type.startsWith('auth/refresh')) {
          //     await store.dispatch(refreshUserToken());
          //   }
          // }
        }
        return result;
      };