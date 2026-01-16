import React, { useState, useEffect } from "react";
import api from "../api";
import Alert from "../components/Alert";
import ServiceRequestCard from "../components/ServiceRequestCard";

const ServiceRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [submittingId, setSubmittingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchRequests = async () => {
    try {
      const response = await api.get("/vlasnica/usluge-izmene");
      setRequests(response.data.data);
    } catch (err) {
      setError("Nije moguće učitati molbe za izmenu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id) => {
    setSubmittingId(id);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post(`/vlasnica/usluge-izmene/${id}/odobri`);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        await fetchRequests();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Došlo je do greške pri odobravanju molbe."
      );
    } finally {
      setSubmittingId(null);
      setTimeout(() => setSuccessMessage(""), 5000);
    }
  };

  const handleReject = async (id) => {
    setSubmittingId(id);
    setError("");
    setSuccessMessage("");

    try {
      const response = await api.post(`/vlasnica/usluge-izmene/${id}/odbij`);

      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setRequests((prev) => prev.filter((req) => req.id !== id));
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Došlo je do greške pri odbijanju molbe."
      );
    } finally {
      setSubmittingId(null);
      setTimeout(() => setSuccessMessage(""), 4000);
    }
  };

  if (loading)
    return (
      <div className="p-20 text-center font-serif italic">
        Učitavanje molbi...
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-10">
        <h1 className="text-3xl font-serif text-pink-900">Molbe za Izmenu</h1>
        <p className="text-gray-500 italic">
          Pregledajte i odobrite predloge vaših zaposlenih
        </p>
      </div>

      {successMessage && (
        <Alert type="success" message={successMessage} className="mb-6" />
      )}
      {error && <Alert type="error" message={error} className="mb-6" />}

      {requests.length > 0 ? (
        <div className="space-y-8">
          {requests.map((req) => (
            <ServiceRequestCard
              key={req.id}
              req={req}
              onAccept={handleAccept}
              onReject={handleReject}
              isSubmitting={submittingId === req.id}
            />
          ))}
        </div>
      ) : (
        <Alert
          variant="panel"
          type="info"
          message="Nema novih molbi"
          description="Sve molbe zaposlenih su obrađene."
        />
      )}
    </div>
  );
};

export default ServiceRequests;
