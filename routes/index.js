var User = require('../models/user').User;
var Ticket = require('../models/ticket').Ticket;
var checkAuth = require('../middleware/checkAuth')

module.exports = function(app) {
    app.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    app.get('/admin', checkAuth, function (req, res, next) {
        res.render('index', {title: 'Admin'});
    });

    app.get("/users", function (req, res, next) {
        User.find({}, function (err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });

    app.get("/user:id", function (req, res, next) {
        User.findById(req.params.id, function (err, user) {
            if (err) return next(err);
            res.json(user);
        })
    });

    app.get("/tickets", checkAuth, function(req, res, next){
        User.findById(req.session.user, function(err, user){
            res.render('tickets', {
                user: req.user
            });
        });

    });

    app.post("/logout", function(req, res) {
        req.session.destroy();
        res.redirect('/');
    });

    app.get("/login", require('./login').get);

    app.post("/login", require('./login').post);

    app.get("/addticket", function (req, res, next) {
        res.render('addticket');
    });

    app.post("/addticket", function(req, res, next){
        var from = req.body.from;
        var to = req.body.to;

        console.log(from);
        console.log(to);
        var ticket = new Ticket({from : from, to : to});
        ticket.save(function(err){
            return next(err);
        });
        res.send({});
    });

    app.get("/getalltickets", function(req, res, next){
        Ticket.find({}, function (err, users) {
            if (err) return next(err);
            res.json(users);
        })
    });
};
