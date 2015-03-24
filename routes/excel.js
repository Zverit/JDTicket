var User = require('../models/user').User;
var Ticket = require('../models/ticket').Ticket;
var async = require('async');
var Excel = require("exceljs");
var http = require('http'),
    fileSystem = require('fs'),
    path = require('path');

exports.get = function(req, res, next){
    async.waterfall([
        function(callback){
            User.findOne(req.session.user, callback);
        },
        function(user, callback){
            Ticket.find({
                '_id': { $in: user.tickets}
            }, callback);
        },
        function(tickets, callback){
            var workbook = new Excel.Workbook();
            var ws = workbook.addWorksheet("blort");

            for(var i in tickets) {
                ws.addRow([tickets[i].from, tickets[i].to, tickets[i].date]);
            }

            workbook.xlsx.writeFile("file.xlsx")
                .then(function() {
                    console.log("Done.");
                    var filePath = path.join("./", 'file.xlsx');
                    var stat = fileSystem.statSync(filePath);

                    res.writeHead(200, {
                        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        'Content-Length': stat.size
                    });

                    var readStream = fileSystem.createReadStream(filePath);
                    readStream.pipe(res);
                });
        }
    ], function(error){

    });
};