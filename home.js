document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    fetch('https://obscure-scrubland-76830.herokuapp.com/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        document.getElementById('signupMessage').innerText = data.message;
        document.getElementById('signupMessage').style.display = 'block';
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});

document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    var email = document.getElementById('login-email').value;
    var password = document.getElementById('login-password').value;

    fetch('https://obscure-scrubland-76830.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
});
