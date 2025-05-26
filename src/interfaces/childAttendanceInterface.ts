export interface ChildAttendance {
    id?: string;
    fullname: string;
    gender: string;
    age: number;
    family_id: string;
    attendance_date: Date;
    status: "Present" | "Absent";
    camp_event_id: string;
    user_id: string;
    current_date?: Date;
    record_date?: Date;
    created_at?: Date;
    updated_at?: Date;
  }
  
  export interface ChildAttendanceRepository {
    create(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance>;
    findAll(): Promise<ChildAttendance[]>;
    findById(id: string): Promise<ChildAttendance | null>;
    update(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance>;
    delete(id: string): Promise<void>;
    findByAttendanceDate(attendance_date: Date): Promise<ChildAttendance[]>;
    findByUserId(user_id: string): Promise<ChildAttendance[]>;
    findByDateAndUserId(attendance_date: Date | null, user_id: string | null): Promise<ChildAttendance[]>; // New method
    createChildAttendanceList(organizer_id: string,attendance_date: Date ): Promise<ChildAttendance[]>;
    }
  
  export interface ChildAttendanceService {
    createChildAttendance(data: Omit<ChildAttendance, "id" | "created_at" | "updated_at">): Promise<ChildAttendance>;
    getAllChildAttendances(): Promise<ChildAttendance[]>;
    getChildAttendanceById(id: string): Promise<ChildAttendance>;
    updateChildAttendance(id: string, data: Partial<ChildAttendance>): Promise<ChildAttendance>;
    deleteChildAttendance(id: string): Promise<void>;
    getChildAttendanceByDateAndUser(attendance_date: string | null, user_id: string | null): Promise<ChildAttendance[]>; 
    createChildAttendanceList(organizer_id: string,attendance_date: Date ): Promise<ChildAttendance[]>;
      }
  