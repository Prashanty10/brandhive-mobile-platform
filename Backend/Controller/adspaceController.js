import AdSpace from "../Models/adspaceModel.js";

export const adspacecontroller = async (req, res) => {
  try {
    const {
      category,
      title,
      description,
      location,
      price,
      images,
      specifications,
    } = req.body;

    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing from token",
      });
    }

    const adspace = await AdSpace.create({
      sellerID: userId,
      category,
      title,
      description,
      location,
      price,
      images: Array.isArray(images) ? images : images ? [images] : [],
      specifications,
    });

    res.status(201).json({
      success: true,
      message: "Ad space created successfully.",
      data: adspace,
    });
  } catch (error) {
    console.error("Error creating ad space:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const adSpaceInfo = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User ID missing from token",
      });
    }

    const adInfo = await AdSpace.find({
      $or: [{ sellerID: userId }, { sellerId: userId }],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Advertisements fetched successfully.",
      data: adInfo,
    });
  } catch (error) {
    console.error("Error fetching ad space info:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default { adspacecontroller, adSpaceInfo };
