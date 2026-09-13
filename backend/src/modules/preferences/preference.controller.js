import {
  getPreferences,
  createOrUpdatePreferences,
} from "./preference.service.js";

export const getMyPreferences = async (req, res, next) => {
  try {
    const preferences = await getPreferences(req.user._id);

    if (!preferences) {
      return res.status(404).json({
        success: false,
        message: "Travel preferences not found",
      });
    }

    res.status(200).json({
      success: true,
      data: preferences,
    });
  } catch (error) {
    console.error("GET PREFERENCES ERROR:", error);
    next(error);
  }
};

export const updateMyPreferences = async (req, res, next) => {
  try {
    console.log("USER ID:", req.user._id);
    console.log("PREFERENCE BODY:", req.body);

    const preferences = await createOrUpdatePreferences(
      req.user._id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Travel preferences updated successfully",
      data: preferences,
    });
  } catch (error) {
    console.error("UPDATE PREFERENCES ERROR:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};