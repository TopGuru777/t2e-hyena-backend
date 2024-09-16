"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Wallet_1 = __importDefault(require("../../models/Wallet"));
const Friend_1 = __importDefault(require("../../models/Friend"));
const router = express_1.default.Router();
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.body;
    // console.log("=======  add =====>", username);
    const isExist = yield Wallet_1.default.findOne({ username: username });
    if (isExist) {
        try {
            // console.log("in add req, user already exist", username);
            const user = yield Wallet_1.default.findOne({ username: username });
            res.json(user);
        }
        catch (error) {
            console.log("error while saving user", error);
        }
    }
    else {
        const isFriend = yield Friend_1.default.findOne({ friend: username });
        let newUser;
        if (isFriend) {
            newUser = new Wallet_1.default({
                username: username,
                totalPoint: 1000,
                balance: 1000
            });
        }
        else {
            newUser = new Wallet_1.default({
                username: username,
            });
        }
        // console.log("new user saved as", username);
        yield newUser.save();
        res.json(newUser);
    }
}));
router.post("/update/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  update/:username =====>", req.params.username);
    const { totalPoint, balance, energy } = req.body;
    const username = req.params.username;
    const isExist = yield Wallet_1.default.findOne({ username: username });
    if (isExist) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, {
            totalPoint: totalPoint,
            balance: balance,
            energy: energy,
        });
        console.log("update user updated_wallet =>", updated_wallet.energy);
        res.json(updated_wallet);
    }
    else {
        // console.log("in update req, user does not exist", username);
        res.status(400).json({ msg: "User does not exist" });
    }
}));
router.post("/updateEnergy/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  updateEnergy/:username =====>");
    const { energy } = req.body;
    const username = req.params.username;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, { energy: energy });
            console.log("update user updated_wallet =>", updated_wallet.username);
            res.status(200).json(updated_wallet);
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
router.post("/updateTap/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("========= updateTap ======>");
    const { tap } = req.body;
    const username = req.params.username;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, { tap: tap });
            console.log("update user updated_wallet =>", updated_wallet.username);
            res.status(200).json(updated_wallet);
        }
        else {
            console.log("in updateTap, user does not exist");
        }
    }
    catch (error) {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/buyBonusCard/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("====== buyBonusCard =========>");
    const { passItemLevel, token } = req.body;
    const username = req.params.username;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, {
                passItemLevel: passItemLevel,
                passItemStartTime: Date.now(),
                balance: token,
            });
            console.log("update user updated_wallet =>", updated_wallet.username);
            res.json(updated_wallet);
        }
        else {
            console.log("in buyBonusCard, user does not exist");
        }
    }
    catch (error) {
        console.log("in buyBonusCard, catch error", error);
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/removeBonusCard/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  removeBonusCard/:username =====>");
    const { totalPoint, token } = req.body;
    const username = req.params.username;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, {
                passItemLevel: 0,
                totalPoint: totalPoint,
                balance: token,
            });
            console.log("remove card user updated_wallet =>", updated_wallet.username);
            res.status(200).json(updated_wallet);
        }
        else {
            console.log("in removeBonusCard, user does not exist");
        }
    }
    catch (error) {
        console.log("in removeBonusCard, catch error", error);
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/getDailyEarn/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  getDailyEarn =====>");
    const { username } = req.params;
    const AMOUTDAY = 1000;
    const DAY = 20 * 1000;
    // const DAY = 86400 * 1000;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const wallet = yield Wallet_1.default.findOne({ username: username });
            if (Date.now() - wallet.dailyEarnTime > DAY) {
                const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, {
                    totalPoint: wallet.totalPoint + AMOUTDAY,
                    balance: wallet.balance + AMOUTDAY,
                    dailyEarnTime: Date.now(),
                });
                const return_wallet = yield Wallet_1.default.findOne({
                    username: username,
                });
                console.log("in getDailyEarn", return_wallet.balance);
                return res.status(200).json(return_wallet);
            }
            else {
                console.log("You early get daily earn.");
                return res.status(204).json({ msg: "You early get daily earn." });
            }
        }
    }
    catch (error) {
        console.log("in getDailyEarn, catch error", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
router.post("/updateLimit/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updateLimit =>", req.body);
}));
router.post("/updateBalance/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("updateBalance =>");
    const { balance } = req.body;
    const username = req.params.username;
    try {
        const isExist = yield Wallet_1.default.findOne({ username: username });
        if (isExist) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: username }, { balance: balance });
            console.log("updateBalance updated_wallet =>", updated_wallet.username);
            res.status(200).json(updated_wallet);
        }
        else {
            console.log("in updateBalance, user does not exist");
        }
    }
    catch (error) {
        console.log("in updateBalance, catch error", error);
        return res.status(500).json({ msg: "Internal server error" });
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-------------- all ----------");
    const users = yield Wallet_1.default.find().sort({ totalPoint: -1 });
    res.json(users);
}));
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield Wallet_1.default.findOne({ username: req.params.username });
    if (user) {
        console.log("user =>", user.balance);
        res.json(user);
    }
    else {
        return res.status(400).json({ msg: "You not found" });
    }
}));
router.delete("/delete/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let wallet = yield Wallet_1.default.findOne({ _id: req.params.username });
    if (!wallet) {
        return res.status(404).json({ msg: "User not found." });
    }
    yield Wallet_1.default.deleteOne({ _id: req.params.username });
    res.json({ msg: "Delete Successfully" });
}));
router.post("/test", (req, res) => {
    res.send("wallet router is working...");
});
exports.default = router;
//# sourceMappingURL=wallet.js.map