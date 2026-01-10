import axios from "axios";
import { authHeaders } from "../Api/api";

const API_ADMIN_LIST = "http://127.0.0.1:8000/api/view_complaints";
const API_DETAILS = "http://127.0.0.1:8000/api/complaints";

export async function fetchComplaints(page = 1) {
  const res = await axios.get(
    `${API_ADMIN_LIST}?page=${page}`,
    authHeaders()
  );

  const payload = res.data.data;

  const complaints = payload.data.map(c => ({
    id: c.id,
    title: c.title?.replace(/"/g, ""),
    status: c.status?.name,
    department: c.department?.name,
    locked_by: c.locked_by,
    locked_at: c.locked_at,
    isLocked: !!c.locked_by
  }));

  const totalPages = Math.ceil(payload.total / payload.per_page);

  return {
    complaints,
    totalPages
  };
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
