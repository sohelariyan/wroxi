import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// ═══════════════════════════════════════════════════════════
//  SUPABASE CLIENT
// ═══════════════════════════════════════════════════════════
const SUPABASE_URL = "https://wgrbaqqcsdotvqqxuyau.supabase.co";
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndncmJhcXFjc2RvdHZxcXh1eWF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzczNzI2MTQsImV4cCI6MjA5Mjk0ODYxNH0.iG5-zRl5X4Ur4QH6pT1uyuPiYZEG3tuvNpIusf9ocoo";
const sb = createClient(SUPABASE_URL, SUPABASE_ANON);

// ═══════════════════════════════════════════════════════════
//  HELPERS
// ═══════════════════════════════════════════════════════════
const timeAgo = (ts) => {
  if (!ts) return "";
  const diff = (Date.now() - new Date(ts)) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return `${Math.floor(diff/86400)}d ago`;
};
const avatarText = (name="?") => {
  const parts = name.trim().split(" ");
  return (parts[0][0] + (parts[1]?.[0]||"")).toUpperCase();
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
@keyframes spin{to{transform:rotate(360deg)}}
.fade-up{animation:fadeUp .4s cubic-bezier(.22,.68,0,1.15) both}
.fade-in{animation:fadeIn .3s ease both}
.logo-text{font-family:'Syne',sans-serif;font-weight:800;letter-spacing:-1.5px;cursor:pointer}
.heading{font-family:'Syne',sans-serif;font-weight:700}
.spinner{width:20px;height:20px;border:2px solid ${T.border};border-top-color:${T.accent};border-radius:50%;animation:spin .7s linear infinite;display:inline-block}
.btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:9px 18px;border-radius:11px;border:none;cursor:pointer;font-size:14px;font-weight:500;transition:all .18s;outline:none;white-space:nowrap}
.btn-primary{background:linear-gradient(135deg,${T.accent},#8B5CF6);color:#fff}
.btn-primary:hover{opacity:.85;transform:translateY(-1px);box-shadow:0 6px 18px ${T.accent}44}
.btn-primary:disabled{opacity:.38;cursor:not-allowed;transform:none;box-shadow:none}
.btn-ghost{background:transparent;color:${c.muted};border:1.5px solid ${c.border}}
.btn-ghost:hover{border-color:${T.accent};color:${c.text}}
.btn-danger{background:${T.danger}18;color:${T.danger};border:1.5px solid ${T.danger}44}
.btn-danger:hover{background:${T.danger};color:#fff}
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
.avatar{display:inline-flex;align-items:center;justify-content:center;border-radius:50%;font-family:'Syne',sans-serif;font-weight:700;flex-shrink:0;cursor:pointer}
.post-card{background:${c.card};border:1px solid ${c.border};border-radius:17px;padding:15px;transition:border-color .2s;margin-bottom:11px}
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
.nav{position:sticky;top:0;z-index:100;backdrop-filter:blur(18px);background:${c.bg}DD;border-bottom:1px solid ${c.border};padding:11px 17px;display:flex;align-items:center;justify-content:space-between;gap:10px}
.search-bar{display:flex;align-items:center;gap:8px;background:${c.card};border:1.5px solid ${c.border};border-radius:11px;padding:7px 13px;flex:1;max-width:320px;transition:border .18s}
.search-bar:focus-within{border-color:${T.accent}}
.search-bar input{background:none;border:none;outline:none;color:${c.text};font-size:14px;width:100%}
.msg-me{background:linear-gradient(135deg,${T.accent},#8B5CF6);color:#fff;border-radius:17px 17px 4px 17px;padding:9px 13px;max-width:70%;font-size:13px;line-height:1.5;word-break:break-word;align-self:flex-end}
.msg-them{background:${c.card};border:1px solid ${c.border};color:${c.text};border-radius:17px 17px 17px 4px;padding:9px 13px;max-width:70%;font-size:13px;line-height:1.5;word-break:break-word;align-self:flex-start}
.notify{position:fixed;bottom:20px;right:20px;z-index:999;padding:11px 16px;border-radius:13px;font-size:13px;font-weight:500;animation:fadeUp .3s ease both;max-width:270px;pointer-events:none}
.notify.success{background:#0D2D2A;border:1px solid ${T.success};color:${T.success}}
.notify.error{background:#2D0D0D;border:1px solid ${T.danger};color:${T.danger}}
.notify.info{background:#1A1A2E;border:1px solid ${T.accent};color:${T.accent}}
.about-badge{display:inline-block;padding:3px 10px;border-radius:99px;background:${T.accent}22;color:${T.accent};font-size:11px;font-weight:600;letter-spacing:.5px;margin-bottom:9px}
.mention{color:${T.accent};font-weight:600;cursor:pointer}
.mention:hover{text-decoration:underline}
.search-result{padding:10px 12px;border-radius:11px;cursor:pointer;display:flex;align-items:center;gap:10px;transition:background .15s}
.search-result:hover{background:${c.border}55}
.dropdown{position:absolute;top:100%;left:0;right:0;background:${c.surface};border:1px solid ${c.border};border-radius:12px;margin-top:4px;z-index:50;max-height:260px;overflow-y:auto;box-shadow:0 8px 24px #0008}
@media(max-width:600px){.modal{padding:18px}.otp-box{width:38px;height:44px;font-size:16px}.hide-sm{display:none}}
`};

// ═══════════════════════════════════════════════════════════
//  SMALL COMPONENTS
// ═══════════════════════════════════════════════════════════
function Notify({ msg, type="success", onDone }) {
  useEffect(()=>{ const t=setTimeout(onDone,3200); return()=>clearTimeout(t); },[]);
  return <div className={`notify ${type}`}>{type==="success"?"✓ ":type==="error"?"✕ ":"ℹ "}{msg}</div>;
}

function Spinner() { return <span className="spinner" />; }

function Av({ name="?", size=40, onClick }) {
  const COLS=["#6C63FF","#4ECDC4","#FF6B6B","#F7B731","#A29BFE","#FD79A8","#26de81","#fd9644"];
  const txt = avatarText(name);
  const col = COLS[txt.charCodeAt(0)%COLS.length];
  return (
    <span className="avatar" onClick={onClick}
      style={{width:size,height:size,fontSize:size*.36,background:col+"28",color:col,border:`2px solid ${col}50`}}>
      {txt}
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
//  ABOUT ACCORDION
// ═══════════════════════════════════════════════════════════
function AboutAccordion({ open, onToggle }) {
  return (
    <div style={{marginBottom:16}}>
      <button onClick={onToggle} style={{width:"100%",display:"flex",alignItems:"center",justifyContent:"space-between",background:T.card,border:`1.5px solid ${open?T.accent:T.border}`,borderRadius:open?"14px 14px 0 0":14,padding:"10px 16px",cursor:"pointer",transition:"all .25s",color:open?T.text:T.muted}}>
        <span style={{display:"flex",alignItems:"center",gap:7,fontSize:13,fontWeight:500}}>ℹ️ About WROXI</span>
        <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",width:22,height:22,borderRadius:"50%",background:open?T.accent:T.border+"88",color:open?"#fff":T.muted,fontSize:14,fontWeight:700,transition:"all .25s",transform:open?"rotate(45deg)":"rotate(0deg)"}}>+</span>
      </button>
      {open&&(
        <div style={{background:T.surface,border:`1.5px solid ${T.accent}`,borderTop:"none",borderRadius:"0 0 14px 14px",padding:"18px 16px",animation:"fadeIn .3s ease both"}}>
          <div className="about-badge">ABOUT THE APP</div>
          <p style={{color:T.muted,fontSize:12,lineHeight:1.75,margin:"8px 0 14px"}}>WROXI is a next-generation social platform for global voices — a free, safe space to express, connect, and grow.</p>
          <div style={{height:1,background:T.border,margin:"12px 0"}} />
          <div className="about-badge">CREATOR</div>
          <div style={{display:"flex",alignItems:"center",gap:10,margin:"8px 0"}}>
            <Av name="Sohel Ahmmed" size={46} />
            <div>
              <div className="heading" style={{fontSize:15}}>Sohel Ahmmed</div>
              <div style={{color:T.accentB,fontSize:11,marginTop:2}}>@sohel · Founder & Builder</div>
              <div style={{color:T.muted,fontSize:10,marginTop:2}}>EEE Engineer · Bangladesh 🇧🇩</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RENDER CONTENT WITH MENTIONS
// ═══════════════════════════════════════════════════════════
function RenderContent({ text, onMentionClick }) {
  if (!text) return null;
  const parts = text.split(/(@\w+)/g);
  return (
    <span>
      {parts.map((p,i)=>
        p.startsWith("@")
          ? <span key={i} className="mention" onClick={()=>onMentionClick(p.slice(1))}>{p}</span>
          : p
      )}
    </span>
  );
}

// ═══════════════════════════════════════════════════════════
//  AUTH SCREEN
// ═══════════════════════════════════════════════════════════
function AuthScreen({ onLogin }) {
  const [tab,setTab]=useState("login");
  const [showAbout,setShowAbout]=useState(false);
  const [loading,setLoading]=useState(false);
  const [notify,setNotify]=useState(null);
  const toast=(msg,type="success")=>setNotify({msg,type});

  // login
  const [lE,setLE]=useState(""); const [lP,setLP]=useState(""); const [lErr,setLErr]=useState("");
  // signup
  const [sName,setSName]=useState(""); const [sUser,setSUser]=useState("");
  const [sE,setSE]=useState(""); const [sP,setSP]=useState(""); const [sP2,setSP2]=useState(""); const [sErr,setSErr]=useState("");
  // forgot
  const [fE,setFE]=useState(""); const [fErr,setFErr]=useState("");
  const [otp,setOtp]=useState(""); const [newPw,setNewPw]=useState(""); const [newPw2,setNewPw2]=useState("");
  const [otpSent,setOtpSent]=useState(false);

  const doLogin = async () => {
    setLErr(""); setLoading(true);
    const {data,error} = await sb.auth.signInWithPassword({email:lE,password:lP});
    setLoading(false);
    if(error) return setLErr(error.message==="Invalid login credentials"?"Wrong email or password.":error.message);
    const {data:prof} = await sb.from("profiles").select("*").eq("id",data.user.id).single();
    onLogin({...data.user, profile:prof});
  };

  const doSignup = async () => {
    setSErr(""); 
    if(!sName||!sUser||!sE||!sP||!sP2) return setSErr("Please fill all fields.");
    if(!/^[a-z0-9_]{3,20}$/.test(sUser)) return setSErr("Username: 3–20 chars, lowercase/numbers only.");
    if(sP.length<8) return setSErr("Password must be at least 8 characters.");
    if(sP!==sP2) return setSErr("Passwords don't match.");
    setLoading(true);
    // Check username unique
    const {data:existing} = await sb.from("profiles").select("id").eq("username",sUser).single();
    if(existing) { setLoading(false); return setSErr("This username is already taken. Choose another."); }
    const {data,error} = await sb.auth.signUp({email:sE,password:sP,options:{data:{full_name:sName,username:sUser}}});
    if(error) { setLoading(false); return setSErr(error.message); }
    // Create profile
    await sb.from("profiles").insert({id:data.user.id,username:sUser,full_name:sName,bio:"",avatar:null});
    setLoading(false);
    toast("Account created! Check your email to verify, then log in. 📧","info");
    setTab("login");
  };

  const doForgot = async () => {
    setFErr(""); setLoading(true);
    const {error} = await sb.auth.resetPasswordForEmail(fE,{redirectTo:window.location.origin});
    setLoading(false);
    if(error) return setFErr(error.message);
    setOtpSent(true);
    toast("Password reset email sent! Check your inbox. 📧","info");
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

        <div className="fade-up" style={{animationDelay:".05s"}}>
          <AboutAccordion open={showAbout} onToggle={()=>setShowAbout(s=>!s)} />
        </div>

        <div className="card fade-up" style={{padding:24,animationDelay:".08s"}}>

          {tab==="login"&&<>
            <h2 className="heading" style={{fontSize:20,marginBottom:18}}>Welcome back</h2>
            <div style={{display:"flex",flexDirection:"column",gap:11}}>
              <input className={`input${lErr?" err":""}`} placeholder="Email address" value={lE} onChange={e=>setLE(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              <input className={`input${lErr?" err":""}`} type="password" placeholder="Password" value={lP} onChange={e=>setLP(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doLogin()} />
              {lErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {lErr}</div>}
              <button className="btn btn-primary" style={{width:"100%",marginTop:3}} onClick={doLogin} disabled={loading}>
                {loading?<Spinner/>:"Sign In"}
              </button>
            </div>
            <div style={{textAlign:"center",marginTop:13,fontSize:13,color:T.muted}}>
              <span style={{cursor:"pointer",color:T.accentB}} onClick={()=>{setTab("forgot");setFErr("")}}>Forgot password?</span>
            </div>
            <div style={{height:1,background:T.border,margin:"14px 0"}} />
            <div style={{textAlign:"center",fontSize:13,color:T.muted}}>
              New to WROXI?{" "}<span style={{cursor:"pointer",color:T.accent,fontWeight:600}} onClick={()=>{setTab("signup");setSErr("")}}>Create account</span>
            </div>
          </>}

          {tab==="signup"&&<>
            <h2 className="heading" style={{fontSize:20,marginBottom:18}}>Create account</h2>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <input className="input" placeholder="Full name" value={sName} onChange={e=>setSName(e.target.value)} />
              <div style={{position:"relative"}}>
                <span style={{position:"absolute",left:12,top:"50%",transform:"translateY(-50%)",color:T.muted,fontSize:14}}>@</span>
                <input className="input" style={{paddingLeft:25}} placeholder="username" value={sUser} onChange={e=>setSUser(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))} />
              </div>
              <input className="input" placeholder="Email address" value={sE} onChange={e=>setSE(e.target.value)} />
              <div><input className="input" type="password" placeholder="Password (min 8 chars)" value={sP} onChange={e=>setSP(e.target.value)} /><PwStrength pw={sP} /></div>
              <input className="input" type="password" placeholder="Confirm password" value={sP2} onChange={e=>setSP2(e.target.value)} />
              {sErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {sErr}</div>}
              <button className="btn btn-primary" style={{width:"100%",marginTop:3}} onClick={doSignup} disabled={loading}>
                {loading?<Spinner/>:"Create Account"}
              </button>
            </div>
            <div style={{textAlign:"center",marginTop:13,fontSize:13,color:T.muted}}>
              Already have an account?{" "}<span style={{cursor:"pointer",color:T.accent,fontWeight:600}} onClick={()=>{setTab("login");setLErr("")}}>Sign in</span>
            </div>
          </>}

          {tab==="forgot"&&<>
            <div style={{marginBottom:14}}><span style={{cursor:"pointer",color:T.muted,fontSize:13}} onClick={()=>setTab("login")}>← Back</span></div>
            <h2 className="heading" style={{fontSize:20,marginBottom:7}}>Recover password</h2>
            <p style={{color:T.muted,fontSize:13,marginBottom:18}}>Enter your registered email. We'll send a reset link.</p>
            {!otpSent?<>
              <div style={{display:"flex",flexDirection:"column",gap:11}}>
                <input className={`input${fErr?" err":""}`} placeholder="Email address" value={fE} onChange={e=>setFE(e.target.value)} />
                {fErr&&<div style={{color:T.danger,fontSize:12}}>⚠ {fErr}</div>}
                <button className="btn btn-primary" style={{width:"100%"}} onClick={doForgot} disabled={loading}>
                  {loading?<Spinner/>:"Send Reset Link"}
                </button>
              </div>
            </>:<>
              <div style={{textAlign:"center",padding:"20px 0"}}>
                <div style={{fontSize:40,marginBottom:10}}>📧</div>
                <p style={{color:T.muted,fontSize:13,lineHeight:1.7}}>Reset link sent to <b style={{color:T.text}}>{fE}</b>.<br/>Check your inbox and click the link.</p>
                <button className="btn btn-ghost" style={{marginTop:16}} onClick={()=>{setOtpSent(false);setTab("login")}}>Back to Login</button>
              </div>
            </>}
          </>}

        </div>
      </div>
      {notify&&<Notify msg={notify.msg} type={notify.type} onDone={()=>setNotify(null)} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SEARCH BAR
// ═══════════════════════════════════════════════════════════
function SearchBar({ onOpenProfile, dark }) {
  const c=dark?T:{...T,...TL};
  const [q,setQ]=useState("");
  const [results,setResults]=useState([]);
  const [open,setOpen]=useState(false);
  const [loading,setLoading]=useState(false);
  const ref=useRef();

  useEffect(()=>{
    const handler=(e)=>{ if(ref.current&&!ref.current.contains(e.target))setOpen(false); };
    document.addEventListener("mousedown",handler);
    return()=>document.removeEventListener("mousedown",handler);
  },[]);

  useEffect(()=>{
    if(!q.trim()){setResults([]);setOpen(false);return;}
    const timer=setTimeout(async()=>{
      setLoading(true);
      const {data}=await sb.from("profiles").select("*").or(`username.ilike.%${q}%,full_name.ilike.%${q}%`).limit(8);
      setResults(data||[]);setOpen(true);setLoading(false);
    },350);
    return()=>clearTimeout(timer);
  },[q]);

  return (
    <div ref={ref} style={{position:"relative",flex:1,maxWidth:280}}>
      <div className="search-bar">
        <span style={{color:c.muted,fontSize:14}}>🔍</span>
        <input placeholder="Search users or posts…" value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>q&&setOpen(true)} />
        {loading&&<Spinner/>}
      </div>
      {open&&results.length>0&&(
        <div className="dropdown">
          {results.map(u=>(
            <div key={u.id} className="search-result" onClick={()=>{onOpenProfile(u.id);setQ("");setOpen(false);}}>
              <Av name={u.full_name||u.username} size={34} />
              <div>
                <div style={{fontWeight:600,fontSize:13}}>{u.full_name}</div>
                <div style={{color:c.muted,fontSize:11}}>@{u.username}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {open&&results.length===0&&!loading&&q&&(
        <div className="dropdown" style={{padding:"14px",color:c.muted,fontSize:13,textAlign:"center"}}>No users found</div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  POST CARD
// ═══════════════════════════════════════════════════════════
function PostCard({ post, me, dark, onOpenProfile, onDeleted }) {
  const c=dark?T:{...T,...TL};
  const [liked,setLiked]=useState(post.liked||false);
  const [likeCount,setLikeCount]=useState(post.like_count||0);
  const [showCmt,setShowCmt]=useState(false);
  const [comments,setComments]=useState([]);
  const [cmtText,setCmtText]=useState("");
  const [replyTo,setReplyTo]=useState(null);
  const [replyText,setReplyText]=useState("");
  const [cmtLoading,setCmtLoading]=useState(false);
  const [showMenu,setShowMenu]=useState(false);
  const isOwn = me.id===post.user_id;

  const toggleLike = async () => {
    if(liked){
      await sb.from("likes").delete().eq("user_id",me.id).eq("post_id",post.id);
      setLiked(false); setLikeCount(n=>n-1);
    } else {
      await sb.from("likes").insert({user_id:me.id,post_id:post.id});
      setLiked(true); setLikeCount(n=>n+1);
    }
  };

  const loadComments = async () => {
    const {data}=await sb.from("comments").select("*,profiles(full_name,username)").eq("post_id",post.id).is("parent_id",null).order("created_at");
    const withReplies = await Promise.all((data||[]).map(async c=>{
      const {data:reps}=await sb.from("comments").select("*,profiles(full_name,username)").eq("parent_id",c.id).order("created_at");
      return {...c,replies:reps||[]};
    }));
    setComments(withReplies);
  };

  const toggleCmt = async () => {
    setShowCmt(s=>!s);
    if(!showCmt) { setCmtLoading(true); await loadComments(); setCmtLoading(false); }
  };

  const addComment = async () => {
    if(!cmtText.trim())return;
    await sb.from("comments").insert({user_id:me.id,post_id:post.id,content:cmtText.trim(),parent_id:null});
    setCmtText(""); await loadComments();
  };

  const addReply = async (parentId) => {
    if(!replyText.trim())return;
    await sb.from("comments").insert({user_id:me.id,post_id:post.id,content:replyText.trim(),parent_id:parentId});
    setReplyText(""); setReplyTo(null); await loadComments();
  };

  const deletePost = async () => {
    await sb.from("posts").delete().eq("id",post.id);
    onDeleted(post.id);
  };

  const mentionClick = (username) => {
    sb.from("profiles").select("id").eq("username",username).single().then(({data})=>{
      if(data) onOpenProfile(data.id);
    });
  };

  return (
    <div className="post-card">
      <div style={{display:"flex",gap:10}}>
        <Av name={post.profiles?.full_name||"?"} size={38} onClick={()=>onOpenProfile(post.user_id)} />
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:6,flexWrap:"wrap"}}>
            <span className="heading" style={{fontSize:13,cursor:"pointer"}} onClick={()=>onOpenProfile(post.user_id)}>{post.profiles?.full_name}</span>
            <span style={{color:c.muted,fontSize:12}}>@{post.profiles?.username}</span>
            <span style={{color:c.muted,fontSize:11,marginLeft:"auto"}}>{timeAgo(post.created_at)}</span>
            {isOwn&&(
              <div style={{position:"relative"}}>
                <button onClick={()=>setShowMenu(s=>!s)} style={{background:"none",border:"none",color:c.muted,cursor:"pointer",fontSize:16,padding:"0 4px"}}>⋯</button>
                {showMenu&&(
                  <div style={{position:"absolute",right:0,top:"100%",background:c.surface,border:`1px solid ${c.border}`,borderRadius:10,padding:"6px",minWidth:120,zIndex:10,boxShadow:"0 4px 16px #0006"}}>
                    <button className="btn btn-danger btn-xs" style={{width:"100%"}} onClick={deletePost}>🗑 Delete</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <p style={{marginTop:7,fontSize:14,lineHeight:1.65,color:c.text,wordBreak:"break-word"}}>
            <RenderContent text={post.content} onMentionClick={mentionClick} />
          </p>
          {post.image_url&&<div style={{marginTop:9}}><img src={post.image_url} alt="post" style={{width:"100%",maxHeight:320,objectFit:"cover"}} /></div>}
          <div style={{display:"flex",gap:2,marginTop:9}}>
            <button className={`act-btn${liked?" a-like":""}`} onClick={toggleLike}>{liked?"❤️":"🤍"} {likeCount}</button>
            <button className={`act-btn${showCmt?" a-comment":""}`} onClick={toggleCmt}>💬 {post.comment_count||0}</button>
          </div>
        </div>
      </div>

      {showCmt&&(
        <div className="comment-wrap">
          <div style={{display:"flex",gap:7,marginBottom:11}}>
            <Av name={me.profile?.full_name||"?"} size={28} />
            <div style={{flex:1,display:"flex",gap:5}}>
              <input className="input" style={{padding:"6px 10px",fontSize:13}} placeholder="Write a comment… use @username to mention"
                value={cmtText} onChange={e=>setCmtText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addComment()} />
              <button className="btn btn-primary btn-xs" onClick={addComment} disabled={!cmtText.trim()}>Post</button>
            </div>
          </div>
          {cmtLoading&&<div style={{textAlign:"center",padding:10}}><Spinner/></div>}
          {!cmtLoading&&comments.length===0&&<div style={{color:c.muted,fontSize:12,textAlign:"center",padding:"6px 0"}}>No comments yet. Be first!</div>}
          {comments.map(cm=>(
            <div key={cm.id} style={{marginBottom:9}}>
              <div style={{display:"flex",gap:7}}>
                <Av name={cm.profiles?.full_name||"?"} size={28} onClick={()=>onOpenProfile(cm.user_id)} />
                <div style={{flex:1,background:dark?T.surface:TL.surface,borderRadius:11,padding:"7px 10px"}}>
                  <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:3}}>
                    <span style={{fontWeight:600,fontSize:12,cursor:"pointer"}} onClick={()=>onOpenProfile(cm.user_id)}>{cm.profiles?.full_name}</span>
                    <span style={{color:c.muted,fontSize:11}}>@{cm.profiles?.username}</span>
                    <span style={{color:c.muted,fontSize:10,marginLeft:"auto"}}>{timeAgo(cm.created_at)}</span>
                  </div>
                  <p style={{fontSize:13,lineHeight:1.55,color:c.text}}><RenderContent text={cm.content} onMentionClick={mentionClick}/></p>
                  <button className="act-btn" style={{fontSize:12,padding:"3px 7px",marginTop:4}} onClick={()=>setReplyTo(replyTo===cm.id?null:cm.id)}>
                    ↩ Reply{cm.replies?.length>0?` (${cm.replies.length})`:""}
                  </button>
                </div>
              </div>
              {cm.replies?.map(rp=>(
                <div key={rp.id} className="reply-wrap">
                  <div style={{display:"flex",gap:6}}>
                    <Av name={rp.profiles?.full_name||"?"} size={22} onClick={()=>onOpenProfile(rp.user_id)} />
                    <div style={{flex:1}}>
                      <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:2}}>
                        <span style={{fontWeight:600,fontSize:11}}>{rp.profiles?.full_name}</span>
                        <span style={{color:c.muted,fontSize:10}}>@{rp.profiles?.username}</span>
                      </div>
                      <p style={{fontSize:12,lineHeight:1.5,color:c.text}}><RenderContent text={rp.content} onMentionClick={mentionClick}/></p>
                    </div>
                  </div>
                </div>
              ))}
              {replyTo===cm.id&&(
                <div style={{display:"flex",gap:6,marginTop:7,marginLeft:32}}>
                  <Av name={me.profile?.full_name||"?"} size={24} />
                  <div style={{flex:1,display:"flex",gap:5}}>
                    <input className="input" style={{padding:"5px 9px",fontSize:12}}
                      placeholder={`Reply to @${cm.profiles?.username}…`} value={replyText}
                      onChange={e=>setReplyText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&addReply(cm.id)} autoFocus />
                    <button className="btn btn-primary btn-xs" onClick={()=>addReply(cm.id)} disabled={!replyText.trim()}>↩</button>
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
//  PROFILE VIEW
// ═══════════════════════════════════════════════════════════
function ProfileView({ targetId, me, dark, onBack, onOpenProfile, isMe, toast }) {
  const c=dark?T:{...T,...TL};
  const [profile,setProfile]=useState(null);
  const [posts,setPosts]=useState([]);
  const [followers,setFollowers]=useState([]);
  const [following,setFollowing]=useState([]);
  const [amFollowing,setAmFollowing]=useState(false);
  const [isBlocked,setIsBlocked]=useState(false);
  const [showList,setShowList]=useState(null);
  const [loading,setLoading]=useState(true);
  const [editMode,setEditMode]=useState(false);
  const [editBio,setEditBio]=useState("");
  const [editName,setEditName]=useState("");

  useEffect(()=>{ load(); },[targetId]);

  const load = async () => {
    setLoading(true);
    const {data:prof}=await sb.from("profiles").select("*").eq("id",targetId).single();
    setProfile(prof);
    setEditBio(prof?.bio||"");
    setEditName(prof?.full_name||"");
    const {data:ps}=await sb.from("posts").select("*,profiles(full_name,username)").eq("user_id",targetId).order("created_at",{ascending:false});
    // add like counts and liked
    const enriched = await Promise.all((ps||[]).map(async p=>{
      const {count}=await sb.from("likes").select("*",{count:"exact",head:true}).eq("post_id",p.id);
      const {data:myLike}=await sb.from("likes").select("id").eq("post_id",p.id).eq("user_id",me.id).single();
      const {count:cc}=await sb.from("comments").select("*",{count:"exact",head:true}).eq("post_id",p.id);
      return {...p,like_count:count||0,liked:!!myLike,comment_count:cc||0};
    }));
    setPosts(enriched);
    const {data:frs}=await sb.from("follows").select("follower_id,profiles!follows_follower_id_fkey(full_name,username,id)").eq("following_id",targetId);
    setFollowers(frs||[]);
    const {data:fing}=await sb.from("follows").select("following_id,profiles!follows_following_id_fkey(full_name,username,id)").eq("follower_id",targetId);
    setFollowing(fing||[]);
    const {data:fol}=await sb.from("follows").select("*").eq("follower_id",me.id).eq("following_id",targetId).single();
    setAmFollowing(!!fol);
    const {data:blk}=await sb.from("blocks").select("*").eq("blocker_id",me.id).eq("blocked_id",targetId).single();
    setIsBlocked(!!blk);
    setLoading(false);
  };

  const toggleFollow = async () => {
    if(amFollowing){
      await sb.from("follows").delete().eq("follower_id",me.id).eq("following_id",targetId);
      setAmFollowing(false); setFollowers(f=>f.filter(x=>x.follower_id!==me.id));
      toast(`Unfollowed @${profile?.username}`);
    } else {
      await sb.from("follows").insert({follower_id:me.id,following_id:targetId});
      setAmFollowing(true);
      toast(`Now following @${profile?.username} ✓`);
    }
  };

  const toggleBlock = async () => {
    if(isBlocked){
      await sb.from("blocks").delete().eq("blocker_id",me.id).eq("blocked_id",targetId);
      setIsBlocked(false); toast(`Unblocked @${profile?.username}`);
    } else {
      await sb.from("blocks").insert({blocker_id:me.id,blocked_id:targetId});
      // also unfollow
      await sb.from("follows").delete().eq("follower_id",me.id).eq("following_id",targetId);
      setIsBlocked(true); setAmFollowing(false);
      toast(`Blocked @${profile?.username}`,"info");
    }
  };

  const saveProfile = async () => {
    await sb.from("profiles").update({full_name:editName,bio:editBio}).eq("id",me.id);
    setProfile(p=>({...p,full_name:editName,bio:editBio}));
    setEditMode(false); toast("Profile updated! ✓");
  };

  if(loading) return <div style={{textAlign:"center",padding:40}}><Spinner/></div>;
  if(!profile) return <div style={{color:c.muted,textAlign:"center",padding:40}}>User not found.</div>;

  return (
    <div className="fade-in">
      {!isMe&&<button className="btn btn-ghost btn-sm" style={{marginBottom:14}} onClick={onBack}>← Back</button>}
      <div className="card" style={{marginBottom:14,textAlign:"center",padding:26}}>
        <Av name={profile.full_name||profile.username} size={66} />
        {editMode?(
          <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:9}}>
            <input className="input" value={editName} onChange={e=>setEditName(e.target.value)} placeholder="Full name" />
            <textarea className="input" value={editBio} onChange={e=>setEditBio(e.target.value)} placeholder="Bio" rows={2} style={{resize:"none"}} />
            <div style={{display:"flex",gap:7,justifyContent:"center"}}>
              <button className="btn btn-primary btn-sm" onClick={saveProfile}>Save</button>
              <button className="btn btn-ghost btn-sm" onClick={()=>setEditMode(false)}>Cancel</button>
            </div>
          </div>
        ):(
          <>
            <div className="heading" style={{fontSize:20,marginTop:11}}>{profile.full_name}</div>
            <div style={{color:T.accentB,fontSize:13,marginTop:3}}>@{profile.username}</div>
            {profile.bio&&<p style={{color:c.muted,fontSize:13,marginTop:9,lineHeight:1.6}}>{profile.bio}</p>}
          </>
        )}
        <div style={{display:"flex",justifyContent:"center",gap:26,marginTop:16}}>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowList("followers")}>
            <div className="heading" style={{fontSize:19}}>{followers.length}</div>
            <div style={{color:c.muted,fontSize:11}}>Followers</div>
          </div>
          <div style={{textAlign:"center",cursor:"pointer"}} onClick={()=>setShowList("following")}>
            <div className="heading" style={{fontSize:19}}>{following.length}</div>
            <div style={{color:c.muted,fontSize:11}}>Following</div>
          </div>
          <div style={{textAlign:"center"}}>
            <div className="heading" style={{fontSize:19}}>{posts.length}</div>
            <div style={{color:c.muted,fontSize:11}}>Posts</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,justifyContent:"center",marginTop:14,flexWrap:"wrap"}}>
          {isMe?(
            <button className="btn btn-ghost btn-sm" onClick={()=>setEditMode(true)}>✏️ Edit Profile</button>
          ):(
            <>
              <button className={`btn btn-sm ${amFollowing?"btn-following":"btn-follow"}`} onClick={toggleFollow}>
                {amFollowing?"✓ Following":"+ Follow"}
              </button>
              <button className={`btn btn-sm ${isBlocked?"btn-follow":"btn-danger"}`} onClick={toggleBlock}>
                {isBlocked?"Unblock":"🚫 Block"}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="heading" style={{fontSize:13,color:c.muted,marginBottom:11}}>Posts ({posts.length})</div>
      {posts.length===0
        ?<div style={{textAlign:"center",color:c.muted,padding:28,fontSize:14}}>No posts yet ✨</div>
        :posts.map(p=><PostCard key={p.id} post={p} me={me} dark={dark} onOpenProfile={onOpenProfile} onDeleted={id=>setPosts(ps=>ps.filter(x=>x.id!==id))} />)
      }

      {showList&&(
        <div className="modal-overlay" onClick={e=>e.target===e.currentTarget&&setShowList(null)}>
          <div className="modal fade-up" style={{maxWidth:370}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
              <div className="heading" style={{fontSize:17}}>{showList==="followers"?"Followers":"Following"}</div>
              <button onClick={()=>setShowList(null)} style={{background:"none",border:"none",color:T.muted,cursor:"pointer",fontSize:20}}>×</button>
            </div>
            {(showList==="followers"?followers:following).map(r=>{
              const u=showList==="followers"?r.profiles:r.profiles;
              return u?(
                <div key={r.follower_id||r.following_id} style={{display:"flex",alignItems:"center",gap:9,padding:"9px 0",borderBottom:`1px solid ${c.border}`,cursor:"pointer"}}
                  onClick={()=>{setShowList(null);onOpenProfile(u.id)}}>
                  <Av name={u.full_name||u.username} size={38} />
                  <div>
                    <div style={{fontWeight:600,fontSize:13}}>{u.full_name}</div>
                    <div style={{color:c.muted,fontSize:11}}>@{u.username}</div>
                  </div>
                </div>
              ):null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MESSAGES
// ═══════════════════════════════════════════════════════════
function MessagesPage({ me, dark }) {
  const c=dark?T:{...T,...TL};
  const [users,setUsers]=useState([]);
  const [active,setActive]=useState(null);
  const [conv,setConv]=useState([]);
  const [msgText,setMsgText]=useState("");
  const bottomRef=useRef();

  useEffect(()=>{
    sb.from("profiles").select("*").neq("id",me.id).limit(30).then(({data})=>setUsers(data||[]));
  },[]);

  useEffect(()=>{
    if(!active)return;
    loadConv();
    const sub=sb.channel("msgs").on("postgres_changes",{event:"INSERT",schema:"public",table:"messages"},(payload)=>{
      const m=payload.new;
      if((m.sender_id===me.id&&m.receiver_id===active)||(m.sender_id===active&&m.receiver_id===me.id)){
        setConv(c=>[...c,m]);
        setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),50);
      }
    }).subscribe();
    return()=>sb.removeChannel(sub);
  },[active]);

  const loadConv = async () => {
    const {data}=await sb.from("messages").select("*")
      .or(`and(sender_id.eq.${me.id},receiver_id.eq.${active}),and(sender_id.eq.${active},receiver_id.eq.${me.id})`)
      .order("created_at");
    setConv(data||[]);
    setTimeout(()=>bottomRef.current?.scrollIntoView({behavior:"smooth"}),100);
  };

  const sendMsg = async () => {
    if(!msgText.trim()||!active)return;
    await sb.from("messages").insert({sender_id:me.id,receiver_id:active,content:msgText.trim()});
    setMsgText("");
  };

  const activeUser=users.find(u=>u.id===active);

  return (
    <div style={{display:"flex",gap:11,height:"calc(100vh - 140px)",minHeight:360}}>
      <div style={{width:active?200:undefined,flex:active?"none":1,flexShrink:0,overflowY:"auto"}}>
        <div className="heading" style={{fontSize:14,marginBottom:11,color:c.muted}}>Messages</div>
        {users.map(u=>(
          <div key={u.id} onClick={()=>setActive(u.id)}
            style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:13,cursor:"pointer",marginBottom:3,background:active===u.id?(dark?T.accent+"20":TL.surface):"transparent",transition:"background .15s"}}
            onMouseEnter={e=>{if(active!==u.id)e.currentTarget.style.background=dark?T.card:TL.card}}
            onMouseLeave={e=>{if(active!==u.id)e.currentTarget.style.background="transparent"}}>
            <Av name={u.full_name||u.username} size={36} />
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:600,fontSize:13}}>{u.full_name}</div>
              <div style={{color:c.muted,fontSize:11}}>@{u.username}</div>
            </div>
          </div>
        ))}
      </div>

      {active&&activeUser&&(
        <div style={{flex:1,display:"flex",flexDirection:"column",background:dark?T.surface:TL.surface,borderRadius:16,border:`1px solid ${c.border}`,overflow:"hidden",minWidth:0}}>
          <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderBottom:`1px solid ${c.border}`,flexShrink:0}}>
            <button onClick={()=>setActive(null)} style={{background:"none",border:"none",color:c.muted,cursor:"pointer",fontSize:17,padding:"2px 5px"}}>←</button>
            <Av name={activeUser.full_name||activeUser.username} size={33} />
            <div>
              <div style={{fontWeight:600,fontSize:13}}>{activeUser.full_name}</div>
              <div style={{color:c.muted,fontSize:11}}>@{activeUser.username}</div>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto",padding:"12px",display:"flex",flexDirection:"column",gap:7}}>
            {conv.length===0&&<div style={{textAlign:"center",color:c.muted,fontSize:13,marginTop:36}}>No messages yet. Say hi! 👋</div>}
            {conv.map(m=>(
              <div key={m.id} style={{display:"flex",justifyContent:m.sender_id===me.id?"flex-end":"flex-start"}}>
                <div>
                  <div className={m.sender_id===me.id?"msg-me":"msg-them"}>{m.content}</div>
                  <div style={{fontSize:10,color:c.muted,marginTop:3,textAlign:m.sender_id===me.id?"right":"left"}}>{timeAgo(m.created_at)}</div>
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
      {!active&&<div style={{flex:1,display:"flex",alignItems:"center",justifyContent:"center",color:c.muted,fontSize:14}}>Select a conversation 💬</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  FEED SCREEN
// ═══════════════════════════════════════════════════════════
function FeedScreen({ user, onLogout }) {
  const [posts,setPosts]=useState([]);
  const [page,setPage]=useState("home");
  const [profileId,setProfileId]=useState(null);
  const [draft,setDraft]=useState("");
  const [draftImg,setDraftImg]=useState(null);
  const [dark,setDark]=useState(true);
  const [notify,setNotify]=useState(null);
  const [loading,setLoading]=useState(false);
  const [postsLoading,setPostsLoading]=useState(true);
  const imgRef=useRef();
  const MAX=280;
  const c=dark?T:{...T,...TL};
  const toast=(msg,type="success")=>setNotify({msg,type});

  useEffect(()=>{ loadFeed(); },[]);

  const loadFeed = async () => {
    setPostsLoading(true);
    const {data}=await sb.from("posts").select("*,profiles(full_name,username)").order("created_at",{ascending:false}).limit(50);
    const enriched=await Promise.all((data||[]).map(async p=>{
      const {count}=await sb.from("likes").select("*",{count:"exact",head:true}).eq("post_id",p.id);
      const {data:myLike}=await sb.from("likes").select("id").eq("post_id",p.id).eq("user_id",user.id).single();
      const {count:cc}=await sb.from("comments").select("*",{count:"exact",head:true}).eq("post_id",p.id);
      return {...p,like_count:count||0,liked:!!myLike,comment_count:cc||0};
    }));
    setPosts(enriched);
    setPostsLoading(false);
  };

  const submitPost = async () => {
    if(!draft.trim()&&!draftImg)return;
    setLoading(true);
    let image_url=null;
    if(draftImg){
      const file=await fetch(draftImg).then(r=>r.blob());
      const name=`post_${Date.now()}.jpg`;
      const {data:up}=await sb.storage.from("posts").upload(name,file,{contentType:"image/jpeg"});
      if(up) { const {data:url}=sb.storage.from("posts").getPublicUrl(name); image_url=url.publicUrl; }
    }
    await sb.from("posts").insert({user_id:user.id,content:draft.trim(),image_url});
    setDraft(""); setDraftImg(null);
    setLoading(false);
    toast("Posted! ✨");
    loadFeed();
  };

  const handleImg=(e)=>{
    const file=e.target.files[0]; if(!file)return;
    if(file.size>5*1024*1024)return toast("Image must be under 5MB","error");
    const reader=new FileReader();
    reader.onload=ev=>setDraftImg(ev.target.result);
    reader.readAsDataURL(file);
  };

  const openProfile=(uid)=>{
    if(uid===user.id){setPage("profile");setProfileId(null);}
    else{setProfileId(uid);setPage("otherProfile");}
  };

  const TABS=[{id:"home",icon:"🏠",label:"Feed"},{id:"messages",icon:"💬",label:"Messages"},{id:"profile",icon:"👤",label:"Profile"}];

  return (
    <div style={{minHeight:"100vh",background:c.bg,color:c.text,transition:"background .3s"}}>
      <style>{makeCSS(dark)}</style>
      <nav className="nav">
        <div className="logo-text" style={{fontSize:21,background:`linear-gradient(135deg,${T.accent},${T.accentB})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}
          onClick={()=>setPage("home")}>WROXI</div>
        <SearchBar onOpenProfile={openProfile} dark={dark} />
        <div style={{display:"flex",alignItems:"center",gap:7}}>
          <button onClick={()=>setDark(d=>!d)} style={{background:"none",border:`1px solid ${c.border}`,borderRadius:8,padding:"5px 8px",cursor:"pointer",fontSize:14,color:c.muted}}>
            {dark?"☀️":"🌙"}
          </button>
          <Av name={user.profile?.full_name||"?"} size={32} onClick={()=>{setPage("profile");setProfileId(null);}} />
        </div>
      </nav>

      <div style={{maxWidth:600,margin:"0 auto",padding:"14px 13px 70px"}}>
        <div className="tab-bar fade-up" style={{marginBottom:16}}>
          {TABS.map(t=>(
            <button key={t.id} className={`tab ${(page===t.id||(t.id==="profile"&&(page==="profile"||page==="otherProfile")))?"active":""}`}
              onClick={()=>{setPage(t.id);if(t.id==="profile")setProfileId(null);}}>
              {t.icon} <span className="hide-sm">{t.label}</span>
            </button>
          ))}
        </div>

        {page==="home"&&<>
          <div className="card fade-up" style={{marginBottom:14}}>
            <div style={{display:"flex",gap:9,alignItems:"flex-start"}}>
              <Av name={user.profile?.full_name||"?"} size={36} />
              <div style={{flex:1}}>
                <textarea className="input" placeholder="What's on your mind? Use @username to mention someone…"
                  value={draft} onChange={e=>setDraft(e.target.value.slice(0,MAX))} rows={3} style={{resize:"none",fontSize:14}} />
                {draftImg&&(
                  <div style={{position:"relative",marginTop:7}}>
                    <img src={draftImg} alt="preview" style={{width:"100%",maxHeight:180,objectFit:"cover"}} />
                    <button onClick={()=>setDraftImg(null)} style={{position:"absolute",top:6,right:6,background:"#000A",border:"none",color:"#fff",borderRadius:"50%",width:24,height:24,cursor:"pointer",fontSize:13}}>×</button>
                  </div>
                )}
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:9,gap:7}}>
                  <div style={{display:"flex",gap:5,alignItems:"center"}}>
                    <button className="btn btn-ghost btn-xs" onClick={()=>imgRef.current?.click()}>📷 Photo</button>
                    <input ref={imgRef} type="file" accept="image/*" style={{display:"none"}} onChange={handleImg} />
                    <span style={{fontSize:11,color:draft.length>MAX*.85?T.danger:c.muted}}>{draft.length}/{MAX}</span>
                  </div>
                  <button className="btn btn-primary btn-sm" onClick={submitPost} disabled={(!draft.trim()&&!draftImg)||loading}>
                    {loading?<Spinner/>:"Post"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          {postsLoading?<div style={{textAlign:"center",padding:40}}><Spinner/></div>
            :posts.length===0?<div style={{textAlign:"center",color:c.muted,padding:40}}>No posts yet. Be the first! ✨</div>
            :posts.map((p,i)=>(
              <div key={p.id} className="fade-up" style={{animationDelay:`${.04+i*.02}s`}}>
                <PostCard post={p} me={user} dark={dark} onOpenProfile={openProfile} onDeleted={id=>setPosts(ps=>ps.filter(x=>x.id!==id))} />
              </div>
            ))
          }
        </>}

        {page==="messages"&&<MessagesPage me={user} dark={dark} />}

        {page==="profile"&&<>
          <ProfileView targetId={user.id} me={user} dark={dark} onBack={()=>setPage("home")} onOpenProfile={openProfile} isMe={true} toast={toast} />
          <div style={{marginTop:14,textAlign:"center"}}>
            <button className="btn btn-ghost" onClick={async()=>{await sb.auth.signOut();onLogout();}}>Sign out</button>
          </div>
        </>}

        {page==="otherProfile"&&profileId&&(
          <ProfileView targetId={profileId} me={user} dark={dark} onBack={()=>setPage("home")} onOpenProfile={openProfile} isMe={false} toast={toast} />
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
  const [user,setUser]=useState(null);
  const [checking,setChecking]=useState(true);

  useEffect(()=>{
    // inject favicon
    const svg=`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%' y1='0%' x2='100%' y2='100%'><stop offset='0%' stop-color='%236C63FF'/><stop offset='100%' stop-color='%234ECDC4'/></linearGradient></defs><rect width='100' height='100' rx='22' fill='url(%23g)'/><text x='50' y='68' font-family='Arial Black' font-weight='900' font-size='52' fill='white' text-anchor='middle'>W</text></svg>`;
    let link=document.querySelector("link[rel~='icon']");
    if(!link){link=document.createElement("link");link.rel="icon";document.head.appendChild(link);}
    link.href=`data:image/svg+xml,${svg}`;

    sb.auth.getSession().then(async({data:{session}})=>{
      if(session){
        const {data:prof}=await sb.from("profiles").select("*").eq("id",session.user.id).single();
        setUser({...session.user,profile:prof});
      }
      setChecking(false);
    });
    const {data:{subscription}}=sb.auth.onAuthStateChange(async(event,session)=>{
      if(event==="SIGNED_IN"&&session){
        const {data:prof}=await sb.from("profiles").select("*").eq("id",session.user.id).single();
        setUser({...session.user,profile:prof});
      } else if(event==="SIGNED_OUT"){ setUser(null); }
    });
    return()=>subscription.unsubscribe();
  },[]);

  if(checking) return (
    <div style={{minHeight:"100vh",background:T.bg,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:16}}>
      <div className="logo-text" style={{fontSize:42,background:`linear-gradient(135deg,${T.accent},${T.accentB})`,WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>WROXI</div>
      <Spinner/>
    </div>
  );

  return (
    <>
      <style>{makeCSS(true)}</style>
      {user ? <FeedScreen user={user} onLogout={()=>setUser(null)} /> : <AuthScreen onLogin={setUser} />}
    </>
  );
}
