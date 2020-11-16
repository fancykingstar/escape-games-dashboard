import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Button, ListGroup, Form } from "react-bootstrap";
import { DateRangePicker } from 'react-date-range';
import LoadingScreen from "components/LoadingScreen";
import CustomPagination from "components/Pagination";
import { api } from "lib/api";
import "./Game.scss";
import { isDate } from "date-fns";
const PER_PAGE = 10;

const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
}

const PlayBacks = () => {
  const [list, setList] = useState([]);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection'
    }
  ]);
  const [dateRange, setDateRange] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputValue, setInputValue] = useState(false);
  const history = useHistory();
  const { pathname } = history.location;
  const name = pathname.split("/")[1];
  const id = pathname.split("/")[2];

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      const date = new Date().toDateString().slice(4, -1);
      setDateRange(date + " - " + date);
      const start = new Date(new Date().toDateString());
      try {
        const response = await api({
          method: "POST",
          url: `/playbacks/${id}`,
          data: {
            startDate: start,
            endDate: start
          }
        });
        setList(response.result.list);
      } catch(err) {
        setList([]);
      }
      setLoading(false);
    }
    fetch();
  }, [])
  
  const getResult = async () => {
    setLoading(true);
    setInputValue(false);
    const { startDate, endDate } = state[0];
    const start = new Date(startDate.toDateString());
    const end = new Date(endDate.toDateString());
    const s_date = startDate.toDateString().slice(4, -1);
    const e_date = endDate.toDateString().slice(4, -1);
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
                      onClick={() => {
                        history.push(`/${name}/${id}/${item.Timestamp}?userId=${item.UserId}`)
                      }}
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