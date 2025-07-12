module.exports = (sequelize, DataTypes) => {
  const EstudanteSetor = sequelize.define('EstudanteSetor', {
    estudanteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    setorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'estudante_setor',
    timestamps: false
  });

  return EstudanteSetor;
};
