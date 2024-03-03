/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

"use strict";

// Deterministic JSON.stringify()
const stringify = require("json-stringify-deterministic");
const sortKeysRecursive = require("sort-keys-recursive");
const { Contract } = require("fabric-contract-api");

class AssetTransfer extends Contract {
  async InitLedger(ctx) {
    const customers = [
      {
        ID: "customer1",
        Name: "Alice",
        FatherName: "Turner",
        MotherName: "Maria",
        Gender: "Female",
        NID: "1000100011",
        DOB: "1990-2-24",
        PresentAddress: "123 Main St",
        PermanentAddress: "234 Downtown st",
        Mobile: "01812345678",
      },
      {
        ID: "customer2",
        Name: "Stewart",
        FatherName: "Campbell",
        MotherName: "Amanda",
        Gender: "Male",
        NID: "2000200022",
        DOB: "1992-5-2",
        PresentAddress: "123 Anytown St",
        PermanentAddress: "234 Central st",
        Mobile: "01912345678",
        // KYCStatus: "Pending",
      },
    ];

    for (const customer of customers) {
      customer.docType = "customer";

      await ctx.stub.putState(
        customer.NID,
        Buffer.from(stringify(sortKeysRecursive(customer)))
      );
    }
  }

  // CreateAsset issues a new asset to the world state with given details.
  async CreateAsset(
    ctx,
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
  ) {
    const exists = await this.AssetExists(ctx, nid);
    if (exists) {
      throw new Error(`The asset ${nid} already exists`);
    }

    const customer = {
      ID: id,
      Name: name,
      FatherName: fathername,
      MotherName: mothername,
      Gender: gender,
      NID: nid,
      DOB: dob,
      PresentAddress: presentaddress,
      PermanentAddress: permanentaddress,
      Mobile: mobile,
    };
    // we insert data in alphabetic order using 'json-stringify-deterministic' and 'sort-keys-recursive'
    await ctx.stub.putState(
      nid,
      Buffer.from(stringify(sortKeysRecursive(customer)))
    );
    return JSON.stringify(customer);
  }

  // ReadAsset returns the asset stored in the world state with given id.
  // async ReadAsset(ctx, id) {
  //   const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
  //   if (!assetJSON || assetJSON.length === 0) {
  //     throw new Error(`The asset ${id} does not exist`);
  //   }
  //   return assetJSON.toString();
  // }

  // UpdateAsset updates an existing asset in the world state with provided parameters.

  // AssetExists returns true when asset with given ID exists in world state.
  async AssetExists(ctx, nid) {
    const assetJSON = await ctx.stub.getState(nid);
    return assetJSON && assetJSON.length > 0;
  }
}

module.exports = AssetTransfer;
