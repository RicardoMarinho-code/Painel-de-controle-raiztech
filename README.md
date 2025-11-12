# Painel de Controle RaizTech

## Visão Geral do Projeto

Este é o Painel de Controle para a RaizTech, um sistema de gestão agrícola inteligente focado em otimizar a irrigação com o uso de Inteligência Artificial e Machine Learning. O painel oferece uma interface completa para monitorar, analisar e controlar o desempenho dos irrigadores e sensores na fazenda.

### Principais funcionalidades

- **Dashboard**: Visão geral do status da fazenda, irrigadores, eficiência hídrica e dados de IA.
- **Análises de IA/ML**: Relatórios detalhados sobre padrões de aprendizado, economia de água, precisão de decisões e correlações ambientais.
- **Monitoramento de Áreas e Sensores**: Visualização de zonas de irrigação, estado dos sensores de umidade, temperatura, pH, etc.
- **Configurações Avançadas**: Painel para ajustar os parâmetros de aprendizado de máquina, algoritmos e regras de decisão da IA.
- **Autenticação**: Sistema de login e registro para acesso seguro ao painel.

## Instalação e Execução

Para iniciar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

Certifique-se de ter o [Node.js](https://nodejs.org/) (versão 18 ou superior) e o [npm](https://www.npmjs.com/) instalados.

### Passos

1.  **Clone o repositório**

2.  **Instale as dependências**
    Na raiz do projeto, execute:
    ```bash
    npm install
    ```

3.  **Configure as Variáveis de Ambiente**
    Crie um arquivo chamado `.env` na raiz do projeto. Ele guardará as credenciais de acesso aos bancos de dados. Copie o conteúdo abaixo e substitua pelos seus dados.

    ```env
    # Variáveis do Banco de Dados MySQL
    DB_HOST=localhost
    DB_USER=seu_usuario_mysql
    DB_PASSWORD=sua_senha_mysql
    DB_DATABASE=AgroTech
    
    # Variável do Banco de Dados MongoDB
    MONGO_URI="mongodb+srv://<user>:<password>@<cluster-url>/<database-name>?retryWrites=true&w=majority"
    
    # Chave secreta para assinar os tokens JWT
    JWT_SECRET=sua_chave_secreta_super_segura
    ```

4.  **Execute a Aplicação**
    O projeto é dividido em duas partes que precisam ser executadas em terminais separados:

    *   **Backend (API em TypeScript)**
        Este comando inicia o servidor da API, que se conectará aos bancos de dados (MySQL e MongoDB).
        ```bash
        npm run server:dev
        ```
        A API estará disponível em `http://localhost:3001`.

    *   **Frontend (Painel de Controle em React)**
        Este comando inicia o servidor de desenvolvimento do Vite para a interface do usuário.
        ```bash
        npm run dev
        ```
        O painel estará disponível em `http://localhost:8080`.

## Scripts Adicionais

No arquivo `package.json`, você pode encontrar os seguintes scripts para rodar:

- `build`: Compila o projeto para produção.
- `build:dev`: Compila o projeto em modo de desenvolvimento.
- `lint`: Executa o linter para verificar erros de código.
- `preview`: Inicia um servidor local para visualizar a build de produção