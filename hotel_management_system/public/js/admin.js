document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if user is logged in and is admin
    if (!token || !user || user.role !== 'admin') {
        window.location.href = '/login.html';
        return;
    }

    // Logout functionality
    document.getElementById('logout').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Fetch and display statistics
    async function fetchStats() {
        try {
            const response = await fetch('/api/admin/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const stats = await response.json();

            // Update stats cards
            document.getElementById('totalBookings').textContent = stats.totalBookings;
            document.getElementById('confirmedBookings').textContent = stats.confirmedBookings;
            document.getElementById('pendingBookings').textContent = stats.pendingBookings;
            document.getElementById('cancelledBookings').textContent = stats.cancelledBookings;
            document.getElementById('totalRevenue').textContent = `$${stats.totalRevenue}`;

            // Update chart
            const ctx = document.getElementById('bookingChart').getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Confirmed', 'Pending', 'Cancelled'],
                    datasets: [{
                        data: [
                            stats.confirmedBookings,
                            stats.pendingBookings,
                            stats.cancelledBookings
                        ],
                        backgroundColor: [
                            '#28a745',
                            '#ffc107',
                            '#dc3545'
                        ]
                    }]
                }
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    }

    // Fetch and display bookings
    async function fetchBookings() {
        try {
            const response = await fetch('/api/admin/bookings', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch bookings');
            }

            const bookings = await response.json();
            const tableBody = document.getElementById('bookingsTable');
            tableBody.innerHTML = '';

            bookings.forEach(booking => {
                const row = document.createElement('tr');
                row.innerHTML = `
          <td>${booking._id}</td>
          <td>${booking.user.name}</td>
          <td>${new Date(booking.checkInDate).toLocaleDateString()}</td>
          <td>${new Date(booking.checkOutDate).toLocaleDateString()}</td>
          <td>
            <select class="form-select status-select" data-booking-id="${booking._id}">
              <option value="pending" ${booking.status === 'pending' ? 'selected' : ''}>Pending</option>
              <option value="confirmed" ${booking.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
              <option value="cancelled" ${booking.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
            </select>
          </td>
          <td>
            <button class="btn btn-sm btn-primary update-status" data-booking-id="${booking._id}">Update</button>
          </td>
        `;
                tableBody.appendChild(row);
            });

            // Add event listeners for status updates
            document.querySelectorAll('.update-status').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const bookingId = e.target.dataset.bookingId;
                    const status = document.querySelector(`.status-select[data-booking-id="${bookingId}"]`).value;

                    try {
                        const response = await fetch(`/api/admin/bookings/${bookingId}`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ status })
                        });

                        if (!response.ok) {
                            throw new Error('Failed to update booking status');
                        }

                        // Refresh the page to show updated data
                        fetchStats();
                        fetchBookings();
                    } catch (error) {
                        console.error('Error updating booking status:', error);
                    }
                });
            });
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }

    // Initial data load
    fetchStats();
    fetchBookings();
}); 