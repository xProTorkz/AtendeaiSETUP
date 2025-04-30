"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.show = exports.store = exports.index = void 0;
const Yup = __importStar(require("yup"));
const socket_1 = require("../libs/socket");
const ListQuickAnswerService_1 = __importDefault(require("../services/QuickAnswerService/ListQuickAnswerService"));
const CreateQuickAnswerService_1 = __importDefault(require("../services/QuickAnswerService/CreateQuickAnswerService"));
const ShowQuickAnswerService_1 = __importDefault(require("../services/QuickAnswerService/ShowQuickAnswerService"));
const UpdateQuickAnswerService_1 = __importDefault(require("../services/QuickAnswerService/UpdateQuickAnswerService"));
const DeleteQuickAnswerService_1 = __importDefault(require("../services/QuickAnswerService/DeleteQuickAnswerService"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const index = async (req, res) => {
    const { searchParam, pageNumber } = req.query;
    const { quickAnswers, count, hasMore } = await (0, ListQuickAnswerService_1.default)({
        searchParam,
        pageNumber
    });
    return res.json({ quickAnswers, count, hasMore });
};
exports.index = index;
const store = async (req, res) => {
    const newQuickAnswer = req.body;
    const QuickAnswerSchema = Yup.object().shape({
        shortcut: Yup.string().required(),
        message: Yup.string().required()
    });
    try {
        await QuickAnswerSchema.validate(newQuickAnswer);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const quickAnswer = await (0, CreateQuickAnswerService_1.default)({
        ...newQuickAnswer
    });
    const io = (0, socket_1.getIO)();
    io.emit("quickAnswer", {
        action: "create",
        quickAnswer
    });
    return res.status(200).json(quickAnswer);
};
exports.store = store;
const show = async (req, res) => {
    const { quickAnswerId } = req.params;
    const quickAnswer = await (0, ShowQuickAnswerService_1.default)(quickAnswerId);
    return res.status(200).json(quickAnswer);
};
exports.show = show;
const update = async (req, res) => {
    const quickAnswerData = req.body;
    const schema = Yup.object().shape({
        shortcut: Yup.string(),
        message: Yup.string()
    });
    try {
        await schema.validate(quickAnswerData);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const { quickAnswerId } = req.params;
    const quickAnswer = await (0, UpdateQuickAnswerService_1.default)({
        quickAnswerData,
        quickAnswerId
    });
    const io = (0, socket_1.getIO)();
    io.emit("quickAnswer", {
        action: "update",
        quickAnswer
    });
    return res.status(200).json(quickAnswer);
};
exports.update = update;
const remove = async (req, res) => {
    const { quickAnswerId } = req.params;
    await (0, DeleteQuickAnswerService_1.default)(quickAnswerId);
    const io = (0, socket_1.getIO)();
    io.emit("quickAnswer", {
        action: "delete",
        quickAnswerId
    });
    return res.status(200).json({ message: "Quick Answer deleted" });
};
exports.remove = remove;
