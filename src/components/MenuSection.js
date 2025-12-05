import React from 'react';
import { FaLeaf, FaEgg } from 'react-icons/fa';

const MenuItem = ({ item, onAddToCart }) => {
  return (
    <div className="menu-item">
      <div className="menu-item-header">
        <div className="menu-item-name">
          <h4>{item.name}</h4>
          <span className="veg-indicator">
            {item.veg ? <FaLeaf style={{ color: 'green' }} /> : <FaEgg style={{ color: 'red' }} />}
          </span>
        </div>
        <div className="menu-item-price">₹{item.price}</div>
      </div>
      <p className="menu-item-desc">{item.description}</p>
      <button 
        onClick={() => onAddToCart(item)}
        className="add-to-cart-btn"
      >
        Add to Order
      </button>
    </div>
  );
};

const MenuSection = ({ title, items, onAddToCart }) => {
  return (
    <div className="menu-section">
      <h2 className="section-title">{title}</h2>
      <div className="menu-items-grid">
        {items.map(item => (
          <MenuItem key={item.id} item={item} onAddToCart={onAddToCart} />
        ))}
      </div>
    </div>
  );
};

export default MenuSection;