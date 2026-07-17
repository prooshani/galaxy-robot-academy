const instrumentPattern = ["inst-cyan", "inst-violet inst-blink", "inst-cyan", "inst-amber", "inst-cyan inst-blink", "inst-violet"];

/**
 * The ship around the view: structural hull along the sides and bottom, bevelled
 * canopy corners with energized seams, instrument lights on the dash, glass
 * vignette, and quiet HUD stamps. Fixed above content, below the nav console.
 */
export function CockpitFrame() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40">
      {/* canopy glass */}
      <div className="cockpit-vignette absolute inset-0" />

      {/* hull structure */}
      <div className="hull-side left-0"><div className="hull-glow-v right-0" /></div>
      <div className="hull-side hull-side-right right-0"><div className="hull-glow-v right-0" /></div>
      <div className="hull-bottom"><div className="hull-glow-h top-0" /></div>

      {/* bevelled canopy corners */}
      <span className="hull-corner-accent corner-tl-a left-0 top-16" /><span className="hull-corner corner-tl left-0 top-16" />
      <span className="hull-corner-accent corner-tr-a right-0 top-16" /><span className="hull-corner corner-tr right-0 top-16" />
      <span className="hull-corner-accent corner-bl-a bottom-0 left-0" /><span className="hull-corner corner-bl bottom-0 left-0" />
      <span className="hull-corner-accent corner-br-a bottom-0 right-0" /><span className="hull-corner corner-br bottom-0 right-0" />

      {/* dash instruments */}
      <div className="instrument-row left-[6%] hidden sm:flex">
        {instrumentPattern.map((tone, index) => <span key={index} className={tone} style={{ animationDelay: `${index * 0.7}s` }} />)}
      </div>
      <div className="instrument-row right-[6%] hidden sm:flex">
        {instrumentPattern.slice().reverse().map((tone, index) => <span key={index} className={tone} style={{ animationDelay: `${index * 0.9}s` }} />)}
      </div>

      {/* HUD stamps inside the glass */}
      <div className="hidden lg:block">
        <span className="stamp-label absolute left-[4.5%] top-[86px] text-[.55rem] text-halo/60">GRA · Canopy 01</span>
        <span className="stamp-label absolute right-[4.5%] top-[86px] text-[.55rem] text-halo/60">SYS Nominal</span>
        <span className="stamp-label absolute bottom-[calc(clamp(14px,4.5vh,46px)+10px)] left-1/2 -translate-x-1/2 text-[.55rem] text-halo/50">Orbit GX-A · 408 KM · Vel 7.6 KM/S</span>
      </div>
    </div>
  );
}
