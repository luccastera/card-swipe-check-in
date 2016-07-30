$(function() {

  function getUrlParameter(sParam) {
    var sPageURL = decodeURIComponent(window.location.search.substring(1)),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;

    for (i = 0; i < sURLVariables.length; i++) {
      sParameterName = sURLVariables[i].split('=');

      if (sParameterName[0] === sParam) {
        return sParameterName[1] === undefined ? true : sParameterName[1];
      }
    }
  }


  function getMakers() {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: '/makers.json',
      success: function(makers) {
        if (Array.isArray(makers)) {
          if (makers.length === 0) {
            $('#makers').html('<p class="text-muted">No one has registered.</p>');
          } else {
            $('#makers').html('<ul class="list-group"></ul>');
            makers.forEach(function(maker) {
              $('#makers ul').append('<li class="list-group-item">' + maker.name + '</li>');
            });
          }
        }
      }
    });
  }
  function getCurrentlyCheckedIn() {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: '/checkedin_makers.json',
      success: function(makers) {
        if (Array.isArray(makers)) {
          if (makers.length === 0) {
            $('#currently-checked-in').html('<p class="text-muted">No one has checked in.</p>');
          } else {
            $('#currently-checked-in').html('<ul class="list-group"></ul>');
            makers.forEach(function(maker) {
              $('#currently-checked-in ul').append('<li class="list-group-item">' + maker.name + '</li>');
            });
          }
        }
      }
    });
  }

  function getCheckins() {
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: '/checkins.json',
      success: function(checkins) {
        if (Array.isArray(checkins)) {
          if (checkins.length === 0) {
            $('#checkins').html('<p class="text-muted">No checkins yet.</p>');
          } else {
            $('#checkins').html('<ul class="list-group"></ul>');
            checkins.forEach(function(maker) {
              var str = '<li class="list-group-item">' + maker.name;
              if (maker.start_time != null) {
                str += ' <span class="checkin-time">checked in ' + moment(maker.start_time).fromNow() + '</span>'
              }
              if (maker.end_time != null) {
                str += ' and ';
                str += ' <span class="checkin-time">checked out ' + moment(maker.end_time).fromNow() + '</span>'
              }
              str += '</li>';

              $('#checkins ul').append(str);
            });
          }
        }
      }
    });
  }

  if (window.location.pathname === '/') {
    getMakers();
    window.setInterval(getMakers, 10000);

    getCurrentlyCheckedIn();
    window.setInterval(getCurrentlyCheckedIn, 1000);

    getCheckins();
    window.setInterval(getCheckins, 1000);
  } else if (window.location.pathname === '/register') {
    var cardId = getUrlParameter('card_id');
    if (cardId !== '') {
      $('#card_id').val(cardId);
    }
  }

  var socket = io();
  socket.on('register-card', function(msg){
    window.location = '/register?card_id=' + msg;
  });
});
