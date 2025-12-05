import React, { useState } from 'react';
import { FaWhatsapp, FaCheck, FaSpinner, FaExclamationTriangle } from 'react-icons/fa';

const WhatsAppOrder = ({ order, onClose, restaurantConfig }) => {
  const [orderSent, setOrderSent] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState(null);

  const formatOrderMessage = (orderDetails, cartItems) => {
    const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = totalAmount >= restaurantConfig.freeDeliveryAbove 
      ? 0 
      : restaurantConfig.deliveryCharge;
    const grandTotal = totalAmount + deliveryCharge;

    let message = `*🍽️ NEW ORDER - ${restaurantConfig.name}*\n\n`;
    message += `*📋 Order Details:*\n`;
    
    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}\n`;
      message += `   Qty: ${item.quantity} × ₹${item.price} = ₹${item.price * item.quantity}\n`;
      if (item.description) {
        message += `   (${item.description})\n`;
      }
      message += `\n`;
    });
    
    message += `*💰 Payment Summary:*\n`;
    message += `Subtotal: ₹${totalAmount}\n`;
    message += `Delivery: ${deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}\n`;
    message += `*Total: ₹${grandTotal}*\n\n`;
    
    message += `*👤 Customer Information:*\n`;
    message += `Name: ${orderDetails.name}\n`;
    message += `Phone: ${orderDetails.phone}\n`;
    message += `Address: ${orderDetails.address}\n\n`;
    
    message += `*⏰ Order Time:* ${new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata'
    })}\n`;
    message += `*🆔 Order ID:* ${Date.now().toString().slice(-6)}\n\n`;
    message += `_This order was placed via online ordering system_`;
    
    return encodeURIComponent(message);
  };

  const validateWhatsAppNumber = (number) => {
    // Remove any non-digit characters
    const cleanNumber = number.replace(/\D/g, '');
    
    // Check if number starts with country code
    if (cleanNumber.startsWith('91')) {
      return cleanNumber;
    }
    
    // If number starts with 0, remove it and add 91
    if (cleanNumber.startsWith('0')) {
      return '91' + cleanNumber.slice(1);
    }
    
    // If number is 10 digits, add 91
    if (cleanNumber.length === 10) {
      return '91' + cleanNumber;
    }
    
    return cleanNumber;
  };

  const handleSendOrder = async () => {
    setIsSending(true);
    setError(null);

    try {
      // Get WhatsApp number from environment variables
      const whatsappNumber = restaurantConfig.whatsappNumber || process.env.REACT_APP_WHATSAPP_NUMBER;
      
      if (!whatsappNumber) {
        throw new Error('Restaurant WhatsApp number not configured');
      }

      const formattedNumber = validateWhatsAppNumber(whatsappNumber);
      const message = formatOrderMessage(order.customerInfo, order.cartItems);
      
      // WhatsApp API URL
      const whatsappURL = `https://wa.me/${formattedNumber}?text=${message}`;
      
      // Open WhatsApp in new tab
      const newWindow = window.open(whatsappURL, '_blank', 'noopener,noreferrer');
      
      if (!newWindow) {
        throw new Error('Popup blocked! Please allow popups for this site.');
      }

      // Save order to localStorage for history
      const orderHistory = JSON.parse(localStorage.getItem('orderHistory') || '[]');
      const orderData = {
        id: Date.now(),
        customerName: order.customerInfo.name,
        customerPhone: order.customerInfo.phone,
        items: order.cartItems,
        total: order.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0),
        timestamp: new Date().toISOString(),
        status: 'sent'
      };
      orderHistory.unshift(orderData);
      localStorage.setItem('orderHistory', JSON.stringify(orderHistory.slice(0, 10))); // Keep last 10 orders

      setIsSending(false);
      setOrderSent(true);

      // Auto-close after 5 seconds
      setTimeout(() => {
        onClose();
      }, 5000);

    } catch (err) {
      console.error('Error sending order:', err);
      setError(err.message);
      setIsSending(false);
    }
  };

  return (
    <div className="whatsapp-modal">
      <div className="modal-content">
        {!orderSent ? (
          <>
            <div className="modal-header">
              <FaWhatsapp className="whatsapp-icon" />
              <h2>Confirm & Send Order</h2>
              <p className="modal-subtitle">Your order will be sent to {restaurantConfig.name}</p>
            </div>
            
            {error && (
              <div className="error-alert">
                <FaExclamationTriangle /> {error}
              </div>
            )}
            
            <div className="order-preview">
              <h3>📋 Order Summary</h3>
              <div className="preview-section">
                <strong>Customer Details:</strong>
                <p>👤 {order.customerInfo.name}</p>
                <p>📞 {order.customerInfo.phone}</p>
                <p>📍 {order.customerInfo.address}</p>
              </div>
              
              <div className="preview-section">
                <strong>Order Items ({order.cartItems.length}):</strong>
                {order.cartItems.map((item, index) => (
                  <div key={item.id} className="preview-item">
                    <span>{index + 1}. {item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
              
              <div className="preview-section total-section">
                <strong>Total Amount:</strong>
                <p className="preview-total">
                  ₹{order.cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)}
                </p>
              </div>
            </div>
            
            <div className="modal-buttons">
              <button 
                onClick={onClose} 
                className="cancel-btn"
                disabled={isSending}
              >
                Cancel
              </button>
              <button 
                onClick={handleSendOrder} 
                className="send-btn"
                disabled={isSending}
              >
                {isSending ? (
                  <>
                    <FaSpinner className="spinner" /> Sending...
                  </>
                ) : (
                  <>
                    <FaWhatsapp /> Send via WhatsApp
                  </>
                )}
              </button>
            </div>
            
            <p className="security-note">
              🔒 Your information is secure. We only share your details with {restaurantConfig.name}.
            </p>
          </>
        ) : (
          <div className="success-message">
            <FaCheck className="success-icon" />
            <h2>Order Sent Successfully! 🎉</h2>
            <div className="success-details">
              <p>✅ Your order has been sent to {restaurantConfig.name}</p>
              <p>📱 WhatsApp window opened with your order details</p>
              <p>⏳ You will receive a confirmation call shortly</p>
              <p>🆔 Order ID: {Date.now().toString().slice(-6)}</p>
            </div>
            <button onClick={onClose} className="close-btn">
              Close & Continue Shopping
            </button>
            <p className="success-tip">
              Tip: Keep your phone handy for order confirmation!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WhatsAppOrder;