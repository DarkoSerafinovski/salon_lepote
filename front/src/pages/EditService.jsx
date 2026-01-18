import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useServices } from "../hooks/useServices";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useAuth } from "../hooks/useAuth";

const EditService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { updateService, loading } = useServices();
  const { getUserData } = useAuth();
  const user = getUserData();

  const [message, setMessage] = useState({ text: "", type: "error" });
  const [formData, setFormData] = useState({
    id: location.state?.service?.id || 0,
    naziv: location.state?.service?.naziv || "",
    kategorija: location.state?.service?.kategorija || "",
    trajanje_usluge: location.state?.service?.trajanje?.split(" ")[0] || "",
    cena: location.state?.service?.cena_raw || "",
    opis: location.state?.service?.opis || "",
  });

  useEffect(() => {
    if (!location.state?.service) {
      setMessage({
        text: "Podaci o usluzi nisu pronađeni. Vratite se na listu.",
        type: "error",
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "error" });

    const result = await updateService(formData.id, formData);

    if (result.success) {
      setMessage({ text: result.message, type: "success" });
      setTimeout(() => navigate("/services"), 2000);
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-pink-100/40 overflow-hidden border border-pink-50">
        <div className="bg-pink-900 p-10 text-white">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
            Administracija kataloga
          </span>
          <h2 className="text-3xl font-serif mt-2 mb-1">
            {user.type === "vlasnica"
              ? "Ažuriranje Usluge"
              : "Predlog za Izmenu"}
          </h2>
          <p className="opacity-70 italic text-sm font-light">
            Trenutno menjate:{" "}
            <span className="font-bold">{formData.naziv}</span>
          </p>
        </div>

        <div className="p-8 md:p-12">
          {message.text && (
            <Alert
              message={message.text}
              type={message.type}
              className="mb-8"
            />
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Naziv"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                accentColor="pink"
              />
              <FormSelect
                label="Kategorija"
                name="kategorija"
                value={formData.kategorija}
                onChange={handleChange}
                accentColor="pink"
                options={[
                  { value: "sminkanje", label: "Šminkanje" },
                  { value: "manikir", label: "Manikir" },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Trajanje (min)"
                type="number"
                name="trajanje_usluge"
                value={formData.trajanje_usluge}
                onChange={handleChange}
                accentColor="pink"
              />
              <FormInput
                label="Cena (RSD)"
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                accentColor="pink"
              />
            </div>

            <div className="flex flex-col">
              <label className="text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 ml-1">
                Opis tretmana
              </label>
              <textarea
                name="opis"
                value={formData.opis}
                onChange={handleChange}
                rows="4"
                className="p-6 bg-gray-50 border border-transparent rounded-[1.5rem] outline-none focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 transition-all font-light text-gray-700"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                className="!rounded-2xl px-8"
              >
                ODUSTANI
              </Button>
              <Button
                type="submit"
                fullWidth
                isLoading={loading}
                className="!bg-pink-900 shadow-xl shadow-pink-100 !py-4 !rounded-2xl uppercase tracking-widest text-xs font-black"
              >
                {user.type === "vlasnica"
                  ? "SAČUVAJ PROMENE"
                  : "POŠALJI NA ODOBRENJE"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditService;
