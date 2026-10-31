export interface IStudio {
  _id: string;
  title: string;
  category: string;
  studioType?: string | null;
  hourlyRate: number;
  securityDeposit: number;
  maxCapacity: number;
  location: string;
  imageUrl: string;
  amenities: string[];
  overview: string;
  ownerEmail: string;
  ownerName: string;
  rating: number;
  reviewCount: number;
  isAvailable: boolean;
  createdAt: string;
}