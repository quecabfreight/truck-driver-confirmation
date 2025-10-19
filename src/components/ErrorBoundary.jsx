import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props){ super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error){ return { hasError: true, error }; }
  componentDidCatch(error, info){ console.error("App Error:", error, info); }
  render(){
    if (this.state.hasError) {
      return (
        <div style={{padding:20,color:"#fff",background:"#111",fontFamily:"system-ui"}}>
          <h1 style={{marginTop:0}}>QueCab AdbS — App Error</h1>
          <p>Something went wrong rendering this view.</p>
          <pre style={{whiteSpace:"pre-wrap",background:"#181818",padding:12,borderRadius:8}}>
            {String(this.state.error)}
          </pre>
          <p>Try <a href="/hello" style={{color:"#9cf"}}>the hello page</a> or go <a href="/verify" style={{color:"#9cf"}}>to verify</a>.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
