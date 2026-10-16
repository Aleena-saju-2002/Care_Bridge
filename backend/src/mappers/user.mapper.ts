import IUser from "../interfaces/models/user.interface";

class UserMapper {
  static toSafeUser(user: IUser) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      dob: user.dob,
      role: user.role,
      isVerified: user.isVerified,
      isBlocked: user.isBlocked,
    };
  }
}

export default UserMapper;