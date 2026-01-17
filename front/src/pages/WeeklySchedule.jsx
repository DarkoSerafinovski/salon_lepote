import React, { useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";

const WeeklySchedule = () => {
  const { schedule, loading, fetchWeeklySchedule } = useSchedule();

  useEffect(() => {
    fetchWeeklySchedule();
  }, [fetchWeeklySchedule]);

  const daysOrder = [
    "Ponedeljak",
    "Utorak",
    "Sreda",
    "Četvrtak",
    "Petak",
    "Subota",
    "Nedelja",
  ];

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic text-pink-900 animate-pulse text-xl">
        Učitavanje nedeljnog plana...
      </div>
    );

  return (
    <div className="max-w-[1600px] mx-auto p-8">
      <div className="mb-12 flex justify-between items-end border-b border-pink-100 pb-10">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-2 block">
            Organizacija tima
          </span>
          <h1 className="text-5xl font-serif text-gray-900">Nedeljni Planer</h1>
        </div>
        <p className="text-gray-400 italic font-light max-w-xs text-right hidden md:block">
          Pregled svih smena i radnih sati vašeg stručnog tima za tekuću
          nedelju.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-5">
        {daysOrder.map((day) => (
          <div
            key={day}
            className="group flex flex-col bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-pink-100/50 transition-all duration-500 overflow-hidden h-full"
          >
            <div className="bg-gray-50 group-hover:bg-pink-900 py-5 px-6 border-b border-gray-50 transition-colors duration-500 text-center">
              <span className="text-xs font-black text-gray-400 group-hover:text-white uppercase tracking-widest transition-colors duration-500">
                {day}
              </span>
            </div>

            <div className="p-5 space-y-4 flex-1 min-h-[350px]">
              {schedule[day] && schedule[day].length > 0 ? (
                schedule[day].map((shift, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="p-5 bg-pink-50/30 rounded-[1.8rem] border border-transparent hover:border-pink-200 hover:bg-white transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-bold text-gray-800 tracking-tight">
                        {shift.zaposleni}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-pink-400 rounded-full animate-pulse"></span>
                        <span className="text-[11px] font-mono font-medium text-pink-700 uppercase">
                          {shift.vreme_od} — {shift.vreme_do}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-3 opacity-20 group-hover:opacity-40 transition-opacity">
                  <div className="w-8 h-[1px] bg-pink-900"></div>
                  <span className="italic text-xs font-serif">
                    Slobodan dan
                  </span>
                  <div className="w-8 h-[1px] bg-pink-900"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklySchedule;
