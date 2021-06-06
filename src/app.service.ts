import {Injectable} from '@nestjs/common';


import {Gateway, Wallet, Wallets} from 'fabric-network';

const FabricCAServices = require('fabric-ca-client');

import {CautilService} from "./services/cautil/cautil.service";
import {AppUtilService} from "./services/app-util/app-util.service";
import {Asset} from "./services/models/asset";

const path = require('path');


const channelName = 'mychannel';
const chaincodeName = 'basic';
const mspOrg1 = 'Org1MSP';
const walletPath = path.join(__dirname, 'wallet');
const org1UserId = 'appUser2';

function prettyJSONString(inputString) {
    return JSON.stringify(JSON.parse(inputString), null, 2);
}


@Injectable()
export class AppService {

    adminUserId = 'admin';

    constructor(private caUtils: CautilService,
                private appUtils: AppUtilService) {


    }

    getHello(): string {

        return 'Hello World!';
    }

    async getAssets() {
        return new Promise(async (resolve, reject) => {
            let assets = {};
            try {
                // build an in memory object with the network configuration (also known as a connection profile)
                const ccp = this.appUtils.buildCCPOrg1();

                // build an instance of the fabric ca services client based on
                // the information in the network configuration
                // const caClient = this.caUtils.buildCAClient(FabricCAServices, ccp, 'ca.org1.example.com');


                // setup the wallet to hold the credentials of the application user
                const wallet = await this.appUtils.buildWallet(Wallets, walletPath);

                console.log(wallet)
                // in a real application this would be done on an administrative flow, and only once
                // await this.caUtils.enrollAdmin(caClient, wallet, mspOrg1);

                // in a real application this would be done only when a new user was required to be added
                // and would be part of an administrative flow
                // await this.caUtils.registerAndEnrollUser(caClient, wallet, mspOrg1, org1UserId, 'org1.department1');

                // Create a new gateway instance for interacting with the fabric network.
                // In a real application this would be done as the backend server session is setup for
                // a user that has been verified.
                const gateway = new Gateway();

                try {
                    // setup the gateway instance
                    // The user will now be able to create connections to the fabric network and be able to
                    // submit transactions and query. All transactions submitted by this gateway will be
                    // signed by this user using the credentials stored in the wallet.
                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: {enabled: true, asLocalhost: true} // using asLocalhost as this gateway is using a fabric network deployed locally
                    });

                    // Build a network instance based on the channel where the smart contract is deployed
                    const network = await gateway.getNetwork(channelName);

                    // Get the contract from the network.
                    const contract = network.getContract(chaincodeName);

                    // Initialize a set of asset data on the channel using the chaincode 'InitLedger' function.
                    // This type of transaction would only be run once by an application the first time it was started after it
                    // deployed the first time. Any updates to the chaincode deployed later would likely not need to run
                    // an "init" type function.
                    // console.log('\n--> Submit Transaction: InitLedger, function creates the initial set of assets on the ledger');
                    // await contract.submitTransaction('InitLedger');
                    // console.log('*** Result: committed');

                    // Let's try a query type operation (function).
                    // This will be sent to just one peer and the results will be shown.
                    console.log('\n--> Evaluate Transaction: GetAllAssets, function returns all the current assets on the ledger');
                    let result = await contract.evaluateTransaction('GetAllAssets');
                    // console.log(result.toString())
                    console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                    assets = prettyJSONString(result.toString());
                    resolve(assets)
                } catch (error) {
                    reject(error)
                } finally {
                    // Disconnect from the gateway when the application is closing
                    // This will close all connections to the network
                    gateway.disconnect();
                }
            } catch (error) {
                console.error(`******** FAILED to run the application: ${error}`);
                reject(error)
            }
        })
    }

    async postAsset(newAsset: Asset) {
        return new Promise(async (resolve, reject) => {
            let assets = {};
            try {
                // build an in memory object with the network configuration (also known as a connection profile)
                const ccp = this.appUtils.buildCCPOrg1();

                // setup the wallet to hold the credentials of the application user
                const wallet = await this.appUtils.buildWallet(Wallets, walletPath);


                // Create a new gateway instance for interacting with the fabric network.
                // In a real application this would be done as the backend server session is setup for
                // a user that has been verified.
                const gateway = new Gateway();

                try {
                    // setup the gateway instance
                    // The user will now be able to create connections to the fabric network and be able to
                    // submit transactions and query. All transactions submitted by this gateway will be
                    // signed by this user using the credentials stored in the wallet.
                    await gateway.connect(ccp, {
                        wallet,
                        identity: org1UserId,
                        discovery: {enabled: true, asLocalhost: true} // using asLocalhost as this gateway is using a fabric network deployed locally
                    });

                    // Build a network instance based on the channel where the smart contract is deployed
                    const network = await gateway.getNetwork(channelName);

                    // Get the contract from the network.
                    const contract = network.getContract(chaincodeName);

                    // This will be sent to just one peer and the results will be shown.
                    console.log('\n--> Submit Transaction: CreateAsset, creates new asset with ID, color, owner, size, and appraisedValue arguments');
                    console.log(newAsset);
                    let result = await contract.submitTransaction('CreateAsset', newAsset.ID, newAsset.Color,
                        newAsset.Size.toString(), newAsset.Owner, newAsset.AppraisedValue.toString());

                    console.log('*** Result: committed');
                    if (`${result}` !== '') {
                        console.log(`*** Result: ${prettyJSONString(result.toString())}`);
                        assets = prettyJSONString(result.toString());
                        resolve(assets)
                    }

                } catch (error) {
                    reject(error)
                } finally {
                    // Disconnect from the gateway when the application is closing
                    // This will close all connections to the network
                    gateway.disconnect();
                }
            } catch (error) {
                console.error(`******** FAILED to run the application: ${error}`);
                reject(error)
            }
        })

    }


}
