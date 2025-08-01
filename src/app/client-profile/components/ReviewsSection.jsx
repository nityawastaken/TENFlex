import React, { useEffect } from "react";
import Section from "./Section";
import axios from "axios";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import ReviewCard from "./ReviewCard";
import { FaRegStar } from "react-icons/fa6";

const ReviewsSection = ({ refProp, reviews, setReviews }) => {
  const user = useSelector((state) => state.user);
  const token = localStorage.getItem("token");
  const router = useRouter();

  const id = user.currentUser.id;
  const fetchReviews = async () => {
    const response = await axios.get(
      process.env.NEXT_PUBLIC_API_URL + "/base/reviews/?reviewer_id=" + id
    );
    // console.log("reviews : ", response.data)
    setReviews(response.data);
  };

  useEffect(() => {
    if (!token && !user) {
      router.push("/signin");
    } else {
      fetchReviews();
    }
  }, []);

  return (
    <div className="hover:scale-105 duration-300">
    <Section ref={refProp} id="reviews" title="Your Reviews">
      {reviews.length === 0 ? (
        <div className="text-gray-400 text-center py-8">
          <FaRegStar className="mx-auto text-4xl mb-2 text-yellow-400" />
          <div className="text-lg font-medium">
            You haven't posted any reviews yet.
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto">
          {reviews.map((r) => (
            <ReviewCard key={r.id} r={r} />
          ))}
        </div>
      )}
    </Section>
    </div>
  );
};

export default ReviewsSection;
