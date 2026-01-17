import React, { useState } from "react";
import { useServices } from "../hooks/useServices";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import FormSelect from "../components/FormSelect";

const CreateService = () => {
  const { createService, loading } = useServices();
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
    setMessage({ text: "", type: "error" });

    const result = await createService(formData);

    if (result.success) {
      setMessage({
        text: result.message || "Usluga je uspešno kreirana!",
        type: "success",
      });
      setFormData({
        naziv: "",
        kategorija: "",
        trajanje_usluge: "",
        cena: "",
        opis: "",
      });
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-pink-50">
        {/* Header */}
        <div className="bg-pink-900 p-10 text-white text-center">
          <h2 className="text-3xl font-serif mb-2">Nova Usluga</h2>
          <p className="opacity-70 italic font-light">
            Definišite novi tretman u ponudi salona
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
                label="Naziv usluge"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                placeholder="npr. Nadogradnja trepavica"
                required
              />
              <FormSelect
                label="Kategorija"
                name="kategorija"
                value={formData.kategorija}
                onChange={handleChange}
                options={kategorijeOptions}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Trajanje (minuta)"
                type="number"
                name="trajanje_usluge"
                value={formData.trajanje_usluge}
                onChange={handleChange}
                placeholder="npr. 90"
                required
              />
              <FormInput
                label="Cena (RSD)"
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                placeholder="npr. 4500"
                required
              />
            </div>

            {/* Ušminkana Textarea */}
            <div className="flex flex-col">
              <label className="block text-[10px] uppercase tracking-[0.2em] font-black text-gray-400 mb-3 ml-1">
                Opis usluge
              </label>
              <textarea
                name="opis"
                value={formData.opis}
                onChange={handleChange}
                rows="4"
                className="w-full px-6 py-4 bg-gray-50 border border-transparent rounded-[1.5rem] transition-all outline-none focus:bg-white focus:border-pink-200 focus:ring-4 focus:ring-pink-50 text-gray-700 font-light"
                placeholder="Detaljan opis tretmana koji klijenti vide prilikom zakazivanja..."
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="!bg-pink-900 hover:!bg-black mt-4 !py-4 !rounded-2xl shadow-xl shadow-pink-100 uppercase tracking-widest text-xs font-black"
            >
              DODAJ U KATALOG
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateService;
