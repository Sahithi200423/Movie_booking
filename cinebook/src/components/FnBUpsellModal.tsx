import React, { useState } from 'react';
import {
  Utensils,
  Plus,
  Minus,
  ArrowRight,
  X,
  Sparkles,
  Armchair,
  Store,
  Check
} from 'lucide-react';
import { SNACK_ADDONS } from '../data/mockData';
import { useBooking } from '../context/BookingContext';
import { useTranslation } from '../context/LanguageContext';
import type { SnackAddon } from '../types';

interface FnBUpsellModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProceed: () => void;
}

type CategoryTab = 'all' | 'combo' | 'popcorn' | 'snack' | 'beverage';

export const FnBUpsellModal: React.FC<FnBUpsellModalProps> = ({
  isOpen,
  onClose,
  onProceed
}) => {
  const { activeBooking, updateAddonQuantity, setDeliveryPreference } = useBooking();
  const { formatPrice } = useTranslation();

  const [activeCategory, setActiveCategory] = useState<CategoryTab>('all');
  const [deliveryMode, setDeliveryMode] = useState<'seat' | 'counter'>('seat');

  if (!isOpen) return null;

  const filteredItems = SNACK_ADDONS.filter(item => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const selectedCount = Object.values(activeBooking.addons).reduce((sum, q) => sum + q, 0);

  const fnbSubtotal = Object.entries(activeBooking.addons).reduce((sum, [id, qty]) => {
    const item = SNACK_ADDONS.find(s => s.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleSkip = () => {
    setDeliveryPreference(deliveryMode);
    onProceed();
  };

  const handleAddAndContinue = () => {
    setDeliveryPreference(deliveryMode);
    onProceed();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[92vh] flex flex-col bg-[#14161F] border border-blue-500/30 rounded-3xl shadow-2xl overflow-hidden animate-scaleUp">
        
        {/* 1. MODAL HEADER */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-[#0E1017] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  Grab Fresh Concessions & Bites
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  <Sparkles className="w-3 h-3" /> Save up to 20%
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Pre-book snacks now to skip long queues at cinema counters.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. DELIVERY PREFERENCE TOGGLE BAR */}
        <div className="px-5 py-3.5 bg-[#1C1F2B] border-b border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
            <span>Select Delivery Preference:</span>
          </div>

          <div className="grid grid-cols-2 gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setDeliveryMode('seat')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                deliveryMode === 'seat'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'bg-[#14161F] text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              <Armchair className="w-4 h-4 text-blue-300" />
              <span>Deliver to my seat at interval</span>
              {deliveryMode === 'seat' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              type="button"
              onClick={() => setDeliveryMode('counter')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                deliveryMode === 'counter'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 scale-[1.02]'
                  : 'bg-[#14161F] text-slate-400 border border-white/10 hover:text-white'
              }`}
            >
              <Store className="w-4 h-4 text-blue-300" />
              <span>Pick up from counter</span>
              {deliveryMode === 'counter' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 3. CATEGORY FILTER TABS */}
        <div className="px-5 py-3 border-b border-white/10 bg-[#0E1017] flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Items' },
            { id: 'combo', label: '🍿 Combos' },
            { id: 'popcorn', label: '🍿 Popcorn' },
            { id: 'snack', label: '🧀 Snacks & Nachos' },
            { id: 'beverage', label: '🥤 Beverages' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id as CategoryTab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === tab.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                  : 'bg-[#1C1F2B] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 4. SCROLLABLE FOOD ITEMS LIST */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item: SnackAddon) => {
              const quantity = activeBooking.addons[item.id] || 0;

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                    quantity > 0
                      ? 'bg-blue-950/20 border-blue-500/40 shadow-lg'
                      : 'bg-[#1C1F2B] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-3">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 border border-white/10"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="font-bold text-white text-sm leading-snug">
                          {item.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                      <div className="text-sm font-black text-amber-400 mt-2">
                        {formatPrice(item.price)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      {quantity > 0 ? (
                        <span className="text-emerald-400 font-bold">
                          Subtotal: {formatPrice(item.price * quantity)}
                        </span>
                      ) : (
                        'Freshly prepared'
                      )}
                    </span>

                    {/* Counter Buttons */}
                    <div className="flex items-center gap-2">
                      {quantity > 0 ? (
                        <>
                          <button
                            type="button"
                            onClick={() => updateAddonQuantity(item.id, quantity - 1)}
                            className="w-8 h-8 rounded-lg bg-[#14161F] hover:bg-[#252a3a] text-slate-300 hover:text-white border border-white/15 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-6 text-center font-mono font-bold text-sm text-white">
                            {quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateAddonQuantity(item.id, quantity + 1)}
                            className="w-8 h-8 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors shadow-md cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => updateAddonQuantity(item.id, 1)}
                          className="px-4 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white text-xs font-bold transition-all cursor-pointer"
                        >
                          + Add
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. MODAL BOTTOM BAR WITH SKIP & ADD & CONTINUE */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E1017] flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center justify-between w-full sm:w-auto sm:justify-start gap-4">
            <div className="text-left">
              <div className="text-[11px] text-slate-400">
                Selected: <span className="text-white font-bold">{selectedCount} {selectedCount === 1 ? 'Item' : 'Items'}</span>
                {deliveryMode === 'seat' ? ' • Delivered to seat' : ' • Counter pickup'}
              </div>
              <div className="text-lg font-black text-amber-400">
                F&B Total: {formatPrice(fnbSubtotal)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Skip to Payment Secondary Button */}
            <button
              type="button"
              onClick={handleSkip}
              className="flex-1 sm:flex-none px-5 py-3 rounded-full border border-white/10 bg-[#1C1F2B] hover:bg-[#252a3a] text-slate-300 hover:text-white text-xs sm:text-sm font-bold transition-colors cursor-pointer"
            >
              Skip to Payment
            </button>

            {/* Add & Continue Primary CTA */}
            <button
              type="button"
              onClick={handleAddAndContinue}
              className="flex-1 sm:flex-none px-7 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs sm:text-sm font-extrabold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer"
            >
              <span>{selectedCount > 0 ? `Add & Continue (${formatPrice(fnbSubtotal)})` : 'Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FnBUpsellModal;
