import * as utils from 'tempura/utils';

const ESCAPE = /[&"<]/g, CHARS = {
	'"': '&quot;',
	'&': '&amp;',
	'<': '&lt',
};

export function esc(value) {
	if (typeof value !== 'string') return value;
	let last=ESCAPE.lastIndex=0, tmp=0, out='';
	while (ESCAPE.test(value)) {
		tmp = ESCAPE.lastIndex - 1;
		out += value.substring(last, tmp) + CHARS[value[tmp]];
		last = tmp + 1;
	}
	return out + value.substring(last);
}

export function compile(input, options={}) {
	return new Function('$$1', '$$2', '$$3', utils.gen(input, options)).bind(0, options.escape || esc, options.blocks);
}

export function transform(input, options={}) {
	return (
		options.format === 'cjs'
		? 'var $$1=require("tempura").esc;module.exports='
		: 'import{esc as $$1}from"tempura";export default '
	) + 'function($$3,$$2){'+utils.gen(input, options)+'}';
}
