import React, { useState, useEffect } from "react";
import api from "../api";
import Button from "./Button";
import Alert from "./Alert";

const EmployeeScheduleModal = ({ employee, onClose, onAssignNew }) => {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await api.get(
          `/vlasnica/radno-vreme/raspored/${employee.id}`
        );
        setSchedule(response.data.data || []);
      } catch (err) {
        console.error("Greška pri učitavanju rasporeda zaposlenog");
        setSchedule([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSchedule();
  }, [employee.id]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 bg-pink-900 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-serif">Raspored rada</h2>
            <p className="text-pink-200 text-xs uppercase tracking-widest">
              {employee.ime_prezime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-3xl transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 bg-gray-50/30">
          {loading ? (
            <div className="py-10 text-center italic text-pink-800 animate-pulse">
              Učitavanje...
            </div>
          ) : schedule.length > 0 ? (
            <div className="space-y-3">
              {schedule.map((day) => (
                <div
                  key={day.dan_id}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                    day.radi
                      ? "bg-white border-pink-100 shadow-sm"
                      : "bg-transparent border-dashed border-gray-200 opacity-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`font-bold text-sm ${
                        day.radi ? "text-gray-800" : "text-gray-400"
                      }`}
                    >
                      {day.dan_naziv}
                    </span>
                  </div>

                  {day.radi ? (
                    <span className="font-mono text-sm font-black text-pink-900 bg-pink-50 px-3 py-1 rounded-full">
                      {day.vreme_od} - {day.vreme_do}
                    </span>
                  ) : (
                    <span className="text-[10px] uppercase tracking-tighter font-bold text-gray-400 italic">
                      Neradni dan
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <Alert
              variant="panel"
              message="Nema definisanog rasporeda"
              description="Zaposleni trenutno nema dodeljene radne sate za ovu nedelju.
                  Kliknite na dugme ispod kako biste definisali smene."
            ></Alert>
          )}
        </div>

        <div className="p-8 border-t border-gray-100 flex flex-col gap-3">
          <Button
            onClick={() => onAssignNew(employee)}
            fullWidth
            className="!rounded-2xl"
          >
            DODELI NOVI RASPORED
          </Button>
          <button
            onClick={onClose}
            className="text-xs font-black text-gray-400 uppercase tracking-widest hover:text-gray-600 transition-colors py-2"
          >
            Zatvori pregled
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeScheduleModal;
