import mongoose, { Document, Schema } from "mongoose";

export interface ITileDocument extends Document {
  name: string;
  category: "ceramic" | "marble" | "wood" | "mosaic" | "stone";
  imageUrl: string;
  dimensions: string;
  priceRange: string;
  clientId?: string;
  active: boolean;
  createdAt: Date;
}

const TileSchema = new Schema<ITileDocument>(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, enum: ["ceramic", "marble", "wood", "mosaic", "stone"], required: true },
    imageUrl: { type: String, required: true },
    dimensions: { type: String, required: true },
    priceRange: { type: String, required: true },
    clientId: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.models.Tile || mongoose.model<ITileDocument>("Tile", TileSchema);
