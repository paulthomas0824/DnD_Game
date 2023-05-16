$(document).ready(function () {
  // Handle signup
  $('#signup-form').on('submit', function (event) {
    event.preventDefault();

    var email = $('#email').val();
    var password = $('#password').val();

    console.log({
      email: email,
      password: password
    }); // Log the data being sent

    $.ajax({
      url: 'https://obscure-scrubland-76830.herokuapp.com/signup',
      method: 'POST',
      data: JSON.stringify({
        email: email,
        password: password
      }),
      contentType: "application/json"
    }).done(function (response) {
      $('#signupMessage').text(response.message).show();
    }).fail(function (response) {
      $('#signupMessage').text(response.responseJSON.error).show();
    });
  });

  // Handle login
  $('#login-form').on('submit', function (event) {
    event.preventDefault();
  
    var email = $('#login-email').val();
    var password = $('#login-password').val();
  
    console.log({
      email: email,
      password: password
    }); // Log the data being sent
  
    $.ajax({
      url: 'https://obscure-scrubland-76830.herokuapp.com/login',
      method: 'POST',
      data: JSON.stringify({
        email: email,
        password: password
      }),
      contentType: "application/json"
    }).done(function (response) {
      $('#signupMessage').text(response.message).show();
      alert('Logged in successfully');
      window.location.href = 'index.html';
    }).fail(function (response) {
      $('#signupMessage').text(response.responseJSON.error).show();
    });
  });
  
  

});