import useFetchUserByUsername from "@/Hooks/useFetchUserByUsername";
import axios from "axios";
import { useRouter } from "next/navigation";
import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrdersCard = ({ order }) => {
  const token = localStorage.getItem("token");
  const router = useRouter();

  //repeat gig order
  const handleRepeat = async () => {
    const now = new Date();
    const body = {
      buyer: order.buyer_id,
      status: "pending",
      created_at: now.toISOString(),
    };
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/base/orders/${order.id}/repeat/`,
        { body },
        { headers: { Authorization: `Token ${token}` } }
      );
      // console.log("order repeat : ", res.data);
      if (res.status === 201) {
        toast.success("Repeat Order Success.");
      }
    } catch (err) {
      console.log(err);
      toast.error("Repeat Order Failed!");
    }
  };

  const fetchUser = useFetchUserByUsername();

  const handleOpenProfile = async (userName) => {
    const userProfile = await fetchUser(userName);
    if (userProfile) {
      const { id, is_freelancer } = userProfile;
      const path = is_freelancer ? `/profile/${id}/` : `/client-profile/${id}/`;
      router.push(path);
    } else {
      // Show error to user, or handle accordingly
      console.log("User not found");
    }
  };

  return (
    <div className="w-[320px] rounded-2xl bg-gradient-to-br from-[#2a1e54] via-[#1a0d2b] to-[#3a1e4f] shadow-xl p-4 sm:p-5 mb-5 relative flex flex-col gap-3 overflow-hidden border border-transparent hover:border- hover:shadow-purple-800/30 hover:-translate-y-1 transition-all duration-300 ease-out ">
      <ToastContainer position="bottom-right" autoClose={3000} />
      <div>
        <div>
          {order.type === "project" ? (
            <div>
              <div className="gap-2 flex flex-col">
                <div className="mb-2 mt-5">
                  <h3
                    className="text-sm font-semibold break-all overflow-hidden text-ellipsis whitespace-nowrap max-w-full sm:max-w-[220px] md:max-w-[300px]"
                    title={order.project_title || "Untitled Order"}
                  >
                    Project: {order.project_title || "Untitled Order"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Order Placed:</h6>
                  <h6 className="text-sm">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "N/A"}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Freelancer:</h6>
                  <h6
                    onClick={() => handleOpenProfile(order?.freelancer_name)}
                    className="text-sm cursor-pointer hover:underline hover:scale-95 hover:text-purple-500 duration-300"
                  >
                    {order.freelancer_name}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Price</h6>
                  <h6 className="text-sm text-green-500">
                    ₹{order?.price || "N/A"}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Deadline</h6>
                  <h6 className="text-sm">
                    {order?.deadline
                      ? new Date(order?.deadline).toLocaleDateString()
                      : "N/A"}
                  </h6>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="gap-2 flex flex-col">
                <div className="mb-2 mt-5">
                  <h3
                    className="text-sm font-semibold break-all overflow-hidden text-ellipsis whitespace-nowrap max-w-full sm:max-w-[220px] md:max-w-[300px]"
                    title={order.gig_title || "Untitled Order"}
                  >
                    Gig: {order.gig_title || "Untitled Order"}
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Order Placed:</h6>
                  <h6 className="text-sm">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "-"}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Freelancer:</h6>
                  <h6
                    onClick={() => handleOpenProfile(order?.freelancer_name)}
                    className="text-sm cursor-pointer hover:underline hover:scale-95 hover:text-purple-500 duration-300"
                  >
                    {order.freelancer_name}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Price</h6>
                  <h6 className="text-sm text-green-500">
                    ₹{order?.price || "N/A"}
                  </h6>
                </div>
                <div className="flex flex-wrap gap-2">
                  <h6 className="text-sm">Deadline</h6>
                  <h6 className="text-sm">
                    {order?.deadline
                      ? new Date(order?.deadline).toLocaleDateString()
                      : "N/A"}
                  </h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="px-1 py-1">
        <div className="top-1 right-1 flex gap-2 flex-wrap">
          {order.status === "completed" && (
            <button
              className="text-sm font-semibold text-white px-2 py-1 rounded-xl bg-purple-700 cursor-pointer hover:-translate-y-0.5 duration-150 w-full sm:w-auto"
              onClick={handleRepeat}
            >
              Repeat
            </button>
          )}
          {order.type === "project" ? (
            <button className="text-sm font-semibold cursor-pointer text-white px-2 py-1 rounded-xl bg-pink-400 w-full sm:w-auto">
              Project
            </button>
          ) : (
            <button className="text-sm font-semibold cursor-pointer text-white px-2 py-1 rounded-xl bg-purple-400 w-full sm:w-auto">
              Gig
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;
