import React, { useState, useEffect } from "react";
import api from "../api";

const WeeklySchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get("/vlasnica/radno-vreme/raspored");
        setSchedule(response.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju rasporeda");
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, []);

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
      <div className="p-20 text-center font-serif italic text-pink-800 animate-pulse">
        Učitavanje rasporeda...
      </div>
    );

  return (
    <div className="max-w-[1400px] mx-auto p-8">
      <div className="mb-12 border-b border-pink-100 pb-8">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">
          Nedeljni Planer
        </h1>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
          Radno vreme tima
        </p>
      </div>

      {/* Grid sa fiksnim brojem kolona za desktop, ali sa proredom */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-6">
        {daysOrder.map((day) => (
          <div
            key={day}
            className="flex flex-col bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden h-full"
          >
            {/* Header Dana */}
            <div className="bg-pink-50/50 py-4 px-6 border-b border-gray-50 text-center">
              <span className="text-sm font-black text-pink-900 uppercase tracking-tighter">
                {day}
              </span>
            </div>

            {/* Lista smena */}
            <div className="p-4 space-y-3 flex-1 min-h-[300px]">
              {schedule[day] && schedule[day].length > 0 ? (
                schedule[day].map((shift, index) => (
                  <div
                    key={`${day}-${index}`}
                    className="p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-pink-200 hover:bg-white transition-all group"
                  >
                    <p className="text-sm font-bold text-gray-800 mb-1 group-hover:text-pink-700 transition-colors">
                      {shift.zaposleni}
                    </p>
                    <div className="flex items-center text-[11px] font-mono text-gray-500 bg-white/50 py-1 px-2 rounded-md inline-block">
                      {shift.vreme_od} - {shift.vreme_do}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center italic text-gray-300 text-xs">
                  Nema smena
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
