document.querySelector('#signup-form').addEventListener('submit', (event) => {
    event.preventDefault();

    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    fetch('https://obscure-scrubland-76830.herokuapp.com/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, password: password }),
    })
    .then(response => response.text())
    .then(data => {
        if(data === 'User created') {
            // Clear the form
            document.querySelector('#email').value = '';
            document.querySelector('#password').value = '';

            // Display the message
            let messageContainer = document.querySelector('#signupMessage');
            messageContainer.innerText = 'Thank you for signing up!';
            messageContainer.style.display = 'block';
        }
    })
    .catch((error) => {
        console.error('Error:', error); // Handle error
    });
});

// Add this below the sign up form submission handler

const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const response = await fetch('https://obscure-scrubland-76830.herokuapp.com/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    if (response.status === 200) {
        const token = await response.text();
        localStorage.setItem('auth-token', token);
        window.location.href = 'index.html';
    } else {
        alert('Incorrect email or password');
    }
});
