document.addEventListener('DOMContentLoaded', () => {
    
    // Fetch and store products from API or local storage
    async function fetchAndStoreProducts() {
        try {
            let storedProducts = localStorage.getItem('products');
            
            if (!storedProducts) {
                const response = await fetch(apt_link + '/products');
                const products = await response.json();
                localStorage.setItem('products', JSON.stringify(products));
                storedProducts = localStorage.getItem('products');
            }

            const products = JSON.parse(storedProducts);
            const tbody = document.querySelector('#datatablesSimple tbody');

            if (!tbody) throw new Error("Tbody element not found.");

            tbody.innerHTML = ''; // Clear previous data

            products.forEach((product) => {
                const row = document.createElement('tr');

                const idCell = document.createElement('td');
                idCell.textContent = product.id;

                const nameCell = document.createElement('td');
                nameCell.textContent = product.name;

                const descriptionCell = document.createElement('td');
                descriptionCell.textContent = product.des;

                const priceCell = document.createElement('td');
                priceCell.textContent = product.price;

                const evaluateCell = document.createElement('td');
                evaluateCell.textContent = product.evaluate;

                const stocksCell = document.createElement('td');
                stocksCell.textContent = product.total;

                // Create Edit button
                const ButtonCell = document.createElement('td');
                const editButton = document.createElement('button');
                editButton.textContent = 'Edit';
                editButton.classList.add('btn', 'btn-primary');
                editButton.addEventListener('click', () => openEditModal(product)); // Open edit modal
                ButtonCell.appendChild(editButton);

                // Create Delete button
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.classList.add('btn', 'btn-danger');
                deleteButton.addEventListener('click', () => deleteProduct(product.id)); // Attach delete functionality
                ButtonCell.appendChild(deleteButton);

                row.appendChild(idCell);
                row.appendChild(nameCell);
                row.appendChild(descriptionCell);
                row.appendChild(priceCell);
                row.appendChild(evaluateCell);
                row.appendChild(stocksCell);
                row.appendChild(ButtonCell); // Append the button

                tbody.appendChild(row);
            });
        } catch (error) {
            console.error('Error fetching or displaying product data:', error);
        }
    }

    // Delete product function
    async function deleteProduct(productId) {
        try {
            const response = await fetch(apt_link + `/products/${productId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                let storedProducts = JSON.parse(localStorage.getItem('products'));
                const updatedProducts = storedProducts.filter(product => product.id !== productId);
                localStorage.setItem('products', JSON.stringify(updatedProducts));
                fetchAndStoreProducts(); // Refresh the table after deletion
            } else {
                console.error('Failed to delete product from the API:', response.status);
            }
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    }

    // Open the edit modal and populate fields
    function openEditModal(product) {
        document.getElementById('editProductId').value = product.id;
        document.getElementById('editName').value = product.name;
        document.getElementById('editDescription').value = product.des;
        document.getElementById('editPrice').value = product.price;
        document.getElementById('editEvaluate').value = product.evaluate;
        document.getElementById('editStocks').value = product.total;

        document.getElementById('editUserModal').style.display = 'block'; // Show the modal
    }

    // Close the edit modal
    function closeEditModal() {
        document.getElementById('editUserModal').style.display = 'none'; // Hide the modal
    }

    // Save the edited product
    async function saveEditedProduct(event) {
        event.preventDefault();

        const productId = document.getElementById('editProductId').value;
        const updatedProduct = {
            id: productId,
            name: document.getElementById('editName').value,
            des: document.getElementById('editDescription').value,
            price: document.getElementById('editPrice').value,
            evaluate: document.getElementById('editEvaluate').value,
            total: document.getElementById('editStocks').value
        };

        try {
            const response = await fetch(apt_link + `/products/${productId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                let storedProducts = JSON.parse(localStorage.getItem('products'));
                const updatedProducts = storedProducts.map(product => product.id === parseInt(productId) ? updatedProduct : product);
                localStorage.setItem('products', JSON.stringify(updatedProducts));

                fetchAndStoreProducts(); // Refresh the table
                closeEditModal(); // Close the modal
            } else {
                console.error('Failed to update product on the API:', response.status);
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    }

    // Save the new product
    async function saveNewProduct(event) {
        event.preventDefault();

        const newProduct = {
            name: document.getElementById('createName').value,
            des: document.getElementById('createDescription').value,
            price: document.getElementById('createPrice').value,
            evaluate: document.getElementById('createEvaluate').value,
            total: document.getElementById('createStocks').value
        };

        try {
            const response = await fetch(apt_link + '/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            if (response.ok) {
                // Clear localStorage and reload products from API
                localStorage.removeItem('products');
                fetchAndStoreProducts(); // Refresh the table
                closeCreateModal(); // Close the modal
            } else {
                console.error('Failed to create product on the API:', response.status);
            }
        } catch (error) {
            console.error('Error creating product:', error);
        }
    }

    // Open the create product modal
    function openCreateModal() {
        document.getElementById('createUserModal').style.display = 'block'; // Show the modal
    }

    // Close the create product modal
    function closeCreateModal() {
        document.getElementById('createUserModal').style.display = 'none'; // Hide the modal
    }

    // Attach event listeners
    document.getElementById('createButton').addEventListener('click', openCreateModal);
    document.getElementById('createCancelButton').addEventListener('click', closeCreateModal);
    document.getElementById('createUserForm').addEventListener('submit', saveNewProduct);

    document.getElementById('cancelButton').addEventListener('click', closeEditModal);
    document.getElementById('editUserForm').addEventListener('submit', saveEditedProduct);

    const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));
    const reloadButton = document.getElementById("reloadButton");
    reloadButton.addEventListener("click", async () => {
        try {
            localStorage.removeItem("products");
            sleep(9000)
            fetchAndStoreProducts();
        } catch (error) {
            console.error("Error during reload process:", error);
        }
    });
        
    // Call the function after DOM is loaded
    fetchAndStoreProducts();
});
