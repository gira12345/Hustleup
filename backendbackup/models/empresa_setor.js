module.exports = (sequelize, DataTypes) => {
  const EmpresaSetor = sequelize.define('EmpresaSetor', {
    empresaId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    setorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    tableName: 'empresa_setor',
    timestamps: true
  });

  return EmpresaSetor;
};
