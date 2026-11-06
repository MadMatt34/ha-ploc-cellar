const G = globalThis, X = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = /* @__PURE__ */ Symbol(), nt = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== Y) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (X && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = nt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && nt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (e) => new mt(typeof e == "string" ? e : e + "", void 0, Y), J = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, o, n) => i + ((r) => {
    if (r._$cssResult$ === !0) return r.cssText;
    if (typeof r == "number") return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[n + 1], e[0]);
  return new mt(s, e, Y);
}, wt = (e, t) => {
  if (X) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), o = G.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = s.cssText, e.appendChild(i);
  }
}, rt = X ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return bt(s);
})(e) : e;
const { is: xt, defineProperty: kt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Ct, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, Z = globalThis, at = Z.trustedTypes, Pt = at ? at.emptyScript : "", Ot = Z.reactiveElementPolyfillSupport, q = (e, t) => e, V = { toAttribute(e, t) {
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
} }, tt = (e, t) => !xt(e, t), ct = { attribute: !0, type: String, converter: V, reflect: !1, useDefault: !1, hasChanged: tt };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Z.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let O = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = ct) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, i, s);
      o !== void 0 && kt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: o, set: n } = At(this.prototype, t) ?? { get() {
      return this[s];
    }, set(r) {
      this[s] = r;
    } };
    return { get: o, set(r) {
      const d = o?.call(this);
      n?.call(this, r), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(q("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(q("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(q("properties"))) {
      const s = this.properties, i = [...Ct(s), ...St(s)];
      for (const o of i) this.createProperty(o, s[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, o] of s) this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const o = this._$Eu(s, i);
      o !== void 0 && this._$Eh.set(o, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i) s.unshift(rt(o));
    } else t !== void 0 && s.push(rt(t));
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
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const n = (i.converter?.toAttribute !== void 0 ? i.converter : V).toAttribute(s, i.type);
      this._$Em = t, n == null ? this.removeAttribute(o) : this.setAttribute(o, n), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const n = i.getPropertyOptions(o), r = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : V;
      this._$Em = o;
      const d = r.fromAttribute(s, n.type);
      this[o] = d ?? this._$Ej?.get(o) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, o = !1, n) {
    if (t !== void 0) {
      const r = this.constructor;
      if (o === !1 && (n = this[t]), i ??= r.getPropertyOptions(t), !((i.hasChanged ?? tt)(n, s) || i.useDefault && i.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(r._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: o, wrapped: n }, r) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, r ?? s ?? this[t]), n !== !0 || r !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [o, n] of this._$Ep) this[o] = n;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, n] of i) {
        const { wrapped: r } = n, d = this[o];
        r !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, n, d);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[q("elementProperties")] = /* @__PURE__ */ new Map(), O[q("finalized")] = /* @__PURE__ */ new Map(), Ot?.({ ReactiveElement: O }), (Z.reactiveElementVersions ??= []).push("2.1.2");
const et = globalThis, lt = (e) => e, W = et.trustedTypes, dt = W ? W.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + w, Rt = `<${vt}>`, E = document, T = () => E.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", st = Array.isArray, Nt = (e) => st(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, pt = /-->/g, ht = />/g, C = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, gt = /"/g, $t = /^(?:script|style|textarea|title)$/i, Ut = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), c = Ut(1), R = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129);
function yt(e, t) {
  if (!st(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const Mt = (e, t) => {
  const s = e.length - 1, i = [];
  let o, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", r = I;
  for (let d = 0; d < s; d++) {
    const a = e[d];
    let h, g, p = -1, v = 0;
    for (; v < a.length && (r.lastIndex = v, g = r.exec(a), g !== null); ) v = r.lastIndex, r === I ? g[1] === "!--" ? r = pt : g[1] !== void 0 ? r = ht : g[2] !== void 0 ? ($t.test(g[2]) && (o = RegExp("</" + g[2], "g")), r = C) : g[3] !== void 0 && (r = C) : r === C ? g[0] === ">" ? (r = o ?? I, p = -1) : g[1] === void 0 ? p = -2 : (p = r.lastIndex - g[2].length, h = g[1], r = g[3] === void 0 ? C : g[3] === '"' ? gt : ut) : r === gt || r === ut ? r = C : r === pt || r === ht ? r = I : (r = C, o = void 0);
    const b = r === C && e[d + 1].startsWith("/>") ? " " : "";
    n += r === I ? a + Rt : p >= 0 ? (i.push(h), a.slice(0, p) + ft + a.slice(p) + w + b) : a + w + (p === -2 ? d : b);
  }
  return [yt(e, n + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class L {
  constructor({ strings: t, _$litType$: s }, i) {
    let o;
    this.parts = [];
    let n = 0, r = 0;
    const d = t.length - 1, a = this.parts, [h, g] = Mt(t, s);
    if (this.el = L.createElement(h, i), S.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = S.nextNode()) !== null && a.length < d; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(ft)) {
          const v = g[r++], b = o.getAttribute(p).split(w), B = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: n, name: B[2], strings: b, ctor: B[1] === "." ? It : B[1] === "?" ? qt : B[1] === "@" ? Tt : K }), o.removeAttribute(p);
        } else p.startsWith(w) && (a.push({ type: 6, index: n }), o.removeAttribute(p));
        if ($t.test(o.tagName)) {
          const p = o.textContent.split(w), v = p.length - 1;
          if (v > 0) {
            o.textContent = W ? W.emptyScript : "";
            for (let b = 0; b < v; b++) o.append(p[b], T()), S.nextNode(), a.push({ type: 2, index: ++n });
            o.append(p[v], T());
          }
        }
      } else if (o.nodeType === 8) if (o.data === vt) a.push({ type: 2, index: n });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(w, p + 1)) !== -1; ) a.push({ type: 7, index: n }), p += w.length - 1;
      }
      n++;
    }
  }
  static createElement(t, s) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function N(e, t, s = e, i) {
  if (t === R) return t;
  let o = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const n = D(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== n && (o?._$AO?.(!1), n === void 0 ? o = void 0 : (o = new n(e), o._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = o : s._$Cl = o), o !== void 0 && (t = N(e, o._$AS(e, t.values), o, i)), t;
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
    const { el: { content: s }, parts: i } = this._$AD, o = (t?.creationScope ?? E).importNode(s, !0);
    S.currentNode = o;
    let n = S.nextNode(), r = 0, d = 0, a = i[0];
    for (; a !== void 0; ) {
      if (r === a.index) {
        let h;
        a.type === 2 ? h = new j(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new Dt(n, this, t)), this._$AV.push(h), a = i[++d];
      }
      r !== a?.index && (n = S.nextNode(), r++);
    }
    return S.currentNode = E, o;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class j {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, o) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = N(this, t, s), D(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Nt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && D(this._$AH) ? this._$AA.nextSibling.data = t : this.T(E.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = L.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(s);
    else {
      const n = new zt(o, this), r = n.u(this.options);
      n.p(s), this.T(r), this._$AH = n;
    }
  }
  _$AC(t) {
    let s = _t.get(t.strings);
    return s === void 0 && _t.set(t.strings, s = new L(t)), s;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, o = 0;
    for (const n of t) o === s.length ? s.push(i = new j(this.O(T()), this.O(T()), this, this.options)) : i = s[o], i._$AI(n), o++;
    o < s.length && (this._$AR(i && i._$AB.nextSibling, o), s.length = o);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = lt(t).nextSibling;
      lt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class K {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, o, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = s, this._$AM = o, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(t, s = this, i, o) {
    const n = this.strings;
    let r = !1;
    if (n === void 0) t = N(this, t, s, 0), r = !D(t) || t !== this._$AH && t !== R, r && (this._$AH = t);
    else {
      const d = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = N(this, d[i + a], s, a), h === R && (h = this._$AH[a]), r ||= !D(h) || h !== this._$AH[a], h === l ? t = l : t !== l && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    r && !o && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends K {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class qt extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Tt extends K {
  constructor(t, s, i, o, n) {
    super(t, s, i, o, n), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = N(this, t, s, 0) ?? l) === R) return;
    const i = this._$AH, o = t === l && i !== l || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== l && (i === l || o);
    o && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Dt {
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
const Lt = et.litHtmlPolyfillSupport;
Lt?.(L, j), (et.litHtmlVersions ??= []).push("3.3.3");
const jt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const n = s?.renderBefore ?? null;
    i._$litPart$ = o = new j(t.insertBefore(T(), n), n, void 0, s ?? {});
  }
  return o._$AI(e), o;
};
const it = globalThis;
class $ extends O {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = jt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return R;
  }
}
$._$litElement$ = !0, $.finalized = !0, it.litElementHydrateSupport?.({ LitElement: $ });
const Ht = it.litElementPolyfillSupport;
Ht?.({ LitElement: $ });
(it.litElementVersions ??= []).push("4.2.2");
const H = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Bt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: tt }, Gt = (e = Bt, t, s) => {
  const { kind: i, metadata: o } = s;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), n.set(s.name, e), i === "accessor") {
    const { name: r } = s;
    return { set(d) {
      const a = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(r, a, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(r, void 0, e, d), d;
    } };
  }
  if (i === "setter") {
    const { name: r } = s;
    return function(d) {
      const a = this[r];
      t.call(this, d), this.requestUpdate(r, a, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function U(e) {
  return (t, s) => typeof s == "object" ? Gt(e, t, s) : ((i, o, n) => {
    const r = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, i), r ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(e, t, s);
}
function u(e) {
  return U({ ...e, state: !0, attribute: !1 });
}
const Vt = "Ploc Cellar", Wt = "Cellar storage", Ft = "Refresh", Jt = "Loading…", Zt = "Never", Kt = "Bottles in cellar", Qt = "Reconstructed stock", Xt = "Racks", Yt = "Empty positions", te = "Data may be stale: the latest synchronization failed.", ee = "Stock reconstruction is incomplete: only physical quantities are available.", se = "Last successful synchronization", ie = "Search wines", oe = "Search wines…", ne = "No matching wines.", re = "Select a Ploc Cellar configuration in the card editor.", ae = "Rack selection", ce = "occupied", le = "free", de = "Unknown wine", pe = "Empty position", he = "Row", ue = "Column", ge = "No row/column coordinates are available for this rack.", _e = "Positions without coordinates", me = "Not mapped", fe = "No racks available.", ve = "position(s) reference a missing rack.", $e = "Wine inventory", ye = "All colors", be = "All regions", we = "All appellations", xe = "All vintages", ke = "Sort by", Ae = "Name", Ce = "Quantity descending", Se = "Vintage descending", Ee = "{count} wine(s)", Pe = "{count} bottle(s)", Oe = "Clear filters", Re = "btl.", Ne = "Unknown vintage", Ue = "Wine details", Me = "Grapes", ze = "Cuvée", Ie = "Volume", qe = "Locations", Te = "Ploc Cellar", De = "Cellar overview and stock indicators.", Le = "Wine inventory", je = "Search, filter and browse the wine inventory.", He = "Cellar racks", Be = "Visualize rack positions and the wines stored in them.", Ge = "Ploc Cellar configuration", Ve = "Select the PLOUD connection used by this card.", We = "Card title", Fe = "Optional. Leave empty to use the default title.", Je = "Cellar statistics", Ze = "Bottles in stock", Ke = "wine references", Qe = "By color", Xe = "By region", Ye = "By appellation", ts = "By vintage", es = "By bottle format", ss = "Other", is = "Not specified", os = "No data available for this category.", ns = "Wine statistics", rs = "Explore stock distribution by color, region, appellation, vintage and bottle format.", as = "Unknown", cs = "Wine references in stock", ls = "Rack occupancy", ds = "Stock diagnostics", ps = "Unlocated bottles", hs = "Negative movement balance", us = "Physical surplus", gs = "Breakdowns include known wine references only.", _s = "{count} occupied position(s) have an unknown wine reference. They are included in total stock but not in the breakdowns.", ms = {
  card_title: Vt,
  rack_title: Wt,
  refresh: Ft,
  loading: Jt,
  never: Zt,
  bottles_in_cellar: Kt,
  reconstructed_stock: Qt,
  racks: Xt,
  empty_positions: Yt,
  stale: te,
  reconstruction_incomplete: ee,
  last_sync: se,
  search_wine: ie,
  search_placeholder: oe,
  no_matching_wines: ne,
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
  bottles_short: Re,
  unknown_vintage: Ne,
  wine_details: Ue,
  grapes: Me,
  cuvee: ze,
  bottle_volume: Ie,
  locations: qe,
  picker_overview_name: Te,
  picker_overview_description: De,
  picker_inventory_name: Le,
  picker_inventory_description: je,
  picker_rack_name: He,
  picker_rack_description: Be,
  editor_configuration: Ge,
  editor_configuration_helper: Ve,
  editor_title: We,
  editor_title_helper: Fe,
  statistics_title: Je,
  statistics_bottles: Ze,
  statistics_references: Ke,
  statistics_color: Qe,
  statistics_region: Xe,
  statistics_appellation: Ye,
  statistics_vintage: ts,
  statistics_format: es,
  statistics_other: ss,
  statistics_unknown: is,
  statistics_empty: os,
  picker_statistics_name: ns,
  picker_statistics_description: rs,
  unknown_value: as,
  stocked_references: cs,
  rack_occupancy: ls,
  inventory_diagnostics: ds,
  diagnostic_unlocated: ps,
  diagnostic_negative: hs,
  diagnostic_surplus: us,
  statistics_distribution_scope: gs,
  statistics_unknown_wine_positions: _s
}, fs = "Cave Ploc", vs = "Rangement de la cave", $s = "Actualiser", ys = "Chargement…", bs = "Jamais", ws = "Bouteilles en cave", xs = "Stock reconstitué", ks = "Casiers", As = "Places libres", Cs = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", Ss = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", Es = "Dernière synchronisation réussie", Ps = "Rechercher un vin", Os = "Rechercher un vin…", Rs = "Aucun vin correspondant.", Ns = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", Us = "Sélection du casier", Ms = "occupées", zs = "libres", Is = "Vin inconnu", qs = "Emplacement libre", Ts = "Rangée", Ds = "Colonne", Ls = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", js = "Emplacements sans coordonnées", Hs = "Non renseigné", Bs = "Aucun casier disponible.", Gs = "emplacement(s) référencent un casier absent.", Vs = "Inventaire des vins", Ws = "Toutes les couleurs", Fs = "Toutes les régions", Js = "Toutes les appellations", Zs = "Tous les millésimes", Ks = "Trier par", Qs = "Nom", Xs = "Quantité décroissante", Ys = "Millésime décroissant", ti = "{count} référence(s)", ei = "{count} bouteille(s)", si = "Effacer les filtres", ii = "bt.", oi = "Millésime inconnu", ni = "Détails du vin", ri = "Cépages", ai = "Cuvée", ci = "Volume", li = "Emplacements", di = "Cave Ploc", pi = "Vue d’ensemble de la cave et indicateurs de stock.", hi = "Inventaire des vins", ui = "Rechercher, filtrer et parcourir l’inventaire des vins.", gi = "Casiers de la cave", _i = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", mi = "Configuration Ploc Cellar", fi = "Sélectionnez la connexion PLOUD utilisée par cette carte.", vi = "Titre de la carte", $i = "Facultatif. Laissez vide pour utiliser le titre par défaut.", yi = "Statistiques de la cave", bi = "Bouteilles en stock", wi = "références de vin", xi = "Par couleur", ki = "Par région", Ai = "Par appellation", Ci = "Par millésime", Si = "Par format de bouteille", Ei = "Autres", Pi = "Non renseigné", Oi = "Aucune donnée disponible pour cette catégorie.", Ri = "Statistiques des vins", Ni = "Répartition du stock par couleur, région, appellation, millésime et format de bouteille.", Ui = "Inconnu", Mi = "Références de vins en stock", zi = "Occupation des casiers", Ii = "Diagnostics du stock", qi = "Bouteilles non localisées", Ti = "Solde de mouvements négatif", Di = "Excédent physique", Li = "Les répartitions ne portent que sur les références de vins connues.", ji = "{count} emplacement(s) occupé(s) font référence à un vin inconnu. Ils sont inclus dans le stock total, mais pas dans les répartitions.", Hi = {
  card_title: fs,
  rack_title: vs,
  refresh: $s,
  loading: ys,
  never: bs,
  bottles_in_cellar: ws,
  reconstructed_stock: xs,
  racks: ks,
  empty_positions: As,
  stale: Cs,
  reconstruction_incomplete: Ss,
  last_sync: Es,
  search_wine: Ps,
  search_placeholder: Os,
  no_matching_wines: Rs,
  select_config: Ns,
  rack_selection: Us,
  occupied: Ms,
  free: zs,
  unknown_wine: Is,
  empty_position: qs,
  row: Ts,
  column: Ds,
  no_coordinates: Ls,
  positions_without_coordinates: js,
  not_mapped: Hs,
  no_racks: Bs,
  missing_rack: Gs,
  inventory_title: Vs,
  filter_color: Ws,
  filter_region: Fs,
  filter_appellation: Js,
  filter_vintage: Zs,
  sort_by: Ks,
  sort_name: Qs,
  sort_bottles: Xs,
  sort_vintage: Ys,
  inventory_results: ti,
  inventory_bottle_total: ei,
  clear_filters: si,
  bottles_short: ii,
  unknown_vintage: oi,
  wine_details: ni,
  grapes: ri,
  cuvee: ai,
  bottle_volume: ci,
  locations: li,
  picker_overview_name: di,
  picker_overview_description: pi,
  picker_inventory_name: hi,
  picker_inventory_description: ui,
  picker_rack_name: gi,
  picker_rack_description: _i,
  editor_configuration: mi,
  editor_configuration_helper: fi,
  editor_title: vi,
  editor_title_helper: $i,
  statistics_title: yi,
  statistics_bottles: bi,
  statistics_references: wi,
  statistics_color: xi,
  statistics_region: ki,
  statistics_appellation: Ai,
  statistics_vintage: Ci,
  statistics_format: Si,
  statistics_other: Ei,
  statistics_unknown: Pi,
  statistics_empty: Oi,
  picker_statistics_name: Ri,
  picker_statistics_description: Ni,
  unknown_value: Ui,
  stocked_references: Mi,
  rack_occupancy: zi,
  inventory_diagnostics: Ii,
  diagnostic_unlocated: qi,
  diagnostic_negative: Ti,
  diagnostic_surplus: Di,
  statistics_distribution_scope: Li,
  statistics_unknown_wine_positions: ji
};
function m(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? Hi : ms)[t];
}
function x(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return m(t, e);
}
var Bi = Object.defineProperty, Gi = Object.getOwnPropertyDescriptor, P = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Gi(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (i ? r(t, s, o) : r(o)) || o);
  return i && o && Bi(t, s, o), o;
};
let y = class extends $ {
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
      const o = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = o.response, (!this.selectedRackId || !this.inventory.racks.some((n) => n.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
    } catch (o) {
      i === this.requestGeneration && (this.error = o instanceof Error ? o.message : String(o));
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
    const e = (a) => m(this.hass?.language ?? "en", a), t = this.inventory, s = t?.racks.find((a) => a.id === this.selectedRackId), i = this.rowValues, o = this.columnValues, n = this.positionedItems, r = this.selectedItems.filter((a) => a.row === null || a.column === null), d = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((h) => h.id === a.rack_id)
    );
    return c`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? c`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : c`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? c`<div class="warning">${e("stale")}</div>` : l}
        ${t?.racks.length ? c`
          <nav class="rack-picker" aria-label=${e("rack_selection")}>
            ${t.racks.map((a) => c`
              <button aria-pressed=${a.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = a.id;
    }}>${a.name}</button>
            `)}
          </nav>
          <div class="legend">${s?.name ?? ""} · ${this.selectedItems.filter((a) => a.wine_id).length} ${e("occupied")} · ${this.selectedItems.filter((a) => !a.wine_id).length} ${e("free")}</div>
          ${i.length && o.length ? c`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${n.map((a) => {
      const h = a.row - this.firstRow + 1, g = a.column - this.firstColumn + 1, p = !!a.wine_id;
      return c`
                    <div class=${p ? "slot occupied" : "slot"}
                      style=${`grid-row: ${h}; grid-column: ${g};`}
                      title=${this.wineLabel(a) || e("empty_position")}>
                      <strong>${p ? this.wineLabel(a) : "—"}</strong>
                      <small>${e("row")} ${a.row} · ${e("column")} ${a.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((a) => c`
                  <div class="slot missing"
                    style=${`grid-row: ${a.row - this.firstRow + 1}; grid-column: ${a.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${e("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : c`<div class="warning">${e("no_coordinates")}</div>`}
          ${r.length ? c`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${r.map((a) => c`<div class="unplaced-item">${this.wineLabel(a) || e("empty_position")}</div>`)}
            </div>
          ` : l}
        ` : c`<p class="muted">${e("no_racks")}</p>`}
        ${d.length ? c`
          <div class="warning">${d.length} ${e("missing_rack")}</div>
        ` : l}
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
y.styles = J`
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
P([
  U({ attribute: !1 })
], y.prototype, "hass", 2);
P([
  u()
], y.prototype, "config", 2);
P([
  u()
], y.prototype, "inventory", 2);
P([
  u()
], y.prototype, "selectedRackId", 2);
P([
  u()
], y.prototype, "loading", 2);
P([
  u()
], y.prototype, "error", 2);
y = P([
  H("ploc-cellar-rack-card")
], y);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: x("picker_rack_name"),
  description: x("picker_rack_description")
});
var Vi = Object.defineProperty, Wi = Object.getOwnPropertyDescriptor, f = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Wi(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (i ? r(t, s, o) : r(o)) || o);
  return i && o && Vi(t, s, o), o;
};
let _ = class extends $ {
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
    ].filter((o) => o != null).join(" ").toLocaleLowerCase().includes(e) : !0), s = new Intl.Collator(this.hass?.language ?? void 0, {
      numeric: !0,
      sensitivity: "base"
    });
    return [...t].sort((i, o) => this.sort === "bottles" ? o.bottles_in_cellar - i.bottles_in_cellar || s.compare(i.name, o.name) : this.sort === "vintage" && (o.vintage ?? 0) - (i.vintage ?? 0) || s.compare(i.name, o.name));
  }
  clearFilters() {
    this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name";
  }
  selectFilter(e, t, s, i) {
    return c`
      <select aria-label=${t} .value=${s}
        @change=${(o) => {
      const n = o.target.value;
      e === "color" ? this.color = n : e === "region" ? this.region = n : e === "appellation" ? this.appellation = n : this.vintage = n;
    }}>
        <option value="" ?selected=${!s}>${t}</option>
        ${i.map((o) => c`<option value=${o} ?selected=${o === s}>${o}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? l : c`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (n) => m(this.hass?.language ?? "en", n), s = e.locations.map((n) => {
      const r = n.row !== null && n.column !== null ? ` · ${t("row")} ${n.row}, ${t("column")} ${n.column}` : "";
      return `${n.rack}${r}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), o = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
    return c`
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
          ${e.color ? c`<span class="tag">${e.color}</span>` : l}
          <span class="tag">${i}</span>
          ${e.bottle_format ? c`<span class="tag">${e.bottle_format}</span>` : l}
        </div>
        <details>
          <summary class="metadata">${t("wine_details")}</summary>
          <div class="details">
            ${this.detail(t("grapes"), e.grapes)}
            ${this.detail(t("cuvee"), e.cuvee)}
            ${this.detail(t("bottle_volume"), o)}
            ${this.detail(t("locations"), s.length ? s.join(" · ") : null)}
          </div>
        </details>
      </article>
    `;
  }
  render() {
    const e = (o) => m(this.hass?.language ?? "en", o), t = this.filteredWines, s = t.reduce((o, n) => o + n.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
    return c`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("inventory_title")}</h2>
          <div class="actions">
            <button ?disabled=${this.loading} @click=${() => this.refresh()}>
              ${this.loading ? e("loading") : e("refresh")}
            </button>
          </div>
        </header>
        ${this.error ? c`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : c`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? c`<div class="warning">${e("stale")}</div>` : l}
        ${this.inventory ? c`
          <div class="toolbar">
            <input class="search" type="search" aria-label=${e("search_wine")}
              placeholder=${e("search_placeholder")} .value=${this.search}
              @input=${(o) => {
      this.search = o.target.value;
    }} />
            ${this.selectFilter("color", e("filter_color"), this.color, this.valuesFor("color"))}
            ${this.selectFilter("region", e("filter_region"), this.region, this.valuesFor("region"))}
            ${this.selectFilter("appellation", e("filter_appellation"), this.appellation, this.valuesFor("appellation"))}
            ${this.selectFilter("vintage", e("filter_vintage"), this.vintage, this.valuesFor("vintage"))}
            <select aria-label=${e("sort_by")} .value=${this.sort}
              @change=${(o) => {
      this.sort = o.target.value;
    }}>
              <option value="name" ?selected=${this.sort === "name"}>${e("sort_name")}</option>
              <option value="bottles" ?selected=${this.sort === "bottles"}>${e("sort_bottles")}</option>
              <option value="vintage" ?selected=${this.sort === "vintage"}>${e("sort_vintage")}</option>
            </select>
          </div>
          <div class="summary">
            <span>${e("inventory_results").replace("{count}", String(t.length))}</span>
            <span>${e("inventory_bottle_total").replace("{count}", String(s))}</span>
            ${i ? c`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : l}
          </div>
          ${this.inventory.stock_reconstruction_complete ? l : c`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((o) => this.renderWine(o))}
          </div>
          ${t.length === 0 ? c`<p class="muted">${e("no_matching_wines")}</p>` : l}
        ` : l}
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
_.styles = J`
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
  U({ attribute: !1 })
], _.prototype, "hass", 2);
f([
  u()
], _.prototype, "config", 2);
f([
  u()
], _.prototype, "inventory", 2);
f([
  u()
], _.prototype, "loading", 2);
f([
  u()
], _.prototype, "error", 2);
f([
  u()
], _.prototype, "search", 2);
f([
  u()
], _.prototype, "color", 2);
f([
  u()
], _.prototype, "region", 2);
f([
  u()
], _.prototype, "appellation", 2);
f([
  u()
], _.prototype, "vintage", 2);
f([
  u()
], _.prototype, "sort", 2);
_ = f([
  H("ploc-cellar-inventory-card")
], _);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: x("picker_inventory_name"),
  description: x("picker_inventory_description")
});
var Fi = Object.defineProperty, Ji = Object.getOwnPropertyDescriptor, M = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Ji(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (i ? r(t, s, o) : r(o)) || o);
  return i && o && Fi(t, s, o), o;
};
let k = class extends $ {
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
  getBottleCount(e) {
    return this.inventory?.stock_reconstruction_complete ? e.bottles ?? e.bottles_in_cellar : e.bottles_in_cellar;
  }
  distribution(e) {
    const t = (r) => m(this.hass?.language ?? "en", r), s = /* @__PURE__ */ new Map();
    for (const r of this.inventory?.wines ?? []) {
      const d = r[e], a = d === null || d === "" ? t("statistics_unknown") : String(d), h = s.get(a) ?? { name: a, bottles: 0, wines: 0 };
      h.bottles += this.getBottleCount(r), h.wines += 1, s.set(a, h);
    }
    const i = [...s.values()].sort(
      (r, d) => d.bottles - r.bottles || r.name.localeCompare(d.name, this.hass?.language)
    );
    if (i.length <= 8) return i;
    const o = i.slice(0, 7), n = i.slice(7).reduce(
      (r, d) => ({
        name: t("statistics_other"),
        bottles: r.bottles + d.bottles,
        wines: r.wines + d.wines
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 }
    );
    return [...o, n];
  }
  renderDistribution(e, t) {
    const s = (n) => m(this.hass?.language ?? "en", n), i = this.distribution(e), o = Math.max(1, ...i.map((n) => n.bottles));
    return c`
      <section class="group">
        <h3>${s(t)}</h3>
        ${i.length ? i.map((n) => {
      const r = Math.round(n.bottles / o * 100);
      return c`
            <div class="item">
              <div class="item-heading">
                <span class="item-name">${n.name}</span>
                <span class="item-value">${n.bottles} ${s("bottles_short")}</span>
              </div>
              <div class="bar" role="progressbar"
                aria-label=${n.name}
                aria-valuemin="0"
                aria-valuemax=${o}
                aria-valuenow=${n.bottles}>
                <div class="bar-fill" style=${`width: ${r}%`}></div>
              </div>
              <div class="item-meta">${n.wines} ${s("statistics_references")}</div>
            </div>
          `;
    }) : c`<p class="muted">${s("statistics_empty")}</p>`}
      </section>
    `;
  }
  render() {
    const e = (r) => m(this.hass?.language ?? "en", r), t = this.inventory, s = t?.wines ?? [], i = s.reduce((r, d) => r + this.getBottleCount(d), 0), o = t?.stock_reconstruction_complete ? t.total_stock_bottles ?? i : t?.total_bottles ?? i, n = t?.wine_references ?? s.length;
    return c`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("statistics_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? c`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : c`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? c`<div class="warning">${e("stale")}</div>` : l}
        ${t ? c`
          ${t.stock_reconstruction_complete ? l : c`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="summary">
            <div class="metric">
              <span class="value">${o}</span>
              <span class="metric-label">${e("statistics_bottles")}</span>
            </div>
            <div class="metric">
              <span class="value">${n}</span>
              <span class="metric-label">${e("statistics_references")}</span>
            </div>
          </div>
          ${t.positions_with_unknown_wine > 0 ? c`<div class="warning">${e("statistics_unknown_wine_positions").replace("{count}", String(t.positions_with_unknown_wine))}</div>` : l}
          <p class="muted">${e("statistics_distribution_scope")}</p>
          <div class="groups">
            ${this.renderDistribution("color", "statistics_color")}
            ${this.renderDistribution("region", "statistics_region")}
            ${this.renderDistribution("appellation", "statistics_appellation")}
            ${this.renderDistribution("vintage", "statistics_vintage")}
            ${this.renderDistribution("bottle_format", "statistics_format")}
          </div>
        ` : l}
      </ha-card>
    `;
  }
  getCardSize() {
    return 7;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: 7, min_rows: 4 };
  }
};
k.styles = J`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.2rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 8px; margin: 14px 0; }
    .metric { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .value { display: block; font-size: 1.4rem; font-weight: 600; }
    .muted, .metric-label { color: var(--secondary-text-color); font-size: .85rem; }
    .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr)); gap: 12px; margin-top: 14px; }
    .group { min-width: 0; border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; }
    h3 { margin: 0 0 12px; font-size: 1rem; font-weight: 500; }
    .item { display: grid; gap: 5px; margin: 10px 0; }
    .item-heading { display: flex; justify-content: space-between; gap: 8px; font-size: .88rem; }
    .item-name { min-width: 0; overflow-wrap: anywhere; }
    .item-value { flex: 0 0 auto; font-variant-numeric: tabular-nums; font-weight: 600; }
    .bar { height: 8px; border-radius: 999px; overflow: hidden; background: var(--divider-color); }
    .bar-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .item-meta { color: var(--secondary-text-color); font-size: .75rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;
M([
  U({ attribute: !1 })
], k.prototype, "hass", 2);
M([
  u()
], k.prototype, "config", 2);
M([
  u()
], k.prototype, "inventory", 2);
M([
  u()
], k.prototype, "loading", 2);
M([
  u()
], k.prototype, "error", 2);
k = M([
  H("ploc-cellar-statistics-card")
], k);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-statistics-card",
  name: x("picker_statistics_name"),
  description: x("picker_statistics_description")
});
var Zi = Object.defineProperty, Ki = Object.getOwnPropertyDescriptor, ot = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Ki(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (i ? r(t, s, o) : r(o)) || o);
  return i && o && Zi(t, s, o), o;
};
let F = class extends $ {
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
    return c`
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
ot([
  U({ attribute: !1 })
], F.prototype, "hass", 2);
ot([
  u()
], F.prototype, "config", 2);
F = ot([
  H("ploc-cellar-card-editor")
], F);
var Qi = Object.defineProperty, Xi = Object.getOwnPropertyDescriptor, z = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? Xi(t, s) : t, n = e.length - 1, r; n >= 0; n--)
    (r = e[n]) && (o = (i ? r(t, s, o) : r(o)) || o);
  return i && o && Qi(t, s, o), o;
};
let A = class extends $ {
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
      const o = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = o.response);
    } catch (o) {
      i === this.requestGeneration && (this.error = o instanceof Error ? o.message : String(o));
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
    return c`
      <div class="metric">
        <span class="value">${typeof e == "number" ? this.formatNumber(e) : e}</span>
        <span class="label">${t}</span>
      </div>
    `;
  }
  render() {
    const e = (n) => m(this.hass?.language ?? "en", n), t = this.inventory, s = this.config?.title ?? e("card_title"), i = t && t.total_positions > 0 ? Math.round(t.occupied_positions / t.total_positions * 100) : 0, o = t?.stock_reconstruction_complete ? [
      { key: "diagnostic_unlocated", value: t.unlocated_bottles ?? 0 },
      { key: "diagnostic_negative", value: t.negative_movement_bottles ?? 0 },
      { key: "diagnostic_surplus", value: t.physical_surplus_bottles ?? 0 }
    ].filter((n) => n.value > 0) : [];
    return c`
      <ha-card>
        <header>
          <h2>${s}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? c`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : c`<div class="muted">${e("select_config")}</div>`}
        ${t ? c`
          ${t.stale ? c`<div class="warning">${e("stale")}</div>` : l}
          <div class="summary">
            ${this.metric(t.total_bottles, e("bottles_in_cellar"))}
            ${this.metric(
      t.total_stock_bottles ?? e("unknown_value"),
      e("reconstructed_stock")
    )}
            ${this.metric(t.wine_references ?? t.stocked_wines, e("stocked_references"))}
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
          ${t.stock_reconstruction_complete ? l : c`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          ${o.length ? c`
            <section class="section">
              <h3 class="section-title">${e("inventory_diagnostics")}</h3>
              <div class="diagnostics">
                ${o.map((n) => c`
                  <div class="diagnostic">
                    <span class="diagnostic-value">${this.formatNumber(n.value)}</span>
                    <span class="label">${e(n.key)}</span>
                  </div>
                `)}
              </div>
            </section>
          ` : l}
          <div class="muted section">${e("last_sync")}: ${this.formatSync(t.last_sync)}</div>
        ` : l}
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
A.styles = J`
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
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;
z([
  U({ attribute: !1 })
], A.prototype, "hass", 2);
z([
  u()
], A.prototype, "config", 2);
z([
  u()
], A.prototype, "inventory", 2);
z([
  u()
], A.prototype, "loading", 2);
z([
  u()
], A.prototype, "error", 2);
A = z([
  H("ploc-cellar-card")
], A);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: x("picker_overview_name"),
  description: x("picker_overview_description")
});
export {
  A as PlocCellarCard
};
