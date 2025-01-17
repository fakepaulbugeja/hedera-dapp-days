import React from "react";
import operator from "../../config.js";
import {
	Client,
	AccountId,
	PrivateKey,
	TokenCreateTransaction,
	TokenMintTransaction,
	FileCreateTransaction,
	ContractCreateTransaction,
	ContractFunctionParameters,
	ContractExecuteTransaction,
	TokenInfoQuery,
	AccountBalanceQuery,
	Hbar,
	ContractInfoQuery,
} from "@hashgraph/sdk";

async function contractDeployFcn(tokenId) {
	const operatorId = AccountId.fromString(operator.id);
	const operatorKey = PrivateKey.fromString(operator.pvkey);
	const client = Client.forTestnet().setOperator(operatorId, operatorKey);

	// STEP 1 ===================================
	console.log(`STEP 1 ===================================`);
	// const bytecode = "../contracts/AssoTransHTS_sol_AssoTransHTS.bin";
	const bytecode =
		"608060405234801561001057600080fd5b50604051610652380380610652833981810160405281019061003291906100db565b806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050610108565b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b60006100a88261007d565b9050919050565b6100b88161009d565b81146100c357600080fd5b50565b6000815190506100d5816100af565b92915050565b6000602082840312156100f1576100f0610078565b5b60006100ff848285016100c6565b91505092915050565b61053b806101176000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063280ad0d114610030575b600080fd5b61004a60048036038101906100459190610323565b61004c565b005b60006100783060008054906101000a900473ffffffffffffffffffffffffffffffffffffffff166100af565b905060006100a860008054906101000a900473ffffffffffffffffffffffffffffffffffffffff163330866101c7565b9050505050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff166349146bde60e01b86866040516024016100e8929190610391565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff83818316178352505050506040516101529190610434565b6000604051808303816000865af19150503d806000811461018f576040519150601f19603f3d011682016040523d82523d6000602084013e610194565b606091505b5091509150816101a55760156101ba565b808060200190518101906101b99190610484565b5b60030b9250505092915050565b600080600061016773ffffffffffffffffffffffffffffffffffffffff1663eca3691760e01b8888888860405160240161020494939291906104c0565b604051602081830303815290604052907bffffffffffffffffffffffffffffffffffffffffffffffffffffffff19166020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff838183161783525050505060405161026e9190610434565b6000604051808303816000865af19150503d80600081146102ab576040519150601f19603f3d011682016040523d82523d6000602084013e6102b0565b606091505b5091509150816102c15760156102d6565b808060200190518101906102d59190610484565b5b60030b92505050949350505050565b600080fd5b60008160070b9050919050565b610300816102ea565b811461030b57600080fd5b50565b60008135905061031d816102f7565b92915050565b600060208284031215610339576103386102e5565b5b60006103478482850161030e565b91505092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b600061037b82610350565b9050919050565b61038b81610370565b82525050565b60006040820190506103a66000830185610382565b6103b36020830184610382565b9392505050565b600081519050919050565b600081905092915050565b60005b838110156103ee5780820151818401526020810190506103d3565b838111156103fd576000848401525b50505050565b600061040e826103ba565b61041881856103c5565b93506104288185602086016103d0565b80840191505092915050565b60006104408284610403565b915081905092915050565b60008160030b9050919050565b6104618161044b565b811461046c57600080fd5b50565b60008151905061047e81610458565b92915050565b60006020828403121561049a576104996102e5565b5b60006104a88482850161046f565b91505092915050565b6104ba816102ea565b82525050565b60006080820190506104d56000830187610382565b6104e26020830186610382565b6104ef6040830185610382565b6104fc60608301846104b1565b9594505050505056fea26469706673582212201812ee5e58a13aa81e4e6ef1c0abdb119d4cd54431dd21873a0dfedbdb553a7464736f6c634300080b0033";
	console.log(`- Done`);

	// STEP 2 ===================================
	console.log(`STEP 2 ===================================`);
	//Create a file on Hedera and store the hex-encoded bytecode
	const fileCreateTx = new FileCreateTransaction().setKeys([operatorKey]).setContents(bytecode).freezeWith(client);
	const fileCreateSign = await fileCreateTx.sign(operatorKey);
	const fileSubmit = await fileCreateSign.execute(client);
	const fileCreateRx = await fileSubmit.getReceipt(client);
	const bytecodeFileId = fileCreateRx.fileId;
	console.log(`- The smart contract bytecode file ID is: ${bytecodeFileId}`);

	// STEP 3 ===================================
	console.log(`STEP 3 ===================================`);
	// Create the smart contract
	const contractInstantiateTx = new ContractCreateTransaction()
		.setBytecodeFileId(bytecodeFileId)
		.setGas(3000000)
		.setConstructorParameters(new ContractFunctionParameters().addAddress(tokenId.toSolidityAddress()));
	const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
	const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
	const cId = contractInstantiateRx.contractId;
	const contractAddress = cId.toSolidityAddress();
	console.log(`- The smart contract ID is: ${cId}`);
	console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

	return cId;
}
export default contractDeployFcn;
