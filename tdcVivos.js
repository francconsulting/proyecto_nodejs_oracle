
/**
 * ejecutar siempre esto en la ventana donde se inicia node
 *  export LD_LIBRARY_PATH=/opt/oracle/instantclient:$LD_LIBRARY_PATH 
 */

var oracledb = require('oracledb'),
    fs = require('fs'),
        Excel = require('exceljs'),
    json2xls = require('json2xls'),
    reloj = require('./reloj'),
    rowsExcelEach = 200,
    mensaje = '',
    xls = null;

    oracledb.outFormat = oracledb.ARRAY;
    oracledb.poolMax = 4;
    oracledb.poolPingInterval = 60;     // seconds para comprobar las conexiones

//var dbConfig = require('./dbconfig.js');


oracledb.getConnection(
  {
    user          : dbConfig.user,
    password      : dbConfig.password,
    connectString : dbConfig.connectString,
    stmtCacheSize : 2000
  },
  function(err, connection)
  {
    if (err) {
      console.error(err.message);
      return;
    }
    mensaje = 'Esperando datos.....'
    reloj.setMensaje(mensaje)
    reloj.timeStart()
   
  
   
    console.log('Connection was successful!');
    var ssql = "SELECT     /*+ FULL(TDC) PARALLEL(TDC, 4) */ "
    ssql += " TDC.DISTRIBUIDORA, "
    ssql += " TDC.CEMPTITU, "
    ssql += " SUBSTR ('00000' || TDC.cemptitu,-5,5) ||'-'|| SUBSTR ('000000000000'||TDC.CONTREXT,-12,12)||'-'||SUBSTR ('000'||TDC.csecutdc,-3,3) as CODTDC, "
    ssql += " TDC.FGENETDC AS fecha_gener_tdc, "
    ssql += " TDC.FULCBEST AS Fecha_ult_cambio_estado,     TDC.FCUMPTDC AS fecha_cumplimentacion_tdc, "
    ssql += " TDC.FEJECTDC AS fecha_eje_tdc,    TDC.FFINATDC AS fecha_fin_tdc, "
    ssql += " TDC.ccounips, TDC.cupsree,    TDC.contrext,     TDC.cfinca,    TDC.cptoserv,    TDC.cderind,    TDC.ctarifa,     TDC.vpotppal,     TDC.TESTTDC, "
    ssql += " TDC.DELEMTAB_ESTADO AS desc_estado_tdc, "
    ssql += " TDC.CORIGTDC AS cod_origen_tdc, "
    ssql += " TDC.DELEMTAB_ORIGEN AS desc_origen_tdc, " 
    ssql += " TDC.CTIPOTDC AS cod_tipo_tdc, "
    ssql += " TDC.DELEMTAB_TIPO AS desc_tipo_tdc, "
    ssql += " TDC.CMOTITDC AS cod_motivo_tdc, " 
    ssql += " TDC.DELEMTAB_MOTIVO AS desc_motivo_tdc, "
    ssql += " TDC.TINDAVI AS cod_indicativo_aviso,  "
    ssql += " TDC.DELEMTAB_AVISO AS des_indicat_aviso, "
    ssql += " TDC.CMOTITIP, "  
    ssql += " TDC.DELEMTAB_MOTTIP, " 
    ssql += " TDC.DESCRTDC, " 
    ssql += " TDC.CUNIEJEC as cod_UE, TDC.DUNIEJEC as desc_UE,  "
    ssql += " TDC.CZONAUE_T8UUEE as cod_zonaUE, TDC.DZONA_T8UUEE as desc_zonaUE, "
    ssql += " TDC.CSUBZONA_T8UUEE as cod_subzonaUE, TDC.DSUBZONA_T8UUEE as desc_subzonaUE," 
    ssql += " SUBSTR('0'||EXTRACT (DAY FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')),-2,2)||'/'|| SUBSTR('0'||EXTRACT (MONTH FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')),-2,2) || '/'|| EXTRACT (YEAR FROM TO_DATE(TDC.FLIMCONT,'YYYYMMDD')) AS Fecha_Lim_Contr_TDC, "
    ssql += " TDC.VDIASCN AS Dias_trans_Plazo_Contr_TDC, "
    ssql += " TDC.VNUMPZCN AS Dias_para_Plazo_Contr_TDC, "
    ssql += " ( "
    ssql += " SELECT to_char(FTIMESTP, 'DD/MM/YYYY HH24:MI:SS') || ' - ' || replace(replace(Trim(REPLACE(DCOMENLA,'\"','`')),chr(10),''),chr(13),'') AS COMENT_DIANA FROM "
    ssql += " ( "
    ssql += " SELECT * FROM GIGA_OWNER.T8COENT  WHERE TOBJDIAN = 898  AND distribuidora = TDC.distribuidora AND CEMPTITU = TDC.CEMPTITU AND CODIGTDC =  TDC.CODIGTDC AND CSECUTDC = TDC.CSECUTDC  AND NOT DCOMENLA IS NULL   " 
    ssql += " ORDER BY FTIMESTP DESC "
    ssql += " ) "
    ssql += " where rownum = 1 "
    ssql += " ) AS ULTIMO_COMENTARIO_DIANA "
    ssql += " FROM GIGA_OWNER.t_gg_F_tdc TDC "
    ssql += " WHERE "
    ssql += " TDC.TESTTDC NOT IN (6,7,10)  "
    ssql += " AND TDC.CLINNEG = 1 "
    //ssql += " and rownum < 100 and tdc.distribuidora = 'JZZ' ";
   // ssql = "select * FROM GIGA_OWNER.t_gg_F_tdc TDC where rownum < 100 "
  ;



 // var initTime =setInterval(() => {
 //   console.log(reloj());
//  }, 1000)reloj.timeShow()
   var stream = connection.queryStream(ssql)
    var rstData = [],
        rstHeader = [],
        iCon = 0, 
        iElem = 0,
        cabecera = '',
        datos = ''

    stream.on('metadata', function(metadata){
     // console.log(JSON.stringify(metadata))
     // console.log(metadata.length)
     
     
      metadata.forEach(element => {
      //  console.log(element)
        cabecera += element.name +","
        rstHeader.push(element.name)
      });
      rstData.push(rstHeader)
      cabecera = cabecera.substring(0, cabecera.length-1)
     
      //console.log(rstHeader)
      cabecera = cabecera + '\n'
      
     
     /* fs.writeFile('cabecera.txt', '', function (err) {
          if (err) throw err;
          console.log('Creado en fichero');
      });*/
    })
    
    stream.on('data', function(data){
   
  //    console.log(JSON.stringify(data))
     // console.log(iCon++)
    // console.log(data)
    // data.forEach(element => {
  //     console.log(data.length)
  //    datos += data[iElem] + "|"
  //      console.log(iElem++, element)
  //datos = iCon + "|" +data[0] +"|"+data[1]+"|"+data[2]+"|"+data[3]+"|"+data[4] + "\n" 
    
  //console.log(datos)
     //  datos += element+"|"
       
     /*  if (data.length == iElem+1){
        datos += "\n"
        iElem = 0
       }*/
       
    // });
   
        iCon++
        mensaje = 'Recibiendo datos ...... Num. registros recibidos: '+ iCon
        reloj.setMensaje(mensaje)
        console.log(reloj.getMensaje())

     
     //console.log(datos)
    // console.log('######################')
    // console.log(data)
     rstData.push(data)
   
     //console.log('######################')
     if (iCon % rowsExcelEach == 0) {
       // if (xls == null) {
            xls = json2xls(rstData)
        //}
        fs.writeFile('data.xlsx',xls, 'binary')
     }
    })  

    stream.on('end', function () {
     
        console.log('-------------------')
        console.log('Creando fichero ..........')
        xls = json2xls(rstData)
        fs.writeFile('data.xlsx',xls, 'binary')
      reloj.timeStop()
      doRelease(connection);
      console.log('Finalizado')
    })  


    stream.on('error', function (err) {
        console.log(err);
       doRelease(connection);
       console.log('Finalizado');
       return
     })  
   
    //console.log(ssql)
  /*  connection
      .execute(ssql ,  
      [],
      {
        resultSet: true,
        prefetchRows: 25
      }, 
      function(err, rst){
    
       if(err){
         console.error(err.message);
        
          doRelease(connection);
          return;
       }
       else{
         var iCon = 0
        var queryStream = rst.resultSet.toQueryStream();
        console.log(rst.metaData)
        queryStream.on('data', function(row) {
          console.log(queryStream)
          //console.log(row);
          console.log(iCon++)

        });

        queryStream.on('end', function(row) {
          console.log('Total de registros: ', iCon)
          doRelease(connection);
        });
        /*var rows = rst.resultSet.getRows(45,function(err, rows){
          console.log(rows.length)
        })*/
      //  console.log(rst.metaData); // [ { name: 'DEPARTMENT_ID' }, { name: 'DEPARTMENT_NAME' } ]
      //  console.log(rst.rows);     // [ [ 180, 'Construction' ] ]
     // console.log(rst.rows.length)


    //    doRelease(connection);
/*       }
    })
 */  
    connection.close(
      function(err)
      {
        if (err) {
          console.error(err.message);
          return;
        }
      });
  });

// Note: connections should always be released when not needed
function doRelease(connection)
{
  connection.close(
    function(err) {
      if (err) {
        console.error(err.message);
      }
    });
}