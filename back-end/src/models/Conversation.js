import mongoose from "mongoose";

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }],
    listingId: { type: mongoose.Schema.Types.ObjectId, ref: "Listing", default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Conversation", ConversationSchema);
