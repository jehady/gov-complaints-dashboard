import React, { useEffect, useState } from "react";
import {
  getDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} from "../services/DepartmentService";

export default function DepartmentPage() {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);


  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("اسم القسم مطلوب");
      return;
    }

    try {
      if (editId === null) {
        await addDepartment(name);
      } else {
        await updateDepartment(editId, name);
      }
      setName("");
      setEditId(null);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = (dep) => {
    setEditId(dep.id);
    setName(dep.name);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل أنت متأكد من الحذف؟")) return;

    try {
      await deleteDepartment(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">

      <h2>الأقسام</h2>


      <form onSubmit={handleSubmit} className="box" style={{ marginBottom: 20 }}>
        <h3>{editId ? "تحديث قسم" : "إضافة قسم جديد"}</h3>

        <div className="form-group">
          <label>اسم القسم</label>
          <input
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="أدخل الاسم"
          />
        </div>

        <button className="btn primary" type="submit">
          {editId ? "تحديث" : "إضافة"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={() => {
              setEditId(null);
              setName("");
            }}
          >
            إلغاء
          </button>
        )}
      </form>


      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم</th>
              <th>تاريخ الإنشاء</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {departments.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.created_at}</td>

                <td className="actions">
                  <button className="btn" onClick={() => handleEdit(d)}>
                    تعديل
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => handleDelete(d.id)}
                    style={{ marginLeft: 10 }}
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
