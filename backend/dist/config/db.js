"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        const conn = await mongoose_1.default.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/zenbile');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.warn(`MongoDB Connection Failed: ${error.message}. Running in Mock Database Mode.`);
        // process.exit(1); // Removed so backend keeps running without docker
    }
};
exports.default = connectDB;
