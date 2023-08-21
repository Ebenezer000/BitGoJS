import * as assert from 'assert';

import {
  createOutputScriptP2shP2pk,
  ScriptType,
  ScriptType2Of3,
  scriptTypeP2shP2pk,
  scriptTypes2Of3,
} from '../bitgo/outputScripts';
import {
  addReplayProtectionUnspentToPsbt,
  addWalletOutputToPsbt,
  addWalletUnspentToPsbt,
  createPsbtForNetwork,
  getExternalChainCode,
  getSignatureVerifications,
  isWalletUnspent,
  KeyName,
  parseSignatureScript2Of3,
  getInternalChainCode,
  RootWalletKeys,
  toOutput,
  Unspent,
  UtxoPsbt,
  UtxoTransaction,
  verifySignatureWithUnspent,
  WalletUnspent,
} from '../bitgo';
import { getMainnet, Network, networks } from '../networks';
import { mockReplayProtectionUnspent, mockWalletUnspent } from './mock';
import { toOutputScript } from '../address';

/**
 * input script type and value.
 * use p2trMusig2 for p2trMusig2 script path.
 * use taprootKeyPathSpend for p2trMusig2 key path.
 */
export type InputScriptType = ScriptType | 'taprootKeyPathSpend';
export type OutputScriptType = ScriptType2Of3;

/**
 * input script type and value
 */
export interface Input {
  scriptType: InputScriptType;
  value: bigint;
}

/**
 * should set either address or scriptType, never both.
 * set isInternalAddress=true for internal output address
 */
export interface Output {
  address?: string;
  scriptType?: OutputScriptType;
  value: bigint;
  isInternalAddress?: boolean;
}

/**
 * array of supported input script types.
 * use p2trMusig2 for p2trMusig2 script path.
 * use taprootKeyPathSpend for p2trMusig2 key path.
 */
export const inputScriptTypes = [...scriptTypes2Of3, 'taprootKeyPathSpend', scriptTypeP2shP2pk] as const;

/**
 * array of supported output script types.
 */
export const outputScriptTypes = scriptTypes2Of3;

/**
 * create unspent object from input script type, index, network and root wallet key.
 */
export function toUnspent(
  input: Input,
  index: number,
  network: Network,
  rootWalletKeys: RootWalletKeys
): Unspent<bigint> {
  if (input.scriptType === 'p2shP2pk') {
    return mockReplayProtectionUnspent(network, input.value, { key: rootWalletKeys['user'], vout: index });
  } else {
    const chain = getInternalChainCode(input.scriptType === 'taprootKeyPathSpend' ? 'p2trMusig2' : input.scriptType);
    return mockWalletUnspent(network, input.value, {
      chain,
      vout: index,
      keys: rootWalletKeys,
      index,
    });
  }
}

/**
 * returns signer and cosigner names for InputScriptType.
 * user and undefined as signer and cosigner respectively for p2shP2pk.
 * user and backup as signer and cosigner respectively for p2trMusig2.
 * user and bitgo as signer and cosigner respectively for other input script types.
 */
export function getSigners(inputType: InputScriptType): { signerName: KeyName; cosignerName?: KeyName } {
  return {
    signerName: 'user',
    cosignerName: inputType === 'p2shP2pk' ? undefined : inputType === 'p2trMusig2' ? 'backup' : 'bitgo',
  };
}

/**
 * signs with first or second signature for single input.
 * p2shP2pk is signed only with first sign.
 */
export function signPsbtInput(params: {
  psbt: UtxoPsbt;
  input: Input;
  inputIndex: number;
  rootWalletKeys: RootWalletKeys;
  sign: 'halfsigned' | 'fullsigned';
  signers?: { signerName: KeyName; cosignerName?: KeyName };
  deterministic?: boolean;
  unsafeSignNonSegwit?: boolean;
}): void {
  const { psbt, input, inputIndex, rootWalletKeys, sign, signers, deterministic, unsafeSignNonSegwit } = params;
  const { signerName, cosignerName } = signers ? signers : getSigners(input.scriptType);
  if (sign === 'halfsigned') {
    if (input.scriptType === 'p2shP2pk') {
      psbt.signInput(
        inputIndex,
        rootWalletKeys[signerName],
        getMainnet(psbt.network) !== networks.zcash ? { unsafeSignNonSegwit } : undefined
      );
    } else {
      psbt.signInputHD(inputIndex, rootWalletKeys[signerName], { unsafeSignNonSegwit });
    }
  }
  if (sign === 'fullsigned' && cosignerName && input.scriptType !== 'p2shP2pk') {
    psbt.signInputHD(inputIndex, rootWalletKeys[cosignerName], { deterministic, unsafeSignNonSegwit });
  }
}

/**
 * signs with first or second signature for all inputs.
 * p2shP2pk is signed only with first sign.
 */
export function signAllPsbtInputs(params: {
  psbt: UtxoPsbt;
  inputs: Input[];
  rootWalletKeys: RootWalletKeys;
  sign: 'halfsigned' | 'fullsigned';
  signers?: { signerName: KeyName; cosignerName?: KeyName };
  deterministic?: boolean;
  unsafeSignNonSegwit?: boolean;
}): void {
  const { psbt, inputs, rootWalletKeys, sign, signers, deterministic, unsafeSignNonSegwit } = params;
  inputs.forEach((input, inputIndex) => {
    signPsbtInput({ psbt, input, inputIndex, rootWalletKeys, sign, signers, deterministic, unsafeSignNonSegwit });
  });
}

/**
 * construct psbt for given inputs, outputs, network and root wallet keys.
 */
export function constructPsbt(params: {
  inputs: Input[];
  outputs: Output[];
  network: Network;
  rootWalletKeys: RootWalletKeys;
  sign: 'unsigned' | 'halfsigned' | 'fullsigned';
  signers?: { signerName: KeyName; cosignerName?: KeyName };
  unsafeSignNonSegwit?: boolean;
}): UtxoPsbt {
  const { inputs, outputs, network, rootWalletKeys, sign, signers, unsafeSignNonSegwit } = params;
  const totalInputAmount = inputs.reduce((sum, input) => sum + input.value, BigInt(0));
  const outputInputAmount = outputs.reduce((sum, output) => sum + output.value, BigInt(0));
  assert(totalInputAmount >= outputInputAmount, 'total output can not exceed total input');
  assert(
    !outputs.some((o) => (o.scriptType && o.address) || (!o.scriptType && !o.address)),
    'only either output script type or address should be provided'
  );

  const psbt = createPsbtForNetwork({ network });
  const unspents = inputs.map((input, i) => toUnspent(input, i, network, rootWalletKeys));

  unspents.forEach((u, i) => {
    const { signerName, cosignerName } = signers ? signers : getSigners(inputs[i].scriptType);
    if (isWalletUnspent(u) && cosignerName) {
      addWalletUnspentToPsbt(psbt, u, rootWalletKeys, signerName, cosignerName);
    } else {
      const { redeemScript } = createOutputScriptP2shP2pk(rootWalletKeys[signerName].publicKey);
      assert(redeemScript);
      addReplayProtectionUnspentToPsbt(psbt, u, redeemScript);
    }
  });

  outputs.forEach((output, i) => {
    if (output.scriptType) {
      addWalletOutputToPsbt(
        psbt,
        rootWalletKeys,
        output.isInternalAddress ? getInternalChainCode(output.scriptType) : getExternalChainCode(output.scriptType),
        i,
        output.value
      );
    } else if (output.address) {
      const { address, value } = output;
      psbt.addOutput({ script: toOutputScript(address, network), value });
    }
  });

  if (sign === 'unsigned') {
    return psbt;
  }

  psbt.setAllInputsMusig2NonceHD(rootWalletKeys['user']);
  psbt.setAllInputsMusig2NonceHD(rootWalletKeys['bitgo']);

  signAllPsbtInputs({ psbt, inputs, rootWalletKeys, sign: 'halfsigned', signers, unsafeSignNonSegwit });

  if (sign === 'fullsigned') {
    signAllPsbtInputs({ psbt, inputs, rootWalletKeys, sign, signers, unsafeSignNonSegwit });
  }

  return psbt;
}

/**
 * Verifies signatures of fully signed tx (with taproot key path support).
 * NOTE: taproot key path tx can only be built and signed with PSBT.
 */
export function verifyFullySignedSignatures(
  tx: UtxoTransaction<bigint>,
  unspents: WalletUnspent<bigint>[],
  walletKeys: RootWalletKeys,
  signer: KeyName,
  cosigner: KeyName
): boolean {
  const prevOutputs = unspents.map((u) => toOutput(u, tx.network));
  return unspents.every((u, index) => {
    if (parseSignatureScript2Of3(tx.ins[index]).scriptType === 'taprootKeyPathSpend') {
      const result = getSignatureVerifications(tx, index, u.value, undefined, prevOutputs);
      return result.length === 1 && result[0].signature;
    } else {
      const result = verifySignatureWithUnspent(tx, index, unspents, walletKeys);
      if ((signer === 'user' && cosigner === 'bitgo') || (signer === 'bitgo' && cosigner === 'user')) {
        return result[0] && !result[1] && result[2];
      } else if ((signer === 'user' && cosigner === 'backup') || (signer === 'backup' && cosigner === 'user')) {
        return result[0] && result[1] && !result[2];
      } else {
        return !result[0] && result[1] && result[2];
      }
    }
  });
}
