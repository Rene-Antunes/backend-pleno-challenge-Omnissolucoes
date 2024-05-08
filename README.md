# backend-pleno-challenge-Omnissolucoes
Uma simples RestFull API em nodejs

<h1>✅ Status do projeto</h1>

> API Rest feito em JavaScript usando NodeJs

<h2 id="sobre" >Sobre o desafio</h2>
Desenvolver uma API Restful em Node.js foi uma jornada que realizei individualmente, impulsionado por pesquisas online e autodidatismo. Minha capacidade de comunicação interna e colaboração foi substituída por uma abordagem proativa na identificação e resolução de desafios.

Enfrentei conflitos simulados através da análise crítica de documentações e fóruns online, buscando soluções técnicas para problemas específicos. Ao antecipar possíveis obstáculos e identificar oportunidades de melhoria, implementei soluções adicionais de segurança e otimização de desempenho.

Minha busca ativa por conhecimento também foi uma parte crucial do processo. Iniciei minha carreira com Java, posteriormente adotando o Framework Spring Boot o que me trouxe insights valiosos para aprimorar a qualidade e robustez da API em Node.Js com JavaScript.

Em resumo, minha jornada de desenvolvimento individual destacou a importância da proatividade, autodidatismo e busca contínua por conhecimento na consecução de projetos desafiadores. Este projeto exemplifica como a iniciativa pessoal pode impulsionar o progresso e o sucesso em empreendimentos técnicos complexos.


Tabela de conteúdos
=================

   * [Sobre](#sobre)
   * [Métodos](#Método)
   * [Como usar](#comoUsar)
      * [Pré-requisitos e tecnologias](#requisitos)
      * [Rodando a Api](#rodandoApi)
   * [Recursos](#UsersRecursos)
  
## Métodos
Requisições para a API devem seguir os padrões:
| Método | Descrição |
|---|---|
| `GET` | Retorna informações de um ou mais registros. |
| `POST` | Utilizado para criar um novo registro. |
| `PUT` | Atualiza dados de um registro ou altera sua situação. |
| `DELETE` | Remove um registro do sistema. |

## Respostas

| Código | Descrição |
|---|---|
| `200` | Requisição executada com sucesso (success).|
| `400` | Erros de validação ou os campos informados não existem no sistema.|
| `401` | Dados de acesso inválidos.|
| `404` | Registro pesquisado não encontrado (Not found).|


<h2 id="UsersRecursos">⚙️Users Recursos</h2>

### Registrar (userRegister) [POST /register]
+ Request (application/json)

   + Body

            {
             "username": "username",
               "password":"password",
               "confirmPassword": "confirmPassword",
               "email": "@gmail.com",
               "firstName": "firstName",
               "lastName": "lastName",
               "phoneNumber":"+552199999"
            }
______________________________
### Logar (loginHandler) [POST /login]
   
  + Request (application/json)

    + Body

            {
             "user_identity": "exemplo@gmail.com",
             "password":"xxxx"
            }
______________________________
### Listar (getUserList) [GET /users]
______________________________
### Buscar (GetUserById) [GET /users/:id]
______________________________
### Atualizar User (updateUser) [PUT /update-user/:id]
  + Request (application/json)
    
       + Body
    
                {
                 "username": "username",
                   "password":"password",
                   "confirmPassword": "confirmPassword",
                   "email": "@gmail.com",
                   "firstName": "firstName",
                   "lastName": "lastName",
                   "phoneNumber":"+552199999"
                }
______________________________
### Atualizar password (updatePassword) [PUT /update-password]
  + Request (application/json)
  
     + Body
  
              {
                "userEmail": "exemplo@gmail.com",
                "userCurrentPassword":"xxxx",
                "userNewPassowrd": "xxxx"
              }
______________________________    
### Exlcuir user (deleteUser) [DELETE /delete]
  + Request (application/json)
  
     + Body
  
              {
                "userEmail": "exemplo@gmail.com"
              }
______________________________
<h2 id="comoUsar">⚙️ Como Usar</h2>

<h2 id="requisitos">✅ Pré-requisitos e tecnologias </h2>

- [JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [NodeJs](https://nodejs.org/en/download)
- IDE [VSCode](https://code.visualstudio.com/download)
- [MySQL](https://www.mysql.com/downloads/)
- [Postman](https://www.postman.com)

# Autenticação

API utiliza a biblioteca jsonwebtoken como forma de autenticação/autorização.



## Solicitando tokens de acesso [/oauth/access_token]

Para testar a API, pode usar o postman para criar um usuário e entre no sistema utilizando as credenciais informadas.  

Para gerar o token da API

### Obtendo o token
Para obter utilize o e-mail e senha que foi cadastra na criação do usuário

### Utilizando token [POST]

O `token` é do formato JWT.

A URL para obter o token é a seguinte: https://localhost:3000/login

#### Dados para envio no POST
| Parâmetro | Descrição |
|---|---|
| `user_identity` | email padrão cadastrado |
| `password` | senha padrão cadastrada |

+ Request (application/json)

    + Body

            {
             "user_identity": "exemplo@gmail.com",
             "password":"xxxx"
            }

+ Response 200 (application/json)

    + Body

            {
                "user": {
                    "id": 1,
                    "username": "rene",
                    "email": "reneantunes3@gmail.com"
                      },
                      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJyZW5lIiwiaWF0IjoxNzE1MTI0NDg4LCJleHAiOjE3MTUyMTA4ODh9.Sr7NMwBhXzcq6TbpIkqQSCdEmEqFxVIMI0FVc64V8A8"
           }

Utilize o token gerado no postman na aba Authorization, selecione Type: Bearer Token e cole o token no campo "token"

<h2 id="rodandoApi">🎲 Rodando a Api</h2>

<h3> Clone este repositório</h3>
faça um fork e em seguida clone:
git clone <https://github.com/Rene-Antunes/backend-pleno-challenge-Omnissolucoes-.git>


<h3>Iniciar aplicação</h3>

No terminal:
```
npm install 
```
Para instalar todas as dependencias do projeto.

para rodar em modo desenvolvedor use:
```
npm run dev  
```
<h3>Configurando banco de dados</h3>

É necessário ter MySQL instalado em sua máquina, após instalação use os comandos no terminal:
```
sequelize-cli db:create
```
```
sequelize-cli db:migrate
```
para criar a tabela users
Rodando os testes use:
```
npm run test 
```
no arquivo config.json configure as credencias de acordo com o seu banco de dados
exemplo:
  ```
   "development":{
      "username":"root",
      "password":"senha",
      "database":"restfullapi",
      "host":"localhost",
      "dialect": "mysql"
    }
  ```

**A aplicação vai iniciar na porta http://localhost:3000**


