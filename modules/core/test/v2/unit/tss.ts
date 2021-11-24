/**
 * @prettier
 */
import 'should';

import Eddsa from '../../../src/mpc/tss';

describe('TSS EDDSA key generation and signing', () => {
  it('should generate keys and sign message', async () => {
    const MPC = await Eddsa();
    const A = MPC.keyShare(1, 2, 3);
    const B = MPC.keyShare(2, 2, 3);
    const C = MPC.keyShare(3, 2, 3);

    const A_combine = MPC.keyCombine(A.player, [B.distributed[1], C.distributed[1]]);
    const B_combine = MPC.keyCombine(B.player, [A.distributed[2], C.distributed[2]]);
    // const C_combine = MPC.keyCombine([A[3], B[3], C[3]]);

    const message = 'MPC on a Friday night';
    const message_buffer = Buffer.from(message, 'utf-8');
    const A_sign_share = MPC.signShare(message_buffer, A_combine.player, [A_combine.distributed[2]]);
    const B_sign_share = MPC.signShare(message_buffer, B_combine.player, [B_combine.distributed[1]]);

    const A_sign = MPC.sign(message_buffer, A_sign_share.player, [B_sign_share.distributed[1]]);
    const B_sign = MPC.sign(message_buffer, B_sign_share.player, [A_sign_share.distributed[2]]);

    const signature = MPC.signCombine([A_sign, B_sign]);
    const result = MPC.verify(message_buffer, signature).toString();
    result.should.equal(message);
  });
});
