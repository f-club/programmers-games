//
//
//

const Game = require('core/game');
const Events = require('../');

function init(socket, io, cb) {

  cb = cb || function() {};

  socket.on('init', function(game, fn) {

    // TODO better error handling
    if (!game || !game.game_uuid || !game.gamer_uuid) {
      console.log("=> [socket] [err] low args");
      return;
    }

    console.log(`<= [socket] [init] / game_uuid => ${game.game_uuid} / user_uuid => ${game.gamer_uuid}`);

    Game.add_gamer(game.game_uuid, game.gamer_uuid, function(err, status) {

      if (err) {
        return Events.err(socket, err);
      }

      // start the game!
      if (status.users_n == 3) {
        Events.start(socket, io, game.game_uuid);
      }

      // save users data on socket id
      global.fighters[socket.id] = {
        game_uuid: game.game_uuid,
        user_uuid: game.gamer_uuid
      };

      socket.join(game.game_uuid);
      socket.emit('confirm');

      if (status.add) {
        console.log(`=> [socket] [confirm] / game_uuid => ${game.game_uuid} / user_uuid => ${game.gamer_uuid}`);
      }

      if (status && status.exists) {
        console.log(`=> [socket] [confirm] [exists] / game_uuid => ${game.game_uuid} / user_uuid => ${game.gamer_uuid}`);
        Events.info(socket, null, 'you reconnect to this game.');
      }
    });
  });
}

module.exports = init;
