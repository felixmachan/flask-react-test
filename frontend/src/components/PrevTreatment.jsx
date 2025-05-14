import React from "react";
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineDescription } from "react-icons/md";
import "../PrevTreatment.css";

function PrevTreatment(props) {
  return (
    <div className="treatment">
      <div className="treatment-inner">
        <MdOutlineDateRange className="react-icon" />
        <p>{props.date}</p>
      </div>
      <div className="treatment-inner">
        <MdOutlineDescription className="react-icon" />
        <p>{props.description}</p>
      </div>
    </div>
  );
}

export default PrevTreatment;
