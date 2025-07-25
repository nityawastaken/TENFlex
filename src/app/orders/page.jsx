"use client";

import React, { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { orderService } from "@/utils/services";
import { useUserContext } from "@/app/contexts/UserContext";
import { FaCheck, FaSpinner, FaExclamationTriangle } from "react-icons/fa";

const OrdersPage = () => {
  const { currentUser } = useUserContext();
  const [orders, setOrders] = useState({
    pending: [],
    ongoing: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [viewMode, setViewMode] = useState(
    currentUser?.is_freelancer ? "freelancer" : "buyer"
  );

  useEffect(() => {
    fetchOrders();
  }, [viewMode]);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      let ordersData;
      if (viewMode === "freelancer") {
        ordersData = await orderService.getFreelancerOrders();
      } else {
        ordersData = await orderService.getBuyerOrders();
      }
      
      setOrders(ordersData);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders(); // Refresh orders after update
    } catch (err) {
      console.error("Error updating order status:", err);
      toast.error("Failed to update order status");
    }
  };

  const handleRepeatOrder = async (orderId) => {
    try {
      await orderService.repeatOrder(orderId);
      toast.success("Order repeated successfully!");
      fetchOrders(); // Refresh orders after repeating
    } catch (err) {
      console.error("Error repeating order:", err);
      toast.error("Failed to repeat order");
    }
  };

  const renderOrderCard = (order) => {
    const isGig = order.type === "gig";
    const title = isGig ? order.gig_title : order.project_title;
    const otherParty = viewMode === "freelancer" ? order.buyer_name : order.freelancer_name;

    return (
      <div key={order.id} className="bg-gray-800 rounded-lg p-4 mb-4 shadow-md hover:shadow-lg transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-white">{title || "Untitled"}</h3>
            <p className="text-gray-300">
              {viewMode === "freelancer" ? "Client" : "Freelancer"}: {otherParty}
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Order #{order.id} • {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col items-end">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              order.status === "completed" ? "bg-green-200 text-green-800" :
              order.status === "ongoing" ? "bg-blue-200 text-blue-800" :
              "bg-yellow-200 text-yellow-800"
            }`}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
            <p className="text-gray-300 mt-2">
              Type: {order.type.charAt(0).toUpperCase() + order.type.slice(1)}
            </p>
          </div>
        </div>
        
        {/* Action buttons based on role and status */}
        <div className="mt-4 flex flex-wrap gap-2">
          {viewMode === "freelancer" && order.status === "pending" && (
            <button
              onClick={() => handleUpdateStatus(order.id, "ongoing")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <FaSpinner className="text-xs" /> Start Working
            </button>
          )}
          
          {viewMode === "freelancer" && order.status === "ongoing" && (
            <button
              onClick={() => handleUpdateStatus(order.id, "completed")}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
            >
              <FaCheck className="text-xs" /> Mark Complete
            </button>
          )}
          
          {viewMode === "buyer" && order.status === "completed" && (
            <button
              onClick={() => handleRepeatOrder(order.id)}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-sm"
            >
              Repeat Order
            </button>
          )}
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Authentication Required</h2>
          <p>Please sign in to view your orders.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white pt-24 px-4 sm:px-6 lg:px-8">
      <ToastContainer position="bottom-right" theme="dark" />
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <h1 className="text-3xl font-bold mb-4 sm:mb-0">My Orders</h1>
          
          {/* View toggle */}
          {currentUser.is_freelancer && (
            <div className="bg-gray-800 p-1 rounded-lg">
              <button
                className={`px-4 py-2 rounded-md ${
                  viewMode === "freelancer"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setViewMode("freelancer")}
              >
                As Freelancer
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  viewMode === "buyer"
                    ? "bg-purple-600 text-white"
                    : "text-gray-300 hover:text-white"
                }`}
                onClick={() => setViewMode("buyer")}
              >
                As Buyer
              </button>
            </div>
          )}
        </div>
        
        {/* Status tabs */}
        <div className="border-b border-gray-700 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("pending")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "pending"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Pending ({orders.pending?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("ongoing")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "ongoing"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Ongoing ({orders.ongoing?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab("completed")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "completed"
                  ? "border-purple-500 text-purple-400"
                  : "border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300"
              }`}
            >
              Completed ({orders.completed?.length || 0})
            </button>
          </nav>
        </div>
        
        {/* Orders content */}
        <div className="py-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <FaSpinner className="animate-spin text-4xl text-purple-500" />
            </div>
          ) : error ? (
            <div className="bg-red-900/30 border border-red-500 rounded-lg p-4 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          ) : orders[activeTab]?.length > 0 ? (
            orders[activeTab].map(renderOrderCard)
          ) : (
            <div className="text-center py-20 text-gray-400">
              <p className="text-xl mb-2">No {activeTab} orders found</p>
              <p className="text-sm">
                {activeTab === "pending"
                  ? "New orders will appear here."
                  : activeTab === "ongoing"
                  ? "Orders in progress will appear here."
                  : "Completed orders will appear here."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersPage; 