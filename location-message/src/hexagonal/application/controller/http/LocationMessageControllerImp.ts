import { LocationMessageService } from "../../../domain/port/api/LocationMessageService";
import { LocationMessageController } from "../LocationMessageController";

export class LocationMessageControllerImp implements LocationMessageController {
  public static readonly constructorInjections = ["MutantService"];
  public static readonly propertyInjections = [];

  public _locationMessage: LocationMessageService;

  constructor(locationMessageService: LocationMessageService) {
    this._locationMessage = locationMessageService;
  }

  public async maindistributor(event: any): Promise<any> {
    try {
      return await this.postLocationMessage(event.satellites);
    } catch (error) {
      console.log(`Controller - General Error: ${error.message}`, error);
      throw error;
    }
  }

  public async postLocationMessage(satellites: Array<any>): Promise<any> {
    try {
      return await this._locationMessage.postLocationMessage(satellites);
    } catch (error) {
      console.log(`Controller - General Error: ${error.message}`, error);
      throw error;
    }
  }
}
