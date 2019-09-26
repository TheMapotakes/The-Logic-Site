class Letter {
	constructor(l, min, max, center) {
		this.raw = l;
		this.str = this.raw;
		this.diacriticsLow = [];
		this.diacriticsMid = [];
		this.diacriticsUp = [];

		let above = Diacritics.filter((d) => d.type > 0 && d.enabled);
		let on = Diacritics.filter((d) => !d.type && d.enabled);
		let under = Diacritics.filter((d) => d.type < 0 && d.enabled);

		for (let i = 0; i > min; i--) {
			if (!under.length) break;
			let d = under[Math.floor(random.random() * under.length)];
			this.diacriticsLow.push(d);
			this.str = d.str + this.str;
		}
		for (let i = 0; i < on.length; i++) {
			if (center < random.random() || !on.length) break;
			let d = on[Math.floor(random.random() * on.length)];
			this.diacriticsMid.push(d);
			this.str += d.str;
		}
		for (let i = 0; i < max; i++) {
			if (!above.length) break;
			let d = above[Math.floor(random.random() * above.length)];
			this.diacriticsUp.push(d);
			this.str += d.str;
		}
	}
}

var currentLetters = [];
function generate(str, min, max, center) {
	random.resetRNG();
	let newStr = '';
	for (let i = 0; i < str.length; i++) {
		if (letterOptions[i] && letterOptions[i].enabled) {
			var minimum = Math.abs(letterOptions[i].min) * -1;
			var maximum = letterOptions[i].max;
			var centerium = letterOptions[i].center;
		} else {
			var minimum = Math.abs(min) * -1;
			var maximum = max;
			var centerium = center;
		}
		let l = new Letter(str.charAt(i), minimum, maximum, centerium);
		newStr += l.str;
		currentLetters.push(l);
	}
	return newStr;
}
