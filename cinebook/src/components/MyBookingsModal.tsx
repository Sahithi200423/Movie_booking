import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Ticket, Calendar, Clock, MapPin, Printer, Ban, CheckCircle2, ChevronRight } from 'lucide-react';
import { useBooking } from '../context/BookingContext';

interface MyBookingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MyBookingsModal: React.FC<MyBookingsModalProps> = ({ isOpen, onClose }) => {
  const { myBookings, cancelBooking } = useBooking();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleViewTicket = (bookingId: string) => {
    onClose();
    navigate(`/confirmation?id=${bookingId}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl border overflow-hidden bg-slate-900 border-slate-800 text-slate-100 z-10 max-h-[85vh] flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Ticket className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-white">My Cinema Tickets</h3>
              <p className="text-xs text-slate-400">Simulated bookings saved in your browser</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl border border-slate-800 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bookings List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {myBookings.length === 0 ? (
            <div className="text-center py-16">
              <Ticket className="w-12 h-12 mx-auto text-slate-600 mb-3" />
              <h4 className="text-base font-semibold text-slate-300">No tickets found</h4>
              <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                You haven’t booked any movie tickets yet. Pick a movie on the home screen to test the demo booking flow.
              </p>
            </div>
          ) : (
            myBookings.map(b => (
              <div
                key={b.bookingId}
                className={`p-4 rounded-xl border transition-all ${
                  b.status === 'confirmed'
                    ? 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/40'
                    : 'bg-slate-950/40 border-slate-800/50 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <img
                      src={b.moviePoster}
                      alt={b.movieTitle}
                      className="w-12 h-16 rounded-lg object-cover shadow-md bg-slate-950 shrink-0"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-400 tracking-wider">
                          #{b.bookingId}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                            b.status === 'confirmed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          {b.status === 'confirmed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Confirmed
                            </>
                          ) : (
                            <>
                              <Ban className="w-3 h-3" /> Cancelled
                            </>
                          )}
                        </span>
                      </div>
                      <h4 className="font-bold text-base text-white mt-1">{b.movieTitle}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
                        <span className="truncate">{b.cinemaName} • {b.hall}</span>
                      </p>
                    </div>
                  </div>

                  <div className="text-right sm:shrink-0">
                    <div className="text-xs text-slate-400">Total Paid</div>
                    <div className="text-base font-black text-indigo-400">
                      ${b.totalAmount.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Show Details Bar */}
                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{b.time} ({b.format})</span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 flex items-center gap-1.5">
                    <Ticket className="w-3.5 h-3.5 text-indigo-400" />
                    <span className="font-semibold text-indigo-400">
                      Seats: {b.seats.map(s => s.id).join(', ')}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  {b.status === 'confirmed' ? (
                    <button
                      onClick={() => {
                        if (confirm(`Cancel demo booking #${b.bookingId}?`)) {
                          cancelBooking(b.bookingId);
                        }
                      }}
                      className="text-xs text-slate-400 hover:text-rose-400 transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Ban className="w-3.5 h-3.5" />
                      <span>Cancel Demo Ticket</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-500">Booking cancelled</span>
                  )}

                  <button
                    onClick={() => handleViewTicket(b.bookingId)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all ml-auto cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>View & Print E-Ticket</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950/60 border-t border-slate-800 text-xs text-slate-500 flex justify-between items-center">
          <span>Tickets stay available in this browser session</span>
          <button
            onClick={onClose}
            className="px-3 py-1 text-xs rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
