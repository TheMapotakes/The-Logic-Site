class Diacritic {
	constructor(uni, type, isLatin) {
		this.str = String.fromCharCode(uni);
		this.html = '&#' + uni + ';';
		this.js = '\\u' + uni.toString(16).padStart(4, '0');
		this.type = type;
		this.latin = !!isLatin;
		this.enabled = true;
	}
}
var Diacritics = [];
function DiacriticAdder3000(from, to, type, isLatin) {
	for (let i = from; i <= to; i++) {
		Diacritics.push(new Diacritic(i, type, !!isLatin));
	}
}
DiacriticAdder3000(768, 789, 1, false);
DiacriticAdder3000(794, 795, 1, false);
DiacriticAdder3000(829, 836, 1, false);
Diacritics.push(new Diacritic(838, 1, false));
DiacriticAdder3000(842, 844, 1, false);
DiacriticAdder3000(848, 850, 1, false);
DiacriticAdder3000(855, 856, 1, false);
Diacritics.push(new Diacritic(859, 1, false));
DiacriticAdder3000(861, 862, 1, false);
DiacriticAdder3000(864, 865, 1, false);
DiacriticAdder3000(790, 793, -1, false);
DiacriticAdder3000(796, 819, -1, false);
DiacriticAdder3000(825, 828, -1, false);
Diacritics.push(new Diacritic(837, -1, false));
DiacriticAdder3000(839, 841, -1, false);
DiacriticAdder3000(845, 846, -1, false);
DiacriticAdder3000(851, 854, -1, false);
DiacriticAdder3000(857, 858, -1, false);
Diacritics.push(new Diacritic(860, -1, false));
Diacritics.push(new Diacritic(863, -1, false));
Diacritics.push(new Diacritic(866, -1, false));
DiacriticAdder3000(820, 824, 0, false);
DiacriticAdder3000(867, 879, 1, true);

class Random {
	constructor(seed) {
		this.seed = seed;

		this.m_w = 123456789;
		this.m_z = 987654321;
		this.mask = 0xffffffff;

		this.changeSeed = function(i) {
			this.m_w = (123456789 + i) & this.mask;
			this.m_z = (987654321 - i) & this.mask;
			this.seed = i;
			valueChange();
		};

		this.random = function() {
			this.m_z = (36969 * (this.m_z & 65535) + (this.m_z >> 16)) & this.mask;
			this.m_w = (18000 * (this.m_w & 65535) + (this.m_w >> 16)) & this.mask;
			var result = ((this.m_z << 16) + (this.m_w & 65535)) >>> 0;
			result /= 4294967296;
			return result;
		};

		this.resetRNG = function() {
			this.m_w = (123456789 + this.seed) & this.mask;
			this.m_z = (987654321 - this.seed) & this.mask;
		};
	}
}
var random = new Random(Date.now());
