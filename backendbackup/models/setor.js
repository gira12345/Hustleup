module.exports = (sequelize, DataTypes) => {
  const Setor = sequelize.define('Setor', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'setores'
  });

  Setor.associate = (models) => {
    // Associações já definidas em index.js
  };

  return Setor;
};
