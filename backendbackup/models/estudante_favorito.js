module.exports = (sequelize, DataTypes) => {
  const EstudanteFavorito = sequelize.define('EstudanteFavorito', {
    estudanteId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    propostaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    }
  }, {
    tableName: 'estudante_favoritos',
    timestamps: false
  });

  return EstudanteFavorito;
};
