import mongoose from "mongoose";

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Destination name is required"],
      unique: true,
      trim: true,
      maxlength: 150,
    },

    type: {
      type: String,
      required: [true, "Destination type is required"],
      enum: [
        "CITY",
        "BEACH",
        "HILL_STATION",
        "WILDLIFE",
        "HERITAGE",
        "ADVENTURE",
        "NATURE",
        "PILGRIMAGE",
      ],
    },

    location: {
      country: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        required: true,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function (value) {
            return (
              value.length === 2 &&
              value[0] >= -180 &&
              value[0] <= 180 &&
              value[1] >= -90 &&
              value[1] <= 90
            );
          },
          message:
            "Coordinates must be [longitude, latitude]",
        },
      },
    },

    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
      maxlength: 2000,
    },

    images: {
      type: [String],
      default: [],
    },

    activities: {
      type: [String],
      default: [],
    },

    bestTimeToVisit: {
      type: String,
      trim: true,
    },

    budgetRange: {
      min: {
        type: Number,
        min: 0,
        default: 0,
      },

      max: {
        type: Number,
        min: 0,
        default: 0,
      },
    },

    tags: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// Validation
// ======================================================

destinationSchema.pre("validate", function (next) {
  if (
    this.budgetRange &&
    this.budgetRange.max > 0 &&
    this.budgetRange.min > this.budgetRange.max
  ) {
    return next(
      new Error("Minimum budget cannot exceed maximum budget")
    );
  }

  next();
});

// ======================================================
// Indexes
// ======================================================

// Geospatial search
destinationSchema.index({
  "location.coordinates": "2dsphere",
});

// Search/filter indexes
destinationSchema.index({
  type: 1,
});

destinationSchema.index({
  "location.city": 1,
});

destinationSchema.index({
  "location.state": 1,
});

destinationSchema.index({
  status: 1,
});

const Destination = mongoose.model(
  "Destination",
  destinationSchema
);

export default Destination;