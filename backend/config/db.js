
const { Sequelize } = require("sequelize");

//BANCO DE DADOS
const sequelize = new Sequelize(
  "bancousuario",
  "root",
  "",
  {
    host:"localhost",
    dialect:"mysql"
  }
);


//"condicionais de promessa" then = if catch = else
sequelize.authenticate().then((function(){
  console.log("Banco conectado")
})).catch(function(erro){
  console.log("banco de dados não conectou. Erro: "+erro)
});



module.exports = sequelize