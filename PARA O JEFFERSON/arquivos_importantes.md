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

---

### 7. `src/pages/Reports.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Análises de Machine Learning", com os principais KPIs de performance da IA e análise por cultura.

*   **O que foi feito?**
    Substituí os dados mocados dos cards de estatísticas, da tabela de análise de culturas e do gráfico de evolução por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/reports/stats`**: Executa múltiplas consultas para calcular os KPIs principais da página: total de padrões aprendidos, eficiência média dos irrigadores, economia total de água e a precisão (confiança média) das decisões da IA.
        *   **`/api/reports/culture-analysis`**: Busca dados da tabela `Cultura`, fazendo um `JOIN` para contar quantos irrigadores estão associados a cada cultura e trazendo os dados de performance (padrões, eficiência, economia, status).
        *   **`/api/reports/learning-evolution`**: Cria um histórico de aprendizado agrupando as decisões da IA por mês, contando o número de padrões e a eficiência média para alimentar o gráfico de evolução.

    2.  **Alterações no `Reports.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para buscar e armazenar os dados dos três novos endpoints.
        *   Para melhorar a experiência do usuário, um estado de `loading` foi adicionado. Enquanto os dados são carregados, o componente exibe esqueletos de interface (elementos com animação "pulse").
        *   As requisições para as três rotas são feitas em paralelo usando `Promise.all` para otimizar o tempo de carregamento.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente nos cards de estatísticas, na tabela de culturas e no gráfico de evolução do aprendizado.
        *   Os dados mocados (`aiReports`, `cultureAnalysis`, `learningEvolutionData`) foram removidos do código.

---

### 8. `src/pages/Sensors.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Monitoramento de Irrigadores", mostrando um resumo do desempenho e uma lista detalhada de cada irrigador inteligente.

*   **O que foi feito?**
    Substituí todos os dados mocados da página, tanto dos cards de estatísticas quanto da grade de irrigadores, por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/sensors/stats`**: Executa múltiplas consultas em paralelo para calcular os KPIs da página: total de irrigadores ativos, eficiência média, cobertura total, economia de água na semana e confiança média da IA.
        *   **`/api/sensors/irrigators`**: Busca a lista completa de irrigadores, fazendo `JOIN` com as tabelas `Zona`, `Setor` e `Cultura` para obter todos os detalhes necessários para cada card (status, cultura, umidade, bateria, última decisão, etc.).

    2.  **Alterações no `Sensors.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para buscar e armazenar os dados dos dois novos endpoints.
        *   Um estado de `loading` foi adicionado. Enquanto os dados são carregados, a interface exibe esqueletos com animação "pulse", melhorando a experiência do usuário.
        *   As requisições para as duas rotas são feitas em paralelo usando `Promise.all` para otimizar o tempo de carregamento.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente nos cards de estatísticas e na grade de irrigadores.
        *   A lógica para exibir o status da IA (`getAIStatusBadge`) foi aprimorada para lidar com os diferentes status vindos do banco.

    3.  **Limpeza (`src/lib/data.ts`)**:
        *   O array de dados mocados `irrigators` foi removido do arquivo, pois não é mais utilizado.

---

### 9. `src/pages/Irrigation.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Sistema de Irrigação", mostrando o status de cada setor, estatísticas gerais e controles.

*   **O que foi feito?**
    Substituí os dados mocados dos cards de estatísticas e da lista de setores de irrigação por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/irrigation/stats`**: Executa múltiplas consultas para calcular os KPIs da página: número de setores ativos, tempo para a próxima irrigação e a eficiência média das zonas.
        *   **`/api/irrigation/zones`**: Busca a lista de todos os `Setor` do banco de dados. Utiliza lógica SQL com `CASE` e `TIMESTAMPDIFF` para calcular dinamicamente o status atual de cada setor ('active', 'scheduled', 'paused') e os tempos relativos (próxima irrigação, horas desde a última).

    2.  **Alterações no `Irrigation.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para buscar e armazenar os dados dos dois novos endpoints.
        *   Um estado de `loading` foi adicionado para exibir esqueletos de interface enquanto os dados são carregados, melhorando a UX.
        *   As requisições são feitas em paralelo com `Promise.all` para otimizar o carregamento.
        *   Após o carregamento, os dados do banco de dados são formatados e exibidos dinamicamente nos cards e na lista de setores.
        *   O array de dados mocados `irrigationZones` foi removido do componente.

---

### 10. `src/pages/Areas.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Zonas de Cobertura", mostrando um resumo do desempenho e uma lista detalhada de cada zona da propriedade.

*   **O que foi feito?**
    Substituí todos os dados mocados da página, tanto dos cards de estatísticas quanto da grade de zonas, por dados reais vindos da API.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/areas/stats`**: Executa múltiplas consultas em paralelo para calcular os KPIs da página: total de zonas ativas, cobertura total em hectares, eficiência média e a economia de água na semana.
        *   **`/api/areas/zones`**: Busca a lista completa de `Zona`, fazendo `LEFT JOIN` com as tabelas `Irrigador`, `Cultura` e `Setor` para obter todos os detalhes necessários para cada card (cultura, status da IA, umidade, padrões aprendidos, etc.). O uso de `LEFT JOIN` garante que mesmo zonas sem um irrigador ou cultura associada sejam exibidas.

    2.  **Alterações no `Areas.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para buscar e armazenar os dados dos dois novos endpoints.
        *   Um estado de `loading` foi adicionado. Enquanto os dados são carregados, a interface exibe esqueletos com animação "pulse", melhorando a experiência do usuário.
        *   As requisições para as duas rotas são feitas em paralelo usando `Promise.all` para otimizar o tempo de carregamento.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente nos cards de estatísticas, na grade de zonas e no mapa de cobertura.
        *   O array de dados mocados `zones` foi removido do componente.

---

### 11. `src/pages/Weather.tsx` e Novas Rotas na API

*   **O que é?**
    É o componente que renderiza a página "Inteligência Climática", mostrando as condições atuais e gerando recomendações de irrigação com base nos dados.

*   **O que foi feito?**
    Substituí os dados mocados das seções "Condições Atuais" e "Recomendações Inteligentes" por dados dinâmicos vindos da API. A seção de previsão de tempo foi mantida com dados estáticos, pois não há uma fonte de dados para isso no banco.

*   **Como funciona?**
    1.  **Novas Rotas na API (`src/pages/index.js`)**:
        *   **`/api/weather/current`**: Busca a média das medições de sensores do tipo `Temperatura` e `Umidade` da última hora para exibir as condições climáticas atuais da propriedade.
        *   **`/api/weather/recommendations`**: Busca todos os `Setor` e aplica uma lógica simples para gerar recomendações. Se a umidade de um setor estiver alta (>75%), recomenda adiar a irrigação. Caso contrário, recomenda continuar normalmente. Isso serve como uma base para uma lógica de IA mais complexa.

    2.  **Alterações no `Weather.tsx`**:
        *   O componente agora utiliza `useState` e `useEffect` para buscar e armazenar os dados dos dois novos endpoints.
        *   Um estado de `loading` foi adicionado para exibir um feedback visual enquanto os dados são carregados.
        *   As requisições são feitas em paralelo com `Promise.all` para otimizar o tempo de carregamento.
        *   Após o carregamento, os dados do banco de dados são exibidos dinamicamente nos cards de condições atuais e na lista de recomendações.
        *   Os arrays de dados mocados `currentWeather` e `irrigationRecommendations` foram removidos do componente.