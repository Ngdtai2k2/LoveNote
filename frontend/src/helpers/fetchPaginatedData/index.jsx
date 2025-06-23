import axios from "axios";

const fetchPaginatedData = async (
  url,
  { client = axios, params = {}, headers = {} } = {},
) => {
  try {
    const res = await client.get(url, {
      params,
      headers,
    });
    return { data: res.data, error: null };
  } catch (error) {
    return { data: null, error: error.response?.data.message };
  }
};

export default fetchPaginatedData;
