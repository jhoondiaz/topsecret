import { LocationMessageControllerImp } from "../../../../../src/hexagonal/application/controller/http/LocationMessageControllerImp";
import { LocationMessageServiceImp } from "../../../../../src/hexagonal/domain/service/LocationMessageServiceImp";

const service = new LocationMessageServiceImp();
const controller = new LocationMessageControllerImp(service);

const event1 = {
  path: "/LocationMessages",
  httpMethod: "POST",
  satellites: [
    {
      name: "kenobi",
      distance: 400,
      message: ["este", "", "", "mensaje", "", "", "la"],
    },
    {
      name: "skywalker",
      distance: 671.9,
      message: ["", "es", "", "", "secreto", "para", "", "", "", "bien"],
    },
    {
      name: "sato",
      distance: 1006,
      message: ["este", "", "un", "", "", "", "", "gente", "de"],
    },
  ],
};

const event2 = {
  path: "/LocationMessages",
  httpMethod: "POST",
  position: { x: 0, yo: 0 },
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

  test("should OK postDistances", async () => {
    jest.restoreAllMocks();
    jest
      .spyOn(service, "postDistances")
      .mockImplementation(() => Promise.resolve(event2));
    const response = await controller.maindistributor(event2);
    expect(response).toBe(event2);
  });

  test("Should ERROR postDistances", async () => {
    jest.restoreAllMocks();
    jest.spyOn(service, "postDistances").mockImplementation(() => {
      throw new Error("Error");
    });
    try {
      await controller.maindistributor(event2);
    } catch (error) {
      expect(error).toEqual(new Error("Error"));
    }
  });
});
