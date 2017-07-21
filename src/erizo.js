/*eslint-disable */
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(p, r, n) {
    p != Array.prototype && p != Object.prototype && (p[r] = n.value)
};
$jscomp.getGlobal = function(p) {
return "undefined" != typeof window && window === p ? p : "undefined" != typeof global && null != global ? global : p
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
$jscomp.initSymbol = function() {};$jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.symbolCounter_ = 0;
$jscomp.Symbol = function(p) {
return $jscomp.SYMBOL_PREFIX + (p || "") + $jscomp.symbolCounter_++
};
$jscomp.initSymbolIterator = function() {
$jscomp.initSymbol();
var p = $jscomp.global.Symbol.iterator;
p || (p = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));"function" != typeof Array.prototype[p] && $jscomp.defineProperty(Array.prototype, p, {
    configurable: !0,
    writable: !0,
    value: function() {
        return $jscomp.arrayIterator(this)
    }
});
$jscomp.initSymbolIterator = function() {}
};
$jscomp.arrayIterator = function(p) {
var r = 0;
return $jscomp.iteratorPrototype(function() {
    return r < p.length ? {
        done: !1,
        value: p[r++]
    } : {
        done: !0
    }
})
};
$jscomp.iteratorPrototype = function(p) {
$jscomp.initSymbolIterator();
p = {
    next: p
};
p[$jscomp.global.Symbol.iterator] = function() {
    return this
};return p
};
$jscomp.makeIterator = function(p) {
$jscomp.initSymbolIterator();
var r = p[Symbol.iterator];
return r ? r.call(p) : $jscomp.arrayIterator(p)
};
$jscomp.arrayFromIterator = function(p) {
for (var r, n = []; !(r = p.next()).done;) n.push(r.value);
return n
};
$jscomp.arrayFromIterable = function(p) {
return p instanceof Array ? p : $jscomp.arrayFromIterator($jscomp.makeIterator(p))
};
$jscomp.iteratorFromArray = function(p, r) {
$jscomp.initSymbolIterator();p instanceof String && (p += "");
var n = 0,
    k = {
        next: function() {
            if (n < p.length) {
                var h = n++;
                return {
                    value: r(h, p[h]),
                    done: !1
                }
            }
            k.next = function() {
                return {
                    done: !0,
                    value: void 0
                }
            };return k.next()
        }
    };
k[Symbol.iterator] = function() {
    return k
};return k
};
$jscomp.polyfill = function(p, r, n, k) {
if (r) {
    n = $jscomp.global;
    p = p.split(".");
    for (k = 0; k < p.length - 1; k++) {
        var h = p[k];
        h in n || (n[h] = {});
        n = n[h]
    }
    p = p[p.length - 1];
    k = n[p];
    r = r(k);r != k && null != r && $jscomp.defineProperty(n, p, {
        configurable: !0,
        writable: !0,
        value: r
    })
}
};$jscomp.polyfill("Array.prototype.keys", function(p) {
    return p ? p : function() {
        return $jscomp.iteratorFromArray(this, function(p) {
            return p
        })
    }
}, "es6", "es3");
$jscomp.findInternal = function(p, r, n) {
p instanceof String && (p = String(p));
for (var k = p.length, h = 0; h < k; h++) {
    var e = p[h];
    if (r.call(n, e, h, p)) return {
            i: h,
            v: e
    }
}
return {
    i: -1,
    v: void 0
}
};$jscomp.polyfill("Array.prototype.find", function(p) {
    return p ? p : function(p, n) {
        return $jscomp.findInternal(this, p, n).v
    }
}, "es6", "es3");
$jscomp.owns = function(p, r) {
return Object.prototype.hasOwnProperty.call(p, r)
};
$jscomp.polyfill("WeakMap", function(p) {
    function r(d) {
        $jscomp.owns(d, k) || $jscomp.defineProperty(d, k, {
            value: {}
        })
    }
    function n(d) {
        var c = Object[d];
        c && (Object[d] = function(d) {
            r(d);return c(d)
        })
    }
    if (function() {
                if (!p || !Object.seal) return !1;
                try {
                    var d = Object.seal({}),
                        c = Object.seal({}),
                        g = new p([[d, 2], [c, 3]]);
                    if (2 != g.get(d) || 3 != g.get(c)) return !1;
                    g.delete(d);g.set(c, 4);return !g.has(d) && 4 == g.get(c)
                } catch ( a ) {
                    return !1
                }
            }()) return p;
    var k = "$jscomp_hidden_" + Math.random().toString().substring(2);
    n("freeze");n("preventExtensions");
    n("seal");
    var h = 0,
        e = function(d) {
            this.id_ = (h += Math.random() + 1).toString();
            if (d) {
                $jscomp.initSymbol();$jscomp.initSymbolIterator();
                d = $jscomp.makeIterator(d);
                for (var c; !(c = d.next()).done;) c = c.value, this.set(c[0], c[1])
            }
        };
    e.prototype.set = function(d, c) {
        r(d);
        if (!$jscomp.owns(d, k))
            throw Error("WeakMap key fail: " + d);
        d[k][this.id_] = c;return this
    };
    e.prototype.get = function(d) {
        return $jscomp.owns(d, k) ? d[k][this.id_] : void 0
    };
    e.prototype.has = function(d) {
        return $jscomp.owns(d, k) && $jscomp.owns(d[k], this.id_)
    };
    e.prototype.delete = function(d) {
        return $jscomp.owns(d, k) && $jscomp.owns(d[k], this.id_) ?
            delete d[k][this.id_]
            : !1
    };return e
}, "es6", "es3");
$jscomp.MapEntry = function() {};
$jscomp.polyfill("Map", function(p) {
    if (!$jscomp.ASSUME_NO_NATIVE_MAP && function() {
                if (!p || !p.prototype.entries || "function" != typeof Object.seal) return !1;
                try {
                    var c = Object.seal({
                            x: 4
                        }),
                        d = new p($jscomp.makeIterator([[c, "s"]]));
                    if ("s" != d.get(c) || 1 != d.size || d.get({
                                x: 4
                            }) || d.set({
                                x: 4
                            }, "t") != d || 2 != d.size) return !1;
                    var a = d.entries(),
                        b = a.next();
                    if (b.done || b.value[0] != c || "s" != b.value[1]) return !1;
                    b = a.next();return b.done || 4 != b.value[0].x || "t" != b.value[1] || !a.next().done ? !1 : !0
                } catch ( q ) {
                    return !1
                }
            }()) return p;
    $jscomp.initSymbol();
    $jscomp.initSymbolIterator();
    var r = new WeakMap,
        n = function(c) {
            this.data_ = {};
            this.head_ = e();
            this.size = 0;
            if (c) {
                c = $jscomp.makeIterator(c);
                for (var d; !(d = c.next()).done;) d = d.value, this.set(d[0], d[1])
            }
        };
    n.prototype.set = function(c, d) {
        var a = k(this, c);
        a.list || (a.list = this.data_[a.id] = []);
        a.entry ? a.entry.value = d : (a.entry = {
            next: this.head_,
            previous: this.head_.previous,
            head: this.head_,
            key: c,
            value: d
        }, a.list.push(a.entry), this.head_.previous.next = a.entry, this.head_.previous = a.entry, this.size++);return this
    };
    n.prototype.delete = function(c) {
        c = k(this, c);return c.entry && c.list ? (c.list.splice(c.index, 1), c.list.length ||
        delete this.data_[c.id]
        , c.entry.previous.next = c.entry.next, c.entry.next.previous = c.entry.previous, c.entry.head = null, this.size--, !0) : !1
    };
    n.prototype.clear = function() {
        this.data_ = {};
        this.head_ = this.head_.previous = e();
        this.size = 0
    };
    n.prototype.has = function(c) {
        return !!k(this, c).entry
    };
    n.prototype.get = function(c) {
        return (c = k(this, c).entry) && c.value
    };
    n.prototype.entries = function() {
        return h(this, function(c) {
            return [c.key,
                c.value]
        })
    };
    n.prototype.keys = function() {
        return h(this, function(c) {
            return c.key
        })
    };
    n.prototype.values = function() {
        return h(this, function(c) {
            return c.value
        })
    };
    n.prototype.forEach = function(c, d) {
        for (var a = this.entries(), b; !(b = a.next()).done;) b = b.value, c.call(d, b[1], b[0], this)
    };
    n.prototype[Symbol.iterator] = n.prototype.entries;
    var k = function(c, g) {
            var a = g && typeof g;
            "object" == a || "function" == a ? r.has(g) ? a = r.get(g) : (a = "" + ++d, r.set(g, a)) : a = "p_" + g;
            var b = c.data_[a];
            if (b && $jscomp.owns(c.data_, a))
                for (c = 0; c < b.length; c++) {
                    var q = b[c];
                    if (g !== g && q.key !== q.key || g === q.key) return {
                            id: a,
                            list: b,
                            index: c,
                            entry: q
                    }
            }
            return {
                id: a,
                list: b,
                index: -1,
                entry: void 0
            }
        },
        h = function(c, d) {
            var a = c.head_;
            return $jscomp.iteratorPrototype(function() {
                if (a) {
                    for (; a.head != c.head_;) a = a.previous;
                    for (; a.next != a.head;) return a = a.next, {
                                done: !1,
                                value: d(a)
                            };
                    a = null
                }
                return {
                    done: !0,
                    value: void 0
                }
            })
        },
        e = function() {
            var c = {};
            return c.previous = c.next = c.head = c
        },
        d = 0;
    return n
}, "es6", "es3");
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(p) {
    function r() {
        this.batch_ = null
    }
    function n(d) {
        return d instanceof h ? d : new h(function(c, g) {
            c(d)
        })
    }
    if (p && !$jscomp.FORCE_POLYFILL_PROMISE) return p;
    r.prototype.asyncExecute = function(d) {
        null == this.batch_ && (this.batch_ = [], this.asyncExecuteBatch_());this.batch_.push(d);return this
    };
    r.prototype.asyncExecuteBatch_ = function() {
        var d = this;
        this.asyncExecuteFunction(function() {
            d.executeBatch_()
        })
    };
    var k = $jscomp.global.setTimeout;
    r.prototype.asyncExecuteFunction = function(d) {
        k(d,
            0)
    };
    r.prototype.executeBatch_ = function() {
        for (; this.batch_ && this.batch_.length;) {
            var d = this.batch_;
            this.batch_ = [];
            for (var c = 0; c < d.length; ++c) {
                var g = d[c];
                delete d[c];
                try {
                    g()
                } catch ( a ) {
                    this.asyncThrow_(a)
                }
            }
        }
        this.batch_ = null
    };
    r.prototype.asyncThrow_ = function(d) {
        this.asyncExecuteFunction(function() {
            throw d;
        })
    };
    var h = function(d) {
        this.state_ = 0;
        this.result_ = void 0;
        this.onSettledCallbacks_ = [];
        var c = this.createResolveAndReject_();
        try {
            d(c.resolve, c.reject)
        } catch ( g ) {
            c.reject(g)
        }
    };
    h.prototype.createResolveAndReject_ = function() {
        function d(a) {
            return function(b) {
                g || (g = !0, a.call(c, b))
            }
        }
        var c = this,
            g = !1;
        return {
            resolve: d(this.resolveTo_),
            reject: d(this.reject_)
        }
    };
    h.prototype.resolveTo_ = function(d) {
        if (d === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
        else if (d instanceof h) this.settleSameAsPromise_(d);
        else {
            a:switch (typeof d) {
            case "object":
                var c = null != d;
                break a;case "function":
                c = !0;
                break a;default:
                c = !1
            }
            c ? this.resolveToNonPromiseObj_(d) : this.fulfill_(d)
        }
    };
    h.prototype.resolveToNonPromiseObj_ = function(d) {
        var c = void 0;
        try {
            c = d.then
        } catch ( g ) {
            this.reject_(g);return
        }
        "function" == typeof c ? this.settleSameAsThenable_(c, d) : this.fulfill_(d)
    };
    h.prototype.reject_ = function(d) {
        this.settle_(2, d)
    };
    h.prototype.fulfill_ = function(d) {
        this.settle_(1, d)
    };
    h.prototype.settle_ = function(d, c) {
        if (0 != this.state_)
            throw Error("Cannot settle(" + d + ", " + c | "): Promise already settled in state" + this.state_);
        this.state_ = d;
        this.result_ = c;this.executeOnSettledCallbacks_()
    };
    h.prototype.executeOnSettledCallbacks_ = function() {
        if (null != this.onSettledCallbacks_) {
            for (var d = this.onSettledCallbacks_, c = 0; c < d.length; ++c) d[c].call(), d[c] = null;
            this.onSettledCallbacks_ = null
        }
    };
    var e = new r;
    h.prototype.settleSameAsPromise_ = function(d) {
        var c = this.createResolveAndReject_();
        d.callWhenSettled_(c.resolve, c.reject)
    };
    h.prototype.settleSameAsThenable_ = function(d, c) {
        var g = this.createResolveAndReject_();
        try {
            d.call(c, g.resolve, g.reject)
        } catch ( a ) {
            g.reject(a)
        }
    };
    h.prototype.then = function(d, c) {
        function g(c, d) {
            return "function" == typeof c ? function(d) {
                try {
                    a(c(d))
                } catch ( t ) {
                    b(t)
                }
            } : d
        }
        var a,
            b,
            q = new h(function(c,
                d) {
                a = c;
                b = d
            });
        this.callWhenSettled_(g(d, a), g(c, b));return q
    };
    h.prototype.catch = function(d) {
        return this.then(void 0, d)
    };
    h.prototype.callWhenSettled_ = function(d, c) {
        function g() {
            switch (a.state_) {
            case 1:
                d(a.result_);
                break;case 2:
                c(a.result_);
                break;default:
                throw Error("Unexpected state: " + a.state_);
            }
        }
        var a = this;
        null == this.onSettledCallbacks_ ? e.asyncExecute(g) : this.onSettledCallbacks_.push(function() {
            e.asyncExecute(g)
        })
    };
    h.resolve = n;
    h.reject = function(d) {
        return new h(function(c, g) {
            g(d)
        })
    };
    h.race = function(d) {
        return new h(function(c,
            g) {
            for (var a = $jscomp.makeIterator(d), b = a.next(); !b.done; b = a.next()) n(b.value).callWhenSettled_(c, g)
        })
    };
    h.all = function(d) {
        var c = $jscomp.makeIterator(d),
            g = c.next();
        return g.done ? n([]) : new h(function(a, b) {
            function d(b) {
                return function(c) {
                    m[b] = c;l--;0 == l && a(m)
                }
            }
            var m = [],
                l = 0;
            do m.push(void 0), l++, n(g.value).callWhenSettled_(d(m.length - 1), b), g = c.next(); while (!g.done)
        })
    };return h
}, "es6", "es3");
$jscomp.polyfill("Object.assign", function(p) {
    return p ? p : function(p, n) {
        for (var k = 1; k < arguments.length; k++) {
            var h = arguments[k];
            if (h)
                for (var e in h) $jscomp.owns(h, e) && (p[e] = h[e])
        }
        return p
    }
}, "es6", "es3");

window.Erizo = function(p) {
    function r(k) {
        if (n[k]) return n[k].exports;
        var h = n[k] = {
            i: k,
            l: !1,
            exports: {}
        };
        p[k].call(h.exports, h, h.exports, r);
        h.l = !0;return h.exports
    }
    var n = {};
    r.m = p;
    r.c = n;
    r.d = function(k, h, e) {
        r.o(k, h) || Object.defineProperty(k, h, {
            configurable: !1,
            enumerable: !0,
            get: e
        })
    };
    r.n = function(k) {
        var h = k && k.__esModule ? function() {
            return k["default"]
        } : function() {
            return k
        };
        r.d(h, "a", h);return h
    };
    r.o = function(k, h) {
        return Object.prototype.hasOwnProperty.call(k, h)
    };
    r.p = "";return r(r.s = 9)
}([function(p, r, n) {
    var k = function() {
        var h = "";
        var e = function(d) {
            console.log.apply(console, [].concat($jscomp.arrayFromIterable(d)))
        };
        return {
            DEBUG: 0,
            TRACE: 1,
            INFO: 2,
            WARNING: 3,
            ERROR: 4,
            NONE: 5,
            setLogLevel: function(d) {
                var c = d;
                d > k.NONE ? c = k.NONE : d < k.DEBUG && (c = k.DEBUG);
                k.logLevel = c
            },
            setOutputFunction: function(d) {
                e = d
            },
            setLogPrefix: function(d) {
                h = d
            },
            log: function(d, c) {
                for (var g = [], a = 1; a < arguments.length; ++a) g[a - 1] = arguments[a];
                a = h;
                if (!(d < k.logLevel))
                    if (d === k.DEBUG ? a += "DEBUG" : d === k.TRACE ? a += "TRACE" : d === k.INFO ? a += "INFO" : d === k.WARNING ? a += "WARNING" : d === k.ERROR && (a += "ERROR"), g = [a + ": "].concat(g), void 0 !== k.panel) {
                        a = "";
                        for (var b = 0; b < g.length; b += 1) a += g[b];
                        k.panel.value = k.panel.value + "\n" + a
                    } else e.apply(k, [g])
            },
            debug: function(d) {
                for (var c = [], g = 0; g < arguments.length; ++g) c[g - 0] = arguments[g];
                k.log.apply(k, [].concat([k.DEBUG], $jscomp.arrayFromIterable(c)))
            },
            trace: function(d) {
                for (var c = [], g = 0; g < arguments.length; ++g) c[g - 0] = arguments[g];
                k.log.apply(k, [].concat([k.TRACE], $jscomp.arrayFromIterable(c)))
            },
            info: function(d) {
                for (var c = [], g = 0; g < arguments.length; ++g) c[g -
                    0] = arguments[g];
                k.log.apply(k, [].concat([k.INFO], $jscomp.arrayFromIterable(c)))
            },
            warning: function(d) {
                for (var c = [], g = 0; g < arguments.length; ++g) c[g - 0] = arguments[g];
                k.log.apply(k, [].concat([k.WARNING], $jscomp.arrayFromIterable(c)))
            },
            error: function(d) {
                for (var c = [], g = 0; g < arguments.length; ++g) c[g - 0] = arguments[g];
                k.log.apply(k, [].concat([k.ERROR], $jscomp.arrayFromIterable(c)))
            }
        }
    }();
    r.a = k
}, function(p, r, n) {
    n.d(r, "a", function() {
        return h
    });n.d(r, "b", function() {
        return e
    });n.d(r, "c", function() {
        return d
    });n.d(r,
        "d", function() {
            return c
        });
    var k = n(0),
        h = function() {
            var c = {},
                a = {};
            c.addEventListener = function(b, c) {
                void 0 === a[b] && (a[b] = []);a[b].push(c)
            };
            c.removeEventListener = function(b, c) {
                c = a[b].indexOf(c);-1 !== c && a[b].splice(c, 1)
            };
            c.dispatchEvent = function(b) {
                if (!b || !b.type)
                    throw Error("Undefined event");
                k.a.debug("Event: " + b.type);
                for (var c = a[b.type] || [], d = 0; d < c.length; d += 1) c[d](b)
            };
            c.on = c.addEventListener;
            c.off = c.removeEventListener;
            c.emit = c.dispatchEvent;return c
        },
        e = function(c) {
            var a = {};
            a.type = c.type;return a
        },
        d = function(c) {
            var a = e(c);
            a.streams = c.streams;
            a.message = c.message;return a
        },
        c = function(c) {
            var a = e(c);
            a.stream = c.stream;
            a.msg = c.msg;
            a.bandwidth = c.bandwidth;return a
    }
}, function(p, r, n) {
    var k = n(1);
    r.a = function() {
        var h = Object(k.a)({});
        h.url = "";return h
    }
}, function(p, r, n) {
    (function(k) {
        var h = n(12),
            e = n(13),
            d = n(14),
            c = n(0),
            g = 103,
            a = function() {
                var a = "none";
                "undefined" !== typeof k && k.exports ? a = "fake" : null !== window.navigator.userAgent.match("Firefox") ? a = "mozilla" : null !== window.navigator.userAgent.match("Chrome") ?
                    (a = "chrome-stable", null !== window.navigator.userAgent.match("Electron") && (a = "electron")) : null !== window.navigator.userAgent.match("Safari") ? a = "safari" : null !== window.navigator.userAgent.match("AppleWebKit") && (a = "safari");return a
            };
        r.a = {
            GetUserMedia: function(b, d, g) {
                d = void 0 === d ? function() {} : d;
                g = void 0 === g ? function() {} : g;
                var l,
                    e = function(f, a, b) {
                        navigator.mediaDevices.getUserMedia(f).then(a).catch(b)
                    },
                    q = function() {
                        c.a.debug("Screen access requested");switch (a()) {
                        case "electron":
                            c.a.debug("Screen sharing in Electron");
                            l = {};l.video = b.video || {};l.video.mandatory = b.video.mandatory || {};l.video.mandatory.chromeMediaSource = "screen";e(l, d, g);
                            break;case "mozilla":
                            c.a.debug("Screen sharing in Firefox");l = {};void 0 !== b.video ? (l.video = b.video, l.video.mediaSource = "window") : l = {
                                audio: b.audio,
                                video: {
                                    mediaSource: "window"
                                }
                            };e(l, d, g);
                            break;case "chrome-stable":
                            c.a.debug("Screen sharing in Chrome");l = {};
                            if (b.desktopStreamId) l.video = b.video || {
                                    mandatory: {}
                                }, l.video.mandatory = l.video.mandatory || {}, l.video.mandatory.chromeMediaSource = "desktop", l.video.mandatory.chromeMediaSourceId = b.desktopStreamId, e(l, d, g);
                            else {
                                var f = "okeephmleflklcdebijnponpabbmmgeo";
                                b.extensionId && (c.a.debug("extensionId supplied, using " + b.extensionId), f = b.extensionId);c.a.debug("Screen access on chrome stable, looking for extension");try {
                                    chrome.runtime.sendMessage(f, {
                                        getStream: !0
                                    }, function(f) {
                                        void 0 === f ? (c.a.error("Access to screen denied"), g({
                                            code: "Access to screen denied"
                                        })) : (f = f.streamId, void 0 !== b.video.mandatory ? (l.video = b.video, l.video.mandatory.chromeMediaSource = "desktop", l.video.mandatory.chromeMediaSourceId = f) : l = {
                                            video: {
                                                mandatory: {
                                                    chromeMediaSource: "desktop",
                                                    chromeMediaSourceId: f
                                                }
                                            }
                                        }, e(l, d, g))
                                    })
                                } catch ( u ) {
                                    c.a.debug("Screensharing plugin is not accessible "), g({
                                        code: "no_plugin_present"
                                    })
                                }
                            }
                            break;default:
                            c.a.error("This browser does not support ScreenSharing")
                        }
                    };
                b.screen ? q() : "undefined" !== typeof k && k.exports ? c.a.error("Video/audio streams not supported in erizofc yet") : (c.a.debug("Calling getUserMedia with config", b), e(b, d, g))
            },
            buildConnection: function(b) {
                var q = {};
                g += 1;
                b.sessionId = g;
                q.browser = a();
                if ("fake" === q.browser) c.a.warning("Publish/subscribe video/audio streams not supported in erizofc yet"), q = Object(d.a)(b);
                else if ("mozilla" === q.browser) c.a.debug("Firefox Stack"), q = Object(e.a)(b);
                else if ("safari" === q.browser) c.a.debug("Safari using Firefox Stack"), q = Object(e.a)(b);
                else if ("chrome-stable" === q.browser || "electron" === q.browser) c.a.debug("Chrome Stable Stack"), q = Object(h.a)(b);else
                    throw c.a.error("No stack available for this browser"), Error("WebRTC stack not available");
                q.updateSpec || (q.updateSpec = function(a, b) {
                    b = void 0 === b ? function() {} : b;c.a.error("Update Configuration not implemented in this browser");b("unimplemented")
                });return q
            },
            getBrowser: a
        }
    }).call(r, n(11)(p))
}, function(p, r, n) {
    var k = n(5),
        h = n(0);
    r.a = function(e) {
        var d = {},
            c,
            g;
        h.a.info("Starting Base stack", e);
        d.pcConfig = {
            iceServers: []
        };
        d.con = {};void 0 !== e.iceServers && (d.pcConfig.iceServers = e.iceServers);void 0 === e.audio && (e.audio = !0);void 0 === e.video && (e.video = !0);
        e.remoteCandidates = [];
        e.localCandidates = [];
        e.remoteDescriptionSet = !1;
        d.mediaConstraints = {
            offerToReceiveVideo: void 0 !== e.video,
            offerToReceiveAudio: void 0 !== e.audio
        };
        d.peerConnection = new RTCPeerConnection(d.pcConfig, d.con);
        var a = function(a, f, b) {
                h.a.error("message:", b, "in baseStack at", a);void 0 !== f && f("error")
            },
            b = function(a) {
                h.a.info("Success in BaseStack", a)
            },
            q = function(a, f) {
                c = f;a || (c.sdp = d.enableSimulcast(c.sdp));
                c.sdp = k.a.setMaxBW(c.sdp, e);e.callback({
                    type: c.type,
                    sdp: c.sdp
                })
            },
            m = function(g) {
                c = g;
                c.sdp = k.a.setMaxBW(c.sdp, e);e.callback({
                    type: c.type,
                    sdp: c.sdp
                });h.a.info("Setting local description p2p",
                    c);d.peerConnection.setLocalDescription(c).then(b).catch(a)
            },
            l = function(b) {
                b.sdp = k.a.setMaxBW(b.sdp, e);d.peerConnection.setRemoteDescription(b).then(function() {
                    d.peerConnection.createAnswer(d.mediaConstraints).then(m).catch(a.bind(null, "createAnswer p2p", void 0));
                    e.remoteDescriptionSet = !0
                }).catch(a.bind(null, "process Offer", void 0))
            },
            v = function(b) {
                h.a.info("Set remote and local description");h.a.debug("Remote Description", b.sdp);h.a.debug("Local Description", c.sdp);
                b.sdp = k.a.setMaxBW(b.sdp, e);
                g = b;
                d.peerConnection.setLocalDescription(c).then(function() {
                    d.peerConnection.setRemoteDescription(new RTCSessionDescription(b)).then(function() {
                        e.remoteDescriptionSet = !0;
                        for (h.a.info("Candidates to be added: ", e.remoteCandidates.length, e.remoteCandidates); 0 < e.remoteCandidates.length;) d.peerConnection.addIceCandidate(e.remoteCandidates.shift());
                        for (h.a.info("Local candidates to send:", e.localCandidates.length); 0 < e.localCandidates.length;) e.callback({
                                type: "candidate",
                                candidate: e.localCandidates.shift()
                            })
                    }).catch(a.bind(null,
                        "processAnswer", void 0))
                }).catch(a.bind(null, "processAnswer", void 0))
            };
        d.peerConnection.onicecandidate = function(a) {
            (a = a.candidate) ? (a.candidate.match(/a=/) || (a.candidate = "a\x3d" + a.candidate), a = {
                sdpMLineIndex: a.sdpMLineIndex,
                sdpMid: a.sdpMid,
                candidate: a.candidate
            }) : (h.a.info("Gathered all candidates. Sending END candidate"), a = {
                sdpMLineIndex: -1,
                sdpMid: "end",
                candidate: "end"
            });
            e.remoteDescriptionSet ? e.callback({
                type: "candidate",
                candidate: a
            }) : (e.localCandidates.push(a), h.a.info("Storing candidate: ", e.localCandidates.length,
                a))
        };
        d.peerConnection.onaddstream = function(a) {
            if (d.onaddstream) d.onaddstream(a)
        };
        d.peerConnection.onremovestream = function(a) {
            if (d.onremovestream) d.onremovestream(a)
        };
        d.peerConnection.oniceconnectionstatechange = function(a) {
            if (d.oniceconnectionstatechange) d.oniceconnectionstatechange(a.target.iceConnectionState)
        };
        d.enableSimulcast = function(a) {
            h.a.error("Simulcast not implemented");return a
        };
        d.close = function() {
            d.state = "closed";d.peerConnection.close()
        };
        d.updateSpec = function(b, f) {
            f = void 0 === f ? function() {} :
                f;
            if (b.maxVideoBW || b.maxAudioBW) b.maxVideoBW && (h.a.debug("Maxvideo Requested:", b.maxVideoBW, "limit:", e.limitMaxVideoBW), b.maxVideoBW > e.limitMaxVideoBW && (b.maxVideoBW = e.limitMaxVideoBW), e.maxVideoBW = b.maxVideoBW, h.a.debug("Result", e.maxVideoBW)), b.maxAudioBW && (b.maxAudioBW > e.limitMaxAudioBW && (b.maxAudioBW = e.limitMaxAudioBW), e.maxAudioBW = b.maxAudioBW), c.sdp = k.a.setMaxBW(c.sdp, e), b.Sdp || b.maxAudioBW ? (h.a.debug("Updating with SDP renegotiation", e.maxVideoBW, e.maxAudioBW), d.peerConnection.setLocalDescription(c).then(function() {
                    g.sdp = k.a.setMaxBW(g.sdp, e);d.peerConnection.setRemoteDescription(new RTCSessionDescription(g)).then(function() {
                        e.remoteDescriptionSet = !0;e.callback({
                            type: "updatestream",
                            sdp: c.sdp
                        })
                    }).catch(a.bind(null, "updateSpec", void 0))
                }).catch(a.bind(null, "updateSpec", f))) : (h.a.debug("Updating without SDP renegotiation, newVideoBW:", e.maxVideoBW, "newAudioBW:", e.maxAudioBW), e.callback({
                    type: "updatestream",
                    sdp: c.sdp
                }));
            if (b.minVideoBW || void 0 !== b.slideShowMode || void 0 !== b.muteStream || void 0 !== b.qualityLayer) h.a.debug("MinVideo Changed to ",
                    b.minVideoBW), h.a.debug("SlideShowMode Changed to ", b.slideShowMode), h.a.debug("muteStream changed to ", b.muteStream), e.callback({
                    type: "updatestream",
                    config: b
                })
        };
        d.createOffer = function(b) {
            !0 !== b && (d.mediaConstraints = {
                offerToReceiveVideo: !1,
                offerToReceiveAudio: !1
            });h.a.debug("Creating offer", d.mediaConstraints);d.peerConnection.createOffer(d.mediaConstraints).then(q.bind(null, b)).catch(a.bind(null, "Create Offer", void 0))
        };
        d.addStream = function(a) {
            d.peerConnection.addStream(a)
        };
        d.processSignalingMessage = function(a) {
            if ("offer" === a.type) l(a);
            else if ("answer" === a.type) v(a);
            else if ("candidate" === a.type) try {
                    var f = "object" === typeof a.candidate ? a.candidate : JSON.parse(a.candidate);
                    if ("end" !== f.candidate) {
                        f.candidate = f.candidate.replace(/a=/g, "");
                        f.sdpMLineIndex = parseInt(f.sdpMLineIndex, 10);
                        var b = new RTCIceCandidate(f);
                        e.remoteDescriptionSet ? d.peerConnection.addIceCandidate(b) : e.remoteCandidates.push(b)
                    }
                } catch ( w ) {
                    h.a.error("Error parsing candidate", a.candidate)
            }
        };return d
    }
}, function(p, r, n) {
    r.a = {
        addSim: function(k) {
            var h = "a\x3dssrc-group:SIM";
            k.forEach(function(e) {
                h += " " + e
            });return h + "\r\n"
        },
        addGroup: function(k, h) {
            return "a\x3dssrc-group:FID " + k + " " + h + "\r\n"
        },
        addSpatialLayer: function(k, h, e, d, c, g) {
            return "a\x3dssrc:" + c + " cname:" + k + "\r\n" + ("a\x3dssrc:" + c + " msid:" + h + "\r\n") + ("a\x3dssrc:" + c + " mslabel:" + e + "\r\n") + ("a\x3dssrc:" + c + " label:" + d + "\r\n") + ("a\x3dssrc:" + g + " cname:" + k + "\r\n") + ("a\x3dssrc:" + g + " msid:" + h + "\r\n") + ("a\x3dssrc:" + g + " mslabel:" + e + "\r\n") + ("a\x3dssrc:" + g + " label:" + d + "\r\n")
        },
        setMaxBW: function(k, h) {
            var e = k;
            if (h.video && h.maxVideoBW) {
                e = e.replace(/b=AS:.*\r\n/g, "");
                var d = e.match(/m=video.*\r\n/);
                null == d && (d = e.match(/m=video.*\n/));d && 0 < d.length && (k = d[0] + "b\x3dAS:" + h.maxVideoBW + "\r\n", e = e.replace(d[0], k))
            }
            h.audio && h.maxAudioBW && (d = e.match(/m=audio.*\r\n/), null == d && (d = e.match(/m=audio.*\n/)), d && 0 < d.length && (k = d[0] + "b\x3dAS:" + h.maxAudioBW + "\r\n", e = e.replace(d[0], k)));return e
        },
        enableOpusNacks: function(k) {
            var h = k.match(/a=rtpmap:(.*)opus.*\r\n/);
            null !== h && (k = k.replace(h[0], h[0] + "a\x3drtcp-fb:" + h[1] + "nack\r\n"));
            return k
        }
    }
}, function(p, r, n) {
    var k = n(1),
        h = n(3),
        e = n(17),
        d = n(19),
        c = n(0);
    r.a = function(g, a) {
        var b = Object(k.a)(a);
        b.stream = a.stream;
        b.url = a.url;
        b.recording = a.recording;
        b.room = void 0;
        b.showing = !1;
        b.local = !1;
        b.video = a.video;
        b.audio = a.audio;
        b.screen = a.screen;
        b.videoSize = a.videoSize;
        b.videoFrameRate = a.videoFrameRate;
        b.extensionId = a.extensionId;
        b.desktopStreamId = a.desktopStreamId;
        b.audioMuted = !1;
        b.videoMuted = !1;
        b.Connection = void 0 === g ? h.a : g;
        if (!(void 0 === b.videoSize || b.videoSize instanceof Array && 4 === b.videoSize.length))
            throw Error("Invalid Video Size");
        if (void 0 === a.local || !0 === a.local)
            b.local = !0;
        b.getID = function() {
            return b.local && !a.streamID ? "local" : a.streamID
        };
        b.getAttributes = function() {
            return a.attributes
        };
        b.setAttributes = function(a) {
            b.local ? b.emit(Object(k.d)({
                type: "internal-set-attributes",
                stream: b,
                attrs: a
            })) : c.a.error("Failed to set attributes data. This Stream object has not been published.")
        };
        b.updateLocalAttributes = function(b) {
            a.attributes = b
        };
        b.hasAudio = function() {
            return a.audio
        };
        b.hasVideo = function() {
            return a.video
        };
        b.hasData = function() {
            return a.data
        };
        b.hasScreen = function() {
            return a.screen
        };
        b.hasMedia = function() {
            return a.audio || a.video || a.screen
        };
        b.isExternal = function() {
            return void 0 !== b.url || void 0 !== b.recording
        };
        b.sendData = function(a) {
            b.local && b.hasData() ? b.emit(Object(k.d)({
                type: "internal-send-data",
                stream: b,
                msg: a
            })) : c.a.error("Failed to send data. This Stream object has not been published.")
        };
        b.init = function() {
            try {
                if ((a.audio || a.video || a.screen) && void 0 === a.url) {
                    c.a.info("Requested access to local media");
                    var d = a.video;
                    !0 === d || !0 === a.screen ?
                        (d = !0 === d ? {} : d, void 0 !== b.videoSize && (d.width = {
                            min: b.videoSize[0],
                            max: b.videoSize[2]
                        }, d.height = {
                            min: b.videoSize[1],
                            max: b.videoSize[3]
                        }), void 0 !== b.videoFrameRate && (d.frameRate = {
                            min: b.videoFrameRate[0],
                            max: b.videoFrameRate[1]
                        })) : !0 === a.screen && void 0 === d && (d = !0);b.Connection.GetUserMedia({
                        video: d,
                        audio: a.audio,
                        fake: a.fake,
                        screen: a.screen,
                        extensionId: b.extensionId,
                        desktopStreamId: b.desktopStreamId
                    }, function(a) {
                        c.a.info("User has granted access to local media.");
                        b.stream = a;b.dispatchEvent(Object(k.d)({
                            type: "access-accepted"
                        }));
                        b.stream.getTracks().forEach(function(a) {
                            c.a.info("getTracks", a);
                            a.onended = function() {
                                b.stream.getTracks().forEach(function(a) {
                                    a.onended = null
                                });
                                var f = Object(k.d)({
                                    type: "stream-ended",
                                    stream: b,
                                    msg: a.kind
                                });
                                b.dispatchEvent(f)
                            }
                        })
                    }, function(a) {
                        c.a.error("Failed to get access to local media. Error code was " + a.code + ".");
                        a = Object(k.d)({
                            type: "access-denied",
                            msg: a
                        });b.dispatchEvent(a)
                    })
                } else {
                    var g = Object(k.d)({
                        type: "access-accepted"
                    });
                    b.dispatchEvent(g)
                }
            } catch ( f ) {
                c.a.error("Failed to get access to local media. Error was " +
                    f + "."), d = Object(k.d)({
                    type: "access-denied",
                    msg: f
                }), b.dispatchEvent(d)
            }
        };
        b.close = function() {
            b.local && (void 0 !== b.room && b.room.unpublish(b), b.hide(), void 0 !== b.stream && b.stream.getTracks().forEach(function(a) {
                a.onended = null;a.stop()
            }), b.stream = void 0)
        };
        b.play = function(a, c) {
            c = c || {};
            b.elementID = a;
            b.hasVideo() || b.hasScreen() ? void 0 !== a && (a = Object(e.a)({
                id: b.getID(),
                stream: b,
                elementID: a,
                options: c
            }), b.player = a, b.showing = !0) : b.hasAudio() && (a = Object(d.a)({
                id: b.getID(),
                stream: b,
                elementID: a,
                options: c
            }), b.player = a, b.showing = !0)
        };
        b.stop = function() {
            b.showing && void 0 !== b.player && (b.player.destroy(), b.showing = !1)
        };
        b.show = b.play;
        b.hide = b.stop;
        var q = function() {
            if (void 0 !== b.player && void 0 !== b.stream) {
                var a = b.player.video,
                    c = document.defaultView.getComputedStyle(a),
                    f = parseInt(c.getPropertyValue("width"), 10),
                    d = parseInt(c.getPropertyValue("height"), 10),
                    w = parseInt(c.getPropertyValue("left"), 10);
                c = parseInt(c.getPropertyValue("top"), 10);
                var g = "object" === typeof b.elementID && "function" === typeof b.elementID.appendChild ?
                    b.elementID : document.getElementById(b.elementID);
                var l = document.defaultView.getComputedStyle(g);
                g = parseInt(l.getPropertyValue("width"), 10);
                l = parseInt(l.getPropertyValue("height"), 10);
                var e = document.createElement("canvas");
                e.id = "testing";
                e.width = g;
                e.height = l;e.setAttribute("style", "display: none");e.getContext("2d").drawImage(a, w, c, f, d);return e
            }
            return null
        };
        b.getVideoFrameURL = function(a) {
            var b = q();
            return null !== b ? a ? b.toDataURL(a) : b.toDataURL() : null
        };
        b.getVideoFrame = function() {
            var a = q();
            return null !==
            a ? a.getContext("2d").getImageData(0, 0, a.width, a.height) : null
        };
        b.checkOptions = function(a, d) {
            if (!0 === d) {
                if (a.video || a.audio || a.screen) c.a.warning("Cannot update type of subscription"), a.video = void 0, a.audio = void 0, a.screen = void 0
            } else !1 === b.local && (!0 === a.video && !1 === b.hasVideo() && (c.a.warning("Trying to subscribe to video when there is no video, won't subscribe to video"), a.video = !1), !0 === a.audio && !1 === b.hasAudio() && (c.a.warning("Trying to subscribe to audio when there is no audio, won't subscribe to audio"),
                a.audio = !1));
            !1 !== b.local || b.hasVideo() || !0 !== a.slideShowMode || (c.a.warning("Cannot enable slideShowMode if it is not a video subscription, please check your parameters"), a.slideShowMode = !1)
        };
        var m = function(a) {
            a = void 0 === a ? function() {} : a;
            if (b.room && b.room.p2p) c.a.warning("muteAudio/muteVideo are not implemented in p2p streams"), a("error");
            else {
                if (b.stream)
                    for (var d = 0; d < b.stream.getVideoTracks().length; d += 1) b.stream.getVideoTracks()[d].enabled = !b.videoMuted;
                d = {
                    muteStream: {
                        audio: b.audioMuted,
                        video: b.videoMuted
                    }
                };
                b.checkOptions(d, !0);b.pc.updateSpec(d, a)
            }
        };
        b.muteAudio = function(a, c) {
            b.audioMuted = a;m(void 0 === c ? function() {} : c)
        };
        b.muteVideo = function(a, c) {
            b.videoMuted = a;m(void 0 === c ? function() {} : c)
        };
        b._setStaticQualityLayer = function(a, d, f) {
            f = void 0 === f ? function() {} : f;
            b.room && b.room.p2p ? (c.a.warning("setStaticQualityLayer is not implemented in p2p streams"), f("error")) : (a = {
                qualityLayer: {
                    spatialLayer: a,
                    temporalLayer: d
                }
            }, b.checkOptions(a, !0), b.pc.updateSpec(a, f))
        };
        b._setDynamicQualityLayer = function(a) {
            if (b.room &&
                    b.room.p2p) c.a.warning("setDynamicQualityLayer is not implemented in p2p streams"), a("error");
            else {
                var d = {
                    qualityLayer: {
                        spatialLayer: -1,
                        temporalLayer: -1
                    }
                };
                b.checkOptions(d, !0);b.pc.updateSpec(d, a)
            }
        };
        var l = function(a, c, f) {
            !0 !== c && (c = !1);
            a = "string" === typeof a ? [a] : a;
            a = a instanceof Array ? a : [];0 < a.length && b.room.sendControlMessage(b, "control", {
                name: "controlhandlers",
                enable: f,
                publisherSide: c,
                handlers: a
            })
        };
        b.disableHandlers = function(a, b) {
            l(a, b, !1)
        };
        b.enableHandlers = function(a, b) {
            l(a, b, !0)
        };
        b.updateConfiguration = function(a, c) {
            c = void 0 === c ? function() {} : c;
            if (void 0 !== a)
                if (b.pc)
                    if (b.checkOptions(a, !0), b.local)
                        if (b.room.p2p)
                            for (var f = 0; f < b.pc.length; f += 1) b.pc[f].updateSpec(a, c);
                        else b.pc.updateSpec(a, c);
                    else b.pc.updateSpec(a, c);
                else c("This stream has no peerConnection attached, ignoring")
        };return b
    }
}, function(p, r, n) {
    var k = n(2),
        h = n(18);
    r.a = function(e) {
        var d = Object(k.a)({}),
            c;
        d.elementID = e.elementID;
        d.id = e.id;
        d.div = document.createElement("div");d.div.setAttribute("id", "bar_" + d.id);d.div.setAttribute("class",
            "licode_bar");
        d.bar = document.createElement("div");d.bar.setAttribute("style", "width: 100%; height: 15%; max-height: 30px; position: absolute; bottom: 0; right: 0; background-color: rgba(255,255,255,0.62)");d.bar.setAttribute("id", "subbar_" + d.id);d.bar.setAttribute("class", "licode_subbar");
        d.link = document.createElement("a");d.link.setAttribute("href", "http://www.lynckia.com/");d.link.setAttribute("class", "licode_link");d.link.setAttribute("target", "_blank");
        d.logo = document.createElement("img");d.logo.setAttribute("style",
            "width: 100%; height: 100%; max-width: 30px; position: absolute; top: 0; left: 2px;");d.logo.setAttribute("class", "licode_logo");d.logo.setAttribute("alt", "Lynckia");d.logo.setAttribute("src", d.url + "/assets/star.svg");
        var g = function(a) {
            var b = a;
            "block" !== a ? b = "none" : clearTimeout(c);d.div.setAttribute("style", "width: 100%; height: 100%; position: relative; bottom: 0; right: 0; display: " + b)
        };
        d.display = function() {
            g("block")
        };
        d.hide = function() {
            c = setTimeout(g, 1E3)
        };document.getElementById(d.elementID).appendChild(d.div);
        d.div.appendChild(d.bar);d.bar.appendChild(d.link);d.link.appendChild(d.logo);e.stream.screen || void 0 !== e.options && void 0 !== e.options.speaker && !0 !== e.options.speaker || (d.speaker = Object(h.a)({
            elementID: "subbar_" + d.id,
            id: d.id,
            stream: e.stream,
            media: e.media
        }));d.display();d.hide();return d
    }
}, function(p, r) {
    r = function() {
        return this
    }();try {
        r = r || Function("return this")() || (0, eval)("this")
    } catch ( n ) {
        "object" === typeof window && (r = window)
    }
    p.exports = r
}, function(p, r, n) {
    Object.defineProperty(r, "__esModule", {
        value: !0
    });
    p = n(10);
    var k = n(1),
        h = n(6),
        e = n(0);
    n(22);n(24);
    n = {
        Room: p.a.bind(null, void 0, void 0),
        LicodeEvent: k.b,
        RoomEvent: k.c,
        StreamEvent: k.d,
        Stream: h.a.bind(null, void 0),
        Logger: e.a
    };
    r["default"] = n
}, function(p, r, n) {
    var k = n(3),
        h = n(1),
        e = n(15),
        d = n(6),
        c = n(20),
        g = n(21),
        a = n(0);
    r.a = function(b, q, m) {
        var l = Object(h.a)(m);
        l.remoteStreams = Object(c.a)();
        l.localStreams = Object(c.a)();
        l.roomID = "";
        l.state = 0;
        l.p2p = !1;
        l.Connection = void 0 === q ? k.a : q;
        var v = Object(e.a)(b),
            t = l.remoteStreams,
            f = l.localStreams,
            u = function(a) {
                a.stream && (a.hide(),
                a.stop(), a.close(),
                delete a.stream
                );a.pc && (a.local && l.p2p ? a.pc.forEach(function(b, f) {
                    b.close();a.pc.remove(f)
                }) : (a.pc.close(),
                delete a.pc
                ))
            },
            w = function(a, b) {
                0 !== l.state && a && !a.failed && (a.failed = !0, b = Object(h.d)({
                    type: "stream-failed",
                    msg: b || "Stream failed after connection",
                    stream: a
                }), l.dispatchEvent(b), a.local ? l.unpublish(a) : l.unsubscribe(a))
            },
            x = function(b, f) {
                a.a.info("Stream subscribed");
                b.stream = f.stream;
                b = Object(h.d)({
                    type: "stream-subscribed",
                    stream: b
                });l.dispatchEvent(b)
            },
            y = function(a, b) {
                return {
                    callback: function(f) {
                        v.sendSDP("signaling_message",
                            {
                                streamId: a.getID(),
                                peerSocket: b,
                                msg: f
                            })
                    },
                    audio: a.hasAudio(),
                    video: a.hasVideo(),
                    iceServers: l.iceServers,
                    maxAudioBW: a.maxAudioBW,
                    maxVideoBW: a.maxVideoBW,
                    limitMaxAudioBW: m.maxAudioBW,
                    limitMaxVideoBW: m.maxVideoBW
                }
            },
            z = function(a, b) {
                a.pc = Object(k.a)(y(a, b));
                a.pc.onaddstream = x.bind(null, a);
                a.pc.oniceconnectionstatechange = function(b) {
                    "failed" === b && w(a)
                }
            },
            C = function(a, b) {
                void 0 === a.pc && (a.pc = Object(c.a)());
                var f = l.Connection.buildConnection(y(a, b));
                a.pc.add(b, f);
                f.oniceconnectionstatechange = function(f) {
                    "failed" ===
                    f && (a.pc.get(b).close(), a.pc.remove(b))
                };f.addStream(a.stream);f.createOffer()
            },
            B = function(b, f, c) {
                var d = {
                    callback: function(f) {
                        a.a.info("Sending message", f);v.sendSDP("signaling_message", {
                            streamId: b.getID(),
                            msg: f,
                            browser: b.pc.browser
                        }, void 0, function() {})
                    },
                    nop2p: !0,
                    audio: b.hasAudio(),
                    video: b.hasVideo(),
                    maxAudioBW: f.maxAudioBW,
                    maxVideoBW: f.maxVideoBW,
                    limitMaxAudioBW: m.maxAudioBW,
                    limitMaxVideoBW: m.maxVideoBW,
                    iceServers: l.iceServers
                };
                c ? (d.audio = d.audio && b.hasAudio(), d.video = d.video && b.hasVideo()) : d.simulcast = f.simulcast;return d
            },
            A = function(a, b) {
                a.pc = l.Connection.buildConnection(B(a, b, !0));
                a.pc.onaddstream = x.bind(null, a);
                a.pc.oniceconnectionstatechange = function(b) {
                    "failed" === b && w(a)
                };a.pc.createOffer(!0)
            },
            n = function(a, b) {
                a.pc = l.Connection.buildConnection(B(a, b));a.pc.addStream(a.stream);
                a.pc.oniceconnectionstatechange = function(b) {
                    "failed" === b && w(a)
                };b.createOffer || a.pc.createOffer()
            },
            D = function(b) {
                var f = b.stream;
                b = b.msg;
                f.local ? v.sendMessage("sendDataStream", {
                    id: f.getID(),
                    msg: b
                }) : a.a.error("You can not send data through a remote stream")
            },
            p = function(b) {
                var f = b.stream;
                b = b.attrs;
                f.local ? (f.updateLocalAttributes(b), v.sendMessage("updateStreamAttributes", {
                    id: f.getID(),
                    attrs: b
                })) : a.a.error("You can not update attributes in a remote stream")
            };
        b = function(a, b) {
            b.args ? a.apply(null, [].concat($jscomp.arrayFromIterable(b.args))) : a()
        };
        var r = function(a, b, f) {
                return {
                    state: a,
                    data: b.hasData(),
                    audio: b.hasAudio(),
                    video: b.hasVideo(),
                    screen: b.hasScreen(),
                    attributes: b.getAttributes(),
                    metadata: f.metadata,
                    createOffer: f.createOffer
                }
            },
            E = function(b, c, d, u) {
                u = void 0 === u ? function() {} : u;
                null === b ? (a.a.error("Error when publishing the stream", d), u(void 0, d)) : (a.a.info("Stream published"), c.getID = function() {
                    return b
                }, c.on("internal-send-data", D), c.on("internal-set-attributes", p), f.add(b, c), c.room = l, u(b))
            },
            I = function(b, f, c) {
                c = void 0 === c ? function() {} : c;
                if (b.url) {
                    var d = "url";
                    var u = b.url
                } else d = "recording", u = b.recording;
                a.a.info("Checking publish options for", b.getID());b.checkOptions(f);v.sendSDP("publish", r(d, b, f), u, function(a, f) {
                    E(a, b, f, c)
                })
            },
            G = function(a, b,
                f) {
                f = void 0 === f ? function() {} : f;
                a.maxAudioBW = b.maxAudioBW;
                a.maxVideoBW = b.maxVideoBW;v.sendSDP("publish", r("p2p", a, b), void 0, function(b, c) {
                    E(b, a, c, f)
                })
            },
            J = function(a, b, f) {
                f = void 0 === f ? function() {} : f;v.sendSDP("publish", r("data", a, b), void 0, function(b, c) {
                    E(b, a, c, f)
                })
            },
            K = function(b, f, c) {
                c = void 0 === c ? function() {} : c;a.a.info("Publishing to Erizo Normally, is createOffer", f.createOffer);
                var d = r("erizo", b, f);
                d.minVideoBW = f.minVideoBW;
                d.scheme = f.scheme;v.sendSDP("publish", d, void 0, function(a, d) {
                    E(a, b, d, void 0);
                    n(b, f);c(a)
                })
            },
            M = function(b, f, c) {
                c = void 0 === c ? function() {} : c;
                f.maxVideoBW = f.maxVideoBW || m.defaultVideoBW;f.maxVideoBW > m.maxVideoBW && (f.maxVideoBW = m.maxVideoBW);a.a.info("Checking subscribe options for", b.getID());b.checkOptions(f);
                var d = {
                    streamId: b.getID(),
                    audio: f.audio && b.hasAudio(),
                    video: f.video && b.hasVideo(),
                    data: f.data && b.hasData(),
                    browser: l.Connection.getBrowser(),
                    createOffer: f.createOffer,
                    metadata: f.metadata,
                    slideShowMode: f.slideShowMode
                };
                v.sendSDP("subscribe", d, void 0, function(d, u) {
                    null ===
                    d ? (a.a.error("Error subscribing to stream ", u), c(void 0, u)) : (a.a.info("Subscriber added"), A(b, f), c(!0))
                })
            },
            N = function(b, f, c) {
                c = void 0 === c ? function() {} : c;v.sendSDP("subscribe", {
                    streamId: b.getID(),
                    data: f.data,
                    metadata: f.metadata
                }, void 0, function(f, d) {
                    null === f ? (a.a.error("Error subscribing to stream ", d), c(void 0, d)) : (a.a.info("Stream subscribed"), f = Object(h.d)({
                        type: "stream-subscribed",
                        stream: b
                    }), l.dispatchEvent(f), c(!0))
                })
            };
        l.connect = function() {
            var b = g.a.decodeBase64(m.token);
            0 !== l.state && a.a.warning("Room already connected");
            l.state = 1;v.connect(JSON.parse(b), function(b) {
                var f = [],
                    c = b.streams || [],
                    u = b.id;
                l.p2p = b.p2p;
                l.iceServers = b.iceServers;
                l.state = 2;
                m.defaultVideoBW = b.defaultVideoBW;
                m.maxVideoBW = b.maxVideoBW;
                for (var w = Object.keys(c), g = 0; g < w.length; g += 1) {
                    var e = c[w[g]];
                    b = Object(d.a)(l.Connection, {
                        streamID: e.id,
                        local: !1,
                        audio: e.audio,
                        video: e.video,
                        data: e.data,
                        screen: e.screen,
                        attributes: e.attributes
                    });f.push(b);t.add(e.id, b)
                }
                l.roomID = u;a.a.info("Connected to room " + l.roomID);
                f = Object(h.c)({
                    type: "room-connected",
                    streams: f
                });
                l.dispatchEvent(f)
            }, function(b) {
                a.a.error("Not Connected! Error: " + b);
                b = Object(h.c)({
                    type: "room-error",
                    message: b
                });l.dispatchEvent(b)
            })
        };
        l.disconnect = function() {
            a.a.debug("Disconnection requested");
            var b = Object(h.c)({
                type: "room-disconnected",
                message: "expected-disconnection"
            });
            l.dispatchEvent(b)
        };
        l.publish = function(b, c, d) {
            c = void 0 === c ? {} : c;
            d = void 0 === d ? function() {} : d;
            c.maxVideoBW = c.maxVideoBW || m.defaultVideoBW;c.maxVideoBW > m.maxVideoBW && (c.maxVideoBW = m.maxVideoBW);void 0 === c.minVideoBW && (c.minVideoBW = 0);c.minVideoBW > m.defaultVideoBW && (c.minVideoBW = m.defaultVideoBW);
            c.simulcast = c.simulcast || !1;
            b && b.local && !b.failed && !f.has(b.getID()) ? b.hasMedia() ? b.isExternal() ? I(b, c, d) : l.p2p ? G(b, c, d) : K(b, c, d) : b.hasData() && J(b, c, d) : (a.a.error("Trying to publish invalid stream"), d(void 0, "Invalid Stream"))
        };
        l.startRecording = function(b, f) {
            f = void 0 === f ? function() {} : f;
            void 0 === b ? (a.a.error("Trying to start recording on an invalid stream", b), f(void 0, "Invalid Stream")) : (a.a.debug("Start Recording stream: " + b.getID()),
            v.sendMessage("startRecorder", {
                to: b.getID()
            }, function(b, c) {
                null === b ? (a.a.error("Error on start recording", c), f(void 0, c)) : (a.a.info("Start recording", b), f(b))
            }))
        };
        l.stopRecording = function(b, f) {
            f = void 0 === f ? function() {} : f;v.sendMessage("stopRecorder", {
                id: b
            }, function(c, d) {
                null === c ? (a.a.error("Error on stop recording", d), f(void 0, d)) : (a.a.info("Stop recording", b), f(!0))
            })
        };
        l.unpublish = function(b, c) {
            c = void 0 === c ? function() {} : c;
            b && b.local ? (v.sendMessage("unpublish", b.getID(), function(f, d) {
                null === f ? (a.a.error("Error unpublishing stream",
                    d), c(void 0, d)) : (
                    delete b.failed
                    , a.a.info("Stream unpublished"), c(!0))
            }), b.room = void 0, b.hasMedia() && !b.isExternal() && u(b), f.remove(b.getID()), b.getID = function() {}, b.off("internal-send-data", D), b.off("internal-set-attributes", p)) : (a.a.error("Cannot unpublish, stream does not exist or is not local"), c(void 0, "Cannot unpublish, stream does not exist or is not local"))
        };
        l.sendControlMessage = function(a, b, f) {
            a && a.getID() && (b = {
                type: "control",
                action: f
            }, v.sendSDP("signaling_message", {
                streamId: a.getID(),
                msg: b
            }))
        };
        l.subscribe = function(b, f, c) {
            f = void 0 === f ? {} : f;
            c = void 0 === c ? function() {} : c;
            if (!b || b.local || b.failed) f = "Error on subscribe", b ? b.local ? (a.a.warning("Cannot subscribe to local stream, you should subscribe to the remote version of your local stream"), f = "Local copy of stream") : b.failed && (a.a.warning("Cannot subscribe to failed stream."), f = "Failed stream") : (a.a.warning("Cannot subscribe to invalid stream"), f = "Invalid or undefined stream"), c(void 0, f);
            else {
                if (b.hasMedia()) b.hasVideo() || b.hasScreen() || (f.video = !1), b.hasAudio() || (f.audio = !1), l.p2p ? (v.sendSDP("subscribe", {
                        streamId: b.getID(),
                        metadata: f.metadata
                    }), c(!0)) : M(b, f, c);
                else if (b.hasData() && !1 !== f.data) N(b, f, c);
                else {
                    a.a.warning("There's nothing to subscribe to");c(void 0, "Nothing to subscribe to");return
                }
                a.a.info("Subscribing to: " + b.getID())
            }
        };
        l.unsubscribe = function(b, f) {
            f = void 0 === f ? function() {} : f;void 0 !== v && b && !b.local && v.sendMessage("unsubscribe", b.getID(), function(a, c) {
                null === a ? f(void 0, c) : (u(b),
                delete b.failed
                , f(!0))
            }, function() {
                a.a.error("Error calling unsubscribe.")
            })
        };
        l.getStreamStats = function(a, b) {
            b = void 0 === b ? function() {} : b;
            if (!v) return "Error getting stats - no socket";
            if (!a) return "Error getting stats - no stream";
            v.sendMessage("getStreamStats", a.getID(), function(a) {
                a && b(a)
            })
        };
        l.getStreamsByAttribute = function(a, b) {
            var f = [];
            t.forEach(function(c) {
                void 0 !== c.getAttributes() && c.getAttributes()[a] === b && f.push(c)
            });return f
        };l.on("room-disconnected", function() {
            l.state = 0;t.forEach(function(a, b) {
                u(a);t.remove(b);a && !a.failed && (a = Object(h.d)({
                    type: "stream-removed",
                    stream: a
                }),
                l.dispatchEvent(a))
            });
            t = Object(c.a)();f.forEach(function(a, b) {
                u(a);f.remove(b)
            });
            f = Object(c.a)();try {
                v.disconnect()
            } catch ( O ) {
                a.a.debug("Socket already disconnected")
            }
            v = void 0
        });v.on("onAddStream", b.bind(null, function(a) {
            var b = Object(d.a)(l.Connection, {
                streamID: a.id,
                local: !1,
                audio: a.audio,
                video: a.video,
                data: a.data,
                screen: a.screen,
                attributes: a.attributes
            });
            b.room = l;t.add(a.id, b);
            a = Object(h.d)({
                type: "stream-added",
                stream: b
            });l.dispatchEvent(a)
        }));v.on("signaling_message_erizo", b.bind(null, function(a) {
            var b;
            (b = a.peerId ? t.get(a.peerId) : f.get(a.streamId)) && !b.failed && b.pc.processSignalingMessage(a.mess)
        }));v.on("signaling_message_peer", b.bind(null, function(a) {
            var b = f.get(a.streamId);
            b && !b.failed ? b.pc.get(a.peerSocket).processSignalingMessage(a.msg) : (b = t.get(a.streamId), b.pc || z(b, a.peerSocket), b.pc.processSignalingMessage(a.msg))
        }));v.on("publish_me", b.bind(null, function(a) {
            var b = f.get(a.streamId);
            C(b, a.peerSocket)
        }));v.on("onBandwidthAlert", b.bind(null, function(b) {
            a.a.info("Bandwidth Alert on", b.streamID,
                "message", b.message, "BW:", b.bandwidth);
            if (b.streamID) {
                var f = t.get(b.streamID);
                f && !f.failed && (b = Object(h.d)({
                    type: "bandwidth-alert",
                    stream: f,
                    msg: b.message,
                    bandwidth: b.bandwidth
                }), f.dispatchEvent(b))
            }
        }));v.on("onDataStream", b.bind(null, function(a) {
            var b = t.get(a.id);
            a = Object(h.d)({
                type: "stream-data",
                msg: a.msg,
                stream: b
            });b.dispatchEvent(a)
        }));v.on("onUpdateAttributeStream", b.bind(null, function(a) {
            var b = t.get(a.id),
                f = Object(h.d)({
                    type: "stream-attributes-update",
                    attrs: a.attrs,
                    stream: b
                });
            b.updateLocalAttributes(a.attrs);
            b.dispatchEvent(f)
        }));v.on("onRemoveStream", b.bind(null, function(a) {
            var b = f.get(a.id);
            b ? w(b) : (b = t.get(a.id), t.remove(a.id), u(b), a = Object(h.d)({
                type: "stream-removed",
                stream: b
            }), l.dispatchEvent(a))
        }));v.on("disconnect", b.bind(null, function() {
            a.a.info("Socket disconnected, lost connection to ErizoController");
            if (0 !== l.state) {
                a.a.error("Unexpected disconnection from ErizoController");
                var b = Object(h.c)({
                    type: "room-disconnected",
                    message: "unexpected-disconnection"
                });
                l.dispatchEvent(b)
            }
        }));v.on("connection_failed",
            b.bind(null, function(b) {
                if (b.streamId) {
                    var c = "ICE Connection Failed on " + b.type + " " + b.streamId + " " + l.state;
                    a.a.error(c);
                    b = "publish" === b.type ? f.get(b.streamId) : t.get(b.streamId);w(b, c)
                }
            }));v.on("error", b.bind(null, function(b) {
            a.a.error("Cannot connect to erizo Controller");
            b = Object(h.c)({
                type: "room-error",
                message: b
            });l.dispatchEvent(b)
        }));return l
    }
}, function(p, r) {
    p.exports = function(n) {
        if (!n.webpackPolyfill) {
            var k = Object.create(n);
            k.children || (k.children = []);Object.defineProperty(k, "loaded", {
                enumerable: !0,
                get: function() {
                    return k.l
                }
            });Object.defineProperty(k, "id", {
                enumerable: !0,
                get: function() {
                    return k.i
                }
            });Object.defineProperty(k, "exports", {
                enumerable: !0
            });
            k.webpackPolyfill = 1
        }
        return k
    }
}, function(p, r, n) {
    var k = n(4),
        h = n(5),
        e = n(0);
    r.a = function(d) {
        e.a.info("Starting Chrome stable stack", d);
        var c = Object(k.a)(d);
        c.enableSimulcast = function(c) {
            var a = c;
            if (!d.video || !d.simulcast) return a;
            c = a.match(/a=ssrc-group:FID ([0-9]*) ([0-9]*)\r?\n/);
            if (!c || 0 >= c.length) return a;
            var b = d.simulcast.numSpatialLayers || 2;
            var g = parseInt(c[1], 10),
                e = parseInt(c[2], 10),
                l = a.match(new RegExp("a\x3dssrc:" + c[1] + " cname:(.*)\r?\n"))[1],
                v = a.match(new RegExp("a\x3dssrc:" + c[1] + " msid:(.*)\r?\n"))[1],
                k = a.match(new RegExp("a\x3dssrc:" + c[1] + " mslabel:(.*)\r?\n"))[1],
                f = a.match(new RegExp("a\x3dssrc:" + c[1] + " label:(.*)\r?\n"))[1];
            a.match(new RegExp("a\x3dssrc:" + c[1] + ".*\r?\n", "g")).forEach(function(b) {
                a = a.replace(b, "")
            });a.match(new RegExp("a\x3dssrc:" + c[2] + ".*\r?\n", "g")).forEach(function(b) {
                a = a.replace(b, "")
            });
            for (var u = [g], w = [e], x = 1; x <
                b; x += 1) u.push(g + 1E3 * x), w.push(e + 1E3 * x);
            b = h.a.addSim(u);
            for (x = 0; x < u.length; x += 1) g = u[x], e = w[x], b += h.a.addGroup(g, e);
            for (x = 0; x < u.length; x += 1) g = u[x], e = w[x], b += h.a.addSpatialLayer(l, v, k, f, g, e);
            return a.replace(c[0], b + "a\x3dx-google-flag:conference\r\n")
        };return c
    }
}, function(p, r, n) {
    var k = n(0),
        h = n(4);
    r.a = function(e) {
        k.a.info("Starting Firefox stack");
        var d = Object(h.a)(e);
        d.enableSimulcast = function(c) {
            if (!e.video || !e.simulcast) return c;
            d.peerConnection.getSenders().forEach(function(c) {
                "video" === c.track.kind &&
                (c.getParameters(), c.setParameters({
                    encodings: [{
                        rid: "spam",
                        active: !0,
                        priority: "high",
                        maxBitrate: 4E4,
                        maxHeight: 640,
                        maxWidth: 480
                    }, {
                        rid: "egg",
                        active: !0,
                        priority: "medium",
                        maxBitrate: 1E4,
                        maxHeight: 320,
                        maxWidth: 240
                    }]
                }))
            });return c
        };return d
    }
}, function(p, r, n) {
    var k = n(0);
    r.a = function(h) {
        var e = {
            pcConfig: {},
            peerConnection: {},
            desc: {},
            signalCallback: void 0,
            close: function() {
                k.a.info("Close FcStack")
            },
            createOffer: function() {
                k.a.debug("FCSTACK: CreateOffer")
            },
            addStream: function(d) {
                k.a.debug("FCSTACK: addStream",
                    d)
            },
            processSignalingMessage: function(d) {
                k.a.debug("FCSTACK: processSignaling", d);void 0 !== e.signalCallback && e.signalCallback(d)
            },
            sendSignalingMessage: function(d) {
                k.a.debug("FCSTACK: Sending signaling Message", d);h.callback(d)
            },
            setSignalingCallback: function(d) {
                d = void 0 === d ? function() {} : d;k.a.debug("FCSTACK: Setting signalling callback");
                e.signalCallback = d
            }
        };
        return e
    }
}, function(p, r, n) {
    n.d(r, "a", function() {
        return c
    });
    p = n(16);
    var k = n.n(p),
        h = n(0),
        e = n(1),
        d = function(c, a) {
            c = Object(e.b)({
                type: c
            });
            c.args = a.args;
            return c
        },
        c = function(c) {
            var a = Object(e.a)(),
                b = function() {};
            $jscomp.initSymbol();
            a.CONNECTED = Symbol("connected");$jscomp.initSymbol();
            a.DISCONNECTED = Symbol("disconnected");
            a.state = a.DISCONNECTED;
            a.IO = void 0 === c ? k.a : c;
            var g,
                m = function(b, c) {
                    for (var g = [], f = 1; f < arguments.length; ++f) g[f - 1] = arguments[f];
                    a.emit(d(b, {
                        args: g
                    }))
                };
            a.connect = function(c, d, e) {
                d = void 0 === d ? b : d;
                e = void 0 === e ? b : e;
                g = a.IO.connect(c.host, {
                    reconnect: !1,
                    secure: c.secure,
                    forceNew: !0,
                    transports: ["websocket"],
                    rejectUnauthorized: !1
                });g.on("onAddStream",
                    m.bind(a, "onAddStream"));g.on("signaling_message_erizo", m.bind(a, "signaling_message_erizo"));g.on("signaling_message_peer", m.bind(a, "signaling_message_peer"));g.on("publish_me", m.bind(a, "publish_me"));g.on("onBandwidthAlert", m.bind(a, "onBandwidthAlert"));g.on("onDataStream", m.bind(a, "onDataStream"));g.on("onUpdateAttributeStream", m.bind(a, "onUpdateAttributeStream"));g.on("onRemoveStream", m.bind(a, "onRemoveStream"));g.on("disconnect", m.bind(a, "disconnect"));g.on("connection_failed", m.bind(a, "connection_failed"));
                g.on("error", m.bind(a, "error"));a.sendMessage("token", c, function(b) {
                    for (var f = [], c = 0; c < arguments.length; ++c) f[c - 0] = arguments[c];
                    a.state = a.CONNECTED;d.apply(null, [].concat($jscomp.arrayFromIterable(f)))
                }, e)
            };
            a.sendMessage = function(a, c, d, f) {
                d = void 0 === d ? b : d;
                f = void 0 === f ? b : f;g.emit(a, c, function(a, b) {
                    "success" === a ? d(b) : "error" === a ? f(b) : d(a, b)
                })
            };
            a.sendSDP = function(c, d, e, f) {
                f = void 0 === f ? b : f;
                a.state === a.DISCONNECTED ? h.a.warning("Trying to send a message over a disconnected Socket") : g.emit(c, d, e, function(a,
                    b) {
                    f(a, b)
                })
            };return a
    }
}, function(p, r, n) {
    !function(k, h) {
        p.exports = h()
    }(this, function() {
        return function(k) {
            function h(d) {
                if (e[d]) return e[d].exports;
                var c = e[d] = {
                    exports: {},
                    id: d,
                    loaded: !1
                };
                return k[d].call(c.exports, c, c.exports, h), c.loaded = !0, c.exports
            }
            var e = {};
            return h.m = k, h.c = e, h.p = "", h(0)
        }([function(k, h, e) {
            function d(a, d) {
                "object" === ("undefined" == typeof a ? "undefined" : c(a)) && (d = a, a = void 0);
                d = d || {};var e;
                a = g(a);var f = a.source,
                    u = a.id,
                    w = a.path;
                w = m[u] && w in m[u].nsps;return d.forceNew || d["force new connection"] ||
                    !1 === d.multiplex || w ? (q("ignoring socket cache for %s", f), e = b(f, d)) : (m[u] || (q("new io instance for %s", f), m[u] = b(f, d)), e = m[u]), a.query && !d.query && (d.query = a.query), e.socket(a.path, d)
            }
            $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbolIterator();
            var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
                    return typeof a
                } : function(a) {
                    $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ?
                        "symbol" : typeof a
                },
                g = e(1),
                a = e(7),
                b = e(13),
                q = e(3)("socket.io-client");
            k.exports = h = d;
            var m = h.managers = {};
            h.protocol = a.protocol;
            h.connect = d;
            h.Manager = e(13);
            h.Socket = e(39)
        }, function(k, h, e) {
            (function(d) {
                var c = e(2),
                    g = e(3)("socket.io-client:url");
                k.exports = function(a, b) {
                    var e = a;
                    b = b || d.location;null == a && (a = b.protocol + "//" + b.host);"string" == typeof a && ("/" === a.charAt(0) && (a = "/" === a.charAt(1) ? b.protocol + a : b.host + a), /^(https?|wss?):\/\//.test(a) || (g("protocol-less url %s", a), a = "undefined" != typeof b ? b.protocol +
                    "//" + a : "https://" + a), g("parse %s", a), e = c(a));e.port || (/^(http|ws)$/.test(e.protocol) ? e.port = "80" : /^(http|ws)s$/.test(e.protocol) && (e.port = "443"));
                    e.path = e.path || "/";
                    a = -1 !== e.host.indexOf(":") ? "[" + e.host + "]" : e.host;return e.id = e.protocol + "://" + a + ":" + e.port, e.href = e.protocol + "://" + a + (b && b.port === e.port ? "" : ":" + e.port), e
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            var e = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                d = "source protocol authority userInfo user password host port relative path directory file query anchor".split(" ");
            k.exports = function(c) {
                var g = c,
                    a = c.indexOf("["),
                    b = c.indexOf("]");
                -1 != a && -1 != b && (c = c.substring(0, a) + c.substring(a, b).replace(/:/g, ";") + c.substring(b, c.length));
                c = e.exec(c || "");
                for (var q = {}, m = 14; m--;) q[d[m]] = c[m] || "";
                return -1 != a && -1 != b && (q.source = g, q.host = q.host.substring(1, q.host.length - 1).replace(/;/g, ":"), q.authority = q.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), q.ipv6uri = !0), q
            }
        }, function(k, h, e) {
            (function(d) {
                function c() {
                    try {
                        var a = h.storage.debug
                    } catch ( q ) {} return !a && "undefined" != typeof d && "env" in d && (a = d.env.DEBUG), a
                }
                h = k.exports = e(5);
                h.log = function() {
                    return "object" == typeof console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                };
                h.formatArgs = function(a) {
                    var b = this.useColors;
                    if (a[0] = (b ? "%c" : "") + this.namespace + (b ? " %c" : " ") + a[0] + (b ? "%c " : " ") + "+" + h.humanize(this.diff), b) {
                        b = "color: " + this.color;a.splice(1, 0, b, "color: inherit");
                        var c = 0,
                            d = 0;
                        a[0].replace(/%[a-zA-Z%]/g, function(a) {
                            "%%" !== a && (c++, "%c" === a && (d = c))
                        });a.splice(d, 0, b)
                    }
                };
                h.save = function(a) {
                    try {
                        null == a ? h.storage.removeItem("debug") : h.storage.debug = a
                    } catch ( q ) {}
                };
                h.load = c;
                h.useColors = function() {
                    return !("undefined" == typeof window || !window.process || "renderer" !== window.process.type) || "undefined" != typeof document && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance || "undefined" != typeof window && window.console && (window.console.firebug || window.console.exception &&
                        window.console.table) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && 31 <= parseInt(RegExp.$1, 10) || "undefined" != typeof navigator && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/)
                };
                var g = h;
                if ("undefined" != typeof chrome && "undefined" != typeof chrome.storage) var a = chrome.storage.local;
                else a:{try {
                        a = window.localStorage;break a
                    } catch ( b ) {}
                    a = void 0}
                g.storage = a;
                h.colors = "lightseagreen forestgreen goldenrod dodgerblue darkorchid crimson".split(" ");
                h.formatters.j = function(a) {
                    try {
                        return JSON.stringify(a)
                    } catch ( q ) {
                        return "[UnexpectedJSONParseError]: " + q.message
                    }
                };h.enable(c())
            }).call(h, e(4))
        }, function(k, h) {
            function e() {
                throw Error("setTimeout has not been defined");
            }
            function d() {
                throw Error("clearTimeout has not been defined");
            }
            function c(a) {
                if (l === setTimeout) return setTimeout(a, 0);
                if ((l === e || !l) && setTimeout) return l = setTimeout, setTimeout(a, 0);
                try {
                    return l(a, 0)
                } catch ( y ) {
                    try {
                        return l.call(null, a, 0)
                    } catch ( z ) {
                        return l.call(this, a, 0)
                    }
                }
            }
            function g(a) {
                if (v ===
                        clearTimeout) return clearTimeout(a);
                if ((v === d || !v) && clearTimeout) return v = clearTimeout, clearTimeout(a);
                try {
                    return v(a)
                } catch ( y ) {
                    try {
                        return v.call(null, a)
                    } catch ( z ) {
                        return v.call(this, a)
                    }
                }
            }
            function a() {
                u && t && (u = !1, t.length ? f = t.concat(f) : w = -1, f.length && b())
            }
            function b() {
                if (!u) {
                    var b = c(a);
                    u = !0;
                    for (var d = f.length; d;) {
                        t = f;
                        for (f = []; ++w < d;) t && t[w].run();
                        w = -1;
                        d = f.length
                    }
                    t = null;
                    u = !1;g(b)
                }
            }
            function q(a, b) {
                this.fun = a;
                this.array = b
            }
            function m() {
            }
            k = k.exports = {};try {
                var l = "function" == typeof setTimeout ? setTimeout :
                    e
            } catch ( x ) {
                l = e
            } try {
                var v = "function" == typeof clearTimeout ? clearTimeout : d
            } catch ( x ) {
                v = d
            }!0;
            var t,
                f = [],
                u = !1,
                w = -1;
            k.nextTick = function(a) {
                var d = Array(arguments.length - 1);
                if (1 < arguments.length)
                    for (var e = 1; e < arguments.length; e++) d[e - 1] = arguments[e];
                f.push(new q(a, d));1 !== f.length || u || c(b)
            };
            q.prototype.run = function() {
                this.fun.apply(null, this.array)
            };
            k.title = "browser";
            k.browser = !0;
            k.env = {};
            k.argv = [];
            k.version = "";
            k.versions = {};
            k.on = m;
            k.addListener = m;
            k.once = m;
            k.off = m;
            k.removeListener = m;
            k.removeAllListeners = m;
            k.emit = m;
            k.prependListener = m;
            k.prependOnceListener = m;
            k.listeners = function(a) {
                return []
            };
            k.binding = function(a) {
                throw Error("process.binding is not supported");
            };
            k.cwd = function() {
                return "/"
            };
            k.chdir = function(a) {
                throw Error("process.chdir is not supported");
            };
            k.umask = function() {
                return 0
            }
        }, function(k, h, e) {
            function d(a) {
                var b,
                    c = 0;
                for (b in a) c = (c << 5) - c + a.charCodeAt(b), c |= 0;
                return h.colors[Math.abs(c) % h.colors.length]
            }
            function c(a) {
                function b() {
                    if (b.enabled) {
                        var a = +new Date;
                        b.diff = a - (g || a);
                        b.prev = g;
                        g = b.curr = a;
                        var c = Array(arguments.length);
                        for (a = 0; a < c.length; a++) c[a] = arguments[a];
                        c[0] = h.coerce(c[0]);"string" != typeof c[0] && c.unshift("%O");
                        var d = 0;
                        c[0] = c[0].replace(/%([a-zA-Z%])/g, function(a, e) {
                            if ("%%" === a) return a;
                            d++;
                            e = h.formatters[e];"function" == typeof e && (a = e.call(b, c[d]), c.splice(d, 1), d--);return a
                        });h.formatArgs.call(b, c);(b.log || h.log || console.log.bind(console)).apply(b, c)
                    }
                }
                return b.namespace = a, b.enabled = h.enabled(a), b.useColors = h.useColors(), b.color = d(a), "function" == typeof h.init && h.init(b), b
            }
            h = k.exports = c.debug = c["default"] = c;
            h.coerce = function(a) {
                return a instanceof Error ? a.stack || a.message : a
            };
            h.disable = function() {
                h.enable("")
            };
            h.enable = function(a) {
                h.save(a);
                h.names = [];
                h.skips = [];
                for (var b = ("string" == typeof a ? a : "").split(/[\s,]+/), c = b.length, d = 0; d < c; d++) b[d] && (a = b[d].replace(/\*/g, ".*?"), "-" === a[0] ? h.skips.push(new RegExp("^" + a.substr(1) + "$")) : h.names.push(new RegExp("^" + a + "$")))
            };
            h.enabled = function(a) {
                var b;
                var c = 0;
                for (b = h.skips.length; c < b; c++)
                    if (h.skips[c].test(a)) return !1;
                c = 0;
                for (b = h.names.length; c < b; c++)
                    if (h.names[c].test(a)) return !0;
                return !1
            };
            h.humanize = e(6);
            h.names = [];
            h.skips = [];
            h.formatters = {};
            var g
        }, function(k, h) {
            function e(d) {
                if (d = String(d), !(100 < d.length))
                    if (d = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(d)) {
                        var e = parseFloat(d[1]);
                        switch ((d[2] || "ms").toLowerCase()) {
                        case "years":
                        case "year":
                        case "yrs":
                        case "yr":
                        case "y":
                            return e * q;case "days":
                        case "day":
                        case "d":
                            return e * b;case "hours":
                        case "hour":
                        case "hrs":
                        case "hr":
                        case "h":
                            return e *
                                a;case "minutes":
                        case "minute":
                        case "mins":
                        case "min":
                        case "m":
                            return e * g;case "seconds":
                        case "second":
                        case "secs":
                        case "sec":
                        case "s":
                            return e * c;case "milliseconds":
                        case "millisecond":
                        case "msecs":
                        case "msec":
                        case "ms":
                            return e
                        }
                }
            }
            function d(a, b, c) {
                if (!(a < b)) return a < 1.5 * b ? Math.floor(a / b) + " " + c : Math.ceil(a / b) + " " + c + "s"
            }
            var c = 1E3,
                g = 60 * c,
                a = 60 * g,
                b = 24 * a,
                q = 365.25 * b;
            k.exports = function(m, l) {
                l = l || {};
                var q = typeof m;
                if ("string" === q && 0 < m.length) return e(m);
                if ("number" === q && !1 === isNaN(m)) return l["long"] ? d(m,
                        b, "day") || d(m, a, "hour") || d(m, g, "minute") || d(m, c, "second") || m + " ms" : m >= b ? Math.round(m / b) + "d" : m >= a ? Math.round(m / a) + "h" : m >= g ? Math.round(m / g) + "m" : m >= c ? Math.round(m / c) + "s" : m + "ms";
                throw Error("val is not a non-empty string or a valid number. val\x3d" + JSON.stringify(m));
            }
        }, function(k, h, e) {
            function d() {
            }
            function c(a) {
                var b = "" + a.type;
                return h.BINARY_EVENT !== a.type && h.BINARY_ACK !== a.type || (b += a.attachments + "-"), a.nsp && "/" !== a.nsp && (b += a.nsp + ","), null != a.id && (b += a.id), null != a.data && (b += JSON.stringify(a.data)),
                    m("encoded %j as %s", a, b), b
            }
            function g(a, b) {
                v.removeBlobs(a, function(a) {
                    var f = v.deconstructPacket(a);
                    a = c(f.packet);
                    f = f.buffers;f.unshift(a);b(f)
                })
            }
            function a() {
                this.reconstructor = null
            }
            function b(a) {
                this.reconPack = a;
                this.buffers = []
            }
            function q() {
                return {
                    type: h.ERROR,
                    data: "parser error"
                }
            }
            var m = e(3)("socket.io-parser");
            k = e(8);
            var l = e(9),
                v = e(11),
                t = e(12);
            h.protocol = 4;
            h.types = "CONNECT DISCONNECT EVENT ACK ERROR BINARY_EVENT BINARY_ACK".split(" ");
            h.CONNECT = 0;
            h.DISCONNECT = 1;
            h.EVENT = 2;
            h.ACK = 3;
            h.ERROR = 4;
            h.BINARY_EVENT = 5;
            h.BINARY_ACK = 6;
            h.Encoder = d;
            h.Decoder = a;
            d.prototype.encode = function(a, b) {
                (a.type !== h.EVENT && a.type !== h.ACK || !l(a.data) || (a.type = a.type === h.EVENT ? h.BINARY_EVENT : h.BINARY_ACK), m("encoding packet %j", a), h.BINARY_EVENT === a.type || h.BINARY_ACK === a.type) ? g(a, b) : (a = c(a), b([a]))
            };k(a.prototype);
            a.prototype.add = function(a) {
                if ("string" == typeof a) {
                    var c,
                        f = 0,
                        d = {
                            type: Number(a.charAt(0))
                        };
                    if (null == h.types[d.type])
                        a = q();
                    else {
                        if (h.BINARY_EVENT === d.type || h.BINARY_ACK === d.type) {
                            for (c = ""; "-" !== a.charAt(++f) && (c += a.charAt(f),
                                f != a.length);) ;
                            if (c != Number(c) || "-" !== a.charAt(f))
                                throw Error("Illegal attachments");
                            d.attachments = Number(c)
                        }
                        if ("/" === a.charAt(f + 1))
                            for (d.nsp = ""; ++f;) {
                                c = a.charAt(f);
                                if ("," === c) break;
                                if (d.nsp += c, f === a.length) break
                        }
                        else
                            d.nsp = "/";
                        c = a.charAt(f + 1);
                        if ("" !== c && Number(c) == c) {
                            for (d.id = ""; ++f;) {
                                c = a.charAt(f);
                                if (null == c || Number(c) != c) {
                                    --f;break
                                }
                                if (d.id += a.charAt(f), f === a.length) break
                            }
                            d.id = Number(d.id)
                        }
                        if (a.charAt(++f)) {
                            b:{
                            f = a.substr(f);try {
                                d.data = JSON.parse(f)
                            } catch ( y ) {
                                f = q();break b
                            }
                            f = d}
                            d = f
                        }
                        a = (m("decoded %s as %j",
                            a, d), d)
                    }
                    h.BINARY_EVENT === a.type || h.BINARY_ACK === a.type ? (this.reconstructor = new b(a), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", a)) : this.emit("decoded", a)
                } else {
                    if (!t(a) && !a.base64)
                        throw Error("Unknown type: " + a);
                    if (!this.reconstructor)
                        throw Error("got binary data when not reconstructing a packet");
                    (a = this.reconstructor.takeBinaryData(a)) && (this.reconstructor = null, this.emit("decoded", a))
                }
            };
            a.prototype.destroy = function() {
                this.reconstructor && this.reconstructor.finishedReconstruction()
            };
            b.prototype.takeBinaryData = function(a) {
                return (this.buffers.push(a), this.buffers.length === this.reconPack.attachments) ? (a = v.reconstructPacket(this.reconPack, this.buffers), this.finishedReconstruction(), a) : null
            };
            b.prototype.finishedReconstruction = function() {
                this.reconPack = null;
                this.buffers = []
            }
        }, function(k, h, e) {
            function d(c) {
                if (c) {
                    for (var e in d.prototype) c[e] = d.prototype[e];
                    return c
                }
            }
            k.exports = d;
            d.prototype.on = d.prototype.addEventListener = function(c, d) {
                return this._callbacks = this._callbacks || {}, (this._callbacks["$" +
                    c] = this._callbacks["$" + c] || []).push(d), this
            };
            d.prototype.once = function(c, d) {
                function a() {
                    this.off(c, a);d.apply(this, arguments)
                }
                return a.fn = d, this.on(c, a), this
            };
            d.prototype.off = d.prototype.removeListener = d.prototype.removeAllListeners = d.prototype.removeEventListener = function(c, d) {
                if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                var a = this._callbacks["$" + c];
                if (!a) return this;
                if (1 == arguments.length) return delete this._callbacks["$" + c]
                        , this;
                for (var b, e = 0; e < a.length; e++)
                    if (b = a[e], b === d || b.fn === d) {
                        a.splice(e, 1);break
                }
                return this
            };
            d.prototype.emit = function(c) {
                this._callbacks = this._callbacks || {};
                var d = [].slice.call(arguments, 1),
                    a = this._callbacks["$" + c];
                if (a) {
                    a = a.slice(0);
                    for (var b = 0, e = a.length; b < e; ++b) a[b].apply(this, d)
                }
                return this
            };
            d.prototype.listeners = function(c) {
                return this._callbacks = this._callbacks || {}, this._callbacks["$" + c] || []
            };
            d.prototype.hasListeners = function(c) {
                return !!this.listeners(c).length
            }
        }, function(k, h, e) {
            (function(d) {
                function c(a) {
                    if (!a || "object" != typeof a) return !1;
                    if (g(a)) {
                        for (var e = 0, m = a.length; e < m; e++)
                            if (c(a[e])) return !0;
                        return !1
                    }
                    if ("function" == typeof d.Buffer && d.Buffer.isBuffer && d.Buffer.isBuffer(a) || "function" == typeof d.ArrayBuffer && a instanceof ArrayBuffer || b && a instanceof Blob || q && a instanceof File) return !0;
                    if (a.toJSON && "function" == typeof a.toJSON && 1 === arguments.length) return c(a.toJSON(), !0);
                    for (e in a)
                        if (Object.prototype.hasOwnProperty.call(a, e) && c(a[e])) return !0;
                    return !1
                }
                var g = e(10),
                    a = Object.prototype.toString,
                    b = "function" == typeof d.Blob || "[object BlobConstructor]" ===
                        a.call(d.Blob),
                    q = "function" == typeof d.File || "[object FileConstructor]" === a.call(d.File);
                k.exports = c
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            var e = {}.toString;
            k.exports = Array.isArray || function(d) {
                return "[object Array]" == e.call(d)
            }
        }, function(k, h, e) {
            (function(d) {
                function c(d, e) {
                    if (!d) return d;
                    if (b(d)) {
                        var f = {
                            _placeholder: !0,
                            num: e.length
                        };
                        return e.push(d), f
                    }
                    if (a(d)) {
                        f = Array(d.length);
                        for (var u = 0; u < d.length; u++) f[u] = c(d[u], e);
                        return f
                    }
                    if ("object" == typeof d && !(d instanceof Date)) {
                        f = {};
                        for (u in d) f[u] = c(d[u], e);
                        return f
                    }
                    return d
                }
                function g(b, c) {
                    if (!b) return b;
                    if (b && b._placeholder) return c[b.num];
                    if (a(b))
                        for (var f = 0; f < b.length; f++) b[f] = g(b[f], c);
                    else if ("object" == typeof b)
                        for (f in b) b[f] = g(b[f], c);
                    return b
                }
                var a = e(10),
                    b = e(12),
                    q = Object.prototype.toString,
                    m = "function" == typeof d.Blob || "[object BlobConstructor]" === q.call(d.Blob),
                    l = "function" == typeof d.File || "[object FileConstructor]" === q.call(d.File);
                h.deconstructPacket = function(a) {
                    var b = [];
                    return a.data = c(a.data, b), a.attachments = b.length, {
                            packet: a,
                            buffers: b
                    }
                };
                h.reconstructPacket = function(a, b) {
                    return a.data = g(a.data, b), a.attachments = void 0, a
                };
                h.removeBlobs = function(c, d) {
                    function f(c, g, w) {
                        if (!c) return c;
                        if (m && c instanceof Blob || l && c instanceof File) {
                            u++;
                            var q = new FileReader;
                            q.onload = function() {
                                w ? w[g] = this.result : e = this.result;--u || d(e)
                            };q.readAsArrayBuffer(c)
                        } else if (a(c))
                            for (q = 0; q < c.length; q++) f(c[q], q, c);
                        else if ("object" == typeof c && !b(c))
                            for (q in c) f(c[q], q, c)
                    }
                    var u = 0,
                        e = c;
                    f(e);u || d(e)
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            (function(e) {
                k.exports = function(d) {
                    return e.Buffer && e.Buffer.isBuffer(d) || e.ArrayBuffer && d instanceof ArrayBuffer
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            function d(a, f) {
                if (!(this instanceof d)) return new d(a, f);
                a && "object" === ("undefined" == typeof a ? "undefined" : c(a)) && (f = a, a = void 0);
                f = f || {};
                f.path = f.path || "/socket.io";
                this.nsps = {};
                this.subs = [];
                this.opts = f;this.reconnection(!1 !== f.reconnection);this.reconnectionAttempts(f.reconnectionAttempts || 1 / 0);this.reconnectionDelay(f.reconnectionDelay || 1E3);this.reconnectionDelayMax(f.reconnectionDelayMax ||
                    5E3);this.randomizationFactor(f.randomizationFactor || .5);
                this.backoff = new t({
                    min: this.reconnectionDelay(),
                    max: this.reconnectionDelayMax(),
                    jitter: this.randomizationFactor()
                });this.timeout(null == f.timeout ? 2E4 : f.timeout);
                this.readyState = "closed";
                this.uri = a;
                this.connecting = [];
                this.lastPing = null;
                this.encoding = !1;
                this.packetBuffer = [];
                a = f.parser || b;
                this.encoder = new a.Encoder;
                this.decoder = new a.Decoder;(this.autoConnect = !1 !== f.autoConnect) && this.open()
            }
            $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbolIterator();
            var c = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(a) {
                    return typeof a
                } : function(a) {
                    $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
                },
                g = e(14),
                a = e(39);
            h = e(8);
            var b = e(7),
                q = e(41),
                m = e(42),
                l = e(3)("socket.io-client:manager"),
                v = e(37),
                t = e(43),
                f = Object.prototype.hasOwnProperty;
            k.exports = d;
            d.prototype.emitAll = function() {
                this.emit.apply(this, arguments);
                for (var a in this.nsps) f.call(this.nsps,
                        a) && this.nsps[a].emit.apply(this.nsps[a], arguments)
            };
            d.prototype.updateSocketIds = function() {
                for (var a in this.nsps) f.call(this.nsps, a) && (this.nsps[a].id = this.generateId(a))
            };
            d.prototype.generateId = function(a) {
                return ("/" === a ? "" : a + "#") + this.engine.id
            };h(d.prototype);
            d.prototype.reconnection = function(a) {
                return arguments.length ? (this._reconnection = !!a, this) : this._reconnection
            };
            d.prototype.reconnectionAttempts = function(a) {
                return arguments.length ? (this._reconnectionAttempts = a, this) : this._reconnectionAttempts
            };
            d.prototype.reconnectionDelay = function(a) {
                return arguments.length ? (this._reconnectionDelay = a, this.backoff && this.backoff.setMin(a), this) : this._reconnectionDelay
            };
            d.prototype.randomizationFactor = function(a) {
                return arguments.length ? (this._randomizationFactor = a, this.backoff && this.backoff.setJitter(a), this) : this._randomizationFactor
            };
            d.prototype.reconnectionDelayMax = function(a) {
                return arguments.length ? (this._reconnectionDelayMax = a, this.backoff && this.backoff.setMax(a), this) : this._reconnectionDelayMax
            };
            d.prototype.timeout = function(a) {
                return arguments.length ? (this._timeout = a, this) : this._timeout
            };
            d.prototype.maybeReconnectOnOpen = function() {
                !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
            };
            d.prototype.open = d.prototype.connect = function(a, b) {
                if (l("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                l("opening %s", this.uri);
                var c = this.engine = g(this.uri, this.opts),
                    f = this;
                this.readyState = "opening";
                this.skipReconnect = !1;
                var d = q(c, "open", function() {
                    f.onopen();
                    a && a()
                });
                b = q(c, "error", function(b) {
                    if (l("connect_error"), f.cleanup(), f.readyState = "closed", f.emitAll("connect_error", b), a) {
                        var c = Error("Connection error");
                        c.data = b;a(c)
                    } else f.maybeReconnectOnOpen()
                });
                if (!1 !== this._timeout) {
                    var e = this._timeout;
                    l("connect attempt will timeout after %d", e);
                    var u = setTimeout(function() {
                        l("connect attempt timed out after %d", e);d.destroy();c.close();c.emit("error", "timeout");f.emitAll("connect_timeout", e)
                    }, e);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(u)
                        }
                    })
                }
                return this.subs.push(d),
                    this.subs.push(b), this
            };
            d.prototype.onopen = function() {
                l("open");this.cleanup();
                this.readyState = "open";this.emit("open");
                var a = this.engine;
                this.subs.push(q(a, "data", m(this, "ondata")));this.subs.push(q(a, "ping", m(this, "onping")));this.subs.push(q(a, "pong", m(this, "onpong")));this.subs.push(q(a, "error", m(this, "onerror")));this.subs.push(q(a, "close", m(this, "onclose")));this.subs.push(q(this.decoder, "decoded", m(this, "ondecoded")))
            };
            d.prototype.onping = function() {
                this.lastPing = new Date;this.emitAll("ping")
            };
            d.prototype.onpong = function() {
                this.emitAll("pong", new Date - this.lastPing)
            };
            d.prototype.ondata = function(a) {
                this.decoder.add(a)
            };
            d.prototype.ondecoded = function(a) {
                this.emit("packet", a)
            };
            d.prototype.onerror = function(a) {
                l("error", a);this.emitAll("error", a)
            };
            d.prototype.socket = function(b, c) {
                function f() {
                    ~v(e.connecting, d) || e.connecting.push(d)
                }
                var d = this.nsps[b];
                if (!d) {
                    d = new a(this, b, c);
                    this.nsps[b] = d;
                    var e = this;
                    d.on("connecting", f);d.on("connect", function() {
                        d.id = e.generateId(b)
                    });this.autoConnect && f()
                }
                return d
            };
            d.prototype.destroy = function(a) {
                a = v(this.connecting, a);~a && this.connecting.splice(a, 1);this.connecting.length || this.close()
            };
            d.prototype.packet = function(a) {
                l("writing packet %j", a);
                var b = this;
                a.query && 0 === a.type && (a.nsp += "?" + a.query);
                b.encoding ? b.packetBuffer.push(a) : (b.encoding = !0, this.encoder.encode(a, function(c) {
                    for (var f = 0; f < c.length; f++) b.engine.write(c[f], a.options);
                    b.encoding = !1;b.processPacketQueue()
                }))
            };
            d.prototype.processPacketQueue = function() {
                if (0 < this.packetBuffer.length && !this.encoding) {
                    var a = this.packetBuffer.shift();
                    this.packet(a)
                }
            };
            d.prototype.cleanup = function() {
                l("cleanup");
                for (var a = this.subs.length, b = 0; b < a; b++) this.subs.shift().destroy();
                this.packetBuffer = [];
                this.encoding = !1;
                this.lastPing = null;this.decoder.destroy()
            };
            d.prototype.close = d.prototype.disconnect = function() {
                l("disconnect");
                this.skipReconnect = !0;
                this.reconnecting = !1;"opening" === this.readyState && this.cleanup();this.backoff.reset();
                this.readyState = "closed";this.engine && this.engine.close()
            };
            d.prototype.onclose = function(a) {
                l("onclose");
                this.cleanup();this.backoff.reset();
                this.readyState = "closed";this.emit("close", a);this._reconnection && !this.skipReconnect && this.reconnect()
            };
            d.prototype.reconnect = function() {
                if (this.reconnecting || this.skipReconnect) return this;
                var a = this;
                if (this.backoff.attempts >= this._reconnectionAttempts) l("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
                else {
                    var b = this.backoff.duration();
                    l("will wait %dms before reconnect attempt", b);
                    this.reconnecting = !0;
                    var c = setTimeout(function() {
                        a.skipReconnect ||
                        (l("attempting reconnect"), a.emitAll("reconnect_attempt", a.backoff.attempts), a.emitAll("reconnecting", a.backoff.attempts), a.skipReconnect || a.open(function(b) {
                            b ? (l("reconnect attempt error"), a.reconnecting = !1, a.reconnect(), a.emitAll("reconnect_error", b.data)) : (l("reconnect success"), a.onreconnect())
                        }))
                    }, b);
                    this.subs.push({
                        destroy: function() {
                            clearTimeout(c)
                        }
                    })
                }
            };
            d.prototype.onreconnect = function() {
                var a = this.backoff.attempts;
                this.reconnecting = !1;this.backoff.reset();this.updateSocketIds();this.emitAll("reconnect",
                    a)
            }
        }, function(k, h, e) {
            k.exports = e(15)
        }, function(k, h, e) {
            k.exports = e(16);
            k.exports.parser = e(23)
        }, function(k, h, e) {
            (function(d) {
                function c(a, b) {
                    if (!(this instanceof c)) return new c(a, b);
                    b = b || {};a && "object" == typeof a && (b = a, a = null);
                    a ? (a = l(a), b.hostname = a.host, b.secure = "https" === a.protocol || "wss" === a.protocol, b.port = a.port, a.query && (b.query = a.query)) : b.host && (b.hostname = l(b.host).host);
                    this.secure = null != b.secure ? b.secure : d.location && "https:" === location.protocol;b.hostname && !b.port && (b.port = this.secure ? "443" :
                        "80");
                    this.agent = b.agent || !1;
                    this.hostname = b.hostname || (d.location ? location.hostname : "localhost");
                    this.port = b.port || (d.location && location.port ? location.port : this.secure ? 443 : 80);
                    this.query = b.query || {};"string" == typeof this.query && (this.query = t.decode(this.query));
                    this.upgrade = !1 !== b.upgrade;
                    this.path = (b.path || "/engine.io").replace(/\/$/, "") + "/";
                    this.forceJSONP = !!b.forceJSONP;
                    this.jsonp = !1 !== b.jsonp;
                    this.forceBase64 = !!b.forceBase64;
                    this.enablesXDR = !!b.enablesXDR;
                    this.timestampParam = b.timestampParam ||
                        "t";
                    this.timestampRequests = b.timestampRequests;
                    this.transports = b.transports || ["polling", "websocket"];
                    this.transportOptions = b.transportOptions || {};
                    this.readyState = "";
                    this.writeBuffer = [];
                    this.prevBufferLen = 0;
                    this.policyPort = b.policyPort || 843;
                    this.rememberUpgrade = b.rememberUpgrade || !1;
                    this.binaryType = null;
                    this.onlyBinaryUpgrades = b.onlyBinaryUpgrades;
                    this.perMessageDeflate = !1 !== b.perMessageDeflate && (b.perMessageDeflate || {});!0 === this.perMessageDeflate && (this.perMessageDeflate = {});this.perMessageDeflate &&
                    null == this.perMessageDeflate.threshold && (this.perMessageDeflate.threshold = 1024);
                    this.pfx = b.pfx || null;
                    this.key = b.key || null;
                    this.passphrase = b.passphrase || null;
                    this.cert = b.cert || null;
                    this.ca = b.ca || null;
                    this.ciphers = b.ciphers || null;
                    this.rejectUnauthorized = void 0 === b.rejectUnauthorized || b.rejectUnauthorized;
                    this.forceNode = !!b.forceNode;
                    a = "object" == typeof d && d;a.global === a && (b.extraHeaders && 0 < Object.keys(b.extraHeaders).length && (this.extraHeaders = b.extraHeaders), b.localAddress && (this.localAddress = b.localAddress));
                    this.pingTimeoutTimer = this.pingIntervalTimer = this.pingTimeout = this.pingInterval = this.upgrades = this.id = null;this.open()
                }
                var g = e(17),
                    a = e(8),
                    b = e(3)("engine.io-client:socket"),
                    q = e(37),
                    m = e(23),
                    l = e(2),
                    h = e(38),
                    t = e(31);
                k.exports = c;
                c.priorWebsocketSuccess = !1;a(c.prototype);
                c.protocol = m.protocol;
                c.Socket = c;
                c.Transport = e(22);
                c.transports = e(17);
                c.parser = e(23);
                c.prototype.createTransport = function(a) {
                    b('creating transport "%s"', a);
                    var c = this.query,
                        f = {},
                        d;
                    for (d in c) c.hasOwnProperty(d) && (f[d] = c[d]);
                    f.EIO = m.protocol;
                    f.transport = a;
                    c = this.transportOptions[a] || {};this.id && (f.sid = this.id);return new g[a]({
                        query: f,
                        socket: this,
                        agent: c.agent || this.agent,
                        hostname: c.hostname || this.hostname,
                        port: c.port || this.port,
                        secure: c.secure || this.secure,
                        path: c.path || this.path,
                        forceJSONP: c.forceJSONP || this.forceJSONP,
                        jsonp: c.jsonp || this.jsonp,
                        forceBase64: c.forceBase64 || this.forceBase64,
                        enablesXDR: c.enablesXDR || this.enablesXDR,
                        timestampRequests: c.timestampRequests || this.timestampRequests,
                        timestampParam: c.timestampParam || this.timestampParam,
                        policyPort: c.policyPort || this.policyPort,
                        pfx: c.pfx || this.pfx,
                        key: c.key || this.key,
                        passphrase: c.passphrase || this.passphrase,
                        cert: c.cert || this.cert,
                        ca: c.ca || this.ca,
                        ciphers: c.ciphers || this.ciphers,
                        rejectUnauthorized: c.rejectUnauthorized || this.rejectUnauthorized,
                        perMessageDeflate: c.perMessageDeflate || this.perMessageDeflate,
                        extraHeaders: c.extraHeaders || this.extraHeaders,
                        forceNode: c.forceNode || this.forceNode,
                        localAddress: c.localAddress || this.localAddress,
                        requestTimeout: c.requestTimeout || this.requestTimeout,
                        protocols: c.protocols || void 0
                    })
                };
                c.prototype.open = function() {
                    if (this.rememberUpgrade && c.priorWebsocketSuccess && -1 !== this.transports.indexOf("websocket")) var a = "websocket";
                    else {
                        if (0 === this.transports.length) {
                            var b = this;
                            return void setTimeout(function() {
                                b.emit("error", "No transports available")
                            }, 0)
                        }
                        a = this.transports[0]
                    }
                    this.readyState = "opening";try {
                        a = this.createTransport(a)
                    } catch ( w ) {
                        return this.transports.shift(), void this.open()
                    } a.open();this.setTransport(a)
                };
                c.prototype.setTransport = function(a) {
                    b("setting transport %s",
                        a.name);
                    var c = this;
                    this.transport && (b("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners());
                    this.transport = a;a.on("drain", function() {
                        c.onDrain()
                    }).on("packet", function(a) {
                        c.onPacket(a)
                    }).on("error", function(a) {
                        c.onError(a)
                    }).on("close", function() {
                        c.onClose("transport close")
                    })
                };
                c.prototype.probe = function(a) {
                    function f() {
                        if (t.onlyBinaryUpgrades) {
                            var f = !this.supportsBinary && t.transport.supportsBinary;
                            k = k || f
                        }
                        k || (b('probe transport "%s" opened', a), h.send([{
                            type: "ping",
                            data: "probe"
                        }]), h.once("packet", function(f) {
                            if (!k)
                                if ("pong" === f.type && "probe" === f.data) {
                                    if (b('probe transport "%s" pong', a), t.upgrading = !0, t.emit("upgrading", h), h) c.priorWebsocketSuccess = "websocket" === h.name, b('pausing current transport "%s"', t.transport.name), t.transport.pause(function() {
                                            k || "closed" !== t.readyState && (b("changing transport and sending upgrade packet"), q(), t.setTransport(h), h.send([{
                                                type: "upgrade"
                                            }]), t.emit("upgrade", h), h = null, t.upgrading = !1, t.flush())
                                        })
                                } else b('probe transport "%s" failed',
                                        a), f = Error("probe error"), f.transport = h.name, t.emit("upgradeError", f)
                        }))
                    }
                    function d() {
                        k || (k = !0, q(), h.close(), h = null)
                    }
                    function e(c) {
                        var f = Error("probe error: " + c);
                        f.transport = h.name;d();b('probe transport "%s" failed because of error: %s', a, c);t.emit("upgradeError", f)
                    }
                    function g() {
                        e("transport closed")
                    }
                    function l() {
                        e("socket closed")
                    }
                    function m(a) {
                        h && a.name !== h.name && (b('"%s" works - aborting "%s"', a.name, h.name), d())
                    }
                    function q() {
                        h.removeListener("open", f);h.removeListener("error", e);h.removeListener("close",
                            g);t.removeListener("close", l);t.removeListener("upgrading", m)
                    }
                    b('probing transport "%s"', a);
                    var h = this.createTransport(a, {
                            probe: 1
                        }),
                        k = !1,
                        t = this;
                    c.priorWebsocketSuccess = !1;h.once("open", f);h.once("error", e);h.once("close", g);this.once("close", l);this.once("upgrading", m);h.open()
                };
                c.prototype.onOpen = function() {
                    if (b("socket open"), this.readyState = "open", c.priorWebsocketSuccess = "websocket" === this.transport.name, this.emit("open"), this.flush(), "open" === this.readyState && this.upgrade && this.transport.pause) {
                        b("starting upgrade probes");
                        for (var a = 0, d = this.upgrades.length; a < d; a++) this.probe(this.upgrades[a])
                    }
                };
                c.prototype.onPacket = function(a) {
                    if ("opening" === this.readyState || "open" === this.readyState || "closing" === this.readyState) switch (b('socket receive: type "%s", data "%s"', a.type, a.data), this.emit("packet", a), this.emit("heartbeat"), a.type) {
                        case "open":
                            this.onHandshake(h(a.data));
                            break;case "pong":
                            this.setPing();this.emit("pong");
                            break;case "error":
                            var c = Error("server error");
                            c.code = a.data;this.onError(c);
                            break;case "message":
                            this.emit("data",
                                a.data), this.emit("message", a.data)
                    }
                    else b('packet received with socket readyState "%s"', this.readyState)
                };
                c.prototype.onHandshake = function(a) {
                    this.emit("handshake", a);
                    this.id = a.sid;
                    this.transport.query.sid = a.sid;
                    this.upgrades = this.filterUpgrades(a.upgrades);
                    this.pingInterval = a.pingInterval;
                    this.pingTimeout = a.pingTimeout;this.onOpen();"closed" !== this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                };
                c.prototype.onHeartbeat = function(a) {
                    clearTimeout(this.pingTimeoutTimer);
                    var b = this;
                    b.pingTimeoutTimer = setTimeout(function() {
                        "closed" !== b.readyState && b.onClose("ping timeout")
                    }, a || b.pingInterval + b.pingTimeout)
                };
                c.prototype.setPing = function() {
                    var a = this;
                    clearTimeout(a.pingIntervalTimer);
                    a.pingIntervalTimer = setTimeout(function() {
                        b("writing ping packet - expecting pong within %sms", a.pingTimeout);a.ping();a.onHeartbeat(a.pingTimeout)
                    }, a.pingInterval)
                };
                c.prototype.ping = function() {
                    var a = this;
                    this.sendPacket("ping", function() {
                        a.emit("ping")
                    })
                };
                c.prototype.onDrain = function() {
                    this.writeBuffer.splice(0,
                        this.prevBufferLen);
                    this.prevBufferLen = 0;
                    0 === this.writeBuffer.length ? this.emit("drain") : this.flush()
                };
                c.prototype.flush = function() {
                    "closed" !== this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (b("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                };
                c.prototype.write = c.prototype.send = function(a, b, c) {
                    return this.sendPacket("message", a, b, c), this
                };
                c.prototype.sendPacket = function(a, b, c, d) {
                    if ("function" == typeof b && (d = b, b = void 0), "function" == typeof c && (d = c, c = null), "closing" !== this.readyState && "closed" !== this.readyState) c = c || {}, c.compress = !1 !== c.compress, a = {
                            type: a,
                            data: b,
                            options: c
                        }, this.emit("packetCreate", a), this.writeBuffer.push(a), d && this.once("flush", d), this.flush()
                };
                c.prototype.close = function() {
                    function a() {
                        e.onClose("forced close");b("socket closing - telling transport to close");e.transport.close()
                    }
                    function c() {
                        e.removeListener("upgrade", c);e.removeListener("upgradeError",
                            c);a()
                    }
                    function d() {
                        e.once("upgrade", c);e.once("upgradeError", c)
                    }
                    if ("opening" === this.readyState || "open" === this.readyState) {
                        this.readyState = "closing";
                        var e = this;
                        this.writeBuffer.length ? this.once("drain", function() {
                            this.upgrading ? d() : a()
                        }) : this.upgrading ? d() : a()
                    }
                    return this
                };
                c.prototype.onError = function(a) {
                    b("socket error %j", a);
                    c.priorWebsocketSuccess = !1;this.emit("error", a);this.onClose("transport error", a)
                };
                c.prototype.onClose = function(a, c) {
                    if ("opening" === this.readyState || "open" === this.readyState ||
                            "closing" === this.readyState) b('socket close with reason: "%s"', a), clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", a, c), this.writeBuffer = [], this.prevBufferLen = 0
                };
                c.prototype.filterUpgrades = function(a) {
                    for (var b = [], c = 0, d = a.length; c < d; c++) ~q(this.transports, a[c]) && b.push(a[c]);
                    return b
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            (function(d) {
                var c = e(18),
                    g = e(20),
                    a = e(34),
                    b = e(35);
                h.polling = function(b) {
                    var e,
                        l = !1,
                        h = !1,
                        q = !1 !== b.jsonp;
                    d.location && (h = "https:" === location.protocol, (l = location.port) || (l = h ? 443 : 80), l = b.hostname !== location.hostname || l !== b.port, h = b.secure !== h);
                    if (b.xdomain = l, b.xscheme = h, e = new c(b), "open" in e && !b.forceJSONP) return new g(b);
                    if (!q)
                        throw Error("JSONP disabled");
                    return new a(b)
                };
                h.websocket = b
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            (function(d) {
                var c = e(19);
                k.exports = function(e) {
                    var a = e.xdomain,
                        b = e.xscheme;
                    e = e.enablesXDR;try {
                        if ("undefined" != typeof XMLHttpRequest && (!a || c)) return new XMLHttpRequest
                    } catch ( q ) {} try {
                        if ("undefined" != typeof XDomainRequest && !b && e) return new XDomainRequest
                    } catch ( q ) {}
                    if (!a) try {
                            return new (d[["Active"].concat("Object").join("X")])("Microsoft.XMLHTTP")
                        } catch ( q ) {}
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            try {
                k.exports = "undefined" != typeof XMLHttpRequest && "withCredentials" in new XMLHttpRequest
            } catch ( e ) {
                k.exports = !1
            }
        }, function(k, h, e) {
            (function(d) {
                function c() {
                }
                function g(a) {
                    if (m.call(this, a), this.requestTimeout = a.requestTimeout, this.extraHeaders = a.extraHeaders, d.location) {
                        var b = "https:" === location.protocol,
                            c = location.port;
                        c || (c = b ? 443 : 80);
                        this.xd = a.hostname !== d.location.hostname || c !== a.port;
                        this.xs = a.secure !== b
                    }
                }
                function a(a) {
                    this.method = a.method || "GET";
                    this.uri = a.uri;
                    this.xd = !!a.xd;
                    this.xs = !!a.xs;
                    this.async = !1 !== a.async;
                    this.data = void 0 !== a.data ? a.data : null;
                    this.agent = a.agent;
                    this.isBinary = a.isBinary;
                    this.supportsBinary = a.supportsBinary;
                    this.enablesXDR = a.enablesXDR;
                    this.requestTimeout = a.requestTimeout;
                    this.pfx = a.pfx;
                    this.key = a.key;
                    this.passphrase = a.passphrase;
                    this.cert = a.cert;
                    this.ca = a.ca;
                    this.ciphers = a.ciphers;
                    this.rejectUnauthorized = a.rejectUnauthorized;
                    this.extraHeaders = a.extraHeaders;this.create()
                }
                function b() {
                    for (var b in a.requests) a.requests.hasOwnProperty(b) && a.requests[b].abort()
                }
                var h = e(18),
                    m = e(21),
                    l = e(8),
                    v = e(32),
                    t = e(3)("engine.io-client:polling-xhr");
                k.exports = g;
                k.exports.Request = a;v(g, m);
                g.prototype.supportsBinary = !0;
                g.prototype.request = function(b) {
                    return b = b || {}, b.uri = this.uri(), b.xd = this.xd, b.xs = this.xs, b.agent = this.agent || !1, b.supportsBinary = this.supportsBinary, b.enablesXDR = this.enablesXDR, b.pfx = this.pfx, b.key = this.key, b.passphrase = this.passphrase, b.cert = this.cert, b.ca = this.ca, b.ciphers = this.ciphers, b.rejectUnauthorized = this.rejectUnauthorized, b.requestTimeout = this.requestTimeout, b.extraHeaders = this.extraHeaders, new a(b)
                };
                g.prototype.doWrite = function(a, b) {
                    a = this.request({
                        method: "POST",
                        data: a,
                        isBinary: "string" != typeof a && void 0 !==
                            a
                    });
                    var c = this;
                    a.on("success", b);a.on("error", function(a) {
                        c.onError("xhr post error", a)
                    });
                    this.sendXhr = a
                };
                g.prototype.doPoll = function() {
                    t("xhr poll");
                    var a = this.request(),
                        b = this;
                    a.on("data", function(a) {
                        b.onData(a)
                    });a.on("error", function(a) {
                        b.onError("xhr poll error", a)
                    });
                    this.pollXhr = a
                };l(a.prototype);
                a.prototype.create = function() {
                    var b = {
                        agent: this.agent,
                        xdomain: this.xd,
                        xscheme: this.xs,
                        enablesXDR: this.enablesXDR
                    };
                    b.pfx = this.pfx;
                    b.key = this.key;
                    b.passphrase = this.passphrase;
                    b.cert = this.cert;
                    b.ca = this.ca;
                    b.ciphers = this.ciphers;
                    b.rejectUnauthorized = this.rejectUnauthorized;
                    var c = this.xhr = new h(b),
                        e = this;
                    try {
                        t("xhr open %s: %s", this.method, this.uri);c.open(this.method, this.uri, this.async);try {
                            if (this.extraHeaders) {
                                c.setDisableHeaderCheck && c.setDisableHeaderCheck(!0);
                                for (var g in this.extraHeaders) this.extraHeaders.hasOwnProperty(g) && c.setRequestHeader(g, this.extraHeaders[g])
                            }
                        } catch ( y ) {}
                        if ("POST" === this.method) try {
                                this.isBinary ? c.setRequestHeader("Content-type", "application/octet-stream") : c.setRequestHeader("Content-type",
                                    "text/plain;charset\x3dUTF-8")
                            } catch ( y ) {} try {
                            c.setRequestHeader("Accept", "*/*")
                        } catch ( y ) {} "withCredentials" in c && (c.withCredentials = !0);this.requestTimeout && (c.timeout = this.requestTimeout);
                        this.hasXDR() ? (c.onload = function() {
                            e.onLoad()
                        }, c.onerror = function() {
                            e.onError(c.responseText)
                        }) : c.onreadystatechange = function() {
                            if (2 === c.readyState) {
                                try {
                                    var a = c.getResponseHeader("Content-Type")
                                } catch ( z ) {} "application/octet-stream" === a && (c.responseType = "arraybuffer")
                            }
                            4 === c.readyState && (200 === c.status || 1223 === c.status ?
                                e.onLoad() : setTimeout(function() {
                                    e.onError(c.status)
                                }, 0))
                        };t("xhr data %s", this.data);c.send(this.data)
                    } catch ( y ) {
                        return void setTimeout(function() {
                            e.onError(y)
                        }, 0)
                    } d.document && (this.index = a.requestsCount++, a.requests[this.index] = this)
                };
                a.prototype.onSuccess = function() {
                    this.emit("success");this.cleanup()
                };
                a.prototype.onData = function(a) {
                    this.emit("data", a);this.onSuccess()
                };
                a.prototype.onError = function(a) {
                    this.emit("error", a);this.cleanup(!0)
                };
                a.prototype.cleanup = function(b) {
                    if ("undefined" != typeof this.xhr &&
                            null !== this.xhr) {
                        if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = c : this.xhr.onreadystatechange = c, b) try {
                                this.xhr.abort()
                            } catch ( u ) {} d.document &&
                        delete a.requests[this.index];
                        this.xhr = null
                    }
                };
                a.prototype.onLoad = function() {
                    try {
                        try {
                            var a = this.xhr.getResponseHeader("Content-Type")
                        } catch ( w ) {} var b = "application/octet-stream" === a ? this.xhr.response || this.xhr.responseText : this.xhr.responseText
                    } catch ( w ) {
                        this.onError(w)
                    } null != b && this.onData(b)
                };
                a.prototype.hasXDR = function() {
                    return "undefined" != typeof d.XDomainRequest &&
                        !this.xs && this.enablesXDR
                };
                a.prototype.abort = function() {
                    this.cleanup()
                };
                a.requestsCount = 0;
                a.requests = {};d.document && (d.attachEvent ? d.attachEvent("onunload", b) : d.addEventListener && d.addEventListener("beforeunload", b, !1))
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            function d(a) {
                var b = a && a.forceBase64;
                m && !b || (this.supportsBinary = !1);c.call(this, a)
            }
            var c = e(22),
                g = e(31),
                a = e(23);
            h = e(32);
            var b = e(33),
                q = e(3)("engine.io-client:polling");
            k.exports = d;
            var m = null != (new (e(18))({
                xdomain: !1
            })).responseType;
            h(d, c);
            d.prototype.name = "polling";
            d.prototype.doOpen = function() {
                this.poll()
            };
            d.prototype.pause = function(a) {
                function b() {
                    q("paused");
                    c.readyState = "paused";a()
                }
                var c = this;
                if (this.readyState = "pausing", this.polling || !this.writable) {
                    var d = 0;
                    this.polling && (q("we are currently polling - waiting to pause"), d++, this.once("pollComplete", function() {
                        q("pre-pause polling complete");--d || b()
                    }));this.writable || (q("we are currently writing - waiting to pause"), d++, this.once("drain", function() {
                        q("pre-pause writing complete");
                        --d || b()
                    }))
                } else b()
            };
            d.prototype.poll = function() {
                q("polling");
                this.polling = !0;this.doPoll();this.emit("poll")
            };
            d.prototype.onData = function(b) {
                var c = this;
                q("polling got data %s", b);a.decodePayload(b, this.socket.binaryType, function(a, b, d) {
                    return "opening" === c.readyState && c.onOpen(), "close" === a.type ? (c.onClose(), !1) : void c.onPacket(a)
                });"closed" !== this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" === this.readyState ? this.poll() : q('ignoring poll - transport state "%s"', this.readyState))
            };
            d.prototype.doClose = function() {
                function a() {
                    q("writing close packet");b.write([{
                        type: "close"
                    }])
                }
                var b = this;
                "open" === this.readyState ? (q("transport open - closing"), a()) : (q("transport not open - deferring close"), this.once("open", a))
            };
            d.prototype.write = function(b) {
                var c = this;
                this.writable = !1;
                var d = function() {
                    c.writable = !0;c.emit("drain")
                };
                a.encodePayload(b, this.supportsBinary, function(a) {
                    c.doWrite(a, d)
                })
            };
            d.prototype.uri = function() {
                var a = this.query || {},
                    c = this.secure ? "https" : "http",
                    d = "";
                !1 !== this.timestampRequests &&
                (a[this.timestampParam] = b());this.supportsBinary || a.sid || (a.b64 = 1);
                a = g.encode(a);this.port && ("https" === c && 443 !== Number(this.port) || "http" === c && 80 !== Number(this.port)) && (d = ":" + this.port);a.length && (a = "?" + a);
                var f = -1 !== this.hostname.indexOf(":");
                return c + "://" + (f ? "[" + this.hostname + "]" : this.hostname) + d + this.path + a
            }
        }, function(k, h, e) {
            function d(c) {
                this.path = c.path;
                this.hostname = c.hostname;
                this.port = c.port;
                this.secure = c.secure;
                this.query = c.query;
                this.timestampParam = c.timestampParam;
                this.timestampRequests = c.timestampRequests;
                this.readyState = "";
                this.agent = c.agent || !1;
                this.socket = c.socket;
                this.enablesXDR = c.enablesXDR;
                this.pfx = c.pfx;
                this.key = c.key;
                this.passphrase = c.passphrase;
                this.cert = c.cert;
                this.ca = c.ca;
                this.ciphers = c.ciphers;
                this.rejectUnauthorized = c.rejectUnauthorized;
                this.forceNode = c.forceNode;
                this.extraHeaders = c.extraHeaders;
                this.localAddress = c.localAddress
            }
            var c = e(23);
            h = e(8);
            k.exports = d;h(d.prototype);
            d.prototype.onError = function(c, a) {
                c = Error(c);return c.type = "TransportError", c.description = a, this.emit("error",
                        c), this
            };
            d.prototype.open = function() {
                return "closed" !== this.readyState && "" !== this.readyState || (this.readyState = "opening", this.doOpen()), this
            };
            d.prototype.close = function() {
                return "opening" !== this.readyState && "open" !== this.readyState || (this.doClose(), this.onClose()), this
            };
            d.prototype.send = function(c) {
                if ("open" !== this.readyState)
                    throw Error("Transport not open");
                this.write(c)
            };
            d.prototype.onOpen = function() {
                this.readyState = "open";
                this.writable = !0;this.emit("open")
            };
            d.prototype.onData = function(d) {
                d = c.decodePacket(d,
                    this.socket.binaryType);this.onPacket(d)
            };
            d.prototype.onPacket = function(c) {
                this.emit("packet", c)
            };
            d.prototype.onClose = function() {
                this.readyState = "closed";this.emit("close")
            }
        }, function(k, h, e) {
            (function(d) {
                function c(a, b, c) {
                    if (!b) return h.encodeBase64Packet(a, c);
                    var d = new FileReader;
                    return d.onload = function() {
                            a.data = d.result;h.encodePacket(a, b, !0, c)
                        }, d.readAsArrayBuffer(a.data)
                }
                function g(a, b, c) {
                    var d = Array(a.length);
                    c = l(a.length, c);
                    for (var f = function(a, c, f) {
                                b(c, function(b, c) {
                                    d[a] = c; f(b, d)
                                })
                            }, e = 0;e <
                        a.length; e++) f(e, a[e], c)
                }
                var a,
                    b = e(24),
                    q = e(9),
                    m = e(25),
                    l = e(26),
                    k = e(27);
                d && d.ArrayBuffer && (a = e(29));
                var t = "undefined" != typeof navigator && /Android/i.test(navigator.userAgent),
                    f = "undefined" != typeof navigator && /PhantomJS/i.test(navigator.userAgent),
                    u = t || f;
                h.protocol = 3;
                var w = h.packets = {
                        open: 0,
                        close: 1,
                        ping: 2,
                        pong: 3,
                        message: 4,
                        upgrade: 5,
                        noop: 6
                    },
                    x = b(w),
                    y = {
                        type: "error",
                        data: "parser error"
                    },
                    n = e(30);
                h.encodePacket = function(a, b, f, e) {
                    "function" == typeof b && (e = b, b = !1);"function" == typeof f && (e = f, f = null);
                    var g = void 0 ===
                    a.data ? void 0 : a.data.buffer || a.data;
                    if (d.ArrayBuffer && g instanceof ArrayBuffer) {
                        if (b) {
                            f = a.data;
                            b = new Uint8Array(f);
                            f = new Uint8Array(1 + f.byteLength);
                            f[0] = w[a.type];
                            for (a = 0; a < b.length; a++) f[a + 1] = b[a];
                            a = e(f.buffer)
                        } else
                            a = h.encodeBase64Packet(a, e);
                        return a
                    }
                    if (n && g instanceof d.Blob) return b ? u ? a = c(a, b, e) : (b = new Uint8Array(1), b[0] = w[a.type], a = new n([b.buffer, a.data]), a = e(a)) : a = h.encodeBase64Packet(a, e), a;
                    if (g && g.base64) return e("b" + h.packets[a.type] + a.data.data);
                    b = w[a.type];return void 0 !== a.data && (b += f ? k.encode(String(a.data), {
                            strict: !1
                        }) : String(a.data)), e("" + b)
                };
                h.encodeBase64Packet = function(a, b) {
                    var c = "b" + h.packets[a.type];
                    if (n && a.data instanceof d.Blob) {
                        var f = new FileReader;
                        return f.onload = function() {
                                var a = f.result.split(",")[1];
                                b(c + a)
                            }, f.readAsDataURL(a.data)
                    }
                    try {
                        var e = String.fromCharCode.apply(null, new Uint8Array(a.data))
                    } catch ( P ) {
                        a = new Uint8Array(a.data);
                        e = Array(a.length);
                        for (var g = 0; g < a.length; g++) e[g] = a[g];
                        e = String.fromCharCode.apply(null, e)
                    } return c += d.btoa(e), b(c)
                };
                h.decodePacket = function(a,
                    b, c) {
                    if (void 0 === a) return y;
                    if ("string" == typeof a) {
                        if ("b" === a.charAt(0)) return h.decodeBase64Packet(a.substr(1), b);
                        if (b = c) {
                            b = a;try {
                                b = k.decode(b, {
                                    strict: !1
                                })
                            } catch ( F ) {
                                b = !1
                            }
                            b = (a = b, !1 === a)
                        }
                        if (b) return y;
                        c = a.charAt(0);return Number(c) == c && x[c] ? 1 < a.length ? {
                            type: x[c],
                            data: a.substring(1)
                        } : {
                            type: x[c]
                        } : y
                    }
                    c = (new Uint8Array(a))[0];
                    a = m(a, 1);return n && "blob" === b && (a = new n([a])), {
                            type: x[c],
                            data: a
                    }
                };
                h.decodeBase64Packet = function(b, c) {
                    var d = x[b.charAt(0)];
                    if (!a) return {
                            type: d,
                            data: {
                                base64: !0,
                                data: b.substr(1)
                            }
                        };
                    b = a.decode(b.substr(1));return "blob" === c && n && (b = new n([b])), {
                            type: d,
                            data: b
                    }
                };
                h.encodePayload = function(a, b, c) {
                    function d(a, c) {
                        h.encodePacket(a, !!f && b, !1, function(a) {
                            c(null, a.length + ":" + a)
                        })
                    }
                    "function" == typeof b && (c = b, b = null);
                    var f = q(a);
                    return b && f ? n && !u ? h.encodePayloadAsBlob(a, c) : h.encodePayloadAsArrayBuffer(a, c) : a.length ? void g(a, d, function(a, b) {
                        return c(b.join(""))
                    }) : c("0:")
                };
                h.decodePayload = function(a, b, c) {
                    if ("string" != typeof a) return h.decodePayloadAsBinary(a, b, c);
                    "function" == typeof b && (c = b, b = null);
                    var d;
                    if ("" === a) return c(y, 0, 1);
                    for (var f, e, g = "", l = 0, m = a.length; l < m; l++) {
                        var q = a.charAt(l);
                        if (":" === q) {
                            if ("" === g || g != (f = Number(g)) || (e = a.substr(l + 1, f), g != e.length)) return c(y, 0, 1);
                            if (e.length) {
                                if (d = h.decodePacket(e, b, !1), y.type === d.type && y.data === d.data) return c(y, 0, 1);
                                if (!1 === c(d, l + f, m)) return
                            }
                            l += f;
                            g = ""
                        } else
                            g += q
                    }
                    return "" !== g ? c(y, 0, 1) : void 0
                };
                h.encodePayloadAsArrayBuffer = function(a, b) {
                    function c(a, b) {
                        h.encodePacket(a, !0, !0, function(a) {
                            return b(null, a)
                        })
                    }
                    return a.length ? void g(a, c, function(a, c) {
                        a = c.reduce(function(a, b) {
                            var c;
                            return c = "string" == typeof b ? b.length : b.byteLength, a + c.toString().length + c + 2
                        }, 0);
                        var d = new Uint8Array(a),
                            f = 0;
                        return c.forEach(function(a) {
                                var b = "string" == typeof a,
                                    c = a;
                                if (b) {
                                    c = new Uint8Array(a.length);
                                    for (var e = 0; e < a.length; e++) c[e] = a.charCodeAt(e);
                                    c = c.buffer
                                }
                                b ? d[f++] = 0 : d[f++] = 1;
                                a = c.byteLength.toString();
                                for (e = 0; e < a.length; e++) d[f++] = parseInt(a[e]);
                                d[f++] = 255;
                                c = new Uint8Array(c);
                                for (e = 0; e < c.length; e++) d[f++] = c[e]
                            }), b(d.buffer)
                    }) : b(new ArrayBuffer(0))
                };
                h.encodePayloadAsBlob = function(a, b) {
                    g(a, function(a, b) {
                        h.encodePacket(a, !0, !0, function(a) {
                            var c = new Uint8Array(1);
                            if (c[0] = 1, "string" == typeof a) {
                                for (var d = new Uint8Array(a.length), f = 0; f < a.length; f++) d[f] = a.charCodeAt(f);
                                a = d.buffer;
                                c[0] = 0
                            }
                            d = (a instanceof ArrayBuffer ? a.byteLength : a.size).toString();
                            var e = new Uint8Array(d.length + 1);
                            for (f = 0; f < d.length; f++) e[f] = parseInt(d[f]);
                            if (e[d.length] = 255, n) a = new n([c.buffer, e.buffer, a]), b(null, a)
                        })
                    }, function(a, c) {
                        return b(new n(c))
                    })
                };
                h.decodePayloadAsBinary = function(a, b, c) {
                    "function" ==
                    typeof b && (c = b, b = null);
                    for (var d = []; 0 < a.byteLength;) {
                        for (var f = new Uint8Array(a), e = 0 === f[0], g = "", l = 1; 255 !== f[l]; l++) {
                            if (310 < g.length) return c(y, 0, 1);
                            g += f[l]
                        }
                        a = m(a, 2 + g.length);
                        g = parseInt(g);
                        f = m(a, 0, g);
                        if (e) try {
                                f = String.fromCharCode.apply(null, new Uint8Array(f))
                            } catch ( G ) {
                                for (e = new Uint8Array(f), f = "", l = 0; l < e.length; l++) f += String.fromCharCode(e[l])
                        } d.push(f);
                        a = m(a, g)
                    }
                    var q = d.length;
                    d.forEach(function(a, d) {
                        c(h.decodePacket(a, b, !0), d, q)
                    })
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            k.exports = Object.keys || function(e) {
                var d = [],
                    c = Object.prototype.hasOwnProperty,
                    g;
                for (g in e) c.call(e, g) && d.push(g);
                return d
            }
        }, function(k, h) {
            k.exports = function(e, d, c) {
                var g = e.byteLength;
                if (d = d || 0, c = c || g, e.slice) return e.slice(d, c);
                if (0 > d && (d += g), 0 > c && (c += g), c > g && (c = g), d >= g || d >= c || 0 === g) return new ArrayBuffer(0);
                e = new Uint8Array(e);
                g = new Uint8Array(c - d);
                for (var a = 0; d < c; d++, a++) g[a] = e[d];
                return g.buffer
            }
        }, function(k, h) {
            function e() {
            }
            k.exports = function(d, c, g) {
                function a(d, e) {
                    if (0 >= a.count)
                        throw Error("after called too many times");
                    --a.count;
                    d ? (b = !0, c(d), c = g) : 0 !== a.count || b || c(null, e)
                }
                var b = !1;
                return g = g || e, a.count = d, 0 === d ? c() : a
            }
        }, function(k, h, e) {
            var d;
            (function(c, e) {
                !function(a) {
                    function b(a) {
                        for (var b, c, d = [], f = 0, e = a.length; f < e;) b = a.charCodeAt(f++), 55296 <= b && 56319 >= b && f < e ? (c = a.charCodeAt(f++), 56320 == (64512 & c) ? d.push(((1023 & b) << 10) + (1023 & c) + 65536) : (d.push(b), f--)) : d.push(b);
                        return d
                    }
                    function e(a, b) {
                        if (55296 <= a && 57343 >= a) {
                            if (b)
                                throw Error("Lone surrogate U+" + a.toString(16).toUpperCase() + " is not a scalar value");
                            return !1
                        }
                        return !0
                    }
                    function g() {
                        if (f >= t)
                            throw Error("Invalid byte index");
                        var a = 255 & k[f];
                        if (f++, 128 == (192 & a)) return 63 & a;
                        throw Error("Invalid continuation byte");
                    }
                    function l(a) {
                        var b,
                            c,
                            d,
                            l,
                            h;
                        if (f > t)
                            throw Error("Invalid byte index");
                        if (f == t) return !1;
                        if (b = 255 & k[f], f++, 0 == (128 & b)) return b;
                        if (192 == (224 & b)) {
                            if (c = g(), h = (31 & b) << 6 | c, 128 <= h) return h;
                            throw Error("Invalid continuation byte");
                        }
                        if (224 == (240 & b)) {
                            if (c = g(), d = g(), h = (15 & b) << 12 | c << 6 | d, 2048 <= h) return e(h, a) ? h : 65533;
                            throw Error("Invalid continuation byte");
                        }
                        if (240 == (248 &
                                b) && (c = g(), d = g(), l = g(), h = (7 & b) << 18 | c << 12 | d << 6 | l, 65536 <= h && 1114111 >= h)) return h;
                        throw Error("Invalid UTF-8 detected");
                    }
                    a = "object" == typeof h && h;"object" == typeof c && c && c.exports == a && c;
                    var k,
                        t,
                        f,
                        u = String.fromCharCode;
                    d = {
                        version: "2.1.2",
                        encode: function(a, c) {
                            c = c || {};
                            c = !1 !== c.strict;
                            a = b(a);
                            for (var d = a.length, f = -1, g = ""; ++f < d;) {
                                var h = a[f];
                                var l = c;
                                if (0 == (4294967168 & h))
                                    l = u(h);
                                else {
                                    var m = "";
                                    l = (0 == (4294965248 & h) ? m = u(h >> 6 & 31 | 192) : 0 == (4294901760 & h) ? (e(h, l) || (h = 65533), m = u(h >> 12 & 15 | 224), m += u(h >> 6 & 63 | 128)) : 0 == (4292870144 &
                                    h) && (m = u(h >> 18 & 7 | 240), m += u(h >> 12 & 63 | 128), m += u(h >> 6 & 63 | 128)), m + u(63 & h | 128))
                                }
                                g += l
                            }
                            return g
                        },
                        decode: function(a, c) {
                            c = c || {};
                            c = !1 !== c.strict;
                            k = b(a);
                            t = k.length;
                            f = 0;
                            var d;
                            for (a = []; !1 !== (d = l(c));) a.push(d);
                            d = a.length;
                            for (var e = -1, g = ""; ++e < d;) c = a[e], 65535 < c && (c -= 65536, g += u(c >>> 10 & 1023 | 55296), c = 56320 | 1023 & c), g += u(c);
                            return g
                        }
                    };!(void 0 !== d && (c.exports = d))
                }(this)
            }).call(h, e(28)(k), function() {
                return this
            }())
        }, function(k, h) {
            k.exports = function(e) {
                return e.webpackPolyfill || (e.deprecate = function() {}, e.paths = [], e.children = [], e.webpackPolyfill = 1), e
            }
        }, function(k, h) {
            !function() {
                for (var e = new Uint8Array(256), d = 0; 64 > d; d++) e["ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".charCodeAt(d)] = d;
                h.encode = function(c) {
                    var d = new Uint8Array(c),
                        a = d.length,
                        b = "";
                    for (c = 0; c < a; c += 3) b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[d[c] >> 2], b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(3 & d[c]) << 4 | d[c + 1] >> 4], b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[(15 &
                        d[c + 1]) << 2 | d[c + 2] >> 6], b += "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"[63 & d[c + 2]];
                    return 2 === a % 3 ? b = b.substring(0, b.length - 1) + "\x3d" : 1 === a % 3 && (b = b.substring(0, b.length - 2) + "\x3d\x3d"), b
                };
                h.decode = function(c) {
                    var d = .75 * c.length;
                    var a = c.length,
                        b = 0;
                    "\x3d" === c[c.length - 1] && (d--, "\x3d" === c[c.length - 2] && d--);
                    var h = new ArrayBuffer(d),
                        m = new Uint8Array(h);
                    for (d = 0; d < a; d += 4) {
                        var l = e[c.charCodeAt(d)];
                        var k = e[c.charCodeAt(d + 1)];
                        var t = e[c.charCodeAt(d + 2)];
                        var f = e[c.charCodeAt(d + 3)];
                        m[b++] = l <<
                            2 | k >> 4;
                        m[b++] = (15 & k) << 4 | t >> 2;
                        m[b++] = (3 & t) << 6 | 63 & f
                    }
                    return h
                }
            }()
        }, function(k, h) {
            (function(e) {
                function d(a) {
                    for (var b = 0; b < a.length; b++) {
                        var c = a[b];
                        if (c.buffer instanceof ArrayBuffer) {
                            var d = c.buffer;
                            if (c.byteLength !== d.byteLength) {
                                var e = new Uint8Array(c.byteLength);
                                e.set(new Uint8Array(d, c.byteOffset, c.byteLength));
                                d = e.buffer
                            }
                            a[b] = d
                        }
                    }
                }
                function c(b, c) {
                    c = c || {};var e = new a;
                    d(b);
                    for (var f = 0; f < b.length; f++) e.append(b[f]);
                    return c.type ? e.getBlob(c.type) : e.getBlob()
                }
                function g(a, b) {
                    return d(a), new Blob(a, b ||
                            {})
                }
                var a = e.BlobBuilder || e.WebKitBlobBuilder || e.MSBlobBuilder || e.MozBlobBuilder;
                try {
                    var b = 2 === (new Blob(["hi"])).size
                } catch ( l ) {
                    b = !1
                }
                var h;
                if (h = b) try {
                        h = 2 === (new Blob([new Uint8Array([1, 2])])).size
                    } catch ( l ) {
                        h = !1
                }
                var m = a && a.prototype.append && a.prototype.getBlob;
                k.exports = b ? h ? e.Blob : g : m ? c : void 0
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {
            h.encode = function(e) {
                var d = "",
                    c;
                for (c in e) e.hasOwnProperty(c) && (d.length && (d += "\x26"), d += encodeURIComponent(c) + "\x3d" + encodeURIComponent(e[c]));
                return d
            };
            h.decode = function(e) {
                var d = {};
                e = e.split("\x26");
                for (var c = 0, g = e.length; c < g; c++) {
                    var a = e[c].split("\x3d");
                    d[decodeURIComponent(a[0])] = decodeURIComponent(a[1])
                }
                return d
            }
        }, function(k, h) {
            k.exports = function(e, d) {
                var c = function() {};
                c.prototype = d.prototype;
                e.prototype = new c;
                e.prototype.constructor = e
            }
        }, function(k, h) {
            function e(b) {
                var c = "";
                do c = g[b % a] + c, b = Math.floor(b / a); while (0 < b);
                return c
            }
            function d() {
                var a = e(+new Date);
                return a !== c ? (q = 0, c = a) : a + "." + e(q++)
            }
            for (var c, g = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_".split(""),
                    a = 64, b = {}, q = 0, m = 0; m < a; m++) b[g[m]] = m;
            d.encode = e;
            d.decode = function(c) {
                var d = 0;
                for (m = 0; m < c.length; m++) d = d * a + b[c.charAt(m)];
                return d
            };
            k.exports = d
        }, function(k, h, e) {
            (function(d) {
                function c() {
                }
                function g(b) {
                    a.call(this, b);
                    this.query = this.query || {};h || (d.___eio || (d.___eio = []), h = d.___eio);
                    this.index = h.length;var e = this;
                    h.push(function(a) {
                        e.onData(a)
                    });
                    this.query.j = this.index;d.document && d.addEventListener && d.addEventListener("beforeunload", function() {
                        e.script && (e.script.onerror = c)
                    }, !1)
                }
                var a = e(21),
                    b = e(32);
                k.exports = g;
                var h,
                    m = /\n/g,
                    l = /\\n/g;
                b(g, a);
                g.prototype.supportsBinary = !1;
                g.prototype.doClose = function() {
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null);this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null);a.prototype.doClose.call(this)
                };
                g.prototype.doPoll = function() {
                    var a = this,
                        b = document.createElement("script");
                    this.script && (this.script.parentNode.removeChild(this.script), this.script = null);
                    b.async = !0;
                    b.src = this.uri();
                    b.onerror = function(b) {
                        a.onError("jsonp poll error",
                            b)
                    };
                    var c = document.getElementsByTagName("script")[0];
                    c ? c.parentNode.insertBefore(b, c) : (document.head || document.body).appendChild(b);
                    this.script = b;"undefined" != typeof navigator && /gecko/i.test(navigator.userAgent) && setTimeout(function() {
                        var a = document.createElement("iframe");
                        document.body.appendChild(a);document.body.removeChild(a)
                    }, 100)
                };
                g.prototype.doWrite = function(a, b) {
                    function c() {
                        d();b()
                    }
                    function d() {
                        if (g.iframe) try {
                                g.form.removeChild(g.iframe)
                            } catch ( B ) {
                                g.onError("jsonp polling iframe removal error",
                                    B)
                        } try {
                            e = document.createElement('\x3ciframe src\x3d"javascript:0" name\x3d"' + g.iframeId + '"\x3e')
                        } catch ( B ) {
                            e = document.createElement("iframe"), e.name = g.iframeId, e.src = "javascript:0"
                        }
                        e.id = g.iframeId;g.form.appendChild(e);
                        g.iframe = e
                    }
                    var e,
                        g = this;
                    if (!this.form) {
                        var h = document.createElement("form"),
                            q = document.createElement("textarea"),
                            k = this.iframeId = "eio_iframe_" + this.index;
                        h.className = "socketio";
                        h.style.position = "absolute";
                        h.style.top = "-1000px";
                        h.style.left = "-1000px";
                        h.target = k;
                        h.method = "POST";h.setAttribute("accept-charset",
                            "utf-8");
                        q.name = "d";h.appendChild(q);document.body.appendChild(h);
                        this.form = h;
                        this.area = q
                    }
                    this.form.action = this.uri();d();
                    a = a.replace(l, "\\\n");
                    this.area.value = a.replace(m, "\\n");try {
                        this.form.submit()
                    } catch ( B ) {}
                    this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                        "complete" === g.iframe.readyState && c()
                    } : this.iframe.onload = c
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            (function(d) {
                function c(a) {
                    a && a.forceBase64 && (this.supportsBinary = !1);
                    this.perMessageDeflate = a.perMessageDeflate;
                    this.usingBrowserWebSocket = v && !a.forceNode;
                    this.protocols = a.protocols;this.usingBrowserWebSocket || (f = t);g.call(this, a)
                }
                var g = e(22),
                    a = e(23),
                    b = e(31),
                    h = e(32),
                    m = e(33),
                    l = e(3)("engine.io-client:websocket"),
                    v = d.WebSocket || d.MozWebSocket;
                if ("undefined" == typeof window) try {
                        var t = e(36)
                    } catch ( u ) {}
                var f = v;
                f || "undefined" != typeof window || (f = t);
                k.exports = c;h(c, g);
                c.prototype.name = "websocket";
                c.prototype.supportsBinary = !0;
                c.prototype.doOpen = function() {
                    if (this.check()) {
                        var a = this.uri(),
                            b = this.protocols,
                            c = {
                                agent: this.agent,
                                perMessageDeflate: this.perMessageDeflate
                            };
                        c.pfx = this.pfx;
                        c.key = this.key;
                        c.passphrase = this.passphrase;
                        c.cert = this.cert;
                        c.ca = this.ca;
                        c.ciphers = this.ciphers;
                        c.rejectUnauthorized = this.rejectUnauthorized;this.extraHeaders && (c.headers = this.extraHeaders);this.localAddress && (c.localAddress = this.localAddress);try {
                            this.ws = this.usingBrowserWebSocket ? b ? new f(a, b) : new f(a) : new f(a, b, c)
                        } catch ( y ) {
                            return this.emit("error", y)
                        } void 0 === this.ws.binaryType && (this.supportsBinary = !1);
                        this.ws.supports && this.ws.supports.binary ?
                            (this.supportsBinary = !0, this.ws.binaryType = "nodebuffer") : this.ws.binaryType = "arraybuffer";this.addEventListeners()
                    }
                };
                c.prototype.addEventListeners = function() {
                    var a = this;
                    this.ws.onopen = function() {
                        a.onOpen()
                    };
                    this.ws.onclose = function() {
                        a.onClose()
                    };
                    this.ws.onmessage = function(b) {
                        a.onData(b.data)
                    };
                    this.ws.onerror = function(b) {
                        a.onError("websocket error", b)
                    }
                };
                c.prototype.write = function(b) {
                    function c() {
                        f.emit("flush");setTimeout(function() {
                            f.writable = !0;f.emit("drain")
                        }, 0)
                    }
                    var f = this;
                    this.writable = !1;
                    for (var e = b.length, g = 0, h = e; g < h; g++) !function(b) {
                            a.encodePacket(b, f.supportsBinary, function(a) {
                                if (!f.usingBrowserWebSocket) {
                                    var g = {};
                                    (b.options && (g.compress = b.options.compress), f.perMessageDeflate) && ("string" == typeof a ? d.Buffer.byteLength(a) : a.length) < f.perMessageDeflate.threshold && (g.compress = !1)
                                }
                                try {
                                    f.usingBrowserWebSocket ? f.ws.send(a) : f.ws.send(a, g)
                                } catch ( D ) {
                                    l("websocket closed before onclose event")
                                } --e || c()
                            })
                        }(b[g])
                };
                c.prototype.onClose = function() {
                    g.prototype.onClose.call(this)
                };
                c.prototype.doClose = function() {
                    "undefined" !=
                    typeof this.ws && this.ws.close()
                };
                c.prototype.uri = function() {
                    var a = this.query || {},
                        c = this.secure ? "wss" : "ws",
                        d = "";
                    this.port && ("wss" === c && 443 !== Number(this.port) || "ws" === c && 80 !== Number(this.port)) && (d = ":" + this.port);this.timestampRequests && (a[this.timestampParam] = m());this.supportsBinary || (a.b64 = 1);
                    a = b.encode(a);a.length && (a = "?" + a);
                    var f = -1 !== this.hostname.indexOf(":");
                    return c + "://" + (f ? "[" + this.hostname + "]" : this.hostname) + d + this.path + a
                };
                c.prototype.check = function() {
                    return !(!f || "__initialize" in f && this.name ===
                    c.prototype.name)
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h) {}, function(k, h) {
            var e = [].indexOf;
            k.exports = function(d, c) {
                if (e) return d.indexOf(c);
                for (var g = 0; g < d.length; ++g)
                    if (d[g] === c) return g;
                return -1
            }
        }, function(k, h) {
            (function(e) {
                var d = /^[\],:{}\s]*$/,
                    c = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    g = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    a = /(?:^|:|,)(?:\s*\[)+/g,
                    b = /^\s+/,
                    h = /\s+$/;
                k.exports = function(m) {
                    return "string" == typeof m && m ? (m = m.replace(b, "").replace(h, ""), e.JSON &&
                    JSON.parse ? JSON.parse(m) : d.test(m.replace(c, "@").replace(g, "]").replace(a, "")) ? (new Function("return " + m))() : void 0) : null
                }
            }).call(h, function() {
                return this
            }())
        }, function(k, h, e) {
            function d(a, b, c) {
                this.io = a;
                this.nsp = b;
                this.json = this;
                this.ids = 0;
                this.acks = {};
                this.receiveBuffer = [];
                this.sendBuffer = [];
                this.connected = !1;
                this.disconnected = !0;c && c.query && (this.query = c.query);this.io.autoConnect && this.open()
            }
            $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbolIterator();
            var c = "function" == typeof Symbol &&
                "symbol" == typeof Symbol.iterator ? function(a) {
                    return typeof a
                } : function(a) {
                    $jscomp.initSymbol();$jscomp.initSymbol();$jscomp.initSymbol();return a && "function" == typeof Symbol && a.constructor === Symbol && a !== Symbol.prototype ? "symbol" : typeof a
                },
                g = e(7);
            h = e(8);
            var a = e(40),
                b = e(41),
                q = e(42),
                m = e(3)("socket.io-client:socket"),
                l = e(31);
            k.exports = d;
            var v = {
                    connect: 1,
                    connect_error: 1,
                    connect_timeout: 1,
                    connecting: 1,
                    disconnect: 1,
                    error: 1,
                    reconnect: 1,
                    reconnect_attempt: 1,
                    reconnect_failed: 1,
                    reconnect_error: 1,
                    reconnecting: 1,
                    ping: 1,
                    pong: 1
                },
                t = h.prototype.emit;
            h(d.prototype);
            d.prototype.subEvents = function() {
                if (!this.subs) {
                    var a = this.io;
                    this.subs = [b(a, "open", q(this, "onopen")), b(a, "packet", q(this, "onpacket")), b(a, "close", q(this, "onclose"))]
                }
            };
            d.prototype.open = d.prototype.connect = function() {
                return this.connected ? this : (this.subEvents(), this.io.open(), "open" === this.io.readyState && this.onopen(), this.emit("connecting"), this)
            };
            d.prototype.send = function() {
                var b = a(arguments);
                return b.unshift("message"), this.emit.apply(this, b), this
            };
            d.prototype.emit = function(b) {
                if (v.hasOwnProperty(b)) return t.apply(this, arguments), this;
                var c = a(arguments),
                    d = {
                        type: g.EVENT,
                        data: c
                    };
                return d.options = {}, d.options.compress = !this.flags || !1 !== this.flags.compress, "function" == typeof c[c.length - 1] && (m("emitting packet with ack id %d", this.ids), this.acks[this.ids] = c.pop(), d.id = this.ids++), this.connected ? this.packet(d) : this.sendBuffer.push(d),
                    delete this.flags
                    , this
            };
            d.prototype.packet = function(a) {
                a.nsp = this.nsp;this.io.packet(a)
            };
            d.prototype.onopen = function() {
                if (m("transport is open - connecting"),
                        "/" !== this.nsp)
                    if (this.query) {
                        var a = "object" === c(this.query) ? l.encode(this.query) : this.query;
                        m("sending connect packet with query %s", a);this.packet({
                            type: g.CONNECT,
                            query: a
                        })
                    } else this.packet({
                            type: g.CONNECT
                        })
            };
            d.prototype.onclose = function(a) {
                m("close (%s)", a);
                this.connected = !1;
                this.disconnected = !0;
                delete this.id;
                this.emit("disconnect", a)
            };
            d.prototype.onpacket = function(a) {
                if (a.nsp === this.nsp) switch (a.type) {
                    case g.CONNECT:
                        this.onconnect();
                        break;case g.EVENT:
                        this.onevent(a);
                        break;case g.BINARY_EVENT:
                        this.onevent(a);
                        break;case g.ACK:
                        this.onack(a);
                        break;case g.BINARY_ACK:
                        this.onack(a);
                        break;case g.DISCONNECT:
                        this.ondisconnect();
                        break;case g.ERROR:
                        this.emit("error", a.data)
                }
            };
            d.prototype.onevent = function(a) {
                var b = a.data || [];
                m("emitting event %j", b);null != a.id && (m("attaching ack callback to event"), b.push(this.ack(a.id)));
                this.connected ? t.apply(this, b) : this.receiveBuffer.push(b)
            };
            d.prototype.ack = function(b) {
                var c = this,
                    d = !1;
                return function() {
                    if (!d) {
                        d = !0;
                        var f = a(arguments);
                        m("sending ack %j", f);c.packet({
                            type: g.ACK,
                            id: b,
                            data: f
                        })
                    }
                }
            };
            d.prototype.onack = function(a) {
                var b = this.acks[a.id];
                "function" == typeof b ? (m("calling ack %s with %j", a.id, a.data), b.apply(this, a.data),
                delete this.acks[a.id]
                ) : m("bad ack %s", a.id)
            };
            d.prototype.onconnect = function() {
                this.connected = !0;
                this.disconnected = !1;this.emit("connect");this.emitBuffered()
            };
            d.prototype.emitBuffered = function() {
                var a;
                for (a = 0; a < this.receiveBuffer.length; a++) t.apply(this, this.receiveBuffer[a]);
                this.receiveBuffer = [];
                for (a = 0; a < this.sendBuffer.length; a++) this.packet(this.sendBuffer[a]);
                this.sendBuffer = []
            };
            d.prototype.ondisconnect = function() {
                m("server disconnect (%s)", this.nsp);this.destroy();this.onclose("io server disconnect")
            };
            d.prototype.destroy = function() {
                if (this.subs) {
                    for (var a = 0; a < this.subs.length; a++) this.subs[a].destroy();
                    this.subs = null
                }
                this.io.destroy(this)
            };
            d.prototype.close = d.prototype.disconnect = function() {
                return this.connected && (m("performing disconnect (%s)", this.nsp), this.packet({
                        type: g.DISCONNECT
                    })), this.destroy(), this.connected && this.onclose("io client disconnect"),
                    this
            };
            d.prototype.compress = function(a) {
                return this.flags = this.flags || {}, this.flags.compress = a, this
            }
        }, function(k, h) {
            k.exports = function(e, d) {
                for (var c = [], g = (d = d || 0) || 0; g < e.length; g++) c[g - d] = e[g];
                return c
            }
        }, function(k, h) {
            k.exports = function(e, d, c) {
                return e.on(d, c), {
                        destroy: function() {
                            e.removeListener(d, c)
                        }
                }
            }
        }, function(k, h) {
            var e = [].slice;
            k.exports = function(d, c) {
                if ("string" == typeof c && (c = d[c]), "function" != typeof c)
                    throw Error("bind() requires a function");
                var g = e.call(arguments, 2);
                return function() {
                    return c.apply(d,
                        g.concat(e.call(arguments)))
                }
            }
        }, function(k, h) {
            function e(d) {
                d = d || {};
                this.ms = d.min || 100;
                this.max = d.max || 1E4;
                this.factor = d.factor || 2;
                this.jitter = 0 < d.jitter && 1 >= d.jitter ? d.jitter : 0;
                this.attempts = 0
            }
            k.exports = e;
            e.prototype.duration = function() {
                var d = this.ms * Math.pow(this.factor, this.attempts++);
                if (this.jitter) {
                    var c = Math.random(),
                        e = Math.floor(c * this.jitter * d);
                    d = 0 == (1 & Math.floor(10 * c)) ? d - e : d + e
                }
                return 0 | Math.min(d, this.max)
            };
            e.prototype.reset = function() {
                this.attempts = 0
            };
            e.prototype.setMin = function(d) {
                this.ms = d
            };
            e.prototype.setMax = function(d) {
                this.max = d
            };
            e.prototype.setJitter = function(d) {
                this.jitter = d
            }
        }])
    })
}, function(p, r, n) {
    var k = n(2),
        h = n(7),
        e = n(0);
    r.a = function(d) {
        var c = Object(k.a)({});
        c.id = d.id;
        c.stream = d.stream.stream;
        c.elementID = d.elementID;
        var g = function() {
                c.bar.display()
            },
            a = function() {
                c.bar.hide()
            },
            b = function(a, b, d, e) {
                (e ? 1 / a * b > d : 1 / a * b < d) ? (c.video.style.width = b + "px", c.video.style.height = 1 / a * b + "px", c.video.style.top = -(1 / a * b / 2 - d / 2) + "px", c.video.style.left = "0px") : (c.video.style.height = d + "px", c.video.style.width = a * d + "px", c.video.style.left = -(a * d / 2 - b / 2) + "px", c.video.style.top = "0px")
            };
        c.destroy = function() {
            c.video.pause();
            delete c.resizer;
            c.parentNode.removeChild(c.div)
        };
        c.resize = function() {
            var a = c.container.offsetWidth,
                e = c.container.offsetHeight;
            d.stream.screen || !1 === d.options.crop ? b(16 / 9, a, e, !1) : a === c.containerWidth && e === c.containerHeight || b(4 / 3, a, e, !0);
            c.containerWidth = a;
            c.containerHeight = e
        };e.a.debug("Creating URL from stream " + c.stream);
        c.streamUrl = (window.URL || webkitURL).createObjectURL(c.stream);
        c.div = document.createElement("div");c.div.setAttribute("id", "player_" + c.id);c.div.setAttribute("class", "licode_player");c.div.setAttribute("style", "width: 100%; height: 100%; position: relative; background-color: black; overflow: hidden;");!1 !== d.options.loader && (c.loader = document.createElement("img"), c.loader.setAttribute("style", "width: 16px; height: 16px; position: absolute; top: 50%; left: 50%; margin-top: -8px; margin-left: -8px"), c.loader.setAttribute("id", "back_" + c.id), c.loader.setAttribute("class",
            "licode_loader"), c.loader.setAttribute("src", c.url + "/assets/loader.gif"));
        c.video = document.createElement("video");c.video.setAttribute("id", "stream" + c.id);c.video.setAttribute("class", "licode_stream");c.video.setAttribute("style", "width: 100%; height: 100%; position: absolute");c.video.setAttribute("autoplay", "autoplay");d.stream.local && (c.video.volume = 0);
        c.container = void 0 !== c.elementID ? "object" === typeof c.elementID && "function" === typeof c.elementID.appendChild ? c.elementID : document.getElementById(c.elementID) :
            document.body;c.container.appendChild(c.div);
        c.parentNode = c.div.parentNode;c.loader && c.div.appendChild(c.loader);c.div.appendChild(c.video);
        c.containerWidth = 0;
        c.containerHeight = 0;!1 !== d.options.resizer && (c.resizer = L.ResizeSensor(c.container, c.resize), c.resize());
        !1 !== d.options.bar ? (c.bar = Object(h.a)({
            elementID: "player_" + c.id,
            id: c.id,
            stream: d.stream,
            media: c.video,
            options: d.options
        }), c.div.onmouseover = g, c.div.onmouseout = a) : c.media = c.video;
        c.video.src = c.streamUrl;return c
    }
}, function(p, r, n) {
    var k = n(2);
    r.a = function(h) {
        var e = Object(k.a)({}),
            d = 50;
        e.elementID = h.elementID;
        e.media = h.media;
        e.id = h.id;
        e.stream = h.stream;
        e.div = document.createElement("div");e.div.setAttribute("style", "width: 40%; height: 100%; max-width: 32px; position: absolute; right: 0;z-index:0;");
        e.icon = document.createElement("img");e.icon.setAttribute("id", "volume_" + e.id);e.icon.setAttribute("src", e.url + "/assets/sound48.png");e.icon.setAttribute("style", "width: 80%; height: 100%; position: absolute;");e.div.appendChild(e.icon);
        e.icon.onclick = function() {
            e.media.muted ? (e.media.muted = !1, e.icon.setAttribute("src", e.url + "/assets/sound48.png"), e.stream.local ? e.stream.stream.getAudioTracks()[0].enabled = !0 : (e.picker.value = d, e.media.volume = e.picker.value / 100)) : (e.media.muted = !0, e.icon.setAttribute("src", e.url + "/assets/mute48.png"), e.stream.local ? e.stream.stream.getAudioTracks()[0].enabled = !1 : (d = e.picker.value, e.picker.value = 0, e.media.volume = 0))
        };
        if (!e.stream.local) {
            e.picker = document.createElement("input");e.picker.setAttribute("id", "picker_" +
                e.id);
            e.picker.type = "range";
            e.picker.min = 0;
            e.picker.max = 100;
            e.picker.step = 10;
            e.picker.value = d;e.picker.setAttribute("orient", "vertical");e.div.appendChild(e.picker);
            e.media.volume = e.picker.value / 100;
            e.media.muted = !1;
            e.picker.oninput = function() {
                0 < e.picker.value ? (e.media.muted = !1, e.icon.setAttribute("src", e.url + "/assets/sound48.png")) : (e.media.muted = !0, e.icon.setAttribute("src", e.url + "/assets/mute48.png"));
                e.media.volume = e.picker.value / 100
            };
            var c = function(c) {
                e.picker.setAttribute("style", "background: transparent; width: 32px;\n                                         height: 100px; position: absolute; bottom: 90%;\n                                         z-index: 1; right: 0px; -webkit-appearance: slider-vertical;\n                                         bottom: " +
                    e.div.offsetHeight + "px; display: " + c)
            };
            e.div.onmouseover = function() {
                c("block")
            };
            e.div.onmouseout = function() {
                c("none")
            };c("none")
        }
        document.getElementById(e.elementID).appendChild(e.div);return e
    }
}, function(p, r, n) {
    var k = n(2),
        h = n(7),
        e = n(0);
    r.a = function(d) {
        var c = Object(k.a)({});
        c.id = d.id;
        c.stream = d.stream.stream;
        c.elementID = d.elementID;e.a.debug("Creating URL from stream " + c.stream);
        c.streamUrl = (window.URL || webkitURL).createObjectURL(c.stream);
        c.audio = document.createElement("audio");c.audio.setAttribute("id",
            "stream" + c.id);c.audio.setAttribute("class", "licode_stream");c.audio.setAttribute("style", "width: 100%; height: 100%; position: absolute");c.audio.setAttribute("autoplay", "autoplay");d.stream.local && (c.audio.volume = 0);
        if (void 0 !== c.elementID) {
            c.destroy = function() {
                c.audio.pause();c.parentNode.removeChild(c.div)
            };
            var g = function() {
                c.bar.display()
            };
            var a = function() {
                c.bar.hide()
            };
            c.div = document.createElement("div");c.div.setAttribute("id", "player_" + c.id);c.div.setAttribute("class", "licode_player");c.div.setAttribute("style",
                "width: 100%; height: 100%; position: relative; overflow: hidden;");
            c.container = "object" === typeof c.elementID && "function" === typeof c.elementID.appendChild ? c.elementID : document.getElementById(c.elementID);c.container.appendChild(c.div);
            c.parentNode = c.div.parentNode;c.div.appendChild(c.audio);
            !1 !== d.options.bar ? (c.bar = Object(h.a)({
                elementID: "player_" + c.id,
                id: c.id,
                stream: d.stream,
                media: c.audio,
                options: d.options
            }), c.div.onmouseover = g, c.div.onmouseout = a) : c.media = c.audio
        } else c.destroy = function() {
                c.audio.pause();
                c.parentNode.removeChild(c.audio)
            }, document.body.appendChild(c.audio), c.parentNode = document.body;
        c.audio.src = c.streamUrl;return c
    }
}, function(p, r, n) {
    r.a = function() {
        var k = {},
            h = {};
        k.add = function(e, d) {
            h[e] = d
        };
        k.get = function(e) {
            return h[e]
        };
        k.has = function(e) {
            return void 0 !== h[e]
        };
        k.forEach = function(e) {
            for (var d = Object.keys(h), c = 0; c < d.length; c += 1) {
                var g = d[c];
                e(h[g], g)
            }
        };
        k.keys = function() {
            return Object.keys(h)
        };
        k.remove = function(e) {
            delete h[e]
        };return k
    }
}, function(p, r, n) {
    p = function() {
        for (var k, h, e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/".split(""),
                d = [], c = 0; c < e.length; c += 1) d[e[c]] = c;
        var g = function() {
                if (!k || h >= k.length) return -1;
                var a = k.charCodeAt(h) & 255;
                h += 1;return a
            },
            a = function() {
                if (!k) return -1;
                for (;;) {
                    if (h >= k.length) return -1;
                    var a = k.charAt(h);
                    h += 1;
                    if (d[a]) return d[a];
                    if ("A" === a) return 0
                }
            },
            b = function(a) {
                a = a.toString(16);1 === a.length && (a = "0" + a);return unescape("%" + a)
            };
        return {
            encodeBase64: function(a) {
                var b;
                k = a;
                h = 0;
                a = "";
                var c = Array(3);
                var d = 0;
                for (b = !1; !b && -1 !== (c[0] = g());) c[1] = g(), c[2] = g(), a += e[c[0] >> 2], -1 !== c[1] ? (a += e[c[0] << 4 & 48 | c[1] >> 4], -1 !==
                    c[2] ? (a += e[c[1] << 2 & 60 | c[2] >> 6], a += e[c[2] & 63]) : (a += e[c[1] << 2 & 60], a += "\x3d", b = !0)) : (a += e[c[0] << 4 & 48], a += "\x3d", a += "\x3d", b = !0), d += 4, 76 <= d && (a += "\n", d = 0);
                return a
            },
            decodeBase64: function(c) {
                var d;
                k = c;
                h = 0;
                c = "";
                var e = Array(4);
                for (d = !1; !d && -1 !== (e[0] = a()) && -1 !== (e[1] = a());) e[2] = a(), e[3] = a(), c += b(e[0] << 2 & 255 | e[1] >> 4), -1 !== e[2] ? (c += b(e[1] << 4 & 255 | e[2] >> 2), -1 !== e[3] ? c += b(e[2] << 6 & 255 | e[3]) : d = !0) : d = !0;
                return c
            }
        }
    }();
    r.a = p
}, function(p, r, n) {
    r = n(8);
    p.exports = r.adapter = n(23)
}, function(p, r, n) {
    (function(k) {
        p.exports = function() {
            return function e(d, c, g) {
                function a(m, l) {
                    if (!c[m]) {
                        if (!d[m]) {
                            if (b) return b(m, !0);
                            l = Error("Cannot find module '" + m + "'");
                            throw l.code = "MODULE_NOT_FOUND", l;
                        }
                        l = c[m] = {
                            exports: {}
                        };d[m][0].call(l.exports, function(b) {
                            var c = d[m][1][b];
                            return a(c ? c : b)
                        }, l, l.exports, e, d, c, g)
                    }
                    return c[m].exports
                }
                for (var b = !1, k = 0; k < g.length; k++) a(g[k]);
                return a
            }({
                1: [function(e, d, c) {
                    var g = {
                        generateIdentifier: function() {
                            return Math.random().toString(36).substr(2, 10)
                        }
                    };
                    g.localCName = g.generateIdentifier();
                    g.splitLines = function(a) {
                        return a.trim().split("\n").map(function(a) {
                            return a.trim()
                        })
                    };
                    g.splitSections = function(a) {
                        return a.split("\nm\x3d").map(function(a, c) {
                            return (0 < c ? "m\x3d" + a : a).trim() + "\r\n"
                        })
                    };
                    g.matchPrefix = function(a, b) {
                        return g.splitLines(a).filter(function(a) {
                            return 0 === a.indexOf(b)
                        })
                    };
                    g.parseCandidate = function(a) {
                        a = 0 === a.indexOf("a\x3dcandidate:") ? a.substring(12).split(" ") : a.substring(10).split(" ");
                        for (var b = {
                                    foundation: a[0],
                                    component: parseInt(a[1], 10),
                                    protocol: a[2].toLowerCase(),
                                    priority: parseInt(a[3], 10),
                                    ip: a[4],
                                    port: parseInt(a[5], 10),
                                    type: a[7]
                                }, c = 8; c < a.length; c += 2) switch (a[c]) {
                            case "raddr":
                                b.relatedAddress = a[c + 1];
                                break;case "rport":
                                b.relatedPort = parseInt(a[c + 1], 10);
                                break;case "tcptype":
                                b.tcpType = a[c + 1];
                                break;default:
                                b[a[c]] = a[c + 1]
                        }
                        return b
                    };
                    g.writeCandidate = function(a) {
                        var b = [];
                        b.push(a.foundation);b.push(a.component);b.push(a.protocol.toUpperCase());b.push(a.priority);b.push(a.ip);b.push(a.port);
                        var c = a.type;
                        b.push("typ");b.push(c);"host" !== c && a.relatedAddress && a.relatedPort && (b.push("raddr"), b.push(a.relatedAddress), b.push("rport"), b.push(a.relatedPort));a.tcpType && "tcp" === a.protocol.toLowerCase() &&
                        (b.push("tcptype"), b.push(a.tcpType));a.ufrag && (b.push("ufrag"), b.push(a.ufrag));return "candidate:" + b.join(" ")
                    };
                    g.parseIceOptions = function(a) {
                        return a.substr(14).split(" ")
                    };
                    g.parseRtpMap = function(a) {
                        a = a.substr(9).split(" ");
                        var b = {
                            payloadType: parseInt(a.shift(), 10)
                        };
                        a = a[0].split("/");
                        b.name = a[0];
                        b.clockRate = parseInt(a[1], 10);
                        b.numChannels = 3 === a.length ? parseInt(a[2], 10) : 1;return b
                    };
                    g.writeRtpMap = function(a) {
                        var b = a.payloadType;
                        void 0 !== a.preferredPayloadType && (b = a.preferredPayloadType);return "a\x3drtpmap:" +
                            b + " " + a.name + "/" + a.clockRate + (1 !== a.numChannels ? "/" + a.numChannels : "") + "\r\n"
                    };
                    g.parseExtmap = function(a) {
                        a = a.substr(9).split(" ");return {
                            id: parseInt(a[0], 10),
                            direction: 0 < a[0].indexOf("/") ? a[0].split("/")[1] : "sendrecv",
                            uri: a[1]
                        }
                    };
                    g.writeExtmap = function(a) {
                        return "a\x3dextmap:" + (a.id || a.preferredId) + (a.direction && "sendrecv" !== a.direction ? "/" + a.direction : "") + " " + a.uri + "\r\n"
                    };
                    g.parseFmtp = function(a) {
                        for (var b = {}, c = a.substr(a.indexOf(" ") + 1).split(";"), d = 0; d < c.length; d++) a = c[d].trim().split("\x3d"), b[a[0].trim()] = a[1];
                        return b
                    };
                    g.writeFmtp = function(a) {
                        var b = "",
                            c = a.payloadType;
                        void 0 !== a.preferredPayloadType && (c = a.preferredPayloadType);
                        if (a.parameters && Object.keys(a.parameters).length) {
                            var d = [];
                            Object.keys(a.parameters).forEach(function(b) {
                                d.push(b + "\x3d" + a.parameters[b])
                            });
                            b += "a\x3dfmtp:" + c + " " + d.join(";") + "\r\n"
                        }
                        return b
                    };
                    g.parseRtcpFb = function(a) {
                        a = a.substr(a.indexOf(" ") + 1).split(" ");return {
                            type: a.shift(),
                            parameter: a.join(" ")
                        }
                    };
                    g.writeRtcpFb = function(a) {
                        var b = "",
                            c = a.payloadType;
                        void 0 !== a.preferredPayloadType &&
                        (c = a.preferredPayloadType);a.rtcpFeedback && a.rtcpFeedback.length && a.rtcpFeedback.forEach(function(a) {
                            b += "a\x3drtcp-fb:" + c + " " + a.type + (a.parameter && a.parameter.length ? " " + a.parameter : "") + "\r\n"
                        });return b
                    };
                    g.parseSsrcMedia = function(a) {
                        var b = a.indexOf(" "),
                            c = {
                                ssrc: parseInt(a.substr(7, b - 7), 10)
                            },
                            d = a.indexOf(":", b);
                        -1 < d ? (c.attribute = a.substr(b + 1, d - b - 1), c.value = a.substr(d + 1)) : c.attribute = a.substr(b + 1);return c
                    };
                    g.getMid = function(a) {
                        if (a = g.matchPrefix(a, "a\x3dmid:")[0]) return a.substr(6)
                    };
                    g.parseFingerprint = function(a) {
                        a = a.substr(14).split(" ");return {
                            algorithm: a[0].toLowerCase(),
                            value: a[1]
                        }
                    };
                    g.getDtlsParameters = function(a, b) {
                        return {
                            role: "auto",
                            fingerprints: g.matchPrefix(a + b, "a\x3dfingerprint:").map(g.parseFingerprint)
                        }
                    };
                    g.writeDtlsParameters = function(a, b) {
                        var c = "a\x3dsetup:" + b + "\r\n";
                        a.fingerprints.forEach(function(a) {
                            c += "a\x3dfingerprint:" + a.algorithm + " " + a.value + "\r\n"
                        });return c
                    };
                    g.getIceParameters = function(a, b) {
                        a = g.splitLines(a);
                        a = a.concat(g.splitLines(b));return {
                            usernameFragment: a.filter(function(a) {
                                return 0 ===
                                    a.indexOf("a\x3dice-ufrag:")
                            })[0].substr(12),
                            password: a.filter(function(a) {
                                return 0 === a.indexOf("a\x3dice-pwd:")
                            })[0].substr(10)
                        }
                    };
                    g.writeIceParameters = function(a) {
                        return "a\x3dice-ufrag:" + a.usernameFragment + "\r\na\x3dice-pwd:" + a.password + "\r\n"
                    };
                    g.parseRtpParameters = function(a) {
                        for (var b = {
                                    codecs: [],
                                    headerExtensions: [],
                                    fecMechanisms: [],
                                    rtcp: []
                                }, c = g.splitLines(a)[0].split(" "), d = 3; d < c.length; d++) {
                            var e = c[d],
                                k = g.matchPrefix(a, "a\x3drtpmap:" + e + " ")[0];
                            if (k) {
                                k = g.parseRtpMap(k);
                                var t = g.matchPrefix(a, "a\x3dfmtp:" +
                                    e + " ");
                                k.parameters = t.length ? g.parseFmtp(t[0]) : {};
                                k.rtcpFeedback = g.matchPrefix(a, "a\x3drtcp-fb:" + e + " ").map(g.parseRtcpFb);b.codecs.push(k);switch (k.name.toUpperCase()) {
                                case "RED":
                                case "ULPFEC":
                                    b.fecMechanisms.push(k.name.toUpperCase())
                                }
                            }
                        }
                        g.matchPrefix(a, "a\x3dextmap:").forEach(function(a) {
                            b.headerExtensions.push(g.parseExtmap(a))
                        });return b
                    };
                    g.writeRtpDescription = function(a, b) {
                        var c = "";
                        c += "m\x3d" + a + " ";
                        c += 0 < b.codecs.length ? "9" : "0";
                        c += " UDP/TLS/RTP/SAVPF ";
                        c += b.codecs.map(function(a) {
                                return void 0 !==
                                a.preferredPayloadType ? a.preferredPayloadType : a.payloadType
                            }).join(" ") + "\r\n";
                        c += "c\x3dIN IP4 0.0.0.0\r\n";
                        c += "a\x3drtcp:9 IN IP4 0.0.0.0\r\n";b.codecs.forEach(function(a) {
                            c += g.writeRtpMap(a);
                            c += g.writeFmtp(a);
                            c += g.writeRtcpFb(a)
                        });
                        var d = 0;
                        b.codecs.forEach(function(a) {
                            a.maxptime > d && (d = a.maxptime)
                        });0 < d && (c += "a\x3dmaxptime:" + d + "\r\n");
                        c += "a\x3drtcp-mux\r\n";b.headerExtensions.forEach(function(a) {
                            c += g.writeExtmap(a)
                        });return c
                    };
                    g.parseRtpEncodingParameters = function(a) {
                        var b = [],
                            c = g.parseRtpParameters(a),
                            d = -1 !== c.fecMechanisms.indexOf("RED"),
                            e = -1 !== c.fecMechanisms.indexOf("ULPFEC"),
                            k = g.matchPrefix(a, "a\x3dssrc:").map(function(a) {
                                return g.parseSsrcMedia(a)
                            }).filter(function(a) {
                                return "cname" === a.attribute
                            }),
                            t = 0 < k.length && k[0].ssrc,
                            f;
                        k = g.matchPrefix(a, "a\x3dssrc-group:FID").map(function(a) {
                            a = a.split(" ");a.shift();return a.map(function(a) {
                                return parseInt(a, 10)
                            })
                        });0 < k.length && 1 < k[0].length && k[0][0] === t && (f = k[0][1]);c.codecs.forEach(function(a) {
                            "RTX" === a.name.toUpperCase() && a.parameters.apt && (a = {
                                ssrc: t,
                                codecPayloadType: parseInt(a.parameters.apt, 10),
                                rtx: {
                                    ssrc: f
                                }
                            }, b.push(a), d && (a = JSON.parse(JSON.stringify(a)), a.fec = {
                                ssrc: f,
                                mechanism: e ? "red+ulpfec" : "red"
                            }, b.push(a)))
                        });0 === b.length && t && b.push({
                            ssrc: t
                        });
                        var u = g.matchPrefix(a, "b\x3d");
                        u.length && (u = 0 === u[0].indexOf("b\x3dTIAS:") ? parseInt(u[0].substr(7), 10) : 0 === u[0].indexOf("b\x3dAS:") ? 950 * parseInt(u[0].substr(5), 10) - 16E3 : void 0, b.forEach(function(a) {
                            a.maxBitrate = u
                        }));return b
                    };
                    g.parseRtcpParameters = function(a) {
                        var b = {},
                            c = g.matchPrefix(a, "a\x3dssrc:").map(function(a) {
                                return g.parseSsrcMedia(a)
                            }).filter(function(a) {
                                return "cname" ===
                                    a.attribute
                            })[0];
                        c && (b.cname = c.value, b.ssrc = c.ssrc);
                        c = g.matchPrefix(a, "a\x3drtcp-rsize");
                        b.reducedSize = 0 < c.length;
                        b.compound = 0 === c.length;
                        a = g.matchPrefix(a, "a\x3drtcp-mux");
                        b.mux = 0 < a.length;return b
                    };
                    g.parseMsid = function(a) {
                        var b = g.matchPrefix(a, "a\x3dmsid:");
                        if (1 === b.length) return a = b[0].substr(7).split(" "), {
                                    stream: a[0],
                                    track: a[1]
                                };
                        a = g.matchPrefix(a, "a\x3dssrc:").map(function(a) {
                            return g.parseSsrcMedia(a)
                        }).filter(function(a) {
                            return "msid" === a.attribute
                        });
                        if (0 < a.length) return a = a[0].value.split(" "),
                                {
                                    stream: a[0],
                                    track: a[1]
                        }
                    };
                    g.generateSessionId = function() {
                        return Math.random().toString().substr(2, 21)
                    };
                    g.writeSessionBoilerplate = function(a) {
                        return "v\x3d0\r\no\x3dthisisadapterortc " + (a ? a : g.generateSessionId()) + " 2 IN IP4 127.0.0.1\r\ns\x3d-\r\nt\x3d0 0\r\n"
                    };
                    g.writeMediaSection = function(a, b, c, d) {
                        b = g.writeRtpDescription(a.kind, b);
                        b += g.writeIceParameters(a.iceGatherer.getLocalParameters());
                        b += g.writeDtlsParameters(a.dtlsTransport.getLocalParameters(), "offer" === c ? "actpass" : "active");
                        b += "a\x3dmid:" +
                            a.mid + "\r\n";
                        b = a.direction ? b + ("a\x3d" + a.direction + "\r\n") : a.rtpSender && a.rtpReceiver ? b + "a\x3dsendrecv\r\n" : a.rtpSender ? b + "a\x3dsendonly\r\n" : a.rtpReceiver ? b + "a\x3drecvonly\r\n" : b + "a\x3dinactive\r\n";a.rtpSender && (c = "msid:" + d.id + " " + a.rtpSender.track.id + "\r\n", b = b + ("a\x3d" + c) + ("a\x3dssrc:" + a.sendEncodingParameters[0].ssrc + " " + c), a.sendEncodingParameters[0].rtx && (b += "a\x3dssrc:" + a.sendEncodingParameters[0].rtx.ssrc + " " + c, b += "a\x3dssrc-group:FID " + a.sendEncodingParameters[0].ssrc + " " + a.sendEncodingParameters[0].rtx.ssrc +
                            "\r\n"));
                        b += "a\x3dssrc:" + a.sendEncodingParameters[0].ssrc + " cname:" + g.localCName + "\r\n";a.rtpSender && a.sendEncodingParameters[0].rtx && (b += "a\x3dssrc:" + a.sendEncodingParameters[0].rtx.ssrc + " cname:" + g.localCName + "\r\n");return b
                    };
                    g.getDirection = function(a, b) {
                        a = g.splitLines(a);
                        for (var c = 0; c < a.length; c++) switch (a[c]) {
                            case "a\x3dsendrecv":
                            case "a\x3dsendonly":
                            case "a\x3drecvonly":
                            case "a\x3dinactive":
                                return a[c].substr(2)
                        }
                        return b ? g.getDirection(b) : "sendrecv"
                    };
                    g.getKind = function(a) {
                        return g.splitLines(a)[0].split(" ")[0].substr(2)
                    };
                    g.isRejected = function(a) {
                        return "0" === a.split(" ", 2)[1]
                    };
                    d.exports = g
                }, {}],
                2: [function(e, d, c) {
                    c = "undefined" !== typeof k ? k : "undefined" !== typeof self ? self : "undefined" !== typeof window ? window : {};
                    e = e("./adapter_factory.js");
                    d.exports = e({
                        window: c.window
                    })
                }, {
                    "./adapter_factory.js": 3
                }],
                3: [function(e, d, c) {
                    d.exports = function(c) {
                        c = c && c.window;
                        var a = e("./utils"),
                            b = a.log,
                            d = a.detectBrowser(c),
                            g = {
                                browserDetails: d,
                                extractVersion: a.extractVersion,
                                disableLog: a.disableLog,
                                disableWarnings: a.disableWarnings
                            },
                            k = e("./chrome/chrome_shim") ||
                                null,
                            n = e("./edge/edge_shim") || null,
                            t = e("./firefox/firefox_shim") || null,
                            f = e("./safari/safari_shim") || null;
                        switch (d.browser) {
                        case "chrome":
                            if (!k || !k.shimPeerConnection) {
                                b("Chrome shim is not included in this adapter release.");break
                            }
                            b("adapter.js shimming chrome.");g.browserShim = k;k.shimGetUserMedia(c);k.shimMediaStream(c);a.shimCreateObjectURL(c);k.shimSourceObject(c);k.shimPeerConnection(c);k.shimOnTrack(c);k.shimGetSendersWithDtmf(c);
                            break;case "firefox":
                            if (!t || !t.shimPeerConnection) {
                                b("Firefox shim is not included in this adapter release.");
                                break
                            }
                            b("adapter.js shimming firefox.");g.browserShim = t;t.shimGetUserMedia(c);a.shimCreateObjectURL(c);t.shimSourceObject(c);t.shimPeerConnection(c);t.shimOnTrack(c);
                            break;case "edge":
                            if (!n || !n.shimPeerConnection) {
                                b("MS edge shim is not included in this adapter release.");break
                            }
                            b("adapter.js shimming edge.");g.browserShim = n;n.shimGetUserMedia(c);a.shimCreateObjectURL(c);n.shimPeerConnection(c);n.shimReplaceTrack(c);
                            break;case "safari":
                            if (!f) {
                                b("Safari shim is not included in this adapter release.");
                                break
                            }
                            b("adapter.js shimming safari.");g.browserShim = f;a.shimCreateObjectURL(c);f.shimRTCIceServerUrls(c);f.shimCallbacksAPI(c);f.shimLocalStreamsAPI(c);f.shimRemoteStreamsAPI(c);f.shimGetUserMedia(c);
                            break;default:
                            b("Unsupported browser!")
                        }
                        return g
                    }
                }, {
                    "./chrome/chrome_shim": 4,
                    "./edge/edge_shim": 6,
                    "./firefox/firefox_shim": 9,
                    "./safari/safari_shim": 11,
                    "./utils": 12
                }],
                4: [function(e, d, c) {
                    var g = e("../utils.js"),
                        a = g.log;
                    d.exports = {
                        shimMediaStream: function(a) {
                            a.MediaStream = a.MediaStream || a.webkitMediaStream
                        },
                        shimOnTrack: function(a) {
                            "object" !== typeof a || !a.RTCPeerConnection || "ontrack" in a.RTCPeerConnection.prototype || Object.defineProperty(a.RTCPeerConnection.prototype, "ontrack", {
                                get: function() {
                                    return this._ontrack
                                },
                                set: function(b) {
                                    var c = this;
                                    this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly));this.addEventListener("track", this._ontrack = b);this.addEventListener("addstream", this._ontrackpoly = function(b) {
                                        b.stream.addEventListener("addtrack", function(d) {
                                            var e = a.RTCPeerConnection.prototype.getReceivers ? c.getReceivers().find(function(a) {
                                                return a.track.id === d.track.id
                                            }) : {
                                                track: d.track
                                            };
                                            var f = new Event("track");
                                            f.track = d.track;
                                            f.receiver = e;
                                            f.streams = [b.stream];c.dispatchEvent(f)
                                        });b.stream.getTracks().forEach(function(d) {
                                            var e = a.RTCPeerConnection.prototype.getReceivers ? c.getReceivers().find(function(a) {
                                                return a.track.id === d.id
                                            }) : {
                                                track: d
                                            };
                                            var f = new Event("track");
                                            f.track = d;
                                            f.receiver = e;
                                            f.streams = [b.stream];this.dispatchEvent(f)
                                        }.bind(this))
                                    }.bind(this))
                                }
                            })
                        },
                        shimGetSendersWithDtmf: function(a) {
                            if ("object" === typeof a && a.RTCPeerConnection && !("getSenders" in a.RTCPeerConnection.prototype) && "createDTMFSender" in a.RTCPeerConnection.prototype) {
                                a.RTCPeerConnection.prototype.getSenders = function() {
                                    return this._senders || []
                                };
                                var b = a.RTCPeerConnection.prototype.addStream,
                                    c = a.RTCPeerConnection.prototype.removeStream;
                                a.RTCPeerConnection.prototype.addTrack || (a.RTCPeerConnection.prototype.addTrack = function(b, c) {
                                    var d = this;
                                    if ("closed" === d.signalingState)
                                        throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.",
                                            "InvalidStateError");
                                    var e = [].slice.call(arguments, 1);
                                    if (1 !== e.length || !e[0].getTracks().find(function(a) {
                                                return a === b
                                            }))
                                        throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
                                    d._senders = d._senders || [];
                                    if (d._senders.find(function(a) {
                                                return a.track === b
                                            }))
                                        throw new DOMException("Track already exists.", "InvalidAccessError");
                                    d._streams = d._streams || {};
                                    (e = d._streams[c.id]) ? (e.addTrack(b), d.removeStream(e)) :
                                        (e = new a.MediaStream([b]), d._streams[c.id] = e);d.addStream(e);
                                    e = {
                                        track: b,
                                        get dtmf() {
                                            void 0 === this._dtmf && (this._dtmf = "audio" === b.kind ? d.createDTMFSender(b) : null);return this._dtmf
                                        }
                                    };d._senders.push(e);return e
                                });
                                a.RTCPeerConnection.prototype.addStream = function(a) {
                                    var c = this;
                                    c._senders = c._senders || [];b.apply(c, [a]);a.getTracks().forEach(function(a) {
                                        c._senders.push({
                                            track: a,
                                            get dtmf() {
                                                void 0 === this._dtmf && (this._dtmf = "audio" === a.kind ? c.createDTMFSender(a) : null);return this._dtmf
                                            }
                                        })
                                    })
                                };
                                a.RTCPeerConnection.prototype.removeStream = function(a) {
                                    var b = this;
                                    b._senders = b._senders || [];c.apply(b, [a]);a.getTracks().forEach(function(a) {
                                        var c = b._senders.find(function(b) {
                                            return b.track === a
                                        });
                                        c && b._senders.splice(b._senders.indexOf(c), 1)
                                    })
                                }
                            } else if ("object" === typeof a && a.RTCPeerConnection && "getSenders" in a.RTCPeerConnection.prototype && "createDTMFSender" in a.RTCPeerConnection.prototype && a.RTCRtpSender && !("dtmf" in a.RTCRtpSender.prototype)) {
                                var d = a.RTCPeerConnection.prototype.getSenders;
                                a.RTCPeerConnection.prototype.getSenders = function() {
                                    var a = this,
                                        b = d.apply(a, []);
                                    b.forEach(function(b) {
                                        b._pc = a
                                    });return b
                                };Object.defineProperty(a.RTCRtpSender.prototype, "dtmf", {
                                    get: function() {
                                        void 0 === this._dtmf && (this._dtmf = "audio" === this.track.kind ? this._pc.createDTMFSender(this.track) : null);return this._dtmf
                                    }
                                })
                            }
                        },
                        shimSourceObject: function(a) {
                            var b = a && a.URL;
                            "object" === typeof a && (!a.HTMLMediaElement || "srcObject" in a.HTMLMediaElement.prototype || Object.defineProperty(a.HTMLMediaElement.prototype, "srcObject", {
                                get: function() {
                                    return this._srcObject
                                },
                                set: function(a) {
                                    var c = this;
                                    this._srcObject = a;this.src && b.revokeObjectURL(this.src);
                                    a ? (this.src = b.createObjectURL(a), a.addEventListener("addtrack", function() {
                                        c.src && b.revokeObjectURL(c.src);
                                        c.src = b.createObjectURL(a)
                                    }), a.addEventListener("removetrack", function() {
                                        c.src && b.revokeObjectURL(c.src);
                                        c.src = b.createObjectURL(a)
                                    })) : this.src = ""
                                }
                            }))
                        },
                        shimPeerConnection: function(b) {
                            var c = g.detectBrowser(b);
                            if (b.RTCPeerConnection) {
                                var d = b.RTCPeerConnection;
                                b.RTCPeerConnection = function(a, b) {
                                    if (a && a.iceServers) {
                                        for (var c = [], e = 0; e < a.iceServers.length; e++) {
                                            var f = a.iceServers[e];
                                            !f.hasOwnProperty("urls") && f.hasOwnProperty("url") ? (console.warn("RTCIceServer.url is deprecated! Use urls instead."), f = JSON.parse(JSON.stringify(f)), f.urls = f.url, c.push(f)) : c.push(a.iceServers[e])
                                        }
                                        a.iceServers = c
                                    }
                                    return new d(a, b)
                                };
                                b.RTCPeerConnection.prototype = d.prototype;Object.defineProperty(b.RTCPeerConnection, "generateCertificate", {
                                    get: function() {
                                        return d.generateCertificate
                                    }
                                })
                            } else b.RTCPeerConnection = function(c, d) {
                                    a("PeerConnection");c && c.iceTransportPolicy && (c.iceTransports = c.iceTransportPolicy);return new b.webkitRTCPeerConnection(c, d)
                                }, b.RTCPeerConnection.prototype = b.webkitRTCPeerConnection.prototype, b.webkitRTCPeerConnection.generateCertificate && Object.defineProperty(b.RTCPeerConnection, "generateCertificate", {
                                    get: function() {
                                        return b.webkitRTCPeerConnection.generateCertificate
                                    }
                                });
                            var e = b.RTCPeerConnection.prototype.getStats;
                            b.RTCPeerConnection.prototype.getStats = function(a, b, c) {
                                var d = this,
                                    f = arguments;
                                if (0 < arguments.length && "function" === typeof a) return e.apply(this,
                                        arguments);
                                if (0 === e.length && (0 === arguments.length || "function" !== typeof arguments[0])) return e.apply(this, []);
                                var g = function(a) {
                                        var b = {};
                                        a.result().forEach(function(a) {
                                            var c = {
                                                id: a.id,
                                                timestamp: a.timestamp,
                                                type: {
                                                        localcandidate: "local-candidate",
                                                        remotecandidate: "remote-candidate"
                                                    }[a.type] || a.type
                                            };
                                            a.names().forEach(function(b) {
                                                c[b] = a.stat(b)
                                            });
                                            b[c.id] = c
                                        });return b
                                    },
                                    k = function(a) {
                                        return new Map(Object.keys(a).map(function(b) {
                                            return [b, a[b]]
                                        }))
                                    };
                                return 2 <= arguments.length ? e.apply(this, [function(a) {
                                    f[1](k(g(a)))
                                },
                                    arguments[0]]) : (new Promise(function(a, b) {
                                    e.apply(d, [function(b) {
                                        a(k(g(b)))
                                    }, b])
                                })).then(b, c)
                            };51 > c.version && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(a) {
                                var c = b.RTCPeerConnection.prototype[a];
                                b.RTCPeerConnection.prototype[a] = function() {
                                    var a = arguments,
                                        b = this,
                                        d = new Promise(function(d, e) {
                                            c.apply(b, [a[0], d, e])
                                        });
                                    return 2 > a.length ? d : d.then(function() {
                                        a[1].apply(null, [])
                                    }, function(b) {
                                        3 <= a.length && a[2].apply(null, [b])
                                    })
                                }
                            });52 > c.version && ["createOffer", "createAnswer"].forEach(function(a) {
                                var c = b.RTCPeerConnection.prototype[a];
                                b.RTCPeerConnection.prototype[a] = function() {
                                    var a = this;
                                    if (1 > arguments.length || 1 === arguments.length && "object" === typeof arguments[0]) {
                                        var b = 1 === arguments.length ? arguments[0] : void 0;
                                        return new Promise(function(d, e) {
                                            c.apply(a, [d, e, b])
                                        })
                                    }
                                    return c.apply(this, arguments)
                                }
                            });["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(a) {
                                var c = b.RTCPeerConnection.prototype[a];
                                b.RTCPeerConnection.prototype[a] = function() {
                                    arguments[0] = new ("addIceCandidate" ===
                                    a ? b.RTCIceCandidate : b.RTCSessionDescription)(arguments[0]);return c.apply(this, arguments)
                                }
                            });
                            var k = b.RTCPeerConnection.prototype.addIceCandidate;
                            b.RTCPeerConnection.prototype.addIceCandidate = function() {
                                return arguments[0] ? k.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                            }
                        },
                        shimGetUserMedia: e("./getusermedia")
                    }
                }, {
                    "../utils.js": 12,
                    "./getusermedia": 5
                }],
                5: [function(e, d, c) {
                    var g = e("../utils.js"),
                        a = g.log;
                    d.exports = function(b) {
                        var c = g.detectBrowser(b),
                            d = b && b.navigator,
                            e = function(a) {
                                if ("object" !== typeof a || a.mandatory || a.optional) return a;
                                var b = {};
                                Object.keys(a).forEach(function(c) {
                                    if ("require" !== c && "advanced" !== c && "mediaSource" !== c) {
                                        var d = "object" === typeof a[c] ? a[c] : {
                                            ideal: a[c]
                                        };
                                        void 0 !== d.exact && "number" === typeof d.exact && (d.min = d.max = d.exact);
                                        var e = function(a, b) {
                                            return a ? a + b.charAt(0).toUpperCase() + b.slice(1) : "deviceId" === b ? "sourceId" : b
                                        };
                                        if (void 0 !== d.ideal) {
                                            b.optional = b.optional || [];
                                            var f = {};
                                            "number" === typeof d.ideal ? (f[e("min", c)] = d.ideal, b.optional.push(f),
                                            f = {}, f[e("max", c)] = d.ideal) : f[e("", c)] = d.ideal;b.optional.push(f)
                                        }
                                        void 0 !== d.exact && "number" !== typeof d.exact ? (b.mandatory = b.mandatory || {}, b.mandatory[e("", c)] = d.exact) : ["min", "max"].forEach(function(a) {
                                            void 0 !== d[a] && (b.mandatory = b.mandatory || {}, b.mandatory[e(a, c)] = d[a])
                                        })
                                    }
                                });a.advanced && (b.optional = (b.optional || []).concat(a.advanced));return b
                            },
                            k = function(b, f) {
                                if ((b = JSON.parse(JSON.stringify(b))) && "object" === typeof b.audio) {
                                    var g = function(a, b, c) {
                                        b in a && !(c in a) && (a[c] = a[b],
                                        delete a[b]
                                        )
                                    };
                                    b = JSON.parse(JSON.stringify(b));
                                    g(b.audio, "autoGainControl", "googAutoGainControl");g(b.audio, "noiseSuppression", "googNoiseSuppression");
                                    b.audio = e(b.audio)
                                }
                                if (b && "object" === typeof b.video) {
                                    var k = b.video.facingMode;
                                    k = k && ("object" === typeof k ? k : {
                                        ideal: k
                                    });
                                    g = 61 > c.version;
                                    if (!(!k || "user" !== k.exact && "environment" !== k.exact && "user" !== k.ideal && "environment" !== k.ideal || d.mediaDevices.getSupportedConstraints && d.mediaDevices.getSupportedConstraints().facingMode && !g)) {
                                        delete b.video.facingMode;
                                        if ("environment" === k.exact || "environment" === k.ideal) var l = ["back", "rear"];
                                        else if ("user" === k.exact || "user" === k.ideal)
                                            l = ["front"];
                                        if (l) return d.mediaDevices.enumerateDevices().then(function(c) {
                                                c = c.filter(function(a) {
                                                    return "videoinput" === a.kind
                                                });
                                                var d = c.find(function(a) {
                                                    return l.some(function(b) {
                                                        return -1 !== a.label.toLowerCase().indexOf(b)
                                                    })
                                                });
                                                !d && c.length && -1 !== l.indexOf("back") && (d = c[c.length - 1]);d && (b.video.deviceId = k.exact ? {
                                                    exact: d.deviceId
                                                } : {
                                                    ideal: d.deviceId
                                                });
                                                b.video = e(b.video);a("chrome: " + JSON.stringify(b));return f(b)
                                            })
                                    }
                                    b.video = e(b.video)
                                }
                                a("chrome: " +
                                    JSON.stringify(b));return f(b)
                            },
                            t = function(a) {
                                return {
                                    name: {
                                            PermissionDeniedError: "NotAllowedError",
                                            InvalidStateError: "NotReadableError",
                                            DevicesNotFoundError: "NotFoundError",
                                            ConstraintNotSatisfiedError: "OverconstrainedError",
                                            TrackStartError: "NotReadableError",
                                            MediaDeviceFailedDueToShutdown: "NotReadableError",
                                            MediaDeviceKillSwitchOn: "NotReadableError"
                                        }[a.name] || a.name,
                                    message: a.message,
                                    constraint: a.constraintName,
                                    toString: function() {
                                        return this.name + (this.message && ": ") + this.message
                                    }
                                }
                            };
                        d.getUserMedia = function(a, b, c) {
                            k(a, function(a) {
                                d.webkitGetUserMedia(a, b, function(a) {
                                    c(t(a))
                                })
                            })
                        };
                        var f = function(a) {
                            return new Promise(function(b, c) {
                                d.getUserMedia(a, b, c)
                            })
                        };
                        d.mediaDevices || (d.mediaDevices = {
                            getUserMedia: f,
                            enumerateDevices: function() {
                                return new Promise(function(a) {
                                    var c = {
                                        audio: "audioinput",
                                        video: "videoinput"
                                    };
                                    return b.MediaStreamTrack.getSources(function(b) {
                                        a(b.map(function(a) {
                                            return {
                                                label: a.label,
                                                kind: c[a.kind],
                                                deviceId: a.id,
                                                groupId: ""
                                            }
                                        }))
                                    })
                                })
                            },
                            getSupportedConstraints: function() {
                                return {
                                    deviceId: !0,
                                    echoCancellation: !0,
                                    facingMode: !0,
                                    frameRate: !0,
                                    height: !0,
                                    width: !0
                                }
                            }
                        });
                        if (d.mediaDevices.getUserMedia) {
                            var u = d.mediaDevices.getUserMedia.bind(d.mediaDevices);
                            d.mediaDevices.getUserMedia = function(a) {
                                return k(a, function(a) {
                                    return u(a).then(function(b) {
                                        if (a.audio && !b.getAudioTracks().length || a.video && !b.getVideoTracks().length)
                                            throw b.getTracks().forEach(function(a) {
                                                a.stop()
                                            }), new DOMException("", "NotFoundError");
                                        return b
                                    }, function(a) {
                                        return Promise.reject(t(a))
                                    })
                                })
                            }
                        } else
                            d.mediaDevices.getUserMedia = function(a) {
                                return f(a)
                            };
                        "undefined" === typeof d.mediaDevices.addEventListener && (d.mediaDevices.addEventListener = function() {
                            a("Dummy mediaDevices.addEventListener called.")
                        });"undefined" === typeof d.mediaDevices.removeEventListener && (d.mediaDevices.removeEventListener = function() {
                            a("Dummy mediaDevices.removeEventListener called.")
                        })
                    }
                }, {
                    "../utils.js": 12
                }],
                6: [function(e, d, c) {
                    var g = e("../utils"),
                        a = e("./rtcpeerconnection_shim");
                    d.exports = {
                        shimGetUserMedia: e("./getusermedia"),
                        shimPeerConnection: function(b) {
                            var c = g.detectBrowser(b);
                            if (b.RTCIceGatherer && (b.RTCIceCandidate || (b.RTCIceCandidate = function(a) {
                                        return a
                                    }), b.RTCSessionDescription || (b.RTCSessionDescription = function(a) {
                                        return a
                                    }), 15025 > c.version)) {
                                var d = Object.getOwnPropertyDescriptor(b.MediaStreamTrack.prototype, "enabled");
                                Object.defineProperty(b.MediaStreamTrack.prototype, "enabled", {
                                    set: function(a) {
                                        d.set.call(this, a);
                                        var b = new Event("enabled");
                                        b.enabled = a;this.dispatchEvent(b)
                                    }
                                })
                            }
                            b.RTCPeerConnection = a(b, c.version)
                        },
                        shimReplaceTrack: function(a) {
                            !a.RTCRtpSender ||
                            "replaceTrack" in a.RTCRtpSender.prototype || (a.RTCRtpSender.prototype.replaceTrack = a.RTCRtpSender.prototype.setTrack)
                        }
                    }
                }, {
                    "../utils": 12,
                    "./getusermedia": 7,
                    "./rtcpeerconnection_shim": 8
                }],
                7: [function(e, d, c) {
                    d.exports = function(c) {
                        c = c && c.navigator;
                        var a = function(a) {
                                return {
                                    name: {
                                            PermissionDeniedError: "NotAllowedError"
                                        }[a.name] || a.name,
                                    message: a.message,
                                    constraint: a.constraint,
                                    toString: function() {
                                        return this.name
                                    }
                                }
                            },
                            b = c.mediaDevices.getUserMedia.bind(c.mediaDevices);
                        c.mediaDevices.getUserMedia = function(c) {
                            return b(c).catch(function(b) {
                                return Promise.reject(a(b))
                            })
                        }
                    }
                },
                    {}],
                8: [function(e, d, c) {
                    function g(a) {
                        var b = a.filter(function(a) {
                                return "audio" === a.kind
                            }),
                            c = a.filter(function(a) {
                                return "video" === a.kind
                            });
                        for (a = []; b.length || c.length;) b.length && a.push(b.shift()), c.length && a.push(c.shift());
                        return a
                    }
                    function a(a, b) {
                        var c = !1;
                        a = JSON.parse(JSON.stringify(a));return a.filter(function(a) {
                            if (a && (a.urls || a.url)) {
                                var d = a.urls || a.url;
                                a.url && !a.urls && console.warn("RTCIceServer.url is deprecated! Use urls instead.");
                                var e = "string" === typeof d;
                                e && (d = [d]);
                                d = d.filter(function(a) {
                                    return 0 !==
                                    a.indexOf("turn:") || -1 === a.indexOf("transport\x3dudp") || -1 !== a.indexOf("turn:[") || c ? 0 === a.indexOf("stun:") && 14393 <= b : c = !0
                                });
                                delete a.url;
                                a.urls = e ? d[0] : d;return !!d.length
                            }
                            return !1
                        })
                    }
                    function b(a, b) {
                        var c = {
                                codecs: [],
                                headerExtensions: [],
                                fecMechanisms: []
                            },
                            d = function(a, b) {
                                a = parseInt(a, 10);
                                for (var c = 0; c < b.length; c++)
                                    if (b[c].payloadType === a || b[c].preferredPayloadType === a) return b[c]
                            },
                            e = function(a, b, c, e) {
                                a = d(a.parameters.apt, c);
                                b = d(b.parameters.apt, e);return a && b && a.name.toLowerCase() === b.name.toLowerCase()
                            };
                        a.codecs.forEach(function(d) {
                            for (var f = 0; f < b.codecs.length; f++) {
                                var g = b.codecs[f];
                                if (d.name.toLowerCase() === g.name.toLowerCase() && d.clockRate === g.clockRate && ("rtx" !== d.name.toLowerCase() || !d.parameters || !g.parameters.apt || e(d, g, a.codecs, b.codecs))) {
                                    g = JSON.parse(JSON.stringify(g));
                                    g.numChannels = Math.min(d.numChannels, g.numChannels);c.codecs.push(g);
                                    g.rtcpFeedback = g.rtcpFeedback.filter(function(a) {
                                        for (var b = 0; b < d.rtcpFeedback.length; b++)
                                            if (d.rtcpFeedback[b].type === a.type && d.rtcpFeedback[b].parameter ===
                                                    a.parameter) return !0;
                                        return !1
                                    });break
                                }
                            }
                        });a.headerExtensions.forEach(function(a) {
                            for (var d = 0; d < b.headerExtensions.length; d++) {
                                var e = b.headerExtensions[d];
                                if (a.uri === e.uri) {
                                    c.headerExtensions.push(e);break
                                }
                            }
                        });return c
                    }
                    function k(a, b, c) {
                        return -1 !== {
                                offer: {
                                    setLocalDescription: ["stable", "have-local-offer"],
                                    setRemoteDescription: ["stable", "have-remote-offer"]
                                },
                                answer: {
                                    setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
                                    setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
                                }
                            }[b][a].indexOf(c)
                    }
                    var m = e("sdp");
                    d.exports = function(c, d) {
                        var e = function(b) {
                            var e = this,
                                f = document.createDocumentFragment();
                            ["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function(a) {
                                e[a] = f[a].bind(f)
                            });
                            this.needNegotiation = !1;
                            this.canTrickleIceCandidates = this.ondatachannel = this.onnegotiationneeded = this.onicegatheringstatechange = this.oniceconnectionstatechange = this.onsignalingstatechange = this.onremovestream = this.ontrack = this.onaddstream = this.onicecandidate = null;
                            this.localStreams = [];
                            this.remoteStreams = [];
                            this.getLocalStreams = function() {
                                return e.localStreams
                            };
                            this.getRemoteStreams = function() {
                                return e.remoteStreams
                            };
                            this.localDescription = new c.RTCSessionDescription({
                                type: "",
                                sdp: ""
                            });
                            this.remoteDescription = new c.RTCSessionDescription({
                                type: "",
                                sdp: ""
                            });
                            this.signalingState = "stable";
                            this.iceGatheringState = this.iceConnectionState = "new";
                            this.iceOptions = {
                                gatherPolicy: "all",
                                iceServers: []
                            };
                            if (b && b.iceTransportPolicy) switch (b.iceTransportPolicy) {
                                case "all":
                                case "relay":
                                    this.iceOptions.gatherPolicy = b.iceTransportPolicy
                            }
                            this.usingBundle = b && "max-bundle" === b.bundlePolicy;b && b.iceServers && (this.iceOptions.iceServers = a(b.iceServers, d));
                            this._config = b || {};
                            this.transceivers = [];
                            this._localIceCandidatesBuffer = [];
                            this._sdpSessionId = m.generateSessionId()
                        };
                        e.prototype._emitGatheringStateChange = function() {
                            var a = new Event("icegatheringstatechange");
                            this.dispatchEvent(a);
                            if (null !== this.onicegatheringstatechange) this.onicegatheringstatechange(a)
                        };
                        e.prototype._emitBufferedCandidates = function() {
                            var a = this,
                                b = m.splitSections(a.localDescription.sdp);
                            this._localIceCandidatesBuffer.forEach(function(c) {
                                if (c.candidate && 0 !== Object.keys(c.candidate).length)
                                    b[c.candidate.sdpMLineIndex + 1] += "a\x3d" + c.candidate.candidate + "\r\n";else
                                    for (var d = 1; d < b.length; d++) -1 === b[d].indexOf("\r\na\x3dend-of-candidates\r\n") && (b[d] += "a\x3dend-of-candidates\r\n");
                                a.localDescription.sdp = b.join("");a.dispatchEvent(c);
                                if (null !== a.onicecandidate) a.onicecandidate(c);
                                !c.candidate && "complete" !== a.iceGatheringState && a.transceivers.every(function(a) {
                                    return a.iceGatherer && "completed" ===
                                        a.iceGatherer.state
                                }) && "complete" !== a.iceGatheringStateChange && (a.iceGatheringState = "complete", a._emitGatheringStateChange())
                            });
                            this._localIceCandidatesBuffer = []
                        };
                        e.prototype.getConfiguration = function() {
                            return this._config
                        };
                        e.prototype._createTransceiver = function(a) {
                            var b = 0 < this.transceivers.length;
                            a = {
                                track: null,
                                iceGatherer: null,
                                iceTransport: null,
                                dtlsTransport: null,
                                localCapabilities: null,
                                remoteCapabilities: null,
                                rtpSender: null,
                                rtpReceiver: null,
                                kind: a,
                                mid: null,
                                sendEncodingParameters: null,
                                recvEncodingParameters: null,
                                stream: null,
                                wantReceive: !0
                            };
                            this.usingBundle && b ? (a.iceTransport = this.transceivers[0].iceTransport, a.dtlsTransport = this.transceivers[0].dtlsTransport) : (b = this._createIceAndDtlsTransports(), a.iceTransport = b.iceTransport, a.dtlsTransport = b.dtlsTransport);this.transceivers.push(a);return a
                        };
                        e.prototype.addTrack = function(a, b) {
                            for (var d, e = 0; e < this.transceivers.length; e++) this.transceivers[e].track || this.transceivers[e].kind !== a.kind || (d = this.transceivers[e]);
                            d || (d = this._createTransceiver(a.kind));
                            d.track = a;
                            d.stream = b;
                            d.rtpSender = new c.RTCRtpSender(a, d.dtlsTransport);this._maybeFireNegotiationNeeded();return d.rtpSender
                        };
                        e.prototype.addStream = function(a) {
                            var b = this;
                            if (15025 <= d) this.localStreams.push(a), a.getTracks().forEach(function(c) {
                                    b.addTrack(c, a)
                                });
                            else {
                                var c = a.clone();
                                a.getTracks().forEach(function(a, b) {
                                    var d = c.getTracks()[b];
                                    a.addEventListener("enabled", function(a) {
                                        d.enabled = a.enabled
                                    })
                                });c.getTracks().forEach(function(a) {
                                    b.addTrack(a, c)
                                });this.localStreams.push(c)
                            }
                            this._maybeFireNegotiationNeeded()
                        };
                        e.prototype.removeStream = function(a) {
                            a = this.localStreams.indexOf(a);-1 < a && (this.localStreams.splice(a, 1), this._maybeFireNegotiationNeeded())
                        };
                        e.prototype.getSenders = function() {
                            return this.transceivers.filter(function(a) {
                                return !!a.rtpSender
                            }).map(function(a) {
                                return a.rtpSender
                            })
                        };
                        e.prototype.getReceivers = function() {
                            return this.transceivers.filter(function(a) {
                                return !!a.rtpReceiver
                            }).map(function(a) {
                                return a.rtpReceiver
                            })
                        };
                        e.prototype._createIceGatherer = function(a, b) {
                            var d = this,
                                e = new c.RTCIceGatherer(d.iceOptions);
                            e.onlocalcandidate = function(c) {
                                var f = new Event("icecandidate");
                                f.candidate = {
                                    sdpMid: a,
                                    sdpMLineIndex: b
                                };
                                var g = c.candidate;
                                (c = !g || 0 === Object.keys(g).length) ? void 0 === e.state && (e.state = "completed") : (g.component = 1, f.candidate.candidate = m.writeCandidate(g));
                                g = m.splitSections(d.localDescription.sdp);
                                g[f.candidate.sdpMLineIndex + 1] = c ? g[f.candidate.sdpMLineIndex + 1] + "a\x3dend-of-candidates\r\n" : g[f.candidate.sdpMLineIndex + 1] + ("a\x3d" + f.candidate.candidate + "\r\n");
                                d.localDescription.sdp = g.join("");
                                g = (d._pendingOffer ?
                                    d._pendingOffer : d.transceivers).every(function(a) {
                                    return a.iceGatherer && "completed" === a.iceGatherer.state
                                });switch (d.iceGatheringState) {
                                case "new":
                                    c || d._localIceCandidatesBuffer.push(f);c && g && d._localIceCandidatesBuffer.push(new Event("icecandidate"));
                                    break;case "gathering":
                                    d._emitBufferedCandidates();
                                    if (!c && (d.dispatchEvent(f), null !== d.onicecandidate)) d.onicecandidate(f);
                                    if (g) {
                                        d.dispatchEvent(new Event("icecandidate"));
                                        if (null !== d.onicecandidate) d.onicecandidate(new Event("icecandidate"));
                                        d.iceGatheringState = "complete";d._emitGatheringStateChange()
                                    }
                                }
                            };return e
                        };
                        e.prototype._createIceAndDtlsTransports = function() {
                            var a = this,
                                b = new c.RTCIceTransport(null);
                            b.onicestatechange = function() {
                                a._updateConnectionState()
                            };
                            var d = new c.RTCDtlsTransport(b);
                            d.ondtlsstatechange = function() {
                                a._updateConnectionState()
                            };
                            d.onerror = function() {
                                Object.defineProperty(d, "state", {
                                    value: "failed",
                                    writable: !0
                                });a._updateConnectionState()
                            };return {
                                iceTransport: b,
                                dtlsTransport: d
                            }
                        };
                        e.prototype._disposeIceAndDtlsTransports = function(a) {
                            var b = this.transceivers[a].iceGatherer;
                            b && (
                            delete b.onlocalcandidate
                            ,
                            delete this.transceivers[a].iceGatherer
                            );
                            if (b = this.transceivers[a].iceTransport)
                                delete b.onicestatechange
                                ,
                                delete this.transceivers[a].iceTransport;
                            if (b = this.transceivers[a].dtlsTransport)
                                delete b.ondtlssttatechange
                                ,
                                delete b.onerror
                                ,
                                delete this.transceivers[a].dtlsTransport
                        };
                        e.prototype._transceive = function(a, c, e) {
                            var f = b(a.localCapabilities, a.remoteCapabilities);
                            c && a.rtpSender && (f.encodings = a.sendEncodingParameters, f.rtcp = {
                                cname: m.localCName,
                                compound: a.rtcpParameters.compound
                            }, a.recvEncodingParameters.length && (f.rtcp.ssrc = a.recvEncodingParameters[0].ssrc), a.rtpSender.send(f));e && a.rtpReceiver && ("video" === a.kind && a.recvEncodingParameters && 15019 > d && a.recvEncodingParameters.forEach(function(a) {
                                delete a.rtx
                            }), f.encodings = a.recvEncodingParameters, f.rtcp = {
                                cname: a.rtcpParameters.cname,
                                compound: a.rtcpParameters.compound
                            }, a.sendEncodingParameters.length && (f.rtcp.ssrc = a.sendEncodingParameters[0].ssrc), a.rtpReceiver.receive(f))
                        };
                        e.prototype.setLocalDescription = function(a) {
                            var d = this;
                            if (!k("setLocalDescription", a.type, this.signalingState)) {
                                var e = Error("Can not set local " + a.type + " in state " + this.signalingState);
                                e.name = "InvalidStateError";2 < arguments.length && "function" === typeof arguments[2] && c.setTimeout(arguments[2], 0, e);return Promise.reject(e)
                            }
                            if ("offer" === a.type) {
                                if (this._pendingOffer) {
                                    e = m.splitSections(a.sdp);
                                    var f = e.shift();
                                    e.forEach(function(a, b) {
                                        a = m.parseRtpParameters(a);
                                        d._pendingOffer[b].localCapabilities = a
                                    });
                                    this.transceivers = this._pendingOffer;
                                    delete this._pendingOffer
                                }
                            } else if ("answer" === a.type) {
                                e = m.splitSections(d.remoteDescription.sdp);
                                f = e.shift();
                                var g = 0 < m.matchPrefix(f, "a\x3dice-lite").length;
                                e.forEach(function(a, c) {
                                    var e = d.transceivers[c],
                                        k = e.iceGatherer,
                                        l = e.iceTransport,
                                        q = e.dtlsTransport,
                                        u = e.localCapabilities,
                                        n = e.remoteCapabilities;
                                    if (!m.isRejected(a) && !e.isDatachannel) {
                                        var p = m.getIceParameters(a, f);
                                        a = m.getDtlsParameters(a, f);g && (a.role = "server");d.usingBundle && 0 !== c || (l.start(k, p, g ? "controlling" : "controlled"), q.start(a));
                                        c = b(u,
                                            n);d._transceive(e, 0 < c.codecs.length, !1)
                                    }
                                })
                            }
                            this.localDescription = {
                                type: a.type,
                                sdp: a.sdp
                            };switch (a.type) {
                            case "offer":
                                this._updateSignalingState("have-local-offer");
                                break;case "answer":
                                this._updateSignalingState("stable");
                                break;default:
                                throw new TypeError('unsupported type "' + a.type + '"');
                            }
                            var l = 1 < arguments.length && "function" === typeof arguments[1];
                            if (l) {
                                var q = arguments[1];
                                c.setTimeout(function() {
                                    q();"new" === d.iceGatheringState && (d.iceGatheringState = "gathering", d._emitGatheringStateChange());d._emitBufferedCandidates()
                                },
                                    0)
                            }
                            e = Promise.resolve();e.then(function() {
                                l || ("new" === d.iceGatheringState && (d.iceGatheringState = "gathering", d._emitGatheringStateChange()), c.setTimeout(d._emitBufferedCandidates.bind(d), 500))
                            });return e
                        };
                        e.prototype.setRemoteDescription = function(a) {
                            var b = this;
                            if (!k("setRemoteDescription", a.type, this.signalingState)) {
                                var e = Error("Can not set remote " + a.type + " in state " + this.signalingState);
                                e.name = "InvalidStateError";2 < arguments.length && "function" === typeof arguments[2] && c.setTimeout(arguments[2], 0,
                                    e);return Promise.reject(e)
                            }
                            var f = {},
                                g = [];
                            e = m.splitSections(a.sdp);
                            var l = e.shift(),
                                q = 0 < m.matchPrefix(l, "a\x3dice-lite").length,
                                n = 0 < m.matchPrefix(l, "a\x3dgroup:BUNDLE ").length;
                            this.usingBundle = n;
                            var p = m.matchPrefix(l, "a\x3dice-options:")[0];
                            this.canTrickleIceCandidates = p ? 0 <= p.substr(14).split(" ").indexOf("trickle") : !1;e.forEach(function(e, k) {
                                var u = m.splitLines(e),
                                    p = m.getKind(e),
                                    t = m.isRejected(e),
                                    w = u[0].substr(2).split(" ")[2];
                                u = m.getDirection(e, l);
                                var r = m.parseMsid(e),
                                    C = m.getMid(e) || m.generateIdentifier();
                                if ("application" === p && "DTLS/SCTP" === w)
                                    b.transceivers[k] = {
                                        mid: C,
                                        isDatachannel: !0
                                    };
                                else {
                                    var x = m.parseRtpParameters(e);
                                    if (!t) {
                                        var v = m.getIceParameters(e, l);
                                        var y = m.getDtlsParameters(e, l);
                                        y.role = "client"
                                    }
                                    w = m.parseRtpEncodingParameters(e);
                                    var D = m.parseRtcpParameters(e),
                                        B = 0 < m.matchPrefix(e, "a\x3dend-of-candidates", l).length;
                                    e = m.matchPrefix(e, "a\x3dcandidate:").map(function(a) {
                                        return m.parseCandidate(a)
                                    }).filter(function(a) {
                                        return "1" === a.component || 1 === a.component
                                    });("offer" === a.type || "answer" === a.type) &&
                                    !t && n && 0 < k && b.transceivers[k] && (b._disposeIceAndDtlsTransports(k), b.transceivers[k].iceGatherer = b.transceivers[0].iceGatherer, b.transceivers[k].iceTransport = b.transceivers[0].iceTransport, b.transceivers[k].dtlsTransport = b.transceivers[0].dtlsTransport, b.transceivers[k].rtpSender && b.transceivers[k].rtpSender.setTransport(b.transceivers[0].dtlsTransport), b.transceivers[k].rtpReceiver && b.transceivers[k].rtpReceiver.setTransport(b.transceivers[0].dtlsTransport));
                                    if ("offer" === a.type && !t) {
                                        t = b.transceivers[k] ||
                                        b._createTransceiver(p);
                                        t.mid = C;t.iceGatherer || (t.iceGatherer = n && 0 < k ? b.transceivers[0].iceGatherer : b._createIceGatherer(C, k));!B || n && 0 !== k || t.iceTransport.setRemoteCandidates(e);
                                        var z = c.RTCRtpReceiver.getCapabilities(p);
                                        15019 > d && (z.codecs = z.codecs.filter(function(a) {
                                            return "rtx" !== a.name
                                        }));
                                        C = [{
                                            ssrc: 1001 * (2 * k + 2)
                                        }];
                                        if ("sendrecv" === u || "sendonly" === u) {
                                            var A = new c.RTCRtpReceiver(t.dtlsTransport, p);
                                            v = A.track;
                                            r ? (f[r.stream] || (f[r.stream] = new c.MediaStream, Object.defineProperty(f[r.stream], "id", {
                                                get: function() {
                                                    return r.stream
                                                }
                                            })),
                                            Object.defineProperty(v, "id", {
                                                get: function() {
                                                    return r.track
                                                }
                                            }), f[r.stream].addTrack(v), g.push([v, A, f[r.stream]])) : (f.default || (f.default = new c.MediaStream), f.default.addTrack(v), g.push([v, A, f.default]))
                                        }
                                        t.localCapabilities = z;
                                        t.remoteCapabilities = x;
                                        t.rtpReceiver = A;
                                        t.rtcpParameters = D;
                                        t.sendEncodingParameters = C;
                                        t.recvEncodingParameters = w;b._transceive(b.transceivers[k], !1, "sendrecv" === u || "sendonly" === u)
                                    } else if ("answer" === a.type && !t) {
                                        t = b.transceivers[k];
                                        p = t.iceGatherer;
                                        var F = t.iceTransport;
                                        var H = t.dtlsTransport;
                                        A = t.rtpReceiver;
                                        C = t.sendEncodingParameters;
                                        z = t.localCapabilities;
                                        b.transceivers[k].recvEncodingParameters = w;
                                        b.transceivers[k].remoteCapabilities = x;
                                        b.transceivers[k].rtcpParameters = D;(q || B) && e.length && F.setRemoteCandidates(e);n && 0 !== k || (F.start(p, v, "controlling"), H.start(y));b._transceive(t, "sendrecv" === u || "recvonly" === u, "sendrecv" === u || "sendonly" === u);
                                        !A || "sendrecv" !== u && "sendonly" !== u ?
                                            delete t.rtpReceiver
                                            : (v = A.track, r ? (f[r.stream] || (f[r.stream] = new c.MediaStream), f[r.stream].addTrack(v), g.push([v,
                                                A, f[r.stream]])) : (f.default || (f.default = new c.MediaStream), f.default.addTrack(v), g.push([v, A, f.default])))
                                    }
                                }
                            });
                            this.remoteDescription = {
                                type: a.type,
                                sdp: a.sdp
                            };switch (a.type) {
                            case "offer":
                                this._updateSignalingState("have-remote-offer");
                                break;case "answer":
                                this._updateSignalingState("stable");
                                break;default:
                                throw new TypeError('unsupported type "' + a.type + '"');
                            }
                            Object.keys(f).forEach(function(a) {
                                var d = f[a];
                                if (d.getTracks().length) {
                                    b.remoteStreams.push(d);
                                    var e = new Event("addstream");
                                    e.stream = d;b.dispatchEvent(e);
                                    null !== b.onaddstream && c.setTimeout(function() {
                                        b.onaddstream(e)
                                    }, 0);g.forEach(function(a) {
                                        var e = a[0],
                                            f = a[1];
                                        if (d.id === a[2].id) {
                                            var g = new Event("track");
                                            g.track = e;
                                            g.receiver = f;
                                            g.streams = [d];b.dispatchEvent(g);null !== b.ontrack && c.setTimeout(function() {
                                                b.ontrack(g)
                                            }, 0)
                                        }
                                    })
                                }
                            });c.setTimeout(function() {
                                b && b.transceivers && b.transceivers.forEach(function(a) {
                                    a.iceTransport && "new" === a.iceTransport.state && 0 < a.iceTransport.getRemoteCandidates().length && (console.warn("Timeout for addRemoteCandidate. Consider sending an end-of-candidates notification"),
                                    a.iceTransport.addRemoteCandidate({}))
                                })
                            }, 4E3);1 < arguments.length && "function" === typeof arguments[1] && c.setTimeout(arguments[1], 0);return Promise.resolve()
                        };
                        e.prototype.close = function() {
                            this.transceivers.forEach(function(a) {
                                a.iceTransport && a.iceTransport.stop();a.dtlsTransport && a.dtlsTransport.stop();a.rtpSender && a.rtpSender.stop();a.rtpReceiver && a.rtpReceiver.stop()
                            });this._updateSignalingState("closed")
                        };
                        e.prototype._updateSignalingState = function(a) {
                            this.signalingState = a;
                            a = new Event("signalingstatechange");
                            this.dispatchEvent(a);
                            if (null !== this.onsignalingstatechange) this.onsignalingstatechange(a)
                        };
                        e.prototype._maybeFireNegotiationNeeded = function() {
                            var a = this;
                            "stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0, c.setTimeout(function() {
                                if (!1 !== a.needNegotiation) {
                                    a.needNegotiation = !1;
                                    var b = new Event("negotiationneeded");
                                    a.dispatchEvent(b);
                                    if (null !== a.onnegotiationneeded) a.onnegotiationneeded(b)
                                }
                            }, 0))
                        };
                        e.prototype._updateConnectionState = function() {
                            var a = {
                                "new": 0,
                                closed: 0,
                                connecting: 0,
                                checking: 0,
                                connected: 0,
                                completed: 0,
                                disconnected: 0,
                                failed: 0
                            };
                            this.transceivers.forEach(function(b) {
                                a[b.iceTransport.state]++;a[b.dtlsTransport.state]++
                            });
                            a.connected += a.completed;
                            var b = "new";
                            if (0 < a.failed)
                                b = "failed";
                            else if (0 < a.connecting || 0 < a.checking)
                                b = "connecting";
                            else if (0 < a.disconnected)
                                b = "disconnected";
                            else if (0 < a.new)
                                b = "new";
                            else if (0 < a.connected || 0 < a.completed)
                                b = "connected";
                            if (b !== this.iceConnectionState && (this.iceConnectionState = b, b = new Event("iceconnectionstatechange"), this.dispatchEvent(b),
                                    null !== this.oniceconnectionstatechange)) this.oniceconnectionstatechange(b)
                        };
                        e.prototype.createOffer = function() {
                            var a = this;
                            if (this._pendingOffer)
                                throw Error("createOffer called while there is a pending offer.");
                            var b;
                            1 === arguments.length && "function" !== typeof arguments[0] ? b = arguments[0] : 3 === arguments.length && (b = arguments[2]);
                            var e = this.transceivers.filter(function(a) {
                                    return "audio" === a.kind
                                }).length,
                                k = this.transceivers.filter(function(a) {
                                    return "video" === a.kind
                                }).length;
                            if (b) {
                                if (b.mandatory || b.optional)
                                    throw new TypeError("Legacy mandatory/optional constraints not supported.");
                                void 0 !== b.offerToReceiveAudio && (e = !0 === b.offerToReceiveAudio ? 1 : !1 === b.offerToReceiveAudio ? 0 : b.offerToReceiveAudio);void 0 !== b.offerToReceiveVideo && (k = !0 === b.offerToReceiveVideo ? 1 : !1 === b.offerToReceiveVideo ? 0 : b.offerToReceiveVideo)
                            }
                            for (this.transceivers.forEach(function(a) {
                                    "audio" === a.kind ? (e--, 0 > e && (a.wantReceive = !1)) : "video" === a.kind && (k--, 0 > k && (a.wantReceive = !1))
                                }); 0 < e || 0 < k;) 0 < e && (this._createTransceiver("audio"), e--), 0 < k && (this._createTransceiver("video"), k--);
                            var l = g(this.transceivers),
                                q = m.writeSessionBoilerplate(this._sdpSessionId);
                            l.forEach(function(b, e) {
                                var f = b.track,
                                    g = b.kind,
                                    k = m.generateIdentifier();
                                b.mid = k;b.iceGatherer || (b.iceGatherer = a.usingBundle && 0 < e ? l[0].iceGatherer : a._createIceGatherer(k, e));
                                k = c.RTCRtpSender.getCapabilities(g);15019 > d && (k.codecs = k.codecs.filter(function(a) {
                                    return "rtx" !== a.name
                                }));k.codecs.forEach(function(a) {
                                    "H264" === a.name && void 0 === a.parameters["level-asymmetry-allowed"] && (a.parameters["level-asymmetry-allowed"] = "1")
                                });
                                var q = [{
                                    ssrc: 1001 * (2 * e + 1)
                                }];
                                f && 15019 <= d && "video" === g && (q[0].rtx = {
                                    ssrc: 1001 * (2 *
                                        e + 1) + 1
                                });b.wantReceive && (b.rtpReceiver = new c.RTCRtpReceiver(b.dtlsTransport, g));
                                b.localCapabilities = k;
                                b.sendEncodingParameters = q
                            });"max-compat" !== this._config.bundlePolicy && (q += "a\x3dgroup:BUNDLE " + l.map(function(a) {
                                    return a.mid
                                }).join(" ") + "\r\n");
                            q += "a\x3dice-options:trickle\r\n";l.forEach(function(a, b) {
                                q += m.writeMediaSection(a, a.localCapabilities, "offer", a.stream);
                                q += "a\x3drtcp-rsize\r\n"
                            });
                            this._pendingOffer = l;
                            b = new c.RTCSessionDescription({
                                type: "offer",
                                sdp: q
                            });arguments.length && "function" ===
                            typeof arguments[0] && c.setTimeout(arguments[0], 0, b);return Promise.resolve(b)
                        };
                        e.prototype.createAnswer = function() {
                            var a = m.writeSessionBoilerplate(this._sdpSessionId);
                            this.usingBundle && (a += "a\x3dgroup:BUNDLE " + this.transceivers.map(function(a) {
                                    return a.mid
                                }).join(" ") + "\r\n");this.transceivers.forEach(function(c, e) {
                                if (c.isDatachannel)
                                    a += "m\x3dapplication 0 DTLS/SCTP 5000\r\nc\x3dIN IP4 0.0.0.0\r\na\x3dmid:" + c.mid + "\r\n";
                                else {
                                    if (c.stream) {
                                        var f;
                                        "audio" === c.kind ? f = c.stream.getAudioTracks()[0] : "video" ===
                                        c.kind && (f = c.stream.getVideoTracks()[0]);f && 15019 <= d && "video" === c.kind && (c.sendEncodingParameters[0].rtx = {
                                            ssrc: 1001 * (2 * e + 2) + 1
                                        })
                                    }
                                    e = b(c.localCapabilities, c.remoteCapabilities);!e.codecs.filter(function(a) {
                                        return "rtx" === a.name.toLowerCase()
                                    }).length && c.sendEncodingParameters[0].rtx &&
                                    delete c.sendEncodingParameters[0].rtx;
                                    a += m.writeMediaSection(c, e, "answer", c.stream);c.rtcpParameters && c.rtcpParameters.reducedSize && (a += "a\x3drtcp-rsize\r\n")
                                }
                            });
                            var e = new c.RTCSessionDescription({
                                type: "answer",
                                sdp: a
                            });
                            arguments.length && "function" === typeof arguments[0] && c.setTimeout(arguments[0], 0, e);return Promise.resolve(e)
                        };
                        e.prototype.addIceCandidate = function(a) {
                            if (a) {
                                var b = a.sdpMLineIndex;
                                if (a.sdpMid)
                                    for (var d = 0; d < this.transceivers.length; d++)
                                        if (this.transceivers[d].mid === a.sdpMid) {
                                            b = d;break
                                }
                                var e = this.transceivers[b];
                                if (e) {
                                    d = 0 < Object.keys(a.candidate).length ? m.parseCandidate(a.candidate) : {};
                                    if ("tcp" === d.protocol && (0 === d.port || 9 === d.port) || d.component && "1" !== d.component && 1 !== d.component) return Promise.resolve();
                                    e.iceTransport.addRemoteCandidate(d);
                                    e = m.splitSections(this.remoteDescription.sdp);
                                    e[b + 1] += (d.type ? a.candidate.trim() : "a\x3dend-of-candidates") + "\r\n";
                                    this.remoteDescription.sdp = e.join("")
                                }
                            } else
                                for (b = 0; b < this.transceivers.length; b++)
                                    if (this.transceivers[b].iceTransport.addRemoteCandidate({}), this.usingBundle) return Promise.resolve();
                            1 < arguments.length && "function" === typeof arguments[1] && c.setTimeout(arguments[1], 0);return Promise.resolve()
                        };
                        e.prototype.getStats = function() {
                            var a = [];
                            this.transceivers.forEach(function(b) {
                                ["rtpSender",
                                    "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function(c) {
                                    b[c] && a.push(b[c].getStats())
                                })
                            });
                            var b = 1 < arguments.length && "function" === typeof arguments[1] && arguments[1];
                            return new Promise(function(d) {
                                var e = new Map;
                                Promise.all(a).then(function(a) {
                                    a.forEach(function(a) {
                                        Object.keys(a).forEach(function(b) {
                                            var c = a[b];
                                            a[b].type = {
                                                inboundrtp: "inbound-rtp",
                                                outboundrtp: "outbound-rtp",
                                                candidatepair: "candidate-pair",
                                                localcandidate: "local-candidate",
                                                remotecandidate: "remote-candidate"
                                            }[c.type] ||
                                            c.type;e.set(b, a[b])
                                        })
                                    });b && c.setTimeout(b, 0, e);d(e)
                                })
                            })
                        };return e
                    }
                }, {
                    sdp: 1
                }],
                9: [function(e, d, c) {
                    var g = e("../utils");
                    d.exports = {
                        shimOnTrack: function(a) {
                            "object" !== typeof a || !a.RTCPeerConnection || "ontrack" in a.RTCPeerConnection.prototype || Object.defineProperty(a.RTCPeerConnection.prototype, "ontrack", {
                                get: function() {
                                    return this._ontrack
                                },
                                set: function(a) {
                                    this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly));this.addEventListener("track",
                                        this._ontrack = a);this.addEventListener("addstream", this._ontrackpoly = function(a) {
                                        a.stream.getTracks().forEach(function(b) {
                                            var c = new Event("track");
                                            c.track = b;
                                            c.receiver = {
                                                track: b
                                            };
                                            c.streams = [a.stream];this.dispatchEvent(c)
                                        }.bind(this))
                                    }.bind(this))
                                }
                            })
                        },
                        shimSourceObject: function(a) {
                            "object" === typeof a && (!a.HTMLMediaElement || "srcObject" in a.HTMLMediaElement.prototype || Object.defineProperty(a.HTMLMediaElement.prototype, "srcObject", {
                                get: function() {
                                    return this.mozSrcObject
                                },
                                set: function(a) {
                                    this.mozSrcObject = a
                                }
                            }))
                        },
                        shimPeerConnection: function(a) {
                            var b = g.detectBrowser(a);
                            if ("object" === typeof a && (a.RTCPeerConnection || a.mozRTCPeerConnection)) {
                                a.RTCPeerConnection || (a.RTCPeerConnection = function(c, d) {
                                    if (38 > b.version && c && c.iceServers) {
                                        for (var e = [], f = 0; f < c.iceServers.length; f++) {
                                            var g = c.iceServers[f];
                                            if (g.hasOwnProperty("urls"))
                                                for (var k = 0; k < g.urls.length; k++) {
                                                    var m = {
                                                        url: g.urls[k]
                                                    };
                                                    0 === g.urls[k].indexOf("turn") && (m.username = g.username, m.credential = g.credential);e.push(m)
                                            }
                                            else e.push(c.iceServers[f])
                                        }
                                        c.iceServers = e
                                    }
                                    return new a.mozRTCPeerConnection(c, d)
                                }, a.RTCPeerConnection.prototype = a.mozRTCPeerConnection.prototype, a.mozRTCPeerConnection.generateCertificate && Object.defineProperty(a.RTCPeerConnection, "generateCertificate", {
                                    get: function() {
                                        return a.mozRTCPeerConnection.generateCertificate
                                    }
                                }), a.RTCSessionDescription = a.mozRTCSessionDescription, a.RTCIceCandidate = a.mozRTCIceCandidate);["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function(b) {
                                    var c = a.RTCPeerConnection.prototype[b];
                                    a.RTCPeerConnection.prototype[b] = function() {
                                        arguments[0] = new ("addIceCandidate" === b ? a.RTCIceCandidate : a.RTCSessionDescription)(arguments[0]);return c.apply(this, arguments)
                                    }
                                });
                                var c = a.RTCPeerConnection.prototype.addIceCandidate;
                                a.RTCPeerConnection.prototype.addIceCandidate = function() {
                                    return arguments[0] ? c.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                                };
                                var d = function(a) {
                                        var b = new Map;
                                        Object.keys(a).forEach(function(c) {
                                            b.set(c, a[c]);
                                            b[c] = a[c]
                                        });return b
                                    },
                                    e = {
                                        inboundrtp: "inbound-rtp",
                                        outboundrtp: "outbound-rtp",
                                        candidatepair: "candidate-pair",
                                        localcandidate: "local-candidate",
                                        remotecandidate: "remote-candidate"
                                    },
                                    k = a.RTCPeerConnection.prototype.getStats;
                                a.RTCPeerConnection.prototype.getStats = function(a, c, g) {
                                    return k.apply(this, [a || null]).then(function(a) {
                                        48 > b.version && (a = d(a));
                                        if (53 > b.version && !c) try {
                                                a.forEach(function(a) {
                                                    a.type = e[a.type] || a.type
                                                })
                                            } catch ( x ) {
                                                if ("TypeError" !== x.name)
                                                    throw x;
                                                a.forEach(function(b, c) {
                                                    a.set(c, Object.assign({}, b, {
                                                        type: e[b.type] || b.type
                                                    }))
                                                })
                                        } return a
                                    }).then(c, g)
                                }
                            }
                        },
                        shimGetUserMedia: e("./getusermedia")
                    }
                },
                    {
                        "../utils": 12,
                        "./getusermedia": 10
                    }],
                10: [function(e, d, c) {
                    var g = e("../utils"),
                        a = g.log;
                    d.exports = function(b) {
                        var c = g.detectBrowser(b),
                            d = b && b.navigator;
                        b = b && b.MediaStreamTrack;
                        var e = function(a) {
                                return {
                                    name: {
                                            InternalError: "NotReadableError",
                                            NotSupportedError: "TypeError",
                                            PermissionDeniedError: "NotAllowedError",
                                            SecurityError: "NotAllowedError"
                                        }[a.name] || a.name,
                                    message: {
                                            "The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context."
                                        }[a.message] || a.message,
                                    constraint: a.constraint,
                                    toString: function() {
                                        return this.name + (this.message && ": ") + this.message
                                    }
                                }
                            },
                            k = function(b, f, g) {
                                var k = function(a) {
                                    if ("object" !== typeof a || a.require) return a;
                                    var b = [];
                                    Object.keys(a).forEach(function(c) {
                                        if ("require" !== c && "advanced" !== c && "mediaSource" !== c) {
                                            var d = a[c] = "object" === typeof a[c] ? a[c] : {
                                                ideal: a[c]
                                            };
                                            void 0 === d.min && void 0 === d.max && void 0 === d.exact || b.push(c);void 0 !== d.exact && ("number" === typeof d.exact ? d.min = d.max = d.exact : a[c] = d.exact,
                                            delete d.exact
                                            );
                                            if (void 0 !== d.ideal) {
                                                a.advanced = a.advanced || [];
                                                var e = {};
                                                e[c] = "number" === typeof d.ideal ? {
                                                    min: d.ideal,
                                                    max: d.ideal
                                                } : d.ideal;a.advanced.push(e);
                                                delete d.ideal;
                                                Object.keys(d).length ||
                                                delete a[c]
                                            }
                                        }
                                    });b.length && (a.require = b);return a
                                };
                                b = JSON.parse(JSON.stringify(b));38 > c.version && (a("spec: " + JSON.stringify(b)), b.audio && (b.audio = k(b.audio)), b.video && (b.video = k(b.video)), a("ff37: " + JSON.stringify(b)));return d.mozGetUserMedia(b, f, function(a) {
                                    g(e(a))
                                })
                            },
                            n = function(a) {
                                return new Promise(function(b, c) {
                                    k(a, b, c)
                                })
                            };
                        d.mediaDevices || (d.mediaDevices = {
                            getUserMedia: n,
                            addEventListener: function() {},
                            removeEventListener: function() {}
                        });
                        d.mediaDevices.enumerateDevices = d.mediaDevices.enumerateDevices || function() {
                            return new Promise(function(a) {
                                a([{
                                    kind: "audioinput",
                                    deviceId: "default",
                                    label: "",
                                    groupId: ""
                                }, {
                                    kind: "videoinput",
                                    deviceId: "default",
                                    label: "",
                                    groupId: ""
                                }])
                            })
                        };
                        if (41 > c.version) {
                            var f = d.mediaDevices.enumerateDevices.bind(d.mediaDevices);
                            d.mediaDevices.enumerateDevices = function() {
                                return f().then(void 0, function(a) {
                                    if ("NotFoundError" === a.name) return [];
                                    throw a;
                                })
                            }
                        }
                        if (49 > c.version) {
                            var p = d.mediaDevices.getUserMedia.bind(d.mediaDevices);
                            d.mediaDevices.getUserMedia = function(a) {
                                return p(a).then(function(b) {
                                    if (a.audio && !b.getAudioTracks().length || a.video && !b.getVideoTracks().length)
                                        throw b.getTracks().forEach(function(a) {
                                            a.stop()
                                        }), new DOMException("The object can not be found here.", "NotFoundError");
                                    return b
                                }, function(a) {
                                    return Promise.reject(e(a))
                                })
                            }
                        }
                        if (!(55 < c.version && "autoGainControl" in d.mediaDevices.getSupportedConstraints())) {
                            var r = function(a,
                                    b, c) {
                                    b in a && !(c in a) && (a[c] = a[b],
                                    delete a[b]
                                    )
                                },
                                x = d.mediaDevices.getUserMedia.bind(d.mediaDevices);
                            d.mediaDevices.getUserMedia = function(a) {
                                "object" === typeof a && "object" === typeof a.audio && (a = JSON.parse(JSON.stringify(a)), r(a.audio, "autoGainControl", "mozAutoGainControl"), r(a.audio, "noiseSuppression", "mozNoiseSuppression"));return x(a)
                            };
                            if (b && b.prototype.getSettings) {
                                var y = b.prototype.getSettings;
                                b.prototype.getSettings = function() {
                                    var a = y.apply(this, arguments);
                                    r(a, "mozAutoGainControl", "autoGainControl");
                                    r(a, "mozNoiseSuppression", "noiseSuppression");return a
                                }
                            }
                            if (b && b.prototype.applyConstraints) {
                                var z = b.prototype.applyConstraints;
                                b.prototype.applyConstraints = function(a) {
                                    "audio" === this.kind && "object" === typeof a && (a = JSON.parse(JSON.stringify(a)), r(a, "autoGainControl", "mozAutoGainControl"), r(a, "noiseSuppression", "mozNoiseSuppression"));return z.apply(this, [a])
                                }
                            }
                        }
                        d.getUserMedia = function(a, b, e) {
                            if (44 > c.version) return k(a, b, e);
                            console.warn("navigator.getUserMedia has been replaced by navigator.mediaDevices.getUserMedia");
                            d.mediaDevices.getUserMedia(a).then(b, e)
                        }
                    }
                }, {
                    "../utils": 12
                }],
                11: [function(e, d, c) {
                    var g = e("../utils");
                    d.exports = {
                        shimCallbacksAPI: function(a) {
                            if ("object" === typeof a && a.RTCPeerConnection) {
                                a = a.RTCPeerConnection.prototype;
                                var b = a.createOffer,
                                    c = a.createAnswer,
                                    d = a.setLocalDescription,
                                    e = a.setRemoteDescription,
                                    g = a.addIceCandidate;
                                a.createOffer = function(a, c) {
                                    var d = b.apply(this, [2 <= arguments.length ? arguments[2] : arguments[0]]);
                                    if (!c) return d;
                                    d.then(a, c);return Promise.resolve()
                                };
                                a.createAnswer = function(a, b) {
                                    var d = c.apply(this, [2 <= arguments.length ? arguments[2] : arguments[0]]);
                                    if (!b) return d;
                                    d.then(a, b);return Promise.resolve()
                                };
                                var k = function(a, b, c) {
                                    a = d.apply(this, [a]);
                                    if (!c) return a;
                                    a.then(b, c);return Promise.resolve()
                                };
                                a.setLocalDescription = k;
                                k = function(a, b, c) {
                                    a = e.apply(this, [a]);
                                    if (!c) return a;
                                    a.then(b, c);return Promise.resolve()
                                };
                                a.setRemoteDescription = k;
                                k = function(a, b, c) {
                                    a = g.apply(this, [a]);
                                    if (!c) return a;
                                    a.then(b, c);return Promise.resolve()
                                };
                                a.addIceCandidate = k
                            }
                        },
                        shimLocalStreamsAPI: function(a) {
                            if ("object" ===
                                    typeof a && a.RTCPeerConnection) {
                                "getLocalStreams" in a.RTCPeerConnection.prototype || (a.RTCPeerConnection.prototype.getLocalStreams = function() {
                                    this._localStreams || (this._localStreams = []);return this._localStreams
                                });"getStreamById" in a.RTCPeerConnection.prototype || (a.RTCPeerConnection.prototype.getStreamById = function(a) {
                                    var b = null;
                                    this._localStreams && this._localStreams.forEach(function(c) {
                                        c.id === a && (b = c)
                                    });this._remoteStreams && this._remoteStreams.forEach(function(c) {
                                        c.id === a && (b = c)
                                    });return b
                                });
                                if (!("addStream" in
                                        a.RTCPeerConnection.prototype)) {
                                    var b = a.RTCPeerConnection.prototype.addTrack;
                                    a.RTCPeerConnection.prototype.addStream = function(a) {
                                        this._localStreams || (this._localStreams = []);-1 === this._localStreams.indexOf(a) && this._localStreams.push(a);
                                        var c = this;
                                        a.getTracks().forEach(function(d) {
                                            b.call(c, d, a)
                                        })
                                    };
                                    a.RTCPeerConnection.prototype.addTrack = function(a, c) {
                                        c && (this._localStreams ? -1 === this._localStreams.indexOf(c) && this._localStreams.push(c) : this._localStreams = [c]);b.call(this, a, c)
                                    }
                                }
                                "removeStream" in a.RTCPeerConnection.prototype ||
                                (a.RTCPeerConnection.prototype.removeStream = function(a) {
                                    this._localStreams || (this._localStreams = []);
                                    var b = this._localStreams.indexOf(a);
                                    if (-1 !== b) {
                                        this._localStreams.splice(b, 1);
                                        var c = this,
                                            d = a.getTracks();
                                        this.getSenders().forEach(function(a) {
                                            -1 !== d.indexOf(a.track) && c.removeTrack(a)
                                        })
                                    }
                                })
                            }
                        },
                        shimRemoteStreamsAPI: function(a) {
                            "object" === typeof a && a.RTCPeerConnection && ("getRemoteStreams" in a.RTCPeerConnection.prototype || (a.RTCPeerConnection.prototype.getRemoteStreams = function() {
                                return this._remoteStreams ?
                                    this._remoteStreams : []
                            }), "onaddstream" in a.RTCPeerConnection.prototype || Object.defineProperty(a.RTCPeerConnection.prototype, "onaddstream", {
                                get: function() {
                                    return this._onaddstream
                                },
                                set: function(a) {
                                    this._onaddstream && (this.removeEventListener("addstream", this._onaddstream), this.removeEventListener("track", this._onaddstreampoly));this.addEventListener("addstream", this._onaddstream = a);this.addEventListener("track", this._onaddstreampoly = function(a) {
                                        var b = a.streams[0];
                                        this._remoteStreams || (this._remoteStreams = []);0 <= this._remoteStreams.indexOf(b) || (this._remoteStreams.push(b), b = new Event("addstream"), b.stream = a.streams[0], this.dispatchEvent(b))
                                    }.bind(this))
                                }
                            }))
                        },
                        shimGetUserMedia: function(a) {
                            var b = a && a.navigator;
                            b.getUserMedia || (b.webkitGetUserMedia ? b.getUserMedia = b.webkitGetUserMedia.bind(b) : b.mediaDevices && b.mediaDevices.getUserMedia && (b.getUserMedia = function(a, c, d) {
                                b.mediaDevices.getUserMedia(a).then(c, d)
                            }.bind(b)))
                        },
                        shimRTCIceServerUrls: function(a) {
                            var b = a.RTCPeerConnection;
                            a.RTCPeerConnection = function(a,
                                c) {
                                if (a && a.iceServers) {
                                    for (var d = [], e = 0; e < a.iceServers.length; e++) {
                                        var k = a.iceServers[e];
                                        !k.hasOwnProperty("urls") && k.hasOwnProperty("url") ? (g.deprecated("RTCIceServer.url", "RTCIceServer.urls"), k = JSON.parse(JSON.stringify(k)), k.urls = k.url,
                                        delete k.url
                                        , d.push(k)) : d.push(a.iceServers[e])
                                    }
                                    a.iceServers = d
                                }
                                return new b(a, c)
                            };
                            a.RTCPeerConnection.prototype = b.prototype;Object.defineProperty(a.RTCPeerConnection, "generateCertificate", {
                                get: function() {
                                    return b.generateCertificate
                                }
                            })
                        }
                    }
                }, {
                    "../utils": 12
                }],
                12: [function(e,
                    d, c) {
                    var g = !0,
                        a = !0,
                        b = {
                            disableLog: function(a) {
                                return "boolean" !== typeof a ? Error("Argument type: " + typeof a + ". Please use a boolean.") : (g = a) ? "adapter.js logging disabled" : "adapter.js logging enabled"
                            },
                            disableWarnings: function(b) {
                                if ("boolean" !== typeof b) return Error("Argument type: " + typeof b + ". Please use a boolean.");
                                a = !b;return "adapter.js deprecation warnings " + (b ? "disabled" : "enabled")
                            },
                            log: function() {
                                "object" !== typeof window || g || "undefined" !== typeof console && "function" === typeof console.log && console.log.apply(console,
                                    arguments)
                            },
                            deprecated: function(b, c) {
                                a && console.warn(b + " is deprecated, please use " + c + " instead.")
                            },
                            extractVersion: function(a, b, c) {
                                return (a = a.match(b)) && a.length >= c && parseInt(a[c], 10)
                            },
                            detectBrowser: function(a) {
                                var b = a && a.navigator,
                                    c = {
                                        browser: null,
                                        version: null
                                    };
                                if ("undefined" === typeof a || !a.navigator) return c.browser = "Not a browser.", c;
                                b.mozGetUserMedia ? (c.browser = "firefox", c.version = this.extractVersion(b.userAgent, /Firefox\/(\d+)\./, 1)) : b.webkitGetUserMedia ? a.webkitRTCPeerConnection ? (c.browser = "chrome", c.version = this.extractVersion(b.userAgent, /Chrom(e|ium)\/(\d+)\./, 2)) : b.userAgent.match(/Version\/(\d+).(\d+)/) ? (c.browser = "safari", c.version = this.extractVersion(b.userAgent, /AppleWebKit\/(\d+)\./, 1)) : c.browser = "Unsupported webkit-based browser with GUM support but no WebRTC support." : b.mediaDevices && b.userAgent.match(/Edge\/(\d+).(\d+)$/) ? (c.browser = "edge", c.version = this.extractVersion(b.userAgent, /Edge\/(\d+).(\d+)$/, 2)) : b.mediaDevices && b.userAgent.match(/AppleWebKit\/(\d+)\./) ? (c.browser = "safari", c.version = this.extractVersion(b.userAgent, /AppleWebKit\/(\d+)\./, 1)) : c.browser = "Not a supported browser.";return c
                            },
                            shimCreateObjectURL: function(a) {
                                var c = a && a.URL;
                                if ("object" === typeof a && a.HTMLMediaElement && "srcObject" in a.HTMLMediaElement.prototype) {
                                    var d = c.createObjectURL.bind(c),
                                        e = c.revokeObjectURL.bind(c),
                                        g = new Map,
                                        f = 0;
                                    c.createObjectURL = function(a) {
                                        if ("getTracks" in a) {
                                            var c = "polyblob:" + ++f;
                                            g.set(c, a);b.deprecated("URL.createObjectURL(stream)", "elem.srcObject \x3d stream");return c
                                        }
                                        return d(a)
                                    };
                                    c.revokeObjectURL = function(a) {
                                        e(a);g.delete(a)
                                    };
                                    var k = Object.getOwnPropertyDescriptor(a.HTMLMediaElement.prototype, "src");
                                    Object.defineProperty(a.HTMLMediaElement.prototype, "src", {
                                        get: function() {
                                            return k.get.apply(this)
                                        },
                                        set: function(a) {
                                            this.srcObject = g.get(a) || null;return k.set.apply(this, [a])
                                        }
                                    });
                                    var n = a.HTMLMediaElement.prototype.setAttribute;
                                    a.HTMLMediaElement.prototype.setAttribute = function() {
                                        2 === arguments.length && "src" === ("" + arguments[0]).toLowerCase() && (this.srcObject = g.get(arguments[1]) || null);
                                        return n.apply(this, arguments)
                                    }
                                }
                            }
                        };
                    d.exports = {
                        log: b.log,
                        deprecated: b.deprecated,
                        disableLog: b.disableLog,
                        disableWarnings: b.disableWarnings,
                        extractVersion: b.extractVersion,
                        shimCreateObjectURL: b.shimCreateObjectURL,
                        detectBrowser: b.detectBrowser.bind(b)
                    }
                }, {}]
            }, {}, [2])(2)
        }()
    }).call(r, n(8))
}, function(p, r, n) {
    n(25)(n(26))
}, function(p, r) {
    p.exports = function(n) {
        "undefined" !== typeof execScript ? execScript(n) : eval.call(null, n)
    }
}, function(p, r) {
    p.exports = "/* globals $$, jQuery, Elements, document, window, L */\n\n/**\n* Copyright 2013 Marc J. Schmidt. See the LICENSE file at the top-level\n* directory of this distribution and at\n* https://github.com/marcj/css-element-queries/blob/master/LICENSE.\n*/\nthis.L \x3d this.L || {};\n\n/**\n * @param {HTMLElement} element\n * @param {String}      prop\n * @returns {String|Number}\n */\nL.GetComputedStyle \x3d (computedElement, prop) \x3d\x3e {\n  if (computedElement.currentStyle) {\n    return computedElement.currentStyle[prop];\n  } else if (window.getComputedStyle) {\n    return window.getComputedStyle(computedElement, null).getPropertyValue(prop);\n  }\n  return computedElement.style[prop];\n};\n\n  /**\n   *\n   * @type {Function}\n   * @constructor\n   */\nL.ElementQueries \x3d function ElementQueries() {\n      /**\n       *\n       * @param element\n       * @returns {Number}\n       */\n  function getEmSize(element \x3d document.documentElement) {\n    const fontSize \x3d L.GetComputedStyle(element, 'fontSize');\n    return parseFloat(fontSize) || 16;\n  }\n\n      /**\n       *\n       * @copyright https://github.com/Mr0grog/element-query/blob/master/LICENSE\n       *\n       * @param element\n       * @param value\n       * @param units\n       * @returns {*}\n       */\n  function convertToPx(element, originalValue) {\n    let vh;\n    let vw;\n    let chooser;\n    const units \x3d originalValue.replace(/[0-9]*/, '');\n    const value \x3d parseFloat(originalValue);\n    switch (units) {\n      case 'px':\n        return value;\n      case 'em':\n        return value * getEmSize(element);\n      case 'rem':\n        return value * getEmSize();\n              // Viewport units!\n              // According to http://quirksmode.org/mobile/tableViewport.html\n              // documentElement.clientWidth/Height gets us the most reliable info\n      case 'vw':\n        return (value * document.documentElement.clientWidth) / 100;\n      case 'vh':\n        return (value * document.documentElement.clientHeight) / 100;\n      case 'vmin':\n      case 'vmax':\n        vw \x3d document.documentElement.clientWidth / 100;\n        vh \x3d document.documentElement.clientHeight / 100;\n        chooser \x3d Math[units \x3d\x3d\x3d 'vmin' ? 'min' : 'max'];\n        return value * chooser(vw, vh);\n      default:\n        return value;\n              // for now, not supporting physical units (since they are just a set number of px)\n              // or ex/ch (getting accurate measurements is hard)\n    }\n  }\n\n      /**\n       *\n       * @param {HTMLElement} element\n       * @constructor\n       */\n  function SetupInformation(element) {\n    this.element \x3d element;\n    this.options \x3d [];\n    let i;\n    let j;\n    let option;\n    let width \x3d 0;\n    let height \x3d 0;\n    let value;\n    let actualValue;\n    let attrValues;\n    let attrValue;\n    let attrName;\n\n          /**\n           * @param option {mode: 'min|max', property: 'width|height', value: '123px'}\n           */\n    this.addOption \x3d (newOption) \x3d\x3e {\n      this.options.push(newOption);\n    };\n\n    const attributes \x3d ['min-width', 'min-height', 'max-width', 'max-height'];\n\n          /**\n           * Extracts the computed width/height and sets to min/max- attribute.\n           */\n    this.call \x3d () \x3d\x3e {\n              // extract current dimensions\n      width \x3d this.element.offsetWidth;\n      height \x3d this.element.offsetHeight;\n\n      attrValues \x3d {};\n\n      for (i \x3d 0, j \x3d this.options.length; i \x3c j; i +\x3d 1) {\n        option \x3d this.options[i];\n        value \x3d convertToPx(this.element, option.value);\n\n        actualValue \x3d option.property \x3d\x3d\x3d 'width' ? width : height;\n        attrName \x3d `${option.mode}-${option.property}`;\n        attrValue \x3d '';\n\n        if (option.mode \x3d\x3d\x3d 'min' \x26\x26 actualValue \x3e\x3d value) {\n          attrValue +\x3d option.value;\n        }\n\n        if (option.mode \x3d\x3d\x3d 'max' \x26\x26 actualValue \x3c\x3d value) {\n          attrValue +\x3d option.value;\n        }\n\n        if (!attrValues[attrName]) attrValues[attrName] \x3d '';\n        if (attrValue \x26\x26 (` ${attrValues[attrName]} `)\n                                            .indexOf(` ${attrValue} `) \x3d\x3d\x3d -1) {\n          attrValues[attrName] +\x3d ` ${attrValue}`;\n        }\n      }\n\n      for (let k \x3d 0; k \x3c attributes.length; k +\x3d 1) {\n        if (attrValues[attributes[k]]) {\n          this.element.setAttribute(attributes[k],\n                                                attrValues[attributes[k]].substr(1));\n        } else {\n          this.element.removeAttribute(attributes[k]);\n        }\n      }\n    };\n  }\n\n      /**\n       * @param {HTMLElement} element\n       * @param {Object}      options\n       */\n  function setupElement(originalElement, options) {\n    const element \x3d originalElement;\n    if (element.elementQueriesSetupInformation) {\n      element.elementQueriesSetupInformation.addOption(options);\n    } else {\n      element.elementQueriesSetupInformation \x3d new SetupInformation(element);\n      element.elementQueriesSetupInformation.addOption(options);\n      element.sensor \x3d new L.ResizeSensor(element, () \x3d\x3e {\n        element.elementQueriesSetupInformation.call();\n      });\n    }\n    element.elementQueriesSetupInformation.call();\n    return element;\n  }\n\n      /**\n       * @param {String} selector\n       * @param {String} mode min|max\n       * @param {String} property width|height\n       * @param {String} value\n       */\n  function queueQuery(selector, mode, property, value) {\n    let query;\n    if (document.querySelectorAll) query \x3d document.querySelectorAll.bind(document);\n    if (!query \x26\x26 typeof $$ !\x3d\x3d 'undefined') query \x3d $$;\n    if (!query \x26\x26 typeof jQuery !\x3d\x3d 'undefined') query \x3d jQuery;\n\n    if (!query) {\n      throw new Error('No document.querySelectorAll, jQuery or Mootools\\'s $$ found.');\n    }\n\n    const elements \x3d query(selector) || [];\n    for (let i \x3d 0, j \x3d elements.length; i \x3c j; i +\x3d 1) {\n      elements[i] \x3d setupElement(elements[i], {\n        mode,\n        property,\n        value,\n      });\n    }\n  }\n\n  const regex \x3d /,?([^,\\n]*)\\[[\\s\\t]*(min|max)-(width|height)[\\s\\t]*[~$^]?\x3d[\\s\\t]*\"([^\"]*)\"[\\s\\t]*]([^\\n\\s{]*)/mgi;  // jshint ignore:line\n\n      /**\n       * @param {String} css\n       */\n  function extractQuery(originalCss) {\n    let match;\n    const css \x3d originalCss.replace(/'/g, '\"');\n    while ((match \x3d regex.exec(css)) !\x3d\x3d null) {\n      if (match.length \x3e 5) {\n        queueQuery(match[1] || match[5], match[2], match[3], match[4]);\n      }\n    }\n  }\n\n      /**\n       * @param {CssRule[]|String} rules\n       */\n  function readRules(originalRules) {\n    let selector \x3d '';\n    let rules \x3d [];\n    if (!originalRules) {\n      return;\n    }\n    if (typeof originalRules \x3d\x3d\x3d 'string') {\n      rules \x3d originalRules.toLowerCase();\n      if (rules.indexOf('min-width') !\x3d\x3d -1 || rules.indexOf('max-width') !\x3d\x3d -1) {\n        extractQuery(rules);\n      }\n    } else {\n      for (let i \x3d 0, j \x3d rules.length; i \x3c j; i +\x3d 1) {\n        if (rules[i].type \x3d\x3d\x3d 1) {\n          selector \x3d rules[i].selectorText || rules[i].cssText;\n          if (selector.indexOf('min-height') !\x3d\x3d -1 ||\n                          selector.indexOf('max-height') !\x3d\x3d -1) {\n            extractQuery(selector);\n          } else if (selector.indexOf('min-width') !\x3d\x3d -1 ||\n                                 selector.indexOf('max-width') !\x3d\x3d -1) {\n            extractQuery(selector);\n          }\n        } else if (rules[i].type \x3d\x3d\x3d 4) {\n          readRules(rules[i].cssRules || rules[i].rules);\n        }\n      }\n    }\n  }\n\n      /**\n       * Searches all css rules and setups the event listener\n       * to all elements with element query rules..\n       */\n  this.init \x3d () \x3d\x3e {\n    const styleSheets \x3d document.styleSheets || [];\n    for (let i \x3d 0, j \x3d styleSheets.length; i \x3c j; i +\x3d 1) {\n      readRules(styleSheets[i].cssText ||\n                        styleSheets[i].cssRules ||\n                        styleSheets[i].rules);\n    }\n  };\n};\n\nfunction init() {\n  (new L.ElementQueries()).init();\n}\n\nif (window.addEventListener) {\n  window.addEventListener('load', init, false);\n} else {\n  window.attachEvent('onload', init);\n}\n\n  /**\n   * Iterate over each of the provided element(s).\n   *\n   * @param {HTMLElement|HTMLElement[]} elements\n   * @param {Function}                  callback\n   */\nfunction forEachElement(elements, callback \x3d () \x3d\x3e {}) {\n  const elementsType \x3d Object.prototype.toString.call(elements);\n  const isCollectionTyped \x3d (elementsType \x3d\x3d\x3d '[object Array]' ||\n          (elementsType \x3d\x3d\x3d '[object NodeList]') ||\n          (elementsType \x3d\x3d\x3d '[object HTMLCollection]') ||\n          (typeof jQuery !\x3d\x3d 'undefined' \x26\x26 elements instanceof jQuery) || // jquery\n          (typeof Elements !\x3d\x3d 'undefined' \x26\x26 elements instanceof Elements) // mootools\n      );\n  let i \x3d 0;\n  const j \x3d elements.length;\n  if (isCollectionTyped) {\n    for (; i \x3c j; i +\x3d 1) {\n      callback(elements[i]);\n    }\n  } else {\n    callback(elements);\n  }\n}\n  /**\n   * Class for dimension change detection.\n   *\n   * @param {Element|Element[]|Elements|jQuery} element\n   * @param {Function} callback\n   *\n   * @constructor\n   */\nL.ResizeSensor \x3d function ResizeSensor(element, callback \x3d () \x3d\x3e {}) {\n      /**\n       *\n       * @constructor\n       */\n  function EventQueue() {\n    let q \x3d [];\n    this.add \x3d (ev) \x3d\x3e {\n      q.push(ev);\n    };\n\n    let i;\n    let j;\n    this.call \x3d () \x3d\x3e {\n      for (i \x3d 0, j \x3d q.length; i \x3c j; i +\x3d 1) {\n        q[i].call();\n      }\n    };\n\n    this.remove \x3d (ev) \x3d\x3e {\n      const newQueue \x3d [];\n      for (i \x3d 0, j \x3d q.length; i \x3c j; i +\x3d 1) {\n        if (q[i] !\x3d\x3d ev) newQueue.push(q[i]);\n      }\n      q \x3d newQueue;\n    };\n\n    this.length \x3d () \x3d\x3e q.length;\n  }\n\n      /**\n       *\n       * @param {HTMLElement} element\n       * @param {Function}    resized\n       */\n  function attachResizeEvent(htmlElement, resized) {\n    // Only used for the dirty checking, so the event callback count is limted\n    //  to max 1 call per fps per sensor.\n    // In combination with the event based resize sensor this saves cpu time,\n    // because the sensor is too fast and\n    // would generate too many unnecessary events.\n    const customRequestAnimationFrame \x3d window.requestAnimationFrame ||\n    window.mozRequestAnimationFrame ||\n    window.webkitRequestAnimationFrame ||\n    function delay(fn) {\n      return window.setTimeout(fn, 20);\n    };\n\n    const newElement \x3d htmlElement;\n    if (!newElement.resizedAttached) {\n      newElement.resizedAttached \x3d new EventQueue();\n      newElement.resizedAttached.add(resized);\n    } else if (newElement.resizedAttached) {\n      newElement.resizedAttached.add(resized);\n      return;\n    }\n\n    newElement.resizeSensor \x3d document.createElement('div');\n    newElement.resizeSensor.className \x3d 'resize-sensor';\n    const style \x3d 'position: absolute; left: 0; top: 0; right: 0; bottom: 0; ' +\n                      'overflow: hidden; z-index: -1; visibility: hidden;';\n    const styleChild \x3d 'position: absolute; left: 0; top: 0; transition: 0s;';\n\n    newElement.resizeSensor.style.cssText \x3d style;\n    newElement.resizeSensor.innerHTML \x3d\n              `\x3cdiv class\x3d\"resize-sensor-expand\" style\x3d\"${style}\"\x3e` +\n                  `\x3cdiv style\x3d\"${styleChild}\"\x3e\x3c/div\x3e` +\n              '\x3c/div\x3e' +\n              `\x3cdiv class\x3d\"resize-sensor-shrink\" style\x3d\"${style}\"\x3e` +\n                  `\x3cdiv style\x3d\"${styleChild} width: 200%; height: 200%\"\x3e\x3c/div\x3e` +\n              '\x3c/div\x3e';\n    newElement.appendChild(newElement.resizeSensor);\n\n    if (L.GetComputedStyle(newElement, 'position') \x3d\x3d\x3d 'static') {\n      newElement.style.position \x3d 'relative';\n    }\n\n    const expand \x3d newElement.resizeSensor.childNodes[0];\n    const expandChild \x3d expand.childNodes[0];\n    const shrink \x3d newElement.resizeSensor.childNodes[1];\n\n    const reset \x3d () \x3d\x3e {\n      expandChild.style.width \x3d `${100000}px`;\n      expandChild.style.height \x3d `${100000}px`;\n\n      expand.scrollLeft \x3d 100000;\n      expand.scrollTop \x3d 100000;\n\n      shrink.scrollLeft \x3d 100000;\n      shrink.scrollTop \x3d 100000;\n    };\n\n    reset();\n    let dirty \x3d false;\n\n    const dirtyChecking \x3d () \x3d\x3e {\n      if (!newElement.resizedAttached) return;\n\n      if (dirty) {\n        newElement.resizedAttached.call();\n        dirty \x3d false;\n      }\n\n      customRequestAnimationFrame(dirtyChecking);\n    };\n\n    customRequestAnimationFrame(dirtyChecking);\n    let lastWidth;\n    let lastHeight;\n    let cachedWidth;\n    let cachedHeight; // useful to not query offsetWidth twice\n\n    const onScroll \x3d () \x3d\x3e {\n      if ((cachedWidth \x3d newElement.offsetWidth) !\x3d\x3d lastWidth ||\n                (cachedHeight \x3d newElement.offsetHeight) !\x3d\x3d lastHeight) {\n        dirty \x3d true;\n\n        lastWidth \x3d cachedWidth;\n        lastHeight \x3d cachedHeight;\n      }\n      reset();\n    };\n\n    const addEvent \x3d (el, name, cb) \x3d\x3e {\n      if (el.attachEvent) {\n        el.attachEvent(`on${name}`, cb);\n      } else {\n        el.addEventListener(name, cb);\n      }\n    };\n\n    addEvent(expand, 'scroll', onScroll);\n    addEvent(shrink, 'scroll', onScroll);\n  }\n\n  forEachElement(element, (elem) \x3d\x3e {\n    attachResizeEvent(elem, callback);\n  });\n\n  this.detach \x3d (ev) \x3d\x3e {\n    L.ResizeSensor.detach(element, ev);\n  };\n};\n\nL.ResizeSensor.detach \x3d (element, ev) \x3d\x3e {\n  forEachElement(element, (elem) \x3d\x3e {\n    const elementItem \x3d elem;\n    if (elementItem.resizedAttached \x26\x26 typeof ev \x3d\x3d\x3d 'function') {\n      elementItem.resizedAttached.remove(ev);\n      if (elementItem.resizedAttached.length()) return;\n    }\n    if (elementItem.resizeSensor) {\n      if (elementItem.contains(elementItem.resizeSensor)) {\n        elementItem.removeChild(elementItem.resizeSensor);\n      }\n      delete elementItem.resizeSensor;\n      delete elementItem.resizedAttached;\n    }\n  });\n};\n"
}])["default"];
//# sourceMappingURL=erizo.js.map
