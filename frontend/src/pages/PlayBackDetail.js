import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import LoadingScreen from "components/LoadingScreen";
import { api } from "lib/api";

const PlayBackDetail = () => {
  const [detail, setDetail] = useState();
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const { pathname } = history.location;
  const name = pathname.split("/")[1];
  const id = pathname.split("/")[2];
  const timestamp = pathname.split("/")[3];
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const response = await api({ method: "GET", url: `/playbacks/${id}/${timestamp}` });
        setDetail(response.result);
        console.log(response.result)
      } catch(err) {
        setDetail([]);
      }
      setLoading(false);
    }
    fetch();
  }, []);

  return (
    <div>
      <h2 className="text-center">{ name }</h2>
      {
        loading ? (
          <LoadingScreen />
        ) : (
          <div />
        )
      }
    </div>
  );
};

export default PlayBackDetail;