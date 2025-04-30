"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const AuthUserService_1 = __importDefault(require("../../../services/UserServices/AuthUserService"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const database_1 = require("../../utils/database");
describe("Auth", () => {
    beforeEach(async () => {
        await (0, database_1.truncate)();
    });
    afterEach(async () => {
        await (0, database_1.truncate)();
    });
    afterAll(async () => {
        await (0, database_1.disconnect)();
    });
    it("should be able to login with an existing user", async () => {
        const password = faker_1.default.internet.password();
        const email = faker_1.default.internet.email();
        await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email,
            password
        });
        const response = await (0, AuthUserService_1.default)({
            email,
            password
        });
        expect(response).toHaveProperty("token");
    });
    it("should not be able to login with not registered email", async () => {
        try {
            await (0, AuthUserService_1.default)({
                email: faker_1.default.internet.email(),
                password: faker_1.default.internet.password()
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(AppError_1.default);
            expect(err.statusCode).toBe(401);
            expect(err.message).toBe("ERR_INVALID_CREDENTIALS");
        }
    });
    it("should not be able to login with incorret password", async () => {
        await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: "mail@test.com",
            password: faker_1.default.internet.password()
        });
        try {
            await (0, AuthUserService_1.default)({
                email: "mail@test.com",
                password: faker_1.default.internet.password()
            });
        }
        catch (err) {
            expect(err).toBeInstanceOf(AppError_1.default);
            expect(err.statusCode).toBe(401);
            expect(err.message).toBe("ERR_INVALID_CREDENTIALS");
        }
    });
});
