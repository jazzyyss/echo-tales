type User = {
  id: string,
  fullName: string,
  email: string
};

let accessToken: string | null = null;
let user: User | null = null

export const authStore = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },

  getUser: () => user,
  setUser: (u: User) => {
    user = u;
  },

  reset() {
    accessToken = null;
    user = null;
  },
};