import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    subtitle: {
      type: String,
      required: true,
      trim: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    adType: {
      type: String,
      enum: ["offline", "online"],
      required: true,
    },

    tag: {
      type: String,
      required: true,
    },

    location: {
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
    },

    price: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: "INR",
      },
      duration: {
        type: String,
        enum: ["day", "week", "month"],
        default: "day",
      },
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    reviews: {
      type: Number,
      default: 0,
    },

    featured: {
      type: Boolean,
      default: false,
    },

    displayOrder: {
      type: Number,
      default: 0,
    },

    buttonText: {
      type: String,
      default: "Book Now",
    },

    redirectType: {
      type: String,
      enum: ["category", "advertisement"],
      default: "category",
    },

    redirectId: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Banner = mongoose.model("banners", bannerSchema , "banners");

export default Banner;