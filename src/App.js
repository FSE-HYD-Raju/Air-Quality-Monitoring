import React, { useState, useEffect } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import moment from "moment";
import { colors } from "./colors";
//import { colors } from "./colors";

const client = new W3CWebSocket("ws://city-ws.herokuapp.com/");

const cities = [
  { city: "Mumbai", aqi: 0.0 },
  { city: "Bengaluru", aqi: 0.0 },
  { city: "Delhi", aqi: 0.0 },
  { city: "Kolkata", aqi: 0.0 },
  { city: "Bhubaneswar", aqi: 0.0 },
  { city: "Pune", aqi: 0.0 },
  { city: "Hyderabad", aqi: 0.0 },
  { city: "Indore", aqi: 0.0 },
  { city: "Jaipur", aqi: 0.0 },
  { city: "Chandigarh", aqi: 0.0 },
  { city: "Lucknow", aqi: 0.0 },
];

function App() {
  const [data, setData] = useState(cities);
  let referenceColors = [];
  Object.keys(colors).forEach((a) => {
    referenceColors = [...referenceColors, { key: a, value: colors[a] }];
  });
  useEffect(() => {
    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };
    client.onmessage = (message) => {
      const parsedData = JSON.parse(message.data);
      let res = [];
      data.forEach((item) => {
        parsedData.forEach((parsedItem) => {
          if (item.city === parsedItem.city) {
            if (parsedItem.aqi >= 0 && parsedItem.aqi <= 50) {
              item.color = colors.good;
            } else if (parsedItem.aqi >= 51 && parsedItem.aqi <= 100) {
              item.color = colors.satisfactory;
            } else if (parsedItem.aqi >= 101 && parsedItem.aqi <= 200) {
              item.color = colors.moderate;
            } else if (parsedItem.aqi >= 201 && parsedItem.aqi <= 300) {
              item.color = colors.poor;
            } else if (parsedItem.aqi >= 301 && parsedItem.aqi <= 400) {
              item.color = colors.veryPoor;
            } else if (parsedItem.aqi >= 401 && parsedItem.aqi <= 500) {
              item.color = colors.severe;
            }
            item.aqi = parsedItem.aqi;
            item.lastUpdated = new Date();
          }
        });
        res.push(item);
      });
      setData(res);
    };
  });

  return (
    <div className="App">
      <h3 className="heading">Air Quality Monitoring</h3>
      <div className="row">
        <div className="col-7">
          <table className="table table-bordered table-sm table-style">
            <thead className="thead-light">
              <tr>
                <th className="column-width">City</th>
                <th className="column-width">Current AQI</th>
                <th className="column-width">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((entry) => {
                  return (
                    <tr key={entry.city}>
                      <td style={{ color: entry.color }}>
                        <b>{entry.city}</b>
                      </td>
                      <td style={{ color: entry.color }}>
                        <b>{entry.aqi.toFixed(2)}</b>
                      </td>
                      <td className="last-updated">
                        {entry.lastUpdated
                          ? moment(entry.lastUpdated).format('MMMM Do YYYY, h:mm:ss a')
                          : ""}
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
        <div className="col reference-color-holder">
          {referenceColors.length &&
            referenceColors.map((color) => {
              return (
                <ul key={color.key}>
                  <li className="list-style">
                   <div className="row">
                     <div className="col-0.5 square-color" style={{backgroundColor: color.value}}></div>
                     <div className="col square-key">{color.key}</div>
                   </div>
                  </li>
                </ul>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
