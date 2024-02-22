import React from "react";

const Square = ({ item, onClick }) => {
  return (
    <div
      className={`square ${item != null && "disabled"} }`}
      onClick={onClick}
      style={{ color: item === "X" ? "green" : "purple" }}
    >
      <h1>{item}</h1>
    </div>
  );
};

export default Square;
