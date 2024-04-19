export enum StudentStatus {
  ATTENDING = 'ATTENDING', //o'qiyapti
  PENDING = 'PENDING', //kutilmoqda, guruhga qo'shilmagan
  SUSPENDED = 'SUSPENDED ', //ma'lum sabablarga ko'ra to'xtailgan
  COMPLETED = 'COMPLETED ', //muvaffaqiyatli tugatgan
}

export enum GroupStatus {
  ACTIVE = 'ACTIVE', //guruh faol
  PENDING = 'PENDING', //o'quvchilar yi'gilmoqda
  COMPLETED = 'COMPLETED', //muvaffaqiyatli tugatilgan
  SUSPENDED = 'SUSPENDED', //ma'lum sabablarga ko'ra to'xtatilgan
}

export enum StaffRole {
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}
