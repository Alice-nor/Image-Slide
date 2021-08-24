// 載入第三方模組
let express = require('express');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');

// 載入路由檔案
let routerCookie = require('./routes/loginAPI');

let app = express(); // 建立 express 物件

// set view engine
app.set('view engine', 'jade');
// set view directory
app.set('views', __dirname + '/views');

// 將 request 送進來的資料轉成 json()
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// sign for cookie
app.use(cookieParser('123456789'));


// creater a router to handle routes for a set of loginAPI
// ------


// 靜態檔案像是 .js、.json、.xml、html....
app.use(express.static(__dirname + '/public'));

// 允許 /cookie 使用這個路由
app.use('/cookie', routerCookie);

app.listen(5000, function() {
    console.log('Ready...for 5000');
});