import axios from "axios";
import { authHeaders } from "../Api/api";

const API_ADMIN_LIST = "http://127.0.0.1:8000/api/admin/complaints";
const API_DETAILS = "http://127.0.0.1:8000/api/complaints";

export async function fetchComplaints() {
  const res = await axios.get(API_ADMIN_LIST, authHeaders());

  return res.data.data.complaints.map(c => ({
    id: c.id,
    title: c.title?.replace(/"/g, ""),
    status_id: c.status_id,
    department_id: c.department_id,
    locked_by: c.locked_by,
    locked_at: c.locked_at,
    isLocked: !!c.locked_by
  }));
}

export async function updateComplaintStatus(id, status_id) {
  await axios.post(
    `${API_DETAILS}/${id}/status`,
    { status_id },
    authHeaders()
  );
}
export async function fetchComplaintHistory(id) {
  const res = await axios.get(
    `${API_DETAILS}/${id}/history`,
    authHeaders()
  );

  return {
    complaint: res.data.complaint,
    history: res.data.history
  };
}


export async function requestMoreDetails(id) {
  await axios.post(
    `${API_DETAILS}/${id}/request-more-details`,
    {},
    authHeaders()
  );
}

export async function fetchComplaintById(id) {
  const res = await axios.get(`${API_DETAILS}/${id}`, authHeaders());
  const c = res.data.data.complaint;

  return {
    id: c.id,
    title: c.title?.replace(/"/g, ""),
    description: c.description?.replace(/"/g, ""),
    location: c.location?.replace(/"/g, ""),
    status: c.status?.display_name,
    citizen: c.citizen,
    department: c.department,
    attachments: c.attachments || [],
    locked_by: c.locked_by,
    locked_at: c.locked_at
  };
}

export async function releaseComplaintLock(id) {
  await axios.post(
    `${API_DETAILS}/${id}/release-lock`,
    {},
    authHeaders()
  );
}
