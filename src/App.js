import logo from './logo.svg';
import './App.css';
import { useState } from "react"
import { createListener } from './libp2p/listener';
import { createDialer, createStream } from './libp2p/dialer';

function App() {

  const [libp2p, setLibp2p] = useState({})
  const [whichNode, setWhichNode] = useState("")

  return (
    <div className="App">
      <header className="App-header">
        <h3>LIBP2P STREAM BROWSER DEMO</h3>
        {!whichNode && (
          <div>
            <button onClick={async () => {
              const lib = await createListener()
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
          <button onClick={async () => {
            const stream = await createStream(libp2p)
            console.log("stream: ", stream)
          }}>{"CREATE STREAM DIALER -> LISTENER"}</button>
        )}
      </header>
    </div>
  );
}

export default App;
