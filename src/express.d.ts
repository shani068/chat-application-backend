import { IUser } from "./interfaces/interfaces";



declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}