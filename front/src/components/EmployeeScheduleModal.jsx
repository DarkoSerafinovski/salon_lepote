import React, { useEffect } from "react";
import { useSchedule } from "../hooks/useSchedule";
import Button from "./Button";
import Alert from "./Alert";

const EmployeeScheduleModal = ({ employee, onClose, onAssignNew }) => {
  const { selectedEmployeeSchedule, fetchScheduleByEmployee, loading } =
    useSchedule();

  useEffect(() => {
    if (employee?.id) {
      fetchScheduleByEmployee(employee.id);
    }
  }, [employee.id, fetchScheduleByEmployee]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/20 backdrop-blur-md">
      <div className="bg-white rounded-[3.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col border border-white">
        <div className="p-10 bg-pink-900 text-white flex justify-between items-center relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 block mb-1">
              Pregled rada
            </span>
            <h2 className="text-3xl font-serif">{employee.ime_prezime}</h2>
          </div>

          <button
            onClick={onClose}
            className="relative z-10 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-all text-2xl font-light"
          >
            &times;
          </button>

          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="p-10 overflow-y-auto flex-1 bg-gray-50/50">
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-12 h-12 border-4 border-pink-100 border-t-pink-900 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="font-serif italic text-pink-900">
                Učitavanje rasporeda...
              </p>
            </div>
          ) : selectedEmployeeSchedule.length > 0 ? (
            <div className="space-y-4">
              {selectedEmployeeSchedule.map((day) => (
                <div
                  key={day.dan_id}
                  className={`flex items-center justify-between p-6 rounded-[2rem] border transition-all duration-300 ${
                    day.radi
                      ? "bg-white border-pink-50 shadow-sm"
                      : "bg-transparent border-dashed border-gray-200 opacity-40 grayscale"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        day.radi ? "bg-pink-500" : "bg-gray-300"
                      }`}
                    ></div>
                    <span
                      className={`text-base font-bold tracking-tight ${
                        day.radi ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {day.dan_naziv}
                    </span>
                  </div>

                  {day.radi ? (
                    <div className="flex flex-col items-end">
                      <span className="font-mono text-base font-black text-pink-900 bg-pink-50/50 px-4 py-1.5 rounded-full border border-pink-100">
                        {day.vreme_od} — {day.vreme_do}
                      </span>
                    </div>
                  ) : (
                    <span className="text-[10px] uppercase tracking-widest font-black text-gray-300 italic">
                      Van smene
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10">
              <Alert
                variant="panel"
                type="info"
                message="Nema definisanog rasporeda"
                description={`Zaposleni ${employee.ime_prezime} trenutno nema dodeljene radne sate. Definišite novi plan rada klikom na dugme ispod.`}
              />
            </div>
          )}
        </div>

        <div className="p-10 bg-white border-t border-gray-50 flex flex-col gap-4">
          <Button
            onClick={() => onAssignNew(employee)}
            fullWidth
            className="!rounded-2xl !py-5 shadow-xl shadow-pink-100 uppercase tracking-widest text-xs font-black"
          >
            DODELI NOVI RASPORED
          </Button>

          <button
            onClick={onClose}
            className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] hover:text-pink-900 transition-colors py-2"
          >
            Zatvori prozor
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduleModal;
