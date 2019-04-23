const n = BigInt(71);
const b = BigInt(149);

function withBase(a, b) {
  return (a ** b) % n;
}

const pA = BigInt(181);
const pB = BigInt(337);
const pC = BigInt(149);

const pubA = withBase(b, pA);
const pubB = withBase(b, pB);
const pubC = withBase(b, pC);

const pubAB = withBase(pubB, pA);
const pubBC = withBase(pubC, pB);
const pubCA = withBase(pubA, pC);

const pubABC = withBase(pubBC, pA);
const pubBCA = withBase(pubCA, pB);
const pubCBA = withBase(pubAB, pC);

console.log({ pubABC, pubBCA, pubCBA });
//
// const p = BigInt(263);
//
// const pubF = BigInt(236);
// const pubN = BigInt(1084);
// const pubP = BigInt(577);
//
// const pubFN = BigInt(707);
// const pubFP = BigInt(65);
// const pubNF = BigInt(707);
// const pubNP = BigInt(269);
// const pubPF = BigInt(65);
// const pubPN = BigInt(269);
//
// console.log({ pubFN, pubFP });
// console.log({ pubNF, pubNP });
// console.log({ pubPF, pubPN });
//
// const pubFNP = withBase(pubNP, p);
//
// console.log(pubFNP.toString(), require("crypto").createHash("SHA256").update(pubFNP.toString()).digest("hex"));
//
// const pubNFP = withBase(pubFP, p);
//
// console.log(require("crypto").createHash("SHA256").update(pubNFP.toString()).digest("hex"));
//
// const pubPNF = withBase(pubNF, p);
//
// console.log(require("crypto").createHash("SHA256").update(pubPNF.toString()).digest("hex"));
