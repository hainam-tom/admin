
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        //if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //    document.body.classList.toggle('sb-sidenav-toggled');
        //}
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});
window.addEventListener('DOMContentLoaded', event => {
    // Simple-DataTables
    // https://github.com/fiduswriter/Simple-DataTables/wiki

    const datatablesSimple = document.getElementById('datatablesSimple');
    if (datatablesSimple) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
    const datatables= document.getElementById('ordersTable');
    if (datatables) {
        new simpleDatatables.DataTable(datatablesSimple);
    }
});
document.getElementById('logout').addEventListener('click', function() {
    // Clear user data from local storage
    localStorage.removeItem('userData'); // Change 'user' to the actual key you're using

    // Redirect to the registration page
    window.location.href = '../index.html'; // Change to your registration page URL
});