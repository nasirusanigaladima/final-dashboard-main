// This file should be named .jsx for JSX syntax compatibility
// Renaming to enrollment-field-renderer.jsx
// Ensure to update any imports accordingly
import React from "react";

export function renderEnrollmentField(header, newEnrollment, handleNewEnrollmentChange) {
  const majors = [
    "Computer Science",
    "Business Administration",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Civil Engineering",
    "Psychology",
    "Biology",
    "Economics",
    "Political Science",
    "Nursing",
    "Chemistry",
    "Mathematics",
    "English Literature",
    "Physics",
    "Finance"
  ];
  const genders = ["Male", "Female", "Other", "Prefer not to say"];
  if (header === "Semester") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <select
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        >
          <option value="" className="text-gray-800">Select Semester</option>
          <option value="1st semester" className="text-gray-800">1st Semester</option>
          <option value="2nd semester" className="text-gray-800">2nd Semester</option>
          <option value="Resit" className="text-gray-800">Resit</option>
        </select>
      </div>
    );
  } else if (header === "Grade") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <select
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          required
        >
          <option value="" className="text-gray-800">Select Grade</option>
          <option value="A" className="text-gray-800">A</option>
          <option value="B" className="text-gray-800">B</option>
          <option value="C" className="text-gray-800">C</option>
          <option value="D" className="text-gray-800">D</option>
          <option value="F" className="text-gray-800">F</option>
        </select>
      </div>
    );
  } else if (header.toLowerCase() === "gender") {
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
  } else if (header.toLowerCase() === "dateofbirth" || header.toLowerCase() === "dob") {
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
  } else if (header.toLowerCase() === "major") {
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
  } else if (header === "EnrollmentID") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <input
          type="number"
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          readOnly
        />
      </div>
    );
  } else if (header === "Year") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <input
          type="number"
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          min="2019"
          max="2025"
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          placeholder="Enter Year (2019-2025)"
          required
        />
      </div>
    );
  } else if (header === "GPA") {
    return (
      <div key={header} className="mb-4">
        <label className="block text-white text-sm font-medium mb-2">{header}</label>
        <input
          type="text"
          value={newEnrollment[header] || ""}
          onChange={(e) => handleNewEnrollmentChange(header, e.target.value)}
          className="w-full px-3 py-2 bg-white bg-opacity-20 border border-white border-opacity-30 rounded-lg text-white placeholder-blue-100 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          placeholder="Enter GPA"
          required
        />
      </div>
    );
  } else {
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
}
