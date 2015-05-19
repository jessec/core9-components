(function(history) {
	var pushState = history.pushState;
	history.pushState = function(state) {
		if (typeof history.onpushstate == "function") {
			history.onpushstate({
				state : state
			});
		}
		var test = arguments[2];
		if (arguments[2] == 'javascript:void(0);')
			return false;
		window.dispatchEvent(new CustomEvent('urlchange', {
			'detail' : 'some data'
		}));
		return pushState.apply(history, arguments);
	}
})(window.history);

var Router = {
	routes : [],
	mode : null,
	root : '/',
	config : function(options) {
		this.mode = options && options.mode && options.mode == 'history'
				&& !!(history.pushState) ? 'history' : 'hash';
		this.root = options && options.root ? '/'
				+ this.clearSlashes(options.root) + '/' : '/';
		return this;
	},
	getFragment : function() {
		var fragment = '';
		if (this.mode === 'history') {
			fragment = this.clearSlashes(decodeURI(location.pathname));
			fragment = this.root != '/' ? fragment.replace(this.root, '')
					: fragment;
		} else {
			var match = window.location.href.match(/#(.*)$/);
			fragment = match ? match[1] : '';
		}
		return this.clearSlashes(fragment);
	},
	clearSlashes : function(path) {
		return path.toString().replace(/\/$/, '').replace(/^\//, '');
	},
	add : function(re, handler) {
		if (typeof re == 'function') {
			handler = re;
			re = '';
		}
		this.routes.push({
			re : re,
			handler : handler
		});
		return this;
	},
	remove : function(param) {
		for (var i = 0, r; i < this.routes.length, r = this.routes[i]; i++) {
			if (r.handler === param || r.re.toString() === param.toString()) {
				this.routes.splice(i, 1);
				return this;
			}
		}
		return this;
	},
	flush : function() {
		this.routes = [];
		this.mode = null;
		this.root = '/';
		return this;
	},
	check : function(f) {
		var fragment = f || this.getFragment();
		for (var i = 0; i < this.routes.length; i++) {
			var match = fragment.match(this.routes[i].re);
			if (match) {
				match.shift();
				this.routes[i].handler.apply({}, match);
				return this;
			}
		}
		return this;
	},
	listen : function() {
		var self = this;
		var current = self.getFragment();
		var fn = function() {
			if (current !== self.getFragment()) {
				current = self.getFragment();
				self.check(current);
			}
		}
		clearInterval(this.interval);
		this.interval = setInterval(fn, 50);
		return this;
	},
	navigate : function(path) {
		path = path ? path : '';
		if (this.mode === 'history') {
			history.pushState(null, null, this.root + this.clearSlashes(path));
		} else {
			window.location.href = window.location.href.replace(/#(.*)$/, '')
					+ '#' + path;
		}
		return this;
	},
	addRoutes : function(routes) {
		for ( var key in routes) {
			if (routes.hasOwnProperty(key)) {
				var indexKey = key.substring(0, key.length - 1);
				Router.add(indexKey, routes[key]);
			}
		}
	}
}