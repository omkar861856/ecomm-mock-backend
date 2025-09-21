const {
  createEntity,
  getEntity,
  getAllEntities,
  updateEntity,
  deleteEntity,
  searchEntities,
} = require("../models");
const { validateShipment } = require("../models/Shipment");

// Create a new shipment
const createShipment = (req, res) => {
  try {
    const validatedShipment = validateShipment(req.body);
    const shipment = createEntity("shipments", validatedShipment, "ship");

    res.status(201).json({
      success: true,
      message: "Shipment created successfully",
      data: shipment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Get all shipments
const getAllShipments = (req, res) => {
  try {
    const { order_id, carrier, page = 1, limit = 10 } = req.query;
    let shipments = getAllEntities("shipments");

    // Apply filters
    if (order_id) {
      shipments = shipments.filter(
        (shipment) => shipment.order_id === order_id
      );
    }

    if (carrier) {
      shipments = shipments.filter(
        (shipment) =>
          shipment.carrier &&
          shipment.carrier.toLowerCase().includes(carrier.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedShipments = shipments.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedShipments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(shipments.length / limit),
        total_items: shipments.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipments",
      error: error.message,
    });
  }
};

// Get shipment by ID
const getShipmentById = (req, res) => {
  try {
    const { id } = req.params;
    const shipment = getEntity("shipments", id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipment",
      error: error.message,
    });
  }
};

// Update shipment
const updateShipment = (req, res) => {
  try {
    const { id } = req.params;
    const validatedShipment = validateShipment(req.body);

    const updatedShipment = updateEntity("shipments", id, validatedShipment);

    if (!updatedShipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      message: "Shipment updated successfully",
      data: updatedShipment,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete shipment
const deleteShipment = (req, res) => {
  try {
    const { id } = req.params;
    const deleted = deleteEntity("shipments", id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    res.json({
      success: true,
      message: "Shipment deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting shipment",
      error: error.message,
    });
  }
};

// Add tracking event to shipment
const addTrackingEvent = (req, res) => {
  try {
    const { id } = req.params;
    const shipment = getEntity("shipments", id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const { status, location, description } = req.body;
    const event = {
      timestamp: new Date().toISOString(),
      status,
      location,
      description,
    };

    shipment.events.push(event);

    // Update shipment status based on event
    if (status === "SHIPPED" && !shipment.shipped_at) {
      shipment.shipped_at = new Date().toISOString();
    } else if (status === "DELIVERED" && !shipment.delivered_at) {
      shipment.delivered_at = new Date().toISOString();
    }

    const updatedShipment = updateEntity("shipments", id, shipment);

    res.json({
      success: true,
      message: "Tracking event added successfully",
      data: updatedShipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding tracking event",
      error: error.message,
    });
  }
};

// Get shipment tracking
const getShipmentTracking = (req, res) => {
  try {
    const { id } = req.params;
    const shipment = getEntity("shipments", id);

    if (!shipment) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found",
      });
    }

    const trackingInfo = {
      tracking_number: shipment.tracking_number,
      carrier: shipment.carrier,
      status:
        shipment.events.length > 0
          ? shipment.events[shipment.events.length - 1].status
          : "PENDING",
      events: shipment.events,
      shipped_at: shipment.shipped_at,
      delivered_at: shipment.delivered_at,
    };

    res.json({
      success: true,
      data: trackingInfo,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipment tracking",
      error: error.message,
    });
  }
};

// Get all shipments by user ID (through orders)
const getShipmentsByUserId = (req, res) => {
  try {
    const { user_id } = req.params;
    const { carrier, page = 1, limit = 10 } = req.query;
    
    // First get all orders for this user
    const orders = getAllEntities("orders");
    const userOrders = orders.filter((order) => order.user_id === user_id);
    const userOrderIds = userOrders.map((order) => order.order_id);
    
    // Then get all shipments for these orders
    let shipments = getAllEntities("shipments");
    shipments = shipments.filter((shipment) => 
      userOrderIds.includes(shipment.order_id)
    );

    // Apply additional filters
    if (carrier) {
      shipments = shipments.filter(
        (shipment) =>
          shipment.carrier &&
          shipment.carrier.toLowerCase().includes(carrier.toLowerCase())
      );
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedShipments = shipments.slice(startIndex, endIndex);

    res.json({
      success: true,
      data: paginatedShipments,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(shipments.length / limit),
        total_items: shipments.length,
        items_per_page: parseInt(limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching shipments by user ID",
      error: error.message,
    });
  }
};

module.exports = {
  createShipment,
  getAllShipments,
  getShipmentById,
  getShipmentsByUserId,
  updateShipment,
  deleteShipment,
  addTrackingEvent,
  getShipmentTracking,
};
