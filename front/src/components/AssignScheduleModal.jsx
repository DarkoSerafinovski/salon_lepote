import React, { useState } from "react";
import { useSchedule } from "../hooks/useSchedule";
import Button from "./Button";
import Alert from "./Alert";

const AssignScheduleModal = ({ employee, onClose }) => {
  const { assignSchedule, loading } = useSchedule();
  const [message, setMessage] = useState(null);

  const initialDays = [
    {
      dan_u_nedelji: 1,
      naziv: "Ponedeljak",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 2,
      naziv: "Utorak",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 3,
      naziv: "Sreda",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 4,
      naziv: "Četvrtak",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 5,
      naziv: "Petak",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 6,
      naziv: "Subota",
      radi: true,
      vreme_od: "08:00",
      vreme_do: "14:00",
    },
    {
      dan_u_nedelji: 0,
      naziv: "Nedelja",
      radi: false,
      vreme_od: null,
      vreme_do: null,
    },
  ];

  const [raspored, setRaspored] = useState(initialDays);

  const handleToggleDay = (index) => {
    const noviRaspored = [...raspored];
    const dan = noviRaspored[index];
    dan.radi = !dan.radi;
    dan.vreme_od = dan.radi ? "08:00" : null;
    dan.vreme_do = dan.radi ? "14:00" : null;
    setRaspored(noviRaspored);
  };

  const handleTimeChange = (index, field, value) => {
    const noviRaspored = [...raspored];
    noviRaspored[index][field] = value;
    setRaspored(noviRaspored);
  };

  const handleSubmit = async () => {
    setMessage(null);
    const result = await assignSchedule(employee.id, raspored);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setTimeout(onClose, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-pink-950/40 backdrop-blur-md">
      <div className="bg-white rounded-[3.5rem] w-full max-w-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-white/50">
        <div className="p-10 border-b border-gray-50 flex justify-between items-center bg-white">
          <div>
            <h2 className="text-3xl font-serif text-gray-900">
              Postavljanje smena
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="w-1.5 h-1.5 bg-pink-500 rounded-full"></span>
              <p className="text-pink-600 text-[10px] font-black uppercase tracking-[0.2em]">
                {employee.ime_prezime}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:text-pink-900 transition-all text-2xl font-light"
          >
            &times;
          </button>
        </div>

        <div className="p-10 overflow-y-auto flex-1 space-y-4 bg-gray-50/30">
          {raspored.map((dan, index) => (
            <div
              key={dan.dan_u_nedelji}
              className={`group flex flex-wrap md:flex-nowrap items-center gap-6 p-6 rounded-[2rem] transition-all duration-300 ${
                dan.radi
                  ? "bg-white border border-pink-100 shadow-sm"
                  : "bg-gray-100/40 border border-transparent opacity-60"
              }`}
            >
              <div className="w-full md:w-32">
                <span
                  className={`text-base font-bold tracking-tight ${
                    dan.radi ? "text-gray-900" : "text-gray-400"
                  }`}
                >
                  {dan.naziv}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dan.radi}
                    onChange={() => handleToggleDay(index)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-pink-900"></div>
                  <span
                    className={`ml-3 text-[10px] font-black uppercase tracking-widest ${
                      dan.radi ? "text-pink-900" : "text-gray-300"
                    }`}
                  >
                    {dan.radi ? "Radi" : "Neradno"}
                  </span>
                </label>
              </div>

              {dan.radi && (
                <div className="flex items-center gap-3 ml-auto animate-in fade-in zoom-in-95 duration-300">
                  <div className="relative">
                    <input
                      type="time"
                      value={dan.vreme_od || ""}
                      onChange={(e) =>
                        handleTimeChange(index, "vreme_od", e.target.value)
                      }
                      className="bg-pink-50/50 border border-pink-100 rounded-2xl px-4 py-2 text-sm font-mono font-bold text-pink-900 outline-none focus:bg-white focus:ring-4 focus:ring-pink-100 transition-all"
                    />
                  </div>
                  <span className="text-pink-200 font-light">—</span>
                  <div className="relative">
                    <input
                      type="time"
                      value={dan.vreme_do || ""}
                      onChange={(e) =>
                        handleTimeChange(index, "vreme_do", e.target.value)
                      }
                      className="bg-pink-50/50 border border-pink-100 rounded-2xl px-4 py-2 text-sm font-mono font-bold text-pink-900 outline-none focus:bg-white focus:ring-4 focus:ring-pink-100 transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-10 bg-white border-t border-gray-50">
          {message && (
            <Alert
              type={message.type}
              message={message.text}
              className="mb-6"
            />
          )}

          <div className="flex gap-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 !rounded-2xl"
            >
              ODUSTANI
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={loading}
              className="flex-[2] !rounded-2xl shadow-xl shadow-pink-100 uppercase tracking-[0.2em] text-xs font-black"
            >
              SAČUVAJ PLAN RADA
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignScheduleModal;
