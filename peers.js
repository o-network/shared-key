function* take(length, iterable) {
  for (let x of iterable) {
    if (length <= 0) return;
    length--;
    yield x;
  }
}

function* primes(n = 2) {
  while (true) {
    if (isPrime(n)) yield n;
    n++;
  }

  function isPrime(num) {
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) {
        return false;
      }
    }
    return true;
  }
}

function getPrimeAndBase() {
  const listOfLargerPrimes = [...take(100, primes(39581))];
  const prime = listOfLargerPrimes[randomUpToInt(listOfLargerPrimes.length - 1)];
  const listOfSmallerPrimes = [...take(10, primes(1453))];
  const base = listOfSmallerPrimes[randomUpToInt(listOfSmallerPrimes.length - 1)];

  return { prime, base };
}

function randomUpToInt(n) {
	return Math.round(Math.random() * n);
}

function Chain(base) {

	let parts = [];

	this.add = (peer) => {
    const nextHead = peer.with(parts);
    parts.push({
      peer,
      head: nextHead
    });
    return this;
  };

	this.from = (parts) => {
		// We don't care about the head, we want to re-create it
		// We might be able to just trust a specific count of peers for this
		// Rather than asking everyone again
		parts.forEach(part => this.add(part.peer));
		return this;
	};

	this.head = () => {
		const last = parts[parts.length - 1];
		return (last ? last.head : base) || base;
	};

	this.parts = () => {
		return parts;
	}

}

function Peer(pool, prime, base) {
	const privateKey = randomUpToInt(prime - 1);

	const withParts = (parts) => {
    const chain = new Chain(base).from(parts);
    const nextBase = chain.head();
    return (BigInt(nextBase) ** BigInt(privateKey)) % BigInt(prime);
	};

	// This would be only accessible to the peer privately
	this.sharedKey = () => {
		return pool.poolKey(this);
	};
	// This as well would be private
	this.withPrivate = (parts) => {
		return withParts(parts);
	};

	this.with = (parts) => {
		if (!pool.shouldAllowParts(this, parts)) {
			return undefined;
		}
		return withParts(parts);
	};

	this.public = () => {
		return this.with([]);
	};
}

function Pool() {

	const { prime, base } = getPrimeAndBase();

	let peers = [];

	this.add = (more) => {
		peers = peers.concat(more);
	};

	this.shouldAllowParts = (me, parts) => {
		const contained = parts.find(({ peer }) => peer === me);
		if (contained) {
			return false; // Doesn't make sense, so no
		}
		// My peers shouldn't be able to ask for everything excluding my key, as then that would give away the secret!
		return parts.length < peers.length - 1;
	};

	this.poolKey = (me) => {
		// Ask for everyones public key thats going to be in the group
		const peersWithPublics = peers
			.map(peer => ({ peer, public: peer.public() }))
			.filter(({ peer }) => peer !== me);
		// This will be in the exact same order for everyone thats in front of me, there will be
		// someone behind me on each other one, so we can't cache the values nicely, but should be close enough
		// no matter what order they connected in
		const sorted = peersWithPublics
			.sort(({ public: a }, { public: b }) => {
				return a < b ? -1 : 1;
			});

		const chain = new Chain(base);

		// Will be added to the chain, ready for our final stamp
		sorted.forEach(({ peer }) => chain.add(peer));

		return me.withPrivate(chain.parts());
	};

	this.createPeer = () => new Peer(this, prime, base);

	this.tellTheWorld = (me) => {
		console.log(`Our shared primes were ${prime} and ${base}, but the key was ${this.poolKey(me)}, and there was ${peers.length} of us!`);
	};
}

function go() {
	const pool = new Pool();
	const peers = Array.from({ length: 4 }, () => pool.createPeer());
	pool.add(peers);
	console.log(peers.map(peer => pool.poolKey(peer)));
	pool.tellTheWorld(peers[0]);
}

go();
