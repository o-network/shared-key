import crypto from "crypto";
import UUID from "pure-uuid";

// Ensure private key details can't be accidentally serialised
const SYMBOL_KEY_EXCHANGE = Symbol("Key Exchange");
const SYMBOL_GROUP_MEMBERS = Symbol("Group Members");
const SYMBOL_GROUP = Symbol("Group");
const SYMBOL_GROUP_NAME = Symbol("Group Name");

export async function createPeerGroup() {
  const id = new UUID(4).format();
  return {
    id,
    [SYMBOL_GROUP_NAME]: "modp18",
    [SYMBOL_GROUP_MEMBERS]: {}
  }
}

export async function createPeer(group) {
  // Primed and ready to roll
  const keyExchange = crypto.getDiffieHellman(group[SYMBOL_GROUP_NAME]);

  keyExchange.generateKeys();
  const id = new UUID(4).format();
  const peer = {
    id,
    group,
    [SYMBOL_KEY_EXCHANGE]: keyExchange,
    [SYMBOL_GROUP]: group
  };
  group[SYMBOL_GROUP_MEMBERS][peer.id] = peer;
  return peer;
}

export function getGenerator(peer) {
  return peer[SYMBOL_KEY_EXCHANGE].getGenerator()
}

function shouldGetNextHead(chain, peer) {
  const contained = chain.find(({ id }) => id === peer.id);
  if (contained) {
    return false; // Doesn't make sense, so no
  }
  // My peers shouldn't be able to ask for everything excluding my key, as then that would give away the secret!
  return chain.length < (Object.keys(peer[SYMBOL_GROUP][SYMBOL_GROUP_MEMBERS]).length - 1);
}

export async function getSecret(chain, peer) {
  const previous = chain[chain.length - 1];
  const nextBase = previous ? previous.head : getGenerator(peer);
  return peer[SYMBOL_KEY_EXCHANGE].computeSecret(nextBase);
}

export async function getNextHead(chain, peer) {
  if (!shouldGetNextHead(chain, peer)) {
    throw new Error("Invalid chain for peer");
  }
  return getSecret(chain, peer);
}
