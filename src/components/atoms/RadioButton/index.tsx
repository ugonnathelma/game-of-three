import React, { ChangeEvent } from "react";
import { Wrapper } from "./styles";

type Option = { value: string; label: string };

type RadioButtonType = {
  options: Option[];
  name: string;
  checked: string;
  onCheck: (event: ChangeEvent<HTMLInputElement>) => void;
};

const RadioButton = ({ options, name, checked, onCheck }: RadioButtonType) => {
  return (
    <>
      {options.map(({ value, label }: Option) => (
        <Wrapper key={value}>
          <input
            onChange={onCheck}
            type="radio"
            name={name}
            value={value}
            checked={checked === value}
          />
          <label>{label}</label>
        </Wrapper>
      ))}
    </>
  );
};

export default RadioButton;
