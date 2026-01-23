export type Tale = {
  id: string;
  title: string;
  story: string;
  visitedLocation: string[];
  visitedDate: string; // ISO string
  isFav: boolean;
  imgUrls: string[];
};
