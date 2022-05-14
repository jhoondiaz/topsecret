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
  private dnaFinal: Array<Array<string>> = [];
  private posSelected: Array<any> = [];

  constructor(dynamoConnector: DynamoConnector) {
    this._dynamoConnector = dynamoConnector;
  }

  async postLocationMessage(dna: Array<string>): Promise<any> {
    try {
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

      this.dnaFinal = [];

      if (!this.validation(dna)) {
        throw new Error("El dna provisionado no es correcto");
      }

      const timestamp = moment(new Date())
        .tz("America/Bogota")
        .format("YYYYMMDDHHmmssms");

      console.log(this.dnaFinal);

      const type = await this.isMutant(this.dnaFinal);
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

      const response = {
        statusCode: type ? CODES.codeMutant : CODES.codeHuman,
        headers: HEADERS,
        body: description,
        isBase64Encoded: false,
      };

      return response;
    } catch (error) {
      console.log(`General Error ${error.message}`, error);
      throw error;
    }
  }

  validation = (dna: Array<string>): boolean => {
    const dnalength: number = dna.length;
    const letters: Array<string> = VALIDATIONS.letters;

    if (dnalength < VALIDATIONS.sequence) {
      return false;
    }

    for (let i = 0; i < dna.length; i++) {
      const element: Array<string> = dna[i].split("");
      if (element.length != dnalength) {
        return false;
      }
      for (let j = 0; j < element.length; j++) {
        const element2: string = element[j];
        if (!letters.includes(element2)) {
          return false;
        }
      }
      this.dnaFinal.push(element);
    }
    return true;
  };
}
