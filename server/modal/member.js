

module.exports = function(sequelize, DataTypes){
    return sequelize.define('member_list', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        member_name: {
            type: DataTypes.STRING
        },
        member_phone: {
            type: DataTypes.STRING
        },
        times:{
            type: DataTypes.INTEGER
        },
        balance:{
            type: DataTypes.INTEGER
        },
        create_time: {
            type: DataTypes.DATE
        },
        update_time: {
            type: DataTypes.DATE
        }
    }, {
        freezeTableName: true,
        timestamps: false
    });
}



