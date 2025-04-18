document.addEventListener('DOMContentLoaded', () => {
    // Check authentication status
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    const authButtons = document.getElementById('authButtons');
    const userMenu = document.getElementById('userMenu');
    const userName = document.getElementById('userName');
    const adminDashboard = document.getElementById('adminDashboard');
    const bookingForm = document.getElementById('bookingForm');

    // Update UI based on authentication status
    if (token && user) {
        authButtons.style.display = 'none';
        userMenu.style.display = 'block';
        userName.textContent = user.name;

        if (user.role === 'admin') {
            adminDashboard.style.display = 'block';
        }
    } else {
        // If not logged in, show login modal when trying to book
        if (bookingForm) {
            bookingForm.addEventListener('submit', (e) => {
                e.preventDefault();
                showLoginModal();
            });
        }
    }

    // Handle logout
    document.getElementById('logout')?.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    });

    // Handle admin dashboard link
    document.getElementById('adminDashboard')?.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.href = '/admin.html';
    });

    // Handle my bookings link
    document.getElementById('myBookings')?.addEventListener('click', (e) => {
        e.preventDefault();
        // TODO: Implement my bookings page
        alert('My Bookings feature coming soon!');
    });

    // Handle booking form submission
    if (bookingForm && token) {
        bookingForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const bookingData = {
                checkInDate: document.getElementById('checkIn').value,
                checkOutDate: document.getElementById('checkOut').value,
                numberOfGuests: parseInt(document.getElementById('guests').value),
                roomType: document.getElementById('roomType').value
            };

            try {
                const response = await fetch('/api/bookings', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(bookingData)
                });

                if (response.ok) {
                    alert('Booking successful!');
                    bookingForm.reset();
                } else {
                    const error = await response.json();
                    alert(error.message || 'Booking failed');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while making the booking');
            }
        });
    }

    // Set minimum date for check-in and check-out
    const today = new Date().toISOString().split('T')[0];
    const checkInInput = document.getElementById('checkIn');
    const checkOutInput = document.getElementById('checkOut');

    if (checkInInput && checkOutInput) {
        checkInInput.min = today;
        checkInInput.addEventListener('change', () => {
            const checkInDate = new Date(checkInInput.value);
            checkInDate.setDate(checkInDate.getDate() + 1);
            checkOutInput.min = checkInDate.toISOString().split('T')[0];
        });
    }
});

// Function to show login modal
function showLoginModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'loginModal';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Login Required</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
        </div>
        <div class="modal-body">
          <p>Please login or register to make a booking.</p>
          <div class="d-grid gap-2">
            <a href="login.html" class="btn btn-primary">Login</a>
            <a href="login.html" class="btn btn-success">Register</a>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.appendChild(modal);
    const modalInstance = new bootstrap.Modal(modal);
    modalInstance.show();

    // Remove modal from DOM when hidden
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeChild(modal);
    });
} 