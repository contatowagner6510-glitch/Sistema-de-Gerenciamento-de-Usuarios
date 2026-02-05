const {DataTypes} = require('sequelize')
const sequelize = require ('../config/db');



//craindo uma tabela no banco de dados pelo sequelize
//por padrão, o sequelize já cria o id dde forma automatica para as tabelas
const User= sequelize.define('User', {

  userId:{
    type: DataTypes.INTEGER,
    allowNull:false,
    autoIncrement:true,
    primaryKey:true
  },

  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },

  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },

  telefone: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: 'Users',
  timestamps: true,


})

  

module.exports = User;






//ESTAMOS TENTANDO MANIPULAR O BANCO DE DAODS USANDO SEQUELIZE