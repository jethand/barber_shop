

var express = require('express');
var router = express.Router();
const cookie = require('cookie');
const stringRandom = require('string-random');


router.all('*', (req, res,next) => {
    next();
    /* if(req.originalUrl === '/api/login' && req.baseUrl === '/api/login'){
        next();
    }else{
        if(!req.headers.cookie || !cookie.parse(req.headers.cookie).NODEXPRESSCOOKIE){
            res.send({
                errorCode: 0,
                errorMsg: 'Not Login'
            })
        }else{
            res.cookie('NODEXPRESSCOOKIE', stringRandom(16), { expires: new Date(Date.now() + 3600), httpOnly: true });
            next();
        }
    } */
});
module.exports = router;