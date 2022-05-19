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
      if (event.satellites) {
        return await this.postLocationMessage(event.satellites);
      }

      if (event.position) {
        return await this.postDistances(event.position);
      }
    } catch (error) {
      console.log(`Controller - General Error: ${error.message}`, error);
      throw error;
    }
  }

  public async postLocationMessage(satellites: Array<any>): Promise<any> {
    try {
      return await this._locationMessage.postLocationMessage(satellites);
    } catch (error) {
      console.log(
        `Controller - General Error postLocationMessage: ${error.message}`,
        error
      );
      throw error;
    }
  }

  public async postDistances(position: any): Promise<any> {
    try {
      return await this._locationMessage.postDistances(position);
    } catch (error) {
      console.log(
        `Controller - General Error postDistances: ${error.message}`,
        error
      );
      throw error;
    }
  }
}
