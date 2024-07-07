const MoodContractAddress = "0x985Be0fC8C612439b38b952e630FEfbf5f6d209F";

const MoodContractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_mood",
				"type": "string"
			}
		],
		"name": "setMood",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMood",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

// Object contain Contract's Address, Contract's ABI and Contract's owner
let MoodContract;

// EOA
let signer; 

// Define an ethers provider. In our case it is Sepolia
const provider = new ethers.providers.Web3Provider(window.ethereum, "sepolia");

/**
 * Request access to the user's wallet and connect the signer to your metamask account (we use [0] as 
 * the default), and define the contract object using your contract address, ABI, and signer
 */

provider.send("eth_requestAccounts", []).then(() => {
  provider.listAccounts().then((accounts) => {
    signer = provider.getSigner(accounts[0]);

    MoodContract = new ethers.Contract(
      MoodContractAddress,
      MoodContractABI,
      signer
    );
  });
});

// Create asynchronous functions to call your smart contract functions
async function getMood() {
  const getMoodPromise = MoodContract.getMood();
  const Mood = await getMoodPromise;
  document.getElementById("showMood").innerText = `Your Mood: ${Mood}`;
  console.log(Mood);
}

async function setMood() {
  const mood = document.getElementById("mood").value;
  const setMoodPromise = MoodContract.setMood(mood);
  await setMoodPromise;
}