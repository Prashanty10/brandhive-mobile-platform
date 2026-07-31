import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import connectDB from "./Config/Database.js";
import userRoutes from "./Routes/userRoute.js";
import router from "./Routes/userRoute.js";
import bannerrouter from "./Routes/bannerRoute.js";
import popularAdsrouter from "./Routes/popularAdsRoute.js";
import adspace_router from "./Routes/adspaceRoutes.js";
dotenv.config();

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/auth",router)
app.use("/banner",bannerrouter)
app.use("/popularAds", popularAdsrouter)
app.use("/adspaces",adspace_router)
const port = process.env.PORT;

app.use((req, res) => {
  res.status(404).json({
    sucess: false,
    message: "route does not exist",
  });
});

app.use((err, req, res, next) => {
  console.log("server error", err.message);

  res.status(err.status || 500).json({
    success: false,
    message: "server error",
  });
});


const startserver = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`server running on http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startserver();
