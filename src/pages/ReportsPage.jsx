import { useState } from "react";
import {
  generateDailyReport,
  generateWeeklyReport,
  generateMonthlyReport
} from "../services/reportsService";
import { useAuth } from "../context/AuthContext";

export default function ReportsPage() {
  const { isAdmin } = useAuth();

  const [type, setType] = useState("daily");
  const [date, setDate] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isAdmin()) {
    return <div className="page"><h2>غير مصرح</h2></div>;
  }

  function formatDateForApi(date) {
  // Converts 2026-01-07 → 2026-1-7
  const [y, m, d] = date.split("-");
  return `${y}-${Number(m)}-${Number(d)}`;
}

async function handleGenerate() {
  try {
    let fileUrl = null;

    setLoading(true);

    if (type === "daily") {
      if (!date) {
        alert("يرجى اختيار التاريخ");
        return;
      }

      fileUrl = await generateDailyReport(
        formatDateForApi(date)
      );
      console.log(fileUrl);
    }

    if (type === "weekly") {
      if (!startDate || !endDate) {
        alert("يرجى تحديد الفترة");
        return;
      }

      fileUrl = await generateWeeklyReport(
        formatDateForApi(startDate),
        formatDateForApi(endDate)
      );
      console.log(fileUrl);
    }

    if (type === "monthly") {
      if (!year || !month) {
        alert("يرجى إدخال السنة والشهر");
        return;
      }

      fileUrl = await generateMonthlyReport(
        String(year),
        String(month)
      );
      console.log(fileUrl);
    }

    if (!fileUrl) {
      throw new Error("FILE_URL_MISSING");
    }

    window.open(fileUrl, "_blank");

  } catch (err) {
    console.error("Report error:", err?.response?.data || err.message);

    alert(
      err?.response?.data?.message ||
      "فشل إنشاء التقرير"
    );
  } finally {
    setLoading(false);
  }
}



  return (
    <div className="page">
      <h2>التقارير</h2>

      <div className="widget" style={{ maxWidth: 480 }}>
        <label>نوع التقرير</label>
        <select
          className="input"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="daily">يومي</option>
          <option value="weekly">أسبوعي</option>
          <option value="monthly">شهري</option>
        </select>

        {/* DAILY */}
        {type === "daily" && (
          <>
            <label>التاريخ</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </>
        )}

        {/* WEEKLY */}
        {type === "weekly" && (
          <>
            <label>من تاريخ</label>
            <input
              type="date"
              className="input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <label>إلى تاريخ</label>
            <input
              type="date"
              className="input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </>
        )}

        {/* MONTHLY */}
        {type === "monthly" && (
          <>
            <label>السنة</label>
            <input
              type="number"
              className="input"
              placeholder="2025"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />

            <label>الشهر</label>
            <input
              type="number"
              className="input"
              placeholder="5"
              min="1"
              max="12"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </>
        )}

        <button
          className="btn primary"
          disabled={loading}
          onClick={handleGenerate}
          style={{ marginTop: 16 }}
        >
          إنشاء التقرير
        </button>
      </div>
    </div>
  );
}
