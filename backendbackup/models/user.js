const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    nome: {
      type: DataTypes.STRING,
      allowNull: true // Agora permite nulo, não é obrigatório
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin', 'empresa', 'estudante', 'gestor'),
      allowNull: false
    }
  }, {
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        user.password = await bcrypt.hash(user.password, 10);
      },
      beforeUpdate: async (user) => {
        if (user.changed('password') && !user.password.startsWith('$2b$')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    },
    // timestamps ativados por omissão
  });

  User.prototype.validarPassword = async function (senha) {
    return await bcrypt.compare(senha, this.password);
  };

  User.associate = (models) => {
    User.hasOne(models.Empresa, { foreignKey: 'userId' });
    User.hasOne(models.Estudante, { foreignKey: 'userId' });
    User.belongsToMany(models.Departamento, {
      through: models.GestorDepartamento,
      foreignKey: 'gestorId',
      otherKey: 'departamentoId',
      as: 'Departamentos'
    });
  };

  return User;
};
