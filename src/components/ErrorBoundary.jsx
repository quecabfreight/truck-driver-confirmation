import React from "react";

/**
 * If anything in the tree throws, this renders a friendly panel
 * instead of a blank white screen, so we can see the error.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, err: null };
  }
  static getDerivedStateFromError(err) {
    return { hasError: true, err };
  }
  componentDidCatch(err, info) {
    // Still log to console for debugging
    console.error("App crashed:", err, info);
  }
  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <div style={{
        maxWidth: 900, margin: "40px auto", padding: 24,
        border: "1px solid #444", borderRadius: 12,
        fontFamily: "ui-sans-serif, system-ui, Segoe UI, Arial"
      }}>
        <h2 style={{ marginTop: 0 }}>Something went wrong.</h2>
        <div style={{ whiteSpace: "pre-wrap", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" }}>
          {String(this.state.err && (this.state.err.message || this.state.err))}
        </div>
        <p style={{ opacity: 0.8 }}>
          If this persists, refresh the page. At least you won’t be staring at a white screen anymore.
        </p>
      </div>
    );
  }
}
