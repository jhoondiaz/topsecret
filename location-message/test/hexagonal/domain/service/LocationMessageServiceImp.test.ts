import { LocationMessageServiceImp } from "../../../../src/hexagonal/domain/service/LocationMessageServiceImp";

const event1 = {
  path: "/LocationMessages",
  httpMethod: "POST",
  satellites: [
    {
      name: "kenobi",
      distance: 400.5,
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

const event1Bad = {
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

describe("Test service", () => {
  jest.restoreAllMocks();

  test("service OK postLocationMessage", async () => {
    const service = new LocationMessageServiceImp();
    const response = await service.postLocationMessage(event1.satellites);
    expect(response.statusCode).toBe(200);
  });

  test("service error 404 postLocationMessage", async () => {
    const service = new LocationMessageServiceImp();
    const response = await service.postLocationMessage(event1Bad.satellites);
    expect(response.statusCode).toBe(404);
  });

  test("service error postLocationMessage", async () => {
    try {
      const service = new LocationMessageServiceImp();
      await service.postLocationMessage([]);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error("Los datos provisionados no son correctos")
      );
    }
  });

  test("service error name postLocationMessage", async () => {
    try {
      const service = new LocationMessageServiceImp();
      await service.postLocationMessage([
        { name: "dfdf" },
        { name: "dfdf" },
        { name: "dfdf" },
      ]);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error("Los datos provisionados no son correctos")
      );
    }
  });

  test("service OK postDistances", async () => {
    const service = new LocationMessageServiceImp();
    const response = await service.postDistances(event2.position);
    expect(response.statusCode).toBe(200);
  });
});
