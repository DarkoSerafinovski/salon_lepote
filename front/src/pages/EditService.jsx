import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api";
import FormInput from "../components/FormInput";
import FormSelect from "../components/FormSelect";
import Button from "../components/Button";
import Alert from "../components/Alert";

const EditService = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userType = localStorage.getItem("user_type");

  const [submitting, setSubmitting] = useState(false);
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
    setSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    data.append("_method", "PUT");

    try {
      const response = await api.post(`/usluge/${formData.id}`, data);
      setMessage({ text: response.data.message, type: "success" });
    } catch (err) {
      console.log(err.response.data.error);
      setMessage({
        text: err.response?.data?.error || "Greška",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-pink-100/30 overflow-hidden border border-pink-50">
        <div
          className={`${
            userType === "vlasnica" ? "bg-amber-800" : "bg-pink-800"
          } p-10 text-white`}
        >
          <h2 className="text-3xl font-serif mb-2">
            {userType === "vlasnica"
              ? "Ažuriranje Usluge"
              : "Predlog za Izmenu"}
          </h2>
          <p className="opacity-70 italic text-sm">Menjate: {formData.naziv}</p>
        </div>

        <div className="p-10">
          <Alert message={message.text} type={message.type} className="mb-8" />

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Naziv"
                name="naziv"
                value={formData.naziv}
                onChange={handleChange}
                accentColor={userType === "vlasnica" ? "gold" : "pink"}
              />
              <FormSelect
                label="Kategorija"
                name="kategorija"
                value={formData.kategorija}
                onChange={handleChange}
                accentColor={userType === "vlasnica" ? "gold" : "pink"}
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
                accentColor={userType === "vlasnica" ? "gold" : "pink"}
              />
              <FormInput
                label="Cena (RSD)"
                type="number"
                name="cena"
                value={formData.cena}
                onChange={handleChange}
                accentColor={userType === "vlasnica" ? "gold" : "pink"}
              />
            </div>

            <div className="flex flex-col">
              <label className="text-xs uppercase font-bold text-gray-400 mb-2 ml-1">
                Opis tretmana
              </label>
              <textarea
                name="opis"
                value={formData.opis}
                onChange={handleChange}
                rows="4"
                className={`p-5 bg-gray-50 border border-transparent rounded-2xl outline-none focus:bg-white focus:ring-4 transition-all ${
                  userType === "vlasnica"
                    ? "focus:border-amber-200 focus:ring-amber-50"
                    : "focus:border-pink-200 focus:ring-pink-50"
                }`}
              />
            </div>

            <Button
              type="submit"
              fullWidth
              isLoading={submitting}
              className={
                userType === "vlasnica"
                  ? "!bg-amber-800 hover:!bg-amber-900"
                  : ""
              }
            >
              {userType === "vlasnica"
                ? "SAČUVAJ PROMENE"
                : "POŠALJI NA ODOBRENJE"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditService;
