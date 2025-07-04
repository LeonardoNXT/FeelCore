"use client";

import { useEffect } from "react";
import ContentDirectory from "./content";
import { useEmployeesStore } from "@/stores/employeesStore";

export default function Directory() {
  const { employees, total, setEmployees, hasFetched, setHasFetched } =
    useEmployeesStore();

  useEffect(() => {
    if (!hasFetched) {
      fetch("/api/employees")
        .then((res) => {
          if (!res.ok) throw new Error("Erro na requisição");
          return res.json();
        })
        .then((data) => {
          setEmployees({ employees: data.employees, total: data.total });
          setHasFetched(true);
        })
        .catch((err) => {
          console.error("Erro ao buscar funcionários:", err);
        });
    }
  }, [hasFetched, setEmployees, setHasFetched]);

  if (!hasFetched) return <p>Carregando...</p>;

  return <ContentDirectory data={{ employees, total }} />;
}
