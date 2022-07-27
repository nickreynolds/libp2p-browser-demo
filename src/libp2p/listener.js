/* eslint-disable no-console */

import setupLibp2p from './libp2p.js'
import { createFromJSON } from '@libp2p/peer-id-factory'
import peerIdListenerJson from './peer-id-listener.js'
import { pipe } from 'it-pipe'
// import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import { toString as uint8ArrayToString } from 'uint8arrays/to-string'
import * as lp from 'it-length-prefixed'
import map from 'it-map'

export async function createListener (streamChunkReceivedCb) {
  // Create a new libp2p node with the given multi-address
  const idListener = await createFromJSON(peerIdListenerJson)
  const nodeListener = await setupLibp2p(idListener)

  // Log a message when a remote peer connects to us
  nodeListener.connectionManager.addEventListener('peer:connect', (evt) => {
    const connection = evt.detail
    console.log('connected to: ', connection.remotePeer.toString())
  })

  // Handle messages for the protocol
  await nodeListener.handle('/chat/1.0.0', async ({ stream }) => {
    // // Send stdin to the stream
    // stdinToStream(stream)
    // // Read the stream and output to console
    // streamToConsole(stream)
    console.log("handle stream: ", stream)


    pipe(
      // Read from the stream (the source)
      stream.source,
      // Decode length-prefixed data
      lp.decode(),
      // Turn buffers into strings
      (source) => map(source, (buf) => uint8ArrayToString(buf)),
      // Sink function
      async function (source) {
        // For each chunk of data
        let message = ""
        for await (const msg of source) {
          message = message + (msg.toString().replace('\n',''))
        }
        streamChunkReceivedCb(message)
      }
    )
  })

  // Start listening
  await nodeListener.start()

  // Output listen addresses to the console
  console.log('Listener ready, listening on:')
  nodeListener.getMultiaddrs().forEach((ma) => {
    console.log(ma.toString())
  })

  return nodeListener
}
