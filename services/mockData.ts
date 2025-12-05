

import { Club, Member, MemberStatus, BenefitPartner, UsageLog, Role } from '../types';

// Initial Mock Data
const MOCK_CLUBS: Club[] = [
  { 
    id: 'c1', 
    name: 'Kelab Sukan JKR', 
    code: 'JKR-001', 
    picName: 'Ahmad Albab', 
    picPhone: '0123456789', 
    email: 'jkr@club.my', 
    state: 'Selangor',
    benefits: ['Akses Gelanggang Badminton JKR', 'Subsidi Yuran Kejohanan', 'Takaful Kelompok'],
    terms: ['Wajib kakitangan JKR', 'Yuran tahunan RM50']
  },
  { 
    id: 'c2', 
    name: 'Kelab Kebajikan Guru', 
    code: 'KKG-002', 
    picName: 'Siti Nurhaliza', 
    picPhone: '0198765432', 
    email: 'guru@club.my', 
    state: 'Kuala Lumpur',
    benefits: ['Bantuan Khairat Kematian', 'Hari Keluarga Tahunan', 'Diskaun Buku'],
    terms: ['Guru berdaftar sahaja']
  },
  { 
    id: 'c3', 
    name: 'Persatuan Belia Cyberjaya', 
    code: 'PBC-003', 
    picName: 'Jason Lo', 
    picPhone: '0112233445', 
    email: 'cyber@club.my', 
    state: 'Selangor',
    benefits: [],
    terms: []
  },
  { 
    id: 'c4', 
    name: 'Kelab Kakitangan SUK Pahang', 
    code: 'SUK-004', 
    picName: 'En. Razak', 
    picPhone: '0134455667', 
    email: 'suk@pahang.gov.my', 
    state: 'Pahang',
    benefits: ['Gym Percuma', 'Kafeteria Subsidi'],
    terms: ['Kakitangan SUK Pahang']
  },
  { 
    id: 'c5', 
    name: 'Majlis Sukan Daerah Kuantan', 
    code: 'MSDK-005', 
    picName: 'Pn. Salmah', 
    picPhone: '0145566778', 
    email: 'msdk@kuantan.gov.my', 
    state: 'Pahang',
    benefits: [],
    terms: []
  },
];

const MOCK_PARTNERS: BenefitPartner[] = [
  { 
    id: 'p1', 
    companyName: 'Hotel Seri Malaysia', 
    description: 'Accommodation Provider', 
    offers: ['20% off rooms', 'Free Breakfast', 'Late Checkout'], 
    location: 'Nationwide',
    programs: [
      { 
        id: 'prog-1',
        name: 'Platinum Club Rewards', 
        benefits: ['Sarapan Percuma (2 Pax)', 'Late Check-out 3PM', 'Welcome Drink'], 
        terms: ['Minima penginapan 2 malam', 'Tidak sah pada cuti umum', 'Wajib tunjuk e-Kad'] 
      },
      { 
        id: 'prog-2',
        name: 'Gold Stay Package', 
        benefits: ['Diskaun 10% F&B', 'Free Parking'], 
        terms: ['Weekday stays only'] 
      }
    ] 
  },
  { 
    id: 'p2', 
    companyName: 'Klinik Mediviron', 
    description: 'Healthcare', 
    offers: ['10% consultation', 'Free Basic Checkup'], 
    location: 'Selangor',
    programs: [
      {
        id: 'prog-3',
        name: 'Corporate Wellness',
        benefits: ['Diskaun 10% Konsultasi', 'Pemeriksaan Kesihatan Asas Percuma'],
        terms: ['Temujanji diperlukan']
      }
    ]
  },
  { 
    id: 'p3', 
    companyName: 'Sport Planet', 
    description: 'Sports Venue', 
    offers: ['RM5 off booking', 'Free Equipment Rental'], 
    location: 'Kuala Lumpur',
    programs: []
  },
];

const MOCK_MEMBERS: Member[] = [
  { 
    id: 'm1', fullName: 'Ali Bin Abu', icNo: '850101-10-5555', email: 'ali@gmail.com', phone: '0123456789', 
    address: '123 Jalan Ampang', clubId: 'c1', status: MemberStatus.ACTIVE, appliedDate: '2023-01-01', 
    approvedDate: '2023-01-05', profilePicUrl: 'https://picsum.photos/150', staffIdUrl: '', age: 39 
  },
  { 
    id: 'm2', fullName: 'Chong Wei Lee', icNo: '900505-14-1234', email: 'chong@yahoo.com', phone: '0167788990', 
    address: '45 Jalan Damansara', clubId: 'c2', status: MemberStatus.PENDING, appliedDate: '2023-10-25', 
    profilePicUrl: 'https://picsum.photos/151', staffIdUrl: '', age: 34 
  },
  { 
    id: 'm3', fullName: 'Muthu A/L Sami', icNo: '881212-05-9876', email: 'muthu@gmail.com', phone: '0191122334', 
    address: '78 Taman Melati', clubId: 'c1', status: MemberStatus.REJECTED, appliedDate: '2023-09-15', 
    profilePicUrl: 'https://picsum.photos/152', staffIdUrl: '', age: 36
  },
  { 
    id: 'm4', fullName: 'Muhammad Qisti Amaluddin Bin Mohd Rozaini', icNo: '031212-06-0403', email: 'qisti@gmail.com', phone: '01122334455', 
    address: 'No 5, Lorong 3, Taman Setia', clubId: 'c1', status: MemberStatus.ACTIVE, appliedDate: '2023-11-20', 
    approvedDate: '2023-11-21', profilePicUrl: 'https://picsum.photos/153', staffIdUrl: '', age: 21
  },
  // Simulation of Ali Bin Abu having multiple memberships
  { 
    id: 'm5', fullName: 'Ali Bin Abu', icNo: '850101-10-5555', email: 'ali@gmail.com', phone: '0123456789', 
    address: '123 Jalan Ampang', clubId: 'c2', status: MemberStatus.ACTIVE, appliedDate: '2023-02-01', 
    approvedDate: '2023-02-10', profilePicUrl: 'https://picsum.photos/150', staffIdUrl: '', age: 39 
  },
  { 
    id: 'm6', fullName: 'Ali Bin Abu', icNo: '850101-10-5555', email: 'ali@gmail.com', phone: '0123456789', 
    address: '123 Jalan Ampang', clubId: 'c3', status: MemberStatus.PENDING, appliedDate: '2023-03-15', 
    profilePicUrl: 'https://picsum.photos/150', staffIdUrl: '', age: 39 
  },
  { 
    id: 'm7', fullName: 'Ali Bin Abu', icNo: '850101-10-5555', email: 'ali@gmail.com', phone: '0123456789', 
    address: '123 Jalan Ampang', clubId: 'c4', status: MemberStatus.ACTIVE, appliedDate: '2023-04-10', 
    profilePicUrl: 'https://picsum.photos/150', staffIdUrl: '', age: 39 
  },
  { 
    id: 'm8', fullName: 'Ali Bin Abu', icNo: '850101-10-5555', email: 'ali@gmail.com', phone: '0123456789', 
    address: '123 Jalan Ampang', clubId: 'c5', status: MemberStatus.EXPIRED, appliedDate: '2022-01-01', 
    profilePicUrl: 'https://picsum.photos/150', staffIdUrl: '', age: 39 
  },
  // Simulation of Muhammad Qisti having 3 memberships for specific search test
  { 
    id: 'm9', fullName: 'Muhammad Qisti Amaluddin Bin Mohd Rozaini', icNo: '031212-06-0403', email: 'qisti@gmail.com', phone: '01122334455', 
    address: 'No 5, Lorong 3, Taman Setia', clubId: 'c2', status: MemberStatus.ACTIVE, appliedDate: '2023-11-25', 
    approvedDate: '2023-11-26', profilePicUrl: 'https://picsum.photos/153', staffIdUrl: '', age: 21
  },
  { 
    id: 'm10', fullName: 'Muhammad Qisti Amaluddin Bin Mohd Rozaini', icNo: '031212-06-0403', email: 'qisti@gmail.com', phone: '01122334455', 
    address: 'No 5, Lorong 3, Taman Setia', clubId: 'c3', status: MemberStatus.PENDING, appliedDate: '2023-12-01', 
    profilePicUrl: 'https://picsum.photos/153', staffIdUrl: '', age: 21
  },
];

const MOCK_LOGS: UsageLog[] = [
  { id: 'l1', memberId: 'm1', partnerId: 'p1', timestamp: new Date().toISOString(), benefitType: 'Room Discount', location: 'Hotel Seri Malaysia Melaka' },
  { id: 'l2', memberId: 'm1', partnerId: 'p3', timestamp: new Date(Date.now() - 86400000).toISOString(), benefitType: 'Badminton Court', location: 'Sport Planet Ampang' },
];

// Service Class to simulate Backend
class MockDB {
  clubs = MOCK_CLUBS;
  members = MOCK_MEMBERS;
  partners = MOCK_PARTNERS;
  logs = MOCK_LOGS;
  
  // SIMULATION: If logged in as AJK, they belong to Club C1 (JKR)
  ajkClubId = 'c1'; 

  getClubs() { return this.clubs; }
  
  getMembers() { return this.members; }
  
  // Robust search function
  findMember(query: string) {
    if (!query) return undefined;
    const cleanQuery = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); 
    
    return this.members.find(m => {
      const cleanId = m.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const cleanIC = m.icNo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return cleanId === cleanQuery || cleanIC === cleanQuery;
    });
  }

  // Find all memberships for a given query (returns array)
  findAllMemberships(query: string) {
    if (!query) return [];
    const cleanQuery = query.replace(/[^a-zA-Z0-9]/g, '').toLowerCase(); 
    
    return this.members.filter(m => {
      const cleanId = m.id.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      const cleanIC = m.icNo.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return cleanId === cleanQuery || cleanIC === cleanQuery;
    });
  }

  getMemberById(id: string) { return this.members.find(m => m.id === id); }
  
  getMemberByIC(ic: string) { return this.members.find(m => m.icNo === ic); }

  getPartners() { return this.partners; }

  getLogs() { return this.logs; }

  addMember(member: Omit<Member, 'id' | 'status'>) {
    const newMember: Member = {
      ...member,
      id: `m${Date.now()}`,
      status: MemberStatus.PENDING,
    };
    this.members = [newMember, ...this.members];
    return newMember;
  }

  updateMemberStatus(id: string, status: MemberStatus) {
    this.members = this.members.map(m => 
      m.id === id ? { ...m, status, approvedDate: status === MemberStatus.ACTIVE ? new Date().toISOString() : undefined } : m
    );
  }

  addClub(club: Omit<Club, 'id'>) {
    const newClub = { 
        ...club, 
        id: `c${Date.now()}`,
        benefits: club.benefits || [],
        terms: club.terms || []
    };
    this.clubs = [...this.clubs, newClub];
    return newClub;
  }

  addPartner(partner: Omit<BenefitPartner, 'id'>) {
    const newPartner = { ...partner, id: `p${Date.now()}` };
    this.partners = [...this.partners, newPartner];
    return newPartner;
  }

  logUsage(memberId: string, partnerId: string, benefitType: string, location: string) {
    const log: UsageLog = {
      id: `l${Date.now()}`,
      memberId,
      partnerId,
      timestamp: new Date().toISOString(),
      benefitType,
      location
    };
    this.logs = [log, ...this.logs];
    return log;
  }

  getDashboardStats() {
    return {
      totalMembers: this.members.length,
      activeMembers: this.members.filter(m => m.status === MemberStatus.ACTIVE).length,
      pendingMembers: this.members.filter(m => m.status === MemberStatus.PENDING).length,
      totalClubs: this.clubs.length,
      totalPartners: this.partners.length,
      recentLogs: this.logs.slice(0, 5)
    };
  }
}

export const db = new MockDB();