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

| Endpoint        |            Method             | Info         |
| --------------- | :---------------------------: | :----------- |
| /auth           |            `POST`             | Auth         |
| /users          | `POST` `GET` `PATCH` `DELETE` | Users        |
| /users/profile  |      `PATCH`                  | Profiles     |
| /products       | `POST` `GET` `PATCH` `DELETE` | Products     |
| /promos         | `POST` `GET` `PATCH` `DELETE` | Promos       |
| /transaction    | `POST` `GET` `PATCH` `DELETE` | Transactions |



## Features

1. Authentication system Login,Register with JWT
2. Form input Validation, hash password.
3. Searching and Sorting with Pagination.
4. Page Navigation Handling.

## Installation

1. Download this Project or you can type
   `git@github.com:MoIkrom/Coffee_Gayoe.git`

```sh
https://github.com/MoIkrom/Coffee_Gayoe.git
```

2. Install NPM packages

```sh
$ npm install
```
3. Add .env<br>

```sh
   `DB_PORT = 8080 DB_HOST_DEV="localhost" DB_USER_DEV="postgres" DB_NAME_DEV="coffe_gayoe" DB_PASS_DEV="612mikram" DB_PORT="5432" SECRET_KEY="WEB11" ISSUER = "FAZZTRACK"`
```
4. Start App<br>
```sh
   `$ npm run dev`
```
5. Gayoe Coffee is Running

