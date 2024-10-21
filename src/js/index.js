document.addEventListener("DOMContentLoaded", async () => {
    const tableBody = document.querySelector("#datatablesSimple tbody");
    const apiUrl = `${apt_link}/products`; // Global API link

    // Function to populate table with product data
    function populateTable(products) {
        tableBody.innerHTML = ''; // Clear existing rows
        products.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.des}</td>
                <td>${product.price}</td>
                <td>${product.evaluate || 'No Evaluation'}</td>
                <td>${product.total}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Try to retrieve product data from localStorage
    let products = localStorage.getItem("products");

    if (products) {
        // If products exist in localStorage, parse and display them
        products = JSON.parse(products);
        populateTable(products);
    } else {
        // If no products in localStorage, fetch from API
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data && data.length > 0) {
                // Save fetched products to localStorage
                localStorage.setItem("products", JSON.stringify(data));

                // Populate table with fetched products
                populateTable(data);
            } else {
                // If no products are found in the API response
                tableBody.innerHTML = '<tr><td colspan="6">No products available</td></tr>';
            }
        } catch (error) {
            console.error("Failed to fetch product data:", error);
            tableBody.innerHTML = '<tr><td colspan="6">Failed to load data</td></tr>';
        }
    }
});