import IHospital from "../interfaces/models/hospital.interface";
import IHospitalRepository from "../interfaces/repositories/hospital.repository.interface";
import HospitalModel from "../models/hospital.model";

class HospitalRepository implements IHospitalRepository {
  async create(data: Partial<IHospital>): Promise<IHospital> {
    return HospitalModel.create(data);
  }

  async findByEmail(email: string): Promise<IHospital | null> {
    return HospitalModel.findOne({
      representativeEmail: email.toLowerCase(),
    });
  }

  async findById(id: string): Promise<IHospital | null> {
    return HospitalModel.findById(id);
  }

  async save(hospital: IHospital): Promise<IHospital> {
    return hospital.save();
  }
}

export default HospitalRepository;