import React, {useState,useEffect} from 'react';
import './App.css';

const API_URL = 'https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json';
const ROWS_PER_PAGE = 10;

const App = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        setData(jsonData);
        setLoading(false);
      } catch (e) {
        console.error("Failed to fetch data:", e);
        setError(true);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const totalPages= Math.ceil(data.length / ROWS_PER_PAGE);
  const startIndex= (currentPage -1)*ROWS_PER_PAGE;
  const endIndex =startIndex+ROWS_PER_PAGE;
  const currentData =data.slice(startIndex, endIndex);

  const handleNext =() =>{
    if (currentPage<totalPages) {
      setCurrentPage(currentPage+1);
    }
  };

  const handlePrevious =()=> {
    if (currentPage>1) {
      setCurrentPage(currentPage-1);
    }
  };

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">Failed to fetch data</div>;
  }

  return (
    <div className="app-container">
      <div className="table-wrapper">
        <div className="table-header">
          <h1>Employee Data Table</h1>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {currentData.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.id}</td>
                  <td>{employee.name}</td>
                  <td>{employee.email}</td>
                  <td>{employee.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span className="page-number">{currentPage}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;