import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());

const redis = new Redis(
  process.env.REDIS_URL || "redis://localhost:6379"
);

const BANNER_KEY = "app:banner";

app.post("/banner", async (req, res) => {
  await redis.set(BANNER_KEY, req.body.message);
  res.json({ message: "Banner message set successfully" });
});

redis.get(BANNER_KEY).then((message) => {
  if (message) {
    console.log(`Current banner message: ${message}`);    
  } else {
    console.log("No banner message set");
  }   
});
app.delete("/banner", async (req, res) => {
  await redis.del(BANNER_KEY);
  res.json({ message: "Banner message deleted successfully" });
}       );

app.get("/banner/exists", async (req, res) => {
  const exists = await redis.exists(BANNER_KEY);
  res.json({ exists:Boolean(exists)   });
});



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});