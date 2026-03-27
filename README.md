# 🚀 TaskSystem - Gerenciamento Colaborativo de Tarefas

O **TaskSystem** é uma plataforma SaaS Full Stack projetada para organizar fluxos de trabalho colaborativos. Mais do que um simples To-Do List, o sistema oferece um ambiente onde usuários podem construir redes de amigos, delegar tarefas com controle de permissões e acompanhar a produtividade através de métricas automatizadas em tempo real.

🔗 **Acesse o projeto online:** [tasksystem-web.vercel.app](https://tasksystem-web.vercel.app)

---

## 📸 Screenshots

<div align="center">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/1.png" alt="Home Page" width="400">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/2.png" alt="Kanban Board" width="400">
  <br>
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/3.png" alt="Dashboard Métricas" width="400">
  <img src="https://github.com/LacerdaJunior/tasksystem-fullstack/blob/main/frontend/src/assets/readme/4ok.png" alt="Edit Modal" width="400">
</div>

---

## ✨ Funcionalidades de Alto Nível

### 🛡️ Controle de Acesso e Permissões (RBAC)
O sistema implementa uma regra de negócio rigorosa: apenas o **Dono** da tarefa pode editar título, descrição e reatribuir o responsável. O **Convidado** possui visão privilegiada de execução, podendo interagir apenas com o checklist de progresso.

### 👤 Gestão de Identidade
- Fluxo de autenticação completo com **JWT** e criptografia **Bcrypt**.
- Identidade única através de sistema de **@username** exclusivo.
- Personalização de perfis com avatares dinâmicos.

### 🤝 Networking e Colaboração
- Sistema de amizades com envio e aceite de convites.
- Delegação dinâmica de tarefas para membros da sua rede.

### 📊 Dashboard e UX
- Quadro Kanban interativo para gestão de status.
- Gráficos de produtividade baseados no status global das tarefas e progresso dos checklists.
- Interface 100% responsiva otimizada para Desktop e Mobile.

---

## 🛠️ Stack Tecnológica

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | React.js, Vite, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend** | Node.js, Express, PostgreSQL |
| **Infra** | Neon DB (Database), Vercel (Frontend), Render (API) |
| **Segurança** | JSON Web Tokens (JWT), Bcrypt, Middlewares de Autenticação |

---

🚀 Como executar o projeto localmente
Pré-requisitos
Node.js instalado (versão 18 ou superior)

Uma instância de PostgreSQL (ou conta no Neon.tech)

Passo a Passo
Clone o repositório:

Bash
git clone https://github.com/LacerdaJunior/Login-system-with-nodejs-express-react.git
cd Login-system-with-nodejs-express-react
Configure o Backend:

Bash
# Entre na pasta e instale as dependências
cd backend
npm install

# Crie um arquivo .env na raiz da pasta /backend com:
# DATABASE_URL="sua_url_do_neon"
# PORT=4949
# JWT_SECRET="sua_chave_secreta"

# Inicie o servidor
npm run dev
Configure o Frontend:

Bash
# Em um novo terminal, entre na pasta frontend
cd frontend
npm install

# Crie um arquivo .env.local na raiz da pasta /frontend com:
# VITE_API_URL=http://localhost:4949

# Inicie a aplicação
npm run dev
🗺️ Roadmap de Evolução (V2.0)
[ ] WebSockets: Implementação de Socket.io para atualizações em tempo real.

[ ] Docker: Containerização completa do ambiente.

[ ] Testes: Cobertura de testes unitários com Jest e E2E com Cypress.

Desenvolvido com foco em Engenharia de Software por Guilherme Lacerda.
