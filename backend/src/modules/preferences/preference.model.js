import mongoose from "mongoose";

const travelPreferenceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    interests: {
      type: [String],
      default: [],
    },

    activities: {
      type: [String],
      default: [],
    },

    preferredDestinations: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Destination",
      },
    ],

    travelStyles: {
      type: [String],
      default: [],
      validate: {
        validator: function (value) {
          return value.length >= 2 && value.length <= 3;
        },
        message: "Select between 2 and 3 travel styles",
      },
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

    preferredGroupSize: {
      min: {
        type: Number,
        min: 4,
        default: 4,
      },
      max: {
        type: Number,
        min: 4,
      },
    },

    travelFrequency: {
      type: String,
      enum: [
        "Once a year",
        "2-3 times a year",
        "4-6 times a year",
        "Frequently",
      ],
    },
  },
  {
    timestamps: true,
  }
);

travelPreferenceSchema.pre("validate", function (next) {
  if (
    this.budgetRange &&
    this.budgetRange.max > 0 &&
    this.budgetRange.min > this.budgetRange.max
  ) {
    return next(new Error("Minimum budget cannot exceed maximum budget"));
  }

  if (
    this.preferredGroupSize &&
    this.preferredGroupSize.max &&
    this.preferredGroupSize.min > this.preferredGroupSize.max
  ) {
    return next(
      new Error("Minimum group size cannot exceed maximum group size")
    );
  }

  next();
});

const TravelPreference = mongoose.model(
  "TravelPreference",
  travelPreferenceSchema
);

export default TravelPreference;