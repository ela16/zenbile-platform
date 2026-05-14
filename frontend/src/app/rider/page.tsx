"use client";

import { useState } from "react";
import { MapPin, Navigation2, CheckCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useSocket } from "@/hooks/useSocket";
import { useEffect } from "react";
import MapWrapper from "@/components/MapWrapper";

export default function RiderDashboard() {
  const [isOnline, setIsOnline] = useState(false);
  const queryClient = useQueryClient();
  const socket = useSocket();

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/orders");
      return response.data;
    },
    refetchInterval: 3000,
    enabled: isOnline // Only fetch when online
  });

  const availableJobs = orders?.filter((o: any) => o.status === 'pending') || [];
  const activeJob = orders?.find((o: any) => ['accepted', 'picked_up', 'en_route'].includes(o.status));

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string, status: string }) => {
      const response = await axios.put(`http://localhost:5000/api/orders/${id}/status`, { status });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    }
  });

  const handleStatusUpdate = (job: any, nextStatus: string) => {
    updateStatusMutation.mutate({ id: job._id, status: nextStatus });
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeJob?.status === 'en_route' && socket) {
      interval = setInterval(() => {
        // Simulate rider movement
        const newLat = 9.005401 + (Math.random() - 0.5) * 0.01;
        const newLng = 38.763611 + (Math.random() - 0.5) * 0.01;
        
        socket.emit('updateLocation', {
          riderId: 'rider_123',
          orderId: activeJob._id,
          lat: newLat,
          lng: newLng,
          timestamp: new Date().toISOString()
        });
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [activeJob?.status, socket]);

  return (
    <div className="space-y-6">
      {/* Status Toggle */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold flex items-center">
            Status: 
            <span className={`ml-2 flex items-center ${isOnline ? 'text-green-500' : 'text-slate-400'}`}>
              <span className={`w-3 h-3 rounded-full mr-2 ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`}></span>
              {isOnline ? 'Online - Finding Jobs' : 'Offline'}
            </span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {isOnline ? 'You are visible to customers and dispatch.' : 'Go online to start receiving delivery requests.'}
          </p>
        </div>
        <button 
          onClick={() => setIsOnline(!isOnline)}
          className={`px-8 py-3 rounded-full font-bold text-white shadow-lg transition-colors ${
            isOnline ? 'bg-red-500 hover:bg-red-600 shadow-red-500/30' : 'bg-green-500 hover:bg-green-600 shadow-green-500/30'
          }`}
        >
          {isOnline ? 'GO OFFLINE' : 'GO ONLINE'}
        </button>
      </div>

      <AnimatePresence>
        {isOnline && !activeJob && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-4"
          >
            <h2 className="text-lg font-bold">New Requests Near You</h2>
            {isLoading && <p>Loading jobs...</p>}
            {availableJobs.length === 0 && !isLoading && (
               <div className="p-8 text-center bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700">
                  <p className="text-slate-500">No pending orders at the moment. Waiting...</p>
               </div>
            )}
            {availableJobs.map((job: any) => (
              <div key={job._id} className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-lg">{job.itemDetails}</h3>
                    <p className="text-sm text-slate-500 uppercase">ID: {job._id.substring(0,6)}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-bold text-amber-500">{job.price} ETB</span>
                    <p className="text-sm text-slate-500 flex items-center justify-end"><Clock className="w-3 h-3 mr-1"/> ~15 mins</p>
                  </div>
                </div>

                <div className="space-y-3 mb-6 relative">
                  <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-200 dark:bg-slate-700"></div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center relative z-10 mr-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Pickup</p>
                      <p className="font-medium">{job.pickupLocation.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-6 h-6 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center relative z-10 mr-3">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase">Drop-off</p>
                      <p className="font-medium">{job.dropoffLocation.address}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors">
                    Decline
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(job, 'accepted')}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 shadow-lg shadow-amber-500/30 transition-colors disabled:opacity-50"
                  >
                    Accept Order
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {isOnline && activeJob && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden shadow-xl border border-slate-100 dark:border-slate-700"
          >
            <div className="h-48 bg-slate-200 dark:bg-slate-700 relative overflow-hidden">
               <MapWrapper lat={9.005401} lng={38.763611} zoom={15} markers={[{lat: 9.005401, lng: 38.763611}]} />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                    STATUS: {activeJob.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <h2 className="text-xl font-bold mt-2">{activeJob.itemDetails}</h2>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">{activeJob.price} ETB</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-700">
                   <div className="flex items-center">
                     <Navigation2 className="w-5 h-5 text-blue-500 mr-3" />
                     <div>
                       <p className="text-sm text-slate-500">Navigate to {activeJob.status === 'accepted' ? 'Pickup' : 'Drop-off'}</p>
                       <p className="font-bold">{activeJob.status === 'accepted' ? activeJob.pickupLocation.address : activeJob.dropoffLocation.address}</p>
                     </div>
                   </div>
                   <button className="px-4 py-2 bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 font-semibold rounded-lg text-sm">
                     Open Maps
                   </button>
                </div>
              </div>

              {activeJob.status === 'accepted' && (
                <button 
                  onClick={() => handleStatusUpdate(activeJob, 'picked_up')}
                  disabled={updateStatusMutation.isPending}
                  className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center text-lg shadow-lg shadow-blue-600/30"
                >
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Mark as Picked Up
                </button>
              )}

              {activeJob.status === 'picked_up' && (
                <button 
                  onClick={() => handleStatusUpdate(activeJob, 'en_route')}
                  disabled={updateStatusMutation.isPending}
                  className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl transition-colors flex justify-center items-center text-lg shadow-lg shadow-amber-500/30"
                >
                  <Navigation2 className="w-6 h-6 mr-2" />
                  Start En Route
                </button>
              )}

              {activeJob.status === 'en_route' && (
                <button 
                  onClick={() => handleStatusUpdate(activeJob, 'delivered')}
                  disabled={updateStatusMutation.isPending}
                  className="w-full py-4 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-colors flex justify-center items-center text-lg shadow-lg shadow-green-600/30"
                >
                  <CheckCircle className="w-6 h-6 mr-2" />
                  Complete Delivery
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
