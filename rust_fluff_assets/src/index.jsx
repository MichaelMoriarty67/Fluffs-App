import * as React from 'react';
import { useState, useEffect } from 'react';
import { render } from "react-dom";
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Edit, Connect, User } from './views';
import { rust_fluff, idlFactory, canisterId } from "../../.dfx/local/canisters/rust_fluff/index";
import { Principal } from "@dfinity/principal";
import { ToastProvider } from './components/index';
import './index.css';


const getPrincipal = async () => window.ic.plug?.getPrincipal();
const disconnect = async () => window.ic.plug?.disconnect();

const MyHello = () => {
  const [connected, setConnected] = useState(false);
  const [actor, setActor] = useState()
  const [principal, setPrincipal] = useState('');

  const getPlugSelf = async () => {
    if (actor) {
      try {
        const selfProfile = await actor.getSelf();
        console.log("getPlugSelf Profile: ", selfProfile);
      } catch (err) {
        console.error("Error from getPlugSelf: ", err);
      }
    } else {
      console.log("No actor, getPlugSelf method wont work.");
    }
  }

  const add = async () => {
    try {
      const profile = {
        "principal": "bo3zj-oos6g-2xeet-sdyok-tj2ts-ktaap-jla3m-64tzt-tpn6d-p76mp-dae",
        "username": "mmiikkee",
        "socials": {
          "dscvr": "sherlocked67",
          "distrikt": "sherlocked67",
          "discord": "sherlocked67#5902",
          "twitter": "@sherlocked67",
          "website": "sherlocked67.com",
        },
        "nfts": ["pjyqi-zykor-uwiaa-aaaaa-b4apt-yaqca-aaaia-a"],
        "status": { Realm: null }
      }
      
      console.log("profile to be added from add fn: ", profile);
      const newProfile = await actor.add(profile);
      console.log("Response from add fn: ", newProfile);

    } catch (err) {
      console.error("add Error: ", err);
    }
  }

  const checkUsername = async (name) => {
    if (actor) {
      try {
        const isUser = await actor.checkUsername(name);
        console.log(`Does ${name} exist in BE: `, isUser);
      } catch (err) {
        console.error("Error from checkUsername: ", err);
      }
    } else {
      console.log("No actor, checkUsername method wont work.");
    }
  }

  const btnCheck = () => {
    getPlugSelf();
    checkUsername("xxMikexx");
  }

  const createActor = async () => {
    try {
      if (!window.ic.plug.agent) {
        await window.ic.plug.createAgent([canisterId])
      }

      const backendActor = await window.ic.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: idlFactory
      });
      console.log("Actor created through plug: ", backendActor);
      setActor(backendActor);
    } catch (err) {
      console.error(err);
    }
  }


  const plugConnect = async () => {
    try {
      await window.ic.plug?.requestConnect({
        whitelist: [`${canisterId}`],
        host: 'http://localhost:8000',
      });

      // function now errors out if actor creation fails
      const backendActor = await window.ic.plug.createActor({
        canisterId: canisterId,
        interfaceFactory: idlFactory,
      });
      setActor(backendActor);

      getPrincipal().then((res) => {
        const principalObj = new Principal(res._arr);
        setPrincipal(principalObj); // was string before, now saving obj
        if (window.ic.plug.agent) { // dont thinl I need this as there is same check in createActor
          setConnected(true);
        }        
      });

      
    } catch (err) {
      console.error("Error from plugConnect: ", err);
    }
  }

  const plugDisconnect = async () => {
    try {
      disconnect();
      console.log('disconnected!');
      setConnected(false);
      setActor();
      setPrincipal('');
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (!window.ic.plug.agent) {
      setActor(false);
      setConnected(false);
      window.location.hash = '/connect';
    }
  }); // should this only update on page reload? I think agent only goes away on page reload?
  
  useEffect(async () => {
    if (window.ic?.plug?.agent){
      console.log("Fetching the root key boss...");
      await window.ic.plug.agent.fetchRootKey()
      console.log("... got the root key");
    }
  }, [connected])


  return (
    <ToastProvider> 
      <Router>
          {
            connected
            ? <Redirect to="/edit" />
            : <Redirect to="/connect" />
          }
          <Switch>
            <Route path="/connect">
              <Connect connection={plugConnect}/>
            </Route>
            <Route path="/edit">
              <Edit 
                principalId={principal}
                actor={actor}
                disconnect={plugDisconnect}
              />
            </Route>
            <Route 
            path="/:username?" 
            // element={<User actor={actor} principalId={principal} />}
            // component={User} 
            render={(props) => <User {...props} actor={actor} principalId={principal} />}
            />
          </Switch>
      </Router>
    </ToastProvider>
  );
};

render(<MyHello />, document.getElementById("root"));
