import React, { useState } from "react";
import api from "../api";
import Button from "./Button";
import Alert from "./Alert";

const AssignScheduleModal = ({ employee, onClose }) => {
  // Inicijalni niz dana (0 je nedelja, 1-6 su pon-sub)
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
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const handleToggleDay = (index) => {
    const noviRaspored = [...raspored];
    const dan = noviRaspored[index];
    dan.radi = !dan.radi;

    if (dan.radi) {
      dan.vreme_od = "08:00";
      dan.vreme_do = "14:00";
    } else {
      dan.vreme_od = null;
      dan.vreme_do = null;
    }
    setRaspored(noviRaspored);
  };

  const handleTimeChange = (index, field, value) => {
    const noviRaspored = [...raspored];
    noviRaspored[index][field] = value;
    setRaspored(noviRaspored);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const payload = {
        user_id: employee.id,
        raspored: raspored.map(({ naziv, ...rest }) => rest),
      };

      await api.post("/vlasnica/radno-vreme", payload);
      setMessage({ type: "success", text: "Raspored uspešno sačuvan!" });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      setMessage({ type: "error", text: "Greška pri čuvanju rasporeda." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif text-gray-900">Novi raspored</h2>
            <p className="text-pink-600 text-xs font-black uppercase tracking-widest mt-1">
              {employee.ime_prezime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-300 hover:text-gray-900 text-3xl transition-colors"
          >
            &times;
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-4 bg-gray-50/20">
          {raspored.map((dan, index) => (
            <div
              key={dan.dan_u_nedelji}
              className={`flex flex-wrap md:flex-nowrap items-center gap-4 p-4 rounded-3xl transition-all ${
                dan.radi
                  ? "bg-white border border-pink-100 shadow-sm"
                  : "bg-gray-100/50 border border-transparent opacity-60"
              }`}
            >
              <div className="w-full md:w-32">
                <span className="font-bold text-gray-700">{dan.naziv}</span>
              </div>

              <div className="flex items-center gap-2 mr-auto">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={dan.radi}
                    onChange={() => handleToggleDay(index)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-pink-600"></div>
                  <span className="ml-3 text-xs font-bold text-gray-400 uppercase tracking-tighter">
                    {dan.radi ? "Radi" : "Neradno"}
                  </span>
                </label>
              </div>

              {dan.radi && (
                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-left-2">
                  <input
                    type="time"
                    value={dan.vreme_od || ""}
                    onChange={(e) =>
                      handleTimeChange(index, "vreme_od", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-pink-100 outline-none"
                  />
                  <span className="text-gray-300">—</span>
                  <input
                    type="time"
                    value={dan.vreme_do || ""}
                    onChange={(e) =>
                      handleTimeChange(index, "vreme_do", e.target.value)
                    }
                    className="bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-sm font-mono focus:ring-2 focus:ring-pink-100 outline-none"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="p-8 border-t border-gray-100 bg-white">
          {message && (
            <div className="mb-4">
              <Alert type={message.type} message={message.text} />
            </div>
          )}
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose} className="flex-1">
              ODUSTANI
            </Button>
            <Button
              onClick={handleSubmit}
              isLoading={submitting}
              className="flex-[2]"
            >
              SAČUVAJ RASPORED
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignScheduleModal;
