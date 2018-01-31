$("title").html("prueba de cambio de titulo");
$(document).ready(function() {
  $("input[type=submit]").on("click", function(evt) {
    evt.preventDefault();
    // console.log(evt);
    $("#resultado").html("Iniciando la descarga....");
   
    $(document).ajaxSend(function(evt, jqxhr,opt){
      console.log(evt)
      $("#resultado").html('ajaxSend')
    })
    $(document).ajaxStart(function(evt, jqxhr,opt){
      console.log(evt)
      $("#resultado").html('ajaxStart')
    })
    
    callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html")
    .done(function(){$("#resultado").prepend('Desde otro DONE1')})
    .done(function(){ $("#resultado").append('Desde otro DONE2')})



    var promise = doSomething(); 
    promise.progress(function(prog) { 
      console.log(prog);
      $("#resultado").prepend('Desde otro DONE: ',prog) 
    })
  })
  


  function printTabla(datos) {
    $("#resultado").html(datos);
  }
  $("h1").text("TDC Vivos");



  function doSomething() { 
    var dfd = $.Deferred(); 
    var count = 0; 
    var intervalId = setInterval(function() { 
     // dfd.notify(count++); 
      count > 5 && clearInterval(intervalId); 
    }, 500); 
    dfd.notify(callAjax("http://localhost:3000/tdcs", printTabla, null, "post", "html"))
    return dfd.promise(); 
  }; 
  
 


});
  

