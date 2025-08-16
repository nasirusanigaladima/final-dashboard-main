import React, { useState, useEffect } from "react";
import {
  Search,
  Edit2,
  Save,
  X,
  Plus,
  Trash2,
  SortAsc,
  SortDesc,
} from "lucide-react";
import Papa from "papaparse";
import Header from "../components/Header";

import Footer from "../components/Footer";

const Enrollment = () => {
  // Load courses, students and existing data for dropdowns
  // Removed unused courses state
  const [students, setStudents] = useState([]);
  const [courseDetails, setCourseDetails] = useState([]);
  const [existingSemesters, setExistingSemesters] = useState(new Set());
  const [existingYears, setExistingYears] = useState(new Set());

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch all required data in parallel
        const [coursesResponse, studentsResponse, enrollmentsResponse] = await Promise.all([
          fetch('/courses.csv'),
          fetch('/students.csv'),
          fetch('/enrollments.csv')
        ]);

        // Parse courses
        const coursesText = await coursesResponse.text();
        const coursesData = Papa.parse(coursesText, { header: true, skipEmptyLines: true });
        setCourseDetails(coursesData.data);
  // Removed setCourses, not needed

        // Parse students
        const studentsText = await studentsResponse.text();
        const studentsData = Papa.parse(studentsText, { header: true, skipEmptyLines: true });
        setStudents(studentsData.data.map(student => ({
          id: student.StudentID,
          name: `${student.FirstName} ${student.LastName}`,
          gpa: student.GPA
        })));

        // Parse enrollments to get existing semesters and years
        const enrollmentsText = await enrollmentsResponse.text();
        const enrollmentsData = Papa.parse(enrollmentsText, { header: true, skipEmptyLines: true });
        const semesters = new Set();
        const years = new Set();
        enrollmentsData.data.forEach(enrollment => {
          if (enrollment.Semester) semesters.add(enrollment.Semester);
          if (enrollment.Year) years.add(enrollment.Year);
        });
        setExistingSemesters(semesters);
        setExistingYears(years);
      } catch (error) {
        console.error('Failed to load data:', error);
  // Removed setCourses, not needed
        setStudents([]);
      }
    }
    fetchData();
  }, []);
  // Remove unused function as we're using setShowAddForm directly

  const handleAddFormCancel = () => {
    setShowAddForm(false);
    setNewEnrollment({});
  };

  const handleStudentSelect = (studentId) => {
    const selectedStudent = students.find(s => s.id === studentId);
    if (selectedStudent) {
      setNewEnrollment(prev => ({
        ...prev,
        StudentID: selectedStudent.id,
        StudentName: selectedStudent.name,
        GPA: selectedStudent.gpa
      }));
    }
  };

  const handleNewEnrollmentChange = (field, value) => {
    if (field === 'StudentID') {
      handleStudentSelect(value);
    } else {
      setNewEnrollment((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleAddFormSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Validate required fields
      if (!newEnrollment.StudentID || !newEnrollment.CourseID || !newEnrollment.Year || !newEnrollment.Semester) {
        alert('Please fill in all required fields: Student, Course, Year, and Semester');
        return;
      }
      
      // Create the new enrollment object with all fields
      const enrollmentToAdd = {
        StudentID: newEnrollment.StudentID,
        StudentName: newEnrollment.StudentName || '',
        CourseID: newEnrollment.CourseID || '',
        GPA: newEnrollment.GPA || '',
        Grade: newEnrollment.Grade || '',
        Year: newEnrollment.Year || '',
        Semester: newEnrollment.Semester || '',
        EnrollmentID: Date.now().toString() // Generate a unique ID
      };

      // Update the data state with the new enrollment
      setData((prev) => [...prev, enrollmentToAdd]);

      // Reset form and close modal
      setShowAddForm(false);
      setNewEnrollment({});

      // Show success message
      alert('Enrollment added successfully!');
    } catch (error) {
      console.error('Error adding enrollment:', error);
      alert('Failed to add enrollment. Please try again.');
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleCancelEdit = () => {
    setEditingCell(null);
    setEditValue("");
  };

  const deleteRow = (rowIndex) => {
    const actualRowIndex = currentPage * rowsPerPage + rowIndex;
    setData((prev) => prev.filter((_, idx) => idx !== actualRowIndex));
  };
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
  const [newEnrollment, setNewEnrollment] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const rowsPerPage = 50;

  useEffect(() => {
    loadCSVData();
  }, []);

  const loadCSVData = async () => {
    try {
      const [enrollmentsResponse, studentsResponse] = await Promise.all([
        fetch('/enrollments.csv'),
        fetch('/students.csv')
      ]);

      if (!enrollmentsResponse.ok || !studentsResponse.ok) {
        throw new Error('HTTP error! Failed to fetch CSV data.');
      }

      const enrollmentsText = await enrollmentsResponse.text();
      const studentsText = await studentsResponse.text();

      const enrollmentsResults = Papa.parse(enrollmentsText, { header: true, skipEmptyLines: true, dynamicTyping: true });
      const studentsResults = Papa.parse(studentsText, { header: true, skipEmptyLines: true, dynamicTyping: true });

      const studentsMap = new Map(studentsResults.data.map(student => [student.StudentID, student]));

      const combinedData = enrollmentsResults.data.map(enrollment => {
        const student = studentsMap.get(enrollment.StudentID);
        return {
          StudentName: student ? `${student.FirstName} ${student.LastName}` : '',
          CourseID: enrollment.CourseID,
          GPA: student ? student.GPA : '',
          Grade: enrollment.Grade,
          Year: enrollment.Year,
          Semester: enrollment.Semester
        };
      });

      // Set specific headers we want to display
      const displayHeaders = [
        'StudentName',
        'CourseID',
        'GPA',
        'Grade',
        'Year',
        'Semester'
      ];

      setHeaders(displayHeaders);
      setData(combinedData);
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading and merging CSV data:", error);
      setIsLoading(false);
    }
  };

  // Read filter from query params
  const getFilterFromQuery = () => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      return params.get('filter') || 'all';
    }
    return 'all';
  };
  const [studentFilter, setStudentFilter] = useState(getFilterFromQuery());

  // Update filter if query param changes
  useEffect(() => {
    const handlePopState = () => {
      setStudentFilter(getFilterFromQuery());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  let filteredData = data;
  if (studentFilter === "support") {
    filteredData = data.filter(row => parseFloat(row.GPA) <= 2.0);
  } else if (studentFilter === "excelling") {
    filteredData = data.filter(row => parseFloat(row.GPA) >= 3.5);
  }

  const filteredAndSortedData = filteredData
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
      // Calculate the actual row index in the full data array
      const actualRowIndex = currentPage * rowsPerPage + editingCell.rowIndex;
      newData[actualRowIndex][editingCell.field] = editValue;
      setData(newData);
      setEditingCell(null);
      setEditValue("");
    }
  };

  const exportCSV = () => {
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "updated_enrollments_edited.csv";
    link.click();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading enrollment data...</div>
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
              onClick={() => setShowAddForm(true)}
              className="flex items-center justify-center space-x-2 bg-green-500 bg-opacity-80 text-white px-4 py-2 rounded-lg hover:bg-opacity-100 transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              <span>Add Enrollment</span>
            </button>
          </div>
          <div className="text-white text-sm">
            Showing {paginatedData.length} of {filteredAndSortedData.length} enrollments (Page {currentPage + 1} of {totalPages || 1})
          </div>
        </div>
        {/* Add Enrollment Form Modal */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">Add New Enrollment</h2>
                <button
                  onClick={handleAddFormCancel}
                  className="text-white hover:text-red-300 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleAddFormSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-white text-sm font-medium mb-2">Student</label>
                    <select
                      value={newEnrollment.StudentID || ''}
                      onChange={(e) => handleNewEnrollmentChange('StudentID', e.target.value)}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 [&>option]:text-gray-800"
                    >
                      <option value="" className="text-gray-800">Select a Student</option>
                      {students.map(student => (
                        <option key={student.id} value={student.id} className="text-gray-800">{student.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Course</label>
                    <select
                      value={newEnrollment.CourseID || ''}
                      onChange={(e) => handleNewEnrollmentChange('CourseID', e.target.value)}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 [&>option]:text-gray-800"
                    >
                      <option value="" className="text-gray-800">Select a Course</option>
                      {courseDetails.map(course => (
                        <option key={course.CourseID} value={course.CourseID} className="text-gray-800">
                          {course.CourseID} - {course.CourseName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">GPA</label>
                    <input
                      type="text"
                      value={newEnrollment.GPA || ''}
                      disabled
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Grade</label>
                    <select
                      value={newEnrollment.Grade || ''}
                      onChange={(e) => handleNewEnrollmentChange('Grade', e.target.value)}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 [&>option]:text-gray-800"
                    >
                      <option value="" className="text-gray-800">Select Grade</option>
                      <option value="A" className="text-gray-800">A</option>
                      <option value="B" className="text-gray-800">B</option>
                      <option value="C" className="text-gray-800">C</option>
                      <option value="D" className="text-gray-800">D</option>
                      <option value="F" className="text-gray-800">F</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Year</label>
                    <select
                      value={newEnrollment.Year || ''}
                      onChange={(e) => handleNewEnrollmentChange('Year', e.target.value)}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 [&>option]:text-gray-800"
                    >
                      <option value="" className="text-gray-800">Select Year</option>
                      {Array.from(existingYears).sort().map(year => (
                        <option key={year} value={year} className="text-gray-800">{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Semester</label>
                    <select
                      value={newEnrollment.Semester || ''}
                      onChange={(e) => handleNewEnrollmentChange('Semester', e.target.value)}
                      className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded text-white placeholder-white placeholder-opacity-60 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 [&>option]:text-gray-800"
                    >
                      <option value="" className="text-gray-800">Select Semester</option>
                      {Array.from(existingSemesters).sort().map(semester => (
                        <option key={semester} value={semester} className="text-gray-800">{semester}</option>
                      ))}
                    </select>
                  </div>
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
                    Add Enrollment
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
                  <th className="px-4 py-3 text-white font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, rowIndex) => (
                  <tr
                    key={row.EnrollmentID}
                    className="border-b border-white border-opacity-10 hover:bg-white hover:bg-opacity-5 transition-colors duration-200"
                  >
                    {headers.map((header) => {
                      const isEditing = editingCell?.rowIndex === rowIndex && editingCell?.field === header;
                      return (
                        <td key={header} className="px-4 py-3">
                          {isEditing ? (
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
                              onClick={() => handleCellClick(rowIndex, header, row[header])}
                            >
                              <div className="flex items-center justify-between">
                                <span className="text-sm">{String(row[header] || "")}</span>
                                <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => deleteRow(rowIndex)}
                        className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        title="Delete enrollment"
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
              {Math.min((currentPage + 1) * rowsPerPage, filteredAndSortedData.length)}{" "}
              of {filteredAndSortedData.length} enrollments
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
                onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
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
            <p className="text-xl">No enrollments found matching your criteria.</p>
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

export default Enrollment;
