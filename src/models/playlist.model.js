import mongoose, { Schema } from "mongoose";

const playListSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    video: [{
      type: Schema.Types.ObjectId,
      ref: "Video",
    }],
    description: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const PlayList = mongoose.model("PlayList", playListSchema);
