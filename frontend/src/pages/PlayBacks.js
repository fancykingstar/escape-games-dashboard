import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, ListGroup, Form } from "react-bootstrap";
import { DateRangePicker } from 'react-date-range';
import LoadingScreen from "components/LoadingScreen";
import { api } from "lib/api";
import "./Game.scss";

const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
}

const PlayBacks = () => {
  const history = useHistory();
  const dateState = localStorage.getItem("currentDate");
  const [list, setList] = useState([]);
  const [state, setState] = useState(dateState ? [
    {
      startDate: new Date(JSON.parse(dateState).startDate),
      endDate: new Date(JSON.parse(dateState).endDate),
      key: 'selection'
    }
  ] : [
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [dateRange, setDateRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(false);

  const { pathname } = history.location;
  const name = pathname.split("/")[1];
  const id = pathname.split("/")[2];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const { startDate, endDate } = state[0];
      const start = new Date(startDate.toDateString());
      const end = new Date(endDate.toDateString());
      const s_date = startDate.toDateString().slice(4,);
      const e_date = endDate.toDateString().slice(4,);
      setDateRange(s_date + " - " + e_date);
      try {
        const response = await api({
          method: "POST",
          url: `/playbacks/${id}`,
          data: {
            startDate: start,
            endDate: end
          }
        });
        setList(response.result.list);
      } catch(err) {
        setList([]);
      }
      setLoading(false);
    }
    fetch();
  }, [id, state])
  
  const getResult = async () => {
    setLoading(true);
    setInputValue(false);
    const { startDate, endDate } = state[0];
    const start = new Date(startDate.toDateString());
    const end = new Date(endDate.toDateString());
    const s_date = startDate.toDateString().slice(4,);
    const e_date = endDate.toDateString().slice(4,);
    setDateRange(s_date + " - " + e_date);
    try {
      const response = await api({
        method: "POST",
        url: `/playbacks/${id}`,
        data: {
          startDate: start,
          endDate: end
        }
      });
      setList(response.result.list);
    } catch(err) {
      setList([]);
    }
    setLoading(false);
  }

  const goDetail = (timestamp, userId) => {
    const { startDate, endDate } = state[0];
    localStorage.setItem(
      "currentDate",
      JSON.stringify({
        startDate,
        endDate,
      })
    )
    history.push(`/${name}/${id}/${timestamp}?userId=${userId}`)
  }

  return (
    <div>
      <h2 className="text-center mb-2">{ name }</h2>
      <div className="d-flex align-items-end position-relative mb-3 justify-content-center">
        <Form.Control
          type="text"
          defaultValue={dateRange || undefined}
          style={{
            maxWidth: 300
          }}
          onFocus={() => setInputValue(true)}
        />
        <Button
          className="ml-2"
          variant="primary"
          onClick={getResult}
        >Submit</Button>
      </div>
      {
        inputValue &&
          <div className="position-absolute" style={{ zIndex: 1 }}>
            <DateRangePicker
              onChange={item => setState([item.selection])}
              showSelectionPreview={true}
              moveRangeOnFirstSelection={false}
              months={2}
              ranges={state}
              direction="horizontal"
            />
          </div>
      }
      {
        loading ? (
          <LoadingScreen />
        ) : (
          <>
            <ListGroup variant="flush">
              {
                list
                  .map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="cursor-pointer game-item"
                      onClick={() => goDetail(item.Timestamp, item.UserId)}
                    >
                      { formatDate(item.Timestamp) }
                    </ListGroup.Item>  
                  ))
              }
            </ListGroup>
          </>
        )
      }
    </div>
  )
};

export default PlayBacks;