import { googleAPIKey, yahooAPIKey } from "../config.js";

// Just-validate configuration settings:
const validation = new JustValidate("#futureValue-form", {
  errorFieldCssClass: "is-invalid",
  successFieldCssClass: "is-valid",
  errorLabelCssClass: "is-label-invalid",
  focusInvalidField: "true",
  lockForm: "true",
  tooltip: {
    position: "right",
  },
});

//connect to user input
let tspBalance = document.querySelector("#tspBalance");
let ppContributions = document.querySelector("#ppContribution");
let returnRate = document.querySelector("#returnRate");
let futureYears = document.querySelector("#futureYears");
let calculateButton = document.querySelector(".calculate__btn");

//Variable declarations:
let foundError = false;

//Number(Currency) formatting:
let usCurrency = Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

//Input validation functions:
function checkValidNumber(input) {
  if (isNaN(input.value) || input.value == "" || input.value < 0) {
    foundError = true;
    showError(input);
  } else {
    resetClass(input);
    foundError = false;
  }
}

function showError(input) {
  const dollarFlex = input.parentElement;
  const formControl = dollarFlex.parentElement;
  formControl.className = "form-control error";
}

function resetClass(input) {
  const dollarFlex = input.parentElement;
  const formControl = dollarFlex.parentElement;
  formControl.className = "form-control";
}

//Calculate the future value of the user's TSP balance:
function calculateTSPValue() {
  const currentBalance = parseFloat(tspBalance.value);
  const yearlyContribution = parseFloat(ppContributions.value) * 26;
  const annualizedRate = 1 + parseFloat(returnRate.value) * 0.01;
  const years = parseInt(futureYears.value);

  //year 1:
  let futureBalance = (currentBalance + yearlyContribution) * annualizedRate;
  //subsequent years:
  for (let i = 1; i < years; i++) {
    // let updatedBalance = futureBalance;
    futureBalance = (futureBalance + yearlyContribution) * annualizedRate;
  }
  // console.log(usCurrency.format(futureBalance));
  document.querySelector(
    ".tsp__results"
  ).innerHTML = `The estimated value of your TSP account in ${years} years will be ${usCurrency.format(
    futureBalance
  )}`;
}

//Event Listeners:
calculateButton.addEventListener("click", () => {
  //run through numerical validations for each input field
  checkValidNumber(tspBalance);
  if (!foundError) {
    checkValidNumber(ppContributions);
  }
  if (!foundError) {
    checkValidNumber(returnRate);
  }
  if (!foundError) {
    checkValidNumber(futureYears);
  }
  if (!foundError) {
    //finally calculate the total result if no errors
    calculateTSPValue();
  }
});

//Form Validations:
validation
  .addField("#tspBalance", [
    { rule: "required", errorMessage: "Please enter your current TSP balance" },
    { rule: "minNumber", value: 0 },
    { rule: "maxNumber", value: 99000000 },
  ])
  .addField("#ppContribution", [
    {
      rule: "required",
      errorMessage: "Please enter total pay period contributions",
    },
    { rule: "minNumber", value: 0 },
    { rule: "maxNumber", value: 25000 },
  ])
  .addField("#returnRate", [
    { rule: "required", errorMessage: "Please enter the expected Return Rate" },
    { rule: "minNumber", value: 0 },
    { rule: "maxNumber", value: 99.9 },
  ])
  .addField("#futureYears", [
    {
      rule: "required",
      errorMessage: "Please enter the number of years until retirement",
    },
    { rule: "minNumber", value: 0 },
    { rule: "maxNumber", value: 99 },
  ]);

//Yahoo finance API via RAPIDAPI
const encodedParams = new URLSearchParams();
encodedParams.append("symbol", "COST");
encodedParams.append("period", "1d");

// const options = {
//   method: "POST",
//   headers: {
//     "content-type": "application/x-www-form-urlencoded",
//     "X-RapidAPI-Key": yahooAPIKey,
//     "X-RapidAPI-Host": "yahoo-finance97.p.rapidapi.com",
//   },
//   body: encodedParams,
// };

// fetch("https://yahoo-finance97.p.rapidapi.com/price", options)
//   .then((response) => response.json())
//   .then((response) => {
//     console.log(response.data);
//     document.querySelector("#marketData").innerHTML =
//       "COSTCO: " + response.data[0].Close;
//   })
//   .catch((err) => console.error(err));

// Google Finance API (indexes):
const indexOptions = {
  method: "GET",
  headers: {
    "X-RapidAPI-Key": googleAPIKey,
    "X-RapidAPI-Host": "google-finance4.p.rapidapi.com",
  },
};

// fetch(
//   "https://google-finance4.p.rapidapi.com/market-trends/?t=indexes&s=americas&hl=en&gl=US",
//   indexOptions
// )
//   .then((response) => response.json())
//   .then((response) => {
//     let SP500Title = response.items[0].info.title;
//     let sp500Value = usCurrency.format(response.items[0].price.last.value);
//     let DJIAtitle = response.items[1].info.title;
//     let DJIAvalue = usCurrency.format(response.items[1].price.last.value);
//     let nasdaqTitle = response.items[2].info.title;
//     let nasdaqValue = usCurrency.format(response.items[2].price.last.value);
//     let russellTitle = response.items[3].info.title;
//     let russellValue = usCurrency.format(response.items[3].price.last.value);

//     //Set HTML content:
//     document.querySelector("#sp500").innerHTML = `${SP500Title}: ${sp500Value}`;
//     document.querySelector("#djia").innerHTML = `${DJIAtitle}: ${DJIAvalue}`;
//     document.querySelector(
//       "#nasdaq"
//     ).innerHTML = `${nasdaqTitle}: ${nasdaqValue}`;
//     document.querySelector(
//       "#russell"
//     ).innerHTML = `${russellTitle}: ${russellValue}`;
//     // console.log(response);
//   })
//   .catch((err) => console.error(err));
