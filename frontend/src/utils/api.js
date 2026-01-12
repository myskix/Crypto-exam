const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5001"; // Sesuaikan dengan port backend kamu

export const saveNote = async (data) => {
  const response = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return response.json();
};

export const getNoteById = async (id) => {
  const response = await fetch(`${API_URL}/notes/${id}`);
  if (!response.ok) throw new Error("Gagal mengambil data atau link kadaluwarsa");
  return response.json();
};

export default API_URL;
