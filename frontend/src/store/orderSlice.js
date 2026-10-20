import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderService } from '../services/api';

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMyOrders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderService.getMyOrders();
      return response.data.orders;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
    }
  }
);

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderService.createOrder(orderData);
      return response.data.order;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to place order');
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    loading: false,
    placingOrder: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Place order
      .addCase(placeOrder.pending, (state) => {
        state.placingOrder = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.placingOrder = false;
        state.orders.unshift(action.payload);
        state.successMessage = 'Order placed successfully!';
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.placingOrder = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;
export default orderSlice.reducer;
