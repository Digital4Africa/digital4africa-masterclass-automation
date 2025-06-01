// masterclasses.js

const masterclasses = [
  // 3 In Progress Masterclasses (including June 1, 2025)
  {
    _id: '101',
    title: 'Digital Marketing Fundamentals',
    startDate: '2025-05-30T09:00:00Z',
    endDate: '2025-06-03T17:00:00Z',
    status: 'inprogress',
    students: generateStudents(101)
  },
  {
    _id: '102',
    title: 'Advanced Python for Data Science',
    startDate: '2025-05-28T09:00:00Z',
    endDate: '2025-06-02T17:00:00Z',
    status: 'inprogress',
    students: generateStudents(102)
  },
  {
    _id: '103',
    title: 'Full-Stack Web Development',
    startDate: '2025-05-25T09:00:00Z',
    endDate: '2025-06-05T17:00:00Z',
    status: 'inprogress',
    students: generateStudents(103)
  },

  // 3 Upcoming Masterclasses (start after June 1, 2025)
  {
    _id: '104',
    title: 'Machine Learning Crash Course',
    startDate: '2025-06-05T09:00:00Z',
    endDate: '2025-06-10T17:00:00Z',
    status: 'upcoming',
    students: generateStudents(104)
  },
  {
    _id: '105',
    title: 'Cloud Computing with AWS',
    startDate: '2025-06-10T09:00:00Z',
    endDate: '2025-06-12T17:00:00Z',
    status: 'upcoming',
    students: generateStudents(105)
  },
  {
    _id: '106',
    title: 'UI/UX Design Bootcamp',
    startDate: '2025-06-07T09:00:00Z',
    endDate: '2025-06-09T17:00:00Z',
    status: 'upcoming',
    students: generateStudents(106)
  },

  // 4 Past Masterclasses (ended before June 1, 2025)
  {
    _id: '107',
    title: 'Introduction to Cybersecurity',
    startDate: '2025-05-15T09:00:00Z',
    endDate: '2025-05-20T17:00:00Z',
    status: 'past',
    students: generateStudents(107)
  },
  {
    _id: '108',
    title: 'Product Management Essentials',
    startDate: '2025-04-25T09:00:00Z',
    endDate: '2025-04-30T17:00:00Z',
    status: 'past',
    students: generateStudents(108)
  },
  {
    _id: '109',
    title: 'Agile & Scrum Foundations',
    startDate: '2025-05-10T09:00:00Z',
    endDate: '2025-05-12T17:00:00Z',
    status: 'past',
    students: generateStudents(109)
  },
  {
    _id: '110',
    title: 'DevOps with Docker & Kubernetes',
    startDate: '2025-05-20T09:00:00Z',
    endDate: '2025-05-23T17:00:00Z',
    status: 'past',
    students: generateStudents(110)
  },
];

// Helper to generate 10 students per class
function generateStudents(seed) {
  return Array.from({ length: 10 }, (_, i) => {
    const num = i + 1;
    return {
      _id: `${seed}-${num}`,
      fullName: `Student ${num} of Class ${seed}`,
      email: `student${num}@class${seed}.com`,
      phone: `+12345678${num.toString().padStart(2, '0')}`,
      payment: {
        status: num % 2 === 0 ? 'full' : 'partial',
        amountPaid: num % 2 === 0 ? 299 : 150,
        discount: num % 3 === 0 ? 50 : 0,
        total: 299
      }
    };
  });
}

export default masterclasses;
