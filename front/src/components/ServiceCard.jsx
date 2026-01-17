import React from "react";
import Button from "./Button";

const ServiceCard = ({ service, onAction, actionLabel = "" }) => {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-50 flex flex-col justify-between group h-full">
      <div>
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-pink-50 text-pink-700 text-[10px] font-bold uppercase tracking-widest rounded-full">
            {service.kategorija}
          </span>
          <span className="text-gray-400 text-xs flex items-center gap-1">
            🕒 {service.trajanje}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-800 transition-colors">
          {service.naziv}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6">
          {service.opis}
        </p>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <span className="text-lg font-black text-gray-900">
          {service.cena_formatirano}
        </span>
        {actionLabel && (
          <Button size="sm" onClick={onAction} className="!rounded-xl">
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ServiceCard;
