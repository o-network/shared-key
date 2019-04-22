function* take(length, iterable) {
  for (let x of iterable) {
    if (length <= 0) return;
    length--;
    yield x;
  }
}

const intG = 67;
const intN = 3329;

const bigG = BigInt(intG);
const bigN = BigInt(intN);

function* create() {
	while(true) {
		yield BigInt(Math.round(Math.random() * intN));
	}
}

const privates = [...take(5 + Math.round(Math.random() * 10), create())];

const withBase = (base, private) => (base ** private) % BigInt(bigN);

console.log(privates
	.map(
		(myPrivate, myIndex) => {
			const others = privates.slice();
			others.splice(myIndex, 1);
			console.log(myPrivate, others);
			return withBase(
				others
					.reduce(
						(base, next) => {
							return withBase(base, next)
						},
						bigG
					),
				myPrivate
			);
		}
	));

