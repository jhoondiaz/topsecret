import { Container } from "inversify";
import { SERVICES, ADAPTERS, CONTROLLERS } from "./Types";
import { LocationMessageService } from "../../domain/port/api/LocationMessageService";
import { StaticPropsMetadataReader } from "./StaticPropsMetadataReader";
import { LocationMessageController } from "../../application/controller/LocationMessageController";
import { LocationMessageControllerImp } from "../../application/controller/http/LocationMessageControllerImp";
import { LocationMessageServiceImp } from "../../domain/service/LocationMessageServiceImp";

const AppContainer: Container = new Container();
AppContainer.applyCustomMetadataReader(new StaticPropsMetadataReader());
AppContainer.bind<LocationMessageController>(
  CONTROLLERS.LocationMessageController
).to(LocationMessageControllerImp);
AppContainer.bind<LocationMessageService>(SERVICES.LocationMessageService).to(
  LocationMessageServiceImp
);

export { AppContainer };
