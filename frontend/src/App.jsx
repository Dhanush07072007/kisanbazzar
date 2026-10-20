import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { checkAuth } from './store/authSlice';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import OrderModal from './components/OrderModal';
import ChatDrawer from './components/ChatDrawer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import FarmerDashboard from './pages/FarmerDashboard';
import ConsumerDashboard from './pages/ConsumerDashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const dispatch = useDispatch();

  // Global Interactive Modals
  const [orderModalProduct, setOrderModalProduct] = useState(null);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const [chatPartner, setChatPartner] = useState(null);
  const [chatProductContext, setChatProductContext] = useState(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  const handleOpenOrder = (product) => {
    setOrderModalProduct(product);
    setIsOrderModalOpen(true);
  };

  const handleCloseOrder = () => {
    setIsOrderModalOpen(false);
    setOrderModalProduct(null);
  };

  const handleOpenChat = (partner = null, productContext = null) => {
    setChatPartner(partner);
    setChatProductContext(productContext);
    setIsChatOpen(true);
  };

  const handleCloseChat = () => {
    setIsChatOpen(false);
    setChatPartner(null);
    setChatProductContext(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50">
      <Navbar onOpenChat={() => handleOpenChat()} />

      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                onOrderClick={handleOpenOrder}
                onMessageClick={handleOpenChat}
              />
            }
          />
          <Route
            path="/marketplace"
            element={
              <Marketplace
                onOrderClick={handleOpenOrder}
                onMessageClick={handleOpenChat}
              />
            }
          />
          <Route
            path="/product/:id"
            element={
              <ProductDetails
                onOrderClick={handleOpenOrder}
                onMessageClick={handleOpenChat}
              />
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Farmer Routes */}
          <Route
            path="/farmer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['farmer', 'admin']}>
                <FarmerDashboard onOpenChatWithUser={(user) => handleOpenChat(user)} />
              </ProtectedRoute>
            }
          />

          {/* Protected Consumer Routes */}
          <Route
            path="/consumer-dashboard"
            element={
              <ProtectedRoute allowedRoles={['consumer', 'admin']}>
                <ConsumerDashboard onOpenChatWithUser={(user) => handleOpenChat(user)} />
              </ProtectedRoute>
            }
          />

          {/* Protected Admin Routes */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* Global Interactive Overlays */}
      <OrderModal
        product={orderModalProduct}
        isOpen={isOrderModalOpen}
        onClose={handleCloseOrder}
      />

      <ChatDrawer
        isOpen={isChatOpen}
        onClose={handleCloseChat}
        initialPartner={chatPartner}
        initialProduct={chatProductContext}
      />
    </div>
  );
}

export default App;
