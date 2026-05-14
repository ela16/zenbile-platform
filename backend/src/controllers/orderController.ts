import { Request, Response } from 'express';

// Mock DB for environments without MongoDB installed
let MOCK_ORDERS: any[] = []; // Cleared for fresh test

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { pickupLocation, dropoffLocation, itemDetails, price, paymentMethod } = req.body;

    const newOrder = {
      _id: Math.random().toString(36).substr(2, 9),
      pickupLocation,
      dropoffLocation,
      itemDetails,
      price,
      paymentMethod,
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    };

    MOCK_ORDERS.push(newOrder);

    res.status(201).json(newOrder);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin/Rider)
export const getOrders = async (req: Request, res: Response) => {
  try {
    res.json(MOCK_ORDERS);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Rider/Admin)
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const orderIndex = MOCK_ORDERS.findIndex(o => o._id === req.params.id);

    if (orderIndex === -1) {
      return res.status(404).json({ message: 'Order not found' });
    }

    MOCK_ORDERS[orderIndex].status = status;

    res.json(MOCK_ORDERS[orderIndex]);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

