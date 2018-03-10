
var express = require('express');
var router = express.Router();

const UserModal = require('../modal/user')
const { sequelize, Sequelize} = require("../config/sequelize");

const cookie = require('cookie');
const stringRandom = require('string-random');
const moment = require('moment'); // dateFormat
const fs  = require('fs');
const path = require("path");
router.post('/user/login', (req, res) => {
     UserModal(sequelize, Sequelize).findAll({
        where:{
            user_name: req.body.userName,
            password: req.body.password
        }
    }).then(rows => {
        if(rows.length === 0){
            res.send({
                errorCode: 1,
                errorMsg: '账号或者用户名错误，请核对'
            })
        }else{
            res.cookie('NODEXPRESSCOOKIE', stringRandom(16), { expires: new Date(Date.now() + 1800000 + 28800000), httpOnly: true });
            res.send({
                errorCode: 0,
                errorMsg: 'Login Success!'
            })
        }
    }); 
});
module.exports = router;