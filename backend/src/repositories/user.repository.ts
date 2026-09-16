import User  from "../models/user.model";


class UserRepository {
  async findEmail(email:string){
    return await User.findOne({email})
  }
}

export default UserRepository;

