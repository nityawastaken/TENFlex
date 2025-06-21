// models/Project.js
import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  freelancer: String,
  amount: Number,
  message: String,
  time: String,
  isAccepted: { type: Boolean, default: false }
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  postDate: String,
  deadline: String,
  budget: Number,
  tags: [String],
  skills: [String],
  postedBy: String,
  datePosted: String,
  email: String,
  bids: [bidSchema],
  status: {
    type: String,
    enum: ["open", "in-progress", "submitted", "completed"],
    default: "open",
  },
  acceptedFreelancerEmail: String, // for reference
});


export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
