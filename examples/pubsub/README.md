# Publish Subscribe

Publish Subscribe is also included on the stack. Currently, we have two PubSub implementation available [libp2p-floodsub](https://github.com/libp2p/js-libp2p-floodsub) and [libp2p-gossipsub](https://github.com/ChainSafe/js-libp2p-gossipsub), with many more being researched at [research-pubsub](https://github.com/libp2p/research-pubsub).

We've seen many interesting use cases appear with this, here are some highlights:

- [Collaborative Text Editing](https://www.youtube.com/watch?v=-kdx8rJd8rQ)
- [IPFS PubSub (using libp2p-floodsub) for IoT](https://www.youtube.com/watch?v=qLpM5pBDGiE).
- [Real Time distributed Applications](https://www.youtube.com/watch?v=vQrbxyDPSXg)

## 0. Set up the example

Before moving into the examples, you should run `npm install` on the top level `js-libp2p` folder, in order to install all the dependencies needed for this example. In addition, you will need to install the example related dependencies by doing `cd examples && npm install`. Once the install finishes, you should move into the example folder with `cd pubsub`.

## 1. Setting up a simple PubSub network on top of libp2p

For this example, we will use MulticastDNS for automatic Peer Discovery. This example is based the previous examples found in [Discovery Mechanisms](../discovery-mechanisms). You can find the complete version at [1.js](./1.js).

Using PubSub is super simple, you only need to provide the implementation of your choice and you are ready to go. No need for extra configuration.

First, let's update our libp2p configuration with a pubsub implementation.

```JavaScript
const Libp2p = require('libp2p')
const Gossipsub = require('libp2p-gossipsub')

const node = await Libp2p.create({
  addresses: {
    listen: ['/ip4/0.0.0.0/tcp/0']
  },
  modules: {
    transport: [ TCP ],
    streamMuxer: [ Mplex ],
    connEncryption: [ NOISE ],
    // we add the Pubsub module we want
    pubsub: Gossipsub
  }
})
```

Once that is done, we only need to create a few libp2p nodes, connect them and everything is ready to start using pubsub.

```JavaScript
const topic = 'news'

const node1 = nodes[0]
const node2 = nodes[1]

// Add node's 2 data to the PeerStore
node1.peerStore.addressBook.set(node2.peerId, node2.multiaddrs)
await node1.dial(node2.peerId)

node1.pubsub.on(topic, (msg) => {
  console.log(`node1 received: ${uint8ArrayToString(msg.data)}`)
})
await node1.pubsub.subscribe(topic)

// Will not receive own published messages by default
node2.pubsub.on(topic, (msg) => {
  console.log(`node2 received: ${uint8ArrayToString(msg.data)}`)
})
await node2.pubsub.subscribe(topic)

// node2 publishes "news" every second
setInterval(() => {
  node2.pubsub.publish(topic, uint8ArrayFromString('Bird bird bird, bird is the word!'))
}, 1000)
```

The output of the program should look like:

```
> node 1.js
connected to QmWpvkKm6qHLhoxpWrTswY6UMNWDyn8hN265Qp9ZYvgS82
node1 received: Bird bird bird, bird is the word!
node1 received: Bird bird bird, bird is the word!
```

You can change the pubsub `emitSelf` option if you want the publishing node to receive its own messages.

```JavaScript
const defaults = {
  config: {
    pubsub: {
      enabled: true,
      emitSelf: true
    }
  }
}
```

The output of the program should look like:

```
> node 1.js
connected to QmWpvkKm6qHLhoxpWrTswY6UMNWDyn8hN265Qp9ZYvgS82
node1 received: Bird bird bird, bird is the word!
node2 received: Bird bird bird, bird is the word!
node1 received: Bird bird bird, bird is the word!
node2 received: Bird bird bird, bird is the word!
```

## 2. Future work

libp2p/IPFS PubSub is enabling a whole set of Distributed Real Time applications using CRDT (Conflict-Free Replicated Data Types). It is still going through heavy research (and hacking) and we invite you to join the conversation at [research-CRDT](https://github.com/ipfs/research-CRDT). Here is a list of some of the exciting examples:

- [PubSub Room](https://github.com/ipfs-labs/ipfs-pubsub-room)
- [Live DB - A always in Sync DB using CRDT](https://github.com/ipfs-labs/ipfs-live-db)
- [IIIF Annotations over IPFS, CRDT and libp2p](https://www.youtube.com/watch?v=hmAniA6g9D0&feature=youtu.be&t=10m40s)
- [orbit.chat - p2p chat application, fully running in the browser with js-ipfs, js-libp2p and orbit-db](http://orbit.chat/)
