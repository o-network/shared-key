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

let round = 0;

function getPrimeAndBase() {
  round += 1;
  const listOfLargerPrimes = [...take(100, primes(39581*round))];  
  const prime = listOfLargerPrimes[randomUpToInt(listOfLargerPrimes.length - 1)];
  const listOfSmallerPrimes = [...take(10, primes(1453*round))];
  const base = listOfSmallerPrimes[randomUpToInt(listOfSmallerPrimes.length - 1)];

  return { prime, base };
}

function randomUpToInt(n) {
	return Math.round(Math.random() * n);
}

function Peer(prime, base) {
	const private = randomUpToInt(prime - 1);

	this.bases = {};

	this.with = (base) => {
		// If you ask me about a base, I'll tell you about a base!
		// We could also maybe broadcast that we already know specific chains that 
		// have already been completed (later)
		if (this.bases[base]) {
			return this.bases[base];
		}
		this.bases[base] = (BigInt(base) ** BigInt(private)) % BigInt(prime);
		return this.bases[base];
	};

	this.public = () => {
		return this.with(base);
	};
}

function Pool() {

	const { prime, base} = getPrimeAndBase();

	let peers = [];

	this.add = (more) => {
		peers = peers.concat(more);
	};

	this.poolKey = (me) => {
		// Ask for everyones public key thats going to be in the group
		const peersWithPublics = peers.map(peer => ({ peer, public: peer.public() }));
		// This will be in the exact same order for everyone thats in front of me, there will be 
		// someone behind me on each other one, so we can't cache the values nicely, but should be close enough
		// no matter what order they connected in
		const sorted = peersWithPublics
			.sort(({ public: a }, { public: b }) => {
				return a < b ? -1 : 1;
			});

		const groupBase = sorted
			.reduce(
				(base, { peer }) => {
					// We're asking, 
					return peer.with(base);
				},
				base
			);

		return me.with(groupBase);
	};

	this.createPeer = () => new Peer(prime, base);

	this.tellTheWorld = (me) => {
		console.log(`Our shared primes were ${prime} and ${base}, but the key was ${this.poolKey(me)}, and there was ${peers.length} of us!`);
	};
};

function go() {
	const pool = new Pool();

	const peers = Array.from({ length: 5 + randomUpToInt(30) }, () => pool.createPeer());

	pool.add(peers);
	pool.poolKey(peers[0]) === pool.poolKey(peers[peers.length - 1]);

	pool.tellTheWorld(peers[0]);
}

go();
go();
go();
go();

