import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_SERVICE_ROLE_KEY
);

function normalizeDOT(v){
return String(v||"").replace(/\D/g,"")
}

function normalizePlate(v){
return String(v||"").trim().toUpperCase()
}

export default async function handler(req,res){

if(req.method!=="POST"){
return res.status(405).json({error:"Method not allowed"})
}

try{

const {token,entered_usdot,entered_plate}=req.body||{}

if(!token){
return res.status(400).json({error:"Missing token"})
}

const {data:link,error:linkError}=await supabase
.from("verify_links")
.select("*")
.eq("token",token)
.single()

if(linkError||!link){
return res.status(404).json({error:"Verification link not found"})
}

/* if already cleared */

if(link.status==="cleared"){
return res.status(200).json({
result:"CLEAR_TO_LOAD",
verification_id:token,
verified_at:link.cleared_at||"",
carrier_company:link.carrier_company||"",
carrier_contact_name:link.dispatch_contact||"",
carrier_contact_phone:link.dispatch_phone||""
})
}

const dotMatch=
normalizeDOT(entered_usdot)===normalizeDOT(link.usdot_on_record)

const plateMatch=
normalizePlate(entered_plate)===normalizePlate(link.plate_on_record)

const result=(dotMatch&&plateMatch)
? "CLEAR_TO_LOAD"
: "CAUTION_ALERT"

/* record attempt */

await supabase.from("verify_checks").insert({
token,
entered_usdot:normalizeDOT(entered_usdot),
entered_plate:normalizePlate(entered_plate),
result,
checked_at:new Date().toISOString()
})

/* auto lock if cleared */

if(result==="CLEAR_TO_LOAD"){

await supabase
.from("verify_links")
.update({
status:"cleared",
cleared_at:new Date().toISOString()
})
.eq("token",token)

}

return res.status(200).json({
result,
verification_id:token,
verified_at:new Date().toLocaleString(),
carrier_company:link.carrier_company||"",
carrier_contact_name:link.dispatch_contact||"",
carrier_contact_phone:link.dispatch_phone||""
})

}catch(e){

return res.status(500).json({
error:"Verification failure",
detail:String(e?.message||e)
})

}

}
