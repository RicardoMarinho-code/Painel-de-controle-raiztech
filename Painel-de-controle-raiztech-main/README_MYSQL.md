# Configuração MySQL para Painel RaizTech

Este documento explica como configurar e usar a conexão MySQL no projeto React RaizTech.

## Estrutura do Projeto

```text
Painel-de-controle-raiztech-main/
├── src/                          # Frontend React (não modificado)
├── backend/                      # Novo diretório para backend
│   └── raiztech_api/            # Aplicação Flask
│       ├── src/
│       │   ├── database/
│       │   │   └── mysql_config.py    # Configuração MySQL
│       │   ├── routes/
│       │   │   ├── agricultor.py      # APIs para agricultores
│       │   │   ├── sensores.py        # APIs para sensores
│       │   │   └── irrigacao.py       # APIs para irrigação
│       │   └── main.py                # Aplicação principal Flask
│       ├── venv/                      # Ambiente virtual Python
│       ├── requirements.txt           # Dependências Python
│       └── .env.example              # Exemplo de variáveis de ambiente
└── Banco_SQL.sql                # Script de criação do banco
```

## Pré-requisitos

1. **MySQL Server** instalado e rodando
2. **Python 3.11+**
3. **Node.js** para o frontend React

## Configuração do Banco de Dados

### 1. Criar o Banco de Dados

Execute o script SQL fornecido:

```sql
-- Execute o conteúdo do arquivo Banco_SQL.sql no seu MySQL
mysql -u root -p < Banco_SQL.sql
```

### 2. Configurar Variáveis de Ambiente

Copie o arquivo `.env.example` para `.env` no diretório `backend/raiztech_api/`:

```bash
cp backend/raiztech_api/.env.example backend/raiztech_api/.env
```

Edite o arquivo `.env` com suas credenciais MySQL:

```env
MYSQL_HOST=localhost
MYSQL_DATABASE=AgroTech
MYSQL_USER=root
MYSQL_PASSWORD=sua_senha_mysql
MYSQL_PORT=3306
```

## Executando o Backend

### 1. Ativar o Ambiente Virtual

```bash
cd backend/raiztech_api
source venv/bin/activate
```

### 2. Instalar Dependências (se necessário)

```bash
pip install -r requirements.txt
```

### 3. Executar o Servidor Flask

```bash
python src/main.py
```

O backend estará rodando em `http://localhost:5000`

## Executando o Frontend

### 1. Instalar Dependências do React

```bash
npm install
```

### 2. Configurar Variável de Ambiente (Opcional)

Crie um arquivo `.env` na raiz do projeto React:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

### 3. Executar o Frontend

```bash
npm run dev
```

O frontend estará rodando em `http://localhost:5173`

## APIs Disponíveis

### Agricultores

- `GET /api/agricultores` - Lista todos os agricultores
- `GET /api/agricultores/{id}` - Busca agricultor específico
- `POST /api/agricultores` - Cria novo agricultor
- `PUT /api/agricultores/{id}` - Atualiza agricultor
- `DELETE /api/agricultores/{id}` - Remove agricultor

### Sensores

- `GET /api/sensores` - Lista todos os sensores
- `GET /api/sensores/{id}/medicoes` - Medições de um sensor
- `POST /api/medicoes` - Cria nova medição
- `GET /api/sensores/tipos/{tipo}/medicoes-recentes` - Medições recentes por tipo
- `GET /api/dashboard/sensores-resumo` - Resumo para dashboard

### Irrigação

- `GET /api/zonas` - Lista zonas de irrigação
- `GET /api/irrigadores` - Lista irrigadores
- `PUT /api/irrigadores/{id}/status` - Atualiza status do irrigador
- `GET /api/setores` - Lista setores
- `POST /api/setores/{id}/irrigacao` - Programa irrigação
- `GET /api/decisoes-ia` - Decisões da IA
- `GET /api/dashboard/irrigacao-resumo` - Resumo para dashboard

## Estrutura do Banco de Dados

O banco `AgroTech` contém as seguintes tabelas principais:

- **Agricultor** - Dados dos agricultores
- **PropriedadeRural** - Propriedades rurais
- **Sensor** - Sensores de monitoramento
- **Medicao** - Medições dos sensores
- **Irrigador** - Equipamentos de irrigação
- **Zona** - Zonas de irrigação
- **Setor** - Setores de cultivo
- **Reservatorio** - Reservatórios de água
- **DecisaoIA** - Decisões da inteligência artificial

## Integração Frontend-Backend

### Arquivo de API (`src/lib/api.ts`)

Contém a classe `ApiClient` que gerencia todas as chamadas HTTP para o backend MySQL.

### Hooks Personalizados (`src/hooks/useApi.ts`)

Hooks React para facilitar o uso da API:

- `useAgricultores()`
- `useSensores()`
- `useIrrigadores()`
- `useSensoresResumo()`
- etc.

### Exemplo de Uso

```typescript
import { useIrrigadores } from '@/hooks/useApi';

function MeuComponente() {
  const { data: irrigadores, loading, error } = useIrrigadores();
  
  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  
  return (
    <div>
      {irrigadores?.map(irrigador => (
        <div key={irrigador.ID_irrigador}>
          {irrigador.nome} - {irrigador.status_}
        </div>
      ))}
    </div>
  );
}
```

## Solução de Problemas

### Erro de Conexão MySQL

- Verifique se o MySQL está rodando
- Confirme as credenciais no arquivo `.env`
- Teste a conexão manualmente

### Erro CORS

- O Flask está configurado com CORS habilitado
- Verifique se o backend está rodando na porta 5000

### Erro de Importação

- Certifique-se de que o ambiente virtual está ativado
- Execute `pip install -r requirements.txt`

## Próximos Passos

1. Adicionar dados de exemplo no banco MySQL
2. Implementar autenticação se necessário
3. Adicionar mais páginas do React para usar a API
4. Configurar deploy em produção

## Observações Importantes

- O backend foi criado **fora** da pasta `src` do React, conforme solicitado
- A estrutura original do React foi preservada
- O Supabase foi substituído pela API MySQL personalizada
- Todas as dependências estão documentadas no `requirements.txt`
