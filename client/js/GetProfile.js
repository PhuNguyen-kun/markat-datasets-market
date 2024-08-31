document.addEventListener('DOMContentLoaded', () => {
    const dropdownActions = document.querySelectorAll('.dropdown-action');

    dropdownActions.forEach(action => {
        action.addEventListener('click', function(event) {
            event.preventDefault(); // Ngăn chặn hành động mặc định nếu cần
            const actionText = this.textContent.trim();
            console.log(`You clicked on: ${actionText}`);
            if (actionText === 'Profile') {
               loadCustomerData();
            } else if (actionText === 'Owned Datasets') {
                console.log("Error");
            } else if (actionText === 'Transaction History') {
                console.log("Error");
            } else if (actionText === 'Request History') {
                console.log("Error");
            } else if (actionText === 'Lịch sử gửi đăng ký') {
                console.log("Error");
            } else if (actionText === 'Log out') {
                logout();
                return;
            }

            window.location.href = this.href;
        });
    });
});

async function loadCustomerData() {
    const customerData = JSON.parse(sessionStorage.getItem('customer'));
    try {
        let response = await axios.post('http://localhost:8888/users/profile', {
            id_user : customerData,
        });
        let userProfile = response.data;
        document.getElementById('first_name').value = userProfile.first_name || '';
        document.getElementById('last_name').value = userProfile.last_name || '';
        document.getElementById('email').value = userProfile.email || '';
        document.getElementById('birth_date').value = userProfile.birth_date || '';
        document.getElementById('join_date').value = userProfile.join_date || '';
        document.getElementById('current_location').value = userProfile.current_location || '';
        document.getElementById('current_company').value = userProfile.current_company || '';
        document.getElementById('phone_number').value = userProfile.primary_language || '';
        document.getElementById('desired_payrate').value = userProfile.join_date || '';
        document.getElementById('available_time_per_week').value = userProfilea.join_date || '';
    } catch (error) {
        console.log("User not found");
    }
}

function logout() {
    sessionStorage.clear();
    alert("Bạn đã đăng xuất thành công!");
    window.location.href = '../index.html'; // Redirect to home page after logout
}