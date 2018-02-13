module.exports = function (socket) {
    //You can declare all of your socket listeners in this file, but it's not required 
 
   

   // socketMVC.emit('emit1', {message: 'en emit 1'})
    socketMVC.on('emit2', function(data){
        console.log('aquiiiiiiiiiiiiiiiiii')
      });
};