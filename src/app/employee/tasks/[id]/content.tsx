"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Tasks } from "@/types/TasksReceive";
import useSetError from "../../appointments/hooks/useSetError";
import ErrorComponent from "../../appointments/components/errorComponent";
import TaskSelectedComponent from "./components/TaskSelectedComponent";

export default function CompleteTasksContent({ id }: { id: string }) {
  const [task, setTask] = useState<Tasks | null>(null);
  const { error, setError } = useSetError();
  useEffect(() => {
    const getTask = async () => {
      try {
        const response = await fetch(`/api/tasks/get/${id}`, {
          method: "POST",
          credentials: "include",
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Houve um erro interno");
        }
        setTask(data.data);
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    getTask();
  }, [id]);
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
      {task ? (
        <TaskSelectedComponent setError={setError} task={task} />
      ) : (
        <div className="w-full h-screen flex justify-center items-center flex-col">
          <p className="text-8xl">404</p>
          <p className="text-center text-3xl">A tarefa não foi encontrada</p>
        </div>
      )}
    </motion.section>
  );
}
