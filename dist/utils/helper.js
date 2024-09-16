"use strict";
// import multer from "multer";
// import { findConfigurationByIp } from "../models/Surveillance";
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
exports.isExistUser = exports.getBounsFromPassItem = exports.getPointLimit = exports.updateLevel = void 0;
const Wallet_1 = __importDefault(require("../models/Wallet"));
const levelData_1 = require("./levelData");
// const fs = require("fs");
// const path = require("path");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const ip = req.ip.match(/\d+\.\d+\.\d+\.\d+/)
//       ? req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
//         ? req.ip.match(/\d+\.\d+\.\d+\.\d+/)[0]
//         : "localhost"
//       : "localhost";
//     const date = new Date();
//     const dir = path.join(
//       __dirname +
//         "/../public/screens/" +
//         ip +
//         "/" +
//         date.getFullYear() +
//         "/" +
//         (date.getMonth() + 1) +
//         "/" +
//         date.getDate()
//     );
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     const partPath =
//       "screens/" +
//       ip +
//       "/" +
//       date.getFullYear() +
//       "/" +
//       (date.getMonth() + 1) +
//       "/" +
//       date.getDate();
//     req.body = { ...req.body, fileName: partPath };
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.originalname.split(".").pop();
//     const date = new Date();
//     const fn = `${
//       date.getHours() +
//       "." +
//       date.getMinutes() +
//       "." +
//       date.getSeconds() +
//       "." +
//       date.getMilliseconds()
//     }.${ext}`;
//     cb(null, fn);
//     req.body = { ...req.body, fileName: req.body.fileName + "/" + fn };
//   },
// });
// export const upload = multer({ storage });
function lowerBound(arr, target) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].totalPoint >= target) {
            return arr[i].level;
        }
    }
    return arr.length;
}
const updateLevel = (username, totalPoint) => __awaiter(void 0, void 0, void 0, function* () {
    const index = lowerBound(levelData_1.LevelData, totalPoint);
    yield Wallet_1.default.findOneAndUpdate({
        username: username,
        totalPoint: totalPoint,
        level: levelData_1.LevelData[index - 1].level,
    });
});
exports.updateLevel = updateLevel;
const getPointLimit = () => {
    return levelData_1.PointLimits[0];
};
exports.getPointLimit = getPointLimit;
const getBounsFromPassItem = (level, lastTime) => {
    let deltaTime = Math.floor((Date.now() - lastTime) / 1000);
    return levelData_1.PassItemCount[level] * deltaTime;
};
exports.getBounsFromPassItem = getBounsFromPassItem;
const isExistUser = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const isExist = yield Wallet_1.default.findOne({ username: username });
    if (isExist !== null)
        return true;
    else
        return false;
});
exports.isExistUser = isExistUser;
//# sourceMappingURL=helper.js.map