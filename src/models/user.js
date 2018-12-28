// https://www.guidestack.pl/how-to-create-models-in-sequelize/
import { Model, Op, ENUM, STRING, VIRTUAL } from 'sequelize';
import { compare, hashSync } from 'bcrypt';

export default class User extends Model {
  static init(sequelize) {
    return super.init(
      {
        username: {
          type: STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
          },
        },
        email: {
          type: STRING,
          unique: true,
          allowNull: false,
          validate: {
            notEmpty: true,
            isEmail: { msg: 'Please provide valid e-mail address' },
          },
        },
        password_hash: STRING,
        password: {
          type: VIRTUAL,
          set: function(value) {
            this.setDataValue('password', value);
            this.setDataValue('password_hash', hashSync(value, 10));
          },
          validate: {
            isLongEnough: function(value) {
              if (value.length < 7) {
                throw new Error('Please choose a password with more than 7 characters.');
              }
            },
          },
        },
        role: {
          type: ENUM('ADMIN', 'USER'),
          defaultValue: 'USER',
          validate: {
            isIn: [['ADMIN', 'USER']],
          },
        },
      },
      {
        paranoid: true,
        sequelize,
        tableName: 'users',
        timestamps: true,
      },
    );
  }

  static associate({ Message }) {
    this.hasMany(Message, {
      onDelete: 'CASCADE',
      foreignKey: { allowNull: false },
    });
  }

  // class method used to find one user with given username
  static findByLogin(login) {
    return this.findOne({
      where: {
        [Op.or]: [{ username: login }, { email: login }],
      },
    });
  }

  // instance method used to validate given password against user's password
  validatePassword(password) {
    return compare(password, this.get('password_hash'));
  }

  // instance method used to change user's password
  changePassword(password) {
    this.set('password', password);
    return this.save();
  }

  // useful method to return serialized version of model's instance
  serialize() {
    var user = {
      id: this.get('id'),
      username: this.get('username'),
      email: this.get('email'),
    };
    // this line of code is responsible for returning associated UserCategory model in a serialized (JSON) form
    // but only if it was included in a query - otherwise we simply return userCategoryId
    user.userCategory = this.UserCategory
      ? this.UserCategory.serialize()
      : this.get('userCategoryId');
    return user;
  }
}
