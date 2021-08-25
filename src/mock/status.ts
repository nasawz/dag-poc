import get from "lodash/get";
import set from "lodash/set";
import cloneDeep from "lodash/cloneDeep";
import { socket } from "../web-sockets";

let state = {
  experimentId: null,
  running: false,
  statusRes: {
    success: true,
    data: {
      instStatus: {},
      execInfo: {},
      status: "default",
    },
  } as any,
};

export const runGraph = async (experimentId, nodes: any[]) => {
  const newState = getStatus();
  newState.data.instStatus = {};
  newState.data.execInfo = {};
  nodes.forEach((node) => {
    let id = node.id;
    // if(node.codeName==='source_sum'){id='sum'}
    newState.data.instStatus[id] = "default";
    newState.data.execInfo[id] = {
      jobStatus: "default",
      name: node.name,
      id: id,
      value: null,
    };
  });
  state.experimentId = experimentId;
  state.running = true;
  state.statusRes = newState;
  return { success: true };
};

export const stopGraphRun = () => {
  state.running = false;
  return { success: true };
};

const getStatus = () => cloneDeep(state.statusRes);

export const queryGraphStatus = async () => {
  return new Promise((resolve, reject) => {
    const newState = getStatus();
    if (state.running) {
      const { instStatus, execInfo } = newState.data;
      const idList = Object.keys(instStatus);
      socket.emit(
        "queryJob",
        { experimentId: state.experimentId, nodeIds: ["status", ...idList] },
        (err, res) => {
          console.log(err, res.data);

          idList.forEach((id) => {
            set(instStatus, id, "running");
            set(execInfo, `${id}.jobStatus`, "running");
          });

          let mainStaus = "running";
          res.data.map((d) => {
            console.log(d);
            if (d[0] == "status") {
              mainStaus = d[1];
            } else {
              // set(instStatus, d[0], "ready");
              // set(execInfo, `${d[0]}.jobStatus`, "ready");
              set(instStatus, d[0], "running");
              set(execInfo, `${d[0]}.jobStatus`, "running");
              set(execInfo, `${d[0]}.value`, d[1]);
            }
          });

          if (mainStaus === "success") {
            idList.forEach((id) => {
              set(instStatus, id, "success");
              set(execInfo, `${id}.jobStatus`, "success");
            });
            state.running = false;
          } else {
            set(newState, "data.status", "running");
          }

          console.log("newState", newState);

          resolve(newState);
        }
      );
    } else {
      resolve(newState);
    }
  });

};
