document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch and store users from API or local storage
    async function fetchAndStoreUsers() {
        try {
            let storedUsers = localStorage.getItem('users');
            
            if (!storedUsers) {
                const response = await fetch( apt_link + '/users');
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

                const emailButton = document.createElement('button');
                emailButton.textContent = 'Send Email';
                emailButton.classList.add('btn', 'btn-info');
                emailButton.addEventListener('click', () => openEmailModal(user));
                ButtonCell.appendChild(emailButton);

                row.appendChild(idCell);
                row.appendChild(fullNameCell);
                row.appendChild(emailCell);
                row.appendChild(phoneCell);
                row.appendChild(dobCell);
                row.appendChild(passwordCell);
                row.appendChild(emailCell);
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
            const response = await fetch(apt_link + `/users/${userId}`, {
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
            const response = await fetch(apt_link + `/users/${userId}`, {
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
            const response = await fetch(apt_link + '/users', {
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

    const mailjetAPIKey = '5294d108fdbf307ffecd9b07ec9d85f0';
    const mailjetSecretKey = 'fb1524c83ba1dd6f5af86fe27cfe9e40';

    // Base64-encoded authentication token
    const authToken = btoa(`${mailjetAPIKey}:${mailjetSecretKey}`);

    // Dynamic sendEmail function
    const sendEmail = async ({ fromEmail, fromName, toEmail, toName, subject, textContent, htmlContent }) => {
    const response = await fetch('https://api.mailjet.com/v3.1/send', {
        method: 'POST',
        headers: {
        'Authorization': `Basic ${authToken}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({
        "Messages": [
            {
            "From": {
                "Email": fromEmail,
                "Name": fromName
            },
            "To": [
                {
                "Email": toEmail,
                "Name": toName
                }
            ],
            "Subject": subject,
            "TextPart": textContent,
            "HTMLPart": htmlContent
            }
        ]
        })
    });

    if (response.ok) {
        const data = await response.json();
        console.log("Email sent successfully:", data);
    } else {
        const errorData = await response.json(); // Get response body for error details
        console.error("Failed to send email:", response.statusText, errorData);
    }
    };
    function openEmailModal(user) {
        document.getElementById('toEmail').value = user.email;
        document.getElementById('subject').value = '';
        document.getElementById('textContent').value = '';
        document.getElementById('emailUserModal').style.display = 'block';
    }
    
    function closeEmailModal() {
        document.getElementById('emailUserModal').style.display = 'none';
    }
    
    let emailSending = false;

    const sendEmailDebounced = async (emailData) => {
        if (emailSending) return; // Prevent multiple sends
        emailSending = true;
    
        await sendEmail(emailData);
    
        emailSending = false; // Allow sending again
    };
    

    async function sendEmailtouser() {

    
        const emailData = {
            fromEmail: 'tomvahainam@gmail.com', // Update this with your actual email
            fromName: 'Shop Support',
            toEmail: document.getElementById('toEmail').value,
            toName:  "Customer", // You can modify this to be dynamic
            subject: document.getElementById('subject').value,
            textContent: document.getElementById('textContent').value,
            htmlContent: `<p>${document.getElementById('textContent').value}</p>`
        };
    
        try {
            // Assuming you have a function sendEmail defined elsewhere in your code
            console.log('Email Data:', emailData);

            await sendEmailDebounced(emailData);
            alert('Email sent successfully');
            closeEmailModal();
            return
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }

    // Attach event listeners
    document.getElementById('createButton').addEventListener('click', openCreateModal);
    document.getElementById('createCancelButton').addEventListener('click', closeCreateModal);
    document.getElementById('createUserForm').addEventListener('submit', saveNewUser);

    document.getElementById('cancelButton').addEventListener('click', closeEditModal);
    document.getElementById('editUserForm').addEventListener('submit', saveEditedUser);

    document.getElementById('emailCancelButton').addEventListener('click', closeEmailModal);
    document.getElementById('sendEmailForm').addEventListener('submit', function handleFormSubmit(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        // Call the sendEmail function
        sendEmailtouser(event)

    });
    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const reloadButton = document.getElementById("reloadButton");
    reloadButton.addEventListener("click", async () => {
    try {
        // Clear localStorage to force API reload
        localStorage.removeItem("users");
        sleep(9000)
        fetchAndStoreUsers();
    } catch (error) {
        console.error("Error during reload process:", error);
    }
    });
        
    // Call the function after DOM is loaded
    fetchAndStoreUsers();
});
