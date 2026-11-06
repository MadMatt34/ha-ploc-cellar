const q = globalThis, Z = q.ShadowRoot && (q.ShadyCSS === void 0 || q.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Q = /* @__PURE__ */ Symbol(), it = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== Q) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (Z && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = it.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && it.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (e) => new mt(typeof e == "string" ? e : e + "", void 0, Q), K = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, n, o) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[o + 1], e[0]);
  return new mt(s, e, Q);
}, wt = (e, t) => {
  if (Z) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), n = q.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = s.cssText, e.appendChild(i);
  }
}, nt = Z ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return bt(s);
})(e) : e;
const { is: xt, defineProperty: kt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Ct, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, W = globalThis, ot = W.trustedTypes, Pt = ot ? ot.emptyScript : "", Ot = W.reactiveElementPolyfillSupport, U = (e, t) => e, B = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Pt : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let s = e;
  switch (t) {
    case Boolean:
      s = e !== null;
      break;
    case Number:
      s = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        s = JSON.parse(e);
      } catch {
        s = null;
      }
  }
  return s;
} }, X = (e, t) => !xt(e, t), rt = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: X };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), W.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = rt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, i, s);
      n !== void 0 && kt(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: n, set: o } = At(this.prototype, t) ?? { get() {
      return this[s];
    }, set(r) {
      this[s] = r;
    } };
    return { get: n, set(r) {
      const c = n?.call(this);
      o?.call(this, r), this.requestUpdate(t, c, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(U("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(U("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(U("properties"))) {
      const s = this.properties, i = [...Ct(s), ...St(s)];
      for (const n of i) this.createProperty(n, s[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, n] of s) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const n = this._$Eu(s, i);
      n !== void 0 && this._$Eh.set(n, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) s.unshift(nt(n));
    } else t !== void 0 && s.push(nt(t));
    return s;
  }
  static _$Eu(t, s) {
    const i = s.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), s = this.constructor.elementProperties;
    for (const i of s.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return wt(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, s, i) {
    this._$AK(t, i);
  }
  _$ET(t, s) {
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : B).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(n) : this.setAttribute(n, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const o = i.getPropertyOptions(n), r = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : B;
      this._$Em = n;
      const c = r.fromAttribute(s, o.type);
      this[n] = c ?? this._$Ej?.get(n) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, n = !1, o) {
    if (t !== void 0) {
      const r = this.constructor;
      if (n === !1 && (o = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? X)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: n, wrapped: o }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), o !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (s) {
      Promise.reject(s);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [n, o] of this._$Ep) this[n] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, o] of i) {
        const { wrapped: r } = o, c = this[n];
        r !== !0 || this._$AL.has(n) || c === void 0 || this.C(n, void 0, o, c);
      }
    }
    let t = !1;
    const s = this._$AL;
    try {
      t = this.shouldUpdate(s), t ? (this.willUpdate(s), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(s)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(s);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((s) => s.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((s) => this._$ET(s, this[s])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[U("elementProperties")] = /* @__PURE__ */ new Map(), P[U("finalized")] = /* @__PURE__ */ new Map(), Ot?.({ ReactiveElement: P }), (W.reactiveElementVersions ??= []).push("2.1.2");
const Y = globalThis, at = (e) => e, V = Y.trustedTypes, ct = V ? V.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + w, Nt = `<${vt}>`, C = document, z = () => C.createComment(""), I = (e) => e === null || typeof e != "object" && typeof e != "function", tt = Array.isArray, Rt = (e) => tt(e) || typeof e?.[Symbol.iterator] == "function", J = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, dt = />/g, k = RegExp(`>|${J}(?:([^\\s"'>=/]+)(${J}*=${J}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), pt = /'/g, ht = /"/g, $t = /^(?:script|style|textarea|title)$/i, Mt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), d = Mt(1), O = /* @__PURE__ */ Symbol.for("lit-noChange"), p = /* @__PURE__ */ Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), A = C.createTreeWalker(C, 129);
function yt(e, t) {
  if (!tt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Ut = (e, t) => {
  const s = e.length - 1, i = [];
  let n, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = M;
  for (let c = 0; c < s; c++) {
    const a = e[c];
    let l, u, h = -1, v = 0;
    for (; v < a.length && (r.lastIndex = v, u = r.exec(a), u !== null); ) v = r.lastIndex, r === M ? u[1] === "!--" ? r = lt : u[1] !== void 0 ? r = dt : u[2] !== void 0 ? ($t.test(u[2]) && (n = RegExp("</" + u[2], "g")), r = k) : u[3] !== void 0 && (r = k) : r === k ? u[0] === ">" ? (r = n ?? M, h = -1) : u[1] === void 0 ? h = -2 : (h = r.lastIndex - u[2].length, l = u[1], r = u[3] === void 0 ? k : u[3] === '"' ? ht : pt) : r === ht || r === pt ? r = k : r === lt || r === dt ? r = M : (r = k, n = void 0);
    const b = r === k && e[c + 1].startsWith("/>") ? " " : "";
    o += r === M ? a + Nt : h >= 0 ? (i.push(l), a.slice(0, h) + ft + a.slice(h) + w + b) : a + w + (h === -2 ? c : b);
  }
  return [yt(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: s }, i) {
    let n;
    this.parts = [];
    let o = 0, r = 0;
    const c = t.length - 1, a = this.parts, [l, u] = Ut(t, s);
    if (this.el = T.createElement(l, i), A.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (n = A.nextNode()) !== null && a.length < c; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const h of n.getAttributeNames()) if (h.endsWith(ft)) {
          const v = u[r++], b = n.getAttribute(h).split(w), H = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: o, name: H[2], strings: b, ctor: H[1] === "." ? It : H[1] === "?" ? Tt : H[1] === "@" ? Dt : F }), n.removeAttribute(h);
        } else h.startsWith(w) && (a.push({ type: 6, index: o }), n.removeAttribute(h));
        if ($t.test(n.tagName)) {
          const h = n.textContent.split(w), v = h.length - 1;
          if (v > 0) {
            n.textContent = V ? V.emptyScript : "";
            for (let b = 0; b < v; b++) n.append(h[b], z()), A.nextNode(), a.push({ type: 2, index: ++o });
            n.append(h[v], z());
          }
        }
      } else if (n.nodeType === 8) if (n.data === vt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = n.data.indexOf(w, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += w.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = C.createElement("template");
    return i.innerHTML = t, i;
  }
}
function N(e, t, s = e, i) {
  if (t === O) return t;
  let n = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = I(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== o && (n?._$AO?.(!1), o === void 0 ? n = void 0 : (n = new o(e), n._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = n : s._$Cl = n), n !== void 0 && (t = N(e, n._$AS(e, t.values), n, i)), t;
}
class zt {
  constructor(t, s) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = s;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: s }, parts: i } = this._$AD, n = (t?.creationScope ?? C).importNode(s, !0);
    A.currentNode = n;
    let o = A.nextNode(), r = 0, c = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let l;
        a.type === 2 ? l = new D(o, o.nextSibling, this, t) : a.type === 1 ? l = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (l = new Lt(o, this, t)), this._$AV.push(l), a = i[++c];
      }
      r !== a?.index && (o = A.nextNode(), r++);
    }
    return A.currentNode = C, n;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class D {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, n) {
    this.type = 2, this._$AH = p, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const s = this._$AM;
    return s !== void 0 && t?.nodeType === 11 && (t = s.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, s = this) {
    t = N(this, t, s), I(t) ? t === p || t == null || t === "" ? (this._$AH !== p && this._$AR(), this._$AH = p) : t !== this._$AH && t !== O && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== p && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(C.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(s);
    else {
      const o = new zt(n, this), r = o.u(this.options);
      o.p(s), this.T(r), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = ut.get(t.strings);
    return s === void 0 && ut.set(t.strings, s = new T(t)), s;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, n = 0;
    for (const o of t) n === s.length ? s.push(i = new D(this.O(z()), this.O(z()), this, this.options)) : i = s[n], i._$AI(o), n++;
    n < s.length && (this._$AR(i && i._$AB.nextSibling, n), s.length = n);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = at(t).nextSibling;
      at(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class F {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, n, o) {
    this.type = 1, this._$AH = p, this._$AN = void 0, this.element = t, this.name = s, this._$AM = n, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = p;
  }
  _$AI(t, s = this, i, n) {
    const o = this.strings;
    let r = !1;
    if (o === void 0) t = N(this, t, s, 0), r = !I(t) || t !== this._$AH && t !== O, r && (this._$AH = t);
    else {
      const c = t;
      let a, l;
      for (t = o[0], a = 0; a < o.length - 1; a++) l = N(this, c[i + a], s, a), l === O && (l = this._$AH[a]), r ||= !I(l) || l !== this._$AH[a], l === p ? t = p : t !== p && (t += (l ?? "") + o[a + 1]), this._$AH[a] = l;
    }
    r && !n && this.j(t);
  }
  j(t) {
    t === p ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends F {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === p ? void 0 : t;
  }
}
class Tt extends F {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== p);
  }
}
class Dt extends F {
  constructor(t, s, i, n, o) {
    super(t, s, i, n, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = N(this, t, s, 0) ?? p) === O) return;
    const i = this._$AH, n = t === p && i !== p || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== p && (i === p || n);
    n && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Lt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    N(this, t);
  }
}
const jt = Y.litHtmlPolyfillSupport;
jt?.(T, D), (Y.litHtmlVersions ??= []).push("3.3.3");
const Ht = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = n = new D(t.insertBefore(z(), o), o, void 0, s ?? {});
  }
  return n._$AI(e), n;
};
const et = globalThis;
class x extends P {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ht(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return O;
  }
}
x._$litElement$ = !0, x.finalized = !0, et.litElementHydrateSupport?.({ LitElement: x });
const qt = et.litElementPolyfillSupport;
qt?.({ LitElement: x });
(et.litElementVersions ??= []).push("4.2.2");
const L = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Bt = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: X }, Vt = (e = Bt, t, s) => {
  const { kind: i, metadata: n } = s;
  let o = globalThis.litPropertyMetadata.get(n);
  if (o === void 0 && globalThis.litPropertyMetadata.set(n, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(s.name, e), i === "accessor") {
    const { name: r } = s;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(r, a, e, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(r, void 0, e, c), c;
    } };
  }
  if (i === "setter") {
    const { name: r } = s;
    return function(c) {
      const a = this[r];
      t.call(this, c), this.requestUpdate(r, a, e, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function j(e) {
  return (t, s) => typeof s == "object" ? Vt(e, t, s) : ((i, n, o) => {
    const r = n.hasOwnProperty(o);
    return n.constructor.createProperty(o, i), r ? Object.getOwnPropertyDescriptor(n, o) : void 0;
  })(e, t, s);
}
function g(e) {
  return j({ ...e, state: !0, attribute: !1 });
}
const Gt = "Ploc Cellar", Wt = "Cellar storage", Ft = "Refresh", Jt = "Loading…", Zt = "Never", Qt = "Bottles in cellar", Kt = "Reconstructed stock", Xt = "Racks", Yt = "Empty positions", te = "Data may be stale: the latest synchronization failed.", ee = "Stock reconstruction is incomplete: only physical quantities are available.", se = "Last successful synchronization", ie = "Search wines", ne = "Search wines…", oe = "No matching wines.", re = "Select a Ploc Cellar configuration in the card editor.", ae = "Rack selection", ce = "occupied", le = "free", de = "Unknown wine", pe = "Empty position", he = "Row", ue = "Column", ge = "No row/column coordinates are available for this rack.", _e = "Positions without coordinates", me = "Not mapped", fe = "No racks available.", ve = "position(s) reference a missing rack.", $e = "Wine inventory", ye = "All colors", be = "All regions", we = "All appellations", xe = "All vintages", ke = "Sort by", Ae = "Name", Ce = "Quantity descending", Se = "Vintage descending", Ee = "{count} wine(s)", Pe = "{count} bottle(s)", Oe = "Clear filters", Ne = "btl.", Re = "Unknown vintage", Me = "Wine details", Ue = "Grapes", ze = "Cuvée", Ie = "Volume", Te = "Locations", De = "Ploc Cellar", Le = "Cellar overview and stock indicators.", je = "Wine inventory", He = "Search, filter and browse the wine inventory.", qe = "Cellar racks", Be = "Visualize rack positions and the wines stored in them.", Ve = "Ploc Cellar configuration", Ge = "Select the PLOUD connection used by this card.", We = "Card title", Fe = "Optional. Leave empty to use the default title.", Je = "Cellar statistics", Ze = "Bottles in stock", Qe = "wine references", Ke = "By color", Xe = "By region", Ye = "By appellation", ts = "By vintage", es = "By bottle format", ss = "Other", is = "Not specified", ns = "No data available for this category.", os = "Unknown", rs = "Wine references in stock", as = "Rack occupancy", cs = "Stock diagnostics", ls = "Unlocated bottles", ds = "Negative movement balance", ps = "Physical surplus", hs = "Breakdowns include known wine references only.", us = "{count} occupied position(s) have an unknown wine reference. They are included in total stock but not in the breakdowns.", gs = {
  card_title: Gt,
  rack_title: Wt,
  refresh: Ft,
  loading: Jt,
  never: Zt,
  bottles_in_cellar: Qt,
  reconstructed_stock: Kt,
  racks: Xt,
  empty_positions: Yt,
  stale: te,
  reconstruction_incomplete: ee,
  last_sync: se,
  search_wine: ie,
  search_placeholder: ne,
  no_matching_wines: oe,
  select_config: re,
  rack_selection: ae,
  occupied: ce,
  free: le,
  unknown_wine: de,
  empty_position: pe,
  row: he,
  column: ue,
  no_coordinates: ge,
  positions_without_coordinates: _e,
  not_mapped: me,
  no_racks: fe,
  missing_rack: ve,
  inventory_title: $e,
  filter_color: ye,
  filter_region: be,
  filter_appellation: we,
  filter_vintage: xe,
  sort_by: ke,
  sort_name: Ae,
  sort_bottles: Ce,
  sort_vintage: Se,
  inventory_results: Ee,
  inventory_bottle_total: Pe,
  clear_filters: Oe,
  bottles_short: Ne,
  unknown_vintage: Re,
  wine_details: Me,
  grapes: Ue,
  cuvee: ze,
  bottle_volume: Ie,
  locations: Te,
  picker_overview_name: De,
  picker_overview_description: Le,
  picker_inventory_name: je,
  picker_inventory_description: He,
  picker_rack_name: qe,
  picker_rack_description: Be,
  editor_configuration: Ve,
  editor_configuration_helper: Ge,
  editor_title: We,
  editor_title_helper: Fe,
  statistics_title: Je,
  statistics_bottles: Ze,
  statistics_references: Qe,
  statistics_color: Ke,
  statistics_region: Xe,
  statistics_appellation: Ye,
  statistics_vintage: ts,
  statistics_format: es,
  statistics_other: ss,
  statistics_unknown: is,
  statistics_empty: ns,
  unknown_value: os,
  stocked_references: rs,
  rack_occupancy: as,
  inventory_diagnostics: cs,
  diagnostic_unlocated: ls,
  diagnostic_negative: ds,
  diagnostic_surplus: ps,
  statistics_distribution_scope: hs,
  statistics_unknown_wine_positions: us
}, _s = "Cave Ploc", ms = "Rangement de la cave", fs = "Actualiser", vs = "Chargement…", $s = "Jamais", ys = "Bouteilles en cave", bs = "Stock reconstitué", ws = "Casiers", xs = "Places libres", ks = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", As = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", Cs = "Dernière synchronisation réussie", Ss = "Rechercher un vin", Es = "Rechercher un vin…", Ps = "Aucun vin correspondant.", Os = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", Ns = "Sélection du casier", Rs = "occupées", Ms = "libres", Us = "Vin inconnu", zs = "Emplacement libre", Is = "Rangée", Ts = "Colonne", Ds = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", Ls = "Emplacements sans coordonnées", js = "Non renseigné", Hs = "Aucun casier disponible.", qs = "emplacement(s) référencent un casier absent.", Bs = "Inventaire des vins", Vs = "Toutes les couleurs", Gs = "Toutes les régions", Ws = "Toutes les appellations", Fs = "Tous les millésimes", Js = "Trier par", Zs = "Nom", Qs = "Quantité décroissante", Ks = "Millésime décroissant", Xs = "{count} référence(s)", Ys = "{count} bouteille(s)", ti = "Effacer les filtres", ei = "bt.", si = "Millésime inconnu", ii = "Détails du vin", ni = "Cépages", oi = "Cuvée", ri = "Volume", ai = "Emplacements", ci = "Cave Ploc", li = "Vue d’ensemble de la cave et indicateurs de stock.", di = "Inventaire des vins", pi = "Rechercher, filtrer et parcourir l’inventaire des vins.", hi = "Casiers de la cave", ui = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", gi = "Configuration Ploc Cellar", _i = "Sélectionnez la connexion PLOUD utilisée par cette carte.", mi = "Titre de la carte", fi = "Facultatif. Laissez vide pour utiliser le titre par défaut.", vi = "Statistiques de la cave", $i = "Bouteilles en stock", yi = "références de vin", bi = "Par couleur", wi = "Par région", xi = "Par appellation", ki = "Par millésime", Ai = "Par format de bouteille", Ci = "Autres", Si = "Non renseigné", Ei = "Aucune donnée disponible pour cette catégorie.", Pi = "Inconnu", Oi = "Références de vins en stock", Ni = "Occupation des casiers", Ri = "Diagnostics du stock", Mi = "Bouteilles non localisées", Ui = "Solde de mouvements négatif", zi = "Excédent physique", Ii = "Les répartitions ne portent que sur les références de vins connues.", Ti = "{count} emplacement(s) occupé(s) font référence à un vin inconnu. Ils sont inclus dans le stock total, mais pas dans les répartitions.", Di = {
  card_title: _s,
  rack_title: ms,
  refresh: fs,
  loading: vs,
  never: $s,
  bottles_in_cellar: ys,
  reconstructed_stock: bs,
  racks: ws,
  empty_positions: xs,
  stale: ks,
  reconstruction_incomplete: As,
  last_sync: Cs,
  search_wine: Ss,
  search_placeholder: Es,
  no_matching_wines: Ps,
  select_config: Os,
  rack_selection: Ns,
  occupied: Rs,
  free: Ms,
  unknown_wine: Us,
  empty_position: zs,
  row: Is,
  column: Ts,
  no_coordinates: Ds,
  positions_without_coordinates: Ls,
  not_mapped: js,
  no_racks: Hs,
  missing_rack: qs,
  inventory_title: Bs,
  filter_color: Vs,
  filter_region: Gs,
  filter_appellation: Ws,
  filter_vintage: Fs,
  sort_by: Js,
  sort_name: Zs,
  sort_bottles: Qs,
  sort_vintage: Ks,
  inventory_results: Xs,
  inventory_bottle_total: Ys,
  clear_filters: ti,
  bottles_short: ei,
  unknown_vintage: si,
  wine_details: ii,
  grapes: ni,
  cuvee: oi,
  bottle_volume: ri,
  locations: ai,
  picker_overview_name: ci,
  picker_overview_description: li,
  picker_inventory_name: di,
  picker_inventory_description: pi,
  picker_rack_name: hi,
  picker_rack_description: ui,
  editor_configuration: gi,
  editor_configuration_helper: _i,
  editor_title: mi,
  editor_title_helper: fi,
  statistics_title: vi,
  statistics_bottles: $i,
  statistics_references: yi,
  statistics_color: bi,
  statistics_region: wi,
  statistics_appellation: xi,
  statistics_vintage: ki,
  statistics_format: Ai,
  statistics_other: Ci,
  statistics_unknown: Si,
  statistics_empty: Ei,
  unknown_value: Pi,
  stocked_references: Oi,
  rack_occupancy: Ni,
  inventory_diagnostics: Ri,
  diagnostic_unlocated: Mi,
  diagnostic_negative: Ui,
  diagnostic_surplus: zi,
  statistics_distribution_scope: Ii,
  statistics_unknown_wine_positions: Ti
};
function m(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? Di : gs)[t];
}
function R(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return m(t, e);
}
var Li = Object.defineProperty, ji = Object.getOwnPropertyDescriptor, S = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? ji(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (i ? r(t, s, n) : r(n)) || n);
  return i && n && Li(t, s, n), n;
};
let $ = class extends x {
  constructor() {
    super(...arguments), this.loading = !1, this.requestGeneration = 0;
  }
  static getConfigElement() {
    return document.createElement("ploc-cellar-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this.requestGeneration += 1, this.loading = !1, this.config = e, this.inventory = void 0, this.error = void 0, this.config.config_entry_id && this.refresh();
  }
  updated() {
    this.hass && this.config && !this.inventory && !this.loading && !this.error && this.refresh();
  }
  async refresh() {
    const e = this.hass, t = this.config;
    if (!e || !t?.config_entry_id || this.loading) return;
    const s = t.config_entry_id, i = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = n.response, (!this.selectedRackId || !this.inventory.racks.some((o) => o.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
    } catch (n) {
      i === this.requestGeneration && (this.error = n instanceof Error ? n.message : String(n));
    } finally {
      i === this.requestGeneration && (this.loading = !1);
    }
  }
  get selectedItems() {
    return (this.inventory?.rack_items ?? []).filter((e) => e.rack_id === this.selectedRackId);
  }
  get positionedItems() {
    return this.selectedItems.filter(
      (e) => e.row !== null && e.column !== null
    );
  }
  get rowValues() {
    return this.positionedItems.map((e) => e.row);
  }
  get columnValues() {
    return this.positionedItems.map((e) => e.column);
  }
  get firstRow() {
    return Math.min(...this.rowValues);
  }
  get firstColumn() {
    return Math.min(...this.columnValues);
  }
  get rowCount() {
    return Math.max(...this.rowValues) - this.firstRow + 1;
  }
  get columnCount() {
    return Math.max(...this.columnValues) - this.firstColumn + 1;
  }
  get missingCoordinates() {
    if (!this.positionedItems.length) return [];
    const e = new Set(
      this.positionedItems.map((s) => `${s.row}:${s.column}`)
    ), t = [];
    for (let s = this.firstRow; s <= Math.max(...this.rowValues); s += 1)
      for (let i = this.firstColumn; i <= Math.max(...this.columnValues); i += 1)
        e.has(`${s}:${i}`) || t.push({ row: s, column: i });
    return t;
  }
  get wineById() {
    return new Map((this.inventory?.wines ?? []).map((e) => [e.id, e]));
  }
  wineLabel(e) {
    if (!e.wine_id) return "";
    const t = this.wineById.get(e.wine_id);
    return t ? t.name : m(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const e = (a) => m(this.hass?.language ?? "en", a), t = this.inventory, s = t?.racks.find((a) => a.id === this.selectedRackId), i = this.rowValues, n = this.columnValues, o = this.positionedItems, r = this.selectedItems.filter((a) => a.row === null || a.column === null), c = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((l) => l.id === a.rack_id)
    );
    return d`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? d`<div class="error">${this.error}</div>` : p}
        ${this.config?.config_entry_id ? p : d`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? d`<div class="warning">${e("stale")}</div>` : p}
        ${t?.racks.length ? d`
          <nav class="rack-picker" aria-label=${e("rack_selection")}>
            ${t.racks.map((a) => d`
              <button aria-pressed=${a.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = a.id;
    }}>${a.name}</button>
            `)}
          </nav>
          <div class="legend">${s?.name ?? ""} · ${this.selectedItems.filter((a) => a.wine_id).length} ${e("occupied")} · ${this.selectedItems.filter((a) => !a.wine_id).length} ${e("free")}</div>
          ${i.length && n.length ? d`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${o.map((a) => {
      const l = a.row - this.firstRow + 1, u = a.column - this.firstColumn + 1, h = !!a.wine_id;
      return d`
                    <div class=${h ? "slot occupied" : "slot"}
                      style=${`grid-row: ${l}; grid-column: ${u};`}
                      title=${this.wineLabel(a) || e("empty_position")}>
                      <strong>${h ? this.wineLabel(a) : "—"}</strong>
                      <small>${e("row")} ${a.row} · ${e("column")} ${a.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((a) => d`
                  <div class="slot missing"
                    style=${`grid-row: ${a.row - this.firstRow + 1}; grid-column: ${a.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${e("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : d`<div class="warning">${e("no_coordinates")}</div>`}
          ${r.length ? d`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${r.map((a) => d`<div class="unplaced-item">${this.wineLabel(a) || e("empty_position")}</div>`)}
            </div>
          ` : p}
        ` : d`<p class="muted">${e("no_racks")}</p>`}
        ${c.length ? d`
          <div class="warning">${c.length} ${e("missing_rack")}</div>
        ` : p}
      </ha-card>
    `;
  }
  getCardSize() {
    return 5;
  }
  getGridOptions() {
    return {
      columns: 12,
      min_columns: 6,
      rows: 5,
      min_rows: 4
    };
  }
};
$.styles = K`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.2rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 1px solid var(--divider-color); border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[aria-pressed="true"] { border-color: var(--primary-color); background: var(--secondary-background-color); }
    button[disabled] { opacity: .5; cursor: default; }
    .rack-picker { display: flex; flex-wrap: wrap; gap: 8px; margin: 14px 0; }
    .grid-wrap { overflow-x: auto; padding: 4px 0 12px; }
    .rack-grid { display: grid; gap: 6px; min-width: min-content; }
    .slot { min-width: 76px; min-height: 64px; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; padding: 6px; border-radius: 8px; border: 1px solid var(--divider-color); background: var(--secondary-background-color); box-sizing: border-box; }
    .slot.occupied { border-color: var(--primary-color); background: var(--card-background-color); }
    .slot.missing { border-style: dashed; color: var(--secondary-text-color); background: transparent; }
    .slot strong { font-size: .9rem; }
    .slot small { color: var(--secondary-text-color); font-size: .75rem; }
    .legend, .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    .unplaced { border-top: 1px solid var(--divider-color); padding-top: 10px; margin-top: 10px; }
    .unplaced-item { padding: 5px 0; }
  `;
S([
  j({ attribute: !1 })
], $.prototype, "hass", 2);
S([
  g()
], $.prototype, "config", 2);
S([
  g()
], $.prototype, "inventory", 2);
S([
  g()
], $.prototype, "selectedRackId", 2);
S([
  g()
], $.prototype, "loading", 2);
S([
  g()
], $.prototype, "error", 2);
$ = S([
  L("ploc-cellar-rack-card")
], $);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: R("picker_rack_name"),
  description: R("picker_rack_description")
});
var Hi = Object.defineProperty, qi = Object.getOwnPropertyDescriptor, f = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? qi(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (i ? r(t, s, n) : r(n)) || n);
  return i && n && Hi(t, s, n), n;
};
let _ = class extends x {
  constructor() {
    super(...arguments), this.loading = !1, this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name", this.requestGeneration = 0;
  }
  static getConfigElement() {
    return document.createElement("ploc-cellar-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this.requestGeneration += 1, this.loading = !1, this.config = e, this.inventory = void 0, this.error = void 0, e.config_entry_id && this.refresh();
  }
  updated() {
    this.hass && this.config && !this.inventory && !this.loading && !this.error && this.refresh();
  }
  async refresh() {
    const e = this.hass, t = this.config;
    if (!e || !t?.config_entry_id || this.loading) return;
    const s = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const i = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: t.config_entry_id },
        return_response: !0
      });
      s === this.requestGeneration && (this.inventory = i.response);
    } catch (i) {
      s === this.requestGeneration && (this.error = i instanceof Error ? i.message : String(i));
    } finally {
      s === this.requestGeneration && (this.loading = !1);
    }
  }
  valuesFor(e) {
    const t = (this.inventory?.wines ?? []).map((s) => s[e]).filter((s) => s !== null && s !== "");
    return [...new Set(t.map(String))].sort(
      (s, i) => s.localeCompare(i, this.hass?.language ?? void 0, { numeric: !0, sensitivity: "base" })
    );
  }
  get filteredWines() {
    const e = this.search.trim().toLocaleLowerCase(), t = (this.inventory?.wines ?? []).filter((i) => this.color && i.color !== this.color || this.region && i.region !== this.region || this.appellation && i.appellation !== this.appellation || this.vintage && String(i.vintage ?? "") !== this.vintage ? !1 : e ? [
      i.name,
      i.domain,
      i.appellation,
      i.region,
      i.country,
      i.grapes,
      i.cuvee,
      i.color,
      i.vintage,
      i.bottle_format
    ].filter((n) => n != null).join(" ").toLocaleLowerCase().includes(e) : !0), s = new Intl.Collator(this.hass?.language ?? void 0, {
      numeric: !0,
      sensitivity: "base"
    });
    return [...t].sort((i, n) => this.sort === "bottles" ? n.bottles_in_cellar - i.bottles_in_cellar || s.compare(i.name, n.name) : this.sort === "vintage" && (n.vintage ?? 0) - (i.vintage ?? 0) || s.compare(i.name, n.name));
  }
  clearFilters() {
    this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name";
  }
  selectFilter(e, t, s, i) {
    return d`
      <select aria-label=${t} .value=${s}
        @change=${(n) => {
      const o = n.target.value;
      e === "color" ? this.color = o : e === "region" ? this.region = o : e === "appellation" ? this.appellation = o : this.vintage = o;
    }}>
        <option value="" ?selected=${!s}>${t}</option>
        ${i.map((n) => d`<option value=${n} ?selected=${n === s}>${n}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? p : d`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (o) => m(this.hass?.language ?? "en", o), s = e.locations.map((o) => {
      const r = o.row !== null && o.column !== null ? ` · ${t("row")} ${o.row}, ${t("column")} ${o.column}` : "";
      return `${o.rack}${r}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), n = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
    return d`
      <article class="wine">
        <div class="wine-main">
          <div>
            <div class="wine-name">${e.name}</div>
            <div class="metadata">${[
      e.domain,
      e.appellation,
      e.region,
      e.country
    ].filter(Boolean).join(" · ")}</div>
          </div>
          <div class="quantity">${e.bottles_in_cellar} ${t("bottles_short")}</div>
        </div>
        <div class="tags">
          ${e.color ? d`<span class="tag">${e.color}</span>` : p}
          <span class="tag">${i}</span>
          ${e.bottle_format ? d`<span class="tag">${e.bottle_format}</span>` : p}
        </div>
        <details>
          <summary class="metadata">${t("wine_details")}</summary>
          <div class="details">
            ${this.detail(t("grapes"), e.grapes)}
            ${this.detail(t("cuvee"), e.cuvee)}
            ${this.detail(t("bottle_volume"), n)}
            ${this.detail(t("locations"), s.length ? s.join(" · ") : null)}
          </div>
        </details>
      </article>
    `;
  }
  render() {
    const e = (n) => m(this.hass?.language ?? "en", n), t = this.filteredWines, s = t.reduce((n, o) => n + o.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
    return d`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("inventory_title")}</h2>
          <div class="actions">
            <button ?disabled=${this.loading} @click=${() => this.refresh()}>
              ${this.loading ? e("loading") : e("refresh")}
            </button>
          </div>
        </header>
        ${this.error ? d`<div class="error">${this.error}</div>` : p}
        ${this.config?.config_entry_id ? p : d`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? d`<div class="warning">${e("stale")}</div>` : p}
        ${this.inventory ? d`
          <div class="toolbar">
            <input class="search" type="search" aria-label=${e("search_wine")}
              placeholder=${e("search_placeholder")} .value=${this.search}
              @input=${(n) => {
      this.search = n.target.value;
    }} />
            ${this.selectFilter("color", e("filter_color"), this.color, this.valuesFor("color"))}
            ${this.selectFilter("region", e("filter_region"), this.region, this.valuesFor("region"))}
            ${this.selectFilter("appellation", e("filter_appellation"), this.appellation, this.valuesFor("appellation"))}
            ${this.selectFilter("vintage", e("filter_vintage"), this.vintage, this.valuesFor("vintage"))}
            <select aria-label=${e("sort_by")} .value=${this.sort}
              @change=${(n) => {
      this.sort = n.target.value;
    }}>
              <option value="name" ?selected=${this.sort === "name"}>${e("sort_name")}</option>
              <option value="bottles" ?selected=${this.sort === "bottles"}>${e("sort_bottles")}</option>
              <option value="vintage" ?selected=${this.sort === "vintage"}>${e("sort_vintage")}</option>
            </select>
          </div>
          <div class="summary">
            <span>${e("inventory_results").replace("{count}", String(t.length))}</span>
            <span>${e("inventory_bottle_total").replace("{count}", String(s))}</span>
            ${i ? d`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : p}
          </div>
          ${this.inventory.stock_reconstruction_complete ? p : d`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((n) => this.renderWine(n))}
          </div>
          ${t.length === 0 ? d`<p class="muted">${e("no_matching_wines")}</p>` : p}
        ` : p}
      </ha-card>
    `;
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 6, min_rows: 4 };
  }
};
_.styles = K`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.2rem; font-weight: 500; }
    button, select, input {
      color: var(--primary-text-color);
      background: var(--card-background-color);
      border: 1px solid var(--divider-color);
      border-radius: 8px;
      padding: 9px 10px;
      min-width: 0;
    }
    button { background: var(--secondary-background-color); cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    input { box-sizing: border-box; width: 100%; }
    .toolbar { display: grid; grid-template-columns: repeat(auto-fit, minmax(145px, 1fr)); gap: 8px; margin: 14px 0; }
    .search { grid-column: 1 / -1; }
    .summary { display: flex; flex-wrap: wrap; justify-content: space-between; gap: 8px; color: var(--secondary-text-color); font-size: .85rem; margin: 12px 0; }
    .wine-list { display: grid; gap: 8px; }
    .wine { border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .wine-main { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .wine-name { font-weight: 600; line-height: 1.35; overflow-wrap: anywhere; }
    .quantity { flex: 0 0 auto; white-space: nowrap; font-weight: 600; }
    .metadata { color: var(--secondary-text-color); font-size: .85rem; margin-top: 5px; line-height: 1.45; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 9px; }
    .tag { border-radius: 999px; background: var(--secondary-background-color); padding: 3px 8px; font-size: .75rem; }
    .details { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 6px 12px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--divider-color); font-size: .82rem; }
    .detail-label { color: var(--secondary-text-color); display: block; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .actions { display: flex; gap: 8px; align-items: center; }
    @media (max-width: 420px) {
      ha-card { padding: 12px; }
      .toolbar { grid-template-columns: 1fr 1fr; }
    }
  `;
f([
  j({ attribute: !1 })
], _.prototype, "hass", 2);
f([
  g()
], _.prototype, "config", 2);
f([
  g()
], _.prototype, "inventory", 2);
f([
  g()
], _.prototype, "loading", 2);
f([
  g()
], _.prototype, "error", 2);
f([
  g()
], _.prototype, "search", 2);
f([
  g()
], _.prototype, "color", 2);
f([
  g()
], _.prototype, "region", 2);
f([
  g()
], _.prototype, "appellation", 2);
f([
  g()
], _.prototype, "vintage", 2);
f([
  g()
], _.prototype, "sort", 2);
_ = f([
  L("ploc-cellar-inventory-card")
], _);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: R("picker_inventory_name"),
  description: R("picker_inventory_description")
});
var Bi = Object.defineProperty, Vi = Object.getOwnPropertyDescriptor, st = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Vi(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (i ? r(t, s, n) : r(n)) || n);
  return i && n && Bi(t, s, n), n;
};
let G = class extends x {
  constructor() {
    super(...arguments), this.schema = [
      {
        name: "config_entry_id",
        required: !0,
        selector: { config_entry: { integration: "ploc_cellar" } }
      },
      { name: "title", selector: { text: {} } }
    ], this.computeLabel = (e) => {
      const t = e.name === "config_entry_id" ? "editor_configuration" : "editor_title";
      return m(this.hass?.language ?? "en", t);
    }, this.computeHelper = (e) => {
      if (e.name === "config_entry_id")
        return m(this.hass?.language ?? "en", "editor_configuration_helper");
      if (e.name === "title")
        return m(this.hass?.language ?? "en", "editor_title_helper");
    };
  }
  setConfig(e) {
    this.config = e;
  }
  valueChanged(e) {
    e.stopPropagation();
    const t = { ...this.config, ...e.detail.value };
    this.config = t, this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: t },
        bubbles: !0,
        composed: !0
      })
    );
  }
  render() {
    return d`
      <ha-form
        .hass=${this.hass}
        .data=${this.config ?? {}}
        .schema=${this.schema}
        .computeLabel=${this.computeLabel}
        .computeHelper=${this.computeHelper}
        @value-changed=${this.valueChanged}
      ></ha-form>
    `;
  }
};
st([
  j({ attribute: !1 })
], G.prototype, "hass", 2);
st([
  g()
], G.prototype, "config", 2);
G = st([
  L("ploc-cellar-card-editor")
], G);
var Gi = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, E = (e, t, s, i) => {
  for (var n = i > 1 ? void 0 : i ? Wi(t, s) : t, o = e.length - 1, r; o >= 0; o--)
    (r = e[o]) && (n = (i ? r(t, s, n) : r(n)) || n);
  return i && n && Gi(t, s, n), n;
};
const gt = [
  "#D55E00",
  "#0072B2",
  "#009E73",
  "#E69F00",
  "#CC79A7",
  "#56B4E9",
  "#F0E442",
  "#6A3D9A"
];
let y = class extends x {
  constructor() {
    super(...arguments), this.loading = !1, this.requestGeneration = 0;
  }
  static getConfigElement() {
    return document.createElement("ploc-cellar-card-editor");
  }
  static getStubConfig() {
    return {};
  }
  setConfig(e) {
    this.requestGeneration += 1, this.loading = !1, this.config = e, this.inventory = void 0, this.error = void 0, e.config_entry_id && this.refresh();
  }
  updated() {
    this.hass && this.config && !this.inventory && !this.loading && !this.error && this.refresh();
  }
  async refresh() {
    const e = this.hass, t = this.config;
    if (!e || !t?.config_entry_id || this.loading) return;
    const s = t.config_entry_id, i = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = n.response);
    } catch (n) {
      i === this.requestGeneration && (this.error = n instanceof Error ? n.message : String(n));
    } finally {
      i === this.requestGeneration && (this.loading = !1);
    }
  }
  formatNumber(e) {
    return new Intl.NumberFormat(this.hass?.language ?? void 0).format(e);
  }
  formatSync(e) {
    if (!e) return m(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  metric(e, t) {
    return d`
      <div class="metric">
        <span class="value">${typeof e == "number" ? this.formatNumber(e) : e}</span>
        <span class="label">${t}</span>
      </div>
    `;
  }
  getBottleCount(e) {
    return this.inventory?.stock_reconstruction_complete ? e.bottles ?? e.bottles_in_cellar : e.bottles_in_cellar;
  }
  distribution(e) {
    const t = (r) => m(this.hass?.language ?? "en", r), s = /* @__PURE__ */ new Map();
    for (const r of this.inventory?.wines ?? []) {
      const c = r[e], a = c === null || c === "" ? t("statistics_unknown") : String(c), l = s.get(a) ?? { name: a, bottles: 0, wines: 0 };
      if (l.bottles += this.getBottleCount(r), l.wines += 1, e === "color" && r.color_rgb && !l.color) {
        const u = r.color_rgb.map(
          (h) => Math.min(255, Math.max(0, Math.round(h)))
        );
        l.color = `rgb(${u.join(", ")})`;
      }
      s.set(a, l);
    }
    const i = [...s.values()].sort(
      (r, c) => c.bottles - r.bottles || r.name.localeCompare(c.name, this.hass?.language)
    );
    if (i.length <= 8) return i;
    const n = i.slice(0, 7), o = i.slice(7).reduce(
      (r, c) => ({
        name: t("statistics_other"),
        bottles: r.bottles + c.bottles,
        wines: r.wines + c.wines
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 }
    );
    return [...n, o];
  }
  renderDistribution(e, t) {
    const s = (l) => m(this.hass?.language ?? "en", l), i = this.distribution(e), n = i.reduce((l, u) => l + u.bottles, 0);
    let o = 0;
    const r = i.filter((l) => l.bottles > 0).map((l, u) => {
      const h = o;
      return o += l.bottles / n * 100, {
        ...l,
        start: h,
        end: o,
        color: l.color ?? gt[u % gt.length]
      };
    }), c = r.map((l) => `${l.color} ${l.start}% ${l.end}%`).join(", "), a = i.map((l) => `${l.name}: ${this.formatNumber(l.bottles)}`).join(", ");
    return d`
      <section class="group">
        <h3 class="group-title">${s(t)}</h3>
        ${n > 0 ? d`
          <div class="chart-content">
            <div class="donut" role="img"
              aria-label=${s(t) + ": " + a}
              style=${`background: conic-gradient(${c})`}>
              <div class="donut-center">
                <span class="donut-total">${this.formatNumber(n)}</span>
                <span class="donut-caption">${s("statistics_bottles")}</span>
              </div>
            </div>
            <div class="legend">
              ${r.map((l) => d`
                <div class="legend-item">
                  <span class="legend-swatch" style=${`background: ${l.color}`}></span>
                  <span class="legend-name">${l.name}</span>
                  <span class="legend-value">${this.formatNumber(l.bottles)}</span>
                  <span class="legend-meta">
                    ${new Intl.NumberFormat(this.hass?.language ?? void 0, {
      style: "percent",
      maximumFractionDigits: 1
    }).format(l.bottles / n)}
                    · ${this.formatNumber(l.wines)} ${s("statistics_references")}
                  </span>
                </div>
              `)}
            </div>
          </div>
        ` : d`<p class="muted">${s("statistics_empty")}</p>`}
      </section>
    `;
  }
  render() {
    const e = (c) => m(this.hass?.language ?? "en", c), t = this.inventory, s = this.config?.title ?? e("card_title"), i = t && t.total_positions > 0 ? Math.round(t.occupied_positions / t.total_positions * 100) : 0, n = t?.stock_reconstruction_complete ? [
      { key: "diagnostic_unlocated", value: t.unlocated_bottles ?? 0 },
      { key: "diagnostic_negative", value: t.negative_movement_bottles ?? 0 },
      { key: "diagnostic_surplus", value: t.physical_surplus_bottles ?? 0 }
    ].filter((c) => c.value > 0) : [], o = t?.wines ?? [], r = t?.wine_references ?? o.length;
    return d`
      <ha-card>
        <header>
          <h2>${s}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? d`<div class="error">${this.error}</div>` : p}
        ${this.config?.config_entry_id ? p : d`<div class="muted">${e("select_config")}</div>`}
        ${t ? d`
          ${t.stale ? d`<div class="warning">${e("stale")}</div>` : p}
          <div class="summary">
            ${this.metric(t.total_bottles, e("bottles_in_cellar"))}
            ${this.metric(
      t.total_stock_bottles ?? e("unknown_value"),
      e("reconstructed_stock")
    )}
            ${this.metric(r, e("stocked_references"))}
            ${this.metric(t.rack_count, e("racks"))}
          </div>
          <section class="section" aria-label=${e("rack_occupancy")}>
            <div class="occupancy-heading">
              <span>${e("rack_occupancy")}</span>
              <span>${this.formatNumber(t.occupied_positions)} / ${this.formatNumber(t.total_positions)}</span>
            </div>
            <div class="occupancy-bar" role="progressbar"
              aria-label=${e("rack_occupancy")}
              aria-valuemin="0" aria-valuemax=${t.total_positions}
              aria-valuenow=${t.occupied_positions}>
              <div class="occupancy-fill" style=${`width: ${i}%`}></div>
            </div>
            <div class="muted">${e("empty_positions")}: ${this.formatNumber(Math.max(0, t.total_positions - t.occupied_positions))}</div>
          </section>
          ${t.stock_reconstruction_complete ? p : d`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          ${n.length ? d`
            <section class="section">
              <h3 class="section-title">${e("inventory_diagnostics")}</h3>
              <div class="diagnostics">
                ${n.map((c) => d`
                  <div class="diagnostic">
                    <span class="diagnostic-value">${this.formatNumber(c.value)}</span>
                    <span class="label">${e(c.key)}</span>
                  </div>
                `)}
              </div>
            </section>
          ` : p}
          ${t.positions_with_unknown_wine > 0 ? d`<div class="warning">${e("statistics_unknown_wine_positions").replace("{count}", this.formatNumber(t.positions_with_unknown_wine))}</div>` : p}
          <section class="section">
            <h3 class="section-title">${e("statistics_title")}</h3>
            <p class="muted">${e("statistics_distribution_scope")}</p>
            <div class="groups">
              ${this.renderDistribution("color", "statistics_color")}
              ${this.renderDistribution("region", "statistics_region")}
              ${this.renderDistribution("appellation", "statistics_appellation")}
              ${this.renderDistribution("vintage", "statistics_vintage")}
              ${this.renderDistribution("bottle_format", "statistics_format")}
            </div>
          </section>
          <div class="muted section">${e("last_sync")}: ${this.formatSync(t.last_sync)}</div>
        ` : p}
      </ha-card>
    `;
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
};
y.styles = K`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin: 16px 0; }
    .metric { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .value { display: block; font-size: 1.4rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .label, .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .section { margin-top: 16px; }
    .section-title { margin: 0 0 8px; font-size: .95rem; font-weight: 500; }
    .occupancy-heading { display: flex; justify-content: space-between; gap: 8px; margin-bottom: 6px; font-size: .85rem; }
    .occupancy-bar { height: 9px; border-radius: 999px; overflow: hidden; background: var(--divider-color); }
    .occupancy-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .diagnostics { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px; }
    .diagnostic { border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; min-width: 0; }
    .diagnostic-value { display: block; font-weight: 600; font-variant-numeric: tabular-nums; }
    .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 12px; margin-top: 14px; }
    .group { min-width: 0; border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; }
    .group-title { margin: 0 0 12px; font-size: 1rem; font-weight: 500; }
    .chart-content { display: grid; grid-template-columns: minmax(112px, .85fr) minmax(0, 1.15fr); gap: 12px; align-items: center; }
    .donut { display: grid; place-items: center; width: 100%; max-width: 150px; aspect-ratio: 1; border-radius: 50%; justify-self: center; }
    .donut-center { display: flex; flex-direction: column; align-items: center; justify-content: center; width: 66%; aspect-ratio: 1; border-radius: 50%; background: var(--card-background-color, var(--ha-card-background, #fff)); }
    .donut-total { color: var(--primary-text-color); font-size: 1rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .donut-caption { color: var(--secondary-text-color); font-size: .48rem; }
    .legend { display: grid; gap: 8px; min-width: 0; }
    .legend-item { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; align-items: center; gap: 7px; font-size: .82rem; }
    .legend-swatch { width: 9px; height: 9px; border-radius: 50%; }
    .legend-name { min-width: 0; overflow-wrap: anywhere; }
    .legend-value { white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 600; }
    .legend-meta { grid-column: 2 / 4; margin-top: -6px; color: var(--secondary-text-color); font-size: .72rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) {
      ha-card { padding: 12px; }
      .chart-content { grid-template-columns: minmax(96px, .7fr) minmax(0, 1.3fr); gap: 8px; }
      .legend { gap: 6px; }
      .legend-item { font-size: .78rem; }
    }
  `;
E([
  j({ attribute: !1 })
], y.prototype, "hass", 2);
E([
  g()
], y.prototype, "config", 2);
E([
  g()
], y.prototype, "inventory", 2);
E([
  g()
], y.prototype, "loading", 2);
E([
  g()
], y.prototype, "error", 2);
y = E([
  L("ploc-cellar-card")
], y);
let _t = class extends y {
};
_t = E([
  L("ploc-cellar-statistics-card")
], _t);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: R("picker_overview_name"),
  description: R("picker_overview_description")
});
export {
  y as PlocCellarCard,
  _t as PlocCellarStatisticsCard
};
