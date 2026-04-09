import React from 'react';
import { useNavigate } from 'react-router';
import { Eye } from 'lucide-react';

const capitalizeName = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

const isAvatarUrl = (avatar) => {
  if (!avatar) return false;
  return avatar.startsWith('http') || avatar.startsWith('data:');
};

const statusConfig = {
  Processing: {
    bg: 'bg-blue-50',
    text: 'text-blue-600',
    dot: 'bg-blue-500',
    ring: 'ring-blue-200',
  },
  Delivered: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-600',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  },
  Pending: {
    bg: 'bg-amber-50',
    text: 'text-amber-600',
    dot: 'bg-amber-400',
    ring: 'ring-amber-200',
  },
};

const avatarColors = [
  'bg-[#1e3a5f]',
  'bg-blue-500',
  'bg-violet-500',
  'bg-emerald-600',
  'bg-rose-500',
  'bg-amber-500',
];

const StatusBadge = ({ status }) => {
  const cfg = statusConfig[status] || statusConfig.Pending;
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold
        ${cfg.bg} ${cfg.text} ring-1 ${cfg.ring}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} animate-pulse`} />
      {status}
    </span>
  );
};

const RecentOrdersTable = ({ orders = [] }) => {
  const navigate = useNavigate();

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  const columns = ['Customer', 'Solar Solution', 'Amount', 'Status', 'Date'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Recent Orders</h2>
          <p className="text-xs text-slate-400 mt-0.5">{orders.length} orders this month</p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-slate-200">
              {columns.map((col) => (
                <th
                  key={col}
                  className="px-6 py-3.5 text-left select-none"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {col}
                  </span>
                </th>
              ))}
              <th className="px-6 py-3.5 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                  Action
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, i) => (
              <tr
                key={order.id}
                className="border-b border-slate-200 last:border-0 hover:bg-slate-50/60 transition-colors group"
              >
                {/* Customer */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    {isAvatarUrl(order.avatar) ? (
                      <img
                        src={order.avatar}
                        alt={order.customer}
                        className="w-9 h-9 rounded-full object-cover flex-shrink-0"
                      />
                    ) : (
                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center
                          text-white text-xs font-bold flex-shrink-0
                          ${avatarColors[i % avatarColors.length]}
                        `}
                      >
                        {order.avatar}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{capitalizeName(order.customer)}</p>
                      <p className="text-xs text-slate-400">{order.location}</p>
                    </div>
                  </div>
                </td>

                {/* Solution */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600">{order.solution}</span>
                </td>

                {/* Amount */}
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-800">
                    ₹{order.amount.toLocaleString('en-IN')}
                  </span>
                </td>

                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={order.status} />
                </td>

                {/* Date */}
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-500">{order.date}</span>
                </td>

                {/* Action */}
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleViewOrder(order.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-[#1e3a5f] hover:bg-[#1e3a5f]/8 transition-colors hover:scale-110 active:scale-95"
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;
