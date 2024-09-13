document.getElementById('registrationForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const phoneNumber = document.getElementById('phoneNumber').value;
  const dateOfBirth = document.getElementById('dateOfBirth').value;

  const userData = {
    fullName: fullName,
    email: email,
    password: password,
    phone: phoneNumber,
    dateOfBirth: dateOfBirth
  };

  fetch('https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  })
  .then(response => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Failed to register user');
    }
  })
  .then(data => {
    console.log('Success:', data);
    alert('Registration successful!');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Registration failed!');
  });
});
