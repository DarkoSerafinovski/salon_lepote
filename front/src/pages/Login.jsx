import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", formData);

      const { access_token, type, data } = response.data;

      localStorage.setItem("token", access_token);
      localStorage.setItem("user_type", type);
      localStorage.setItem("user_name", data.ime);

      onLoginSuccess();

      navigate("/services");
    } catch (err) {
      const errorMessage =
        Object.values(err.response?.data?.errors || {})[0]?.[0] ||
        err.response?.data?.message ||
        "Doslo je do greske";

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdfaf9] px-4 font-sans text-gray-800">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif italic text-pink-800 mb-2">
            Aura Beauty
          </h1>
          <div className="h-0.5 w-16 bg-pink-200 mx-auto"></div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-pink-50">
          <div className="p-8 md:p-10">
            <h2 className="text-2xl font-semibold text-center mb-2">Prijava</h2>
            <p className="text-center text-gray-500 text-sm mb-8">
              Unesite svoje podatke za pristup panelu
            </p>

            {error && <Alert message={error} type="error" variant="message" />}

            <form onSubmit={handleSubmit} className="space-y-5">
              <FormInput
                label="Email"
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="ana@salon.com"
              />

              <FormInput
                label="Lozinka"
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
              />

              <Button type="submit" fullWidth isLoading={loading}>
                Pristupi Panelu
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-gray-100 text-center">
              <p className="text-gray-500 text-sm mb-4">Novi ste kod nas?</p>
              <Button
                variant="outline"
                fullWidth
                onClick={() => navigate("/register")}
              >
                KREIRAJTE NALOG
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
