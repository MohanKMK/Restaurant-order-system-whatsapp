import React, { useState } from 'react';
import { FaWhatsapp, FaTrash, FaPlus, FaMinus, FaInfoCircle } from 'react-icons/fa';

const OrderCart = ({ cartItems, onUpdateQuantity, onRemoveItem, onPlaceOrder, restaurantConfig }) => {
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: ''
  });

  const totalAmount = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryCharge = totalAmount >= restaurantConfig.freeDeliveryAbove ? 0 : restaurantConfig.deliveryCharge;
  const grandTotal = totalAmount + deliveryCharge;
  
  const isOrderValid = totalAmount >= restaurantConfig.minimumOrder;

  const handleInputChange = (e) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const validatePhoneNumber = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone.replace(/\D/g, ''));
  };

  const isFormValid = () => {
    return (
      customerInfo.name.trim() &&
      validatePhoneNumber(customerInfo.phone) &&
      customerInfo.address.trim() &&
      cartItems.length > 0 &&
      isOrderValid
    );
  };

  return (
    <div className="order-cart">
      <h2>Your Order <span className="cart-count">({cartItems.length} items)</span></h2>
      
      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <p>Add items from the menu to place an order</p>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item.id} className="cart-item">
                <div className="cart-item-info">
                  <h4>{item.name}</h4>
                  <p>₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</p>
                </div>
                <div className="cart-item-actions">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                    aria-label="Decrease quantity"
                  >
                    <FaMinus />
                  </button>
                  <span>{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                    aria-label="Increase quantity"
                  >
                    <FaPlus />
                  </button>
                  <button 
                    onClick={() => onRemoveItem(item.id)} 
                    className="remove-btn"
                    aria-label="Remove item"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!isOrderValid && (
            <div className="warning-banner">
              <FaInfoCircle /> Minimum order amount is ₹{restaurantConfig.minimumOrder}. 
              Add ₹{restaurantConfig.minimumOrder - totalAmount} more to place order.
            </div>
          )}

          <div className="customer-info">
            <h3>Customer Information</h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={customerInfo.name}
              onChange={handleInputChange}
              required
              aria-label="Your Name"
            />
            <input
              type="tel"
              name="phone"
              placeholder="WhatsApp Number (10 digits)"
              value={customerInfo.phone}
              onChange={handleInputChange}
              required
              pattern="[0-9]{10}"
              aria-label="WhatsApp Number"
            />
            {customerInfo.phone && !validatePhoneNumber(customerInfo.phone) && (
              <p className="error-text">Please enter a valid 10-digit phone number</p>
            )}
            <textarea
              name="address"
              placeholder="Delivery Address"
              value={customerInfo.address}
              onChange={handleInputChange}
              rows="3"
              required
              aria-label="Delivery Address"
            />
          </div>

          <div className="order-summary">
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Charge</span>
              <span>
                {deliveryCharge === 0 ? (
                  <span className="free-delivery">FREE</span>
                ) : (
                  `₹${deliveryCharge}`
                )}
              </span>
            </div>
            {totalAmount < restaurantConfig.freeDeliveryAbove && (
              <div className="summary-row info">
                <span>
                  Add ₹{restaurantConfig.freeDeliveryAbove - totalAmount} more for free delivery
                </span>
              </div>
            )}
            <div className="summary-row total">
              <span>Total Amount</span>
              <span>₹{grandTotal.toFixed(2)}</span>
            </div>
          </div>

          <button 
            className="whatsapp-order-btn"
            onClick={() => onPlaceOrder(customerInfo, cartItems)}
            disabled={!isFormValid()}
            aria-label="Send order via WhatsApp"
          >
            <FaWhatsapp /> Send Order via WhatsApp
          </button>

          {!isFormValid() && (
            <p className="validation-note">
              {!isOrderValid 
                ? `Minimum order amount is ₹${restaurantConfig.minimumOrder}`
                : 'Please fill all required fields correctly'
              }
            </p>
          )}

          <p className="order-note">
            Your order will be sent as a WhatsApp message to {restaurantConfig.name}
          </p>
        </>
      )}
    </div>
  );
};

export default OrderCart;