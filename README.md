# fullstack-apollo-express-postgresql-boilerplate

[![Build Status](https://travis-ci.org/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.svg?branch=master)](https://travis-ci.org/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate) [![Slack](https://slack-the-road-to-learn-react.wieruch.com/badge.svg)](https://slack-the-road-to-learn-react.wieruch.com/) [![Greenkeeper badge](https://badges.greenkeeper.io/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.svg)](https://greenkeeper.io/)

A full-fledged Apollo Server with Apollo Client starter project with React and Express. [Read more about it in this tutorial to build it yourself](https://www.robinwieruch.de/graphql-apollo-server-tutorial/).

**Family of universal fullstack repositories:**

Server Applications:

- [Node.js with Express + MongoDB](https://github.com/the-road-to-graphql/fullstack-apollo-express-mongodb-boilerplate)
- [Node.js with Express + PostgreSQL](https://github.com/the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate)

Client Applications:

* [React Client](https://github.com/the-road-to-graphql/fullstack-apollo-react-boilerplate)
* [React Native Client](https://github.com/morenoh149/fullstack-apollo-react-native-boilerplate)

## Features of Client + Server

- React (create-react-app) with Apollo Client
  - Queries, Mutations, Subscriptions
- Node.js with Express and Apollo Server
  - cursor-based Pagination
- PostgreSQL Database with Sequelize
  - entities: users, messages
- Authentication
  - powered by JWT and local storage
  - Sign Up, Sign In, Sign Out
- Authorization
  - protected endpoint (e.g. verify valid session)
  - protected resolvers (e.g. e.g. session-based, role-based)
  - protected routes (e.g. session-based, role-based)
- performance optimizations
  - example of using Facebook's dataloader
- Unit & E2E testing with Jest

## Installation

- `git clone git@github.com:the-road-to-graphql/fullstack-apollo-express-postgresql-boilerplate.git`
- `cd fullstack-apollo-express-postgresql-boilerplate`
- `yarn` (if yarn is not installed on your system, [install Yarn](https://yarnpkg.com/lang/en/docs/install))
- `touch .env.development .env.production .env.test`
- set databases and fill out \_.env files (see below)
- `yarn start` (or `yarn start:prod` for production)
- optional visit `http://localhost:8000` for GraphQL playground

#### Environment files

Since this boilerplate project is using PostgreSQL, you have to install it for your machine and get a database up and running. You find everything for the set up over here: [Setup PostgreSQL with Sequelize in Express Tutorial](https://www.robinwieruch.de/postgres-express-setup-tutorial). After you have created a database and a database user, you can fill out the environment variables in the _server/.env_ file.

```sh
DATABASE=mydatabase # mytestdatabase in .env.test
DATABASE_URL=https://myremoteserver # in .env.production

PORT=8000 # 8001 in .env.test

DATABASE_USER=postgres
DATABASE_PASSWORD=postgres

SECRET=asdlplplfwfwefwekwself.2342.dawasdq
```

The `SECRET` is just a random string for your authentication. Keep all these information secure by adding the _.env_ file to your _.gitignore_ file. No third-party should have access to this information.

#### Testing

- create the test database with `createdb mytestdatabase` (db name must match the one set in .env.test)
- run `yarn test` to execute unit tests, or `yarn test:e2e` to execute functional tests (end-to-end)
- optionnally, you can get coverage for unit tests with `yarn coverage`

## Want to learn more about React + GraphQL + Apollo?

- Don't miss [upcoming Tutorials and Courses](https://www.getrevue.co/profile/rwieruch)
- Check out current [React Courses](https://roadtoreact.com)
