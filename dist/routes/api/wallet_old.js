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
const helper_1 = require("../../utils/helper");
const levelData_1 = require("../../utils/levelData");
const router = express_1.default.Router();
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user_new = new Wallet_1.default({
        username: req.body.username,
    });
    try {
        const { username } = req.body;
        console.log("=======  add =====>", username);
        let user_check = yield Wallet_1.default.findOne({ username: username });
        if (user_check && username) {
            let nowTime = Date.now();
            console.log("nowTime =>", nowTime);
            const passItemEarn = (nowTime - user_check.lastTime) *
                levelData_1.PassItemCount[user_check.passItemLevel];
            // console.log("passItemEarn =>", passItemEarn);
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({
                username: req.body.username,
            }, {
                totalPoint: req.body.totalPoint,
                balance: req.body.balance + passItemEarn,
                lastTime: nowTime,
            });
            // console.log("aftTime =>", updated_wallet.lastTime);
            return res.json(updated_wallet);
        }
        else if (req.body.username) {
            console.log("new user saved", req.body.username);
            yield user_new.save();
            res.json(user_new);
        }
    }
    catch (error) {
        res.status(400).json({ msg: error });
    }
}));
router.post("/update/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  update/:username =====>", req.params.username);
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    (0, helper_1.updateLevel)(req.params.username, req.body.totalPoint);
    // const passItemEarn =
    //   (Date.now() - wallet.lastTime) * PassItemCount[wallet.passItemLevel];
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({
            username: req.params.username,
        }, {
            totalPoint: req.body.totalPoint,
            balance: req.body.balance,
            lastTime: Date.now(),
        });
        console.log("update user updated_wallet =>", updated_wallet.username);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        console.log("updated total =>", return_wallet.totalPoint);
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateEnergy/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  updateEnergy/:username =====>");
    try {
        // console.log(req.params.username);
        const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
        if (wallet) {
            const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { energy: req.body.energy } // Ensure the updated document is returned
            );
            // console.log("--------------test----------", updated_wallet);
            const return_wallet = yield Wallet_1.default.findOne({
                username: req.params.username,
            });
            return res.status(200).json(return_wallet);
        }
        else {
            return res.status(400).json({ msg: "You have no permission" });
        }
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal server error" });
    }
    finally {
        // console.log("updateEnergy called =>", Date.now());
    }
}));
router.post("/updateTap/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("=======  updateTap/:username =====>");
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { tap: req.body.tap });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/buyBonusCard/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    // console.log("=======  buyBonusCard/:username =====>", wallet);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, {
            passItemLevel: req.body.passItemLevel,
            passItemStartTime: Date.now(),
            balance: req.body.token,
        });
        // console.log("--------------test----------", updated_wallet);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        console.log("there is no wallet");
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/removeBonusCard/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    // console.log("=======  removeBonusCard/:username =====>", wallet);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, {
            passItemLevel: 0,
            totalPoint: req.body.total,
            balance: req.body.token,
        });
        // console.log("--------------removeBonusCard----------", updated_wallet);/
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        console.log("there is no wallet");
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/getDailyEarn/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("=======  getDailyEarn =====>");
    const DAY = 86400 * 1000;
    const TESTMINUTE = 20 * 1000; // 10s
    if (wallet && Date.now() - wallet.dailyEarnTime > DAY) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, {
            totalPoint: wallet.totalPoint + 1000,
            balance: wallet.balance + 1000,
            dailyEarnTime: Date.now() - (Date.now() % DAY),
        });
        console.log("--------------getDailyEarn----------", updated_wallet.dailyEarnTime);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        console.log("there is no wallet");
        return res.status(204).json({ msg: "You have no permission" });
    }
}));
router.post("/updateLimit/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("updateLimit =>", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { limit: req.body.limit });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.post("/updateBalance/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wallet = yield Wallet_1.default.findOne({ username: req.params.username });
    console.log("updateBalance =>", req.body);
    if (wallet) {
        const updated_wallet = yield Wallet_1.default.findOneAndUpdate({ username: req.params.username }, { balance: req.body.balance });
        //   console.log("--------------test----------",updated_wallet);
        const return_wallet = yield Wallet_1.default.findOne({
            username: req.params.username,
        });
        return res.status(200).json(return_wallet);
    }
    else {
        return res.status(400).json({ msg: "You have no permission" });
    }
}));
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("-------------- all ----------");
    // const users = await Wallet.find().limit(8).sort({ totalPoint: -1 });
    const users = yield Wallet_1.default.find().sort({ totalPoint: -1 });
    // console.log(Date.now(), users.length);
    res.json(users);
}));
router.post("/:username", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let user = yield Wallet_1.default.findOne({ username: req.params.username });
    if (user) {
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
//# sourceMappingURL=wallet_old.js.map