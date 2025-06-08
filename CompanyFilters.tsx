import { useState, useEffect } from "react";

interface CompanyFiltersProps {
  filters: {
    search: string;
    cnae: string;
    estado: string;
    municipio: string;
    porte: string;
    mei: boolean | undefined;
    simples: boolean | undefined;
    tem_email: boolean | undefined;
    tem_telefone: boolean | undefined;
  };
  onFiltersChange: (filters: any) => void;
  cnaes: Array<{ codigo: string; nome: string; total: number }>;
  estados: Array<{ codigo: string; total: number }>;
  municipios: Array<{ nome: string; total: number }>;
}

const PORTES = [
  "MEI",
  "MICRO EMPRESA", 
  "PEQUENA EMPRESA",
  "MÉDIA EMPRESA",
  "GRANDE EMPRESA"
];

export function CompanyFilters({ 
  filters, 
  onFiltersChange, 
  cnaes, 
  estados, 
  municipios 
}: CompanyFiltersProps) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => {
      onFiltersChange(localFilters);
    }, 300);

    return () => clearTimeout(timer);
  }, [localFilters, onFiltersChange]);

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setLocalFilters(prev => ({ 
      ...prev, 
      [key]: value,
      // Limpar município quando estado muda
      ...(key === 'estado' ? { municipio: '' } : {})
    }));
  };

  const clearFilters = () => {
    const clearedFilters = { 
      search: "", 
      cnae: "", 
      estado: "", 
      municipio: "",
      porte: "", 
      mei: undefined,
      simples: undefined,
      tem_email: undefined,
      tem_telefone: undefined,
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(localFilters).some(value => 
    value !== "" && value !== undefined
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h3 className="text-lg font-medium text-gray-900">Filtros Avançados</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="mt-2 sm:mt-0 text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpar todos os filtros
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Busca */}
        <div className="lg:col-span-2">
          <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
            Buscar empresa
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              id="search"
              placeholder="Razão social, CNPJ ou nome fantasia..."
              value={localFilters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>
        </div>

        {/* CNAE */}
        <div>
          <label htmlFor="cnae" className="block text-sm font-medium text-gray-700 mb-1">
            CNAE Principal
          </label>
          <select
            id="cnae"
            value={localFilters.cnae}
            onChange={(e) => handleFilterChange("cnae", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos os CNAEs</option>
            {cnaes.map(cnae => (
              <option key={cnae.codigo} value={cnae.codigo}>
                {cnae.codigo} ({cnae.total})
              </option>
            ))}
          </select>
        </div>

        {/* Estado */}
        <div>
          <label htmlFor="estado" className="block text-sm font-medium text-gray-700 mb-1">
            Estado
          </label>
          <select
            id="estado"
            value={localFilters.estado}
            onChange={(e) => handleFilterChange("estado", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos os estados</option>
            {estados.map(estado => (
              <option key={estado.codigo} value={estado.codigo}>
                {estado.codigo} ({estado.total})
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Município */}
        <div>
          <label htmlFor="municipio" className="block text-sm font-medium text-gray-700 mb-1">
            Município
          </label>
          <select
            id="municipio"
            value={localFilters.municipio}
            onChange={(e) => handleFilterChange("municipio", e.target.value)}
            disabled={!localFilters.estado}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm disabled:bg-gray-100"
          >
            <option value="">Todos os municípios</option>
            {municipios.map(municipio => (
              <option key={municipio.nome} value={municipio.nome}>
                {municipio.nome} ({municipio.total})
              </option>
            ))}
          </select>
        </div>

        {/* Porte */}
        <div>
          <label htmlFor="porte" className="block text-sm font-medium text-gray-700 mb-1">
            Porte
          </label>
          <select
            id="porte"
            value={localFilters.porte}
            onChange={(e) => handleFilterChange("porte", e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos os portes</option>
            {PORTES.map(porte => (
              <option key={porte} value={porte}>{porte}</option>
            ))}
          </select>
        </div>

        {/* MEI */}
        <div>
          <label htmlFor="mei" className="block text-sm font-medium text-gray-700 mb-1">
            MEI
          </label>
          <select
            id="mei"
            value={localFilters.mei === undefined ? "" : localFilters.mei.toString()}
            onChange={(e) => handleFilterChange("mei", e.target.value === "" ? undefined : e.target.value === "true")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Apenas MEI</option>
            <option value="false">Não MEI</option>
          </select>
        </div>

        {/* Simples */}
        <div>
          <label htmlFor="simples" className="block text-sm font-medium text-gray-700 mb-1">
            Simples Nacional
          </label>
          <select
            id="simples"
            value={localFilters.simples === undefined ? "" : localFilters.simples.toString()}
            onChange={(e) => handleFilterChange("simples", e.target.value === "" ? undefined : e.target.value === "true")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Simples Nacional</option>
            <option value="false">Não Simples</option>
          </select>
        </div>

        {/* Tem Email */}
        <div>
          <label htmlFor="tem_email" className="block text-sm font-medium text-gray-700 mb-1">
            Com Email
          </label>
          <select
            id="tem_email"
            value={localFilters.tem_email === undefined ? "" : localFilters.tem_email.toString()}
            onChange={(e) => handleFilterChange("tem_email", e.target.value === "" ? undefined : e.target.value === "true")}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
          >
            <option value="">Todos</option>
            <option value="true">Com Email</option>
            <option value="false">Sem Email</option>
          </select>
        </div>
      </div>

      {/* Filtros ativos */}
      {hasActiveFilters && (
        <div className="mt-4 flex flex-wrap gap-2">
          {localFilters.search && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Busca: {localFilters.search}
              <button
                onClick={() => handleFilterChange("search", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.cnae && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              CNAE: {localFilters.cnae}
              <button
                onClick={() => handleFilterChange("cnae", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-green-400 hover:bg-green-200 hover:text-green-600"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.estado && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
              Estado: {localFilters.estado}
              <button
                onClick={() => handleFilterChange("estado", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-purple-400 hover:bg-purple-200 hover:text-purple-600"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.municipio && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Município: {localFilters.municipio}
              <button
                onClick={() => handleFilterChange("municipio", "")}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-yellow-400 hover:bg-yellow-200 hover:text-yellow-600"
              >
                ×
              </button>
            </span>
          )}
          {localFilters.mei !== undefined && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
              MEI: {localFilters.mei ? "Sim" : "Não"}
              <button
                onClick={() => handleFilterChange("mei", undefined)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full text-indigo-400 hover:bg-indigo-200 hover:text-indigo-600"
              >
                ×
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
