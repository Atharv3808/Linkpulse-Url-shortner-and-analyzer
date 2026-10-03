import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { LandingNav } from "./components/LandingNav";
import { LandingFooter } from "./components/LandingFooter";
import { SectionLabel } from "./components/SectionLabel";
import { TypographicListItem } from "./components/TypographicListItem";
import { ProductPreviewFrame } from "./components/ProductPreviewFrame";

export function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    document.title = "LinkPulse — Turn Every Click Into Intelligence";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Create short links, track every meaningful click, and understand the traffic behind your links with LinkPulse."
      );
    }
  }, []);

  const handleCtaClick = () => {
    if (isAuthenticated) {
      navigate("/app/dashboard");
    } else {
      navigate("/register");
    }
  };

  const handleScrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#141414] font-sans selection:bg-[#1351AA] selection:text-white">
      {/* Navigation */}
      <LandingNav onScrollToSection={handleScrollToSection} />

      {/* Main Container */}
      <main className="max-w-[1920px] mx-auto">
        {/* ==================================================================== */}
        {/* HERO SECTION */}
        {/* ==================================================================== */}
        <section className="min-h-[85vh] grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          {/* Hero Left Sidebar (Col 1-3) */}
          <aside className="lg:col-span-3 hidden lg:flex flex-col justify-between p-8 xl:p-10 border-r border-[#C7C7C7] select-none">
            <div className="space-y-4 animate-fade-in-up">
              <div className="text-xs font-mono font-bold tracking-[0.2em] text-[#7A7A7A] uppercase flex items-center space-x-2">
                <span className="inline-block w-2 h-2 bg-[#1351AA]"></span>
                <span>MANIFESTO</span>
              </div>
              <p className="text-xs font-mono text-[#444343] leading-relaxed uppercase">
                CLICK INTELLIGENCE<br />
                FOR THE LINKS<br />
                THAT MATTER.
              </p>
            </div>
            <div className="text-xs font-mono text-[#7A7A7A]">
              LINKPULSE / V1.0.0
            </div>
          </aside>

          {/* Hero Main Content (Col 4-12) */}
          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-16 flex flex-col justify-between space-y-12">
            {/* Headline */}
            <div className="animate-fade-in-up space-y-6">
              <h1 className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-black text-[#141414] leading-[0.85] tracking-tighter uppercase select-none">
                SHORT<br />
                LINKS.<br />
                <br />
                DEEP<br />
                <span className="text-[#1351AA]">INSIGHT.</span>
              </h1>
            </div>

            {/* Supporting Copy & CTAs */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-end border-t border-[#C7C7C7] pt-8 animate-fade-in-up">
              <div className="md:col-span-7 space-y-3">
                <p className="text-base sm:text-lg text-[#444343] font-medium leading-relaxed max-w-xl">
                  LinkPulse turns every click into structured intelligence. Create short links, understand your audience, and measure what actually drives attention.
                </p>
              </div>

              <div className="md:col-span-5 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <button
                  onClick={handleCtaClick}
                  className="h-[56px] px-8 bg-[#1351AA] hover:bg-[#141414] text-white font-bold text-xs tracking-[0.08em] uppercase transition-colors duration-300 rounded-none flex items-center justify-center space-x-2 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351AA]"
                >
                  <span>{isAuthenticated ? "GO TO WORKSPACE" : "START TRACKING"}</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </button>
                <button
                  onClick={() => handleScrollToSection("intelligence")}
                  className="text-xs font-mono font-bold text-[#141414] hover:text-[#1351AA] uppercase tracking-wider underline underline-offset-4 transition-colors cursor-pointer py-3 text-center sm:text-left"
                >
                  EXPLORE ANALYTICS
                </button>
              </div>
            </div>

            {/* Hero Micro Metadata */}
            <div className="pt-4 border-t border-[#C7C7C7]/60 flex flex-wrap items-center justify-between text-[11px] font-mono text-[#7A7A7A] gap-3">
              <span>URL SHORTENING</span>
              <span className="hidden sm:inline">•</span>
              <span>CLICK ANALYTICS</span>
              <span className="hidden sm:inline">•</span>
              <span>CAMPAIGN INTELLIGENCE</span>
              <span className="hidden sm:inline">•</span>
              <span>GEO & DEVICE BREAKDOWN</span>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* PRODUCT PREVIEW SECTION */}
        {/* ==================================================================== */}
        <section className="p-6 lg:p-12 border-b border-[#C7C7C7] bg-white">
          <ProductPreviewFrame />
        </section>

        {/* ==================================================================== */}
        {/* SYSTEM SECTION */}
        {/* ==================================================================== */}
        <section id="system" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="SYSTEM" sublabel="ARCHITECTURAL FRAMEWORK" />

          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-14 space-y-10">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              ONE LINK.<br />
              AN ENTIRE<br />
              <span className="text-[#1351AA]">SIGNAL.</span>
            </h2>

            {/* 3-Column Cell Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 border-t border-l border-[#C7C7C7]">
              {/* Cell 01 */}
              <div className="p-6 xl:p-8 border-r border-b border-[#C7C7C7] hover:bg-[#F8F9FA] transition-colors duration-300 group space-y-4 select-none">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">01</span>
                <h3 className="text-2xl font-black text-[#141414] group-hover:text-[#1351AA] transition-colors uppercase">
                  SHORTEN
                </h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Create clean, memorable short links with custom aliases and optional expiry controls.
                </p>
              </div>

              {/* Cell 02 */}
              <div className="p-6 xl:p-8 border-r border-b border-[#C7C7C7] hover:bg-[#F8F9FA] transition-colors duration-300 group space-y-4 select-none">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">02</span>
                <h3 className="text-2xl font-black text-[#141414] group-hover:text-[#1351AA] transition-colors uppercase">
                  MEASURE
                </h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Track every human click in real time while automatically filtering out non-human bots.
                </p>
              </div>

              {/* Cell 03 */}
              <div className="p-6 xl:p-8 border-r border-b border-[#C7C7C7] hover:bg-[#F8F9FA] transition-colors duration-300 group space-y-4 select-none">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">03</span>
                <h3 className="text-2xl font-black text-[#141414] group-hover:text-[#1351AA] transition-colors uppercase">
                  UNDERSTAND
                </h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Turn raw click streams into geographic, device, and referrer campaign intelligence.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* INTELLIGENCE SECTION */}
        {/* ==================================================================== */}
        <section id="intelligence" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="INTELLIGENCE" sublabel="DATA BREAKDOWN" />

          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-14 space-y-12">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              SEE WHAT THE<br />
              CLICK ACTUALLY<br />
              <span className="text-[#1351AA]">MEANS.</span>
            </h2>

            {/* Typographic Feature Rows */}
            <div className="space-y-0">
              <TypographicListItem
                index="01"
                title="WHO IS CLICKING?"
                description="Identify unique visitors vs recurring audience members without intrusive tracking cookies."
                badge="VISITOR METRICS"
                onClick={handleCtaClick}
              />
              <TypographicListItem
                index="02"
                title="WHERE ARE THEY?"
                description="Geographic breakdown pinpointing click origin by country, region, and city."
                badge="GEO ANALYTICS"
                onClick={handleCtaClick}
              />
              <TypographicListItem
                index="03"
                title="WHAT ARE THEY USING?"
                description="Device type, operating system, and browser analytics parsed directly from user agents."
                badge="DEVICE PARSING"
                onClick={handleCtaClick}
              />
              <TypographicListItem
                index="04"
                title="WHICH LINKS PERFORM?"
                description="Compare top performing links and marketing campaigns in unified real-time dashboards."
                badge="CAMPAIGN SIGNAL"
                onClick={handleCtaClick}
              />
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* REALITY-FIRST STATEMENT */}
        {/* ==================================================================== */}
        <section id="reality" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="REALITY" sublabel="OUR PHILOSOPHY" />

          <div className="lg:col-span-9 p-6 sm:p-12 xl:p-16 space-y-8 my-auto">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              NO VANITY METRICS.<br />
              JUST <span className="text-[#1351AA]">SIGNAL.</span>
            </h2>
            <div className="text-lg sm:text-xl text-[#444343] font-medium leading-relaxed max-w-2xl space-y-4">
              <p>
                LinkPulse is built around what happens after someone clicks.
              </p>
              <p>
                Not impressions. Not inflated dashboards. Actual traffic. Actual behavior. Actual signals.
              </p>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* WHY DIFFERENT LIST */}
        {/* ==================================================================== */}
        <section id="why-different" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="WHY DIFFERENT" sublabel="KEY CAPABILITIES" />

          <div className="lg:col-span-9 p-0">
            <TypographicListItem
              index="01"
              title="FAST REDIRECTS"
              description="High-performance backend redirect engine ensuring minimum latency between click and destination."
              badge="SUB-50MS ENGINE"
              onClick={handleCtaClick}
            />
            <TypographicListItem
              index="02"
              title="EVERY CLICK COUNTS"
              description="Synchronous click event pipeline capturing device type, referrer, geo, and timestamp accurately."
              badge="PIPELINE"
              onClick={handleCtaClick}
            />
            <TypographicListItem
              index="03"
              title="PRIVACY-AWARE TRACKING"
              description="IP address hashing using secure salt keys rather than storing raw identifiable IP data."
              badge="SALTED HASH"
              onClick={handleCtaClick}
            />
            <TypographicListItem
              index="04"
              title="CAMPAIGN-LEVEL INTELLIGENCE"
              description="Group links under strategic campaigns to measure aggregate ROI and audience engagement."
              badge="CAMPAIGNS"
              onClick={handleCtaClick}
            />
            <TypographicListItem
              index="05"
              title="ANALYTICS THAT STAY READABLE"
              description="Clean typographic charts and structured tabular breakdowns that communicate signal instantly."
              badge="EDITORIAL DATA"
              onClick={handleCtaClick}
            />
          </div>
        </section>

        {/* ==================================================================== */}
        {/* HOW IT WORKS / FLOW SECTION */}
        {/* ==================================================================== */}
        <section id="flow" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="FLOW" sublabel="PROCESS ARCHITECTURE" />

          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-14 space-y-12">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              FROM LINK TO<br />
              <span className="text-[#1351AA]">SIGNAL.</span>
            </h2>

            {/* Horizontal Step Process */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#C7C7C7]">
              <div className="p-6 border-r border-b border-[#C7C7C7] space-y-2">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">01</span>
                <h3 className="text-xl font-black text-[#141414] uppercase">CREATE</h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Input destination URL & custom alias.
                </p>
              </div>
              <div className="p-6 border-r border-b border-[#C7C7C7] space-y-2">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">02</span>
                <h3 className="text-xl font-black text-[#141414] uppercase">SHARE</h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Distribute link or custom QR code.
                </p>
              </div>
              <div className="p-6 border-r border-b border-[#C7C7C7] space-y-2">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">03</span>
                <h3 className="text-xl font-black text-[#1351AA] uppercase">CLICK</h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  User visits short link & gets redirected.
                </p>
              </div>
              <div className="p-6 border-r border-b border-[#C7C7C7] space-y-2">
                <span className="font-mono text-xs text-[#7A7A7A] font-bold">04</span>
                <h3 className="text-xl font-black text-[#141414] uppercase">ANALYZE</h3>
                <p className="text-xs text-[#444343] leading-relaxed">
                  Review real-time click breakdowns.
                </p>
              </div>
            </div>

            {/* Technical Flow Diagram */}
            <div className="p-6 border border-[#C7C7C7] bg-white font-mono text-xs text-[#444343] space-y-3">
              <div className="text-[10px] text-[#7A7A7A] uppercase font-bold tracking-wider">
                TECHNICAL DATA FLOW
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[#141414] font-bold">
                <span className="px-3 py-1.5 border border-[#C7C7C7] bg-[#F8F9FA]">USER VISIT</span>
                <span>→</span>
                <span className="px-3 py-1.5 border border-[#1351AA] text-[#1351AA] bg-[#F8F9FA]">SHORT CODE LOOKUP</span>
                <span>→</span>
                <span className="px-3 py-1.5 border border-[#C7C7C7] bg-[#F8F9FA]">HTTP 302 REDIRECT</span>
                <span>→</span>
                <span className="px-3 py-1.5 border border-[#C7C7C7] bg-[#F8F9FA]">CLICK EVENT AGGREGATION</span>
              </div>
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* USE CASES SECTION */}
        {/* ==================================================================== */}
        <section id="use-cases" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="USE CASES" sublabel="TARGET AUDIENCE" />

          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-14 space-y-10">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              BUILT FOR PEOPLE<br />
              WHO <span className="text-[#1351AA]">MEASURE.</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#C7C7C7]">
              {["MARKETERS", "PRODUCT TEAMS", "CREATORS", "AGENCIES", "DEVELOPERS", "STARTUPS"].map(
                (item, idx) => (
                  <div
                    key={item}
                    className="p-6 border-r border-b border-[#C7C7C7] hover:bg-[#F8F9FA] transition-colors duration-300 group cursor-pointer"
                    onClick={handleCtaClick}
                  >
                    <span className="font-mono text-xs text-[#7A7A7A] block mb-2">
                      0{idx + 1}
                    </span>
                    <h3 className="text-xl font-black text-[#141414] group-hover:text-[#1351AA] transition-colors uppercase">
                      {item}
                    </h3>
                  </div>
                )
              )}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CAPABILITIES SECTION */}
        {/* ==================================================================== */}
        <section id="capabilities" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="CAPABILITIES" sublabel="FEATURE INDEX" />

          <div className="lg:col-span-9 p-6 sm:p-10 xl:p-14 space-y-10">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              INFRASTRUCTURE<br />
              BUILT FOR <span className="text-[#1351AA]">SCALE.</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs font-mono">
              {[
                "SHORT LINKS",
                "CUSTOM ALIASES",
                "QR CODES",
                "CLICK TRACKING",
                "UNIQUE VISITORS",
                "GEO ANALYTICS",
                "DEVICE ANALYTICS",
                "REFERRER ANALYTICS",
                "UTM TRACKING",
                "CAMPAIGNS",
                "WORKSPACES",
                "CSV EXPORTS",
              ].map((cap) => (
                <div
                  key={cap}
                  className="p-4 border border-[#C7C7C7] bg-white hover:border-[#1351AA] hover:text-[#1351AA] transition-colors font-bold uppercase"
                >
                  ■ {cap}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* CONTROL / PRIVACY SECTION */}
        {/* ==================================================================== */}
        <section id="control" className="grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="CONTROL" sublabel="PRIVACY & TRUST" />

          <div className="lg:col-span-9 p-6 sm:p-12 xl:p-16 space-y-6 my-auto">
            <h2 className="text-4xl sm:text-5xl xl:text-6xl font-black text-[#141414] tracking-tight uppercase leading-[0.9]">
              USEFUL WITHOUT<br />
              BEING <span className="text-[#1351AA]">INTRUSIVE.</span>
            </h2>
            <p className="text-base sm:text-lg text-[#444343] font-medium leading-relaxed max-w-2xl">
              IP addresses are processed through privacy-aware hashing rather than storing raw IP data in click logs. Measure geographic trends and unique visitors without compromising user trust.
            </p>
          </div>
        </section>

        {/* ==================================================================== */}
        {/* FINAL CTA SECTION */}
        {/* ==================================================================== */}
        <section id="access" className="min-h-[50vh] grid grid-cols-1 lg:grid-cols-12 border-b border-[#C7C7C7] bg-white">
          <SectionLabel label="ACCESS" sublabel="GET STARTED" />

          <div className="lg:col-span-9 p-8 sm:p-14 xl:p-20 flex flex-col justify-between space-y-10 my-auto">
            <div className="space-y-4">
              <h2 className="text-5xl sm:text-7xl xl:text-8xl font-black text-[#141414] tracking-tighter uppercase leading-[0.85]">
                MAKE EVERY<br />
                CLICK <span className="text-[#1351AA]">COUNT.</span>
              </h2>
              <p className="text-base sm:text-lg text-[#444343] font-medium max-w-xl">
                Create your first short link. Understand what happens next.
              </p>
            </div>

            <div>
              <button
                onClick={handleCtaClick}
                className="h-[64px] px-10 bg-[#141414] hover:bg-[#1351AA] text-white font-bold text-sm tracking-[0.08em] uppercase transition-colors duration-300 rounded-none inline-flex items-center justify-center space-x-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#1351AA]"
              >
                <span>{isAuthenticated ? "GO TO WORKSPACE" : "START WITH LINKPULSE"}</span>
                <span className="transition-transform group-hover:translate-x-2">→</span>
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Technical Footer */}
      <LandingFooter />
    </div>
  );
}
