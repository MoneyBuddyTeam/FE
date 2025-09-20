export interface MonthlyExpert {
  id: number;
  rank: number;
  nickname: string;
  description: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  imgUrl: string;
  isLiked?: boolean;
}
