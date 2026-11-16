/* menu-sekmeli-fiyat — Menü Sekmeli Fiyat — kategori sekmeleri, noktalı fiyat satırları, seçim özeti (16 Kas 2026 · mcp:webmaker/20261116-113510-tlwf · D17).
   Üstte etiket, başlık ve metin; altında kayıtların `kategori` alanından türeyen sekmeler, her sekmede ürün adı · noktalı çizgi · fiyat satırları (rozet, açıklama). Satırdaki «+» ürünü yan paneldeki seçim özetine ekler: adet, satır tutarı, toplam (sayfa dilinde para biçimi), «−» ile azaltma. Ödeme/sipariş yok — masada hatırlatma listesi. JS yokken tüm kategoriler başlıklı gruplar hâlinde alt alta.
   Üretici: scripts/modul-fabrika (aile module) — elle düzenleme yerine tanımı değiştirip yeniden üret.
   Veri: desing: ust · baslik · metin · img · img2 · cta_ad/cta_url · cta2_ad/cta2_url; data (maddeler): [{ ikon?, baslik, metin?, url? }] — metinler dil sözlüğü. */
const P = "modulex-menu-sekmeli-fiyat";
const IMG_KOK = `/img/${json.id}/`;
/* --- ortak ön ek (scripts/modul-fabrika/on-ek.js) — dil · güvenlik · sayı yardımcıları --- */
const pick = (v) => {
  if (v == null) return "";
  if (typeof v !== "object") return String(v);
  if (typeof wmPickLang === "function") { try { return wmPickLang(v, json.lang) || ""; } catch (e) { /* alt satır */ } }
  return String(v[json.lang] ?? Object.values(v)[0] ?? "");
};
const esc = (s) => String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const medyaUrl = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|file):/i.test(s)) return "";
  if (/^data:/i.test(s)) return /^data:(image|video|audio)\//i.test(s) ? s : "";
  if (s.startsWith("/") || /^https?:\/\//i.test(s)) return s;
  return `${IMG_KOK}${s}`;
};
const href = (v) => {
  const s = String(v ?? "").trim();
  if (!s || /^\s*(javascript|vbscript|data):/i.test(s)) return "";
  if (/^(https?:)?\/\//i.test(s) || /^(mailto:|tel:|#)/i.test(s)) return s;
  return wxLangInternalHref(s);
};
const dogru = (v, d) => (v === undefined || v === null || v === "") ? d : !(v === false || v === "false" || v === 0 || v === "0");
const ikonAd = (v) => String(v ?? "").trim().replace(/[^a-z0-9_]/gi, "");
const satirlar = (s) => esc(s).replace(/\r?\n/g, "<br />");
/* ilk dolu alan: yeni ad önce, eski kuşak şablonun adı yedek (G6 yalnız path değiştirerek takas eder) */
const ilk = (o, ks) => {
  for (const k of ks) {
    const v = o == null ? undefined : o[k];
    if (v == null || v === "") continue;
    if (typeof v === "object" && !Array.isArray(v) && !Object.keys(v).length) continue;
    return v;
  }
  return "";
};
const metinAl = (o, ks) => pick(ilk(o, ks)).trim();
const { desing: des = {} } = json;
const setting = webmakerdata?.setting ?? {};
const veri = Array.isArray(json.data) ? json.data : [];
const dil = String(json.lang || "");
const sayiBicim = (v, ondalik) => {
  try { return new Intl.NumberFormat(dil || undefined, { minimumFractionDigits: ondalik, maximumFractionDigits: ondalik }).format(v); } catch (e) { return String(v); }
};
const ikonH = (ad, sinif) => (ad ? `<span class="${sinif} material-symbols-outlined" aria-hidden="true">${ad}</span>` : "");
const no = (i) => String(i + 1).padStart(2, "0");
const ctaHtml = () => {
  const a1 = metinAl(des, ["cta_ad", "button"]); const u1 = href(ilk(des, ["cta_url", "buttonurl", "url"]));
  const a2 = metinAl(des, ["cta2_ad"]); const u2 = href(ilk(des, ["cta2_url"]));
  const d = (a, u, ek) => (a && u ? `<a class="${P}-dugme${ek}" href="${esc(u)}">${esc(a)}<span class="material-symbols-outlined mx-flip" aria-hidden="true">arrow_forward</span></a>` : "");
  const ic = d(a1, u1, "") + d(a2, u2, ` ${P}-dugme--ikincil`);
  return ic ? `<div class="${P}-cta">${ic}</div>` : "";
};
const basHtml = (B, ek) => {
  if (!B.ust && !B.baslik && !B.metin && !ek) return "";
  return `<header class="${P}-bas">`
    + (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "")
    + (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "")
    + (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "")
    + (ek || "")
    + "</header>";
};
/* --- aile: module --- */
const yeniMadde = veri.map((o) => ({
  ikon: ikonAd(ilk(o, ["ikon", "icon"])), baslik: metinAl(o, ["baslik", "name", "title"]),
  metin: metinAl(o, ["metin", "text", "description", "spot"]), url: href(ilk(o, ["url", "link"])),
})).filter((k) => k.baslik);
/* module-1 eski şeması: name2/spot2/icon2 … name4 → madde */
const eskiMadde = [2, 3, 4].map((n) => ({ ikon: ikonAd(des["icon" + n]), baslik: metinAl(des, ["name" + n]), metin: metinAl(des, ["spot" + n]), url: "" })).filter((k) => k.baslik);
const kayitlar = yeniMadde.length ? yeniMadde : eskiMadde;
const G1 = medyaUrl(ilk(des, ["img", "image"]));
const G2 = medyaUrl(ilk(des, ["img2", "image2"]));
const gH = (src, s, w, h) => (src ? `<img class="${P}-${s}" src="${esc(src)}" alt="" width="${w || 1200}" height="${h || 900}" loading="lazy" decoding="async" />` : "");
const ustH = (B) => (B.ust ? `<p class="${P}-ust">${esc(B.ust)}</p>` : "");
const basH = (B) => (B.baslik ? `<h2 class="${P}-baslik" id="${P}-{{id}}-b">${esc(B.baslik)}</h2>` : "");
const metH = (B) => (B.metin ? `<p class="${P}-metin">${satirlar(B.metin)}</p>` : "");
const listeH = (ic) => (ic ? `<ul class="${P}-maddeler" role="list">${ic}</ul>` : "");
const maddeVar = (k, i) => `<li class="${P}-madde">${ikonH(k.ikon || "check_circle", `${P}-mikon`)}<div class="${P}-myazi"><h3 class="${P}-mbaslik">${k.url ? `<a class="${P}-bag" href="${esc(k.url)}">${esc(k.baslik)}</a>` : esc(k.baslik)}</h3>${k.metin ? `<p class="${P}-mmetin">${satirlar(k.metin)}</p>` : ""}</div></li>`;
/* --- modül: menu-sekmeli-fiyat --- */
const kart = () => "";
const sar = (ic, A, B) => {
    const R = yeniMadde.length ? veri.filter((o) => metinAl(o, ["baslik", "name", "title"])) : [];
    const x = (i, ks) => metinAl(R[i] || {}, ks);
    const sy = (i, ks) => {
      const v = ilk(R[i] || {}, ks);
      if (typeof v === "number") return v;
      let t = pick(v).replace(/[^\d.,]/g, "");
      t = /,\d{1,2}$/.test(t) ? t.replace(/\./g, "").replace(",", ".") : t.replace(/[.,](?=\d{3}(\D|$))/g, "").replace(",", ".");
      const n = t ? Number(t) : NaN;
      return Number.isFinite(n) ? n : NaN;
    };
    const PB = /^[A-Za-z]{3}$/.test(metinAl(des, ["paraBirimi"])) ? metinAl(des, ["paraBirimi"]).toUpperCase() : "";
    const para = (v) => { try { return new Intl.NumberFormat(dil || undefined, PB ? { style: "currency", currency: PB, maximumFractionDigits: v % 1 ? 2 : 0 } : { maximumFractionDigits: 2 }).format(v); } catch (e) { return String(v); } };
    const G = [];
    const gi = {};
    A.forEach((k, i) => { const kat = x(i, ["kategori", "category", "grup"]); if (!(kat in gi)) { gi[kat] = G.length; G.push({ ad: kat, L: [] }); } G[gi[kat]].L.push(i); });
    /* kategorisiz satırlar, kategorili gruplar varsa ilk adlı gruba katılır */
    if ("" in gi && G.length > 1) { const bos = G.splice(gi[""], 1)[0]; G[0].L = G[0].L.concat(bos.L); }
    const sekmeli = G.length > 1;
    const satir = (i) => {
      const k = A[i];
      const f = sy(i, ["fiyat", "price"]);
      const fm = Number.isFinite(f) ? para(f) : x(i, ["fiyat", "price"]);
      const rz = x(i, ["rozet", "badge", "etiket"]);
      return `<li class="${P}-satir" data-urun data-ad="${esc(k.baslik)}"${Number.isFinite(f) ? ` data-fiyat="${f}"` : ""}><div class="${P}-urun">${ikonH(k.ikon, `${P}-uikon`)}<h4 class="${P}-uad">${esc(k.baslik)}</h4>${rz ? `<span class="${P}-rozet">${esc(rz)}</span>` : ""}</div><span class="${P}-nokta" aria-hidden="true"></span>${fm ? `<span class="${P}-fiyat"><bdi>${esc(fm)}</bdi></span>` : `<span></span>`}<button type="button" class="${P}-ekle" data-ekle aria-pressed="false" hidden><span class="material-symbols-outlined" aria-hidden="true">add</span><span class="${P}-adet" data-adet aria-hidden="true"></span><span class="${P}-gizli">+ ${esc(k.baslik)}</span></button>${k.metin ? `<p class="${P}-acik">${satirlar(k.metin)}</p>` : ""}</li>`;
    };
    const sekmeler = sekmeli ? `<div class="${P}-sekmeler" role="tablist" aria-label="${esc(metinAl(des, ["sekmeAd"]) || "@category@")}">${G.map((g, j) => `<button type="button" role="tab" class="${P}-sekme" id="${P}-{{id}}-s${j}" aria-controls="${P}-{{id}}-g${j}" aria-selected="${j === 0}"${j ? ' tabindex="-1"' : ""} data-sekme="${j}">${esc(g.ad)}</button>`).join("")}</div>` : "";
    const gruplar = `<div class="${P}-gruplar">${G.map((g, j) => `<section class="${P}-grup" id="${P}-{{id}}-g${j}" data-grup="${j}"${sekmeli ? ` role="tabpanel" aria-labelledby="${P}-{{id}}-s${j}"` : ""}>${g.ad ? `<h3 class="${P}-gad">${esc(g.ad)}</h3>` : ""}<ul class="${P}-satirlar" role="list">${g.L.map(satir).join("")}</ul></section>`).join("")}</div>`;
    const not = metinAl(des, ["secimNot"]);
    const ozet = `<aside class="${P}-secim" data-secim hidden aria-labelledby="${P}-{{id}}-sb"><h3 class="${P}-sbaslik" id="${P}-{{id}}-sb"><span class="material-symbols-outlined" aria-hidden="true">receipt_long</span>${esc(metinAl(des, ["secimAd"]) || "@booking-summary@")}</h3>${metinAl(des, ["secimBos"]) ? `<p class="${P}-sbos" data-sbos>${esc(metinAl(des, ["secimBos"]))}</p>` : ""}<ol class="${P}-sliste" data-sliste role="list"></ol><p class="${P}-toplam"><span>@total@</span><strong data-toplam aria-live="polite">—</strong></p>${not ? `<p class="${P}-snot">${esc(not)}</p>` : ""}<button type="button" class="${P}-temizle" data-temizle hidden>${esc(metinAl(des, ["temizleAd"]) || "@delete-selected-products@")}</button></aside>`;
    return `<div class="${P}-menu" data-menu data-para="${PB}"><div class="${P}-ana"><div class="${P}-giris">${ustH(B)}${basH(B)}${metH(B)}</div>${sekmeler}${gruplar}${ctaHtml()}</div>${ozet}</div>`;
  };
const B = { ust: metinAl(des, ["ust","title","badge"]), baslik: metinAl(des, ["baslik","name"]), metin: metinAl(des, ["metin","description"]) };
/* veri yoksa gövde hiç kurulmaz (sarmalayıcı boş listeye dokunmaz) */
const BOS = !B.baslik && !B.metin;
const govde = BOS ? "" : sar(kayitlar.map((k, i) => kart(k, i, kayitlar.length, kayitlar)).join(""), kayitlar, B);
const bas = "";
const sinif = (bas || B.ust || B.baslik || B.metin ? "" : ` ${P}--bassiz`);
html = html
  .replaceAll("{{fbsinif}}", () => sinif)
  .replaceAll("{{fbetiket}}", () => (B.baslik ? `aria-labelledby="${P}-{{id}}-b"` : ""))
  .replaceAll("{{fbbas}}", () => bas)
  .replaceAll("{{fbgovde}}", () => govde);
if (BOS) html = "";
