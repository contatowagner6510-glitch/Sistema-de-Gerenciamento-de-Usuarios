const {DataTypes} = require ('sequelize')
const sequelize = require ('../config/db');


//craindo uma tabela no banco de dados pelo sequelize
//por padrão, o sequelize já cria o id dde forma automatica para as tabelas
const Tasks= sequelize.define('Tasks', {

  nome: {
    type: DataTypes.STRING,
    allowNull: false,
    unique:true
  },

  descricao: {
    type: DataTypes.TEXT,
    allowNull: true,
    
  },

  concluida: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue:false,
  },
  prazo: {
    type: DataTypes.DATE,
    allowNull: false
  },
  userId: {
  type: DataTypes.INTEGER,
  allowNull: false
}


}, {
  tableName: 'Tasks',
  timestamps: true

});

module.exports = Tasks;