export const CODES = {
  codeSuccess: 200,
  codeError: 400,
};

export const VALIDATIONS = {
  satellites: [
    {
      name: "kenobi",
      position: {
        x: -500,
        y: -200,
      },
    },
    {
      name: "skywalker",
      position: {
        x: -100,
        y: -100,
      },
    },
    {
      name: "sato",
      position: {
        x: 500,
        y: 100,
      },
    },
  ],
  sequence: 4,
};

export const HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
};
