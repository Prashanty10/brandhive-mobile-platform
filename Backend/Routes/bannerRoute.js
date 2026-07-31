import express from "express";
import {
  getAllBanners,
  getFeaturedBanners,
  getBannerById,
} from "../Controller/bannerController.js";

const bannerrouter = express.Router();

bannerrouter.get("/", getAllBanners);

bannerrouter.get("/featured", getFeaturedBanners);

bannerrouter.get("/:id", getBannerById);

export default bannerrouter;
