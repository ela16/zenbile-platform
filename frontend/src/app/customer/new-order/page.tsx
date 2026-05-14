"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MapPin, Package, Camera, CreditCard, ChevronRight, Loader2 } from "lucide-react";
import MapWrapper from "@/components/MapWrapper";

export default function NewOrderPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  
  // Form State
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  const [itemDetails, setItemDetails] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Telebirr");

  // Fixed demo values
  const estimatedPrice = 120;
  const estimatedDist = "6.2 km";

  // React Query Mutation for creating order
  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await axios.post("http://localhost:5000/api/orders", orderData);
      return response.data;
    },
    onSuccess: (data) => {
      // Redirect to dashboard or tracking page on success
      router.push("/customer");
    },
    onError: (error) => {
      console.error("Failed to create order:", error);
      alert("Failed to create order. Is the backend running?");
    }
  });

  const handleSubmit = () => {
    createOrderMutation.mutate({
      pickupLocation: { address: pickup },
      dropoffLocation: { address: dropoff },
      itemDetails: itemDetails || "Standard Package",
      price: estimatedPrice,
      paymentMethod: paymentMethod
    });
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Create New Delivery</h1>
        <p className="text-slate-500 dark:text-slate-400">Fill in the details below to request a rider.</p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center space-x-2">
        {['Locations', 'Package Details', 'Payment'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
              step >= i + 1 
                ? 'bg-blue-600 text-white' 
                : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
              {i + 1}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              step >= i + 1 ? 'text-slate-900 dark:text-white' : 'text-slate-400'
            }`}>
              {label}
            </span>
            {i < 2 && <ChevronRight className="w-4 h-4 mx-4 text-slate-300 dark:text-slate-600" />}
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 md:p-8 shadow-sm">
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. Bole Medhanialem, Addis Ababa"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Drop-off Location
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-red-400" />
                <input 
                  type="text" 
                  value={dropoff}
                  onChange={(e) => setDropoff(e.target.value)}
                  placeholder="e.g. Piassa, Addis Ababa"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div className="h-48 bg-slate-100 dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 relative">
               <MapWrapper lat={9.005401} lng={38.763611} zoom={13} />
            </div>

            <button 
              disabled={!pickup || !dropoff}
              onClick={() => setStep(2)}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors"
            >
              Continue to Package Details
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                What are you sending?
              </label>
              <div className="relative">
                <Package className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input 
                  type="text" 
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  placeholder="e.g. Documents, Electronics, Food"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Package Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer">
                <Camera className="w-8 h-8 mb-2" />
                <span className="text-sm">Click to upload a photo of the item</span>
              </div>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)}
                className="w-1/3 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                Back
              </button>
              <button 
                disabled={!itemDetails}
                onClick={() => setStep(3)}
                className="w-2/3 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-xl transition-colors"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center mb-2">
                <span className="text-slate-500 dark:text-slate-400">Estimated Distance</span>
                <span className="font-semibold">{estimatedDist}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-bold text-slate-700 dark:text-slate-300">Total Fare</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">{estimatedPrice} ETB</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">
                Select Payment Method
              </label>
              <div className="space-y-3">
                {['Telebirr', 'CBE Birr', 'Cash'].map((method) => (
                  <label key={method} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${
                    paymentMethod === method 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : 'border-slate-200 dark:border-slate-600 hover:border-blue-300'
                  }`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value={method}
                      checked={paymentMethod === method}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-blue-600" 
                    />
                    <span className="ml-3 font-medium">{method} {method === 'Cash' && 'on Delivery'}</span>
                    <CreditCard className="ml-auto w-5 h-5 text-slate-400" />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => setStep(2)}
                disabled={createOrderMutation.isPending}
                className="w-1/3 py-4 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
              >
                Back
              </button>
              <button 
                onClick={handleSubmit}
                disabled={createOrderMutation.isPending}
                className="w-2/3 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-green-600/30 flex justify-center items-center disabled:opacity-50 disabled:shadow-none"
              >
                {createOrderMutation.isPending ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Confirm & Request Rider'
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
