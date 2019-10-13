const FADE_TIME = 150; // ms
const TYPING_TIMER_LENGTH = 400; // ms
var $messages = $('#messages'); // Messages area
$(function () {

  //  log message 

  // Adds a message element to the messages and scrolls to the bottom
  // el - The element to add as a message
  // options.fade - If the element should fade-in (default = true)
  // options.prepend - If the element should prepend
  //   all other messages (default = false)
  const addMessageElement = (el, options) => {
    var $el = $(el);

    // Setup default options
    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    // Apply options
    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    // scroll to the newest message 
    $messages.scrollTop($messages[0].scrollHeight);
    // window.scrollTo(0, $messages[0].scrollHeight);
   
  }

  // Log a message
  const log = (message, options) => {
    var $el = $('<li>').addClass('log').text(message);
    addMessageElement($el, options);
  }

  const addParticipantsMessage = (data) => {
    var message;
    if (data.numUsers === 1) {
      message = "there's 1 participant";
    } else {
      message = "there are " + data.numUsers + " participants";
    }
    log(message);
  }

  socket.on('login', (data) => {
    log("Hello " + username + ", let's chat about weather", {
      prepend: true
    });
    addParticipantsMessage(data);

    $(window).keydown(event => {
      // Auto-focus the current input when a key is typed
      if (!(event.ctrlKey || event.metaKey || event.altKey)) {
        $('#inputMessage').focus();
      }
      // When the client hits ENTER on their keyboard
      if (event.which == 13) {
        sendMessage()
      }
    });

  })

  // Whenever the server emits 'user left', log it in the chat body
  socket.on('user left', (data) => {
    log(data.username + ' left');
    addParticipantsMessage(data);
  });

  // Whenever the server emits 'user joined', log it in the chat body
  socket.on('user joined', (data) => {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });


  const sendMessage = () => {
    socket.emit('send message', $('#inputMessage').val());
    $('#inputMessage').val('');
  }


  // two ways to send message.
  $('#sendmessage').click(sendMessage);


  socket.on('new message', function (data) {
    let msg = data.message;
    let $el = $('<li>')
    if (username == data.username) {
      $el.addClass('right');
    } else {
      $el.addClass('left');
    }
    $el.html(`
      <div>
        <span>${data.username}</span>
        <p>${msg}</p>
      </div>
    `)
    addMessageElement($el)
    
  });
});