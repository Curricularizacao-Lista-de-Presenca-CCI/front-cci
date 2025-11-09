# 🧓 Sistema de Controle de Presença – CCI (Front-End)

Este repositório contém o **Front-End** do sistema desenvolvido para o **Centro de Convivência do Idoso (CCI)** de Assis/SP.  
O sistema tem como objetivo **modernizar o controle de presença dos idosos nas atividades**, substituindo o método manual em papel por uma interface digital acessível, intuitiva e eficiente.

---

## 👥 Equipe de Desenvolvimento

| Nome 
|------|
| [**Clara Joaquim Plantier**](https://github.com/ClaraJoaquim) 
| [**Gabriela Viana Cunha**](https://github.com/gvcunhadev) 
| [**Kaique Alexandre de Souza Kubota**](https://github.com/SouzaKaique) 
| [**Maria Vitória Alvim Nardotto**](https://github.com/VitoriaAlvim7) 
| [**Yann Pereira Garcia**](https://github.com/YannPG) 

---

## 💡 Sobre o Projeto

O **Sistema de Controle de Presença – CCI** foi desenvolvido para **facilitar o registro e acompanhamento da presença dos idosos** nas atividades diárias do centro.  
Ele permite que coordenadores e funcionários **importem listas de presença e gerenciem eventos**, com foco em **acessibilidade e usabilidade**.

---

## 🛠️ Tecnologias Utilizadas

- **Angular v19**
- **Bootstrap**
- **Node.js (v18+)**
- **TypeScript**
- **HTML5 / CSS3**

---

## ⚙️ Pré-requisitos

Antes de executar o projeto, verifique se o ambiente Angular está configurado corretamente:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [Angular CLI](https://angular.io/cli) (instale com: `npm install -g @angular/cli`)

---

## 🚀 Como Executar o Projeto

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Curricularizacao-Lista-de-Presenca-CCI/front-cci.git

2. **Acesse a pasta do projeto**
   ```bash
   cd FRONT-CCI

3. **Instale as dependências**
   ```bash
   npm install

4. **Execute o servidor local**
   ```bash
   npx ng serve

5. **Acesse no navegador**
   ```bash
   http://localhost:4200

## 🧭 Estrutura de Navegação

| Caminho | Descrição |
|----------|------------|
| `/login` | Tela de acesso inicial dos usuários. |
| `/registro` | Cadastro de novos servidores. |
| `/admin` | Área administrativa do sistema. |
| `/dialog-importe-chamada` | Modal para importação de chamadas. |
| `/importe-chamada` | Tela principal para importação de listas de presença. |
| `/relacao-servidores` | Exibe e gerencia os servidores cadastrados. |
| `/busca-presenca` | Tela onde o idoso confirma sua presença. |
| `/lista-chamada` | Exibe listas de chamada criadas ou disponíveis. |
| `/lista-geral-presenca` | Mostra uma lista de presença consolidada. |

---

## 🔒 Conexão com o Back-End

O **back-end** foi desenvolvido em **Java 21 / Spring Boot 3.5.5 / PostgreSQL 17**.  

Antes de iniciar o front-end, garanta que o servidor do back-end esteja rodando.  

---

## 🧩 Funcionalidades Principais

- 🔑 Login e registro de coordenadores/servidores  
- 📥 Importação de listas de presença em formato `.xlsx`  
- 🕓 Abertura e finalização de chamadas de presença  
- 🙋‍♀️ Auto-registro de presença pelos idosos  
- 🔎 Consulta de eventos e listas finalizadas  
- 📊 Relatórios de frequência  

---

## 🧱 Estrutura de Pastas

<img width="195" height="291" alt="image" src="https://github.com/user-attachments/assets/5bb7322a-45aa-4d69-852e-383bfee1463a" />

---

## 🧰 Encerrando o Servidor
Para encerrar a execução do servidor local, pressione:
   ```bash
   CTRL + C
