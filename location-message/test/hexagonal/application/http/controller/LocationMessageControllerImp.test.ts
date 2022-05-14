import { LocationMessageControllerImp } from "../../../../../src/hexagonal/application/controller/http/LocationMessageControllerImp";
import { LocationMessageServiceImp } from "../../../../../src/hexagonal/domain/service/LocationMessageServiceImp";
import { DynamoConnectorImp } from "../../../../../src/hexagonal/infrastructure/provider/aws/DynamoConnectorImp";

const provider = new DynamoConnectorImp();
const service = new LocationMessageServiceImp(provider);
const controller = new LocationMessageControllerImp(service);

const event = {
  path: "/LocationMessages",
  httpMethod: "POST",
  dna: ["TGC", "CAG", "TTT"],
};
const eventBad = ["CAG", "TTT"];

describe("Test Controller", () => {
  test("should create a controller", () => {
    const controller = new LocationMessageControllerImp(service);
    expect(controller._locationMessage).toBe(service);
  });

  test("should create a controller", () => {
    expect(controller).toBeDefined();
  });

  test("should OK postHumanLocationMessage", async () => {
    jest.restoreAllMocks();
    jest
      .spyOn(service, "postHumanLocationMessage")
      .mockImplementation(() => Promise.resolve(event));
    const response = await controller.maindistributor(event);
    expect(response).toBe(event);
  });

  test("Should ERROR postHumanLocationMessage", async () => {
    jest.restoreAllMocks();
    jest.spyOn(service, "postHumanLocationMessage").mockImplementation(() => {
      throw new Error("Error");
    });
    try {
      await controller.maindistributor(event);
    } catch (error) {
      expect(error).toEqual(new Error("Error"));
    }
  });
});
