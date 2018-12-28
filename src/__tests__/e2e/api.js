import path from 'path';
import { config } from 'dotenv';
import { post } from 'axios';

// Jest sets NODE_ENV automatically to 'test'
config({
  path: path.resolve(process.cwd(), `.env.${process.env.NODE_ENV}`),
});

const { HOST, PORT } = process.env;

const API_URL = `http://${HOST}:${PORT}/graphql`;

export const signIn = async variables =>
  await post(API_URL, {
    query: `
      mutation ($login: String!, $password: String!) {
        signIn(login: $login, password: $password) {
          token
        }
      }
    `,
    variables,
  });

export const getMeWithToken = async token =>
  await post(
    API_URL,
    {
      query: `
        {
          me {
            id
            email
            username
          }
        }
      `,
    },
    token
      ? {
          headers: {
            'x-token': token,
          },
        }
      : null,
  );

export const getUserById = async variables =>
  post(API_URL, {
    query: `
      query ($id: ID!) {
        user(id: $id) {
          id
          username
          email
          role
        }
      }
    `,
    variables,
  });

export const getAllUsers = async () =>
  post(API_URL, {
    query: `
      {
        users {
          id
          username
          email
          role
        }
      }
    `,
  });

export const signUp = async variables =>
  post(API_URL, {
    query: `
      mutation(
        $username: String!,
        $email: String!,
        $password: String!
      ) {
        signUp(
          username: $username,
          email: $email,
          password: $password
        ) {
          token
        }
      }
    `,
    variables,
  });

export const modifyUser = async (variables, token) =>
  post(
    API_URL,
    {
      query: `
        mutation ($username: String!) {
          updateUser(username: $username) {
            username
          }
        }
      `,
      variables,
    },
    token
      ? {
          headers: {
            'x-token': token,
          },
        }
      : null,
  );

export const removeUser = async (variables, token) =>
  post(
    API_URL,
    {
      query: `
        mutation ($id: ID!) {
          deleteUser(id: $id)
        }
      `,
      variables,
    },
    token
      ? {
          headers: {
            'x-token': token,
          },
        }
      : null,
  );
