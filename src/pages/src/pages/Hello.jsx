export default function Hello(){
  return (
    <div style={{minHeight:"100vh",display:"grid",placeItems:"center",fontFamily:"system-ui"}}>
      <div style={{padding:24,border:"1px solid #ddd",borderRadius:12}}>
        <h1 style={{marginTop:0}}>App is up ✅</h1>
        <p>Routing works. Now try <a href="/verify?usdot=1234567&phone=5855551212">/verify</a>.</p>
      </div>
    </div>
  );
}
