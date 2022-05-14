import { LocationMessageControllerImp } from "../src/hexagonal/application/controller/http/LocationMessageControllerImp";

const index = require("../src/index");

describe("Suite index", () => {
  test("event handler error validation", async () => {
    jest.restoreAllMocks();
    const event = { body: JSON.stringify({ dna: ["CAG", "TTT"] }) };
    jest
      .spyOn(LocationMessageControllerImp.prototype as any, "maindistributor")
      .mockImplementation(() => {
        throw new Error("Error");
      });
    try {
      await index.handler(event);
    } catch (error) {
      expect(error).toStrictEqual(JSON.stringify(new Error("Error")));
    }
  });

  test("event handler /LocationMessages", async () => {
    jest.restoreAllMocks();
    const event = { body: JSON.stringify({ dna: ["CAG", "TTT"] }) };
    jest
      .spyOn(LocationMessageControllerImp.prototype as any, "maindistributor")
      .mockImplementation(() => Promise.resolve(200));

    const resp = await index.handler(event);
    expect(resp).toStrictEqual(200);
  });

  test("event handler /stats", async () => {
    jest.restoreAllMocks();
    const event = { body: null };
    jest
      .spyOn(LocationMessageControllerImp.prototype as any, "maindistributor")
      .mockImplementation(() => Promise.resolve(200));

    const resp = await index.handler(event);
    expect(resp).toStrictEqual(200);
  });
});
