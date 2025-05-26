function setCookie(cname, cvalue, exdays = 14) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return false;
}

$(document).ready(function () {
    if (getCookie('show_left_menu' == 'show')) {
        $('body').toggleClass('cui__menuLeft--toggled');
    }
})

document.addEventListener('DOMContentLoaded', function() {
    // Lắng nghe sự kiện click trên các button hoặc các thẻ <a> có href="#id"
    document.querySelectorAll('a[href^="#"]').forEach(function(el) {
        el.addEventListener('click', function(e) {
            // Kiểm tra nếu là thẻ <a> và href không bắt đầu bằng "#", không làm gì cả
            if (this.tagName === 'A' && !this.getAttribute('href').startsWith('#')) {
                return;
            }

            e.preventDefault(); // Ngăn chặn hành động mặc định của button hoặc thẻ <a>

            // Lấy id của phần tử cần scroll đến
            let targetId = this.tagName === 'A' ? this.getAttribute('href').substring(1) : this.dataset.target;

            // Tìm phần tử có id tương ứng
            let targetElement = document.getElementById(targetId);

            // Nếu phần tử tồn tại, thực hiện cuộn đến
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth' // Cuộn mượt
                });
            }
        });
    });
});
