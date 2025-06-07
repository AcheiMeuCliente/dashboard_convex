import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { StatsCards } from "./StatsCards";
import { CompanyFilters } from "./CompanyFilters";
import { CompanyList } from "./CompanyList";
import { CompanyModal } from "./CompanyModal";
import { toast } from "sonner";

export function BusinessDashboard() {
  const [filters, setFilters] = useState({
    search: "",
    cnae: "",
    estado: "",
    municipio: "",
    porte: "",
    mei: undefined as boolean | undefined,
    simples: undefined as boolean | undefined,
    tem_email: undefined as boolean | undefined,
    tem_telefone: undefined as boolean | undefined,
  });
  const [selectedCompanyId, setSelectedCompanyId] = useState<Id<"companies"> | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 20;

  const stats = useQuery(api.companies.getDashboardStats, {
    cnae: filters.cnae || undefined,
    estado: filters.estado || undefined,
  });
  
  const companiesResult = useQuery(api.companies.listCompanies, {
    paginationOpts: { numItems: pageSize, cursor: null },
    search: filters.search || undefined,
    cnae: filters.cnae || undefined,
    estado: filters.estado || undefined,
    municipio: filters.municipio || undefined,
    porte: filters.porte || undefined,
    mei: filters.mei,
    simples: filters.simples,
    tem_email: filters.tem_email,
    tem_telefone: filters.tem_telefone,
  });

  const cnaes = useQuery(api.companies.getUniqueCnaes);
  const estados = useQuery(api.companies.getUniqueEstados);
  const municipios = useQuery(api.companies.getMunicipiosByEstado, 
    filters.estado ? { estado: filters.estado } : "skip"
  );

  const seedData = useMutation(api.companies.seedExampleData);

  const handleSeedData = async () => {
    try {
      const result = await seedData({});
      toast.success(`${result.total} empresas de exemplo criadas com sucesso!`);
    } catch (error) {
      toast.error("Erro ao criar dados de exemplo");
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setFilters(newFilters);
    setCurrentPage(0);
  };

  if (stats === undefined || companiesResult === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const hasNoData = stats.total === 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Empresarial Brasileiro
          </h1>
          <p className="mt-2 text-gray-600">
            Análise completa de dados empresariais baseados em CNAEs e localização
          </p>
        </div>
        
        {hasNoData && (
          <button
            onClick={handleSeedData}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Carregar Dados de Exemplo
          </button>
        )}
      </div>

      {hasNoData ? (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 text-gray-400">
            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Nenhuma empresa cadastrada
          </h3>
          <p className="mt-2 text-gray-500">
            Comece carregando alguns dados de exemplo para explorar o dashboard.
          </p>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <StatsCards stats={stats} />

          {/* Filters */}
          <CompanyFilters 
            filters={filters} 
            onFiltersChange={handleFilterChange}
            cnaes={cnaes || []}
            estados={estados || []}
            municipios={municipios || []}
          />

          {/* Company List */}
          <CompanyList
            companies={companiesResult.page}
            onCompanySelect={setSelectedCompanyId}
            hasMore={!companiesResult.isDone}
            onLoadMore={() => {
              // Implementar carregamento de mais páginas se necessário
            }}
          />

          {/* Company Modal */}
          {selectedCompanyId && (
            <CompanyModal
              companyId={selectedCompanyId}
              onClose={() => setSelectedCompanyId(null)}
            />
          )}
        </>
      )}
    </div>
  );
}
