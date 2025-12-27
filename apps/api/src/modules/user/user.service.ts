import { UserModel } from "./user.model.js";

export async function authCheck(id: string){
  const user = await UserModel.findById(id).select("-password");
  return user;
}