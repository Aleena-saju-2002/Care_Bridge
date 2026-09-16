import bcrypt from "bcryptjs";
import UserRepository from "../repositories/user.repository";




class UserService{
  private userRepository:UserRepository //tser

  constructor(){
    this.userRepository=new UserRepository()
  }

 async login(email: string, password: string) { //dto
  const user = await this.userRepository.findByEmail(email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    throw new Error("Invalid email or password");
  }

  return user;
}

}


export default UserService

