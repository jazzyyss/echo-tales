import express from "Express";
const app = express();

const PORT = 4000;

(async () => {

  app.listen(PORT, _ => {
    console.log(`Server running on port ${PORT}`);
  });
})();