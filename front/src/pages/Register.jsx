import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import AuthLayout from "../components/AuthLayout";
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

  const { register, loading, error, setError } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      return setError("Lozinke se ne podudaraju.");
    }

    const result = await register(formData);
    if (result.success) {
      onRegisterSuccess();
      navigate("/services");
    }
  };

  return (
    <AuthLayout
      title="Registracija"
      subtitle="Kreirajte nalog i zakažite svoj termin za uživanje"
    >
      {error && <Alert message={error} type="error" className="mb-6" />}

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
        <p className="text-gray-500 text-sm mb-4">Već imate nalog?</p>
        <Button variant="outline" fullWidth onClick={() => navigate("/")}>
          PRIJAVITE SE
        </Button>
      </div>
    </AuthLayout>
  );
};

export default Register;
