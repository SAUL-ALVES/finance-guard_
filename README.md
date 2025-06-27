# 🛡️ Finance Guard

Sistema web para **gestão financeira pessoal**, com recursos de:

✅ Cadastro de receitas e despesas  
✅ Relatórios e gráficos interativos  
✅ Metas orçamentárias  
✅ Autenticação de usuários  

---

## 📂 Estrutura do Projeto

```
finance-guard/
├── firebase/          # Cloud Functions e configs Firebase
├── src/               # Código-fonte Next.js
├── backend/           # Scripts e lógicas adicionais de backend
├── docs/              # Documentação do projeto
├── .firebaserc
├── firebase.json
├── next.config.ts
├── tailwind.config.ts
└── package.json
```

---

## ⚙️ Instalação e Execução Local

### Pré-requisitos:

- Node.js v18+
- NPM ou Yarn
- Conta no Firebase + Projeto criado
- **Firebase CLI** instalado globalmente:

```bash
npm install -g firebase-tools
```

---

### 1. Clone o Projeto:

```bash
git clone https://github.com/SAUL-ALVES/finance-guard_.git
cd finance-guard
```

---

### 2. Instale as Dependências:

```bash
npm install
```

---

### 3. Rodando o Front-end (Next.js):

```bash
npm run dev
```

> A aplicação estará disponível localmente em: [http://localhost:9002](http://localhost:9002)

---

## 📝 Tecnologias Principais

- Next.js + TypeScript  
- Tailwind CSS  
- Firebase (Auth, Firestore, Hosting, Functions)  
- React Query, Zod, Radix UI, Recharts  
- Genkit AI (Google AI API)

---

## ✅ Funcionalidades Futuras

- Exportação de relatórios (CSV/PDF)  
- Notificações por e-mail  
- Modo offline com sincronização
