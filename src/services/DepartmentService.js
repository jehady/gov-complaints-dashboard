// services/departmentService.js
import axios from "axios";

import {  authHeaders } from "../Api/api";
const API = "http://127.0.0.1:8000/api/admin/roles";

export async function getDepartments() {
  const res = await axios.get(API, authHeaders());

  return res.data; // array of departments
}

export async function addDepartment(name) {
  const res = await axios.post(
    API,
    { name },
    authHeaders()
  );
  console.log(res);
  return res.data;
}

export async function deleteDepartment(id) {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
}


export async function updateDepartment(id, name) {
  const res = await axios.put(
    `${API}/${id}`,
    { name },
    authHeaders()
  );
  return res.data;
}
