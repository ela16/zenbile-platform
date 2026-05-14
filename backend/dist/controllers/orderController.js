"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOrderStatus = exports.getOrders = exports.createOrder = void 0;
// Mock DB for environments without MongoDB installed
let MOCK_ORDERS = []; // Cleared for fresh test
// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Customer)
const createOrder = async (req, res) => {
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
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.createOrder = createOrder;
// @desc    Get all orders
// @route   GET /api/orders
// @access  Private (Admin/Rider)
const getOrders = async (req, res) => {
    try {
        res.json(MOCK_ORDERS);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.getOrders = getOrders;
// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Rider/Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const orderIndex = MOCK_ORDERS.findIndex(o => o._id === req.params.id);
        if (orderIndex === -1) {
            return res.status(404).json({ message: 'Order not found' });
        }
        MOCK_ORDERS[orderIndex].status = status;
        res.json(MOCK_ORDERS[orderIndex]);
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server Error' });
    }
};
exports.updateOrderStatus = updateOrderStatus;
