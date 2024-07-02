import { Reflector } from "@nestjs/core";

import { describe, expect } from "@jest/globals";
import { Test, TestingModule } from "@nestjs/testing";
import {
  CACHE_MANAGER,
  CacheModule,
  CacheInterceptor,
} from "@nestjs/cache-manager";
import { NotFoundException } from "@nestjs/common";
import { PokemonService } from "./pokemon.service";
import { PokemonController } from "./pokemon.controller";

describe("PokemonController::Test", () => {
  let controller: PokemonController;

  const getAllResolvedValues = {
    results: [{ name: "bulbasaur" }, { name: "ivysaur" }, { name: "venusaur" }],
  };

  const mockGetByNameValues = {
    bulbasaur: {
      id: 0,
      name: "bulbasaur",
      detail: "some-mocked-detail",
      types: [],
      sprites: {
        other: {
          home: {
            front_default: "https://some-image-url.com",
          },
        },
      },
    },
    ivysaur: {
      id: 1,
      name: "ivysaur",
      detail: "some-mocked-detail",
      types: [],
      sprites: {
        other: {
          home: {
            front_default: "https://some-image-url.com",
          },
        },
      },
    },
    venusaur: {
      id: 2,
      name: "venusaur",
      detail: "some-mocked-detail",
      types: [],
      sprites: {
        other: {
          home: {
            front_default: "https://some-image-url.com",
          },
        },
      },
    },
  };

  const service = {
    getAll: jest.fn(),
    getByName: jest.fn((k) => Promise.resolve(mockGetByNameValues[k])),
    getById: jest.fn(),
  };

  const cacheManager = {
    get: jest.fn(),
    set: jest.fn(),
  };

  beforeAll(async () => {
    service.getAll.mockResolvedValue(getAllResolvedValues);

    const moduleRef: TestingModule = await Test.createTestingModule({
      imports: [CacheModule.register()],
      controllers: [PokemonController],
      providers: [
        { provide: PokemonService, useValue: service },
        { provide: CACHE_MANAGER, useValue: cacheManager },
        Reflector,
        CacheInterceptor,
      ],
    }).compile();

    controller = moduleRef.get<PokemonController>(PokemonController);
  });

  describe("listAll", () => {
    let result;
    const paramsMock = { page: 1, items: 10 };

    beforeAll(async () => {
      cacheManager.get.mockResolvedValue(null);
      // @ts-ignore
      result = await controller.listAll(paramsMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the service.getAll method", () => {
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });

    it("should call the service.getByName method 3 times", () => {
      expect(service.getByName).toHaveBeenCalledTimes(3);
    });

    it('should call the cacheManager.set method with key "pokemons"', () => {
      expect(cacheManager.set).toHaveBeenNthCalledWith(1, "pokemons", {
        bulbasaur: { name: "bulbasaur" },
        ivysaur: { name: "ivysaur" },
        venusaur: { name: "venusaur" },
      });
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

    beforeAll(async () => {
      service.getById.mockResolvedValueOnce({
        id: 1,
        name: "bulbasaur",
        types: [],
        sprites: {
          other: {
            home: {
              front_default: "https://some-image-url.com",
            },
          },
        },
      });
      service.getById.mockClear();
      // @ts-ignore
      await controller.getById(id);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the service.getById method", () => {
      expect(service.getById).toHaveBeenCalledTimes(1);
    });
  });

  describe("getById - not found", () => {
    let result;
    const id = 1;

    beforeAll(async () => {
      service.getById.mockResolvedValue(null);
      try {
        await controller.getById(id);
      } catch (error) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the service.getById method", () => {
      expect(service.getById).toHaveBeenCalledTimes(1);
    });

    it("should throw a NotFoundException", () => {
      expect(result).toBeInstanceOf(NotFoundException);
    });
  });

  describe("search - without cache", () => {
    let result;
    const name = "bulbasaur";

    beforeAll(async () => {
      cacheManager.get.mockResolvedValue(null);
      service.getByName.mockClear();
      // @ts-ignore
      result = await controller.search(name);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the cacheManager.get method", () => {
      expect(cacheManager.get).toHaveBeenCalledTimes(2);
    });

    it("should not call the pokemonService.getAll method", () => {
      expect(service.getAll).toHaveBeenCalledTimes(1);
    });


    it("should call the cacheManager.set method", () => {
      expect(cacheManager.set).toHaveBeenCalledTimes(1);
    });

    it("expect result to be an object", () => {
      expect(result).toBeInstanceOf(Object);
    });
  });

  describe("search - with cache", () => {
    let result;
    const name = "bulbasaur";

    beforeAll(async () => {
      cacheManager.get.mockResolvedValue({
        bulbasaur: { name: "bulbasaur" },
      });
      service.getByName.mockClear();
      // @ts-ignore
      result = await controller.search(name);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it("should call the cacheManager.get method", () => {
      expect(cacheManager.get).toHaveBeenCalledTimes(1);
    });

    it("should not call the pokemonService.getAll method", () => {
      expect(service.getAll).toHaveBeenCalledTimes(0);
    });

    it("expect result to be an object", () => {
      expect(result).toBeInstanceOf(Object);
    });
  });
});
