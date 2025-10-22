import CardPadronizedComponent from "@/app/employee/appointments/components/cardPadronized";
import { Customer } from "@/stores/userStore";
import { Tasks } from "@/types/TasksReceive";
import { useEffect, useState } from "react";

export default function TaskOfTheUser({ patient }: { patient: Customer }) {
  const [tasks, setTasks] = useState<Tasks[] | null>();
  useEffect(() => {
    const getTasksPerUser = async () => {
      try {
        const response = await fetch(
          `/api/tasks/get/user/${patient._id}?status=complete`,
          {
            method: "POST",
            credentials: "include",
          }
        );
        const data = await response.json();
        setTasks(data.data);
        if (!response.ok) {
          throw new Error(data.message || "Houve um erro interno");
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    };
    getTasksPerUser();
  }, [patient]);

  return (
    <div className="mt-2 grid md:grid-cols-2 grid-rows-2 gap-2">
      <div className="md:row-span-2 w-full h-100 md:h-full bg-gradient-to-tr from-[#fff] to-[#d3b09442] rounded-4xl border-4 border-[#e4d2bf] overflow-y-scroll px-3 py flex flex-col gap-2">
        <div className="px-3 mt-3 py-1 border-1 border-[#ffffff4b] text-[15px] bg-[#ffffff42] w-max rounded-full text-[#646464]">
          Tarefas Concluídas
        </div>
        <div className="flex-1 bg-[#ffffff1a] border-1 border-[#ffffff33] rounded-t-3xl px-2 py-2"></div>
      </div>
      <CardPadronizedComponent
        title="Quantidade de tarefas completas"
        fontSize="text-6xl"
        to="#d3b094"
        borderColor="#e4d2bf"
        mt={0}
        my={0}
        borderSize="4"
        arrayOfItems={String(tasks?.length) || 0}
      />
      <CardPadronizedComponent
        title="Última tarefa realizada"
        fontSize="text-5xl"
        to="#d3b094"
        borderColor="#e4d2bf"
        mt={0}
        my={0}
        borderSize="4"
        arrayOfItems={
          tasks && tasks?.length > 0
            ? String(new Date(tasks[0].createdAt).toLocaleDateString())
            : "0"
        }
      />
    </div>
  );
}
