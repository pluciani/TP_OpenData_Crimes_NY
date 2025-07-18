import axios from "axios";

export async function fetchCrimes(limit = 500, borough = "") {
  const params = { limit };
  if (borough) params.borough = borough;

  const res = await axios.get("http://localhost:5000/crimes", { params });
  return res.data;
}
