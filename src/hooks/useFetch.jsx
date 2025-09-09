import { useState, useEffect } from "react";

// 4 - custom hook
export const useFetch = (url) => {
  const [data, setData] = useState(null);

  // 5 - refatorando post.
  const [config, setConfig] = useState(null); // Corrigido aqui!
  const [method, setMethod] = useState(null);
  const [callFetch, setCallFetch] = useState(false);

  // 6 - loading
  const [loading, setLoading] = useState(false);

  // 7 - tratando erros
  const [error, setError] = useState(null);

  // 8 - delete / Desafio 6
  const [deleteId, setDeleteId] = useState(null);

  // 5 - refatorando post (função para configurar requisições POST e DELETE)
  const httpConfig = (data, method) => {
    if (method === "POST") {
      setConfig({
        method,
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(data),
      });
      setMethod(method);
    } else if (method === "DELETE") {
      // Para DELETE, enviamos só o método, sem body
      setConfig({
        method,
        headers: { "Content-type": "application/json" },
      });
      setMethod(method);
      // Passa o id para usar na URL
      setDeleteId(data.id);
    }
  };

  // 1 - resgatando dados
  useEffect(() => {
    const fetchData = async () => {
      // 6 - loading
      setLoading(true);

      try {
        const res = await fetch(url);
        const json = await res.json();
        setData(json);

        // 7 - limpando erros (caso sucesso)
        setError(null);
      } catch (error) {
        console.log(error.message);

        // 7 - tratando erros
        setError("Houve algum erro ao carregar os dados!");
      }

      setLoading(false);
    };

    fetchData();
  }, [url, callFetch]);

  // 5 - refatorando post (POST e DELETE reaproveitam a mesma lógica)
  useEffect(() => {
    const httpRequest = async () => {
      if (method === "POST") {
        const res = await fetch(url, config);
        await res.json();
        // força o re-render para buscar os dados atualizados
        setCallFetch((prev) => !prev);
      } else if (method === "DELETE" && deleteId) {
        const res = await fetch(`${url}/${deleteId}`, config);
        await res.json();
        // força o re-render após exclusão
        setCallFetch((prev) => !prev);
      }
    };
    httpRequest();
  }, [config, method, url, deleteId]);
  return { data, httpConfig, loading, error };
};
