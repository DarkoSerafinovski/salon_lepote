import React, { useState } from "react";
import api from "../api";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import FormSelect from "../components/FormSelect";

const CreateService = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "error" });
  const [formData, setFormData] = useState({
    naziv: "",
    kategorija: "",
    trajanje_usluge: "",
    cena: "",
    opis: "",
  });

  const kategorijeOptions = [
    { value: "sminkanje", label: "Šminkanje" },
    { value: "manikir", label: "Manikir" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "error" });

    try {
      const response = await api.post("/vlasnica/usluge", formData);

      setMessage({
        text: response.data.message || "Usluga je uspešno kreirana!",
        type: "success",
      });

      setFormData({
        naziv: "",
        kategorija: "",
        trajanje_usluge: "",
        cena: "",
        opis: "",
      });
    } catch (err) {
      const errorMsg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Došlo je do greške prilikom kreiranja usluge.";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-50">
        <div className="bg-amber-800 p-8 text-white text-center">
          <h2 className="text-3xl font-serif">Nova Usluga</h2>
          <p className="opacity-80">Definišite novi tretman u ponudi salona</p>
        </div>

        <div className="p-8 md:p-10">
          <Alert message={message.text} type={message.type} className="mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Naziv usluge"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                placeholder="npr. Nadogradnja trepavica"
                accentColor="gold"
                required
              />
              <FormSelect
                label="Kategorija"
                name="kategorija"
                value={formData.kategorija}
                onChange={handleChange}
                options={kategorijeOptions}
                accentColor="gold"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Trajanje (minuta)"
                type="number"
                name="trajanje_usluge"
                value={formData.trajanje_usluge}
                onChange={handleChange}
                placeholder="npr. 90"
                accentColor="gold"
                required
              />
              <FormInput
                label="Cena (RSD)"
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                placeholder="npr. 4500"
                accentColor="gold"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="block text-xs uppercase tracking-widest font-bold text-gray-400 mb-2 ml-1">
                Opis usluge
              </label>
              <textarea
                name="opis"
                value={formData.opis}
                onChange={handleChange}
                rows="4"
                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-xl transition-all outline-none focus:bg-white focus:border-amber-300 focus:ring-4 focus:ring-amber-100"
                placeholder="Detaljan opis tretmana..."
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="!bg-amber-800 hover:!bg-amber-900 mt-4 shadow-lg shadow-amber-100"
            >
              KREIRAJ USLUGU
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
