"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const DeleteUserService_1 = __importDefault(require("../../../services/UserServices/DeleteUserService"));
const database_1 = require("../../utils/database");
describe("User", () => {
    beforeEach(async () => {
        await (0, database_1.truncate)();
    });
    afterEach(async () => {
        await (0, database_1.truncate)();
    });
    afterAll(async () => {
        await (0, database_1.disconnect)();
    });
    it("should be delete a existing user", async () => {
        const { id } = await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password()
        });
        expect((0, DeleteUserService_1.default)(id)).resolves.not.toThrow();
    });
    it("to throw an error if tries to delete a non existing user", async () => {
        expect((0, DeleteUserService_1.default)(faker_1.default.random.number())).rejects.toBeInstanceOf(AppError_1.default);
    });
});
