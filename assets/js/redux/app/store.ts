import {configureStore, ThunkAction, Action} from '@reduxjs/toolkit';
import nopSlice from '../features/nop/nopSlice';

export const store = configureStore({
  reducer: {
    nop: nopSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
