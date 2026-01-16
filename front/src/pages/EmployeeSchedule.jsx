import React, { useState, useEffect } from "react";
import api from "../api";

const EmployeeSchedule = () => {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMySchedule = async () => {
      try {
        const response = await api.get("/zaposleni/moj-raspored-smena");
        setShifts(response.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju ličnog rasporeda");
      } finally {
        setLoading(false);
      }
    };
    fetchMySchedule();
  }, []);

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic text-pink-800">
        Učitavam tvoj raspored...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Moj Raspored</h1>
        <p className="text-gray-500 italic">Pregled radnih sati po danima</p>
      </div>

      <div className="space-y-4">
        {shifts.map((shift) => (
          <div
            key={shift.dan_id}
            className={`p-6 rounded-[2.5rem] border transition-all ${
              shift.radi
                ? "bg-white border-pink-50 shadow-sm"
                : "bg-gray-50/50 border-transparent opacity-60"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h3
                    className={`font-bold ${
                      shift.radi ? "text-gray-800" : "text-gray-500"
                    }`}
                  >
                    {shift.dan_naziv}
                  </h3>
                  {!shift.radi && (
                    <span className="text-xs uppercase tracking-widest font-black text-gray-400">
                      Slobodan dan
                    </span>
                  )}
                </div>
              </div>

              {shift.radi ? (
                <div className="text-right">
                  <div className="text-lg font-mono font-black text-pink-900">
                    {shift.vreme_od} - {shift.vreme_do}
                  </div>
                  <div className="text-[10px] uppercase tracking-widest text-pink-400 font-bold">
                    Radna smena
                  </div>
                </div>
              ) : (
                <div className="h-1 w-12 bg-gray-200 rounded-full"></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeSchedule;
