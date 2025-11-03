import CardPadronizedComponent from "@/app/employee/appointments/components/cardPadronized";
import { Customer } from "@/stores/userStore";
import { Tasks } from "@/types/TasksReceive";
import { MoveUpRight } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function TaskOfTheUser({ patient }: { patient: Customer }) {
  const [tasks, setTasks] = useState<Tasks[] | null>();
  const router = useRouter();
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
    <div className="mt-2 grid md:grid-cols-2 md:grid-rows-2 gap-2">
      <div className="md:row-span-2 w-full h-100 md:h-full md:max-h-80 relative bg-gradient-to-tr from-[#fff] to-[#d3b09442] rounded-4xl border-4 border-[#e4d2bf] overflow-hidden px-3 py flex flex-col gap-2">
        <div className="px-3 mt-3 py-1 border-1 border-[#ffffff4b] text-[15px] bg-[#ffffff42] w-max rounded-full text-[#646464]">
          Últimas 10 tarefas concluídas
        </div>
        <div className="bg-[#ffffff1a] flex-1 border-1 border-[#ffffff33] rounded-t-3xl px-2 py-2 overflow-y-scroll">
          {tasks ? (
            tasks.length > 1 ? (
              <div className="w-full h-max flex flex-col gap-2">
                {tasks.slice(0, 10).map((task, i) => (
                  <div
                    key={i}
                    className="w-full px-4 py-4 bg-gradient-to-tr from-[#fff] rounded-2xl flex flex-col gap-5"
                  >
                    <div>
                      <div className="flex justify-between text-[#646464] text-[14px]">
                        <p>{new Date(task.updatedAt).toLocaleDateString()}</p>
                        <p>-</p>
                        <p>
                          {new Date(task.completionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] text-[#999] tracking-widest">
                      Título
                    </p>
                    <p className="text-2xl text-[#333]">{task.title}</p>
                    <div className="w-full flex justify-end">
                      <div
                        className="w-10 h-10 rounded-full border-1 border-[#9797974d] flex justify-center items-center px-2 py-2 text-[#333] cursor-pointer duration-300 hover:rotate-45 hover:bg-[#fff]"
                        onClick={() =>
                          router.push(`/employee/tasks/${task._id}`)
                        }
                      >
                        <MoveUpRight className="w-full h-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="w-full h-full flex justify-center items-center text-center text-2xl">
                Não há tarefas completas deste paciente.
              </div>
            )
          ) : (
            <div className="w-full h-full flex justify-center items-center text-center text-2xl text-[#333] px-4">
              Não há tarefas completas deste paciente.
            </div>
          )}
        </div>
      </div>

      <CardPadronizedComponent
        title="Quantidade de tarefas completas"
        fontSize="text-6xl"
        to="#d3b094"
        borderColor="#e4d2bf"
        mt={0}
        my={0}
        borderSize="4"
        arrayOfItems={tasks ? String(tasks?.length) || 0 : "0"}
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
          tasks
            ? tasks?.length > 0
              ? String(new Date(tasks[0].createdAt).toLocaleDateString())
              : "0"
            : "Não há."
        }
      />
    </div>
  );
}
