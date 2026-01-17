import React from "react";
import FormInput from "./FormInput";
import FormSelect from "./FormSelect";

const ServiceHeader = ({ filters, onFilterChange, maxPrice = 10000 }) => {
  return (
    <div className="mb-10 bg-white rounded-[2rem] shadow-xl shadow-pink-100/20 border border-pink-50 overflow-hidden">
      <div className="p-8 md:p-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        <div className="space-y-1">
          <h1 className="text-4xl font-serif text-pink-900 tracking-tight">
            Naše Usluge
          </h1>
          <p className="text-gray-400 font-medium italic">
            Pronađite idealan tretman za sebe
          </p>
        </div>

        <div className="w-full lg:w-96 relative">
          <FormInput
            placeholder="Pronađi tretman (npr. manikir)..."
            name="naziv"
            value={filters.naziv}
            onChange={onFilterChange}
            className="!mb-0 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-gray-50/50 border-t border-pink-50 p-6 md:px-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 items-center">
          <FormSelect
            label="Kategorija"
            name="kategorija"
            value={filters.kategorija}
            onChange={onFilterChange}
            options={[
              { value: "", label: "Sve usluge" },
              { value: "sminkanje", label: "Šminkanje" },
              { value: "manikir", label: "Manikir" },
            ]}
          />

          <div className="flex flex-col space-y-3">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] uppercase tracking-widest font-black text-gray-400">
                Budžet do
              </span>
              <span className="text-sm font-bold text-pink-800 bg-pink-100 px-2 py-0.5 rounded-lg">
                {Number(filters.max_cena || maxPrice).toLocaleString()} RSD
              </span>
            </div>
            <div className="px-2">
              <input
                type="range"
                name="max_cena"
                min="0"
                max={maxPrice}
                step="500"
                value={filters.max_cena || maxPrice}
                onChange={onFilterChange}
                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600 hover:accent-pink-700 transition-all"
              />
              <div className="flex justify-between text-[9px] text-gray-300 mt-2 font-bold uppercase">
                <span>0 RSD</span>
                <span>{maxPrice.toLocaleString()} RSD</span>
              </div>
            </div>
          </div>

          <FormSelect
            label="Sortiraj po"
            name="sort_by"
            value={filters.sort_by}
            onChange={onFilterChange}
            options={[
              { value: "cena", label: "Ceni" },
              { value: "naziv", label: "Nazivu" },
            ]}
          />

          <FormSelect
            label="Redosled"
            name="order"
            value={filters.order}
            onChange={onFilterChange}
            options={[
              { value: "asc", label: "Rastuće ↑" },
              { value: "desc", label: "Opadajuće ↓" },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default ServiceHeader;
