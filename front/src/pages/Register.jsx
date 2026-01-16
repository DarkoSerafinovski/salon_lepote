import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";

const Register = ({ onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    ime: "",
    prezime: "",
    email: "",
    password: "",
    password_confirmation: "",
    type: "klijent",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.password_confirmation) {
      return setError("Lozinke se ne podudaraju.");
    }

    setLoading(true);

    try {
      const { password_confirmation, ...dataToSend } = formData;
      const response = await api.post("/register", dataToSend);

      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user_type", response.data.data.type);
      localStorage.setItem("user_name", response.data.data.ime);

      onRegisterSuccess();

      navigate("/services");
    } catch (err) {
      const errorMessage =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Doslo je do greske prilikom registracije.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf9] px-4 py-12">
      <div className="max-w-xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif italic text-pink-800 mb-2">
            Aura Beauty
          </h1>
          <p className="text-gray-500">
            Kreirajte nalog i zakažite svoj termin za uživanje
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-50">
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-center mb-6">
              Registracija
            </h2>

            <Alert message={error} type="error" className="mb-6" />

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Ime"
                  name="ime"
                  value={formData.ime}
                  onChange={handleChange}
                  placeholder="Ime"
                  required
                />
                <FormInput
                  label="Prezime"
                  name="prezime"
                  value={formData.prezime}
                  onChange={handleChange}
                  placeholder="Prezime"
                  required
                />
              </div>

              <FormInput
                label="Email adresa"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@gmail.com"
                required
              />

              <FormInput
                label="Lozinka"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Minimum 8 karaktera"
                required
              />

              <FormInput
                label="Potvrdite lozinku"
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                placeholder="Ponovite lozinku"
                required
              />

              <Button type="submit" fullWidth isLoading={loading}>
                KREIRAJ NALOG
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm mb-4">Vec imate nalog?</p>
              <Button variant="outline" fullWidth onClick={() => navigate("/")}>
                PRIJAVITE SE
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
