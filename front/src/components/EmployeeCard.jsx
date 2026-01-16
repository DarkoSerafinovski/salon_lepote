import React from "react";
import Button from "./Button";

const EmployeeCard = ({ employee, onViewServices, onViewSchedule }) => {
  return (
    <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-pink-50 flex flex-col items-center text-center hover:shadow-2xl transition-all group">
      <div className="w-24 h-24 bg-gradient-to-tr from-pink-800 to-rose-400 rounded-full flex items-center justify-center text-white text-3xl font-serif mb-6 shadow-lg group-hover:scale-110 transition-transform">
        {employee.ime_prezime
          .split(" ")
          .map((n) => n[0])
          .join("")}
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-1">
        {employee.ime_prezime}
      </h3>
      <span className="px-4 py-1 bg-pink-50 text-pink-700 text-xs font-black uppercase rounded-full mb-4 tracking-widest">
        {employee.uloga}
      </span>

      <div className="space-y-2 mb-6 w-full text-sm text-gray-500 border-t border-pink-50 pt-4">
        <p>
          <strong>Email:</strong> {employee.email}
        </p>
        <p>
          <strong>Staž:</strong> {employee.radni_staz_godina} god.
        </p>
        <p>
          <strong>Profesija:</strong> {employee.dodatne_informacije.kategorija}
        </p>

        <div className="mt-4 p-3 bg-gray-50 rounded-2xl italic text-xs">
          <p className="mb-1 font-bold text-gray-600">
            {employee.dodatne_informacije.kategorija === "Manikir"
              ? "Tretman: "
              : "Specijalnost: "}
          </p>
          <p>
            {employee.dodatne_informacije.kategorija === "Manikir"
              ? employee.dodatne_informacije.tretman
              : employee.dodatne_informacije.tehnika}
          </p>
        </div>
      </div>

      <Button
        variant="outline"
        fullWidth
        onClick={onViewServices}
        className="mt-auto !rounded-2xl border-pink-200 text-pink-800 hover:bg-pink-50"
      >
        USLUGE
      </Button>

      <Button
        variant="outline"
        fullWidth
        onClick={onViewSchedule}
        className="mt-3 !rounded-2xl border-pink-200 text-pink-800 hover:bg-pink-50"
      >
        RASPORED
      </Button>
    </div>
  );
};

export default EmployeeCard;
