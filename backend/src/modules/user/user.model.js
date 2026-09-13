import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },

    passwordHash: {
      type: String,
      required: function () {
        return this.authProvider === "local";
      },
      select: false,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    role: {
      type: String,
      enum: [
        "TRAVELER",
        "AGENCY",
        "HOTEL_PARTNER",
        "FOOD_PARTNER",
        "ADMIN",
      ],
      default: "TRAVELER",
    },

    profileImage: {
      type: String,
      default: null,
    },

    bio: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    location: {
      city: {
        type: String,
        trim: true,
        default: "",
      },

      coordinates: {
        type: [Number],
        default: undefined,
      },
    },

    verification: {
      emailVerified: {
        type: Boolean,
        default: false,
      },

      phoneVerified: {
        type: Boolean,
        default: false,
      },

      identityVerified: {
        type: Boolean,
        default: false,
      },
    },

    status: {
      type: String,
      enum: ["ACTIVE", "SUSPENDED", "BLOCKED", "DELETED"],
      default: "ACTIVE",
    },
  },
  {
    timestamps: true,
  }
);

// Geospatial index.
// Coordinates must be stored as [longitude, latitude].
userSchema.index({
  "location.coordinates": "2dsphere",
});

export default mongoose.model("User", userSchema);