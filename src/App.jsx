import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Layout from "./components/Layout.jsx";

import Home from "./pages/Home.jsx";
import Join from "./pages/Join.jsx";
import Login from "./pages/Login.jsx";
import VerifyDriver from "./pages/VerifyDriver.jsx";
import ControlCenter from "./pages/ControlCenter.jsx";

export default function App() {
  return (
    <Router>
      <Layout>
        <Switch>
          {/* HOME */}
          <Route exact path="/" component={Home} />

          {/* HOW IT WORKS – for now reuses Home */}
          <Route exact path="/how-it-works" component={Home} />

          {/* REQUEST ACCESS */}
          <Route exact path="/join" component={Join} />

          {/* LOGIN */}
          <Route exact path="/login" component={Login} />

          {/* CONTROL CENTER */}
          <Route exact path="/control-center" component={ControlCenter} />

          {/* VERIFY WITH TOKEN */}
          <Route exact path="/verify/:token" component={VerifyDriver} />

          {/* FALLBACK */}
          <Route component={Home} />
        </Switch>
      </Layout>
    </Router>
  );
}
