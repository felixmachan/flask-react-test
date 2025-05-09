import React from "react";

function Map() {
  return (
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2680.785609574428!2d19.133485575574085!3d47.78560507120685!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47402af478282771%3A0x5d7b0f0e8622f43a!2zVsOhYywgTsOhcmNpc3oga8O2eiA1LCAyNjAw!5e0!3m2!1sen!2shu!4v1746455484739!5m2!1sen!2shu"
      style={{
        borderRadius: "10px",
        width: "100%",
        height: "100%",
      }}
      allowfullscreen
      loading="lazy"
      referrerpolicy="no-referrer-when-downgrade"
    ></iframe>
  );
}

export default Map;
