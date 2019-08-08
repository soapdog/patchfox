/**
 * This is the Contact Cache Shared Worker
 * 
 * Its object is to traverse messages of type contact from
 * the user and targeting the user to assemble a cache of the social
 * graph.
 * 
 * ---- SHARED WORKER NOTES ----
 * 
 * Like all the other workers, it will establish its own WebSocket connection
 * to sbot.
 * 
 * Remember to add all workers to the rollup config.
 */
import ssb from "../platform/ssb/ssb"


onconnect = function (e) {
    let port = e.ports[0];

    // do not start on connect. Receive hermiebox as a message. Hope for the best

    console.log("n", ssb)
  

    const main = async () => {
        port.postMessage("hi!")
        console.log("can haz client?", ssb)
    }

    main()
}

console.log("worker", ssb)