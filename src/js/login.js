document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const emailOrPhone = document.getElementById('emailOrPhone').value.trim();
    const password = document.getElementById('password').value.trim();
  
    // Basic validation
    if (!emailOrPhone) {
      alert('Please enter your email or phone.');
      return;
    }
  
    if (!password) {
      alert('Please enter your password.');
      return;
    }
  
    // Optional: More advanced validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/; // Example: 10-digit phone number
  
    if (emailOrPhone.includes('@')) {
      if (!emailPattern.test(emailOrPhone)) {
        alert('Please enter a valid email address.');
        return;
      }
    } else if (!phonePattern.test(emailOrPhone)) {
      alert('Please enter a valid phone number.');
      return;
    }
  
    // Function to check user credentials in localStorage
    const checkLocalStorage = () => {
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        const userData = JSON.parse(storedUserData);
        if ((userData.email === emailOrPhone || userData.phone === emailOrPhone) && userData.password === password) {
          return true;
        }
      }
      return false;
    };
  
    // Check localStorage first
    if (checkLocalStorage()) {
      alert('Logged in successfully!');
      window.location.href = 'index.html'; // Redirect to index.html
      return;
    }
  
    // If not stored, fetch from API using GET request
    try {
      const response = await fetch(`https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users?email=${encodeURIComponent(emailOrPhone)}&password=${encodeURIComponent(password)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
  
      if (data && (data.email === emailOrPhone || data.phone === emailOrPhone) && data.password === password) {
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data));
        alert('Logged in successfully!');
        window.location.href = 'index.html'; // Redirect to index.html
      } else {
        alert('Invalid credentials.');
      }
    } catch (error) {
      alert('Login failed!');
      console.error('Error:', error);
    }
  });
  