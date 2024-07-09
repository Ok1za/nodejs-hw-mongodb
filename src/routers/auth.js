import { Router } from "express";
import { validateBody } from "../middleware/validateBody.js";
import { loginUserSchema, loginWithGoogleOAuthSchema, registerUserSchema, resetPasswordSchema, sendResetEmailSchema } from "../validation/auth.js";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import { getGoogleOAuthUrlController, loginUserController, loginWithGoogleController, logoutUserController, refreshUserSessionController, registerUserController, resetPasswordController, sendResetEmailController } from "../controllers/auth.js";

const authRouter = Router();

authRouter.get('/get-oauth-url', ctrlWrapper(getGoogleOAuthUrlController));

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/refresh', ctrlWrapper(refreshUserSessionController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));
authRouter.post('/send-reset-email', validateBody(sendResetEmailSchema), ctrlWrapper(sendResetEmailController));
authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), ctrlWrapper(resetPasswordController));
authRouter.post('/confirm-oauth', validateBody(loginWithGoogleOAuthSchema), ctrlWrapper(loginWithGoogleController));

export default authRouter;
