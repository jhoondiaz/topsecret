export const CODES = {
  codeSuccess: 200,
  codeError: 404,
};

export const MESSAGES = {
  messageNotPosition:
    "No fue posible determinar la posicion con las distancias ingresadas",
  messageNameInvalid: "El nombre de satellite enviado no es valido",
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
        x: 100,
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
  desface: 0.1,
};

export const SATELLITENAMES = ["kenobi", "skywalker", "sato"];

export const HEADERS = {
  "Access-Control-Allow-Headers":
    "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET",
  "x-amzn-ErrorType": "",
};
