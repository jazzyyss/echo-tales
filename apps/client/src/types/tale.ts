export type Tale = {
  id: string;
  owner: {
    _id: string,
    fullName: string,
    username: string
  }
  title: string;
  story: string;
  visitedLocation: string[];
  visitedDate: string; // ISO string
  isFav: boolean;
  imgUrls: string[];
};

