import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, ListGroup, Form, Tabs, Tab } from "react-bootstrap";
import LoadingScreen from "components/LoadingScreen";
import { api } from "lib/api";
import "./Game.scss";
import { setWeekYear } from "date-fns";

const PlayBackDetail = () => {
  const history = useHistory();
  const listRef = useRef();

  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailResponse, setDetailResponse] = useState("");
  const [endStateValue, setEndStateValue] = useState("");
  const [startStateValue, setStartStateValue] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [key, setKey] = useState("start");
  const [currentItem, setCurrentItem] = useState(null);
  
  const { pathname, search } = history.location;
  const id = pathname.split("/")[2];
  const timestamp = pathname.split("/")[3];
  const userId = new URLSearchParams(search).get("userId");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await api({
          method: "POST",
          url: `/playbacks`,
          data: {
            id,
            timestamp,
            userId,
          }
        });
        let playBacksDetail = [];
        response.result.forEach((play, i) => {
          const command = Object.values(JSON.parse(play.Move)).join(" ");
          const res = JSON.parse(play.Response).response;
          const endState = JSON.stringify(JSON.parse(play.EndState), null, 2);
          const startState = JSON.stringify(JSON.parse(play.StartState), null, 2);
          
          playBacksDetail.push(
            {
              command,
              response: res,
              endState,
              startState,
              move: play.Move
            }
          );
        });
        setDetail(playBacksDetail);
      } catch(err) {
        setDetail([]);
      }
      setLoading(false);
    }
    fetch();
  }, [id, timestamp, userId]);

  const getResponse = (index, res, start, end) => {
    setDetailLoading(true);
    setCurrentItem(index);
    setDetailResponse(res);
    setStartStateValue(start);
    setEndStateValue(end);
    key === "start" ? setStateValue(start) : setStateValue(end);
    setDetailLoading(false);
  };

  const changeResponse = (k) => {
    k === "start" ? setStateValue(startStateValue) : setStateValue(endStateValue);
  }

  return (
    <div className="position-relative">
      <h2 className="text-center mb-5"> PlayBacks Detail</h2>
      <div className="position-absolute detail-loading">
        {
          detailLoading && <LoadingScreen />
        }
      </div>
      {
        loading ? (
          <div className="position-absolute detail-loading">
            <LoadingScreen />
          </div>
        ) : (
          <Row>
            <Col>
              <h4 className="mb-4 text-center">Commands</h4>
              <ListGroup
                ref={listRef}
                variant="flush"
                className="command d-border"
              >
                {
                  detail
                    .map((item, index) => (
                      <ListGroup.Item
                        key={index}
                        className="cursor-pointer game-item"
                        onClick={() => getResponse(index, item.response, item.startState, item.endState)}
                        style={{
                          backgroundColor: index === currentItem ? "lightgray" : "white"
                        }}
                      >
                        {index + 1}{". "}{ item.command }
                      </ListGroup.Item>  
                    ))
                }
              </ListGroup>
            </Col>
            <Col>
              <div className="mb-5">
                <h4 className="mb-4 text-center">Response</h4>
                <div
                  className="response px-4 py-2 d-border"
                >{detailResponse}</div>
              </div>
              <div>
                <Tabs
                  defaultActiveKey="start"
                  id="uncontrolled-tab-example"
                  onSelect={(k) => {
                    changeResponse(k);
                    setKey(k);
                  }}
                >
                  <Tab
                    eventKey="start"
                    title="Start State"
                  >
                  </Tab>
                  <Tab
                    eventKey="end"
                    title="End State"
                  >
                  </Tab>
                </Tabs>
                <Form.Control
                  as="textarea"
                  rows="11"
                  className="d-border end-state"
                  defaultValue={stateValue}
                  key={stateValue}
                />
              </div>
            </Col>
          </Row>
        )
      }
    </div>
  );
};

export default PlayBackDetail;