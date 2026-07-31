import Banner from "../Models/bannerModel.js";


export const getAllBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ isActive: true }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Banners fetched successfully.",
      banners,
    });
  } catch (error) {
    console.error("Get Banners Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const getFeaturedBanners = async (req, res) => {
  try {
    const banners = await Banner.find({
      featured: true,
      isActive: true,
    }).sort({
      displayOrder: 1,
    });

    return res.status(200).json({
      success: true,
      message: "Featured banners fetched successfully.",
      banners,
    });
  } catch (error) {
    console.error("Featured Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};


export const getBannerById = async (req, res) => {
  try {
    const { id } = req.params;

    const banner = await Banner.findById(id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
      });
    }

    return res.status(200).json({
      success: true,
      banner,
    });
  } catch (error) {
    console.error("Get Banner Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};