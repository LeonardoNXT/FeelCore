"use client";
import { useEffect, useState } from "react";

import { Customer } from "@/stores/userStore";
import { AnimatePresence, motion } from "framer-motion";
import PatientMainContentComponent from "./components/patientMainContent";
import PatientMoodDiaryComponent from "./components/moodDiaryPatientComponent";
import useSetError from "../../appointments/hooks/useSetError";
import ErrorComponent from "../../appointments/components/errorComponent";

export default function PatientOfEmployeeContent({
  params,
}: {
  params: { id: string };
}) {
  const [patient, setPatient] = useState<Customer | null>(null);
  const [load, setLoad] = useState<boolean>(true);
  const { error, setError } = useSetError();

  const CONFIG_PAGE = {
    border_color: "#e4d2bf",
  };

  useEffect(() => {
    const getPatient = async () => {
      if (!params.id) return console.log("[ID Ausente]");
      try {
        const response = await fetch(`/api/customers/${params.id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Houve um erro interno.");
        }

        console.log("[ PATIENT ID RETURN ]", data.customer);
        setPatient(data.customer);
        setLoad(false);
      } catch (err) {
        console.log(err);
        setLoad(false);
      }
    };
    getPatient();
  }, [params]);

  useEffect(() => {
    console.log("PATIENT ID", patient);
  }, [patient]);

  return (
    <AnimatePresence mode="wait">
      {!load ? (
        <section className="w-full h-full bg-gradient-to-tr from-[#fff6f1] to-[#a8866a] flex justify-center relative">
          {error && (
            <ErrorComponent
              errorContent={error}
              bg="bg-[#fff]"
              display="fixed"
              onClick={() => setError(null)}
            />
          )}
          <div className="md:max-w-[800px] w-full px-4 md:px-0 min-h-screen py-25 md:py-35">
            {patient ? (
              <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
              >
                <PatientMainContentComponent
                  patient={patient}
                  setError={setError}
                  setPatient={setPatient}
                />

                {patient.mood_diary.length > 0 && (
                  <PatientMoodDiaryComponent
                    patient={patient}
                    CONFIG_PAGE={CONFIG_PAGE}
                  />
                )}
              </motion.section>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full flex flex-col justify-center items-center"
              >
                <p className="text-9xl font-bold">404</p>
                <p className="text-2xl md:text-3xl text-center">
                  Não foi possível de achar o usuário
                </p>
              </motion.div>
            )}
          </div>
        </section>
      ) : (
        <motion.div
          className="w-full h-screen bg-gradient-to-tr from-[#fff6f1] to-[#a8866a] flex justify-center items-center"
          key={"loading"}
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#fff] text-shadow text-shadow-[#fff] text-3xl"
          >
            Carregando...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
