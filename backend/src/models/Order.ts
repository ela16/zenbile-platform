import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  customer: mongoose.Schema.Types.ObjectId;
  rider?: mongoose.Schema.Types.ObjectId;
  pickupLocation: {
    address: string;
    lat?: number;
    lng?: number;
  };
  dropoffLocation: {
    address: string;
    lat?: number;
    lng?: number;
  };
  itemDetails: string;
  status: 'pending' | 'accepted' | 'picked_up' | 'en_route' | 'delivered' | 'cancelled';
  price: number;
  paymentMethod: 'Telebirr' | 'CBE Birr' | 'Cash';
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    customer: { type: Schema.Types.ObjectId, ref: 'User' },
    rider: { type: Schema.Types.ObjectId, ref: 'User' },
    pickupLocation: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    dropoffLocation: {
      address: { type: String, required: true },
      lat: { type: Number },
      lng: { type: Number },
    },
    itemDetails: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['pending', 'accepted', 'picked_up', 'en_route', 'delivered', 'cancelled'],
      default: 'pending' 
    },
    price: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Telebirr', 'CBE Birr', 'Cash'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>('Order', OrderSchema);
