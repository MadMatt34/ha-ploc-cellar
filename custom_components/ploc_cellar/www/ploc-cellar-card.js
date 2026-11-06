const Da = globalThis, Fl = Da.ShadowRoot && (Da.ShadyCSS === void 0 || Da.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, zl = /* @__PURE__ */ Symbol(), Fu = /* @__PURE__ */ new WeakMap();
let Jc = class {
  constructor(t, r, i) {
    if (this._$cssResult$ = !0, i !== zl) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = r;
  }
  get styleSheet() {
    let t = this.o;
    const r = this.t;
    if (Fl && t === void 0) {
      const i = r !== void 0 && r.length === 1;
      i && (t = Fu.get(r)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && Fu.set(r, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const lg = (e) => new Jc(typeof e == "string" ? e : e + "", void 0, zl), po = (e, ...t) => {
  const r = e.length === 1 ? e[0] : t.reduce((i, n, a) => i + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(n) + e[a + 1], e[0]);
  return new Jc(r, e, zl);
}, ug = (e, t) => {
  if (Fl) e.adoptedStyleSheets = t.map((r) => r instanceof CSSStyleSheet ? r : r.styleSheet);
  else for (const r of t) {
    const i = document.createElement("style"), n = Da.litNonce;
    n !== void 0 && i.setAttribute("nonce", n), i.textContent = r.cssText, e.appendChild(i);
  }
}, zu = Fl ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let r = "";
  for (const i of t.cssRules) r += i.cssText;
  return lg(r);
})(e) : e;
const { is: hg, defineProperty: fg, getOwnPropertyDescriptor: cg, getOwnPropertyNames: vg, getOwnPropertySymbols: dg, getPrototypeOf: pg } = Object, go = globalThis, Hu = go.trustedTypes, gg = Hu ? Hu.emptyScript : "", _g = go.reactiveElementPolyfillSupport, un = (e, t) => e, Ha = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? gg : null;
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
} }, Hl = (e, t) => !hg(e, t), Vu = { attribute: !0, type: String, converter: Ha, reflect: !1, useDefault: !1, hasChanged: Hl };
Symbol.metadata ??= /* @__PURE__ */ Symbol("metadata"), go.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let ui = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, r = Vu) {
    if (r.state && (r.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((r = Object.create(r)).wrapped = !0), this.elementProperties.set(t, r), !r.noAccessor) {
      const i = /* @__PURE__ */ Symbol(), n = this.getPropertyDescriptor(t, i, r);
      n !== void 0 && fg(this.prototype, t, n);
    }
  }
  static getPropertyDescriptor(t, r, i) {
    const { get: n, set: a } = cg(this.prototype, t) ?? { get() {
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
    return this.elementProperties.get(t) ?? Vu;
  }
  static _$Ei() {
    if (this.hasOwnProperty(un("elementProperties"))) return;
    const t = pg(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(un("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(un("properties"))) {
      const r = this.properties, i = [...vg(r), ...dg(r)];
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
      for (const n of i) r.unshift(zu(n));
    } else t !== void 0 && r.push(zu(t));
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
    return ug(t, this.constructor.elementStyles), t;
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
      const a = (i.converter?.toAttribute !== void 0 ? i.converter : Ha).toAttribute(r, i.type);
      this._$Em = t, a == null ? this.removeAttribute(n) : this.setAttribute(n, a), this._$Em = null;
    }
  }
  _$AK(t, r) {
    const i = this.constructor, n = i._$Eh.get(t);
    if (n !== void 0 && this._$Em !== n) {
      const a = i.getPropertyOptions(n), o = typeof a.converter == "function" ? { fromAttribute: a.converter } : a.converter?.fromAttribute !== void 0 ? a.converter : Ha;
      this._$Em = n;
      const s = o.fromAttribute(r, a.type);
      this[n] = s ?? this._$Ej?.get(n) ?? s, this._$Em = null;
    }
  }
  requestUpdate(t, r, i, n = !1, a) {
    if (t !== void 0) {
      const o = this.constructor;
      if (n === !1 && (a = this[t]), i ??= o.getPropertyOptions(t), !((i.hasChanged ?? Hl)(a, r) || i.useDefault && i.reflect && a === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, i)))) return;
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
ui.elementStyles = [], ui.shadowRootOptions = { mode: "open" }, ui[un("elementProperties")] = /* @__PURE__ */ new Map(), ui[un("finalized")] = /* @__PURE__ */ new Map(), _g?.({ ReactiveElement: ui }), (go.reactiveElementVersions ??= []).push("2.1.2");
const Vl = globalThis, Uu = (e) => e, Va = Vl.trustedTypes, Gu = Va ? Va.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, tv = "$lit$", er = `lit$${Math.random().toFixed(9).slice(2)}$`, ev = "?" + er, mg = `<${ev}>`, Ur = document, Tn = () => Ur.createComment(""), xn = (e) => e === null || typeof e != "object" && typeof e != "function", Ul = Array.isArray, yg = (e) => Ul(e) || typeof e?.[Symbol.iterator] == "function", $o = `[ 	
\f\r]`, Oi = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Wu = /-->/g, Yu = />/g, vr = RegExp(`>|${$o}(?:([^\\s"'>=/]+)(${$o}*=${$o}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Xu = /'/g, qu = /"/g, rv = /^(?:script|style|textarea|title)$/i, wg = (e) => (t, ...r) => ({ _$litType$: e, strings: t, values: r }), O = wg(1), bi = /* @__PURE__ */ Symbol.for("lit-noChange"), N = /* @__PURE__ */ Symbol.for("lit-nothing"), Zu = /* @__PURE__ */ new WeakMap(), Or = Ur.createTreeWalker(Ur, 129);
function iv(e, t) {
  if (!Ul(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Gu !== void 0 ? Gu.createHTML(t) : t;
}
const Sg = (e, t) => {
  const r = e.length - 1, i = [];
  let n, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = Oi;
  for (let s = 0; s < r; s++) {
    const l = e[s];
    let u, h, f = -1, v = 0;
    for (; v < l.length && (o.lastIndex = v, h = o.exec(l), h !== null); ) v = o.lastIndex, o === Oi ? h[1] === "!--" ? o = Wu : h[1] !== void 0 ? o = Yu : h[2] !== void 0 ? (rv.test(h[2]) && (n = RegExp("</" + h[2], "g")), o = vr) : h[3] !== void 0 && (o = vr) : o === vr ? h[0] === ">" ? (o = n ?? Oi, f = -1) : h[1] === void 0 ? f = -2 : (f = o.lastIndex - h[2].length, u = h[1], o = h[3] === void 0 ? vr : h[3] === '"' ? qu : Xu) : o === qu || o === Xu ? o = vr : o === Wu || o === Yu ? o = Oi : (o = vr, n = void 0);
    const c = o === vr && e[s + 1].startsWith("/>") ? " " : "";
    a += o === Oi ? l + mg : f >= 0 ? (i.push(u), l.slice(0, f) + tv + l.slice(f) + er + c) : l + er + (f === -2 ? s : c);
  }
  return [iv(e, a + (e[r] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), i];
};
class Cn {
  constructor({ strings: t, _$litType$: r }, i) {
    let n;
    this.parts = [];
    let a = 0, o = 0;
    const s = t.length - 1, l = this.parts, [u, h] = Sg(t, r);
    if (this.el = Cn.createElement(u, i), Or.currentNode = this.el.content, r === 2 || r === 3) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (n = Or.nextNode()) !== null && l.length < s; ) {
      if (n.nodeType === 1) {
        if (n.hasAttributes()) for (const f of n.getAttributeNames()) if (f.endsWith(tv)) {
          const v = h[o++], c = n.getAttribute(f).split(er), d = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: a, name: d[2], strings: c, ctor: d[1] === "." ? Tg : d[1] === "?" ? xg : d[1] === "@" ? Cg : _o }), n.removeAttribute(f);
        } else f.startsWith(er) && (l.push({ type: 6, index: a }), n.removeAttribute(f));
        if (rv.test(n.tagName)) {
          const f = n.textContent.split(er), v = f.length - 1;
          if (v > 0) {
            n.textContent = Va ? Va.emptyScript : "";
            for (let c = 0; c < v; c++) n.append(f[c], Tn()), Or.nextNode(), l.push({ type: 2, index: ++a });
            n.append(f[v], Tn());
          }
        }
      } else if (n.nodeType === 8) if (n.data === ev) l.push({ type: 2, index: a });
      else {
        let f = -1;
        for (; (f = n.data.indexOf(er, f + 1)) !== -1; ) l.push({ type: 7, index: a }), f += er.length - 1;
      }
      a++;
    }
  }
  static createElement(t, r) {
    const i = Ur.createElement("template");
    return i.innerHTML = t, i;
  }
}
function Ti(e, t, r = e, i) {
  if (t === bi) return t;
  let n = i !== void 0 ? r._$Co?.[i] : r._$Cl;
  const a = xn(t) ? void 0 : t._$litDirective$;
  return n?.constructor !== a && (n?._$AO?.(!1), a === void 0 ? n = void 0 : (n = new a(e), n._$AT(e, r, i)), i !== void 0 ? (r._$Co ??= [])[i] = n : r._$Cl = n), n !== void 0 && (t = Ti(e, n._$AS(e, t.values), n, i)), t;
}
class bg {
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
    const { el: { content: r }, parts: i } = this._$AD, n = (t?.creationScope ?? Ur).importNode(r, !0);
    Or.currentNode = n;
    let a = Or.nextNode(), o = 0, s = 0, l = i[0];
    for (; l !== void 0; ) {
      if (o === l.index) {
        let u;
        l.type === 2 ? u = new zn(a, a.nextSibling, this, t) : l.type === 1 ? u = new l.ctor(a, l.name, l.strings, this, t) : l.type === 6 && (u = new Dg(a, this, t)), this._$AV.push(u), l = i[++s];
      }
      o !== l?.index && (a = Or.nextNode(), o++);
    }
    return Or.currentNode = Ur, n;
  }
  p(t) {
    let r = 0;
    for (const i of this._$AV) i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, r), r += i.strings.length - 2) : i._$AI(t[r])), r++;
  }
}
class zn {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, r, i, n) {
    this.type = 2, this._$AH = N, this._$AN = void 0, this._$AA = t, this._$AB = r, this._$AM = i, this.options = n, this._$Cv = n?.isConnected ?? !0;
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
    t = Ti(this, t, r), xn(t) ? t === N || t == null || t === "" ? (this._$AH !== N && this._$AR(), this._$AH = N) : t !== this._$AH && t !== bi && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : yg(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== N && xn(this._$AH) ? this._$AA.nextSibling.data = t : this.T(Ur.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: r, _$litType$: i } = t, n = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = Cn.createElement(iv(i.h, i.h[0]), this.options)), i);
    if (this._$AH?._$AD === n) this._$AH.p(r);
    else {
      const a = new bg(n, this), o = a.u(this.options);
      a.p(r), this.T(o), this._$AH = a;
    }
  }
  _$AC(t) {
    let r = Zu.get(t.strings);
    return r === void 0 && Zu.set(t.strings, r = new Cn(t)), r;
  }
  k(t) {
    Ul(this._$AH) || (this._$AH = [], this._$AR());
    const r = this._$AH;
    let i, n = 0;
    for (const a of t) n === r.length ? r.push(i = new zn(this.O(Tn()), this.O(Tn()), this, this.options)) : i = r[n], i._$AI(a), n++;
    n < r.length && (this._$AR(i && i._$AB.nextSibling, n), r.length = n);
  }
  _$AR(t = this._$AA.nextSibling, r) {
    for (this._$AP?.(!1, !0, r); t !== this._$AB; ) {
      const i = Uu(t).nextSibling;
      Uu(t).remove(), t = i;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class _o {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, r, i, n, a) {
    this.type = 1, this._$AH = N, this._$AN = void 0, this.element = t, this.name = r, this._$AM = n, this.options = a, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = N;
  }
  _$AI(t, r = this, i, n) {
    const a = this.strings;
    let o = !1;
    if (a === void 0) t = Ti(this, t, r, 0), o = !xn(t) || t !== this._$AH && t !== bi, o && (this._$AH = t);
    else {
      const s = t;
      let l, u;
      for (t = a[0], l = 0; l < a.length - 1; l++) u = Ti(this, s[i + l], r, l), u === bi && (u = this._$AH[l]), o ||= !xn(u) || u !== this._$AH[l], u === N ? t = N : t !== N && (t += (u ?? "") + a[l + 1]), this._$AH[l] = u;
    }
    o && !n && this.j(t);
  }
  j(t) {
    t === N ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Tg extends _o {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === N ? void 0 : t;
  }
}
class xg extends _o {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== N);
  }
}
class Cg extends _o {
  constructor(t, r, i, n, a) {
    super(t, r, i, n, a), this.type = 5;
  }
  _$AI(t, r = this) {
    if ((t = Ti(this, t, r, 0) ?? N) === bi) return;
    const i = this._$AH, n = t === N && i !== N || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, a = t !== N && (i === N || n);
    n && this.element.removeEventListener(this.name, this, i), a && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Dg {
  constructor(t, r, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = r, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Ti(this, t);
  }
}
const Mg = Vl.litHtmlPolyfillSupport;
Mg?.(Cn, zn), (Vl.litHtmlVersions ??= []).push("3.3.3");
const Ag = (e, t, r) => {
  const i = r?.renderBefore ?? t;
  let n = i._$litPart$;
  if (n === void 0) {
    const a = r?.renderBefore ?? null;
    i._$litPart$ = n = new zn(t.insertBefore(Tn(), a), a, void 0, r ?? {});
  }
  return n._$AI(e), n;
};
const Gl = globalThis;
class Fe extends ui {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const r = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ag(r, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return bi;
  }
}
Fe._$litElement$ = !0, Fe.finalized = !0, Gl.litElementHydrateSupport?.({ LitElement: Fe });
const Pg = Gl.litElementPolyfillSupport;
Pg?.({ LitElement: Fe });
(Gl.litElementVersions ??= []).push("4.2.2");
const Ai = (e) => (t, r) => {
  r !== void 0 ? r.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
const Lg = { attribute: !0, type: String, converter: Ha, reflect: !1, hasChanged: Hl }, Ig = (e = Lg, t, r) => {
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
function Wr(e) {
  return (t, r) => typeof r == "object" ? Ig(e, t, r) : ((i, n, a) => {
    const o = n.hasOwnProperty(a);
    return n.constructor.createProperty(a, i), o ? Object.getOwnPropertyDescriptor(n, a) : void 0;
  })(e, t, r);
}
function pt(e) {
  return Wr({ ...e, state: !0, attribute: !1 });
}
const Rg = "Ploc Cellar", kg = "Cellar storage", Eg = "Refresh", $g = "Loading…", Og = "Never", Bg = "Bottles in cellar", Ng = "Reconstructed stock", Fg = "Racks", zg = "Empty positions", Hg = "Data may be stale: the latest synchronization failed.", Vg = "Stock reconstruction is incomplete: only physical quantities are available.", Ug = "Last successful synchronization", Gg = "Search wines", Wg = "Search wines…", Yg = "No matching wines.", Xg = "Select a Ploc Cellar configuration in the card editor.", qg = "Rack selection", Zg = "occupied", Kg = "free", Qg = "Unknown wine", jg = "Empty position", Jg = "Row", t_ = "Column", e_ = "No row/column coordinates are available for this rack.", r_ = "Positions without coordinates", i_ = "Not mapped", n_ = "No racks available.", a_ = "position(s) reference a missing rack.", o_ = "Wine inventory", s_ = "All colors", l_ = "All regions", u_ = "All appellations", h_ = "All vintages", f_ = "Sort by", c_ = "Name", v_ = "Quantity descending", d_ = "Vintage descending", p_ = "{count} wine(s)", g_ = "{count} bottle(s)", __ = "Clear filters", m_ = "btl.", y_ = "Unknown vintage", w_ = "Wine details", S_ = "Grapes", b_ = "Cuvée", T_ = "Volume", x_ = "Locations", C_ = "Ploc Cellar", D_ = "Cellar overview and stock indicators.", M_ = "Wine inventory", A_ = "Search, filter and browse the wine inventory.", P_ = "Cellar racks", L_ = "Visualize rack positions and the wines stored in them.", I_ = "Ploc Cellar configuration", R_ = "Select the PLOUD connection used by this card.", k_ = "Card title", E_ = "Optional. Leave empty to use the default title.", $_ = "Cellar statistics", O_ = "Bottles in stock", B_ = "wine references", N_ = "By color", F_ = "By region", z_ = "By appellation", H_ = "By vintage", V_ = "By bottle format", U_ = "Other", G_ = "Not specified", W_ = "No data available for this category.", Y_ = "Unknown", X_ = "Wine references in stock", q_ = "Rack occupancy", Z_ = "Stock diagnostics", K_ = "Unlocated bottles", Q_ = "Negative movement balance", j_ = "Physical surplus", J_ = "Breakdowns include known wine references only.", tm = "{count} occupied position(s) have an unknown wine reference. They are included in total stock but not in the breakdowns.", em = "Show rack occupancy", rm = "Show diagnostics", im = "Show statistics", nm = "Show chart legends", am = "View details", om = "Wine references with stock that is not assigned to a physical rack position.", sm = "Wine references where recorded outgoing movements exceed incoming movements.", lm = "Wine references with more bottles physically stored than the reconstructed movement stock.", um = "Bottles concerned", hm = "In cellar", fm = "Reconstructed stock", cm = "Incoming", vm = "Outgoing", dm = "Movement balance", pm = "No wine-level details are available for this diagnostic.", gm = {
  card_title: Rg,
  rack_title: kg,
  refresh: Eg,
  loading: $g,
  never: Og,
  bottles_in_cellar: Bg,
  reconstructed_stock: Ng,
  racks: Fg,
  empty_positions: zg,
  stale: Hg,
  reconstruction_incomplete: Vg,
  last_sync: Ug,
  search_wine: Gg,
  search_placeholder: Wg,
  no_matching_wines: Yg,
  select_config: Xg,
  rack_selection: qg,
  occupied: Zg,
  free: Kg,
  unknown_wine: Qg,
  empty_position: jg,
  row: Jg,
  column: t_,
  no_coordinates: e_,
  positions_without_coordinates: r_,
  not_mapped: i_,
  no_racks: n_,
  missing_rack: a_,
  inventory_title: o_,
  filter_color: s_,
  filter_region: l_,
  filter_appellation: u_,
  filter_vintage: h_,
  sort_by: f_,
  sort_name: c_,
  sort_bottles: v_,
  sort_vintage: d_,
  inventory_results: p_,
  inventory_bottle_total: g_,
  clear_filters: __,
  bottles_short: m_,
  unknown_vintage: y_,
  wine_details: w_,
  grapes: S_,
  cuvee: b_,
  bottle_volume: T_,
  locations: x_,
  picker_overview_name: C_,
  picker_overview_description: D_,
  picker_inventory_name: M_,
  picker_inventory_description: A_,
  picker_rack_name: P_,
  picker_rack_description: L_,
  editor_configuration: I_,
  editor_configuration_helper: R_,
  editor_title: k_,
  editor_title_helper: E_,
  statistics_title: $_,
  statistics_bottles: O_,
  statistics_references: B_,
  statistics_color: N_,
  statistics_region: F_,
  statistics_appellation: z_,
  statistics_vintage: H_,
  statistics_format: V_,
  statistics_other: U_,
  statistics_unknown: G_,
  statistics_empty: W_,
  unknown_value: Y_,
  stocked_references: X_,
  rack_occupancy: q_,
  inventory_diagnostics: Z_,
  diagnostic_unlocated: K_,
  diagnostic_negative: Q_,
  diagnostic_surplus: j_,
  statistics_distribution_scope: J_,
  statistics_unknown_wine_positions: tm,
  editor_show_occupancy: em,
  editor_show_diagnostics: rm,
  editor_show_statistics: im,
  editor_show_statistics_legends: nm,
  diagnostic_detail_open: am,
  diagnostic_detail_unlocated: om,
  diagnostic_detail_negative: sm,
  diagnostic_detail_surplus: lm,
  diagnostic_detail_quantity: um,
  diagnostic_detail_in_cellar: hm,
  diagnostic_detail_stock: fm,
  diagnostic_detail_purchased: cm,
  diagnostic_detail_consumed: vm,
  diagnostic_detail_balance: dm,
  diagnostic_detail_empty: pm
}, _m = "Cave Ploc", mm = "Rangement de la cave", ym = "Actualiser", wm = "Chargement…", Sm = "Jamais", bm = "Bouteilles en cave", Tm = "Stock reconstitué", xm = "Casiers", Cm = "Places libres", Dm = "Données potentiellement obsolètes : la dernière synchronisation a échoué.", Mm = "Reconstitution du stock en cours : seules les quantités physiques sont disponibles.", Am = "Dernière synchronisation réussie", Pm = "Rechercher un vin", Lm = "Rechercher un vin…", Im = "Aucun vin correspondant.", Rm = "Sélectionnez une configuration Ploc Cellar dans l’éditeur de carte.", km = "Sélection du casier", Em = "occupées", $m = "libres", Om = "Vin inconnu", Bm = "Emplacement libre", Nm = "Rangée", Fm = "Colonne", zm = "Aucune coordonnée de rangée/colonne disponible pour ce casier.", Hm = "Emplacements sans coordonnées", Vm = "Non renseigné", Um = "Aucun casier disponible.", Gm = "emplacement(s) référencent un casier absent.", Wm = "Inventaire des vins", Ym = "Toutes les couleurs", Xm = "Toutes les régions", qm = "Toutes les appellations", Zm = "Tous les millésimes", Km = "Trier par", Qm = "Nom", jm = "Quantité décroissante", Jm = "Millésime décroissant", ty = "{count} référence(s)", ey = "{count} bouteille(s)", ry = "Effacer les filtres", iy = "bt.", ny = "Millésime inconnu", ay = "Détails du vin", oy = "Cépages", sy = "Cuvée", ly = "Volume", uy = "Emplacements", hy = "Cave Ploc", fy = "Vue d’ensemble de la cave et indicateurs de stock.", cy = "Inventaire des vins", vy = "Rechercher, filtrer et parcourir l’inventaire des vins.", dy = "Casiers de la cave", py = "Visualiser les emplacements des casiers et les vins qui y sont rangés.", gy = "Configuration Ploc Cellar", _y = "Sélectionnez la connexion PLOUD utilisée par cette carte.", my = "Titre de la carte", yy = "Facultatif. Laissez vide pour utiliser le titre par défaut.", wy = "Statistiques de la cave", Sy = "Bouteilles en stock", by = "références de vin", Ty = "Par couleur", xy = "Par région", Cy = "Par appellation", Dy = "Par millésime", My = "Par format de bouteille", Ay = "Autres", Py = "Non renseigné", Ly = "Aucune donnée disponible pour cette catégorie.", Iy = "Inconnu", Ry = "Références de vins en stock", ky = "Occupation des casiers", Ey = "Diagnostics du stock", $y = "Bouteilles non localisées", Oy = "Solde de mouvements négatif", By = "Excédent physique", Ny = "Les répartitions ne portent que sur les références de vins connues.", Fy = "{count} emplacement(s) occupé(s) font référence à un vin inconnu. Ils sont inclus dans le stock total, mais pas dans les répartitions.", zy = "Afficher l’occupation des casiers", Hy = "Afficher les diagnostics", Vy = "Afficher les statistiques", Uy = "Afficher les légendes des graphiques", Gy = "Voir le détail", Wy = "Références de vins dont une partie du stock n’est affectée à aucun emplacement physique de casier.", Yy = "Références de vins pour lesquelles les sorties enregistrées dépassent les entrées.", Xy = "Références de vins ayant davantage de bouteilles physiquement rangées que le stock reconstitué à partir des mouvements.", qy = "Bouteilles concernées", Zy = "En cave", Ky = "Stock reconstitué", Qy = "Entrées", jy = "Sorties", Jy = "Solde des mouvements", t0 = "Aucun détail par référence de vin n’est disponible pour ce diagnostic.", e0 = {
  card_title: _m,
  rack_title: mm,
  refresh: ym,
  loading: wm,
  never: Sm,
  bottles_in_cellar: bm,
  reconstructed_stock: Tm,
  racks: xm,
  empty_positions: Cm,
  stale: Dm,
  reconstruction_incomplete: Mm,
  last_sync: Am,
  search_wine: Pm,
  search_placeholder: Lm,
  no_matching_wines: Im,
  select_config: Rm,
  rack_selection: km,
  occupied: Em,
  free: $m,
  unknown_wine: Om,
  empty_position: Bm,
  row: Nm,
  column: Fm,
  no_coordinates: zm,
  positions_without_coordinates: Hm,
  not_mapped: Vm,
  no_racks: Um,
  missing_rack: Gm,
  inventory_title: Wm,
  filter_color: Ym,
  filter_region: Xm,
  filter_appellation: qm,
  filter_vintage: Zm,
  sort_by: Km,
  sort_name: Qm,
  sort_bottles: jm,
  sort_vintage: Jm,
  inventory_results: ty,
  inventory_bottle_total: ey,
  clear_filters: ry,
  bottles_short: iy,
  unknown_vintage: ny,
  wine_details: ay,
  grapes: oy,
  cuvee: sy,
  bottle_volume: ly,
  locations: uy,
  picker_overview_name: hy,
  picker_overview_description: fy,
  picker_inventory_name: cy,
  picker_inventory_description: vy,
  picker_rack_name: dy,
  picker_rack_description: py,
  editor_configuration: gy,
  editor_configuration_helper: _y,
  editor_title: my,
  editor_title_helper: yy,
  statistics_title: wy,
  statistics_bottles: Sy,
  statistics_references: by,
  statistics_color: Ty,
  statistics_region: xy,
  statistics_appellation: Cy,
  statistics_vintage: Dy,
  statistics_format: My,
  statistics_other: Ay,
  statistics_unknown: Py,
  statistics_empty: Ly,
  unknown_value: Iy,
  stocked_references: Ry,
  rack_occupancy: ky,
  inventory_diagnostics: Ey,
  diagnostic_unlocated: $y,
  diagnostic_negative: Oy,
  diagnostic_surplus: By,
  statistics_distribution_scope: Ny,
  statistics_unknown_wine_positions: Fy,
  editor_show_occupancy: zy,
  editor_show_diagnostics: Hy,
  editor_show_statistics: Vy,
  editor_show_statistics_legends: Uy,
  diagnostic_detail_open: Gy,
  diagnostic_detail_unlocated: Wy,
  diagnostic_detail_negative: Yy,
  diagnostic_detail_surplus: Xy,
  diagnostic_detail_quantity: qy,
  diagnostic_detail_in_cellar: Zy,
  diagnostic_detail_stock: Ky,
  diagnostic_detail_purchased: Qy,
  diagnostic_detail_consumed: jy,
  diagnostic_detail_balance: Jy,
  diagnostic_detail_empty: t0
};
function Xt(e, t) {
  return (e.toLocaleLowerCase().startsWith("fr") ? e0 : gm)[t];
}
function xi(e) {
  const t = typeof navigator > "u" ? "en" : navigator.language;
  return Xt(t, e);
}
var r0 = Object.defineProperty, i0 = Object.getOwnPropertyDescriptor, Yr = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? i0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && r0(t, r, n), n;
};
let He = class extends Fe {
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
    return t ? t.name : Xt(this.hass?.language ?? "en", "unknown_wine");
  }
  render() {
    const e = (l) => Xt(this.hass?.language ?? "en", l), t = this.inventory, r = t?.racks.find((l) => l.id === this.selectedRackId), i = this.rowValues, n = this.columnValues, a = this.positionedItems, o = this.selectedItems.filter((l) => l.row === null || l.column === null), s = (t?.rack_items ?? []).filter(
      (l) => !t?.racks.some((u) => u.id === l.rack_id)
    );
    return O`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("rack_title")}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>${this.loading ? "…" : e("refresh")}</button>
        </header>
        ${this.error ? O`<div class="error">${this.error}</div>` : N}
        ${this.config?.config_entry_id ? N : O`<div class="muted">${e("select_config")}</div>`}
        ${t?.stale ? O`<div class="warning">${e("stale")}</div>` : N}
        ${t?.racks.length ? O`
          <nav class="rack-picker" aria-label=${e("rack_selection")}>
            ${t.racks.map((l) => O`
              <button aria-pressed=${l.id === this.selectedRackId}
                @click=${() => {
      this.selectedRackId = l.id;
    }}>${l.name}</button>
            `)}
          </nav>
          <div class="legend">${r?.name ?? ""} · ${this.selectedItems.filter((l) => l.wine_id).length} ${e("occupied")} · ${this.selectedItems.filter((l) => !l.wine_id).length} ${e("free")}</div>
          ${i.length && n.length ? O`
            <div class="grid-wrap">
              <div class="rack-grid" style=${`grid-template-columns: repeat(${this.columnCount}, minmax(88px, 1fr)); grid-template-rows: repeat(${this.rowCount}, minmax(72px, auto));`}>
                ${a.map((l) => {
      const u = l.row - this.firstRow + 1, h = l.column - this.firstColumn + 1, f = !!l.wine_id;
      return O`
                    <div class=${f ? "slot occupied" : "slot"}
                      style=${`grid-row: ${u}; grid-column: ${h};`}
                      title=${this.wineLabel(l) || e("empty_position")}>
                      <strong>${f ? this.wineLabel(l) : "—"}</strong>
                      <small>${e("row")} ${l.row} · ${e("column")} ${l.column}</small>
                    </div>
                  `;
    })}
                ${this.missingCoordinates.map((l) => O`
                  <div class="slot missing"
                    style=${`grid-row: ${l.row - this.firstRow + 1}; grid-column: ${l.column - this.firstColumn + 1};`}>
                    <strong>—</strong>
                    <small>${e("not_mapped")}</small>
                  </div>
                `)}
              </div>
            </div>
          ` : O`<div class="warning">${e("no_coordinates")}</div>`}
          ${o.length ? O`
            <div class="unplaced">
              <strong>${e("positions_without_coordinates")}</strong>
              ${o.map((l) => O`<div class="unplaced-item">${this.wineLabel(l) || e("empty_position")}</div>`)}
            </div>
          ` : N}
        ` : O`<p class="muted">${e("no_racks")}</p>`}
        ${s.length ? O`
          <div class="warning">${s.length} ${e("missing_rack")}</div>
        ` : N}
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
He.styles = po`
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
Yr([
  Wr({ attribute: !1 })
], He.prototype, "hass", 2);
Yr([
  pt()
], He.prototype, "config", 2);
Yr([
  pt()
], He.prototype, "inventory", 2);
Yr([
  pt()
], He.prototype, "selectedRackId", 2);
Yr([
  pt()
], He.prototype, "loading", 2);
Yr([
  pt()
], He.prototype, "error", 2);
He = Yr([
  Ai("ploc-cellar-rack-card")
], He);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-rack-card",
  name: xi("picker_rack_name"),
  description: xi("picker_rack_description")
});
var n0 = Object.defineProperty, a0 = Object.getOwnPropertyDescriptor, se = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? a0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && n0(t, r, n), n;
};
let Ht = class extends Fe {
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
    return O`
      <select aria-label=${t} .value=${r}
        @change=${(n) => {
      const a = n.target.value;
      e === "color" ? this.color = a : e === "region" ? this.region = a : e === "appellation" ? this.appellation = a : this.vintage = a;
    }}>
        <option value="" ?selected=${!r}>${t}</option>
        ${i.map((n) => O`<option value=${n} ?selected=${n === r}>${n}</option>`)}
      </select>
    `;
  }
  detail(e, t) {
    return t == null || t === "" ? N : O`<div><span class="detail-label">${e}</span>${t}</div>`;
  }
  renderWine(e) {
    const t = (a) => Xt(this.hass?.language ?? "en", a), r = e.locations.map((a) => {
      const o = a.row !== null && a.column !== null ? ` · ${t("row")} ${a.row}, ${t("column")} ${a.column}` : "";
      return `${a.rack}${o}`;
    }), i = e.vintage === null ? t("unknown_vintage") : String(e.vintage), n = e.bottle_volume_l === null ? null : `${e.bottle_volume_l.toLocaleString(this.hass?.language ?? void 0)} L`;
    return O`
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
          ${e.color ? O`<span class="tag">${e.color}</span>` : N}
          <span class="tag">${i}</span>
          ${e.bottle_format ? O`<span class="tag">${e.bottle_format}</span>` : N}
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
    const e = (n) => Xt(this.hass?.language ?? "en", n), t = this.filteredWines, r = t.reduce((n, a) => n + a.bottles_in_cellar, 0), i = !!(this.search || this.color || this.region || this.appellation || this.vintage);
    return O`
      <ha-card>
        <header>
          <h2>${this.config?.title ?? e("inventory_title")}</h2>
          <div class="actions">
            <button ?disabled=${this.loading} @click=${() => this.refresh()}>
              ${this.loading ? e("loading") : e("refresh")}
            </button>
          </div>
        </header>
        ${this.error ? O`<div class="error">${this.error}</div>` : N}
        ${this.config?.config_entry_id ? N : O`<div class="muted">${e("select_config")}</div>`}
        ${this.inventory?.stale ? O`<div class="warning">${e("stale")}</div>` : N}
        ${this.inventory ? O`
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
            ${i ? O`<button @click=${() => this.clearFilters()}>${e("clear_filters")}</button>` : N}
          </div>
          ${this.inventory.stock_reconstruction_complete ? N : O`<div class="warning">${e("reconstruction_incomplete")}</div>`}
          <div class="wine-list">
            ${t.map((n) => this.renderWine(n))}
          </div>
          ${t.length === 0 ? O`<p class="muted">${e("no_matching_wines")}</p>` : N}
        ` : N}
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
Ht.styles = po`
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
se([
  Wr({ attribute: !1 })
], Ht.prototype, "hass", 2);
se([
  pt()
], Ht.prototype, "config", 2);
se([
  pt()
], Ht.prototype, "inventory", 2);
se([
  pt()
], Ht.prototype, "loading", 2);
se([
  pt()
], Ht.prototype, "error", 2);
se([
  pt()
], Ht.prototype, "search", 2);
se([
  pt()
], Ht.prototype, "color", 2);
se([
  pt()
], Ht.prototype, "region", 2);
se([
  pt()
], Ht.prototype, "appellation", 2);
se([
  pt()
], Ht.prototype, "vintage", 2);
se([
  pt()
], Ht.prototype, "sort", 2);
Ht = se([
  Ai("ploc-cellar-inventory-card")
], Ht);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-inventory-card",
  name: xi("picker_inventory_name"),
  description: xi("picker_inventory_description")
});
var o0 = Object.defineProperty, s0 = Object.getOwnPropertyDescriptor, Wl = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? s0(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && o0(t, r, n), n;
};
let Ua = class extends Fe {
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
      return Xt(this.hass?.language ?? "en", r);
    }, this.computeHelper = (e) => {
      if (e.name === "config_entry_id")
        return Xt(this.hass?.language ?? "en", "editor_configuration_helper");
      if (e.name === "title")
        return Xt(this.hass?.language ?? "en", "editor_title_helper");
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
    return O`
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
Wl([
  Wr({ attribute: !1 })
], Ua.prototype, "hass", 2);
Wl([
  pt()
], Ua.prototype, "config", 2);
Ua = Wl([
  Ai("ploc-cellar-card-editor")
], Ua);
var Xs = function(e, t) {
  return Xs = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(r, i) {
    r.__proto__ = i;
  } || function(r, i) {
    for (var n in i) Object.prototype.hasOwnProperty.call(i, n) && (r[n] = i[n]);
  }, Xs(e, t);
};
function G(e, t) {
  if (typeof t != "function" && t !== null)
    throw new TypeError("Class extends value " + String(t) + " is not a constructor or null");
  Xs(e, t);
  function r() {
    this.constructor = e;
  }
  e.prototype = t === null ? Object.create(t) : (r.prototype = t.prototype, new r());
}
var l0 = /* @__PURE__ */ (function() {
  function e() {
    this.firefox = !1, this.ie = !1, this.edge = !1, this.newEdge = !1, this.weChat = !1;
  }
  return e;
})(), u0 = /* @__PURE__ */ (function() {
  function e() {
    this.browser = new l0(), this.node = !1, this.wxa = !1, this.worker = !1, this.svgSupported = !1, this.touchEventsSupported = !1, this.pointerEventsSupported = !1, this.domSupported = !1, this.transformSupported = !1, this.transform3dSupported = !1, this.hasGlobalWindow = typeof window < "u";
  }
  return e;
})(), H = new u0();
typeof wx == "object" && typeof wx.getSystemInfoSync == "function" ? (H.wxa = !0, H.touchEventsSupported = !0) : typeof document > "u" && typeof self < "u" ? H.worker = !0 : !H.hasGlobalWindow || "Deno" in window ? (H.node = !0, H.svgSupported = !0) : h0(navigator.userAgent, H);
function h0(e, t) {
  var r = t.browser, i = e.match(/Firefox\/([\d.]+)/), n = e.match(/MSIE\s([\d.]+)/) || e.match(/Trident\/.+?rv:(([\d.]+))/), a = e.match(/Edge?\/([\d.]+)/), o = /micromessenger/i.test(e);
  i && (r.firefox = !0, r.version = i[1]), n && (r.ie = !0, r.version = n[1]), a && (r.edge = !0, r.version = a[1], r.newEdge = +a[1].split(".")[0] > 18), o && (r.weChat = !0), t.svgSupported = typeof SVGRect < "u", t.touchEventsSupported = "ontouchstart" in window && !r.ie && !r.edge, t.pointerEventsSupported = "onpointerdown" in window && (r.edge || r.ie && +r.version >= 11), t.domSupported = typeof document < "u";
  var s = document.documentElement.style;
  t.transform3dSupported = (r.ie && "transition" in s || r.edge || "WebKitCSSMatrix" in window && "m11" in new WebKitCSSMatrix() || "MozPerspective" in s) && !("OTransition" in s), t.transformSupported = t.transform3dSupported || r.ie && +r.version >= 9;
}
var Yl = 12, f0 = "sans-serif", Gr = Yl + "px " + f0, c0 = 20, v0 = 100, d0 = "007LLmW'55;N0500LLLLLLLLLL00NNNLzWW\\\\WQb\\0FWLg\\bWb\\WQ\\WrWWQ000CL5LLFLL0LL**F*gLLLL5F0LF\\FFF5.5N";
function p0(e) {
  var t = {};
  if (typeof JSON > "u")
    return t;
  for (var r = 0; r < e.length; r++) {
    var i = String.fromCharCode(r + 32), n = (e.charCodeAt(r) - c0) / v0;
    t[i] = n;
  }
  return t;
}
var g0 = p0(d0), Pi = {
  createCanvas: function() {
    return typeof document < "u" && document.createElement("canvas");
  },
  measureText: /* @__PURE__ */ (function() {
    var e, t;
    return function(r, i) {
      if (!e) {
        var n = Pi.createCanvas();
        e = n && n.getContext("2d");
      }
      if (e)
        return t !== i && (t = e.font = i || Gr), e.measureText(r);
      r = r || "", i = i || Gr;
      var a = /((?:\d+)?\.?\d*)px/.exec(i), o = a && +a[1] || Yl, s = 0;
      if (i.indexOf("mono") >= 0)
        s = o * r.length;
      else
        for (var l = 0; l < r.length; l++) {
          var u = g0[r[l]];
          s += u == null ? o : u * o;
        }
      return { width: s };
    };
  })(),
  loadImage: function(e, t, r) {
    var i = new Image();
    return i.onload = t, i.onerror = r, i.src = e, i;
  }
}, nv = ur([
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
}, {}), av = ur([
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
}, {}), Hn = Object.prototype.toString, mo = Array.prototype, _0 = mo.forEach, m0 = mo.filter, Xl = mo.slice, y0 = mo.map, Ku = function() {
}.constructor, qn = Ku ? Ku.prototype : null, ql = "__proto__", w0 = 2311;
function ov() {
  return w0++;
}
function Zl() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  typeof console < "u" && console.error.apply(console, e);
}
function j(e) {
  if (e == null || typeof e != "object")
    return e;
  var t = e, r = Hn.call(e);
  if (r === "[object Array]") {
    if (!fn(e)) {
      t = [];
      for (var i = 0, n = e.length; i < n; i++)
        t[i] = j(e[i]);
    }
  } else if (av[r]) {
    if (!fn(e)) {
      var a = e.constructor;
      if (a.from)
        t = a.from(e);
      else {
        t = new a(e.length);
        for (var i = 0, n = e.length; i < n; i++)
          t[i] = e[i];
      }
    }
  } else if (!nv[r] && !fn(e) && !Dn(e)) {
    t = {};
    for (var o in e)
      e.hasOwnProperty(o) && o !== ql && (t[o] = j(e[o]));
  }
  return t;
}
function _t(e, t, r) {
  if (!F(t) || !F(e))
    return r ? j(t) : e;
  for (var i in t)
    if (t.hasOwnProperty(i) && i !== ql) {
      var n = e[i], a = t[i];
      F(a) && F(n) && !$(a) && !$(n) && !Dn(a) && !Dn(n) && !Qu(a) && !Qu(n) && !fn(a) && !fn(n) ? _t(n, a, r) : (r || !(i in e)) && (e[i] = j(t[i]));
    }
  return e;
}
function R(e, t) {
  if (Object.assign)
    Object.assign(e, t);
  else
    for (var r in t)
      t.hasOwnProperty(r) && r !== ql && (e[r] = t[r]);
  return e;
}
function ut(e, t, r) {
  for (var i = dt(t), n = 0, a = i.length; n < a; n++) {
    var o = i[n];
    e[o] == null && (e[o] = t[o]);
  }
  return e;
}
function ot(e, t) {
  if (e) {
    if (e.indexOf)
      return e.indexOf(t);
    for (var r = 0, i = e.length; r < i; r++)
      if (e[r] === t)
        return r;
  }
  return -1;
}
function S0(e, t) {
  var r = e.prototype;
  function i() {
  }
  i.prototype = t.prototype, e.prototype = new i();
  for (var n in r)
    r.hasOwnProperty(n) && (e.prototype[n] = r[n]);
  e.prototype.constructor = e, e.superClass = t;
}
function Ge(e, t, r) {
  if (e = "prototype" in e ? e.prototype : e, t = "prototype" in t ? t.prototype : t, Object.getOwnPropertyNames)
    for (var i = Object.getOwnPropertyNames(t), n = 0; n < i.length; n++) {
      var a = i[n];
      a !== "constructor" && e[a] == null && (e[a] = t[a]);
    }
  else
    ut(e, t);
}
function Vt(e) {
  return !e || typeof e == "string" ? !1 : typeof e.length == "number";
}
function D(e, t, r) {
  if (e && t)
    if (e.forEach && e.forEach === _0)
      e.forEach(t, r);
    else if (e.length === +e.length)
      for (var i = 0, n = e.length; i < n; i++)
        t.call(r, e[i], i, e);
    else
      for (var a in e)
        e.hasOwnProperty(a) && t.call(r, e[a], a, e);
}
function J(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return Kl(e);
  if (e.map && e.map === y0)
    return e.map(t, r);
  for (var i = [], n = 0, a = e.length; n < a; n++)
    i.push(t.call(r, e[n], n, e));
  return i;
}
function ur(e, t, r, i) {
  if (e && t) {
    for (var n = 0, a = e.length; n < a; n++)
      r = t.call(i, r, e[n], n, e);
    return r;
  }
}
function ce(e, t, r) {
  if (!e)
    return [];
  if (!t)
    return Kl(e);
  if (e.filter && e.filter === m0)
    return e.filter(t, r);
  for (var i = [], n = 0, a = e.length; n < a; n++)
    t.call(r, e[n], n, e) && i.push(e[n]);
  return i;
}
function dt(e) {
  if (!e)
    return [];
  if (Object.keys)
    return Object.keys(e);
  var t = [];
  for (var r in e)
    e.hasOwnProperty(r) && t.push(r);
  return t;
}
function b0(e, t) {
  for (var r = [], i = 2; i < arguments.length; i++)
    r[i - 2] = arguments[i];
  return function() {
    return e.apply(t, r.concat(Xl.call(arguments)));
  };
}
var st = qn && rt(qn.bind) ? qn.call.bind(qn.bind) : b0;
function Zt(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return function() {
    return e.apply(this, t.concat(Xl.call(arguments)));
  };
}
function $(e) {
  return Array.isArray ? Array.isArray(e) : Hn.call(e) === "[object Array]";
}
function rt(e) {
  return typeof e == "function";
}
function V(e) {
  return typeof e == "string";
}
function qs(e) {
  return Hn.call(e) === "[object String]";
}
function mt(e) {
  return typeof e == "number";
}
function F(e) {
  var t = typeof e;
  return t === "function" || !!e && t === "object";
}
function Qu(e) {
  return !!nv[Hn.call(e)];
}
function Ut(e) {
  return !!av[Hn.call(e)];
}
function Dn(e) {
  return typeof e == "object" && typeof e.nodeType == "number" && typeof e.ownerDocument == "object";
}
function yo(e) {
  return e.colorStops != null;
}
function T0(e) {
  return e.image != null;
}
function x0(e) {
  return e !== e;
}
function Mn() {
  for (var e = [], t = 0; t < arguments.length; t++)
    e[t] = arguments[t];
  for (var r = 0, i = e.length; r < i; r++)
    if (e[r] != null)
      return e[r];
}
function K(e, t) {
  return e ?? t;
}
function hn(e, t, r) {
  return e ?? t ?? r;
}
function Kl(e) {
  for (var t = [], r = 1; r < arguments.length; r++)
    t[r - 1] = arguments[r];
  return Xl.apply(e, t);
}
function sv(e) {
  if (typeof e == "number")
    return [e, e, e, e];
  var t = e.length;
  return t === 2 ? [e[0], e[1], e[0], e[1]] : t === 3 ? [e[0], e[1], e[2], e[1]] : e;
}
function Ve(e, t) {
  if (!e)
    throw new Error(t);
}
function Ce(e) {
  return e == null ? null : typeof e.trim == "function" ? e.trim() : e.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
}
var lv = "__ec_primitive__";
function Zs(e) {
  e[lv] = !0;
}
function fn(e) {
  return e[lv];
}
var C0 = (function() {
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
    return dt(this.data);
  }, e.prototype.forEach = function(t) {
    var r = this.data;
    for (var i in r)
      r.hasOwnProperty(i) && t(r[i], i);
  }, e;
})(), uv = typeof Map == "function";
function D0() {
  return uv ? /* @__PURE__ */ new Map() : new C0();
}
var M0 = (function() {
  function e(t) {
    var r = $(t);
    this.data = D0();
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
    return uv ? Array.from(t) : t;
  }, e.prototype.removeKey = function(t) {
    this.data.delete(t);
  }, e;
})();
function tt(e) {
  return new M0(e);
}
function A0(e, t) {
  for (var r = new e.constructor(e.length + t.length), i = 0; i < e.length; i++)
    r[i] = e[i];
  for (var n = e.length, i = 0; i < t.length; i++)
    r[i + n] = t[i];
  return r;
}
function wo(e, t) {
  var r;
  if (Object.create)
    r = Object.create(e);
  else {
    var i = function() {
    };
    i.prototype = e, r = new i();
  }
  return t && R(r, t), r;
}
function hv(e) {
  var t = e.style;
  t.webkitUserSelect = "none", t.userSelect = "none", t.webkitTapHighlightColor = "rgba(0,0,0,0)", t["-webkit-touch-callout"] = "none";
}
function Ci(e, t) {
  return e.hasOwnProperty(t);
}
function zt() {
}
var P0 = 180 / Math.PI;
function Li(e, t) {
  return e == null && (e = 0), t == null && (t = 0), [e, t];
}
function L0(e) {
  return [e[0], e[1]];
}
function ju(e, t, r) {
  return e[0] = t[0] + r[0], e[1] = t[1] + r[1], e;
}
function I0(e, t, r) {
  return e[0] = t[0] - r[0], e[1] = t[1] - r[1], e;
}
function R0(e) {
  return Math.sqrt(k0(e));
}
function k0(e) {
  return e[0] * e[0] + e[1] * e[1];
}
function Oo(e, t, r) {
  return e[0] = t[0] * r, e[1] = t[1] * r, e;
}
function E0(e, t) {
  var r = R0(t);
  return r === 0 ? (e[0] = 0, e[1] = 0) : (e[0] = t[0] / r, e[1] = t[1] / r), e;
}
function Ks(e, t) {
  return Math.sqrt((e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]));
}
var Qs = Ks;
function $0(e, t) {
  return (e[0] - t[0]) * (e[0] - t[0]) + (e[1] - t[1]) * (e[1] - t[1]);
}
var gi = $0;
function Bo(e, t, r, i) {
  return e[0] = t[0] + i * (r[0] - t[0]), e[1] = t[1] + i * (r[1] - t[1]), e;
}
function Me(e, t, r) {
  var i = t[0], n = t[1];
  return e[0] = r[0] * i + r[2] * n + r[4], e[1] = r[1] * i + r[3] * n + r[5], e;
}
function ci(e, t, r) {
  return e[0] = Math.min(t[0], r[0]), e[1] = Math.min(t[1], r[1]), e;
}
function vi(e, t, r) {
  return e[0] = Math.max(t[0], r[0]), e[1] = Math.max(t[1], r[1]), e;
}
var Kr = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.target = t, this.topTarget = r && r.topTarget;
  }
  return e;
})(), O0 = (function() {
  function e(t) {
    this.handler = t, t.on("mousedown", this._dragStart, this), t.on("mousemove", this._drag, this), t.on("mouseup", this._dragEnd, this);
  }
  return e.prototype._dragStart = function(t) {
    for (var r = t.target; r && !r.draggable; )
      r = r.parent || r.__hostTarget;
    r && (this._draggingTarget = r, r.dragging = !0, this._x = t.offsetX, this._y = t.offsetY, this.handler.dispatchToElement(new Kr(r, t), "dragstart", t.event));
  }, e.prototype._drag = function(t) {
    var r = this._draggingTarget;
    if (r) {
      var i = t.offsetX, n = t.offsetY, a = i - this._x, o = n - this._y;
      this._x = i, this._y = n, r.drift(a, o, t), this.handler.dispatchToElement(new Kr(r, t), "drag", t.event);
      var s = this.handler.findHover(i, n, r).target, l = this._dropTarget;
      this._dropTarget = s, r !== s && (l && s !== l && this.handler.dispatchToElement(new Kr(l, t), "dragleave", t.event), s && s !== l && this.handler.dispatchToElement(new Kr(s, t), "dragenter", t.event));
    }
  }, e.prototype._dragEnd = function(t) {
    var r = this._draggingTarget;
    r && (r.dragging = !1), this.handler.dispatchToElement(new Kr(r, t), "dragend", t.event), this._dropTarget && this.handler.dispatchToElement(new Kr(this._dropTarget, t), "drop", t.event), this._draggingTarget = null, this._dropTarget = null;
  }, e;
})(), Ie = (function() {
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
})(), B0 = Math.log(2);
function js(e, t, r, i, n, a) {
  var o = i + "-" + n, s = e.length;
  if (a.hasOwnProperty(o))
    return a[o];
  if (t === 1) {
    var l = Math.round(Math.log((1 << s) - 1 & ~n) / B0);
    return e[r][l];
  }
  for (var u = i | 1 << r, h = r + 1; i & 1 << h; )
    h++;
  for (var f = 0, v = 0, c = 0; v < s; v++) {
    var d = 1 << v;
    d & n || (f += (c % 2 ? -1 : 1) * e[r][v] * js(e, t - 1, h, u, n | d, a), c++);
  }
  return a[o] = f, f;
}
function Ju(e, t) {
  var r = [
    [e[0], e[1], 1, 0, 0, 0, -t[0] * e[0], -t[0] * e[1]],
    [0, 0, 0, e[0], e[1], 1, -t[1] * e[0], -t[1] * e[1]],
    [e[2], e[3], 1, 0, 0, 0, -t[2] * e[2], -t[2] * e[3]],
    [0, 0, 0, e[2], e[3], 1, -t[3] * e[2], -t[3] * e[3]],
    [e[4], e[5], 1, 0, 0, 0, -t[4] * e[4], -t[4] * e[5]],
    [0, 0, 0, e[4], e[5], 1, -t[5] * e[4], -t[5] * e[5]],
    [e[6], e[7], 1, 0, 0, 0, -t[6] * e[6], -t[6] * e[7]],
    [0, 0, 0, e[6], e[7], 1, -t[7] * e[6], -t[7] * e[7]]
  ], i = {}, n = js(r, 8, 0, 0, 0, i);
  if (n !== 0) {
    for (var a = [], o = 0; o < 8; o++)
      for (var s = 0; s < 8; s++)
        a[s] == null && (a[s] = 0), a[s] += ((o + s) % 2 ? -1 : 1) * js(r, 7, o === 0 ? 1 : 0, 1 << o, 1 << s, i) / n * t[o];
    return function(l, u, h) {
      var f = u * a[6] + h * a[7] + 1;
      l[0] = (u * a[0] + h * a[1] + a[2]) / f, l[1] = (u * a[3] + h * a[4] + a[5]) / f;
    };
  }
}
var th = "___zrEVENTSAVED", No = [];
function N0(e, t, r, i, n) {
  return Js(No, t, i, n, !0) && Js(e, r, No[0], No[1]);
}
function Js(e, t, r, i, n) {
  if (t.getBoundingClientRect && H.domSupported && !fv(t)) {
    var a = t[th] || (t[th] = {}), o = F0(t, a), s = z0(o, a, n);
    if (s)
      return s(e, r, i), !0;
  }
  return !1;
}
function F0(e, t) {
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
function z0(e, t, r) {
  for (var i = r ? "invTrans" : "trans", n = t[i], a = t.srcCoords, o = [], s = [], l = !0, u = 0; u < 4; u++) {
    var h = e[u].getBoundingClientRect(), f = 2 * u, v = h.left, c = h.top;
    o.push(v, c), l = l && a && v === a[f] && c === a[f + 1], s.push(e[u].offsetLeft, e[u].offsetTop);
  }
  return l && n ? n : (t.srcCoords = o, t[i] = r ? Ju(s, o) : Ju(o, s));
}
function fv(e) {
  return e.nodeName.toUpperCase() === "CANVAS";
}
var H0 = /([&<>"'])/g, V0 = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
};
function Ot(e) {
  return e == null ? "" : (e + "").replace(H0, function(t, r) {
    return V0[r];
  });
}
var U0 = /^(?:mouse|pointer|contextmenu|drag|drop)|click/, Fo = [], G0 = H.browser.firefox && +H.browser.version.split(".")[0] < 39;
function tl(e, t, r, i) {
  return r = r || {}, i ? eh(e, t, r) : G0 && t.layerX != null && t.layerX !== t.offsetX ? (r.zrX = t.layerX, r.zrY = t.layerY) : t.offsetX != null ? (r.zrX = t.offsetX, r.zrY = t.offsetY) : eh(e, t, r), r;
}
function eh(e, t, r) {
  if (H.domSupported && e.getBoundingClientRect) {
    var i = t.clientX, n = t.clientY;
    if (fv(e)) {
      var a = e.getBoundingClientRect();
      r.zrX = i - a.left, r.zrY = n - a.top;
      return;
    } else if (Js(Fo, e, i, n)) {
      r.zrX = Fo[0], r.zrY = Fo[1];
      return;
    }
  }
  r.zrX = r.zrY = 0;
}
function Ql(e) {
  return e || window.event;
}
function ee(e, t, r) {
  if (t = Ql(t), t.zrX != null)
    return t;
  var i = t.type, n = i && i.indexOf("touch") >= 0;
  if (n) {
    var o = i !== "touchend" ? t.targetTouches[0] : t.changedTouches[0];
    o && tl(e, o, t, r);
  } else {
    tl(e, t, t, r);
    var a = W0(t);
    t.zrDelta = a ? a / 120 : -(t.detail || 0) / 3;
  }
  var s = t.button;
  return t.which == null && s !== void 0 && U0.test(t.type) && (t.which = s & 1 ? 1 : s & 2 ? 3 : s & 4 ? 2 : 0), t;
}
function W0(e) {
  var t = e.wheelDelta;
  if (t)
    return t;
  var r = e.deltaX, i = e.deltaY;
  if (r == null || i == null)
    return t;
  var n = Math.abs(i !== 0 ? i : r), a = i > 0 ? -1 : i < 0 ? 1 : r > 0 ? -1 : 1;
  return 3 * n * a;
}
function Y0(e, t, r, i) {
  e.addEventListener(t, r, i);
}
function X0(e, t, r, i) {
  e.removeEventListener(t, r, i);
}
var cv = function(e) {
  e.preventDefault(), e.stopPropagation(), e.cancelBubble = !0;
}, q0 = (function() {
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
        var l = n[o], u = tl(i, l, {});
        a.points.push([u.zrX, u.zrY]), a.touches.push(l);
      }
      this._track.push(a);
    }
  }, e.prototype._recognize = function(t) {
    for (var r in zo)
      if (zo.hasOwnProperty(r)) {
        var i = zo[r](this._track, t);
        if (i)
          return i;
      }
  }, e;
})();
function rh(e) {
  var t = e[1][0] - e[0][0], r = e[1][1] - e[0][1];
  return Math.sqrt(t * t + r * r);
}
function Z0(e) {
  return [
    (e[0][0] + e[1][0]) / 2,
    (e[0][1] + e[1][1]) / 2
  ];
}
var zo = {
  pinch: function(e, t) {
    var r = e.length;
    if (r) {
      var i = (e[r - 1] || {}).points, n = (e[r - 2] || {}).points || i;
      if (n && n.length > 1 && i && i.length > 1) {
        var a = rh(i) / rh(n);
        !isFinite(a) && (a = 1), t.pinchScale = a;
        var o = Z0(i);
        return t.pinchX = o[0], t.pinchY = o[1], {
          type: "pinch",
          target: e[0].target,
          event: t
        };
      }
    }
  }
};
function _i() {
  return [1, 0, 0, 1, 0, 0];
}
function jl(e) {
  return e[0] = 1, e[1] = 0, e[2] = 0, e[3] = 1, e[4] = 0, e[5] = 0, e;
}
function K0(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4], e[5] = t[5], e;
}
function mi(e, t, r) {
  var i = t[0] * r[0] + t[2] * r[1], n = t[1] * r[0] + t[3] * r[1], a = t[0] * r[2] + t[2] * r[3], o = t[1] * r[2] + t[3] * r[3], s = t[0] * r[4] + t[2] * r[5] + t[4], l = t[1] * r[4] + t[3] * r[5] + t[5];
  return e[0] = i, e[1] = n, e[2] = a, e[3] = o, e[4] = s, e[5] = l, e;
}
function el(e, t, r) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e[4] = t[4] + r[0], e[5] = t[5] + r[1], e;
}
function Jl(e, t, r, i) {
  i === void 0 && (i = [0, 0]);
  var n = t[0], a = t[2], o = t[4], s = t[1], l = t[3], u = t[5], h = Math.sin(r), f = Math.cos(r);
  return e[0] = n * f + s * h, e[1] = -n * h + s * f, e[2] = a * f + l * h, e[3] = -a * h + f * l, e[4] = f * (o - i[0]) + h * (u - i[1]) + i[0], e[5] = f * (u - i[1]) - h * (o - i[0]) + i[1], e;
}
function Q0(e, t, r) {
  var i = r[0], n = r[1];
  return e[0] = t[0] * i, e[1] = t[1] * n, e[2] = t[2] * i, e[3] = t[3] * n, e[4] = t[4] * i, e[5] = t[5] * n, e;
}
function vv(e, t) {
  var r = t[0], i = t[2], n = t[4], a = t[1], o = t[3], s = t[5], l = r * o - a * i;
  return l ? (l = 1 / l, e[0] = o * l, e[1] = -a * l, e[2] = -i * l, e[3] = r * l, e[4] = (i * s - o * n) * l, e[5] = (a * n - r * s) * l, e) : null;
}
var U = (function() {
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
})(), Zn = Math.min, Kn = Math.max, dr = new U(), pr = new U(), gr = new U(), _r = new U(), Bi = new U(), Ni = new U(), it = (function() {
  function e(t, r, i, n) {
    i < 0 && (t = t + i, i = -i), n < 0 && (r = r + n, n = -n), this.x = t, this.y = r, this.width = i, this.height = n;
  }
  return e.prototype.union = function(t) {
    var r = Zn(t.x, this.x), i = Zn(t.y, this.y);
    isFinite(this.x) && isFinite(this.width) ? this.width = Kn(t.x + t.width, this.x + this.width) - r : this.width = t.width, isFinite(this.y) && isFinite(this.height) ? this.height = Kn(t.y + t.height, this.y + this.height) - i : this.height = t.height, this.x = r, this.y = i;
  }, e.prototype.applyTransform = function(t) {
    e.applyTransform(this, this, t);
  }, e.prototype.calculateTransform = function(t) {
    var r = this, i = t.width / r.width, n = t.height / r.height, a = _i();
    return el(a, a, [-r.x, -r.y]), Q0(a, a, [i, n]), el(a, a, [t.x, t.y]), a;
  }, e.prototype.intersect = function(t, r) {
    if (!t)
      return !1;
    t instanceof e || (t = e.create(t));
    var i = this, n = i.x, a = i.x + i.width, o = i.y, s = i.y + i.height, l = t.x, u = t.x + t.width, h = t.y, f = t.y + t.height, v = !(a < l || u < n || s < h || f < o);
    if (r) {
      var c = 1 / 0, d = 0, _ = Math.abs(a - l), p = Math.abs(u - n), g = Math.abs(s - h), m = Math.abs(f - o), y = Math.min(_, p), w = Math.min(g, m);
      a < l || u < n ? y > d && (d = y, _ < p ? U.set(Ni, -_, 0) : U.set(Ni, p, 0)) : y < c && (c = y, _ < p ? U.set(Bi, _, 0) : U.set(Bi, -p, 0)), s < h || f < o ? w > d && (d = w, g < m ? U.set(Ni, 0, -g) : U.set(Ni, 0, m)) : y < c && (c = y, g < m ? U.set(Bi, 0, g) : U.set(Bi, 0, -m));
    }
    return r && U.copy(r, v ? Bi : Ni), v;
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
    dr.x = gr.x = r.x, dr.y = _r.y = r.y, pr.x = _r.x = r.x + r.width, pr.y = gr.y = r.y + r.height, dr.transform(i), _r.transform(i), pr.transform(i), gr.transform(i), t.x = Zn(dr.x, pr.x, gr.x, _r.x), t.y = Zn(dr.y, pr.y, gr.y, _r.y);
    var l = Kn(dr.x, pr.x, gr.x, _r.x), u = Kn(dr.y, pr.y, gr.y, _r.y);
    t.width = l - t.x, t.height = u - t.y;
  }, e;
})(), dv = "silent";
function j0(e, t, r) {
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
    stop: J0
  };
}
function J0() {
  cv(this.event);
}
var tw = (function(e) {
  G(t, e);
  function t() {
    var r = e !== null && e.apply(this, arguments) || this;
    return r.handler = null, r;
  }
  return t.prototype.dispose = function() {
  }, t.prototype.setCursor = function() {
  }, t;
})(Ie), Fi = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.x = t, this.y = r;
  }
  return e;
})(), ew = [
  "click",
  "dblclick",
  "mousewheel",
  "mouseout",
  "mouseup",
  "mousedown",
  "mousemove",
  "contextmenu"
], Ho = new it(0, 0, 0, 0), pv = (function(e) {
  G(t, e);
  function t(r, i, n, a, o) {
    var s = e.call(this) || this;
    return s._hovered = new Fi(0, 0), s.storage = r, s.painter = i, s.painterRoot = a, s._pointerSize = o, n = n || new tw(), s.proxy = null, s.setHandlerProxy(n), s._draggingMgr = new O0(s), s;
  }
  return t.prototype.setHandlerProxy = function(r) {
    this.proxy && this.proxy.dispose(), r && (D(ew, function(i) {
      r.on && r.on(i, this[i], this);
    }, this), r.handler = this), this.proxy = r;
  }, t.prototype.mousemove = function(r) {
    var i = r.zrX, n = r.zrY, a = gv(this, i, n), o = this._hovered, s = o.target;
    s && !s.__zr && (o = this.findHover(o.x, o.y), s = o.target);
    var l = this._hovered = a ? new Fi(i, n) : this.findHover(i, n), u = l.target, h = this.proxy;
    h.setCursor && h.setCursor(u ? u.cursor : "default"), s && u !== s && this.dispatchToElement(o, "mouseout", r), this.dispatchToElement(l, "mousemove", r), u && u !== s && this.dispatchToElement(l, "mouseover", r);
  }, t.prototype.mouseout = function(r) {
    var i = r.zrEventControl;
    i !== "only_globalout" && this.dispatchToElement(this._hovered, "mouseout", r), i !== "no_globalout" && this.trigger("globalout", { type: "globalout", event: r });
  }, t.prototype.resize = function() {
    this._hovered = new Fi(0, 0);
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
      for (var o = "on" + i, s = j0(i, r, n); a && (a[o] && (s.cancelBubble = !!a[o].call(a, s)), a.trigger(i, s), a = a.__hostTarget ? a.__hostTarget : a.parent, !s.cancelBubble); )
        ;
      s.cancelBubble || (this.trigger(i, s), this.painter && this.painter.eachOtherLayer && this.painter.eachOtherLayer(function(l) {
        typeof l[o] == "function" && l[o].call(l, s), l.trigger && l.trigger(i, s);
      }));
    }
  }, t.prototype.findHover = function(r, i, n) {
    var a = this.storage.getDisplayList(), o = new Fi(r, i);
    if (ih(a, o, r, i, n), this._pointerSize && !o.target) {
      for (var s = [], l = this._pointerSize, u = l / 2, h = new it(r - u, i - u, l, l), f = a.length - 1; f >= 0; f--) {
        var v = a[f];
        v !== n && !v.ignore && !v.ignoreCoarsePointer && (!v.parent || !v.parent.ignoreCoarsePointer) && (Ho.copy(v.getBoundingRect()), v.transform && Ho.applyTransform(v.transform), Ho.intersect(h) && s.push(v));
      }
      if (s.length)
        for (var c = 4, d = Math.PI / 12, _ = Math.PI * 2, p = 0; p < u; p += c)
          for (var g = 0; g < _; g += d) {
            var m = r + p * Math.cos(g), y = i + p * Math.sin(g);
            if (ih(s, o, m, y, n), o.target)
              return o;
          }
    }
    return o;
  }, t.prototype.processGesture = function(r, i) {
    this._gestureMgr || (this._gestureMgr = new q0());
    var n = this._gestureMgr;
    i === "start" && n.clear();
    var a = n.recognize(r, this.findHover(r.zrX, r.zrY, null).target, this.proxy.dom);
    if (i === "end" && n.clear(), a) {
      var o = a.type;
      r.gestureEvent = o;
      var s = new Fi();
      s.target = a.target, this.dispatchToElement(s, o, a.event);
    }
  }, t;
})(Ie);
D(["click", "mousedown", "mouseup", "mousewheel", "dblclick", "contextmenu"], function(e) {
  pv.prototype[e] = function(t) {
    var r = t.zrX, i = t.zrY, n = gv(this, r, i), a, o;
    if ((e !== "mouseup" || !n) && (a = this.findHover(r, i), o = a.target), e === "mousedown")
      this._downEl = o, this._downPoint = [t.zrX, t.zrY], this._upEl = o;
    else if (e === "mouseup")
      this._upEl = o;
    else if (e === "click") {
      if (this._downEl !== this._upEl || !this._downPoint || Qs(this._downPoint, [t.zrX, t.zrY]) > 4)
        return;
      this._downPoint = null;
    }
    this.dispatchToElement(a, e, t);
  };
});
function rw(e, t, r) {
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
    return n ? dv : !0;
  }
  return !1;
}
function ih(e, t, r, i, n) {
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a], s = void 0;
    if (o !== n && !o.ignore && (s = rw(o, r, i)) && (!t.topTarget && (t.topTarget = o), s !== dv)) {
      t.target = o;
      break;
    }
  }
}
function gv(e, t, r) {
  var i = e.painter;
  return t < 0 || t > i.getWidth() || r < 0 || r > i.getHeight();
}
var _v = 32, zi = 7;
function iw(e) {
  for (var t = 0; e >= _v; )
    t |= e & 1, e >>= 1;
  return e + t;
}
function nh(e, t, r, i) {
  var n = t + 1;
  if (n === r)
    return 1;
  if (i(e[n++], e[t]) < 0) {
    for (; n < r && i(e[n], e[n - 1]) < 0; )
      n++;
    nw(e, t, n);
  } else
    for (; n < r && i(e[n], e[n - 1]) >= 0; )
      n++;
  return n - t;
}
function nw(e, t, r) {
  for (r--; t < r; ) {
    var i = e[t];
    e[t++] = e[r], e[r--] = i;
  }
}
function ah(e, t, r, i, n) {
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
function Vo(e, t, r, i, n, a) {
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
function Uo(e, t, r, i, n, a) {
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
function aw(e, t) {
  var r = zi, i, n, a = 0, o = [];
  i = [], n = [];
  function s(c, d) {
    i[a] = c, n[a] = d, a += 1;
  }
  function l() {
    for (; a > 1; ) {
      var c = a - 2;
      if (c >= 1 && n[c - 1] <= n[c] + n[c + 1] || c >= 2 && n[c - 2] <= n[c] + n[c - 1])
        n[c - 1] < n[c + 1] && c--;
      else if (n[c] > n[c + 1])
        break;
      h(c);
    }
  }
  function u() {
    for (; a > 1; ) {
      var c = a - 2;
      c > 0 && n[c - 1] < n[c + 1] && c--, h(c);
    }
  }
  function h(c) {
    var d = i[c], _ = n[c], p = i[c + 1], g = n[c + 1];
    n[c] = _ + g, c === a - 3 && (i[c + 1] = i[c + 2], n[c + 1] = n[c + 2]), a--;
    var m = Uo(e[p], e, d, _, 0, t);
    d += m, _ -= m, _ !== 0 && (g = Vo(e[d + _ - 1], e, p, g, g - 1, t), g !== 0 && (_ <= g ? f(d, _, p, g) : v(d, _, p, g)));
  }
  function f(c, d, _, p) {
    var g = 0;
    for (g = 0; g < d; g++)
      o[g] = e[c + g];
    var m = 0, y = _, w = c;
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
    for (var b = r, S, T, x; ; ) {
      S = 0, T = 0, x = !1;
      do
        if (t(e[y], o[m]) < 0) {
          if (e[w++] = e[y++], T++, S = 0, --p === 0) {
            x = !0;
            break;
          }
        } else if (e[w++] = o[m++], S++, T = 0, --d === 1) {
          x = !0;
          break;
        }
      while ((S | T) < b);
      if (x)
        break;
      do {
        if (S = Uo(e[y], o, m, d, 0, t), S !== 0) {
          for (g = 0; g < S; g++)
            e[w + g] = o[m + g];
          if (w += S, m += S, d -= S, d <= 1) {
            x = !0;
            break;
          }
        }
        if (e[w++] = e[y++], --p === 0) {
          x = !0;
          break;
        }
        if (T = Vo(o[m], e, y, p, 0, t), T !== 0) {
          for (g = 0; g < T; g++)
            e[w + g] = e[y + g];
          if (w += T, y += T, p -= T, p === 0) {
            x = !0;
            break;
          }
        }
        if (e[w++] = o[m++], --d === 1) {
          x = !0;
          break;
        }
        b--;
      } while (S >= zi || T >= zi);
      if (x)
        break;
      b < 0 && (b = 0), b += 2;
    }
    if (r = b, r < 1 && (r = 1), d === 1) {
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
  function v(c, d, _, p) {
    var g = 0;
    for (g = 0; g < p; g++)
      o[g] = e[_ + g];
    var m = c + d - 1, y = p - 1, w = _ + p - 1, b = 0, S = 0;
    if (e[w--] = e[m--], --d === 0) {
      for (b = w - (p - 1), g = 0; g < p; g++)
        e[b + g] = o[g];
      return;
    }
    if (p === 1) {
      for (w -= d, m -= d, S = w + 1, b = m + 1, g = d - 1; g >= 0; g--)
        e[S + g] = e[b + g];
      e[w] = o[y];
      return;
    }
    for (var T = r; ; ) {
      var x = 0, C = 0, M = !1;
      do
        if (t(o[y], e[m]) < 0) {
          if (e[w--] = e[m--], x++, C = 0, --d === 0) {
            M = !0;
            break;
          }
        } else if (e[w--] = o[y--], C++, x = 0, --p === 1) {
          M = !0;
          break;
        }
      while ((x | C) < T);
      if (M)
        break;
      do {
        if (x = d - Uo(o[y], e, c, d, d - 1, t), x !== 0) {
          for (w -= x, m -= x, d -= x, S = w + 1, b = m + 1, g = x - 1; g >= 0; g--)
            e[S + g] = e[b + g];
          if (d === 0) {
            M = !0;
            break;
          }
        }
        if (e[w--] = o[y--], --p === 1) {
          M = !0;
          break;
        }
        if (C = p - Vo(e[m], o, 0, p, p - 1, t), C !== 0) {
          for (w -= C, y -= C, p -= C, S = w + 1, b = y + 1, g = 0; g < C; g++)
            e[S + g] = o[b + g];
          if (p <= 1) {
            M = !0;
            break;
          }
        }
        if (e[w--] = e[m--], --d === 0) {
          M = !0;
          break;
        }
        T--;
      } while (x >= zi || C >= zi);
      if (M)
        break;
      T < 0 && (T = 0), T += 2;
    }
    if (r = T, r < 1 && (r = 1), p === 1) {
      for (w -= d, m -= d, S = w + 1, b = m + 1, g = d - 1; g >= 0; g--)
        e[S + g] = e[b + g];
      e[w] = o[y];
    } else {
      if (p === 0)
        throw new Error();
      for (b = w - (p - 1), g = 0; g < p; g++)
        e[b + g] = o[g];
    }
  }
  return {
    mergeRuns: l,
    forceMergeRuns: u,
    pushRun: s
  };
}
function Ma(e, t, r, i) {
  r || (r = 0), i || (i = e.length);
  var n = i - r;
  if (!(n < 2)) {
    var a = 0;
    if (n < _v) {
      a = nh(e, r, i, t), ah(e, r, i, r + a, t);
      return;
    }
    var o = aw(e, t), s = iw(n);
    do {
      if (a = nh(e, r, i, t), a < s) {
        var l = n;
        l > s && (l = s), ah(e, r, r + l, r + a, t), a = l;
      }
      o.pushRun(r, a), o.mergeRuns(), n -= a, r += a;
    } while (n !== 0);
    o.forceMergeRuns();
  }
}
var qt = 1, rn = 2, hi = 4, oh = !1;
function Go() {
  oh || (oh = !0, console.warn("z / z2 / zlevel of displayable is invalid, which may cause unexpected errors"));
}
function sh(e, t) {
  return e.zlevel === t.zlevel ? e.z === t.z ? e.z2 - t.z2 : e.z - t.z : e.zlevel - t.zlevel;
}
var ow = (function() {
  function e() {
    this._roots = [], this._displayList = [], this._displayListLen = 0, this.displayableSortFunc = sh;
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
    i.length = this._displayListLen, Ma(i, sh);
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
          t.__dirty && (u.__dirty |= qt), this._updateAndAddDisplayable(u, r, i);
        }
        t.__dirty = 0;
      } else {
        var h = t;
        r && r.length ? h.__clipPaths = r : h.__clipPaths && h.__clipPaths.length > 0 && (h.__clipPaths = []), isNaN(h.z) && (Go(), h.z = 0), isNaN(h.z2) && (Go(), h.z2 = 0), isNaN(h.zlevel) && (Go(), h.zlevel = 0), this._displayList[this._displayListLen++] = h;
      }
      var f = t.getDecalElement && t.getDecalElement();
      f && this._updateAndAddDisplayable(f, r, i);
      var v = t.getTextGuideLine();
      v && this._updateAndAddDisplayable(v, r, i);
      var c = t.getTextContent();
      c && this._updateAndAddDisplayable(c, r, i);
    }
  }, e.prototype.addRoot = function(t) {
    t.__zr && t.__zr.storage === this || this._roots.push(t);
  }, e.prototype.delRoot = function(t) {
    if (t instanceof Array) {
      for (var r = 0, i = t.length; r < i; r++)
        this.delRoot(t[r]);
      return;
    }
    var n = ot(this._roots, t);
    n >= 0 && this._roots.splice(n, 1);
  }, e.prototype.delAllRoots = function() {
    this._roots = [], this._displayList = [], this._displayListLen = 0;
  }, e.prototype.getRoots = function() {
    return this._roots;
  }, e.prototype.dispose = function() {
    this._displayList = null, this._roots = null;
  }, e;
})(), Ga;
Ga = H.hasGlobalWindow && (window.requestAnimationFrame && window.requestAnimationFrame.bind(window) || window.msRequestAnimationFrame && window.msRequestAnimationFrame.bind(window) || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame) || function(e) {
  return setTimeout(e, 16);
};
var cn = {
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
    return 1 - cn.bounceOut(1 - e);
  },
  bounceOut: function(e) {
    return e < 1 / 2.75 ? 7.5625 * e * e : e < 2 / 2.75 ? 7.5625 * (e -= 1.5 / 2.75) * e + 0.75 : e < 2.5 / 2.75 ? 7.5625 * (e -= 2.25 / 2.75) * e + 0.9375 : 7.5625 * (e -= 2.625 / 2.75) * e + 0.984375;
  },
  bounceInOut: function(e) {
    return e < 0.5 ? cn.bounceIn(e * 2) * 0.5 : cn.bounceOut(e * 2 - 1) * 0.5 + 0.5;
  }
}, Qn = Math.pow, or = Math.sqrt, Wa = 1e-8, mv = 1e-4, lh = or(3), jn = 1 / 3, Te = Li(), ne = Li(), yi = Li();
function rr(e) {
  return e > -Wa && e < Wa;
}
function yv(e) {
  return e > Wa || e < -Wa;
}
function Rt(e, t, r, i, n) {
  var a = 1 - n;
  return a * a * (a * e + 3 * n * t) + n * n * (n * i + 3 * a * r);
}
function uh(e, t, r, i, n) {
  var a = 1 - n;
  return 3 * (((t - e) * a + 2 * (r - t) * n) * a + (i - r) * n * n);
}
function wv(e, t, r, i, n, a) {
  var o = i + 3 * (t - r) - e, s = 3 * (r - t * 2 + e), l = 3 * (t - e), u = e - n, h = s * s - 3 * o * l, f = s * l - 9 * o * u, v = l * l - 3 * s * u, c = 0;
  if (rr(h) && rr(f))
    if (rr(s))
      a[0] = 0;
    else {
      var d = -l / s;
      d >= 0 && d <= 1 && (a[c++] = d);
    }
  else {
    var _ = f * f - 4 * h * v;
    if (rr(_)) {
      var p = f / h, d = -s / o + p, g = -p / 2;
      d >= 0 && d <= 1 && (a[c++] = d), g >= 0 && g <= 1 && (a[c++] = g);
    } else if (_ > 0) {
      var m = or(_), y = h * s + 1.5 * o * (-f + m), w = h * s + 1.5 * o * (-f - m);
      y < 0 ? y = -Qn(-y, jn) : y = Qn(y, jn), w < 0 ? w = -Qn(-w, jn) : w = Qn(w, jn);
      var d = (-s - (y + w)) / (3 * o);
      d >= 0 && d <= 1 && (a[c++] = d);
    } else {
      var b = (2 * h * s - 3 * o * f) / (2 * or(h * h * h)), S = Math.acos(b) / 3, T = or(h), x = Math.cos(S), d = (-s - 2 * T * x) / (3 * o), g = (-s + T * (x + lh * Math.sin(S))) / (3 * o), C = (-s + T * (x - lh * Math.sin(S))) / (3 * o);
      d >= 0 && d <= 1 && (a[c++] = d), g >= 0 && g <= 1 && (a[c++] = g), C >= 0 && C <= 1 && (a[c++] = C);
    }
  }
  return c;
}
function Sv(e, t, r, i, n) {
  var a = 6 * r - 12 * t + 6 * e, o = 9 * t + 3 * i - 3 * e - 9 * r, s = 3 * t - 3 * e, l = 0;
  if (rr(o)) {
    if (yv(a)) {
      var u = -s / a;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = a * a - 4 * o * s;
    if (rr(h))
      n[0] = -a / (2 * o);
    else if (h > 0) {
      var f = or(h), u = (-a + f) / (2 * o), v = (-a - f) / (2 * o);
      u >= 0 && u <= 1 && (n[l++] = u), v >= 0 && v <= 1 && (n[l++] = v);
    }
  }
  return l;
}
function Ya(e, t, r, i, n, a) {
  var o = (t - e) * n + e, s = (r - t) * n + t, l = (i - r) * n + r, u = (s - o) * n + o, h = (l - s) * n + s, f = (h - u) * n + u;
  a[0] = e, a[1] = o, a[2] = u, a[3] = f, a[4] = f, a[5] = h, a[6] = l, a[7] = i;
}
function sw(e, t, r, i, n, a, o, s, l, u, h) {
  var f, v = 5e-3, c = 1 / 0, d, _, p, g;
  Te[0] = l, Te[1] = u;
  for (var m = 0; m < 1; m += 0.05)
    ne[0] = Rt(e, r, n, o, m), ne[1] = Rt(t, i, a, s, m), p = gi(Te, ne), p < c && (f = m, c = p);
  c = 1 / 0;
  for (var y = 0; y < 32 && !(v < mv); y++)
    d = f - v, _ = f + v, ne[0] = Rt(e, r, n, o, d), ne[1] = Rt(t, i, a, s, d), p = gi(ne, Te), d >= 0 && p < c ? (f = d, c = p) : (yi[0] = Rt(e, r, n, o, _), yi[1] = Rt(t, i, a, s, _), g = gi(yi, Te), _ <= 1 && g < c ? (f = _, c = g) : v *= 0.5);
  return or(c);
}
function lw(e, t, r, i, n, a, o, s, l) {
  for (var u = e, h = t, f = 0, v = 1 / l, c = 1; c <= l; c++) {
    var d = c * v, _ = Rt(e, r, n, o, d), p = Rt(t, i, a, s, d), g = _ - u, m = p - h;
    f += Math.sqrt(g * g + m * m), u = _, h = p;
  }
  return f;
}
function Bt(e, t, r, i) {
  var n = 1 - i;
  return n * (n * e + 2 * i * t) + i * i * r;
}
function hh(e, t, r, i) {
  return 2 * ((1 - i) * (t - e) + i * (r - t));
}
function uw(e, t, r, i, n) {
  var a = e - 2 * t + r, o = 2 * (t - e), s = e - i, l = 0;
  if (rr(a)) {
    if (yv(o)) {
      var u = -s / o;
      u >= 0 && u <= 1 && (n[l++] = u);
    }
  } else {
    var h = o * o - 4 * a * s;
    if (rr(h)) {
      var u = -o / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u);
    } else if (h > 0) {
      var f = or(h), u = (-o + f) / (2 * a), v = (-o - f) / (2 * a);
      u >= 0 && u <= 1 && (n[l++] = u), v >= 0 && v <= 1 && (n[l++] = v);
    }
  }
  return l;
}
function bv(e, t, r) {
  var i = e + r - 2 * t;
  return i === 0 ? 0.5 : (e - t) / i;
}
function Xa(e, t, r, i, n) {
  var a = (t - e) * i + e, o = (r - t) * i + t, s = (o - a) * i + a;
  n[0] = e, n[1] = a, n[2] = s, n[3] = s, n[4] = o, n[5] = r;
}
function hw(e, t, r, i, n, a, o, s, l) {
  var u, h = 5e-3, f = 1 / 0;
  Te[0] = o, Te[1] = s;
  for (var v = 0; v < 1; v += 0.05) {
    ne[0] = Bt(e, r, n, v), ne[1] = Bt(t, i, a, v);
    var c = gi(Te, ne);
    c < f && (u = v, f = c);
  }
  f = 1 / 0;
  for (var d = 0; d < 32 && !(h < mv); d++) {
    var _ = u - h, p = u + h;
    ne[0] = Bt(e, r, n, _), ne[1] = Bt(t, i, a, _);
    var c = gi(ne, Te);
    if (_ >= 0 && c < f)
      u = _, f = c;
    else {
      yi[0] = Bt(e, r, n, p), yi[1] = Bt(t, i, a, p);
      var g = gi(yi, Te);
      p <= 1 && g < f ? (u = p, f = g) : h *= 0.5;
    }
  }
  return or(f);
}
function fw(e, t, r, i, n, a, o) {
  for (var s = e, l = t, u = 0, h = 1 / o, f = 1; f <= o; f++) {
    var v = f * h, c = Bt(e, r, n, v), d = Bt(t, i, a, v), _ = c - s, p = d - l;
    u += Math.sqrt(_ * _ + p * p), s = c, l = d;
  }
  return u;
}
var cw = /cubic-bezier\(([0-9,\.e ]+)\)/;
function Tv(e) {
  var t = e && cw.exec(e);
  if (t) {
    var r = t[1].split(","), i = +Ce(r[0]), n = +Ce(r[1]), a = +Ce(r[2]), o = +Ce(r[3]);
    if (isNaN(i + n + a + o))
      return;
    var s = [];
    return function(l) {
      return l <= 0 ? 0 : l >= 1 ? 1 : wv(0, i, a, 1, l, s) && Rt(0, n, o, 1, s[0]);
    };
  }
}
var vw = (function() {
  function e(t) {
    this._inited = !1, this._startTime = 0, this._pausedTime = 0, this._paused = !1, this._life = t.life || 1e3, this._delay = t.delay || 0, this.loop = t.loop || !1, this.onframe = t.onframe || zt, this.ondestroy = t.ondestroy || zt, this.onrestart = t.onrestart || zt, t.easing && this.setEasing(t.easing);
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
    this.easing = t, this.easingFunc = rt(t) ? t : cn[t] || Tv(t);
  }, e;
})(), xv = /* @__PURE__ */ (function() {
  function e(t) {
    this.value = t;
  }
  return e;
})(), dw = (function() {
  function e() {
    this._len = 0;
  }
  return e.prototype.insert = function(t) {
    var r = new xv(t);
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
})(), Vn = (function() {
  function e(t) {
    this._list = new dw(), this._maxSize = 10, this._map = {}, this._maxSize = t;
  }
  return e.prototype.put = function(t, r) {
    var i = this._list, n = this._map, a = null;
    if (n[t] == null) {
      var o = i.len(), s = this._lastRemovedEntry;
      if (o >= this._maxSize && o > 0) {
        var l = i.head;
        i.remove(l), delete n[l.key], a = l.value, this._lastRemovedEntry = l;
      }
      s ? s.value = r : s = new xv(r), s.key = t, i.insertEntry(s), n[t] = s;
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
})(), fh = {
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
function vn(e) {
  return e = Math.round(e), e < 0 ? 0 : e > 255 ? 255 : e;
}
function ch(e) {
  return e < 0 ? 0 : e > 1 ? 1 : e;
}
function Wo(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? vn(parseFloat(t) / 100 * 255) : vn(parseInt(t, 10));
}
function dn(e) {
  var t = e;
  return t.length && t.charAt(t.length - 1) === "%" ? ch(parseFloat(t) / 100) : ch(parseFloat(t));
}
function Yo(e, t, r) {
  return r < 0 ? r += 1 : r > 1 && (r -= 1), r * 6 < 1 ? e + (t - e) * r * 6 : r * 2 < 1 ? t : r * 3 < 2 ? e + (t - e) * (2 / 3 - r) * 6 : e;
}
function te(e, t, r, i, n) {
  return e[0] = t, e[1] = r, e[2] = i, e[3] = n, e;
}
function rl(e, t) {
  return e[0] = t[0], e[1] = t[1], e[2] = t[2], e[3] = t[3], e;
}
var Cv = new Vn(20), Jn = null;
function Qr(e, t) {
  Jn && rl(Jn, t), Jn = Cv.put(e, Jn || t.slice());
}
function wi(e, t) {
  if (e) {
    t = t || [];
    var r = Cv.get(e);
    if (r)
      return rl(t, r);
    e = e + "";
    var i = e.replace(/ /g, "").toLowerCase();
    if (i in fh)
      return rl(t, fh[i]), Qr(e, t), t;
    var n = i.length;
    if (i.charAt(0) === "#") {
      if (n === 4 || n === 5) {
        var a = parseInt(i.slice(1, 4), 16);
        if (!(a >= 0 && a <= 4095)) {
          te(t, 0, 0, 0, 1);
          return;
        }
        return te(t, (a & 3840) >> 4 | (a & 3840) >> 8, a & 240 | (a & 240) >> 4, a & 15 | (a & 15) << 4, n === 5 ? parseInt(i.slice(4), 16) / 15 : 1), Qr(e, t), t;
      } else if (n === 7 || n === 9) {
        var a = parseInt(i.slice(1, 7), 16);
        if (!(a >= 0 && a <= 16777215)) {
          te(t, 0, 0, 0, 1);
          return;
        }
        return te(t, (a & 16711680) >> 16, (a & 65280) >> 8, a & 255, n === 9 ? parseInt(i.slice(7), 16) / 255 : 1), Qr(e, t), t;
      }
      return;
    }
    var o = i.indexOf("("), s = i.indexOf(")");
    if (o !== -1 && s + 1 === n) {
      var l = i.substr(0, o), u = i.substr(o + 1, s - (o + 1)).split(","), h = 1;
      switch (l) {
        case "rgba":
          if (u.length !== 4)
            return u.length === 3 ? te(t, +u[0], +u[1], +u[2], 1) : te(t, 0, 0, 0, 1);
          h = dn(u.pop());
        case "rgb":
          if (u.length >= 3)
            return te(t, Wo(u[0]), Wo(u[1]), Wo(u[2]), u.length === 3 ? h : dn(u[3])), Qr(e, t), t;
          te(t, 0, 0, 0, 1);
          return;
        case "hsla":
          if (u.length !== 4) {
            te(t, 0, 0, 0, 1);
            return;
          }
          return u[3] = dn(u[3]), vh(u, t), Qr(e, t), t;
        case "hsl":
          if (u.length !== 3) {
            te(t, 0, 0, 0, 1);
            return;
          }
          return vh(u, t), Qr(e, t), t;
        default:
          return;
      }
    }
    te(t, 0, 0, 0, 1);
  }
}
function vh(e, t) {
  var r = (parseFloat(e[0]) % 360 + 360) % 360 / 360, i = dn(e[1]), n = dn(e[2]), a = n <= 0.5 ? n * (i + 1) : n + i - n * i, o = n * 2 - a;
  return t = t || [], te(t, vn(Yo(o, a, r + 1 / 3) * 255), vn(Yo(o, a, r) * 255), vn(Yo(o, a, r - 1 / 3) * 255), 1), e.length === 4 && (t[3] = e[3]), t;
}
function dh(e, t) {
  var r = wi(e);
  if (r) {
    for (var i = 0; i < 3; i++)
      r[i] = r[i] * (1 - t) | 0, r[i] > 255 ? r[i] = 255 : r[i] < 0 && (r[i] = 0);
    return Dv(r, r.length === 4 ? "rgba" : "rgb");
  }
}
function Dv(e, t) {
  if (!(!e || !e.length)) {
    var r = e[0] + "," + e[1] + "," + e[2];
    return (t === "rgba" || t === "hsva" || t === "hsla") && (r += "," + e[3]), t + "(" + r + ")";
  }
}
function qa(e, t) {
  var r = wi(e);
  return r ? (0.299 * r[0] + 0.587 * r[1] + 0.114 * r[2]) * r[3] / 255 + (1 - r[3]) * t : 0;
}
var ph = new Vn(100);
function gh(e) {
  if (V(e)) {
    var t = ph.get(e);
    return t || (t = dh(e, -0.1), ph.put(e, t)), t;
  } else if (yo(e)) {
    var r = R({}, e);
    return r.colorStops = J(e.colorStops, function(i) {
      return {
        offset: i.offset,
        color: dh(i.color, -0.1)
      };
    }), r;
  }
  return e;
}
function pw(e) {
  return e.type === "linear";
}
function gw(e) {
  return e.type === "radial";
}
(function() {
  return H.hasGlobalWindow && rt(window.btoa) ? function(e) {
    return window.btoa(unescape(encodeURIComponent(e)));
  } : typeof Buffer < "u" ? function(e) {
    return Buffer.from(e).toString("base64");
  } : function(e) {
    return null;
  };
})();
var il = Array.prototype.slice;
function Be(e, t, r) {
  return (t - e) * r + e;
}
function Xo(e, t, r, i) {
  for (var n = t.length, a = 0; a < n; a++)
    e[a] = Be(t[a], r[a], i);
  return e;
}
function _w(e, t, r, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = Be(t[o][s], r[o][s], i);
  }
  return e;
}
function ta(e, t, r, i) {
  for (var n = t.length, a = 0; a < n; a++)
    e[a] = t[a] + r[a] * i;
  return e;
}
function _h(e, t, r, i) {
  for (var n = t.length, a = n && t[0].length, o = 0; o < n; o++) {
    e[o] || (e[o] = []);
    for (var s = 0; s < a; s++)
      e[o][s] = t[o][s] + r[o][s] * i;
  }
  return e;
}
function mw(e, t) {
  for (var r = e.length, i = t.length, n = r > i ? t : e, a = Math.min(r, i), o = n[a - 1] || { color: [0, 0, 0, 0], offset: 0 }, s = a; s < Math.max(r, i); s++)
    n.push({
      offset: o.offset,
      color: o.color.slice()
    });
}
function yw(e, t, r) {
  var i = e, n = t;
  if (!(!i.push || !n.push)) {
    var a = i.length, o = n.length;
    if (a !== o) {
      var s = a > o;
      if (s)
        i.length = o;
      else
        for (var l = a; l < o; l++)
          i.push(r === 1 ? n[l] : il.call(n[l]));
    }
    for (var u = i[0] && i[0].length, l = 0; l < i.length; l++)
      if (r === 1)
        isNaN(i[l]) && (i[l] = n[l]);
      else
        for (var h = 0; h < u; h++)
          isNaN(i[l][h]) && (i[l][h] = n[l][h]);
  }
}
function Aa(e) {
  if (Vt(e)) {
    var t = e.length;
    if (Vt(e[0])) {
      for (var r = [], i = 0; i < t; i++)
        r.push(il.call(e[i]));
      return r;
    }
    return il.call(e);
  }
  return e;
}
function Pa(e) {
  return e[0] = Math.floor(e[0]) || 0, e[1] = Math.floor(e[1]) || 0, e[2] = Math.floor(e[2]) || 0, e[3] = e[3] == null ? 1 : e[3], "rgba(" + e.join(",") + ")";
}
function ww(e) {
  return Vt(e && e[0]) ? 2 : 1;
}
var ea = 0, La = 1, Mv = 2, nn = 3, nl = 4, al = 5, mh = 6;
function yh(e) {
  return e === nl || e === al;
}
function ra(e) {
  return e === La || e === Mv;
}
var Hi = [0, 0, 0, 0], Sw = (function() {
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
    var n = this.keyframes, a = n.length, o = !1, s = mh, l = r;
    if (Vt(r)) {
      var u = ww(r);
      s = u, (u === 1 && !mt(r[0]) || u === 2 && !mt(r[0][0])) && (o = !0);
    } else if (mt(r) && !x0(r))
      s = ea;
    else if (V(r))
      if (!isNaN(+r))
        s = ea;
      else {
        var h = wi(r);
        h && (l = h, s = nn);
      }
    else if (yo(r)) {
      var f = R({}, l);
      f.colorStops = J(r.colorStops, function(c) {
        return {
          offset: c.offset,
          color: wi(c.color)
        };
      }), pw(r) ? s = nl : gw(r) && (s = al), l = f;
    }
    a === 0 ? this.valType = s : (s !== this.valType || s === mh) && (o = !0), this.discrete = this.discrete || o;
    var v = {
      time: t,
      value: l,
      rawValue: r,
      percent: 0
    };
    return i && (v.easing = i, v.easingFunc = rt(i) ? i : cn[i] || Tv(i)), n.push(v), v;
  }, e.prototype.prepare = function(t, r) {
    var i = this.keyframes;
    this._needsSort && i.sort(function(_, p) {
      return _.time - p.time;
    });
    for (var n = this.valType, a = i.length, o = i[a - 1], s = this.discrete, l = ra(n), u = yh(n), h = 0; h < a; h++) {
      var f = i[h], v = f.value, c = o.value;
      f.percent = f.time / t, s || (l && h !== a - 1 ? yw(v, c, n) : u && mw(v.colorStops, c.colorStops));
    }
    if (!s && n !== al && r && this.needsAnimate() && r.needsAnimate() && n === r.valType && !r._finished) {
      this._additiveTrack = r;
      for (var d = i[0].value, h = 0; h < a; h++)
        n === ea ? i[h].additiveValue = i[h].value - d : n === nn ? i[h].additiveValue = ta([], i[h].value, d, -1) : ra(n) && (i[h].additiveValue = n === La ? ta([], i[h].value, d, -1) : _h([], i[h].value, d, -1));
    }
  }, e.prototype.step = function(t, r) {
    if (!this._finished) {
      this._additiveTrack && this._additiveTrack._finished && (this._additiveTrack = null);
      var i = this._additiveTrack != null, n = i ? "additiveValue" : "value", a = this.valType, o = this.keyframes, s = o.length, l = this.propName, u = a === nn, h, f = this._lastFr, v = Math.min, c, d;
      if (s === 1)
        c = d = o[0];
      else {
        if (r < 0)
          h = 0;
        else if (r < this._lastFrP) {
          var _ = v(f + 1, s - 1);
          for (h = _; h >= 0 && !(o[h].percent <= r); h--)
            ;
          h = v(h, s - 2);
        } else {
          for (h = f; h < s && !(o[h].percent > r); h++)
            ;
          h = v(h - 1, s - 2);
        }
        d = o[h + 1], c = o[h];
      }
      if (c && d) {
        this._lastFr = h, this._lastFrP = r;
        var p = d.percent - c.percent, g = p === 0 ? 1 : v((r - c.percent) / p, 1);
        d.easingFunc && (g = d.easingFunc(g));
        var m = i ? this._additiveValue : u ? Hi : t[l];
        if ((ra(a) || u) && !m && (m = this._additiveValue = []), this.discrete)
          t[l] = g < 1 ? c.rawValue : d.rawValue;
        else if (ra(a))
          a === La ? Xo(m, c[n], d[n], g) : _w(m, c[n], d[n], g);
        else if (yh(a)) {
          var y = c[n], w = d[n], b = a === nl;
          t[l] = {
            type: b ? "linear" : "radial",
            x: Be(y.x, w.x, g),
            y: Be(y.y, w.y, g),
            colorStops: J(y.colorStops, function(T, x) {
              var C = w.colorStops[x];
              return {
                offset: Be(T.offset, C.offset, g),
                color: Pa(Xo([], T.color, C.color, g))
              };
            }),
            global: w.global
          }, b ? (t[l].x2 = Be(y.x2, w.x2, g), t[l].y2 = Be(y.y2, w.y2, g)) : t[l].r = Be(y.r, w.r, g);
        } else if (u)
          Xo(m, c[n], d[n], g), i || (t[l] = Pa(m));
        else {
          var S = Be(c[n], d[n], g);
          i ? this._additiveValue = S : t[l] = S;
        }
        i && this._addToTarget(t);
      }
    }
  }, e.prototype._addToTarget = function(t) {
    var r = this.valType, i = this.propName, n = this._additiveValue;
    r === ea ? t[i] = t[i] + n : r === nn ? (wi(t[i], Hi), ta(Hi, Hi, n, 1), t[i] = Pa(Hi)) : r === La ? ta(t[i], t[i], n, 1) : r === Mv && _h(t[i], t[i], n, 1);
  }, e;
})(), tu = (function() {
  function e(t, r, i, n) {
    if (this._tracks = {}, this._trackKeys = [], this._maxTime = 0, this._started = 0, this._clip = null, this._target = t, this._loop = r, r && n) {
      Zl("Can' use additive animation on looped animation.");
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
    return this.whenWithKeys(t, r, dt(r), i);
  }, e.prototype.whenWithKeys = function(t, r, i, n) {
    for (var a = this._tracks, o = 0; o < i.length; o++) {
      var s = i[o], l = a[s];
      if (!l) {
        l = a[s] = new Sw(s);
        var u = void 0, h = this._getAdditiveTrack(s);
        if (h) {
          var f = h.keyframes, v = f[f.length - 1];
          u = v && v.value, h.valType === nn && u && (u = Pa(u));
        } else
          u = this._target[s];
        if (u == null)
          continue;
        t > 0 && l.addKeyframe(0, Aa(u), n), this._trackKeys.push(s);
      }
      l.addKeyframe(t, Aa(r[s]), n);
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
        var v = new vw({
          life: n,
          loop: this._loop,
          delay: this._delay || 0,
          onframe: function(c) {
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
              i[p].step(r._target, c);
            var g = r._onframeCbs;
            if (g)
              for (var p = 0; p < g.length; p++)
                g[p](r._target, c);
          },
          ondestroy: function() {
            r._doneCallback();
          }
        });
        this._clip = v, this.animation && this.animation.addClip(v), t && v.setEasing(t);
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
    return J(this._trackKeys, function(r) {
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
          l && (t[a] = Aa(l.rawValue));
        }
      }
    }
  }, e.prototype.__changeFinalValue = function(t, r) {
    r = r || dt(t);
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
function di() {
  return (/* @__PURE__ */ new Date()).getTime();
}
var bw = (function(e) {
  G(t, e);
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
    for (var i = di() - this._pausedTime, n = i - this._time, a = this._head; a; ) {
      var o = a.next, s = a.step(i, n);
      s && (a.ondestroy(), this.removeClip(a)), a = o;
    }
    this._time = i, r || (this.trigger("frame", n), this.stage.update && this.stage.update());
  }, t.prototype._startLoop = function() {
    var r = this;
    this._running = !0;
    function i() {
      r._running && (Ga(i), !r._paused && r.update());
    }
    Ga(i);
  }, t.prototype.start = function() {
    this._running || (this._time = di(), this._pausedTime = 0, this._startLoop());
  }, t.prototype.stop = function() {
    this._running = !1;
  }, t.prototype.pause = function() {
    this._paused || (this._pauseStart = di(), this._paused = !0);
  }, t.prototype.resume = function() {
    this._paused && (this._pausedTime += di() - this._pauseStart, this._paused = !1);
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
    var n = new tu(r, i.loop);
    return this.addAnimator(n), n;
  }, t;
})(Ie), Tw = 300, qo = H.domSupported, Zo = (function() {
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
  }, i = J(e, function(n) {
    var a = n.replace("mouse", "pointer");
    return r.hasOwnProperty(a) ? a : n;
  });
  return {
    mouse: e,
    touch: t,
    pointer: i
  };
})(), wh = {
  mouse: ["mousemove", "mouseup"],
  pointer: ["pointermove", "pointerup"]
}, Sh = !1;
function ol(e) {
  var t = e.pointerType;
  return t === "pen" || t === "touch";
}
function xw(e) {
  e.touching = !0, e.touchTimer != null && (clearTimeout(e.touchTimer), e.touchTimer = null), e.touchTimer = setTimeout(function() {
    e.touching = !1, e.touchTimer = null;
  }, 700);
}
function Ko(e) {
  e && (e.zrByTouch = !0);
}
function Cw(e, t) {
  return ee(e.dom, new Dw(e, t), !0);
}
function Av(e, t) {
  for (var r = t, i = !1; r && r.nodeType !== 9 && !(i = r.domBelongToZr || r !== t && r === e.painterRoot); )
    r = r.parentNode;
  return i;
}
var Dw = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.stopPropagation = zt, this.stopImmediatePropagation = zt, this.preventDefault = zt, this.type = r.type, this.target = this.currentTarget = t.dom, this.pointerType = r.pointerType, this.clientX = r.clientX, this.clientY = r.clientY;
  }
  return e;
})(), he = {
  mousedown: function(e) {
    e = ee(this.dom, e), this.__mayPointerCapture = [e.zrX, e.zrY], this.trigger("mousedown", e);
  },
  mousemove: function(e) {
    e = ee(this.dom, e);
    var t = this.__mayPointerCapture;
    t && (e.zrX !== t[0] || e.zrY !== t[1]) && this.__togglePointerCapture(!0), this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    e = ee(this.dom, e), this.__togglePointerCapture(!1), this.trigger("mouseup", e);
  },
  mouseout: function(e) {
    e = ee(this.dom, e);
    var t = e.toElement || e.relatedTarget;
    Av(this, t) || (this.__pointerCapturing && (e.zrEventControl = "no_globalout"), this.trigger("mouseout", e));
  },
  wheel: function(e) {
    Sh = !0, e = ee(this.dom, e), this.trigger("mousewheel", e);
  },
  mousewheel: function(e) {
    Sh || (e = ee(this.dom, e), this.trigger("mousewheel", e));
  },
  touchstart: function(e) {
    e = ee(this.dom, e), Ko(e), this.__lastTouchMoment = /* @__PURE__ */ new Date(), this.handler.processGesture(e, "start"), he.mousemove.call(this, e), he.mousedown.call(this, e);
  },
  touchmove: function(e) {
    e = ee(this.dom, e), Ko(e), this.handler.processGesture(e, "change"), he.mousemove.call(this, e);
  },
  touchend: function(e) {
    e = ee(this.dom, e), Ko(e), this.handler.processGesture(e, "end"), he.mouseup.call(this, e), +/* @__PURE__ */ new Date() - +this.__lastTouchMoment < Tw && he.click.call(this, e);
  },
  pointerdown: function(e) {
    he.mousedown.call(this, e);
  },
  pointermove: function(e) {
    ol(e) || he.mousemove.call(this, e);
  },
  pointerup: function(e) {
    he.mouseup.call(this, e);
  },
  pointerout: function(e) {
    ol(e) || he.mouseout.call(this, e);
  }
};
D(["click", "dblclick", "contextmenu"], function(e) {
  he[e] = function(t) {
    t = ee(this.dom, t), this.trigger(e, t);
  };
});
var sl = {
  pointermove: function(e) {
    ol(e) || sl.mousemove.call(this, e);
  },
  pointerup: function(e) {
    sl.mouseup.call(this, e);
  },
  mousemove: function(e) {
    this.trigger("mousemove", e);
  },
  mouseup: function(e) {
    var t = this.__pointerCapturing;
    this.__togglePointerCapture(!1), this.trigger("mouseup", e), t && (e.zrEventControl = "only_globalout", this.trigger("mouseout", e));
  }
};
function Mw(e, t) {
  var r = t.domHandlers;
  H.pointerEventsSupported ? D(Zo.pointer, function(i) {
    Ia(t, i, function(n) {
      r[i].call(e, n);
    });
  }) : (H.touchEventsSupported && D(Zo.touch, function(i) {
    Ia(t, i, function(n) {
      r[i].call(e, n), xw(t);
    });
  }), D(Zo.mouse, function(i) {
    Ia(t, i, function(n) {
      n = Ql(n), t.touching || r[i].call(e, n);
    });
  }));
}
function Aw(e, t) {
  H.pointerEventsSupported ? D(wh.pointer, r) : H.touchEventsSupported || D(wh.mouse, r);
  function r(i) {
    function n(a) {
      a = Ql(a), Av(e, a.target) || (a = Cw(e, a), t.domHandlers[i].call(e, a));
    }
    Ia(t, i, n, { capture: !0 });
  }
}
function Ia(e, t, r, i) {
  e.mounted[t] = r, e.listenerOpts[t] = i, Y0(e.domTarget, t, r, i);
}
function Qo(e) {
  var t = e.mounted;
  for (var r in t)
    t.hasOwnProperty(r) && X0(e.domTarget, r, t[r], e.listenerOpts[r]);
  e.mounted = {};
}
var bh = /* @__PURE__ */ (function() {
  function e(t, r) {
    this.mounted = {}, this.listenerOpts = {}, this.touching = !1, this.domTarget = t, this.domHandlers = r;
  }
  return e;
})(), Pw = (function(e) {
  G(t, e);
  function t(r, i) {
    var n = e.call(this) || this;
    return n.__pointerCapturing = !1, n.dom = r, n.painterRoot = i, n._localHandlerScope = new bh(r, he), qo && (n._globalHandlerScope = new bh(document, sl)), Mw(n, n._localHandlerScope), n;
  }
  return t.prototype.dispose = function() {
    Qo(this._localHandlerScope), qo && Qo(this._globalHandlerScope);
  }, t.prototype.setCursor = function(r) {
    this.dom.style && (this.dom.style.cursor = r || "default");
  }, t.prototype.__togglePointerCapture = function(r) {
    if (this.__mayPointerCapture = null, qo && +this.__pointerCapturing ^ +r) {
      this.__pointerCapturing = r;
      var i = this._globalHandlerScope;
      r ? Aw(this, i) : Qo(i);
    }
  }, t;
})(Ie), Pv = 1;
H.hasGlobalWindow && (Pv = Math.max(window.devicePixelRatio || window.screen && window.screen.deviceXDPI / window.screen.logicalXDPI || 1, 1));
var Za = Pv, ll = 0.4, ul = "#333", hl = "#ccc", Lw = "#eee", Th = jl, xh = 5e-5;
function mr(e) {
  return e > xh || e < -xh;
}
var yr = [], jr = [], jo = _i(), Jo = Math.abs, eu = (function() {
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
    return mr(this.rotation) || mr(this.x) || mr(this.y) || mr(this.scaleX - 1) || mr(this.scaleY - 1) || mr(this.skewX) || mr(this.skewY);
  }, e.prototype.updateTransform = function() {
    var t = this.parent && this.parent.transform, r = this.needLocalTransform(), i = this.transform;
    if (!(r || t)) {
      i && (Th(i), this.invTransform = null);
      return;
    }
    i = i || _i(), r ? this.getLocalTransform(i) : Th(i), t && (r ? mi(i, t, i) : K0(i, t)), this.transform = i, this._resolveGlobalScaleRatio(i);
  }, e.prototype._resolveGlobalScaleRatio = function(t) {
    var r = this.globalScaleRatio;
    if (r != null && r !== 1) {
      this.getGlobalScale(yr);
      var i = yr[0] < 0 ? -1 : 1, n = yr[1] < 0 ? -1 : 1, a = ((yr[0] - i) * r + i) / yr[0] || 0, o = ((yr[1] - n) * r + n) / yr[1] || 0;
      t[0] *= a, t[1] *= a, t[2] *= o, t[3] *= o;
    }
    this.invTransform = this.invTransform || _i(), vv(this.invTransform, t);
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
      t && t.transform && (t.invTransform = t.invTransform || _i(), mi(jr, t.invTransform, r), r = jr);
      var i = this.originX, n = this.originY;
      (i || n) && (jo[4] = i, jo[5] = n, mi(jr, r, jo), jr[4] -= i, jr[5] -= n, r = jr), this.setLocalTransform(r);
    }
  }, e.prototype.getGlobalScale = function(t) {
    var r = this.transform;
    return t = t || [], r ? (t[0] = Math.sqrt(r[0] * r[0] + r[1] * r[1]), t[1] = Math.sqrt(r[2] * r[2] + r[3] * r[3]), r[0] < 0 && (t[0] = -t[0]), r[3] < 0 && (t[1] = -t[1]), t) : (t[0] = 1, t[1] = 1, t);
  }, e.prototype.transformCoordToLocal = function(t, r) {
    var i = [t, r], n = this.invTransform;
    return n && Me(i, i, n), i;
  }, e.prototype.transformCoordToGlobal = function(t, r) {
    var i = [t, r], n = this.transform;
    return n && Me(i, i, n), i;
  }, e.prototype.getLineScale = function() {
    var t = this.transform;
    return t && Jo(t[0] - 1) > 1e-10 && Jo(t[3] - 1) > 1e-10 ? Math.sqrt(Jo(t[0] * t[3] - t[2] * t[1])) : 1;
  }, e.prototype.copyTransform = function(t) {
    Iw(this, t);
  }, e.getLocalTransform = function(t, r) {
    r = r || [];
    var i = t.originX || 0, n = t.originY || 0, a = t.scaleX, o = t.scaleY, s = t.anchorX, l = t.anchorY, u = t.rotation || 0, h = t.x, f = t.y, v = t.skewX ? Math.tan(t.skewX) : 0, c = t.skewY ? Math.tan(-t.skewY) : 0;
    if (i || n || s || l) {
      var d = i + s, _ = n + l;
      r[4] = -d * a - v * _ * o, r[5] = -_ * o - c * d * a;
    } else
      r[4] = r[5] = 0;
    return r[0] = a, r[3] = o, r[1] = c * a, r[2] = v * o, u && Jl(r, r, u), r[4] += i + h, r[5] += n + f, r;
  }, e.initDefaultProps = (function() {
    var t = e.prototype;
    t.scaleX = t.scaleY = t.globalScaleRatio = 1, t.x = t.y = t.originX = t.originY = t.skewX = t.skewY = t.rotation = t.anchorX = t.anchorY = 0;
  })(), e;
})(), An = [
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
function Iw(e, t) {
  for (var r = 0; r < An.length; r++) {
    var i = An[r];
    e[i] = t[i];
  }
}
var Ch = {};
function Kt(e, t) {
  t = t || Gr;
  var r = Ch[t];
  r || (r = Ch[t] = new Vn(500));
  var i = r.get(e);
  return i == null && (i = Pi.measureText(e, t).width, r.put(e, i)), i;
}
function Dh(e, t, r, i) {
  var n = Kt(e, t), a = ru(t), o = an(0, n, r), s = fi(0, a, i), l = new it(o, s, n, a);
  return l;
}
function Lv(e, t, r, i) {
  var n = ((e || "") + "").split(`
`), a = n.length;
  if (a === 1)
    return Dh(n[0], t, r, i);
  for (var o = new it(0, 0, 0, 0), s = 0; s < n.length; s++) {
    var l = Dh(n[s], t, r, i);
    s === 0 ? o.copy(l) : o.union(l);
  }
  return o;
}
function an(e, t, r) {
  return r === "right" ? e -= t : r === "center" && (e -= t / 2), e;
}
function fi(e, t, r) {
  return r === "middle" ? e -= t / 2 : r === "bottom" && (e -= t), e;
}
function ru(e) {
  return Kt("国", e);
}
function Di(e, t) {
  return typeof e == "string" ? e.lastIndexOf("%") >= 0 ? parseFloat(e) / 100 * t : parseFloat(e) : e;
}
function Iv(e, t, r) {
  var i = t.position || "inside", n = t.distance != null ? t.distance : 5, a = r.height, o = r.width, s = a / 2, l = r.x, u = r.y, h = "left", f = "top";
  if (i instanceof Array)
    l += Di(i[0], r.width), u += Di(i[1], r.height), h = null, f = null;
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
var ts = "__zr_normal__", es = An.concat(["ignore"]), Rw = ur(An, function(e, t) {
  return e[t] = !0, e;
}, { ignore: !1 }), Jr = {}, kw = new it(0, 0, 0, 0), So = (function() {
  function e(t) {
    this.id = ov(), this.animators = [], this.currentStates = [], this.states = {}, this._init(t);
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
        var h = kw;
        i.layoutRect ? h.copy(i.layoutRect) : h.copy(this.getBoundingRect()), n || h.applyTransform(this.transform), this.calculateTextPosition ? this.calculateTextPosition(Jr, i, h) : Iv(Jr, i, h), a.x = Jr.x, a.y = Jr.y, o = Jr.align, s = Jr.verticalAlign;
        var f = i.origin;
        if (f && i.rotation != null) {
          var v = void 0, c = void 0;
          f === "center" ? (v = h.width * 0.5, c = h.height * 0.5) : (v = Di(f[0], h.width), c = Di(f[1], h.height)), u = !0, a.originX = -a.x + v + (n ? 0 : h.x), a.originY = -a.y + c + (n ? 0 : h.y);
        }
      }
      i.rotation != null && (a.rotation = i.rotation);
      var d = i.offset;
      d && (a.x += d[0], a.y += d[1], u || (a.originX = -d[0], a.originY = -d[1]));
      var _ = i.inside == null ? typeof i.position == "string" && i.position.indexOf("inside") >= 0 : i.inside, p = this._innerTextDefaultStyle || (this._innerTextDefaultStyle = {}), g = void 0, m = void 0, y = void 0;
      _ && this.canBeInsideText() ? (g = i.insideFill, m = i.insideStroke, (g == null || g === "auto") && (g = this.getInsideTextFill()), (m == null || m === "auto") && (m = this.getInsideTextStroke(g), y = !0)) : (g = i.outsideFill, m = i.outsideStroke, (g == null || g === "auto") && (g = this.getOutsideFill()), (m == null || m === "auto") && (m = this.getOutsideStroke(g), y = !0)), g = g || "#000", (g !== p.fill || m !== p.stroke || y !== p.autoStroke || o !== p.align || s !== p.verticalAlign) && (l = !0, p.fill = g, p.stroke = m, p.autoStroke = y, p.align = o, p.verticalAlign = s, r.setDefaultTextStyle(p)), r.__dirty |= qt, l && r.dirtyStyle(!0);
    }
  }, e.prototype.canBeInsideText = function() {
    return !0;
  }, e.prototype.getInsideTextFill = function() {
    return "#fff";
  }, e.prototype.getInsideTextStroke = function(t) {
    return "#000";
  }, e.prototype.getOutsideFill = function() {
    return this.__zr && this.__zr.isDarkMode() ? hl : ul;
  }, e.prototype.getOutsideStroke = function(t) {
    var r = this.__zr && this.__zr.getBackgroundColor(), i = typeof r == "string" && wi(r);
    i || (i = [255, 255, 255, 1]);
    for (var n = i[3], a = this.__zr.isDarkMode(), o = 0; o < 3; o++)
      i[o] = i[o] * n + (a ? 0 : 255) * (1 - n);
    return i[3] = 1, Dv(i, "rgba");
  }, e.prototype.traverse = function(t, r) {
  }, e.prototype.attrKV = function(t, r) {
    t === "textConfig" ? this.setTextConfig(r) : t === "textContent" ? this.setTextContent(r) : t === "clipPath" ? this.setClipPath(r) : t === "extra" ? (this.extra = this.extra || {}, R(this.extra, r)) : this[t] = r;
  }, e.prototype.hide = function() {
    this.ignore = !0, this.markRedraw();
  }, e.prototype.show = function() {
    this.ignore = !1, this.markRedraw();
  }, e.prototype.attr = function(t, r) {
    if (typeof t == "string")
      this.attrKV(t, r);
    else if (F(t))
      for (var i = t, n = dt(i), a = 0; a < n.length; a++) {
        var o = n[a];
        this.attrKV(o, t[o]);
      }
    return this.markRedraw(), this;
  }, e.prototype.saveCurrentToNormalState = function(t) {
    this._innerSaveToNormal(t);
    for (var r = this._normalState, i = 0; i < this.animators.length; i++) {
      var n = this.animators[i], a = n.__fromStateTransition;
      if (!(n.getLoop() || a && a !== ts)) {
        var o = n.targetName, s = o ? r[o] : r;
        n.saveTo(s);
      }
    }
  }, e.prototype._innerSaveToNormal = function(t) {
    var r = this._normalState;
    r || (r = this._normalState = {}), t.textConfig && !r.textConfig && (r.textConfig = this.textConfig), this._savePrimaryToNormal(t, r, es);
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
    this.useState(ts, !1, t);
  }, e.prototype.useState = function(t, r, i, n) {
    var a = t === ts, o = this.hasState();
    if (!(!o && a)) {
      var s = this.currentStates, l = this.stateTransition;
      if (!(ot(s, t) >= 0 && (r || s.length === 1))) {
        var u;
        if (this.stateProxy && !a && (u = this.stateProxy(t)), u || (u = this.states && this.states[t]), !u && !a) {
          Zl("State " + t + " not exists.");
          return;
        }
        a || this.saveCurrentToNormalState(u);
        var h = !!(u && u.hoverLayer || n);
        h && this._toggleHoverLayerFlag(!0), this._applyStateObj(t, u, this._normalState, r, !i && !this.__inHover && l && l.duration > 0, l);
        var f = this._textContent, v = this._textGuide;
        return f && f.useState(t, r, i, h), v && v.useState(t, r, i, h), a ? (this.currentStates = [], this._normalState = {}) : r ? this.currentStates.push(t) : this.currentStates = [t], this._updateAnimationTargets(), this.markRedraw(), !h && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~qt), u;
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
      var f = n[o - 1], v = !!(f && f.hoverLayer || i);
      v && this._toggleHoverLayerFlag(!0);
      var c = this._mergeStates(n), d = this.stateTransition;
      this.saveCurrentToNormalState(c), this._applyStateObj(t.join(","), c, this._normalState, !1, !r && !this.__inHover && d && d.duration > 0, d);
      var _ = this._textContent, p = this._textGuide;
      _ && _.useStates(t, r, v), p && p.useStates(t, r, v), this._updateAnimationTargets(), this.currentStates = t.slice(), this.markRedraw(), !v && this.__inHover && (this._toggleHoverLayerFlag(!1), this.__dirty &= ~qt);
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
    var r = ot(this.currentStates, t);
    if (r >= 0) {
      var i = this.currentStates.slice();
      i.splice(r, 1), this.useStates(i);
    }
  }, e.prototype.replaceState = function(t, r, i) {
    var n = this.currentStates.slice(), a = ot(n, t), o = ot(n, r) >= 0;
    a >= 0 ? o ? n.splice(a, 1) : n[a] = r : i && !o && n.push(r), this.useStates(n);
  }, e.prototype.toggleState = function(t, r) {
    r ? this.useState(t, !0) : this.removeState(t);
  }, e.prototype._mergeStates = function(t) {
    for (var r = {}, i, n = 0; n < t.length; n++) {
      var a = t[n];
      R(r, a), a.textConfig && (i = i || {}, R(i, a.textConfig));
    }
    return i && (r.textConfig = i), r;
  }, e.prototype._applyStateObj = function(t, r, i, n, a, o) {
    var s = !(r && n);
    r && r.textConfig ? (this.textConfig = R({}, n ? this.textConfig : i.textConfig), R(this.textConfig, r.textConfig)) : s && i.textConfig && (this.textConfig = i.textConfig);
    for (var l = {}, u = !1, h = 0; h < es.length; h++) {
      var f = es[h], v = a && Rw[f];
      r && r[f] != null ? v ? (u = !0, l[f] = r[f]) : this[f] = r[f] : s && i[f] != null && (v ? (u = !0, l[f] = i[f]) : this[f] = i[f]);
    }
    if (!a)
      for (var h = 0; h < this.animators.length; h++) {
        var c = this.animators[h], d = c.targetName;
        c.getLoop() || c.__changeFinalValue(d ? (r || i)[d] : r || i);
      }
    u && this._transitionState(t, l, o);
  }, e.prototype._attachComponent = function(t) {
    if (!(t.__zr && !t.__hostTarget) && t !== this) {
      var r = this.__zr;
      r && t.addSelfToZr(r), t.__zr = r, t.__hostTarget = this;
    }
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
    r !== t && (r && r !== t && this.removeTextContent(), t.innerTransformable = new eu(), this._attachComponent(t), this._textContent = t, this.markRedraw());
  }, e.prototype.setTextConfig = function(t) {
    this.textConfig || (this.textConfig = {}), R(this.textConfig, t), this.markRedraw();
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
    this.__dirty |= qt;
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
    var n = t ? this[t] : this, a = new tu(n, r, i);
    return t && (a.targetName = t), this.addAnimator(a, t), a;
  }, e.prototype.addAnimator = function(t, r) {
    var i = this.__zr, n = this;
    t.during(function() {
      n.updateDuringAnimation(r);
    }).done(function() {
      var a = n.animators, o = ot(a, t);
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
    rs(this, t, r, i);
  }, e.prototype.animateFrom = function(t, r, i) {
    rs(this, t, r, i, !0);
  }, e.prototype._transitionState = function(t, r, i, n) {
    for (var a = rs(this, r, i, n), o = 0; o < a.length; o++)
      a[o].__fromStateTransition = t;
  }, e.prototype.getBoundingRect = function() {
    return null;
  }, e.prototype.getPaintRect = function() {
    return null;
  }, e.initDefaultProps = (function() {
    var t = e.prototype;
    t.type = "element", t.name = "", t.ignore = t.silent = t.isGroup = t.draggable = t.dragging = t.ignoreClip = t.__inHover = !1, t.__dirty = qt;
    function r(i, n, a, o) {
      Object.defineProperty(t, i, {
        get: function() {
          if (!this[n]) {
            var l = this[n] = [];
            s(this, l);
          }
          return this[n];
        },
        set: function(l) {
          this[a] = l[0], this[o] = l[1], this[n] = l, s(this, l);
        }
      });
      function s(l, u) {
        Object.defineProperty(u, 0, {
          get: function() {
            return l[a];
          },
          set: function(h) {
            l[a] = h;
          }
        }), Object.defineProperty(u, 1, {
          get: function() {
            return l[o];
          },
          set: function(h) {
            l[o] = h;
          }
        });
      }
    }
    Object.defineProperty && (r("position", "_legacyPos", "x", "y"), r("scale", "_legacyScale", "scaleX", "scaleY"), r("origin", "_legacyOrigin", "originX", "originY"));
  })(), e;
})();
Ge(So, Ie);
Ge(So, eu);
function rs(e, t, r, i, n) {
  r = r || {};
  var a = [];
  Rv(e, "", e, t, r, i, a, n);
  var o = a.length, s = !1, l = r.done, u = r.aborted, h = function() {
    s = !0, o--, o <= 0 && (s ? l && l() : u && u());
  }, f = function() {
    o--, o <= 0 && (s ? l && l() : u && u());
  };
  o || l && l(), a.length > 0 && r.during && a[0].during(function(d, _) {
    r.during(_);
  });
  for (var v = 0; v < a.length; v++) {
    var c = a[v];
    h && c.done(h), f && c.aborted(f), r.force && c.duration(r.duration), c.start(r.easing);
  }
  return a;
}
function is(e, t, r) {
  for (var i = 0; i < r; i++)
    e[i] = t[i];
}
function Ew(e) {
  return Vt(e[0]);
}
function $w(e, t, r) {
  if (Vt(t[r]))
    if (Vt(e[r]) || (e[r] = []), Ut(t[r])) {
      var i = t[r].length;
      e[r].length !== i && (e[r] = new t[r].constructor(i), is(e[r], t[r], i));
    } else {
      var n = t[r], a = e[r], o = n.length;
      if (Ew(n))
        for (var s = n[0].length, l = 0; l < o; l++)
          a[l] ? is(a[l], n[l], s) : a[l] = Array.prototype.slice.call(n[l]);
      else
        is(a, n, o);
      a.length = n.length;
    }
  else
    e[r] = t[r];
}
function Ow(e, t) {
  return e === t || Vt(e) && Vt(t) && Bw(e, t);
}
function Bw(e, t) {
  var r = e.length;
  if (r !== t.length)
    return !1;
  for (var i = 0; i < r; i++)
    if (e[i] !== t[i])
      return !1;
  return !0;
}
function Rv(e, t, r, i, n, a, o, s) {
  for (var l = dt(i), u = n.duration, h = n.delay, f = n.additive, v = n.setToFinal, c = !F(a), d = e.animators, _ = [], p = 0; p < l.length; p++) {
    var g = l[p], m = i[g];
    if (m != null && r[g] != null && (c || a[g]))
      if (F(m) && !Vt(m) && !yo(m)) {
        if (t) {
          s || (r[g] = m, e.updateDuringAnimation(t));
          continue;
        }
        Rv(e, g, r[g], m, n, a && a[g], o, s);
      } else
        _.push(g);
    else s || (r[g] = m, e.updateDuringAnimation(t), _.push(g));
  }
  var y = _.length;
  if (!f && y)
    for (var w = 0; w < d.length; w++) {
      var b = d[w];
      if (b.targetName === t) {
        var S = b.stopTracks(_);
        if (S) {
          var T = ot(d, b);
          d.splice(T, 1);
        }
      }
    }
  if (n.force || (_ = ce(_, function(A) {
    return !Ow(i[A], r[A]);
  }), y = _.length), y > 0 || n.force && !o.length) {
    var x = void 0, C = void 0, M = void 0;
    if (s) {
      C = {}, v && (x = {});
      for (var w = 0; w < y; w++) {
        var g = _[w];
        C[g] = r[g], v ? x[g] = i[g] : r[g] = i[g];
      }
    } else if (v) {
      M = {};
      for (var w = 0; w < y; w++) {
        var g = _[w];
        M[g] = Aa(r[g]), $w(r, i, g);
      }
    }
    var b = new tu(r, !1, !1, f ? ce(d, function(L) {
      return L.targetName === t;
    }) : null);
    b.targetName = t, n.scope && (b.scope = n.scope), v && x && b.whenWithKeys(0, x, _), M && b.whenWithKeys(0, M, _), b.whenWithKeys(u ?? 500, s ? C : i, _).delay(h || 0), e.addAnimator(b, t), o.push(b);
  }
}
var Ue = (function(e) {
  G(t, e);
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
    return r && r !== this && r.parent !== this && (this._children.push(r), this._doAdd(r)), this;
  }, t.prototype.addBefore = function(r, i) {
    if (r && r !== this && r.parent !== this && i && i.parent === this) {
      var n = this._children, a = n.indexOf(i);
      a >= 0 && (n.splice(a, 0, r), this._doAdd(r));
    }
    return this;
  }, t.prototype.replace = function(r, i) {
    var n = ot(this._children, r);
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
    var i = this.__zr, n = this._children, a = ot(n, r);
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
    for (var i = new it(0, 0, 0, 0), n = r || this._children, a = [], o = null, s = 0; s < n.length; s++) {
      var l = n[s];
      if (!(l.ignore || l.invisible)) {
        var u = l.getBoundingRect(), h = l.getLocalTransform(a);
        h ? (it.applyTransform(i, u, h), o = o || i.clone(), o.union(i)) : (o = o || u.clone(), o.union(u));
      }
    }
    return o || i;
  }, t;
})(So);
Ue.prototype.type = "group";
var Ra = {}, kv = {};
function Nw(e) {
  delete kv[e];
}
function Fw(e) {
  if (!e)
    return !1;
  if (typeof e == "string")
    return qa(e, 1) < ll;
  if (e.colorStops) {
    for (var t = e.colorStops, r = 0, i = t.length, n = 0; n < i; n++)
      r += qa(t[n].color, 1);
    return r /= i, r < ll;
  }
  return !1;
}
var zw = (function() {
  function e(t, r, i) {
    var n = this;
    this._sleepAfterStill = 10, this._stillFrameAccum = 0, this._needsRefresh = !0, this._needsRefreshHover = !0, this._darkMode = !1, i = i || {}, this.dom = r, this.id = t;
    var a = new ow(), o = i.renderer || "canvas";
    Ra[o] || (o = dt(Ra)[0]), i.useDirtyRect = i.useDirtyRect == null ? !1 : i.useDirtyRect;
    var s = new Ra[o](r, a, i, t), l = i.ssr || s.ssrOnly;
    this.storage = a, this.painter = s;
    var u = !H.node && !H.worker && !l ? new Pw(s.getViewportRoot(), s.root) : null, h = i.useCoarsePointer, f = h == null || h === "auto" ? H.touchEventsSupported : !!h, v = 44, c;
    f && (c = K(i.pointerSize, v)), this.handler = new pv(a, s, u, s.root, c), this.animation = new bw({
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
    this._disposed || (this.painter.setBackgroundColor && this.painter.setBackgroundColor(t), this.refresh(), this._backgroundColor = t, this._darkMode = Fw(t));
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
    var r, i = di();
    this._needsRefresh && (r = !0, this.refreshImmediately(t)), this._needsRefreshHover && (r = !0, this.refreshHoverImmediately());
    var n = di();
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
        t[r] instanceof Ue && t[r].removeSelfFromZr(this);
      this.storage.delAllRoots(), this.painter.clear();
    }
  }, e.prototype.dispose = function() {
    this._disposed || (this.animation.stop(), this.clear(), this.storage.dispose(), this.painter.dispose(), this.handler.dispose(), this.animation = this.storage = this.painter = this.handler = null, this._disposed = !0, Nw(this.id));
  }, e;
})();
function Mh(e, t) {
  var r = new zw(ov(), e, t);
  return kv[r.id] = r, r;
}
function Hw(e, t) {
  Ra[e] = t;
}
var Ah = 1e-4, Ev = 20;
function Vw(e) {
  return e.replace(/^\s+|\s+$/g, "");
}
function Uw(e, t, r, i) {
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
function yt(e, t) {
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
  return V(e) ? Vw(e).match(/%$/) ? parseFloat(e) / 100 * t : parseFloat(e) : e == null ? NaN : +e;
}
function Gw(e, t, r) {
  return t == null && (t = 10), t = Math.min(Math.max(0, t), Ev), e = (+e).toFixed(t), r ? e : +e;
}
function Ph(e) {
  if (e = +e, isNaN(e))
    return 0;
  if (e > 1e-14) {
    for (var t = 1, r = 0; r < 15; r++, t *= 10)
      if (Math.round(e * t) / t === e)
        return r;
  }
  return Ww(e);
}
function Ww(e) {
  var t = e.toString().toLowerCase(), r = t.indexOf("e"), i = r > 0 ? +t.slice(r + 1) : 0, n = r > 0 ? r : t.length, a = t.indexOf("."), o = a < 0 ? 0 : n - 1 - a;
  return Math.max(0, o - i);
}
function Yw(e, t) {
  var r = ur(e, function(c, d) {
    return c + (isNaN(d) ? 0 : d);
  }, 0);
  if (r === 0)
    return [];
  for (var i = Math.pow(10, t), n = J(e, function(c) {
    return (isNaN(c) ? 0 : c) / r * i * 100;
  }), a = i * 100, o = J(n, function(c) {
    return Math.floor(c);
  }), s = ur(o, function(c, d) {
    return c + d;
  }, 0), l = J(n, function(c, d) {
    return c - o[d];
  }); s < a; ) {
    for (var u = Number.NEGATIVE_INFINITY, h = null, f = 0, v = l.length; f < v; ++f)
      l[f] > u && (u = l[f], h = f);
    ++o[h], l[h] = 0, ++s;
  }
  return J(o, function(c) {
    return c / i;
  });
}
function Xw(e, t) {
  var r = Math.max(Ph(e), Ph(t)), i = e + t;
  return r > Ev ? i : Gw(i, r);
}
function $v(e) {
  var t = Math.PI * 2;
  return (e % t + t) % t;
}
function Ka(e) {
  return e > -Ah && e < Ah;
}
var qw = /^(?:(\d{4})(?:[-\/](\d{1,2})(?:[-\/](\d{1,2})(?:[T ](\d{1,2})(?::(\d{1,2})(?::(\d{1,2})(?:[.,](\d+))?)?)?(Z|[\+\-]\d\d:?\d\d)?)?)?)?)?$/;
function bo(e) {
  if (e instanceof Date)
    return e;
  if (V(e)) {
    var t = qw.exec(e);
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
function Qa(e) {
  var t = parseFloat(e);
  return t == e && (t !== 0 || !V(e) || e.indexOf("x") <= 0) ? t : NaN;
}
function Zw(e) {
  return !isNaN(Qa(e));
}
function Ov() {
  return Math.round(Math.random() * 9);
}
function Bv(e, t) {
  return t === 0 ? e : Bv(t, e % t);
}
function Lh(e, t) {
  return e == null ? t : t == null ? e : e * t / Bv(e, t);
}
function Nt(e) {
  throw new Error(e);
}
var Nv = "series\0", Kw = "\0_ec_\0";
function kt(e) {
  return e instanceof Array ? e : e == null ? [] : [e];
}
function fl(e, t, r) {
  if (e) {
    e[t] = e[t] || {}, e.emphasis = e.emphasis || {}, e.emphasis[t] = e.emphasis[t] || {};
    for (var i = 0, n = r.length; i < n; i++) {
      var a = r[i];
      !e.emphasis[t].hasOwnProperty(a) && e[t].hasOwnProperty(a) && (e.emphasis[t][a] = e[t][a]);
    }
  }
}
var Ih = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "rich", "tag", "color", "textBorderColor", "textBorderWidth", "width", "height", "lineHeight", "align", "verticalAlign", "baseline", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY", "backgroundColor", "borderColor", "borderWidth", "borderRadius", "padding"];
function To(e) {
  return F(e) && !$(e) && !(e instanceof Date) ? e.value : e;
}
function Qw(e) {
  return F(e) && !(e instanceof Array);
}
function jw(e, t, r) {
  var i = r === "normalMerge", n = r === "replaceMerge", a = r === "replaceAll";
  e = e || [], t = (t || []).slice();
  var o = tt();
  D(t, function(l, u) {
    if (!F(l)) {
      t[u] = null;
      return;
    }
  });
  var s = Jw(e, o, r);
  return (i || n) && t1(s, e, o, t), i && e1(s, t), i || n ? r1(s, t, n) : a && i1(s, t), n1(s), s;
}
function Jw(e, t, r) {
  var i = [];
  if (r === "replaceAll")
    return i;
  for (var n = 0; n < e.length; n++) {
    var a = e[n];
    a && a.id != null && t.set(a.id, n), i.push({
      existing: r === "replaceMerge" || Pn(a) ? null : a,
      newOption: null,
      keyInfo: null,
      brandNew: null
    });
  }
  return i;
}
function t1(e, t, r, i) {
  D(i, function(n, a) {
    if (!(!n || n.id == null)) {
      var o = pn(n.id), s = r.get(o);
      if (s != null) {
        var l = e[s];
        Ve(!l.newOption, 'Duplicated option on id "' + o + '".'), l.newOption = n, l.existing = t[s], i[a] = null;
      }
    }
  });
}
function e1(e, t) {
  D(t, function(r, i) {
    if (!(!r || r.name == null))
      for (var n = 0; n < e.length; n++) {
        var a = e[n].existing;
        if (!e[n].newOption && a && (a.id == null || r.id == null) && !Pn(r) && !Pn(a) && Fv("name", a, r)) {
          e[n].newOption = r, t[i] = null;
          return;
        }
      }
  });
}
function r1(e, t, r) {
  D(t, function(i) {
    if (i) {
      for (
        var n, a = 0;
        // Be `!resultItem` only when `nextIdx >= result.length`.
        (n = e[a]) && (n.newOption || Pn(n.existing) || // In mode "replaceMerge", here no not-mapped-non-internal-existing.
        n.existing && i.id != null && !Fv("id", i, n.existing));
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
function i1(e, t) {
  D(t, function(r) {
    e.push({
      newOption: r,
      brandNew: !0,
      existing: null,
      keyInfo: null
    });
  });
}
function n1(e) {
  var t = tt();
  D(e, function(r) {
    var i = r.existing;
    i && t.set(i.id, r);
  }), D(e, function(r) {
    var i = r.newOption;
    Ve(!i || i.id == null || !t.get(i.id) || t.get(i.id) === r, "id duplicates: " + (i && i.id)), i && i.id != null && t.set(i.id, r), !r.keyInfo && (r.keyInfo = {});
  }), D(e, function(r, i) {
    var n = r.existing, a = r.newOption, o = r.keyInfo;
    if (F(a)) {
      if (o.name = a.name != null ? pn(a.name) : n ? n.name : Nv + i, n)
        o.id = pn(n.id);
      else if (a.id != null)
        o.id = pn(a.id);
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
function Fv(e, t, r) {
  var i = Ae(t[e], null), n = Ae(r[e], null);
  return i != null && n != null && i === n;
}
function pn(e) {
  return Ae(e, "");
}
function Ae(e, t) {
  return e == null ? t : V(e) ? e : mt(e) || qs(e) ? e + "" : t;
}
function zv(e) {
  var t = e.name;
  return !!(t && t.indexOf(Nv));
}
function Pn(e) {
  return e && e.id != null && pn(e.id).indexOf(Kw) === 0;
}
function a1(e, t, r) {
  D(e, function(i) {
    var n = i.newOption;
    F(n) && (i.keyInfo.mainType = t, i.keyInfo.subType = o1(t, n, i.existing, r));
  });
}
function o1(e, t, r, i) {
  var n = t.type ? t.type : r ? r.subType : i.determineSubType(e, t);
  return n;
}
function Un(e, t) {
  if (t.dataIndexInside != null)
    return t.dataIndexInside;
  if (t.dataIndex != null)
    return $(t.dataIndex) ? J(t.dataIndex, function(r) {
      return e.indexOfRawIndex(r);
    }) : e.indexOfRawIndex(t.dataIndex);
  if (t.name != null)
    return $(t.name) ? J(t.name, function(r) {
      return e.indexOfName(r);
    }) : e.indexOfName(t.name);
}
function wt() {
  var e = "__ec_inner_" + s1++;
  return function(t) {
    return t[e] || (t[e] = {});
  };
}
var s1 = Ov();
function ns(e, t, r) {
  var i = iu(t, r), n = i.mainTypeSpecified, a = i.queryOptionMap, o = i.others, s = o, l = r ? r.defaultMainType : null;
  return !n && l && a.set(l, {}), a.each(function(u, h) {
    var f = Gn(e, h, u, {
      useDefault: l === h,
      enableAll: r && r.enableAll != null ? r.enableAll : !0,
      enableNone: r && r.enableNone != null ? r.enableNone : !0
    });
    s[h + "Models"] = f.models, s[h + "Model"] = f.models[0];
  }), s;
}
function iu(e, t) {
  var r;
  if (V(e)) {
    var i = {};
    i[e + "Index"] = 0, r = i;
  } else
    r = e;
  var n = tt(), a = {}, o = !1;
  return D(r, function(s, l) {
    if (l === "dataIndex" || l === "dataIndexInside") {
      a[l] = s;
      return;
    }
    var u = l.match(/^(\w+)(Index|Id|Name)$/) || [], h = u[1], f = (u[2] || "").toLowerCase();
    if (!(!h || !f || t && t.includeMainTypes && ot(t.includeMainTypes, h) < 0)) {
      o = o || !!h;
      var v = n.get(h) || n.set(h, {});
      v[f] = s;
    }
  }), {
    mainTypeSpecified: o,
    queryOptionMap: n,
    others: a
  };
}
var nu = {
  useDefault: !0,
  enableAll: !1,
  enableNone: !1
};
function Gn(e, t, r, i) {
  i = i || nu;
  var n = r.index, a = r.id, o = r.name, s = {
    models: null,
    specified: n != null || a != null || o != null
  };
  if (!s.specified) {
    var l = void 0;
    return s.models = i.useDefault && (l = e.getComponent(t)) ? [l] : [], s;
  }
  return n === "none" || n === !1 ? (Ve(i.enableNone, '`"none"` or `false` is not a valid value on index option.'), s.models = [], s) : (n === "all" && (Ve(i.enableAll, '`"all"` is not a valid value on index option.'), n = a = o = null), s.models = e.queryComponents({
    mainType: t,
    index: n,
    id: a,
    name: o
  }), s);
}
function Hv(e, t, r) {
  e.setAttribute ? e.setAttribute(t, r) : e[t] = r;
}
function l1(e, t) {
  return e.getAttribute ? e.getAttribute(t) : e[t];
}
function u1(e) {
  return e === "auto" ? H.domSupported ? "html" : "richText" : e || "html";
}
var h1 = ".", wr = "___EC__COMPONENT__CONTAINER___", Vv = "___EC__EXTENDED_CLASS___";
function De(e) {
  var t = {
    main: "",
    sub: ""
  };
  if (e) {
    var r = e.split(h1);
    t.main = r[0] || "", t.sub = r[1] || "";
  }
  return t;
}
function f1(e) {
  Ve(/^[a-zA-Z0-9_]+([.][a-zA-Z0-9_]+)?$/.test(e), 'componentType "' + e + '" illegal');
}
function c1(e) {
  return !!(e && e[Vv]);
}
function au(e, t) {
  e.$constructor = e, e.extend = function(r) {
    var i = this, n;
    return v1(i) ? n = /** @class */
    (function(a) {
      G(o, a);
      function o() {
        return a.apply(this, arguments) || this;
      }
      return o;
    })(i) : (n = function() {
      (r.$constructor || i).apply(this, arguments);
    }, S0(n, this)), R(n.prototype, r), n[Vv] = !0, n.extend = this.extend, n.superCall = g1, n.superApply = _1, n.superClass = i, n;
  };
}
function v1(e) {
  return rt(e) && /^class\s/.test(Function.prototype.toString.call(e));
}
function Uv(e, t) {
  e.extend = t.extend;
}
var d1 = Math.round(Math.random() * 10);
function p1(e) {
  var t = ["__\0is_clz", d1++].join("_");
  e.prototype[t] = !0, e.isInstance = function(r) {
    return !!(r && r[t]);
  };
}
function g1(e, t) {
  for (var r = [], i = 2; i < arguments.length; i++)
    r[i - 2] = arguments[i];
  return this.superClass.prototype[t].apply(e, r);
}
function _1(e, t, r) {
  return this.superClass.prototype[t].apply(e, r);
}
function ou(e) {
  var t = {};
  e.registerClass = function(i) {
    var n = i.type || i.prototype.type;
    if (n) {
      f1(n), i.prototype.type = n;
      var a = De(n);
      if (!a.sub)
        t[a.main] = i;
      else if (a.sub !== wr) {
        var o = r(a);
        o[a.sub] = i;
      }
    }
    return i;
  }, e.getClass = function(i, n, a) {
    var o = t[i];
    if (o && o[wr] && (o = n ? o[n] : null), a && !o)
      throw new Error(n ? "Component " + i + "." + (n || "") + " is used but not imported." : i + ".type should be specified.");
    return o;
  }, e.getClassesByMainType = function(i) {
    var n = De(i), a = [], o = t[n.main];
    return o && o[wr] ? D(o, function(s, l) {
      l !== wr && a.push(s);
    }) : a.push(o), a;
  }, e.hasClass = function(i) {
    var n = De(i);
    return !!t[n.main];
  }, e.getAllClassMainTypes = function() {
    var i = [];
    return D(t, function(n, a) {
      i.push(a);
    }), i;
  }, e.hasSubTypes = function(i) {
    var n = De(i), a = t[n.main];
    return a && a[wr];
  };
  function r(i) {
    var n = t[i.main];
    return (!n || !n[wr]) && (n = t[i.main] = {}, n[wr] = !0), n;
  }
}
function Ln(e, t) {
  for (var r = 0; r < e.length; r++)
    e[r][1] || (e[r][1] = e[r][0]);
  return t = t || !1, function(i, n, a) {
    for (var o = {}, s = 0; s < e.length; s++) {
      var l = e[s][1];
      if (!(n && ot(n, l) >= 0 || a && ot(a, l) < 0)) {
        var u = i.getShallow(l, t);
        u != null && (o[e[s][0]] = u);
      }
    }
    return o;
  };
}
var m1 = [
  ["fill", "color"],
  ["shadowBlur"],
  ["shadowOffsetX"],
  ["shadowOffsetY"],
  ["opacity"],
  ["shadowColor"]
  // Option decal is in `DecalObject` but style.decal is in `PatternObject`.
  // So do not transfer decal directly.
], y1 = Ln(m1), w1 = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getAreaStyle = function(t, r) {
      return y1(this, t, r);
    }, e;
  })()
), cl = new Vn(50);
function S1(e) {
  if (typeof e == "string") {
    var t = cl.get(e);
    return t && t.image;
  } else
    return e;
}
function Gv(e, t, r, i, n) {
  if (e)
    if (typeof e == "string") {
      if (t && t.__zrImageSrc === e || !r)
        return t;
      var a = cl.get(e), o = { hostEl: r, cb: i, cbPayload: n };
      return a ? (t = a.image, !xo(t) && a.pending.push(o)) : (t = Pi.loadImage(e, Rh, Rh), t.__zrImageSrc = e, cl.put(e, t.__cachedImgObj = {
        image: t,
        pending: [o]
      })), t;
    } else
      return e;
  else return t;
}
function Rh() {
  var e = this.__cachedImgObj;
  this.onload = this.onerror = this.__cachedImgObj = null;
  for (var t = 0; t < e.pending.length; t++) {
    var r = e.pending[t], i = r.cb;
    i && i(this, r.cbPayload), r.hostEl.dirty();
  }
  e.pending.length = 0;
}
function xo(e) {
  return e && e.width && e.height;
}
var as = /\{([a-zA-Z0-9_]+)\|([^}]*)\}/g;
function b1(e, t, r, i, n, a) {
  if (!r) {
    e.text = "", e.isTruncated = !1;
    return;
  }
  var o = (t + "").split(`
`);
  a = Wv(r, i, n, a);
  for (var s = !1, l = {}, u = 0, h = o.length; u < h; u++)
    Yv(l, o[u], a), o[u] = l.textLine, s = s || l.isTruncated;
  e.text = o.join(`
`), e.isTruncated = s;
}
function Wv(e, t, r, i) {
  i = i || {};
  var n = R({}, i);
  n.font = t, r = K(r, "..."), n.maxIterations = K(i.maxIterations, 2);
  var a = n.minChar = K(i.minChar, 0);
  n.cnCharWidth = Kt("国", t);
  var o = n.ascCharWidth = Kt("a", t);
  n.placeholder = K(i.placeholder, "");
  for (var s = e = Math.max(0, e - 1), l = 0; l < a && s >= o; l++)
    s -= o;
  var u = Kt(r, t);
  return u > s && (r = "", u = 0), s = e - u, n.ellipsis = r, n.ellipsisWidth = u, n.contentWidth = s, n.containerWidth = e, n;
}
function Yv(e, t, r) {
  var i = r.containerWidth, n = r.font, a = r.contentWidth;
  if (!i) {
    e.textLine = "", e.isTruncated = !1;
    return;
  }
  var o = Kt(t, n);
  if (o <= i) {
    e.textLine = t, e.isTruncated = !1;
    return;
  }
  for (var s = 0; ; s++) {
    if (o <= a || s >= r.maxIterations) {
      t += r.ellipsis;
      break;
    }
    var l = s === 0 ? T1(t, a, r.ascCharWidth, r.cnCharWidth) : o > 0 ? Math.floor(t.length * a / o) : 0;
    t = t.substr(0, l), o = Kt(t, n);
  }
  t === "" && (t = r.placeholder), e.textLine = t, e.isTruncated = !0;
}
function T1(e, t, r, i) {
  for (var n = 0, a = 0, o = e.length; a < o && n < t; a++) {
    var s = e.charCodeAt(a);
    n += 0 <= s && s <= 127 ? r : i;
  }
  return a;
}
function x1(e, t) {
  e != null && (e += "");
  var r = t.overflow, i = t.padding, n = t.font, a = r === "truncate", o = ru(n), s = K(t.lineHeight, o), l = !!t.backgroundColor, u = t.lineOverflow === "truncate", h = !1, f = t.width, v;
  f != null && (r === "break" || r === "breakAll") ? v = e ? Xv(e, t.font, f, r === "breakAll", 0).lines : [] : v = e ? e.split(`
`) : [];
  var c = v.length * s, d = K(t.height, c);
  if (c > d && u) {
    var _ = Math.floor(d / s);
    h = h || v.length > _, v = v.slice(0, _);
  }
  if (e && a && f != null)
    for (var p = Wv(f, n, t.ellipsis, {
      minChar: t.truncateMinChar,
      placeholder: t.placeholder
    }), g = {}, m = 0; m < v.length; m++)
      Yv(g, v[m], p), v[m] = g.textLine, h = h || g.isTruncated;
  for (var y = d, w = 0, m = 0; m < v.length; m++)
    w = Math.max(Kt(v[m], n), w);
  f == null && (f = w);
  var b = w;
  return i && (y += i[0] + i[2], b += i[1] + i[3], f += i[1] + i[3]), l && (b = f), {
    lines: v,
    height: d,
    outerWidth: b,
    outerHeight: y,
    lineHeight: s,
    calculatedLineHeight: o,
    contentWidth: w,
    contentHeight: c,
    width: f,
    isTruncated: h
  };
}
var C1 = /* @__PURE__ */ (function() {
  function e() {
  }
  return e;
})(), kh = /* @__PURE__ */ (function() {
  function e(t) {
    this.tokens = [], t && (this.tokens = t);
  }
  return e;
})(), D1 = /* @__PURE__ */ (function() {
  function e() {
    this.width = 0, this.height = 0, this.contentWidth = 0, this.contentHeight = 0, this.outerWidth = 0, this.outerHeight = 0, this.lines = [], this.isTruncated = !1;
  }
  return e;
})();
function M1(e, t) {
  var r = new D1();
  if (e != null && (e += ""), !e)
    return r;
  for (var i = t.width, n = t.height, a = t.overflow, o = (a === "break" || a === "breakAll") && i != null ? { width: i, accumWidth: 0, breakAll: a === "breakAll" } : null, s = as.lastIndex = 0, l; (l = as.exec(e)) != null; ) {
    var u = l.index;
    u > s && os(r, e.substring(s, u), t, o), os(r, l[2], t, o, l[1]), s = as.lastIndex;
  }
  s < e.length && os(r, e.substring(s, e.length), t, o);
  var h = [], f = 0, v = 0, c = t.padding, d = a === "truncate", _ = t.lineOverflow === "truncate", p = {};
  function g(q, Q, W) {
    q.width = Q, q.lineHeight = W, f += W, v = Math.max(v, Q);
  }
  t: for (var m = 0; m < r.lines.length; m++) {
    for (var y = r.lines[m], w = 0, b = 0, S = 0; S < y.tokens.length; S++) {
      var T = y.tokens[S], x = T.styleName && t.rich[T.styleName] || {}, C = T.textPadding = x.padding, M = C ? C[1] + C[3] : 0, A = T.font = x.font || t.font;
      T.contentHeight = ru(A);
      var L = K(x.height, T.contentHeight);
      if (T.innerHeight = L, C && (L += C[0] + C[2]), T.height = L, T.lineHeight = hn(x.lineHeight, t.lineHeight, L), T.align = x && x.align || t.align, T.verticalAlign = x && x.verticalAlign || "middle", _ && n != null && f + T.lineHeight > n) {
        var I = r.lines.length;
        S > 0 ? (y.tokens = y.tokens.slice(0, S), g(y, b, w), r.lines = r.lines.slice(0, m + 1)) : r.lines = r.lines.slice(0, m), r.isTruncated = r.isTruncated || r.lines.length < I;
        break t;
      }
      var P = x.width, k = P == null || P === "auto";
      if (typeof P == "string" && P.charAt(P.length - 1) === "%")
        T.percentWidth = P, h.push(T), T.contentWidth = Kt(T.text, A);
      else {
        if (k) {
          var E = x.backgroundColor, Y = E && E.image;
          Y && (Y = S1(Y), xo(Y) && (T.width = Math.max(T.width, Y.width * L / Y.height)));
        }
        var X = d && i != null ? i - b : null;
        X != null && X < T.width ? !k || X < M ? (T.text = "", T.width = T.contentWidth = 0) : (b1(p, T.text, X - M, A, t.ellipsis, { minChar: t.truncateMinChar }), T.text = p.text, r.isTruncated = r.isTruncated || p.isTruncated, T.width = T.contentWidth = Kt(T.text, A)) : T.contentWidth = Kt(T.text, A);
      }
      T.width += M, b += T.width, x && (w = Math.max(w, T.lineHeight));
    }
    g(y, b, w);
  }
  r.outerWidth = r.width = K(i, v), r.outerHeight = r.height = K(n, f), r.contentHeight = f, r.contentWidth = v, c && (r.outerWidth += c[1] + c[3], r.outerHeight += c[0] + c[2]);
  for (var m = 0; m < h.length; m++) {
    var T = h[m], B = T.percentWidth;
    T.width = parseInt(B, 10) / 100 * r.width;
  }
  return r;
}
function os(e, t, r, i, n) {
  var a = t === "", o = n && r.rich[n] || {}, s = e.lines, l = o.font || r.font, u = !1, h, f;
  if (i) {
    var v = o.padding, c = v ? v[1] + v[3] : 0;
    if (o.width != null && o.width !== "auto") {
      var d = Di(o.width, i.width) + c;
      s.length > 0 && d + i.accumWidth > i.width && (h = t.split(`
`), u = !0), i.accumWidth = d;
    } else {
      var _ = Xv(t, l, i.width, i.breakAll, i.accumWidth);
      i.accumWidth = _.accumWidth + c, f = _.linesWidths, h = _.lines;
    }
  } else
    h = t.split(`
`);
  for (var p = 0; p < h.length; p++) {
    var g = h[p], m = new C1();
    if (m.styleName = n, m.text = g, m.isLineHolder = !g && !a, typeof o.width == "number" ? m.width = o.width : m.width = f ? f[p] : Kt(g, l), !p && !u) {
      var y = (s[s.length - 1] || (s[0] = new kh())).tokens, w = y.length;
      w === 1 && y[0].isLineHolder ? y[0] = m : (g || !w || a) && y.push(m);
    } else
      s.push(new kh([m]));
  }
}
function A1(e) {
  var t = e.charCodeAt(0);
  return t >= 32 && t <= 591 || t >= 880 && t <= 4351 || t >= 4608 && t <= 5119 || t >= 7680 && t <= 8303;
}
var P1 = ur(",&?/;] ".split(""), function(e, t) {
  return e[t] = !0, e;
}, {});
function L1(e) {
  return A1(e) ? !!P1[e] : !0;
}
function Xv(e, t, r, i, n) {
  for (var a = [], o = [], s = "", l = "", u = 0, h = 0, f = 0; f < e.length; f++) {
    var v = e.charAt(f);
    if (v === `
`) {
      l && (s += l, h += u), a.push(s), o.push(h), s = "", l = "", u = 0, h = 0;
      continue;
    }
    var c = Kt(v, t), d = i ? !1 : !L1(v);
    if (a.length ? h + c > r : n + h + c > r) {
      h ? (s || l) && (d ? (s || (s = l, l = "", u = 0, h = u), a.push(s), o.push(h - u), l += v, u += c, s = "", h = u) : (l && (s += l, l = "", u = 0), a.push(s), o.push(h), s = v, h = c)) : d ? (a.push(l), o.push(u), l = v, u = c) : (a.push(v), o.push(c));
      continue;
    }
    h += c, d ? (l += v, u += c) : (l && (s += l, l = "", u = 0), s += v);
  }
  return !a.length && !s && (s = e, l = "", u = 0), l && (s += l), s && (a.push(s), o.push(h)), a.length === 1 && (h += n), {
    accumWidth: h,
    lines: a,
    linesWidths: o
  };
}
var vl = "__zr_style_" + Math.round(Math.random() * 10), zr = {
  shadowBlur: 0,
  shadowOffsetX: 0,
  shadowOffsetY: 0,
  shadowColor: "#000",
  opacity: 1,
  blend: "source-over"
}, Co = {
  style: {
    shadowBlur: !0,
    shadowOffsetX: !0,
    shadowOffsetY: !0,
    shadowColor: !0,
    opacity: !0
  }
};
zr[vl] = !0;
var Eh = ["z", "z2", "invisible"], I1 = ["invisible"], Wn = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype._init = function(r) {
    for (var i = dt(r), n = 0; n < i.length; n++) {
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
    if (this.ignore || this.invisible || this.style.opacity === 0 || this.culling && R1(this, r, i) || o && !o[0] && !o[3])
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
      r = this._paintRect || (this._paintRect = new it(0, 0, 0, 0)), i ? it.applyTransform(r, n, i) : r.copy(n), (o || s || l) && (r.width += o * 2 + Math.abs(s), r.height += o * 2 + Math.abs(l), r.x = Math.min(r.x, r.x + s - o), r.y = Math.min(r.y, r.y + l - o));
      var u = this.dirtyRectTolerance;
      r.isZero() || (r.x = Math.floor(r.x - u), r.y = Math.floor(r.y - u), r.width = Math.ceil(r.width + 1 + u * 2), r.height = Math.ceil(r.height + 1 + u * 2));
    }
    return r;
  }, t.prototype.setPrevPaintRect = function(r) {
    r ? (this._prevPaintRect = this._prevPaintRect || new it(0, 0, 0, 0), this._prevPaintRect.copy(r)) : this._prevPaintRect = null;
  }, t.prototype.getPrevPaintRect = function() {
    return this._prevPaintRect;
  }, t.prototype.animateStyle = function(r) {
    return this.animate("style", r);
  }, t.prototype.updateDuringAnimation = function(r) {
    r === "style" ? this.dirtyStyle() : this.markRedraw();
  }, t.prototype.attrKV = function(r, i) {
    r !== "style" ? e.prototype.attrKV.call(this, r, i) : this.style ? this.setStyle(i) : this.useStyle(i);
  }, t.prototype.setStyle = function(r, i) {
    return typeof r == "string" ? this.style[r] = i : R(this.style, r), this.dirtyStyle(), this;
  }, t.prototype.dirtyStyle = function(r) {
    r || this.markRedraw(), this.__dirty |= rn, this._rect && (this._rect = null);
  }, t.prototype.dirty = function() {
    this.dirtyStyle();
  }, t.prototype.styleChanged = function() {
    return !!(this.__dirty & rn);
  }, t.prototype.styleUpdated = function() {
    this.__dirty &= ~rn;
  }, t.prototype.createStyle = function(r) {
    return wo(zr, r);
  }, t.prototype.useStyle = function(r) {
    r[vl] || (r = this.createStyle(r)), this.__inHover ? this.__hoverStyle = r : this.style = r, this.dirtyStyle();
  }, t.prototype.isStyleObject = function(r) {
    return r[vl];
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var i = this._normalState;
    r.style && !i.style && (i.style = this._mergeStyle(this.createStyle(), this.style)), this._savePrimaryToNormal(r, i, Eh);
  }, t.prototype._applyStateObj = function(r, i, n, a, o, s) {
    e.prototype._applyStateObj.call(this, r, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.style ? o ? a ? u = i.style : (u = this._mergeStyle(this.createStyle(), n.style), this._mergeStyle(u, i.style)) : (u = this._mergeStyle(this.createStyle(), a ? this.style : n.style), this._mergeStyle(u, i.style)) : l && (u = n.style), u)
      if (o) {
        var h = this.style;
        if (this.style = this.createStyle(l ? {} : h), l)
          for (var f = dt(h), v = 0; v < f.length; v++) {
            var c = f[v];
            c in u && (u[c] = u[c], this.style[c] = h[c]);
          }
        for (var d = dt(u), v = 0; v < d.length; v++) {
          var c = d[v];
          this.style[c] = this.style[c];
        }
        this._transitionState(r, {
          style: u
        }, s, this.getAnimationStyleProps());
      } else
        this.useStyle(u);
    for (var _ = this.__inHover ? I1 : Eh, v = 0; v < _.length; v++) {
      var c = _[v];
      i && i[c] != null ? this[c] = i[c] : l && n[c] != null && (this[c] = n[c]);
    }
  }, t.prototype._mergeStates = function(r) {
    for (var i = e.prototype._mergeStates.call(this, r), n, a = 0; a < r.length; a++) {
      var o = r[a];
      o.style && (n = n || {}, this._mergeStyle(n, o.style));
    }
    return n && (i.style = n), i;
  }, t.prototype._mergeStyle = function(r, i) {
    return R(r, i), r;
  }, t.prototype.getAnimationStyleProps = function() {
    return Co;
  }, t.initDefaultProps = (function() {
    var r = t.prototype;
    r.type = "displayable", r.invisible = !1, r.z = 0, r.z2 = 0, r.zlevel = 0, r.culling = !1, r.cursor = "pointer", r.rectHover = !1, r.incremental = !1, r._rect = null, r.dirtyRectTolerance = 0, r.__dirty = qt | rn;
  })(), t;
})(So), ss = new it(0, 0, 0, 0), ls = new it(0, 0, 0, 0);
function R1(e, t, r) {
  return ss.copy(e.getBoundingRect()), e.transform && ss.applyTransform(e.transform), ls.width = t, ls.height = r, !ss.intersect(ls);
}
var ae = Math.min, oe = Math.max, us = Math.sin, hs = Math.cos, Sr = Math.PI * 2, ia = Li(), na = Li(), aa = Li();
function $h(e, t, r, i, n, a) {
  n[0] = ae(e, r), n[1] = ae(t, i), a[0] = oe(e, r), a[1] = oe(t, i);
}
var Oh = [], Bh = [];
function k1(e, t, r, i, n, a, o, s, l, u) {
  var h = Sv, f = Rt, v = h(e, r, n, o, Oh);
  l[0] = 1 / 0, l[1] = 1 / 0, u[0] = -1 / 0, u[1] = -1 / 0;
  for (var c = 0; c < v; c++) {
    var d = f(e, r, n, o, Oh[c]);
    l[0] = ae(d, l[0]), u[0] = oe(d, u[0]);
  }
  v = h(t, i, a, s, Bh);
  for (var c = 0; c < v; c++) {
    var _ = f(t, i, a, s, Bh[c]);
    l[1] = ae(_, l[1]), u[1] = oe(_, u[1]);
  }
  l[0] = ae(e, l[0]), u[0] = oe(e, u[0]), l[0] = ae(o, l[0]), u[0] = oe(o, u[0]), l[1] = ae(t, l[1]), u[1] = oe(t, u[1]), l[1] = ae(s, l[1]), u[1] = oe(s, u[1]);
}
function E1(e, t, r, i, n, a, o, s) {
  var l = bv, u = Bt, h = oe(ae(l(e, r, n), 1), 0), f = oe(ae(l(t, i, a), 1), 0), v = u(e, r, n, h), c = u(t, i, a, f);
  o[0] = ae(e, n, v), o[1] = ae(t, a, c), s[0] = oe(e, n, v), s[1] = oe(t, a, c);
}
function $1(e, t, r, i, n, a, o, s, l) {
  var u = ci, h = vi, f = Math.abs(n - a);
  if (f % Sr < 1e-4 && f > 1e-4) {
    s[0] = e - r, s[1] = t - i, l[0] = e + r, l[1] = t + i;
    return;
  }
  if (ia[0] = hs(n) * r + e, ia[1] = us(n) * i + t, na[0] = hs(a) * r + e, na[1] = us(a) * i + t, u(s, ia, na), h(l, ia, na), n = n % Sr, n < 0 && (n = n + Sr), a = a % Sr, a < 0 && (a = a + Sr), n > a && !o ? a += Sr : n < a && o && (n += Sr), o) {
    var v = a;
    a = n, n = v;
  }
  for (var c = 0; c < a; c += Math.PI / 2)
    c > n && (aa[0] = hs(c) * r + e, aa[1] = us(c) * i + t, u(s, aa, s), h(l, aa, l));
}
var et = {
  M: 1,
  L: 2,
  C: 3,
  Q: 4,
  A: 5,
  Z: 6,
  R: 7
}, br = [], Tr = [], ye = [], Xe = [], we = [], Se = [], fs = Math.min, cs = Math.max, xr = Math.cos, Cr = Math.sin, $e = Math.abs, dl = Math.PI, Je = dl * 2, vs = typeof Float32Array < "u", Vi = [];
function ds(e) {
  var t = Math.round(e / dl * 1e8) / 1e8;
  return t % 2 * dl;
}
function qv(e, t) {
  var r = ds(e[0]);
  r < 0 && (r += Je);
  var i = r - e[0], n = e[1];
  n += i, !t && n - r >= Je ? n = r + Je : t && r - n >= Je ? n = r - Je : !t && r > n ? n = r + (Je - ds(r - n)) : t && r < n && (n = r - (Je - ds(n - r))), e[0] = r, e[1] = n;
}
var Mi = (function() {
  function e(t) {
    this.dpr = 1, this._xi = 0, this._yi = 0, this._x0 = 0, this._y0 = 0, this._len = 0, t && (this._saveData = !1), this._saveData && (this.data = []);
  }
  return e.prototype.increaseVersion = function() {
    this._version++;
  }, e.prototype.getVersion = function() {
    return this._version;
  }, e.prototype.setScale = function(t, r, i) {
    i = i || 0, i > 0 && (this._ux = $e(i / Za / t) || 0, this._uy = $e(i / Za / r) || 0);
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
    return this._drawPendingPt(), this.addData(et.M, t, r), this._ctx && this._ctx.moveTo(t, r), this._x0 = t, this._y0 = r, this._xi = t, this._yi = r, this;
  }, e.prototype.lineTo = function(t, r) {
    var i = $e(t - this._xi), n = $e(r - this._yi), a = i > this._ux || n > this._uy;
    if (this.addData(et.L, t, r), this._ctx && a && this._ctx.lineTo(t, r), a)
      this._xi = t, this._yi = r, this._pendingPtDist = 0;
    else {
      var o = i * i + n * n;
      o > this._pendingPtDist && (this._pendingPtX = t, this._pendingPtY = r, this._pendingPtDist = o);
    }
    return this;
  }, e.prototype.bezierCurveTo = function(t, r, i, n, a, o) {
    return this._drawPendingPt(), this.addData(et.C, t, r, i, n, a, o), this._ctx && this._ctx.bezierCurveTo(t, r, i, n, a, o), this._xi = a, this._yi = o, this;
  }, e.prototype.quadraticCurveTo = function(t, r, i, n) {
    return this._drawPendingPt(), this.addData(et.Q, t, r, i, n), this._ctx && this._ctx.quadraticCurveTo(t, r, i, n), this._xi = i, this._yi = n, this;
  }, e.prototype.arc = function(t, r, i, n, a, o) {
    this._drawPendingPt(), Vi[0] = n, Vi[1] = a, qv(Vi, o), n = Vi[0], a = Vi[1];
    var s = a - n;
    return this.addData(et.A, t, r, i, i, n, s, 0, o ? 0 : 1), this._ctx && this._ctx.arc(t, r, i, n, a, o), this._xi = xr(a) * i + t, this._yi = Cr(a) * i + r, this;
  }, e.prototype.arcTo = function(t, r, i, n, a) {
    return this._drawPendingPt(), this._ctx && this._ctx.arcTo(t, r, i, n, a), this;
  }, e.prototype.rect = function(t, r, i, n) {
    return this._drawPendingPt(), this._ctx && this._ctx.rect(t, r, i, n), this.addData(et.R, t, r, i, n), this;
  }, e.prototype.closePath = function() {
    this._drawPendingPt(), this.addData(et.Z);
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
    !(this.data && this.data.length === r) && vs && (this.data = new Float32Array(r));
    for (var i = 0; i < r; i++)
      this.data[i] = t[i];
    this._len = r;
  }, e.prototype.appendPath = function(t) {
    t instanceof Array || (t = [t]);
    for (var r = t.length, i = 0, n = this._len, a = 0; a < r; a++)
      i += t[a].len();
    vs && this.data instanceof Float32Array && (this.data = new Float32Array(n + i));
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
      t instanceof Array && (t.length = this._len, vs && this._len > 11 && (this.data = new Float32Array(t)));
    }
  }, e.prototype.getBoundingRect = function() {
    ye[0] = ye[1] = we[0] = we[1] = Number.MAX_VALUE, Xe[0] = Xe[1] = Se[0] = Se[1] = -Number.MAX_VALUE;
    var t = this.data, r = 0, i = 0, n = 0, a = 0, o;
    for (o = 0; o < this._len; ) {
      var s = t[o++], l = o === 1;
      switch (l && (r = t[o], i = t[o + 1], n = r, a = i), s) {
        case et.M:
          r = n = t[o++], i = a = t[o++], we[0] = n, we[1] = a, Se[0] = n, Se[1] = a;
          break;
        case et.L:
          $h(r, i, t[o], t[o + 1], we, Se), r = t[o++], i = t[o++];
          break;
        case et.C:
          k1(r, i, t[o++], t[o++], t[o++], t[o++], t[o], t[o + 1], we, Se), r = t[o++], i = t[o++];
          break;
        case et.Q:
          E1(r, i, t[o++], t[o++], t[o], t[o + 1], we, Se), r = t[o++], i = t[o++];
          break;
        case et.A:
          var u = t[o++], h = t[o++], f = t[o++], v = t[o++], c = t[o++], d = t[o++] + c;
          o += 1;
          var _ = !t[o++];
          l && (n = xr(c) * f + u, a = Cr(c) * v + h), $1(u, h, f, v, c, d, _, we, Se), r = xr(d) * f + u, i = Cr(d) * v + h;
          break;
        case et.R:
          n = r = t[o++], a = i = t[o++];
          var p = t[o++], g = t[o++];
          $h(n, a, n + p, a + g, we, Se);
          break;
        case et.Z:
          r = n, i = a;
          break;
      }
      ci(ye, ye, we), vi(Xe, Xe, Se);
    }
    return o === 0 && (ye[0] = ye[1] = Xe[0] = Xe[1] = 0), new it(ye[0], ye[1], Xe[0] - ye[0], Xe[1] - ye[1]);
  }, e.prototype._calculateLength = function() {
    var t = this.data, r = this._len, i = this._ux, n = this._uy, a = 0, o = 0, s = 0, l = 0;
    this._pathSegLen || (this._pathSegLen = []);
    for (var u = this._pathSegLen, h = 0, f = 0, v = 0; v < r; ) {
      var c = t[v++], d = v === 1;
      d && (a = t[v], o = t[v + 1], s = a, l = o);
      var _ = -1;
      switch (c) {
        case et.M:
          a = s = t[v++], o = l = t[v++];
          break;
        case et.L: {
          var p = t[v++], g = t[v++], m = p - a, y = g - o;
          ($e(m) > i || $e(y) > n || v === r - 1) && (_ = Math.sqrt(m * m + y * y), a = p, o = g);
          break;
        }
        case et.C: {
          var w = t[v++], b = t[v++], p = t[v++], g = t[v++], S = t[v++], T = t[v++];
          _ = lw(a, o, w, b, p, g, S, T, 10), a = S, o = T;
          break;
        }
        case et.Q: {
          var w = t[v++], b = t[v++], p = t[v++], g = t[v++];
          _ = fw(a, o, w, b, p, g, 10), a = p, o = g;
          break;
        }
        case et.A:
          var x = t[v++], C = t[v++], M = t[v++], A = t[v++], L = t[v++], I = t[v++], P = I + L;
          v += 1, d && (s = xr(L) * M + x, l = Cr(L) * A + C), _ = cs(M, A) * fs(Je, Math.abs(I)), a = xr(P) * M + x, o = Cr(P) * A + C;
          break;
        case et.R: {
          s = a = t[v++], l = o = t[v++];
          var k = t[v++], E = t[v++];
          _ = k * 2 + E * 2;
          break;
        }
        case et.Z: {
          var m = s - a, y = l - o;
          _ = Math.sqrt(m * m + y * y), a = s, o = l;
          break;
        }
      }
      _ >= 0 && (u[f++] = _, h += _);
    }
    return this._pathLen = h, h;
  }, e.prototype.rebuildPath = function(t, r) {
    var i = this.data, n = this._ux, a = this._uy, o = this._len, s, l, u, h, f, v, c = r < 1, d, _, p = 0, g = 0, m, y = 0, w, b;
    if (!(c && (this._pathSegLen || this._calculateLength(), d = this._pathSegLen, _ = this._pathLen, m = r * _, !m)))
      t: for (var S = 0; S < o; ) {
        var T = i[S++], x = S === 1;
        switch (x && (u = i[S], h = i[S + 1], s = u, l = h), T !== et.L && y > 0 && (t.lineTo(w, b), y = 0), T) {
          case et.M:
            s = u = i[S++], l = h = i[S++], t.moveTo(u, h);
            break;
          case et.L: {
            f = i[S++], v = i[S++];
            var C = $e(f - u), M = $e(v - h);
            if (C > n || M > a) {
              if (c) {
                var A = d[g++];
                if (p + A > m) {
                  var L = (m - p) / A;
                  t.lineTo(u * (1 - L) + f * L, h * (1 - L) + v * L);
                  break t;
                }
                p += A;
              }
              t.lineTo(f, v), u = f, h = v, y = 0;
            } else {
              var I = C * C + M * M;
              I > y && (w = f, b = v, y = I);
            }
            break;
          }
          case et.C: {
            var P = i[S++], k = i[S++], E = i[S++], Y = i[S++], X = i[S++], B = i[S++];
            if (c) {
              var A = d[g++];
              if (p + A > m) {
                var L = (m - p) / A;
                Ya(u, P, E, X, L, br), Ya(h, k, Y, B, L, Tr), t.bezierCurveTo(br[1], Tr[1], br[2], Tr[2], br[3], Tr[3]);
                break t;
              }
              p += A;
            }
            t.bezierCurveTo(P, k, E, Y, X, B), u = X, h = B;
            break;
          }
          case et.Q: {
            var P = i[S++], k = i[S++], E = i[S++], Y = i[S++];
            if (c) {
              var A = d[g++];
              if (p + A > m) {
                var L = (m - p) / A;
                Xa(u, P, E, L, br), Xa(h, k, Y, L, Tr), t.quadraticCurveTo(br[1], Tr[1], br[2], Tr[2]);
                break t;
              }
              p += A;
            }
            t.quadraticCurveTo(P, k, E, Y), u = E, h = Y;
            break;
          }
          case et.A:
            var q = i[S++], Q = i[S++], W = i[S++], gt = i[S++], St = i[S++], Wt = i[S++], _e = i[S++], Qt = !i[S++], Yt = W > gt ? W : gt, Tt = $e(W - gt) > 1e-3, ht = St + Wt, z = !1;
            if (c) {
              var A = d[g++];
              p + A > m && (ht = St + Wt * (m - p) / A, z = !0), p += A;
            }
            if (Tt && t.ellipse ? t.ellipse(q, Q, W, gt, _e, St, ht, Qt) : t.arc(q, Q, Yt, St, ht, Qt), z)
              break t;
            x && (s = xr(St) * W + q, l = Cr(St) * gt + Q), u = xr(ht) * W + q, h = Cr(ht) * gt + Q;
            break;
          case et.R:
            s = u = i[S], l = h = i[S + 1], f = i[S++], v = i[S++];
            var Z = i[S++], me = i[S++];
            if (c) {
              var A = d[g++];
              if (p + A > m) {
                var bt = m - p;
                t.moveTo(f, v), t.lineTo(f + fs(bt, Z), v), bt -= Z, bt > 0 && t.lineTo(f + Z, v + fs(bt, me)), bt -= me, bt > 0 && t.lineTo(f + cs(Z - bt, 0), v + me), bt -= Z, bt > 0 && t.lineTo(f, v + cs(me - bt, 0));
                break t;
              }
              p += A;
            }
            t.rect(f, v, Z, me);
            break;
          case et.Z:
            if (c) {
              var A = d[g++];
              if (p + A > m) {
                var L = (m - p) / A;
                t.lineTo(u * (1 - L) + s * L, h * (1 - L) + l * L);
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
  }, e.CMD = et, e.initDefaultProps = (function() {
    var t = e.prototype;
    t._saveData = !0, t._ux = 0, t._uy = 0, t._pendingPtDist = 0, t._version = 0;
  })(), e;
})();
function ti(e, t, r, i, n, a, o) {
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
function O1(e, t, r, i, n, a, o, s, l, u, h) {
  if (l === 0)
    return !1;
  var f = l;
  if (h > t + f && h > i + f && h > a + f && h > s + f || h < t - f && h < i - f && h < a - f && h < s - f || u > e + f && u > r + f && u > n + f && u > o + f || u < e - f && u < r - f && u < n - f && u < o - f)
    return !1;
  var v = sw(e, t, r, i, n, a, o, s, u, h);
  return v <= f / 2;
}
function B1(e, t, r, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  if (l > t + u && l > i + u && l > a + u || l < t - u && l < i - u && l < a - u || s > e + u && s > r + u && s > n + u || s < e - u && s < r - u && s < n - u)
    return !1;
  var h = hw(e, t, r, i, n, a, s, l);
  return h <= u / 2;
}
var Nh = Math.PI * 2;
function oa(e) {
  return e %= Nh, e < 0 && (e += Nh), e;
}
var Ui = Math.PI * 2;
function N1(e, t, r, i, n, a, o, s, l) {
  if (o === 0)
    return !1;
  var u = o;
  s -= e, l -= t;
  var h = Math.sqrt(s * s + l * l);
  if (h - u > r || h + u < r)
    return !1;
  if (Math.abs(i - n) % Ui < 1e-4)
    return !0;
  if (a) {
    var f = i;
    i = oa(n), n = oa(f);
  } else
    i = oa(i), n = oa(n);
  i > n && (n += Ui);
  var v = Math.atan2(l, s);
  return v < 0 && (v += Ui), v >= i && v <= n || v + Ui >= i && v + Ui <= n;
}
function Dr(e, t, r, i, n, a) {
  if (a > t && a > i || a < t && a < i || i === t)
    return 0;
  var o = (a - t) / (i - t), s = i < t ? 1 : -1;
  (o === 1 || o === 0) && (s = i < t ? 0.5 : -0.5);
  var l = o * (r - e) + e;
  return l === n ? 1 / 0 : l > n ? s : 0;
}
var qe = Mi.CMD, Mr = Math.PI * 2, F1 = 1e-4;
function z1(e, t) {
  return Math.abs(e - t) < F1;
}
var Lt = [-1, -1, -1], ie = [-1, -1];
function H1() {
  var e = ie[0];
  ie[0] = ie[1], ie[1] = e;
}
function V1(e, t, r, i, n, a, o, s, l, u) {
  if (u > t && u > i && u > a && u > s || u < t && u < i && u < a && u < s)
    return 0;
  var h = wv(t, i, a, s, u, Lt);
  if (h === 0)
    return 0;
  for (var f = 0, v = -1, c = void 0, d = void 0, _ = 0; _ < h; _++) {
    var p = Lt[_], g = p === 0 || p === 1 ? 0.5 : 1, m = Rt(e, r, n, o, p);
    m < l || (v < 0 && (v = Sv(t, i, a, s, ie), ie[1] < ie[0] && v > 1 && H1(), c = Rt(t, i, a, s, ie[0]), v > 1 && (d = Rt(t, i, a, s, ie[1]))), v === 2 ? p < ie[0] ? f += c < t ? g : -g : p < ie[1] ? f += d < c ? g : -g : f += s < d ? g : -g : p < ie[0] ? f += c < t ? g : -g : f += s < c ? g : -g);
  }
  return f;
}
function U1(e, t, r, i, n, a, o, s) {
  if (s > t && s > i && s > a || s < t && s < i && s < a)
    return 0;
  var l = uw(t, i, a, s, Lt);
  if (l === 0)
    return 0;
  var u = bv(t, i, a);
  if (u >= 0 && u <= 1) {
    for (var h = 0, f = Bt(t, i, a, u), v = 0; v < l; v++) {
      var c = Lt[v] === 0 || Lt[v] === 1 ? 0.5 : 1, d = Bt(e, r, n, Lt[v]);
      d < o || (Lt[v] < u ? h += f < t ? c : -c : h += a < f ? c : -c);
    }
    return h;
  } else {
    var c = Lt[0] === 0 || Lt[0] === 1 ? 0.5 : 1, d = Bt(e, r, n, Lt[0]);
    return d < o ? 0 : a < t ? c : -c;
  }
}
function G1(e, t, r, i, n, a, o, s) {
  if (s -= t, s > r || s < -r)
    return 0;
  var l = Math.sqrt(r * r - s * s);
  Lt[0] = -l, Lt[1] = l;
  var u = Math.abs(i - n);
  if (u < 1e-4)
    return 0;
  if (u >= Mr - 1e-4) {
    i = 0, n = Mr;
    var h = a ? 1 : -1;
    return o >= Lt[0] + e && o <= Lt[1] + e ? h : 0;
  }
  if (i > n) {
    var f = i;
    i = n, n = f;
  }
  i < 0 && (i += Mr, n += Mr);
  for (var v = 0, c = 0; c < 2; c++) {
    var d = Lt[c];
    if (d + e > o) {
      var _ = Math.atan2(s, d), h = a ? 1 : -1;
      _ < 0 && (_ = Mr + _), (_ >= i && _ <= n || _ + Mr >= i && _ + Mr <= n) && (_ > Math.PI / 2 && _ < Math.PI * 1.5 && (h = -h), v += h);
    }
  }
  return v;
}
function Zv(e, t, r, i, n) {
  for (var a = e.data, o = e.len(), s = 0, l = 0, u = 0, h = 0, f = 0, v, c, d = 0; d < o; ) {
    var _ = a[d++], p = d === 1;
    switch (_ === qe.M && d > 1 && (r || (s += Dr(l, u, h, f, i, n))), p && (l = a[d], u = a[d + 1], h = l, f = u), _) {
      case qe.M:
        h = a[d++], f = a[d++], l = h, u = f;
        break;
      case qe.L:
        if (r) {
          if (ti(l, u, a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += Dr(l, u, a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case qe.C:
        if (r) {
          if (O1(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += V1(l, u, a[d++], a[d++], a[d++], a[d++], a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case qe.Q:
        if (r) {
          if (B1(l, u, a[d++], a[d++], a[d], a[d + 1], t, i, n))
            return !0;
        } else
          s += U1(l, u, a[d++], a[d++], a[d], a[d + 1], i, n) || 0;
        l = a[d++], u = a[d++];
        break;
      case qe.A:
        var g = a[d++], m = a[d++], y = a[d++], w = a[d++], b = a[d++], S = a[d++];
        d += 1;
        var T = !!(1 - a[d++]);
        v = Math.cos(b) * y + g, c = Math.sin(b) * w + m, p ? (h = v, f = c) : s += Dr(l, u, v, c, i, n);
        var x = (i - g) * w / y + g;
        if (r) {
          if (N1(g, m, w, b, b + S, T, t, x, n))
            return !0;
        } else
          s += G1(g, m, w, b, b + S, T, x, n);
        l = Math.cos(b + S) * y + g, u = Math.sin(b + S) * w + m;
        break;
      case qe.R:
        h = l = a[d++], f = u = a[d++];
        var C = a[d++], M = a[d++];
        if (v = h + C, c = f + M, r) {
          if (ti(h, f, v, f, t, i, n) || ti(v, f, v, c, t, i, n) || ti(v, c, h, c, t, i, n) || ti(h, c, h, f, t, i, n))
            return !0;
        } else
          s += Dr(v, f, v, c, i, n), s += Dr(h, c, h, f, i, n);
        break;
      case qe.Z:
        if (r) {
          if (ti(l, u, h, f, t, i, n))
            return !0;
        } else
          s += Dr(l, u, h, f, i, n);
        l = h, u = f;
        break;
    }
  }
  return !r && !z1(u, f) && (s += Dr(l, u, h, f, i, n) || 0), s !== 0;
}
function W1(e, t, r) {
  return Zv(e, 0, !1, t, r);
}
function Y1(e, t, r, i) {
  return Zv(e, t, !0, r, i);
}
var Kv = ut({
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
}, zr), X1 = {
  style: ut({
    fill: !0,
    stroke: !0,
    strokePercent: !0,
    fillOpacity: !0,
    strokeOpacity: !0,
    lineDashOffset: !0,
    lineWidth: !0,
    miterLimit: !0
  }, Co.style)
}, ps = An.concat([
  "invisible",
  "culling",
  "z",
  "z2",
  "zlevel",
  "parent"
]), at = (function(e) {
  G(t, e);
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
      for (var s = 0; s < ps.length; ++s)
        n[ps[s]] = this[ps[s]];
      n.__dirty |= qt;
    } else this._decalEl && (this._decalEl = null);
  }, t.prototype.getDecalElement = function() {
    return this._decalEl;
  }, t.prototype._init = function(r) {
    var i = dt(r);
    this.shape = this.getDefaultShape();
    var n = this.getDefaultStyle();
    n && this.useStyle(n);
    for (var a = 0; a < i.length; a++) {
      var o = i[a], s = r[o];
      o === "style" ? this.style ? R(this.style, s) : this.useStyle(s) : o === "shape" ? R(this.shape, s) : e.prototype.attrKV.call(this, o, s);
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
      if (V(r)) {
        var i = qa(r, 0);
        return i > 0.5 ? ul : i > 0.2 ? Lw : hl;
      } else if (r)
        return hl;
    }
    return ul;
  }, t.prototype.getInsideTextStroke = function(r) {
    var i = this.style.fill;
    if (V(i)) {
      var n = this.__zr, a = !!(n && n.isDarkMode()), o = qa(r, 0) < ll;
      if (a === o)
        return i;
    }
  }, t.prototype.buildPath = function(r, i, n) {
  }, t.prototype.pathUpdated = function() {
    this.__dirty &= ~hi;
  }, t.prototype.getUpdatedPathProxy = function(r) {
    return !this.path && this.createPathProxy(), this.path.beginPath(), this.buildPath(this.path, this.shape, r), this.path;
  }, t.prototype.createPathProxy = function() {
    this.path = new Mi(!1);
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
      (a || this.__dirty & hi) && (o.beginPath(), this.buildPath(o, this.shape, !1), this.pathUpdated()), r = o.getBoundingRect();
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
        if (u > 1e-10 && (this.hasFill() || (l = Math.max(l, this.strokeContainThreshold)), Y1(s, l / u, r, i)))
          return !0;
      }
      if (this.hasFill())
        return W1(s, r, i);
    }
    return !1;
  }, t.prototype.dirtyShape = function() {
    this.__dirty |= hi, this._rect && (this._rect = null), this._decalEl && this._decalEl.dirtyShape(), this.markRedraw();
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
    return n || (n = this.shape = {}), typeof r == "string" ? n[r] = i : R(n, r), this.dirtyShape(), this;
  }, t.prototype.shapeChanged = function() {
    return !!(this.__dirty & hi);
  }, t.prototype.createStyle = function(r) {
    return wo(Kv, r);
  }, t.prototype._innerSaveToNormal = function(r) {
    e.prototype._innerSaveToNormal.call(this, r);
    var i = this._normalState;
    r.shape && !i.shape && (i.shape = R({}, this.shape));
  }, t.prototype._applyStateObj = function(r, i, n, a, o, s) {
    e.prototype._applyStateObj.call(this, r, i, n, a, o, s);
    var l = !(i && a), u;
    if (i && i.shape ? o ? a ? u = i.shape : (u = R({}, n.shape), R(u, i.shape)) : (u = R({}, a ? this.shape : n.shape), R(u, i.shape)) : l && (u = n.shape), u)
      if (o) {
        this.shape = R({}, this.shape);
        for (var h = {}, f = dt(u), v = 0; v < f.length; v++) {
          var c = f[v];
          typeof u[c] == "object" ? this.shape[c] = u[c] : h[c] = u[c];
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
    return X1;
  }, t.prototype.isZeroArea = function() {
    return !1;
  }, t.extend = function(r) {
    var i = (function(a) {
      G(o, a);
      function o(s) {
        var l = a.call(this, s) || this;
        return r.init && r.init.call(l, s), l;
      }
      return o.prototype.getDefaultStyle = function() {
        return j(r.style);
      }, o.prototype.getDefaultShape = function() {
        return j(r.shape);
      }, o;
    })(t);
    for (var n in r)
      typeof r[n] == "function" && (i.prototype[n] = r[n]);
    return i;
  }, t.initDefaultProps = (function() {
    var r = t.prototype;
    r.type = "path", r.strokeContainThreshold = 5, r.segmentIgnoreThreshold = 0, r.subPixelOptimize = !1, r.autoBatch = !1, r.__dirty = qt | rn | hi;
  })(), t;
})(Wn), q1 = ut({
  strokeFirst: !0,
  font: Gr,
  x: 0,
  y: 0,
  textAlign: "left",
  textBaseline: "top",
  miterLimit: 2
}, Kv), ja = (function(e) {
  G(t, e);
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
    return wo(q1, r);
  }, t.prototype.setBoundingRect = function(r) {
    this._rect = r;
  }, t.prototype.getBoundingRect = function() {
    var r = this.style;
    if (!this._rect) {
      var i = r.text;
      i != null ? i += "" : i = "";
      var n = Lv(i, r.font, r.textAlign, r.textBaseline);
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
})(Wn);
ja.prototype.type = "tspan";
var Z1 = ut({
  x: 0,
  y: 0
}, zr), K1 = {
  style: ut({
    x: !0,
    y: !0,
    width: !0,
    height: !0,
    sx: !0,
    sy: !0,
    sWidth: !0,
    sHeight: !0
  }, Co.style)
};
function Q1(e) {
  return !!(e && typeof e != "string" && e.width && e.height);
}
var Xr = (function(e) {
  G(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.createStyle = function(r) {
    return wo(Z1, r);
  }, t.prototype._getSize = function(r) {
    var i = this.style, n = i[r];
    if (n != null)
      return n;
    var a = Q1(i.image) ? i.image : this.__image;
    if (!a)
      return 0;
    var o = r === "width" ? "height" : "width", s = i[o];
    return s == null ? a[r] : a[r] / a[o] * s;
  }, t.prototype.getWidth = function() {
    return this._getSize("width");
  }, t.prototype.getHeight = function() {
    return this._getSize("height");
  }, t.prototype.getAnimationStyleProps = function() {
    return K1;
  }, t.prototype.getBoundingRect = function() {
    var r = this.style;
    return this._rect || (this._rect = new it(r.x || 0, r.y || 0, this.getWidth(), this.getHeight())), this._rect;
  }, t;
})(Wn);
Xr.prototype.type = "image";
function j1(e, t) {
  var r = t.x, i = t.y, n = t.width, a = t.height, o = t.r, s, l, u, h;
  n < 0 && (r = r + n, n = -n), a < 0 && (i = i + a, a = -a), typeof o == "number" ? s = l = u = h = o : o instanceof Array ? o.length === 1 ? s = l = u = h = o[0] : o.length === 2 ? (s = u = o[0], l = h = o[1]) : o.length === 3 ? (s = o[0], l = h = o[1], u = o[2]) : (s = o[0], l = o[1], u = o[2], h = o[3]) : s = l = u = h = 0;
  var f;
  s + l > n && (f = s + l, s *= n / f, l *= n / f), u + h > n && (f = u + h, u *= n / f, h *= n / f), l + u > a && (f = l + u, l *= a / f, u *= a / f), s + h > a && (f = s + h, s *= a / f, h *= a / f), e.moveTo(r + s, i), e.lineTo(r + n - l, i), l !== 0 && e.arc(r + n - l, i + l, l, -Math.PI / 2, 0), e.lineTo(r + n, i + a - u), u !== 0 && e.arc(r + n - u, i + a - u, u, 0, Math.PI / 2), e.lineTo(r + h, i + a), h !== 0 && e.arc(r + h, i + a - h, h, Math.PI / 2, Math.PI), e.lineTo(r, i + s), s !== 0 && e.arc(r + s, i + s, s, Math.PI, Math.PI * 1.5);
}
var pi = Math.round;
function Qv(e, t, r) {
  if (t) {
    var i = t.x1, n = t.x2, a = t.y1, o = t.y2;
    e.x1 = i, e.x2 = n, e.y1 = a, e.y2 = o;
    var s = r && r.lineWidth;
    return s && (pi(i * 2) === pi(n * 2) && (e.x1 = e.x2 = Br(i, s, !0)), pi(a * 2) === pi(o * 2) && (e.y1 = e.y2 = Br(a, s, !0))), e;
  }
}
function jv(e, t, r) {
  if (t) {
    var i = t.x, n = t.y, a = t.width, o = t.height;
    e.x = i, e.y = n, e.width = a, e.height = o;
    var s = r && r.lineWidth;
    return s && (e.x = Br(i, s, !0), e.y = Br(n, s, !0), e.width = Math.max(Br(i + a, s, !1) - e.x, a === 0 ? 0 : 1), e.height = Math.max(Br(n + o, s, !1) - e.y, o === 0 ? 0 : 1)), e;
  }
}
function Br(e, t, r) {
  if (!t)
    return e;
  var i = pi(e * 2);
  return (i + pi(t)) % 2 === 0 ? i / 2 : (i + (r ? 1 : -1)) / 2;
}
var J1 = /* @__PURE__ */ (function() {
  function e() {
    this.x = 0, this.y = 0, this.width = 0, this.height = 0;
  }
  return e;
})(), tS = {}, ve = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new J1();
  }, t.prototype.buildPath = function(r, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = jv(tS, i, this.style);
      n = l.x, a = l.y, o = l.width, s = l.height, l.r = i.r, i = l;
    } else
      n = i.x, a = i.y, o = i.width, s = i.height;
    i.r ? j1(r, i) : r.rect(n, a, o, s);
  }, t.prototype.isZeroArea = function() {
    return !this.shape.width || !this.shape.height;
  }, t;
})(at);
ve.prototype.type = "rect";
var Fh = {
  fill: "#000"
}, zh = 2, eS = {
  style: ut({
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
  }, Co.style)
}, de = (function(e) {
  G(t, e);
  function t(r) {
    var i = e.call(this) || this;
    return i.type = "text", i._children = [], i._defaultStyle = Fh, i.attr(r), i;
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
    this._childCursor = 0, oS(this.style), this.style.rich ? this._updateRichTexts() : this._updatePlainTexts(), this._children.length = this._childCursor, this.styleUpdated();
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
      for (var r = new it(0, 0, 0, 0), i = this._children, n = [], a = null, o = 0; o < i.length; o++) {
        var s = i[o], l = s.getBoundingRect(), u = s.getLocalTransform(n);
        u ? (r.copy(l), r.applyTransform(u), a = a || r.clone(), a.union(r)) : (a = a || l.clone(), a.union(l));
      }
      this._rect = a || r;
    }
    return this._rect;
  }, t.prototype.setDefaultTextStyle = function(r) {
    this._defaultStyle = r || Fh;
  }, t.prototype.setTextContent = function(r) {
  }, t.prototype._mergeStyle = function(r, i) {
    if (!i)
      return r;
    var n = i.rich, a = r.rich || n && {};
    return R(r, i), n && a ? (this._mergeRich(a, n), r.rich = a) : a && (r.rich = a), r;
  }, t.prototype._mergeRich = function(r, i) {
    for (var n = dt(i), a = 0; a < n.length; a++) {
      var o = n[a];
      r[o] = r[o] || {}, R(r[o], i[o]);
    }
  }, t.prototype.getAnimationStyleProps = function() {
    return eS;
  }, t.prototype._getOrCreateChild = function(r) {
    var i = this._children[this._childCursor];
    return (!i || !(i instanceof r)) && (i = new r()), this._children[this._childCursor++] = i, i.__zr = this.__zr, i.parent = this, i;
  }, t.prototype._updatePlainTexts = function() {
    var r = this.style, i = r.font || Gr, n = r.padding, a = Xh(r), o = x1(a, r), s = gs(r), l = !!r.backgroundColor, u = o.outerHeight, h = o.outerWidth, f = o.contentWidth, v = o.lines, c = o.lineHeight, d = this._defaultStyle;
    this.isTruncated = !!o.isTruncated;
    var _ = r.x || 0, p = r.y || 0, g = r.align || d.align || "left", m = r.verticalAlign || d.verticalAlign || "top", y = _, w = fi(p, o.contentHeight, m);
    if (s || n) {
      var b = an(_, h, g), S = fi(p, u, m);
      s && this._renderBackground(r, r, b, S, h, u);
    }
    w += c / 2, n && (y = Yh(_, g, n), m === "top" ? w += n[0] : m === "bottom" && (w -= n[2]));
    for (var T = 0, x = !1, C = Wh("fill" in r ? r.fill : (x = !0, d.fill)), M = Gh("stroke" in r ? r.stroke : !l && (!d.autoStroke || x) ? (T = zh, d.stroke) : null), A = r.textShadowBlur > 0, L = r.width != null && (r.overflow === "truncate" || r.overflow === "break" || r.overflow === "breakAll"), I = o.calculatedLineHeight, P = 0; P < v.length; P++) {
      var k = this._getOrCreateChild(ja), E = k.createStyle();
      k.useStyle(E), E.text = v[P], E.x = y, E.y = w, E.textAlign = g, E.textBaseline = "middle", E.opacity = r.opacity, E.strokeFirst = !0, A && (E.shadowBlur = r.textShadowBlur || 0, E.shadowColor = r.textShadowColor || "transparent", E.shadowOffsetX = r.textShadowOffsetX || 0, E.shadowOffsetY = r.textShadowOffsetY || 0), E.stroke = M, E.fill = C, M && (E.lineWidth = r.lineWidth || T, E.lineDash = r.lineDash, E.lineDashOffset = r.lineDashOffset || 0), E.font = i, Vh(E, r), w += c, L && k.setBoundingRect(new it(an(E.x, f, E.textAlign), fi(E.y, I, E.textBaseline), f, I));
    }
  }, t.prototype._updateRichTexts = function() {
    var r = this.style, i = Xh(r), n = M1(i, r), a = n.width, o = n.outerWidth, s = n.outerHeight, l = r.padding, u = r.x || 0, h = r.y || 0, f = this._defaultStyle, v = r.align || f.align, c = r.verticalAlign || f.verticalAlign;
    this.isTruncated = !!n.isTruncated;
    var d = an(u, o, v), _ = fi(h, s, c), p = d, g = _;
    l && (p += l[3], g += l[0]);
    var m = p + a;
    gs(r) && this._renderBackground(r, r, d, _, o, s);
    for (var y = !!r.backgroundColor, w = 0; w < n.lines.length; w++) {
      for (var b = n.lines[w], S = b.tokens, T = S.length, x = b.lineHeight, C = b.width, M = 0, A = p, L = m, I = T - 1, P = void 0; M < T && (P = S[M], !P.align || P.align === "left"); )
        this._placeToken(P, r, x, g, A, "left", y), C -= P.width, A += P.width, M++;
      for (; I >= 0 && (P = S[I], P.align === "right"); )
        this._placeToken(P, r, x, g, L, "right", y), C -= P.width, L -= P.width, I--;
      for (A += (a - (A - p) - (m - L) - C) / 2; M <= I; )
        P = S[M], this._placeToken(P, r, x, g, A + P.width / 2, "center", y), A += P.width, M++;
      g += x;
    }
  }, t.prototype._placeToken = function(r, i, n, a, o, s, l) {
    var u = i.rich[r.styleName] || {};
    u.text = r.text;
    var h = r.verticalAlign, f = a + n / 2;
    h === "top" ? f = a + r.height / 2 : h === "bottom" && (f = a + n - r.height / 2);
    var v = !r.isLineHolder && gs(u);
    v && this._renderBackground(u, i, s === "right" ? o - r.width : s === "center" ? o - r.width / 2 : o, f - r.height / 2, r.width, r.height);
    var c = !!u.backgroundColor, d = r.textPadding;
    d && (o = Yh(o, s, d), f -= r.height / 2 - d[0] - r.innerHeight / 2);
    var _ = this._getOrCreateChild(ja), p = _.createStyle();
    _.useStyle(p);
    var g = this._defaultStyle, m = !1, y = 0, w = Wh("fill" in u ? u.fill : "fill" in i ? i.fill : (m = !0, g.fill)), b = Gh("stroke" in u ? u.stroke : "stroke" in i ? i.stroke : !c && !l && (!g.autoStroke || m) ? (y = zh, g.stroke) : null), S = u.textShadowBlur > 0 || i.textShadowBlur > 0;
    p.text = r.text, p.x = o, p.y = f, S && (p.shadowBlur = u.textShadowBlur || i.textShadowBlur || 0, p.shadowColor = u.textShadowColor || i.textShadowColor || "transparent", p.shadowOffsetX = u.textShadowOffsetX || i.textShadowOffsetX || 0, p.shadowOffsetY = u.textShadowOffsetY || i.textShadowOffsetY || 0), p.textAlign = s, p.textBaseline = "middle", p.font = r.font || Gr, p.opacity = hn(u.opacity, i.opacity, 1), Vh(p, u), b && (p.lineWidth = hn(u.lineWidth, i.lineWidth, y), p.lineDash = K(u.lineDash, i.lineDash), p.lineDashOffset = i.lineDashOffset || 0, p.stroke = b), w && (p.fill = w);
    var T = r.contentWidth, x = r.contentHeight;
    _.setBoundingRect(new it(an(p.x, T, p.textAlign), fi(p.y, x, p.textBaseline), T, x));
  }, t.prototype._renderBackground = function(r, i, n, a, o, s) {
    var l = r.backgroundColor, u = r.borderWidth, h = r.borderColor, f = l && l.image, v = l && !f, c = r.borderRadius, d = this, _, p;
    if (v || r.lineHeight || u && h) {
      _ = this._getOrCreateChild(ve), _.useStyle(_.createStyle()), _.style.fill = null;
      var g = _.shape;
      g.x = n, g.y = a, g.width = o, g.height = s, g.r = c, _.dirtyShape();
    }
    if (v) {
      var m = _.style;
      m.fill = l || null, m.fillOpacity = K(r.fillOpacity, 1);
    } else if (f) {
      p = this._getOrCreateChild(Xr), p.onload = function() {
        d.dirtyStyle();
      };
      var y = p.style;
      y.image = l.image, y.x = n, y.y = a, y.width = o, y.height = s;
    }
    if (u && h) {
      var m = _.style;
      m.lineWidth = u, m.stroke = h, m.strokeOpacity = K(r.strokeOpacity, 1), m.lineDash = r.borderDash, m.lineDashOffset = r.borderDashOffset || 0, _.strokeContainThreshold = 0, _.hasFill() && _.hasStroke() && (m.strokeFirst = !0, m.lineWidth *= 2);
    }
    var w = (_ || p).style;
    w.shadowBlur = r.shadowBlur || 0, w.shadowColor = r.shadowColor || "transparent", w.shadowOffsetX = r.shadowOffsetX || 0, w.shadowOffsetY = r.shadowOffsetY || 0, w.opacity = hn(r.opacity, i.opacity, 1);
  }, t.makeFont = function(r) {
    var i = "";
    return aS(r) && (i = [
      r.fontStyle,
      r.fontWeight,
      nS(r.fontSize),
      r.fontFamily || "sans-serif"
    ].join(" ")), i && Ce(i) || r.textFont || r.font;
  }, t;
})(Wn), rS = { left: !0, right: 1, center: 1 }, iS = { top: 1, bottom: 1, middle: 1 }, Hh = ["fontStyle", "fontWeight", "fontSize", "fontFamily"];
function nS(e) {
  return typeof e == "string" && (e.indexOf("px") !== -1 || e.indexOf("rem") !== -1 || e.indexOf("em") !== -1) ? e : isNaN(+e) ? Yl + "px" : e + "px";
}
function Vh(e, t) {
  for (var r = 0; r < Hh.length; r++) {
    var i = Hh[r], n = t[i];
    n != null && (e[i] = n);
  }
}
function aS(e) {
  return e.fontSize != null || e.fontFamily || e.fontWeight;
}
function oS(e) {
  return Uh(e), D(e.rich, Uh), e;
}
function Uh(e) {
  if (e) {
    e.font = de.makeFont(e);
    var t = e.align;
    t === "middle" && (t = "center"), e.align = t == null || rS[t] ? t : "left";
    var r = e.verticalAlign;
    r === "center" && (r = "middle"), e.verticalAlign = r == null || iS[r] ? r : "top";
    var i = e.padding;
    i && (e.padding = sv(e.padding));
  }
}
function Gh(e, t) {
  return e == null || t <= 0 || e === "transparent" || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function Wh(e) {
  return e == null || e === "none" ? null : e.image || e.colorStops ? "#000" : e;
}
function Yh(e, t, r) {
  return t === "right" ? e - r[1] : t === "center" ? e + r[3] / 2 - r[1] / 2 : e + r[3];
}
function Xh(e) {
  var t = e.text;
  return t != null && (t += ""), t;
}
function gs(e) {
  return !!(e.backgroundColor || e.lineHeight || e.borderWidth && e.borderColor);
}
var ct = wt(), sS = function(e, t, r, i) {
  if (i) {
    var n = ct(i);
    n.dataIndex = r, n.dataType = t, n.seriesIndex = e, n.ssrType = "chart", i.type === "group" && i.traverse(function(a) {
      var o = ct(a);
      o.seriesIndex = e, o.dataIndex = r, o.dataType = t, o.ssrType = "chart";
    });
  }
}, qh = 1, Zh = {}, Jv = wt(), su = wt(), td = 0, lu = 1, uu = 2, Pe = ["emphasis", "blur", "select"], Ja = ["normal", "emphasis", "blur", "select"], lS = 10, uS = 9, Hr = "highlight", ka = "downplay", gn = "select", Ea = "unselect", _n = "toggleSelect";
function ei(e) {
  return e != null && e !== "none";
}
function Do(e, t, r) {
  e.onHoverStateChange && (e.hoverState || 0) !== r && e.onHoverStateChange(t), e.hoverState = r;
}
function ed(e) {
  Do(e, "emphasis", uu);
}
function rd(e) {
  e.hoverState === uu && Do(e, "normal", td);
}
function hu(e) {
  Do(e, "blur", lu);
}
function id(e) {
  e.hoverState === lu && Do(e, "normal", td);
}
function hS(e) {
  e.selected = !0;
}
function fS(e) {
  e.selected = !1;
}
function Kh(e, t, r) {
  t(e, r);
}
function We(e, t, r) {
  Kh(e, t, r), e.isGroup && e.traverse(function(i) {
    Kh(i, t, r);
  });
}
function cS(e, t, r, i) {
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
function vS(e, t, r, i) {
  var n = r && ot(r, "select") >= 0, a = !1;
  if (e instanceof at) {
    var o = Jv(e), s = n && o.selectFill || o.normalFill, l = n && o.selectStroke || o.normalStroke;
    if (ei(s) || ei(l)) {
      i = i || {};
      var u = i.style || {};
      u.fill === "inherit" ? (a = !0, i = R({}, i), u = R({}, u), u.fill = s) : !ei(u.fill) && ei(s) ? (a = !0, i = R({}, i), u = R({}, u), u.fill = gh(s)) : !ei(u.stroke) && ei(l) && (a || (i = R({}, i), u = R({}, u)), u.stroke = gh(l)), i.style = u;
    }
  }
  if (i && i.z2 == null) {
    a || (i = R({}, i));
    var h = e.z2EmphasisLift;
    i.z2 = e.z2 + (h ?? lS);
  }
  return i;
}
function dS(e, t, r) {
  if (r && r.z2 == null) {
    r = R({}, r);
    var i = e.z2SelectLift;
    r.z2 = e.z2 + (i ?? uS);
  }
  return r;
}
function pS(e, t, r) {
  var i = ot(e.currentStates, t) >= 0, n = e.style.opacity, a = i ? null : cS(e, ["opacity"], t, {
    opacity: 1
  });
  r = r || {};
  var o = r.style || {};
  return o.opacity == null && (r = R({}, r), o = R({
    // Already being applied 'emphasis'. DON'T mul opacity multiple times.
    opacity: i ? n : a.opacity * 0.1
  }, o), r.style = o), r;
}
function _s(e, t) {
  var r = this.states[e];
  if (this.style) {
    if (e === "emphasis")
      return vS(this, e, t, r);
    if (e === "blur")
      return pS(this, e, r);
    if (e === "select")
      return dS(this, e, r);
  }
  return r;
}
function gS(e) {
  e.stateProxy = _s;
  var t = e.getTextContent(), r = e.getTextGuideLine();
  t && (t.stateProxy = _s), r && (r.stateProxy = _s);
}
function Qh(e, t) {
  !sd(e, t) && !e.__highByOuter && We(e, ed);
}
function jh(e, t) {
  !sd(e, t) && !e.__highByOuter && We(e, rd);
}
function pl(e, t) {
  e.__highByOuter |= 1 << (t || 0), We(e, ed);
}
function gl(e, t) {
  !(e.__highByOuter &= ~(1 << (t || 0))) && We(e, rd);
}
function _S(e) {
  We(e, hu);
}
function nd(e) {
  We(e, id);
}
function ad(e) {
  We(e, hS);
}
function od(e) {
  We(e, fS);
}
function sd(e, t) {
  return e.__highDownSilentOnTouch && t.zrByTouch;
}
function ld(e) {
  var t = e.getModel(), r = [], i = [];
  t.eachComponent(function(n, a) {
    var o = su(a), s = n === "series", l = s ? e.getViewOfSeriesModel(a) : e.getViewOfComponentModel(a);
    !s && i.push(l), o.isBlured && (l.group.traverse(function(u) {
      id(u);
    }), s && r.push(a)), o.isBlured = !1;
  }), D(i, function(n) {
    n && n.toggleBlurSeries && n.toggleBlurSeries(r, !1, t);
  });
}
function _l(e, t, r, i) {
  var n = i.getModel();
  r = r || "coordinateSystem";
  function a(u, h) {
    for (var f = 0; f < h.length; f++) {
      var v = u.getItemGraphicEl(h[f]);
      v && nd(v);
    }
  }
  if (e != null && !(!t || t === "none")) {
    var o = n.getSeriesByIndex(e), s = o.coordinateSystem;
    s && s.master && (s = s.master);
    var l = [];
    n.eachSeries(function(u) {
      var h = o === u, f = u.coordinateSystem;
      f && f.master && (f = f.master);
      var v = f && s ? f === s : h;
      if (!// Not blur other series if blurScope series
      (r === "series" && !h || r === "coordinateSystem" && !v || t === "series" && h)) {
        var c = i.getViewOfSeriesModel(u);
        if (c.group.traverse(function(p) {
          p.__highByOuter && h && t === "self" || hu(p);
        }), Vt(t))
          a(u.getData(), t);
        else if (F(t))
          for (var d = dt(t), _ = 0; _ < d.length; _++)
            a(u.getData(d[_]), t[d[_]]);
        l.push(u), su(u).isBlured = !0;
      }
    }), n.eachComponent(function(u, h) {
      if (u !== "series") {
        var f = i.getViewOfComponentModel(h);
        f && f.toggleBlurSeries && f.toggleBlurSeries(l, !0, n);
      }
    });
  }
}
function ml(e, t, r) {
  if (!(e == null || t == null)) {
    var i = r.getModel().getComponent(e, t);
    if (i) {
      su(i).isBlured = !0;
      var n = r.getViewOfComponentModel(i);
      !n || !n.focusBlurEnabled || n.group.traverse(function(a) {
        hu(a);
      });
    }
  }
}
function mS(e, t, r) {
  var i = e.seriesIndex, n = e.getData(t.dataType);
  if (n) {
    var a = Un(n, t);
    a = ($(a) ? a[0] : a) || 0;
    var o = n.getItemGraphicEl(a);
    if (!o)
      for (var s = n.count(), l = 0; !o && l < s; )
        o = n.getItemGraphicEl(l++);
    if (o) {
      var u = ct(o);
      _l(i, u.focus, u.blurScope, r);
    } else {
      var h = e.get(["emphasis", "focus"]), f = e.get(["emphasis", "blurScope"]);
      h != null && _l(i, h, f, r);
    }
  }
}
function fu(e, t, r, i) {
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
    if (ct(s[u]).focus === "self") {
      l = !0;
      break;
    }
  return {
    focusSelf: l,
    dispatchers: s
  };
}
function yS(e, t, r) {
  var i = ct(e), n = fu(i.componentMainType, i.componentIndex, i.componentHighDownName, r), a = n.dispatchers, o = n.focusSelf;
  a ? (o && ml(i.componentMainType, i.componentIndex, r), D(a, function(s) {
    return Qh(s, t);
  })) : (_l(i.seriesIndex, i.focus, i.blurScope, r), i.focus === "self" && ml(i.componentMainType, i.componentIndex, r), Qh(e, t));
}
function wS(e, t, r) {
  ld(r);
  var i = ct(e), n = fu(i.componentMainType, i.componentIndex, i.componentHighDownName, r).dispatchers;
  n ? D(n, function(a) {
    return jh(a, t);
  }) : jh(e, t);
}
function SS(e, t, r) {
  if (wl(t)) {
    var i = t.dataType, n = e.getData(i), a = Un(n, t);
    $(a) || (a = [a]), e[t.type === _n ? "toggleSelect" : t.type === gn ? "select" : "unselect"](a, i);
  }
}
function Jh(e) {
  var t = e.getAllData();
  D(t, function(r) {
    var i = r.data, n = r.type;
    i.eachItemGraphicEl(function(a, o) {
      e.isSelected(o, n) ? ad(a) : od(a);
    });
  });
}
function bS(e) {
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
function TS(e, t, r) {
  ud(e, !0), We(e, gS), DS(e, t, r);
}
function xS(e) {
  ud(e, !1);
}
function CS(e, t, r, i) {
  i ? xS(e) : TS(e, t, r);
}
function DS(e, t, r) {
  var i = ct(e);
  t != null ? (i.focus = t, i.blurScope = r) : i.focus && (i.focus = null);
}
var tf = ["emphasis", "blur", "select"], MS = {
  itemStyle: "getItemStyle",
  lineStyle: "getLineStyle",
  areaStyle: "getAreaStyle"
};
function AS(e, t, r, i) {
  r = r || "itemStyle";
  for (var n = 0; n < tf.length; n++) {
    var a = tf[n], o = t.getModel([a, r]), s = e.ensureState(a);
    s.style = o[MS[r]]();
  }
}
function ud(e, t) {
  var r = t === !1, i = e;
  e.highDownSilentOnTouch && (i.__highDownSilentOnTouch = e.highDownSilentOnTouch), (!r || i.__highDownDispatcher) && (i.__highByOuter = i.__highByOuter || 0, i.__highDownDispatcher = !r);
}
function yl(e) {
  return !!(e && e.__highDownDispatcher);
}
function PS(e) {
  var t = Zh[e];
  return t == null && qh <= 32 && (t = Zh[e] = qh++), t;
}
function wl(e) {
  var t = e.type;
  return t === gn || t === Ea || t === _n;
}
function ef(e) {
  var t = e.type;
  return t === Hr || t === ka;
}
function LS(e) {
  var t = Jv(e);
  t.normalFill = e.style.fill, t.normalStroke = e.style.stroke;
  var r = e.states.select || {};
  t.selectFill = r.style && r.style.fill || null, t.selectStroke = r.style && r.style.stroke || null;
}
var ri = Mi.CMD, IS = [[], [], []], rf = Math.sqrt, RS = Math.atan2;
function kS(e, t) {
  if (t) {
    var r = e.data, i = e.len(), n, a, o, s, l, u, h = ri.M, f = ri.C, v = ri.L, c = ri.R, d = ri.A, _ = ri.Q;
    for (o = 0, s = 0; o < i; ) {
      switch (n = r[o++], s = o, a = 0, n) {
        case h:
          a = 1;
          break;
        case v:
          a = 1;
          break;
        case f:
          a = 3;
          break;
        case _:
          a = 2;
          break;
        case d:
          var p = t[4], g = t[5], m = rf(t[0] * t[0] + t[1] * t[1]), y = rf(t[2] * t[2] + t[3] * t[3]), w = RS(-t[1] / y, t[0] / m);
          r[o] *= m, r[o++] += p, r[o] *= y, r[o++] += g, r[o++] *= m, r[o++] *= y, r[o++] += w, r[o++] += w, o += 2, s = o;
          break;
        case c:
          u[0] = r[o++], u[1] = r[o++], Me(u, u, t), r[s++] = u[0], r[s++] = u[1], u[0] += r[o++], u[1] += r[o++], Me(u, u, t), r[s++] = u[0], r[s++] = u[1];
      }
      for (l = 0; l < a; l++) {
        var b = IS[l];
        b[0] = r[o++], b[1] = r[o++], Me(b, b, t), r[s++] = b[0], r[s++] = b[1];
      }
    }
    e.increaseVersion();
  }
}
var ms = Math.sqrt, sa = Math.sin, la = Math.cos, Gi = Math.PI;
function nf(e) {
  return Math.sqrt(e[0] * e[0] + e[1] * e[1]);
}
function Sl(e, t) {
  return (e[0] * t[0] + e[1] * t[1]) / (nf(e) * nf(t));
}
function af(e, t) {
  return (e[0] * t[1] < e[1] * t[0] ? -1 : 1) * Math.acos(Sl(e, t));
}
function of(e, t, r, i, n, a, o, s, l, u, h) {
  var f = l * (Gi / 180), v = la(f) * (e - r) / 2 + sa(f) * (t - i) / 2, c = -1 * sa(f) * (e - r) / 2 + la(f) * (t - i) / 2, d = v * v / (o * o) + c * c / (s * s);
  d > 1 && (o *= ms(d), s *= ms(d));
  var _ = (n === a ? -1 : 1) * ms((o * o * (s * s) - o * o * (c * c) - s * s * (v * v)) / (o * o * (c * c) + s * s * (v * v))) || 0, p = _ * o * c / s, g = _ * -s * v / o, m = (e + r) / 2 + la(f) * p - sa(f) * g, y = (t + i) / 2 + sa(f) * p + la(f) * g, w = af([1, 0], [(v - p) / o, (c - g) / s]), b = [(v - p) / o, (c - g) / s], S = [(-1 * v - p) / o, (-1 * c - g) / s], T = af(b, S);
  if (Sl(b, S) <= -1 && (T = Gi), Sl(b, S) >= 1 && (T = 0), T < 0) {
    var x = Math.round(T / Gi * 1e6) / 1e6;
    T = Gi * 2 + x % 2 * Gi;
  }
  h.addData(u, m, y, o, s, w, T, f, a);
}
var ES = /([mlvhzcqtsa])([^mlvhzcqtsa]*)/ig, $S = /-?([0-9]*\.)?[0-9]+([eE]-?[0-9]+)?/g;
function OS(e) {
  var t = new Mi();
  if (!e)
    return t;
  var r = 0, i = 0, n = r, a = i, o, s = Mi.CMD, l = e.match(ES);
  if (!l)
    return t;
  for (var u = 0; u < l.length; u++) {
    for (var h = l[u], f = h.charAt(0), v = void 0, c = h.match($S) || [], d = c.length, _ = 0; _ < d; _++)
      c[_] = parseFloat(c[_]);
    for (var p = 0; p < d; ) {
      var g = void 0, m = void 0, y = void 0, w = void 0, b = void 0, S = void 0, T = void 0, x = r, C = i, M = void 0, A = void 0;
      switch (f) {
        case "l":
          r += c[p++], i += c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "L":
          r = c[p++], i = c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "m":
          r += c[p++], i += c[p++], v = s.M, t.addData(v, r, i), n = r, a = i, f = "l";
          break;
        case "M":
          r = c[p++], i = c[p++], v = s.M, t.addData(v, r, i), n = r, a = i, f = "L";
          break;
        case "h":
          r += c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "H":
          r = c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "v":
          i += c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "V":
          i = c[p++], v = s.L, t.addData(v, r, i);
          break;
        case "C":
          v = s.C, t.addData(v, c[p++], c[p++], c[p++], c[p++], c[p++], c[p++]), r = c[p - 2], i = c[p - 1];
          break;
        case "c":
          v = s.C, t.addData(v, c[p++] + r, c[p++] + i, c[p++] + r, c[p++] + i, c[p++] + r, c[p++] + i), r += c[p - 2], i += c[p - 1];
          break;
        case "S":
          g = r, m = i, M = t.len(), A = t.data, o === s.C && (g += r - A[M - 4], m += i - A[M - 3]), v = s.C, x = c[p++], C = c[p++], r = c[p++], i = c[p++], t.addData(v, g, m, x, C, r, i);
          break;
        case "s":
          g = r, m = i, M = t.len(), A = t.data, o === s.C && (g += r - A[M - 4], m += i - A[M - 3]), v = s.C, x = r + c[p++], C = i + c[p++], r += c[p++], i += c[p++], t.addData(v, g, m, x, C, r, i);
          break;
        case "Q":
          x = c[p++], C = c[p++], r = c[p++], i = c[p++], v = s.Q, t.addData(v, x, C, r, i);
          break;
        case "q":
          x = c[p++] + r, C = c[p++] + i, r += c[p++], i += c[p++], v = s.Q, t.addData(v, x, C, r, i);
          break;
        case "T":
          g = r, m = i, M = t.len(), A = t.data, o === s.Q && (g += r - A[M - 4], m += i - A[M - 3]), r = c[p++], i = c[p++], v = s.Q, t.addData(v, g, m, r, i);
          break;
        case "t":
          g = r, m = i, M = t.len(), A = t.data, o === s.Q && (g += r - A[M - 4], m += i - A[M - 3]), r += c[p++], i += c[p++], v = s.Q, t.addData(v, g, m, r, i);
          break;
        case "A":
          y = c[p++], w = c[p++], b = c[p++], S = c[p++], T = c[p++], x = r, C = i, r = c[p++], i = c[p++], v = s.A, of(x, C, r, i, S, T, y, w, b, v, t);
          break;
        case "a":
          y = c[p++], w = c[p++], b = c[p++], S = c[p++], T = c[p++], x = r, C = i, r += c[p++], i += c[p++], v = s.A, of(x, C, r, i, S, T, y, w, b, v, t);
          break;
      }
    }
    (f === "z" || f === "Z") && (v = s.Z, t.addData(v), r = n, i = a), o = v;
  }
  return t.toStatic(), t;
}
var hd = (function(e) {
  G(t, e);
  function t() {
    return e !== null && e.apply(this, arguments) || this;
  }
  return t.prototype.applyTransform = function(r) {
  }, t;
})(at);
function fd(e) {
  return e.setData != null;
}
function cd(e, t) {
  var r = OS(e), i = R({}, t);
  return i.buildPath = function(n) {
    if (fd(n)) {
      n.setData(r.data);
      var a = n.getContext();
      a && n.rebuildPath(a, 1);
    } else {
      var a = n;
      r.rebuildPath(a, 1);
    }
  }, i.applyTransform = function(n) {
    kS(r, n), this.dirtyShape();
  }, i;
}
function BS(e, t) {
  return new hd(cd(e, t));
}
function NS(e, t) {
  var r = cd(e, t), i = (function(n) {
    G(a, n);
    function a(o) {
      var s = n.call(this, o) || this;
      return s.applyTransform = r.applyTransform, s.buildPath = r.buildPath, s;
    }
    return a;
  })(hd);
  return i;
}
function FS(e, t) {
  for (var r = [], i = e.length, n = 0; n < i; n++) {
    var a = e[n];
    r.push(a.getUpdatedPathProxy(!0));
  }
  var o = new at(t);
  return o.createPathProxy(), o.buildPath = function(s) {
    if (fd(s)) {
      s.appendPath(r);
      var l = s.getContext();
      l && s.rebuildPath(l, 1);
    }
  }, o;
}
var zS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0;
  }
  return e;
})(), Mo = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new zS();
  }, t.prototype.buildPath = function(r, i) {
    r.moveTo(i.cx + i.r, i.cy), r.arc(i.cx, i.cy, i.r, 0, Math.PI * 2);
  }, t;
})(at);
Mo.prototype.type = "circle";
var HS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.rx = 0, this.ry = 0;
  }
  return e;
})(), cu = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new HS();
  }, t.prototype.buildPath = function(r, i) {
    var n = 0.5522848, a = i.cx, o = i.cy, s = i.rx, l = i.ry, u = s * n, h = l * n;
    r.moveTo(a - s, o), r.bezierCurveTo(a - s, o - h, a - u, o - l, a, o - l), r.bezierCurveTo(a + u, o - l, a + s, o - h, a + s, o), r.bezierCurveTo(a + s, o + h, a + u, o + l, a, o + l), r.bezierCurveTo(a - u, o + l, a - s, o + h, a - s, o), r.closePath();
  }, t;
})(at);
cu.prototype.type = "ellipse";
var vd = Math.PI, ys = vd * 2, Ar = Math.sin, ii = Math.cos, VS = Math.acos, Dt = Math.atan2, sf = Math.abs, mn = Math.sqrt, on = Math.max, be = Math.min, ue = 1e-4;
function US(e, t, r, i, n, a, o, s) {
  var l = r - e, u = i - t, h = o - n, f = s - a, v = f * l - h * u;
  if (!(v * v < ue))
    return v = (h * (t - a) - f * (e - n)) / v, [e + v * l, t + v * u];
}
function ua(e, t, r, i, n, a, o) {
  var s = e - r, l = t - i, u = (o ? a : -a) / mn(s * s + l * l), h = u * l, f = -u * s, v = e + h, c = t + f, d = r + h, _ = i + f, p = (v + d) / 2, g = (c + _) / 2, m = d - v, y = _ - c, w = m * m + y * y, b = n - a, S = v * _ - d * c, T = (y < 0 ? -1 : 1) * mn(on(0, b * b * w - S * S)), x = (S * y - m * T) / w, C = (-S * m - y * T) / w, M = (S * y + m * T) / w, A = (-S * m + y * T) / w, L = x - p, I = C - g, P = M - p, k = A - g;
  return L * L + I * I > P * P + k * k && (x = M, C = A), {
    cx: x,
    cy: C,
    x0: -h,
    y0: -f,
    x1: x * (n / b - 1),
    y1: C * (n / b - 1)
  };
}
function GS(e) {
  var t;
  if ($(e)) {
    var r = e.length;
    if (!r)
      return e;
    r === 1 ? t = [e[0], e[0], 0, 0] : r === 2 ? t = [e[0], e[0], e[1], e[1]] : r === 3 ? t = e.concat(e[2]) : t = e;
  } else
    t = [e, e, e, e];
  return t;
}
function WS(e, t) {
  var r, i = on(t.r, 0), n = on(t.r0 || 0, 0), a = i > 0, o = n > 0;
  if (!(!a && !o)) {
    if (a || (i = n, n = 0), n > i) {
      var s = i;
      i = n, n = s;
    }
    var l = t.startAngle, u = t.endAngle;
    if (!(isNaN(l) || isNaN(u))) {
      var h = t.cx, f = t.cy, v = !!t.clockwise, c = sf(u - l), d = c > ys && c % ys;
      if (d > ue && (c = d), !(i > ue))
        e.moveTo(h, f);
      else if (c > ys - ue)
        e.moveTo(h + i * ii(l), f + i * Ar(l)), e.arc(h, f, i, l, u, !v), n > ue && (e.moveTo(h + n * ii(u), f + n * Ar(u)), e.arc(h, f, n, u, l, v));
      else {
        var _ = void 0, p = void 0, g = void 0, m = void 0, y = void 0, w = void 0, b = void 0, S = void 0, T = void 0, x = void 0, C = void 0, M = void 0, A = void 0, L = void 0, I = void 0, P = void 0, k = i * ii(l), E = i * Ar(l), Y = n * ii(u), X = n * Ar(u), B = c > ue;
        if (B) {
          var q = t.cornerRadius;
          q && (r = GS(q), _ = r[0], p = r[1], g = r[2], m = r[3]);
          var Q = sf(i - n) / 2;
          if (y = be(Q, g), w = be(Q, m), b = be(Q, _), S = be(Q, p), C = T = on(y, w), M = x = on(b, S), (T > ue || x > ue) && (A = i * ii(u), L = i * Ar(u), I = n * ii(l), P = n * Ar(l), c < vd)) {
            var W = US(k, E, I, P, A, L, Y, X);
            if (W) {
              var gt = k - W[0], St = E - W[1], Wt = A - W[0], _e = L - W[1], Qt = 1 / Ar(VS((gt * Wt + St * _e) / (mn(gt * gt + St * St) * mn(Wt * Wt + _e * _e))) / 2), Yt = mn(W[0] * W[0] + W[1] * W[1]);
              C = be(T, (i - Yt) / (Qt + 1)), M = be(x, (n - Yt) / (Qt - 1));
            }
          }
        }
        if (!B)
          e.moveTo(h + k, f + E);
        else if (C > ue) {
          var Tt = be(g, C), ht = be(m, C), z = ua(I, P, k, E, i, Tt, v), Z = ua(A, L, Y, X, i, ht, v);
          e.moveTo(h + z.cx + z.x0, f + z.cy + z.y0), C < T && Tt === ht ? e.arc(h + z.cx, f + z.cy, C, Dt(z.y0, z.x0), Dt(Z.y0, Z.x0), !v) : (Tt > 0 && e.arc(h + z.cx, f + z.cy, Tt, Dt(z.y0, z.x0), Dt(z.y1, z.x1), !v), e.arc(h, f, i, Dt(z.cy + z.y1, z.cx + z.x1), Dt(Z.cy + Z.y1, Z.cx + Z.x1), !v), ht > 0 && e.arc(h + Z.cx, f + Z.cy, ht, Dt(Z.y1, Z.x1), Dt(Z.y0, Z.x0), !v));
        } else
          e.moveTo(h + k, f + E), e.arc(h, f, i, l, u, !v);
        if (!(n > ue) || !B)
          e.lineTo(h + Y, f + X);
        else if (M > ue) {
          var Tt = be(_, M), ht = be(p, M), z = ua(Y, X, A, L, n, -ht, v), Z = ua(k, E, I, P, n, -Tt, v);
          e.lineTo(h + z.cx + z.x0, f + z.cy + z.y0), M < x && Tt === ht ? e.arc(h + z.cx, f + z.cy, M, Dt(z.y0, z.x0), Dt(Z.y0, Z.x0), !v) : (ht > 0 && e.arc(h + z.cx, f + z.cy, ht, Dt(z.y0, z.x0), Dt(z.y1, z.x1), !v), e.arc(h, f, n, Dt(z.cy + z.y1, z.cx + z.x1), Dt(Z.cy + Z.y1, Z.cx + Z.x1), v), Tt > 0 && e.arc(h + Z.cx, f + Z.cy, Tt, Dt(Z.y1, Z.x1), Dt(Z.y0, Z.x0), !v));
        } else
          e.lineTo(h + Y, f + X), e.arc(h, f, n, u, l, v);
      }
      e.closePath();
    }
  }
}
var YS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r0 = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0, this.cornerRadius = 0;
  }
  return e;
})(), Yn = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new YS();
  }, t.prototype.buildPath = function(r, i) {
    WS(r, i);
  }, t.prototype.isZeroArea = function() {
    return this.shape.startAngle === this.shape.endAngle || this.shape.r === this.shape.r0;
  }, t;
})(at);
Yn.prototype.type = "sector";
var XS = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.r0 = 0;
  }
  return e;
})(), vu = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new XS();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.cx, a = i.cy, o = Math.PI * 2;
    r.moveTo(n + i.r, a), r.arc(n, a, i.r, 0, o, !1), r.moveTo(n + i.r0, a), r.arc(n, a, i.r0, 0, o, !0);
  }, t;
})(at);
vu.prototype.type = "ring";
function qS(e, t, r, i) {
  var n = [], a = [], o = [], s = [], l, u, h, f;
  if (i) {
    h = [1 / 0, 1 / 0], f = [-1 / 0, -1 / 0];
    for (var v = 0, c = e.length; v < c; v++)
      ci(h, h, e[v]), vi(f, f, e[v]);
    ci(h, h, i[0]), vi(f, f, i[1]);
  }
  for (var v = 0, c = e.length; v < c; v++) {
    var d = e[v];
    if (r)
      l = e[v ? v - 1 : c - 1], u = e[(v + 1) % c];
    else if (v === 0 || v === c - 1) {
      n.push(L0(e[v]));
      continue;
    } else
      l = e[v - 1], u = e[v + 1];
    I0(a, u, l), Oo(a, a, t);
    var _ = Ks(d, l), p = Ks(d, u), g = _ + p;
    g !== 0 && (_ /= g, p /= g), Oo(o, a, -_), Oo(s, a, p);
    var m = ju([], d, o), y = ju([], d, s);
    i && (vi(m, m, h), ci(m, m, f), vi(y, y, h), ci(y, y, f)), n.push(m), n.push(y);
  }
  return r && n.push(n.shift()), n;
}
function dd(e, t, r) {
  var i = t.smooth, n = t.points;
  if (n && n.length >= 2) {
    if (i) {
      var a = qS(n, i, r, t.smoothConstraint);
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
var ZS = /* @__PURE__ */ (function() {
  function e() {
    this.points = null, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
})(), du = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultShape = function() {
    return new ZS();
  }, t.prototype.buildPath = function(r, i) {
    dd(r, i, !0);
  }, t;
})(at);
du.prototype.type = "polygon";
var KS = /* @__PURE__ */ (function() {
  function e() {
    this.points = null, this.percent = 1, this.smooth = 0, this.smoothConstraint = null;
  }
  return e;
})(), Xn = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new KS();
  }, t.prototype.buildPath = function(r, i) {
    dd(r, i, !1);
  }, t;
})(at);
Xn.prototype.type = "polyline";
var QS = {}, jS = /* @__PURE__ */ (function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.percent = 1;
  }
  return e;
})(), Ii = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new jS();
  }, t.prototype.buildPath = function(r, i) {
    var n, a, o, s;
    if (this.subPixelOptimize) {
      var l = Qv(QS, i, this.style);
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
})(at);
Ii.prototype.type = "line";
var Et = [], JS = /* @__PURE__ */ (function() {
  function e() {
    this.x1 = 0, this.y1 = 0, this.x2 = 0, this.y2 = 0, this.cpx1 = 0, this.cpy1 = 0, this.percent = 1;
  }
  return e;
})();
function lf(e, t, r) {
  var i = e.cpx2, n = e.cpy2;
  return i != null || n != null ? [
    (r ? uh : Rt)(e.x1, e.cpx1, e.cpx2, e.x2, t),
    (r ? uh : Rt)(e.y1, e.cpy1, e.cpy2, e.y2, t)
  ] : [
    (r ? hh : Bt)(e.x1, e.cpx1, e.x2, t),
    (r ? hh : Bt)(e.y1, e.cpy1, e.y2, t)
  ];
}
var pu = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new JS();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.x1, a = i.y1, o = i.x2, s = i.y2, l = i.cpx1, u = i.cpy1, h = i.cpx2, f = i.cpy2, v = i.percent;
    v !== 0 && (r.moveTo(n, a), h == null || f == null ? (v < 1 && (Xa(n, l, o, v, Et), l = Et[1], o = Et[2], Xa(a, u, s, v, Et), u = Et[1], s = Et[2]), r.quadraticCurveTo(l, u, o, s)) : (v < 1 && (Ya(n, l, h, o, v, Et), l = Et[1], h = Et[2], o = Et[3], Ya(a, u, f, s, v, Et), u = Et[1], f = Et[2], s = Et[3]), r.bezierCurveTo(l, u, h, f, o, s)));
  }, t.prototype.pointAt = function(r) {
    return lf(this.shape, r, !1);
  }, t.prototype.tangentAt = function(r) {
    var i = lf(this.shape, r, !0);
    return E0(i, i);
  }, t;
})(at);
pu.prototype.type = "bezier-curve";
var tb = /* @__PURE__ */ (function() {
  function e() {
    this.cx = 0, this.cy = 0, this.r = 0, this.startAngle = 0, this.endAngle = Math.PI * 2, this.clockwise = !0;
  }
  return e;
})(), Ao = (function(e) {
  G(t, e);
  function t(r) {
    return e.call(this, r) || this;
  }
  return t.prototype.getDefaultStyle = function() {
    return {
      stroke: "#000",
      fill: null
    };
  }, t.prototype.getDefaultShape = function() {
    return new tb();
  }, t.prototype.buildPath = function(r, i) {
    var n = i.cx, a = i.cy, o = Math.max(i.r, 0), s = i.startAngle, l = i.endAngle, u = i.clockwise, h = Math.cos(s), f = Math.sin(s);
    r.moveTo(h * o + n, f * o + a), r.arc(n, a, o, s, l, !u);
  }, t;
})(at);
Ao.prototype.type = "arc";
var eb = (function(e) {
  G(t, e);
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
    return this._updatePathDirty.call(this), at.prototype.getBoundingRect.call(this);
  }, t;
})(at), pd = (function() {
  function e(t) {
    this.colorStops = t || [];
  }
  return e.prototype.addColorStop = function(t, r) {
    this.colorStops.push({
      offset: t,
      color: r
    });
  }, e;
})(), rb = (function(e) {
  G(t, e);
  function t(r, i, n, a, o, s) {
    var l = e.call(this, o) || this;
    return l.x = r ?? 0, l.y = i ?? 0, l.x2 = n ?? 1, l.y2 = a ?? 0, l.type = "linear", l.global = s || !1, l;
  }
  return t;
})(pd), ib = (function(e) {
  G(t, e);
  function t(r, i, n, a, o) {
    var s = e.call(this, a) || this;
    return s.x = r ?? 0.5, s.y = i ?? 0.5, s.r = n ?? 0.5, s.type = "radial", s.global = o || !1, s;
  }
  return t;
})(pd), Pr = [0, 0], Lr = [0, 0], ha = new U(), fa = new U(), to = (function() {
  function e(t, r) {
    this._corners = [], this._axes = [], this._origin = [0, 0];
    for (var i = 0; i < 4; i++)
      this._corners[i] = new U();
    for (var i = 0; i < 2; i++)
      this._axes[i] = new U();
    t && this.fromBoundingRect(t, r);
  }
  return e.prototype.fromBoundingRect = function(t, r) {
    var i = this._corners, n = this._axes, a = t.x, o = t.y, s = a + t.width, l = o + t.height;
    if (i[0].set(a, o), i[1].set(s, o), i[2].set(s, l), i[3].set(a, l), r)
      for (var u = 0; u < 4; u++)
        i[u].transform(r);
    U.sub(n[0], i[1], i[0]), U.sub(n[1], i[3], i[0]), n[0].normalize(), n[1].normalize();
    for (var u = 0; u < 2; u++)
      this._origin[u] = n[u].dot(i[0]);
  }, e.prototype.intersect = function(t, r) {
    var i = !0, n = !r;
    return ha.set(1 / 0, 1 / 0), fa.set(0, 0), !this._intersectCheckOneSide(this, t, ha, fa, n, 1) && (i = !1, n) || !this._intersectCheckOneSide(t, this, ha, fa, n, -1) && (i = !1, n) || n || U.copy(r, i ? ha : fa), i;
  }, e.prototype._intersectCheckOneSide = function(t, r, i, n, a, o) {
    for (var s = !0, l = 0; l < 2; l++) {
      var u = this._axes[l];
      if (this._getProjMinMaxOnAxis(l, t._corners, Pr), this._getProjMinMaxOnAxis(l, r._corners, Lr), Pr[1] < Lr[0] || Pr[0] > Lr[1]) {
        if (s = !1, a)
          return s;
        var h = Math.abs(Lr[0] - Pr[1]), f = Math.abs(Pr[0] - Lr[1]);
        Math.min(h, f) > n.len() && (h < f ? U.scale(n, u, -h * o) : U.scale(n, u, f * o));
      } else if (i) {
        var h = Math.abs(Lr[0] - Pr[1]), f = Math.abs(Pr[0] - Lr[1]);
        Math.min(h, f) < i.len() && (h < f ? U.scale(i, u, h * o) : U.scale(i, u, -f * o));
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
})(), nb = [], ab = (function(e) {
  G(t, e);
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
      for (var r = new it(1 / 0, 1 / 0, -1 / 0, -1 / 0), i = 0; i < this._displayables.length; i++) {
        var n = this._displayables[i], a = n.getBoundingRect().clone();
        n.needLocalTransform() && a.applyTransform(n.getLocalTransform(nb)), r.union(a);
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
})(Wn), ob = wt();
function sb(e, t, r, i, n) {
  var a;
  if (t && t.ecModel) {
    var o = t.ecModel.getUpdatePayload();
    a = o && o.animation;
  }
  var s = t && t.isAnimationEnabled(), l = e === "update";
  if (s) {
    var u = void 0, h = void 0, f = void 0;
    i ? (u = K(i.duration, 200), h = K(i.easing, "cubicOut"), f = 0) : (u = t.getShallow(l ? "animationDurationUpdate" : "animationDuration"), h = t.getShallow(l ? "animationEasingUpdate" : "animationEasing"), f = t.getShallow(l ? "animationDelayUpdate" : "animationDelay")), a && (a.duration != null && (u = a.duration), a.easing != null && (h = a.easing), a.delay != null && (f = a.delay)), rt(f) && (f = f(r, n)), rt(u) && (u = u(r));
    var v = {
      duration: u || 0,
      delay: f,
      easing: h
    };
    return v;
  } else
    return null;
}
function gu(e, t, r, i, n, a, o) {
  var s = !1, l;
  rt(n) ? (o = a, a = n, n = null) : F(n) && (a = n.cb, o = n.during, s = n.isFrom, l = n.removeOpt, n = n.dataIndex);
  var u = e === "leave";
  u || t.stopAnimation("leave");
  var h = sb(e, i, n, u ? l || {} : null, i && i.getAnimationDelayParams ? i.getAnimationDelayParams(t, n) : null);
  if (h && h.duration > 0) {
    var f = h.duration, v = h.delay, c = h.easing, d = {
      duration: f,
      delay: v || 0,
      easing: c,
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
function In(e, t, r, i, n, a) {
  gu("update", e, t, r, i, n, a);
}
function $a(e, t, r, i, n, a) {
  gu("enter", e, t, r, i, n, a);
}
function yn(e) {
  if (!e.__zr)
    return !0;
  for (var t = 0; t < e.animators.length; t++) {
    var r = e.animators[t];
    if (r.scope === "leave")
      return !0;
  }
  return !1;
}
function gd(e, t, r, i, n, a) {
  yn(e) || gu("leave", e, t, r, i, n, a);
}
function uf(e, t, r, i) {
  e.removeTextContent(), e.removeTextGuideLine(), gd(e, {
    style: {
      opacity: 0
    }
  }, t, r, i);
}
function _d(e, t, r) {
  function i() {
    e.parent && e.parent.remove(e);
  }
  e.isGroup ? e.traverse(function(n) {
    n.isGroup || uf(n, t, r, i);
  }) : uf(e, t, r, i);
}
function lb(e) {
  ob(e).oldStyle = e.style;
}
var eo = Math.max, ro = Math.min, bl = {};
function ub(e) {
  return at.extend(e);
}
var hb = NS;
function fb(e, t) {
  return hb(e, t);
}
function pe(e, t) {
  bl[e] = t;
}
function cb(e) {
  if (bl.hasOwnProperty(e))
    return bl[e];
}
function _u(e, t, r, i) {
  var n = BS(e, t);
  return r && (i === "center" && (r = yd(r, n.getBoundingRect())), wd(n, r)), n;
}
function md(e, t, r) {
  var i = new Xr({
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
        i.setStyle(yd(t, a));
      }
    }
  });
  return i;
}
function yd(e, t) {
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
var vb = FS;
function wd(e, t) {
  if (e.applyTransform) {
    var r = e.getBoundingRect(), i = r.calculateTransform(t);
    e.applyTransform(i);
  }
}
function mu(e, t) {
  return Qv(e, e, {
    lineWidth: t
  }), e;
}
function db(e) {
  return jv(e.shape, e.shape, e.style), e;
}
var pb = Br;
function gb(e, t) {
  for (var r = jl([]); e && e !== t; )
    mi(r, e.getLocalTransform(), r), e = e.parent;
  return r;
}
function yu(e, t, r) {
  return t && !Vt(t) && (t = eu.getLocalTransform(t)), r && (t = vv([], t)), Me([], e, t);
}
function _b(e, t, r) {
  var i = t[4] === 0 || t[5] === 0 || t[0] === 0 ? 1 : Math.abs(2 * t[4] / t[0]), n = t[4] === 0 || t[5] === 0 || t[2] === 0 ? 1 : Math.abs(2 * t[4] / t[2]), a = [e === "left" ? -i : e === "right" ? i : 0, e === "top" ? -n : e === "bottom" ? n : 0];
  return a = yu(a, t, r), Math.abs(a[0]) > Math.abs(a[1]) ? a[0] > 0 ? "right" : "left" : a[1] > 0 ? "bottom" : "top";
}
function hf(e) {
  return !e.isGroup;
}
function mb(e) {
  return e.shape != null;
}
function yb(e, t, r) {
  if (!e || !t)
    return;
  function i(o) {
    var s = {};
    return o.traverse(function(l) {
      hf(l) && l.anid && (s[l.anid] = l);
    }), s;
  }
  function n(o) {
    var s = {
      x: o.x,
      y: o.y,
      rotation: o.rotation
    };
    return mb(o) && (s.shape = R({}, o.shape)), s;
  }
  var a = i(e);
  t.traverse(function(o) {
    if (hf(o) && o.anid) {
      var s = a[o.anid];
      if (s) {
        var l = n(o);
        o.attr(n(s)), In(o, l, r, ct(o).dataIndex);
      }
    }
  });
}
function wb(e, t) {
  return J(e, function(r) {
    var i = r[0];
    i = eo(i, t.x), i = ro(i, t.x + t.width);
    var n = r[1];
    return n = eo(n, t.y), n = ro(n, t.y + t.height), [i, n];
  });
}
function Sb(e, t) {
  var r = eo(e.x, t.x), i = ro(e.x + e.width, t.x + t.width), n = eo(e.y, t.y), a = ro(e.y + e.height, t.y + t.height);
  if (i >= r && a >= n)
    return {
      x: r,
      y: n,
      width: i - r,
      height: a - n
    };
}
function Sd(e, t, r) {
  var i = R({
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
    return e.indexOf("image://") === 0 ? (n.image = e.slice(8), ut(n, r), new Xr(i)) : _u(e.replace("path://", ""), i, r, "center");
}
function bb(e, t, r, i, n) {
  for (var a = 0, o = n[n.length - 1]; a < n.length; a++) {
    var s = n[a];
    if (bd(e, t, r, i, s[0], s[1], o[0], o[1]))
      return !0;
    o = s;
  }
}
function bd(e, t, r, i, n, a, o, s) {
  var l = r - e, u = i - t, h = o - n, f = s - a, v = ws(h, f, l, u);
  if (Tb(v))
    return !1;
  var c = e - n, d = t - a, _ = ws(c, d, l, u) / v;
  if (_ < 0 || _ > 1)
    return !1;
  var p = ws(c, d, h, f) / v;
  return !(p < 0 || p > 1);
}
function ws(e, t, r, i) {
  return e * i - r * t;
}
function Tb(e) {
  return e <= 1e-6 && e >= -1e-6;
}
function wu(e) {
  var t = e.itemTooltipOption, r = e.componentModel, i = e.itemName, n = V(t) ? {
    formatter: t
  } : t, a = r.mainType, o = r.componentIndex, s = {
    componentType: a,
    name: i,
    $vars: ["name"]
  };
  s[a + "Index"] = o;
  var l = e.formatterParamsExtra;
  l && D(dt(l), function(h) {
    Ci(s, h) || (s[h] = l[h], s.$vars.push(h));
  });
  var u = ct(e.el);
  u.componentMainType = a, u.componentIndex = o, u.tooltipConfig = {
    name: i,
    option: ut({
      content: i,
      encodeHTMLContent: !0,
      formatterParams: s
    }, n)
  };
}
function ff(e, t) {
  var r;
  e.isGroup && (r = t(e)), r || e.traverse(t);
}
function Td(e, t) {
  if (e)
    if ($(e))
      for (var r = 0; r < e.length; r++)
        ff(e[r], t);
    else
      ff(e, t);
}
pe("circle", Mo);
pe("ellipse", cu);
pe("sector", Yn);
pe("ring", vu);
pe("polygon", du);
pe("polyline", Xn);
pe("rect", ve);
pe("line", Ii);
pe("bezierCurve", pu);
pe("arc", Ao);
const xb = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  Arc: Ao,
  BezierCurve: pu,
  BoundingRect: it,
  Circle: Mo,
  CompoundPath: eb,
  Ellipse: cu,
  Group: Ue,
  Image: Xr,
  IncrementalDisplayable: ab,
  Line: Ii,
  LinearGradient: rb,
  OrientedBoundingRect: to,
  Path: at,
  Point: U,
  Polygon: du,
  Polyline: Xn,
  RadialGradient: ib,
  Rect: ve,
  Ring: vu,
  Sector: Yn,
  Text: de,
  applyTransform: yu,
  clipPointsByRect: wb,
  clipRectByRect: Sb,
  createIcon: Sd,
  extendPath: fb,
  extendShape: ub,
  getShapeClass: cb,
  getTransform: gb,
  groupTransition: yb,
  initProps: $a,
  isElementRemoved: yn,
  lineLineIntersect: bd,
  linePolygonIntersect: bb,
  makeImage: md,
  makePath: _u,
  mergePath: vb,
  registerShape: pe,
  removeElement: gd,
  removeElementWithFadeOut: _d,
  resizePath: wd,
  setTooltipConfig: wu,
  subPixelOptimize: pb,
  subPixelOptimizeLine: mu,
  subPixelOptimizeRect: db,
  transformDirection: _b,
  traverseElements: Td,
  updateProps: In
}, Symbol.toStringTag, { value: "Module" }));
var Po = {};
function Cb(e, t) {
  for (var r = 0; r < Pe.length; r++) {
    var i = Pe[r], n = t[i], a = e.ensureState(i);
    a.style = a.style || {}, a.style.text = n;
  }
  var o = e.currentStates.slice();
  e.clearStates(!0), e.setStyle({
    text: t.normal
  }), e.useStates(o, !0);
}
function cf(e, t, r) {
  var i = e.labelFetcher, n = e.labelDataIndex, a = e.labelDimIndex, o = t.normal, s;
  i && (s = i.getFormattedLabel(n, "normal", null, a, o && o.get("formatter"), r != null ? {
    interpolatedValue: r
  } : null)), s == null && (s = rt(e.defaultText) ? e.defaultText(n, e, r) : e.defaultText);
  for (var l = {
    normal: s
  }, u = 0; u < Pe.length; u++) {
    var h = Pe[u], f = t[h];
    l[h] = K(i ? i.getFormattedLabel(n, h, null, a, f && f.get("formatter")) : null, s);
  }
  return l;
}
function Db(e, t, r, i) {
  r = r || Po;
  for (var n = e instanceof de, a = !1, o = 0; o < Ja.length; o++) {
    var s = t[Ja[o]];
    if (s && s.getShallow("show")) {
      a = !0;
      break;
    }
  }
  var l = n ? e : e.getTextContent();
  if (a) {
    n || (l || (l = new de(), e.setTextContent(l)), e.stateProxy && (l.stateProxy = e.stateProxy));
    var u = cf(r, t), h = t.normal, f = !!h.getShallow("show"), v = Rn(h, i, r, !1, !n);
    v.text = u.normal, n || e.setTextConfig(vf(h, r, !1));
    for (var o = 0; o < Pe.length; o++) {
      var c = Pe[o], s = t[c];
      if (s) {
        var d = l.ensureState(c), _ = !!K(s.getShallow("show"), f);
        if (_ !== f && (d.ignore = !_), d.style = Rn(s, i, r, !0, !n), d.style.text = u[c], !n) {
          var p = e.ensureState(c);
          p.textConfig = vf(s, r, !0);
        }
      }
    }
    l.silent = !!h.getShallow("silent"), l.style.x != null && (v.x = l.style.x), l.style.y != null && (v.y = l.style.y), l.ignore = !f, l.useStyle(v), l.dirty(), r.enableTextSetter && (Ib(l).setLabelText = function(g) {
      var m = cf(r, t, g);
      Cb(l, m);
    });
  } else l && (l.ignore = !0);
  e.dirty();
}
function Mb(e, t) {
  t = t || "label";
  for (var r = {
    normal: e.getModel(t)
  }, i = 0; i < Pe.length; i++) {
    var n = Pe[i];
    r[n] = e.getModel([n, t]);
  }
  return r;
}
function Rn(e, t, r, i, n) {
  var a = {};
  return Ab(a, e, r, i, n), t && R(a, t), a;
}
function vf(e, t, r) {
  t = t || {};
  var i = {}, n, a = e.getShallow("rotate"), o = K(e.getShallow("distance"), r ? null : 5), s = e.getShallow("offset");
  return n = e.getShallow("position") || (r ? null : "inside"), n === "outside" && (n = t.defaultOutsidePosition || "top"), n != null && (i.position = n), s != null && (i.offset = s), a != null && (a *= Math.PI / 180, i.rotation = a), o != null && (i.distance = o), i.outsideFill = e.get("color") === "inherit" ? t.inheritColor || null : "auto", i;
}
function Ab(e, t, r, i, n) {
  r = r || Po;
  var a = t.ecModel, o = a && a.option.textStyle, s = Pb(t), l;
  if (s) {
    l = {};
    for (var u in s)
      if (s.hasOwnProperty(u)) {
        var h = t.getModel(["rich", u]);
        _f(l[u] = {}, h, o, r, i, n, !1, !0);
      }
  }
  l && (e.rich = l);
  var f = t.get("overflow");
  f && (e.overflow = f);
  var v = t.get("minMargin");
  v != null && (e.margin = v), _f(e, t, o, r, i, n, !0, !1);
}
function Pb(e) {
  for (var t; e && e !== e.ecModel; ) {
    var r = (e.option || Po).rich;
    if (r) {
      t = t || {};
      for (var i = dt(r), n = 0; n < i.length; n++) {
        var a = i[n];
        t[a] = 1;
      }
    }
    e = e.parentModel;
  }
  return t;
}
var df = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "textShadowColor", "textShadowBlur", "textShadowOffsetX", "textShadowOffsetY"], pf = ["align", "lineHeight", "width", "height", "tag", "verticalAlign", "ellipsis"], gf = ["padding", "borderWidth", "borderRadius", "borderDashOffset", "backgroundColor", "borderColor", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"];
function _f(e, t, r, i, n, a, o, s) {
  r = !n && r || Po;
  var l = i && i.inheritColor, u = t.getShallow("color"), h = t.getShallow("textBorderColor"), f = K(t.getShallow("opacity"), r.opacity);
  (u === "inherit" || u === "auto") && (l ? u = l : u = null), (h === "inherit" || h === "auto") && (l ? h = l : h = null), a || (u = u || r.color, h = h || r.textBorderColor), u != null && (e.fill = u), h != null && (e.stroke = h);
  var v = K(t.getShallow("textBorderWidth"), r.textBorderWidth);
  v != null && (e.lineWidth = v);
  var c = K(t.getShallow("textBorderType"), r.textBorderType);
  c != null && (e.lineDash = c);
  var d = K(t.getShallow("textBorderDashOffset"), r.textBorderDashOffset);
  d != null && (e.lineDashOffset = d), !n && f == null && !s && (f = i && i.defaultOpacity), f != null && (e.opacity = f), !n && !a && e.fill == null && i.inheritColor && (e.fill = i.inheritColor);
  for (var _ = 0; _ < df.length; _++) {
    var p = df[_], g = K(t.getShallow(p), r[p]);
    g != null && (e[p] = g);
  }
  for (var _ = 0; _ < pf.length; _++) {
    var p = pf[_], g = t.getShallow(p);
    g != null && (e[p] = g);
  }
  if (e.verticalAlign == null) {
    var m = t.getShallow("baseline");
    m != null && (e.verticalAlign = m);
  }
  if (!o || !i.disableBox) {
    for (var _ = 0; _ < gf.length; _++) {
      var p = gf[_], g = t.getShallow(p);
      g != null && (e[p] = g);
    }
    var y = t.getShallow("borderType");
    y != null && (e.borderDash = y), (e.backgroundColor === "auto" || e.backgroundColor === "inherit") && l && (e.backgroundColor = l), (e.borderColor === "auto" || e.borderColor === "inherit") && l && (e.borderColor = l);
  }
}
function Lb(e, t) {
  var r = t && t.getModel("textStyle");
  return Ce([
    // FIXME in node-canvas fontWeight is before fontStyle
    e.fontStyle || r && r.getShallow("fontStyle") || "",
    e.fontWeight || r && r.getShallow("fontWeight") || "",
    (e.fontSize || r && r.getShallow("fontSize") || 12) + "px",
    e.fontFamily || r && r.getShallow("fontFamily") || "sans-serif"
  ].join(" "));
}
var Ib = wt(), Rb = ["textStyle", "color"], Ss = ["fontStyle", "fontWeight", "fontSize", "fontFamily", "padding", "lineHeight", "rich", "width", "height", "overflow"], bs = new de(), kb = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getTextColor = function(t) {
      var r = this.ecModel;
      return this.getShallow("color") || (!t && r ? r.get(Rb) : null);
    }, e.prototype.getFont = function() {
      return Lb({
        fontStyle: this.getShallow("fontStyle"),
        fontWeight: this.getShallow("fontWeight"),
        fontSize: this.getShallow("fontSize"),
        fontFamily: this.getShallow("fontFamily")
      }, this.ecModel);
    }, e.prototype.getTextRect = function(t) {
      for (var r = {
        text: t,
        verticalAlign: this.getShallow("verticalAlign") || this.getShallow("baseline")
      }, i = 0; i < Ss.length; i++)
        r[Ss[i]] = this.getShallow(Ss[i]);
      return bs.useStyle(r), bs.update(), bs.getBoundingRect();
    }, e;
  })()
), xd = [
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
], Eb = Ln(xd), $b = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getLineStyle = function(t) {
      return Eb(this, t);
    }, e;
  })()
), Cd = [
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
], Ob = Ln(Cd), Bb = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getItemStyle = function(t, r) {
      return Ob(this, t, r);
    }, e;
  })()
), vt = (
  /** @class */
  (function() {
    function e(t, r, i) {
      this.parentModel = r, this.ecModel = i, this.option = t;
    }
    return e.prototype.init = function(t, r, i) {
    }, e.prototype.mergeOption = function(t, r) {
      _t(this.option, t, !0);
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
      return new t(j(this.option));
    }, e.prototype.parsePath = function(t) {
      return typeof t == "string" ? t.split(".") : t;
    }, e.prototype.resolveParentPath = function(t) {
      return t;
    }, e.prototype.isAnimationEnabled = function() {
      if (!H.node && this.option) {
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
au(vt);
p1(vt);
Ge(vt, $b);
Ge(vt, Bb);
Ge(vt, w1);
Ge(vt, kb);
var Nb = Math.round(Math.random() * 10);
function Lo(e) {
  return [e || "", Nb++].join("_");
}
function Fb(e) {
  var t = {};
  e.registerSubTypeDefaulter = function(r, i) {
    var n = De(r);
    t[n.main] = i;
  }, e.determineSubType = function(r, i) {
    var n = i.type;
    if (!n) {
      var a = De(r).main;
      e.hasSubTypes(r) && t[a] && (n = t[a](i));
    }
    return n;
  };
}
function zb(e, t) {
  e.topologicalTravel = function(a, o, s, l) {
    if (!a.length)
      return;
    var u = r(o), h = u.graph, f = u.noEntryList, v = {};
    for (D(a, function(m) {
      v[m] = !0;
    }); f.length; ) {
      var c = f.pop(), d = h[c], _ = !!v[c];
      _ && (s.call(l, c, d.originalDeps.slice()), delete v[c]), D(d.successor, _ ? g : p);
    }
    D(v, function() {
      var m = "";
      throw new Error(m);
    });
    function p(m) {
      h[m].entryCount--, h[m].entryCount === 0 && f.push(m);
    }
    function g(m) {
      v[m] = !0, p(m);
    }
  };
  function r(a) {
    var o = {}, s = [];
    return D(a, function(l) {
      var u = i(o, l), h = u.originalDeps = t(l), f = n(h, a);
      u.entryCount = f.length, u.entryCount === 0 && s.push(l), D(f, function(v) {
        ot(u.predecessor, v) < 0 && u.predecessor.push(v);
        var c = i(o, v);
        ot(c.successor, v) < 0 && c.successor.push(l);
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
      ot(o, l) >= 0 && s.push(l);
    }), s;
  }
}
const Hb = {
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
}, Vb = {
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
var io = "ZH", Su = "EN", Si = Su, Oa = {}, bu = {}, Dd = H.domSupported ? (function() {
  var e = (
    /* eslint-disable-next-line */
    (document.documentElement.lang || navigator.language || navigator.browserLanguage || Si).toUpperCase()
  );
  return e.indexOf(io) > -1 ? io : Si;
})() : Si;
function Md(e, t) {
  e = e.toUpperCase(), bu[e] = new vt(t), Oa[e] = t;
}
function Ub(e) {
  if (V(e)) {
    var t = Oa[e.toUpperCase()] || {};
    return e === io || e === Su ? j(t) : _t(j(t), j(Oa[Si]), !1);
  } else
    return _t(j(e), j(Oa[Si]), !1);
}
function Gb(e) {
  return bu[e];
}
function Wb() {
  return bu[Si];
}
Md(Su, Hb);
Md(io, Vb);
function Ze(e, t) {
  return e += "", "0000".substr(0, t - e.length) + e;
}
function Ad(e, t, r, i) {
  var n = bo(e), a = n[Yb(r)](), o = n[Xb(r)]() + 1, s = Math.floor((o - 1) / 3) + 1, l = n[qb(r)](), u = n["get" + (r ? "UTC" : "") + "Day"](), h = n[Zb(r)](), f = (h - 1) % 12 + 1, v = n[Kb(r)](), c = n[Qb(r)](), d = n[jb(r)](), _ = h >= 12 ? "pm" : "am", p = _.toUpperCase(), g = i instanceof vt ? i : Gb(Dd) || Wb(), m = g.getModel("time"), y = m.get("month"), w = m.get("monthAbbr"), b = m.get("dayOfWeek"), S = m.get("dayOfWeekAbbr");
  return (t || "").replace(/{a}/g, _ + "").replace(/{A}/g, p + "").replace(/{yyyy}/g, a + "").replace(/{yy}/g, Ze(a % 100 + "", 2)).replace(/{Q}/g, s + "").replace(/{MMMM}/g, y[o - 1]).replace(/{MMM}/g, w[o - 1]).replace(/{MM}/g, Ze(o, 2)).replace(/{M}/g, o + "").replace(/{dd}/g, Ze(l, 2)).replace(/{d}/g, l + "").replace(/{eeee}/g, b[u]).replace(/{ee}/g, S[u]).replace(/{e}/g, u + "").replace(/{HH}/g, Ze(h, 2)).replace(/{H}/g, h + "").replace(/{hh}/g, Ze(f + "", 2)).replace(/{h}/g, f + "").replace(/{mm}/g, Ze(v, 2)).replace(/{m}/g, v + "").replace(/{ss}/g, Ze(c, 2)).replace(/{s}/g, c + "").replace(/{SSS}/g, Ze(d, 3)).replace(/{S}/g, d + "");
}
function Yb(e) {
  return e ? "getUTCFullYear" : "getFullYear";
}
function Xb(e) {
  return e ? "getUTCMonth" : "getMonth";
}
function qb(e) {
  return e ? "getUTCDate" : "getDate";
}
function Zb(e) {
  return e ? "getUTCHours" : "getHours";
}
function Kb(e) {
  return e ? "getUTCMinutes" : "getMinutes";
}
function Qb(e) {
  return e ? "getUTCSeconds" : "getSeconds";
}
function jb(e) {
  return e ? "getUTCMilliseconds" : "getMilliseconds";
}
function Jb(e) {
  if (!Zw(e))
    return V(e) ? e : "-";
  var t = (e + "").split(".");
  return t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, "$1,") + (t.length > 1 ? "." + t[1] : "");
}
function Pd(e, t) {
  return e = (e || "").toLowerCase().replace(/-(.)/g, function(r, i) {
    return i.toUpperCase();
  }), t && e && (e = e.charAt(0).toUpperCase() + e.slice(1)), e;
}
var Tu = sv;
function Tl(e, t, r) {
  var i = "{yyyy}-{MM}-{dd} {HH}:{mm}:{ss}";
  function n(h) {
    return h && Ce(h) ? h : "-";
  }
  function a(h) {
    return !!(h != null && !isNaN(h) && isFinite(h));
  }
  var o = t === "time", s = e instanceof Date;
  if (o || s) {
    var l = o ? bo(e) : e;
    if (isNaN(+l)) {
      if (s)
        return "-";
    } else return Ad(l, i, r);
  }
  if (t === "ordinal")
    return qs(e) ? n(e) : mt(e) && a(e) ? e + "" : "-";
  var u = Qa(e);
  return a(u) ? Jb(u) : qs(e) ? n(e) : typeof e == "boolean" ? e + "" : "-";
}
var mf = ["a", "b", "c", "d", "e", "f", "g"], Ts = function(e, t) {
  return "{" + e + (t ?? "") + "}";
};
function Ld(e, t, r) {
  $(t) || (t = [t]);
  var i = t.length;
  if (!i)
    return "";
  for (var n = t[0].$vars || [], a = 0; a < n.length; a++) {
    var o = mf[a];
    e = e.replace(Ts(o), Ts(o, 0));
  }
  for (var s = 0; s < i; s++)
    for (var l = 0; l < n.length; l++) {
      var u = t[s][n[l]];
      e = e.replace(Ts(mf[l], s), r ? Ot(u) : u);
    }
  return e;
}
function tT(e, t) {
  var r = V(e) ? {
    color: e,
    extraCssText: t
  } : e || {}, i = r.color, n = r.type;
  t = r.extraCssText;
  var a = r.renderMode || "html";
  if (!i)
    return "";
  if (a === "html")
    return n === "subItem" ? '<span style="display:inline-block;vertical-align:middle;margin-right:8px;margin-left:3px;border-radius:4px;width:4px;height:4px;background-color:' + Ot(i) + ";" + (t || "") + '"></span>' : '<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:' + Ot(i) + ";" + (t || "") + '"></span>';
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
function kn(e, t) {
  return t = t || "transparent", V(e) ? e : F(e) && e.colorStops && (e.colorStops[0] || {}).color || t;
}
var Ba = D, eT = ["left", "right", "top", "bottom", "width", "height"], ca = [["width", "left", "right"], ["height", "top", "bottom"]];
function Id(e, t, r, i, n) {
  var a = 0, o = 0;
  i == null && (i = 1 / 0), n == null && (n = 1 / 0);
  var s = 0;
  t.eachChild(function(l, u) {
    var h = l.getBoundingRect(), f = t.childAt(u + 1), v = f && f.getBoundingRect(), c, d;
    if (e === "horizontal") {
      var _ = h.width + (v ? -v.x + h.x : 0);
      c = a + _, c > i || l.newline ? (a = 0, c = _, o += s + r, s = h.height) : s = Math.max(s, h.height);
    } else {
      var p = h.height + (v ? -v.y + h.y : 0);
      d = o + p, d > n || l.newline ? (a += s + r, o = 0, d = p, s = h.width) : s = Math.max(s, h.width);
    }
    l.newline || (l.x = a, l.y = o, l.markRedraw(), e === "horizontal" ? a = c + r : o = d + r);
  });
}
Zt(Id, "vertical");
Zt(Id, "horizontal");
function Rd(e, t, r) {
  r = Tu(r || 0);
  var i = t.width, n = t.height, a = yt(e.left, i), o = yt(e.top, n), s = yt(e.right, i), l = yt(e.bottom, n), u = yt(e.width, i), h = yt(e.height, n), f = r[2] + r[0], v = r[1] + r[3], c = e.aspect;
  switch (isNaN(u) && (u = i - s - v - a), isNaN(h) && (h = n - l - f - o), c != null && (isNaN(u) && isNaN(h) && (c > i / n ? u = i * 0.8 : h = n * 0.8), isNaN(u) && (u = c * h), isNaN(h) && (h = u / c)), isNaN(a) && (a = i - s - u - v), isNaN(o) && (o = n - l - h - f), e.left || e.right) {
    case "center":
      a = i / 2 - u / 2 - r[3];
      break;
    case "right":
      a = i - u - v;
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
  a = a || 0, o = o || 0, isNaN(u) && (u = i - v - a - (s || 0)), isNaN(h) && (h = n - f - o - (l || 0));
  var d = new it(a + r[3], o + r[0], u, h);
  return d.margin = r, d;
}
function no(e) {
  var t = e.layoutMode || e.constructor.layoutMode;
  return F(t) ? t : t ? {
    type: t
  } : null;
}
function ao(e, t, r) {
  var i = r && r.ignoreSize;
  !$(i) && (i = [i, i]);
  var n = o(ca[0], 0), a = o(ca[1], 1);
  u(ca[0], e, n), u(ca[1], e, a);
  function o(h, f) {
    var v = {}, c = 0, d = {}, _ = 0, p = 2;
    if (Ba(h, function(y) {
      d[y] = e[y];
    }), Ba(h, function(y) {
      s(t, y) && (v[y] = d[y] = t[y]), l(v, y) && c++, l(d, y) && _++;
    }), i[f])
      return l(t, h[1]) ? d[h[2]] = null : l(t, h[2]) && (d[h[1]] = null), d;
    if (_ === p || !c)
      return d;
    if (c >= p)
      return v;
    for (var g = 0; g < h.length; g++) {
      var m = h[g];
      if (!s(v, m) && s(e, m)) {
        v[m] = e[m];
        break;
      }
    }
    return v;
  }
  function s(h, f) {
    return h.hasOwnProperty(f);
  }
  function l(h, f) {
    return h[f] != null && h[f] !== "auto";
  }
  function u(h, f, v) {
    Ba(h, function(c) {
      f[c] = v[c];
    });
  }
}
function kd(e) {
  return rT({}, e);
}
function rT(e, t) {
  return t && e && Ba(eT, function(r) {
    t.hasOwnProperty(r) && (e[r] = t[r]);
  }), e;
}
var iT = wt(), nt = (
  /** @class */
  (function(e) {
    G(t, e);
    function t(r, i, n) {
      var a = e.call(this, r, i, n) || this;
      return a.uid = Lo("ec_cpt_model"), a;
    }
    return t.prototype.init = function(r, i, n) {
      this.mergeDefaultAndTheme(r, n);
    }, t.prototype.mergeDefaultAndTheme = function(r, i) {
      var n = no(this), a = n ? kd(r) : {}, o = i.getTheme();
      _t(r, o.get(this.mainType)), _t(r, this.getDefaultOption()), n && ao(r, a, n);
    }, t.prototype.mergeOption = function(r, i) {
      _t(this.option, r, !0);
      var n = no(this);
      n && ao(this.option, r, n);
    }, t.prototype.optionUpdated = function(r, i) {
    }, t.prototype.getDefaultOption = function() {
      var r = this.constructor;
      if (!c1(r))
        return r.defaultOption;
      var i = iT(this);
      if (!i.defaultOption) {
        for (var n = [], a = r; a; ) {
          var o = a.prototype.defaultOption;
          o && n.push(o), a = a.superClass;
        }
        for (var s = {}, l = n.length - 1; l >= 0; l--)
          s = _t(s, n[l], !0);
        i.defaultOption = s;
      }
      return i.defaultOption;
    }, t.prototype.getReferringComponents = function(r, i) {
      var n = r + "Index", a = r + "Id";
      return Gn(this.ecModel, r, {
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
  })(vt)
);
Uv(nt, vt);
ou(nt);
Fb(nt);
zb(nt, nT);
function nT(e) {
  var t = [];
  return D(nt.getClassesByMainType(e), function(r) {
    t = t.concat(r.dependencies || r.prototype.dependencies || []);
  }), t = J(t, function(r) {
    return De(r).main;
  }), e !== "dataset" && ot(t, "dataset") <= 0 && t.unshift("dataset"), t;
}
var Ed = "";
typeof navigator < "u" && (Ed = navigator.platform || "");
var ni = "rgba(0, 0, 0, 0.2)";
const aT = {
  darkMode: "auto",
  // backgroundColor: 'rgba(0,0,0,0)',
  colorBy: "series",
  color: ["#5470c6", "#91cc75", "#fac858", "#ee6666", "#73c0de", "#3ba272", "#fc8452", "#9a60b4", "#ea7ccc"],
  gradientColor: ["#f6efa6", "#d88273", "#bf444c"],
  aria: {
    decal: {
      decals: [{
        color: ni,
        dashArrayX: [1, 0],
        dashArrayY: [2, 5],
        symbolSize: 1,
        rotation: Math.PI / 6
      }, {
        color: ni,
        symbol: "circle",
        dashArrayX: [[8, 8], [0, 8, 8, 0]],
        dashArrayY: [6, 0],
        symbolSize: 0.8
      }, {
        color: ni,
        dashArrayX: [1, 0],
        dashArrayY: [4, 3],
        rotation: -Math.PI / 4
      }, {
        color: ni,
        dashArrayX: [[6, 6], [0, 6, 6, 0]],
        dashArrayY: [6, 0]
      }, {
        color: ni,
        dashArrayX: [[1, 0], [1, 6]],
        dashArrayY: [1, 0, 6, 0],
        rotation: Math.PI / 4
      }, {
        color: ni,
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
    fontFamily: Ed.match(/^Win/) ? "Microsoft YaHei" : "sans-serif",
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
var $d = tt(["tooltip", "label", "itemName", "itemId", "itemGroupId", "itemChildGroupId", "seriesName"]), Re = "original", Gt = "arrayRows", ge = "objectRows", ke = "keyedColumns", sr = "typedArray", Od = "unknown", ze = "column", Ri = "row", xt = {
  Must: 1,
  Might: 2,
  Not: 3
  // Other cases
}, oT = wt();
function sT(e) {
  oT(e).datasetMap = tt();
}
function lT(e, t, r) {
  var i = {}, n = Bd(e);
  if (!n)
    return i;
  var a = t.sourceFormat, o = t.dimensionsDefine, s;
  (a === ge || a === ke) && D(o, function(h, f) {
    (F(h) ? h.name : h) === "name" && (s = f);
  });
  var l = (function() {
    for (var h = {}, f = {}, v = [], c = 0, d = Math.min(5, r); c < d; c++) {
      var _ = Fd(t.data, a, t.seriesLayoutBy, o, t.startIndex, c);
      v.push(_);
      var p = _ === xt.Not;
      if (p && h.v == null && c !== s && (h.v = c), (h.n == null || h.n === h.v || !p && v[h.n] === xt.Not) && (h.n = c), g(h) && v[h.n] !== xt.Not)
        return h;
      p || (_ === xt.Might && f.v == null && c !== s && (f.v = c), (f.n == null || f.n === f.v) && (f.n = c));
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
function Bd(e) {
  var t = e.get("data", !0);
  if (!t)
    return Gn(e.ecModel, "dataset", {
      index: e.get("datasetIndex", !0),
      id: e.get("datasetId", !0)
    }, nu).models[0];
}
function uT(e) {
  return !e.get("transform", !0) && !e.get("fromTransformResult", !0) ? [] : Gn(e.ecModel, "dataset", {
    index: e.get("fromDatasetIndex", !0),
    id: e.get("fromDatasetId", !0)
  }, nu).models;
}
function Nd(e, t) {
  return Fd(e.data, e.sourceFormat, e.seriesLayoutBy, e.dimensionsDefine, e.startIndex, t);
}
function Fd(e, t, r, i, n, a) {
  var o, s = 5;
  if (Ut(e))
    return xt.Not;
  var l, u;
  if (i) {
    var h = i[a];
    F(h) ? (l = h.name, u = h.type) : V(h) && (l = h);
  }
  if (u != null)
    return u === "ordinal" ? xt.Must : xt.Not;
  if (t === Gt) {
    var f = e;
    if (r === Ri) {
      for (var v = f[a], c = 0; c < (v || []).length && c < s; c++)
        if ((o = w(v[n + c])) != null)
          return o;
    } else
      for (var c = 0; c < f.length && c < s; c++) {
        var d = f[n + c];
        if (d && (o = w(d[a])) != null)
          return o;
      }
  } else if (t === ge) {
    var _ = e;
    if (!l)
      return xt.Not;
    for (var c = 0; c < _.length && c < s; c++) {
      var p = _[c];
      if (p && (o = w(p[l])) != null)
        return o;
    }
  } else if (t === ke) {
    var g = e;
    if (!l)
      return xt.Not;
    var v = g[l];
    if (!v || Ut(v))
      return xt.Not;
    for (var c = 0; c < v.length && c < s; c++)
      if ((o = w(v[c])) != null)
        return o;
  } else if (t === Re)
    for (var m = e, c = 0; c < m.length && c < s; c++) {
      var p = m[c], y = To(p);
      if (!$(y))
        return xt.Not;
      if ((o = w(y[a])) != null)
        return o;
    }
  function w(b) {
    var S = V(b);
    if (b != null && Number.isFinite(Number(b)) && b !== "")
      return S ? xt.Might : xt.Not;
    if (S && b !== "-")
      return xt.Must;
  }
  return xt.Not;
}
var hT = tt();
function fT(e, t, r) {
  var i = hT.get(t);
  if (!i)
    return r;
  var n = i(e);
  return n ? r.concat(n) : r;
}
var yf = wt();
wt();
var xu = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getColorFromPalette = function(t, r, i) {
      var n = kt(this.get("color", !0)), a = this.get("colorLayer", !0);
      return vT(this, yf, n, a, t, r, i);
    }, e.prototype.clearColorPalette = function() {
      dT(this, yf);
    }, e;
  })()
);
function cT(e, t) {
  for (var r = e.length, i = 0; i < r; i++)
    if (e[i].length > t)
      return e[i];
  return e[r - 1];
}
function vT(e, t, r, i, n, a, o) {
  a = a || e;
  var s = t(a), l = s.paletteIdx || 0, u = s.paletteNameMap = s.paletteNameMap || {};
  if (u.hasOwnProperty(n))
    return u[n];
  var h = o == null || !i ? r : cT(i, o);
  if (h = h || r, !(!h || !h.length)) {
    var f = h[l];
    return n && (u[n] = f), s.paletteIdx = (l + 1) % h.length, f;
  }
}
function dT(e, t) {
  t(e).paletteIdx = 0, t(e).paletteNameMap = {};
}
var va, Wi, wf, Sf = "\0_ec_inner", pT = 1, Cu = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.init = function(r, i, n, a, o, s) {
      a = a || {}, this.option = null, this._theme = new vt(a), this._locale = new vt(o), this._optionManager = s;
    }, t.prototype.setOption = function(r, i, n) {
      var a = xf(i);
      this._optionManager.setOption(r, n, a), this._resetOption(null, a);
    }, t.prototype.resetOption = function(r, i) {
      return this._resetOption(r, xf(i));
    }, t.prototype._resetOption = function(r, i) {
      var n = !1, a = this._optionManager;
      if (!r || r === "recreate") {
        var o = a.mountOption(r === "recreate");
        !this.option || r === "recreate" ? wf(this, o) : (this.restoreData(), this._mergeOption(o, i)), n = !0;
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
      var n = this.option, a = this._componentsMap, o = this._componentsCount, s = [], l = tt(), u = i && i.replaceMergeMainTypeMap;
      sT(this), D(r, function(f, v) {
        f != null && (nt.hasClass(v) ? v && (s.push(v), l.set(v, !0)) : n[v] = n[v] == null ? j(f) : _t(n[v], f, !0));
      }), u && u.each(function(f, v) {
        nt.hasClass(v) && !l.get(v) && (s.push(v), l.set(v, !0));
      }), nt.topologicalTravel(s, nt.getAllClassMainTypes(), h, this);
      function h(f) {
        var v = fT(this, f, kt(r[f])), c = a.get(f), d = (
          // `!oldCmptList` means init. See the comment in `mappingToExists`
          c ? u && u.get(f) ? "replaceMerge" : "normalMerge" : "replaceAll"
        ), _ = jw(c, v, d);
        a1(_, f, nt), n[f] = null, a.set(f, null), o.set(f, 0);
        var p = [], g = [], m = 0, y;
        D(_, function(w, b) {
          var S = w.existing, T = w.newOption;
          if (!T)
            S && (S.mergeOption({}, this), S.optionUpdated({}, !1));
          else {
            var x = f === "series", C = nt.getClass(
              f,
              w.keyInfo.subType,
              !x
              // Give a more detailed warn later if series don't exists
            );
            if (!C)
              return;
            if (f === "tooltip") {
              if (y)
                return;
              y = !0;
            }
            if (S && S.constructor === C)
              S.name = w.keyInfo.name, S.mergeOption(T, this), S.optionUpdated(T, !1);
            else {
              var M = R({
                componentIndex: b
              }, w.keyInfo);
              S = new C(T, this, this, M), R(S, M), w.brandNew && (S.__requireNewView = !0), S.init(T, this, this), S.optionUpdated(null, !0);
            }
          }
          S ? (p.push(S.option), g.push(S), m++) : (p.push(void 0), g.push(void 0));
        }, this), n[f] = p, a.set(f, g), o.set(f, m), f === "series" && va(this);
      }
      this._seriesIndices || va(this);
    }, t.prototype.getOption = function() {
      var r = j(this.option);
      return D(r, function(i, n) {
        if (nt.hasClass(n)) {
          for (var a = kt(i), o = a.length, s = !1, l = o - 1; l >= 0; l--)
            a[l] && !Pn(a[l]) ? s = !0 : (a[l] = null, !s && o--);
          a.length = o, r[n] = a;
        }
      }), delete r[Sf], r;
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
      return n != null ? (l = [], D(kt(n), function(u) {
        s[u] && l.push(s[u]);
      })) : a != null ? l = bf("id", a, s) : o != null ? l = bf("name", o, s) : l = ce(s, function(u) {
        return !!u;
      }), Tf(l, r);
    }, t.prototype.findComponents = function(r) {
      var i = r.query, n = r.mainType, a = s(i), o = a ? this.queryComponents(a) : ce(this._componentsMap.get(n), function(u) {
        return !!u;
      });
      return l(Tf(o, r));
      function s(u) {
        var h = n + "Index", f = n + "Id", v = n + "Name";
        return u && (u[h] != null || u[f] != null || u[v] != null) ? {
          mainType: n,
          // subType will be filtered finally.
          index: u[h],
          id: u[f],
          name: u[v]
        } : null;
      }
      function l(u) {
        return r.filter ? ce(u, r.filter) : u;
      }
    }, t.prototype.eachComponent = function(r, i, n) {
      var a = this._componentsMap;
      if (rt(r)) {
        var o = i, s = r;
        a.each(function(f, v) {
          for (var c = 0; f && c < f.length; c++) {
            var d = f[c];
            d && s.call(o, v, d, d.componentIndex);
          }
        });
      } else
        for (var l = V(r) ? a.get(r) : F(r) ? this.findComponents(r) : null, u = 0; l && u < l.length; u++) {
          var h = l[u];
          h && i.call(n, h, h.componentIndex);
        }
    }, t.prototype.getSeriesByName = function(r) {
      var i = Ae(r, null);
      return ce(this._componentsMap.get("series"), function(n) {
        return !!n && i != null && n.name === i;
      });
    }, t.prototype.getSeriesByIndex = function(r) {
      return this._componentsMap.get("series")[r];
    }, t.prototype.getSeriesByType = function(r) {
      return ce(this._componentsMap.get("series"), function(i) {
        return !!i && i.subType === r;
      });
    }, t.prototype.getSeries = function() {
      return ce(this._componentsMap.get("series"), function(r) {
        return !!r;
      });
    }, t.prototype.getSeriesCount = function() {
      return this._componentsCount.get("series");
    }, t.prototype.eachSeries = function(r, i) {
      Wi(this), D(this._seriesIndices, function(n) {
        var a = this._componentsMap.get("series")[n];
        r.call(i, a, n);
      }, this);
    }, t.prototype.eachRawSeries = function(r, i) {
      D(this._componentsMap.get("series"), function(n) {
        n && r.call(i, n, n.componentIndex);
      });
    }, t.prototype.eachSeriesByType = function(r, i, n) {
      Wi(this), D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        o.subType === r && i.call(n, o, a);
      }, this);
    }, t.prototype.eachRawSeriesByType = function(r, i, n) {
      return D(this.getSeriesByType(r), i, n);
    }, t.prototype.isSeriesFiltered = function(r) {
      return Wi(this), this._seriesIndicesMap.get(r.componentIndex) == null;
    }, t.prototype.getCurrentSeriesIndices = function() {
      return (this._seriesIndices || []).slice();
    }, t.prototype.filterSeries = function(r, i) {
      Wi(this);
      var n = [];
      D(this._seriesIndices, function(a) {
        var o = this._componentsMap.get("series")[a];
        r.call(i, o, a) && n.push(a);
      }, this), this._seriesIndices = n, this._seriesIndicesMap = tt(n);
    }, t.prototype.restoreData = function(r) {
      va(this);
      var i = this._componentsMap, n = [];
      i.each(function(a, o) {
        nt.hasClass(o) && n.push(o);
      }), nt.topologicalTravel(n, nt.getAllClassMainTypes(), function(a) {
        D(i.get(a), function(o) {
          o && (a !== "series" || !gT(o, r)) && o.restoreData();
        });
      });
    }, t.internalField = (function() {
      va = function(r) {
        var i = r._seriesIndices = [];
        D(r._componentsMap.get("series"), function(n) {
          n && i.push(n.componentIndex);
        }), r._seriesIndicesMap = tt(i);
      }, Wi = function(r) {
      }, wf = function(r, i) {
        r.option = {}, r.option[Sf] = pT, r._componentsMap = tt({
          series: []
        }), r._componentsCount = tt();
        var n = i.aria;
        F(n) && n.enabled == null && (n.enabled = !0), _T(i, r._theme.option), _t(i, aT, !1), r._mergeOption(i, null);
      };
    })(), t;
  })(vt)
);
function gT(e, t) {
  if (t) {
    var r = t.seriesIndex, i = t.seriesId, n = t.seriesName;
    return r != null && e.componentIndex !== r || i != null && e.id !== i || n != null && e.name !== n;
  }
}
function _T(e, t) {
  var r = e.color && !e.colorLayer;
  D(t, function(i, n) {
    n === "colorLayer" && r || nt.hasClass(n) || (typeof i == "object" ? e[n] = e[n] ? _t(e[n], i, !1) : j(i) : e[n] == null && (e[n] = i));
  });
}
function bf(e, t, r) {
  if ($(t)) {
    var i = tt();
    return D(t, function(a) {
      if (a != null) {
        var o = Ae(a, null);
        o != null && i.set(a, !0);
      }
    }), ce(r, function(a) {
      return a && i.get(a[e]);
    });
  } else {
    var n = Ae(t, null);
    return ce(r, function(a) {
      return a && n != null && a[e] === n;
    });
  }
}
function Tf(e, t) {
  return t.hasOwnProperty("subType") ? ce(e, function(r) {
    return r && r.subType === t.subType;
  }) : e;
}
function xf(e) {
  var t = tt();
  return e && D(kt(e.replaceMerge), function(r) {
    t.set(r, !0);
  }), {
    replaceMergeMainTypeMap: t
  };
}
Ge(Cu, xu);
var mT = [
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
], zd = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      D(mT, function(r) {
        this[r] = st(t[r], t);
      }, this);
    }
    return e;
  })()
), xs = {}, Hd = (
  /** @class */
  (function() {
    function e() {
      this._coordinateSystems = [];
    }
    return e.prototype.create = function(t, r) {
      var i = [];
      D(xs, function(n, a) {
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
      xs[t] = r;
    }, e.get = function(t) {
      return xs[t];
    }, e;
  })()
), yT = /^(min|max)?(.+)$/, wT = (
  /** @class */
  (function() {
    function e(t) {
      this._timelineOptions = [], this._mediaList = [], this._currentMediaIndices = [], this._api = t;
    }
    return e.prototype.setOption = function(t, r, i) {
      t && (D(kt(t.series), function(o) {
        o && o.data && Ut(o.data) && Zs(o.data);
      }), D(kt(t.dataset), function(o) {
        o && o.source && Ut(o.source) && Zs(o.source);
      })), t = j(t);
      var n = this._optionBackup, a = ST(t, r, !n);
      this._newBaseOption = a.baseOption, n ? (a.timelineOptions.length && (n.timelineOptions = a.timelineOptions), a.mediaList.length && (n.mediaList = a.mediaList), a.mediaDefault && (n.mediaDefault = a.mediaDefault)) : this._optionBackup = a;
    }, e.prototype.mountOption = function(t) {
      var r = this._optionBackup;
      return this._timelineOptions = r.timelineOptions, this._mediaList = r.mediaList, this._mediaDefault = r.mediaDefault, this._currentMediaIndices = [], j(t ? r.baseOption : this._newBaseOption);
    }, e.prototype.getTimelineOption = function(t) {
      var r, i = this._timelineOptions;
      if (i.length) {
        var n = t.getComponent("timeline");
        n && (r = j(
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
        bT(n[l].query, r, i) && o.push(l);
      return !o.length && a && (o = [-1]), o.length && !xT(o, this._currentMediaIndices) && (s = J(o, function(h) {
        return j(h === -1 ? a.option : n[h].option);
      })), this._currentMediaIndices = o, s;
    }, e;
  })()
);
function ST(e, t, r) {
  var i = [], n, a, o = e.baseOption, s = e.timeline, l = e.options, u = e.media, h = !!e.media, f = !!(l || s || o && o.timeline);
  o ? (a = o, a.timeline || (a.timeline = s)) : ((f || h) && (e.options = e.media = null), a = e), h && $(u) && D(u, function(c) {
    c && c.option && (c.query ? i.push(c) : n || (n = c));
  }), v(a), D(l, function(c) {
    return v(c);
  }), D(i, function(c) {
    return v(c.option);
  });
  function v(c) {
    D(t, function(d) {
      d(c, r);
    });
  }
  return {
    baseOption: a,
    timelineOptions: l || [],
    mediaDefault: n,
    mediaList: i
  };
}
function bT(e, t, r) {
  var i = {
    width: t,
    height: r,
    aspectratio: t / r
    // lower case for convenience.
  }, n = !0;
  return D(e, function(a, o) {
    var s = o.match(yT);
    if (!(!s || !s[1] || !s[2])) {
      var l = s[1], u = s[2].toLowerCase();
      TT(i[u], a, l) || (n = !1);
    }
  }), n;
}
function TT(e, t, r) {
  return r === "min" ? e >= t : r === "max" ? e <= t : e === t;
}
function xT(e, t) {
  return e.join(",") === t.join(",");
}
var le = D, En = F, Cf = ["areaStyle", "lineStyle", "nodeStyle", "linkStyle", "chordStyle", "label", "labelLine"];
function Cs(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0, i = Cf.length; r < i; r++) {
      var n = Cf[r], a = t.normal, o = t.emphasis;
      a && a[n] && (e[n] = e[n] || {}, e[n].normal ? _t(e[n].normal, a[n]) : e[n].normal = a[n], a[n] = null), o && o[n] && (e[n] = e[n] || {}, e[n].emphasis ? _t(e[n].emphasis, o[n]) : e[n].emphasis = o[n], o[n] = null);
    }
}
function Pt(e, t, r) {
  if (e && e[t] && (e[t].normal || e[t].emphasis)) {
    var i = e[t].normal, n = e[t].emphasis;
    i && (r ? (e[t].normal = e[t].emphasis = null, ut(e[t], i)) : e[t] = i), n && (e.emphasis = e.emphasis || {}, e.emphasis[t] = n, n.focus && (e.emphasis.focus = n.focus), n.blurScope && (e.emphasis.blurScope = n.blurScope));
  }
}
function sn(e) {
  Pt(e, "itemStyle"), Pt(e, "lineStyle"), Pt(e, "areaStyle"), Pt(e, "label"), Pt(e, "labelLine"), Pt(e, "upperLabel"), Pt(e, "edgeLabel");
}
function ft(e, t) {
  var r = En(e) && e[t], i = En(r) && r.textStyle;
  if (i)
    for (var n = 0, a = Ih.length; n < a; n++) {
      var o = Ih[n];
      i.hasOwnProperty(o) && (r[o] = i[o]);
    }
}
function re(e) {
  e && (sn(e), ft(e, "label"), e.emphasis && ft(e.emphasis, "label"));
}
function CT(e) {
  if (En(e)) {
    Cs(e), sn(e), ft(e, "label"), ft(e, "upperLabel"), ft(e, "edgeLabel"), e.emphasis && (ft(e.emphasis, "label"), ft(e.emphasis, "upperLabel"), ft(e.emphasis, "edgeLabel"));
    var t = e.markPoint;
    t && (Cs(t), re(t));
    var r = e.markLine;
    r && (Cs(r), re(r));
    var i = e.markArea;
    i && re(i);
    var n = e.data;
    if (e.type === "graph") {
      n = n || e.nodes;
      var a = e.links || e.edges;
      if (a && !Ut(a))
        for (var o = 0; o < a.length; o++)
          re(a[o]);
      D(e.categories, function(u) {
        sn(u);
      });
    }
    if (n && !Ut(n))
      for (var o = 0; o < n.length; o++)
        re(n[o]);
    if (t = e.markPoint, t && t.data)
      for (var s = t.data, o = 0; o < s.length; o++)
        re(s[o]);
    if (r = e.markLine, r && r.data)
      for (var l = r.data, o = 0; o < l.length; o++)
        $(l[o]) ? (re(l[o][0]), re(l[o][1])) : re(l[o]);
    e.type === "gauge" ? (ft(e, "axisLabel"), ft(e, "title"), ft(e, "detail")) : e.type === "treemap" ? (Pt(e.breadcrumb, "itemStyle"), D(e.levels, function(u) {
      sn(u);
    })) : e.type === "tree" && sn(e.leaves);
  }
}
function Oe(e) {
  return $(e) ? e : e ? [e] : [];
}
function Df(e) {
  return ($(e) ? e[0] : e) || {};
}
function DT(e, t) {
  le(Oe(e.series), function(i) {
    En(i) && CT(i);
  });
  var r = ["xAxis", "yAxis", "radiusAxis", "angleAxis", "singleAxis", "parallelAxis", "radar"];
  t && r.push("valueAxis", "categoryAxis", "logAxis", "timeAxis"), le(r, function(i) {
    le(Oe(e[i]), function(n) {
      n && (ft(n, "axisLabel"), ft(n.axisPointer, "label"));
    });
  }), le(Oe(e.parallel), function(i) {
    var n = i && i.parallelAxisDefault;
    ft(n, "axisLabel"), ft(n && n.axisPointer, "label");
  }), le(Oe(e.calendar), function(i) {
    Pt(i, "itemStyle"), ft(i, "dayLabel"), ft(i, "monthLabel"), ft(i, "yearLabel");
  }), le(Oe(e.radar), function(i) {
    ft(i, "name"), i.name && i.axisName == null && (i.axisName = i.name, delete i.name), i.nameGap != null && i.axisNameGap == null && (i.axisNameGap = i.nameGap, delete i.nameGap);
  }), le(Oe(e.geo), function(i) {
    En(i) && (re(i), le(Oe(i.regions), function(n) {
      re(n);
    }));
  }), le(Oe(e.timeline), function(i) {
    re(i), Pt(i, "label"), Pt(i, "itemStyle"), Pt(i, "controlStyle", !0);
    var n = i.data;
    $(n) && D(n, function(a) {
      F(a) && (Pt(a, "label"), Pt(a, "itemStyle"));
    });
  }), le(Oe(e.toolbox), function(i) {
    Pt(i, "iconStyle"), le(i.feature, function(n) {
      Pt(n, "iconStyle");
    });
  }), ft(Df(e.axisPointer), "label"), ft(Df(e.tooltip).axisPointer, "label");
}
function MT(e, t) {
  for (var r = t.split(","), i = e, n = 0; n < r.length && (i = i && i[r[n]], i != null); n++)
    ;
  return i;
}
function AT(e, t, r, i) {
  for (var n = t.split(","), a = e, o, s = 0; s < n.length - 1; s++)
    o = n[s], a[o] == null && (a[o] = {}), a = a[o];
  a[n[s]] == null && (a[n[s]] = r);
}
function Mf(e) {
  e && D(PT, function(t) {
    t[0] in e && !(t[1] in e) && (e[t[1]] = e[t[0]]);
  });
}
var PT = [["x", "left"], ["y", "top"], ["x2", "right"], ["y2", "bottom"]], LT = ["grid", "geo", "parallel", "legend", "toolbox", "title", "visualMap", "dataZoom", "timeline"], Ds = [["borderRadius", "barBorderRadius"], ["borderColor", "barBorderColor"], ["borderWidth", "barBorderWidth"]];
function Yi(e) {
  var t = e && e.itemStyle;
  if (t)
    for (var r = 0; r < Ds.length; r++) {
      var i = Ds[r][1], n = Ds[r][0];
      t[i] != null && (t[n] = t[i]);
    }
}
function Af(e) {
  e && e.alignTo === "edge" && e.margin != null && e.edgeDistance == null && (e.edgeDistance = e.margin);
}
function Pf(e) {
  e && e.downplay && !e.blur && (e.blur = e.downplay);
}
function IT(e) {
  e && e.focusNodeAdjacency != null && (e.emphasis = e.emphasis || {}, e.emphasis.focus == null && (e.emphasis.focus = "adjacency"));
}
function Vd(e, t) {
  if (e)
    for (var r = 0; r < e.length; r++)
      t(e[r]), e[r] && Vd(e[r].children, t);
}
function Ud(e, t) {
  DT(e, t), e.series = kt(e.series), D(e.series, function(r) {
    if (F(r)) {
      var i = r.type;
      if (i === "line")
        r.clipOverflow != null && (r.clip = r.clipOverflow);
      else if (i === "pie" || i === "gauge") {
        r.clockWise != null && (r.clockwise = r.clockWise), Af(r.label);
        var n = r.data;
        if (n && !Ut(n))
          for (var a = 0; a < n.length; a++)
            Af(n[a]);
        r.hoverOffset != null && (r.emphasis = r.emphasis || {}, (r.emphasis.scaleSize = null) && (r.emphasis.scaleSize = r.hoverOffset));
      } else if (i === "gauge") {
        var o = MT(r, "pointer.color");
        o != null && AT(r, "itemStyle.color", o);
      } else if (i === "bar") {
        Yi(r), Yi(r.backgroundStyle), Yi(r.emphasis);
        var n = r.data;
        if (n && !Ut(n))
          for (var a = 0; a < n.length; a++)
            typeof n[a] == "object" && (Yi(n[a]), Yi(n[a] && n[a].emphasis));
      } else if (i === "sunburst") {
        var s = r.highlightPolicy;
        s && (r.emphasis = r.emphasis || {}, r.emphasis.focus || (r.emphasis.focus = s)), Pf(r), Vd(r.data, Pf);
      } else i === "graph" || i === "sankey" ? IT(r) : i === "map" && (r.mapType && !r.map && (r.map = r.mapType), r.mapLocation && ut(r, r.mapLocation));
      r.hoverAnimation != null && (r.emphasis = r.emphasis || {}, r.emphasis && r.emphasis.scale == null && (r.emphasis.scale = r.hoverAnimation)), Mf(r);
    }
  }), e.dataRange && (e.visualMap = e.dataRange), D(LT, function(r) {
    var i = e[r];
    i && ($(i) || (i = [i]), D(i, function(n) {
      Mf(n);
    }));
  });
}
function RT(e) {
  var t = tt();
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
  }), t.each(kT);
}
function kT(e) {
  D(e, function(t, r) {
    var i = [], n = [NaN, NaN], a = [t.stackResultDimension, t.stackedOverDimension], o = t.data, s = t.isStackedByIndex, l = t.seriesModel.get("stackStrategy") || "samesign";
    o.modify(a, function(u, h, f) {
      var v = o.get(t.stackedDimension, f);
      if (isNaN(v))
        return n;
      var c, d;
      s ? d = o.getRawIndex(f) : c = o.get(t.stackedByDimension, f);
      for (var _ = NaN, p = r - 1; p >= 0; p--) {
        var g = e[p];
        if (s || (d = g.data.rawIndexOf(g.stackedByDimension, c)), d >= 0) {
          var m = g.data.getByRawIndex(g.stackResultDimension, d);
          if (l === "all" || l === "positive" && m > 0 || l === "negative" && m < 0 || l === "samesign" && v >= 0 && m > 0 || l === "samesign" && v <= 0 && m < 0) {
            v = Xw(v, m), _ = m;
            break;
          }
        }
      }
      return i[0] = v, i[1] = _, i;
    });
  });
}
var Io = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      this.data = t.data || (t.sourceFormat === ke ? {} : []), this.sourceFormat = t.sourceFormat || Od, this.seriesLayoutBy = t.seriesLayoutBy || ze, this.startIndex = t.startIndex || 0, this.dimensionsDetectedCount = t.dimensionsDetectedCount, this.metaRawOption = t.metaRawOption;
      var r = this.dimensionsDefine = t.dimensionsDefine;
      if (r)
        for (var i = 0; i < r.length; i++) {
          var n = r[i];
          n.type == null && Nd(this, i) === xt.Must && (n.type = "ordinal");
        }
    }
    return e;
  })()
);
function Du(e) {
  return e instanceof Io;
}
function xl(e, t, r) {
  r = r || Wd(e);
  var i = t.seriesLayoutBy, n = $T(e, r, i, t.sourceHeader, t.dimensions), a = new Io({
    data: e,
    sourceFormat: r,
    seriesLayoutBy: i,
    dimensionsDefine: n.dimensionsDefine,
    startIndex: n.startIndex,
    dimensionsDetectedCount: n.dimensionsDetectedCount,
    metaRawOption: j(t)
  });
  return a;
}
function Gd(e) {
  return new Io({
    data: e,
    sourceFormat: Ut(e) ? sr : Re
  });
}
function ET(e) {
  return new Io({
    data: e.data,
    sourceFormat: e.sourceFormat,
    seriesLayoutBy: e.seriesLayoutBy,
    dimensionsDefine: j(e.dimensionsDefine),
    startIndex: e.startIndex,
    dimensionsDetectedCount: e.dimensionsDetectedCount
  });
}
function Wd(e) {
  var t = Od;
  if (Ut(e))
    t = sr;
  else if ($(e)) {
    e.length === 0 && (t = Gt);
    for (var r = 0, i = e.length; r < i; r++) {
      var n = e[r];
      if (n != null) {
        if ($(n) || Ut(n)) {
          t = Gt;
          break;
        } else if (F(n)) {
          t = ge;
          break;
        }
      }
    }
  } else if (F(e)) {
    for (var a in e)
      if (Ci(e, a) && Vt(e[a])) {
        t = ke;
        break;
      }
  }
  return t;
}
function $T(e, t, r, i, n) {
  var a, o;
  if (!e)
    return {
      dimensionsDefine: Lf(n),
      startIndex: o,
      dimensionsDetectedCount: a
    };
  if (t === Gt) {
    var s = e;
    i === "auto" || i == null ? If(function(u) {
      u != null && u !== "-" && (V(u) ? o == null && (o = 1) : o = 0);
    }, r, s, 10) : o = mt(i) ? i : i ? 1 : 0, !n && o === 1 && (n = [], If(function(u, h) {
      n[h] = u != null ? u + "" : "";
    }, r, s, 1 / 0)), a = n ? n.length : r === Ri ? s.length : s[0] ? s[0].length : null;
  } else if (t === ge)
    n || (n = OT(e));
  else if (t === ke)
    n || (n = [], D(e, function(u, h) {
      n.push(h);
    }));
  else if (t === Re) {
    var l = To(e[0]);
    a = $(l) && l.length || 1;
  }
  return {
    startIndex: o,
    dimensionsDefine: Lf(n),
    dimensionsDetectedCount: a
  };
}
function OT(e) {
  for (var t = 0, r; t < e.length && !(r = e[t++]); )
    ;
  if (r)
    return dt(r);
}
function Lf(e) {
  if (e) {
    var t = tt();
    return J(e, function(r, i) {
      r = F(r) ? r : {
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
function If(e, t, r, i) {
  if (t === Ri)
    for (var n = 0; n < r.length && n < i; n++)
      e(r[n] ? r[n][0] : null, n);
  else
    for (var a = r[0] || [], n = 0; n < a.length && n < i; n++)
      e(a[n], n);
}
function Yd(e) {
  var t = e.sourceFormat;
  return t === ge || t === ke;
}
var Ir, Rr, kr, Rf, kf, Xd = (
  /** @class */
  (function() {
    function e(t, r) {
      var i = Du(t) ? t : Gd(t);
      this._source = i;
      var n = this._data = i.data;
      i.sourceFormat === sr && (this._offset = 0, this._dimSize = r, this._data = n), kf(this, n, i);
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
      kf = function(o, s, l) {
        var u = l.sourceFormat, h = l.seriesLayoutBy, f = l.startIndex, v = l.dimensionsDefine, c = Rf[Mu(u, h)];
        if (R(o, c), u === sr)
          o.getItem = r, o.count = n, o.fillStorage = i;
        else {
          var d = qd(u, h);
          o.getItem = st(d, null, s, f, v);
          var _ = Zd(u, h);
          o.count = st(_, null, s, f, v);
        }
      };
      var r = function(o, s) {
        o = o - this._offset, s = s || [];
        for (var l = this._data, u = this._dimSize, h = u * o, f = 0; f < u; f++)
          s[f] = l[h + f];
        return s;
      }, i = function(o, s, l, u) {
        for (var h = this._data, f = this._dimSize, v = 0; v < f; v++) {
          for (var c = u[v], d = c[0] == null ? 1 / 0 : c[0], _ = c[1] == null ? -1 / 0 : c[1], p = s - o, g = l[v], m = 0; m < p; m++) {
            var y = h[m * f + v];
            g[o + m] = y, y < d && (d = y), y > _ && (_ = y);
          }
          c[0] = d, c[1] = _;
        }
      }, n = function() {
        return this._data ? this._data.length / this._dimSize : 0;
      };
      Rf = (t = {}, t[Gt + "_" + ze] = {
        pure: !0,
        appendData: a
      }, t[Gt + "_" + Ri] = {
        pure: !0,
        appendData: function() {
          throw new Error('Do not support appendData when set seriesLayoutBy: "row".');
        }
      }, t[ge] = {
        pure: !0,
        appendData: a
      }, t[ke] = {
        pure: !0,
        appendData: function(o) {
          var s = this._data;
          D(o, function(l, u) {
            for (var h = s[u] || (s[u] = []), f = 0; f < (l || []).length; f++)
              h.push(l[f]);
          });
        }
      }, t[Re] = {
        appendData: a
      }, t[sr] = {
        persistent: !1,
        pure: !0,
        appendData: function(o) {
          this._data = o;
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
), Ef = function(e, t, r, i) {
  return e[i];
}, BT = (Ir = {}, Ir[Gt + "_" + ze] = function(e, t, r, i) {
  return e[i + t];
}, Ir[Gt + "_" + Ri] = function(e, t, r, i, n) {
  i += t;
  for (var a = n || [], o = e, s = 0; s < o.length; s++) {
    var l = o[s];
    a[s] = l ? l[i] : null;
  }
  return a;
}, Ir[ge] = Ef, Ir[ke] = function(e, t, r, i, n) {
  for (var a = n || [], o = 0; o < r.length; o++) {
    var s = r[o].name, l = e[s];
    a[o] = l ? l[i] : null;
  }
  return a;
}, Ir[Re] = Ef, Ir);
function qd(e, t) {
  var r = BT[Mu(e, t)];
  return r;
}
var $f = function(e, t, r) {
  return e.length;
}, NT = (Rr = {}, Rr[Gt + "_" + ze] = function(e, t, r) {
  return Math.max(0, e.length - t);
}, Rr[Gt + "_" + Ri] = function(e, t, r) {
  var i = e[0];
  return i ? Math.max(0, i.length - t) : 0;
}, Rr[ge] = $f, Rr[ke] = function(e, t, r) {
  var i = r[0].name, n = e[i];
  return n ? n.length : 0;
}, Rr[Re] = $f, Rr);
function Zd(e, t) {
  var r = NT[Mu(e, t)];
  return r;
}
var Ms = function(e, t, r) {
  return e[t];
}, FT = (kr = {}, kr[Gt] = Ms, kr[ge] = function(e, t, r) {
  return e[r];
}, kr[ke] = Ms, kr[Re] = function(e, t, r) {
  var i = To(e);
  return i instanceof Array ? i[t] : i;
}, kr[sr] = Ms, kr);
function Kd(e) {
  var t = FT[e];
  return t;
}
function Mu(e, t) {
  return e === Gt ? e + "_" + t : e;
}
function oo(e, t, r) {
  if (e) {
    var i = e.getRawDataItem(t);
    if (i != null) {
      var n = e.getStore(), a = n.getSource().sourceFormat;
      if (r != null) {
        var o = e.getDimensionIndex(r), s = n.getDimensionProperty(o);
        return Kd(a)(i, o, s);
      } else {
        var l = i;
        return a === Re && (l = To(i)), l;
      }
    }
  }
}
var zT = /\{@(.+?)\}/g, HT = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.getDataParams = function(t, r) {
      var i = this.getData(r), n = this.getRawValue(t, r), a = i.getRawIndex(t), o = i.getName(t), s = i.getRawDataItem(t), l = i.getItemVisual(t, "style"), u = l && l[i.getItemVisual(t, "drawType") || "fill"], h = l && l.stroke, f = this.mainType, v = f === "series", c = i.userOutput && i.userOutput.get();
      return {
        componentType: f,
        componentSubType: this.subType,
        componentIndex: this.componentIndex,
        seriesType: v ? this.subType : null,
        seriesIndex: this.seriesIndex,
        seriesId: v ? this.id : null,
        seriesName: v ? this.name : null,
        name: o,
        dataIndex: a,
        data: s,
        dataType: r,
        value: n,
        color: u,
        borderColor: h,
        dimensionNames: c ? c.fullDimensions : null,
        encode: c ? c.encode : null,
        // Param name list for mapping `a`, `b`, `c`, `d`, `e`
        $vars: ["seriesName", "name", "value"]
      };
    }, e.prototype.getFormattedLabel = function(t, r, i, n, a, o) {
      r = r || "normal";
      var s = this.getData(i), l = this.getDataParams(t, i);
      if (o && (l.value = o.interpolatedValue), n != null && $(l.value) && (l.value = l.value[n]), !a) {
        var u = s.getItemModel(t);
        a = u.get(r === "normal" ? ["label", "formatter"] : [r, "label", "formatter"]);
      }
      if (rt(a))
        return l.status = r, l.dimensionIndex = n, a(l);
      if (V(a)) {
        var h = Ld(a, l);
        return h.replace(zT, function(f, v) {
          var c = v.length, d = v;
          d.charAt(0) === "[" && d.charAt(c - 1) === "]" && (d = +d.slice(1, c - 1));
          var _ = oo(s, t, d);
          if (o && $(o.interpolatedValue)) {
            var p = s.getDimensionIndex(d);
            p >= 0 && (_ = o.interpolatedValue[p]);
          }
          return _ != null ? _ + "" : "";
        });
      }
    }, e.prototype.getRawValue = function(t, r) {
      return oo(this.getData(r), t);
    }, e.prototype.formatTooltip = function(t, r, i) {
    }, e;
  })()
);
function Of(e) {
  var t, r;
  return F(e) ? e.type && (r = e) : t = e, {
    text: t,
    // markers: markers || markersExisting,
    frag: r
  };
}
function wn(e) {
  return new VT(e);
}
var VT = (
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
      var v = t && t.step;
      if (r ? this._dueEnd = r._outputDueEnd : this._dueEnd = this._count ? this._count(this.context) : 1 / 0, this._progress) {
        var c = this._dueIndex, d = Math.min(v != null ? this._dueIndex + v : 1 / 0, this._dueEnd);
        if (!i && (f || c < d)) {
          var _ = this._progress;
          if ($(_))
            for (var p = 0; p < _.length; p++)
              this._doProgress(_[p], c, d, l, u);
          else
            this._doProgress(_, c, d, l, u);
        }
        this._dueIndex = d;
        var g = this._settedOutputEnd != null ? this._settedOutputEnd : d;
        this._outputDueEnd = g;
      } else
        this._dueIndex = this._outputDueEnd = this._settedOutputEnd != null ? this._settedOutputEnd : this._dueEnd;
      return this.unfinished();
    }, e.prototype.dirty = function() {
      this._dirty = !0, this._onDirty && this._onDirty(this.context);
    }, e.prototype._doProgress = function(t, r, i, n, a) {
      Bf.reset(r, i, n, a), this._callingProgress = t, this._callingProgress({
        start: r,
        end: i,
        count: i - r,
        next: Bf.next
      }, this.context);
    }, e.prototype._doReset = function(t) {
      this._dueIndex = this._outputDueEnd = this._dueEnd = 0, this._settedOutputEnd = null;
      var r, i;
      !t && this._reset && (r = this._reset(this.context), r && r.progress && (i = r.forceFirstProgress, r = r.progress), $(r) && !r.length && (r = null)), this._progress = r, this._modBy = this._modDataCount = null;
      var n = this._downstream;
      return n && n.dirty(), i;
    }, e.prototype.unfinished = function() {
      return this._progress && this._dueIndex < this._dueEnd;
    }, e.prototype.pipe = function(t) {
      (this._downstream !== t || this._dirty) && (this._downstream = t, t._upstream = this, t.dirty());
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
), Bf = /* @__PURE__ */ (function() {
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
function Na(e, t) {
  var r = t && t.type;
  return r === "ordinal" ? e : (r === "time" && !mt(e) && e != null && e !== "-" && (e = +bo(e)), e == null || e === "" ? NaN : Number(e));
}
tt({
  number: function(e) {
    return parseFloat(e);
  },
  time: function(e) {
    return +bo(e);
  },
  trim: function(e) {
    return V(e) ? Ce(e) : e;
  }
});
var UT = (
  /** @class */
  (function() {
    function e(t, r) {
      var i = t === "desc";
      this._resultLT = i ? 1 : -1, r == null && (r = i ? "min" : "max"), this._incomparable = r === "min" ? -1 / 0 : 1 / 0;
    }
    return e.prototype.evaluate = function(t, r) {
      var i = mt(t) ? t : Qa(t), n = mt(r) ? r : Qa(r), a = isNaN(i), o = isNaN(n);
      if (a && (i = this._incomparable), o && (n = this._incomparable), a && o) {
        var s = V(t), l = V(r);
        s && (i = l ? t : 0), l && (n = s ? r : 0);
      }
      return i < n ? this._resultLT : i > n ? -this._resultLT : 0;
    }, e;
  })()
), GT = (
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
      return Na(t, r);
    }, e;
  })()
);
function WT(e, t) {
  var r = new GT(), i = e.data, n = r.sourceFormat = e.sourceFormat, a = e.startIndex, o = "";
  e.seriesLayoutBy !== ze && Nt(o);
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
        Ci(l, g) && Nt(y), l[g] = m;
      }
    });
  else
    for (var h = 0; h < e.dimensionsDetectedCount; h++)
      s.push({
        index: h
      });
  var f = qd(n, ze);
  t.__isBuiltIn && (r.getRawDataItem = function(_) {
    return f(i, a, s, _);
  }, r.getRawData = st(YT, null, e)), r.cloneRawData = st(XT, null, e);
  var v = Zd(n, ze);
  r.count = st(v, null, i, a, s);
  var c = Kd(n);
  r.retrieveValue = function(_, p) {
    var g = f(i, a, s, _);
    return d(g, p);
  };
  var d = r.retrieveValueFromItem = function(_, p) {
    if (_ != null) {
      var g = s[p];
      if (g)
        return c(_, p, g.name);
    }
  };
  return r.getDimensionInfo = st(qT, null, s, l), r.cloneAllDimensionInfo = st(ZT, null, s), r;
}
function YT(e) {
  var t = e.sourceFormat;
  if (!Au(t)) {
    var r = "";
    Nt(r);
  }
  return e.data;
}
function XT(e) {
  var t = e.sourceFormat, r = e.data;
  if (!Au(t)) {
    var i = "";
    Nt(i);
  }
  if (t === Gt) {
    for (var n = [], a = 0, o = r.length; a < o; a++)
      n.push(r[a].slice());
    return n;
  } else if (t === ge) {
    for (var n = [], a = 0, o = r.length; a < o; a++)
      n.push(R({}, r[a]));
    return n;
  }
}
function qT(e, t, r) {
  if (r != null) {
    if (mt(r) || !isNaN(r) && !Ci(t, r))
      return e[r];
    if (Ci(t, r))
      return t[r];
  }
}
function ZT(e) {
  return j(e);
}
var Qd = tt();
function KT(e) {
  e = j(e);
  var t = e.type, r = "";
  t || Nt(r);
  var i = t.split(":");
  i.length !== 2 && Nt(r);
  var n = !1;
  i[0] === "echarts" && (t = i[1], n = !0), e.__isBuiltIn = n, Qd.set(t, e);
}
function QT(e, t, r) {
  var i = kt(e), n = i.length, a = "";
  n || Nt(a);
  for (var o = 0, s = n; o < s; o++) {
    var l = i[o];
    t = jT(l, t), o !== s - 1 && (t.length = Math.max(t.length, 1));
  }
  return t;
}
function jT(e, t, r, i) {
  var n = "";
  t.length || Nt(n), F(e) || Nt(n);
  var a = e.type, o = Qd.get(a);
  o || Nt(n);
  var s = J(t, function(u) {
    return WT(u, o);
  }), l = kt(o.transform({
    upstream: s[0],
    upstreamList: s,
    config: j(e.config)
  }));
  return J(l, function(u, h) {
    var f = "";
    F(u) || Nt(f), u.data || Nt(f);
    var v = Wd(u.data);
    Au(v) || Nt(f);
    var c, d = t[0];
    if (d && h === 0 && !u.dimensions) {
      var _ = d.startIndex;
      _ && (u.data = d.data.slice(0, _).concat(u.data)), c = {
        seriesLayoutBy: ze,
        sourceHeader: _,
        dimensions: d.metaRawOption.dimensions
      };
    } else
      c = {
        seriesLayoutBy: ze,
        sourceHeader: 0,
        dimensions: u.dimensions
      };
    return xl(u.data, c, null);
  });
}
function Au(e) {
  return e === Gt || e === ge;
}
var Ro = "undefined", JT = typeof Uint32Array === Ro ? Array : Uint32Array, tx = typeof Uint16Array === Ro ? Array : Uint16Array, jd = typeof Int32Array === Ro ? Array : Int32Array, Nf = typeof Float64Array === Ro ? Array : Float64Array, Jd = {
  float: Nf,
  int: jd,
  // Ordinal data type can be string or int
  ordinal: Array,
  number: Array,
  time: Nf
}, As;
function ai(e) {
  return e > 65535 ? JT : tx;
}
function oi() {
  return [1 / 0, -1 / 0];
}
function ex(e) {
  var t = e.constructor;
  return t === Array ? e.slice() : new t(e);
}
function Ff(e, t, r, i, n) {
  var a = Jd[r || "float"];
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
var Cl = (
  /** @class */
  (function() {
    function e() {
      this._chunks = [], this._rawExtent = [], this._extent = [], this._count = 0, this._rawCount = 0, this._calcDimNameToIdx = tt();
    }
    return e.prototype.initData = function(t, r, i) {
      this._provider = t, this._chunks = [], this._indices = null, this.getRawIndex = this._getRawIdxIdentity;
      var n = t.getSource(), a = this.defaultDimValueGetter = As[n.sourceFormat];
      this._dimValueGetter = i || a, this._rawExtent = [], Yd(n), this._dimensions = J(r, function(o) {
        return {
          // Only pick these two props. Not leak other properties like orderMeta.
          type: o.type,
          property: o.property
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
      }, i.set(t, a), this._chunks[a] = new Jd[r || "float"](this._rawCount), this._rawExtent[a] = oi(), a;
    }, e.prototype.collectOrdinalMeta = function(t, r) {
      var i = this._chunks[t], n = this._dimensions[t], a = this._rawExtent, o = n.ordinalOffset || 0, s = i.length;
      o === 0 && (a[t] = oi());
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
      var r = this._provider, i = this.count();
      r.appendData(t);
      var n = r.count();
      return r.persistent || (n += i), i < n && this._initDataFromProvider(i, n, !0), [i, n];
    }, e.prototype.appendValues = function(t, r) {
      for (var i = this._chunks, n = this._dimensions, a = n.length, o = this._rawExtent, s = this.count(), l = s + Math.max(t.length, r || 0), u = 0; u < a; u++) {
        var h = n[u];
        Ff(i, u, h.type, l, !0);
      }
      for (var f = [], v = s; v < l; v++)
        for (var c = v - s, d = 0; d < a; d++) {
          var h = n[d], _ = As.arrayRows.call(this, t[c] || f, h.property, c, d);
          i[d][v] = _;
          var p = o[d];
          _ < p[0] && (p[0] = _), _ > p[1] && (p[1] = _);
        }
      return this._rawCount = this._count = l, {
        start: s,
        end: l
      };
    }, e.prototype._initDataFromProvider = function(t, r, i) {
      for (var n = this._provider, a = this._chunks, o = this._dimensions, s = o.length, l = this._rawExtent, u = J(o, function(m) {
        return m.property;
      }), h = 0; h < s; h++) {
        var f = o[h];
        l[h] || (l[h] = oi()), Ff(a, h, f.type, r, i);
      }
      if (n.fillStorage)
        n.fillStorage(t, r, a, l);
      else
        for (var v = [], c = t; c < r; c++) {
          v = n.getItem(c, v);
          for (var d = 0; d < s; d++) {
            var _ = a[d], p = this._dimValueGetter(v, u[d], c, d);
            _[c] = p;
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
        var v = this.getRawIndex(h), c = r - a[v], d = Math.abs(c);
        d <= i && ((d < s || d === s && c >= 0 && l < 0) && (s = d, l = c, u = 0), c === l && (o[u++] = h));
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
        var i = ai(this._rawCount);
        t = new i(this.count());
        for (var a = 0; a < t.length; a++)
          t[a] = a;
      }
      return t;
    }, e.prototype.filter = function(t, r) {
      if (!this._count)
        return this;
      for (var i = this.clone(), n = i.count(), a = ai(i._rawCount), o = new a(n), s = [], l = t.length, u = 0, h = t[0], f = i._chunks, v = 0; v < n; v++) {
        var c = void 0, d = i.getRawIndex(v);
        if (l === 0)
          c = r(v);
        else if (l === 1) {
          var _ = f[h][d];
          c = r(_, v);
        } else {
          for (var p = 0; p < l; p++)
            s[p] = f[t[p]][d];
          s[p] = v, c = r.apply(null, s);
        }
        c && (o[u++] = d);
      }
      return u < n && (i._indices = o), i._count = u, i._extent = [], i._updateGetRawIdx(), i;
    }, e.prototype.selectRange = function(t) {
      var r = this.clone(), i = r._count;
      if (!i)
        return this;
      var n = dt(t), a = n.length;
      if (!a)
        return this;
      var o = r.count(), s = ai(r._rawCount), l = new s(o), u = 0, h = n[0], f = t[h][0], v = t[h][1], c = r._chunks, d = !1;
      if (!r._indices) {
        var _ = 0;
        if (a === 1) {
          for (var p = c[n[0]], g = 0; g < i; g++) {
            var m = p[g];
            (m >= f && m <= v || isNaN(m)) && (l[u++] = _), _++;
          }
          d = !0;
        } else if (a === 2) {
          for (var p = c[n[0]], y = c[n[1]], w = t[n[1]][0], b = t[n[1]][1], g = 0; g < i; g++) {
            var m = p[g], S = y[g];
            (m >= f && m <= v || isNaN(m)) && (S >= w && S <= b || isNaN(S)) && (l[u++] = _), _++;
          }
          d = !0;
        }
      }
      if (!d)
        if (a === 1)
          for (var g = 0; g < o; g++) {
            var T = r.getRawIndex(g), m = c[n[0]][T];
            (m >= f && m <= v || isNaN(m)) && (l[u++] = T);
          }
        else
          for (var g = 0; g < o; g++) {
            for (var x = !0, T = r.getRawIndex(g), C = 0; C < a; C++) {
              var M = n[C], m = c[M][T];
              (m < t[M][0] || m > t[M][1]) && (x = !1);
            }
            x && (l[u++] = r.getRawIndex(g));
          }
      return u < o && (r._indices = l), r._count = u, r._extent = [], r._updateGetRawIdx(), r;
    }, e.prototype.map = function(t, r) {
      var i = this.clone(t);
      return this._updateDims(i, t, r), i;
    }, e.prototype.modify = function(t, r) {
      this._updateDims(this, t, r);
    }, e.prototype._updateDims = function(t, r, i) {
      for (var n = t._chunks, a = [], o = r.length, s = t.count(), l = [], u = t._rawExtent, h = 0; h < r.length; h++)
        u[r[h]] = oi();
      for (var f = 0; f < s; f++) {
        for (var v = t.getRawIndex(f), c = 0; c < o; c++)
          l[c] = n[r[c]][v];
        l[o] = f;
        var d = i && i.apply(null, l);
        if (d != null) {
          typeof d != "object" && (a[0] = d, d = a);
          for (var h = 0; h < d.length; h++) {
            var _ = r[h], p = d[h], g = u[_], m = n[_];
            m && (m[v] = p), p < g[0] && (g[0] = p), p > g[1] && (g[1] = p);
          }
        }
      }
    }, e.prototype.lttbDownSample = function(t, r) {
      var i = this.clone([t], !0), n = i._chunks, a = n[t], o = this.count(), s = 0, l = Math.floor(1 / r), u = this.getRawIndex(0), h, f, v, c = new (ai(this._rawCount))(Math.min((Math.ceil(o / l) + 2) * 2, o));
      c[s++] = u;
      for (var d = 1; d < o - 1; d += l) {
        for (var _ = Math.min(d + l, o - 1), p = Math.min(d + l * 2, o), g = (p + _) / 2, m = 0, y = _; y < p; y++) {
          var w = this.getRawIndex(y), b = a[w];
          isNaN(b) || (m += b);
        }
        m /= p - _;
        var S = d, T = Math.min(d + l, o), x = d - 1, C = a[u];
        h = -1, v = S;
        for (var M = -1, A = 0, y = S; y < T; y++) {
          var w = this.getRawIndex(y), b = a[w];
          if (isNaN(b)) {
            A++, M < 0 && (M = w);
            continue;
          }
          f = Math.abs((x - g) * (b - C) - (x - y) * (m - C)), f > h && (h = f, v = w);
        }
        A > 0 && A < T - S && (c[s++] = Math.min(M, v), v = Math.max(M, v)), c[s++] = v, u = v;
      }
      return c[s++] = this.getRawIndex(o - 1), i._count = s, i._indices = c, i.getRawIndex = this._getRawIdx, i;
    }, e.prototype.minmaxDownSample = function(t, r) {
      for (var i = this.clone([t], !0), n = i._chunks, a = Math.floor(1 / r), o = n[t], s = this.count(), l = new (ai(this._rawCount))(Math.ceil(s / a) * 2), u = 0, h = 0; h < s; h += a) {
        var f = h, v = o[this.getRawIndex(f)], c = h, d = o[this.getRawIndex(c)], _ = a;
        h + a > s && (_ = s - h);
        for (var p = 0; p < _; p++) {
          var g = this.getRawIndex(h + p), m = o[g];
          m < v && (v = m, f = h + p), m > d && (d = m, c = h + p);
        }
        var y = this.getRawIndex(f), w = this.getRawIndex(c);
        f < c ? (l[u++] = y, l[u++] = w) : (l[u++] = w, l[u++] = y);
      }
      return i._count = u, i._indices = l, i._updateGetRawIdx(), i;
    }, e.prototype.downSample = function(t, r, i, n) {
      for (var a = this.clone([t], !0), o = a._chunks, s = [], l = Math.floor(1 / r), u = o[t], h = this.count(), f = a._rawExtent[t] = oi(), v = new (ai(this._rawCount))(Math.ceil(h / l)), c = 0, d = 0; d < h; d += l) {
        l > h - d && (l = h - d, s.length = l);
        for (var _ = 0; _ < l; _++) {
          var p = this.getRawIndex(d + _);
          s[_] = u[p];
        }
        var g = i(s), m = this.getRawIndex(Math.min(d + n(s, g) || 0, h - 1));
        u[m] = g, g < f[0] && (f[0] = g), g > f[1] && (f[1] = g), v[c++] = m;
      }
      return a._count = c, a._indices = v, a._updateGetRawIdx(), a;
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
      var r = this._chunks[t], i = oi();
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
      var i = new e(), n = this._chunks, a = t && ur(t, function(s, l) {
        return s[l] = !0, s;
      }, {});
      if (a)
        for (var o = 0; o < n.length; o++)
          i._chunks[o] = a[o] ? ex(n[o]) : n[o];
      else
        i._chunks = n;
      return this._copyCommonProps(i), r || (i._indices = this._cloneIndices()), i._updateGetRawIdx(), i;
    }, e.prototype._copyCommonProps = function(t) {
      t._count = this._count, t._rawCount = this._rawCount, t._provider = this._provider, t._dimensions = this._dimensions, t._extent = j(this._extent), t._rawExtent = j(this._rawExtent);
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
        return Na(r[a], this._dimensions[a]);
      }
      As = {
        arrayRows: t,
        objectRows: function(r, i, n, a) {
          return Na(r[i], this._dimensions[a]);
        },
        keyedColumns: t,
        original: function(r, i, n, a) {
          var o = r && (r.value == null ? r : r.value);
          return Na(o instanceof Array ? o[a] : o, this._dimensions[a]);
        },
        typedArray: function(r, i, n, a) {
          return r[a];
        }
      };
    })(), e;
  })()
), rx = (
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
      if (da(t)) {
        var o = t, s = void 0, l = void 0, u = void 0;
        if (i) {
          var h = r[0];
          h.prepareSource(), u = h.getSource(), s = u.data, l = u.sourceFormat, a = [h._getVersionSign()];
        } else
          s = o.get("data", !0), l = Ut(s) ? sr : Re, a = [];
        var f = this._getSourceMetaRawOption() || {}, v = u && u.metaRawOption || {}, c = K(f.seriesLayoutBy, v.seriesLayoutBy) || null, d = K(f.sourceHeader, v.sourceHeader), _ = K(f.dimensions, v.dimensions), p = c !== v.seriesLayoutBy || !!d != !!v.sourceHeader || _;
        n = p ? [xl(s, {
          seriesLayoutBy: c,
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
          n = [xl(y, this._getSourceMetaRawOption(), null)], a = [];
        }
      }
      this._setLocalSource(n, a);
    }, e.prototype._applyTransform = function(t) {
      var r = this._sourceHost, i = r.get("transform", !0), n = r.get("fromTransformResult", !0);
      if (n != null) {
        var a = "";
        t.length !== 1 && zf(a);
      }
      var o, s = [], l = [];
      return D(t, function(u) {
        u.prepareSource();
        var h = u.getSource(n || 0), f = "";
        n != null && !h && zf(f), s.push(h), l.push(u._getVersionSign());
      }), i ? o = QT(i, s, {
        datasetIndex: r.componentIndex
      }) : n != null && (o = [ET(s[0])]), {
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
      var r = t.makeStoreSchema();
      return this._innerGetDataStore(r.dimensions, t.source, r.hash);
    }, e.prototype._innerGetDataStore = function(t, r, i) {
      var n = 0, a = this._storeList, o = a[n];
      o || (o = a[n] = {});
      var s = o[i];
      if (!s) {
        var l = this._getUpstreamSourceManagers()[0];
        da(this._sourceHost) && l ? s = l._innerGetDataStore(t, r, i) : (s = new Cl(), s.initData(new Xd(r, t.length), t)), o[i] = s;
      }
      return s;
    }, e.prototype._getUpstreamSourceManagers = function() {
      var t = this._sourceHost;
      if (da(t)) {
        var r = Bd(t);
        return r ? [r.getSourceManager()] : [];
      } else
        return J(uT(t), function(i) {
          return i.getSourceManager();
        });
    }, e.prototype._getSourceMetaRawOption = function() {
      var t = this._sourceHost, r, i, n;
      if (da(t))
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
function da(e) {
  return e.mainType === "series";
}
function zf(e) {
  throw new Error(e);
}
var ix = "line-height:1";
function tp(e) {
  var t = e.lineHeight;
  return t == null ? ix : "line-height:" + Ot(t + "") + "px";
}
function ep(e, t) {
  var r = e.color || "#6e7079", i = e.fontSize || 12, n = e.fontWeight || "400", a = e.color || "#464646", o = e.fontSize || 14, s = e.fontWeight || "900";
  return t === "html" ? {
    // eslint-disable-next-line max-len
    nameStyle: "font-size:" + Ot(i + "") + "px;color:" + Ot(r) + ";font-weight:" + Ot(n + ""),
    // eslint-disable-next-line max-len
    valueStyle: "font-size:" + Ot(o + "") + "px;color:" + Ot(a) + ";font-weight:" + Ot(s + "")
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
var nx = [0, 10, 20, 30], ax = ["", `
`, `

`, `


`];
function $n(e, t) {
  return t.type = e, t;
}
function Dl(e) {
  return e.type === "section";
}
function rp(e) {
  return Dl(e) ? ox : sx;
}
function ip(e) {
  if (Dl(e)) {
    var t = 0, r = e.blocks.length, i = r > 1 || r > 0 && !e.noHeader;
    return D(e.blocks, function(n) {
      var a = ip(n);
      a >= t && (t = a + +(i && // 0 always can not be readable gap level.
      (!a || Dl(n) && !n.noHeader)));
    }), t;
  }
  return 0;
}
function ox(e, t, r, i) {
  var n = t.noHeader, a = lx(ip(t)), o = [], s = t.blocks || [];
  Ve(!s || $(s)), s = s || [];
  var l = e.orderMode;
  if (t.sortBlocks && l) {
    s = s.slice();
    var u = {
      valueAsc: "asc",
      valueDesc: "desc"
    };
    if (Ci(u, l)) {
      var h = new UT(u[l], null);
      s.sort(function(_, p) {
        return h.evaluate(_.sortParam, p.sortParam);
      });
    } else l === "seriesDesc" && s.reverse();
  }
  D(s, function(_, p) {
    var g = t.valueFormatter, m = rp(_)(
      // Inherit valueFormatter
      g ? R(R({}, e), {
        valueFormatter: g
      }) : e,
      _,
      p > 0 ? a.html : 0,
      i
    );
    m != null && o.push(m);
  });
  var f = e.renderMode === "richText" ? o.join(a.richText) : Ml(i, o.join(""), n ? r : a.html);
  if (n)
    return f;
  var v = Tl(t.header, "ordinal", e.useUTC), c = ep(i, e.renderMode).nameStyle, d = tp(i);
  return e.renderMode === "richText" ? np(e, v, c) + a.richText + f : Ml(i, '<div style="' + c + ";" + d + ';">' + Ot(v) + "</div>" + f, r);
}
function sx(e, t, r, i) {
  var n = e.renderMode, a = t.noName, o = t.noValue, s = !t.markerType, l = t.name, u = e.useUTC, h = t.valueFormatter || e.valueFormatter || function(w) {
    return w = $(w) ? w : [w], J(w, function(b, S) {
      return Tl(b, $(c) ? c[S] : c, u);
    });
  };
  if (!(a && o)) {
    var f = s ? "" : e.markupStyleCreator.makeTooltipMarker(t.markerType, t.markerColor || "#333", n), v = a ? "" : Tl(l, "ordinal", u), c = t.valueType, d = o ? [] : h(t.value, t.dataIndex), _ = !s || !a, p = !s && a, g = ep(i, n), m = g.nameStyle, y = g.valueStyle;
    return n === "richText" ? (s ? "" : f) + (a ? "" : np(e, v, m)) + (o ? "" : fx(e, d, _, p, y)) : Ml(i, (s ? "" : f) + (a ? "" : ux(v, !s, m)) + (o ? "" : hx(d, _, p, y)), r);
  }
}
function Hf(e, t, r, i, n, a) {
  if (e) {
    var o = rp(e), s = {
      useUTC: n,
      renderMode: r,
      orderMode: i,
      markupStyleCreator: t,
      valueFormatter: e.valueFormatter
    };
    return o(s, e, 0, a);
  }
}
function lx(e) {
  return {
    html: nx[e],
    richText: ax[e]
  };
}
function Ml(e, t, r) {
  var i = '<div style="clear:both"></div>', n = "margin: " + r + "px 0 0", a = tp(e);
  return '<div style="' + n + ";" + a + ';">' + t + i + "</div>";
}
function ux(e, t, r) {
  var i = t ? "margin-left:2px" : "";
  return '<span style="' + r + ";" + i + '">' + Ot(e) + "</span>";
}
function hx(e, t, r, i) {
  var n = r ? "10px" : "20px", a = t ? "float:right;margin-left:" + n : "";
  return e = $(e) ? e : [e], '<span style="' + a + ";" + i + '">' + J(e, function(o) {
    return Ot(o);
  }).join("&nbsp;&nbsp;") + "</span>";
}
function np(e, t, r) {
  return e.markupStyleCreator.wrapRichTextStyle(t, r);
}
function fx(e, t, r, i, n) {
  var a = [n], o = i ? 10 : 20;
  return r && a.push({
    padding: [0, 0, 0, o],
    align: "right"
  }), e.markupStyleCreator.wrapRichTextStyle($(t) ? t.join("  ") : t, a);
}
function cx(e, t) {
  var r = e.getData().getItemVisual(t, "style"), i = r[e.visualDrawType];
  return kn(i);
}
function ap(e, t) {
  var r = e.get("padding");
  return r ?? (t === "richText" ? [8, 10] : 10);
}
var Ps = (
  /** @class */
  (function() {
    function e() {
      this.richTextStyles = {}, this._nextStyleNameId = Ov();
    }
    return e.prototype._generateStyleName = function() {
      return "__EC_aUTo_" + this._nextStyleNameId++;
    }, e.prototype.makeTooltipMarker = function(t, r, i) {
      var n = i === "richText" ? this._generateStyleName() : null, a = tT({
        color: r,
        type: t,
        renderMode: i,
        markerId: n
      });
      return V(a) ? a : (this.richTextStyles[n] = a.style, a.content);
    }, e.prototype.wrapRichTextStyle = function(t, r) {
      var i = {};
      $(r) ? D(r, function(a) {
        return R(i, a);
      }) : R(i, r);
      var n = this._generateStyleName();
      return this.richTextStyles[n] = i, "{" + n + "|" + t + "}";
    }, e;
  })()
);
function vx(e) {
  var t = e.series, r = e.dataIndex, i = e.multipleSeries, n = t.getData(), a = n.mapDimensionsAll("defaultedTooltip"), o = a.length, s = t.getRawValue(r), l = $(s), u = cx(t, r), h, f, v, c;
  if (o > 1 || l && !o) {
    var d = dx(s, t, r, a, u);
    h = d.inlineValues, f = d.inlineValueTypes, v = d.blocks, c = d.inlineValues[0];
  } else if (o) {
    var _ = n.getDimensionInfo(a[0]);
    c = h = oo(n, r, a[0]), f = _.type;
  } else
    c = h = l ? s[0] : s;
  var p = zv(t), g = p && t.name || "", m = n.getName(r), y = i ? g : m;
  return $n("section", {
    header: g,
    // When series name is not specified, do not show a header line with only '-'.
    // This case always happens in tooltip.trigger: 'item'.
    noHeader: i || !p,
    sortParam: c,
    blocks: [$n("nameValue", {
      markerType: "item",
      markerColor: u,
      // Do not mix display seriesName and itemName in one tooltip,
      // which might confuses users.
      name: y,
      // name dimension might be auto assigned, where the name might
      // be not readable. So we check trim here.
      noName: !Ce(y),
      value: h,
      valueType: f,
      dataIndex: r
    })].concat(v || [])
  });
}
function dx(e, t, r, i, n) {
  var a = t.getData(), o = ur(e, function(f, v, c) {
    var d = a.getDimensionInfo(c);
    return f = f || d && d.tooltip !== !1 && d.displayName != null;
  }, !1), s = [], l = [], u = [];
  i.length ? D(i, function(f) {
    h(oo(a, r, f), f);
  }) : D(e, h);
  function h(f, v) {
    var c = a.getDimensionInfo(v);
    !c || c.otherDims.tooltip === !1 || (o ? u.push($n("nameValue", {
      markerType: "subItem",
      markerColor: n,
      name: c.displayName,
      value: f,
      valueType: c.type
    })) : (s.push(f), l.push(c.type)));
  }
  return {
    inlineValues: s,
    inlineValueTypes: l,
    blocks: u
  };
}
var Ke = wt();
function pa(e, t) {
  return e.getName(t) || e.getId(t);
}
var px = "__universalTransitionEnabled", hr = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r._selectedDataIndicesMap = {}, r;
    }
    return t.prototype.init = function(r, i, n) {
      this.seriesIndex = this.componentIndex, this.dataTask = wn({
        count: _x,
        reset: mx
      }), this.dataTask.context = {
        model: this
      }, this.mergeDefaultAndTheme(r, n);
      var a = Ke(this).sourceManager = new rx(this);
      a.prepareSource();
      var o = this.getInitialData(r, n);
      Uf(o, this), this.dataTask.context.data = o, Ke(this).dataBeforeProcessed = o, Vf(this), this._initSelectedMapFromData(o);
    }, t.prototype.mergeDefaultAndTheme = function(r, i) {
      var n = no(this), a = n ? kd(r) : {}, o = this.subType;
      nt.hasClass(o) && (o += "Series"), _t(r, i.getTheme().get(this.subType)), _t(r, this.getDefaultOption()), fl(r, "label", ["show"]), this.fillDataTextStyle(r.data), n && ao(r, a, n);
    }, t.prototype.mergeOption = function(r, i) {
      r = _t(this.option, r, !0), this.fillDataTextStyle(r.data);
      var n = no(this);
      n && ao(this.option, r, n);
      var a = Ke(this).sourceManager;
      a.dirty(), a.prepareSource();
      var o = this.getInitialData(r, i);
      Uf(o, this), this.dataTask.dirty(), this.dataTask.context.data = o, Ke(this).dataBeforeProcessed = o, Vf(this), this._initSelectedMapFromData(o);
    }, t.prototype.fillDataTextStyle = function(r) {
      if (r && !Ut(r))
        for (var i = ["show"], n = 0; n < r.length; n++)
          r[n] && r[n].label && fl(r[n], "label", i);
    }, t.prototype.getInitialData = function(r, i) {
    }, t.prototype.appendData = function(r) {
      var i = this.getRawData();
      i.appendData(r.data);
    }, t.prototype.getData = function(r) {
      var i = Al(this);
      if (i) {
        var n = i.context.data;
        return r == null || !n.getLinkedData ? n : n.getLinkedData(r);
      } else
        return Ke(this).data;
    }, t.prototype.getAllData = function() {
      var r = this.getData();
      return r && r.getLinkedDataAll ? r.getLinkedDataAll() : [{
        data: r
      }];
    }, t.prototype.setData = function(r) {
      var i = Al(this);
      if (i) {
        var n = i.context;
        n.outputData = r, i !== this.dataTask && (n.data = r);
      }
      Ke(this).data = r;
    }, t.prototype.getEncode = function() {
      var r = this.get("encode", !0);
      if (r)
        return tt(r);
    }, t.prototype.getSourceManager = function() {
      return Ke(this).sourceManager;
    }, t.prototype.getSource = function() {
      return this.getSourceManager().getSource();
    }, t.prototype.getRawData = function() {
      return Ke(this).dataBeforeProcessed;
    }, t.prototype.getColorBy = function() {
      var r = this.get("colorBy");
      return r || "series";
    }, t.prototype.isColorBySeries = function() {
      return this.getColorBy() === "series";
    }, t.prototype.getBaseAxis = function() {
      var r = this.coordinateSystem;
      return r && r.getBaseAxis && r.getBaseAxis();
    }, t.prototype.formatTooltip = function(r, i, n) {
      return vx({
        series: this,
        dataIndex: r,
        multipleSeries: i
      });
    }, t.prototype.isAnimationEnabled = function() {
      var r = this.ecModel;
      if (H.node && !(r && r.ssr))
        return !1;
      var i = this.getShallow("animation");
      return i && this.getData().count() > this.getShallow("animationThreshold") && (i = !1), !!i;
    }, t.prototype.restoreData = function() {
      this.dataTask.dirty();
    }, t.prototype.getColorFromPalette = function(r, i, n) {
      var a = this.ecModel, o = xu.prototype.getColorFromPalette.call(this, r, i, n);
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
          var l = r[s], u = pa(o, l);
          n[u] = !1, this._selectedDataIndicesMap[u] = -1;
        }
      }
    }, t.prototype.toggleSelect = function(r, i) {
      for (var n = [], a = 0; a < r.length; a++)
        n[0] = r[a], this.isSelected(r[a], i) ? this.unselect(n, i) : this.select(n, i);
    }, t.prototype.getSelectedDataIndices = function() {
      if (this.option.selectedMap === "all")
        return [].slice.call(this.getData().getIndices());
      for (var r = this._selectedDataIndicesMap, i = dt(r), n = [], a = 0; a < i.length; a++) {
        var o = r[i[a]];
        o >= 0 && n.push(o);
      }
      return n;
    }, t.prototype.isSelected = function(r, i) {
      var n = this.option.selectedMap;
      if (!n)
        return !1;
      var a = this.getData(i);
      return (n === "all" || n[pa(a, r)]) && !a.getItemModel(r).get(["select", "disabled"]);
    }, t.prototype.isUniversalTransitionEnabled = function() {
      if (this[px])
        return !0;
      var r = this.option.universalTransition;
      return r ? r === !0 ? !0 : r && r.enabled : !1;
    }, t.prototype._innerSelect = function(r, i) {
      var n, a, o = this.option, s = o.selectedMode, l = i.length;
      if (!(!s || !l)) {
        if (s === "series")
          o.selectedMap = "all";
        else if (s === "multiple") {
          F(o.selectedMap) || (o.selectedMap = {});
          for (var u = o.selectedMap, h = 0; h < l; h++) {
            var f = i[h], v = pa(r, f);
            u[v] = !0, this._selectedDataIndicesMap[v] = r.getRawIndex(f);
          }
        } else if (s === "single" || s === !0) {
          var c = i[l - 1], v = pa(r, c);
          o.selectedMap = (n = {}, n[v] = !0, n), this._selectedDataIndicesMap = (a = {}, a[v] = r.getRawIndex(c), a);
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
Ge(hr, HT);
Ge(hr, xu);
Uv(hr, nt);
function Vf(e) {
  var t = e.name;
  zv(e) || (e.name = gx(e) || t);
}
function gx(e) {
  var t = e.getRawData(), r = t.mapDimensionsAll("seriesName"), i = [];
  return D(r, function(n) {
    var a = t.getDimensionInfo(n);
    a.displayName && i.push(a.displayName);
  }), i.join(" ");
}
function _x(e) {
  return e.model.getRawData().count();
}
function mx(e) {
  var t = e.model;
  return t.setData(t.getRawData().cloneShallow()), yx;
}
function yx(e, t) {
  t.outputData && e.end > t.outputData.count() && t.model.getRawData().cloneShallow(t.outputData);
}
function Uf(e, t) {
  D(A0(e.CHANGABLE_METHODS, e.DOWNSAMPLE_METHODS), function(r) {
    e.wrapMethod(r, Zt(Sx, t));
  });
}
function Sx(e, t) {
  var r = Al(e);
  return r && r.setOutputEnd((t || this).count()), t;
}
function Al(e) {
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
var fr = (
  /** @class */
  (function() {
    function e() {
      this.group = new Ue(), this.uid = Lo("viewComponent");
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
au(fr);
ou(fr);
function bx() {
  var e = wt();
  return function(t) {
    var r = e(t), i = t.pipelineContext, n = !!r.large, a = !!r.progressiveRender, o = r.large = !!(i && i.large), s = r.progressiveRender = !!(i && i.progressiveRender);
    return (n !== o || a !== s) && "reset";
  };
}
var op = wt(), Tx = bx(), lr = (
  /** @class */
  (function() {
    function e() {
      this.group = new Ue(), this.uid = Lo("viewChart"), this.renderTask = wn({
        plan: xx,
        reset: Cx
      }), this.renderTask.context = {
        view: this
      };
    }
    return e.prototype.init = function(t, r) {
    }, e.prototype.render = function(t, r, i, n) {
    }, e.prototype.highlight = function(t, r, i, n) {
      var a = t.getData(n && n.dataType);
      a && Wf(a, n, "emphasis");
    }, e.prototype.downplay = function(t, r, i, n) {
      var a = t.getData(n && n.dataType);
      a && Wf(a, n, "normal");
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
      Td(this.group, t);
    }, e.markUpdateMethod = function(t, r) {
      op(t).updateMethod = r;
    }, e.protoInitialize = (function() {
      var t = e.prototype;
      t.type = "chart";
    })(), e;
  })()
);
function Gf(e, t, r) {
  e && yl(e) && (t === "emphasis" ? pl : gl)(e, r);
}
function Wf(e, t, r) {
  var i = Un(e, t), n = t && t.highlightKey != null ? PS(t.highlightKey) : null;
  i != null ? D(kt(i), function(a) {
    Gf(e.getItemGraphicEl(a), r, n);
  }) : e.eachItemGraphicEl(function(a) {
    Gf(a, r, n);
  });
}
au(lr);
ou(lr);
function xx(e) {
  return Tx(e.model);
}
function Cx(e) {
  var t = e.model, r = e.ecModel, i = e.api, n = e.payload, a = t.pipelineContext.progressiveRender, o = e.view, s = n && op(n).updateMethod, l = a ? "incrementalPrepareRender" : s && o[s] ? s : "render";
  return l !== "render" && o[l](t, r, i, n), Dx[l];
}
var Dx = {
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
}, so = "\0__throttleOriginMethod", Yf = "\0__throttleRate", Xf = "\0__throttleType";
function sp(e, t, r) {
  var i, n = 0, a = 0, o = null, s, l, u, h;
  t = t || 0;
  function f() {
    a = (/* @__PURE__ */ new Date()).getTime(), o = null, e.apply(l, u || []);
  }
  var v = function() {
    for (var c = [], d = 0; d < arguments.length; d++)
      c[d] = arguments[d];
    i = (/* @__PURE__ */ new Date()).getTime(), l = this, u = c;
    var _ = h || t, p = h || r;
    h = null, s = i - (p ? n : a) - _, clearTimeout(o), p ? o = setTimeout(f, _) : s >= 0 ? f() : o = setTimeout(f, -s), n = i;
  };
  return v.clear = function() {
    o && (clearTimeout(o), o = null);
  }, v.debounceNextCall = function(c) {
    h = c;
  }, v;
}
function lp(e, t, r, i) {
  var n = e[t];
  if (n) {
    var a = n[so] || n, o = n[Xf], s = n[Yf];
    if (s !== r || o !== i) {
      if (r == null || !i)
        return e[t] = a;
      n = e[t] = sp(a, r, i === "debounce"), n[so] = a, n[Xf] = i, n[Yf] = r;
    }
    return n;
  }
}
function Pl(e, t) {
  var r = e[t];
  r && r[so] && (r.clear && r.clear(), e[t] = r[so]);
}
var qf = wt(), Zf = {
  itemStyle: Ln(Cd, !0),
  lineStyle: Ln(xd, !0)
}, Mx = {
  lineStyle: "stroke",
  itemStyle: "fill"
};
function up(e, t) {
  var r = e.visualStyleMapper || Zf[t];
  return r || (console.warn("Unknown style type '" + t + "'."), Zf.itemStyle);
}
function hp(e, t) {
  var r = e.visualDrawType || Mx[t];
  return r || (console.warn("Unknown style type '" + t + "'."), "fill");
}
var Ax = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData(), i = e.visualStyleAccessPath || "itemStyle", n = e.getModel(i), a = up(e, i), o = a(n), s = n.getShallow("decal");
    s && (r.setVisual("decal", s), s.dirty = !0);
    var l = hp(e, i), u = o[l], h = rt(u) ? u : null, f = o.fill === "auto" || o.stroke === "auto";
    if (!o[l] || h || f) {
      var v = e.getColorFromPalette(
        // TODO series count changed.
        e.name,
        null,
        t.getSeriesCount()
      );
      o[l] || (o[l] = v, r.setVisual("colorFromPalette", !0)), o.fill = o.fill === "auto" || rt(o.fill) ? v : o.fill, o.stroke = o.stroke === "auto" || rt(o.stroke) ? v : o.stroke;
    }
    if (r.setVisual("style", o), r.setVisual("drawType", l), !t.isSeriesFiltered(e) && h)
      return r.setVisual("colorFromPalette", !1), {
        dataEach: function(c, d) {
          var _ = e.getDataParams(d), p = R({}, o);
          p[l] = h(_), c.setItemVisual(d, "style", p);
        }
      };
  }
}, Xi = new vt(), Px = {
  createOnAllSeries: !0,
  performRawSeries: !0,
  reset: function(e, t) {
    if (!(e.ignoreStyleOnData || t.isSeriesFiltered(e))) {
      var r = e.getData(), i = e.visualStyleAccessPath || "itemStyle", n = up(e, i), a = r.getVisual("drawType");
      return {
        dataEach: r.hasItemOption ? function(o, s) {
          var l = o.getRawDataItem(s);
          if (l && l[i]) {
            Xi.option = l[i];
            var u = n(Xi), h = o.ensureUniqueItemVisual(s, "style");
            R(h, u), Xi.option.decal && (o.setItemVisual(s, "decal", Xi.option.decal), Xi.option.decal.dirty = !0), a in u && o.setItemVisual(s, "colorFromPalette", !1);
          }
        } : null
      };
    }
  }
}, Lx = {
  performRawSeries: !0,
  overallReset: function(e) {
    var t = tt();
    e.eachSeries(function(r) {
      var i = r.getColorBy();
      if (!r.isColorBySeries()) {
        var n = r.type + "-" + i, a = t.get(n);
        a || (a = {}, t.set(n, a)), qf(r).scope = a;
      }
    }), e.eachSeries(function(r) {
      if (!(r.isColorBySeries() || e.isSeriesFiltered(r))) {
        var i = r.getRawData(), n = {}, a = r.getData(), o = qf(r).scope, s = r.visualStyleAccessPath || "itemStyle", l = hp(r, s);
        a.each(function(u) {
          var h = a.getRawIndex(u);
          n[h] = u;
        }), i.each(function(u) {
          var h = n[u], f = a.getItemVisual(h, "colorFromPalette");
          if (f) {
            var v = a.ensureUniqueItemVisual(h, "style"), c = i.getName(u) || u + "", d = i.count();
            v[l] = r.getColorFromPalette(c, o, d);
          }
        });
      }
    });
  }
}, ga = Math.PI;
function Ix(e, t) {
  t = t || {}, ut(t, {
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
  var r = new Ue(), i = new ve({
    style: {
      fill: t.maskColor
    },
    zlevel: t.zlevel,
    z: 1e4
  });
  r.add(i);
  var n = new de({
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
  }), a = new ve({
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
  return t.showSpinner && (o = new Ao({
    shape: {
      startAngle: -ga / 2,
      endAngle: -ga / 2 + 0.1,
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
    endAngle: ga * 3 / 2
  }).start("circularInOut"), o.animateShape(!0).when(1e3, {
    startAngle: ga * 3 / 2
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
var fp = (
  /** @class */
  (function() {
    function e(t, r, i, n) {
      this._stageTaskMap = tt(), this.ecInstance = t, this.api = r, i = this._dataProcessorHandlers = i.slice(), n = this._visualHandlers = n.slice(), this._allHandlers = i.concat(n);
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
      var r = this, i = r._pipelineMap = tt();
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
        Ve(!(n.reset && n.overallReset), o), n.reset && this._createSeriesStageTask(n, a, r, i), n.overallReset && this._createOverallStageTask(n, a, r, i);
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
          var h = o._stageTaskMap.get(l.uid), f = h.seriesTaskMap, v = h.overallTask;
          if (v) {
            var c, d = v.agentStubMap;
            d.each(function(p) {
              s(n, p) && (p.dirty(), c = !0);
            }), c && v.dirty(), o.updatePayload(v, i);
            var _ = o.getPerformArgs(v, n.block);
            d.each(function(p) {
              p.perform(_);
            }), v.perform(_) && (a = !0);
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
      var a = this, o = r.seriesTaskMap, s = r.seriesTaskMap = tt(), l = t.seriesType, u = t.getTargetSeries;
      t.createOnAllSeries ? i.eachRawSeries(h) : l ? i.eachRawSeriesByType(l, h) : u && u(i, n).each(h);
      function h(f) {
        var v = f.uid, c = s.set(v, o && o.get(v) || wn({
          plan: Ox,
          reset: Bx,
          count: Fx
        }));
        c.context = {
          model: f,
          ecModel: i,
          api: n,
          // PENDING: `useClearVisual` not used?
          useClearVisual: t.isVisual && !t.isLayout,
          plan: t.plan,
          reset: t.reset,
          scheduler: a
        }, a._pipe(f, c);
      }
    }, e.prototype._createOverallStageTask = function(t, r, i, n) {
      var a = this, o = r.overallTask = r.overallTask || wn({
        reset: Rx
      });
      o.context = {
        ecModel: i,
        api: n,
        overallReset: t.overallReset,
        scheduler: a
      };
      var s = o.agentStubMap, l = o.agentStubMap = tt(), u = t.seriesType, h = t.getTargetSeries, f = !0, v = !1, c = "";
      Ve(!t.createOnAllSeries, c), u ? i.eachRawSeriesByType(u, d) : h ? h(i, n).each(d) : (f = !1, D(i.getSeries(), d));
      function d(_) {
        var p = _.uid, g = l.set(p, s && s.get(p) || // When the result of `getTargetSeries` changed, the overallTask
        // should be set as dirty and re-performed.
        (v = !0, wn({
          reset: kx,
          onDirty: $x
        })));
        g.context = {
          model: _,
          overallProgress: f
          // FIXME:TS never used, so comment it
          // modifyOutputEnd: modifyOutputEnd
        }, g.agent = o, g.__block = f, a._pipe(_, g);
      }
      v && o.dirty();
    }, e.prototype._pipe = function(t, r) {
      var i = t.uid, n = this._pipelineMap.get(i);
      !n.head && (n.head = r), n.tail && n.tail.pipe(r), n.tail = r, r.__idxInPipeline = n.count++, r.__pipeline = n;
    }, e.wrapStageHandler = function(t, r) {
      return rt(t) && (t = {
        overallReset: t,
        seriesType: zx(t)
      }), t.uid = Lo("stageHandler"), r && (t.visualType = r), t;
    }, e;
  })()
);
function Rx(e) {
  e.overallReset(e.ecModel, e.api, e.payload);
}
function kx(e) {
  return e.overallProgress && Ex;
}
function Ex() {
  this.agent.dirty(), this.getDownstream().dirty();
}
function $x() {
  this.agent && this.agent.dirty();
}
function Ox(e) {
  return e.plan ? e.plan(e.model, e.ecModel, e.api, e.payload) : null;
}
function Bx(e) {
  e.useClearVisual && e.data.clearAllVisual();
  var t = e.resetDefines = kt(e.reset(e.model, e.ecModel, e.api, e.payload));
  return t.length > 1 ? J(t, function(r, i) {
    return cp(i);
  }) : Nx;
}
var Nx = cp(0);
function cp(e) {
  return function(t, r) {
    var i = r.data, n = r.resetDefines[e];
    if (n && n.dataEach)
      for (var a = t.start; a < t.end; a++)
        n.dataEach(i, a);
    else n && n.progress && n.progress(t, i);
  };
}
function Fx(e) {
  return e.data.count();
}
function zx(e) {
  lo = null;
  try {
    e(On, vp);
  } catch {
  }
  return lo;
}
var On = {}, vp = {}, lo;
dp(On, Cu);
dp(vp, zd);
On.eachSeriesByType = On.eachRawSeriesByType = function(e) {
  lo = e;
};
On.eachComponent = function(e) {
  e.mainType === "series" && e.subType && (lo = e.subType);
};
function dp(e, t) {
  for (var r in t.prototype)
    e[r] = zt;
}
var Kf = ["#37A2DA", "#32C5E9", "#67E0E3", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#E062AE", "#E690D1", "#e7bcf3", "#9d96f5", "#8378EA", "#96BFFF"];
const Hx = {
  color: Kf,
  colorLayer: [["#37A2DA", "#ffd85c", "#fd7b5f"], ["#37A2DA", "#67E0E3", "#FFDB5C", "#ff9f7f", "#E062AE", "#9d96f5"], ["#37A2DA", "#32C5E9", "#9FE6B8", "#FFDB5C", "#ff9f7f", "#fb7293", "#e7bcf3", "#8378EA", "#96BFFF"], Kf]
};
var At = "#B9B8CE", Qf = "#100C2A", _a = function() {
  return {
    axisLine: {
      lineStyle: {
        color: At
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
}, jf = ["#4992ff", "#7cffb2", "#fddd60", "#ff6e76", "#58d9f9", "#05c091", "#ff8a45", "#8d48e3", "#dd79ff"], pp = {
  darkMode: !0,
  color: jf,
  backgroundColor: Qf,
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
      color: At
    },
    pageTextStyle: {
      color: At
    }
  },
  textStyle: {
    color: At
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
      borderColor: At
    }
  },
  dataZoom: {
    borderColor: "#71708A",
    textStyle: {
      color: At
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
      color: At
    }
  },
  timeline: {
    lineStyle: {
      color: At
    },
    label: {
      color: At
    },
    controlStyle: {
      color: At,
      borderColor: At
    }
  },
  calendar: {
    itemStyle: {
      color: Qf
    },
    dayLabel: {
      color: At
    },
    monthLabel: {
      color: At
    },
    yearLabel: {
      color: At
    }
  },
  timeAxis: _a(),
  logAxis: _a(),
  valueAxis: _a(),
  categoryAxis: _a(),
  line: {
    symbol: "circle"
  },
  graph: {
    color: jf
  },
  gauge: {
    title: {
      color: At
    },
    axisLine: {
      lineStyle: {
        color: [[1, "rgba(207,212,219,0.2)"]]
      }
    },
    axisLabel: {
      color: At
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
pp.categoryAxis.splitLine.show = !1;
var Vx = (
  /** @class */
  (function() {
    function e() {
    }
    return e.prototype.normalizeQuery = function(t) {
      var r = {}, i = {}, n = {};
      if (V(t)) {
        var a = De(t);
        r.mainType = a.main || null, r.subType = a.sub || null;
      } else {
        var o = ["Index", "Name", "Id"], s = {
          name: 1,
          dataIndex: 1,
          dataType: 1
        };
        D(t, function(l, u) {
          for (var h = !1, f = 0; f < o.length; f++) {
            var v = o[f], c = u.lastIndexOf(v);
            if (c > 0 && c === u.length - v.length) {
              var d = u.slice(0, c);
              d !== "data" && (r.mainType = d, r[v.toLowerCase()] = l, h = !0);
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
      function h(f, v, c, d) {
        return f[c] == null || v[d || c] === f[c];
      }
    }, e.prototype.afterTrigger = function() {
      this.eventInfo = null;
    }, e;
  })()
), Ll = ["symbol", "symbolSize", "symbolRotate", "symbolOffset"], Jf = Ll.concat(["symbolKeepAspect"]), Ux = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    var r = e.getData();
    if (e.legendIcon && r.setVisual("legendIcon", e.legendIcon), !e.hasSymbolVisual)
      return;
    for (var i = {}, n = {}, a = !1, o = 0; o < Ll.length; o++) {
      var s = Ll[o], l = e.get(s);
      rt(l) ? (a = !0, n[s] = l) : i[s] = l;
    }
    if (i.symbol = i.symbol || e.defaultSymbol, r.setVisual(R({
      legendIcon: e.legendIcon || i.symbol,
      symbolKeepAspect: e.get("symbolKeepAspect")
    }, i)), t.isSeriesFiltered(e))
      return;
    var u = dt(n);
    function h(f, v) {
      for (var c = e.getRawValue(v), d = e.getDataParams(v), _ = 0; _ < u.length; _++) {
        var p = u[_];
        f.setItemVisual(v, p, n[p](c, d));
      }
    }
    return {
      dataEach: a ? h : null
    };
  }
}, Gx = {
  createOnAllSeries: !0,
  // For legend.
  performRawSeries: !0,
  reset: function(e, t) {
    if (!e.hasSymbolVisual || t.isSeriesFiltered(e))
      return;
    var r = e.getData();
    function i(n, a) {
      for (var o = n.getItemModel(a), s = 0; s < Jf.length; s++) {
        var l = Jf[s], u = o.getShallow(l, !0);
        u != null && n.setItemVisual(a, l, u);
      }
    }
    return {
      dataEach: r.hasItemOption ? i : null
    };
  }
};
function Wx(e, t, r) {
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
  }
}
function Yx(e, t) {
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
  }
}
function Xx(e, t) {
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
      n = R({}, n), o.dispatchAction(R(n, {
        type: i[1],
        seriesIndex: r(a, n)
      }));
    });
  });
}
function si(e, t, r, i, n) {
  var a = e + t;
  r.isSilent(a) || i.eachComponent({
    mainType: "series",
    subType: "pie"
  }, function(o) {
    for (var s = o.seriesIndex, l = o.option.selectedMap, u = n.selected, h = 0; h < u.length; h++)
      if (u[h].seriesIndex === s) {
        var f = o.getData(), v = Un(f, n.fromActionPayload);
        r.trigger(a, {
          type: a,
          seriesId: o.id,
          name: $(v) ? f.getName(v[0]) : f.getName(v),
          selected: V(l) ? l : R({}, l)
        });
      }
  });
}
function qx(e, t, r) {
  e.on("selectchanged", function(i) {
    var n = r.getModel();
    i.isFromClick ? (si("map", "selectchanged", t, n, i), si("pie", "selectchanged", t, n, i)) : i.fromAction === "select" ? (si("map", "selected", t, n, i), si("pie", "selected", t, n, i)) : i.fromAction === "unselect" && (si("map", "unselected", t, n, i), si("pie", "unselected", t, n, i));
  });
}
function ln(e, t, r) {
  for (var i; e && !(t(e) && (i = e, r)); )
    e = e.__hostTarget || e.parent;
  return i;
}
var Zx = Math.round(Math.random() * 9), Kx = typeof Object.defineProperty == "function", Qx = (function() {
  function e() {
    this._id = "__ec_inner_" + Zx++;
  }
  return e.prototype.get = function(t) {
    return this._guard(t)[this._id];
  }, e.prototype.set = function(t, r) {
    var i = this._guard(t);
    return Kx ? Object.defineProperty(i, this._id, {
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
})(), jx = at.extend({
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
}), Jx = at.extend({
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
}), tC = at.extend({
  type: "pin",
  shape: {
    // x, y on the cusp
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  buildPath: function(e, t) {
    var r = t.x, i = t.y, n = t.width / 5 * 3, a = Math.max(n, t.height), o = n / 2, s = o * o / (a - o), l = i - a + o + s, u = Math.asin(s / o), h = Math.cos(u) * o, f = Math.sin(u), v = Math.cos(u), c = o * 0.6, d = o * 0.7;
    e.moveTo(r - h, l + s), e.arc(r, l, o, Math.PI - u, Math.PI * 2 + u), e.bezierCurveTo(r + h - f * c, l + s + v * c, r, i - d, r, i), e.bezierCurveTo(r, i - d, r - h + f * c, l + s + v * c, r - h, l + s), e.closePath();
  }
}), eC = at.extend({
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
}), rC = {
  line: Ii,
  rect: ve,
  roundRect: ve,
  square: ve,
  circle: Mo,
  diamond: Jx,
  pin: tC,
  arrow: eC,
  triangle: jx
}, iC = {
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
}, Il = {};
D(rC, function(e, t) {
  Il[t] = new e();
});
var nC = at.extend({
  type: "symbol",
  shape: {
    symbolType: "",
    x: 0,
    y: 0,
    width: 0,
    height: 0
  },
  calculateTextPosition: function(e, t, r) {
    var i = Iv(e, t, r), n = this.shape;
    return n && n.symbolType === "pin" && t.position === "inside" && (i.y = r.y + r.height * 0.4), i;
  },
  buildPath: function(e, t, r) {
    var i = t.symbolType;
    if (i !== "none") {
      var n = Il[i];
      n || (i = "rect", n = Il[i]), iC[i](t.x, t.y, t.width, t.height, n.shape), n.buildPath(e, n.shape, r);
    }
  }
});
function aC(e, t) {
  if (this.type !== "image") {
    var r = this.style;
    this.__isEmptyBrush ? (r.stroke = e, r.fill = t || "#fff", r.lineWidth = 2) : this.shape.symbolType === "line" ? r.stroke = e : r.fill = e, this.markRedraw();
  }
}
function gp(e, t, r, i, n, a, o) {
  var s = e.indexOf("empty") === 0;
  s && (e = e.substr(5, 1).toLowerCase() + e.substr(6));
  var l;
  return e.indexOf("image://") === 0 ? l = md(e.slice(8), new it(t, r, i, n), o ? "center" : "cover") : e.indexOf("path://") === 0 ? l = _u(e.slice(7), {}, new it(t, r, i, n), o ? "center" : "cover") : l = new nC({
    shape: {
      symbolType: e,
      x: t,
      y: r,
      width: i,
      height: n
    }
  }), l.__isEmptyBrush = s, l.setColor = aC, a && l.setColor(a), l;
}
function oC(e, t) {
  if (e != null)
    return $(e) || (e = [e, e]), [yt(e[0], t[0]) || 0, yt(K(e[1], e[0]), t[1]) || 0];
}
function Nr(e) {
  return isFinite(e);
}
function sC(e, t, r) {
  var i = t.x == null ? 0 : t.x, n = t.x2 == null ? 1 : t.x2, a = t.y == null ? 0 : t.y, o = t.y2 == null ? 0 : t.y2;
  t.global || (i = i * r.width + r.x, n = n * r.width + r.x, a = a * r.height + r.y, o = o * r.height + r.y), i = Nr(i) ? i : 0, n = Nr(n) ? n : 1, a = Nr(a) ? a : 0, o = Nr(o) ? o : 0;
  var s = e.createLinearGradient(i, a, n, o);
  return s;
}
function lC(e, t, r) {
  var i = r.width, n = r.height, a = Math.min(i, n), o = t.x == null ? 0.5 : t.x, s = t.y == null ? 0.5 : t.y, l = t.r == null ? 0.5 : t.r;
  t.global || (o = o * i + r.x, s = s * n + r.y, l = l * a), o = Nr(o) ? o : 0.5, s = Nr(s) ? s : 0.5, l = l >= 0 && Nr(l) ? l : 0.5;
  var u = e.createRadialGradient(o, s, 0, o, s, l);
  return u;
}
function Rl(e, t, r) {
  for (var i = t.type === "radial" ? lC(e, t, r) : sC(e, t, r), n = t.colorStops, a = 0; a < n.length; a++)
    i.addColorStop(n[a].offset, n[a].color);
  return i;
}
function uC(e, t) {
  if (e === t || !e && !t)
    return !1;
  if (!e || !t || e.length !== t.length)
    return !0;
  for (var r = 0; r < e.length; r++)
    if (e[r] !== t[r])
      return !0;
  return !1;
}
function ma(e) {
  return parseInt(e, 10);
}
function ya(e, t, r) {
  var i = ["width", "height"][t], n = ["clientWidth", "clientHeight"][t], a = ["paddingLeft", "paddingTop"][t], o = ["paddingRight", "paddingBottom"][t];
  if (r[i] != null && r[i] !== "auto")
    return parseFloat(r[i]);
  var s = document.defaultView.getComputedStyle(e);
  return (e[n] || ma(s[i]) || ma(e.style[i])) - (ma(s[a]) || 0) - (ma(s[o]) || 0) | 0;
}
function hC(e, t) {
  return !e || e === "solid" || !(t > 0) ? null : e === "dashed" ? [4 * t, 2 * t] : e === "dotted" ? [t] : mt(e) ? [e] : $(e) ? e : null;
}
function _p(e) {
  var t = e.style, r = t.lineDash && t.lineWidth > 0 && hC(t.lineDash, t.lineWidth), i = t.lineDashOffset;
  if (r) {
    var n = t.strokeNoScale && e.getLineScale ? e.getLineScale() : 1;
    n && n !== 1 && (r = J(r, function(a) {
      return a / n;
    }), i /= n);
  }
  return [r, i];
}
var fC = new Mi(!0);
function uo(e) {
  var t = e.stroke;
  return !(t == null || t === "none" || !(e.lineWidth > 0));
}
function tc(e) {
  return typeof e == "string" && e !== "none";
}
function ho(e) {
  var t = e.fill;
  return t != null && t !== "none";
}
function ec(e, t) {
  if (t.fillOpacity != null && t.fillOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.fillOpacity * t.opacity, e.fill(), e.globalAlpha = r;
  } else
    e.fill();
}
function rc(e, t) {
  if (t.strokeOpacity != null && t.strokeOpacity !== 1) {
    var r = e.globalAlpha;
    e.globalAlpha = t.strokeOpacity * t.opacity, e.stroke(), e.globalAlpha = r;
  } else
    e.stroke();
}
function kl(e, t, r) {
  var i = Gv(t.image, t.__image, r);
  if (xo(i)) {
    var n = e.createPattern(i, t.repeat || "repeat");
    if (typeof DOMMatrix == "function" && n && n.setTransform) {
      var a = new DOMMatrix();
      a.translateSelf(t.x || 0, t.y || 0), a.rotateSelf(0, 0, (t.rotation || 0) * P0), a.scaleSelf(t.scaleX || 1, t.scaleY || 1), n.setTransform(a);
    }
    return n;
  }
}
function cC(e, t, r, i) {
  var n, a = uo(r), o = ho(r), s = r.strokePercent, l = s < 1, u = !t.path;
  (!t.silent || l) && u && t.createPathProxy();
  var h = t.path || fC, f = t.__dirty;
  if (!i) {
    var v = r.fill, c = r.stroke, d = o && !!v.colorStops, _ = a && !!c.colorStops, p = o && !!v.image, g = a && !!c.image, m = void 0, y = void 0, w = void 0, b = void 0, S = void 0;
    (d || _) && (S = t.getBoundingRect()), d && (m = f ? Rl(e, v, S) : t.__canvasFillGradient, t.__canvasFillGradient = m), _ && (y = f ? Rl(e, c, S) : t.__canvasStrokeGradient, t.__canvasStrokeGradient = y), p && (w = f || !t.__canvasFillPattern ? kl(e, v, t) : t.__canvasFillPattern, t.__canvasFillPattern = w), g && (b = f || !t.__canvasStrokePattern ? kl(e, c, t) : t.__canvasStrokePattern, t.__canvasStrokePattern = w), d ? e.fillStyle = m : p && (w ? e.fillStyle = w : o = !1), _ ? e.strokeStyle = y : g && (b ? e.strokeStyle = b : a = !1);
  }
  var T = t.getGlobalScale();
  h.setScale(T[0], T[1], t.segmentIgnoreThreshold);
  var x, C;
  e.setLineDash && r.lineDash && (n = _p(t), x = n[0], C = n[1]);
  var M = !0;
  (u || f & hi) && (h.setDPR(e.dpr), l ? h.setContext(null) : (h.setContext(e), M = !1), h.reset(), t.buildPath(h, t.shape, i), h.toStatic(), t.pathUpdated()), M && h.rebuildPath(e, l ? s : 1), x && (e.setLineDash(x), e.lineDashOffset = C), i || (r.strokeFirst ? (a && rc(e, r), o && ec(e, r)) : (o && ec(e, r), a && rc(e, r))), x && e.setLineDash([]);
}
function vC(e, t, r) {
  var i = t.__image = Gv(r.image, t.__image, t, t.onload);
  if (!(!i || !xo(i))) {
    var n = r.x || 0, a = r.y || 0, o = t.getWidth(), s = t.getHeight(), l = i.width / i.height;
    if (o == null && s != null ? o = s * l : s == null && o != null ? s = o / l : o == null && s == null && (o = i.width, s = i.height), r.sWidth && r.sHeight) {
      var u = r.sx || 0, h = r.sy || 0;
      e.drawImage(i, u, h, r.sWidth, r.sHeight, n, a, o, s);
    } else if (r.sx && r.sy) {
      var u = r.sx, h = r.sy, f = o - u, v = s - h;
      e.drawImage(i, u, h, f, v, n, a, o, s);
    } else
      e.drawImage(i, n, a, o, s);
  }
}
function dC(e, t, r) {
  var i, n = r.text;
  if (n != null && (n += ""), n) {
    e.font = r.font || Gr, e.textAlign = r.textAlign, e.textBaseline = r.textBaseline;
    var a = void 0, o = void 0;
    e.setLineDash && r.lineDash && (i = _p(t), a = i[0], o = i[1]), a && (e.setLineDash(a), e.lineDashOffset = o), r.strokeFirst ? (uo(r) && e.strokeText(n, r.x, r.y), ho(r) && e.fillText(n, r.x, r.y)) : (ho(r) && e.fillText(n, r.x, r.y), uo(r) && e.strokeText(n, r.x, r.y)), a && e.setLineDash([]);
  }
}
var ic = ["shadowBlur", "shadowOffsetX", "shadowOffsetY"], nc = [
  ["lineCap", "butt"],
  ["lineJoin", "miter"],
  ["miterLimit", 10]
];
function mp(e, t, r, i, n) {
  var a = !1;
  if (!i && (r = r || {}, t === r))
    return !1;
  if (i || t.opacity !== r.opacity) {
    Ft(e, n), a = !0;
    var o = Math.max(Math.min(t.opacity, 1), 0);
    e.globalAlpha = isNaN(o) ? zr.opacity : o;
  }
  (i || t.blend !== r.blend) && (a || (Ft(e, n), a = !0), e.globalCompositeOperation = t.blend || zr.blend);
  for (var s = 0; s < ic.length; s++) {
    var l = ic[s];
    (i || t[l] !== r[l]) && (a || (Ft(e, n), a = !0), e[l] = e.dpr * (t[l] || 0));
  }
  return (i || t.shadowColor !== r.shadowColor) && (a || (Ft(e, n), a = !0), e.shadowColor = t.shadowColor || zr.shadowColor), a;
}
function ac(e, t, r, i, n) {
  var a = Bn(t, n.inHover), o = i ? null : r && Bn(r, n.inHover) || {};
  if (a === o)
    return !1;
  var s = mp(e, a, o, i, n);
  if ((i || a.fill !== o.fill) && (s || (Ft(e, n), s = !0), tc(a.fill) && (e.fillStyle = a.fill)), (i || a.stroke !== o.stroke) && (s || (Ft(e, n), s = !0), tc(a.stroke) && (e.strokeStyle = a.stroke)), (i || a.opacity !== o.opacity) && (s || (Ft(e, n), s = !0), e.globalAlpha = a.opacity == null ? 1 : a.opacity), t.hasStroke()) {
    var l = a.lineWidth, u = l / (a.strokeNoScale && t.getLineScale ? t.getLineScale() : 1);
    e.lineWidth !== u && (s || (Ft(e, n), s = !0), e.lineWidth = u);
  }
  for (var h = 0; h < nc.length; h++) {
    var f = nc[h], v = f[0];
    (i || a[v] !== o[v]) && (s || (Ft(e, n), s = !0), e[v] = a[v] || f[1]);
  }
  return s;
}
function pC(e, t, r, i, n) {
  return mp(e, Bn(t, n.inHover), r && Bn(r, n.inHover), i, n);
}
function yp(e, t) {
  var r = t.transform, i = e.dpr || 1;
  r ? e.setTransform(i * r[0], i * r[1], i * r[2], i * r[3], i * r[4], i * r[5]) : e.setTransform(i, 0, 0, i, 0, 0);
}
function gC(e, t, r) {
  for (var i = !1, n = 0; n < e.length; n++) {
    var a = e[n];
    i = i || a.isZeroArea(), yp(t, a), t.beginPath(), a.buildPath(t, a.shape), t.clip();
  }
  r.allClipped = i;
}
function _C(e, t) {
  return e && t ? e[0] !== t[0] || e[1] !== t[1] || e[2] !== t[2] || e[3] !== t[3] || e[4] !== t[4] || e[5] !== t[5] : !(!e && !t);
}
var oc = 1, sc = 2, lc = 3, uc = 4;
function mC(e) {
  var t = ho(e), r = uo(e);
  return !(e.lineDash || !(+t ^ +r) || t && typeof e.fill != "string" || r && typeof e.stroke != "string" || e.strokePercent < 1 || e.strokeOpacity < 1 || e.fillOpacity < 1);
}
function Ft(e, t) {
  t.batchFill && e.fill(), t.batchStroke && e.stroke(), t.batchFill = "", t.batchStroke = "";
}
function Bn(e, t) {
  return t && e.__hoverStyle || e.style;
}
function wp(e, t) {
  Fr(e, t, { inHover: !1, viewWidth: 0, viewHeight: 0 }, !0);
}
function Fr(e, t, r, i) {
  var n = t.transform;
  if (!t.shouldBePainted(r.viewWidth, r.viewHeight, !1, !1)) {
    t.__dirty &= ~qt, t.__isRendered = !1;
    return;
  }
  var a = t.__clipPaths, o = r.prevElClipPaths, s = !1, l = !1;
  if ((!o || uC(a, o)) && (o && o.length && (Ft(e, r), e.restore(), l = s = !0, r.prevElClipPaths = null, r.allClipped = !1, r.prevEl = null), a && a.length && (Ft(e, r), e.save(), gC(a, e, r), s = !0), r.prevElClipPaths = a), r.allClipped) {
    t.__isRendered = !1;
    return;
  }
  t.beforeBrush && t.beforeBrush(), t.innerBeforeBrush();
  var u = r.prevEl;
  u || (l = s = !0);
  var h = t instanceof at && t.autoBatch && mC(t.style);
  s || _C(n, u.transform) ? (Ft(e, r), yp(e, t)) : h || Ft(e, r);
  var f = Bn(t, r.inHover);
  t instanceof at ? (r.lastDrawType !== oc && (l = !0, r.lastDrawType = oc), ac(e, t, u, l, r), (!h || !r.batchFill && !r.batchStroke) && e.beginPath(), cC(e, t, f, h), h && (r.batchFill = f.fill || "", r.batchStroke = f.stroke || "")) : t instanceof ja ? (r.lastDrawType !== lc && (l = !0, r.lastDrawType = lc), ac(e, t, u, l, r), dC(e, t, f)) : t instanceof Xr ? (r.lastDrawType !== sc && (l = !0, r.lastDrawType = sc), pC(e, t, u, l, r), vC(e, t, f)) : t.getTemporalDisplayables && (r.lastDrawType !== uc && (l = !0, r.lastDrawType = uc), yC(e, t, r)), h && i && Ft(e, r), t.innerAfterBrush(), t.afterBrush && t.afterBrush(), r.prevEl = t, t.__dirty = 0, t.__isRendered = !0;
}
function yC(e, t, r) {
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
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), Fr(e, l, a, o === s - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  for (var u = 0, h = n.length; u < h; u++) {
    var l = n[u];
    l.beforeBrush && l.beforeBrush(), l.innerBeforeBrush(), Fr(e, l, a, u === h - 1), l.innerAfterBrush(), l.afterBrush && l.afterBrush(), a.prevEl = l;
  }
  t.clearTemporalDisplayables(), t.notClear = !0, e.restore();
}
var Ls = new Qx(), hc = new Vn(100), fc = ["symbol", "symbolSize", "symbolKeepAspect", "color", "backgroundColor", "dashArrayX", "dashArrayY", "maxTileWidth", "maxTileHeight"];
function cc(e, t) {
  if (e === "none")
    return null;
  var r = t.getDevicePixelRatio(), i = t.getZr(), n = i.painter.type === "svg";
  e.dirty && Ls.delete(e);
  var a = Ls.get(e);
  if (a)
    return a;
  var o = ut(e, {
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
  return l(s), s.rotation = o.rotation, s.scaleX = s.scaleY = n ? 1 : 1 / r, Ls.set(e, s), e.dirty = !1, s;
  function l(u) {
    for (var h = [r], f = !0, v = 0; v < fc.length; ++v) {
      var c = o[fc[v]];
      if (c != null && !$(c) && !V(c) && !mt(c) && typeof c != "boolean") {
        f = !1;
        break;
      }
      h.push(c);
    }
    var d;
    if (f) {
      d = h.join(",") + (n ? "-svg" : "");
      var _ = hc.get(d);
      _ && (n ? u.svgElement = _ : u.image = _);
    }
    var p = bp(o.dashArrayX), g = wC(o.dashArrayY), m = Sp(o.symbol), y = SC(p), w = Tp(g), b = !n && Pi.createCanvas(), S = n && {
      tag: "g",
      attrs: {},
      key: "dcl",
      children: []
    }, T = C(), x;
    b && (b.width = T.width * r, b.height = T.height * r, x = b.getContext("2d")), M(), f && hc.put(d, b || S), u.image = b, u.svgElement = S, u.svgWidth = T.width, u.svgHeight = T.height;
    function C() {
      for (var A = 1, L = 0, I = y.length; L < I; ++L)
        A = Lh(A, y[L]);
      for (var P = 1, L = 0, I = m.length; L < I; ++L)
        P = Lh(P, m[L].length);
      A *= P;
      var k = w * y.length * m.length;
      return {
        width: Math.max(1, Math.min(A, o.maxTileWidth)),
        height: Math.max(1, Math.min(k, o.maxTileHeight))
      };
    }
    function M() {
      x && (x.clearRect(0, 0, b.width, b.height), o.backgroundColor && (x.fillStyle = o.backgroundColor, x.fillRect(0, 0, b.width, b.height)));
      for (var A = 0, L = 0; L < g.length; ++L)
        A += g[L];
      if (A <= 0)
        return;
      for (var I = -w, P = 0, k = 0, E = 0; I < T.height; ) {
        if (P % 2 === 0) {
          for (var Y = k / 2 % m.length, X = 0, B = 0, q = 0; X < T.width * 2; ) {
            for (var Q = 0, L = 0; L < p[E].length; ++L)
              Q += p[E][L];
            if (Q <= 0)
              break;
            if (B % 2 === 0) {
              var W = (1 - o.symbolSize) * 0.5, gt = X + p[E][B] * W, St = I + g[P] * W, Wt = p[E][B] * o.symbolSize, _e = g[P] * o.symbolSize, Qt = q / 2 % m[Y].length;
              Yt(gt, St, Wt, _e, m[Y][Qt]);
            }
            X += p[E][B], ++q, ++B, B === p[E].length && (B = 0);
          }
          ++E, E === p.length && (E = 0);
        }
        I += g[P], ++k, ++P, P === g.length && (P = 0);
      }
      function Yt(Tt, ht, z, Z, me) {
        var bt = n ? 1 : r, Ye = gp(me, Tt * bt, ht * bt, z * bt, Z * bt, o.color, o.symbolKeepAspect);
        if (n) {
          var Ee = i.painter.renderOneToVNode(Ye);
          Ee && S.children.push(Ee);
        } else
          wp(x, Ye);
      }
    }
  }
}
function Sp(e) {
  if (!e || e.length === 0)
    return [["rect"]];
  if (V(e))
    return [[e]];
  for (var t = !0, r = 0; r < e.length; ++r)
    if (!V(e[r])) {
      t = !1;
      break;
    }
  if (t)
    return Sp([e]);
  for (var i = [], r = 0; r < e.length; ++r)
    V(e[r]) ? i.push([e[r]]) : i.push(e[r]);
  return i;
}
function bp(e) {
  if (!e || e.length === 0)
    return [[0, 0]];
  if (mt(e)) {
    var t = Math.ceil(e);
    return [[t, t]];
  }
  for (var r = !0, i = 0; i < e.length; ++i)
    if (!mt(e[i])) {
      r = !1;
      break;
    }
  if (r)
    return bp([e]);
  for (var n = [], i = 0; i < e.length; ++i)
    if (mt(e[i])) {
      var t = Math.ceil(e[i]);
      n.push([t, t]);
    } else {
      var t = J(e[i], function(s) {
        return Math.ceil(s);
      });
      t.length % 2 === 1 ? n.push(t.concat(t)) : n.push(t);
    }
  return n;
}
function wC(e) {
  if (!e || typeof e == "object" && e.length === 0)
    return [0, 0];
  if (mt(e)) {
    var t = Math.ceil(e);
    return [t, t];
  }
  var r = J(e, function(i) {
    return Math.ceil(i);
  });
  return e.length % 2 ? r.concat(r) : r;
}
function SC(e) {
  return J(e, function(t) {
    return Tp(t);
  });
}
function Tp(e) {
  for (var t = 0, r = 0; r < e.length; ++r)
    t += e[r];
  return e.length % 2 === 1 ? t * 2 : t;
}
function bC(e, t) {
  e.eachRawSeries(function(r) {
    if (!e.isSeriesFiltered(r)) {
      var i = r.getData();
      i.hasItemVisual() && i.each(function(o) {
        var s = i.getItemVisual(o, "decal");
        if (s) {
          var l = i.ensureUniqueItemVisual(o, "style");
          l.decal = cc(s, t);
        }
      });
      var n = i.getVisual("decal");
      if (n) {
        var a = i.getVisual("style");
        a.decal = cc(n, t);
      }
    }
  });
}
var fe = new Ie(), xp = {};
function TC(e, t) {
  xp[e] = t;
}
function xC(e) {
  return xp[e];
}
var CC = 1, DC = 800, MC = 900, AC = 1e3, PC = 2e3, LC = 5e3, Cp = 1e3, IC = 1100, Pu = 2e3, Dp = 3e3, RC = 4e3, ko = 4500, kC = 4600, EC = 5e3, $C = 6e3, Mp = 7e3, OC = {
  PROCESSOR: {
    FILTER: AC,
    SERIES_FILTER: DC,
    STATISTIC: LC
  },
  VISUAL: {
    LAYOUT: Cp,
    PROGRESSIVE_LAYOUT: IC,
    GLOBAL: Pu,
    CHART: Dp,
    POST_CHART_LAYOUT: kC,
    COMPONENT: RC,
    BRUSH: EC,
    CHART_ITEM: ko,
    ARIA: $C,
    DECAL: Mp
  }
}, Mt = "__flagInMainProcess", $t = "__pendingUpdate", Is = "__needsUpdateStatus", vc = /^[a-zA-Z0-9_]+$/, Rs = "__connectUpdateStatus", dc = 0, BC = 1, NC = 2;
function Ap(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    if (this.isDisposed()) {
      this.id;
      return;
    }
    return Lp(this, e, t);
  };
}
function Pp(e) {
  return function() {
    for (var t = [], r = 0; r < arguments.length; r++)
      t[r] = arguments[r];
    return Lp(this, e, t);
  };
}
function Lp(e, t, r) {
  return r[0] = r[0] && r[0].toLowerCase(), Ie.prototype[t].apply(e, r);
}
var Ip = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t;
  })(Ie)
), Rp = Ip.prototype;
Rp.on = Pp("on");
Rp.off = Pp("off");
var li, ks, wa, Qe, Es, $s, Os, qi, Zi, pc, gc, Bs, _c, Sa, mc, kp, jt, yc, Ep = (
  /** @class */
  (function(e) {
    G(t, e);
    function t(r, i, n) {
      var a = e.call(this, new Vx()) || this;
      a._chartsViews = [], a._chartsMap = {}, a._componentsViews = [], a._componentsMap = {}, a._pendingActions = [], n = n || {}, V(i) && (i = $p[i]), a._dom = r;
      var o = "canvas", s = "auto", l = !1;
      n.ssr;
      var u = a._zr = Mh(r, {
        renderer: n.renderer || o,
        devicePixelRatio: n.devicePixelRatio,
        width: n.width,
        height: n.height,
        ssr: n.ssr,
        useDirtyRect: K(n.useDirtyRect, l),
        useCoarsePointer: K(n.useCoarsePointer, s),
        pointerSize: n.pointerSize
      });
      a._ssr = n.ssr, a._throttledZrFlush = sp(st(u.flush, u), 17), i = j(i), i && Ud(i, !0), a._theme = i, a._locale = Ub(n.locale || Dd), a._coordSysMgr = new Hd();
      var h = a._api = mc(a);
      function f(v, c) {
        return v.__prio - c.__prio;
      }
      return Ma(co, f), Ma(El, f), a._scheduler = new fp(a, h, El, co), a._messageCenter = new Ip(), a._initEvents(), a.resize = st(a.resize, a), u.animation.on("frame", a._onframe, a), pc(u, a), gc(u, a), Zs(a), a;
    }
    return t.prototype._onframe = function() {
      if (!this._disposed) {
        yc(this);
        var r = this._scheduler;
        if (this[$t]) {
          var i = this[$t].silent;
          this[Mt] = !0;
          try {
            li(this), Qe.update.call(this, null, this[$t].updateParams);
          } catch (l) {
            throw this[Mt] = !1, this[$t] = null, l;
          }
          this._zr.flush(), this[Mt] = !1, this[$t] = null, qi.call(this, i), Zi.call(this, i);
        } else if (r.unfinished) {
          var n = CC, a = this._model, o = this._api;
          r.unfinished = !1;
          do {
            var s = +/* @__PURE__ */ new Date();
            r.performSeriesTasks(a), r.performDataProcessorTasks(a), $s(this, a), r.performVisualTasks(a), Sa(this, this._model, o, "remain", {}), n -= +/* @__PURE__ */ new Date() - s;
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
      if (!this[Mt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        var a, o, s;
        if (F(i) && (n = i.lazyUpdate, a = i.silent, o = i.replaceMerge, s = i.transition, i = i.notMerge), this[Mt] = !0, !this._model || i) {
          var l = new wT(this._api), u = this._theme, h = this._model = new Cu();
          h.scheduler = this._scheduler, h.ssr = this._ssr, h.init(null, null, null, u, this._locale, l);
        }
        this._model.setOption(r, {
          replaceMerge: o
        }, $l);
        var f = {
          seriesTransition: s,
          optionChanged: !0
        };
        if (n)
          this[$t] = {
            silent: a,
            updateParams: f
          }, this[Mt] = !1, this.getZr().wakeUp();
        else {
          try {
            li(this), Qe.update.call(this, null, f);
          } catch (v) {
            throw this[$t] = null, this[Mt] = !1, v;
          }
          this._ssr || this._zr.flush(), this[$t] = null, this[Mt] = !1, qi.call(this, a), Zi.call(this, a);
        }
      }
    }, t.prototype.setTheme = function() {
    }, t.prototype.getModel = function() {
      return this._model;
    }, t.prototype.getOption = function() {
      return this._model && this._model.getOption();
    }, t.prototype.getWidth = function() {
      return this._zr.getWidth();
    }, t.prototype.getHeight = function() {
      return this._zr.getHeight();
    }, t.prototype.getDevicePixelRatio = function() {
      return this._zr.painter.dpr || H.hasGlobalWindow && window.devicePixelRatio || 1;
    }, t.prototype.getRenderedCanvas = function(r) {
      return this.renderToCanvas(r);
    }, t.prototype.renderToCanvas = function(r) {
      r = r || {};
      var i = this._zr.painter;
      return i.getRenderedCanvas({
        backgroundColor: r.backgroundColor || this._model.get("backgroundColor"),
        pixelRatio: r.pixelRatio || this.getDevicePixelRatio()
      });
    }, t.prototype.renderToSVGString = function(r) {
      r = r || {};
      var i = this._zr.painter;
      return i.renderToString({
        useViewBox: r.useViewBox
      });
    }, t.prototype.getSvgDataURL = function() {
      if (H.svgSupported) {
        var r = this._zr, i = r.storage.getDisplayList();
        return D(i, function(n) {
          n.stopAnimation(null, !0);
        }), r.painter.toDataURL();
      }
    }, t.prototype.getDataURL = function(r) {
      if (this._disposed) {
        this.id;
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
        this.id;
        return;
      }
      var i = r.type === "svg", n = this.group, a = Math.min, o = Math.max, s = 1 / 0;
      if (wc[n]) {
        var l = s, u = s, h = -s, f = -s, v = [], c = r && r.pixelRatio || this.getDevicePixelRatio();
        D(bn, function(y, w) {
          if (y.group === n) {
            var b = i ? y.getZr().painter.getSvgDom().innerHTML : y.renderToCanvas(j(r)), S = y.getDom().getBoundingClientRect();
            l = a(S.left, l), u = a(S.top, u), h = o(S.right, h), f = o(S.bottom, f), v.push({
              dom: b,
              left: S.left,
              top: S.top
            });
          }
        }), l *= c, u *= c, h *= c, f *= c;
        var d = h - l, _ = f - u, p = Pi.createCanvas(), g = Mh(p, {
          renderer: i ? "svg" : "canvas"
        });
        if (g.resize({
          width: d,
          height: _
        }), i) {
          var m = "";
          return D(v, function(y) {
            var w = y.left - l, b = y.top - u;
            m += '<g transform="translate(' + w + "," + b + ')">' + y.dom + "</g>";
          }), g.painter.getSvgRoot().innerHTML = m, r.connectedBackgroundColor && g.painter.setBackgroundColor(r.connectedBackgroundColor), g.refreshImmediately(), g.painter.toDataURL();
        } else
          return r.connectedBackgroundColor && g.add(new ve({
            shape: {
              x: 0,
              y: 0,
              width: d,
              height: _
            },
            style: {
              fill: r.connectedBackgroundColor
            }
          })), D(v, function(y) {
            var w = new Xr({
              style: {
                x: y.left * c - l,
                y: y.top * c - u,
                image: y.dom
              }
            });
            g.add(w);
          }), g.refreshImmediately(), p.toDataURL("image/" + (r && r.type || "png"));
      } else
        return this.getDataURL(r);
    }, t.prototype.convertToPixel = function(r, i) {
      return Es(this, "convertToPixel", r, i);
    }, t.prototype.convertFromPixel = function(r, i) {
      return Es(this, "convertFromPixel", r, i);
    }, t.prototype.containPixel = function(r, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      var n = this._model, a, o = ns(n, r);
      return D(o, function(s, l) {
        l.indexOf("Models") >= 0 && D(s, function(u) {
          var h = u.coordinateSystem;
          if (h && h.containPoint)
            a = a || !!h.containPoint(i);
          else if (l === "seriesModels") {
            var f = this._chartsMap[u.__viewId];
            f && f.containPoint && (a = a || f.containPoint(i, u));
          }
        }, this);
      }, this), !!a;
    }, t.prototype.getVisual = function(r, i) {
      var n = this._model, a = ns(n, r, {
        defaultMainType: "series"
      }), o = a.seriesModel, s = o.getData(), l = a.hasOwnProperty("dataIndexInside") ? a.dataIndexInside : a.hasOwnProperty("dataIndex") ? s.indexOfRawIndex(a.dataIndex) : null;
      return l != null ? Wx(s, l, i) : Yx(s, i);
    }, t.prototype.getViewOfComponentModel = function(r) {
      return this._componentsMap[r.__viewId];
    }, t.prototype.getViewOfSeriesModel = function(r) {
      return this._chartsMap[r.__viewId];
    }, t.prototype._initEvents = function() {
      var r = this;
      D(FC, function(i) {
        var n = function(a) {
          var o = r.getModel(), s = a.target, l, u = i === "globalout";
          if (u ? l = {} : s && ln(s, function(d) {
            var _ = ct(d);
            if (_ && _.dataIndex != null) {
              var p = _.dataModel || o.getSeriesByIndex(_.seriesIndex);
              return l = p && p.getDataParams(_.dataIndex, _.dataType, s) || {}, !0;
            } else if (_.eventData)
              return l = R({}, _.eventData), !0;
          }, !0), l) {
            var h = l.componentType, f = l.componentIndex;
            (h === "markLine" || h === "markPoint" || h === "markArea") && (h = "series", f = l.seriesIndex);
            var v = h && f != null && o.getComponent(h, f), c = v && r[v.mainType === "series" ? "_chartsMap" : "_componentsMap"][v.__viewId];
            l.event = a, l.type = i, r._$eventProcessor.eventInfo = {
              targetEl: s,
              packedEvent: l,
              model: v,
              view: c
            }, r.trigger(i, l);
          }
        };
        n.zrEventfulCallAtLast = !0, r._zr.on(i, n, r);
      }), D(Sn, function(i, n) {
        r._messageCenter.on(n, function(a) {
          this.trigger(n, a);
        }, r);
      }), D(["selectchanged"], function(i) {
        r._messageCenter.on(i, function(n) {
          this.trigger(i, n);
        }, r);
      }), qx(this._messageCenter, this, this._api);
    }, t.prototype.isDisposed = function() {
      return this._disposed;
    }, t.prototype.clear = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this.setOption({
        series: []
      }, !0);
    }, t.prototype.dispose = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._disposed = !0;
      var r = this.getDom();
      r && Hv(this.getDom(), Iu, "");
      var i = this, n = i._api, a = i._model;
      D(i._componentsViews, function(o) {
        o.dispose(a, n);
      }), D(i._chartsViews, function(o) {
        o.dispose(a, n);
      }), i._zr.dispose(), i._dom = i._model = i._chartsMap = i._componentsMap = i._chartsViews = i._componentsViews = i._scheduler = i._api = i._zr = i._throttledZrFlush = i._theme = i._coordSysMgr = i._messageCenter = null, delete bn[i.id];
    }, t.prototype.resize = function(r) {
      if (!this[Mt]) {
        if (this._disposed) {
          this.id;
          return;
        }
        this._zr.resize(r);
        var i = this._model;
        if (this._loadingFX && this._loadingFX.resize(), !!i) {
          var n = i.resetOption("media"), a = r && r.silent;
          this[$t] && (a == null && (a = this[$t].silent), n = !0, this[$t] = null), this[Mt] = !0;
          try {
            n && li(this), Qe.update.call(this, {
              type: "resize",
              animation: R({
                // Disable animation
                duration: 0
              }, r && r.animation)
            });
          } catch (o) {
            throw this[Mt] = !1, o;
          }
          this[Mt] = !1, qi.call(this, a), Zi.call(this, a);
        }
      }
    }, t.prototype.showLoading = function(r, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (F(r) && (i = r, r = ""), r = r || "default", this.hideLoading(), !!Ol[r]) {
        var n = Ol[r](this._api, i), a = this._zr;
        this._loadingFX = n, a.add(n);
      }
    }, t.prototype.hideLoading = function() {
      if (this._disposed) {
        this.id;
        return;
      }
      this._loadingFX && this._zr.remove(this._loadingFX), this._loadingFX = null;
    }, t.prototype.makeActionFromEvent = function(r) {
      var i = R({}, r);
      return i.type = Sn[r.type], i;
    }, t.prototype.dispatchAction = function(r, i) {
      if (this._disposed) {
        this.id;
        return;
      }
      if (F(i) || (i = {
        silent: !!i
      }), !!fo[r.type] && this._model) {
        if (this[Mt]) {
          this._pendingActions.push(r);
          return;
        }
        var n = i.silent;
        Os.call(this, r, n);
        var a = i.flush;
        a ? this._zr.flush() : a !== !1 && H.browser.weChat && this._throttledZrFlush(), qi.call(this, n), Zi.call(this, n);
      }
    }, t.prototype.updateLabelLayout = function() {
      fe.trigger("series:layoutlabels", this._model, this._api, {
        // Not adding series labels.
        // TODO
        updatedSeries: []
      });
    }, t.prototype.appendData = function(r) {
      if (this._disposed) {
        this.id;
        return;
      }
      var i = r.seriesIndex, n = this.getModel(), a = n.getSeriesByIndex(i);
      a.appendData(r), this._scheduler.unfinished = !0, this.getZr().wakeUp();
    }, t.internalField = (function() {
      li = function(f) {
        var v = f._scheduler;
        v.restorePipelines(f._model), v.prepareStageTasks(), ks(f, !0), ks(f, !1), v.plan();
      }, ks = function(f, v) {
        for (var c = f._model, d = f._scheduler, _ = v ? f._componentsViews : f._chartsViews, p = v ? f._componentsMap : f._chartsMap, g = f._zr, m = f._api, y = 0; y < _.length; y++)
          _[y].__alive = !1;
        v ? c.eachComponent(function(S, T) {
          S !== "series" && w(T);
        }) : c.eachSeries(w);
        function w(S) {
          var T = S.__requireNewView;
          S.__requireNewView = !1;
          var x = "_ec_" + S.id + "_" + S.type, C = !T && p[x];
          if (!C) {
            var M = De(S.type), A = v ? fr.getClass(M.main, M.sub) : (
              // FIXME:TS
              // (ChartView as ChartViewConstructor).getClass('series', classType.sub)
              // For backward compat, still support a chart type declared as only subType
              // like "liquidfill", but recommend "series.liquidfill"
              // But need a base class to make a type series.
              lr.getClass(M.sub)
            );
            C = new A(), C.init(c, m), p[x] = C, _.push(C), g.add(C.group);
          }
          S.__viewId = C.__id = x, C.__alive = !0, C.__model = S, C.group.__ecComponentInfo = {
            mainType: S.mainType,
            index: S.componentIndex
          }, !v && d.prepareView(C, S, c, m);
        }
        for (var y = 0; y < _.length; ) {
          var b = _[y];
          b.__alive ? y++ : (!v && b.renderTask.dispose(), g.remove(b.group), b.dispose(c, m), _.splice(y, 1), p[b.__id] === b && delete p[b.__id], b.__id = b.group.__ecComponentInfo = null);
        }
      }, wa = function(f, v, c, d, _) {
        var p = f._model;
        if (p.setUpdatePayload(c), !d) {
          D([].concat(f._componentsViews).concat(f._chartsViews), b);
          return;
        }
        var g = {};
        g[d + "Id"] = c[d + "Id"], g[d + "Index"] = c[d + "Index"], g[d + "Name"] = c[d + "Name"];
        var m = {
          mainType: d,
          query: g
        };
        _ && (m.subType = _);
        var y = c.excludeSeriesId, w;
        y != null && (w = tt(), D(kt(y), function(S) {
          var T = Ae(S, null);
          T != null && w.set(T, !0);
        })), p && p.eachComponent(m, function(S) {
          var T = w && w.get(S.id) != null;
          if (!T)
            if (ef(c))
              if (S instanceof hr)
                c.type === Hr && !c.notBlur && !S.get(["emphasis", "disabled"]) && mS(S, c, f._api);
              else {
                var x = fu(S.mainType, S.componentIndex, c.name, f._api), C = x.focusSelf, M = x.dispatchers;
                c.type === Hr && C && !c.notBlur && ml(S.mainType, S.componentIndex, f._api), M && D(M, function(A) {
                  c.type === Hr ? pl(A) : gl(A);
                });
              }
            else wl(c) && S instanceof hr && (SS(S, c, f._api), Jh(S), jt(f));
        }, f), p && p.eachComponent(m, function(S) {
          var T = w && w.get(S.id) != null;
          T || b(f[d === "series" ? "_chartsMap" : "_componentsMap"][S.__viewId]);
        }, f);
        function b(S) {
          S && S.__alive && S[v] && S[v](S.__model, p, f._api, c);
        }
      }, Qe = {
        prepareAndUpdate: function(f) {
          li(this), Qe.update.call(this, f, {
            // Needs to mark option changed if newOption is given.
            // It's from MagicType.
            // TODO If use a separate flag optionChanged in payload?
            optionChanged: f.newOption != null
          });
        },
        update: function(f, v) {
          var c = this._model, d = this._api, _ = this._zr, p = this._coordSysMgr, g = this._scheduler;
          if (c) {
            c.setUpdatePayload(f), g.restoreData(c, f), g.performSeriesTasks(c), p.create(c, d), g.performDataProcessorTasks(c, f), $s(this, c), p.update(c, d), r(c), g.performVisualTasks(c, f), Bs(this, c, d, f, v);
            var m = c.get("backgroundColor") || "transparent", y = c.get("darkMode");
            _.setBackgroundColor(m), y != null && y !== "auto" && _.setDarkMode(y), fe.trigger("afterupdate", c, d);
          }
        },
        updateTransform: function(f) {
          var v = this, c = this._model, d = this._api;
          if (c) {
            c.setUpdatePayload(f);
            var _ = [];
            c.eachComponent(function(g, m) {
              if (g !== "series") {
                var y = v.getViewOfComponentModel(m);
                if (y && y.__alive)
                  if (y.updateTransform) {
                    var w = y.updateTransform(m, c, d, f);
                    w && w.update && _.push(y);
                  } else
                    _.push(y);
              }
            });
            var p = tt();
            c.eachSeries(function(g) {
              var m = v._chartsMap[g.__viewId];
              if (m.updateTransform) {
                var y = m.updateTransform(g, c, d, f);
                y && y.update && p.set(g.uid, 1);
              } else
                p.set(g.uid, 1);
            }), r(c), this._scheduler.performVisualTasks(c, f, {
              setDirty: !0,
              dirtyMap: p
            }), Sa(this, c, d, f, {}, p), fe.trigger("afterupdate", c, d);
          }
        },
        updateView: function(f) {
          var v = this._model;
          v && (v.setUpdatePayload(f), lr.markUpdateMethod(f, "updateView"), r(v), this._scheduler.performVisualTasks(v, f, {
            setDirty: !0
          }), Bs(this, v, this._api, f, {}), fe.trigger("afterupdate", v, this._api));
        },
        updateVisual: function(f) {
          var v = this, c = this._model;
          c && (c.setUpdatePayload(f), c.eachSeries(function(d) {
            d.getData().clearAllVisual();
          }), lr.markUpdateMethod(f, "updateVisual"), r(c), this._scheduler.performVisualTasks(c, f, {
            visualType: "visual",
            setDirty: !0
          }), c.eachComponent(function(d, _) {
            if (d !== "series") {
              var p = v.getViewOfComponentModel(_);
              p && p.__alive && p.updateVisual(_, c, v._api, f);
            }
          }), c.eachSeries(function(d) {
            var _ = v._chartsMap[d.__viewId];
            _.updateVisual(d, c, v._api, f);
          }), fe.trigger("afterupdate", c, this._api));
        },
        updateLayout: function(f) {
          Qe.update.call(this, f);
        }
      }, Es = function(f, v, c, d) {
        if (f._disposed) {
          f.id;
          return;
        }
        for (var _ = f._model, p = f._coordSysMgr.getCoordinateSystems(), g, m = ns(_, c), y = 0; y < p.length; y++) {
          var w = p[y];
          if (w[v] && (g = w[v](_, m, d)) != null)
            return g;
        }
      }, $s = function(f, v) {
        var c = f._chartsMap, d = f._scheduler;
        v.eachSeries(function(_) {
          d.updateStreamModes(_, c[_.__viewId]);
        });
      }, Os = function(f, v) {
        var c = this, d = this.getModel(), _ = f.type, p = f.escapeConnect, g = fo[_], m = g.actionInfo, y = (m.update || "update").split(":"), w = y.pop(), b = y[0] != null && De(y[0]);
        this[Mt] = !0;
        var S = [f], T = !1;
        f.batch && (T = !0, S = J(f.batch, function(P) {
          return P = ut(R({}, P), f), P.batch = null, P;
        }));
        var x = [], C, M = wl(f), A = ef(f);
        if (A && ld(this._api), D(S, function(P) {
          if (C = g.action(P, c._model, c._api), C = C || R({}, P), C.type = m.event || C.type, x.push(C), A) {
            var k = iu(f), E = k.queryOptionMap, Y = k.mainTypeSpecified, X = Y ? E.keys()[0] : "series";
            wa(c, w, P, X), jt(c);
          } else M ? (wa(c, w, P, "series"), jt(c)) : b && wa(c, w, P, b.main, b.sub);
        }), w !== "none" && !A && !M && !b)
          try {
            this[$t] ? (li(this), Qe.update.call(this, f), this[$t] = null) : Qe[w].call(this, f);
          } catch (P) {
            throw this[Mt] = !1, P;
          }
        if (T ? C = {
          type: m.event || _,
          escapeConnect: p,
          batch: x
        } : C = x[0], this[Mt] = !1, !v) {
          var L = this._messageCenter;
          if (L.trigger(C.type, C), M) {
            var I = {
              type: "selectchanged",
              escapeConnect: p,
              selected: bS(d),
              isFromClick: f.isFromClick || !1,
              fromAction: f.type,
              fromActionPayload: f
            };
            L.trigger(I.type, I);
          }
        }
      }, qi = function(f) {
        for (var v = this._pendingActions; v.length; ) {
          var c = v.shift();
          Os.call(this, c, f);
        }
      }, Zi = function(f) {
        !f && this.trigger("updated");
      }, pc = function(f, v) {
        f.on("rendered", function(c) {
          v.trigger("rendered", c), // Although zr is dirty if initial animation is not finished
          // and this checking is called on frame, we also check
          // animation finished for robustness.
          f.animation.isFinished() && !v[$t] && !v._scheduler.unfinished && !v._pendingActions.length && v.trigger("finished");
        });
      }, gc = function(f, v) {
        f.on("mouseover", function(c) {
          var d = c.target, _ = ln(d, yl);
          _ && (yS(_, c, v._api), jt(v));
        }).on("mouseout", function(c) {
          var d = c.target, _ = ln(d, yl);
          _ && (wS(_, c, v._api), jt(v));
        }).on("click", function(c) {
          var d = c.target, _ = ln(d, function(m) {
            return ct(m).dataIndex != null;
          }, !0);
          if (_) {
            var p = _.selected ? "unselect" : "select", g = ct(_);
            v._api.dispatchAction({
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
        f.clearColorPalette(), f.eachSeries(function(v) {
          v.clearColorPalette();
        });
      }
      function i(f) {
        var v = [], c = [], d = !1;
        if (f.eachComponent(function(m, y) {
          var w = y.get("zlevel") || 0, b = y.get("z") || 0, S = y.getZLevelKey();
          d = d || !!S, (m === "series" ? c : v).push({
            zlevel: w,
            z: b,
            idx: y.componentIndex,
            type: m,
            key: S
          });
        }), d) {
          var _ = v.concat(c), p, g;
          Ma(_, function(m, y) {
            return m.zlevel === y.zlevel ? m.z - y.z : m.zlevel - y.zlevel;
          }), D(_, function(m) {
            var y = f.getComponent(m.type, m.idx), w = m.zlevel, b = m.key;
            p != null && (w = Math.max(p, w)), b ? (w === p && b !== g && w++, g = b) : g && (w === p && w++, g = ""), p = w, y.setZLevel(w);
          });
        }
      }
      Bs = function(f, v, c, d, _) {
        i(v), _c(f, v, c, d, _), D(f._chartsViews, function(p) {
          p.__alive = !1;
        }), Sa(f, v, c, d, _), D(f._chartsViews, function(p) {
          p.__alive || p.remove(v, c);
        });
      }, _c = function(f, v, c, d, _, p) {
        D(p || f._componentsViews, function(g) {
          var m = g.__model;
          u(m, g), g.render(m, v, c, d), s(m, g), h(m, g);
        });
      }, Sa = function(f, v, c, d, _, p) {
        var g = f._scheduler;
        _ = R(_ || {}, {
          updatedSeries: v.getSeries()
        }), fe.trigger("series:beforeupdate", v, c, _);
        var m = !1;
        v.eachSeries(function(y) {
          var w = f._chartsMap[y.__viewId];
          w.__alive = !0;
          var b = w.renderTask;
          g.updatePayload(b, d), u(y, w), p && p.get(y.uid) && b.dirty(), b.perform(g.getPerformArgs(b)) && (m = !0), w.group.silent = !!y.get("silent"), o(y, w), Jh(y);
        }), g.unfinished = m || g.unfinished, fe.trigger("series:layoutlabels", v, c, _), fe.trigger("series:transition", v, c, _), v.eachSeries(function(y) {
          var w = f._chartsMap[y.__viewId];
          s(y, w), h(y, w);
        }), a(f, v), fe.trigger("series:afterupdate", v, c, _);
      }, jt = function(f) {
        f[Is] = !0, f.getZr().wakeUp();
      }, yc = function(f) {
        f[Is] && (f.getZr().storage.traverse(function(v) {
          yn(v) || n(v);
        }), f[Is] = !1);
      };
      function n(f) {
        for (var v = [], c = f.currentStates, d = 0; d < c.length; d++) {
          var _ = c[d];
          _ === "emphasis" || _ === "blur" || _ === "select" || v.push(_);
        }
        f.selected && f.states.select && v.push("select"), f.hoverState === uu && f.states.emphasis ? v.push("emphasis") : f.hoverState === lu && f.states.blur && v.push("blur"), f.useStates(v);
      }
      function a(f, v) {
        var c = f._zr, d = c.storage, _ = 0;
        d.traverse(function(p) {
          p.isGroup || _++;
        }), _ > v.get("hoverLayerThreshold") && !H.node && !H.worker && v.eachSeries(function(p) {
          if (!p.preventUsingHoverLayer) {
            var g = f._chartsMap[p.__viewId];
            g.__alive && g.eachRendered(function(m) {
              m.states.emphasis && (m.states.emphasis.hoverLayer = !0);
            });
          }
        });
      }
      function o(f, v) {
        var c = f.get("blendMode") || null;
        v.eachRendered(function(d) {
          d.isGroup || (d.style.blend = c);
        });
      }
      function s(f, v) {
        if (!f.preventAutoZ) {
          var c = f.get("z") || 0, d = f.get("zlevel") || 0;
          v.eachRendered(function(_) {
            return l(_, c, d, -1 / 0), !0;
          });
        }
      }
      function l(f, v, c, d) {
        var _ = f.getTextContent(), p = f.getTextGuideLine(), g = f.isGroup;
        if (g)
          for (var m = f.childrenRef(), y = 0; y < m.length; y++)
            d = Math.max(l(m[y], v, c, d), d);
        else
          f.z = v, f.zlevel = c, d = Math.max(f.z2, d);
        if (_ && (_.z = v, _.zlevel = c, isFinite(d) && (_.z2 = d + 2)), p) {
          var w = f.textGuideLineConfig;
          p.z = v, p.zlevel = c, isFinite(d) && (p.z2 = d + (w && w.showAbove ? 1 : -1));
        }
        return d;
      }
      function u(f, v) {
        v.eachRendered(function(c) {
          if (!yn(c)) {
            var d = c.getTextContent(), _ = c.getTextGuideLine();
            c.stateTransition && (c.stateTransition = null), d && d.stateTransition && (d.stateTransition = null), _ && _.stateTransition && (_.stateTransition = null), c.hasState() ? (c.prevStates = c.currentStates, c.clearStates()) : c.prevStates && (c.prevStates = null);
          }
        });
      }
      function h(f, v) {
        var c = f.getModel("stateAnimation"), d = f.isAnimationEnabled(), _ = c.get("duration"), p = _ > 0 ? {
          duration: _,
          delay: c.get("delay"),
          easing: c.get("easing")
          // additive: stateAnimationModel.get('additive')
        } : null;
        v.eachRendered(function(g) {
          if (g.states && g.states.emphasis) {
            if (yn(g))
              return;
            if (g instanceof at && LS(g), g.__dirty) {
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
      mc = function(f) {
        return new /** @class */
        ((function(v) {
          G(c, v);
          function c() {
            return v !== null && v.apply(this, arguments) || this;
          }
          return c.prototype.getCoordinateSystems = function() {
            return f._coordSysMgr.getCoordinateSystems();
          }, c.prototype.getComponentByElement = function(d) {
            for (; d; ) {
              var _ = d.__ecComponentInfo;
              if (_ != null)
                return f._model.getComponent(_.mainType, _.index);
              d = d.parent;
            }
          }, c.prototype.enterEmphasis = function(d, _) {
            pl(d, _), jt(f);
          }, c.prototype.leaveEmphasis = function(d, _) {
            gl(d, _), jt(f);
          }, c.prototype.enterBlur = function(d) {
            _S(d), jt(f);
          }, c.prototype.leaveBlur = function(d) {
            nd(d), jt(f);
          }, c.prototype.enterSelect = function(d) {
            ad(d), jt(f);
          }, c.prototype.leaveSelect = function(d) {
            od(d), jt(f);
          }, c.prototype.getModel = function() {
            return f.getModel();
          }, c.prototype.getViewOfComponentModel = function(d) {
            return f.getViewOfComponentModel(d);
          }, c.prototype.getViewOfSeriesModel = function(d) {
            return f.getViewOfSeriesModel(d);
          }, c;
        })(zd))(f);
      }, kp = function(f) {
        function v(c, d) {
          for (var _ = 0; _ < c.length; _++) {
            var p = c[_];
            p[Rs] = d;
          }
        }
        D(Sn, function(c, d) {
          f._messageCenter.on(d, function(_) {
            if (wc[f.group] && f[Rs] !== dc) {
              if (_ && _.escapeConnect)
                return;
              var p = f.makeActionFromEvent(_), g = [];
              D(bn, function(m) {
                m !== f && m.group === f.group && g.push(m);
              }), v(g, dc), D(g, function(m) {
                m[Rs] !== BC && m.dispatchAction(p);
              }), v(g, NC);
            }
          });
        });
      };
    })(), t;
  })(Ie)
), Lu = Ep.prototype;
Lu.on = Ap("on");
Lu.off = Ap("off");
Lu.one = function(e, t, r) {
  var i = this;
  function n() {
    for (var a = [], o = 0; o < arguments.length; o++)
      a[o] = arguments[o];
    t && t.apply && t.apply(this, a), i.off(e, n);
  }
  this.on.call(this, e, n, r);
};
var FC = ["click", "dblclick", "mouseover", "mouseout", "mousemove", "mousedown", "mouseup", "globalout", "contextmenu"];
var fo = {}, Sn = {}, El = [], $l = [], co = [], $p = {}, Ol = {}, bn = {}, wc = {}, zC = +/* @__PURE__ */ new Date() - 0, Iu = "_echarts_instance_";
function HC(e, t, r) {
  var i = !(r && r.ssr);
  if (i) {
    var n = VC(e);
    if (n)
      return n;
  }
  var a = new Ep(e, t, r);
  return a.id = "ec_" + zC++, bn[a.id] = a, i && Hv(e, Iu, a.id), kp(a), fe.trigger("afterinit", a), a;
}
function VC(e) {
  return bn[l1(e, Iu)];
}
function Op(e, t) {
  $p[e] = t;
}
function Bp(e) {
  ot($l, e) < 0 && $l.push(e);
}
function Np(e, t) {
  ku(El, e, t, PC);
}
function UC(e) {
  Ru("afterinit", e);
}
function GC(e) {
  Ru("afterupdate", e);
}
function Ru(e, t) {
  fe.on(e, t);
}
function ki(e, t, r) {
  rt(t) && (r = t, t = "");
  var i = F(e) ? e.type : [e, e = {
    event: t
  }][0];
  e.event = (e.event || i).toLowerCase(), t = e.event, !Sn[t] && (Ve(vc.test(i) && vc.test(t)), fo[i] || (fo[i] = {
    action: r,
    actionInfo: e
  }), Sn[t] = i);
}
function WC(e, t) {
  Hd.register(e, t);
}
function YC(e, t) {
  ku(co, e, t, Cp, "layout");
}
function qr(e, t) {
  ku(co, e, t, Dp, "visual");
}
var Sc = [];
function ku(e, t, r, i, n) {
  if ((rt(t) || F(t)) && (r = t, t = i), !(ot(Sc, r) >= 0)) {
    Sc.push(r);
    var a = fp.wrapStageHandler(r, n);
    a.__prio = t, a.__raw = r, e.push(a);
  }
}
function Fp(e, t) {
  Ol[e] = t;
}
function XC(e, t, r) {
  var i = xC("registerMap");
  i && i(e, t, r);
}
var qC = KT;
qr(Pu, Ax);
qr(ko, Px);
qr(ko, Lx);
qr(Pu, Ux);
qr(ko, Gx);
qr(Mp, bC);
Bp(Ud);
Np(MC, RT);
Fp("default", Ix);
ki({
  type: Hr,
  event: Hr,
  update: Hr
}, zt);
ki({
  type: ka,
  event: ka,
  update: ka
}, zt);
ki({
  type: gn,
  event: gn,
  update: gn
}, zt);
ki({
  type: Ea,
  event: Ea,
  update: Ea
}, zt);
ki({
  type: _n,
  event: _n,
  update: _n
}, zt);
Op("light", Hx);
Op("dark", pp);
function Ki(e) {
  return e == null ? 0 : e.length || 1;
}
function bc(e) {
  return e;
}
var ZC = (
  /** @class */
  (function() {
    function e(t, r, i, n, a, o) {
      this._old = t, this._new = r, this._oldKeyGetter = i || bc, this._newKeyGetter = n || bc, this.context = a, this._diffModeMultiple = o === "multiple";
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
        var s = n[o], l = i[s], u = Ki(l);
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
        var l = a[s], u = i[l], h = n[l], f = Ki(u), v = Ki(h);
        if (f > 1 && v === 1)
          this._updateManyToOne && this._updateManyToOne(h, u), n[l] = null;
        else if (f === 1 && v > 1)
          this._updateOneToMany && this._updateOneToMany(h, u), n[l] = null;
        else if (f === 1 && v === 1)
          this._update && this._update(h, u), n[l] = null;
        else if (f > 1 && v > 1)
          this._updateManyToMany && this._updateManyToMany(h, u), n[l] = null;
        else if (f > 1)
          for (var c = 0; c < f; c++)
            this._remove && this._remove(u[c]);
        else
          this._remove && this._remove(u);
      }
      this._performRestAdd(o, n);
    }, e.prototype._performRestAdd = function(t, r) {
      for (var i = 0; i < t.length; i++) {
        var n = t[i], a = r[n], o = Ki(a);
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
          var l = r[s], u = Ki(l);
          u === 0 ? (r[s] = o, a && i.push(s)) : u === 1 ? r[s] = [l, o] : l.push(o);
        }
      }
    }, e;
  })()
), KC = (
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
function QC(e, t) {
  var r = {}, i = r.encode = {}, n = tt(), a = [], o = [], s = {};
  D(e.dimensions, function(v) {
    var c = e.getDimensionInfo(v), d = c.coordDim;
    if (d) {
      var _ = c.coordDimIndex;
      Ns(i, d)[_] = v, c.isExtraCoord || (n.set(d, 1), jC(c.type) && (a[0] = v), Ns(s, d)[_] = e.getDimensionIndex(c.name)), c.defaultTooltip && o.push(v);
    }
    $d.each(function(p, g) {
      var m = Ns(i, g), y = c.otherDims[g];
      y != null && y !== !1 && (m[y] = c.name);
    });
  });
  var l = [], u = {};
  n.each(function(v, c) {
    var d = i[c];
    u[c] = d[0], l = l.concat(d);
  }), r.dataDimsOnCoord = l, r.dataDimIndicesOnCoord = J(l, function(v) {
    return e.getDimensionInfo(v).storeDimIndex;
  }), r.encodeFirstDimNotExtra = u;
  var h = i.label;
  h && h.length && (a = h.slice());
  var f = i.tooltip;
  return f && f.length ? o = f.slice() : o.length || (o = a.slice()), i.defaultedLabel = a, i.defaultedTooltip = o, r.userOutput = new KC(s, t), r;
}
function Ns(e, t) {
  return e.hasOwnProperty(t) || (e[t] = []), e[t];
}
function jC(e) {
  return !(e === "ordinal" || e === "time");
}
var Fa = (
  /** @class */
  /* @__PURE__ */ (function() {
    function e(t) {
      this.otherDims = {}, t != null && R(this, t);
    }
    return e;
  })()
), JC = wt(), tD = {
  float: "f",
  int: "i",
  ordinal: "o",
  number: "n",
  time: "t"
}, zp = (
  /** @class */
  (function() {
    function e(t) {
      this.dimensions = t.dimensions, this._dimOmitted = t.dimensionOmitted, this.source = t.source, this._fullDimCount = t.fullDimensionCount, this._updateDimOmitted(t.dimensionOmitted);
    }
    return e.prototype.isDimensionOmitted = function() {
      return this._dimOmitted;
    }, e.prototype._updateDimOmitted = function(t) {
      this._dimOmitted = t, t && (this._dimNameMap || (this._dimNameMap = Vp(this.source)));
    }, e.prototype.getSourceDimensionIndex = function(t) {
      return K(this._dimNameMap.get(t), -1);
    }, e.prototype.getSourceDimension = function(t) {
      var r = this.source.dimensionsDefine;
      if (r)
        return r[t];
    }, e.prototype.makeStoreSchema = function() {
      for (var t = this._fullDimCount, r = Yd(this.source), i = !Up(t), n = "", a = [], o = 0, s = 0; o < t; o++) {
        var l = void 0, u = void 0, h = void 0, f = this.dimensions[s];
        if (f && f.storeDimIndex === o)
          l = r ? f.name : null, u = f.type, h = f.ordinalMeta, s++;
        else {
          var v = this.getSourceDimension(o);
          v && (l = r ? v.name : null, u = v.type);
        }
        a.push({
          property: l,
          type: u,
          ordinalMeta: h
        }), r && l != null && (!f || !f.isCalculationCoord) && (n += i ? l.replace(/\`/g, "`1").replace(/\$/g, "`2") : l), n += "$", n += tD[u] || "f", h && (n += h.uid), n += "$";
      }
      var c = this.source, d = [c.seriesLayoutBy, c.startIndex, n].join("$$");
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
function eD(e) {
  return e instanceof zp;
}
function Hp(e) {
  for (var t = tt(), r = 0; r < (e || []).length; r++) {
    var i = e[r], n = F(i) ? i.name : i;
    n != null && t.get(n) == null && t.set(n, r);
  }
  return t;
}
function Vp(e) {
  var t = JC(e);
  return t.dimNameMap || (t.dimNameMap = Hp(e.dimensionsDefine));
}
function Up(e) {
  return e > 30;
}
var Qi = F, je = J, rD = typeof Int32Array > "u" ? Array : Int32Array, iD = "e\0\0", Tc = -1, nD = ["hasItemOption", "_nameList", "_idList", "_invertedIndicesMap", "_dimSummary", "userOutput", "_rawData", "_dimValueGetter", "_nameDimIdx", "_idDimIdx", "_nameRepeatCount"], aD = ["_approximateExtent"], xc, ba, ji, Ji, Fs, tn, zs, oD = (
  /** @class */
  (function() {
    function e(t, r) {
      this.type = "list", this._dimOmitted = !1, this._nameList = [], this._idList = [], this._visual = {}, this._layout = {}, this._itemVisuals = [], this._itemLayouts = [], this._graphicEls = [], this._approximateExtent = {}, this._calculationInfo = {}, this.hasItemOption = !1, this.TRANSFERABLE_METHODS = ["cloneShallow", "downSample", "minmaxDownSample", "lttbDownSample", "map"], this.CHANGABLE_METHODS = ["filterSelf", "selectRange"], this.DOWNSAMPLE_METHODS = ["downSample", "minmaxDownSample", "lttbDownSample"];
      var i, n = !1;
      eD(t) ? (i = t.dimensions, this._dimOmitted = t.isDimensionOmitted(), this._schema = t) : (n = !0, i = t), i = i || ["x", "y"];
      for (var a = {}, o = [], s = {}, l = !1, u = {}, h = 0; h < i.length; h++) {
        var f = i[h], v = V(f) ? new Fa({
          name: f
        }) : f instanceof Fa ? f : new Fa(f), c = v.name;
        v.type = v.type || "float", v.coordDim || (v.coordDim = c, v.coordDimIndex = 0);
        var d = v.otherDims = v.otherDims || {};
        o.push(c), a[c] = v, u[c] != null && (l = !0), v.createInvertedIndices && (s[c] = []), d.itemName === 0 && (this._nameDimIdx = h), d.itemId === 0 && (this._idDimIdx = h), n && (v.storeDimIndex = h);
      }
      if (this.dimensions = o, this._dimInfos = a, this._initGetDimensionInfo(l), this.hostModel = r, this._invertedIndicesMap = s, this._dimOmitted) {
        var _ = this._dimIdxToName = tt();
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
      if (mt(t) || t != null && !isNaN(t) && !this._getDimInfo(t) && (!this._dimOmitted || this._schema.getSourceDimensionIndex(t) < 0))
        return +t;
    }, e.prototype._getStoreDimIndex = function(t) {
      var r = this.getDimensionIndex(t);
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
      if (t instanceof Cl && (a = t), !a) {
        var o = this.dimensions, s = Du(t) || Vt(t) ? new Xd(t, o.length) : t;
        a = new Cl();
        var l = je(o, function(u) {
          return {
            type: n._dimInfos[u].type,
            property: u
          };
        });
        a.initData(s, l, i);
      }
      this._store = a, this._nameList = (r || []).slice(), this._idList = [], this._nameRepeatCount = {}, this._doInit(0, a.count()), this._dimSummary = QC(this, this._schema), this.userOutput = this._dimSummary.userOutput;
    }, e.prototype.appendData = function(t) {
      var r = this._store.appendData(t);
      this._doInit(r[0], r[1]);
    }, e.prototype.appendValues = function(t, r) {
      var i = this._store.appendValues(t, r && r.length), n = i.start, a = i.end, o = this._shouldMakeIdFromName();
      if (this._updateOrdinalMeta(), r)
        for (var s = n; s < a; s++) {
          var l = s - n;
          this._nameList[s] = r[l], o && zs(this, s);
        }
    }, e.prototype._updateOrdinalMeta = function() {
      for (var t = this._store, r = this.dimensions, i = 0; i < r.length; i++) {
        var n = this._dimInfos[r[i]];
        n.ordinalMeta && t.collectOrdinalMeta(n.storeDimIndex, n.ordinalMeta);
      }
    }, e.prototype._shouldMakeIdFromName = function() {
      var t = this._store.getProvider();
      return this._idDimIdx == null && t.getSource().sourceFormat !== sr && !t.fillStorage;
    }, e.prototype._doInit = function(t, r) {
      if (!(t >= r)) {
        var i = this._store, n = i.getProvider();
        this._updateOrdinalMeta();
        var a = this._nameList, o = this._idList, s = n.getSource().sourceFormat, l = s === Re;
        if (l && !n.pure)
          for (var u = [], h = t; h < r; h++) {
            var f = n.getItem(h, u);
            if (!this.hasItemOption && Qw(f) && (this.hasItemOption = !0), f) {
              var v = f.name;
              a[h] == null && v != null && (a[h] = Ae(v, null));
              var c = f.id;
              o[h] == null && c != null && (o[h] = Ae(c, null));
            }
          }
        if (this._shouldMakeIdFromName())
          for (var h = t; h < r; h++)
            zs(this, h);
        xc(this);
      }
    }, e.prototype.getApproximateExtent = function(t) {
      return this._approximateExtent[t] || this._store.getDataExtent(this._getStoreDimIndex(t));
    }, e.prototype.setApproximateExtent = function(t, r) {
      r = this.getDimension(r), this._approximateExtent[r] = t.slice();
    }, e.prototype.getCalculationInfo = function(t) {
      return this._calculationInfo[t];
    }, e.prototype.setCalculationInfo = function(t, r) {
      Qi(t) ? R(this._calculationInfo, t) : this._calculationInfo[t] = r;
    }, e.prototype.getName = function(t) {
      var r = this.getRawIndex(t), i = this._nameList[r];
      return i == null && this._nameDimIdx != null && (i = ji(this, this._nameDimIdx, r)), i == null && (i = ""), i;
    }, e.prototype._getCategory = function(t, r) {
      var i = this._store.get(t, r), n = this._store.getOrdinalMeta(t);
      return n ? n.categories[i] : i;
    }, e.prototype.getId = function(t) {
      return ba(this, this.getRawIndex(t));
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
      return $(t) ? n.getValues(je(t, function(a) {
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
      var i = t && this._invertedIndicesMap[t], n = i && i[r];
      return n == null || isNaN(n) ? Tc : n;
    }, e.prototype.indicesOfNearest = function(t, r, i) {
      return this._store.indicesOfNearest(this._getStoreDimIndex(t), r, i);
    }, e.prototype.each = function(t, r, i) {
      rt(t) && (i = r, r = t, t = []);
      var n = i || this, a = je(Ji(t), this._getStoreDimIndex, this);
      this._store.each(a, n ? st(r, n) : r);
    }, e.prototype.filterSelf = function(t, r, i) {
      rt(t) && (i = r, r = t, t = []);
      var n = i || this, a = je(Ji(t), this._getStoreDimIndex, this);
      return this._store = this._store.filter(a, n ? st(r, n) : r), this;
    }, e.prototype.selectRange = function(t) {
      var r = this, i = {}, n = dt(t);
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
      var a = i || n || this, o = je(Ji(t), this._getStoreDimIndex, this), s = tn(this);
      return s._store = this._store.map(o, a ? st(r, a) : r), s;
    }, e.prototype.modify = function(t, r, i, n) {
      var a = i || n || this, o = je(Ji(t), this._getStoreDimIndex, this);
      this._store.modify(o, a ? st(r, a) : r);
    }, e.prototype.downSample = function(t, r, i, n) {
      var a = tn(this);
      return a._store = this._store.downSample(this._getStoreDimIndex(t), r, i, n), a;
    }, e.prototype.minmaxDownSample = function(t, r) {
      var i = tn(this);
      return i._store = this._store.minmaxDownSample(this._getStoreDimIndex(t), r), i;
    }, e.prototype.lttbDownSample = function(t, r) {
      var i = tn(this);
      return i._store = this._store.lttbDownSample(this._getStoreDimIndex(t), r), i;
    }, e.prototype.getRawDataItem = function(t) {
      return this._store.getRawDataItem(t);
    }, e.prototype.getItemModel = function(t) {
      var r = this.hostModel, i = this.getRawDataItem(t);
      return new vt(i, r, r && r.ecModel);
    }, e.prototype.diff = function(t) {
      var r = this;
      return new ZC(t ? t.getStore().getIndices() : [], this.getStore().getIndices(), function(i) {
        return ba(t, i);
      }, function(i) {
        return ba(r, i);
      });
    }, e.prototype.getVisual = function(t) {
      var r = this._visual;
      return r && r[t];
    }, e.prototype.setVisual = function(t, r) {
      this._visual = this._visual || {}, Qi(t) ? R(this._visual, t) : this._visual[t] = r;
    }, e.prototype.getItemVisual = function(t, r) {
      var i = this._itemVisuals[t], n = i && i[r];
      return n ?? this.getVisual(r);
    }, e.prototype.hasItemVisual = function() {
      return this._itemVisuals.length > 0;
    }, e.prototype.ensureUniqueItemVisual = function(t, r) {
      var i = this._itemVisuals, n = i[t];
      n || (n = i[t] = {});
      var a = n[r];
      return a == null && (a = this.getVisual(r), $(a) ? a = a.slice() : Qi(a) && (a = R({}, a)), n[r] = a), a;
    }, e.prototype.setItemVisual = function(t, r, i) {
      var n = this._itemVisuals[t] || {};
      this._itemVisuals[t] = n, Qi(r) ? R(n, r) : n[r] = i;
    }, e.prototype.clearAllVisual = function() {
      this._visual = {}, this._itemVisuals = [];
    }, e.prototype.setLayout = function(t, r) {
      Qi(t) ? R(this._layout, t) : this._layout[t] = r;
    }, e.prototype.getLayout = function(t) {
      return this._layout[t];
    }, e.prototype.getItemLayout = function(t) {
      return this._itemLayouts[t];
    }, e.prototype.setItemLayout = function(t, r, i) {
      this._itemLayouts[t] = i ? R(this._itemLayouts[t] || {}, r) : r;
    }, e.prototype.clearItemLayouts = function() {
      this._itemLayouts.length = 0;
    }, e.prototype.setItemGraphicEl = function(t, r) {
      var i = this.hostModel && this.hostModel.seriesIndex;
      sS(i, this.dataType, t, r), this._graphicEls[t] = r;
    }, e.prototype.getItemGraphicEl = function(t) {
      return this._graphicEls[t];
    }, e.prototype.eachItemGraphicEl = function(t, r) {
      D(this._graphicEls, function(i, n) {
        i && t && t.call(r, i, n);
      });
    }, e.prototype.cloneShallow = function(t) {
      return t || (t = new e(this._schema ? this._schema : je(this.dimensions, this._getDimInfo, this), this.hostModel)), Fs(t, this), t._store = this._store, t;
    }, e.prototype.wrapMethod = function(t, r) {
      var i = this[t];
      rt(i) && (this.__wrappedMethods = this.__wrappedMethods || [], this.__wrappedMethods.push(t), this[t] = function() {
        var n = i.apply(this, arguments);
        return r.apply(this, [n].concat(Kl(arguments)));
      });
    }, e.internalField = (function() {
      xc = function(t) {
        var r = t._invertedIndicesMap;
        D(r, function(i, n) {
          var a = t._dimInfos[n], o = a.ordinalMeta, s = t._store;
          if (o) {
            i = r[n] = new rD(o.categories.length);
            for (var l = 0; l < i.length; l++)
              i[l] = Tc;
            for (var l = 0; l < s.count(); l++)
              i[s.get(a.storeDimIndex, l)] = l;
          }
        });
      }, ji = function(t, r, i) {
        return Ae(t._getCategory(r, i), null);
      }, ba = function(t, r) {
        var i = t._idList[r];
        return i == null && t._idDimIdx != null && (i = ji(t, t._idDimIdx, r)), i == null && (i = iD + r), i;
      }, Ji = function(t) {
        return $(t) || (t = t != null ? [t] : []), t;
      }, tn = function(t) {
        var r = new e(t._schema ? t._schema : je(t.dimensions, t._getDimInfo, t), t.hostModel);
        return Fs(r, t), r;
      }, Fs = function(t, r) {
        D(nD.concat(r.__wrappedMethods || []), function(i) {
          r.hasOwnProperty(i) && (t[i] = r[i]);
        }), t.__wrappedMethods = r.__wrappedMethods, D(aD, function(i) {
          t[i] = j(r[i]);
        }), t._calculationInfo = R({}, r._calculationInfo);
      }, zs = function(t, r) {
        var i = t._nameList, n = t._idList, a = t._nameDimIdx, o = t._idDimIdx, s = i[r], l = n[r];
        if (s == null && a != null && (i[r] = s = ji(t, a, r)), l == null && o != null && (n[r] = l = ji(t, o, r)), l == null && s != null) {
          var u = t._nameRepeatCount, h = u[s] = (u[s] || 0) + 1;
          l = s, h > 1 && (l += "__ec__" + h), n[r] = l;
        }
      };
    })(), e;
  })()
);
function sD(e, t) {
  Du(e) || (e = Gd(e)), t = t || {};
  var r = t.coordDimensions || [], i = t.dimensionsDefine || e.dimensionsDefine || [], n = tt(), a = [], o = uD(e, r, i, t.dimensionsCount), s = t.canOmitUnusedDimensions && Up(o), l = i === e.dimensionsDefine, u = l ? Vp(e) : Hp(i), h = t.encodeDefine;
  !h && t.encodeDefaulter && (h = t.encodeDefaulter(e, o));
  for (var f = tt(h), v = new jd(o), c = 0; c < v.length; c++)
    v[c] = -1;
  function d(C) {
    var M = v[C];
    if (M < 0) {
      var A = i[C], L = F(A) ? A : {
        name: A
      }, I = new Fa(), P = L.name;
      P != null && u.get(P) != null && (I.name = I.displayName = P), L.type != null && (I.type = L.type), L.displayName != null && (I.displayName = L.displayName);
      var k = a.length;
      return v[C] = k, I.storeDimIndex = C, a.push(I), I;
    }
    return a[M];
  }
  if (!s)
    for (var c = 0; c < o; c++)
      d(c);
  f.each(function(C, M) {
    var A = kt(C).slice();
    if (A.length === 1 && !V(A[0]) && A[0] < 0) {
      f.set(M, !1);
      return;
    }
    var L = f.set(M, []);
    D(A, function(I, P) {
      var k = V(I) ? u.get(I) : I;
      k != null && k < o && (L[P] = k, p(d(k), M, P));
    });
  });
  var _ = 0;
  D(r, function(C) {
    var M, A, L, I;
    if (V(C))
      M = C, I = {};
    else {
      I = C, M = I.name;
      var P = I.ordinalMeta;
      I.ordinalMeta = null, I = R({}, I), I.ordinalMeta = P, A = I.dimsDef, L = I.otherDims, I.name = I.coordDim = I.coordDimIndex = I.dimsDef = I.otherDims = null;
    }
    var k = f.get(M);
    if (k !== !1) {
      if (k = kt(k), !k.length)
        for (var E = 0; E < (A && A.length || 1); E++) {
          for (; _ < o && d(_).coordDim != null; )
            _++;
          _ < o && k.push(_++);
        }
      D(k, function(Y, X) {
        var B = d(Y);
        if (l && I.type != null && (B.type = I.type), p(ut(B, I), M, X), B.name == null && A) {
          var q = A[X];
          !F(q) && (q = {
            name: q
          }), B.name = B.displayName = q.name, B.defaultTooltip = q.defaultTooltip;
        }
        L && ut(B.otherDims, L);
      });
    }
  });
  function p(C, M, A) {
    $d.get(M) != null ? C.otherDims[M] = A : (C.coordDim = M, C.coordDimIndex = A, n.set(M, !0));
  }
  var g = t.generateCoord, m = t.generateCoordCount, y = m != null;
  m = g ? m || 1 : 0;
  var w = g || "value";
  function b(C) {
    C.name == null && (C.name = C.coordDim);
  }
  if (s)
    D(a, function(C) {
      b(C);
    }), a.sort(function(C, M) {
      return C.storeDimIndex - M.storeDimIndex;
    });
  else
    for (var S = 0; S < o; S++) {
      var T = d(S), x = T.coordDim;
      x == null && (T.coordDim = hD(w, n, y), T.coordDimIndex = 0, (!g || m <= 0) && (T.isExtraCoord = !0), m--), b(T), T.type == null && (Nd(e, S) === xt.Must || T.isExtraCoord && (T.otherDims.itemName != null || T.otherDims.seriesName != null)) && (T.type = "ordinal");
    }
  return lD(a), new zp({
    source: e,
    dimensions: a,
    fullDimensionCount: o,
    dimensionOmitted: s
  });
}
function lD(e) {
  for (var t = tt(), r = 0; r < e.length; r++) {
    var i = e[r], n = i.name, a = t.get(n) || 0;
    a > 0 && (i.name = n + (a - 1)), a++, t.set(n, a);
  }
}
function uD(e, t, r, i) {
  var n = Math.max(e.dimensionsDetectedCount || 1, t.length, r.length, i || 0);
  return D(t, function(a) {
    var o;
    F(a) && (o = a.dimsDef) && (n = Math.max(n, o.length));
  }), n;
}
function hD(e, t, r) {
  if (r || t.hasKey(e)) {
    for (var i = 0; t.hasKey(e + i); )
      i++;
    e += i;
  }
  return t.set(e, !0), e;
}
function Gp(e, t) {
  return e.type === "category" ? e.scale.getLabel(t) : t.value;
}
function fD(e) {
  var t = e.get("interval");
  return t ?? "auto";
}
function cD(e) {
  return e.type === "category" && fD(e.getLabelModel()) === 0;
}
var Cc = [], vD = {
  registerPreprocessor: Bp,
  registerProcessor: Np,
  registerPostInit: UC,
  registerPostUpdate: GC,
  registerUpdateLifecycle: Ru,
  registerAction: ki,
  registerCoordinateSystem: WC,
  registerLayout: YC,
  registerVisual: qr,
  registerTransform: qC,
  registerLoading: Fp,
  registerMap: XC,
  registerImpl: TC,
  PRIORITY: OC,
  ComponentModel: nt,
  ComponentView: fr,
  SeriesModel: hr,
  ChartView: lr,
  // TODO Use ComponentModel and SeriesModel instead of Constructor
  registerComponentModel: function(e) {
    nt.registerClass(e);
  },
  registerComponentView: function(e) {
    fr.registerClass(e);
  },
  registerSeriesModel: function(e) {
    hr.registerClass(e);
  },
  registerChartView: function(e) {
    lr.registerClass(e);
  },
  registerSubTypeDefaulter: function(e, t) {
    nt.registerSubTypeDefaulter(e, t);
  },
  registerPainter: function(e, t) {
    Hw(e, t);
  }
};
function Eu(e) {
  if ($(e)) {
    D(e, function(t) {
      Eu(t);
    });
    return;
  }
  ot(Cc, e) >= 0 || (Cc.push(e), rt(e) && (e = {
    install: e
  }), e.install(vD));
}
function Wp(e, t, r, i, n, a, o, s) {
  var l = n - e, u = a - t, h = r - e, f = i - t, v = Math.sqrt(h * h + f * f);
  h /= v, f /= v;
  var c = l * h + u * f, d = c / v;
  d *= v;
  var _ = o[0] = e + d * h, p = o[1] = t + d * f;
  return Math.sqrt((_ - n) * (_ - n) + (p - a) * (p - a));
}
var ir = new U(), lt = new U(), Ct = new U(), nr = new U(), xe = new U(), vo = [], It = new U();
function dD(e, t) {
  if (t <= 180 && t > 0) {
    t = t / 180 * Math.PI, ir.fromArray(e[0]), lt.fromArray(e[1]), Ct.fromArray(e[2]), U.sub(nr, ir, lt), U.sub(xe, Ct, lt);
    var r = nr.len(), i = xe.len();
    if (!(r < 1e-3 || i < 1e-3)) {
      nr.scale(1 / r), xe.scale(1 / i);
      var n = nr.dot(xe), a = Math.cos(t);
      if (a < n) {
        var o = Wp(lt.x, lt.y, Ct.x, Ct.y, ir.x, ir.y, vo);
        It.fromArray(vo), It.scaleAndAdd(xe, o / Math.tan(Math.PI - t));
        var s = Ct.x !== lt.x ? (It.x - lt.x) / (Ct.x - lt.x) : (It.y - lt.y) / (Ct.y - lt.y);
        if (isNaN(s))
          return;
        s < 0 ? U.copy(It, lt) : s > 1 && U.copy(It, Ct), It.toArray(e[1]);
      }
    }
  }
}
function pD(e, t, r) {
  if (r <= 180 && r > 0) {
    r = r / 180 * Math.PI, ir.fromArray(e[0]), lt.fromArray(e[1]), Ct.fromArray(e[2]), U.sub(nr, lt, ir), U.sub(xe, Ct, lt);
    var i = nr.len(), n = xe.len();
    if (!(i < 1e-3 || n < 1e-3)) {
      nr.scale(1 / i), xe.scale(1 / n);
      var a = nr.dot(t), o = Math.cos(r);
      if (a < o) {
        var s = Wp(lt.x, lt.y, Ct.x, Ct.y, ir.x, ir.y, vo);
        It.fromArray(vo);
        var l = Math.PI / 2, u = Math.acos(xe.dot(t)), h = l + u - r;
        if (h >= l)
          U.copy(It, Ct);
        else {
          It.scaleAndAdd(xe, s / Math.tan(Math.PI / 2 - h));
          var f = Ct.x !== lt.x ? (It.x - lt.x) / (Ct.x - lt.x) : (It.y - lt.y) / (Ct.y - lt.y);
          if (isNaN(f))
            return;
          f < 0 ? U.copy(It, lt) : f > 1 && U.copy(It, Ct);
        }
        It.toArray(e[1]);
      }
    }
  }
}
function Hs(e, t, r, i) {
  var n = r === "normal", a = n ? e : e.ensureState(r);
  a.ignore = t;
  var o = i.get("smooth");
  o && o === !0 && (o = 0.3), a.shape = a.shape || {}, o > 0 && (a.shape.smooth = o);
  var s = i.getModel("lineStyle").getLineStyle();
  n ? e.useStyle(s) : a.style = s;
}
function gD(e, t) {
  var r = t.smooth, i = t.points;
  if (i)
    if (e.moveTo(i[0][0], i[0][1]), r > 0 && i.length >= 3) {
      var n = Qs(i[0], i[1]), a = Qs(i[1], i[2]);
      if (!n || !a) {
        e.lineTo(i[1][0], i[1][1]), e.lineTo(i[2][0], i[2][1]);
        return;
      }
      var o = Math.min(n, a) * r, s = Bo([], i[1], i[0], o / n), l = Bo([], i[1], i[2], o / a), u = Bo([], s, l, 0.5);
      e.bezierCurveTo(s[0], s[1], s[0], s[1], u[0], u[1]), e.bezierCurveTo(l[0], l[1], l[0], l[1], i[2][0], i[2][1]);
    } else
      for (var h = 1; h < i.length; h++)
        e.lineTo(i[h][0], i[h][1]);
}
function _D(e, t, r) {
  var i = e.getTextGuideLine(), n = e.getTextContent();
  if (!n) {
    i && e.removeTextGuideLine();
    return;
  }
  for (var a = t.normal, o = a.get("show"), s = n.ignore, l = 0; l < Ja.length; l++) {
    var u = Ja[l], h = t[u], f = u === "normal";
    if (h) {
      var v = h.get("show"), c = f ? s : K(n.states[u] && n.states[u].ignore, s);
      if (c || !K(v, o)) {
        var d = f ? i : i && i.states[u];
        d && (d.ignore = !0), i && Hs(i, !0, u, h);
        continue;
      }
      i || (i = new Xn(), e.setTextGuideLine(i), !f && (s || !o) && Hs(i, !0, "normal", t.normal), e.stateProxy && (i.stateProxy = e.stateProxy)), Hs(i, !1, u, h);
    }
  }
  if (i) {
    ut(i.style, r), i.style.fill = null;
    var _ = a.get("showAbove"), p = e.textGuideLineConfig = e.textGuideLineConfig || {};
    p.showAbove = _ || !1, i.buildPath = gD;
  }
}
function mD(e, t) {
  t = t || "labelLine";
  for (var r = {
    normal: e.getModel(t)
  }, i = 0; i < Pe.length; i++) {
    var n = Pe[i];
    r[n] = e.getModel([n, t]);
  }
  return r;
}
function yD(e) {
  for (var t = [], r = 0; r < e.length; r++) {
    var i = e[r];
    if (!i.defaultAttr.ignore) {
      var n = i.label, a = n.getComputedTransform(), o = n.getBoundingRect(), s = !a || a[1] < 1e-5 && a[2] < 1e-5, l = n.style.margin || 0, u = o.clone();
      u.applyTransform(a), u.x -= l / 2, u.y -= l / 2, u.width += l, u.height += l;
      var h = s ? new to(o, a) : null;
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
function wD(e, t, r, i, n, a) {
  var o = e.length;
  if (o < 2)
    return;
  e.sort(function(S, T) {
    return S.rect[t] - T.rect[t];
  });
  for (var s = 0, l, u = !1, h = 0; h < o; h++) {
    var f = e[h], v = f.rect;
    l = v[t] - s, l < 0 && (v[t] -= l, f.label[t] -= l, u = !0), s = v[t] + v[r];
  }
  var c = e[0], d = e[o - 1], _, p;
  g(), _ < 0 && w(-_, 0.8), p < 0 && w(p, 0.8), g(), m(_, p, 1), m(p, _, -1), g(), _ < 0 && b(-_), p < 0 && b(p);
  function g() {
    _ = c.rect[t] - i, p = n - d.rect[t] - d.rect[r];
  }
  function m(S, T, x) {
    if (S < 0) {
      var C = Math.min(T, -S);
      if (C > 0) {
        y(C * x, 0, o);
        var M = C + S;
        M < 0 && w(-M * x, 1);
      } else
        w(-S * x, 1);
    }
  }
  function y(S, T, x) {
    S !== 0 && (u = !0);
    for (var C = T; C < x; C++) {
      var M = e[C], A = M.rect;
      A[t] += S, M.label[t] += S;
    }
  }
  function w(S, T) {
    for (var x = [], C = 0, M = 1; M < o; M++) {
      var A = e[M - 1].rect, L = Math.max(e[M].rect[t] - A[t] - A[r], 0);
      x.push(L), C += L;
    }
    if (C) {
      var I = Math.min(Math.abs(S) / C, T);
      if (S > 0)
        for (var M = 0; M < o - 1; M++) {
          var P = x[M] * I;
          y(P, 0, M + 1);
        }
      else
        for (var M = o - 1; M > 0; M--) {
          var P = x[M - 1] * I;
          y(-P, M, o);
        }
    }
  }
  function b(S) {
    var T = S < 0 ? -1 : 1;
    S = Math.abs(S);
    for (var x = Math.ceil(S / (o - 1)), C = 0; C < o - 1; C++)
      if (T > 0 ? y(x, 0, C + 1) : y(-x, o - C - 1, o), S -= x, S <= 0)
        return;
  }
  return u;
}
function SD(e, t, r, i) {
  return wD(e, "y", "height", t, r);
}
function bD(e) {
  var t = [];
  e.sort(function(_, p) {
    return p.priority - _.priority;
  });
  var r = new it(0, 0, 0, 0);
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
    for (var f = a.obb, v = !1, c = 0; c < t.length; c++) {
      var d = t[c];
      if (r.intersect(d.rect)) {
        if (o && d.axisAligned) {
          v = !0;
          break;
        }
        if (d.obb || (d.obb = new to(d.localRect, d.transform)), f || (f = new to(s, l)), f.intersect(d.obb)) {
          v = !0;
          break;
        }
      }
    }
    v ? (i(u), h && i(h)) : (u.attr("ignore", a.defaultAttr.ignore), h && h.attr("ignore", a.defaultAttr.labelGuideIgnore), t.push(a));
  }
}
function Ta(e, t, r) {
  var i = e.get("borderRadius");
  if (i == null)
    return r ? {
      cornerRadius: 0
    } : null;
  $(i) || (i = [i, i, i, i]);
  var n = Math.abs(t.r || 0 - t.r0 || 0);
  return {
    cornerRadius: J(i, function(a) {
      return Di(a, n);
    })
  };
}
var Dc = Math.PI * 2, xa = Math.PI / 180;
function Yp(e, t) {
  return Rd(e.getBoxLayoutParams(), {
    width: t.getWidth(),
    height: t.getHeight()
  });
}
function Xp(e, t) {
  var r = Yp(e, t), i = e.get("center"), n = e.get("radius");
  $(n) || (n = [0, n]);
  var a = yt(r.width, t.getWidth()), o = yt(r.height, t.getHeight()), s = Math.min(a, o), l = yt(n[0], s / 2), u = yt(n[1], s / 2), h, f, v = e.coordinateSystem;
  if (v) {
    var c = v.dataToPoint(i);
    h = c[0] || 0, f = c[1] || 0;
  } else
    $(i) || (i = [i, i]), h = yt(i[0], a) + r.x, f = yt(i[1], o) + r.y;
  return {
    cx: h,
    cy: f,
    r0: l,
    r: u
  };
}
function TD(e, t, r) {
  t.eachSeriesByType(e, function(i) {
    var n = i.getData(), a = n.mapDimension("value"), o = Yp(i, r), s = Xp(i, r), l = s.cx, u = s.cy, h = s.r, f = s.r0, v = -i.get("startAngle") * xa, c = i.get("endAngle"), d = i.get("padAngle") * xa;
    c = c === "auto" ? v - Dc : -c * xa;
    var _ = i.get("minAngle") * xa, p = _ + d, g = 0;
    n.each(a, function(Y) {
      !isNaN(Y) && g++;
    });
    var m = n.getSum(a), y = Math.PI / (m || g) * 2, w = i.get("clockwise"), b = i.get("roseType"), S = i.get("stillShowZeroSum"), T = n.getDataExtent(a);
    T[0] = 0;
    var x = w ? 1 : -1, C = [v, c], M = x * d / 2;
    qv(C, !w), v = C[0], c = C[1];
    var A = qp(i);
    A.startAngle = v, A.endAngle = c, A.clockwise = w;
    var L = Math.abs(c - v), I = L, P = 0, k = v;
    if (n.setLayout({
      viewRect: o,
      r: h
    }), n.each(a, function(Y, X) {
      var B;
      if (isNaN(Y)) {
        n.setItemLayout(X, {
          angle: NaN,
          startAngle: NaN,
          endAngle: NaN,
          clockwise: w,
          cx: l,
          cy: u,
          r0: f,
          r: b ? NaN : h
        });
        return;
      }
      b !== "area" ? B = m === 0 && S ? y : Y * y : B = L / g, B < p ? (B = p, I -= p) : P += Y;
      var q = k + x * B, Q = 0, W = 0;
      d > B ? (Q = k + x * B / 2, W = Q) : (Q = k + M, W = q - M), n.setItemLayout(X, {
        angle: B,
        startAngle: Q,
        endAngle: W,
        clockwise: w,
        cx: l,
        cy: u,
        r0: f,
        r: b ? Uw(Y, T, [f, h]) : h
      }), k = q;
    }), I < Dc && g)
      if (I <= 1e-3) {
        var E = L / g;
        n.each(a, function(Y, X) {
          if (!isNaN(Y)) {
            var B = n.getItemLayout(X);
            B.angle = E;
            var q = 0, Q = 0;
            E < d ? (q = v + x * (X + 1 / 2) * E, Q = q) : (q = v + x * X * E + M, Q = v + x * (X + 1) * E - M), B.startAngle = q, B.endAngle = Q;
          }
        });
      } else
        y = I / P, k = v, n.each(a, function(Y, X) {
          if (!isNaN(Y)) {
            var B = n.getItemLayout(X), q = B.angle === p ? p : Y * y, Q = 0, W = 0;
            q < d ? (Q = k + x * q / 2, W = Q) : (Q = k + M, W = k + x * q - M), B.startAngle = Q, B.endAngle = W, k += x * q;
          }
        });
  });
}
var qp = wt();
function xD(e) {
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
var CD = Math.PI / 180;
function Mc(e, t, r, i, n, a, o, s, l, u) {
  if (e.length < 2)
    return;
  function h(_) {
    for (var p = _.rB, g = p * p, m = 0; m < _.list.length; m++) {
      var y = _.list[m], w = Math.abs(y.label.y - r), b = i + y.len, S = b * b, T = Math.sqrt(Math.abs((1 - w * w / g) * S)), x = t + (T + y.len2) * n, C = x - y.label.x, M = y.targetTextWidth - C * n;
      Zp(y, M, !0), y.label.x = x;
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
        var y = _[m], w = y.label.y > r ? g : p, b = Math.abs(y.label.y - r);
        if (b >= w.maxY) {
          var S = y.label.x - t - y.len2 * n, T = i + y.len, x = Math.abs(S) < T ? Math.sqrt(b * b / (1 - S * S / T / T)) : T;
          w.rB = x, w.maxY = b;
        }
        w.list.push(y);
      }
    h(p), h(g);
  }
  for (var v = e.length, c = 0; c < v; c++)
    if (e[c].position === "outer" && e[c].labelAlignTo === "labelLine") {
      var d = e[c].label.x - u;
      e[c].linePoints[1][0] += d, e[c].label.x = u;
    }
  SD(e, l, l + o) && f(e);
}
function DD(e, t, r, i, n, a, o, s) {
  for (var l = [], u = [], h = Number.MAX_VALUE, f = -Number.MAX_VALUE, v = 0; v < e.length; v++) {
    var c = e[v].label;
    Vs(e[v]) || (c.x < t ? (h = Math.min(h, c.x), l.push(e[v])) : (f = Math.max(f, c.x), u.push(e[v])));
  }
  for (var v = 0; v < e.length; v++) {
    var d = e[v];
    if (!Vs(d) && d.linePoints) {
      if (d.labelStyleWidth != null)
        continue;
      var c = d.label, _ = d.linePoints, p = void 0;
      d.labelAlignTo === "edge" ? c.x < t ? p = _[2][0] - d.labelDistance - o - d.edgeDistance : p = o + n - d.edgeDistance - _[2][0] - d.labelDistance : d.labelAlignTo === "labelLine" ? c.x < t ? p = h - o - d.bleedMargin : p = o + n - f - d.bleedMargin : c.x < t ? p = c.x - o - d.bleedMargin : p = o + n - c.x - d.bleedMargin, d.targetTextWidth = p, Zp(d, p);
    }
  }
  Mc(u, t, r, i, 1, n, a, o, s, f), Mc(l, t, r, i, -1, n, a, o, s, h);
  for (var v = 0; v < e.length; v++) {
    var d = e[v];
    if (!Vs(d) && d.linePoints) {
      var c = d.label, _ = d.linePoints, g = d.labelAlignTo === "edge", m = c.style.padding, y = m ? m[1] + m[3] : 0, w = c.style.backgroundColor ? 0 : y, b = d.rect.width + w, S = _[1][0] - _[2][0];
      g ? c.x < t ? _[2][0] = o + d.edgeDistance + b + d.labelDistance : _[2][0] = o + n - d.edgeDistance - b - d.labelDistance : (c.x < t ? _[2][0] = c.x + d.labelDistance : _[2][0] = c.x - d.labelDistance, _[1][0] = _[2][0] + S), _[1][1] = _[2][1] = c.y;
    }
  }
}
function Zp(e, t, r) {
  if (r === void 0 && (r = !1), e.labelStyleWidth == null) {
    var i = e.label, n = i.style, a = e.rect, o = n.backgroundColor, s = n.padding, l = s ? s[1] + s[3] : 0, u = n.overflow, h = a.width + (o ? 0 : l);
    if (t < h || r) {
      var f = a.height;
      if (u && u.match("break")) {
        i.setStyle("backgroundColor", null), i.setStyle("width", t - l);
        var v = i.getBoundingRect();
        i.setStyle("width", Math.ceil(v.width)), i.setStyle("backgroundColor", o);
      } else {
        var c = t - l, d = t < h ? c : (
          // Current available width is enough, but the text may have
          // already been wrapped with a smaller available width.
          r ? c > e.unconstrainedWidth ? null : c : null
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
function Vs(e) {
  return e.position === "center";
}
function MD(e) {
  var t = e.getData(), r = [], i, n, a = !1, o = (e.get("minShowLabelAngle") || 0) * CD, s = t.getLayout("viewRect"), l = t.getLayout("r"), u = s.width, h = s.x, f = s.y, v = s.height;
  function c(S) {
    S.ignore = !0;
  }
  function d(S) {
    if (!S.ignore)
      return !0;
    for (var T in S.states)
      if (S.states[T].ignore === !1)
        return !0;
    return !1;
  }
  t.each(function(S) {
    var T = t.getItemGraphicEl(S), x = T.shape, C = T.getTextContent(), M = T.getTextGuideLine(), A = t.getItemModel(S), L = A.getModel("label"), I = L.get("position") || A.get(["emphasis", "label", "position"]), P = L.get("distanceToLabelLine"), k = L.get("alignTo"), E = yt(L.get("edgeDistance"), u), Y = L.get("bleedMargin"), X = A.getModel("labelLine"), B = X.get("length");
    B = yt(B, u);
    var q = X.get("length2");
    if (q = yt(q, u), Math.abs(x.endAngle - x.startAngle) < o) {
      D(C.states, c), C.ignore = !0, M && (D(M.states, c), M.ignore = !0);
      return;
    }
    if (d(C)) {
      var Q = (x.startAngle + x.endAngle) / 2, W = Math.cos(Q), gt = Math.sin(Q), St, Wt, _e, Qt;
      i = x.cx, n = x.cy;
      var Yt = I === "inside" || I === "inner";
      if (I === "center")
        St = x.cx, Wt = x.cy, Qt = "center";
      else {
        var Tt = (Yt ? (x.r + x.r0) / 2 * W : x.r * W) + i, ht = (Yt ? (x.r + x.r0) / 2 * gt : x.r * gt) + n;
        if (St = Tt + W * 3, Wt = ht + gt * 3, !Yt) {
          var z = Tt + W * (B + l - x.r), Z = ht + gt * (B + l - x.r), me = z + (W < 0 ? -1 : 1) * q, bt = Z;
          k === "edge" ? St = W < 0 ? h + E : h + u - E : St = me + (W < 0 ? -P : P), Wt = bt, _e = [[Tt, ht], [z, Z], [me, bt]];
        }
        Qt = Yt ? "center" : k === "edge" ? W > 0 ? "right" : "left" : W > 0 ? "left" : "right";
      }
      var Ye = Math.PI, Ee = 0, Ei = L.get("rotate");
      if (mt(Ei))
        Ee = Ei * (Ye / 180);
      else if (I === "center")
        Ee = 0;
      else if (Ei === "radial" || Ei === !0) {
        var og = W < 0 ? -Q + Ye : -Q;
        Ee = og;
      } else if (Ei === "tangential" && I !== "outside" && I !== "outer") {
        var Zr = Math.atan2(W, gt);
        Zr < 0 && (Zr = Ye * 2 + Zr);
        var sg = gt > 0;
        sg && (Zr = Ye + Zr), Ee = Zr - Ye;
      }
      if (a = !!Ee, C.x = St, C.y = Wt, C.rotation = Ee, C.setStyle({
        verticalAlign: "middle"
      }), Yt) {
        C.setStyle({
          align: Qt
        });
        var Eo = C.states.select;
        Eo && (Eo.x += C.x, Eo.y += C.y);
      } else {
        var $i = C.getBoundingRect().clone();
        $i.applyTransform(C.getComputedTransform());
        var Nu = (C.style.margin || 0) + 2.1;
        $i.y -= Nu / 2, $i.height += Nu, r.push({
          label: C,
          labelLine: M,
          position: I,
          len: B,
          len2: q,
          minTurnAngle: X.get("minTurnAngle"),
          maxSurfaceAngle: X.get("maxSurfaceAngle"),
          surfaceNormal: new U(W, gt),
          linePoints: _e,
          textAlign: Qt,
          labelDistance: P,
          labelAlignTo: k,
          edgeDistance: E,
          bleedMargin: Y,
          rect: $i,
          unconstrainedWidth: $i.width,
          labelStyleWidth: C.style.width
        });
      }
      T.setTextConfig({
        inside: Yt
      });
    }
  }), !a && e.get("avoidLabelOverlap") && DD(r, i, n, l, u, v, h, f);
  for (var _ = 0; _ < r.length; _++) {
    var p = r[_], g = p.label, m = p.labelLine, y = isNaN(g.x) || isNaN(g.y);
    if (g) {
      g.setStyle({
        align: p.textAlign
      }), y && (D(g.states, c), g.ignore = !0);
      var w = g.states.select;
      w && (w.x += g.x, w.y += g.y);
    }
    if (m) {
      var b = p.linePoints;
      y || !b ? (D(m.states, c), m.ignore = !0) : (dD(b, p.minTurnAngle), pD(b, p.surfaceNormal, p.maxSurfaceAngle), m.setShape({
        points: b
      }), g.__hostTarget.textGuideLineConfig = {
        anchor: new U(b[0][0], b[0][1])
      });
    }
  }
}
var AD = (
  /** @class */
  (function(e) {
    G(t, e);
    function t(r, i, n) {
      var a = e.call(this) || this;
      a.z2 = 2;
      var o = new de();
      return a.setTextContent(o), a.updateData(r, i, n, !0), a;
    }
    return t.prototype.updateData = function(r, i, n, a) {
      var o = this, s = r.hostModel, l = r.getItemModel(i), u = l.getModel("emphasis"), h = r.getItemLayout(i), f = R(Ta(l.getModel("itemStyle"), h, !0), h);
      if (isNaN(f.startAngle)) {
        o.setShape(f);
        return;
      }
      if (a) {
        o.setShape(f);
        var v = s.getShallow("animationType");
        s.ecModel.ssr ? ($a(o, {
          scaleX: 0,
          scaleY: 0
        }, s, {
          dataIndex: i,
          isFrom: !0
        }), o.originX = f.cx, o.originY = f.cy) : v === "scale" ? (o.shape.r = h.r0, $a(o, {
          shape: {
            r: h.r
          }
        }, s, i)) : n != null ? (o.setShape({
          startAngle: n,
          endAngle: n
        }), $a(o, {
          shape: {
            startAngle: h.startAngle,
            endAngle: h.endAngle
          }
        }, s, i)) : (o.shape.endAngle = h.startAngle, In(o, {
          shape: {
            endAngle: h.endAngle
          }
        }, s, i));
      } else
        lb(o), In(o, {
          shape: f
        }, s, i);
      o.useStyle(r.getItemVisual(i, "style")), AS(o, l);
      var c = (h.startAngle + h.endAngle) / 2, d = s.get("selectedOffset"), _ = Math.cos(c) * d, p = Math.sin(c) * d, g = l.getShallow("cursor");
      g && o.attr("cursor", g), this._updateLabel(s, r, i), o.ensureState("emphasis").shape = R({
        r: h.r + (u.get("scale") && u.get("scaleSize") || 0)
      }, Ta(u.getModel("itemStyle"), h)), R(o.ensureState("select"), {
        x: _,
        y: p,
        shape: Ta(l.getModel(["select", "itemStyle"]), h)
      }), R(o.ensureState("blur"), {
        shape: Ta(l.getModel(["blur", "itemStyle"]), h)
      });
      var m = o.getTextGuideLine(), y = o.getTextContent();
      m && R(m.ensureState("select"), {
        x: _,
        y: p
      }), R(y.ensureState("select"), {
        x: _,
        y: p
      }), CS(this, u.get("focus"), u.get("blurScope"), u.get("disabled"));
    }, t.prototype._updateLabel = function(r, i, n) {
      var a = this, o = i.getItemModel(n), s = o.getModel("labelLine"), l = i.getItemVisual(n, "style"), u = l && l.fill, h = l && l.opacity;
      Db(a, Mb(o), {
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
      var v = r.get(["label", "position"]);
      if (v !== "outside" && v !== "outer")
        a.removeTextGuideLine();
      else {
        var c = this.getTextGuideLine();
        c || (c = new Xn(), this.setTextGuideLine(c)), _D(this, mD(o), {
          stroke: u,
          opacity: hn(s.get(["lineStyle", "opacity"]), h, 1)
        });
      }
    }, t;
  })(Yn)
), PD = (
  /** @class */
  (function(e) {
    G(t, e);
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
        var v = qp(r), c = new Yn({
          shape: R(Xp(r, n), v)
        });
        c.useStyle(r.getModel("emptyCircleStyle").getItemStyle()), this._emptyCircleSector = c, l.add(c);
      }
      o.diff(s).add(function(d) {
        var _ = new AD(o, d, u);
        o.setItemGraphicEl(d, _), l.add(_);
      }).update(function(d, _) {
        var p = s.getItemGraphicEl(_);
        p.updateData(o, d, u), p.off("click"), l.add(p), o.setItemGraphicEl(d, p);
      }).remove(function(d) {
        var _ = s.getItemGraphicEl(d);
        _d(_, r, d);
      }).execute(), MD(r), r.get("animationTypeUpdate") !== "expansion" && (this._data = o);
    }, t.prototype.dispose = function() {
    }, t.prototype.containPoint = function(r, i) {
      var n = i.getData(), a = n.getItemLayout(0);
      if (a) {
        var o = r[0] - a.cx, s = r[1] - a.cy, l = Math.sqrt(o * o + s * s);
        return l <= a.r && l >= a.r0;
      }
    }, t.type = "pie", t;
  })(lr)
);
function LD(e, t, r) {
  t = $(t) && {
    coordDimensions: t
  } || R({
    encodeDefine: e.getEncode()
  }, t);
  var i = e.getSource(), n = sD(i, t).dimensions, a = new oD(n, e);
  return a.initData(i, r), a;
}
var ID = (
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
), RD = wt(), kD = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.init = function(r) {
      e.prototype.init.apply(this, arguments), this.legendVisualProvider = new ID(st(this.getData, this), st(this.getRawData, this)), this._defaultLabelLine(r);
    }, t.prototype.mergeOption = function() {
      e.prototype.mergeOption.apply(this, arguments);
    }, t.prototype.getInitialData = function() {
      return LD(this, {
        coordDimensions: ["value"],
        encodeDefaulter: Zt(lT, this)
      });
    }, t.prototype.getDataParams = function(r) {
      var i = this.getData(), n = RD(i), a = n.seats;
      if (!a) {
        var o = [];
        i.each(i.mapDimension("value"), function(l) {
          o.push(l);
        }), a = n.seats = Yw(o, i.hostModel.get("percentPrecision"));
      }
      var s = e.prototype.getDataParams.call(this, r);
      return s.percent = a[r] || 0, s.$vars.push("percent"), s;
    }, t.prototype._defaultLabelLine = function(r) {
      fl(r, "labelLine", ["show"]);
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
  })(hr)
);
function ED(e) {
  return {
    seriesType: e,
    reset: function(t, r) {
      var i = t.getData();
      i.filterSelf(function(n) {
        var a = i.mapDimension("value"), o = i.get(a, n);
        return !(mt(o) && !isNaN(o) && o < 0);
      });
    }
  };
}
function $D(e) {
  e.registerChartView(PD), e.registerSeriesModel(kD), Xx("pie", e.registerAction), e.registerLayout(Zt(TD, "pie")), e.registerProcessor(xD("pie")), e.registerProcessor(ED("pie"));
}
function Ac(e, t, r) {
  r = r || {};
  var i = e.coordinateSystem, n = t.axis, a = {}, o = n.getAxesOnZeroOf()[0], s = n.position, l = o ? "onZero" : s, u = n.dim, h = i.getRect(), f = [h.x, h.x + h.width, h.y, h.y + h.height], v = {
    left: 0,
    right: 1,
    top: 0,
    bottom: 1,
    onZero: 2
  }, c = t.get("offset") || 0, d = u === "x" ? [f[2] - c, f[3] + c] : [f[0] - c, f[1] + c];
  if (o) {
    var _ = o.toGlobalCoord(o.dataToCoord(0));
    d[v.onZero] = Math.max(Math.min(_, d[1]), d[0]);
  }
  a.position = [u === "y" ? d[v[l]] : f[0], u === "x" ? d[v[l]] : f[3]], a.rotation = Math.PI / 2 * (u === "x" ? 0 : 1);
  var p = {
    top: -1,
    bottom: 1,
    left: -1,
    right: 1
  };
  a.labelDirection = a.tickDirection = a.nameDirection = p[s], a.labelOffset = o ? d[v[s]] - d[v.onZero] : 0, t.get(["axisTick", "inside"]) && (a.tickDirection = -a.tickDirection), Mn(r.labelInside, t.get(["axisLabel", "inside"])) && (a.labelDirection = -a.labelDirection);
  var g = t.get(["axisLabel", "rotate"]);
  return a.labelRotate = l === "top" ? -g : g, a.z2 = 1, a;
}
var ar = Math.PI, Vr = (
  /** @class */
  (function() {
    function e(t, r) {
      this.group = new Ue(), this.opt = r, this.axisModel = t, ut(r, {
        labelOffset: 0,
        nameDirection: 1,
        tickDirection: 1,
        labelDirection: 1,
        silent: !0,
        handleAutoShown: function() {
          return !0;
        }
      });
      var i = new Ue({
        x: r.position[0],
        y: r.position[1],
        rotation: r.rotation
      });
      i.updateTransform(), this._transformGroup = i;
    }
    return e.prototype.hasBuilder = function(t) {
      return !!Pc[t];
    }, e.prototype.add = function(t) {
      Pc[t](this.opt, this.axisModel, this.group, this._transformGroup);
    }, e.prototype.getGroup = function() {
      return this.group;
    }, e.innerTextLayout = function(t, r, i) {
      var n = $v(r - t), a, o;
      return Ka(n) ? (o = i > 0 ? "top" : "bottom", a = "center") : Ka(n - ar) ? (o = i > 0 ? "bottom" : "top", a = "center") : (o = "middle", n > 0 && n < ar ? a = i > 0 ? "right" : "left" : a = i > 0 ? "left" : "right"), {
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
), Pc = {
  axisLine: function(e, t, r, i) {
    var n = t.get(["axisLine", "show"]);
    if (n === "auto" && e.handleAutoShown && (n = e.handleAutoShown("axisLine")), !!n) {
      var a = t.axis.getExtent(), o = i.transform, s = [a[0], 0], l = [a[1], 0], u = s[0] > l[0];
      o && (Me(s, s, o), Me(l, l, o));
      var h = R({
        lineCap: "round"
      }, t.getModel(["axisLine", "lineStyle"]).getLineStyle()), f = new Ii({
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
      mu(f.shape, f.style.lineWidth), f.anid = "line", r.add(f);
      var v = t.get(["axisLine", "symbol"]);
      if (v != null) {
        var c = t.get(["axisLine", "symbolSize"]);
        V(v) && (v = [v, v]), (V(c) || mt(c)) && (c = [c, c]);
        var d = oC(t.get(["axisLine", "symbolOffset"]) || 0, c), _ = c[0], p = c[1];
        D([{
          rotate: e.rotation + Math.PI / 2,
          offset: d[0],
          r: 0
        }, {
          rotate: e.rotation - Math.PI / 2,
          offset: d[1],
          r: Math.sqrt((s[0] - l[0]) * (s[0] - l[0]) + (s[1] - l[1]) * (s[1] - l[1]))
        }], function(g, m) {
          if (v[m] !== "none" && v[m] != null) {
            var y = gp(v[m], -_ / 2, -p / 2, _, p, h.stroke, !0), w = g.r + g.offset, b = u ? l : s;
            y.attr({
              rotation: g.rotate,
              x: b[0] + w * Math.cos(e.rotation),
              y: b[1] - w * Math.sin(e.rotation),
              silent: !0,
              z2: 11
            }), r.add(y);
          }
        });
      }
    }
  },
  axisTickLabel: function(e, t, r, i) {
    var n = ND(r, i, t, e), a = zD(r, i, t, e);
    if (BD(t, a, n), FD(r, i, t, e.tickDirection), t.get(["axisLabel", "hideOverlap"])) {
      var o = yD(J(a, function(s) {
        return {
          label: s,
          priority: s.z2,
          defaultAttr: {
            ignore: s.ignore
          }
        };
      }));
      bD(o);
    }
  },
  axisName: function(e, t, r, i) {
    var n = Mn(e.axisName, t.get("name"));
    if (n) {
      var a = t.get("nameLocation"), o = e.nameDirection, s = t.getModel("nameTextStyle"), l = t.get("nameGap") || 0, u = t.axis.getExtent(), h = u[0] > u[1] ? -1 : 1, f = [
        a === "start" ? u[0] - h * l : a === "end" ? u[1] + h * l : (u[0] + u[1]) / 2,
        // Reuse labelOffset.
        Ic(a) ? e.labelOffset + o * l : 0
      ], v, c = t.get("nameRotate");
      c != null && (c = c * ar / 180);
      var d;
      Ic(a) ? v = Vr.innerTextLayout(
        e.rotation,
        c ?? e.rotation,
        // Adapt to axis.
        o
      ) : (v = OD(e.rotation, a, c || 0, u), d = e.axisNameAvailableWidth, d != null && (d = Math.abs(d / Math.sin(v.rotation)), !isFinite(d) && (d = null)));
      var _ = s.getFont(), p = t.get("nameTruncate", !0) || {}, g = p.ellipsis, m = Mn(e.nameTruncateMaxWidth, p.maxWidth, d), y = new de({
        x: f[0],
        y: f[1],
        rotation: v.rotation,
        silent: Vr.isLabelSilent(t),
        style: Rn(s, {
          text: n,
          font: _,
          overflow: "truncate",
          width: m,
          ellipsis: g,
          fill: s.getTextColor() || t.get(["axisLine", "lineStyle", "color"]),
          align: s.get("align") || v.textAlign,
          verticalAlign: s.get("verticalAlign") || v.textVerticalAlign
        }),
        z2: 1
      });
      if (wu({
        el: y,
        componentModel: t,
        itemName: n
      }), y.__fullText = n, y.anid = "name", t.get("triggerEvent")) {
        var w = Vr.makeAxisEventDataBase(t);
        w.targetType = "axisName", w.name = n, ct(y).eventData = w;
      }
      i.add(y), y.updateTransform(), r.add(y), y.decomposeTransform();
    }
  }
};
function OD(e, t, r, i) {
  var n = $v(r - e), a, o, s = i[0] > i[1], l = t === "start" && !s || t !== "start" && s;
  return Ka(n - ar / 2) ? (o = l ? "bottom" : "top", a = "center") : Ka(n - ar * 1.5) ? (o = l ? "top" : "bottom", a = "center") : (o = "middle", n < ar * 1.5 && n > ar / 2 ? a = l ? "left" : "right" : a = l ? "right" : "left"), {
    rotation: n,
    textAlign: a,
    textVerticalAlign: o
  };
}
function BD(e, t, r) {
  if (!cD(e.axis)) {
    var i = e.get(["axisLabel", "showMinLabel"]), n = e.get(["axisLabel", "showMaxLabel"]);
    t = t || [], r = r || [];
    var a = t[0], o = t[1], s = t[t.length - 1], l = t[t.length - 2], u = r[0], h = r[1], f = r[r.length - 1], v = r[r.length - 2];
    i === !1 ? (Jt(a), Jt(u)) : Lc(a, o) && (i ? (Jt(o), Jt(h)) : (Jt(a), Jt(u))), n === !1 ? (Jt(s), Jt(f)) : Lc(l, s) && (n ? (Jt(l), Jt(v)) : (Jt(s), Jt(f)));
  }
}
function Jt(e) {
  e && (e.ignore = !0);
}
function Lc(e, t) {
  var r = e && e.getBoundingRect().clone(), i = t && t.getBoundingRect().clone();
  if (!(!r || !i)) {
    var n = jl([]);
    return Jl(n, n, -e.rotation), r.applyTransform(mi([], n, e.getLocalTransform())), i.applyTransform(mi([], n, t.getLocalTransform())), r.intersect(i);
  }
}
function Ic(e) {
  return e === "middle" || e === "center";
}
function Kp(e, t, r, i, n) {
  for (var a = [], o = [], s = [], l = 0; l < e.length; l++) {
    var u = e[l].coord;
    o[0] = u, o[1] = 0, s[0] = u, s[1] = r, t && (Me(o, o, t), Me(s, s, t));
    var h = new Ii({
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
    mu(h.shape, h.style.lineWidth), h.anid = n + "_" + e[l].tickValue, a.push(h);
  }
  return a;
}
function ND(e, t, r, i) {
  var n = r.axis, a = r.getModel("axisTick"), o = a.get("show");
  if (o === "auto" && i.handleAutoShown && (o = i.handleAutoShown("axisTick")), !(!o || n.scale.isBlank())) {
    for (var s = a.getModel("lineStyle"), l = i.tickDirection * a.get("length"), u = n.getTicksCoords(), h = Kp(u, t.transform, l, ut(s.getLineStyle(), {
      stroke: r.get(["axisLine", "lineStyle", "color"])
    }), "ticks"), f = 0; f < h.length; f++)
      e.add(h[f]);
    return h;
  }
}
function FD(e, t, r, i) {
  var n = r.axis, a = r.getModel("minorTick");
  if (!(!a.get("show") || n.scale.isBlank())) {
    var o = n.getMinorTicksCoords();
    if (o.length)
      for (var s = a.getModel("lineStyle"), l = i * a.get("length"), u = ut(s.getLineStyle(), ut(r.getModel("axisTick").getLineStyle(), {
        stroke: r.get(["axisLine", "lineStyle", "color"])
      })), h = 0; h < o.length; h++)
        for (var f = Kp(o[h], t.transform, l, u, "minorticks_" + h), v = 0; v < f.length; v++)
          e.add(f[v]);
  }
}
function zD(e, t, r, i) {
  var n = r.axis, a = Mn(i.axisLabelShow, r.get(["axisLabel", "show"]));
  if (!(!a || n.scale.isBlank())) {
    var o = r.getModel("axisLabel"), s = o.get("margin"), l = n.getViewLabels(), u = (Mn(i.labelRotate, o.get("rotate")) || 0) * ar / 180, h = Vr.innerTextLayout(i.rotation, u, i.labelDirection), f = r.getCategories && r.getCategories(!0), v = [], c = Vr.isLabelSilent(r), d = r.get("triggerEvent");
    return D(l, function(_, p) {
      var g = n.scale.type === "ordinal" ? n.scale.getRawOrdinalNumber(_.tickValue) : _.tickValue, m = _.formattedLabel, y = _.rawLabel, w = o;
      if (f && f[g]) {
        var b = f[g];
        F(b) && b.textStyle && (w = new vt(b.textStyle, o, r.ecModel));
      }
      var S = w.getTextColor() || r.get(["axisLine", "lineStyle", "color"]), T = n.dataToCoord(g), x = w.getShallow("align", !0) || h.textAlign, C = K(w.getShallow("alignMinLabel", !0), x), M = K(w.getShallow("alignMaxLabel", !0), x), A = w.getShallow("verticalAlign", !0) || w.getShallow("baseline", !0) || h.textVerticalAlign, L = K(w.getShallow("verticalAlignMinLabel", !0), A), I = K(w.getShallow("verticalAlignMaxLabel", !0), A), P = new de({
        x: T,
        y: i.labelOffset + i.labelDirection * s,
        rotation: h.rotation,
        silent: c,
        z2: 10 + (_.level || 0),
        style: Rn(w, {
          text: m,
          align: p === 0 ? C : p === l.length - 1 ? M : x,
          verticalAlign: p === 0 ? L : p === l.length - 1 ? I : A,
          fill: rt(S) ? S(
            // (1) In category axis with data zoom, tick is not the original
            // index of axis.data. So tick should not be exposed to user
            // in category axis.
            // (2) Compatible with previous version, which always use formatted label as
            // input. But in interval scale the formatted label is like '223,445', which
            // maked user replace ','. So we modify it to return original val but remain
            // it as 'string' to avoid error in replacing.
            n.type === "category" ? y : n.type === "value" ? g + "" : g,
            p
          ) : S
        })
      });
      if (P.anid = "label_" + g, wu({
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
        var k = Vr.makeAxisEventDataBase(r);
        k.targetType = "axisLabel", k.value = y, k.tickIndex = p, n.type === "category" && (k.dataIndex = g), ct(P).eventData = k;
      }
      t.add(P), P.updateTransform(), v.push(P), e.add(P), P.decomposeTransform();
    }), v;
  }
}
function HD(e, t) {
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
  return VD(r, e, t), r.seriesInvolved && GD(r, e), r;
}
function VD(e, t, r) {
  var i = t.getComponent("tooltip"), n = t.getComponent("axisPointer"), a = n.get("link", !0) || [], o = [];
  D(r.getCoordinateSystems(), function(s) {
    if (!s.axisPointerEnabled)
      return;
    var l = Nn(s.model), u = e.coordSysAxesInfo[l] = {};
    e.coordSysMap[l] = s;
    var h = s.model, f = h.getModel("tooltip", i);
    if (D(s.getAxes(), Zt(_, !1, null)), s.getTooltipAxes && i && f.get("show")) {
      var v = f.get("trigger") === "axis", c = f.get(["axisPointer", "type"]) === "cross", d = s.getTooltipAxes(f.get(["axisPointer", "axis"]));
      (v || c) && D(d.baseAxes, Zt(_, c ? "cross" : !0, v)), c && D(d.otherAxes, Zt(_, "cross", !1));
    }
    function _(p, g, m) {
      var y = m.model.getModel("axisPointer", n), w = y.get("show");
      if (!(!w || w === "auto" && !p && !Bl(y))) {
        g == null && (g = y.get("triggerTooltip")), y = p ? UD(m, f, n, t, p, g) : y;
        var b = y.get("snap"), S = y.get("triggerEmphasis"), T = Nn(m.model), x = g || b || m.type === "category", C = e.axesInfo[T] = {
          key: T,
          axis: m,
          coordSys: s,
          axisPointerModel: y,
          triggerTooltip: g,
          triggerEmphasis: S,
          involveSeries: x,
          snap: b,
          useHandle: Bl(y),
          seriesModels: [],
          linkGroup: null
        };
        u[T] = C, e.seriesInvolved = e.seriesInvolved || x;
        var M = WD(a, m);
        if (M != null) {
          var A = o[M] || (o[M] = {
            axesInfo: {}
          });
          A.axesInfo[T] = C, A.mapper = a[M].mapper, C.linkGroup = A;
        }
      }
    }
  });
}
function UD(e, t, r, i, n, a) {
  var o = t.getModel("axisPointer"), s = ["type", "snap", "lineStyle", "shadowStyle", "label", "animation", "animationDurationUpdate", "animationEasingUpdate", "z"], l = {};
  D(s, function(v) {
    l[v] = j(o.get(v));
  }), l.snap = e.type !== "category" && !!a, o.get("type") === "cross" && (l.type = "line");
  var u = l.label || (l.label = {});
  if (u.show == null && (u.show = !1), n === "cross") {
    var h = o.get(["label", "show"]);
    if (u.show = h ?? !0, !a) {
      var f = l.lineStyle = o.get("crossStyle");
      f && ut(u, f.textStyle);
    }
  }
  return e.model.getModel("axisPointer", new vt(l, r, i));
}
function GD(e, t) {
  t.eachSeries(function(r) {
    var i = r.coordinateSystem, n = r.get(["tooltip", "trigger"], !0), a = r.get(["tooltip", "show"], !0);
    !i || n === "none" || n === !1 || n === "item" || a === !1 || r.get(["axisPointer", "show"], !0) === !1 || D(e.coordSysAxesInfo[Nn(i.model)], function(o) {
      var s = o.axis;
      i.getAxis(s.dim) === s && (o.seriesModels.push(r), o.seriesDataCount == null && (o.seriesDataCount = 0), o.seriesDataCount += r.getData().count());
    });
  });
}
function WD(e, t) {
  for (var r = t.model, i = t.dim, n = 0; n < e.length; n++) {
    var a = e[n] || {};
    if (Us(a[i + "AxisId"], r.id) || Us(a[i + "AxisIndex"], r.componentIndex) || Us(a[i + "AxisName"], r.name))
      return n;
  }
}
function Us(e, t) {
  return e === "all" || $(e) && ot(e, t) >= 0 || e === t;
}
function YD(e) {
  var t = $u(e);
  if (t) {
    var r = t.axisPointerModel, i = t.axis.scale, n = r.option, a = r.get("status"), o = r.get("value");
    o != null && (o = i.parse(o));
    var s = Bl(r);
    a == null && (n.status = s ? "show" : "hide");
    var l = i.getExtent().slice();
    l[0] > l[1] && l.reverse(), // Pick a value on axis when initializing.
    (o == null || o > l[1]) && (o = l[1]), o < l[0] && (o = l[0]), n.value = o, s && (n.status = t.axis.scale.isBlank() ? "hide" : "show");
  }
}
function $u(e) {
  var t = (e.ecModel.getComponent("axisPointer") || {}).coordSysAxesInfo;
  return t && t.axesInfo[Nn(e)];
}
function XD(e) {
  var t = $u(e);
  return t && t.axisPointerModel;
}
function Bl(e) {
  return !!e.get(["handle", "show"]);
}
function Nn(e) {
  return e.type + "||" + e.id;
}
var Rc = {}, qD = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.render = function(r, i, n, a) {
      this.axisPointerClass && YD(r), e.prototype.render.apply(this, arguments), this._doUpdateAxisPointerClass(r, n, !0);
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
        var o = XD(r);
        o ? (this._axisPointer || (this._axisPointer = new a())).render(r, o, i, n) : this._disposeAxisPointer(i);
      }
    }, t.prototype._disposeAxisPointer = function(r) {
      this._axisPointer && this._axisPointer.dispose(r), this._axisPointer = null;
    }, t.registerAxisPointerClass = function(r, i) {
      Rc[r] = i;
    }, t.getAxisPointerClass = function(r) {
      return r && Rc[r];
    }, t.type = "axis", t;
  })(fr)
);
function kc(e, t, r) {
  var i = Pi.createCanvas(), n = t.getWidth(), a = t.getHeight(), o = i.style;
  return o && (o.position = "absolute", o.left = "0", o.top = "0", o.width = n + "px", o.height = a + "px", i.setAttribute("data-zr-dom-id", e)), i.width = n * r, i.height = a * r, i;
}
var Gs = (function(e) {
  G(t, e);
  function t(r, i, n) {
    var a = e.call(this) || this;
    a.motionBlur = !1, a.lastFrameAlpha = 0.7, a.dpr = 1, a.virtual = !1, a.config = {}, a.incremental = !1, a.zlevel = 0, a.maxRepaintRectCount = 5, a.__dirty = !0, a.__firstTimePaint = !0, a.__used = !1, a.__drawIndex = 0, a.__startIndex = 0, a.__endIndex = 0, a.__prevStartIndex = null, a.__prevEndIndex = null;
    var o;
    n = n || Za, typeof r == "string" ? o = kc(r, i, n) : F(r) && (o = r, r = o.id), a.id = r, a.dom = o;
    var s = o.style;
    return s && (hv(o), o.onselectstart = function() {
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
    this.domBack = kc("back-" + this.id, this.painter, r), this.ctxBack = this.domBack.getContext("2d"), r !== 1 && this.ctxBack.scale(r, r);
  }, t.prototype.createRepaintRects = function(r, i, n, a) {
    if (this.__firstTimePaint)
      return this.__firstTimePaint = !1, null;
    var o = [], s = this.maxRepaintRectCount, l = !1, u = new it(0, 0, 0, 0);
    function h(m) {
      if (!(!m.isFinite() || m.isZero()))
        if (o.length === 0) {
          var y = new it(0, 0, 0, 0);
          y.copy(m), o.push(y);
        } else {
          for (var w = !1, b = 1 / 0, S = 0, T = 0; T < o.length; ++T) {
            var x = o[T];
            if (x.intersect(m)) {
              var C = new it(0, 0, 0, 0);
              C.copy(x), C.union(m), o[T] = C, w = !0;
              break;
            } else if (l) {
              u.copy(m), u.union(x);
              var M = m.width * m.height, A = x.width * x.height, L = u.width * u.height, I = L - M - A;
              I < b && (b = I, S = T);
            }
          }
          if (l && (o[S].union(m), w = !0), !w) {
            var y = new it(0, 0, 0, 0);
            y.copy(m), o.push(y);
          }
          l || (l = o.length >= s);
        }
    }
    for (var f = this.__startIndex; f < this.__endIndex; ++f) {
      var v = r[f];
      if (v) {
        var c = v.shouldBePainted(n, a, !0, !0), d = v.__isRendered && (v.__dirty & qt || !c) ? v.getPrevPaintRect() : null;
        d && h(d);
        var _ = c && (v.__dirty & qt || !v.__isRendered) ? v.getPaintRect() : null;
        _ && h(_);
      }
    }
    for (var f = this.__prevStartIndex; f < this.__prevEndIndex; ++f) {
      var v = i[f], c = v && v.shouldBePainted(n, a, !0, !0);
      if (v && (!c || !v.__zr) && v.__isRendered) {
        var d = v.getPrevPaintRect();
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
    var u = this.motionBlur && !r, h = this.lastFrameAlpha, f = this.dpr, v = this;
    u && (this.domBack || this.createBackBuffer(), this.ctxBack.globalCompositeOperation = "copy", this.ctxBack.drawImage(a, 0, 0, s / f, l / f));
    var c = this.domBack;
    function d(_, p, g, m) {
      if (o.clearRect(_, p, g, m), i && i !== "transparent") {
        var y = void 0;
        if (yo(i)) {
          var w = i.global || i.__width === g && i.__height === m;
          y = w && i.__canvasGradient || Rl(o, i, {
            x: 0,
            y: 0,
            width: g,
            height: m
          }), i.__canvasGradient = y, i.__width = g, i.__height = m;
        } else T0(i) && (i.scaleX = i.scaleX || f, i.scaleY = i.scaleY || f, y = kl(o, i, {
          dirty: function() {
            v.setUnpainted(), v.painter.refresh();
          }
        }));
        o.save(), o.fillStyle = y || i, o.fillRect(_, p, g, m), o.restore();
      }
      u && (o.save(), o.globalAlpha = h, o.drawImage(c, _, p, g, m), o.restore());
    }
    !n || u ? d(0, 0, s, l) : n.length && D(n, function(_) {
      d(_.x * f, _.y * f, _.width * f, _.height * f);
    });
  }, t;
})(Ie), Ec = 1e5, Er = 314159, Ca = 0.01, ZD = 1e-3;
function KD(e) {
  return e ? e.__builtin__ ? !0 : !(typeof e.resize != "function" || typeof e.refresh != "function") : !1;
}
function QD(e, t) {
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
var jD = (function() {
  function e(t, r, i, n) {
    this.type = "canvas", this._zlevelList = [], this._prevDisplayList = [], this._layers = {}, this._layerConfig = {}, this._needsManuallyCompositing = !1, this.type = "canvas";
    var a = !t.nodeName || t.nodeName.toUpperCase() === "CANVAS";
    this._opts = i = R({}, i || {}), this.dpr = i.devicePixelRatio || Za, this._singleCanvas = a, this.root = t;
    var o = t.style;
    o && (hv(t), t.innerHTML = ""), this.storage = r;
    var s = this._zlevelList;
    this._prevDisplayList = [];
    var l = this._layers;
    if (a) {
      var h = t, f = h.width, v = h.height;
      i.width != null && (f = i.width), i.height != null && (v = i.height), this.dpr = i.devicePixelRatio || 1, h.width = f * this.dpr, h.height = v * this.dpr, this._width = f, this._height = v;
      var c = new Gs(h, this, this.dpr);
      c.__builtin__ = !0, c.initContext(), l[Er] = c, c.zlevel = Er, s.push(Er), this._domRoot = t;
    } else {
      this._width = ya(t, 0, i), this._height = ya(t, 1, i);
      var u = this._domRoot = QD(this._width, this._height);
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
        s.__inHover && (i || (i = this._hoverlayer = this.getLayer(Ec)), a || (a = i.ctx, a.save()), Fr(a, s, n, o === r - 1));
      }
      a && a.restore();
    }
  }, e.prototype.getHoverLayer = function() {
    return this.getLayer(Ec);
  }, e.prototype.paintOne = function(t, r) {
    wp(t, r);
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
        Ga(function() {
          l._paintList(t, r, i, n);
        });
      }
    }
  }, e.prototype._compositeManually = function() {
    var t = this.getLayer(Er).ctx, r = this._domRoot.width, i = this._domRoot.height;
    t.clearRect(0, 0, r, i), this.eachBuiltinLayer(function(n) {
      n.virtual && t.drawImage(n.dom, 0, 0, r, i);
    });
  }, e.prototype._doPaintList = function(t, r, i) {
    for (var n = this, a = [], o = this._opts.useDirtyRect, s = 0; s < this._zlevelList.length; s++) {
      var l = this._zlevelList[s], u = this._layers[l];
      u.__builtin__ && u !== this._hoverlayer && (u.__dirty || i) && a.push(u);
    }
    for (var h = !0, f = !1, v = function(_) {
      var p = a[_], g = p.ctx, m = o && p.createRepaintRects(t, r, c._width, c._height), y = i ? p.__startIndex : p.__drawIndex, w = !i && p.incremental && Date.now, b = w && Date.now(), S = p.zlevel === c._zlevelList[0] ? c._backgroundColor : null;
      if (p.__startIndex === p.__endIndex)
        p.clear(!1, S, m);
      else if (y === p.__startIndex) {
        var T = t[y];
        (!T.incremental || !T.notClear || i) && p.clear(!1, S, m);
      }
      y === -1 && (console.error("For some unknown reason. drawIndex is -1"), y = p.__startIndex);
      var x, C = function(I) {
        var P = {
          inHover: !1,
          allClipped: !1,
          prevEl: null,
          viewWidth: n._width,
          viewHeight: n._height
        };
        for (x = y; x < p.__endIndex; x++) {
          var k = t[x];
          if (k.__inHover && (f = !0), n._doPaintEl(k, p, o, I, P, x === p.__endIndex - 1), w) {
            var E = Date.now() - b;
            if (E > 15)
              break;
          }
        }
        P.prevElClipPaths && g.restore();
      };
      if (m)
        if (m.length === 0)
          x = p.__endIndex;
        else
          for (var M = c.dpr, A = 0; A < m.length; ++A) {
            var L = m[A];
            g.save(), g.beginPath(), g.rect(L.x * M, L.y * M, L.width * M, L.height * M), g.clip(), C(L), g.restore();
          }
      else
        g.save(), C(), g.restore();
      p.__drawIndex = x, p.__drawIndex < p.__endIndex && (h = !1);
    }, c = this, d = 0; d < a.length; d++)
      v(d);
    return H.wxa && D(this._layers, function(_) {
      _ && _.ctx && _.ctx.draw && _.ctx.draw();
    }), {
      finished: h,
      needsRefreshHover: f
    };
  }, e.prototype._doPaintEl = function(t, r, i, n, a, o) {
    var s = r.ctx;
    if (i) {
      var l = t.getPaintRect();
      (!n || l && l.intersect(n)) && (Fr(s, t, a, o), t.setPrevPaintRect(l));
    } else
      Fr(s, t, a, o);
  }, e.prototype.getLayer = function(t, r) {
    this._singleCanvas && !this._needsManuallyCompositing && (t = Er);
    var i = this._layers[t];
    return i || (i = new Gs("zr_" + t, this, this.dpr), i.zlevel = t, i.__builtin__ = !0, this._layerConfig[t] ? _t(i, this._layerConfig[t], !0) : this._layerConfig[t - Ca] && _t(i, this._layerConfig[t - Ca], !0), r && (i.virtual = r), this.insertLayer(t, i), i.initContext()), i;
  }, e.prototype.insertLayer = function(t, r) {
    var i = this._layers, n = this._zlevelList, a = n.length, o = this._domRoot, s = null, l = -1;
    if (!i[t] && KD(r)) {
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
    }
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
    this.eachBuiltinLayer(function(f, v) {
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
      s !== u && (s = u, o = 0), n.incremental ? (h = this.getLayer(u + ZD, this._needsManuallyCompositing), h.incremental = !0, o = 1) : h = this.getLayer(u + (o > 0 ? Ca : 0), this._needsManuallyCompositing), h.__builtin__ || Zl("ZLevel " + u + " has been used by unkown layer " + h.id), h !== a && (h.__used = !0, h.__startIndex !== l && (h.__dirty = !0), h.__startIndex = l, h.incremental ? h.__drawIndex = -1 : h.__drawIndex = l, r(l), a = h), n.__dirty & qt && !n.__inHover && (h.__dirty = !0, h.incremental && h.__drawIndex < 0 && (h.__drawIndex = l));
    }
    r(l), this.eachBuiltinLayer(function(f, v) {
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
      i[t] ? _t(i[t], r, !0) : i[t] = r;
      for (var n = 0; n < this._zlevelList.length; n++) {
        var a = this._zlevelList[n];
        if (a === t || a === t + Ca) {
          var o = this._layers[a];
          _t(o, i[t], !0);
        }
      }
    }
  }, e.prototype.delLayer = function(t) {
    var r = this._layers, i = this._zlevelList, n = r[t];
    n && (n.dom.parentNode.removeChild(n.dom), delete r[t], i.splice(ot(i, t), 1));
  }, e.prototype.resize = function(t, r) {
    if (this._domRoot.style) {
      var i = this._domRoot;
      i.style.display = "none";
      var n = this._opts, a = this.root;
      if (t != null && (n.width = t), r != null && (n.height = r), t = ya(a, 0, n), r = ya(a, 1, n), i.style.display = "", this._width !== t || r !== this._height) {
        i.style.width = t + "px", i.style.height = r + "px";
        for (var o in this._layers)
          this._layers.hasOwnProperty(o) && this._layers[o].resize(t, r);
        this.refresh(!0);
      }
      this._width = t, this._height = r;
    } else {
      if (t == null || r == null)
        return;
      this._width = t, this._height = r, this.getLayer(Er).resize(t, r);
    }
    return this;
  }, e.prototype.clearLayer = function(t) {
    var r = this._layers[t];
    r && r.clear();
  }, e.prototype.dispose = function() {
    this.root.innerHTML = "", this.root = this.storage = this._domRoot = this._layers = null;
  }, e.prototype.getRenderedCanvas = function(t) {
    if (t = t || {}, this._singleCanvas && !this._compositeManually)
      return this._layers[Er].dom;
    var r = new Gs("image", this, t.pixelRatio || this.dpr);
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
        Fr(i, h, o, l === u - 1);
      }
    return r.dom;
  }, e.prototype.getWidth = function() {
    return this._width;
  }, e.prototype.getHeight = function() {
    return this._height;
  }, e;
})();
function JD(e) {
  e.registerPainter("canvas", jD);
}
var $r = wt(), $c = j, Ws = st, tM = (
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
          s = this._group = new Ue(), this.createPointerEl(s, u, t, r), this.createLabelEl(s, u, t, r), i.getZr().add(s);
        else {
          var v = Zt(Oc, r, f);
          this.updatePointerEl(s, u, v), this.updateLabelEl(s, u, v, r);
        }
        Nc(s, r, !0), this._renderHandle(a);
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
          var l = $u(t).seriesDataCount, u = n.getExtent();
          return Math.abs(u[0] - u[1]) / l > s;
        }
        return !1;
      }
      return i === !0;
    }, e.prototype.makeElOption = function(t, r, i, n, a) {
    }, e.prototype.createPointerEl = function(t, r, i, n) {
      var a = r.pointer;
      if (a) {
        var o = $r(t).pointerEl = new xb[a.type]($c(r.pointer));
        t.add(o);
      }
    }, e.prototype.createLabelEl = function(t, r, i, n) {
      if (r.label) {
        var a = $r(t).labelEl = new de($c(r.label));
        t.add(a), Bc(a, n);
      }
    }, e.prototype.updatePointerEl = function(t, r, i) {
      var n = $r(t).pointerEl;
      n && r.pointer && (n.setStyle(r.pointer.style), i(n, {
        shape: r.pointer.shape
      }));
    }, e.prototype.updateLabelEl = function(t, r, i, n) {
      var a = $r(t).labelEl;
      a && (a.setStyle(r.label.style), i(a, {
        // Consider text length change in vertical axis, animation should
        // be used on shape, otherwise the effect will be weird.
        // TODOTODO
        // shape: elOption.label.shape,
        x: r.label.x,
        y: r.label.y
      }), Bc(a, n));
    }, e.prototype._renderHandle = function(t) {
      if (!(this._dragging || !this.updateHandleTransform)) {
        var r = this._axisPointerModel, i = this._api.getZr(), n = this._handle, a = r.getModel("handle"), o = r.get("status");
        if (!a.get("show") || !o || o === "hide") {
          n && i.remove(n), this._handle = null;
          return;
        }
        var s;
        this._handle || (s = !0, n = this._handle = Sd(a.get("icon"), {
          cursor: "move",
          draggable: !0,
          onmousemove: function(u) {
            cv(u.event);
          },
          onmousedown: Ws(this._onHandleDragMove, this, 0, 0),
          drift: Ws(this._onHandleDragMove, this),
          ondragend: Ws(this._onHandleDragEnd, this)
        }), i.add(n)), Nc(n, r, !1), n.setStyle(a.getItemStyle(null, ["color", "borderColor", "borderWidth", "opacity", "shadowColor", "shadowBlur", "shadowOffsetX", "shadowOffsetY"]));
        var l = a.get("size");
        $(l) || (l = [l, l]), n.scaleX = l[0] / 2, n.scaleY = l[1] / 2, lp(this, "_doDispatchAxisPointer", a.get("throttle") || 0, "fixRate"), this._moveHandleToValue(t, s);
      }
    }, e.prototype._moveHandleToValue = function(t, r) {
      Oc(this._axisPointerModel, !r && this._moveAnimation, this._handle, Ys(this.getHandleTransform(t, this._axisModel, this._axisPointerModel)));
    }, e.prototype._onHandleDragMove = function(t, r) {
      var i = this._handle;
      if (i) {
        this._dragging = !0;
        var n = this.updateHandleTransform(Ys(i), [t, r], this._axisModel, this._axisPointerModel);
        this._payloadInfo = n, i.stopAnimation(), i.attr(Ys(n)), $r(i).lastProp = null, this._doDispatchAxisPointer();
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
      r && i && (this._lastGraphicKey = null, i && r.remove(i), n && r.remove(n), this._group = null, this._handle = null, this._payloadInfo = null), Pl(this, "_doDispatchAxisPointer");
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
function Oc(e, t, r, i) {
  Qp($r(r).lastProp, i) || ($r(r).lastProp = i, t ? In(r, i, e) : (r.stopAnimation(), r.attr(i)));
}
function Qp(e, t) {
  if (F(e) && F(t)) {
    var r = !0;
    return D(t, function(i, n) {
      r = r && Qp(e[n], i);
    }), !!r;
  } else
    return e === t;
}
function Bc(e, t) {
  e[t.get(["label", "show"]) ? "show" : "hide"]();
}
function Ys(e) {
  return {
    x: e.x || 0,
    y: e.y || 0,
    rotation: e.rotation || 0
  };
}
function Nc(e, t, r) {
  var i = t.get("z"), n = t.get("zlevel");
  e && e.traverse(function(a) {
    a.type !== "group" && (i != null && (a.z = i), n != null && (a.zlevel = n), a.silent = r);
  });
}
function eM(e) {
  var t = e.get("type"), r = e.getModel(t + "Style"), i;
  return t === "line" ? (i = r.getLineStyle(), i.fill = null) : t === "shadow" && (i = r.getAreaStyle(), i.stroke = null), i;
}
function rM(e, t, r, i, n) {
  var a = r.get("value"), o = jp(a, t.axis, t.ecModel, r.get("seriesDataIndices"), {
    precision: r.get(["label", "precision"]),
    formatter: r.get(["label", "formatter"])
  }), s = r.getModel("label"), l = Tu(s.get("padding") || 0), u = s.getFont(), h = Lv(o, u), f = n.position, v = h.width + l[1] + l[3], c = h.height + l[0] + l[2], d = n.align;
  d === "right" && (f[0] -= v), d === "center" && (f[0] -= v / 2);
  var _ = n.verticalAlign;
  _ === "bottom" && (f[1] -= c), _ === "middle" && (f[1] -= c / 2), iM(f, v, c, i);
  var p = s.get("backgroundColor");
  (!p || p === "auto") && (p = t.get(["axisLine", "lineStyle", "color"])), e.label = {
    // shape: {x: 0, y: 0, width: width, height: height, r: labelModel.get('borderRadius')},
    x: f[0],
    y: f[1],
    style: Rn(s, {
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
function iM(e, t, r, i) {
  var n = i.getWidth(), a = i.getHeight();
  e[0] = Math.min(e[0] + t, n) - t, e[1] = Math.min(e[1] + r, a) - r, e[0] = Math.max(e[0], 0), e[1] = Math.max(e[1], 0);
}
function jp(e, t, r, i, n) {
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
      value: Gp(t, {
        value: e
      }),
      axisDimension: t.dim,
      axisIndex: t.index,
      seriesData: []
    };
    D(i, function(l) {
      var u = r.getSeriesByIndex(l.seriesIndex), h = l.dataIndexInside, f = u && u.getDataParams(h);
      f && s.seriesData.push(f);
    }), V(o) ? a = o.replace("{value}", a) : rt(o) && (a = o(s));
  }
  return a;
}
function Jp(e, t, r) {
  var i = _i();
  return Jl(i, i, r.rotation), el(i, i, r.position), yu([e.dataToCoord(t), (r.labelOffset || 0) + (r.labelDirection || 1) * (r.labelMargin || 0)], i);
}
function nM(e, t, r, i, n, a) {
  var o = Vr.innerTextLayout(r.rotation, 0, r.labelDirection);
  r.labelMargin = n.get(["label", "margin"]), rM(t, i, n, a, {
    position: Jp(i.axis, e, r),
    align: o.textAlign,
    verticalAlign: o.textVerticalAlign
  });
}
function aM(e, t, r) {
  return r = r || 0, {
    x1: e[r],
    y1: e[1 - r],
    x2: t[r],
    y2: t[1 - r]
  };
}
function oM(e, t, r) {
  return r = r || 0, {
    x: e[r],
    y: e[1 - r],
    width: t[r],
    height: t[1 - r]
  };
}
var sM = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      return e !== null && e.apply(this, arguments) || this;
    }
    return t.prototype.makeElOption = function(r, i, n, a, o) {
      var s = n.axis, l = s.grid, u = a.get("type"), h = Fc(l, s).getOtherAxis(s).getGlobalExtent(), f = s.toGlobalCoord(s.dataToCoord(i, !0));
      if (u && u !== "none") {
        var v = eM(a), c = lM[u](s, f, h);
        c.style = v, r.graphicKey = c.type, r.pointer = c;
      }
      var d = Ac(l.model, n);
      nM(
        // @ts-ignore
        i,
        r,
        d,
        n,
        a,
        o
      );
    }, t.prototype.getHandleTransform = function(r, i, n) {
      var a = Ac(i.axis.grid.model, i, {
        labelInside: !1
      });
      a.labelMargin = n.get(["handle", "margin"]);
      var o = Jp(i.axis, r, a);
      return {
        x: o[0],
        y: o[1],
        rotation: a.rotation + (a.labelDirection < 0 ? Math.PI : 0)
      };
    }, t.prototype.updateHandleTransform = function(r, i, n, a) {
      var o = n.axis, s = o.grid, l = o.getGlobalExtent(!0), u = Fc(s, o).getOtherAxis(o).getGlobalExtent(), h = o.dim === "x" ? 0 : 1, f = [r.x, r.y];
      f[h] += i[h], f[h] = Math.min(l[1], f[h]), f[h] = Math.max(l[0], f[h]);
      var v = (u[1] + u[0]) / 2, c = [v, v];
      c[h] = f[h];
      var d = [{
        verticalAlign: "middle"
      }, {
        align: "center"
      }];
      return {
        x: f[0],
        y: f[1],
        rotation: r.rotation,
        cursorPoint: c,
        tooltipOption: d[h]
      };
    }, t;
  })(tM)
);
function Fc(e, t) {
  var r = {};
  return r[t.dim + "AxisIndex"] = t.index, e.getCartesian(r);
}
var lM = {
  line: function(e, t, r) {
    var i = aM([t, r[0]], [t, r[1]], zc(e));
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
      shape: oM([t - i / 2, r[0]], [i, n], zc(e))
    };
  }
};
function zc(e) {
  return e.dim === "x" ? 0 : 1;
}
var uM = (
  /** @class */
  (function(e) {
    G(t, e);
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
), Ne = wt(), hM = D;
function tg(e, t, r) {
  if (!H.node) {
    var i = t.getZr();
    Ne(i).records || (Ne(i).records = {}), fM(i, t);
    var n = Ne(i).records[e] || (Ne(i).records[e] = {});
    n.handler = r;
  }
}
function fM(e, t) {
  if (Ne(e).initialized)
    return;
  Ne(e).initialized = !0, r("click", Zt(Hc, "click")), r("mousemove", Zt(Hc, "mousemove")), r("globalout", vM);
  function r(i, n) {
    e.on(i, function(a) {
      var o = dM(t);
      hM(Ne(e).records, function(s) {
        s && n(s, a, o.dispatchAction);
      }), cM(o.pendings, t);
    });
  }
}
function cM(e, t) {
  var r = e.showTip.length, i = e.hideTip.length, n;
  r ? n = e.showTip[r - 1] : i && (n = e.hideTip[i - 1]), n && (n.dispatchAction = null, t.dispatchAction(n));
}
function vM(e, t, r) {
  e.handler("leave", null, r);
}
function Hc(e, t, r, i) {
  t.handler(e, r, i);
}
function dM(e) {
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
function Nl(e, t) {
  if (!H.node) {
    var r = t.getZr(), i = (Ne(r).records || {})[e];
    i && (Ne(r).records[e] = null);
  }
}
var pM = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.render = function(r, i, n) {
      var a = i.getComponent("tooltip"), o = r.get("triggerOn") || a && a.get("triggerOn") || "mousemove|click";
      tg("axisPointer", n, function(s, l, u) {
        o !== "none" && (s === "leave" || o.indexOf(s) >= 0) && u({
          type: "updateAxisPointer",
          currTrigger: s,
          x: l && l.offsetX,
          y: l && l.offsetY
        });
      });
    }, t.prototype.remove = function(r, i) {
      Nl("axisPointer", i);
    }, t.prototype.dispose = function(r, i) {
      Nl("axisPointer", i);
    }, t.type = "axisPointer", t;
  })(fr)
);
function eg(e, t) {
  var r = [], i = e.seriesIndex, n;
  if (i == null || !(n = t.getSeriesByIndex(i)))
    return {
      point: []
    };
  var a = n.getData(), o = Un(a, e);
  if (o == null || o < 0 || $(o))
    return {
      point: []
    };
  var s = a.getItemGraphicEl(o), l = n.coordinateSystem;
  if (n.getTooltipPosition)
    r = n.getTooltipPosition(o) || [];
  else if (l && l.dataToPoint)
    if (e.isStacked) {
      var u = l.getBaseAxis(), h = l.getOtherAxis(u), f = h.dim, v = u.dim, c = f === "x" || f === "radius" ? 1 : 0, d = a.mapDimension(v), _ = [];
      _[c] = a.get(d, o), _[1 - c] = a.get(a.getCalculationInfo("stackResultDimension"), o), r = l.dataToPoint(_) || [];
    } else
      r = l.dataToPoint(a.getValues(J(l.dimensions, function(g) {
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
var Vc = wt();
function gM(e, t, r) {
  var i = e.currTrigger, n = [e.x, e.y], a = e, o = e.dispatchAction || st(r.dispatchAction, r), s = t.getComponent("axisPointer").coordSysAxesInfo;
  if (s) {
    za(n) && (n = eg({
      seriesIndex: a.seriesIndex,
      // Do not use dataIndexInside from other ec instance.
      // FIXME: auto detect it?
      dataIndex: a.dataIndex
    }, t).point);
    var l = za(n), u = a.axesInfo, h = s.axesInfo, f = i === "leave" || za(n), v = {}, c = {}, d = {
      list: [],
      map: {}
    }, _ = {
      showPointer: Zt(mM, c),
      showTooltip: Zt(yM, d)
    };
    D(s.coordSysMap, function(g, m) {
      var y = l || g.containPoint(n);
      D(s.coordSysAxesInfo[m], function(w, b) {
        var S = w.axis, T = TM(u, w);
        if (!f && y && (!u || T)) {
          var x = T && T.value;
          x == null && !l && (x = S.pointToData(n)), x != null && Uc(w, x, _, !1, v);
        }
      });
    });
    var p = {};
    return D(h, function(g, m) {
      var y = g.linkGroup;
      y && !c[m] && D(y.axesInfo, function(w, b) {
        var S = c[b];
        if (w !== g && S) {
          var T = S.value;
          y.mapper && (T = g.axis.scale.parse(y.mapper(T, Gc(w), Gc(g)))), p[g.key] = T;
        }
      });
    }), D(p, function(g, m) {
      Uc(h[m], g, _, !0, v);
    }), wM(c, h, v), SM(d, n, e, o), bM(h, o, r), v;
  }
}
function Uc(e, t, r, i, n) {
  var a = e.axis;
  if (!(a.scale.isBlank() || !a.containData(t))) {
    if (!e.involveSeries) {
      r.showPointer(e, t);
      return;
    }
    var o = _M(t, e), s = o.payloadBatch, l = o.snapToValue;
    s[0] && n.seriesIndex == null && R(n, s[0]), !i && e.snap && a.containData(l) && l != null && (t = l), r.showPointer(e, t, s), r.showTooltip(e, o, l);
  }
}
function _M(e, t) {
  var r = t.axis, i = r.dim, n = e, a = [], o = Number.MAX_VALUE, s = -1;
  return D(t.seriesModels, function(l, u) {
    var h = l.getData().mapDimensionsAll(i), f, v;
    if (l.getAxisTooltipData) {
      var c = l.getAxisTooltipData(h, e, r);
      v = c.dataIndices, f = c.nestestValue;
    } else {
      if (v = l.getData().indicesOfNearest(
        h[0],
        e,
        // Add a threshold to avoid find the wrong dataIndex
        // when data length is not same.
        // false,
        r.type === "category" ? 0.5 : null
      ), !v.length)
        return;
      f = l.getData().get(h[0], v[0]);
    }
    if (!(f == null || !isFinite(f))) {
      var d = e - f, _ = Math.abs(d);
      _ <= o && ((_ < o || d >= 0 && s < 0) && (o = _, s = d, n = f, a.length = 0), D(v, function(p) {
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
function mM(e, t, r, i) {
  e[t.key] = {
    value: r,
    payloadBatch: i
  };
}
function yM(e, t, r, i) {
  var n = r.payloadBatch, a = t.axis, o = a.model, s = t.axisPointerModel;
  if (!(!t.triggerTooltip || !n.length)) {
    var l = t.coordSys.model, u = Nn(l), h = e.map[u];
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
function wM(e, t, r) {
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
function SM(e, t, r, i) {
  if (za(t) || !e.list.length) {
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
function bM(e, t, r) {
  var i = r.getZr(), n = "axisPointerLastHighlights", a = Vc(i)[n] || {}, o = Vc(i)[n] = {};
  D(e, function(u, h) {
    var f = u.axisPointerModel.option;
    f.status === "show" && u.triggerEmphasis && D(f.seriesDataIndices, function(v) {
      var c = v.seriesIndex + " | " + v.dataIndex;
      o[c] = v;
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
function TM(e, t) {
  for (var r = 0; r < (e || []).length; r++) {
    var i = e[r];
    if (t.axis.dim === i.axisDim && t.axis.model.componentIndex === i.axisIndex)
      return i;
  }
}
function Gc(e) {
  var t = e.axis.model, r = {}, i = r.axisDim = e.axis.dim;
  return r.axisIndex = r[i + "AxisIndex"] = t.componentIndex, r.axisName = r[i + "AxisName"] = t.name, r.axisId = r[i + "AxisId"] = t.id, r;
}
function za(e) {
  return !e || e[0] == null || isNaN(e[0]) || e[1] == null || isNaN(e[1]);
}
function xM(e) {
  qD.registerAxisPointerClass("CartesianAxisPointer", sM), e.registerComponentModel(uM), e.registerComponentView(pM), e.registerPreprocessor(function(t) {
    if (t) {
      (!t.axisPointer || t.axisPointer.length === 0) && (t.axisPointer = {});
      var r = t.axisPointer.link;
      r && !$(r) && (t.axisPointer.link = [r]);
    }
  }), e.registerProcessor(e.PRIORITY.PROCESSOR.STATISTIC, function(t, r) {
    t.getComponent("axisPointer").coordSysAxesInfo = HD(t, r);
  }), e.registerAction({
    type: "updateAxisPointer",
    event: "updateAxisPointer",
    update: ":updateAxisPointer"
  }, gM);
}
var CM = (
  /** @class */
  (function(e) {
    G(t, e);
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
function rg(e) {
  var t = e.get("confine");
  return t != null ? !!t : e.get("renderMode") === "richText";
}
function ig(e) {
  if (H.domSupported) {
    for (var t = document.documentElement.style, r = 0, i = e.length; r < i; r++)
      if (e[r] in t)
        return e[r];
  }
}
var ng = ig(["transform", "webkitTransform", "OTransform", "MozTransform", "msTransform"]), DM = ig(["webkitTransition", "transition", "OTransition", "MozTransition", "msTransition"]);
function ag(e, t) {
  if (!e)
    return t;
  t = Pd(t, !0);
  var r = e.indexOf(t);
  return e = r === -1 ? t : "-" + e.slice(0, r) + "-" + t, e.toLowerCase();
}
function MM(e, t) {
  var r = e.currentStyle || document.defaultView && document.defaultView.getComputedStyle(e);
  return r ? r[t] : null;
}
var AM = ag(DM, "transition"), Ou = ag(ng, "transform"), PM = "position:absolute;display:block;border-style:solid;white-space:nowrap;z-index:9999999;" + (H.transform3dSupported ? "will-change:transform;" : "");
function LM(e) {
  return e = e === "left" ? "right" : e === "right" ? "left" : e === "top" ? "bottom" : "top", e;
}
function IM(e, t, r) {
  if (!V(r) || r === "inside")
    return "";
  var i = e.get("backgroundColor"), n = e.get("borderWidth");
  t = kn(t);
  var a = LM(r), o = Math.max(Math.round(n) * 1.5, 6), s = "", l = Ou + ":", u;
  ot(["left", "right"], a) > -1 ? (s += "top:50%", l += "translateY(-50%) rotate(" + (u = a === "left" ? -225 : -45) + "deg)") : (s += "left:50%", l += "translateX(-50%) rotate(" + (u = a === "top" ? 225 : 45) + "deg)");
  var h = u * Math.PI / 180, f = o + n, v = f * Math.abs(Math.cos(h)) + f * Math.abs(Math.sin(h)), c = Math.round(((v - Math.SQRT2 * n) / 2 + Math.SQRT2 * n - (v - f) / 2) * 100) / 100;
  s += ";" + a + ":-" + c + "px";
  var d = t + " solid " + n + "px;", _ = ["position:absolute;width:" + o + "px;height:" + o + "px;z-index:-1;", s + ";" + l + ";", "border-bottom:" + d, "border-right:" + d, "background-color:" + i + ";"];
  return '<div style="' + _.join("") + '"></div>';
}
function RM(e, t) {
  var r = "cubic-bezier(0.23,1,0.32,1)", i = " " + e / 2 + "s " + r, n = "opacity" + i + ",visibility" + i;
  return t || (i = " " + e + "s " + r, n += H.transformSupported ? "," + Ou + i : ",left" + i + ",top" + i), AM + ":" + n;
}
function Wc(e, t, r) {
  var i = e.toFixed(0) + "px", n = t.toFixed(0) + "px";
  if (!H.transformSupported)
    return r ? "top:" + n + ";left:" + i + ";" : [["top", n], ["left", i]];
  var a = H.transform3dSupported, o = "translate" + (a ? "3d" : "") + "(" + i + "," + n + (a ? ",0" : "") + ")";
  return r ? "top:0;left:0;" + Ou + ":" + o + ";" : [["top", 0], ["left", 0], [ng, o]];
}
function kM(e) {
  var t = [], r = e.get("fontSize"), i = e.getTextColor();
  i && t.push("color:" + i), t.push("font:" + e.getFont());
  var n = K(e.get("lineHeight"), Math.round(r * 3 / 2));
  r && t.push("line-height:" + n + "px");
  var a = e.get("textShadowColor"), o = e.get("textShadowBlur") || 0, s = e.get("textShadowOffsetX") || 0, l = e.get("textShadowOffsetY") || 0;
  return a && o && t.push("text-shadow:" + s + "px " + l + "px " + o + "px " + a), D(["decoration", "align"], function(u) {
    var h = e.get(u);
    h && t.push("text-" + u + ":" + h);
  }), t.join(";");
}
function EM(e, t, r) {
  var i = [], n = e.get("transitionDuration"), a = e.get("backgroundColor"), o = e.get("shadowBlur"), s = e.get("shadowColor"), l = e.get("shadowOffsetX"), u = e.get("shadowOffsetY"), h = e.getModel("textStyle"), f = ap(e, "html"), v = l + "px " + u + "px " + o + "px " + s;
  return i.push("box-shadow:" + v), t && n && i.push(RM(n, r)), a && i.push("background-color:" + a), D(["width", "color", "radius"], function(c) {
    var d = "border-" + c, _ = Pd(d), p = e.get(_);
    p != null && i.push(d + ":" + p + (c === "color" ? "" : "px"));
  }), i.push(kM(h)), f != null && i.push("padding:" + Tu(f).join("px ") + "px"), i.join(";") + ";";
}
function Yc(e, t, r, i, n) {
  var a = t && t.painter;
  if (r) {
    var o = a && a.getViewportRoot();
    o && N0(e, o, r, i, n);
  } else {
    e[0] = i, e[1] = n;
    var s = a && a.getViewportRootOffset();
    s && (e[0] += s.offsetLeft, e[1] += s.offsetTop);
  }
  e[2] = e[0] / t.getWidth(), e[3] = e[1] / t.getHeight();
}
var $M = (
  /** @class */
  (function() {
    function e(t, r) {
      if (this._show = !1, this._styleCoord = [0, 0, 0, 0], this._enterable = !0, this._alwaysShowContent = !1, this._firstShow = !0, this._longHide = !0, H.wxa)
        return null;
      var i = document.createElement("div");
      i.domBelongToZr = !0, this.el = i;
      var n = this._zr = t.getZr(), a = r.appendTo, o = a && (V(a) ? document.querySelector(a) : Dn(a) ? a : rt(a) && a(t.getDom()));
      Yc(this._styleCoord, n, o, t.getWidth() / 2, t.getHeight() / 2), (o || t.getDom()).appendChild(i), this._api = t, this._container = o;
      var s = this;
      i.onmouseenter = function() {
        s._enterable && (clearTimeout(s._hideTimeout), s._show = !0), s._inContent = !0;
      }, i.onmousemove = function(l) {
        if (l = l || window.event, !s._enterable) {
          var u = n.handler, h = n.painter.getViewportRoot();
          ee(h, l, !0), u.dispatch("mousemove", l);
        }
      }, i.onmouseleave = function() {
        s._inContent = !1, s._enterable && s._show && s.hideLater(s._hideDelay);
      };
    }
    return e.prototype.update = function(t) {
      if (!this._container) {
        var r = this._api.getDom(), i = MM(r, "position"), n = r.style;
        n.position !== "absolute" && i !== "absolute" && (n.position = "relative");
      }
      var a = t.get("alwaysShowContent");
      a && this._moveIfResized(), this._alwaysShowContent = a, this.el.className = t.get("className") || "";
    }, e.prototype.show = function(t, r) {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var i = this.el, n = i.style, a = this._styleCoord;
      i.innerHTML ? n.cssText = PM + EM(t, !this._firstShow, this._longHide) + Wc(a[0], a[1], !0) + ("border-color:" + kn(r) + ";") + (t.get("extraCssText") || "") + (";pointer-events:" + (this._enterable ? "auto" : "none")) : n.display = "none", this._show = !0, this._firstShow = !1, this._longHide = !1;
    }, e.prototype.setContent = function(t, r, i, n, a) {
      var o = this.el;
      if (t == null) {
        o.innerHTML = "";
        return;
      }
      var s = "";
      if (V(a) && i.get("trigger") === "item" && !rg(i) && (s = IM(i, n, a)), V(t))
        o.innerHTML = t + s;
      else if (t) {
        o.innerHTML = "", $(t) || (t = [t]);
        for (var l = 0; l < t.length; l++)
          Dn(t[l]) && t[l].parentNode !== o && o.appendChild(t[l]);
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
        if (Yc(i, this._zr, this._container, t, r), i[0] != null && i[1] != null) {
          var n = this.el.style, a = Wc(i[0], i[1]);
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
      r.visibility = "hidden", r.opacity = "0", H.transform3dSupported && (r.willChange = ""), this._show = !1, this._longHideTimeout = setTimeout(function() {
        return t._longHide = !0;
      }, 500);
    }, e.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(st(this.hide, this), t)) : this.hide());
    }, e.prototype.isShow = function() {
      return this._show;
    }, e.prototype.dispose = function() {
      clearTimeout(this._hideTimeout), clearTimeout(this._longHideTimeout);
      var t = this.el.parentNode;
      t && t.removeChild(this.el), this.el = this._container = null;
    }, e;
  })()
), OM = (
  /** @class */
  (function() {
    function e(t) {
      this._show = !1, this._styleCoord = [0, 0, 0, 0], this._alwaysShowContent = !1, this._enterable = !0, this._zr = t.getZr(), qc(this._styleCoord, this._zr, t.getWidth() / 2, t.getHeight() / 2);
    }
    return e.prototype.update = function(t) {
      var r = t.get("alwaysShowContent");
      r && this._moveIfResized(), this._alwaysShowContent = r;
    }, e.prototype.show = function() {
      this._hideTimeout && clearTimeout(this._hideTimeout), this.el.show(), this._show = !0;
    }, e.prototype.setContent = function(t, r, i, n, a) {
      var o = this;
      F(t) && Nt(""), this.el && this._zr.remove(this.el);
      var s = i.getModel("textStyle");
      this.el = new de({
        style: {
          rich: r.richTextStyles,
          text: t,
          lineHeight: 22,
          borderWidth: 1,
          borderColor: n,
          textShadowColor: s.get("textShadowColor"),
          fill: i.get(["textStyle", "color"]),
          padding: ap(i, "richText"),
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
      var t = this.el, r = this.el.getBoundingRect(), i = Xc(t.style);
      return [r.width + i.left + i.right, r.height + i.top + i.bottom];
    }, e.prototype.moveTo = function(t, r) {
      var i = this.el;
      if (i) {
        var n = this._styleCoord;
        qc(n, this._zr, t, r), t = n[0], r = n[1];
        var a = i.style, o = tr(a.borderWidth || 0), s = Xc(a);
        i.x = t + o + s.left, i.y = r + o + s.top, i.markRedraw();
      }
    }, e.prototype._moveIfResized = function() {
      var t = this._styleCoord[2], r = this._styleCoord[3];
      this.moveTo(t * this._zr.getWidth(), r * this._zr.getHeight());
    }, e.prototype.hide = function() {
      this.el && this.el.hide(), this._show = !1;
    }, e.prototype.hideLater = function(t) {
      this._show && !(this._inContent && this._enterable) && !this._alwaysShowContent && (t ? (this._hideDelay = t, this._show = !1, this._hideTimeout = setTimeout(st(this.hide, this), t)) : this.hide());
    }, e.prototype.isShow = function() {
      return this._show;
    }, e.prototype.dispose = function() {
      this._zr.remove(this.el);
    }, e;
  })()
);
function tr(e) {
  return Math.max(0, e);
}
function Xc(e) {
  var t = tr(e.shadowBlur || 0), r = tr(e.shadowOffsetX || 0), i = tr(e.shadowOffsetY || 0);
  return {
    left: tr(t - r),
    right: tr(t + r),
    top: tr(t - i),
    bottom: tr(t + i)
  };
}
function qc(e, t, r, i) {
  e[0] = r, e[1] = i, e[2] = e[0] / t.getWidth(), e[3] = e[1] / t.getHeight();
}
var BM = new ve({
  shape: {
    x: -1,
    y: -1,
    width: 2,
    height: 2
  }
}), NM = (
  /** @class */
  (function(e) {
    G(t, e);
    function t() {
      var r = e !== null && e.apply(this, arguments) || this;
      return r.type = t.type, r;
    }
    return t.prototype.init = function(r, i) {
      if (!(H.node || !i.getDom())) {
        var n = r.getComponent("tooltip"), a = this._renderMode = u1(n.get("renderMode"));
        this._tooltipContent = a === "richText" ? new OM(i) : new $M(i, {
          appendTo: n.get("appendToBody", !0) ? "body" : n.get("appendTo", !0)
        });
      }
    }, t.prototype.render = function(r, i, n) {
      if (!(H.node || !n.getDom())) {
        this.group.removeAll(), this._tooltipModel = r, this._ecModel = i, this._api = n;
        var a = this._tooltipContent;
        a.update(r), a.setEnterable(r.get("enterable")), this._initGlobalListener(), this._keepShow(), this._renderMode !== "richText" && r.get("transitionDuration") ? lp(this, "_updatePosition", 50, "fixRate") : Pl(this, "_updatePosition");
      }
    }, t.prototype._initGlobalListener = function() {
      var r = this._tooltipModel, i = r.get("triggerOn");
      tg("itemTooltip", this._api, st(function(n, a, o) {
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
      if (!(a.from === this.uid || H.node || !n.getDom())) {
        var o = Zc(a, n);
        this._ticket = "";
        var s = a.dataByCoordSys, l = VM(a, i, n);
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
          var h = BM;
          h.x = a.x, h.y = a.y, h.update(), ct(h).tooltipConfig = {
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
          var f = eg(a, i), v = f.point[0], c = f.point[1];
          v != null && c != null && this._tryShow({
            offsetX: v,
            offsetY: c,
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
      this._tooltipModel && o.hideLater(this._tooltipModel.get("hideDelay")), this._lastX = this._lastY = this._lastDataByCoordSys = null, a.from !== this.uid && this._hide(Zc(a, n));
    }, t.prototype._manuallyAxisShowTip = function(r, i, n, a) {
      var o = a.seriesIndex, s = a.dataIndex, l = i.getComponent("axisPointer").coordSysAxesInfo;
      if (!(o == null || s == null || l == null)) {
        var u = i.getSeriesByIndex(o);
        if (u) {
          var h = u.getData(), f = en([h.getItemModel(s), u, (u.coordinateSystem || {}).model], this._tooltipModel);
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
          var s = ct(n);
          if (s.ssrType === "legend")
            return;
          this._lastDataByCoordSys = null;
          var l, u;
          ln(n, function(h) {
            if (ct(h).dataIndex != null)
              return l = h, !0;
            if (ct(h).tooltipConfig != null)
              return u = h, !0;
          }, !0), l ? this._showSeriesItemTooltip(r, l, i) : u ? this._showComponentItemTooltip(r, u, i) : this._hide(i);
        } else
          this._lastDataByCoordSys = null, this._hide(i);
      }
    }, t.prototype._showOrMove = function(r, i) {
      var n = r.get("showDelay");
      i = st(i, this), clearTimeout(this._showTimout), n > 0 ? this._showTimout = setTimeout(i, n) : i();
    }, t.prototype._showAxisTooltip = function(r, i) {
      var n = this._ecModel, a = this._tooltipModel, o = [i.offsetX, i.offsetY], s = en([i.tooltipOption], a), l = this._renderMode, u = [], h = $n("section", {
        blocks: [],
        noHeader: !0
      }), f = [], v = new Ps();
      D(r, function(m) {
        D(m.dataByAxis, function(y) {
          var w = n.getComponent(y.axisDim + "Axis", y.axisIndex), b = y.value;
          if (!(!w || b == null)) {
            var S = jp(b, w.axis, n, y.seriesDataIndices, y.valueLabelOpt), T = $n("section", {
              header: S,
              noHeader: !Ce(S),
              sortBlocks: !0,
              blocks: []
            });
            h.blocks.push(T), D(y.seriesDataIndices, function(x) {
              var C = n.getSeriesByIndex(x.seriesIndex), M = x.dataIndexInside, A = C.getDataParams(M);
              if (!(A.dataIndex < 0)) {
                A.axisDim = y.axisDim, A.axisIndex = y.axisIndex, A.axisType = y.axisType, A.axisId = y.axisId, A.axisValue = Gp(w.axis, {
                  value: b
                }), A.axisValueLabel = S, A.marker = v.makeTooltipMarker("item", kn(A.color), l);
                var L = Of(C.formatTooltip(M, !0, null)), I = L.frag;
                if (I) {
                  var P = en([C], a).get("valueFormatter");
                  T.blocks.push(P ? R({
                    valueFormatter: P
                  }, I) : I);
                }
                L.text && f.push(L.text), u.push(A);
              }
            });
          }
        });
      }), h.blocks.reverse(), f.reverse();
      var c = i.position, d = s.get("order"), _ = Hf(h, v, l, d, n.get("useUTC"), s.get("textStyle"));
      _ && f.unshift(_);
      var p = l === "richText" ? `

` : "<br/>", g = f.join(p);
      this._showOrMove(s, function() {
        this._updateContentNotChangedOnAxis(r, u) ? this._updatePosition(s, c, o[0], o[1], this._tooltipContent, u) : this._showTooltipContent(s, g, u, Math.random() + "", o[0], o[1], c, null, v);
      });
    }, t.prototype._showSeriesItemTooltip = function(r, i, n) {
      var a = this._ecModel, o = ct(i), s = o.seriesIndex, l = a.getSeriesByIndex(s), u = o.dataModel || l, h = o.dataIndex, f = o.dataType, v = u.getData(f), c = this._renderMode, d = r.positionDefault, _ = en([v.getItemModel(h), u, l && (l.coordinateSystem || {}).model], this._tooltipModel, d ? {
        position: d
      } : null), p = _.get("trigger");
      if (!(p != null && p !== "item")) {
        var g = u.getDataParams(h, f), m = new Ps();
        g.marker = m.makeTooltipMarker("item", kn(g.color), c);
        var y = Of(u.formatTooltip(h, !1, f)), w = _.get("order"), b = _.get("valueFormatter"), S = y.frag, T = S ? Hf(b ? R({
          valueFormatter: b
        }, S) : S, m, c, w, a.get("useUTC"), _.get("textStyle")) : y.text, x = "item_" + u.name + "_" + h;
        this._showOrMove(_, function() {
          this._showTooltipContent(_, T, g, x, r.offsetX, r.offsetY, r.position, r.target, m);
        }), n({
          type: "showTip",
          dataIndexInside: h,
          dataIndex: v.getRawIndex(h),
          seriesIndex: s,
          from: this.uid
        });
      }
    }, t.prototype._showComponentItemTooltip = function(r, i, n) {
      var a = this._renderMode === "html", o = ct(i), s = o.tooltipConfig, l = s.option || {}, u = l.encodeHTMLContent;
      if (V(l)) {
        var h = l;
        l = {
          content: h,
          // Fixed formatter
          formatter: h
        }, u = !0;
      }
      u && a && l.content && (l = j(l), l.content = Ot(l.content));
      var f = [l], v = this._ecModel.getComponent(o.componentMainType, o.componentIndex);
      v && f.push(v), f.push({
        formatter: l.content
      });
      var c = r.positionDefault, d = en(f, this._tooltipModel, c ? {
        position: c
      } : null), _ = d.get("content"), p = Math.random() + "", g = new Ps();
      this._showOrMove(d, function() {
        var m = j(d.get("formatterParams") || {});
        this._showTooltipContent(d, _, m, p, r.offsetX, r.offsetY, r.position, i, g);
      }), n({
        type: "showTip",
        from: this.uid
      });
    }, t.prototype._showTooltipContent = function(r, i, n, a, o, s, l, u, h) {
      if (this._ticket = "", !(!r.get("showContent") || !r.get("show"))) {
        var f = this._tooltipContent;
        f.setEnterable(r.get("enterable"));
        var v = r.get("formatter");
        l = l || r.get("position");
        var c = i, d = this._getNearestPoint([o, s], n, r.get("trigger"), r.get("borderColor")), _ = d.color;
        if (v)
          if (V(v)) {
            var p = r.ecModel.get("useUTC"), g = $(n) ? n[0] : n, m = g && g.axisType && g.axisType.indexOf("time") >= 0;
            c = v, m && (c = Ad(g.axisValue, c, p)), c = Ld(c, n, !0);
          } else if (rt(v)) {
            var y = st(function(w, b) {
              w === this._ticket && (f.setContent(b, h, r, _, l), this._updatePosition(r, l, o, s, f, n, u));
            }, this);
            this._ticket = a, c = v(n, a, y);
          } else
            c = v;
        f.setContent(c, h, r, _, l), f.show(r, _), this._updatePosition(r, l, o, s, f, n, u);
      }
    }, t.prototype._getNearestPoint = function(r, i, n, a) {
      if (n === "axis" || $(i))
        return {
          color: a || (this._renderMode === "html" ? "#fff" : "none")
        };
      if (!$(i))
        return {
          color: a || i.color || i.borderColor
        };
    }, t.prototype._updatePosition = function(r, i, n, a, o, s, l) {
      var u = this._api.getWidth(), h = this._api.getHeight();
      i = i || r.get("position");
      var f = o.getSize(), v = r.get("align"), c = r.get("verticalAlign"), d = l && l.getBoundingRect().clone();
      if (l && d.applyTransform(l.transform), rt(i) && (i = i([n, a], s, o.el, d, {
        viewSize: [u, h],
        contentSize: f.slice()
      })), $(i))
        n = yt(i[0], u), a = yt(i[1], h);
      else if (F(i)) {
        var _ = i;
        _.width = f[0], _.height = f[1];
        var p = Rd(_, {
          width: u,
          height: h
        });
        n = p.x, a = p.y, v = null, c = null;
      } else if (V(i) && l) {
        var g = HM(i, d, f, r.get("borderWidth"));
        n = g[0], a = g[1];
      } else {
        var g = FM(n, a, o, u, h, v ? null : 20, c ? null : 20);
        n = g[0], a = g[1];
      }
      if (v && (n -= Kc(v) ? f[0] / 2 : v === "right" ? f[0] : 0), c && (a -= Kc(c) ? f[1] / 2 : c === "bottom" ? f[1] : 0), rg(r)) {
        var g = zM(n, a, o, u, h);
        n = g[0], a = g[1];
      }
      o.moveTo(n, a);
    }, t.prototype._updateContentNotChangedOnAxis = function(r, i) {
      var n = this._lastDataByCoordSys, a = this._cbParamsList, o = !!n && n.length === r.length;
      return o && D(n, function(s, l) {
        var u = s.dataByAxis || [], h = r[l] || {}, f = h.dataByAxis || [];
        o = o && u.length === f.length, o && D(u, function(v, c) {
          var d = f[c] || {}, _ = v.seriesDataIndices || [], p = d.seriesDataIndices || [];
          o = o && v.value === d.value && v.axisType === d.axisType && v.axisId === d.axisId && _.length === p.length, o && D(_, function(g, m) {
            var y = p[m];
            o = o && g.seriesIndex === y.seriesIndex && g.dataIndex === y.dataIndex;
          }), a && D(v.seriesDataIndices, function(g) {
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
      H.node || !i.getDom() || (Pl(this, "_updatePosition"), this._tooltipContent.dispose(), Nl("itemTooltip", i));
    }, t.type = "tooltip", t;
  })(fr)
);
function en(e, t, r) {
  var i = t.ecModel, n;
  r ? (n = new vt(r, i, i), n = new vt(t.option, n, i)) : n = t;
  for (var a = e.length - 1; a >= 0; a--) {
    var o = e[a];
    o && (o instanceof vt && (o = o.get("tooltip", !0)), V(o) && (o = {
      formatter: o
    }), o && (n = new vt(o, n, i)));
  }
  return n;
}
function Zc(e, t) {
  return e.dispatchAction || st(t.dispatchAction, t);
}
function FM(e, t, r, i, n, a, o) {
  var s = r.getSize(), l = s[0], u = s[1];
  return a != null && (e + l + a + 2 > i ? e -= l + a : e += a), o != null && (t + u + o > n ? t -= u + o : t += o), [e, t];
}
function zM(e, t, r, i, n) {
  var a = r.getSize(), o = a[0], s = a[1];
  return e = Math.min(e + o, i) - o, t = Math.min(t + s, n) - s, e = Math.max(e, 0), t = Math.max(t, 0), [e, t];
}
function HM(e, t, r, i) {
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
function Kc(e) {
  return e === "center" || e === "middle";
}
function VM(e, t, r) {
  var i = iu(e).queryOptionMap, n = i.keys()[0];
  if (!(!n || n === "series")) {
    var a = Gn(t, n, i.get(n), {
      useDefault: !1,
      enableAll: !1,
      enableNone: !1
    }), o = a.models[0];
    if (o) {
      var s = r.getViewOfComponentModel(o), l;
      if (s.group.traverse(function(u) {
        var h = ct(u).tooltipConfig;
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
function UM(e) {
  Eu(xM), e.registerComponentModel(CM), e.registerComponentView(NM), e.registerAction({
    type: "showTip",
    event: "showTip",
    update: "tooltip:manuallyShowTip"
  }, zt), e.registerAction({
    type: "hideTip",
    event: "hideTip",
    update: "tooltip:manuallyHideTip"
  }, zt);
}
var GM = Object.defineProperty, WM = Object.getOwnPropertyDescriptor, Bu = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? WM(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && GM(t, r, n), n;
};
Eu([$D, UM, JD]);
let Fn = class extends Fe {
  constructor() {
    super(...arguments), this.items = [], this.language = "en";
  }
  firstUpdated() {
    const e = this.renderRoot.querySelector(".chart");
    e && (this.chart = HC(e, void 0, { renderer: "canvas" }), this.resizeObserver = new ResizeObserver(() => this.chart?.resize()), this.resizeObserver.observe(e), this.updateChart());
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
    return O`<div class="chart" role="presentation"></div>`;
  }
};
Fn.styles = po`
    :host { display: block; width: 100%; height: 100%; min-width: 0; min-height: 0; }
    .chart { width: 100%; height: 100%; min-height: 0; }
  `;
Bu([
  Wr({ attribute: !1 })
], Fn.prototype, "items", 2);
Bu([
  Wr()
], Fn.prototype, "language", 2);
Fn = Bu([
  Ai("ploc-cellar-donut-chart")
], Fn);
var YM = Object.defineProperty, XM = Object.getOwnPropertyDescriptor, cr = (e, t, r, i) => {
  for (var n = i > 1 ? void 0 : i ? XM(t, r) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (n = (i ? o(t, r, n) : o(n)) || n);
  return i && n && YM(t, r, n), n;
};
const Qc = [
  "#D55E00",
  "#0072B2",
  "#009E73",
  "#E69F00",
  "#CC79A7",
  "#56B4E9",
  "#F0E442",
  "#6A3D9A"
];
let Le = class extends Fe {
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
    if (!e) return Xt(this.hass?.language ?? "en", "never");
    const t = new Date(e);
    return Number.isNaN(t.getTime()) ? e : new Intl.DateTimeFormat(this.hass?.language ?? void 0, {
      dateStyle: "short",
      timeStyle: "short"
    }).format(t);
  }
  metric(e, t) {
    return O`
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
    const t = (o) => Xt(this.hass?.language ?? "en", o), r = /* @__PURE__ */ new Map();
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
    const r = (s) => Xt(this.hass?.language ?? "en", s), i = this.distribution(e), n = i.reduce((s, l) => s + l.bottles, 0), a = i.filter((s) => s.bottles > 0).map((s, l) => ({
      ...s,
      color: s.color ?? Qc[l % Qc.length]
    })), o = i.map((s) => `${s.name}: ${this.formatNumber(s.bottles)}`).join(", ");
    return O`
      <section class="group">
        <h3 class="group-title">${r(t)}</h3>
        ${n > 0 ? O`
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
            ${this.config?.show_statistics_legends === !1 ? N : O`
              <div class="legend">
                ${a.map((s) => O`
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
        ` : O`<p class="muted">${r("statistics_empty")}</p>`}
      </section>
    `;
  }
  getDiagnosticWines(e) {
    const t = e === "unlocated" ? "unlocated_bottles" : e === "negative" ? "negative_movement_bottles" : "physical_surplus_bottles";
    return (this.inventory?.wine_diagnostics ?? []).filter((r) => (r[t] ?? 0) > 0).sort((r, i) => (i[t] ?? 0) - (r[t] ?? 0) || r.name.localeCompare(i.name, this.hass?.language));
  }
  renderDiagnosticDialog() {
    const e = this.activeDiagnostic;
    if (!e) return N;
    const t = e === "unlocated" ? "diagnostic_unlocated" : e === "negative" ? "diagnostic_negative" : "diagnostic_surplus", r = e === "unlocated" ? "diagnostic_detail_unlocated" : e === "negative" ? "diagnostic_detail_negative" : "diagnostic_detail_surplus", i = this.getDiagnosticWines(e), n = (o) => Xt(this.hass?.language ?? "en", o), a = (o) => e === "unlocated" ? o.unlocated_bottles ?? 0 : e === "negative" ? o.negative_movement_bottles ?? 0 : o.physical_surplus_bottles ?? 0;
    return O`
      <ha-dialog .open=${!0} .heading=${n(t)} @closed=${() => {
      this.activeDiagnostic = void 0;
    }}>
        <div class="diagnostic-detail-list">
          <p class="muted">${n(r)}</p>
          ${i.length ? i.map((o) => O`
            <section class="diagnostic-detail-item">
              <h4 class="diagnostic-detail-name">${o.name}${o.vintage ? ` · ${o.vintage}` : ""}</h4>
              <dl class="diagnostic-detail-meta">
                <div><dt>${n("diagnostic_detail_quantity")}</dt><dd>${this.formatNumber(a(o))}</dd></div>
                <div><dt>${n("diagnostic_detail_in_cellar")}</dt><dd>${this.formatNumber(o.bottles_in_cellar)}</dd></div>
                <div><dt>${n("diagnostic_detail_stock")}</dt><dd>${this.formatNumber(o.effective_stock)}</dd></div>
                ${e === "negative" ? O`
                  <div><dt>${n("diagnostic_detail_purchased")}</dt><dd>${this.formatNumber(o.purchased ?? 0)}</dd></div>
                  <div><dt>${n("diagnostic_detail_consumed")}</dt><dd>${this.formatNumber(o.consumed ?? 0)}</dd></div>
                  <div><dt>${n("diagnostic_detail_balance")}</dt><dd>${this.formatNumber(o.movement_balance ?? 0)}</dd></div>
                ` : N}
              </dl>
            </section>
          `) : O`<p class="muted">${n("diagnostic_detail_empty")}</p>`}
        </div>
      </ha-dialog>
    `;
  }
  render() {
    const e = (f) => Xt(this.hass?.language ?? "en", f), t = this.inventory, r = this.config?.title ?? e("card_title"), i = this.config?.show_occupancy !== !1, n = this.config?.show_diagnostics !== !1, a = this.config?.show_statistics !== !1, o = t && t.total_positions > 0 ? Math.round(t.occupied_positions / t.total_positions * 100) : 0, s = t?.stock_reconstruction_complete ? [
      { key: "diagnostic_unlocated", value: t.unlocated_bottles ?? 0 },
      { key: "diagnostic_negative", value: t.negative_movement_bottles ?? 0 },
      { key: "diagnostic_surplus", value: t.physical_surplus_bottles ?? 0 }
    ].filter((f) => f.value > 0) : [], l = !!(t && (!t.stock_reconstruction_complete || s.length > 0 || t.positions_with_unknown_wine > 0)), u = t?.wines ?? [], h = t?.wine_references ?? u.length;
    return O`
      <ha-card>
        <header>
          <h2>${r}</h2>
          <button ?disabled=${this.loading} @click=${() => this.refresh()}>
            ${this.loading ? e("loading") : e("refresh")}
          </button>
        </header>
        ${this.error ? O`<div class="error">${this.error}</div>` : N}
        ${this.config?.config_entry_id ? N : O`<div class="muted">${e("select_config")}</div>`}
        ${t ? O`
          ${t.stale ? O`<div class="warning">${e("stale")}</div>` : N}
          <div class="summary">
            ${this.metric(t.total_bottles, e("bottles_in_cellar"))}
            ${this.metric(
      t.total_stock_bottles ?? e("unknown_value"),
      e("reconstructed_stock")
    )}
            ${this.metric(h, e("stocked_references"))}
            ${this.metric(t.rack_count, e("racks"))}
          </div>
          ${i ? O`
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
          ` : N}
          ${n && l ? O`
            <section class="section">
              <h3 class="section-title">${e("inventory_diagnostics")}</h3>
              ${t.stock_reconstruction_complete ? N : O`<div class="warning">${e("reconstruction_incomplete")}</div>`}
              ${s.length ? O`
                <div class="diagnostics">
                  ${s.map((f) => {
      const v = f.key === "diagnostic_unlocated" ? "unlocated" : f.key === "diagnostic_negative" ? "negative" : "surplus";
      return O`
                      <button class="diagnostic" type="button" aria-haspopup="dialog"
                        @click=${() => {
        this.activeDiagnostic = v;
      }}>
                        <span class="diagnostic-value">${this.formatNumber(f.value)}</span>
                        <span class="label">${e(f.key)}</span>
                        <span class="diagnostic-hint">${e("diagnostic_detail_open")}</span>
                      </button>
                    `;
    })}
                </div>
              ` : N}
              ${t.positions_with_unknown_wine > 0 ? O`<div class="warning">${e("statistics_unknown_wine_positions").replace("{count}", this.formatNumber(t.positions_with_unknown_wine))}</div>` : N}
            </section>
          ` : N}
          ${a ? O`
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
          ` : N}
          <div class="muted section">${e("last_sync")}: ${this.formatSync(t.last_sync)}</div>
          ${this.renderDiagnosticDialog()}
        ` : N}
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
Le.styles = po`
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
cr([
  Wr({ attribute: !1 })
], Le.prototype, "hass", 2);
cr([
  pt()
], Le.prototype, "config", 2);
cr([
  pt()
], Le.prototype, "inventory", 2);
cr([
  pt()
], Le.prototype, "loading", 2);
cr([
  pt()
], Le.prototype, "error", 2);
cr([
  pt()
], Le.prototype, "activeDiagnostic", 2);
Le = cr([
  Ai("ploc-cellar-card")
], Le);
let jc = class extends Le {
};
jc = cr([
  Ai("ploc-cellar-statistics-card")
], jc);
window.customCards ??= [];
window.customCards.push({
  type: "ploc-cellar-card",
  name: xi("picker_overview_name"),
  description: xi("picker_overview_description")
});
export {
  Le as PlocCellarCard,
  jc as PlocCellarStatisticsCard
};
