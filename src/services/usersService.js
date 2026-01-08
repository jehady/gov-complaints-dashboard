const users = [
  { id: 'ADM-01', name: 'Admin User', email: 'admin@gov.local', password: 'password', role: 'admin', departmentId: null },
  { id: 'UTIL-01', name: 'موظف المياه', email: 'water@gov.local', password: 'password', role: 'employee', departmentId: 'D-UTIL' },
  { id: 'TRA-01', name: 'موظف المرور', email: 'traffic@gov.local', password: 'password', role: 'employee', departmentId: 'D-TRAFFIC' }
]

export function list() {
  return users
}

export function findByEmail(email) {
  return Promise.resolve(users.find(u => u.email === email) || null)
}