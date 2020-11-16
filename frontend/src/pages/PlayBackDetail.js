import React, { useEffect, useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { Row, Col, ListGroup } from "react-bootstrap";
import LoadingScreen from "components/LoadingScreen";
import { api } from "lib/api";
import "./Game.scss";

const PlayBackDetail = () => {
  const history = useHistory();
  const listRef = useRef();

  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailResponse, setDetailResponse] = useState("");
  
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
          const temp = playBacksDetail.filter(item => item.move !== play.Move);
          playBacksDetail = [...temp, { command, move: play.Move}];
        });
        setDetail(playBacksDetail);
      } catch(err) {
        setDetail([]);
      }
      setLoading(false);
    }
    fetch();
  }, [id, timestamp, userId]);

  const getResponse = async (move) => {
    setDetailLoading(true);
    const response = await api({
      method: "POST",
      url: `/playbacks_detail`,
      data: {
        id,
        timestamp,
        userId,
        move
      }
    });
    const res = JSON.parse(response.result.Response).response;
    setDetailResponse(res);
    setDetailLoading(false);
  };

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
                        onClick={() => getResponse(item.move)}
                      >
                        { item.command }
                      </ListGroup.Item>  
                    ))
                }
              </ListGroup>
            </Col>
            <Col>
              <h4 className="mb-4 text-center">Response</h4>
              {/* <div
                className="command px-4 py-2 d-border"
                dangerouslySetInnerHTML={{
                  __html: detailResponse
                }}
              /> */}
              <div
                className="command px-4 py-2 d-border"
              >{detailResponse}</div>
            </Col>
          </Row>
        )
      }
    </div>
  );
};

export default PlayBackDetail;