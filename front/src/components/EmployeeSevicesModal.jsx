import React, { useState, useEffect } from "react";
import { useEmployees } from "../hooks/useEmployees";
import Button from "./Button";
import Alert from "./Alert";
import api from "../api";

const EmployeeServicesModal = ({ employee, onClose }) => {
  const {
    getEmployeeServices,
    updateEmployeeServices,
    loading: subLoading,
  } = useEmployees();

  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [allServices, setAllServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const kategorijaMap = { sminkerka: "sminkanje", manikirka: "manikir" };
      const targetKategorija = kategorijaMap[employee.uloga];

      try {
        const [resMy, resAll] = await Promise.all([
          getEmployeeServices(employee.id),
          api.get("/usluge", { params: { kategorija: targetKategorija } }),
        ]);

        setMyServices(resMy);

        setAllServices(resAll.data.data);
      } catch (err) {
        console.error("Greška pri učitavanju podataka:", err);
        setMessage("Došlo je do greške pri osvežavanju usluga.");
      } finally {
        setLoading(false);
      }
    };

    if (employee?.id) {
      fetchData();
    }
  }, [employee.id, employee.uloga]);

  const addService = (service) => {
    if (!myServices.find((s) => s.id === service.id)) {
      setMyServices([...myServices, service]);
    }
  };

  const removeService = (id) => {
    setMyServices(myServices.filter((s) => s.id !== id));
  };

  const handleSave = async () => {
    setMessage(null);
    const serviceIds = myServices.map((s) => s.id);
    const result = await updateEmployeeServices(employee.id, serviceIds);

    if (result.success) {
      setMessage({ type: "success", text: result.message });
      setTimeout(onClose, 1500);
    } else {
      setMessage({ type: "error", text: result.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-pink-950/30 backdrop-blur-md">
      <div className="bg-white rounded-[3.5rem] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-white">
        <div className="p-10 bg-pink-900 text-white flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60 block mb-1">
              Kompetencije zaposlenog
            </span>
            <h2 className="text-3xl font-serif">{employee.ime_prezime}</h2>
            <p className="text-pink-200/70 text-xs italic mt-1 capitalize">
              Specijalizacija: {employee.uloga}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-2xl transition-all"
          >
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {loading ? (
            <div className="w-full py-20 text-center font-serif italic text-pink-900 animate-pulse">
              Učitavanje kataloga usluga...
            </div>
          ) : (
            <>
              <div className="flex-1 p-10 overflow-y-auto border-r border-gray-50">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400">
                    Aktivne usluge ({myServices.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {myServices.map((s) => (
                    <div
                      key={s.id}
                      className="flex justify-between items-center p-5 bg-pink-50/50 rounded-[1.8rem] border border-pink-100 group animate-in fade-in slide-in-from-left-4"
                    >
                      <span className="text-sm font-bold text-pink-900">
                        {s.naziv}
                      </span>
                      <button
                        onClick={() => removeService(s.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white text-pink-300 rounded-xl hover:text-red-500 hover:shadow-md transition-all"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {myServices.length === 0 && (
                    <div className="py-10 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
                      <p className="text-gray-300 italic text-sm font-light">
                        Nema dodeljenih usluga
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 p-10 overflow-y-auto bg-gray-50/30">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-6">
                  Dostupno u kategoriji
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  {allServices
                    .filter((s) => !myServices.find((ms) => ms.id === s.id))
                    .map((s) => (
                      <button
                        key={s.id}
                        onClick={() => addService(s)}
                        className="flex justify-between items-center p-5 bg-white rounded-[1.8rem] border border-transparent shadow-sm hover:border-pink-200 hover:shadow-md transition-all text-left group"
                      >
                        <span className="text-sm text-gray-600 font-medium group-hover:text-pink-900 transition-colors">
                          {s.naziv}
                        </span>
                        <span className="w-8 h-8 flex items-center justify-center rounded-xl bg-gray-50 text-gray-300 group-hover:bg-pink-900 group-hover:text-white transition-all">
                          +
                        </span>
                      </button>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="p-10 border-t border-gray-100 bg-white">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex-1 w-full">
              {message && <Alert type={message.type} message={message.text} />}
            </div>
            <div className="flex gap-4 w-full md:w-auto">
              <Button
                variant="ghost"
                onClick={onClose}
                className="!rounded-2xl px-8"
              >
                ODUSTANI
              </Button>
              <Button
                onClick={handleSave}
                isLoading={subLoading}
                className="!rounded-2xl px-10 shadow-xl shadow-pink-100 uppercase tracking-widest text-xs font-black"
              >
                SAČUVAJ IZMENE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeServicesModal;
