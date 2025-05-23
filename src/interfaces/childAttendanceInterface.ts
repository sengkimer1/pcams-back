export interface ChildAttendance {
    id?: string;
    fullname: string;
    gender: string;
    age: number;
    family_id: string;
    attendance_date: Date;
    status: "Present" | "Absent"; // Restricted to Present or Absent
    camp_event_id: string;
    user_id: string;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface ChildAttendanceRepository {
    create(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance>;
    findAll(): Promise<ChildAttendance[]>;
    findById(id: string): Promise<ChildAttendance | null>;
    update(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance>;
    delete(id: string): Promise<void>;
  }
  
  export interface ChildAttendanceService {
    createChildAttendance(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance>;
    getAllChildAttendances(): Promise<ChildAttendance[]>;
    getChildAttendanceById(id: string): Promise<ChildAttendance>;
    updateChildAttendance(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance>;
    deleteChildAttendance(id: string): Promise<void>;
  }