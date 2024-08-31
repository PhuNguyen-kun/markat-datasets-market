document.addEventListener('DOMContentLoaded', () => {
    const dropdownActions = document.querySelectorAll('.dropdown-action');

    dropdownActions.forEach(action => {
        action.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định nếu cần
            const actionText = this.textContent.trim();
            console.log(`You clicked on: ${actionText}`);

            // Thực hiện hành động tùy theo liên kết
            if (actionText === 'Profile') {
                // Xử lý khi nhấn vào Profile
            } else if (actionText === 'Owned Datasets') {
                // Xử lý khi nhấn vào Owned Datasets
            } else if (actionText === 'Transaction History') {
                // Xử lý khi nhấn vào Transaction History
            } else if (actionText === 'Request History') {
                // Xử lý khi nhấn vào Request History
            } else if (actionText === 'Lịch sử gửi đăng ký') {
                // Xử lý khi nhấn vào Lịch sử gửi đăng ký
            } else if (actionText === 'Log out') {
                logout(); // Gọi hàm logout đã định nghĩa
            }

            // Nếu không ngăn chặn hành động mặc định, có thể di chuyển đến trang khác
            window.location.href = this.href;
        });
    });
});

function loadCustomerData() {
    const customerData = JSON.parse(sessionStorage.getItem('customer'));
    if (customerData) {
        // Hiển thị thông tin khách hàng lên trang
        document.getElementById('first_name').value = customerData.first_name || '';
        document.getElementById('last_name').value = customerData.last_name || '';
        document.getElementById('email').value = customerData.email || '';
        document.getElementById('birth_date').value = customerData.birth_date || '';
        document.getElementById('join_date').value = customerData.join_date || '';
        document.getElementById('current_location').value = customerData.current_location || '';
        document.getElementById('current_company').value = customerData.current_company || '';
        document.getElementById('phone_number').value = customerData.primary_language || '';
        document.getElementById('desired_payrate').value = customerData.join_date || '';
        document.getElementById('available_time_per_week').value = customerData.join_date || '';
    } else {
        console.log('No customer data found in session storage');
    }
}

function logout() {
    sessionStorage.clear();
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = '../index.html'; // Redirect to home page after logout
}