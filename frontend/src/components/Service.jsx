import React from "react";
import "../Service.css";

function Service(props) {
  return (
    <div className="service-wrapper">
      <h1 className="service-title">{props.title}</h1>
      <p>{props.p}</p>
    </div>
  );
}

export default Service;
