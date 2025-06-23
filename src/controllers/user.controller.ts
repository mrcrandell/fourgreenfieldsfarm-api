import { JsonController, Post, Body, Res, HttpCode } from "routing-controllers";
import { Response } from "express";
import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";
import { IsEmail, IsString, MinLength } from "class-validator";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

class LoginBody {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

@JsonController("/users")
export class UserController {
  @Post("/login")
  @HttpCode(200)
  async login(@Body({ validate: true }) body: LoginBody, @Res() res: Response) {
    const { email, password } = body;
    const repo = AppDataSource.getRepository(User);

    // Find user by email, including password
    const loginUser = await repo.findOne({
      where: { email },
      select: ["id", "email", "name", "password", "rememberToken"],
    });

    if (!loginUser) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const match = await argon2.verify(loginUser.password, password);
    if (!match) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Remove sensitive fields
    const userObj = { ...loginUser } as any;
    delete userObj.password;
    delete userObj.rememberToken;

    const token = jwt.sign(
      userObj,
      process.env.JWT_SECRET || "your_jwt_secret"
    );

    return res.send({ ...userObj, token });
  }
}
