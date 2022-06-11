# Portfolio
 練習 [2022網頁開發全攻略(HTML, CSS, JavaScript, React, SQL, Node, more)](https://www.udemy.com/course/html5-css3-z/) 中 Project3 的內容。雖然是做 portfolio，但我之前做過自己的網站了，所以這邊主要著重在練習一進入到網頁時，會有大標題的動畫效果。
 

## Step 1:取得標題 svg

一開始先用 figma 製作草稿，  
做完後可直接就草稿上的文字轉換成 svg 檔並複製到 html 上。  
作法為以下步驟：
1. 複製單一文字並貼上
2. 針對複製的文字右鍵選擇 flatten （類似 ai 的轉換框？）
3. 再次右鍵，選擇 copy/paste as 中的 copy as svg 並貼到 html 中

 ![image](https://github.com/Alice-nor/front-endPratice/blob/main/07-Portfolio/01.png)

貼上的 svg 程式碼會類似這個樣子

```html
<svg 
    width="121"
    height="114"
    viewBox="0 0 121 114"
    fill="none"
    xmlns="http://www.w3.org/2000/svg">

    <path d="M2 102.807H1V103...."
    fill="white"
    stroke="#089797"
    stroke-width="2"/>
</svg>
```

## Step 2:為每個字加上 id & class

為了方便後續能一個字一個字出現的動畫特效，  
需要為每一個字增加 id & class。
id 名稱每個字都不一樣，class 名稱則要都一樣。  
(若字與字之間要有空格，可在 svg 內加入 margin)

* 我發現若是英文字且大小小不同，這樣的放法水平線會不一樣，擺起來就會歪七扭八，所以我捨棄下排的文字一個一個出現的特效，改為一次一起出現。

## Step 3:取得每個字的長度

```JavaScript

const text = document.querySelectorAll('.thePaths');

for (let i =0; i < text.length; i++) {
    // 取得每個字的長度
    console.log(`text number ${i} length is ${text[i].getTotalLength()}`);
}

```
## Step 4:製作動畫效果

知道每個字的長度後，就可客製化它們的動畫效果。  
動畫效果 `fadeInside` 的內容如下：

```css

#first {
    stroke-dasharray: 624px;
    stroke-dashoffset: 624px; // 離虛線最遠之處開始
    animation: fadeInside .6s ease-in forwards;
}

@keyframes fadeInside {
    to {
        stroke-dashoffset: 0px; // 回到虛線的開頭
    }
}
```

使用了兩個 svg 的 trick：[stroke-dasharray](https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/stroke-dasharray)、[stroke-dashoffset](https://developer.mozilla.org/zh-TW/docs/Web/SVG/Attribute/stroke-dashoffset)，  
簡單來說`stroke-dasharray` 可設定線條的虛線，px 越大則虛線中的空隙越大，  
`stroke-dashoffset` 則決定從一個數值至虛線的開頭，  
若設定 `stroke-dashoffset` 為 0，則代表 0 到虛線的開頭（也就會沒有反應）；  
若設定 `stroke-dashoffset` 為 100%，則代表 100% 到虛線的開頭，
這邊就是利用這個方式使動畫有了好像對邊框做圈起來的效果。

> 推薦閱讀：[stroke-dasharray-css tricks](https://css-tricks.com/almanac/properties/s/stroke-dasharray/)


## Step 5:delay 與 fill

若全部的動畫都一起開始，效果沒有那麼好，因此要在動畫上使其他文字有 delay 的效果。  
一開始動畫開始時，文字的背景是透明的，結束後要使文字的背景為白色。

```css
#first {
    stroke-dasharray: 624px;
    stroke-dashoffset: 624px;
    animation: fadeInside .6s ease-in forwards,fill 1s ease-in forwards 2s;
}

@keyframes fill {
    from {
        fill: transparent;
    }

    to {
        fill: white;
    }
}
```

## Step 6:動畫消失

因是進入網站前的動畫效果，網站結束後要讓這邊的動畫消失，  
才看得到原本的網站，而不會被動畫擋住，  
因此要增加 JavaScript 語法，動畫結束後此頁面就會消失。

```JavaScript
const lastWord = document.querySelector('#eighteenth');
const animation = document.querySelector('.animation');
lastWord.addEventListener('animationend', () => {
    animation.style = 'transition: all 1s ease; opacity: 0, pointer-events:none; display:none';
})
```

我才知道有 [https://www.runoob.com/jsref/event-animationend.html](animationend) 的監聽器！當動畫結束後就會直接觸發。
不過要注意，監聽的對象確實有動畫效果，若沒有的話，此方法不會被觸發。

## 延伸：優化 SCSS

下面是老師的寫法，對沒基礎的人來說比較好懂，  
不過我覺得都用 SCSS 來寫了，這樣寫法太重複了，  
因此自己想對這邊的語法進行優化，原本語法是類似以下方法：

```SCSS
#first {
    stroke-dasharray: 624px;
    stroke-dashoffset: 624px;
    animation: fadeInside .6s ease-in forwards,fill 1s ease-in forwards 2.5s;
}

#second {
    stroke-dasharray: 324px;
    stroke-dashoffset: 324px;
    animation: fadeInside .6s ease-in forwards .3s,fill 1s ease-in forwards 2.5s;
}

// #third, #fourth, #fifth, #sixth..... 依此類推
```
使上下兩排的動作時間可以差不多一致開始與結束，所以上下排的 delay 時間倍數不同，  
也為了方便帶迴圈，把上下兩排的資料分開，id 取名為 svgTop- & svgBottom-。

```SCSS
// 上排文字
$SvgLength_top:(
    0 : '624px',
    1 : '324px',
    /* 
    2 : ....',
    3 : .....
    */
);

// 下排文字
$SvgLength_bottom:(
    0 : '221px',
    1 : '162px',
    /* 
    2 : ....',
    3 : .....
    */
);


@each $svgNum, $svgLength in $SvgLength_top {
    #svgTop-#{$svgNum} {
        stroke-dasharray:#{$svgLength};
        stroke-dashoffset:#{$svgLength};
        @include animation($svgNum * 0.3s);
    }
}

@each $svgNum, $svgLength in $SvgLength_bottom {
    #svgBottom-#{$svgNum} {
        stroke-dasharray:#{$svgLength};
        stroke-dashoffset:#{$svgLength};
        @include animation($svgNum * 0.2s);
    }
}
```

明明一開始想覺得不會很困難，最後我還是花了很多時間才寫出來...，  
對 SCSS 不夠熟悉，中途遇到問題只好一直改方法，最後就成這樣了（搭拉），  
雖然感覺還有辦法再更省略，但先這樣了。

**展示結果**
[網站：Portfolio](https://alice-nor.github.io/front-endPratice/07-Portfolio/portfolio.html)

figma 草稿內容：  
![image](https://github.com/Alice-nor/front-endPratice/blob/main/07-Portfolio/portfolio.gif)