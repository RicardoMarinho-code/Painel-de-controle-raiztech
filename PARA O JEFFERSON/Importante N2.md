# Documentação da Nova Arquitetura da API (Nível 2)

Este documento descreve a reestruturação do backend da aplicação RaizTech. A API foi migrada de JavaScript para **TypeScript** e reorganizada em uma arquitetura em camadas para melhorar a manutenibilidade, escalabilidade e segurança.

O fluxo de dados agora suporta autenticação e múltiplos bancos de dados:
**Frontend (React) → Backend (API Node.js/TypeScript) → [Middleware de Autenticação] → Bancos de Dados (MySQL + MongoDB)**

---

### 1. Estrutura de Arquivos do Backend (`src/server`)

A pasta `src/server` foi completamente reestruturada para seguir um padrão de design mais robusto, separando as responsabilidades em diferentes módulos.

*   **`src/server/index.ts`**:
    *   **O que é?** É o ponto de entrada (entrypoint) da nossa API.
    *   **Responsabilidades:**
        1.  Carregar variáveis de ambiente com `dotenv`.
        2.  Inicializar o servidor Express.
        3.  Aplicar middlewares globais (CORS, `express.json`).
        4.  Conectar-se aos bancos de dados (MySQL e MongoDB).
        5.  Definir e organizar as rotas da API, delegando a lógica para os respectivos arquivos de rotas.
        6.  Iniciar o servidor para escutar as requisições na porta definida.

*   **`src/server/config/db.ts`**:
    *   **O que é?** Módulo central para as conexões com os bancos de dados.
    *   **Como funciona?**
        *   **MySQL:** Cria e exporta um "pool" de conexões usando `mysql2/promise`, que é mais eficiente do que criar uma conexão a cada consulta.
        *   **MongoDB:** Gerencia a conexão com o MongoDB usando a biblioteca `mongoose`. Ele exporta a instância do `mongoose` para ser usada em outras partes da aplicação.

*   **`src/server/routes/`**:
    *   **O que é?** Uma pasta que contém todos os arquivos de rotas da API. Cada arquivo agrupa endpoints relacionados a um recurso específico (ex: `auth.routes.ts`, `history.routes.ts`).
    *   **Exemplo: `history.routes.ts`**:
        *   Define as rotas que começam com `/api/historico`, como `/correlacoes`.
        *   Importa os `controllers` correspondentes para lidar com a lógica de cada rota.
        *   Pode-se adicionar middlewares específicos para estas rotas, como o de verificação de permissão.

*   **`src/server/controllers/`**:
    *   **O que é?** Pasta que contém a lógica de negócio para cada rota.
    *   **Responsabilidades:**
        *   Receber a requisição (`req`) e a resposta (`res`) do Express.
        *   Chamar os `services` para executar operações de negócio ou buscar dados.
        *   Formatar a resposta e enviá-la de volta ao cliente com o status HTTP apropriado.

*   **`src/server/services/`**:
    *   **O que é?** Camada responsável pela lógica de negócio principal e pela comunicação com os bancos de dados.
    *   **Exemplo: `history.service.ts`**:
        *   Contém funções como `getCorrelacoes24h()`.
        *   Esta função busca os dados brutos (do MySQL ou MongoDB), processa-os (agrupa, calcula médias, etc.) e retorna os dados prontos para o `controller`.

*   **`src/server/models/`**:
    *   **O que é?** Define os "schemas" ou modelos de dados, especialmente para o MongoDB.
    *   **Exemplo: `MedicaoLog.model.ts`**:
        *   Usando `mongoose`, define a estrutura de um documento na coleção `medicoes` (campos, tipos, se são obrigatórios, etc.). Isso garante que os dados salvos no MongoDB tenham uma estrutura consistente.

*   **`src/server/middleware/`**:
    *   **O que é?** Contém os middlewares do Express, que são funções executadas entre a requisição e a resposta final.
    *   **Exemplo: `auth.middleware.ts`**:
        *   **`verifyToken`**: Middleware que será colocado nas rotas protegidas. Ele verifica se o `token JWT` enviado no cabeçalho da requisição é válido. Se não for, bloqueia o acesso.
        *   **`checkPermission`**: Middleware que pode verificar se o usuário (identificado pelo token) tem uma permissão específica (ex: `PODE_VER_RELATORIOS_IA`) para acessar um determinado endpoint.

---

### 2. Implementação da Autenticação e Controle de Acesso

A segurança agora é um pilar central da API.

1.  **Rota de Login (`/api/auth/login`)**:
    *   Um novo endpoint foi criado para autenticar os usuários.
    *   Ele recebe `email` e `senha`.
    *   Verifica no banco de dados MySQL se o usuário existe e se a senha está correta (usando `bcrypt` para comparar as hashes).
    *   Se as credenciais estiverem corretas, ele busca as `roles` e `permissoes` do usuário no banco.
    *   Gera um **Token JWT** contendo o ID do usuário e suas permissões.
    *   Retorna este token para o frontend.

2.  **Armazenamento do Token no Frontend**:
    *   O frontend (React) deve armazenar o token JWT recebido (em `localStorage` ou `sessionStorage`).
    *   Para cada requisição a uma rota protegida, o frontend deve enviar o token no cabeçalho `Authorization` (ex: `Authorization: Bearer <token>`).

3.  **Proteção de Rotas no Backend**:
    *   O middleware `verifyToken` é adicionado às rotas que exigem autenticação.
    *   Ele extrai o token do cabeçalho, valida sua assinatura e decodifica os dados (ID do usuário, permissões).
    *   Se o token for válido, a informação do usuário é anexada ao objeto `req` e a requisição prossegue para o controller. Caso contrário, retorna um erro `401 Unauthorized`.

4.  **Controle de Acesso por Permissão**:
    *   O middleware `checkPermission` pode ser usado após o `verifyToken`.
    *   Ele recebe como argumento a permissão necessária para a rota (ex: `checkPermission('PODE_VER_RELATORIOS_IA')`).
    *   Ele verifica se a permissão existe na lista de permissões do usuário (que foi decodificada do token).
    *   Se o usuário não tiver a permissão, a API retorna um erro `403 Forbidden`.

---

### 3. Integração com MongoDB

Para atender ao requisito de usar um banco de dados NoSQL, o MongoDB foi integrado para uma finalidade específica e otimizada.

*   **Caso de Uso:** Armazenamento de dados de medições de sensores (`MedicaoLog`).
    *   **Justificativa:** Sensores geram um volume massivo de dados em série temporal. O MongoDB é ideal para isso, pois sua estrutura baseada em documentos é flexível e ele escala horizontalmente com facilidade, oferecendo alta performance de escrita.
*   **Implementação:**
    *   A rota `/api/historico/correlacoes`, que antes usava uma query complexa no MySQL, foi migrada para buscar os dados do MongoDB.
    *   O `HistoryService` agora utiliza o modelo `MedicaoLog` (criado com `mongoose`) para consultar a coleção `medicoes`.
    *   A lógica de agrupar por hora e calcular as médias agora é feita na aplicação (no service), o que é uma prática comum ao usar NoSQL e alivia a carga do banco de dados.

Essa nova arquitetura torna a API RaizTech mais segura, organizada e preparada para crescer, combinando o melhor dos mundos relacional (MySQL) e NoSQL (MongoDB).

---

### 4. Arquivos Criados na Nova Estrutura (Implementação Inicial)

A implementação inicial da nova arquitetura em TypeScript resultou na criação dos seguintes arquivos:

*   **`src/server/config/db.ts`**: Módulo de configuração que exporta o `pool` de conexões para o MySQL e uma função `connectToMongo` para conectar ao MongoDB via `mongoose`. Este arquivo centraliza a gestão das conexões com os bancos de dados.

*   **`src/server/models/MedicaoLog.model.ts`**: Define o `Schema` e o `Model` do Mongoose para a coleção `medicoes`. Garante que todos os dados de medição de sensores salvos no MongoDB sigam uma estrutura tipada e consistente, conforme planejado para o armazenamento de logs de alto volume.

*(Esta seção será expandida conforme novos arquivos como services, controllers e rotas forem criados.)*

---

---

### 5. Implementação do Endpoint de Autenticação

Para cumprir o requisito de segurança, foi implementado o fluxo de login que gera um token JWT.

*   **Dependências Adicionadas**: `jsonwebtoken` para criar e assinar tokens e `bcryptjs` para comparar senhas de forma segura (hash).

*   **`src/server/services/auth.service.ts`**: Contém a lógica principal de login:
    1.  Busca o usuário no MySQL pelo `email`.
    2.  Usa `bcrypt.compare` para verificar se a senha está correta.
    3.  Executa uma consulta SQL com `JOINs` para buscar todas as `permissoes` associadas aos `roles` do usuário no banco de dados.
    4.  Cria um payload com `userId`, `nome` e a lista de `permissoes`.
    5.  Assina e gera um token JWT com validade de 8 horas, que é retornado ao cliente.

*(Esta seção será expandida com a criação dos controllers e rotas de autenticação.)*

---

---

### 5. Arquivos Criados na Nova Estrutura

A implementação inicial da nova arquitetura em TypeScript resultou na criação dos seguintes arquivos:

*   **`src/server/config/db.ts`**: Módulo de configuração que exporta o `pool` de conexões para o MySQL e uma função `connectToMongo` para conectar ao MongoDB via `mongoose`.

*   **`src/server/models/MedicaoLog.model.ts`**: Define o `Schema` e o `Model` do Mongoose para a coleção `medicoes`. Garante que todos os dados de medição de sensores salvos no MongoDB sigam uma estrutura tipada e consistente.

*   **`src/server/services/history.service.ts`**: Contém a nova lógica de negócio para a rota de correlações. A função `getCorrelacoes24h` agora busca dados do MongoDB, agrupa-os por hora e calcula as médias necessárias, demonstrando a integração com o banco NoSQL.

*   **`src/server/controllers/history.controller.ts`**: Controlador que lida com as requisições para `/api/historico`. Ele chama o `historyService` e retorna a resposta formatada.

*   **`src/server/routes/history.routes.ts`**: Arquivo de rotas do Express que define o endpoint `/correlacoes` e o associa ao seu respectivo controlador.

*   **`src/server/index.ts`**: O novo ponto de entrada da API, agora em TypeScript. Ele inicializa o Express, conecta-se aos bancos de dados e configura as rotas principais da aplicação. O arquivo antigo `index.js` foi substituído por este.

---

### 5. Implementação do Endpoint de Autenticação

Para cumprir o requisito de segurança, foi implementado o fluxo de login que gera um token JWT.

*   **Dependências Adicionadas**: `jsonwebtoken` para criar e assinar tokens e `bcryptjs` para comparar senhas de forma segura (hash).

*   **`src/server/routes/auth.routes.ts`**: Define a rota `POST /api/auth/login`.

*   **`src/server/controllers/auth.controller.ts`**: Recebe `email` e `senha` do corpo da requisição, chama o serviço de autenticação e retorna o token ou um erro.

*   **`src/server/services/auth.service.ts`**: Contém a lógica principal:
    1.  Busca o usuário no MySQL pelo `email`.
    2.  Usa `bcrypt.compare` para verificar se a senha está correta.
    3.  Busca todas as `permissoes` associadas aos `roles` do usuário no banco de dados.
    4.  Cria um payload com `userId`, `nome` e a lista de `permissoes`.
    5.  Assina e gera um token JWT com validade de 8 horas, que é retornado ao cliente.

---

### 6. Proteção de Rotas com Middleware JWT

Com o login pronto, o próximo passo foi criar o mecanismo para proteger as rotas da API.

*   **`src/server/types/express.d.ts`**: Foi criado um arquivo de definição de tipos para estender a interface `Request` do Express. Isso adiciona a propriedade `req.user`, permitindo que o TypeScript entenda que, após a validação, teremos os dados do usuário disponíveis na requisição de forma segura.

*   **`src/server/middleware/auth.middleware.ts`**: Este arquivo contém o middleware `verifyToken`. Sua função é:
    1.  Extrair o token do cabeçalho `Authorization: Bearer <token>`.
    2.  Verificar a assinatura e a validade do token usando o `JWT_SECRET`.
    3.  Se o token for válido, ele decodifica o payload (dados do usuário) e o anexa a `req.user`.
    4.  Se o token for inválido, ausente ou expirado, ele retorna um erro (`401 Unauthorized` ou `403 Forbidden`), bloqueando o acesso à rota.

*   **Aplicação na Rota**: O middleware `verifyToken` foi adicionado à rota `/api/historico/correlacoes`. Agora, para acessar este endpoint, o frontend **obrigatoriamente** precisa enviar um token JWT válido no cabeçalho da requisição.

---

### 7. Autorização Baseada em Permissões

Para finalizar a implementação de segurança, foi criado um middleware de autorização que verifica as permissões do usuário.

*   **`src/server/middleware/auth.middleware.ts`**: Foi adicionada a função `checkPermission(requiredPermission)`.
    1.  Ela é um "higher-order function", ou seja, uma função que retorna outra função (o middleware em si). Isso permite que passemos a permissão necessária como um argumento.
    2.  Ela verifica se o array `permissoes` (que está em `req.user` após a validação do token) inclui a `requiredPermission`.
    3.  Se o usuário não tiver a permissão, a API retorna um erro `403 Forbidden`.

*   **Aplicação na Rota**: A rota `/api/historico/correlacoes` agora usa uma cadeia de middlewares: primeiro `verifyToken` para autenticar, e depois `checkPermission('PODE_VER_RELATORIOS_IA')` para autorizar. Isso garante que apenas usuários logados e com a permissão correta possam acessar os dados.

---

### 8. Como Executar a Nova Arquitetura

Com a migração para TypeScript e a introdução de um servidor de API dedicado, o processo de execução em ambiente de desenvolvimento agora envolve dois passos principais.

1.  **Configuração do Ambiente (`.env`)**
    É mandatório criar um arquivo `.env` na raiz do projeto. Este arquivo deve conter as credenciais para ambos os bancos de dados e a chave secreta para o JWT.

    ```env
    # Credenciais do MySQL para o pool de conexões
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASSWORD=sua_senha_mysql
    DB_DATABASE=AgroTech
    
    # String de conexão do MongoDB para o Mongoose
    MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
    
    # Chave para JWT
    JWT_SECRET=sua_chave_secreta_super_segura
    ```

2.  **Executando os Servidores**
    Abra dois terminais na raiz do projeto.

    *   **Terminal 1: Backend (API)**
        Execute o comando abaixo para iniciar o servidor Node.js com `ts-node`, que compila e executa o código TypeScript em tempo real. Este servidor é responsável por toda a lógica de negócio e comunicação com os bancos.
        ```bash
        npm run server:dev
        ```

    *   **Terminal 2: Frontend (React + Vite)**
        Execute o comando padrão para iniciar o servidor de desenvolvimento do frontend, que serve a interface do usuário.
        ```bash
        npm run dev
        ```