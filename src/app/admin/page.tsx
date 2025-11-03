"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getInitials } from "@/app/employee/appointments/components/getInitials";
import { GraficoDeContratacoes } from "@/components/graphic/graphicADMadmission";

interface Employee {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
  patients: string[];
  status: "Ativo" | "Inativo";
}

interface Customer {
  _id: string;
  name: string;
  avatar?: {
    url: string;
  };
  mood_entries: number;
}

interface Notification {
  _id: string;
  status: "lido" | "enviado";
  title: string;
  summary: string;
  notification_type: "Agendamento" | "Tarefa" | "Funcionários" | "Pacientes";
  createdAt: string;
  updatedAt: string;
}

interface EmployeesResponse {
  employees: Employee[];
  total: number;
  ativos: number;
  inativos: number;
  message: string;
}

interface CustomersResponse {
  total: number;
  ativos: number;
  inativos: number;
  mood_stats: {
    total_entries: number;
    top_contributors: Customer[];
  };
  message: string;
}

interface AppointmentsResponse {
  total: number;
  message: string;
}

interface NotificationsResponse {
  unread: number;
  total: number;
  getAllAppointments: Notification[];
}

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estados para funcionários
  const [topEmployees, setTopEmployees] = useState<Employee[]>([]);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  /* eslint-disable */
  const [inactiveEmployees, setInactiveEmployees] = useState(0);
  /* eslint-enable */
  // Estados para pacientes
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [activeCustomers, setActiveCustomers] = useState(0);
  const [topMoodContributors, setTopMoodContributors] = useState<Customer[]>(
    []
  );
  const [totalMoodEntries, setTotalMoodEntries] = useState(0);

  // Estado para agendamentos
  const [totalAppointments, setTotalAppointments] = useState(0);

  // Estados para notificações
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [totalNotifications, setTotalNotifications] = useState(0);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados de funcionários
      const employeesRes = await fetch("/api/employees/all", {
        method: "POST",
        credentials: "include",
      });

      if (employeesRes.ok) {
        const employeesData: EmployeesResponse = await employeesRes.json();
        const sortedEmployees = employeesData.employees
          .sort((a, b) => b.patients.length - a.patients.length)
          .slice(0, 2);
        setTopEmployees(sortedEmployees);
        setTotalEmployees(employeesData.total);
        setActiveEmployees(employeesData.ativos);
        setInactiveEmployees(employeesData.inativos);
      }

      // Buscar dados de clientes
      const customersRes = await fetch("/api/customers/stats", {
        method: "POST",
        credentials: "include",
      });

      if (customersRes.ok) {
        const customersData: CustomersResponse = await customersRes.json();
        setTotalCustomers(customersData.total);
        setActiveCustomers(customersData.ativos);
        setTopMoodContributors(
          customersData.mood_stats.top_contributors.slice(0, 2)
        );
        setTotalMoodEntries(customersData.mood_stats.total_entries);
      }

      // Buscar dados de agendamentos
      const appointmentsRes = await fetch("/api/appointments/all", {
        method: "POST",
        credentials: "include",
      });

      if (appointmentsRes.ok) {
        const appointmentsData: AppointmentsResponse =
          await appointmentsRes.json();
        setTotalAppointments(appointmentsData.total);
      }

      // Buscar notificações
      const notificationsRes = await fetch("/api/notification/all", {
        method: "POST",
        credentials: "include",
      });

      if (notificationsRes.ok) {
        const notificationsData: NotificationsResponse =
          await notificationsRes.json();
        setNotifications(notificationsData.getAllAppointments.slice(0, 4));
        setUnreadCount(notificationsData.unread);
        setTotalNotifications(notificationsData.total);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      console.error("Erro ao buscar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notification/read/${notificationId}`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Atualizar o estado local
        setNotifications((prev) =>
          prev.map((notif) =>
            notif._id === notificationId ? { ...notif, status: "lido" } : notif
          )
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error("Erro ao marcar notificação como lida:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Marcar notificações como lidas quando entram na visualização
  useEffect(() => {
    const unreadNotifications = notifications.filter(
      (n) => n.status === "enviado"
    );
    unreadNotifications.forEach((notification) => {
      markAsRead(notification._id);
    });
  }, [notifications]);

  const getNotificationTypeColor = (type: string) => {
    switch (type) {
      case "Agendamento":
        return "bg-[#4ade8021] border-[#4ade8051] text-[#4ade80]";
      case "Tarefa":
        return "bg-[#fbbf2421] border-[#fbbf2451] text-[#fbbf24]";
      case "Funcionários":
        return "bg-[#a78bfa21] border-[#a78bfa51] text-[#a78bfa]";
      case "Pacientes":
        return "bg-[#60a5fa21] border-[#60a5fa51] text-[#60a5fa]";
      default:
        return "bg-[#ffffff21] border-[#ffffff51] text-[#ffffff]";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Agora";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return "Ontem";
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-[5vw] md:text-[2vw] mb-[2vw] md:mb-[1vw]">
            Carregando dashboard...
          </div>
          <div className="w-[10vw] h-[10vw] md:w-[4vw] md:h-[4vw] border-[0.5vw] md:border-[0.3vw] border-[#ffffff3a] border-t-white rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        <div className="text-center">
          <div className="text-[5vw] md:text-[2vw] mb-[2vw] md:mb-[1vw]">
            Erro ao carregar dados
          </div>
          <div className="text-[3vw] md:text-[1vw]">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen">
      <motion.div
        className="w-full min-h-screen md:h-auto relative 2xl:rounded-tl-[2vw] 2xl:rounded-[2vw] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Image
          src="/background.jpg"
          alt="Background image"
          fill
          className="object-cover brightness-75"
        />
        <div className="w-full min-h-screen backdrop-blur-2xl relative p-[3vw] md:p-[1vw] flex flex-col gap-[3vw] md:gap-[1vw]">
          <div className="absolute left-0 bottom-0 w-full h-[40%] bg-gradient-to-t from-[#0a0a0a] to-transparent pointer-events-none"></div>

          {/* Linha Superior - Cards de Resumo */}
          <div className="w-full grid grid-cols-1 md:grid-cols-4 gap-[3vw] md:gap-[1vw]">
            {/* Total de Agendamentos */}
            <motion.div
              className="bg-gradient-to-br from-[#ffffff1a] to-[#ffffff05] rounded-[4vw] md:rounded-[2vw] p-[4vw] md:p-[1.2vw] flex justify-center items-center flex-col relative border-[1] border-[#ffffff15] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#4ade80] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Agendamentos
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center py-[3vw] md:py-10">
                <div className="text-[15vw] md:text-[5vw] font-bold leading-[0.9]">
                  {totalAppointments}
                </div>
                <p className="text-[3vw] md:text-[0.75vw] mt-[2vw] md:mt-[0.5vw] tracking-wide text-[#ffffff7a]">
                  Total de agendamentos
                </p>
              </div>
            </motion.div>

            {/* Total de Pacientes */}
            <motion.div
              className="bg-gradient-to-br from-[#ffffff1a] to-[#ffffff05] rounded-[4vw] md:rounded-[2vw] p-[4vw] md:p-[1.2vw] flex justify-center items-center flex-col relative border-[1] border-[#ffffff15] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#60a5fa] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Pacientes
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center py-[3vw] md:py-0">
                <div className="text-[15vw] md:text-[5vw] font-bold leading-[0.9]">
                  {totalCustomers}
                </div>
                <p className="text-[3vw] md:text-[0.75vw] mt-[2vw] md:mt-[0.5vw] tracking-wide text-[#ffffff7a]">
                  {activeCustomers} ativos
                </p>
              </div>
            </motion.div>

            {/* Total de Profissionais */}
            <motion.div
              className="bg-gradient-to-br from-[#ffffff1a] to-[#ffffff05] rounded-[4vw] md:rounded-[2vw] p-[4vw] md:p-[1.2vw] flex justify-center items-center flex-col relative border-[1] border-[#ffffff15] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#a78bfa] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Profissionais
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center py-[3vw] md:py-0">
                <div className="text-[15vw] md:text-[5vw] font-bold leading-[0.9]">
                  {totalEmployees}
                </div>
                <p className="text-[3vw] md:text-[0.75vw] mt-[2vw] md:mt-[0.5vw] tracking-wide text-[#ffffff7a]">
                  {activeEmployees} ativos
                </p>
              </div>
            </motion.div>

            {/* Diário de Humor */}
            <motion.div
              className="bg-gradient-to-br from-[#ffffff1a] to-[#ffffff05] rounded-[4vw] md:rounded-[2vw] p-[4vw] md:p-[1.2vw] flex justify-center items-center flex-col relative border-[1] border-[#ffffff15] backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#fbbf24] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Diário de Humor
                  </p>
                </div>
              </div>
              <div className="w-full h-full flex flex-col justify-center items-center py-[3vw] md:py-0">
                <div className="text-[15vw] md:text-[5vw] font-bold leading-[0.9]">
                  {totalMoodEntries}
                </div>
                <p className="text-[3vw] md:text-[0.75vw] mt-[2vw] md:mt-[0.5vw] tracking-wide text-[#ffffff7a]">
                  Entradas totais
                </p>
              </div>
            </motion.div>
          </div>

          {/* Linha do Meio - Top Performers */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[3vw] md:gap-[1vw]">
            {/* Profissionais com mais pacientes */}
            <motion.div
              className="bg-[#ffffff1a] rounded-[4vw] md:rounded-[2vw] border-[1] border-[#ffffff15] relative p-[4vw] md:p-[1.2vw] flex flex-col backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#a78bfa] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Top Profissionais
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 place-items-center gap-[3vw] md:gap-[2vw] px-[2vw] relative flex-1 py-[4vw] md:py-[1vw]">
                {topEmployees.map((employee) => (
                  <div
                    key={employee._id}
                    className="w-full h-full flex-col flex justify-center items-center"
                  >
                    <p className="text-[4vw] md:text-[1.5vw] mb-[1vw] md:mb-[0.5vw] font-medium">
                      {employee.name.split(" ")[0]}
                    </p>
                    {employee.avatar ? (
                      <Image
                        src={employee.avatar.url}
                        alt={`Avatar de ${employee.name}`}
                        fill
                        className="rounded-[50%] object-cover aspect-square !relative !w-[70%] !h-auto border-[0.5vw] md:border-[0.2vw] border-[#a78bfa]"
                      />
                    ) : (
                      <div className="w-[70%] aspect-square rounded-full bg-[#111] border-[0.5vw] md:border-[0.2vw] border-[#a78bfa] text-[6vw] md:text-[2vw] flex justify-center items-center">
                        {getInitials(employee.name)}
                      </div>
                    )}
                    <p className="mt-[2vw] md:mt-[0.7vw] text-[3vw] md:text-[0.9vw] border-1 px-[4vw] md:px-[0.8vw] py-[1vw] md:py-[0.15vw] border-[#a78bfa7a] bg-[#a78bfa1a] rounded-[5vw] md:rounded-[2vw]">
                      {employee.patients.length} pacientes
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Pacientes mais engajados */}
            <motion.div
              className="bg-[#ffffff1a] rounded-[4vw] md:rounded-[2vw] border-[1] border-[#ffffff15] relative p-[4vw] md:p-[1.2vw] flex flex-col backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f]">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#fbbf24] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Top Engajamento
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 place-items-center gap-[3vw] md:gap-[2vw] px-[2vw] relative flex-1 py-[4vw] md:py-[1vw]">
                {topMoodContributors.length > 0 ? (
                  topMoodContributors.map((customer) => (
                    <div
                      key={customer._id}
                      className="w-full h-full flex-col flex justify-center items-center"
                    >
                      <p className="text-[4vw] md:text-[1.5vw] mb-[1vw] md:mb-[0.5vw] font-medium">
                        {customer.name.split(" ")[0]}
                      </p>
                      {customer.avatar ? (
                        <Image
                          src={customer.avatar.url}
                          alt={`Avatar de ${customer.name}`}
                          fill
                          className="rounded-[50%] object-cover aspect-square !relative !w-[70%] !h-auto border-[0.5vw] md:border-[0.2vw] border-[#fbbf24]"
                        />
                      ) : (
                        <div className="w-[70%] aspect-square rounded-full bg-[#111] border-[0.5vw] md:border-[0.2vw] border-[#fbbf24] text-[6vw] md:text-[2vw] flex justify-center items-center">
                          {getInitials(customer.name)}
                        </div>
                      )}
                      <p className="mt-[2vw] md:mt-[0.7vw] text-[3vw] md:text-[0.9vw] border-1 px-[4vw] md:px-[0.8vw] py-[1vw] md:py-[0.15vw] border-[#fbbf247a] bg-[#fbbf241a] rounded-[5vw] md:rounded-[2vw]">
                        {customer.mood_entries} entradas
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="col-span-2 text-center text-[#ffffff7a] text-[3vw] md:text-[1vw]">
                    Nenhuma entrada ainda
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Linha Inferior - Gráfico e Notificações */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-[3vw] md:gap-[1vw]">
            {/* Gráfico de Contratações */}
            <motion.div
              className="bg-[#ffffff0a] rounded-[4vw] md:rounded-[2vw] border-[1] border-[#ffffff15] backdrop-blur-sm overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <GraficoDeContratacoes />
            </motion.div>

            {/* Área de Notificações */}
            <motion.div
              className="bg-[#ffffff1a] rounded-[4vw] md:rounded-[2vw] border-[1] border-[#ffffff15] relative p-[4vw] md:p-[1.2vw] flex flex-col backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
            >
              <div className="w-full relative flex pb-[2vw] md:pb-[0.8vw] border-b-[1] border-[#f7f7f74f] items-center justify-between">
                <div className="flex items-center justify-center gap-[1vw] md:gap-[0.4vw]">
                  <div className="aspect-square w-[2.5vw] md:w-[1vw] bg-[#ffffff] rounded-full"></div>
                  <p className="text-[#ebebeb] text-[3vw] md:text-[0.75vw] tracking-wide">
                    Notificações Recentes
                  </p>
                </div>
                {unreadCount > 0 && (
                  <div className="bg-[#ef444421] border-[1] border-[#ef4444] text-[#ef4444] px-[2vw] md:px-[0.6vw] py-[0.5vw] md:py-[0.2vw] rounded-full text-[2.5vw] md:text-[0.7vw] font-semibold">
                    {unreadCount} novas
                  </div>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-[2vw] md:space-y-[0.8vw] mt-[3vw] md:mt-[1vw] pr-[1vw] md:pr-[0.5vw] max-h-[60vw] md:max-h-[25vw]">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <motion.div
                      key={notification._id}
                      className={`p-[3vw] md:p-[1vw] rounded-[3vw] md:rounded-[1.5vw] border-[1] transition-all duration-200 ${
                        notification.status === "enviado"
                          ? "bg-[#ffffff15] border-[#ffffff2a]"
                          : "bg-[#ffffff08] border-[#ffffff15]"
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className="flex items-start gap-[2vw] md:gap-[0.8vw]">
                        <div
                          className={`text-[5vw] md:text-[1.5vw] p-[2vw] md:p-[0.6vw] rounded-[2vw] md:rounded-[1vw] border-[1] ${getNotificationTypeColor(
                            notification.notification_type
                          )}`}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-[2vw] md:gap-[0.5vw]">
                            <h4 className="text-[3.5vw] md:text-[20px] text-white truncate">
                              {notification.title}
                            </h4>
                            <div
                              className={`inline-block px-[2.5vw] md:px-[0.6vw] py-[1vw] md:py-[0.2vw] rounded-full text-[2.5vw] md:text-[0.65vw] font-medium ${getNotificationTypeColor(
                                notification.notification_type
                              )}`}
                            >
                              {notification.notification_type}
                            </div>
                          </div>
                          <p className="text-[3vw] md:text-[0.75vw] text-[#ffffffa1] mt-[1vw] md:mt-[0.3vw] line-clamp-2">
                            {notification.summary}
                          </p>
                          <span className="text-[2.5vw] md:text-[0.7vw] text-[#ffffff7a] whitespace-nowrap">
                            {formatDate(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center py-[8vw] md:py-[3vw]">
                    <div className="text-[10vw] md:text-[3vw] mb-[2vw] md:mb-[0.8vw] opacity-50">
                      🔔
                    </div>
                    <p className="text-[#ffffff7a] text-[3.5vw] md:text-[0.9vw]">
                      Nenhuma notificação
                    </p>
                    <p className="text-[#ffffff5a] text-[3vw] md:text-[0.75vw] mt-[1vw] md:mt-[0.3vw]">
                      Você está em dia com tudo!
                    </p>
                  </div>
                )}
              </div>

              {totalNotifications > 4 && (
                <div className="w-full pt-[2vw] md:pt-[0.8vw] mt-[2vw] md:mt-[0.8vw] border-t-[1] border-[#ffffff1a]">
                  <button className="w-full text-[3vw] md:text-[0.8vw] text-[#ffffff9a] hover:text-white transition-colors duration-200 text-center">
                    Ver todas as {totalNotifications} notificações →
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
