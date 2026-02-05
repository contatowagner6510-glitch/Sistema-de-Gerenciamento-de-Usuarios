const sequelize = require('../config/db');

const User = require('./usersModel');
const Task = require('./tasksModel');

//relacionamentos

User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onDelete: 'CASCADE'
});

Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
});


//sincronização com bd
sequelize.sync({ alter: true })
  .then(() => console.log(' Tabelas sincronizadas'))
  .catch(err => console.error('Erro ao sincronizar tabelas:', err));


module.exports = {
  sequelize,
  User,
  Task
};
