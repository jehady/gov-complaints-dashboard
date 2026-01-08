import { useEffect, useState } from "react";
import { fetchComplaints } from "../services/complaintsService";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchComplaints().then(setComplaints);
  }, []);
  
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
          {complaints.map(c => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.title}</td>
              <td>{c.status}</td>
              <td>{c.departmentId}</td>



              
                          <td>
                <Link className="btn primary" to={`/complaints/${c.id}`}>
                  عرض التفاصيل
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
