import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productService } from '../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await productService.getProducts(params);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch produce');
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (id, { rejectWithValue }) => {
    try {
      const response = await productService.getProductById(id);
      return response.data.product;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch product');
    }
  }
);

export const fetchFarmerProducts = createAsyncThunk(
  'products/fetchFarmerProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await productService.getMyProducts();
      return response.data.products;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch your listings');
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    total: 0,
    totalPages: 1,
    currentPage: 1,
    selectedProduct: null,
    farmerProducts: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch products list
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.products || [];
        state.total = action.payload.total || 0;
        state.totalPages = action.payload.totalPages || 1;
        state.currentPage = action.payload.currentPage || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Single product
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Farmer products
      .addCase(fetchFarmerProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFarmerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.farmerProducts = action.payload;
      })
      .addCase(fetchFarmerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
