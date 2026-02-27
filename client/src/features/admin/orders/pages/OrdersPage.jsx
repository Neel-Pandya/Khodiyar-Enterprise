import React, { useState } from 'react';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderStatCard from '../components/OrderStatCard';
import { recentOrders, orderStats } from '@admin/data/mockData';

const OrdersPage = () => {
    const [selectedOrder, setSelectedOrder] = useState(null);

    return (
        <div className="space-y-8 max-w-[1400px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                        Orders Management
                    </h1>
                    <p className="text-slate-400 mt-1 text-sm font-medium">
                        Track and manage customer solar solution orders
                    </p>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {orderStats.map((stat) => (
                    <OrderStatCard 
                        key={stat.id} 
                        label={stat.label} 
                        value={stat.value} 
                        icon={stat.icon} 
                    />
                ))}
            </div>

            {/* Main Table Section */}
            <div className="relative">
                <OrdersTable 
                    orders={recentOrders} 
                    onViewOrder={(order) => setSelectedOrder(order)} 
                />
            </div>

            {/* Order Details Modal */}
            {selectedOrder && (
                <OrderDetailsModal 
                    order={selectedOrder} 
                    onClose={() => setSelectedOrder(null)} 
                />
            )}
        </div>
    );
};

export default OrdersPage;
