# Discussion around usage of Diffie-Hellman to establish a common private key between 1+n parties

> This is just an idea I had one night, I have no idea if this is completely safe for creating a shared key, but it surely does seem right. 
> I've been trying out different values for `n` and `b`, and get a good amount of compute time for each public key generation, even for "smaller" primes (`n = 75227`). 
> 
> I have also no idea if this is a novel idea or if I've just thought of something someone else has already thought of. I just wanted to write down what _I_ was thinking when I couldn't get to sleep! 
>
> I would assume that this could be used along with a time variable that integrates with each peers private key, or maybe a time factor in between keys, e.g. "I expect this packet to take x long to get there, any longer and you're toast, any shorter and I guess you could wait? But check an expensive operation every millisecond". 
> 
> What am I thinking really though? I would hope there would be some kind of solution where a shared private key could be generated between any group of people, slowly drifting forward where the key is driven by a community of trust between individuals and companies.
> 
> If this isn't a viable solution, then cool, I gave something a go :). 

Given two primes (`n` & `b`), where `n>b`, it is possible for infinite number of peers to create a shared private secret that can be only created where each party includes their own private key. 

This shared private key can be re-generated by changing either `n`, `b`, or any individual private key.

This section of code asserts that if each public key is available in this order we're able to create a shared private key:

```js
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
							console.log(`Other: ${other}`);
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

if (previous !== secrets[0]) {
	throw new Error("Final Mismatch");
}
```

Given there are 3 peers, these values are required before starting:

where `b` = base public or shared private prime, `n` large public or shared private prime. `z = random(0...n-1)` (peer 1 private value),`g = random(0...n-1)` (peer 2 private value),`f = random(0...n-1)` (peer 3 private value).

## Some ideas

I've play around with this and I believe it would be possible to do a trickle through system where a shared key propagates over time throughout a trusted network, the work could then also decide on who not to trust by not accepting public keys into their groups. 

I would expect that a sufficiently large prime would be needed for both `b` and `n` to make it harder for the brute force at finding the key. 

Of course the greatest weakness here is the possibility of someone finding out that key, but the key could be a value signed from another device that is done on a secure enclave like product. 

## Code of Conduct 

This project and everyone participating in it is governed by the [Code of Conduct listed here](./CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [conduct@open-network.dev](mailto:conduct@open-nework.dev).

## Licence

The written documentation and source code examples are licensed under the [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/) license.