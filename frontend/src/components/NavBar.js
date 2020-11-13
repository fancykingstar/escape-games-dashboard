import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Breadcrumb } from "react-bootstrap";

const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
}

const NavBar = () => {
  const history = useHistory();
  const { pathname } = history.location;
  const name = pathname.split("/")[1];
  const id = pathname.split("/")[2];
  const playback = pathname.split("/")[3];
  useEffect(() => {
  })

  return (
    <div>
      <h1>Escape Games</h1>
      <Breadcrumb>
        <Breadcrumb.Item href="/" active={!!!name}>Games</Breadcrumb.Item>
        {
          name &&
            <Breadcrumb.Item href={`/${name}/${id}`} active={!!!playback}>
              {name}
            </Breadcrumb.Item>
        }
        {
          playback &&
            <Breadcrumb.Item active={!!playback}>
              {formatDate(playback)}
            </Breadcrumb.Item>
        }
      </Breadcrumb>
    </div>
  )
};

export default NavBar;