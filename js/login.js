var socket = io();
var username;
$(function () {
  $('#chat').hide()
  

  // input user name
  // Prevents input from having injected markup
  const cleanInput = (input) => {
    return $('<div/>').text(input).html();
  }
  const setUsername = () => {
    username = cleanInput($('#usernameInput').val().trim());

    // If the username is valid
    if (username) {
      $('.login').fadeOut();
      $('#chat').show();
      $(window).off('keydown');
      // $currentInput = $inputMessage.focus();

      // Tell the server your username
      socket.emit('add user', username);
    }
  }

  $(window).keydown((event) => {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $('#usernameInput').focus();
    }
    if (event.which == 13) {
      setUsername()
    }
  })




})