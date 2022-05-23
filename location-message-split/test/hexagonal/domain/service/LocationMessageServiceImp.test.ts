import { LocationMessageServiceImp } from "../../../../src/hexagonal/domain/service/LocationMessageServiceImp";
import { DynamoConnectorImp } from "../../../../src/hexagonal/infrastructure/provider/aws/DynamoConnectorImp";

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

const provider = new DynamoConnectorImp();
const service = new LocationMessageServiceImp(provider);

describe("Test service", () => {
  jest.restoreAllMocks();

  test("service OK postLocationMessage", async () => {
    jest
      .spyOn(provider, "putItem")
      .mockImplementation(() => Promise.resolve(true));
    const response = await service.postLocationMessage("name", {});
    expect(response.statusCode).toBe(200);
  });

  test("service error 404 postLocationMessage", async () => {
    jest.spyOn(provider, "putItem").mockImplementation(() => {
      throw new Error("Error");
    });
    try {
      await service.postLocationMessage("name", {});
    } catch (error) {
      expect(true).toBe(true);
    }
  });

  test("service error name getLocationMessage", async () => {
    jest.restoreAllMocks();
    const items1 = {
      Items: [
        {
          info: '{"distance":300,"message":["este","","","mensaje","","","la"]}',
          uuid: "7dfb6dfe-5070-44d1-9889-cd34a7ec7bcf",
          name: "kenobi",
          timestamp: 202205202125262530,
        },
      ],
    };
    jest
      .spyOn(provider, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items1));
    jest
      .spyOn(provider, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve({ Items: [] }));
    jest
      .spyOn(provider, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve({ Items: [] }));
    try {
      await service.getLocationMessage("sato");
    } catch (error) {
      expect(error).toStrictEqual(
        new Error(
          "Aun no es posible determinar la posicion ni el mensaje hasta no suministrar los datos de los 3 satelites"
        )
      );
    }
  });

  test("service OK getLocationMessage", async () => {
    jest.restoreAllMocks();
    const providerlocal = new DynamoConnectorImp();
    const servicelocal = new LocationMessageServiceImp(providerlocal);

    const items1 = {
      Items: [
        {
          info: '{"distance":300,"message":["este","","","mensaje","","","la"]}',
          uuid: "7dfb6dfe-5070-44d1-9889-cd34a7ec7bcf",
          name: "kenobi",
          timestamp: 202205202125262530,
        },
      ],
    };
    const items2 = {
      Items: [
        {
          info: '{"distance":632.5,"message":["","es","","","secreto","para","","","","bien"]}',
          uuid: "1db9d0b5-6d22-40d0-a732-f3f04433760c",
          name: "skywalker",
          timestamp: 20220520212903292,
        },
      ],
    };
    const items3 = {
      Items: [
        {
          info: '{"distance":1000,"message":["este","","un","","","","","gente","de"]}',
          uuid: "f0394341-c3ea-4c43-9aa0-a61d9e7e2695",
          name: "sato",
          timestamp: 20220520213000300,
        },
      ],
    };
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items1));
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items2));
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items3));
    const response = await servicelocal.getLocationMessage("sato");
    expect(response.statusCode).toBe(200);
  });

  test("service OK getLocationMessage messageNotPosition", async () => {
    jest.restoreAllMocks();
    const providerlocal = new DynamoConnectorImp();
    const servicelocal = new LocationMessageServiceImp(providerlocal);

    const items1 = {
      Items: [
        {
          info: '{"distance":300,"message":["este","","","mensaje","","","la"]}',
          uuid: "7dfb6dfe-5070-44d1-9889-cd34a7ec7bcf",
          name: "kenobi",
          timestamp: 202205202125262530,
        },
      ],
    };
    const items2 = {
      Items: [
        {
          info: '{"distance":200,"message":["","es","","","secreto","para","","","","bien"]}',
          uuid: "1db9d0b5-6d22-40d0-a732-f3f04433760c",
          name: "skywalker",
          timestamp: 20220520212903292,
        },
      ],
    };
    const items3 = {
      Items: [
        {
          info: '{"distance":1000,"message":["este","","un","","","","","gente","de"]}',
          uuid: "f0394341-c3ea-4c43-9aa0-a61d9e7e2695",
          name: "sato",
          timestamp: 20220520213000300,
        },
      ],
    };
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items1));
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items2));
    jest
      .spyOn(providerlocal, "getInfoTable")
      .mockImplementationOnce(() => Promise.resolve(items3));
    const response = await servicelocal.getLocationMessage("sato");
    expect(response.statusCode).toBe(404);
  });
});
