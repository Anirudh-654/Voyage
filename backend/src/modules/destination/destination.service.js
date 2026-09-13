import Destination from "./destination.model.js";

// ======================================================
// Create Destination
// ======================================================

export const createDestination = async (data, userId) => {
  const destination = await Destination.create({
    ...data,
    createdBy: userId,
  });

  return destination;
};

// ======================================================
// Get All Destinations
// ======================================================

export const getAllDestinations = async (filters = {}) => {
  const query = {
    status: "ACTIVE",
  };

  // Search by name
  if (filters.search) {
    query.name = {
      $regex: filters.search,
      $options: "i",
    };
  }

  // Filter by destination type
  if (filters.type) {
    query.type = filters.type;
  }

  // Filter by city
  if (filters.city) {
    query["location.city"] = {
      $regex: filters.city,
      $options: "i",
    };
  }

  // Filter by state
  if (filters.state) {
    query["location.state"] = {
      $regex: filters.state,
      $options: "i",
    };
  }

  return await Destination.find(query)
    .populate("createdBy", "firstName lastName")
    .sort({ createdAt: -1 });
};

// ======================================================
// Get Destination By ID
// ======================================================

export const getDestinationById = async (destinationId) => {
  return await Destination.findOne({
    _id: destinationId,
    status: "ACTIVE",
  }).populate("createdBy", "firstName lastName");
};

// ======================================================
// Update Destination
// ======================================================

export const updateDestination = async (
  destinationId,
  data
) => {
  const destination = await Destination.findByIdAndUpdate(
    destinationId,
    data,
    {
      new: true,
      runValidators: true,
    }
  );

  return destination;
};

// ======================================================
// Delete Destination
// ======================================================
// We don't physically delete it.
// We mark it INACTIVE.

export const deleteDestination = async (destinationId) => {
  return await Destination.findByIdAndUpdate(
    destinationId,
    {
      status: "INACTIVE",
    },
    {
      new: true,
    }
  );
};