import React, { useState } from 'react';

const DropdownMenu = ({ options, onSelect, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    onSelect(option); // Chama a função passada para selecionar a opção
    setIsOpen(false); // Fecha o dropdown após a seleção
  };

  return (
    <div className="dropdown">
      <button onClick={toggleDropdown} className="dropdown-toggle">
        {selectedOption ? selectedOption.label : label}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map((option) => (
            <li key={option.value} onClick={() => handleOptionClick(option)}>
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DropdownMenu;
