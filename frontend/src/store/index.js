import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import orderReducer from './orderSlice';
import messageReducer from './messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    messages: messageReducer,
  },
});

export default store;
