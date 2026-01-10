import { useEffect, useState } from "react";
import { fetchComplaints } from "../services/complaintsService";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user } = useAuth();

  useEffect(() => {
    loadComplaints(page);
  }, [page]);

  async function loadComplaints(pageNumber) {
    const res = await fetchComplaints(pageNumber);
    setComplaints(res.complaints);
    setTotalPages(res.totalPages);
  }

  return (
    <div className="page">
      <h2>إدارة الشكاوى</h2>

      <table className="table">
        <thead>
          <tr>
            <th>المعرف</th>
            <th>العنوان</th>
            <th>الحالة</th>
            <th>القسم</th>
            <th>إجراءات</th>
          </tr>
        </thead>

        <tbody>
          {complaints.map(c => {
            const lockedByOther =
              c.isLocked && c.locked_by !== user?.id;

            return (
              <tr key={c.id}>
               <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.status}</td>
              <td>{c.department}</td>
              <td>
                  {lockedByOther ? (
                    <>
                      <button className="btn danger" disabled>
                        قيد المعالجة
                      </button>
                      <div style={{ color: "red", fontSize: 12 }}>
                        مستخدمة من موظف آخر
                      </div>
                    </>
                  ) : (
                    <Link
                      className="btn primary"
                      to={`/complaints/${c.id}`}
                    >
                      عرض التفاصيل
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* PAGINATION */}
      <div style={{ marginTop: 20, display: "flex", gap: 8 }}>
        {Array.from({ length: totalPages }).map((_, i) => (
          <button
            key={i}
            className={`btn ${page === i + 1 ? "primary" : "secondary"}`}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
