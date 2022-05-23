import { MESSAGES, SATELLITENAMES } from "../../../../utils/Constants";
import { LocationMessageService } from "../../../domain/port/api/LocationMessageService";
import { LocationMessageController } from "../LocationMessageController";

export class LocationMessageControllerImp implements LocationMessageController {
  public static readonly constructorInjections = ["LocationMessageService"];
  public static readonly propertyInjections = [];

  public _locationMessage: LocationMessageService;

  constructor(locationMessageService: LocationMessageService) {
    this._locationMessage = locationMessageService;
  }

  public async maindistributor(event: any): Promise<any> {
    try {
      const satelliteName: string = event.path.split("/")[2];

      if (!SATELLITENAMES.includes(satelliteName)) {
        throw new Error(MESSAGES.messageNameInvalid);
      }

      if (event.httpMethod == "POST") {
        return await this.postLocationMessage(satelliteName, event.body);
      }

      if (event.httpMethod == "GET") {
        return await this.getLocationMessage(satelliteName);
      }
    } catch (error) {
      console.log(`Controller - General Error: ${error.message}`, error);
      throw error;
    }
  }

  public async postLocationMessage(
    satelliteName: string,
    satelliteInfo: any
  ): Promise<any> {
    try {
      return await this._locationMessage.postLocationMessage(
        satelliteName,
        satelliteInfo
      );
    } catch (error) {
      console.log(
        `Controller - General Error postLocationMessage: ${error.message}`,
        error
      );
      throw error;
    }
  }

  public async getLocationMessage(satelliteName: string): Promise<any> {
    try {
      return await this._locationMessage.getLocationMessage(satelliteName);
    } catch (error) {
      console.log(
        `Controller - General Error postDistances: ${error.message}`,
        error
      );
      throw error;
    }
  }
}
