import LndGrpc from 'lnd-grpc'

export async function channelBalance() {
  // check these:
  // cert must be a path
  // macaroon must be path or hex
  const grpc = new LndGrpc({ host: '127.0.0.1:10004', cert: '/Users/john/.polar/networks/2/volumes/lnd/bob/tls.cert', macaroon: '0201036c6e640267030a10d81e5394c4ce2bae069ba1c70387473f1201301a0c0a04696e666f1204726561641a170a08696e766f69636573120472656164120577726974651a160a076d657373616765120472656164120577726974651a100a086f6666636861696e1204726561640000062084d0cfc04f53f83ecccd723f413fb4792c271cebf3c12c994e9cd7a02380f4c4' })

  await grpc.connect()

  console.log(`connected grpc.state: ${grpc.state}`) // active|locked
}