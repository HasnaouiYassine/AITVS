export type UserRole = "admin" | "client" | "user";

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface ITile {
  _id: string;
  name: string;
  category: "ceramic" | "marble" | "wood" | "mosaic" | "stone";
  imageUrl: string;
  dimensions: string;
  priceRange: string;
  clientId?: string;
  active: boolean;
  createdAt: string;
}

export interface ICorner {
  x: number;
  y: number;
}

export interface IProject {
  _id: string;
  userId: string;
  roomImageUrl: string;
  tileId: ITile;
  resultImageUrl: string;
  floorCorners: ICorner[];
  floorMaskUrl?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export type VisualizationStep =
  | "upload"
  | "floor-select"
  | "select-tile"
  | "generating"
  | "result";
