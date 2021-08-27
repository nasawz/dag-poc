import * as React from "react";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import TemplateComponent from "./template.component"
import EmulatorComponent from "./emulator.component"
import ViewComponent from "./view.component";
export interface IAppProps { }

export default function App(props: IAppProps) {
  return (
    <Router basename={"/experiment"}>
      <Switch>
        <Route path={"/designer/:experimentId"} component={TemplateComponent} />
        <Route path={"/emulator/:experimentId"} component={EmulatorComponent} />
        <Route path={"/view/:experimentId"} component={ViewComponent} />
      </Switch>
    </Router>
  );
}