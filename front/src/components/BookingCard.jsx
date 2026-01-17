import React, { useState } from "react";
import Button from "./Button";

const BookingCard = ({ booking, onCancel, variant = "client" }) => {
  const [isCancelling, setIsCancelling] = useState(false);

  const statusStyles = {
    zakazano: "bg-blue-50 text-blue-600",
    potvrdjena: "bg-green-50 text-green-600",
    potvrđeno: "bg-green-50 text-green-600",
    otkazano: "bg-red-50 text-red-600",
    završeno: "bg-gray-50 text-gray-500",
  };

  const handleCancelClick = async () => {
    setIsCancelling(true);
    try {
      await onCancel(booking.id);
    } catch (error) {
      setIsCancelling(false);
    }
  };

  if (variant === "employee") {
    return (
      <div className="group relative pl-16 animate-in fade-in slide-in-from-left-5 duration-500">
        <div className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full border-4 border-pink-600 shadow-md z-10 group-hover:scale-125 transition-transform"></div>
        <div className="bg-white rounded-[2.5rem] p-6 border border-gray-50 shadow-sm hover:shadow-xl hover:border-pink-100 transition-all duration-300">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="bg-pink-50 text-pink-900 font-mono text-sm font-black px-4 py-2 rounded-xl shadow-inner min-w-[75px] text-center">
                {booking.satnica}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">
                  {booking.usluga.naziv}
                </h3>
                <p className="text-gray-400 text-[11px] font-bold uppercase tracking-tight mt-1">
                  {booking.usluga.trajanje} min •{" "}
                  <span className="text-pink-900">
                    {booking.usluga.cena} RSD
                  </span>
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 group-hover:bg-pink-50 transition-colors">
              <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center shadow-sm text-pink-500 font-serif italic text-lg">
                K
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] text-gray-400 font-black uppercase tracking-widest">
                  Klijent
                </span>
                <span className="text-sm font-bold text-gray-700">
                  Potvrđen termin
                </span>
              </div>
            </div>
          </div>
          <div className="mt-5 pt-4 border-t border-gray-50 flex justify-end">
            <span
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                statusStyles[booking.status?.toLowerCase()] ||
                "bg-gray-100 text-gray-400"
              }`}
            >
              {booking.status}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[3rem] border border-gray-50 shadow-sm overflow-hidden hover:shadow-xl transition-all duration-500 animate-in fade-in zoom-in-95">
      <div className="flex flex-col md:flex-row">
        <div className="p-8 md:w-2/3 border-b md:border-b-0 md:border-r border-gray-50">
          <div className="flex items-center gap-3 mb-6">
            <span
              className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                statusStyles[booking.status?.toLowerCase()] ||
                "bg-gray-100 text-gray-400"
              }`}
            >
              {booking.status}
            </span>
            <span className="text-gray-200">•</span>
            <span className="text-[10px] font-mono text-gray-300 uppercase tracking-widest">
              ID #{booking.id}
            </span>
          </div>

          <h3 className="text-2xl font-serif text-gray-900 mb-8">
            {booking.usluga.naziv}
          </h3>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">
                Zaposleni
              </p>
              <p className="text-sm font-bold text-gray-800">
                {booking.zaposleni?.ime_prezime}
              </p>
              <p className="text-[11px] text-pink-600 font-medium italic">
                {booking.zaposleni?.tip}
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black mb-2">
                Usluga
              </p>
              <p className="text-sm font-bold text-gray-800">
                {booking.usluga.cena} RSD
              </p>
              <p className="text-[11px] text-gray-500">
                {booking.usluga.trajanje} min
              </p>
            </div>
          </div>
        </div>

        <div className="p-8 md:w-1/3 bg-gray-50/30 flex flex-col justify-between items-center text-center">
          <div className="space-y-2">
            <p className="text-[9px] uppercase tracking-widest text-gray-400 font-black">
              Termin
            </p>
            <p className="font-serif font-bold text-xl text-gray-900">
              {booking.datum}
            </p>
            <div className="text-pink-900 font-mono text-sm font-black bg-white py-1.5 px-5 rounded-2xl shadow-sm border border-pink-50 inline-block">
              {booking.satnica}
            </div>
          </div>

          <div className="mt-8 w-full">
            {booking.moze_se_otkazati ? (
              <Button
                variant="outline"
                fullWidth
                isLoading={isCancelling}
                disabled={isCancelling}
                onClick={handleCancelClick}
                className="!text-red-500 !border-red-100 hover:!bg-red-50 !rounded-[1.5rem] !text-[10px] !font-black !tracking-[0.15em] py-4"
              >
                OTKAŽI TERMIN
              </Button>
            ) : (
              <div className="py-3 px-4 bg-gray-100/50 rounded-2xl">
                <p className="text-gray-400 italic text-[10px] font-medium">
                  Otkazivanje više nije moguće
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
