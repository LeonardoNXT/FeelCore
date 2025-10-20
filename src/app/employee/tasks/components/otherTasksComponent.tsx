import { Tasks } from "@/types/TasksReceive";
import MapOfOtherTasksComponent from "./MapOfOtherTasks";
import { useState, useEffect } from "react";
import BoxOfInitialPagesComponent from "../../appointments/components/boxOfInitialComponents";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { getTime } from "../../appointments/components/getTime";

interface Props {
  otherTasks: Tasks[] | null;
  otherTasksContent: {
    title: string;
    summary: string;
    from: string;
    to: string;
  };
}

export default function OtherTasksComponent({
  otherTasks,
  otherTasksContent,
}: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredTasks = () => {
    if (!otherTasks) return [];

    if (!searchTerm.trim()) return otherTasks;

    const lowerSearch = searchTerm.toLowerCase();
    return otherTasks.filter((task) => {
      return (
        task.title?.toLowerCase().includes(lowerSearch) ||
        task.intendedFor?.name?.toLowerCase().includes(lowerSearch) ||
        task.status?.toLowerCase().includes(lowerSearch) ||
        getTime(task.completionDate).includes(lowerSearch)
      );
    });
  };

  const filtered = filteredTasks();

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTasks = filtered.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };
  return (
    <BoxOfInitialPagesComponent
      title={otherTasksContent.title}
      summary={otherTasksContent.summary}
      icon={false}
    >
      <div className="w-full mt-10 relative">
        <div className="w-[60%] md:w-1/2 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Buscar tarefas..."
            className="w-full px-4 py-2 bg-[#111] border-1 rounded-full duration-200 focus:outline-2 focus:outline-blue-300 text-white placeholder:text-gray-500"
          />
          <Search className="absolute top-1/2 translate-y-[-50%] right-3 text-[#333]" />
        </div>
        <div
          className={`w-full mt-4 rounded-3xl ${
            currentTasks.length > 1 ? "py-2" : ""
          } overflow-hidden relative`}
          style={{
            background: `linear-gradient(45deg, ${otherTasksContent.from} 0%, ${otherTasksContent.to} 100%)`,
          }}
        >
          <div
            className={`w-full ${
              currentTasks.length === 1 || currentTasks.length === 0
                ? "justify-center"
                : ""
            } h-full overflow-y-scroll flex gap-4`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className={`h-full w-auto flex gap-4 px-8 ${
                  totalPages > 1 ? "py-8 pb-20" : "py-8"
                }`}
              >
                {currentTasks.length > 0 ? (
                  <MapOfOtherTasksComponent tasks={currentTasks} />
                ) : (
                  <div className="w-full flex justify-center items-center h-50 text-center">
                    <motion.p
                      initial={{ scale: 0.5 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.5 }}
                      transition={{
                        duration: 0.3,
                        type: "spring",
                        ease: "circInOut",
                      }}
                      className="text-[#333] text-2xl"
                    >
                      {searchTerm
                        ? "Nenhuma tarefa encontrada com esse termo."
                        : "Não há tarefas definidas."}
                    </motion.p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="absolute left-0  bottom-5 w-full flex items-center justify-center gap-4 mt-6">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="p-2 rounded-2xl bg-[#fff] disabled:opacity-50 text-[#333] disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-4 py-2 bg-[#fff] text-[#646464] border-1 border-[#eee] rounded-2xl">
              {currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="p-2 rounded-2xl bg-[#fff] text-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </BoxOfInitialPagesComponent>
  );
}
