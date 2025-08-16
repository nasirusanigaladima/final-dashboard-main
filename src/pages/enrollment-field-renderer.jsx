import React from "react";

const genders = ["Male", "Female", "Other"];
const majors = [
  "Biology",
  "Computer Science",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Engineering",
  "Business Administration",
  "Economics",
  "Political Science",
  "History",
  "English",
  "Psychology",
  "Sociology",
  "Environmental Science",
  "Statistics",
  "Philosophy",
  "Art",
  "Education"
];

export function renderEnrollmentField(header, newEnrollment, handleNewEnrollmentChange, courses) {
  if (header === "CourseID") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <select
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        >
          <option value="" className="text-gray-800">Select Course</option>
          {courses.filter(row => row && row.includes(",") && !row.startsWith(",")).map((courseRow) => {
            const parts = courseRow.split(",");
            const courseId = parts[0];
            const courseName = parts[1] || "";
            return (
              <option key={courseId} value={courseId} className="text-gray-800">
                {courseId}{courseName ? ` - ${courseName}` : ""}
              </option>
            );
          })}
        </select>
      </div>
    );
  }
  if (header.toLowerCase() === "gender") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <select
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        >
          <option value="" className="text-gray-800">Select Gender</option>
          {genders.map((g) => (
            <option key={g} value={g} className="text-gray-800">{g}</option>
          ))}
        </select>
      </div>
    );
  }
  if (header.toLowerCase() === "major") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <select
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        >
          <option value="" className="text-gray-800">Select Major</option>
          {majors.map((m) => (
            <option key={m} value={m} className="text-gray-800">{m}</option>
          ))}
        </select>
      </div>
    );
  }
  if (header.toLowerCase() === "dateofbirth" || header.toLowerCase() === "dob") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <input
          type="date"
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        />
      </div>
    );
  }
  // Default: text input
  return (
    <div key={header} className="mb-4">
      <label className="block text-white text-sm font-medium mb-2">{header}</label>
      <input
        type="text"
        value={newEnrollment[header] || ""}
        onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
        className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        placeholder={`Enter ${header}`}
        required
      />
    </div>
  );
}
