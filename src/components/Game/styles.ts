import styled from "styled-components";

export const Play = styled.div<{ thisPlayer: boolean }>`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: ${({ thisPlayer }) => (thisPlayer ? "flex-start" : "flex-end")};
  flex-direction: column;

  p {
    margin: 0;
    margin-bottom: 0.5em;
    color: ${({ theme: { colors } }) => colors.secondary};
    font-weight: bold;
  }

  & > div:first-child {
    font-size: 1em;
    font-weight: bold;
    align-self:center;
    background:white;
  }

  & > div:last-child {
    font-size: 2em;
    font-weight: bold;
    border-radius: 5px;
    width: 70px;
    height: 70px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: ${({ theme: { colors } }) => `2px solid ${colors.secondary}`};
    background: ${({ theme: { colors } }) => colors.cyan};
}

&:nth-of-type(even) > div:last-child {
    background: ${({ theme: { colors } }) => colors.green};
}
  
  }
`;

export const Moves = styled.div`
  position: fixed;
  bottom: 0;
  padding: 1em;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  button {
    margin: 0em 1em;
  }
`;

export const WinnerOverlay = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3em;

  b {
    text-align: center;
    border-radius: 5px;
    padding: 1em;
    background: ${({ theme: { colors } }) => colors.primary};
    border: ${({ theme: { colors } }) => `2px solid ${colors.secondary}`};
  }
`;
