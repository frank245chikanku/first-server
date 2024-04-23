import { Request, Response } from "express";
import { LoginDto, UserRegisterDto } from "./dto";
import { validate } from "class-validator";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../config/prisma";
import { compare, hash } from "bcrypt";
import * as jwt from "jsonwebtoken"

export class UserCollection{
    async CreateUser(req:Request,res:Response){
        try {
            const dto = new UserRegisterDto(req.body);

            const errors = await validate(dto);

            if(errors.length>0){
                return res.status(StatusCodes.CONFLICT).json({
                    error: errors.map((e)=>e.constraints)
                })
            }

            const isEmailExists = await prisma.user.findUnique({
                where:{
                    email:dto.email,
                }
            });

            if(isEmailExists){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: "user by that email exists"
                })
            }

            const hashPassword = await hash(dto.password,10);

            const user = await prisma.user.create({
                data:{
                    name:dto.name,
                    email:dto.email,
                    phone:dto.phone,
                    password:hashPassword
                }
            })

            return res.status(StatusCodes.CREATED).json({
                user:user
            })
        } catch (error:any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error:error,
                message: "something went wrong"
            })
            
        }
    }

    async getUsers(_req:Request,res:Response){
        try {
            const users= await prisma.user.findMany(
            )

            return res.status(StatusCodes.ACCEPTED).json({
                users:users
            })
        } catch (error:any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error:error,
                message: "something went wrong"
            })
            
        }
    }

    async Login(req:Request,res:Response){
        try {
            const dto = new LoginDto(req.body);
            const errors = await validate(dto);

            if(errors.length>0){
                return res.status(StatusCodes.CONFLICT).json({
                    error:errors.map((e)=>e.constraints)
                })
            }

            const user = await prisma.user.findUnique({
                where:{
                    email:dto.email
                }
            })

            console.log("this is user",user)

            if(!user){
                return res.status(StatusCodes.NOT_FOUND).json({
                    message: "user by that email not found"
                })
            }

            const match = await compare(dto.password,user.password);

            if(!match){
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message:"passwords do not match"
                })
            }

            const payload = {
                id:user.id,
                name:user.name,
                email:user.email,
                phone:user.phone
            }

            console.log("this is payload",payload)

            const token = await jwt.sign(payload,`${process.env.ACCESS_TOKEN_SECRET}`,{expiresIn:"7d"});

            return res.status(StatusCodes.ACCEPTED).json({
                message: "login successful",
                token:token
            })
            
        } catch (error:any) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error:error,
                message: "something went wrong"
            })
            
        }
    }
}