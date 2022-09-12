import assert from 'assert';
import * as testData from '../../resources/avaxp';
import * as errorMessage from '../../resources/errors';
import { TransactionBuilderFactory } from '../../../src/lib';
import { coins } from '@bitgo/statics';
import { BaseTransaction, TransactionType } from '@bitgo/sdk-core';
import { IMPORT_P } from '../../resources/tx/importP';

describe('AvaxP Transaction Builder Factory', () => {
  const factory = new TransactionBuilderFactory(coins.get('tavaxp'));

  describe('should validate', () => {
    it('an empty raw transaction', () => {
      assert.throws(
        () => {
          factory.from('');
        },
        (e) => e.message === errorMessage.ERROR_EMPTY_RAW_TRANSACTION
      );
    });

    it('an invalid raw transfer transaction', () => {
      assert.throws(
        () => {
          factory.from(testData.INVALID_RAW_TRANSACTION);
        },
        (e) => e.message === errorMessage.ERROR_RAW_PARSING
      );
    });

    it('Should validate a correct raw tx', () => {
      factory.from(testData.ADDVALIDATOR_SAMPLES.unsignedTxHex);
      // should not throw a error!
    });

    it("Shouldn't get a wallet initialization builder", () => {
      assert.throws(
        () => {
          factory.getWalletInitializationBuilder();
        },
        (e) => e.message === errorMessage.ERROR_WALLET_INITIALIZATION
      );
    });
  });

  describe('Transaction readable', () => {
    const rawTxs = [
      testData.ADD_VALIDATOR_ID_SAMPLE.fullsigntxHex,
      testData.EXPORT_P_2_C.fullsigntxHex,
      testData.EXPORT_P_2_C.halfsigntxHex,
      testData.EXPORT_P_2_C.unsignedTxHex,
      IMPORT_P.fullsigntxHex,
      IMPORT_P.halfsigntxHex,
      IMPORT_P.unsignedTxHex,
    ];
    let tx: BaseTransaction;
    before(async () => {
      const txBuilder = new TransactionBuilderFactory(coins.get('tavaxp')).from(
        testData.ADD_VALIDATOR_ID_SAMPLE.fullsigntxHex
      );
      tx = await txBuilder.build();
    });

    it('Should json stringifiy any transaction object', async () => {
      for (const rawTx of rawTxs) {
        const txBuilder = new TransactionBuilderFactory(coins.get('tavaxp')).from(rawTx);
        const tx = await txBuilder.build();
        const txJson = tx.toJson();
        assert(typeof JSON.stringify(txJson), 'string');
      }
    });

    it('Should json stringifiy addValidator transaction', async () => {
      const txJson = tx.toJson();
      assert(typeof JSON.stringify(tx.toJson()), 'string');
      txJson.id.should.equal(testData.ADD_VALIDATOR_ID_SAMPLE.txid);
    });

    it('Should get a txid', async () => {
      tx.id.should.equal(testData.ADD_VALIDATOR_ID_SAMPLE.txid);
    });
  });

  describe('should explains transaction', () => {
    it('should explains a Signed AddValidatorTx', async () => {
      const txBuilder = new TransactionBuilderFactory(coins.get('tavaxp')).from(
        testData.ADDVALIDATOR_SAMPLES.fullsigntxHex
      );
      const tx = await txBuilder.build();
      const txExplain = tx.explainTransaction();
      txExplain.outputAmount.should.equal(testData.ADDVALIDATOR_SAMPLES.minValidatorStake);
      txExplain.type.should.equal(TransactionType.addValidator);
      txExplain.outputs[0].address.should.equal(testData.ADDVALIDATOR_SAMPLES.nodeID);
    });

    it('should explains a Half Signed AddValidatorTx', async () => {
      const txBuilder = new TransactionBuilderFactory(coins.get('tavaxp')).from(
        testData.ADDVALIDATOR_SAMPLES.halfsigntxHex
      );
      const tx = await txBuilder.build();
      const txExplain = tx.explainTransaction();
      txExplain.outputAmount.should.equal(testData.ADDVALIDATOR_SAMPLES.minValidatorStake);
      txExplain.type.should.equal(TransactionType.addValidator);
      txExplain.outputs[0].address.should.equal(testData.ADDVALIDATOR_SAMPLES.nodeID);
    });

    it('should explains a unsigned AddValidatorTx', async () => {
      const txBuilder = new TransactionBuilderFactory(coins.get('tavaxp')).from(
        testData.ADDVALIDATOR_SAMPLES.unsignedTxHex
      );
      const tx = await txBuilder.build();
      const txExplain = tx.explainTransaction();
      txExplain.outputAmount.should.equal(testData.ADDVALIDATOR_SAMPLES.minValidatorStake);
      txExplain.type.should.equal(TransactionType.addValidator);
      txExplain.outputs[0].address.should.equal(testData.ADDVALIDATOR_SAMPLES.nodeID);
    });
  });
});
