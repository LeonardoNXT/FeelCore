import { Tasks } from "@/types/TasksReceive";
import MapOfOtherTasksComponent from "./MapOfOtherTasks";
import { Dispatch, SetStateAction } from "react";
import BoxOfInitialPagesComponent from "../../appointments/components/boxOfInitialComponents";

interface Props {
  otherTasks: Tasks[] | null;
  setPendingTaskSelected: Dispatch<SetStateAction<Tasks | null>>;
}

export default function OtherTasksComponent({
  otherTasks,
  setPendingTaskSelected,
}: Props) {
  return (
    <BoxOfInitialPagesComponent
      title="Outras tarefas pendentes"
      summary="Visualize e acompanhe todas as tarefas que ainda precisam ser concluídas. Mantenha o foco e organize suas prioridades."
      icon={false}
    >
      <div className="w-full mt-10 bg-gradient-to-tr from-[#425e5e] to-amber-100 rounded-3xl py-2 overflow-hidden">
        <div className="w-full h-full overflow-y-scroll flex gap-4">
          <div
            className={`h-full ${
              otherTasks && otherTasks.length <= 1 && "justify-center"
            } w-full flex gap-4 px-8 py-8`}
          >
            {otherTasks && otherTasks.length > 0 ? (
              <MapOfOtherTasksComponent
                tasks={otherTasks}
                setPendingTaskSelected={setPendingTaskSelected}
              />
            ) : (
              <div className="w-full flex justify-center items-center h-50 text-center">
                <p className="text-[#333] text-2xl">
                  Não há tarefas definidas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </BoxOfInitialPagesComponent>
  );
}
