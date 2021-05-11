const currencyLeft = document.querySelectorAll('.leftCurrency');
const currencyRight = document.querySelectorAll('.rightCurrency');
const currencyLeftSelect = document.querySelector('.leftCurrencySelect');
const currencyRightSelect = document.querySelector('.rightCurrencySelect');
const fixedLeft = document.querySelectorAll('.fixedLeft');
const fixedRight = document.querySelectorAll('.fixedRight');
const currenciesAllLeft = document.querySelector('.currenciesAllLeft');
const currenciesAllRight = document.querySelector('.currenciesAllRight');
const inputLeft = document.querySelector('.input-left');
const inputRight = document.querySelector('.input-right');

const exchangeRate1 = document.querySelector('.rate-input');
const exchangeRate2 = document.querySelector('.rate-output');
const reverseCalc = document.querySelector('#revers');
const mask = document.querySelector('.mask');

let leftCurrency = 'RUB';
let rightCurrency = 'USD';

let exchangeRightLeft = 0;
let exchengeLeftRight = 0;

let flag = false;




const showLoader = function() {
    setTimeout(function() {
        if (!flag) { 
        mask.style.display = "flex";
        }
      }, 200); 

}
      
const fetchData = async () => {
    if (leftCurrency === rightCurrency) {
        exchangeRightLeft = 1;
        exchengeLeftRight = 1;
        exchangeRate1.innerHTML = `1 ${leftCurrency} = ${exchangeRightLeft} ${rightCurrency}`; 
        exchangeRate2.innerHTML = `1 ${rightCurrency} = ${exchengeLeftRight} ${leftCurrency}`;
        inputRight.value = inputLeft.value;
    } else try {
        showLoader();
        flag = false;
        const response = await fetch(`https://api.ratesapi.io/api/latest?base=${leftCurrency}&symbols=${rightCurrency}`)
        const data = await response.json();
        exchangeRightLeft = data.rates[rightCurrency];
        
        const resp = await fetch(`https://api.ratesapi.io/api/latest?base=${rightCurrency}&symbols=${leftCurrency}`)
        const data2 = await resp.json();
        exchengeLeftRight = data2.rates[leftCurrency];
        flag = true;
        mask.style.display = "none";
        exchangeRate1.innerHTML = `1 ${leftCurrency} = ${exchangeRightLeft.toFixed(4)} ${rightCurrency}`; 
        exchangeRate2.innerHTML = `1 ${rightCurrency} = ${exchengeLeftRight.toFixed(4)} ${leftCurrency}`; 
        calcinputLeftTo();  
    } catch (err) {
        console.error(err);
        alert('Что-то пошло нет так');
    }
    
    
    
}

fetchData();

fixedLeft.forEach((elem) => {
    elem.addEventListener('click', () => {
        leftCurrency = elem.innerHTML
        currencyLeft.forEach((el) => {
            el.classList.remove('activ')
         })     
        elem.classList.add('activ');
        fetchData();
    })
})
fixedRight.forEach((elem) => {
    elem.addEventListener('click', () => {
        rightCurrency = elem.innerHTML
        currencyRight.forEach((el) => {
            el.classList.remove('activ')
         })     
        elem.classList.add('activ');
        fetchData();
    })
})

currencyLeftSelect.addEventListener('change', () => {
    leftCurrency = currencyLeftSelect.value;
    fetchData();
    currencyLeft.forEach((el) =>{
        el.classList.remove('activ')
    })     
    currencyLeftSelect.classList.add('activ');
})
currencyRightSelect.addEventListener('change', () => {
    rightCurrency = currencyRightSelect.value;
    fetchData(); 
    
    currencyRight.forEach((el) =>{
        el.classList.remove('activ')
    })     
    currencyRightSelect.classList.add('activ');
    console.log(rightCurrency)
})


function validate() {
    inputLeft.value = inputLeft.value.replace(/,/g, ".").replace(/[^\d,\.]/g, "");
    console.log(inputLeft.value);
}
function validate2() {
    inputRight.value = inputRight.value.replace(/,/g, ".").replace(/[^\d,\.]/g, "");
    
}

inputLeft.addEventListener('input', () => {
    calcinputLeftTo();
    fetchData();
})
inputRight.addEventListener('input', () => {
    calcInputToFrom();    
})

function calcinputLeftTo() {
    inputRight.value = ((parseFloat(inputLeft.value)) * exchangeRightLeft).toFixed(4);
}
function calcInputToFrom() {
    inputLeft.value = ((parseFloat(inputRight.value)) * exchengeLeftRight).toFixed(4);
}

reverseCalc.addEventListener('click', () => {
    let a = leftCurrency;
    let b = rightCurrency;
    leftCurrency = b;
    rightCurrency = a;

   let selectFromIndex = currencyLeftSelect.selectedIndex;
   let selectToIndex = currencyRightSelect.selectedIndex;

   currencyLeftSelect.getElementsByTagName('option')[selectToIndex].selected = 'selected';
   currencyRightSelect.getElementsByTagName('option')[selectFromIndex].selected = 'selected';

   currencyLeft.forEach(el =>  
        el.classList.remove('activ'))
        fixedLeft.forEach(el => {
        if (el.innerHTML === leftCurrency) {
            el.classList.add('activ');
        }          
    })

   if (document.querySelectorAll('.currenciesAllLeft div.activ').length === 0) {
        currencyLeftSelect.classList.add('activ');
   }
   currencyRight.forEach(el => {
        el.classList.remove('activ')
    })
    fixedRight.forEach(el => {
        if (el.innerHTML === rightCurrency) {
            el.classList.add('activ');
        } 
    })

   if (document.querySelectorAll('.currenciesAllRight div.activ').length === 0) {
        currencyRightSelect.classList.add('activ');
   }
   fetchData();   
})