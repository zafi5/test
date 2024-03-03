/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

const { Gateway, Wallets } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const path = require("path");
const {
  buildCAClient,
  registerAndEnrollUser,
  enrollAdmin,
} = require("../../test-application/javascript/CAUtil.js");
const {
  buildCCPOrg1,
  buildWallet,
} = require("../../test-application/javascript/AppUtil.js");
const bodyParser = require("body-parser");

const channelName = process.env.CHANNEL_NAME || "mychannel";
const chaincodeName = process.env.CHAINCODE_NAME || "basic3";

const mspOrg1 = "Org1MSP";
const walletPath = path.join(__dirname, "wallet");
const org1UserId = "javascriptAppUser";

function prettyJSONString(inputString) {
  return JSON.stringify(JSON.parse(inputString), null, 2);
}

async function main() {
  try {
    const ccp = buildCCPOrg1();

    const caClient = buildCAClient(
      FabricCAServices,
      ccp,
      "ca.org1.example.com"
    );

    // setup the wallet to hold the credentials of the application user
    const wallet = await buildWallet(Wallets, walletPath);

    await enrollAdmin(caClient, wallet, mspOrg1);

    await registerAndEnrollUser(
      caClient,
      wallet,
      mspOrg1,
      org1UserId,
      "org1.department1"
    );

    const gateway = new Gateway();

    try {
      await gateway.connect(ccp, {
        wallet,
        identity: org1UserId,
        discovery: { enabled: true, asLocalhost: true }, // using asLocalhost as this gateway is using a fabric network deployed locally
      });

      // Build a network instance based on the channel where the smart contract is deployed
      const network = await gateway.getNetwork(channelName);

      // Get the contract from the network.
      const contract = network.getContract(chaincodeName);

      //create server
      ///////////////////////////////////////////////////

      let express = require("express");
      let app = express();
      const PORT = 3000;

      app.use(express.urlencoded({ extended: false }));
      app.use(express.json());

      app.get("/", function (req, res) {
        res.send("Welcome to e-KYC");
      });

      app.get("/book", function (req, res) {
        res.send("=== Hello Book Readres ===");
      });

      app.post("/register", async function (req, res) {
        // console.log(req.body);
        // res.send("-----Check terminal for output-----");
        const {
          id,
          name,
          fathername,
          mothername,
          gender,
          nid,
          dob,
          presentaddress,
          permanentaddress,
          mobile,
        } = req.body;
        try {
          const result = await contract.submitTransaction(
            "CreateAsset",
            id,
            name,
            fathername,
            mothername,
            gender,
            nid,
            dob,
            presentaddress,
            permanentaddress,
            mobile
          );
          res.send(result.toString());
        } catch (error) {
          res.status(400).send(error.toString());
        }
      });

      var server = app.listen(PORT, function () {
        console.log(`Server listening in Port http://localhost:${PORT}`);
      });

      ///////////////////////////////////////////////////
    } finally {
      // gateway.disconnect();
    }
  } catch (error) {
    console.error(`******** FAILED to run the application: ${error}`);
    process.exit(1);
  }
}

main();
