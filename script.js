const form = document.querySelector("#form");

document.addEventListener("DOMContentLoaded", () => {
  const rate_el = document.querySelector("#rate");
  const rate = getRate();
  rate_el.value = rate || 0;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const odd1 = Number(document.querySelector("#odd1").value);
  const odd2 = Number(document.querySelector("#odd2").value);
  const odd3 = Number(document.querySelector("#odd3").value);

  const limit = Number(document.querySelector("#limit").value);
  const nepal_el = document.querySelector("#result>#nepal");
  const pound_el = document.querySelector("#result>#pound");
  const rate = Number(document.querySelector("#rate").value);

  const currency = document.querySelector(
    'input[name="currency"]:checked'
  ).value;

  setRate(rate);

  let odds = [odd1, odd2, odd3];
  const { bet_amount, investment, return_amount } = bet_calculator(odds, limit);

  let pl = return_amount - investment;
  let pl_percent = (pl / investment) * 100;

  const bet_amount_with_label = bet_amount.map(([index, value]) => [
    `bet${index + 1}`,
    value,
  ]);

  const render_data_default = [
    ...bet_amount_with_label,
    ["return", return_amount],
    ["investment", return_amount],
    ["pl", pl],
  ];

  const render_data_alternate = render_data_default.map(([label, value]) => {
    const alternate_value = currency === "pound" ? value * rate : value / rate;
    return [label, alternate_value];
  });

  let render_data_nrs =
    currency === "pound" ? render_data_alternate : render_data_default;
  let render_data_pound =
    currency === "pound" ? render_data_default : render_data_alternate;

  nepal_el.innerHTML = create_render_str("nrs", render_data_nrs, pl_percent);
  pound_el.innerHTML = create_render_str(
    "pound",
    render_data_pound,
    pl_percent
  );
});

// for  a b c d calculates: abc+bcd+cda+dab
// reducer returns the number from array item
function cyclic_sum(
  arr,
  reducer = function (el) {
    return el;
  }
) {
  let result = arr.reduce((acc, el, i) => {
    let sum = arr.reduce((inner_acc, el, j) => {
      return i == j ? inner_acc : inner_acc * reducer(el);
    }, 1);
    return sum + acc;
  }, 0);
  return result;
}

// returns the product of all element excluding the index element
// reducer returns the number from array item
function partial_cyclic_sum(
  arr,
  index,
  reducer = function (el) {
    return el;
  }
) {
  return arr.reduce((acc, el, i) => (i == index ? acc : acc * reducer(el)), 1);
}

// note: limit is bound to odds[0]
// so any access with 0 index is and only should be done with 0
function bet_calculator(odds, limit) {
  if (odds.length > 0 && !odds[0]) {
    //since limit is assumed to be related to first odd amount,
    //return if first odd amount is invalid
    //which would otherwise be filtered in next step
    alert("First odd input can't be empty or invalid");
    return {
      bet_amount: odds.map((_el, index) => [index, 0]),
      investment: 0,
      return_amount: 0,
    };
  }

  const valid_odds = odds
    .map((odd, index) => [index, odd])
    .filter(([_, odd]) => Boolean(odd));

  const reducer = ([_, el]) => el;
  const den = cyclic_sum(valid_odds, reducer);

  const proportion = valid_odds.map((odd, index, arr) => {
    const num = partial_cyclic_sum(arr, index, reducer);
    return num / den;
  });

  const bet_amount = proportion.map((p) => {
    return p * (limit / proportion[0]);
  });

  const bet_amound_with_index = valid_odds.map(([index, _odd]) => [
    index,
    bet_amount[index],
  ]);

  const investment = bet_amount.reduce((el, acc) => el + acc);
  const return_amount = bet_amount[0] * odds[0];

  return {
    bet_amount: bet_amound_with_index,
    investment,
    return_amount,
  };
}

function pretty(float_val) {
  return float_val.toFixed(4);
}

function getRate() {
  return localStorage.getItem("exchange_rate");
}

function setRate(value) {
  //todo: check before set
  localStorage.setItem("exchange_rate", value);
}

function create_render_str(currency, data_label, pl_percent) {
  const render_str = [`<h4> In ${currency} </h4>`];

  for (const [label, value] of data_label) {
    render_str.push(`<p>${label}: ${pretty(value)}</p>`);
  }
  const [_label, pl] = data_label.find(([label, value]) => label == "pl");

  const pl_str = `
  <p class="${pl > 0 ? "green" : "red"}">
    ${pl > 0 ? "profit" : "loss"}: ${pretty(pl)} (${pretty(pl_percent)}%)
  </p> `;
  render_str.push(pl_str);
  return render_str.join("");
}
