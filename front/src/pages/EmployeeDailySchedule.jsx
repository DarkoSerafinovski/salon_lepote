import React, { useState, useEffect } from "react";
import { useBookings } from "../hooks/useBookings";
import BookingCard from "../components/BookingCard";

const EmployeeDailySchedule = () => {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);
  const { dailySchedule, scheduleMessage, fetchDailySchedule, loading } =
    useBookings();

  useEffect(() => {
    fetchDailySchedule(selectedDate);
  }, [selectedDate]);

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-12">
      <div className="bg-pink-900 rounded-[3.5rem] p-10 text-white shadow-2xl mb-12 relative overflow-hidden">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
          <div>
            <h1 className="text-3xl font-serif italic tracking-wide">
              Dnevni Planer
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></span>
              <p className="text-pink-200 text-[10px] font-black uppercase tracking-[0.2em]">
                Pregled obaveza
              </p>
            </div>
          </div>

          <div className="group">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-2xl px-6 py-3 text-sm outline-none focus:bg-white/20 focus:border-white/40 transition-all text-white font-medium cursor-pointer"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-32 text-center">
          <div className="inline-block w-8 h-8 border-2 border-pink-100 border-t-pink-800 rounded-full animate-spin mb-4"></div>
          <p className="text-pink-900 font-serif italic text-lg">
            Osvežavam vaš raspored...
          </p>
        </div>
      ) : dailySchedule.length > 0 ? (
        <div className="space-y-6 relative before:absolute before:inset-0 before:left-8 before:w-px before:bg-gradient-to-b before:from-pink-100 before:via-pink-200 before:to-transparent">
          {dailySchedule.map((item) => (
            <BookingCard key={item.id} booking={item} variant="employee" />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[4rem] p-20 text-center border border-gray-50 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-pink-100 to-transparent"></div>
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl italic font-serif text-gray-200">!</span>
          </div>
          <h2 className="text-2xl font-serif text-gray-900 mb-3 italic">
            Odmor
          </h2>
          <p className="text-gray-400 text-sm max-w-[240px] mx-auto font-medium leading-relaxed">
            {scheduleMessage ||
              "Trenutno nemate zakazanih termina. Iskoristite vreme za kafu i predah!"}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmployeeDailySchedule;
