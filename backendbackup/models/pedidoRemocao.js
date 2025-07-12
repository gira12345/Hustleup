module.exports = (sequelize, DataTypes) => {
  const PedidoRemocao = sequelize.define('PedidoRemocao', {
    estudanteId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'pendente'
    },
    motivo: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: 'Pedido de remoção de conta'
    }
  }, {
    tableName: 'pedidos_remocao'
  });

  PedidoRemocao.associate = (models) => {
    PedidoRemocao.belongsTo(models.Estudante, { 
      foreignKey: 'estudanteId'
    });
  };

  return PedidoRemocao;
};
