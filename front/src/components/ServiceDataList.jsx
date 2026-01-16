import React from "react";

const ServiceDataList = ({
  title,
  data,
  compareData = null,
  isProposed = false,
}) => {
  const getFieldStyle = (currentVal, originalVal) => {
    if (!compareData) return "text-sm text-gray-700";
    return currentVal !== originalVal
      ? "text-sm text-pink-700 font-bold bg-pink-50 px-1 rounded"
      : "text-sm text-gray-700";
  };

  return (
    <div className={`space-y-4 ${!isProposed ? "opacity-60" : ""}`}>
      <h3
        className={`text-xs font-black uppercase tracking-widest mb-4 ${
          isProposed ? "text-pink-600" : "text-gray-400"
        }`}
      >
        {title}
      </h3>

      <div className="space-y-3">
        <p className="text-sm">
          <strong className="text-gray-600">Naziv:</strong>
          <span className={getFieldStyle(data.naziv, compareData?.naziv)}>
            {" "}
            {data.naziv}
          </span>
        </p>

        <p className="text-sm">
          <strong className="text-gray-600">Trajanje:</strong>
          <span
            className={getFieldStyle(
              data.trajanje_raw ? `${data.trajanje_raw} min` : data.trajanje,
              compareData?.trajanje
            )}
          >
            {" "}
            {data.trajanje_raw ? `${data.trajanje_raw} min` : data.trajanje}
          </span>
        </p>

        <p className="text-sm">
          <strong className="text-gray-600">Cena:</strong>
          <span className={getFieldStyle(data.cena_raw, compareData?.cena_raw)}>
            {" "}
            {Number(data.cena_raw).toLocaleString()} RSD
          </span>
        </p>

        <div className="mt-2">
          <strong className="text-xs text-gray-600 uppercase">Opis:</strong>
          <p className="text-xs text-gray-500 italic leading-relaxed mt-1 line-clamp-3">
            {data.opis}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiceDataList;
