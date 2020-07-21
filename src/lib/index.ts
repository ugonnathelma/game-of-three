// should be an env variable normally

const API_URL = "http://localhost:3001";

export const makeMove = async (number: number, playerId: string) => {
  fetch(`${API_URL}/move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: playerId,
      move: number,
    }),
  });
};

export const getMoves = async (playerId: string) => {
  const response = await fetch(`${API_URL}/moves?id=${playerId}`);
  return await response.json();
};
