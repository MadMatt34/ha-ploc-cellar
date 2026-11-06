const j = globalThis, Y = j.ShadowRoot && (j.ShadyCSS === void 0 || j.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, J = /* @__PURE__ */ Symbol(), it = /* @__PURE__ */ new WeakMap();
let mt = class {
  constructor(t, s, i) {
    if (this._$cssResult$ = !0, i !== J) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = s;
  }
  get styleSheet() {
    let t = this.o;
    const s = this.t;
    if (Y && t === void 0) {
      const i = s !== void 0 && s.length === 1;
      i && (t = it.get(s)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && it.set(s, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (e) => new mt(typeof e == "string" ? e : e + "", void 0, J), K = (e, ...t) => {
  const s = e.length === 1 ? e[0] : t.reduce((i, o, r) => i + ((n) => {
    if (n._$cssResult$ === !0) return n.cssText;
    if (typeof n == "number") return n;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + n + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + e[r + 1], e[0]);
  return new mt(s, e, J);
}, wt = (e, t) => {
  if (Y) e.adoptedStyleSheets = t.map((s) => s instanceof CSSStyleSheet ? s : s.styleSheet);
  else for (const s of t) {
    const i = document.createElement("style"), o = j.litNonce;
    o !== void 0 && i.setAttribute("nonce", o), i.textContent = s.cssText, e.appendChild(i);
  }
}, ot = Y ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let s = "";
  for (const i of t.cssRules) s += i.cssText;
  return bt(s);
})(e) : e;
const { is: xt, defineProperty: kt, getOwnPropertyDescriptor: At, getOwnPropertyNames: Ct, getOwnPropertySymbols: St, getPrototypeOf: Et } = Object, F = globalThis, nt = F.trustedTypes, Pt = nt ? nt.emptyScript : "", Nt = F.reactiveElementPolyfillSupport, D = (e, t) => e, B = { toAttribute(e, t) {
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
} }, Z = (e, t) => !xt(e, t), rt = { attribute: !0, type: String, converter: B, reflect: !1, useDefault: !1, hasChanged: Z };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), F.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let P = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, s = rt) {
    if (s.state && (s.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((s = Object.create(s)).wrapped = !0), this.elementProperties.set(t, s), !s.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), o = this.getPropertyDescriptor(t, i, s);
      o !== void 0 && kt(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, s, i) {
    const { get: o, set: r } = At(this.prototype, t) ?? { get() {
      return this[s];
    }, set(n) {
      this[s] = n;
    } };
    return { get: o, set(n) {
      const d = o?.call(this);
      r?.call(this, n), this.requestUpdate(t, d, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? rt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(D("elementProperties"))) return;
    const t = Et(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(D("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(D("properties"))) {
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
      for (const o of i) s.unshift(ot(o));
    } else t !== void 0 && s.push(ot(t));
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
      const r = (i.converter?.toAttribute !== void 0 ? i.converter : B).toAttribute(s, i.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, s) {
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = i.getPropertyOptions(o), n = typeof r.converter == "function" ? { fromAttribute: r.converter } : r.converter?.fromAttribute !== void 0 ? r.converter : B;
      this._$Em = o;
      const d = n.fromAttribute(s, r.type);
      this[o] = d ?? this._$Ej?.get(o) ?? d, this._$Em = null;
    }
  }
  requestUpdate(t, s, i, o = !1, r) {
    if (t !== void 0) {
      const n = this.constructor;
      if (o === !1 && (r = this[t]), i ??= n.getPropertyOptions(t), !((i.hasChanged ?? Z)(r, s) || i.useDefault && i.reflect && r === this._$Ej?.get(t) && !this.hasAttribute(n._$Eu(t, i)))) return;
      this.C(t, s, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, s, { useDefault: i, reflect: o, wrapped: r }, n) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, n ?? s ?? this[t]), r !== !0 || n !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (s = void 0), this._$AL.set(t, s)), o === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        for (const [o, r] of this._$Ep) this[o] = r;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [o, r] of i) {
        const { wrapped: n } = r, d = this[o];
        n !== !0 || this._$AL.has(o) || d === void 0 || this.C(o, void 0, r, d);
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
P.elementStyles = [], P.shadowRootOptions = { mode: "open" }, P[D("elementProperties")] = /* @__PURE__ */ new Map(), P[D("finalized")] = /* @__PURE__ */ new Map(), Nt?.({ ReactiveElement: P }), (F.reactiveElementVersions ??= []).push("2.1.2");
const Q = globalThis, at = (e) => e, V = Q.trustedTypes, ct = V ? V.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, ft = "$lit$", x = `lit$${Math.random().toFixed(9).slice(2)}$`, vt = "?" + x, Ot = `<${vt}>`, S = document, T = () => S.createComment(""), I = (e) => e === null || typeof e != "object" && typeof e != "function", tt = Array.isArray, Rt = (e) => tt(e) || typeof e?.[Symbol.iterator] == "function", X = `[ 	
\f\r]`, M = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, lt = /-->/g, dt = />/g, A = RegExp(`>|${X}(?:([^\\s"'>=/]+)(${X}*=${X}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ht = /'/g, pt = /"/g, $t = /^(?:script|style|textarea|title)$/i, Mt = (e) => (t, ...s) => ({ _$litType$: e, strings: t, values: s }), l = Mt(1), N = /* @__PURE__ */ Symbol.for("lit-noChange"), h = /* @__PURE__ */ Symbol.for("lit-nothing"), ut = /* @__PURE__ */ new WeakMap(), C = S.createTreeWalker(S, 129);
function yt(e, t) {
  if (!tt(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return ct !== void 0 ? ct.createHTML(t) : t;
}
const Dt = (e, t) => {
  const s = e.length - 1, i = [];
  let o, r = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", n = M;
  for (let d = 0; d < s; d++) {
    const a = e[d];
    let c, u, p = -1, _ = 0;
    for (; _ < a.length && (n.lastIndex = _, u = n.exec(a), u !== null); ) _ = n.lastIndex, n === M ? u[1] === "!--" ? n = lt : u[1] !== void 0 ? n = dt : u[2] !== void 0 ? ($t.test(u[2]) && (o = RegExp("</" + u[2], "g")), n = A) : u[3] !== void 0 && (n = A) : n === A ? u[0] === ">" ? (n = o ?? M, p = -1) : u[1] === void 0 ? p = -2 : (p = n.lastIndex - u[2].length, c = u[1], n = u[3] === void 0 ? A : u[3] === '"' ? pt : ht) : n === pt || n === ht ? n = A : n === lt || n === dt ? n = M : (n = A, o = void 0);
    const f = n === A && e[d + 1].startsWith("/>") ? " " : "";
    r += n === M ? a + Ot : p >= 0 ? (i.push(c), a.slice(0, p) + ft + a.slice(p) + x + f) : a + x + (p === -2 ? d : f);
  }
  return [yt(e, r + (e[s] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class U {
  constructor({ strings: t, _$litType$: s }, i) {
    let o;
    this.parts = [];
    let r = 0, n = 0;
    const d = t.length - 1, a = this.parts, [c, u] = Dt(t, s);
    if (this.el = U.createElement(c, i), C.currentNode = this.el.content, s === 2 || s === 3) {
      const p = this.el.content.firstChild;
      p.replaceWith(...p.childNodes);
    }
    for (; (o = C.nextNode()) !== null && a.length < d; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes()) for (const p of o.getAttributeNames()) if (p.endsWith(ft)) {
          const _ = u[n++], f = o.getAttribute(p).split(x), H = /([.?@])?(.*)/.exec(_);
          a.push({ type: 1, index: r, name: H[2], strings: f, ctor: H[1] === "." ? It : H[1] === "?" ? Ut : H[1] === "@" ? zt : G }), o.removeAttribute(p);
        } else p.startsWith(x) && (a.push({ type: 6, index: r }), o.removeAttribute(p));
        if ($t.test(o.tagName)) {
          const p = o.textContent.split(x), _ = p.length - 1;
          if (_ > 0) {
            o.textContent = V ? V.emptyScript : "";
            for (let f = 0; f < _; f++) o.append(p[f], T()), C.nextNode(), a.push({ type: 2, index: ++r });
            o.append(p[_], T());
          }
        }
      } else if (o.nodeType === 8) if (o.data === vt) a.push({ type: 2, index: r });
      else {
        let p = -1;
        for (; (p = o.data.indexOf(x, p + 1)) !== -1; ) a.push({ type: 7, index: r }), p += x.length - 1;
      }
      r++;
    }
  }
  static createElement(t, s) {
    const i = S.createElement("template");
    return i.innerHTML = t, i;
  }
}
function O(e, t, s = e, i) {
  if (t === N) return t;
  let o = i !== void 0 ? s._$Co?.[i] : s._$Cl;
  const r = I(t) ? void 0 : t._$litDirective$;
  return o?.constructor !== r && (o?._$AO?.(!1), r === void 0 ? o = void 0 : (o = new r(e), o._$AT(e, s, i)), i !== void 0 ? (s._$Co ??= [])[i] = o : s._$Cl = o), o !== void 0 && (t = O(e, o._$AS(e, t.values), o, i)), t;
}
class Tt {
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
    const { el: { content: s }, parts: i } = this._$AD, o = (t?.creationScope ?? S).importNode(s, !0);
    C.currentNode = o;
    let r = C.nextNode(), n = 0, d = 0, a = i[0];
    for (; a !== void 0; ) {
      if (n === a.index) {
        let c;
        a.type === 2 ? c = new z(r, r.nextSibling, this, t) : a.type === 1 ? c = new a.ctor(r, a.name, a.strings, this, t) : a.type === 6 && (c = new qt(r, this, t)), this._$AV.push(c), a = i[++d];
      }
      n !== a?.index && (r = C.nextNode(), n++);
    }
    return C.currentNode = S, o;
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
  constructor(t, s, i, o) {
    this.type = 2, this._$AH = h, this._$AN = void 0, this._$AA = t, this._$AB = s, this._$AM = i, this.options = o, this._$Cv = o?.isConnected ?? !0;
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
    t = O(this, t, s), I(t) ? t === h || t == null || t === "" ? (this._$AH !== h && this._$AR(), this._$AH = h) : t !== this._$AH && t !== N && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== h && I(this._$AH) ? this._$AA.nextSibling.data = t : this.T(S.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: s, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = U.createElement(yt(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === o) this._$AH.p(s);
    else {
      const r = new Tt(o, this), n = r.u(this.options);
      r.p(s), this.T(n), this._$AH = r;
    }
  }
  _$AC(t) {
    let s = ut.get(t.strings);
    return s === void 0 && ut.set(t.strings, s = new U(t)), s;
  }
  k(t) {
    tt(this._$AH) || (this._$AH = [], this._$AR());
    const s = this._$AH;
    let i, o = 0;
    for (const r of t) o === s.length ? s.push(i = new z(this.O(T()), this.O(T()), this, this.options)) : i = s[o], i._$AI(r), o++;
    o < s.length && (this._$AR(i && i._$AB.nextSibling, o), s.length = o);
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
class G {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, s, i, o, r) {
    this.type = 1, this._$AH = h, this._$AN = void 0, this.element = t, this.name = s, this._$AM = o, this.options = r, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = h;
  }
  _$AI(t, s = this, i, o) {
    const r = this.strings;
    let n = !1;
    if (r === void 0) t = O(this, t, s, 0), n = !I(t) || t !== this._$AH && t !== N, n && (this._$AH = t);
    else {
      const d = t;
      let a, c;
      for (t = r[0], a = 0; a < r.length - 1; a++) c = O(this, d[i + a], s, a), c === N && (c = this._$AH[a]), n ||= !I(c) || c !== this._$AH[a], c === h ? t = h : t !== h && (t += (c ?? "") + r[a + 1]), this._$AH[a] = c;
    }
    n && !o && this.j(t);
  }
  j(t) {
    t === h ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class It extends G {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === h ? void 0 : t;
  }
}
class Ut extends G {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== h);
  }
}
class zt extends G {
  constructor(t, s, i, o, r) {
    super(t, s, i, o, r), this.type = 5;
  }
  _$AI(t, s = this) {
    if ((t = O(this, t, s, 0) ?? h) === N) return;
    const i = this._$AH, o = t === h && i !== h || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, r = t !== h && (i === h || o);
    o && this.element.removeEventListener(this.name, this, i), r && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class qt {
  constructor(t, s, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = s, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    O(this, t);
  }
}
const Lt = Q.litHtmlPolyfillSupport;
Lt?.(U, z), (Q.litHtmlVersions ??= []).push("3.3.3");
const Ht = (e, t, s) => {
  const i = s?.renderBefore ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const r = s?.renderBefore ?? null;
    i._$litPart$ = o = new z(t.insertBefore(T(), r), r, void 0, s ?? {});
  }
  return o._$AI(e), o;
};
const et = globalThis;
class k extends P {
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
    return N;
  }
}
k._$litElement$ = !0, k.finalized = !0, et.litElementHydrateSupport?.({ LitElement: k });
const jt = et.litElementPolyfillSupport;
jt?.({ LitElement: k });
(et.litElementVersions ??= []).push("4.2.2");
const q = (e) => (t, s) => {
  s !== void 0 ? s.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Bt = { attribute: !0, type: String, converter: B, reflect: !1, hasChanged: Z }, Vt = (e = Bt, t, s) => {
  const { kind: i, metadata: o } = s;
  let r = globalThis.litPropertyMetadata.get(o);
  if (r === void 0 && globalThis.litPropertyMetadata.set(o, r = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), r.set(s.name, e), i === "accessor") {
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
function L(e) {
  return (t, s) => typeof s == "object" ? Vt(e, t, s) : ((i, o, r) => {
    const n = o.hasOwnProperty(r);
    return o.constructor.createProperty(r, i), n ? Object.getOwnPropertyDescriptor(o, r) : void 0;
  })(e, t, s);
}
function g(e) {
  return L({ ...e, state: !0, attribute: !1 });
}
const Wt = "Ploc Cellar", Ft = "Cellar storage", Gt = "Refresh", Xt = "Loading…", Yt = "Never", Jt = "Bottles in cellar", Kt = "Reconstructed stock", Zt = "Racks", Qt = "Empty positions", te = "Data may be stale: the latest synchronization failed.", ee = "Stock reconstruction is incomplete: only physical quantities are available.", se = "Last successful synchronization", ie = "Search wines", oe = "Search wines…", ne = "No matching wines.", re = "Select a Ploc Cellar configuration in the card editor.", ae = "Rack selection", ce = "occupied", le = "free", de = "Unknown wine", he = "Empty position", pe = "Row", ue = "Column", ge = "No row/column coordinates are available for this rack.", _e = "Positions without coordinates", me = "Not mapped", fe = "No racks available.", ve = "position(s) reference a missing rack.", $e = "Wine inventory", ye = "All colors", be = "All regions", we = "All appellations", xe = "All vintages", ke = "Sort by", Ae = "Name", Ce = "Quantity descending", Se = "Vintage descending", Ee = "{count} wine(s)", Pe = "{count} bottle(s)", Ne = "Clear filters", Oe = "btl.", Re = "Unknown vintage", Me = "Wine details", De = "Grapes", Te = "Cuvée", Ie = "Volume", Ue = "Locations", ze = "Ploc Cellar", qe = "Cellar overview and stock indicators.", Le = "Wine inventory", He = "Search, filter and browse the wine inventory.", je = "Cellar racks", Be = "Visualize rack positions and the wines stored in them.", Ve = "Ploc Cellar configuration", We = "Select the PLOUD connection used by this card.", Fe = "Card title", Ge = "Optional. Leave empty to use the default title.", Xe = "Cellar statistics", Ye = "Bottles in stock", Je = "wine references", Ke = "By color", Ze = "By region", Qe = "By appellation", ts = "By vintage", es = "By bottle format", ss = "Other", is = "Not specified", os = "No data available for this category.", ns = "Unknown", rs = "Wine references in stock", as = "Rack occupancy", cs = "Stock diagnostics", ls = "Unlocated bottles", ds = "Negative movement balance", hs = "Physical surplus", ps = "Breakdowns include known wine references only.", us = "{count} occupied position(s) have an unknown wine reference. They are included in total stock but not in the breakdowns.", gs = "Show rack occupancy", _s = "Show diagnostics", ms = "Show statistics", fs = "Show chart legends", vs = "View details", $s = "Wine references with stock that is not assigned to a physical rack position.", ys = "Wine references where recorded outgoing movements exceed incoming movements.", bs = "Wine references with more bottles physically stored than the reconstructed movement stock.", ws = "Bottles concerned", xs = "In cellar", ks = "Reconstructed stock", As = "Incoming", Cs = "Outgoing", Ss = "Movement balance", Es = "No wine-level details are available for this diagnostic.", Ps = {
  card_title: Wt,
  rack_title: Ft,
  refresh: Gt,
  loading: Xt,
  never: Yt,
  bottles_in_cellar: Jt,
  reconstructed_stock: Kt,
  racks: Zt,
  empty_positions: Qt,
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
  clear_filters: Ne,
  bottles_short: Oe,
  unknown_vintage: Re,
  wine_details: Me,
  grapes: De,
  cuvee: Te,
  bottle_volume: Ie,
  locations: Ue,
  picker_overview_name: ze,
  picker_overview_description: qe,
  picker_inventory_name: Le,
  picker_inventory_description: He,
  picker_rack_name: je,
  picker_rack_description: Be,
  editor_configuration: Ve,
  editor_configuration_helper: We,
  editor_title: Fe,
  editor_title_helper: Ge,
  statistics_title: Xe,
  statistics_bottles: Ye,
  statistics_references: Je,
  statistics_color: Ke,
  statistics_region: Ze,
  statistics_appellation: Qe,
  statistics_vintage: ts,
  statistics_format: es,
  statistics_other: ss,
  statistics_unknown: is,
  statistics_empty: os,
  unknown_value: ns,
  stocked_references: rs,
  rack_occupancy: as,
  inventory_diagnostics: cs,
  diagnostic_unlocated: ls,
  diagnostic_negative: ds,
  diagnostic_surplus: hs,
  statistics_distribution_scope: ps,
  statistics_unknown_wine_positions: us,
  editor_show_occupancy: gs,
  editor_show_diagnostics: _s,
  editor_show_statistics: ms,
  editor_show_statistics_legends: fs,
  diagnostic_detail_open: vs,
  diagnostic_detail_unlocated: $s,
  diagnostic_detail_negative: ys,
  diagnostic_detail_surplus: bs,
  diagnostic_detail_quantity: ws,
  diagnostic_detail_in_cellar: xs,
  diagnostic_detail_stock: ks,
  diagnostic_detail_purchased: As,
  diagnostic_detail_consumed: Cs,
  diagnostic_detail_balance: Ss,
  diagnostic_detail_empty: Es
}, Ns = "Cave Ploc", Os = "Rangement de la cave", Rs = "Actualiser", Ms = "Chargement…", Ds = "Jamais", Ts = "Bouteilles en cave", Is = "Stock reconstitué", Us = "Casiers", zs = "Places libres", qs = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", Ls = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", Hs = "Dernière synchronisation réussie", js = "Rechercher un vin", Bs = "Rechercher un vin…", Vs = "Aucun vin correspondant.", Ws = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", Fs = "Sélection du casier", Gs = "occupées", Xs = "libres", Ys = "Vin inconnu", Js = "Emplacement libre", Ks = "Rangée", Zs = "Colonne", Qs = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", ti = "Emplacements sans coordonnées", ei = "Non renseigné", si = "Aucun casier disponible.", ii = "emplacement(s) référencent un casier absent.", oi = "Inventaire des vins", ni = "Toutes les couleurs", ri = "Toutes les régions", ai = "Toutes les appellations", ci = "Tous les millésimes", li = "Trier par", di = "Nom", hi = "Quantité décroissante", pi = "Millésime décroissant", ui = "{count} référence(s)", gi = "{count} bouteille(s)", _i = "Effacer les filtres", mi = "bt.", fi = "Millésime inconnu", vi = "Détails du vin", $i = "Cépages", yi = "Cuvée", bi = "Volume", wi = "Emplacements", xi = "Cave Ploc", ki = "Vue d’ensemble de la cave et indicateurs de stock.", Ai = "Inventaire des vins", Ci = "Rechercher, filtrer et parcourir l’inventaire des vins.", Si = "Casiers de la cave", Ei = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", Pi = "Configuration Ploc Cellar", Ni = "Sélectionnez la connexion PLOUD utilisée par cette carte.", Oi = "Titre de la carte", Ri = "Facultatif. Laissez vide pour utiliser le titre par défaut.", Mi = "Statistiques de la cave", Di = "Bouteilles en stock", Ti = "références de vin", Ii = "Par couleur", Ui = "Par région", zi = "Par appellation", qi = "Par millésime", Li = "Par format de bouteille", Hi = "Autres", ji = "Non renseigné", Bi = "Aucune donnée disponible pour cette catégorie.", Vi = "Inconnu", Wi = "Références de vins en stock", Fi = "Occupation des casiers", Gi = "Diagnostics du stock", Xi = "Bouteilles non localisées", Yi = "Solde de mouvements négatif", Ji = "Excédent physique", Ki = "Les répartitions ne portent que sur les références de vins connues.", Zi = "{count} emplacement(s) occupé(s) font référence à un vin inconnu. Ils sont inclus dans le stock total, mais pas dans les répartitions.", Qi = "Afficher l’occupation des casiers", to = "Afficher les diagnostics", eo = "Afficher les statistiques", so = "Afficher les légendes des graphiques", io = "Voir le détail", oo = "Références de vins dont une partie du stock n’est affectée à aucun emplacement physique de casier.", no = "Références de vins pour lesquelles les sorties enregistrées dépassent les entrées.", ro = "Références de vins ayant davantage de bouteilles physiquement rangées que le stock reconstitué à partir des mouvements.", ao = "Bouteilles concernées", co = "En cave", lo = "Stock reconstitué", ho = "Entrées", po = "Sorties", uo = "Solde des mouvements", go = "Aucun détail par référence de vin n’est disponible pour ce diagnostic.", _o = {
  card_title: Ns,
  rack_title: Os,
  refresh: Rs,
  loading: Ms,
  never: Ds,
  bottles_in_cellar: Ts,
  reconstructed_stock: Is,
  racks: Us,
  empty_positions: zs,
  stale: qs,
  reconstruction_incomplete: Ls,
  last_sync: Hs,
  search_wine: js,
  search_placeholder: Bs,
  no_matching_wines: Vs,
  select_config: Ws,
  rack_selection: Fs,
  occupied: Gs,
  free: Xs,
  unknown_wine: Ys,
  empty_position: Js,
  row: Ks,
  column: Zs,
  no_coordinates: Qs,
  positions_without_coordinates: ti,
  not_mapped: ei,
  no_racks: si,
  missing_rack: ii,
  inventory_title: oi,
  filter_color: ni,
  filter_region: ri,
  filter_appellation: ai,
  filter_vintage: ci,
  sort_by: li,
  sort_name: di,
  sort_bottles: hi,
  sort_vintage: pi,
  inventory_results: ui,
  inventory_bottle_total: gi,
  clear_filters: _i,
  bottles_short: mi,
  unknown_vintage: fi,
  wine_details: vi,
  grapes: $i,
  cuvee: yi,
  bottle_volume: bi,
  locations: wi,
  picker_overview_name: xi,
  picker_overview_description: ki,
  picker_inventory_name: Ai,
  picker_inventory_description: Ci,
  picker_rack_name: Si,
  picker_rack_description: Ei,
  editor_configuration: Pi,
  editor_configuration_helper: Ni,
  editor_title: Oi,
  editor_title_helper: Ri,
  statistics_title: Mi,
  statistics_bottles: Di,
  statistics_references: Ti,
  statistics_color: Ii,
  statistics_region: Ui,
  statistics_appellation: zi,
  statistics_vintage: qi,
  statistics_format: Li,
  statistics_other: Hi,
  statistics_unknown: ji,
  statistics_empty: Bi,
  unknown_value: Vi,
  stocked_references: Wi,
  rack_occupancy: Fi,
  inventory_diagnostics: Gi,
  diagnostic_unlocated: Xi,
  diagnostic_negative: Yi,
  diagnostic_surplus: Ji,
  statistics_distribution_scope: Ki,
  statistics_unknown_wine_positions: Zi,
  editor_show_occupancy: Qi,
  editor_show_diagnostics: to,
  editor_show_statistics: eo,
  editor_show_statistics_legends: so,
  diagnostic_detail_open: io,
  diagnostic_detail_unlocated: oo,
  diagnostic_detail_negative: no,
  diagnostic_detail_surplus: ro,
  diagnostic_detail_quantity: ao,
  diagnostic_detail_in_cellar: co,
  diagnostic_detail_stock: lo,
  diagnostic_detail_purchased: ho,
  diagnostic_detail_consumed: po,
  diagnostic_detail_balance: uo,
  diagnostic_detail_empty: go
};
function v(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? _o : Ps)[t];
}
function R(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return v(t, e);
}
var mo = Object.defineProperty, fo = Object.getOwnPropertyDescriptor, E = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? fo(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (i ? n(t, s, o) : n(o)) || o);
  return i && o && mo(t, s, o), o;
};
let b = class extends k {
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
      i === this.requestGeneration && (this.inventory = o.response, (!this.selectedRackId || !this.inventory.racks.some((r) => r.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
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
    return t ? t.name : v(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const e = (a) => v(this.hass?.language ?? "en", a), t = this.inventory, s = t?.racks.find((a) => a.id === this.selectedRackId), i = this.rowValues, o = this.columnValues, r = this.positionedItems, n = this.selectedItems.filter((a) => a.row === null || a.column === null), d = (t?.rack_items ?? []).filter(
      (a) => !t?.racks.some((c) => c.id === a.rack_id)
    );
    return l`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? l`<div class="error">${this.error}</div>` : h}
        ${this.config?.config_entry_id ? h : l`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? l`<div class="warning">${e("stale")}</div>` : h}
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
          ${i.length && o.length ? l`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${r.map((a) => {
      const c = a.row - this.firstRow + 1, u = a.column - this.firstColumn + 1, p = !!a.wine_id;
      return l`
                    <div class=${p ? "slot occupied" : "slot"}
                      style=${`grid-row: ${c}; grid-column: ${u};`}
                      title=${this.wineLabel(a) || e("empty_position")}>
                      <strong>${p ? this.wineLabel(a) : "—"}</strong>
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
          ` : h}
        ` : l`<p class="muted">${e("no_racks")}</p>`}
        ${d.length ? l`
          <div class="warning">${d.length} ${e("missing_rack")}</div>
        ` : h}
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
      rows: "auto"
    };
  }
};
b.styles = K`
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
E([
  L({ attribute: !1 })
], b.prototype, "hass", 2);
E([
  g()
], b.prototype, "config", 2);
E([
  g()
], b.prototype, "inventory", 2);
E([
  g()
], b.prototype, "selectedRackId", 2);
E([
  g()
], b.prototype, "loading", 2);
E([
  g()
], b.prototype, "error", 2);
b = E([
  q("ploc-cellar-rack-card")
], b);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: R("picker_rack_name"),
  description: R("picker_rack_description")
});
var vo = Object.defineProperty, $o = Object.getOwnPropertyDescriptor, $ = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? $o(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (i ? n(t, s, o) : n(o)) || o);
  return i && o && vo(t, s, o), o;
};
let m = class extends k {
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
    return l`
      <select aria-label=${t} .value=${s}
        @change=${(o) => {
      const r = o.target.value;
      e === "color" ? this.color = r : e === "region" ? this.region = r : e === "appellation" ? this.appellation = r : this.vintage = r;
    }}>
        <option value="" ?selected=${!s}>${t}</option>
        ${i.map((o) => l`<option value=${o} ?selected=${o === s}>${o}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? h : l`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (r) => v(this.hass?.language ?? "en", r), s = e.locations.map((r) => {
      const n = r.row !== null && r.column !== null ? ` · ${t("row")} ${r.row}, ${t("column")} ${r.column}` : "";
      return `${r.rack}${n}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), o = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
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
          ${e.color ? l`<span class="tag">${e.color}</span>` : h}
          <span class="tag">${i}</span>
          ${e.bottle_format ? l`<span class="tag">${e.bottle_format}</span>` : h}
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
    const e = (o) => v(this.hass?.language ?? "en", o), t = this.filteredWines, s = t.reduce((o, r) => o + r.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
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
        ${this.error ? l`<div class="error">${this.error}</div>` : h}
        ${this.config?.config_entry_id ? h : l`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? l`<div class="warning">${e("stale")}</div>` : h}
        ${this.inventory ? l`
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
            ${i ? l`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : h}
          </div>
          ${this.inventory.stock_reconstruction_complete ? h : l`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((o) => this.renderWine(o))}
          </div>
          ${t.length === 0 ? l`<p class="muted">${e("no_matching_wines")}</p>` : h}
        ` : h}
      </ha-card>
    `;
  }
  getCardSize() {
    return 6;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }
};
m.styles = K`
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
$([
  L({ attribute: !1 })
], m.prototype, "hass", 2);
$([
  g()
], m.prototype, "config", 2);
$([
  g()
], m.prototype, "inventory", 2);
$([
  g()
], m.prototype, "loading", 2);
$([
  g()
], m.prototype, "error", 2);
$([
  g()
], m.prototype, "search", 2);
$([
  g()
], m.prototype, "color", 2);
$([
  g()
], m.prototype, "region", 2);
$([
  g()
], m.prototype, "appellation", 2);
$([
  g()
], m.prototype, "vintage", 2);
$([
  g()
], m.prototype, "sort", 2);
m = $([
  q("ploc-cellar-inventory-card")
], m);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: R("picker_inventory_name"),
  description: R("picker_inventory_description")
});
var yo = Object.defineProperty, bo = Object.getOwnPropertyDescriptor, st = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? bo(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (i ? n(t, s, o) : n(o)) || o);
  return i && o && yo(t, s, o), o;
};
let W = class extends k {
  constructor() {
    super(...arguments), this.computeLabel = (e) => {
      const s = {
        config_entry_id: "editor_configuration",
        title: "editor_title",
        show_occupancy: "editor_show_occupancy",
        show_diagnostics: "editor_show_diagnostics",
        show_statistics: "editor_show_statistics",
        show_statistics_legends: "editor_show_statistics_legends"
      }[e.name];
      return v(this.hass?.language ?? "en", s);
    }, this.computeHelper = (e) => {
      if (e.name === "config_entry_id")
        return v(this.hass?.language ?? "en", "editor_configuration_helper");
      if (e.name === "title")
        return v(this.hass?.language ?? "en", "editor_title_helper");
    };
  }
  get schema() {
    return [
      {
        name: "config_entry_id",
        required: !0,
        selector: { config_entry: { integration: "ploc_cellar" } }
      },
      { name: "title", selector: { text: {} } },
      { name: "show_occupancy", selector: { boolean: {} } },
      { name: "show_diagnostics", selector: { boolean: {} } },
      { name: "show_statistics", selector: { boolean: {} } },
      ...this.config?.show_statistics !== !1 ? [{ name: "show_statistics_legends", selector: { boolean: {} } }] : []
    ];
  }
  setConfig(e) {
    this.config = {
      ...e,
      show_occupancy: e.show_occupancy !== !1,
      show_diagnostics: e.show_diagnostics !== !1,
      show_statistics: e.show_statistics !== !1,
      show_statistics_legends: e.show_statistics_legends !== !1
    };
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
    return l`
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
  L({ attribute: !1 })
], W.prototype, "hass", 2);
st([
  g()
], W.prototype, "config", 2);
W = st([
  q("ploc-cellar-card-editor")
], W);
var wo = Object.defineProperty, xo = Object.getOwnPropertyDescriptor, w = (e, t, s, i) => {
  for (var o = i > 1 ? void 0 : i ? xo(t, s) : t, r = e.length - 1, n; r >= 0; r--)
    (n = e[r]) && (o = (i ? n(t, s, o) : n(o)) || o);
  return i && o && wo(t, s, o), o;
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
let y = class extends k {
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
    this.requestGeneration += 1, this.loading = !1, this.config = {
      ...e,
      show_occupancy: e.show_occupancy !== !1,
      show_diagnostics: e.show_diagnostics !== !1,
      show_statistics: e.show_statistics !== !1,
      show_statistics_legends: e.show_statistics_legends !== !1
    }, this.inventory = void 0, this.error = void 0, e.config_entry_id && this.refresh();
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
  handleDonutPointerMove(e, t) {
    const s = e.currentTarget;
    if (!(s instanceof HTMLElement)) return;
    const i = s.getBoundingClientRect(), o = i.left + i.width / 2, r = i.top + i.height / 2, n = e.clientX - o, d = e.clientY - r, a = Math.hypot(n, d), c = Math.min(i.width, i.height) / 2;
    if (a < c * 0.32 || a > c * 0.52) {
      this.donutTooltip = void 0;
      return;
    }
    const p = (Math.atan2(n, -d) * 180 / Math.PI + 360) % 360 / 360 * 100, _ = t.find(
      (f) => p >= f.start && p < f.end
    );
    if (!_) {
      this.donutTooltip = void 0;
      return;
    }
    this.donutTooltip?.text !== _.tooltip && (this.donutTooltip = {
      text: _.tooltip,
      left: Math.max(8, Math.min(e.clientX + 14, window.innerWidth - 260)),
      top: Math.max(8, Math.min(e.clientY + 14, window.innerHeight - 90))
    });
  }
  hideDonutTooltip() {
    this.donutTooltip = void 0;
  }
  formatSync(e) {
    if (!e) return v(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  metric(e, t) {
    return l`
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
    const t = (n) => v(this.hass?.language ?? "en", n), s = /* @__PURE__ */ new Map();
    for (const n of this.inventory?.wines ?? []) {
      const d = n[e], a = d === null || d === "" ? t("statistics_unknown") : String(d), c = s.get(a) ?? { name: a, bottles: 0, wines: 0 };
      if (c.bottles += this.getBottleCount(n), c.wines += 1, e === "color" && n.color_rgb && !c.color) {
        const u = n.color_rgb.map(
          (p) => Math.min(255, Math.max(0, Math.round(p)))
        );
        c.color = `rgb(${u.join(", ")})`;
      }
      s.set(a, c);
    }
    const i = [...s.values()].sort(
      (n, d) => d.bottles - n.bottles || n.name.localeCompare(d.name, this.hass?.language)
    );
    if (i.length <= 8) return i;
    const o = i.slice(0, 7), r = i.slice(7).reduce(
      (n, d) => ({
        name: t("statistics_other"),
        bottles: n.bottles + d.bottles,
        wines: n.wines + d.wines
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 }
    );
    return [...o, r];
  }
  renderDistribution(e, t) {
    const s = (c) => v(this.hass?.language ?? "en", c), i = this.distribution(e), o = i.reduce((c, u) => c + u.bottles, 0);
    let r = 0;
    const n = i.filter((c) => c.bottles > 0).map((c, u) => {
      const p = r;
      r += c.bottles / o * 100;
      const _ = `${c.name}: ${this.formatNumber(c.bottles)} ${s("statistics_bottles")} (${new Intl.NumberFormat(this.hass?.language ?? void 0, { style: "percent", maximumFractionDigits: 1 }).format(c.bottles / o)}), ${this.formatNumber(c.wines)} ${s("statistics_references")}`;
      return {
        ...c,
        start: p,
        end: r,
        color: c.color ?? gt[u % gt.length],
        tooltip: _
      };
    }), d = n.map((c) => `${c.color} ${c.start}% ${c.end}%`).join(", "), a = i.map((c) => `${c.name}: ${this.formatNumber(c.bottles)}`).join(", ");
    return l`
      <section class="group">
        <h3 class="group-title">${s(t)}</h3>
        ${o > 0 ? l`
          <div class=${this.config?.show_statistics_legends === !1 ? "chart-content chart-content-no-legend" : "chart-content"}>
            <div class="donut" role="img"
              aria-label=${s(t) + ": " + a}
              @pointermove=${(c) => this.handleDonutPointerMove(c, n)}
              @pointerleave=${this.hideDonutTooltip}
              style=${`background: conic-gradient(${d})`}>
              <svg class="donut-chart" viewBox="0 0 100 100" aria-hidden="true">
                ${n.map((c) => {
      const u = 2 * Math.PI * 42, p = (c.end - c.start) / 100 * u, _ = `${p} ${u - p}`, f = -(c.start / 100) * u;
      return l`
                    <circle class="donut-segment" cx="50" cy="50" r="42"
                      stroke-dasharray=${_}
                      stroke-dashoffset=${f}>
                    </circle>
                  `;
    })}
              </svg>
              <div class="donut-center">
                <span class="donut-total">${this.formatNumber(o)}</span>
                <span class="donut-caption">${s("statistics_bottles")}</span>
              </div>
            </div>
            ${this.config?.show_statistics_legends === !1 ? h : l`
              <div class="legend">
                ${n.map((c) => l`
                <div class="legend-item">
                  <span class="legend-swatch" style=${`background: ${c.color}`}></span>
                  <span class="legend-name">${c.name}</span>
                  <span class="legend-value">${this.formatNumber(c.bottles)}</span>
                  <span class="legend-meta">
                    ${new Intl.NumberFormat(this.hass?.language ?? void 0, {
      style: "percent",
      maximumFractionDigits: 1
    }).format(c.bottles / o)}
                    · ${this.formatNumber(c.wines)} ${s("statistics_references")}
                  </span>
                </div>
                `)}
              </div>
            `}
          </div>
        ` : l`<p class="muted">${s("statistics_empty")}</p>`}
      </section>
    `;
  }
  getDiagnosticWines(e) {
    const t = e === "unlocated" ? "unlocated_bottles" : e === "negative" ? "negative_movement_bottles" : "physical_surplus_bottles";
    return (this.inventory?.wine_diagnostics ?? []).filter((s) => (s[t] ?? 0) > 0).sort((s, i) => (i[t] ?? 0) - (s[t] ?? 0) || s.name.localeCompare(i.name, this.hass?.language));
  }
  renderDiagnosticDialog() {
    const e = this.activeDiagnostic;
    if (!e) return h;
    const t = e === "unlocated" ? "diagnostic_unlocated" : e === "negative" ? "diagnostic_negative" : "diagnostic_surplus", s = e === "unlocated" ? "diagnostic_detail_unlocated" : e === "negative" ? "diagnostic_detail_negative" : "diagnostic_detail_surplus", i = this.getDiagnosticWines(e), o = (n) => v(this.hass?.language ?? "en", n), r = (n) => e === "unlocated" ? n.unlocated_bottles ?? 0 : e === "negative" ? n.negative_movement_bottles ?? 0 : n.physical_surplus_bottles ?? 0;
    return l`
      <ha-dialog .open=${!0} .heading=${o(t)} @closed=${() => {
      this.activeDiagnostic = void 0;
    }}>
        <div class="diagnostic-detail-list">
          <p class="muted">${o(s)}</p>
          ${i.length ? i.map((n) => l`
            <section class="diagnostic-detail-item">
              <h4 class="diagnostic-detail-name">${n.name}${n.vintage ? ` · ${n.vintage}` : ""}</h4>
              <dl class="diagnostic-detail-meta">
                <div><dt>${o("diagnostic_detail_quantity")}</dt><dd>${this.formatNumber(r(n))}</dd></div>
                <div><dt>${o("diagnostic_detail_in_cellar")}</dt><dd>${this.formatNumber(n.bottles_in_cellar)}</dd></div>
                <div><dt>${o("diagnostic_detail_stock")}</dt><dd>${this.formatNumber(n.effective_stock)}</dd></div>
                ${e === "negative" ? l`
                  <div><dt>${o("diagnostic_detail_purchased")}</dt><dd>${this.formatNumber(n.purchased ?? 0)}</dd></div>
                  <div><dt>${o("diagnostic_detail_consumed")}</dt><dd>${this.formatNumber(n.consumed ?? 0)}</dd></div>
                  <div><dt>${o("diagnostic_detail_balance")}</dt><dd>${this.formatNumber(n.movement_balance ?? 0)}</dd></div>
                ` : h}
              </dl>
            </section>
          `) : l`<p class="muted">${o("diagnostic_detail_empty")}</p>`}
        </div>
      </ha-dialog>
    `;
  }
  render() {
    const e = (p) => v(this.hass?.language ?? "en", p), t = this.inventory, s = this.config?.title ?? e("card_title"), i = this.config?.show_occupancy !== !1, o = this.config?.show_diagnostics !== !1, r = this.config?.show_statistics !== !1, n = t && t.total_positions > 0 ? Math.round(t.occupied_positions / t.total_positions * 100) : 0, d = t?.stock_reconstruction_complete ? [
      { key: "diagnostic_unlocated", value: t.unlocated_bottles ?? 0 },
      { key: "diagnostic_negative", value: t.negative_movement_bottles ?? 0 },
      { key: "diagnostic_surplus", value: t.physical_surplus_bottles ?? 0 }
    ].filter((p) => p.value > 0) : [], a = !!(t && (!t.stock_reconstruction_complete || d.length > 0 || t.positions_with_unknown_wine > 0)), c = t?.wines ?? [], u = t?.wine_references ?? c.length;
    return l`
      <ha-card>
        <header>
          <h2>${s}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? l`<div class="error">${this.error}</div>` : h}
        ${this.config?.config_entry_id ? h : l`<div class="muted">${e("select_config")}</div>`}
        ${t ? l`
          ${t.stale ? l`<div class="warning">${e("stale")}</div>` : h}
          <div class="summary">
            ${this.metric(t.total_bottles, e("bottles_in_cellar"))}
            ${this.metric(
      t.total_stock_bottles ?? e("unknown_value"),
      e("reconstructed_stock")
    )}
            ${this.metric(u, e("stocked_references"))}
            ${this.metric(t.rack_count, e("racks"))}
          </div>
          ${i ? l`
            <section class="section" aria-label=${e("rack_occupancy")}>
              <div class="occupancy-heading">
                <span>${e("rack_occupancy")}</span>
                <span>${this.formatNumber(t.occupied_positions)} / ${this.formatNumber(t.total_positions)}</span>
              </div>
              <div class="occupancy-bar" role="progressbar"
                aria-label=${e("rack_occupancy")}
                aria-valuemin="0" aria-valuemax=${t.total_positions}
                aria-valuenow=${t.occupied_positions}>
                <div class="occupancy-fill" style=${`width: ${n}%`}></div>
              </div>
              <div class="muted">${e("empty_positions")}: ${this.formatNumber(Math.max(0, t.total_positions - t.occupied_positions))}</div>
            </section>
          ` : h}
          ${o && a ? l`
            <section class="section">
              <h3 class="section-title">${e("inventory_diagnostics")}</h3>
              ${t.stock_reconstruction_complete ? h : l`<div class="warning">${e("reconstruction_incomplete")}</div>`}
              ${d.length ? l`
                <div class="diagnostics">
                  ${d.map((p) => {
      const _ = p.key === "diagnostic_unlocated" ? "unlocated" : p.key === "diagnostic_negative" ? "negative" : "surplus";
      return l`
                      <button class="diagnostic" type="button" aria-haspopup="dialog"
                        @click=${() => {
        this.activeDiagnostic = _;
      }}>
                        <span class="diagnostic-value">${this.formatNumber(p.value)}</span>
                        <span class="label">${e(p.key)}</span>
                        <span class="diagnostic-hint">${e("diagnostic_detail_open")}</span>
                      </button>
                    `;
    })}
                </div>
              ` : h}
              ${t.positions_with_unknown_wine > 0 ? l`<div class="warning">${e("statistics_unknown_wine_positions").replace("{count}", this.formatNumber(t.positions_with_unknown_wine))}</div>` : h}
            </section>
          ` : h}
          ${r ? l`
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
          ` : h}
          <div class="muted section">${e("last_sync")}: ${this.formatSync(t.last_sync)}</div>
          ${this.renderDiagnosticDialog()}
        ` : h}
        ${this.donutTooltip ? l`
          <div class="donut-tooltip" role="tooltip"
            style=${`left: ${this.donutTooltip.left}px; top: ${this.donutTooltip.top}px`}>
            ${this.donutTooltip.text}
          </div>
        ` : h}
      </ha-card>
    `;
  }
  getCardSize() {
    return 12;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
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
    .diagnostic { display: block; width: 100%; text-align: left; color: inherit; border: 1px solid var(--divider-color); border-radius: 8px; padding: 10px; min-width: 0; cursor: pointer; }
    .diagnostic:hover { background: var(--secondary-background-color); }
    .diagnostic:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .diagnostic-value { display: block; font-weight: 600; font-variant-numeric: tabular-nums; }
    .diagnostic-hint { display: block; margin-top: 4px; color: var(--secondary-text-color); font-size: .75rem; }
    .diagnostic-detail-list { display: grid; gap: 12px; max-height: min(60vh, 520px); overflow: auto; }
    .diagnostic-detail-item { border-bottom: 1px solid var(--divider-color); padding: 0 0 10px; }
    .diagnostic-detail-name { margin: 0 0 6px; font-weight: 600; }
    .diagnostic-detail-meta { display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 6px 14px; }
    .diagnostic-detail-meta div { display: flex; justify-content: space-between; gap: 12px; }
    .diagnostic-detail-meta dt { color: var(--secondary-text-color); }
    .diagnostic-detail-meta dd { margin: 0; font-weight: 500; font-variant-numeric: tabular-nums; }
    .groups { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 320px), 1fr)); gap: 12px; margin-top: 14px; }
    .group { min-width: 0; border: 1px solid var(--divider-color); border-radius: 10px; padding: 12px; }
    .group-title { margin: 0 0 12px; font-size: 1rem; font-weight: 500; }
    .chart-content { display: grid; grid-template-columns: minmax(112px, .85fr) minmax(0, 1.15fr); gap: 12px; align-items: center; }
    .chart-content.chart-content-no-legend { grid-template-columns: minmax(0, 1fr); }
    .donut { position: relative; display: grid; place-items: center; width: 100%; max-width: 150px; aspect-ratio: 1; border-radius: 50%; justify-self: center; }
    .donut-chart { position: absolute; inset: 0; display: block; width: 100%; height: 100%; overflow: visible; }
    .donut-segment { fill: none; stroke: transparent; stroke-width: 16; pointer-events: none; }
    .donut-tooltip {
      position: fixed;
      z-index: 10000;
      max-width: 240px;
      padding: 8px 10px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--primary-background-color, var(--card-background-color, #fff));
      color: var(--primary-text-color);
      box-shadow: 0 2px 8px rgb(0 0 0 / 25%);
      font-size: .8rem;
      line-height: 1.35;
      pointer-events: none;
      overflow-wrap: anywhere;
    }
    .donut-center { position: absolute; inset: 17%; display: flex; flex-direction: column; align-items: center; justify-content: center; border-radius: 50%; background: var(--card-background-color, var(--ha-card-background, #fff)); pointer-events: none; }
    .donut-total { color: var(--primary-text-color); font-size: 1rem; font-weight: 600; font-variant-numeric: tabular-nums; }
    .donut-caption { color: var(--secondary-text-color); font-size: .48rem; }
    .legend { display: grid; gap: 4px; min-width: 0; }
    .legend-item { display: grid; grid-template-columns: 10px minmax(0, 1fr) auto; align-items: center; column-gap: 7px; row-gap: 2px; font-size: .82rem; }
    .legend-swatch { width: 9px; height: 9px; border-radius: 50%; }
    .legend-name { min-width: 0; overflow-wrap: anywhere; }
    .legend-value { white-space: nowrap; font-variant-numeric: tabular-nums; font-weight: 600; }
    .legend-meta { grid-column: 2 / 4; margin-top: -2px; color: var(--secondary-text-color); font-size: .72rem; }
    .warning { color: var(--warning-color); padding: 8px 0; }
    .error { color: var(--error-color); padding: 8px 0; }
    @media (max-width: 420px) {
      ha-card { padding: 12px; }
      .chart-content { grid-template-columns: minmax(96px, .7fr) minmax(0, 1.3fr); gap: 8px; }
      .legend { gap: 6px; }
      .legend-item { font-size: .78rem; }
    }
  `;
w([
  L({ attribute: !1 })
], y.prototype, "hass", 2);
w([
  g()
], y.prototype, "config", 2);
w([
  g()
], y.prototype, "inventory", 2);
w([
  g()
], y.prototype, "loading", 2);
w([
  g()
], y.prototype, "error", 2);
w([
  g()
], y.prototype, "activeDiagnostic", 2);
w([
  g()
], y.prototype, "donutTooltip", 2);
y = w([
  q("ploc-cellar-card")
], y);
let _t = class extends y {
};
_t = w([
  q("ploc-cellar-statistics-card")
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
