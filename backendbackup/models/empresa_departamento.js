module.exports = (sequelize, DataTypes) => {
  const EmpresaDepartamento = sequelize.define('empresa_departamento', {
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'empresas', key: 'id' }
    },
    departamentoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'departamentos', key: 'id' }
    }
  }, {
    tableName: 'empresa_departamento',
    timestamps: false
  });
  return EmpresaDepartamento;
};
