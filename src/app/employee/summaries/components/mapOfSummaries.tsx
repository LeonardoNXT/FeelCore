import { ReceiveSummaries, Summary } from "@/types/summaries";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import BoxOfInitialPagesComponent from "../../appointments/components/boxOfInitialComponents";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { getInitials } from "../../appointments/components/getInitials";
import ButtonToGoOnSummary from "./buttonToGoOnSummary";
import { AnimatePresence, motion } from "framer-motion";

export default function MapOfSummaries({
  setChangePage,
}: {
  setChangePage: Dispatch<SetStateAction<boolean>>;
}) {
  const [summaries, setSummaries] = useState<Summary[] | null>(null);
  const [filteredSummaries, setFilteredSummaries] = useState<Summary[] | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    const getAllSumaries = async () => {
      try {
        const response = await fetch("/api/summaries/get/all", {
          method: "POST",
          credentials: "include",
        });
        const data = (await response.json()) as ReceiveSummaries;
        if (!response.ok) {
          throw new Error("Houve um erro interno");
        }
        if (data.data.length === 0) return;
        setSummaries(data.data);
        setFilteredSummaries(data.data);
      } catch (err) {
        console.log(err);
      }
    };
    getAllSumaries();
  }, []);

  useEffect(() => {
    if (!summaries) return;

    const filtered = summaries.filter((summary) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        summary.title.toLowerCase().includes(searchLower) ||
        summary.created_for.name.toLowerCase().includes(searchLower)
      );
    });

    setFilteredSummaries(filtered);
    setCurrentPage(1);
  }, [searchTerm, summaries]);

  const totalPages = filteredSummaries
    ? Math.ceil(filteredSummaries.length / itemsPerPage)
    : 0;

  const paginatedSummaries = filteredSummaries
    ? filteredSummaries.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : [];

  return (
    <BoxOfInitialPagesComponent
      title="Resumos criados"
      summary="Nesta seção, você encontrará todos os resumos clínicos elaborados com base nas sessões realizadas com os pacientes. Cada resumo contém informações relevantes sobre o progresso terapêutico, estratégias utilizadas, aspectos emocionais e comportamentais observados, além de reflexões importantes para o acompanhamento contínuo."
      icon={false}
    >
      <AnimatePresence>
        <div className="mt-10 relative w-auto h-auto">
          <div className="w-[60%] md:w-1/2 relative">
            <input
              placeholder="Procurar por :"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-[#111] border-1 rounded-full duration-200 focus:outline-2 focus:outline-blue-300 text-white placeholder:text-gray-500"
            />
            <Search className="text-[#333] absolute top-1/2 translate-y-[-50%] right-3" />
          </div>

          <motion.div
            layout
            transition={{ duration: 0.3, ease: "circInOut", type: "spring" }}
            className={`${
              paginatedSummaries.length > 1 && "pb-5"
            } bg-gradient-to-tr from-[#fff] to-purple-300 rounded-3xl relative`}
          >
            <motion.div
              layout
              transition={{ duration: 0.3, ease: "circInOut", type: "spring" }}
              className={`mt-4 w-full px-4 ${
                paginatedSummaries.length > 1 && "py-10 pb-20"
              } ${
                paginatedSummaries.length === 1 && "py-10 pb-10 justify-center"
              } flex gap-4 overflow-x-scroll overflow-y-hidden`}
            >
              {paginatedSummaries.length > 0 ? (
                paginatedSummaries.map((summary) => (
                  <motion.div
                    key={summary._id}
                    className="px-2 min-w-[450px] w-min h-auto py-2 bg-gradient-to-tr from-[#fff] rounded-3xl"
                    layout
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.5, opacity: 0 }}
                    transition={{
                      ease: "circInOut",
                      type: "spring",
                      duration: 0.3,
                    }}
                    whileHover={{
                      scale: 1.01,
                      transition: {
                        duration: 0.3,
                        type: "spring",
                        ease: "circInOut",
                      },
                    }}
                  >
                    <div className="flex gap-4 px-1 py-1 border-1 border-[#c5c5c56c] w-max rounded-full items-center pr-4">
                      {summary.created_for.avatar ? (
                        <Image
                          src={summary.created_for.avatar.url}
                          width={30}
                          height={30}
                          alt="Imagem do paciente"
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-[30px] aspect-square rounded-full border-4 border-[#d1ceff] text-[8px] bg-[#333] flex justify-center items-center">
                          {getInitials(summary.created_for.name)}
                        </div>
                      )}
                      <p className="text-[#504f4f] text-[14px]">
                        {summary.created_for.name} |{" "}
                        {new Date(summary.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="h-40 flex flex-col justify-center">
                      <p className="text-[#646464] px-4 tracking-widest  text-[14px]">
                        Título
                      </p>
                      <p className="text-2xl text-[#333] px-4 pt-0">
                        {summary.title}
                      </p>
                    </div>
                    <div className="w-full flex justify-end">
                      <ButtonToGoOnSummary
                        route={`/employee/summaries/${summary._id}`}
                        setChangePage={setChangePage}
                      />
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{
                    duration: 0.3,
                    ease: "circInOut",
                    type: "spring",
                  }}
                  className="h-[384px] w-full flex justify-center items-center text-center text-3xl"
                >
                  {searchTerm
                    ? "Nenhum resumo encontrado"
                    : "Não foi possível encontrar nenhum resumo"}
                </motion.div>
              )}
            </motion.div>
            {totalPages > 1 && (
              <div className="absolute left-1/2 translate-x-[-50%] bottom-10  flex items-center justify-center gap-4">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-2xl bg-[#fff] disabled:opacity-50 text-[#333] disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <div className="px-4 py-2 bg-[#fff] text-[#646464] border-1 border-[#eee] rounded-2xl">
                  {currentPage} / {totalPages}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-2xl bg-[#fff] text-[#333] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#ffefd7] transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </AnimatePresence>
    </BoxOfInitialPagesComponent>
  );
}
