"use strict";

var app = require("./app.js"),
  server = app.listen(app.get("port"), () => {
    console.log(`Iniciando en el puerto ${app.get("port")}`);

    var io = require("socket.io").listen(server),
      socketMVC = require("socket.mvc");
     // CronJob = require('cron').CronJob;

    //    socketMVC.on("connection", function(socket) {
    io.sockets.on("connection", function(socket) {
      socketMVC.init(io, socket, {
        debug: true,
        filePath: ["./router/socket.js"]
      });

      socket.on("disconnect", function() {
        console.log("desconexion");
      });
    });

  /*  new CronJob('* * * * * *', function() {
      console.log('You will see this message every second');
    }, null, true, 'America/Los_Angeles');
*/
  });
