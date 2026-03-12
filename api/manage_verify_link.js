// /api/manage_verify_link.js
// Handles verification management actions

import crypto from "crypto";

function json(res, code, obj){
res.statusCode=code
res.setHeader("Content-Type","application/json; charset=utf-8")
res.setHeader("Cache-Control","no-store")
res.end(JSON.stringify(obj))
}

async function safeJsonResponse(res){
const text=await res.text()
try{return JSON.parse(text)}catch{return{raw:text}}
}

function sbHeaders(){
const KEY=process.env.SUPABASE_SERVICE_ROLE_KEY
return{
apikey:KEY,
Authorization:`Bearer ${KEY}`,
"Content-Type":"application/json",
Prefer:"return=representation"
}
}

async function sbFetchOneByToken(token){

const SUPABASE_URL=process.env.SUPABASE_URL

const url=
`${SUPABASE_URL}/rest/v1/verify_links`+
`?token=eq.${encodeURIComponent(token)}`+
`&select=*`+
`&limit=1`

const res=await fetch(url,{
method:"GET",
headers:sbHeaders()
})

const data=await safeJsonResponse(res)

if(!res.ok){
throw new Error(data?.message||data?.error||"Failed to load verification")
}

return Array.isArray(data)?data[0]||null:null
}

export default async function handler(req,res){

if(req.method!=="POST"){
return json(res,405,{ok:false,error:"Method not allowed"})
}

try{

const body=typeof req.body==="string"?JSON.parse(req.body):(req.body||{})

const action=String(body.action||"").trim().toLowerCase()
const token=String(body.token||"").trim()

if(!action)return json(res,400,{ok:false,error:"Missing action"})

/* ---------- LOOKUP VERIFICATION ---------- */

if(action==="lookup"){

if(!token)return json(res,400,{ok:false,error:"Missing verification id"})

const link=await sbFetchOneByToken(token)

if(!link)return json(res,404,{ok:false,error:"Verification not found"})

const origin=
(req.headers["x-forwarded-proto"]?`${req.headers["x-forwarded-proto"]}://`:"https://")+
(req.headers["x-forwarded-host"]||req.headers.host)

const verify_public=`${origin}/v.html?t=${link.token}`

return json(res,200,{
ok:true,
token:link.token,
load_id:link.load_id||null,
status:link.status||"active",
verify_url:verify_public,
expires_at:link.expires_at||null
})

}

return json(res,400,{ok:false,error:"Unknown action"})

}catch(e){

return json(res,500,{ok:false,error:String(e?.message||"Server error")})

}

}
