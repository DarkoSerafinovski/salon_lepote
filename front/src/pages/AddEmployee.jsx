import React, { useState } from "react";
import api from "../api";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";

const AddEmployee = () => {
  const [role, setRole] = useState("sminkerka");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "error" });

  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    password: "",
    radni_staz: "",
    tip_tehnike: "",
    broj_manikir_sertifikata: "",
    tip_tretmana: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "error" });

    const commonData = {
      ime: formData.ime,
      prezime: formData.prezime,
      email: formData.email,
      password: formData.password,
      type: role,
      radni_staz: formData.radni_staz,
    };

    const finalData =
      role === "sminkerka"
        ? { ...commonData, tip_tehnike: formData.tip_tehnike }
        : {
            ...commonData,
            broj_manikir_sertifikata: formData.broj_manikir_sertifikata,
            tip_tretmana: formData.tip_tretmana,
          };

    try {
      await api.post("/register", finalData);
      setMessage({
        text: `Uspešno registrovan zaposleni: ${formData.ime}`,
        type: "success",
      });
      setFormData({
        ime: "",
        prezime: "",
        email: "",
        password: "",
        radni_staz: "",
        tip_tehnike: "",
        broj_manikir_sertifikata: "",
        tip_tretmana: "",
      });
    } catch (err) {
      const errorMsg =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Greška pri registraciji";
      setMessage({ text: errorMsg, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-amber-50">
        <div className="bg-amber-800 p-8 text-white text-center">
          <h2 className="text-3xl font-serif">Novi Zaposleni</h2>
          <p className="opacity-80">Dodajte šminkera ili manikira u svoj tim</p>
        </div>

        <div className="p-8 md:p-10">
          <Alert message={message.text} type={message.type} className="mb-8" />

          <div className="flex gap-4 mb-8 bg-gray-100/50 p-2 rounded-2xl border border-gray-100">
            <Button
              type="button"
              onClick={() => setRole("sminkerka")}
              variant={role === "sminkerka" ? "secondary" : "ghost"}
              fullWidth
              className={`
            !rounded-xl transition-all duration-300
            ${
              role === "sminkerka"
                ? "!bg-amber-800 hover:!bg-amber-900 shadow-md text-white"
                : "text-gray-400"
            }
        `}
            >
              ŠMINKERKA
            </Button>

            <Button
              type="button"
              onClick={() => setRole("manikirka")}
              variant={role === "manikirka" ? "secondary" : "ghost"}
              fullWidth
              className={`
            !rounded-xl transition-all duration-300
            ${
              role === "manikirka"
                ? "!bg-amber-800 hover:!bg-amber-900 shadow-md text-white"
                : "text-gray-400"
            }
        `}
            >
              MANIKIRKA
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormInput
                label="Ime"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                accentColor="gold"
                required
              />
              <FormInput
                label="Prezime"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
                accentColor="gold"
                required
              />
            </div>

            <FormInput
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              accentColor="gold"
              required
            />

            <FormInput
              label="Lozinka"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              accentColor="gold"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-100">
              <FormInput
                label="Radni staž (godine)"
                type="number"
                name="radni_staz"
                value={formData.radni_staz}
                onChange={handleChange}
                accentColor="gold"
                required
              />

              {role === "sminkerka" ? (
                <FormInput
                  label="Tip tehnike"
                  name="tip_tehnike"
                  value={formData.tip_tehnike}
                  onChange={handleChange}
                  placeholder="npr. Editorial & Glam"
                  accentColor="gold"
                  required
                />
              ) : (
                <FormInput
                  label="Broj sertifikata"
                  name="broj_manikir_sertifikata"
                  value={formData.broj_manikir_sertifikata}
                  onChange={handleChange}
                  placeholder="SRB-152-15"
                  accentColor="gold"
                  required
                />
              )}
            </div>

            {role === "manikirka" && (
              <FormInput
                label="Tip tretmana"
                name="tip_tretmana"
                value={formData.tip_tretmana}
                onChange={handleChange}
                placeholder="Gel, Akril, Polygel"
                accentColor="gold"
                required
              />
            )}

            <Button
              type="submit"
              variant="secondary"
              fullWidth
              isLoading={loading}
              className="!bg-amber-800 hover:!bg-amber-900 mt-4"
            >
              REGISTRUJ ZAPOSLENOG
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployee;
