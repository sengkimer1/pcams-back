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

  async getAllChildAttendances(userId:string): Promise<ChildAttendance[]> {
    return this.repository.findAll(userId);
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

  async getChildAttendanceByDateAndUser(attendance_date: string | null, user_id: string | null): Promise<ChildAttendance[]> {
    let parsedDate: Date | null = null;

    if (attendance_date) {
      parsedDate = new Date(attendance_date);
      if (isNaN(parsedDate.getTime())) {
        throw new Error("Invalid date format. Please use YYYY-MM-DD");
      }
    }

    const attendances = await this.repository.findByDateAndUserId(parsedDate, user_id);
    return attendances;
  }
  async createChildAttendanceList(
    organizer_id: string,
    attendance_date: string
  ): Promise<ChildAttendance[]> {
    if (!organizer_id || !attendance_date) {
      throw new Error("organizer_id and attendance_date are required");
    }
  
    return this.repository.createChildAttendanceList(organizer_id, attendance_date);
  }
  

}