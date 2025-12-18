import app from "./app.js";

const PORT = process.env.PORT || 4000;

(async () => {
    try{
      app.listen(PORT, _ => {
        console.log(`Server running on port ${PORT}`);
      });
    }catch(err){
      console.log("startup failed. ", err)
    }
})();