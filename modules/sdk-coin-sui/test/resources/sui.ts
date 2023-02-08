import { RequestAddDelegation, RequestWithdrawDelegation } from '../../src/lib/iface';

export const addresses = {
  validAddresses: [
    '0xcba4a48bb0f8b586c167e5dcefaa1c5e96ab3f08',
    '0xc4173a804406a365e69dfb297d4eaaf002546ebd',
    '0x111b8a49f67370bc4a58e500b9e64cb6547ee9b4',
  ],
  invalidAddresses: [
    'randomString',
    '0xc4173a804406a365e69dfb297ddfgsdcvf',
    '5ne7phA48Jrvpn39AtupB8ZkCCAy8gLTfpGihZPuDqen',
  ],
};

export const sender = {
  address: addresses.validAddresses[0],
  publicKey: 'ISHc0JgGmuU1aX3QGc/YZ3ynq6CtrB0ZWcvObcVLElk=',
  signatureHex: '6JD68SxFyiEOdEVFHDuxEHtq9NO9zmC2glSJf/XswlY2yp7HWnmVT1sMNz2YTzmatIROKqsh8dAHkjoHd3cvDg==',
};

export const recipients = [addresses.validAddresses[1]];

export const gasPayment = {
  objectId: '0x36d6ca08f2081732944d1e5b6b406a4a462e39b8',
  version: 3,
  digest: 'uUkO3mMhUmLENOA/YG2XmfO6cEUjztoYSzhtR6of+B8=',
};

export const coinsWithGasPayment = [
  {
    objectId: '0x111b8a49f67370bc4a58e500b9e64cb6547ee9b4',
    version: 3,
    digest: 'ZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYE=',
  },
  {
    objectId: '0x111b8a49f67370bc4a58e500b9e64cb6462e39b8',
    version: 2,
    digest: 'ZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8=',
  },
  gasPayment,
];

export const coinsWithoutGasPayment = [
  {
    objectId: '0x111b8a49f67370bc4a58e500b9e64cb6547ee9b4',
    version: 3,
    digest: 'ZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYE=',
  },
  {
    objectId: '0x111b8a49f67370bc4a58e500b9e64cb6462e39b8',
    version: 2,
    digest: 'ZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8=',
  },
];

export const GAS_BUDGET = 120;

export const AMOUNT = 100;

export const payTxWithGasPayment = {
  coins: coinsWithGasPayment,
  recipients,
  amounts: [AMOUNT],
};

export const payTxWithoutGasPayment = {
  coins: coinsWithoutGasPayment,
  recipients,
  amounts: [AMOUNT],
};

export const txIds = {
  id1: 'rAraxzR2QeTU/bULpEUWjv+oCY/8YnHS9Oc/IhkoaCM=',
};

export const TRANSFER_PAY_TX =
  'AAQCERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgREbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8BxBc6gEQGo2XmnfspfU6q8AJUbr0BZAAAAAAAAADLpKSLsPi1hsFn5dzvqhxelqs/CDbWygjyCBcylE0eW2tAakpGLjm4AwAAAAAAAAAguUkO3mMhUmLENOA/YG2XmfO6cEUjztoYSzhtR6of+B8BAAAAAAAAAHgAAAAAAAAA';
export const TRANSFER_PAY_SUI_TX_WITH_GAS_PAYMENT_AND_IN_PAYTX =
  'AAUDNtbKCPIIFzKUTR5ba0BqSkYuObgDAAAAAAAAACC5SQ7eYyFSYsQ04D9gbZeZ87pwRSPO2hhLOG1Hqh/4HxEbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8RG4pJ9nNwvEpY5QC55ky2VH7ptAMAAAAAAAAAIGS6H7Ly+9KTijUAFdYB9NuJzX6OI3DQ3ZrjrE9jXBWBAcQXOoBEBqNl5p37KX1OqvACVG69AWQAAAAAAAAAy6Ski7D4tYbBZ+Xc76ocXparPwg21soI8ggXMpRNHltrQGpKRi45uAMAAAAAAAAAILlJDt5jIVJixDTgP2Btl5nzunBFI87aGEs4bUeqH/gfAQAAAAAAAAB4AAAAAAAAAA==';
export const TRANSFER_PAY_SUI_TX_WITH_GAS_PAYMENT_AND_NOT_IN_PAYTX =
  'AAUDNtbKCPIIFzKUTR5ba0BqSkYuObgDAAAAAAAAACC5SQ7eYyFSYsQ04D9gbZeZ87pwRSPO2hhLOG1Hqh/4HxEbikn2c3C8SljlALnmTLZUfum0AwAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYERG4pJ9nNwvEpY5QC55ky2Ri45uAIAAAAAAAAAIGS6H7Ly+9KTijUAFdYB9NuJzX6OI3DQ3ZrjrEeqH/gfAcQXOoBEBqNl5p37KX1OqvACVG69AWQAAAAAAAAAy6Ski7D4tYbBZ+Xc76ocXparPwg21soI8ggXMpRNHltrQGpKRi45uAMAAAAAAAAAILlJDt5jIVJixDTgP2Btl5nzunBFI87aGEs4bUeqH/gfAQAAAAAAAAB4AAAAAAAAAA==';
export const TRANSFER_PAY_SUI_TX_WITHOUT_GAS_PAYMENT_AND_IN_PAYTX =
  'AAUDERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgREbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B821soI8ggXMpRNHltrQGpKRi45uAMAAAAAAAAAILlJDt5jIVJixDTgP2Btl5nzunBFI87aGEs4bUeqH/gfAcQXOoBEBqNl5p37KX1OqvACVG69AWQAAAAAAAAAy6Ski7D4tYbBZ+Xc76ocXparPwgRG4pJ9nNwvEpY5QC55ky2VH7ptAMAAAAAAAAAIGS6H7Ly+9KTijUAFdYB9NuJzX6OI3DQ3ZrjrE9jXBWBAQAAAAAAAAB4AAAAAAAAAA==';
export const TRANSFER_PAY_SUI_TX_WITHOUT_GAS_PAYMENT_AND_NOT_IN_PAYTX =
  'AAUCERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgREbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8BxBc6gEQGo2XmnfspfU6q8AJUbr0BZAAAAAAAAADLpKSLsPi1hsFn5dzvqhxelqs/CBEbikn2c3C8SljlALnmTLZUfum0AwAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYEBAAAAAAAAAHgAAAAAAAAA';
export const TRANSFER_PAY_ALL_SUI_TX_WITH_GAS_PAYMENT_AND_IN_PAYTX =
  'AAYDNtbKCPIIFzKUTR5ba0BqSkYuObgDAAAAAAAAACC5SQ7eYyFSYsQ04D9gbZeZ87pwRSPO2hhLOG1Hqh/4HxEbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B8RG4pJ9nNwvEpY5QC55ky2VH7ptAMAAAAAAAAAIGS6H7Ly+9KTijUAFdYB9NuJzX6OI3DQ3ZrjrE9jXBWBxBc6gEQGo2XmnfspfU6q8AJUbr3LpKSLsPi1hsFn5dzvqhxelqs/CDbWygjyCBcylE0eW2tAakpGLjm4AwAAAAAAAAAguUkO3mMhUmLENOA/YG2XmfO6cEUjztoYSzhtR6of+B8BAAAAAAAAAHgAAAAAAAAA';
export const TRANSFER_PAY_ALL_SUI_TX_WITH_GAS_PAYMENT_AND_NOT_IN_PAYTX =
  'AAYDNtbKCPIIFzKUTR5ba0BqSkYuObgDAAAAAAAAACC5SQ7eYyFSYsQ04D9gbZeZ87pwRSPO2hhLOG1Hqh/4HxEbikn2c3C8SljlALnmTLZUfum0AwAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYERG4pJ9nNwvEpY5QC55ky2Ri45uAIAAAAAAAAAIGS6H7Ly+9KTijUAFdYB9NuJzX6OI3DQ3ZrjrEeqH/gfxBc6gEQGo2XmnfspfU6q8AJUbr3LpKSLsPi1hsFn5dzvqhxelqs/CDbWygjyCBcylE0eW2tAakpGLjm4AwAAAAAAAAAguUkO3mMhUmLENOA/YG2XmfO6cEUjztoYSzhtR6of+B8BAAAAAAAAAHgAAAAAAAAA';
export const TRANSFER_PAY_ALL_SUI_TX_WITHOUT_GAS_PAYMENT_AND_IN_PAYTX =
  'AAYDERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgREbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B821soI8ggXMpRNHltrQGpKRi45uAMAAAAAAAAAILlJDt5jIVJixDTgP2Btl5nzunBFI87aGEs4bUeqH/gfxBc6gEQGo2XmnfspfU6q8AJUbr3LpKSLsPi1hsFn5dzvqhxelqs/CBEbikn2c3C8SljlALnmTLZUfum0AwAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsT2NcFYEBAAAAAAAAAHgAAAAAAAAA';
export const TRANSFER_PAY_ALL_SUI_TX_WITHOUT_GAS_PAYMENT_AND_NOT_IN_PAYTX =
  'AAYCERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgREbikn2c3C8SljlALnmTLZGLjm4AgAAAAAAAAAgZLofsvL70pOKNQAV1gH024nNfo4jcNDdmuOsR6of+B/EFzqARAajZead+yl9TqrwAlRuvcukpIuw+LWGwWfl3O+qHF6Wqz8IERuKSfZzcLxKWOUAueZMtlR+6bQDAAAAAAAAACBkuh+y8vvSk4o1ABXWAfTbic1+jiNw0N2a46xPY1wVgQEAAAAAAAAAeAAAAAAAAAA=';

export const INVALID_RAW_TX =
  'AAAAAAAAAAAAA6e73616374696f6e446174613a3a02111b8a49f67370bc4a58e500b9e64cb6547ee9b403000000000000002064ba1fb2f2fbd2938a350015d601f4db89cd7e8e2370d0dd9ae3ac4f635c1581111b8a49f67370bc4a58e500b9e64cb6462e39b802000000000000002064ba1fb2f2fbd2938a350015d601f4db89cd7e8e2370d0dd9ae3ac47aa1ff81f01c4173a804406a365e69dfb297d4eaaf002546ebd016400000000000000cba4a48bb0f8b586c167e5dcefaa1c5e96ab3f0836d6ca08f2081732944d1e5b6b406a4a462e39b8030000000000000020b9490ede63215262c434e03f606d9799f3ba704523ceda184b386d47aa1ff81f01000000000000006400000000000000';

export const ADD_DELEGATION_TX_ONE_COIN =
  'AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgEAAAAAAAAAIEt/p6rXSTjdKP6wJOXyx0c2xsgJ4MJtfxe7qHC34u4UCnN1aV9zeXN0ZW0fcmVxdWVzdF9hZGRfZGVsZWdhdGlvbl9tdWxfY29pbgAEAQEAAAAAAAAAAAAAAAAAAAAAAAAABQEAAAAAAAAAAgEA04qu2gdWrA6gjyu5Mh0Uk67VReVdbQ8AAAAAACB4naj6xTwn26Zp38B8igAEMaHHZ7Wrwe4stWu/LX/+BAAJAQAtMQEAAAAAABRdBvN2VPEc3ScXkIj8/q2qsh4T74+lHUOqRSos7iwVBBfRw94tsnctNA1MeiJm+vLMZv1tDMYF7679zXddbQ8AAAAAACCWk/YTDWaCnw82ZvuAtSVF/zQ62s4l60jy58YQiTIS8QEAAAAAAAAAQEIPAAAAAAA=';

export const ADD_DELEGATION_TX_MUL_COIN =
  'AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgEAAAAAAAAAIEt/p6rXSTjdKP6wJOXyx0c2xsgJ4MJtfxe7qHC34u4UCnN1aV9zeXN0ZW0fcmVxdWVzdF9hZGRfZGVsZWdhdGlvbl9tdWxfY29pbgAEAQEAAAAAAAAAAAAAAAAAAAAAAAAABQEAAAAAAAAAAgIA04qu2gdWrA6gjyu5Mh0Uk67VReVdbQ8AAAAAACB4naj6xTwn26Zp38B8igAEMaHHZ7Wrwe4stWu/LX/+BACGGeGdNxXaEDTmBSzwgbqKPTZWVkQBAAAAAAAAIL2aQ2LqY28LGQb+/MLm667s3z1B7myvJpkX7XZqOFYSAAkBAC0xAQAAAAAAFF0G83ZU8RzdJxeQiPz+raqyHhPvj6UdQ6pFKizuLBUEF9HD3i2ydy00DUx6Imb68sxm/W0MxgXvrv3Nd11tDwAAAAAAIJaT9hMNZoKfDzZm+4C1JUX/NDraziXrSPLnxhCJMhLxAQAAAAAAAABAQg8AAAAAAA==';

export const WITHDRAW_DELEGATION_TX =
  'AAIAAAAAAAAAAAAAAAAAAAAAAAAAAgEAAAAAAAAAIEt/p6rXSTjdKP6wJOXyx0c2xsgJ4MJtfxe7qHC34u4UCnN1aV9zeXN0ZW0bcmVxdWVzdF93aXRoZHJhd19kZWxlZ2F0aW9uAAMBAQAAAAAAAAAAAAAAAAAAAAAAAAAFAQAAAAAAAAABAEQDN090dM0eVaYicFh/7SAT0uJJIvMIAAAAAAAgIEAUO/H9R1UPYKqO9XWwDDEGKH0pHLc/Ye9O2tGDB4kBAAqsjrgdtdnfoUmhSVfmKRXkInvEFZ0IAAAAAAAgUnladG9ncSyDNTW9wMgdsg2OGz1JhPn5KclNIAduLJ2PpR1DqkUqLO4sFQQX0cPeLbJ3LTQNTHoiZvryzGb9bQzGBe+u/c13XW0PAAAAAAAglpP2Ew1mgp8PNmb7gLUlRf80OtrOJetI8ufGEIkyEvEBAAAAAAAAAEBCDwAAAAAA';

export const invalidPayTxs = [
  {
    coins: [
      {
        objectId: '',
        version: -1,
        digest: '',
      },
    ],
    recipients,
    amounts: [AMOUNT],
  },
  {
    coins: coinsWithGasPayment,
    recipients: [addresses.invalidAddresses[0]],
    amounts: [AMOUNT],
  },
  {
    coins: coinsWithGasPayment,
    recipients: addresses.invalidAddresses,
    amounts: [AMOUNT],
  },
  {
    coins: coinsWithGasPayment,
    recipients,
    amounts: [0],
  },
];

export const STAKING_GAS_BUDGET = 1000000;

export const STAKING_AMOUNT = 20000000;

export const STAKING_SENDER_ADDRESS = '0x8fa51d43aa452a2cee2c150417d1c3de2db2772d';

export const coinToStakeOne = {
  objectId: '0xd38aaeda0756ac0ea08f2bb9321d1493aed545e5',
  version: 1011037,
  digest: 'eJ2o+sU8J9umad/AfIoABDGhx2e1q8HuLLVrvy1//gQ=',
};

export const coinToStakeTwo = {
  objectId: '0x8619e19d3715da1034e6052cf081ba8a3d365656',
  version: 324,
  digest: 'vZpDYupjbwsZBv78wubrruzfPUHubK8mmRftdmo4VhI=',
};

export const stakingGasPayment = {
  objectId: '0x340d4c7a2266faf2cc66fd6d0cc605efaefdcd77',
  version: 1011037,
  digest: 'lpP2Ew1mgp8PNmb7gLUlRf80OtrOJetI8ufGEIkyEvE=',
};

export const VALIDATOR_ADDRESS = '0x5d06f37654f11cdd27179088fcfeadaab21e13ef';

export const requestAddDelegationTxOneCoin: RequestAddDelegation = {
  coins: [coinToStakeOne],
  amount: STAKING_AMOUNT,
  validatorAddress: VALIDATOR_ADDRESS,
};

export const requestAddDelegationTxMultipleCoins: RequestAddDelegation = {
  coins: [coinToStakeOne, coinToStakeTwo],
  amount: STAKING_AMOUNT,
  validatorAddress: VALIDATOR_ADDRESS,
};

export const requestWithdrawDelegation: RequestWithdrawDelegation = {
  delegation: {
    objectId: '0x4403374f7474cd1e55a62270587fed2013d2e249',
    version: 586530,
    digest: 'IEAUO/H9R1UPYKqO9XWwDDEGKH0pHLc/Ye9O2tGDB4k=',
    // type: '0x2::staking_pool::Delegation'
  },
  stakedCoinId: {
    objectId: '0x0aac8eb81db5d9dfa149a14957e62915e4227bc4',
    version: 564501,
    digest: 'UnladG9ncSyDNTW9wMgdsg2OGz1JhPn5KclNIAduLJ0=',
    // type: '0x2::staking_pool::StakedSui',
  },
};
