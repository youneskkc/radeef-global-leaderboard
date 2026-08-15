/* اتجاه التصميم: أرشيف الورق المعاصر. واجهة تحريرية عربية هادئة، عاجية وحبرية، مع قرمزي رديف كنقطة تركيز. */
import { useMemo, useState } from "react";
import { ArrowUpLeft, ExternalLink, Info, RefreshCw, Search, Sparkles } from "lucide-react";
import rankings from "@/data/rankings.json";

const globalContext = rankings.globalContext;
const sites = rankings.sites;

type Site = (typeof sites)[number];

const formatNumber = (value: number | null) => value === null ? "غير متاح" : new Intl.NumberFormat("ar-EG").format(value);
const formatScore = (value: number | null) => value === null ? "—" : value.toFixed(2);

function percentile(site: Site) {
  if (!site.rank || site.rankUniverse !== "domains") return null;
  return ((site.rank / globalContext.oprDomainUniverse) * 100).toFixed(2);
}

function medal(position: number) {
  if (position === 1) return "🥇";
  if (position === 2) return "🥈";
  if (position === 3) return "🥉";
  return null;
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [showUnranked, setShowUnranked] = useState(true);
  const [sort, setSort] = useState<"rank" | "score">("rank");

  const filtered = useMemo(() => {
    return sites
      .filter((site) => showUnranked || site.score !== null)
      .filter((site) => `${site.name} ${site.domain}`.toLowerCase().includes(query.toLowerCase()))
      .sort((a, b) => sort === "score" ? (b.score ?? -1) - (a.score ?? -1) : a.position - b.position);
  }, [query, showUnranked, sort]);

  const rankedCount = sites.filter((site) => site.score !== null).length;
  const topThree = sites.slice(0, 3);

  return (
    <main dir="rtl" className="min-h-screen overflow-hidden bg-[#f4f0e8] text-[#16283a]">
      <div className="paper-grain" aria-hidden="true" />
      <header className="relative z-10 border-b border-[#16283a]/15">
        <div className="mx-auto flex max-w-[1240px] items-center justify-between px-5 py-5 lg:px-10">
          <a href="#top" className="flex items-center gap-3" aria-label="ترتيب مدونات آل رديف، إلى الأعلى">
            <span className="brand-mark"><img src="/manus-storage/radeef-mark_425cd7af.png" alt="" /></span>
            <span className="brand-wordmark"><strong>رديف</strong><small>أرشيف الأثر الرقمي</small></span>
          </a>
          <a href="#method" className="hidden items-center gap-2 text-xs font-semibold text-[#16283a]/70 transition hover:text-[#b4473d] sm:flex">
            كيف نقرأ الرقم <ArrowUpLeft size={15} />
          </a>
        </div>
      </header>

      <section id="top" className="relative z-10 mx-auto max-w-[1240px] px-5 pb-16 pt-14 lg:px-10 lg:pb-24 lg:pt-24">
        <div className="grid items-end gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div className="max-w-[760px]">
            <p className="mb-6 flex items-center gap-3 text-xs font-bold tracking-[0.18em] text-[#b4473d]"><span className="h-px w-10 bg-[#b4473d]" /> قراءة رقمية / 2026</p>
            <h1 className="font-display text-5xl font-black leading-[1.08] tracking-[-0.04em] text-[#16283a] sm:text-6xl lg:text-8xl">ترتيب مدونات<br /><em className="text-[#b4473d]">آل رديف</em> العالمي</h1>
            <p className="mt-8 max-w-xl text-lg leading-9 text-[#16283a]/70">الأثر لا يُقاس بالصوت الأعلى، بل بالروابط التي بقيت. لوحة تقرأ حضور مدونات مجتمع رديف في الويب المفتوح.</p>
          </div>
          <aside className="border-t border-[#16283a]/25 pt-5 lg:mb-2">
            <div className="flex items-center justify-between text-xs font-bold tracking-[0.14em] text-[#16283a]/65"><span>الحالة</span><span className="status-dot">البيانات الحالية</span></div>
            <p className="mt-7 text-5xl font-black tracking-[-0.04em]">{formatNumber(rankedCount)}<span className="mr-2 text-base font-semibold text-[#16283a]/55">من {formatNumber(sites.length)} مدونة</span></p>
            <p className="mt-3 text-sm leading-7 text-[#16283a]/60">آخر إصدار للبيانات: {rankings.asOf}. تتجدد القراءة آليًا عند نشر ملف البيانات الجديد.</p>
          </aside>
        </div>
      </section>

      <section className="relative z-10 border-y border-[#16283a]/15 bg-[#ebe4d7]/70">
        <div className="mx-auto grid max-w-[1240px] gap-px px-5 py-5 sm:grid-cols-3 lg:px-10">
          <Stat label="مواقع لها ترتيب" value={`${rankedCount} / ${sites.length}`} note="في إصدار OpenPageRank الحالي" />
          <Stat label="نطاقات الويب عالميًا" value={formatNumber(globalContext.netcraftDomains)} note="رصد Netcraft، يونيو 2026" />
          <Stat label="مواقع الويب المرصودة" value={formatNumber(globalContext.netcraftSites)} note="السياق العالمي لا يساوي مقام OPR" />
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1240px] px-5 py-16 lg:px-10 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-6 border-b border-[#16283a]/20 pb-6 sm:flex-row sm:items-end">
          <div><p className="eyebrow">المراكز الثلاثة الأولى</p><h2 className="mt-3 font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">الواجهة الأولى للأثر</h2></div>
          <p className="max-w-sm text-sm leading-7 text-[#16283a]/60">درجة OpenPageRank تقيس قوة ملف الروابط. أما ترتيب المضيف الفرعي فيُقرأ ضمن رسم المضيفين الخاص بالخدمة.</p>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {topThree.map((site, index) => <TopCard key={site.domain} site={site} position={index + 1} />)}
        </div>
      </section>

      <section className="relative z-10 mx-auto max-w-[1240px] px-5 pb-20 lg:px-10 lg:pb-32">
        <div className="mb-8 flex flex-col gap-5 border-b border-[#16283a]/20 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div><p className="eyebrow">القائمة الكاملة</p><h2 className="mt-3 font-display text-3xl font-black tracking-[-0.03em] sm:text-4xl">كل المدونات، في سطر واحد</h2></div>
          <div className="flex flex-wrap items-center gap-3">
            <label className="search-box"><Search size={15} /><span>بحث</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="اسم أو نطاق" aria-label="ابحث في المدونات" /></label>
            <label className="reading-tool">عرض <select value={sort} onChange={(e) => setSort(e.target.value as "rank" | "score")} aria-label="ترتيب النتائج"><option value="rank">الترتيب الحالي</option><option value="score">الدرجة الأعلى</option></select></label>
            <button className={`reading-tool ${!showUnranked ? "control-active" : ""}`} onClick={() => setShowUnranked((value) => !value)}>{showUnranked ? "كل السجلات" : "المصنفة فقط"}</button>
          </div>
        </div>
        <div className="overflow-hidden border-y border-[#16283a]/20">
          <div className="hidden grid-cols-[72px_minmax(240px,1fr)_190px_150px_180px] gap-4 px-5 py-4 text-[11px] font-bold tracking-[0.12em] text-[#16283a]/50 md:grid"><span>المركز</span><span>المدونة</span><span>النطاق</span><span>درجة OPR</span><span>المقارنة</span></div>
          {filtered.map((site) => <RankRow key={site.domain} site={site} />)}
        </div>
        {filtered.length === 0 && <div className="py-16 text-center text-[#16283a]/60">لا توجد مدونة تطابق بحثك.</div>}
      </section>

      <section id="method" className="relative z-10 border-t border-[#16283a]/15 bg-[#16283a] text-[#f4f0e8]">
        <div className="mx-auto grid max-w-[1240px] gap-12 px-5 py-16 lg:grid-cols-[1fr_1.3fr] lg:px-10 lg:py-24">
          <div><p className="eyebrow text-[#d87a6f]">ملاحظة منهجية</p><h2 className="mt-4 font-display text-3xl font-black leading-tight sm:text-4xl">ما الذي يعنيه<br />هذا الترتيب؟</h2></div>
          <div className="space-y-5 text-sm leading-8 text-[#f4f0e8]/70"><p>الترتيب الأساسي مأخوذ من OpenPageRank، مع الحفاظ على النطاقات الفرعية عندما ترجع لها الخدمة سجلًا مستقلًا. لا تُمنح المواقع التي بلا بيانات درجة صفر، بل تُعرض باعتبارها غير مصنفة في إصدار البيانات الحالي.</p><p>للسياق فقط، يرصد Netcraft في يونيو 2026 أكثر من {formatNumber(globalContext.netcraftDomains)} نطاقًا و{formatNumber(globalContext.netcraftSites)} موقعًا. هذا الرقم ليس مقامًا مباشرًا لترتيب OpenPageRank، لأن لكل خدمة تعريفًا مختلفًا للموقع والنطاق.</p><div className="flex flex-wrap gap-3 pt-4"><a className="source-link" href="https://www.domcop.com/openpagerank/documentation" target="_blank" rel="noreferrer">توثيق OpenPageRank <ExternalLink size={14} /></a><a className="source-link" href="https://www.netcraft.com/blog/june-2026-web-server-survey" target="_blank" rel="noreferrer">تقرير Netcraft <ExternalLink size={14} /></a></div></div>
        </div>
      </section>
      <footer className="relative z-10 bg-[#16283a] px-5 pb-8 text-xs text-[#f4f0e8]/45 lg:px-10"><div className="mx-auto flex max-w-[1240px] justify-between border-t border-[#f4f0e8]/15 pt-5"><span>ترتيب مدونات آل رديف العالمي</span><span>تحديث آلي / {rankings.asOf}</span></div></footer>
    </main>
  );
}

function Stat({ label, value, note }: { label: string; value: string; note: string }) { return <div className="px-1 py-4 sm:px-5"><p className="text-xs font-bold text-[#16283a]/55">{label}</p><p className="mt-2 text-2xl font-black tracking-[-0.03em]">{value}</p><p className="mt-1 text-xs text-[#16283a]/50">{note}</p></div>; }

function TopCard({ site, position }: { site: Site; position: number }) { return <a href={site.url} target="_blank" rel="noreferrer" className={`top-card top-card-${position} ${position === 1 ? "top-card-lead" : ""}`}><div className="flex items-start justify-between"><span className="medal">{medal(position)}</span><span className="rank-number">0{position}</span></div><div className="mt-14"><p className="text-xs font-bold tracking-[0.12em] text-[#b4473d]">{site.score === null ? "غير مصنف" : `OPR ${formatScore(site.score)}`}</p><h3 className="mt-3 font-display text-2xl font-black leading-tight">{site.name}</h3><p className="mt-2 break-all text-sm text-[#16283a]/55">{site.domain}</p></div><div className="mt-8 flex items-center justify-between border-t border-current/15 pt-4 text-xs text-[#16283a]/60"><span>{site.rank ? `ترتيب ${formatNumber(site.rank)}` : "لا يوجد سجل مضيف"}</span><ExternalLink size={15} /></div></a>; }

function RankRow({ site }: { site: Site }) { const pct = percentile(site); return <div className="rank-row"><div className="rank-cell font-display text-2xl font-black text-[#b4473d]">{site.position < 10 ? `0${site.position}` : site.position}</div><div className="min-w-0"><div className="flex items-center gap-2"><a href={site.url} target="_blank" rel="noreferrer" className="truncate text-base font-bold transition hover:text-[#b4473d]">{site.name}</a>{site.score === null && <span className="unranked-tag">غير مصنف</span>}</div><p className="mt-1 truncate text-xs text-[#16283a]/50">{site.description}</p></div><a href={site.url} target="_blank" rel="noreferrer" className="domain-link"><span className="truncate">{site.domain}</span><ExternalLink size={13} /></a><div className="score-cell">{formatScore(site.score)}</div><div className="text-xs text-[#16283a]/60">{site.rank ? <>{formatNumber(site.rank)}<span className="mr-1 text-[10px]">{pct ? ` / أفضل ${pct}% تقريبًا` : " / مضيفون"}</span></> : <span className="inline-flex items-center gap-1"><Info size={13} /> لا توجد بيانات</span>}</div></div>; }
