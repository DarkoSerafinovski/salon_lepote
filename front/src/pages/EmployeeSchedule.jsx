import React, { useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";

const EmployeeSchedule = () => {
  const { myShifts, fetchMySchedule, loading } = useSchedule();

  useEffect(() => {
    fetchMySchedule();
  }, [fetchMySchedule]);

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic text-pink-900 animate-pulse text-xl">
        Pripremam tvoj raspored...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-12 text-center">
        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-pink-500 mb-2 block">
          Tvoji radni dani
        </span>
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Moj Raspored</h1>
        <p className="text-gray-400 italic font-light">
          Pregled tvojih smena za tekuću nedelju
        </p>
      </div>

      <div className="space-y-5">
        {myShifts.map((shift) => (
          <div
            key={shift.dan_id}
            className={`p-8 rounded-[2.5rem] border transition-all duration-500 ${
              shift.radi
                ? "bg-white border-pink-50 shadow-xl shadow-pink-100/20"
                : "bg-gray-50/40 border-transparent opacity-50 grayscale-[0.5]"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h3
                  className={`text-xl font-serif ${
                    shift.radi ? "text-pink-900" : "text-gray-400"
                  }`}
                >
                  {shift.dan_naziv}
                </h3>
                {!shift.radi && (
                  <span className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-300">
                    Zaslužen odmor
                  </span>
                )}
              </div>

              {shift.radi ? (
                <div className="text-right">
                  <div className="flex items-baseline gap-1 text-pink-900">
                    <span className="text-2xl font-mono font-black tracking-tighter">
                      {shift.vreme_od}
                    </span>
                    <span className="text-sm opacity-30 font-light">—</span>
                    <span className="text-2xl font-mono font-black tracking-tighter">
                      {shift.vreme_do}
                    </span>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <span className="w-1 h-1 bg-pink-400 rounded-full"></span>
                    <span className="text-[10px] uppercase tracking-widest text-pink-400 font-black">
                      Aktivna smena
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-[1px] bg-gray-200"></div>
                  <span className="text-gray-300 text-xs italic">Off</span>
                  <div className="w-6 h-[1px] bg-gray-200"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSchedule;
