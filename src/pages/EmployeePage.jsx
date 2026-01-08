import React, { useEffect, useState } from "react";
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../services/employeeService";

import { getDepartments } from "../services/DepartmentService";

export default function EmployeePage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [fatherName, setFatherName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  // role = department NAME
  const [role, setRole] = useState("");

  const [editId, setEditId] = useState(null);

   

  const resetForm = () => {
    setName("");
    setLastName("");
    setFatherName("");
    setEmail("");
    setPhone("");
    setPassword("");
    setPasswordConfirm("");
    setRole("");
    setEditId(null);
  };

  const load = async () => {
  setLoading(true);
  try {
    const empData = await getEmployees();
    const depData = await getDepartments();

    console.log("Departments:", depData); // <-- array, correct

    setEmployees(empData);
    setDepartments(depData);
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

    if (!name || !lastName || !email || !role || !phone) {
      alert("جميع الحقول المطلوبة يجب تعبئتها");
      return;
    }

    if (!editId && password !== passwordConfirm) {
      alert("كلمة المرور غير متطابقة");
      return;
    }

    const payload = {
      name,
      last_name: lastName,
      father_name: fatherName,
      email,
      phone,
      role, 
    };

    // Only send password fields on CREATE or EDIT if changed
    if (!editId || password.trim() !== "") {
      payload.password = password;
      payload.password_confirmation = passwordConfirm;
    }

    try {
      if (editId) {
        await updateEmployee(editId, payload);
      } else {
        console.log(password);
        await createEmployee(payload);
      }
      resetForm();
      load();
    } catch (err) {
      alert(err.response?.data?.message || err.message);
    }
  };

  const handleEdit = (emp) => {
    setEditId(emp.id);
    setName(emp.name);
    setLastName(emp.last_name);
    setFatherName(emp.father_name);
    setEmail(emp.email);
    setPhone(emp.phone || "");
    setPassword("");
    setPasswordConfirm("");
    setRole(emp.role); // department NAME
  };

  const handleDelete = async (id) => {
    if (!window.confirm("هل تريد حذف هذا الموظف؟")) return;

    try {
      await deleteEmployee(id);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="page">

      <h2>الموظفون</h2>

      {/* ========== FORM ========== */}
      <form onSubmit={handleSubmit} className="box" style={{ marginBottom: 20 }}>
        <h3>{editId ? "تحديث موظف" : "إضافة موظف جديد"}</h3>

        <div className="row">
          <div className="form-group">
            <label>الاسم</label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="الاسم"
            />
          </div>

          <div className="form-group">
            <label>الكنية</label>
            <input
              className="input"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="الكنية"
            />
          </div>
        </div>

        <div className="form-group">
          <label>اسم الأب</label>
          <input
            className="input"
            value={fatherName}
            onChange={(e) => setFatherName(e.target.value)}
            placeholder="اسم الأب"
          />
        </div>

        <div className="form-group">
          <label>الإيميل</label>
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
          />
        </div>

        <div className="form-group">
          <label>رقم الهاتف</label>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="09xxxxxxxx"
          />
        </div>

        {/* CREATE only OR edit with new password */}
        <div className="row">
          <div className="form-group">
            <label>كلمة المرور</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
            />
          </div>

          <div className="form-group">
            <label>تأكيد كلمة المرور</label>
            <input
              className="input"
              type="password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="********"
            />
          </div>
        </div>

        {/* DEPARTMENT NAME */}
        <div className="form-group">
          <label>الدور</label>
          <select
  className="input"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="">اختر الدور</option>
  {departments.map((d) => (
    <option key={d.id} value={d.name}>
      {d.name}
    </option>
  ))}
</select>

        </div>

        <button className="btn primary" type="submit">
          {editId ? "تحديث" : "إضافة"}
        </button>

        {editId && (
          <button
            type="button"
            className="btn"
            onClick={resetForm}
            style={{ marginLeft: 10 }}
          >
            إلغاء
          </button>
        )}
      </form>

      {/* ========== TABLE ========== */}
      {loading ? (
        <p>جاري التحميل...</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>الرقم</th>
              <th>الاسم</th>
              <th>الإيميل</th>
              <th>الهاتف</th>
              <th>الدور</th>
              <th>إجراءات</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id}>
                <td>{emp.id}</td>
                <td>{emp.name} {emp.last_name}</td>
                <td>{emp.email}</td>
                <td>{emp.phone || "—"}</td>
                <td>{emp.role}</td>

                <td className="actions">
                  <button className="btn" onClick={() => handleEdit(emp)}>
                    تعديل
                  </button>

                  <button
                    className="btn danger"
                    onClick={() => handleDelete(emp.id)}
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
