import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, ChevronRight } from 'lucide-react';

const orderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const paymentStatuses = ['pending', 'completed', 'failed', 'refunded'];

const validTransitions = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const OrderActionsDropdown = ({ order, onUpdateStatus, isUpdating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showOrderStatuses, setShowOrderStatuses] = useState(false);
  const [showPaymentStatuses, setShowPaymentStatuses] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowOrderStatuses(false);
        setShowPaymentStatuses(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleStatusChange = async (statusType, newStatus) => {
    if (isUpdating) return;

    try {
      await onUpdateStatus({
        orderId: order.id,
        data: { [statusType]: newStatus },
      });
    } catch (err) {
      // Error handled by parent
    }
    
    setIsOpen(false);
    setShowOrderStatuses(false);
    setShowPaymentStatuses(false);
  };

  const canChangeOrderStatus = (currentStatus, newStatus) => {
    if (currentStatus === newStatus) return false;
    const allowed = validTransitions[currentStatus] || [];
    return allowed.includes(newStatus);
  };

  const canChangePaymentStatus = (paymentType, currentStatus, newStatus) => {
    if (currentStatus === newStatus) return false;
    
    // Online payments: payment_status is typically completed or failed, can't change to pending
    if (paymentType === 'online') {
      return ['failed', 'refunded'].includes(newStatus);
    }
    
    // COD payments: can toggle between pending and completed
    return ['pending', 'completed', 'failed', 'refunded'].includes(newStatus);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg text-slate-400 hover:bg-slate-100 transition-colors"
        disabled={isUpdating}
      >
        <MoreHorizontal size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
          {/* Order Status Section */}
          <div className="relative">
            <button
              onClick={() => {
                setShowOrderStatuses(!showOrderStatuses);
                setShowPaymentStatuses(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Change Order Status</span>
              <ChevronRight size={16} className={`transition-transform ${showOrderStatuses ? 'rotate-90' : ''}`} />
            </button>

            {showOrderStatuses && (
              <div className="bg-slate-50 py-1">
                {orderStatuses.map((status) => {
                  const canChange = canChangeOrderStatus(order.status, status);
                  const isCurrent = order.status === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => canChange && handleStatusChange('status', status)}
                      disabled={!canChange || isUpdating}
                      className={`w-full px-8 py-1.5 text-left text-xs capitalize ${
                        isCurrent
                          ? 'text-slate-400 cursor-default'
                          : canChange
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-[#1e3a5f]'
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {status}
                      {isCurrent && ' (current)'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Payment Status Section */}
          <div className="relative border-t border-slate-100 mt-1 pt-1">
            <button
              onClick={() => {
                setShowPaymentStatuses(!showPaymentStatuses);
                setShowOrderStatuses(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between"
            >
              <span>Change Payment Status</span>
              <ChevronRight size={16} className={`transition-transform ${showPaymentStatuses ? 'rotate-90' : ''}`} />
            </button>

            {showPaymentStatuses && (
              <div className="bg-slate-50 py-1">
                {paymentStatuses.map((status) => {
                  const canChange = canChangePaymentStatus(order.payment_type, order.payment_status, status);
                  const isCurrent = order.payment_status === status;
                  
                  return (
                    <button
                      key={status}
                      onClick={() => canChange && handleStatusChange('payment_status', status)}
                      disabled={!canChange || isUpdating}
                      className={`w-full px-8 py-1.5 text-left text-xs capitalize ${
                        isCurrent
                          ? 'text-slate-400 cursor-default'
                          : canChange
                          ? 'text-slate-700 hover:bg-slate-100 hover:text-[#1e3a5f]'
                          : 'text-slate-300 cursor-not-allowed'
                      }`}
                    >
                      {status}
                      {isCurrent && ' (current)'}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderActionsDropdown;
