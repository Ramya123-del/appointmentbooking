import { useState, useCallback } from "react";

// ─── THEME ───────────────────────────────────────────────────
const C = {
  cream: "#F7F3EE", warm: "#FDFAF7", charcoal: "#1C1A18", ash: "#3D3A36",
  stone: "#8A857E", sand: "#C4B8A8", terra: "#C17A5A", sage: "#7A9E87",
  gold: "#C9A96E", border: "rgba(28,26,24,0.1)",
};
const serif = { fontFamily: "'Cormorant Garamond', serif" };
const sans  = { fontFamily: "'DM Sans', sans-serif" };

// ─── DATA ────────────────────────────────────────────────────
const SERVICES = [
  { id:1, icon:"🌿", cat:"Therapeutic",  name:"Deep Tissue Massage",   desc:"Targeted pressure therapy to release chronic muscle tension and restore mobility.", dur:"90 min",  price:"₹3,500", badge:"Popular"   },
  { id:2, icon:"☯️", cat:"Holistic",     name:"Ayurvedic Ritual",       desc:"Ancient healing practices with warm herbal oils for complete body-mind balance.",   dur:"120 min", price:"₹5,200", badge:"New"       },
  { id:3, icon:"✨", cat:"Rejuvenation", name:"Signature Facial",        desc:"A personalised facial using botanical extracts and advanced skin techniques.",        dur:"60 min",  price:"₹2,800"               },
  { id:4, icon:"🪨", cat:"Energy Healing",name:"Hot Stone Therapy",      desc:"Smooth heated basalt stones along energy pathways to melt away tension.",            dur:"75 min",  price:"₹4,000"               },
  { id:5, icon:"🎵", cat:"Mind-Body",    name:"Sound Bath Meditation",   desc:"Resonant frequencies of Tibetan singing bowls for deep nervous system reset.",       dur:"45 min",  price:"₹1,800"               },
  { id:6, icon:"💆", cat:"Luxury",       name:"Aura Wellness Journey",   desc:"Our ultimate full-day experience combining massage, facial, and sound therapy.",     dur:"240 min", price:"₹12,000",badge:"Signature"},
];

const PROVIDERS = [
  { id:1, icon:"🧘", name:"Priya Mehta",   role:"Lead Therapist & Founder",       tags:["Deep Tissue","Ayurveda","Hot Stone"], rating:"5.0", sessions:312, avail:true,  grad:"linear-gradient(160deg,#D4C5B2,#B4A090)" },
  { id:2, icon:"💆", name:"Arjun Nair",    role:"Sports & Remedial Therapist",    tags:["Sports Therapy","Myofascial"],        rating:"4.9", sessions:248, avail:true,  grad:"linear-gradient(160deg,#A8BBA8,#7A9E87)" },
  { id:3, icon:"✨", name:"Kavya Sharma",  role:"Aesthetic & Skin Specialist",    tags:["Facials","Gua Sha","LED Therapy"],    rating:"4.9", sessions:195, avail:false, grad:"linear-gradient(160deg,#C9A96E,#A08040)" },
  { id:4, icon:"🪨", name:"Rohan Das",     role:"Energy Healing Practitioner",    tags:["Hot Stone","Reiki","Chakra"],         rating:"4.8", sessions:167, avail:true,  grad:"linear-gradient(160deg,#C17A5A,#9E5A38)" },
  { id:5, icon:"🎵", name:"Ananya Rao",    role:"Sound Healing Specialist",       tags:["Sound Bath","Meditation","Breathwork"],rating:"5.0",sessions:142, avail:true,  grad:"linear-gradient(160deg,#8A9EA8,#607080)" },
  { id:6, icon:"⭐", name:"Any Available", role:"Best Match for You",             tags:["Flexible"],                          rating:"5.0", sessions:999, avail:true,  grad:"linear-gradient(160deg,#D4C5B2,#B4A590)" },
];

const MONTHS    = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const HAS_SLOTS = [2,3,5,7,8,10,11,14,15,17,18,19,22,23,25,26,28,29];
const ALL_SLOTS = ["9:00 AM","9:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","2:00 PM","2:30 PM","3:00 PM","3:30 PM","4:00 PM","5:00 PM","5:30 PM","6:00 PM"];
const TAKEN_IDX = [1,4,7,10];

const SVC_GRADS = [
  "linear-gradient(135deg,#C4B8A8,#9E8E7E)",
  "linear-gradient(135deg,#7A9E87,#5A7E68)",
  "linear-gradient(135deg,#C17A5A,#A05A3A)",
  "linear-gradient(135deg,#C9A96E,#A08848)",
  "linear-gradient(135deg,#8A857E,#5D5850)",
  "linear-gradient(135deg,#D4C5B2,#B4A592)",
];

// ─── SHARED UI ────────────────────────────────────────────────
function Nav({ page, setPage }) {
  const links = [["home","Home"],["services","Services"],["providers","Our Team"],["contact","Contact"]];
  return (
    <nav style={{ position:"fixed", top:0, left:0, right:0, zIndex:100, display:"flex",
      alignItems:"center", justifyContent:"space-between", padding:"20px 48px",
      background:"rgba(253,250,247,0.92)", backdropFilter:"blur(20px)",
      borderBottom:`1px solid ${C.border}` }}>
      <span onClick={()=>setPage("home")} style={{...serif,fontSize:24,fontWeight:600,letterSpacing:"0.08em",cursor:"pointer",color:C.charcoal}}>
        Aura<span style={{color:C.terra}}>.</span>
      </span>
      <div style={{display:"flex",gap:32,alignItems:"center"}}>
        {links.map(([id,label])=>(
          <span key={id} onClick={()=>setPage(id)} style={{fontSize:12,fontWeight:400,letterSpacing:"0.08em",
            textTransform:"uppercase",color:page===id?C.terra:C.ash,cursor:"pointer",transition:"color 0.2s"}}>
            {label}
          </span>
        ))}
        <button onClick={()=>setPage("booking")} style={{...sans,background:C.charcoal,color:C.cream,
          fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",padding:"11px 26px",border:"none",cursor:"pointer"}}>
          Book Now
        </button>
      </div>
    </nav>
  );
}

function Btn({ children, onClick, outline, full, style: extra={} }) {
  const base = {...sans, fontSize:12, letterSpacing:"0.1em", textTransform:"uppercase",
    padding:"15px 36px", border:"none", cursor:"pointer", transition:"all 0.25s", ...(full?{width:"100%"}:{})};
  const s = outline
    ? {...base, background:"transparent", color:C.charcoal, border:`1.5px solid ${C.charcoal}`, ...extra}
    : {...base, background:C.charcoal, color:C.cream, ...extra};
  return <button onClick={onClick} style={s}>{children}</button>;
}

// ─── SERVICE CARD ─────────────────────────────────────────────
function ServiceCard({ s, onClick, noBook }) {
  const [hover, setHover] = useState(false);
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)} onClick={onClick}
      style={{ border:`1px solid ${hover?C.terra:C.border}`, background:C.warm, overflow:"hidden",
        cursor:"pointer", transition:"all 0.3s", transform:hover?"translateY(-5px)":"translateY(0)",
        boxShadow:hover?"0 20px 56px rgba(28,26,24,0.13)":"none" }}>
      <div style={{ height:180, background:SVC_GRADS[s.id-1], position:"relative",
        display:"flex", alignItems:"center", justifyContent:"center" }}>
        <span style={{fontSize:48,opacity:0.45}}>{s.icon}</span>
        {s.badge && <span style={{position:"absolute",top:14,right:14,background:C.warm,color:C.charcoal,
          padding:"5px 12px",fontSize:10,letterSpacing:"0.1em",textTransform:"uppercase",fontWeight:500}}>{s.badge}</span>}
      </div>
      <div style={{padding:28}}>
        <div style={{fontSize:10,letterSpacing:"0.18em",textTransform:"uppercase",color:C.terra,marginBottom:10}}>{s.cat}</div>
        <div style={{...serif,fontSize:22,fontWeight:400,marginBottom:10}}>{s.name}</div>
        <div style={{fontSize:13,lineHeight:1.8,color:C.stone,marginBottom:20}}>{s.desc}</div>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",paddingTop:16,borderTop:`1px solid ${C.border}`}}>
          <span style={{fontSize:12,color:C.stone}}>Duration <b style={{color:C.charcoal}}>{s.dur}</b></span>
          <span style={{...serif,fontSize:26,fontWeight:300}}>{s.price}</span>
        </div>
        {!noBook && (
          <button onClick={onClick} style={{width:"100%",marginTop:16,...sans,
            background:hover?C.terra:C.charcoal,color:C.cream,fontSize:11,letterSpacing:"0.12em",
            textTransform:"uppercase",padding:"13px",border:"none",cursor:"pointer",transition:"background 0.2s"}}>
            Book This Service
          </button>
        )}
      </div>
    </div>
  );
}

// ─── HOME PAGE ────────────────────────────────────────────────
function HomePage({ setPage }) {
  return (
    <div style={{paddingTop:80}}>
      {/* Hero */}
      <section style={{background:C.cream,minHeight:"100vh",display:"grid",
        gridTemplateColumns:"1fr 1fr",alignItems:"center",padding:"80px 60px",gap:80}}>
        <div>
          <div style={{fontSize:11,fontWeight:500,letterSpacing:"0.22em",textTransform:"uppercase",
            color:C.terra,marginBottom:20,display:"flex",alignItems:"center",gap:12}}>
            <span style={{width:36,height:1,background:C.terra,display:"inline-block"}}/>
            Premium Wellness Studio
          </div>
          <h1 style={{...serif,fontSize:68,lineHeight:1.0,fontWeight:300,marginBottom:24}}>
            Restore<br/>Your <em style={{fontStyle:"italic",color:C.terra}}>Inner</em><br/>Balance
          </h1>
          <p style={{fontSize:15,lineHeight:1.85,color:C.stone,maxWidth:400,marginBottom:40}}>
            Experience transformative wellness treatments curated by expert practitioners. Your journey to harmony begins here.
          </p>
          <div style={{display:"flex",gap:20}}>
            <Btn onClick={()=>setPage("booking")}>Book a Session</Btn>
            <Btn outline onClick={()=>setPage("services")}>Explore Services</Btn>
          </div>
          <div style={{display:"flex",gap:48,marginTop:56,paddingTop:36,borderTop:`1px solid ${C.border}`}}>
            {[["12+","Years of Excellence"],["98%","Client Satisfaction"],["5k+","Sessions"]].map(([n,l])=>(
              <div key={l}>
                <div style={{...serif,fontSize:40,fontWeight:300}}>{n}</div>
                <div style={{fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:C.stone,marginTop:4}}>{l}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{position:"relative",height:560}}>
          <div style={{position:"absolute",right:0,top:0,width:"75%",height:"87%",
            background:"linear-gradient(135deg,#D4C5B2,#9E8E7E)",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:80,opacity:0.15}}>✦</span>
          </div>
          <div style={{position:"absolute",left:0,bottom:0,width:"42%",height:"50%",background:C.charcoal,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:28}}>
            <div style={{...serif,fontSize:20,color:C.cream,fontStyle:"italic",textAlign:"center",lineHeight:1.5}}>
              "Where healing becomes an art form"
            </div>
            <div style={{fontSize:10,letterSpacing:"0.16em",color:C.sand,marginTop:14,textTransform:"uppercase"}}>Est. 2012 · Mumbai</div>
          </div>
          <div style={{position:"absolute",right:16,bottom:52,width:100,height:100,borderRadius:"50%",background:C.terra,
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",boxShadow:"0 8px 28px rgba(193,122,90,0.35)"}}>
            <div style={{...serif,fontSize:26,fontWeight:300,color:C.cream}}>★4.9</div>
            <div style={{fontSize:9,letterSpacing:"0.1em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginTop:2}}>Rated</div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{padding:"80px 60px",background:C.warm}}>
        <div style={{textAlign:"center",marginBottom:60}}>
          <span style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.terra,display:"block",marginBottom:12}}>The Process</span>
          <h2 style={{...serif,fontSize:46,fontWeight:300}}>How It <em style={{fontStyle:"italic",color:C.terra}}>Works</em></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:2}}>
          {[["01","🌿","Choose a Service","Browse our curated menu of transformative treatments."],
            ["02","👤","Select Practitioner","Pick from certified specialists based on expertise."],
            ["03","📅","Pick a Time","Real-time slots that fit seamlessly into your schedule."],
            ["04","✨","Arrive & Restore","We handle every detail so you can simply be."],
          ].map(([n,icon,title,desc])=>(
            <HoverStep key={n} n={n} icon={icon} title={title} desc={desc}/>
          ))}
        </div>
      </section>

      {/* Services preview */}
      <section style={{padding:"80px 60px",background:C.cream}}>
        <div style={{textAlign:"center",marginBottom:56}}>
          <span style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.terra,display:"block",marginBottom:12}}>Our Offerings</span>
          <h2 style={{...serif,fontSize:46,fontWeight:300}}>Featured <em style={{fontStyle:"italic",color:C.terra}}>Services</em></h2>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
          {SERVICES.slice(0,3).map(s=><ServiceCard key={s.id} s={s} onClick={()=>setPage("services")}/>)}
        </div>
        <div style={{textAlign:"center",marginTop:44}}>
          <Btn outline onClick={()=>setPage("services")}>View All Services →</Btn>
        </div>
      </section>
    </div>
  );
}

function HoverStep({ n, icon, title, desc }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:hov?C.charcoal:C.cream,padding:"44px 32px",transition:"background 0.3s",cursor:"default"}}>
      <div style={{...serif,fontSize:64,fontWeight:300,color:hov?C.terra:C.sand,lineHeight:1,marginBottom:20,transition:"color 0.3s"}}>{n}</div>
      <div style={{fontSize:26,marginBottom:16}}>{icon}</div>
      <div style={{fontSize:16,fontWeight:500,marginBottom:10,color:hov?C.cream:C.charcoal,transition:"color 0.3s"}}>{title}</div>
      <div style={{fontSize:13,lineHeight:1.75,color:hov?C.sand:C.stone,transition:"color 0.3s"}}>{desc}</div>
    </div>
  );
}

// ─── SERVICES PAGE ────────────────────────────────────────────
function ServicesPage({ setPage }) {
  return (
    <div style={{paddingTop:80}}>
      <div style={{background:C.charcoal,padding:"72px 60px",textAlign:"center"}}>
        <span style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.gold,display:"block",marginBottom:12}}>What We Offer</span>
        <h2 style={{...serif,fontSize:48,fontWeight:300,color:C.cream}}>Our <em style={{fontStyle:"italic",color:C.gold}}>Services</em></h2>
        <p style={{fontSize:14,color:C.sand,maxWidth:460,margin:"16px auto 0",lineHeight:1.85}}>
          Each treatment is thoughtfully crafted to restore balance and nurture your well-being.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,padding:"48px 60px"}}>
        {SERVICES.map(s=><ServiceCard key={s.id} s={s} onClick={()=>setPage("booking")}/>)}
      </div>
    </div>
  );
}

// ─── PROVIDERS PAGE ───────────────────────────────────────────
function ProvidersPage({ setPage }) {
  return (
    <div style={{paddingTop:80,background:C.cream,minHeight:"100vh"}}>
      <div style={{padding:"72px 60px 40px"}}>
        <span style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.terra,display:"block",marginBottom:12}}>Our Practitioners</span>
        <h2 style={{...serif,fontSize:48,fontWeight:300}}>Meet the <em style={{fontStyle:"italic",color:C.terra}}>Team</em></h2>
        <p style={{fontSize:14,color:C.stone,marginTop:12,maxWidth:480,lineHeight:1.85}}>
          Certified specialists dedicated to your transformation. Each practitioner brings years of expertise and genuine care.
        </p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20,padding:"0 60px 60px"}}>
        {PROVIDERS.map(p=><ProviderCard key={p.id} p={p} onBook={()=>setPage("booking")}/>)}
      </div>
    </div>
  );
}

function ProviderCard({ p, onBook }) {
  const [hov, setHov] = useState(false);
  return (
    <div onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{background:C.warm,border:`1px solid ${C.border}`,overflow:"hidden",
        transition:"all 0.3s",transform:hov?"translateY(-4px)":"",boxShadow:hov?"0 20px 56px rgba(28,26,24,0.12)":""}}>
      <div style={{height:220,background:p.grad,position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:"rgba(255,255,255,0.22)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:32}}>{p.icon}</div>
        <span style={{position:"absolute",top:14,right:14,padding:"5px 12px",borderRadius:16,fontSize:10,fontWeight:500,
          letterSpacing:"0.06em",background:p.avail?"rgba(122,158,135,0.88)":"rgba(193,122,90,0.88)",color:"#fff"}}>
          {p.avail?"● Available Today":"● Next: Tomorrow"}
        </span>
      </div>
      <div style={{padding:26}}>
        <div style={{...serif,fontSize:22,fontWeight:400,marginBottom:4}}>{p.name}</div>
        <div style={{fontSize:11,letterSpacing:"0.12em",textTransform:"uppercase",color:C.terra,marginBottom:14}}>{p.role}</div>
        <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:16}}>
          {p.tags.map(t=>(
            <span key={t} style={{background:C.cream,color:C.ash,padding:"4px 10px",fontSize:10,letterSpacing:"0.06em",border:`1px solid ${C.border}`}}>{t}</span>
          ))}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:C.gold,fontSize:13}}>★★★★★</span>
          <span style={{fontSize:12,color:C.stone}}>{p.rating} · {p.sessions} sessions</span>
        </div>
        <button onClick={onBook} style={{width:"100%",marginTop:18,...sans,
          background:hov?C.charcoal:"transparent",color:hov?C.cream:C.charcoal,
          fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",padding:"12px",
          border:`1.5px solid ${hov?C.charcoal:C.border}`,cursor:"pointer",transition:"all 0.2s"}}>
          Book with {p.name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}

// ─── BOOKING PAGE ─────────────────────────────────────────────
const STEP_LABELS = ["Service","Provider","Date & Time","Your Details","Confirm"];

function BookingPage({ setPage }) {
  const [step, setStep]       = useState(1);
  const [booking, setBooking] = useState({ service:null, provider:null, date:"", time:"", fname:"", lname:"", email:"", phone:"", notes:"" });
  const [calYear, setCalYear] = useState(2026);
  const [calMonth, setCalMonth] = useState(3);
  const [selDay, setSelDay]   = useState(null);

  const update = useCallback((k, v) => setBooking(b=>({...b,[k]:v})), []);

  return (
    <div style={{paddingTop:80,display:"grid",gridTemplateColumns:"280px 1fr",minHeight:"100vh"}}>
      {/* Sidebar */}
      <div style={{background:C.charcoal,padding:"44px 32px",position:"sticky",top:80,height:"calc(100vh - 80px)",overflowY:"auto"}}>
        <div style={{...serif,fontSize:24,color:C.cream,fontWeight:300,marginBottom:44}}>Book Your<br/>Session</div>
        <ul style={{listStyle:"none"}}>
          {STEP_LABELS.map((label,i)=>{
            const n=i+1,active=n===step,done=n<step;
            return (
              <li key={n} onClick={()=>(done||active)&&setStep(n)}
                style={{display:"flex",alignItems:"center",gap:14,padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,0.07)",cursor:done?"pointer":"default"}}>
                <div style={{width:34,height:34,borderRadius:"50%",flexShrink:0,transition:"all 0.3s",
                  border:`1.5px solid ${active?C.terra:done?C.sage:"rgba(255,255,255,0.2)"}`,
                  background:active?C.terra:done?C.sage:"transparent",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:12,color:active||done?"#fff":"rgba(255,255,255,0.35)"}}>
                  {done?"✓":n}
                </div>
                <span style={{fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",transition:"color 0.3s",
                  color:active?C.cream:done?"rgba(255,255,255,0.55)":"rgba(255,255,255,0.3)"}}>
                  {label}
                </span>
              </li>
            );
          })}
        </ul>
        {booking.service&&(
          <div style={{marginTop:44,paddingTop:28,borderTop:"1px solid rgba(255,255,255,0.1)"}}>
            <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:C.sand,marginBottom:14}}>Your Selection</div>
            {[["Service",booking.service?.name],["Provider",booking.provider?.name],["Date",booking.date||"—"],["Time",booking.time||"—"],["Total",booking.service?.price]].map(([k,v])=>(
              v&&<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
                <span style={{fontSize:11,color:"rgba(255,255,255,0.45)"}}>{k}</span>
                <span style={{fontSize:11,color:C.cream,fontWeight:500}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main */}
      <div style={{padding:"52px 60px",background:C.warm}}>
        {/* Progress bar */}
        <div style={{marginBottom:44}}>
          <div style={{height:2,background:C.border,marginBottom:8}}>
            <div style={{height:"100%",background:C.terra,width:`${(step/5)*100}%`,transition:"width 0.5s ease"}}/>
          </div>
          <div style={{fontSize:10,color:C.stone,letterSpacing:"0.12em"}}>Step {step} of 5</div>
        </div>

        {/* Steps */}
        {step===1&&<StepService booking={booking} update={update}/>}
        {step===2&&<StepProvider booking={booking} update={update}/>}
        {step===3&&<StepCalendar booking={booking} update={update} calYear={calYear} calMonth={calMonth} setCalYear={setCalYear} setCalMonth={setCalMonth} selDay={selDay} setSelDay={setSelDay}/>}
        {step===4&&<StepDetails booking={booking} update={update}/>}
        {step===5&&<StepConfirm booking={booking} setPage={setPage}/>}

        {/* Nav buttons */}
        <div style={{display:"flex",justifyContent:"space-between",marginTop:44,paddingTop:28,borderTop:`1px solid ${C.border}`}}>
          {step>1
            ? <button onClick={()=>setStep(s=>s-1)} style={{...sans,background:"transparent",color:C.stone,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",padding:"13px 28px",border:`1px solid ${C.border}`,cursor:"pointer"}}>← Back</button>
            : <div/>
          }
          {step<5&&<button onClick={()=>setStep(s=>s+1)} style={{...sans,background:C.charcoal,color:C.cream,fontSize:11,letterSpacing:"0.1em",textTransform:"uppercase",padding:"13px 36px",border:"none",cursor:"pointer"}}>Continue →</button>}
        </div>
      </div>
    </div>
  );
}

function StepService({ booking, update }) {
  return (
    <div>
      <h2 style={{...serif,fontSize:40,fontWeight:300,marginBottom:6}}>Select a <em style={{fontStyle:"italic",color:C.terra}}>Service</em></h2>
      <p style={{fontSize:13,color:C.stone,marginBottom:40}}>Choose the treatment that speaks to you.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {SERVICES.map(s=>{
          const sel=booking.service?.id===s.id;
          return (
            <div key={s.id} onClick={()=>update("service",s)}
              style={{border:`1.5px solid ${sel?C.charcoal:C.border}`,padding:24,cursor:"pointer",transition:"all 0.25s",background:sel?C.cream:C.warm,position:"relative"}}>
              {sel&&<div style={{position:"absolute",top:12,right:12,width:22,height:22,borderRadius:"50%",background:C.charcoal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>✓</div>}
              <div style={{fontSize:28,marginBottom:12}}>{s.icon}</div>
              <div style={{...serif,fontSize:20,fontWeight:400,marginBottom:8}}>{s.name}</div>
              <div style={{fontSize:12,color:C.stone,display:"flex",gap:20}}><span>{s.dur}</span><span>{s.price}</span></div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepProvider({ booking, update }) {
  return (
    <div>
      <h2 style={{...serif,fontSize:40,fontWeight:300,marginBottom:6}}>Choose a <em style={{fontStyle:"italic",color:C.terra}}>Practitioner</em></h2>
      <p style={{fontSize:13,color:C.stone,marginBottom:40}}>Select your preferred practitioner or let us assign the best match.</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        {PROVIDERS.map(p=>{
          const sel=booking.provider?.id===p.id;
          return (
            <div key={p.id} onClick={()=>update("provider",p)}
              style={{border:`1.5px solid ${sel?C.charcoal:C.border}`,padding:22,cursor:"pointer",transition:"all 0.25s",textAlign:"center",background:sel?C.cream:C.warm,position:"relative"}}>
              {sel&&<div style={{position:"absolute",top:10,right:10,width:20,height:20,borderRadius:"50%",background:C.charcoal,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>✓</div>}
              <div style={{width:58,height:58,borderRadius:"50%",background:p.grad,margin:"0 auto 12px",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>{p.icon}</div>
              <div style={{...serif,fontSize:17,fontWeight:400,marginBottom:4}}>{p.name}</div>
              <div style={{fontSize:10,color:C.stone,letterSpacing:"0.08em",textTransform:"uppercase",marginBottom:10}}>{p.role.split("&")[0].trim()}</div>
              <span style={{fontSize:10,padding:"3px 10px",borderRadius:12,background:p.avail?"rgba(122,158,135,0.15)":"rgba(193,122,90,0.15)",color:p.avail?C.sage:C.terra}}>
                ● {p.avail?"Available":"Tomorrow"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StepCalendar({ booking, update, calYear, calMonth, setCalYear, setCalMonth, selDay, setSelDay }) {
  const today      = new Date();
  const firstDay   = new Date(calYear,calMonth,1).getDay();
  const daysInMonth= new Date(calYear,calMonth+1,0).getDate();
  const dayNames   = ["Su","Mo","Tu","We","Th","Fr","Sa"];
  const cells      = [...Array(firstDay).fill(null), ...Array.from({length:daysInMonth},(_,i)=>i+1)];

  const prevMonth = () => { let m=calMonth-1,y=calYear; if(m<0){m=11;y--;} setCalMonth(m); setCalYear(y); };
  const nextMonth = () => { let m=calMonth+1,y=calYear; if(m>11){m=0;y++;} setCalMonth(m); setCalYear(y); };

  return (
    <div>
      <h2 style={{...serif,fontSize:40,fontWeight:300,marginBottom:6}}>Date <em style={{fontStyle:"italic",color:C.terra}}>&amp; Time</em></h2>
      <p style={{fontSize:13,color:C.stone,marginBottom:36}}>Real-time availability shown below.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:32}}>
        {/* Calendar */}
        <div style={{background:C.cream,padding:28,border:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <button onClick={prevMonth} style={{width:34,height:34,border:`1px solid ${C.border}`,background:"none",cursor:"pointer",fontSize:16,color:C.charcoal}}>‹</button>
            <div style={{...serif,fontSize:20,fontWeight:400}}>{MONTHS[calMonth]} {calYear}</div>
            <button onClick={nextMonth} style={{width:34,height:34,border:`1px solid ${C.border}`,background:"none",cursor:"pointer",fontSize:16,color:C.charcoal}}>›</button>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:4}}>
            {dayNames.map(d=>(
              <div key={d} style={{textAlign:"center",fontSize:9,letterSpacing:"0.14em",textTransform:"uppercase",color:C.stone,padding:"7px 0",fontWeight:500}}>{d}</div>
            ))}
            {cells.map((d,i)=>{
              if(!d) return <div key={"e"+i}/>;
              const isPast = new Date(calYear,calMonth,d) < new Date(today.getFullYear(),today.getMonth(),today.getDate());
              const isToday= d===today.getDate()&&calMonth===today.getMonth()&&calYear===today.getFullYear();
              const hasSlt = HAS_SLOTS.includes(d)&&!isPast;
              const isSel  = selDay===d&&!isPast;
              return (
                <div key={d} onClick={()=>{if(!isPast){setSelDay(d);const ds=MONTHS[calMonth].substring(0,3)+" "+d+", "+calYear;update("date",ds);update("time","");}}}
                  style={{aspectRatio:1,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,
                    cursor:isPast?"not-allowed":"pointer",borderRadius:4,position:"relative",
                    background:isSel?C.charcoal:"transparent",
                    color:isSel?"#fff":isPast?C.sand:isToday?C.terra:C.charcoal,
                    fontWeight:isToday?600:400,transition:"all 0.2s"}}>
                  {d}
                  {hasSlt&&!isSel&&<div style={{position:"absolute",top:3,right:3,width:4,height:4,borderRadius:"50%",background:C.sage}}/>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <div style={{fontSize:11,letterSpacing:"0.14em",textTransform:"uppercase",color:C.stone,marginBottom:16}}>
            {selDay?booking.date:"Select a date first"}
          </div>
          {selDay&&(
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
              {ALL_SLOTS.map((t,i)=>{
                const taken=TAKEN_IDX.includes(i), sel=booking.time===t;
                return (
                  <div key={t} onClick={()=>!taken&&update("time",t)}
                    style={{padding:"11px 8px",border:`1.5px solid ${sel?C.charcoal:C.border}`,textAlign:"center",fontSize:12,
                      cursor:taken?"not-allowed":"pointer",background:sel?C.charcoal:"transparent",
                      color:sel?"#fff":taken?C.sand:C.charcoal,textDecoration:taken?"line-through":"none",transition:"all 0.2s"}}>
                    {t}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StepDetails({ booking, update }) {
  const inp = (label, key, placeholder, type="text") => (
    <div style={{marginBottom:22}}>
      <label style={{display:"block",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>{label}</label>
      <input type={type} value={booking[key]||""} onChange={e=>update(key,e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"14px 18px",border:`1.5px solid ${C.border}`,background:C.cream,...sans,fontSize:13,color:C.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
    </div>
  );
  return (
    <div style={{maxWidth:540}}>
      <h2 style={{...serif,fontSize:40,fontWeight:300,marginBottom:6}}>Your <em style={{fontStyle:"italic",color:C.terra}}>Details</em></h2>
      <p style={{fontSize:13,color:C.stone,marginBottom:36}}>A few details to personalise your experience.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {inp("First Name","fname","Ananya")}
        {inp("Last Name","lname","Sharma")}
      </div>
      {inp("Email Address","email","ananya@email.com","email")}
      {inp("Phone Number","phone","+91 98765 43210","tel")}
      <div style={{marginBottom:22}}>
        <label style={{display:"block",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>Special Requests or Health Notes</label>
        <textarea value={booking.notes||""} onChange={e=>update("notes",e.target.value)} placeholder="Any allergies, injuries, or preferences..."
          style={{width:"100%",padding:"14px 18px",border:`1.5px solid ${C.border}`,background:C.cream,...sans,fontSize:13,color:C.charcoal,outline:"none",height:100,resize:"none",fontFamily:"'DM Sans',sans-serif"}}/>
      </div>
    </div>
  );
}

function StepConfirm({ booking, setPage }) {
  const dt = booking.date&&booking.time?`${booking.date} · ${booking.time}`:"—";
  return (
    <div>
      <h2 style={{...serif,fontSize:40,fontWeight:300,marginBottom:6}}>Confirm <em style={{fontStyle:"italic",color:C.terra}}>Booking</em></h2>
      <p style={{fontSize:13,color:C.stone,marginBottom:36}}>Review your booking before confirming.</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 320px",gap:32}}>
        <div style={{background:C.charcoal,padding:40,color:C.cream}}>
          <div style={{...serif,fontSize:26,fontWeight:300,marginBottom:6}}>{booking.service?.name||"—"}</div>
          <div style={{fontSize:12,color:C.sand,marginBottom:32}}>{booking.service?.dur||""} session</div>
          {[["👤","Practitioner",booking.provider?.name||"—"],["📅","Date & Time",dt],["📍","Location","Lower Parel, Mumbai"]].map(([icon,l,v])=>(
            <div key={l} style={{display:"flex",gap:16,padding:"16px 0",borderBottom:"1px solid rgba(255,255,255,0.09)"}}>
              <div style={{fontSize:18,marginTop:2}}>{icon}</div>
              <div>
                <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.sand,marginBottom:5}}>{l}</div>
                <div style={{fontSize:14,color:C.cream}}>{v}</div>
              </div>
            </div>
          ))}
          <div style={{paddingTop:20}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.sand,marginBottom:10}}>
              <span>Service Fee</span><span>{booking.service?.price||"—"}</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:13,color:C.sand,marginBottom:10}}>
              <span>Booking Fee</span><span>₹0</span>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:18,color:C.cream,fontWeight:500,paddingTop:14,borderTop:"1px solid rgba(255,255,255,0.14)"}}>
              <span>Total</span><span>{booking.service?.price||"—"}</span>
            </div>
          </div>
        </div>
        <div>
          <p style={{fontSize:12,color:C.stone,lineHeight:1.8,marginBottom:24}}>
            By confirming, you agree to our cancellation policy. Cancellations within 24 hours may incur a fee. A confirmation email will be sent immediately.
          </p>
          <button onClick={()=>setPage("confirmation",booking)} style={{width:"100%",...sans,background:C.terra,color:C.cream,fontSize:13,letterSpacing:"0.1em",textTransform:"uppercase",padding:"18px",border:"none",cursor:"pointer",marginBottom:12,transition:"all 0.3s"}}>
            ✓ Confirm &amp; Book Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── CONFIRMATION PAGE ────────────────────────────────────────
function ConfirmationPage({ booking, setPage }) {
  const [ref] = useState(()=>"#AUR-2026-"+Math.floor(1000+Math.random()*9000));
  const dt = booking?.date&&booking?.time?`${booking.date} at ${booking.time}`:"Apr 25, 2026 at 10:00 AM";
  return (
    <div style={{paddingTop:80,background:C.cream,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"120px 60px 80px"}}>
      <div style={{maxWidth:720,width:"100%"}}>
        <div style={{width:72,height:72,borderRadius:"50%",background:C.sage,display:"flex",alignItems:"center",justifyContent:"center",fontSize:32,color:"#fff",marginBottom:28}}>✓</div>
        <h2 style={{...serif,fontSize:50,fontWeight:300,lineHeight:1.1,marginBottom:14}}>
          You&apos;re all set,<br/><em style={{fontStyle:"italic",color:C.terra}}>see you soon!</em>
        </h2>
        <p style={{fontSize:14,color:C.stone,lineHeight:1.85,marginBottom:44,maxWidth:460}}>
          Your booking is confirmed. Check your email for full details. We look forward to welcoming you.
        </p>
        <div style={{background:C.charcoal,color:C.cream,padding:"18px 28px",display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:28}}>
          <div>
            <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.sand,marginBottom:6}}>Booking Reference</div>
            <div style={{...serif,fontSize:22,letterSpacing:"0.1em"}}>{ref}</div>
          </div>
          <span style={{fontSize:28,opacity:0.3}}>✦</span>
        </div>
        <div style={{background:C.warm,border:`1px solid ${C.border}`,padding:40,display:"grid",gridTemplateColumns:"1fr 1fr",gap:28,marginBottom:28}}>
          {[["Service",booking?.service?.name||"Deep Tissue Massage","90 minutes"],
            ["Practitioner",booking?.provider?.name||"Priya Mehta","Lead Therapist"],
            ["Date & Time",dt,"Arrive 10 min early"],
            ["Location","Aura Studio","Lower Parel, Mumbai"],
            ["Total",booking?.service?.price||"₹3,500","Payment on arrival"],
            ["Status","✓ Confirmed",ref]
          ].map(([l,v,s])=>(
            <div key={l}>
              <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:C.terra,marginBottom:8}}>{l}</div>
              <div style={{...serif,fontSize:20,fontWeight:400,color:l==="Status"?C.sage:C.charcoal}}>{v}</div>
              <div style={{fontSize:12,color:C.stone,marginTop:4}}>{s}</div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",gap:14}}>
          <button style={{flex:1,...sans,background:C.charcoal,color:C.cream,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",padding:"15px",border:"none",cursor:"pointer"}}>📅 Add to Calendar</button>
          <button onClick={()=>setPage("home")} style={{flex:1,...sans,background:"transparent",color:C.charcoal,fontSize:12,letterSpacing:"0.1em",textTransform:"uppercase",padding:"15px",border:`1.5px solid ${C.charcoal}`,cursor:"pointer"}}>← Back to Home</button>
        </div>
      </div>
    </div>
  );
}

// ─── CONTACT PAGE ─────────────────────────────────────────────
function ContactPage() {
  const [form, setForm] = useState({name:"",phone:"",email:"",subject:"General Inquiry",message:""});
  const upd = (k,v) => setForm(f=>({...f,[k]:v}));
  const inp = (label,key,placeholder,type="text") => (
    <div style={{marginBottom:20}}>
      <label style={{display:"block",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>{label}</label>
      <input type={type} value={form[key]} onChange={e=>upd(key,e.target.value)} placeholder={placeholder}
        style={{width:"100%",padding:"14px 18px",border:`1.5px solid ${C.border}`,background:C.cream,...sans,fontSize:13,color:C.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
    </div>
  );
  return (
    <div style={{paddingTop:80,display:"grid",gridTemplateColumns:"1fr 1fr",minHeight:"100vh"}}>
      <div style={{background:C.charcoal,padding:"72px 52px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <div>
          <span style={{fontSize:10,letterSpacing:"0.22em",textTransform:"uppercase",color:C.gold,display:"block",marginBottom:14}}>Get in Touch</span>
          <h2 style={{...serif,fontSize:46,fontWeight:300,color:C.cream,lineHeight:1.1,marginBottom:22}}>Let&apos;s <em style={{fontStyle:"italic",color:C.gold}}>Connect</em></h2>
          <p style={{fontSize:14,color:C.sand,lineHeight:1.85,marginBottom:48,maxWidth:340}}>Have questions or need a custom package? We&apos;d love to hear from you.</p>
          {[["📍","Visit Us","42, Serenity Lane, Lower Parel\nMumbai, Maharashtra 400013"],
            ["📞","Call Us","+91 22 4567 8900\n+91 98765 43210"],
            ["✉️","Write to Us","hello@aurawellness.in\nbookings@aurawellness.in"],
          ].map(([icon,l,v])=>(
            <div key={l} style={{display:"flex",gap:18,marginBottom:28}}>
              <div style={{fontSize:18,marginTop:2}}>{icon}</div>
              <div>
                <div style={{fontSize:9,letterSpacing:"0.18em",textTransform:"uppercase",color:C.gold,marginBottom:7}}>{l}</div>
                <div style={{fontSize:13,color:C.cream,lineHeight:1.65,whiteSpace:"pre-line"}}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div style={{fontSize:9,letterSpacing:"0.2em",textTransform:"uppercase",color:C.gold,marginBottom:16}}>Business Hours</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:0}}>
            {[["Mon–Fri","9am – 8pm"],["Saturday","8am – 9pm"],["Sunday","10am – 6pm"],["Holidays","Closed"]].map(([d,t])=>(
              <div key={d} style={{display:"flex",justifyContent:"space-between",padding:"9px 0",borderBottom:"1px solid rgba(255,255,255,0.07)"}}>
                <span style={{fontSize:11,color:C.sand}}>{d}</span>
                <span style={{fontSize:11,color:C.cream}}>{t}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{padding:"72px 52px",background:C.warm}}>
        <h3 style={{...serif,fontSize:34,fontWeight:300,marginBottom:6}}>Send a Message</h3>
        <p style={{fontSize:13,color:C.stone,marginBottom:36}}>We respond within 2 business hours.</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
          {inp("Name","name","Your name")}
          {inp("Phone","phone","+91 ...")}
        </div>
        {inp("Email","email","you@email.com","email")}
        <div style={{marginBottom:20}}>
          <label style={{display:"block",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>Subject</label>
          <select value={form.subject} onChange={e=>upd("subject",e.target.value)}
            style={{width:"100%",padding:"14px 18px",border:`1.5px solid ${C.border}`,background:C.cream,...sans,fontSize:13,color:C.charcoal,outline:"none",fontFamily:"'DM Sans',sans-serif"}}>
            {["General Inquiry","Service Information","Corporate Wellness","Gift Vouchers","Partnership"].map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
        <div style={{marginBottom:24}}>
          <label style={{display:"block",fontSize:10,letterSpacing:"0.16em",textTransform:"uppercase",color:C.stone,marginBottom:8}}>Message</label>
          <textarea value={form.message} onChange={e=>upd("message",e.target.value)} placeholder="How can we help you?"
            style={{width:"100%",padding:"14px 18px",border:`1.5px solid ${C.border}`,background:C.cream,...sans,fontSize:13,color:C.charcoal,outline:"none",height:110,resize:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        </div>
        <button style={{...sans,background:C.charcoal,color:C.cream,fontSize:12,letterSpacing:"0.12em",textTransform:"uppercase",padding:"17px 44px",border:"none",cursor:"pointer"}}>Send Message →</button>
        <div style={{height:160,marginTop:36,background:"linear-gradient(135deg,#D4C5B2,#B4A592)",position:"relative",display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:32,height:32,borderRadius:"50% 50% 50% 0",transform:"rotate(-45deg)",background:C.terra,position:"relative",boxShadow:"0 4px 14px rgba(0,0,0,0.2)"}}>
            <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%) rotate(45deg)",width:10,height:10,borderRadius:"50%",background:C.cream}}/>
          </div>
          <div style={{position:"absolute",bottom:14,left:"50%",transform:"translateX(-50%)",background:C.warm,padding:"7px 20px",fontSize:12,fontWeight:500,whiteSpace:"nowrap"}}>
            📍 Aura Wellness Studio · Lower Parel, Mumbai
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── APP ROOT ─────────────────────────────────────────────────
export default function App() {
  const [page, setPage]               = useState("home");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  const navigate = (id, data) => {
    if (id==="confirmation"&&data) setConfirmedBooking(data);
    setPage(id);
    window.scrollTo(0,0);
  };

  const pages = {
    home:         <HomePage setPage={navigate}/>,
    services:     <ServicesPage setPage={navigate}/>,
    providers:    <ProvidersPage setPage={navigate}/>,
    booking:      <BookingPage setPage={navigate}/>,
    confirmation: <ConfirmationPage booking={confirmedBooking} setPage={navigate}/>,
    contact:      <ContactPage setPage={navigate}/>,
  };

  return (
    <div>
      {/* Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet"/>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body{font-family:'DM Sans',sans-serif;background:#FDFAF7;color:#1C1A18;overflow-x:hidden}`}</style>
      <Nav page={page} setPage={navigate}/>
      <div key={page}>{pages[page]||pages.home}</div>
    </div>
  );
}