var CSS = function() {
	if (!(this instanceof CSS)) return new CSS();
	var el = document.createElement("style"), s, r;
	document.getElementsByTagName('head')[0].appendChild(el);
	s = el.sheet || el.styleSheet;
	this._r = r = s.cssRules || s.rules;
	this._add = (s.addRule) ? (function(c, d) { s.addRule(c, d.replace(/[\{\}]/g, "")); }) : (function(c, d) { s.insertRule(c + "{" + d.replace(/[\{\}]/g, "") + "}", r.length); });
	this._remove = (s.removeRule) ? (function(i) { s.removeRule(i); }) : (function(i) {	s.deleteRule(i); });
};

CSS.prototype._getSelectorText = function(s) { //IE는 selectorText중 태그명을 대문자로 만든다.
	this.add(s, "foo:bar");
	var i = this._r.length - 1,
		ret = this._r[i].selectorText;
	this._remove(i);
	return ret;
};

CSS.prototype._find = function(s) {
	var a = this._r, i, l = a.length,
		ret = [];
	for (i = 0; i < l; i++) {
		if (s === "*" || a[i].selectorText === this._getSelectorText(s)) {
			ret.push({ index : i, rule : a[i] });
		}
	}
	return ret;
};

CSS.prototype.add = function(s, d) {
	this._add(s, d);
	return this;
};

CSS.prototype.remove = function(s) {
	switch (typeof s) {
		case "string":
			var found = this._find(s), i;
			for (i = found.length - 1; i >= 0; i--) {
				this._remove(found[i].index);
			}
		break;
		case "number":
			this._remove(s);
		break;
	}
	return this;
};

CSS.prototype.reset = function() {
	var a = this._r;
	for (var i = a.length - 1; i >= 0; i--) {
		this._remove(i);
	}
	return this;
};