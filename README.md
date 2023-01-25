<p align="center">
  
  <h1 align='center'>Gayoe Coffee Shop</h1>
</p>

## About The Project

Authentic Coffee from Aceh

## Built With

![nodejs](https://img.shields.io/badge/nodejs-16-brightgreen)
![expressjs](https://img.shields.io/badge/expressjs-4-lightgrey)
![postgreSQL](https://img.shields.io/badge/postgreSQL-11-blue)

## ENDPOINT DETAILS

| Endpoint     |            Method             | Info         |
| ------------ | :---------------------------: | :----------- |
| /auth        |        `POST` `DELETE`        | Auth         |
| /users       | `POST` `GET` `PATCH` `DELETE` | Users        |
| /products    | `POST` `GET` `PATCH` `DELETE` | Products     |
| /promos      | `POST` `GET` `PATCH` `DELETE` | Promos       |
| /transaction | `POST` `GET` `PATCH` `DELETE` | Transactions |

## Features

1. Authentication system Login,Register with JWT
2. Form input Validation, hash password.
3. Searching and Sorting with Pagination.
4. Page Navigation Handling.

## Installation

1. Download this Project or you can type
   `https://github.com/MoIkrom/Coffee_Gayoe.git`

```sh
https://github.com/MoIkrom/Coffee_Gayoe.git
```

2. Install NPM packages

```sh
$ npm install
```

3. Add .env

```sh
   DB_PORT = 8080 DB_HOST_DEV="Your DB_HOST" DB_USER_DEV="Your DB_USER_DEV" DB_NAME_DEV="Your DB_NAME_DEV" DB_PASS_DEV="Your DB_PASS_DEV" DB_PORT="Your DB_PORT" SECRET_KEY="Your SECRET_KEY" ISSUER = "Your ISSUER"
```

4. Start App

```sh
   $ npm run dev
```

5. Gayoe Coffee is Running

## Related Project

- Frontend Deploy [`here`](https://coffee-gayoe-app.vercel.app/)
