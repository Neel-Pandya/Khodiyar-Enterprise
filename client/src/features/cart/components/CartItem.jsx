import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Trash2 } from 'lucide-react';
import QuantitySelector from './QuantitySelector';
import { useUpdateQuantityMutation, useRemoveFromCartMutation } from '@/hooks/useCartQueries';
import useCartStore from '@/store/useCartStore';

const DEBOUNCE_DELAY = 400; // ms

const CartItem = ({ item }) => {
  const { mutateAsync: updateQuantity, isPending: isUpdating } = useUpdateQuantityMutation();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveFromCartMutation();
  const { updateItemOptimistic } = useCartStore();
  const [localQuantity, setLocalQuantity] = useState(item.quantity);

  // Refs for debounce
  const debounceTimerRef = useRef(null);
  const pendingQuantityRef = useRef(item.quantity);
  const lastSyncedQuantityRef = useRef(item.quantity);

  // Sync local quantity when item prop changes (e.g., data refresh)
  useEffect(() => {
    setLocalQuantity(item.quantity);
    // Don't update lastSyncedQuantityRef here - it tracks what was actually sent to server
    pendingQuantityRef.current = item.quantity;
  }, [item.quantity]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const syncToServer = useCallback(async (targetQuantity) => {
    try {
      await updateQuantity({ cartId: item.id, quantity: targetQuantity });
      lastSyncedQuantityRef.current = targetQuantity;
    } catch (error) {
      setLocalQuantity(lastSyncedQuantityRef.current);
      updateItemOptimistic(item.id, lastSyncedQuantityRef.current);
    }
  }, [item.id, updateQuantity, updateItemOptimistic]);

  const debouncedSync = useCallback((newQuantity) => {
    pendingQuantityRef.current = newQuantity;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      if (pendingQuantityRef.current !== lastSyncedQuantityRef.current) {
        syncToServer(pendingQuantityRef.current);
      }
    }, DEBOUNCE_DELAY);
  }, [syncToServer]);

  const handleIncrease = () => {
    const newQuantity = localQuantity + 1;

    // Optimistic update
    setLocalQuantity(newQuantity);
    updateItemOptimistic(item.id, newQuantity);

    // Debounced API call
    debouncedSync(newQuantity);
  };

  const handleDecrease = () => {
    if (localQuantity <= 1) return;

    const newQuantity = localQuantity - 1;

    // Optimistic update
    setLocalQuantity(newQuantity);
    updateItemOptimistic(item.id, newQuantity);

    // Debounced API call
    debouncedSync(newQuantity);
  };

  const handleRemove = () => {
    // Cancel any pending debounce before removing
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    removeItem(item.id);
  };

  const product = item.product;
  const price = parseFloat(product.price);
  const image = product.images?.[0] || 'https://via.placeholder.com/150';

  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-6 group hover:shadow-2xl transition-all duration-300">
      {/* Product Image */}
      <div className="w-full md:w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Product Details */}
      <div className="flex-grow text-center md:text-left">
        <h3 className="text-xl font-black text-primary mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-text-muted font-medium mb-3">
          Unit Price: ₹{price.toLocaleString()}
        </p>

        <div className="flex items-center justify-center md:justify-start gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          <span className="text-xs font-bold text-green-600 uppercase tracking-wider">In Stock</span>
        </div>
      </div>

      {/* Controls & Price */}
      <div className="flex flex-col items-center md:items-end gap-4 w-full md:w-auto">
        <div className="flex items-center gap-4">
          <QuantitySelector
            quantity={localQuantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
            isUpdating={isUpdating}
          />

          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm disabled:opacity-50"
            aria-label="Remove item"
          >
            <Trash2 size={20} />
          </button>
        </div>

        <div className="text-center md:text-right">
          <p className="text-[10px] font-black uppercase tracking-widest text-text-muted mb-1">Item Total</p>
          <p className="text-2xl font-black text-primary">
            ₹{(price * localQuantity).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
