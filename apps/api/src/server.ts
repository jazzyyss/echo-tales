import app from "./app.js";
import { env } from "../src/config/env.js";
import { connectDB } from "./config/db.js";

const PORT = env.PORT || 4000;

(async () => {
    try{
      await connectDB();
      app.listen(PORT, _ => {
        console.log(`Server running on port ${PORT}`);
      });
    }catch(err){
      console.log("startup failed. ", err)
    }
})();