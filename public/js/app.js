$(function() {

  function getMakers() {
    console.log('ajax');
    $.ajax({
      method: 'GET',
      dataType: 'json',
      url: '/makers.json',
      success: function(makers) {
        if (Array.isArray(makers)) {
          if (makers.length === 0) {
            $('#makers').html('<p class="text-muted">No one has checked in.</p>');
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
  window.setInterval(getMakers, 1000);
});
