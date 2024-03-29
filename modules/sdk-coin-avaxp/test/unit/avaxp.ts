import * as AvaxpLib from '../../src/lib';
import { TestBitGo, TestBitGoAPI } from '@bitgo/sdk-test';
import { AvaxP, TavaxP } from '../../src/';
import { randomBytes } from 'crypto';
import * as should from 'should';
import { BitGoAPI } from '@bitgo/sdk-api';
import { coins } from '@bitgo/statics';
import * as testData from '../resources/avaxp';
import { keychains } from '../resources/keychains';
import { Utils as KeyPairUtils } from '../../src/lib/utils';
import { KeyPair } from '../../src/lib';
import { Buffer as BufferAvax } from 'avalanche';
import * as _ from 'lodash';

import { HalfSignedAccountTransaction, TransactionType } from '@bitgo/sdk-core';
import { IMPORT_P } from '../resources/tx/importP';
import {
  ADDVALIDATOR_SAMPLES,
  EXPORT_P_2_C,
  EXPORT_P_2_C_VERIFY,
  EXPORT_P_2_C_WITHOUT_CHANGEOUTPUT,
} from '../resources/avaxp';
import { IMPORT_C } from '../resources/tx/importC';
import { EXPORT_C } from '../resources/tx/exportC';
import assert from 'assert';

describe('Avaxp', function () {
  const coinName = 'avaxp';
  const tcoinName = 't' + coinName;
  let bitgo: TestBitGoAPI;
  let basecoin;
  let newTxPrebuild;
  let newTxParams;

  const txPrebuild = {
    txHex: testData.ADDVALIDATOR_SAMPLES.unsignedTxHex,
    txInfo: {},
  };

  const txParams = {
    recipients: [],
    type: 'AddValidator',
    stakingOptions: {
      startTime: testData.ADDVALIDATOR_SAMPLES.startTime,
      endTime: testData.ADDVALIDATOR_SAMPLES.endTime,
      nodeID: testData.ADDVALIDATOR_SAMPLES.nodeID,
      amount: testData.ADDVALIDATOR_SAMPLES.minValidatorStake,
      delegationFeeRate: testData.ADDVALIDATOR_SAMPLES.delegationFee,
    },
    locktime: 0,
  };

  before(function () {
    bitgo = TestBitGo.decorate(BitGoAPI, {
      env: 'mock',
    });
    bitgo.initializeTestVars();
    bitgo.safeRegister(coinName, AvaxP.createInstance);
    bitgo.safeRegister(tcoinName, TavaxP.createInstance);
    basecoin = bitgo.coin(tcoinName);
    newTxPrebuild = () => {
      return _.cloneDeep(txPrebuild);
    };
    newTxParams = () => {
      return _.cloneDeep(txParams);
    };
  });

  it('should instantiate the coin', function () {
    let localBasecoin = bitgo.coin(tcoinName);
    localBasecoin.should.be.an.instanceof(TavaxP);

    localBasecoin = bitgo.coin(coinName);
    localBasecoin.should.be.an.instanceof(AvaxP);
  });

  it('should return ' + tcoinName, function () {
    basecoin.getChain().should.equal(tcoinName);
  });

  it('should return full name', function () {
    basecoin.getFullName().should.equal('Testnet Avalanche P-Chain');
  });

  describe('Keypairs:', () => {
    it('should generate a keypair from random seed', function () {
      const keyPair = basecoin.generateKeyPair();
      keyPair.should.have.property('pub');
      keyPair.should.have.property('prv');
    });

    it('should generate a keypair from a seed', function () {
      const seedText = testData.SEED_ACCOUNT.seed;
      const seed = Buffer.from(seedText, 'hex');
      const keyPair = basecoin.generateKeyPair(seed);
      keyPair.pub.should.equal(testData.SEED_ACCOUNT.publicKey);
      keyPair.prv.should.equal(testData.SEED_ACCOUNT.privateKey);
    });

    it('should validate a public key', function () {
      const keyPair = basecoin.generateKeyPair();
      keyPair.should.have.property('pub');
      keyPair.should.have.property('prv');

      basecoin.isValidPub(keyPair.pub).should.equal(true);
    });

    it('should validate a private key', function () {
      const keyPair = basecoin.generateKeyPair();
      keyPair.should.have.property('pub');
      keyPair.should.have.property('prv');

      basecoin.isValidPrv(keyPair.prv).should.equal(true);
    });
  });

  describe('Sign Transaction', () => {
    const factory = new AvaxpLib.TransactionBuilderFactory(coins.get(tcoinName));

    it('build and sign an AddPermissionlessValidator transaction', async () => {
      // TODO (CR-1073): Use transction built from PermissionlessValidatorTxBuilder
      const rawTx =
        '0x000000000019000000050000000000000000000000000000000000000000000000000000000000000000000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000700000000000f424000000000000000000000000100000001bb6de9adcfbf2e0dfeffbe7792afd0c4085fdd3700000002838f002bb625807c559dd1980cd471b4f54a7b7302fd9af016ccca1046f18d5b000000003d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa0000000500000000000f42400000000100000000b0a0dc0114f9870ed1d35d9299c9ddcd317cafaf742bac42d7e96d4e2a9c4e60000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa00000005000000003b9aca00000000010000000000000000b2fa09a63ee0fc74e51ae1f3bf4e1eade876f024000000006606f00e0000000066229f8e000000003b9aca0000000000000000000000000000000000000000000000000000000000000000000000001c8f95423f7142d00a48e1014a3de8d28907d420dc33b3052a6dee03a3f2941a393c2351e354704ca66a3fc29870282e1586a3ab4c45cfe31cae34c1d06f212434ac71b1be6cfe046c80c162e057614a94a5bc9f1ded1a7029deb0ba4ca7c9b71411e293438691be79c2dbf19d1ca7c3eadb9c756246fc5de5b7b89511c7d7302ae051d9e03d7991138299b5ed6a570a98000000013d9bdac0ed1d761330cf680efdeb1a42159eb387d6d2950c96f7d28f61bbe2aa00000007000000003b9aca0000000000000000000000000100000001bb6de9adcfbf2e0dfeffbe7792afd0c4085fdd370000000b00000000000000000000000100000001bb6de9adcfbf2e0dfeffbe7792afd0c4085fdd370000000b00000000000000000000000100000001bb6de9adcfbf2e0dfeffbe7792afd0c4085fdd3700030d40000000020000000900000001000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000009000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000';
      const txBuilderRaw = new AvaxpLib.TransactionBuilderFactory(coins.get('tavaxp')).from(rawTx);
      const txRaw = await txBuilderRaw.build();
      const txJson = txRaw.toJson();

      txJson.type.should.equal(TransactionType.AddPermissionlessValidator);

      const recoveryMode = false;
      const txBuilder = new AvaxpLib.TransactionBuilderFactory(coins.get(tcoinName))
        .getPermissionlessValidatorTxBuilder()
        .threshold(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.threshold)
        .locktime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.locktime)
        .recoverMode(recoveryMode)
        .fromPubKey(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.bitgoAddresses)
        .startTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.startTime)
        .endTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.endTime)
        .stakeAmount(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.stakeAmount)
        .delegationFeeRate(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.delegationFeeRate)
        .nodeID(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.nodeId)
        .utxos(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.utxos);
      const tx = await txBuilder.build();

      tx.type.should.equal(TransactionType.AddPermissionlessValidator);
      // TODO(CR-1073): continue testing
      const txHex = tx.toBroadcastFormat();
      console.log(tx.toJson());
      txHex.should.not.be.empty();
    });

    it('build and sign a transaction in regular mode', async () => {
      const recoveryMode = false;
      const txBuilder = new AvaxpLib.TransactionBuilderFactory(coins.get(tcoinName))
        .getValidatorBuilder()
        .threshold(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.threshold)
        .locktime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.locktime)
        .recoverMode(recoveryMode)
        .fromPubKey(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.bitgoAddresses)
        .startTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.startTime)
        .endTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.endTime)
        .stakeAmount(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.stakeAmount)
        .delegationFeeRate(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.delegationFeeRate)
        .nodeID(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.nodeId)
        .utxos(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.utxos);
      const tx = await txBuilder.build();

      let txHex = tx.toBroadcastFormat();
      txHex.should.equal(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.unsignedRawTxNonRecovery);

      const privateKey = recoveryMode
        ? testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.backupPrivateKey
        : testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.userPrivateKey;

      const params = {
        txPrebuild: {
          txHex: tx.toBroadcastFormat(),
        },
        prv: privateKey,
      };

      const halfSignedTransaction = await basecoin.signTransaction(params);
      txHex = (halfSignedTransaction as HalfSignedAccountTransaction)?.halfSigned?.txHex;
      txHex.should.equal(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.halfSignedRawTxNonRecovery);
    });
    it('build and sign a transaction in recovery mode', async () => {
      const recoveryMode = true;
      const txBuilder = new AvaxpLib.TransactionBuilderFactory(coins.get(tcoinName))
        .getValidatorBuilder()
        .threshold(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.threshold)
        .locktime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.locktime)
        .recoverMode(recoveryMode)
        .fromPubKey(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.bitgoAddresses)
        .startTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.startTime)
        .endTime(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.endTime)
        .stakeAmount(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.stakeAmount)
        .delegationFeeRate(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.delegationFeeRate)
        .nodeID(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.nodeId)
        .utxos(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.utxos);
      const tx = await txBuilder.build();

      let txHex = tx.toBroadcastFormat();
      txHex.should.equal(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.unsignedRawtxRecovery);

      const privateKey = recoveryMode
        ? testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.backupPrivateKey
        : testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.userPrivateKey;

      const params = {
        txPrebuild: {
          txHex: tx.toBroadcastFormat(),
        },
        prv: privateKey,
      };

      const halfSignedTransaction = await basecoin.signTransaction(params);
      txHex = (halfSignedTransaction as HalfSignedAccountTransaction)?.halfSigned?.txHex;
      txHex.should.equal(testData.BUILD_AND_SIGN_ADD_VALIDATOR_SAMPLE.halfSignedRawTxRecovery);
    });

    it('should be rejected if invalid key', async () => {
      const invalidPrivateKey = 'AAAAA';
      const builder = factory.from(testData.ADDVALIDATOR_SAMPLES.unsignedTxHex);

      const tx = await builder.build();
      const params = {
        txPrebuild: {
          txHex: tx.toBroadcastFormat(),
        },
        prv: invalidPrivateKey,
      };

      await basecoin.signTransaction(params).should.be.rejected();
    });
    it('should return the same mainnet address', () => {
      const utils = new KeyPairUtils();
      const xprv = testData.SEED_ACCOUNT.xPrivateKey;
      const kp1 = new KeyPair({ prv: xprv });
      const addressBuffer1 = kp1.getAddressBuffer();
      const address1 = utils.addressToString('avax', 'P', BufferAvax.from(addressBuffer1));

      const kp2 = new KeyPair({ prv: xprv });
      const addressBuffer2 = kp2.getAddressSafeBuffer();
      const address2 = utils.addressToString('avax', 'P', BufferAvax.from(addressBuffer2));

      const kp3 = new KeyPair({ prv: xprv });
      const address3 = kp3.getAvaxPAddress('avax');

      address1.should.equal(address2);
      address1.should.equal(address3);
    });
    it('should return the same testnet address', () => {
      const utils = new KeyPairUtils();
      const xprv = testData.SEED_ACCOUNT.xPrivateKey;
      const kp1 = new KeyPair({ prv: xprv });
      const addressBuffer1 = kp1.getAddressBuffer();
      const address1 = utils.addressToString('fuji', 'P', BufferAvax.from(addressBuffer1));

      const kp2 = new KeyPair({ prv: xprv });
      const addressBuffer2 = kp2.getAddressSafeBuffer();
      const address2 = utils.addressToString('fuji', 'P', BufferAvax.from(addressBuffer2));

      const kp3 = new KeyPair({ prv: xprv });
      const address3 = kp3.getAvaxPAddress('fuji');

      address1.should.equal(address2);
      address1.should.equal(address3);
    });
    it('should not be the same address from same key', () => {
      const utils = new KeyPairUtils();
      const kp1 = new KeyPair({ prv: testData.ACCOUNT_1.privkey });
      const addressBuffer1 = kp1.getAddressBuffer();
      const address1 = utils.addressToString('avax', 'P', BufferAvax.from(addressBuffer1));

      const kp2 = new KeyPair({ prv: testData.ACCOUNT_1.privkey });
      const addressBuffer2 = kp2.getAddressSafeBuffer();
      const address2 = utils.addressToString('fuji', 'P', BufferAvax.from(addressBuffer2));

      address1.should.not.equal(address2);
    });
    it('should not be the same address from different keys', () => {
      const utils = new KeyPairUtils();
      const kp1 = new KeyPair({ prv: testData.ACCOUNT_1.privkey });
      const addressBuffer1 = kp1.getAddressBuffer();
      const address1 = utils.addressToString('avax', 'P', BufferAvax.from(addressBuffer1));

      const kp2 = new KeyPair({ prv: testData.ACCOUNT_3.privkey });
      const addressBuffer2 = kp2.getAddressSafeBuffer();
      const address2 = utils.addressToString('avax', 'P', BufferAvax.from(addressBuffer2));

      address1.should.not.equal(address2);
    });
  });

  describe('Sign Message', () => {
    it('should be performed', async () => {
      const keyPairToSign = new AvaxpLib.KeyPair();
      const prvKey = keyPairToSign.getPrivateKey();
      const keyPair = keyPairToSign.getKeys();
      const messageToSign = Buffer.from(randomBytes(32));
      const signature = await basecoin.signMessage(keyPair, messageToSign.toString('hex'));

      const verify = AvaxpLib.Utils.verifySignature(basecoin._staticsCoin.network, messageToSign, signature, prvKey!);
      verify.should.be.true();
    });

    it('should fail with missing private key', async () => {
      const keyPair = new AvaxpLib.KeyPair({
        pub: testData.SEED_ACCOUNT.publicKeyCb58,
      }).getKeys();
      const messageToSign = Buffer.from(randomBytes(32)).toString('hex');
      await basecoin.signMessage(keyPair, messageToSign).should.be.rejectedWith('Invalid key pair options');
    });
  });

  describe('Explain Transaction', () => {
    it('should explain a half signed AddValidator transaction', async () => {
      const testData = ADDVALIDATOR_SAMPLES;
      const txExplain = await basecoin.explainTransaction({ halfSigned: { txHex: testData.halfsigntxHex } });
      txExplain.outputAmount.should.equal(testData.minValidatorStake);
      txExplain.type.should.equal(TransactionType.AddValidator);
      txExplain.outputs[0].address.should.equal(testData.nodeID);
      txExplain.changeOutputs[0].address.split('~').length.should.equal(3);
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed AddValidator transaction', async () => {
      const testData = ADDVALIDATOR_SAMPLES;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal(testData.minValidatorStake);
      txExplain.type.should.equal(TransactionType.AddValidator);
      txExplain.outputs[0].address.should.equal(testData.nodeID);
      txExplain.changeOutputs[0].address.split('~').length.should.equal(3);
      should.not.exist(txExplain.memo);
    });

    it('should explain a half signed export transaction', async () => {
      const testData = EXPORT_P_2_C;
      const txExplain = await basecoin.explainTransaction({ halfSigned: { txHex: testData.halfsigntxHex } });
      txExplain.outputAmount.should.equal(testData.amount);
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed export transaction', async () => {
      const testData = EXPORT_P_2_C;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal(testData.amount);
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      should.not.exist(txExplain.memo);
    });

    it('should explain a half signed export transaction without cahngeoutput ', async () => {
      const testData = EXPORT_P_2_C_WITHOUT_CHANGEOUTPUT;
      const txExplain = await basecoin.explainTransaction({
        halfSigned: { txHex: testData.halfsigntxHex },
      });
      txExplain.outputAmount.should.equal(testData.amount);
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed export transaction without cahngeoutput ', async () => {
      const testData = EXPORT_P_2_C_WITHOUT_CHANGEOUTPUT;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal(testData.amount);
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a half signed import transaction', async () => {
      const testData = IMPORT_P;
      const txExplain = await basecoin.explainTransaction({
        halfSigned: { txHex: testData.halfsigntxHex },
      });
      txExplain.outputAmount.should.equal((Number(testData.amount) - txExplain.fee?.fee).toString());
      txExplain.type.should.equal(TransactionType.Import);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed import transaction', async () => {
      const testData = IMPORT_P;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal((Number(testData.amount) - txExplain.fee?.fee).toString());
      txExplain.type.should.equal(TransactionType.Import);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.sort().join('~'));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a half signed import in C transaction', async () => {
      const testData = IMPORT_C;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.halfsigntxHex });
      txExplain.outputAmount.should.equal((Number(testData.amount) - txExplain.fee?.fee).toString());
      txExplain.type.should.equal(TransactionType.Import);
      txExplain.outputs[0].address.should.equal(testData.to);
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed import in C transaction', async () => {
      const testData = IMPORT_C;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal((Number(testData.amount) - txExplain.fee?.fee).toString());
      txExplain.type.should.equal(TransactionType.Import);
      txExplain.outputs[0].address.should.equal(testData.to);
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a unsigned export in C transaction', async () => {
      const testData = EXPORT_C;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.unsignedTxHex });
      txExplain.outputAmount.should.equal(Number(testData.amount).toString());
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.inputs[0].address.should.equal(testData.cHexAddress);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.slice().sort().join('~'));
      txExplain.fee.feeRate.should.equal(Number(testData.fee));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should explain a signed export in C transaction', async () => {
      const testData = EXPORT_C;
      const txExplain = await basecoin.explainTransaction({ txHex: testData.fullsigntxHex });
      txExplain.outputAmount.should.equal(Number(testData.amount).toString());
      txExplain.type.should.equal(TransactionType.Export);
      txExplain.inputs[0].address.should.equal(testData.cHexAddress);
      txExplain.outputs[0].address.should.equal(testData.pAddresses.slice().sort().join('~'));
      txExplain.fee.feeRate.should.equal(Number(testData.fee));
      txExplain.changeOutputs.should.be.empty();
      should.not.exist(txExplain.memo);
    });

    it('should fail when a tx is not passed as parameter', async () => {
      await basecoin.explainTransaction({}).should.be.rejectedWith('missing transaction hex');
    });
  });

  describe('Verify transaction', function () {
    it('should fail to verify P > C import transaction without recipients', async () => {
      const txPrebuild = {
        txHex: IMPORT_C.fullsigntxHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [],
        type: 'Import',
        locktime: 0,
      };
      try {
        await basecoin.verifyTransaction({ txParams, txPrebuild });
      } catch (e) {
        e.message.should.equal('Expected 1 recipient in import transaction');
      }
    });

    it('should succeed to verify signed add validator transaction', async () => {
      const txPrebuild = {
        txHex: testData.ADDVALIDATOR_SAMPLES.fullsigntxHex,
        txInfo: {},
      };
      const txParams = newTxParams();
      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should succeed to verify half signed add validator transaction', async () => {
      const txPrebuild = {
        txHex: testData.ADDVALIDATOR_SAMPLES.halfsigntxHex,
        txInfo: {},
      };
      const txParams = newTxParams();
      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should succeed to verify unsigned add validator transaction', async () => {
      const txPrebuild = newTxPrebuild();
      const txParams = newTxParams();
      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should succeed to verify add validator transactions when recipients has extra data ', async function () {
      const txPrebuild = newTxPrebuild();
      const txParams = newTxParams();
      txParams.data = 'data';

      const validTransaction = await basecoin.verifyTransaction({ txParams, txPrebuild });
      validTransaction.should.equal(true);
    });

    it('should succeed to verify import in C transaction', async () => {
      const txPrebuild = {
        txHex: IMPORT_C.fullsigntxHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [
          {
            address: EXPORT_P_2_C_VERIFY.receiveAddress,
            amount: '1',
          },
        ],
        type: 'Import',
        locktime: 0,
      };
      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should succeed to verify import to P transaction', async () => {
      const txPrebuild = {
        txHex: IMPORT_P.fullsigntxHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [],
        type: 'Import',
        locktime: 0,
        unspents: ['e8ixKnba52yufXrTVKrTXVQTj5cd5e6o6Lc3rVkhahDGEs72L:0'],
      };
      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should fail to verify import to P transaction with wrong unspents', async () => {
      const txPrebuild = {
        txHex: IMPORT_P.fullsigntxHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [],
        type: 'Import',
        locktime: 0,
        unspents: ['test:1'],
      };
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith(
          'Transaction should not contain the UTXO: e8ixKnba52yufXrTVKrTXVQTj5cd5e6o6Lc3rVkhahDGEs72L:0'
        );
    });

    it('should succeed to verify export transaction', async () => {
      const txPrebuild = {
        txHex: EXPORT_P_2_C_VERIFY.txHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [
          {
            address: '',
            amount: EXPORT_P_2_C_VERIFY.amount,
          },
        ],
        type: 'Export',
        locktime: 0,
      };

      const isTransactionVerified = await basecoin.verifyTransaction({ txParams, txPrebuild });
      isTransactionVerified.should.equal(true);
    });

    it('should fail verify export transaction with wrong amount', async () => {
      const txPrebuild = {
        txHex: EXPORT_P_2_C_VERIFY.txHex,
        txInfo: {},
      };
      const txParams = {
        recipients: [
          {
            address: EXPORT_P_2_C_VERIFY.receiveAddress,
            amount: '9999999',
          },
        ],
        type: 'Export',
        locktime: 0,
      };

      await basecoin
        .verifyTransaction({ txParams, txPrebuild })
        .should.be.rejectedWith(
          `Tx total amount ${EXPORT_P_2_C_VERIFY.amount} does not match with expected total amount field 9999999 and max import fee 10000000`
        );
    });

    it('should fail verify transactions when have different type', async function () {
      const txParams = newTxParams();
      const txPrebuild = newTxPrebuild();
      txParams.type = 'addDelegator';
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx type does not match with expected txParams type');
    });

    it('should fail verify transactions when have different nodeId', async function () {
      const txParams = newTxParams();
      const txPrebuild = newTxPrebuild();
      txParams.stakingOptions.nodeID = 'NodeID-MdteS9U987PY7iwA5Pcz3sKVprJAbAvE7';
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx outputs does not match with expected txParams');
    });
    it('should fail verify when input `nodeId` is absent', async function () {
      const txPrebuild = newTxPrebuild();
      const txParams = newTxParams();
      txParams.stakingOptions.nodeID = undefined;
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx outputs does not match with expected txParams');
    });

    it('should fail verify transactions when have different amount', async function () {
      const txParams = newTxParams();
      const txPrebuild = newTxPrebuild();
      txParams.stakingOptions.amount = '2000000000';
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx outputs does not match with expected txParams');
    });

    it('should fail verify transactions when amount is number', async function () {
      const txParams = newTxParams();
      const txPrebuild = newTxPrebuild();
      txParams.stakingOptions.amount = 1000000000;
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx outputs does not match with expected txParams');
    });

    it('should fail verify transactions when amount is absent', async function () {
      const txParams = newTxParams();
      const txPrebuild = newTxPrebuild();
      txParams.stakingOptions.amount = undefined;
      await basecoin
        .verifyTransaction({
          txParams,
          txPrebuild,
        })
        .should.be.rejectedWith('Tx outputs does not match with expected txParams');
    });
  });

  describe('Validation', function () {
    it('should validate address', function () {
      const validAddress = 'P-fuji15jamwukfqkwhe8z26tjqxejtjd3jk9vj4kmxwa';
      basecoin.isValidAddress(validAddress).should.be.true();
    });

    it('should fail to validate invalid address', function () {
      const invalidAddresses = [undefined, '', 'asdadsaaf', '15x3z4rvk8e7vwa6g9lkyg89v5dwknp44858uex'];
      for (const address of invalidAddresses) {
        basecoin.isValidAddress(address).should.be.false();
      }
    });

    it('should validate an array address', function () {
      const validAddresses = [
        'P-fuji15x3z4rvk8e7vwa6g9lkyg89v5dwknp44858uex',
        'P-avax143q8lsy3y4ke9d6zeltre8u2ateed6uk9ka0nu',
        'NodeID-143q8lsy3y4ke9d6zeltre8u2ateed6uk9ka0nu',
      ];

      basecoin.isValidAddress(validAddresses).should.be.true();
    });

    it('should fail to validate an array address with invalid addresss', function () {
      const validAddresses = [
        'P-fuji15x3z4rvk8e7vwa6g9lkyg89v5dwknp44858uex',
        'P-avax143q8lsy3y4ke9d6zeltre8u2ateed6uk9ka0nu',
        'invalid-address',
      ];

      basecoin.isValidAddress(validAddresses).should.be.false();
    });

    it('should validate a multsig address string', function () {
      const multiSigValidAddress =
        'P-fuji1yzpfsdalhfwkq2ceewgs9wv7k0uft40ydpuj59~P-fuji103cmntssp6qnucejahddy42wcy4qty0uj42822~P-fuji1hdk7ntw0huhqmlhlheme9t7scsy9lhfhw3ywy4';
      basecoin.isValidAddress(multiSigValidAddress).should.be.true();
    });

    it('should fail to validate a multsig address string with invalid address', function () {
      const multiSigValidAddress =
        'P-fuji1yzpfsdalhfwkq2ceewgs9wv7k0uft40ydpuj59~invalid-address~P-fuji1hdk7ntw0huhqmlhlheme9t7scsy9lhfhw3ywy4';
      basecoin.isValidAddress(multiSigValidAddress).should.be.false();
    });

    it('should validate valid c-chain address', () => {
      const address = '0x1374a2046661f914d1687d85dbbceb9ac7910a29';
      basecoin.isValidAddress(address).should.be.true();
    });

    it('should throw when verifying address if address length doesnt match keychain length', async function () {
      const validAddresses = [
        {
          address: 'P-fuji15x3z4rvk8e7vwa6g9lkyg89v5dwknp44858uex',
          keychains,
        },
        {
          address: 'P-fuji1wq0d56pu54sgc5xpevm3ur6sf3l6kke70dz0l4',
          keychains,
        },
      ];

      for (const addressParams of validAddresses) {
        await assert.rejects(async () => basecoin.verifyAddress(addressParams));
      }
    });

    it('should fail to verify invalid address', async function () {
      const invalidAddresses = [
        {
          address: 'P-fuji103cmntssp6qnucejahddy42wcy4qty0uj42822',
          keychains,
        },
        {
          address: 'P-avax143q8lsy3y4ke9d6zeltre8u2ateed6uk9ka0nu',
          keychains,
        },
      ];

      for (const address of invalidAddresses) {
        await assert.rejects(async () => basecoin.verifyAddress(address));
      }
    });

    it('should successfully verify is wallet address', async function () {
      (
        await basecoin.isWalletAddress({
          address:
            'P-fuji15x3z4rvk8e7vwa6g9lkyg89v5dwknp44858uex~P-fuji1wq0d56pu54sgc5xpevm3ur6sf3l6kke70dz0l4~P-fuji1cjk4cvdfy6ffd4fh8umpnnrmjt0xdap02tcep6',
          keychains,
        })
      ).should.be.true();
    });

    it('should throw when address length and keychain length dont match', async function () {
      await assert.rejects(async () =>
        basecoin.isWalletAddress({
          address: 'P-fuji1wq0d56pu54sgc5xpevm3ur6sf3l6kke70dz0l4~P-fuji1cjk4cvdfy6ffd4fh8umpnnrmjt0xdap02tcep6',
          keychains,
        })
      );
    });

    it('should throw when keychain is not of length 3', async function () {
      await assert.rejects(async () =>
        basecoin.isWalletAddress({
          address: 'P-fuji1wq0d56pu54sgc5xpevm3ur6sf3l6kke70dz0l4',
          keychains: keychains[0],
        })
      );
    });
  });
});
