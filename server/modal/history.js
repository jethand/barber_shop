


module.exports = function(sequelize, DataTypes){
    return sequelize.define('history_list', {
        phone: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        type: {
            type: DataTypes.STRING
        },
        balance_old: {
            type: DataTypes.INTEGER
        },
        times_old: {
            type: DataTypes.INTEGER
        },
        balance_change: {
            type: DataTypes.INTEGER
        },
        times_change: {
            type: DataTypes.INTEGER
        },
        balance_now: {
            type: DataTypes.INTEGER
        },
        times_now: {
            type: DataTypes.INTEGER
        },
        create_time: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
}



