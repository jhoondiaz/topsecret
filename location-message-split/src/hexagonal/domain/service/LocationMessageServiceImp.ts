/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationMessageService } from "../port/api/LocationMessageService";
import {
  CODES,
  HEADERS,
  MESSAGES,
  VALIDATIONS,
} from "../../../utils/Constants";
import { DynamoConnector } from "../port/spi/DynamoConnector";

import { v4 as uuidv4 } from "uuid";
import * as moment from "moment-timezone";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const solveQuadraticEquation = require("solve-quadratic-equation");

export class LocationMessageServiceImp implements LocationMessageService {
  public static readonly constructorInjections = ["DynamoConnector"];
  public static readonly propertyInjections = [];

  public _bdProvider: DynamoConnector;
  private distances: Array<number> = [];
  private messages: Array<string> = [];

  constructor(dynamoConnector: DynamoConnector) {
    this._bdProvider = dynamoConnector;
  }

  async postLocationMessage(
    satelliteName: string,
    satelliteInfo: any
  ): Promise<any> {
    try {
      const timestamp = moment(new Date())
        .tz("America/Bogota")
        .format("YYYYMMDDHHmmss");

      const options = {
        TableName: process.env.DYNAMO_TABLE,
        Item: {
          uuid: uuidv4(),
          timestamp: Number(timestamp),
          name: satelliteName,
          info: JSON.stringify(satelliteInfo),
        },
      };

      await this._bdProvider.putItem(options);

      const response = {
        statusCode: 200,
        headers: HEADERS,
        body: JSON.stringify({
          message: "Informacion almacenada con exito",
          informacion: satelliteInfo,
        }),
        isBase64Encoded: false,
      };

      return response;
    } catch (error) {
      console.log(`General Error ${error.message}`, error);
      throw error;
    }
  }

  async getLocationMessage(satelliteName: string): Promise<any> {
    console.log("body: ", satelliteName);

    const optionsGet = {
      TableName: process.env.DYNAMO_TABLE,
      IndexName: "name-index",
      KeyConditionExpression: "#sts = :sts",
      ExpressionAttributeNames: {
        "#sts": "name",
      },
      ExpressionAttributeValues: {
        ":sts": satelliteName,
      },
    };

    for (const satellite of VALIDATIONS.satellites) {
      optionsGet.ExpressionAttributeValues[":sts"] = satellite.name;
      const itemsResult = await this._bdProvider.getInfoTable(optionsGet);

      await this.orderLocationMessages(itemsResult.Items);
    }

    console.log("this.messages", this.messages);

    if (this.messages.length != 3) {
      throw new Error(
        "Aun no es posible determinar la posicion ni el mensaje hasta no suministrar los datos de los 3 satelites"
      );
    }

    const position = await this.getLocation(this.distances);
    const message = await this.getMessage(this.messages);

    const responseBody = {
      position: position,
      message: message,
    };

    const code =
      typeof position == "string" ? CODES.codeError : CODES.codeSuccess;

    const response = {
      statusCode: code,
      headers: HEADERS,
      body: JSON.stringify(responseBody),
      isBase64Encoded: false,
    };

    return response;
  }

  async orderLocationMessages(items: Array<any>): Promise<any> {
    console.log("items: ", items);

    if (items.length != 0) {
      const itemsorder = items.sort((a, b) => b.timestamp - a.timestamp);

      console.log("itemsorder: ", itemsorder);
      const parseItem = JSON.parse(itemsorder[0].info);
      this.distances.push(parseItem.distance);
      this.messages.push(parseItem.message);
    }

    return true;
  }

  async getLocation(distances: Array<number>): Promise<any> {
    console.log("distances method", distances);

    const N: number = this.round(
      -1350 - (Math.pow(distances[1], 2) - Math.pow(distances[0], 2)) / 200
    );
    console.log("value N: ", N);

    const a = 37;
    const b: number = this.round(-12 * N - 1400);
    const c: number = this.round(
      Math.pow(N, 2) + 400 * N + 290000 - Math.pow(distances[0], 2)
    );

    console.log("value abc: ", a, b, c);
    const valuesx = solveQuadraticEquation(a, b, c);
    console.log("valuesx: ", valuesx);

    const positions = [];
    const sattellite3 = VALIDATIONS.satellites[2].position;
    const desface = VALIDATIONS.desface;
    for (const valx of valuesx) {
      const x: number = this.round(valx);
      const y: number = this.round(-6 * x + N);
      const distance3 = this.round(
        Math.sqrt(
          Math.pow(sattellite3.x - x, 2) + Math.pow(sattellite3.y - y, 2)
        )
      );

      console.log("position: x,y", x, y);
      const evaluateDistance1 = distance3 + desface;
      const evaluateDistance2 = distance3 - desface;
      console.log(
        "evaluateDistance: ",
        evaluateDistance1,
        evaluateDistance2,
        distances[2]
      );
      if (
        evaluateDistance1 >= distances[2] &&
        distances[2] >= evaluateDistance2
      ) {
        positions.push({
          x: this.round(x),
          y: this.round(y),
        });
      }
    }

    const response =
      positions.length == 0
        ? `${MESSAGES.messageNotPosition}: ${distances.join(" ,")}`
        : positions;

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

  round = (value: number): number => {
    const multiplier = Math.pow(10, 1);
    return Math.round(value * multiplier) / multiplier;
  };
}
