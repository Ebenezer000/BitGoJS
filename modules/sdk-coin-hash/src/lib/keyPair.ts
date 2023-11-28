import { AddressFormat, KeyPairOptions } from '@bitgo/sdk-core';
import { pubkeyToAddress } from '@cosmjs/amino';

import { CosmosKeyPair, PubKeyType } from '@bitgo/abstract-cosmos';
import { MAINNET_ADDRESS_PREFIX, TESTNET_ADDRESS_PREFIX } from './constants';

/**
 * Provenance keys and address management.
 */
export class KeyPair extends CosmosKeyPair {
  constructor(source?: KeyPairOptions) {
    super(source);
  }

  /** @inheritdoc */
  getAddress(format: AddressFormat = AddressFormat.testnet): string {
    const base64String = Buffer.from(this.getKeys().pub.slice(0, 66), 'hex').toString('base64');
    const address_prefix = format === AddressFormat.mainnet ? MAINNET_ADDRESS_PREFIX : TESTNET_ADDRESS_PREFIX;
    return pubkeyToAddress(
      {
        type: PubKeyType.secp256k1,
        value: base64String,
      },
      address_prefix
    );
  }
}
