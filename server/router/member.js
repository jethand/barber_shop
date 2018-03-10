
const express = require('express');
const router = express.Router();

const MemberModal = require('../modal/member')
const HistoryModal = require('../modal/history')
const { sequelize, Sequelize} = require("../config/sequelize");
const Op = Sequelize.Op;

const cookie = require('cookie');
const stringRandom = require('string-random');
const moment = require('moment'); // dateFormat
const fs  = require('fs');
const path = require("path");

router.post('/member/new', (req, res) => {
    MemberModal(sequelize, Sequelize).findAll({
        where: {
            member_phone: req.body.phone
        }
    }).then(results => {
        if(results.length === 0){
            MemberModal(sequelize, Sequelize).create({  
                member_name: req.body.userName,  
                member_phone: req.body.phone,
                create_time: req.body.create_time
            }).then(result => {
                if(result){
                    res.send({
                        errorCode: 0,
                        errorMsg: ''
                    });
                }
            });
        }else{
            res.send({
                errorCode: 1,
                errorMsg: '手机号已存在'
            });
        }
    })
});
router.get('/member/list', (req, res) => {
    let query = req.query.query ? req.query.query : '';
    let queryOption = {};
    queryOption = {
        [Op.or]: [
            {
                member_phone: {
                    [Op.like]: '%' + query + '%'
                }
            },
            {
                member_name: {
                    [Op.like]: '%' + query + '%'
                }
            }
        ]
    };
    MemberModal(sequelize, Sequelize).findAll({
        attributes: ['id']
    }).then(results => {
        MemberModal(sequelize, Sequelize).findAll({
            limit: [(req.query.pageNow-1)*req.query.pageSize, Number(req.query.pageSize)],
            where: queryOption
        }).then(rows => {
            res.send({
                errorCode: 0,
                data: rows,
                total: req.query.query ? rows.length : results.length
            })
        });
    });
});
router.delete('/member/:phone', (req, res) => {
    MemberModal(sequelize, Sequelize).destroy({
        where: {
            member_phone: req.params.phone
        }
    }).then(result => {
        if(result){
            HistoryModal(sequelize, Sequelize).destroy({
                where: {
                    phone: req.params.phone
                }
            }).then(result_his => {
                res.send({
                    errorCode: 0
                })
            })
        }else{
            res.send({
                errorCode: 1,
                errorMsg: '删除失败'
            })
        }
    });
    
});
router.put('/member/:phone', (req, res) => {
    let updateParams = {},
        historyParams = {
            phone: req.params.phone,
            type: req.body.type,
            balance_old: req.body.balance_old,
            times_old: req.body.balance_old,
            balance_change: req.body.balance_change,
            times_change: req.body.times_change,
            create_time: new Date()
        };
    if(req.body.type === 'recharge'){ // 会员充值
        updateParams = {
            balance: req.body.balance_old + req.body.balance_change,
            times: req.body.times_old + req.body.times_change,
        };
        historyParams.balance_now = req.body.balance_old + req.body.balance_change;
        historyParams.times_now = req.body.times_old + req.body.times_change;
    }else if(req.body.type === 'consumption'){ // 会员消费
        if(req.body.balance_old < req.body.balance_change || req.body.times_old < req.body.times_change){
            res.send({
                errorCode: 1,
                errorMsg: '恶意入侵'
            })
        }else{
            updateParams = {
                balance: req.body.balance_old - req.body.balance_change,
                times: req.body.times_old - req.body.times_change,
            };
            historyParams.balance_now = req.body.balance_old - req.body.balance_change;
            historyParams.times_now = req.body.times_old - req.body.times_change;
        }
    }
    MemberModal(sequelize, Sequelize).update(
        updateParams,{
            where: {
                member_phone: req.params.phone
            }
        }
    ).then(result => {
        if(result){
            HistoryModal(sequelize, Sequelize).create(historyParams).then(result_history => {
                if(result_history){
                    res.send({
                        errorCode: 0
                    })
                }
            });
        }else{
            res.send({
                errorCode: 1,
                errorMsg: '删除失败'
            })
        }
    });
    
});
router.get('/member/history/:phone', (req, res) => {
    HistoryModal(sequelize, Sequelize).findAll({
        where: {
            phone: req.params.phone
        }
    }).then(rows => {
        res.send({
            errorCode: 0,
            data: rows
        });
    });
});
module.exports = router;