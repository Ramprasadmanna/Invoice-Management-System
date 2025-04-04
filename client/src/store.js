import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from '@slices/apiSlice';
import authSliceReducers from '@slices/authSlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSliceReducers,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export default store;
