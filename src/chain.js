import { getGenerator } from "./peer";
import { hash } from "./util";

export function chain(parts, fn, ...peers) {
  return peers.reduce(
    async (partsPromise, peer) => {
      const nextParts = await partsPromise;
      const previous = nextParts[nextParts.length - 1];
      const previousHead = previous ? previous.head : getGenerator(peer);
      const nextHead = await fn(nextParts, peer);
      return nextParts.concat({
        head: nextHead,
        id: peer.id,
        // This is a
        hash: await hash(Buffer.concat([Buffer.from(peer.id, "utf-8"), previousHead, nextHead]))
      })
    },
    parts
  )
}
