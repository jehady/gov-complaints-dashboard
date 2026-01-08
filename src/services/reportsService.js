import axios from "axios";
import { authHeaders } from "../Api/api";

const BASE = "http://127.0.0.1:8000/api/audit-reports";



export async function generateDailyReport(date) {
  const res = await axios.get(
    `${BASE}/daily`,
    {
      params: { date },
      ...authHeaders()
    }
  );

  return res.data.file_url;
}


export async function generateWeeklyReport(start_date, end_date) {
  const res = await axios.get(
    `${BASE}/weekly`,
    {
      params: {
        start_date,
        end_date
      },
      ...authHeaders()
    }
  );

  return res.data.file_url;
}


export async function generateMonthlyReport(year, month) {
  const res = await axios.get(
    `${BASE}/monthly`,
    {
      params: {
        year: String(year),
        month: String(month)
      },
      ...authHeaders()
    }
  );

  return res.data.file_url;
}

