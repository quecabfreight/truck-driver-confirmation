import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // temporary: just go to /verify so we can test the flow
    navigate("/verify");
  }

  return (
    <div style={{minHeight:"100vh", display:"grid", placeItems:"center", fontFamily:"system-ui, sans-serif", background:"#f7f7f8"}}>
      <div style={{width:"100%", maxWidth:440, padding:24, borderRadius:16, background:"#fff", boxShadow:"0 10px 30px rgba(0,0,0,.08)"}}>
        <div style={{textAlign:"center", marginBottom:16}}>
          <h1 style={{margin:0, fontSize:28, letterSpacing:.3}}>QueCab AdbS</h1>
          <p style={{margin:"6px 0 0 0", opacity:.7}}>Broker/Shipper Login</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={{display:"block", marginBottom:12}}>
            <span>Email</span>
            <input type="email" required style={{width:"100%", marginTop:6, padding:10, borderRadius:10, border:"1px solid #ddd"}}/>
          </label>
          <label style={{display:"block", marginBottom:16}}>
            <span>Password</span>
            <input type="password" required style={{width:"100%", marginTop:6, padding:10, borderRadius:10, border:"1px solid #ddd"}}/>
          </label>
          <button type="submit" style={{width:"100%", padding:12, border:"0", borderRadius:12, fontWeight:600, cursor:"pointer"}}>
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

