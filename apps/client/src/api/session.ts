/* import { http } from "./http";
import { authStore } from "../auth/authStore";
import { getMe } from "./auth";

export async function bootstrapAuth(){
  try{
    const res = await http.post("/auth/refresh");
    const accessToken = (res.data as any)?.accessToken as string | undefined;

    if(!accessToken) throw new Error("Refresh did not return access token.");
    authStore.setAccessToken(accessToken);

    const me = await getMe();
    return { accessToken, me }

  }catch{
    authStore.reset();
    return null;
  }
} */