import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";

const Login = ({ onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(formData);

    if (result.success) {
      onLoginSuccess();
      navigate("/services");
    }
  };

  return (
    <AuthLayout
      title="Prijava"
      subtitle="Unesite svoje podatke za pristup panelu"
    >
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
    </AuthLayout>
  );
};

export default Login;
