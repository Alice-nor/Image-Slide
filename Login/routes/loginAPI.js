let express = require('express');
let loginAPI = express.Router();

let isLogin = false;

// 進入需要驗證的頁面...
// 預設登入裝態都為 false 
// 如果接收到 cookie 都存在，則改變登入者姓名與狀態
// 若沒有登入則會導向 index.jade 樣板做呈現
loginAPI.get('/', function(req, res) {
    let name = 'guest';
    isLogin = false; // 登入狀態

    // 如果 cookie 有 firstname 與 lastname 的資料
    if (req.signedCookies.firstname && req.signedCookies.lastname) {
        name = `${req.signedCookies.firstname} ${req.signedCookies.lastname}`;
        isLogin = true; // 登入
    }

    // 傳遞資料給 index.jade
    res.render('index', { title: 'Express', member: name, logstatus: isLogin });
});

// 表單送出後...
loginAPI.post('/post', function(req, res) {

    // 若 fistname 或 lastname 有一個欄位沒有填寫
    // 則跳回登入頁面，若都有填了就可以建立 cookie
    // 使用簽章，cookie 的生存值為 100 分鐘
    // 完成後導向 /cookie 進入驗證頁面
    if (req.body.firstname == '' || req.body.lastname == '') {
        return res.redirect('login.html');
    } else {
        // 若有資料的話，跟 cookie 取得資料
        res.cookie('firstname', req.body.firstname, { path: '/cookie', signed: true, maxAge: 600000 });
        res.cookie('lastname', req.body.lastname, { path: '/cookie', signed: true, maxAge: 600000 });
        return res.redirect('/cookie');
    }
});

// 登出...
loginAPI.get('/logout', function(req, res) {
    // 登出並做清理 cookie 的動作，返回路由 /cookie
    res.clearCookie('firstname', { path: '/cookie' });
    res.clearCookie('lastname', { path: '/cookie' });
    return res.redirect('/cookie');
});

module.exports = loginAPI;