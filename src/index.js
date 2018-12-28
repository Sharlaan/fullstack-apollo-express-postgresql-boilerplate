import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import jwt from 'jsonwebtoken';
import DataLoader from 'dataloader';
import express from 'express';
import { ApolloServer, AuthenticationError } from 'apollo-server-express';

import schema from './schema';
import resolvers from './resolvers';
import initDB from './models';
import createUsersWithMessages from './seed';
import loaders from './loaders';

// Setup environment variables
const { NODE_ENV = 'development' } = process.env;

const isTest = NODE_ENV === 'test';
const isProduction = NODE_ENV === 'production';

const env = dotenv.config({
  // debug: !isProduction,
  path: path.resolve(process.cwd(), `.env.${NODE_ENV}`),
});

// if (!isProduction) {
//   if (env.error) throw env.error;
//   console.log('parsed env :\n', env.parsed, '\n');
// }

const {
  DATABASE,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_USER,
  HOST = 'localhost',
  PORT = 8000,
  SECRET,
} = process.env;

// Setup Express server and attach middlewares
const app = express();

app.use(cors());

app.use(morgan('dev'));

// TODO: Comment this function
const getMe = async req => {
  const token = req.headers['x-token'];

  if (token) {
    try {
      return await jwt.verify(token, SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};

const formatError = error => {
  // remove the internal sequelize error message
  // leave only the important validation error
  const message = error.message
    .replace('SequelizeValidationError: ', '')
    .replace('Validation error: ', '');

  return {
    ...error,
    message,
  };
};

const context = async ({ req, connection }) => {
  if (connection) {
    return {
      models,
      loaders: {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
      },
    };
  }

  if (req) {
    const me = await getMe(req);

    return {
      models,
      me,
      secret: SECRET,
      loaders: {
        user: new DataLoader(keys => loaders.user.batchUsers(keys, models)),
      },
    };
  }
};

// TODO: Explain those different servers and which encapsulates which
const server = new ApolloServer({
  context,
  formatError,
  introspection: NODE_ENV !== 'production',
  playground: NODE_ENV !== 'production',
  resolvers,
  typeDefs: schema,
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

// Setup database and DAO layer,
// seed DB, then run main server
const { models, sequelize } = initDB({
  DATABASE,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_USER,
  HOST,
});

sequelize
  .sync({ force: isTest || isProduction })
  .then(() => {
    if (isTest || isProduction) {
      // Seed database
      createUsersWithMessages(new Date(), models);
    }
  })
  .then(() => httpServer.listen({ port: PORT }))
  .then(() =>
    console.log(
      `\n[${NODE_ENV.toUpperCase()}] Apollo Server running on http://${HOST}:${PORT}/graphql\n`,
    ),
  );
