import { useEffect, useState } from "react";

export function useFetch(url, options) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function getData(_url, _options) {
      setLoading(true);
      setSuccess(false);
      try {
        const rawData = await fetch(_url, _options);
        const _data = await rawData.json();

        setData(_data);
        setSuccess(true);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    }

    getData(url, options);
  }, [url, options]);

  return { data, error, loading, success };
}
