import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3001/api",
  timeout: 10000,
});

export const login = (username) => api.post("/login", { username });

// Transaksi
export const getTransaksi = (user_id, bulan, tahun) =>
  api.get("/transaksi", { params: { user_id, bulan, tahun } });
export const addTransaksi = (data) => api.post("/transaksi", data);
export const editTransaksi = (id, data) => api.put(`/transaksi/${id}`, data);
export const deleteTransaksi = (id) => api.delete(`/transaksi/${id}`);

// Tabungan
export const getTabungan = (user_id) => api.get("/tabungan", { params: { user_id } });
export const addTabungan = (data) => api.post("/tabungan", data);
export const editTabungan = (id, data) => api.put(`/tabungan/${id}`, data);
export const deleteTabungan = (id) => api.delete(`/tabungan/${id}`);
export const addSetoran = (id, data) => api.post(`/tabungan/${id}/setoran`, data);

// Tagihan
export const getTagihan = (user_id) => api.get("/tagihan", { params: { user_id } });
export const addTagihan = (data) => api.post("/tagihan", data);
export const editTagihan = (id, data) => api.put(`/tagihan/${id}`, data);
export const deleteTagihan = (id) => api.delete(`/tagihan/${id}`);
export const bayarTagihan = (id, data) => api.post(`/tagihan/${id}/bayar`, data);

export default api;
