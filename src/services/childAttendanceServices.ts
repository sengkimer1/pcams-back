import { ChildAttendance, ChildAttendanceRepository, ChildAttendanceService as IChildAttendanceService } from "../interfaces/childAttendanceInterface";

export class ChildAttendanceService implements IChildAttendanceService {
  constructor(private repository: ChildAttendanceRepository) {}

  async createChildAttendance(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance> {
    if (!data.fullname || !data.gender || !data.age || !data.family_id || !data.attendance_date || !data.status || !data.camp_event_id || !data.user_id) {
      throw new Error("All fields are required");
    }
    if (!["Present", "Absent"].includes(data.status)) {
      throw new Error("Status must be 'Present' or 'Absent'");
    }
    return this.repository.create(data);
  }

  async getAllChildAttendances(): Promise<ChildAttendance[]> {
    return this.repository.findAll();
  }

  async getChildAttendanceById(id: string): Promise<ChildAttendance> {
    const attendance = await this.repository.findById(id);
    if (!attendance) {
      throw new Error("Child attendance record not found");
    }
    return attendance;
  }

  async updateChildAttendance(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance> {
    if (data.status && !["Present", "Absent"].includes(data.status)) {
      throw new Error("Status must be 'Present' or 'Absent'");
    }
    return this.repository.update(id, data);
  }

  async deleteChildAttendance(id: string): Promise<void> {
    return this.repository.delete(id);
  }

  async getChildAttendanceByDate(attendance_date: string): Promise<ChildAttendance[]> {
    const parsedDate = new Date(attendance_date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format. Please use YYYY-MM-DD");
    }
    const attendances = await this.repository.findByAttendanceDate(parsedDate);
    return attendances;
  }

  async getChildAttendanceByUser(user_id: string): Promise<ChildAttendance[]> {
    if (!user_id) {
      throw new Error("User ID is required");
    }
    const attendances = await this.repository.findByUserId(user_id);
    return attendances;
  }
}