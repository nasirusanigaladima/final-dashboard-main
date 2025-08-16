import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Papa from "papaparse";
import Header from "../components/header";
import Footer from "../components/Footer";

const Courses = () => {
  const [enrollmentCounts, setEnrollmentCounts] = useState({});
  useEffect(() => {
    async function fetchEnrollments() {
      try {
        const response = await fetch('/enrollments.csv');
        const csvText = await response.text();
        const rows = csvText.split('\n').slice(1).filter(Boolean);
        const counts = {};
        rows.forEach(row => {
          const cols = row.split(',');
          const courseId = cols[2];
          if (courseId) {
            counts[courseId] = (counts[courseId] || 0) + 1;
          }
        });
        setEnrollmentCounts(counts);
      } catch (e) { setEnrollmentCounts({}); }
    }
    fetchEnrollments();
  }, []);
  const [data, setData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourse, setNewCourse] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 50;

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    const csvData = "/courses.csv";
    try {
      const response = await fetch(csvData);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => header.trim(),
        complete: (results) => {
          setHeaders(Object.keys(results.data[0] || {}));
          setData(results.data);
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Error loading CSV:", error);
      setIsLoading(false);
    }
  };

  const filteredAndSortedData = data
    .filter((row) => {
      const searchMatch =
        !searchTerm ||
        Object.values(row).some((value) =>
          String(value).toLowerCase().includes(searchTerm.toLowerCase())
        );

      const filterMatch =
        !filterField ||
        !filterValue ||
        String(row[filterField])
          .toLowerCase()
          .includes(filterValue.toLowerCase());

      return searchMatch && filterMatch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;

      const aVal = String(a[sortField] || "").toLowerCase();
      const bVal = String(b[sortField] || "").toLowerCase();

      if (sortOrder === "asc") {
        return aVal.localeCompare(bVal, undefined, { numeric: true });
      } else {
        return bVal.localeCompare(aVal, undefined, { numeric: true });
      }
    });

  const paginatedData = filteredAndSortedData.slice(
    currentPage * rowsPerPage,
    (currentPage + 1) * rowsPerPage
  );

  const totalPages = Math.ceil(filteredAndSortedData.length / rowsPerPage);

  const handleCellClick = (rowIndex, field, value) => {
    setEditingCell({ rowIndex, field });
    setEditValue(String(value || ""));
  };

  const handleSaveCell = () => {
    if (editingCell) {
      const newData = [...data];
      const actualRowIndex = data.findIndex(
        (row) => row === paginatedData[editingCell.rowIndex]
      );
      newData[actualRowIndex][editingCell.field] = editValue;
      setData(newData);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const addNewRow = () => {
    setShowAddForm(true);
    const emptyCourse = {};
    headers.forEach((header) => {
      if (header === "CourseID") {
        const maxCourseNum = Math.max(
          ...data.map((row) => {
            const match = String(row.CourseID || "").match(/COURSE(\d+)/);
            return match ? parseInt(match[1]) : 0;
          })
        );
        emptyCourse[header] = `COURSE${maxCourseNum + 1}`;
      } else {
        emptyCourse[header] = "";
      }
    });
    setNewCourse(emptyCourse);
  };

  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    setData([...data, newCourse]);
    setShowAddForm(false);
    setNewCourse({});
  };

  const handleFormKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddFormSubmit(e);
    }
  };

  const handleAddFormCancel = () => {
    setShowAddForm(false);
    setNewCourse({});
  };

  const handleNewCourseChange = (field, value) => {
    setNewCourse((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const deleteRow = (rowIndex) => {
    const actualRowIndex = data.findIndex(
      (row) => row === paginatedData[rowIndex]
    );
    const newData = data.filter((_, index) => index !== actualRowIndex);
    setData(newData);
  };

  const exportCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "courses_modified_edited.csv";
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading course data...</div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-hero-gradient">
        {/* Controls */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <button
              onClick={exportCSV}
              className="bg-white bg-opacity-20 text-white px-6 py-2 rounded-lg hover:bg-opacity-30 transition-all duration-200 backdrop-blur-sm"
            >
              Export CSV
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white w-4 h-4" />
              <input
                type="text"
                placeholder="Search all fields..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              />
            </div>

            <select
              value={filterField}
              onChange={(e) => setFilterField(e.target.value)}
              className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
            >
              <option value="">Filter by field...</option>
              {headers.map((header) => (
                <option key={header} value={header} className="text-gray-800">
                  {header}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Filter value..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
              disabled={!filterField}
              className="px-4 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
            />

            <button
              onClick={addNewRow}
              className="flex items-center justify-center space-x-2 bg-green-500 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Course</span>
            </button>
          </div>

          <div className="text-white text-sm">
            Showing {paginatedData.length} of {filteredAndSortedData.length}{" "}
            courses (Page {currentPage + 1} of {totalPages || 1})
          </div>
        </div>

        {/* Add Course Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">
                  Add New Course
                </h2>
                <button
                  onClick={handleAddFormCancel}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form
                onSubmit={handleAddFormSubmit}
                onKeyDown={handleFormKeyDown}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {headers.map((header) => (
                    <div
                      key={header}
                      className={header === "CourseName" ? "md:col-span-2" : ""}
                    >
                      <label className="block text-white text-sm font-medium mb-2">
                        {header}
                      </label>
                      {header === "Department" ? (
                        <select
                          value={newCourse[header] || ""}
                          onChange={(e) =>
                            handleNewCourseChange(header, e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          required
                        >
                          <option value="" className="text-gray-800">
                            Select Department
                          </option>
                          <option value="Biology" className="text-gray-800">
                            Biology
                          </option>
                          <option
                            value="Computer Science"
                            className="text-gray-800"
                          >
                            Computer Science
                          </option>
                          <option value="Mathematics" className="text-gray-800">
                            Mathematics
                          </option>
                          <option value="Physics" className="text-gray-800">
                            Physics
                          </option>
                        </select>
                      ) : header === "Credits" ? (
                        <select
                          value={newCourse[header] || ""}
                          onChange={(e) =>
                            handleNewCourseChange(header, e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          required
                        >
                          <option value="" className="text-gray-800">
                            Select Credits
                          </option>
                          <option value="1" className="text-gray-800">
                            1 Credit
                          </option>
                          <option value="2" className="text-gray-800">
                            2 Credits
                          </option>
                          <option value="3" className="text-gray-800">
                            3 Credits
                          </option>
                          <option value="4" className="text-gray-800">
                            4 Credits
                          </option>
                        </select>
                      ) : header === "CourseID" ? (
                        <input
                          type="text"
                          value={newCourse[header] || ""}
                          onChange={(e) =>
                            handleNewCourseChange(header, e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          readOnly
                        />
                      ) : (
                        <input
                          type="text"
                          value={newCourse[header] || ""}
                          onChange={(e) =>
                            handleNewCourseChange(header, e.target.value)
                          }
                          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                          placeholder={`Enter ${header}`}
                          required
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex justify-end space-x-4 mt-6">
                  <button
                    type="button"
                    onClick={handleAddFormCancel}
                    className="px-6 py-2 bg-red-500 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-500 bg-opacity-80 text-white rounded-lg hover:bg-opacity-100 transition-all duration-200"
                  >
                    Add Course (Enter)
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Data Table */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-white bg-opacity-10">
                  {headers.map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-white font-semibold cursor-pointer hover:bg-white hover:bg-opacity-10 transition-colors duration-200"
                      onClick={() => handleSort(header)}
                    >
                      <div className="flex items-center space-x-2">
                        <span>{header}</span>
                        {sortField === header &&
                          (sortOrder === "asc" ? (
                            <SortAsc className="w-4 h-4" />
                          ) : (
                            <SortDesc className="w-4 h-4" />
                          ))}
                      </div>
                    </th>
                  ))}
                  <th className="px-4 py-3 text-white font-semibold"># Students</th>
                  <th className="px-4 py-3 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={rowIndex}
                    className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors duration-200"
                  >
                    {headers.map((header) => (
                      <td key={header} className="px-4 py-3">
                        {editingCell?.rowIndex === rowIndex &&
                        editingCell?.field === header ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="px-2 py-1 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                              autoFocus
                            />
                            <button
                              onClick={handleSaveCell}
                              className="text-green-400 hover:text-green-300"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-400 hover:text-red-300"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div
                            className="text-white cursor-pointer hover:bg-white hover:bg-opacity-10 p-1 rounded group"
                            onClick={() =>
                              handleCellClick(rowIndex, header, row[header])
                            }
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm">
                                {String(row[header] || "")}
                              </span>
                              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-center font-bold text-green-300">
                      {enrollmentCounts[row.CourseID] || 0}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 bg-white bg-opacity-5">
            <div className="text-white text-sm">
              Showing {currentPage * rowsPerPage + 1} -{" "}
              {Math.min(
                (currentPage + 1) * rowsPerPage,
                filteredAndSortedData.length
              )}{" "}
              of {filteredAndSortedData.length} courses
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              <span className="text-white px-4 py-2">
                Page {currentPage + 1} of {totalPages || 1}
              </span>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
                }
                disabled={currentPage >= totalPages - 1}
                className="px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {filteredAndSortedData.length === 0 && (
          <div className="text-center text-white mt-8">
            <p className="text-xl">No courses found matching your criteria.</p>
            <p className="text-blue-100 mt-2">
              Try adjusting your search or filter terms.
            </p>
          </div>
        )}
        <Footer />
      </div>
    </>
  );
};

export default Courses;
