"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.telebirrCallback = void 0;
// Mock DB reference (in a real app, import from db or Order model)
// For this session, we will just return success to simulate the callback.
// @desc    Telebirr Payment Callback / IPN (Instant Payment Notification)
// @route   POST /api/payments/telebirr/callback
// @access  Public (Called by Telebirr Servers)
const telebirrCallback = async (req, res) => {
    try {
        // In a real scenario, the payload comes encrypted from Telebirr.
        // You'd use your Telebirr Public Key to decrypt it, verify the signature,
        // and then update the Order status in the database.
        console.log("🔔 [Telebirr] Received IPN Callback:", req.body);
        const { outTradeNo, tradeStatus } = req.body; // Mock payload structure
        if (tradeStatus === 'Completed') {
            console.log(`✅ [Telebirr] Payment confirmed for Order ID: ${outTradeNo}`);
            // Find order by ID and update status to 'payment_completed'
            // Order.findOneAndUpdate({ _id: outTradeNo }, { paymentStatus: 'completed' });
        }
        else {
            console.log(`❌ [Telebirr] Payment failed for Order ID: ${outTradeNo}`);
        }
        // Telebirr requires a specific JSON success response
        res.status(200).json({ code: 0, msg: "success" });
    }
    catch (error) {
        console.error("Telebirr Callback Error:", error);
        res.status(500).json({ code: 1, msg: "Internal Server Error" });
    }
};
exports.telebirrCallback = telebirrCallback;
