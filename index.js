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
  const listOfLargerPrimes = [...take(100, primes(1453))];  
  const prime = listOfLargerPrimes[randomUpToInt(listOfLargerPrimes.length - 1)];
  const listOfSmallerPrimes = [...take(10, primes(7))];
  const base = listOfSmallerPrimes[randomUpToInt(listOfSmallerPrimes.length - 1)]
  return { prime, base };
}

function randomUpToInt(n) {
	return Math.round(Math.random() * n);
}

function* randomUpToYield(n) {
  while (true) {
    const value = randomUpToInt(n - 1);
    yield BigInt(value);
  }
}

const { prime, base } = getPrimeAndBase();

console.log({ prime, base });

const peerCount = 100 + randomUpToInt(500);

const peerPrivates = [...take(peerCount, randomUpToYield(prime))];

console.log(peerPrivates);

const withBase = (base, private) => (BigInt(base) ** private) % BigInt(prime);

let previous = undefined;

const secrets = peerPrivates
	.map(
		(myPrivate, myIndex) => {
			console.log(`Peer: ${myIndex}`);
			const others = peerPrivates.slice();
			others.splice(myIndex, 1);
			const mine = withBase(
				others
					.reduce(
						(base, next, other) => {
							return withBase(base, next)
						},
						BigInt(base)
					),
				myPrivate
			);
			if (previous) {
				console.log(previous === mine);
				if (previous !== mine) {
					throw new Error("Mismatch");
				}
			}
			previous = mine;
			return mine;
		}
	);


console.log({ prime, base, peerCount, secret: secrets[0] });





