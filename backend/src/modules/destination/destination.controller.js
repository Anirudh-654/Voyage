import {
  createDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
  deleteDestination,
} from "./destination.service.js";

// ======================================================
// CREATE DESTINATION
// ======================================================

export const createDestinationController = async (
  req,
  res,
  next
) => {
  try {
    const destination = await createDestination(
      req.body,
      req.user._id
    );

    res.status(201).json({
      success: true,
      message: "Destination created successfully",
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET ALL DESTINATIONS
// ======================================================

export const getDestinationsController = async (
  req,
  res,
  next
) => {
  try {
    const filters = {
      search: req.query.search,
      type: req.query.type,
      city: req.query.city,
      state: req.query.state,
    };

    const destinations =
      await getAllDestinations(filters);

    res.status(200).json({
      success: true,
      count: destinations.length,
      data: {
        destinations,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// GET DESTINATION BY ID
// ======================================================

export const getDestinationController = async (
  req,
  res,
  next
) => {
  try {
    const destination =
      await getDestinationById(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// UPDATE DESTINATION
// ======================================================

export const updateDestinationController = async (
  req,
  res,
  next
) => {
  try {
    const destination =
      await updateDestination(
        req.params.id,
        req.body
      );

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination updated successfully",
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================
// DELETE DESTINATION
// ======================================================

export const deleteDestinationController = async (
  req,
  res,
  next
) => {
  try {
    const destination =
      await deleteDestination(req.params.id);

    if (!destination) {
      return res.status(404).json({
        success: false,
        message: "Destination not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Destination deactivated successfully",
      data: {
        destination,
      },
    });
  } catch (error) {
    next(error);
  }
};