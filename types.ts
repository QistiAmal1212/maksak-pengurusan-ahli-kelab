

export enum Role {
  ADMIN = 'Admin Sistem',
  AJK = 'AJK Kelab',
  PARTNER = 'Syarikat Penyedia Manfaat',
  PUBLIC = 'Awam / Ahli'
}

export enum MemberStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED'
}

export interface Club {
  id: string;
  name: string;
  code: string;
  picName: string;
  picPhone: string;
  email: string;
  state: string;
  benefits?: string[];
  terms?: string[];
}

export interface Member {
  id: string;
  fullName: string;
  icNo: string;
  email: string;
  phone: string;
  address: string;
  clubId: string;
  status: MemberStatus;
  appliedDate: string;
  approvedDate?: string;
  profilePicUrl: string;
  staffIdUrl: string;
  age: number;
}

export interface Program {
  id: string; // Unique ID for the program/club
  name: string;
  benefits: string[];
  terms: string[];
}

export interface BenefitPartner {
  id: string;
  companyName: string;
  description: string;
  offers: string[]; 
  location: string;
  programs?: Program[]; 
}

export interface UsageLog {
  id: string;
  memberId: string;
  partnerId: string;
  timestamp: string;
  benefitType: string;
  location: string;
}

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  pendingMembers: number;
  totalClubs: number;
  totalPartners: number;
  recentLogs: UsageLog[];
}