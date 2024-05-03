import assert from 'assert';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { _decryptRsa } from '../../../../../src/bitgo/trading/network/decrypt-rsa';
import { _decryptBrowserRsa } from '../../../../../src/bitgo/trading/network/decrypt-rsa-browser';
import { _encryptRsa } from '../../../../../src/bitgo/trading/network/encrypt-rsa';
import { _encryptBrowserRsa } from '../../../../../src/bitgo/trading/network/encrypt-rsa-browser';
import { _decryptAesGcm } from '../../../../../src/bitgo/trading/network/decrypt-aes-gcm';
import { _encryptAesGcm } from '../../../../../src/bitgo/trading/network/encrypt-aes-gcm';
import {
  decryptRsaWithAesGcm,
  encryptBrowserRsaWithAesGcm,
  encryptRsaWithAesGcm,
  decryptBrowserRsaWithAesGcm,
} from '../../../../../src/bitgo/trading/network';

describe('network encrypt', () => {
  const privateKey = fs.readFileSync(path.resolve(__dirname, './private-key.pem'));
  const publicKey = fs.readFileSync(path.resolve(__dirname, './public-key.pub'));

  const password = 'password';

  let encryptedRsa;
  let decryptedRsa;
  let encryptedBrowserRsa;
  let decryptedBrowserRsa;

  it('should encrypt the string with a rsa public key', async () => {
    encryptedRsa = await _encryptRsa(publicKey.toString(), password);
    assert(encryptedRsa);
  });

  it('should decrypt the string with a rsa public key', async () => {
    decryptedRsa = await _decryptRsa(privateKey.toString(), encryptedRsa);
    assert(decryptedRsa);
    assert.strictEqual(decryptedRsa, password);
  });

  it('should encrypt the string with a rsa public key for the browser', async () => {
    encryptedBrowserRsa = await _encryptBrowserRsa(publicKey.toString(), password);
    assert(encryptedBrowserRsa);
  });

  it('should decrypt the string with a rsa private key for the browser', async () => {
    decryptedBrowserRsa = await _decryptBrowserRsa(privateKey.toString(), encryptedBrowserRsa);
    assert.strictEqual(decryptedBrowserRsa, password);
    assert.strictEqual(decryptedRsa, decryptedBrowserRsa);
  });

  it('should encrypt and decrypt aes-gcm', async () => {
    // Use encryptAesGcm and decryptAesGcm
    const text = 'secret';
    const gcmKey = crypto.randomBytes(32).toString('base64');
    const encrypted = await _encryptAesGcm(gcmKey, text);
    const decrypted = await _decryptAesGcm(gcmKey, encrypted);
    assert.strictEqual(decrypted, text);
  });

  let encryptedRsaWithAesGcm;
  let decryptedRsaWithAesGcm;
  let encryptedBrowserRsaWithAesGcm;
  let decryptedBrowserRsaWithAesGcm;

  it('should encrypt and decrypt RsaWithAesGcm', async () => {
    encryptedRsaWithAesGcm = await encryptRsaWithAesGcm(publicKey.toString(), password);
    decryptedRsaWithAesGcm = await decryptRsaWithAesGcm(privateKey.toString(), encryptedRsaWithAesGcm);
    assert(encryptedRsaWithAesGcm);
    assert(decryptedRsaWithAesGcm);
  });

  it('should encrypt and decrypt RsaWithAesGcm for the browser', async () => {
    encryptedBrowserRsaWithAesGcm = await encryptBrowserRsaWithAesGcm(publicKey.toString(), password);
    decryptedBrowserRsaWithAesGcm = await decryptBrowserRsaWithAesGcm(
      privateKey.toString(),
      encryptedBrowserRsaWithAesGcm
    );

    assert.strictEqual(decryptedBrowserRsaWithAesGcm, password);
    assert.strictEqual(decryptedRsaWithAesGcm, decryptedBrowserRsaWithAesGcm);
  });

  it('should check that the encryptions for node and browser work with each other', async () => {
    const nodeEncrypted = await _encryptRsa(publicKey.toString(), password);
    const browserDecrypted = await _decryptBrowserRsa(privateKey.toString(), nodeEncrypted);
    assert(browserDecrypted, password);

    const browserEncrypted = await _encryptBrowserRsa(publicKey.toString(), password);
    const nodeDecrypted = await _decryptRsa(privateKey.toString(), browserEncrypted);
    assert(nodeDecrypted, password);

    const nodeEncryptedWithAesGcm = await encryptRsaWithAesGcm(publicKey.toString(), password);
    const browserDecryptedWithAesGcm = await decryptBrowserRsaWithAesGcm(
      privateKey.toString(),
      nodeEncryptedWithAesGcm
    );
    assert(browserDecryptedWithAesGcm, password);

    const browserEncryptedWithAesGcm = await encryptBrowserRsaWithAesGcm(publicKey.toString(), password);
    const nodeDecryptedWithAesGcm = await decryptRsaWithAesGcm(privateKey.toString(), browserEncryptedWithAesGcm);
    assert(nodeDecryptedWithAesGcm, password);
  });
});
