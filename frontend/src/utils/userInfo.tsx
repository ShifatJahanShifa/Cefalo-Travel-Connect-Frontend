import { getAllUsers } from "../services/userService";
import type { getUser } from "../types/user";
import { logger } from "./logger";

export const getUserInfo = async (user_id: string) => {
    try 
    {
        const users: getUser[] = await getAllUsers();
        let user: getUser | undefined = users.find((user) => user.user_id === user_id)
        return user; 
    }
    catch(error: any) 
    {
        logger.error(error)
    }
}