const form = document.querySelector("#form");

function calcBetAmt({ odd1, odd2, limit, wished_investment: investment }) {
  const p1 = odd2 / (odd1 + odd2);
  const p2 = odd1 / (odd1 + odd2);

  //limit is on p1
  const b1 = limit ? limit : p1 * investment;
  const b2 = limit ? (b1 * p2) / p1 : p2 * investment;
  const actual_investment = limit ? b1 + b2 : investment;
  return [b1, b2, actual_investment];
}

function pretty(float_val) {
  return float_val.toFixed(3);
}

function getRate() {
  return localStorage.getItem("exchange_rate");
}
function setRate(value) {
  localStorage.setItem("exchange_rate", value);
}

document.addEventListener("DOMContentLoaded", () => {
  const rate_el = document.querySelector("#rate");
  const rate = getRate();
  rate_el.value = rate || 0;
});
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const odd1 = Number(document.querySelector("#odd1").value);
  const odd2 = Number(document.querySelector("#odd2").value);
  const limit = Number(document.querySelector("#limit").value);
  let wished_investment = Number(document.querySelector("#investment").value);
  const nepal_el = document.querySelector("#result>#nepal");
  const pound_el = document.querySelector("#result>#pound");
  const rate = Number(document.querySelector("#rate").value);

  const currency = document.querySelector(
    'input[name="currency"]:checked'
  ).value;

  setRate(rate);

  const [b1, b2, actual_investment] = calcBetAmt({
    odd1,
    odd2,
    limit,
    wished_investment,
  });

  const return_amt = b1 * odd1;
  let pl = return_amt - actual_investment;
  let pl_percent = (pl / actual_investment) * 100;

  const render_data_default = [b1, b2, return_amt, pl];
  const render_data_alternate = [b1, b2, return_amt, pl].map((el) => {
    return currency === "pound" ? el * rate : el / rate;
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

function create_render_str(currency, data, pl_percent) {
  const [b1, b2, return_amt, pl] = data;
  return `
    <h4> In ${currency} </h4>
    <p>bet1: ${pretty(b1)}</p>
    <p>bet2: ${pretty(b2)}</p>
    <p>return: ${pretty(return_amt)}</p>
    <p class="${pl > 0 ? "green" : "red"}">${
    pl > 0 ? "profit" : "loss"
  }: ${pretty(pl)} (${pretty(pl_percent)}%)</p> `;
}
