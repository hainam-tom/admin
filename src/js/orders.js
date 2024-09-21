document.addEventListener('DOMContentLoaded', () => {
    
    const ordersAPI = 'https://jsa37-api-bca8a1a0f23b.herokuapp.com/api/hainam/orders';
    
    // Fetch and store orders from API or local storage
    async function fetchAndStoreOrders() {
        try {
            let storedOrders = localStorage.getItem('orders');
            
            if (!storedOrders) {
                const response = await fetch(ordersAPI);
                const orders = await response.json();
                localStorage.setItem('orders', JSON.stringify(orders));
                storedOrders = localStorage.getItem('orders');
            }

            const orders = JSON.parse(storedOrders);
            displayOrders(orders);
        } catch (error) {
            console.error('Error fetching or displaying orders data:', error);
        }
    }

    // Display orders in the table
    function displayOrders(orders) {
        const tbody = document.querySelector('#datatablesSimple tbody');
        tbody.innerHTML = ''; // Clear previous data

        orders.forEach((order) => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = order.id;

            const productsCell = document.createElement('td');
            productsCell.textContent = order.idProducts.join(", "); // Display product IDs

            const timeCell = document.createElement('td');
            timeCell.textContent = order.time;

            const userIdCell = document.createElement('td');
            userIdCell.textContent = order.idUser;

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.classList.add('btn', 'btn-danger');
            deleteButton.addEventListener('click', () => deleteOrder(order.id)); // Attach delete functionality
            actionsCell.appendChild(deleteButton);

            row.appendChild(idCell);
            row.appendChild(productsCell);
            row.appendChild(timeCell);
            row.appendChild(userIdCell);
            row.appendChild(actionsCell);

            tbody.appendChild(row);
        });
    }

    // Delete order function
    async function deleteOrder(orderId) {
        try {
            const response = await fetch(`${ordersAPI}/${orderId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                let storedOrders = JSON.parse(localStorage.getItem('orders'));
                const updatedOrders = storedOrders.filter(order => order.id !== orderId);
                localStorage.setItem('orders', JSON.stringify(updatedOrders));
                fetchAndStoreOrders(); // Refresh the table after deletion
            } else {
                console.error('Failed to delete order from the API:', response.status);
            }
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    }

    // Create a new order
    async function createOrder(event) {
        event.preventDefault();
        array = document.getElementById('orderProductId').value
        console.log(array)
        const newOrder = {
            idProducts: array.split(',').map(Number),
            time: document.getElementById('orderTime').value,     // Example delivery time
            idUser: ((document.getElementById('orderUserId').value) * 1)       // Example user ID
        };

        try {
            const response = await fetch(ordersAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });

            if (response.ok) {
                localStorage.removeItem('orders'); // Clear localStorage to reload data from API
                fetchAndStoreOrders(); // Refresh the table
                alert("Order created successfully!");
                document.getElementById('createOrderModal').style.display = 'none';
            } else {
                console.error('Failed to create order on the API:', response.status);
            }
        } catch (error) {
            console.error('Error creating order:', error);
        }
    }

    // Attach event listeners

    function openCreateModal() {
        document.getElementById('createOrderModal').style.display = 'block'; // Show the modal
    }

    // Close the create product modal
    function closeCreateModal() {
        document.getElementById('createOrderModal').style.display = 'none'; // Hide the modal
    }

    document.getElementById('reloadOrdersButton').addEventListener('click', () => {
        localStorage.removeItem('orders'); // Clear local storage to force API reload
        fetchAndStoreOrders();             // Fetch fresh data from the API
    });
    document.getElementById('createOrderButton').addEventListener('click', openCreateModal);
    document.getElementById('orderCancelButton').addEventListener('click', closeCreateModal);
    document.getElementById('createOrderForm').addEventListener('submit', createOrder);


    // Initial load of orders data
    fetchAndStoreOrders();
});
