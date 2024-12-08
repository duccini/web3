require("dotenv").config();

const axios = require("axios");
const crypto = require("crypto");

const SYMBOL = "BTCUSDT";
// const SYMBOL = "BNBUSDT";

const BUY_PRICE = 58189.15;
const SELL_PRICE = 58771.04;
const API_KEY = process.env.API_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const QUANTITY = "0.001";

const API_URL = "https://testnet.binance.vision";
// const API_URL = "https://api.binance.com";

const URL = API_URL + "/api/v3/klines?limit=21&interval=15m&symbol=" + SYMBOL;

// Posição comprada
let isOpened = false;

// Acompanhamento
let count = 0;

// Simple Moving Average
function calcSMA(data) {
  // pegar o valor de fechamento de cada uma das velas em data
  const closes = data.map((candle) => parseFloat(candle[4]));

  // calcular media
  const sum = closes.reduce((a, b) => a + b);
  return sum / data.length;
}

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
  console.log("Compras: " + count);
  console.log("Price " + price);

  // const sma13 = calcSMA(data.slice(8));
  // const sma21 = calcSMA(data);

  const sma = calcSMA(data);

  console.log(
    "============================================================================="
  );

  // console.log("SMA 13: " + sma13);
  // console.log("SMA 21: " + sma21);
  // console.log("Is Opened? " + isOpened);

  console.log("SMA: " + sma);
  console.log("Is Opened? " + isOpened);
  /**
   *  Estratégias:
   *  A SMA13 reage mais rapidamente ao mercado, é mais sensível
   *  A SMA21 é mais lenta
   *
   *  BUY
   *  price <= BUY_PRICE
   *  sma13 > sma21
   *  price <= sma * 0.9 && isOpened === false
   *
   *  SELL
   *  price >= SELL_PRICE
   *  sma13 < sma21
   *  price >= sma * 1.1 && isOpened === true
   *
   *  A amplitude pode não ser suficiente para gerar lucro
   *  Alterar o intervalo de 15m
   *  Alterar as médias sma30, sma50
   *
   */

  // if (price <= 100000 && isOpened === false) {
  if (price <= sma * 0.9 && isOpened === false) {
    newOrder(SYMBOL, QUANTITY, "buy");
    isOpened = true;
  } else if (price >= sma * 1.1 && isOpened === true) {
    newOrder(SYMBOL, QUANTITY, "sell");
    isOpened = false;
    count = count + 1;
  } else {
    console.log("Stand by...");
  }
}

async function newOrder(symbol, quantity, side) {
  const order = { symbol, quantity, side };

  order.type = "MARKET"; // Preço a mercado
  order.timestamp = Date.now();

  /**
   *  createHmac tipo de assinatura digital
   *  update gera bits
   *  digest transforma os bytes em uma string hexadecimal
   */
  const signature = crypto
    .createHmac("sha256", SECRET_KEY)
    .update(new URLSearchParams(order).toString())
    .digest("hex");

  order.signature = signature;

  try {
    const { data } = await axios.post(
      API_URL + "/api/v3/order",
      new URLSearchParams(order).toString(),
      {
        headers: {
          "X-MBX-APIKEY": API_KEY,
        },
      }
    );
    console.log(data);
  } catch (err) {
    console.error(err.response.data);
  }
}

setInterval(start, 3000);
