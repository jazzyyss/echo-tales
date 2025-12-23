import bcrypt from "bcrypt";

const SALT = 12;

export async function hashPassword(plain: string){
  return bcrypt.hash(plain, SALT);
}

export async function verifyPassword(plain: string, hash: string){
  return bcrypt.compare(plain, hash);
}