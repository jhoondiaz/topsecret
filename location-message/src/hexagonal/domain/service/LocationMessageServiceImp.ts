/* eslint-disable @typescript-eslint/no-explicit-any */
import { LocationMessageService } from "../port/api/LocationMessageService";
import { DynamoConnector } from "../port/spi/DynamoConnector";
import { v4 as uuidv4 } from "uuid";
import * as moment from "moment-timezone";
import { CODES, HEADERS, VALIDATIONS } from "../../../utils/Constants";

export class LocationMessageServiceImp implements LocationMessageService {
  public static readonly constructorInjections = ["DynamoConnector"];
  public static readonly propertyInjections = [];

  public _dynamoConnector: DynamoConnector;

  constructor(dynamoConnector: DynamoConnector) {
    this._dynamoConnector = dynamoConnector;
  }

  async postLocationMessage(satellites: Array<any>): Promise<any> {
    try {
      /*
      const optionsGet = {
        TableName: process.env.DYNAMO_TABLE,
        IndexName: "adn-index",
        KeyConditionExpression: "#sts = :sts",
        ExpressionAttributeNames: {
          "#sts": "adn",
        },
        ExpressionAttributeValues: {
          ":sts": JSON.stringify(dna),
        },
      };

      const item = await this._dynamoConnector.getInfoTable(optionsGet);

      if (item.Count > 0) {
        throw new Error(
          `El dna provisionado ya fue procesado, resultado: ${item.Items[0].type}`
        );
      }
      */

      if (!this.validation(satellites)) {
        throw new Error("Los datos provisionados no son correctos");
      }

      const timestamp = moment(new Date())
        .tz("America/Bogota")
        .format("YYYYMMDDHHmmssms");

      const arrays = await this.orderLocationMessages(satellites);
      const position = await this.getLocation(arrays.distances);
      const message = await this.getLocation(arrays.messages);

      /*
      const description = type ? "Mutant" : "Human";
      const options = {
        TableName: process.env.DYNAMO_TABLE,
        Item: {
          id: uuidv4(),
          timestamp: Number(timestamp),
          type: description,
          adn: JSON.stringify(dna),
        },
      };

      await this._dynamoConnector.putItem(options);
      */

      const responseBody = {
        position: position,
        message: message,
      };

      const response = {
        statusCode: CODES.codeSuccess,
        headers: HEADERS,
        body: responseBody,
        isBase64Encoded: false,
      };

      return response;
    } catch (error) {
      console.log(`General Error ${error.message}`, error);
      throw error;
    }
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
    const position = {
      x: 0,
      y: 0,
    };
    return position;
  }

  async getMessage(messages: Array<any>): Promise<string> {
    const message = "este es el mensaje";
    return message;
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
  };
}
