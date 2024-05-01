import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import authReducer from './Slice/authSlice';
import roomReducer from './Slice/roomSlice';
const store = configureStore({
  reducer: {
    auth: authReducer,
    room: roomReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immutableCheck: true,
      serializableCheck: false, 
      actionCreatorCheck: true,
    }),
});


export default store;
