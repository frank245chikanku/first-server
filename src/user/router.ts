import { Router } from "express";
import { UserCollection } from "./collection";

const userCollection = new UserCollection();
const userRouter = Router();

userRouter.post("/signup",userCollection.CreateUser);
userRouter.get("/getusers",userCollection.getUsers);
userRouter.post("/login",userCollection.Login);

export default userRouter;