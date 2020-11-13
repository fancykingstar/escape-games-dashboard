import React from "react";
import Pagination from "react-pagination-bootstrap";
import "./Pagination.scss";

const CustomPagination = ({
  perPage,
  totalCount,
  activePage,
  handlePageChange
}) => {
  return (
    <Pagination
      activePage={activePage}
      itemsCountPerPage={perPage}
      totalItemsCount={totalCount}
      onChange={handlePageChange}
      pageRangeDisplayed={5}
    />
  )
}

export default CustomPagination;