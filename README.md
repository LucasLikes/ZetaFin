# Ζ ZetaFin

> Controle financeiro pessoal inteligente — dark, rápido e direto ao ponto.

ZetaFin é uma aplicação web de finanças pessoais construída com React + TypeScript + Firebase. O objetivo é simples: ter uma visão clara do dinheiro — saldo, gastos, dívidas e metas — em um único lugar, sem burocracia.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Frontend | React 19 + TypeScript 6 + Vite 8 |
| Estilização | Tailwind CSS 3 |
| Roteamento | React Router v7 |
| Backend / Auth | Firebase Authentication |
| Banco de dados | Cloud Firestore |
| Deploy | Firebase Hosting |

---

## Funcionalidades planejadas

- [x] Tela de login (email/senha e Google)
- [x] Autenticação protegida com rotas privadas
- [ ] Dashboard com saldo atual e projetado
- [ ] Alerta inteligente de gastos
- [ ] Limite de gasto diário calculado automaticamente
- [ ] Histórico de transações com filtros
- [ ] Cadastro de receitas e despesas
- [ ] Metas financeiras com progresso visual
- [ ] Controle de dívidas
- [ ] Configurações de perfil e salário

---

## Pré-requisitos

- Node.js 20+
- npm 10+
- Conta no [Firebase](https://console.firebase.google.com) (gratuita)

---

## Configuração do Firebase

### 1. Criar o projeto

1. Acesse [console.firebase.google.com](https://console.firebase.google.com)
2. Clique em **Adicionar projeto**
3. Dê um nome (ex: `zetafin`) e siga os passos
4. Desative o Google Analytics se quiser (não é necessário)

### 2. Ativar Authentication

1. No menu lateral: **Build → Authentication**
2. Clique em **Começar**
3. Ative os provedores:
   - **E-mail/senha** → Ativar
   - **Google** → Ativar (configure o e-mail de suporte)

### 3. Criar o Firestore

1. No menu lateral: **Build → Firestore Database**
2. Clique em **Criar banco de dados**
3. Escolha **Modo de produção** (as regras serão configuradas abaixo)
4. Selecione a região mais próxima (ex: `southamerica-east1`)

### 4. Regras do Firestore

No console do Firestore, vá em **Regras** e cole:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

Isso garante que cada usuário só acessa os próprios dados.

### 5. Obter as credenciais

1. No menu lateral: **Configurações do projeto** (ícone de engrenagem)
2. Role até **Seus aplicativos** → clique em `</>`  (Web)
3. Registre o app com um apelido (ex: `zetafin-web`)
4. Copie o objeto `firebaseConfig`

---

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/zetafin.git
cd zetafin

# Instale as dependências
npm install

# Instale o SDK do Firebase
npm install firebase
```

### Variáveis de ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=zetafin.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=zetafin
VITE_FIREBASE_STORAGE_BUCKET=zetafin.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

> O arquivo `.env` já está no `.gitignore`. Nunca suba suas chaves para o repositório.

### Inicializar o Firebase no projeto

Crie o arquivo `src/lib/firebase.ts`:

```ts
import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

export const app      = initializeApp(firebaseConfig)
export const auth     = getAuth(app)
export const db       = getFirestore(app)
export const googleProvider = new GoogleAuthProvider()
```

---

## Rodando localmente

```bash
npm run dev
```

Acesse [http://localhost:5173](http://localhost:5173)

---

## Scripts disponíveis

| Comando | Descrição |
|---|---|
| `npm run dev` | Servidor de desenvolvimento com HMR |
| `npm run build` | Build de produção |
| `npm run preview` | Preview do build localmente |
| `npm run lint` | Lint com ESLint |

---

## Estrutura do projeto

```
src/
├── app/
│   ├── providers/
│   │   ├── AuthProvider.tsx      # Contexto global de autenticação
│   │   └── ProtectedRoute.tsx    # Guarda de rotas privadas
│   └── components/
│       └── ErrorBoundary.tsx
│
├── domains/
│   ├── auth/
│   │   ├── pages/
│   │   │   └── LoginPage.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── services/
│   │   │   └── auth.service.ts   # → substituir por Firebase Auth
│   │   ├── components/
│   │   └── types/
│   │
│   ├── finance/
│   │   ├── pages/
│   │   │   └── DashboardPage.tsx
│   │   ├── hooks/
│   │   │   └── useTransactions.ts
│   │   ├── services/
│   │   │   └── finance.service.ts # → Firestore
│   │   └── components/
│   │       ├── BalanceCard.tsx
│   │       └── TransactionList.tsx
│   │
│   ├── debts/
│   │   └── ...
│   │
│   └── goals/
│       └── ...
│
├── lib/
│   └── firebase.ts               # Configuração Firebase
│
├── App.tsx
├── main.tsx
└── index.css
```

---

## Estrutura de dados no Firestore

Todos os documentos ficam sob `users/{uid}/` para garantir isolamento por usuário.

```
users/
  {uid}/
    profile/
      settings          → { salary, currency, monthlyBudget }

    transactions/
      {transactionId}   → { amount, category, description, date, type: 'income'|'expense' }

    goals/
      {goalId}          → { title, targetAmount, currentAmount, deadline }

    debts/
      {debtId}          → { creditor, totalAmount, paidAmount, dueDate, interestRate }
```

---

## Migração: mock → Firebase

O projeto foi iniciado com serviços mockados para desenvolvimento rápido. Para conectar ao Firebase real, substitua os arquivos de serviço:

**`auth.service.ts`** — trocar por:
```ts
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../../../lib/firebase'

export const authService = {
  login: (email: string, password: string) =>
    signInWithEmailAndPassword(auth, email, password),

  loginWithGoogle: () =>
    signInWithPopup(auth, googleProvider),

  logout: () => auth.signOut(),
}
```

**`useAuth.ts`** — trocar `useState` por `onAuthStateChanged`:
```ts
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../lib/firebase'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])

  return { user, isLoading, isAuthenticated: !!user }
}
```

---

## Deploy no Firebase Hosting

```bash
# Instale a CLI do Firebase
npm install -g firebase-tools

# Login
firebase login

# Inicialize o hosting (selecione o projeto criado)
firebase init hosting
# → Public directory: dist
# → Single-page app: Yes
# → GitHub deploys: No (por enquanto)

# Build + deploy
npm run build
firebase deploy
```

Sua app estará disponível em `https://zetafin.web.app` (ou o domínio do seu projeto).

---

## Segurança

- Autenticação obrigatória para todas as rotas exceto `/login`
- Regras do Firestore bloqueiam acesso entre usuários diferentes
- Variáveis de ambiente nunca são expostas no repositório
- As chaves do Firebase são públicas por design (a segurança vem das regras do Firestore e Authentication, não da obscuridade das chaves)

---

## Licença

Uso pessoal. Não destinado a distribuição ou uso comercial.