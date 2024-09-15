document.addEventListener('DOMContentLoaded', () => {
    // Fetch and store users from API or local storage
    async function fetchAndStoreUsers() {
        try {
            let storedUsers = localStorage.getItem('users');
            
            if (!storedUsers) {
                const response = await fetch('https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users');
                const users = await response.json();
                localStorage.setItem('users', JSON.stringify(users));
                storedUsers = localStorage.getItem('users');
            }

            const users = JSON.parse(storedUsers);
            const tbody = document.querySelector('#datatablesSimple tbody');

            if (!tbody) throw new Error("Tbody element not found.");

            tbody.innerHTML = ''; // Clear previous data

            users.forEach((user) => {
                const row = document.createElement('tr');

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

                // Create Edit button
                const ButtonCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('btn', 'btn-primary');
                editButton.addEventListener('click', () => openEditModal(user)); // Open edit modal
                ButtonCell.appendChild(editButton);

                // Create Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.addEventListener('click', () => deleteUser(user.id)); // Attach delete functionality
                ButtonCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(fullNameCell);
                row.appendChild(emailCell);
                row.appendChild(phoneCell);
                row.appendChild(dobCell);
                row.appendChild(passwordCell);
                row.appendChild(ButtonCell); // Append the button

                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching or displaying user data:', error);
        }
    }

    // Delete user function
    async function deleteUser(userId) {
        try {
            const response = await fetch(`https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users/${userId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                let storedUsers = JSON.parse(localStorage.getItem('users'));
                const updatedUsers = storedUsers.filter(user => user.id !== userId);
                localStorage.setItem('users', JSON.stringify(updatedUsers));
                fetchAndStoreUsers(); // Refresh the table after deletion
            } else {
                console.error('Failed to delete user from the API:', response.status);
            }
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    }

    // Open the edit modal and populate fields
    function openEditModal(user) {
        document.getElementById('editUserId').value = user.id;
        document.getElementById('editFullName').value = user.fullName;
        document.getElementById('editEmail').value = user.email;
        document.getElementById('editPhone').value = user.phone;
        document.getElementById('editDateOfBirth').value = user.dateOfBirth;
        document.getElementById('editPassword').value = user.password;

        document.getElementById('editUserModal').style.display = 'block'; // Show the modal
    }

    // Close the edit modal
    function closeEditModal() {
        document.getElementById('editUserModal').style.display = 'none'; // Hide the modal
    }

    // Save the edited user
    async function saveEditedUser(event) {
        event.preventDefault();

        const userId = document.getElementById('editUserId').value;
        const updatedUser = {
            id: userId,
            fullName: document.getElementById('editFullName').value,
            email: document.getElementById('editEmail').value,
            phone: document.getElementById('editPhone').value,
            dateOfBirth: document.getElementById('editDateOfBirth').value,
            password: document.getElementById('editPassword').value
        };

        try {
            const response = await fetch(`https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (response.ok) {
                let storedUsers = JSON.parse(localStorage.getItem('users'));
                const updatedUsers = storedUsers.map(user => user.id === parseInt(userId) ? updatedUser : user);
                localStorage.removeItem('users');
                localStorage.setItem('users', JSON.stringify(updatedUsers));

                fetchAndStoreUsers(); // Refresh the table
                closeEditModal(); // Close the modal
            } else {
                console.error('Failed to update user on the API:', response.status);
            }
        } catch (error) {
            console.error('Error updating user:', error);
        }
    }

    // Save the new user
    async function saveNewUser(event) {
        event.preventDefault();

        const newUser = {
            fullName: document.getElementById('createFullName').value,
            email: document.getElementById('createEmail').value,
            phone: document.getElementById('createPhone').value,
            dateOfBirth: document.getElementById('createDateOfBirth').value,
            password: document.getElementById('createPassword').value
        };

        try {
            const response = await fetch('https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newUser)
            });

            if (response.ok) {
                // Clear localStorage and reload users from API
                localStorage.removeItem('users');
                fetchAndStoreUsers(); // Refresh the table
                closeCreateModal(); // Close the modal
            } else {
                console.error('Failed to create user on the API:', response.status);
            }
        } catch (error) {
            console.error('Error creating user:', error);
        }
    }

    // Open the create user modal
    function openCreateModal() {
        document.getElementById('createUserModal').style.display = 'block'; // Show the modal
    }

    // Close the create user modal
    function closeCreateModal() {
        document.getElementById('createUserModal').style.display = 'none'; // Hide the modal
    }

    // Attach event listeners
    document.getElementById('createButton').addEventListener('click', openCreateModal);
    document.getElementById('createCancelButton').addEventListener('click', closeCreateModal);
    document.getElementById('createUserForm').addEventListener('submit', saveNewUser);

    document.getElementById('cancelButton').addEventListener('click', closeEditModal);
    document.getElementById('editUserForm').addEventListener('submit', saveEditedUser);

    const reloadButton = document.getElementById('reloadButton');
    reloadButton.addEventListener('click', () => {
        // Clear localStorage to force API reload
        localStorage.removeItem('users');
        
        // Fetch and display fresh data
        fetchAndStoreUsers();
    });

    // Call the function after DOM is loaded
    fetchAndStoreUsers();
});
