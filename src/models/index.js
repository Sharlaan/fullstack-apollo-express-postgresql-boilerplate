import Sequelize from 'sequelize';

/**
 * Init Database module
 * @param {Object} dbConfig - environment variables defining the database
 * @param {string} dbConfig.DATABASE - name of database
 * @param {string} dbConfig.DATABASE_PASSWORD - password used to connect
 * @param {string} dbConfig.DATABASE_URL - database url (when deployed)
 * @param {string} dbConfig.DATABASE_USER - login used to connect
 * @param {string} dbConfig.HOST - database host
 * @returns {Object} instances of models and sequelize
 */
export default function initDB({
  DATABASE,
  DATABASE_PASSWORD,
  DATABASE_URL,
  DATABASE_USER,
  HOST = 'localhost',
}) {
  const dbConnection = DATABASE_URL
    ? [DATABASE_URL] // URI syntax
    : [DATABASE, DATABASE_USER, DATABASE_PASSWORD]; // detailed syntax

  const options = {
    dialect: 'postgres',
    // freezeTableName: true,
    host: HOST,
    // logging: false,
    operatorsAliases: false,
  };

  const sequelize = new Sequelize(...dbConnection, options);

  // Test connection
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        `\n[SEQUELIZE] Connection to the database '${DATABASE_URL ||
          DATABASE}' has been established successfully.\n`,
      );
    })
    .catch(error => {
      console.error('\n[SEQUELIZE] Unable to connect to the database:\n', error);
    });

  const UserModel = require('./User').default;
  const MessageModel = require('./Message').default;

  const models = {
    User: UserModel.init(sequelize),
    Message: MessageModel.init(sequelize),
  };

  // create associations between models
  for (const model of Object.keys(models)) {
    typeof models[model].associate === 'function' && models[model].associate(models);
  }

  // Object.values(models)
  //   .filter(model => typeof model.associate === 'function')
  //   .forEach(model => model.associate(models));

  return { models, sequelize };
}
