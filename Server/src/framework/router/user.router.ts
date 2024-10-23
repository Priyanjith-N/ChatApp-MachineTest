import express, { Router } from "express";

const router: Router = express.Router();

// interfaces
import IAuthMiddleware from "../../interface/middlewares/authMiddleware.middleware";
import IJWTService from "../../interface/utils/IJWTService";
import IUserRepositroy from "../../interface/repositories/user.repository";
import IUserUseCase from "../../interface/usecase/IUser.usecase";

// classes importing
import AuthMiddleware from "../middleware/auth.middleware";
import UserRepository from "../../adapters/repositories/user.repository";
import UserUseCase from "../../usecase/user.usecase";

// importing util services
import JWTService from "../utils/jwtService.utils";
import IUserController from "../../interface/controllers/user.controllers";
import UserController from "../../adapters/controllers/user.controller";
import upload from "../utils/s3ConfigurationAndMulterSetup.utils";

// util service
const jwtService: IJWTService = new JWTService();

// auth middleware
const authMiddleware: IAuthMiddleware = new AuthMiddleware(jwtService);

const userRepository: IUserRepositroy = new UserRepository();
const userUseCase: IUserUseCase = new UserUseCase(userRepository);
const userController: IUserController = new UserController(userUseCase);

router.use(authMiddleware.isAuthenticate.bind(authMiddleware));

router.get("/user", userController.getUserProfile.bind(userController));

router.post("/logout", userController.handelLogout.bind(userController));

router.get("/allusers", userController.getAllUsers.bind(userController));

router.post("/createnewchat", userController.createNewChat.bind(userController));

router.get("/chats", userController.getAllChatsOfCurrentUser.bind(userController));

router.get("/messages/:chatId", userController.getMessagesOfAchat.bind(userController));

router.post("/sendmessage/:chatId", upload.single("muiltiMediaFiles"), userController.sendMessage.bind(userController));

router.post("/createnewgroupchat", userController.createNewGrooupChat.bind(userController));

router.patch("/leavegroupchat/:chatId", userController.leaveGroupChat.bind(userController));

router.get("/allusersnotincurrentgroup/:chatId", userController.getAllUsersNotPresentInCurrentGroupChat.bind(userController));

router.patch("/addnewmembersingroup/:chatId", userController.addNewMembersInGroup.bind(userController));

export default router;