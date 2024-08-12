const axios = require("axios");

const SYMBOL = "BTCUSDT";
const BUY_PRICE = 58258;
const SELL_PRICE = 58841;

const API_URL = "https://testnet.binance.vision";

const URL = API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL;

// Posição comprada
let isOpened = false;

async function start() {
  const { data } = await axios.get(URL);

  /**
   *  O - H - L - C
   *  Open - High - Low - Close
   * Close: valor de fechamento da vela, valor mais atualizado
   */
  const last_candle = data[data.length - 1];

  const price = parseFloat(last_candle[4]);

  console.clear();
  console.log("Price " + price);

  if (price <= BUY_PRICE && isOpened === false) {
    console.log("Buy...");
    isOpened = true;
  } else if (price >= SELL_PRICE && isOpened === true) {
    console.log("Sell...");
    isOpened = false;
  } else {
    console.log("Stand by...");
  }
}

setInterval(start, 3000);
