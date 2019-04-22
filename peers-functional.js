import { createPeer, createPeerGroup, getSecret, getNextHead } from "./src/peer";
import { chain } from "./src/chain";

(async () => {

  const group = await createPeerGroup();

  const peers = await Promise.all(Array.from({ length: 10 }, () => createPeer(group)));

  const secrets = await Promise.all(
    peers.map(
      async (me, index) => {
        const others = peers.slice();
        others.splice(index, 1);
        const fullChain = await  chain(chain([], getNextHead, ...others), getSecret, me);
        return fullChain[fullChain.length - 1].head;
      }
    )
  );

  // Each secret was made by each peer...
  console.log(secrets);

  console.log(secrets.reduce(
    (as, secret) => {
      if (!as) {
        return false;
      }
      return Buffer.compare(as, secret) === 0 ? secret : false;
    },
    secrets[0]
  ).compare(secrets[0]) === 0);

})()
  .then(() => console.log('Done'))
  .catch((error) => console.warn(error));
