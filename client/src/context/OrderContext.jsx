import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_ORDERS } from '../data/mockData';

const OrderContext = createContext();

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from API
  const fetchOrders = async (customerEmail = '', vendorId = '') => {
    try {
      let url = `${API_BASE_URL}/orders?`;
      if (customerEmail) url += `customerEmail=${customerEmail}&`;
      if (vendorId) url += `vendorId=${vendorId}`;
      
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        loadLocalOrders();
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      loadLocalOrders();
    }
  };

  const loadLocalOrders = () => {
    const saved = localStorage.getItem('vendigo_orders');
    if (saved) {
      try {
        setOrders(JSON.parse(saved));
      } catch {
        setOrders(INITIAL_ORDERS);
      }
    } else {
      setOrders(INITIAL_ORDERS);
    }
  };

  useEffect(() => {
    loadLocalOrders();
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('vendigo_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const createOrder = async (orderPayload) => {
    const tempId = 'ORD-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      vendorId: orderPayload.vendorId,
      vendorName: orderPayload.vendorName,
      customerName: orderPayload.customerName,
      customerEmail: orderPayload.customerEmail,
      customerPhone: orderPayload.customerPhone,
      customerAddress: orderPayload.customerAddress,
      items: orderPayload.items,
      subtotal: orderPayload.subtotal,
      packingFee: orderPayload.packingFee,
      deliveryFee: orderPayload.deliveryFee,
      discount: orderPayload.discount || 0,
      totalAmount: orderPayload.totalAmount,
      paymentMethod: 'Cash on Delivery (COD)',
      orderStatus: 'Pending',
      createdAt: new Date().toISOString()
    };

    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newOrder)
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(prev => [data, ...prev]);
        return data;
      }
    } catch (err) {
      console.error('Failed to create order on server:', err);
    }

    // Local fallback
    const localOrder = { id: tempId, ...newOrder };
    setOrders(prev => [localOrder, ...prev]);
    return localOrder;
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (response.ok) {
        const data = await response.json();
        setOrders(prev => prev.map(o => o.id === orderId ? data : o));
        return;
      }
    } catch (err) {
      console.error('Failed to update order status on server:', err);
    }

    // Local fallback
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
  };

  const cancelOrder = async (orderId) => {
    await updateOrderStatus(orderId, 'Cancelled');
  };

  const getOrdersForCustomer = (userEmail) => {
    if (!userEmail) return orders;
    return orders.filter(o => !o.customerEmail || o.customerEmail.toLowerCase() === userEmail.toLowerCase());
  };

  const getOrdersForVendor = (vendorId) => {
    return orders.filter(o => o.vendorId === vendorId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        fetchOrders,
        createOrder,
        updateOrderStatus,
        cancelOrder,
        getOrdersForCustomer,
        getOrdersForVendor
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => useContext(OrderContext);
