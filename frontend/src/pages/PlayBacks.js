import React from "react";
import { useHistory } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import Layout from "container/Layout";
import "./Game.scss";

const List = [
  { id: 0, name: "Tutorial" },
  { id: 1, name: "The Dungeon" },
  { id: 2, name: "Butch McClain's Hideout" },
  { id: 3, name: "Calico Jack's Lair" },
  { id: 4, name: "Insane Asylum" },
];

const PlayBacks = () => {
  const history = useHistory();
  return (
    <div>
      <h2 className="text-center">Games</h2>
      <ListGroup variant="flush">
      {
        List.map((item, index) => (
          <ListGroup.Item
            key={item.id}
            className="cursor-pointer game-item"
            onClick={() => {
              history.push(`/${item.name}`)
            }}
          >
            { item.name }
          </ListGroup.Item>  
        ))
      }
      </ListGroup>
    </div>
  )
};

export default PlayBacks;