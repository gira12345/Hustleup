// Modelo de associação entre gestor e departamento
module.exports = (sequelize, DataTypes) => {
  const GestorDepartamento = sequelize.define('GestorDepartamento', {
    gestorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'users', key: 'id' }
    },
    departamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: { model: 'departamentos', key: 'id' }
    }
  }, {
    tableName: 'gestor_departamento',
    timestamps: false  // Desativando timestamps temporariamente
  });
  return GestorDepartamento;
};
