"use strict";

var express = require("express"),
  favicon = require("serve-favicon"),
  bodyParser = require("body-parser"),
  morgan = require("morgan"),
  restFull = require("express-method-override")("_method"), //modulo para utilizar los verbos del protocolo HTTP
  ejs = require("ejs"),
  routes = require("./router/app-router"),
  faviconURL = `${__dirname}/public/images/favicon.png`,
  publicDir = express.static(`${__dirname}/public`),
  viewDir = `${__dirname}/views`,
  port = process.env.PORT || 3001,
  app = express();
  


app
  //configuracion app
  .set("views", viewDir)
  .set("view engine", "ejs")
  .set("port", port)

  //ejecutando middleware
  //.use( favicon(faviconURL))  //COMENTADO PORQUE EL favicon.png NO LO TENGO
  //parse application/json
  .use(bodyParser.json())
  // parse application/x-www-form-urlencoded
  .use(bodyParser.urlencoded({ extended: false }))
  .use(restFull)
  .use(morgan("dev"))
  .use(publicDir)
  .use(routes);

module.exports = app;
