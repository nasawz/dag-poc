import * as React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TemplateComponent from "./template.component"
export interface IAppProps { }

export default function App(props: IAppProps) {
  return (
    <Router basename={"/experiment"}>
      <Switch>
        <Route path={"/:experimentId"} component={TemplateComponent} />
      </Switch>
    </Router>
  );
}