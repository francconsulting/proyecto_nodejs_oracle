module.exports = function(socket) {
  //You can declare all of your socket listeners in this file, but it's not required

  // socketMVC.emit('emit1', {message: 'en emit 1'})

  socket.emit("emit1", { message: "emit1 de sockect.IO en socket.js" });
};
