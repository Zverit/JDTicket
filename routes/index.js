var User = require('../models/user').User;
var Ticket = require('../models/ticket').Ticket;
var checkAuth = require('../middleware/checkAuth')
var Excel = require("exceljs");
var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');


module.exports = function(app) {
    app.get('/excel/:user', function(req, res, next){
        var workbook = new Excel.Workbook();
        var ws = workbook.addWorksheet("blort");
        var row12 = ws.getRow(1);
        row12.height = 40;
        row12.width =  500;
        row12.getCell(1).value = req.params.user;

        workbook.xlsx.writeFile("chikarachka.xlsx")
            .then(function() {
                console.log("Done.");
                var filePath = path.join("./", 'chikarachka.xlsx');
                var stat = fileSystem.statSync(filePath);

                res.writeHead(200, {
                    'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    'Content-Length': stat.size
                });

                var readStream = fileSystem.createReadStream(filePath);
                readStream.pipe(res);
            });
    });

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

    app.get("/adduserticket/:id", checkAuth, function(req, res, next){
        console.log(req.session.user);
        User.findByIdAndUpdate(req.session.user,
            {$push: {tickets: req.params.id}} ,
            function(err, user){
                res.json(user);
            }
        );
    });

    app.get("/deleteuserticket/:id", checkAuth, function(req, res, next){
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
