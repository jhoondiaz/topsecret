import { LocationMessageControllerImp } from "../../../../../src/hexagonal/application/controller/http/LocationMessageControllerImp";
import { LocationMessageServiceImp } from "../../../../../src/hexagonal/domain/service/LocationMessageServiceImp";
import { DynamoConnectorImp } from "../../../../../src/hexagonal/infrastructure/provider/aws/DynamoConnectorImp";

const provider = new DynamoConnectorImp();
const service = new LocationMessageServiceImp(provider);
const controller = new LocationMessageControllerImp(service);

const event1 = {
  path: "/topsecret/sato",
  httpMethod: "POST",
  body: {
    distance: 400,
    message: ["este", "", "", "mensaje", "", "", "la"],
  },
};

const event2 = {
  path: "/topsecret/sato",
  httpMethod: "GET",
  body: null,
};

const eventError = {
  path: "/topsecret/ssd",
  httpMethod: "GET",
  body: null,
};

describe("Test Controller", () => {
  test("should create a controller", () => {
    const controller = new LocationMessageControllerImp(service);
    expect(controller._locationMessage).toBe(service);
  });

  test("should create a controller", () => {
    expect(controller).toBeDefined();
  });

  test("should OK postLocationMessage", async () => {
    jest.restoreAllMocks();
    jest
      .spyOn(service, "postLocationMessage")
      .mockImplementation(() => Promise.resolve(event1));
    const response = await controller.maindistributor(event1);
    expect(response).toBe(event1);
  });

  test("Should ERROR postLocationMessage", async () => {
    jest.restoreAllMocks();
    jest.spyOn(service, "postLocationMessage").mockImplementation(() => {
      throw new Error("Error");
    });
    try {
      await controller.maindistributor(event1);
    } catch (error) {
      expect(error).toEqual(new Error("Error"));
    }
  });

  test("should OK getLocationMessage", async () => {
    jest.restoreAllMocks();
    jest
      .spyOn(service, "getLocationMessage")
      .mockImplementation(() => Promise.resolve(event2));
    const response = await controller.maindistributor(event2);
    expect(response).toBe(event2);
  });

  test("Should ERROR getLocationMessage", async () => {
    jest.restoreAllMocks();
    jest.spyOn(service, "getLocationMessage").mockImplementation(() => {
      throw new Error("Error");
    });
    try {
      await controller.maindistributor(event2);
    } catch (error) {
      expect(error).toEqual(new Error("Error"));
    }
  });

  test("Should ERROR invalid name", async () => {
    jest.restoreAllMocks();
    jest.spyOn(service, "getLocationMessage").mockImplementation(() => {
      throw new Error("El nombre de satellite enviado no es valido");
    });
    try {
      await controller.maindistributor(eventError);
    } catch (error) {
      expect(error).toEqual(
        new Error("El nombre de satellite enviado no es valido")
      );
    }
  });
});
