"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { Tasks } from "@/types/TasksReceive";
import useSetError from "../../appointments/hooks/useSetError";
import ErrorComponent from "../../appointments/components/errorComponent";
import TaskSelectedComponent from "./components/TaskSelectedComponent";

export default function CompleteTasksContent({ id }: { id: string }) {
  const [task, setTask] = useState<Tasks | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { error, setError } = useSetError();

  useEffect(() => {
    const getTask = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tasks/get/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();

        if (!response.ok) {
          if (response.status === 404) {
            setNotFound(true);
          } else {
            throw new Error(data.error || "Houve um erro interno");
          }
        } else {
          setTask(data.data);
          console.log(data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    getTask();
  }, [id, setError]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full min-h-screen h-full flex justify-center bg-gradient-to-bl from-[#30362f] to-[#000000] backdrop-blur-[20px] overflow-y-scroll relative"
    >
      {error && (
        <ErrorComponent
          errorContent={error}
          bg="bg-[#fff]"
          display="fixed"
          onClick={() => setError(null)}
        />
      )}

      {isLoading ? (
        <div className="w-full h-screen flex justify-center items-center">
          <LoaderCircle className="w-12 h-12 animate-spin text-white" />
        </div>
      ) : notFound ? (
        <div className="w-full h-screen flex justify-center items-center flex-col text-white">
          <p className="text-8xl font-bold mb-4">404</p>
          <p className="text-center text-3xl">A tarefa não foi encontrada</p>
        </div>
      ) : task ? (
        <TaskSelectedComponent setError={setError} task={task} />
      ) : null}
    </motion.section>
  );
}
