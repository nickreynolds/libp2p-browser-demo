/* eslint-disable no-console */

import { Multiaddr } from '@multiformats/multiaddr'
import setupLibp2p from './libp2p.js'
import { createFromJSON } from '@libp2p/peer-id-factory'
import peerIdDialerJson from './peer-id-dialer.js'
import peerIdListenerJson from './peer-id-listener.js'

export async function createDialer () {
  const idDialer = await createFromJSON(peerIdDialerJson)

  // Create a new libp2p node on localhost with a randomly chosen port
  const nodeDialer = await setupLibp2p(idDialer)

  // Start the libp2p host
  await nodeDialer.start()

  // Output this node's address
  console.log('Dialer ready, listening on:')
  nodeDialer.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })

  return nodeDialer

}

export async function createStream(nodeDialer) {
  const idListener = await createFromJSON(peerIdListenerJson)
  const listenerMa = new Multiaddr(`/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/p2p/${idListener.toString()}`)
  console.log("listenerMa: ", listenerMa)
  const stream = await nodeDialer.dialProtocol(listenerMa, '/chat/1.0.0')
  console.log("stream: ", stream)
  return stream
}