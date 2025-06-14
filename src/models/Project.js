// models/Project.js
import mongoose from "mongoose";

const bidSchema = new mongoose.Schema({
  name: String,
  amount: Number,
  time: String,
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
  email: String, // ✅ add this
  datePosted: String,
  bids: [bidSchema],
});


export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
