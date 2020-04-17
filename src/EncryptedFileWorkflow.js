import React from "react";

import EthCrypto from "eth-crypto";
import FileBase64 from "react-file-base64";

//This demo uses https://github.com/pubkey/eth-crypto to encrypt and decrypt a file with ethereum pub/priv keys

class EncryptedFileWorkflow extends React.Component {
  constructor() {
    super();
    this.state = {
      // ethAddress: "0xb550520F22fFb494f862F44A2fe01E1B4e1A86bb",
      // ethPrivateKey:
      //   "0x662466d117f5957c6fe18d029c23a94e3b37b45c83b8dbeeb995e84105a6b35a",
      imageBase64: "",
      decryptedBase64: "",
    };
  }

  encryptAndDecrypt = async (files) => {
    const identity = EthCrypto.createIdentity();
    const privateKey = identity.privateKey;

    // Get base64 version of the image.
    let base64OfImage = files[0].base64;

    // Generate a different type of public key from eth private key
    const encryptionPublicKey = EthCrypto.publicKeyByPrivateKey(privateKey);

    // Generate encrypted blob
    const encrypted = await EthCrypto.encryptWithPublicKey(
      encryptionPublicKey,
      base64OfImage
    );

    console.log("Encrypted Blob (To Be Uploaded)");
    console.log(encrypted);

    // Decrypt image wtih private key
    const decryptedImageBase64 = await EthCrypto.decryptWithPrivateKey(
      privateKey,
      encrypted
    );

    this.setState({ decryptedBase64: decryptedImageBase64 });
  };

  encryptAndDecrptFromSiteDemo = async () => {
    const EthCrypto = require("eth-crypto");

    const alice = EthCrypto.createIdentity();
    const bob = EthCrypto.createIdentity();
    const secretMessage = "My name is Satoshi Buterin";

    const signature = EthCrypto.sign(
      alice.privateKey,
      EthCrypto.hash.keccak256(secretMessage)
    );
    const payload = {
      message: secretMessage,
      signature,
    };
    const encrypted = await EthCrypto.encryptWithPublicKey(
      bob.publicKey, // by encryping with bobs publicKey, only bob can decrypt the payload with his privateKey
      JSON.stringify(payload) // we have to stringify the payload before we can encrypt it
    );
    /*  { iv: 'c66fbc24cc7ef520a7...',
    ephemPublicKey: '048e34ce5cca0b69d4e1f5...',
    ciphertext: '27b91fe986e3ab030...',
    mac: 'dd7b78c16e462c42876745c7...'
      }
  */

    // we convert the object into a smaller string-representation
    const encryptedString = EthCrypto.cipher.stringify(encrypted);
    // > '812ee676cf06ba72316862fd3dabe7e403c7395bda62243b7b0eea5eb..'

    // now we send the encrypted string to bob over the internet.. *bieb, bieb, blob*

    // we parse the string into the object again
    const encryptedObject = EthCrypto.cipher.parse(encryptedString);

    console.log("ABOUT TO DECRYPT");
    const decrypted = await EthCrypto.decryptWithPrivateKey(
      bob.privateKey,
      encryptedObject
    );
    console.log("AFTER DECRYPT");
    const decryptedPayload = JSON.parse(decrypted);

    // check signature
    const senderAddress = EthCrypto.recover(
      decryptedPayload.signature,
      EthCrypto.hash.keccak256(decryptedPayload.message)
    );

    console.log(
      "Got message from " + senderAddress + ": " + decryptedPayload.message
    );
    // > 'Got message from 0x19C24B2d99FB91C5...: "My name is Satoshi Buterin" Buterin'

    const answerMessage = "And I am Bob Kelso";
    const answerSignature = EthCrypto.sign(
      bob.privateKey,
      EthCrypto.hash.keccak256(answerMessage)
    );
    const answerPayload = {
      message: answerMessage,
      signature: answerSignature,
    };

    const alicePublicKey = EthCrypto.recoverPublicKey(
      decryptedPayload.signature,
      EthCrypto.hash.keccak256(payload.message)
    );

    const encryptedAnswer = await EthCrypto.encryptWithPublicKey(
      alicePublicKey,
      JSON.stringify(answerPayload)
    );
    // now we send the encryptedAnswer to alice over the internet.. *bieb, bieb, blob*
  };

  demoTwo = async () => {
    // create identity with key-pairs and address
    const alice = EthCrypto.createIdentity();

    const secretMessage = "My name is Satoshi Buterin";
    const encrypted = await EthCrypto.encryptWithPublicKey(
      alice.publicKey, // encrypt with alice's publicKey
      secretMessage
    );

    const decrypted = await EthCrypto.decryptWithPrivateKey(
      alice.privateKey,
      encrypted
    );

    console.log(decrypted);
  };
  componentDidMount = () => {
    //this.encryptAndDecrptFromSiteDemo();
    this.demoTwo();
  };

  render() {
    return (
      <div style={{ paddingTop: "100px" }}>
        <FileBase64 multiple={true} onDone={this.encryptAndDecrypt} />

        {/* Display decrypted file */}
        {this.state.decryptedBase64 === "" ? (
          <h1>Please Upload File</h1>
        ) : (
          <img src={this.state.decryptedBase64} />
        )}
      </div>
    );
  }
}

export default EncryptedFileWorkflow;
