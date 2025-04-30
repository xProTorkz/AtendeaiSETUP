"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnect = exports.truncate = void 0;
const database_1 = __importDefault(require("../../database"));
const truncate = async () => {
    await database_1.default.truncate({ force: true, cascade: true });
};
exports.truncate = truncate;
const disconnect = async () => {
    return database_1.default.connectionManager.close();
};
exports.disconnect = disconnect;
