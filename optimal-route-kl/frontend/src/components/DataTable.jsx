
import React, { useState, useEffect, useMemo } from 'react';

const DataTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) {
          throw new Error('Data fetching failed');
        }
        const json = await response.json();
        setData(json);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  const filteredData = useMemo(() => {
    return sortedData.filter(item =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortDirectionIcon = (key) => {
    if (sortConfig.key !== key) {
      return null;
    }
    if (sortConfig.direction === 'ascending') {
      return ' ↑';
    }
    return ' ↓';
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };


  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center font-semibold">Error: {error}</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen font-sans leading-normal tracking-normal">
        <div className="container mx-auto px-4 sm:px-8">
            <div className="py-8">
                <div>
                    <h2 className="text-4xl font-extrabold text-center text-white">Sample User Data</h2>
                </div>
                <div className="my-4 flex justify-end">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full sm:w-1/3 p-3 bg-gray-800 text-white border-2 border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 transition"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                    <div className="inline-block min-w-full shadow-2xl rounded-lg overflow-hidden">
                        <table className="min-w-full leading-normal">
                            <thead>
                                <tr>
                                    <th className="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('name')}>
                                        Name {getSortDirectionIcon('name')}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('email')}>
                                        Email {getSortDirectionIcon('email')}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('phone')}>
                                        Phone {getSortDirectionIcon('phone')}
                                    </th>
                                    <th className="px-5 py-3 border-b-2 border-gray-800 bg-gray-800 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider cursor-pointer" onClick={() => requestSort('website')}>
                                        Website {getSortDirectionIcon('website')}
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {paginatedData.map((user, index) => (
                                    <tr key={user.id} className="hover:bg-gray-700 transition duration-300">
                                        <td className={`px-5 py-5 border-b ${index === data.length - 1 ? 'border-transparent' : 'border-gray-800'} bg-gray-800 text-sm`}>
                                            <p className="text-gray-200 whitespace-no-wrap">{user.name}</p>
                                        </td>
                                        <td className={`px-5 py-5 border-b ${index === data.length - 1 ? 'border-transparent' : 'border-gray-800'} bg-gray-800 text-sm`}>
                                            <p className="text-gray-200 whitespace-no-wrap">{user.email}</p>
                                        </td>
                                        <td className={`px-5 py-5 border-b ${index === data.length - 1 ? 'border-transparent' : 'border-gray-800'} bg-gray-800 text-sm`}>
                                            <p className="text-gray-200 whitespace-no-wrap">{user.phone}</p>
                                        </td>
                                        <td className={`px-5 py-5 border-b ${index === data.length - 1 ? 'border-transparent' : 'border-gray-800'} bg-gray-800 text-sm`}>
                                            <p className="text-gray-200 whitespace-no-wrap">{user.website}</p>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="px-5 py-5 bg-gray-800 border-t flex flex-col xs:flex-row items-center xs:justify-between">
                            <span className="text-xs xs:text-sm text-gray-400">
                                Showing {Math.min(currentPage * itemsPerPage - itemsPerPage + 1, filteredData.length)} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} Entries
                            </span>
                            <div className="inline-flex mt-2 xs:mt-0">
                                <button 
                                    className="text-sm text-white font-semibold py-2 px-4 rounded-l-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Prev
                                </button>
                                <button 
                                    className="text-sm text-white font-semibold py-2 px-4 rounded-r-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default DataTable;
