import axios from "axios";
import React from "react";
// import SuccessAlert from "../components/SuccessAlert";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  // Add more statuses as needed
};

const OrdersCard = ({ order }) => {
  const token = localStorage.getItem("token");
  const handleRepeat = async () => {
    try {
      const res = await axios.post(
        process.env.NEXT_PUBLIC_API_URL + `/base/orders/${order.id}/repeat/`,{},
        { headers: { Authorization: `Token ${token}` } }
      );
      // console.log("order repeat : ", res.data);
      if(res.status === 200){
        // <SuccessAlert />
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="sm:w-[26vw] rounded-lg bg-gradient-to-br from-[#24194a] via-[#1a0d2b] to-[#28163a] shadow-lg p-2 mb-4 transition hover:shadow-lg min-w-[26vw] max-w-[400px] relative hover:border-b hover:border-r   justify-between flex gap-2">
      <div className=" ">
        <div>
          {order.type === "project" ? (
            <div>
              <div className=" gap-2 flex flex-col">
                <div className=" mb-2  mt-5 ">
                  <h3 className="text-sm font-semibold break-words">
                    Project: {order.project_title || "Untitled Order"}
                  </h3>
                </div>
                <div>
                  <h6 className="text-sm">Order Placed: </h6>
                  <h6 className="text-sm">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "-"}
                  </h6>
                </div>
                <div>
                  <h6 className="text-sm">Freelancer: </h6>
                  <h6 className="text-sm">{order.freelancer_name}</h6>
                </div>
                <div>
                  <h6 className="text-sm ">Price</h6>
                  <h6 className="text-sm text-green-500">${order?.price || "N/A"}</h6>
                </div>
                <div>
                  <h6 className="text-sm ">Deadline</h6>
                  <h6 className="text-sm ">${order?.deadline || "N/A"}</h6>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className=" gap-2 flex flex-col">
                <div className="mb-2 mt-5">
                  <h3 className="text-sm font-semibold break-words">
                    Gig: {order.gig_title || "Untitled Order"}
                  </h3>
                </div>
                <div>
                  <h6 className="text-sm">Order Placed: </h6>
                  <h6 className="text-sm">
                    {order.created_at
                      ? new Date(order.created_at).toLocaleDateString()
                      : "-"}
                  </h6>
                </div>
                <div>
                  <h6 className="text-sm">Freelancer: </h6>
                  <h6 className="text-sm">{order.freelancer_name}</h6>
                </div>
                <div>
                  <h6 className="text-sm ">Price</h6>
                  <h6 className="text-sm text-green-500">${order?.price || "N/A"}</h6>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className=" px-1 py-1 ">
        <div className="  top-1 right-1 flex gap-3 flex-col">
          {order.status === "completed" && (
            <button
              className="text-sm font-semibold text-white px-2 py-1 rounded-xl bg-purple-700 cursor-pointer hover:-translate-y-0.5 duration-150  "
              onClick={handleRepeat}
            >
              Repeat
            </button>
          )}
          {order.type === "project" ? (
            <button className="text-sm font-semibold cursor-pointer  text-white px-2 py-1 rounded-xl bg-pink-400">
              {" "}
              Project
            </button>
          ) : (
            <button className="text-sm font-semibold cursor-pointer  text-white px-2 py-1 rounded-xl bg-purple-400 top-1 right-1 flex">
              Gig
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersCard;

{
  /*  */
}
