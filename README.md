# Transactions API

## Project strutcture
```
src
├── controllers
│   ├── accountController.ts
│   └── transactionController.ts
│
├── services
│   ├── accountService.ts
│   └── transactionService.ts
│
├── entities
│   ├── Account.ts
│   └── Transaction.ts
│
├── db
│   ├── index.ts
│   ├── seed.ts
│   └── data
│       ├── accounts-api.json
│       ├── accounts-api-large.json
│       ├── transactions-api.json
│       └── transactions-api-large.json
│
├── routes
│   ├── accountRoutes.ts
│   ├── transactionRoutes.ts
│   └── schemas
│       ├── accountSchemas.ts
│       ├── transactionSchemas.ts
│       └── index.ts
│
└── index.ts
```

## How to Run the Project

To run the project, follow these steps:

### Prerequisites

Make sure you have Docker and Node.js installed on your machine.

### Step 1: Start PostgreSQL Database with Docker

Run the following command at the root of the project to start the PostgreSQL database using Docker Compose:

```
docker-compose up
```

### Step 2: Install Dependencies

Run the following command to install project dependencies:

```
npm install
```

### Step 3: Start the Server

After installing dependencies, run the following command to start the server:

```
npm run build
npm run start
```

DEV (it runs with hot reload):
```
npm run start:dev
```

This will start the application server on port 8080.

### Testing

To run tests, execute the following command:

```
npm run test
```

This command will run unit tests.

### Database Seed

To run seed, execute the following command:

```
npm run build
npm run db:seed
```

Optionally, if you want to seed the database with a larger dataset, you can use the following command:

```
npm run db:seed:large
```

### OpenAPI Spec
The OpenAPI Spec file ([swagger.yml](https://github.com/danielavilas/transactions-api/blob/main/swagger.yml)) is available for testing purposes. You can open it in the [Swagger Editor](https://editor.swagger.io/) or [Postman](https://www.postman.com/) to explore and interact with the API documentation.
