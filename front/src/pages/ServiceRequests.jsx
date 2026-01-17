import React, { useState, useEffect } from "react";
import { useServices } from "../hooks/useServices";
import Alert from "../components/Alert";
import ServiceRequestCard from "../components/ServiceRequestCard";

const ServiceRequests = () => {
  const { requests, fetchRequests, handleServiceRequest, loading } =
    useServices();
  const [submittingId, setSubmittingId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ text: "", type: "" });

  useEffect(() => {
    fetchRequests();
  }, []);

  const processAction = async (id, action) => {
    setSubmittingId(id);
    setStatusMsg({ text: "", type: "" });

    const result = await handleServiceRequest(id, action);

    if (result.success) {
      setStatusMsg({ text: result.message, type: "success" });
      setTimeout(() => setStatusMsg({ text: "", type: "" }), 4000);
    } else {
      setStatusMsg({ text: result.message, type: "error" });
    }
    setSubmittingId(null);
  };

  if (loading && requests.length === 0)
    return (
      <div className="p-20 text-center font-serif italic text-pink-900 animate-pulse text-xl">
        Učitavanje molbi za izmenu...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-12">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-pink-500 opacity-80">
          Administrativni panel
        </span>
        <h1 className="text-4xl font-serif text-pink-900 mt-2 mb-3">
          Molbe za Izmenu
        </h1>
        <p className="text-gray-500 italic font-light">
          Pregledajte i odobrite predloge vaših zaposlenih za unapređenje usluga
        </p>
      </div>

      {statusMsg.text && (
        <Alert
          type={statusMsg.type}
          message={statusMsg.text}
          className="mb-8 shadow-sm border-pink-100"
        />
      )}

      {requests.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {requests.map((req) => (
            <ServiceRequestCard
              key={req.id}
              req={req}
              onAccept={(id) => processAction(id, "odobri")}
              onReject={(id) => processAction(id, "odbij")}
              isSubmitting={submittingId === req.id}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-[2.5rem] p-16 text-center border border-pink-50 shadow-sm">
          <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl text-pink-300">✓</span>
          </div>
          <h3 className="text-xl font-serif text-pink-900 mb-2">
            Sve je ažurno
          </h3>
          <p className="text-gray-400 font-light italic">
            Trenutno nema novih molbi zaposlenih koje čekaju na vašu potvrdu.
          </p>
        </div>
      )}
    </div>
  );
};

export default ServiceRequests;
