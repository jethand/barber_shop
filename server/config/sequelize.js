
const Sequelize = require('sequelize')
const color  = require('cli-color');
const sequelize = new Sequelize('barber_shop', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 10000
    },
    timezone: '+08:00'
});
sequelize.authenticate().then(function(){
    console.log(color.magentaBright("connect mysql success!"));
}).catch(function(err) {
    throw err;
});
exports.sequelize = sequelize;
exports.Sequelize = Sequelize;