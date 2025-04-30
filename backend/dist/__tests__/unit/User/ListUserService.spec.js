"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const faker_1 = __importDefault(require("faker"));
const User_1 = __importDefault(require("../../../models/User"));
const CreateUserService_1 = __importDefault(require("../../../services/UserServices/CreateUserService"));
const ListUsersService_1 = __importDefault(require("../../../services/UserServices/ListUsersService"));
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
    it("should be able to list users", async () => {
        await (0, CreateUserService_1.default)({
            name: faker_1.default.name.findName(),
            email: faker_1.default.internet.email(),
            password: faker_1.default.internet.password()
        });
        const response = await (0, ListUsersService_1.default)({
            pageNumber: 1
        });
        expect(response).toHaveProperty("users");
        expect(response.users[0]).toBeInstanceOf(User_1.default);
    });
});
