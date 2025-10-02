# Painel de Controle RaizTech

Este é o Painel de Controle para a RaizTech, um sistema de gestão agrícola inteligente focado em otimizar a irrigação com o uso de Inteligência Artificial e Machine Learning. O painel oferece uma interface completa para monitorar, analisar e controlar o desempenho dos irrigadores e sensores na fazenda.

## Principais funcionalidades

- **Dashboard**: Visão geral do status da fazenda, irrigadores, eficiência hídrica e dados de IA.
- **Análises de IA/ML**: Relatórios sobre padrões de aprendizado, economia de água e precisão de decisões.
- **Monitoramento de Sensores**: Visualização de zonas de irrigação e estado dos sensores (umidade, temperatura, pH, etc.).
- **Configurações Avançadas**: Painel para ajustar os parâmetros de aprendizado de máquina, algoritmos e regras de decisão da IA.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, TailwindCSS, Shadcn/ui, Recharts
- **Backend**: Python, Flask
- **Banco de Dados**: MySQL

---

## Instalação e Execução

Para iniciar o projeto em seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em sua máquina:

- **MySQL Server**: O servidor de banco de dados.
- **Python 3.11+**: Para o backend.
- **Node.js e npm**: Para o frontend.

### Passo 1: Configuração do Banco de Dados (MySQL)

1.  **Instale o MySQL Server (se necessário)**:
    Em ambientes de desenvolvimento como GitHub Codespaces, o MySQL pode não vir instalado.

    ```bash
    sudo apt-get update
    sudo apt-get install -y mysql-server
    ```

2.  **Inicie o Serviço do MySQL (se necessário)**:
    **Importante**: Este comando precisa ser executado toda vez que você iniciar o ambiente.

    ```bash
    # O instalador geralmente inicia o serviço, mas se você reiniciar o ambiente, use este comando:
    sudo service mysql start
    ```

3.  **Crie e Popule o Banco de Dados**:
    Agora, com o servidor rodando, execute os scripts para configurar o banco. Após uma nova instalação, o usuário `root` do MySQL pode não ter senha, então apenas pressione Enter se for solicitado.

    ```bash
    # Cria a estrutura do banco
    sudo mysql < Banco_SQL.sql
    # Popula com dados de exemplo
    sudo mysql AgroTech < backend/raiztech_api/dados_exemplo.sql
    ```

### Passo 2: Configuração do Backend (Python/Flask)

1. **Navegue até a pasta do backend**:

    ```bash
    cd backend/raiztech_api
    ```

2. **Crie e ative um ambiente virtual**:

    ```bash
    # Criar o ambiente
    python3 -m venv venv

    # Ativar no Windows (PowerShell)
    .\venv\Scripts\activate

    # Ativar no Linux/macOS
    source venv/bin/activate
    ```

3. **Instale as dependências Python**:

    ```bash
    pip install -r requirements.txt
    ```

4. **Configure as variáveis de ambiente**:
    Crie uma cópia do arquivo de exemplo `.env.example` e renomeie para `.env`.

    ```bash
    # No Windows
    copy .env.example .env

    # No Linux/macOS
    cp .env.example .env
    ```

    Abra o arquivo `.env` e **substitua `sua_senha_secreta_do_mysql`** pela sua senha real do MySQL (ou deixe em branco se não houver senha).

    ```env
    MYSQL_HOST=localhost
    MYSQL_DATABASE=AgroTech
    MYSQL_USER=root
    MYSQL_PASSWORD=sua_senha_secreta_do_mysql
    MYSQL_PORT=3306
    ```

5. **Execute o servidor backend**:
    Mantenha este terminal aberto.

    ```bash
    python3 src/main.py
    ```

    O backend estará rodando em `http://localhost:5000`.

### Passo 3: Configuração do Frontend (React/Vite)

1. **Abra um novo terminal** e navegue até a pasta raiz do projeto (`/workspaces/Painel-de-controle-raiztech/Painel-de-controle-raiztech-main`).

2. **Instale as dependências do Node.js**:

    ```bash
    npm install
    ```

3.  **Configure as variáveis de ambiente do Frontend**:
    Crie um arquivo chamado `.env` na raiz do projeto (ao lado de `package.json`) e adicione a seguinte linha. Isso dirá ao frontend onde encontrar a API do backend.

    ```env
    VITE_API_BASE_URL=http://localhost:5000/api
    ```

4. **Execute o servidor de desenvolvimento**:
    Mantenha este terminal aberto também.

    ```bash
    npm run dev
    ```

    O frontend estará disponível em **`http://localhost:8080`**. Abra este endereço no seu navegador para ver o painel.

---

## Solução de Problemas Comuns

### 1. Erro `Cannot find module @rollup/rollup-win32-x64-msvc` ao rodar `npm run dev`

Este é um problema comum de instalação do `npm`. Para resolver, faça uma reinstalação limpa:

```bash
# 1. Apague a pasta node_modules
rm -r -force node_modules
# 2. Apague o arquivo package-lock.json
del package-lock.json
# 3. Reinstale tudo
npm install
# 4. Tente rodar novamente
npm run dev
```

#### 2. Erro `AttributeError: 'Flask' object has no attribute 'before_first_request'`

Este erro ocorre em versões mais recentes do Flask. A solução é remover o código obsoleto.

- Abra o arquivo `backend/raiztech_api/src/main.py`.
- Encontre e remova o seguinte bloco de código (geralmente por volta da linha 25):

```python
# @app.before_first_request
# def initialize_database():
#     mysql_db.connect()
```

- Salve o arquivo e reinicie o servidor backend.