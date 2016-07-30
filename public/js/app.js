$(function() {

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
            $('#makers').html('<ul></ul>');
            makers.forEach(function(maker) {
              $('#makers ul').append('<li>' + maker.name + '</li>');
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
            $('#currently-checked-in').html('<ul></ul>');
            makers.forEach(function(maker) {
              $('#currently-checked-in ul').append('<li>' + maker.name + '</li>');
            });
          }
        }
      }
    });
  }
  getMakers();
  window.setInterval(getMakers, 10000);

  getCurrentlyCheckedIn();
  window.setInterval(getCurrentlyCheckedIn, 1000);
});
