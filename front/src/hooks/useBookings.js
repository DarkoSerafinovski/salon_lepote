import { useState, useEffect } from "react";
import api from "../api";

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [dailySchedule, setDailySchedule] = useState([]);
  const [scheduleMessage, setScheduleMessage] = useState("");

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await api.get("/klijent/rezervacije/moje-rezervacije");
      setBookings(response.data.data);
    } catch (err) {
      setError("Greška pri učitavanju rezervacija");
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async (serviceId, selectedDate) => {
    if (!serviceId || !selectedDate) return;

    setLoadingSlots(true);
    setError(null);
    try {
      const response = await api.get(
        `/rezervacije/slobodni-termini?usluga_id=${serviceId}&datum=${selectedDate}`
      );
      setTimeSlots(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Greška pri učitavanju termina");
      setTimeSlots([]);
    } finally {
      setLoadingSlots(false);
    }
  };

  const fetchDailySchedule = async (date) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/zaposleni/rezervacije/moj-raspored-obaveza?datum=${date}`
      );
      setDailySchedule(response.data.data);
      setScheduleMessage(response.data.message || "");
    } catch (err) {
      console.error("Greška pri učitavanju rasporeda");
      setDailySchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const bookTermin = async (bookingData) => {
    try {
      await api.post("/klijent/rezervacije", {
        usluga_id: bookingData.service_id,
        datum: bookingData.datum,
        vreme: bookingData.vreme,
      });
      setSelectedService(null);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.response?.data?.error || "Greška pri rezervaciji",
      };
    }
  };

  const cancelBooking = async (id) => {
    try {
      await api.delete(`/klijent/rezervacije/otkazi-rezervaciju/${id}`);
      await fetchBookings();
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Greška pri otkazivanju",
      };
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    timeSlots,
    dailySchedule,
    scheduleMessage,
    loading,
    loadingSlots,
    error,
    selectedService,
    setSelectedService,
    fetchAvailableSlots,
    bookTermin,
    cancelBooking,
    refresh: fetchBookings,
    fetchDailySchedule,
  };
};
