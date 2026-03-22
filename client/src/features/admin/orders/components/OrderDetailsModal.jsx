import { X, Calendar, MapPin, Package, Mail, Phone, ExternalLink, ShieldCheck } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose }) => {
    if (!order) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-[#1e3a5f] px-8 py-6 text-white relative">
                    <button 
                        onClick={onClose}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-white/10 transition-colors border border-white/20"
                    >
                        <X size={20} />
                    </button>

                    <div className="flex items-center gap-4 mb-2">
                        <span className="px-3 py-1 bg-[#fbc02d] text-[#1e3a5f] text-xs font-bold rounded-full uppercase tracking-widest">
                            Order Details
                        </span>
                        <span className="text-white/60 font-mono text-sm">#{order.id}</span>
                    </div>
                    <h2 className="text-2xl font-extrabold tracking-tight">
                        {order.solution}
                    </h2>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Customer Info */}
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                                    Customer Information
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-[#1e3a5f] font-bold">
                                            {order.avatar}
                                        </div>
                                        <div>
                                            <p className="text-lg font-bold text-slate-800">{order.customer}</p>
                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                <MapPin size={14} />
                                                {order.location}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-2 pt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Mail size={16} className="text-slate-400" />
                                            {order.email || 'N/A'}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-slate-600">
                                            <Phone size={16} className="text-slate-400" />
                                            {order.phone || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    Order Info
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <Calendar size={14} /> Date Ordered
                                        </span>
                                        <span className="font-semibold text-slate-800">{order.date}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-slate-500 flex items-center gap-2">
                                            <ShieldCheck size={14} /> Current Status
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 ring-1 ring-blue-100`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment & Items */}
                        <div className="space-y-6">
                            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Payment Summary</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Subtotal</span>
                                        <span className="text-slate-800 font-medium">${(order.amount * 0.9).toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-slate-500">Tax (10%)</span>
                                        <span className="text-slate-800 font-medium">${(order.amount * 0.1).toLocaleString()}</span>
                                    </div>
                                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                                        <span className="font-bold text-slate-800">Total Amount</span>
                                        <span className="text-2xl font-black text-[#1e3a5f]">${order.amount.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            <button className="w-full flex items-center justify-center gap-2 bg-[#1e3a5f] text-white py-4 rounded-xl font-bold hover:bg-[#2c5282] transition-colors shadow-lg shadow-blue-900/10 group">
                                <ExternalLink size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                Download Invoice
                            </button>
                        </div>
                    </div>

                    {/* Timeline or More details can be added here */}
                </div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
