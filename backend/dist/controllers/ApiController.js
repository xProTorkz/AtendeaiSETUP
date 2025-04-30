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
exports.index = void 0;
const Yup = __importStar(require("yup"));
const AppError_1 = __importDefault(require("../errors/AppError"));
const GetDefaultWhatsApp_1 = __importDefault(require("../helpers/GetDefaultWhatsApp"));
const SetTicketMessagesAsRead_1 = __importDefault(require("../helpers/SetTicketMessagesAsRead"));
const Whatsapp_1 = __importDefault(require("../models/Whatsapp"));
const CreateOrUpdateContactService_1 = __importDefault(require("../services/ContactServices/CreateOrUpdateContactService"));
const FindOrCreateTicketService_1 = __importDefault(require("../services/TicketServices/FindOrCreateTicketService"));
const ShowTicketService_1 = __importDefault(require("../services/TicketServices/ShowTicketService"));
const CheckIsValidContact_1 = __importDefault(require("../services/WbotServices/CheckIsValidContact"));
const CheckNumber_1 = __importDefault(require("../services/WbotServices/CheckNumber"));
const GetProfilePicUrl_1 = __importDefault(require("../services/WbotServices/GetProfilePicUrl"));
const SendWhatsAppMedia_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMedia"));
const SendWhatsAppMessage_1 = __importDefault(require("../services/WbotServices/SendWhatsAppMessage"));
const createContact = async (whatsappId, newContact) => {
    await (0, CheckIsValidContact_1.default)(newContact);
    const validNumber = await (0, CheckNumber_1.default)(newContact);
    const profilePicUrl = await (0, GetProfilePicUrl_1.default)(validNumber);
    const number = validNumber;
    const contactData = {
        name: `${number}`,
        number,
        profilePicUrl,
        isGroup: false
    };
    const contact = await (0, CreateOrUpdateContactService_1.default)(contactData);
    let whatsapp;
    if (whatsappId === undefined) {
        whatsapp = await (0, GetDefaultWhatsApp_1.default)();
    }
    else {
        whatsapp = await Whatsapp_1.default.findByPk(whatsappId);
        if (whatsapp === null) {
            throw new AppError_1.default(`whatsapp #${whatsappId} not found`);
        }
    }
    const createTicket = await (0, FindOrCreateTicketService_1.default)(contact, whatsapp.id, 1);
    const ticket = await (0, ShowTicketService_1.default)(createTicket.id);
    (0, SetTicketMessagesAsRead_1.default)(ticket);
    return ticket;
};
const index = async (req, res) => {
    const newContact = req.body;
    const { whatsappId } = req.body;
    const { body, quotedMsg } = req.body;
    const medias = req.files;
    newContact.number = newContact.number.replace("-", "").replace(" ", "");
    const schema = Yup.object().shape({
        number: Yup.string()
            .required()
            .matches(/^\d+$/, "Invalid number format. Only numbers is allowed.")
    });
    try {
        await schema.validate(newContact);
    }
    catch (err) {
        throw new AppError_1.default(err.message);
    }
    const contactAndTicket = await createContact(whatsappId, newContact.number);
    if (medias) {
        await Promise.all(medias.map(async (media) => {
            await (0, SendWhatsAppMedia_1.default)({ body, media, ticket: contactAndTicket });
        }));
    }
    else {
        await (0, SendWhatsAppMessage_1.default)({ body, ticket: contactAndTicket, quotedMsg });
    }
    return res.send();
};
exports.index = index;
