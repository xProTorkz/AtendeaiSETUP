"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const User_1 = __importDefault(require("../../../models/User"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const ShowUserService_1 = __importDefault(require("../../../services/UserServices/ShowUserService"));
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
        const user = await (0, ShowUserService_1.default)(newUser.id);
        expect(user).toHaveProperty("id");
        expect(user).toBeInstanceOf(User_1.default);
    });
    it("should not be able to find a inexisting user", async () => {
        expect((0, ShowUserService_1.default)(faker_1.default.random.number())).rejects.toBeInstanceOf(AppError_1.default);
    });
});
