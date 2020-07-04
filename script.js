const elFromCurrency = document.getElementById("fromCurrencyS");
const elToCurrency = document.getElementById("toCurrencyS");
const elFromAmount = document.getElementById("fromAmount");
const elToAmount = document.getElementById("toAmount");
const elSwap = document.getElementById("swap");
const elFromValue = document.getElementById("fromValue");
const elFromCurrencyName = document.getElementById("fromCurrencyName");
const elToValue = document.getElementById("toValue");
const elToCurrencyName = document.getElementById("toCurrencyName");
var currRates = null;

//fetch method after every 1 minute
var getRates = () => {
  let latestRates = fetch(`https://api.exchangeratesapi.io/latest?base=INR`);
  latestRates
    .then((res) => res.json())
    .then((data) => {
      currRates = data.rates;
      //   console.log(currRates.keys());
      fillSelects();
    });
};
var fillSelects = () => {
  let str = "";
  for (let k in currRates) {
    if (k == "INR")
      str += `<option value="${k}" class="opt" selected >${k}</option>`;
    else str += `<option value="${k}" class="opt" >${k}</option>`;
  }
  elFromCurrency.innerHTML = str;
  elToCurrency.innerHTML = str;
  console.log("done");
};

var calculate = function (e) {
  let x = e.target.id;
  console.log(x);
  let fromC = elFromCurrency.options[elFromCurrency.selectedIndex].value;
  let toC = elToCurrency.options[elToCurrency.selectedIndex].value;
  let fromA = elFromAmount.value;
  let toA = elToAmount.value;
  let fromR = currRates[fromC];
  let toR = currRates[toC];
  let rate = toR / fromR;
  if (x != "toAmount" && x != "swap") {
    toA = fromA * rate;
    elToAmount.value = toA.toFixed(3);
    elFromCurrencyName.innerText = fromC;
    elToCurrencyName.innerText = toC;
    elToValue.innerText = rate.toFixed(3);
    console.log(fromC, fromR, fromA, toC, toR, toA);
  } else if (x == "toAmount") {
    fromA = toA / rate;
    elFromAmount.value = fromA.toFixed(3);
  } else {
    let tempC = fromC;
    fromC = toC;
    toC = tempC;
    let tempA = fromA;
    fromA = toA;
    toA = tempA;
    elFromAmount.value = fromA;
    elToAmount.value = toA;
    let tempInd = elFromCurrency.selectedIndex;
    elFromCurrency.selectedIndex = elToCurrency.selectedIndex;
    elToCurrency.selectedIndex = tempInd;
    elFromCurrencyName.innerText = fromC;
    elToCurrencyName.innerText = toC;
    rate = 1 / rate;
    elToValue.innerText = rate.toFixed(3);
  }
};

//ADDING EVENT LISTENERS

elFromCurrency.addEventListener("change", calculate);
elToCurrency.addEventListener("change", calculate);
elFromAmount.addEventListener("input", calculate);
elToAmount.addEventListener("input", calculate);
elSwap.addEventListener("click", calculate);

var init = function () {
  setInterval(getRates(), 60000);
};
init();
