var input = document.getElementById('input');
var output = document.getElementById('output');
var inputChars = document.getElementById('inputChars');
var outputChars = document.getElementById('outputChars');
var currentInput;

function update(str) {
	output.innerText = str;
	outputChars.innerHTML = str.length + ' Characters';
}

function selectText(id) {
	var sel, range;
	var el = document.getElementById(id);
	if (window.getSelection && document.createRange) {
		sel = window.getSelection();
		if (sel.toString() == '') {
			window.setTimeout(function() {
				range = document.createRange();
				range.selectNodeContents(el);
				sel.removeAllRanges();
				sel.addRange(range);
			}, 1);
		}
	} else if (document.selection) {
		sel = document.selection.createRange();
		if (sel.text == '') {
			range = document.body.createTextRange();
			range.moveToElementText(el);
			range.select();
		}
	}
}

let info = document.getElementById('viewer');
let info2 = document.getElementById('viewer2');
let info3 = document.getElementById('viewer3');

function toggleEnabled(id) {
	let el = document.getElementById('di' + id);
	let di = Diacritics[id];
	if (di.enabled) {
		el.style.backgroundColor = '#666666';
		di.enabled = false;
	} else {
		el.style.backgroundColor = '#f7f7f7';
		di.enabled = true;
	}
	valueChange();
}
let third = Diacritics.length / 3;
for (let i = 0; i < Diacritics.length; i++) {
	let diacritic = Diacritics[i];
	let size = diacritic.type < 0 ? 1 : 2;
	let style = '#di' + i + '{font-size: ' + size + 'vw;}';

	if (i < third) {
		info.innerHTML += '<div><div class="display" id="di' + i + '" onclick="toggleEnabled(' + i + ')"' + style + '>' + diacritic.str + '</div></div>';
		info.innerHTML += '<style>' + style + '</style>';
	} else if (i < third * 2) {
		info2.innerHTML += '<div><div class="display" id="di' + i + '" onclick="toggleEnabled(' + i + ')"' + style + '>' + diacritic.str + '</div></div>';
		info2.innerHTML += '<style>' + style + '</style>';
	} else {
		info3.innerHTML += '<div><div class="display" id="di' + i + '" onclick="toggleEnabled(' + i + ')"' + style + '>' + diacritic.str + '</div></div>';
		info3.innerHTML += '<style>' + style + '</style>';
	}
}

var min = -10,
	max = 10,
	center = 0.2;

var letterOptions = [];
class LetterOptions {
	constructor(pos, letter, min, max, center) {
		this.pos = pos;
		this.raw = letter;
		this.min = min;
		this.max = max;
		this.center = center;
		this.enabled = false;
	}
}

function updateLetterOptionCount(str) {
	let selector = document.getElementById('letterselect');
	let newHTML = '';
	letterOptions = [];
	for (let i = 0; i < str.length; i++) {
		letterOptions.push(new LetterOptions(i, str.charAt(i), min, max, center));
		newHTML += '<option value="' + i + '">' + i + ': ' + str.charAt(i) + '</option>';
	}
	selector.innerHTML = newHTML;
}

setInterval(() => {
	if (currentInput != input.innerText) {
		currentInput = input.innerText;
		inputChars.innerHTML = currentInput.length + ' Characters';
		updateLetterOptionCount(input.innerText);
		update(generate(input.innerText, min, max, center));
	}
}, 5);
