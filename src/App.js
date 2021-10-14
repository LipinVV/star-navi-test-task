import './App.css';
import {Game} from "./Game/Game";
import React from "react";


export const fetchServerData = () => {
  return fetch(`https://demo1030918.mockable.io/`).then(response => {
    return response.json();
  }).then(data => {
    return data
  }).catch((reason => console.log(reason)))
}

function App() {
  return (
    <div className="App">
      <h1>StarNavi: Test task</h1>
      <Game/>
    </div>
  );
}

export default App;
