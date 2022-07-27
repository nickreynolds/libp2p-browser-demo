import logo from './logo.svg';
import './App.css';
import { useState } from "react"
import { createListener } from './libp2p/listener';
import { createDialer, createStream } from './libp2p/dialer';
import { pipe } from "it-pipe";
import map from 'it-map';
import { fromString as uint8ArrayFromString } from 'uint8arrays/from-string'
import * as lp from 'it-length-prefixed'

function App() {

  const [libp2p, setLibp2p] = useState({})
  const [whichNode, setWhichNode] = useState("")
  const [input, setInput] = useState("")
  const [streamItems, setStreamItems] = useState([])

  const onStreamItemReceived = (s) => {
    setStreamItems(oldArray => [...oldArray, s])
  }

  return (
    <div className="App">
      <header className="App-header">
        <h3>LIBP2P STREAM BROWSER DEMO</h3>
        {!whichNode && (
          <div>
            <button onClick={async () => {
              const lib = await createListener(onStreamItemReceived)
              setLibp2p(lib)
              setWhichNode("Listener")
            }}>SETUP LIBP2P LISTENER</button>
            <br/>
            <button onClick={async () => {
              const lib = await createDialer()
              setLibp2p(lib)
              setWhichNode("Dialer")
            }}>SETUP LIBP2P DIALER</button>
          </div>
        )}
        <br/>
        {whichNode}
        <br/>
        {whichNode === "Dialer" && (
          <div>
            <input onChange={e => setInput(e.target.value)}/>
            <button onClick={async () => {

              const stream = await createStream(libp2p)
              // console.log("stream: ", stream)

              console.log("send to stream.")
              await pipe(
                input, 
                (source) => map(source, (string) => uint8ArrayFromString(string)),
                lp.encode(),
                stream.sink
              )
              console.log("sent")
              stream.close()
            }}>Send</button>
          </div>
        )}
        {(streamItems && streamItems.length > 0) && (
          <div>
            <br />
            <h3>Messages Received:</h3>
            <ul>
              {streamItems.map((item, i) => {
                return <li key={i}>{item}</li>
              })}
            </ul>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
