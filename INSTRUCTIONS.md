# Biblioteca Musical - Documentação

Este é um projeto Next.js que implementa uma biblioteca musical com gerenciamento de músicas, álbuns, artistas e playlists.

## 🚀 Começando

### Pré-requisitos

- Node.js 18+ instalado
- NPM ou Yarn
- Git

### Instalação

1. Clone o repositório:

```bash
git clone [url-do-repositório]
cd [nome-do-projeto]
```

2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

3. Inicie o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

4. Acesse `http://localhost:3000`

## 🔐 Autenticação

### Login

1. Acesse a página inicial
2. Insira suas credenciais:
   - Usuário
   - Senha
3. Clique em "Entrar"

## 📚 Funcionalidades

### 🎵 Músicas

- Visualização de todas as músicas
- Busca por nome, álbum ou artista
- Ordenação por nome, álbum ou artista
- Detalhes da música com informações do álbum e artista
- Gerenciamento de músicas (CRUD)

### 💿 Álbuns

- Lista completa de álbuns
- Busca por nome, ano ou artista
- Ordenação por nome, ano ou artista
- Visualização detalhada com lista de músicas
- Gerenciamento de álbuns (CRUD)

### 👨‍🎤 Artistas

- Catálogo de artistas
- Busca por nome ou país
- Ordenação por nome ou país
- Perfil do artista com álbuns e músicas
- Gerenciamento de artistas (CRUD)

### 📋 Playlists

- Visualização de todas as playlists, públicas e privadas
- Busca por nome
- Ordenação por nome e quantidade de músicas
- Detalhes da playlist com lista de músicas
- Adição/Remoção de músicas
- Gerenciamento de playlists (CRUD)

## 🔍 Pesquisa Global

O header possui uma barra de pesquisa global que permite:

1. Buscar em todas as entidades simultaneamente
2. Resultados em tempo real
3. Acesso rápido aos detalhes

## 📊 Dashboard

A página inicial apresenta:

- Músicas recentes
- Álbuns recentes
- Artistas recentes
- Playlists recentes
- Estatísticas gerais da biblioteca

## 🎨 Temas e Personalização

O sistema possui:

- Tema escuro por padrão
- Cores personalizadas para cada tipo de conteúdo:
  - Rosa: Músicas
  - Índigo: Álbuns
  - Roxo: Artistas
  - Púrpura: Playlists

## 🛠️ Tecnologias Utilizadas

- Next.js 15
- TypeScript
- Tailwind CSS
- Shadcn/ui
- Lucide Icons
- Sonner (toasts)

## 📱 Responsividade

A interface se adapta a diferentes tamanhos de tela:

- Desktop
- Tablet
- Mobile

## Estrutura do Projeto

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/
│   └── (protected)/
│       ├── albums/
│       ├── artists/
│       ├── playlists/
│       ├── songs/
│       └── layout.tsx
├── assets/
├── components/
│   ├── auth/
│   ├── details/
│   ├── forms/
│   ├── layout/
│   ├── lists/
│   └── ui/
├── contexts/
├── hooks/
├── lib/
├── services/
├── styles/
└── types/
```

## Autor

[GitHub](https://github.com/jorgehenrrique)
