$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
    evt.preventDefault();
    // console.log(evt);
    $("#resultado").html("Iniciando la descarga....");

    $(document).ajaxSend(function(evt, jqxhr, opt) {
      //console.log(evt);
      $("#resultado").html("ajaxSend");
    });
    $(document).ajaxStart(function(evt, jqxhr, opt) {
      //console.log(evt);
      $("#resultado").html("ajaxStart");
    });
    var intervalId = setInterval(function() {
      callAjax("http://localhost:3001/prueba", function(data){
        console.log(data)
        //callAjax("http://localhost:3001/tdcs")
        if (data!= 'undefined'){ data =  data } else{data = 0}
        $("#error").html('Recibidos hasta ahora.... '+data+' registros.')
      }, null, "POST","HTML")
      
    },1000);
  
    callAjax("http://localhost:3001/tdcs", printTabla, null, "post", "html")
      .done(function() {
        $("#resultado").prepend("Desde otro DONE");
      })
      .done(function() {
        clearInterval(intervalId);
        $("#resultado").append("Desde otro DONE");
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
     

     var promise = doSomething(); 
    promise.progress(function(prog) { 
      console.log(prog);
      $("#resultado").prepend('Desde otro>>>>> DONE: ',prog) 
    })
  });

  function printTabla(datos) {
    $("#resultado").html(datos);
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
    dfd.notify(
      $("#resultado").html('hola;')
    );
     
   }
   /* dfd.notify(
      $("#resultado").html(count)
    );*/
    return dfd.promise();
  }
});
