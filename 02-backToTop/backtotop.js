// 純 JavaScript 寫法
let backtotop = document.getElementById("backtotop");

window.addEventListener('scroll', function() {
    if (window.scrollY > 150) {
        if (!backtotop.classList.contains("btnEntrance")) {
            backtotop.classList.add("btnEntrance") // 淡入
            backtotop.classList.remove("btnExit") // 移除淡出
            backtotop.classList.add('visible');
        }

    } else {
        if (backtotop.classList.contains("btnEntrance")) {
            backtotop.classList.add("btnExit") // 淡出
            backtotop.classList.remove("btnEntrance") // 移除淡入
            setTimeout(function() { // 使用setTimeout讓淡出的動畫不會太快，更自然
                backtotop.classList.remove('visible')
            }, 250);

        }

    }
})

backtotop.addEventListener('click', backToTop);

function backToTop() {
    window.scrollTo(0, 0);
}

// 以下為 jQuery 寫法
// $('#backtotop').click(function() {
//     $('body,html').animate({
//         scrollTop: 0
//     }, 600);
// });

// $(window).scroll(function() {
//     if ($(window).scrollTop() > 150) {
//         $('#backtotop').addClass('visible');
//     } else {
//         $('#backtotop').removeClass('visible');
//     }
// })