import { createLibp2p } from 'libp2p'
import { WebSockets } from '@libp2p/websockets'
import { WebRTCStar } from '@libp2p/webrtc-star'
import { Noise } from '@chainsafe/libp2p-noise'
import { Mplex } from '@libp2p/mplex'
import { Bootstrap } from '@libp2p/bootstrap'
import crypto from 'libp2p-crypto'
import { createFromJSON } from '@libp2p/peer-id-factory'
import filters from 'libp2p-websockets/src/filters'
// import { stdinToStream, streamToConsole } from './stream.js'
const PeerId = require('peer-id')


const transportKey = WebSockets.prototype[Symbol.toStringTag]

export default async function setupLibp2p(peerId) {
  const webRtcStar = new WebRTCStar()

  // Create our libp2p node
  const libp2p = await createLibp2p({
    peerId,
    addresses: {
      // Add the signaling server address, along with our PeerId to our multiaddrs list
      // libp2p will automatically attempt to dial to the signaling server so that it can
      // receive inbound connections from other peers
      listen: [
        '/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
        '/dns4/wrtc-star2.sjc.dwebops.pub/tcp/443/wss/p2p-webrtc-star',
      ],
    },
    // transports: [WebSockets, WebRTCStar],
    transports: [new WebSockets(), webRtcStar],
    connectionEncryption: [new Noise()],
    streamMuxers: [new Mplex()],
    peerDiscovery: [
      webRtcStar.discovery,
      new Bootstrap({
        list: [
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmNnooDu7bfjPFoTZYxMNLWUQJyrVwtbZg5gBMjTezGAJN',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmbLHAnMoJPWSCR5Zhtx6BHJX9KiKNN6tpvbUcqanj75Nb',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmZa1sAxajnQjVM8WjWXoMbmPd7NsWhfKsPkErzpm9wGkp',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmQCU2EcMqAqQPR2i9bChDtGNJchTbq5TbXJJ16u19uLTa',
          '/dnsaddr/bootstrap.libp2p.io/p2p/QmcZf59bWwK5XFi76CZX8cbJ4BhTzzA3gU1ZjYZcYW3dwt',
        ],
      }),
    ],
    config: {
      transport: {
        [transportKey]: {
          // by default websockets do not allow localhost dials
          // let's enable it for testing purposes in this example
          filter: filters.all
        }
    },
    }
  })

  // Handle messages for the protocol
  await libp2p.handle('/didComm/1.0.0', async ({ stream }) => {
    console.log('handling something!!!')
    console.log("stream: ", stream)
  })

  await libp2p.start()

  return libp2p
}
