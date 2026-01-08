import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchComplaints } from "../services/complaintsService";

export default function HomePage() {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [statusCounts, setStatusCounts] = useState([]);
  const [byDept, setByDept] = useState([]);

  const STATUS_LABELS = {
    1: "جديدة",
    2: "قيد المعالجة",
    3: "مكتملة",
    4: "مرفوضة",
  };

  useEffect(() => {
    async function load() {
      const list = await fetchComplaints();
      setComplaints(list);

      const sc = {};
      list.forEach((c) => {
        const st = STATUS_LABELS[c.status] || c.status;
        sc[st] = (sc[st] || 0) + 1;
      });

      setStatusCounts(
        Object.keys(sc).map((key) => ({
          name: key,
          value: sc[key],
        }))
      );
      const deptMap = {};
      list.forEach((c) => {
        if (!deptMap[c.departmentId]) {
          deptMap[c.departmentId] = { department: c.departmentId, counts: {}, total: 0 };
        }
        const st = STATUS_LABELS[c.status] || c.status;
        deptMap[c.departmentId].counts[st] = (deptMap[c.departmentId].counts[st] || 0) + 1;
        deptMap[c.departmentId].total++;
      });

      setByDept(Object.values(deptMap));
    }

    load();
  }, []);

  return (
    <div className="page">
      <h2>مرحباً {user?.name}</h2>
      {/* <div className="grid">
        {statusCounts.map((s, i) => (
          <div className="widget" key={i}>
            {s.name}: {s.value}
          </div>
        ))}
      </div> */}

      <div className="grid" style={{ marginTop: 20 }}>
        <div className="widget">
          <h3>الشكاوى حسب القسم</h3>

          {byDept.map((row) => (
            <div key={row.department} style={{ marginBottom: 12 }}>
              <b>القسم رقم: {row.department}</b>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginTop: 10 }}>
                {statusCounts.map((st) => {
                  const count = row.counts[st.name] || 0;
                  const max = Math.max(...statusCounts.map((s) => s.value));
                  const width = max > 0 ? `${(count / max) * 100}%` : "0%";

                  const color =
                    st.name === "جديدة"
                      ? "#3b82f6"
                      : st.name === "قيد المعالجة"
                      ? "#f59e0b"
                      : st.name === "مكتملة"
                      ? "#10b981"
                      : "#ef4444";

                  return (
                    <div key={st.name} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      <small>{st.name}</small>
                      <div style={{ height: 10, background: "#111827", borderRadius: 6 }}>
                        <div style={{ width, height: "100%", background: color, borderRadius: 6 }} />
                      </div>
                      <small>{count}</small>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* KPI Widget */}
        <div className="widget">
          <h3>مؤشرات الأداء</h3>
          <ul>
            <li>إجمالي الشكاوى: {complaints.length}</li>
            <li>نسبة المكتملة: 
              {complaints.length
                ? Math.round(
                    (complaints.filter((c) => c.status === 3).length / complaints.length) * 100
                  )
                : 0}
              %
            </li>
            <li>نسبة المرفوضة:
              {complaints.length
                ? Math.round(
                    (complaints.filter((c) => c.status === 4).length / complaints.length) * 100
                  )
                : 0}
              %
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
