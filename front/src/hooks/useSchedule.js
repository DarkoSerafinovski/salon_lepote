import { useState, useCallback } from "react";
import api from "../api";

export const useSchedule = () => {
  const [schedule, setSchedule] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [myShifts, setMyShifts] = useState([]);
  const [selectedEmployeeSchedule, setSelectedEmployeeSchedule] = useState([]);

  const fetchWeeklySchedule = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("/vlasnica/radno-vreme/raspored");
      setSchedule(response.data.data);
    } catch (err) {
      setError("Greška pri učitavanju rasporeda");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMySchedule = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("/zaposleni/moj-raspored-smena");
      setMyShifts(response.data.data);
    } catch (err) {
      console.error("Greška pri učitavanju ličnog rasporeda", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchScheduleByEmployee = useCallback(async (employeeId) => {
    setLoading(true);
    try {
      const response = await api.get(
        `/vlasnica/radno-vreme/raspored/${employeeId}`
      );
      setSelectedEmployeeSchedule(response.data.data || []);
    } catch (err) {
      console.error("Greška pri učitavanju rasporeda zaposlenog", err);
      setSelectedEmployeeSchedule([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const assignSchedule = async (employeeId, rasporedData) => {
    setLoading(true);
    try {
      const payload = {
        user_id: employeeId,
        raspored: rasporedData.map(({ naziv, ...rest }) => rest),
      };

      await api.post("/vlasnica/radno-vreme", payload);
      return { success: true, message: "Raspored uspešno sačuvan!" };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Greška pri čuvanju rasporeda.",
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    schedule,
    loading,
    error,
    myShifts,
    selectedEmployeeSchedule,
    setMyShifts,
    fetchWeeklySchedule,
    fetchMySchedule,
    fetchScheduleByEmployee,
    assignSchedule,
  };
};
