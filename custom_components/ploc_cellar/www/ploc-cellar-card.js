const H = globalThis, W = H.ShadowRoot && (H.ShadyCSS === void 0 || H.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, F = /* @__PURE__ */ Symbol(), tt = /* @__PURE__ */ new WeakMap();
let ht = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== F) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (W && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = tt.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && tt.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ft = (e) => new ht(typeof e == "string" ? e : e + "", void 0, F), J = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, r, o) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + e[o + 1], e[0]);
  return new ht(s, e, F);
}, mt = (e, t) => {
  if (W) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), r = H.litNonce;
    r !== void 0 && i.setAttribute("nonce", r), i.textContent = s.cssText, e.appendChild(i);
  }
}, et = W ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return ft(s);
})(e) : e;
const { is: $t, defineProperty: vt, getOwnPropertyDescriptor: yt, getOwnPropertyNames: bt, getOwnPropertySymbols: wt, getPrototypeOf: xt } = Object, D = globalThis, st = D.trustedTypes, kt = st ? st.emptyScript : "", At = D.reactiveElementPolyfillSupport, M = (e, t) => e, L = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? kt : null;
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
} }, Z = (e, t) => !$t(e, t), it = { attribute: !0, type: String, converter: L, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), D.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let S = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = it) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, i, s);
      r !== void 0 && vt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: r, set: o } = yt(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? it;
  }
  static _$Ei() {
    if (this.hasOwnProperty(M("elementProperties"))) return;
    const t = xt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(M("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(M("properties"))) {
      const s = this.properties, i = [...bt(s), ...wt(s)];
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
      for (const r of i) s.unshift(et(r));
    } else t !== void 0 && s.push(et(t));
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
    return mt(t, this.constructor.elementStyles), t;
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
      const o = (i.converter?.toAttribute !== void 0 ? i.converter : L).toAttribute(s, i.type);
      this._$Em = t, o == null ? this.removeAttribute(r) : this.setAttribute(r, o), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, r = i._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const o = i.getPropertyOptions(r), n = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : L;
      this._$Em = r;
      const d = n.fromAttribute(s, o.type);
      this[r] = d ?? this._$Ej?.get(r) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, r = !1, o) {
    if (t !== void 0) {
      const n = this.constructor;
      if (r === !1 && (o = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? Z)(o, s) || i.useDefault && i.reflect && o === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
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
S.elementStyles = [], S.shadowRootOptions = { mode: "open" }, S[M("elementProperties")] = /* @__PURE__ */ new Map(), S[M("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: S }), (D.reactiveElementVersions ??= []).push("2.1.2");
const K = globalThis, rt = (e) => e, j = K.trustedTypes, ot = j ? j.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, pt = "$lit$", y = `lit$${Math.random().toFixed(9).slice(2)}$`, ut = "?" + y, Ct = `<${ut}>`, A = document, I = () => A.createComment(""), N = (e) => e === null || typeof e != "object" && typeof e != "function", Q = Array.isArray, St = (e) => Q(e) || typeof e?.[Symbol.iterator] == "function", B = `[ 	
\f\r]`, U = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, nt = /-->/g, at = />/g, w = RegExp(`>|${B}(?:([^\\s"'>=/]+)(${B}*=${B}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ct = /'/g, lt = /"/g, gt = /^(?:script|style|textarea|title)$/i, Et = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), l = Et(1), E = /* @__PURE__ */ Symbol.for("lit-noChange"), c = /* @__PURE__ */ Symbol.for("lit-nothing"), dt = /* @__PURE__ */ new WeakMap(), x = A.createTreeWalker(A, 129);
function _t(e, t) {
  if (!Q(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ot !== void 0 ? ot.createHTML(t) : t;
}
const Pt = (e, t) => {
  const s = e.length - 1, i = [];
  let r, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = U;
  for (let d = 0; d < s; d++) {
    const a = e[d];
    let p, g, h = -1, m = 0;
    for (; m < a.length && (n.lastIndex = m, g = n.exec(a), g !== null); ) m = n.lastIndex, n === U ? g[1] === "!--" ? n = nt : g[1] !== void 0 ? n = at : g[2] !== void 0 ? (gt.test(g[2]) && (r = RegExp("</" + g[2], "g")), n = w) : g[3] !== void 0 && (n = w) : n === w ? g[0] === ">" ? (n = r ?? U, h = -1) : g[1] === void 0 ? h = -2 : (h = n.lastIndex - g[2].length, p = g[1], n = g[3] === void 0 ? w : g[3] === '"' ? lt : ct) : n === lt || n === ct ? n = w : n === nt || n === at ? n = U : (n = w, r = void 0);
    const v = n === w && e[d + 1].startsWith("/>") ? " " : "";
    o += n === U ? a + Ct : h >= 0 ? (i.push(p), a.slice(0, h) + pt + a.slice(h) + y + v) : a + y + (h === -2 ? d : v);
  }
  return [_t(e, o + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class T {
  constructor({ strings: t, _$litType$: s }, i) {
    let r;
    this.parts = [];
    let o = 0, n = 0;
    const d = t.length - 1, a = this.parts, [p, g] = Pt(t, s);
    if (this.el = T.createElement(p, i), x.currentNode = this.el.content, s === 2 || s === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = x.nextNode()) !== null && a.length < d; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(pt)) {
          const m = g[n++], v = r.getAttribute(h).split(y), q = /([.?@])?(.*)/.exec(m);
          a.push({ type: 1, index: o, name: q[2], strings: v, ctor: q[1] === "." ? Rt : q[1] === "?" ? Ut : q[1] === "@" ? Mt : V }), r.removeAttribute(h);
        } else h.startsWith(y) && (a.push({ type: 6, index: o }), r.removeAttribute(h));
        if (gt.test(r.tagName)) {
          const h = r.textContent.split(y), m = h.length - 1;
          if (m > 0) {
            r.textContent = j ? j.emptyScript : "";
            for (let v = 0; v < m; v++) r.append(h[v], I()), x.nextNode(), a.push({ type: 2, index: ++o });
            r.append(h[m], I());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ut) a.push({ type: 2, index: o });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(y, h + 1)) !== -1; ) a.push({ type: 7, index: o }), h += y.length - 1;
      }
      o++;
    }
  }
  static createElement(t, s) {
    const i = A.createElement("template");
    return i.innerHTML = t, i;
  }
}
function P(e, t, s = e, i) {
  if (t === E) return t;
  let r = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const o = N(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== o && (r?._$AO?.(!1), o === void 0 ? r = void 0 : (r = new o(e), r._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = r : s._$Cl = r), r !== void 0 && (t = P(e, r._$AS(e, t.values), r, i)), t;
}
class Ot {
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
    const { el: { content: s }, parts: i } = this._$AD, r = (t?.creationScope ?? A).importNode(s, !0);
    x.currentNode = r;
    let o = x.nextNode(), n = 0, d = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let p;
        a.type === 2 ? p = new z(o, o.nextSibling, this, t) : a.type === 1 ? p = new a.ctor(o, a.name, a.strings, this, t) : a.type === 6 && (p = new It(o, this, t)), this._$AV.push(p), a = i[++d];
      }
      n !== a?.index && (o = x.nextNode(), n++);
    }
    return x.currentNode = A, r;
  }
  p(t) {
    let s = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, s), s += i.strings.length - 2) : i._$AI(t[s])), s++;
  }
}
class z {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, s, i, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = P(this, t, s), N(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== E && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : St(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && N(this._$AH) ? this._$AA.nextSibling.data = t : this.T(A.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, r = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = T.createElement(_t(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === r) this._$AH.p(s);
    else {
      const o = new Ot(r, this), n = o.u(this.options);
      o.p(s), this.T(n), this._$AH = o;
    }
  }
  _$AC(t) {
    let s = dt.get(t.strings);
    return s === void 0 && dt.set(t.strings, s = new T(t)), s;
  }
  k(t) {
    Q(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, r = 0;
    for (const o of t) r === s.length ? s.push(i = new z(this.O(I()), this.O(I()), this, this.options)) : i = s[r], i._$AI(o), r++;
    r < s.length && (this._$AR(i && i._$AB.nextSibling, r), s.length = r);
  }
  _$AR(t = this._$AA.nextSibling, s) {
    for (this._$AP?.(!1, !0, s); t !== this._$AB; ) {
      const i = rt(t).nextSibling;
      rt(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class V {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, r, o) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = s, this._$AM = r, this.options = o, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = c;
  }
  _$AI(t, s = this, i, r) {
    const o = this.strings;
    let n = !1;
    if (o === void 0) t = P(this, t, s, 0), n = !N(t) || t !== this._$AH && t !== E, n && (this._$AH = t);
    else {
      const d = t;
      let a, p;
      for (t = o[0], a = 0; a < o.length - 1; a++) p = P(this, d[i + a], s, a), p === E && (p = this._$AH[a]), n ||= !N(p) || p !== this._$AH[a], p === c ? t = c : t !== c && (t += (p ?? "") + o[a + 1]), this._$AH[a] = p;
    }
    n && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Rt extends V {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Ut extends V {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Mt extends V {
  constructor(t, s, i, r, o) {
    super(t, s, i, r, o), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = P(this, t, s, 0) ?? c) === E) return;
    const i = this._$AH, r = t === c && i !== c || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, o = t !== c && (i === c || r);
    r && this.element.removeEventListener(this.name, this, i), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class It {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    P(this, t);
  }
}
const Nt = K.litHtmlPolyfillSupport;
Nt?.(T, z), (K.litHtmlVersions ??= []).push("3.3.3");
const Tt = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let r = i._$litPart$;
  if (r === void 0) {
    const o = s?.renderBefore ?? null;
    i._$litPart$ = r = new z(t.insertBefore(I(), o), o, void 0, s ?? {});
  }
  return r._$AI(e), r;
};
const X = globalThis;
class k extends S {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const s = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Tt(s, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return E;
  }
}
k._$litElement$ = !0, k.finalized = !0, X.litElementHydrateSupport?.({ LitElement: k });
const zt = X.litElementPolyfillSupport;
zt?.({ LitElement: k });
(X.litElementVersions ??= []).push("4.2.2");
const Y = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const qt = { attribute: !0, type: String, converter: L, reflect: !1, hasChanged: Z }, Ht = (e = qt, t, s) => {
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
function G(e) {
  return (t, s) => typeof s == "object" ? Ht(e, t, s) : ((i, r, o) => {
    const n = r.hasOwnProperty(o);
    return r.constructor.createProperty(o, i), n ? Object.getOwnPropertyDescriptor(r, o) : void 0;
  })(e, t, s);
}
function u(e) {
  return G({ ...e, state: !0, attribute: !1 });
}
const Lt = "Ploc Cellar", jt = "Cellar storage", Dt = "Refresh", Vt = "Loading…", Gt = "Never", Bt = "Bottles in cellar", Wt = "Reconstructed stock", Ft = "Racks", Jt = "Empty positions", Zt = "Data may be stale: the latest synchronization failed.", Kt = "Stock reconstruction is incomplete: only physical quantities are available.", Qt = "Last successful synchronization", Xt = "Search wines", Yt = "Search wines…", te = "No matching wines.", ee = "Select a Ploc Cellar configuration in the card editor.", se = "Rack selection", ie = "occupied", re = "free", oe = "Unknown wine", ne = "Empty position", ae = "Row", ce = "Column", le = "No row/column coordinates are available for this rack.", de = "Positions without coordinates", he = "Not mapped", pe = "No racks available.", ue = "position(s) reference a missing rack.", ge = "Wine inventory", _e = "All colors", fe = "All regions", me = "All appellations", $e = "All vintages", ve = "Sort by", ye = "Name", be = "Quantity descending", we = "Vintage descending", xe = "{count} wine(s)", ke = "{count} bottle(s)", Ae = "Clear filters", Ce = "btl.", Se = "Unknown vintage", Ee = "Wine details", Pe = "Grapes", Oe = "Cuvée", Re = "Volume", Ue = "Locations", Me = "Ploc Cellar", Ie = "Cellar overview and stock indicators.", Ne = "Wine inventory", Te = "Search, filter and browse the wine inventory.", ze = "Cellar racks", qe = "Visualize rack positions and the wines stored in them.", He = "Ploc Cellar configuration", Le = "Select the PLOUD connection used by this card.", je = "Card title", De = "Optional. Leave empty to use the default title.", Ve = {
  card_title: Lt,
  rack_title: jt,
  refresh: Dt,
  loading: Vt,
  never: Gt,
  bottles_in_cellar: Bt,
  reconstructed_stock: Wt,
  racks: Ft,
  empty_positions: Jt,
  stale: Zt,
  reconstruction_incomplete: Kt,
  last_sync: Qt,
  search_wine: Xt,
  search_placeholder: Yt,
  no_matching_wines: te,
  select_config: ee,
  rack_selection: se,
  occupied: ie,
  free: re,
  unknown_wine: oe,
  empty_position: ne,
  row: ae,
  column: ce,
  no_coordinates: le,
  positions_without_coordinates: de,
  not_mapped: he,
  no_racks: pe,
  missing_rack: ue,
  inventory_title: ge,
  filter_color: _e,
  filter_region: fe,
  filter_appellation: me,
  filter_vintage: $e,
  sort_by: ve,
  sort_name: ye,
  sort_bottles: be,
  sort_vintage: we,
  inventory_results: xe,
  inventory_bottle_total: ke,
  clear_filters: Ae,
  bottles_short: Ce,
  unknown_vintage: Se,
  wine_details: Ee,
  grapes: Pe,
  cuvee: Oe,
  bottle_volume: Re,
  locations: Ue,
  picker_overview_name: Me,
  picker_overview_description: Ie,
  picker_inventory_name: Ne,
  picker_inventory_description: Te,
  picker_rack_name: ze,
  picker_rack_description: qe,
  editor_configuration: He,
  editor_configuration_helper: Le,
  editor_title: je,
  editor_title_helper: De
}, Ge = "Cave Ploc", Be = "Rangement de la cave", We = "Actualiser", Fe = "Chargement…", Je = "Jamais", Ze = "Bouteilles en cave", Ke = "Stock reconstitué", Qe = "Casiers", Xe = "Places libres", Ye = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", ts = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", es = "Dernière synchronisation réussie", ss = "Rechercher un vin", is = "Rechercher un vin…", rs = "Aucun vin correspondant.", os = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", ns = "Sélection du casier", as = "occupées", cs = "libres", ls = "Vin inconnu", ds = "Emplacement libre", hs = "Rangée", ps = "Colonne", us = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", gs = "Emplacements sans coordonnées", _s = "Non renseigné", fs = "Aucun casier disponible.", ms = "emplacement(s) référencent un casier absent.", $s = "Inventaire des vins", vs = "Toutes les couleurs", ys = "Toutes les régions", bs = "Toutes les appellations", ws = "Tous les millésimes", xs = "Trier par", ks = "Nom", As = "Quantité décroissante", Cs = "Millésime décroissant", Ss = "{count} référence(s)", Es = "{count} bouteille(s)", Ps = "Effacer les filtres", Os = "bt.", Rs = "Millésime inconnu", Us = "Détails du vin", Ms = "Cépages", Is = "Cuvée", Ns = "Volume", Ts = "Emplacements", zs = "Cave Ploc", qs = "Vue d’ensemble de la cave et indicateurs de stock.", Hs = "Inventaire des vins", Ls = "Rechercher, filtrer et parcourir l’inventaire des vins.", js = "Casiers de la cave", Ds = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", Vs = "Configuration Ploc Cellar", Gs = "Sélectionnez la connexion PLOUD utilisée par cette carte.", Bs = "Titre de la carte", Ws = "Facultatif. Laissez vide pour utiliser le titre par défaut.", Fs = {
  card_title: Ge,
  rack_title: Be,
  refresh: We,
  loading: Fe,
  never: Je,
  bottles_in_cellar: Ze,
  reconstructed_stock: Ke,
  racks: Qe,
  empty_positions: Xe,
  stale: Ye,
  reconstruction_incomplete: ts,
  last_sync: es,
  search_wine: ss,
  search_placeholder: is,
  no_matching_wines: rs,
  select_config: os,
  rack_selection: ns,
  occupied: as,
  free: cs,
  unknown_wine: ls,
  empty_position: ds,
  row: hs,
  column: ps,
  no_coordinates: us,
  positions_without_coordinates: gs,
  not_mapped: _s,
  no_racks: fs,
  missing_rack: ms,
  inventory_title: $s,
  filter_color: vs,
  filter_region: ys,
  filter_appellation: bs,
  filter_vintage: ws,
  sort_by: xs,
  sort_name: ks,
  sort_bottles: As,
  sort_vintage: Cs,
  inventory_results: Ss,
  inventory_bottle_total: Es,
  clear_filters: Ps,
  bottles_short: Os,
  unknown_vintage: Rs,
  wine_details: Us,
  grapes: Ms,
  cuvee: Is,
  bottle_volume: Ns,
  locations: Ts,
  picker_overview_name: zs,
  picker_overview_description: qs,
  picker_inventory_name: Hs,
  picker_inventory_description: Ls,
  picker_rack_name: js,
  picker_rack_description: Ds,
  editor_configuration: Vs,
  editor_configuration_helper: Gs,
  editor_title: Bs,
  editor_title_helper: Ws
};
function O(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? Fs : Ve)[t];
}
var Js = Object.defineProperty, Zs = Object.getOwnPropertyDescriptor, C = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Zs(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Js(t, s, r), r;
};
let $ = class extends k {
  constructor() {
    super(...arguments), this.loading = !1, this.requestGeneration = 0;
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "config_entry_id",
          required: !0,
          selector: { config_entry: { integration: "ploc_cellar" } }
        },
        { name: "title", selector: { text: {} } }
      ]
    };
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
    return t ? t.name : O(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const e = (a) => O(this.hass?.language ?? "en", a), t = this.inventory, s = t?.racks.find((a) => a.id === this.selectedRackId), i = this.rowValues, r = this.columnValues, o = this.positionedItems, n = this.selectedItems.filter((a) => a.row === null || a.column === null), d = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((p) => p.id === a.rack_id)
    );
    return l`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? l`<div class="error">${this.error}</div>` : c}
        ${this.config?.config_entry_id ? c : l`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? l`<div class="warning">${e("stale")}</div>` : c}
        ${t?.racks.length ? l`
          <nav class="rack-picker" aria-label=${e("rack_selection")}>
            ${t.racks.map((a) => l`
              <button aria-pressed=${a.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = a.id;
    }}>${a.name}</button>
            `)}
          </nav>
          <div class="legend">${s?.name ?? ""} · ${this.selectedItems.filter((a) => a.wine_id).length} ${e("occupied")} · ${this.selectedItems.filter((a) => !a.wine_id).length} ${e("free")}</div>
          ${i.length && r.length ? l`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${o.map((a) => {
      const p = a.row - this.firstRow + 1, g = a.column - this.firstColumn + 1, h = !!a.wine_id;
      return l`
                    <div class=${h ? "slot occupied" : "slot"}
                      style=${`grid-row: ${p}; grid-column: ${g};`}
                      title=${this.wineLabel(a) || e("empty_position")}>
                      <strong>${h ? this.wineLabel(a) : "—"}</strong>
                      <small>${e("row")} ${a.row} · ${e("column")} ${a.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((a) => l`
                  <div class="slot missing"
                    style=${`grid-row: ${a.row - this.firstRow + 1}; grid-column: ${a.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${e("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : l`<div class="warning">${e("no_coordinates")}</div>`}
          ${n.length ? l`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${n.map((a) => l`<div class="unplaced-item">${this.wineLabel(a) || e("empty_position")}</div>`)}
            </div>
          ` : c}
        ` : l`<p class="muted">${e("no_racks")}</p>`}
        ${d.length ? l`
          <div class="warning">${d.length} ${e("missing_rack")}</div>
        ` : c}
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
$.styles = J`
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
C([
  G({ attribute: !1 })
], $.prototype, "hass", 2);
C([
  u()
], $.prototype, "config", 2);
C([
  u()
], $.prototype, "inventory", 2);
C([
  u()
], $.prototype, "selectedRackId", 2);
C([
  u()
], $.prototype, "loading", 2);
C([
  u()
], $.prototype, "error", 2);
$ = C([
  Y("ploc-cellar-rack-card")
], $);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: "Ploc Cellar Rack",
  description: "Visualize physical rack positions and assigned wines."
});
var Ks = Object.defineProperty, Qs = Object.getOwnPropertyDescriptor, f = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Qs(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Ks(t, s, r), r;
};
let _ = class extends k {
  constructor() {
    super(...arguments), this.loading = !1, this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name", this.requestGeneration = 0;
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "config_entry_id",
          required: !0,
          selector: { config_entry: { integration: "ploc_cellar" } }
        },
        { name: "title", selector: { text: {} } }
      ]
    };
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
    return l`
      <select aria-label=${t} .value=${s}
        @change=${(r) => {
      const o = r.target.value;
      e === "color" ? this.color = o : e === "region" ? this.region = o : e === "appellation" ? this.appellation = o : this.vintage = o;
    }}>
        <option value="" ?selected=${!s}>${t}</option>
        ${i.map((r) => l`<option value=${r} ?selected=${r === s}>${r}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? c : l`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (o) => O(this.hass?.language ?? "en", o), s = e.locations.map((o) => {
      const n = o.row !== null && o.column !== null ? ` · ${t("row")} ${o.row}, ${t("column")} ${o.column}` : "";
      return `${o.rack}${n}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), r = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
    return l`
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
          ${e.color ? l`<span class="tag">${e.color}</span>` : c}
          <span class="tag">${i}</span>
          ${e.bottle_format ? l`<span class="tag">${e.bottle_format}</span>` : c}
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
    const e = (r) => O(this.hass?.language ?? "en", r), t = this.filteredWines, s = t.reduce((r, o) => r + o.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
    return l`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("inventory_title")}</h2>
          <div class="actions">
            <button ?disabled=${this.loading} @click=${() => this.refresh()}>
              ${this.loading ? e("loading") : e("refresh")}
            </button>
          </div>
        </header>
        ${this.error ? l`<div class="error">${this.error}</div>` : c}
        ${this.config?.config_entry_id ? c : l`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? l`<div class="warning">${e("stale")}</div>` : c}
        ${this.inventory ? l`
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
            ${i ? l`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : c}
          </div>
          ${this.inventory.stock_reconstruction_complete ? c : l`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((r) => this.renderWine(r))}
          </div>
          ${t.length === 0 ? l`<p class="muted">${e("no_matching_wines")}</p>` : c}
        ` : c}
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
  G({ attribute: !1 })
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
  Y("ploc-cellar-inventory-card")
], _);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: "Ploc Cellar Inventory",
  description: "Search, filter and browse the wine inventory."
});
var Xs = Object.defineProperty, Ys = Object.getOwnPropertyDescriptor, R = (e, t, s, i) => {
  for (var r = i > 1 ? void 0 : i ? Ys(t, s) : t, o = e.length - 1, n; o >= 0; o--)
    (n = e[o]) && (r = (i ? n(t, s, r) : n(r)) || r);
  return i && r && Xs(t, s, r), r;
};
let b = class extends k {
  constructor() {
    super(...arguments), this.loading = !1, this.requestGeneration = 0;
  }
  static getConfigForm() {
    return {
      schema: [
        {
          name: "config_entry_id",
          required: !0,
          selector: { config_entry: { integration: "ploc_cellar" } }
        },
        { name: "title", selector: { text: {} } }
      ]
    };
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
    if (!e) return O(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  render() {
    const e = (i) => O(this.hass?.language ?? "en", i), t = this.inventory, s = this.config?.title ?? e("card_title");
    return l`
      <ha-card>
        <header>
          <h2>${s}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? l`<div class="error">${this.error}</div>` : c}
        ${this.config?.config_entry_id ? c : l`<div class="muted">${e("select_config")}</div>`}
        ${t ? l`
          ${t.stale ? l`<div class="warning">${e("stale")}</div>` : c}
          <div class="summary">
            <div class="metric"><span class="value">${t.total_bottles}</span><span class="label">${e("bottles_in_cellar")}</span></div>
            <div class="metric"><span class="value">${t.total_stock_bottles ?? "—"}</span><span class="label">${e("reconstructed_stock")}</span></div>
            <div class="metric"><span class="value">${t.rack_count}</span><span class="label">${e("racks")}</span></div>
            <div class="metric"><span class="value">${t.empty_positions}</span><span class="label">${e("empty_positions")}</span></div>
          </div>
          ${t.stock_reconstruction_complete ? c : l`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="muted">${e("last_sync")} : ${this.formatSync(t.last_sync)}</div>
        ` : c}
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
b.styles = J`
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
R([
  G({ attribute: !1 })
], b.prototype, "hass", 2);
R([
  u()
], b.prototype, "config", 2);
R([
  u()
], b.prototype, "inventory", 2);
R([
  u()
], b.prototype, "loading", 2);
R([
  u()
], b.prototype, "error", 2);
b = R([
  Y("ploc-cellar-card")
], b);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: "Ploc Cellar",
  description: "Cellar overview and stock indicators."
});
export {
  b as PlocCellarCard
};
