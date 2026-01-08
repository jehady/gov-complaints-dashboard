
import axios from "axios";
import { authHeaders } from "../Api/api";

const API = "http://127.0.0.1:8000/api/employees";



// CREATE Employee
export async function createEmployee(data) {
  const res = await axios.post(`${API}/register`, data, authHeaders());
  return res.data;
}

export async function getEmployees() {
  const res = await axios.get(`http://127.0.0.1:8000/api/admin/users/by-role`, authHeaders());

  const roles = res.data.data;  
  const employees = [];


  Object.keys(roles).forEach(roleName => {
    roles[roleName].forEach(emp => {
      employees.push({
        ...emp,
        role: roleName   
      });
    });
  });

  return employees;   
}



export async function updateEmployee(id, data) {
  const res = await axios.put(`${API}/${id}`, data, authHeaders());
  return res.data;
}


export async function deleteEmployee(id) {
  const res = await axios.delete(`${API}/${id}`, authHeaders());
  return res.data;
}
