"use client";
import { useConsumerStore } from "@/stores/consumesStrore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";

interface Customer {
  customer: {
    _id: string;
    name: string;
    email: string;
    avatar?: {
      url: string;
      public: string;
    };
  };
}
interface CustomerState {
  _id: string;
  name: string;
  email: string;
  avatar?: {
    url: string;
    public: string;
  };
}

interface ApiError {
  message: string;
  status?: number;
}

export default function EndingCadastroPatient({
  id,
}: {
  backPage: () => void;
  id: string | null;
}) {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null); // Correção na tipagem
  const [customer, setCustomer] = useState<CustomerState | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { consumer } = useConsumerStore();

  useEffect(() => {
    if (!id) return;

    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/customers/${id}`, {
          method: "POST",
          credentials: "include",
        });

        if (!response.ok) {
          const errorData: ApiError = await response.json();
          throw new Error(
            `Erro ${response.status}: ${
              errorData.message || "Falha na requisição"
            }`
          );
        }

        const customerData: Customer = await response.json();
        setCustomer(customerData.customer);

        if (customerData.customer.avatar?.url) {
          setPreview(customerData.customer.avatar.url);
        }
      } catch (error) {
        console.error("Erro ao buscar cliente:", error);
        setError(error instanceof Error ? error.message : "Erro desconhecido");
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!customer) return <div>Cliente não encontrado</div>;

  return (
    <div className="md:h-[98vh] h-[100vh] md:rounded-2xl rounded-none top-0 bg-gradient-to-tl from-[#cdecf8] to-[#fff] z-10 flex flex-col justify-center items-center">
      <motion.p
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1 }}
        className="text-[#2b2b2b] bg-[#ffffffbb] font-bold text-[16px] text-center mb-5 px-3 py-2 rounded-3xl border-1 border-[#ffffff]"
      >
        Cadastrado com sucesso!
      </motion.p>
      <motion.div
        initial={{ opacity: 0, filter: "blur(10px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 1 }}
        className="px-10 w-full md:w-auto"
      >
        {customer && (
          <div className="border-1 border-[#cecece69] bg-[#ffffffd3] rounded-3xl px-4 py-4 md:px-5">
            <div className="flex gap-3 mb-8">
              <div className="w-[20px] aspect-square rounded-full bg-[#f0f0f0]"></div>
              <div className="w-[20px] aspect-square rounded-full bg-[#f0f0f0]"></div>
              <div className="w-[20px] aspect-square rounded-full bg-[#f0f0f0]"></div>
            </div>
            <div className="">
              <div className="w-full flex justify-center">
                {preview ? (
                  <Image
                    src={preview}
                    width={500}
                    height={500}
                    alt="Preview"
                    className="w-[120px] aspect-square rounded-full border-7 border-[#ffe4d97c] object-cover mb-8"
                  />
                ) : (
                  consumer.name && (
                    <div className="w-[120px] mb-8 aspect-square bg-[#000] rounded-full border-7 border-[#ffe4d97c] flex justify-center items-center font-bold text-[30px] text-white">
                      {consumer?.name.trim().split(" ")[0][0] +
                        (consumer?.name.trim().split(" ")[
                          consumer.name.trim().split(" ").length - 1
                        ][0] || "")}
                    </div>
                  )
                )}
              </div>
              <p className="text-[#333] font-bold text-[50px] leading-[1]">
                {consumer.name?.split(" ")[0] +
                  " " +
                  consumer.name?.split(" ")[
                    consumer.name?.split(" ").length - 1
                  ]}
              </p>
              <p className="text-[#c5c5c5] text-[15px]">{consumer.name}</p>
            </div>
          </div>
        )}
        <div className="mt-5 w-full flex justify-between px-2 py-2 border-1 border-[#cecece69]  rounded-[30px] bg-[#ffffffd3]">
          <button
            type="submit"
            className="px-7 py-4 text-[14px] bg-[#fff] text-[#333333fb] rounded-[60px]  border-1 border-[#f5f5f5] cursor-pointer duration-200 hover:bg-gray-200"
            onClick={() => router.push(`/admin/`)}
          >
            Início
          </button>
          <button
            type="button"
            className="px-6 py-3 text-[14px] bg-[#0165a7] border-1 border-[#f5f5f5] text-[#fff] duration-300 rounded-[60px] disabled:opacity-50 cursor-pointer hover:bg-blue-300"
            onClick={() => router.push(`/admin/patients/directory/${id}`)}
          >
            Continuar modificando
          </button>
        </div>
      </motion.div>
    </div>
  );
}
