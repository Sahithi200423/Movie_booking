import React, { useState } from 'react';
import { Ticket, CheckCircle2 } from 'lucide-react';
import { generateQrCodeUrl } from '../features/tickets/ticketsService';

export const MyTicketsPage: React.FC = () => {
  const [selectedTicket] = useState<{
    ref: string;
    movie: string;
    hall: string;
    showTime: string;
    seats: string[];
    price: number;
  } | null>({
    ref: 'CB-849201-IN',
    movie: 'Kalki 2898 AD',
    hall: 'Audi 1 - IMAX Laser 3D',
    showTime: 'Today, 10:30 AM',
    seats: ['A10', 'A11'],
    price: 10.0, // 2 tickets * ₹5
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          My Digital Tickets
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Turnstile QR boarding passes for all confirmed ₹5 movie reservations.
        </p>
      </div>

      {selectedTicket ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 rounded-3xl bg-white dark:bg-[#121318] border border-slate-200 dark:border-slate-800 shadow-md">
          {/* Ticket Information */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                CONFIRMED PASS
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">
                #{selectedTicket.ref}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {selectedTicket.movie}
              </h2>
              <p className="text-xs text-slate-500">{selectedTicket.hall}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs pt-2">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Show Date & Time</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {selectedTicket.showTime}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 block text-[11px]">Seats Reserved</span>
                <span className="font-bold text-rose-500">
                  {selectedTicket.seats.join(', ')} ({selectedTicket.seats.length} seats)
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-slate-500">Total Price (₹5 / seat rule):</span>
              <span className="font-extrabold text-base text-slate-900 dark:text-white">
                ₹{selectedTicket.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Turnstile QR Code */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-center space-y-3">
            <div className="p-2 rounded-xl bg-white shadow-xs">
              <img
                src={generateQrCodeUrl(selectedTicket.ref)}
                alt="Ticket QR Code"
                className="w-36 h-36"
              />
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block">
                Turnstile Gatekeeper Pass
              </span>
              <span className="text-[10px] text-slate-400">Scan at cinema entry gate</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Ticket className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <h3 className="font-bold text-sm">No Active Tickets Found</h3>
          <p className="text-xs">Browse movies to book your next ₹5 cinema pass.</p>
        </div>
      )}
    </div>
  );
};
