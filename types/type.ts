
export interface Job {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experience: string;
  salary: string;
  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];
  postedDate: string;
  featured?: boolean;
}

export interface JobApplication {
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  coverLetter: string;
  resume?: File;
  portfolio?: string;
  linkedIn?: string;
  availability: string;
}

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  course: string;
  year: number;
  gpa: number;
  status: 'Active' | 'Inactive' | 'Graduated' | 'Suspended';
  enrollmentDate: string;
  studentId: string;
  guardian: string;
  guardianPhone: string;
}

interface UserType {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  password: string;
  is_login: boolean;
  otp_attempts: number;
  socketId: string | null;
  status: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  __v: number;
  updated_by: string;
}

export interface UserProfileType {
  _id: string;
  userId: UserType;
  fatherName: string;
  motherName: string;
  registrationNo: string;
  phone: string;
  familyOccupation: string;
  dateofBirth: string;
  religion: string;
  bloodGroup: string;
  gender: string;
  admissionDate: string;
  zipCode: string;
  city: string;
  state: string;
  country: string;
  landmark: string;
  address: string;
  about: string;
  dateofJoining: string;
  experience: string;
  education: string;
  salary: number;
  updated_by: string;
  isDeleted: boolean;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string
  __v: number;
}

export interface CourseType {
  _id: string;
  title: string;
  slug: string;
  durationMonths: number | string;
  fee: number | string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  status?: number;
  language: "",
  mode: "",
  badge: "Best Seller" | "Top Rated" | "Featured" | "New" | "Trending" | null;
  created_at?: string;
  updated_at?: string;
  mainCourseId?: {
    title: string;
    _id: string;
  }
}

export interface userRoleType {
  _id: string;
  name: string;
  email: string;
  roleId: string;
  password: string;
  is_login: boolean;
  otp_attempts: number;
  socketId: string | null;
  status: number;
  created_at: string; // ISO Date string
  updated_at: string; // ISO Date string  
  updated_by: string;
  profile: UserProfileType
}


export type slugType = {
  created_at: string,
  name: string,
  slug: string,
  updated_at: string,
  _id: string
}
export type contentPointType = {
  point: string,
}

export type contentPointExtendedType = {
  point: string,
  status: string,
  _id: string;
}

export type contentType = {
  status: number,
  created_at: string,
  content: string,
  title: string,
  order: number,
  header: string,
  footer: string,
  type: Number,
  points: contentPointExtendedType[]
  url: string;
  updated_at: string,
  _id: string,
  updated_by: { name: string, _id: string }
}

export type Option = {
  title: string;
  type_id: number;
}


export type CategoryListType = {
  _id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
};
export type NextPageFuncType = () => void;
export type PrevPageFuncType = () => void;


export interface leadsType {
    course: any;
    remarks: string;
    service: any;
    _id: string;
    name?: string
    firstName?: string;
    lastName?: string,
    email: string,
    phone?: number,
    subject?: string,
    description?: string,
    mobile?: string,
    message?:string,
    status: number,
    linkedIn?: string,
    portfolio: string;
    availability?: string,
    experience?: string,
    coverLetter?: string,  
    fullName?: string,  
    additionalInfo: Record<string, any>,
        assignedTo: string
        assignedUserId: {
            name: string,
            _id: string
        },
        assignedAt: string,
        assignedBy: {
            name: string,
            _id: string
        },
        leadStatus: "new"|"contacted" |"converted" | "inprogress" | "lost"|"followup"
        // created_at: string,
        // updated_at: string,
        updated_by: {
            name: string
        }
    // assignment: {
    //     remarks: string;
    //     assignedTo: string
    //     assignedUserId: {
    //         name: string,
    //         _id: string
    //     },
    //     assignedAt: string,
    //     assignedBy: {
    //         name: string,
    //         _id: string
    //     },
    //     leadStatus: "new"|"contacted" |"converted" | "inprogress" | "lost"|"followup"
    //     created_at: string,
    //     updated_at: string,
    //     updated_by: {
    //         name: string
    //     }

    // },
    created_at: string,
    updated_at: string
    createdAt: string,
    updatedAt: string

}