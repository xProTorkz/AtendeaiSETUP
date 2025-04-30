"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
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
    it("should be able to create a new user", async () => {
        const user = await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password()
        });
        expect(user).toHaveProperty("id");
    });
    it("should not be able to create a user with duplicated email", async () => {
        await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: "teste@sameemail.com",
            password: faker_1.default.internet.password()
        });
        try {
            await (0, CreateUserService_1.default)({
                name: faker_1.default.name.findName(),
                email: "teste@sameemail.com",
                password: faker_1.default.internet.password()
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(AppError_1.default);
            expect(err.statusCode).toBe(400);
        }
    });
});
