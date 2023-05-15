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
        url: 'http://localhost:5000/signup',
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
        url: 'http://localhost:5000/login',
        method: 'POST',
        data: {
          email: email,
          password: password
        }
      }).done(function (response) {
        $('#signupMessage').text(response.message).show();
      }).fail(function (response) {
        $('#signupMessage').text(response.responseJSON.error).show();
      });
    });
  });
  