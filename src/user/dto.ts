import { IsNotEmpty, IsString } from "class-validator";

export class UserRegisterDto{
    @IsNotEmpty()
    @IsString()
    name:string;

    @IsNotEmpty()
    @IsString()
    email:string;

    @IsNotEmpty()
    @IsString()
    phone:string;

    @IsNotEmpty()
    @IsString()
    password:string;

    constructor(d:UserRegisterDto){
        this.name = d.name;
        this.email = d.email;
        this.phone = d.phone;
        this.password = d.password;
    }
}

export class LoginDto{
    @IsNotEmpty()
    email:string;

    @IsNotEmpty()
    password:string;

    constructor(d:LoginDto){
        this.email = d.email;
        this.password = d.password;
    }
}