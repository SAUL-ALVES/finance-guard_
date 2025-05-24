# **App Name**: FinanceGuard - Sistema de Gestão Financeira Pessoal

## Core Features:

- Cadastro de Despesas/Receitas: Cadastro de Despesas/Receitas com React Hook Form + Zod (validação) no frontend e Spring Boot (Java 17) + Bean Validation no backend.
- Listagem de Transações: Listagem de Transações com TanStack Table v8 (ordenação/paginação) no frontend e Spring Data JPA + QueryDSL no backend.
- Filtros Avançados: Filtros Avançados com Material UI DateRangePicker no frontend e Specification Pattern no backend.
- Visualização de Dados: Visualização de Dados com Victory.js (alternativa leve ao Recharts) para gráficos e JPQL com GROUP BY para Aggregations no backend.
- Sugestão Automática de Categorias: Sugestão Automática de Categorias com NLP Básico (Fuse.js - fuzzy matching) no frontend e Cache com Caffeine no backend. Uses a tool to reason when to suggest.

## Style Guidelines:

- Primary color: #5D9C59
- Danger color: #E74C3C
- Warning color: #FFA41B
- Main font: 'Inter', sans-serif
- Mono font: 'Roboto Mono', monospace
- Ícones SVG customizados por categoria (e.g., FaShoppingCart para ALIMENTACAO, FaCar para TRANSPORTE).