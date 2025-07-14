module.exports = (sequelize, DataTypes) => {
  const Estudante = sequelize.define('Estudante', {
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    curso: {
      type: DataTypes.STRING,
      allowNull: false
    },
    competencias: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true // Corrigido para permitir valores nulos
    },
    foto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    sobreMim: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    objetivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    disponibilidade: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoProjeto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    instituicao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anoConclusao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idiomas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkedin: {
      type: DataTypes.STRING,
      allowNull: true
    },
    areasInteresse: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    telefone: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'estudantes'
  });

  Estudante.associate = (models) => {
    // Associações já definidas em index.js
  };

  return Estudante;
};
