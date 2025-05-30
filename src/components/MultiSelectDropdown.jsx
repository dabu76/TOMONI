import React, { useState, useEffect } from "react";
import { Dropdown, Form, Button } from "react-bootstrap"; // Added Button import for reset

const CustomToggle = React.forwardRef(({ children, onClick }, ref) => (
  <button
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
    className="main_button_item"
  >
    {children}
  </button>
));
const CustomDropdownItem = React.forwardRef(
  ({ children, onClick, ...props }, ref) => (
    <div
      ref={ref}
      onClick={(e) => {
        e.stopPropagation();
        onClick && onClick(e);
      }}
      style={{ padding: "0.5rem 1rem" }}
      {...props}
    >
      {children}
    </div>
  )
);

function MultiSelectDropdown({
  title,
  options,
  selectedValues,
  onValueChange,
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = (nextShow, meta) => {
    if (meta && meta.source === "rootClose") {
      setIsOpen(false);
    } else {
      setIsOpen(nextShow);
    }
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newSelectedValues;
    if (checked) {
      newSelectedValues = [...selectedValues, value];
    } else {
      newSelectedValues = selectedValues.filter((val) => val !== value);
    }
    onValueChange(newSelectedValues);
  };

  const displayValue =
    selectedValues.length > 0 ? selectedValues.join(", ") : "すべて";

  const currentSelectionText =
    selectedValues.length > 0
      ? `${title} (${selectedValues.length})`
      : `${title}`;

  return (
    <Dropdown show={isOpen} onToggle={handleToggle} autoClose="outside">
      <Dropdown.Toggle as={CustomToggle} id={`dropdown-${title.toLowerCase()}`}>
        {currentSelectionText}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {options.map((option) => (
          <CustomDropdownItem key={option.value}>
            <Form.Check
              type="checkbox"
              id={`${title}-${option.value}`}
              label={option.label}
              value={option.value}
              checked={selectedValues.includes(option.value)}
              onChange={handleCheckboxChange}
            />
          </CustomDropdownItem>
        ))}
        {selectedValues.length > 0 && <Dropdown.Divider />}
        <CustomDropdownItem>
          <Button
            variant="link"
            size="sm"
            onClick={() => {
              onValueChange([]);
              setIsOpen(false);
            }}
          >
            リセット
          </Button>
        </CustomDropdownItem>
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default MultiSelectDropdown;
