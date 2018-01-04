/**
 * ejecutar siempre esto en la ventana donde se inicia node
 *  export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH
 */

var oracledb = require("oracledb"),
  dbConfig = require("./dbconfig.js"),
  fs = require("fs"),
  json2xls = require("json2xls"),
  reloj = require("./reloj");

oracledb.outFormat = oracledb.ARRAY;
oracledb.poolMax = 4;
oracledb.poolPingInterval = 60;

var conectar = function(cb) {
  oracledb.getConnection(
    {
      user: dbConfig.user,
      password: dbConfig.password,
      connectString: dbConfig.connectString,
      stmtCacheSize: 2000
    },
    cb
  );
};

var tdcs = (err, conn) => {
  ssql = "select * FROM GIGA_OWNER.t_gg_F_tdc TDC where rownum < 5 ";
  conn.execute(ssql, [], { resultSet: true }, (err, results) => {
    if (err) {
      console.error(err.message);
      return;
    }
    var queryStream = results.resultSet.toQueryStream();
    queryStream.on("data", function(row) {
      console.log(row);

      var xls = json2xls(row);
      //fs.writeFileSync('dataToqueryString.xlsx', xls, 'binary')
    });
    queryStream.on("end", function() {
      console.log("en fin");
      // results.resultSet.close()
    });
  });
};

conectar(tdcs);
