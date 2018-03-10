


module.exports = function(sequelize, DataTypes){
    return sequelize.define('user_list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
}



