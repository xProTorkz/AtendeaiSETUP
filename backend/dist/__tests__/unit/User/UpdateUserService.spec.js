"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const UpdateUserService_1 = __importDefault(require("../../../services/UserServices/UpdateUserService"));
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
    it("should be able to find a user", async () => {
        const newUser = await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password()
        });
        const updatedUser = await (0, UpdateUserService_1.default)({
            userId: newUser.id,
            userData: {
                name: "New name",
                email: "newmail@email.com"
            }
        });
        expect(updatedUser).toHaveProperty("name", "New name");
        expect(updatedUser).toHaveProperty("email", "newmail@email.com");
    });
    it("should not be able to updated a inexisting user", async () => {
        const userId = faker_1.default.random.number();
        const userData = {
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email()
        };
        expect((0, UpdateUserService_1.default)({ userId, userData })).rejects.toBeInstanceOf(AppError_1.default);
    });
    it("should not be able to updated an user with invalid data", async () => {
        const newUser = await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password()
        });
        const userId = newUser.id;
        const userData = {
            name: faker_1.default.name.findName(),
            email: "test.worgn.email"
        };
        expect((0, UpdateUserService_1.default)({ userId, userData })).rejects.toBeInstanceOf(AppError_1.default);
    });
});
