const express = require("express");
const bodyParser = require("body-parser");

const Blockchain = require("../core/blockchain");

const PORT = process.env.PORT || 3001;

const server = express();
server.use(bodyParser.json());

const bc = new Blockchain();

server.get("/blocks", (req, res) => {
  res.json(bc.chain);
});

server.post("/mine", (req, res) => {
  const { data } = req.body;
  const block = bc.addBlock(data);

  console.log(`New Block added: ${block.toString()}`);
  res.redirect("/blocks");
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
