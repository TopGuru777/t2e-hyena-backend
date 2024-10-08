import express, { Router, Request, Response } from "express";
import mongoose from "mongoose";
import Friend from "../../models/Friend";
import Wallet from "../../models/Wallet";

const router: Router = express.Router();

router.post("/add", async (req: Request, res: Response) => {
  const friend_new = new Friend({
    username: req.body.username,
    friend: req.body.friend
  });
  try {
    let friend_check = await Friend.findOne({ friend: req.body.friend });
    if (friend_check) {
      return res
        .status(400)
        .json({ msg: "You are already added in friend item" });
    } else {
      await friend_new.save();
      const wallet = await Wallet.findOne({ username: req.body.username });
      const updated_wallet = await Wallet.findOneAndUpdate(
        { username: req.body.username },
        {
          totalPoint: wallet.totalPoint + 1000,
          balance: wallet.balance + 1000
        }
      );
      res.json(friend_new);
    }
  } catch (error) {
    res.status(400).json({ msg: error });
  }
});
router.post("/:username", async (req: Request, res: Response) => {
  let friend = await Friend.find({ username: req.params.username });
  if (friend) {
    res.json(friend);
  } else {
    return res.status(400).json({ msg: "No Friends" });
  }
});
export default router;
