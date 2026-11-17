import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();

  // Per-user localStorage keys — each user gets their own cart
  const cartKey = user?.id ? `vendigo_cart_${user.id}` : null;
  const vendorKey = user?.id ? `vendigo_cart_vendor_${user.id}` : null;

  const [cartItems, setCartItems] = useState([]);
  const [activeVendor, setActiveVendor] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [vendorMismatchModal, setVendorMismatchModal] = useState(null);

  // Load this user's cart from localStorage when user changes (login/switch account)
  useEffect(() => {
    if (!cartKey) {
      // No user logged in — clear cart from memory
      setCartItems([]);
      setActiveVendor(null);
      return;
    }
    const savedCart = localStorage.getItem(cartKey);
    const savedVendor = localStorage.getItem(vendorKey);
    setCartItems(savedCart ? JSON.parse(savedCart) : []);
    setActiveVendor(savedVendor ? JSON.parse(savedVendor) : null);
  }, [cartKey]);

  // Persist cart to this user's localStorage key whenever it changes
  useEffect(() => {
    if (!cartKey) return;
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
    if (cartItems.length === 0) {
      setActiveVendor(null);
      localStorage.removeItem(vendorKey);
    } else if (activeVendor) {
      localStorage.setItem(vendorKey, JSON.stringify(activeVendor));
    }
  }, [cartItems, activeVendor, cartKey]);

  const addToCart = (item, vendor) => {
    // If cart has items from another vendor, warn user
    if (cartItems.length > 0 && activeVendor && activeVendor.id !== vendor.id) {
      setVendorMismatchModal({ item, vendor });
      return;
    }

    if (!activeVendor) {
      setActiveVendor(vendor);
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1, vendorId: vendor.id, vendorName: vendor.name }];
    });
  };

  const confirmVendorSwitch = () => {
    if (vendorMismatchModal) {
      const { item, vendor } = vendorMismatchModal;
      setCartItems([{ ...item, quantity: 1, vendorId: vendor.id, vendorName: vendor.name }]);
      setActiveVendor(vendor);
      setVendorMismatchModal(null);
    }
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
  };

  const updateQuantity = (itemId, newQty) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev => prev.map(item => item.id === itemId ? { ...item, quantity: newQty } : item));
  };

  const clearCart = () => {
    setCartItems([]);
    setActiveVendor(null);
    if (cartKey) localStorage.removeItem(cartKey);
    if (vendorKey) localStorage.removeItem(vendorKey);
  };

  const getItemQuantity = (itemId) => {
    const found = cartItems.find(i => i.id === itemId);
    return found ? found.quantity : 0;
  };

  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
  const packingFee = cartItems.length > 0 ? 15 : 0;
  const deliveryFee = cartItems.length > 0 ? 20 : 0;
  const totalAmount = subtotal + packingFee + deliveryFee;
  const totalCount = cartItems.reduce((acc, curr) => acc + curr.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        activeVendor,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getItemQuantity,
        subtotal,
        packingFee,
        deliveryFee,
        totalAmount,
        totalCount,
        isCartOpen,
        setIsCartOpen,
        vendorMismatchModal,
        setVendorMismatchModal,
        confirmVendorSwitch
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);


