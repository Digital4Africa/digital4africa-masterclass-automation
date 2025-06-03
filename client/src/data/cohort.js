// data/cohorts.js

export const cohorts = [
  {
    _id: "1",
    title: "Frontend Mastery",
    startDate: "2025-06-01",
    endDate: "2025-06-30",
    price: 5000,
    paidStudents: 8,
    partialStudents: 2,
    discounts: [
      { studentName: "Alice", amount: 500 },
      { studentName: "Bob", amount: 1000 }
    ]
  },
  {
    _id: "2",
    title: "Backend Engineering Bootcamp",
    startDate: "2025-05-01",
    endDate: "2025-05-25",
    price: 8000,
    paidStudents: 10,
    partialStudents: 1,
    discounts: [
      { studentName: "Charles", amount: 2000 }
    ]
  },
  {
    _id: "3",
    title: "Fullstack Developer Track",
    startDate: "2025-07-10",
    endDate: "2025-08-10",
    price: 10000,
    paidStudents: 5,
    partialStudents: 3,
    discounts: []
  }
];
