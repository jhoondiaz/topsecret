/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationMessageService } from "../port/api/LocationMessageService";
import { DynamoConnector } from "../port/spi/DynamoConnector";
import * as moment from "moment-timezone";
import {
  CODES,
  HEADERS,
  MESSAGES,
  VALIDATIONS,
} from "../../../utils/Constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const solveQuadraticEquation = require("solve-quadratic-equation");

export class LocationMessageServiceImp implements LocationMessageService {
  public static readonly constructorInjections = ["DynamoConnector"];
  public static readonly propertyInjections = [];

  public _dynamoConnector: DynamoConnector;

  constructor(dynamoConnector: DynamoConnector) {
    this._dynamoConnector = dynamoConnector;
  }

  async postLocationMessage(satellites: Array<any>): Promise<any> {
    try {
      console.log("satellites, ", satellites);

      if (!this.validation(satellites)) {
        throw new Error("Los datos provisionados no son correctos");
      }

      const arrays = await this.orderLocationMessages(satellites);
      const position = await this.getLocation(arrays.distances);
      const message = await this.getMessage(arrays.messages);

      const responseBody = {
        position: position,
        message: message,
      };

      const response = {
        statusCode: CODES.codeSuccess,
        headers: HEADERS,
        body: JSON.stringify(responseBody),
        isBase64Encoded: false,
      };

      return response;
    } catch (error) {
      console.log(`General Error ${error.message}`, error);
      throw error;
    }
  }

  async postDistances(position: any): Promise<any> {
    const distances = [];

    for (const satellite of VALIDATIONS.satellites) {
      const distance = Math.sqrt(
        Math.pow(satellite.position.x - position.x, 2) +
          Math.pow(satellite.position.y - position.y, 2)
      );
      console.log("distance: ", distance);
      distances.push({ name: satellite.name, distance: this.round(distance) });
    }

    const response = {
      statusCode: CODES.codeSuccess,
      headers: HEADERS,
      body: JSON.stringify(distances),
      isBase64Encoded: false,
    };

    return response;
  }

  async orderLocationMessages(satellites: Array<any>): Promise<any> {
    const distances = [];
    const messages = [];

    for (const satellite of satellites) {
      distances.push(satellite.distance);
      messages.push(satellite.message);
    }
    return { distances: distances, messages: messages };
  }

  async getLocation(distances: Array<number>): Promise<any> {
    console.log("distances method", distances);

    const N: number = this.round(
      -1350 - (Math.pow(distances[1], 2) - Math.pow(distances[0], 2)) / 200);
    console.log("value N: ", N);

    const a = 37;
    const b: number = this.round(-12 * N - 1400);
    const c: number =
    this.round(Math.pow(N, 2) + 400 * N + 290000 - Math.pow(distances[0], 2));

    console.log("value abc: ", a, b, c);
    const valuesx = solveQuadraticEquation(a, b, c);
    console.log("valuesx: ", valuesx);

    const positions = [];
    const sattellite3 = VALIDATIONS.satellites[2].position;
    const desface = VALIDATIONS.desface;
    for (const valx of valuesx) {
      const x: number = this.round(valx);
      const y: number = this.round(-6 * x + N);
      const distance3 = this.round(Math.sqrt(
        Math.pow(sattellite3.x - x, 2) + Math.pow(sattellite3.y - y, 2)
      ));

      console.log("position: x,y", x, y);
      const evaluateDistance1 = distance3 + desface;
      const evaluateDistance2 = distance3 - desface;
      console.log("evaluateDistance: ", evaluateDistance1, evaluateDistance2, distances[2]);
      if (evaluateDistance1 >= distances[2] && distances[2] >= evaluateDistance2) {
        positions.push({
          x: this.round(x),
          y: this.round(y),
        });
      }
    }

    const response =
      positions.length == 0 ? MESSAGES.messageNotPosition : positions;

    return response;
  }

  async getMessage(messages: Array<any>): Promise<string> {
    const message = [];
    let condition = 0;
    let cont = 0;

    do {
      for (const iterator of messages) {
        if (iterator[cont] != "" && iterator[cont] != undefined) {
          const messageSize = message.length;
          if (
            (iterator[cont] != message[messageSize - 1] &&
              message[messageSize - 1] != undefined) ||
            messageSize == 0
          ) {
            message.push(iterator[cont]);
          }
        }

        if (iterator.length == cont) {
          condition++;
        }
      }

      cont++;
    } while (condition != messages.length);
    return message.join(" ");
  }

  validation = (satellites: Array<any>): boolean => {
    const dnalength: number = satellites.length;

    if (dnalength != 3) {
      return false;
    }

    for (const satellite of satellites) {
      const validateName = VALIDATIONS.satellites.find(
        (data) => data.name == satellite.name
      );

      if (!validateName) {
        return false;
      }
    }

    return true;
  }

  round = (value: number): number => {
    const multiplier = Math.pow(10, 1);
    return Math.round(value * multiplier) / multiplier;
  }
}
