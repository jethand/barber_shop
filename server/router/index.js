module.exports = function(app){
    app.use('*', require('./all'));
    app.use('/api', require('./user'));
    app.use('/api', require('./member'));
};