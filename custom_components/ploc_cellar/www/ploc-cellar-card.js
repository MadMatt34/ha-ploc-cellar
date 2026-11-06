const G = globalThis, X = G.ShadowRoot && (G.ShadyCSS === void 0 || G.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Y = /* @__PURE__ */ Symbol(), ot = /* @__PURE__ */ new WeakMap();
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
      i && (t = ot.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ot.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (e) => new mt(typeof e == "string" ? e : e + "", void 0, Y), J = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new mt(s, e, Y);
}, wt = (e, t) => {
  if (X) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = G.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, nt = X ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return bt(s);
})(e) : e;
const { is: xt, defineProperty: kt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Ct, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, Z = globalThis, at = Z.trustedTypes, Pt = at ? at.emptyScript : "", Ot = Z.reactiveElementPolyfillSupport, T = (e, t) => e, V = { toAttribute(e, t) {
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
      const i = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && kt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: o } = At(this.prototype, t) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: r, set(n) {
      const d = r?.call(this);
      o?.call(this, n), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? ct;
  }
  static _$Ei() {
    if (this.hasOwnProperty(T("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(T("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(T("properties"))) {
      const s = this.properties, i = [...Ct(s), ...St(s)];
      for (const r of i) this.createProperty(r, s[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const s = litPropertyMetadata.get(t);
      if (s !== void 0) for (const [i, r] of s) this.elementProperties.set(i, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [s, i] of this.elementProperties) {
      const r = this._$Eu(s, i);
      r !== void 0 && this._$Eh.set(r, s);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const s = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const r of i) s.unshift(nt(r));
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
    const i = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, i);
    if (r !== void 0 && i.reflect === !0) {
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : V).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : V;
      this._$Em = r;
      const d = n.fromAttribute(s, o.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? tt)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: r, wrapped: o }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? s ?? this[t]), o !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [r, o] of this._$Ep) this[r] = o;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [r, o] of i) {
        const { wrapped: n } = o, d = this[r];
        n !== !0 || this._$AL.has(r) || d === void 0 || this.C(r, void 0, o, d);
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
O.elementStyles = [], O.shadowRootOptions = { mode: "open" }, O[T("elementProperties")] = /* @__PURE__ */ new Map(), O[T("finalized")] = /* @__PURE__ */ new Map(), Ot?.({ ReactiveElement: O }), (Z.reactiveElementVersions ??= []).push("2.1.2");
const et = globalThis, lt = (e) => e, W = et.trustedTypes, dt = W ? W.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", w = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + w, Rt = `<${vt}>`, E = document, q = () => E.createComment(""), D = (e) => e === null || typeof e != "object" && typeof e != "function", st = Array.isArray, Ut = (e) => st(e) || typeof e?.[Symbol.iterator] == "function", Q = `[ 	
\f\r]`, I = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ht = /-->/g, pt = />/g, C = RegExp(`>|${Q}(?:([^\\s"'>=/]+)(${Q}*=${Q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ut = /'/g, gt = /"/g, $t = /^(?:script|style|textarea|title)$/i, Mt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), c = Mt(1), R = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), _t = /* @__PURE__ */ new WeakMap(), S = E.createTreeWalker(E, 129);
function yt(e, t) {
  if (!st(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return dt !== void 0 ? dt.createHTML(t) : t;
}
const zt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = I;
  for (let d = 0; d < s; d++) {
    const a = e[d];
    let p, g, h = -1, v = 0;
    for (; v < a.length && (n.lastIndex = v, g = n.exec(a), g !== null); ) v = n.lastIndex, n === I ? g[1] === "!--" ? n = ht : g[1] !== void 0 ? n = pt : g[2] !== void 0 ? ($t.test(g[2]) && (r = RegExp("</" + g[2], "g")), n = C) : g[3] !== void 0 && (n = C) : n === C ? g[0] === ">" ? (n = r ?? I, h = -1) : g[1] === void 0 ? h = -2 : (h = n.lastIndex - g[2].length, p = g[1], n = g[3] === void 0 ? C : g[3] === '"' ? gt : ut) : n === gt || n === ut ? n = C : n === ht || n === pt ? n = I : (n = C, r = void 0);
    const b = n === C && e[d + 1].startsWith("/>") ? " " : "";
    o += n === I ? a + Rt : h >= 0 ? (i.push(p), a.slice(0, h) + ft + a.slice(h) + w + b) : a + w + (h === -2 ? d : b);
  }
  return [yt(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class H {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const d = t.length - 1, a = this.parts, [p, g] = zt(t, s);
    if (this.el = H.createElement(p, i), S.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = S.nextNode()) !== null && a.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(ft)) {
          const v = g[n++], b = r.getAttribute(h).split(w), B = /([.?@])?(.*)/.exec(v);
          a.push({ type: 1, index: o, name: B[2], strings: b, ctor: B[1] === "." ? It : B[1] === "?" ? Tt : B[1] === "@" ? qt : K }), r.removeAttribute(h);
        } else h.startsWith(w) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if ($t.test(r.tagName)) {
          const h = r.textContent.split(w), v = h.length - 1;
          if (v > 0) {
            r.textContent = W ? W.emptyScript : "";
            for (let b = 0; b < v; b++) r.append(h[b], q()), S.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[v], q());
          }
        }
      } else if (r.nodeType === 8) if (r.data === vt) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(w, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += w.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = E.createElement("template");
    return i.innerHTML = t, i;
  }
}
function U(e, t, s = e, i) {
  if (t === R) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = D(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = U(e, r._$AS(e, t.values), r, i)), t;
}
class Nt {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? E).importNode(s, !0);
    S.currentNode = r;
    let o = S.nextNode(), n = 0, d = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new L(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new Dt(o, this, t)), this._$AV.push(p), a = i[++d];
      }
      n !== a?.index && (o = S.nextNode(), n++);
    }
    return S.currentNode = E, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class L {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = U(this, t, s), D(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== R && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Ut(t) ? this.k(t) : this._(t);
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
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = H.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Nt(r, this), n = o.u(this.options);
      o.p(s), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = _t.get(t.strings);
    return s === void 0 && _t.set(t.strings, s = new H(t)), s;
  }
  k(t) {
    st(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of t) r === s.length ? s.push(i = new L(this.O(q()), this.O(q()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
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
  constructor(t, s, i, r, o) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = l;
  }
  _$AI(t, s = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = U(this, t, s, 0), n = !D(t) || t !== this._$AH && t !== R, n && (this._$AH = t);
    else {
      const d = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = U(this, d[i + a], s, a), p === R && (p = this._$AH[a]), n ||= !D(p) || p !== this._$AH[a], p === l ? t = l : t !== l && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !r && this.j(t);
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
class Tt extends K {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class qt extends K {
  constructor(t, s, i, r, o) {
    super(t, s, i, r, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = U(this, t, s, 0) ?? l) === R) return;
    const i = this._$AH, r = t === l && i !== l || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== l && (i === l || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
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
    U(this, t);
  }
}
const Ht = et.litHtmlPolyfillSupport;
Ht?.(H, L), (et.litHtmlVersions ??= []).push("3.3.3");
const Lt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new L(t.insertBefore(q(), o), o, void 0, s ?? {});
  }
  return r._$AI(e), r;
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
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(s, this.renderRoot, this.renderOptions);
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
const jt = it.litElementPolyfillSupport;
jt?.({ LitElement: $ });
(it.litElementVersions ??= []).push("4.2.2");
const j = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Bt = { attribute: !0, type: String, converter: V, reflect: !1, hasChanged: tt }, Gt = (e = Bt, t, s) => {
  const { kind: i, metadata: r } = s;
  let o = globalThis.litPropertyMetadata.get(r);
  if (o === void 0 && globalThis.litPropertyMetadata.set(r, o = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), o.set(s.name, e), i === "accessor") {
    const { name: n } = s;
    return { set(d) {
      const a = t.get.call(this);
      t.set.call(this, d), this.requestUpdate(n, a, e, !0, d);
    }, init(d) {
      return d !== void 0 && this.C(n, void 0, e, d), d;
    } };
  }
  if (i === "setter") {
    const { name: n } = s;
    return function(d) {
      const a = this[n];
      t.call(this, d), this.requestUpdate(n, a, e, !0, d);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function M(e) {
  return (t, s) => typeof s == "object" ? Gt(e, t, s) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, s);
}
function u(e) {
  return M({ ...e, state: !0, attribute: !1 });
}
const Vt = "Ploc Cellar", Wt = "Cellar storage", Ft = "Refresh", Jt = "Loading…", Zt = "Never", Kt = "Bottles in cellar", Qt = "Reconstructed stock", Xt = "Racks", Yt = "Empty positions", te = "Data may be stale: the latest synchronization failed.", ee = "Stock reconstruction is incomplete: only physical quantities are available.", se = "Last successful synchronization", ie = "Search wines", re = "Search wines…", oe = "No matching wines.", ne = "Select a Ploc Cellar configuration in the card editor.", ae = "Rack selection", ce = "occupied", le = "free", de = "Unknown wine", he = "Empty position", pe = "Row", ue = "Column", ge = "No row/column coordinates are available for this rack.", _e = "Positions without coordinates", me = "Not mapped", fe = "No racks available.", ve = "position(s) reference a missing rack.", $e = "Wine inventory", ye = "All colors", be = "All regions", we = "All appellations", xe = "All vintages", ke = "Sort by", Ae = "Name", Ce = "Quantity descending", Se = "Vintage descending", Ee = "{count} wine(s)", Pe = "{count} bottle(s)", Oe = "Clear filters", Re = "btl.", Ue = "Unknown vintage", Me = "Wine details", ze = "Grapes", Ne = "Cuvée", Ie = "Volume", Te = "Locations", qe = "Ploc Cellar", De = "Cellar overview and stock indicators.", He = "Wine inventory", Le = "Search, filter and browse the wine inventory.", je = "Cellar racks", Be = "Visualize rack positions and the wines stored in them.", Ge = "Ploc Cellar configuration", Ve = "Select the PLOUD connection used by this card.", We = "Card title", Fe = "Optional. Leave empty to use the default title.", Je = "Cellar statistics", Ze = "Bottles represented", Ke = "wine references", Qe = "By color", Xe = "By region", Ye = "By appellation", ts = "By vintage", es = "By bottle format", ss = "Other", is = "Not specified", rs = "No data available for this category.", os = "Wine statistics", ns = "Explore stock distribution by color, region, appellation, vintage and bottle format.", as = {
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
  search_placeholder: re,
  no_matching_wines: oe,
  select_config: ne,
  rack_selection: ae,
  occupied: ce,
  free: le,
  unknown_wine: de,
  empty_position: he,
  row: pe,
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
  unknown_vintage: Ue,
  wine_details: Me,
  grapes: ze,
  cuvee: Ne,
  bottle_volume: Ie,
  locations: Te,
  picker_overview_name: qe,
  picker_overview_description: De,
  picker_inventory_name: He,
  picker_inventory_description: Le,
  picker_rack_name: je,
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
  statistics_empty: rs,
  picker_statistics_name: os,
  picker_statistics_description: ns
}, cs = "Cave Ploc", ls = "Rangement de la cave", ds = "Actualiser", hs = "Chargement…", ps = "Jamais", us = "Bouteilles en cave", gs = "Stock reconstitué", _s = "Casiers", ms = "Places libres", fs = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", vs = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", $s = "Dernière synchronisation réussie", ys = "Rechercher un vin", bs = "Rechercher un vin…", ws = "Aucun vin correspondant.", xs = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", ks = "Sélection du casier", As = "occupées", Cs = "libres", Ss = "Vin inconnu", Es = "Emplacement libre", Ps = "Rangée", Os = "Colonne", Rs = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", Us = "Emplacements sans coordonnées", Ms = "Non renseigné", zs = "Aucun casier disponible.", Ns = "emplacement(s) référencent un casier absent.", Is = "Inventaire des vins", Ts = "Toutes les couleurs", qs = "Toutes les régions", Ds = "Toutes les appellations", Hs = "Tous les millésimes", Ls = "Trier par", js = "Nom", Bs = "Quantité décroissante", Gs = "Millésime décroissant", Vs = "{count} référence(s)", Ws = "{count} bouteille(s)", Fs = "Effacer les filtres", Js = "bt.", Zs = "Millésime inconnu", Ks = "Détails du vin", Qs = "Cépages", Xs = "Cuvée", Ys = "Volume", ti = "Emplacements", ei = "Cave Ploc", si = "Vue d’ensemble de la cave et indicateurs de stock.", ii = "Inventaire des vins", ri = "Rechercher, filtrer et parcourir l’inventaire des vins.", oi = "Casiers de la cave", ni = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", ai = "Configuration Ploc Cellar", ci = "Sélectionnez la connexion PLOUD utilisée par cette carte.", li = "Titre de la carte", di = "Facultatif. Laissez vide pour utiliser le titre par défaut.", hi = "Statistiques de la cave", pi = "Bouteilles représentées", ui = "références de vin", gi = "Par couleur", _i = "Par région", mi = "Par appellation", fi = "Par millésime", vi = "Par format de bouteille", $i = "Autres", yi = "Non renseigné", bi = "Aucune donnée disponible pour cette catégorie.", wi = "Statistiques des vins", xi = "Répartition du stock par couleur, région, appellation, millésime et format de bouteille.", ki = {
  card_title: cs,
  rack_title: ls,
  refresh: ds,
  loading: hs,
  never: ps,
  bottles_in_cellar: us,
  reconstructed_stock: gs,
  racks: _s,
  empty_positions: ms,
  stale: fs,
  reconstruction_incomplete: vs,
  last_sync: $s,
  search_wine: ys,
  search_placeholder: bs,
  no_matching_wines: ws,
  select_config: xs,
  rack_selection: ks,
  occupied: As,
  free: Cs,
  unknown_wine: Ss,
  empty_position: Es,
  row: Ps,
  column: Os,
  no_coordinates: Rs,
  positions_without_coordinates: Us,
  not_mapped: Ms,
  no_racks: zs,
  missing_rack: Ns,
  inventory_title: Is,
  filter_color: Ts,
  filter_region: qs,
  filter_appellation: Ds,
  filter_vintage: Hs,
  sort_by: Ls,
  sort_name: js,
  sort_bottles: Bs,
  sort_vintage: Gs,
  inventory_results: Vs,
  inventory_bottle_total: Ws,
  clear_filters: Fs,
  bottles_short: Js,
  unknown_vintage: Zs,
  wine_details: Ks,
  grapes: Qs,
  cuvee: Xs,
  bottle_volume: Ys,
  locations: ti,
  picker_overview_name: ei,
  picker_overview_description: si,
  picker_inventory_name: ii,
  picker_inventory_description: ri,
  picker_rack_name: oi,
  picker_rack_description: ni,
  editor_configuration: ai,
  editor_configuration_helper: ci,
  editor_title: li,
  editor_title_helper: di,
  statistics_title: hi,
  statistics_bottles: pi,
  statistics_references: ui,
  statistics_color: gi,
  statistics_region: _i,
  statistics_appellation: mi,
  statistics_vintage: fi,
  statistics_format: vi,
  statistics_other: $i,
  statistics_unknown: yi,
  statistics_empty: bi,
  picker_statistics_name: wi,
  picker_statistics_description: xi
};
function m(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? ki : as)[t];
}
function x(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return m(t, e);
}
var Ai = Object.defineProperty, Ci = Object.getOwnPropertyDescriptor, P = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ci(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ai(t, s, r), r;
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
      const r = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = r.response, (!this.selectedRackId || !this.inventory.racks.some((o) => o.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
    } catch (r) {
      i === this.requestGeneration && (this.error = r instanceof Error ? r.message : String(r));
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
    const e = (a) => m(this.hass?.language ?? "en", a), t = this.inventory, s = t?.racks.find((a) => a.id === this.selectedRackId), i = this.rowValues, r = this.columnValues, o = this.positionedItems, n = this.selectedItems.filter((a) => a.row === null || a.column === null), d = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((p) => p.id === a.rack_id)
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
          ${i.length && r.length ? c`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${o.map((a) => {
      const p = a.row - this.firstRow + 1, g = a.column - this.firstColumn + 1, h = !!a.wine_id;
      return c`
                    <div class=${h ? "slot occupied" : "slot"}
                      style=${`grid-row: ${p}; grid-column: ${g};`}
                      title=${this.wineLabel(a) || e("empty_position")}>
                      <strong>${h ? this.wineLabel(a) : "—"}</strong>
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
          ${n.length ? c`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${n.map((a) => c`<div class="unplaced-item">${this.wineLabel(a) || e("empty_position")}</div>`)}
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
  M({ attribute: !1 })
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
  j("ploc-cellar-rack-card")
], y);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: x("picker_rack_name"),
  description: x("picker_rack_description")
});
var Si = Object.defineProperty, Ei = Object.getOwnPropertyDescriptor, f = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ei(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Si(t, s, r), r;
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
    ].filter((r) => r != null).join(" ").toLocaleLowerCase().includes(e) : !0), s = new Intl.Collator(this.hass?.language ?? void 0, {
      numeric: !0,
      sensitivity: "base"
    });
    return [...t].sort((i, r) => this.sort === "bottles" ? r.bottles_in_cellar - i.bottles_in_cellar || s.compare(i.name, r.name) : this.sort === "vintage" && (r.vintage ?? 0) - (i.vintage ?? 0) || s.compare(i.name, r.name));
  }
  clearFilters() {
    this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name";
  }
  selectFilter(e, t, s, i) {
    return c`
      <select aria-label=${t} .value=${s}
        @change=${(r) => {
      const o = r.target.value;
      e === "color" ? this.color = o : e === "region" ? this.region = o : e === "appellation" ? this.appellation = o : this.vintage = o;
    }}>
        <option value="" ?selected=${!s}>${t}</option>
        ${i.map((r) => c`<option value=${r} ?selected=${r === s}>${r}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? l : c`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (o) => m(this.hass?.language ?? "en", o), s = e.locations.map((o) => {
      const n = o.row !== null && o.column !== null ? ` · ${t("row")} ${o.row}, ${t("column")} ${o.column}` : "";
      return `${o.rack}${n}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), r = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
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
            ${this.detail(t("bottle_volume"), r)}
            ${this.detail(t("locations"), s.length ? s.join(" · ") : null)}
          </div>
        </details>
      </article>
    `;
  }
  render() {
    const e = (r) => m(this.hass?.language ?? "en", r), t = this.filteredWines, s = t.reduce((r, o) => r + o.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
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
              @input=${(r) => {
      this.search = r.target.value;
    }} />
            ${this.selectFilter("color", e("filter_color"), this.color, this.valuesFor("color"))}
            ${this.selectFilter("region", e("filter_region"), this.region, this.valuesFor("region"))}
            ${this.selectFilter("appellation", e("filter_appellation"), this.appellation, this.valuesFor("appellation"))}
            ${this.selectFilter("vintage", e("filter_vintage"), this.vintage, this.valuesFor("vintage"))}
            <select aria-label=${e("sort_by")} .value=${this.sort}
              @change=${(r) => {
      this.sort = r.target.value;
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
            ${t.map((r) => this.renderWine(r))}
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
  M({ attribute: !1 })
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
  j("ploc-cellar-inventory-card")
], _);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: x("picker_inventory_name"),
  description: x("picker_inventory_description")
});
var Pi = Object.defineProperty, Oi = Object.getOwnPropertyDescriptor, z = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Oi(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Pi(t, s, r), r;
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
    const t = (n) => m(this.hass?.language ?? "en", n), s = /* @__PURE__ */ new Map();
    for (const n of this.inventory?.wines ?? []) {
      const d = n[e], a = d === null || d === "" ? t("statistics_unknown") : String(d), p = s.get(a) ?? { name: a, bottles: 0, wines: 0 };
      p.bottles += this.getBottleCount(n), p.wines += 1, s.set(a, p);
    }
    const i = [...s.values()].sort(
      (n, d) => d.bottles - n.bottles || n.name.localeCompare(d.name, this.hass?.language)
    );
    if (i.length <= 8) return i;
    const r = i.slice(0, 7), o = i.slice(7).reduce(
      (n, d) => ({
        name: t("statistics_other"),
        bottles: n.bottles + d.bottles,
        wines: n.wines + d.wines
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 }
    );
    return [...r, o];
  }
  renderDistribution(e, t) {
    const s = (o) => m(this.hass?.language ?? "en", o), i = this.distribution(e), r = Math.max(1, ...i.map((o) => o.bottles));
    return c`
      <section class="group">
        <h3>${s(t)}</h3>
        ${i.length ? i.map((o) => {
      const n = Math.round(o.bottles / r * 100);
      return c`
            <div class="item">
              <div class="item-heading">
                <span class="item-name">${o.name}</span>
                <span class="item-value">${o.bottles} ${s("bottles_short")}</span>
              </div>
              <div class="bar" role="progressbar"
                aria-label=${o.name}
                aria-valuemin="0"
                aria-valuemax=${r}
                aria-valuenow=${o.bottles}>
                <div class="bar-fill" style=${`width: ${n}%`}></div>
              </div>
              <div class="item-meta">${o.wines} ${s("statistics_references")}</div>
            </div>
          `;
    }) : c`<p class="muted">${s("statistics_empty")}</p>`}
      </section>
    `;
  }
  render() {
    const e = (r) => m(this.hass?.language ?? "en", r), t = this.inventory, s = t?.wines ?? [], i = s.reduce((r, o) => r + this.getBottleCount(o), 0);
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
              <span class="value">${i}</span>
              <span class="metric-label">${e("statistics_bottles")}</span>
            </div>
            <div class="metric">
              <span class="value">${s.length}</span>
              <span class="metric-label">${e("statistics_references")}</span>
            </div>
          </div>
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
z([
  M({ attribute: !1 })
], k.prototype, "hass", 2);
z([
  u()
], k.prototype, "config", 2);
z([
  u()
], k.prototype, "inventory", 2);
z([
  u()
], k.prototype, "loading", 2);
z([
  u()
], k.prototype, "error", 2);
k = z([
  j("ploc-cellar-statistics-card")
], k);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-statistics-card",
  name: x("picker_statistics_name"),
  description: x("picker_statistics_description")
});
var Ri = Object.defineProperty, Ui = Object.getOwnPropertyDescriptor, rt = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ui(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ri(t, s, r), r;
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
rt([
  M({ attribute: !1 })
], F.prototype, "hass", 2);
rt([
  u()
], F.prototype, "config", 2);
F = rt([
  j("ploc-cellar-card-editor")
], F);
var Mi = Object.defineProperty, zi = Object.getOwnPropertyDescriptor, N = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? zi(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Mi(t, s, r), r;
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
      const r = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: s },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = r.response);
    } catch (r) {
      i === this.requestGeneration && (this.error = r instanceof Error ? r.message : String(r));
    } finally {
      i === this.requestGeneration && (this.loading = !1);
    }
  }
  formatSync(e) {
    if (!e) return m(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  render() {
    const e = (i) => m(this.hass?.language ?? "en", i), t = this.inventory, s = this.config?.title ?? e("card_title");
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
            <div class="metric"><span class="value">${t.total_bottles}</span><span class="label">${e("bottles_in_cellar")}</span></div>
            <div class="metric"><span class="value">${t.total_stock_bottles ?? "—"}</span><span class="label">${e("reconstructed_stock")}</span></div>
            <div class="metric"><span class="value">${t.rack_count}</span><span class="label">${e("racks")}</span></div>
            <div class="metric"><span class="value">${t.empty_positions}</span><span class="label">${e("empty_positions")}</span></div>
          </div>
          ${t.stock_reconstruction_complete ? l : c`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="muted">${e("last_sync")} : ${this.formatSync(t.last_sync)}</div>
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
A.styles = J`
    :host { display: block; }
    ha-card { padding: 16px; color: var(--primary-text-color); }
    header { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
    h2 { margin: 0; font-size: 1.25rem; font-weight: 500; }
    button { color: var(--primary-text-color); background: var(--secondary-background-color); border: 0; border-radius: 8px; padding: 8px 12px; cursor: pointer; }
    button[disabled] { opacity: .5; cursor: default; }
    .summary { display: grid; grid-template-columns: repeat(auto-fit, minmax(110px, 1fr)); gap: 8px; margin: 16px 0; }
    .metric { background: var(--secondary-background-color); border-radius: 10px; padding: 12px; min-width: 0; }
    .value { display: block; font-size: 1.45rem; font-weight: 600; }
    .label, .muted { color: var(--secondary-text-color); font-size: .85rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;
N([
  M({ attribute: !1 })
], A.prototype, "hass", 2);
N([
  u()
], A.prototype, "config", 2);
N([
  u()
], A.prototype, "inventory", 2);
N([
  u()
], A.prototype, "loading", 2);
N([
  u()
], A.prototype, "error", 2);
A = N([
  j("ploc-cellar-card")
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
