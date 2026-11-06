const Oa = globalThis, Ql = Oa.ShadowRoot && (Oa.ShadyCSS === void 0 || Oa.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Jl = /* @__PURE__ */ Symbol(), ju = /* @__PURE__ */ new WeakMap();
let vv = class {
  constructor(t, r, i) {
    if (this._$cssResult$ = !0, i !== Jl) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (Ql && t === void 0) {
      const i = r !== void 0 && r.length === 1;
      i && (t = ju.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && ju.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const Sg = (e) => new vv(typeof e == "string" ? e : e + "", void 0, Jl), Do = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[a + 1], e[0]);
  return new vv(r, e, Jl);
}, Tg = (e, t) => {
  if (Ql) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const i = document.createElement("style"), n = Oa.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = r.cssText, e.appendChild(i);
  }
}, Qu = Ql ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const i of t.cssRules) r += i.cssText;
  return Sg(r);
})(e) : e;
const { is: Cg, defineProperty: xg, getOwnPropertyDescriptor: Dg, getOwnPropertyNames: Eg, getOwnPropertySymbols: Ag, getPrototypeOf: Mg } = Object, Eo = globalThis, Ju = Eo.trustedTypes, Pg = Ju ? Ju.emptyScript : "", Lg = Eo.reactiveElementPolyfillSupport, bn = (e, t) => e, qa = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? Pg : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let r = e;
  switch (t) {
    case Boolean:
      r = e !== null;
      break;
    case Number:
      r = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        r = JSON.parse(e);
      } catch {
        r = null;
      }
  }
  return r;
} }, tu = (e, t) => !Cg(e, t), th = { attribute: !0, type: String, converter: qa, reflect: !1, useDefault: !1, hasChanged: tu };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), Eo.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let gi = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = th) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, i, r);
      n !== void 0 && xg(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, r, i) {
    const { get: n, set: a } = Dg(this.prototype, t) ?? { get() {
      return this[r];
    }, set(o) {
      this[r] = o;
    } };
    return { get: n, set(o) {
      const s = n?.call(this);
      a?.call(this, o), this.requestUpdate(t, s, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? th;
  }
  static _$Ei() {
    if (this.hasOwnProperty(bn("elementProperties"))) return;
    const t = Mg(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(bn("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(bn("properties"))) {
      const r = this.properties, i = [...Eg(r), ...Ag(r)];
      for (const n of i) this.createProperty(n, r[n]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const r = litPropertyMetadata.get(t);
      if (r !== void 0) for (const [i, n] of r) this.elementProperties.set(i, n);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [r, i] of this.elementProperties) {
      const n = this._$Eu(r, i);
      n !== void 0 && this._$Eh.set(n, r);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const r = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const n of i) r.unshift(Qu(n));
    } else t !== void 0 && r.push(Qu(t));
    return r;
  }
  static _$Eu(t, r) {
    const i = r.attribute;
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
    const t = /* @__PURE__ */ new Map(), r = this.constructor.elementProperties;
    for (const i of r.keys()) this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return Tg(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, r, i) {
    this._$AK(t, i);
  }
  _$ET(t, r) {
    const i = this.constructor.elementProperties.get(t), n = this.constructor._$Eu(t, i);
    if (n !== void 0 && i.reflect === !0) {
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : qa).toAttribute(r, i.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, r) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : qa;
      this._$Em = n;
      const s = o.fromAttribute(r, a.type);
      this[n] = s ?? this._$Ej?.get(n) ?? s, this._$Em = null;
    }
  }
  requestUpdate(t, r, i, n = !1, a) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? tu)(a, r) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
      this.C(t, r, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, r, { useDefault: i, reflect: n, wrapped: a }, o) {
    i && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? r ?? this[t]), a !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || i || (r = void 0), this._$AL.set(t, r)), n === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (r) {
      Promise.reject(r);
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
        for (const [n, a] of this._$Ep) this[n] = a;
        this._$Ep = void 0;
      }
      const i = this.constructor.elementProperties;
      if (i.size > 0) for (const [n, a] of i) {
        const { wrapped: o } = a, s = this[n];
        o !== !0 || this._$AL.has(n) || s === void 0 || this.C(n, void 0, a, s);
      }
    }
    let t = !1;
    const r = this._$AL;
    try {
      t = this.shouldUpdate(r), t ? (this.willUpdate(r), this._$EO?.forEach((i) => i.hostUpdate?.()), this.update(r)) : this._$EM();
    } catch (i) {
      throw t = !1, this._$EM(), i;
    }
    t && this._$AE(r);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((r) => r.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Eq &&= this._$Eq.forEach((r) => this._$ET(r, this[r])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
gi.elementStyles = [], gi.shadowRootOptions = { mode: "open" }, gi[bn("elementProperties")] = /* @__PURE__ */ new Map(), gi[bn("finalized")] = /* @__PURE__ */ new Map(), Lg?.({ ReactiveElement: gi }), (Eo.reactiveElementVersions ??= []).push("2.1.2");
const eu = globalThis, eh = (e) => e, Za = eu.trustedTypes, rh = Za ? Za.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, dv = "$lit$", sr = `lit$${Math.random().toFixed(9).slice(2)}$`, pv = "?" + sr, Ig = `<${pv}>`, Zr = document, kn = () => Zr.createComment(""), Nn = (e) => e === null || typeof e != "object" && typeof e != "function", ru = Array.isArray, Rg = (e) => ru(e) || typeof e?.[Symbol.iterator] == "function", Xo = `[ 	
\f\r]`, Xi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ih = /-->/g, nh = />/g, mr = RegExp(`>|${Xo}(?:([^\\s"'>=/]+)(${Xo}*=${Xo}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), ah = /'/g, oh = /"/g, gv = /^(?:script|style|textarea|title)$/i, Og = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), N = Og(1), Mi = /* @__PURE__ */ Symbol.for("lit-noChange"), F = /* @__PURE__ */ Symbol.for("lit-nothing"), sh = /* @__PURE__ */ new WeakMap(), zr = Zr.createTreeWalker(Zr, 129);
function _v(e, t) {
  if (!ru(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return rh !== void 0 ? rh.createHTML(t) : t;
}
const kg = (e, t) => {
  const r = e.length - 1, i = [];
  let n, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Xi;
  for (let s = 0; s < r; s++) {
    const l = e[s];
    let u, h, f = -1, c = 0;
    for (; c < l.length && (o.lastIndex = c, h = o.exec(l), h !== null); ) c = o.lastIndex, o === Xi ? h[1] === "!--" ? o = ih : h[1] !== void 0 ? o = nh : h[2] !== void 0 ? (gv.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = mr) : h[3] !== void 0 && (o = mr) : o === mr ? h[0] === ">" ? (o = n ?? Xi, f = -1) : h[1] === void 0 ? f = -2 : (f = o.lastIndex - h[2].length, u = h[1], o = h[3] === void 0 ? mr : h[3] === '"' ? oh : ah) : o === oh || o === ah ? o = mr : o === ih || o === nh ? o = Xi : (o = mr, n = void 0);
    const v = o === mr && e[s + 1].startsWith("/>") ? " " : "";
    a += o === Xi ? l + Ig : f >= 0 ? (i.push(u), l.slice(0, f) + dv + l.slice(f) + sr + v) : l + sr + (f === -2 ? s : v);
  }
  return [_v(e, a + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class $n {
  constructor({ strings: t, _$litType$: r }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const s = t.length - 1, l = this.parts, [u, h] = kg(t, r);
    if (this.el = $n.createElement(u, i), zr.currentNode = this.el.content, r === 2 || r === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (n = zr.nextNode()) !== null && l.length < s; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const f of n.getAttributeNames()) if (f.endsWith(dv)) {
          const c = h[o++], v = n.getAttribute(f).split(sr), d = /([.?@])?(.*)/.exec(c);
          l.push({ type: 1, index: a, name: d[2], strings: v, ctor: d[1] === "." ? $g : d[1] === "?" ? Bg : d[1] === "@" ? Fg : Ao }), n.removeAttribute(f);
        } else f.startsWith(sr) && (l.push({ type: 6, index: a }), n.removeAttribute(f));
        if (gv.test(n.tagName)) {
          const f = n.textContent.split(sr), c = f.length - 1;
          if (c > 0) {
            n.textContent = Za ? Za.emptyScript : "";
            for (let v = 0; v < c; v++) n.append(f[v], kn()), zr.nextNode(), l.push({ type: 2, index: ++a });
            n.append(f[c], kn());
          }
        }
      } else if (n.nodeType === 8) if (n.data === pv) l.push({ type: 2, index: a });
      else {
        let f = -1;
        for (; (f = n.data.indexOf(sr, f + 1)) !== -1; ) l.push({ type: 7, index: a }), f += sr.length - 1;
      }
      a++;
    }
  }
  static createElement(t, r) {
    const i = Zr.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Pi(e, t, r = e, i) {
  if (t === Mi) return t;
  let n = i !== void 0 ? r._$Co?.[i] : r._$Cl;
  const a = Nn(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(e), n._$AT(e, r, i)), i !== void 0 ? (r._$Co ??= [])[i] = n : r._$Cl = n), n !== void 0 && (t = Pi(e, n._$AS(e, t.values), n, i)), t;
}
class Ng {
  constructor(t, r) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = r;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: r }, parts: i } = this._$AD, n = (t?.creationScope ?? Zr).importNode(r, !0);
    zr.currentNode = n;
    let a = zr.nextNode(), o = 0, s = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new Kn(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new Vg(a, this, t)), this._$AV.push(u), l = i[++s];
      }
      o !== l?.index && (a = zr.nextNode(), o++);
    }
    return zr.currentNode = Zr, n;
  }
  p(t) {
    let r = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, r), r += i.strings.length - 2) : i._$AI(t[r])), r++;
  }
}
class Kn {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, i, n) {
    this.type = 2, this._$AH = F, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const r = this._$AM;
    return r !== void 0 && t?.nodeType === 11 && (t = r.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, r = this) {
    t = Pi(this, t, r), Nn(t) ? t === F || t == null || t === "" ? (this._$AH !== F && this._$AR(), this._$AH = F) : t !== this._$AH && t !== Mi && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Rg(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== F && Nn(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Zr.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = $n.createElement(_v(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(r);
    else {
      const a = new Ng(n, this), o = a.u(this.options);
      a.p(r), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let r = sh.get(t.strings);
    return r === void 0 && sh.set(t.strings, r = new $n(t)), r;
  }
  k(t) {
    ru(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let i, n = 0;
    for (const a of t) n === r.length ? r.push(i = new Kn(this.O(kn()), this.O(kn()), this, this.options)) : i = r[n], i._$AI(a), n++;
    n < r.length && (this._$AR(i && i._$AB.nextSibling, n), r.length = n);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const i = eh(t).nextSibling;
      eh(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Ao {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, i, n, a) {
    this.type = 1, this._$AH = F, this._$AN = void 0, this.element = t, this.name = r, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = F;
  }
  _$AI(t, r = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = Pi(this, t, r, 0), o = !Nn(t) || t !== this._$AH && t !== Mi, o && (this._$AH = t);
    else {
      const s = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = Pi(this, s[i + l], r, l), u === Mi && (u = this._$AH[l]), o ||= !Nn(u) || u !== this._$AH[l], u === F ? t = F : t !== F && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === F ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class $g extends Ao {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === F ? void 0 : t;
  }
}
class Bg extends Ao {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== F);
  }
}
class Fg extends Ao {
  constructor(t, r, i, n, a) {
    super(t, r, i, n, a), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = Pi(this, t, r, 0) ?? F) === Mi) return;
    const i = this._$AH, n = t === F && i !== F || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== F && (i === F || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Vg {
  constructor(t, r, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Pi(this, t);
  }
}
const zg = eu.litHtmlPolyfillSupport;
zg?.($n, Kn), (eu.litHtmlVersions ??= []).push("3.3.3");
const Hg = (e, t, r) => {
  const i = r?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = r?.renderBefore ?? null;
    i._$litPart$ = n = new Kn(t.insertBefore(kn(), a), a, void 0, r ?? {});
  }
  return n._$AI(e), n;
};
const iu = globalThis;
class We extends gi {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Hg(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return Mi;
  }
}
We._$litElement$ = !0, We.finalized = !0, iu.litElementHydrateSupport?.({ LitElement: We });
const Ug = iu.litElementPolyfillSupport;
Ug?.({ LitElement: We });
(iu.litElementVersions ??= []).push("4.2.2");
const Bi = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Gg = { attribute: !0, type: String, converter: qa, reflect: !1, hasChanged: tu }, Wg = (e = Gg, t, r) => {
  const { kind: i, metadata: n } = r;
  let a = globalThis.litPropertyMetadata.get(n);
  if (a === void 0 && globalThis.litPropertyMetadata.set(n, a = /* @__PURE__ */ new Map()), i === "setter" && ((e = Object.create(e)).wrapped = !0), a.set(r.name, e), i === "accessor") {
    const { name: o } = r;
    return { set(s) {
      const l = t.get.call(this);
      t.set.call(this, s), this.requestUpdate(o, l, e, !0, s);
    }, init(s) {
      return s !== void 0 && this.C(o, void 0, e, s), s;
    } };
  }
  if (i === "setter") {
    const { name: o } = r;
    return function(s) {
      const l = this[o];
      t.call(this, s), this.requestUpdate(o, l, e, !0, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function jr(e) {
  return (t, r) => typeof r == "object" ? Wg(e, t, r) : ((i, n, a) => {
    const o = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(e, t, r);
}
function gt(e) {
  return jr({ ...e, state: !0, attribute: !1 });
}
const Yg = "Ploc Cellar", Xg = "Cellar storage", qg = "Refresh", Zg = "Loading…", Kg = "Never", jg = "Bottles in cellar", Qg = "Reconstructed stock", Jg = "Racks", t_ = "Empty positions", e_ = "Data may be stale: the latest synchronization failed.", r_ = "Stock reconstruction is incomplete: only physical quantities are available.", i_ = "Last successful synchronization", n_ = "Search wines", a_ = "Search wines…", o_ = "No matching wines.", s_ = "Select a Ploc Cellar configuration in the card editor.", l_ = "Rack selection", u_ = "occupied", h_ = "free", f_ = "Unknown wine", c_ = "Empty position", v_ = "Row", d_ = "Column", p_ = "No row/column coordinates are available for this rack.", g_ = "Positions without coordinates", __ = "Not mapped", m_ = "No racks available.", y_ = "position(s) reference a missing rack.", w_ = "Wine inventory", b_ = "All colors", S_ = "All regions", T_ = "All appellations", C_ = "All vintages", x_ = "Sort by", D_ = "Name", E_ = "Quantity descending", A_ = "Vintage descending", M_ = "{count} wine(s)", P_ = "{count} bottle(s)", L_ = "Clear filters", I_ = "btl.", R_ = "Unknown vintage", O_ = "Wine details", k_ = "Grapes", N_ = "Cuvée", $_ = "Volume", B_ = "Locations", F_ = "Ploc Cellar", V_ = "Cellar overview and stock indicators.", z_ = "Wine inventory", H_ = "Search, filter and browse the wine inventory.", U_ = "Cellar racks", G_ = "Visualize rack positions and the wines stored in them.", W_ = "Ploc Cellar configuration", Y_ = "Select the PLOUD connection used by this card.", X_ = "Card title", q_ = "Optional. Leave empty to use the default title.", Z_ = "Cellar statistics", K_ = "Bottles in stock", j_ = "wine references", Q_ = "By color", J_ = "By region", tm = "By appellation", em = "By vintage", rm = "By bottle format", im = "Other", nm = "Not specified", am = "No data available for this category.", om = "Unknown", sm = "Wine references in stock", lm = "Rack occupancy", um = "Stock diagnostics", hm = "Unlocated bottles", fm = "Negative movement balance", cm = "Physical surplus", vm = "Breakdowns include known wine references only.", dm = "{count} occupied position(s) have an unknown wine reference. They are included in total stock but not in the breakdowns.", pm = "Show rack occupancy", gm = "Show diagnostics", _m = "Show statistics", mm = "Show chart legends", ym = "View details", wm = "Wine references with stock that is not assigned to a physical rack position.", bm = "Wine references where recorded outgoing movements exceed incoming movements.", Sm = "Wine references with more bottles physically stored than the reconstructed movement stock.", Tm = "Bottles concerned", Cm = "In cellar", xm = "Reconstructed stock", Dm = "Incoming", Em = "Outgoing", Am = "Movement balance", Mm = "No wine-level details are available for this diagnostic.", Pm = {
  card_title: Yg,
  rack_title: Xg,
  refresh: qg,
  loading: Zg,
  never: Kg,
  bottles_in_cellar: jg,
  reconstructed_stock: Qg,
  racks: Jg,
  empty_positions: t_,
  stale: e_,
  reconstruction_incomplete: r_,
  last_sync: i_,
  search_wine: n_,
  search_placeholder: a_,
  no_matching_wines: o_,
  select_config: s_,
  rack_selection: l_,
  occupied: u_,
  free: h_,
  unknown_wine: f_,
  empty_position: c_,
  row: v_,
  column: d_,
  no_coordinates: p_,
  positions_without_coordinates: g_,
  not_mapped: __,
  no_racks: m_,
  missing_rack: y_,
  inventory_title: w_,
  filter_color: b_,
  filter_region: S_,
  filter_appellation: T_,
  filter_vintage: C_,
  sort_by: x_,
  sort_name: D_,
  sort_bottles: E_,
  sort_vintage: A_,
  inventory_results: M_,
  inventory_bottle_total: P_,
  clear_filters: L_,
  bottles_short: I_,
  unknown_vintage: R_,
  wine_details: O_,
  grapes: k_,
  cuvee: N_,
  bottle_volume: $_,
  locations: B_,
  picker_overview_name: F_,
  picker_overview_description: V_,
  picker_inventory_name: z_,
  picker_inventory_description: H_,
  picker_rack_name: U_,
  picker_rack_description: G_,
  editor_configuration: W_,
  editor_configuration_helper: Y_,
  editor_title: X_,
  editor_title_helper: q_,
  statistics_title: Z_,
  statistics_bottles: K_,
  statistics_references: j_,
  statistics_color: Q_,
  statistics_region: J_,
  statistics_appellation: tm,
  statistics_vintage: em,
  statistics_format: rm,
  statistics_other: im,
  statistics_unknown: nm,
  statistics_empty: am,
  unknown_value: om,
  stocked_references: sm,
  rack_occupancy: lm,
  inventory_diagnostics: um,
  diagnostic_unlocated: hm,
  diagnostic_negative: fm,
  diagnostic_surplus: cm,
  statistics_distribution_scope: vm,
  statistics_unknown_wine_positions: dm,
  editor_show_occupancy: pm,
  editor_show_diagnostics: gm,
  editor_show_statistics: _m,
  editor_show_statistics_legends: mm,
  diagnostic_detail_open: ym,
  diagnostic_detail_unlocated: wm,
  diagnostic_detail_negative: bm,
  diagnostic_detail_surplus: Sm,
  diagnostic_detail_quantity: Tm,
  diagnostic_detail_in_cellar: Cm,
  diagnostic_detail_stock: xm,
  diagnostic_detail_purchased: Dm,
  diagnostic_detail_consumed: Em,
  diagnostic_detail_balance: Am,
  diagnostic_detail_empty: Mm
}, Lm = "Cave Ploc", Im = "Rangement de la cave", Rm = "Actualiser", Om = "Chargement…", km = "Jamais", Nm = "Bouteilles en cave", $m = "Stock reconstitué", Bm = "Casiers", Fm = "Places libres", Vm = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", zm = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", Hm = "Dernière synchronisation réussie", Um = "Rechercher un vin", Gm = "Rechercher un vin…", Wm = "Aucun vin correspondant.", Ym = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", Xm = "Sélection du casier", qm = "occupées", Zm = "libres", Km = "Vin inconnu", jm = "Emplacement libre", Qm = "Rangée", Jm = "Colonne", ty = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", ey = "Emplacements sans coordonnées", ry = "Non renseigné", iy = "Aucun casier disponible.", ny = "emplacement(s) référencent un casier absent.", ay = "Inventaire des vins", oy = "Toutes les couleurs", sy = "Toutes les régions", ly = "Toutes les appellations", uy = "Tous les millésimes", hy = "Trier par", fy = "Nom", cy = "Quantité décroissante", vy = "Millésime décroissant", dy = "{count} référence(s)", py = "{count} bouteille(s)", gy = "Effacer les filtres", _y = "bt.", my = "Millésime inconnu", yy = "Détails du vin", wy = "Cépages", by = "Cuvée", Sy = "Volume", Ty = "Emplacements", Cy = "Cave Ploc", xy = "Vue d’ensemble de la cave et indicateurs de stock.", Dy = "Inventaire des vins", Ey = "Rechercher, filtrer et parcourir l’inventaire des vins.", Ay = "Casiers de la cave", My = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", Py = "Configuration Ploc Cellar", Ly = "Sélectionnez la connexion PLOUD utilisée par cette carte.", Iy = "Titre de la carte", Ry = "Facultatif. Laissez vide pour utiliser le titre par défaut.", Oy = "Statistiques de la cave", ky = "Bouteilles en stock", Ny = "références de vin", $y = "Par couleur", By = "Par région", Fy = "Par appellation", Vy = "Par millésime", zy = "Par format de bouteille", Hy = "Autres", Uy = "Non renseigné", Gy = "Aucune donnée disponible pour cette catégorie.", Wy = "Inconnu", Yy = "Références de vins en stock", Xy = "Occupation des casiers", qy = "Diagnostics du stock", Zy = "Bouteilles non localisées", Ky = "Solde de mouvements négatif", jy = "Excédent physique", Qy = "Les répartitions ne portent que sur les références de vins connues.", Jy = "{count} emplacement(s) occupé(s) font référence à un vin inconnu. Ils sont inclus dans le stock total, mais pas dans les répartitions.", t0 = "Afficher l’occupation des casiers", e0 = "Afficher les diagnostics", r0 = "Afficher les statistiques", i0 = "Afficher les légendes des graphiques", n0 = "Voir le détail", a0 = "Références de vins dont une partie du stock n’est affectée à aucun emplacement physique de casier.", o0 = "Références de vins pour lesquelles les sorties enregistrées dépassent les entrées.", s0 = "Références de vins ayant davantage de bouteilles physiquement rangées que le stock reconstitué à partir des mouvements.", l0 = "Bouteilles concernées", u0 = "En cave", h0 = "Stock reconstitué", f0 = "Entrées", c0 = "Sorties", v0 = "Solde des mouvements", d0 = "Aucun détail par référence de vin n’est disponible pour ce diagnostic.", p0 = {
  card_title: Lm,
  rack_title: Im,
  refresh: Rm,
  loading: Om,
  never: km,
  bottles_in_cellar: Nm,
  reconstructed_stock: $m,
  racks: Bm,
  empty_positions: Fm,
  stale: Vm,
  reconstruction_incomplete: zm,
  last_sync: Hm,
  search_wine: Um,
  search_placeholder: Gm,
  no_matching_wines: Wm,
  select_config: Ym,
  rack_selection: Xm,
  occupied: qm,
  free: Zm,
  unknown_wine: Km,
  empty_position: jm,
  row: Qm,
  column: Jm,
  no_coordinates: ty,
  positions_without_coordinates: ey,
  not_mapped: ry,
  no_racks: iy,
  missing_rack: ny,
  inventory_title: ay,
  filter_color: oy,
  filter_region: sy,
  filter_appellation: ly,
  filter_vintage: uy,
  sort_by: hy,
  sort_name: fy,
  sort_bottles: cy,
  sort_vintage: vy,
  inventory_results: dy,
  inventory_bottle_total: py,
  clear_filters: gy,
  bottles_short: _y,
  unknown_vintage: my,
  wine_details: yy,
  grapes: wy,
  cuvee: by,
  bottle_volume: Sy,
  locations: Ty,
  picker_overview_name: Cy,
  picker_overview_description: xy,
  picker_inventory_name: Dy,
  picker_inventory_description: Ey,
  picker_rack_name: Ay,
  picker_rack_description: My,
  editor_configuration: Py,
  editor_configuration_helper: Ly,
  editor_title: Iy,
  editor_title_helper: Ry,
  statistics_title: Oy,
  statistics_bottles: ky,
  statistics_references: Ny,
  statistics_color: $y,
  statistics_region: By,
  statistics_appellation: Fy,
  statistics_vintage: Vy,
  statistics_format: zy,
  statistics_other: Hy,
  statistics_unknown: Uy,
  statistics_empty: Gy,
  unknown_value: Wy,
  stocked_references: Yy,
  rack_occupancy: Xy,
  inventory_diagnostics: qy,
  diagnostic_unlocated: Zy,
  diagnostic_negative: Ky,
  diagnostic_surplus: jy,
  statistics_distribution_scope: Qy,
  statistics_unknown_wine_positions: Jy,
  editor_show_occupancy: t0,
  editor_show_diagnostics: e0,
  editor_show_statistics: r0,
  editor_show_statistics_legends: i0,
  diagnostic_detail_open: n0,
  diagnostic_detail_unlocated: a0,
  diagnostic_detail_negative: o0,
  diagnostic_detail_surplus: s0,
  diagnostic_detail_quantity: l0,
  diagnostic_detail_in_cellar: u0,
  diagnostic_detail_stock: h0,
  diagnostic_detail_purchased: f0,
  diagnostic_detail_consumed: c0,
  diagnostic_detail_balance: v0,
  diagnostic_detail_empty: d0
};
function jt(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? p0 : Pm)[t];
}
function Li(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return jt(t, e);
}
var g0 = Object.defineProperty, _0 = Object.getOwnPropertyDescriptor, Qr = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? _0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && g0(t, r, n), n;
};
let qe = class extends We {
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
    const r = t.config_entry_id, i = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: r },
        return_response: !0
      });
      i === this.requestGeneration && (this.inventory = n.response, (!this.selectedRackId || !this.inventory.racks.some((a) => a.id === this.selectedRackId)) && (this.selectedRackId = this.inventory.racks[0]?.id));
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
      this.positionedItems.map((r) => `${r.row}:${r.column}`)
    ), t = [];
    for (let r = this.firstRow; r <= Math.max(...this.rowValues); r += 1)
      for (let i = this.firstColumn; i <= Math.max(...this.columnValues); i += 1)
        e.has(`${r}:${i}`) || t.push({ row: r, column: i });
    return t;
  }
  get wineById() {
    return new Map((this.inventory?.wines ?? []).map((e) => [e.id, e]));
  }
  wineLabel(e) {
    if (!e.wine_id) return "";
    const t = this.wineById.get(e.wine_id);
    return t ? t.name : jt(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const e = (l) => jt(this.hass?.language ?? "en", l), t = this.inventory, r = t?.racks.find((l) => l.id === this.selectedRackId), i = this.rowValues, n = this.columnValues, a = this.positionedItems, o = this.selectedItems.filter((l) => l.row === null || l.column === null), s = (t?.rack_items ?? []).filter(
      (l) => !t?.racks.some((u) => u.id === l.rack_id)
    );
    return N`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? N`<div class="error">${this.error}</div>` : F}
        ${this.config?.config_entry_id ? F : N`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? N`<div class="warning">${e("stale")}</div>` : F}
        ${t?.racks.length ? N`
          <nav class="rack-picker" aria-label=${e("rack_selection")}>
            ${t.racks.map((l) => N`
              <button aria-pressed=${l.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = l.id;
    }}>${l.name}</button>
            `)}
          </nav>
          <div class="legend">${r?.name ?? ""} · ${this.selectedItems.filter((l) => l.wine_id).length} ${e("occupied")} · ${this.selectedItems.filter((l) => !l.wine_id).length} ${e("free")}</div>
          ${i.length && n.length ? N`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${a.map((l) => {
      const u = l.row - this.firstRow + 1, h = l.column - this.firstColumn + 1, f = !!l.wine_id;
      return N`
                    <div class=${f ? "slot occupied" : "slot"}
                      style=${`grid-row: ${u}; grid-column: ${h};`}
                      title=${this.wineLabel(l) || e("empty_position")}>
                      <strong>${f ? this.wineLabel(l) : "—"}</strong>
                      <small>${e("row")} ${l.row} · ${e("column")} ${l.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((l) => N`
                  <div class="slot missing"
                    style=${`grid-row: ${l.row - this.firstRow + 1}; grid-column: ${l.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${e("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : N`<div class="warning">${e("no_coordinates")}</div>`}
          ${o.length ? N`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${o.map((l) => N`<div class="unplaced-item">${this.wineLabel(l) || e("empty_position")}</div>`)}
            </div>
          ` : F}
        ` : N`<p class="muted">${e("no_racks")}</p>`}
        ${s.length ? N`
          <div class="warning">${s.length} ${e("missing_rack")}</div>
        ` : F}
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
qe.styles = Do`
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
Qr([
  jr({ attribute: !1 })
], qe.prototype, "hass", 2);
Qr([
  gt()
], qe.prototype, "config", 2);
Qr([
  gt()
], qe.prototype, "inventory", 2);
Qr([
  gt()
], qe.prototype, "selectedRackId", 2);
Qr([
  gt()
], qe.prototype, "loading", 2);
Qr([
  gt()
], qe.prototype, "error", 2);
qe = Qr([
  Bi("ploc-cellar-rack-card")
], qe);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: Li("picker_rack_name"),
  description: Li("picker_rack_description")
});
var m0 = Object.defineProperty, y0 = Object.getOwnPropertyDescriptor, ce = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? y0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && m0(t, r, n), n;
};
let Wt = class extends We {
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
    const r = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const i = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: t.config_entry_id },
        return_response: !0
      });
      r === this.requestGeneration && (this.inventory = i.response);
    } catch (i) {
      r === this.requestGeneration && (this.error = i instanceof Error ? i.message : String(i));
    } finally {
      r === this.requestGeneration && (this.loading = !1);
    }
  }
  valuesFor(e) {
    const t = (this.inventory?.wines ?? []).map((r) => r[e]).filter((r) => r !== null && r !== "");
    return [...new Set(t.map(String))].sort(
      (r, i) => r.localeCompare(i, this.hass?.language ?? void 0, { numeric: !0, sensitivity: "base" })
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
    ].filter((n) => n != null).join(" ").toLocaleLowerCase().includes(e) : !0), r = new Intl.Collator(this.hass?.language ?? void 0, {
      numeric: !0,
      sensitivity: "base"
    });
    return [...t].sort((i, n) => this.sort === "bottles" ? n.bottles_in_cellar - i.bottles_in_cellar || r.compare(i.name, n.name) : this.sort === "vintage" && (n.vintage ?? 0) - (i.vintage ?? 0) || r.compare(i.name, n.name));
  }
  clearFilters() {
    this.search = "", this.color = "", this.region = "", this.appellation = "", this.vintage = "", this.sort = "name";
  }
  selectFilter(e, t, r, i) {
    return N`
      <select aria-label=${t} .value=${r}
        @change=${(n) => {
      const a = n.target.value;
      e === "color" ? this.color = a : e === "region" ? this.region = a : e === "appellation" ? this.appellation = a : this.vintage = a;
    }}>
        <option value="" ?selected=${!r}>${t}</option>
        ${i.map((n) => N`<option value=${n} ?selected=${n === r}>${n}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? F : N`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (a) => jt(this.hass?.language ?? "en", a), r = e.locations.map((a) => {
      const o = a.row !== null && a.column !== null ? ` · ${t("row")} ${a.row}, ${t("column")} ${a.column}` : "";
      return `${a.rack}${o}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), n = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
    return N`
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
          ${e.color ? N`<span class="tag">${e.color}</span>` : F}
          <span class="tag">${i}</span>
          ${e.bottle_format ? N`<span class="tag">${e.bottle_format}</span>` : F}
        </div>
        <details>
          <summary class="metadata">${t("wine_details")}</summary>
          <div class="details">
            ${this.detail(t("grapes"), e.grapes)}
            ${this.detail(t("cuvee"), e.cuvee)}
            ${this.detail(t("bottle_volume"), n)}
            ${this.detail(t("locations"), r.length ? r.join(" · ") : null)}
          </div>
        </details>
      </article>
    `;
  }
  render() {
    const e = (n) => jt(this.hass?.language ?? "en", n), t = this.filteredWines, r = t.reduce((n, a) => n + a.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
    return N`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("inventory_title")}</h2>
          <div class="actions">
            <button ?disabled=${this.loading} @click=${() => this.refresh()}>
              ${this.loading ? e("loading") : e("refresh")}
            </button>
          </div>
        </header>
        ${this.error ? N`<div class="error">${this.error}</div>` : F}
        ${this.config?.config_entry_id ? F : N`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? N`<div class="warning">${e("stale")}</div>` : F}
        ${this.inventory ? N`
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
            <span>${e("inventory_bottle_total").replace("{count}", String(r))}</span>
            ${i ? N`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : F}
          </div>
          ${this.inventory.stock_reconstruction_complete ? F : N`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((n) => this.renderWine(n))}
          </div>
          ${t.length === 0 ? N`<p class="muted">${e("no_matching_wines")}</p>` : F}
        ` : F}
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
Wt.styles = Do`
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
ce([
  jr({ attribute: !1 })
], Wt.prototype, "hass", 2);
ce([
  gt()
], Wt.prototype, "config", 2);
ce([
  gt()
], Wt.prototype, "inventory", 2);
ce([
  gt()
], Wt.prototype, "loading", 2);
ce([
  gt()
], Wt.prototype, "error", 2);
ce([
  gt()
], Wt.prototype, "search", 2);
ce([
  gt()
], Wt.prototype, "color", 2);
ce([
  gt()
], Wt.prototype, "region", 2);
ce([
  gt()
], Wt.prototype, "appellation", 2);
ce([
  gt()
], Wt.prototype, "vintage", 2);
ce([
  gt()
], Wt.prototype, "sort", 2);
Wt = ce([
  Bi("ploc-cellar-inventory-card")
], Wt);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: Li("picker_inventory_name"),
  description: Li("picker_inventory_description")
});
var w0 = Object.defineProperty, b0 = Object.getOwnPropertyDescriptor, nu = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? b0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && w0(t, r, n), n;
};
let Ka = class extends We {
  constructor() {
    super(...arguments), this.computeLabel = (e) => {
      const r = {
        config_entry_id: "editor_configuration",
        title: "editor_title",
        show_occupancy: "editor_show_occupancy",
        show_diagnostics: "editor_show_diagnostics",
        show_statistics: "editor_show_statistics",
        show_statistics_legends: "editor_show_statistics_legends"
      }[e.name];
      return jt(this.hass?.language ?? "en", r);
    }, this.computeHelper = (e) => {
      if (e.name === "config_entry_id")
        return jt(this.hass?.language ?? "en", "editor_configuration_helper");
      if (e.name === "title")
        return jt(this.hass?.language ?? "en", "editor_title_helper");
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
    return N`
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
nu([
  jr({ attribute: !1 })
], Ka.prototype, "hass", 2);
nu([
  gt()
], Ka.prototype, "config", 2);
Ka = nu([
  Bi("ploc-cellar-card-editor")
], Ka);
var sl = function(e, t) {
  return sl = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
    r.__proto__ = i;
  } || function(r, i) {
    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (r[n] = i[n]);
  }, sl(e, t);
};
function W(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  sl(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
var S0 = /* @__PURE__ */ (function() {
  function e() {
    this.firefox = !1, this.ie = !1, this.edge = !1, this.newEdge = !1, this.weChat = !1;
  }
  return e;
})(), T0 = /* @__PURE__ */ (function() {
  function e() {
    this.browser = new S0(), this.node = !1, this.wxa = !1, this.worker = !1, this.svgSupported = !1, this.touchEventsSupported = !1, this.pointerEventsSupported = !1, this.domSupported = !1, this.transformSupported = !1, this.transform3dSupported = !1, this.hasGlobalWindow = typeof window < "u";
  }
  return e;
})(), V = new T0();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (V.wxa = !0, V.touchEventsSupported = !0) : typeof document > "u" && typeof self < "u" ? V.worker = !0 : !V.hasGlobalWindow || "Deno" in window ? (V.node = !0, V.svgSupported = !0) : C0(navigator.userAgent, V);
function C0(e, t) {
  var r = t.browser, i = e.match(/Firefox\/([\d.]+)/), n = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/.+?rv:(([\d.]+))/), a = e.match(/Edge?\/([\d.]+)/), o = /micromessenger/i.test(e);
  i && (r.firefox = !0, r.version = i[1]), n && (r.ie = !0, r.version = n[1]), a && (r.edge = !0, r.version = a[1], r.newEdge = +a[1].split(".")[0] > 18), o && (r.weChat = !0), t.svgSupported = typeof SVGRect < "u", t.touchEventsSupported = "ontouchstart" in window && !r.ie && !r.edge, t.pointerEventsSupported = "onpointerdown" in window && (r.edge || r.ie && +r.version >= 11), t.domSupported = typeof document < "u";
  var s = document.documentElement.style;
  t.transform3dSupported = (r.ie && "transition" in s || r.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in s) && !("OTransition" in s), t.transformSupported = t.transform3dSupported || r.ie && +r.version >= 9;
}
var au = 12, x0 = "sans-serif", Kr = au + "px " + x0, D0 = 20, E0 = 100, A0 = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function M0(e) {
  var t = {};
  if (typeof JSON > "u")
    return t;
  for (var r = 0; r < e.length; r++) {
    var i = String.fromCharCode(r + 32), n = (e.charCodeAt(r) - D0) / E0;
    t[i] = n;
  }
  return t;
}
var P0 = M0(A0), Fi = {
  createCanvas: function() {
    return typeof document < "u" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ (function() {
    var e, t;
    return function(r, i) {
      if (!e) {
        var n = Fi.createCanvas();
        e = n && n.getContext("2d");
      }
      if (e)
        return t !== i && (t = e.font = i || Kr), e.measureText(r);
      r = r || "", i = i || Kr;
      var a = /((?:\d+)?\.?\d*)px/.exec(i), o = a && +a[1] || au, s = 0;
      if (i.indexOf("mono") >= 0)
        s = o * r.length;
      else
        for (var l = 0; l < r.length; l++) {
          var u = P0[r[l]];
          s += u == null ? o : u * o;
        }
      return { width: s };
    };
  })(),
  loadImage: function(e, t, r) {
    var i = new Image();
    return i.onload = t, i.onerror = r, i.src = e, i;
  }
}, mv = dr([
  "Function",
  "RegExp",
  "Date",
  "Error",
  "CanvasGradient",
  "CanvasPattern",
  "Image",
  "Canvas"
], function(e, t) {
  return e["[object " + t + "]"] = !0, e;
}, {}), yv = dr([
  "Int8",
  "Uint8",
  "Uint8Clamped",
  "Int16",
  "Uint16",
  "Int32",
  "Uint32",
  "Float32",
  "Float64"
], function(e, t) {
  return e["[object " + t + "Array]"] = !0, e;
}, {}), Vi = Object.prototype.toString, Mo = Array.prototype, L0 = Mo.forEach, I0 = Mo.filter, ou = Mo.slice, R0 = Mo.map, lh = function() {
}.constructor, ia = lh ? lh.prototype : null, su = "__proto__", O0 = 2311;
function wv() {
  return O0++;
}
function Wr() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  typeof console < "u" && console.error.apply(console, e);
}
function tt(e) {
  if (e == null || typeof e != "object")
    return e;
  var t = e, r = Vi.call(e);
  if (r === "[object Array]") {
    if (!Tn(e)) {
      t = [];
      for (var i = 0, n = e.length; i < n; i++)
        t[i] = tt(e[i]);
    }
  } else if (yv[r]) {
    if (!Tn(e)) {
      var a = e.constructor;
      if (a.from)
        t = a.from(e);
      else {
        t = new a(e.length);
        for (var i = 0, n = e.length; i < n; i++)
          t[i] = e[i];
      }
    }
  } else if (!mv[r] && !Tn(e) && !Ii(e)) {
    t = {};
    for (var o in e)
      e.hasOwnProperty(o) && o !== su && (t[o] = tt(e[o]));
  }
  return t;
}
function mt(e, t, r) {
  if (!B(t) || !B(e))
    return r ? tt(t) : e;
  for (var i in t)
    if (t.hasOwnProperty(i) && i !== su) {
      var n = e[i], a = t[i];
      B(a) && B(n) && !k(a) && !k(n) && !Ii(a) && !Ii(n) && !uh(a) && !uh(n) && !Tn(a) && !Tn(n) ? mt(n, a, r) : (r || !(i in e)) && (e[i] = tt(t[i]));
    }
  return e;
}
function I(e, t) {
  if (Object.assign)
    Object.assign(e, t);
  else
    for (var r in t)
      t.hasOwnProperty(r) && r !== su && (e[r] = t[r]);
  return e;
}
function ht(e, t, r) {
  for (var i = pt(t), n = 0, a = i.length; n < a; n++) {
    var o = i[n];
    e[o] == null && (e[o] = t[o]);
  }
  return e;
}
function st(e, t) {
  if (e) {
    if (e.indexOf)
      return e.indexOf(t);
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t)
        return r;
  }
  return -1;
}
function k0(e, t) {
  var r = e.prototype;
  function i() {
  }
  i.prototype = t.prototype, e.prototype = new i();
  for (var n in r)
    r.hasOwnProperty(n) && (e.prototype[n] = r[n]);
  e.prototype.constructor = e, e.superClass = t;
}
function Ke(e, t, r) {
  if (e = "prototype" in e ? e.prototype : e, t = "prototype" in t ? t.prototype : t, Object.getOwnPropertyNames)
    for (var i = Object.getOwnPropertyNames(t), n = 0; n < i.length; n++) {
      var a = i[n];
      a !== "constructor" && e[a] == null && (e[a] = t[a]);
    }
  else
    ht(e, t);
}
function Yt(e) {
  return !e || typeof e == "string" ? !1 : typeof e.length == "number";
}
function D(e, t, r) {
  if (e && t)
    if (e.forEach && e.forEach === L0)
      e.forEach(t, r);
    else if (e.length === +e.length)
      for (var i = 0, n = e.length; i < n; i++)
        t.call(r, e[i], i, e);
    else
      for (var a in e)
        e.hasOwnProperty(a) && t.call(r, e[a], a, e);
}
function Q(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return lu(e);
  if (e.map && e.map === R0)
    return e.map(t, r);
  for (var i = [], n = 0, a = e.length; n < a; n++)
    i.push(t.call(r, e[n], n, e));
  return i;
}
function dr(e, t, r, i) {
  if (e && t) {
    for (var n = 0, a = e.length; n < a; n++)
      r = t.call(i, r, e[n], n, e);
    return r;
  }
}
function ge(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return lu(e);
  if (e.filter && e.filter === I0)
    return e.filter(t, r);
  for (var i = [], n = 0, a = e.length; n < a; n++)
    t.call(r, e[n], n, e) && i.push(e[n]);
  return i;
}
function pt(e) {
  if (!e)
    return [];
  if (Object.keys)
    return Object.keys(e);
  var t = [];
  for (var r in e)
    e.hasOwnProperty(r) && t.push(r);
  return t;
}
function N0(e, t) {
  for (var r = [], i = 2; i < arguments.length; i++)
    r[i - 2] = arguments[i];
  return function() {
    return e.apply(t, r.concat(ou.call(arguments)));
  };
}
var lt = ia && rt(ia.bind) ? ia.call.bind(ia.bind) : N0;
function Jt(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return function() {
    return e.apply(this, t.concat(ou.call(arguments)));
  };
}
function k(e) {
  return Array.isArray ? Array.isArray(e) : Vi.call(e) === "[object Array]";
}
function rt(e) {
  return typeof e == "function";
}
function z(e) {
  return typeof e == "string";
}
function ja(e) {
  return Vi.call(e) === "[object String]";
}
function yt(e) {
  return typeof e == "number";
}
function B(e) {
  var t = typeof e;
  return t === "function" || !!e && t === "object";
}
function uh(e) {
  return !!mv[Vi.call(e)];
}
function $t(e) {
  return !!yv[Vi.call(e)];
}
function Ii(e) {
  return typeof e == "object" && typeof e.nodeType == "number" && typeof e.ownerDocument == "object";
}
function Po(e) {
  return e.colorStops != null;
}
function $0(e) {
  return e.image != null;
}
function B0(e) {
  return Vi.call(e) === "[object RegExp]";
}
function bv(e) {
  return e !== e;
}
function Bn() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  for (var r = 0, i = e.length; r < i; r++)
    if (e[r] != null)
      return e[r];
}
function X(e, t) {
  return e ?? t;
}
function Sn(e, t, r) {
  return e ?? t ?? r;
}
function lu(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return ou.apply(e, t);
}
function Sv(e) {
  if (typeof e == "number")
    return [e, e, e, e];
  var t = e.length;
  return t === 2 ? [e[0], e[1], e[0], e[1]] : t === 3 ? [e[0], e[1], e[2], e[1]] : e;
}
function j(e, t) {
  if (!e)
    throw new Error(t);
}
function Pe(e) {
  return e == null ? null : typeof e.trim == "function" ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var Tv = "__ec_primitive__";
function ll(e) {
  e[Tv] = !0;
}
function Tn(e) {
  return e[Tv];
}
var F0 = (function() {
  function e() {
    this.data = {};
  }
  return e.prototype.delete = function(t) {
    var r = this.has(t);
    return r && delete this.data[t], r;
  }, e.prototype.has = function(t) {
    return this.data.hasOwnProperty(t);
  }, e.prototype.get = function(t) {
    return this.data[t];
  }, e.prototype.set = function(t, r) {
    return this.data[t] = r, this;
  }, e.prototype.keys = function() {
    return pt(this.data);
  }, e.prototype.forEach = function(t) {
    var r = this.data;
    for (var i in r)
      r.hasOwnProperty(i) && t(r[i], i);
  }, e;
})(), Cv = typeof Map == "function";
function V0() {
  return Cv ? /* @__PURE__ */ new Map() : new F0();
}
var z0 = (function() {
  function e(t) {
    var r = k(t);
    this.data = V0();
    var i = this;
    t instanceof e ? t.each(n) : t && D(t, n);
    function n(a, o) {
      r ? i.set(a, o) : i.set(o, a);
    }
  }
  return e.prototype.hasKey = function(t) {
    return this.data.has(t);
  }, e.prototype.get = function(t) {
    return this.data.get(t);
  }, e.prototype.set = function(t, r) {
    return this.data.set(t, r), r;
  }, e.prototype.each = function(t, r) {
    this.data.forEach(function(i, n) {
      t.call(r, i, n);
    });
  }, e.prototype.keys = function() {
    var t = this.data.keys();
    return Cv ? Array.from(t) : t;
  }, e.prototype.removeKey = function(t) {
    this.data.delete(t);
  }, e;
})();
function et(e) {
  return new z0(e);
}
function H0(e, t) {
  for (var r = new e.constructor(e.length + t.length), i = 0; i < e.length; i++)
    r[i] = e[i];
  for (var n = e.length, i = 0; i < t.length; i++)
    r[i + n] = t[i];
  return r;
}
function Lo(e, t) {
  var r;
  if (Object.create)
    r = Object.create(e);
  else {
    var i = function() {
    };
    i.prototype = e, r = new i();
  }
  return t && I(r, t), r;
}
function xv(e) {
  var t = e.style;
  t.webkitUserSelect = "none", t.userSelect = "none", t.webkitTapHighlightColor = "rgba(0,0,0,0)", t["-webkit-touch-callout"] = "none";
}
function Ri(e, t) {
  return e.hasOwnProperty(t);
}
function Gt() {
}
var U0 = 180 / Math.PI;
function zi(e, t) {
  return e == null && (e = 0), t == null && (t = 0), [e, t];
}
function G0(e) {
  return [e[0], e[1]];
}
function hh(e, t, r) {
  return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e;
}
function W0(e, t, r) {
  return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e;
}
function Y0(e) {
  return Math.sqrt(X0(e));
}
function X0(e) {
  return e[0] * e[0] + e[1] * e[1];
}
function qo(e, t, r) {
  return e[0] = t[0] * r, e[1] = t[1] * r, e;
}
function q0(e, t) {
  var r = Y0(t);
  return r === 0 ? (e[0] = 0, e[1] = 0) : (e[0] = t[0] / r, e[1] = t[1] / r), e;
}
function ul(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
var hl = ul;
function Z0(e, t) {
  return (e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]);
}
var Ti = Z0;
function Zo(e, t, r, i) {
  return e[0] = t[0] + i * (r[0] - t[0]), e[1] = t[1] + i * (r[1] - t[1]), e;
}
function Ie(e, t, r) {
  var i = t[0], n = t[1];
  return e[0] = r[0] * i + r[2] * n + r[4], e[1] = r[1] * i + r[3] * n + r[5], e;
}
function yi(e, t, r) {
  return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e;
}
function wi(e, t, r) {
  return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e;
}
var ri = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.target = t, this.topTarget = r && r.topTarget;
  }
  return e;
})(), K0 = (function() {
  function e(t) {
    this.handler = t, t.on("mousedown", this._dragStart, this), t.on("mousemove", this._drag, this), t.on("mouseup", this._dragEnd, this);
  }
  return e.prototype._dragStart = function(t) {
    for (var r = t.target; r && !r.draggable; )
      r = r.parent || r.__hostTarget;
    r && (this._draggingTarget = r, r.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.handler.dispatchToElement(new ri(r, t), "dragstart", t.event));
  }, e.prototype._drag = function(t) {
    var r = this._draggingTarget;
    if (r) {
      var i = t.offsetX, n = t.offsetY, a = i - this._x, o = n - this._y;
      this._x = i, this._y = n, r.drift(a, o, t), this.handler.dispatchToElement(new ri(r, t), "drag", t.event);
      var s = this.handler.findHover(i, n, r).target, l = this._dropTarget;
      this._dropTarget = s, r !== s && (l && s !== l && this.handler.dispatchToElement(new ri(l, t), "dragleave", t.event), s && s !== l && this.handler.dispatchToElement(new ri(s, t), "dragenter", t.event));
    }
  }, e.prototype._dragEnd = function(t) {
    var r = this._draggingTarget;
    r && (r.dragging = !1), this.handler.dispatchToElement(new ri(r, t), "dragend", t.event), this._dropTarget && this.handler.dispatchToElement(new ri(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;
  }, e;
})(), $e = (function() {
  function e(t) {
    t && (this._$eventProcessor = t);
  }
  return e.prototype.on = function(t, r, i, n) {
    this._$handlers || (this._$handlers = {});
    var a = this._$handlers;
    if (typeof r == "function" && (n = i, i = r, r = null), !i || !t)
      return this;
    var o = this._$eventProcessor;
    r != null && o && o.normalizeQuery && (r = o.normalizeQuery(r)), a[t] || (a[t] = []);
    for (var s = 0; s < a[t].length; s++)
      if (a[t][s].h === i)
        return this;
    var l = {
      h: i,
      query: r,
      ctx: n || this,
      callAtLast: i.zrEventfulCallAtLast
    }, u = a[t].length - 1, h = a[t][u];
    return h && h.callAtLast ? a[t].splice(u, 0, l) : a[t].push(l), this;
  }, e.prototype.isSilent = function(t) {
    var r = this._$handlers;
    return !r || !r[t] || !r[t].length;
  }, e.prototype.off = function(t, r) {
    var i = this._$handlers;
    if (!i)
      return this;
    if (!t)
      return this._$handlers = {}, this;
    if (r) {
      if (i[t]) {
        for (var n = [], a = 0, o = i[t].length; a < o; a++)
          i[t][a].h !== r && n.push(i[t][a]);
        i[t] = n;
      }
      i[t] && i[t].length === 0 && delete i[t];
    } else
      delete i[t];
    return this;
  }, e.prototype.trigger = function(t) {
    for (var r = [], i = 1; i < arguments.length; i++)
      r[i - 1] = arguments[i];
    if (!this._$handlers)
      return this;
    var n = this._$handlers[t], a = this._$eventProcessor;
    if (n)
      for (var o = r.length, s = n.length, l = 0; l < s; l++) {
        var u = n[l];
        if (!(a && a.filter && u.query != null && !a.filter(t, u.query)))
          switch (o) {
            case 0:
              u.h.call(u.ctx);
              break;
            case 1:
              u.h.call(u.ctx, r[0]);
              break;
            case 2:
              u.h.call(u.ctx, r[0], r[1]);
              break;
            default:
              u.h.apply(u.ctx, r);
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, e.prototype.triggerWithContext = function(t) {
    for (var r = [], i = 1; i < arguments.length; i++)
      r[i - 1] = arguments[i];
    if (!this._$handlers)
      return this;
    var n = this._$handlers[t], a = this._$eventProcessor;
    if (n)
      for (var o = r.length, s = r[o - 1], l = n.length, u = 0; u < l; u++) {
        var h = n[u];
        if (!(a && a.filter && h.query != null && !a.filter(t, h.query)))
          switch (o) {
            case 0:
              h.h.call(s);
              break;
            case 1:
              h.h.call(s, r[0]);
              break;
            case 2:
              h.h.call(s, r[0], r[1]);
              break;
            default:
              h.h.apply(s, r.slice(1, o - 1));
              break;
          }
      }
    return a && a.afterTrigger && a.afterTrigger(t), this;
  }, e;
})(), j0 = Math.log(2);
function fl(e, t, r, i, n, a) {
  var o = i + "-" + n, s = e.length;
  if (a.hasOwnProperty(o))
    return a[o];
  if (t === 1) {
    var l = Math.round(Math.log((1 << s) - 1 & ~n) / j0);
    return e[r][l];
  }
  for (var u = i | 1 << r, h = r + 1; i & 1 << h; )
    h++;
  for (var f = 0, c = 0, v = 0; c < s; c++) {
    var d = 1 << c;
    d & n || (f += (v % 2 ? -1 : 1) * e[r][c] * fl(e, t - 1, h, u, n | d, a), v++);
  }
  return a[o] = f, f;
}
function fh(e, t) {
  var r = [
    [e[0], e[1], 1, 0, 0, 0, -t[0] * e[0], -t[0] * e[1]],
    [0, 0, 0, e[0], e[1], 1, -t[1] * e[0], -t[1] * e[1]],
    [e[2], e[3], 1, 0, 0, 0, -t[2] * e[2], -t[2] * e[3]],
    [0, 0, 0, e[2], e[3], 1, -t[3] * e[2], -t[3] * e[3]],
    [e[4], e[5], 1, 0, 0, 0, -t[4] * e[4], -t[4] * e[5]],
    [0, 0, 0, e[4], e[5], 1, -t[5] * e[4], -t[5] * e[5]],
    [e[6], e[7], 1, 0, 0, 0, -t[6] * e[6], -t[6] * e[7]],
    [0, 0, 0, e[6], e[7], 1, -t[7] * e[6], -t[7] * e[7]]
  ], i = {}, n = fl(r, 8, 0, 0, 0, i);
  if (n !== 0) {
    for (var a = [], o = 0; o < 8; o++)
      for (var s = 0; s < 8; s++)
        a[s] == null && (a[s] = 0), a[s] += ((o + s) % 2 ? -1 : 1) * fl(r, 7, o === 0 ? 1 : 0, 1 << o, 1 << s, i) / n * t[o];
    return function(l, u, h) {
      var f = u * a[6] + h * a[7] + 1;
      l[0] = (u * a[0] + h * a[1] + a[2]) / f, l[1] = (u * a[3] + h * a[4] + a[5]) / f;
    };
  }
}
var ch = "___zrEVENTSAVED", Ko = [];
function Q0(e, t, r, i, n) {
  return cl(Ko, t, i, n, !0) && cl(e, r, Ko[0], Ko[1]);
}
function cl(e, t, r, i, n) {
  if (t.getBoundingClientRect && V.domSupported && !Dv(t)) {
    var a = t[ch] || (t[ch] = {}), o = J0(t, a), s = tw(o, a, n);
    if (s)
      return s(e, r, i), !0;
  }
  return !1;
}
function J0(e, t) {
  var r = t.markers;
  if (r)
    return r;
  r = t.markers = [];
  for (var i = ["left", "right"], n = ["top", "bottom"], a = 0; a < 4; a++) {
    var o = document.createElement("div"), s = o.style, l = a % 2, u = (a >> 1) % 2;
    s.cssText = [
      "position: absolute",
      "visibility: hidden",
      "padding: 0",
      "margin: 0",
      "border-width: 0",
      "user-select: none",
      "width:0",
      "height:0",
      i[l] + ":0",
      n[u] + ":0",
      i[1 - l] + ":auto",
      n[1 - u] + ":auto",
      ""
    ].join("!important;"), e.appendChild(o), r.push(o);
  }
  return r;
}
function tw(e, t, r) {
  for (var i = r ? "invTrans" : "trans", n = t[i], a = t.srcCoords, o = [], s = [], l = !0, u = 0; u < 4; u++) {
    var h = e[u].getBoundingClientRect(), f = 2 * u, c = h.left, v = h.top;
    o.push(c, v), l = l && a && c === a[f] && v === a[f + 1], s.push(e[u].offsetLeft, e[u].offsetTop);
  }
  return l && n ? n : (t.srcCoords = o, t[i] = r ? fh(s, o) : fh(o, s));
}
function Dv(e) {
  return e.nodeName.toUpperCase() === "CANVAS";
}
var ew = /([&<>"'])/g, rw = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Vt(e) {
  return e == null ? "" : (e + "").replace(ew, function(t, r) {
    return rw[r];
  });
}
var iw = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, jo = [], nw = V.browser.firefox && +V.browser.version.split(".")[0] < 39;
function vl(e, t, r, i) {
  return r = r || {}, i ? vh(e, t, r) : nw && t.layerX != null && t.layerX !== t.offsetX ? (r.zrX = t.layerX, r.zrY = t.layerY) : t.offsetX != null ? (r.zrX = t.offsetX, r.zrY = t.offsetY) : vh(e, t, r), r;
}
function vh(e, t, r) {
  if (V.domSupported && e.getBoundingClientRect) {
    var i = t.clientX, n = t.clientY;
    if (Dv(e)) {
      var a = e.getBoundingClientRect();
      r.zrX = i - a.left, r.zrY = n - a.top;
      return;
    } else if (cl(jo, e, i, n)) {
      r.zrX = jo[0], r.zrY = jo[1];
      return;
    }
  }
  r.zrX = r.zrY = 0;
}
function uu(e) {
  return e || window.event;
}
function oe(e, t, r) {
  if (t = uu(t), t.zrX != null)
    return t;
  var i = t.type, n = i && i.indexOf("touch") >= 0;
  if (n) {
    var o = i !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && vl(e, o, t, r);
  } else {
    vl(e, t, t, r);
    var a = aw(t);
    t.zrDelta = a ? a / 120 : -(t.detail || 0) / 3;
  }
  var s = t.button;
  return t.which == null && s !== void 0 && iw.test(t.type) && (t.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), t;
}
function aw(e) {
  var t = e.wheelDelta;
  if (t)
    return t;
  var r = e.deltaX, i = e.deltaY;
  if (r == null || i == null)
    return t;
  var n = Math.abs(i !== 0 ? i : r), a = i > 0 ? -1 : i < 0 ? 1 : r > 0 ? -1 : 1;
  return 3 * n * a;
}
function ow(e, t, r, i) {
  e.addEventListener(t, r, i);
}
function sw(e, t, r, i) {
  e.removeEventListener(t, r, i);
}
var Ev = function(e) {
  e.preventDefault(), e.stopPropagation(), e.cancelBubble = !0;
}, lw = (function() {
  function e() {
    this._track = [];
  }
  return e.prototype.recognize = function(t, r, i) {
    return this._doTrack(t, r, i), this._recognize(t);
  }, e.prototype.clear = function() {
    return this._track.length = 0, this;
  }, e.prototype._doTrack = function(t, r, i) {
    var n = t.touches;
    if (n) {
      for (var a = {
        points: [],
        touches: [],
        target: r,
        event: t
      }, o = 0, s = n.length; o < s; o++) {
        var l = n[o], u = vl(i, l, {});
        a.points.push([u.zrX, u.zrY]), a.touches.push(l);
      }
      this._track.push(a);
    }
  }, e.prototype._recognize = function(t) {
    for (var r in Qo)
      if (Qo.hasOwnProperty(r)) {
        var i = Qo[r](this._track, t);
        if (i)
          return i;
      }
  }, e;
})();
function dh(e) {
  var t = e[1][0] - e[0][0], r = e[1][1] - e[0][1];
  return Math.sqrt(t * t + r * r);
}
function uw(e) {
  return [
    (e[0][0] + e[1][0]) / 2,
    (e[0][1] + e[1][1]) / 2
  ];
}
var Qo = {
  pinch: function(e, t) {
    var r = e.length;
    if (r) {
      var i = (e[r - 1] || {}).points, n = (e[r - 2] || {}).points || i;
      if (n && n.length > 1 && i && i.length > 1) {
        var a = dh(i) / dh(n);
        !isFinite(a) && (a = 1), t.pinchScale = a;
        var o = uw(i);
        return t.pinchX = o[0], t.pinchY = o[1], {
          type: "pinch",
          target: e[0].target,
          event: t
        };
      }
    }
  }
};
function Ci() {
  return [1, 0, 0, 1, 0, 0];
}
function hu(e) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
}
function hw(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e;
}
function xi(e, t, r) {
  var i = t[0] * r[0] + t[2] * r[1], n = t[1] * r[0] + t[3] * r[1], a = t[0] * r[2] + t[2] * r[3], o = t[1] * r[2] + t[3] * r[3], s = t[0] * r[4] + t[2] * r[5] + t[4], l = t[1] * r[4] + t[3] * r[5] + t[5];
  return e[0] = i, e[1] = n, e[2] = a, e[3] = o, e[4] = s, e[5] = l, e;
}
function dl(e, t, r) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4] + r[0], e[5] = t[5] + r[1], e;
}
function fu(e, t, r, i) {
  i === void 0 && (i = [0, 0]);
  var n = t[0], a = t[2], o = t[4], s = t[1], l = t[3], u = t[5], h = Math.sin(r), f = Math.cos(r);
  return e[0] = n * f + s * h, e[1] = -n * h + s * f, e[2] = a * f + l * h, e[3] = -a * h + f * l, e[4] = f * (o - i[0]) + h * (u - i[1]) + i[0], e[5] = f * (u - i[1]) - h * (o - i[0]) + i[1], e;
}
function fw(e, t, r) {
  var i = r[0], n = r[1];
  return e[0] = t[0] * i, e[1] = t[1] * n, e[2] = t[2] * i, e[3] = t[3] * n, e[4] = t[4] * i, e[5] = t[5] * n, e;
}
function Av(e, t) {
  var r = t[0], i = t[2], n = t[4], a = t[1], o = t[3], s = t[5], l = r * o - a * i;
  return l ? (l = 1 / l, e[0] = o * l, e[1] = -a * l, e[2] = -i * l, e[3] = r * l, e[4] = (i * s - o * n) * l, e[5] = (a * n - r * s) * l, e) : null;
}
var G = (function() {
  function e(t, r) {
    this.x = t || 0, this.y = r || 0;
  }
  return e.prototype.copy = function(t) {
    return this.x = t.x, this.y = t.y, this;
  }, e.prototype.clone = function() {
    return new e(this.x, this.y);
  }, e.prototype.set = function(t, r) {
    return this.x = t, this.y = r, this;
  }, e.prototype.equal = function(t) {
    return t.x === this.x && t.y === this.y;
  }, e.prototype.add = function(t) {
    return this.x += t.x, this.y += t.y, this;
  }, e.prototype.scale = function(t) {
    this.x *= t, this.y *= t;
  }, e.prototype.scaleAndAdd = function(t, r) {
    this.x += t.x * r, this.y += t.y * r;
  }, e.prototype.sub = function(t) {
    return this.x -= t.x, this.y -= t.y, this;
  }, e.prototype.dot = function(t) {
    return this.x * t.x + this.y * t.y;
  }, e.prototype.len = function() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }, e.prototype.lenSquare = function() {
    return this.x * this.x + this.y * this.y;
  }, e.prototype.normalize = function() {
    var t = this.len();
    return this.x /= t, this.y /= t, this;
  }, e.prototype.distance = function(t) {
    var r = this.x - t.x, i = this.y - t.y;
    return Math.sqrt(r * r + i * i);
  }, e.prototype.distanceSquare = function(t) {
    var r = this.x - t.x, i = this.y - t.y;
    return r * r + i * i;
  }, e.prototype.negate = function() {
    return this.x = -this.x, this.y = -this.y, this;
  }, e.prototype.transform = function(t) {
    if (t) {
      var r = this.x, i = this.y;
      return this.x = t[0] * r + t[2] * i + t[4], this.y = t[1] * r + t[3] * i + t[5], this;
    }
  }, e.prototype.toArray = function(t) {
    return t[0] = this.x, t[1] = this.y, t;
  }, e.prototype.fromArray = function(t) {
    this.x = t[0], this.y = t[1];
  }, e.set = function(t, r, i) {
    t.x = r, t.y = i;
  }, e.copy = function(t, r) {
    t.x = r.x, t.y = r.y;
  }, e.len = function(t) {
    return Math.sqrt(t.x * t.x + t.y * t.y);
  }, e.lenSquare = function(t) {
    return t.x * t.x + t.y * t.y;
  }, e.dot = function(t, r) {
    return t.x * r.x + t.y * r.y;
  }, e.add = function(t, r, i) {
    t.x = r.x + i.x, t.y = r.y + i.y;
  }, e.sub = function(t, r, i) {
    t.x = r.x - i.x, t.y = r.y - i.y;
  }, e.scale = function(t, r, i) {
    t.x = r.x * i, t.y = r.y * i;
  }, e.scaleAndAdd = function(t, r, i, n) {
    t.x = r.x + i.x * n, t.y = r.y + i.y * n;
  }, e.lerp = function(t, r, i, n) {
    var a = 1 - n;
    t.x = a * r.x + n * i.x, t.y = a * r.y + n * i.y;
  }, e;
})(), na = Math.min, aa = Math.max, yr = new G(), wr = new G(), br = new G(), Sr = new G(), qi = new G(), Zi = new G(), at = (function() {
  function e(t, r, i, n) {
    i < 0 && (t = t + i, i = -i), n < 0 && (r = r + n, n = -n), this.x = t, this.y = r, this.width = i, this.height = n;
  }
  return e.prototype.union = function(t) {
    var r = na(t.x, this.x), i = na(t.y, this.y);
    isFinite(this.x) && isFinite(this.width) ? this.width = aa(t.x + t.width, this.x + this.width) - r : this.width = t.width, isFinite(this.y) && isFinite(this.height) ? this.height = aa(t.y + t.height, this.y + this.height) - i : this.height = t.height, this.x = r, this.y = i;
  }, e.prototype.applyTransform = function(t) {
    e.applyTransform(this, this, t);
  }, e.prototype.calculateTransform = function(t) {
    var r = this, i = t.width / r.width, n = t.height / r.height, a = Ci();
    return dl(a, a, [-r.x, -r.y]), fw(a, a, [i, n]), dl(a, a, [t.x, t.y]), a;
  }, e.prototype.intersect = function(t, r) {
    if (!t)
      return !1;
    t instanceof e || (t = e.create(t));
    var i = this, n = i.x, a = i.x + i.width, o = i.y, s = i.y + i.height, l = t.x, u = t.x + t.width, h = t.y, f = t.y + t.height, c = !(a < l || u < n || s < h || f < o);
    if (r) {
      var v = 1 / 0, d = 0, _ = Math.abs(a - l), p = Math.abs(u - n), g = Math.abs(s - h), m = Math.abs(f - o), y = Math.min(_, p), w = Math.min(g, m);
      a < l || u < n ? y > d && (d = y, _ < p ? G.set(Zi, -_, 0) : G.set(Zi, p, 0)) : y < v && (v = y, _ < p ? G.set(qi, _, 0) : G.set(qi, -p, 0)), s < h || f < o ? w > d && (d = w, g < m ? G.set(Zi, 0, -g) : G.set(Zi, 0, m)) : y < v && (v = y, g < m ? G.set(qi, 0, g) : G.set(qi, 0, -m));
    }
    return r && G.copy(r, c ? qi : Zi), c;
  }, e.prototype.contain = function(t, r) {
    var i = this;
    return t >= i.x && t <= i.x + i.width && r >= i.y && r <= i.y + i.height;
  }, e.prototype.clone = function() {
    return new e(this.x, this.y, this.width, this.height);
  }, e.prototype.copy = function(t) {
    e.copy(this, t);
  }, e.prototype.plain = function() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }, e.prototype.isFinite = function() {
    return isFinite(this.x) && isFinite(this.y) && isFinite(this.width) && isFinite(this.height);
  }, e.prototype.isZero = function() {
    return this.width === 0 || this.height === 0;
  }, e.create = function(t) {
    return new e(t.x, t.y, t.width, t.height);
  }, e.copy = function(t, r) {
    t.x = r.x, t.y = r.y, t.width = r.width, t.height = r.height;
  }, e.applyTransform = function(t, r, i) {
    if (!i) {
      t !== r && e.copy(t, r);
      return;
    }
    if (i[1] < 1e-5 && i[1] > -1e-5 && i[2] < 1e-5 && i[2] > -1e-5) {
      var n = i[0], a = i[3], o = i[4], s = i[5];
      t.x = r.x * n + o, t.y = r.y * a + s, t.width = r.width * n, t.height = r.height * a, t.width < 0 && (t.x += t.width, t.width = -t.width), t.height < 0 && (t.y += t.height, t.height = -t.height);
      return;
    }
    yr.x = br.x = r.x, yr.y = Sr.y = r.y, wr.x = Sr.x = r.x + r.width, wr.y = br.y = r.y + r.height, yr.transform(i), Sr.transform(i), wr.transform(i), br.transform(i), t.x = na(yr.x, wr.x, br.x, Sr.x), t.y = na(yr.y, wr.y, br.y, Sr.y);
    var l = aa(yr.x, wr.x, br.x, Sr.x), u = aa(yr.y, wr.y, br.y, Sr.y);
    t.width = l - t.x, t.height = u - t.y;
  }, e;
})(), Mv = "silent";
function cw(e, t, r) {
  return {
    type: e,
    event: r,
    target: t.target,
    topTarget: t.topTarget,
    cancelBubble: !1,
    offsetX: r.zrX,
    offsetY: r.zrY,
    gestureEvent: r.gestureEvent,
    pinchX: r.pinchX,
    pinchY: r.pinchY,
    pinchScale: r.pinchScale,
    wheelDelta: r.zrDelta,
    zrByTouch: r.zrByTouch,
    which: r.which,
    stop: vw
  };
}
function vw() {
  Ev(this.event);
}
var dw = (function(e) {
  W(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.handler = null, r;
  }
  return t.prototype.dispose = function() {
  }, t.prototype.setCursor = function() {
  }, t;
})($e), Ki = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.x = t, this.y = r;
  }
  return e;
})(), pw = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
], Jo = new at(0, 0, 0, 0), Pv = (function(e) {
  W(t, e);
  function t(r, i, n, a, o) {
    var s = e.call(this) || this;
    return s._hovered = new Ki(0, 0), s.storage = r, s.painter = i, s.painterRoot = a, s._pointerSize = o, n = n || new dw(), s.proxy = null, s.setHandlerProxy(n), s._draggingMgr = new K0(s), s;
  }
  return t.prototype.setHandlerProxy = function(r) {
    this.proxy && this.proxy.dispose(), r && (D(pw, function(i) {
      r.on && r.on(i, this[i], this);
    }, this), r.handler = this), this.proxy = r;
  }, t.prototype.mousemove = function(r) {
    var i = r.zrX, n = r.zrY, a = Lv(this, i, n), o = this._hovered, s = o.target;
    s && !s.__zr && (o = this.findHover(o.x, o.y), s = o.target);
    var l = this._hovered = a ? new Ki(i, n) : this.findHover(i, n), u = l.target, h = this.proxy;
    h.setCursor && h.setCursor(u ? u.cursor : "default"), s && u !== s && this.dispatchToElement(o, "mouseout", r), this.dispatchToElement(l, "mousemove", r), u && u !== s && this.dispatchToElement(l, "mouseover", r);
  }, t.prototype.mouseout = function(r) {
    var i = r.zrEventControl;
    i !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", r), i !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: r });
  }, t.prototype.resize = function() {
    this._hovered = new Ki(0, 0);
  }, t.prototype.dispatch = function(r, i) {
    var n = this[r];
    n && n.call(this, i);
  }, t.prototype.dispose = function() {
    this.proxy.dispose(), this.storage = null, this.proxy = null, this.painter = null;
  }, t.prototype.setCursorStyle = function(r) {
    var i = this.proxy;
    i.setCursor && i.setCursor(r);
  }, t.prototype.dispatchToElement = function(r, i, n) {
    r = r || {};
    var a = r.target;
    if (!(a && a.silent)) {
      for (var o = "on" + i, s = cw(i, r, n); a && (a[o] && (s.cancelBubble = !!a[o].call(a, s)), a.trigger(i, s), a = a.__hostTarget ? a.__hostTarget : a.parent, !s.cancelBubble); )
        ;
      s.cancelBubble || (this.trigger(i, s), this.painter && this.painter.eachOtherLayer && this.painter.eachOtherLayer(function(l) {
        typeof l[o] == "function" && l[o].call(l, s), l.trigger && l.trigger(i, s);
      }));
    }
  }, t.prototype.findHover = function(r, i, n) {
    var a = this.storage.getDisplayList(), o = new Ki(r, i);
    if (ph(a, o, r, i, n), this._pointerSize && !o.target) {
      for (var s = [], l = this._pointerSize, u = l / 2, h = new at(r - u, i - u, l, l), f = a.length - 1; f >= 0; f--) {
        var c = a[f];
        c !== n && !c.ignore && !c.ignoreCoarsePointer && (!c.parent || !c.parent.ignoreCoarsePointer) && (Jo.copy(c.getBoundingRect()), c.transform && Jo.applyTransform(c.transform), Jo.intersect(h) && s.push(c));
      }
      if (s.length)
        for (var v = 4, d = Math.PI / 12, _ = Math.PI * 2, p = 0; p < u; p += v)
          for (var g = 0; g < _; g += d) {
            var m = r + p * Math.cos(g), y = i + p * Math.sin(g);
            if (ph(s, o, m, y, n), o.target)
              return o;
          }
    }
    return o;
  }, t.prototype.processGesture = function(r, i) {
    this._gestureMgr || (this._gestureMgr = new lw());
    var n = this._gestureMgr;
    i === "start" && n.clear();
    var a = n.recognize(r, this.findHover(r.zrX, r.zrY, null).target, this.proxy.dom);
    if (i === "end" && n.clear(), a) {
      var o = a.type;
      r.gestureEvent = o;
      var s = new Ki();
      s.target = a.target, this.dispatchToElement(s, o, a.event);
    }
  }, t;
})($e);
D(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(e) {
  Pv.prototype[e] = function(t) {
    var r = t.zrX, i = t.zrY, n = Lv(this, r, i), a, o;
    if ((e !== "mouseup" || !n) && (a = this.findHover(r, i), o = a.target), e === "mousedown")
      this._downEl = o, this._downPoint = [t.zrX, t.zrY], this._upEl = o;
    else if (e === "mouseup")
      this._upEl = o;
    else if (e === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || hl(this._downPoint, [t.zrX, t.zrY]) > 4)
        return;
      this._downPoint = null;
    }
    this.dispatchToElement(a, e, t);
  };
});
function gw(e, t, r) {
  if (e[e.rectHover ? "rectContain" : "contain"](t, r)) {
    for (var i = e, n = void 0, a = !1; i; ) {
      if (i.ignoreClip && (a = !0), !a) {
        var o = i.getClipPath();
        if (o && !o.contain(t, r))
          return !1;
      }
      i.silent && (n = !0);
      var s = i.__hostTarget;
      i = s || i.parent;
    }
    return n ? Mv : !0;
  }
  return !1;
}
function ph(e, t, r, i, n) {
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a], s = void 0;
    if (o !== n && !o.ignore && (s = gw(o, r, i)) && (!t.topTarget && (t.topTarget = o), s !== Mv)) {
      t.target = o;
      break;
    }
  }
}
function Lv(e, t, r) {
  var i = e.painter;
  return t < 0 || t > i.getWidth() || r < 0 || r > i.getHeight();
}
var Iv = 32, ji = 7;
function _w(e) {
  for (var t = 0; e >= Iv; )
    t |= e & 1, e >>= 1;
  return e + t;
}
function gh(e, t, r, i) {
  var n = t + 1;
  if (n === r)
    return 1;
  if (i(e[n++], e[t]) < 0) {
    for (; n < r && i(e[n], e[n - 1]) < 0; )
      n++;
    mw(e, t, n);
  } else
    for (; n < r && i(e[n], e[n - 1]) >= 0; )
      n++;
  return n - t;
}
function mw(e, t, r) {
  for (r--; t < r; ) {
    var i = e[t];
    e[t++] = e[r], e[r--] = i;
  }
}
function _h(e, t, r, i, n) {
  for (i === t && i++; i < r; i++) {
    for (var a = e[i], o = t, s = i, l; o < s; )
      l = o + s >>> 1, n(a, e[l]) < 0 ? s = l : o = l + 1;
    var u = i - o;
    switch (u) {
      case 3:
        e[o + 3] = e[o + 2];
      case 2:
        e[o + 2] = e[o + 1];
      case 1:
        e[o + 1] = e[o];
        break;
      default:
        for (; u > 0; )
          e[o + u] = e[o + u - 1], u--;
    }
    e[o] = a;
  }
}
function ts(e, t, r, i, n, a) {
  var o = 0, s = 0, l = 1;
  if (a(e, t[r + n]) > 0) {
    for (s = i - n; l < s && a(e, t[r + n + l]) > 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s), o += n, l += n;
  } else {
    for (s = n + 1; l < s && a(e, t[r + n - l]) <= 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s);
    var u = o;
    o = n - l, l = n - u;
  }
  for (o++; o < l; ) {
    var h = o + (l - o >>> 1);
    a(e, t[r + h]) > 0 ? o = h + 1 : l = h;
  }
  return l;
}
function es(e, t, r, i, n, a) {
  var o = 0, s = 0, l = 1;
  if (a(e, t[r + n]) < 0) {
    for (s = n + 1; l < s && a(e, t[r + n - l]) < 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s);
    var u = o;
    o = n - l, l = n - u;
  } else {
    for (s = i - n; l < s && a(e, t[r + n + l]) >= 0; )
      o = l, l = (l << 1) + 1, l <= 0 && (l = s);
    l > s && (l = s), o += n, l += n;
  }
  for (o++; o < l; ) {
    var h = o + (l - o >>> 1);
    a(e, t[r + h]) < 0 ? l = h : o = h + 1;
  }
  return l;
}
function yw(e, t) {
  var r = ji, i, n, a = 0, o = [];
  i = [], n = [];
  function s(v, d) {
    i[a] = v, n[a] = d, a += 1;
  }
  function l() {
    for (; a > 1; ) {
      var v = a - 2;
      if (v >= 1 && n[v - 1] <= n[v] + n[v + 1] || v >= 2 && n[v - 2] <= n[v] + n[v - 1])
        n[v - 1] < n[v + 1] && v--;
      else if (n[v] > n[v + 1])
        break;
      h(v);
    }
  }
  function u() {
    for (; a > 1; ) {
      var v = a - 2;
      v > 0 && n[v - 1] < n[v + 1] && v--, h(v);
    }
  }
  function h(v) {
    var d = i[v], _ = n[v], p = i[v + 1], g = n[v + 1];
    n[v] = _ + g, v === a - 3 && (i[v + 1] = i[v + 2], n[v + 1] = n[v + 2]), a--;
    var m = es(e[p], e, d, _, 0, t);
    d += m, _ -= m, _ !== 0 && (g = ts(e[d + _ - 1], e, p, g, g - 1, t), g !== 0 && (_ <= g ? f(d, _, p, g) : c(d, _, p, g)));
  }
  function f(v, d, _, p) {
    var g = 0;
    for (g = 0; g < d; g++)
      o[g] = e[v + g];
    var m = 0, y = _, w = v;
    if (e[w++] = e[y++], --p === 0) {
      for (g = 0; g < d; g++)
        e[w + g] = o[m + g];
      return;
    }
    if (d === 1) {
      for (g = 0; g < p; g++)
        e[w + g] = e[y + g];
      e[w + p] = o[m];
      return;
    }
    for (var S = r, b, T, C; ; ) {
      b = 0, T = 0, C = !1;
      do
        if (t(e[y], o[m]) < 0) {
          if (e[w++] = e[y++], T++, b = 0, --p === 0) {
            C = !0;
            break;
          }
        } else if (e[w++] = o[m++], b++, T = 0, --d === 1) {
          C = !0;
          break;
        }
      while ((b | T) < S);
      if (C)
        break;
      do {
        if (b = es(e[y], o, m, d, 0, t), b !== 0) {
          for (g = 0; g < b; g++)
            e[w + g] = o[m + g];
          if (w += b, m += b, d -= b, d <= 1) {
            C = !0;
            break;
          }
        }
        if (e[w++] = e[y++], --p === 0) {
          C = !0;
          break;
        }
        if (T = ts(o[m], e, y, p, 0, t), T !== 0) {
          for (g = 0; g < T; g++)
            e[w + g] = e[y + g];
          if (w += T, y += T, p -= T, p === 0) {
            C = !0;
            break;
          }
        }
        if (e[w++] = o[m++], --d === 1) {
          C = !0;
          break;
        }
        S--;
      } while (b >= ji || T >= ji);
      if (C)
        break;
      S < 0 && (S = 0), S += 2;
    }
    if (r = S, r < 1 && (r = 1), d === 1) {
      for (g = 0; g < p; g++)
        e[w + g] = e[y + g];
      e[w + p] = o[m];
    } else {
      if (d === 0)
        throw new Error();
      for (g = 0; g < d; g++)
        e[w + g] = o[m + g];
    }
  }
  function c(v, d, _, p) {
    var g = 0;
    for (g = 0; g < p; g++)
      o[g] = e[_ + g];
    var m = v + d - 1, y = p - 1, w = _ + p - 1, S = 0, b = 0;
    if (e[w--] = e[m--], --d === 0) {
      for (S = w - (p - 1), g = 0; g < p; g++)
        e[S + g] = o[g];
      return;
    }
    if (p === 1) {
      for (w -= d, m -= d, b = w + 1, S = m + 1, g = d - 1; g >= 0; g--)
        e[b + g] = e[S + g];
      e[w] = o[y];
      return;
    }
    for (var T = r; ; ) {
      var C = 0, x = 0, E = !1;
      do
        if (t(o[y], e[m]) < 0) {
          if (e[w--] = e[m--], C++, x = 0, --d === 0) {
            E = !0;
            break;
          }
        } else if (e[w--] = o[y--], x++, C = 0, --p === 1) {
          E = !0;
          break;
        }
      while ((C | x) < T);
      if (E)
        break;
      do {
        if (C = d - es(o[y], e, v, d, d - 1, t), C !== 0) {
          for (w -= C, m -= C, d -= C, b = w + 1, S = m + 1, g = C - 1; g >= 0; g--)
            e[b + g] = e[S + g];
          if (d === 0) {
            E = !0;
            break;
          }
        }
        if (e[w--] = o[y--], --p === 1) {
          E = !0;
          break;
        }
        if (x = p - ts(e[m], o, 0, p, p - 1, t), x !== 0) {
          for (w -= x, y -= x, p -= x, b = w + 1, S = y + 1, g = 0; g < x; g++)
            e[b + g] = o[S + g];
          if (p <= 1) {
            E = !0;
            break;
          }
        }
        if (e[w--] = e[m--], --d === 0) {
          E = !0;
          break;
        }
        T--;
      } while (C >= ji || x >= ji);
      if (E)
        break;
      T < 0 && (T = 0), T += 2;
    }
    if (r = T, r < 1 && (r = 1), p === 1) {
      for (w -= d, m -= d, b = w + 1, S = m + 1, g = d - 1; g >= 0; g--)
        e[b + g] = e[S + g];
      e[w] = o[y];
    } else {
      if (p === 0)
        throw new Error();
      for (S = w - (p - 1), g = 0; g < p; g++)
        e[S + g] = o[g];
    }
  }
  return {
    mergeRuns: l,
    forceMergeRuns: u,
    pushRun: s
  };
}
function ka(e, t, r, i) {
  r || (r = 0), i || (i = e.length);
  var n = i - r;
  if (!(n < 2)) {
    var a = 0;
    if (n < Iv) {
      a = gh(e, r, i, t), _h(e, r, i, r + a, t);
      return;
    }
    var o = yw(e, t), s = _w(n);
    do {
      if (a = gh(e, r, i, t), a < s) {
        var l = n;
        l > s && (l = s), _h(e, r, r + l, r + a, t), a = l;
      }
      o.pushRun(r, a), o.mergeRuns(), n -= a, r += a;
    } while (n !== 0);
    o.forceMergeRuns();
  }
}
var Qt = 1, dn = 2, _i = 4, mh = !1;
function rs() {
  mh || (mh = !0, console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function yh(e, t) {
  return e.zlevel === t.zlevel ? e.z === t.z ? e.z2 - t.z2 : e.z - t.z : e.zlevel - t.zlevel;
}
var ww = (function() {
  function e() {
    this._roots = [], this._displayList = [], this._displayListLen = 0, this.displayableSortFunc = yh;
  }
  return e.prototype.traverse = function(t, r) {
    for (var i = 0; i < this._roots.length; i++)
      this._roots[i].traverse(t, r);
  }, e.prototype.getDisplayList = function(t, r) {
    r = r || !1;
    var i = this._displayList;
    return (t || !i.length) && this.updateDisplayList(r), i;
  }, e.prototype.updateDisplayList = function(t) {
    this._displayListLen = 0;
    for (var r = this._roots, i = this._displayList, n = 0, a = r.length; n < a; n++)
      this._updateAndAddDisplayable(r[n], null, t);
    i.length = this._displayListLen, ka(i, yh);
  }, e.prototype._updateAndAddDisplayable = function(t, r, i) {
    if (!(t.ignore && !i)) {
      t.beforeUpdate(), t.update(), t.afterUpdate();
      var n = t.getClipPath();
      if (t.ignoreClip)
        r = null;
      else if (n) {
        r ? r = r.slice() : r = [];
        for (var a = n, o = t; a; )
          a.parent = o, a.updateTransform(), r.push(a), o = a, a = a.getClipPath();
      }
      if (t.childrenRef) {
        for (var s = t.childrenRef(), l = 0; l < s.length; l++) {
          var u = s[l];
          t.__dirty && (u.__dirty |= Qt), this._updateAndAddDisplayable(u, r, i);
        }
        t.__dirty = 0;
      } else {
        var h = t;
        r && r.length ? h.__clipPaths = r : h.__clipPaths && h.__clipPaths.length > 0 && (h.__clipPaths = []), isNaN(h.z) && (rs(), h.z = 0), isNaN(h.z2) && (rs(), h.z2 = 0), isNaN(h.zlevel) && (rs(), h.zlevel = 0), this._displayList[this._displayListLen++] = h;
      }
      var f = t.getDecalElement && t.getDecalElement();
      f && this._updateAndAddDisplayable(f, r, i);
      var c = t.getTextGuideLine();
      c && this._updateAndAddDisplayable(c, r, i);
      var v = t.getTextContent();
      v && this._updateAndAddDisplayable(v, r, i);
    }
  }, e.prototype.addRoot = function(t) {
    t.__zr && t.__zr.storage === this || this._roots.push(t);
  }, e.prototype.delRoot = function(t) {
    if (t instanceof Array) {
      for (var r = 0, i = t.length; r < i; r++)
        this.delRoot(t[r]);
      return;
    }
    var n = st(this._roots, t);
    n >= 0 && this._roots.splice(n, 1);
  }, e.prototype.delAllRoots = function() {
    this._roots = [], this._displayList = [], this._displayListLen = 0;
  }, e.prototype.getRoots = function() {
    return this._roots;
  }, e.prototype.dispose = function() {
    this._displayList = null, this._roots = null;
  }, e;
})(), Qa;
Qa = V.hasGlobalWindow && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function(e) {
  return setTimeout(e, 16);
};
var Cn = {
  linear: function(e) {
    return e;
  },
  quadraticIn: function(e) {
    return e * e;
  },
  quadraticOut: function(e) {
    return e * (2 - e);
  },
  quadraticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e : -0.5 * (--e * (e - 2) - 1);
  },
  cubicIn: function(e) {
    return e * e * e;
  },
  cubicOut: function(e) {
    return --e * e * e + 1;
  },
  cubicInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e : 0.5 * ((e -= 2) * e * e + 2);
  },
  quarticIn: function(e) {
    return e * e * e * e;
  },
  quarticOut: function(e) {
    return 1 - --e * e * e * e;
  },
  quarticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e * e : -0.5 * ((e -= 2) * e * e * e - 2);
  },
  quinticIn: function(e) {
    return e * e * e * e * e;
  },
  quinticOut: function(e) {
    return --e * e * e * e * e + 1;
  },
  quinticInOut: function(e) {
    return (e *= 2) < 1 ? 0.5 * e * e * e * e * e : 0.5 * ((e -= 2) * e * e * e * e + 2);
  },
  sinusoidalIn: function(e) {
    return 1 - Math.cos(e * Math.PI / 2);
  },
  sinusoidalOut: function(e) {
    return Math.sin(e * Math.PI / 2);
  },
  sinusoidalInOut: function(e) {
    return 0.5 * (1 - Math.cos(Math.PI * e));
  },
  exponentialIn: function(e) {
    return e === 0 ? 0 : Math.pow(1024, e - 1);
  },
  exponentialOut: function(e) {
    return e === 1 ? 1 : 1 - Math.pow(2, -10 * e);
  },
  exponentialInOut: function(e) {
    return e === 0 ? 0 : e === 1 ? 1 : (e *= 2) < 1 ? 0.5 * Math.pow(1024, e - 1) : 0.5 * (-Math.pow(2, -10 * (e - 1)) + 2);
  },
  circularIn: function(e) {
    return 1 - Math.sqrt(1 - e * e);
  },
  circularOut: function(e) {
    return Math.sqrt(1 - --e * e);
  },
  circularInOut: function(e) {
    return (e *= 2) < 1 ? -0.5 * (Math.sqrt(1 - e * e) - 1) : 0.5 * (Math.sqrt(1 - (e -= 2) * e) + 1);
  },
  elasticIn: function(e) {
    var t, r = 0.1, i = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), -(r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / i)));
  },
  elasticOut: function(e) {
    var t, r = 0.1, i = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), r * Math.pow(2, -10 * e) * Math.sin((e - t) * (2 * Math.PI) / i) + 1);
  },
  elasticInOut: function(e) {
    var t, r = 0.1, i = 0.4;
    return e === 0 ? 0 : e === 1 ? 1 : (!r || r < 1 ? (r = 1, t = i / 4) : t = i * Math.asin(1 / r) / (2 * Math.PI), (e *= 2) < 1 ? -0.5 * (r * Math.pow(2, 10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / i)) : r * Math.pow(2, -10 * (e -= 1)) * Math.sin((e - t) * (2 * Math.PI) / i) * 0.5 + 1);
  },
  backIn: function(e) {
    var t = 1.70158;
    return e * e * ((t + 1) * e - t);
  },
  backOut: function(e) {
    var t = 1.70158;
    return --e * e * ((t + 1) * e + t) + 1;
  },
  backInOut: function(e) {
    var t = 2.5949095;
    return (e *= 2) < 1 ? 0.5 * (e * e * ((t + 1) * e - t)) : 0.5 * ((e -= 2) * e * ((t + 1) * e + t) + 2);
  },
  bounceIn: function(e) {
    return 1 - Cn.bounceOut(1 - e);
  },
  bounceOut: function(e) {
    return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
  },
  bounceInOut: function(e) {
    return e < 0.5 ? Cn.bounceIn(e * 2) * 0.5 : Cn.bounceOut(e * 2 - 1) * 0.5 + 0.5;
  }
}, oa = Math.pow, cr = Math.sqrt, Ja = 1e-8, Rv = 1e-4, wh = cr(3), sa = 1 / 3, Ae = zi(), ue = zi(), Di = zi();
function lr(e) {
  return e > -Ja && e < Ja;
}
function Ov(e) {
  return e > Ja || e < -Ja;
}
function kt(e, t, r, i, n) {
  var a = 1 - n;
  return a * a * (a * e + 3 * n * t) + n * n * (n * i + 3 * a * r);
}
function bh(e, t, r, i, n) {
  var a = 1 - n;
  return 3 * (((t - e) * a + 2 * (r - t) * n) * a + (i - r) * n * n);
}
function kv(e, t, r, i, n, a) {
  var o = i + 3 * (t - r) - e, s = 3 * (r - t * 2 + e), l = 3 * (t - e), u = e - n, h = s * s - 3 * o * l, f = s * l - 9 * o * u, c = l * l - 3 * s * u, v = 0;
  if (lr(h) && lr(f))
    if (lr(s))
      a[0] = 0;
    else {
      var d = -l / s;
      d >= 0 && d <= 1 && (a[v++] = d);
    }
  else {
    var _ = f * f - 4 * h * c;
    if (lr(_)) {
      var p = f / h, d = -s / o + p, g = -p / 2;
      d >= 0 && d <= 1 && (a[v++] = d), g >= 0 && g <= 1 && (a[v++] = g);
    } else if (_ > 0) {
      var m = cr(_), y = h * s + 1.5 * o * (-f + m), w = h * s + 1.5 * o * (-f - m);
      y < 0 ? y = -oa(-y, sa) : y = oa(y, sa), w < 0 ? w = -oa(-w, sa) : w = oa(w, sa);
      var d = (-s - (y + w)) / (3 * o);
      d >= 0 && d <= 1 && (a[v++] = d);
    } else {
      var S = (2 * h * s - 3 * o * f) / (2 * cr(h * h * h)), b = Math.acos(S) / 3, T = cr(h), C = Math.cos(b), d = (-s - 2 * T * C) / (3 * o), g = (-s + T * (C + wh * Math.sin(b))) / (3 * o), x = (-s + T * (C - wh * Math.sin(b))) / (3 * o);
      d >= 0 && d <= 1 && (a[v++] = d), g >= 0 && g <= 1 && (a[v++] = g), x >= 0 && x <= 1 && (a[v++] = x);
    }
  }
  return v;
}
function Nv(e, t, r, i, n) {
  var a = 6 * r - 12 * t + 6 * e, o = 9 * t + 3 * i - 3 * e - 9 * r, s = 3 * t - 3 * e, l = 0;
  if (lr(o)) {
    if (Ov(a)) {
      var u = -s / a;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = a * a - 4 * o * s;
    if (lr(h))
      n[0] = -a / (2 * o);
    else if (h > 0) {
      var f = cr(h), u = (-a + f) / (2 * o), c = (-a - f) / (2 * o);
      u >= 0 && u <= 1 && (n[l++] = u), c >= 0 && c <= 1 && (n[l++] = c);
    }
  }
  return l;
}
function to(e, t, r, i, n, a) {
  var o = (t - e) * n + e, s = (r - t) * n + t, l = (i - r) * n + r, u = (s - o) * n + o, h = (l - s) * n + s, f = (h - u) * n + u;
  a[0] = e, a[1] = o, a[2] = u, a[3] = f, a[4] = f, a[5] = h, a[6] = l, a[7] = i;
}
function bw(e, t, r, i, n, a, o, s, l, u, h) {
  var f, c = 5e-3, v = 1 / 0, d, _, p, g;
  Ae[0] = l, Ae[1] = u;
  for (var m = 0; m < 1; m += 0.05)
    ue[0] = kt(e, r, n, o, m), ue[1] = kt(t, i, a, s, m), p = Ti(Ae, ue), p < v && (f = m, v = p);
  v = 1 / 0;
  for (var y = 0; y < 32 && !(c < Rv); y++)
    d = f - c, _ = f + c, ue[0] = kt(e, r, n, o, d), ue[1] = kt(t, i, a, s, d), p = Ti(ue, Ae), d >= 0 && p < v ? (f = d, v = p) : (Di[0] = kt(e, r, n, o, _), Di[1] = kt(t, i, a, s, _), g = Ti(Di, Ae), _ <= 1 && g < v ? (f = _, v = g) : c *= 0.5);
  return cr(v);
}
function Sw(e, t, r, i, n, a, o, s, l) {
  for (var u = e, h = t, f = 0, c = 1 / l, v = 1; v <= l; v++) {
    var d = v * c, _ = kt(e, r, n, o, d), p = kt(t, i, a, s, d), g = _ - u, m = p - h;
    f += Math.sqrt(g * g + m * m), u = _, h = p;
  }
  return f;
}
function zt(e, t, r, i) {
  var n = 1 - i;
  return n * (n * e + 2 * i * t) + i * i * r;
}
function Sh(e, t, r, i) {
  return 2 * ((1 - i) * (t - e) + i * (r - t));
}
function Tw(e, t, r, i, n) {
  var a = e - 2 * t + r, o = 2 * (t - e), s = e - i, l = 0;
  if (lr(a)) {
    if (Ov(o)) {
      var u = -s / o;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = o * o - 4 * a * s;
    if (lr(h)) {
      var u = -o / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u);
    } else if (h > 0) {
      var f = cr(h), u = (-o + f) / (2 * a), c = (-o - f) / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u), c >= 0 && c <= 1 && (n[l++] = c);
    }
  }
  return l;
}
function $v(e, t, r) {
  var i = e + r - 2 * t;
  return i === 0 ? 0.5 : (e - t) / i;
}
function eo(e, t, r, i, n) {
  var a = (t - e) * i + e, o = (r - t) * i + t, s = (o - a) * i + a;
  n[0] = e, n[1] = a, n[2] = s, n[3] = s, n[4] = o, n[5] = r;
}
function Cw(e, t, r, i, n, a, o, s, l) {
  var u, h = 5e-3, f = 1 / 0;
  Ae[0] = o, Ae[1] = s;
  for (var c = 0; c < 1; c += 0.05) {
    ue[0] = zt(e, r, n, c), ue[1] = zt(t, i, a, c);
    var v = Ti(Ae, ue);
    v < f && (u = c, f = v);
  }
  f = 1 / 0;
  for (var d = 0; d < 32 && !(h < Rv); d++) {
    var _ = u - h, p = u + h;
    ue[0] = zt(e, r, n, _), ue[1] = zt(t, i, a, _);
    var v = Ti(ue, Ae);
    if (_ >= 0 && v < f)
      u = _, f = v;
    else {
      Di[0] = zt(e, r, n, p), Di[1] = zt(t, i, a, p);
      var g = Ti(Di, Ae);
      p <= 1 && g < f ? (u = p, f = g) : h *= 0.5;
    }
  }
  return cr(f);
}
function xw(e, t, r, i, n, a, o) {
  for (var s = e, l = t, u = 0, h = 1 / o, f = 1; f <= o; f++) {
    var c = f * h, v = zt(e, r, n, c), d = zt(t, i, a, c), _ = v - s, p = d - l;
    u += Math.sqrt(_ * _ + p * p), s = v, l = d;
  }
  return u;
}
var Dw = /cubic-bezier\(([0-9,\.e ]+)\)/;
function Bv(e) {
  var t = e && Dw.exec(e);
  if (t) {
    var r = t[1].split(","), i = +Pe(r[0]), n = +Pe(r[1]), a = +Pe(r[2]), o = +Pe(r[3]);
    if (isNaN(i + n + a + o))
      return;
    var s = [];
    return function(l) {
      return l <= 0 ? 0 : l >= 1 ? 1 : kv(0, i, a, 1, l, s) && kt(0, n, o, 1, s[0]);
    };
  }
}
var Ew = (function() {
  function e(t) {
    this._inited = !1, this._startTime = 0, this._pausedTime = 0, this._paused = !1, this._life = t.life || 1e3, this._delay = t.delay || 0, this.loop = t.loop || !1, this.onframe = t.onframe || Gt, this.ondestroy = t.ondestroy || Gt, this.onrestart = t.onrestart || Gt, t.easing && this.setEasing(t.easing);
  }
  return e.prototype.step = function(t, r) {
    if (this._inited || (this._startTime = t + this._delay, this._inited = !0), this._paused) {
      this._pausedTime += r;
      return;
    }
    var i = this._life, n = t - this._startTime - this._pausedTime, a = n / i;
    a < 0 && (a = 0), a = Math.min(a, 1);
    var o = this.easingFunc, s = o ? o(a) : a;
    if (this.onframe(s), a === 1)
      if (this.loop) {
        var l = n % i;
        this._startTime = t - l, this._pausedTime = 0, this.onrestart();
      } else
        return !0;
    return !1;
  }, e.prototype.pause = function() {
    this._paused = !0;
  }, e.prototype.resume = function() {
    this._paused = !1;
  }, e.prototype.setEasing = function(t) {
    this.easing = t, this.easingFunc = rt(t) ? t : Cn[t] || Bv(t);
  }, e;
})(), Fv = /* @__PURE__ */ (function() {
  function e(t) {
    this.value = t;
  }
  return e;
})(), Aw = (function() {
  function e() {
    this._len = 0;
  }
  return e.prototype.insert = function(t) {
    var r = new Fv(t);
    return this.insertEntry(r), r;
  }, e.prototype.insertEntry = function(t) {
    this.head ? (this.tail.next = t, t.prev = this.tail, t.next = null, this.tail = t) : this.head = this.tail = t, this._len++;
  }, e.prototype.remove = function(t) {
    var r = t.prev, i = t.next;
    r ? r.next = i : this.head = i, i ? i.prev = r : this.tail = r, t.next = t.prev = null, this._len--;
  }, e.prototype.len = function() {
    return this._len;
  }, e.prototype.clear = function() {
    this.head = this.tail = null, this._len = 0;
  }, e;
})(), jn = (function() {
  function e(t) {
    this._list = new Aw(), this._maxSize = 10, this._map = {}, this._maxSize = t;
  }
  return e.prototype.put = function(t, r) {
    var i = this._list, n = this._map, a = null;
    if (n[t] == null) {
      var o = i.len(), s = this._lastRemovedEntry;
      if (o >= this._maxSize && o > 0) {
        var l = i.head;
        i.remove(l), delete n[l.key], a = l.value, this._lastRemovedEntry = l;
      }
      s ? s.value = r : s = new Fv(r), s.key = t, i.insertEntry(s), n[t] = s;
    }
    return a;
  }, e.prototype.get = function(t) {
    var r = this._map[t], i = this._list;
    if (r != null)
      return r !== i.tail && (i.remove(r), i.insertEntry(r)), r.value;
  }, e.prototype.clear = function() {
    this._list.clear(), this._map = {};
  }, e.prototype.len = function() {
    return this._list.len();
  }, e;
})(), Th = {
  transparent: [0, 0, 0, 0],
  aliceblue: [240, 248, 255, 1],
  antiquewhite: [250, 235, 215, 1],
  aqua: [0, 255, 255, 1],
  aquamarine: [127, 255, 212, 1],
  azure: [240, 255, 255, 1],
  beige: [245, 245, 220, 1],
  bisque: [255, 228, 196, 1],
  black: [0, 0, 0, 1],
  blanchedalmond: [255, 235, 205, 1],
  blue: [0, 0, 255, 1],
  blueviolet: [138, 43, 226, 1],
  brown: [165, 42, 42, 1],
  burlywood: [222, 184, 135, 1],
  cadetblue: [95, 158, 160, 1],
  chartreuse: [127, 255, 0, 1],
  chocolate: [210, 105, 30, 1],
  coral: [255, 127, 80, 1],
  cornflowerblue: [100, 149, 237, 1],
  cornsilk: [255, 248, 220, 1],
  crimson: [220, 20, 60, 1],
  cyan: [0, 255, 255, 1],
  darkblue: [0, 0, 139, 1],
  darkcyan: [0, 139, 139, 1],
  darkgoldenrod: [184, 134, 11, 1],
  darkgray: [169, 169, 169, 1],
  darkgreen: [0, 100, 0, 1],
  darkgrey: [169, 169, 169, 1],
  darkkhaki: [189, 183, 107, 1],
  darkmagenta: [139, 0, 139, 1],
  darkolivegreen: [85, 107, 47, 1],
  darkorange: [255, 140, 0, 1],
  darkorchid: [153, 50, 204, 1],
  darkred: [139, 0, 0, 1],
  darksalmon: [233, 150, 122, 1],
  darkseagreen: [143, 188, 143, 1],
  darkslateblue: [72, 61, 139, 1],
  darkslategray: [47, 79, 79, 1],
  darkslategrey: [47, 79, 79, 1],
  darkturquoise: [0, 206, 209, 1],
  darkviolet: [148, 0, 211, 1],
  deeppink: [255, 20, 147, 1],
  deepskyblue: [0, 191, 255, 1],
  dimgray: [105, 105, 105, 1],
  dimgrey: [105, 105, 105, 1],
  dodgerblue: [30, 144, 255, 1],
  firebrick: [178, 34, 34, 1],
  floralwhite: [255, 250, 240, 1],
  forestgreen: [34, 139, 34, 1],
  fuchsia: [255, 0, 255, 1],
  gainsboro: [220, 220, 220, 1],
  ghostwhite: [248, 248, 255, 1],
  gold: [255, 215, 0, 1],
  goldenrod: [218, 165, 32, 1],
  gray: [128, 128, 128, 1],
  green: [0, 128, 0, 1],
  greenyellow: [173, 255, 47, 1],
  grey: [128, 128, 128, 1],
  honeydew: [240, 255, 240, 1],
  hotpink: [255, 105, 180, 1],
  indianred: [205, 92, 92, 1],
  indigo: [75, 0, 130, 1],
  ivory: [255, 255, 240, 1],
  khaki: [240, 230, 140, 1],
  lavender: [230, 230, 250, 1],
  lavenderblush: [255, 240, 245, 1],
  lawngreen: [124, 252, 0, 1],
  lemonchiffon: [255, 250, 205, 1],
  lightblue: [173, 216, 230, 1],
  lightcoral: [240, 128, 128, 1],
  lightcyan: [224, 255, 255, 1],
  lightgoldenrodyellow: [250, 250, 210, 1],
  lightgray: [211, 211, 211, 1],
  lightgreen: [144, 238, 144, 1],
  lightgrey: [211, 211, 211, 1],
  lightpink: [255, 182, 193, 1],
  lightsalmon: [255, 160, 122, 1],
  lightseagreen: [32, 178, 170, 1],
  lightskyblue: [135, 206, 250, 1],
  lightslategray: [119, 136, 153, 1],
  lightslategrey: [119, 136, 153, 1],
  lightsteelblue: [176, 196, 222, 1],
  lightyellow: [255, 255, 224, 1],
  lime: [0, 255, 0, 1],
  limegreen: [50, 205, 50, 1],
  linen: [250, 240, 230, 1],
  magenta: [255, 0, 255, 1],
  maroon: [128, 0, 0, 1],
  mediumaquamarine: [102, 205, 170, 1],
  mediumblue: [0, 0, 205, 1],
  mediumorchid: [186, 85, 211, 1],
  mediumpurple: [147, 112, 219, 1],
  mediumseagreen: [60, 179, 113, 1],
  mediumslateblue: [123, 104, 238, 1],
  mediumspringgreen: [0, 250, 154, 1],
  mediumturquoise: [72, 209, 204, 1],
  mediumvioletred: [199, 21, 133, 1],
  midnightblue: [25, 25, 112, 1],
  mintcream: [245, 255, 250, 1],
  mistyrose: [255, 228, 225, 1],
  moccasin: [255, 228, 181, 1],
  navajowhite: [255, 222, 173, 1],
  navy: [0, 0, 128, 1],
  oldlace: [253, 245, 230, 1],
  olive: [128, 128, 0, 1],
  olivedrab: [107, 142, 35, 1],
  orange: [255, 165, 0, 1],
  orangered: [255, 69, 0, 1],
  orchid: [218, 112, 214, 1],
  palegoldenrod: [238, 232, 170, 1],
  palegreen: [152, 251, 152, 1],
  paleturquoise: [175, 238, 238, 1],
  palevioletred: [219, 112, 147, 1],
  papayawhip: [255, 239, 213, 1],
  peachpuff: [255, 218, 185, 1],
  peru: [205, 133, 63, 1],
  pink: [255, 192, 203, 1],
  plum: [221, 160, 221, 1],
  powderblue: [176, 224, 230, 1],
  purple: [128, 0, 128, 1],
  red: [255, 0, 0, 1],
  rosybrown: [188, 143, 143, 1],
  royalblue: [65, 105, 225, 1],
  saddlebrown: [139, 69, 19, 1],
  salmon: [250, 128, 114, 1],
  sandybrown: [244, 164, 96, 1],
  seagreen: [46, 139, 87, 1],
  seashell: [255, 245, 238, 1],
  sienna: [160, 82, 45, 1],
  silver: [192, 192, 192, 1],
  skyblue: [135, 206, 235, 1],
  slateblue: [106, 90, 205, 1],
  slategray: [112, 128, 144, 1],
  slategrey: [112, 128, 144, 1],
  snow: [255, 250, 250, 1],
  springgreen: [0, 255, 127, 1],
  steelblue: [70, 130, 180, 1],
  tan: [210, 180, 140, 1],
  teal: [0, 128, 128, 1],
  thistle: [216, 191, 216, 1],
  tomato: [255, 99, 71, 1],
  turquoise: [64, 224, 208, 1],
  violet: [238, 130, 238, 1],
  wheat: [245, 222, 179, 1],
  white: [255, 255, 255, 1],
  whitesmoke: [245, 245, 245, 1],
  yellow: [255, 255, 0, 1],
  yellowgreen: [154, 205, 50, 1]
};
function xn(e) {
  return e = Math.round(e), e < 0 ? 0 : e > 255 ? 255 : e;
}
function Ch(e) {
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function is(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? xn(parseFloat(t) / 100 * 255) : xn(parseInt(t, 10));
}
function Dn(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? Ch(parseFloat(t) / 100) : Ch(parseFloat(t));
}
function ns(e, t, r) {
  return r < 0 ? r += 1 : r > 1 && (r -= 1), r * 6 < 1 ? e + (t - e) * r * 6 : r * 2 < 1 ? t : r * 3 < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function ae(e, t, r, i, n) {
  return e[0] = t, e[1] = r, e[2] = i, e[3] = n, e;
}
function pl(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
}
var Vv = new jn(20), la = null;
function ii(e, t) {
  la && pl(la, t), la = Vv.put(e, la || t.slice());
}
function Ei(e, t) {
  if (e) {
    t = t || [];
    var r = Vv.get(e);
    if (r)
      return pl(t, r);
    e = e + "";
    var i = e.replace(/ /g, "").toLowerCase();
    if (i in Th)
      return pl(t, Th[i]), ii(e, t), t;
    var n = i.length;
    if (i.charAt(0) === "#") {
      if (n === 4 || n === 5) {
        var a = parseInt(i.slice(1, 4), 16);
        if (!(a >= 0 && a <= 4095)) {
          ae(t, 0, 0, 0, 1);
          return;
        }
        return ae(t, (a & 3840) >> 4 | (a & 3840) >> 8, a & 240 | (a & 240) >> 4, a & 15 | (a & 15) << 4, n === 5 ? parseInt(i.slice(4), 16) / 15 : 1), ii(e, t), t;
      } else if (n === 7 || n === 9) {
        var a = parseInt(i.slice(1, 7), 16);
        if (!(a >= 0 && a <= 16777215)) {
          ae(t, 0, 0, 0, 1);
          return;
        }
        return ae(t, (a & 16711680) >> 16, (a & 65280) >> 8, a & 255, n === 9 ? parseInt(i.slice(7), 16) / 255 : 1), ii(e, t), t;
      }
      return;
    }
    var o = i.indexOf("("), s = i.indexOf(")");
    if (o !== -1 && s + 1 === n) {
      var l = i.substr(0, o), u = i.substr(o + 1, s - (o + 1)).split(","), h = 1;
      switch (l) {
        case "rgba":
          if (u.length !== 4)
            return u.length === 3 ? ae(t, +u[0], +u[1], +u[2], 1) : ae(t, 0, 0, 0, 1);
          h = Dn(u.pop());
        case "rgb":
          if (u.length >= 3)
            return ae(t, is(u[0]), is(u[1]), is(u[2]), u.length === 3 ? h : Dn(u[3])), ii(e, t), t;
          ae(t, 0, 0, 0, 1);
          return;
        case "hsla":
          if (u.length !== 4) {
            ae(t, 0, 0, 0, 1);
            return;
          }
          return u[3] = Dn(u[3]), xh(u, t), ii(e, t), t;
        case "hsl":
          if (u.length !== 3) {
            ae(t, 0, 0, 0, 1);
            return;
          }
          return xh(u, t), ii(e, t), t;
        default:
          return;
      }
    }
    ae(t, 0, 0, 0, 1);
  }
}
function xh(e, t) {
  var r = (parseFloat(e[0]) % 360 + 360) % 360 / 360, i = Dn(e[1]), n = Dn(e[2]), a = n <= 0.5 ? n * (i + 1) : n + i - n * i, o = n * 2 - a;
  return t = t || [], ae(t, xn(ns(o, a, r + 1 / 3) * 255), xn(ns(o, a, r) * 255), xn(ns(o, a, r - 1 / 3) * 255), 1), e.length === 4 && (t[3] = e[3]), t;
}
function Dh(e, t) {
  var r = Ei(e);
  if (r) {
    for (var i = 0; i < 3; i++)
      r[i] = r[i] * (1 - t) | 0, r[i] > 255 ? r[i] = 255 : r[i] < 0 && (r[i] = 0);
    return zv(r, r.length === 4 ? "rgba" : "rgb");
  }
}
function zv(e, t) {
  if (!(!e || !e.length)) {
    var r = e[0] + "," + e[1] + "," + e[2];
    return (t === "rgba" || t === "hsva" || t === "hsla") && (r += "," + e[3]), t + "(" + r + ")";
  }
}
function ro(e, t) {
  var r = Ei(e);
  return r ? (0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) * r[3] / 255 + (1 - r[3]) * t : 0;
}
var Eh = new jn(100);
function Ah(e) {
  if (z(e)) {
    var t = Eh.get(e);
    return t || (t = Dh(e, -0.1), Eh.put(e, t)), t;
  } else if (Po(e)) {
    var r = I({}, e);
    return r.colorStops = Q(e.colorStops, function(i) {
      return {
        offset: i.offset,
        color: Dh(i.color, -0.1)
      };
    }), r;
  }
  return e;
}
function Mw(e) {
  return e.type === "linear";
}
function Pw(e) {
  return e.type === "radial";
}
(function() {
  return V.hasGlobalWindow && rt(window.btoa) ? function(e) {
    return window.btoa(unescape(encodeURIComponent(e)));
  } : typeof Buffer < "u" ? function(e) {
    return Buffer.from(e).toString("base64");
  } : function(e) {
    return process.env.NODE_ENV !== "production" && Wr("Base64 isn't natively supported in the current environment."), null;
  };
})();
var gl = Array.prototype.slice;
function Ue(e, t, r) {
  return (t - e) * r + e;
}
function as(e, t, r, i) {
  for (var n = t.length, a = 0; a < n; a++)
    e[a] = Ue(t[a], r[a], i);
  return e;
}
function Lw(e, t, r, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = Ue(t[o][s], r[o][s], i);
  }
  return e;
}
function ua(e, t, r, i) {
  for (var n = t.length, a = 0; a < n; a++)
    e[a] = t[a] + r[a] * i;
  return e;
}
function Mh(e, t, r, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = t[o][s] + r[o][s] * i;
  }
  return e;
}
function Iw(e, t) {
  for (var r = e.length, i = t.length, n = r > i ? t : e, a = Math.min(r, i), o = n[a - 1] || { color: [0, 0, 0, 0], offset: 0 }, s = a; s < Math.max(r, i); s++)
    n.push({
      offset: o.offset,
      color: o.color.slice()
    });
}
function Rw(e, t, r) {
  var i = e, n = t;
  if (!(!i.push || !n.push)) {
    var a = i.length, o = n.length;
    if (a !== o) {
      var s = a > o;
      if (s)
        i.length = o;
      else
        for (var l = a; l < o; l++)
          i.push(r === 1 ? n[l] : gl.call(n[l]));
    }
    for (var u = i[0] && i[0].length, l = 0; l < i.length; l++)
      if (r === 1)
        isNaN(i[l]) && (i[l] = n[l]);
      else
        for (var h = 0; h < u; h++)
          isNaN(i[l][h]) && (i[l][h] = n[l][h]);
  }
}
function Na(e) {
  if (Yt(e)) {
    var t = e.length;
    if (Yt(e[0])) {
      for (var r = [], i = 0; i < t; i++)
        r.push(gl.call(e[i]));
      return r;
    }
    return gl.call(e);
  }
  return e;
}
function $a(e) {
  return e[0] = Math.floor(e[0]) || 0, e[1] = Math.floor(e[1]) || 0, e[2] = Math.floor(e[2]) || 0, e[3] = e[3] == null ? 1 : e[3], "rgba(" + e.join(",") + ")";
}
function Ow(e) {
  return Yt(e && e[0]) ? 2 : 1;
}
var ha = 0, Ba = 1, Hv = 2, pn = 3, _l = 4, ml = 5, Ph = 6;
function Lh(e) {
  return e === _l || e === ml;
}
function fa(e) {
  return e === Ba || e === Hv;
}
var Qi = [0, 0, 0, 0], kw = (function() {
  function e(t) {
    this.keyframes = [], this.discrete = !1, this._invalid = !1, this._needsSort = !1, this._lastFr = 0, this._lastFrP = 0, this.propName = t;
  }
  return e.prototype.isFinished = function() {
    return this._finished;
  }, e.prototype.setFinished = function() {
    this._finished = !0, this._additiveTrack && this._additiveTrack.setFinished();
  }, e.prototype.needsAnimate = function() {
    return this.keyframes.length >= 1;
  }, e.prototype.getAdditiveTrack = function() {
    return this._additiveTrack;
  }, e.prototype.addKeyframe = function(t, r, i) {
    this._needsSort = !0;
    var n = this.keyframes, a = n.length, o = !1, s = Ph, l = r;
    if (Yt(r)) {
      var u = Ow(r);
      s = u, (u === 1 && !yt(r[0]) || u === 2 && !yt(r[0][0])) && (o = !0);
    } else if (yt(r) && !bv(r))
      s = ha;
    else if (z(r))
      if (!isNaN(+r))
        s = ha;
      else {
        var h = Ei(r);
        h && (l = h, s = pn);
      }
    else if (Po(r)) {
      var f = I({}, l);
      f.colorStops = Q(r.colorStops, function(v) {
        return {
          offset: v.offset,
          color: Ei(v.color)
        };
      }), Mw(r) ? s = _l : Pw(r) && (s = ml), l = f;
    }
    a === 0 ? this.valType = s : (s !== this.valType || s === Ph) && (o = !0), this.discrete = this.discrete || o;
    var c = {
      time: t,
      value: l,
      rawValue: r,
      percent: 0
    };
    return i && (c.easing = i, c.easingFunc = rt(i) ? i : Cn[i] || Bv(i)), n.push(c), c;
  }, e.prototype.prepare = function(t, r) {
    var i = this.keyframes;
    this._needsSort && i.sort(function(_, p) {
      return _.time - p.time;
    });
    for (var n = this.valType, a = i.length, o = i[a - 1], s = this.discrete, l = fa(n), u = Lh(n), h = 0; h < a; h++) {
      var f = i[h], c = f.value, v = o.value;
      f.percent = f.time / t, s || (l && h !== a - 1 ? Rw(c, v, n) : u && Iw(c.colorStops, v.colorStops));
    }
    if (!s && n !== ml && r && this.needsAnimate() && r.needsAnimate() && n === r.valType && !r._finished) {
      this._additiveTrack = r;
      for (var d = i[0].value, h = 0; h < a; h++)
        n === ha ? i[h].additiveValue = i[h].value - d : n === pn ? i[h].additiveValue = ua([], i[h].value, d, -1) : fa(n) && (i[h].additiveValue = n === Ba ? ua([], i[h].value, d, -1) : Mh([], i[h].value, d, -1));
    }
  }, e.prototype.step = function(t, r) {
    if (!this._finished) {
      this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
      var i = this._additiveTrack != null, n = i ? "additiveValue" : "value", a = this.valType, o = this.keyframes, s = o.length, l = this.propName, u = a === pn, h, f = this._lastFr, c = Math.min, v, d;
      if (s === 1)
        v = d = o[0];
      else {
        if (r < 0)
          h = 0;
        else if (r < this._lastFrP) {
          var _ = c(f + 1, s - 1);
          for (h = _; h >= 0 && !(o[h].percent <= r); h--)
            ;
          h = c(h, s - 2);
        } else {
          for (h = f; h < s && !(o[h].percent > r); h++)
            ;
          h = c(h - 1, s - 2);
        }
        d = o[h + 1], v = o[h];
      }
      if (v && d) {
        this._lastFr = h, this._lastFrP = r;
        var p = d.percent - v.percent, g = p === 0 ? 1 : c((r - v.percent) / p, 1);
        d.easingFunc && (g = d.easingFunc(g));
        var m = i ? this._additiveValue : u ? Qi : t[l];
        if ((fa(a) || u) && !m && (m = this._additiveValue = []), this.discrete)
          t[l] = g < 1 ? v.rawValue : d.rawValue;
        else if (fa(a))
          a === Ba ? as(m, v[n], d[n], g) : Lw(m, v[n], d[n], g);
        else if (Lh(a)) {
          var y = v[n], w = d[n], S = a === _l;
          t[l] = {
            type: S ? "linear" : "radial",
            x: Ue(y.x, w.x, g),
            y: Ue(y.y, w.y, g),
            colorStops: Q(y.colorStops, function(T, C) {
              var x = w.colorStops[C];
              return {
                offset: Ue(T.offset, x.offset, g),
                color: $a(as([], T.color, x.color, g))
              };
            }),
            global: w.global
          }, S ? (t[l].x2 = Ue(y.x2, w.x2, g), t[l].y2 = Ue(y.y2, w.y2, g)) : t[l].r = Ue(y.r, w.r, g);
        } else if (u)
          as(m, v[n], d[n], g), i || (t[l] = $a(m));
        else {
          var b = Ue(v[n], d[n], g);
          i ? this._additiveValue = b : t[l] = b;
        }
        i && this._addToTarget(t);
      }
    }
  }, e.prototype._addToTarget = function(t) {
    var r = this.valType, i = this.propName, n = this._additiveValue;
    r === ha ? t[i] = t[i] + n : r === pn ? (Ei(t[i], Qi), ua(Qi, Qi, n, 1), t[i] = $a(Qi)) : r === Ba ? ua(t[i], t[i], n, 1) : r === Hv && Mh(t[i], t[i], n, 1);
  }, e;
})(), cu = (function() {
  function e(t, r, i, n) {
    if (this._tracks = {}, this._trackKeys = [], this._maxTime = 0, this._started = 0, this._clip = null, this._target = t, this._loop = r, r && n) {
      Wr("Can' use additive animation on looped animation.");
      return;
    }
    this._additiveAnimators = n, this._allowDiscrete = i;
  }
  return e.prototype.getMaxTime = function() {
    return this._maxTime;
  }, e.prototype.getDelay = function() {
    return this._delay;
  }, e.prototype.getLoop = function() {
    return this._loop;
  }, e.prototype.getTarget = function() {
    return this._target;
  }, e.prototype.changeTarget = function(t) {
    this._target = t;
  }, e.prototype.when = function(t, r, i) {
    return this.whenWithKeys(t, r, pt(r), i);
  }, e.prototype.whenWithKeys = function(t, r, i, n) {
    for (var a = this._tracks, o = 0; o < i.length; o++) {
      var s = i[o], l = a[s];
      if (!l) {
        l = a[s] = new kw(s);
        var u = void 0, h = this._getAdditiveTrack(s);
        if (h) {
          var f = h.keyframes, c = f[f.length - 1];
          u = c && c.value, h.valType === pn && u && (u = $a(u));
        } else
          u = this._target[s];
        if (u == null)
          continue;
        t > 0 && l.addKeyframe(0, Na(u), n), this._trackKeys.push(s);
      }
      l.addKeyframe(t, Na(r[s]), n);
    }
    return this._maxTime = Math.max(this._maxTime, t), this;
  }, e.prototype.pause = function() {
    this._clip.pause(), this._paused = !0;
  }, e.prototype.resume = function() {
    this._clip.resume(), this._paused = !1;
  }, e.prototype.isPaused = function() {
    return !!this._paused;
  }, e.prototype.duration = function(t) {
    return this._maxTime = t, this._force = !0, this;
  }, e.prototype._doneCallback = function() {
    this._setTracksFinished(), this._clip = null;
    var t = this._doneCbs;
    if (t)
      for (var r = t.length, i = 0; i < r; i++)
        t[i].call(this);
  }, e.prototype._abortedCallback = function() {
    this._setTracksFinished();
    var t = this.animation, r = this._abortedCbs;
    if (t && t.removeClip(this._clip), this._clip = null, r)
      for (var i = 0; i < r.length; i++)
        r[i].call(this);
  }, e.prototype._setTracksFinished = function() {
    for (var t = this._tracks, r = this._trackKeys, i = 0; i < r.length; i++)
      t[r[i]].setFinished();
  }, e.prototype._getAdditiveTrack = function(t) {
    var r, i = this._additiveAnimators;
    if (i)
      for (var n = 0; n < i.length; n++) {
        var a = i[n].getTrack(t);
        a && (r = a);
      }
    return r;
  }, e.prototype.start = function(t) {
    if (!(this._started > 0)) {
      this._started = 1;
      for (var r = this, i = [], n = this._maxTime || 0, a = 0; a < this._trackKeys.length; a++) {
        var o = this._trackKeys[a], s = this._tracks[o], l = this._getAdditiveTrack(o), u = s.keyframes, h = u.length;
        if (s.prepare(n, l), s.needsAnimate())
          if (!this._allowDiscrete && s.discrete) {
            var f = u[h - 1];
            f && (r._target[s.propName] = f.rawValue), s.setFinished();
          } else
            i.push(s);
      }
      if (i.length || this._force) {
        var c = new Ew({
          life: n,
          loop: this._loop,
          delay: this._delay || 0,
          onframe: function(v) {
            r._started = 2;
            var d = r._additiveAnimators;
            if (d) {
              for (var _ = !1, p = 0; p < d.length; p++)
                if (d[p]._clip) {
                  _ = !0;
                  break;
                }
              _ || (r._additiveAnimators = null);
            }
            for (var p = 0; p < i.length; p++)
              i[p].step(r._target, v);
            var g = r._onframeCbs;
            if (g)
              for (var p = 0; p < g.length; p++)
                g[p](r._target, v);
          },
          ondestroy: function() {
            r._doneCallback();
          }
        });
        this._clip = c, this.animation && this.animation.addClip(c), t && c.setEasing(t);
      } else
        this._doneCallback();
      return this;
    }
  }, e.prototype.stop = function(t) {
    if (this._clip) {
      var r = this._clip;
      t && r.onframe(1), this._abortedCallback();
    }
  }, e.prototype.delay = function(t) {
    return this._delay = t, this;
  }, e.prototype.during = function(t) {
    return t && (this._onframeCbs || (this._onframeCbs = []), this._onframeCbs.push(t)), this;
  }, e.prototype.done = function(t) {
    return t && (this._doneCbs || (this._doneCbs = []), this._doneCbs.push(t)), this;
  }, e.prototype.aborted = function(t) {
    return t && (this._abortedCbs || (this._abortedCbs = []), this._abortedCbs.push(t)), this;
  }, e.prototype.getClip = function() {
    return this._clip;
  }, e.prototype.getTrack = function(t) {
    return this._tracks[t];
  }, e.prototype.getTracks = function() {
    var t = this;
    return Q(this._trackKeys, function(r) {
      return t._tracks[r];
    });
  }, e.prototype.stopTracks = function(t, r) {
    if (!t.length || !this._clip)
      return !0;
    for (var i = this._tracks, n = this._trackKeys, a = 0; a < t.length; a++) {
      var o = i[t[a]];
      o && !o.isFinished() && (r ? o.step(this._target, 1) : this._started === 1 && o.step(this._target, 0), o.setFinished());
    }
    for (var s = !0, a = 0; a < n.length; a++)
      if (!i[n[a]].isFinished()) {
        s = !1;
        break;
      }
    return s && this._abortedCallback(), s;
  }, e.prototype.saveTo = function(t, r, i) {
    if (t) {
      r = r || this._trackKeys;
      for (var n = 0; n < r.length; n++) {
        var a = r[n], o = this._tracks[a];
        if (!(!o || o.isFinished())) {
          var s = o.keyframes, l = s[i ? 0 : s.length - 1];
          l && (t[a] = Na(l.rawValue));
        }
      }
    }
  }, e.prototype.__changeFinalValue = function(t, r) {
    r = r || pt(t);
    for (var i = 0; i < r.length; i++) {
      var n = r[i], a = this._tracks[n];
      if (a) {
        var o = a.keyframes;
        if (o.length > 1) {
          var s = o.pop();
          a.addKeyframe(s.time, t[n]), a.prepare(this._maxTime, a.getAdditiveTrack());
        }
      }
    }
  }, e;
})();
function bi() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var Nw = (function(e) {
  W(t, e);
  function t(r) {
    var i = e.call(this) || this;
    return i._running = !1, i._time = 0, i._pausedTime = 0, i._pauseStart = 0, i._paused = !1, r = r || {}, i.stage = r.stage || {}, i;
  }
  return t.prototype.addClip = function(r) {
    r.animation && this.removeClip(r), this._head ? (this._tail.next = r, r.prev = this._tail, r.next = null, this._tail = r) : this._head = this._tail = r, r.animation = this;
  }, t.prototype.addAnimator = function(r) {
    r.animation = this;
    var i = r.getClip();
    i && this.addClip(i);
  }, t.prototype.removeClip = function(r) {
    if (r.animation) {
      var i = r.prev, n = r.next;
      i ? i.next = n : this._head = n, n ? n.prev = i : this._tail = i, r.next = r.prev = r.animation = null;
    }
  }, t.prototype.removeAnimator = function(r) {
    var i = r.getClip();
    i && this.removeClip(i), r.animation = null;
  }, t.prototype.update = function(r) {
    for (var i = bi() - this._pausedTime, n = i - this._time, a = this._head; a; ) {
      var o = a.next, s = a.step(i, n);
      s && (a.ondestroy(), this.removeClip(a)), a = o;
    }
    this._time = i, r || (this.trigger("frame", n), this.stage.update && this.stage.update());
  }, t.prototype._startLoop = function() {
    var r = this;
    this._running = !0;
    function i() {
      r._running && (Qa(i), !r._paused && r.update());
    }
    Qa(i);
  }, t.prototype.start = function() {
    this._running || (this._time = bi(), this._pausedTime = 0, this._startLoop());
  }, t.prototype.stop = function() {
    this._running = !1;
  }, t.prototype.pause = function() {
    this._paused || (this._pauseStart = bi(), this._paused = !0);
  }, t.prototype.resume = function() {
    this._paused && (this._pausedTime += bi() - this._pauseStart, this._paused = !1);
  }, t.prototype.clear = function() {
    for (var r = this._head; r; ) {
      var i = r.next;
      r.prev = r.next = r.animation = null, r = i;
    }
    this._head = this._tail = null;
  }, t.prototype.isFinished = function() {
    return this._head == null;
  }, t.prototype.animate = function(r, i) {
    i = i || {}, this.start();
    var n = new cu(r, i.loop);
    return this.addAnimator(n), n;
  }, t;
})($e), $w = 300, os = V.domSupported, ss = (function() {
  var e = [
    "click",
    "dblclick",
    "mousewheel",
    "wheel",
    "mouseout",
    "mouseup",
    "mousedown",
    "mousemove",
    "contextmenu"
  ], t = [
    "touchstart",
    "touchend",
    "touchmove"
  ], r = {
    pointerdown: 1,
    pointerup: 1,
    pointermove: 1,
    pointerout: 1
  }, i = Q(e, function(n) {
    var a = n.replace("mouse", "pointer");
    return r.hasOwnProperty(a) ? a : n;
  });
  return {
    mouse: e,
    touch: t,
    pointer: i
  };
})(), Ih = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
}, Rh = !1;
function yl(e) {
  var t = e.pointerType;
  return t === "pen" || t === "touch";
}
function Bw(e) {
  e.touching = !0, e.touchTimer != null && (clearTimeout(e.touchTimer), e.touchTimer = null), e.touchTimer = setTimeout(function() {
    e.touching = !1, e.touchTimer = null;
  }, 700);
}
function ls(e) {
  e && (e.zrByTouch = !0);
}
function Fw(e, t) {
  return oe(e.dom, new Vw(e, t), !0);
}
function Uv(e, t) {
  for (var r = t, i = !1; r && r.nodeType !== 9 && !(i = r.domBelongToZr || r !== t && r === e.painterRoot); )
    r = r.parentNode;
  return i;
}
var Vw = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.stopPropagation = Gt, this.stopImmediatePropagation = Gt, this.preventDefault = Gt, this.type = r.type, this.target = this.currentTarget = t.dom, this.pointerType = r.pointerType, this.clientX = r.clientX, this.clientY = r.clientY;
  }
  return e;
})(), de = {
  mousedown: function(e) {
    e = oe(this.dom, e), this.__mayPointerCapture = [e.zrX, e.zrY], this.trigger("mousedown", e);
  },
  mousemove: function(e) {
    e = oe(this.dom, e);
    var t = this.__mayPointerCapture;
    t && (e.zrX !== t[0] || e.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    e = oe(this.dom, e), this.__togglePointerCapture(!1), this.trigger("mouseup", e);
  },
  mouseout: function(e) {
    e = oe(this.dom, e);
    var t = e.toElement || e.relatedTarget;
    Uv(this, t) || (this.__pointerCapturing && (e.zrEventControl = "no_globalout"), this.trigger("mouseout", e));
  },
  wheel: function(e) {
    Rh = !0, e = oe(this.dom, e), this.trigger("mousewheel", e);
  },
  mousewheel: function(e) {
    Rh || (e = oe(this.dom, e), this.trigger("mousewheel", e));
  },
  touchstart: function(e) {
    e = oe(this.dom, e), ls(e), this.__lastTouchMoment = /* @__PURE__ */ new Date(), this.handler.processGesture(e, "start"), de.mousemove.call(this, e), de.mousedown.call(this, e);
  },
  touchmove: function(e) {
    e = oe(this.dom, e), ls(e), this.handler.processGesture(e, "change"), de.mousemove.call(this, e);
  },
  touchend: function(e) {
    e = oe(this.dom, e), ls(e), this.handler.processGesture(e, "end"), de.mouseup.call(this, e), +/* @__PURE__ */ new Date() - +this.__lastTouchMoment < $w && de.click.call(this, e);
  },
  pointerdown: function(e) {
    de.mousedown.call(this, e);
  },
  pointermove: function(e) {
    yl(e) || de.mousemove.call(this, e);
  },
  pointerup: function(e) {
    de.mouseup.call(this, e);
  },
  pointerout: function(e) {
    yl(e) || de.mouseout.call(this, e);
  }
};
D(["click", "dblclick", "contextmenu"], function(e) {
  de[e] = function(t) {
    t = oe(this.dom, t), this.trigger(e, t);
  };
});
var wl = {
  pointermove: function(e) {
    yl(e) || wl.mousemove.call(this, e);
  },
  pointerup: function(e) {
    wl.mouseup.call(this, e);
  },
  mousemove: function(e) {
    this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    var t = this.__pointerCapturing;
    this.__togglePointerCapture(!1), this.trigger("mouseup", e), t && (e.zrEventControl = "only_globalout", this.trigger("mouseout", e));
  }
};
function zw(e, t) {
  var r = t.domHandlers;
  V.pointerEventsSupported ? D(ss.pointer, function(i) {
    Fa(t, i, function(n) {
      r[i].call(e, n);
    });
  }) : (V.touchEventsSupported && D(ss.touch, function(i) {
    Fa(t, i, function(n) {
      r[i].call(e, n), Bw(t);
    });
  }), D(ss.mouse, function(i) {
    Fa(t, i, function(n) {
      n = uu(n), t.touching || r[i].call(e, n);
    });
  }));
}
function Hw(e, t) {
  V.pointerEventsSupported ? D(Ih.pointer, r) : V.touchEventsSupported || D(Ih.mouse, r);
  function r(i) {
    function n(a) {
      a = uu(a), Uv(e, a.target) || (a = Fw(e, a), t.domHandlers[i].call(e, a));
    }
    Fa(t, i, n, { capture: !0 });
  }
}
function Fa(e, t, r, i) {
  e.mounted[t] = r, e.listenerOpts[t] = i, ow(e.domTarget, t, r, i);
}
function us(e) {
  var t = e.mounted;
  for (var r in t)
    t.hasOwnProperty(r) && sw(e.domTarget, r, t[r], e.listenerOpts[r]);
  e.mounted = {};
}
var Oh = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.mounted = {}, this.listenerOpts = {}, this.touching = !1, this.domTarget = t, this.domHandlers = r;
  }
  return e;
})(), Uw = (function(e) {
  W(t, e);
  function t(r, i) {
    var n = e.call(this) || this;
    return n.__pointerCapturing = !1, n.dom = r, n.painterRoot = i, n._localHandlerScope = new Oh(r, de), os && (n._globalHandlerScope = new Oh(document, wl)), zw(n, n._localHandlerScope), n;
  }
  return t.prototype.dispose = function() {
    us(this._localHandlerScope), os && us(this._globalHandlerScope);
  }, t.prototype.setCursor = function(r) {
    this.dom.style && (this.dom.style.cursor = r || "default");
  }, t.prototype.__togglePointerCapture = function(r) {
    if (this.__mayPointerCapture = null, os && +this.__pointerCapturing ^ +r) {
      this.__pointerCapturing = r;
      var i = this._globalHandlerScope;
      r ? Hw(this, i) : us(i);
    }
  }, t;
})($e), Gv = 1;
V.hasGlobalWindow && (Gv = Math.max(window.devicePixelRatio || window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI || 1, 1));
var io = Gv, bl = 0.4, Sl = "#333", Tl = "#ccc", Gw = "#eee", kh = hu, Nh = 5e-5;
function Tr(e) {
  return e > Nh || e < -Nh;
}
var Cr = [], ni = [], hs = Ci(), fs = Math.abs, vu = (function() {
  function e() {
  }
  return e.prototype.getLocalTransform = function(t) {
    return e.getLocalTransform(this, t);
  }, e.prototype.setPosition = function(t) {
    this.x = t[0], this.y = t[1];
  }, e.prototype.setScale = function(t) {
    this.scaleX = t[0], this.scaleY = t[1];
  }, e.prototype.setSkew = function(t) {
    this.skewX = t[0], this.skewY = t[1];
  }, e.prototype.setOrigin = function(t) {
    this.originX = t[0], this.originY = t[1];
  }, e.prototype.needLocalTransform = function() {
    return Tr(this.rotation) || Tr(this.x) || Tr(this.y) || Tr(this.scaleX - 1) || Tr(this.scaleY - 1) || Tr(this.skewX) || Tr(this.skewY);
  }, e.prototype.updateTransform = function() {
    var t = this.parent && this.parent.transform, r = this.needLocalTransform(), i = this.transform;
    if (!(r || t)) {
      i && (kh(i), this.invTransform = null);
      return;
    }
    i = i || Ci(), r ? this.getLocalTransform(i) : kh(i), t && (r ? xi(i, t, i) : hw(i, t)), this.transform = i, this._resolveGlobalScaleRatio(i);
  }, e.prototype._resolveGlobalScaleRatio = function(t) {
    var r = this.globalScaleRatio;
    if (r != null && r !== 1) {
      this.getGlobalScale(Cr);
      var i = Cr[0] < 0 ? -1 : 1, n = Cr[1] < 0 ? -1 : 1, a = ((Cr[0] - i) * r + i) / Cr[0] || 0, o = ((Cr[1] - n) * r + n) / Cr[1] || 0;
      t[0] *= a, t[1] *= a, t[2] *= o, t[3] *= o;
    }
    this.invTransform = this.invTransform || Ci(), Av(this.invTransform, t);
  }, e.prototype.getComputedTransform = function() {
    for (var t = this, r = []; t; )
      r.push(t), t = t.parent;
    for (; t = r.pop(); )
      t.updateTransform();
    return this.transform;
  }, e.prototype.setLocalTransform = function(t) {
    if (t) {
      var r = t[0] * t[0] + t[1] * t[1], i = t[2] * t[2] + t[3] * t[3], n = Math.atan2(t[1], t[0]), a = Math.PI / 2 + n - Math.atan2(t[3], t[2]);
      i = Math.sqrt(i) * Math.cos(a), r = Math.sqrt(r), this.skewX = a, this.skewY = 0, this.rotation = -n, this.x = +t[4], this.y = +t[5], this.scaleX = r, this.scaleY = i, this.originX = 0, this.originY = 0;
    }
  }, e.prototype.decomposeTransform = function() {
    if (this.transform) {
      var t = this.parent, r = this.transform;
      t && t.transform && (t.invTransform = t.invTransform || Ci(), xi(ni, t.invTransform, r), r = ni);
      var i = this.originX, n = this.originY;
      (i || n) && (hs[4] = i, hs[5] = n, xi(ni, r, hs), ni[4] -= i, ni[5] -= n, r = ni), this.setLocalTransform(r);
    }
  }, e.prototype.getGlobalScale = function(t) {
    var r = this.transform;
    return t = t || [], r ? (t[0] = Math.sqrt(r[0] * r[0] + r[1] * r[1]), t[1] = Math.sqrt(r[2] * r[2] + r[3] * r[3]), r[0] < 0 && (t[0] = -t[0]), r[3] < 0 && (t[1] = -t[1]), t) : (t[0] = 1, t[1] = 1, t);
  }, e.prototype.transformCoordToLocal = function(t, r) {
    var i = [t, r], n = this.invTransform;
    return n && Ie(i, i, n), i;
  }, e.prototype.transformCoordToGlobal = function(t, r) {
    var i = [t, r], n = this.transform;
    return n && Ie(i, i, n), i;
  }, e.prototype.getLineScale = function() {
    var t = this.transform;
    return t && fs(t[0] - 1) > 1e-10 && fs(t[3] - 1) > 1e-10 ? Math.sqrt(fs(t[0] * t[3] - t[2] * t[1])) : 1;
  }, e.prototype.copyTransform = function(t) {
    Ww(this, t);
  }, e.getLocalTransform = function(t, r) {
    r = r || [];
    var i = t.originX || 0, n = t.originY || 0, a = t.scaleX, o = t.scaleY, s = t.anchorX, l = t.anchorY, u = t.rotation || 0, h = t.x, f = t.y, c = t.skewX ? Math.tan(t.skewX) : 0, v = t.skewY ? Math.tan(-t.skewY) : 0;
    if (i || n || s || l) {
      var d = i + s, _ = n + l;
      r[4] = -d * a - c * _ * o, r[5] = -_ * o - v * d * a;
    } else
      r[4] = r[5] = 0;
    return r[0] = a, r[3] = o, r[1] = v * a, r[2] = c * o, u && fu(r, r, u), r[4] += i + h, r[5] += n + f, r;
  }, e.initDefaultProps = (function() {
    var t = e.prototype;
    t.scaleX = t.scaleY = t.globalScaleRatio = 1, t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0;
  })(), e;
})(), Fn = [
  "x",
  "y",
  "originX",
  "originY",
  "anchorX",
  "anchorY",
  "rotation",
  "scaleX",
  "scaleY",
  "skewX",
  "skewY"
];
function Ww(e, t) {
  for (var r = 0; r < Fn.length; r++) {
    var i = Fn[r];
    e[i] = t[i];
  }
}
var $h = {};
function te(e, t) {
  t = t || Kr;
  var r = $h[t];
  r || (r = $h[t] = new jn(500));
  var i = r.get(e);
  return i == null && (i = Fi.measureText(e, t).width, r.put(e, i)), i;
}
function Bh(e, t, r, i) {
  var n = te(e, t), a = du(t), o = gn(0, n, r), s = mi(0, a, i), l = new at(o, s, n, a);
  return l;
}
function Wv(e, t, r, i) {
  var n = ((e || "") + "").split(`
`), a = n.length;
  if (a === 1)
    return Bh(n[0], t, r, i);
  for (var o = new at(0, 0, 0, 0), s = 0; s < n.length; s++) {
    var l = Bh(n[s], t, r, i);
    s === 0 ? o.copy(l) : o.union(l);
  }
  return o;
}
function gn(e, t, r) {
  return r === "right" ? e -= t : r === "center" && (e -= t / 2), e;
}
function mi(e, t, r) {
  return r === "middle" ? e -= t / 2 : r === "bottom" && (e -= t), e;
}
function du(e) {
  return te("国", e);
}
function Oi(e, t) {
  return typeof e == "string" ? e.lastIndexOf("%") >= 0 ? parseFloat(e) / 100 * t : parseFloat(e) : e;
}
function Yv(e, t, r) {
  var i = t.position || "inside", n = t.distance != null ? t.distance : 5, a = r.height, o = r.width, s = a / 2, l = r.x, u = r.y, h = "left", f = "top";
  if (i instanceof Array)
    l += Oi(i[0], r.width), u += Oi(i[1], r.height), h = null, f = null;
  else
    switch (i) {
      case "left":
        l -= n, u += s, h = "right", f = "middle";
        break;
      case "right":
        l += n + o, u += s, f = "middle";
        break;
      case "top":
        l += o / 2, u -= n, h = "center", f = "bottom";
        break;
      case "bottom":
        l += o / 2, u += a + n, h = "center";
        break;
      case "inside":
        l += o / 2, u += s, h = "center", f = "middle";
        break;
      case "insideLeft":
        l += n, u += s, f = "middle";
        break;
      case "insideRight":
        l += o - n, u += s, h = "right", f = "middle";
        break;
      case "insideTop":
        l += o / 2, u += n, h = "center";
        break;
      case "insideBottom":
        l += o / 2, u += a - n, h = "center", f = "bottom";
        break;
      case "insideTopLeft":
        l += n, u += n;
        break;
      case "insideTopRight":
        l += o - n, u += n, h = "right";
        break;
      case "insideBottomLeft":
        l += n, u += a - n, f = "bottom";
        break;
      case "insideBottomRight":
        l += o - n, u += a - n, h = "right", f = "bottom";
        break;
    }
  return e = e || {}, e.x = l, e.y = u, e.align = h, e.verticalAlign = f, e;
}
var cs = "__zr_normal__", vs = Fn.concat(["ignore"]), Yw = dr(Fn, function(e, t) {
  return e[t] = !0, e;
}, { ignore: !1 }), ai = {}, Xw = new at(0, 0, 0, 0), Io = (function() {
  function e(t) {
    this.id = wv(), this.animators = [], this.currentStates = [], this.states = {}, this._init(t);
  }
  return e.prototype._init = function(t) {
    this.attr(t);
  }, e.prototype.drift = function(t, r, i) {
    switch (this.draggable) {
      case "horizontal":
        r = 0;
        break;
      case "vertical":
        t = 0;
        break;
    }
    var n = this.transform;
    n || (n = this.transform = [1, 0, 0, 1, 0, 0]), n[4] += t, n[5] += r, this.decomposeTransform(), this.markRedraw();
  }, e.prototype.beforeUpdate = function() {
  }, e.prototype.afterUpdate = function() {
  }, e.prototype.update = function() {
    this.updateTransform(), this.__dirty && this.updateInnerText();
  }, e.prototype.updateInnerText = function(t) {
    var r = this._textContent;
    if (r && (!r.ignore || t)) {
      this.textConfig || (this.textConfig = {});
      var i = this.textConfig, n = i.local, a = r.innerTransformable, o = void 0, s = void 0, l = !1;
      a.parent = n ? this : null;
      var u = !1;
      if (a.copyTransform(r), i.position != null) {
        var h = Xw;
        i.layoutRect ? h.copy(i.layoutRect) : h.copy(this.getBoundingRect()), n || h.applyTransform(this.transform), this.calculateTextPosition ? this.calculateTextPosition(ai, i, h) : Yv(ai, i, h), a.x = ai.x, a.y = ai.y, o = ai.align, s = ai.verticalAlign;
        var f = i.origin;
        if (f && i.rotation != null) {
          var c = void 0, v = void 0;
          f === "center" ? (c = h.width * 0.5, v = h.height * 0.5) : (c = Oi(f[0], h.width), v = Oi(f[1], h.height)), u = !0, a.originX = -a.x + c + (n ? 0 : h.x), a.originY = -a.y + v + (n ? 0 : h.y);
        }
      }
      i.rotation != null && (a.rotation = i.rotation);
      var d = i.offset;
      d && (a.x += d[0], a.y += d[1], u || (a.originX = -d[0], a.originY = -d[1]));
      var _ = i.inside == null ? typeof i.position == "string" && i.position.indexOf("inside") >= 0 : i.inside, p = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {}), g = void 0, m = void 0, y = void 0;
      _ && this.canBeInsideText() ? (g = i.insideFill, m = i.insideStroke, (g == null || g === "auto") && (g = this.getInsideTextFill()), (m == null || m === "auto") && (m = this.getInsideTextStroke(g), y = !0)) : (g = i.outsideFill, m = i.outsideStroke, (g == null || g === "auto") && (g = this.getOutsideFill()), (m == null || m === "auto") && (m = this.getOutsideStroke(g), y = !0)), g = g || "#000", (g !== p.fill || m !== p.stroke || y !== p.autoStroke || o !== p.align || s !== p.verticalAlign) && (l = !0, p.fill = g, p.stroke = m, p.autoStroke = y, p.align = o, p.verticalAlign = s, r.setDefaultTextStyle(p)), r.__dirty |= Qt, l && r.dirtyStyle(!0);
    }
  }, e.prototype.canBeInsideText = function() {
    return !0;
  }, e.prototype.getInsideTextFill = function() {
    return "#fff";
  }, e.prototype.getInsideTextStroke = function(t) {
    return "#000";
  }, e.prototype.getOutsideFill = function() {
    return this.__zr && this.__zr.isDarkMode() ? Tl : Sl;
  }, e.prototype.getOutsideStroke = function(t) {
    var r = this.__zr && this.__zr.getBackgroundColor(), i = typeof r == "string" && Ei(r);
    i || (i = [255, 255, 255, 1]);
    for (var n = i[3], a = this.__zr.isDarkMode(), o = 0; o < 3; o++)
      i[o] = i[o] * n + (a ? 0 : 255) * (1 - n);
    return i[3] = 1, zv(i, "rgba");
  }, e.prototype.traverse = function(t, r) {
  }, e.prototype.attrKV = function(t, r) {
    t === "textConfig" ? this.setTextConfig(r) : t === "textContent" ? this.setTextContent(r) : t === "clipPath" ? this.setClipPath(r) : t === "extra" ? (this.extra = this.extra || {}, I(this.extra, r)) : this[t] = r;
  }, e.prototype.hide = function() {
    this.ignore = !0, this.markRedraw();
  }, e.prototype.show = function() {
    this.ignore = !1, this.markRedraw();
  }, e.prototype.attr = function(t, r) {
    if (typeof t == "string")
      this.attrKV(t, r);
    else if (B(t))
      for (var i = t, n = pt(i), a = 0; a < n.length; a++) {
        var o = n[a];
        this.attrKV(o, t[o]);
      }
    return this.markRedraw(), this;
  }, e.prototype.saveCurrentToNormalState = function(t) {
    this._innerSaveToNormal(t);
    for (var r = this._normalState, i = 0; i < this.animators.length; i++) {
      var n = this.animators[i], a = n.__fromStateTransition;
      if (!(n.getLoop() || a && a !== cs)) {
        var o = n.targetName, s = o ? r[o] : r;
        n.saveTo(s);
      }
    }
  }, e.prototype._innerSaveToNormal = function(t) {
    var r = this._normalState;
    r || (r = this._normalState = {}), t.textConfig && !r.textConfig && (r.textConfig = this.textConfig), this._savePrimaryToNormal(t, r, vs);
  }, e.prototype._savePrimaryToNormal = function(t, r, i) {
    for (var n = 0; n < i.length; n++) {
      var a = i[n];
      t[a] != null && !(a in r) && (r[a] = this[a]);
    }
  }, e.prototype.hasState = function() {
    return this.currentStates.length > 0;
  }, e.prototype.getState = function(t) {
    return this.states[t];
  }, e.prototype.ensureState = function(t) {
    var r = this.states;
    return r[t] || (r[t] = {}), r[t];
  }, e.prototype.clearStates = function(t) {
    this.useState(cs, !1, t);
  }, e.prototype.useState = function(t, r, i, n) {
    var a = t === cs, o = this.hasState();
    if (!(!o && a)) {
      var s = this.currentStates, l = this.stateTransition;
      if (!(st(s, t) >= 0 && (r || s.length === 1))) {
        var u;
        if (this.stateProxy && !a && (u = this.stateProxy(t)), u || (u = this.states && this.states[t]), !u && !a) {
          Wr("State " + t + " not exists.");
          return;
        }
        a || this.saveCurrentToNormalState(u);
        var h = !!(u && u.hoverLayer || n);
        h && this._toggleHoverLayerFlag(!0), this._applyStateObj(t, u, this._normalState, r, !i && !this.__inHover && l && l.duration > 0, l);
        var f = this._textContent, c = this._textGuide;
        return f && f.useState(t, r, i, h), c && c.useState(t, r, i, h), a ? (this.currentStates = [], this._normalState = {}) : r ? this.currentStates.push(t) : this.currentStates = [t], this._updateAnimationTargets(), this.markRedraw(), !h && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~Qt), u;
      }
    }
  }, e.prototype.useStates = function(t, r, i) {
    if (!t.length)
      this.clearStates();
    else {
      var n = [], a = this.currentStates, o = t.length, s = o === a.length;
      if (s) {
        for (var l = 0; l < o; l++)
          if (t[l] !== a[l]) {
            s = !1;
            break;
          }
      }
      if (s)
        return;
      for (var l = 0; l < o; l++) {
        var u = t[l], h = void 0;
        this.stateProxy && (h = this.stateProxy(u, t)), h || (h = this.states[u]), h && n.push(h);
      }
      var f = n[o - 1], c = !!(f && f.hoverLayer || i);
      c && this._toggleHoverLayerFlag(!0);
      var v = this._mergeStates(n), d = this.stateTransition;
      this.saveCurrentToNormalState(v), this._applyStateObj(t.join(","), v, this._normalState, !1, !r && !this.__inHover && d && d.duration > 0, d);
      var _ = this._textContent, p = this._textGuide;
      _ && _.useStates(t, r, c), p && p.useStates(t, r, c), this._updateAnimationTargets(), this.currentStates = t.slice(), this.markRedraw(), !c && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~Qt);
    }
  }, e.prototype.isSilent = function() {
    for (var t = this.silent, r = this.parent; !t && r; ) {
      if (r.silent) {
        t = !0;
        break;
      }
      r = r.parent;
    }
    return t;
  }, e.prototype._updateAnimationTargets = function() {
    for (var t = 0; t < this.animators.length; t++) {
      var r = this.animators[t];
      r.targetName && r.changeTarget(this[r.targetName]);
    }
  }, e.prototype.removeState = function(t) {
    var r = st(this.currentStates, t);
    if (r >= 0) {
      var i = this.currentStates.slice();
      i.splice(r, 1), this.useStates(i);
    }
  }, e.prototype.replaceState = function(t, r, i) {
    var n = this.currentStates.slice(), a = st(n, t), o = st(n, r) >= 0;
    a >= 0 ? o ? n.splice(a, 1) : n[a] = r : i && !o && n.push(r), this.useStates(n);
  }, e.prototype.toggleState = function(t, r) {
    r ? this.useState(t, !0) : this.removeState(t);
  }, e.prototype._mergeStates = function(t) {
    for (var r = {}, i, n = 0; n < t.length; n++) {
      var a = t[n];
      I(r, a), a.textConfig && (i = i || {}, I(i, a.textConfig));
    }
    return i && (r.textConfig = i), r;
  }, e.prototype._applyStateObj = function(t, r, i, n, a, o) {
    var s = !(r && n);
    r && r.textConfig ? (this.textConfig = I({}, n ? this.textConfig : i.textConfig), I(this.textConfig, r.textConfig)) : s && i.textConfig && (this.textConfig = i.textConfig);
    for (var l = {}, u = !1, h = 0; h < vs.length; h++) {
      var f = vs[h], c = a && Yw[f];
      r && r[f] != null ? c ? (u = !0, l[f] = r[f]) : this[f] = r[f] : s && i[f] != null && (c ? (u = !0, l[f] = i[f]) : this[f] = i[f]);
    }
    if (!a)
      for (var h = 0; h < this.animators.length; h++) {
        var v = this.animators[h], d = v.targetName;
        v.getLoop() || v.__changeFinalValue(d ? (r || i)[d] : r || i);
      }
    u && this._transitionState(t, l, o);
  }, e.prototype._attachComponent = function(t) {
    if (t.__zr && !t.__hostTarget) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("Text element has been added to zrender.");
      return;
    }
    if (t === this) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("Recursive component attachment.");
      return;
    }
    var r = this.__zr;
    r && t.addSelfToZr(r), t.__zr = r, t.__hostTarget = this;
  }, e.prototype._detachComponent = function(t) {
    t.__zr && t.removeSelfFromZr(t.__zr), t.__zr = null, t.__hostTarget = null;
  }, e.prototype.getClipPath = function() {
    return this._clipPath;
  }, e.prototype.setClipPath = function(t) {
    this._clipPath && this._clipPath !== t && this.removeClipPath(), this._attachComponent(t), this._clipPath = t, this.markRedraw();
  }, e.prototype.removeClipPath = function() {
    var t = this._clipPath;
    t && (this._detachComponent(t), this._clipPath = null, this.markRedraw());
  }, e.prototype.getTextContent = function() {
    return this._textContent;
  }, e.prototype.setTextContent = function(t) {
    var r = this._textContent;
    if (r !== t) {
      if (r && r !== t && this.removeTextContent(), process.env.NODE_ENV !== "production" && t.__zr && !t.__hostTarget)
        throw new Error("Text element has been added to zrender.");
      t.innerTransformable = new vu(), this._attachComponent(t), this._textContent = t, this.markRedraw();
    }
  }, e.prototype.setTextConfig = function(t) {
    this.textConfig || (this.textConfig = {}), I(this.textConfig, t), this.markRedraw();
  }, e.prototype.removeTextConfig = function() {
    this.textConfig = null, this.markRedraw();
  }, e.prototype.removeTextContent = function() {
    var t = this._textContent;
    t && (t.innerTransformable = null, this._detachComponent(t), this._textContent = null, this._innerTextDefaultStyle = null, this.markRedraw());
  }, e.prototype.getTextGuideLine = function() {
    return this._textGuide;
  }, e.prototype.setTextGuideLine = function(t) {
    this._textGuide && this._textGuide !== t && this.removeTextGuideLine(), this._attachComponent(t), this._textGuide = t, this.markRedraw();
  }, e.prototype.removeTextGuideLine = function() {
    var t = this._textGuide;
    t && (this._detachComponent(t), this._textGuide = null, this.markRedraw());
  }, e.prototype.markRedraw = function() {
    this.__dirty |= Qt;
    var t = this.__zr;
    t && (this.__inHover ? t.refreshHover() : t.refresh()), this.__hostTarget && this.__hostTarget.markRedraw();
  }, e.prototype.dirty = function() {
    this.markRedraw();
  }, e.prototype._toggleHoverLayerFlag = function(t) {
    this.__inHover = t;
    var r = this._textContent, i = this._textGuide;
    r && (r.__inHover = t), i && (i.__inHover = t);
  }, e.prototype.addSelfToZr = function(t) {
    if (this.__zr !== t) {
      this.__zr = t;
      var r = this.animators;
      if (r)
        for (var i = 0; i < r.length; i++)
          t.animation.addAnimator(r[i]);
      this._clipPath && this._clipPath.addSelfToZr(t), this._textContent && this._textContent.addSelfToZr(t), this._textGuide && this._textGuide.addSelfToZr(t);
    }
  }, e.prototype.removeSelfFromZr = function(t) {
    if (this.__zr) {
      this.__zr = null;
      var r = this.animators;
      if (r)
        for (var i = 0; i < r.length; i++)
          t.animation.removeAnimator(r[i]);
      this._clipPath && this._clipPath.removeSelfFromZr(t), this._textContent && this._textContent.removeSelfFromZr(t), this._textGuide && this._textGuide.removeSelfFromZr(t);
    }
  }, e.prototype.animate = function(t, r, i) {
    var n = t ? this[t] : this;
    if (process.env.NODE_ENV !== "production" && !n) {
      Wr('Property "' + t + '" is not existed in element ' + this.id);
      return;
    }
    var a = new cu(n, r, i);
    return t && (a.targetName = t), this.addAnimator(a, t), a;
  }, e.prototype.addAnimator = function(t, r) {
    var i = this.__zr, n = this;
    t.during(function() {
      n.updateDuringAnimation(r);
    }).done(function() {
      var a = n.animators, o = st(a, t);
      o >= 0 && a.splice(o, 1);
    }), this.animators.push(t), i && i.animation.addAnimator(t), i && i.wakeUp();
  }, e.prototype.updateDuringAnimation = function(t) {
    this.markRedraw();
  }, e.prototype.stopAnimation = function(t, r) {
    for (var i = this.animators, n = i.length, a = [], o = 0; o < n; o++) {
      var s = i[o];
      !t || t === s.scope ? s.stop(r) : a.push(s);
    }
    return this.animators = a, this;
  }, e.prototype.animateTo = function(t, r, i) {
    ds(this, t, r, i);
  }, e.prototype.animateFrom = function(t, r, i) {
    ds(this, t, r, i, !0);
  }, e.prototype._transitionState = function(t, r, i, n) {
    for (var a = ds(this, r, i, n), o = 0; o < a.length; o++)
      a[o].__fromStateTransition = t;
  }, e.prototype.getBoundingRect = function() {
    return null;
  }, e.prototype.getPaintRect = function() {
    return null;
  }, e.initDefaultProps = (function() {
    var t = e.prototype;
    t.type = "element", t.name = "", t.ignore = t.silent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = t.__inHover = !1, t.__dirty = Qt;
    var r = {};
    function i(a, o, s) {
      r[a + o + s] || (console.warn("DEPRECATED: '" + a + "' has been deprecated. use '" + o + "', '" + s + "' instead"), r[a + o + s] = !0);
    }
    function n(a, o, s, l) {
      Object.defineProperty(t, a, {
        get: function() {
          if (process.env.NODE_ENV !== "production" && i(a, s, l), !this[o]) {
            var h = this[o] = [];
            u(this, h);
          }
          return this[o];
        },
        set: function(h) {
          process.env.NODE_ENV !== "production" && i(a, s, l), this[s] = h[0], this[l] = h[1], this[o] = h, u(this, h);
        }
      });
      function u(h, f) {
        Object.defineProperty(f, 0, {
          get: function() {
            return h[s];
          },
          set: function(c) {
            h[s] = c;
          }
        }), Object.defineProperty(f, 1, {
          get: function() {
            return h[l];
          },
          set: function(c) {
            h[l] = c;
          }
        });
      }
    }
    Object.defineProperty && (n("position", "_legacyPos", "x", "y"), n("scale", "_legacyScale", "scaleX", "scaleY"), n("origin", "_legacyOrigin", "originX", "originY"));
  })(), e;
})();
Ke(Io, $e);
Ke(Io, vu);
function ds(e, t, r, i, n) {
  r = r || {};
  var a = [];
  Xv(e, "", e, t, r, i, a, n);
  var o = a.length, s = !1, l = r.done, u = r.aborted, h = function() {
    s = !0, o--, o <= 0 && (s ? l && l() : u && u());
  }, f = function() {
    o--, o <= 0 && (s ? l && l() : u && u());
  };
  o || l && l(), a.length > 0 && r.during && a[0].during(function(d, _) {
    r.during(_);
  });
  for (var c = 0; c < a.length; c++) {
    var v = a[c];
    h && v.done(h), f && v.aborted(f), r.force && v.duration(r.duration), v.start(r.easing);
  }
  return a;
}
function ps(e, t, r) {
  for (var i = 0; i < r; i++)
    e[i] = t[i];
}
function qw(e) {
  return Yt(e[0]);
}
function Zw(e, t, r) {
  if (Yt(t[r]))
    if (Yt(e[r]) || (e[r] = []), $t(t[r])) {
      var i = t[r].length;
      e[r].length !== i && (e[r] = new t[r].constructor(i), ps(e[r], t[r], i));
    } else {
      var n = t[r], a = e[r], o = n.length;
      if (qw(n))
        for (var s = n[0].length, l = 0; l < o; l++)
          a[l] ? ps(a[l], n[l], s) : a[l] = Array.prototype.slice.call(n[l]);
      else
        ps(a, n, o);
      a.length = n.length;
    }
  else
    e[r] = t[r];
}
function Kw(e, t) {
  return e === t || Yt(e) && Yt(t) && jw(e, t);
}
function jw(e, t) {
  var r = e.length;
  if (r !== t.length)
    return !1;
  for (var i = 0; i < r; i++)
    if (e[i] !== t[i])
      return !1;
  return !0;
}
function Xv(e, t, r, i, n, a, o, s) {
  for (var l = pt(i), u = n.duration, h = n.delay, f = n.additive, c = n.setToFinal, v = !B(a), d = e.animators, _ = [], p = 0; p < l.length; p++) {
    var g = l[p], m = i[g];
    if (m != null && r[g] != null && (v || a[g]))
      if (B(m) && !Yt(m) && !Po(m)) {
        if (t) {
          s || (r[g] = m, e.updateDuringAnimation(t));
          continue;
        }
        Xv(e, g, r[g], m, n, a && a[g], o, s);
      } else
        _.push(g);
    else s || (r[g] = m, e.updateDuringAnimation(t), _.push(g));
  }
  var y = _.length;
  if (!f && y)
    for (var w = 0; w < d.length; w++) {
      var S = d[w];
      if (S.targetName === t) {
        var b = S.stopTracks(_);
        if (b) {
          var T = st(d, S);
          d.splice(T, 1);
        }
      }
    }
  if (n.force || (_ = ge(_, function(A) {
    return !Kw(i[A], r[A]);
  }), y = _.length), y > 0 || n.force && !o.length) {
    var C = void 0, x = void 0, E = void 0;
    if (s) {
      x = {}, c && (C = {});
      for (var w = 0; w < y; w++) {
        var g = _[w];
        x[g] = r[g], c ? C[g] = i[g] : r[g] = i[g];
      }
    } else if (c) {
      E = {};
      for (var w = 0; w < y; w++) {
        var g = _[w];
        E[g] = Na(r[g]), Zw(r, i, g);
      }
    }
    var S = new cu(r, !1, !1, f ? ge(d, function(M) {
      return M.targetName === t;
    }) : null);
    S.targetName = t, n.scope && (S.scope = n.scope), c && C && S.whenWithKeys(0, C, _), E && S.whenWithKeys(0, E, _), S.whenWithKeys(u ?? 500, s ? x : i, _).delay(h || 0), e.addAnimator(S, t), o.push(S);
  }
}
var Ze = (function(e) {
  W(t, e);
  function t(r) {
    var i = e.call(this) || this;
    return i.isGroup = !0, i._children = [], i.attr(r), i;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.children = function() {
    return this._children.slice();
  }, t.prototype.childAt = function(r) {
    return this._children[r];
  }, t.prototype.childOfName = function(r) {
    for (var i = this._children, n = 0; n < i.length; n++)
      if (i[n].name === r)
        return i[n];
  }, t.prototype.childCount = function() {
    return this._children.length;
  }, t.prototype.add = function(r) {
    if (r && (r !== this && r.parent !== this && (this._children.push(r), this._doAdd(r)), process.env.NODE_ENV !== "production" && r.__hostTarget))
      throw "This elemenet has been used as an attachment";
    return this;
  }, t.prototype.addBefore = function(r, i) {
    if (r && r !== this && r.parent !== this && i && i.parent === this) {
      var n = this._children, a = n.indexOf(i);
      a >= 0 && (n.splice(a, 0, r), this._doAdd(r));
    }
    return this;
  }, t.prototype.replace = function(r, i) {
    var n = st(this._children, r);
    return n >= 0 && this.replaceAt(i, n), this;
  }, t.prototype.replaceAt = function(r, i) {
    var n = this._children, a = n[i];
    if (r && r !== this && r.parent !== this && r !== a) {
      n[i] = r, a.parent = null;
      var o = this.__zr;
      o && a.removeSelfFromZr(o), this._doAdd(r);
    }
    return this;
  }, t.prototype._doAdd = function(r) {
    r.parent && r.parent.remove(r), r.parent = this;
    var i = this.__zr;
    i && i !== r.__zr && r.addSelfToZr(i), i && i.refresh();
  }, t.prototype.remove = function(r) {
    var i = this.__zr, n = this._children, a = st(n, r);
    return a < 0 ? this : (n.splice(a, 1), r.parent = null, i && r.removeSelfFromZr(i), i && i.refresh(), this);
  }, t.prototype.removeAll = function() {
    for (var r = this._children, i = this.__zr, n = 0; n < r.length; n++) {
      var a = r[n];
      i && a.removeSelfFromZr(i), a.parent = null;
    }
    return r.length = 0, this;
  }, t.prototype.eachChild = function(r, i) {
    for (var n = this._children, a = 0; a < n.length; a++) {
      var o = n[a];
      r.call(i, o, a);
    }
    return this;
  }, t.prototype.traverse = function(r, i) {
    for (var n = 0; n < this._children.length; n++) {
      var a = this._children[n], o = r.call(i, a);
      a.isGroup && !o && a.traverse(r, i);
    }
    return this;
  }, t.prototype.addSelfToZr = function(r) {
    e.prototype.addSelfToZr.call(this, r);
    for (var i = 0; i < this._children.length; i++) {
      var n = this._children[i];
      n.addSelfToZr(r);
    }
  }, t.prototype.removeSelfFromZr = function(r) {
    e.prototype.removeSelfFromZr.call(this, r);
    for (var i = 0; i < this._children.length; i++) {
      var n = this._children[i];
      n.removeSelfFromZr(r);
    }
  }, t.prototype.getBoundingRect = function(r) {
    for (var i = new at(0, 0, 0, 0), n = r || this._children, a = [], o = null, s = 0; s < n.length; s++) {
      var l = n[s];
      if (!(l.ignore || l.invisible)) {
        var u = l.getBoundingRect(), h = l.getLocalTransform(a);
        h ? (at.applyTransform(i, u, h), o = o || i.clone(), o.union(i)) : (o = o || u.clone(), o.union(u));
      }
    }
    return o || i;
  }, t;
})(Io);
Ze.prototype.type = "group";
var _n = {}, qv = {};
function Qw(e) {
  delete qv[e];
}
function Jw(e) {
  if (!e)
    return !1;
  if (typeof e == "string")
    return ro(e, 1) < bl;
  if (e.colorStops) {
    for (var t = e.colorStops, r = 0, i = t.length, n = 0; n < i; n++)
      r += ro(t[n].color, 1);
    return r /= i, r < bl;
  }
  return !1;
}
var t1 = (function() {
  function e(t, r, i) {
    var n = this;
    this._sleepAfterStill = 10, this._stillFrameAccum = 0, this._needsRefresh = !0, this._needsRefreshHover = !0, this._darkMode = !1, i = i || {}, this.dom = r, this.id = t;
    var a = new ww(), o = i.renderer || "canvas";
    if (_n[o] || (o = pt(_n)[0]), process.env.NODE_ENV !== "production" && !_n[o])
      throw new Error("Renderer '" + o + "' is not imported. Please import it first.");
    i.useDirtyRect = i.useDirtyRect == null ? !1 : i.useDirtyRect;
    var s = new _n[o](r, a, i, t), l = i.ssr || s.ssrOnly;
    this.storage = a, this.painter = s;
    var u = !V.node && !V.worker && !l ? new Uw(s.getViewportRoot(), s.root) : null, h = i.useCoarsePointer, f = h == null || h === "auto" ? V.touchEventsSupported : !!h, c = 44, v;
    f && (v = X(i.pointerSize, c)), this.handler = new Pv(a, s, u, s.root, v), this.animation = new Nw({
      stage: {
        update: l ? null : function() {
          return n._flush(!0);
        }
      }
    }), l || this.animation.start();
  }
  return e.prototype.add = function(t) {
    this._disposed || !t || (this.storage.addRoot(t), t.addSelfToZr(this), this.refresh());
  }, e.prototype.remove = function(t) {
    this._disposed || !t || (this.storage.delRoot(t), t.removeSelfFromZr(this), this.refresh());
  }, e.prototype.configLayer = function(t, r) {
    this._disposed || (this.painter.configLayer && this.painter.configLayer(t, r), this.refresh());
  }, e.prototype.setBackgroundColor = function(t) {
    this._disposed || (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this.refresh(), this._backgroundColor = t, this._darkMode = Jw(t));
  }, e.prototype.getBackgroundColor = function() {
    return this._backgroundColor;
  }, e.prototype.setDarkMode = function(t) {
    this._darkMode = t;
  }, e.prototype.isDarkMode = function() {
    return this._darkMode;
  }, e.prototype.refreshImmediately = function(t) {
    this._disposed || (t || this.animation.update(!0), this._needsRefresh = !1, this.painter.refresh(), this._needsRefresh = !1);
  }, e.prototype.refresh = function() {
    this._disposed || (this._needsRefresh = !0, this.animation.start());
  }, e.prototype.flush = function() {
    this._disposed || this._flush(!1);
  }, e.prototype._flush = function(t) {
    var r, i = bi();
    this._needsRefresh && (r = !0, this.refreshImmediately(t)), this._needsRefreshHover && (r = !0, this.refreshHoverImmediately());
    var n = bi();
    r ? (this._stillFrameAccum = 0, this.trigger("rendered", {
      elapsedTime: n - i
    })) : this._sleepAfterStill > 0 && (this._stillFrameAccum++, this._stillFrameAccum > this._sleepAfterStill && this.animation.stop());
  }, e.prototype.setSleepAfterStill = function(t) {
    this._sleepAfterStill = t;
  }, e.prototype.wakeUp = function() {
    this._disposed || (this.animation.start(), this._stillFrameAccum = 0);
  }, e.prototype.refreshHover = function() {
    this._needsRefreshHover = !0;
  }, e.prototype.refreshHoverImmediately = function() {
    this._disposed || (this._needsRefreshHover = !1, this.painter.refreshHover && this.painter.getType() === "canvas" && this.painter.refreshHover());
  }, e.prototype.resize = function(t) {
    this._disposed || (t = t || {}, this.painter.resize(t.width, t.height), this.handler.resize());
  }, e.prototype.clearAnimation = function() {
    this._disposed || this.animation.clear();
  }, e.prototype.getWidth = function() {
    if (!this._disposed)
      return this.painter.getWidth();
  }, e.prototype.getHeight = function() {
    if (!this._disposed)
      return this.painter.getHeight();
  }, e.prototype.setCursorStyle = function(t) {
    this._disposed || this.handler.setCursorStyle(t);
  }, e.prototype.findHover = function(t, r) {
    if (!this._disposed)
      return this.handler.findHover(t, r);
  }, e.prototype.on = function(t, r, i) {
    return this._disposed || this.handler.on(t, r, i), this;
  }, e.prototype.off = function(t, r) {
    this._disposed || this.handler.off(t, r);
  }, e.prototype.trigger = function(t, r) {
    this._disposed || this.handler.trigger(t, r);
  }, e.prototype.clear = function() {
    if (!this._disposed) {
      for (var t = this.storage.getRoots(), r = 0; r < t.length; r++)
        t[r] instanceof Ze && t[r].removeSelfFromZr(this);
      this.storage.delAllRoots(), this.painter.clear();
    }
  }, e.prototype.dispose = function() {
    this._disposed || (this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null, this._disposed = !0, Qw(this.id));
  }, e;
})();
function Fh(e, t) {
  var r = new t1(wv(), e, t);
  return qv[r.id] = r, r;
}
function e1(e, t) {
  _n[e] = t;
}
var Vh = 1e-4, Zv = 20;
function r1(e) {
  return e.replace(/^\s+|\s+$/g, "");
}
function i1(e, t, r, i) {
  var n = t[0], a = t[1], o = r[0], s = r[1], l = a - n, u = s - o;
  if (l === 0)
    return u === 0 ? o : (o + s) / 2;
  {
    if (e === n)
      return o;
    if (e === a)
      return s;
  }
  return (e - n) / l * u + o;
}
function wt(e, t) {
  switch (e) {
    case "center":
    case "middle":
      e = "50%";
      break;
    case "left":
    case "top":
      e = "0%";
      break;
    case "right":
    case "bottom":
      e = "100%";
      break;
  }
  return z(e) ? r1(e).match(/%$/) ? parseFloat(e) / 100 * t : parseFloat(e) : e == null ? NaN : +e;
}
function n1(e, t, r) {
  return t == null && (t = 10), t = Math.min(Math.max(0, t), Zv), e = (+e).toFixed(t), r ? e : +e;
}
function zh(e) {
  if (e = +e, isNaN(e))
    return 0;
  if (e > 1e-14) {
    for (var t = 1, r = 0; r < 15; r++, t *= 10)
      if (Math.round(e * t) / t === e)
        return r;
  }
  return a1(e);
}
function a1(e) {
  var t = e.toString().toLowerCase(), r = t.indexOf("e"), i = r > 0 ? +t.slice(r + 1) : 0, n = r > 0 ? r : t.length, a = t.indexOf("."), o = a < 0 ? 0 : n - 1 - a;
  return Math.max(0, o - i);
}
function o1(e, t) {
  var r = dr(e, function(v, d) {
    return v + (isNaN(d) ? 0 : d);
  }, 0);
  if (r === 0)
    return [];
  for (var i = Math.pow(10, t), n = Q(e, function(v) {
    return (isNaN(v) ? 0 : v) / r * i * 100;
  }), a = i * 100, o = Q(n, function(v) {
    return Math.floor(v);
  }), s = dr(o, function(v, d) {
    return v + d;
  }, 0), l = Q(n, function(v, d) {
    return v - o[d];
  }); s < a; ) {
    for (var u = Number.NEGATIVE_INFINITY, h = null, f = 0, c = l.length; f < c; ++f)
      l[f] > u && (u = l[f], h = f);
    ++o[h], l[h] = 0, ++s;
  }
  return Q(o, function(v) {
    return v / i;
  });
}
function s1(e, t) {
  var r = Math.max(zh(e), zh(t)), i = e + t;
  return r > Zv ? i : n1(i, r);
}
function Kv(e) {
  var t = Math.PI * 2;
  return (e % t + t) % t;
}
function no(e) {
  return e > -Vh && e < Vh;
}
var l1 = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function Ro(e) {
  if (e instanceof Date)
    return e;
  if (z(e)) {
    var t = l1.exec(e);
    if (!t)
      return /* @__PURE__ */ new Date(NaN);
    if (t[8]) {
      var r = +t[4] || 0;
      return t[8].toUpperCase() !== "Z" && (r -= +t[8].slice(0, 3)), new Date(Date.UTC(+t[1], +(t[2] || 1) - 1, +t[3] || 1, r, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0));
    } else
      return new Date(+t[1], +(t[2] || 1) - 1, +t[3] || 1, +t[4] || 0, +(t[5] || 0), +t[6] || 0, t[7] ? +t[7].substring(0, 3) : 0);
  } else if (e == null)
    return /* @__PURE__ */ new Date(NaN);
  return new Date(Math.round(e));
}
function ao(e) {
  var t = parseFloat(e);
  return t == e && (t !== 0 || !z(e) || e.indexOf("x") <= 0) ? t : NaN;
}
function jv(e) {
  return !isNaN(ao(e));
}
function Qv() {
  return Math.round(Math.random() * 9);
}
function Jv(e, t) {
  return t === 0 ? e : Jv(t, e % t);
}
function Hh(e, t) {
  return e == null ? t : t == null ? e : e * t / Jv(e, t);
}
var u1 = "[ECharts] ", Uh = {}, h1 = typeof console < "u" && console.warn && console.log;
function Oo(e, t, r) {
  if (h1) {
    if (r) {
      if (Uh[t])
        return;
      Uh[t] = !0;
    }
    console[e](u1 + t);
  }
}
function f1(e, t) {
  Oo("log", e, t);
}
function _e(e, t) {
  Oo("warn", e, t);
}
function It(e, t) {
  Oo("error", e, t);
}
function Oe(e) {
  process.env.NODE_ENV !== "production" && Oo("warn", "DEPRECATED: " + e, !0);
}
function bt(e, t, r) {
  process.env.NODE_ENV !== "production" && Oe((r ? "[" + r + "]" : "") + (e + " is deprecated, use " + t + " instead."));
}
function oo() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  var r = "";
  if (process.env.NODE_ENV !== "production") {
    var i = function(n) {
      return n === void 0 ? "undefined" : n === 1 / 0 ? "Infinity" : n === -1 / 0 ? "-Infinity" : bv(n) ? "NaN" : n instanceof Date ? "Date(" + n.toISOString() + ")" : rt(n) ? "function () { ... }" : B0(n) ? n + "" : null;
    };
    r = Q(e, function(n) {
      if (z(n))
        return n;
      var a = i(n);
      if (a != null)
        return a;
      if (typeof JSON < "u" && JSON.stringify)
        try {
          return JSON.stringify(n, function(o, s) {
            var l = i(s);
            return l ?? s;
          });
        } catch {
          return "?";
        }
      else
        return "?";
    }).join(" ");
  }
  return r;
}
function Ht(e) {
  throw new Error(e);
}
var td = "series\0", c1 = "\0_ec_\0";
function Nt(e) {
  return e instanceof Array ? e : e == null ? [] : [e];
}
function Cl(e, t, r) {
  if (e) {
    e[t] = e[t] || {}, e.emphasis = e.emphasis || {}, e.emphasis[t] = e.emphasis[t] || {};
    for (var i = 0, n = r.length; i < n; i++) {
      var a = r[i];
      !e.emphasis[t].hasOwnProperty(a) && e[t].hasOwnProperty(a) && (e.emphasis[t][a] = e[t][a]);
    }
  }
}
var Gh = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function ko(e) {
  return B(e) && !k(e) && !(e instanceof Date) ? e.value : e;
}
function v1(e) {
  return B(e) && !(e instanceof Array);
}
function d1(e, t, r) {
  var i = r === "normalMerge", n = r === "replaceMerge", a = r === "replaceAll";
  e = e || [], t = (t || []).slice();
  var o = et();
  D(t, function(l, u) {
    if (!B(l)) {
      t[u] = null;
      return;
    }
    process.env.NODE_ENV !== "production" && (l.id != null && !Yh(l.id) && Wh(l.id), l.name != null && !Yh(l.name) && Wh(l.name));
  });
  var s = p1(e, o, r);
  return (i || n) && g1(s, e, o, t), i && _1(s, t), i || n ? m1(s, t, n) : a && y1(s, t), w1(s), s;
}
function p1(e, t, r) {
  var i = [];
  if (r === "replaceAll")
    return i;
  for (var n = 0; n < e.length; n++) {
    var a = e[n];
    a && a.id != null && t.set(a.id, n), i.push({
      existing: r === "replaceMerge" || ki(a) ? null : a,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return i;
}
function g1(e, t, r, i) {
  D(i, function(n, a) {
    if (!(!n || n.id == null)) {
      var o = En(n.id), s = r.get(o);
      if (s != null) {
        var l = e[s];
        j(!l.newOption, 'Duplicated option on id "' + o + '".'), l.newOption = n, l.existing = t[s], i[a] = null;
      }
    }
  });
}
function _1(e, t) {
  D(t, function(r, i) {
    if (!(!r || r.name == null))
      for (var n = 0; n < e.length; n++) {
        var a = e[n].existing;
        if (!e[n].newOption && a && (a.id == null || r.id == null) && !ki(r) && !ki(a) && ed("name", a, r)) {
          e[n].newOption = r, t[i] = null;
          return;
        }
      }
  });
}
function m1(e, t, r) {
  D(t, function(i) {
    if (i) {
      for (
        var n, a = 0;
        // Be `!resultItem` only when `nextIdx >= result.length`.
        (n = e[a]) && (n.newOption || ki(n.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
        n.existing && i.id != null && !ed("id", i, n.existing));
      )
        a++;
      n ? (n.newOption = i, n.brandNew = r) : e.push({
        newOption: i,
        brandNew: r,
        existing: null,
        keyInfo: null
      }), a++;
    }
  });
}
function y1(e, t) {
  D(t, function(r) {
    e.push({
      newOption: r,
      brandNew: !0,
      existing: null,
      keyInfo: null
    });
  });
}
function w1(e) {
  var t = et();
  D(e, function(r) {
    var i = r.existing;
    i && t.set(i.id, r);
  }), D(e, function(r) {
    var i = r.newOption;
    j(!i || i.id == null || !t.get(i.id) || t.get(i.id) === r, "id duplicates: " + (i && i.id)), i && i.id != null && t.set(i.id, r), !r.keyInfo && (r.keyInfo = {});
  }), D(e, function(r, i) {
    var n = r.existing, a = r.newOption, o = r.keyInfo;
    if (B(a)) {
      if (o.name = a.name != null ? En(a.name) : n ? n.name : td + i, n)
        o.id = En(n.id);
      else if (a.id != null)
        o.id = En(a.id);
      else {
        var s = 0;
        do
          o.id = "\0" + o.name + "\0" + s++;
        while (t.get(o.id));
      }
      t.set(o.id, r);
    }
  });
}
function ed(e, t, r) {
  var i = Re(t[e], null), n = Re(r[e], null);
  return i != null && n != null && i === n;
}
function En(e) {
  if (process.env.NODE_ENV !== "production" && e == null)
    throw new Error();
  return Re(e, "");
}
function Re(e, t) {
  return e == null ? t : z(e) ? e : yt(e) || ja(e) ? e + "" : t;
}
function Wh(e) {
  process.env.NODE_ENV !== "production" && _e("`" + e + "` is invalid id or name. Must be a string or number.");
}
function Yh(e) {
  return ja(e) || jv(e);
}
function rd(e) {
  var t = e.name;
  return !!(t && t.indexOf(td));
}
function ki(e) {
  return e && e.id != null && En(e.id).indexOf(c1) === 0;
}
function b1(e, t, r) {
  D(e, function(i) {
    var n = i.newOption;
    B(n) && (i.keyInfo.mainType = t, i.keyInfo.subType = S1(t, n, i.existing, r));
  });
}
function S1(e, t, r, i) {
  var n = t.type ? t.type : r ? r.subType : i.determineSubType(e, t);
  return n;
}
function Qn(e, t) {
  if (t.dataIndexInside != null)
    return t.dataIndexInside;
  if (t.dataIndex != null)
    return k(t.dataIndex) ? Q(t.dataIndex, function(r) {
      return e.indexOfRawIndex(r);
    }) : e.indexOfRawIndex(t.dataIndex);
  if (t.name != null)
    return k(t.name) ? Q(t.name, function(r) {
      return e.indexOfName(r);
    }) : e.indexOfName(t.name);
}
function St() {
  var e = "__ec_inner_" + T1++;
  return function(t) {
    return t[e] || (t[e] = {});
  };
}
var T1 = Qv();
function gs(e, t, r) {
  var i = pu(t, r), n = i.mainTypeSpecified, a = i.queryOptionMap, o = i.others, s = o, l = r ? r.defaultMainType : null;
  return !n && l && a.set(l, {}), a.each(function(u, h) {
    var f = Jn(e, h, u, {
      useDefault: l === h,
      enableAll: r && r.enableAll != null ? r.enableAll : !0,
      enableNone: r && r.enableNone != null ? r.enableNone : !0
    });
    s[h + "Models"] = f.models, s[h + "Model"] = f.models[0];
  }), s;
}
function pu(e, t) {
  var r;
  if (z(e)) {
    var i = {};
    i[e + "Index"] = 0, r = i;
  } else
    r = e;
  var n = et(), a = {}, o = !1;
  return D(r, function(s, l) {
    if (l === "dataIndex" || l === "dataIndexInside") {
      a[l] = s;
      return;
    }
    var u = l.match(/^(\w+)(Index|Id|Name)$/) || [], h = u[1], f = (u[2] || "").toLowerCase();
    if (!(!h || !f || t && t.includeMainTypes && st(t.includeMainTypes, h) < 0)) {
      o = o || !!h;
      var c = n.get(h) || n.set(h, {});
      c[f] = s;
    }
  }), {
    mainTypeSpecified: o,
    queryOptionMap: n,
    others: a
  };
}
var gu = {
  useDefault: !0,
  enableAll: !1,
  enableNone: !1
};
function Jn(e, t, r, i) {
  i = i || gu;
  var n = r.index, a = r.id, o = r.name, s = {
    models: null,
    specified: n != null || a != null || o != null
  };
  if (!s.specified) {
    var l = void 0;
    return s.models = i.useDefault && (l = e.getComponent(t)) ? [l] : [], s;
  }
  return n === "none" || n === !1 ? (j(i.enableNone, '`"none"` or `false` is not a valid value on index option.'), s.models = [], s) : (n === "all" && (j(i.enableAll, '`"all"` is not a valid value on index option.'), n = a = o = null), s.models = e.queryComponents({
    mainType: t,
    index: n,
    id: a,
    name: o
  }), s);
}
function id(e, t, r) {
  e.setAttribute ? e.setAttribute(t, r) : e[t] = r;
}
function C1(e, t) {
  return e.getAttribute ? e.getAttribute(t) : e[t];
}
function x1(e) {
  return e === "auto" ? V.domSupported ? "html" : "richText" : e || "html";
}
var D1 = ".", xr = "___EC__COMPONENT__CONTAINER___", nd = "___EC__EXTENDED_CLASS___";
function Le(e) {
  var t = {
    main: "",
    sub: ""
  };
  if (e) {
    var r = e.split(D1);
    t.main = r[0] || "", t.sub = r[1] || "";
  }
  return t;
}
function E1(e) {
  j(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(e), 'componentType "' + e + '" illegal');
}
function A1(e) {
  return !!(e && e[nd]);
}
function _u(e, t) {
  e.$constructor = e, e.extend = function(r) {
    process.env.NODE_ENV !== "production" && D(t, function(a) {
      r[a] || console.warn("Method `" + a + "` should be implemented" + (r.type ? " in " + r.type : "") + ".");
    });
    var i = this, n;
    return M1(i) ? n = /** @class */
    (function(a) {
      W(o, a);
      function o() {
        return a.apply(this, arguments) || this;
      }
      return o;
    })(i) : (n = function() {
      (r.$constructor || i).apply(this, arguments);
    }, k0(n, this)), I(n.prototype, r), n[nd] = !0, n.extend = this.extend, n.superCall = I1, n.superApply = R1, n.superClass = i, n;
  };
}
function M1(e) {
  return rt(e) && /^class\s/.test(Function.prototype.toString.call(e));
}
function ad(e, t) {
  e.extend = t.extend;
}
var P1 = Math.round(Math.random() * 10);
function L1(e) {
  var t = ["__\0is_clz", P1++].join("_");
  e.prototype[t] = !0, process.env.NODE_ENV !== "production" && j(!e.isInstance, 'The method "is" can not be defined.'), e.isInstance = function(r) {
    return !!(r && r[t]);
  };
}
function I1(e, t) {
  for (var r = [], i = 2; i < arguments.length; i++)
    r[i - 2] = arguments[i];
  return this.superClass.prototype[t].apply(e, r);
}
function R1(e, t, r) {
  return this.superClass.prototype[t].apply(e, r);
}
function mu(e) {
  var t = {};
  e.registerClass = function(i) {
    var n = i.type || i.prototype.type;
    if (n) {
      E1(n), i.prototype.type = n;
      var a = Le(n);
      if (!a.sub)
        process.env.NODE_ENV !== "production" && t[a.main] && console.warn(a.main + " exists."), t[a.main] = i;
      else if (a.sub !== xr) {
        var o = r(a);
        o[a.sub] = i;
      }
    }
    return i;
  }, e.getClass = function(i, n, a) {
    var o = t[i];
    if (o && o[xr] && (o = n ? o[n] : null), a && !o)
      throw new Error(n ? "Component " + i + "." + (n || "") + " is used but not imported." : i + ".type should be specified.");
    return o;
  }, e.getClassesByMainType = function(i) {
    var n = Le(i), a = [], o = t[n.main];
    return o && o[xr] ? D(o, function(s, l) {
      l !== xr && a.push(s);
    }) : a.push(o), a;
  }, e.hasClass = function(i) {
    var n = Le(i);
    return !!t[n.main];
  }, e.getAllClassMainTypes = function() {
    var i = [];
    return D(t, function(n, a) {
      i.push(a);
    }), i;
  }, e.hasSubTypes = function(i) {
    var n = Le(i), a = t[n.main];
    return a && a[xr];
  };
  function r(i) {
    var n = t[i.main];
    return (!n || !n[xr]) && (n = t[i.main] = {}, n[xr] = !0), n;
  }
}
function Vn(e, t) {
  for (var r = 0; r < e.length; r++)
    e[r][1] || (e[r][1] = e[r][0]);
  return t = t || !1, function(i, n, a) {
    for (var o = {}, s = 0; s < e.length; s++) {
      var l = e[s][1];
      if (!(n && st(n, l) >= 0 || a && st(a, l) < 0)) {
        var u = i.getShallow(l, t);
        u != null && (o[e[s][0]] = u);
      }
    }
    return o;
  };
}
var O1 = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], k1 = Vn(O1), N1 = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getAreaStyle = function(t, r) {
      return k1(this, t, r);
    }, e;
  })()
), xl = new jn(50);
function $1(e) {
  if (typeof e == "string") {
    var t = xl.get(e);
    return t && t.image;
  } else
    return e;
}
function od(e, t, r, i, n) {
  if (e)
    if (typeof e == "string") {
      if (t && t.__zrImageSrc === e || !r)
        return t;
      var a = xl.get(e), o = { hostEl: r, cb: i, cbPayload: n };
      return a ? (t = a.image, !No(t) && a.pending.push(o)) : (t = Fi.loadImage(e, Xh, Xh), t.__zrImageSrc = e, xl.put(e, t.__cachedImgObj = {
        image: t,
        pending: [o]
      })), t;
    } else
      return e;
  else return t;
}
function Xh() {
  var e = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (var t = 0; t < e.pending.length; t++) {
    var r = e.pending[t], i = r.cb;
    i && i(this, r.cbPayload), r.hostEl.dirty();
  }
  e.pending.length = 0;
}
function No(e) {
  return e && e.width && e.height;
}
var _s = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function B1(e, t, r, i, n, a) {
  if (!r) {
    e.text = "", e.isTruncated = !1;
    return;
  }
  var o = (t + "").split(`
`);
  a = sd(r, i, n, a);
  for (var s = !1, l = {}, u = 0, h = o.length; u < h; u++)
    ld(l, o[u], a), o[u] = l.textLine, s = s || l.isTruncated;
  e.text = o.join(`
`), e.isTruncated = s;
}
function sd(e, t, r, i) {
  i = i || {};
  var n = I({}, i);
  n.font = t, r = X(r, "..."), n.maxIterations = X(i.maxIterations, 2);
  var a = n.minChar = X(i.minChar, 0);
  n.cnCharWidth = te("国", t);
  var o = n.ascCharWidth = te("a", t);
  n.placeholder = X(i.placeholder, "");
  for (var s = e = Math.max(0, e - 1), l = 0; l < a && s >= o; l++)
    s -= o;
  var u = te(r, t);
  return u > s && (r = "", u = 0), s = e - u, n.ellipsis = r, n.ellipsisWidth = u, n.contentWidth = s, n.containerWidth = e, n;
}
function ld(e, t, r) {
  var i = r.containerWidth, n = r.font, a = r.contentWidth;
  if (!i) {
    e.textLine = "", e.isTruncated = !1;
    return;
  }
  var o = te(t, n);
  if (o <= i) {
    e.textLine = t, e.isTruncated = !1;
    return;
  }
  for (var s = 0; ; s++) {
    if (o <= a || s >= r.maxIterations) {
      t += r.ellipsis;
      break;
    }
    var l = s === 0 ? F1(t, a, r.ascCharWidth, r.cnCharWidth) : o > 0 ? Math.floor(t.length * a / o) : 0;
    t = t.substr(0, l), o = te(t, n);
  }
  t === "" && (t = r.placeholder), e.textLine = t, e.isTruncated = !0;
}
function F1(e, t, r, i) {
  for (var n = 0, a = 0, o = e.length; a < o && n < t; a++) {
    var s = e.charCodeAt(a);
    n += 0 <= s && s <= 127 ? r : i;
  }
  return a;
}
function V1(e, t) {
  e != null && (e += "");
  var r = t.overflow, i = t.padding, n = t.font, a = r === "truncate", o = du(n), s = X(t.lineHeight, o), l = !!t.backgroundColor, u = t.lineOverflow === "truncate", h = !1, f = t.width, c;
  f != null && (r === "break" || r === "breakAll") ? c = e ? ud(e, t.font, f, r === "breakAll", 0).lines : [] : c = e ? e.split(`
`) : [];
  var v = c.length * s, d = X(t.height, v);
  if (v > d && u) {
    var _ = Math.floor(d / s);
    h = h || c.length > _, c = c.slice(0, _);
  }
  if (e && a && f != null)
    for (var p = sd(f, n, t.ellipsis, {
      minChar: t.truncateMinChar,
      placeholder: t.placeholder
    }), g = {}, m = 0; m < c.length; m++)
      ld(g, c[m], p), c[m] = g.textLine, h = h || g.isTruncated;
  for (var y = d, w = 0, m = 0; m < c.length; m++)
    w = Math.max(te(c[m], n), w);
  f == null && (f = w);
  var S = w;
  return i && (y += i[0] + i[2], S += i[1] + i[3], f += i[1] + i[3]), l && (S = f), {
    lines: c,
    height: d,
    outerWidth: S,
    outerHeight: y,
    lineHeight: s,
    calculatedLineHeight: o,
    contentWidth: w,
    contentHeight: v,
    width: f,
    isTruncated: h
  };
}
var z1 = /* @__PURE__ */ (function() {
  function e() {
  }
  return e;
})(), qh = /* @__PURE__ */ (function() {
  function e(t) {
    this.tokens = [], t && (this.tokens = t);
  }
  return e;
})(), H1 = /* @__PURE__ */ (function() {
  function e() {
    this.width = 0, this.height = 0, this.contentWidth = 0, this.contentHeight = 0, this.outerWidth = 0, this.outerHeight = 0, this.lines = [], this.isTruncated = !1;
  }
  return e;
})();
function U1(e, t) {
  var r = new H1();
  if (e != null && (e += ""), !e)
    return r;
  for (var i = t.width, n = t.height, a = t.overflow, o = (a === "break" || a === "breakAll") && i != null ? { width: i, accumWidth: 0, breakAll: a === "breakAll" } : null, s = _s.lastIndex = 0, l; (l = _s.exec(e)) != null; ) {
    var u = l.index;
    u > s && ms(r, e.substring(s, u), t, o), ms(r, l[2], t, o, l[1]), s = _s.lastIndex;
  }
  s < e.length && ms(r, e.substring(s, e.length), t, o);
  var h = [], f = 0, c = 0, v = t.padding, d = a === "truncate", _ = t.lineOverflow === "truncate", p = {};
  function g(Z, J, Y) {
    Z.width = J, Z.lineHeight = Y, f += Y, c = Math.max(c, J);
  }
  t: for (var m = 0; m < r.lines.length; m++) {
    for (var y = r.lines[m], w = 0, S = 0, b = 0; b < y.tokens.length; b++) {
      var T = y.tokens[b], C = T.styleName && t.rich[T.styleName] || {}, x = T.textPadding = C.padding, E = x ? x[1] + x[3] : 0, A = T.font = C.font || t.font;
      T.contentHeight = du(A);
      var M = X(C.height, T.contentHeight);
      if (T.innerHeight = M, x && (M += x[0] + x[2]), T.height = M, T.lineHeight = Sn(C.lineHeight, t.lineHeight, M), T.align = C && C.align || t.align, T.verticalAlign = C && C.verticalAlign || "middle", _ && n != null && f + T.lineHeight > n) {
        var L = r.lines.length;
        b > 0 ? (y.tokens = y.tokens.slice(0, b), g(y, S, w), r.lines = r.lines.slice(0, m + 1)) : r.lines = r.lines.slice(0, m), r.isTruncated = r.isTruncated || r.lines.length < L;
        break t;
      }
      var P = C.width, O = P == null || P === "auto";
      if (typeof P == "string" && P.charAt(P.length - 1) === "%")
        T.percentWidth = P, h.push(T), T.contentWidth = te(T.text, A);
      else {
        if (O) {
          var R = C.backgroundColor, U = R && R.image;
          U && (U = $1(U), No(U) && (T.width = Math.max(T.width, U.width * M / U.height)));
        }
        var q = d && i != null ? i - S : null;
        q != null && q < T.width ? !O || q < E ? (T.text = "", T.width = T.contentWidth = 0) : (B1(p, T.text, q - E, A, t.ellipsis, { minChar: t.truncateMinChar }), T.text = p.text, r.isTruncated = r.isTruncated || p.isTruncated, T.width = T.contentWidth = te(T.text, A)) : T.contentWidth = te(T.text, A);
      }
      T.width += E, S += T.width, C && (w = Math.max(w, T.lineHeight));
    }
    g(y, S, w);
  }
  r.outerWidth = r.width = X(i, c), r.outerHeight = r.height = X(n, f), r.contentHeight = f, r.contentWidth = c, v && (r.outerWidth += v[1] + v[3], r.outerHeight += v[0] + v[2]);
  for (var m = 0; m < h.length; m++) {
    var T = h[m], $ = T.percentWidth;
    T.width = parseInt($, 10) / 100 * r.width;
  }
  return r;
}
function ms(e, t, r, i, n) {
  var a = t === "", o = n && r.rich[n] || {}, s = e.lines, l = o.font || r.font, u = !1, h, f;
  if (i) {
    var c = o.padding, v = c ? c[1] + c[3] : 0;
    if (o.width != null && o.width !== "auto") {
      var d = Oi(o.width, i.width) + v;
      s.length > 0 && d + i.accumWidth > i.width && (h = t.split(`
`), u = !0), i.accumWidth = d;
    } else {
      var _ = ud(t, l, i.width, i.breakAll, i.accumWidth);
      i.accumWidth = _.accumWidth + v, f = _.linesWidths, h = _.lines;
    }
  } else
    h = t.split(`
`);
  for (var p = 0; p < h.length; p++) {
    var g = h[p], m = new z1();
    if (m.styleName = n, m.text = g, m.isLineHolder = !g && !a, typeof o.width == "number" ? m.width = o.width : m.width = f ? f[p] : te(g, l), !p && !u) {
      var y = (s[s.length - 1] || (s[0] = new qh())).tokens, w = y.length;
      w === 1 && y[0].isLineHolder ? y[0] = m : (g || !w || a) && y.push(m);
    } else
      s.push(new qh([m]));
  }
}
function G1(e) {
  var t = e.charCodeAt(0);
  return t >= 32 && t <= 591 || t >= 880 && t <= 4351 || t >= 4608 && t <= 5119 || t >= 7680 && t <= 8303;
}
var W1 = dr(",&?/;] ".split(""), function(e, t) {
  return e[t] = !0, e;
}, {});
function Y1(e) {
  return G1(e) ? !!W1[e] : !0;
}
function ud(e, t, r, i, n) {
  for (var a = [], o = [], s = "", l = "", u = 0, h = 0, f = 0; f < e.length; f++) {
    var c = e.charAt(f);
    if (c === `
`) {
      l && (s += l, h += u), a.push(s), o.push(h), s = "", l = "", u = 0, h = 0;
      continue;
    }
    var v = te(c, t), d = i ? !1 : !Y1(c);
    if (a.length ? h + v > r : n + h + v > r) {
      h ? (s || l) && (d ? (s || (s = l, l = "", u = 0, h = u), a.push(s), o.push(h - u), l += c, u += v, s = "", h = u) : (l && (s += l, l = "", u = 0), a.push(s), o.push(h), s = c, h = v)) : d ? (a.push(l), o.push(u), l = c, u = v) : (a.push(c), o.push(v));
      continue;
    }
    h += v, d ? (l += c, u += v) : (l && (s += l, l = "", u = 0), s += c);
  }
  return !a.length && !s && (s = e, l = "", u = 0), l && (s += l), s && (a.push(s), o.push(h)), a.length === 1 && (h += n), {
    accumWidth: h,
    lines: a,
    linesWidths: o
  };
}
var Dl = "__zr_style_" + Math.round(Math.random() * 10), Yr = {
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000",
  opacity: 1,
  blend: "source-over"
}, $o = {
  style: {
    shadowBlur: !0,
    shadowOffsetX: !0,
    shadowOffsetY: !0,
    shadowColor: !0,
    opacity: !0
  }
};
Yr[Dl] = !0;
var Zh = ["z", "z2", "invisible"], X1 = ["invisible"], ta = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype._init = function(r) {
    for (var i = pt(r), n = 0; n < i.length; n++) {
      var a = i[n];
      a === "style" ? this.useStyle(r[a]) : e.prototype.attrKV.call(this, a, r[a]);
    }
    this.style || this.useStyle({});
  }, t.prototype.beforeBrush = function() {
  }, t.prototype.afterBrush = function() {
  }, t.prototype.innerBeforeBrush = function() {
  }, t.prototype.innerAfterBrush = function() {
  }, t.prototype.shouldBePainted = function(r, i, n, a) {
    var o = this.transform;
    if (this.ignore || this.invisible || this.style.opacity === 0 || this.culling && q1(this, r, i) || o && !o[0] && !o[3])
      return !1;
    if (n && this.__clipPaths) {
      for (var s = 0; s < this.__clipPaths.length; ++s)
        if (this.__clipPaths[s].isZeroArea())
          return !1;
    }
    if (a && this.parent)
      for (var l = this.parent; l; ) {
        if (l.ignore)
          return !1;
        l = l.parent;
      }
    return !0;
  }, t.prototype.contain = function(r, i) {
    return this.rectContain(r, i);
  }, t.prototype.traverse = function(r, i) {
    r.call(i, this);
  }, t.prototype.rectContain = function(r, i) {
    var n = this.transformCoordToLocal(r, i), a = this.getBoundingRect();
    return a.contain(n[0], n[1]);
  }, t.prototype.getPaintRect = function() {
    var r = this._paintRect;
    if (!this._paintRect || this.__dirty) {
      var i = this.transform, n = this.getBoundingRect(), a = this.style, o = a.shadowBlur || 0, s = a.shadowOffsetX || 0, l = a.shadowOffsetY || 0;
      r = this._paintRect || (this._paintRect = new at(0, 0, 0, 0)), i ? at.applyTransform(r, n, i) : r.copy(n), (o || s || l) && (r.width += o * 2 + Math.abs(s), r.height += o * 2 + Math.abs(l), r.x = Math.min(r.x, r.x + s - o), r.y = Math.min(r.y, r.y + l - o));
      var u = this.dirtyRectTolerance;
      r.isZero() || (r.x = Math.floor(r.x - u), r.y = Math.floor(r.y - u), r.width = Math.ceil(r.width + 1 + u * 2), r.height = Math.ceil(r.height + 1 + u * 2));
    }
    return r;
  }, t.prototype.setPrevPaintRect = function(r) {
    r ? (this._prevPaintRect = this._prevPaintRect || new at(0, 0, 0, 0), this._prevPaintRect.copy(r)) : this._prevPaintRect = null;
  }, t.prototype.getPrevPaintRect = function() {
    return this._prevPaintRect;
  }, t.prototype.animateStyle = function(r) {
    return this.animate("style", r);
  }, t.prototype.updateDuringAnimation = function(r) {
    r === "style" ? this.dirtyStyle() : this.markRedraw();
  }, t.prototype.attrKV = function(r, i) {
    r !== "style" ? e.prototype.attrKV.call(this, r, i) : this.style ? this.setStyle(i) : this.useStyle(i);
  }, t.prototype.setStyle = function(r, i) {
    return typeof r == "string" ? this.style[r] = i : I(this.style, r), this.dirtyStyle(), this;
  }, t.prototype.dirtyStyle = function(r) {
    r || this.markRedraw(), this.__dirty |= dn, this._rect && (this._rect = null);
  }, t.prototype.dirty = function() {
    this.dirtyStyle();
  }, t.prototype.styleChanged = function() {
    return !!(this.__dirty & dn);
  }, t.prototype.styleUpdated = function() {
    this.__dirty &= ~dn;
  }, t.prototype.createStyle = function(r) {
    return Lo(Yr, r);
  }, t.prototype.useStyle = function(r) {
    r[Dl] || (r = this.createStyle(r)), this.__inHover ? this.__hoverStyle = r : this.style = r, this.dirtyStyle();
  }, t.prototype.isStyleObject = function(r) {
    return r[Dl];
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var i = this._normalState;
    r.style && !i.style && (i.style = this._mergeStyle(this.createStyle(), this.style)), this._savePrimaryToNormal(r, i, Zh);
  }, t.prototype._applyStateObj = function(r, i, n, a, o, s) {
    e.prototype._applyStateObj.call(this, r, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.style ? o ? a ? u = i.style : (u = this._mergeStyle(this.createStyle(), n.style), this._mergeStyle(u, i.style)) : (u = this._mergeStyle(this.createStyle(), a ? this.style : n.style), this._mergeStyle(u, i.style)) : l && (u = n.style), u)
      if (o) {
        var h = this.style;
        if (this.style = this.createStyle(l ? {} : h), l)
          for (var f = pt(h), c = 0; c < f.length; c++) {
            var v = f[c];
            v in u && (u[v] = u[v], this.style[v] = h[v]);
          }
        for (var d = pt(u), c = 0; c < d.length; c++) {
          var v = d[c];
          this.style[v] = this.style[v];
        }
        this._transitionState(r, {
          style: u
        }, s, this.getAnimationStyleProps());
      } else
        this.useStyle(u);
    for (var _ = this.__inHover ? X1 : Zh, c = 0; c < _.length; c++) {
      var v = _[c];
      i && i[v] != null ? this[v] = i[v] : l && n[v] != null && (this[v] = n[v]);
    }
  }, t.prototype._mergeStates = function(r) {
    for (var i = e.prototype._mergeStates.call(this, r), n, a = 0; a < r.length; a++) {
      var o = r[a];
      o.style && (n = n || {}, this._mergeStyle(n, o.style));
    }
    return n && (i.style = n), i;
  }, t.prototype._mergeStyle = function(r, i) {
    return I(r, i), r;
  }, t.prototype.getAnimationStyleProps = function() {
    return $o;
  }, t.initDefaultProps = (function() {
    var r = t.prototype;
    r.type = "displayable", r.invisible = !1, r.z = 0, r.z2 = 0, r.zlevel = 0, r.culling = !1, r.cursor = "pointer", r.rectHover = !1, r.incremental = !1, r._rect = null, r.dirtyRectTolerance = 0, r.__dirty = Qt | dn;
  })(), t;
})(Io), ys = new at(0, 0, 0, 0), ws = new at(0, 0, 0, 0);
function q1(e, t, r) {
  return ys.copy(e.getBoundingRect()), e.transform && ys.applyTransform(e.transform), ws.width = t, ws.height = r, !ys.intersect(ws);
}
var he = Math.min, fe = Math.max, bs = Math.sin, Ss = Math.cos, Dr = Math.PI * 2, ca = zi(), va = zi(), da = zi();
function Kh(e, t, r, i, n, a) {
  n[0] = he(e, r), n[1] = he(t, i), a[0] = fe(e, r), a[1] = fe(t, i);
}
var jh = [], Qh = [];
function Z1(e, t, r, i, n, a, o, s, l, u) {
  var h = Nv, f = kt, c = h(e, r, n, o, jh);
  l[0] = 1 / 0, l[1] = 1 / 0, u[0] = -1 / 0, u[1] = -1 / 0;
  for (var v = 0; v < c; v++) {
    var d = f(e, r, n, o, jh[v]);
    l[0] = he(d, l[0]), u[0] = fe(d, u[0]);
  }
  c = h(t, i, a, s, Qh);
  for (var v = 0; v < c; v++) {
    var _ = f(t, i, a, s, Qh[v]);
    l[1] = he(_, l[1]), u[1] = fe(_, u[1]);
  }
  l[0] = he(e, l[0]), u[0] = fe(e, u[0]), l[0] = he(o, l[0]), u[0] = fe(o, u[0]), l[1] = he(t, l[1]), u[1] = fe(t, u[1]), l[1] = he(s, l[1]), u[1] = fe(s, u[1]);
}
function K1(e, t, r, i, n, a, o, s) {
  var l = $v, u = zt, h = fe(he(l(e, r, n), 1), 0), f = fe(he(l(t, i, a), 1), 0), c = u(e, r, n, h), v = u(t, i, a, f);
  o[0] = he(e, n, c), o[1] = he(t, a, v), s[0] = fe(e, n, c), s[1] = fe(t, a, v);
}
function j1(e, t, r, i, n, a, o, s, l) {
  var u = yi, h = wi, f = Math.abs(n - a);
  if (f % Dr < 1e-4 && f > 1e-4) {
    s[0] = e - r, s[1] = t - i, l[0] = e + r, l[1] = t + i;
    return;
  }
  if (ca[0] = Ss(n) * r + e, ca[1] = bs(n) * i + t, va[0] = Ss(a) * r + e, va[1] = bs(a) * i + t, u(s, ca, va), h(l, ca, va), n = n % Dr, n < 0 && (n = n + Dr), a = a % Dr, a < 0 && (a = a + Dr), n > a && !o ? a += Dr : n < a && o && (n += Dr), o) {
    var c = a;
    a = n, n = c;
  }
  for (var v = 0; v < a; v += Math.PI / 2)
    v > n && (da[0] = Ss(v) * r + e, da[1] = bs(v) * i + t, u(s, da, s), h(l, da, l));
}
var it = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  R: 7
}, Er = [], Ar = [], Ce = [], Je = [], xe = [], De = [], Ts = Math.min, Cs = Math.max, Mr = Math.cos, Pr = Math.sin, ze = Math.abs, El = Math.PI, ar = El * 2, xs = typeof Float32Array < "u", Ji = [];
function Ds(e) {
  var t = Math.round(e / El * 1e8) / 1e8;
  return t % 2 * El;
}
function hd(e, t) {
  var r = Ds(e[0]);
  r < 0 && (r += ar);
  var i = r - e[0], n = e[1];
  n += i, !t && n - r >= ar ? n = r + ar : t && r - n >= ar ? n = r - ar : !t && r > n ? n = r + (ar - Ds(r - n)) : t && r < n && (n = r - (ar - Ds(n - r))), e[0] = r, e[1] = n;
}
var Ni = (function() {
  function e(t) {
    this.dpr = 1, this._xi = 0, this._yi = 0, this._x0 = 0, this._y0 = 0, this._len = 0, t && (this._saveData = !1), this._saveData && (this.data = []);
  }
  return e.prototype.increaseVersion = function() {
    this._version++;
  }, e.prototype.getVersion = function() {
    return this._version;
  }, e.prototype.setScale = function(t, r, i) {
    i = i || 0, i > 0 && (this._ux = ze(i / io / t) || 0, this._uy = ze(i / io / r) || 0);
  }, e.prototype.setDPR = function(t) {
    this.dpr = t;
  }, e.prototype.setContext = function(t) {
    this._ctx = t;
  }, e.prototype.getContext = function() {
    return this._ctx;
  }, e.prototype.beginPath = function() {
    return this._ctx && this._ctx.beginPath(), this.reset(), this;
  }, e.prototype.reset = function() {
    this._saveData && (this._len = 0), this._pathSegLen && (this._pathSegLen = null, this._pathLen = 0), this._version++;
  }, e.prototype.moveTo = function(t, r) {
    return this._drawPendingPt(), this.addData(it.M, t, r), this._ctx && this._ctx.moveTo(t, r), this._x0 = t, this._y0 = r, this._xi = t, this._yi = r, this;
  }, e.prototype.lineTo = function(t, r) {
    var i = ze(t - this._xi), n = ze(r - this._yi), a = i > this._ux || n > this._uy;
    if (this.addData(it.L, t, r), this._ctx && a && this._ctx.lineTo(t, r), a)
      this._xi = t, this._yi = r, this._pendingPtDist = 0;
    else {
      var o = i * i + n * n;
      o > this._pendingPtDist && (this._pendingPtX = t, this._pendingPtY = r, this._pendingPtDist = o);
    }
    return this;
  }, e.prototype.bezierCurveTo = function(t, r, i, n, a, o) {
    return this._drawPendingPt(), this.addData(it.C, t, r, i, n, a, o), this._ctx && this._ctx.bezierCurveTo(t, r, i, n, a, o), this._xi = a, this._yi = o, this;
  }, e.prototype.quadraticCurveTo = function(t, r, i, n) {
    return this._drawPendingPt(), this.addData(it.Q, t, r, i, n), this._ctx && this._ctx.quadraticCurveTo(t, r, i, n), this._xi = i, this._yi = n, this;
  }, e.prototype.arc = function(t, r, i, n, a, o) {
    this._drawPendingPt(), Ji[0] = n, Ji[1] = a, hd(Ji, o), n = Ji[0], a = Ji[1];
    var s = a - n;
    return this.addData(it.A, t, r, i, i, n, s, 0, o ? 0 : 1), this._ctx && this._ctx.arc(t, r, i, n, a, o), this._xi = Mr(a) * i + t, this._yi = Pr(a) * i + r, this;
  }, e.prototype.arcTo = function(t, r, i, n, a) {
    return this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, r, i, n, a), this;
  }, e.prototype.rect = function(t, r, i, n) {
    return this._drawPendingPt(), this._ctx && this._ctx.rect(t, r, i, n), this.addData(it.R, t, r, i, n), this;
  }, e.prototype.closePath = function() {
    this._drawPendingPt(), this.addData(it.Z);
    var t = this._ctx, r = this._x0, i = this._y0;
    return t && t.closePath(), this._xi = r, this._yi = i, this;
  }, e.prototype.fill = function(t) {
    t && t.fill(), this.toStatic();
  }, e.prototype.stroke = function(t) {
    t && t.stroke(), this.toStatic();
  }, e.prototype.len = function() {
    return this._len;
  }, e.prototype.setData = function(t) {
    var r = t.length;
    !(this.data && this.data.length === r) && xs && (this.data = new Float32Array(r));
    for (var i = 0; i < r; i++)
      this.data[i] = t[i];
    this._len = r;
  }, e.prototype.appendPath = function(t) {
    t instanceof Array || (t = [t]);
    for (var r = t.length, i = 0, n = this._len, a = 0; a < r; a++)
      i += t[a].len();
    xs && this.data instanceof Float32Array && (this.data = new Float32Array(n + i));
    for (var a = 0; a < r; a++)
      for (var o = t[a].data, s = 0; s < o.length; s++)
        this.data[n++] = o[s];
    this._len = n;
  }, e.prototype.addData = function(t, r, i, n, a, o, s, l, u) {
    if (this._saveData) {
      var h = this.data;
      this._len + arguments.length > h.length && (this._expandData(), h = this.data);
      for (var f = 0; f < arguments.length; f++)
        h[this._len++] = arguments[f];
    }
  }, e.prototype._drawPendingPt = function() {
    this._pendingPtDist > 0 && (this._ctx && this._ctx.lineTo(this._pendingPtX, this._pendingPtY), this._pendingPtDist = 0);
  }, e.prototype._expandData = function() {
    if (!(this.data instanceof Array)) {
      for (var t = [], r = 0; r < this._len; r++)
        t[r] = this.data[r];
      this.data = t;
    }
  }, e.prototype.toStatic = function() {
    if (this._saveData) {
      this._drawPendingPt();
      var t = this.data;
      t instanceof Array && (t.length = this._len, xs && this._len > 11 && (this.data = new Float32Array(t)));
    }
  }, e.prototype.getBoundingRect = function() {
    Ce[0] = Ce[1] = xe[0] = xe[1] = Number.MAX_VALUE, Je[0] = Je[1] = De[0] = De[1] = -Number.MAX_VALUE;
    var t = this.data, r = 0, i = 0, n = 0, a = 0, o;
    for (o = 0; o < this._len; ) {
      var s = t[o++], l = o === 1;
      switch (l && (r = t[o], i = t[o + 1], n = r, a = i), s) {
        case it.M:
          r = n = t[o++], i = a = t[o++], xe[0] = n, xe[1] = a, De[0] = n, De[1] = a;
          break;
        case it.L:
          Kh(r, i, t[o], t[o + 1], xe, De), r = t[o++], i = t[o++];
          break;
        case it.C:
          Z1(r, i, t[o++], t[o++], t[o++], t[o++], t[o], t[o + 1], xe, De), r = t[o++], i = t[o++];
          break;
        case it.Q:
          K1(r, i, t[o++], t[o++], t[o], t[o + 1], xe, De), r = t[o++], i = t[o++];
          break;
        case it.A:
          var u = t[o++], h = t[o++], f = t[o++], c = t[o++], v = t[o++], d = t[o++] + v;
          o += 1;
          var _ = !t[o++];
          l && (n = Mr(v) * f + u, a = Pr(v) * c + h), j1(u, h, f, c, v, d, _, xe, De), r = Mr(d) * f + u, i = Pr(d) * c + h;
          break;
        case it.R:
          n = r = t[o++], a = i = t[o++];
          var p = t[o++], g = t[o++];
          Kh(n, a, n + p, a + g, xe, De);
          break;
        case it.Z:
          r = n, i = a;
          break;
      }
      yi(Ce, Ce, xe), wi(Je, Je, De);
    }
    return o === 0 && (Ce[0] = Ce[1] = Je[0] = Je[1] = 0), new at(Ce[0], Ce[1], Je[0] - Ce[0], Je[1] - Ce[1]);
  }, e.prototype._calculateLength = function() {
    var t = this.data, r = this._len, i = this._ux, n = this._uy, a = 0, o = 0, s = 0, l = 0;
    this._pathSegLen || (this._pathSegLen = []);
    for (var u = this._pathSegLen, h = 0, f = 0, c = 0; c < r; ) {
      var v = t[c++], d = c === 1;
      d && (a = t[c], o = t[c + 1], s = a, l = o);
      var _ = -1;
      switch (v) {
        case it.M:
          a = s = t[c++], o = l = t[c++];
          break;
        case it.L: {
          var p = t[c++], g = t[c++], m = p - a, y = g - o;
          (ze(m) > i || ze(y) > n || c === r - 1) && (_ = Math.sqrt(m * m + y * y), a = p, o = g);
          break;
        }
        case it.C: {
          var w = t[c++], S = t[c++], p = t[c++], g = t[c++], b = t[c++], T = t[c++];
          _ = Sw(a, o, w, S, p, g, b, T, 10), a = b, o = T;
          break;
        }
        case it.Q: {
          var w = t[c++], S = t[c++], p = t[c++], g = t[c++];
          _ = xw(a, o, w, S, p, g, 10), a = p, o = g;
          break;
        }
        case it.A:
          var C = t[c++], x = t[c++], E = t[c++], A = t[c++], M = t[c++], L = t[c++], P = L + M;
          c += 1, d && (s = Mr(M) * E + C, l = Pr(M) * A + x), _ = Cs(E, A) * Ts(ar, Math.abs(L)), a = Mr(P) * E + C, o = Pr(P) * A + x;
          break;
        case it.R: {
          s = a = t[c++], l = o = t[c++];
          var O = t[c++], R = t[c++];
          _ = O * 2 + R * 2;
          break;
        }
        case it.Z: {
          var m = s - a, y = l - o;
          _ = Math.sqrt(m * m + y * y), a = s, o = l;
          break;
        }
      }
      _ >= 0 && (u[f++] = _, h += _);
    }
    return this._pathLen = h, h;
  }, e.prototype.rebuildPath = function(t, r) {
    var i = this.data, n = this._ux, a = this._uy, o = this._len, s, l, u, h, f, c, v = r < 1, d, _, p = 0, g = 0, m, y = 0, w, S;
    if (!(v && (this._pathSegLen || this._calculateLength(), d = this._pathSegLen, _ = this._pathLen, m = r * _, !m)))
      t: for (var b = 0; b < o; ) {
        var T = i[b++], C = b === 1;
        switch (C && (u = i[b], h = i[b + 1], s = u, l = h), T !== it.L && y > 0 && (t.lineTo(w, S), y = 0), T) {
          case it.M:
            s = u = i[b++], l = h = i[b++], t.moveTo(u, h);
            break;
          case it.L: {
            f = i[b++], c = i[b++];
            var x = ze(f - u), E = ze(c - h);
            if (x > n || E > a) {
              if (v) {
                var A = d[g++];
                if (p + A > m) {
                  var M = (m - p) / A;
                  t.lineTo(u * (1 - M) + f * M, h * (1 - M) + c * M);
                  break t;
                }
                p += A;
              }
              t.lineTo(f, c), u = f, h = c, y = 0;
            } else {
              var L = x * x + E * E;
              L > y && (w = f, S = c, y = L);
            }
            break;
          }
          case it.C: {
            var P = i[b++], O = i[b++], R = i[b++], U = i[b++], q = i[b++], $ = i[b++];
            if (v) {
              var A = d[g++];
              if (p + A > m) {
                var M = (m - p) / A;
                to(u, P, R, q, M, Er), to(h, O, U, $, M, Ar), t.bezierCurveTo(Er[1], Ar[1], Er[2], Ar[2], Er[3], Ar[3]);
                break t;
              }
              p += A;
            }
            t.bezierCurveTo(P, O, R, U, q, $), u = q, h = $;
            break;
          }
          case it.Q: {
            var P = i[b++], O = i[b++], R = i[b++], U = i[b++];
            if (v) {
              var A = d[g++];
              if (p + A > m) {
                var M = (m - p) / A;
                eo(u, P, R, M, Er), eo(h, O, U, M, Ar), t.quadraticCurveTo(Er[1], Ar[1], Er[2], Ar[2]);
                break t;
              }
              p += A;
            }
            t.quadraticCurveTo(P, O, R, U), u = R, h = U;
            break;
          }
          case it.A:
            var Z = i[b++], J = i[b++], Y = i[b++], _t = i[b++], Tt = i[b++], qt = i[b++], Se = i[b++], ee = !i[b++], Zt = Y > _t ? Y : _t, xt = ze(Y - _t) > 1e-3, ft = Tt + qt, H = !1;
            if (v) {
              var A = d[g++];
              p + A > m && (ft = Tt + qt * (m - p) / A, H = !0), p += A;
            }
            if (xt && t.ellipse ? t.ellipse(Z, J, Y, _t, Se, Tt, ft, ee) : t.arc(Z, J, Zt, Tt, ft, ee), H)
              break t;
            C && (s = Mr(Tt) * Y + Z, l = Pr(Tt) * _t + J), u = Mr(ft) * Y + Z, h = Pr(ft) * _t + J;
            break;
          case it.R:
            s = u = i[b], l = h = i[b + 1], f = i[b++], c = i[b++];
            var K = i[b++], Te = i[b++];
            if (v) {
              var A = d[g++];
              if (p + A > m) {
                var Ct = m - p;
                t.moveTo(f, c), t.lineTo(f + Ts(Ct, K), c), Ct -= K, Ct > 0 && t.lineTo(f + K, c + Ts(Ct, Te)), Ct -= Te, Ct > 0 && t.lineTo(f + Cs(K - Ct, 0), c + Te), Ct -= K, Ct > 0 && t.lineTo(f, c + Cs(Te - Ct, 0));
                break t;
              }
              p += A;
            }
            t.rect(f, c, K, Te);
            break;
          case it.Z:
            if (v) {
              var A = d[g++];
              if (p + A > m) {
                var M = (m - p) / A;
                t.lineTo(u * (1 - M) + s * M, h * (1 - M) + l * M);
                break t;
              }
              p += A;
            }
            t.closePath(), u = s, h = l;
        }
      }
  }, e.prototype.clone = function() {
    var t = new e(), r = this.data;
    return t.data = r.slice ? r.slice() : Array.prototype.slice.call(r), t._len = this._len, t;
  }, e.CMD = it, e.initDefaultProps = (function() {
    var t = e.prototype;
    t._saveData = !0, t._ux = 0, t._uy = 0, t._pendingPtDist = 0, t._version = 0;
  })(), e;
})();
function oi(e, t, r, i, n, a, o) {
  if (n === 0)
    return !1;
  var s = n, l = 0, u = e;
  if (o > t + s && o > i + s || o < t - s && o < i - s || a > e + s && a > r + s || a < e - s && a < r - s)
    return !1;
  if (e !== r)
    l = (t - i) / (e - r), u = (e * i - r * t) / (e - r);
  else
    return Math.abs(a - e) <= s / 2;
  var h = l * a - o + u, f = h * h / (l * l + 1);
  return f <= s / 2 * s / 2;
}
function Q1(e, t, r, i, n, a, o, s, l, u, h) {
  if (l === 0)
    return !1;
  var f = l;
  if (h > t + f && h > i + f && h > a + f && h > s + f || h < t - f && h < i - f && h < a - f && h < s - f || u > e + f && u > r + f && u > n + f && u > o + f || u < e - f && u < r - f && u < n - f && u < o - f)
    return !1;
  var c = bw(e, t, r, i, n, a, o, s, u, h);
  return c <= f / 2;
}
function J1(e, t, r, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  if (l > t + u && l > i + u && l > a + u || l < t - u && l < i - u && l < a - u || s > e + u && s > r + u && s > n + u || s < e - u && s < r - u && s < n - u)
    return !1;
  var h = Cw(e, t, r, i, n, a, s, l);
  return h <= u / 2;
}
var Jh = Math.PI * 2;
function pa(e) {
  return e %= Jh, e < 0 && (e += Jh), e;
}
var tn = Math.PI * 2;
function tb(e, t, r, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  s -= e, l -= t;
  var h = Math.sqrt(s * s + l * l);
  if (h - u > r || h + u < r)
    return !1;
  if (Math.abs(i - n) % tn < 1e-4)
    return !0;
  if (a) {
    var f = i;
    i = pa(n), n = pa(f);
  } else
    i = pa(i), n = pa(n);
  i > n && (n += tn);
  var c = Math.atan2(l, s);
  return c < 0 && (c += tn), c >= i && c <= n || c + tn >= i && c + tn <= n;
}
function Lr(e, t, r, i, n, a) {
  if (a > t && a > i || a < t && a < i || i === t)
    return 0;
  var o = (a - t) / (i - t), s = i < t ? 1 : -1;
  (o === 1 || o === 0) && (s = i < t ? 0.5 : -0.5);
  var l = o * (r - e) + e;
  return l === n ? 1 / 0 : l > n ? s : 0;
}
var tr = Ni.CMD, Ir = Math.PI * 2, eb = 1e-4;
function rb(e, t) {
  return Math.abs(e - t) < eb;
}
var Rt = [-1, -1, -1], le = [-1, -1];
function ib() {
  var e = le[0];
  le[0] = le[1], le[1] = e;
}
function nb(e, t, r, i, n, a, o, s, l, u) {
  if (u > t && u > i && u > a && u > s || u < t && u < i && u < a && u < s)
    return 0;
  var h = kv(t, i, a, s, u, Rt);
  if (h === 0)
    return 0;
  for (var f = 0, c = -1, v = void 0, d = void 0, _ = 0; _ < h; _++) {
    var p = Rt[_], g = p === 0 || p === 1 ? 0.5 : 1, m = kt(e, r, n, o, p);
    m < l || (c < 0 && (c = Nv(t, i, a, s, le), le[1] < le[0] && c > 1 && ib(), v = kt(t, i, a, s, le[0]), c > 1 && (d = kt(t, i, a, s, le[1]))), c === 2 ? p < le[0] ? f += v < t ? g : -g : p < le[1] ? f += d < v ? g : -g : f += s < d ? g : -g : p < le[0] ? f += v < t ? g : -g : f += s < v ? g : -g);
  }
  return f;
}
function ab(e, t, r, i, n, a, o, s) {
  if (s > t && s > i && s > a || s < t && s < i && s < a)
    return 0;
  var l = Tw(t, i, a, s, Rt);
  if (l === 0)
    return 0;
  var u = $v(t, i, a);
  if (u >= 0 && u <= 1) {
    for (var h = 0, f = zt(t, i, a, u), c = 0; c < l; c++) {
      var v = Rt[c] === 0 || Rt[c] === 1 ? 0.5 : 1, d = zt(e, r, n, Rt[c]);
      d < o || (Rt[c] < u ? h += f < t ? v : -v : h += a < f ? v : -v);
    }
    return h;
  } else {
    var v = Rt[0] === 0 || Rt[0] === 1 ? 0.5 : 1, d = zt(e, r, n, Rt[0]);
    return d < o ? 0 : a < t ? v : -v;
  }
}
function ob(e, t, r, i, n, a, o, s) {
  if (s -= t, s > r || s < -r)
    return 0;
  var l = Math.sqrt(r * r - s * s);
  Rt[0] = -l, Rt[1] = l;
  var u = Math.abs(i - n);
  if (u < 1e-4)
    return 0;
  if (u >= Ir - 1e-4) {
    i = 0, n = Ir;
    var h = a ? 1 : -1;
    return o >= Rt[0] + e && o <= Rt[1] + e ? h : 0;
  }
  if (i > n) {
    var f = i;
    i = n, n = f;
  }
  i < 0 && (i += Ir, n += Ir);
  for (var c = 0, v = 0; v < 2; v++) {
    var d = Rt[v];
    if (d + e > o) {
      var _ = Math.atan2(s, d), h = a ? 1 : -1;
      _ < 0 && (_ = Ir + _), (_ >= i && _ <= n || _ + Ir >= i && _ + Ir <= n) && (_ > Math.PI / 2 && _ < Math.PI * 1.5 && (h = -h), c += h);
    }
  }
  return c;
}
function fd(e, t, r, i, n) {
  for (var a = e.data, o = e.len(), s = 0, l = 0, u = 0, h = 0, f = 0, c, v, d = 0; d < o; ) {
    var _ = a[d++], p = d === 1;
    switch (_ === tr.M && d > 1 && (r || (s += Lr(l, u, h, f, i, n))), p && (l = a[d], u = a[d + 1], h = l, f = u), _) {
      case tr.M:
        h = a[d++], f = a[d++], l = h, u = f;
        break;
      case tr.L:
        if (r) {
          if (oi(l, u, a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += Lr(l, u, a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case tr.C:
        if (r) {
          if (Q1(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += nb(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case tr.Q:
        if (r) {
          if (J1(l, u, a[d++], a[d++], a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += ab(l, u, a[d++], a[d++], a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case tr.A:
        var g = a[d++], m = a[d++], y = a[d++], w = a[d++], S = a[d++], b = a[d++];
        d += 1;
        var T = !!(1 - a[d++]);
        c = Math.cos(S) * y + g, v = Math.sin(S) * w + m, p ? (h = c, f = v) : s += Lr(l, u, c, v, i, n);
        var C = (i - g) * w / y + g;
        if (r) {
          if (tb(g, m, w, S, S + b, T, t, C, n))
            return !0;
        } else
          s += ob(g, m, w, S, S + b, T, C, n);
        l = Math.cos(S + b) * y + g, u = Math.sin(S + b) * w + m;
        break;
      case tr.R:
        h = l = a[d++], f = u = a[d++];
        var x = a[d++], E = a[d++];
        if (c = h + x, v = f + E, r) {
          if (oi(h, f, c, f, t, i, n) || oi(c, f, c, v, t, i, n) || oi(c, v, h, v, t, i, n) || oi(h, v, h, f, t, i, n))
            return !0;
        } else
          s += Lr(c, f, c, v, i, n), s += Lr(h, v, h, f, i, n);
        break;
      case tr.Z:
        if (r) {
          if (oi(l, u, h, f, t, i, n))
            return !0;
        } else
          s += Lr(l, u, h, f, i, n);
        l = h, u = f;
        break;
    }
  }
  return !r && !rb(u, f) && (s += Lr(l, u, h, f, i, n) || 0), s !== 0;
}
function sb(e, t, r) {
  return fd(e, 0, !1, t, r);
}
function lb(e, t, r, i) {
  return fd(e, t, !0, r, i);
}
var cd = ht({
  fill: "#000",
  stroke: null,
  strokePercent: 1,
  fillOpacity: 1,
  strokeOpacity: 1,
  lineDashOffset: 0,
  lineWidth: 1,
  lineCap: "butt",
  miterLimit: 10,
  strokeNoScale: !1,
  strokeFirst: !1
}, Yr), ub = {
  style: ht({
    fill: !0,
    stroke: !0,
    strokePercent: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineDashOffset: !0,
    lineWidth: !0,
    miterLimit: !0
  }, $o.style)
}, Es = Fn.concat([
  "invisible",
  "culling",
  "z",
  "z2",
  "zlevel",
  "parent"
]), ot = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.update = function() {
    var r = this;
    e.prototype.update.call(this);
    var i = this.style;
    if (i.decal) {
      var n = this._decalEl = this._decalEl || new t();
      n.buildPath === t.prototype.buildPath && (n.buildPath = function(l) {
        r.buildPath(l, r.shape);
      }), n.silent = !0;
      var a = n.style;
      for (var o in i)
        a[o] !== i[o] && (a[o] = i[o]);
      a.fill = i.fill ? i.decal : null, a.decal = null, a.shadowColor = null, i.strokeFirst && (a.stroke = null);
      for (var s = 0; s < Es.length; ++s)
        n[Es[s]] = this[Es[s]];
      n.__dirty |= Qt;
    } else this._decalEl && (this._decalEl = null);
  }, t.prototype.getDecalElement = function() {
    return this._decalEl;
  }, t.prototype._init = function(r) {
    var i = pt(r);
    this.shape = this.getDefaultShape();
    var n = this.getDefaultStyle();
    n && this.useStyle(n);
    for (var a = 0; a < i.length; a++) {
      var o = i[a], s = r[o];
      o === "style" ? this.style ? I(this.style, s) : this.useStyle(s) : o === "shape" ? I(this.shape, s) : e.prototype.attrKV.call(this, o, s);
    }
    this.style || this.useStyle({});
  }, t.prototype.getDefaultStyle = function() {
    return null;
  }, t.prototype.getDefaultShape = function() {
    return {};
  }, t.prototype.canBeInsideText = function() {
    return this.hasFill();
  }, t.prototype.getInsideTextFill = function() {
    var r = this.style.fill;
    if (r !== "none") {
      if (z(r)) {
        var i = ro(r, 0);
        return i > 0.5 ? Sl : i > 0.2 ? Gw : Tl;
      } else if (r)
        return Tl;
    }
    return Sl;
  }, t.prototype.getInsideTextStroke = function(r) {
    var i = this.style.fill;
    if (z(i)) {
      var n = this.__zr, a = !!(n && n.isDarkMode()), o = ro(r, 0) < bl;
      if (a === o)
        return i;
    }
  }, t.prototype.buildPath = function(r, i, n) {
  }, t.prototype.pathUpdated = function() {
    this.__dirty &= ~_i;
  }, t.prototype.getUpdatedPathProxy = function(r) {
    return !this.path && this.createPathProxy(), this.path.beginPath(), this.buildPath(this.path, this.shape, r), this.path;
  }, t.prototype.createPathProxy = function() {
    this.path = new Ni(!1);
  }, t.prototype.hasStroke = function() {
    var r = this.style, i = r.stroke;
    return !(i == null || i === "none" || !(r.lineWidth > 0));
  }, t.prototype.hasFill = function() {
    var r = this.style, i = r.fill;
    return i != null && i !== "none";
  }, t.prototype.getBoundingRect = function() {
    var r = this._rect, i = this.style, n = !r;
    if (n) {
      var a = !1;
      this.path || (a = !0, this.createPathProxy());
      var o = this.path;
      (a || this.__dirty & _i) && (o.beginPath(), this.buildPath(o, this.shape, !1), this.pathUpdated()), r = o.getBoundingRect();
    }
    if (this._rect = r, this.hasStroke() && this.path && this.path.len() > 0) {
      var s = this._rectStroke || (this._rectStroke = r.clone());
      if (this.__dirty || n) {
        s.copy(r);
        var l = i.strokeNoScale ? this.getLineScale() : 1, u = i.lineWidth;
        if (!this.hasFill()) {
          var h = this.strokeContainThreshold;
          u = Math.max(u, h ?? 4);
        }
        l > 1e-10 && (s.width += u / l, s.height += u / l, s.x -= u / l / 2, s.y -= u / l / 2);
      }
      return s;
    }
    return r;
  }, t.prototype.contain = function(r, i) {
    var n = this.transformCoordToLocal(r, i), a = this.getBoundingRect(), o = this.style;
    if (r = n[0], i = n[1], a.contain(r, i)) {
      var s = this.path;
      if (this.hasStroke()) {
        var l = o.lineWidth, u = o.strokeNoScale ? this.getLineScale() : 1;
        if (u > 1e-10 && (this.hasFill() || (l = Math.max(l, this.strokeContainThreshold)), lb(s, l / u, r, i)))
          return !0;
      }
      if (this.hasFill())
        return sb(s, r, i);
    }
    return !1;
  }, t.prototype.dirtyShape = function() {
    this.__dirty |= _i, this._rect && (this._rect = null), this._decalEl && this._decalEl.dirtyShape(), this.markRedraw();
  }, t.prototype.dirty = function() {
    this.dirtyStyle(), this.dirtyShape();
  }, t.prototype.animateShape = function(r) {
    return this.animate("shape", r);
  }, t.prototype.updateDuringAnimation = function(r) {
    r === "style" ? this.dirtyStyle() : r === "shape" ? this.dirtyShape() : this.markRedraw();
  }, t.prototype.attrKV = function(r, i) {
    r === "shape" ? this.setShape(i) : e.prototype.attrKV.call(this, r, i);
  }, t.prototype.setShape = function(r, i) {
    var n = this.shape;
    return n || (n = this.shape = {}), typeof r == "string" ? n[r] = i : I(n, r), this.dirtyShape(), this;
  }, t.prototype.shapeChanged = function() {
    return !!(this.__dirty & _i);
  }, t.prototype.createStyle = function(r) {
    return Lo(cd, r);
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var i = this._normalState;
    r.shape && !i.shape && (i.shape = I({}, this.shape));
  }, t.prototype._applyStateObj = function(r, i, n, a, o, s) {
    e.prototype._applyStateObj.call(this, r, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.shape ? o ? a ? u = i.shape : (u = I({}, n.shape), I(u, i.shape)) : (u = I({}, a ? this.shape : n.shape), I(u, i.shape)) : l && (u = n.shape), u)
      if (o) {
        this.shape = I({}, this.shape);
        for (var h = {}, f = pt(u), c = 0; c < f.length; c++) {
          var v = f[c];
          typeof u[v] == "object" ? this.shape[v] = u[v] : h[v] = u[v];
        }
        this._transitionState(r, {
          shape: h
        }, s);
      } else
        this.shape = u, this.dirtyShape();
  }, t.prototype._mergeStates = function(r) {
    for (var i = e.prototype._mergeStates.call(this, r), n, a = 0; a < r.length; a++) {
      var o = r[a];
      o.shape && (n = n || {}, this._mergeStyle(n, o.shape));
    }
    return n && (i.shape = n), i;
  }, t.prototype.getAnimationStyleProps = function() {
    return ub;
  }, t.prototype.isZeroArea = function() {
    return !1;
  }, t.extend = function(r) {
    var i = (function(a) {
      W(o, a);
      function o(s) {
        var l = a.call(this, s) || this;
        return r.init && r.init.call(l, s), l;
      }
      return o.prototype.getDefaultStyle = function() {
        return tt(r.style);
      }, o.prototype.getDefaultShape = function() {
        return tt(r.shape);
      }, o;
    })(t);
    for (var n in r)
      typeof r[n] == "function" && (i.prototype[n] = r[n]);
    return i;
  }, t.initDefaultProps = (function() {
    var r = t.prototype;
    r.type = "path", r.strokeContainThreshold = 5, r.segmentIgnoreThreshold = 0, r.subPixelOptimize = !1, r.autoBatch = !1, r.__dirty = Qt | dn | _i;
  })(), t;
})(ta), hb = ht({
  strokeFirst: !0,
  font: Kr,
  x: 0,
  y: 0,
  textAlign: "left",
  textBaseline: "top",
  miterLimit: 2
}, cd), so = (function(e) {
  W(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.hasStroke = function() {
    var r = this.style, i = r.stroke;
    return i != null && i !== "none" && r.lineWidth > 0;
  }, t.prototype.hasFill = function() {
    var r = this.style, i = r.fill;
    return i != null && i !== "none";
  }, t.prototype.createStyle = function(r) {
    return Lo(hb, r);
  }, t.prototype.setBoundingRect = function(r) {
    this._rect = r;
  }, t.prototype.getBoundingRect = function() {
    var r = this.style;
    if (!this._rect) {
      var i = r.text;
      i != null ? i += "" : i = "";
      var n = Wv(i, r.font, r.textAlign, r.textBaseline);
      if (n.x += r.x || 0, n.y += r.y || 0, this.hasStroke()) {
        var a = r.lineWidth;
        n.x -= a / 2, n.y -= a / 2, n.width += a, n.height += a;
      }
      this._rect = n;
    }
    return this._rect;
  }, t.initDefaultProps = (function() {
    var r = t.prototype;
    r.dirtyRectTolerance = 10;
  })(), t;
})(ta);
so.prototype.type = "tspan";
var fb = ht({
  x: 0,
  y: 0
}, Yr), cb = {
  style: ht({
    x: !0,
    y: !0,
    width: !0,
    height: !0,
    sx: !0,
    sy: !0,
    sWidth: !0,
    sHeight: !0
  }, $o.style)
};
function vb(e) {
  return !!(e && typeof e != "string" && e.width && e.height);
}
var Jr = (function(e) {
  W(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.createStyle = function(r) {
    return Lo(fb, r);
  }, t.prototype._getSize = function(r) {
    var i = this.style, n = i[r];
    if (n != null)
      return n;
    var a = vb(i.image) ? i.image : this.__image;
    if (!a)
      return 0;
    var o = r === "width" ? "height" : "width", s = i[o];
    return s == null ? a[r] : a[r] / a[o] * s;
  }, t.prototype.getWidth = function() {
    return this._getSize("width");
  }, t.prototype.getHeight = function() {
    return this._getSize("height");
  }, t.prototype.getAnimationStyleProps = function() {
    return cb;
  }, t.prototype.getBoundingRect = function() {
    var r = this.style;
    return this._rect || (this._rect = new at(r.x || 0, r.y || 0, this.getWidth(), this.getHeight())), this._rect;
  }, t;
})(ta);
Jr.prototype.type = "image";
function db(e, t) {
  var r = t.x, i = t.y, n = t.width, a = t.height, o = t.r, s, l, u, h;
  n < 0 && (r = r + n, n = -n), a < 0 && (i = i + a, a = -a), typeof o == "number" ? s = l = u = h = o : o instanceof Array ? o.length === 1 ? s = l = u = h = o[0] : o.length === 2 ? (s = u = o[0], l = h = o[1]) : o.length === 3 ? (s = o[0], l = h = o[1], u = o[2]) : (s = o[0], l = o[1], u = o[2], h = o[3]) : s = l = u = h = 0;
  var f;
  s + l > n && (f = s + l, s *= n / f, l *= n / f), u + h > n && (f = u + h, u *= n / f, h *= n / f), l + u > a && (f = l + u, l *= a / f, u *= a / f), s + h > a && (f = s + h, s *= a / f, h *= a / f), e.moveTo(r + s, i), e.lineTo(r + n - l, i), l !== 0 && e.arc(r + n - l, i + l, l, -Math.PI / 2, 0), e.lineTo(r + n, i + a - u), u !== 0 && e.arc(r + n - u, i + a - u, u, 0, Math.PI / 2), e.lineTo(r + h, i + a), h !== 0 && e.arc(r + h, i + a - h, h, Math.PI / 2, Math.PI), e.lineTo(r, i + s), s !== 0 && e.arc(r + s, i + s, s, Math.PI, Math.PI * 1.5);
}
var Si = Math.round;
function vd(e, t, r) {
  if (t) {
    var i = t.x1, n = t.x2, a = t.y1, o = t.y2;
    e.x1 = i, e.x2 = n, e.y1 = a, e.y2 = o;
    var s = r && r.lineWidth;
    return s && (Si(i * 2) === Si(n * 2) && (e.x1 = e.x2 = Hr(i, s, !0)), Si(a * 2) === Si(o * 2) && (e.y1 = e.y2 = Hr(a, s, !0))), e;
  }
}
function dd(e, t, r) {
  if (t) {
    var i = t.x, n = t.y, a = t.width, o = t.height;
    e.x = i, e.y = n, e.width = a, e.height = o;
    var s = r && r.lineWidth;
    return s && (e.x = Hr(i, s, !0), e.y = Hr(n, s, !0), e.width = Math.max(Hr(i + a, s, !1) - e.x, a === 0 ? 0 : 1), e.height = Math.max(Hr(n + o, s, !1) - e.y, o === 0 ? 0 : 1)), e;
  }
}
function Hr(e, t, r) {
  if (!t)
    return e;
  var i = Si(e * 2);
  return (i + Si(t)) % 2 === 0 ? i / 2 : (i + (r ? 1 : -1)) / 2;
}
var pb = /* @__PURE__ */ (function() {
  function e() {
    this.x = 0, this.y = 0, this.width = 0, this.height = 0;
  }
  return e;
})(), gb = {}, me = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new pb();
  }, t.prototype.buildPath = function(r, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = dd(gb, i, this.style);
      n = l.x, a = l.y, o = l.width, s = l.height, l.r = i.r, i = l;
    } else
      n = i.x, a = i.y, o = i.width, s = i.height;
    i.r ? db(r, i) : r.rect(n, a, o, s);
  }, t.prototype.isZeroArea = function() {
    return !this.shape.width || !this.shape.height;
  }, t;
})(ot);
me.prototype.type = "rect";
var tf = {
  fill: "#000"
}, ef = 2, _b = {
  style: ht({
    fill: !0,
    stroke: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineWidth: !0,
    fontSize: !0,
    lineHeight: !0,
    width: !0,
    height: !0,
    textShadowColor: !0,
    textShadowBlur: !0,
    textShadowOffsetX: !0,
    textShadowOffsetY: !0,
    backgroundColor: !0,
    padding: !0,
    borderColor: !0,
    borderWidth: !0,
    borderRadius: !0
  }, $o.style)
}, ye = (function(e) {
  W(t, e);
  function t(r) {
    var i = e.call(this) || this;
    return i.type = "text", i._children = [], i._defaultStyle = tf, i.attr(r), i;
  }
  return t.prototype.childrenRef = function() {
    return this._children;
  }, t.prototype.update = function() {
    e.prototype.update.call(this), this.styleChanged() && this._updateSubTexts();
    for (var r = 0; r < this._children.length; r++) {
      var i = this._children[r];
      i.zlevel = this.zlevel, i.z = this.z, i.z2 = this.z2, i.culling = this.culling, i.cursor = this.cursor, i.invisible = this.invisible;
    }
  }, t.prototype.updateTransform = function() {
    var r = this.innerTransformable;
    r ? (r.updateTransform(), r.transform && (this.transform = r.transform)) : e.prototype.updateTransform.call(this);
  }, t.prototype.getLocalTransform = function(r) {
    var i = this.innerTransformable;
    return i ? i.getLocalTransform(r) : e.prototype.getLocalTransform.call(this, r);
  }, t.prototype.getComputedTransform = function() {
    return this.__hostTarget && (this.__hostTarget.getComputedTransform(), this.__hostTarget.updateInnerText(!0)), e.prototype.getComputedTransform.call(this);
  }, t.prototype._updateSubTexts = function() {
    this._childCursor = 0, Sb(this.style), this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(), this._children.length = this._childCursor, this.styleUpdated();
  }, t.prototype.addSelfToZr = function(r) {
    e.prototype.addSelfToZr.call(this, r);
    for (var i = 0; i < this._children.length; i++)
      this._children[i].__zr = r;
  }, t.prototype.removeSelfFromZr = function(r) {
    e.prototype.removeSelfFromZr.call(this, r);
    for (var i = 0; i < this._children.length; i++)
      this._children[i].__zr = null;
  }, t.prototype.getBoundingRect = function() {
    if (this.styleChanged() && this._updateSubTexts(), !this._rect) {
      for (var r = new at(0, 0, 0, 0), i = this._children, n = [], a = null, o = 0; o < i.length; o++) {
        var s = i[o], l = s.getBoundingRect(), u = s.getLocalTransform(n);
        u ? (r.copy(l), r.applyTransform(u), a = a || r.clone(), a.union(r)) : (a = a || l.clone(), a.union(l));
      }
      this._rect = a || r;
    }
    return this._rect;
  }, t.prototype.setDefaultTextStyle = function(r) {
    this._defaultStyle = r || tf;
  }, t.prototype.setTextContent = function(r) {
    if (process.env.NODE_ENV !== "production")
      throw new Error("Can't attach text on another text");
  }, t.prototype._mergeStyle = function(r, i) {
    if (!i)
      return r;
    var n = i.rich, a = r.rich || n && {};
    return I(r, i), n && a ? (this._mergeRich(a, n), r.rich = a) : a && (r.rich = a), r;
  }, t.prototype._mergeRich = function(r, i) {
    for (var n = pt(i), a = 0; a < n.length; a++) {
      var o = n[a];
      r[o] = r[o] || {}, I(r[o], i[o]);
    }
  }, t.prototype.getAnimationStyleProps = function() {
    return _b;
  }, t.prototype._getOrCreateChild = function(r) {
    var i = this._children[this._childCursor];
    return (!i || !(i instanceof r)) && (i = new r()), this._children[this._childCursor++] = i, i.__zr = this.__zr, i.parent = this, i;
  }, t.prototype._updatePlainTexts = function() {
    var r = this.style, i = r.font || Kr, n = r.padding, a = uf(r), o = V1(a, r), s = As(r), l = !!r.backgroundColor, u = o.outerHeight, h = o.outerWidth, f = o.contentWidth, c = o.lines, v = o.lineHeight, d = this._defaultStyle;
    this.isTruncated = !!o.isTruncated;
    var _ = r.x || 0, p = r.y || 0, g = r.align || d.align || "left", m = r.verticalAlign || d.verticalAlign || "top", y = _, w = mi(p, o.contentHeight, m);
    if (s || n) {
      var S = gn(_, h, g), b = mi(p, u, m);
      s && this._renderBackground(r, r, S, b, h, u);
    }
    w += v / 2, n && (y = lf(_, g, n), m === "top" ? w += n[0] : m === "bottom" && (w -= n[2]));
    for (var T = 0, C = !1, x = sf("fill" in r ? r.fill : (C = !0, d.fill)), E = of("stroke" in r ? r.stroke : !l && (!d.autoStroke || C) ? (T = ef, d.stroke) : null), A = r.textShadowBlur > 0, M = r.width != null && (r.overflow === "truncate" || r.overflow === "break" || r.overflow === "breakAll"), L = o.calculatedLineHeight, P = 0; P < c.length; P++) {
      var O = this._getOrCreateChild(so), R = O.createStyle();
      O.useStyle(R), R.text = c[P], R.x = y, R.y = w, R.textAlign = g, R.textBaseline = "middle", R.opacity = r.opacity, R.strokeFirst = !0, A && (R.shadowBlur = r.textShadowBlur || 0, R.shadowColor = r.textShadowColor || "transparent", R.shadowOffsetX = r.textShadowOffsetX || 0, R.shadowOffsetY = r.textShadowOffsetY || 0), R.stroke = E, R.fill = x, E && (R.lineWidth = r.lineWidth || T, R.lineDash = r.lineDash, R.lineDashOffset = r.lineDashOffset || 0), R.font = i, nf(R, r), w += v, M && O.setBoundingRect(new at(gn(R.x, f, R.textAlign), mi(R.y, L, R.textBaseline), f, L));
    }
  }, t.prototype._updateRichTexts = function() {
    var r = this.style, i = uf(r), n = U1(i, r), a = n.width, o = n.outerWidth, s = n.outerHeight, l = r.padding, u = r.x || 0, h = r.y || 0, f = this._defaultStyle, c = r.align || f.align, v = r.verticalAlign || f.verticalAlign;
    this.isTruncated = !!n.isTruncated;
    var d = gn(u, o, c), _ = mi(h, s, v), p = d, g = _;
    l && (p += l[3], g += l[0]);
    var m = p + a;
    As(r) && this._renderBackground(r, r, d, _, o, s);
    for (var y = !!r.backgroundColor, w = 0; w < n.lines.length; w++) {
      for (var S = n.lines[w], b = S.tokens, T = b.length, C = S.lineHeight, x = S.width, E = 0, A = p, M = m, L = T - 1, P = void 0; E < T && (P = b[E], !P.align || P.align === "left"); )
        this._placeToken(P, r, C, g, A, "left", y), x -= P.width, A += P.width, E++;
      for (; L >= 0 && (P = b[L], P.align === "right"); )
        this._placeToken(P, r, C, g, M, "right", y), x -= P.width, M -= P.width, L--;
      for (A += (a - (A - p) - (m - M) - x) / 2; E <= L; )
        P = b[E], this._placeToken(P, r, C, g, A + P.width / 2, "center", y), A += P.width, E++;
      g += C;
    }
  }, t.prototype._placeToken = function(r, i, n, a, o, s, l) {
    var u = i.rich[r.styleName] || {};
    u.text = r.text;
    var h = r.verticalAlign, f = a + n / 2;
    h === "top" ? f = a + r.height / 2 : h === "bottom" && (f = a + n - r.height / 2);
    var c = !r.isLineHolder && As(u);
    c && this._renderBackground(u, i, s === "right" ? o - r.width : s === "center" ? o - r.width / 2 : o, f - r.height / 2, r.width, r.height);
    var v = !!u.backgroundColor, d = r.textPadding;
    d && (o = lf(o, s, d), f -= r.height / 2 - d[0] - r.innerHeight / 2);
    var _ = this._getOrCreateChild(so), p = _.createStyle();
    _.useStyle(p);
    var g = this._defaultStyle, m = !1, y = 0, w = sf("fill" in u ? u.fill : "fill" in i ? i.fill : (m = !0, g.fill)), S = of("stroke" in u ? u.stroke : "stroke" in i ? i.stroke : !v && !l && (!g.autoStroke || m) ? (y = ef, g.stroke) : null), b = u.textShadowBlur > 0 || i.textShadowBlur > 0;
    p.text = r.text, p.x = o, p.y = f, b && (p.shadowBlur = u.textShadowBlur || i.textShadowBlur || 0, p.shadowColor = u.textShadowColor || i.textShadowColor || "transparent", p.shadowOffsetX = u.textShadowOffsetX || i.textShadowOffsetX || 0, p.shadowOffsetY = u.textShadowOffsetY || i.textShadowOffsetY || 0), p.textAlign = s, p.textBaseline = "middle", p.font = r.font || Kr, p.opacity = Sn(u.opacity, i.opacity, 1), nf(p, u), S && (p.lineWidth = Sn(u.lineWidth, i.lineWidth, y), p.lineDash = X(u.lineDash, i.lineDash), p.lineDashOffset = i.lineDashOffset || 0, p.stroke = S), w && (p.fill = w);
    var T = r.contentWidth, C = r.contentHeight;
    _.setBoundingRect(new at(gn(p.x, T, p.textAlign), mi(p.y, C, p.textBaseline), T, C));
  }, t.prototype._renderBackground = function(r, i, n, a, o, s) {
    var l = r.backgroundColor, u = r.borderWidth, h = r.borderColor, f = l && l.image, c = l && !f, v = r.borderRadius, d = this, _, p;
    if (c || r.lineHeight || u && h) {
      _ = this._getOrCreateChild(me), _.useStyle(_.createStyle()), _.style.fill = null;
      var g = _.shape;
      g.x = n, g.y = a, g.width = o, g.height = s, g.r = v, _.dirtyShape();
    }
    if (c) {
      var m = _.style;
      m.fill = l || null, m.fillOpacity = X(r.fillOpacity, 1);
    } else if (f) {
      p = this._getOrCreateChild(Jr), p.onload = function() {
        d.dirtyStyle();
      };
      var y = p.style;
      y.image = l.image, y.x = n, y.y = a, y.width = o, y.height = s;
    }
    if (u && h) {
      var m = _.style;
      m.lineWidth = u, m.stroke = h, m.strokeOpacity = X(r.strokeOpacity, 1), m.lineDash = r.borderDash, m.lineDashOffset = r.borderDashOffset || 0, _.strokeContainThreshold = 0, _.hasFill() && _.hasStroke() && (m.strokeFirst = !0, m.lineWidth *= 2);
    }
    var w = (_ || p).style;
    w.shadowBlur = r.shadowBlur || 0, w.shadowColor = r.shadowColor || "transparent", w.shadowOffsetX = r.shadowOffsetX || 0, w.shadowOffsetY = r.shadowOffsetY || 0, w.opacity = Sn(r.opacity, i.opacity, 1);
  }, t.makeFont = function(r) {
    var i = "";
    return bb(r) && (i = [
      r.fontStyle,
      r.fontWeight,
      wb(r.fontSize),
      r.fontFamily || "sans-serif"
    ].join(" ")), i && Pe(i) || r.textFont || r.font;
  }, t;
})(ta), mb = { left: !0, right: 1, center: 1 }, yb = { top: 1, bottom: 1, middle: 1 }, rf = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function wb(e) {
  return typeof e == "string" && (e.indexOf("px") !== -1 || e.indexOf("rem") !== -1 || e.indexOf("em") !== -1) ? e : isNaN(+e) ? au + "px" : e + "px";
}
function nf(e, t) {
  for (var r = 0; r < rf.length; r++) {
    var i = rf[r], n = t[i];
    n != null && (e[i] = n);
  }
}
function bb(e) {
  return e.fontSize != null || e.fontFamily || e.fontWeight;
}
function Sb(e) {
  return af(e), D(e.rich, af), e;
}
function af(e) {
  if (e) {
    e.font = ye.makeFont(e);
    var t = e.align;
    t === "middle" && (t = "center"), e.align = t == null || mb[t] ? t : "left";
    var r = e.verticalAlign;
    r === "center" && (r = "middle"), e.verticalAlign = r == null || yb[r] ? r : "top";
    var i = e.padding;
    i && (e.padding = Sv(e.padding));
  }
}
function of(e, t) {
  return e == null || t <= 0 || e === "transparent" || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function sf(e) {
  return e == null || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function lf(e, t, r) {
  return t === "right" ? e - r[1] : t === "center" ? e + r[3] / 2 - r[1] / 2 : e + r[3];
}
function uf(e) {
  var t = e.text;
  return t != null && (t += ""), t;
}
function As(e) {
  return !!(e.backgroundColor || e.lineHeight || e.borderWidth && e.borderColor);
}
var vt = St(), Tb = function(e, t, r, i) {
  if (i) {
    var n = vt(i);
    n.dataIndex = r, n.dataType = t, n.seriesIndex = e, n.ssrType = "chart", i.type === "group" && i.traverse(function(a) {
      var o = vt(a);
      o.seriesIndex = e, o.dataIndex = r, o.dataType = t, o.ssrType = "chart";
    });
  }
}, hf = 1, ff = {}, pd = St(), yu = St(), gd = 0, wu = 1, bu = 2, ke = ["emphasis", "blur", "select"], lo = ["normal", "emphasis", "blur", "select"], Cb = 10, xb = 9, Xr = "highlight", Va = "downplay", An = "select", za = "unselect", Mn = "toggleSelect";
function si(e) {
  return e != null && e !== "none";
}
function Bo(e, t, r) {
  e.onHoverStateChange && (e.hoverState || 0) !== r && e.onHoverStateChange(t), e.hoverState = r;
}
function _d(e) {
  Bo(e, "emphasis", bu);
}
function md(e) {
  e.hoverState === bu && Bo(e, "normal", gd);
}
function Su(e) {
  Bo(e, "blur", wu);
}
function yd(e) {
  e.hoverState === wu && Bo(e, "normal", gd);
}
function Db(e) {
  e.selected = !0;
}
function Eb(e) {
  e.selected = !1;
}
function cf(e, t, r) {
  t(e, r);
}
function je(e, t, r) {
  cf(e, t, r), e.isGroup && e.traverse(function(i) {
    cf(i, t, r);
  });
}
function Ab(e, t, r, i) {
  for (var n = e.style, a = {}, o = 0; o < t.length; o++) {
    var s = t[o], l = n[s];
    a[s] = l ?? (i && i[s]);
  }
  for (var o = 0; o < e.animators.length; o++) {
    var u = e.animators[o];
    u.__fromStateTransition && u.__fromStateTransition.indexOf(r) < 0 && u.targetName === "style" && u.saveTo(a, t);
  }
  return a;
}
function Mb(e, t, r, i) {
  var n = r && st(r, "select") >= 0, a = !1;
  if (e instanceof ot) {
    var o = pd(e), s = n && o.selectFill || o.normalFill, l = n && o.selectStroke || o.normalStroke;
    if (si(s) || si(l)) {
      i = i || {};
      var u = i.style || {};
      u.fill === "inherit" ? (a = !0, i = I({}, i), u = I({}, u), u.fill = s) : !si(u.fill) && si(s) ? (a = !0, i = I({}, i), u = I({}, u), u.fill = Ah(s)) : !si(u.stroke) && si(l) && (a || (i = I({}, i), u = I({}, u)), u.stroke = Ah(l)), i.style = u;
    }
  }
  if (i && i.z2 == null) {
    a || (i = I({}, i));
    var h = e.z2EmphasisLift;
    i.z2 = e.z2 + (h ?? Cb);
  }
  return i;
}
function Pb(e, t, r) {
  if (r && r.z2 == null) {
    r = I({}, r);
    var i = e.z2SelectLift;
    r.z2 = e.z2 + (i ?? xb);
  }
  return r;
}
function Lb(e, t, r) {
  var i = st(e.currentStates, t) >= 0, n = e.style.opacity, a = i ? null : Ab(e, ["opacity"], t, {
    opacity: 1
  });
  r = r || {};
  var o = r.style || {};
  return o.opacity == null && (r = I({}, r), o = I({
    // Already being applied 'emphasis'. DON'T mul opacity multiple times.
    opacity: i ? n : a.opacity * 0.1
  }, o), r.style = o), r;
}
function Ms(e, t) {
  var r = this.states[e];
  if (this.style) {
    if (e === "emphasis")
      return Mb(this, e, t, r);
    if (e === "blur")
      return Lb(this, e, r);
    if (e === "select")
      return Pb(this, e, r);
  }
  return r;
}
function Ib(e) {
  e.stateProxy = Ms;
  var t = e.getTextContent(), r = e.getTextGuideLine();
  t && (t.stateProxy = Ms), r && (r.stateProxy = Ms);
}
function vf(e, t) {
  !Td(e, t) && !e.__highByOuter && je(e, _d);
}
function df(e, t) {
  !Td(e, t) && !e.__highByOuter && je(e, md);
}
function Al(e, t) {
  e.__highByOuter |= 1 << (t || 0), je(e, _d);
}
function Ml(e, t) {
  !(e.__highByOuter &= ~(1 << (t || 0))) && je(e, md);
}
function Rb(e) {
  je(e, Su);
}
function wd(e) {
  je(e, yd);
}
function bd(e) {
  je(e, Db);
}
function Sd(e) {
  je(e, Eb);
}
function Td(e, t) {
  return e.__highDownSilentOnTouch && t.zrByTouch;
}
function Cd(e) {
  var t = e.getModel(), r = [], i = [];
  t.eachComponent(function(n, a) {
    var o = yu(a), s = n === "series", l = s ? e.getViewOfSeriesModel(a) : e.getViewOfComponentModel(a);
    !s && i.push(l), o.isBlured && (l.group.traverse(function(u) {
      yd(u);
    }), s && r.push(a)), o.isBlured = !1;
  }), D(i, function(n) {
    n && n.toggleBlurSeries && n.toggleBlurSeries(r, !1, t);
  });
}
function Pl(e, t, r, i) {
  var n = i.getModel();
  r = r || "coordinateSystem";
  function a(u, h) {
    for (var f = 0; f < h.length; f++) {
      var c = u.getItemGraphicEl(h[f]);
      c && wd(c);
    }
  }
  if (e != null && !(!t || t === "none")) {
    var o = n.getSeriesByIndex(e), s = o.coordinateSystem;
    s && s.master && (s = s.master);
    var l = [];
    n.eachSeries(function(u) {
      var h = o === u, f = u.coordinateSystem;
      f && f.master && (f = f.master);
      var c = f && s ? f === s : h;
      if (!// Not blur other series if blurScope series
      (r === "series" && !h || r === "coordinateSystem" && !c || t === "series" && h)) {
        var v = i.getViewOfSeriesModel(u);
        if (v.group.traverse(function(p) {
          p.__highByOuter && h && t === "self" || Su(p);
        }), Yt(t))
          a(u.getData(), t);
        else if (B(t))
          for (var d = pt(t), _ = 0; _ < d.length; _++)
            a(u.getData(d[_]), t[d[_]]);
        l.push(u), yu(u).isBlured = !0;
      }
    }), n.eachComponent(function(u, h) {
      if (u !== "series") {
        var f = i.getViewOfComponentModel(h);
        f && f.toggleBlurSeries && f.toggleBlurSeries(l, !0, n);
      }
    });
  }
}
function Ll(e, t, r) {
  if (!(e == null || t == null)) {
    var i = r.getModel().getComponent(e, t);
    if (i) {
      yu(i).isBlured = !0;
      var n = r.getViewOfComponentModel(i);
      !n || !n.focusBlurEnabled || n.group.traverse(function(a) {
        Su(a);
      });
    }
  }
}
function Ob(e, t, r) {
  var i = e.seriesIndex, n = e.getData(t.dataType);
  if (!n) {
    process.env.NODE_ENV !== "production" && It("Unknown dataType " + t.dataType);
    return;
  }
  var a = Qn(n, t);
  a = (k(a) ? a[0] : a) || 0;
  var o = n.getItemGraphicEl(a);
  if (!o)
    for (var s = n.count(), l = 0; !o && l < s; )
      o = n.getItemGraphicEl(l++);
  if (o) {
    var u = vt(o);
    Pl(i, u.focus, u.blurScope, r);
  } else {
    var h = e.get(["emphasis", "focus"]), f = e.get(["emphasis", "blurScope"]);
    h != null && Pl(i, h, f, r);
  }
}
function Tu(e, t, r, i) {
  var n = {
    focusSelf: !1,
    dispatchers: null
  };
  if (e == null || e === "series" || t == null || r == null)
    return n;
  var a = i.getModel().getComponent(e, t);
  if (!a)
    return n;
  var o = i.getViewOfComponentModel(a);
  if (!o || !o.findHighDownDispatchers)
    return n;
  for (var s = o.findHighDownDispatchers(r), l, u = 0; u < s.length; u++)
    if (process.env.NODE_ENV !== "production" && !$i(s[u]) && It("param should be highDownDispatcher"), vt(s[u]).focus === "self") {
      l = !0;
      break;
    }
  return {
    focusSelf: l,
    dispatchers: s
  };
}
function kb(e, t, r) {
  process.env.NODE_ENV !== "production" && !$i(e) && It("param should be highDownDispatcher");
  var i = vt(e), n = Tu(i.componentMainType, i.componentIndex, i.componentHighDownName, r), a = n.dispatchers, o = n.focusSelf;
  a ? (o && Ll(i.componentMainType, i.componentIndex, r), D(a, function(s) {
    return vf(s, t);
  })) : (Pl(i.seriesIndex, i.focus, i.blurScope, r), i.focus === "self" && Ll(i.componentMainType, i.componentIndex, r), vf(e, t));
}
function Nb(e, t, r) {
  process.env.NODE_ENV !== "production" && !$i(e) && It("param should be highDownDispatcher"), Cd(r);
  var i = vt(e), n = Tu(i.componentMainType, i.componentIndex, i.componentHighDownName, r).dispatchers;
  n ? D(n, function(a) {
    return df(a, t);
  }) : df(e, t);
}
function $b(e, t, r) {
  if (Il(t)) {
    var i = t.dataType, n = e.getData(i), a = Qn(n, t);
    k(a) || (a = [a]), e[t.type === Mn ? "toggleSelect" : t.type === An ? "select" : "unselect"](a, i);
  }
}
function pf(e) {
  var t = e.getAllData();
  D(t, function(r) {
    var i = r.data, n = r.type;
    i.eachItemGraphicEl(function(a, o) {
      e.isSelected(o, n) ? bd(a) : Sd(a);
    });
  });
}
function Bb(e) {
  var t = [];
  return e.eachSeries(function(r) {
    var i = r.getAllData();
    D(i, function(n) {
      n.data;
      var a = n.type, o = r.getSelectedDataIndices();
      if (o.length > 0) {
        var s = {
          dataIndex: o,
          seriesIndex: r.seriesIndex
        };
        a != null && (s.dataType = a), t.push(s);
      }
    });
  }), t;
}
function Fb(e, t, r) {
  xd(e, !0), je(e, Ib), Hb(e, t, r);
}
function Vb(e) {
  xd(e, !1);
}
function zb(e, t, r, i) {
  i ? Vb(e) : Fb(e, t, r);
}
function Hb(e, t, r) {
  var i = vt(e);
  t != null ? (i.focus = t, i.blurScope = r) : i.focus && (i.focus = null);
}
var gf = ["emphasis", "blur", "select"], Ub = {
  itemStyle: "getItemStyle",
  lineStyle: "getLineStyle",
  areaStyle: "getAreaStyle"
};
function Gb(e, t, r, i) {
  r = r || "itemStyle";
  for (var n = 0; n < gf.length; n++) {
    var a = gf[n], o = t.getModel([a, r]), s = e.ensureState(a);
    s.style = o[Ub[r]]();
  }
}
function xd(e, t) {
  var r = t === !1, i = e;
  e.highDownSilentOnTouch && (i.__highDownSilentOnTouch = e.highDownSilentOnTouch), (!r || i.__highDownDispatcher) && (i.__highByOuter = i.__highByOuter || 0, i.__highDownDispatcher = !r);
}
function $i(e) {
  return !!(e && e.__highDownDispatcher);
}
function Wb(e) {
  var t = ff[e];
  return t == null && hf <= 32 && (t = ff[e] = hf++), t;
}
function Il(e) {
  var t = e.type;
  return t === An || t === za || t === Mn;
}
function _f(e) {
  var t = e.type;
  return t === Xr || t === Va;
}
function Yb(e) {
  var t = pd(e);
  t.normalFill = e.style.fill, t.normalStroke = e.style.stroke;
  var r = e.states.select || {};
  t.selectFill = r.style && r.style.fill || null, t.selectStroke = r.style && r.style.stroke || null;
}
var li = Ni.CMD, Xb = [[], [], []], mf = Math.sqrt, qb = Math.atan2;
function Zb(e, t) {
  if (t) {
    var r = e.data, i = e.len(), n, a, o, s, l, u, h = li.M, f = li.C, c = li.L, v = li.R, d = li.A, _ = li.Q;
    for (o = 0, s = 0; o < i; ) {
      switch (n = r[o++], s = o, a = 0, n) {
        case h:
          a = 1;
          break;
        case c:
          a = 1;
          break;
        case f:
          a = 3;
          break;
        case _:
          a = 2;
          break;
        case d:
          var p = t[4], g = t[5], m = mf(t[0] * t[0] + t[1] * t[1]), y = mf(t[2] * t[2] + t[3] * t[3]), w = qb(-t[1] / y, t[0] / m);
          r[o] *= m, r[o++] += p, r[o] *= y, r[o++] += g, r[o++] *= m, r[o++] *= y, r[o++] += w, r[o++] += w, o += 2, s = o;
          break;
        case v:
          u[0] = r[o++], u[1] = r[o++], Ie(u, u, t), r[s++] = u[0], r[s++] = u[1], u[0] += r[o++], u[1] += r[o++], Ie(u, u, t), r[s++] = u[0], r[s++] = u[1];
      }
      for (l = 0; l < a; l++) {
        var S = Xb[l];
        S[0] = r[o++], S[1] = r[o++], Ie(S, S, t), r[s++] = S[0], r[s++] = S[1];
      }
    }
    e.increaseVersion();
  }
}
var Ps = Math.sqrt, ga = Math.sin, _a = Math.cos, en = Math.PI;
function yf(e) {
  return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
}
function Rl(e, t) {
  return (e[0] * t[0] + e[1] * t[1]) / (yf(e) * yf(t));
}
function wf(e, t) {
  return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(Rl(e, t));
}
function bf(e, t, r, i, n, a, o, s, l, u, h) {
  var f = l * (en / 180), c = _a(f) * (e - r) / 2 + ga(f) * (t - i) / 2, v = -1 * ga(f) * (e - r) / 2 + _a(f) * (t - i) / 2, d = c * c / (o * o) + v * v / (s * s);
  d > 1 && (o *= Ps(d), s *= Ps(d));
  var _ = (n === a ? -1 : 1) * Ps((o * o * (s * s) - o * o * (v * v) - s * s * (c * c)) / (o * o * (v * v) + s * s * (c * c))) || 0, p = _ * o * v / s, g = _ * -s * c / o, m = (e + r) / 2 + _a(f) * p - ga(f) * g, y = (t + i) / 2 + ga(f) * p + _a(f) * g, w = wf([1, 0], [(c - p) / o, (v - g) / s]), S = [(c - p) / o, (v - g) / s], b = [(-1 * c - p) / o, (-1 * v - g) / s], T = wf(S, b);
  if (Rl(S, b) <= -1 && (T = en), Rl(S, b) >= 1 && (T = 0), T < 0) {
    var C = Math.round(T / en * 1e6) / 1e6;
    T = en * 2 + C % 2 * en;
  }
  h.addData(u, m, y, o, s, w, T, f, a);
}
var Kb = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig, jb = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function Qb(e) {
  var t = new Ni();
  if (!e)
    return t;
  var r = 0, i = 0, n = r, a = i, o, s = Ni.CMD, l = e.match(Kb);
  if (!l)
    return t;
  for (var u = 0; u < l.length; u++) {
    for (var h = l[u], f = h.charAt(0), c = void 0, v = h.match(jb) || [], d = v.length, _ = 0; _ < d; _++)
      v[_] = parseFloat(v[_]);
    for (var p = 0; p < d; ) {
      var g = void 0, m = void 0, y = void 0, w = void 0, S = void 0, b = void 0, T = void 0, C = r, x = i, E = void 0, A = void 0;
      switch (f) {
        case "l":
          r += v[p++], i += v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "L":
          r = v[p++], i = v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "m":
          r += v[p++], i += v[p++], c = s.M, t.addData(c, r, i), n = r, a = i, f = "l";
          break;
        case "M":
          r = v[p++], i = v[p++], c = s.M, t.addData(c, r, i), n = r, a = i, f = "L";
          break;
        case "h":
          r += v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "H":
          r = v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "v":
          i += v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "V":
          i = v[p++], c = s.L, t.addData(c, r, i);
          break;
        case "C":
          c = s.C, t.addData(c, v[p++], v[p++], v[p++], v[p++], v[p++], v[p++]), r = v[p - 2], i = v[p - 1];
          break;
        case "c":
          c = s.C, t.addData(c, v[p++] + r, v[p++] + i, v[p++] + r, v[p++] + i, v[p++] + r, v[p++] + i), r += v[p - 2], i += v[p - 1];
          break;
        case "S":
          g = r, m = i, E = t.len(), A = t.data, o === s.C && (g += r - A[E - 4], m += i - A[E - 3]), c = s.C, C = v[p++], x = v[p++], r = v[p++], i = v[p++], t.addData(c, g, m, C, x, r, i);
          break;
        case "s":
          g = r, m = i, E = t.len(), A = t.data, o === s.C && (g += r - A[E - 4], m += i - A[E - 3]), c = s.C, C = r + v[p++], x = i + v[p++], r += v[p++], i += v[p++], t.addData(c, g, m, C, x, r, i);
          break;
        case "Q":
          C = v[p++], x = v[p++], r = v[p++], i = v[p++], c = s.Q, t.addData(c, C, x, r, i);
          break;
        case "q":
          C = v[p++] + r, x = v[p++] + i, r += v[p++], i += v[p++], c = s.Q, t.addData(c, C, x, r, i);
          break;
        case "T":
          g = r, m = i, E = t.len(), A = t.data, o === s.Q && (g += r - A[E - 4], m += i - A[E - 3]), r = v[p++], i = v[p++], c = s.Q, t.addData(c, g, m, r, i);
          break;
        case "t":
          g = r, m = i, E = t.len(), A = t.data, o === s.Q && (g += r - A[E - 4], m += i - A[E - 3]), r += v[p++], i += v[p++], c = s.Q, t.addData(c, g, m, r, i);
          break;
        case "A":
          y = v[p++], w = v[p++], S = v[p++], b = v[p++], T = v[p++], C = r, x = i, r = v[p++], i = v[p++], c = s.A, bf(C, x, r, i, b, T, y, w, S, c, t);
          break;
        case "a":
          y = v[p++], w = v[p++], S = v[p++], b = v[p++], T = v[p++], C = r, x = i, r += v[p++], i += v[p++], c = s.A, bf(C, x, r, i, b, T, y, w, S, c, t);
          break;
      }
    }
    (f === "z" || f === "Z") && (c = s.Z, t.addData(c), r = n, i = a), o = c;
  }
  return t.toStatic(), t;
}
var Dd = (function(e) {
  W(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.applyTransform = function(r) {
  }, t;
})(ot);
function Ed(e) {
  return e.setData != null;
}
function Ad(e, t) {
  var r = Qb(e), i = I({}, t);
  return i.buildPath = function(n) {
    if (Ed(n)) {
      n.setData(r.data);
      var a = n.getContext();
      a && n.rebuildPath(a, 1);
    } else {
      var a = n;
      r.rebuildPath(a, 1);
    }
  }, i.applyTransform = function(n) {
    Zb(r, n), this.dirtyShape();
  }, i;
}
function Jb(e, t) {
  return new Dd(Ad(e, t));
}
function tS(e, t) {
  var r = Ad(e, t), i = (function(n) {
    W(a, n);
    function a(o) {
      var s = n.call(this, o) || this;
      return s.applyTransform = r.applyTransform, s.buildPath = r.buildPath, s;
    }
    return a;
  })(Dd);
  return i;
}
function eS(e, t) {
  for (var r = [], i = e.length, n = 0; n < i; n++) {
    var a = e[n];
    r.push(a.getUpdatedPathProxy(!0));
  }
  var o = new ot(t);
  return o.createPathProxy(), o.buildPath = function(s) {
    if (Ed(s)) {
      s.appendPath(r);
      var l = s.getContext();
      l && s.rebuildPath(l, 1);
    }
  }, o;
}
var rS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0;
  }
  return e;
})(), Fo = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new rS();
  }, t.prototype.buildPath = function(r, i) {
    r.moveTo(i.cx + i.r, i.cy), r.arc(i.cx, i.cy, i.r, 0, Math.PI * 2);
  }, t;
})(ot);
Fo.prototype.type = "circle";
var iS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.rx = 0, this.ry = 0;
  }
  return e;
})(), Cu = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new iS();
  }, t.prototype.buildPath = function(r, i) {
    var n = 0.5522848, a = i.cx, o = i.cy, s = i.rx, l = i.ry, u = s * n, h = l * n;
    r.moveTo(a - s, o), r.bezierCurveTo(a - s, o - h, a - u, o - l, a, o - l), r.bezierCurveTo(a + u, o - l, a + s, o - h, a + s, o), r.bezierCurveTo(a + s, o + h, a + u, o + l, a, o + l), r.bezierCurveTo(a - u, o + l, a - s, o + h, a - s, o), r.closePath();
  }, t;
})(ot);
Cu.prototype.type = "ellipse";
var Md = Math.PI, Ls = Md * 2, Rr = Math.sin, ui = Math.cos, nS = Math.acos, At = Math.atan2, Sf = Math.abs, Pn = Math.sqrt, mn = Math.max, Ee = Math.min, ve = 1e-4;
function aS(e, t, r, i, n, a, o, s) {
  var l = r - e, u = i - t, h = o - n, f = s - a, c = f * l - h * u;
  if (!(c * c < ve))
    return c = (h * (t - a) - f * (e - n)) / c, [e + c * l, t + c * u];
}
function ma(e, t, r, i, n, a, o) {
  var s = e - r, l = t - i, u = (o ? a : -a) / Pn(s * s + l * l), h = u * l, f = -u * s, c = e + h, v = t + f, d = r + h, _ = i + f, p = (c + d) / 2, g = (v + _) / 2, m = d - c, y = _ - v, w = m * m + y * y, S = n - a, b = c * _ - d * v, T = (y < 0 ? -1 : 1) * Pn(mn(0, S * S * w - b * b)), C = (b * y - m * T) / w, x = (-b * m - y * T) / w, E = (b * y + m * T) / w, A = (-b * m + y * T) / w, M = C - p, L = x - g, P = E - p, O = A - g;
  return M * M + L * L > P * P + O * O && (C = E, x = A), {
    cx: C,
    cy: x,
    x0: -h,
    y0: -f,
    x1: C * (n / S - 1),
    y1: x * (n / S - 1)
  };
}
function oS(e) {
  var t;
  if (k(e)) {
    var r = e.length;
    if (!r)
      return e;
    r === 1 ? t = [e[0], e[0], 0, 0] : r === 2 ? t = [e[0], e[0], e[1], e[1]] : r === 3 ? t = e.concat(e[2]) : t = e;
  } else
    t = [e, e, e, e];
  return t;
}
function sS(e, t) {
  var r, i = mn(t.r, 0), n = mn(t.r0 || 0, 0), a = i > 0, o = n > 0;
  if (!(!a && !o)) {
    if (a || (i = n, n = 0), n > i) {
      var s = i;
      i = n, n = s;
    }
    var l = t.startAngle, u = t.endAngle;
    if (!(isNaN(l) || isNaN(u))) {
      var h = t.cx, f = t.cy, c = !!t.clockwise, v = Sf(u - l), d = v > Ls && v % Ls;
      if (d > ve && (v = d), !(i > ve))
        e.moveTo(h, f);
      else if (v > Ls - ve)
        e.moveTo(h + i * ui(l), f + i * Rr(l)), e.arc(h, f, i, l, u, !c), n > ve && (e.moveTo(h + n * ui(u), f + n * Rr(u)), e.arc(h, f, n, u, l, c));
      else {
        var _ = void 0, p = void 0, g = void 0, m = void 0, y = void 0, w = void 0, S = void 0, b = void 0, T = void 0, C = void 0, x = void 0, E = void 0, A = void 0, M = void 0, L = void 0, P = void 0, O = i * ui(l), R = i * Rr(l), U = n * ui(u), q = n * Rr(u), $ = v > ve;
        if ($) {
          var Z = t.cornerRadius;
          Z && (r = oS(Z), _ = r[0], p = r[1], g = r[2], m = r[3]);
          var J = Sf(i - n) / 2;
          if (y = Ee(J, g), w = Ee(J, m), S = Ee(J, _), b = Ee(J, p), x = T = mn(y, w), E = C = mn(S, b), (T > ve || C > ve) && (A = i * ui(u), M = i * Rr(u), L = n * ui(l), P = n * Rr(l), v < Md)) {
            var Y = aS(O, R, L, P, A, M, U, q);
            if (Y) {
              var _t = O - Y[0], Tt = R - Y[1], qt = A - Y[0], Se = M - Y[1], ee = 1 / Rr(nS((_t * qt + Tt * Se) / (Pn(_t * _t + Tt * Tt) * Pn(qt * qt + Se * Se))) / 2), Zt = Pn(Y[0] * Y[0] + Y[1] * Y[1]);
              x = Ee(T, (i - Zt) / (ee + 1)), E = Ee(C, (n - Zt) / (ee - 1));
            }
          }
        }
        if (!$)
          e.moveTo(h + O, f + R);
        else if (x > ve) {
          var xt = Ee(g, x), ft = Ee(m, x), H = ma(L, P, O, R, i, xt, c), K = ma(A, M, U, q, i, ft, c);
          e.moveTo(h + H.cx + H.x0, f + H.cy + H.y0), x < T && xt === ft ? e.arc(h + H.cx, f + H.cy, x, At(H.y0, H.x0), At(K.y0, K.x0), !c) : (xt > 0 && e.arc(h + H.cx, f + H.cy, xt, At(H.y0, H.x0), At(H.y1, H.x1), !c), e.arc(h, f, i, At(H.cy + H.y1, H.cx + H.x1), At(K.cy + K.y1, K.cx + K.x1), !c), ft > 0 && e.arc(h + K.cx, f + K.cy, ft, At(K.y1, K.x1), At(K.y0, K.x0), !c));
        } else
          e.moveTo(h + O, f + R), e.arc(h, f, i, l, u, !c);
        if (!(n > ve) || !$)
          e.lineTo(h + U, f + q);
        else if (E > ve) {
          var xt = Ee(_, E), ft = Ee(p, E), H = ma(U, q, A, M, n, -ft, c), K = ma(O, R, L, P, n, -xt, c);
          e.lineTo(h + H.cx + H.x0, f + H.cy + H.y0), E < C && xt === ft ? e.arc(h + H.cx, f + H.cy, E, At(H.y0, H.x0), At(K.y0, K.x0), !c) : (ft > 0 && e.arc(h + H.cx, f + H.cy, ft, At(H.y0, H.x0), At(H.y1, H.x1), !c), e.arc(h, f, n, At(H.cy + H.y1, H.cx + H.x1), At(K.cy + K.y1, K.cx + K.x1), c), xt > 0 && e.arc(h + K.cx, f + K.cy, xt, At(K.y1, K.x1), At(K.y0, K.x0), !c));
        } else
          e.lineTo(h + U, f + q), e.arc(h, f, n, u, l, c);
      }
      e.closePath();
    }
  }
}
var lS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r0 = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0, this.cornerRadius = 0;
  }
  return e;
})(), ea = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new lS();
  }, t.prototype.buildPath = function(r, i) {
    sS(r, i);
  }, t.prototype.isZeroArea = function() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  }, t;
})(ot);
ea.prototype.type = "sector";
var uS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.r0 = 0;
  }
  return e;
})(), xu = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new uS();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.cx, a = i.cy, o = Math.PI * 2;
    r.moveTo(n + i.r, a), r.arc(n, a, i.r, 0, o, !1), r.moveTo(n + i.r0, a), r.arc(n, a, i.r0, 0, o, !0);
  }, t;
})(ot);
xu.prototype.type = "ring";
function hS(e, t, r, i) {
  var n = [], a = [], o = [], s = [], l, u, h, f;
  if (i) {
    h = [1 / 0, 1 / 0], f = [-1 / 0, -1 / 0];
    for (var c = 0, v = e.length; c < v; c++)
      yi(h, h, e[c]), wi(f, f, e[c]);
    yi(h, h, i[0]), wi(f, f, i[1]);
  }
  for (var c = 0, v = e.length; c < v; c++) {
    var d = e[c];
    if (r)
      l = e[c ? c - 1 : v - 1], u = e[(c + 1) % v];
    else if (c === 0 || c === v - 1) {
      n.push(G0(e[c]));
      continue;
    } else
      l = e[c - 1], u = e[c + 1];
    W0(a, u, l), qo(a, a, t);
    var _ = ul(d, l), p = ul(d, u), g = _ + p;
    g !== 0 && (_ /= g, p /= g), qo(o, a, -_), qo(s, a, p);
    var m = hh([], d, o), y = hh([], d, s);
    i && (wi(m, m, h), yi(m, m, f), wi(y, y, h), yi(y, y, f)), n.push(m), n.push(y);
  }
  return r && n.push(n.shift()), n;
}
function Pd(e, t, r) {
  var i = t.smooth, n = t.points;
  if (n && n.length >= 2) {
    if (i) {
      var a = hS(n, i, r, t.smoothConstraint);
      e.moveTo(n[0][0], n[0][1]);
      for (var o = n.length, s = 0; s < (r ? o : o - 1); s++) {
        var l = a[s * 2], u = a[s * 2 + 1], h = n[(s + 1) % o];
        e.bezierCurveTo(l[0], l[1], u[0], u[1], h[0], h[1]);
      }
    } else {
      e.moveTo(n[0][0], n[0][1]);
      for (var s = 1, f = n.length; s < f; s++)
        e.lineTo(n[s][0], n[s][1]);
    }
    r && e.closePath();
  }
}
var fS = /* @__PURE__ */ (function() {
  function e() {
    this.points = null, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
})(), Du = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new fS();
  }, t.prototype.buildPath = function(r, i) {
    Pd(r, i, !0);
  }, t;
})(ot);
Du.prototype.type = "polygon";
var cS = /* @__PURE__ */ (function() {
  function e() {
    this.points = null, this.percent = 1, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
})(), ra = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new cS();
  }, t.prototype.buildPath = function(r, i) {
    Pd(r, i, !1);
  }, t;
})(ot);
ra.prototype.type = "polyline";
var vS = {}, dS = /* @__PURE__ */ (function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.percent = 1;
  }
  return e;
})(), Hi = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new dS();
  }, t.prototype.buildPath = function(r, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = vd(vS, i, this.style);
      n = l.x1, a = l.y1, o = l.x2, s = l.y2;
    } else
      n = i.x1, a = i.y1, o = i.x2, s = i.y2;
    var u = i.percent;
    u !== 0 && (r.moveTo(n, a), u < 1 && (o = n * (1 - u) + o * u, s = a * (1 - u) + s * u), r.lineTo(o, s));
  }, t.prototype.pointAt = function(r) {
    var i = this.shape;
    return [
      i.x1 * (1 - r) + i.x2 * r,
      i.y1 * (1 - r) + i.y2 * r
    ];
  }, t;
})(ot);
Hi.prototype.type = "line";
var Bt = [], pS = /* @__PURE__ */ (function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.cpx1 = 0, this.cpy1 = 0, this.percent = 1;
  }
  return e;
})();
function Tf(e, t, r) {
  var i = e.cpx2, n = e.cpy2;
  return i != null || n != null ? [
    (r ? bh : kt)(e.x1, e.cpx1, e.cpx2, e.x2, t),
    (r ? bh : kt)(e.y1, e.cpy1, e.cpy2, e.y2, t)
  ] : [
    (r ? Sh : zt)(e.x1, e.cpx1, e.x2, t),
    (r ? Sh : zt)(e.y1, e.cpy1, e.y2, t)
  ];
}
var Eu = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new pS();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.x1, a = i.y1, o = i.x2, s = i.y2, l = i.cpx1, u = i.cpy1, h = i.cpx2, f = i.cpy2, c = i.percent;
    c !== 0 && (r.moveTo(n, a), h == null || f == null ? (c < 1 && (eo(n, l, o, c, Bt), l = Bt[1], o = Bt[2], eo(a, u, s, c, Bt), u = Bt[1], s = Bt[2]), r.quadraticCurveTo(l, u, o, s)) : (c < 1 && (to(n, l, h, o, c, Bt), l = Bt[1], h = Bt[2], o = Bt[3], to(a, u, f, s, c, Bt), u = Bt[1], f = Bt[2], s = Bt[3]), r.bezierCurveTo(l, u, h, f, o, s)));
  }, t.prototype.pointAt = function(r) {
    return Tf(this.shape, r, !1);
  }, t.prototype.tangentAt = function(r) {
    var i = Tf(this.shape, r, !0);
    return q0(i, i);
  }, t;
})(ot);
Eu.prototype.type = "bezier-curve";
var gS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0;
  }
  return e;
})(), Vo = (function(e) {
  W(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new gS();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.cx, a = i.cy, o = Math.max(i.r, 0), s = i.startAngle, l = i.endAngle, u = i.clockwise, h = Math.cos(s), f = Math.sin(s);
    r.moveTo(h * o + n, f * o + a), r.arc(n, a, o, s, l, !u);
  }, t;
})(ot);
Vo.prototype.type = "arc";
var _S = (function(e) {
  W(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.type = "compound", r;
  }
  return t.prototype._updatePathDirty = function() {
    for (var r = this.shape.paths, i = this.shapeChanged(), n = 0; n < r.length; n++)
      i = i || r[n].shapeChanged();
    i && this.dirtyShape();
  }, t.prototype.beforeBrush = function() {
    this._updatePathDirty();
    for (var r = this.shape.paths || [], i = this.getGlobalScale(), n = 0; n < r.length; n++)
      r[n].path || r[n].createPathProxy(), r[n].path.setScale(i[0], i[1], r[n].segmentIgnoreThreshold);
  }, t.prototype.buildPath = function(r, i) {
    for (var n = i.paths || [], a = 0; a < n.length; a++)
      n[a].buildPath(r, n[a].shape, !0);
  }, t.prototype.afterBrush = function() {
    for (var r = this.shape.paths || [], i = 0; i < r.length; i++)
      r[i].pathUpdated();
  }, t.prototype.getBoundingRect = function() {
    return this._updatePathDirty.call(this), ot.prototype.getBoundingRect.call(this);
  }, t;
})(ot), Ld = (function() {
  function e(t) {
    this.colorStops = t || [];
  }
  return e.prototype.addColorStop = function(t, r) {
    this.colorStops.push({
      offset: t,
      color: r
    });
  }, e;
})(), mS = (function(e) {
  W(t, e);
  function t(r, i, n, a, o, s) {
    var l = e.call(this, o) || this;
    return l.x = r ?? 0, l.y = i ?? 0, l.x2 = n ?? 1, l.y2 = a ?? 0, l.type = "linear", l.global = s || !1, l;
  }
  return t;
})(Ld), yS = (function(e) {
  W(t, e);
  function t(r, i, n, a, o) {
    var s = e.call(this, a) || this;
    return s.x = r ?? 0.5, s.y = i ?? 0.5, s.r = n ?? 0.5, s.type = "radial", s.global = o || !1, s;
  }
  return t;
})(Ld), Or = [0, 0], kr = [0, 0], ya = new G(), wa = new G(), uo = (function() {
  function e(t, r) {
    this._corners = [], this._axes = [], this._origin = [0, 0];
    for (var i = 0; i < 4; i++)
      this._corners[i] = new G();
    for (var i = 0; i < 2; i++)
      this._axes[i] = new G();
    t && this.fromBoundingRect(t, r);
  }
  return e.prototype.fromBoundingRect = function(t, r) {
    var i = this._corners, n = this._axes, a = t.x, o = t.y, s = a + t.width, l = o + t.height;
    if (i[0].set(a, o), i[1].set(s, o), i[2].set(s, l), i[3].set(a, l), r)
      for (var u = 0; u < 4; u++)
        i[u].transform(r);
    G.sub(n[0], i[1], i[0]), G.sub(n[1], i[3], i[0]), n[0].normalize(), n[1].normalize();
    for (var u = 0; u < 2; u++)
      this._origin[u] = n[u].dot(i[0]);
  }, e.prototype.intersect = function(t, r) {
    var i = !0, n = !r;
    return ya.set(1 / 0, 1 / 0), wa.set(0, 0), !this._intersectCheckOneSide(this, t, ya, wa, n, 1) && (i = !1, n) || !this._intersectCheckOneSide(t, this, ya, wa, n, -1) && (i = !1, n) || n || G.copy(r, i ? ya : wa), i;
  }, e.prototype._intersectCheckOneSide = function(t, r, i, n, a, o) {
    for (var s = !0, l = 0; l < 2; l++) {
      var u = this._axes[l];
      if (this._getProjMinMaxOnAxis(l, t._corners, Or), this._getProjMinMaxOnAxis(l, r._corners, kr), Or[1] < kr[0] || Or[0] > kr[1]) {
        if (s = !1, a)
          return s;
        var h = Math.abs(kr[0] - Or[1]), f = Math.abs(Or[0] - kr[1]);
        Math.min(h, f) > n.len() && (h < f ? G.scale(n, u, -h * o) : G.scale(n, u, f * o));
      } else if (i) {
        var h = Math.abs(kr[0] - Or[1]), f = Math.abs(Or[0] - kr[1]);
        Math.min(h, f) < i.len() && (h < f ? G.scale(i, u, h * o) : G.scale(i, u, -f * o));
      }
    }
    return s;
  }, e.prototype._getProjMinMaxOnAxis = function(t, r, i) {
    for (var n = this._axes[t], a = this._origin, o = r[0].dot(n) + a[t], s = o, l = o, u = 1; u < r.length; u++) {
      var h = r[u].dot(n) + a[t];
      s = Math.min(h, s), l = Math.max(h, l);
    }
    i[0] = s, i[1] = l;
  }, e;
})(), wS = [], bS = (function(e) {
  W(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.notClear = !0, r.incremental = !0, r._displayables = [], r._temporaryDisplayables = [], r._cursor = 0, r;
  }
  return t.prototype.traverse = function(r, i) {
    r.call(i, this);
  }, t.prototype.useStyle = function() {
    this.style = {};
  }, t.prototype.getCursor = function() {
    return this._cursor;
  }, t.prototype.innerAfterBrush = function() {
    this._cursor = this._displayables.length;
  }, t.prototype.clearDisplaybles = function() {
    this._displayables = [], this._temporaryDisplayables = [], this._cursor = 0, this.markRedraw(), this.notClear = !1;
  }, t.prototype.clearTemporalDisplayables = function() {
    this._temporaryDisplayables = [];
  }, t.prototype.addDisplayable = function(r, i) {
    i ? this._temporaryDisplayables.push(r) : this._displayables.push(r), this.markRedraw();
  }, t.prototype.addDisplayables = function(r, i) {
    i = i || !1;
    for (var n = 0; n < r.length; n++)
      this.addDisplayable(r[n], i);
  }, t.prototype.getDisplayables = function() {
    return this._displayables;
  }, t.prototype.getTemporalDisplayables = function() {
    return this._temporaryDisplayables;
  }, t.prototype.eachPendingDisplayable = function(r) {
    for (var i = this._cursor; i < this._displayables.length; i++)
      r && r(this._displayables[i]);
    for (var i = 0; i < this._temporaryDisplayables.length; i++)
      r && r(this._temporaryDisplayables[i]);
  }, t.prototype.update = function() {
    this.updateTransform();
    for (var r = this._cursor; r < this._displayables.length; r++) {
      var i = this._displayables[r];
      i.parent = this, i.update(), i.parent = null;
    }
    for (var r = 0; r < this._temporaryDisplayables.length; r++) {
      var i = this._temporaryDisplayables[r];
      i.parent = this, i.update(), i.parent = null;
    }
  }, t.prototype.getBoundingRect = function() {
    if (!this._rect) {
      for (var r = new at(1 / 0, 1 / 0, -1 / 0, -1 / 0), i = 0; i < this._displayables.length; i++) {
        var n = this._displayables[i], a = n.getBoundingRect().clone();
        n.needLocalTransform() && a.applyTransform(n.getLocalTransform(wS)), r.union(a);
      }
      this._rect = r;
    }
    return this._rect;
  }, t.prototype.contain = function(r, i) {
    var n = this.transformCoordToLocal(r, i), a = this.getBoundingRect();
    if (a.contain(n[0], n[1]))
      for (var o = 0; o < this._displayables.length; o++) {
        var s = this._displayables[o];
        if (s.contain(r, i))
          return !0;
      }
    return !1;
  }, t;
})(ta), SS = St();
function TS(e, t, r, i, n) {
  var a;
  if (t && t.ecModel) {
    var o = t.ecModel.getUpdatePayload();
    a = o && o.animation;
  }
  var s = t && t.isAnimationEnabled(), l = e === "update";
  if (s) {
    var u = void 0, h = void 0, f = void 0;
    i ? (u = X(i.duration, 200), h = X(i.easing, "cubicOut"), f = 0) : (u = t.getShallow(l ? "animationDurationUpdate" : "animationDuration"), h = t.getShallow(l ? "animationEasingUpdate" : "animationEasing"), f = t.getShallow(l ? "animationDelayUpdate" : "animationDelay")), a && (a.duration != null && (u = a.duration), a.easing != null && (h = a.easing), a.delay != null && (f = a.delay)), rt(f) && (f = f(r, n)), rt(u) && (u = u(r));
    var c = {
      duration: u || 0,
      delay: f,
      easing: h
    };
    return c;
  } else
    return null;
}
function Au(e, t, r, i, n, a, o) {
  var s = !1, l;
  rt(n) ? (o = a, a = n, n = null) : B(n) && (a = n.cb, o = n.during, s = n.isFrom, l = n.removeOpt, n = n.dataIndex);
  var u = e === "leave";
  u || t.stopAnimation("leave");
  var h = TS(e, i, n, u ? l || {} : null, i && i.getAnimationDelayParams ? i.getAnimationDelayParams(t, n) : null);
  if (h && h.duration > 0) {
    var f = h.duration, c = h.delay, v = h.easing, d = {
      duration: f,
      delay: c || 0,
      easing: v,
      done: a,
      force: !!a || !!o,
      // Set to final state in update/init animation.
      // So the post processing based on the path shape can be done correctly.
      setToFinal: !u,
      scope: e,
      during: o
    };
    s ? t.animateFrom(r, d) : t.animateTo(r, d);
  } else
    t.stopAnimation(), !s && t.attr(r), o && o(1), a && a();
}
function zn(e, t, r, i, n, a) {
  Au("update", e, t, r, i, n, a);
}
function Ha(e, t, r, i, n, a) {
  Au("enter", e, t, r, i, n, a);
}
function Ln(e) {
  if (!e.__zr)
    return !0;
  for (var t = 0; t < e.animators.length; t++) {
    var r = e.animators[t];
    if (r.scope === "leave")
      return !0;
  }
  return !1;
}
function Id(e, t, r, i, n, a) {
  Ln(e) || Au("leave", e, t, r, i, n, a);
}
function Cf(e, t, r, i) {
  e.removeTextContent(), e.removeTextGuideLine(), Id(e, {
    style: {
      opacity: 0
    }
  }, t, r, i);
}
function Rd(e, t, r) {
  function i() {
    e.parent && e.parent.remove(e);
  }
  e.isGroup ? e.traverse(function(n) {
    n.isGroup || Cf(n, t, r, i);
  }) : Cf(e, t, r, i);
}
function CS(e) {
  SS(e).oldStyle = e.style;
}
var ho = Math.max, fo = Math.min, Ol = {};
function xS(e) {
  return ot.extend(e);
}
var DS = tS;
function ES(e, t) {
  return DS(e, t);
}
function we(e, t) {
  Ol[e] = t;
}
function AS(e) {
  if (Ol.hasOwnProperty(e))
    return Ol[e];
}
function Mu(e, t, r, i) {
  var n = Jb(e, t);
  return r && (i === "center" && (r = kd(r, n.getBoundingRect())), Nd(n, r)), n;
}
function Od(e, t, r) {
  var i = new Jr({
    style: {
      image: e,
      x: t.x,
      y: t.y,
      width: t.width,
      height: t.height
    },
    onload: function(n) {
      if (r === "center") {
        var a = {
          width: n.width,
          height: n.height
        };
        i.setStyle(kd(t, a));
      }
    }
  });
  return i;
}
function kd(e, t) {
  var r = t.width / t.height, i = e.height * r, n;
  i <= e.width ? n = e.height : (i = e.width, n = i / r);
  var a = e.x + e.width / 2, o = e.y + e.height / 2;
  return {
    x: a - i / 2,
    y: o - n / 2,
    width: i,
    height: n
  };
}
var MS = eS;
function Nd(e, t) {
  if (e.applyTransform) {
    var r = e.getBoundingRect(), i = r.calculateTransform(t);
    e.applyTransform(i);
  }
}
function Pu(e, t) {
  return vd(e, e, {
    lineWidth: t
  }), e;
}
function PS(e) {
  return dd(e.shape, e.shape, e.style), e;
}
var LS = Hr;
function IS(e, t) {
  for (var r = hu([]); e && e !== t; )
    xi(r, e.getLocalTransform(), r), e = e.parent;
  return r;
}
function Lu(e, t, r) {
  return t && !Yt(t) && (t = vu.getLocalTransform(t)), r && (t = Av([], t)), Ie([], e, t);
}
function RS(e, t, r) {
  var i = t[4] === 0 || t[5] === 0 || t[0] === 0 ? 1 : Math.abs(2 * t[4] / t[0]), n = t[4] === 0 || t[5] === 0 || t[2] === 0 ? 1 : Math.abs(2 * t[4] / t[2]), a = [e === "left" ? -i : e === "right" ? i : 0, e === "top" ? -n : e === "bottom" ? n : 0];
  return a = Lu(a, t, r), Math.abs(a[0]) > Math.abs(a[1]) ? a[0] > 0 ? "right" : "left" : a[1] > 0 ? "bottom" : "top";
}
function xf(e) {
  return !e.isGroup;
}
function OS(e) {
  return e.shape != null;
}
function kS(e, t, r) {
  if (!e || !t)
    return;
  function i(o) {
    var s = {};
    return o.traverse(function(l) {
      xf(l) && l.anid && (s[l.anid] = l);
    }), s;
  }
  function n(o) {
    var s = {
      x: o.x,
      y: o.y,
      rotation: o.rotation
    };
    return OS(o) && (s.shape = I({}, o.shape)), s;
  }
  var a = i(e);
  t.traverse(function(o) {
    if (xf(o) && o.anid) {
      var s = a[o.anid];
      if (s) {
        var l = n(o);
        o.attr(n(s)), zn(o, l, r, vt(o).dataIndex);
      }
    }
  });
}
function NS(e, t) {
  return Q(e, function(r) {
    var i = r[0];
    i = ho(i, t.x), i = fo(i, t.x + t.width);
    var n = r[1];
    return n = ho(n, t.y), n = fo(n, t.y + t.height), [i, n];
  });
}
function $S(e, t) {
  var r = ho(e.x, t.x), i = fo(e.x + e.width, t.x + t.width), n = ho(e.y, t.y), a = fo(e.y + e.height, t.y + t.height);
  if (i >= r && a >= n)
    return {
      x: r,
      y: n,
      width: i - r,
      height: a - n
    };
}
function $d(e, t, r) {
  var i = I({
    rectHover: !0
  }, t), n = i.style = {
    strokeNoScale: !0
  };
  if (r = r || {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }, e)
    return e.indexOf("image://") === 0 ? (n.image = e.slice(8), ht(n, r), new Jr(i)) : Mu(e.replace("path://", ""), i, r, "center");
}
function BS(e, t, r, i, n) {
  for (var a = 0, o = n[n.length - 1]; a < n.length; a++) {
    var s = n[a];
    if (Bd(e, t, r, i, s[0], s[1], o[0], o[1]))
      return !0;
    o = s;
  }
}
function Bd(e, t, r, i, n, a, o, s) {
  var l = r - e, u = i - t, h = o - n, f = s - a, c = Is(h, f, l, u);
  if (FS(c))
    return !1;
  var v = e - n, d = t - a, _ = Is(v, d, l, u) / c;
  if (_ < 0 || _ > 1)
    return !1;
  var p = Is(v, d, h, f) / c;
  return !(p < 0 || p > 1);
}
function Is(e, t, r, i) {
  return e * i - r * t;
}
function FS(e) {
  return e <= 1e-6 && e >= -1e-6;
}
function Iu(e) {
  var t = e.itemTooltipOption, r = e.componentModel, i = e.itemName, n = z(t) ? {
    formatter: t
  } : t, a = r.mainType, o = r.componentIndex, s = {
    componentType: a,
    name: i,
    $vars: ["name"]
  };
  s[a + "Index"] = o;
  var l = e.formatterParamsExtra;
  l && D(pt(l), function(h) {
    Ri(s, h) || (s[h] = l[h], s.$vars.push(h));
  });
  var u = vt(e.el);
  u.componentMainType = a, u.componentIndex = o, u.tooltipConfig = {
    name: i,
    option: ht({
      content: i,
      encodeHTMLContent: !0,
      formatterParams: s
    }, n)
  };
}
function Df(e, t) {
  var r;
  e.isGroup && (r = t(e)), r || e.traverse(t);
}
function Fd(e, t) {
  if (e)
    if (k(e))
      for (var r = 0; r < e.length; r++)
        Df(e[r], t);
    else
      Df(e, t);
}
we("circle", Fo);
we("ellipse", Cu);
we("sector", ea);
we("ring", xu);
we("polygon", Du);
we("polyline", ra);
we("rect", me);
we("line", Hi);
we("bezierCurve", Eu);
we("arc", Vo);
const VS = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: Vo,
  BezierCurve: Eu,
  BoundingRect: at,
  Circle: Fo,
  CompoundPath: _S,
  Ellipse: Cu,
  Group: Ze,
  Image: Jr,
  IncrementalDisplayable: bS,
  Line: Hi,
  LinearGradient: mS,
  OrientedBoundingRect: uo,
  Path: ot,
  Point: G,
  Polygon: Du,
  Polyline: ra,
  RadialGradient: yS,
  Rect: me,
  Ring: xu,
  Sector: ea,
  Text: ye,
  applyTransform: Lu,
  clipPointsByRect: NS,
  clipRectByRect: $S,
  createIcon: $d,
  extendPath: ES,
  extendShape: xS,
  getShapeClass: AS,
  getTransform: IS,
  groupTransition: kS,
  initProps: Ha,
  isElementRemoved: Ln,
  lineLineIntersect: Bd,
  linePolygonIntersect: BS,
  makeImage: Od,
  makePath: Mu,
  mergePath: MS,
  registerShape: we,
  removeElement: Id,
  removeElementWithFadeOut: Rd,
  resizePath: Nd,
  setTooltipConfig: Iu,
  subPixelOptimize: LS,
  subPixelOptimizeLine: Pu,
  subPixelOptimizeRect: PS,
  transformDirection: RS,
  traverseElements: Fd,
  updateProps: zn
}, Symbol.toStringTag, { value: "Module" }));
var zo = {};
function zS(e, t) {
  for (var r = 0; r < ke.length; r++) {
    var i = ke[r], n = t[i], a = e.ensureState(i);
    a.style = a.style || {}, a.style.text = n;
  }
  var o = e.currentStates.slice();
  e.clearStates(!0), e.setStyle({
    text: t.normal
  }), e.useStates(o, !0);
}
function Ef(e, t, r) {
  var i = e.labelFetcher, n = e.labelDataIndex, a = e.labelDimIndex, o = t.normal, s;
  i && (s = i.getFormattedLabel(n, "normal", null, a, o && o.get("formatter"), r != null ? {
    interpolatedValue: r
  } : null)), s == null && (s = rt(e.defaultText) ? e.defaultText(n, e, r) : e.defaultText);
  for (var l = {
    normal: s
  }, u = 0; u < ke.length; u++) {
    var h = ke[u], f = t[h];
    l[h] = X(i ? i.getFormattedLabel(n, h, null, a, f && f.get("formatter")) : null, s);
  }
  return l;
}
function HS(e, t, r, i) {
  r = r || zo;
  for (var n = e instanceof ye, a = !1, o = 0; o < lo.length; o++) {
    var s = t[lo[o]];
    if (s && s.getShallow("show")) {
      a = !0;
      break;
    }
  }
  var l = n ? e : e.getTextContent();
  if (a) {
    n || (l || (l = new ye(), e.setTextContent(l)), e.stateProxy && (l.stateProxy = e.stateProxy));
    var u = Ef(r, t), h = t.normal, f = !!h.getShallow("show"), c = Hn(h, i, r, !1, !n);
    c.text = u.normal, n || e.setTextConfig(Af(h, r, !1));
    for (var o = 0; o < ke.length; o++) {
      var v = ke[o], s = t[v];
      if (s) {
        var d = l.ensureState(v), _ = !!X(s.getShallow("show"), f);
        if (_ !== f && (d.ignore = !_), d.style = Hn(s, i, r, !0, !n), d.style.text = u[v], !n) {
          var p = e.ensureState(v);
          p.textConfig = Af(s, r, !0);
        }
      }
    }
    l.silent = !!h.getShallow("silent"), l.style.x != null && (c.x = l.style.x), l.style.y != null && (c.y = l.style.y), l.ignore = !f, l.useStyle(c), l.dirty(), r.enableTextSetter && (XS(l).setLabelText = function(g) {
      var m = Ef(r, t, g);
      zS(l, m);
    });
  } else l && (l.ignore = !0);
  e.dirty();
}
function US(e, t) {
  t = t || "label";
  for (var r = {
    normal: e.getModel(t)
  }, i = 0; i < ke.length; i++) {
    var n = ke[i];
    r[n] = e.getModel([n, t]);
  }
  return r;
}
function Hn(e, t, r, i, n) {
  var a = {};
  return GS(a, e, r, i, n), t && I(a, t), a;
}
function Af(e, t, r) {
  t = t || {};
  var i = {}, n, a = e.getShallow("rotate"), o = X(e.getShallow("distance"), r ? null : 5), s = e.getShallow("offset");
  return n = e.getShallow("position") || (r ? null : "inside"), n === "outside" && (n = t.defaultOutsidePosition || "top"), n != null && (i.position = n), s != null && (i.offset = s), a != null && (a *= Math.PI / 180, i.rotation = a), o != null && (i.distance = o), i.outsideFill = e.get("color") === "inherit" ? t.inheritColor || null : "auto", i;
}
function GS(e, t, r, i, n) {
  r = r || zo;
  var a = t.ecModel, o = a && a.option.textStyle, s = WS(t), l;
  if (s) {
    l = {};
    for (var u in s)
      if (s.hasOwnProperty(u)) {
        var h = t.getModel(["rich", u]);
        If(l[u] = {}, h, o, r, i, n, !1, !0);
      }
  }
  l && (e.rich = l);
  var f = t.get("overflow");
  f && (e.overflow = f);
  var c = t.get("minMargin");
  c != null && (e.margin = c), If(e, t, o, r, i, n, !0, !1);
}
function WS(e) {
  for (var t; e && e !== e.ecModel; ) {
    var r = (e.option || zo).rich;
    if (r) {
      t = t || {};
      for (var i = pt(r), n = 0; n < i.length; n++) {
        var a = i[n];
        t[a] = 1;
      }
    }
    e = e.parentModel;
  }
  return t;
}
var Mf = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], Pf = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"], Lf = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function If(e, t, r, i, n, a, o, s) {
  r = !n && r || zo;
  var l = i && i.inheritColor, u = t.getShallow("color"), h = t.getShallow("textBorderColor"), f = X(t.getShallow("opacity"), r.opacity);
  (u === "inherit" || u === "auto") && (process.env.NODE_ENV !== "production" && u === "auto" && bt("color: 'auto'", "color: 'inherit'"), l ? u = l : u = null), (h === "inherit" || h === "auto") && (process.env.NODE_ENV !== "production" && h === "auto" && bt("color: 'auto'", "color: 'inherit'"), l ? h = l : h = null), a || (u = u || r.color, h = h || r.textBorderColor), u != null && (e.fill = u), h != null && (e.stroke = h);
  var c = X(t.getShallow("textBorderWidth"), r.textBorderWidth);
  c != null && (e.lineWidth = c);
  var v = X(t.getShallow("textBorderType"), r.textBorderType);
  v != null && (e.lineDash = v);
  var d = X(t.getShallow("textBorderDashOffset"), r.textBorderDashOffset);
  d != null && (e.lineDashOffset = d), !n && f == null && !s && (f = i && i.defaultOpacity), f != null && (e.opacity = f), !n && !a && e.fill == null && i.inheritColor && (e.fill = i.inheritColor);
  for (var _ = 0; _ < Mf.length; _++) {
    var p = Mf[_], g = X(t.getShallow(p), r[p]);
    g != null && (e[p] = g);
  }
  for (var _ = 0; _ < Pf.length; _++) {
    var p = Pf[_], g = t.getShallow(p);
    g != null && (e[p] = g);
  }
  if (e.verticalAlign == null) {
    var m = t.getShallow("baseline");
    m != null && (e.verticalAlign = m);
  }
  if (!o || !i.disableBox) {
    for (var _ = 0; _ < Lf.length; _++) {
      var p = Lf[_], g = t.getShallow(p);
      g != null && (e[p] = g);
    }
    var y = t.getShallow("borderType");
    y != null && (e.borderDash = y), (e.backgroundColor === "auto" || e.backgroundColor === "inherit") && l && (process.env.NODE_ENV !== "production" && e.backgroundColor === "auto" && bt("backgroundColor: 'auto'", "backgroundColor: 'inherit'"), e.backgroundColor = l), (e.borderColor === "auto" || e.borderColor === "inherit") && l && (process.env.NODE_ENV !== "production" && e.borderColor === "auto" && bt("borderColor: 'auto'", "borderColor: 'inherit'"), e.borderColor = l);
  }
}
function YS(e, t) {
  var r = t && t.getModel("textStyle");
  return Pe([
    // FIXME in node-canvas fontWeight is before fontStyle
    e.fontStyle || r && r.getShallow("fontStyle") || "",
    e.fontWeight || r && r.getShallow("fontWeight") || "",
    (e.fontSize || r && r.getShallow("fontSize") || 12) + "px",
    e.fontFamily || r && r.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var XS = St(), qS = ["textStyle", "color"], Rs = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"], Os = new ye(), ZS = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getTextColor = function(t) {
      var r = this.ecModel;
      return this.getShallow("color") || (!t && r ? r.get(qS) : null);
    }, e.prototype.getFont = function() {
      return YS({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    }, e.prototype.getTextRect = function(t) {
      for (var r = {
        text: t,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      }, i = 0; i < Rs.length; i++)
        r[Rs[i]] = this.getShallow(Rs[i]);
      return Os.useStyle(r), Os.update(), Os.getBoundingRect();
    }, e;
  })()
), Vd = [
  ["lineWidth", "width"],
  ["stroke", "color"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "type"],
  ["lineDashOffset", "dashOffset"],
  ["lineCap", "cap"],
  ["lineJoin", "join"],
  ["miterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], KS = Vn(Vd), jS = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getLineStyle = function(t) {
      return KS(this, t);
    }, e;
  })()
), zd = [
  ["fill", "color"],
  ["stroke", "borderColor"],
  ["lineWidth", "borderWidth"],
  ["opacity"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["shadowColor"],
  ["lineDash", "borderType"],
  ["lineDashOffset", "borderDashOffset"],
  ["lineCap", "borderCap"],
  ["lineJoin", "borderJoin"],
  ["miterLimit", "borderMiterLimit"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], QS = Vn(zd), JS = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getItemStyle = function(t, r) {
      return QS(this, t, r);
    }, e;
  })()
), dt = (
  /** @class */
  (function() {
    function e(t, r, i) {
      this.parentModel = r, this.ecModel = i, this.option = t;
    }
    return e.prototype.init = function(t, r, i) {
    }, e.prototype.mergeOption = function(t, r) {
      mt(this.option, t, !0);
    }, e.prototype.get = function(t, r) {
      return t == null ? this.option : this._doGet(this.parsePath(t), !r && this.parentModel);
    }, e.prototype.getShallow = function(t, r) {
      var i = this.option, n = i == null ? i : i[t];
      if (n == null && !r) {
        var a = this.parentModel;
        a && (n = a.getShallow(t));
      }
      return n;
    }, e.prototype.getModel = function(t, r) {
      var i = t != null, n = i ? this.parsePath(t) : null, a = i ? this._doGet(n) : this.option;
      return r = r || this.parentModel && this.parentModel.getModel(this.resolveParentPath(n)), new e(a, r, this.ecModel);
    }, e.prototype.isEmpty = function() {
      return this.option == null;
    }, e.prototype.restoreData = function() {
    }, e.prototype.clone = function() {
      var t = this.constructor;
      return new t(tt(this.option));
    }, e.prototype.parsePath = function(t) {
      return typeof t == "string" ? t.split(".") : t;
    }, e.prototype.resolveParentPath = function(t) {
      return t;
    }, e.prototype.isAnimationEnabled = function() {
      if (!V.node && this.option) {
        if (this.option.animation != null)
          return !!this.option.animation;
        if (this.parentModel)
          return this.parentModel.isAnimationEnabled();
      }
    }, e.prototype._doGet = function(t, r) {
      var i = this.option;
      if (!t)
        return i;
      for (var n = 0; n < t.length && !(t[n] && (i = i && typeof i == "object" ? i[t[n]] : null, i == null)); n++)
        ;
      return i == null && r && (i = r._doGet(this.resolveParentPath(t), r.parentModel)), i;
    }, e;
  })()
);
_u(dt);
L1(dt);
Ke(dt, jS);
Ke(dt, JS);
Ke(dt, N1);
Ke(dt, ZS);
var tT = Math.round(Math.random() * 10);
function Ho(e) {
  return [e || "", tT++].join("_");
}
function eT(e) {
  var t = {};
  e.registerSubTypeDefaulter = function(r, i) {
    var n = Le(r);
    t[n.main] = i;
  }, e.determineSubType = function(r, i) {
    var n = i.type;
    if (!n) {
      var a = Le(r).main;
      e.hasSubTypes(r) && t[a] && (n = t[a](i));
    }
    return n;
  };
}
function rT(e, t) {
  e.topologicalTravel = function(a, o, s, l) {
    if (!a.length)
      return;
    var u = r(o), h = u.graph, f = u.noEntryList, c = {};
    for (D(a, function(m) {
      c[m] = !0;
    }); f.length; ) {
      var v = f.pop(), d = h[v], _ = !!c[v];
      _ && (s.call(l, v, d.originalDeps.slice()), delete c[v]), D(d.successor, _ ? g : p);
    }
    D(c, function() {
      var m = "";
      throw process.env.NODE_ENV !== "production" && (m = oo("Circular dependency may exists: ", c, a, o)), new Error(m);
    });
    function p(m) {
      h[m].entryCount--, h[m].entryCount === 0 && f.push(m);
    }
    function g(m) {
      c[m] = !0, p(m);
    }
  };
  function r(a) {
    var o = {}, s = [];
    return D(a, function(l) {
      var u = i(o, l), h = u.originalDeps = t(l), f = n(h, a);
      u.entryCount = f.length, u.entryCount === 0 && s.push(l), D(f, function(c) {
        st(u.predecessor, c) < 0 && u.predecessor.push(c);
        var v = i(o, c);
        st(v.successor, c) < 0 && v.successor.push(l);
      });
    }), {
      graph: o,
      noEntryList: s
    };
  }
  function i(a, o) {
    return a[o] || (a[o] = {
      predecessor: [],
      successor: []
    }), a[o];
  }
  function n(a, o) {
    var s = [];
    return D(a, function(l) {
      st(o, l) >= 0 && s.push(l);
    }), s;
  }
}
const iT = {
  time: {
    month: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthAbbr: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayOfWeekAbbr: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  },
  legend: {
    selector: {
      all: "All",
      inverse: "Inv"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "Box Select",
        polygon: "Lasso Select",
        lineX: "Horizontally Select",
        lineY: "Vertically Select",
        keep: "Keep Selections",
        clear: "Clear Selections"
      }
    },
    dataView: {
      title: "Data View",
      lang: ["Data View", "Close", "Refresh"]
    },
    dataZoom: {
      title: {
        zoom: "Zoom",
        back: "Zoom Reset"
      }
    },
    magicType: {
      title: {
        line: "Switch to Line Chart",
        bar: "Switch to Bar Chart",
        stack: "Stack",
        tiled: "Tile"
      }
    },
    restore: {
      title: "Restore"
    },
    saveAsImage: {
      title: "Save as Image",
      lang: ["Right Click to Save Image"]
    }
  },
  series: {
    typeNames: {
      pie: "Pie chart",
      bar: "Bar chart",
      line: "Line chart",
      scatter: "Scatter plot",
      effectScatter: "Ripple scatter plot",
      radar: "Radar chart",
      tree: "Tree",
      treemap: "Treemap",
      boxplot: "Boxplot",
      candlestick: "Candlestick",
      k: "K line chart",
      heatmap: "Heat map",
      map: "Map",
      parallel: "Parallel coordinate map",
      lines: "Line graph",
      graph: "Relationship graph",
      sankey: "Sankey diagram",
      funnel: "Funnel chart",
      gauge: "Gauge",
      pictorialBar: "Pictorial bar",
      themeRiver: "Theme River Map",
      sunburst: "Sunburst",
      custom: "Custom chart",
      chart: "Chart"
    }
  },
  aria: {
    general: {
      withTitle: 'This is a chart about "{title}"',
      withoutTitle: "This is a chart"
    },
    series: {
      single: {
        prefix: "",
        withName: " with type {seriesType} named {seriesName}.",
        withoutName: " with type {seriesType}."
      },
      multiple: {
        prefix: ". It consists of {seriesCount} series count.",
        withName: " The {seriesId} series is a {seriesType} representing {seriesName}.",
        withoutName: " The {seriesId} series is a {seriesType}.",
        separator: {
          middle: "",
          end: ""
        }
      }
    },
    data: {
      allData: "The data is as follows: ",
      partialData: "The first {displayCnt} items are: ",
      withName: "the data for {name} is {value}",
      withoutName: "{value}",
      separator: {
        middle: ", ",
        end: ". "
      }
    }
  }
}, nT = {
  time: {
    month: ["一月", "二月", "三月", "四月", "五月", "六月", "七月", "八月", "九月", "十月", "十一月", "十二月"],
    monthAbbr: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
    dayOfWeek: ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"],
    dayOfWeekAbbr: ["日", "一", "二", "三", "四", "五", "六"]
  },
  legend: {
    selector: {
      all: "全选",
      inverse: "反选"
    }
  },
  toolbox: {
    brush: {
      title: {
        rect: "矩形选择",
        polygon: "圈选",
        lineX: "横向选择",
        lineY: "纵向选择",
        keep: "保持选择",
        clear: "清除选择"
      }
    },
    dataView: {
      title: "数据视图",
      lang: ["数据视图", "关闭", "刷新"]
    },
    dataZoom: {
      title: {
        zoom: "区域缩放",
        back: "区域缩放还原"
      }
    },
    magicType: {
      title: {
        line: "切换为折线图",
        bar: "切换为柱状图",
        stack: "切换为堆叠",
        tiled: "切换为平铺"
      }
    },
    restore: {
      title: "还原"
    },
    saveAsImage: {
      title: "保存为图片",
      lang: ["右键另存为图片"]
    }
  },
  series: {
    typeNames: {
      pie: "饼图",
      bar: "柱状图",
      line: "折线图",
      scatter: "散点图",
      effectScatter: "涟漪散点图",
      radar: "雷达图",
      tree: "树图",
      treemap: "矩形树图",
      boxplot: "箱型图",
      candlestick: "K线图",
      k: "K线图",
      heatmap: "热力图",
      map: "地图",
      parallel: "平行坐标图",
      lines: "线图",
      graph: "关系图",
      sankey: "桑基图",
      funnel: "漏斗图",
      gauge: "仪表盘图",
      pictorialBar: "象形柱图",
      themeRiver: "主题河流图",
      sunburst: "旭日图",
      custom: "自定义图表",
      chart: "图表"
    }
  },
  aria: {
    general: {
      withTitle: "这是一个关于“{title}”的图表。",
      withoutTitle: "这是一个图表，"
    },
    series: {
      single: {
        prefix: "",
        withName: "图表类型是{seriesType}，表示{seriesName}。",
        withoutName: "图表类型是{seriesType}。"
      },
      multiple: {
        prefix: "它由{seriesCount}个图表系列组成。",
        withName: "第{seriesId}个系列是一个表示{seriesName}的{seriesType}，",
        withoutName: "第{seriesId}个系列是一个{seriesType}，",
        separator: {
          middle: "；",
          end: "。"
        }
      }
    },
    data: {
      allData: "其数据是——",
      partialData: "其中，前{displayCnt}项是——",
      withName: "{name}的数据是{value}",
      withoutName: "{value}",
      separator: {
        middle: "，",
        end: ""
      }
    }
  }
};
var co = "ZH", Ru = "EN", Ai = Ru, Ua = {}, Ou = {}, Hd = V.domSupported ? (function() {
  var e = (
    /* eslint-disable-next-line */
    (document.documentElement.lang || navigator.language || navigator.browserLanguage || Ai).toUpperCase()
  );
  return e.indexOf(co) > -1 ? co : Ai;
})() : Ai;
function Ud(e, t) {
  e = e.toUpperCase(), Ou[e] = new dt(t), Ua[e] = t;
}
function aT(e) {
  if (z(e)) {
    var t = Ua[e.toUpperCase()] || {};
    return e === co || e === Ru ? tt(t) : mt(tt(t), tt(Ua[Ai]), !1);
  } else
    return mt(tt(e), tt(Ua[Ai]), !1);
}
function oT(e) {
  return Ou[e];
}
function sT() {
  return Ou[Ai];
}
Ud(Ru, iT);
Ud(co, nT);
function er(e, t) {
  return e += "", "0000".substr(0, t - e.length) + e;
}
function Gd(e, t, r, i) {
  var n = Ro(e), a = n[lT(r)](), o = n[uT(r)]() + 1, s = Math.floor((o - 1) / 3) + 1, l = n[hT(r)](), u = n["get" + (r ? "UTC" : "") + "Day"](), h = n[fT(r)](), f = (h - 1) % 12 + 1, c = n[cT(r)](), v = n[vT(r)](), d = n[dT(r)](), _ = h >= 12 ? "pm" : "am", p = _.toUpperCase(), g = i instanceof dt ? i : oT(Hd) || sT(), m = g.getModel("time"), y = m.get("month"), w = m.get("monthAbbr"), S = m.get("dayOfWeek"), b = m.get("dayOfWeekAbbr");
  return (t || "").replace(/{a}/g, _ + "").replace(/{A}/g, p + "").replace(/{yyyy}/g, a + "").replace(/{yy}/g, er(a % 100 + "", 2)).replace(/{Q}/g, s + "").replace(/{MMMM}/g, y[o - 1]).replace(/{MMM}/g, w[o - 1]).replace(/{MM}/g, er(o, 2)).replace(/{M}/g, o + "").replace(/{dd}/g, er(l, 2)).replace(/{d}/g, l + "").replace(/{eeee}/g, S[u]).replace(/{ee}/g, b[u]).replace(/{e}/g, u + "").replace(/{HH}/g, er(h, 2)).replace(/{H}/g, h + "").replace(/{hh}/g, er(f + "", 2)).replace(/{h}/g, f + "").replace(/{mm}/g, er(c, 2)).replace(/{m}/g, c + "").replace(/{ss}/g, er(v, 2)).replace(/{s}/g, v + "").replace(/{SSS}/g, er(d, 3)).replace(/{S}/g, d + "");
}
function lT(e) {
  return e ? "getUTCFullYear" : "getFullYear";
}
function uT(e) {
  return e ? "getUTCMonth" : "getMonth";
}
function hT(e) {
  return e ? "getUTCDate" : "getDate";
}
function fT(e) {
  return e ? "getUTCHours" : "getHours";
}
function cT(e) {
  return e ? "getUTCMinutes" : "getMinutes";
}
function vT(e) {
  return e ? "getUTCSeconds" : "getSeconds";
}
function dT(e) {
  return e ? "getUTCMilliseconds" : "getMilliseconds";
}
function pT(e) {
  if (!jv(e))
    return z(e) ? e : "-";
  var t = (e + "").split(".");
  return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");
}
function Wd(e, t) {
  return e = (e || "").toLowerCase().replace(/-(.)/g, function(r, i) {
    return i.toUpperCase();
  }), t && e && (e = e.charAt(0).toUpperCase() + e.slice(1)), e;
}
var ku = Sv;
function kl(e, t, r) {
  var i = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function n(h) {
    return h && Pe(h) ? h : "-";
  }
  function a(h) {
    return !!(h != null && !isNaN(h) && isFinite(h));
  }
  var o = t === "time", s = e instanceof Date;
  if (o || s) {
    var l = o ? Ro(e) : e;
    if (isNaN(+l)) {
      if (s)
        return "-";
    } else return Gd(l, i, r);
  }
  if (t === "ordinal")
    return ja(e) ? n(e) : yt(e) && a(e) ? e + "" : "-";
  var u = ao(e);
  return a(u) ? pT(u) : ja(e) ? n(e) : typeof e == "boolean" ? e + "" : "-";
}
var Rf = ["a", "b", "c", "d", "e", "f", "g"], ks = function(e, t) {
  return "{" + e + (t ?? "") + "}";
};
function Yd(e, t, r) {
  k(t) || (t = [t]);
  var i = t.length;
  if (!i)
    return "";
  for (var n = t[0].$vars || [], a = 0; a < n.length; a++) {
    var o = Rf[a];
    e = e.replace(ks(o), ks(o, 0));
  }
  for (var s = 0; s < i; s++)
    for (var l = 0; l < n.length; l++) {
      var u = t[s][n[l]];
      e = e.replace(ks(Rf[l], s), r ? Vt(u) : u);
    }
  return e;
}
function gT(e, t) {
  var r = z(e) ? {
    color: e,
    extraCssText: t
  } : e || {}, i = r.color, n = r.type;
  t = r.extraCssText;
  var a = r.renderMode || "html";
  if (!i)
    return "";
  if (a === "html")
    return n === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + Vt(i) + ";" + (t || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + Vt(i) + ";" + (t || "") + '"></span>';
  var o = r.markerId || "markerX";
  return {
    renderMode: a,
    content: "{" + o + "|}  ",
    style: n === "subItem" ? {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: i
    } : {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: i
    }
  };
}
function Un(e, t) {
  return t = t || "transparent", z(e) ? e : B(e) && e.colorStops && (e.colorStops[0] || {}).color || t;
}
var Ga = D, _T = ["left", "right", "top", "bottom", "width", "height"], ba = [["width", "left", "right"], ["height", "top", "bottom"]];
function Xd(e, t, r, i, n) {
  var a = 0, o = 0;
  i == null && (i = 1 / 0), n == null && (n = 1 / 0);
  var s = 0;
  t.eachChild(function(l, u) {
    var h = l.getBoundingRect(), f = t.childAt(u + 1), c = f && f.getBoundingRect(), v, d;
    if (e === "horizontal") {
      var _ = h.width + (c ? -c.x + h.x : 0);
      v = a + _, v > i || l.newline ? (a = 0, v = _, o += s + r, s = h.height) : s = Math.max(s, h.height);
    } else {
      var p = h.height + (c ? -c.y + h.y : 0);
      d = o + p, d > n || l.newline ? (a += s + r, o = 0, d = p, s = h.width) : s = Math.max(s, h.width);
    }
    l.newline || (l.x = a, l.y = o, l.markRedraw(), e === "horizontal" ? a = v + r : o = d + r);
  });
}
Jt(Xd, "vertical");
Jt(Xd, "horizontal");
function qd(e, t, r) {
  r = ku(r || 0);
  var i = t.width, n = t.height, a = wt(e.left, i), o = wt(e.top, n), s = wt(e.right, i), l = wt(e.bottom, n), u = wt(e.width, i), h = wt(e.height, n), f = r[2] + r[0], c = r[1] + r[3], v = e.aspect;
  switch (isNaN(u) && (u = i - s - c - a), isNaN(h) && (h = n - l - f - o), v != null && (isNaN(u) && isNaN(h) && (v > i / n ? u = i * 0.8 : h = n * 0.8), isNaN(u) && (u = v * h), isNaN(h) && (h = u / v)), isNaN(a) && (a = i - s - u - c), isNaN(o) && (o = n - l - h - f), e.left || e.right) {
    case "center":
      a = i / 2 - u / 2 - r[3];
      break;
    case "right":
      a = i - u - c;
      break;
  }
  switch (e.top || e.bottom) {
    case "middle":
    case "center":
      o = n / 2 - h / 2 - r[0];
      break;
    case "bottom":
      o = n - h - f;
      break;
  }
  a = a || 0, o = o || 0, isNaN(u) && (u = i - c - a - (s || 0)), isNaN(h) && (h = n - f - o - (l || 0));
  var d = new at(a + r[3], o + r[0], u, h);
  return d.margin = r, d;
}
function vo(e) {
  var t = e.layoutMode || e.constructor.layoutMode;
  return B(t) ? t : t ? {
    type: t
  } : null;
}
function po(e, t, r) {
  var i = r && r.ignoreSize;
  !k(i) && (i = [i, i]);
  var n = o(ba[0], 0), a = o(ba[1], 1);
  u(ba[0], e, n), u(ba[1], e, a);
  function o(h, f) {
    var c = {}, v = 0, d = {}, _ = 0, p = 2;
    if (Ga(h, function(y) {
      d[y] = e[y];
    }), Ga(h, function(y) {
      s(t, y) && (c[y] = d[y] = t[y]), l(c, y) && v++, l(d, y) && _++;
    }), i[f])
      return l(t, h[1]) ? d[h[2]] = null : l(t, h[2]) && (d[h[1]] = null), d;
    if (_ === p || !v)
      return d;
    if (v >= p)
      return c;
    for (var g = 0; g < h.length; g++) {
      var m = h[g];
      if (!s(c, m) && s(e, m)) {
        c[m] = e[m];
        break;
      }
    }
    return c;
  }
  function s(h, f) {
    return h.hasOwnProperty(f);
  }
  function l(h, f) {
    return h[f] != null && h[f] !== "auto";
  }
  function u(h, f, c) {
    Ga(h, function(v) {
      f[v] = c[v];
    });
  }
}
function Zd(e) {
  return mT({}, e);
}
function mT(e, t) {
  return t && e && Ga(_T, function(r) {
    t.hasOwnProperty(r) && (e[r] = t[r]);
  }), e;
}
var yT = St(), nt = (
  /** @class */
  (function(e) {
    W(t, e);
    function t(r, i, n) {
      var a = e.call(this, r, i, n) || this;
      return a.uid = Ho("ec_cpt_model"), a;
    }
    return t.prototype.init = function(r, i, n) {
      this.mergeDefaultAndTheme(r, n);
    }, t.prototype.mergeDefaultAndTheme = function(r, i) {
      var n = vo(this), a = n ? Zd(r) : {}, o = i.getTheme();
      mt(r, o.get(this.mainType)), mt(r, this.getDefaultOption()), n && po(r, a, n);
    }, t.prototype.mergeOption = function(r, i) {
      mt(this.option, r, !0);
      var n = vo(this);
      n && po(this.option, r, n);
    }, t.prototype.optionUpdated = function(r, i) {
    }, t.prototype.getDefaultOption = function() {
      var r = this.constructor;
      if (!A1(r))
        return r.defaultOption;
      var i = yT(this);
      if (!i.defaultOption) {
        for (var n = [], a = r; a; ) {
          var o = a.prototype.defaultOption;
          o && n.push(o), a = a.superClass;
        }
        for (var s = {}, l = n.length - 1; l >= 0; l--)
          s = mt(s, n[l], !0);
        i.defaultOption = s;
      }
      return i.defaultOption;
    }, t.prototype.getReferringComponents = function(r, i) {
      var n = r + "Index", a = r + "Id";
      return Jn(this.ecModel, r, {
        index: this.get(n, !0),
        id: this.get(a, !0)
      }, i);
    }, t.prototype.getBoxLayoutParams = function() {
      var r = this;
      return {
        left: r.get("left"),
        top: r.get("top"),
        right: r.get("right"),
        bottom: r.get("bottom"),
        width: r.get("width"),
        height: r.get("height")
      };
    }, t.prototype.getZLevelKey = function() {
      return "";
    }, t.prototype.setZLevel = function(r) {
      this.option.zlevel = r;
    }, t.protoInitialize = (function() {
      var r = t.prototype;
      r.type = "component", r.id = "", r.name = "", r.mainType = "", r.subType = "", r.componentIndex = 0;
    })(), t;
  })(dt)
);
ad(nt, dt);
mu(nt);
eT(nt);
rT(nt, wT);
function wT(e) {
  var t = [];
  return D(nt.getClassesByMainType(e), function(r) {
    t = t.concat(r.dependencies || r.prototype.dependencies || []);
  }), t = Q(t, function(r) {
    return Le(r).main;
  }), e !== "dataset" && st(t, "dataset") <= 0 && t.unshift("dataset"), t;
}
var Kd = "";
typeof navigator < "u" && (Kd = navigator.platform || "");
var hi = "rgba(0, 0, 0, 0.2)";
const bT = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
  gradientColor: ["#f6efa6", "#d88273", "#bf444c"],
  aria: {
    decal: {
      decals: [{
        color: hi,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: hi,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: hi,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: hi,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: hi,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: hi,
        symbol: "triangle",
        dashArrayX: [[9, 9], [0, 9, 9, 0]],
        dashArrayY: [7, 2],
        symbolSize: 0.75
      }]
    }
  },
  // If xAxis and yAxis declared, grid is created by default.
  // grid: {},
  textStyle: {
    // color: '#000',
    // decoration: 'none',
    // PENDING
    fontFamily: Kd.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
    // fontFamily: 'Arial, Verdana, sans-serif',
    fontSize: 12,
    fontStyle: "normal",
    fontWeight: "normal"
  },
  // http://blogs.adobe.com/webplatform/2014/02/24/using-blend-modes-in-html-canvas/
  // https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
  // Default is source-over
  blendMode: null,
  stateAnimation: {
    duration: 300,
    easing: "cubicOut"
  },
  animation: "auto",
  animationDuration: 1e3,
  animationDurationUpdate: 500,
  animationEasing: "cubicInOut",
  animationEasingUpdate: "cubicInOut",
  animationThreshold: 2e3,
  // Configuration for progressive/incremental rendering
  progressiveThreshold: 3e3,
  progressive: 400,
  // Threshold of if use single hover layer to optimize.
  // It is recommended that `hoverLayerThreshold` is equivalent to or less than
  // `progressiveThreshold`, otherwise hover will cause restart of progressive,
  // which is unexpected.
  // see example <echarts/test/heatmap-large.html>.
  hoverLayerThreshold: 3e3,
  // See: module:echarts/scale/Time
  useUTC: !1
};
var Nl = et(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]), Be = "original", Xt = "arrayRows", be = "objectRows", Fe = "keyedColumns", Ye = "typedArray", jd = "unknown", Xe = "column", Ui = "row", Dt = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
}, ST = St();
function TT(e) {
  ST(e).datasetMap = et();
}
function CT(e, t, r) {
  var i = {}, n = Qd(e);
  if (!n)
    return i;
  var a = t.sourceFormat, o = t.dimensionsDefine, s;
  (a === be || a === Fe) && D(o, function(h, f) {
    (B(h) ? h.name : h) === "name" && (s = f);
  });
  var l = (function() {
    for (var h = {}, f = {}, c = [], v = 0, d = Math.min(5, r); v < d; v++) {
      var _ = tp(t.data, a, t.seriesLayoutBy, o, t.startIndex, v);
      c.push(_);
      var p = _ === Dt.Not;
      if (p && h.v == null && v !== s && (h.v = v), (h.n == null || h.n === h.v || !p && c[h.n] === Dt.Not) && (h.n = v), g(h) && c[h.n] !== Dt.Not)
        return h;
      p || (_ === Dt.Might && f.v == null && v !== s && (f.v = v), (f.n == null || f.n === f.v) && (f.n = v));
    }
    function g(m) {
      return m.v != null && m.n != null;
    }
    return g(h) ? h : g(f) ? f : null;
  })();
  if (l) {
    i.value = [l.v];
    var u = s ?? l.n;
    i.itemName = [u], i.seriesName = [u];
  }
  return i;
}
function Qd(e) {
  var t = e.get("data", !0);
  if (!t)
    return Jn(e.ecModel, "dataset", {
      index: e.get("datasetIndex", !0),
      id: e.get("datasetId", !0)
    }, gu).models[0];
}
function xT(e) {
  return !e.get("transform", !0) && !e.get("fromTransformResult", !0) ? [] : Jn(e.ecModel, "dataset", {
    index: e.get("fromDatasetIndex", !0),
    id: e.get("fromDatasetId", !0)
  }, gu).models;
}
function Jd(e, t) {
  return tp(e.data, e.sourceFormat, e.seriesLayoutBy, e.dimensionsDefine, e.startIndex, t);
}
function tp(e, t, r, i, n, a) {
  var o, s = 5;
  if ($t(e))
    return Dt.Not;
  var l, u;
  if (i) {
    var h = i[a];
    B(h) ? (l = h.name, u = h.type) : z(h) && (l = h);
  }
  if (u != null)
    return u === "ordinal" ? Dt.Must : Dt.Not;
  if (t === Xt) {
    var f = e;
    if (r === Ui) {
      for (var c = f[a], v = 0; v < (c || []).length && v < s; v++)
        if ((o = w(c[n + v])) != null)
          return o;
    } else
      for (var v = 0; v < f.length && v < s; v++) {
        var d = f[n + v];
        if (d && (o = w(d[a])) != null)
          return o;
      }
  } else if (t === be) {
    var _ = e;
    if (!l)
      return Dt.Not;
    for (var v = 0; v < _.length && v < s; v++) {
      var p = _[v];
      if (p && (o = w(p[l])) != null)
        return o;
    }
  } else if (t === Fe) {
    var g = e;
    if (!l)
      return Dt.Not;
    var c = g[l];
    if (!c || $t(c))
      return Dt.Not;
    for (var v = 0; v < c.length && v < s; v++)
      if ((o = w(c[v])) != null)
        return o;
  } else if (t === Be)
    for (var m = e, v = 0; v < m.length && v < s; v++) {
      var p = m[v], y = ko(p);
      if (!k(y))
        return Dt.Not;
      if ((o = w(y[a])) != null)
        return o;
    }
  function w(S) {
    var b = z(S);
    if (S != null && Number.isFinite(Number(S)) && S !== "")
      return b ? Dt.Might : Dt.Not;
    if (b && S !== "-")
      return Dt.Must;
  }
  return Dt.Not;
}
var DT = et();
function ET(e, t, r) {
  var i = DT.get(t);
  if (!i)
    return r;
  var n = i(e);
  if (!n)
    return r;
  if (process.env.NODE_ENV !== "production")
    for (var a = 0; a < n.length; a++)
      j(ki(n[a]));
  return r.concat(n);
}
var Of = St();
St();
var Nu = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getColorFromPalette = function(t, r, i) {
      var n = Nt(this.get("color", !0)), a = this.get("colorLayer", !0);
      return MT(this, Of, n, a, t, r, i);
    }, e.prototype.clearColorPalette = function() {
      PT(this, Of);
    }, e;
  })()
);
function AT(e, t) {
  for (var r = e.length, i = 0; i < r; i++)
    if (e[i].length > t)
      return e[i];
  return e[r - 1];
}
function MT(e, t, r, i, n, a, o) {
  a = a || e;
  var s = t(a), l = s.paletteIdx || 0, u = s.paletteNameMap = s.paletteNameMap || {};
  if (u.hasOwnProperty(n))
    return u[n];
  var h = o == null || !i ? r : AT(i, o);
  if (h = h || r, !(!h || !h.length)) {
    var f = h[l];
    return n && (u[n] = f), s.paletteIdx = (l + 1) % h.length, f;
  }
}
function PT(e, t) {
  t(e).paletteIdx = 0, t(e).paletteNameMap = {};
}
var Sa, rn, kf, Ns = "\0_ec_inner", Nf = 1, LT = {
  grid: "GridComponent",
  polar: "PolarComponent",
  geo: "GeoComponent",
  singleAxis: "SingleAxisComponent",
  parallel: "ParallelComponent",
  calendar: "CalendarComponent",
  graphic: "GraphicComponent",
  toolbox: "ToolboxComponent",
  tooltip: "TooltipComponent",
  axisPointer: "AxisPointerComponent",
  brush: "BrushComponent",
  title: "TitleComponent",
  timeline: "TimelineComponent",
  markPoint: "MarkPointComponent",
  markLine: "MarkLineComponent",
  markArea: "MarkAreaComponent",
  legend: "LegendComponent",
  dataZoom: "DataZoomComponent",
  visualMap: "VisualMapComponent",
  // aria: 'AriaComponent',
  // dataset: 'DatasetComponent',
  // Dependencies
  xAxis: "GridComponent",
  yAxis: "GridComponent",
  angleAxis: "PolarComponent",
  radiusAxis: "PolarComponent"
}, IT = {
  line: "LineChart",
  bar: "BarChart",
  pie: "PieChart",
  scatter: "ScatterChart",
  radar: "RadarChart",
  map: "MapChart",
  tree: "TreeChart",
  treemap: "TreemapChart",
  graph: "GraphChart",
  gauge: "GaugeChart",
  funnel: "FunnelChart",
  parallel: "ParallelChart",
  sankey: "SankeyChart",
  boxplot: "BoxplotChart",
  candlestick: "CandlestickChart",
  effectScatter: "EffectScatterChart",
  lines: "LinesChart",
  heatmap: "HeatmapChart",
  pictorialBar: "PictorialBarChart",
  themeRiver: "ThemeRiverChart",
  sunburst: "SunburstChart",
  custom: "CustomChart"
}, go = {};
function RT(e) {
  D(e, function(t, r) {
    if (!nt.hasClass(r)) {
      var i = LT[r];
      i && !go[i] && (It("Component " + r + ` is used but not imported.
import { ` + i + ` } from 'echarts/components';
echarts.use([` + i + "]);"), go[i] = !0);
    }
  });
}
var $u = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.init = function(r, i, n, a, o, s) {
      a = a || {}, this.option = null, this._theme = new dt(a), this._locale = new dt(o), this._optionManager = s;
    }, t.prototype.setOption = function(r, i, n) {
      process.env.NODE_ENV !== "production" && (j(r != null, "option is null/undefined"), j(r[Ns] !== Nf, "please use chart.getOption()"));
      var a = Ff(i);
      this._optionManager.setOption(r, n, a), this._resetOption(null, a);
    }, t.prototype.resetOption = function(r, i) {
      return this._resetOption(r, Ff(i));
    }, t.prototype._resetOption = function(r, i) {
      var n = !1, a = this._optionManager;
      if (!r || r === "recreate") {
        var o = a.mountOption(r === "recreate");
        process.env.NODE_ENV !== "production" && RT(o), !this.option || r === "recreate" ? kf(this, o) : (this.restoreData(), this._mergeOption(o, i)), n = !0;
      }
      if ((r === "timeline" || r === "media") && this.restoreData(), !r || r === "recreate" || r === "timeline") {
        var s = a.getTimelineOption(this);
        s && (n = !0, this._mergeOption(s, i));
      }
      if (!r || r === "recreate" || r === "media") {
        var l = a.getMediaOption(this);
        l.length && D(l, function(u) {
          n = !0, this._mergeOption(u, i);
        }, this);
      }
      return n;
    }, t.prototype.mergeOption = function(r) {
      this._mergeOption(r, null);
    }, t.prototype._mergeOption = function(r, i) {
      var n = this.option, a = this._componentsMap, o = this._componentsCount, s = [], l = et(), u = i && i.replaceMergeMainTypeMap;
      TT(this), D(r, function(f, c) {
        f != null && (nt.hasClass(c) ? c && (s.push(c), l.set(c, !0)) : n[c] = n[c] == null ? tt(f) : mt(n[c], f, !0));
      }), u && u.each(function(f, c) {
        nt.hasClass(c) && !l.get(c) && (s.push(c), l.set(c, !0));
      }), nt.topologicalTravel(s, nt.getAllClassMainTypes(), h, this);
      function h(f) {
        var c = ET(this, f, Nt(r[f])), v = a.get(f), d = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          v ? u && u.get(f) ? "replaceMerge" : "normalMerge" : "replaceAll"
        ), _ = d1(v, c, d);
        b1(_, f, nt), n[f] = null, a.set(f, null), o.set(f, 0);
        var p = [], g = [], m = 0, y, w;
        D(_, function(S, b) {
          var T = S.existing, C = S.newOption;
          if (!C)
            T && (T.mergeOption({}, this), T.optionUpdated({}, !1));
          else {
            var x = f === "series", E = nt.getClass(
              f,
              S.keyInfo.subType,
              !x
              // Give a more detailed warn later if series don't exists
            );
            if (!E) {
              if (process.env.NODE_ENV !== "production") {
                var A = S.keyInfo.subType, M = IT[A];
                go[A] || (go[A] = !0, It(M ? "Series " + A + ` is used but not imported.
import { ` + M + ` } from 'echarts/charts';
echarts.use([` + M + "]);" : "Unknown series " + A));
              }
              return;
            }
            if (f === "tooltip") {
              if (y) {
                process.env.NODE_ENV !== "production" && (w || (_e("Currently only one tooltip component is allowed."), w = !0));
                return;
              }
              y = !0;
            }
            if (T && T.constructor === E)
              T.name = S.keyInfo.name, T.mergeOption(C, this), T.optionUpdated(C, !1);
            else {
              var L = I({
                componentIndex: b
              }, S.keyInfo);
              T = new E(C, this, this, L), I(T, L), S.brandNew && (T.__requireNewView = !0), T.init(C, this, this), T.optionUpdated(null, !0);
            }
          }
          T ? (p.push(T.option), g.push(T), m++) : (p.push(void 0), g.push(void 0));
        }, this), n[f] = p, a.set(f, g), o.set(f, m), f === "series" && Sa(this);
      }
      this._seriesIndices || Sa(this);
    }, t.prototype.getOption = function() {
      var r = tt(this.option);
      return D(r, function(i, n) {
        if (nt.hasClass(n)) {
          for (var a = Nt(i), o = a.length, s = !1, l = o - 1; l >= 0; l--)
            a[l] && !ki(a[l]) ? s = !0 : (a[l] = null, !s && o--);
          a.length = o, r[n] = a;
        }
      }), delete r[Ns], r;
    }, t.prototype.getTheme = function() {
      return this._theme;
    }, t.prototype.getLocaleModel = function() {
      return this._locale;
    }, t.prototype.setUpdatePayload = function(r) {
      this._payload = r;
    }, t.prototype.getUpdatePayload = function() {
      return this._payload;
    }, t.prototype.getComponent = function(r, i) {
      var n = this._componentsMap.get(r);
      if (n) {
        var a = n[i || 0];
        if (a)
          return a;
        if (i == null) {
          for (var o = 0; o < n.length; o++)
            if (n[o])
              return n[o];
        }
      }
    }, t.prototype.queryComponents = function(r) {
      var i = r.mainType;
      if (!i)
        return [];
      var n = r.index, a = r.id, o = r.name, s = this._componentsMap.get(i);
      if (!s || !s.length)
        return [];
      var l;
      return n != null ? (l = [], D(Nt(n), function(u) {
        s[u] && l.push(s[u]);
      })) : a != null ? l = $f("id", a, s) : o != null ? l = $f("name", o, s) : l = ge(s, function(u) {
        return !!u;
      }), Bf(l, r);
    }, t.prototype.findComponents = function(r) {
      var i = r.query, n = r.mainType, a = s(i), o = a ? this.queryComponents(a) : ge(this._componentsMap.get(n), function(u) {
        return !!u;
      });
      return l(Bf(o, r));
      function s(u) {
        var h = n + "Index", f = n + "Id", c = n + "Name";
        return u && (u[h] != null || u[f] != null || u[c] != null) ? {
          mainType: n,
          // subType will be filtered finally.
          index: u[h],
          id: u[f],
          name: u[c]
        } : null;
      }
      function l(u) {
        return r.filter ? ge(u, r.filter) : u;
      }
    }, t.prototype.eachComponent = function(r, i, n) {
      var a = this._componentsMap;
      if (rt(r)) {
        var o = i, s = r;
        a.each(function(f, c) {
          for (var v = 0; f && v < f.length; v++) {
            var d = f[v];
            d && s.call(o, c, d, d.componentIndex);
          }
        });
      } else
        for (var l = z(r) ? a.get(r) : B(r) ? this.findComponents(r) : null, u = 0; l && u < l.length; u++) {
          var h = l[u];
          h && i.call(n, h, h.componentIndex);
        }
    }, t.prototype.getSeriesByName = function(r) {
      var i = Re(r, null);
      return ge(this._componentsMap.get("series"), function(n) {
        return !!n && i != null && n.name === i;
      });
    }, t.prototype.getSeriesByIndex = function(r) {
      return this._componentsMap.get("series")[r];
    }, t.prototype.getSeriesByType = function(r) {
      return ge(this._componentsMap.get("series"), function(i) {
        return !!i && i.subType === r;
      });
    }, t.prototype.getSeries = function() {
      return ge(this._componentsMap.get("series"), function(r) {
        return !!r;
      });
    }, t.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    }, t.prototype.eachSeries = function(r, i) {
      rn(this), D(this._seriesIndices, function(n) {
        var a = this._componentsMap.get("series")[n];
        r.call(i, a, n);
      }, this);
    }, t.prototype.eachRawSeries = function(r, i) {
      D(this._componentsMap.get("series"), function(n) {
        n && r.call(i, n, n.componentIndex);
      });
    }, t.prototype.eachSeriesByType = function(r, i, n) {
      rn(this), D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        o.subType === r && i.call(n, o, a);
      }, this);
    }, t.prototype.eachRawSeriesByType = function(r, i, n) {
      return D(this.getSeriesByType(r), i, n);
    }, t.prototype.isSeriesFiltered = function(r) {
      return rn(this), this._seriesIndicesMap.get(r.componentIndex) == null;
    }, t.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    }, t.prototype.filterSeries = function(r, i) {
      rn(this);
      var n = [];
      D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        r.call(i, o, a) && n.push(a);
      }, this), this._seriesIndices = n, this._seriesIndicesMap = et(n);
    }, t.prototype.restoreData = function(r) {
      Sa(this);
      var i = this._componentsMap, n = [];
      i.each(function(a, o) {
        nt.hasClass(o) && n.push(o);
      }), nt.topologicalTravel(n, nt.getAllClassMainTypes(), function(a) {
        D(i.get(a), function(o) {
          o && (a !== "series" || !OT(o, r)) && o.restoreData();
        });
      });
    }, t.internalField = (function() {
      Sa = function(r) {
        var i = r._seriesIndices = [];
        D(r._componentsMap.get("series"), function(n) {
          n && i.push(n.componentIndex);
        }), r._seriesIndicesMap = et(i);
      }, rn = function(r) {
        if (process.env.NODE_ENV !== "production" && !r._seriesIndices)
          throw new Error("Option should contains series.");
      }, kf = function(r, i) {
        r.option = {}, r.option[Ns] = Nf, r._componentsMap = et({
          series: []
        }), r._componentsCount = et();
        var n = i.aria;
        B(n) && n.enabled == null && (n.enabled = !0), kT(i, r._theme.option), mt(i, bT, !1), r._mergeOption(i, null);
      };
    })(), t;
  })(dt)
);
function OT(e, t) {
  if (t) {
    var r = t.seriesIndex, i = t.seriesId, n = t.seriesName;
    return r != null && e.componentIndex !== r || i != null && e.id !== i || n != null && e.name !== n;
  }
}
function kT(e, t) {
  var r = e.color && !e.colorLayer;
  D(t, function(i, n) {
    n === "colorLayer" && r || nt.hasClass(n) || (typeof i == "object" ? e[n] = e[n] ? mt(e[n], i, !1) : tt(i) : e[n] == null && (e[n] = i));
  });
}
function $f(e, t, r) {
  if (k(t)) {
    var i = et();
    return D(t, function(a) {
      if (a != null) {
        var o = Re(a, null);
        o != null && i.set(a, !0);
      }
    }), ge(r, function(a) {
      return a && i.get(a[e]);
    });
  } else {
    var n = Re(t, null);
    return ge(r, function(a) {
      return a && n != null && a[e] === n;
    });
  }
}
function Bf(e, t) {
  return t.hasOwnProperty("subType") ? ge(e, function(r) {
    return r && r.subType === t.subType;
  }) : e;
}
function Ff(e) {
  var t = et();
  return e && D(Nt(e.replaceMerge), function(r) {
    process.env.NODE_ENV !== "production" && j(nt.hasClass(r), '"' + r + '" is not valid component main type in "replaceMerge"'), t.set(r, !0);
  }), {
    replaceMergeMainTypeMap: t
  };
}
Ke($u, Nu);
var NT = [
  "getDom",
  "getZr",
  "getWidth",
  "getHeight",
  "getDevicePixelRatio",
  "dispatchAction",
  "isSSR",
  "isDisposed",
  "on",
  "off",
  "getDataURL",
  "getConnectedDataURL",
  // 'getModel',
  "getOption",
  // 'getViewOfComponentModel',
  // 'getViewOfSeriesModel',
  "getId",
  "updateLabelLayout"
], ep = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      D(NT, function(r) {
        this[r] = lt(t[r], t);
      }, this);
    }
    return e;
  })()
), $s = {}, rp = (
  /** @class */
  (function() {
    function e() {
      this._coordinateSystems = [];
    }
    return e.prototype.create = function(t, r) {
      var i = [];
      D($s, function(n, a) {
        var o = n.create(t, r);
        i = i.concat(o || []);
      }), this._coordinateSystems = i;
    }, e.prototype.update = function(t, r) {
      D(this._coordinateSystems, function(i) {
        i.update && i.update(t, r);
      });
    }, e.prototype.getCoordinateSystems = function() {
      return this._coordinateSystems.slice();
    }, e.register = function(t, r) {
      $s[t] = r;
    }, e.get = function(t) {
      return $s[t];
    }, e;
  })()
), $T = /^(min|max)?(.+)$/, BT = (
  /** @class */
  (function() {
    function e(t) {
      this._timelineOptions = [], this._mediaList = [], this._currentMediaIndices = [], this._api = t;
    }
    return e.prototype.setOption = function(t, r, i) {
      t && (D(Nt(t.series), function(o) {
        o && o.data && $t(o.data) && ll(o.data);
      }), D(Nt(t.dataset), function(o) {
        o && o.source && $t(o.source) && ll(o.source);
      })), t = tt(t);
      var n = this._optionBackup, a = FT(t, r, !n);
      this._newBaseOption = a.baseOption, n ? (a.timelineOptions.length && (n.timelineOptions = a.timelineOptions), a.mediaList.length && (n.mediaList = a.mediaList), a.mediaDefault && (n.mediaDefault = a.mediaDefault)) : this._optionBackup = a;
    }, e.prototype.mountOption = function(t) {
      var r = this._optionBackup;
      return this._timelineOptions = r.timelineOptions, this._mediaList = r.mediaList, this._mediaDefault = r.mediaDefault, this._currentMediaIndices = [], tt(t ? r.baseOption : this._newBaseOption);
    }, e.prototype.getTimelineOption = function(t) {
      var r, i = this._timelineOptions;
      if (i.length) {
        var n = t.getComponent("timeline");
        n && (r = tt(
          // FIXME:TS as TimelineModel or quivlant interface
          i[n.getCurrentIndex()]
        ));
      }
      return r;
    }, e.prototype.getMediaOption = function(t) {
      var r = this._api.getWidth(), i = this._api.getHeight(), n = this._mediaList, a = this._mediaDefault, o = [], s = [];
      if (!n.length && !a)
        return s;
      for (var l = 0, u = n.length; l < u; l++)
        VT(n[l].query, r, i) && o.push(l);
      return !o.length && a && (o = [-1]), o.length && !HT(o, this._currentMediaIndices) && (s = Q(o, function(h) {
        return tt(h === -1 ? a.option : n[h].option);
      })), this._currentMediaIndices = o, s;
    }, e;
  })()
);
function FT(e, t, r) {
  var i = [], n, a, o = e.baseOption, s = e.timeline, l = e.options, u = e.media, h = !!e.media, f = !!(l || s || o && o.timeline);
  o ? (a = o, a.timeline || (a.timeline = s)) : ((f || h) && (e.options = e.media = null), a = e), h && (k(u) ? D(u, function(v) {
    process.env.NODE_ENV !== "production" && v && !v.option && B(v.query) && B(v.query.option) && It("Illegal media option. Must be like { media: [ { query: {}, option: {} } ] }"), v && v.option && (v.query ? i.push(v) : n || (n = v));
  }) : process.env.NODE_ENV !== "production" && It("Illegal media option. Must be an array. Like { media: [ {...}, {...} ] }")), c(a), D(l, function(v) {
    return c(v);
  }), D(i, function(v) {
    return c(v.option);
  });
  function c(v) {
    D(t, function(d) {
      d(v, r);
    });
  }
  return {
    baseOption: a,
    timelineOptions: l || [],
    mediaDefault: n,
    mediaList: i
  };
}
function VT(e, t, r) {
  var i = {
    width: t,
    height: r,
    aspectratio: t / r
    // lower case for convenience.
  }, n = !0;
  return D(e, function(a, o) {
    var s = o.match($T);
    if (!(!s || !s[1] || !s[2])) {
      var l = s[1], u = s[2].toLowerCase();
      zT(i[u], a, l) || (n = !1);
    }
  }), n;
}
function zT(e, t, r) {
  return r === "min" ? e >= t : r === "max" ? e <= t : e === t;
}
function HT(e, t) {
  return e.join(",") === t.join(",");
}
var re = D, Gn = B, Vf = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function Bs(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0, i = Vf.length; r < i; r++) {
      var n = Vf[r], a = t.normal, o = t.emphasis;
      a && a[n] && (process.env.NODE_ENV !== "production" && bt("itemStyle.normal." + n, n), e[n] = e[n] || {}, e[n].normal ? mt(e[n].normal, a[n]) : e[n].normal = a[n], a[n] = null), o && o[n] && (process.env.NODE_ENV !== "production" && bt("itemStyle.emphasis." + n, "emphasis." + n), e[n] = e[n] || {}, e[n].emphasis ? mt(e[n].emphasis, o[n]) : e[n].emphasis = o[n], o[n] = null);
    }
}
function Lt(e, t, r) {
  if (e && e[t] && (e[t].normal || e[t].emphasis)) {
    var i = e[t].normal, n = e[t].emphasis;
    i && (process.env.NODE_ENV !== "production" && Oe("'normal' hierarchy in " + t + " has been removed since 4.0. All style properties are configured in " + t + " directly now."), r ? (e[t].normal = e[t].emphasis = null, ht(e[t], i)) : e[t] = i), n && (process.env.NODE_ENV !== "production" && Oe(t + ".emphasis has been changed to emphasis." + t + " since 4.0"), e.emphasis = e.emphasis || {}, e.emphasis[t] = n, n.focus && (e.emphasis.focus = n.focus), n.blurScope && (e.emphasis.blurScope = n.blurScope));
  }
}
function yn(e) {
  Lt(e, "itemStyle"), Lt(e, "lineStyle"), Lt(e, "areaStyle"), Lt(e, "label"), Lt(e, "labelLine"), Lt(e, "upperLabel"), Lt(e, "edgeLabel");
}
function ct(e, t) {
  var r = Gn(e) && e[t], i = Gn(r) && r.textStyle;
  if (i) {
    process.env.NODE_ENV !== "production" && Oe("textStyle hierarchy in " + t + " has been removed since 4.0. All textStyle properties are configured in " + t + " directly now.");
    for (var n = 0, a = Gh.length; n < a; n++) {
      var o = Gh[n];
      i.hasOwnProperty(o) && (r[o] = i[o]);
    }
  }
}
function se(e) {
  e && (yn(e), ct(e, "label"), e.emphasis && ct(e.emphasis, "label"));
}
function UT(e) {
  if (Gn(e)) {
    Bs(e), yn(e), ct(e, "label"), ct(e, "upperLabel"), ct(e, "edgeLabel"), e.emphasis && (ct(e.emphasis, "label"), ct(e.emphasis, "upperLabel"), ct(e.emphasis, "edgeLabel"));
    var t = e.markPoint;
    t && (Bs(t), se(t));
    var r = e.markLine;
    r && (Bs(r), se(r));
    var i = e.markArea;
    i && se(i);
    var n = e.data;
    if (e.type === "graph") {
      n = n || e.nodes;
      var a = e.links || e.edges;
      if (a && !$t(a))
        for (var o = 0; o < a.length; o++)
          se(a[o]);
      D(e.categories, function(u) {
        yn(u);
      });
    }
    if (n && !$t(n))
      for (var o = 0; o < n.length; o++)
        se(n[o]);
    if (t = e.markPoint, t && t.data)
      for (var s = t.data, o = 0; o < s.length; o++)
        se(s[o]);
    if (r = e.markLine, r && r.data)
      for (var l = r.data, o = 0; o < l.length; o++)
        k(l[o]) ? (se(l[o][0]), se(l[o][1])) : se(l[o]);
    e.type === "gauge" ? (ct(e, "axisLabel"), ct(e, "title"), ct(e, "detail")) : e.type === "treemap" ? (Lt(e.breadcrumb, "itemStyle"), D(e.levels, function(u) {
      yn(u);
    })) : e.type === "tree" && yn(e.leaves);
  }
}
function He(e) {
  return k(e) ? e : e ? [e] : [];
}
function zf(e) {
  return (k(e) ? e[0] : e) || {};
}
function GT(e, t) {
  re(He(e.series), function(i) {
    Gn(i) && UT(i);
  });
  var r = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  t && r.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"), re(r, function(i) {
    re(He(e[i]), function(n) {
      n && (ct(n, "axisLabel"), ct(n.axisPointer, "label"));
    });
  }), re(He(e.parallel), function(i) {
    var n = i && i.parallelAxisDefault;
    ct(n, "axisLabel"), ct(n && n.axisPointer, "label");
  }), re(He(e.calendar), function(i) {
    Lt(i, "itemStyle"), ct(i, "dayLabel"), ct(i, "monthLabel"), ct(i, "yearLabel");
  }), re(He(e.radar), function(i) {
    ct(i, "name"), i.name && i.axisName == null && (i.axisName = i.name, delete i.name, process.env.NODE_ENV !== "production" && Oe("name property in radar component has been changed to axisName")), i.nameGap != null && i.axisNameGap == null && (i.axisNameGap = i.nameGap, delete i.nameGap, process.env.NODE_ENV !== "production" && Oe("nameGap property in radar component has been changed to axisNameGap")), process.env.NODE_ENV !== "production" && re(i.indicator, function(n) {
      n.text && bt("text", "name", "radar.indicator");
    });
  }), re(He(e.geo), function(i) {
    Gn(i) && (se(i), re(He(i.regions), function(n) {
      se(n);
    }));
  }), re(He(e.timeline), function(i) {
    se(i), Lt(i, "label"), Lt(i, "itemStyle"), Lt(i, "controlStyle", !0);
    var n = i.data;
    k(n) && D(n, function(a) {
      B(a) && (Lt(a, "label"), Lt(a, "itemStyle"));
    });
  }), re(He(e.toolbox), function(i) {
    Lt(i, "iconStyle"), re(i.feature, function(n) {
      Lt(n, "iconStyle");
    });
  }), ct(zf(e.axisPointer), "label"), ct(zf(e.tooltip).axisPointer, "label");
}
function WT(e, t) {
  for (var r = t.split(","), i = e, n = 0; n < r.length && (i = i && i[r[n]], i != null); n++)
    ;
  return i;
}
function YT(e, t, r, i) {
  for (var n = t.split(","), a = e, o, s = 0; s < n.length - 1; s++)
    o = n[s], a[o] == null && (a[o] = {}), a = a[o];
  a[n[s]] == null && (a[n[s]] = r);
}
function Hf(e) {
  e && D(XT, function(t) {
    t[0] in e && !(t[1] in e) && (e[t[1]] = e[t[0]]);
  });
}
var XT = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]], qT = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"], Fs = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function nn(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0; r < Fs.length; r++) {
      var i = Fs[r][1], n = Fs[r][0];
      t[i] != null && (t[n] = t[i], process.env.NODE_ENV !== "production" && bt(i, n));
    }
}
function Uf(e) {
  e && e.alignTo === "edge" && e.margin != null && e.edgeDistance == null && (process.env.NODE_ENV !== "production" && bt("label.margin", "label.edgeDistance", "pie"), e.edgeDistance = e.margin);
}
function Gf(e) {
  e && e.downplay && !e.blur && (e.blur = e.downplay, process.env.NODE_ENV !== "production" && bt("downplay", "blur", "sunburst"));
}
function ZT(e) {
  e && e.focusNodeAdjacency != null && (e.emphasis = e.emphasis || {}, e.emphasis.focus == null && (process.env.NODE_ENV !== "production" && bt("focusNodeAdjacency", "emphasis: { focus: 'adjacency'}", "graph/sankey"), e.emphasis.focus = "adjacency"));
}
function ip(e, t) {
  if (e)
    for (var r = 0; r < e.length; r++)
      t(e[r]), e[r] && ip(e[r].children, t);
}
function np(e, t) {
  GT(e, t), e.series = Nt(e.series), D(e.series, function(r) {
    if (B(r)) {
      var i = r.type;
      if (i === "line")
        r.clipOverflow != null && (r.clip = r.clipOverflow, process.env.NODE_ENV !== "production" && bt("clipOverflow", "clip", "line"));
      else if (i === "pie" || i === "gauge") {
        r.clockWise != null && (r.clockwise = r.clockWise, process.env.NODE_ENV !== "production" && bt("clockWise", "clockwise")), Uf(r.label);
        var n = r.data;
        if (n && !$t(n))
          for (var a = 0; a < n.length; a++)
            Uf(n[a]);
        r.hoverOffset != null && (r.emphasis = r.emphasis || {}, (r.emphasis.scaleSize = null) && (process.env.NODE_ENV !== "production" && bt("hoverOffset", "emphasis.scaleSize"), r.emphasis.scaleSize = r.hoverOffset));
      } else if (i === "gauge") {
        var o = WT(r, "pointer.color");
        o != null && YT(r, "itemStyle.color", o);
      } else if (i === "bar") {
        nn(r), nn(r.backgroundStyle), nn(r.emphasis);
        var n = r.data;
        if (n && !$t(n))
          for (var a = 0; a < n.length; a++)
            typeof n[a] == "object" && (nn(n[a]), nn(n[a] && n[a].emphasis));
      } else if (i === "sunburst") {
        var s = r.highlightPolicy;
        s && (r.emphasis = r.emphasis || {}, r.emphasis.focus || (r.emphasis.focus = s, process.env.NODE_ENV !== "production" && bt("highlightPolicy", "emphasis.focus", "sunburst"))), Gf(r), ip(r.data, Gf);
      } else i === "graph" || i === "sankey" ? ZT(r) : i === "map" && (r.mapType && !r.map && (process.env.NODE_ENV !== "production" && bt("mapType", "map", "map"), r.map = r.mapType), r.mapLocation && (process.env.NODE_ENV !== "production" && Oe("`mapLocation` is not used anymore."), ht(r, r.mapLocation)));
      r.hoverAnimation != null && (r.emphasis = r.emphasis || {}, r.emphasis && r.emphasis.scale == null && (process.env.NODE_ENV !== "production" && bt("hoverAnimation", "emphasis.scale"), r.emphasis.scale = r.hoverAnimation)), Hf(r);
    }
  }), e.dataRange && (e.visualMap = e.dataRange), D(qT, function(r) {
    var i = e[r];
    i && (k(i) || (i = [i]), D(i, function(n) {
      Hf(n);
    }));
  });
}
function KT(e) {
  var t = et();
  e.eachSeries(function(r) {
    var i = r.get("stack");
    if (i) {
      var n = t.get(i) || t.set(i, []), a = r.getData(), o = {
        // Used for calculate axis extent automatically.
        // TODO: Type getCalculationInfo return more specific type?
        stackResultDimension: a.getCalculationInfo("stackResultDimension"),
        stackedOverDimension: a.getCalculationInfo("stackedOverDimension"),
        stackedDimension: a.getCalculationInfo("stackedDimension"),
        stackedByDimension: a.getCalculationInfo("stackedByDimension"),
        isStackedByIndex: a.getCalculationInfo("isStackedByIndex"),
        data: a,
        seriesModel: r
      };
      if (!o.stackedDimension || !(o.isStackedByIndex || o.stackedByDimension))
        return;
      n.length && a.setCalculationInfo("stackedOnSeries", n[n.length - 1].seriesModel), n.push(o);
    }
  }), t.each(jT);
}
function jT(e) {
  D(e, function(t, r) {
    var i = [], n = [NaN, NaN], a = [t.stackResultDimension, t.stackedOverDimension], o = t.data, s = t.isStackedByIndex, l = t.seriesModel.get("stackStrategy") || "samesign";
    o.modify(a, function(u, h, f) {
      var c = o.get(t.stackedDimension, f);
      if (isNaN(c))
        return n;
      var v, d;
      s ? d = o.getRawIndex(f) : v = o.get(t.stackedByDimension, f);
      for (var _ = NaN, p = r - 1; p >= 0; p--) {
        var g = e[p];
        if (s || (d = g.data.rawIndexOf(g.stackedByDimension, v)), d >= 0) {
          var m = g.data.getByRawIndex(g.stackResultDimension, d);
          if (l === "all" || l === "positive" && m > 0 || l === "negative" && m < 0 || l === "samesign" && c >= 0 && m > 0 || l === "samesign" && c <= 0 && m < 0) {
            c = s1(c, m), _ = m;
            break;
          }
        }
      }
      return i[0] = c, i[1] = _, i;
    });
  });
}
var Uo = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      this.data = t.data || (t.sourceFormat === Fe ? {} : []), this.sourceFormat = t.sourceFormat || jd, this.seriesLayoutBy = t.seriesLayoutBy || Xe, this.startIndex = t.startIndex || 0, this.dimensionsDetectedCount = t.dimensionsDetectedCount, this.metaRawOption = t.metaRawOption;
      var r = this.dimensionsDefine = t.dimensionsDefine;
      if (r)
        for (var i = 0; i < r.length; i++) {
          var n = r[i];
          n.type == null && Jd(this, i) === Dt.Must && (n.type = "ordinal");
        }
    }
    return e;
  })()
);
function Bu(e) {
  return e instanceof Uo;
}
function $l(e, t, r) {
  r = r || op(e);
  var i = t.seriesLayoutBy, n = JT(e, r, i, t.sourceHeader, t.dimensions), a = new Uo({
    data: e,
    sourceFormat: r,
    seriesLayoutBy: i,
    dimensionsDefine: n.dimensionsDefine,
    startIndex: n.startIndex,
    dimensionsDetectedCount: n.dimensionsDetectedCount,
    metaRawOption: tt(t)
  });
  return a;
}
function ap(e) {
  return new Uo({
    data: e,
    sourceFormat: $t(e) ? Ye : Be
  });
}
function QT(e) {
  return new Uo({
    data: e.data,
    sourceFormat: e.sourceFormat,
    seriesLayoutBy: e.seriesLayoutBy,
    dimensionsDefine: tt(e.dimensionsDefine),
    startIndex: e.startIndex,
    dimensionsDetectedCount: e.dimensionsDetectedCount
  });
}
function op(e) {
  var t = jd;
  if ($t(e))
    t = Ye;
  else if (k(e)) {
    e.length === 0 && (t = Xt);
    for (var r = 0, i = e.length; r < i; r++) {
      var n = e[r];
      if (n != null) {
        if (k(n) || $t(n)) {
          t = Xt;
          break;
        } else if (B(n)) {
          t = be;
          break;
        }
      }
    }
  } else if (B(e)) {
    for (var a in e)
      if (Ri(e, a) && Yt(e[a])) {
        t = Fe;
        break;
      }
  }
  return t;
}
function JT(e, t, r, i, n) {
  var a, o;
  if (!e)
    return {
      dimensionsDefine: Wf(n),
      startIndex: o,
      dimensionsDetectedCount: a
    };
  if (t === Xt) {
    var s = e;
    i === "auto" || i == null ? Yf(function(u) {
      u != null && u !== "-" && (z(u) ? o == null && (o = 1) : o = 0);
    }, r, s, 10) : o = yt(i) ? i : i ? 1 : 0, !n && o === 1 && (n = [], Yf(function(u, h) {
      n[h] = u != null ? u + "" : "";
    }, r, s, 1 / 0)), a = n ? n.length : r === Ui ? s.length : s[0] ? s[0].length : null;
  } else if (t === be)
    n || (n = tC(e));
  else if (t === Fe)
    n || (n = [], D(e, function(u, h) {
      n.push(h);
    }));
  else if (t === Be) {
    var l = ko(e[0]);
    a = k(l) && l.length || 1;
  } else t === Ye && process.env.NODE_ENV !== "production" && j(!!n, "dimensions must be given if data is TypedArray.");
  return {
    startIndex: o,
    dimensionsDefine: Wf(n),
    dimensionsDetectedCount: a
  };
}
function tC(e) {
  for (var t = 0, r; t < e.length && !(r = e[t++]); )
    ;
  if (r)
    return pt(r);
}
function Wf(e) {
  if (e) {
    var t = et();
    return Q(e, function(r, i) {
      r = B(r) ? r : {
        name: r
      };
      var n = {
        name: r.name,
        displayName: r.displayName,
        type: r.type
      };
      if (n.name == null)
        return n;
      n.name += "", n.displayName == null && (n.displayName = n.name);
      var a = t.get(n.name);
      return a ? n.name += "-" + a.count++ : t.set(n.name, {
        count: 1
      }), n;
    });
  }
}
function Yf(e, t, r, i) {
  if (t === Ui)
    for (var n = 0; n < r.length && n < i; n++)
      e(r[n] ? r[n][0] : null, n);
  else
    for (var a = r[0] || [], n = 0; n < a.length && n < i; n++)
      e(a[n], n);
}
function sp(e) {
  var t = e.sourceFormat;
  return t === be || t === Fe;
}
var Nr, $r, Br, Xf, qf, lp = (
  /** @class */
  (function() {
    function e(t, r) {
      var i = Bu(t) ? t : ap(t);
      this._source = i;
      var n = this._data = i.data;
      if (i.sourceFormat === Ye) {
        if (process.env.NODE_ENV !== "production" && r == null)
          throw new Error("Typed array data must specify dimension size");
        this._offset = 0, this._dimSize = r, this._data = n;
      }
      qf(this, n, i);
    }
    return e.prototype.getSource = function() {
      return this._source;
    }, e.prototype.count = function() {
      return 0;
    }, e.prototype.getItem = function(t, r) {
    }, e.prototype.appendData = function(t) {
    }, e.prototype.clean = function() {
    }, e.protoInitialize = (function() {
      var t = e.prototype;
      t.pure = !1, t.persistent = !0;
    })(), e.internalField = (function() {
      var t;
      qf = function(o, s, l) {
        var u = l.sourceFormat, h = l.seriesLayoutBy, f = l.startIndex, c = l.dimensionsDefine, v = Xf[Fu(u, h)];
        if (process.env.NODE_ENV !== "production" && j(v, "Invalide sourceFormat: " + u), I(o, v), u === Ye)
          o.getItem = r, o.count = n, o.fillStorage = i;
        else {
          var d = up(u, h);
          o.getItem = lt(d, null, s, f, c);
          var _ = hp(u, h);
          o.count = lt(_, null, s, f, c);
        }
      };
      var r = function(o, s) {
        o = o - this._offset, s = s || [];
        for (var l = this._data, u = this._dimSize, h = u * o, f = 0; f < u; f++)
          s[f] = l[h + f];
        return s;
      }, i = function(o, s, l, u) {
        for (var h = this._data, f = this._dimSize, c = 0; c < f; c++) {
          for (var v = u[c], d = v[0] == null ? 1 / 0 : v[0], _ = v[1] == null ? -1 / 0 : v[1], p = s - o, g = l[c], m = 0; m < p; m++) {
            var y = h[m * f + c];
            g[o + m] = y, y < d && (d = y), y > _ && (_ = y);
          }
          v[0] = d, v[1] = _;
        }
      }, n = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      Xf = (t = {}, t[Xt + "_" + Xe] = {
        pure: !0,
        appendData: a
      }, t[Xt + "_" + Ui] = {
        pure: !0,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, t[be] = {
        pure: !0,
        appendData: a
      }, t[Fe] = {
        pure: !0,
        appendData: function(o) {
          var s = this._data;
          D(o, function(l, u) {
            for (var h = s[u] || (s[u] = []), f = 0; f < (l || []).length; f++)
              h.push(l[f]);
          });
        }
      }, t[Be] = {
        appendData: a
      }, t[Ye] = {
        persistent: !1,
        pure: !0,
        appendData: function(o) {
          process.env.NODE_ENV !== "production" && j($t(o), "Added data must be TypedArray if data in initialization is TypedArray"), this._data = o;
        },
        // Clean self if data is already used.
        clean: function() {
          this._offset += this.count(), this._data = null;
        }
      }, t);
      function a(o) {
        for (var s = 0; s < o.length; s++)
          this._data.push(o[s]);
      }
    })(), e;
  })()
), Zf = function(e, t, r, i) {
  return e[i];
}, eC = (Nr = {}, Nr[Xt + "_" + Xe] = function(e, t, r, i) {
  return e[i + t];
}, Nr[Xt + "_" + Ui] = function(e, t, r, i, n) {
  i += t;
  for (var a = n || [], o = e, s = 0; s < o.length; s++) {
    var l = o[s];
    a[s] = l ? l[i] : null;
  }
  return a;
}, Nr[be] = Zf, Nr[Fe] = function(e, t, r, i, n) {
  for (var a = n || [], o = 0; o < r.length; o++) {
    var s = r[o].name;
    if (process.env.NODE_ENV !== "production" && s == null)
      throw new Error();
    var l = e[s];
    a[o] = l ? l[i] : null;
  }
  return a;
}, Nr[Be] = Zf, Nr);
function up(e, t) {
  var r = eC[Fu(e, t)];
  return process.env.NODE_ENV !== "production" && j(r, 'Do not support get item on "' + e + '", "' + t + '".'), r;
}
var Kf = function(e, t, r) {
  return e.length;
}, rC = ($r = {}, $r[Xt + "_" + Xe] = function(e, t, r) {
  return Math.max(0, e.length - t);
}, $r[Xt + "_" + Ui] = function(e, t, r) {
  var i = e[0];
  return i ? Math.max(0, i.length - t) : 0;
}, $r[be] = Kf, $r[Fe] = function(e, t, r) {
  var i = r[0].name;
  if (process.env.NODE_ENV !== "production" && i == null)
    throw new Error();
  var n = e[i];
  return n ? n.length : 0;
}, $r[Be] = Kf, $r);
function hp(e, t) {
  var r = rC[Fu(e, t)];
  return process.env.NODE_ENV !== "production" && j(r, 'Do not support count on "' + e + '", "' + t + '".'), r;
}
var Vs = function(e, t, r) {
  return e[t];
}, iC = (Br = {}, Br[Xt] = Vs, Br[be] = function(e, t, r) {
  return e[r];
}, Br[Fe] = Vs, Br[Be] = function(e, t, r) {
  var i = ko(e);
  return i instanceof Array ? i[t] : i;
}, Br[Ye] = Vs, Br);
function fp(e) {
  var t = iC[e];
  return process.env.NODE_ENV !== "production" && j(t, 'Do not support get value on "' + e + '".'), t;
}
function Fu(e, t) {
  return e === Xt ? e + "_" + t : e;
}
function _o(e, t, r) {
  if (e) {
    var i = e.getRawDataItem(t);
    if (i != null) {
      var n = e.getStore(), a = n.getSource().sourceFormat;
      if (r != null) {
        var o = e.getDimensionIndex(r), s = n.getDimensionProperty(o);
        return fp(a)(i, o, s);
      } else {
        var l = i;
        return a === Be && (l = ko(i)), l;
      }
    }
  }
}
var nC = /\{@(.+?)\}/g, aC = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getDataParams = function(t, r) {
      var i = this.getData(r), n = this.getRawValue(t, r), a = i.getRawIndex(t), o = i.getName(t), s = i.getRawDataItem(t), l = i.getItemVisual(t, "style"), u = l && l[i.getItemVisual(t, "drawType") || "fill"], h = l && l.stroke, f = this.mainType, c = f === "series", v = i.userOutput && i.userOutput.get();
      return {
        componentType: f,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: c ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: c ? this.id : null,
        seriesName: c ? this.name : null,
        name: o,
        dataIndex: a,
        data: s,
        dataType: r,
        value: n,
        color: u,
        borderColor: h,
        dimensionNames: v ? v.fullDimensions : null,
        encode: v ? v.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    }, e.prototype.getFormattedLabel = function(t, r, i, n, a, o) {
      r = r || "normal";
      var s = this.getData(i), l = this.getDataParams(t, i);
      if (o && (l.value = o.interpolatedValue), n != null && k(l.value) && (l.value = l.value[n]), !a) {
        var u = s.getItemModel(t);
        a = u.get(r === "normal" ? ["label", "formatter"] : [r, "label", "formatter"]);
      }
      if (rt(a))
        return l.status = r, l.dimensionIndex = n, a(l);
      if (z(a)) {
        var h = Yd(a, l);
        return h.replace(nC, function(f, c) {
          var v = c.length, d = c;
          d.charAt(0) === "[" && d.charAt(v - 1) === "]" && (d = +d.slice(1, v - 1), process.env.NODE_ENV !== "production" && isNaN(d) && It("Invalide label formatter: @" + c + ", only support @[0], @[1], @[2], ..."));
          var _ = _o(s, t, d);
          if (o && k(o.interpolatedValue)) {
            var p = s.getDimensionIndex(d);
            p >= 0 && (_ = o.interpolatedValue[p]);
          }
          return _ != null ? _ + "" : "";
        });
      }
    }, e.prototype.getRawValue = function(t, r) {
      return _o(this.getData(r), t);
    }, e.prototype.formatTooltip = function(t, r, i) {
    }, e;
  })()
);
function jf(e) {
  var t, r;
  return B(e) ? e.type ? r = e : process.env.NODE_ENV !== "production" && console.warn("The return type of `formatTooltip` is not supported: " + oo(e)) : t = e, {
    text: t,
    // markers: markers || markersExisting,
    frag: r
  };
}
function In(e) {
  return new oC(e);
}
var oC = (
  /** @class */
  (function() {
    function e(t) {
      t = t || {}, this._reset = t.reset, this._plan = t.plan, this._count = t.count, this._onDirty = t.onDirty, this._dirty = !0;
    }
    return e.prototype.perform = function(t) {
      var r = this._upstream, i = t && t.skip;
      if (this._dirty && r) {
        var n = this.context;
        n.data = n.outputData = r.context.outputData;
      }
      this.__pipeline && (this.__pipeline.currentTask = this);
      var a;
      this._plan && !i && (a = this._plan(this.context));
      var o = h(this._modBy), s = this._modDataCount || 0, l = h(t && t.modBy), u = t && t.modDataCount || 0;
      (o !== l || s !== u) && (a = "reset");
      function h(m) {
        return !(m >= 1) && (m = 1), m;
      }
      var f;
      (this._dirty || a === "reset") && (this._dirty = !1, f = this._doReset(i)), this._modBy = l, this._modDataCount = u;
      var c = t && t.step;
      if (r ? (process.env.NODE_ENV !== "production" && j(r._outputDueEnd != null), this._dueEnd = r._outputDueEnd) : (process.env.NODE_ENV !== "production" && j(!this._progress || this._count), this._dueEnd = this._count ? this._count(this.context) : 1 / 0), this._progress) {
        var v = this._dueIndex, d = Math.min(c != null ? this._dueIndex + c : 1 / 0, this._dueEnd);
        if (!i && (f || v < d)) {
          var _ = this._progress;
          if (k(_))
            for (var p = 0; p < _.length; p++)
              this._doProgress(_[p], v, d, l, u);
          else
            this._doProgress(_, v, d, l, u);
        }
        this._dueIndex = d;
        var g = this._settedOutputEnd != null ? this._settedOutputEnd : d;
        process.env.NODE_ENV !== "production" && j(g >= this._outputDueEnd), this._outputDueEnd = g;
      } else
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      return this.unfinished();
    }, e.prototype.dirty = function() {
      this._dirty = !0, this._onDirty && this._onDirty(this.context);
    }, e.prototype._doProgress = function(t, r, i, n, a) {
      Qf.reset(r, i, n, a), this._callingProgress = t, this._callingProgress({
        start: r,
        end: i,
        count: i - r,
        next: Qf.next
      }, this.context);
    }, e.prototype._doReset = function(t) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0, this._settedOutputEnd = null;
      var r, i;
      !t && this._reset && (r = this._reset(this.context), r && r.progress && (i = r.forceFirstProgress, r = r.progress), k(r) && !r.length && (r = null)), this._progress = r, this._modBy = this._modDataCount = null;
      var n = this._downstream;
      return n && n.dirty(), i;
    }, e.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    }, e.prototype.pipe = function(t) {
      process.env.NODE_ENV !== "production" && j(t && !t._disposed && t !== this), (this._downstream !== t || this._dirty) && (this._downstream = t, t._upstream = this, t.dirty());
    }, e.prototype.dispose = function() {
      this._disposed || (this._upstream && (this._upstream._downstream = null), this._downstream && (this._downstream._upstream = null), this._dirty = !1, this._disposed = !0);
    }, e.prototype.getUpstream = function() {
      return this._upstream;
    }, e.prototype.getDownstream = function() {
      return this._downstream;
    }, e.prototype.setOutputEnd = function(t) {
      this._outputDueEnd = this._settedOutputEnd = t;
    }, e;
  })()
), Qf = /* @__PURE__ */ (function() {
  var e, t, r, i, n, a = {
    reset: function(l, u, h, f) {
      t = l, e = u, r = h, i = f, n = Math.ceil(i / r), a.next = r > 1 && i > 0 ? s : o;
    }
  };
  return a;
  function o() {
    return t < e ? t++ : null;
  }
  function s() {
    var l = t % n * r + Math.ceil(t / n), u = t >= e ? null : l < i ? l : t;
    return t++, u;
  }
})();
function Wa(e, t) {
  var r = t && t.type;
  return r === "ordinal" ? e : (r === "time" && !yt(e) && e != null && e !== "-" && (e = +Ro(e)), e == null || e === "" ? NaN : Number(e));
}
et({
  number: function(e) {
    return parseFloat(e);
  },
  time: function(e) {
    return +Ro(e);
  },
  trim: function(e) {
    return z(e) ? Pe(e) : e;
  }
});
var sC = (
  /** @class */
  (function() {
    function e(t, r) {
      var i = t === "desc";
      this._resultLT = i ? 1 : -1, r == null && (r = i ? "min" : "max"), this._incomparable = r === "min" ? -1 / 0 : 1 / 0;
    }
    return e.prototype.evaluate = function(t, r) {
      var i = yt(t) ? t : ao(t), n = yt(r) ? r : ao(r), a = isNaN(i), o = isNaN(n);
      if (a && (i = this._incomparable), o && (n = this._incomparable), a && o) {
        var s = z(t), l = z(r);
        s && (i = l ? t : 0), l && (n = s ? r : 0);
      }
      return i < n ? this._resultLT : i > n ? -this._resultLT : 0;
    }, e;
  })()
), lC = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getRawData = function() {
      throw new Error("not supported");
    }, e.prototype.getRawDataItem = function(t) {
      throw new Error("not supported");
    }, e.prototype.cloneRawData = function() {
    }, e.prototype.getDimensionInfo = function(t) {
    }, e.prototype.cloneAllDimensionInfo = function() {
    }, e.prototype.count = function() {
    }, e.prototype.retrieveValue = function(t, r) {
    }, e.prototype.retrieveValueFromItem = function(t, r) {
    }, e.prototype.convertValue = function(t, r) {
      return Wa(t, r);
    }, e;
  })()
);
function uC(e, t) {
  var r = new lC(), i = e.data, n = r.sourceFormat = e.sourceFormat, a = e.startIndex, o = "";
  e.seriesLayoutBy !== Xe && (process.env.NODE_ENV !== "production" && (o = '`seriesLayoutBy` of upstream dataset can only be "column" in data transform.'), Ht(o));
  var s = [], l = {}, u = e.dimensionsDefine;
  if (u)
    D(u, function(_, p) {
      var g = _.name, m = {
        index: p,
        name: g,
        displayName: _.displayName
      };
      if (s.push(m), g != null) {
        var y = "";
        Ri(l, g) && (process.env.NODE_ENV !== "production" && (y = 'dimension name "' + g + '" duplicated.'), Ht(y)), l[g] = m;
      }
    });
  else
    for (var h = 0; h < e.dimensionsDetectedCount; h++)
      s.push({
        index: h
      });
  var f = up(n, Xe);
  t.__isBuiltIn && (r.getRawDataItem = function(_) {
    return f(i, a, s, _);
  }, r.getRawData = lt(hC, null, e)), r.cloneRawData = lt(fC, null, e);
  var c = hp(n, Xe);
  r.count = lt(c, null, i, a, s);
  var v = fp(n);
  r.retrieveValue = function(_, p) {
    var g = f(i, a, s, _);
    return d(g, p);
  };
  var d = r.retrieveValueFromItem = function(_, p) {
    if (_ != null) {
      var g = s[p];
      if (g)
        return v(_, p, g.name);
    }
  };
  return r.getDimensionInfo = lt(cC, null, s, l), r.cloneAllDimensionInfo = lt(vC, null, s), r;
}
function hC(e) {
  var t = e.sourceFormat;
  if (!Vu(t)) {
    var r = "";
    process.env.NODE_ENV !== "production" && (r = "`getRawData` is not supported in source format " + t), Ht(r);
  }
  return e.data;
}
function fC(e) {
  var t = e.sourceFormat, r = e.data;
  if (!Vu(t)) {
    var i = "";
    process.env.NODE_ENV !== "production" && (i = "`cloneRawData` is not supported in source format " + t), Ht(i);
  }
  if (t === Xt) {
    for (var n = [], a = 0, o = r.length; a < o; a++)
      n.push(r[a].slice());
    return n;
  } else if (t === be) {
    for (var n = [], a = 0, o = r.length; a < o; a++)
      n.push(I({}, r[a]));
    return n;
  }
}
function cC(e, t, r) {
  if (r != null) {
    if (yt(r) || !isNaN(r) && !Ri(t, r))
      return e[r];
    if (Ri(t, r))
      return t[r];
  }
}
function vC(e) {
  return tt(e);
}
var cp = et();
function dC(e) {
  e = tt(e);
  var t = e.type, r = "";
  t || (process.env.NODE_ENV !== "production" && (r = "Must have a `type` when `registerTransform`."), Ht(r));
  var i = t.split(":");
  i.length !== 2 && (process.env.NODE_ENV !== "production" && (r = 'Name must include namespace like "ns:regression".'), Ht(r));
  var n = !1;
  i[0] === "echarts" && (t = i[1], n = !0), e.__isBuiltIn = n, cp.set(t, e);
}
function pC(e, t, r) {
  var i = Nt(e), n = i.length, a = "";
  n || (process.env.NODE_ENV !== "production" && (a = "If `transform` declared, it should at least contain one transform."), Ht(a));
  for (var o = 0, s = n; o < s; o++) {
    var l = i[o];
    t = gC(l, t, r, n === 1 ? null : o), o !== s - 1 && (t.length = Math.max(t.length, 1));
  }
  return t;
}
function gC(e, t, r, i) {
  var n = "";
  t.length || (process.env.NODE_ENV !== "production" && (n = "Must have at least one upstream dataset."), Ht(n)), B(e) || (process.env.NODE_ENV !== "production" && (n = "transform declaration must be an object rather than " + typeof e + "."), Ht(n));
  var a = e.type, o = cp.get(a);
  o || (process.env.NODE_ENV !== "production" && (n = 'Can not find transform on type "' + a + '".'), Ht(n));
  var s = Q(t, function(h) {
    return uC(h, o);
  }), l = Nt(o.transform({
    upstream: s[0],
    upstreamList: s,
    config: tt(e.config)
  }));
  if (process.env.NODE_ENV !== "production" && e.print) {
    var u = Q(l, function(h) {
      var f = i != null ? " === pipe index: " + i : "";
      return ["=== dataset index: " + r.datasetIndex + f + " ===", "- transform result data:", oo(h.data), "- transform result dimensions:", oo(h.dimensions)].join(`
`);
    }).join(`
`);
    f1(u);
  }
  return Q(l, function(h, f) {
    var c = "";
    B(h) || (process.env.NODE_ENV !== "production" && (c = "A transform should not return some empty results."), Ht(c)), h.data || (process.env.NODE_ENV !== "production" && (c = "Transform result data should be not be null or undefined"), Ht(c));
    var v = op(h.data);
    Vu(v) || (process.env.NODE_ENV !== "production" && (c = "Transform result data should be array rows or object rows."), Ht(c));
    var d, _ = t[0];
    if (_ && f === 0 && !h.dimensions) {
      var p = _.startIndex;
      p && (h.data = _.data.slice(0, p).concat(h.data)), d = {
        seriesLayoutBy: Xe,
        sourceHeader: p,
        dimensions: _.metaRawOption.dimensions
      };
    } else
      d = {
        seriesLayoutBy: Xe,
        sourceHeader: 0,
        dimensions: h.dimensions
      };
    return $l(h.data, d, null);
  });
}
function Vu(e) {
  return e === Xt || e === be;
}
var Go = "undefined", _C = typeof Uint32Array === Go ? Array : Uint32Array, mC = typeof Uint16Array === Go ? Array : Uint16Array, vp = typeof Int32Array === Go ? Array : Int32Array, Jf = typeof Float64Array === Go ? Array : Float64Array, dp = {
  float: Jf,
  int: vp,
  // Ordinal data type can be string or int
  ordinal: Array,
  number: Array,
  time: Jf
}, zs;
function fi(e) {
  return e > 65535 ? _C : mC;
}
function ci() {
  return [1 / 0, -1 / 0];
}
function yC(e) {
  var t = e.constructor;
  return t === Array ? e.slice() : new t(e);
}
function tc(e, t, r, i, n) {
  var a = dp[r || "float"];
  if (n) {
    var o = e[t], s = o && o.length;
    if (s !== i) {
      for (var l = new a(i), u = 0; u < s; u++)
        l[u] = o[u];
      e[t] = l;
    }
  } else
    e[t] = new a(i);
}
var Bl = (
  /** @class */
  (function() {
    function e() {
      this._chunks = [], this._rawExtent = [], this._extent = [], this._count = 0, this._rawCount = 0, this._calcDimNameToIdx = et();
    }
    return e.prototype.initData = function(t, r, i) {
      process.env.NODE_ENV !== "production" && j(rt(t.getItem) && rt(t.count), "Invalid data provider."), this._provider = t, this._chunks = [], this._indices = null, this.getRawIndex = this._getRawIdxIdentity;
      var n = t.getSource(), a = this.defaultDimValueGetter = zs[n.sourceFormat];
      this._dimValueGetter = i || a, this._rawExtent = [];
      var o = sp(n);
      this._dimensions = Q(r, function(s) {
        return process.env.NODE_ENV !== "production" && o && j(s.property != null), {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: s.type,
          property: s.property
        };
      }), this._initDataFromProvider(0, t.count());
    }, e.prototype.getProvider = function() {
      return this._provider;
    }, e.prototype.getSource = function() {
      return this._provider.getSource();
    }, e.prototype.ensureCalculationDimension = function(t, r) {
      var i = this._calcDimNameToIdx, n = this._dimensions, a = i.get(t);
      if (a != null) {
        if (n[a].type === r)
          return a;
      } else
        a = n.length;
      return n[a] = {
        type: r
      }, i.set(t, a), this._chunks[a] = new dp[r || "float"](this._rawCount), this._rawExtent[a] = ci(), a;
    }, e.prototype.collectOrdinalMeta = function(t, r) {
      var i = this._chunks[t], n = this._dimensions[t], a = this._rawExtent, o = n.ordinalOffset || 0, s = i.length;
      o === 0 && (a[t] = ci());
      for (var l = a[t], u = o; u < s; u++) {
        var h = i[u] = r.parseAndCollect(i[u]);
        isNaN(h) || (l[0] = Math.min(h, l[0]), l[1] = Math.max(h, l[1]));
      }
      n.ordinalMeta = r, n.ordinalOffset = s, n.type = "ordinal";
    }, e.prototype.getOrdinalMeta = function(t) {
      var r = this._dimensions[t], i = r.ordinalMeta;
      return i;
    }, e.prototype.getDimensionProperty = function(t) {
      var r = this._dimensions[t];
      return r && r.property;
    }, e.prototype.appendData = function(t) {
      process.env.NODE_ENV !== "production" && j(!this._indices, "appendData can only be called on raw data.");
      var r = this._provider, i = this.count();
      r.appendData(t);
      var n = r.count();
      return r.persistent || (n += i), i < n && this._initDataFromProvider(i, n, !0), [i, n];
    }, e.prototype.appendValues = function(t, r) {
      for (var i = this._chunks, n = this._dimensions, a = n.length, o = this._rawExtent, s = this.count(), l = s + Math.max(t.length, r || 0), u = 0; u < a; u++) {
        var h = n[u];
        tc(i, u, h.type, l, !0);
      }
      for (var f = [], c = s; c < l; c++)
        for (var v = c - s, d = 0; d < a; d++) {
          var h = n[d], _ = zs.arrayRows.call(this, t[v] || f, h.property, v, d);
          i[d][c] = _;
          var p = o[d];
          _ < p[0] && (p[0] = _), _ > p[1] && (p[1] = _);
        }
      return this._rawCount = this._count = l, {
        start: s,
        end: l
      };
    }, e.prototype._initDataFromProvider = function(t, r, i) {
      for (var n = this._provider, a = this._chunks, o = this._dimensions, s = o.length, l = this._rawExtent, u = Q(o, function(m) {
        return m.property;
      }), h = 0; h < s; h++) {
        var f = o[h];
        l[h] || (l[h] = ci()), tc(a, h, f.type, r, i);
      }
      if (n.fillStorage)
        n.fillStorage(t, r, a, l);
      else
        for (var c = [], v = t; v < r; v++) {
          c = n.getItem(v, c);
          for (var d = 0; d < s; d++) {
            var _ = a[d], p = this._dimValueGetter(c, u[d], v, d);
            _[v] = p;
            var g = l[d];
            p < g[0] && (g[0] = p), p > g[1] && (g[1] = p);
          }
        }
      !n.persistent && n.clean && n.clean(), this._rawCount = this._count = r, this._extent = [];
    }, e.prototype.count = function() {
      return this._count;
    }, e.prototype.get = function(t, r) {
      if (!(r >= 0 && r < this._count))
        return NaN;
      var i = this._chunks[t];
      return i ? i[this.getRawIndex(r)] : NaN;
    }, e.prototype.getValues = function(t, r) {
      var i = [], n = [];
      if (r == null) {
        r = t, t = [];
        for (var a = 0; a < this._dimensions.length; a++)
          n.push(a);
      } else
        n = t;
      for (var a = 0, o = n.length; a < o; a++)
        i.push(this.get(n[a], r));
      return i;
    }, e.prototype.getByRawIndex = function(t, r) {
      if (!(r >= 0 && r < this._rawCount))
        return NaN;
      var i = this._chunks[t];
      return i ? i[r] : NaN;
    }, e.prototype.getSum = function(t) {
      var r = this._chunks[t], i = 0;
      if (r)
        for (var n = 0, a = this.count(); n < a; n++) {
          var o = this.get(t, n);
          isNaN(o) || (i += o);
        }
      return i;
    }, e.prototype.getMedian = function(t) {
      var r = [];
      this.each([t], function(a) {
        isNaN(a) || r.push(a);
      });
      var i = r.sort(function(a, o) {
        return a - o;
      }), n = this.count();
      return n === 0 ? 0 : n % 2 === 1 ? i[(n - 1) / 2] : (i[n / 2] + i[n / 2 - 1]) / 2;
    }, e.prototype.indexOfRawIndex = function(t) {
      if (t >= this._rawCount || t < 0)
        return -1;
      if (!this._indices)
        return t;
      var r = this._indices, i = r[t];
      if (i != null && i < this._count && i === t)
        return t;
      for (var n = 0, a = this._count - 1; n <= a; ) {
        var o = (n + a) / 2 | 0;
        if (r[o] < t)
          n = o + 1;
        else if (r[o] > t)
          a = o - 1;
        else
          return o;
      }
      return -1;
    }, e.prototype.indicesOfNearest = function(t, r, i) {
      var n = this._chunks, a = n[t], o = [];
      if (!a)
        return o;
      i == null && (i = 1 / 0);
      for (var s = 1 / 0, l = -1, u = 0, h = 0, f = this.count(); h < f; h++) {
        var c = this.getRawIndex(h), v = r - a[c], d = Math.abs(v);
        d <= i && ((d < s || d === s && v >= 0 && l < 0) && (s = d, l = v, u = 0), v === l && (o[u++] = h));
      }
      return o.length = u, o;
    }, e.prototype.getIndices = function() {
      var t, r = this._indices;
      if (r) {
        var i = r.constructor, n = this._count;
        if (i === Array) {
          t = new i(n);
          for (var a = 0; a < n; a++)
            t[a] = r[a];
        } else
          t = new i(r.buffer, 0, n);
      } else {
        var i = fi(this._rawCount);
        t = new i(this.count());
        for (var a = 0; a < t.length; a++)
          t[a] = a;
      }
      return t;
    }, e.prototype.filter = function(t, r) {
      if (!this._count)
        return this;
      for (var i = this.clone(), n = i.count(), a = fi(i._rawCount), o = new a(n), s = [], l = t.length, u = 0, h = t[0], f = i._chunks, c = 0; c < n; c++) {
        var v = void 0, d = i.getRawIndex(c);
        if (l === 0)
          v = r(c);
        else if (l === 1) {
          var _ = f[h][d];
          v = r(_, c);
        } else {
          for (var p = 0; p < l; p++)
            s[p] = f[t[p]][d];
          s[p] = c, v = r.apply(null, s);
        }
        v && (o[u++] = d);
      }
      return u < n && (i._indices = o), i._count = u, i._extent = [], i._updateGetRawIdx(), i;
    }, e.prototype.selectRange = function(t) {
      var r = this.clone(), i = r._count;
      if (!i)
        return this;
      var n = pt(t), a = n.length;
      if (!a)
        return this;
      var o = r.count(), s = fi(r._rawCount), l = new s(o), u = 0, h = n[0], f = t[h][0], c = t[h][1], v = r._chunks, d = !1;
      if (!r._indices) {
        var _ = 0;
        if (a === 1) {
          for (var p = v[n[0]], g = 0; g < i; g++) {
            var m = p[g];
            (m >= f && m <= c || isNaN(m)) && (l[u++] = _), _++;
          }
          d = !0;
        } else if (a === 2) {
          for (var p = v[n[0]], y = v[n[1]], w = t[n[1]][0], S = t[n[1]][1], g = 0; g < i; g++) {
            var m = p[g], b = y[g];
            (m >= f && m <= c || isNaN(m)) && (b >= w && b <= S || isNaN(b)) && (l[u++] = _), _++;
          }
          d = !0;
        }
      }
      if (!d)
        if (a === 1)
          for (var g = 0; g < o; g++) {
            var T = r.getRawIndex(g), m = v[n[0]][T];
            (m >= f && m <= c || isNaN(m)) && (l[u++] = T);
          }
        else
          for (var g = 0; g < o; g++) {
            for (var C = !0, T = r.getRawIndex(g), x = 0; x < a; x++) {
              var E = n[x], m = v[E][T];
              (m < t[E][0] || m > t[E][1]) && (C = !1);
            }
            C && (l[u++] = r.getRawIndex(g));
          }
      return u < o && (r._indices = l), r._count = u, r._extent = [], r._updateGetRawIdx(), r;
    }, e.prototype.map = function(t, r) {
      var i = this.clone(t);
      return this._updateDims(i, t, r), i;
    }, e.prototype.modify = function(t, r) {
      this._updateDims(this, t, r);
    }, e.prototype._updateDims = function(t, r, i) {
      for (var n = t._chunks, a = [], o = r.length, s = t.count(), l = [], u = t._rawExtent, h = 0; h < r.length; h++)
        u[r[h]] = ci();
      for (var f = 0; f < s; f++) {
        for (var c = t.getRawIndex(f), v = 0; v < o; v++)
          l[v] = n[r[v]][c];
        l[o] = f;
        var d = i && i.apply(null, l);
        if (d != null) {
          typeof d != "object" && (a[0] = d, d = a);
          for (var h = 0; h < d.length; h++) {
            var _ = r[h], p = d[h], g = u[_], m = n[_];
            m && (m[c] = p), p < g[0] && (g[0] = p), p > g[1] && (g[1] = p);
          }
        }
      }
    }, e.prototype.lttbDownSample = function(t, r) {
      var i = this.clone([t], !0), n = i._chunks, a = n[t], o = this.count(), s = 0, l = Math.floor(1 / r), u = this.getRawIndex(0), h, f, c, v = new (fi(this._rawCount))(Math.min((Math.ceil(o / l) + 2) * 2, o));
      v[s++] = u;
      for (var d = 1; d < o - 1; d += l) {
        for (var _ = Math.min(d + l, o - 1), p = Math.min(d + l * 2, o), g = (p + _) / 2, m = 0, y = _; y < p; y++) {
          var w = this.getRawIndex(y), S = a[w];
          isNaN(S) || (m += S);
        }
        m /= p - _;
        var b = d, T = Math.min(d + l, o), C = d - 1, x = a[u];
        h = -1, c = b;
        for (var E = -1, A = 0, y = b; y < T; y++) {
          var w = this.getRawIndex(y), S = a[w];
          if (isNaN(S)) {
            A++, E < 0 && (E = w);
            continue;
          }
          f = Math.abs((C - g) * (S - x) - (C - y) * (m - x)), f > h && (h = f, c = w);
        }
        A > 0 && A < T - b && (v[s++] = Math.min(E, c), c = Math.max(E, c)), v[s++] = c, u = c;
      }
      return v[s++] = this.getRawIndex(o - 1), i._count = s, i._indices = v, i.getRawIndex = this._getRawIdx, i;
    }, e.prototype.minmaxDownSample = function(t, r) {
      for (var i = this.clone([t], !0), n = i._chunks, a = Math.floor(1 / r), o = n[t], s = this.count(), l = new (fi(this._rawCount))(Math.ceil(s / a) * 2), u = 0, h = 0; h < s; h += a) {
        var f = h, c = o[this.getRawIndex(f)], v = h, d = o[this.getRawIndex(v)], _ = a;
        h + a > s && (_ = s - h);
        for (var p = 0; p < _; p++) {
          var g = this.getRawIndex(h + p), m = o[g];
          m < c && (c = m, f = h + p), m > d && (d = m, v = h + p);
        }
        var y = this.getRawIndex(f), w = this.getRawIndex(v);
        f < v ? (l[u++] = y, l[u++] = w) : (l[u++] = w, l[u++] = y);
      }
      return i._count = u, i._indices = l, i._updateGetRawIdx(), i;
    }, e.prototype.downSample = function(t, r, i, n) {
      for (var a = this.clone([t], !0), o = a._chunks, s = [], l = Math.floor(1 / r), u = o[t], h = this.count(), f = a._rawExtent[t] = ci(), c = new (fi(this._rawCount))(Math.ceil(h / l)), v = 0, d = 0; d < h; d += l) {
        l > h - d && (l = h - d, s.length = l);
        for (var _ = 0; _ < l; _++) {
          var p = this.getRawIndex(d + _);
          s[_] = u[p];
        }
        var g = i(s), m = this.getRawIndex(Math.min(d + n(s, g) || 0, h - 1));
        u[m] = g, g < f[0] && (f[0] = g), g > f[1] && (f[1] = g), c[v++] = m;
      }
      return a._count = v, a._indices = c, a._updateGetRawIdx(), a;
    }, e.prototype.each = function(t, r) {
      if (this._count)
        for (var i = t.length, n = this._chunks, a = 0, o = this.count(); a < o; a++) {
          var s = this.getRawIndex(a);
          switch (i) {
            case 0:
              r(a);
              break;
            case 1:
              r(n[t[0]][s], a);
              break;
            case 2:
              r(n[t[0]][s], n[t[1]][s], a);
              break;
            default:
              for (var l = 0, u = []; l < i; l++)
                u[l] = n[t[l]][s];
              u[l] = a, r.apply(null, u);
          }
        }
    }, e.prototype.getDataExtent = function(t) {
      var r = this._chunks[t], i = ci();
      if (!r)
        return i;
      var n = this.count(), a = !this._indices, o;
      if (a)
        return this._rawExtent[t].slice();
      if (o = this._extent[t], o)
        return o.slice();
      o = i;
      for (var s = o[0], l = o[1], u = 0; u < n; u++) {
        var h = this.getRawIndex(u), f = r[h];
        f < s && (s = f), f > l && (l = f);
      }
      return o = [s, l], this._extent[t] = o, o;
    }, e.prototype.getRawDataItem = function(t) {
      var r = this.getRawIndex(t);
      if (this._provider.persistent)
        return this._provider.getItem(r);
      for (var i = [], n = this._chunks, a = 0; a < n.length; a++)
        i.push(n[a][r]);
      return i;
    }, e.prototype.clone = function(t, r) {
      var i = new e(), n = this._chunks, a = t && dr(t, function(s, l) {
        return s[l] = !0, s;
      }, {});
      if (a)
        for (var o = 0; o < n.length; o++)
          i._chunks[o] = a[o] ? yC(n[o]) : n[o];
      else
        i._chunks = n;
      return this._copyCommonProps(i), r || (i._indices = this._cloneIndices()), i._updateGetRawIdx(), i;
    }, e.prototype._copyCommonProps = function(t) {
      t._count = this._count, t._rawCount = this._rawCount, t._provider = this._provider, t._dimensions = this._dimensions, t._extent = tt(this._extent), t._rawExtent = tt(this._rawExtent);
    }, e.prototype._cloneIndices = function() {
      if (this._indices) {
        var t = this._indices.constructor, r = void 0;
        if (t === Array) {
          var i = this._indices.length;
          r = new t(i);
          for (var n = 0; n < i; n++)
            r[n] = this._indices[n];
        } else
          r = new t(this._indices);
        return r;
      }
      return null;
    }, e.prototype._getRawIdxIdentity = function(t) {
      return t;
    }, e.prototype._getRawIdx = function(t) {
      return t < this._count && t >= 0 ? this._indices[t] : -1;
    }, e.prototype._updateGetRawIdx = function() {
      this.getRawIndex = this._indices ? this._getRawIdx : this._getRawIdxIdentity;
    }, e.internalField = (function() {
      function t(r, i, n, a) {
        return Wa(r[a], this._dimensions[a]);
      }
      zs = {
        arrayRows: t,
        objectRows: function(r, i, n, a) {
          return Wa(r[i], this._dimensions[a]);
        },
        keyedColumns: t,
        original: function(r, i, n, a) {
          var o = r && (r.value == null ? r : r.value);
          return Wa(o instanceof Array ? o[a] : o, this._dimensions[a]);
        },
        typedArray: function(r, i, n, a) {
          return r[a];
        }
      };
    })(), e;
  })()
), wC = (
  /** @class */
  (function() {
    function e(t) {
      this._sourceList = [], this._storeList = [], this._upstreamSignList = [], this._versionSignBase = 0, this._dirty = !0, this._sourceHost = t;
    }
    return e.prototype.dirty = function() {
      this._setLocalSource([], []), this._storeList = [], this._dirty = !0;
    }, e.prototype._setLocalSource = function(t, r) {
      this._sourceList = t, this._upstreamSignList = r, this._versionSignBase++, this._versionSignBase > 9e10 && (this._versionSignBase = 0);
    }, e.prototype._getVersionSign = function() {
      return this._sourceHost.uid + "_" + this._versionSignBase;
    }, e.prototype.prepareSource = function() {
      this._isDirty() && (this._createSource(), this._dirty = !1);
    }, e.prototype._createSource = function() {
      this._setLocalSource([], []);
      var t = this._sourceHost, r = this._getUpstreamSourceManagers(), i = !!r.length, n, a;
      if (an(t)) {
        var o = t, s = void 0, l = void 0, u = void 0;
        if (i) {
          var h = r[0];
          h.prepareSource(), u = h.getSource(), s = u.data, l = u.sourceFormat, a = [h._getVersionSign()];
        } else
          s = o.get("data", !0), l = $t(s) ? Ye : Be, a = [];
        var f = this._getSourceMetaRawOption() || {}, c = u && u.metaRawOption || {}, v = X(f.seriesLayoutBy, c.seriesLayoutBy) || null, d = X(f.sourceHeader, c.sourceHeader), _ = X(f.dimensions, c.dimensions), p = v !== c.seriesLayoutBy || !!d != !!c.sourceHeader || _;
        n = p ? [$l(s, {
          seriesLayoutBy: v,
          sourceHeader: d,
          dimensions: _
        }, l)] : [];
      } else {
        var g = t;
        if (i) {
          var m = this._applyTransform(r);
          n = m.sourceList, a = m.upstreamSignList;
        } else {
          var y = g.get("source", !0);
          n = [$l(y, this._getSourceMetaRawOption(), null)], a = [];
        }
      }
      process.env.NODE_ENV !== "production" && j(n && a), this._setLocalSource(n, a);
    }, e.prototype._applyTransform = function(t) {
      var r = this._sourceHost, i = r.get("transform", !0), n = r.get("fromTransformResult", !0);
      if (process.env.NODE_ENV !== "production" && j(n != null || i != null), n != null) {
        var a = "";
        t.length !== 1 && (process.env.NODE_ENV !== "production" && (a = "When using `fromTransformResult`, there should be only one upstream dataset"), ec(a));
      }
      var o, s = [], l = [];
      return D(t, function(u) {
        u.prepareSource();
        var h = u.getSource(n || 0), f = "";
        n != null && !h && (process.env.NODE_ENV !== "production" && (f = "Can not retrieve result by `fromTransformResult`: " + n), ec(f)), s.push(h), l.push(u._getVersionSign());
      }), i ? o = pC(i, s, {
        datasetIndex: r.componentIndex
      }) : n != null && (o = [QT(s[0])]), {
        sourceList: o,
        upstreamSignList: l
      };
    }, e.prototype._isDirty = function() {
      if (this._dirty)
        return !0;
      for (var t = this._getUpstreamSourceManagers(), r = 0; r < t.length; r++) {
        var i = t[r];
        if (
          // Consider the case that there is ancestor diry, call it recursively.
          // The performance is probably not an issue because usually the chain is not long.
          i._isDirty() || this._upstreamSignList[r] !== i._getVersionSign()
        )
          return !0;
      }
    }, e.prototype.getSource = function(t) {
      t = t || 0;
      var r = this._sourceList[t];
      if (!r) {
        var i = this._getUpstreamSourceManagers();
        return i[0] && i[0].getSource(t);
      }
      return r;
    }, e.prototype.getSharedDataStore = function(t) {
      process.env.NODE_ENV !== "production" && j(an(this._sourceHost), "Can only call getDataStore on series source manager.");
      var r = t.makeStoreSchema();
      return this._innerGetDataStore(r.dimensions, t.source, r.hash);
    }, e.prototype._innerGetDataStore = function(t, r, i) {
      var n = 0, a = this._storeList, o = a[n];
      o || (o = a[n] = {});
      var s = o[i];
      if (!s) {
        var l = this._getUpstreamSourceManagers()[0];
        an(this._sourceHost) && l ? s = l._innerGetDataStore(t, r, i) : (s = new Bl(), s.initData(new lp(r, t.length), t)), o[i] = s;
      }
      return s;
    }, e.prototype._getUpstreamSourceManagers = function() {
      var t = this._sourceHost;
      if (an(t)) {
        var r = Qd(t);
        return r ? [r.getSourceManager()] : [];
      } else
        return Q(xT(t), function(i) {
          return i.getSourceManager();
        });
    }, e.prototype._getSourceMetaRawOption = function() {
      var t = this._sourceHost, r, i, n;
      if (an(t))
        r = t.get("seriesLayoutBy", !0), i = t.get("sourceHeader", !0), n = t.get("dimensions", !0);
      else if (!this._getUpstreamSourceManagers().length) {
        var a = t;
        r = a.get("seriesLayoutBy", !0), i = a.get("sourceHeader", !0), n = a.get("dimensions", !0);
      }
      return {
        seriesLayoutBy: r,
        sourceHeader: i,
        dimensions: n
      };
    }, e;
  })()
);
function an(e) {
  return e.mainType === "series";
}
function ec(e) {
  throw new Error(e);
}
var bC = "line-height:1";
function pp(e) {
  var t = e.lineHeight;
  return t == null ? bC : "line-height:" + Vt(t + "") + "px";
}
function gp(e, t) {
  var r = e.color || "#6e7079", i = e.fontSize || 12, n = e.fontWeight || "400", a = e.color || "#464646", o = e.fontSize || 14, s = e.fontWeight || "900";
  return t === "html" ? {
    // eslint-disable-next-line max-len
    nameStyle: "font-size:" + Vt(i + "") + "px;color:" + Vt(r) + ";font-weight:" + Vt(n + ""),
    // eslint-disable-next-line max-len
    valueStyle: "font-size:" + Vt(o + "") + "px;color:" + Vt(a) + ";font-weight:" + Vt(s + "")
  } : {
    nameStyle: {
      fontSize: i,
      fill: r,
      fontWeight: n
    },
    valueStyle: {
      fontSize: o,
      fill: a,
      fontWeight: s
    }
  };
}
var SC = [0, 10, 20, 30], TC = ["", `
`, `

`, `


`];
function Wn(e, t) {
  return t.type = e, t;
}
function Fl(e) {
  return e.type === "section";
}
function _p(e) {
  return Fl(e) ? CC : xC;
}
function mp(e) {
  if (Fl(e)) {
    var t = 0, r = e.blocks.length, i = r > 1 || r > 0 && !e.noHeader;
    return D(e.blocks, function(n) {
      var a = mp(n);
      a >= t && (t = a + +(i && // 0 always can not be readable gap level.
      (!a || Fl(n) && !n.noHeader)));
    }), t;
  }
  return 0;
}
function CC(e, t, r, i) {
  var n = t.noHeader, a = DC(mp(t)), o = [], s = t.blocks || [];
  j(!s || k(s)), s = s || [];
  var l = e.orderMode;
  if (t.sortBlocks && l) {
    s = s.slice();
    var u = {
      valueAsc: "asc",
      valueDesc: "desc"
    };
    if (Ri(u, l)) {
      var h = new sC(u[l], null);
      s.sort(function(_, p) {
        return h.evaluate(_.sortParam, p.sortParam);
      });
    } else l === "seriesDesc" && s.reverse();
  }
  D(s, function(_, p) {
    var g = t.valueFormatter, m = _p(_)(
      // Inherit valueFormatter
      g ? I(I({}, e), {
        valueFormatter: g
      }) : e,
      _,
      p > 0 ? a.html : 0,
      i
    );
    m != null && o.push(m);
  });
  var f = e.renderMode === "richText" ? o.join(a.richText) : Vl(i, o.join(""), n ? r : a.html);
  if (n)
    return f;
  var c = kl(t.header, "ordinal", e.useUTC), v = gp(i, e.renderMode).nameStyle, d = pp(i);
  return e.renderMode === "richText" ? yp(e, c, v) + a.richText + f : Vl(i, '<div style="' + v + ";" + d + ';">' + Vt(c) + "</div>" + f, r);
}
function xC(e, t, r, i) {
  var n = e.renderMode, a = t.noName, o = t.noValue, s = !t.markerType, l = t.name, u = e.useUTC, h = t.valueFormatter || e.valueFormatter || function(w) {
    return w = k(w) ? w : [w], Q(w, function(S, b) {
      return kl(S, k(v) ? v[b] : v, u);
    });
  };
  if (!(a && o)) {
    var f = s ? "" : e.markupStyleCreator.makeTooltipMarker(t.markerType, t.markerColor || "#333", n), c = a ? "" : kl(l, "ordinal", u), v = t.valueType, d = o ? [] : h(t.value, t.dataIndex), _ = !s || !a, p = !s && a, g = gp(i, n), m = g.nameStyle, y = g.valueStyle;
    return n === "richText" ? (s ? "" : f) + (a ? "" : yp(e, c, m)) + (o ? "" : MC(e, d, _, p, y)) : Vl(i, (s ? "" : f) + (a ? "" : EC(c, !s, m)) + (o ? "" : AC(d, _, p, y)), r);
  }
}
function rc(e, t, r, i, n, a) {
  if (e) {
    var o = _p(e), s = {
      useUTC: n,
      renderMode: r,
      orderMode: i,
      markupStyleCreator: t,
      valueFormatter: e.valueFormatter
    };
    return o(s, e, 0, a);
  }
}
function DC(e) {
  return {
    html: SC[e],
    richText: TC[e]
  };
}
function Vl(e, t, r) {
  var i = '<div style="clear:both"></div>', n = "margin: " + r + "px 0 0", a = pp(e);
  return '<div style="' + n + ";" + a + ';">' + t + i + "</div>";
}
function EC(e, t, r) {
  var i = t ? "margin-left:2px" : "";
  return '<span style="' + r + ";" + i + '">' + Vt(e) + "</span>";
}
function AC(e, t, r, i) {
  var n = r ? "10px" : "20px", a = t ? "float:right;margin-left:" + n : "";
  return e = k(e) ? e : [e], '<span style="' + a + ";" + i + '">' + Q(e, function(o) {
    return Vt(o);
  }).join("&nbsp;&nbsp;") + "</span>";
}
function yp(e, t, r) {
  return e.markupStyleCreator.wrapRichTextStyle(t, r);
}
function MC(e, t, r, i, n) {
  var a = [n], o = i ? 10 : 20;
  return r && a.push({
    padding: [0, 0, 0, o],
    align: "right"
  }), e.markupStyleCreator.wrapRichTextStyle(k(t) ? t.join("  ") : t, a);
}
function PC(e, t) {
  var r = e.getData().getItemVisual(t, "style"), i = r[e.visualDrawType];
  return Un(i);
}
function wp(e, t) {
  var r = e.get("padding");
  return r ?? (t === "richText" ? [8, 10] : 10);
}
var Hs = (
  /** @class */
  (function() {
    function e() {
      this.richTextStyles = {}, this._nextStyleNameId = Qv();
    }
    return e.prototype._generateStyleName = function() {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    }, e.prototype.makeTooltipMarker = function(t, r, i) {
      var n = i === "richText" ? this._generateStyleName() : null, a = gT({
        color: r,
        type: t,
        renderMode: i,
        markerId: n
      });
      return z(a) ? a : (process.env.NODE_ENV !== "production" && j(n), this.richTextStyles[n] = a.style, a.content);
    }, e.prototype.wrapRichTextStyle = function(t, r) {
      var i = {};
      k(r) ? D(r, function(a) {
        return I(i, a);
      }) : I(i, r);
      var n = this._generateStyleName();
      return this.richTextStyles[n] = i, "{" + n + "|" + t + "}";
    }, e;
  })()
);
function LC(e) {
  var t = e.series, r = e.dataIndex, i = e.multipleSeries, n = t.getData(), a = n.mapDimensionsAll("defaultedTooltip"), o = a.length, s = t.getRawValue(r), l = k(s), u = PC(t, r), h, f, c, v;
  if (o > 1 || l && !o) {
    var d = IC(s, t, r, a, u);
    h = d.inlineValues, f = d.inlineValueTypes, c = d.blocks, v = d.inlineValues[0];
  } else if (o) {
    var _ = n.getDimensionInfo(a[0]);
    v = h = _o(n, r, a[0]), f = _.type;
  } else
    v = h = l ? s[0] : s;
  var p = rd(t), g = p && t.name || "", m = n.getName(r), y = i ? g : m;
  return Wn("section", {
    header: g,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: i || !p,
    sortParam: v,
    blocks: [Wn("nameValue", {
      markerType: "item",
      markerColor: u,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: y,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !Pe(y),
      value: h,
      valueType: f,
      dataIndex: r
    })].concat(c || [])
  });
}
function IC(e, t, r, i, n) {
  var a = t.getData(), o = dr(e, function(f, c, v) {
    var d = a.getDimensionInfo(v);
    return f = f || d && d.tooltip !== !1 && d.displayName != null;
  }, !1), s = [], l = [], u = [];
  i.length ? D(i, function(f) {
    h(_o(a, r, f), f);
  }) : D(e, h);
  function h(f, c) {
    var v = a.getDimensionInfo(c);
    !v || v.otherDims.tooltip === !1 || (o ? u.push(Wn("nameValue", {
      markerType: "subItem",
      markerColor: n,
      name: v.displayName,
      value: f,
      valueType: v.type
    })) : (s.push(f), l.push(v.type)));
  }
  return {
    inlineValues: s,
    inlineValueTypes: l,
    blocks: u
  };
}
var rr = St();
function Ta(e, t) {
  return e.getName(t) || e.getId(t);
}
var RC = "__universalTransitionEnabled", pr = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r._selectedDataIndicesMap = {}, r;
    }
    return t.prototype.init = function(r, i, n) {
      this.seriesIndex = this.componentIndex, this.dataTask = In({
        count: kC,
        reset: NC
      }), this.dataTask.context = {
        model: this
      }, this.mergeDefaultAndTheme(r, n);
      var a = rr(this).sourceManager = new wC(this);
      a.prepareSource();
      var o = this.getInitialData(r, n);
      nc(o, this), this.dataTask.context.data = o, process.env.NODE_ENV !== "production" && j(o, "getInitialData returned invalid data."), rr(this).dataBeforeProcessed = o, ic(this), this._initSelectedMapFromData(o);
    }, t.prototype.mergeDefaultAndTheme = function(r, i) {
      var n = vo(this), a = n ? Zd(r) : {}, o = this.subType;
      nt.hasClass(o) && (o += "Series"), mt(r, i.getTheme().get(this.subType)), mt(r, this.getDefaultOption()), Cl(r, "label", ["show"]), this.fillDataTextStyle(r.data), n && po(r, a, n);
    }, t.prototype.mergeOption = function(r, i) {
      r = mt(this.option, r, !0), this.fillDataTextStyle(r.data);
      var n = vo(this);
      n && po(this.option, r, n);
      var a = rr(this).sourceManager;
      a.dirty(), a.prepareSource();
      var o = this.getInitialData(r, i);
      nc(o, this), this.dataTask.dirty(), this.dataTask.context.data = o, rr(this).dataBeforeProcessed = o, ic(this), this._initSelectedMapFromData(o);
    }, t.prototype.fillDataTextStyle = function(r) {
      if (r && !$t(r))
        for (var i = ["show"], n = 0; n < r.length; n++)
          r[n] && r[n].label && Cl(r[n], "label", i);
    }, t.prototype.getInitialData = function(r, i) {
    }, t.prototype.appendData = function(r) {
      var i = this.getRawData();
      i.appendData(r.data);
    }, t.prototype.getData = function(r) {
      var i = zl(this);
      if (i) {
        var n = i.context.data;
        return r == null || !n.getLinkedData ? n : n.getLinkedData(r);
      } else
        return rr(this).data;
    }, t.prototype.getAllData = function() {
      var r = this.getData();
      return r && r.getLinkedDataAll ? r.getLinkedDataAll() : [{
        data: r
      }];
    }, t.prototype.setData = function(r) {
      var i = zl(this);
      if (i) {
        var n = i.context;
        n.outputData = r, i !== this.dataTask && (n.data = r);
      }
      rr(this).data = r;
    }, t.prototype.getEncode = function() {
      var r = this.get("encode", !0);
      if (r)
        return et(r);
    }, t.prototype.getSourceManager = function() {
      return rr(this).sourceManager;
    }, t.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    }, t.prototype.getRawData = function() {
      return rr(this).dataBeforeProcessed;
    }, t.prototype.getColorBy = function() {
      var r = this.get("colorBy");
      return r || "series";
    }, t.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    }, t.prototype.getBaseAxis = function() {
      var r = this.coordinateSystem;
      return r && r.getBaseAxis && r.getBaseAxis();
    }, t.prototype.formatTooltip = function(r, i, n) {
      return LC({
        series: this,
        dataIndex: r,
        multipleSeries: i
      });
    }, t.prototype.isAnimationEnabled = function() {
      var r = this.ecModel;
      if (V.node && !(r && r.ssr))
        return !1;
      var i = this.getShallow("animation");
      return i && this.getData().count() > this.getShallow("animationThreshold") && (i = !1), !!i;
    }, t.prototype.restoreData = function() {
      this.dataTask.dirty();
    }, t.prototype.getColorFromPalette = function(r, i, n) {
      var a = this.ecModel, o = Nu.prototype.getColorFromPalette.call(this, r, i, n);
      return o || (o = a.getColorFromPalette(r, i, n)), o;
    }, t.prototype.coordDimToDataDim = function(r) {
      return this.getRawData().mapDimensionsAll(r);
    }, t.prototype.getProgressive = function() {
      return this.get("progressive");
    }, t.prototype.getProgressiveThreshold = function() {
      return this.get("progressiveThreshold");
    }, t.prototype.select = function(r, i) {
      this._innerSelect(this.getData(i), r);
    }, t.prototype.unselect = function(r, i) {
      var n = this.option.selectedMap;
      if (n) {
        var a = this.option.selectedMode, o = this.getData(i);
        if (a === "series" || n === "all") {
          this.option.selectedMap = {}, this._selectedDataIndicesMap = {};
          return;
        }
        for (var s = 0; s < r.length; s++) {
          var l = r[s], u = Ta(o, l);
          n[u] = !1, this._selectedDataIndicesMap[u] = -1;
        }
      }
    }, t.prototype.toggleSelect = function(r, i) {
      for (var n = [], a = 0; a < r.length; a++)
        n[0] = r[a], this.isSelected(r[a], i) ? this.unselect(n, i) : this.select(n, i);
    }, t.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all")
        return [].slice.call(this.getData().getIndices());
      for (var r = this._selectedDataIndicesMap, i = pt(r), n = [], a = 0; a < i.length; a++) {
        var o = r[i[a]];
        o >= 0 && n.push(o);
      }
      return n;
    }, t.prototype.isSelected = function(r, i) {
      var n = this.option.selectedMap;
      if (!n)
        return !1;
      var a = this.getData(i);
      return (n === "all" || n[Ta(a, r)]) && !a.getItemModel(r).get(["select", "disabled"]);
    }, t.prototype.isUniversalTransitionEnabled = function() {
      if (this[RC])
        return !0;
      var r = this.option.universalTransition;
      return r ? r === !0 ? !0 : r && r.enabled : !1;
    }, t.prototype._innerSelect = function(r, i) {
      var n, a, o = this.option, s = o.selectedMode, l = i.length;
      if (!(!s || !l)) {
        if (s === "series")
          o.selectedMap = "all";
        else if (s === "multiple") {
          B(o.selectedMap) || (o.selectedMap = {});
          for (var u = o.selectedMap, h = 0; h < l; h++) {
            var f = i[h], c = Ta(r, f);
            u[c] = !0, this._selectedDataIndicesMap[c] = r.getRawIndex(f);
          }
        } else if (s === "single" || s === !0) {
          var v = i[l - 1], c = Ta(r, v);
          o.selectedMap = (n = {}, n[c] = !0, n), this._selectedDataIndicesMap = (a = {}, a[c] = r.getRawIndex(v), a);
        }
      }
    }, t.prototype._initSelectedMapFromData = function(r) {
      if (!this.option.selectedMap) {
        var i = [];
        r.hasItemOption && r.each(function(n) {
          var a = r.getRawDataItem(n);
          a && a.selected && i.push(n);
        }), i.length > 0 && this._innerSelect(r, i);
      }
    }, t.registerClass = function(r) {
      return nt.registerClass(r);
    }, t.protoInitialize = (function() {
      var r = t.prototype;
      r.type = "series.__base__", r.seriesIndex = 0, r.ignoreStyleOnData = !1, r.hasSymbolVisual = !1, r.defaultSymbol = "circle", r.visualStyleAccessPath = "itemStyle", r.visualDrawType = "fill";
    })(), t;
  })(nt)
);
Ke(pr, aC);
Ke(pr, Nu);
ad(pr, nt);
function ic(e) {
  var t = e.name;
  rd(e) || (e.name = OC(e) || t);
}
function OC(e) {
  var t = e.getRawData(), r = t.mapDimensionsAll("seriesName"), i = [];
  return D(r, function(n) {
    var a = t.getDimensionInfo(n);
    a.displayName && i.push(a.displayName);
  }), i.join(" ");
}
function kC(e) {
  return e.model.getRawData().count();
}
function NC(e) {
  var t = e.model;
  return t.setData(t.getRawData().cloneShallow()), $C;
}
function $C(e, t) {
  t.outputData && e.end > t.outputData.count() && t.model.getRawData().cloneShallow(t.outputData);
}
function nc(e, t) {
  D(H0(e.CHANGABLE_METHODS, e.DOWNSAMPLE_METHODS), function(r) {
    e.wrapMethod(r, Jt(BC, t));
  });
}
function BC(e, t) {
  var r = zl(e);
  return r && r.setOutputEnd((t || this).count()), t;
}
function zl(e) {
  var t = (e.ecModel || {}).scheduler, r = t && t.getPipeline(e.uid);
  if (r) {
    var i = r.currentTask;
    if (i) {
      var n = i.agentStubMap;
      n && (i = n.get(e.uid));
    }
    return i;
  }
}
var gr = (
  /** @class */
  (function() {
    function e() {
      this.group = new Ze(), this.uid = Ho("viewComponent");
    }
    return e.prototype.init = function(t, r) {
    }, e.prototype.render = function(t, r, i, n) {
    }, e.prototype.dispose = function(t, r) {
    }, e.prototype.updateView = function(t, r, i, n) {
    }, e.prototype.updateLayout = function(t, r, i, n) {
    }, e.prototype.updateVisual = function(t, r, i, n) {
    }, e.prototype.toggleBlurSeries = function(t, r, i) {
    }, e.prototype.eachRendered = function(t) {
      var r = this.group;
      r && r.traverse(t);
    }, e;
  })()
);
_u(gr);
mu(gr);
function FC() {
  var e = St();
  return function(t) {
    var r = e(t), i = t.pipelineContext, n = !!r.large, a = !!r.progressiveRender, o = r.large = !!(i && i.large), s = r.progressiveRender = !!(i && i.progressiveRender);
    return (n !== o || a !== s) && "reset";
  };
}
var bp = St(), VC = FC(), vr = (
  /** @class */
  (function() {
    function e() {
      this.group = new Ze(), this.uid = Ho("viewChart"), this.renderTask = In({
        plan: zC,
        reset: HC
      }), this.renderTask.context = {
        view: this
      };
    }
    return e.prototype.init = function(t, r) {
    }, e.prototype.render = function(t, r, i, n) {
      if (process.env.NODE_ENV !== "production")
        throw new Error("render method must been implemented");
    }, e.prototype.highlight = function(t, r, i, n) {
      var a = t.getData(n && n.dataType);
      if (!a) {
        process.env.NODE_ENV !== "production" && It("Unknown dataType " + n.dataType);
        return;
      }
      oc(a, n, "emphasis");
    }, e.prototype.downplay = function(t, r, i, n) {
      var a = t.getData(n && n.dataType);
      if (!a) {
        process.env.NODE_ENV !== "production" && It("Unknown dataType " + n.dataType);
        return;
      }
      oc(a, n, "normal");
    }, e.prototype.remove = function(t, r) {
      this.group.removeAll();
    }, e.prototype.dispose = function(t, r) {
    }, e.prototype.updateView = function(t, r, i, n) {
      this.render(t, r, i, n);
    }, e.prototype.updateLayout = function(t, r, i, n) {
      this.render(t, r, i, n);
    }, e.prototype.updateVisual = function(t, r, i, n) {
      this.render(t, r, i, n);
    }, e.prototype.eachRendered = function(t) {
      Fd(this.group, t);
    }, e.markUpdateMethod = function(t, r) {
      bp(t).updateMethod = r;
    }, e.protoInitialize = (function() {
      var t = e.prototype;
      t.type = "chart";
    })(), e;
  })()
);
function ac(e, t, r) {
  e && $i(e) && (t === "emphasis" ? Al : Ml)(e, r);
}
function oc(e, t, r) {
  var i = Qn(e, t), n = t && t.highlightKey != null ? Wb(t.highlightKey) : null;
  i != null ? D(Nt(i), function(a) {
    ac(e.getItemGraphicEl(a), r, n);
  }) : e.eachItemGraphicEl(function(a) {
    ac(a, r, n);
  });
}
_u(vr, ["dispose"]);
mu(vr);
function zC(e) {
  return VC(e.model);
}
function HC(e) {
  var t = e.model, r = e.ecModel, i = e.api, n = e.payload, a = t.pipelineContext.progressiveRender, o = e.view, s = n && bp(n).updateMethod, l = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";
  return l !== "render" && o[l](t, r, i, n), UC[l];
}
var UC = {
  incrementalPrepareRender: {
    progress: function(e, t) {
      t.view.incrementalRender(e, t.model, t.ecModel, t.api, t.payload);
    }
  },
  render: {
    // Put view.render in `progress` to support appendData. But in this case
    // view.render should not be called in reset, otherwise it will be called
    // twise. Use `forceFirstProgress` to make sure that view.render is called
    // in any cases.
    forceFirstProgress: !0,
    progress: function(e, t) {
      t.view.render(t.model, t.ecModel, t.api, t.payload);
    }
  }
}, mo = "\0__throttleOriginMethod", sc = "\0__throttleRate", lc = "\0__throttleType";
function Sp(e, t, r) {
  var i, n = 0, a = 0, o = null, s, l, u, h;
  t = t || 0;
  function f() {
    a = (/* @__PURE__ */ new Date()).getTime(), o = null, e.apply(l, u || []);
  }
  var c = function() {
    for (var v = [], d = 0; d < arguments.length; d++)
      v[d] = arguments[d];
    i = (/* @__PURE__ */ new Date()).getTime(), l = this, u = v;
    var _ = h || t, p = h || r;
    h = null, s = i - (p ? n : a) - _, clearTimeout(o), p ? o = setTimeout(f, _) : s >= 0 ? f() : o = setTimeout(f, -s), n = i;
  };
  return c.clear = function() {
    o && (clearTimeout(o), o = null);
  }, c.debounceNextCall = function(v) {
    h = v;
  }, c;
}
function Tp(e, t, r, i) {
  var n = e[t];
  if (n) {
    var a = n[mo] || n, o = n[lc], s = n[sc];
    if (s !== r || o !== i) {
      if (r == null || !i)
        return e[t] = a;
      n = e[t] = Sp(a, r, i === "debounce"), n[mo] = a, n[lc] = i, n[sc] = r;
    }
    return n;
  }
}
function Hl(e, t) {
  var r = e[t];
  r && r[mo] && (r.clear && r.clear(), e[t] = r[mo]);
}
var uc = St(), hc = {
  itemStyle: Vn(zd, !0),
  lineStyle: Vn(Vd, !0)
}, GC = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function Cp(e, t) {
  var r = e.visualStyleMapper || hc[t];
  return r || (console.warn("Unknown style type '" + t + "'."), hc.itemStyle);
}
function xp(e, t) {
  var r = e.visualDrawType || GC[t];
  return r || (console.warn("Unknown style type '" + t + "'."), "fill");
}
var WC = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData(), i = e.visualStyleAccessPath || "itemStyle", n = e.getModel(i), a = Cp(e, i), o = a(n), s = n.getShallow("decal");
    s && (r.setVisual("decal", s), s.dirty = !0);
    var l = xp(e, i), u = o[l], h = rt(u) ? u : null, f = o.fill === "auto" || o.stroke === "auto";
    if (!o[l] || h || f) {
      var c = e.getColorFromPalette(
        // TODO series count changed.
        e.name,
        null,
        t.getSeriesCount()
      );
      o[l] || (o[l] = c, r.setVisual("colorFromPalette", !0)), o.fill = o.fill === "auto" || rt(o.fill) ? c : o.fill, o.stroke = o.stroke === "auto" || rt(o.stroke) ? c : o.stroke;
    }
    if (r.setVisual("style", o), r.setVisual("drawType", l), !t.isSeriesFiltered(e) && h)
      return r.setVisual("colorFromPalette", !1), {
        dataEach: function(v, d) {
          var _ = e.getDataParams(d), p = I({}, o);
          p[l] = h(_), v.setItemVisual(d, "style", p);
        }
      };
  }
}, on = new dt(), YC = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(e, t) {
    if (!(e.ignoreStyleOnData || t.isSeriesFiltered(e))) {
      var r = e.getData(), i = e.visualStyleAccessPath || "itemStyle", n = Cp(e, i), a = r.getVisual("drawType");
      return {
        dataEach: r.hasItemOption ? function(o, s) {
          var l = o.getRawDataItem(s);
          if (l && l[i]) {
            on.option = l[i];
            var u = n(on), h = o.ensureUniqueItemVisual(s, "style");
            I(h, u), on.option.decal && (o.setItemVisual(s, "decal", on.option.decal), on.option.decal.dirty = !0), a in u && o.setItemVisual(s, "colorFromPalette", !1);
          }
        } : null
      };
    }
  }
}, XC = {
  performRawSeries: !0,
  overallReset: function(e) {
    var t = et();
    e.eachSeries(function(r) {
      var i = r.getColorBy();
      if (!r.isColorBySeries()) {
        var n = r.type + "-" + i, a = t.get(n);
        a || (a = {}, t.set(n, a)), uc(r).scope = a;
      }
    }), e.eachSeries(function(r) {
      if (!(r.isColorBySeries() || e.isSeriesFiltered(r))) {
        var i = r.getRawData(), n = {}, a = r.getData(), o = uc(r).scope, s = r.visualStyleAccessPath || "itemStyle", l = xp(r, s);
        a.each(function(u) {
          var h = a.getRawIndex(u);
          n[h] = u;
        }), i.each(function(u) {
          var h = n[u], f = a.getItemVisual(h, "colorFromPalette");
          if (f) {
            var c = a.ensureUniqueItemVisual(h, "style"), v = i.getName(u) || u + "", d = i.count();
            c[l] = r.getColorFromPalette(v, o, d);
          }
        });
      }
    });
  }
}, Ca = Math.PI;
function qC(e, t) {
  t = t || {}, ht(t, {
    text: "loading",
    textColor: "#000",
    fontSize: 12,
    fontWeight: "normal",
    fontStyle: "normal",
    fontFamily: "sans-serif",
    maskColor: "rgba(255, 255, 255, 0.8)",
    showSpinner: !0,
    color: "#5470c6",
    spinnerRadius: 10,
    lineWidth: 5,
    zlevel: 0
  });
  var r = new Ze(), i = new me({
    style: {
      fill: t.maskColor
    },
    zlevel: t.zlevel,
    z: 1e4
  });
  r.add(i);
  var n = new ye({
    style: {
      text: t.text,
      fill: t.textColor,
      fontSize: t.fontSize,
      fontWeight: t.fontWeight,
      fontStyle: t.fontStyle,
      fontFamily: t.fontFamily
    },
    zlevel: t.zlevel,
    z: 10001
  }), a = new me({
    style: {
      fill: "none"
    },
    textContent: n,
    textConfig: {
      position: "right",
      distance: 10
    },
    zlevel: t.zlevel,
    z: 10001
  });
  r.add(a);
  var o;
  return t.showSpinner && (o = new Vo({
    shape: {
      startAngle: -Ca / 2,
      endAngle: -Ca / 2 + 0.1,
      r: t.spinnerRadius
    },
    style: {
      stroke: t.color,
      lineCap: "round",
      lineWidth: t.lineWidth
    },
    zlevel: t.zlevel,
    z: 10001
  }), o.animateShape(!0).when(1e3, {
    endAngle: Ca * 3 / 2
  }).start("circularInOut"), o.animateShape(!0).when(1e3, {
    startAngle: Ca * 3 / 2
  }).delay(300).start("circularInOut"), r.add(o)), r.resize = function() {
    var s = n.getBoundingRect().width, l = t.showSpinner ? t.spinnerRadius : 0, u = (e.getWidth() - l * 2 - (t.showSpinner && s ? 10 : 0) - s) / 2 - (t.showSpinner && s ? 0 : 5 + s / 2) + (t.showSpinner ? 0 : s / 2) + (s ? 0 : l), h = e.getHeight() / 2;
    t.showSpinner && o.setShape({
      cx: u,
      cy: h
    }), a.setShape({
      x: u - l,
      y: h - l,
      width: l * 2,
      height: l * 2
    }), i.setShape({
      x: 0,
      y: 0,
      width: e.getWidth(),
      height: e.getHeight()
    });
  }, r.resize(), r;
}
var Dp = (
  /** @class */
  (function() {
    function e(t, r, i, n) {
      this._stageTaskMap = et(), this.ecInstance = t, this.api = r, i = this._dataProcessorHandlers = i.slice(), n = this._visualHandlers = n.slice(), this._allHandlers = i.concat(n);
    }
    return e.prototype.restoreData = function(t, r) {
      t.restoreData(r), this._stageTaskMap.each(function(i) {
        var n = i.overallTask;
        n && n.dirty();
      });
    }, e.prototype.getPerformArgs = function(t, r) {
      if (t.__pipeline) {
        var i = this._pipelineMap.get(t.__pipeline.id), n = i.context, a = !r && i.progressiveEnabled && (!n || n.progressiveRender) && t.__idxInPipeline > i.blockIndex, o = a ? i.step : null, s = n && n.modDataCount, l = s != null ? Math.ceil(s / o) : null;
        return {
          step: o,
          modBy: l,
          modDataCount: s
        };
      }
    }, e.prototype.getPipeline = function(t) {
      return this._pipelineMap.get(t);
    }, e.prototype.updateStreamModes = function(t, r) {
      var i = this._pipelineMap.get(t.uid), n = t.getData(), a = n.count(), o = i.progressiveEnabled && r.incrementalPrepareRender && a >= i.threshold, s = t.get("large") && a >= t.get("largeThreshold"), l = t.get("progressiveChunkMode") === "mod" ? a : null;
      t.pipelineContext = i.context = {
        progressiveRender: o,
        modDataCount: l,
        large: s
      };
    }, e.prototype.restorePipelines = function(t) {
      var r = this, i = r._pipelineMap = et();
      t.eachSeries(function(n) {
        var a = n.getProgressive(), o = n.uid;
        i.set(o, {
          id: o,
          head: null,
          tail: null,
          threshold: n.getProgressiveThreshold(),
          progressiveEnabled: a && !(n.preventIncremental && n.preventIncremental()),
          blockIndex: -1,
          step: Math.round(a || 700),
          count: 0
        }), r._pipe(n, n.dataTask);
      });
    }, e.prototype.prepareStageTasks = function() {
      var t = this._stageTaskMap, r = this.api.getModel(), i = this.api;
      D(this._allHandlers, function(n) {
        var a = t.get(n.uid) || t.set(n.uid, {}), o = "";
        process.env.NODE_ENV !== "production" && (o = '"reset" and "overallReset" must not be both specified.'), j(!(n.reset && n.overallReset), o), n.reset && this._createSeriesStageTask(n, a, r, i), n.overallReset && this._createOverallStageTask(n, a, r, i);
      }, this);
    }, e.prototype.prepareView = function(t, r, i, n) {
      var a = t.renderTask, o = a.context;
      o.model = r, o.ecModel = i, o.api = n, a.__block = !t.incrementalPrepareRender, this._pipe(r, a);
    }, e.prototype.performDataProcessorTasks = function(t, r) {
      this._performStageTasks(this._dataProcessorHandlers, t, r, {
        block: !0
      });
    }, e.prototype.performVisualTasks = function(t, r, i) {
      this._performStageTasks(this._visualHandlers, t, r, i);
    }, e.prototype._performStageTasks = function(t, r, i, n) {
      n = n || {};
      var a = !1, o = this;
      D(t, function(l, u) {
        if (!(n.visualType && n.visualType !== l.visualType)) {
          var h = o._stageTaskMap.get(l.uid), f = h.seriesTaskMap, c = h.overallTask;
          if (c) {
            var v, d = c.agentStubMap;
            d.each(function(p) {
              s(n, p) && (p.dirty(), v = !0);
            }), v && c.dirty(), o.updatePayload(c, i);
            var _ = o.getPerformArgs(c, n.block);
            d.each(function(p) {
              p.perform(_);
            }), c.perform(_) && (a = !0);
          } else f && f.each(function(p, g) {
            s(n, p) && p.dirty();
            var m = o.getPerformArgs(p, n.block);
            m.skip = !l.performRawSeries && r.isSeriesFiltered(p.context.model), o.updatePayload(p, i), p.perform(m) && (a = !0);
          });
        }
      });
      function s(l, u) {
        return l.setDirty && (!l.dirtyMap || l.dirtyMap.get(u.__pipeline.id));
      }
      this.unfinished = a || this.unfinished;
    }, e.prototype.performSeriesTasks = function(t) {
      var r;
      t.eachSeries(function(i) {
        r = i.dataTask.perform() || r;
      }), this.unfinished = r || this.unfinished;
    }, e.prototype.plan = function() {
      this._pipelineMap.each(function(t) {
        var r = t.tail;
        do {
          if (r.__block) {
            t.blockIndex = r.__idxInPipeline;
            break;
          }
          r = r.getUpstream();
        } while (r);
      });
    }, e.prototype.updatePayload = function(t, r) {
      r !== "remain" && (t.context.payload = r);
    }, e.prototype._createSeriesStageTask = function(t, r, i, n) {
      var a = this, o = r.seriesTaskMap, s = r.seriesTaskMap = et(), l = t.seriesType, u = t.getTargetSeries;
      t.createOnAllSeries ? i.eachRawSeries(h) : l ? i.eachRawSeriesByType(l, h) : u && u(i, n).each(h);
      function h(f) {
        var c = f.uid, v = s.set(c, o && o.get(c) || In({
          plan: JC,
          reset: tx,
          count: rx
        }));
        v.context = {
          model: f,
          ecModel: i,
          api: n,
          // PENDING: `useClearVisual` not used?
          useClearVisual: t.isVisual && !t.isLayout,
          plan: t.plan,
          reset: t.reset,
          scheduler: a
        }, a._pipe(f, v);
      }
    }, e.prototype._createOverallStageTask = function(t, r, i, n) {
      var a = this, o = r.overallTask = r.overallTask || In({
        reset: ZC
      });
      o.context = {
        ecModel: i,
        api: n,
        overallReset: t.overallReset,
        scheduler: a
      };
      var s = o.agentStubMap, l = o.agentStubMap = et(), u = t.seriesType, h = t.getTargetSeries, f = !0, c = !1, v = "";
      process.env.NODE_ENV !== "production" && (v = '"createOnAllSeries" is not supported for "overallReset", because it will block all streams.'), j(!t.createOnAllSeries, v), u ? i.eachRawSeriesByType(u, d) : h ? h(i, n).each(d) : (f = !1, D(i.getSeries(), d));
      function d(_) {
        var p = _.uid, g = l.set(p, s && s.get(p) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (c = !0, In({
          reset: KC,
          onDirty: QC
        })));
        g.context = {
          model: _,
          overallProgress: f
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        }, g.agent = o, g.__block = f, a._pipe(_, g);
      }
      c && o.dirty();
    }, e.prototype._pipe = function(t, r) {
      var i = t.uid, n = this._pipelineMap.get(i);
      !n.head && (n.head = r), n.tail && n.tail.pipe(r), n.tail = r, r.__idxInPipeline = n.count++, r.__pipeline = n;
    }, e.wrapStageHandler = function(t, r) {
      return rt(t) && (t = {
        overallReset: t,
        seriesType: ix(t)
      }), t.uid = Ho("stageHandler"), r && (t.visualType = r), t;
    }, e;
  })()
);
function ZC(e) {
  e.overallReset(e.ecModel, e.api, e.payload);
}
function KC(e) {
  return e.overallProgress && jC;
}
function jC() {
  this.agent.dirty(), this.getDownstream().dirty();
}
function QC() {
  this.agent && this.agent.dirty();
}
function JC(e) {
  return e.plan ? e.plan(e.model, e.ecModel, e.api, e.payload) : null;
}
function tx(e) {
  e.useClearVisual && e.data.clearAllVisual();
  var t = e.resetDefines = Nt(e.reset(e.model, e.ecModel, e.api, e.payload));
  return t.length > 1 ? Q(t, function(r, i) {
    return Ep(i);
  }) : ex;
}
var ex = Ep(0);
function Ep(e) {
  return function(t, r) {
    var i = r.data, n = r.resetDefines[e];
    if (n && n.dataEach)
      for (var a = t.start; a < t.end; a++)
        n.dataEach(i, a);
    else n && n.progress && n.progress(t, i);
  };
}
function rx(e) {
  return e.data.count();
}
function ix(e) {
  yo = null;
  try {
    e(Yn, Ap);
  } catch {
  }
  return yo;
}
var Yn = {}, Ap = {}, yo;
Mp(Yn, $u);
Mp(Ap, ep);
Yn.eachSeriesByType = Yn.eachRawSeriesByType = function(e) {
  yo = e;
};
Yn.eachComponent = function(e) {
  e.mainType === "series" && e.subType && (yo = e.subType);
};
function Mp(e, t) {
  for (var r in t.prototype)
    e[r] = Gt;
}
var fc = ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"];
const nx = {
  color: fc,
  colorLayer: [["#37A2DA", "#ffd85c", "#fd7b5f"], ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f", "#E062AE", "#9d96f5"], ["#37A2DA", "#32C5E9", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378EA", "#96BFFF"], fc]
};
var Pt = "#B9B8CE", cc = "#100C2A", xa = function() {
  return {
    axisLine: {
      lineStyle: {
        color: Pt
      }
    },
    splitLine: {
      lineStyle: {
        color: "#484753"
      }
    },
    splitArea: {
      areaStyle: {
        color: ["rgba(255,255,255,0.02)", "rgba(255,255,255,0.05)"]
      }
    },
    minorSplitLine: {
      lineStyle: {
        color: "#20203B"
      }
    }
  };
}, vc = ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9", "#05c091", "#ff8a45", "#8d48e3", "#dd79ff"], Pp = {
  darkMode: !0,
  color: vc,
  backgroundColor: cc,
  axisPointer: {
    lineStyle: {
      color: "#817f91"
    },
    crossStyle: {
      color: "#817f91"
    },
    label: {
      // TODO Contrast of label backgorundColor
      color: "#fff"
    }
  },
  legend: {
    textStyle: {
      color: Pt
    },
    pageTextStyle: {
      color: Pt
    }
  },
  textStyle: {
    color: Pt
  },
  title: {
    textStyle: {
      color: "#EEF1FA"
    },
    subtextStyle: {
      color: "#B9B8CE"
    }
  },
  toolbox: {
    iconStyle: {
      borderColor: Pt
    }
  },
  dataZoom: {
    borderColor: "#71708A",
    textStyle: {
      color: Pt
    },
    brushStyle: {
      color: "rgba(135,163,206,0.3)"
    },
    handleStyle: {
      color: "#353450",
      borderColor: "#C5CBE3"
    },
    moveHandleStyle: {
      color: "#B0B6C3",
      opacity: 0.3
    },
    fillerColor: "rgba(135,163,206,0.2)",
    emphasis: {
      handleStyle: {
        borderColor: "#91B7F2",
        color: "#4D587D"
      },
      moveHandleStyle: {
        color: "#636D9A",
        opacity: 0.7
      }
    },
    dataBackground: {
      lineStyle: {
        color: "#71708A",
        width: 1
      },
      areaStyle: {
        color: "#71708A"
      }
    },
    selectedDataBackground: {
      lineStyle: {
        color: "#87A3CE"
      },
      areaStyle: {
        color: "#87A3CE"
      }
    }
  },
  visualMap: {
    textStyle: {
      color: Pt
    }
  },
  timeline: {
    lineStyle: {
      color: Pt
    },
    label: {
      color: Pt
    },
    controlStyle: {
      color: Pt,
      borderColor: Pt
    }
  },
  calendar: {
    itemStyle: {
      color: cc
    },
    dayLabel: {
      color: Pt
    },
    monthLabel: {
      color: Pt
    },
    yearLabel: {
      color: Pt
    }
  },
  timeAxis: xa(),
  logAxis: xa(),
  valueAxis: xa(),
  categoryAxis: xa(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: vc
  },
  gauge: {
    title: {
      color: Pt
    },
    axisLine: {
      lineStyle: {
        color: [[1, "rgba(207,212,219,0.2)"]]
      }
    },
    axisLabel: {
      color: Pt
    },
    detail: {
      color: "#EEF1FA"
    }
  },
  candlestick: {
    itemStyle: {
      color: "#f64e56",
      color0: "#54ea92",
      borderColor: "#f64e56",
      borderColor0: "#54ea92"
      // borderColor: '#ca2824',
      // borderColor0: '#09a443'
    }
  }
};
Pp.categoryAxis.splitLine.show = !1;
var ax = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.normalizeQuery = function(t) {
      var r = {}, i = {}, n = {};
      if (z(t)) {
        var a = Le(t);
        r.mainType = a.main || null, r.subType = a.sub || null;
      } else {
        var o = ["Index", "Name", "Id"], s = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        D(t, function(l, u) {
          for (var h = !1, f = 0; f < o.length; f++) {
            var c = o[f], v = u.lastIndexOf(c);
            if (v > 0 && v === u.length - c.length) {
              var d = u.slice(0, v);
              d !== "data" && (r.mainType = d, r[c.toLowerCase()] = l, h = !0);
            }
          }
          s.hasOwnProperty(u) && (i[u] = l, h = !0), h || (n[u] = l);
        });
      }
      return {
        cptQuery: r,
        dataQuery: i,
        otherQuery: n
      };
    }, e.prototype.filter = function(t, r) {
      var i = this.eventInfo;
      if (!i)
        return !0;
      var n = i.targetEl, a = i.packedEvent, o = i.model, s = i.view;
      if (!o || !s)
        return !0;
      var l = r.cptQuery, u = r.dataQuery;
      return h(l, o, "mainType") && h(l, o, "subType") && h(l, o, "index", "componentIndex") && h(l, o, "name") && h(l, o, "id") && h(u, a, "name") && h(u, a, "dataIndex") && h(u, a, "dataType") && (!s.filterForExposedEvent || s.filterForExposedEvent(t, r.otherQuery, n, a));
      function h(f, c, v, d) {
        return f[v] == null || c[d || v] === f[v];
      }
    }, e.prototype.afterTrigger = function() {
      this.eventInfo = null;
    }, e;
  })()
), Ul = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"], dc = Ul.concat(["symbolKeepAspect"]), ox = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData();
    if (e.legendIcon && r.setVisual("legendIcon", e.legendIcon), !e.hasSymbolVisual)
      return;
    for (var i = {}, n = {}, a = !1, o = 0; o < Ul.length; o++) {
      var s = Ul[o], l = e.get(s);
      rt(l) ? (a = !0, n[s] = l) : i[s] = l;
    }
    if (i.symbol = i.symbol || e.defaultSymbol, r.setVisual(I({
      legendIcon: e.legendIcon || i.symbol,
      symbolKeepAspect: e.get("symbolKeepAspect")
    }, i)), t.isSeriesFiltered(e))
      return;
    var u = pt(n);
    function h(f, c) {
      for (var v = e.getRawValue(c), d = e.getDataParams(c), _ = 0; _ < u.length; _++) {
        var p = u[_];
        f.setItemVisual(c, p, n[p](v, d));
      }
    }
    return {
      dataEach: a ? h : null
    };
  }
}, sx = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    if (!e.hasSymbolVisual || t.isSeriesFiltered(e))
      return;
    var r = e.getData();
    function i(n, a) {
      for (var o = n.getItemModel(a), s = 0; s < dc.length; s++) {
        var l = dc[s], u = o.getShallow(l, !0);
        u != null && n.setItemVisual(a, l, u);
      }
    }
    return {
      dataEach: r.hasItemOption ? i : null
    };
  }
};
function lx(e, t, r) {
  switch (r) {
    case "color":
      var i = e.getItemVisual(t, "style");
      return i[e.getVisual("drawType")];
    case "opacity":
      return e.getItemVisual(t, "style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getItemVisual(t, r);
    default:
      process.env.NODE_ENV !== "production" && console.warn("Unknown visual type " + r);
  }
}
function ux(e, t) {
  switch (t) {
    case "color":
      var r = e.getVisual("style");
      return r[e.getVisual("drawType")];
    case "opacity":
      return e.getVisual("style").opacity;
    case "symbol":
    case "symbolSize":
    case "liftZ":
      return e.getVisual(t);
    default:
      process.env.NODE_ENV !== "production" && console.warn("Unknown visual type " + t);
  }
}
function hx(e, t) {
  function r(i, n) {
    var a = [];
    return i.eachComponent({
      mainType: "series",
      subType: e,
      query: n
    }, function(o) {
      a.push(o.seriesIndex);
    }), a;
  }
  D([[e + "ToggleSelect", "toggleSelect"], [e + "Select", "select"], [e + "UnSelect", "unselect"]], function(i) {
    t(i[0], function(n, a, o) {
      n = I({}, n), process.env.NODE_ENV !== "production" && bt(n.type, i[1]), o.dispatchAction(I(n, {
        type: i[1],
        seriesIndex: r(a, n)
      }));
    });
  });
}
function vi(e, t, r, i, n) {
  var a = e + t;
  r.isSilent(a) || (process.env.NODE_ENV !== "production" && Oe("event " + a + " is deprecated."), i.eachComponent({
    mainType: "series",
    subType: "pie"
  }, function(o) {
    for (var s = o.seriesIndex, l = o.option.selectedMap, u = n.selected, h = 0; h < u.length; h++)
      if (u[h].seriesIndex === s) {
        var f = o.getData(), c = Qn(f, n.fromActionPayload);
        r.trigger(a, {
          type: a,
          seriesId: o.id,
          name: k(c) ? f.getName(c[0]) : f.getName(c),
          selected: z(l) ? l : I({}, l)
        });
      }
  }));
}
function fx(e, t, r) {
  e.on("selectchanged", function(i) {
    var n = r.getModel();
    i.isFromClick ? (vi("map", "selectchanged", t, n, i), vi("pie", "selectchanged", t, n, i)) : i.fromAction === "select" ? (vi("map", "selected", t, n, i), vi("pie", "selected", t, n, i)) : i.fromAction === "unselect" && (vi("map", "unselected", t, n, i), vi("pie", "unselected", t, n, i));
  });
}
function wn(e, t, r) {
  for (var i; e && !(t(e) && (i = e, r)); )
    e = e.__hostTarget || e.parent;
  return i;
}
var cx = Math.round(Math.random() * 9), vx = typeof Object.defineProperty == "function", dx = (function() {
  function e() {
    this._id = "__ec_inner_" + cx++;
  }
  return e.prototype.get = function(t) {
    return this._guard(t)[this._id];
  }, e.prototype.set = function(t, r) {
    var i = this._guard(t);
    return vx ? Object.defineProperty(i, this._id, {
      value: r,
      enumerable: !1,
      configurable: !0
    }) : i[this._id] = r, this;
  }, e.prototype.delete = function(t) {
    return this.has(t) ? (delete this._guard(t)[this._id], !0) : !1;
  }, e.prototype.has = function(t) {
    return !!this._guard(t)[this._id];
  }, e.prototype._guard = function(t) {
    if (t !== Object(t))
      throw TypeError("Value of WeakMap is not a non-null object.");
    return t;
  }, e;
})(), px = ot.extend({
  type: "triangle",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.cx, i = t.cy, n = t.width / 2, a = t.height / 2;
    e.moveTo(r, i - a), e.lineTo(r + n, i + a), e.lineTo(r - n, i + a), e.closePath();
  }
}), gx = ot.extend({
  type: "diamond",
  shape: {
    cx: 0,
    cy: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.cx, i = t.cy, n = t.width / 2, a = t.height / 2;
    e.moveTo(r, i - a), e.lineTo(r + n, i), e.lineTo(r, i + a), e.lineTo(r - n, i), e.closePath();
  }
}), _x = ot.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.x, i = t.y, n = t.width / 5 * 3, a = Math.max(n, t.height), o = n / 2, s = o * o / (a - o), l = i - a + o + s, u = Math.asin(s / o), h = Math.cos(u) * o, f = Math.sin(u), c = Math.cos(u), v = o * 0.6, d = o * 0.7;
    e.moveTo(r - h, l + s), e.arc(r, l, o, Math.PI - u, Math.PI * 2 + u), e.bezierCurveTo(r + h - f * v, l + s + c * v, r, i - d, r, i), e.bezierCurveTo(r, i - d, r - h + f * v, l + s + c * v, r - h, l + s), e.closePath();
  }
}), mx = ot.extend({
  type: "arrow",
  shape: {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.height, i = t.width, n = t.x, a = t.y, o = i / 3 * 2;
    e.moveTo(n, a), e.lineTo(n + o, a + r), e.lineTo(n, a + r / 4 * 3), e.lineTo(n - o, a + r), e.lineTo(n, a), e.closePath();
  }
}), yx = {
  line: Hi,
  rect: me,
  roundRect: me,
  square: me,
  circle: Fo,
  diamond: gx,
  pin: _x,
  arrow: mx,
  triangle: px
}, bx = {
  line: function(e, t, r, i, n) {
    n.x1 = e, n.y1 = t + i / 2, n.x2 = e + r, n.y2 = t + i / 2;
  },
  rect: function(e, t, r, i, n) {
    n.x = e, n.y = t, n.width = r, n.height = i;
  },
  roundRect: function(e, t, r, i, n) {
    n.x = e, n.y = t, n.width = r, n.height = i, n.r = Math.min(r, i) / 4;
  },
  square: function(e, t, r, i, n) {
    var a = Math.min(r, i);
    n.x = e, n.y = t, n.width = a, n.height = a;
  },
  circle: function(e, t, r, i, n) {
    n.cx = e + r / 2, n.cy = t + i / 2, n.r = Math.min(r, i) / 2;
  },
  diamond: function(e, t, r, i, n) {
    n.cx = e + r / 2, n.cy = t + i / 2, n.width = r, n.height = i;
  },
  pin: function(e, t, r, i, n) {
    n.x = e + r / 2, n.y = t + i / 2, n.width = r, n.height = i;
  },
  arrow: function(e, t, r, i, n) {
    n.x = e + r / 2, n.y = t + i / 2, n.width = r, n.height = i;
  },
  triangle: function(e, t, r, i, n) {
    n.cx = e + r / 2, n.cy = t + i / 2, n.width = r, n.height = i;
  }
}, Gl = {};
D(yx, function(e, t) {
  Gl[t] = new e();
});
var Sx = ot.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(e, t, r) {
    var i = Yv(e, t, r), n = this.shape;
    return n && n.symbolType === "pin" && t.position === "inside" && (i.y = r.y + r.height * 0.4), i;
  },
  buildPath: function(e, t, r) {
    var i = t.symbolType;
    if (i !== "none") {
      var n = Gl[i];
      n || (i = "rect", n = Gl[i]), bx[i](t.x, t.y, t.width, t.height, n.shape), n.buildPath(e, n.shape, r);
    }
  }
});
function Tx(e, t) {
  if (this.type !== "image") {
    var r = this.style;
    this.__isEmptyBrush ? (r.stroke = e, r.fill = t || "#fff", r.lineWidth = 2) : this.shape.symbolType === "line" ? r.stroke = e : r.fill = e, this.markRedraw();
  }
}
function Lp(e, t, r, i, n, a, o) {
  var s = e.indexOf("empty") === 0;
  s && (e = e.substr(5, 1).toLowerCase() + e.substr(6));
  var l;
  return e.indexOf("image://") === 0 ? l = Od(e.slice(8), new at(t, r, i, n), o ? "center" : "cover") : e.indexOf("path://") === 0 ? l = Mu(e.slice(7), {}, new at(t, r, i, n), o ? "center" : "cover") : l = new Sx({
    shape: {
      symbolType: e,
      x: t,
      y: r,
      width: i,
      height: n
    }
  }), l.__isEmptyBrush = s, l.setColor = Tx, a && l.setColor(a), l;
}
function Cx(e, t) {
  if (e != null)
    return k(e) || (e = [e, e]), [wt(e[0], t[0]) || 0, wt(X(e[1], e[0]), t[1]) || 0];
}
function Ur(e) {
  return isFinite(e);
}
function xx(e, t, r) {
  var i = t.x == null ? 0 : t.x, n = t.x2 == null ? 1 : t.x2, a = t.y == null ? 0 : t.y, o = t.y2 == null ? 0 : t.y2;
  t.global || (i = i * r.width + r.x, n = n * r.width + r.x, a = a * r.height + r.y, o = o * r.height + r.y), i = Ur(i) ? i : 0, n = Ur(n) ? n : 1, a = Ur(a) ? a : 0, o = Ur(o) ? o : 0;
  var s = e.createLinearGradient(i, a, n, o);
  return s;
}
function Dx(e, t, r) {
  var i = r.width, n = r.height, a = Math.min(i, n), o = t.x == null ? 0.5 : t.x, s = t.y == null ? 0.5 : t.y, l = t.r == null ? 0.5 : t.r;
  t.global || (o = o * i + r.x, s = s * n + r.y, l = l * a), o = Ur(o) ? o : 0.5, s = Ur(s) ? s : 0.5, l = l >= 0 && Ur(l) ? l : 0.5;
  var u = e.createRadialGradient(o, s, 0, o, s, l);
  return u;
}
function Wl(e, t, r) {
  for (var i = t.type === "radial" ? Dx(e, t, r) : xx(e, t, r), n = t.colorStops, a = 0; a < n.length; a++)
    i.addColorStop(n[a].offset, n[a].color);
  return i;
}
function Ex(e, t) {
  if (e === t || !e && !t)
    return !1;
  if (!e || !t || e.length !== t.length)
    return !0;
  for (var r = 0; r < e.length; r++)
    if (e[r] !== t[r])
      return !0;
  return !1;
}
function Da(e) {
  return parseInt(e, 10);
}
function Ea(e, t, r) {
  var i = ["width", "height"][t], n = ["clientWidth", "clientHeight"][t], a = ["paddingLeft", "paddingTop"][t], o = ["paddingRight", "paddingBottom"][t];
  if (r[i] != null && r[i] !== "auto")
    return parseFloat(r[i]);
  var s = document.defaultView.getComputedStyle(e);
  return (e[n] || Da(s[i]) || Da(e.style[i])) - (Da(s[a]) || 0) - (Da(s[o]) || 0) | 0;
}
function Ax(e, t) {
  return !e || e === "solid" || !(t > 0) ? null : e === "dashed" ? [4 * t, 2 * t] : e === "dotted" ? [t] : yt(e) ? [e] : k(e) ? e : null;
}
function Ip(e) {
  var t = e.style, r = t.lineDash && t.lineWidth > 0 && Ax(t.lineDash, t.lineWidth), i = t.lineDashOffset;
  if (r) {
    var n = t.strokeNoScale && e.getLineScale ? e.getLineScale() : 1;
    n && n !== 1 && (r = Q(r, function(a) {
      return a / n;
    }), i /= n);
  }
  return [r, i];
}
var Mx = new Ni(!0);
function wo(e) {
  var t = e.stroke;
  return !(t == null || t === "none" || !(e.lineWidth > 0));
}
function pc(e) {
  return typeof e == "string" && e !== "none";
}
function bo(e) {
  var t = e.fill;
  return t != null && t !== "none";
}
function gc(e, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.fillOpacity * t.opacity, e.fill(), e.globalAlpha = r;
  } else
    e.fill();
}
function _c(e, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.strokeOpacity * t.opacity, e.stroke(), e.globalAlpha = r;
  } else
    e.stroke();
}
function Yl(e, t, r) {
  var i = od(t.image, t.__image, r);
  if (No(i)) {
    var n = e.createPattern(i, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && n && n.setTransform) {
      var a = new DOMMatrix();
      a.translateSelf(t.x || 0, t.y || 0), a.rotateSelf(0, 0, (t.rotation || 0) * U0), a.scaleSelf(t.scaleX || 1, t.scaleY || 1), n.setTransform(a);
    }
    return n;
  }
}
function Px(e, t, r, i) {
  var n, a = wo(r), o = bo(r), s = r.strokePercent, l = s < 1, u = !t.path;
  (!t.silent || l) && u && t.createPathProxy();
  var h = t.path || Mx, f = t.__dirty;
  if (!i) {
    var c = r.fill, v = r.stroke, d = o && !!c.colorStops, _ = a && !!v.colorStops, p = o && !!c.image, g = a && !!v.image, m = void 0, y = void 0, w = void 0, S = void 0, b = void 0;
    (d || _) && (b = t.getBoundingRect()), d && (m = f ? Wl(e, c, b) : t.__canvasFillGradient, t.__canvasFillGradient = m), _ && (y = f ? Wl(e, v, b) : t.__canvasStrokeGradient, t.__canvasStrokeGradient = y), p && (w = f || !t.__canvasFillPattern ? Yl(e, c, t) : t.__canvasFillPattern, t.__canvasFillPattern = w), g && (S = f || !t.__canvasStrokePattern ? Yl(e, v, t) : t.__canvasStrokePattern, t.__canvasStrokePattern = w), d ? e.fillStyle = m : p && (w ? e.fillStyle = w : o = !1), _ ? e.strokeStyle = y : g && (S ? e.strokeStyle = S : a = !1);
  }
  var T = t.getGlobalScale();
  h.setScale(T[0], T[1], t.segmentIgnoreThreshold);
  var C, x;
  e.setLineDash && r.lineDash && (n = Ip(t), C = n[0], x = n[1]);
  var E = !0;
  (u || f & _i) && (h.setDPR(e.dpr), l ? h.setContext(null) : (h.setContext(e), E = !1), h.reset(), t.buildPath(h, t.shape, i), h.toStatic(), t.pathUpdated()), E && h.rebuildPath(e, l ? s : 1), C && (e.setLineDash(C), e.lineDashOffset = x), i || (r.strokeFirst ? (a && _c(e, r), o && gc(e, r)) : (o && gc(e, r), a && _c(e, r))), C && e.setLineDash([]);
}
function Lx(e, t, r) {
  var i = t.__image = od(r.image, t.__image, t, t.onload);
  if (!(!i || !No(i))) {
    var n = r.x || 0, a = r.y || 0, o = t.getWidth(), s = t.getHeight(), l = i.width / i.height;
    if (o == null && s != null ? o = s * l : s == null && o != null ? s = o / l : o == null && s == null && (o = i.width, s = i.height), r.sWidth && r.sHeight) {
      var u = r.sx || 0, h = r.sy || 0;
      e.drawImage(i, u, h, r.sWidth, r.sHeight, n, a, o, s);
    } else if (r.sx && r.sy) {
      var u = r.sx, h = r.sy, f = o - u, c = s - h;
      e.drawImage(i, u, h, f, c, n, a, o, s);
    } else
      e.drawImage(i, n, a, o, s);
  }
}
function Ix(e, t, r) {
  var i, n = r.text;
  if (n != null && (n += ""), n) {
    e.font = r.font || Kr, e.textAlign = r.textAlign, e.textBaseline = r.textBaseline;
    var a = void 0, o = void 0;
    e.setLineDash && r.lineDash && (i = Ip(t), a = i[0], o = i[1]), a && (e.setLineDash(a), e.lineDashOffset = o), r.strokeFirst ? (wo(r) && e.strokeText(n, r.x, r.y), bo(r) && e.fillText(n, r.x, r.y)) : (bo(r) && e.fillText(n, r.x, r.y), wo(r) && e.strokeText(n, r.x, r.y)), a && e.setLineDash([]);
  }
}
var mc = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"], yc = [
  ["lineCap", "butt"],
  ["lineJoin", "miter"],
  ["miterLimit", 10]
];
function Rp(e, t, r, i, n) {
  var a = !1;
  if (!i && (r = r || {}, t === r))
    return !1;
  if (i || t.opacity !== r.opacity) {
    Ut(e, n), a = !0;
    var o = Math.max(Math.min(t.opacity, 1), 0);
    e.globalAlpha = isNaN(o) ? Yr.opacity : o;
  }
  (i || t.blend !== r.blend) && (a || (Ut(e, n), a = !0), e.globalCompositeOperation = t.blend || Yr.blend);
  for (var s = 0; s < mc.length; s++) {
    var l = mc[s];
    (i || t[l] !== r[l]) && (a || (Ut(e, n), a = !0), e[l] = e.dpr * (t[l] || 0));
  }
  return (i || t.shadowColor !== r.shadowColor) && (a || (Ut(e, n), a = !0), e.shadowColor = t.shadowColor || Yr.shadowColor), a;
}
function wc(e, t, r, i, n) {
  var a = Xn(t, n.inHover), o = i ? null : r && Xn(r, n.inHover) || {};
  if (a === o)
    return !1;
  var s = Rp(e, a, o, i, n);
  if ((i || a.fill !== o.fill) && (s || (Ut(e, n), s = !0), pc(a.fill) && (e.fillStyle = a.fill)), (i || a.stroke !== o.stroke) && (s || (Ut(e, n), s = !0), pc(a.stroke) && (e.strokeStyle = a.stroke)), (i || a.opacity !== o.opacity) && (s || (Ut(e, n), s = !0), e.globalAlpha = a.opacity == null ? 1 : a.opacity), t.hasStroke()) {
    var l = a.lineWidth, u = l / (a.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    e.lineWidth !== u && (s || (Ut(e, n), s = !0), e.lineWidth = u);
  }
  for (var h = 0; h < yc.length; h++) {
    var f = yc[h], c = f[0];
    (i || a[c] !== o[c]) && (s || (Ut(e, n), s = !0), e[c] = a[c] || f[1]);
  }
  return s;
}
function Rx(e, t, r, i, n) {
  return Rp(e, Xn(t, n.inHover), r && Xn(r, n.inHover), i, n);
}
function Op(e, t) {
  var r = t.transform, i = e.dpr || 1;
  r ? e.setTransform(i * r[0], i * r[1], i * r[2], i * r[3], i * r[4], i * r[5]) : e.setTransform(i, 0, 0, i, 0, 0);
}
function Ox(e, t, r) {
  for (var i = !1, n = 0; n < e.length; n++) {
    var a = e[n];
    i = i || a.isZeroArea(), Op(t, a), t.beginPath(), a.buildPath(t, a.shape), t.clip();
  }
  r.allClipped = i;
}
function kx(e, t) {
  return e && t ? e[0] !== t[0] || e[1] !== t[1] || e[2] !== t[2] || e[3] !== t[3] || e[4] !== t[4] || e[5] !== t[5] : !(!e && !t);
}
var bc = 1, Sc = 2, Tc = 3, Cc = 4;
function Nx(e) {
  var t = bo(e), r = wo(e);
  return !(e.lineDash || !(+t ^ +r) || t && typeof e.fill != "string" || r && typeof e.stroke != "string" || e.strokePercent < 1 || e.strokeOpacity < 1 || e.fillOpacity < 1);
}
function Ut(e, t) {
  t.batchFill && e.fill(), t.batchStroke && e.stroke(), t.batchFill = "", t.batchStroke = "";
}
function Xn(e, t) {
  return t && e.__hoverStyle || e.style;
}
function kp(e, t) {
  Gr(e, t, { inHover: !1, viewWidth: 0, viewHeight: 0 }, !0);
}
function Gr(e, t, r, i) {
  var n = t.transform;
  if (!t.shouldBePainted(r.viewWidth, r.viewHeight, !1, !1)) {
    t.__dirty &= ~Qt, t.__isRendered = !1;
    return;
  }
  var a = t.__clipPaths, o = r.prevElClipPaths, s = !1, l = !1;
  if ((!o || Ex(a, o)) && (o && o.length && (Ut(e, r), e.restore(), l = s = !0, r.prevElClipPaths = null, r.allClipped = !1, r.prevEl = null), a && a.length && (Ut(e, r), e.save(), Ox(a, e, r), s = !0), r.prevElClipPaths = a), r.allClipped) {
    t.__isRendered = !1;
    return;
  }
  t.beforeBrush && t.beforeBrush(), t.innerBeforeBrush();
  var u = r.prevEl;
  u || (l = s = !0);
  var h = t instanceof ot && t.autoBatch && Nx(t.style);
  s || kx(n, u.transform) ? (Ut(e, r), Op(e, t)) : h || Ut(e, r);
  var f = Xn(t, r.inHover);
  t instanceof ot ? (r.lastDrawType !== bc && (l = !0, r.lastDrawType = bc), wc(e, t, u, l, r), (!h || !r.batchFill && !r.batchStroke) && e.beginPath(), Px(e, t, f, h), h && (r.batchFill = f.fill || "", r.batchStroke = f.stroke || "")) : t instanceof so ? (r.lastDrawType !== Tc && (l = !0, r.lastDrawType = Tc), wc(e, t, u, l, r), Ix(e, t, f)) : t instanceof Jr ? (r.lastDrawType !== Sc && (l = !0, r.lastDrawType = Sc), Rx(e, t, u, l, r), Lx(e, t, f)) : t.getTemporalDisplayables && (r.lastDrawType !== Cc && (l = !0, r.lastDrawType = Cc), $x(e, t, r)), h && i && Ut(e, r), t.innerAfterBrush(), t.afterBrush && t.afterBrush(), r.prevEl = t, t.__dirty = 0, t.__isRendered = !0;
}
function $x(e, t, r) {
  var i = t.getDisplayables(), n = t.getTemporalDisplayables();
  e.save();
  var a = {
    prevElClipPaths: null,
    prevEl: null,
    allClipped: !1,
    viewWidth: r.viewWidth,
    viewHeight: r.viewHeight,
    inHover: r.inHover
  }, o, s;
  for (o = t.getCursor(), s = i.length; o < s; o++) {
    var l = i[o];
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), Gr(e, l, a, o === s - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  for (var u = 0, h = n.length; u < h; u++) {
    var l = n[u];
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), Gr(e, l, a, u === h - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  t.clearTemporalDisplayables(), t.notClear = !0, e.restore();
}
var Us = new dx(), xc = new jn(100), Dc = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function Ec(e, t) {
  if (e === "none")
    return null;
  var r = t.getDevicePixelRatio(), i = t.getZr(), n = i.painter.type === "svg";
  e.dirty && Us.delete(e);
  var a = Us.get(e);
  if (a)
    return a;
  var o = ht(e, {
    symbol: "rect",
    symbolSize: 1,
    symbolKeepAspect: !0,
    color: "rgba(0, 0, 0, 0.2)",
    backgroundColor: null,
    dashArrayX: 5,
    dashArrayY: 5,
    rotation: 0,
    maxTileWidth: 512,
    maxTileHeight: 512
  });
  o.backgroundColor === "none" && (o.backgroundColor = null);
  var s = {
    repeat: "repeat"
  };
  return l(s), s.rotation = o.rotation, s.scaleX = s.scaleY = n ? 1 : 1 / r, Us.set(e, s), e.dirty = !1, s;
  function l(u) {
    for (var h = [r], f = !0, c = 0; c < Dc.length; ++c) {
      var v = o[Dc[c]];
      if (v != null && !k(v) && !z(v) && !yt(v) && typeof v != "boolean") {
        f = !1;
        break;
      }
      h.push(v);
    }
    var d;
    if (f) {
      d = h.join(",") + (n ? "-svg" : "");
      var _ = xc.get(d);
      _ && (n ? u.svgElement = _ : u.image = _);
    }
    var p = $p(o.dashArrayX), g = Bx(o.dashArrayY), m = Np(o.symbol), y = Fx(p), w = Bp(g), S = !n && Fi.createCanvas(), b = n && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    }, T = x(), C;
    S && (S.width = T.width * r, S.height = T.height * r, C = S.getContext("2d")), E(), f && xc.put(d, S || b), u.image = S, u.svgElement = b, u.svgWidth = T.width, u.svgHeight = T.height;
    function x() {
      for (var A = 1, M = 0, L = y.length; M < L; ++M)
        A = Hh(A, y[M]);
      for (var P = 1, M = 0, L = m.length; M < L; ++M)
        P = Hh(P, m[M].length);
      A *= P;
      var O = w * y.length * m.length;
      if (process.env.NODE_ENV !== "production") {
        var R = function(U) {
          console.warn("Calculated decal size is greater than " + U + " due to decal option settings so " + U + " is used for the decal size. Please consider changing the decal option to make a smaller decal or set " + U + " to be larger to avoid incontinuity.");
        };
        A > o.maxTileWidth && R("maxTileWidth"), O > o.maxTileHeight && R("maxTileHeight");
      }
      return {
        width: Math.max(1, Math.min(A, o.maxTileWidth)),
        height: Math.max(1, Math.min(O, o.maxTileHeight))
      };
    }
    function E() {
      C && (C.clearRect(0, 0, S.width, S.height), o.backgroundColor && (C.fillStyle = o.backgroundColor, C.fillRect(0, 0, S.width, S.height)));
      for (var A = 0, M = 0; M < g.length; ++M)
        A += g[M];
      if (A <= 0)
        return;
      for (var L = -w, P = 0, O = 0, R = 0; L < T.height; ) {
        if (P % 2 === 0) {
          for (var U = O / 2 % m.length, q = 0, $ = 0, Z = 0; q < T.width * 2; ) {
            for (var J = 0, M = 0; M < p[R].length; ++M)
              J += p[R][M];
            if (J <= 0)
              break;
            if ($ % 2 === 0) {
              var Y = (1 - o.symbolSize) * 0.5, _t = q + p[R][$] * Y, Tt = L + g[P] * Y, qt = p[R][$] * o.symbolSize, Se = g[P] * o.symbolSize, ee = Z / 2 % m[U].length;
              Zt(_t, Tt, qt, Se, m[U][ee]);
            }
            q += p[R][$], ++Z, ++$, $ === p[R].length && ($ = 0);
          }
          ++R, R === p.length && (R = 0);
        }
        L += g[P], ++O, ++P, P === g.length && (P = 0);
      }
      function Zt(xt, ft, H, K, Te) {
        var Ct = n ? 1 : r, Qe = Lp(Te, xt * Ct, ft * Ct, H * Ct, K * Ct, o.color, o.symbolKeepAspect);
        if (n) {
          var Ve = i.painter.renderOneToVNode(Qe);
          Ve && b.children.push(Ve);
        } else
          kp(C, Qe);
      }
    }
  }
}
function Np(e) {
  if (!e || e.length === 0)
    return [["rect"]];
  if (z(e))
    return [[e]];
  for (var t = !0, r = 0; r < e.length; ++r)
    if (!z(e[r])) {
      t = !1;
      break;
    }
  if (t)
    return Np([e]);
  for (var i = [], r = 0; r < e.length; ++r)
    z(e[r]) ? i.push([e[r]]) : i.push(e[r]);
  return i;
}
function $p(e) {
  if (!e || e.length === 0)
    return [[0, 0]];
  if (yt(e)) {
    var t = Math.ceil(e);
    return [[t, t]];
  }
  for (var r = !0, i = 0; i < e.length; ++i)
    if (!yt(e[i])) {
      r = !1;
      break;
    }
  if (r)
    return $p([e]);
  for (var n = [], i = 0; i < e.length; ++i)
    if (yt(e[i])) {
      var t = Math.ceil(e[i]);
      n.push([t, t]);
    } else {
      var t = Q(e[i], function(s) {
        return Math.ceil(s);
      });
      t.length % 2 === 1 ? n.push(t.concat(t)) : n.push(t);
    }
  return n;
}
function Bx(e) {
  if (!e || typeof e == "object" && e.length === 0)
    return [0, 0];
  if (yt(e)) {
    var t = Math.ceil(e);
    return [t, t];
  }
  var r = Q(e, function(i) {
    return Math.ceil(i);
  });
  return e.length % 2 ? r.concat(r) : r;
}
function Fx(e) {
  return Q(e, function(t) {
    return Bp(t);
  });
}
function Bp(e) {
  for (var t = 0, r = 0; r < e.length; ++r)
    t += e[r];
  return e.length % 2 === 1 ? t * 2 : t;
}
function Vx(e, t) {
  e.eachRawSeries(function(r) {
    if (!e.isSeriesFiltered(r)) {
      var i = r.getData();
      i.hasItemVisual() && i.each(function(o) {
        var s = i.getItemVisual(o, "decal");
        if (s) {
          var l = i.ensureUniqueItemVisual(o, "style");
          l.decal = Ec(s, t);
        }
      });
      var n = i.getVisual("decal");
      if (n) {
        var a = i.getVisual("style");
        a.decal = Ec(n, t);
      }
    }
  });
}
var pe = new $e(), So = {};
function zx(e, t) {
  process.env.NODE_ENV !== "production" && So[e] && It("Already has an implementation of " + e + "."), So[e] = t;
}
function Hx(e) {
  return process.env.NODE_ENV !== "production" && (So[e] || It("Implementation of " + e + " doesn't exists.")), So[e];
}
var Ux = 1, Gx = 800, Wx = 900, Yx = 1e3, Xx = 2e3, qx = 5e3, Fp = 1e3, Zx = 1100, zu = 2e3, Vp = 3e3, Kx = 4e3, Wo = 4500, jx = 4600, Qx = 5e3, Jx = 6e3, zp = 7e3, tD = {
  PROCESSOR: {
    FILTER: Yx,
    SERIES_FILTER: Gx,
    STATISTIC: qx
  },
  VISUAL: {
    LAYOUT: Fp,
    PROGRESSIVE_LAYOUT: Zx,
    GLOBAL: zu,
    CHART: Vp,
    POST_CHART_LAYOUT: jx,
    COMPONENT: Kx,
    BRUSH: Qx,
    CHART_ITEM: Wo,
    ARIA: Jx,
    DECAL: zp
  }
}, Mt = "__flagInMainProcess", Ft = "__pendingUpdate", Gs = "__needsUpdateStatus", Ac = /^[a-zA-Z0-9_]+$/, Ws = "__connectUpdateStatus", Mc = 0, eD = 1, rD = 2;
function Hp(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    if (this.isDisposed()) {
      Kt(this.id);
      return;
    }
    return Gp(this, e, t);
  };
}
function Up(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    return Gp(this, e, t);
  };
}
function Gp(e, t, r) {
  return r[0] = r[0] && r[0].toLowerCase(), $e.prototype[t].apply(e, r);
}
var Wp = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t;
  })($e)
), Yp = Wp.prototype;
Yp.on = Up("on");
Yp.off = Up("off");
var di, Ys, Aa, ir, Xs, qs, Zs, sn, ln, Pc, Lc, Ks, Ic, Ma, Rc, Xp, ie, Oc, qp = (
  /** @class */
  (function(e) {
    W(t, e);
    function t(r, i, n) {
      var a = e.call(this, new ax()) || this;
      a._chartsViews = [], a._chartsMap = {}, a._componentsViews = [], a._componentsMap = {}, a._pendingActions = [], n = n || {}, z(i) && (i = Zp[i]), a._dom = r;
      var o = "canvas", s = "auto", l = !1;
      if (process.env.NODE_ENV !== "production") {
        var u = (
          /* eslint-disable-next-line */
          V.hasGlobalWindow ? window : global
        );
        u && (o = X(u.__ECHARTS__DEFAULT__RENDERER__, o), s = X(u.__ECHARTS__DEFAULT__COARSE_POINTER, s), l = X(u.__ECHARTS__DEFAULT__USE_DIRTY_RECT__, l));
      }
      n.ssr;
      var h = a._zr = Fh(r, {
        renderer: n.renderer || o,
        devicePixelRatio: n.devicePixelRatio,
        width: n.width,
        height: n.height,
        ssr: n.ssr,
        useDirtyRect: X(n.useDirtyRect, l),
        useCoarsePointer: X(n.useCoarsePointer, s),
        pointerSize: n.pointerSize
      });
      a._ssr = n.ssr, a._throttledZrFlush = Sp(lt(h.flush, h), 17), i = tt(i), i && np(i, !0), a._theme = i, a._locale = aT(n.locale || Hd), a._coordSysMgr = new rp();
      var f = a._api = Rc(a);
      function c(v, d) {
        return v.__prio - d.__prio;
      }
      return ka(Co, c), ka(Xl, c), a._scheduler = new Dp(a, f, Xl, Co), a._messageCenter = new Wp(), a._initEvents(), a.resize = lt(a.resize, a), h.animation.on("frame", a._onframe, a), Pc(h, a), Lc(h, a), ll(a), a;
    }
    return t.prototype._onframe = function() {
      if (!this._disposed) {
        Oc(this);
        var r = this._scheduler;
        if (this[Ft]) {
          var i = this[Ft].silent;
          this[Mt] = !0;
          try {
            di(this), ir.update.call(this, null, this[Ft].updateParams);
          } catch (l) {
            throw this[Mt] = !1, this[Ft] = null, l;
          }
          this._zr.flush(), this[Mt] = !1, this[Ft] = null, sn.call(this, i), ln.call(this, i);
        } else if (r.unfinished) {
          var n = Ux, a = this._model, o = this._api;
          r.unfinished = !1;
          do {
            var s = +/* @__PURE__ */ new Date();
            r.performSeriesTasks(a), r.performDataProcessorTasks(a), qs(this, a), r.performVisualTasks(a), Ma(this, this._model, o, "remain", {}), n -= +/* @__PURE__ */ new Date() - s;
          } while (n > 0 && r.unfinished);
          r.unfinished || this._zr.flush();
        }
      }
    }, t.prototype.getDom = function() {
      return this._dom;
    }, t.prototype.getId = function() {
      return this.id;
    }, t.prototype.getZr = function() {
      return this._zr;
    }, t.prototype.isSSR = function() {
      return this._ssr;
    }, t.prototype.setOption = function(r, i, n) {
      if (this[Mt]) {
        process.env.NODE_ENV !== "production" && It("`setOption` should not be called during main process.");
        return;
      }
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      var a, o, s;
      if (B(i) && (n = i.lazyUpdate, a = i.silent, o = i.replaceMerge, s = i.transition, i = i.notMerge), this[Mt] = !0, !this._model || i) {
        var l = new BT(this._api), u = this._theme, h = this._model = new $u();
        h.scheduler = this._scheduler, h.ssr = this._ssr, h.init(null, null, null, u, this._locale, l);
      }
      this._model.setOption(r, {
        replaceMerge: o
      }, ql);
      var f = {
        seriesTransition: s,
        optionChanged: !0
      };
      if (n)
        this[Ft] = {
          silent: a,
          updateParams: f
        }, this[Mt] = !1, this.getZr().wakeUp();
      else {
        try {
          di(this), ir.update.call(this, null, f);
        } catch (c) {
          throw this[Ft] = null, this[Mt] = !1, c;
        }
        this._ssr || this._zr.flush(), this[Ft] = null, this[Mt] = !1, sn.call(this, a), ln.call(this, a);
      }
    }, t.prototype.setTheme = function() {
      Oe("ECharts#setTheme() is DEPRECATED in ECharts 3.0");
    }, t.prototype.getModel = function() {
      return this._model;
    }, t.prototype.getOption = function() {
      return this._model && this._model.getOption();
    }, t.prototype.getWidth = function() {
      return this._zr.getWidth();
    }, t.prototype.getHeight = function() {
      return this._zr.getHeight();
    }, t.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || V.hasGlobalWindow && window.devicePixelRatio || 1;
    }, t.prototype.getRenderedCanvas = function(r) {
      return process.env.NODE_ENV !== "production" && bt("getRenderedCanvas", "renderToCanvas"), this.renderToCanvas(r);
    }, t.prototype.renderToCanvas = function(r) {
      r = r || {};
      var i = this._zr.painter;
      if (process.env.NODE_ENV !== "production" && i.type !== "canvas")
        throw new Error("renderToCanvas can only be used in the canvas renderer.");
      return i.getRenderedCanvas({
        backgroundColor: r.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: r.pixelRatio || this.getDevicePixelRatio()
      });
    }, t.prototype.renderToSVGString = function(r) {
      r = r || {};
      var i = this._zr.painter;
      if (process.env.NODE_ENV !== "production" && i.type !== "svg")
        throw new Error("renderToSVGString can only be used in the svg renderer.");
      return i.renderToString({
        useViewBox: r.useViewBox
      });
    }, t.prototype.getSvgDataURL = function() {
      if (V.svgSupported) {
        var r = this._zr, i = r.storage.getDisplayList();
        return D(i, function(n) {
          n.stopAnimation(null, !0);
        }), r.painter.toDataURL();
      }
    }, t.prototype.getDataURL = function(r) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      r = r || {};
      var i = r.excludeComponents, n = this._model, a = [], o = this;
      D(i, function(l) {
        n.eachComponent({
          mainType: l
        }, function(u) {
          var h = o._componentsMap[u.__viewId];
          h.group.ignore || (a.push(h), h.group.ignore = !0);
        });
      });
      var s = this._zr.painter.getType() === "svg" ? this.getSvgDataURL() : this.renderToCanvas(r).toDataURL("image/" + (r && r.type || "png"));
      return D(a, function(l) {
        l.group.ignore = !1;
      }), s;
    }, t.prototype.getConnectedDataURL = function(r) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      var i = r.type === "svg", n = this.group, a = Math.min, o = Math.max, s = 1 / 0;
      if (kc[n]) {
        var l = s, u = s, h = -s, f = -s, c = [], v = r && r.pixelRatio || this.getDevicePixelRatio();
        D(On, function(y, w) {
          if (y.group === n) {
            var S = i ? y.getZr().painter.getSvgDom().innerHTML : y.renderToCanvas(tt(r)), b = y.getDom().getBoundingClientRect();
            l = a(b.left, l), u = a(b.top, u), h = o(b.right, h), f = o(b.bottom, f), c.push({
              dom: S,
              left: b.left,
              top: b.top
            });
          }
        }), l *= v, u *= v, h *= v, f *= v;
        var d = h - l, _ = f - u, p = Fi.createCanvas(), g = Fh(p, {
          renderer: i ? "svg" : "canvas"
        });
        if (g.resize({
          width: d,
          height: _
        }), i) {
          var m = "";
          return D(c, function(y) {
            var w = y.left - l, S = y.top - u;
            m += '<g transform="translate(' + w + "," + S + ')">' + y.dom + "</g>";
          }), g.painter.getSvgRoot().innerHTML = m, r.connectedBackgroundColor && g.painter.setBackgroundColor(r.connectedBackgroundColor), g.refreshImmediately(), g.painter.toDataURL();
        } else
          return r.connectedBackgroundColor && g.add(new me({
            shape: {
              x: 0,
              y: 0,
              width: d,
              height: _
            },
            style: {
              fill: r.connectedBackgroundColor
            }
          })), D(c, function(y) {
            var w = new Jr({
              style: {
                x: y.left * v - l,
                y: y.top * v - u,
                image: y.dom
              }
            });
            g.add(w);
          }), g.refreshImmediately(), p.toDataURL("image/" + (r && r.type || "png"));
      } else
        return this.getDataURL(r);
    }, t.prototype.convertToPixel = function(r, i) {
      return Xs(this, "convertToPixel", r, i);
    }, t.prototype.convertFromPixel = function(r, i) {
      return Xs(this, "convertFromPixel", r, i);
    }, t.prototype.containPixel = function(r, i) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      var n = this._model, a, o = gs(n, r);
      return D(o, function(s, l) {
        l.indexOf("Models") >= 0 && D(s, function(u) {
          var h = u.coordinateSystem;
          if (h && h.containPoint)
            a = a || !!h.containPoint(i);
          else if (l === "seriesModels") {
            var f = this._chartsMap[u.__viewId];
            f && f.containPoint ? a = a || f.containPoint(i, u) : process.env.NODE_ENV !== "production" && _e(l + ": " + (f ? "The found component do not support containPoint." : "No view mapping to the found component."));
          } else
            process.env.NODE_ENV !== "production" && _e(l + ": containPoint is not supported");
        }, this);
      }, this), !!a;
    }, t.prototype.getVisual = function(r, i) {
      var n = this._model, a = gs(n, r, {
        defaultMainType: "series"
      }), o = a.seriesModel;
      process.env.NODE_ENV !== "production" && (o || _e("There is no specified series model"));
      var s = o.getData(), l = a.hasOwnProperty("dataIndexInside") ? a.dataIndexInside : a.hasOwnProperty("dataIndex") ? s.indexOfRawIndex(a.dataIndex) : null;
      return l != null ? lx(s, l, i) : ux(s, i);
    }, t.prototype.getViewOfComponentModel = function(r) {
      return this._componentsMap[r.__viewId];
    }, t.prototype.getViewOfSeriesModel = function(r) {
      return this._chartsMap[r.__viewId];
    }, t.prototype._initEvents = function() {
      var r = this;
      D(iD, function(i) {
        var n = function(a) {
          var o = r.getModel(), s = a.target, l, u = i === "globalout";
          if (u ? l = {} : s && wn(s, function(d) {
            var _ = vt(d);
            if (_ && _.dataIndex != null) {
              var p = _.dataModel || o.getSeriesByIndex(_.seriesIndex);
              return l = p && p.getDataParams(_.dataIndex, _.dataType, s) || {}, !0;
            } else if (_.eventData)
              return l = I({}, _.eventData), !0;
          }, !0), l) {
            var h = l.componentType, f = l.componentIndex;
            (h === "markLine" || h === "markPoint" || h === "markArea") && (h = "series", f = l.seriesIndex);
            var c = h && f != null && o.getComponent(h, f), v = c && r[c.mainType === "series" ? "_chartsMap" : "_componentsMap"][c.__viewId];
            process.env.NODE_ENV !== "production" && !u && !(c && v) && _e("model or view can not be found by params"), l.event = a, l.type = i, r._$eventProcessor.eventInfo = {
              targetEl: s,
              packedEvent: l,
              model: c,
              view: v
            }, r.trigger(i, l);
          }
        };
        n.zrEventfulCallAtLast = !0, r._zr.on(i, n, r);
      }), D(Rn, function(i, n) {
        r._messageCenter.on(n, function(a) {
          this.trigger(n, a);
        }, r);
      }), D(["selectchanged"], function(i) {
        r._messageCenter.on(i, function(n) {
          this.trigger(i, n);
        }, r);
      }), fx(this._messageCenter, this, this._api);
    }, t.prototype.isDisposed = function() {
      return this._disposed;
    }, t.prototype.clear = function() {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      this.setOption({
        series: []
      }, !0);
    }, t.prototype.dispose = function() {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      this._disposed = !0;
      var r = this.getDom();
      r && id(this.getDom(), Uu, "");
      var i = this, n = i._api, a = i._model;
      D(i._componentsViews, function(o) {
        o.dispose(a, n);
      }), D(i._chartsViews, function(o) {
        o.dispose(a, n);
      }), i._zr.dispose(), i._dom = i._model = i._chartsMap = i._componentsMap = i._chartsViews = i._componentsViews = i._scheduler = i._api = i._zr = i._throttledZrFlush = i._theme = i._coordSysMgr = i._messageCenter = null, delete On[i.id];
    }, t.prototype.resize = function(r) {
      if (this[Mt]) {
        process.env.NODE_ENV !== "production" && It("`resize` should not be called during main process.");
        return;
      }
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      this._zr.resize(r);
      var i = this._model;
      if (this._loadingFX && this._loadingFX.resize(), !!i) {
        var n = i.resetOption("media"), a = r && r.silent;
        this[Ft] && (a == null && (a = this[Ft].silent), n = !0, this[Ft] = null), this[Mt] = !0;
        try {
          n && di(this), ir.update.call(this, {
            type: "resize",
            animation: I({
              // Disable animation
              duration: 0
            }, r && r.animation)
          });
        } catch (o) {
          throw this[Mt] = !1, o;
        }
        this[Mt] = !1, sn.call(this, a), ln.call(this, a);
      }
    }, t.prototype.showLoading = function(r, i) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      if (B(r) && (i = r, r = ""), r = r || "default", this.hideLoading(), !Zl[r]) {
        process.env.NODE_ENV !== "production" && _e("Loading effects " + r + " not exists.");
        return;
      }
      var n = Zl[r](this._api, i), a = this._zr;
      this._loadingFX = n, a.add(n);
    }, t.prototype.hideLoading = function() {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX), this._loadingFX = null;
    }, t.prototype.makeActionFromEvent = function(r) {
      var i = I({}, r);
      return i.type = Rn[r.type], i;
    }, t.prototype.dispatchAction = function(r, i) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      if (B(i) || (i = {
        silent: !!i
      }), !!To[r.type] && this._model) {
        if (this[Mt]) {
          this._pendingActions.push(r);
          return;
        }
        var n = i.silent;
        Zs.call(this, r, n);
        var a = i.flush;
        a ? this._zr.flush() : a !== !1 && V.browser.weChat && this._throttledZrFlush(), sn.call(this, n), ln.call(this, n);
      }
    }, t.prototype.updateLabelLayout = function() {
      pe.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    }, t.prototype.appendData = function(r) {
      if (this._disposed) {
        Kt(this.id);
        return;
      }
      var i = r.seriesIndex, n = this.getModel(), a = n.getSeriesByIndex(i);
      process.env.NODE_ENV !== "production" && j(r.data && a), a.appendData(r), this._scheduler.unfinished = !0, this.getZr().wakeUp();
    }, t.internalField = (function() {
      di = function(f) {
        var c = f._scheduler;
        c.restorePipelines(f._model), c.prepareStageTasks(), Ys(f, !0), Ys(f, !1), c.plan();
      }, Ys = function(f, c) {
        for (var v = f._model, d = f._scheduler, _ = c ? f._componentsViews : f._chartsViews, p = c ? f._componentsMap : f._chartsMap, g = f._zr, m = f._api, y = 0; y < _.length; y++)
          _[y].__alive = !1;
        c ? v.eachComponent(function(b, T) {
          b !== "series" && w(T);
        }) : v.eachSeries(w);
        function w(b) {
          var T = b.__requireNewView;
          b.__requireNewView = !1;
          var C = "_ec_" + b.id + "_" + b.type, x = !T && p[C];
          if (!x) {
            var E = Le(b.type), A = c ? gr.getClass(E.main, E.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              vr.getClass(E.sub)
            );
            process.env.NODE_ENV !== "production" && j(A, E.sub + " does not exist."), x = new A(), x.init(v, m), p[C] = x, _.push(x), g.add(x.group);
          }
          b.__viewId = x.__id = C, x.__alive = !0, x.__model = b, x.group.__ecComponentInfo = {
            mainType: b.mainType,
            index: b.componentIndex
          }, !c && d.prepareView(x, b, v, m);
        }
        for (var y = 0; y < _.length; ) {
          var S = _[y];
          S.__alive ? y++ : (!c && S.renderTask.dispose(), g.remove(S.group), S.dispose(v, m), _.splice(y, 1), p[S.__id] === S && delete p[S.__id], S.__id = S.group.__ecComponentInfo = null);
        }
      }, Aa = function(f, c, v, d, _) {
        var p = f._model;
        if (p.setUpdatePayload(v), !d) {
          D([].concat(f._componentsViews).concat(f._chartsViews), S);
          return;
        }
        var g = {};
        g[d + "Id"] = v[d + "Id"], g[d + "Index"] = v[d + "Index"], g[d + "Name"] = v[d + "Name"];
        var m = {
          mainType: d,
          query: g
        };
        _ && (m.subType = _);
        var y = v.excludeSeriesId, w;
        y != null && (w = et(), D(Nt(y), function(b) {
          var T = Re(b, null);
          T != null && w.set(T, !0);
        })), p && p.eachComponent(m, function(b) {
          var T = w && w.get(b.id) != null;
          if (!T)
            if (_f(v))
              if (b instanceof pr)
                v.type === Xr && !v.notBlur && !b.get(["emphasis", "disabled"]) && Ob(b, v, f._api);
              else {
                var C = Tu(b.mainType, b.componentIndex, v.name, f._api), x = C.focusSelf, E = C.dispatchers;
                v.type === Xr && x && !v.notBlur && Ll(b.mainType, b.componentIndex, f._api), E && D(E, function(A) {
                  v.type === Xr ? Al(A) : Ml(A);
                });
              }
            else Il(v) && b instanceof pr && ($b(b, v, f._api), pf(b), ie(f));
        }, f), p && p.eachComponent(m, function(b) {
          var T = w && w.get(b.id) != null;
          T || S(f[d === "series" ? "_chartsMap" : "_componentsMap"][b.__viewId]);
        }, f);
        function S(b) {
          b && b.__alive && b[c] && b[c](b.__model, p, f._api, v);
        }
      }, ir = {
        prepareAndUpdate: function(f) {
          di(this), ir.update.call(this, f, {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: f.newOption != null
          });
        },
        update: function(f, c) {
          var v = this._model, d = this._api, _ = this._zr, p = this._coordSysMgr, g = this._scheduler;
          if (v) {
            v.setUpdatePayload(f), g.restoreData(v, f), g.performSeriesTasks(v), p.create(v, d), g.performDataProcessorTasks(v, f), qs(this, v), p.update(v, d), r(v), g.performVisualTasks(v, f), Ks(this, v, d, f, c);
            var m = v.get("backgroundColor") || "transparent", y = v.get("darkMode");
            _.setBackgroundColor(m), y != null && y !== "auto" && _.setDarkMode(y), pe.trigger("afterupdate", v, d);
          }
        },
        updateTransform: function(f) {
          var c = this, v = this._model, d = this._api;
          if (v) {
            v.setUpdatePayload(f);
            var _ = [];
            v.eachComponent(function(g, m) {
              if (g !== "series") {
                var y = c.getViewOfComponentModel(m);
                if (y && y.__alive)
                  if (y.updateTransform) {
                    var w = y.updateTransform(m, v, d, f);
                    w && w.update && _.push(y);
                  } else
                    _.push(y);
              }
            });
            var p = et();
            v.eachSeries(function(g) {
              var m = c._chartsMap[g.__viewId];
              if (m.updateTransform) {
                var y = m.updateTransform(g, v, d, f);
                y && y.update && p.set(g.uid, 1);
              } else
                p.set(g.uid, 1);
            }), r(v), this._scheduler.performVisualTasks(v, f, {
              setDirty: !0,
              dirtyMap: p
            }), Ma(this, v, d, f, {}, p), pe.trigger("afterupdate", v, d);
          }
        },
        updateView: function(f) {
          var c = this._model;
          c && (c.setUpdatePayload(f), vr.markUpdateMethod(f, "updateView"), r(c), this._scheduler.performVisualTasks(c, f, {
            setDirty: !0
          }), Ks(this, c, this._api, f, {}), pe.trigger("afterupdate", c, this._api));
        },
        updateVisual: function(f) {
          var c = this, v = this._model;
          v && (v.setUpdatePayload(f), v.eachSeries(function(d) {
            d.getData().clearAllVisual();
          }), vr.markUpdateMethod(f, "updateVisual"), r(v), this._scheduler.performVisualTasks(v, f, {
            visualType: "visual",
            setDirty: !0
          }), v.eachComponent(function(d, _) {
            if (d !== "series") {
              var p = c.getViewOfComponentModel(_);
              p && p.__alive && p.updateVisual(_, v, c._api, f);
            }
          }), v.eachSeries(function(d) {
            var _ = c._chartsMap[d.__viewId];
            _.updateVisual(d, v, c._api, f);
          }), pe.trigger("afterupdate", v, this._api));
        },
        updateLayout: function(f) {
          ir.update.call(this, f);
        }
      }, Xs = function(f, c, v, d) {
        if (f._disposed) {
          Kt(f.id);
          return;
        }
        for (var _ = f._model, p = f._coordSysMgr.getCoordinateSystems(), g, m = gs(_, v), y = 0; y < p.length; y++) {
          var w = p[y];
          if (w[c] && (g = w[c](_, m, d)) != null)
            return g;
        }
        process.env.NODE_ENV !== "production" && _e("No coordinate system that supports " + c + " found by the given finder.");
      }, qs = function(f, c) {
        var v = f._chartsMap, d = f._scheduler;
        c.eachSeries(function(_) {
          d.updateStreamModes(_, v[_.__viewId]);
        });
      }, Zs = function(f, c) {
        var v = this, d = this.getModel(), _ = f.type, p = f.escapeConnect, g = To[_], m = g.actionInfo, y = (m.update || "update").split(":"), w = y.pop(), S = y[0] != null && Le(y[0]);
        this[Mt] = !0;
        var b = [f], T = !1;
        f.batch && (T = !0, b = Q(f.batch, function(P) {
          return P = ht(I({}, P), f), P.batch = null, P;
        }));
        var C = [], x, E = Il(f), A = _f(f);
        if (A && Cd(this._api), D(b, function(P) {
          if (x = g.action(P, v._model, v._api), x = x || I({}, P), x.type = m.event || x.type, C.push(x), A) {
            var O = pu(f), R = O.queryOptionMap, U = O.mainTypeSpecified, q = U ? R.keys()[0] : "series";
            Aa(v, w, P, q), ie(v);
          } else E ? (Aa(v, w, P, "series"), ie(v)) : S && Aa(v, w, P, S.main, S.sub);
        }), w !== "none" && !A && !E && !S)
          try {
            this[Ft] ? (di(this), ir.update.call(this, f), this[Ft] = null) : ir[w].call(this, f);
          } catch (P) {
            throw this[Mt] = !1, P;
          }
        if (T ? x = {
          type: m.event || _,
          escapeConnect: p,
          batch: C
        } : x = C[0], this[Mt] = !1, !c) {
          var M = this._messageCenter;
          if (M.trigger(x.type, x), E) {
            var L = {
              type: "selectchanged",
              escapeConnect: p,
              selected: Bb(d),
              isFromClick: f.isFromClick || !1,
              fromAction: f.type,
              fromActionPayload: f
            };
            M.trigger(L.type, L);
          }
        }
      }, sn = function(f) {
        for (var c = this._pendingActions; c.length; ) {
          var v = c.shift();
          Zs.call(this, v, f);
        }
      }, ln = function(f) {
        !f && this.trigger("updated");
      }, Pc = function(f, c) {
        f.on("rendered", function(v) {
          c.trigger("rendered", v), // Although zr is dirty if initial animation is not finished
          // and this checking is called on frame, we also check
          // animation finished for robustness.
          f.animation.isFinished() && !c[Ft] && !c._scheduler.unfinished && !c._pendingActions.length && c.trigger("finished");
        });
      }, Lc = function(f, c) {
        f.on("mouseover", function(v) {
          var d = v.target, _ = wn(d, $i);
          _ && (kb(_, v, c._api), ie(c));
        }).on("mouseout", function(v) {
          var d = v.target, _ = wn(d, $i);
          _ && (Nb(_, v, c._api), ie(c));
        }).on("click", function(v) {
          var d = v.target, _ = wn(d, function(m) {
            return vt(m).dataIndex != null;
          }, !0);
          if (_) {
            var p = _.selected ? "unselect" : "select", g = vt(_);
            c._api.dispatchAction({
              type: p,
              dataType: g.dataType,
              dataIndexInside: g.dataIndex,
              seriesIndex: g.seriesIndex,
              isFromClick: !0
            });
          }
        });
      };
      function r(f) {
        f.clearColorPalette(), f.eachSeries(function(c) {
          c.clearColorPalette();
        });
      }
      function i(f) {
        var c = [], v = [], d = !1;
        if (f.eachComponent(function(m, y) {
          var w = y.get("zlevel") || 0, S = y.get("z") || 0, b = y.getZLevelKey();
          d = d || !!b, (m === "series" ? v : c).push({
            zlevel: w,
            z: S,
            idx: y.componentIndex,
            type: m,
            key: b
          });
        }), d) {
          var _ = c.concat(v), p, g;
          ka(_, function(m, y) {
            return m.zlevel === y.zlevel ? m.z - y.z : m.zlevel - y.zlevel;
          }), D(_, function(m) {
            var y = f.getComponent(m.type, m.idx), w = m.zlevel, S = m.key;
            p != null && (w = Math.max(p, w)), S ? (w === p && S !== g && w++, g = S) : g && (w === p && w++, g = ""), p = w, y.setZLevel(w);
          });
        }
      }
      Ks = function(f, c, v, d, _) {
        i(c), Ic(f, c, v, d, _), D(f._chartsViews, function(p) {
          p.__alive = !1;
        }), Ma(f, c, v, d, _), D(f._chartsViews, function(p) {
          p.__alive || p.remove(c, v);
        });
      }, Ic = function(f, c, v, d, _, p) {
        D(p || f._componentsViews, function(g) {
          var m = g.__model;
          u(m, g), g.render(m, c, v, d), s(m, g), h(m, g);
        });
      }, Ma = function(f, c, v, d, _, p) {
        var g = f._scheduler;
        _ = I(_ || {}, {
          updatedSeries: c.getSeries()
        }), pe.trigger("series:beforeupdate", c, v, _);
        var m = !1;
        c.eachSeries(function(y) {
          var w = f._chartsMap[y.__viewId];
          w.__alive = !0;
          var S = w.renderTask;
          g.updatePayload(S, d), u(y, w), p && p.get(y.uid) && S.dirty(), S.perform(g.getPerformArgs(S)) && (m = !0), w.group.silent = !!y.get("silent"), o(y, w), pf(y);
        }), g.unfinished = m || g.unfinished, pe.trigger("series:layoutlabels", c, v, _), pe.trigger("series:transition", c, v, _), c.eachSeries(function(y) {
          var w = f._chartsMap[y.__viewId];
          s(y, w), h(y, w);
        }), a(f, c), pe.trigger("series:afterupdate", c, v, _);
      }, ie = function(f) {
        f[Gs] = !0, f.getZr().wakeUp();
      }, Oc = function(f) {
        f[Gs] && (f.getZr().storage.traverse(function(c) {
          Ln(c) || n(c);
        }), f[Gs] = !1);
      };
      function n(f) {
        for (var c = [], v = f.currentStates, d = 0; d < v.length; d++) {
          var _ = v[d];
          _ === "emphasis" || _ === "blur" || _ === "select" || c.push(_);
        }
        f.selected && f.states.select && c.push("select"), f.hoverState === bu && f.states.emphasis ? c.push("emphasis") : f.hoverState === wu && f.states.blur && c.push("blur"), f.useStates(c);
      }
      function a(f, c) {
        var v = f._zr, d = v.storage, _ = 0;
        d.traverse(function(p) {
          p.isGroup || _++;
        }), _ > c.get("hoverLayerThreshold") && !V.node && !V.worker && c.eachSeries(function(p) {
          if (!p.preventUsingHoverLayer) {
            var g = f._chartsMap[p.__viewId];
            g.__alive && g.eachRendered(function(m) {
              m.states.emphasis && (m.states.emphasis.hoverLayer = !0);
            });
          }
        });
      }
      function o(f, c) {
        var v = f.get("blendMode") || null;
        c.eachRendered(function(d) {
          d.isGroup || (d.style.blend = v);
        });
      }
      function s(f, c) {
        if (!f.preventAutoZ) {
          var v = f.get("z") || 0, d = f.get("zlevel") || 0;
          c.eachRendered(function(_) {
            return l(_, v, d, -1 / 0), !0;
          });
        }
      }
      function l(f, c, v, d) {
        var _ = f.getTextContent(), p = f.getTextGuideLine(), g = f.isGroup;
        if (g)
          for (var m = f.childrenRef(), y = 0; y < m.length; y++)
            d = Math.max(l(m[y], c, v, d), d);
        else
          f.z = c, f.zlevel = v, d = Math.max(f.z2, d);
        if (_ && (_.z = c, _.zlevel = v, isFinite(d) && (_.z2 = d + 2)), p) {
          var w = f.textGuideLineConfig;
          p.z = c, p.zlevel = v, isFinite(d) && (p.z2 = d + (w && w.showAbove ? 1 : -1));
        }
        return d;
      }
      function u(f, c) {
        c.eachRendered(function(v) {
          if (!Ln(v)) {
            var d = v.getTextContent(), _ = v.getTextGuideLine();
            v.stateTransition && (v.stateTransition = null), d && d.stateTransition && (d.stateTransition = null), _ && _.stateTransition && (_.stateTransition = null), v.hasState() ? (v.prevStates = v.currentStates, v.clearStates()) : v.prevStates && (v.prevStates = null);
          }
        });
      }
      function h(f, c) {
        var v = f.getModel("stateAnimation"), d = f.isAnimationEnabled(), _ = v.get("duration"), p = _ > 0 ? {
          duration: _,
          delay: v.get("delay"),
          easing: v.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        c.eachRendered(function(g) {
          if (g.states && g.states.emphasis) {
            if (Ln(g))
              return;
            if (g instanceof ot && Yb(g), g.__dirty) {
              var m = g.prevStates;
              m && g.useStates(m);
            }
            if (d) {
              g.stateTransition = p;
              var y = g.getTextContent(), w = g.getTextGuideLine();
              y && (y.stateTransition = p), w && (w.stateTransition = p);
            }
            g.__dirty && n(g);
          }
        });
      }
      Rc = function(f) {
        return new /** @class */
        ((function(c) {
          W(v, c);
          function v() {
            return c !== null && c.apply(this, arguments) || this;
          }
          return v.prototype.getCoordinateSystems = function() {
            return f._coordSysMgr.getCoordinateSystems();
          }, v.prototype.getComponentByElement = function(d) {
            for (; d; ) {
              var _ = d.__ecComponentInfo;
              if (_ != null)
                return f._model.getComponent(_.mainType, _.index);
              d = d.parent;
            }
          }, v.prototype.enterEmphasis = function(d, _) {
            Al(d, _), ie(f);
          }, v.prototype.leaveEmphasis = function(d, _) {
            Ml(d, _), ie(f);
          }, v.prototype.enterBlur = function(d) {
            Rb(d), ie(f);
          }, v.prototype.leaveBlur = function(d) {
            wd(d), ie(f);
          }, v.prototype.enterSelect = function(d) {
            bd(d), ie(f);
          }, v.prototype.leaveSelect = function(d) {
            Sd(d), ie(f);
          }, v.prototype.getModel = function() {
            return f.getModel();
          }, v.prototype.getViewOfComponentModel = function(d) {
            return f.getViewOfComponentModel(d);
          }, v.prototype.getViewOfSeriesModel = function(d) {
            return f.getViewOfSeriesModel(d);
          }, v;
        })(ep))(f);
      }, Xp = function(f) {
        function c(v, d) {
          for (var _ = 0; _ < v.length; _++) {
            var p = v[_];
            p[Ws] = d;
          }
        }
        D(Rn, function(v, d) {
          f._messageCenter.on(d, function(_) {
            if (kc[f.group] && f[Ws] !== Mc) {
              if (_ && _.escapeConnect)
                return;
              var p = f.makeActionFromEvent(_), g = [];
              D(On, function(m) {
                m !== f && m.group === f.group && g.push(m);
              }), c(g, Mc), D(g, function(m) {
                m[Ws] !== eD && m.dispatchAction(p);
              }), c(g, rD);
            }
          });
        });
      };
    })(), t;
  })($e)
), Hu = qp.prototype;
Hu.on = Hp("on");
Hu.off = Hp("off");
Hu.one = function(e, t, r) {
  var i = this;
  Oe("ECharts#one is deprecated.");
  function n() {
    for (var a = [], o = 0; o < arguments.length; o++)
      a[o] = arguments[o];
    t && t.apply && t.apply(this, a), i.off(e, n);
  }
  this.on.call(this, e, n, r);
};
var iD = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
function Kt(e) {
  process.env.NODE_ENV !== "production" && _e("Instance " + e + " has been disposed");
}
var To = {}, Rn = {}, Xl = [], ql = [], Co = [], Zp = {}, Zl = {}, On = {}, kc = {}, nD = +/* @__PURE__ */ new Date() - 0, Uu = "_echarts_instance_";
function aD(e, t, r) {
  var i = !(r && r.ssr);
  if (i) {
    if (process.env.NODE_ENV !== "production" && !e)
      throw new Error("Initialize failed: invalid dom.");
    var n = oD(e);
    if (n)
      return process.env.NODE_ENV !== "production" && _e("There is a chart instance already initialized on the dom."), n;
    process.env.NODE_ENV !== "production" && Ii(e) && e.nodeName.toUpperCase() !== "CANVAS" && (!e.clientWidth && (!r || r.width == null) || !e.clientHeight && (!r || r.height == null)) && _e("Can't get DOM width or height. Please check dom.clientWidth and dom.clientHeight. They should not be 0.For example, you may need to call this in the callback of window.onload.");
  }
  var a = new qp(e, t, r);
  return a.id = "ec_" + nD++, On[a.id] = a, i && id(e, Uu, a.id), Xp(a), pe.trigger("afterinit", a), a;
}
function oD(e) {
  return On[C1(e, Uu)];
}
function Kp(e, t) {
  Zp[e] = t;
}
function jp(e) {
  st(ql, e) < 0 && ql.push(e);
}
function Qp(e, t) {
  Wu(Xl, e, t, Xx);
}
function sD(e) {
  Gu("afterinit", e);
}
function lD(e) {
  Gu("afterupdate", e);
}
function Gu(e, t) {
  pe.on(e, t);
}
function Gi(e, t, r) {
  rt(t) && (r = t, t = "");
  var i = B(e) ? e.type : [e, e = {
    event: t
  }][0];
  e.event = (e.event || i).toLowerCase(), t = e.event, !Rn[t] && (j(Ac.test(i) && Ac.test(t)), To[i] || (To[i] = {
    action: r,
    actionInfo: e
  }), Rn[t] = i);
}
function uD(e, t) {
  rp.register(e, t);
}
function hD(e, t) {
  Wu(Co, e, t, Fp, "layout");
}
function ti(e, t) {
  Wu(Co, e, t, Vp, "visual");
}
var Nc = [];
function Wu(e, t, r, i, n) {
  if ((rt(t) || B(t)) && (r = t, t = i), process.env.NODE_ENV !== "production") {
    if (isNaN(t) || t == null)
      throw new Error("Illegal priority");
    D(e, function(o) {
      j(o.__raw !== r);
    });
  }
  if (!(st(Nc, r) >= 0)) {
    Nc.push(r);
    var a = Dp.wrapStageHandler(r, n);
    a.__prio = t, a.__raw = r, e.push(a);
  }
}
function Jp(e, t) {
  Zl[e] = t;
}
function fD(e, t, r) {
  var i = Hx("registerMap");
  i && i(e, t, r);
}
var cD = dC;
ti(zu, WC);
ti(Wo, YC);
ti(Wo, XC);
ti(zu, ox);
ti(Wo, sx);
ti(zp, Vx);
jp(np);
Qp(Wx, KT);
Jp("default", qC);
Gi({
  type: Xr,
  event: Xr,
  update: Xr
}, Gt);
Gi({
  type: Va,
  event: Va,
  update: Va
}, Gt);
Gi({
  type: An,
  event: An,
  update: An
}, Gt);
Gi({
  type: za,
  event: za,
  update: za
}, Gt);
Gi({
  type: Mn,
  event: Mn,
  update: Mn
}, Gt);
Kp("light", nx);
Kp("dark", Pp);
function un(e) {
  return e == null ? 0 : e.length || 1;
}
function $c(e) {
  return e;
}
var vD = (
  /** @class */
  (function() {
    function e(t, r, i, n, a, o) {
      this._old = t, this._new = r, this._oldKeyGetter = i || $c, this._newKeyGetter = n || $c, this.context = a, this._diffModeMultiple = o === "multiple";
    }
    return e.prototype.add = function(t) {
      return this._add = t, this;
    }, e.prototype.update = function(t) {
      return this._update = t, this;
    }, e.prototype.updateManyToOne = function(t) {
      return this._updateManyToOne = t, this;
    }, e.prototype.updateOneToMany = function(t) {
      return this._updateOneToMany = t, this;
    }, e.prototype.updateManyToMany = function(t) {
      return this._updateManyToMany = t, this;
    }, e.prototype.remove = function(t) {
      return this._remove = t, this;
    }, e.prototype.execute = function() {
      this[this._diffModeMultiple ? "_executeMultiple" : "_executeOneToOne"]();
    }, e.prototype._executeOneToOne = function() {
      var t = this._old, r = this._new, i = {}, n = new Array(t.length), a = new Array(r.length);
      this._initIndexMap(t, null, n, "_oldKeyGetter"), this._initIndexMap(r, i, a, "_newKeyGetter");
      for (var o = 0; o < t.length; o++) {
        var s = n[o], l = i[s], u = un(l);
        if (u > 1) {
          var h = l.shift();
          l.length === 1 && (i[s] = l[0]), this._update && this._update(h, o);
        } else u === 1 ? (i[s] = null, this._update && this._update(l, o)) : this._remove && this._remove(o);
      }
      this._performRestAdd(a, i);
    }, e.prototype._executeMultiple = function() {
      var t = this._old, r = this._new, i = {}, n = {}, a = [], o = [];
      this._initIndexMap(t, i, a, "_oldKeyGetter"), this._initIndexMap(r, n, o, "_newKeyGetter");
      for (var s = 0; s < a.length; s++) {
        var l = a[s], u = i[l], h = n[l], f = un(u), c = un(h);
        if (f > 1 && c === 1)
          this._updateManyToOne && this._updateManyToOne(h, u), n[l] = null;
        else if (f === 1 && c > 1)
          this._updateOneToMany && this._updateOneToMany(h, u), n[l] = null;
        else if (f === 1 && c === 1)
          this._update && this._update(h, u), n[l] = null;
        else if (f > 1 && c > 1)
          this._updateManyToMany && this._updateManyToMany(h, u), n[l] = null;
        else if (f > 1)
          for (var v = 0; v < f; v++)
            this._remove && this._remove(u[v]);
        else
          this._remove && this._remove(u);
      }
      this._performRestAdd(o, n);
    }, e.prototype._performRestAdd = function(t, r) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i], a = r[n], o = un(a);
        if (o > 1)
          for (var s = 0; s < o; s++)
            this._add && this._add(a[s]);
        else o === 1 && this._add && this._add(a);
        r[n] = null;
      }
    }, e.prototype._initIndexMap = function(t, r, i, n) {
      for (var a = this._diffModeMultiple, o = 0; o < t.length; o++) {
        var s = "_ec_" + this[n](t[o], o);
        if (a || (i[o] = s), !!r) {
          var l = r[s], u = un(l);
          u === 0 ? (r[s] = o, a && i.push(s)) : u === 1 ? r[s] = [l, o] : l.push(o);
        }
      }
    }, e;
  })()
), dD = (
  /** @class */
  (function() {
    function e(t, r) {
      this._encode = t, this._schema = r;
    }
    return e.prototype.get = function() {
      return {
        // Do not generate full dimension name until fist used.
        fullDimensions: this._getFullDimensionNames(),
        encode: this._encode
      };
    }, e.prototype._getFullDimensionNames = function() {
      return this._cachedDimNames || (this._cachedDimNames = this._schema ? this._schema.makeOutputDimensionNames() : []), this._cachedDimNames;
    }, e;
  })()
);
function pD(e, t) {
  var r = {}, i = r.encode = {}, n = et(), a = [], o = [], s = {};
  D(e.dimensions, function(c) {
    var v = e.getDimensionInfo(c), d = v.coordDim;
    if (d) {
      process.env.NODE_ENV !== "production" && j(Nl.get(d) == null);
      var _ = v.coordDimIndex;
      js(i, d)[_] = c, v.isExtraCoord || (n.set(d, 1), gD(v.type) && (a[0] = c), js(s, d)[_] = e.getDimensionIndex(v.name)), v.defaultTooltip && o.push(c);
    }
    Nl.each(function(p, g) {
      var m = js(i, g), y = v.otherDims[g];
      y != null && y !== !1 && (m[y] = v.name);
    });
  });
  var l = [], u = {};
  n.each(function(c, v) {
    var d = i[v];
    u[v] = d[0], l = l.concat(d);
  }), r.dataDimsOnCoord = l, r.dataDimIndicesOnCoord = Q(l, function(c) {
    return e.getDimensionInfo(c).storeDimIndex;
  }), r.encodeFirstDimNotExtra = u;
  var h = i.label;
  h && h.length && (a = h.slice());
  var f = i.tooltip;
  return f && f.length ? o = f.slice() : o.length || (o = a.slice()), i.defaultedLabel = a, i.defaultedTooltip = o, r.userOutput = new dD(s, t), r;
}
function js(e, t) {
  return e.hasOwnProperty(t) || (e[t] = []), e[t];
}
function gD(e) {
  return !(e === "ordinal" || e === "time");
}
var Ya = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      this.otherDims = {}, t != null && I(this, t);
    }
    return e;
  })()
), _D = St(), mD = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
}, tg = (
  /** @class */
  (function() {
    function e(t) {
      this.dimensions = t.dimensions, this._dimOmitted = t.dimensionOmitted, this.source = t.source, this._fullDimCount = t.fullDimensionCount, this._updateDimOmitted(t.dimensionOmitted);
    }
    return e.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    }, e.prototype._updateDimOmitted = function(t) {
      this._dimOmitted = t, t && (this._dimNameMap || (this._dimNameMap = rg(this.source)));
    }, e.prototype.getSourceDimensionIndex = function(t) {
      return X(this._dimNameMap.get(t), -1);
    }, e.prototype.getSourceDimension = function(t) {
      var r = this.source.dimensionsDefine;
      if (r)
        return r[t];
    }, e.prototype.makeStoreSchema = function() {
      for (var t = this._fullDimCount, r = sp(this.source), i = !ig(t), n = "", a = [], o = 0, s = 0; o < t; o++) {
        var l = void 0, u = void 0, h = void 0, f = this.dimensions[s];
        if (f && f.storeDimIndex === o)
          l = r ? f.name : null, u = f.type, h = f.ordinalMeta, s++;
        else {
          var c = this.getSourceDimension(o);
          c && (l = r ? c.name : null, u = c.type);
        }
        a.push({
          property: l,
          type: u,
          ordinalMeta: h
        }), r && l != null && (!f || !f.isCalculationCoord) && (n += i ? l.replace(/\`/g, "`1").replace(/\$/g, "`2") : l), n += "$", n += mD[u] || "f", h && (n += h.uid), n += "$";
      }
      var v = this.source, d = [v.seriesLayoutBy, v.startIndex, n].join("$$");
      return {
        dimensions: a,
        hash: d
      };
    }, e.prototype.makeOutputDimensionNames = function() {
      for (var t = [], r = 0, i = 0; r < this._fullDimCount; r++) {
        var n = void 0, a = this.dimensions[i];
        if (a && a.storeDimIndex === r)
          a.isCalculationCoord || (n = a.name), i++;
        else {
          var o = this.getSourceDimension(r);
          o && (n = o.name);
        }
        t.push(n);
      }
      return t;
    }, e.prototype.appendCalculationDimension = function(t) {
      this.dimensions.push(t), t.isCalculationCoord = !0, this._fullDimCount++, this._updateDimOmitted(!0);
    }, e;
  })()
);
function yD(e) {
  return e instanceof tg;
}
function eg(e) {
  for (var t = et(), r = 0; r < (e || []).length; r++) {
    var i = e[r], n = B(i) ? i.name : i;
    n != null && t.get(n) == null && t.set(n, r);
  }
  return t;
}
function rg(e) {
  var t = _D(e);
  return t.dimNameMap || (t.dimNameMap = eg(e.dimensionsDefine));
}
function ig(e) {
  return e > 30;
}
var hn = B, nr = Q, wD = typeof Int32Array > "u" ? Array : Int32Array, bD = "e\0\0", Bc = -1, SD = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"], TD = ["_approximateExtent"], Fc, Pa, fn, pi, Qs, cn, Js, CD = (
  /** @class */
  (function() {
    function e(t, r) {
      this.type = "list", this._dimOmitted = !1, this._nameList = [], this._idList = [], this._visual = {}, this._layout = {}, this._itemVisuals = [], this._itemLayouts = [], this._graphicEls = [], this._approximateExtent = {}, this._calculationInfo = {}, this.hasItemOption = !1, this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"], this.CHANGABLE_METHODS = ["filterSelf", "selectRange"], this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"];
      var i, n = !1;
      yD(t) ? (i = t.dimensions, this._dimOmitted = t.isDimensionOmitted(), this._schema = t) : (n = !0, i = t), i = i || ["x", "y"];
      for (var a = {}, o = [], s = {}, l = !1, u = {}, h = 0; h < i.length; h++) {
        var f = i[h], c = z(f) ? new Ya({
          name: f
        }) : f instanceof Ya ? f : new Ya(f), v = c.name;
        c.type = c.type || "float", c.coordDim || (c.coordDim = v, c.coordDimIndex = 0);
        var d = c.otherDims = c.otherDims || {};
        o.push(v), a[v] = c, u[v] != null && (l = !0), c.createInvertedIndices && (s[v] = []), d.itemName === 0 && (this._nameDimIdx = h), d.itemId === 0 && (this._idDimIdx = h), process.env.NODE_ENV !== "production" && j(n || c.storeDimIndex >= 0), n && (c.storeDimIndex = h);
      }
      if (this.dimensions = o, this._dimInfos = a, this._initGetDimensionInfo(l), this.hostModel = r, this._invertedIndicesMap = s, this._dimOmitted) {
        var _ = this._dimIdxToName = et();
        D(o, function(p) {
          _.set(a[p].storeDimIndex, p);
        });
      }
    }
    return e.prototype.getDimension = function(t) {
      var r = this._recognizeDimIndex(t);
      if (r == null)
        return t;
      if (r = t, !this._dimOmitted)
        return this.dimensions[r];
      var i = this._dimIdxToName.get(r);
      if (i != null)
        return i;
      var n = this._schema.getSourceDimension(r);
      if (n)
        return n.name;
    }, e.prototype.getDimensionIndex = function(t) {
      var r = this._recognizeDimIndex(t);
      if (r != null)
        return r;
      if (t == null)
        return -1;
      var i = this._getDimInfo(t);
      return i ? i.storeDimIndex : this._dimOmitted ? this._schema.getSourceDimensionIndex(t) : -1;
    }, e.prototype._recognizeDimIndex = function(t) {
      if (yt(t) || t != null && !isNaN(t) && !this._getDimInfo(t) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(t) < 0))
        return +t;
    }, e.prototype._getStoreDimIndex = function(t) {
      var r = this.getDimensionIndex(t);
      if (process.env.NODE_ENV !== "production" && r == null)
        throw new Error("Unknown dimension " + t);
      return r;
    }, e.prototype.getDimensionInfo = function(t) {
      return this._getDimInfo(this.getDimension(t));
    }, e.prototype._initGetDimensionInfo = function(t) {
      var r = this._dimInfos;
      this._getDimInfo = t ? function(i) {
        return r.hasOwnProperty(i) ? r[i] : void 0;
      } : function(i) {
        return r[i];
      };
    }, e.prototype.getDimensionsOnCoord = function() {
      return this._dimSummary.dataDimsOnCoord.slice();
    }, e.prototype.mapDimension = function(t, r) {
      var i = this._dimSummary;
      if (r == null)
        return i.encodeFirstDimNotExtra[t];
      var n = i.encode[t];
      return n ? n[r] : null;
    }, e.prototype.mapDimensionsAll = function(t) {
      var r = this._dimSummary, i = r.encode[t];
      return (i || []).slice();
    }, e.prototype.getStore = function() {
      return this._store;
    }, e.prototype.initData = function(t, r, i) {
      var n = this, a;
      if (t instanceof Bl && (a = t), !a) {
        var o = this.dimensions, s = Bu(t) || Yt(t) ? new lp(t, o.length) : t;
        a = new Bl();
        var l = nr(o, function(u) {
          return {
            type: n._dimInfos[u].type,
            property: u
          };
        });
        a.initData(s, l, i);
      }
      this._store = a, this._nameList = (r || []).slice(), this._idList = [], this._nameRepeatCount = {}, this._doInit(0, a.count()), this._dimSummary = pD(this, this._schema), this.userOutput = this._dimSummary.userOutput;
    }, e.prototype.appendData = function(t) {
      var r = this._store.appendData(t);
      this._doInit(r[0], r[1]);
    }, e.prototype.appendValues = function(t, r) {
      var i = this._store.appendValues(t, r && r.length), n = i.start, a = i.end, o = this._shouldMakeIdFromName();
      if (this._updateOrdinalMeta(), r)
        for (var s = n; s < a; s++) {
          var l = s - n;
          this._nameList[s] = r[l], o && Js(this, s);
        }
    }, e.prototype._updateOrdinalMeta = function() {
      for (var t = this._store, r = this.dimensions, i = 0; i < r.length; i++) {
        var n = this._dimInfos[r[i]];
        n.ordinalMeta && t.collectOrdinalMeta(n.storeDimIndex, n.ordinalMeta);
      }
    }, e.prototype._shouldMakeIdFromName = function() {
      var t = this._store.getProvider();
      return this._idDimIdx == null && t.getSource().sourceFormat !== Ye && !t.fillStorage;
    }, e.prototype._doInit = function(t, r) {
      if (!(t >= r)) {
        var i = this._store, n = i.getProvider();
        this._updateOrdinalMeta();
        var a = this._nameList, o = this._idList, s = n.getSource().sourceFormat, l = s === Be;
        if (l && !n.pure)
          for (var u = [], h = t; h < r; h++) {
            var f = n.getItem(h, u);
            if (!this.hasItemOption && v1(f) && (this.hasItemOption = !0), f) {
              var c = f.name;
              a[h] == null && c != null && (a[h] = Re(c, null));
              var v = f.id;
              o[h] == null && v != null && (o[h] = Re(v, null));
            }
          }
        if (this._shouldMakeIdFromName())
          for (var h = t; h < r; h++)
            Js(this, h);
        Fc(this);
      }
    }, e.prototype.getApproximateExtent = function(t) {
      return this._approximateExtent[t] || this._store.getDataExtent(this._getStoreDimIndex(t));
    }, e.prototype.setApproximateExtent = function(t, r) {
      r = this.getDimension(r), this._approximateExtent[r] = t.slice();
    }, e.prototype.getCalculationInfo = function(t) {
      return this._calculationInfo[t];
    }, e.prototype.setCalculationInfo = function(t, r) {
      hn(t) ? I(this._calculationInfo, t) : this._calculationInfo[t] = r;
    }, e.prototype.getName = function(t) {
      var r = this.getRawIndex(t), i = this._nameList[r];
      return i == null && this._nameDimIdx != null && (i = fn(this, this._nameDimIdx, r)), i == null && (i = ""), i;
    }, e.prototype._getCategory = function(t, r) {
      var i = this._store.get(t, r), n = this._store.getOrdinalMeta(t);
      return n ? n.categories[i] : i;
    }, e.prototype.getId = function(t) {
      return Pa(this, this.getRawIndex(t));
    }, e.prototype.count = function() {
      return this._store.count();
    }, e.prototype.get = function(t, r) {
      var i = this._store, n = this._dimInfos[t];
      if (n)
        return i.get(n.storeDimIndex, r);
    }, e.prototype.getByRawIndex = function(t, r) {
      var i = this._store, n = this._dimInfos[t];
      if (n)
        return i.getByRawIndex(n.storeDimIndex, r);
    }, e.prototype.getIndices = function() {
      return this._store.getIndices();
    }, e.prototype.getDataExtent = function(t) {
      return this._store.getDataExtent(this._getStoreDimIndex(t));
    }, e.prototype.getSum = function(t) {
      return this._store.getSum(this._getStoreDimIndex(t));
    }, e.prototype.getMedian = function(t) {
      return this._store.getMedian(this._getStoreDimIndex(t));
    }, e.prototype.getValues = function(t, r) {
      var i = this, n = this._store;
      return k(t) ? n.getValues(nr(t, function(a) {
        return i._getStoreDimIndex(a);
      }), r) : n.getValues(t);
    }, e.prototype.hasValue = function(t) {
      for (var r = this._dimSummary.dataDimIndicesOnCoord, i = 0, n = r.length; i < n; i++)
        if (isNaN(this._store.get(r[i], t)))
          return !1;
      return !0;
    }, e.prototype.indexOfName = function(t) {
      for (var r = 0, i = this._store.count(); r < i; r++)
        if (this.getName(r) === t)
          return r;
      return -1;
    }, e.prototype.getRawIndex = function(t) {
      return this._store.getRawIndex(t);
    }, e.prototype.indexOfRawIndex = function(t) {
      return this._store.indexOfRawIndex(t);
    }, e.prototype.rawIndexOf = function(t, r) {
      var i = t && this._invertedIndicesMap[t];
      if (process.env.NODE_ENV !== "production" && !i)
        throw new Error("Do not supported yet");
      var n = i && i[r];
      return n == null || isNaN(n) ? Bc : n;
    }, e.prototype.indicesOfNearest = function(t, r, i) {
      return this._store.indicesOfNearest(this._getStoreDimIndex(t), r, i);
    }, e.prototype.each = function(t, r, i) {
      rt(t) && (i = r, r = t, t = []);
      var n = i || this, a = nr(pi(t), this._getStoreDimIndex, this);
      this._store.each(a, n ? lt(r, n) : r);
    }, e.prototype.filterSelf = function(t, r, i) {
      rt(t) && (i = r, r = t, t = []);
      var n = i || this, a = nr(pi(t), this._getStoreDimIndex, this);
      return this._store = this._store.filter(a, n ? lt(r, n) : r), this;
    }, e.prototype.selectRange = function(t) {
      var r = this, i = {}, n = pt(t);
      return D(n, function(a) {
        var o = r._getStoreDimIndex(a);
        i[o] = t[a];
      }), this._store = this._store.selectRange(i), this;
    }, e.prototype.mapArray = function(t, r, i) {
      rt(t) && (i = r, r = t, t = []), i = i || this;
      var n = [];
      return this.each(t, function() {
        n.push(r && r.apply(this, arguments));
      }, i), n;
    }, e.prototype.map = function(t, r, i, n) {
      var a = i || n || this, o = nr(pi(t), this._getStoreDimIndex, this), s = cn(this);
      return s._store = this._store.map(o, a ? lt(r, a) : r), s;
    }, e.prototype.modify = function(t, r, i, n) {
      var a = this, o = i || n || this;
      process.env.NODE_ENV !== "production" && D(pi(t), function(l) {
        var u = a.getDimensionInfo(l);
        u.isCalculationCoord || console.error("Danger: only stack dimension can be modified");
      });
      var s = nr(pi(t), this._getStoreDimIndex, this);
      this._store.modify(s, o ? lt(r, o) : r);
    }, e.prototype.downSample = function(t, r, i, n) {
      var a = cn(this);
      return a._store = this._store.downSample(this._getStoreDimIndex(t), r, i, n), a;
    }, e.prototype.minmaxDownSample = function(t, r) {
      var i = cn(this);
      return i._store = this._store.minmaxDownSample(this._getStoreDimIndex(t), r), i;
    }, e.prototype.lttbDownSample = function(t, r) {
      var i = cn(this);
      return i._store = this._store.lttbDownSample(this._getStoreDimIndex(t), r), i;
    }, e.prototype.getRawDataItem = function(t) {
      return this._store.getRawDataItem(t);
    }, e.prototype.getItemModel = function(t) {
      var r = this.hostModel, i = this.getRawDataItem(t);
      return new dt(i, r, r && r.ecModel);
    }, e.prototype.diff = function(t) {
      var r = this;
      return new vD(t ? t.getStore().getIndices() : [], this.getStore().getIndices(), function(i) {
        return Pa(t, i);
      }, function(i) {
        return Pa(r, i);
      });
    }, e.prototype.getVisual = function(t) {
      var r = this._visual;
      return r && r[t];
    }, e.prototype.setVisual = function(t, r) {
      this._visual = this._visual || {}, hn(t) ? I(this._visual, t) : this._visual[t] = r;
    }, e.prototype.getItemVisual = function(t, r) {
      var i = this._itemVisuals[t], n = i && i[r];
      return n ?? this.getVisual(r);
    }, e.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    }, e.prototype.ensureUniqueItemVisual = function(t, r) {
      var i = this._itemVisuals, n = i[t];
      n || (n = i[t] = {});
      var a = n[r];
      return a == null && (a = this.getVisual(r), k(a) ? a = a.slice() : hn(a) && (a = I({}, a)), n[r] = a), a;
    }, e.prototype.setItemVisual = function(t, r, i) {
      var n = this._itemVisuals[t] || {};
      this._itemVisuals[t] = n, hn(r) ? I(n, r) : n[r] = i;
    }, e.prototype.clearAllVisual = function() {
      this._visual = {}, this._itemVisuals = [];
    }, e.prototype.setLayout = function(t, r) {
      hn(t) ? I(this._layout, t) : this._layout[t] = r;
    }, e.prototype.getLayout = function(t) {
      return this._layout[t];
    }, e.prototype.getItemLayout = function(t) {
      return this._itemLayouts[t];
    }, e.prototype.setItemLayout = function(t, r, i) {
      this._itemLayouts[t] = i ? I(this._itemLayouts[t] || {}, r) : r;
    }, e.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    }, e.prototype.setItemGraphicEl = function(t, r) {
      var i = this.hostModel && this.hostModel.seriesIndex;
      Tb(i, this.dataType, t, r), this._graphicEls[t] = r;
    }, e.prototype.getItemGraphicEl = function(t) {
      return this._graphicEls[t];
    }, e.prototype.eachItemGraphicEl = function(t, r) {
      D(this._graphicEls, function(i, n) {
        i && t && t.call(r, i, n);
      });
    }, e.prototype.cloneShallow = function(t) {
      return t || (t = new e(this._schema ? this._schema : nr(this.dimensions, this._getDimInfo, this), this.hostModel)), Qs(t, this), t._store = this._store, t;
    }, e.prototype.wrapMethod = function(t, r) {
      var i = this[t];
      rt(i) && (this.__wrappedMethods = this.__wrappedMethods || [], this.__wrappedMethods.push(t), this[t] = function() {
        var n = i.apply(this, arguments);
        return r.apply(this, [n].concat(lu(arguments)));
      });
    }, e.internalField = (function() {
      Fc = function(t) {
        var r = t._invertedIndicesMap;
        D(r, function(i, n) {
          var a = t._dimInfos[n], o = a.ordinalMeta, s = t._store;
          if (o) {
            i = r[n] = new wD(o.categories.length);
            for (var l = 0; l < i.length; l++)
              i[l] = Bc;
            for (var l = 0; l < s.count(); l++)
              i[s.get(a.storeDimIndex, l)] = l;
          }
        });
      }, fn = function(t, r, i) {
        return Re(t._getCategory(r, i), null);
      }, Pa = function(t, r) {
        var i = t._idList[r];
        return i == null && t._idDimIdx != null && (i = fn(t, t._idDimIdx, r)), i == null && (i = bD + r), i;
      }, pi = function(t) {
        return k(t) || (t = t != null ? [t] : []), t;
      }, cn = function(t) {
        var r = new e(t._schema ? t._schema : nr(t.dimensions, t._getDimInfo, t), t.hostModel);
        return Qs(r, t), r;
      }, Qs = function(t, r) {
        D(SD.concat(r.__wrappedMethods || []), function(i) {
          r.hasOwnProperty(i) && (t[i] = r[i]);
        }), t.__wrappedMethods = r.__wrappedMethods, D(TD, function(i) {
          t[i] = tt(r[i]);
        }), t._calculationInfo = I({}, r._calculationInfo);
      }, Js = function(t, r) {
        var i = t._nameList, n = t._idList, a = t._nameDimIdx, o = t._idDimIdx, s = i[r], l = n[r];
        if (s == null && a != null && (i[r] = s = fn(t, a, r)), l == null && o != null && (n[r] = l = fn(t, o, r)), l == null && s != null) {
          var u = t._nameRepeatCount, h = u[s] = (u[s] || 0) + 1;
          l = s, h > 1 && (l += "__ec__" + h), n[r] = l;
        }
      };
    })(), e;
  })()
);
function xD(e, t) {
  Bu(e) || (e = ap(e)), t = t || {};
  var r = t.coordDimensions || [], i = t.dimensionsDefine || e.dimensionsDefine || [], n = et(), a = [], o = ED(e, r, i, t.dimensionsCount), s = t.canOmitUnusedDimensions && ig(o), l = i === e.dimensionsDefine, u = l ? rg(e) : eg(i), h = t.encodeDefine;
  !h && t.encodeDefaulter && (h = t.encodeDefaulter(e, o));
  for (var f = et(h), c = new vp(o), v = 0; v < c.length; v++)
    c[v] = -1;
  function d(x) {
    var E = c[x];
    if (E < 0) {
      var A = i[x], M = B(A) ? A : {
        name: A
      }, L = new Ya(), P = M.name;
      P != null && u.get(P) != null && (L.name = L.displayName = P), M.type != null && (L.type = M.type), M.displayName != null && (L.displayName = M.displayName);
      var O = a.length;
      return c[x] = O, L.storeDimIndex = x, a.push(L), L;
    }
    return a[E];
  }
  if (!s)
    for (var v = 0; v < o; v++)
      d(v);
  f.each(function(x, E) {
    var A = Nt(x).slice();
    if (A.length === 1 && !z(A[0]) && A[0] < 0) {
      f.set(E, !1);
      return;
    }
    var M = f.set(E, []);
    D(A, function(L, P) {
      var O = z(L) ? u.get(L) : L;
      O != null && O < o && (M[P] = O, p(d(O), E, P));
    });
  });
  var _ = 0;
  D(r, function(x) {
    var E, A, M, L;
    if (z(x))
      E = x, L = {};
    else {
      L = x, E = L.name;
      var P = L.ordinalMeta;
      L.ordinalMeta = null, L = I({}, L), L.ordinalMeta = P, A = L.dimsDef, M = L.otherDims, L.name = L.coordDim = L.coordDimIndex = L.dimsDef = L.otherDims = null;
    }
    var O = f.get(E);
    if (O !== !1) {
      if (O = Nt(O), !O.length)
        for (var R = 0; R < (A && A.length || 1); R++) {
          for (; _ < o && d(_).coordDim != null; )
            _++;
          _ < o && O.push(_++);
        }
      D(O, function(U, q) {
        var $ = d(U);
        if (l && L.type != null && ($.type = L.type), p(ht($, L), E, q), $.name == null && A) {
          var Z = A[q];
          !B(Z) && (Z = {
            name: Z
          }), $.name = $.displayName = Z.name, $.defaultTooltip = Z.defaultTooltip;
        }
        M && ht($.otherDims, M);
      });
    }
  });
  function p(x, E, A) {
    Nl.get(E) != null ? x.otherDims[E] = A : (x.coordDim = E, x.coordDimIndex = A, n.set(E, !0));
  }
  var g = t.generateCoord, m = t.generateCoordCount, y = m != null;
  m = g ? m || 1 : 0;
  var w = g || "value";
  function S(x) {
    x.name == null && (x.name = x.coordDim);
  }
  if (s)
    D(a, function(x) {
      S(x);
    }), a.sort(function(x, E) {
      return x.storeDimIndex - E.storeDimIndex;
    });
  else
    for (var b = 0; b < o; b++) {
      var T = d(b), C = T.coordDim;
      C == null && (T.coordDim = AD(w, n, y), T.coordDimIndex = 0, (!g || m <= 0) && (T.isExtraCoord = !0), m--), S(T), T.type == null && (Jd(e, b) === Dt.Must || T.isExtraCoord && (T.otherDims.itemName != null || T.otherDims.seriesName != null)) && (T.type = "ordinal");
    }
  return DD(a), new tg({
    source: e,
    dimensions: a,
    fullDimensionCount: o,
    dimensionOmitted: s
  });
}
function DD(e) {
  for (var t = et(), r = 0; r < e.length; r++) {
    var i = e[r], n = i.name, a = t.get(n) || 0;
    a > 0 && (i.name = n + (a - 1)), a++, t.set(n, a);
  }
}
function ED(e, t, r, i) {
  var n = Math.max(e.dimensionsDetectedCount || 1, t.length, r.length, i || 0);
  return D(t, function(a) {
    var o;
    B(a) && (o = a.dimsDef) && (n = Math.max(n, o.length));
  }), n;
}
function AD(e, t, r) {
  if (r || t.hasKey(e)) {
    for (var i = 0; t.hasKey(e + i); )
      i++;
    e += i;
  }
  return t.set(e, !0), e;
}
function ng(e, t) {
  return e.type === "category" ? e.scale.getLabel(t) : t.value;
}
function MD(e) {
  var t = e.get("interval");
  return t ?? "auto";
}
function PD(e) {
  return e.type === "category" && MD(e.getLabelModel()) === 0;
}
var Vc = [], LD = {
  registerPreprocessor: jp,
  registerProcessor: Qp,
  registerPostInit: sD,
  registerPostUpdate: lD,
  registerUpdateLifecycle: Gu,
  registerAction: Gi,
  registerCoordinateSystem: uD,
  registerLayout: hD,
  registerVisual: ti,
  registerTransform: cD,
  registerLoading: Jp,
  registerMap: fD,
  registerImpl: zx,
  PRIORITY: tD,
  ComponentModel: nt,
  ComponentView: gr,
  SeriesModel: pr,
  ChartView: vr,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(e) {
    nt.registerClass(e);
  },
  registerComponentView: function(e) {
    gr.registerClass(e);
  },
  registerSeriesModel: function(e) {
    pr.registerClass(e);
  },
  registerChartView: function(e) {
    vr.registerClass(e);
  },
  registerSubTypeDefaulter: function(e, t) {
    nt.registerSubTypeDefaulter(e, t);
  },
  registerPainter: function(e, t) {
    e1(e, t);
  }
};
function Yu(e) {
  if (k(e)) {
    D(e, function(t) {
      Yu(t);
    });
    return;
  }
  st(Vc, e) >= 0 || (Vc.push(e), rt(e) && (e = {
    install: e
  }), e.install(LD));
}
function ag(e, t, r, i, n, a, o, s) {
  var l = n - e, u = a - t, h = r - e, f = i - t, c = Math.sqrt(h * h + f * f);
  h /= c, f /= c;
  var v = l * h + u * f, d = v / c;
  d *= c;
  var _ = o[0] = e + d * h, p = o[1] = t + d * f;
  return Math.sqrt((_ - n) * (_ - n) + (p - a) * (p - a));
}
var ur = new G(), ut = new G(), Et = new G(), hr = new G(), Me = new G(), xo = [], Ot = new G();
function ID(e, t) {
  if (t <= 180 && t > 0) {
    t = t / 180 * Math.PI, ur.fromArray(e[0]), ut.fromArray(e[1]), Et.fromArray(e[2]), G.sub(hr, ur, ut), G.sub(Me, Et, ut);
    var r = hr.len(), i = Me.len();
    if (!(r < 1e-3 || i < 1e-3)) {
      hr.scale(1 / r), Me.scale(1 / i);
      var n = hr.dot(Me), a = Math.cos(t);
      if (a < n) {
        var o = ag(ut.x, ut.y, Et.x, Et.y, ur.x, ur.y, xo);
        Ot.fromArray(xo), Ot.scaleAndAdd(Me, o / Math.tan(Math.PI - t));
        var s = Et.x !== ut.x ? (Ot.x - ut.x) / (Et.x - ut.x) : (Ot.y - ut.y) / (Et.y - ut.y);
        if (isNaN(s))
          return;
        s < 0 ? G.copy(Ot, ut) : s > 1 && G.copy(Ot, Et), Ot.toArray(e[1]);
      }
    }
  }
}
function RD(e, t, r) {
  if (r <= 180 && r > 0) {
    r = r / 180 * Math.PI, ur.fromArray(e[0]), ut.fromArray(e[1]), Et.fromArray(e[2]), G.sub(hr, ut, ur), G.sub(Me, Et, ut);
    var i = hr.len(), n = Me.len();
    if (!(i < 1e-3 || n < 1e-3)) {
      hr.scale(1 / i), Me.scale(1 / n);
      var a = hr.dot(t), o = Math.cos(r);
      if (a < o) {
        var s = ag(ut.x, ut.y, Et.x, Et.y, ur.x, ur.y, xo);
        Ot.fromArray(xo);
        var l = Math.PI / 2, u = Math.acos(Me.dot(t)), h = l + u - r;
        if (h >= l)
          G.copy(Ot, Et);
        else {
          Ot.scaleAndAdd(Me, s / Math.tan(Math.PI / 2 - h));
          var f = Et.x !== ut.x ? (Ot.x - ut.x) / (Et.x - ut.x) : (Ot.y - ut.y) / (Et.y - ut.y);
          if (isNaN(f))
            return;
          f < 0 ? G.copy(Ot, ut) : f > 1 && G.copy(Ot, Et);
        }
        Ot.toArray(e[1]);
      }
    }
  }
}
function tl(e, t, r, i) {
  var n = r === "normal", a = n ? e : e.ensureState(r);
  a.ignore = t;
  var o = i.get("smooth");
  o && o === !0 && (o = 0.3), a.shape = a.shape || {}, o > 0 && (a.shape.smooth = o);
  var s = i.getModel("lineStyle").getLineStyle();
  n ? e.useStyle(s) : a.style = s;
}
function OD(e, t) {
  var r = t.smooth, i = t.points;
  if (i)
    if (e.moveTo(i[0][0], i[0][1]), r > 0 && i.length >= 3) {
      var n = hl(i[0], i[1]), a = hl(i[1], i[2]);
      if (!n || !a) {
        e.lineTo(i[1][0], i[1][1]), e.lineTo(i[2][0], i[2][1]);
        return;
      }
      var o = Math.min(n, a) * r, s = Zo([], i[1], i[0], o / n), l = Zo([], i[1], i[2], o / a), u = Zo([], s, l, 0.5);
      e.bezierCurveTo(s[0], s[1], s[0], s[1], u[0], u[1]), e.bezierCurveTo(l[0], l[1], l[0], l[1], i[2][0], i[2][1]);
    } else
      for (var h = 1; h < i.length; h++)
        e.lineTo(i[h][0], i[h][1]);
}
function kD(e, t, r) {
  var i = e.getTextGuideLine(), n = e.getTextContent();
  if (!n) {
    i && e.removeTextGuideLine();
    return;
  }
  for (var a = t.normal, o = a.get("show"), s = n.ignore, l = 0; l < lo.length; l++) {
    var u = lo[l], h = t[u], f = u === "normal";
    if (h) {
      var c = h.get("show"), v = f ? s : X(n.states[u] && n.states[u].ignore, s);
      if (v || !X(c, o)) {
        var d = f ? i : i && i.states[u];
        d && (d.ignore = !0), i && tl(i, !0, u, h);
        continue;
      }
      i || (i = new ra(), e.setTextGuideLine(i), !f && (s || !o) && tl(i, !0, "normal", t.normal), e.stateProxy && (i.stateProxy = e.stateProxy)), tl(i, !1, u, h);
    }
  }
  if (i) {
    ht(i.style, r), i.style.fill = null;
    var _ = a.get("showAbove"), p = e.textGuideLineConfig = e.textGuideLineConfig || {};
    p.showAbove = _ || !1, i.buildPath = OD;
  }
}
function ND(e, t) {
  t = t || "labelLine";
  for (var r = {
    normal: e.getModel(t)
  }, i = 0; i < ke.length; i++) {
    var n = ke[i];
    r[n] = e.getModel([n, t]);
  }
  return r;
}
function $D(e) {
  for (var t = [], r = 0; r < e.length; r++) {
    var i = e[r];
    if (!i.defaultAttr.ignore) {
      var n = i.label, a = n.getComputedTransform(), o = n.getBoundingRect(), s = !a || a[1] < 1e-5 && a[2] < 1e-5, l = n.style.margin || 0, u = o.clone();
      u.applyTransform(a), u.x -= l / 2, u.y -= l / 2, u.width += l, u.height += l;
      var h = s ? new uo(o, a) : null;
      t.push({
        label: n,
        labelLine: i.labelLine,
        rect: u,
        localRect: o,
        obb: h,
        priority: i.priority,
        defaultAttr: i.defaultAttr,
        layoutOption: i.computedLayoutOption,
        axisAligned: s,
        transform: a
      });
    }
  }
  return t;
}
function BD(e, t, r, i, n, a) {
  var o = e.length;
  if (o < 2)
    return;
  e.sort(function(b, T) {
    return b.rect[t] - T.rect[t];
  });
  for (var s = 0, l, u = !1, h = 0; h < o; h++) {
    var f = e[h], c = f.rect;
    l = c[t] - s, l < 0 && (c[t] -= l, f.label[t] -= l, u = !0), s = c[t] + c[r];
  }
  var v = e[0], d = e[o - 1], _, p;
  g(), _ < 0 && w(-_, 0.8), p < 0 && w(p, 0.8), g(), m(_, p, 1), m(p, _, -1), g(), _ < 0 && S(-_), p < 0 && S(p);
  function g() {
    _ = v.rect[t] - i, p = n - d.rect[t] - d.rect[r];
  }
  function m(b, T, C) {
    if (b < 0) {
      var x = Math.min(T, -b);
      if (x > 0) {
        y(x * C, 0, o);
        var E = x + b;
        E < 0 && w(-E * C, 1);
      } else
        w(-b * C, 1);
    }
  }
  function y(b, T, C) {
    b !== 0 && (u = !0);
    for (var x = T; x < C; x++) {
      var E = e[x], A = E.rect;
      A[t] += b, E.label[t] += b;
    }
  }
  function w(b, T) {
    for (var C = [], x = 0, E = 1; E < o; E++) {
      var A = e[E - 1].rect, M = Math.max(e[E].rect[t] - A[t] - A[r], 0);
      C.push(M), x += M;
    }
    if (x) {
      var L = Math.min(Math.abs(b) / x, T);
      if (b > 0)
        for (var E = 0; E < o - 1; E++) {
          var P = C[E] * L;
          y(P, 0, E + 1);
        }
      else
        for (var E = o - 1; E > 0; E--) {
          var P = C[E - 1] * L;
          y(-P, E, o);
        }
    }
  }
  function S(b) {
    var T = b < 0 ? -1 : 1;
    b = Math.abs(b);
    for (var C = Math.ceil(b / (o - 1)), x = 0; x < o - 1; x++)
      if (T > 0 ? y(C, 0, x + 1) : y(-C, o - x - 1, o), b -= C, b <= 0)
        return;
  }
  return u;
}
function FD(e, t, r, i) {
  return BD(e, "y", "height", t, r);
}
function VD(e) {
  var t = [];
  e.sort(function(_, p) {
    return p.priority - _.priority;
  });
  var r = new at(0, 0, 0, 0);
  function i(_) {
    if (!_.ignore) {
      var p = _.ensureState("emphasis");
      p.ignore == null && (p.ignore = !1);
    }
    _.ignore = !0;
  }
  for (var n = 0; n < e.length; n++) {
    var a = e[n], o = a.axisAligned, s = a.localRect, l = a.transform, u = a.label, h = a.labelLine;
    r.copy(a.rect), r.width -= 0.1, r.height -= 0.1, r.x += 0.05, r.y += 0.05;
    for (var f = a.obb, c = !1, v = 0; v < t.length; v++) {
      var d = t[v];
      if (r.intersect(d.rect)) {
        if (o && d.axisAligned) {
          c = !0;
          break;
        }
        if (d.obb || (d.obb = new uo(d.localRect, d.transform)), f || (f = new uo(s, l)), f.intersect(d.obb)) {
          c = !0;
          break;
        }
      }
    }
    c ? (i(u), h && i(h)) : (u.attr("ignore", a.defaultAttr.ignore), h && h.attr("ignore", a.defaultAttr.labelGuideIgnore), t.push(a));
  }
}
function La(e, t, r) {
  var i = e.get("borderRadius");
  if (i == null)
    return r ? {
      cornerRadius: 0
    } : null;
  k(i) || (i = [i, i, i, i]);
  var n = Math.abs(t.r || 0 - t.r0 || 0);
  return {
    cornerRadius: Q(i, function(a) {
      return Oi(a, n);
    })
  };
}
var zc = Math.PI * 2, Ia = Math.PI / 180;
function og(e, t) {
  return qd(e.getBoxLayoutParams(), {
    width: t.getWidth(),
    height: t.getHeight()
  });
}
function sg(e, t) {
  var r = og(e, t), i = e.get("center"), n = e.get("radius");
  k(n) || (n = [0, n]);
  var a = wt(r.width, t.getWidth()), o = wt(r.height, t.getHeight()), s = Math.min(a, o), l = wt(n[0], s / 2), u = wt(n[1], s / 2), h, f, c = e.coordinateSystem;
  if (c) {
    var v = c.dataToPoint(i);
    h = v[0] || 0, f = v[1] || 0;
  } else
    k(i) || (i = [i, i]), h = wt(i[0], a) + r.x, f = wt(i[1], o) + r.y;
  return {
    cx: h,
    cy: f,
    r0: l,
    r: u
  };
}
function zD(e, t, r) {
  t.eachSeriesByType(e, function(i) {
    var n = i.getData(), a = n.mapDimension("value"), o = og(i, r), s = sg(i, r), l = s.cx, u = s.cy, h = s.r, f = s.r0, c = -i.get("startAngle") * Ia, v = i.get("endAngle"), d = i.get("padAngle") * Ia;
    v = v === "auto" ? c - zc : -v * Ia;
    var _ = i.get("minAngle") * Ia, p = _ + d, g = 0;
    n.each(a, function(U) {
      !isNaN(U) && g++;
    });
    var m = n.getSum(a), y = Math.PI / (m || g) * 2, w = i.get("clockwise"), S = i.get("roseType"), b = i.get("stillShowZeroSum"), T = n.getDataExtent(a);
    T[0] = 0;
    var C = w ? 1 : -1, x = [c, v], E = C * d / 2;
    hd(x, !w), c = x[0], v = x[1];
    var A = lg(i);
    A.startAngle = c, A.endAngle = v, A.clockwise = w;
    var M = Math.abs(v - c), L = M, P = 0, O = c;
    if (n.setLayout({
      viewRect: o,
      r: h
    }), n.each(a, function(U, q) {
      var $;
      if (isNaN(U)) {
        n.setItemLayout(q, {
          angle: NaN,
          startAngle: NaN,
          endAngle: NaN,
          clockwise: w,
          cx: l,
          cy: u,
          r0: f,
          r: S ? NaN : h
        });
        return;
      }
      S !== "area" ? $ = m === 0 && b ? y : U * y : $ = M / g, $ < p ? ($ = p, L -= p) : P += U;
      var Z = O + C * $, J = 0, Y = 0;
      d > $ ? (J = O + C * $ / 2, Y = J) : (J = O + E, Y = Z - E), n.setItemLayout(q, {
        angle: $,
        startAngle: J,
        endAngle: Y,
        clockwise: w,
        cx: l,
        cy: u,
        r0: f,
        r: S ? i1(U, T, [f, h]) : h
      }), O = Z;
    }), L < zc && g)
      if (L <= 1e-3) {
        var R = M / g;
        n.each(a, function(U, q) {
          if (!isNaN(U)) {
            var $ = n.getItemLayout(q);
            $.angle = R;
            var Z = 0, J = 0;
            R < d ? (Z = c + C * (q + 1 / 2) * R, J = Z) : (Z = c + C * q * R + E, J = c + C * (q + 1) * R - E), $.startAngle = Z, $.endAngle = J;
          }
        });
      } else
        y = L / P, O = c, n.each(a, function(U, q) {
          if (!isNaN(U)) {
            var $ = n.getItemLayout(q), Z = $.angle === p ? p : U * y, J = 0, Y = 0;
            Z < d ? (J = O + C * Z / 2, Y = J) : (J = O + E, Y = O + C * Z - E), $.startAngle = J, $.endAngle = Y, O += C * Z;
          }
        });
  });
}
var lg = St();
function HD(e) {
  return {
    seriesType: e,
    reset: function(t, r) {
      var i = r.findComponents({
        mainType: "legend"
      });
      if (!(!i || !i.length)) {
        var n = t.getData();
        n.filterSelf(function(a) {
          for (var o = n.getName(a), s = 0; s < i.length; s++)
            if (!i[s].isSelected(o))
              return !1;
          return !0;
        });
      }
    }
  };
}
var UD = Math.PI / 180;
function Hc(e, t, r, i, n, a, o, s, l, u) {
  if (e.length < 2)
    return;
  function h(_) {
    for (var p = _.rB, g = p * p, m = 0; m < _.list.length; m++) {
      var y = _.list[m], w = Math.abs(y.label.y - r), S = i + y.len, b = S * S, T = Math.sqrt(Math.abs((1 - w * w / g) * b)), C = t + (T + y.len2) * n, x = C - y.label.x, E = y.targetTextWidth - x * n;
      ug(y, E, !0), y.label.x = C;
    }
  }
  function f(_) {
    for (var p = {
      list: [],
      maxY: 0
    }, g = {
      list: [],
      maxY: 0
    }, m = 0; m < _.length; m++)
      if (_[m].labelAlignTo === "none") {
        var y = _[m], w = y.label.y > r ? g : p, S = Math.abs(y.label.y - r);
        if (S >= w.maxY) {
          var b = y.label.x - t - y.len2 * n, T = i + y.len, C = Math.abs(b) < T ? Math.sqrt(S * S / (1 - b * b / T / T)) : T;
          w.rB = C, w.maxY = S;
        }
        w.list.push(y);
      }
    h(p), h(g);
  }
  for (var c = e.length, v = 0; v < c; v++)
    if (e[v].position === "outer" && e[v].labelAlignTo === "labelLine") {
      var d = e[v].label.x - u;
      e[v].linePoints[1][0] += d, e[v].label.x = u;
    }
  FD(e, l, l + o) && f(e);
}
function GD(e, t, r, i, n, a, o, s) {
  for (var l = [], u = [], h = Number.MAX_VALUE, f = -Number.MAX_VALUE, c = 0; c < e.length; c++) {
    var v = e[c].label;
    el(e[c]) || (v.x < t ? (h = Math.min(h, v.x), l.push(e[c])) : (f = Math.max(f, v.x), u.push(e[c])));
  }
  for (var c = 0; c < e.length; c++) {
    var d = e[c];
    if (!el(d) && d.linePoints) {
      if (d.labelStyleWidth != null)
        continue;
      var v = d.label, _ = d.linePoints, p = void 0;
      d.labelAlignTo === "edge" ? v.x < t ? p = _[2][0] - d.labelDistance - o - d.edgeDistance : p = o + n - d.edgeDistance - _[2][0] - d.labelDistance : d.labelAlignTo === "labelLine" ? v.x < t ? p = h - o - d.bleedMargin : p = o + n - f - d.bleedMargin : v.x < t ? p = v.x - o - d.bleedMargin : p = o + n - v.x - d.bleedMargin, d.targetTextWidth = p, ug(d, p);
    }
  }
  Hc(u, t, r, i, 1, n, a, o, s, f), Hc(l, t, r, i, -1, n, a, o, s, h);
  for (var c = 0; c < e.length; c++) {
    var d = e[c];
    if (!el(d) && d.linePoints) {
      var v = d.label, _ = d.linePoints, g = d.labelAlignTo === "edge", m = v.style.padding, y = m ? m[1] + m[3] : 0, w = v.style.backgroundColor ? 0 : y, S = d.rect.width + w, b = _[1][0] - _[2][0];
      g ? v.x < t ? _[2][0] = o + d.edgeDistance + S + d.labelDistance : _[2][0] = o + n - d.edgeDistance - S - d.labelDistance : (v.x < t ? _[2][0] = v.x + d.labelDistance : _[2][0] = v.x - d.labelDistance, _[1][0] = _[2][0] + b), _[1][1] = _[2][1] = v.y;
    }
  }
}
function ug(e, t, r) {
  if (r === void 0 && (r = !1), e.labelStyleWidth == null) {
    var i = e.label, n = i.style, a = e.rect, o = n.backgroundColor, s = n.padding, l = s ? s[1] + s[3] : 0, u = n.overflow, h = a.width + (o ? 0 : l);
    if (t < h || r) {
      var f = a.height;
      if (u && u.match("break")) {
        i.setStyle("backgroundColor", null), i.setStyle("width", t - l);
        var c = i.getBoundingRect();
        i.setStyle("width", Math.ceil(c.width)), i.setStyle("backgroundColor", o);
      } else {
        var v = t - l, d = t < h ? v : (
          // Current available width is enough, but the text may have
          // already been wrapped with a smaller available width.
          r ? v > e.unconstrainedWidth ? null : v : null
        );
        i.setStyle("width", d);
      }
      var _ = i.getBoundingRect();
      a.width = _.width;
      var p = (i.style.margin || 0) + 2.1;
      a.height = _.height + p, a.y -= (a.height - f) / 2;
    }
  }
}
function el(e) {
  return e.position === "center";
}
function WD(e) {
  var t = e.getData(), r = [], i, n, a = !1, o = (e.get("minShowLabelAngle") || 0) * UD, s = t.getLayout("viewRect"), l = t.getLayout("r"), u = s.width, h = s.x, f = s.y, c = s.height;
  function v(b) {
    b.ignore = !0;
  }
  function d(b) {
    if (!b.ignore)
      return !0;
    for (var T in b.states)
      if (b.states[T].ignore === !1)
        return !0;
    return !1;
  }
  t.each(function(b) {
    var T = t.getItemGraphicEl(b), C = T.shape, x = T.getTextContent(), E = T.getTextGuideLine(), A = t.getItemModel(b), M = A.getModel("label"), L = M.get("position") || A.get(["emphasis", "label", "position"]), P = M.get("distanceToLabelLine"), O = M.get("alignTo"), R = wt(M.get("edgeDistance"), u), U = M.get("bleedMargin"), q = A.getModel("labelLine"), $ = q.get("length");
    $ = wt($, u);
    var Z = q.get("length2");
    if (Z = wt(Z, u), Math.abs(C.endAngle - C.startAngle) < o) {
      D(x.states, v), x.ignore = !0, E && (D(E.states, v), E.ignore = !0);
      return;
    }
    if (d(x)) {
      var J = (C.startAngle + C.endAngle) / 2, Y = Math.cos(J), _t = Math.sin(J), Tt, qt, Se, ee;
      i = C.cx, n = C.cy;
      var Zt = L === "inside" || L === "inner";
      if (L === "center")
        Tt = C.cx, qt = C.cy, ee = "center";
      else {
        var xt = (Zt ? (C.r + C.r0) / 2 * Y : C.r * Y) + i, ft = (Zt ? (C.r + C.r0) / 2 * _t : C.r * _t) + n;
        if (Tt = xt + Y * 3, qt = ft + _t * 3, !Zt) {
          var H = xt + Y * ($ + l - C.r), K = ft + _t * ($ + l - C.r), Te = H + (Y < 0 ? -1 : 1) * Z, Ct = K;
          O === "edge" ? Tt = Y < 0 ? h + R : h + u - R : Tt = Te + (Y < 0 ? -P : P), qt = Ct, Se = [[xt, ft], [H, K], [Te, Ct]];
        }
        ee = Zt ? "center" : O === "edge" ? Y > 0 ? "right" : "left" : Y > 0 ? "left" : "right";
      }
      var Qe = Math.PI, Ve = 0, Wi = M.get("rotate");
      if (yt(Wi))
        Ve = Wi * (Qe / 180);
      else if (L === "center")
        Ve = 0;
      else if (Wi === "radial" || Wi === !0) {
        var wg = Y < 0 ? -J + Qe : -J;
        Ve = wg;
      } else if (Wi === "tangential" && L !== "outside" && L !== "outer") {
        var ei = Math.atan2(Y, _t);
        ei < 0 && (ei = Qe * 2 + ei);
        var bg = _t > 0;
        bg && (ei = Qe + ei), Ve = ei - Qe;
      }
      if (a = !!Ve, x.x = Tt, x.y = qt, x.rotation = Ve, x.setStyle({
        verticalAlign: "middle"
      }), Zt) {
        x.setStyle({
          align: ee
        });
        var Yo = x.states.select;
        Yo && (Yo.x += x.x, Yo.y += x.y);
      } else {
        var Yi = x.getBoundingRect().clone();
        Yi.applyTransform(x.getComputedTransform());
        var Ku = (x.style.margin || 0) + 2.1;
        Yi.y -= Ku / 2, Yi.height += Ku, r.push({
          label: x,
          labelLine: E,
          position: L,
          len: $,
          len2: Z,
          minTurnAngle: q.get("minTurnAngle"),
          maxSurfaceAngle: q.get("maxSurfaceAngle"),
          surfaceNormal: new G(Y, _t),
          linePoints: Se,
          textAlign: ee,
          labelDistance: P,
          labelAlignTo: O,
          edgeDistance: R,
          bleedMargin: U,
          rect: Yi,
          unconstrainedWidth: Yi.width,
          labelStyleWidth: x.style.width
        });
      }
      T.setTextConfig({
        inside: Zt
      });
    }
  }), !a && e.get("avoidLabelOverlap") && GD(r, i, n, l, u, c, h, f);
  for (var _ = 0; _ < r.length; _++) {
    var p = r[_], g = p.label, m = p.labelLine, y = isNaN(g.x) || isNaN(g.y);
    if (g) {
      g.setStyle({
        align: p.textAlign
      }), y && (D(g.states, v), g.ignore = !0);
      var w = g.states.select;
      w && (w.x += g.x, w.y += g.y);
    }
    if (m) {
      var S = p.linePoints;
      y || !S ? (D(m.states, v), m.ignore = !0) : (ID(S, p.minTurnAngle), RD(S, p.surfaceNormal, p.maxSurfaceAngle), m.setShape({
        points: S
      }), g.__hostTarget.textGuideLineConfig = {
        anchor: new G(S[0][0], S[0][1])
      });
    }
  }
}
var YD = (
  /** @class */
  (function(e) {
    W(t, e);
    function t(r, i, n) {
      var a = e.call(this) || this;
      a.z2 = 2;
      var o = new ye();
      return a.setTextContent(o), a.updateData(r, i, n, !0), a;
    }
    return t.prototype.updateData = function(r, i, n, a) {
      var o = this, s = r.hostModel, l = r.getItemModel(i), u = l.getModel("emphasis"), h = r.getItemLayout(i), f = I(La(l.getModel("itemStyle"), h, !0), h);
      if (isNaN(f.startAngle)) {
        o.setShape(f);
        return;
      }
      if (a) {
        o.setShape(f);
        var c = s.getShallow("animationType");
        s.ecModel.ssr ? (Ha(o, {
          scaleX: 0,
          scaleY: 0
        }, s, {
          dataIndex: i,
          isFrom: !0
        }), o.originX = f.cx, o.originY = f.cy) : c === "scale" ? (o.shape.r = h.r0, Ha(o, {
          shape: {
            r: h.r
          }
        }, s, i)) : n != null ? (o.setShape({
          startAngle: n,
          endAngle: n
        }), Ha(o, {
          shape: {
            startAngle: h.startAngle,
            endAngle: h.endAngle
          }
        }, s, i)) : (o.shape.endAngle = h.startAngle, zn(o, {
          shape: {
            endAngle: h.endAngle
          }
        }, s, i));
      } else
        CS(o), zn(o, {
          shape: f
        }, s, i);
      o.useStyle(r.getItemVisual(i, "style")), Gb(o, l);
      var v = (h.startAngle + h.endAngle) / 2, d = s.get("selectedOffset"), _ = Math.cos(v) * d, p = Math.sin(v) * d, g = l.getShallow("cursor");
      g && o.attr("cursor", g), this._updateLabel(s, r, i), o.ensureState("emphasis").shape = I({
        r: h.r + (u.get("scale") && u.get("scaleSize") || 0)
      }, La(u.getModel("itemStyle"), h)), I(o.ensureState("select"), {
        x: _,
        y: p,
        shape: La(l.getModel(["select", "itemStyle"]), h)
      }), I(o.ensureState("blur"), {
        shape: La(l.getModel(["blur", "itemStyle"]), h)
      });
      var m = o.getTextGuideLine(), y = o.getTextContent();
      m && I(m.ensureState("select"), {
        x: _,
        y: p
      }), I(y.ensureState("select"), {
        x: _,
        y: p
      }), zb(this, u.get("focus"), u.get("blurScope"), u.get("disabled"));
    }, t.prototype._updateLabel = function(r, i, n) {
      var a = this, o = i.getItemModel(n), s = o.getModel("labelLine"), l = i.getItemVisual(n, "style"), u = l && l.fill, h = l && l.opacity;
      HS(a, US(o), {
        labelFetcher: i.hostModel,
        labelDataIndex: n,
        inheritColor: u,
        defaultOpacity: h,
        defaultText: r.getFormattedLabel(n, "normal") || i.getName(n)
      });
      var f = a.getTextContent();
      a.setTextConfig({
        // reset position, rotation
        position: null,
        rotation: null
      }), f.attr({
        z2: 10
      });
      var c = r.get(["label", "position"]);
      if (c !== "outside" && c !== "outer")
        a.removeTextGuideLine();
      else {
        var v = this.getTextGuideLine();
        v || (v = new ra(), this.setTextGuideLine(v)), kD(this, ND(o), {
          stroke: u,
          opacity: Sn(s.get(["lineStyle", "opacity"]), h, 1)
        });
      }
    }, t;
  })(ea)
), XD = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.ignoreLabelLineUpdate = !0, r;
    }
    return t.prototype.render = function(r, i, n, a) {
      var o = r.getData(), s = this._data, l = this.group, u;
      if (!s && o.count() > 0) {
        for (var h = o.getItemLayout(0), f = 1; isNaN(h && h.startAngle) && f < o.count(); ++f)
          h = o.getItemLayout(f);
        h && (u = h.startAngle);
      }
      if (this._emptyCircleSector && l.remove(this._emptyCircleSector), o.count() === 0 && r.get("showEmptyCircle")) {
        var c = lg(r), v = new ea({
          shape: I(sg(r, n), c)
        });
        v.useStyle(r.getModel("emptyCircleStyle").getItemStyle()), this._emptyCircleSector = v, l.add(v);
      }
      o.diff(s).add(function(d) {
        var _ = new YD(o, d, u);
        o.setItemGraphicEl(d, _), l.add(_);
      }).update(function(d, _) {
        var p = s.getItemGraphicEl(_);
        p.updateData(o, d, u), p.off("click"), l.add(p), o.setItemGraphicEl(d, p);
      }).remove(function(d) {
        var _ = s.getItemGraphicEl(d);
        Rd(_, r, d);
      }).execute(), WD(r), r.get("animationTypeUpdate") !== "expansion" && (this._data = o);
    }, t.prototype.dispose = function() {
    }, t.prototype.containPoint = function(r, i) {
      var n = i.getData(), a = n.getItemLayout(0);
      if (a) {
        var o = r[0] - a.cx, s = r[1] - a.cy, l = Math.sqrt(o * o + s * s);
        return l <= a.r && l >= a.r0;
      }
    }, t.type = "pie", t;
  })(vr)
);
function qD(e, t, r) {
  t = k(t) && {
    coordDimensions: t
  } || I({
    encodeDefine: e.getEncode()
  }, t);
  var i = e.getSource(), n = xD(i, t).dimensions, a = new CD(n, e);
  return a.initData(i, r), a;
}
var ZD = (
  /** @class */
  (function() {
    function e(t, r) {
      this._getDataWithEncodedVisual = t, this._getRawData = r;
    }
    return e.prototype.getAllNames = function() {
      var t = this._getRawData();
      return t.mapArray(t.getName);
    }, e.prototype.containName = function(t) {
      var r = this._getRawData();
      return r.indexOfName(t) >= 0;
    }, e.prototype.indexOfName = function(t) {
      var r = this._getDataWithEncodedVisual();
      return r.indexOfName(t);
    }, e.prototype.getItemVisual = function(t, r) {
      var i = this._getDataWithEncodedVisual();
      return i.getItemVisual(t, r);
    }, e;
  })()
), KD = St(), jD = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.init = function(r) {
      e.prototype.init.apply(this, arguments), this.legendVisualProvider = new ZD(lt(this.getData, this), lt(this.getRawData, this)), this._defaultLabelLine(r);
    }, t.prototype.mergeOption = function() {
      e.prototype.mergeOption.apply(this, arguments);
    }, t.prototype.getInitialData = function() {
      return qD(this, {
        coordDimensions: ["value"],
        encodeDefaulter: Jt(CT, this)
      });
    }, t.prototype.getDataParams = function(r) {
      var i = this.getData(), n = KD(i), a = n.seats;
      if (!a) {
        var o = [];
        i.each(i.mapDimension("value"), function(l) {
          o.push(l);
        }), a = n.seats = o1(o, i.hostModel.get("percentPrecision"));
      }
      var s = e.prototype.getDataParams.call(this, r);
      return s.percent = a[r] || 0, s.$vars.push("percent"), s;
    }, t.prototype._defaultLabelLine = function(r) {
      Cl(r, "labelLine", ["show"]);
      var i = r.labelLine, n = r.emphasis.labelLine;
      i.show = i.show && r.label.show, n.show = n.show && r.emphasis.label.show;
    }, t.type = "series.pie", t.defaultOption = {
      // zlevel: 0,
      z: 2,
      legendHoverLink: !0,
      colorBy: "data",
      // 默认全局居中
      center: ["50%", "50%"],
      radius: [0, "75%"],
      // 默认顺时针
      clockwise: !0,
      startAngle: 90,
      endAngle: "auto",
      padAngle: 0,
      // 最小角度改为0
      minAngle: 0,
      // If the angle of a sector less than `minShowLabelAngle`,
      // the label will not be displayed.
      minShowLabelAngle: 0,
      // 选中时扇区偏移量
      selectedOffset: 10,
      // 选择模式，默认关闭，可选single，multiple
      // selectedMode: false,
      // 南丁格尔玫瑰图模式，'radius'（半径） | 'area'（面积）
      // roseType: null,
      percentPrecision: 2,
      // If still show when all data zero.
      stillShowZeroSum: !0,
      // cursor: null,
      left: 0,
      top: 0,
      right: 0,
      bottom: 0,
      width: null,
      height: null,
      label: {
        // color: 'inherit',
        // If rotate around circle
        rotate: 0,
        show: !0,
        overflow: "truncate",
        // 'outer', 'inside', 'center'
        position: "outer",
        // 'none', 'labelLine', 'edge'. Works only when position is 'outer'
        alignTo: "none",
        // Closest distance between label and chart edge.
        // Works only position is 'outer' and alignTo is 'edge'.
        edgeDistance: "25%",
        // Works only position is 'outer' and alignTo is not 'edge'.
        bleedMargin: 10,
        // Distance between text and label line.
        distanceToLabelLine: 5
        // formatter: 标签文本格式器，同 tooltip.formatter，不支持异步回调
        // 默认使用全局文本样式，详见 textStyle
        // distance: 当position为inner时有效，为label位置到圆心的距离与圆半径(环状图为内外半径和)的比例系数
      },
      // Enabled when label.normal.position is 'outer'
      labelLine: {
        show: !0,
        // 引导线两段中的第一段长度
        length: 15,
        // 引导线两段中的第二段长度
        length2: 15,
        smooth: !1,
        minTurnAngle: 90,
        maxSurfaceAngle: 90,
        lineStyle: {
          // color: 各异,
          width: 1,
          type: "solid"
        }
      },
      itemStyle: {
        borderWidth: 1,
        borderJoin: "round"
      },
      showEmptyCircle: !0,
      emptyCircleStyle: {
        color: "lightgray",
        opacity: 1
      },
      labelLayout: {
        // Hide the overlapped label.
        hideOverlap: !0
      },
      emphasis: {
        scale: !0,
        scaleSize: 5
      },
      // If use strategy to avoid label overlapping
      avoidLabelOverlap: !0,
      // Animation type. Valid values: expansion, scale
      animationType: "expansion",
      animationDuration: 1e3,
      // Animation type when update. Valid values: transition, expansion
      animationTypeUpdate: "transition",
      animationEasingUpdate: "cubicInOut",
      animationDurationUpdate: 500,
      animationEasing: "cubicInOut"
    }, t;
  })(pr)
);
function QD(e) {
  return {
    seriesType: e,
    reset: function(t, r) {
      var i = t.getData();
      i.filterSelf(function(n) {
        var a = i.mapDimension("value"), o = i.get(a, n);
        return !(yt(o) && !isNaN(o) && o < 0);
      });
    }
  };
}
function JD(e) {
  e.registerChartView(XD), e.registerSeriesModel(jD), hx("pie", e.registerAction), e.registerLayout(Jt(zD, "pie")), e.registerProcessor(HD("pie")), e.registerProcessor(QD("pie"));
}
function Uc(e, t, r) {
  r = r || {};
  var i = e.coordinateSystem, n = t.axis, a = {}, o = n.getAxesOnZeroOf()[0], s = n.position, l = o ? "onZero" : s, u = n.dim, h = i.getRect(), f = [h.x, h.x + h.width, h.y, h.y + h.height], c = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    onZero: 2
  }, v = t.get("offset") || 0, d = u === "x" ? [f[2] - v, f[3] + v] : [f[0] - v, f[1] + v];
  if (o) {
    var _ = o.toGlobalCoord(o.dataToCoord(0));
    d[c.onZero] = Math.max(Math.min(_, d[1]), d[0]);
  }
  a.position = [u === "y" ? d[c[l]] : f[0], u === "x" ? d[c[l]] : f[3]], a.rotation = Math.PI / 2 * (u === "x" ? 0 : 1);
  var p = {
    top: -1,
    bottom: 1,
    left: -1,
    right: 1
  };
  a.labelDirection = a.tickDirection = a.nameDirection = p[s], a.labelOffset = o ? d[c[s]] - d[c.onZero] : 0, t.get(["axisTick", "inside"]) && (a.tickDirection = -a.tickDirection), Bn(r.labelInside, t.get(["axisLabel", "inside"])) && (a.labelDirection = -a.labelDirection);
  var g = t.get(["axisLabel", "rotate"]);
  return a.labelRotate = l === "top" ? -g : g, a.z2 = 1, a;
}
var fr = Math.PI, qr = (
  /** @class */
  (function() {
    function e(t, r) {
      this.group = new Ze(), this.opt = r, this.axisModel = t, ht(r, {
        labelOffset: 0,
        nameDirection: 1,
        tickDirection: 1,
        labelDirection: 1,
        silent: !0,
        handleAutoShown: function() {
          return !0;
        }
      });
      var i = new Ze({
        x: r.position[0],
        y: r.position[1],
        rotation: r.rotation
      });
      i.updateTransform(), this._transformGroup = i;
    }
    return e.prototype.hasBuilder = function(t) {
      return !!Gc[t];
    }, e.prototype.add = function(t) {
      Gc[t](this.opt, this.axisModel, this.group, this._transformGroup);
    }, e.prototype.getGroup = function() {
      return this.group;
    }, e.innerTextLayout = function(t, r, i) {
      var n = Kv(r - t), a, o;
      return no(n) ? (o = i > 0 ? "top" : "bottom", a = "center") : no(n - fr) ? (o = i > 0 ? "bottom" : "top", a = "center") : (o = "middle", n > 0 && n < fr ? a = i > 0 ? "right" : "left" : a = i > 0 ? "left" : "right"), {
        rotation: n,
        textAlign: a,
        textVerticalAlign: o
      };
    }, e.makeAxisEventDataBase = function(t) {
      var r = {
        componentType: t.mainType,
        componentIndex: t.componentIndex
      };
      return r[t.mainType + "Index"] = t.componentIndex, r;
    }, e.isLabelSilent = function(t) {
      var r = t.get("tooltip");
      return t.get("silent") || !(t.get("triggerEvent") || r && r.show);
    }, e;
  })()
), Gc = {
  axisLine: function(e, t, r, i) {
    var n = t.get(["axisLine", "show"]);
    if (n === "auto" && e.handleAutoShown && (n = e.handleAutoShown("axisLine")), !!n) {
      var a = t.axis.getExtent(), o = i.transform, s = [a[0], 0], l = [a[1], 0], u = s[0] > l[0];
      o && (Ie(s, s, o), Ie(l, l, o));
      var h = I({
        lineCap: "round"
      }, t.getModel(["axisLine", "lineStyle"]).getLineStyle()), f = new Hi({
        shape: {
          x1: s[0],
          y1: s[1],
          x2: l[0],
          y2: l[1]
        },
        style: h,
        strokeContainThreshold: e.strokeContainThreshold || 5,
        silent: !0,
        z2: 1
      });
      Pu(f.shape, f.style.lineWidth), f.anid = "line", r.add(f);
      var c = t.get(["axisLine", "symbol"]);
      if (c != null) {
        var v = t.get(["axisLine", "symbolSize"]);
        z(c) && (c = [c, c]), (z(v) || yt(v)) && (v = [v, v]);
        var d = Cx(t.get(["axisLine", "symbolOffset"]) || 0, v), _ = v[0], p = v[1];
        D([{
          rotate: e.rotation + Math.PI / 2,
          offset: d[0],
          r: 0
        }, {
          rotate: e.rotation - Math.PI / 2,
          offset: d[1],
          r: Math.sqrt((s[0] - l[0]) * (s[0] - l[0]) + (s[1] - l[1]) * (s[1] - l[1]))
        }], function(g, m) {
          if (c[m] !== "none" && c[m] != null) {
            var y = Lp(c[m], -_ / 2, -p / 2, _, p, h.stroke, !0), w = g.r + g.offset, S = u ? l : s;
            y.attr({
              rotation: g.rotate,
              x: S[0] + w * Math.cos(e.rotation),
              y: S[1] - w * Math.sin(e.rotation),
              silent: !0,
              z2: 11
            }), r.add(y);
          }
        });
      }
    }
  },
  axisTickLabel: function(e, t, r, i) {
    var n = rE(r, i, t, e), a = nE(r, i, t, e);
    if (eE(t, a, n), iE(r, i, t, e.tickDirection), t.get(["axisLabel", "hideOverlap"])) {
      var o = $D(Q(a, function(s) {
        return {
          label: s,
          priority: s.z2,
          defaultAttr: {
            ignore: s.ignore
          }
        };
      }));
      VD(o);
    }
  },
  axisName: function(e, t, r, i) {
    var n = Bn(e.axisName, t.get("name"));
    if (n) {
      var a = t.get("nameLocation"), o = e.nameDirection, s = t.getModel("nameTextStyle"), l = t.get("nameGap") || 0, u = t.axis.getExtent(), h = u[0] > u[1] ? -1 : 1, f = [
        a === "start" ? u[0] - h * l : a === "end" ? u[1] + h * l : (u[0] + u[1]) / 2,
        // Reuse labelOffset.
        Yc(a) ? e.labelOffset + o * l : 0
      ], c, v = t.get("nameRotate");
      v != null && (v = v * fr / 180);
      var d;
      Yc(a) ? c = qr.innerTextLayout(
        e.rotation,
        v ?? e.rotation,
        // Adapt to axis.
        o
      ) : (c = tE(e.rotation, a, v || 0, u), d = e.axisNameAvailableWidth, d != null && (d = Math.abs(d / Math.sin(c.rotation)), !isFinite(d) && (d = null)));
      var _ = s.getFont(), p = t.get("nameTruncate", !0) || {}, g = p.ellipsis, m = Bn(e.nameTruncateMaxWidth, p.maxWidth, d), y = new ye({
        x: f[0],
        y: f[1],
        rotation: c.rotation,
        silent: qr.isLabelSilent(t),
        style: Hn(s, {
          text: n,
          font: _,
          overflow: "truncate",
          width: m,
          ellipsis: g,
          fill: s.getTextColor() || t.get(["axisLine", "lineStyle", "color"]),
          align: s.get("align") || c.textAlign,
          verticalAlign: s.get("verticalAlign") || c.textVerticalAlign
        }),
        z2: 1
      });
      if (Iu({
        el: y,
        componentModel: t,
        itemName: n
      }), y.__fullText = n, y.anid = "name", t.get("triggerEvent")) {
        var w = qr.makeAxisEventDataBase(t);
        w.targetType = "axisName", w.name = n, vt(y).eventData = w;
      }
      i.add(y), y.updateTransform(), r.add(y), y.decomposeTransform();
    }
  }
};
function tE(e, t, r, i) {
  var n = Kv(r - e), a, o, s = i[0] > i[1], l = t === "start" && !s || t !== "start" && s;
  return no(n - fr / 2) ? (o = l ? "bottom" : "top", a = "center") : no(n - fr * 1.5) ? (o = l ? "top" : "bottom", a = "center") : (o = "middle", n < fr * 1.5 && n > fr / 2 ? a = l ? "left" : "right" : a = l ? "right" : "left"), {
    rotation: n,
    textAlign: a,
    textVerticalAlign: o
  };
}
function eE(e, t, r) {
  if (!PD(e.axis)) {
    var i = e.get(["axisLabel", "showMinLabel"]), n = e.get(["axisLabel", "showMaxLabel"]);
    t = t || [], r = r || [];
    var a = t[0], o = t[1], s = t[t.length - 1], l = t[t.length - 2], u = r[0], h = r[1], f = r[r.length - 1], c = r[r.length - 2];
    i === !1 ? (ne(a), ne(u)) : Wc(a, o) && (i ? (ne(o), ne(h)) : (ne(a), ne(u))), n === !1 ? (ne(s), ne(f)) : Wc(l, s) && (n ? (ne(l), ne(c)) : (ne(s), ne(f)));
  }
}
function ne(e) {
  e && (e.ignore = !0);
}
function Wc(e, t) {
  var r = e && e.getBoundingRect().clone(), i = t && t.getBoundingRect().clone();
  if (!(!r || !i)) {
    var n = hu([]);
    return fu(n, n, -e.rotation), r.applyTransform(xi([], n, e.getLocalTransform())), i.applyTransform(xi([], n, t.getLocalTransform())), r.intersect(i);
  }
}
function Yc(e) {
  return e === "middle" || e === "center";
}
function hg(e, t, r, i, n) {
  for (var a = [], o = [], s = [], l = 0; l < e.length; l++) {
    var u = e[l].coord;
    o[0] = u, o[1] = 0, s[0] = u, s[1] = r, t && (Ie(o, o, t), Ie(s, s, t));
    var h = new Hi({
      shape: {
        x1: o[0],
        y1: o[1],
        x2: s[0],
        y2: s[1]
      },
      style: i,
      z2: 2,
      autoBatch: !0,
      silent: !0
    });
    Pu(h.shape, h.style.lineWidth), h.anid = n + "_" + e[l].tickValue, a.push(h);
  }
  return a;
}
function rE(e, t, r, i) {
  var n = r.axis, a = r.getModel("axisTick"), o = a.get("show");
  if (o === "auto" && i.handleAutoShown && (o = i.handleAutoShown("axisTick")), !(!o || n.scale.isBlank())) {
    for (var s = a.getModel("lineStyle"), l = i.tickDirection * a.get("length"), u = n.getTicksCoords(), h = hg(u, t.transform, l, ht(s.getLineStyle(), {
      stroke: r.get(["axisLine", "lineStyle", "color"])
    }), "ticks"), f = 0; f < h.length; f++)
      e.add(h[f]);
    return h;
  }
}
function iE(e, t, r, i) {
  var n = r.axis, a = r.getModel("minorTick");
  if (!(!a.get("show") || n.scale.isBlank())) {
    var o = n.getMinorTicksCoords();
    if (o.length)
      for (var s = a.getModel("lineStyle"), l = i * a.get("length"), u = ht(s.getLineStyle(), ht(r.getModel("axisTick").getLineStyle(), {
        stroke: r.get(["axisLine", "lineStyle", "color"])
      })), h = 0; h < o.length; h++)
        for (var f = hg(o[h], t.transform, l, u, "minorticks_" + h), c = 0; c < f.length; c++)
          e.add(f[c]);
  }
}
function nE(e, t, r, i) {
  var n = r.axis, a = Bn(i.axisLabelShow, r.get(["axisLabel", "show"]));
  if (!(!a || n.scale.isBlank())) {
    var o = r.getModel("axisLabel"), s = o.get("margin"), l = n.getViewLabels(), u = (Bn(i.labelRotate, o.get("rotate")) || 0) * fr / 180, h = qr.innerTextLayout(i.rotation, u, i.labelDirection), f = r.getCategories && r.getCategories(!0), c = [], v = qr.isLabelSilent(r), d = r.get("triggerEvent");
    return D(l, function(_, p) {
      var g = n.scale.type === "ordinal" ? n.scale.getRawOrdinalNumber(_.tickValue) : _.tickValue, m = _.formattedLabel, y = _.rawLabel, w = o;
      if (f && f[g]) {
        var S = f[g];
        B(S) && S.textStyle && (w = new dt(S.textStyle, o, r.ecModel));
      }
      var b = w.getTextColor() || r.get(["axisLine", "lineStyle", "color"]), T = n.dataToCoord(g), C = w.getShallow("align", !0) || h.textAlign, x = X(w.getShallow("alignMinLabel", !0), C), E = X(w.getShallow("alignMaxLabel", !0), C), A = w.getShallow("verticalAlign", !0) || w.getShallow("baseline", !0) || h.textVerticalAlign, M = X(w.getShallow("verticalAlignMinLabel", !0), A), L = X(w.getShallow("verticalAlignMaxLabel", !0), A), P = new ye({
        x: T,
        y: i.labelOffset + i.labelDirection * s,
        rotation: h.rotation,
        silent: v,
        z2: 10 + (_.level || 0),
        style: Hn(w, {
          text: m,
          align: p === 0 ? x : p === l.length - 1 ? E : C,
          verticalAlign: p === 0 ? M : p === l.length - 1 ? L : A,
          fill: rt(b) ? b(
            // (1) In category axis with data zoom, tick is not the original
            // index of axis.data. So tick should not be exposed to user
            // in category axis.
            // (2) Compatible with previous version, which always use formatted label as
            // input. But in interval scale the formatted label is like '223,445', which
            // maked user replace ','. So we modify it to return original val but remain
            // it as 'string' to avoid error in replacing.
            n.type === "category" ? y : n.type === "value" ? g + "" : g,
            p
          ) : b
        })
      });
      if (P.anid = "label_" + g, Iu({
        el: P,
        componentModel: r,
        itemName: m,
        formatterParamsExtra: {
          isTruncated: function() {
            return P.isTruncated;
          },
          value: y,
          tickIndex: p
        }
      }), d) {
        var O = qr.makeAxisEventDataBase(r);
        O.targetType = "axisLabel", O.value = y, O.tickIndex = p, n.type === "category" && (O.dataIndex = g), vt(P).eventData = O;
      }
      t.add(P), P.updateTransform(), c.push(P), e.add(P), P.decomposeTransform();
    }), c;
  }
}
function aE(e, t) {
  var r = {
    /**
     * key: makeKey(axis.model)
     * value: {
     *      axis,
     *      coordSys,
     *      axisPointerModel,
     *      triggerTooltip,
     *      triggerEmphasis,
     *      involveSeries,
     *      snap,
     *      seriesModels,
     *      seriesDataCount
     * }
     */
    axesInfo: {},
    seriesInvolved: !1,
    /**
     * key: makeKey(coordSys.model)
     * value: Object: key makeKey(axis.model), value: axisInfo
     */
    coordSysAxesInfo: {},
    coordSysMap: {}
  };
  return oE(r, e, t), r.seriesInvolved && lE(r, e), r;
}
function oE(e, t, r) {
  var i = t.getComponent("tooltip"), n = t.getComponent("axisPointer"), a = n.get("link", !0) || [], o = [];
  D(r.getCoordinateSystems(), function(s) {
    if (!s.axisPointerEnabled)
      return;
    var l = qn(s.model), u = e.coordSysAxesInfo[l] = {};
    e.coordSysMap[l] = s;
    var h = s.model, f = h.getModel("tooltip", i);
    if (D(s.getAxes(), Jt(_, !1, null)), s.getTooltipAxes && i && f.get("show")) {
      var c = f.get("trigger") === "axis", v = f.get(["axisPointer", "type"]) === "cross", d = s.getTooltipAxes(f.get(["axisPointer", "axis"]));
      (c || v) && D(d.baseAxes, Jt(_, v ? "cross" : !0, c)), v && D(d.otherAxes, Jt(_, "cross", !1));
    }
    function _(p, g, m) {
      var y = m.model.getModel("axisPointer", n), w = y.get("show");
      if (!(!w || w === "auto" && !p && !Kl(y))) {
        g == null && (g = y.get("triggerTooltip")), y = p ? sE(m, f, n, t, p, g) : y;
        var S = y.get("snap"), b = y.get("triggerEmphasis"), T = qn(m.model), C = g || S || m.type === "category", x = e.axesInfo[T] = {
          key: T,
          axis: m,
          coordSys: s,
          axisPointerModel: y,
          triggerTooltip: g,
          triggerEmphasis: b,
          involveSeries: C,
          snap: S,
          useHandle: Kl(y),
          seriesModels: [],
          linkGroup: null
        };
        u[T] = x, e.seriesInvolved = e.seriesInvolved || C;
        var E = uE(a, m);
        if (E != null) {
          var A = o[E] || (o[E] = {
            axesInfo: {}
          });
          A.axesInfo[T] = x, A.mapper = a[E].mapper, x.linkGroup = A;
        }
      }
    }
  });
}
function sE(e, t, r, i, n, a) {
  var o = t.getModel("axisPointer"), s = ["type", "snap", "lineStyle", "shadowStyle", "label", "animation", "animationDurationUpdate", "animationEasingUpdate", "z"], l = {};
  D(s, function(c) {
    l[c] = tt(o.get(c));
  }), l.snap = e.type !== "category" && !!a, o.get("type") === "cross" && (l.type = "line");
  var u = l.label || (l.label = {});
  if (u.show == null && (u.show = !1), n === "cross") {
    var h = o.get(["label", "show"]);
    if (u.show = h ?? !0, !a) {
      var f = l.lineStyle = o.get("crossStyle");
      f && ht(u, f.textStyle);
    }
  }
  return e.model.getModel("axisPointer", new dt(l, r, i));
}
function lE(e, t) {
  t.eachSeries(function(r) {
    var i = r.coordinateSystem, n = r.get(["tooltip", "trigger"], !0), a = r.get(["tooltip", "show"], !0);
    !i || n === "none" || n === !1 || n === "item" || a === !1 || r.get(["axisPointer", "show"], !0) === !1 || D(e.coordSysAxesInfo[qn(i.model)], function(o) {
      var s = o.axis;
      i.getAxis(s.dim) === s && (o.seriesModels.push(r), o.seriesDataCount == null && (o.seriesDataCount = 0), o.seriesDataCount += r.getData().count());
    });
  });
}
function uE(e, t) {
  for (var r = t.model, i = t.dim, n = 0; n < e.length; n++) {
    var a = e[n] || {};
    if (rl(a[i + "AxisId"], r.id) || rl(a[i + "AxisIndex"], r.componentIndex) || rl(a[i + "AxisName"], r.name))
      return n;
  }
}
function rl(e, t) {
  return e === "all" || k(e) && st(e, t) >= 0 || e === t;
}
function hE(e) {
  var t = Xu(e);
  if (t) {
    var r = t.axisPointerModel, i = t.axis.scale, n = r.option, a = r.get("status"), o = r.get("value");
    o != null && (o = i.parse(o));
    var s = Kl(r);
    a == null && (n.status = s ? "show" : "hide");
    var l = i.getExtent().slice();
    l[0] > l[1] && l.reverse(), // Pick a value on axis when initializing.
    (o == null || o > l[1]) && (o = l[1]), o < l[0] && (o = l[0]), n.value = o, s && (n.status = t.axis.scale.isBlank() ? "hide" : "show");
  }
}
function Xu(e) {
  var t = (e.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return t && t.axesInfo[qn(e)];
}
function fE(e) {
  var t = Xu(e);
  return t && t.axisPointerModel;
}
function Kl(e) {
  return !!e.get(["handle", "show"]);
}
function qn(e) {
  return e.type + "||" + e.id;
}
var il = {}, cE = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.render = function(r, i, n, a) {
      this.axisPointerClass && hE(r), e.prototype.render.apply(this, arguments), this._doUpdateAxisPointerClass(r, n, !0);
    }, t.prototype.updateAxisPointer = function(r, i, n, a) {
      this._doUpdateAxisPointerClass(r, n, !1);
    }, t.prototype.remove = function(r, i) {
      var n = this._axisPointer;
      n && n.remove(i);
    }, t.prototype.dispose = function(r, i) {
      this._disposeAxisPointer(i), e.prototype.dispose.apply(this, arguments);
    }, t.prototype._doUpdateAxisPointerClass = function(r, i, n) {
      var a = t.getAxisPointerClass(this.axisPointerClass);
      if (a) {
        var o = fE(r);
        o ? (this._axisPointer || (this._axisPointer = new a())).render(r, o, i, n) : this._disposeAxisPointer(i);
      }
    }, t.prototype._disposeAxisPointer = function(r) {
      this._axisPointer && this._axisPointer.dispose(r), this._axisPointer = null;
    }, t.registerAxisPointerClass = function(r, i) {
      if (process.env.NODE_ENV !== "production" && il[r])
        throw new Error("axisPointer " + r + " exists");
      il[r] = i;
    }, t.getAxisPointerClass = function(r) {
      return r && il[r];
    }, t.type = "axis", t;
  })(gr)
);
function Xc(e, t, r) {
  var i = Fi.createCanvas(), n = t.getWidth(), a = t.getHeight(), o = i.style;
  return o && (o.position = "absolute", o.left = "0", o.top = "0", o.width = n + "px", o.height = a + "px", i.setAttribute("data-zr-dom-id", e)), i.width = n * r, i.height = a * r, i;
}
var nl = (function(e) {
  W(t, e);
  function t(r, i, n) {
    var a = e.call(this) || this;
    a.motionBlur = !1, a.lastFrameAlpha = 0.7, a.dpr = 1, a.virtual = !1, a.config = {}, a.incremental = !1, a.zlevel = 0, a.maxRepaintRectCount = 5, a.__dirty = !0, a.__firstTimePaint = !0, a.__used = !1, a.__drawIndex = 0, a.__startIndex = 0, a.__endIndex = 0, a.__prevStartIndex = null, a.__prevEndIndex = null;
    var o;
    n = n || io, typeof r == "string" ? o = Xc(r, i, n) : B(r) && (o = r, r = o.id), a.id = r, a.dom = o;
    var s = o.style;
    return s && (xv(o), o.onselectstart = function() {
      return !1;
    }, s.padding = "0", s.margin = "0", s.borderWidth = "0"), a.painter = i, a.dpr = n, a;
  }
  return t.prototype.getElementCount = function() {
    return this.__endIndex - this.__startIndex;
  }, t.prototype.afterBrush = function() {
    this.__prevStartIndex = this.__startIndex, this.__prevEndIndex = this.__endIndex;
  }, t.prototype.initContext = function() {
    this.ctx = this.dom.getContext("2d"), this.ctx.dpr = this.dpr;
  }, t.prototype.setUnpainted = function() {
    this.__firstTimePaint = !0;
  }, t.prototype.createBackBuffer = function() {
    var r = this.dpr;
    this.domBack = Xc("back-" + this.id, this.painter, r), this.ctxBack = this.domBack.getContext("2d"), r !== 1 && this.ctxBack.scale(r, r);
  }, t.prototype.createRepaintRects = function(r, i, n, a) {
    if (this.__firstTimePaint)
      return this.__firstTimePaint = !1, null;
    var o = [], s = this.maxRepaintRectCount, l = !1, u = new at(0, 0, 0, 0);
    function h(m) {
      if (!(!m.isFinite() || m.isZero()))
        if (o.length === 0) {
          var y = new at(0, 0, 0, 0);
          y.copy(m), o.push(y);
        } else {
          for (var w = !1, S = 1 / 0, b = 0, T = 0; T < o.length; ++T) {
            var C = o[T];
            if (C.intersect(m)) {
              var x = new at(0, 0, 0, 0);
              x.copy(C), x.union(m), o[T] = x, w = !0;
              break;
            } else if (l) {
              u.copy(m), u.union(C);
              var E = m.width * m.height, A = C.width * C.height, M = u.width * u.height, L = M - E - A;
              L < S && (S = L, b = T);
            }
          }
          if (l && (o[b].union(m), w = !0), !w) {
            var y = new at(0, 0, 0, 0);
            y.copy(m), o.push(y);
          }
          l || (l = o.length >= s);
        }
    }
    for (var f = this.__startIndex; f < this.__endIndex; ++f) {
      var c = r[f];
      if (c) {
        var v = c.shouldBePainted(n, a, !0, !0), d = c.__isRendered && (c.__dirty & Qt || !v) ? c.getPrevPaintRect() : null;
        d && h(d);
        var _ = v && (c.__dirty & Qt || !c.__isRendered) ? c.getPaintRect() : null;
        _ && h(_);
      }
    }
    for (var f = this.__prevStartIndex; f < this.__prevEndIndex; ++f) {
      var c = i[f], v = c && c.shouldBePainted(n, a, !0, !0);
      if (c && (!v || !c.__zr) && c.__isRendered) {
        var d = c.getPrevPaintRect();
        d && h(d);
      }
    }
    var p;
    do {
      p = !1;
      for (var f = 0; f < o.length; ) {
        if (o[f].isZero()) {
          o.splice(f, 1);
          continue;
        }
        for (var g = f + 1; g < o.length; )
          o[f].intersect(o[g]) ? (p = !0, o[f].union(o[g]), o.splice(g, 1)) : g++;
        f++;
      }
    } while (p);
    return this._paintRects = o, o;
  }, t.prototype.debugGetPaintRects = function() {
    return (this._paintRects || []).slice();
  }, t.prototype.resize = function(r, i) {
    var n = this.dpr, a = this.dom, o = a.style, s = this.domBack;
    o && (o.width = r + "px", o.height = i + "px"), a.width = r * n, a.height = i * n, s && (s.width = r * n, s.height = i * n, n !== 1 && this.ctxBack.scale(n, n));
  }, t.prototype.clear = function(r, i, n) {
    var a = this.dom, o = this.ctx, s = a.width, l = a.height;
    i = i || this.clearColor;
    var u = this.motionBlur && !r, h = this.lastFrameAlpha, f = this.dpr, c = this;
    u && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(a, 0, 0, s / f, l / f));
    var v = this.domBack;
    function d(_, p, g, m) {
      if (o.clearRect(_, p, g, m), i && i !== "transparent") {
        var y = void 0;
        if (Po(i)) {
          var w = i.global || i.__width === g && i.__height === m;
          y = w && i.__canvasGradient || Wl(o, i, {
            x: 0,
            y: 0,
            width: g,
            height: m
          }), i.__canvasGradient = y, i.__width = g, i.__height = m;
        } else $0(i) && (i.scaleX = i.scaleX || f, i.scaleY = i.scaleY || f, y = Yl(o, i, {
          dirty: function() {
            c.setUnpainted(), c.painter.refresh();
          }
        }));
        o.save(), o.fillStyle = y || i, o.fillRect(_, p, g, m), o.restore();
      }
      u && (o.save(), o.globalAlpha = h, o.drawImage(v, _, p, g, m), o.restore());
    }
    !n || u ? d(0, 0, s, l) : n.length && D(n, function(_) {
      d(_.x * f, _.y * f, _.width * f, _.height * f);
    });
  }, t;
})($e), qc = 1e5, Fr = 314159, Ra = 0.01, vE = 1e-3;
function dE(e) {
  return e ? e.__builtin__ ? !0 : !(typeof e.resize != "function" || typeof e.refresh != "function") : !1;
}
function pE(e, t) {
  var r = document.createElement("div");
  return r.style.cssText = [
    "position:relative",
    "width:" + e + "px",
    "height:" + t + "px",
    "padding:0",
    "margin:0",
    "border-width:0"
  ].join(";") + ";", r;
}
var gE = (function() {
  function e(t, r, i, n) {
    this.type = "canvas", this._zlevelList = [], this._prevDisplayList = [], this._layers = {}, this._layerConfig = {}, this._needsManuallyCompositing = !1, this.type = "canvas";
    var a = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
    this._opts = i = I({}, i || {}), this.dpr = i.devicePixelRatio || io, this._singleCanvas = a, this.root = t;
    var o = t.style;
    o && (xv(t), t.innerHTML = ""), this.storage = r;
    var s = this._zlevelList;
    this._prevDisplayList = [];
    var l = this._layers;
    if (a) {
      var h = t, f = h.width, c = h.height;
      i.width != null && (f = i.width), i.height != null && (c = i.height), this.dpr = i.devicePixelRatio || 1, h.width = f * this.dpr, h.height = c * this.dpr, this._width = f, this._height = c;
      var v = new nl(h, this, this.dpr);
      v.__builtin__ = !0, v.initContext(), l[Fr] = v, v.zlevel = Fr, s.push(Fr), this._domRoot = t;
    } else {
      this._width = Ea(t, 0, i), this._height = Ea(t, 1, i);
      var u = this._domRoot = pE(this._width, this._height);
      t.appendChild(u);
    }
  }
  return e.prototype.getType = function() {
    return "canvas";
  }, e.prototype.isSingleCanvas = function() {
    return this._singleCanvas;
  }, e.prototype.getViewportRoot = function() {
    return this._domRoot;
  }, e.prototype.getViewportRootOffset = function() {
    var t = this.getViewportRoot();
    if (t)
      return {
        offsetLeft: t.offsetLeft || 0,
        offsetTop: t.offsetTop || 0
      };
  }, e.prototype.refresh = function(t) {
    var r = this.storage.getDisplayList(!0), i = this._prevDisplayList, n = this._zlevelList;
    this._redrawId = Math.random(), this._paintList(r, i, t, this._redrawId);
    for (var a = 0; a < n.length; a++) {
      var o = n[a], s = this._layers[o];
      if (!s.__builtin__ && s.refresh) {
        var l = a === 0 ? this._backgroundColor : null;
        s.refresh(l);
      }
    }
    return this._opts.useDirtyRect && (this._prevDisplayList = r.slice()), this;
  }, e.prototype.refreshHover = function() {
    this._paintHoverList(this.storage.getDisplayList(!1));
  }, e.prototype._paintHoverList = function(t) {
    var r = t.length, i = this._hoverlayer;
    if (i && i.clear(), !!r) {
      for (var n = {
        inHover: !0,
        viewWidth: this._width,
        viewHeight: this._height
      }, a, o = 0; o < r; o++) {
        var s = t[o];
        s.__inHover && (i || (i = this._hoverlayer = this.getLayer(qc)), a || (a = i.ctx, a.save()), Gr(a, s, n, o === r - 1));
      }
      a && a.restore();
    }
  }, e.prototype.getHoverLayer = function() {
    return this.getLayer(qc);
  }, e.prototype.paintOne = function(t, r) {
    kp(t, r);
  }, e.prototype._paintList = function(t, r, i, n) {
    if (this._redrawId === n) {
      i = i || !1, this._updateLayerStatus(t);
      var a = this._doPaintList(t, r, i), o = a.finished, s = a.needsRefreshHover;
      if (this._needsManuallyCompositing && this._compositeManually(), s && this._paintHoverList(t), o)
        this.eachLayer(function(u) {
          u.afterBrush && u.afterBrush();
        });
      else {
        var l = this;
        Qa(function() {
          l._paintList(t, r, i, n);
        });
      }
    }
  }, e.prototype._compositeManually = function() {
    var t = this.getLayer(Fr).ctx, r = this._domRoot.width, i = this._domRoot.height;
    t.clearRect(0, 0, r, i), this.eachBuiltinLayer(function(n) {
      n.virtual && t.drawImage(n.dom, 0, 0, r, i);
    });
  }, e.prototype._doPaintList = function(t, r, i) {
    for (var n = this, a = [], o = this._opts.useDirtyRect, s = 0; s < this._zlevelList.length; s++) {
      var l = this._zlevelList[s], u = this._layers[l];
      u.__builtin__ && u !== this._hoverlayer && (u.__dirty || i) && a.push(u);
    }
    for (var h = !0, f = !1, c = function(_) {
      var p = a[_], g = p.ctx, m = o && p.createRepaintRects(t, r, v._width, v._height), y = i ? p.__startIndex : p.__drawIndex, w = !i && p.incremental && Date.now, S = w && Date.now(), b = p.zlevel === v._zlevelList[0] ? v._backgroundColor : null;
      if (p.__startIndex === p.__endIndex)
        p.clear(!1, b, m);
      else if (y === p.__startIndex) {
        var T = t[y];
        (!T.incremental || !T.notClear || i) && p.clear(!1, b, m);
      }
      y === -1 && (console.error("For some unknown reason. drawIndex is -1"), y = p.__startIndex);
      var C, x = function(L) {
        var P = {
          inHover: !1,
          allClipped: !1,
          prevEl: null,
          viewWidth: n._width,
          viewHeight: n._height
        };
        for (C = y; C < p.__endIndex; C++) {
          var O = t[C];
          if (O.__inHover && (f = !0), n._doPaintEl(O, p, o, L, P, C === p.__endIndex - 1), w) {
            var R = Date.now() - S;
            if (R > 15)
              break;
          }
        }
        P.prevElClipPaths && g.restore();
      };
      if (m)
        if (m.length === 0)
          C = p.__endIndex;
        else
          for (var E = v.dpr, A = 0; A < m.length; ++A) {
            var M = m[A];
            g.save(), g.beginPath(), g.rect(M.x * E, M.y * E, M.width * E, M.height * E), g.clip(), x(M), g.restore();
          }
      else
        g.save(), x(), g.restore();
      p.__drawIndex = C, p.__drawIndex < p.__endIndex && (h = !1);
    }, v = this, d = 0; d < a.length; d++)
      c(d);
    return V.wxa && D(this._layers, function(_) {
      _ && _.ctx && _.ctx.draw && _.ctx.draw();
    }), {
      finished: h,
      needsRefreshHover: f
    };
  }, e.prototype._doPaintEl = function(t, r, i, n, a, o) {
    var s = r.ctx;
    if (i) {
      var l = t.getPaintRect();
      (!n || l && l.intersect(n)) && (Gr(s, t, a, o), t.setPrevPaintRect(l));
    } else
      Gr(s, t, a, o);
  }, e.prototype.getLayer = function(t, r) {
    this._singleCanvas && !this._needsManuallyCompositing && (t = Fr);
    var i = this._layers[t];
    return i || (i = new nl("zr_" + t, this, this.dpr), i.zlevel = t, i.__builtin__ = !0, this._layerConfig[t] ? mt(i, this._layerConfig[t], !0) : this._layerConfig[t - Ra] && mt(i, this._layerConfig[t - Ra], !0), r && (i.virtual = r), this.insertLayer(t, i), i.initContext()), i;
  }, e.prototype.insertLayer = function(t, r) {
    var i = this._layers, n = this._zlevelList, a = n.length, o = this._domRoot, s = null, l = -1;
    if (i[t]) {
      process.env.NODE_ENV !== "production" && Wr("ZLevel " + t + " has been used already");
      return;
    }
    if (!dE(r)) {
      process.env.NODE_ENV !== "production" && Wr("Layer of zlevel " + t + " is not valid");
      return;
    }
    if (a > 0 && t > n[0]) {
      for (l = 0; l < a - 1 && !(n[l] < t && n[l + 1] > t); l++)
        ;
      s = i[n[l]];
    }
    if (n.splice(l + 1, 0, t), i[t] = r, !r.virtual)
      if (s) {
        var u = s.dom;
        u.nextSibling ? o.insertBefore(r.dom, u.nextSibling) : o.appendChild(r.dom);
      } else
        o.firstChild ? o.insertBefore(r.dom, o.firstChild) : o.appendChild(r.dom);
    r.painter || (r.painter = this);
  }, e.prototype.eachLayer = function(t, r) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n];
      t.call(r, this._layers[a], a);
    }
  }, e.prototype.eachBuiltinLayer = function(t, r) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n], o = this._layers[a];
      o.__builtin__ && t.call(r, o, a);
    }
  }, e.prototype.eachOtherLayer = function(t, r) {
    for (var i = this._zlevelList, n = 0; n < i.length; n++) {
      var a = i[n], o = this._layers[a];
      o.__builtin__ || t.call(r, o, a);
    }
  }, e.prototype.getLayers = function() {
    return this._layers;
  }, e.prototype._updateLayerStatus = function(t) {
    this.eachBuiltinLayer(function(f, c) {
      f.__dirty = f.__used = !1;
    });
    function r(f) {
      a && (a.__endIndex !== f && (a.__dirty = !0), a.__endIndex = f);
    }
    if (this._singleCanvas)
      for (var i = 1; i < t.length; i++) {
        var n = t[i];
        if (n.zlevel !== t[i - 1].zlevel || n.incremental) {
          this._needsManuallyCompositing = !0;
          break;
        }
      }
    var a = null, o = 0, s, l;
    for (l = 0; l < t.length; l++) {
      var n = t[l], u = n.zlevel, h = void 0;
      s !== u && (s = u, o = 0), n.incremental ? (h = this.getLayer(u + vE, this._needsManuallyCompositing), h.incremental = !0, o = 1) : h = this.getLayer(u + (o > 0 ? Ra : 0), this._needsManuallyCompositing), h.__builtin__ || Wr("ZLevel " + u + " has been used by unkown layer " + h.id), h !== a && (h.__used = !0, h.__startIndex !== l && (h.__dirty = !0), h.__startIndex = l, h.incremental ? h.__drawIndex = -1 : h.__drawIndex = l, r(l), a = h), n.__dirty & Qt && !n.__inHover && (h.__dirty = !0, h.incremental && h.__drawIndex < 0 && (h.__drawIndex = l));
    }
    r(l), this.eachBuiltinLayer(function(f, c) {
      !f.__used && f.getElementCount() > 0 && (f.__dirty = !0, f.__startIndex = f.__endIndex = f.__drawIndex = 0), f.__dirty && f.__drawIndex < 0 && (f.__drawIndex = f.__startIndex);
    });
  }, e.prototype.clear = function() {
    return this.eachBuiltinLayer(this._clearLayer), this;
  }, e.prototype._clearLayer = function(t) {
    t.clear();
  }, e.prototype.setBackgroundColor = function(t) {
    this._backgroundColor = t, D(this._layers, function(r) {
      r.setUnpainted();
    });
  }, e.prototype.configLayer = function(t, r) {
    if (r) {
      var i = this._layerConfig;
      i[t] ? mt(i[t], r, !0) : i[t] = r;
      for (var n = 0; n < this._zlevelList.length; n++) {
        var a = this._zlevelList[n];
        if (a === t || a === t + Ra) {
          var o = this._layers[a];
          mt(o, i[t], !0);
        }
      }
    }
  }, e.prototype.delLayer = function(t) {
    var r = this._layers, i = this._zlevelList, n = r[t];
    n && (n.dom.parentNode.removeChild(n.dom), delete r[t], i.splice(st(i, t), 1));
  }, e.prototype.resize = function(t, r) {
    if (this._domRoot.style) {
      var i = this._domRoot;
      i.style.display = "none";
      var n = this._opts, a = this.root;
      if (t != null && (n.width = t), r != null && (n.height = r), t = Ea(a, 0, n), r = Ea(a, 1, n), i.style.display = "", this._width !== t || r !== this._height) {
        i.style.width = t + "px", i.style.height = r + "px";
        for (var o in this._layers)
          this._layers.hasOwnProperty(o) && this._layers[o].resize(t, r);
        this.refresh(!0);
      }
      this._width = t, this._height = r;
    } else {
      if (t == null || r == null)
        return;
      this._width = t, this._height = r, this.getLayer(Fr).resize(t, r);
    }
    return this;
  }, e.prototype.clearLayer = function(t) {
    var r = this._layers[t];
    r && r.clear();
  }, e.prototype.dispose = function() {
    this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null;
  }, e.prototype.getRenderedCanvas = function(t) {
    if (t = t || {}, this._singleCanvas && !this._compositeManually)
      return this._layers[Fr].dom;
    var r = new nl("image", this, t.pixelRatio || this.dpr);
    r.initContext(), r.clear(!1, t.backgroundColor || this._backgroundColor);
    var i = r.ctx;
    if (t.pixelRatio <= this.dpr) {
      this.refresh();
      var n = r.dom.width, a = r.dom.height;
      this.eachLayer(function(f) {
        f.__builtin__ ? i.drawImage(f.dom, 0, 0, n, a) : f.renderToCanvas && (i.save(), f.renderToCanvas(i), i.restore());
      });
    } else
      for (var o = {
        inHover: !1,
        viewWidth: this._width,
        viewHeight: this._height
      }, s = this.storage.getDisplayList(!0), l = 0, u = s.length; l < u; l++) {
        var h = s[l];
        Gr(i, h, o, l === u - 1);
      }
    return r.dom;
  }, e.prototype.getWidth = function() {
    return this._width;
  }, e.prototype.getHeight = function() {
    return this._height;
  }, e;
})();
function _E(e) {
  e.registerPainter("canvas", gE);
}
var Vr = St(), Zc = tt, al = lt, mE = (
  /** @class */
  (function() {
    function e() {
      this._dragging = !1, this.animationThreshold = 15;
    }
    return e.prototype.render = function(t, r, i, n) {
      var a = r.get("value"), o = r.get("status");
      if (this._axisModel = t, this._axisPointerModel = r, this._api = i, !(!n && this._lastValue === a && this._lastStatus === o)) {
        this._lastValue = a, this._lastStatus = o;
        var s = this._group, l = this._handle;
        if (!o || o === "hide") {
          s && s.hide(), l && l.hide();
          return;
        }
        s && s.show(), l && l.show();
        var u = {};
        this.makeElOption(u, a, t, r, i);
        var h = u.graphicKey;
        h !== this._lastGraphicKey && this.clear(i), this._lastGraphicKey = h;
        var f = this._moveAnimation = this.determineAnimation(t, r);
        if (!s)
          s = this._group = new Ze(), this.createPointerEl(s, u, t, r), this.createLabelEl(s, u, t, r), i.getZr().add(s);
        else {
          var c = Jt(Kc, r, f);
          this.updatePointerEl(s, u, c), this.updateLabelEl(s, u, c, r);
        }
        Qc(s, r, !0), this._renderHandle(a);
      }
    }, e.prototype.remove = function(t) {
      this.clear(t);
    }, e.prototype.dispose = function(t) {
      this.clear(t);
    }, e.prototype.determineAnimation = function(t, r) {
      var i = r.get("animation"), n = t.axis, a = n.type === "category", o = r.get("snap");
      if (!o && !a)
        return !1;
      if (i === "auto" || i == null) {
        var s = this.animationThreshold;
        if (a && n.getBandWidth() > s)
          return !0;
        if (o) {
          var l = Xu(t).seriesDataCount, u = n.getExtent();
          return Math.abs(u[0] - u[1]) / l > s;
        }
        return !1;
      }
      return i === !0;
    }, e.prototype.makeElOption = function(t, r, i, n, a) {
    }, e.prototype.createPointerEl = function(t, r, i, n) {
      var a = r.pointer;
      if (a) {
        var o = Vr(t).pointerEl = new VS[a.type](Zc(r.pointer));
        t.add(o);
      }
    }, e.prototype.createLabelEl = function(t, r, i, n) {
      if (r.label) {
        var a = Vr(t).labelEl = new ye(Zc(r.label));
        t.add(a), jc(a, n);
      }
    }, e.prototype.updatePointerEl = function(t, r, i) {
      var n = Vr(t).pointerEl;
      n && r.pointer && (n.setStyle(r.pointer.style), i(n, {
        shape: r.pointer.shape
      }));
    }, e.prototype.updateLabelEl = function(t, r, i, n) {
      var a = Vr(t).labelEl;
      a && (a.setStyle(r.label.style), i(a, {
        // Consider text length change in vertical axis, animation should
        // be used on shape, otherwise the effect will be weird.
        // TODOTODO
        // shape: elOption.label.shape,
        x: r.label.x,
        y: r.label.y
      }), jc(a, n));
    }, e.prototype._renderHandle = function(t) {
      if (!(this._dragging || !this.updateHandleTransform)) {
        var r = this._axisPointerModel, i = this._api.getZr(), n = this._handle, a = r.getModel("handle"), o = r.get("status");
        if (!a.get("show") || !o || o === "hide") {
          n && i.remove(n), this._handle = null;
          return;
        }
        var s;
        this._handle || (s = !0, n = this._handle = $d(a.get("icon"), {
          cursor: "move",
          draggable: !0,
          onmousemove: function(u) {
            Ev(u.event);
          },
          onmousedown: al(this._onHandleDragMove, this, 0, 0),
          drift: al(this._onHandleDragMove, this),
          ondragend: al(this._onHandleDragEnd, this)
        }), i.add(n)), Qc(n, r, !1), n.setStyle(a.getItemStyle(null, ["color", "borderColor", "borderWidth", "opacity", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"]));
        var l = a.get("size");
        k(l) || (l = [l, l]), n.scaleX = l[0] / 2, n.scaleY = l[1] / 2, Tp(this, "_doDispatchAxisPointer", a.get("throttle") || 0, "fixRate"), this._moveHandleToValue(t, s);
      }
    }, e.prototype._moveHandleToValue = function(t, r) {
      Kc(this._axisPointerModel, !r && this._moveAnimation, this._handle, ol(this.getHandleTransform(t, this._axisModel, this._axisPointerModel)));
    }, e.prototype._onHandleDragMove = function(t, r) {
      var i = this._handle;
      if (i) {
        this._dragging = !0;
        var n = this.updateHandleTransform(ol(i), [t, r], this._axisModel, this._axisPointerModel);
        this._payloadInfo = n, i.stopAnimation(), i.attr(ol(n)), Vr(i).lastProp = null, this._doDispatchAxisPointer();
      }
    }, e.prototype._doDispatchAxisPointer = function() {
      var t = this._handle;
      if (t) {
        var r = this._payloadInfo, i = this._axisModel;
        this._api.dispatchAction({
          type: "updateAxisPointer",
          x: r.cursorPoint[0],
          y: r.cursorPoint[1],
          tooltipOption: r.tooltipOption,
          axesInfo: [{
            axisDim: i.axis.dim,
            axisIndex: i.componentIndex
          }]
        });
      }
    }, e.prototype._onHandleDragEnd = function() {
      this._dragging = !1;
      var t = this._handle;
      if (t) {
        var r = this._axisPointerModel.get("value");
        this._moveHandleToValue(r), this._api.dispatchAction({
          type: "hideTip"
        });
      }
    }, e.prototype.clear = function(t) {
      this._lastValue = null, this._lastStatus = null;
      var r = t.getZr(), i = this._group, n = this._handle;
      r && i && (this._lastGraphicKey = null, i && r.remove(i), n && r.remove(n), this._group = null, this._handle = null, this._payloadInfo = null), Hl(this, "_doDispatchAxisPointer");
    }, e.prototype.doClear = function() {
    }, e.prototype.buildLabel = function(t, r, i) {
      return i = i || 0, {
        x: t[i],
        y: t[1 - i],
        width: r[i],
        height: r[1 - i]
      };
    }, e;
  })()
);
function Kc(e, t, r, i) {
  fg(Vr(r).lastProp, i) || (Vr(r).lastProp = i, t ? zn(r, i, e) : (r.stopAnimation(), r.attr(i)));
}
function fg(e, t) {
  if (B(e) && B(t)) {
    var r = !0;
    return D(t, function(i, n) {
      r = r && fg(e[n], i);
    }), !!r;
  } else
    return e === t;
}
function jc(e, t) {
  e[t.get(["label", "show"]) ? "show" : "hide"]();
}
function ol(e) {
  return {
    x: e.x || 0,
    y: e.y || 0,
    rotation: e.rotation || 0
  };
}
function Qc(e, t, r) {
  var i = t.get("z"), n = t.get("zlevel");
  e && e.traverse(function(a) {
    a.type !== "group" && (i != null && (a.z = i), n != null && (a.zlevel = n), a.silent = r);
  });
}
function yE(e) {
  var t = e.get("type"), r = e.getModel(t + "Style"), i;
  return t === "line" ? (i = r.getLineStyle(), i.fill = null) : t === "shadow" && (i = r.getAreaStyle(), i.stroke = null), i;
}
function wE(e, t, r, i, n) {
  var a = r.get("value"), o = cg(a, t.axis, t.ecModel, r.get("seriesDataIndices"), {
    precision: r.get(["label", "precision"]),
    formatter: r.get(["label", "formatter"])
  }), s = r.getModel("label"), l = ku(s.get("padding") || 0), u = s.getFont(), h = Wv(o, u), f = n.position, c = h.width + l[1] + l[3], v = h.height + l[0] + l[2], d = n.align;
  d === "right" && (f[0] -= c), d === "center" && (f[0] -= c / 2);
  var _ = n.verticalAlign;
  _ === "bottom" && (f[1] -= v), _ === "middle" && (f[1] -= v / 2), bE(f, c, v, i);
  var p = s.get("backgroundColor");
  (!p || p === "auto") && (p = t.get(["axisLine", "lineStyle", "color"])), e.label = {
    // shape: {x: 0, y: 0, width: width, height: height, r: labelModel.get('borderRadius')},
    x: f[0],
    y: f[1],
    style: Hn(s, {
      text: o,
      font: u,
      fill: s.getTextColor(),
      padding: l,
      backgroundColor: p
    }),
    // Label should be over axisPointer.
    z2: 10
  };
}
function bE(e, t, r, i) {
  var n = i.getWidth(), a = i.getHeight();
  e[0] = Math.min(e[0] + t, n) - t, e[1] = Math.min(e[1] + r, a) - r, e[0] = Math.max(e[0], 0), e[1] = Math.max(e[1], 0);
}
function cg(e, t, r, i, n) {
  e = t.scale.parse(e);
  var a = t.scale.getLabel({
    value: e
  }, {
    // If `precision` is set, width can be fixed (like '12.00500'), which
    // helps to debounce when when moving label.
    precision: n.precision
  }), o = n.formatter;
  if (o) {
    var s = {
      value: ng(t, {
        value: e
      }),
      axisDimension: t.dim,
      axisIndex: t.index,
      seriesData: []
    };
    D(i, function(l) {
      var u = r.getSeriesByIndex(l.seriesIndex), h = l.dataIndexInside, f = u && u.getDataParams(h);
      f && s.seriesData.push(f);
    }), z(o) ? a = o.replace("{value}", a) : rt(o) && (a = o(s));
  }
  return a;
}
function vg(e, t, r) {
  var i = Ci();
  return fu(i, i, r.rotation), dl(i, i, r.position), Lu([e.dataToCoord(t), (r.labelOffset || 0) + (r.labelDirection || 1) * (r.labelMargin || 0)], i);
}
function SE(e, t, r, i, n, a) {
  var o = qr.innerTextLayout(r.rotation, 0, r.labelDirection);
  r.labelMargin = n.get(["label", "margin"]), wE(t, i, n, a, {
    position: vg(i.axis, e, r),
    align: o.textAlign,
    verticalAlign: o.textVerticalAlign
  });
}
function TE(e, t, r) {
  return r = r || 0, {
    x1: e[r],
    y1: e[1 - r],
    x2: t[r],
    y2: t[1 - r]
  };
}
function CE(e, t, r) {
  return r = r || 0, {
    x: e[r],
    y: e[1 - r],
    width: t[r],
    height: t[1 - r]
  };
}
var xE = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.makeElOption = function(r, i, n, a, o) {
      var s = n.axis, l = s.grid, u = a.get("type"), h = Jc(l, s).getOtherAxis(s).getGlobalExtent(), f = s.toGlobalCoord(s.dataToCoord(i, !0));
      if (u && u !== "none") {
        var c = yE(a), v = DE[u](s, f, h);
        v.style = c, r.graphicKey = v.type, r.pointer = v;
      }
      var d = Uc(l.model, n);
      SE(
        // @ts-ignore
        i,
        r,
        d,
        n,
        a,
        o
      );
    }, t.prototype.getHandleTransform = function(r, i, n) {
      var a = Uc(i.axis.grid.model, i, {
        labelInside: !1
      });
      a.labelMargin = n.get(["handle", "margin"]);
      var o = vg(i.axis, r, a);
      return {
        x: o[0],
        y: o[1],
        rotation: a.rotation + (a.labelDirection < 0 ? Math.PI : 0)
      };
    }, t.prototype.updateHandleTransform = function(r, i, n, a) {
      var o = n.axis, s = o.grid, l = o.getGlobalExtent(!0), u = Jc(s, o).getOtherAxis(o).getGlobalExtent(), h = o.dim === "x" ? 0 : 1, f = [r.x, r.y];
      f[h] += i[h], f[h] = Math.min(l[1], f[h]), f[h] = Math.max(l[0], f[h]);
      var c = (u[1] + u[0]) / 2, v = [c, c];
      v[h] = f[h];
      var d = [{
        verticalAlign: "middle"
      }, {
        align: "center"
      }];
      return {
        x: f[0],
        y: f[1],
        rotation: r.rotation,
        cursorPoint: v,
        tooltipOption: d[h]
      };
    }, t;
  })(mE)
);
function Jc(e, t) {
  var r = {};
  return r[t.dim + "AxisIndex"] = t.index, e.getCartesian(r);
}
var DE = {
  line: function(e, t, r) {
    var i = TE([t, r[0]], [t, r[1]], tv(e));
    return {
      type: "Line",
      subPixelOptimize: !0,
      shape: i
    };
  },
  shadow: function(e, t, r) {
    var i = Math.max(1, e.getBandWidth()), n = r[1] - r[0];
    return {
      type: "Rect",
      shape: CE([t - i / 2, r[0]], [i, n], tv(e))
    };
  }
};
function tv(e) {
  return e.dim === "x" ? 0 : 1;
}
var EE = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.type = "axisPointer", t.defaultOption = {
      // 'auto' means that show when triggered by tooltip or handle.
      show: "auto",
      // zlevel: 0,
      z: 50,
      type: "line",
      // axispointer triggered by tootip determine snap automatically,
      // see `modelHelper`.
      snap: !1,
      triggerTooltip: !0,
      triggerEmphasis: !0,
      value: null,
      status: null,
      link: [],
      // Do not set 'auto' here, otherwise global animation: false
      // will not effect at this axispointer.
      animation: null,
      animationDurationUpdate: 200,
      lineStyle: {
        color: "#B9BEC9",
        width: 1,
        type: "dashed"
      },
      shadowStyle: {
        color: "rgba(210,219,238,0.2)"
      },
      label: {
        show: !0,
        formatter: null,
        precision: "auto",
        margin: 3,
        color: "#fff",
        padding: [5, 7, 5, 7],
        backgroundColor: "auto",
        borderColor: null,
        borderWidth: 0,
        borderRadius: 3
      },
      handle: {
        show: !1,
        // eslint-disable-next-line
        icon: "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z",
        size: 45,
        // handle margin is from symbol center to axis, which is stable when circular move.
        margin: 50,
        // color: '#1b8bbd'
        // color: '#2f4554'
        color: "#333",
        shadowBlur: 3,
        shadowColor: "#aaa",
        shadowOffsetX: 0,
        shadowOffsetY: 2,
        // For mobile performance
        throttle: 40
      }
    }, t;
  })(nt)
), Ge = St(), AE = D;
function dg(e, t, r) {
  if (!V.node) {
    var i = t.getZr();
    Ge(i).records || (Ge(i).records = {}), ME(i, t);
    var n = Ge(i).records[e] || (Ge(i).records[e] = {});
    n.handler = r;
  }
}
function ME(e, t) {
  if (Ge(e).initialized)
    return;
  Ge(e).initialized = !0, r("click", Jt(ev, "click")), r("mousemove", Jt(ev, "mousemove")), r("globalout", LE);
  function r(i, n) {
    e.on(i, function(a) {
      var o = IE(t);
      AE(Ge(e).records, function(s) {
        s && n(s, a, o.dispatchAction);
      }), PE(o.pendings, t);
    });
  }
}
function PE(e, t) {
  var r = e.showTip.length, i = e.hideTip.length, n;
  r ? n = e.showTip[r - 1] : i && (n = e.hideTip[i - 1]), n && (n.dispatchAction = null, t.dispatchAction(n));
}
function LE(e, t, r) {
  e.handler("leave", null, r);
}
function ev(e, t, r, i) {
  t.handler(e, r, i);
}
function IE(e) {
  var t = {
    showTip: [],
    hideTip: []
  }, r = function(i) {
    var n = t[i.type];
    n ? n.push(i) : (i.dispatchAction = r, e.dispatchAction(i));
  };
  return {
    dispatchAction: r,
    pendings: t
  };
}
function jl(e, t) {
  if (!V.node) {
    var r = t.getZr(), i = (Ge(r).records || {})[e];
    i && (Ge(r).records[e] = null);
  }
}
var RE = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.render = function(r, i, n) {
      var a = i.getComponent("tooltip"), o = r.get("triggerOn") || a && a.get("triggerOn") || "mousemove|click";
      dg("axisPointer", n, function(s, l, u) {
        o !== "none" && (s === "leave" || o.indexOf(s) >= 0) && u({
          type: "updateAxisPointer",
          currTrigger: s,
          x: l && l.offsetX,
          y: l && l.offsetY
        });
      });
    }, t.prototype.remove = function(r, i) {
      jl("axisPointer", i);
    }, t.prototype.dispose = function(r, i) {
      jl("axisPointer", i);
    }, t.type = "axisPointer", t;
  })(gr)
);
function pg(e, t) {
  var r = [], i = e.seriesIndex, n;
  if (i == null || !(n = t.getSeriesByIndex(i)))
    return {
      point: []
    };
  var a = n.getData(), o = Qn(a, e);
  if (o == null || o < 0 || k(o))
    return {
      point: []
    };
  var s = a.getItemGraphicEl(o), l = n.coordinateSystem;
  if (n.getTooltipPosition)
    r = n.getTooltipPosition(o) || [];
  else if (l && l.dataToPoint)
    if (e.isStacked) {
      var u = l.getBaseAxis(), h = l.getOtherAxis(u), f = h.dim, c = u.dim, v = f === "x" || f === "radius" ? 1 : 0, d = a.mapDimension(c), _ = [];
      _[v] = a.get(d, o), _[1 - v] = a.get(a.getCalculationInfo("stackResultDimension"), o), r = l.dataToPoint(_) || [];
    } else
      r = l.dataToPoint(a.getValues(Q(l.dimensions, function(g) {
        return a.mapDimension(g);
      }), o)) || [];
  else if (s) {
    var p = s.getBoundingRect().clone();
    p.applyTransform(s.transform), r = [p.x + p.width / 2, p.y + p.height / 2];
  }
  return {
    point: r,
    el: s
  };
}
var rv = St();
function OE(e, t, r) {
  var i = e.currTrigger, n = [e.x, e.y], a = e, o = e.dispatchAction || lt(r.dispatchAction, r), s = t.getComponent("axisPointer").coordSysAxesInfo;
  if (s) {
    Xa(n) && (n = pg({
      seriesIndex: a.seriesIndex,
      // Do not use dataIndexInside from other ec instance.
      // FIXME: auto detect it?
      dataIndex: a.dataIndex
    }, t).point);
    var l = Xa(n), u = a.axesInfo, h = s.axesInfo, f = i === "leave" || Xa(n), c = {}, v = {}, d = {
      list: [],
      map: {}
    }, _ = {
      showPointer: Jt(NE, v),
      showTooltip: Jt($E, d)
    };
    D(s.coordSysMap, function(g, m) {
      var y = l || g.containPoint(n);
      D(s.coordSysAxesInfo[m], function(w, S) {
        var b = w.axis, T = zE(u, w);
        if (!f && y && (!u || T)) {
          var C = T && T.value;
          C == null && !l && (C = b.pointToData(n)), C != null && iv(w, C, _, !1, c);
        }
      });
    });
    var p = {};
    return D(h, function(g, m) {
      var y = g.linkGroup;
      y && !v[m] && D(y.axesInfo, function(w, S) {
        var b = v[S];
        if (w !== g && b) {
          var T = b.value;
          y.mapper && (T = g.axis.scale.parse(y.mapper(T, nv(w), nv(g)))), p[g.key] = T;
        }
      });
    }), D(p, function(g, m) {
      iv(h[m], g, _, !0, c);
    }), BE(v, h, c), FE(d, n, e, o), VE(h, o, r), c;
  }
}
function iv(e, t, r, i, n) {
  var a = e.axis;
  if (!(a.scale.isBlank() || !a.containData(t))) {
    if (!e.involveSeries) {
      r.showPointer(e, t);
      return;
    }
    var o = kE(t, e), s = o.payloadBatch, l = o.snapToValue;
    s[0] && n.seriesIndex == null && I(n, s[0]), !i && e.snap && a.containData(l) && l != null && (t = l), r.showPointer(e, t, s), r.showTooltip(e, o, l);
  }
}
function kE(e, t) {
  var r = t.axis, i = r.dim, n = e, a = [], o = Number.MAX_VALUE, s = -1;
  return D(t.seriesModels, function(l, u) {
    var h = l.getData().mapDimensionsAll(i), f, c;
    if (l.getAxisTooltipData) {
      var v = l.getAxisTooltipData(h, e, r);
      c = v.dataIndices, f = v.nestestValue;
    } else {
      if (c = l.getData().indicesOfNearest(
        h[0],
        e,
        // Add a threshold to avoid find the wrong dataIndex
        // when data length is not same.
        // false,
        r.type === "category" ? 0.5 : null
      ), !c.length)
        return;
      f = l.getData().get(h[0], c[0]);
    }
    if (!(f == null || !isFinite(f))) {
      var d = e - f, _ = Math.abs(d);
      _ <= o && ((_ < o || d >= 0 && s < 0) && (o = _, s = d, n = f, a.length = 0), D(c, function(p) {
        a.push({
          seriesIndex: l.seriesIndex,
          dataIndexInside: p,
          dataIndex: l.getData().getRawIndex(p)
        });
      }));
    }
  }), {
    payloadBatch: a,
    snapToValue: n
  };
}
function NE(e, t, r, i) {
  e[t.key] = {
    value: r,
    payloadBatch: i
  };
}
function $E(e, t, r, i) {
  var n = r.payloadBatch, a = t.axis, o = a.model, s = t.axisPointerModel;
  if (!(!t.triggerTooltip || !n.length)) {
    var l = t.coordSys.model, u = qn(l), h = e.map[u];
    h || (h = e.map[u] = {
      coordSysId: l.id,
      coordSysIndex: l.componentIndex,
      coordSysType: l.type,
      coordSysMainType: l.mainType,
      dataByAxis: []
    }, e.list.push(h)), h.dataByAxis.push({
      axisDim: a.dim,
      axisIndex: o.componentIndex,
      axisType: o.type,
      axisId: o.id,
      value: i,
      // Caustion: viewHelper.getValueLabel is actually on "view stage", which
      // depends that all models have been updated. So it should not be performed
      // here. Considering axisPointerModel used here is volatile, which is hard
      // to be retrieve in TooltipView, we prepare parameters here.
      valueLabelOpt: {
        precision: s.get(["label", "precision"]),
        formatter: s.get(["label", "formatter"])
      },
      seriesDataIndices: n.slice()
    });
  }
}
function BE(e, t, r) {
  var i = r.axesInfo = [];
  D(t, function(n, a) {
    var o = n.axisPointerModel.option, s = e[a];
    s ? (!n.useHandle && (o.status = "show"), o.value = s.value, o.seriesDataIndices = (s.payloadBatch || []).slice()) : !n.useHandle && (o.status = "hide"), o.status === "show" && i.push({
      axisDim: n.axis.dim,
      axisIndex: n.axis.model.componentIndex,
      value: o.value
    });
  });
}
function FE(e, t, r, i) {
  if (Xa(t) || !e.list.length) {
    i({
      type: "hideTip"
    });
    return;
  }
  var n = ((e.list[0].dataByAxis[0] || {}).seriesDataIndices || [])[0] || {};
  i({
    type: "showTip",
    escapeConnect: !0,
    x: t[0],
    y: t[1],
    tooltipOption: r.tooltipOption,
    position: r.position,
    dataIndexInside: n.dataIndexInside,
    dataIndex: n.dataIndex,
    seriesIndex: n.seriesIndex,
    dataByCoordSys: e.list
  });
}
function VE(e, t, r) {
  var i = r.getZr(), n = "axisPointerLastHighlights", a = rv(i)[n] || {}, o = rv(i)[n] = {};
  D(e, function(u, h) {
    var f = u.axisPointerModel.option;
    f.status === "show" && u.triggerEmphasis && D(f.seriesDataIndices, function(c) {
      var v = c.seriesIndex + " | " + c.dataIndex;
      o[v] = c;
    });
  });
  var s = [], l = [];
  D(a, function(u, h) {
    !o[h] && l.push(u);
  }), D(o, function(u, h) {
    !a[h] && s.push(u);
  }), l.length && r.dispatchAction({
    type: "downplay",
    escapeConnect: !0,
    // Not blur others when highlight in axisPointer.
    notBlur: !0,
    batch: l
  }), s.length && r.dispatchAction({
    type: "highlight",
    escapeConnect: !0,
    // Not blur others when highlight in axisPointer.
    notBlur: !0,
    batch: s
  });
}
function zE(e, t) {
  for (var r = 0; r < (e || []).length; r++) {
    var i = e[r];
    if (t.axis.dim === i.axisDim && t.axis.model.componentIndex === i.axisIndex)
      return i;
  }
}
function nv(e) {
  var t = e.axis.model, r = {}, i = r.axisDim = e.axis.dim;
  return r.axisIndex = r[i + "AxisIndex"] = t.componentIndex, r.axisName = r[i + "AxisName"] = t.name, r.axisId = r[i + "AxisId"] = t.id, r;
}
function Xa(e) {
  return !e || e[0] == null || isNaN(e[0]) || e[1] == null || isNaN(e[1]);
}
function HE(e) {
  cE.registerAxisPointerClass("CartesianAxisPointer", xE), e.registerComponentModel(EE), e.registerComponentView(RE), e.registerPreprocessor(function(t) {
    if (t) {
      (!t.axisPointer || t.axisPointer.length === 0) && (t.axisPointer = {});
      var r = t.axisPointer.link;
      r && !k(r) && (t.axisPointer.link = [r]);
    }
  }), e.registerProcessor(e.PRIORITY.PROCESSOR.STATISTIC, function(t, r) {
    t.getComponent("axisPointer").coordSysAxesInfo = aE(t, r);
  }), e.registerAction({
    type: "updateAxisPointer",
    event: "updateAxisPointer",
    update: ":updateAxisPointer"
  }, OE);
}
var UE = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.type = "tooltip", t.dependencies = ["axisPointer"], t.defaultOption = {
      // zlevel: 0,
      z: 60,
      show: !0,
      // tooltip main content
      showContent: !0,
      // 'trigger' only works on coordinate system.
      // 'item' | 'axis' | 'none'
      trigger: "item",
      // 'click' | 'mousemove' | 'none'
      triggerOn: "mousemove|click",
      alwaysShowContent: !1,
      displayMode: "single",
      renderMode: "auto",
      // whether restraint content inside viewRect.
      // If renderMode: 'richText', default true.
      // If renderMode: 'html', defaut false (for backward compat).
      confine: null,
      showDelay: 0,
      hideDelay: 100,
      // Animation transition time, unit is second
      transitionDuration: 0.4,
      enterable: !1,
      backgroundColor: "#fff",
      // box shadow
      shadowBlur: 10,
      shadowColor: "rgba(0, 0, 0, .2)",
      shadowOffsetX: 1,
      shadowOffsetY: 2,
      // tooltip border radius, unit is px, default is 4
      borderRadius: 4,
      // tooltip border width, unit is px, default is 0 (no border)
      borderWidth: 1,
      // Tooltip inside padding, default is 5 for all direction
      // Array is allowed to set up, right, bottom, left, same with css
      // The default value: See `tooltip/tooltipMarkup.ts#getPaddingFromTooltipModel`.
      padding: null,
      // Extra css text
      extraCssText: "",
      // axis indicator, trigger by axis
      axisPointer: {
        // default is line
        // legal values: 'line' | 'shadow' | 'cross'
        type: "line",
        // Valid when type is line, appoint tooltip line locate on which line. Optional
        // legal values: 'x' | 'y' | 'angle' | 'radius' | 'auto'
        // default is 'auto', chose the axis which type is category.
        // for multiply y axis, cartesian coord chose x axis, polar chose angle axis
        axis: "auto",
        animation: "auto",
        animationDurationUpdate: 200,
        animationEasingUpdate: "exponentialOut",
        crossStyle: {
          color: "#999",
          width: 1,
          type: "dashed",
          // TODO formatter
          textStyle: {}
        }
        // lineStyle and shadowStyle should not be specified here,
        // otherwise it will always override those styles on option.axisPointer.
      },
      textStyle: {
        color: "#666",
        fontSize: 14
      }
    }, t;
  })(nt)
);
function gg(e) {
  var t = e.get("confine");
  return t != null ? !!t : e.get("renderMode") === "richText";
}
function _g(e) {
  if (V.domSupported) {
    for (var t = document.documentElement.style, r = 0, i = e.length; r < i; r++)
      if (e[r] in t)
        return e[r];
  }
}
var mg = _g(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]), GE = _g(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
function yg(e, t) {
  if (!e)
    return t;
  t = Wd(t, !0);
  var r = e.indexOf(t);
  return e = r === -1 ? t : "-" + e.slice(0, r) + "-" + t, e.toLowerCase();
}
function WE(e, t) {
  var r = e.currentStyle || document.defaultView && document.defaultView.getComputedStyle(e);
  return r ? r[t] : null;
}
var YE = yg(GE, "transition"), qu = yg(mg, "transform"), XE = "position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;" + (V.transform3dSupported ? "will-change:transform;" : "");
function qE(e) {
  return e = e === "left" ? "right" : e === "right" ? "left" : e === "top" ? "bottom" : "top", e;
}
function ZE(e, t, r) {
  if (!z(r) || r === "inside")
    return "";
  var i = e.get("backgroundColor"), n = e.get("borderWidth");
  t = Un(t);
  var a = qE(r), o = Math.max(Math.round(n) * 1.5, 6), s = "", l = qu + ":", u;
  st(["left", "right"], a) > -1 ? (s += "top:50%", l += "translateY(-50%) rotate(" + (u = a === "left" ? -225 : -45) + "deg)") : (s += "left:50%", l += "translateX(-50%) rotate(" + (u = a === "top" ? 225 : 45) + "deg)");
  var h = u * Math.PI / 180, f = o + n, c = f * Math.abs(Math.cos(h)) + f * Math.abs(Math.sin(h)), v = Math.round(((c - Math.SQRT2 * n) / 2 + Math.SQRT2 * n - (c - f) / 2) * 100) / 100;
  s += ";" + a + ":-" + v + "px";
  var d = t + " solid " + n + "px;", _ = ["position:absolute;width:" + o + "px;height:" + o + "px;z-index:-1;", s + ";" + l + ";", "border-bottom:" + d, "border-right:" + d, "background-color:" + i + ";"];
  return '<div style="' + _.join("") + '"></div>';
}
function KE(e, t) {
  var r = "cubic-bezier(0.23,1,0.32,1)", i = " " + e / 2 + "s " + r, n = "opacity" + i + ",visibility" + i;
  return t || (i = " " + e + "s " + r, n += V.transformSupported ? "," + qu + i : ",left" + i + ",top" + i), YE + ":" + n;
}
function av(e, t, r) {
  var i = e.toFixed(0) + "px", n = t.toFixed(0) + "px";
  if (!V.transformSupported)
    return r ? "top:" + n + ";left:" + i + ";" : [["top", n], ["left", i]];
  var a = V.transform3dSupported, o = "translate" + (a ? "3d" : "") + "(" + i + "," + n + (a ? ",0" : "") + ")";
  return r ? "top:0;left:0;" + qu + ":" + o + ";" : [["top", 0], ["left", 0], [mg, o]];
}
function jE(e) {
  var t = [], r = e.get("fontSize"), i = e.getTextColor();
  i && t.push("color:" + i), t.push("font:" + e.getFont());
  var n = X(e.get("lineHeight"), Math.round(r * 3 / 2));
  r && t.push("line-height:" + n + "px");
  var a = e.get("textShadowColor"), o = e.get("textShadowBlur") || 0, s = e.get("textShadowOffsetX") || 0, l = e.get("textShadowOffsetY") || 0;
  return a && o && t.push("text-shadow:" + s + "px " + l + "px " + o + "px " + a), D(["decoration", "align"], function(u) {
    var h = e.get(u);
    h && t.push("text-" + u + ":" + h);
  }), t.join(";");
}
function QE(e, t, r) {
  var i = [], n = e.get("transitionDuration"), a = e.get("backgroundColor"), o = e.get("shadowBlur"), s = e.get("shadowColor"), l = e.get("shadowOffsetX"), u = e.get("shadowOffsetY"), h = e.getModel("textStyle"), f = wp(e, "html"), c = l + "px " + u + "px " + o + "px " + s;
  return i.push("box-shadow:" + c), t && n && i.push(KE(n, r)), a && i.push("background-color:" + a), D(["width", "color", "radius"], function(v) {
    var d = "border-" + v, _ = Wd(d), p = e.get(_);
    p != null && i.push(d + ":" + p + (v === "color" ? "" : "px"));
  }), i.push(jE(h)), f != null && i.push("padding:" + ku(f).join("px ") + "px"), i.join(";") + ";";
}
function ov(e, t, r, i, n) {
  var a = t && t.painter;
  if (r) {
    var o = a && a.getViewportRoot();
    o && Q0(e, o, r, i, n);
  } else {
    e[0] = i, e[1] = n;
    var s = a && a.getViewportRootOffset();
    s && (e[0] += s.offsetLeft, e[1] += s.offsetTop);
  }
  e[2] = e[0] / t.getWidth(), e[3] = e[1] / t.getHeight();
}
var JE = (
  /** @class */
  (function() {
    function e(t, r) {
      if (this._show = !1, this._styleCoord = [0, 0, 0, 0], this._enterable = !0, this._alwaysShowContent = !1, this._firstShow = !0, this._longHide = !0, V.wxa)
        return null;
      var i = document.createElement("div");
      i.domBelongToZr = !0, this.el = i;
      var n = this._zr = t.getZr(), a = r.appendTo, o = a && (z(a) ? document.querySelector(a) : Ii(a) ? a : rt(a) && a(t.getDom()));
      ov(this._styleCoord, n, o, t.getWidth() / 2, t.getHeight() / 2), (o || t.getDom()).appendChild(i), this._api = t, this._container = o;
      var s = this;
      i.onmouseenter = function() {
        s._enterable && (clearTimeout(s._hideTimeout), s._show = !0), s._inContent = !0;
      }, i.onmousemove = function(l) {
        if (l = l || window.event, !s._enterable) {
          var u = n.handler, h = n.painter.getViewportRoot();
          oe(h, l, !0), u.dispatch("mousemove", l);
        }
      }, i.onmouseleave = function() {
        s._inContent = !1, s._enterable && s._show && s.hideLater(s._hideDelay);
      };
    }
    return e.prototype.update = function(t) {
      if (!this._container) {
        var r = this._api.getDom(), i = WE(r, "position"), n = r.style;
        n.position !== "absolute" && i !== "absolute" && (n.position = "relative");
      }
      var a = t.get("alwaysShowContent");
      a && this._moveIfResized(), this._alwaysShowContent = a, this.el.className = t.get("className") || "";
    }, e.prototype.show = function(t, r) {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var i = this.el, n = i.style, a = this._styleCoord;
      i.innerHTML ? n.cssText = XE + QE(t, !this._firstShow, this._longHide) + av(a[0], a[1], !0) + ("border-color:" + Un(r) + ";") + (t.get("extraCssText") || "") + (";pointer-events:" + (this._enterable ? "auto" : "none")) : n.display = "none", this._show = !0, this._firstShow = !1, this._longHide = !1;
    }, e.prototype.setContent = function(t, r, i, n, a) {
      var o = this.el;
      if (t == null) {
        o.innerHTML = "";
        return;
      }
      var s = "";
      if (z(a) && i.get("trigger") === "item" && !gg(i) && (s = ZE(i, n, a)), z(t))
        o.innerHTML = t + s;
      else if (t) {
        o.innerHTML = "", k(t) || (t = [t]);
        for (var l = 0; l < t.length; l++)
          Ii(t[l]) && t[l].parentNode !== o && o.appendChild(t[l]);
        if (s && o.childNodes.length) {
          var u = document.createElement("div");
          u.innerHTML = s, o.appendChild(u);
        }
      }
    }, e.prototype.setEnterable = function(t) {
      this._enterable = t;
    }, e.prototype.getSize = function() {
      var t = this.el;
      return t ? [t.offsetWidth, t.offsetHeight] : [0, 0];
    }, e.prototype.moveTo = function(t, r) {
      if (this.el) {
        var i = this._styleCoord;
        if (ov(i, this._zr, this._container, t, r), i[0] != null && i[1] != null) {
          var n = this.el.style, a = av(i[0], i[1]);
          D(a, function(o) {
            n[o[0]] = o[1];
          });
        }
      }
    }, e.prototype._moveIfResized = function() {
      var t = this._styleCoord[2], r = this._styleCoord[3];
      this.moveTo(t * this._zr.getWidth(), r * this._zr.getHeight());
    }, e.prototype.hide = function() {
      var t = this, r = this.el.style;
      r.visibility = "hidden", r.opacity = "0", V.transform3dSupported && (r.willChange = ""), this._show = !1, this._longHideTimeout = setTimeout(function() {
        return t._longHide = !0;
      }, 500);
    }, e.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(lt(this.hide, this), t)) : this.hide());
    }, e.prototype.isShow = function() {
      return this._show;
    }, e.prototype.dispose = function() {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var t = this.el.parentNode;
      t && t.removeChild(this.el), this.el = this._container = null;
    }, e;
  })()
), tA = (
  /** @class */
  (function() {
    function e(t) {
      this._show = !1, this._styleCoord = [0, 0, 0, 0], this._alwaysShowContent = !1, this._enterable = !0, this._zr = t.getZr(), lv(this._styleCoord, this._zr, t.getWidth() / 2, t.getHeight() / 2);
    }
    return e.prototype.update = function(t) {
      var r = t.get("alwaysShowContent");
      r && this._moveIfResized(), this._alwaysShowContent = r;
    }, e.prototype.show = function() {
      this._hideTimeout && clearTimeout(this._hideTimeout), this.el.show(), this._show = !0;
    }, e.prototype.setContent = function(t, r, i, n, a) {
      var o = this;
      B(t) && Ht(process.env.NODE_ENV !== "production" ? "Passing DOM nodes as content is not supported in richText tooltip!" : ""), this.el && this._zr.remove(this.el);
      var s = i.getModel("textStyle");
      this.el = new ye({
        style: {
          rich: r.richTextStyles,
          text: t,
          lineHeight: 22,
          borderWidth: 1,
          borderColor: n,
          textShadowColor: s.get("textShadowColor"),
          fill: i.get(["textStyle", "color"]),
          padding: wp(i, "richText"),
          verticalAlign: "top",
          align: "left"
        },
        z: i.get("z")
      }), D(["backgroundColor", "borderRadius", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"], function(u) {
        o.el.style[u] = i.get(u);
      }), D(["textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], function(u) {
        o.el.style[u] = s.get(u) || 0;
      }), this._zr.add(this.el);
      var l = this;
      this.el.on("mouseover", function() {
        l._enterable && (clearTimeout(l._hideTimeout), l._show = !0), l._inContent = !0;
      }), this.el.on("mouseout", function() {
        l._enterable && l._show && l.hideLater(l._hideDelay), l._inContent = !1;
      });
    }, e.prototype.setEnterable = function(t) {
      this._enterable = t;
    }, e.prototype.getSize = function() {
      var t = this.el, r = this.el.getBoundingRect(), i = sv(t.style);
      return [r.width + i.left + i.right, r.height + i.top + i.bottom];
    }, e.prototype.moveTo = function(t, r) {
      var i = this.el;
      if (i) {
        var n = this._styleCoord;
        lv(n, this._zr, t, r), t = n[0], r = n[1];
        var a = i.style, o = or(a.borderWidth || 0), s = sv(a);
        i.x = t + o + s.left, i.y = r + o + s.top, i.markRedraw();
      }
    }, e.prototype._moveIfResized = function() {
      var t = this._styleCoord[2], r = this._styleCoord[3];
      this.moveTo(t * this._zr.getWidth(), r * this._zr.getHeight());
    }, e.prototype.hide = function() {
      this.el && this.el.hide(), this._show = !1;
    }, e.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(lt(this.hide, this), t)) : this.hide());
    }, e.prototype.isShow = function() {
      return this._show;
    }, e.prototype.dispose = function() {
      this._zr.remove(this.el);
    }, e;
  })()
);
function or(e) {
  return Math.max(0, e);
}
function sv(e) {
  var t = or(e.shadowBlur || 0), r = or(e.shadowOffsetX || 0), i = or(e.shadowOffsetY || 0);
  return {
    left: or(t - r),
    right: or(t + r),
    top: or(t - i),
    bottom: or(t + i)
  };
}
function lv(e, t, r, i) {
  e[0] = r, e[1] = i, e[2] = e[0] / t.getWidth(), e[3] = e[1] / t.getHeight();
}
var eA = new me({
  shape: {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }
}), rA = (
  /** @class */
  (function(e) {
    W(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.init = function(r, i) {
      if (!(V.node || !i.getDom())) {
        var n = r.getComponent("tooltip"), a = this._renderMode = x1(n.get("renderMode"));
        this._tooltipContent = a === "richText" ? new tA(i) : new JE(i, {
          appendTo: n.get("appendToBody", !0) ? "body" : n.get("appendTo", !0)
        });
      }
    }, t.prototype.render = function(r, i, n) {
      if (!(V.node || !n.getDom())) {
        this.group.removeAll(), this._tooltipModel = r, this._ecModel = i, this._api = n;
        var a = this._tooltipContent;
        a.update(r), a.setEnterable(r.get("enterable")), this._initGlobalListener(), this._keepShow(), this._renderMode !== "richText" && r.get("transitionDuration") ? Tp(this, "_updatePosition", 50, "fixRate") : Hl(this, "_updatePosition");
      }
    }, t.prototype._initGlobalListener = function() {
      var r = this._tooltipModel, i = r.get("triggerOn");
      dg("itemTooltip", this._api, lt(function(n, a, o) {
        i !== "none" && (i.indexOf(n) >= 0 ? this._tryShow(a, o) : n === "leave" && this._hide(o));
      }, this));
    }, t.prototype._keepShow = function() {
      var r = this._tooltipModel, i = this._ecModel, n = this._api, a = r.get("triggerOn");
      if (this._lastX != null && this._lastY != null && a !== "none" && a !== "click") {
        var o = this;
        clearTimeout(this._refreshUpdateTimeout), this._refreshUpdateTimeout = setTimeout(function() {
          !n.isDisposed() && o.manuallyShowTip(r, i, n, {
            x: o._lastX,
            y: o._lastY,
            dataByCoordSys: o._lastDataByCoordSys
          });
        });
      }
    }, t.prototype.manuallyShowTip = function(r, i, n, a) {
      if (!(a.from === this.uid || V.node || !n.getDom())) {
        var o = uv(a, n);
        this._ticket = "";
        var s = a.dataByCoordSys, l = oA(a, i, n);
        if (l) {
          var u = l.el.getBoundingRect().clone();
          u.applyTransform(l.el.transform), this._tryShow({
            offsetX: u.x + u.width / 2,
            offsetY: u.y + u.height / 2,
            target: l.el,
            position: a.position,
            // When manully trigger, the mouse is not on the el, so we'd better to
            // position tooltip on the bottom of the el and display arrow is possible.
            positionDefault: "bottom"
          }, o);
        } else if (a.tooltip && a.x != null && a.y != null) {
          var h = eA;
          h.x = a.x, h.y = a.y, h.update(), vt(h).tooltipConfig = {
            name: null,
            option: a.tooltip
          }, this._tryShow({
            offsetX: a.x,
            offsetY: a.y,
            target: h
          }, o);
        } else if (s)
          this._tryShow({
            offsetX: a.x,
            offsetY: a.y,
            position: a.position,
            dataByCoordSys: s,
            tooltipOption: a.tooltipOption
          }, o);
        else if (a.seriesIndex != null) {
          if (this._manuallyAxisShowTip(r, i, n, a))
            return;
          var f = pg(a, i), c = f.point[0], v = f.point[1];
          c != null && v != null && this._tryShow({
            offsetX: c,
            offsetY: v,
            target: f.el,
            position: a.position,
            // When manully trigger, the mouse is not on the el, so we'd better to
            // position tooltip on the bottom of the el and display arrow is possible.
            positionDefault: "bottom"
          }, o);
        } else a.x != null && a.y != null && (n.dispatchAction({
          type: "updateAxisPointer",
          x: a.x,
          y: a.y
        }), this._tryShow({
          offsetX: a.x,
          offsetY: a.y,
          position: a.position,
          target: n.getZr().findHover(a.x, a.y).target
        }, o));
      }
    }, t.prototype.manuallyHideTip = function(r, i, n, a) {
      var o = this._tooltipContent;
      this._tooltipModel && o.hideLater(this._tooltipModel.get("hideDelay")), this._lastX = this._lastY = this._lastDataByCoordSys = null, a.from !== this.uid && this._hide(uv(a, n));
    }, t.prototype._manuallyAxisShowTip = function(r, i, n, a) {
      var o = a.seriesIndex, s = a.dataIndex, l = i.getComponent("axisPointer").coordSysAxesInfo;
      if (!(o == null || s == null || l == null)) {
        var u = i.getSeriesByIndex(o);
        if (u) {
          var h = u.getData(), f = vn([h.getItemModel(s), u, (u.coordinateSystem || {}).model], this._tooltipModel);
          if (f.get("trigger") === "axis")
            return n.dispatchAction({
              type: "updateAxisPointer",
              seriesIndex: o,
              dataIndex: s,
              position: a.position
            }), !0;
        }
      }
    }, t.prototype._tryShow = function(r, i) {
      var n = r.target, a = this._tooltipModel;
      if (a) {
        this._lastX = r.offsetX, this._lastY = r.offsetY;
        var o = r.dataByCoordSys;
        if (o && o.length)
          this._showAxisTooltip(o, r);
        else if (n) {
          var s = vt(n);
          if (s.ssrType === "legend")
            return;
          this._lastDataByCoordSys = null;
          var l, u;
          wn(n, function(h) {
            if (vt(h).dataIndex != null)
              return l = h, !0;
            if (vt(h).tooltipConfig != null)
              return u = h, !0;
          }, !0), l ? this._showSeriesItemTooltip(r, l, i) : u ? this._showComponentItemTooltip(r, u, i) : this._hide(i);
        } else
          this._lastDataByCoordSys = null, this._hide(i);
      }
    }, t.prototype._showOrMove = function(r, i) {
      var n = r.get("showDelay");
      i = lt(i, this), clearTimeout(this._showTimout), n > 0 ? this._showTimout = setTimeout(i, n) : i();
    }, t.prototype._showAxisTooltip = function(r, i) {
      var n = this._ecModel, a = this._tooltipModel, o = [i.offsetX, i.offsetY], s = vn([i.tooltipOption], a), l = this._renderMode, u = [], h = Wn("section", {
        blocks: [],
        noHeader: !0
      }), f = [], c = new Hs();
      D(r, function(m) {
        D(m.dataByAxis, function(y) {
          var w = n.getComponent(y.axisDim + "Axis", y.axisIndex), S = y.value;
          if (!(!w || S == null)) {
            var b = cg(S, w.axis, n, y.seriesDataIndices, y.valueLabelOpt), T = Wn("section", {
              header: b,
              noHeader: !Pe(b),
              sortBlocks: !0,
              blocks: []
            });
            h.blocks.push(T), D(y.seriesDataIndices, function(C) {
              var x = n.getSeriesByIndex(C.seriesIndex), E = C.dataIndexInside, A = x.getDataParams(E);
              if (!(A.dataIndex < 0)) {
                A.axisDim = y.axisDim, A.axisIndex = y.axisIndex, A.axisType = y.axisType, A.axisId = y.axisId, A.axisValue = ng(w.axis, {
                  value: S
                }), A.axisValueLabel = b, A.marker = c.makeTooltipMarker("item", Un(A.color), l);
                var M = jf(x.formatTooltip(E, !0, null)), L = M.frag;
                if (L) {
                  var P = vn([x], a).get("valueFormatter");
                  T.blocks.push(P ? I({
                    valueFormatter: P
                  }, L) : L);
                }
                M.text && f.push(M.text), u.push(A);
              }
            });
          }
        });
      }), h.blocks.reverse(), f.reverse();
      var v = i.position, d = s.get("order"), _ = rc(h, c, l, d, n.get("useUTC"), s.get("textStyle"));
      _ && f.unshift(_);
      var p = l === "richText" ? `

` : "<br/>", g = f.join(p);
      this._showOrMove(s, function() {
        this._updateContentNotChangedOnAxis(r, u) ? this._updatePosition(s, v, o[0], o[1], this._tooltipContent, u) : this._showTooltipContent(s, g, u, Math.random() + "", o[0], o[1], v, null, c);
      });
    }, t.prototype._showSeriesItemTooltip = function(r, i, n) {
      var a = this._ecModel, o = vt(i), s = o.seriesIndex, l = a.getSeriesByIndex(s), u = o.dataModel || l, h = o.dataIndex, f = o.dataType, c = u.getData(f), v = this._renderMode, d = r.positionDefault, _ = vn([c.getItemModel(h), u, l && (l.coordinateSystem || {}).model], this._tooltipModel, d ? {
        position: d
      } : null), p = _.get("trigger");
      if (!(p != null && p !== "item")) {
        var g = u.getDataParams(h, f), m = new Hs();
        g.marker = m.makeTooltipMarker("item", Un(g.color), v);
        var y = jf(u.formatTooltip(h, !1, f)), w = _.get("order"), S = _.get("valueFormatter"), b = y.frag, T = b ? rc(S ? I({
          valueFormatter: S
        }, b) : b, m, v, w, a.get("useUTC"), _.get("textStyle")) : y.text, C = "item_" + u.name + "_" + h;
        this._showOrMove(_, function() {
          this._showTooltipContent(_, T, g, C, r.offsetX, r.offsetY, r.position, r.target, m);
        }), n({
          type: "showTip",
          dataIndexInside: h,
          dataIndex: c.getRawIndex(h),
          seriesIndex: s,
          from: this.uid
        });
      }
    }, t.prototype._showComponentItemTooltip = function(r, i, n) {
      var a = this._renderMode === "html", o = vt(i), s = o.tooltipConfig, l = s.option || {}, u = l.encodeHTMLContent;
      if (z(l)) {
        var h = l;
        l = {
          content: h,
          // Fixed formatter
          formatter: h
        }, u = !0;
      }
      u && a && l.content && (l = tt(l), l.content = Vt(l.content));
      var f = [l], c = this._ecModel.getComponent(o.componentMainType, o.componentIndex);
      c && f.push(c), f.push({
        formatter: l.content
      });
      var v = r.positionDefault, d = vn(f, this._tooltipModel, v ? {
        position: v
      } : null), _ = d.get("content"), p = Math.random() + "", g = new Hs();
      this._showOrMove(d, function() {
        var m = tt(d.get("formatterParams") || {});
        this._showTooltipContent(d, _, m, p, r.offsetX, r.offsetY, r.position, i, g);
      }), n({
        type: "showTip",
        from: this.uid
      });
    }, t.prototype._showTooltipContent = function(r, i, n, a, o, s, l, u, h) {
      if (this._ticket = "", !(!r.get("showContent") || !r.get("show"))) {
        var f = this._tooltipContent;
        f.setEnterable(r.get("enterable"));
        var c = r.get("formatter");
        l = l || r.get("position");
        var v = i, d = this._getNearestPoint([o, s], n, r.get("trigger"), r.get("borderColor")), _ = d.color;
        if (c)
          if (z(c)) {
            var p = r.ecModel.get("useUTC"), g = k(n) ? n[0] : n, m = g && g.axisType && g.axisType.indexOf("time") >= 0;
            v = c, m && (v = Gd(g.axisValue, v, p)), v = Yd(v, n, !0);
          } else if (rt(c)) {
            var y = lt(function(w, S) {
              w === this._ticket && (f.setContent(S, h, r, _, l), this._updatePosition(r, l, o, s, f, n, u));
            }, this);
            this._ticket = a, v = c(n, a, y);
          } else
            v = c;
        f.setContent(v, h, r, _, l), f.show(r, _), this._updatePosition(r, l, o, s, f, n, u);
      }
    }, t.prototype._getNearestPoint = function(r, i, n, a) {
      if (n === "axis" || k(i))
        return {
          color: a || (this._renderMode === "html" ? "#fff" : "none")
        };
      if (!k(i))
        return {
          color: a || i.color || i.borderColor
        };
    }, t.prototype._updatePosition = function(r, i, n, a, o, s, l) {
      var u = this._api.getWidth(), h = this._api.getHeight();
      i = i || r.get("position");
      var f = o.getSize(), c = r.get("align"), v = r.get("verticalAlign"), d = l && l.getBoundingRect().clone();
      if (l && d.applyTransform(l.transform), rt(i) && (i = i([n, a], s, o.el, d, {
        viewSize: [u, h],
        contentSize: f.slice()
      })), k(i))
        n = wt(i[0], u), a = wt(i[1], h);
      else if (B(i)) {
        var _ = i;
        _.width = f[0], _.height = f[1];
        var p = qd(_, {
          width: u,
          height: h
        });
        n = p.x, a = p.y, c = null, v = null;
      } else if (z(i) && l) {
        var g = aA(i, d, f, r.get("borderWidth"));
        n = g[0], a = g[1];
      } else {
        var g = iA(n, a, o, u, h, c ? null : 20, v ? null : 20);
        n = g[0], a = g[1];
      }
      if (c && (n -= hv(c) ? f[0] / 2 : c === "right" ? f[0] : 0), v && (a -= hv(v) ? f[1] / 2 : v === "bottom" ? f[1] : 0), gg(r)) {
        var g = nA(n, a, o, u, h);
        n = g[0], a = g[1];
      }
      o.moveTo(n, a);
    }, t.prototype._updateContentNotChangedOnAxis = function(r, i) {
      var n = this._lastDataByCoordSys, a = this._cbParamsList, o = !!n && n.length === r.length;
      return o && D(n, function(s, l) {
        var u = s.dataByAxis || [], h = r[l] || {}, f = h.dataByAxis || [];
        o = o && u.length === f.length, o && D(u, function(c, v) {
          var d = f[v] || {}, _ = c.seriesDataIndices || [], p = d.seriesDataIndices || [];
          o = o && c.value === d.value && c.axisType === d.axisType && c.axisId === d.axisId && _.length === p.length, o && D(_, function(g, m) {
            var y = p[m];
            o = o && g.seriesIndex === y.seriesIndex && g.dataIndex === y.dataIndex;
          }), a && D(c.seriesDataIndices, function(g) {
            var m = g.seriesIndex, y = i[m], w = a[m];
            y && w && w.data !== y.data && (o = !1);
          });
        });
      }), this._lastDataByCoordSys = r, this._cbParamsList = i, !!o;
    }, t.prototype._hide = function(r) {
      this._lastDataByCoordSys = null, r({
        type: "hideTip",
        from: this.uid
      });
    }, t.prototype.dispose = function(r, i) {
      V.node || !i.getDom() || (Hl(this, "_updatePosition"), this._tooltipContent.dispose(), jl("itemTooltip", i));
    }, t.type = "tooltip", t;
  })(gr)
);
function vn(e, t, r) {
  var i = t.ecModel, n;
  r ? (n = new dt(r, i, i), n = new dt(t.option, n, i)) : n = t;
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a];
    o && (o instanceof dt && (o = o.get("tooltip", !0)), z(o) && (o = {
      formatter: o
    }), o && (n = new dt(o, n, i)));
  }
  return n;
}
function uv(e, t) {
  return e.dispatchAction || lt(t.dispatchAction, t);
}
function iA(e, t, r, i, n, a, o) {
  var s = r.getSize(), l = s[0], u = s[1];
  return a != null && (e + l + a + 2 > i ? e -= l + a : e += a), o != null && (t + u + o > n ? t -= u + o : t += o), [e, t];
}
function nA(e, t, r, i, n) {
  var a = r.getSize(), o = a[0], s = a[1];
  return e = Math.min(e + o, i) - o, t = Math.min(t + s, n) - s, e = Math.max(e, 0), t = Math.max(t, 0), [e, t];
}
function aA(e, t, r, i) {
  var n = r[0], a = r[1], o = Math.ceil(Math.SQRT2 * i) + 8, s = 0, l = 0, u = t.width, h = t.height;
  switch (e) {
    case "inside":
      s = t.x + u / 2 - n / 2, l = t.y + h / 2 - a / 2;
      break;
    case "top":
      s = t.x + u / 2 - n / 2, l = t.y - a - o;
      break;
    case "bottom":
      s = t.x + u / 2 - n / 2, l = t.y + h + o;
      break;
    case "left":
      s = t.x - n - o, l = t.y + h / 2 - a / 2;
      break;
    case "right":
      s = t.x + u + o, l = t.y + h / 2 - a / 2;
  }
  return [s, l];
}
function hv(e) {
  return e === "center" || e === "middle";
}
function oA(e, t, r) {
  var i = pu(e).queryOptionMap, n = i.keys()[0];
  if (!(!n || n === "series")) {
    var a = Jn(t, n, i.get(n), {
      useDefault: !1,
      enableAll: !1,
      enableNone: !1
    }), o = a.models[0];
    if (o) {
      var s = r.getViewOfComponentModel(o), l;
      if (s.group.traverse(function(u) {
        var h = vt(u).tooltipConfig;
        if (h && h.name === e.name)
          return l = u, !0;
      }), l)
        return {
          componentMainType: n,
          componentIndex: o.componentIndex,
          el: l
        };
    }
  }
}
function sA(e) {
  Yu(HE), e.registerComponentModel(UE), e.registerComponentView(rA), e.registerAction({
    type: "showTip",
    event: "showTip",
    update: "tooltip:manuallyShowTip"
  }, Gt), e.registerAction({
    type: "hideTip",
    event: "hideTip",
    update: "tooltip:manuallyHideTip"
  }, Gt);
}
var lA = Object.defineProperty, uA = Object.getOwnPropertyDescriptor, Zu = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? uA(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && lA(t, r, n), n;
};
Yu([JD, sA, _E]);
let Zn = class extends We {
  constructor() {
    super(...arguments), this.items = [], this.language = "en";
  }
  firstUpdated() {
    const e = this.renderRoot.querySelector(".chart");
    e && (this.chart = aD(e, void 0, { renderer: "canvas" }), this.resizeObserver = new ResizeObserver(() => this.chart?.resize()), this.resizeObserver.observe(e), this.updateChart());
  }
  updated() {
    this.updateChart();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.resizeObserver?.disconnect(), this.resizeObserver = void 0, this.chart?.dispose(), this.chart = void 0;
  }
  updateChart() {
    if (!this.chart) return;
    const e = new Intl.NumberFormat(this.language), t = {
      animation: !1,
      tooltip: {
        trigger: "item",
        renderMode: "html",
        confine: !0,
        valueFormatter: (r) => e.format(Number(r))
      },
      series: [{
        type: "pie",
        radius: ["62%", "90%"],
        center: ["50%", "50%"],
        clockwise: !0,
        startAngle: 90,
        avoidLabelOverlap: !0,
        label: { show: !1 },
        labelLine: { show: !1 },
        itemStyle: { borderWidth: 2, borderColor: "transparent" },
        emphasis: { scale: !0, scaleSize: 4 },
        data: this.items.map((r) => ({
          name: r.name,
          value: r.bottles,
          itemStyle: { color: r.color }
        }))
      }]
    };
    this.chart.setOption(t, { notMerge: !0, lazyUpdate: !0 });
  }
  render() {
    return N`<div class="chart" role="presentation"></div>`;
  }
};
Zn.styles = Do`
    :host { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; }
    .chart { width: 100%; height: 100%; min-height: 0; }
  `;
Zu([
  jr({ attribute: !1 })
], Zn.prototype, "items", 2);
Zu([
  jr()
], Zn.prototype, "language", 2);
Zn = Zu([
  Bi("ploc-cellar-donut-chart")
], Zn);
var hA = Object.defineProperty, fA = Object.getOwnPropertyDescriptor, _r = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? fA(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && hA(t, r, n), n;
};
const fv = [
  "#D55E00",
  "#0072B2",
  "#009E73",
  "#E69F00",
  "#CC79A7",
  "#56B4E9",
  "#F0E442",
  "#6A3D9A"
];
let Ne = class extends We {
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
    const r = t.config_entry_id, i = ++this.requestGeneration;
    this.loading = !0, this.error = void 0;
    try {
      const n = await e.callWS({
        type: "call_service",
        domain: "ploc_cellar",
        service: "get_inventory",
        service_data: { config_entry_id: r },
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
    if (!e) return jt(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  metric(e, t) {
    return N`
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
    const t = (o) => jt(this.hass?.language ?? "en", o), r = /* @__PURE__ */ new Map();
    for (const o of this.inventory?.wines ?? []) {
      const s = o[e], l = s === null || s === "" ? t("statistics_unknown") : String(s), u = r.get(l) ?? { name: l, bottles: 0, wines: 0 };
      if (u.bottles += this.getBottleCount(o), u.wines += 1, e === "color" && o.color_rgb && !u.color) {
        const h = o.color_rgb.map(
          (f) => Math.min(255, Math.max(0, Math.round(f)))
        );
        u.color = `rgb(${h.join(", ")})`;
      }
      r.set(l, u);
    }
    const i = [...r.values()].sort(
      (o, s) => s.bottles - o.bottles || o.name.localeCompare(s.name, this.hass?.language)
    );
    if (i.length <= 8) return i;
    const n = i.slice(0, 7), a = i.slice(7).reduce(
      (o, s) => ({
        name: t("statistics_other"),
        bottles: o.bottles + s.bottles,
        wines: o.wines + s.wines
      }),
      { name: t("statistics_other"), bottles: 0, wines: 0 }
    );
    return [...n, a];
  }
  renderDistribution(e, t) {
    const r = (s) => jt(this.hass?.language ?? "en", s), i = this.distribution(e), n = i.reduce((s, l) => s + l.bottles, 0), a = i.filter((s) => s.bottles > 0).map((s, l) => ({
      ...s,
      color: s.color ?? fv[l % fv.length]
    })), o = i.map((s) => `${s.name}: ${this.formatNumber(s.bottles)}`).join(", ");
    return N`
      <section class="group">
        <h3 class="group-title">${r(t)}</h3>
        ${n > 0 ? N`
          <div class=${this.config?.show_statistics_legends === !1 ? "chart-content chart-content-no-legend" : "chart-content"}>
            <div class="donut" role="img"
              aria-label=${r(t) + ": " + o}>
              <ploc-cellar-donut-chart
                class="donut-chart"
                .items=${a}
                .language=${this.hass?.language ?? "en"}>
              </ploc-cellar-donut-chart>
              <div class="donut-center">
                <span class="donut-total">${this.formatNumber(n)}</span>
                <span class="donut-caption">${r("statistics_bottles")}</span>
              </div>
            </div>
            ${this.config?.show_statistics_legends === !1 ? F : N`
              <div class="legend">
                ${a.map((s) => N`
                <div class="legend-item">
                  <span class="legend-swatch" style=${`background: ${s.color}`}></span>
                  <span class="legend-name">${s.name}</span>
                  <span class="legend-value">${this.formatNumber(s.bottles)}</span>
                  <span class="legend-meta">
                    ${new Intl.NumberFormat(this.hass?.language ?? void 0, {
      style: "percent",
      maximumFractionDigits: 1
    }).format(s.bottles / n)}
                    · ${this.formatNumber(s.wines)} ${r("statistics_references")}
                  </span>
                </div>
                `)}
              </div>
            `}
          </div>
        ` : N`<p class="muted">${r("statistics_empty")}</p>`}
      </section>
    `;
  }
  getDiagnosticWines(e) {
    const t = e === "unlocated" ? "unlocated_bottles" : e === "negative" ? "negative_movement_bottles" : "physical_surplus_bottles";
    return (this.inventory?.wine_diagnostics ?? []).filter((r) => (r[t] ?? 0) > 0).sort((r, i) => (i[t] ?? 0) - (r[t] ?? 0) || r.name.localeCompare(i.name, this.hass?.language));
  }
  renderDiagnosticDialog() {
    const e = this.activeDiagnostic;
    if (!e) return F;
    const t = e === "unlocated" ? "diagnostic_unlocated" : e === "negative" ? "diagnostic_negative" : "diagnostic_surplus", r = e === "unlocated" ? "diagnostic_detail_unlocated" : e === "negative" ? "diagnostic_detail_negative" : "diagnostic_detail_surplus", i = this.getDiagnosticWines(e), n = (o) => jt(this.hass?.language ?? "en", o), a = (o) => e === "unlocated" ? o.unlocated_bottles ?? 0 : e === "negative" ? o.negative_movement_bottles ?? 0 : o.physical_surplus_bottles ?? 0;
    return N`
      <ha-dialog .open=${!0} .heading=${n(t)} @closed=${() => {
      this.activeDiagnostic = void 0;
    }}>
        <div class="diagnostic-detail-list">
          <p class="muted">${n(r)}</p>
          ${i.length ? i.map((o) => N`
            <section class="diagnostic-detail-item">
              <h4 class="diagnostic-detail-name">${o.name}${o.vintage ? ` · ${o.vintage}` : ""}</h4>
              <dl class="diagnostic-detail-meta">
                <div><dt>${n("diagnostic_detail_quantity")}</dt><dd>${this.formatNumber(a(o))}</dd></div>
                <div><dt>${n("diagnostic_detail_in_cellar")}</dt><dd>${this.formatNumber(o.bottles_in_cellar)}</dd></div>
                <div><dt>${n("diagnostic_detail_stock")}</dt><dd>${this.formatNumber(o.effective_stock)}</dd></div>
                ${e === "negative" ? N`
                  <div><dt>${n("diagnostic_detail_purchased")}</dt><dd>${this.formatNumber(o.purchased ?? 0)}</dd></div>
                  <div><dt>${n("diagnostic_detail_consumed")}</dt><dd>${this.formatNumber(o.consumed ?? 0)}</dd></div>
                  <div><dt>${n("diagnostic_detail_balance")}</dt><dd>${this.formatNumber(o.movement_balance ?? 0)}</dd></div>
                ` : F}
              </dl>
            </section>
          `) : N`<p class="muted">${n("diagnostic_detail_empty")}</p>`}
        </div>
      </ha-dialog>
    `;
  }
  render() {
    const e = (f) => jt(this.hass?.language ?? "en", f), t = this.inventory, r = this.config?.title ?? e("card_title"), i = this.config?.show_occupancy !== !1, n = this.config?.show_diagnostics !== !1, a = this.config?.show_statistics !== !1, o = t && t.total_positions > 0 ? Math.round(t.occupied_positions / t.total_positions * 100) : 0, s = t?.stock_reconstruction_complete ? [
      { key: "diagnostic_unlocated", value: t.unlocated_bottles ?? 0 },
      { key: "diagnostic_negative", value: t.negative_movement_bottles ?? 0 },
      { key: "diagnostic_surplus", value: t.physical_surplus_bottles ?? 0 }
    ].filter((f) => f.value > 0) : [], l = !!(t && (!t.stock_reconstruction_complete || s.length > 0 || t.positions_with_unknown_wine > 0)), u = t?.wines ?? [], h = t?.wine_references ?? u.length;
    return N`
      <ha-card>
        <header>
          <h2>${r}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? N`<div class="error">${this.error}</div>` : F}
        ${this.config?.config_entry_id ? F : N`<div class="muted">${e("select_config")}</div>`}
        ${t ? N`
          ${t.stale ? N`<div class="warning">${e("stale")}</div>` : F}
          <div class="summary">
            ${this.metric(t.total_bottles, e("bottles_in_cellar"))}
            ${this.metric(
      t.total_stock_bottles ?? e("unknown_value"),
      e("reconstructed_stock")
    )}
            ${this.metric(h, e("stocked_references"))}
            ${this.metric(t.rack_count, e("racks"))}
          </div>
          ${i ? N`
            <section class="section" aria-label=${e("rack_occupancy")}>
              <div class="occupancy-heading">
                <span>${e("rack_occupancy")}</span>
                <span>${this.formatNumber(t.occupied_positions)} / ${this.formatNumber(t.total_positions)}</span>
              </div>
              <div class="occupancy-bar" role="progressbar"
                aria-label=${e("rack_occupancy")}
                aria-valuemin="0" aria-valuemax=${t.total_positions}
                aria-valuenow=${t.occupied_positions}>
                <div class="occupancy-fill" style=${`width: ${o}%`}></div>
              </div>
              <div class="muted">${e("empty_positions")}: ${this.formatNumber(Math.max(0, t.total_positions - t.occupied_positions))}</div>
            </section>
          ` : F}
          ${n && l ? N`
            <section class="section">
              <h3 class="section-title">${e("inventory_diagnostics")}</h3>
              ${t.stock_reconstruction_complete ? F : N`<div class="warning">${e("reconstruction_incomplete")}</div>`}
              ${s.length ? N`
                <div class="diagnostics">
                  ${s.map((f) => {
      const c = f.key === "diagnostic_unlocated" ? "unlocated" : f.key === "diagnostic_negative" ? "negative" : "surplus";
      return N`
                      <button class="diagnostic" type="button" aria-haspopup="dialog"
                        @click=${() => {
        this.activeDiagnostic = c;
      }}>
                        <span class="diagnostic-value">${this.formatNumber(f.value)}</span>
                        <span class="label">${e(f.key)}</span>
                        <span class="diagnostic-hint">${e("diagnostic_detail_open")}</span>
                      </button>
                    `;
    })}
                </div>
              ` : F}
              ${t.positions_with_unknown_wine > 0 ? N`<div class="warning">${e("statistics_unknown_wine_positions").replace("{count}", this.formatNumber(t.positions_with_unknown_wine))}</div>` : F}
            </section>
          ` : F}
          ${a ? N`
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
          ` : F}
          <div class="muted section">${e("last_sync")}: ${this.formatSync(t.last_sync)}</div>
          ${this.renderDiagnosticDialog()}
        ` : F}
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
Ne.styles = Do`
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
    .donut { position: relative; display: block; width: 100%; max-width: 150px; aspect-ratio: 1; justify-self: center; }
    .donut-chart { display: block; width: 100%; height: 100%; }
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
_r([
  jr({ attribute: !1 })
], Ne.prototype, "hass", 2);
_r([
  gt()
], Ne.prototype, "config", 2);
_r([
  gt()
], Ne.prototype, "inventory", 2);
_r([
  gt()
], Ne.prototype, "loading", 2);
_r([
  gt()
], Ne.prototype, "error", 2);
_r([
  gt()
], Ne.prototype, "activeDiagnostic", 2);
Ne = _r([
  Bi("ploc-cellar-card")
], Ne);
let cv = class extends Ne {
};
cv = _r([
  Bi("ploc-cellar-statistics-card")
], cv);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: Li("picker_overview_name"),
  description: Li("picker_overview_description")
});
export {
  Ne as PlocCellarCard,
  cv as PlocCellarStatisticsCard
};
