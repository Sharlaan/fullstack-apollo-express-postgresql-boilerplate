import { Model, STRING } from 'sequelize';

export default class Message extends Model {
  static init(sequelize) {
    return super.init(
      {
        text: {
          type: STRING,
          validate: { notEmpty: true },
        },
      },
      { sequelize },
    );
  }

  static associate({ User }) {
    this.belongsTo(User);
  }
}
