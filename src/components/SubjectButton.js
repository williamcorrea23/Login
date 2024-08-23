import React from 'react';

const SubjectButton = ({ subject, onClick, isActive }) => {
  return (
    <button
      className={`subject-button ${isActive ? 'active' : ''}`}
      onClick={() => onClick(subject)}
    >
      {subject}
    </button>
  );
};

export default SubjectButton;