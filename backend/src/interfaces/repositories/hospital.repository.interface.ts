import IHospital from "../models/hospital.interface";

export default interface IHospitalRepository {
  create(data: Partial<IHospital>): Promise<IHospital>;
  findByEmail(email: string): Promise<IHospital | null>;
  findById(id: string): Promise<IHospital | null>;
  save(hospital: IHospital): Promise<IHospital>;
}