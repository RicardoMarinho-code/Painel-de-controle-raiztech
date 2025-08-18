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

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [npm](https://www.npmjs.com/) instalados.

### Passos

1. Instale as dependências:

   ```bash
   npm i
   ```

2. Execute o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

O aplicativo estará disponível em [http://localhost:8080](http://localhost:8080).

## Scripts Adicionais

No arquivo `package.json`, você pode encontrar os seguintes scripts para rodar:

- `build`: Compila o projeto para produção.
- `build:dev`: Compila o projeto em modo de desenvolvimento.
- `lint`: Executa o linter para verificar erros de código.
- `preview`: Inicia um servidor local para visualizar a build de produção.