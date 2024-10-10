// interfaces
import IUser, { IUserLoginCredentials, IUserRegisterationCredentials } from "../entity/IUser.entity";
import RequiredCredentialsNotGiven from "../errors/requiredCredentialsNotGiven.error";
import ValidationError from "../errors/validationErrorDetails.error";
import IAuthRepository from "../interface/repositories/IAuth.repository";
import IAuthUseCase from "../interface/usecase/IAuth.usecase";

// enums
import { ErrorField } from "../enums/errorField.enum";
import { ErrorMessage } from "../enums/errorMesaage.enum";
import { StatusCodes } from "../enums/statusCode.enum";
import IHashingService from "../interface/utils/IHashingService";
import IJWTService, { IPayload } from "../interface/utils/IJWTService";

export default class AuthUseCase implements IAuthUseCase {
    private authRepository: IAuthRepository;
    private hashingService: IHashingService;
    private jwtService: IJWTService;

    constructor(authRepository: IAuthRepository, hashingService: IHashingService, jwtService: IJWTService) {
        this.authRepository = authRepository;
        this.hashingService = hashingService;
        this.jwtService = jwtService;
    }

    async userLogin(userLoginCredential: IUserLoginCredentials): Promise<string | never> {
        try {
            if(!userLoginCredential || !userLoginCredential.identifier || !userLoginCredential.password) throw new RequiredCredentialsNotGiven('Provide all required details.');

            const userData: IUser | null = await this.authRepository.getUserByIdentifier(userLoginCredential.identifier);

            if(!userData) {
                throw new ValidationError({ errorField: ErrorField.EMAIL, message: ErrorMessage.INVALID_IDENTIFIER_OR_USER_NOT_FOUND, statusCode: StatusCodes.NotFound });
            }

            if(!await this.hashingService.compare(userLoginCredential.password, userData.password)) {
                throw new ValidationError({ errorField: ErrorField.PASSWORD, message: ErrorMessage.PASSWORD_INCORRECT, statusCode: StatusCodes.BadRequest });
            }

            const payLoad: IPayload = {
                id: userData._id
            }

            const acessToken: string = this.jwtService.sign(payLoad, "1d");

            return acessToken;
        } catch (err: any) {
            throw err;
        }
    }

    async userRegister(userRegisterationCredentials: IUserRegisterationCredentials): Promise<string | never> {
        try {
            if(!userRegisterationCredentials || !userRegisterationCredentials.userName || !userRegisterationCredentials.phoneNumber || (userRegisterationCredentials.phoneNumber.length !== 10) || !userRegisterationCredentials.displayName || !userRegisterationCredentials.email || !(/^[A-Za-z0-9]+@gmail\.com$/).test(userRegisterationCredentials.email) || !userRegisterationCredentials.password || !userRegisterationCredentials.confirmPassword || (userRegisterationCredentials.password !== userRegisterationCredentials.confirmPassword)) throw new RequiredCredentialsNotGiven('Provide all required details.');

            if(await this.authRepository.getUserByUserName(userRegisterationCredentials.userName)){
                throw new ValidationError({ errorField: ErrorField.USERNAME, message: ErrorMessage.USERNAME_ALREADY_TAKEN, statusCode: StatusCodes.BadRequest });
            }else if(await this.authRepository.getUserByEmail(userRegisterationCredentials.email)) {
                throw new ValidationError({ errorField: ErrorField.EMAIL, message: ErrorMessage.EMAIL_ALREADY_TAKEN, statusCode: StatusCodes.BadRequest });
            }else if(await this.authRepository.getUserByPhoneNumber(userRegisterationCredentials.phoneNumber)) {
                throw new ValidationError({ errorField: ErrorField.PHONENUMBER, message: ErrorMessage.PHONENUMBER_ALREADY_TAKEN, statusCode: StatusCodes.BadRequest });
            }

            userRegisterationCredentials.password = await this.hashingService.hash(userRegisterationCredentials.password);

            const userData: IUser = await this.authRepository.saveNewUser(userRegisterationCredentials);

            const payLoad: IPayload = {
                id: userData._id
            }

            const acessToken: string  = this.jwtService.sign(payLoad, "1d");

            return acessToken;
        } catch (err: any) {
            throw err;
        }
    }
}