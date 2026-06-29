# OrleansTrans 🚌
> Sistema Web para Centralização e Gestão de Informações sobre Transporte Universitário de Orleans / SC.

O **OrleansTrans** é uma plataforma desenvolvida para modernizar a gestão do transporte universitário do município de Orleans. O sistema permite que estudantes consultem rotas, paradas e avisos em tempo real sem depender de terceiros, enquanto os administradores gerenciam a frota, alocação de vagas (capacidade), motoristas e alertas.

---

## 🚀 Tecnologias Utilizadas

### Backend
- **Node.js** com **TypeScript**
- **Express** (Framework Web)
- **PostgreSQL** (Banco de dados relacional)
- **Prisma ORM** (Modelagem e migrações)
- **JWT** (Autenticação segura)
- **Bcrypt** (Criptografia de senhas)
- **Jest** (Testes de integração e unidade)
- **Swagger UI** (Documentação automática de API)

### Frontend
- **React** (Biblioteca de interfaces com Vite)
- **Tailwind CSS** (Estilização premium com tema escuro e efeitos glassmorphic)
- **Leaflet & OpenStreetMap** (Mapas interativos com plotagem de rotas e marcadores)
- **React Router** (Navegação interna SPA)
- **TanStack Query** (React Query - Caching e gerenciamento de estado assíncrono)
- **React Hook Form + Zod** (Criação e validação robusta de formulários)
- **Lucide React** (Pacote de ícones modernos)

---

## 🛠️ Arquitetura do Projeto

O projeto adota uma arquitetura limpa em camadas para garantir escabilidade e facilidade de manutenção:

```text
Prototipo-controle-transporte-universitario/
├── backend/
│   ├── prisma/             # Schema do banco de dados e sementes (seeds)
│   └── src/
│       ├── config/         # Instanciação do prisma e variáveis de ambiente
│       ├── repositories/   # Camada isolada de acesso ao banco (Repository Pattern)
│       ├── services/       # Lógica principal do sistema e regras de negócio
│       ├── middlewares/    # Validação JWT, controle de perfis e erros
│       ├── controllers/    # Interceptação de requisições e respostas HTTP
│       ├── routes/         # Definição e proteção das rotas da API
│       ├── validators/     # Schemas de sanitização e validação de entrada
│       └── tests/          # Cenários de teste automatizados (Jest)
└── frontend/
    └── src/
        ├── components/     # Componentes de interface e OrleansMap
        ├── contexts/       # Estado global de autenticação
        ├── layouts/        # Layout base unificado (Sidebar + Header)
        ├── pages/          # Páginas públicas, administrativas e do estudante
        ├── routes/         # Roteador interno da aplicação
        └── services/       # Conexão HTTP (Axios) com interceptores
```

---

## ⚡ Regras de Negócio Implementadas

- **Lotação Controlada (RN03)**: O sistema impede que mais estudantes sejam alocados em um transporte do que a capacidade do veículo suporta.
- **Autorização Administrador (RN04/RN07)**: Apenas administradores do sistema podem cadastrar, alterar ou excluir rotas, pontos, veículos e motoristas.
- **Mural de Avisos (RN06)**: Permite que administradores publiquem alertas direcionados a veículos específicos (atrasos, cancelamentos), refletidos instantaneamente no portal do estudante.
- **Gratuidade e Valores (RN10)**: Transportes classificados como pagos exigem um valor de mensalidade positivo. Veículos marcados como gratuitos têm o valor limpo automaticamente.

---

## 📦 Como Instalar e Executar Localmente

### Pré-requisitos
- Node.js (v18+)
- PostgreSQL rodando localmente (ou em nuvem)

### 1. Configurando o Banco de Dados (Backend)
1. Acesse a pasta do backend:
   ```bash
   cd backend
   ```
2. Crie um arquivo chamado `.env` baseado no `.env.example` (ou configure a variável `DATABASE_URL` com seu usuário e senha do PostgreSQL):
   ```env
   DATABASE_URL="postgresql://postgres:3636@localhost:5432/orleanstrans?schema=public"
   JWT_SECRET="sua_chave_secreta_jwt"
   PORT=4000
   ```
3. Instale as dependências:
   ```bash
   npm install
   ```
4. Execute as migrações do Prisma para criar as tabelas:
   ```bash
   npx prisma migrate dev
   ```
5. Alimente o banco de dados com os dados de teste (seed):
   ```bash
   npm run seed
   ```
6. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend estará rodando em `http://localhost:4000`. A documentação Swagger pode ser acessada em `http://localhost:4000/api-docs`.*

### 2. Executando o Frontend
1. Abra um novo terminal e acesse a pasta do frontend:
   ```bash
   cd frontend
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Inicie a aplicação web:
   ```bash
   npm run dev
   ```
   *O frontend abrirá em `http://localhost:5173/`.*

---

## 🧪 Rodando os Testes Automatizados

Para executar os cenários de testes que validam as regras de negócio no backend:
```bash
cd backend
npm run test
```

---

## 🔑 Contas para Teste Rápido

Para testar as diferentes visualizações da plataforma no login (`http://localhost:5173/`):

### Painel Administrativo (Gerente de Transporte)
- **E-mail**: `admin@orleans.gov.br`
- **Senha**: `admin123`

### Portal do Estudante (Aluno Alocado com Rota e Mapa)
- **E-mail**: `jose@estudante.com`
- **Senha**: `aluno123`
