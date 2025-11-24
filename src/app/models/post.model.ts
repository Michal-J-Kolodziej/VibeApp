export interface Post {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  lat: number;
  lng: number;
  createdAt: Date;
  userId?: string;
  authorName?: string;
}
