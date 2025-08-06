"use client";
import { useState, useEffect } from "react";

interface CustomerResponse {
  message: string;
  customer: {
    _id: string;
    name: string;
    email: string;
    age: number;
    full_name: string;
    birth_date: string;
    profession?: string;
    status: string;
    is_minor: boolean;
    createdAt: string;
    avatar?: {
      url: string;
      public_id: string;
    };
    address?: {
      street: string;
      number: string;
      neighborhood: string;
      city: string;
      state: string;
      zip_code: string;
      complement?: string;
    };
    disorders?: string[];
    patient_of?: {
      _id: string;
      name: string;
      email: string;
    };
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
  missing_fields?: any;
  problematic_field?: string;
}

export default function CustomerRegistrationTest() {
  const [response, setResponse] = useState<CustomerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<ErrorResponse | null>(null);
  const [debugLogs, setDebugLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setDebugLogs((prev) => [
      ...prev,
      `${new Date().toLocaleTimeString()}: ${message}`,
    ]);
    console.log(message);
  };

  useEffect(() => {
    const testCustomerRegistration = async () => {
      setLoading(true);
      setError(null);
      setDebugLogs([]);

      try {
        addLog("🚀 Iniciando teste de registro de customer...");

        // Primeiro, vamos buscar um funcionário válido para usar como patient_of
        addLog("👨‍💼 Buscando funcionário válido...");
        const employeesResponse = await fetch("/api/employees", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        let patient_of_id = "675aa7a52b4aae5ca5e1e8c0"; // ID padrão se não conseguir buscar

        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json();
          if (employeesData.employees && employeesData.employees.length > 0) {
            patient_of_id = employeesData.employees[0]._id;
            addLog(`✅ Funcionário encontrado: ${patient_of_id}`);
          }
        } else {
          addLog("⚠️ Usando ID padrão para patient_of");
        }

        // Preparar dados estruturados
        addLog("📋 Preparando dados estruturados...");

        // Endereço
        const address = {
          street: "Rua das Flores",
          number: "123",
          neighborhood: "Centro",
          city: "São Paulo",
          state: "SP",
          zip_code: "01234-567",
          complement: "Apt 45",
        };

        // Contatos
        const contacts = {
          phone: "(11) 99999-9999",
          emergency_contact: "(11) 88888-8888",
          emergency_name: "Maria Silva",
        };

        // Dados dos pais/responsáveis
        const parents_or_guardians = {
          father_name: "José da Silva",
          mother_name: "Maria da Silva",
          guardian_name: "",
          guardian_relationship: "",
        };

        // Histórico médico
        const medical_history = {
          previous_health_problems: ["Hipertensão", "Diabetes"],
          current_medical_conditions: ["Ansiedade"],
          current_medications: ["Losartana", "Metformina"],
          allergies: ["Penicilina"],
          surgeries: ["Apendicectomia (2015)"],
          hospitalizations: ["Pneumonia (2020)"],
        };

        // Avaliação
        const assessment = {
          chief_complaint: "Ansiedade e estresse no trabalho",
          history_of_present_illness:
            "Paciente relata sintomas de ansiedade há 6 meses, principalmente relacionados ao ambiente de trabalho. Apresenta palpitações, sudorese e pensamentos acelerados durante situações de pressão.",
          family_history: {
            mental_health_family: ["Depressão (mãe)", "Ansiedade (irmão)"],
            medical_family_history: ["Diabetes (pai)", "Hipertensão (avô)"],
          },
          development_history: {
            pregnancy_delivery: "Parto normal, sem complicações",
            early_development: "Desenvolvimento normal",
            school_performance: "Bom desempenho acadêmico",
            social_relationships: "Relacionamentos saudáveis",
          },
          psychiatric_history: {
            previous_treatments: ["Terapia cognitivo-comportamental (2019)"],
            previous_medications: ["Sertralina (descontinuada)"],
            previous_hospitalizations: [],
            substance_use: "Ocasional consumo de álcool social",
          },
          mental_status: {
            appearance: "Bem cuidado, adequadamente vestido",
            behavior: "Cooperativo, ansioso",
            speech: "Normal em ritmo e tom",
            mood: "Ansioso",
            affect: "Congruente com o humor",
            thought_process: "Organizado",
            thought_content: "Preocupações com trabalho",
            perceptual_disturbances: "Negadas",
            cognitive_function: "Preservada",
            insight: "Bom",
            judgment: "Preservado",
          },
        };

        // Objetivos do tratamento
        const treatment_objectives = {
          short_term_goals: [
            "Reduzir sintomas de ansiedade",
            "Melhorar qualidade do sono",
            "Desenvolver técnicas de relaxamento",
          ],
          long_term_goals: [
            "Desenvolver estratégias de enfrentamento",
            "Manter estabilidade emocional",
            "Melhorar qualidade de vida geral",
          ],
          treatment_approach: "Terapia cognitivo-comportamental",
          expected_duration: "6-12 meses",
          success_criteria: [
            "Redução de 50% nos sintomas de ansiedade",
            "Melhora na qualidade de vida",
            "Retorno às atividades normais",
          ],
        };

        // Transtornos - CAMPO PRINCIPAL DO PROBLEMA
        const disorders = [
          "Transtorno de Ansiedade Generalizada",
          "Episódio Depressivo Leve",
        ];

        // Validações antes de enviar
        addLog("🔍 Validando dados antes do envio...");
        addLog(`disorders (array): ${JSON.stringify(disorders)}`);
        addLog(`disorders é array? ${Array.isArray(disorders)}`);
        addLog(
          `treatment_objectives.short_term_goals: ${JSON.stringify(
            treatment_objectives.short_term_goals
          )}`
        );

        // Criar FormData
        addLog("📦 Criando FormData...");
        const formData = new FormData();

        // Dados obrigatórios
        const uniqueEmail = `joao.teste.${Date.now()}@email.com`;
        formData.append("name", "João Silva Teste");
        formData.append("email", uniqueEmail);
        formData.append("password", "123456789");
        formData.append("age", "35");
        formData.append("full_name", "João da Silva Santos Teste");
        formData.append("birth_date", "1988-05-15");
        formData.append("patient_of", patient_of_id);

        // Dados opcionais
        formData.append("profession", "Engenheiro de Software");
        formData.append("is_minor", "false");
        formData.append("status", "Ativo");

        // Dados complexos como JSON strings - CORREÇÕES PRINCIPAIS
        formData.append("address", JSON.stringify(address));
        formData.append("contacts", JSON.stringify(contacts));
        formData.append(
          "parents_or_guardians",
          JSON.stringify(parents_or_guardians)
        );
        formData.append("medical_history", JSON.stringify(medical_history));
        formData.append("assessment", JSON.stringify(assessment));
        formData.append(
          "treatment_objectives",
          JSON.stringify(treatment_objectives)
        );
        formData.append("disorders", JSON.stringify(disorders)); // PRINCIPAL CORREÇÃO

        // Verificar se o FormData foi montado corretamente
        addLog("🔍 Verificando FormData montado:");
        for (let [key, value] of formData.entries()) {
          if (
            key === "disorders" ||
            key === "treatment_objectives" ||
            key === "medical_history" ||
            key === "assessment"
          ) {
            addLog(
              `📋 ${key}: ${
                typeof value === "string"
                  ? value.substring(0, 100) + "..."
                  : value
              }`
            );

            // Tentar fazer parse para verificar se é JSON válido
            if (typeof value === "string") {
              try {
                const parsed = JSON.parse(value);
                if (key === "disorders") {
                  addLog(
                    `✅ ${key} parseado com ${
                      Array.isArray(parsed) ? parsed.length : 0
                    } itens: ${JSON.stringify(parsed)}`
                  );
                } else {
                  addLog(`✅ ${key} parseado com sucesso`);
                }
              } catch (e) {
                addLog(`❌ ${key} não é JSON válido: ${e.message}`);
              }
            }
          }
        }

        // Criar avatar de teste
        addLog("🖼️ Gerando avatar de teste...");
        const canvas = document.createElement("canvas");
        canvas.width = 200;
        canvas.height = 200;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          // Criar um avatar mais elaborado
          const gradient = ctx.createLinearGradient(0, 0, 200, 200);
          gradient.addColorStop(0, "#4A90E2");
          gradient.addColorStop(1, "#357ABD");
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, 200, 200);

          // Adicionar texto
          ctx.fillStyle = "white";
          ctx.font = "bold 16px Arial";
          ctx.textAlign = "center";
          ctx.fillText("AVATAR", 100, 90);
          ctx.fillText("TESTE", 100, 110);

          // Adicionar timestamp
          ctx.font = "10px Arial";
          ctx.fillText(new Date().toLocaleTimeString(), 100, 130);
        }

        canvas.toBlob((blob) => {
          if (blob) {
            formData.append("avatar", blob, "avatar-teste.png");
            addLog("✅ Avatar adicionado ao FormData");
          }

          // Log dos dados sendo enviados (resumo)
          addLog("📤 Enviando requisição para /api/customers...");
          addLog(`📧 Email: ${uniqueEmail}`);
          addLog(`👨‍⚕️ Patient of: ${patient_of_id}`);
          addLog(`🏥 Disorders: ${disorders.length} transtornos`);
          addLog(
            `🎯 Treatment goals: ${
              treatment_objectives.short_term_goals.length +
              treatment_objectives.long_term_goals.length
            } objetivos`
          );

          // Fazer a requisição
          fetch("/api/customers", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: formData,
          })
            .then(async (res: Response) => {
              const data = await res.json();

              addLog(`📨 Resposta recebida - Status: ${res.status}`);

              if (res.ok) {
                setResponse(data as CustomerResponse);
                addLog("🎉 Cliente criado com sucesso!");
                addLog(`👤 ID do cliente: ${data.customer._id}`);
                addLog(
                  `🏥 Disorders salvos: ${data.customer.disorders?.length || 0}`
                );
                if (
                  data.customer.disorders &&
                  data.customer.disorders.length > 0
                ) {
                  addLog(
                    `📋 Lista de disorders: ${JSON.stringify(
                      data.customer.disorders
                    )}`
                  );
                }
              } else {
                setError(data as ErrorResponse);
                addLog(`❌ Erro na criação: ${data.error}`);
                if (data.problematic_field) {
                  addLog(`🔍 Campo problemático: ${data.problematic_field}`);
                }
              }
            })
            .catch((err: Error) => {
              setError({ error: "Erro de conexão", details: err.message });
              addLog(`❌ Erro de conexão: ${err.message}`);
            })
            .finally(() => {
              setLoading(false);
              addLog("🏁 Teste finalizado");
            });
        }, "image/png");
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Erro desconhecido";
        setError({ error: "Erro no teste", details: errorMessage });
        setLoading(false);
        addLog(`❌ Erro no teste: ${errorMessage}`);
      }
    };

    testCustomerRegistration();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        🧪 Teste de Registro de Customer/Paciente - Versão Melhorada
      </h1>

      {loading && (
        <div className="flex items-center space-x-2 text-blue-600 mb-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span>Testando registro de customer...</span>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <h3 className="text-red-800 font-semibold mb-2">
            ❌ Erro encontrado:
          </h3>
          <div className="text-red-700">
            <p>
              <strong>Erro:</strong> {error.error}
            </p>
            {error.details && (
              <p>
                <strong>Detalhes:</strong> {error.details}
              </p>
            )}
            {error.problematic_field && (
              <p>
                <strong>Campo problemático:</strong> {error.problematic_field}
              </p>
            )}
            {error.missing_fields && (
              <div className="mt-2">
                <strong>Campos em falta:</strong>
                <pre className="bg-red-100 p-2 rounded mt-1 text-xs">
                  {JSON.stringify(error.missing_fields, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {response && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <h3 className="text-green-800 font-semibold mb-2">✅ Sucesso!</h3>
          <div className="text-green-700 mb-3">
            <p>
              <strong>Mensagem:</strong> {response.message}
            </p>
          </div>

          {response.customer && (
            <div className="bg-white rounded border p-4">
              <h4 className="font-semibold text-gray-800 mb-3">
                📋 Dados do Cliente/Paciente Criado:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p>
                    <strong>ID:</strong> {response.customer._id}
                  </p>
                  <p>
                    <strong>Nome:</strong> {response.customer.name}
                  </p>
                  <p>
                    <strong>Nome Completo:</strong>{" "}
                    {response.customer.full_name}
                  </p>
                  <p>
                    <strong>Email:</strong> {response.customer.email}
                  </p>
                  <p>
                    <strong>Idade:</strong> {response.customer.age}
                  </p>
                  <p>
                    <strong>Data Nascimento:</strong>{" "}
                    {new Date(
                      response.customer.birth_date
                    ).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Profissão:</strong> {response.customer.profession}
                  </p>
                  <p>
                    <strong>Status:</strong> {response.customer.status}
                  </p>
                  <p>
                    <strong>Menor de idade:</strong>{" "}
                    {response.customer.is_minor ? "Sim" : "Não"}
                  </p>
                  <p>
                    <strong>Criado em:</strong>{" "}
                    {new Date(response.customer.createdAt).toLocaleString()}
                  </p>
                  {response.customer.patient_of && (
                    <p>
                      <strong>Profissional:</strong>{" "}
                      {response.customer.patient_of.name}
                    </p>
                  )}
                  {response.customer.avatar && (
                    <p>
                      <strong>Avatar:</strong> ✅ Enviado com sucesso
                    </p>
                  )}
                </div>
              </div>

              {response.customer.avatar && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-2">🖼️ Avatar:</p>
                  <img
                    src={response.customer.avatar.url}
                    alt="Avatar do paciente"
                    className="w-20 h-20 rounded-full border-2 border-gray-300"
                  />
                </div>
              )}

              {response.customer.address && (
                <div className="mt-4">
                  <p className="font-semibold text-gray-800 mb-2">
                    📍 Endereço:
                  </p>
                  <p className="text-sm text-gray-600">
                    {response.customer.address.street},{" "}
                    {response.customer.address.number} -{" "}
                    {response.customer.address.neighborhood}
                    <br />
                    {response.customer.address.city}/
                    {response.customer.address.state} - CEP:{" "}
                    {response.customer.address.zip_code}
                    {response.customer.address.complement && (
                      <span> - {response.customer.address.complement}</span>
                    )}
                  </p>
                </div>
              )}

              {response.customer.disorders &&
                response.customer.disorders.length > 0 && (
                  <div className="mt-4">
                    <p className="font-semibold text-gray-800 mb-2">
                      🏥 Transtornos ({response.customer.disorders.length}):
                    </p>
                    <ul className="text-sm text-gray-600">
                      {response.customer.disorders.map((disorder, index) => (
                        <li key={index} className="flex items-center">
                          <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                          {disorder}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

              {(!response.customer.disorders ||
                response.customer.disorders.length === 0) && (
                <div className="mt-4">
                  <p className="font-semibold text-red-600 mb-2">
                    ⚠️ PROBLEMA: Nenhum transtorno foi salvo!
                  </p>
                  <p className="text-sm text-red-500">
                    Verifique os logs abaixo para identificar o problema no
                    processamento dos arrays.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Logs de Debug */}
      <div className="mt-6 p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-xs">
        <h3 className="font-semibold text-white mb-3 text-sm">
          🔍 Logs de Debug:
        </h3>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {debugLogs.map((log, index) => (
            <div key={index} className="break-all">
              {log}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">
          🔧 Melhorias Implementadas:
        </h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>
            • <strong>Validação de arrays:</strong> Verificação se disorders é
            array antes do envio
          </li>
          <li>
            • <strong>Logs detalhados:</strong> Acompanhe cada etapa do processo
            em tempo real
          </li>
          <li>
            • <strong>Parsing JSON:</strong> Validação se os dados JSON estão
            sendo criados corretamente
          </li>
          <li>
            • <strong>Verificação FormData:</strong> Inspeção dos dados antes do
            envio
          </li>
          <li>
            • <strong>Debug visual:</strong> Interface para ver problemas de
            arrays vazios
          </li>
          <li>
            • <strong>Tratamento de erros:</strong> Identificação específica de
            campos problemáticos
          </li>
        </ul>
      </div>

      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-800 mb-2">
          ℹ️ Informações do Teste:
        </h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Teste automatizado com validações robustas</li>
          <li>• Logs em tempo real para debug</li>
          <li>
            • Verificação específica de arrays (disorders, treatment_objectives)
          </li>
          <li>• Parsing JSON validado antes do envio</li>
          <li>• Identificação visual de problemas</li>
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          <strong>Se os transtornos ainda não aparecerem:</strong>
          <br />• Verifique os logs de debug acima
          <br />• Confirme se o backend foi atualizado com as correções
          <br />• Observe se há erros de parsing JSON nos logs
        </p>
      </div>
    </div>
  );
}
