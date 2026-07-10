export interface SelectOption {
  value: string
  label: string
}

export const DEPARTMENT_OPTIONS: SelectOption[] = [
  { value: 'CSE', label: 'Computer Science & Engineering (CSE)' },
  { value: 'ECE', label: 'Electronics & Communication (ECE)' },
  { value: 'EEE', label: 'Electrical & Electronics (EEE)' },
  { value: 'ME', label: 'Mechanical Engineering (ME)' },
  { value: 'CE', label: 'Civil Engineering (CE)' },
  { value: 'AI', label: 'Artificial Intelligence (AI)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'MCA', label: 'Master of Computer Applications (MCA)' },
  { value: 'MBA', label: 'Master of Business Administration (MBA)' },
  { value: 'Other', label: 'Other' },
]

export const SEMESTER_OPTIONS: SelectOption[] = [
  { value: 'S1', label: '1st Year / Semester 1 (S1)' },
  { value: 'S2', label: '1st Year / Semester 2 (S2)' },
  { value: 'S3', label: '2nd Year / Semester 3 (S3)' },
  { value: 'S4', label: '2nd Year / Semester 4 (S4)' },
  { value: 'S5', label: '3rd Year / Semester 5 (S5)' },
  { value: 'S6', label: '3rd Year / Semester 6 (S6)' },
  { value: 'S7', label: '4th Year / Semester 7 (S7)' },
  { value: 'S8', label: '4th Year / Semester 8 (S8)' },
  { value: 'Faculty', label: 'Faculty' },
]

const departmentLabels = Object.fromEntries(
  DEPARTMENT_OPTIONS.map((option) => [option.value, option.label]),
) as Record<string, string>

const semesterLabels = Object.fromEntries(
  SEMESTER_OPTIONS.map((option) => [option.value, option.label]),
) as Record<string, string>

export function formatDepartment(code: string): string {
  return departmentLabels[code] ?? code
}

export function formatSemester(code: string): string {
  return semesterLabels[code] ?? code
}
