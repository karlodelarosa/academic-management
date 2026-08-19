'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  LayoutDashboard, ClipboardList, Users, BookOpen, Menu, ChevronLeft, ChevronRight,
  Search, Bell, Settings, X, Check, XCircle, Phone, Mail, FileText,
  GraduationCap, AlertCircle, CalendarDays, ChevronDown,
  Award, Activity, UserPlus, ShieldAlert,
  HeartPulse, ArrowRight, ArrowUpRight, Clock, BadgeCheck, CircleDot,
  Home, Frown, ListChecks, UserCog, CalendarRange, LayoutGrid, Layers, Shuffle, Plus, Rocket,
  Pencil, Trash2, ExternalLink, ArrowLeft, PartyPopper, RotateCcw, Send, SlidersHorizontal,
  Download, Printer, LogOut, Lock, KeyRound, ShieldCheck,
} from 'lucide-react';

/* =========================================================================
   NORTHBRIDGE ACADEMY — Admissions & Academic Management Console
   Single-file React prototype. All data below is fictional / for demo only.

   Flow simulated end-to-end:
   Instructors -> School Year -> Class Sections -> Curriculum -> Matching
   (instructor x subject x section, student x section) -> Gradebook/Timetable
   Admissions "Enrolled" applicants land as unassigned students that need
   to be placed into a section from the Matching screen.
   ========================================================================= */

const SCHOOL_NAME = 'Northbridge Academy';
const TODAY = '2026-08-19';

/* ----------------------------- Dummy Data ------------------------------ */

const STUDENTS_SEED = [
  {
    id: 'STU-2031', name: 'Ava Martinez', grade: 9, status: 'Active', gpa: 3.8,
    attendance: 96, guardian: 'Elena Martinez', relation: 'Mother',
    phone: '(555) 201-3344', email: 'ava.martinez@nba.edu',
    address: '14 Cypress Ln, Fairview', enrolled: '2023-08-14',
    health: 'No known conditions on file.', disciplinary: 'No incidents this year.',
    tags: ['Honor Roll'], sectionId: 'SEC-01', sourceApplicantId: null,
  },
  {
    id: 'STU-2032', name: 'Liam Chen', grade: 10, status: 'Active', gpa: 3.2,
    attendance: 89, guardian: 'Wei Chen', relation: 'Father',
    phone: '(555) 204-8871', email: 'liam.chen@nba.edu',
    address: '92 Birchwood Ave, Fairview', enrolled: '2022-08-20',
    health: 'Mild asthma — carries rescue inhaler.', disciplinary: 'No incidents this year.',
    tags: [], sectionId: 'SEC-03', sourceApplicantId: null,
  },
  {
    id: 'STU-2033', name: 'Sophia Nguyen', grade: 9, status: 'On Leave', gpa: 3.6,
    attendance: 72, guardian: 'Trang Nguyen', relation: 'Mother',
    phone: '(555) 219-3302', email: 'sophia.nguyen@nba.edu',
    address: '5 Larkspur Ct, Fairview', enrolled: '2023-08-14',
    health: 'Approved medical leave through Sept 2, 2026.', disciplinary: 'No incidents this year.',
    tags: ['Medical Leave'], sectionId: 'SEC-02', sourceApplicantId: null,
  },
  {
    id: 'STU-2034', name: 'Noah Williams', grade: 11, status: 'Active', gpa: 2.4,
    attendance: 81, guardian: 'Deborah Williams', relation: 'Mother',
    phone: '(555) 233-9012', email: 'noah.williams@nba.edu',
    address: '221 Maple St, Fairview', enrolled: '2021-08-16',
    health: 'No known conditions on file.', disciplinary: 'Tardiness warning issued Mar 2026.',
    tags: ['At Risk'], sectionId: 'SEC-05', sourceApplicantId: null,
  },
  {
    id: 'STU-2035', name: 'Isabella Garcia', grade: 12, status: 'Active', gpa: 3.9,
    attendance: 98, guardian: 'Carlos Garcia', relation: 'Father',
    phone: '(555) 245-1120', email: 'isabella.garcia@nba.edu',
    address: '8 Windsor Pl, Fairview', enrolled: '2020-08-18',
    health: 'No known conditions on file.', disciplinary: 'No incidents this year.',
    tags: ['National Honor Society'], sectionId: 'SEC-06', sourceApplicantId: null,
  },
  {
    id: 'STU-2036', name: 'Mason Patel', grade: 10, status: 'Active', gpa: 2.9,
    attendance: 85, guardian: 'Priya Patel', relation: 'Mother',
    phone: '(555) 267-4456', email: 'mason.patel@nba.edu',
    address: '63 Hollow Rd, Fairview', enrolled: '2022-08-20',
    health: 'No known conditions on file.', disciplinary: 'No incidents this year.',
    tags: [], sectionId: 'SEC-04', sourceApplicantId: null,
  },
  {
    id: 'STU-2037', name: 'Olivia Brown', grade: 11, status: 'Active', gpa: 3.4,
    attendance: 91, guardian: 'James Brown', relation: 'Father',
    phone: '(555) 278-6602', email: 'olivia.brown@nba.edu',
    address: '30 Elmwood Dr, Fairview', enrolled: '2021-08-16',
    health: 'Severe peanut allergy — EpiPen on file with nurse.', disciplinary: 'No incidents this year.',
    tags: ['Allergy Alert'], sectionId: 'SEC-05', sourceApplicantId: null,
  },
  {
    id: 'STU-2038', name: 'Ethan Kim', grade: 12, status: 'On Leave', gpa: 3.1,
    attendance: 64, guardian: 'Grace Kim', relation: 'Mother',
    phone: '(555) 289-7789', email: 'ethan.kim@nba.edu',
    address: '77 Sunview Ter, Fairview', enrolled: '2020-08-18',
    health: 'No known conditions on file.', disciplinary: 'Family relocation — leave through end of term.',
    tags: ['On Leave'], sectionId: 'SEC-06', sourceApplicantId: null,
  },
  {
    id: 'STU-5508', name: 'Jack Martinez', grade: 9, status: 'Active', gpa: null,
    attendance: null, guardian: 'Laura Martinez', relation: 'Guardian',
    phone: '(555) 308-4432', email: 'laura.martinez@gmail.com',
    address: 'Address on file', enrolled: '2026-07-28',
    health: 'No records yet — newly enrolled.', disciplinary: 'No records yet — newly enrolled.',
    tags: ['New Enrollee'], sectionId: null, sourceApplicantId: 'APP-5508',
  },
];

const STAGES = ['New Applied', 'Document Review', 'Assessment / Interview', 'Approved', 'Enrolled'];

const INITIAL_APPLICANTS = [
  {
    id: 'APP-5501', name: 'Emma Rodriguez', appliedGrade: 9, stage: 'New Applied',
    guardian: 'Maria Rodriguez', phone: '(555) 301-2210', email: 'maria.rodriguez@gmail.com',
    submitted: '2026-08-10', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Pending' },
      { name: 'Prior Report Card', status: 'Pending' },
      { name: 'Immunization Record', status: 'Missing' },
    ],
  },
  {
    id: 'APP-5502', name: 'Lucas Johnson', appliedGrade: 10, stage: 'New Applied',
    guardian: 'Tom Johnson', phone: '(555) 302-8834', email: 'tom.johnson@gmail.com',
    submitted: '2026-08-11', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Pending' },
      { name: 'Immunization Record', status: 'Pending' },
    ],
  },
  {
    id: 'APP-5503', name: 'Mia Anderson', appliedGrade: 9, stage: 'Document Review',
    guardian: 'Rachel Anderson', phone: '(555) 303-1145', email: 'rachel.anderson@gmail.com',
    submitted: '2026-08-04', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Verified' },
      { name: 'Immunization Record', status: 'Pending' },
    ],
  },
  {
    id: 'APP-5504', name: 'Benjamin Lee', appliedGrade: 11, stage: 'Document Review',
    guardian: 'Susan Lee', phone: '(555) 304-9987', email: 'susan.lee@gmail.com',
    submitted: '2026-08-02', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Pending' },
      { name: 'Recommendation Letter', status: 'Pending' },
    ],
  },
  {
    id: 'APP-5505', name: 'Charlotte Davis', appliedGrade: 9, stage: 'Assessment / Interview',
    guardian: 'Michael Davis', phone: '(555) 305-6623', email: 'michael.davis@gmail.com',
    submitted: '2026-07-29', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Verified' },
      { name: 'Immunization Record', status: 'Verified' },
    ],
  },
  {
    id: 'APP-5506', name: 'Henry Wilson', appliedGrade: 12, stage: 'Assessment / Interview',
    guardian: 'Karen Wilson', phone: '(555) 306-3321', email: 'karen.wilson@gmail.com',
    submitted: '2026-07-25', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Verified' },
      { name: 'Recommendation Letter', status: 'Verified' },
    ],
  },
  {
    id: 'APP-5507', name: 'Amelia Thompson', appliedGrade: 10, stage: 'Approved',
    guardian: 'David Thompson', phone: '(555) 307-7743', email: 'david.thompson@gmail.com',
    submitted: '2026-07-18', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Verified' },
      { name: 'Immunization Record', status: 'Verified' },
    ],
  },
  {
    id: 'APP-5508', name: 'Jack Martinez', appliedGrade: 9, stage: 'Enrolled',
    guardian: 'Laura Martinez', phone: '(555) 308-4432', email: 'laura.martinez@gmail.com',
    submitted: '2026-07-10', rejected: false,
    documents: [
      { name: 'Birth Certificate', status: 'Verified' },
      { name: 'Prior Report Card', status: 'Verified' },
      { name: 'Immunization Record', status: 'Verified' },
    ],
  },
];

const SUBJECT_CATALOG_SEED = [
  { name: 'Mathematics', units: 1 },
  { name: 'Science', units: 1 },
  { name: 'English', units: 1 },
  { name: 'History', units: 1 },
  { name: 'Physical Education', units: 0.5 },
  { name: 'Art', units: 0.5 },
  { name: 'Research', units: 1 },
];

const CURRICULUM_SEED = {
  9: ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Art'],
  10: ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Art'],
  11: ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Research'],
  12: ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Research'],
};

const INSTRUCTORS_SEED = [
  { id: 'INS-01', name: 'Mr. Daniel Alvarez', email: 'd.alvarez@nba.edu', phone: '(555) 401-2201', employment: 'Full-time', subjects: ['Mathematics'] },
  { id: 'INS-02', name: 'Ms. Ngozi Okafor', email: 'n.okafor@nba.edu', phone: '(555) 401-2202', employment: 'Full-time', subjects: ['Science', 'Research'] },
  { id: 'INS-03', name: 'Mrs. Elena Bianchi', email: 'e.bianchi@nba.edu', phone: '(555) 401-2203', employment: 'Full-time', subjects: ['English'] },
  { id: 'INS-04', name: 'Mr. Marcus Douglas', email: 'm.douglas@nba.edu', phone: '(555) 401-2204', employment: 'Full-time', subjects: ['History'] },
  { id: 'INS-05', name: 'Coach Diego Reyes', email: 'd.reyes@nba.edu', phone: '(555) 401-2205', employment: 'Full-time', subjects: ['Physical Education'] },
  { id: 'INS-06', name: 'Ms. Claire Fontaine', email: 'c.fontaine@nba.edu', phone: '(555) 401-2206', employment: 'Part-time', subjects: ['Art'] },
  { id: 'INS-07', name: 'Dr. Samuel Whitfield', email: 's.whitfield@nba.edu', phone: '(555) 401-2207', employment: 'Part-time', subjects: ['Research'] },
];

// Demo-only accounts for the role simulation below. There is no real backend
// or credential store — logging in just matches against this in-memory list.
// This is NOT real authentication; it exists purely to demo role-based views.
const DEMO_ACCOUNTS = [
  { id: 'ACC-1', name: 'Priya Sharma', email: 'registrar@nba.edu', password: 'admin123', role: 'admin', title: 'Registrar' },
  { id: 'ACC-2', name: 'Mr. Daniel Alvarez', email: 'd.alvarez@nba.edu', password: 'teach123', role: 'teacher', title: 'Teacher', instructorId: 'INS-01' },
  { id: 'ACC-3', name: 'Elena Martinez', email: 'parent@nba.edu', password: 'parent123', role: 'parent', title: 'Parent', studentId: 'STU-2031' },
];

const SCHOOL_YEARS_SEED = [
  {
    id: 'SY-2526', label: 'SY 2025–2026', start: '2025-08-11', end: '2026-06-05', status: 'Archived',
    terms: [
      { id: 'TRM-2526-1', label: 'Semester 1', start: '2025-08-11', end: '2026-01-16' },
      { id: 'TRM-2526-2', label: 'Semester 2', start: '2026-01-19', end: '2026-06-05' },
    ],
  },
  {
    id: 'SY-2627', label: 'SY 2026–2027', start: '2026-08-10', end: '2027-06-04', status: 'Active',
    terms: [
      { id: 'TRM-2627-1', label: 'Semester 1', start: '2026-08-10', end: '2027-01-15' },
      { id: 'TRM-2627-2', label: 'Semester 2', start: '2027-01-18', end: '2027-06-04' },
    ],
  },
  {
    id: 'SY-2728', label: 'SY 2027–2028', start: '2027-08-09', end: '2028-06-02', status: 'Draft',
    terms: [],
  },
];
const ACTIVE_SCHOOL_YEAR_SEED = 'SY-2627';
const ACTIVE_TERM_SEED = 'TRM-2627-1';

const SECTIONS_SEED = [
  { id: 'SEC-01', name: 'Grade 9 – Diamond', grade: 9, schoolYearId: 'SY-2627', adviserId: 'INS-01', capacity: 30 },
  { id: 'SEC-02', name: 'Grade 9 – Pearl', grade: 9, schoolYearId: 'SY-2627', adviserId: 'INS-03', capacity: 30 },
  { id: 'SEC-03', name: 'Grade 10 – Sapphire', grade: 10, schoolYearId: 'SY-2627', adviserId: 'INS-02', capacity: 30 },
  { id: 'SEC-04', name: 'Grade 10 – Emerald', grade: 10, schoolYearId: 'SY-2627', adviserId: 'INS-04', capacity: 30 },
  { id: 'SEC-05', name: 'Grade 11 – Horizon', grade: 11, schoolYearId: 'SY-2627', adviserId: 'INS-06', capacity: 30 },
  { id: 'SEC-06', name: 'Grade 12 – Summit', grade: 12, schoolYearId: 'SY-2627', adviserId: 'INS-07', capacity: 30 },
];

// GRADES[subject][studentId] = { assignments: [..], midterm, final }
const GRADES = {
  Mathematics: {
    'STU-2031': { assignments: [92, 95, 88, 97], midterm: 91, final: 94 },
    'STU-2032': { assignments: [78, 82, 75, 80], midterm: 74, final: 79 },
    'STU-2033': { assignments: [88, 90, 85, 91], midterm: 87, final: 89 },
    'STU-2034': { assignments: [61, 58, 65, 60], midterm: 55, final: 59 },
    'STU-2035': { assignments: [96, 98, 94, 99], midterm: 97, final: 98 },
    'STU-2036': { assignments: [70, 74, 68, 72], midterm: 69, final: 71 },
    'STU-2037': { assignments: [84, 86, 81, 88], midterm: 83, final: 85 },
    'STU-2038': { assignments: [80, 77, 83, 79], midterm: 81, final: 78 },
  },
  Science: {
    'STU-2031': { assignments: [90, 92, 89, 94], midterm: 88, final: 91 },
    'STU-2032': { assignments: [85, 80, 83, 82], midterm: 79, final: 81 },
    'STU-2033': { assignments: [91, 89, 93, 90], midterm: 92, final: 90 },
    'STU-2034': { assignments: [66, 70, 63, 68], midterm: 64, final: 67 },
    'STU-2035': { assignments: [95, 97, 96, 98], midterm: 96, final: 97 },
    'STU-2036': { assignments: [76, 72, 78, 74], midterm: 73, final: 75 },
    'STU-2037': { assignments: [88, 85, 90, 87], midterm: 86, final: 89 },
    'STU-2038': { assignments: [72, 75, 70, 73], midterm: 71, final: 74 },
  },
  English: {
    'STU-2031': { assignments: [94, 91, 96, 93], midterm: 92, final: 95 },
    'STU-2032': { assignments: [82, 79, 84, 81], midterm: 80, final: 83 },
    'STU-2033': { assignments: [87, 90, 86, 89], midterm: 88, final: 87 },
    'STU-2034': { assignments: [70, 68, 72, 69], midterm: 67, final: 71 },
    'STU-2035': { assignments: [97, 95, 98, 96], midterm: 98, final: 96 },
    'STU-2036': { assignments: [79, 81, 77, 80], midterm: 78, final: 82 },
    'STU-2037': { assignments: [89, 87, 91, 88], midterm: 90, final: 89 },
    'STU-2038': { assignments: [75, 78, 73, 76], midterm: 74, final: 77 },
  },
  History: {
    'STU-2031': { assignments: [88, 90, 87, 91], midterm: 89, final: 90 },
    'STU-2032': { assignments: [77, 75, 79, 76], midterm: 74, final: 78 },
    'STU-2033': { assignments: [92, 90, 94, 91], midterm: 93, final: 92 },
    'STU-2034': { assignments: [58, 62, 56, 60], midterm: 57, final: 61 },
    'STU-2035': { assignments: [93, 95, 92, 96], midterm: 94, final: 95 },
    'STU-2036': { assignments: [71, 69, 74, 72], midterm: 70, final: 73 },
    'STU-2037': { assignments: [86, 84, 88, 85], midterm: 87, final: 86 },
    'STU-2038': { assignments: [79, 76, 81, 78], midterm: 77, final: 80 },
  },
  'Physical Education': {
    'STU-2031': { assignments: [95, 97, 93, 96], midterm: 94, final: 97 },
    'STU-2032': { assignments: [88, 90, 85, 89], midterm: 86, final: 88 },
    'STU-2033': { assignments: [90, 92, 89, 93], midterm: 91, final: 92 },
    'STU-2034': { assignments: [82, 79, 84, 80], midterm: 78, final: 81 },
    'STU-2035': { assignments: [98, 99, 97, 99], midterm: 98, final: 99 },
    'STU-2036': { assignments: [85, 87, 83, 86], midterm: 84, final: 87 },
    'STU-2037': { assignments: [93, 91, 95, 92], midterm: 94, final: 93 },
    'STU-2038': { assignments: [80, 83, 78, 82], midterm: 79, final: 81 },
  },
};

/* --------------------------- Grading Criteria --------------------------- */
// Flexible, per-subject weighted grading: each subject has its own list of
// categories (e.g. Attendance 10%, Quizzes 20%...), each category holds any
// number of scored items (Quiz 1, Quiz 2, ...). A student's category score is
// (sum of raw points / sum of max points) and the overall grade is the
// weight-sum of category scores. All of it is editable at runtime.

let __idCounter = 0;
function genId(prefix) {
  __idCounter += 1;
  return `${prefix}-${__idCounter}`;
}

function defaultCriteria() {
  return [
    {
      id: genId('CAT'), name: 'Attendance', weight: 10,
      items: [{ id: genId('ITM'), label: 'Attendance', maxScore: 100 }],
    },
    {
      id: genId('CAT'), name: 'Quizzes', weight: 20,
      items: [
        { id: genId('ITM'), label: 'Quiz 1', maxScore: 20 },
        { id: genId('ITM'), label: 'Quiz 2', maxScore: 20 },
      ],
    },
    {
      id: genId('CAT'), name: 'Class Standing', weight: 20,
      items: [{ id: genId('ITM'), label: 'Class Standing', maxScore: 100 }],
    },
    {
      id: genId('CAT'), name: 'Major Exams', weight: 50,
      items: [
        { id: genId('ITM'), label: 'Midterm Exam', maxScore: 50 },
        { id: genId('ITM'), label: 'Final Exam', maxScore: 50 },
      ],
    },
  ];
}

const GRADING_SUBJECTS = ['Mathematics', 'Science', 'English', 'History', 'Physical Education', 'Art', 'Research'];

const CRITERIA_SEED = {};
GRADING_SUBJECTS.forEach((s) => { CRITERIA_SEED[s] = defaultCriteria(); });

// Seed realistic per-item scores from the legacy GRADES sample data above,
// so the gradebook opens already populated instead of blank.
// scores[subject][termId][studentId][itemId] = raw score — grades are kept
// separate per term so Semester 1 and Semester 2 don't collide.
function buildSeedScores() {
  const scores = {};
  GRADING_SUBJECTS.forEach((subject) => {
    scores[subject] = { [ACTIVE_TERM_SEED]: {} };
    const legacy = GRADES[subject];
    if (!legacy) return;
    const [attendanceCat, quizzesCat, classStandingCat, examsCat] = CRITERIA_SEED[subject];
    STUDENTS_SEED.forEach((student) => {
      const record = legacy[student.id];
      if (!record) return;
      const s = {};
      if (student.attendance != null) {
        s[attendanceCat.items[0].id] = student.attendance;
      }
      s[quizzesCat.items[0].id] = Math.round(record.assignments[0] / 5);
      s[quizzesCat.items[1].id] = Math.round(record.assignments[1] / 5);
      s[classStandingCat.items[0].id] = Math.round((record.assignments[2] + record.assignments[3]) / 2);
      s[examsCat.items[0].id] = Math.round(record.midterm / 2);
      s[examsCat.items[1].id] = Math.round(record.final / 2);
      scores[subject][ACTIVE_TERM_SEED][student.id] = s;
    });
  });
  return scores;
}
const SCORES_SEED = buildSeedScores();

function categoryPercent(category, studentScores) {
  let sumRaw = 0, sumMax = 0, any = false;
  category.items.forEach((item) => {
    const raw = studentScores ? studentScores[item.id] : undefined;
    if (raw != null && raw !== '') {
      sumRaw += Number(raw);
      sumMax += Number(item.maxScore) || 0;
      any = true;
    }
  });
  if (!any || sumMax === 0) return null;
  return (sumRaw / sumMax) * 100;
}

function overallGrade(categories, studentScores) {
  if (!categories || categories.length === 0) return null;
  let total = 0;
  for (const cat of categories) {
    const pct = categoryPercent(cat, studentScores);
    if (pct == null) return null;
    total += (Number(cat.weight) || 0) / 100 * pct;
  }
  return total;
}

function totalWeight(categories) {
  return (categories || []).reduce((sum, c) => sum + (Number(c.weight) || 0), 0);
}

const PERIOD_TIMES = ['8:00 – 8:50', '8:55 – 9:45', '9:50 – 10:40', '10:45 – 11:35', '12:20 – 1:10', '1:15 – 2:05'];
const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

const ACTIVITY_FEED = [
  { id: 1, icon: 'approve', text: "Amelia Thompson's application was approved.", time: '2 hours ago' },
  { id: 2, icon: 'enroll', text: 'Jack Martinez completed enrollment.', time: '1 day ago' },
  { id: 3, icon: 'apply', text: 'New application received from Emma Rodriguez.', time: '2 days ago' },
  { id: 4, icon: 'review', text: 'Document review completed for Mia Anderson.', time: '3 days ago' },
  { id: 5, icon: 'apply', text: 'New application received from Lucas Johnson.', time: '4 days ago' },
];

const UPCOMING_DEADLINES = [
  { id: 1, label: 'Parent-teacher conference sign-up closes', date: 'Aug 25, 2026' },
  { id: 2, label: 'Fall semester enrollment closes', date: 'Sep 1, 2026' },
  { id: 3, label: 'Midterm grades due', date: 'Sep 12, 2026' },
];

const ATTENDANCE_TREND = [
  { label: 'Wk 1', value: 94 },
  { label: 'Wk 2', value: 91 },
  { label: 'Wk 3', value: 88 },
  { label: 'Wk 4', value: 92 },
  { label: 'Wk 5', value: 90 },
  { label: 'Wk 6', value: 87 },
];

/* ------------------------------ Utilities ------------------------------ */

function classNames(...xs) {
  return xs.filter(Boolean).join(' ');
}

function csvCell(value) {
  const s = String(value ?? '');
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function downloadCSV(filename, rows2D) {
  const csv = rows2D.map((row) => row.map(csvCell).join(',')).join('\r\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function initials(name) {
  return name.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();
}

function average(nums) {
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function gradeStatus(score) {
  if (score >= 90) return { label: 'Honors', tone: 'violet' };
  if (score >= 75) return { label: 'Passing', tone: 'emerald' };
  return { label: 'At Risk', tone: 'rose' };
}

const AVATAR_PALETTE = [
  'bg-[#F4E7E7] text-[#7A2E2E]', 'bg-[#F6EEDC] text-[#A6752E]',
  'bg-[#E3EEE6] text-[#3F7A52]', 'bg-[#FBE7DD] text-[#B5482F]',
  'bg-[#EAE4F1] text-[#5B4B8A]', 'bg-[#DCEAEA] text-[#2C6E6E]',
  'bg-[#F0E6D8] text-[#8B5E34]', 'bg-[#EFE6D6] text-[#5C4F3D]',
];

function avatarTone(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_PALETTE[h % AVATAR_PALETTE.length];
}

function rotateArray(arr, n) {
  const len = arr.length;
  if (len === 0) return [];
  const shift = n % len;
  return [...arr.slice(shift), ...arr.slice(0, shift)];
}

function buildTimetable(section, subjectsForGrade, offerings, instructors, sectionOffset = 0) {
  const table = {};
  WEEKDAYS.forEach((day, di) => {
    const rotated = rotateArray(subjectsForGrade, di + sectionOffset);
    table[day] = rotated.slice(0, PERIOD_TIMES.length).map((subjectName, pi) => {
      const offering = offerings.find((o) => o.sectionId === section.id && o.subjectId === subjectName);
      const instructor = offering ? instructors.find((i) => i.id === offering.instructorId) : null;
      return {
        period: String(pi + 1),
        time: PERIOD_TIMES[pi],
        subject: subjectName,
        teacher: instructor ? instructor.name : 'Unassigned',
      };
    });
  });
  return table;
}

// Sections of the same grade get offset rotations so their schedules don't
// line up identically — without this, every Grade 9 section would have the
// exact same subject in every period, guaranteeing instructor conflicts.
function sectionOffsetFor(section, allSections) {
  const sameGrade = allSections.filter((s) => s.grade === section.grade).sort((a, b) => a.id.localeCompare(b.id));
  return Math.max(0, sameGrade.findIndex((s) => s.id === section.id));
}

// Cross-references every section's generated timetable to find an instructor
// booked into two sections at the same day + period.
function findScheduleConflicts(sections, curriculum, offerings, instructors) {
  const slotMap = {};
  sections.forEach((section) => {
    const subjectsForGrade = curriculum[section.grade] || [];
    if (!subjectsForGrade.length) return;
    const offset = sectionOffsetFor(section, sections);
    const timetable = buildTimetable(section, subjectsForGrade, offerings, instructors, offset);
    WEEKDAYS.forEach((day) => {
      timetable[day].forEach((p) => {
        const offering = offerings.find((o) => o.sectionId === section.id && o.subjectId === p.subject);
        if (!offering || !offering.instructorId) return;
        const key = `${day}|${p.period}|${offering.instructorId}`;
        if (!slotMap[key]) slotMap[key] = [];
        slotMap[key].push({ sectionName: section.name, subject: p.subject, time: p.time });
      });
    });
  });

  const conflicts = [];
  Object.entries(slotMap).forEach(([key, entries]) => {
    if (entries.length > 1) {
      const [day, period, instructorId] = key.split('|');
      const instructor = instructors.find((i) => i.id === instructorId);
      conflicts.push({
        id: key,
        day,
        period,
        time: entries[0].time,
        instructorName: instructor ? instructor.name : 'Unknown',
        sections: entries,
      });
    }
  });
  return conflicts;
}

function buildDefaultOfferings(sections, curriculum, instructors) {
  const list = [];
  sections.forEach((sec) => {
    const subjectsForGrade = curriculum[sec.grade] || [];
    subjectsForGrade.forEach((subjectName) => {
      const qualified = instructors.find((i) => i.subjects.includes(subjectName));
      list.push({
        id: `OFF-${sec.id}-${subjectName.replace(/\s+/g, '')}`,
        sectionId: sec.id,
        subjectId: subjectName,
        instructorId: qualified ? qualified.id : '',
      });
    });
  });
  return list;
}

function studentFromApplicant(a) {
  return {
    id: `STU-${a.id.replace('APP-', '')}`,
    name: a.name,
    grade: a.appliedGrade,
    status: 'Active',
    gpa: null,
    attendance: null,
    guardian: a.guardian,
    relation: 'Guardian',
    phone: a.phone,
    email: a.email,
    address: 'Address on file',
    enrolled: TODAY,
    health: 'No records yet — newly enrolled.',
    disciplinary: 'No records yet — newly enrolled.',
    tags: ['New Enrollee'],
    sectionId: null,
    sourceApplicantId: a.id,
  };
}

/* -------------------------------- Atoms --------------------------------- */

const INPUT_CLS = 'w-full px-3 py-2.5 rounded-lg bg-[#EFE6D6] text-sm text-[#42392A] placeholder:text-[#9C8E76] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 focus:bg-white transition-all';

function Avatar({ name, size = 'w-10 h-10 text-sm' }) {
  return (
    <div className={classNames('rounded-full flex items-center justify-center font-semibold shrink-0', size, avatarTone(name))}>
      {initials(name)}
    </div>
  );
}

const TONE_CLASSES = {
  slate: 'bg-[#EFE6D6] text-[#5C4F3D] ring-[#E3D7C0]',
  indigo: 'bg-[#F4E7E7] text-[#5E2323] ring-[#D9B4B4]',
  violet: 'bg-[#F6EEDC] text-[#8A5F24] ring-[#DFCB9E]',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200',
};

function Pill({ tone = 'slate', children, className = '' }) {
  return (
    <span className={classNames('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ring-1 ring-inset', TONE_CLASSES[tone], className)}>
      {children}
    </span>
  );
}

function DocStatusPill({ status }) {
  const map = {
    Verified: { tone: 'emerald', icon: <Check className="w-3 h-3" /> },
    Pending: { tone: 'amber', icon: <Clock className="w-3 h-3" /> },
    Missing: { tone: 'rose', icon: <AlertCircle className="w-3 h-3" /> },
  };
  const cfg = map[status] || map.Pending;
  return <Pill tone={cfg.tone}>{cfg.icon}{status}</Pill>;
}

function IconButton({ children, className = '', ...props }) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center rounded-full w-9 h-9 text-[#786A55] hover:text-[#22190F] hover:bg-[#EFE6D6] transition-colors duration-150',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-[#7A2E2E] text-white hover:bg-[#5E2323] shadow-sm shadow-[#D9B4B4]',
    danger: 'bg-[#B5482F] text-white hover:bg-[#943A26] shadow-sm shadow-[#E8C4B6]',
    ghost: 'bg-white text-[#42392A] ring-1 ring-inset ring-[#E3D7C0] hover:bg-[#F7F3EC]',
    subtle: 'bg-[#EFE6D6] text-[#42392A] hover:bg-[#E3D7C0]',
  };
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-150 active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

function EmptyState({ icon, title, subtitle }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6">
      <div className="w-14 h-14 rounded-2xl bg-[#EFE6D6] flex items-center justify-center text-[#9C8E76] mb-4">
        {icon}
      </div>
      <p className="font-semibold text-[#42392A]">{title}</p>
      {subtitle && <p className="text-sm text-[#9C8E76] mt-1 max-w-sm">{subtitle}</p>}
    </div>
  );
}

function Modal({ title, onClose, children, footer, size = 'md' }) {
  const sizes = { md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-3xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#22190F]/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={classNames('relative w-full bg-white rounded-2xl shadow-2xl flex flex-col max-h-[85vh] animate-pop-in', sizes[size])}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EFE6D6]">
          <h3 className="font-serif font-semibold text-[#22190F]">{title}</h3>
          <IconButton onClick={onClose}><X className="w-4 h-4" /></IconButton>
        </div>
        <div className="p-5 overflow-y-auto space-y-4">{children}</div>
        {footer && <div className="p-5 border-t border-[#EFE6D6] flex gap-3">{footer}</div>}
      </div>
    </div>
  );
}

/* ------------------------------- Toasts --------------------------------- */

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2 w-80">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={classNames(
            'animate-toast-in flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ring-1 bg-white',
            t.tone === 'success' && 'ring-emerald-100',
            t.tone === 'error' && 'ring-rose-100',
            t.tone === 'info' && 'ring-[#E9D2D2]'
          )}
        >
          <div className={classNames(
            'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center shrink-0',
            t.tone === 'success' && 'bg-emerald-100 text-emerald-600',
            t.tone === 'error' && 'bg-rose-100 text-rose-600',
            t.tone === 'info' && 'bg-[#E9D2D2] text-[#7A2E2E]'
          )}>
            {t.tone === 'success' && <Check className="w-3.5 h-3.5" />}
            {t.tone === 'error' && <XCircle className="w-3.5 h-3.5" />}
            {t.tone === 'info' && <BadgeCheck className="w-3.5 h-3.5" />}
          </div>
          <p className="text-sm text-[#42392A] flex-1 pt-0.5">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} className="text-[#C9B99A] hover:text-[#786A55] mt-0.5">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- Sidebar -------------------------------- */

const NAV_GROUPS = [
  {
    label: 'Workspace',
    items: [
      { key: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['admin', 'teacher'] },
      { key: 'admissions', label: 'Admissions', icon: ClipboardList, badgeKey: 'pending', roles: ['admin'] },
      { key: 'students', label: 'Student Directory', icon: Users, roles: ['admin', 'teacher'] },
      { key: 'academic', label: 'Academics', icon: BookOpen, roles: ['admin', 'teacher'] },
    ],
  },
  {
    label: 'Academic Setup',
    items: [
      { key: 'guide', label: 'Setup Guide', icon: ListChecks, roles: ['admin'] },
      { key: 'instructors', label: 'Instructors', icon: UserCog, roles: ['admin'] },
      { key: 'schoolyear', label: 'School Year', icon: CalendarRange, roles: ['admin'] },
      { key: 'sections', label: 'Class Sections', icon: LayoutGrid, roles: ['admin'] },
      { key: 'curriculum', label: 'Curriculum', icon: Layers, roles: ['admin'] },
      { key: 'matching', label: 'Matching', icon: Shuffle, badgeKey: 'unassigned', roles: ['admin'] },
    ],
  },
];

function Sidebar({ collapsed, onToggle, active, onSelect, badges, role = 'admin' }) {
  const visibleGroups = NAV_GROUPS
    .map((group) => ({ ...group, items: group.items.filter((item) => item.roles.includes(role)) }))
    .filter((group) => group.items.length > 0);

  return (
    <aside className={classNames(
      'hidden md:flex flex-col shrink-0 bg-white border-r border-[#E3D7C0] transition-all duration-200 ease-out',
      collapsed ? 'w-[76px]' : 'w-64'
    )}>
      <div className="h-16 flex items-center gap-2.5 px-4 border-b border-[#E3D7C0] shrink-0">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#D9B4B4] ring-2 ring-[#F6EEDC]">
          <GraduationCap className="w-[18px] h-[18px]" />
        </div>
        {!collapsed && (
          <div className="min-w-0">
            <p className="font-serif font-semibold text-[#22190F] text-sm leading-tight truncate">{SCHOOL_NAME}</p>
            <p className="text-[11px] text-[#9C8E76] leading-tight">Admin Console</p>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto">
        {visibleGroups.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-3 mb-1.5 text-[10px] font-semibold text-[#9C8E76] uppercase tracking-wider">{group.label}</p>
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = active === item.key;
                const badgeCount = item.badgeKey ? (badges[item.badgeKey] || 0) : 0;
                return (
                  <button
                    key={item.key}
                    onClick={() => onSelect(item.key)}
                    className={classNames(
                      'w-full group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-150 relative',
                      isActive ? 'bg-[#F4E7E7] text-[#5E2323]' : 'text-[#786A55] hover:bg-[#F7F3EC] hover:text-[#2E2718]'
                    )}
                  >
                    {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 rounded-r-full bg-[#B8873A]" />}
                    <Icon className={classNames('w-[18px] h-[18px] shrink-0', isActive ? 'text-[#7A2E2E]' : 'text-[#9C8E76] group-hover:text-[#5C4F3D]')} />
                    {!collapsed && <span className="truncate">{item.label}</span>}
                    {!collapsed && badgeCount > 0 && (
                      <span className="ml-auto text-[11px] font-semibold bg-[#7A2E2E] text-white rounded-full px-1.5 py-0.5 min-w-[18px] text-center">
                        {badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 border-t border-[#E3D7C0] shrink-0">
        <button onClick={onToggle} className="w-full flex items-center justify-center gap-2 text-[#9C8E76] hover:text-[#42392A] hover:bg-[#F7F3EC] rounded-xl py-2.5 transition-colors">
          {collapsed ? <ChevronRight className="w-4 h-4" /> : (<><ChevronLeft className="w-4 h-4" /><span className="text-xs font-medium">Collapse</span></>)}
        </button>
      </div>
    </aside>
  );
}

/* -------------------------------- Topbar -------------------------------- */

function Topbar({ title, subtitle, onMobileMenu, schoolYearLabel, termLabel, onSchoolYearClick, onOpenApplyForm, currentUser, onLogout }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  return (
    <header className="h-16 shrink-0 bg-white/80 backdrop-blur-md border-b border-[#E3D7C0] flex items-center gap-4 px-4 md:px-6 sticky top-0 z-30">
      <button onClick={onMobileMenu} className="md:hidden text-[#786A55]">
        <Menu className="w-5 h-5" />
      </button>
      <div className="min-w-0 flex items-center gap-2">
        <div className="min-w-0">
          <h1 className="font-serif text-[15px] font-semibold text-[#22190F] truncate">{title}</h1>
          {subtitle && <p className="text-xs text-[#9C8E76] truncate">{subtitle}</p>}
        </div>
        {schoolYearLabel && (
          <button
            onClick={onSchoolYearClick}
            className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F4E7E7] text-[#5E2323] ring-1 ring-inset ring-[#D9B4B4] hover:bg-[#E9D2D2] transition-colors shrink-0"
          >
            <CalendarRange className="w-3.5 h-3.5" /> {schoolYearLabel}
          </button>
        )}
        {termLabel && (
          <button
            onClick={onSchoolYearClick}
            className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-[#F6EEDC] text-[#8A5F24] ring-1 ring-inset ring-[#DFCB9E] hover:bg-[#EBDEC0] transition-colors shrink-0"
          >
            {termLabel}
          </button>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2 md:gap-3">
        <Button variant="ghost" className="hidden md:inline-flex" onClick={onOpenApplyForm}>
          <ExternalLink className="w-3.5 h-3.5" /> Apply Form
        </Button>
        <div className="relative hidden sm:block">
          <Search className="w-4 h-4 text-[#9C8E76] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            placeholder="Quick search…"
            className="w-52 lg:w-64 pl-9 pr-3 py-2 rounded-lg bg-[#EFE6D6] text-sm text-[#42392A] placeholder:text-[#9C8E76] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 focus:bg-white transition-all"
          />
        </div>

        <div className="relative">
          <IconButton onClick={() => setNotifOpen((v) => !v)} className="relative">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
          </IconButton>
          {notifOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl ring-1 ring-[#E3D7C0] p-2 animate-pop-in origin-top-right">
              <p className="text-xs font-semibold text-[#9C8E76] px-2 py-1.5">Notifications</p>
              {ACTIVITY_FEED.slice(0, 3).map((a) => (
                <div key={a.id} className="px-2 py-2 rounded-lg hover:bg-[#F7F3EC] text-sm text-[#5C4F3D]">
                  {a.text}
                  <p className="text-[11px] text-[#9C8E76] mt-0.5">{a.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <IconButton><Settings className="w-[18px] h-[18px]" /></IconButton>

        <div className="w-px h-6 bg-[#E3D7C0] mx-1 hidden sm:block" />

        <div className="relative">
          <button onClick={() => setUserMenuOpen((v) => !v)} className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-[#EFE6D6] transition-colors">
            <Avatar name={currentUser.name} size="w-8 h-8 text-xs" />
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold text-[#42392A] leading-tight">{currentUser.name}</p>
              <p className="text-[11px] text-[#9C8E76] leading-tight">{currentUser.title}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-[#9C8E76] hidden lg:block" />
          </button>
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl ring-1 ring-[#E3D7C0] p-1.5 animate-pop-in origin-top-right">
              <button
                onClick={() => { setUserMenuOpen(false); onLogout(); }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#5C4F3D] hover:bg-[#F7F3EC] hover:text-[#B5482F] transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

/* ------------------------------- KPI Cards ------------------------------ */

function KpiCard({ label, value, delta, icon, tone }) {
  const toneMap = {
    indigo: 'from-[#8C3B3B] to-[#7A2E2E]',
    violet: 'from-[#B8873A] to-[#A6752E]',
    emerald: 'from-emerald-500 to-emerald-600',
    amber: 'from-amber-500 to-amber-600',
  };
  return (
    <div className="bg-white rounded-2xl p-5 ring-1 ring-[#E3D7C0] hover:ring-[#C9B99A] hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={classNames('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center text-white shadow-sm', toneMap[tone])}>
          {icon}
        </div>
        {delta && (
          <span className={classNames(
            'inline-flex items-center gap-0.5 text-xs font-semibold',
            delta.startsWith('-') ? 'text-rose-500' : 'text-emerald-600'
          )}>
            <ArrowUpRight className={classNames('w-3.5 h-3.5', delta.startsWith('-') && 'rotate-90')} />
            {delta}
          </span>
        )}
      </div>
      <p className="text-2xl font-serif font-bold text-[#22190F] tracking-tight">{value}</p>
      <p className="text-sm text-[#9C8E76] mt-0.5">{label}</p>
    </div>
  );
}

/* ------------------------------ Dashboard -------------------------------- */

function DashboardView({ students, applicants, unassignedCount, onNavigate }) {
  const totalEnrolled = students.length;
  const pendingApplications = applicants.filter((a) => !a.rejected && a.stage !== 'Enrolled').length;
  const gradedAttendance = students.map((s) => s.attendance).filter((v) => v != null);
  const gradedGpa = students.map((s) => s.gpa).filter((v) => v != null);
  const avgAttendance = gradedAttendance.length ? Math.round(average(gradedAttendance)) : 0;
  const avgGpa = gradedGpa.length ? average(gradedGpa).toFixed(2) : '—';

  const gradeCounts = [9, 10, 11, 12].map((g) => ({
    grade: g,
    count: students.filter((s) => s.grade === g).length,
  }));
  const maxGradeCount = Math.max(...gradeCounts.map((g) => g.count), 1);
  const maxTrend = Math.max(...ATTENDANCE_TREND.map((t) => t.value));
  const minTrend = Math.min(...ATTENDANCE_TREND.map((t) => t.value));

  const ACTIVITY_ICONS = {
    approve: { icon: <BadgeCheck className="w-4 h-4" />, tone: 'text-emerald-600 bg-emerald-100' },
    enroll: { icon: <UserPlus className="w-4 h-4" />, tone: 'text-[#7A2E2E] bg-[#E9D2D2]' },
    apply: { icon: <ClipboardList className="w-4 h-4" />, tone: 'text-[#A6752E] bg-[#EBDEC0]' },
    review: { icon: <FileText className="w-4 h-4" />, tone: 'text-amber-600 bg-amber-100' },
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1400px] mx-auto">
      {unassignedCount > 0 && (
        <div className="flex items-center gap-3 bg-amber-50 ring-1 ring-amber-100 rounded-2xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
          <p className="text-sm text-amber-700 flex-1">
            {unassignedCount} newly enrolled student{unassignedCount === 1 ? '' : 's'} still need{unassignedCount === 1 ? 's' : ''} a class section.
          </p>
          <Button variant="subtle" onClick={() => onNavigate('matching')}>Go to Matching <ArrowRight className="w-3.5 h-3.5" /></Button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <KpiCard label="Total Enrolled Students" value={totalEnrolled} delta="+4.2%" tone="indigo" icon={<Users className="w-5 h-5" />} />
        <KpiCard label="Pending Applications" value={pendingApplications} delta="+2" tone="violet" icon={<ClipboardList className="w-5 h-5" />} />
        <KpiCard label="Average Attendance Rate" value={`${avgAttendance}%`} delta="-1.3%" tone="emerald" icon={<Activity className="w-5 h-5" />} />
        <KpiCard label="Overall Academic Average" value={avgGpa} delta="+0.1" tone="amber" icon={<Award className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-serif font-semibold text-[#22190F] text-sm">Enrollment by Grade Level</h3>
              <p className="text-xs text-[#9C8E76] mt-0.5">Active headcount across grades 9–12</p>
            </div>
            <Pill tone="indigo">{totalEnrolled} total</Pill>
          </div>
          <div className="flex items-end gap-6 h-44 px-2">
            {gradeCounts.map((g) => (
              <div key={g.grade} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-semibold text-[#786A55]">{g.count}</span>
                <div
                  className="w-full max-w-[56px] rounded-t-lg bg-gradient-to-t from-[#7A2E2E] to-[#B8873A] transition-all duration-500 ease-out"
                  style={{ height: `${(g.count / maxGradeCount) * 100}%`, minHeight: '10%' }}
                />
                <span className="text-xs text-[#9C8E76] font-medium">Grade {g.grade}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5">
          <div className="mb-5">
            <h3 className="font-serif font-semibold text-[#22190F] text-sm">Attendance Trend</h3>
            <p className="text-xs text-[#9C8E76] mt-0.5">Last 6 weeks, school-wide</p>
          </div>
          <div className="flex items-end gap-2 h-32">
            {ATTENDANCE_TREND.map((t) => {
              const h = 20 + ((t.value - minTrend) / Math.max(maxTrend - minTrend, 1)) * 80;
              return (
                <div key={t.label} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <div className="relative w-full flex justify-center">
                    <span className="absolute -top-5 text-[10px] font-semibold text-[#786A55] opacity-0 group-hover:opacity-100 transition-opacity">{t.value}%</span>
                  </div>
                  <div
                    className="w-full max-w-[22px] rounded-t-md bg-emerald-400/80 group-hover:bg-emerald-500 transition-all duration-300"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-[#9C8E76]">{t.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5">
          <h3 className="font-serif font-semibold text-[#22190F] text-sm mb-4">Recent Activity</h3>
          <div className="space-y-1">
            {ACTIVITY_FEED.map((a) => {
              const cfg = ACTIVITY_ICONS[a.icon];
              return (
                <div key={a.id} className="flex items-start gap-3 py-2.5 border-b border-[#EFE6D6] last:border-0">
                  <div className={classNames('w-8 h-8 rounded-full flex items-center justify-center shrink-0', cfg.tone)}>{cfg.icon}</div>
                  <div className="min-w-0">
                    <p className="text-sm text-[#42392A]">{a.text}</p>
                    <p className="text-xs text-[#9C8E76] mt-0.5">{a.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <button onClick={() => onNavigate('admissions')} className="mt-3 text-xs font-semibold text-[#7A2E2E] hover:text-[#5E2323] flex items-center gap-1">
            View admissions pipeline <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-[#1B2333] rounded-2xl p-5 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-[#B8873A]/10" />
          <div className="absolute -bottom-14 -left-8 w-32 h-32 rounded-full bg-white/5" />
          <h3 className="font-serif font-semibold text-white text-sm mb-4 relative">Upcoming Deadlines</h3>
          <div className="space-y-3 relative">
            {UPCOMING_DEADLINES.map((d) => (
              <div key={d.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/10 text-[#D9B36A] flex items-center justify-center shrink-0 ring-1 ring-white/10">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-white/90 leading-tight">{d.label}</p>
                  <p className="text-xs text-[#D9B36A] mt-0.5 font-medium">{d.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------------------- Admissions -------------------------------- */

function ApplicantCard({ applicant, onOpen, onMove }) {
  const idx = STAGES.indexOf(applicant.stage);
  return (
    <div
      onClick={() => onOpen(applicant)}
      className="bg-white rounded-xl ring-1 ring-[#E3D7C0] p-3.5 cursor-pointer hover:ring-[#C99494] hover:shadow-md transition-all duration-150 group"
    >
      <div className="flex items-center gap-2.5 mb-2.5">
        <Avatar name={applicant.name} size="w-8 h-8 text-xs" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#2E2718] truncate">{applicant.name}</p>
          <p className="text-xs text-[#9C8E76]">Grade {applicant.appliedGrade} · {applicant.id}</p>
        </div>
        {applicant.returning && <Pill tone="violet" className="shrink-0">Returning</Pill>}
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {applicant.documents.map((d) => (
          <span key={d.name} className={classNames(
            'w-2 h-2 rounded-full',
            d.status === 'Verified' && 'bg-emerald-400',
            d.status === 'Pending' && 'bg-amber-400',
            d.status === 'Missing' && 'bg-rose-400'
          )} title={`${d.name}: ${d.status}`} />
        ))}
        <span className="text-[11px] text-[#9C8E76] ml-1">{applicant.documents.filter(d=>d.status==='Verified').length}/{applicant.documents.length} docs verified</span>
      </div>
      <div className="flex items-center justify-between pt-2.5 border-t border-[#EFE6D6]">
        <button
          disabled={idx === 0}
          onClick={(e) => { e.stopPropagation(); onMove(applicant.id, -1); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#9C8E76] hover:bg-[#EFE6D6] hover:text-[#42392A] disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[11px] font-medium text-[#9C8E76]">{applicant.submitted}</span>
        <button
          disabled={idx === STAGES.length - 1}
          onClick={(e) => { e.stopPropagation(); onMove(applicant.id, 1); }}
          className="w-6 h-6 rounded-md flex items-center justify-center text-[#8C3B3B] hover:bg-[#F4E7E7] disabled:opacity-25 disabled:pointer-events-none"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

const STAGE_HEADER_TONE = {
  'New Applied': 'bg-[#EFE6D6] text-[#5C4F3D]',
  'Document Review': 'bg-[#F3DDC9] text-[#9C5A24]',
  'Assessment / Interview': 'bg-[#EBDEC0] text-[#8A5F24]',
  'Approved': 'bg-emerald-100 text-emerald-700',
  'Enrolled': 'bg-[#7A2E2E] text-white',
};

function AdmissionsView({ applicants, onOpen, onMove }) {
  const rejectedCount = applicants.filter((a) => a.rejected).length;
  const visible = applicants.filter((a) => !a.rejected);

  return (
    <div className="p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-serif font-semibold text-[#22190F]">Admissions Pipeline</h2>
          <p className="text-xs text-[#9C8E76] mt-0.5">Click the arrows on a card to move it between stages, or open a card for full details.</p>
        </div>
        {rejectedCount > 0 && (
          <Pill tone="rose">{rejectedCount} rejected this cycle</Pill>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {STAGES.map((stage) => {
          const items = visible.filter((a) => a.stage === stage);
          return (
            <div key={stage} className="bg-[#EFE6D6]/60 rounded-2xl p-3 flex flex-col min-h-[420px]">
              <div className={classNames('flex items-center justify-between rounded-lg px-3 py-2 mb-3', STAGE_HEADER_TONE[stage])}>
                <span className="text-xs font-semibold">{stage}</span>
                <span className="text-xs font-bold">{items.length}</span>
              </div>
              <div className="space-y-2.5 flex-1">
                {items.length === 0 && (
                  <div className="text-center py-10 text-xs text-[#9C8E76]">No applicants in this stage</div>
                )}
                {items.map((a) => (
                  <ApplicantCard key={a.id} applicant={a} onOpen={onOpen} onMove={onMove} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicantDrawer({ applicant, students, onClose, onApprove, onReject }) {
  if (!applicant) return null;
  const idx = STAGES.indexOf(applicant.stage);
  const verifiedCount = applicant.documents.filter((d) => d.status === 'Verified').length;
  const linkedStudent = applicant.returning ? students.find((s) => s.id === applicant.linkedStudentId) : null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#22190F]/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-5 border-b border-[#EFE6D6] flex items-start gap-3">
          <Avatar name={applicant.name} size="w-12 h-12" />
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-semibold text-[#22190F]">{applicant.name}</h3>
            <p className="text-xs text-[#9C8E76]">{applicant.id} · Applying for Grade {applicant.appliedGrade}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone="indigo">{applicant.stage}</Pill>
              {applicant.returning && <Pill tone="violet">Returning Student</Pill>}
            </div>
          </div>
          <IconButton onClick={onClose}><X className="w-4 h-4" /></IconButton>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {applicant.returning && (
            <div className="flex items-center gap-3 bg-[#F6EEDC] ring-1 ring-[#EBDEC0] rounded-xl p-3.5">
              <RotateCcw className="w-4 h-4 text-[#B8873A] shrink-0" />
              <p className="text-sm text-[#8A5F24]">
                Re-enrollment application{linkedStudent ? <> for existing student <span className="font-semibold">{linkedStudent.name}</span> ({linkedStudent.id})</> : ''}.
              </p>
            </div>
          )}
          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Guardian & Contact</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Users className="w-4 h-4 text-[#9C8E76]" /> {applicant.guardian}</div>
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Phone className="w-4 h-4 text-[#9C8E76]" /> {applicant.phone}</div>
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Mail className="w-4 h-4 text-[#9C8E76]" /> {applicant.email}</div>
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><CalendarDays className="w-4 h-4 text-[#9C8E76]" /> Submitted {applicant.submitted}</div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide">Submitted Documents</h4>
              <span className="text-xs text-[#9C8E76]">{verifiedCount}/{applicant.documents.length} verified</span>
            </div>
            <div className="space-y-2">
              {applicant.documents.map((d) => (
                <div key={d.name} className="flex items-center justify-between bg-[#F7F3EC] rounded-lg px-3 py-2.5">
                  <div className="flex items-center gap-2.5 text-sm text-[#42392A]">
                    <FileText className="w-4 h-4 text-[#9C8E76]" /> {d.name}
                  </div>
                  <DocStatusPill status={d.status} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Pipeline Progress</h4>
            <div className="flex items-center">
              {STAGES.map((s, i) => (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className={classNames(
                      'w-3 h-3 rounded-full',
                      i < idx ? 'bg-[#7A2E2E]' : i === idx ? 'bg-[#7A2E2E] ring-4 ring-[#E9D2D2]' : 'bg-[#E3D7C0]'
                    )} />
                  </div>
                  {i < STAGES.length - 1 && (
                    <div className={classNames('flex-1 h-0.5', i < idx ? 'bg-[#7A2E2E]' : 'bg-[#E3D7C0]')} />
                  )}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-[#9C8E76] mt-2">{applicant.stage}</p>
          </div>
        </div>

        {applicant.rejected ? (
          <div className="p-5 border-t border-[#EFE6D6]">
            <Pill tone="rose" className="w-full justify-center py-2.5">Application Rejected</Pill>
          </div>
        ) : (
          <div className="p-5 border-t border-[#EFE6D6] flex gap-3">
            <Button variant="danger" className="flex-1" onClick={() => onReject(applicant.id)}>
              <XCircle className="w-4 h-4" /> Reject
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={idx === STAGES.length - 1}
              onClick={() => onApprove(applicant.id)}
            >
              <Check className="w-4 h-4" /> Approve{idx < STAGES.length - 1 ? ` → ${STAGES[idx + 1]}` : ''}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------- Student Directory ---------------------------- */

function StudentSlideOver({ student, sections, instructors, curriculum, offerings, onViewReportCard, onClose }) {
  if (!student) return null;
  const section = sections.find((sec) => sec.id === student.sectionId) || null;
  const adviser = section ? instructors.find((i) => i.id === section.adviserId) : null;
  const subjectsForGrade = curriculum[student.grade] || [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-[#22190F]/30 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-in-right">
        <div className="p-5 border-b border-[#EFE6D6] flex items-start gap-3">
          <Avatar name={student.name} size="w-14 h-14 text-lg" />
          <div className="min-w-0 flex-1">
            <h3 className="font-serif font-semibold text-[#22190F]">{student.name}</h3>
            <p className="text-xs text-[#9C8E76]">{student.id} · Grade {student.grade}</p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Pill tone={student.status === 'Active' ? 'emerald' : 'amber'}>
                <CircleDot className="w-3 h-3" /> {student.status}
              </Pill>
              {student.tags.map((t) => <Pill key={t} tone="indigo">{t}</Pill>)}
            </div>
          </div>
          <IconButton onClick={onClose}><X className="w-4 h-4" /></IconButton>
        </div>

        <div className="px-5 pt-4">
          <Button variant="subtle" className="w-full" onClick={() => onViewReportCard(student.id)}>
            <FileText className="w-4 h-4" /> View Report Card
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#F7F3EC] rounded-xl p-3.5">
              <p className="text-xs text-[#9C8E76] mb-1">Attendance</p>
              <p className="text-xl font-bold text-[#22190F]">{student.attendance != null ? `${student.attendance}%` : '—'}</p>
              <div className="w-full h-1.5 bg-[#E3D7C0] rounded-full mt-2 overflow-hidden">
                <div className={classNames('h-full rounded-full', student.attendance >= 90 ? 'bg-emerald-500' : student.attendance >= 80 ? 'bg-amber-500' : 'bg-rose-500')} style={{ width: `${student.attendance || 0}%` }} />
              </div>
            </div>
            <div className="bg-[#F7F3EC] rounded-xl p-3.5">
              <p className="text-xs text-[#9C8E76] mb-1">Current GPA</p>
              <p className="text-xl font-bold text-[#22190F]">{student.gpa != null ? student.gpa.toFixed(1) : '—'}</p>
              <div className="w-full h-1.5 bg-[#E3D7C0] rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full bg-[#8C3B3B]" style={{ width: `${student.gpa != null ? (student.gpa / 4) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Class Section</h4>
            {section ? (
              <div className="bg-[#F7F3EC] rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#42392A]">{section.name}</p>
                  <p className="text-xs text-[#9C8E76]">Adviser: {adviser ? adviser.name : '—'}</p>
                </div>
                <Pill tone="indigo">Grade {student.grade}</Pill>
              </div>
            ) : (
              <div className="flex items-center gap-3 bg-amber-50 rounded-xl p-3.5 ring-1 ring-amber-100">
                <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-sm text-amber-700">Not yet assigned to a class section.</p>
              </div>
            )}
          </div>

          {section && subjectsForGrade.length > 0 && (
            <div>
              <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Subjects & Instructors</h4>
              <div className="space-y-2">
                {subjectsForGrade.map((subj) => {
                  const offering = offerings.find((o) => o.sectionId === section.id && o.subjectId === subj);
                  const instructor = offering ? instructors.find((i) => i.id === offering.instructorId) : null;
                  return (
                    <div key={subj} className="flex items-center justify-between bg-[#F7F3EC] rounded-lg px-3 py-2">
                      <span className="text-sm text-[#42392A]">{subj}</span>
                      <span className="text-xs text-[#9C8E76]">{instructor ? instructor.name : 'Unassigned'}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Contact Information</h4>
            <div className="space-y-2.5">
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Phone className="w-4 h-4 text-[#9C8E76]" /> {student.phone}</div>
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Mail className="w-4 h-4 text-[#9C8E76]" /> {student.email}</div>
              <div className="flex items-center gap-3 text-sm text-[#5C4F3D]"><Home className="w-4 h-4 text-[#9C8E76]" /> {student.address}</div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Guardian</h4>
            <div className="flex items-center gap-3 bg-[#F7F3EC] rounded-xl p-3.5">
              <Avatar name={student.guardian} size="w-9 h-9 text-xs" />
              <div>
                <p className="text-sm font-medium text-[#42392A]">{student.guardian}</p>
                <p className="text-xs text-[#9C8E76]">{student.relation} · Primary contact</p>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Health Notes</h4>
            <div className="flex items-start gap-3 bg-[#F7F3EC] rounded-xl p-3.5">
              <HeartPulse className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <p className="text-sm text-[#5C4F3D]">{student.health}</p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Disciplinary Notes</h4>
            <div className="flex items-start gap-3 bg-[#F7F3EC] rounded-xl p-3.5">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="text-sm text-[#5C4F3D]">{student.disciplinary}</p>
            </div>
          </div>

          <p className="text-xs text-[#9C8E76]">Enrolled since {student.enrolled}</p>
        </div>
      </div>
    </div>
  );
}

function StudentsView({ students, sections, onOpen }) {
  const [query, setQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = useMemo(() => {
    return students.filter((s) => {
      const matchesQuery = (s.name + s.id).toLowerCase().includes(query.toLowerCase());
      const matchesGrade = gradeFilter === 'All' || s.grade === Number(gradeFilter);
      const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
      return matchesQuery && matchesGrade && matchesStatus;
    });
  }, [students, query, gradeFilter, statusFilter]);

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
        <div className="p-4 md:p-5 flex flex-col sm:flex-row gap-3 border-b border-[#EFE6D6]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#9C8E76] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or student ID…"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-[#EFE6D6] text-sm text-[#42392A] placeholder:text-[#9C8E76] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 focus:bg-white transition-all"
            />
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={gradeFilter}
                onChange={(e) => setGradeFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-[#EFE6D6] text-sm text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 cursor-pointer"
              >
                <option value="All">All Grades</option>
                {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9C8E76] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-[#EFE6D6] text-sm text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="Active">Active</option>
                <option value="On Leave">On Leave</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9C8E76] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Frown className="w-6 h-6" />}
            title="No students match your search"
            subtitle="Try adjusting the search term or clearing a filter."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                  <th className="py-3 px-5 font-medium">Student</th>
                  <th className="py-3 px-5 font-medium">Grade</th>
                  <th className="py-3 px-5 font-medium">Section</th>
                  <th className="py-3 px-5 font-medium">Status</th>
                  <th className="py-3 px-5 font-medium">Attendance</th>
                  <th className="py-3 px-5 font-medium">GPA</th>
                  <th className="py-3 px-5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const section = sections.find((sec) => sec.id === s.sectionId);
                  return (
                    <tr
                      key={s.id}
                      onClick={() => onOpen(s)}
                      className="border-b border-[#F7F3EC] last:border-0 hover:bg-[#F4E7E7]/40 cursor-pointer transition-colors group"
                    >
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-3">
                          <Avatar name={s.name} size="w-9 h-9 text-xs" />
                          <div className="min-w-0">
                            <p className="font-medium text-[#2E2718] truncate">{s.name}</p>
                            <p className="text-xs text-[#9C8E76]">{s.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-5 text-[#5C4F3D]">Grade {s.grade}</td>
                      <td className="py-3 px-5 text-[#5C4F3D]">
                        {section ? section.name : <Pill tone="amber">Unassigned</Pill>}
                      </td>
                      <td className="py-3 px-5">
                        <Pill tone={s.status === 'Active' ? 'emerald' : 'amber'}>{s.status}</Pill>
                      </td>
                      <td className="py-3 px-5 text-[#5C4F3D]">{s.attendance != null ? `${s.attendance}%` : '—'}</td>
                      <td className="py-3 px-5 text-[#5C4F3D]">{s.gpa != null ? s.gpa.toFixed(1) : '—'}</td>
                      <td className="py-3 px-5 text-right">
                        <ChevronRight className="w-4 h-4 text-[#C9B99A] group-hover:text-[#8C3B3B] inline-block transition-colors" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <div className="px-5 py-3 border-t border-[#EFE6D6] text-xs text-[#9C8E76]">
          Showing {filtered.length} of {students.length} students
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Grading Criteria Modal ------------------------ */

function GradingCriteriaModal({
  subject, categories, onClose,
  onAddCategory, onUpdateCategory, onDeleteCategory, onAddItem, onUpdateItem, onDeleteItem,
}) {
  const weightSum = totalWeight(categories);
  const balanced = weightSum === 100;

  return (
    <Modal
      title={`Grading Criteria — ${subject}`}
      size="xl"
      onClose={onClose}
      footer={<Button variant="primary" className="w-full" onClick={onClose}>Done</Button>}
    >
      <div className={classNames(
        'flex items-center gap-3 rounded-xl px-4 py-3 ring-1',
        balanced ? 'bg-[#E3EEE6] ring-[#C7DFCD]' : 'bg-[#FBE7DD] ring-[#F0C7B2]'
      )}>
        {balanced ? <Check className="w-4 h-4 text-[#3F7A52] shrink-0" /> : <AlertCircle className="w-4 h-4 text-[#B5482F] shrink-0" />}
        <p className={classNames('text-sm', balanced ? 'text-[#3F7A52]' : 'text-[#B5482F]')}>
          Category weights total <span className="font-semibold">{weightSum}%</span>
          {balanced ? ' — balanced.' : ' — should add up to 100% for a true 0–100 grade.'}
        </p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.id} className="rounded-xl ring-1 ring-[#EFE6D6] bg-[#F7F3EC]/60 p-3.5">
            <div className="flex items-center gap-2 mb-3">
              <input
                value={cat.name}
                onChange={(e) => onUpdateCategory(cat.id, { name: e.target.value })}
                className="flex-1 min-w-0 px-2.5 py-1.5 rounded-lg bg-white ring-1 ring-[#E3D7C0] text-sm font-medium text-[#2E2718] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={cat.weight}
                  onChange={(e) => onUpdateCategory(cat.id, { weight: e.target.value === '' ? '' : Number(e.target.value) })}
                  className="w-16 text-center px-2 py-1.5 rounded-lg bg-white ring-1 ring-[#E3D7C0] text-sm text-[#2E2718] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                />
                <span className="text-sm text-[#9C8E76]">%</span>
              </div>
              <IconButton onClick={() => onDeleteCategory(cat.id)} className="hover:text-[#B5482F] hover:bg-[#FBE7DD] shrink-0">
                <Trash2 className="w-4 h-4" />
              </IconButton>
            </div>

            <div className="space-y-1.5 pl-1">
              {cat.items.map((item) => (
                <div key={item.id} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#C9B99A] shrink-0" />
                  <input
                    value={item.label}
                    onChange={(e) => onUpdateItem(cat.id, item.id, { label: e.target.value })}
                    className="flex-1 min-w-0 px-2.5 py-1 rounded-md bg-white ring-1 ring-[#EFE6D6] text-xs text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                  />
                  <span className="text-xs text-[#9C8E76] shrink-0">out of</span>
                  <input
                    type="number"
                    min="1"
                    value={item.maxScore}
                    onChange={(e) => onUpdateItem(cat.id, item.id, { maxScore: e.target.value === '' ? '' : Number(e.target.value) })}
                    className="w-16 text-center px-2 py-1 rounded-md bg-white ring-1 ring-[#EFE6D6] text-xs text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                  />
                  <IconButton
                    onClick={() => onDeleteItem(cat.id, item.id)}
                    className="w-6 h-6 hover:text-[#B5482F] hover:bg-[#FBE7DD] shrink-0"
                    disabled={cat.items.length <= 1}
                  >
                    <X className="w-3 h-3" />
                  </IconButton>
                </div>
              ))}
              <button
                onClick={() => onAddItem(cat.id)}
                className="text-xs font-medium text-[#7A2E2E] hover:text-[#5E2323] flex items-center gap-1 mt-1.5"
              >
                <Plus className="w-3 h-3" /> Add item to {cat.name}
              </button>
            </div>
          </div>
        ))}

        <Button variant="subtle" onClick={onAddCategory}>
          <Plus className="w-4 h-4" /> Add Category
        </Button>
      </div>
    </Modal>
  );
}

/* --------------------------- Academic / Gradebook ------------------------- */

function AcademicView({
  students, sections, curriculum, offerings, instructors, subjects, activeTermLabel,
  terms, activeTermId,
  criteria, scores, onUpdateScore, canEditCriteria = true,
  onAddCategory, onUpdateCategory, onDeleteCategory, onAddItem, onUpdateItem, onDeleteItem,
}) {
  const [subject, setSubject] = useState(subjects[0]?.name || '');
  const [selectedTermId, setSelectedTermId] = useState(activeTermId || terms[0]?.id || '');
  const [selectedSectionId, setSelectedSectionId] = useState(sections[0]?.id || '');
  const [day, setDay] = useState('Monday');
  const [criteriaModalOpen, setCriteriaModalOpen] = useState(false);

  useEffect(() => {
    if (!sections.find((s) => s.id === selectedSectionId)) {
      setSelectedSectionId(sections[0]?.id || '');
    }
  }, [sections]);

  useEffect(() => {
    if (subjects.length && !subjects.find((s) => s.name === subject)) {
      setSubject(subjects[0].name);
    }
  }, [subjects]);

  useEffect(() => {
    if (!terms.find((t) => t.id === selectedTermId)) {
      setSelectedTermId(activeTermId || terms[0]?.id || '');
    }
  }, [terms, activeTermId]);

  const gradeLevelsForSubject = useMemo(() => {
    return Object.keys(curriculum).filter((g) => (curriculum[g] || []).includes(subject)).map(Number);
  }, [curriculum, subject]);

  const subjectCategories = criteria[subject] || [];
  const weightSum = totalWeight(subjectCategories);
  const termScores = (scores[subject] && scores[subject][selectedTermId]) || {};

  const rows = useMemo(() => {
    return students
      .filter((s) => {
        const section = sections.find((sec) => sec.id === s.sectionId);
        const grade = section ? section.grade : s.grade;
        return gradeLevelsForSubject.includes(grade);
      })
      .map((s) => {
        const studentScores = termScores[s.id] || {};
        const avg = overallGrade(subjectCategories, studentScores);
        const status = avg != null ? gradeStatus(avg) : { label: 'Incomplete', tone: 'slate' };
        return { student: s, studentScores, avg, status };
      })
      .sort((a, b) => (b.avg ?? -1) - (a.avg ?? -1));
  }, [students, subject, sections, gradeLevelsForSubject, termScores, subjectCategories]);

  const gradedRows = rows.filter((r) => r.avg != null);
  const classAverage = gradedRows.length ? average(gradedRows.map((r) => r.avg)) : null;

  const activeSection = sections.find((s) => s.id === selectedSectionId) || null;
  const activeSubjectsForGrade = activeSection ? (curriculum[activeSection.grade] || []) : [];
  const timetable = activeSection && activeSubjectsForGrade.length
    ? buildTimetable(activeSection, activeSubjectsForGrade, offerings, instructors, sectionOffsetFor(activeSection, sections))
    : null;

  return (
    <div className="p-4 md:p-6 max-w-[1400px] mx-auto space-y-4">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
        <div className="p-4 md:p-5 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-[#EFE6D6]">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-semibold text-[#22190F]">Gradebook</h2>
              {activeTermLabel && <Pill tone="violet">{activeTermLabel}</Pill>}
            </div>
            <p className="text-xs text-[#9C8E76] mt-0.5 truncate">
              {subjectCategories.length > 0
                ? subjectCategories.map((c) => `${c.name} ${c.weight}%`).join(' · ')
                : 'No grading criteria set up yet'}
            </p>
          </div>
          <div className="sm:ml-auto flex items-center gap-3 flex-wrap">
            <span className="text-xs text-[#9C8E76] hidden sm:inline">Class average</span>
            <Pill tone="indigo">{classAverage != null ? classAverage.toFixed(1) : '—'}</Pill>
            {rows.length > 0 && subjectCategories.length > 0 && (
              <IconButton
                title="Export this gradebook as CSV"
                onClick={() => {
                  const termLabel = terms.find((t) => t.id === selectedTermId)?.label || 'Term';
                  const header = ['Student', 'Student ID', 'Grade', ...subjectCategories.flatMap((c) => c.items.map((it) => `${c.name}: ${it.label} (/${it.maxScore})`)), 'Overall', 'Status'];
                  const body = rows.map(({ student, studentScores, avg, status }) => [
                    student.name, student.id, student.grade,
                    ...subjectCategories.flatMap((c) => c.items.map((it) => studentScores[it.id] ?? '')),
                    avg != null ? avg.toFixed(1) : '',
                    status.label,
                  ]);
                  downloadCSV(`${subject}-${termLabel}-gradebook.csv`.replace(/\s+/g, '-'), [header, ...body]);
                }}
              >
                <Download className="w-4 h-4" />
              </IconButton>
            )}
            {canEditCriteria && (
              <Button variant="ghost" onClick={() => setCriteriaModalOpen(true)} className="relative">
                <SlidersHorizontal className="w-3.5 h-3.5" /> Grading Criteria
                {subjectCategories.length > 0 && weightSum !== 100 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#B5482F] ring-2 ring-white" title={`Weights total ${weightSum}%`} />
                )}
              </Button>
            )}
            {terms.length > 0 && (
              <div className="relative">
                <select
                  value={selectedTermId}
                  onChange={(e) => setSelectedTermId(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-[#EFE6D6] text-sm font-medium text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 cursor-pointer"
                >
                  {terms.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-[#9C8E76] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            )}
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2.5 rounded-lg bg-[#EFE6D6] text-sm font-medium text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 cursor-pointer"
              >
                {subjects.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-[#9C8E76] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {subjectCategories.length === 0 ? (
          <EmptyState
            icon={<SlidersHorizontal className="w-6 h-6" />}
            title="No grading criteria yet"
            subtitle={`Set up categories and weights for ${subject} to start recording grades.`}
          />
        ) : rows.length === 0 ? (
          <EmptyState
            icon={<BookOpen className="w-6 h-6" />}
            title="No students in this subject yet"
            subtitle={gradeLevelsForSubject.length ? `Place students into a Grade ${gradeLevelsForSubject.join('/')} section from Matching.` : `Add ${subject} to a grade's curriculum first.`}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                  <th rowSpan={2} className="py-3 px-5 font-medium align-bottom">Student</th>
                  {subjectCategories.map((cat) => (
                    <th key={cat.id} colSpan={cat.items.length + 1} className="py-2 px-3 font-medium text-center border-l border-[#EFE6D6] whitespace-nowrap">
                      {cat.name} <span className="text-[#C9B99A]">· {cat.weight}%</span>
                    </th>
                  ))}
                  <th rowSpan={2} className="py-3 px-5 font-medium align-bottom">Overall</th>
                  <th rowSpan={2} className="py-3 px-5 font-medium align-bottom">Status</th>
                </tr>
                <tr className="text-left text-[10px] text-[#C9B99A] uppercase border-b border-[#EFE6D6]">
                  {subjectCategories.map((cat) => (
                    <React.Fragment key={cat.id}>
                      {cat.items.map((item) => (
                        <th key={item.id} className="py-2 px-2 font-medium text-center border-l border-[#EFE6D6] whitespace-nowrap normal-case">
                          {item.label}<span className="block text-[#DDCFB3]">/{item.maxScore}</span>
                        </th>
                      ))}
                      <th className="py-2 px-2 font-medium text-center bg-[#F7F3EC]">Avg</th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map(({ student, studentScores, avg, status }) => (
                  <tr key={student.id} className="border-b border-[#F7F3EC] last:border-0 hover:bg-[#F7F3EC]/60 transition-colors">
                    <td className="py-2 px-5">
                      <div className="flex items-center gap-3">
                        <Avatar name={student.name} size="w-8 h-8 text-xs" />
                        <div className="min-w-0">
                          <p className="font-medium text-[#2E2718] truncate">{student.name}</p>
                          <p className="text-xs text-[#9C8E76]">Grade {student.grade}</p>
                        </div>
                      </div>
                    </td>
                    {subjectCategories.map((cat) => {
                      const pct = categoryPercent(cat, studentScores);
                      return (
                        <React.Fragment key={cat.id}>
                          {cat.items.map((item) => (
                            <td key={item.id} className="py-2 px-2 border-l border-[#EFE6D6] text-center">
                              <input
                                type="number"
                                min="0"
                                max={item.maxScore}
                                value={studentScores[item.id] ?? ''}
                                onChange={(e) => onUpdateScore(subject, selectedTermId, student.id, item.id, e.target.value)}
                                placeholder="—"
                                className="w-14 text-center px-1 py-1 rounded-md bg-[#F7F3EC] text-[#42392A] text-sm focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-2 text-center text-xs font-medium text-[#786A55] bg-[#F7F3EC]/60">
                            {pct != null ? pct.toFixed(0) : '—'}
                          </td>
                        </React.Fragment>
                      );
                    })}
                    <td className="py-2 px-5 font-semibold text-[#2E2718]">{avg != null ? avg.toFixed(1) : '—'}</td>
                    <td className="py-2 px-5"><Pill tone={status.tone}>{status.label}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {criteriaModalOpen && (
        <GradingCriteriaModal
          subject={subject}
          categories={subjectCategories}
          onClose={() => setCriteriaModalOpen(false)}
          onAddCategory={() => onAddCategory(subject)}
          onUpdateCategory={(catId, data) => onUpdateCategory(subject, catId, data)}
          onDeleteCategory={(catId) => onDeleteCategory(subject, catId)}
          onAddItem={(catId) => onAddItem(subject, catId)}
          onUpdateItem={(catId, itemId, data) => onUpdateItem(subject, catId, itemId, data)}
          onDeleteItem={(catId, itemId) => onDeleteItem(subject, catId, itemId)}
        />
      )}

      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4 md:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-serif font-semibold text-[#22190F] text-sm">Class Timetable</h3>
            <p className="text-xs text-[#9C8E76] mt-0.5">Generated from curriculum and teaching assignments</p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {sections.length > 0 && (
              <select
                value={selectedSectionId}
                onChange={(e) => setSelectedSectionId(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[#EFE6D6] text-xs font-medium text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
              >
                {sections.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            )}
            <div className="flex gap-1 bg-[#EFE6D6] rounded-lg p-1">
              {WEEKDAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setDay(d)}
                  className={classNames(
                    'px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
                    day === d ? 'bg-white text-[#5E2323] shadow-sm' : 'text-[#786A55] hover:text-[#42392A]'
                  )}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!activeSection ? (
          <EmptyState icon={<CalendarRange className="w-6 h-6" />} title="No class section yet" subtitle="Create a class section to generate a timetable." />
        ) : activeSubjectsForGrade.length === 0 ? (
          <EmptyState icon={<Layers className="w-6 h-6" />} title="No curriculum assigned" subtitle={`Add subjects to the Grade ${activeSection.grade} curriculum to build a timetable.`} />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {timetable[day].map((p) => (
              <div key={p.period} className="rounded-xl ring-1 ring-[#EFE6D6] bg-[#F7F3EC] p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-semibold text-[#7A2E2E]">Period {p.period}</span>
                  <Clock className="w-3 h-3 text-[#C9B99A]" />
                </div>
                <p className="text-sm font-semibold text-[#2E2718] leading-tight">{p.subject}</p>
                <p className="text-[11px] text-[#9C8E76] mt-1">{p.time}</p>
                <p className="text-[11px] text-[#9C8E76]">{p.teacher}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ----------------------------- Setup Modals ------------------------------- */

function InstructorFormModal({ subjectCatalog, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '');
  const [email, setEmail] = useState(initial?.email || '');
  const [phone, setPhone] = useState(initial?.phone || '');
  const [employment, setEmployment] = useState(initial?.employment || 'Full-time');
  const [selectedSubjects, setSelectedSubjects] = useState(initial?.subjects || []);

  const toggleSubject = (s) => {
    setSelectedSubjects((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  };

  const valid = name.trim() && selectedSubjects.length > 0;

  return (
    <Modal
      title={initial ? 'Edit Instructor' : 'Add Instructor'}
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!valid}
            onClick={() => onSave({ name: name.trim(), email: email.trim(), phone: phone.trim(), employment, subjects: selectedSubjects })}
          >
            {initial ? <><Check className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Add Instructor</>}
          </Button>
        </>
      )}
    >
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Full Name</label>
        <input className={INPUT_CLS} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ms. Jane Ibarra" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Email</label>
          <input className={INPUT_CLS} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@nba.edu" />
        </div>
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Phone</label>
          <input className={INPUT_CLS} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(555) 000-0000" />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Employment Type</label>
        <select className={INPUT_CLS} value={employment} onChange={(e) => setEmployment(e.target.value)}>
          <option>Full-time</option>
          <option>Part-time</option>
        </select>
      </div>
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Subjects Qualified to Teach</label>
        <div className="flex flex-wrap gap-2">
          {subjectCatalog.map((s) => (
            <button
              type="button"
              key={s.name}
              onClick={() => toggleSubject(s.name)}
              className={classNames(
                'px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset transition-colors',
                selectedSubjects.includes(s.name) ? 'bg-[#7A2E2E] text-white ring-[#7A2E2E]' : 'bg-white text-[#5C4F3D] ring-[#E3D7C0] hover:ring-[#C99494]'
              )}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </Modal>
  );
}

function SchoolYearFormModal({ onClose, onSave }) {
  const [label, setLabel] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const valid = label.trim() && start && end;

  return (
    <Modal
      title="Create School Year"
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" disabled={!valid} onClick={() => onSave({ label: label.trim(), start, end })}>
            <Plus className="w-4 h-4" /> Create
          </Button>
        </>
      )}
    >
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Label</label>
        <input className={INPUT_CLS} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. SY 2027–2028" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Start Date</label>
          <input type="date" className={INPUT_CLS} value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">End Date</label>
          <input type="date" className={INPUT_CLS} value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

function TermFormModal({ onClose, onSave }) {
  const [label, setLabel] = useState('');
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const valid = label.trim() && start && end;

  return (
    <Modal
      title="Add Term"
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" disabled={!valid} onClick={() => onSave({ label: label.trim(), start, end })}>
            <Plus className="w-4 h-4" /> Add Term
          </Button>
        </>
      )}
    >
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Term Label</label>
        <input className={INPUT_CLS} value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Semester 1, Trimester 2, Quarter 3" />
        <p className="text-xs text-[#9C8E76] mt-1.5">A school year can have as many terms as it needs — 2 semesters, 3 trimesters, 4 quarters, and so on.</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Start Date</label>
          <input type="date" className={INPUT_CLS} value={start} onChange={(e) => setStart(e.target.value)} />
        </div>
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">End Date</label>
          <input type="date" className={INPUT_CLS} value={end} onChange={(e) => setEnd(e.target.value)} />
        </div>
      </div>
    </Modal>
  );
}

function SectionFormModal({ instructors, initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '');
  const [grade, setGrade] = useState(String(initial?.grade || '9'));
  const [adviserId, setAdviserId] = useState(initial?.adviserId || instructors[0]?.id || '');
  const [capacity, setCapacity] = useState(String(initial?.capacity ?? '30'));
  const valid = name.trim() && adviserId;

  return (
    <Modal
      title={initial ? 'Edit Section' : 'Add Section'}
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            variant="primary"
            className="flex-1"
            disabled={!valid}
            onClick={() => onSave({ name: name.trim(), grade, adviserId, capacity })}
          >
            {initial ? <><Check className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Add Section</>}
          </Button>
        </>
      )}
    >
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Section Name</label>
        <input className={INPUT_CLS} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Grade 9 – Aurora" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Grade Level</label>
          <select className={INPUT_CLS} value={grade} onChange={(e) => setGrade(e.target.value)}>
            {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Capacity</label>
          <input type="number" min="1" className={INPUT_CLS} value={capacity} onChange={(e) => setCapacity(e.target.value)} />
        </div>
      </div>
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Adviser</label>
        <select className={INPUT_CLS} value={adviserId} onChange={(e) => setAdviserId(e.target.value)}>
          {instructors.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
        </select>
      </div>
    </Modal>
  );
}

function SubjectFormModal({ initial, onClose, onSave }) {
  const [name, setName] = useState(initial?.name || '');
  const [units, setUnits] = useState(String(initial?.units ?? '1'));
  const valid = name.trim();

  return (
    <Modal
      title={initial ? 'Edit Subject' : 'Add Subject'}
      onClose={onClose}
      footer={(
        <>
          <Button variant="ghost" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button variant="primary" className="flex-1" disabled={!valid} onClick={() => onSave({ name: name.trim(), units })}>
            {initial ? <><Check className="w-4 h-4" /> Save Changes</> : <><Plus className="w-4 h-4" /> Add Subject</>}
          </Button>
        </>
      )}
    >
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Subject Name</label>
        <input
          className={classNames(INPUT_CLS, !!initial && 'opacity-60 cursor-not-allowed')}
          value={name}
          onChange={(e) => !initial && setName(e.target.value)}
          placeholder="e.g. Computer Science"
          readOnly={!!initial}
        />
        {initial && <p className="text-xs text-[#9C8E76] mt-1.5">To rename a subject, remove it from every grade's curriculum, delete it, then add it again with the new name.</p>}
      </div>
      <div>
        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Units</label>
        <input type="number" step="0.5" min="0.5" className={INPUT_CLS} value={units} onChange={(e) => setUnits(e.target.value)} />
      </div>
    </Modal>
  );
}

/* ---------------------------- Instructors View ---------------------------- */

function InstructorsView({ instructors, subjects, onAdd, onEdit }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-4">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-[#EFE6D6]">
          <div>
            <h2 className="font-serif font-semibold text-[#22190F]">Faculty Roster</h2>
            <p className="text-xs text-[#9C8E76] mt-0.5">{instructors.length} instructors on record</p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Add Instructor</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                <th className="py-3 px-5 font-medium">Instructor</th>
                <th className="py-3 px-5 font-medium">Employment</th>
                <th className="py-3 px-5 font-medium">Subjects Qualified</th>
                <th className="py-3 px-5 font-medium">Contact</th>
                <th className="py-3 px-5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {instructors.map((i) => (
                <tr key={i.id} className="border-b border-[#F7F3EC] last:border-0 hover:bg-[#F7F3EC]/60 transition-colors">
                  <td className="py-3 px-5">
                    <div className="flex items-center gap-3">
                      <Avatar name={i.name} size="w-9 h-9 text-xs" />
                      <div className="min-w-0">
                        <p className="font-medium text-[#2E2718] truncate">{i.name}</p>
                        <p className="text-xs text-[#9C8E76]">{i.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-5"><Pill tone={i.employment === 'Full-time' ? 'indigo' : 'slate'}>{i.employment}</Pill></td>
                  <td className="py-3 px-5">
                    <div className="flex flex-wrap gap-1.5">
                      {i.subjects.map((s) => <Pill key={s} tone="violet">{s}</Pill>)}
                    </div>
                  </td>
                  <td className="py-3 px-5 text-[#786A55]">
                    <p>{i.email}</p>
                    <p className="text-xs text-[#9C8E76]">{i.phone}</p>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <IconButton onClick={() => setEditing(i)} title="Edit subjects & details">
                      <Pencil className="w-4 h-4" />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {modalOpen && (
        <InstructorFormModal
          subjectCatalog={subjects}
          onClose={() => setModalOpen(false)}
          onSave={(data) => { onAdd(data); setModalOpen(false); }}
        />
      )}
      {editing && (
        <InstructorFormModal
          subjectCatalog={subjects}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => { onEdit(editing.id, data); setEditing(null); }}
        />
      )}
    </div>
  );
}

/* ---------------------------- School Year View ---------------------------- */

function SchoolYearView({ schoolYears, activeSchoolYearId, activeTermId, onAdd, onSetActive, onDelete, onAddTerm, onSetActiveTerm, onDeleteTerm }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [termModalYearId, setTermModalYearId] = useState(null);

  return (
    <div className="p-4 md:p-6 max-w-[1000px] mx-auto space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif font-semibold text-[#22190F]">Academic Years</h2>
          <p className="text-xs text-[#9C8E76] mt-0.5">One school year is active at a time and drives sections, matching, and grading. Each year can be split into as many terms as it needs.</p>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Create School Year</Button>
      </div>

      <div className="space-y-4">
        {schoolYears.map((y) => {
          const isActiveYear = y.id === activeSchoolYearId;
          return (
            <div key={y.id} className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
              <div className="p-4 md:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-[#EFE6D6]">
                <div>
                  <div className="flex items-center gap-2.5">
                    <p className="font-semibold text-[#22190F]">{y.label}</p>
                    <Pill tone={y.status === 'Active' ? 'emerald' : y.status === 'Draft' ? 'amber' : 'slate'}>{y.status}</Pill>
                  </div>
                  <p className="text-xs text-[#9C8E76] mt-0.5">{y.start} – {y.end}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="subtle" onClick={() => setTermModalYearId(y.id)}><Plus className="w-3.5 h-3.5" /> Add Term</Button>
                  {!isActiveYear && (
                    <>
                      <Button variant="ghost" onClick={() => onSetActive(y.id)}>Set Active</Button>
                      <IconButton onClick={() => onDelete(y.id)} title="Delete school year" className="hover:text-[#B5482F] hover:bg-[#FBE7DD]">
                        <Trash2 className="w-4 h-4" />
                      </IconButton>
                    </>
                  )}
                </div>
              </div>
              <div className="p-4 md:p-5">
                {y.terms.length === 0 ? (
                  <p className="text-xs text-[#9C8E76]">No terms defined yet — add Semester 1, or however many terms this year is split into.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {y.terms.map((t) => {
                      const isActiveTerm = isActiveYear && t.id === activeTermId;
                      return (
                        <div key={t.id} className={classNames(
                          'flex items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 ring-1',
                          isActiveTerm ? 'bg-[#F4E7E7] ring-[#D9B4B4]' : 'bg-[#F7F3EC] ring-[#EFE6D6]'
                        )}>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-[#2E2718] flex items-center gap-1.5">
                              {t.label}
                              {isActiveTerm && <Pill tone="indigo">Active</Pill>}
                            </p>
                            <p className="text-xs text-[#9C8E76]">{t.start} – {t.end}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {isActiveYear && !isActiveTerm && (
                              <Button variant="ghost" className="px-2.5 py-1.5 text-xs" onClick={() => onSetActiveTerm(t.id)}>Set Active</Button>
                            )}
                            {!isActiveTerm && (
                              <IconButton onClick={() => onDeleteTerm(y.id, t.id)} title="Delete term" className="w-7 h-7 hover:text-[#B5482F] hover:bg-[#FBE7DD]">
                                <Trash2 className="w-3.5 h-3.5" />
                              </IconButton>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <SchoolYearFormModal onClose={() => setModalOpen(false)} onSave={(data) => { onAdd(data); setModalOpen(false); }} />
      )}
      {termModalYearId && (
        <TermFormModal
          onClose={() => setTermModalYearId(null)}
          onSave={(data) => { onAddTerm(termModalYearId, data); setTermModalYearId(null); }}
        />
      )}
    </div>
  );
}

/* ------------------------------ Sections View ------------------------------ */

function SectionsView({ sections, instructors, students, activeSchoolYear, onAdd, onEdit, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const scoped = sections.filter((s) => s.schoolYearId === activeSchoolYear.id);
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-4">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-[#EFE6D6]">
          <div>
            <h2 className="font-serif font-semibold text-[#22190F]">Class Sections</h2>
            <p className="text-xs text-[#9C8E76] mt-0.5">Showing sections for {activeSchoolYear.label}</p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Add Section</Button>
        </div>
        {scoped.length === 0 ? (
          <EmptyState icon={<LayoutGrid className="w-6 h-6" />} title="No sections yet" subtitle={`Create the first class section for ${activeSchoolYear.label}.`} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                  <th className="py-3 px-5 font-medium">Section</th>
                  <th className="py-3 px-5 font-medium">Grade</th>
                  <th className="py-3 px-5 font-medium">Adviser</th>
                  <th className="py-3 px-5 font-medium">Students</th>
                  <th className="py-3 px-5 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {scoped.map((s) => {
                  const adviser = instructors.find((i) => i.id === s.adviserId);
                  const count = students.filter((st) => st.sectionId === s.id).length;
                  const capacity = Number(s.capacity) || 0;
                  const atCapacity = capacity > 0 && count >= capacity;
                  return (
                    <tr key={s.id} className="border-b border-[#F7F3EC] last:border-0 hover:bg-[#F7F3EC]/60 transition-colors">
                      <td className="py-3 px-5 font-medium text-[#2E2718]">{s.name}</td>
                      <td className="py-3 px-5 text-[#786A55]">Grade {s.grade}</td>
                      <td className="py-3 px-5 text-[#786A55]">{adviser ? adviser.name : '—'}</td>
                      <td className="py-3 px-5">
                        <Pill tone={atCapacity ? 'amber' : 'indigo'}>{count}{capacity ? ` / ${capacity}` : ''} student{count === 1 ? '' : 's'}</Pill>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <IconButton onClick={() => setEditing(s)} title="Edit section"><Pencil className="w-4 h-4" /></IconButton>
                          <IconButton onClick={() => onDelete(s.id)} title="Delete section" className="hover:text-[#B5482F] hover:bg-[#FBE7DD]"><Trash2 className="w-4 h-4" /></IconButton>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {modalOpen && (
        <SectionFormModal instructors={instructors} onClose={() => setModalOpen(false)} onSave={(data) => { onAdd(data); setModalOpen(false); }} />
      )}
      {editing && (
        <SectionFormModal
          instructors={instructors}
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => { onEdit(editing.id, data); setEditing(null); }}
        />
      )}
    </div>
  );
}

/* ----------------------------- Curriculum View ----------------------------- */

function CurriculumView({ subjects, curriculum, onAddSubject, onEditSubject, onDeleteSubject, onToggleSubject }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const grades = [9, 10, 11, 12];
  return (
    <div className="p-4 md:p-6 max-w-[1200px] mx-auto space-y-4">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] overflow-hidden">
        <div className="p-4 md:p-5 flex items-center justify-between border-b border-[#EFE6D6]">
          <div>
            <h2 className="font-serif font-semibold text-[#22190F]">Subject Catalog</h2>
            <p className="text-xs text-[#9C8E76] mt-0.5">The full list of subjects offered school-wide</p>
          </div>
          <Button variant="primary" onClick={() => setModalOpen(true)}><Plus className="w-4 h-4" /> Add Subject</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                <th className="py-3 px-5 font-medium">Subject</th>
                <th className="py-3 px-5 font-medium">Units</th>
                <th className="py-3 px-5 font-medium">Required By</th>
                <th className="py-3 px-5 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((s) => {
                const usedByGrades = grades.filter((g) => (curriculum[g] || []).includes(s.name));
                return (
                  <tr key={s.name} className="border-b border-[#F7F3EC] last:border-0 hover:bg-[#F7F3EC]/60 transition-colors">
                    <td className="py-3 px-5 font-medium text-[#2E2718]">{s.name}</td>
                    <td className="py-3 px-5 text-[#786A55]">{s.units} unit{s.units === 1 ? '' : 's'}</td>
                    <td className="py-3 px-5 text-[#786A55]">
                      {usedByGrades.length ? `Grade ${usedByGrades.join(', ')}` : <span className="text-[#9C8E76]">Not assigned</span>}
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <IconButton onClick={() => setEditing(s)} title="Edit units"><Pencil className="w-4 h-4" /></IconButton>
                        <IconButton onClick={() => onDeleteSubject(s.name)} title="Delete subject" className="hover:text-rose-600 hover:bg-rose-50"><Trash2 className="w-4 h-4" /></IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {grades.map((g) => {
          const required = curriculum[g] || [];
          const available = subjects.filter((s) => !required.includes(s.name));
          return (
            <div key={g} className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4 md:p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-serif font-semibold text-[#22190F] text-sm">Grade {g}</h3>
                <span className="text-xs text-[#9C8E76]">{required.length} subjects</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3 min-h-[32px]">
                {required.length === 0 && <span className="text-xs text-[#9C8E76]">No subjects required yet.</span>}
                {required.map((name) => (
                  <span key={name} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 rounded-full text-xs font-medium bg-[#EFE6D6] text-[#5C4F3D]">
                    {name}
                    <button onClick={() => onToggleSubject(g, name, false)} className="w-4 h-4 rounded-full hover:bg-[#E3D7C0] flex items-center justify-center">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              {available.length > 0 && (
                <select
                  value=""
                  onChange={(e) => e.target.value && onToggleSubject(g, e.target.value, true)}
                  className="w-full px-3 py-2 rounded-lg bg-[#EFE6D6] text-xs text-[#5C4F3D] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                >
                  <option value="">+ Add subject to Grade {g}</option>
                  {available.map((s) => <option key={s.name} value={s.name}>{s.name}</option>)}
                </select>
              )}
            </div>
          );
        })}
      </div>

      {modalOpen && (
        <SubjectFormModal onClose={() => setModalOpen(false)} onSave={(data) => { onAddSubject(data); setModalOpen(false); }} />
      )}
      {editing && (
        <SubjectFormModal
          initial={editing}
          onClose={() => setEditing(null)}
          onSave={(data) => { onEditSubject(editing.name, data); setEditing(null); }}
        />
      )}
    </div>
  );
}

/* ------------------------------- Matching View ------------------------------ */

function MatchingView({ sections, curriculum, instructors, offerings, onUpdateOffering, students, onAssignStudent }) {
  const unassigned = students.filter((s) => !s.sectionId);
  const conflicts = useMemo(
    () => findScheduleConflicts(sections, curriculum, offerings, instructors),
    [sections, curriculum, offerings, instructors]
  );

  return (
    <div className="p-4 md:p-6 max-w-[1300px] mx-auto space-y-4">
      <div className={classNames(
        'flex items-start gap-3 rounded-2xl px-4 py-3.5 ring-1',
        conflicts.length === 0 ? 'bg-[#E3EEE6] ring-[#C7DFCD]' : 'bg-[#FBE7DD] ring-[#F0C7B2]'
      )}>
        {conflicts.length === 0 ? (
          <>
            <Check className="w-4 h-4 text-[#3F7A52] shrink-0 mt-0.5" />
            <p className="text-sm text-[#3F7A52]">No schedule conflicts — every instructor teaches at most one section per period.</p>
          </>
        ) : (
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="w-4 h-4 text-[#B5482F] shrink-0" />
              <p className="text-sm font-medium text-[#B5482F]">{conflicts.length} schedule conflict{conflicts.length === 1 ? '' : 's'} found</p>
            </div>
            <div className="space-y-1.5">
              {conflicts.map((c) => (
                <p key={c.id} className="text-xs text-[#9C5A24] pl-6">
                  <span className="font-medium">{c.instructorName}</span> is booked into {c.sections.map((s) => `${s.sectionName} (${s.subject})`).join(' and ')} at the same time — {c.day} Period {c.period} ({c.time})
                </p>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4 md:p-5">
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-[#22190F]">Teaching Assignments</h2>
          <p className="text-xs text-[#9C8E76] mt-0.5">Match a qualified instructor to each subject in every section.</p>
        </div>
        {sections.length === 0 ? (
          <EmptyState icon={<Shuffle className="w-6 h-6" />} title="No sections to match yet" subtitle="Create a class section and curriculum first." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {sections.map((sec) => {
              const subjectsForGrade = curriculum[sec.grade] || [];
              return (
                <div key={sec.id} className="rounded-xl ring-1 ring-[#EFE6D6] bg-[#F7F3EC]/60 p-4">
                  <p className="text-sm font-semibold text-[#2E2718] mb-3">{sec.name} <span className="text-[#9C8E76] font-normal">· Grade {sec.grade}</span></p>
                  <div className="space-y-2">
                    {subjectsForGrade.length === 0 && <p className="text-xs text-[#9C8E76]">No curriculum defined for this grade yet.</p>}
                    {subjectsForGrade.map((subjectName) => {
                      const offering = offerings.find((o) => o.sectionId === sec.id && o.subjectId === subjectName);
                      const qualified = instructors.filter((i) => i.subjects.includes(subjectName));
                      return (
                        <div key={subjectName} className="flex items-center justify-between gap-3 bg-white rounded-lg px-3 py-2 ring-1 ring-[#EFE6D6]">
                          <span className="text-sm text-[#5C4F3D]">{subjectName}</span>
                          <select
                            value={offering?.instructorId || ''}
                            onChange={(e) => onUpdateOffering(sec.id, subjectName, e.target.value)}
                            className="text-xs px-2.5 py-1.5 rounded-md bg-[#EFE6D6] text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40 max-w-[180px]"
                          >
                            <option value="">Unassigned</option>
                            {qualified.map((i) => <option key={i.id} value={i.id}>{i.name}</option>)}
                          </select>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4 md:p-5">
        <div className="mb-4">
          <h2 className="font-serif font-semibold text-[#22190F]">Student Placement</h2>
          <p className="text-xs text-[#9C8E76] mt-0.5">Place newly enrolled students into a class section.</p>
        </div>
        {unassigned.length === 0 ? (
          <EmptyState icon={<Users className="w-6 h-6" />} title="Everyone's placed" subtitle="All enrolled students are assigned to a class section." />
        ) : (
          <div className="space-y-2">
            {unassigned.map((s) => {
              const options = sections.filter((sec) => sec.grade === s.grade);
              return (
                <div key={s.id} className="flex items-center gap-3 bg-[#F7F3EC] rounded-xl px-3.5 py-2.5">
                  <Avatar name={s.name} size="w-9 h-9 text-xs" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-[#2E2718] truncate">{s.name}</p>
                    <p className="text-xs text-[#9C8E76]">Grade {s.grade} · {s.id}</p>
                  </div>
                  <select
                    defaultValue=""
                    onChange={(e) => e.target.value && onAssignStudent(s.id, e.target.value)}
                    className="text-xs px-2.5 py-2 rounded-lg bg-white ring-1 ring-[#E3D7C0] text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
                  >
                    <option value="">Select section…</option>
                    {options.map((sec) => {
                      const count = students.filter((st) => st.sectionId === sec.id).length;
                      const capacity = Number(sec.capacity) || 0;
                      const full = capacity > 0 && count >= capacity;
                      return (
                        <option key={sec.id} value={sec.id}>
                          {sec.name} ({count}{capacity ? `/${capacity}` : ''}{full ? ' — full' : ''})
                        </option>
                      );
                    })}
                    {options.length === 0 && <option disabled>No Grade {s.grade} sections yet</option>}
                  </select>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Setup Guide View ---------------------------- */

function SetupGuideView({ steps, onNavigate }) {
  return (
    <div className="p-4 md:p-6 max-w-[800px] mx-auto">
      <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-serif font-semibold text-[#22190F]">Get Your School Set Up</h2>
            <p className="text-xs text-[#9C8E76] mt-0.5">Complete these steps in order to enable admissions, matching, and grading.</p>
          </div>
        </div>

        <div>
          {steps.map((step, i) => (
            <div key={step.key} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={classNames(
                  'w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-semibold',
                  step.done ? 'bg-emerald-500 text-white' : 'bg-[#EFE6D6] text-[#9C8E76] ring-1 ring-[#E3D7C0]'
                )}>
                  {step.done ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={classNames('w-0.5 flex-1 my-1', step.done ? 'bg-emerald-300' : 'bg-[#E3D7C0]')} style={{ minHeight: '28px' }} />
                )}
              </div>
              <div className="flex-1 pb-6">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[#2E2718]">{step.label}</p>
                    <p className="text-xs text-[#9C8E76] mt-0.5">{step.description}</p>
                  </div>
                  <Button variant={step.done ? 'ghost' : 'primary'} onClick={() => onNavigate(step.nav)}>
                    {step.done ? 'Review' : 'Set up'} <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-[#EFE6D6] flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-[#9C8E76]" />
          <p className="text-xs text-[#786A55]">
            Once matching is complete, grades can be recorded from the{' '}
            <button onClick={() => onNavigate('academic')} className="text-[#7A2E2E] font-medium hover:underline">Academics</button> tab.
          </p>
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Public Apply Form ---------------------------- */

function PublicApplyForm({ students, applicants, onSubmit, onExit }) {
  const [mode, setMode] = useState('new');
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('9');
  const [linkedStudentId, setLinkedStudentId] = useState('');
  const [guardianName, setGuardianName] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [submittedId, setSubmittedId] = useState(null);

  const inFlightStudentIds = new Set(
    applicants.filter((a) => a.returning && !a.rejected && a.stage !== 'Enrolled').map((a) => a.linkedStudentId)
  );
  const returningOptions = students.filter((s) => !inFlightStudentIds.has(s.id));
  const linkedStudent = students.find((s) => s.id === linkedStudentId) || null;

  const selectReturningStudent = (id) => {
    setLinkedStudentId(id);
    const s = students.find((st) => st.id === id);
    if (s) {
      setGrade(String(Math.min(s.grade + 1, 12)));
      setGuardianName(s.guardian || '');
      setGuardianPhone(s.phone || '');
      setGuardianEmail(s.email || '');
    }
  };

  const resetForm = () => {
    setMode('new'); setName(''); setGrade('9'); setLinkedStudentId('');
    setGuardianName(''); setGuardianPhone(''); setGuardianEmail(''); setSubmittedId(null);
  };

  const valid = mode === 'new'
    ? name.trim() && guardianName.trim() && (guardianPhone.trim() || guardianEmail.trim())
    : linkedStudentId && guardianName.trim() && (guardianPhone.trim() || guardianEmail.trim());

  const handleSubmit = () => {
    if (!valid) return;
    const id = onSubmit({
      returning: mode === 'returning',
      linkedStudentId: mode === 'returning' ? linkedStudentId : null,
      name: mode === 'returning' ? linkedStudent?.name : name.trim(),
      grade: Number(grade),
      guardian: guardianName.trim(),
      phone: guardianPhone.trim(),
      email: guardianEmail.trim(),
    });
    setSubmittedId(id);
  };

  return (
    <div className="h-screen w-full overflow-y-auto bg-[#F7F3EC]">
      <div className="max-w-xl mx-auto px-4 py-8 md:py-14">
        <button onClick={onExit} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9C8E76] hover:text-[#5C4F3D] mb-6">
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Staff Console
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#D9B4B4] ring-2 ring-[#F6EEDC]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-semibold text-[#22190F]">{SCHOOL_NAME}</p>
            <p className="text-xs text-[#9C8E76]">Student Enrollment Application</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-6 md:p-8">
          {submittedId ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                <PartyPopper className="w-6 h-6" />
              </div>
              <h2 className="font-serif font-semibold text-[#22190F] text-lg">Application Submitted</h2>
              <p className="text-sm text-[#786A55] mt-2 max-w-sm mx-auto">
                Reference <span className="font-medium text-[#42392A]">{submittedId}</span> has been sent to the registrar's office for review. You'll be notified as it moves through document review and assessment.
              </p>
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="ghost" onClick={resetForm}>Submit Another Application</Button>
                <Button variant="primary" onClick={onExit}>Done</Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-1 bg-[#EFE6D6] rounded-lg p-1 mb-6">
                <button
                  onClick={() => setMode('new')}
                  className={classNames('flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors', mode === 'new' ? 'bg-white text-[#5E2323] shadow-sm' : 'text-[#786A55] hover:text-[#42392A]')}
                >
                  New Student
                </button>
                <button
                  onClick={() => setMode('returning')}
                  className={classNames('flex-1 px-3 py-2 rounded-md text-sm font-medium transition-colors', mode === 'returning' ? 'bg-white text-[#5E2323] shadow-sm' : 'text-[#786A55] hover:text-[#42392A]')}
                >
                  Returning Student
                </button>
              </div>

              <div className="space-y-4">
                {mode === 'new' ? (
                  <>
                    <div>
                      <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Student Full Name</label>
                      <input className={INPUT_CLS} value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sofia Reyes" />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Grade Applying For</label>
                      <select className={INPUT_CLS} value={grade} onChange={(e) => setGrade(e.target.value)}>
                        {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
                      </select>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Select Your Student</label>
                      <select className={INPUT_CLS} value={linkedStudentId} onChange={(e) => selectReturningStudent(e.target.value)}>
                        <option value="">Choose an existing student…</option>
                        {returningOptions.map((s) => <option key={s.id} value={s.id}>{s.name} · Grade {s.grade} · {s.id}</option>)}
                      </select>
                      {returningOptions.length === 0 && (
                        <p className="text-xs text-[#9C8E76] mt-1.5">Every student already has an application in progress.</p>
                      )}
                    </div>
                    {linkedStudent && (
                      <div>
                        <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Grade Applying For</label>
                        <select className={INPUT_CLS} value={grade} onChange={(e) => setGrade(e.target.value)}>
                          {[9, 10, 11, 12].map((g) => <option key={g} value={g}>Grade {g}</option>)}
                        </select>
                        <p className="text-xs text-[#9C8E76] mt-1.5">Section and subjects are assigned later, once the registrar processes this application.</p>
                      </div>
                    )}
                  </>
                )}

                <div className="pt-2 border-t border-[#EFE6D6]">
                  <p className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Guardian & Contact</p>
                  <div className="space-y-3">
                    <input className={INPUT_CLS} value={guardianName} onChange={(e) => setGuardianName(e.target.value)} placeholder="Guardian full name" />
                    <div className="grid grid-cols-2 gap-3">
                      <input className={INPUT_CLS} value={guardianPhone} onChange={(e) => setGuardianPhone(e.target.value)} placeholder="Phone" />
                      <input className={INPUT_CLS} value={guardianEmail} onChange={(e) => setGuardianEmail(e.target.value)} placeholder="Email" />
                    </div>
                  </div>
                </div>
              </div>

              <Button variant="primary" className="w-full mt-6" disabled={!valid} onClick={handleSubmit}>
                <Send className="w-4 h-4" /> Submit Application
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Report Card ------------------------------ */

function ReportCard({ student, sections, instructors, curriculum, criteria, scores, terms, activeTermId, schoolYearLabel, onExit }) {
  const [selectedTermId, setSelectedTermId] = useState(activeTermId || terms[0]?.id || '');
  const section = sections.find((sec) => sec.id === student.sectionId) || null;
  const adviser = section ? instructors.find((i) => i.id === section.adviserId) : null;
  const subjectsForGrade = curriculum[student.grade] || [];

  const subjectRows = subjectsForGrade.map((subjectName) => {
    const subjectCategories = criteria[subjectName] || [];
    const studentScores = (scores[subjectName] && scores[subjectName][selectedTermId] && scores[subjectName][selectedTermId][student.id]) || {};
    const avg = overallGrade(subjectCategories, studentScores);
    const status = avg != null ? gradeStatus(avg) : { label: 'Incomplete', tone: 'slate' };
    return { subjectName, avg, status };
  });

  const gradedSubjects = subjectRows.filter((r) => r.avg != null);
  const generalAverage = gradedSubjects.length ? average(gradedSubjects.map((r) => r.avg)) : null;
  const termLabel = terms.find((t) => t.id === selectedTermId)?.label || '';

  return (
    <div className="min-h-screen w-full bg-[#F7F3EC] overflow-y-auto print:bg-white">
      <div className="max-w-2xl mx-auto px-4 py-8 print:py-0 print:px-0 print:max-w-none">
        <div className="flex items-center justify-between mb-6 print:hidden">
          <button onClick={onExit} className="inline-flex items-center gap-1.5 text-xs font-medium text-[#9C8E76] hover:text-[#5C4F3D]">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </button>
          <div className="flex items-center gap-2">
            {terms.length > 1 && (
              <select
                value={selectedTermId}
                onChange={(e) => setSelectedTermId(e.target.value)}
                className="text-xs px-2.5 py-2 rounded-lg bg-white ring-1 ring-[#E3D7C0] text-[#42392A] focus:outline-none focus:ring-2 focus:ring-[#8C3B3B]/40"
              >
                {terms.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
              </select>
            )}
            <Button variant="primary" onClick={() => window.print()}><Printer className="w-4 h-4" /> Print</Button>
          </div>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-8 print:ring-0 print:rounded-none print:shadow-none">
          <div className="flex items-center gap-3 pb-6 border-b border-[#EFE6D6] mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0 ring-2 ring-[#F6EEDC] print:hidden">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <p className="font-serif font-semibold text-lg text-[#22190F]">{SCHOOL_NAME}</p>
              <p className="text-xs text-[#9C8E76]">Official Report of Grades · {schoolYearLabel}{termLabel && ` · ${termLabel}`}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
            <div>
              <p className="text-xs text-[#9C8E76] uppercase tracking-wide mb-1">Student</p>
              <p className="font-medium text-[#2E2718]">{student.name}</p>
              <p className="text-xs text-[#9C8E76]">{student.id} · Grade {student.grade}</p>
            </div>
            <div>
              <p className="text-xs text-[#9C8E76] uppercase tracking-wide mb-1">Section &amp; Adviser</p>
              <p className="font-medium text-[#2E2718]">{section ? section.name : 'Unassigned'}</p>
              <p className="text-xs text-[#9C8E76]">{adviser ? adviser.name : '—'}</p>
            </div>
            <div>
              <p className="text-xs text-[#9C8E76] uppercase tracking-wide mb-1">Guardian</p>
              <p className="font-medium text-[#2E2718]">{student.guardian}</p>
            </div>
            <div>
              <p className="text-xs text-[#9C8E76] uppercase tracking-wide mb-1">General Average</p>
              <p className="font-serif font-bold text-2xl text-[#7A2E2E]">{generalAverage != null ? generalAverage.toFixed(1) : '—'}</p>
            </div>
          </div>

          {subjectRows.length === 0 ? (
            <EmptyState icon={<BookOpen className="w-6 h-6" />} title="No subjects on record" subtitle="This grade level has no curriculum assigned yet." />
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-[#9C8E76] uppercase tracking-wide border-b border-[#EFE6D6]">
                  <th className="py-2.5 font-medium">Subject</th>
                  <th className="py-2.5 font-medium text-right">Grade</th>
                  <th className="py-2.5 font-medium text-right pl-4">Standing</th>
                </tr>
              </thead>
              <tbody>
                {subjectRows.map((r) => (
                  <tr key={r.subjectName} className="border-b border-[#F7F3EC] last:border-0">
                    <td className="py-2.5 text-[#42392A]">{r.subjectName}</td>
                    <td className="py-2.5 text-right font-semibold text-[#2E2718]">{r.avg != null ? r.avg.toFixed(1) : '—'}</td>
                    <td className="py-2.5 text-right pl-4"><Pill tone={r.status.tone}>{r.status.label}</Pill></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <p className="text-[11px] text-[#9C8E76] mt-8 pt-4 border-t border-[#EFE6D6]">
            Generated {TODAY} · {SCHOOL_NAME} Registrar's Office. This is a system-generated preview, not an official transcript.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Login Screen ----------------------------- */

function LoginScreen({ accounts, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const account = accounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password
    );
    if (!account) {
      setError('Email or password not recognized. Try one of the demo accounts below.');
      return;
    }
    setError('');
    onLogin(account);
  };

  const fillDemo = (account) => {
    setEmail(account.email);
    setPassword(account.password);
    setError('');
  };

  return (
    <div className="min-h-screen w-full bg-[#F7F3EC] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0 shadow-sm shadow-[#D9B4B4] ring-2 ring-[#F6EEDC]">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <p className="font-serif font-semibold text-[#22190F]">{SCHOOL_NAME}</p>
            <p className="text-xs text-[#9C8E76]">Admin Console</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={INPUT_CLS} placeholder="you@nba.edu" />
          </div>
          <div>
            <label className="text-xs font-medium text-[#786A55] mb-1.5 block">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={INPUT_CLS} placeholder="••••••••" />
          </div>
          {error && (
            <p className="text-xs text-[#B5482F] flex items-center gap-1.5"><AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}</p>
          )}
          <Button type="submit" variant="primary" className="w-full">
            <Lock className="w-4 h-4" /> Sign In
          </Button>
        </form>

        <div className="mt-5 bg-[#F6EEDC] ring-1 ring-[#EBDEC0] rounded-2xl p-4">
          <p className="text-xs font-semibold text-[#8A5F24] flex items-center gap-1.5 mb-2">
            <KeyRound className="w-3.5 h-3.5" /> Demo accounts — click to fill in
          </p>
          <div className="space-y-1.5">
            {accounts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => fillDemo(a)}
                className="w-full flex items-center justify-between text-left px-3 py-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
              >
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#42392A] truncate">{a.name} <span className="text-[#9C8E76] font-normal">· {a.title}</span></p>
                  <p className="text-[11px] text-[#9C8E76]">{a.email}</p>
                </div>
                <Pill tone="violet" className="shrink-0">{a.role}</Pill>
              </button>
            ))}
          </div>
          <p className="text-[11px] text-[#9C8E76] mt-3">
            Demo only — these accounts live in this file, not a real database. Nothing here is secure.
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Parent Portal ---------------------------- */

function ParentPortal({ account, student, sections, instructors, curriculum, offerings, onViewReportCard, onLogout }) {
  if (!student) {
    return (
      <div className="min-h-screen w-full bg-[#F7F3EC] flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-sm text-[#786A55]">No student record is linked to this account.</p>
          <Button variant="ghost" className="mt-4" onClick={onLogout}><LogOut className="w-4 h-4" /> Log out</Button>
        </div>
      </div>
    );
  }

  const section = sections.find((sec) => sec.id === student.sectionId) || null;
  const adviser = section ? instructors.find((i) => i.id === section.adviserId) : null;
  const subjectsForGrade = curriculum[student.grade] || [];

  return (
    <div className="min-h-screen w-full bg-[#F7F3EC]">
      <header className="h-16 bg-white border-b border-[#E3D7C0] flex items-center px-4 md:px-6 justify-between sticky top-0 z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A2E2E] to-[#A6752E] flex items-center justify-center text-white shrink-0 ring-2 ring-[#F6EEDC]">
            <GraduationCap className="w-[18px] h-[18px]" />
          </div>
          <div>
            <p className="font-serif font-semibold text-sm text-[#22190F] leading-tight">{SCHOOL_NAME}</p>
            <p className="text-[11px] text-[#9C8E76] leading-tight">Parent Portal · {account.name}</p>
          </div>
        </div>
        <IconButton onClick={onLogout} title="Log out"><LogOut className="w-4 h-4" /></IconButton>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5 flex items-center gap-4">
          <Avatar name={student.name} size="w-16 h-16 text-xl" />
          <div className="min-w-0">
            <h1 className="font-serif font-semibold text-lg text-[#22190F]">{student.name}</h1>
            <p className="text-xs text-[#9C8E76]">{student.id} · Grade {student.grade}</p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              <Pill tone={student.status === 'Active' ? 'emerald' : 'amber'}>{student.status}</Pill>
              {student.tags.map((t) => <Pill key={t} tone="indigo">{t}</Pill>)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4">
            <p className="text-xs text-[#9C8E76] mb-1">Attendance</p>
            <p className="text-2xl font-serif font-bold text-[#22190F]">{student.attendance != null ? `${student.attendance}%` : '—'}</p>
          </div>
          <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-4">
            <p className="text-xs text-[#9C8E76] mb-1">GPA</p>
            <p className="text-2xl font-serif font-bold text-[#22190F]">{student.gpa != null ? student.gpa.toFixed(1) : '—'}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5">
          <h3 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Class Section</h3>
          {section ? (
            <div>
              <p className="text-sm font-medium text-[#42392A]">{section.name}</p>
              <p className="text-xs text-[#9C8E76]">Adviser: {adviser ? adviser.name : '—'}</p>
            </div>
          ) : (
            <p className="text-sm text-amber-700">Not yet assigned to a class section.</p>
          )}
        </div>

        {section && subjectsForGrade.length > 0 && (
          <div className="bg-white rounded-2xl ring-1 ring-[#E3D7C0] p-5">
            <h3 className="text-xs font-semibold text-[#9C8E76] uppercase tracking-wide mb-3">Subjects &amp; Instructors</h3>
            <div className="space-y-2">
              {subjectsForGrade.map((subj) => {
                const offering = offerings.find((o) => o.sectionId === section.id && o.subjectId === subj);
                const instructor = offering ? instructors.find((i) => i.id === offering.instructorId) : null;
                return (
                  <div key={subj} className="flex items-center justify-between bg-[#F7F3EC] rounded-lg px-3 py-2">
                    <span className="text-sm text-[#42392A]">{subj}</span>
                    <span className="text-xs text-[#9C8E76]">{instructor ? instructor.name : 'Unassigned'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <Button variant="primary" className="w-full" onClick={() => onViewReportCard(student.id)}>
          <FileText className="w-4 h-4" /> View Report Card
        </Button>
      </main>
    </div>
  );
}

/* --------------------------------- Root ---------------------------------- */

const VIEW_META = {
  dashboard: { title: 'Executive Overview', subtitle: 'School-wide snapshot for today' },
  admissions: { title: 'Admissions & Enrollment', subtitle: 'Manage the applicant pipeline' },
  students: { title: 'Student Directory', subtitle: 'Search and manage student records' },
  academic: { title: 'Academic Management', subtitle: 'Gradebook and scheduling' },
  guide: { title: 'Setup Guide', subtitle: 'Get your school configured, step by step' },
  instructors: { title: 'Instructors', subtitle: 'Manage faculty records' },
  schoolyear: { title: 'School Year', subtitle: 'Manage academic years' },
  sections: { title: 'Class Sections', subtitle: 'Organize students into homerooms' },
  curriculum: { title: 'Curriculum', subtitle: 'Define subjects required per grade level' },
  matching: { title: 'Matching', subtitle: 'Assign instructors and place students into sections' },
};

export default function SchoolManagementSystem() {
  const [currentUser, setCurrentUser] = useState(null);
  const [reportCardStudentId, setReportCardStudentId] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [applicants, setApplicants] = useState(INITIAL_APPLICANTS);
  const [students, setStudents] = useState(STUDENTS_SEED);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [instructors, setInstructors] = useState(INSTRUCTORS_SEED);
  const [schoolYears, setSchoolYears] = useState(SCHOOL_YEARS_SEED);
  const [activeSchoolYearId, setActiveSchoolYearId] = useState(ACTIVE_SCHOOL_YEAR_SEED);
  const [activeTermId, setActiveTermId] = useState(ACTIVE_TERM_SEED);
  const [sections, setSections] = useState(SECTIONS_SEED);
  const [subjects, setSubjects] = useState(SUBJECT_CATALOG_SEED);
  const [curriculum, setCurriculum] = useState(CURRICULUM_SEED);
  const [offerings, setOfferings] = useState(() => buildDefaultOfferings(SECTIONS_SEED, CURRICULUM_SEED, INSTRUCTORS_SEED));
  const [criteria, setCriteria] = useState(CRITERIA_SEED);
  const [scores, setScores] = useState(SCORES_SEED);
  const [publicFormOpen, setPublicFormOpen] = useState(false);

  const [toasts, setToasts] = useState([]);
  const toastTimers = useRef({});
  const nextApplicantNum = useRef(5509);

  const pushToast = (message, tone = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, message, tone }]);
    toastTimers.current[id] = setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, 3800);
  };
  const dismissToast = (id) => {
    clearTimeout(toastTimers.current[id]);
    setToasts((t) => t.filter((x) => x.id !== id));
  };

  const enrollFromApplicant = (a) => {
    if (a.returning && a.linkedStudentId) {
      setStudents((prev) => prev.map((s) => (s.id === a.linkedStudentId ? {
        ...s,
        grade: a.appliedGrade,
        status: 'Active',
        sectionId: null,
        guardian: a.guardian,
        phone: a.phone,
        email: a.email,
        tags: Array.from(new Set([...(s.tags || []).filter((t) => t !== 'New Enrollee'), 'Re-enrolled'])),
      } : s)));
      return;
    }
    setStudents((prev) => {
      if (prev.some((s) => s.sourceApplicantId === a.id)) return prev;
      return [...prev, studentFromApplicant(a)];
    });
  };

  const moveApplicant = (id, dir) => {
    const current = applicants.find((a) => a.id === id);
    if (!current) return;
    const idx = STAGES.indexOf(current.stage);
    const newIdx = Math.min(Math.max(idx + dir, 0), STAGES.length - 1);
    if (newIdx === idx) return;
    const newStage = STAGES[newIdx];
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a)));
    setSelectedApplicant((sel) => (sel && sel.id === id ? { ...sel, stage: newStage } : sel));
    pushToast(`${current.name} moved to "${newStage}"`, 'info');
    if (newStage === 'Enrolled') {
      const converted = { ...current, stage: newStage };
      enrollFromApplicant(converted);
      pushToast(
        converted.returning ? `${converted.name}'s re-enrollment was recorded — needs a section` : `${converted.name} added to the student roster — needs a section`,
        'success'
      );
    }
  };

  const approveApplicant = (id) => {
    const current = applicants.find((a) => a.id === id);
    if (!current) return;
    const idx = STAGES.indexOf(current.stage);
    const nextIdx = Math.min(idx + 1, STAGES.length - 1);
    const newStage = STAGES[nextIdx];
    setApplicants((prev) => prev.map((a) => (a.id === id ? { ...a, stage: newStage } : a)));
    setSelectedApplicant(null);
    pushToast(`${current.name} approved → ${newStage}`, 'success');
    if (newStage === 'Enrolled') {
      const converted = { ...current, stage: newStage };
      enrollFromApplicant(converted);
      pushToast(
        converted.returning ? `${converted.name}'s re-enrollment was recorded — needs a section` : `${converted.name} added to the student roster — needs a section`,
        'success'
      );
    }
  };

  const rejectApplicant = (id) => {
    let name = '';
    setApplicants((prev) => prev.map((a) => {
      if (a.id !== id) return a;
      name = a.name;
      return { ...a, rejected: true };
    }));
    setSelectedApplicant(null);
    pushToast(`${name}'s application was rejected`, 'error');
  };

  const addInstructor = (data) => {
    setInstructors((prev) => [...prev, { id: `INS-${String(prev.length + 1).padStart(2, '0')}`, ...data }]);
    pushToast(`${data.name} added to the faculty roster`, 'success');
  };

  const updateInstructor = (id, data) => {
    setInstructors((prev) => prev.map((i) => (i.id === id ? { ...i, ...data } : i)));
    pushToast(`${data.name}'s record was updated`, 'success');
  };

  const addSchoolYear = (data) => {
    const id = `SY-${data.label.replace(/\D/g, '').slice(0, 4) || Date.now()}`;
    setSchoolYears((prev) => [...prev, { id, label: data.label, start: data.start, end: data.end, status: 'Draft', terms: [] }]);
    pushToast(`${data.label} created`, 'success');
  };

  const setActiveSchoolYear = (id) => {
    setSchoolYears((prev) => prev.map((y) => ({
      ...y,
      status: y.id === id ? 'Active' : (y.status === 'Active' ? 'Archived' : y.status),
    })));
    setActiveSchoolYearId(id);
    const y = schoolYears.find((yy) => yy.id === id);
    setActiveTermId(y && y.terms.length ? y.terms[0].id : null);
    pushToast(`${y ? y.label : 'School year'} is now active`, 'info');
  };

  const addTerm = (schoolYearId, data) => {
    const term = { id: `TRM-${schoolYearId}-${Date.now()}`, label: data.label, start: data.start, end: data.end };
    setSchoolYears((prev) => prev.map((y) => (y.id === schoolYearId ? { ...y, terms: [...y.terms, term] } : y)));
    if (schoolYearId === activeSchoolYearId && !activeTermId) setActiveTermId(term.id);
    pushToast(`${data.label} added`, 'success');
  };

  const setActiveTerm = (id) => {
    setActiveTermId(id);
    pushToast('Active term updated', 'info');
  };

  const deleteSchoolYear = (id) => {
    if (id === activeSchoolYearId) {
      pushToast('Set a different school year active before deleting this one', 'error');
      return;
    }
    if (sections.some((s) => s.schoolYearId === id)) {
      pushToast('Remove this school year\'s class sections before deleting it', 'error');
      return;
    }
    const y = schoolYears.find((yy) => yy.id === id);
    setSchoolYears((prev) => prev.filter((yy) => yy.id !== id));
    pushToast(`${y ? y.label : 'School year'} deleted`, 'info');
  };

  const deleteTerm = (schoolYearId, termId) => {
    setSchoolYears((prev) => prev.map((y) => (y.id === schoolYearId ? { ...y, terms: y.terms.filter((t) => t.id !== termId) } : y)));
    pushToast('Term removed', 'info');
  };

  const addSection = (data) => {
    setSections((prev) => [...prev, {
      id: `SEC-${String(prev.length + 1).padStart(2, '0')}`,
      name: data.name,
      grade: Number(data.grade),
      adviserId: data.adviserId,
      capacity: Number(data.capacity) || 30,
      schoolYearId: activeSchoolYearId,
    }]);
    pushToast(`${data.name} created`, 'success');
  };

  const updateSection = (id, data) => {
    setSections((prev) => prev.map((s) => (s.id === id ? {
      ...s, name: data.name, grade: Number(data.grade), adviserId: data.adviserId, capacity: Number(data.capacity) || 30,
    } : s)));
    pushToast(`${data.name} updated`, 'success');
  };

  const deleteSection = (id) => {
    if (students.some((s) => s.sectionId === id)) {
      pushToast('Move students out of this section before deleting it', 'error');
      return;
    }
    const sec = sections.find((s) => s.id === id);
    setSections((prev) => prev.filter((s) => s.id !== id));
    setOfferings((prev) => prev.filter((o) => o.sectionId !== id));
    pushToast(`${sec ? sec.name : 'Section'} deleted`, 'info');
  };

  const addSubject = (data) => {
    if (subjects.some((s) => s.name.toLowerCase() === data.name.toLowerCase())) {
      pushToast(`${data.name} is already in the catalog`, 'error');
      return;
    }
    setSubjects((prev) => [...prev, { name: data.name, units: Number(data.units) || 1 }]);
    setCriteria((prev) => ({ ...prev, [data.name]: defaultCriteria() }));
    setScores((prev) => ({ ...prev, [data.name]: {} }));
    pushToast(`${data.name} added to the subject catalog`, 'success');
  };

  const updateSubject = (name, data) => {
    setSubjects((prev) => prev.map((s) => (s.name === name ? { ...s, units: Number(data.units) || 1 } : s)));
    pushToast(`${name} updated`, 'success');
  };

  const deleteSubject = (name) => {
    const stillRequired = Object.values(curriculum).some((arr) => arr.includes(name));
    if (stillRequired) {
      pushToast(`Remove ${name} from every grade's curriculum before deleting it`, 'error');
      return;
    }
    setSubjects((prev) => prev.filter((s) => s.name !== name));
    setCriteria((prev) => { const next = { ...prev }; delete next[name]; return next; });
    setScores((prev) => { const next = { ...prev }; delete next[name]; return next; });
    pushToast(`${name} removed from the subject catalog`, 'info');
  };

  const updateScore = (subject, termId, studentId, itemId, value) => {
    setScores((prev) => {
      const subjScores = { ...(prev[subject] || {}) };
      const termScores = { ...(subjScores[termId] || {}) };
      const studentScores = { ...(termScores[studentId] || {}) };
      if (value === '' || value == null) {
        delete studentScores[itemId];
      } else {
        const item = (criteria[subject] || [])
          .flatMap((cat) => cat.items)
          .find((it) => it.id === itemId);
        const max = item ? Number(item.maxScore) || 0 : Infinity;
        studentScores[itemId] = Math.min(Math.max(0, Number(value)), max);
      }
      termScores[studentId] = studentScores;
      subjScores[termId] = termScores;
      return { ...prev, [subject]: subjScores };
    });
  };

  const addGradingCategory = (subject) => {
    setCriteria((prev) => ({
      ...prev,
      [subject]: [...(prev[subject] || []), {
        id: genId('CAT'), name: 'New Category', weight: 0,
        items: [{ id: genId('ITM'), label: 'Item 1', maxScore: 100 }],
      }],
    }));
  };

  const updateGradingCategory = (subject, categoryId, data) => {
    setCriteria((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).map((c) => (c.id === categoryId ? { ...c, ...data } : c)),
    }));
  };

  const deleteGradingCategory = (subject, categoryId) => {
    setCriteria((prev) => ({ ...prev, [subject]: (prev[subject] || []).filter((c) => c.id !== categoryId) }));
    pushToast('Category removed', 'info');
  };

  const addGradingItem = (subject, categoryId) => {
    setCriteria((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).map((c) => (c.id === categoryId
        ? { ...c, items: [...c.items, { id: genId('ITM'), label: `Item ${c.items.length + 1}`, maxScore: 100 }] }
        : c)),
    }));
  };

  const updateGradingItem = (subject, categoryId, itemId, data) => {
    setCriteria((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).map((c) => (c.id !== categoryId ? c : {
        ...c, items: c.items.map((it) => (it.id === itemId ? { ...it, ...data } : it)),
      })),
    }));
  };

  const deleteGradingItem = (subject, categoryId, itemId) => {
    setCriteria((prev) => ({
      ...prev,
      [subject]: (prev[subject] || []).map((c) => (c.id !== categoryId ? c : {
        ...c, items: c.items.length > 1 ? c.items.filter((it) => it.id !== itemId) : c.items,
      })),
    }));
  };

  const toggleCurriculumSubject = (grade, subjectName, add) => {
    setCurriculum((prev) => {
      const current = prev[grade] || [];
      const next = add ? [...current, subjectName] : current.filter((s) => s !== subjectName);
      return { ...prev, [grade]: next };
    });
  };

  const updateOffering = (sectionId, subjectId, instructorId) => {
    setOfferings((prev) => {
      const idx = prev.findIndex((o) => o.sectionId === sectionId && o.subjectId === subjectId);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = { ...copy[idx], instructorId };
        return copy;
      }
      return [...prev, { id: `OFF-${sectionId}-${subjectId.replace(/\s+/g, '')}`, sectionId, subjectId, instructorId }];
    });
    const instructor = instructors.find((i) => i.id === instructorId);
    pushToast(instructor ? `${instructor.name} assigned to ${subjectId}` : `${subjectId} unassigned`, 'info');
  };

  const assignStudentToSection = (studentId, sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    const student = students.find((s) => s.id === studentId);
    const capacity = Number(section?.capacity) || 0;
    const currentCount = students.filter((s) => s.sectionId === sectionId).length;
    if (section && capacity > 0 && currentCount >= capacity) {
      pushToast(`${section.name} is at capacity (${currentCount}/${capacity}) — increase capacity or choose a different section`, 'error');
      return;
    }
    setStudents((prev) => prev.map((s) => (s.id === studentId ? { ...s, sectionId } : s)));
    pushToast(`${student ? student.name : 'Student'} placed in ${section ? section.name : 'section'}`, 'success');
  };

  const submitPublicApplication = (data) => {
    const id = `APP-${nextApplicantNum.current++}`;
    const applicant = {
      id,
      name: data.name,
      appliedGrade: data.grade,
      stage: 'New Applied',
      guardian: data.guardian,
      phone: data.phone,
      email: data.email,
      submitted: TODAY,
      rejected: false,
      returning: data.returning,
      linkedStudentId: data.linkedStudentId,
      documents: [
        { name: 'Birth Certificate', status: 'Pending' },
        { name: 'Prior Report Card', status: 'Pending' },
        { name: 'Immunization Record', status: 'Pending' },
      ],
    };
    setApplicants((prev) => [...prev, applicant]);
    pushToast(`New application received from ${data.name}`, 'success');
    return id;
  };

  const activeSchoolYearObj = schoolYears.find((y) => y.id === activeSchoolYearId) || schoolYears[0];
  const activeTermObj = activeSchoolYearObj?.terms.find((t) => t.id === activeTermId) || null;
  const activeSections = useMemo(
    () => sections.filter((s) => s.schoolYearId === activeSchoolYearId),
    [sections, activeSchoolYearId]
  );
  const pendingCount = applicants.filter((a) => !a.rejected && a.stage !== 'Enrolled').length;
  const unassignedCount = students.filter((s) => !s.sectionId).length;

  const setupSteps = [
    { key: 'instructors', label: 'Register instructor details', description: 'Add faculty and the subjects each one is qualified to teach.', nav: 'instructors', done: instructors.length > 0 },
    { key: 'schoolyear', label: 'Create a school year', description: 'Define the active academic year that sections and grading run under.', nav: 'schoolyear', done: schoolYears.some((y) => y.status === 'Active') },
    { key: 'sections', label: 'Create class sections', description: 'Group students by grade level into homeroom sections.', nav: 'sections', done: activeSections.length > 0 },
    { key: 'curriculum', label: 'Set up curriculum', description: 'Decide which subjects each grade level is required to take.', nav: 'curriculum', done: Object.values(curriculum).some((arr) => arr.length > 0) },
    { key: 'matching', label: 'Match instructors, students, and subjects', description: 'Assign a teacher to every subject and place students into sections.', nav: 'matching', done: unassignedCount === 0 && offerings.length > 0 && offerings.every((o) => o.instructorId) },
  ];

  const meta = VIEW_META[activeTab];
  const badges = { pending: pendingCount, unassigned: unassignedCount };

  const reportCardStudent = reportCardStudentId ? students.find((s) => s.id === reportCardStudentId) : null;
  if (reportCardStudent) {
    return (
      <>
        <ReportCard
          student={reportCardStudent}
          sections={sections}
          instructors={instructors}
          curriculum={curriculum}
          criteria={criteria}
          scores={scores}
          terms={activeSchoolYearObj?.terms || []}
          activeTermId={activeTermId}
          schoolYearLabel={activeSchoolYearObj?.label}
          onExit={() => setReportCardStudentId(null)}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (!currentUser) {
    return (
      <>
        <LoginScreen accounts={DEMO_ACCOUNTS} onLogin={setCurrentUser} />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (currentUser.role === 'parent') {
    return (
      <>
        <ParentPortal
          account={currentUser}
          student={students.find((s) => s.id === currentUser.studentId) || null}
          sections={sections}
          instructors={instructors}
          curriculum={curriculum}
          offerings={offerings}
          onViewReportCard={setReportCardStudentId}
          onLogout={() => setCurrentUser(null)}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  if (publicFormOpen) {
    return (
      <>
        <PublicApplyForm
          students={students}
          applicants={applicants}
          onSubmit={submitPublicApplication}
          onExit={() => setPublicFormOpen(false)}
        />
        <ToastStack toasts={toasts} onDismiss={dismissToast} />
      </>
    );
  }

  const visibleSubjects = currentUser.role === 'teacher'
    ? subjects.filter((s) => {
        const acct = instructors.find((i) => i.id === currentUser.instructorId);
        return acct ? acct.subjects.includes(s.name) : false;
      })
    : subjects;

  return (
    <div className="h-screen w-full flex bg-[#F7F3EC] text-[#22190F] font-sans antialiased overflow-hidden">
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed((v) => !v)}
        active={activeTab}
        onSelect={(k) => { setActiveTab(k); setMobileNavOpen(false); }}
        badges={badges}
        role={currentUser.role}
      />

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-[#22190F]/40" onClick={() => setMobileNavOpen(false)} />
          <div className="relative w-64 h-full bg-white animate-slide-in-left">
            <Sidebar collapsed={false} onToggle={() => setMobileNavOpen(false)} active={activeTab} onSelect={(k) => { setActiveTab(k); setMobileNavOpen(false); }} badges={badges} role={currentUser.role} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar
          title={meta.title}
          subtitle={meta.subtitle}
          onMobileMenu={() => setMobileNavOpen(true)}
          schoolYearLabel={activeSchoolYearObj?.label}
          termLabel={activeTermObj?.label}
          onSchoolYearClick={() => setActiveTab('schoolyear')}
          onOpenApplyForm={() => setPublicFormOpen(true)}
          currentUser={currentUser}
          onLogout={() => setCurrentUser(null)}
        />
        <main className="flex-1 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <DashboardView students={students} applicants={applicants} unassignedCount={unassignedCount} onNavigate={setActiveTab} />
          )}
          {activeTab === 'admissions' && (
            <AdmissionsView applicants={applicants} onOpen={setSelectedApplicant} onMove={moveApplicant} />
          )}
          {activeTab === 'students' && (
            <StudentsView students={students} sections={sections} onOpen={setSelectedStudent} />
          )}
          {activeTab === 'academic' && (
            <AcademicView
              students={students}
              sections={activeSections}
              curriculum={curriculum}
              offerings={offerings}
              instructors={instructors}
              subjects={visibleSubjects}
              activeTermLabel={activeTermObj?.label}
              terms={activeSchoolYearObj?.terms || []}
              activeTermId={activeTermId}
              criteria={criteria}
              scores={scores}
              canEditCriteria={currentUser.role === 'admin'}
              onUpdateScore={updateScore}
              onAddCategory={addGradingCategory}
              onUpdateCategory={updateGradingCategory}
              onDeleteCategory={deleteGradingCategory}
              onAddItem={addGradingItem}
              onUpdateItem={updateGradingItem}
              onDeleteItem={deleteGradingItem}
            />
          )}
          {activeTab === 'guide' && (
            <SetupGuideView steps={setupSteps} onNavigate={setActiveTab} />
          )}
          {activeTab === 'instructors' && (
            <InstructorsView instructors={instructors} subjects={subjects} onAdd={addInstructor} onEdit={updateInstructor} />
          )}
          {activeTab === 'schoolyear' && (
            <SchoolYearView
              schoolYears={schoolYears}
              activeSchoolYearId={activeSchoolYearId}
              activeTermId={activeTermId}
              onAdd={addSchoolYear}
              onSetActive={setActiveSchoolYear}
              onDelete={deleteSchoolYear}
              onAddTerm={addTerm}
              onSetActiveTerm={setActiveTerm}
              onDeleteTerm={deleteTerm}
            />
          )}
          {activeTab === 'sections' && (
            <SectionsView
              sections={sections}
              instructors={instructors}
              students={students}
              activeSchoolYear={activeSchoolYearObj}
              onAdd={addSection}
              onEdit={updateSection}
              onDelete={deleteSection}
            />
          )}
          {activeTab === 'curriculum' && (
            <CurriculumView
              subjects={subjects}
              curriculum={curriculum}
              onAddSubject={addSubject}
              onEditSubject={updateSubject}
              onDeleteSubject={deleteSubject}
              onToggleSubject={toggleCurriculumSubject}
            />
          )}
          {activeTab === 'matching' && (
            <MatchingView
              sections={activeSections}
              curriculum={curriculum}
              instructors={instructors}
              offerings={offerings}
              onUpdateOffering={updateOffering}
              students={students}
              onAssignStudent={assignStudentToSection}
            />
          )}
        </main>
      </div>

      <ApplicantDrawer
        applicant={selectedApplicant}
        students={students}
        onClose={() => setSelectedApplicant(null)}
        onApprove={approveApplicant}
        onReject={rejectApplicant}
      />
      <StudentSlideOver
        student={selectedStudent}
        sections={sections}
        instructors={instructors}
        curriculum={curriculum}
        offerings={offerings}
        onViewReportCard={(id) => { setSelectedStudent(null); setReportCardStudentId(id); }}
        onClose={() => setSelectedStudent(null)}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
