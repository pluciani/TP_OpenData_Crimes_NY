import axios from "axios";

export async function fetchCrimes(borough = "") {
  const params = {};
  if (borough) params.borough = borough;

  const res = await axios.get("http://localhost:5000/crimes", { params });
  console.log(res.data.length, " crimes fetched");
  return res.data;
}
