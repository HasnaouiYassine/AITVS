import mongoose, { Document, Schema } from "mongoose";

interface Corner {
  x: number;
  y: number;
}

export interface IProjectDocument extends Document {
  userId: string;
  roomImageUrl: string;
  tileId: mongoose.Types.ObjectId;
  resultImageUrl: string;
  floorCorners: Corner[];
  floorMaskUrl?: string;
  createdAt: Date;
}

const CornerSchema = new Schema<Corner>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false },
);

const ProjectSchema = new Schema<IProjectDocument>(
  {
    userId: { type: String, required: true, index: true },
    roomImageUrl: { type: String, required: true },
    tileId: { type: Schema.Types.ObjectId, ref: "Tile", required: true },
    resultImageUrl: { type: String, required: true },
    floorCorners: { type: [CornerSchema], required: true },
    floorMaskUrl: { type: String },
  },
  { timestamps: true },
);

export default mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);
