const text = document.querySelectorAll('.thePaths');

// 算出每個 svg 的長度
for (let i =0; i < text.length; i++) {
    console.log(`text number ${i} length is ${text[i].getTotalLength()}`);
}

const lastWord = document.querySelector('#svgBottom-9');
const animation = document.querySelector('.animation');
lastWord.addEventListener('animationend', () => {
    // animation.style = 'transition: all 1s ease; opacity: 0, pointer-events:none; display:none';
})
