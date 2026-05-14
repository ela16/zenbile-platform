"use client";

import { Package, Clock, CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export default function CustomerDashboard() {
  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: async () => {
      const response = await axios.get("http://localhost:5000/api/orders");
      return response.data;
    },
    // Poll every 3 seconds to keep it real-time feel without socket for now
    refetchInterval: 3000 
  });

  const activeOrders = orders?.filter((o: any) => o.status !== 'delivered' && o.status !== 'cancelled') || [];
  const completedOrders = orders?.filter((o: any) => o.status === 'delivered') || [];

  const stats = [
    { label: "Active Deliveries", value: activeOrders.length.toString(), icon: Package, color: "text-blue-600", bg: "bg-blue-100 dark:bg-blue-500/20" },
    { label: "Completed", value: completedOrders.length.toString(), icon: CheckCircle2, color: "text-green-600", bg: "bg-green-100 dark:bg-green-500/20" },
    { label: "Pending Issues", value: "0", icon: AlertCircle, color: "text-amber-600", bg: "bg-amber-100 dark:bg-amber-500/20" },
    { label: "Avg Time", value: "45m", icon: Clock, color: "text-purple-600", bg: "bg-purple-100 dark:bg-purple-500/20" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Welcome back, John! 👋</h1>
        <p className="text-slate-500 dark:text-slate-400">Here's what's happening with your deliveries today.</p>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Deliveries</h2>
            <button className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center">
              View all <ArrowRight className="w-4 h-4 ml-1" />
            </button>
          </div>
          
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden min-h-[300px]">
            {isLoading ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : orders?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-500">
                <Package className="w-12 h-12 mb-4 opacity-50" />
                <p>No deliveries yet. Send a package to get started!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-700">
                {orders?.slice(0, 5).map((order: any) => (
                  <div key={order._id} className="p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-500" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 dark:text-white">{order.itemDetails}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">ID: {order._id.substring(0,6).toUpperCase()} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider ${
                        order.status === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                        order.status === 'delivered' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                        'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                      <p className="text-sm font-medium mt-1">{order.price} ETB</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div>
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 -translate-y-4 translate-x-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            <h3 className="text-xl font-bold mb-2">Need to send a package?</h3>
            <p className="text-blue-100 mb-6 text-sm">
              Our riders are on standby in Addis Ababa to deliver your items instantly.
            </p>
            <Link 
              href="/customer/new-order" 
              className="inline-flex w-full justify-center items-center px-4 py-3 bg-white text-blue-600 rounded-xl font-semibold shadow-sm hover:bg-blue-50 transition-colors"
            >
              <Package className="w-4 h-4 mr-2" />
              Create Delivery
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
