import { LocationMessageServiceImp } from "../../../../src/hexagonal/domain/service/LocationMessageServiceImp";
import { DynamoConnectorImp } from "../../../../src/hexagonal/infrastructure/provider/aws/DynamoConnectorImp";

const provider = new DynamoConnectorImp();


describe("Test service", () => {
  jest.restoreAllMocks();
  jest
    .spyOn(provider, "putItem")
    .mockImplementation(() => Promise.resolve(true));
  jest
    .spyOn(provider, "getInfoTable")
    .mockImplementation(() =>
      Promise.resolve({ Items: [{ type: "Human" }], Count: 0 })
    );

  test("service OK event Human", async () => {
    const service = new LocationMessageServiceImp(provider);
    const response = await service.postHumanLocationMessage(eventHuman);
    expect(response.body).toBe("Human");
  });

  test("service error NxN", async () => {
    try {
      const service = new LocationMessageServiceImp(provider);
      await service.postHumanLocationMessage(eventBad);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error("El dna provisionado no es correcto")
      );
    }
  });

  test("service error Letters", async () => {
    try {
      const service = new LocationMessageServiceImp(provider);
      await service.postHumanLocationMessage(eventBad2);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error("El dna provisionado no es correcto")
      );
    }
  });

  test("service error Length", async () => {
    try {
      const service = new LocationMessageServiceImp(provider);
      await service.postHumanLocationMessage(eventBad3);
    } catch (error) {
      expect(error).toStrictEqual(
        new Error("El dna provisionado no es correcto")
      );
    }
  });
});
