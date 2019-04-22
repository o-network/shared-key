const intG = 5; //67;
const intN = 19;// 3329;

const bigG = BigInt(intG);
const bigN = BigInt(intN);

// const bigA = BigInt(Math.round(Math.random() * intN));
// const bigB = BigInt(Math.round(Math.random() * intN));
// const bigC = BigInt(Math.round(Math.random() * intN));

const bigA = BigInt(5);
const bigB = BigInt(7);
const bigC = BigInt(13);

const bigA_3 = (bigG ** bigA) % bigN;
const bigB_3 = (bigG ** bigB) % bigN;
const bigC_3 = (bigG ** bigC) % bigN;

const bigA_2_B = (bigB_3 ** bigA) % bigN;
const bigA_2_C = (bigC_3 ** bigA) % bigN;
const bigB_2_C = (bigC_3 ** bigB) % bigN;

const bigA_1_BC = (bigB_2_C ** bigA) % bigN;
const bigB_1_AC = (bigA_2_C ** bigB) % bigN;
const bigC_1_AB = (bigA_2_B ** bigC) % bigN;

console.log({

	bigG,
	bigN,
	
	bigA_3,
	bigB_3,
	bigC_3,

	bigA_2_B,
	bigA_2_C,
	bigB_2_C,

	bigA_1_BC,
	bigB_1_AC,
	bigC_1_AB,

})