import TravelPreference from "./preference.model.js";

export const getPreferences = async (userId) => {
  return await TravelPreference.findOne({
    userId,
  });
};

export const createOrUpdatePreferences = async (userId, data) => {
  const preferences = await TravelPreference.findOneAndUpdate(
    { userId },
    {
      userId,
      ...data,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true,
    }
  );

  return preferences;
};