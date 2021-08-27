import * as React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TemplateComponent from "./template.component";
import ViewComponent from "./view.component";
export interface IAppProps { }

export default function App(props: IAppProps) {
  return (
    <Router basename={"/experiment"}>
      <Switch>
        <Route path={"/view/:experimentId"} component={ViewComponent} />
        <Route path={"/:experimentId"} component={TemplateComponent} />
      </Switch>
    </Router>
  );
}