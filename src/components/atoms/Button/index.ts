import styled from "styled-components";

export default styled.button<{
  fontSize?: string;
  width?: string;
  height?: string;
}>`
  ${({ width }) => width && `width: ${width}`};
  ${({ height }) => height && `height: ${height}`};
  ${({ fontSize }) => fontSize && `font-size: ${fontSize}`};
  ${({ disabled }) => !disabled && `  cursor: pointer`};
  padding: 0px 1em;
  border-radius: 3px;
  outline: 0;
  background: ${({ theme: { colors }, disabled }) =>
    !disabled ? colors.secondary : colors.grey};
  color: white;
  border: 0;

  &:hover {
    ${({ theme: { colors }, disabled }) =>
      !disabled && `background: ${colors.secondary1}`};
  }
`;
