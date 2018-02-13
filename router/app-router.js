"use strict";

var AppController = require("../controllers/app-controller"),
  express = require("express"),
  path = require("path"),
  router = express.Router();
/**
 * LA FUNCTION TPL NO LA VAMOS A USAR
 *
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
var ruta = `${process.cwd()}/views/`;
var preventReCall; //variable de control para evitar la rellamada del ajax
router
  .get("/", function(req, res) {
    res.send("hola");
  })
  //.get("/tdc", AppController.getTdcVivos)

  .get("/tdc", function(req, res) {
    console.log(`${process.cwd()}`);
    res.sendFile(ruta + "index.html");
    //res.sendFile(path.join(__dirname, '../views', 'index.html'));
    // AppController.getTdcVivos();
  }) // .get('/tpl/:id', tpl)     //ESTA RUTA NO LA VAMOS A USAR

  .post("/tdcs", function(req, res) {
    console.log("en post");
    // AppController.getTdcVivos();
    // res.send("iniciando");
    console.log("request: ", !preventReCall);
    let cuenta = 0;
    //if (!preventReCall) {
    preventReCall = AppController.getTdcVivos().then(results => {
      res.send(results);
      preventReCall = null;

      //console.log(results);
    });
    //} else {
    //  res.end();
    // }

    console.log("request: ", preventReCall, "  cuenta: ", cuenta);
    /*AppController.getTdcVivos();
    res.send("calculando....");*/
  })
  .post("/prueba2", (req, res) => {
    AppController.getTdcVivosPrueba();
    res.end();
  })
  .post("/prueba", (req, res) => {
    //AppController.getTdcVivosPrueba()
    var registros = AppController.prueba();
    //console.log(registros);
    res.end(registros);
  })
  /*
    .get('/', PelisController.getAll)
    .get('/agregar', PelisController.addForm)
    //.post('/agregar', PelisController.insert)     //unificar el método insert junto con el actualizar en el metodo save
    .post('/agregar', PelisController.save)
    .get('/editar/:pelis_id', PelisController.getOne)
    //.post('/actualizar/:pelis_id', PelisController.update)
    //.put('/actualizar/:pelis_id', PelisController.update)       //unificar el método insert junto con el actualizar en el metodo save
    .put('/actualizar/:pelis_id', PelisController.save)       
    //.post('/eliminar/:pelis_id', PelisController.delete)
    .delete('/eliminar/:pelis_id', PelisController.delete)
   */ .use(
    AppController.error404
  ); //se pone use(middlware) porque no podemos definir una ruta  y debe estar al final

module.exports = router;
