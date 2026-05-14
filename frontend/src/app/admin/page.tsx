"use client";

import { Users, Truck, DollarSign, Activity, MapPin, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSocket } from "@/hooks/useSocket";
import { useEffect, useState } from "react";
import MapWrapper from "@/components/MapWrapper";

export default function AdminDashboard() {
  const socket = useSocket();
  const [liveLocation, setLiveLocation] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (socket) {
      socket.on('locationUpdated', (data: any) => {
        setLiveLocation({ lat: data.lat, lng: data.lng });
      });
    }
  }, [socket]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/orders");
      return response.data;
    },
    refetchInterval: 3000
  });

  const totalRevenue = orders?.filter((o: any) => o.status === 'delivered').reduce((acc: number, curr: any) => acc + curr.price, 0) || 0;
  const activeDeliveries = orders?.filter((o: any) => ['accepted', 'picked_up', 'en_route'].includes(o.status)).length || 0;

  const stats = [
    { label: "Total Revenue", value: `${totalRevenue} ETB`, icon: DollarSign, color: "text-green-600", bg: "bg-green-100 dark:bg-green-500/20" },
    { label: "Active Riders", value: "1", icon: Truck, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/20" },
    { label: "Total Users", value: "2", icon: Users, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-500/20" },
    { label: "Active Deliveries", value: activeDeliveries.toString(), icon: Activity, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-500/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Admin Control Center</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of Zenbile platform operations in Addis Ababa.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm flex items-center space-x-4"
          >
            <div className={`p-4 rounded-xl ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{stat.label}</p>
              <h3 className="text-2xl font-bold">{isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : stat.value}</h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Table */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700">
             <h2 className="text-xl font-bold">All Orders ({orders?.length || 0})</h2>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-700">
                      <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">ID</th>
                      <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Item</th>
                      <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Status</th>
                      <th className="p-4 text-sm font-semibold text-slate-600 dark:text-slate-400">Payment</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                   {orders?.map((order: any) => (
                      <tr key={order._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                         <td className="p-4 text-sm uppercase">{order._id.substring(0,6)}</td>
                         <td className="p-4 text-sm font-medium">{order.itemDetails}</td>
                         <td className="p-4 text-sm">
                            <span className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded-md text-xs font-semibold uppercase">
                               {order.status.replace('_', ' ')}
                            </span>
                         </td>
                         <td className="p-4 text-sm">{order.paymentMethod}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
        </div>

        {/* Live Map Area */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-600" />
              Live Map
            </h2>
          </div>
          <div className="h-[400px] w-full bg-slate-100 dark:bg-slate-900 relative overflow-hidden">
             {liveLocation ? (
                <div className="absolute inset-0 z-10">
                   <MapWrapper 
                      lat={liveLocation.lat} 
                      lng={liveLocation.lng} 
                      zoom={16} 
                      markers={[{ lat: liveLocation.lat, lng: liveLocation.lng }]}
                   />
                </div>
             ) : (
                <div className="absolute inset-0 z-10">
                   {/* Default center to Addis Ababa if no live location */}
                   <MapWrapper lat={9.005401} lng={38.763611} zoom={12} />
                </div>
             )}
             
             {/* Overlay for tracking info */}
             {liveLocation && (
               <div className="absolute top-4 left-4 z-20 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 animate-in fade-in">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping mr-2"></span>
                    Rider En Route
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 font-mono text-xs mt-1">
                    {liveLocation.lat.toFixed(5)}, {liveLocation.lng.toFixed(5)}
                  </p>
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
