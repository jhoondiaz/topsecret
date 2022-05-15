/* eslint-disable @typescript-eslint/no-explicit-any */
import "reflect-metadata";
import { CONTROLLERS } from "./hexagonal/infrastructure/config/Types";
import { AppContainer } from "./hexagonal/infrastructure/config/inversify.config";
import { LocationMessageController } from "./hexagonal/application/controller/LocationMessageController";
import { CODES, HEADERS } from "./utils/Constants";

let controller: LocationMessageController;

export const handler = async (event: any): Promise<any> => {
  try {
    event = await mapInput(event);

    controller = AppContainer.get<LocationMessageController>(
      CONTROLLERS.LocationMessageController
    );

    console.log("event: ", event);
    const response = await controller.maindistributor(event);

    console.log("Response: ", response);
    return response;
  } catch (error) {
    const response = {
      statusCode: CODES.codeError,
      headers: HEADERS,
      body: JSON.stringify(error.message),
      isBase64Encoded: false,
    };
    return response;
  }
};

const mapInput = async (event) => {
  const body = JSON.parse(event.body);
  const eventFinal = {
    path: event.path,
    httpMethod: event.httpMethod,
    satellites: body ? body.satellites : null,
  };
  return eventFinal;
};
