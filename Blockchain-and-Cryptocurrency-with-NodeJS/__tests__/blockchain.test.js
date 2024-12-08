const Blockchain = require("../core/blockchain");
const Block = require("../core/block");

describe("Blockchain", () => {
  let bc1, bc2;

  beforeEach(() => {
    bc1 = new Blockchain();
    bc2 = new Blockchain();
  });

  it("check if first block of the chain is the Genesis block", () => {
    expect(bc1.chain[0]).toEqual(Block.genesis());
  });

  it("check if the block added to the blockchain has the data sended", () => {
    const data = "foo";
    bc1.addBlock(data);
    expect(bc1.chain[bc1.chain.length - 1].data).toEqual(data);
  });

  it("validates if two chains has the same tow blocks", () => {
    bc2.addBlock("foo");

    expect(bc1.isValidChain(bc2.chain)).toBe(true);
  });

  it("check if chain with different Genesis block return false", () => {
    bc2.chain[0].data = "Bad Data";

    expect(bc1.isValidChain(bc2.chain)).toBe(false);
  });

  it("check if chains with invalidate block outside from Genesis", () => {
    bc1.addBlock("foo");
    bc2.addBlock("foo");
    bc2.chain[1].data = "bar";

    expect(bc1.isValidChain(bc2.chain)).toBe(false);
  });

  it("replaces the chain with a valid chain", () => {
    bc2.addBlock("goo");
    bc1.replaceChain(bc2.chain);

    expect(bc1.chain).toEqual(bc2.chain);
  });

  it("does not replaces the chain with one of less than or eqaul to length", () => {
    bc1.addBlock("foo");
    bc1.replaceChain(bc2.chain);

    expect(bc1.chain).not.toEqual(bc2.chain);
  });
});
