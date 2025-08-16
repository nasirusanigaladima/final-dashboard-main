import React from 'react';
import { majors } from '../constants/majors';

const StudentFormField = ({ header, value, onChange, className = "" }) => {
  if (header === 'Gender') {
    return (
      <select
        value={value || ""}
        onChange={onChange}
        className={className}
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
        <option value="Prefer not to say">Prefer not to say</option>
      </select>
    );
  }

  if (header === 'Major') {
    return (
      <select
        value={value || ""}
        onChange={onChange}
        className={className}
      >
        <option value="">Select Major</option>
        {majors.map(major => (
          <option key={major} value={major}>{major}</option>
        ))}
      </select>
    );
  }

  return (
    <input
      type={header === 'DateOfBirth' ? 'date' : 'text'}
      value={value || ""}
      onChange={onChange}
      className={className}
    />
  );
};

export default StudentFormField;
