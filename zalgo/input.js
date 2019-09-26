var topSlider = document.getElementById('topSlider');
var topNum = document.getElementById('topNum');
var bottomSlider = document.getElementById('bottomSlider');
var bottomNum = document.getElementById('bottomNum');
var centerSlider = document.getElementById('centerSlider');
var centerNum = document.getElementById('centerNum');

topSlider.oninput = function() {
	topNum.value = this.value;
	max = this.value;
	valueChange();
};
topNum.oninput = function() {
	topSlider.value = this.value;
	max = this.value;
	valueChange();
};
bottomSlider.oninput = function() {
	bottomNum.value = this.value;
	min = this.value;
	valueChange();
};
bottomNum.oninput = function() {
	bottomSlider.value = this.value;
	min = this.value;
	valueChange();
};
centerSlider.oninput = function() {
	centerNum.value = this.value;
	center = this.value / 100;
	valueChange();
};
centerNum.oninput = function() {
	centerSlider.value = this.value;
	center = this.value / 100;
	valueChange();
};

var seedSlider = document.getElementById('seedSlider');
var seedNum = document.getElementById('seedNum');
seedSlider.oninput = function() {
	random.changeSeed(this.value);
	seedNum.value = this.value;
};
seedNum.oninput = function() {
	random.changeSeed(this.value);
	seedSlider.value = this.value;
};
seedSlider.value = Date.now();
seedNum.value = Date.now();

var enableAll = document.getElementById('enableAll');
var disableAll = document.getElementById('disableAll');
var toggleAll = document.getElementById('toggleAll');

var enableTop = document.getElementById('enableTop');
var disableTop = document.getElementById('disableTop');
var toggleTop = document.getElementById('toggleTop');

var enableCenter = document.getElementById('enableCenter');
var disableCenter = document.getElementById('disableCenter');
var toggleCenter = document.getElementById('toggleCenter');

var enableBottom = document.getElementById('enableBottom');
var disableBottom = document.getElementById('disableBottom');
var toggleBottom = document.getElementById('toggleBottom');

var enableLatin = document.getElementById('enableLatin');
var disableLatin = document.getElementById('disableLatin');
var toggleLatin = document.getElementById('toggleLatin');

enableAll.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
};
disableAll.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	}
	valueChange();
};
toggleAll.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		let el = document.getElementById('di' + i);
		if (di.enabled) {
			el.style.backgroundColor = '#666666';
			di.enabled = false;
		} else {
			el.style.backgroundColor = '#f7f7f7';
			di.enabled = true;
		}
	}
	valueChange();
};
enableTop.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type < 1) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
};
disableTop.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type < 1) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	}
	valueChange();
};
toggleTop.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type < 1) continue;
		let el = document.getElementById('di' + i);
		if (di.enabled) {
			el.style.backgroundColor = '#666666';
			di.enabled = false;
		} else {
			el.style.backgroundColor = '#f7f7f7';
			di.enabled = true;
		}
	}
	valueChange();
};
enableCenter.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
};
disableCenter.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	}
	valueChange();
};
toggleCenter.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type) continue;
		let el = document.getElementById('di' + i);
		if (di.enabled) {
			el.style.backgroundColor = '#666666';
			di.enabled = false;
		} else {
			el.style.backgroundColor = '#f7f7f7';
			di.enabled = true;
		}
	}
	valueChange();
};
enableBottom.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type > -1) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
};
disableBottom.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type > -1) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	}
	valueChange();
};
toggleBottom.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (di.type > -1) continue;
		let el = document.getElementById('di' + i);
		if (di.enabled) {
			el.style.backgroundColor = '#666666';
			di.enabled = false;
		} else {
			el.style.backgroundColor = '#f7f7f7';
			di.enabled = true;
		}
	}
	valueChange();
};
enableLatin.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (!di.latin) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
};
disableLatin.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (!di.latin) continue;
		let el = document.getElementById('di' + i);
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	}
	valueChange();
};
toggleLatin.onclick = function() {
	for (let i = 0; i < Diacritics.length; i++) {
		let di = Diacritics[i];
		if (!di.latin) continue;
		let el = document.getElementById('di' + i);
		if (di.enabled) {
			el.style.backgroundColor = '#666666';
			di.enabled = false;
		} else {
			el.style.backgroundColor = '#f7f7f7';
			di.enabled = true;
		}
	}
	valueChange();
};

function valueChange() {
	document.getElementById('title').innerHTML = generate('ZALGO', min, max, center);
	document.getElementById('pageTitle').innerHTML = generate('Zalgo - Glitched Text Generator', min, max, center);
	update(generate(input.innerText, min, max, center));

	for (let i = 0; i < letterOptions.length; i++) {
		if (!letterOptions[i].enabled) {
			letterOptions[i].min = min;
			letterOptions[i].max = max;
			letterOptions[i].center = center;
		}
	}
}
valueChange();

function copyToClipboard(element) {
	var $temp = $('<input>');
	$('body').append($temp);
	$temp.val($(element).text()).select();
	document.execCommand('copy');
	$temp.remove();
	return 'Copied ' + $(element).text().length + ' characters to clipboard!';
}

document.getElementById('copyPlain').onclick = function(e) {
	copyText(e, copyToClipboard(document.getElementById('output')));
};
document.getElementById('copyJS').onclick = function(e) {
	let str = '';
	for (let i = 0; i < currentLetters.length; i++) {
		let cl = currentLetters[i];
		for (let j = 0; j < cl.diacriticsLow.length; j++) {
			str += cl.diacriticsLow[j].js;
		}
		str += cl.raw;
		for (let j = 0; j < cl.diacriticsMid.length; j++) {
			str += cl.diacriticsMid[j].js;
		}
		for (let j = 0; j < cl.diacriticsUp.length; j++) {
			str += cl.diacriticsUp[j].js;
		}
	}
	document.getElementById('invisible').innerHTML = str;
	copyText(e, copyToClipboard(document.getElementById('invisible')));
};
document.getElementById('copyHTML').onclick = function(e) {
	let str = '';
	for (let i = 0; i < currentLetters.length; i++) {
		let cl = currentLetters[i];
		for (let j = 0; j < cl.diacriticsLow.length; j++) {
			str += cl.diacriticsLow[j].html;
		}
		str += cl.raw;
		for (let j = 0; j < cl.diacriticsMid.length; j++) {
			str += cl.diacriticsMid[j].html;
		}
		for (let j = 0; j < cl.diacriticsUp.length; j++) {
			str += cl.diacriticsUp[j].html;
		}
	}
	document.getElementById('invisible').innerText = str;
	copyText(e, copyToClipboard(document.getElementById('invisible')));
};

function copyText(event, str) {
	$('#divtoshow').html(str).show();
	let div = document.getElementById('divtoshow');
	div.style.animation = 'moveUpAndDie 1.5s';
	div.style.right = event.clientX;
	div.style.bottom = event.clientY;

	setTimeout(() => $('#divtoshow').hide(), 1400);
}
var selectedLetter = 0;

let letterSelecter = document.getElementById('letterselect');

var globalCheck = document.getElementById('ignoresGlobalCheck');
var topSliderLetter = document.getElementById('topSliderLetter');
var topNumLetter = document.getElementById('topNumLetter');
var bottomSliderLetter = document.getElementById('bottomSliderLetter');
var bottomNumLetter = document.getElementById('bottomNumLetter');
var centerSliderLetter = document.getElementById('centerSliderLetter');
var centerNumLetter = document.getElementById('centerNumLetter');

letterSelecter.onchange = function(e) {
	selectedLetter = $('#letterselect option:selected').val();
	var lo = letterOptions[selectedLetter];

	globalCheck.checked = lo.enabled;
	topSliderLetter.value = lo.max;
	topNumLetter.value = lo.max;
	bottomSliderLetter.value = lo.min;
	bottomNumLetter.value = lo.min;
	centerSliderLetter.value = lo.center;
	centerNumLetter.value = lo.center;
};

topSliderLetter.oninput = function() {
	letterOptions[selectedLetter].max = this.value;
	topNumLetter.value = this.value;
	valueChange();
};
topNumLetter.oninput = function() {
	letterOptions[selectedLetter].max = this.value;
	topSliderLetter.value = this.value;
	valueChange();
};
bottomSliderLetter.oninput = function() {
	letterOptions[selectedLetter].min = this.value;
	bottomNumLetter.value = this.value;
	valueChange();
};
bottomNumLetter.oninput = function() {
	letterOptions[selectedLetter].min = this.value;
	bottomSliderLetter.value = this.value;
	valueChange();
};
centerSliderLetter.oninput = function() {
	letterOptions[selectedLetter].center = this.value;
	centerNumLetter.value = this.value;
	valueChange();
};
centerNumLetter.oninput = function() {
	letterOptions[selectedLetter].center = this.value;
	centerSliderLetter.value = this.value;
	valueChange();
};

globalCheck.oninput = function(e) {
	if (this.checked) {
		letterOptions[selectedLetter].enabled = true;
		letterOptions[selectedLetter].max = topSliderLetter.value;
		letterOptions[selectedLetter].center = centerSliderLetter.value;
		letterOptions[selectedLetter].min = bottomSliderLetter.value;
	} else {
		letterOptions[selectedLetter].enabled = false;
		letterOptions[selectedLetter].max = max;
		letterOptions[selectedLetter].center = center;
		letterOptions[selectedLetter].min = min;
	}
	valueChange();
};
