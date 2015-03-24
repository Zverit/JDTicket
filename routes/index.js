var User = require('../models/user').User;
var Ticket = require('../models/ticket').Ticket;
var checkAuth = require('../middleware/checkAuth');
var http = require('http');
var _ = require("underscore");

module.exports = function(app) {

    app.get('/', function (req, res, next) {
        res.render('index', {title: 'Express'});
    });

    app.get('/loginAdmin', checkAuth, function (req, res, next) {
        res.render('loginAdmin');
    });

    app.get('/admin', checkAuth, function (req, res, next) {
        res.render('admin');
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

    app.get("/excel", require('./excel').get);

    app.get("/login", require('./login').get);

    app.post("/login", require('./login').post);

    app.post("/adduserticket/:id", checkAuth, function(req, res, next){
        console.log(req.session.user);

        Ticket.findOneAndUpdate(
            { _id: req.params.id },
            { $inc:   { count: -1 } },
            { upsert: true },
            function (err, idDoc) {

            });

        User.findByIdAndUpdate(req.session.user,
            {$push: {tickets: req.params.id}} ,
            function(err, user){
                res.json(user);
            }
        );
    });

    app.post("/deleteuserticket/:id", checkAuth, function(req, res, next){
        console.log(req.session.user);
        User.findByIdAndUpdate(req.session.user,
            {$pull: {tickets: req.params.id}} ,
            function(err, user){
                res.json(user);
            }
        );
    });

    app.get("/addticket", function (req, res, next) {
        res.render('addticket');
    });

    app.post("/addticket", function(req, res, next){
        var from = req.body.from;
        var to = req.body.to;
        var date = req.body.date;
        var count = req.body.count;

        var ticket = new Ticket({from : from, to : to, date: date, count: count});
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
