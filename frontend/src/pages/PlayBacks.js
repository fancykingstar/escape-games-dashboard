import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { ListGroup } from "react-bootstrap";
import LoadingScreen from "components/LoadingScreen";
import CustomPagination from "components/Pagination";
import { api } from "lib/api";
import "./Game.scss";
const PER_PAGE = 10;

const formatDate = (date) => {
  const newDate = new Date(date);
  return newDate.toLocaleDateString() + " " + newDate.toLocaleTimeString();
}

const PlayBacks = () => {
  const [list, setList] = useState([]);
  const [totalCount, setTotalCount] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { pathname } = history.location;
  const name = pathname.split("/")[1];
  const id = pathname.split("/")[2];
  
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await api({ method: "GET", url: `/playbacks/${id}` });
        setList(response.result);
        setTotalCount(response.result.length);
      } catch(err) {
        setList([]);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  }

  return (
    <div>
      <h2 className="text-center">{ name }</h2>
      {
        loading ? (
          <LoadingScreen />
        ) : (
          <>
            <ListGroup variant="flush">
              {
                list
                  .filter((_, i) => i >= PER_PAGE * (activePage-1) && i < PER_PAGE * activePage)
                  .map((item, index) => (
                    <ListGroup.Item
                      key={index}
                      className="cursor-pointer game-item"
                      onClick={() => {
                        history.push(`/${name}/${id}/${item.Timestamp}`)
                      }}
                    >
                      { formatDate(item.Timestamp) }
                    </ListGroup.Item>  
                  ))
              }
            </ListGroup>
            <CustomPagination
              perPage={PER_PAGE}
              totalCount={totalCount}
              activePage={activePage}
              handlePageChange={handlePageChange}
            />
          </>
        )
      }
    </div>
  )
};

export default PlayBacks;