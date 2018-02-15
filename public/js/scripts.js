$("title").html("prueba de cambio de titulo");

$(document).ready(function() {

   var t = crearTabla();
  


  $("input[type=submit]").on("click", function(evt) {


    evt.preventDefault();
    // console.log(evt);
    $("#btnEnviar").attr("disabled", true);
    $("#resultado").html("Iniciando la descarga....");

    $(document).ajaxSend(function(evt, jqxhr, opt) {
      //console.log(evt);
      // $("#resultado").html("ajaxSend");
    });
    $(document).ajaxStart(function(evt, jqxhr, opt) {
      //console.log(evt);
     // $("#error").html("Iniciando...");
      $("#resultado").html("ajaxStart");
    });

    /*var intervalId = setInterval(function() {
      callAjax(
        "http://localhost:3001/prueba",
        function(data) {
          //console.log("-----", data);
          data = JSON.parse(data);
          //callAjax("http://localhost:3001/tdcs")
          if (data.registros == "undefined") {
            data.registros = 0;
          }

          $("#error").html(
            "Recibidos hasta ahora.... " + data.registros + " registros."
          );
          $("#resultado").html(data.datos);
        },
        null,
        "POST",
        "HTML"
      );
    }, 500);*/

    callAjax("http://localhost:3001/tdcs", printTabla, null, "post", "html")
      .done(function() {
        //$("#resultado").prepend("Preparando resultados");
        $("#btnEnviar").attr("disabled", false);
      })
      .done(function() {
        // clearInterval(intervalId);
        //$("#resultado").append("Desde otro DONE");
      })
      .fail(function(jqXHR, textStatus, errorThrown) {
        $("#error")
          .addClass("error")
          .text(
            "Se ha producido un error:" +
              jqXHR.status +
              " " +
              jqXHR.statusText +
              " -ESTATUS: " +
              textStatus +
              "- ERRORTHROWN: " +
              errorThrown
          ); //si hay algun error en la llamada muestra un mensaje
        if (jqXHR.status === 0) {
          alert("Not connect: Verify Network.");
        } else if (jqXHR.status == 404) {
          alert("Requested page not found [404]");
        } else if (jqXHR.status == 500) {
          alert("Internal Server Error [500].");
        } else if (textStatus === "parsererror") {
          alert("Requested JSON parse failed.");
        } else if (textStatus === "timeout") {
          alert("Time out error.");
        } else if (textStatus === "abort") {
          alert("Ajax request aborted.");
        } else {
          alert("Uncaught Error: " + jqXHR.responseText);
        }
      });

    /* var promise = doSomething();
    promise.progress(function(prog) {
      console.log(prog);
      $("#resultado").prepend("Desde otro>>>>> DONE>>: ", prog);
    });*/
  });

  function printTabla(datos) {
    // $("#resultado").html(datos);
  }

  $("h1").text("TDC Vivos");
  var fechaHora;
  function doSomething() {
    var dfd = $.Deferred();
    var count = 0;
    /* var intervalId = setInterval(function() {
      // dfd.notify(count++);
      fechaHora = new Date();
      dfd.notify(
        $("#resultado").html(fechaHora)
      );
      count++
      count > 15 && clearInterval(intervalId);
    }, 1000);*/

    for (let index = 0; index < 10; index++) {
      dfd.notify($("#resultado").html("hola;"));
    }
    $("#error").html("ksksksk");
    /* dfd.notify(
      $("#resultado").html(count)
    );*/
    return dfd.promise();
  }

  /*var socket = io.connect("http://localhost:3001");
  socket.on("emit2", function(data) {
    console.log(data);
    socket.emit("message", "hello from the browser");
  });*/

  (function(io) {
    "use strict";
    var io = io();
    io.on("emit2", function(data) {
      console.log(data);
      $("#error").html(data.message);

      // document.getElementById("hello").innerHTML = data.message;
      io.emit("mi_event_desde_cliente", { nombre: "fm", apellidos: "bv" });
    });
    io.on("filasAfectadas", function(data) {
      console.log(data.datos);
      mostrarDatos(data.datos);
     // $("#resultado").html(data.datos);
      $("#error").html(data.message);
    });
    io.on("emit1", function(data) {
      console.log(data.message);
      $("#error").html(data.message);
    });
    io.on('dataset', function(data){
      dataSet(data)
    })
  })(io); //io del parametro => lo lee de dentro de /socket.io/socket.io.js


  function crearTabla(dataset){
   var t =  $('#tabla').DataTable({
      "language": {
        "url": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Spanish.json",
      },
      "data": dataset,
      "destroy": true
    });
    return t;
  }

  function mostrarDatos(data){
    t.rows().remove()
    var i = 1,
        parar = false;
   // $("#resultado").html("");
    //  console.log(data)
      console.log(parar)
      data.forEach(element => {
       // console.log(element)
      //  t.rows.add(element)
        element.forEach(e => {
        //  console.log(e)
          //$("#resultado").append(i +  "-. " + e+"<br/>")
         // console.log(i)
          if (i < 50){
          t.row.add([i, e[0], e[1], e[2], e[3], e[4], e[5]]).draw(true)
        }
          i++;
        });
     
        console.log("----",i)
      });

      
  }
  
  function dataSet(datos){
    //console.log(JSON.stringify(datos.datos[0]))
    //console.log(datos.datos.length)
    var misDatos = []
    datos.datos.forEach(function(element){
      console.log(element)
      element.forEach(function(e){
        misDatos.push(e)
      })
    } ) 
    console.log(misDatos.length)
    crearTabla(misDatos)
  }

});
