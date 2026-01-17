import React, { useState } from "react";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import Alert from "../components/Alert";
import { useAuth } from "../hooks/useAuth";

const AddEmployee = () => {
  const { addEmployee, loading } = useAuth();
  const [role, setRole] = useState("sminkerka");
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

    const result = await addEmployee(finalData);

    if (result.success) {
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
    } else {
      setMessage({ text: result.message, type: "error" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden border border-pink-50">
        <div className="bg-pink-900 p-10 text-white text-center">
          <h2 className="text-3xl font-serif mb-2">Novi Zaposleni</h2>
        </div>

        <div className="p-8 md:p-12">
          {message.text && (
            <Alert
              message={message.text}
              type={message.type}
              className="mb-8"
            />
          )}

          <div className="flex gap-4 mb-10 bg-gray-50 p-2 rounded-2xl border border-gray-100">
            {["sminkerka", "manikirka"].map((r) => (
              <Button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                variant={role === r ? "default" : "ghost"}
                fullWidth
                className={`text-white !rounded-xl transition-all duration-300 !text-xs !font-black !tracking-widest ${
                  role === r ? "!bg-pink-900 shadow-lg" : "!text-gray-400"
                }`}
              >
                {r.toUpperCase()}
              </Button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormInput
                label="Ime"
                name="ime"
                value={formData.ime}
                onChange={handleChange}
                required
              />
              <FormInput
                label="Prezime"
                name="prezime"
                value={formData.prezime}
                onChange={handleChange}
                required
              />
            </div>

            <FormInput
              label="Email adresa"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <FormInput
              label="Lozinka za pristup"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-pink-50">
              <FormInput
                label="Radni staž (godine)"
                type="number"
                name="radni_staz"
                value={formData.radni_staz}
                onChange={handleChange}
                required
              />

              {role === "sminkerka" ? (
                <FormInput
                  label="Specijalnost/Tehnika"
                  name="tip_tehnike"
                  value={formData.tip_tehnike}
                  onChange={handleChange}
                  placeholder="npr. Bridal, Editorial..."
                  required
                />
              ) : (
                <FormInput
                  label="Broj sertifikata"
                  name="broj_manikir_sertifikata"
                  value={formData.broj_manikir_sertifikata}
                  onChange={handleChange}
                  placeholder="SRB-123-45"
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
                placeholder="Gel, Akril, Polygel..."
                required
              />
            )}

            <Button
              type="submit"
              fullWidth
              isLoading={loading}
              className="!bg-pink-900 hover:!bg-black mt-6 !py-4 !rounded-2xl shadow-xl shadow-pink-100"
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
