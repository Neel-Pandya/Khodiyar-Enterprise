import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, User, Mail, Phone, MapPin, Package, CreditCard, Calendar } from 'lucide-react';
import FormSectionCard from '@admin/shared/components/FormSectionCard';
import FormField from '@admin/shared/components/FormField';
import { useAdminOrderQuery, useUpdateOrderStatusMutation } from '@/hooks/useAdminOrderQueries';
import OrderActionsDropdown from '../components/OrderActionsDropdown';
import * as toast from '@/utils/toast';

const orderStatusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', ring: 'ring-amber-200' },
    confirmed: { bg: 'bg-blue-50', text: 'text-blue-600', dot: 'bg-blue-500', ring: 'ring-blue-200' },
    processing: { bg: 'bg-indigo-50', text: 'text-indigo-600', dot: 'bg-indigo-500', ring: 'ring-indigo-200' },
    shipped: { bg: 'bg-purple-50', text: 'text-purple-600', dot: 'bg-purple-500', ring: 'ring-purple-200' },
    delivered: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
    cancelled: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500', ring: 'ring-rose-200' },
};

const paymentStatusConfig = {
    pending: { bg: 'bg-amber-50', text: 'text-amber-600', dot: 'bg-amber-400', ring: 'ring-amber-200' },
    completed: { bg: 'bg-emerald-50', text: 'text-emerald-600', dot: 'bg-emerald-500', ring: 'ring-emerald-200' },
    failed: { bg: 'bg-rose-50', text: 'text-rose-600', dot: 'bg-rose-500', ring: 'ring-rose-200' },
    refunded: { bg: 'bg-slate-50', text: 'text-slate-600', dot: 'bg-slate-400', ring: 'ring-slate-200' },
};

const StatusBadge = ({ status, config }) => {
    const cfg = config[status] || config.pending;
    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className="capitalize">{status}</span>
        </span>
    );
};

const OrderDetailsPage = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { data, isLoading, isError, error } = useAdminOrderQuery(orderId);
    const updateStatusMutation = useUpdateOrderStatusMutation();

    const order = data?.order;

    const subtotal = useMemo(() => {
        if (!order?.order_items) return 0;
        return order.order_items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, [order?.order_items]);

    const handleUpdateStatus = async ({ orderId, data }) => {
        try {
            await updateStatusMutation.mutateAsync({ orderId, data });
            toast.success('Status updated successfully');
        } catch (err) {
            const message = err?.response?.data?.message || 'Failed to update status';
            toast.error(message);
            throw err;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getInitials = (name) => {
        if (!name) return '?';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const isAvatarUrl = (avatar) => {
        if (!avatar) return false;
        return avatar.startsWith('http') || avatar.startsWith('data:');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fbc02d]"></div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-red-500 font-medium">Error: {error?.message || 'Failed to load order'}</p>
                <button onClick={() => navigate('/admin/orders')} className="text-[#1e3a5f] hover:underline">
                    Return to Orders
                </button>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="flex flex-col items-center justify-center p-20 space-y-4">
                <p className="text-gray-500 font-medium">Order not found.</p>
                <button onClick={() => navigate('/admin/orders')} className="text-[#1e3a5f] hover:underline">
                    Return to Orders
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-[1400px] mx-auto pb-10 px-4 md:px-0">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/orders')}
                        className="p-2 rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:scale-110 active:scale-95"
                        aria-label="Back to orders"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#111827] tracking-tight">
                            Order Details
                        </h1>
                        <p className="text-gray-400 mt-0.5 text-xs sm:text-sm font-medium">
                            #{order.id} • <span className="capitalize">{order.status}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <StatusBadge status={order.status} config={orderStatusConfig} />
                    <OrderActionsDropdown
                        order={order}
                        onUpdateStatus={handleUpdateStatus}
                        isUpdating={updateStatusMutation.isPending}
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Information */}
                    <FormSectionCard title="Customer Information" icon={User}>
                        <div className="flex items-center gap-4 mb-4">
                            {isAvatarUrl(order.user?.avatar) ? (
                                <img
                                    src={order.user.avatar}
                                    alt={order.full_name}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-[#1e3a5f] flex items-center justify-center text-white font-bold text-lg">
                                    {getInitials(order.full_name)}
                                </div>
                            )}
                            <div>
                                <h3 className="font-semibold text-[#111827]">{order.full_name}</h3>
                                <p className="text-sm text-gray-500">{order.user?.email || order.email}</p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField label="Email" value={order.email} disabled icon={Mail} />
                            <FormField label="Phone" value={order.phone} disabled icon={Phone} />
                        </div>
                    </FormSectionCard>

                    {/* Shipping Address */}
                    <FormSectionCard title="Shipping Address" icon={MapPin}>
                        <div className="space-y-4">
                            <FormField label="Full Address" value={order.address} disabled />
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <FormField label="City" value={order.city} disabled />
                                <FormField label="State" value={order.state} disabled />
                                <FormField label="Pincode" value={order.pincode} disabled />
                            </div>
                        </div>
                    </FormSectionCard>

                    {/* Order Items */}
                    <FormSectionCard title="Order Items" icon={Package}>
                        <div className="space-y-3">
                            {order.order_items?.map((item) => (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl"
                                >
                                    <div className="w-16 h-16 bg-white rounded-lg overflow-hidden flex-shrink-0">
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <Package size={20} className="text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-[#111827] truncate">
                                            {item.product?.name || 'Unknown Product'}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            Qty: {item.quantity} × ₹{Number(item.price).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-[#111827]">
                                            ₹{Number(item.price * item.quantity).toLocaleString('en-IN')}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </FormSectionCard>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Order Status */}
                    <FormSectionCard title="Order Status" icon={Calendar}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Current Status</span>
                                <StatusBadge status={order.status} config={orderStatusConfig} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Payment Status</span>
                                <StatusBadge status={order.payment_status} config={paymentStatusConfig} />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">Payment Type</span>
                                <span className="text-sm font-medium uppercase">{order.payment_type}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <p className="text-sm text-gray-500">
                                    Ordered on {formatDate(order.created_at)}
                                </p>
                            </div>
                        </div>
                    </FormSectionCard>

                    {/* Payment Summary */}
                    <FormSectionCard title="Payment Summary" icon={CreditCard}>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-[#111827]">
                                    ₹{Number(subtotal).toLocaleString('en-IN')}
                                </span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <div className="flex justify-between items-center">
                                    <span className="font-semibold text-[#111827]">Total Amount</span>
                                    <span className="text-xl font-black text-[#1e3a5f]">
                                        ₹{Number(order.total_amount).toLocaleString('en-IN')}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </FormSectionCard>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsPage;
