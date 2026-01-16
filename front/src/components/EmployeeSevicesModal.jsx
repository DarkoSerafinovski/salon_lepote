import React, { useState, useEffect } from "react";
import api from "../api";
import Button from "./Button";
import Alert from "./Alert";

const EmployeeServicesModal = ({ employee, onClose }) => {
  const [myServices, setMyServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const kategorijaMap = {
          sminkerka: "sminkanje",
          manikirka: "manikir",
        };

        const targetKategorija = kategorijaMap[employee.uloga];
        const [resMy, resAll] = await Promise.all([
          api.get(`/vlasnica/zaposleni/${employee.id}/usluge`),
          api.get("/usluge", {
            params: { kategorija: targetKategorija },
          }),
        ]);

        setMyServices(resMy.data.data);
        setAllServices(resAll.data.data);
      } catch (err) {
        setMessage({ type: "error", text: "Greška pri učitavanju podataka." });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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
    setSubmitting(true);
    try {
      const payload = {
        user_id: employee.id,
        usluge: myServices.map((s) => s.id),
      };

      await api.post("/vlasnica/zaposleni/usluge", payload);
      setMessage({ type: "success", text: "Usluge su uspešno ažurirane!" });
      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Greška pri čuvanju izmena." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="p-8 bg-pink-800 text-white flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-serif">Upravljanje uslugama</h2>
            <p className="text-pink-200 text-sm italic">
              {employee.ime_prezime}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white/50 hover:text-white text-2xl"
          >
            &times;
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Usluge koje obavlja ({myServices.length})
            </h3>
            <div className="space-y-2">
              {myServices.map((s) => (
                <div
                  key={s.id}
                  className="flex justify-between items-center p-3 bg-pink-50 rounded-2xl border border-pink-100"
                >
                  <span className="text-sm font-medium text-pink-900">
                    {s.naziv}
                  </span>
                  <button
                    onClick={() => removeService(s.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white text-red-500 rounded-xl hover:bg-red-50 shadow-sm transition-colors"
                  >
                    &times;
                  </button>
                </div>
              ))}
              {myServices.length === 0 && (
                <p className="text-gray-400 italic text-sm">
                  Nema dodeljenih usluga.
                </p>
              )}
            </div>
          </div>

          <div className="border-l border-gray-100 pl-0 md:pl-8">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4">
              Dodaj nove usluge
            </h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {allServices
                .filter((s) => !myServices.find((ms) => ms.id === s.id))
                .map((s) => (
                  <div
                    key={s.id}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer group"
                    onClick={() => addService(s)}
                  >
                    <span className="text-sm text-gray-700">{s.naziv}</span>
                    <span className="text-green-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                      +
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
          <div className="flex-1 mr-4">
            {message && <Alert type={message.type} message={message.text} />}
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={onClose}>
              ODUSTANI
            </Button>
            <Button onClick={handleSave} isLoading={submitting}>
              SAČUVAJ IZMENE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeServicesModal;
