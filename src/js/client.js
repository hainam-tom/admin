document.addEventListener('DOMContentLoaded', () => {
    async function fetchAndStoreUsers() {
        try {
            // Check if the data is already stored in localStorage
            let storedUsers = localStorage.getItem('users');
            
            if (!storedUsers) {
                // Fetch user data from API if not in localStorage
                const response = await fetch('https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users');
                const users = await response.json();
                
                // Store the fetched data in localStorage as a string
                localStorage.setItem('users', JSON.stringify(users));

                // Update the storedUsers variable to use below
                storedUsers = localStorage.getItem('users');
            }

            // Parse the stored data from localStorage
            const users = JSON.parse(storedUsers);

            // Get the tbody element
            const tbody = document.querySelector('#datatablesSimple tbody');

            // Check if tbody exists
            if (!tbody) {
                throw new Error("Tbody element not found.");
            }

            // Clear the tbody (optional)
            tbody.innerHTML = '';

            // Loop through the user data and create table rows
            users.forEach(user => {
                const row = document.createElement('tr');

                // Create table cells for each user property
                const idCell = document.createElement('td');
                idCell.textContent = user.id;

                const fullNameCell = document.createElement('td');
                fullNameCell.textContent = user.fullName;

                const emailCell = document.createElement('td');
                emailCell.textContent = user.email;

                const phoneCell = document.createElement('td');
                phoneCell.textContent = user.phone;

                const dobCell = document.createElement('td');
                dobCell.textContent = user.dateOfBirth;

                const passwordCell = document.createElement('td');
                passwordCell.textContent = user.password;

                // Append the cells to the row
                row.appendChild(idCell);
                row.appendChild(fullNameCell);
                row.appendChild(emailCell);
                row.appendChild(phoneCell);
                row.appendChild(dobCell);
                row.appendChild(passwordCell);

                // Append the row to the tbody
                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching or displaying user data:', error);
        }
    }

    // Call the function after DOM is loaded
    fetchAndStoreUsers();

    // Add event listener to the reload button
    const reloadButton = document.getElementById('reloadButton');
    reloadButton.addEventListener('click', () => {
        // Clear localStorage to force API reload
        localStorage.removeItem('users');
        
        // Fetch and display fresh data
        fetchAndStoreUsers();
    });
});
