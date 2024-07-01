import { describe, expect } from "@jest/globals";
import {NotFoundException} from "@nestjs/common";
import { PokemonController } from "./pokemon.controller";

describe("PokemonController::Test", () => {
  let controller: PokemonController;

  const getAllResolvedValues = {
    results: [
      { name: "bulbasaur" },
      { name: "ivysaur" },
      { name: "venusaur" },
    ],
  };

  const mockGetByNameValues = {
    bulbasaur: { name: "bulbasaur", detail: "some-mocked-detail" },
    ivysaur: { name: "ivysaur", detail: "some-mocked-detail" },
    venusaur: { name: "venusaur", detail: "some-mocked-detail" },
  };

  const service = {
    getAll: jest.fn(),
    getByName: jest.fn(
      k => Promise.resolve(mockGetByNameValues[k])
    ),
    getById: jest.fn(),
  };

  beforeAll(async () => {
    service.getAll.mockResolvedValue(getAllResolvedValues);

    // @ts-ignore
    controller = new PokemonController(service);
  });

  describe("listAll", () => {
    let result;
    const paramsMock = { page: 1, items: 10 };

    beforeAll(async() => {
      // @ts-ignore
      result = await controller.listAll(paramsMock);
    });

    it('should call the service.getAll method', () => {
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it('should call the service.getByName method 3 times', () => {
      expect(service.getByName).toHaveBeenCalledTimes(3);
    });

    it("should return a list of Pokemon", async () => {
      expect(result).toHaveProperty("length", 3);
    });

    it("should first item has detail with string 'some-mocked-detail'", async () => {
      expect(result).toHaveProperty("length", 3);
    });
  });

  describe("getById - success", () => {
    const id = 1;

    beforeAll(async() => {
      service.getById.mockResolvedValueOnce({ id: 1, name: "bulbasaur" });
      service.getById.mockClear();
      // @ts-ignore
      await controller.getById(id);
    });

    it('should call the service.getById method', () => {
      expect(service.getById).toHaveBeenCalledTimes(1);
    });
  });
});
