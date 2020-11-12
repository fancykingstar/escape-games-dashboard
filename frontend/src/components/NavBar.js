import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

const NavBar = () => {
  const history = useHistory();
  useEffect(() => {
    console.log("======", history);
  })

  return (
    <div>
      <h1>Escape Games</h1>
      <Breadcrumb>
        <Breadcrumb.Item href="/">Games</Breadcrumb.Item>
        <Breadcrumb.Item href="">
          Library
        </Breadcrumb.Item>
        <Breadcrumb.Item active>Data</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  )
};

export default NavBar;