import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getDepartments } from "../services/departmentService";
import { getEmployees } from "../services/employeeService";
import { fetchComplaints } from "../services/complaintsService";

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [complaints, setComplaints] = useState([]);

  if (!isAdmin()) return <div className="page"><h2>غير مصرح</h2></div>;

  useEffect(() => {
    async function load() {
      setDepartments(await getDepartments());
      setEmployees(await getEmployees());
      setComplaints(await fetchComplaints());
    }
    load();
  }, []);

  return (
    <div className="page">
      <h2>الإدارة - المشرف العام</h2>

      <div className="grid">
        <div className="widget">
          <h3>الأقسام الحكومية</h3>
          <ul>
            {departments.map((d) => (
              <li key={d.id}>{d.name}</li>
            ))}
          </ul>
        </div>

        <div className="widget">
          <h3>الحسابات</h3>
          <ul>
            {employees.map((e) => (
              <li key={e.id}>{e.name} {e.last_name} — قسم: {e.role}</li>
            ))}
          </ul>
        </div>

        <div className="widget">
          <h3>جميع الشكاوى</h3>
          <p>الإجمالي: {complaints.length}</p>
        </div>

        <div className="widget">
          <h3>تصدير التقارير</h3>
          <button className="btn success" onClick={() => exportCSV(complaints)}>تصدير CSV</button>
        </div>
      </div>
    </div>
  );
}

function exportCSV(rows) {
  const headers = ["id", "title", "status", "departmentId", "createdAt"];
  const csv =
    [headers.join(",")]
      .concat(
        rows.map((r) => headers.map((h) => JSON.stringify(r[h] || "")).join(","))
      )
      .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "complaints.csv";
  a.click();
  URL.revokeObjectURL(url);
}
