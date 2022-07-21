/* eslint-disable no-console */

import setupLibp2p from './libp2p.js'
import { createFromJSON } from '@libp2p/peer-id-factory'
import peerIdListenerJson from './peer-id-listener.js'

export async function createListener () {
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
