import React from "react";
import PortfolioApp from "./PortfolioApp.jsx";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, info: null, windowError: null, promiseRejection: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error, info) {
    console.error("[App ErrorBoundary]", error, info);
    this.setState({ info });
  }
  componentDidMount() {
    this._onWindowError = (msg, src, line, col, err) => {
      console.error("[window.onerror]", msg, src, line, col, err);
      this.setState({ windowError: { msg, src, line, col, err } });
    };
    this._onUnhandledRejection = (event) => {
      console.error("[unhandledrejection]", event.reason);
      this.setState({ promiseRejection: event.reason });
    };
    window.addEventListener("error", this._onWindowError);
    window.addEventListener("unhandledrejection", this._onUnhandledRejection);
  }
  componentWillUnmount() {
    window.removeEventListener("error", this._onWindowError);
    window.removeEventListener("unhandledrejection", this._onUnhandledRejection);
  }
  render() {
    if (this.state.error) {
      const err = this.state.error;
      const info = this.state.info;
      const winErr = this.state.windowError;
      const rej = this.state.promiseRejection;
      return (
        <div style={{ padding: 24, fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" }}>
          <h2>Something went wrong.</h2>
          <p style={{ marginTop: 8 }}>Below is the exact error and stack to help diagnose without opening DevTools.</p>

          <div style={{ marginTop: 16, padding: 12, border: "1px solid #e5e7eb", borderRadius: 8, background: "#fff" }}>
            <div style={{ fontWeight: 700 }}>Error message</div>
            <pre style={{ whiteSpace: "pre-wrap", margin: 0 }}>{String(err && err.message || err)}</pre>
          </div>

          {err && err.stack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer" }}>Stack trace</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{err.stack}</pre>
            </details>
          )}

          {info && info.componentStack && (
            <details style={{ marginTop: 12 }}>
              <summary style={{ cursor: "pointer" }}>Component stack</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{info.componentStack}</pre>
            </details>
          )}

          {winErr && (
            <details style={{ marginTop: 12 }} open>
              <summary style={{ cursor: "pointer" }}>window.onerror</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{JSON.stringify(winErr, null, 2)}</pre>
            </details>
          )}

          {rej && (
            <details style={{ marginTop: 12 }} open>
              <summary style={{ cursor: "pointer" }}>unhandledrejection</summary>
              <pre style={{ whiteSpace: "pre-wrap" }}>{String(rej && rej.stack || rej)}</pre>
            </details>
          )}

          <div style={{ marginTop: 16 }}>
            <button onClick={() => location.reload()} style={{ padding: "8px 12px", borderRadius: 8, border: "1px solid #e5e7eb" }}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <PortfolioApp />
    </ErrorBoundary>
  );
}
