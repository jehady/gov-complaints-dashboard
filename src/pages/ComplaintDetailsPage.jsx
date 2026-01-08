import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  fetchComplaintById,
  releaseComplaintLock,
  updateComplaintStatus,
  requestMoreDetails,
  fetchComplaintHistory
} from "../services/complaintsService";

const STATUS_OPTIONS = [
  { id: 1, label: "جديدة" },
  { id: 2, label: "قيد المعالجة" },
  { id: 3, label: "منجزة" },
  { id: 4, label: "مرفوضة" }
];

export default function ComplaintDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [complaint, setComplaint] = useState(null);
  const [statusId, setStatusId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
const [showHistory, setShowHistory] = useState(false);
const [historyLoading, setHistoryLoading] = useState(false);



  useEffect(() => {
    fetchComplaintById(id).then(c => {
      setComplaint(c);
      setStatusId(c.status_raw?.id);
    });
  }, [id]);

  async function handleShowHistory() {
  if (showHistory) {
    setShowHistory(false);
    return;
  }

  setHistoryLoading(true);
  try {
    const res = await fetchComplaintHistory(id);
    setHistory(res.history);
    setShowHistory(true);
  } catch {
    alert("فشل تحميل سجل التعديلات");
  }
  setHistoryLoading(false);
}

  async function handleStatusChange() {
    setLoading(true);
    await updateComplaintStatus(id, statusId);
    setLoading(false);
    alert("تم تحديث حالة الشكوى");
  }

  async function handleRequestDetails() {
    await requestMoreDetails(id);
    alert("تم إرسال طلب استكمال البيانات للمواطن");
  }

  async function handleRelease() {
    await releaseComplaintLock(id);
    navigate("/complaints");
  }

  if (!complaint) {
    return <div className="page"><h2>جاري التحميل...</h2></div>;
  }

  return (
    <div className="page">
      <h2>تفاصيل الشكوى</h2>

      <div className="widget">
        <p><b>العنوان:</b> {complaint.title}</p>
        <p><b>الوصف:</b> {complaint.description}</p>
        <p><b>الموقع:</b> {complaint.location}</p>

        {/* STATUS CONTROL */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 12 }}>
          <b>الحالة:</b>
          <button
  className="btn secondary"
  style={{ marginTop: 10 }}
  onClick={handleShowHistory}
  disabled={historyLoading}
>
  {showHistory ? "إخفاء سجل التعديلات" : "عرض سجل التعديلات"}
</button>


          <select
            value={statusId || ""}
            onChange={(e) => setStatusId(Number(e.target.value))}
            className="input"
            style={{ width: 180 }}
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>

          <button
            className="btn primary"
            disabled={loading}
            onClick={handleStatusChange}
          >
            حفظ
          </button>
        </div>
        {showHistory && (
  <div className="widget">
    <h3>سجل التعديلات</h3>

    {history.length === 0 ? (
      <p>لا يوجد أي تعديلات مسجلة</p>
    ) : (
      <ul style={{ paddingRight: 18 }}>
        {history.map(h => (
          <li key={h.id} style={{ marginBottom: 8 }}>
            <div><b>الإجراء:</b> {h.action}</div>
            <div><b>الحالة السابقة:</b> {h.status_id}</div>
            <div><b>التاريخ:</b> {new Date(h.created_at).toLocaleString("ar-EG")}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
)}


        {/* REQUEST MORE DETAILS */}
        <button
          className="btn warning"
          style={{ marginTop: 10 }}
          onClick={handleRequestDetails}
        >
          طلب مرفقات أو معلومات إضافية
        </button>
      </div>

      <div className="widget">
        <h3>معلومات المواطن</h3>
        <p>{complaint.citizen?.name} {complaint.citizen?.last_name}</p>
        <p>{complaint.citizen?.phone}</p>
        <p>{complaint.citizen?.email}</p>
      </div>

      <button className="btn success" onClick={handleRelease}>
        إنهاء المعالجة وفتح الشكوى
      </button>
    </div>
  );
}
