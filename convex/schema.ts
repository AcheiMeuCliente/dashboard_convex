import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

const applicationTables = {
  // Tabela principal de empresas baseada na estrutura CSV
  companies: defineTable({
    // Identificação
    cnpj: v.string(),
    cnae_principal_codigo: v.string(),
    cnae_principal_nome: v.string(),
    cnae_secundario_codigo: v.optional(v.string()),
    cnae_secundario_nome: v.optional(v.string()),
    razao_social: v.string(),
    nome_fantasia: v.optional(v.string()),
    
    // Contatos
    telefone_1: v.optional(v.string()),
    telefone_2: v.optional(v.string()),
    telefone_3: v.optional(v.string()),
    email: v.optional(v.string()),
    
    // Localização
    bairro: v.optional(v.string()),
    cep: v.optional(v.string()),
    municipio: v.string(),
    estado: v.string(),
    endereco_mapa: v.optional(v.string()),
    maps: v.optional(v.string()),
    
    // Características empresariais
    matriz_filial: v.optional(v.string()),
    porte: v.optional(v.string()),
    capital_social: v.optional(v.number()),
    mei: v.boolean(),
    simples: v.boolean(),
    inicio_atividade: v.optional(v.string()),
    receita_federal: v.optional(v.string()),
    natureza_juridica: v.optional(v.string()),
    
    // Contatos adicionais
    email_contabilidade: v.optional(v.string()),
    tem_email: v.boolean(),
    tem_telefone: v.boolean(),
    whatsapp_1: v.optional(v.string()),
    whatsapp_2: v.optional(v.string()),
    whatsapp_3: v.optional(v.string()),
    dominio_corporativo: v.optional(v.string()),
    site: v.optional(v.string()),
    
    // Metadados
    importado_em: v.optional(v.number()),
    atualizado_em: v.optional(v.number()),
  })
    .index("by_cnpj", ["cnpj"])
    .index("by_razao_social", ["razao_social"])
    .index("by_cnae_principal", ["cnae_principal_codigo"])
    .index("by_municipio", ["municipio"])
    .index("by_estado", ["estado"])
    .index("by_porte", ["porte"])
    .index("by_cnae_estado", ["cnae_principal_codigo", "estado"])
    .index("by_mei", ["mei"])
    .index("by_simples", ["simples"])
    .index("by_tem_email", ["tem_email"])
    .index("by_tem_telefone", ["tem_telefone"])
    .searchIndex("search_companies", {
      searchField: "razao_social",
      filterFields: ["estado", "porte", "cnae_principal_codigo", "municipio"],
    }),

  // Metadados dos CNAEs
  cnae_metadata: defineTable({
    codigo: v.string(),
    nome: v.string(),
    ativo: v.boolean(),
    total_empresas: v.optional(v.number()),
  }).index("by_codigo", ["codigo"]),

  // Estados e estatísticas
  estados: defineTable({
    codigo: v.string(),
    nome: v.string(),
    regiao: v.string(),
    total_empresas: v.optional(v.number()),
  }).index("by_codigo", ["codigo"]),
};

export default defineSchema({
  ...authTables,
  ...applicationTables,
});
