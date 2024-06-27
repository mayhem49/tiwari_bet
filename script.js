const form = document.querySelector("#form");

function calcBetAmt({ odd1, odd2, limit, wished_investment: investment }) {
  const p1 = odd2 / (odd1 + odd2);
  const p2 = odd1 / (odd1 + odd2);
  console.log({ odd1, odd2, limit, investment });

  //limit is on p1
  const b1 = limit ? limit : p1 * investment;
  const b2 = limit ? (b1 * p2) / p1 : p2 * investment;
  console.log(b1, b2);
  const actual_investment = limit ? b1 + b2 : investment;
  return [b1, b2, actual_investment];
}

function pretty(float_val) {
  return float_val.toFixed(3);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const odd1 = Number(document.querySelector("#odd1").value);
  const odd2 = Number(document.querySelector("#odd2").value);
  const limit = Number(document.querySelector("#limit").value);
  let wished_investment = Number(document.querySelector("#investment").value);
  const nepal = document.querySelector("#nepal");
  const pound = document.querySelector("#pound");
  const rate = Number(document.querySelector("#rate").value);

  const [b1, b2, actual_investment] = calcBetAmt({
    odd1,
    odd2,
    limit,
    wished_investment,
  });

  console.log([b1, b2, actual_investment]);

  const return_amt = b1 * odd1;
  let p_l = return_amt - actual_investment;
  let pl_percent = (p_l / actual_investment) * 100;

  const nepal_str = `
    <h4> In Nrs. </h4>
    <p>bet1: ${pretty(b1)}</p>
    <p>bet2: ${pretty(b2)}</p>
    <p>return: ${pretty(return_amt)}</p>
    <p class="${p_l > 0 ? "green" : "red"}">${
    p_l > 0 ? "profit" : "loss"
  }: ${pretty(p_l)} (${pretty(pl_percent)}%)</p> `;

  const pound_str = `
    <h4> In pound </h4>
    <p>bet1: ${pretty(b1 / rate)}</p>
    <p>bet2: ${pretty(b2 / rate)}</p>
    <p>return: ${pretty(return_amt / rate)}</p>
    <p class="${p_l > 0 ? "green" : "red"}">${
    p_l > 0 ? "profit" : "loss"
  }: ${pretty(p_l / rate)} (${pretty(pl_percent)}%)</p> `;

  nepal.innerHTML = nepal_str;
  pound.innerHTML = pound_str;
});
