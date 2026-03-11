export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  country: string;
  location:string;
  phone: string;
  companyName: string;
  jobTitle: string;
  password?: string;
  confirmPassword?: string;
  securityQuestion?: string;
  securityAnswer?: string;
  // FIX: Add optional properties for admin management to resolve type errors.
  role?: 'ADMIN' | 'USER';
  status?: 'ENABLED' | 'DISABLED';
  groupId?: number;
}
