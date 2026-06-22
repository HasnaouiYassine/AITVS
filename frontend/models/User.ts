import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUserDocument extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "client" | "user";
  createdAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUserDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, select: false },
    role: { type: String, enum: ["admin", "client", "user"], default: "user" },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function hashPassword() {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

UserSchema.methods.comparePassword = async function comparePassword(candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);
