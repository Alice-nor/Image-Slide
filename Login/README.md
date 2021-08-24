# Login
 使用 express 去做 cookie 的應用。以登入實作為例。  
 參考文章：[Day24 - Cookie在express上的應用—登入實作為例。](https://ithelp.ithome.com.tw/articles/10187343) 

## Step1
從無到有建立專案資料夾，初始化此資料夾。

```JavaScript
    mkdir login
    cd login
    npm init // 並填入檔案資料
```

## Step2
安裝登入專案需要的第三方 module

```JavaScript
    npm install express --save
    npm install body-parser --save
    npm install cookie-parser --save
```

## Step3
在 login 資料夾內創建 public 資料夾，並在 public 再創建 cookie 資料夾。  
在 cookie 資料夾內放入 login.html 靜態網頁。  
（public 資料夾通常會包含 css、 JavaScript，以及一些 html 的樣板。）

## Step4
在 login 資料夾內創建 views 資料夾，  
並在 views 資料夾內放入 index.jade 與 layout.jade 樣板。  
（views 資料夾通常會包含應用程式的樣板，像是 index、error、layout....）

## Step5
在 cookie 資料夾內的 login.html 檔案程式碼如下。  
注意 action="/session/post" 會與提交後的動作有關！

```html
    <form action="/session/post" method="post">
        Firstname: <input name="firstname" type="text"><br>
        Lastname: <input name="lastname" type="text"><br>
        <input type="submit" value="送出">
    </form>
```

## Step6
在 views 資料夾內的 layout.jade 樣板程式碼如下。  
layout.jade 通常會放入每個頁面都會需要的內容，接著讓其他頁面 extends 使用。

```jade
    doctype html 
    html 
    head 
        title = title 
        link(rel='stylesheet', href='/stylesheets/style.css')
    body 
        block content
```

接著是 index.jade 的樣板程式碼內容。  
注意 member 與 time 都是儲存在 cookie。


```jade
    extends layout 

    block content 
    h1 = title 
    p Hello #{member}
        if logstatus == false 
            a(href='login.html') 登入
        else 
            a(href='./logout') 登出
            , Welcome to #{title}
```

## Step7
接著在 login 資料夾內建立 index.js，這是我們的會執行的檔案。  
（index.js 與 package.json 內的 main 對應）  
以下是 index.js 的程式碼。

```JavaScript
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
    app.use(bodyParser, json());
    app.use(bodyParser, urlencoded({ extended: false }));

    // sign for cookie
    app.use(cookieParser('123456789'));


    // creater a router to handle routes for a set of loginAPI
    // ------


    // 靜態檔案像是 .js、.json、.xml、html....
    app.use(express.static(__dirname + '/public'));

    // 允許 /cookie 使用這個路由
    app.use('/cookie', routerCookie);

    app.listen(3000, function() {
        console.log('Ready...for 3000');
    });
```

#### Step7 重要的知識點

1. [在 Express 中使用範本引擎](https://expressjs.com/zh-tw/guide/using-template-engines.html) 

> 您必須先設定下列應用程式設定，Express 才能呈現範本檔：
> * view engine：要使用的範本引擎。例如：app.set('view engine', 'pug')
> * views：範本檔所在的目錄。例如：app.set('views', './views')


```JavaScript
    // 設定 view 要使用的範本引擎，這邊使用的是 jade
    // 因此 views 資料夾內的檔案的副檔名都是 jade
    app.set('view engine', 'jade');
    // 設定 view 的位置。我放在 views 的資料夾內
    app.set('views', __dirname + '/views');
```

> 樣版引擎是幫助我們以最小的code 去新增一個Html Template。它可以在客戶端注入一些資料 (像是 JSON/XML) , Html Template，透過Template Engine 產生最後的HTML呈現至瀏覽器。  
> 來源：[Day19 - 樣版引擎及Jade 樣版引擎的安裝與使用](https://ithelp.ithome.com.tw/articles/10186637)

2. [為何使用 body-parse](https://ithelp.ithome.com.tw/articles/10220836)

> 提到 RESTful 幾個 Method，有些像是 POST、PATCH，是需要在 Request 時，一併送出 body 當作參數給 Server，並且可以在 headers，去設定 content-type 參數的類型....
> 而 node 有許多這類型去解析 body 的套件，像是今天提到的 body-parser，透過這個插件可以解析 JSON、Raw、text、XML、URL-encoded 格式的請求。使用方法如下：先安裝 body-parser，並把程式碼加入到 .js 檔案中。

```
    npm i body-parser
```

```JavaScript
    const bodyParser = require('body-parser');
    
    // 解析 application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({
        extended: false,
    }));
    // 解析 application/json
    app.use(bodyParser.json());
    
    // 加上這兩個解析方式已可應付大部分的需求
    // 有需特別處理的再加上程式碼即可
```

3. [設定簽章](https://ithelp.ithome.com.tw/articles/10187343)

> express設定簽章，必須使用 cookie-parser middleware，它的作用是即為cookie做一個簽章。用法：在你的express物件，加入cookieParser(your sign) 即可！參數your sign建議是一個 128 bytes 的隨機字串。

4. [在 Express 中提供靜態檔案](https://expressjs.com/zh-tw/starter/static-files.html)

> 如果要提供影像、CSS 檔案和 JavaScript 檔案等之類的靜態檔案，請使用 Express 中的 express.static 內建中介軟體函數。

> 將含有靜態資產的目錄名稱傳遞給 express.static 中介軟體函數，就能直接開始提供檔案。舉例來說，使用下列程式碼在名稱是 public 的目錄中，提供影像、CSS 檔案和 JavaScript 檔案：

```JavaScript
    app.use(express.static('public'));
```

> 如果要使用多個靜態資產目錄，請呼叫 express.static 中介軟體函數多次：

```JavaScript
    app.use(express.static('public'));
    app.use(express.static('files'));
```

> 不過，您提供給 express.static 函數的路徑，是相對於您從中啟動 node 程序的目錄。如果您是從另一個目錄執行 Express 應用程式，保險作法是使用您想提供之目錄的絕對路徑：

```JavaScript
    app.use('/static', express.static(__dirname + '/public'));
```

## Step8
接著在 login 資料夾內建立 routes 資料夾，此 routes 資料夾內的檔案用來處理路由。  
接著在 routes 資料夾內建立 loginAPI.js 檔案。以下是 loginAPI.js 的程式碼。

```JavaScript
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
```

#### Step8 重要的知識點

1. [res.render](https://expressjs.com/zh-tw/4x/api.html#res.render) 

> **res.render(view [, locals] [, callback])**  
> Renders a view and sends the rendered HTML string to the client. Optional parameters:
> * locals, an object whose properties define local variables for the view.
> * callback, a callback function. If provided, the method returns both the possible error and rendered string, but does not perform an automated response. When an error occurs, the method invokes next(err) internally.

```JavaScript
    // send the rendered view to the client
    res.render('index');

    // if a callback is specified, the rendered HTML string has to be sent explicitly
    res.render('index', function (err, html) {
        res.send(html)
    });

    // pass a local variable to the view
    res.render('user', { name: 'Tobi' }, function (err, html) {
        // ...
    });
```

2. [res.redirect](https://expressjs.com/zh-tw/4x/api.html#res.redirect) 

> **res.redirect([ status,] path)**  
> Redirects to the URL derived from the specified path, with specified status, a positive integer that corresponds to an HTTP status code . If not specified, status defaults to “302 “Found”.

```JavaScript
    res.redirect('/foo/bar');
    res.redirect('http://example.com');
    res.redirect(301, 'http://example.com');
    res.redirect('../login');

    // Redirects can be a fully-qualified URL for redirecting to a different site:
    res.redirect('http://google.com');

    // Redirects can be relative to the root of the host name.
    // For example, if the application is on http://example.com/admin/post/new
    // the following would redirect to the URL http://example.com/admin..
    res.redirect('/admin');
```

## 步驟與導向解析統整

想釐清檔案與檔案間的步驟與順序，以及到底是怎麼導向與互相影響，因此把大步驟寫在這邊。

#### 1. 執行主要檔案。

```JavaScript
    node index.js // 終端機執行主要檔案
```
```JavaScript
    // index.js 已設置好樣板要找 views 資料夾內的 jade 檔案。
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');

    // 靜態檔案則要找 public 資料夾內的檔案。
    app.use(express.static(__dirname + '/public'));

    // 路由都交給 routerCookie 負責，路徑是 /cookie
    // 因此輸入網址時是： localhost:5000/cookie
    // 接著後續的導向都跟 routerCookie 相關
    // 畫面呈現都跟 html 與 jade 檔有關
    let routerCookie = require('./routes/loginAPI');
    app.use('/cookie', routerCookie);
```

#### 2. 執行 loginAPI.api

![image](https://github.com/Alice-nor/front-endPratice/blob/main/Login/img/01.png)

 輸入網址後，此時的畫面如上圖。來理解一下為何是這樣畫面。  
 步驟 1 路由 /cookie 導向 routerCookie，  
 而 routerCookie 是 loginAPI.js 這個檔案，  
 接著來看看 loginAPI.js。  

 ```JavaScript
    // 網址 localhost:5000/cookie
    // 這邊的 loginAPI.get('/'......
    // 讓輸入網址 localhost:5000/cookie 時會導向 localhost:5000/cookie/
    // 但輸入 localhost:5000/cookie 也是可以的
    // 因此一開始的畫面是 get 的方法呈現
    // 那麼接著看 get 的方法
    loginAPI.get('/', function(req, res) {
    // .... 程式碼
    });
```


 ```JavaScript
    // 以下是在 loginAPI.get 的方法裡
    // 通常進入一個網站會是登出的狀態，因此設定 isLogin 為 false
    // 若是為登出的狀態會執行以下程式碼（已登入狀態下面會提到）

    // 因為在 index.js 已設定過樣板會去 views 裡找
    // 所以這邊的 index 代表 views 資料夾內的 index.jade 檔案
    // 大括弧內的內容為要傳遞過去的資料（呼應 index.jade 裡的資料）
    // 那麼接著看 index.jade
    res.render('index', { title: 'Express', member: name, logstatus: isLogin });
```

title、member、logstatus 都帶進 index.jade 裡。 
因 logstatus 為 false 未登入的狀態，  
所以印出 Hello guest 登入, Welcome to Express。


#### 3. 按下登入的連結

![image](https://github.com/Alice-nor/front-endPratice/blob/main/Login/img/02.png)

按下登入的連結後，此時的畫面如上圖。這是為什麼呢？  
我們先看回到 index.jade，登入的畫面會連結到 login.html。  

```jade
    a(href='login.html') 登入
```

所以這邊會出現 html 的畫面很好理解。  
注意網址變成了 localhost:5000/cookie/login.html。  

#### 4. 填完資料，按下送出

![image](https://github.com/Alice-nor/front-endPratice/blob/main/Login/img/03.png)

![image](https://github.com/Alice-nor/front-endPratice/blob/main/Login/img/04.png)

填完資料並按下送出後，此時的畫面會如上圖。  
我們回到 login.html 的表單上。  

```html
    <!--
        注意到這邊的 action 為 /cookie/post，method 為 post。
        填表格時的頁面網址為 localhost:5000/cookie/login.html，
        資料都填完後按下送出後，路由為 /cookie/post，
        因此網址導向 localhost:5000/cookie/post，
    -->
    <form action="/cookie/post" method="post">
        <!-- 程式碼.... -->
    </form>
```
```JavaScript
    /* 
    接著再看到 loginAPI.js，
    我們有設定好 loginAPI.post('/post'....，
    所以 localhost:5000/cookie/post 的呈現方式是依照 post 內的方法
    */
    loginAPI.post('/post', function(req, res) {
        // 程式碼...
    });



    // 以下是在 loginAPI.post 的方法裡
    // 若有一個欄位沒有填資料，就會跳回到 login.html 讓你填表格
    if (req.body.firstname == '' || req.body.lastname == '') {
        return res.redirect('login.html');
    }

    // 而如果我們早已乖乖的填完了資料
    // 用 respose cookie 設定 firstname 與 lastname 內容
    // 並導向 /cookie，也就是 localhost:5000/cookie
    // 接著再回到 loginAPI.get.....
    // 這時就有了 cookie 的資料了！因此會是登入的狀態，
    // 並再把畫面導向 index.jade。

    // 看向 index.jade， logstatus 是 true 的登入狀態
    // 所以換呈現下面這一行程式碼。
    a(href='./logout') 登出
```

一樣的 title、member、logstatus 都帶進 index.jade 裡。  
因 logstatus 為 true 未登入的狀態，  
所以印出 Hello 名稱 登出, Welcome to Express

#### 5. 登出

![image](https://github.com/Alice-nor/front-endPratice/blob/main/Login/img/01.png)

按下登出鍵後，又回到了上面的這個畫面。  
這是因為 index.jade 裡的登出是連接到 ./logout。  
我們再回到 loginAPI.js 看 ./logout 路由會導向哪。

```JavaScript
    // 處理路由的 loginAPI.js 裡確實有處理 ./logout
    // 要注意他的位置，在 index.jade 的路由是 ./logout
    // 在 loginAPI.js 則是 /logout
    // 接著看登出時怎麼處理
    loginAPI.get('./logout', function(req, res) {
        // 程式碼...
    });


    // 以下是在 loginAPI.get('/logout...的方法裡
    // 把 cookie 都移除掉之後，導向 /cookie
    // 又回到了 loginAPI.get.....
    // 因為 cookie 都被我們移除了，所以又回到了登出狀態
    // 並把畫面導向 index.jade
    // 如此這般就又回到步驟 1 了！
    res.clearCookie('firstname', { path: '/cookie' });
    res.clearCookie('lastname', { path: '/cookie' });
    return res.redirect('/cookie');
```
