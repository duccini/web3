const Block = require("./block");

class Blockchain {
  constructor() {
    this.chain = [Block.genesis()];
  }

  addBlock(data) {
    const lastBlock = this.chain[this.chain.length - 1];
    const block = Block.mineBlock(lastBlock, data);
    this.chain.push(block);

    return block;
  }

  isValidChain(chain) {
    // Valida se os blocos Genesis são iguais
    if (JSON.stringify(chain[0]) !== JSON.stringify(Block.genesis())) {
      return false;
    }

    // Valida se cada bloco possui o Hash do bloco anterior E
    // se o bloco atual possui Hash válido
    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const lastBlock = chain[i - 1];

      if (
        block.lastHash !== lastBlock.hash ||
        block.hash !== Block.blockHash(block)
      ) {
        return false;
      }
    }

    return true;
  }

  replaceChain(newChain) {
    if (newChain.length <= this.chain.length) {
      console.log("Received chain is not longer than the current chain");
      return;
    } else if (!this.isValidChain(newChain)) {
      console.log("The received chain is not valid");
      return;
    }

    this.chain = newChain;
    console.log("Replacing blockchain with the new chain.");
  }
}

module.exports = Blockchain;
