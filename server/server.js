const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../dist')));

// Application
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const logger = require('morgan');

/**
 * 基础配置
 */ 
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

require('./router')(app, express.Router())

/*require('./modal')*/

app.listen(5000, () => {
    console.log('Listen 5000')
})
