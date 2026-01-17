import React, { useState, useEffect } from "react";
import { useBookings } from "../hooks/useBookings";
import Button from "./Button";

const BookingModal = ({ service, onClose, onConfirm }) => {
  const { fetchAvailableSlots, timeSlots, loadingSlots, bookTermin, error } =
    useBookings();

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (selectedDate) {
      fetchAvailableSlots(service.id, selectedDate);
      setSelectedTime(null);
    }
  }, [selectedDate, service.id]);

  const handleCompleteBooking = async () => {
    if (selectedDate && selectedTime) {
      setIsSubmitting(true);
      setLocalError("");

      const result = await bookTermin({
        service_id: service.id,
        datum: selectedDate,
        vreme: selectedTime,
      });

      if (result.success) {
        alert("Rezervacija uspesno izvrsena");

        onClose();
      } else {
        setLocalError(result.error);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-md">
      <div className="bg-white rounded-[3.5rem] w-full max-w-xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white">
        <div className="p-8 border-b border-gray-50 flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-pink-600 text-[10px] font-black uppercase tracking-[0.2em]">
              Zakazivanje termina
            </span>
            <h2 className="text-2xl font-serif text-gray-900">
              {service.naziv}
            </h2>
            <p className="text-gray-400 text-sm">
              {service.trajanje} min • {service.cena} RSD
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-pink-900 text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8 bg-gray-50/20">
          <section className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">
              Izaberi datum
            </label>
            <input
              type="date"
              min={new Date().toISOString().split("T")[0]}
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-pink-50 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-pink-100 transition-all font-serif shadow-sm"
            />
          </section>

          <section className="space-y-4">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400">
              Slobodni termini
            </label>

            {!selectedDate ? (
              <div className="text-center py-10 bg-white/50 rounded-[2rem] border border-dashed border-gray-200">
                <p className="text-gray-400 text-xs italic">
                  Prvo izaberi datum
                </p>
              </div>
            ) : loadingSlots ? (
              <div className="flex justify-center py-10">
                <div className="w-8 h-8 border-2 border-pink-100 border-t-pink-600 rounded-full animate-spin"></div>
              </div>
            ) : error || localError ? (
              <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-[11px] font-bold text-center">
                {error || localError}
              </div>
            ) : (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {timeSlots.map((slot, index) => (
                  <button
                    key={index}
                    disabled={!slot.dostupno}
                    onClick={() => setSelectedTime(slot.vreme)}
                    className={`py-3 rounded-xl text-xs font-mono font-bold transition-all ${
                      selectedTime === slot.vreme
                        ? "bg-pink-900 text-white shadow-lg shadow-pink-200 scale-105"
                        : slot.dostupno
                          ? "bg-white border border-pink-50 text-gray-700 hover:border-pink-300"
                          : "bg-gray-100/50 text-gray-300 cursor-not-allowed opacity-40"
                    }`}
                  >
                    {slot.vreme}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="p-8 border-t border-gray-50 bg-white">
          <Button
            fullWidth
            isLoading={isSubmitting}
            disabled={!selectedTime || isSubmitting}
            onClick={handleCompleteBooking}
            className="!rounded-2xl"
          >
            POTVRDI REZERVACIJU
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
