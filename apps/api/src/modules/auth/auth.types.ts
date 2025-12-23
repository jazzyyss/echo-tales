export type AuthResponse = {
  user: {
    id: string;
    fullName: string;
    email: string;
    createdAt: Date;
    updatedAt: Date;
  };
  accessToken: string;
};