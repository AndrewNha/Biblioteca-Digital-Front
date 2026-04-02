# 1 . Introdução
<h3>Projeto Sistema de Biblioteca Digital</h3>

O presente projeto consiste no desenvolvimento de um sistema de biblioteca digital denominado “ReadMaxxing”, cujo objetivo é gerenciar o acervo de livros, autores, usuários, empréstimos e reservas de uma biblioteca.<br><br>
O problema central abordado é a necessidade de controlar de forma organizada e segura o fluxo de empréstimos e reservas de livros, garantindo que regras de negócio, como o limite de três empréstimos ativos por usuário e a impossibilidade de reservar um livro com cópias disponíveis, sejam respeitadas. Ademais, o objetivo central do projeto é o controle de integridade entre as entidades do sistema, isto é, garantir que os relacionamentos estejam válidos e sem contradições.<br><br>
O sistema foi desenvolvido com uma arquitetura cliente-servidor, onde o back-end é responsável por toda a lógica de negócio e persistência de dados, enquanto o front-end oferece uma interface visual para interação com o sistema. O sistema implementa as operações de CRUD (criação, leitura, atualização e exclusão de dados), além disso, a comunicação entre as duas camadas ocorre através de requisições HTTP (<i>GET</i>, <i>POST</i>, <i>PUT</i>, <i>DELETE</i>), seguindo os princípios REST (<i>Representational State Transfer</i>), estes muito utilizados para o desenvolvimento de APIs web, pois organiza a comunicação entre cliente e servidor através de <i>endpoints</i><br><br>

# 2 . Modelagem do Problema

<h3>Diagrama UML</h3>

<img width="901" height="910" alt="uml" src="https://github.com/user-attachments/assets/af626093-6b57-40b4-9795-013bcdff8869" />

<h3>Descrição do modelo</h3>

O sistema foi modelado utilizando os princípios da Orientação a Objetos, com as seguintes classes principais:<br><br>
- `Person` — classe abstrata que serve como base para Author e User, aplicando o conceito de herança. Ambas as subclasses herdam os atributos id e name, e implementam o método abstrato `getInfo()` , que, surpreendemente, pode ser visualizado no momento de uma requisição `POST`, aplicando o conceito de polimorfismo. <br>
- `Author` — representa um autor do acervo, com atributo `nationality` e uma lista de livros escritos. Possui uma associação ManyToMany bidirecional com Book. Entretanto, no sistema, ele deve ser criado antes de Book, pois um Book precisa ter um autor que o escreveu.<br>
- `User` — representa um usuário da biblioteca, com atributos `email` e `telephoneNumber`. Pode ter múltiplos empréstimos e reservas associados. <br>
- `Book` — representa um livro do acervo, com atributos de `name`, `gender`, `publisher`, `releaseDate`, `quantity` e `quantityAvailable`, além de possuir uma lista de autores. Todo livro pode ter sido escrito por mais de um autor.<br>
- `Loan` — representa um empréstimo, associando um User a um Book com um status (`ACTIVE`, `RETURNED`, `LATE`) e datas de empréstimo e devolução. <br>
- `Reservation` — representa uma reserva, associando um User a um Book com um status (`PENDING`, `COMPLETED`, `CANCELLED`) e data de reserva.<br>

<h3>Estrutura atual do projeto</h3>

```
.
├── src/
│   ├── main/
│   │   ├── java/turminha/BibliotecaDigital/
│   │   │   ├── controller/
│   │   │   │   ├── AuthorController.java
│   │   │   │   ├── BookController.java
│   │   │   │   ├── LoanController.java
│   │   │   │   ├── ReservationController.java
│   │   │   │   └── UserController.java
│   │   │   ├── service/
│   │   │   │   ├── AuthorService.java
│   │   │   │   ├── BookService.java
│   │   │   │   ├── LoanService.java
│   │   │   │   ├── ReservationService.java
│   │   │   │   └── UserService.java
│   │   │   ├── repository/
│   │   │   │   ├── AuthorRepository.java
│   │   │   │   ├── BookRepository.java
│   │   │   │   ├── LoanRepository.java
│   │   │   │   ├── ReservationRepository.java
│   │   │   │   └── UserRepository.java
│   │   │   ├── model/
│   │   │   │   ├── Author.java
│   │   │   │   ├── Book.java
│   │   │   │   ├── Loan.java
│   │   │   │   ├── Person.java
│   │   │   │   ├── Reservation.java
│   │   │   │   └── User.java
│   │   │   ├── enums/
│   │   │   │   ├── LoanStatus.java
│   │   │   │   └── ReservationStatus.java
│   │   │   └── BibliotecaDigitalApplication.java
│   │   └── resources/
│   │       └── application.yml
│   └── test/
│       └── java/turminha/BibliotecaDigital/
│           └── BibliotecaDigitalApplicationTests.java
└── pom.xml
```

<h3>Arquitetura</h3>

O projeto seguiu a seguinte arquitetura em camadas:

- `model` — entidades JPA que representam o domínio do sistema
- `repository` — interfaces que estendem JpaRepository, responsáveis pelo acesso ao banco de dados
- `service` — classes responsáveis pelas regras de negócio
- `controller` — classes responsáveis por receber as requisições HTTP e delegar ao service correspondente
- `enums` — enumerações que representam os possíveis estados de empréstimos e reservas
- `config` — configurações da aplicação, como o CORS

# 3 . Ferramentas Utilizadas

### [Back-end](https://github.com/AndrewNha/Biblioteca-Digital-Back)
- Linguagem: Java<br>
- Framework: Spring, utilizando Spring Boot, responsável pela criação da API REST, injeção de dependências e gerenciamento do ciclo do vida do sistema
- Spring Data JPA: criação de queries através de convenções de nomenclatura de métodos
- Hibernate: mapeamento entre as classes Java e as tabelas do banco de dados
- Banco de dados: PostgresSQL
- IDE: IntelliJ IDEA
- Gerenciador de dependências: Maven

### Front-end
- Linguagem: TypeScript/JavaScript
- Framework: React.js com Vite
- TailwindCSS
- IDE: Visual Studio Code

# 4 . Considerações finais

O sistema desenvolvido atende aos requisitos propostos, oferecendo um CRUD completo para todas as entidades (livros, autores, usuários, empréstimos e reservas) com todas as regras de negócio devidamente implementadas e validadas. O front-end consome a API REST através de requisições HTTP e exibe as mensagens de erro retornadas pelo back-end de forma legível ao usuário.<br>

A principal dificuldade encontrada pela equipe foi a curva de aprendizado do Spring Boot, visto que nenhum dos integrantes possuía experiência prévia com o framework nem com os conceitos de HTTP e arquitetura REST. A integração entre o front-end e o back-end também representou um desafio, especialmente no que diz respeito à configuração do CORS e ao formato correto dos dados enviados nas requisições.<br>

Em relação à linguagem Java e ao paradigma de Orientação a Objetos, a equipe avalia positivamente a experiência. Ficou evidente que o POO é especialmente útil em aplicações de maior escala, onde a organização em classes, a reutilização de código através da herança e a separação de responsabilidades tornam o sistema mais fácil de manter e evoluir. O desenvolvimento deste projeto contribuiu de forma significativa para a compreensão prática desses conceitos, que muitas vezes são abordados apenas de forma teórica. Nesse sentido, a apresentação de Java, para nós que nunca haviamos tido contato anteriormente, foi excelente, isso devido à excelente didática do nosso professor Gabriel Belarmino<br>

Como sugestão para a disciplina, seria interessante a apresentação, pelo menos superficialmente, de frameworks como o Spring, pois é o modo que o Java é utilizado na vida real nas corporações. Ademais, outro motivo da apresentação de frameworks ser um tópico válido é devido ao fato de que a transição do Java puro para um ambiente com tantas abstrações e convenções representa um salto considerável para quem está aprendendo.<br>
