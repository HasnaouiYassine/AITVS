import type { IProject, ITile, IUser } from "@/types";

export const tiles: ITile[] = [
  {
    _id: "tile-1",
    name: "Carrara Gold Porcelain",
    category: "marble",
    imageUrl:
      "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=80",
    dimensions: "24 x 48 in",
    priceRange: "$$$",
    active: true,
    createdAt: "2026-06-01T09:00:00.000Z",
  },
  {
    _id: "tile-2",
    name: "Ash Oak Plank",
    category: "wood",
    imageUrl:
      "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=900&q=80",
    dimensions: "8 x 48 in",
    priceRange: "$$",
    active: true,
    createdAt: "2026-06-02T09:00:00.000Z",
  },
  {
    _id: "tile-3",
    name: "Basalt Stone Matte",
    category: "stone",
    imageUrl:
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=900&q=80",
    dimensions: "18 x 36 in",
    priceRange: "$$$",
    active: true,
    createdAt: "2026-06-03T09:00:00.000Z",
  },
  {
    _id: "tile-4",
    name: "Zellige Ivory Mosaic",
    category: "mosaic",
    imageUrl:
      "https://images.unsplash.com/photo-1604014237800-1c9102c219da?auto=format&fit=crop&w=900&q=80",
    dimensions: "2 x 6 in",
    priceRange: "$$",
    active: true,
    createdAt: "2026-06-04T09:00:00.000Z",
  },
  {
    _id: "tile-5",
    name: "Graphite Ceramic Grid",
    category: "ceramic",
    imageUrl:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    dimensions: "12 x 12 in",
    priceRange: "$",
    active: true,
    createdAt: "2026-06-05T09:00:00.000Z",
  },
  {
    _id: "tile-6",
    name: "Calacatta Mist",
    category: "marble",
    imageUrl:
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80",
    dimensions: "30 x 30 in",
    priceRange: "$$$",
    active: true,
    createdAt: "2026-06-06T09:00:00.000Z",
  },
];

export const projects: IProject[] = [
  {
    _id: "project-1",
    userId: "user-1",
    roomImageUrl:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=80",
    tileId: tiles[0],
    resultImageUrl:
      "https://images.unsplash.com/photo-1600607687644-c7171b42498b?auto=format&fit=crop&w=1200&q=80",
    floorCorners: [
      { x: 18, y: 70 },
      { x: 82, y: 70 },
      { x: 94, y: 96 },
      { x: 4, y: 96 },
    ],
    createdAt: "2026-06-20T12:15:00.000Z",
  },
  {
    _id: "project-2",
    userId: "user-1",
    roomImageUrl:
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1200&q=80",
    tileId: tiles[1],
    resultImageUrl:
      "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=80",
    floorCorners: [
      { x: 15, y: 68 },
      { x: 84, y: 68 },
      { x: 96, y: 98 },
      { x: 2, y: 98 },
    ],
    createdAt: "2026-06-18T15:30:00.000Z",
  },
  {
    _id: "project-3",
    userId: "user-1",
    roomImageUrl:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    tileId: tiles[3],
    resultImageUrl:
      "https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1200&q=80",
    floorCorners: [
      { x: 16, y: 72 },
      { x: 86, y: 72 },
      { x: 96, y: 97 },
      { x: 3, y: 97 },
    ],
    createdAt: "2026-06-15T08:20:00.000Z",
  },
];

export const users: IUser[] = [
  {
    _id: "user-1",
    name: "Maya Hart",
    email: "maya@tilevision.ai",
    role: "admin",
    createdAt: "2026-05-18T10:00:00.000Z",
  },
  {
    _id: "user-2",
    name: "Northline Tiles",
    email: "ops@northlinetiles.com",
    role: "client",
    createdAt: "2026-05-21T10:00:00.000Z",
  },
  {
    _id: "user-3",
    name: "Elena Brooks",
    email: "elena@example.com",
    role: "user",
    createdAt: "2026-06-02T10:00:00.000Z",
  },
];

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(
    new Date(value),
  );
