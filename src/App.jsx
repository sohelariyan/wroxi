import { useState, useEffect, useRef } from "react";

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
const uid = () => Math.random().toString(36).slice(2, 10);
const hashPw = (pw) => btoa(pw + "wroxi_salt_2025");

// ═══════════════════════════════════════════════════════════
//  INITIAL DATA
// ═══════════════════════════════════════════════════════════
const INIT_USERS = {
  "demo@wroxi.com": {
    id:"u1", name:"Alex Rivera", username:"alexrivera",
    password:hashPw("demo123"), bio:"Exploring ideas one post at a time ✨",
    email:"demo@wroxi.com", joined:"Jan 2025", verified:true, avatar:"AR",
    followers:["u2","u3"], following:["u2"],
  },
  "sara@wroxi.com": {
    id:"u2", name:"Sara Khan", username:"sarakhan",
    password:hashPw("sara123"), bio:"Designer & dreamer 🎨 | Dhaka 🇧🇩",
    email:"sara@wroxi.com", joined:"Feb 2025", verified:true, avatar:"SK",
    followers:["u1"], following:["u1","u3"],
  },
  "tom@wroxi.com": {
    id:"u3", name:"Tom Wright", username:"tomwright",
    password:hashPw("tom123"), bio:"Engineer by day, explorer by night 🌍",
    email:"tom@wroxi.com", joined:"Mar 2025", verified:false, avatar:"TW",
    followers:["u2"], following:["u1"],
  },
};

const INIT_POSTS = [
  { id:"p1", uid:"u1", name:"Alex Rivera", username:"alexrivera", avatar:"AR",
    content:"Just joined WROXI — the vibe here is different 🌊 excited to share my world!",
    image:null, likes:["u2"], dislikes:[], time:"2 min ago",
    comments:[
      { id:"c1", uid:"u2", name:"Sara Khan", username:"sarakhan", avatar:"SK",
        text:"Welcome to WROXI! 🎉", time:"1 min ago", likes:["u1"], dislikes:[],
        replies:[
          { id:"r1", uid:"u1", name:"Alex Rivera", username:"alexrivera", avatar:"AR",
            text:"Thanks Sara! 😊", time:"just now", likes:[], dislikes:[] }
        ]
      }
    ]
  },
  { id:"p2", uid:"u2", name:"Sara Khan", username:"sarakhan", avatar:"SK",
    content:"Design is not just what it looks like — design is how it works. Loving WROXI! 💜",
    image:null, likes:["u1","u3"], dislikes:[], time:"1 hr ago", comments:[] },
  { id:"p3", uid:"u3", name:"Tom Wright", username:"tomwright", avatar:"TW",
    content:"The future belongs to those who show up every single day. No shortcuts, just consistency. 💪",
    image:null, likes:["u2"], dislikes:[], time:"3 hrs ago", comments:[] },
];

const INIT_MSGS = {
  "u1_u2":[
    { id:"m1", from:"u2", text:"Hey Alex! Welcome 👋", time:"10:30 AM" },
    { id:"m2", from:"u1", text:"Thanks Sara! Love WROXI 😊", time:"10:32 AM" },
  ],
};

// ═══════════════════════════════════════════════════════════
//  THEME
// ═══════════════════════════════════════════════════════════
const T = {
  bg:"#0A0A0F", surface:"#12121A", card:"#1A1A26", border:"#2A2A3E",
  accent:"#6C63FF", accentB:"#4ECDC4", text:"#F0EFF8", muted:"#7A7A9A",
  danger:"#FF6B6B", success:"#4ECDC4", warn:"#F7B731",
};
const TL = {
  bg:"#F0F0F8", surface:"#E4E4F0", card:"#FFFFFF", border:"#D0D0E4",
  text:"#1A1A2E", muted:"#8A8AAA",
};

const makeCSS = (dark) => {
  const c = dark ? T : {...T,...TL};
  return `
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
*{box-sizing:border-box;margin:0;padding:0}
html,body{background:${c.bg};color:${c.text};font-family:'DM Sans',sans-serif;min-height:100vh;overflow-x:hidden}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:${c.bg}}::-webkit-scrollbar-thumb{background:${c.border};border-radius:4px}
input,textarea,button{font-family:'DM Sans',sans-serif}::placeholder{color:${c.muted}}
img{max-width:100%;border-radius:12px;display:block}
@keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideR{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
.fade-up{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) both}
.fade-in{animation:fadeIn .3s ease both}
.slide-r{animation:slideR .3s ease both}
.logo-text{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-1.5px}
.heading{font-family:'Syne',sans-serif;font-weight:700}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:11px;border:none;cursor:pointer;font-size:14px;font-weight:500;transition:all .18s;outline:none;white-space:nowrap}
.btn-primary{background:linear-gradient(135deg,${T.accent},#8B5CF6);color:#fff}
.btn-primary:hover{opacity:.85;transform:translateY(-1px);box-shadow:0 6px 18px ${T.accent}44}
.btn-primary:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{background:transparent;color:${c.muted};border:1.5px solid ${c.border}}
.btn-ghost:hover{border-color:${T.accent};color:${c.text}}
.btn-follow{background:${T.accent}22;color:${T.accent};border:1.5px solid ${T.accent}55}
.btn-follow:hover{background:${T.accent};color:#fff}
.btn-following{background:${c.card};color:${c.muted};border:1.5px solid ${c.border}}
.btn-following:hover{background:${T.danger}15;color:${T.danger};border-color:${T.danger}55}
.btn-sm{padding:6px 12px;font-size:13px;border-radius:9px}
.btn-xs{padding:4px 9px;font-size:12px;border-radius:7px}
.input{width:100%;padding:10px 14px;background:${c.card};border:1.5px solid ${c.border};border-radius:11px;color:${c.text};font-size:14px;transition:border .18s,box-shadow .18s;outline:none}
.input:focus{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accent}18}
.input.err{border-color:${T.danger}}
.card{background:${c.card};border:1px solid ${c.border};border-radius:17px;padding:17px}
.avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-family:'Syne',sans-serif;font-weight:700;letter-spacing:-.5px;flex-shrink:0;cursor:pointer}
.post-card{background:${c.card};border:1px solid ${c.border};border-radius:17px;padding:15px;transition:border-color .2s}
.post-card:hover{border-color:${T.accent}44}
.act-btn{display:flex;align-items:center;gap:5px;padding:5px 10px;border-radius:8px;border:none;background:transparent;cursor:pointer;font-size:13px;transition:all .18s;color:${c.muted}}
.act-btn:hover{background:${c.border}66}
.act-btn.a-like{color:${T.danger};background:${T.danger}15}
.act-btn.a-comment{color:${T.accent};background:${T.accent}15}
.comment-wrap{background:${c.bg};border-radius:13px;padding:12px;margin-top:10px}
.reply-wrap{background:${c.surface};border-radius:10px;padding:9px;margin:7px 0 0 34px}
.otp-box{width:44px;height:50px;text-align:center;font-size:19px;font-weight:700;background:${c.card};border:2px solid ${c.border};border-radius:11px;color:${c.text};outline:none;transition:border .18s}
.otp-box:focus{border-color:${T.accent};box-shadow:0 0 0 3px ${T.accent}18}
.strength-bar{height:4px;border-radius:2px;transition:all .3s}
.modal-overlay{position:fixed;inset:0;background:#00000099;backdrop-filter:blur(8px);z-index:200;display:flex;align-items:center;justify-content:center;padding:14px}
.modal{background:${c.surface};border:1px solid ${c.border};border-radius:22px;padding:26px;width:100%;max-width:450px;animation:fadeUp .35s ease both;max-height:90vh;overflow-y:auto}
.tab-bar{display:flex;gap:3px;background:${c.surface};border:1px solid ${c.border};border-radius:13px;padding:3px}
.tab{flex:1;padding:8px 4px;border-radius:10px;border:none;background:transparent;color:${c.muted};cursor:pointer;font-size:13px;font-weight:500;transition:all .18s;text-align:center}
.tab.active{background:${T.accent};color:#fff}
.nav{position:sticky;top:0;z-index:100;backdrop-filter:blur(18px);background:${c.bg}DD;border-bottom:1px solid ${c.border};padding:11px 17px;display:flex;align-items:center;justify-content:space-between}
.msg-me{background:linear-gradient(135deg,${T.accent},#8B5CF6);color:#fff;border-radius:17px 17px 4px 17px;padding:9px 13px;max-width:70%;font-size:13px;line-height:1.5;word-break:break-word;align-self:flex-end}
.msg-them{background:${c.card};border:1px solid ${c.border};color:${c.text};border-radius:17px 17px 17px 4px;padding:9px 13px;max-width:70%;font-size:13px;line-height:1.5;word-break:break-word;align-self:flex-start}
.notify{position:fixed;bottom:20px;right:20px;z-index:999;padding:11px 16px;border-radius:13px;font-size:13px;font-weight:500;animation:fadeUp .3s ease both;max-width:270px;pointer-events:none}
.notify.success{background:#0D2D2A;border:1px solid ${T.success};color:${T.success}}
.notify.error{background:#2D0D0D;border:1px solid ${T.danger};color:${T.danger}}
.notify.info{background:#1A1A2E;border:1px solid ${T.accent};color:${T.accent}}
.about-badge{display:inline-block;padding:3px 10px;border-radius:99px;background:${T.accent}22;color:${T.accent};font-size:11px;font-weight:600;letter-spacing:.5px;margin-bottom:9px}
.follow-row{display:flex;align-items:center;justify-content:space-between;padding:9px 0;border-bottom:1px solid ${c.border}}
.follow-row:last-child{border-bottom:none}
@media(max-width:600px){.modal{padding:18px}.otp-box{width:38px;height:44px;font-size:16px}.hide-sm{display:none}}
`};

// ═══════════════════════════════════════════════════════════
//  SHARED SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════
function Notify({ msg, type="success", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,3000); return()=>clearTimeout(t); },[]);
  return <div className={`notify ${type}`}>{type==="success"?"✓ ":type==="error"?"✕ ":"ℹ "}{msg}</div>;
}

function Av({ initials="?", size=40, onClick }) {
  const COLS=["#6C63FF","#4ECDC4","#FF6B6B","#F7B731","#A29BFE","#FD79A8","#26de81","#fd9644"];
  const col=COLS[(initials.charCodeAt(0)||0)%COLS.length];
  return (
    <span className="avatar" onClick={onClick}
      style={{width:size,height:size,fontSize:size*.36,background:col+"28",color:col,border:`2px solid ${col}50`}}>
      {initials}
    </span>
  );
}

function PwStrength({ pw }) {
  const score=[/.{8,}/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].filter(r=>r.test(pw)).length;
  const LABELS=["","Weak","Fair","Good","Strong"];
  const COLS=["",T.danger,T.warn,T.accentB,T.success];
  if(!pw) return null;
  return (
    <div style={{marginTop:5}}>
      <div style={{display:"flex",gap:3,marginBottom:3}}>
        {[1,2,3,4].map(i=><div key={i} className="strength-bar" style={{flex:1,background:i<=score?COLS[score]:T.border}} />)}
      </div>
      <span style={{fontSize:11,color:COLS[score]}}>{LABELS[score]}</span>
    </div>
  );
}

function OTPInput({ value, onChange }) {
  const refs=Array.from({length:6},()=>useRef());
  const digits=(value+"      ").slice(0,6).split("");
  const handle=(i,e)=>{
    const v=e.target.value.replace(/\D/g,"").slice(-1);
    const next=[...digits];next[i]=v;
    onChange(next.join("").trimEnd());
    if(v&&i<5)refs[i+1].current?.focus();
  };
  const onKey=(i,e)=>{ if(e.key==="Backspace"&&!digits[i]&&i>0)refs[i-1].current?.focus(); };
  return (
    <div style={{display:"flex",gap:7,justifyContent:"center"}}>
      {digits.map((d,i)=>(
        <input key={i} ref={refs[i]} className="otp-box" maxLength={1}
          value={d.trim()} onChange={e=>handle(i,e)} onKeyDown={e=>onKey(i,e)} inputMode="numeric" />
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ABOUT ACCORDION (inline toggle — no modal)
// ═══════════════════════════════════════════════════════════
function AboutAccordion({ open, onToggle }) {
  return (
    <div className="fade-up" style={{marginBottom:16,animationDelay:".05s"}}>
      {/* Toggle button */}
      <button
        onClick={onToggle}
        style={{
          width:"100%", display:"flex", alignItems:"center", justifyContent:"space-between",
          background:T.card, border:`1.5px solid ${open?T.accent:T.border}`,
          borderRadius: open ? "14px 14px 0 0" : 14,
          padding:"10px 16px", cursor:"pointer", transition:"all .25s",
          color: open ? T.text : T.muted,
        }}>
        <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:500}}>
          ℹ️ About WROXI
        </span>
        <span style={{
          display:"inline-flex", alignItems:"center", justifyContent:"center",
          width:22, height:22, borderRadius:"50%",
          background: open ? T.accent : T.border+"88",
          color: open ? "#fff" : T.muted,
          fontSize:14, fontWeight:700, transition:"all .25s",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
        }}>+</span>
      </button>

      {/* Expandable content */}
      {open && (
        <div style={{
          background:T.surface, border:`1.5px solid ${T.accent}`,
          borderTop:"none", borderRadius:"0 0 14px 14px",
          padding:"18px 16px", animation:"fadeIn .3s ease both",
        }}>
          {/* App info */}
          <div className="about-badge">ABOUT THE APP</div>
          <p style={{color:T.muted,fontSize:12,lineHeight:1.75,margin:"8px 0 14px"}}>
            WROXI is a next-generation social platform for global voices — a free, safe space
            to express, connect, and grow, regardless of where you're from.
          </p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:16}}>
            {[["🚀","Launched","2025"],["🌍","Reach","Global"],["🔒","Security","E2E"],["💬","Vibe","Growing"]].map(([ic,lb,vl])=>(
              <div key={lb} style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:"9px 11px"}}>
                <div style={{fontSize:16,marginBottom:2}}>{ic}</div>
                <div style={{fontSize:9,color:T.muted,textTransform:"uppercase",letterSpacing:1}}>{lb}</div>
                <div style={{fontSize:12,fontWeight:600,color:T.text,marginTop:1}}>{vl}</div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div style={{height:1,background:T.border,margin:"12px 0"}} />

          {/* Creator */}
          <div className="about-badge">CREATOR</div>
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"8px 0 10px"}}>
            <Av initials="SA" size={46} />
            <div>
              <div className="heading" style={{fontSize:15}}>Sohel Ahmmed</div>
              <div style={{color:T.accentB,fontSize:11,marginTop:2}}>@sohel · Founder & Builder</div>
              <div style={{color:T.muted,fontSize:10,marginTop:2}}>EEE Engineer · Bangladesh 🇧🇩</div>
            </div>
          </div>
          <p style={{color:T.muted,fontSize:12,lineHeight:1.7}}>
            Built WROXI to create an inclusive space connecting communities worldwide.
            Passionate about technology, engineering, and human connection.
          </p>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════════════════════
function AuthScreen({ onLogin, usersRef }) {
  const [tab,setTab]=useState("login");
  const [showAbout,setShowAbout]=useState(false); // accordion open/close
  const [notify,setNotify]=useState(null);
  const toast=(msg,type="success")=>setNotify({msg,type});
  const [lE,setLE]=useState(""); const [lP,setLP]=useState(""); const [lErr,setLErr]=useState("");
  const [sN,setSN]=useState(""); const [sU,setSU]=useState(""); const [sE,setSE]=useState("");
  const [sP,setSP]=useState(""); const [sP2,setSP2]=useState(""); const [sErr,setSErr]=useState("");
  const [fE,setFE]=useState(""); const [fErr,setFErr]=useState("");
  const [otp,setOtp]=useState(""); const [fakeOtp,setFakeOtp]=useState("");
  const [nP,setNP]=useState(""); const [nP2,setNP2]=useState("");

  const doLogin=()=>{
    setLErr("");
    const u=usersRef.current[lE.toLowerCase()];
    if(!u) return setLErr("No account found with this email.");
    if(u.password!==hashPw(lP)) return setLErr("Incorrect password.");
    toast("Welcome back, "+u.name+"! 🎉");
    setTimeout(()=>onLogin(u),700);
  };
  const doSignup=()=>{
    setSErr("");
    if(!sN||!sU||!sE||!sP||!sP2) return setSErr("Please fill all fields.");
    if(!/^[a-z0-9_]{3,20}$/.test(sU)) return setSErr("Username: 3–20 chars, lowercase/numbers only.");
    if(!/\S+@\S+\.\S+/.test(sE)) return setSErr("Enter a valid email address.");
    if(sP.length<8) return setSErr("Password must be at least 8 characters.");
    if(sP!==sP2) return setSErr("Passwords don't match.");
    if(usersRef.current[sE.toLowerCase()]) return setSErr("Email already registered.");
    const av=(sN[0]+(sN.split(" ")[1]?.[0]||"")).toUpperCase();
    const nu={id:uid(),name:sN,username:sU,password:hashPw(sP),bio:"",
      email:sE,joined:"Apr 2026",verified:false,avatar:av,followers:[],following:[]};
    usersRef.current[sE.toLowerCase()]=nu;
    toast("Account created! Welcome to WROXI 🚀");
    setTimeout(()=>onLogin(nu),700);
  };
  const doForgot=()=>{
    setFErr("");
    if(!usersRef.current[fE.toLowerCase()]) return setFErr("No account with this email.");
    const code=Math.floor(100000+Math.random()*900000).toString();
    setFakeOtp(code);
    toast(`OTP sent! (Demo code: ${code})`,"info");
    setTab("otp");
  };
  const doOTP=()=>{
    if(otp.length<6) return toast("Enter all 6 digits.","error");
    if(otp!==fakeOtp) return toast("Wrong OTP. Try again.","error");
    setTab("newpw");
  };
  const doNewPw=()=>{
    if(nP.length<8) return toast("Password needs 8+ characters.","error");
    if(nP!==nP2) return toast("Passwords don't match.","error");
    usersRef.current[fE.toLowerCase()].password=hashPw(nP);
    toast("Password updated! Please sign in. ✓");
    setTab("login"); setFE(""); setOtp(""); setFakeOtp(""); setNP(""); setNP2("");
  };

  return (
    <div style={{minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:18,position:"relative",overflow:"hidden"}}>
      <div style={{position:"fixed",inset:0,pointerEvents:"none",zIndex:0}}>
        <div style={{position:"absolute",top:"-12%",left:"-8%",width:460,height:460,borderRadius:"50%",background:`radial-gradient(circle,${T.accent}1C 0%,transparent 70%)`}} />
        <div style={{position:"absolute",bottom:"-12%",right:"-8%",width:360,height:360,borderRadius:"50%",background:`radial-gradient(circle,${T.accentB}14 0%,transparent 70%)`}} />
      </div>
      <div style={{position:"relative",zIndex:1,width:"100%",maxWidth:410}}>
        <div className="fade-up" style={{textAlign:"center",marginBottom:28}}>
          <div className="logo-text" style={{fontSize:48,background:`linear-gradient(135deg,${T.accent},${T.accentB})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WROXI</div>
          <div style={{color:T.muted,fontSize:11,letterSpacing:3,marginTop:1}}>SHARE YOUR WORLD</div>
        </div>
        <AboutAccordion open={showAbout} onToggle={()=>setShowAbout(s=>!s)} />
        <div className="card fade-up" style={{padding:24,animationDelay:".08s"}}>
          {tab==="login"&&<>
            <h2 className="heading" style={{fontSize:20,marginBottom:18}}>Welcome back</h2>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <input className={`input${lErr?" err":""}`} placeholder="Email address" value={lE} onChange={e=>setLE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              <input className={`input${lErr?" err":""}`} type="password" placeholder="Password" value={lP} onChange={e=>setLP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              {lErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {lErr}</div>}
              <button className="btn btn-primary" style={{width:"100%",marginTop:3}} onClick={doLogin}>Sign In</button>
            </div>
            <div style={{textAlign:"center",marginTop:13,fontSize:13,color:T.muted}}>
              <span style={{cursor:"pointer",color:T.accentB}} onClick={()=>{setTab("forgot");setFErr("")}}>Forgot password?</span>
            </div>
            <div style={{height:1,background:T.border,margin:"14px 0"}} />
            <div style={{textAlign:"center",fontSize:13,color:T.muted}}>
              New to WROXI?{" "}<span style={{cursor:"pointer",color:T.accent,fontWeight:600}} onClick={()=>{setTab("signup");setSErr("")}}>Create account</span>
            </div>
            <div style={{marginTop:13,padding:9,background:T.bg,borderRadius:9,fontSize:11,color:T.muted,textAlign:"center"}}>
              Demo: <b style={{color:T.text}}>demo@wroxi.com</b> / <b style={{color:T.text}}>demo123</b>
            </div>
          </>}
          {tab==="signup"&&<>
            <h2 className="heading" style={{fontSize:20,marginBottom:18}}>Create account</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input className="input" placeholder="Full name" value={sN} onChange={e=>setSN(e.target.value)} />
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:14}}>@</span>
                <input className="input" style={{paddingLeft:25}} placeholder="username" value={sU} onChange={e=>setSU(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} />
              </div>
              <input className="input" placeholder="Email address" value={sE} onChange={e=>setSE(e.target.value)} />
              <div><input className="input" type="password" placeholder="Password (min 8 chars)" value={sP} onChange={e=>setSP(e.target.value)} /><PwStrength pw={sP} /></div>
              <input className="input" type="password" placeholder="Confirm password" value={sP2} onChange={e=>setSP2(e.target.value)} />
              {sErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {sErr}</div>}
              <button className="btn btn-primary" style={{width:"100%",marginTop:3}} onClick={doSignup}>Create Account</button>
            </div>
            <div style={{textAlign:"center",marginTop:13,fontSize:13,color:T.muted}}>
              Already have an account?{" "}<span style={{cursor:"pointer",color:T.accent,fontWeight:600}} onClick={()=>{setTab("login");setLErr("")}}>Sign in</span>
            </div>
          </>}
          {tab==="forgot"&&<>
            <div style={{marginBottom:14}}><span style={{cursor:"pointer",color:T.muted,fontSize:13}} onClick={()=>setTab("login")}>← Back</span></div>
            <h2 className="heading" style={{fontSize:20,marginBottom:7}}>Recover password</h2>
            <p style={{color:T.muted,fontSize:13,marginBottom:18}}>Enter your registered email. We'll send an OTP code.</p>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <input className={`input${fErr?" err":""}`} placeholder="Email address" value={fE} onChange={e=>setFE(e.target.value)} />
              {fErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {fErr}</div>}
              <button className="btn btn-primary" style={{width:"100%"}} onClick={doForgot}>Send OTP Code</button>
            </div>
          </>}
          {tab==="otp"&&<>
            <div style={{textAlign:"center",marginBottom:18}}>
              <div style={{fontSize:32,marginBottom:5}}>📧</div>
              <h2 className="heading" style={{fontSize:20,marginBottom:5}}>Check your email</h2>
              <p style={{color:T.muted,fontSize:12}}>6-digit code sent to <b style={{color:T.text}}>{fE}</b></p>
            </div>
            <OTPInput value={otp} onChange={setOtp} />
            <button className="btn btn-primary" style={{width:"100%",marginTop:18}} onClick={doOTP}>Verify Code</button>
            <div style={{textAlign:"center",marginTop:11,fontSize:13}}>
              <span style={{color:T.muted}}>Didn't get it? </span>
              <span style={{cursor:"pointer",color:T.accent}} onClick={doForgot}>Resend</span>
            </div>
          </>}
          {tab==="newpw"&&<>
            <h2 className="heading" style={{fontSize:20,marginBottom:7}}>Set new password</h2>
            <p style={{color:T.muted,fontSize:13,marginBottom:18}}>Choose a strong password.</p>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div><input className="input" type="password" placeholder="New password" value={nP} onChange={e=>setNP(e.target.value)} /><PwStrength pw={nP} /></div>
              <input className="input" type="password" placeholder="Confirm new password" value={nP2} onChange={e=>setNP2(e.target.value)} />
              <button className="btn btn-primary" style={{width:"100%",marginTop:3}} onClick={doNewPw}>Update Password</button>
            </div>
          </>}
        </div>
      </div>
      {notify&&<Notify msg={notify.msg} type={notify.type} onDone={()=>setNotify(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  POST CARD
// ═══════════════════════════════════════════════════════════
function PostCard({ post, me, dark, onUpdate, onOpenProfile }) {
  const c=dark?T:{...T,...TL};
  const [showCmt,setShowCmt]=useState(false);
  const [cmtText,setCmtText]=useState("");
  const [replyTo,setReplyTo]=useState(null);
  const [replyText,setReplyText]=useState("");

  const liked=post.likes.includes(me.id);

  const toggleLike=()=>{
    const lk=liked?post.likes.filter(x=>x!==me.id):[...post.likes,me.id];
    onUpdate({...post,likes:lk});
  };
  const addComment=()=>{
    if(!cmtText.trim()) return;
    const nc={id:uid(),uid:me.id,name:me.name,username:me.username,avatar:me.avatar,
      text:cmtText.trim(),time:"just now",likes:[],dislikes:[],replies:[]};
    onUpdate({...post,comments:[...post.comments,nc]});
    setCmtText("");
  };
  const toggleCmtLike=(cid)=>{
    const comments=post.comments.map(c=>{
      if(c.id!==cid)return c;
      const lk=c.likes.includes(me.id)?c.likes.filter(x=>x!==me.id):[...c.likes,me.id];
      return {...c,likes:lk};
    });
    onUpdate({...post,comments});
  };
  const addReply=(cid,uname)=>{
    if(!replyText.trim())return;
    const rp={id:uid(),uid:me.id,name:me.name,username:me.username,avatar:me.avatar,
      text:replyText.trim(),time:"just now",likes:[],dislikes:[]};
    const comments=post.comments.map(c=>c.id===cid?{...c,replies:[...(c.replies||[]),rp]}:c);
    onUpdate({...post,comments});
    setReplyText(""); setReplyTo(null);
  };

  return (
    <div className="post-card" style={{marginBottom:11}}>
      <div style={{display:"flex",gap:10}}>
        <Av initials={post.avatar} size={38} onClick={()=>onOpenProfile(post.uid)} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span className="heading" style={{fontSize:13,cursor:"pointer"}} onClick={()=>onOpenProfile(post.uid)}>{post.name}</span>
            <span style={{color:c.muted,fontSize:12}}>@{post.username}</span>
            <span style={{color:c.muted,fontSize:11,marginLeft:"auto"}}>{post.time}</span>
          </div>
          <p style={{marginTop:7,fontSize:14,lineHeight:1.65,color:c.text,wordBreak:"break-word"}}>{post.content}</p>
          {post.image&&<div style={{marginTop:9}}><img src={post.image} alt="post" style={{width:"100%",maxHeight:320,objectFit:"cover"}} /></div>}
          <div style={{display:"flex",gap:2,marginTop:9,flexWrap:"wrap"}}>
            <button className={`act-btn${liked?" a-like":""}`} onClick={toggleLike}>{liked?"❤️":"🤍"} {post.likes.length}</button>
            <button className={`act-btn${showCmt?" a-comment":""}`} onClick={()=>setShowCmt(s=>!s)}>💬 {post.comments.length}</button>
          </div>
        </div>
      </div>

      {showCmt&&(
        <div className="comment-wrap">
          {/* add comment */}
          <div style={{display:"flex",gap:7,marginBottom:11}}>
            <Av initials={me.avatar} size={28} />
            <div style={{flex:1,display:"flex",gap:5}}>
              <input className="input" style={{padding:"6px 10px",fontSize:13}} placeholder="Write a comment…"
                value={cmtText} onChange={e=>setCmtText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} />
              <button className="btn btn-primary btn-xs" onClick={addComment} disabled={!cmtText.trim()}>Post</button>
            </div>
          </div>
          {post.comments.length===0&&<div style={{color:c.muted,fontSize:12,textAlign:"center",padding:"6px 0"}}>No comments yet. Be first!</div>}
          {post.comments.map(cm=>(
            <div key={cm.id} style={{marginBottom:9}}>
              <div style={{display:"flex",gap:7}}>
                <Av initials={cm.avatar} size={28} onClick={()=>onOpenProfile(cm.uid)} />
                <div style={{flex:1,background:dark?T.surface:TL.surface,borderRadius:11,padding:"7px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <span style={{fontWeight:600,fontSize:12,cursor:"pointer"}} onClick={()=>onOpenProfile(cm.uid)}>{cm.name}</span>
                    <span style={{color:c.muted,fontSize:11}}>@{cm.username}</span>
                    <span style={{color:c.muted,fontSize:10,marginLeft:"auto"}}>{cm.time}</span>
                  </div>
                  <p style={{fontSize:13,lineHeight:1.55,color:c.text}}>{cm.text}</p>
                  <div style={{display:"flex",gap:3,marginTop:5}}>
                    <button className={`act-btn${cm.likes.includes(me.id)?" a-like":""}`} style={{fontSize:12,padding:"3px 7px"}} onClick={()=>toggleCmtLike(cm.id)}>{cm.likes.includes(me.id)?"❤️":"🤍"} {cm.likes.length}</button>
                    <button className="act-btn" style={{fontSize:12,padding:"3px 7px"}} onClick={()=>setReplyTo(replyTo===cm.id?null:cm.id)}>
                      ↩ Reply{cm.replies?.length>0?` (${cm.replies.length})`:""}
                    </button>
                  </div>
                </div>
              </div>
              {/* replies */}
              {cm.replies?.map(rp=>(
                <div key={rp.id} className="reply-wrap">
                  <div style={{display:"flex",gap:6}}>
                    <Av initials={rp.avatar} size={22} onClick={()=>onOpenProfile(rp.uid)} />
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{fontWeight:600,fontSize:11}}>{rp.name}</span>
                        <span style={{color:c.muted,fontSize:10}}>@{rp.username}</span>
                      </div>
                      <p style={{fontSize:12,lineHeight:1.5,color:c.text}}>{rp.text}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* reply input */}
              {replyTo===cm.id&&(
                <div style={{display:"flex",gap:6,marginTop:7,marginLeft:32}}>
                  <Av initials={me.avatar} size={24} />
                  <div style={{flex:1,display:"flex",gap:5}}>
                    <input className="input" style={{padding:"5px 9px",fontSize:12}}
                      placeholder={`Reply to @${cm.username}…`} value={replyText}
                      onChange={e=>setReplyText(e.target.value)}
                      onKeyDown={e=>e.key==="Enter"&&addReply(cm.id,cm.username)} autoFocus />
                    <button className="btn btn-primary btn-xs" onClick={()=>addReply(cm.id,cm.username)} disabled={!replyText.trim()}>↩</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FOLLOW LIST MODAL
// ═══════════════════════════════════════════════════════════
function FollowListModal({ title, userIds, usersRef, me, onFollow, onClose, onOpenProfile }) {
  const list=userIds.map(id=>Object.values(usersRef.current).find(u=>u.id===id)).filter(Boolean);
  return (
    <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div className="modal fade-up" style={{maxWidth:370}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div className="heading" style={{fontSize:17}}>{title}</div>
          <button onClick={onClose} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>
        </div>
        {list.length===0&&<div style={{color:T.muted,textAlign:"center",padding:22,fontSize:13}}>No users yet.</div>}
        {list.map(u=>(
          <div key={u.id} className="follow-row">
            <div style={{display:"flex",alignItems:"center",gap:9,cursor:"pointer"}} onClick={()=>{onClose();onOpenProfile(u.id)}}>
              <Av initials={u.avatar} size={38} />
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{u.name}</div>
                <div style={{color:T.muted,fontSize:11}}>@{u.username}</div>
              </div>
            </div>
            {u.id!==me.id&&(
              <button className={`btn btn-xs ${(me.following||[]).includes(u.id)?"btn-following":"btn-follow"}`}
                onClick={()=>onFollow(u.id)}>
                {(me.following||[]).includes(u.id)?"Following":"Follow"}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PROFILE VIEW
// ═══════════════════════════════════════════════════════════
function ProfileView({ targetId, me, usersRef, posts, onFollow, onBack, onUpdate, onOpenProfile, dark, isMe }) {
  const c=dark?T:{...T,...TL};
  const [showList,setShowList]=useState(null);
  const target=Object.values(usersRef.current).find(u=>u.id===targetId)||me;
  const amFollowing=(me.following||[]).includes(target.id);
  const userPosts=posts.filter(p=>p.uid===target.id);

  return (
    <div className="fade-in">
      {!isMe&&<button className="btn btn-ghost btn-sm" style={{marginBottom:14}} onClick={onBack}>← Back</button>}
      <div className="card" style={{marginBottom:14,textAlign:"center",padding:26}}>
        <Av initials={target.avatar} size={66} />
        <div className="heading" style={{fontSize:20,marginTop:11}}>{target.name}</div>
        <div style={{color:T.accentB,fontSize:13,marginTop:3}}>@{target.username}</div>
        {target.verified&&<div style={{color:T.accent,fontSize:11,marginTop:3}}>✓ Verified</div>}
        {target.bio&&<p style={{color:c.muted,fontSize:13,marginTop:9,lineHeight:1.6}}>{target.bio}</p>}
        <div style={{display:"flex",justifyContent:"center",gap:26,marginTop:16}}>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowList("followers")}>
            <div className="heading" style={{fontSize:19}}>{(target.followers||[]).length}</div>
            <div style={{color:c.muted,fontSize:11}}>Followers</div>
          </div>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowList("following")}>
            <div className="heading" style={{fontSize:19}}>{(target.following||[]).length}</div>
            <div style={{color:c.muted,fontSize:11}}>Following</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div className="heading" style={{fontSize:19}}>{userPosts.length}</div>
            <div style={{color:c.muted,fontSize:11}}>Posts</div>
          </div>
        </div>
        <div style={{fontSize:11,color:c.muted,marginTop:5}}>Joined {target.joined}</div>
        {!isMe&&(
          <button className={`btn btn-sm ${amFollowing?"btn-following":"btn-follow"}`}
            style={{marginTop:14,minWidth:110}} onClick={()=>onFollow(target.id)}>
            {amFollowing?"✓ Following":"+ Follow"}
          </button>
        )}
      </div>
      <div className="heading" style={{fontSize:13,color:c.muted,marginBottom:11}}>Posts ({userPosts.length})</div>
      {userPosts.length===0
        ?<div style={{textAlign:"center",color:c.muted,padding:28,fontSize:14}}>No posts yet ✨</div>
        :userPosts.map(p=><PostCard key={p.id} post={p} me={me} dark={dark} onUpdate={onUpdate} onOpenProfile={onOpenProfile} />)
      }
      {showList&&(
        <FollowListModal title={showList==="followers"?"Followers":"Following"}
          userIds={showList==="followers"?(target.followers||[]):(target.following||[])}
          usersRef={usersRef} me={me} onFollow={onFollow}
          onClose={()=>setShowList(null)}
          onOpenProfile={(id)=>{setShowList(null);onOpenProfile(id)}} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MESSAGES
// ═══════════════════════════════════════════════════════════
function MessagesPage({ me, usersRef, msgsRef, dark }) {
  const c=dark?T:{...T,...TL};
  const [active,setActive]=useState(null);
  const [msgText,setMsgText]=useState("");
  const [tick,setTick]=useState(0);
  const bottomRef=useRef();
  const otherUsers=Object.values(usersRef.current).filter(u=>u.id!==me.id);
  const convKey=(a,b)=>[a,b].sort().join("_");
  const getConv=(uid2)=>msgsRef.current[convKey(me.id,uid2)]||[];
  const sendMsg=()=>{
    if(!msgText.trim()||!active)return;
    const key=convKey(me.id,active);
    if(!msgsRef.current[key])msgsRef.current[key]=[];
    msgsRef.current[key].push({id:uid(),from:me.id,text:msgText.trim(),
      time:new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})});
    setMsgText(""); setTick(n=>n+1);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
  };
  const activeUser=active?Object.values(usersRef.current).find(u=>u.id===active):null;
  const conv=active?getConv(active):[];

  return (
    <div style={{display:"flex",gap:11,height:"calc(100vh - 140px)",minHeight:360}}>
      {/* sidebar */}
      <div style={{width:active?210:undefined,flex:active?"none":1,flexShrink:0,overflowY:"auto"}}>
        <div className="heading" style={{fontSize:14,marginBottom:11,color:c.muted}}>Messages</div>
        {otherUsers.length===0&&<div style={{color:c.muted,fontSize:13,textAlign:"center",padding:18}}>No users yet.</div>}
        {otherUsers.map(u=>{
          const last=getConv(u.id).slice(-1)[0];
          return (
            <div key={u.id} onClick={()=>setActive(u.id)}
              style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:13,cursor:"pointer",marginBottom:3,
                background:active===u.id?(dark?T.accent+"20":TL.surface):"transparent",transition:"background .15s"}}
              onMouseEnter={e=>{if(active!==u.id)e.currentTarget.style.background=dark?T.card:TL.card}}
              onMouseLeave={e=>{if(active!==u.id)e.currentTarget.style.background="transparent"}}>
              <Av initials={u.avatar} size={38} />
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontWeight:600,fontSize:13}}>{u.name}</div>
                <div style={{color:c.muted,fontSize:11,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                  {last?last.text:"Say hello 👋"}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* chat */}
      {active&&activeUser&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",background:dark?T.surface:TL.surface,borderRadius:16,border:`1px solid ${c.border}`,overflow:"hidden",minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderBottom:`1px solid ${c.border}`,flexShrink:0}}>
            <button onClick={()=>setActive(null)} style={{background:"none",border:"none",color:c.muted,cursor:"pointer",fontSize:17,padding:"2px 5px"}}>←</button>
            <Av initials={activeUser.avatar} size={33} />
            <div>
              <div style={{fontWeight:600,fontSize:13}}>{activeUser.name}</div>
              <div style={{color:c.muted,fontSize:11}}>@{activeUser.username}</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px 12px",display:"flex",flexDirection:"column",gap:7}}>
            {conv.length===0&&<div style={{textAlign:"center",color:c.muted,fontSize:13,marginTop:36}}>No messages yet. Say hi! 👋</div>}
            {conv.map(m=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.from===me.id?"flex-end":"flex-start"}}>
                <div>
                  <div className={m.from===me.id?"msg-me":"msg-them"}>{m.text}</div>
                  <div style={{fontSize:10,color:c.muted,marginTop:3,textAlign:m.from===me.id?"right":"left"}}>{m.time}</div>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>
          <div style={{display:"flex",gap:7,padding:"9px 11px",borderTop:`1px solid ${c.border}`,flexShrink:0}}>
            <input className="input" style={{flex:1,padding:"8px 12px",fontSize:13}}
              placeholder="Type a message…" value={msgText}
              onChange={e=>setMsgText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&sendMsg()} />
            <button className="btn btn-primary btn-sm" onClick={sendMsg} disabled={!msgText.trim()}>Send</button>
          </div>
        </div>
      )}
      {!active&&otherUsers.length>0&&(
        <div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:c.muted,fontSize:14}}>
          Select a conversation 💬
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FEED SCREEN (main)
// ═══════════════════════════════════════════════════════════
function FeedScreen({ initUser, usersRef, onLogout }) {
  const [me,setMe]=useState(initUser);
  const [posts,setPosts]=useState(INIT_POSTS);
  const [page,setPage]=useState("home");
  const [profileId,setProfileId]=useState(null);
  const [draft,setDraft]=useState("");
  const [draftImg,setDraftImg]=useState(null);
  const [dark,setDark]=useState(true);
  const [notify,setNotify]=useState(null);
  const msgsRef=useRef(INIT_MSGS);
  const imgRef=useRef();
  const MAX=280;
  const c=dark?T:{...T,...TL};
  const toast=(msg,type="success")=>setNotify({msg,type});

  useEffect(()=>{ usersRef.current[me.email]=me; },[me]);

  const submitPost=()=>{
    if(!draft.trim()&&!draftImg)return;
    const p={id:uid(),uid:me.id,name:me.name,username:me.username,avatar:me.avatar,
      content:draft.trim(),image:draftImg,likes:[],dislikes:[],time:"just now",comments:[]};
    setPosts(prev=>[p,...prev]);
    setDraft(""); setDraftImg(null);
    toast("Posted! ✨");
  };
  const updatePost=(updated)=>setPosts(prev=>prev.map(p=>p.id===updated.id?updated:p));

  const handleImg=(e)=>{
    const file=e.target.files[0]; if(!file)return;
    if(file.size>5*1024*1024)return toast("Image must be under 5MB","error");
    const reader=new FileReader();
    reader.onload=ev=>setDraftImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openProfile=(uid2)=>{
    if(uid2===me.id){setPage("profile");setProfileId(null);}
    else{setProfileId(uid2);setPage("otherProfile");}
  };

  const handleFollow=(targetId)=>{
    const target=Object.values(usersRef.current).find(u=>u.id===targetId);
    if(!target)return;
    const amF=(me.following||[]).includes(targetId);
    const newMe={...me,following:amF?(me.following||[]).filter(x=>x!==targetId):[...(me.following||[]),targetId]};
    const newTarget={...target,followers:amF?(target.followers||[]).filter(x=>x!==me.id):[...(target.followers||[]),me.id]};
    usersRef.current[target.email]=newTarget;
    setMe(newMe);
    toast(amF?`Unfollowed @${target.username}`:`Now following @${target.username} ✓`);
  };

  const TABS=[{id:"home",icon:"🏠",label:"Feed"},{id:"messages",icon:"💬",label:"Messages"},{id:"profile",icon:"👤",label:"Profile"}];
  const profileActive=page==="profile"||page==="otherProfile";

  return (
    <div style={{minHeight:"100vh",background:c.bg,color:c.text,transition:"background .3s"}}>
      <style>{makeCSS(dark)}</style>
      <nav className="nav">
        <div className="logo-text" style={{fontSize:21,background:`linear-gradient(135deg,${T.accent},${T.accentB})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WROXI</div>
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <button onClick={()=>setDark(d=>!d)}
            style={{background:"none",border:`1px solid ${c.border}`,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:14,color:c.muted,transition:"all .2s"}}
            onMouseEnter={e=>e.currentTarget.style.borderColor=T.accent}
            onMouseLeave={e=>e.currentTarget.style.borderColor=c.border}>
            {dark?"☀️":"🌙"}
          </button>
          <Av initials={me.avatar} size={32} onClick={()=>{setPage("profile");setProfileId(null)}} />
        </div>
      </nav>

      <div style={{maxWidth:600,margin:"0 auto",padding:"14px 13px 70px"}}>
        <div className="tab-bar fade-up" style={{marginBottom:16}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${(page===t.id||(t.id==="profile"&&profileActive))?"active":""}`}
              onClick={()=>{setPage(t.id);if(t.id==="profile")setProfileId(null);}}>
              {t.icon} <span className="hide-sm">{t.label}</span>
            </button>
          ))}
        </div>

        {/* HOME */}
        {page==="home"&&<>
          <div className="card fade-up" style={{marginBottom:14,animationDelay:".03s"}}>
            <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
              <Av initials={me.avatar} size={36} />
              <div style={{flex:1}}>
                <textarea className="input" placeholder="What's on your mind?"
                  value={draft} onChange={e=>setDraft(e.target.value.slice(0,MAX))}
                  rows={3} style={{resize:"none",fontSize:14}} />
                {draftImg&&(
                  <div style={{position:"relative",marginTop:7}}>
                    <img src={draftImg} alt="preview" style={{width:"100%",maxHeight:180,objectFit:"cover"}} />
                    <button onClick={()=>setDraftImg(null)}
                      style={{position:"absolute",top:6,right:6,background:"#000A",border:"none",color:"#fff",
                        borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13}}>×</button>
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:9,gap:7}}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <button className="btn btn-ghost btn-xs" onClick={()=>imgRef.current?.click()}>📷 Photo</button>
                    <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg} />
                    <span style={{fontSize:11,color:draft.length>MAX*.85?T.danger:c.muted}}>{draft.length}/{MAX}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={submitPost} disabled={!draft.trim()&&!draftImg}>Post</button>
                </div>
              </div>
            </div>
          </div>
          {posts.map((p,i)=>(
            <div key={p.id} className="fade-up" style={{animationDelay:`${.05+i*.03}s`}}>
              <PostCard post={p} me={me} dark={dark} onUpdate={updatePost} onOpenProfile={openProfile} />
            </div>
          ))}
        </>}

        {/* MESSAGES */}
        {page==="messages"&&<MessagesPage me={me} usersRef={usersRef} msgsRef={msgsRef} dark={dark} />}

        {/* MY PROFILE */}
        {page==="profile"&&<>
          <ProfileView targetId={me.id} me={me} usersRef={usersRef} posts={posts}
            onFollow={handleFollow} onBack={()=>setPage("home")} onUpdate={updatePost}
            onOpenProfile={openProfile} dark={dark} isMe={true} />
          <div style={{marginTop:14,textAlign:"center"}}>
            <button className="btn btn-ghost" onClick={onLogout}>Sign out</button>
          </div>
        </>}

        {/* OTHER PROFILE */}
        {page==="otherProfile"&&profileId&&(
          <ProfileView targetId={profileId} me={me} usersRef={usersRef} posts={posts}
            onFollow={handleFollow} onBack={()=>setPage("home")} onUpdate={updatePost}
            onOpenProfile={openProfile} dark={dark} isMe={false} />
        )}
      </div>
      {notify&&<Notify msg={notify.msg} type={notify.type} onDone={()=>setNotify(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ROOT
// ═══════════════════════════════════════════════════════════
export default function WROXI() {
  const usersRef=useRef({...INIT_USERS});
  const [user,setUser]=useState(null);
  return user
    ?<FeedScreen initUser={user} usersRef={usersRef} onLogout={()=>setUser(null)} />
    :<AuthScreen onLogin={setUser} usersRef={usersRef} />;
}
