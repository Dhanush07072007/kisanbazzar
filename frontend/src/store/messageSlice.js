import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { messageService } from '../services/api';

export const fetchConversations = createAsyncThunk(
  'messages/fetchConversations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await messageService.getConversations();
      return response.data.conversations;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch messages');
    }
  }
);

export const fetchConversationHistory = createAsyncThunk(
  'messages/fetchConversationHistory',
  async (partnerId, { rejectWithValue }) => {
    try {
      const response = await messageService.getConversation(partnerId);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch conversation');
    }
  }
);

export const sendNewMessage = createAsyncThunk(
  'messages/sendNewMessage',
  async (msgData, { rejectWithValue }) => {
    try {
      const response = await messageService.sendMessage(msgData);
      return response.data.message;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send message');
    }
  }
);

const messageSlice = createSlice({
  name: 'messages',
  initialState: {
    conversations: [],
    activeConversationPartner: null,
    activeMessages: [],
    loading: false,
    sending: false,
    error: null,
  },
  reducers: {
    closeActiveChat: (state) => {
      state.activeConversationPartner = null;
      state.activeMessages = [];
    },
    setActivePartner: (state, action) => {
      state.activeConversationPartner = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch conversations list
      .addCase(fetchConversations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.loading = false;
        state.conversations = action.payload;
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch active conversation messages
      .addCase(fetchConversationHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchConversationHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.activeConversationPartner = action.payload.partner;
        state.activeMessages = action.payload.messages;
      })
      .addCase(fetchConversationHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendNewMessage.pending, (state) => {
        state.sending = true;
      })
      .addCase(sendNewMessage.fulfilled, (state, action) => {
        state.sending = false;
        state.activeMessages.push(action.payload);
      })
      .addCase(sendNewMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      });
  },
});

export const { closeActiveChat, setActivePartner } = messageSlice.actions;
export default messageSlice.reducer;
