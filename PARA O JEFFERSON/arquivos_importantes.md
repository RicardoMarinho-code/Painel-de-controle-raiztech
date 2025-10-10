# Documentação de Arquivos Importantes

Este documento descreve os arquivos que foram criados ou modificados para conectar a aplicação React ao banco de dados MySQL, substituindo os dados mocados.

O fluxo de dados agora é:
**Frontend (React) → Backend (API Node.js) → Banco de Dados (MySQL)**

---

### 1. `src/server/db.js`

*   **O que é?**
    É o módulo central e exclusivo para a conexão com o banco de dados MySQL.

*   **O que foi feito?**
    Este arquivo foi criado para centralizar e gerenciar a conexão com o banco.

*   **Como funciona?**
    1.  **`dotenv`**: Carrega as variáveis de ambiente do arquivo `.env` (que está na raiz do projeto). Isso permite que as credenciais do banco (`DB_HOST`, `DB_PASSWORD`, etc.) sejam usadas de forma segura, sem expô-las no código.
    2.  **`mysql2/promise`**: Utiliza a biblioteca `mysql2` para criar um "pool" de conexões (`mysql.createPool`). Um pool é muito mais eficiente do que criar uma nova conexão para cada consulta, pois reutiliza conexões já abertas.
    3.  **`module.exports`**: O `pool` de conexões é exportado para que outros arquivos do backend (como a nossa API) possam importá-lo e executar consultas no banco.

---

### 2. `src/server/index.js`

*   **O que é?**
    É o servidor de API (backend), construído com Node.js e Express.js. Ele atua como uma ponte segura entre o frontend e o banco de dados.

*   **O que foi feito?**
    Criei este servidor do zero para expor os dados do banco de dados através de uma rota (endpoint).

*   **Como funciona?**
    1.  **`express` e `cors`**: O `express` é usado para criar o servidor web. O `cors` é um middleware que permite que o nosso frontend (que roda em `localhost:8080`) faça requisições para esta API (que roda em `localhost:3001`) sem ser bloqueado pelo navegador por segurança.
    2.  **Importação do `pool`**: Ele importa o `pool` de conexões do arquivo `src/server/db.js`.
    3.  **Rota `/api/decisoes`**: Foi criada uma rota `GET` neste endereço. Quando o frontend faz uma requisição para `http://localhost:3001/api/decisoes`, o código desta rota é executado.
    4.  **Consulta SQL**: Dentro da rota, uma consulta SQL é executada usando o `pool`. A consulta usa `JOIN` para combinar dados da tabela `DecisaoIA` com outras tabelas (`Zona`, `Irrigador`, `Cultura`) para enriquecer os dados.
    5.  **Resposta JSON**: O resultado da consulta é formatado (adicionando sufixos como `%` e `L`) e enviado de volta ao frontend como uma resposta no formato JSON.

---

### 3. `src/pages/Schedule.tsx`

*   **O que é?**
    É o componente React que renderiza a página "Decisões Autônomas".

*   **O que foi feito?**
    Substituí os dados mocados (o array `aiDecisions` que estava fixo no código) por uma chamada de rede para a nossa nova API.

*   **Como funciona?**
    1.  **Hooks `useState` e `useEffect`**:
        *   `useState` foi adicionado para gerenciar o estado dos dados (`aiDecisions`), o status de carregamento (`loading`) e possíveis erros (`error`).
        *   `useEffect` é usado para executar a busca de dados assim que o componente é montado na tela. O array de dependências vazio (`[]`) garante que isso aconteça apenas uma vez.
    2.  **`fetch`**: Dentro do `useEffect`, a função nativa `fetch` faz uma requisição `GET` para a nossa API no endereço `http://localhost:3001/api/decisoes`.
    3.  **Atualização do Estado**:
        *   Se a requisição for bem-sucedida, os dados recebidos são armazenados no estado `aiDecisions` com `setAiDecisions(data)`.
    3.  **Atualização do Estado**:
        *   Se a requisição for bem-sucedida, os dados recebidos são armazenados no estado `aiDecisions` com `setAiDecisions(data)`.
        *   O React automaticamente re-renderiza o componente, agora exibindo os dados reais vindos do banco de dados.
        *   A interface agora também exibe uma mensagem de "Carregando..." ou de erro, melhorando a experiência do usuário.

---

### 4. `src/components/HistoryDashboard.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Histórico e Evolução da IA", com vários gráficos e estatísticas.

*   **O que foi feito?**
    Substituí os dados mocados das abas "Correlações Ambientais" e "Banco de Dados" por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/historico/correlacoes`**: Busca as medições de sensores das últimas 24 horas e as agrupa por hora, calculando a média para cada tipo de sensor (`Temperatura`, `Umidade`, etc.). Isso alimenta o gráfico de correlações.
        *   **`/api/historico/registros`**: Faz uma contagem (`COUNT(*)`) de todas as linhas na tabela `Medicao` para exibir o total de registros no banco de dados.
        *   **`/api/historico/status-sensores`**: Agrupa os sensores por `tipo` e conta quantos existem de cada, alimentando a lista de status de sensores.

    2.  **Alterações no `HistoryDashboard.tsx`**:
        *   Assim como no `Schedule.tsx`, foram usados os hooks `useState` e `useEffect`.
        *   `useState` agora armazena os dados para as correlações, o total de registros e o status dos sensores.
        *   `useEffect` faz três chamadas `fetch` separadas para as novas rotas da API assim que o componente é carregado.
        *   Os dados recebidos atualizam os respectivos estados, e o componente é re-renderizado para exibir os gráficos e as listas com informações do banco de dados.

    > **Nota:** As abas "Produtividade" e "Fluxo de Decisões" ainda utilizam dados mocados, pois a lógica para gerar esses dados a partir do banco de dados atual é mais complexa e pode necessitar de queries mais elaboradas ou até mesmo ajustes no schema.
        *   O React automaticamente re-renderiza o componente, agora exibindo os dados reais vindos do banco de dados.
        *   A interface agora também exibe uma mensagem de "Carregando..." ou de erro, melhorando a experiência do usuário.

---

### 5. `src/components/AIDecisionCenter.tsx` e Nova Rota na API

*   **O que é?**
    É o componente que renderiza o card "Centro de Decisões da IA" no painel principal, mostrando estatísticas e as últimas decisões.

*   **O que foi feito?**
    Substituí os dados mocados das estatísticas e da lista de decisões por dados reais vindos da API.

*   **Como funciona?**
    1.  **Nova Rota na API (`src/pages/index.js`)**:
        *   **`/api/decisoes/centro`**: Esta nova rota foi criada para servir especificamente a este componente. Ela executa duas consultas SQL:
            1.  Busca as 4 decisões mais recentes da tabela `DecisaoIA`, fazendo um `JOIN` com a tabela `Zona` para obter o nome da zona. Ela também usa uma expressão `CASE` para determinar o `outcome` (`success`, `warning`, `pending`) com base no tipo da decisão e no volume de água economizado.
            2.  Calcula as estatísticas do dia atual (`CURDATE()`): `COUNT(*)` para o total de decisões, `SUM(volume_economizado)` para a água economizada e `AVG(confianca)` para a confiança média.
        *   Os resultados de ambas as consultas são combinados em um único objeto JSON e enviados ao frontend.

    2.  **Alterações no `AIDecisionCenter.tsx`**:
        *   O componente agora usa `useState` e `useEffect` para buscar os dados da rota `/api/decisoes/centro` quando é montado.
        *   Dois estados foram criados: um para a lista de `recentDecisions` e outro para os `stats`.
        *   Enquanto os dados são carregados, o componente exibe "..." nos campos de estatísticas.
        *   Dois estados foram criados: um para a lista de `recentDecisions` e outro para os `stats`.
        *   Enquanto os dados são carregados, o componente exibe "..." nos campos de estatísticas.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente, tanto nas estatísticas quanto na lista de decisões recentes.

---

### 6. `src/pages/Index.tsx` (Página Principal) e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página principal do painel, com os cards de estatísticas e um resumo do status dos irrigadores.

*   **O que foi feito?**
    Substituí os dados mocados dos cards de estatísticas (`farmStats`) e da lista de irrigadores (`irrigators`) por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/dashboard/stats`**: Esta rota executa múltiplas consultas SQL em paralelo (`Promise.all`) para agregar dados de diferentes tabelas e calcular as estatísticas gerais (irrigadores ativos, eficiência média, culturas em aprendizado e cobertura total).
        *   **`/api/dashboard/irrigators-status`**: Busca uma lista resumida dos irrigadores, fazendo `JOIN` com as tabelas `Zona`, `Setor` e `Cultura` para obter informações completas. Uma subconsulta é usada para pegar a última decisão da IA para cada irrigador.

    2.  **Alterações no `Index.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para gerenciar os dados.
        *   No `useEffect`, duas requisições `fetch` são feitas em paralelo para as novas rotas da API.
        *   Quando os dados chegam, o estado do componente é atualizado. Os dados das estatísticas são mapeados para o formato esperado pelos `DashboardCard`.
        *   Enquanto os dados são carregados, os cards de estatísticas exibem um efeito "pulsante" (skeleton) para melhorar a experiência do usuário.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente, tanto nas estatísticas quanto na lista de decisões recentes.
        *   A interface agora também exibe uma mensagem de "Carregando..." ou de erro, melhorando a experiência do usuário.