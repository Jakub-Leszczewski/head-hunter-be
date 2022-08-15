<div id="top"></div>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->



<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/ezterr/head-hunter-fe">
    <img src="./readme/logo.png" alt="Logo" width="226" height="160">
  </a>

<h1 align="center">[BE] MegaK - Head Hunter</h1>

  <p align="center">
    Aplikacja "MegaK - Head Hunter" została stworzona aby łączyć kursantów MegaK z potencjalnymi pracodawcami, którzy szukają uzdolnionych i ambitnych programistów.
    <br />
    <br />
<!--
    <a href="https://github.com/ezterr/head-hunter-fe">View Demo</a>
    ·
    <a href="https://github.com/ezterr/head-hunter-fe/issues">Report Bug</a>
    ·
    <a href="https://github.com/ezterr/head-hunter-fe/issues">Request Feature</a>
-->
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Spis treści</summary>
  <ol>
    <li>
      <a href="#o-projekcie">O projekcie</a>
      <ul>
        <li><a href="#technologie">Technologie</a></li>
      </ul>
    </li>
    <li>
      <a href="#jak-zacząć">Jak zacząć</a>
      <ul>
        <li><a href="#warunki-wstepne">Warunki wstępne</a></li>
        <li><a href="#instalacja">Instalacja</a></li>
      </ul>
    </li>
    <li>
      <a href="#endpoints">Endpoints</a>
      <ul>
        <li><a href="#auth">Autoryzacja</a></li>
        <li><a href="#admin">Admin</a></li>
        <li><a href="#hr">Hr</a></li>
        <li><a href="#student">Kursant</a></li>
        <li><a href="#user">Użytkownik</a></li>
      </ul>
    </li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## O projekcie

![Product Name Screen Shot][product-screenshot]

Projekt został stworzony na potrzeby MegaK. Aplikacja ma na celu pomóc kursantom w znalezieniu pracy, a firmom w znalezieniu zdolnych, początkujących programistów. Aplikacja zawiera trzy role.
1. **Admin** - czuwa nad przebiegiem rekrutacji
2. **Hr** - posiada uprawnienia do wyświetlania listy kursantów, brania kursantów na rozmowy oraz ich zatrudniania.
3. **Kursant** - posiada możliwość wyświetlania własnego profilu, a także możliwość edytowania go. Kursant ma również możliwość zmiany statusu konta na "zatrudniony"

<p align="right">(<a href="#top">back to top</a>)</p>



### Technologie
[![Nest][Nest]][Nest-url]
[![Typescript][Typescript]][Typescript-url]
[![Typeorm][Typeorm]][Typeorm-url]
[![Jwt][Jwt]][Jwt-url]
[![Mysql][Mysql]][Mysql-url]
[![Passport][Passport]][Passport-url]
[![Nodemailer][Nodemailer]][Nodemailer-url]
[![Bcrypt][Bcrypt]][Bcrypt-url]

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- GETTING STARTED -->
## Jak zacząć

### Warunki wstępne
* node
  ```sh
  node@^16.15.1
  ```
* yarn
  ```sh
  yarn@^1.22.19
  ```

### Instalacja

1. Sklonuj repozytorium
   ```sh
   git clone https://github.com/ezterr/head-hunter-be.git
   ```
2. Przejdź do katalogu projektu
   ```sh
   cd head-hunter-be
   ```
3. Zainstaluj wszystkie zależności
   ```sh
   yarn
   ```
4. zmień nazwę pliku `src/config/config.example.ts` na `src/config/config.ts`
5. odpowiednio uzupełnij plik config `src/config/config.ts`
    ```ts
     export const config = {
       dbHost: 'localhost',  // Adres ip do bazy danych
       dbPort: 3306,  // Port do bazy danych
       dbDatabase: '',  // nazwa bazy danych
       dbUsername: '',  // nazwa użytkownika do bazy danych
       dbPassword: '',  // hasło do bazy danych
       dbSynchronize: true,  // czy typeorm ma synchronizować bazę danych zalecane - false
       dbLogging: false,  // wyświetlanie w konsoli wykonywanego sql
       feUrl: 'https://head-hunter.pl', // adres url do frontendu
       mailPassword: 'admin123',  // hasło do servera smtp
       mailUsername: 'admin',  // nazwa użytkownika do servera smtp
       jwtSecret:'',  // klucz zabezpieczający jwt
       jwtTimeToExpire: '1y',  // ważność jwt
       jwtCookieTimeToExpire: 1000, // ważność ciastak
       maxItemsOnPage: 30,  // maksymalna ilość elementów na jedną stronę
     };
    ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Endpoints

### Auth
* **POST /api/auth/login** - loguje użytkownika i ustawia mu ciastko z tokenem dostępu
  ```ts
    // dto dla body
    {
      email: string;
      password: string;
    }
  ```
* **DELETE /api/auth/logout** - wylogowuję użytkownika, usuwa jwt z ciastek
* **DELETE /api/auth/password** - wysyła maila na podany adres z linkiem resetującym hasło
  ```ts
    // dto dla body
    {
      email: string;
    }
  ```
* **PUT /api/auth/password/:userToken** - zmienia hasło przy pomocy userTokena
  ```ts
    // dto dla body
    {
      newPassword: string;
    }
  ```
* **GET /api/auth/user** - pobiera aktualnie zalogowanego użytkownika
<p align="right">(<a href="#top">back to top</a>)</p>

### Admin
* **GET /api/admin/notification** -  pobiera powiadomienia admina.
  ```ts
    // dto dla query
    {
      page: number;
      search: string;
    }
  ```
  <p align="right">(<a href="#top">back to top</a>)</p>

### Hr 
* **POST /api/hr** - dodaje nowego hr
  ```ts
    // dto dla body
    {
      email: string;
      firstName: string;
      lastName: string;
      company: string;
      maxReservedStudents: number;
    }
  ```
 * **PATCH /api/hr/:userToken** - Kończy rejestracje uprzednio dodanego hr
  ```ts
    // dto dla body
    {
      newPassword: string;
    }
  ```
<p align="right">(<a href="#top">back to top</a>)</p>

### Student
* **/api/student** - pobiera wszystkich dostępnych kursantów
  ```ts
    // dto dla query
    {
      page: number;
      status: StudentStatus[];
      sortBy: SortBy;
      sortMethod: SortMethod;
      search: string;
      courseCompletion: number;
      courseEngagement: number;
      projectDegree: number;
      teamProjectDegree: number;
      contractType: ContractType[];
      typeWork: WorkType[];
      salaryMin: number;
      salaryMax: number;
      canTakeApprenticeship: boolean[];
      monthsOfCommercialExp: number;
    }
  ```
* **POST /api/student** - importuje wielu kursantów, jeśli kursant z takim mailem istnieje, w bazie danych zostanie pominięty.
    ```ts
        // dto dla body
        {
          email: string;
          courseCompletion: number;
          courseEngagement: number;
          projectDegree: number;
          teamProjectDegree: number;
          bonusProjectUrls: string[];
        }[]
      ```
* **PATCH /api/student/:userToken** - kończy rejestracje użytkownika i uzupełnia go o brakujące dane.
    ```ts
        // dto dla body
        {
          lastName: string;
          firstName: string;
          email: string;
          password: string;
          newPassword: string;
          githubUsername: string;
          bio: string;
          phoneNumber: string;
          projectUrls: string[];
          portfolioUrls: string[];
          education: string;
          courses: string;
          monthsOfCommercialExp: number;
          workExperience: string;
          expectedSalary: number;
          targetWorkCity: string;
          expectedContractType: ContractType;
          expectedTypeWork: WorkType;
          canTakeApprenticeship: boolean;
        }
      ```
<p align="right">(<a href="#top">back to top</a>)</p>

### User
* **GET /api/user/:id** - pobiera użytkownika po jego id
* **PATCH /api/user/:id/password** - zmienia hasło użytkownika
  ```ts
    // dto dla body
    {
      newPassword: string;
      password: string;
    }
* **GET /api/user/:id/student** - pobiera użytkownika po jego id, który jest kursantem
* **PATCH /api/user/:id/student** - edytuje użytkownika, który jest kursantem
    ```ts
    {
      lastName: string;
      firstName: string;
      email: string;
      password: string;
      newPassword: string;
      githubUsername: string;
      bio: string;
      phoneNumber: string;
      projectUrls: string[];
      portfolioUrls: string[];
      education: string;
      courses: string;
      monthsOfCommercialExp: number;
      workExperience: string;
      expectedSalary: number;
      targetWorkCity: string;
      expectedContractType: ContractType;
      expectedTypeWork: WorkType;
      canTakeApprenticeship: boolean;
    }
    ```
* **PATCH /api/user/:id/student/employed** - zmienia status użytkownika na zatrudniony
* **PATCH /api/user/:id/student/interview** - dodaje rozmowę z podanym hr
  ```ts
    // dto dla body
    {
      hrId: string;
    }
* **DELETE /api/user/:id/student/interview** - usuwa rozmowę z podanym hr
  ```ts
    // dto dla body
    {
      hrId: string;
    }
* **GET /api/user/:id/hr/student** - pobiera dostępnych kursantów, którzy nie znajdują się na rozmowie u podanego hr
  ```ts
    // dto dla query
    {
      page: number;
      status: StudentStatus[];
      sortBy: SortBy;
      sortMethod: SortMethod;
      search: string;
      courseCompletion: number;
      courseEngagement: number;
      projectDegree: number;
      teamProjectDegree: number;
      contractType: ContractType[];
      typeWork: WorkType[];
      salaryMin: number;
      salaryMax: number;
      canTakeApprenticeship: boolean[];
      monthsOfCommercialExp: number;
    }
  ```
* **GET /api/user/:id/hr/student/interview** - pobiera kursantów którzy znajdują się na rozmowie u podanego hr
  ```ts
    // dto dla query
    {
      page: number;
      status: StudentStatus[];
      sortBy: SortBy;
      sortMethod: SortMethod;
      search: string;
      courseCompletion: number;
      courseEngagement: number;
      projectDegree: number;
      teamProjectDegree: number;
      contractType: ContractType[];
      typeWork: WorkType[];
      salaryMin: number;
      salaryMax: number;
      canTakeApprenticeship: boolean[];
      monthsOfCommercialExp: number;
    }
  ```

<p align="right">(<a href="#top">back to top</a>)</p>



<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/ezterr/head-hunter-be.svg?style=for-the-badge
[contributors-url]: https://github.com/ezterr/head-hunter-be/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/ezterr/head-hunter-be.svg?style=for-the-badge
[forks-url]: https://github.com/ezterr/head-hunter-be/network/members
[stars-shield]: https://img.shields.io/github/stars/ezterr/head-hunter-be.svg?style=for-the-badge
[stars-url]: https://github.com/ezterr/head-hunter-be/stargazers
[issues-shield]: https://img.shields.io/github/issues/ezterr/head-hunter-be.svg?style=for-the-badge
[issues-url]: https://github.com/ezterr/head-hunter-be/issues

[Typescript]: https://img.shields.io/badge/typescript-20232A?style=for-the-badge&logo=typescript&logoColor=3178c6
[Typescript-url]: https://www.typescriptlang.org/
[Nest]: https://img.shields.io/badge/Nest-20232A?style=for-the-badge&logo=nestjs&logoColor=ea2845
[Nest-url]: https://nestjs.com/
[Typeorm]: https://img.shields.io/badge/type%20orm-20232A?style=for-the-badge&logo=typeorm&logoColor=ea2845
[Typeorm-url]: https://typeorm.io/
[Jwt]: https://img.shields.io/badge/jwt-20232A?style=for-the-badge&logo=JSONwebtokens&logoColor=fff
[Jwt-url]: https://jwt.io/
[Mysql]: https://img.shields.io/badge/mysql-20232A?style=for-the-badge&logo=mysql&logoColor=fff
[Mysql-url]: https://www.mysql.com/
[Passport]: https://img.shields.io/badge/passport-20232A?style=for-the-badge&logo=passport&logoColor=fff
[Passport-url]: https://www.passportjs.org/
[Nodemailer]: https://img.shields.io/badge/nodemailer-20232A?style=for-the-badge&logo=nodemailer&logoColor=fff
[Nodemailer-url]: https://nodemailer.com/about/
[Bcrypt]: https://img.shields.io/badge/bcrypt-20232A?style=for-the-badge&logo=bcrypt&logoColor=fff
[Bcrypt-url]: https://github.com/kelektiv/node.bcrypt.js

[product-screenshot]: readme/available.png
