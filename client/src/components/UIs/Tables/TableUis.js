import React, { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

const Index = ({ className, data, _edit, _delete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentIndex, setCurrentIndex] = useState(1);
  const [rowsPerPage] = useState(6);

  if (!data || !Array.isArray(data) || data.length === 0) {
    return <p>No data available.</p>;
  }

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const newIndex = (pageNumber - 1) * rowsPerPage + 1;
    setCurrentIndex(newIndex);
  };

  const displayedColumns = Object.keys(data[0]).filter(
    (key) => key !== 'user' && key !== 'id'
  );

  const renderHeader = () => (
    <thead>
      <tr>
        <th>#ID</th>
        {displayedColumns.map((column) => (
          <th key={column}>{column.toLocaleUpperCase().replace('_', '  ')}</th>
        ))}
        <th colSpan={2}>Actions</th>
      </tr>
    </thead>
  );

  const renderBody = () => {
    const bodyColumns = displayedColumns.filter((column) => column !== 'users');
    return (
      <tbody>
        {currentRows.map((row, index) => (
          <tr key={index}>
            <td>#{currentIndex + index}</td>
            {bodyColumns.map((column) => (
              <td key={column}>{row[column]}</td>
            ))}
            <td>{row.users.email}</td>
            <td>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <i className="fas fa-edit" style={{ color: 'green' }} onClick={() => _edit(row.id)} />
                <i className="fas fa-trash" style={{ color: 'red' }} onClick={() => _delete(row.id)} />
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    );
  };

  return (
    <div className="table-container">
      <div className="container">
        <div className="row">
          <div className="col">
            <div className="table-responsive">
              <Table className={className}>
                {renderHeader()}
                {renderBody()}
              </Table>
              <div>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button key={page} onClick={() => handlePageChange(page)}>
                    {page}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
