import React from "react";
import { useBookings } from "../hooks/useBookings";
import BookingCard from "../components/BookingCard";
import Alert from "../components/Alert";

const ClientBookings = () => {
  const { bookings, loading, cancelBooking } = useBookings();

  const handleCancel = async (id) => {
    if (
      window.confirm("Da li ste sigurni da želite da otkažete ovaj termin?")
    ) {
      const result = await cancelBooking(id);
      if (!result.success) {
        alert(result.message);
      }
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic text-pink-800 animate-pulse">
        Učitavanje tvojih termina...
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-12">
      <div className="mb-12 border-b border-pink-100 pb-8">
        <h1 className="text-4xl font-serif text-gray-900 mb-2">Moji Termini</h1>
        <p className="text-gray-400 font-medium uppercase tracking-widest text-xs">
          Pregled svih tvojih zakazanih tretmana
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-8">
          {bookings.map((res) => (
            <BookingCard key={res.id} booking={res} onCancel={handleCancel} />
          ))}
        </div>
      ) : (
        <Alert
          type="info"
          variant="panel"
          message="Trenutno nemaš zakazanih termina"
          description="Istraži naše usluge i zakaži svoj prvi tretman već danas."
        />
      )}
    </div>
  );
};

export default ClientBookings;
