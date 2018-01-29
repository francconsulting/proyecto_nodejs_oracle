"use strict";

var oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  reloj = require("./reloj"),
  //numRows = 100,
  //iRowsAffec = 0,
  //arrayData = [],
  //arrayHeader = [],
  ConnBd = () => {};

oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;
oracledb.fetchArraySize = 100;

ConnBd.setDatos = filas => {
  arrayData.push(filas);
};

ConnBd.setRows = filas => {
  numRows = filas;
};

/**
 * Apertura de la conexion a la BD.
 * Devuelve la conexion
 * @param {function} cb callback que se ejecuta justo despues de conectar
 */

ConnBd.open = cb => {
  return oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};

/**
 * Cerrar la conxion a la BD
 * @param {Object} conn
 */
ConnBd.close = conn => {
  setTimeout(() => {
    conn.close(err => {
      if (err) {
        console.log("Error al cerrar la Conexionn");
      }
      console.log("conexion Cerrada");
    });
  }, 1000); //retrasar el cierre de la conexion 1seg
};

/**
 * Cerrar el recordset
 * @param {Object} conn
 * @param {array} results
 */
ConnBd.closeRs = (conn, results) => {
  if (results != undefined) {
    results.resultSet.close(err => {
      if (err) {
        console.log("Error al cerrar el recordSet");
      }
      console.log("recordset Cerrado");
    });
  }
};

/**
 * Ejecutar una instuccion SQL como promesa
 * @param {Object} conn  conexion con la Bd
 * @param {String} ssql  instruccion sql a ejecutar
 * @param {array} params  parametros de la instuccion sql
 */
ConnBd.ejecutarSqlPromise = (conn, ssql, params) => {
  return new Promise((resolve, reject) => {
    let parametros = params || [];
    conn.execute(ssql, parametros, { resultSet: true }, (err, results) => {
      if (err) {
        //console.error(err.message);
        reloj.timeStop();
        ConnBd.closeRs(conn, results);
        ConnBd.close(conn);
        // return;
        reject(err.message);
      }
      resolve(results);
    });
  });
};

/**
 * Obtener bloques de registros de la consulta realizada. Devuelve un array como promesa con
 * los registros recuperados.
 * @param {Object} conn conexion con la Bd
 * @param {Objeto} results recorset devuelto en la consulta
 * @param {Integer} numRows cantidad de registros a recuperar por bloqueen cada llamada.
 *                          Si numRows es null, por defecto se establecen bloques de 250 filas
 */
ConnBd.getAllRows = (conn, results, numRows) => {
  let iRowsAffec = 0,
    arrayData = []; //array para almacenar los arrays de registros recuperados en cada bloque
  numRows = numRows || 250;
  return new Promise((resolve, reject) => {
    function _getF(conn, results, numRows) {
      results.resultSet.getRows(numRows, function(err, rows) {
        //obtener el bloque de registros
        if (err) {
          //si se produce un error
          console.error(err.message);
          ConnBd.closeRs(conn, results); //cerrar el recordset
          ConnBd.close(conn); //cerrar la conexion
          reloj.timeStop(); //parar el reloj
          return;
        } else if (rows.length > 0 || iRowsAffec > 0) {
          //cuando hay datos en la consulta o cuando ya hay filas recuperadas
          arrayData.push(rows); //guardar el bloque de registros en el array
          iRowsAffec += rows.length; //filas recuperadas

          mensaje = " Recibiendo datos ...... recibidos: " + iRowsAffec;
          reloj.setMensaje(mensaje); //definir un nuevo mensaje
          reloj.getMensaje(); //mostrar el mensaje

          if (rows.length === numRows) {
            //realizar una ultima comprobacion por si hay mas registros que el bloque definido
            _getF(conn, results, numRows);
          } else {
            //cuando finaliza la recuperacion de datos
            console.log("   Registros recuperados:", iRowsAffec);
            ConnBd.closeRs(conn, results); //cerrar el recordset
            ConnBd.close(conn); //cerrar la Bd
            reloj.timeStop();
            resolve({ arrayData: arrayData, iRowsAffec: iRowsAffec }); //devolucion del objeto con los datos y las filas recuperadas
          }
        } else {
          //cuando no hay datos en la consulta
          console.log("<<<< No hay datos para la consulta planteada >>>>");
          reloj.timeStop();
          ConnBd.closeRs(conn, results);
          ConnBd.close(conn);
        }
      });
    }
    _getF(conn, results, numRows); //inicio de la recuperacion de los datos
  });
};

/**
 * Obtener los nombre de los campos utilizados en la consulta. Devuelve un array como
 * promesa con los nombres de los campos
 * @param {Objeto} conn conexion a la base de datos
 * @param {Objeto} results recordset devuleto en la consulta
 */
ConnBd.getCabecera = (conn, results) => {
  return new Promise((resolve, reject) => {
    let arrayHeader = [],
      cabecera = results.resultSet.metaData;
    // console.log(cabecera);

    arrayHeader = cabecera.map(item => {
      return { header: item.name, key: item.name };
    });
    resolve(arrayHeader);
  });
  //console.log(arrayHeader);
};

module.exports = ConnBd;
