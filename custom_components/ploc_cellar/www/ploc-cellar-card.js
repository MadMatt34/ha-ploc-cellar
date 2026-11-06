const T = globalThis, B = T.ShadowRoot && (T.ShadyCSS === void 0 || T.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, V = /* @__PURE__ */ Symbol(), K = /* @__PURE__ */ new WeakMap();
let at = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== V) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (B && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const gt = (i) => new at(typeof i == "string" ? i : i + "", void 0, V), ct = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new at(e, i, V);
}, $t = (i, t) => {
  if (B) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = T.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, Q = B ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return gt(e);
})(i) : i;
const { is: ft, defineProperty: _t, getOwnPropertyDescriptor: mt, getOwnPropertyNames: vt, getOwnPropertySymbols: yt, getPrototypeOf: wt } = Object, j = globalThis, X = j.trustedTypes, bt = X ? X.emptyScript : "", At = j.reactiveElementPolyfillSupport, R = (i, t) => i, H = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? bt : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, W = (i, t) => !ft(i, t), Y = { attribute: !0, type: String, converter: H, reflect: !1, useDefault: !1, hasChanged: W };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), j.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let k = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Y) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = /* @__PURE__ */ Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && _t(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = mt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Y;
  }
  static _$Ei() {
    if (this.hasOwnProperty(R("elementProperties"))) return;
    const t = wt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(R("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(R("properties"))) {
      const e = this.properties, s = [...vt(e), ...yt(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Q(r));
    } else t !== void 0 && e.push(Q(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
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
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : H).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : H;
      this._$Em = r;
      const c = o.fromAttribute(e, n.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? W)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
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
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: o } = n, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
k.elementStyles = [], k.shadowRootOptions = { mode: "open" }, k[R("elementProperties")] = /* @__PURE__ */ new Map(), k[R("finalized")] = /* @__PURE__ */ new Map(), At?.({ ReactiveElement: k }), (j.reactiveElementVersions ??= []).push("2.1.2");
const G = globalThis, tt = (i) => i, z = G.trustedTypes, et = z ? z.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, lt = "$lit$", v = `lit$${Math.random().toFixed(9).slice(2)}$`, dt = "?" + v, xt = `<${dt}>`, b = document, O = () => b.createComment(""), U = (i) => i === null || typeof i != "object" && typeof i != "function", F = Array.isArray, kt = (i) => F(i) || typeof i?.[Symbol.iterator] == "function", q = `[ 	
\f\r]`, P = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, it = />/g, y = RegExp(`>|${q}(?:([^\\s"'>=/]+)(${q}*=${q}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), rt = /'/g, nt = /"/g, ht = /^(?:script|style|textarea|title)$/i, Ct = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), p = Ct(1), S = /* @__PURE__ */ Symbol.for("lit-noChange"), l = /* @__PURE__ */ Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), w = b.createTreeWalker(b, 129);
function pt(i, t) {
  if (!F(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return et !== void 0 ? et.createHTML(t) : t;
}
const St = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = P;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let h, u, d = -1, $ = 0;
    for (; $ < a.length && (o.lastIndex = $, u = o.exec(a), u !== null); ) $ = o.lastIndex, o === P ? u[1] === "!--" ? o = st : u[1] !== void 0 ? o = it : u[2] !== void 0 ? (ht.test(u[2]) && (r = RegExp("</" + u[2], "g")), o = y) : u[3] !== void 0 && (o = y) : o === y ? u[0] === ">" ? (o = r ?? P, d = -1) : u[1] === void 0 ? d = -2 : (d = o.lastIndex - u[2].length, h = u[1], o = u[3] === void 0 ? y : u[3] === '"' ? nt : rt) : o === nt || o === rt ? o = y : o === st || o === it ? o = P : (o = y, r = void 0);
    const m = o === y && i[c + 1].startsWith("/>") ? " " : "";
    n += o === P ? a + xt : d >= 0 ? (s.push(h), a.slice(0, d) + lt + a.slice(d) + v + m) : a + v + (d === -2 ? c : m);
  }
  return [pt(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class M {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [h, u] = St(t, e);
    if (this.el = M.createElement(h, s), w.currentNode = this.el.content, e === 2 || e === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (r = w.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const d of r.getAttributeNames()) if (d.endsWith(lt)) {
          const $ = u[o++], m = r.getAttribute(d).split(v), I = /([.?@])?(.*)/.exec($);
          a.push({ type: 1, index: n, name: I[2], strings: m, ctor: I[1] === "." ? Pt : I[1] === "?" ? Rt : I[1] === "@" ? Ot : D }), r.removeAttribute(d);
        } else d.startsWith(v) && (a.push({ type: 6, index: n }), r.removeAttribute(d));
        if (ht.test(r.tagName)) {
          const d = r.textContent.split(v), $ = d.length - 1;
          if ($ > 0) {
            r.textContent = z ? z.emptyScript : "";
            for (let m = 0; m < $; m++) r.append(d[m], O()), w.nextNode(), a.push({ type: 2, index: ++n });
            r.append(d[$], O());
          }
        }
      } else if (r.nodeType === 8) if (r.data === dt) a.push({ type: 2, index: n });
      else {
        let d = -1;
        for (; (d = r.data.indexOf(v, d + 1)) !== -1; ) a.push({ type: 7, index: n }), d += v.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = b.createElement("template");
    return s.innerHTML = t, s;
  }
}
function E(i, t, e = i, s) {
  if (t === S) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = U(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = E(i, r._$AS(i, t.values), r, s)), t;
}
class Et {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? b).importNode(e, !0);
    w.currentNode = r;
    let n = w.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let h;
        a.type === 2 ? h = new N(n, n.nextSibling, this, t) : a.type === 1 ? h = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (h = new Ut(n, this, t)), this._$AV.push(h), a = s[++c];
      }
      o !== a?.index && (n = w.nextNode(), o++);
    }
    return w.currentNode = b, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class N {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = E(this, t, e), U(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== S && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : kt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && U(this._$AH) ? this._$AA.nextSibling.data = t : this.T(b.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = M.createElement(pt(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Et(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new M(t)), e;
  }
  k(t) {
    F(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new N(this.O(O()), this.O(O()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = tt(t).nextSibling;
      tt(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class D {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = E(this, t, e, 0), o = !U(t) || t !== this._$AH && t !== S, o && (this._$AH = t);
    else {
      const c = t;
      let a, h;
      for (t = n[0], a = 0; a < n.length - 1; a++) h = E(this, c[s + a], e, a), h === S && (h = this._$AH[a]), o ||= !U(h) || h !== this._$AH[a], h === l ? t = l : t !== l && (t += (h ?? "") + n[a + 1]), this._$AH[a] = h;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Pt extends D {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Rt extends D {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class Ot extends D {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = E(this, t, e, 0) ?? l) === S) return;
    const s = this._$AH, r = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Ut {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    E(this, t);
  }
}
const Mt = G.litHtmlPolyfillSupport;
Mt?.(M, N), (G.litHtmlVersions ??= []).push("3.3.3");
const Nt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new N(t.insertBefore(O(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
const J = globalThis;
class C extends k {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return S;
  }
}
C._$litElement$ = !0, C.finalized = !0, J.litElementHydrateSupport?.({ LitElement: C });
const It = J.litElementPolyfillSupport;
It?.({ LitElement: C });
(J.litElementVersions ??= []).push("4.2.2");
const ut = (i) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(i, t);
  }) : customElements.define(i, t);
};
const Tt = { attribute: !0, type: String, converter: H, reflect: !1, hasChanged: W }, Ht = (i = Tt, t, e) => {
  const { kind: s, metadata: r } = e;
  let n = globalThis.litPropertyMetadata.get(r);
  if (n === void 0 && globalThis.litPropertyMetadata.set(r, n = /* @__PURE__ */ new Map()), s === "setter" && ((i = Object.create(i)).wrapped = !0), n.set(e.name, i), s === "accessor") {
    const { name: o } = e;
    return { set(c) {
      const a = t.get.call(this);
      t.set.call(this, c), this.requestUpdate(o, a, i, !0, c);
    }, init(c) {
      return c !== void 0 && this.C(o, void 0, i, c), c;
    } };
  }
  if (s === "setter") {
    const { name: o } = e;
    return function(c) {
      const a = this[o];
      t.call(this, c), this.requestUpdate(o, a, i, !0, c);
    };
  }
  throw Error("Unsupported decorator location: " + s);
};
function Z(i) {
  return (t, e) => typeof e == "object" ? Ht(i, t, e) : ((s, r, n) => {
    const o = r.hasOwnProperty(n);
    return r.constructor.createProperty(n, s), o ? Object.getOwnPropertyDescriptor(r, n) : void 0;
  })(i, t, e);
}
function g(i) {
  return Z({ ...i, state: !0, attribute: !1 });
}
const zt = "Ploc Cellar", Lt = "Cellar storage", jt = "Refresh", Dt = "Loading…", qt = "Never", Bt = "Bottles in cellar", Vt = "Reconstructed stock", Wt = "Racks", Gt = "Empty positions", Ft = "Data may be stale: the latest synchronization failed.", Jt = "Stock reconstruction is incomplete: only physical quantities are available.", Zt = "Last successful synchronization", Kt = "Search wines", Qt = "Search wines…", Xt = "No matching wines.", Yt = "Select a Ploc Cellar configuration in the card editor.", te = "Rack selection", ee = "occupied", se = "free", ie = "Unknown wine", re = "Empty position", ne = "Row", oe = "Column", ae = "No row/column coordinates are available for this rack.", ce = "Positions without coordinates", le = "Not mapped", de = "No racks available.", he = "position(s) reference a missing rack.", pe = {
  card_title: zt,
  rack_title: Lt,
  refresh: jt,
  loading: Dt,
  never: qt,
  bottles_in_cellar: Bt,
  reconstructed_stock: Vt,
  racks: Wt,
  empty_positions: Gt,
  stale: Ft,
  reconstruction_incomplete: Jt,
  last_sync: Zt,
  search_wine: Kt,
  search_placeholder: Qt,
  no_matching_wines: Xt,
  select_config: Yt,
  rack_selection: te,
  occupied: ee,
  free: se,
  unknown_wine: ie,
  empty_position: re,
  row: ne,
  column: oe,
  no_coordinates: ae,
  positions_without_coordinates: ce,
  not_mapped: le,
  no_racks: de,
  missing_rack: he
}, ue = "Cave Ploc", ge = "Rangement de la cave", $e = "Actualiser", fe = "Chargement…", _e = "Jamais", me = "Bouteilles en cave", ve = "Stock reconstitué", ye = "Casiers", we = "Places libres", be = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", Ae = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", xe = "Dernière synchronisation réussie", ke = "Rechercher un vin", Ce = "Rechercher un vin…", Se = "Aucun vin correspondant.", Ee = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", Pe = "Sélection du casier", Re = "occupées", Oe = "libres", Ue = "Vin inconnu", Me = "Emplacement libre", Ne = "Rangée", Ie = "Colonne", Te = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", He = "Emplacements sans coordonnées", ze = "Non renseigné", Le = "Aucun casier disponible.", je = "emplacement(s) référencent un casier absent.", De = {
  card_title: ue,
  rack_title: ge,
  refresh: $e,
  loading: fe,
  never: _e,
  bottles_in_cellar: me,
  reconstructed_stock: ve,
  racks: ye,
  empty_positions: we,
  stale: be,
  reconstruction_incomplete: Ae,
  last_sync: xe,
  search_wine: ke,
  search_placeholder: Ce,
  no_matching_wines: Se,
  select_config: Ee,
  rack_selection: Pe,
  occupied: Re,
  free: Oe,
  unknown_wine: Ue,
  empty_position: Me,
  row: Ne,
  column: Ie,
  no_coordinates: Te,
  positions_without_coordinates: He,
  not_mapped: ze,
  no_racks: Le,
  missing_rack: je
};
function L(i, t) {
  return (i.toLocaleLowerCase().startsWith("fr") ? De : pe)[t];
}
var qe = Object.defineProperty, Be = Object.getOwnPropertyDescriptor, A = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? Be(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && qe(t, e, r), r;
};
let f = class extends C {
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
  setConfig(i) {
    this.requestGeneration += 1, this.loading = !1, this.config = i, this.inventory = void 0, this.error = void 0, this.config.config_entry_id && this.refresh();
  }
  updated() {
    this.hass && this.config && !this.inventory && !this.loading && !this.error && this.refresh();
  }
  async refresh() {
    const i = this.hass, t = this.config;
    if (!i || !t?.config_entry_id || this.loading) return;
    const e = t.config_entry_id, s = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const r = await i.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: e },
        return_response: !0
      });
      s === this.requestGeneration && (this.inventory = r.response, (!this.selectedRackId || !this.inventory.racks.some((n) => n.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
    } catch (r) {
      s === this.requestGeneration && (this.error = r instanceof Error ? r.message : String(r));
    } finally {
      s === this.requestGeneration && (this.loading = !1);
    }
  }
  get selectedItems() {
    return (this.inventory?.rack_items ?? []).filter((i) => i.rack_id === this.selectedRackId);
  }
  get positionedItems() {
    return this.selectedItems.filter(
      (i) => i.row !== null && i.column !== null
    );
  }
  get rowValues() {
    return this.positionedItems.map((i) => i.row);
  }
  get columnValues() {
    return this.positionedItems.map((i) => i.column);
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
    const i = new Set(
      this.positionedItems.map((e) => `${e.row}:${e.column}`)
    ), t = [];
    for (let e = this.firstRow; e <= Math.max(...this.rowValues); e += 1)
      for (let s = this.firstColumn; s <= Math.max(...this.columnValues); s += 1)
        i.has(`${e}:${s}`) || t.push({ row: e, column: s });
    return t;
  }
  get wineById() {
    return new Map((this.inventory?.wines ?? []).map((i) => [i.id, i]));
  }
  wineLabel(i) {
    if (!i.wine_id) return "";
    const t = this.wineById.get(i.wine_id);
    return t ? t.name : L(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const i = (a) => L(this.hass?.language ?? "en", a), t = this.inventory, e = t?.racks.find((a) => a.id === this.selectedRackId), s = this.rowValues, r = this.columnValues, n = this.positionedItems, o = this.selectedItems.filter((a) => a.row === null || a.column === null), c = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((h) => h.id === a.rack_id)
    );
    return p`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? i("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : i("refresh")}</button>
        </header>
        ${this.error ? p`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : p`<div class="muted">${i("select_config")}</div>`}
        ${t?.stale ? p`<div class="warning">${i("stale")}</div>` : l}
        ${t?.racks.length ? p`
          <nav class="rack-picker" aria-label=${i("rack_selection")}>
            ${t.racks.map((a) => p`
              <button aria-pressed=${a.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = a.id;
    }}>${a.name}</button>
            `)}
          </nav>
          <div class="legend">${e?.name ?? ""} · ${this.selectedItems.filter((a) => a.wine_id).length} ${i("occupied")} · ${this.selectedItems.filter((a) => !a.wine_id).length} ${i("free")}</div>
          ${s.length && r.length ? p`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${n.map((a) => {
      const h = a.row - this.firstRow + 1, u = a.column - this.firstColumn + 1, d = !!a.wine_id;
      return p`
                    <div class=${d ? "slot occupied" : "slot"}
                      style=${`grid-row: ${h}; grid-column: ${u};`}
                      title=${this.wineLabel(a) || i("empty_position")}>
                      <strong>${d ? this.wineLabel(a) : "—"}</strong>
                      <small>${i("row")} ${a.row} · ${i("column")} ${a.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((a) => p`
                  <div class="slot missing"
                    style=${`grid-row: ${a.row - this.firstRow + 1}; grid-column: ${a.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${i("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : p`<div class="warning">${i("no_coordinates")}</div>`}
          ${o.length ? p`
            <div class="unplaced">
              <strong>${i("positions_without_coordinates")}</strong>
              ${o.map((a) => p`<div class="unplaced-item">${this.wineLabel(a) || i("empty_position")}</div>`)}
            </div>
          ` : l}
        ` : p`<p class="muted">${i("no_racks")}</p>`}
        ${c.length ? p`
          <div class="warning">${c.length} ${i("missing_rack")}</div>
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
f.styles = ct`
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
A([
  Z({ attribute: !1 })
], f.prototype, "hass", 2);
A([
  g()
], f.prototype, "config", 2);
A([
  g()
], f.prototype, "inventory", 2);
A([
  g()
], f.prototype, "selectedRackId", 2);
A([
  g()
], f.prototype, "loading", 2);
A([
  g()
], f.prototype, "error", 2);
f = A([
  ut("ploc-cellar-rack-card")
], f);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: "Ploc Cellar Rack",
  description: "Visualize physical rack positions and assigned wines."
});
var Ve = Object.defineProperty, We = Object.getOwnPropertyDescriptor, x = (i, t, e, s) => {
  for (var r = s > 1 ? void 0 : s ? We(t, e) : t, n = i.length - 1, o; n >= 0; n--)
    (o = i[n]) && (r = (s ? o(t, e, r) : o(r)) || r);
  return s && r && Ve(t, e, r), r;
};
let _ = class extends C {
  constructor() {
    super(...arguments), this.loading = !1, this.requestGeneration = 0, this.search = "";
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
  setConfig(i) {
    this.requestGeneration += 1, this.loading = !1, this.config = i, this.inventory = void 0, this.error = void 0, this.config.config_entry_id && this.refresh();
  }
  updated() {
    this.hass && this.config && !this.inventory && !this.loading && !this.error && this.refresh();
  }
  async refresh() {
    const i = this.hass, t = this.config;
    if (!i || !t?.config_entry_id || this.loading) return;
    const e = t.config_entry_id, s = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const r = await i.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: e },
        return_response: !0
      });
      s === this.requestGeneration && (this.inventory = r.response);
    } catch (r) {
      s === this.requestGeneration && (this.error = r instanceof Error ? r.message : String(r));
    } finally {
      s === this.requestGeneration && (this.loading = !1);
    }
  }
  get filteredWines() {
    const i = this.search.trim().toLocaleLowerCase(), t = this.inventory?.wines ?? [];
    return i ? t.filter(
      (e) => [e.name, e.domain, e.appellation, e.region, e.country, e.grapes].filter(Boolean).join(" ").toLocaleLowerCase().includes(i)
    ) : t;
  }
  formatSync(i) {
    if (!i) return L(this.hass?.language ?? "en", "never");
    const t = new Date(i);
    return Number.isNaN(t.getTime()) ? i : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  render() {
    const i = (s) => L(this.hass?.language ?? "en", s), t = this.inventory, e = this.config?.title ?? i("card_title");
    return p`
      <ha-card>
        <header>
          <h2>${e}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? i("loading") : i("refresh")}
          </button>
        </header>
        ${this.error ? p`<div class="error">${this.error}</div>` : l}
        ${this.config?.config_entry_id ? l : p`<div class="muted">${i("select_config")}</div>`}
        ${t ? p`
          ${t.stale ? p`<div class="warning">${i("stale")}</div>` : l}
          <div class="summary">
            <div class="metric"><span class="value">${t.total_bottles}</span><span class="label">${i("bottles_in_cellar")}</span></div>
            <div class="metric"><span class="value">${t.total_stock_bottles ?? "—"}</span><span class="label">${i("reconstructed_stock")}</span></div>
            <div class="metric"><span class="value">${t.rack_count}</span><span class="label">${i("racks")}</span></div>
            <div class="metric"><span class="value">${t.empty_positions}</span><span class="label">${i("empty_positions")}</span></div>
          </div>
          ${t.stock_reconstruction_complete ? l : p`<div class="warning">${i("reconstruction_incomplete")}</div>`}
          <div class="muted">${i("last_sync")} : ${this.formatSync(t.last_sync)}</div>
          <input aria-label=${i("search_wine")} .value=${this.search} @input=${(s) => {
      this.search = s.target.value;
    }} placeholder=${i("search_placeholder")} />
          ${this.filteredWines.map((s) => p`
            <div class="wine">
              <div>
                <div class="wine-name">${s.name}</div>
                <div class="details">${[s.domain, s.vintage, s.appellation, s.region].filter(Boolean).join(" · ")}</div>
              </div>
              <div class="count">${s.bottles ?? s.bottles_in_cellar}</div>
            </div>
          `)}
          ${this.filteredWines.length === 0 ? p`<div class="muted">${i("no_matching_wines")}</div>` : l}
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
_.styles = ct`
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
    input { box-sizing: border-box; width: 100%; padding: 10px 12px; margin: 4px 0 12px; color: var(--primary-text-color); background: var(--card-background-color); border: 1px solid var(--divider-color); border-radius: 8px; }
    .wine { display: flex; justify-content: space-between; gap: 12px; padding: 12px 0; border-top: 1px solid var(--divider-color); }
    .wine-name { font-weight: 500; }
    .details { color: var(--secondary-text-color); font-size: .85rem; margin-top: 3px; }
    .count { white-space: nowrap; font-weight: 600; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) { ha-card { padding: 12px; } }
  `;
x([
  Z({ attribute: !1 })
], _.prototype, "hass", 2);
x([
  g()
], _.prototype, "config", 2);
x([
  g()
], _.prototype, "inventory", 2);
x([
  g()
], _.prototype, "loading", 2);
x([
  g()
], _.prototype, "error", 2);
x([
  g()
], _.prototype, "search", 2);
_ = x([
  ut("ploc-cellar-card")
], _);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: "Ploc Cellar",
  description: "Inventory overview for the Ploc Cellar integration."
});
export {
  _ as PlocCellarCard
};
