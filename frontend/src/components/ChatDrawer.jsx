import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchConversations,
  fetchConversationHistory,
  sendNewMessage,
  closeActiveChat,
  setActivePartner,
} from '../store/messageSlice';
import { X, Send, ArrowLeft, MessageSquare, CheckCheck, User } from 'lucide-react';

const ChatDrawer = ({ isOpen, onClose, initialPartner, initialProduct }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    conversations,
    activeConversationPartner,
    activeMessages,
    loading,
    sending,
  } = useSelector((state) => state.messages);

  const [inputContent, setInputContent] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (isOpen && user) {
      dispatch(fetchConversations());
    }
  }, [isOpen, user, dispatch]);

  useEffect(() => {
    if (initialPartner && isOpen) {
      dispatch(setActivePartner(initialPartner));
      dispatch(fetchConversationHistory(initialPartner._id));
    }
  }, [initialPartner, isOpen, dispatch]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  if (!isOpen) return null;

  const handleSelectConversation = (partner) => {
    dispatch(setActivePartner(partner));
    dispatch(fetchConversationHistory(partner._id));
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputContent.trim() || !activeConversationPartner) return;

    await dispatch(
      sendNewMessage({
        receiverId: activeConversationPartner._id,
        content: inputContent,
        productId: initialProduct?._id || undefined,
      })
    );
    setInputContent('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-brand-600 text-white">
          <div className="flex items-center space-x-3">
            {activeConversationPartner && (
              <button
                onClick={() => dispatch(closeActiveChat())}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div>
              <h3 className="font-bold text-base flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4" />
                {activeConversationPartner
                  ? activeConversationPartner.name
                  : 'KisanBazar Messenger'}
              </h3>
              <p className="text-xs text-brand-100">
                {activeConversationPartner
                  ? activeConversationPartner.role === 'farmer'
                    ? activeConversationPartner.farmerProfile?.farmName || 'Verified Farmer'
                    : 'Consumer'
                  : 'Direct Communication Platform'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Context Banner */}
        {initialProduct && activeConversationPartner && (
          <div className="p-3 bg-brand-50 border-b border-brand-100 flex items-center space-x-3">
            <img
              src={initialProduct.primaryImage}
              alt={initialProduct.name}
              className="w-10 h-10 rounded-lg object-cover"
            />
            <div className="flex-1 text-xs">
              <span className="font-semibold text-gray-800 line-clamp-1">
                Inquiring about: {initialProduct.name}
              </span>
              <span className="text-brand-700 font-bold">
                ₹{initialProduct.price} / {initialProduct.unit}
              </span>
            </div>
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
          {!user ? (
            <div className="p-8 text-center text-sm text-gray-500">
              Please sign in to view and send messages.
            </div>
          ) : activeConversationPartner ? (
            /* Chat message thread */
            activeMessages.length === 0 ? (
              <div className="text-center py-16 text-gray-400 text-xs">
                No messages yet. Send a greeting to begin!
              </div>
            ) : (
              activeMessages.map((msg) => {
                const isMe = msg.sender?._id === user._id || msg.sender === user._id;
                return (
                  <div
                    key={msg._id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs font-medium leading-relaxed shadow-sm ${
                        isMe
                          ? 'bg-brand-600 text-white rounded-tr-none'
                          : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'
                      }`}
                    >
                      {msg.content}
                    </div>
                    <div className="flex items-center space-x-1 mt-1 text-[10px] text-gray-400 px-1">
                      <span>
                        {new Date(msg.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                      {isMe && <CheckCheck className="w-3 h-3 text-brand-600" />}
                    </div>
                  </div>
                );
              })
            )
          ) : (
            /* Conversations List */
            conversations.length === 0 ? (
              <div className="text-center py-20 text-gray-400 text-xs">
                No conversation history found.
                <p className="mt-1">Browse marketplace products and click "Chat" with any farmer!</p>
              </div>
            ) : (
              conversations.map((conv) => (
                <div
                  key={conv.partner._id}
                  onClick={() => handleSelectConversation(conv.partner)}
                  className="p-3 bg-white rounded-2xl border border-gray-100 hover:border-brand-300 hover:shadow-md cursor-pointer transition-all flex items-center space-x-3"
                >
                  <img
                    src={conv.partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'}
                    alt={conv.partner.name}
                    className="w-11 h-11 rounded-full object-cover border border-brand-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h4 className="text-xs font-bold text-gray-900 truncate">
                        {conv.partner.name}
                      </h4>
                      <span className="text-[10px] text-gray-400">
                        {new Date(conv.lastMessage.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-0.5">
                      {conv.lastMessage.content}
                    </p>
                  </div>
                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 bg-brand-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              ))
            )
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input box */}
        {activeConversationPartner && user && (
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type your message..."
              value={inputContent}
              onChange={(e) => setInputContent(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={sending || !inputContent.trim()}
              className="p-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChatDrawer;
