// /src/pages/ControlCenter.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Header from "../components/Header.jsx";
import { LS_EMAIL, isBrokerOrShipper } from "../utils/auth.js";

function onlyDigits(s){return String(s||"").replace(/\D+/g,"")}
function toUpperClean(s){return String(s||"").toUpperCase()}
function formatPhoneHyphen(s){
  const d=onlyDigits(s).slice(0,10)
  const a=d.slice(0,3),b=d.slice(3,6),c=d.slice(6,10)
  if(d.length<=3)return a
  if(d.length<=6)return`${a}-${b}`
  return`${a}-${b}-${c}`
}

function makeQrDataUrl(value){
  const clean=String(value||"").trim()
  if(!clean)return""
  return`https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(clean)}`
}

export default function ControlCenter(){

const nav=useNavigate()
const email=(localStorage.getItem(LS_EMAIL)||"").trim()
const authorized=!!email&&isBrokerOrShipper(email)

const loadIdRef=useRef(null)
const driverPhoneRef=useRef(null)
const usdotRef=useRef(null)
const plateRef=useRef(null)

useEffect(()=>{
if(!authorized){nav("/login",{replace:true});return}
setTimeout(()=>{loadIdRef.current?.focus()},0)
},[authorized,nav])

if(!authorized)return null

const [loadId,setLoadId]=useState("")
const [dockEmail,setDockEmail]=useState("")
const [dockPin,setDockPin]=useState("")
const [usdotOnRecord,setUsdotOnRecord]=useState("")
const [plateOnRecord,setPlateOnRecord]=useState("")
const [driverPhone,setDriverPhone]=useState("")

const [statusMsg,setStatusMsg]=useState("")
const [errorMsg,setErrorMsg]=useState("")
const [loading,setLoading]=useState(false)

const [issued,setIssued]=useState(null)
const [issuedQr,setIssuedQr]=useState("")
const [attempts,setAttempts]=useState([])

/* ----------- Protection Summary ----------- */

const protectionSummary=useMemo(()=>{
let verifications=issued?1:0
let cleared=0
let caution=0

attempts.forEach(a=>{
if(String(a.result||"").toLowerCase().includes("clear"))cleared++
else caution++
})

return{
verifications,
cleared,
caution
}
},[attempts,issued])

/* ----------- Issue Link ----------- */

async function issueLink(){

setErrorMsg("")
setStatusMsg("")

const usdot_digits=onlyDigits(usdotOnRecord)
const plate_upper=toUpperClean(plateOnRecord).trim()
const phone_digits=onlyDigits(driverPhone)

if(!usdot_digits){setErrorMsg("Enter USDOT#");usdotRef.current?.focus();return}
if(!plate_upper){setErrorMsg("Enter Plate");plateRef.current?.focus();return}
if(phone_digits.length!==10){setErrorMsg("Enter Driver Phone");driverPhoneRef.current?.focus();return}

setLoading(true)

try{

const payload={
load_id:loadId||null,
dock_email:dockEmail||null,
usdot_on_record:usdot_digits,
plate_on_record:plate_upper,
driver_phone:formatPhoneHyphen(phone_digits),
dock_pin:dockPin||null
}

const res=await fetch("/api/issue_verify_link",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)})
const data=await res.json()

if(!res.ok){setErrorMsg(data.error||"Issue failed");setLoading(false);return}

const verifyUrl=data.verify_url||""
const qrDataUrl=makeQrDataUrl(verifyUrl)

setIssued({
verification_id:data.token,
verify_url:verifyUrl,
status:data.status||"active"
})

setIssuedQr(qrDataUrl)
setStatusMsg("AdbS Verification issued")

}catch{
setErrorMsg("Network error")
}

setLoading(false)
}

/* ----------- Layout Styles ----------- */

const card={
border:"1px solid rgba(255,255,255,0.12)",
background:"rgba(12,18,28,0.72)",
borderRadius:16,
padding:18
}

const input={
width:"100%",
padding:12,
borderRadius:12,
border:"1px solid rgba(255,255,255,0.16)",
background:"rgba(255,255,255,0.04)",
color:"inherit",
fontSize:16
}

const btn=(primary)=>({
width:"100%",
padding:12,
borderRadius:12,
border:primary?"1px solid rgba(120,180,255,0.45)":"1px solid rgba(255,255,255,0.16)",
background:primary?"rgba(40,110,190,0.35)":"rgba(255,255,255,0.06)",
fontWeight:900,
cursor:"pointer"
})

return(

<div style={{minHeight:"100vh"}}>

<Header/>

<div style={{maxWidth:1100,margin:"0 auto",padding:"18px 16px 48px"}}>

<div style={{fontSize:26,fontWeight:800,marginBottom:14}}>Control Center</div>

{/* ---------- Protection Summary ---------- */}

<div style={{...card,marginBottom:16}}>
<div style={{fontWeight:900,fontSize:18,marginBottom:10}}>AdbS Protection Summary</div>

<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,fontSize:15}}>

<div>
<div style={{opacity:.7}}>Truck-Driver Verifications</div>
<div style={{fontWeight:900,fontSize:22}}>{protectionSummary.verifications}</div>
</div>

<div>
<div style={{opacity:.7}}>Cleared Loads</div>
<div style={{fontWeight:900,fontSize:22}}>{protectionSummary.cleared}</div>
</div>

<div>
<div style={{opacity:.7}}>Caution Alerts</div>
<div style={{fontWeight:900,fontSize:22}}>{protectionSummary.caution}</div>
</div>

</div>
</div>

{/* ---------- Main Grid ---------- */}

<div style={{display:"grid",gridTemplateColumns:"1.1fr .9fr",gap:16}}>

{/* ---------- Issue Panel ---------- */}

<div style={card}>

<div style={{fontWeight:900,fontSize:18,marginBottom:12}}>Issue AdbS Verification</div>

<div style={{display:"grid",gap:10}}>

<input ref={loadIdRef} style={input} placeholder="Load ID" value={loadId} onChange={e=>setLoadId(e.target.value)} />

<input style={input} placeholder="Dock Email" value={dockEmail} onChange={e=>setDockEmail(e.target.value)} />

<input style={input} placeholder="Dock PIN" value={dockPin} onChange={e=>setDockPin(onlyDigits(e.target.value))} />

<input ref={driverPhoneRef} style={input} placeholder="Driver Phone" value={driverPhone} onChange={e=>setDriverPhone(formatPhoneHyphen(e.target.value))} />

<input ref={usdotRef} style={input} placeholder="USDOT#" value={usdotOnRecord} onChange={e=>setUsdotOnRecord(onlyDigits(e.target.value))} />

<input ref={plateRef} style={input} placeholder="Plate" value={plateOnRecord} onChange={e=>setPlateOnRecord(toUpperClean(e.target.value))} />

<button style={btn(true)} onClick={issueLink} disabled={loading}>
{loading?"Issuing...":"Issue AdbS Verification"}
</button>

{errorMsg&&<div style={{color:"#ff7b7b"}}>{errorMsg}</div>}
{statusMsg&&<div>{statusMsg}</div>}

</div>

{issued&&(
<div style={{marginTop:14}}>

<div style={{fontWeight:900}}>Verification ID</div>

<input style={input} value={issued.verification_id} readOnly />

<div style={{marginTop:10,fontWeight:900}}>AdbS SmartLink</div>

<input style={input} value={issued.verify_url} readOnly />

<div style={{marginTop:14,textAlign:"center"}}>

{issuedQr&&(
<img src={issuedQr} alt="QR" style={{width:240,background:"#fff",padding:10,borderRadius:10}}/>
)}

</div>

</div>
)}

</div>

{/* ---------- Activity Panel ---------- */}

<div style={card}>

<div style={{fontWeight:900,fontSize:18,marginBottom:10}}>Load Activity</div>

{!attempts.length&&(
<div style={{opacity:.7,fontSize:14}}>
No verification attempts yet.
</div>
)}

{attempts.map((a,i)=>(
<div key={i} style={{border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:10,marginBottom:8}}>

<div style={{fontWeight:900}}>
{String(a.result||"").toLowerCase().includes("clear")?"CLEAR":"ATTEMPT"}
</div>

<div style={{fontSize:13}}>
DOT: <b>{a.entered_usdot}</b><br/>
Plate: <b>{a.entered_plate}</b><br/>
Driver Answered: <b>{String(a.driver_answered)}</b>
</div>

</div>
))}

</div>

</div>

</div>

</div>

)
}
