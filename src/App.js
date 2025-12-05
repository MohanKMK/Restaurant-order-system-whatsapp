import React, { useState } from 'react';
import { FaUtensils, FaPhoneAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
import MenuSection from './components/MenuSection';
import OrderCart from './components/OrderCart';
import WhatsAppOrder from './components/WhatsAppOrder';
import { menuData } from './data/menuData';
import './App.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Environment variables with fallbacks
  const restaurantConfig = {
    name: process.env.REACT_APP_RESTAURANT_NAME || "Spice Palace Restaurant",
    phone: process.env.REACT_APP_RESTAURANT_PHONE || "+91 98765 43210",
    address: process.env.REACT_APP_RESTAURANT_ADDRESS || "123 Food Street, Mumbai",
    hours: process.env.REACT_APP_RESTAURANT_HOURS || "8:00 AM - 11:00 PM",
    whatsappNumber: process.env.REACT_APP_WHATSAPP_NUMBER || "919876543210",
    minimumOrder: parseInt(process.env.REACT_APP_MINIMUM_ORDER) || 100,
    deliveryCharge: parseInt(process.env.REACT_APP_DELIVERY_CHARGE) || 30,
    freeDeliveryAbove: parseInt(process.env.REACT_APP_FREE_DELIVERY_ABOVE) || 300
  };

  const addToCart = (item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  };

  const handlePlaceOrder = (customerInfo, items) => {
    setCurrentOrder({ customerInfo, cartItems: items, config: restaurantConfig });
    setShowWhatsAppModal(true);
  };

  const closeWhatsAppModal = () => {
    setShowWhatsAppModal(false);
    setCartItems([]); // Clear cart after order
  };

  return (
    <div className="App">
      {/* Header */}
      <header className="header">
        <div className="header-content">
          <div className="restaurant-info">
            <FaUtensils className="restaurant-icon" />
            <div>
              <h1>{restaurantConfig.name}</h1>
              <p className="tagline">Taste the Royal Indian Cuisine</p>
            </div>
          </div>
          <div className="contact-info">
            <p><FaPhoneAlt /> {restaurantConfig.phone}</p>
            <p><FaMapMarkerAlt /> {restaurantConfig.address}</p>
            <p><FaClock /> {restaurantConfig.hours}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="menu-container">
          {/* Breakfast Section */}
          <MenuSection
            title="Breakfast"
            items={menuData.breakfast}
            onAddToCart={addToCart}
          />

          {/* Lunch Section */}
          <MenuSection
            title="Lunch"
            items={menuData.lunch}
            onAddToCart={addToCart}
          />

          {/* Dinner Section */}
          <MenuSection
            title="Dinner"
            items={menuData.dinner}
            onAddToCart={addToCart}
          />
        </div>

        {/* Order Cart */}
        <div className="order-container">
          <OrderCart
            cartItems={cartItems}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeItem}
            onPlaceOrder={handlePlaceOrder}
            restaurantConfig={restaurantConfig}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>© {new Date().getFullYear()} {restaurantConfig.name}. All rights reserved.</p>
        <p>Order online or call {restaurantConfig.phone}</p>
      </footer>

      {/* WhatsApp Order Modal */}
      {showWhatsAppModal && currentOrder && (
        <WhatsAppOrder
          order={currentOrder}
          onClose={closeWhatsAppModal}
          restaurantConfig={restaurantConfig}
        />
      )}
    </div>
  );
}

export default App;