const updateMarketValue = function (ele) {
  let sharesOwned = parseFloat($(ele).find(".shares input").val());
  let marketPrice = parseFloat($(ele).find(".marketPrice input").val());
  let marketValue = sharesOwned * marketPrice;
  $(ele).children(".marketValue").html(marketValue);

  return marketValue;
};

const updateUnrealizedProfit = function (ele, marketValue) {
  let sharesOwned = parseFloat($(ele).find(".shares input").val());

  let costPerShare = parseFloat($(ele).find(".cost input").val());
  let costOfPurchase = sharesOwned * costPerShare;
  let unrealizeProfit = marketValue - costOfPurchase;
  $(ele).children(".profit").html(unrealizeProfit);

  return unrealizeProfit;
};

const updatePortfolioValueAndProfit = function () {
  let stocksMarketValue = [];
  let stocksUnrealizedProfit = [];
  $("tbody tr").each(function (i, ele) {
    let marketValue = updateMarketValue(ele);
    stocksMarketValue.push(marketValue);
    let unrealizedProfit = updateUnrealizedProfit(ele, marketValue);
    stocksUnrealizedProfit.push(unrealizedProfit);
  });
  let portfolioMarketValue = stocksMarketValue.reduce(sum);
  let portfolioUnrealizedProfit = stocksUnrealizedProfit.reduce(sum);

  $("#portfolioValue").html(portfolioMarketValue);
  $("#portfolioProfit").html(portfolioUnrealizedProfit);
};

const sum = function (acc, x) {
  return acc + x;
};

$(document).ready(function () {
  updatePortfolioValueAndProfit();

  $(document).on("click", ".btn.remove", function (event) {
    $(this).closest("tr").remove();
    updatePortfolioValueAndProfit();
  });

  let timeout;

  $("tr input").on("input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      updatePortfolioValueAndProfit();
    }, 1000);
    updatePortfolioValueAndProfit();
  });

  $("#addStock").on("submit", function (event) {
    event.preventDefault();
    let name = $(this).children("[name=name]").val();
    let shares = $(this).children("[name=shares]").val();
    let cost = $(this).children("[name=cost]").val();
    let marketPrice = $(this).children("[name=marketPrice]").val();

    $("tbody").append(
      "<tr>" +
        '<td class="name">' +
        name +
        "</td>" +
        '<td class="shares"><input type="number" value="' +
        shares +
        '" /></td>' +
        '<td class="cost"><input type="number" value="' +
        cost +
        '" /></td>' +
        '<td class="marketPrice"><input type="number" value="' +
        marketPrice +
        '" /></td>' +
        '<td class="marketValue"></td>' +
        '<td class="profit"></td>' +
        '<td><button class="btn btn-light btn-sm remove">remove</button></td>' +
        "</tr>"
    );
    updatePortfolioValueAndProfit();
    $(this).children("[name=name]").val("");
    $(this).children("[name=shares]").val("");
    $(this).children("[name=cost]").val("");
    $(this).children("[name=marketPrice]").val("");
  });
});
