"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const WalletSchema = new mongoose_1.Schema({
    username: {
        type: String,
        required: true,
    },
    totalPoint: {
        type: Number,
        default: 0,
    },
    balance: {
        type: Number,
        default: 0,
    },
    energy: {
        type: Number,
        default: 1000,
    },
    tap: {
        type: Number,
        default: 1,
    },
    limit: {
        type: Number,
        default: 1000,
    },
    level: {
        type: Number,
        default: 1,
    },
    passItemLevel: {
        type: Number,
        default: 0,
    },
    passItemStartTime: {
        type: Number,
        default: 0,
    },
    lastTime: {
        type: Number,
        default: Date.now(),
    },
    dailyEarnTime: {
        type: Number,
        default: 0,
    },
});
const Wallet = (0, mongoose_1.model)("Wallet", WalletSchema);
exports.default = Wallet;
//# sourceMappingURL=Wallet.js.map