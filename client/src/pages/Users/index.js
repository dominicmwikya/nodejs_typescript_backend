import './user.style.css'
export default function Receives({ totalPages, data, take, handlePageChange, handleTakeChange }) {
    // define options for number of records per page
    const takeOptions = [2, 5, 10, 25, 50, 100, 200];
  
    return (
      <div className="content-container">
        <div>
          <label>
            Results per page:
            <select value={take.toString()} onChange={handleTakeChange}>
              {takeOptions.map((option) => (
                <option key={option} value={option.toString()}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>#id</th>
                <th>name</th>
                <th>email</th>
              </tr>
            </thead>
            <tbody>
              {data.map((data) => (
                <tr key={data.id}>
                  <td>{data.id}</td>
                  <td>{data.firstName}</td>
                  <td>{data.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button key={page} onClick={() => handlePageChange(page)}>
              {page}
            </button>
          ))}
        </div>
      </div>
    );
  }
  