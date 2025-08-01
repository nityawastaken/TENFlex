import React, { useEffect, useState } from "react";
import Section from "./Section";
import axios from "axios";
import { useRouter } from "next/navigation";
import OrdersCard from "./OrdersCard";

const OrdersSection = ({
  refProp,
  orders,
  selectedStatus,
  setSelectedStatus,
  setOrders,
}) => {
  const token = localStorage.getItem("token");
  const router = useRouter();
  const sections = ["ongoing", "pending", "completed"];
  const [ordersFilter, setOrdersFilter] = useState("gig");

  const fetchOrders = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/base/buyer/orders",
      {
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    );
    // console.log("orders : ", response.data)
    setOrders(response.data);
  };

  useEffect(() => {
    if (!token) {
      router.push("/signin");
    } else {
      fetchOrders();
    }
  }, []);

  if (!orders && Object.keys(orders).length === 0) {
    return (
      <Section ref={refProp} id="orders" title="Your Orders">
        <div className="text-gray-400 text-lg py-8 w-full text-center">
          Loading orders...
        </div>
      </Section>
    );
  }

  const filteredOrders =
    orders[selectedStatus]?.filter((order) => order.type === ordersFilter) ||
    [];

  return (
    <div className="hover:scale-105 duration-300">
      <Section
        ref={refProp}
        id="orders"
        title="Your Orders"
        className="w-full max-w-screen"
      >
        <div className="mb-4 gap-4 flex flex-col md:flex-row items-center w-full">
          <select
            name="filter-orders"
            id="orders"
            value={ordersFilter}
            onChange={(e) => setOrdersFilter(e.target.value)}
            className="px-4 py-2 border cursor-pointer border-purple-700 rounded-lg h-full bg-[#24194a] text-white w-full md:w-auto focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="gig">Gigs</option>
            <option value="project">Projects</option>
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 cursor-pointer py-2 border border-purple-700 rounded-lg h-full bg-[#24194a] text-white w-full md:w-auto focus:ring-2 focus:ring-purple-400 transition"
          >
            <option value="completed">Completed</option>
            <option value="ongoing">Ongoing</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="w-full">
          <div className="w-full relative overflow-x-auto py-3 px-2 rounded-lg scrollbar-hide">
            <div className="flex flex-row gap-4 min-w-full">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, ind) => (
                  <div
                    className="flex-shrink-0 w-[320px]"
                    key={order.id || ind}
                  >
                    <OrdersCard order={order} token={token} />
                  </div>
                ))
              ) : (
                <div className="text-gray-400 text-center w-full py-8">
                  No {selectedStatus} orders.
                </div>
              )}
            </div>
          </div>
          {filteredOrders.length !== 0 && (
            <div className="w-full justify-center text-center flex mt-2">
              <p className="mx-auto text-gray-400 text-xs font-light leading-tight">
                ← Scroll horizontally to view other orders →
              </p>
            </div>
          )}
        </div>
      </Section>
    </div>
  );
};

export default OrdersSection;
