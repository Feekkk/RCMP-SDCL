export const CATEGORIES = ['All', 'Announcement', 'Event', 'Deadline', 'Health', 'Academic']

export const FEATURED_POST = {
  category: 'Deadline',
  title: 'Semester 2 Financial Aid Applications Close 15 November',
  excerpt:
    'Students who wish to apply for the Zakat Fund, PTPTN top-up, or SDCL emergency assistance for the upcoming semester must submit their applications before the deadline. Late submissions will not be entertained.',
  date: 'Oct 18, 2026',
  author: 'SDCL Department',
}

export const POSTS = [
  {
    category: 'Announcement',
    title: 'Campus Clinic Operating Hours Updated for the Semester',
    excerpt: 'The student health clinic will now operate from 8am to 9pm on weekdays to better serve RCMP students during exam season.',
    date: 'Oct 15, 2026',
  },
  {
    category: 'Event',
    title: 'Mental Health Awareness Week: Free Counselling Sessions',
    excerpt: 'SDCL is organizing a full week of workshops, talks, and free one-on-one counselling sessions for all students. Register via the portal.',
    date: 'Oct 12, 2026',
  },
  {
    category: 'Deadline',
    title: 'PTPTN Loan Disbursement Form Submission Reminder',
    excerpt: 'Students receiving PTPTN loans this semester must submit their disbursement confirmation forms by the end of this month.',
    date: 'Oct 10, 2026',
  },
  {
    category: 'Academic',
    title: 'Clinical Attachment Schedule for Year 3 Students Released',
    excerpt: 'The updated clinical rotation timetable for Year 3 MBBS students is now available for download on the student portal.',
    date: 'Oct 8, 2026',
  },
  {
    category: 'Health',
    title: 'Free Health Screening Booth This Friday at Main Hall',
    excerpt: 'Blood pressure, BMI, and basic health screenings will be available for all students, staff, and faculty members this Friday.',
    date: 'Oct 5, 2026',
  },
  {
    category: 'Event',
    title: 'RCMP Sports Carnival 2026 Registration Now Open',
    excerpt: 'Sign up your team for football, badminton, futsal, and more. Registration closes two weeks before the carnival date.',
    date: 'Oct 2, 2026',
  },
  {
    category: 'Announcement',
    title: 'New Student Lounge Opens at Block C',
    excerpt: 'A new air-conditioned student lounge with study pods and charging stations is now open for use on Level 2, Block C.',
    date: 'Sep 29, 2026',
  },
  {
    category: 'Academic',
    title: 'Library Extended Hours During Final Exam Period',
    excerpt: 'The library will remain open until midnight throughout the final examination period to support student revision.',
    date: 'Sep 25, 2026',
  },
]

export function categoryTone(category) {
  switch (category) {
    case 'Deadline':
      return 'tone-deadline'
    case 'Event':
      return 'tone-event'
    case 'Health':
      return 'tone-health'
    case 'Academic':
      return 'tone-academic'
    default:
      return 'tone-announcement'
  }
}
