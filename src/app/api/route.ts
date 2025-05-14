import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";
import { NextResponse } from "next/server";

// seed-route

export const dynamic = "force-dynamic";

const professors = [
  {
    name: "Dr. Tanmay Dubey",
    email: "tanmay@iiitsurat.ac.in",
    password: "tanmay123",
    department: "ECE",
    phoneNumber: "9876543001",
  },
  {
    name: "Dr. Sudeep Sharma",
    email: "sudeep@iiitsurat.ac.in",
    password: "sudeep123",
    department: "ECE",
    phoneNumber: "9876543002",
  },
  {
    name: "Dr. Shriman Narayan",
    email: "shriman@iiitsurat.ac.in",
    password: "shriman123",
    department: "ECE",
    phoneNumber: "9876543003",
  },
  {
    name: "Dr. Ritesh Kumar",
    email: "ritesh@iiitsurat.ac.in",
    password: "ritesh123",
    department: "CSE",
    phoneNumber: "9876543004",
  },
  {
    name: "Dr. Archana Balmik",
    email: "archana@iiitsurat.ac.in",
    password: "archana123",
    department: "CSE",
    phoneNumber: "9876543005",
  },
  {
    name: "Nancy Sukhadia",
    email: "nancy@iiitsurat.ac.in",
    password: "nancy123",
    department: "CSE",
    phoneNumber: "9876543006",
  },
  {
    name: "Dr. Nishad Deshpande",
    email: "nishad@iiitsurat.ac.in",
    password: "nishad123",
    department: "ECE",
    phoneNumber: "9876543007",
  },
  {
    name: "Dr. Reema Patel",
    email: "reema@iiitsurat.ac.in",
    password: "reema123",
    department: "CSE",
    phoneNumber: "9876543008",
  },
  {
    name: "Dr. Kaustubh Dhondge",
    email: "kaustubh@iiitsurat.ac.in",
    password: "kaustubh123",
    department: "CSE",
    phoneNumber: "9876543009",
  },
];
  

export async function POST() {
  try {
    await connectToDB();

    
    const created = [];
    for (const prof of professors) {
      const existing = await Professor.findOne({ email: prof.email });
      if (!existing) {
        const newProf = new Professor(prof);
        await newProf.save();
        created.push(newProf);
      }
    }

    return NextResponse.json({
      message: "Professors seeded successfully",
      count: created.length,
    });
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// import Professor from "@/models/professor/professor.model";
// import Subject from "@/models/exams/subject.model";
// import TeachingAssignment from "@/models/professor/teachingassignment.model";
// import { connectToDB } from "@/lib/db";

// export const dynamic = "force-dynamic"; // Avoid caching during seed

// // Raw seed data
// const teachingAssignmentsRaw = [
//   {
//     professorName: "Dr. Tanmay Dubey",
//     subjectCode: "ECE601",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "CS601",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "ECE602",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Ritesh Kumar",
//     subjectCode: "CS601",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Archana Balmik",
//     subjectCode: "CS602",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Nancy Sukhadia",
//     subjectCode: "CS603",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Nishad Deshpande",
//     subjectCode: "ECE602",
//     batchCode: "UI22ECE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Reema Patel",
//     subjectCode: "CS604",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Archana Balmik",
//     subjectCode: "CS602",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "CS601",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Ritesh Kumar",
//     subjectCode: "CS601",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Kaustubh Dhondge",
//     subjectCode: "CS605",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Nancy Sukhadia",
//     subjectCode: "CS603",
//     batchCode: "UI22CSE",
//     semester: 6,
//     year: "2025",
//   },
// ];

// export async function POST() {
//   try {
//     await connectToDB();

//     const professors = await Professor.find();
//     const subjects = await Subject.find();

//     const assignments = teachingAssignmentsRaw.map((assign) => {
//       const prof = professors.find((p) => p.name === assign.professorName);
//       const subj = subjects.find((s) => s.code === assign.subjectCode);

//       if (!prof || !subj) {
//         throw new Error(
//           `Missing professor or subject: ${assign.professorName}, ${assign.subjectCode}`
//         );
//       }

//       return {
//         professor: prof._id,
//         subject: subj._id,
//         batchCode: assign.batchCode,
//         semester: assign.semester,
//         year: assign.year,
//       };
//     });

//     const result = await TeachingAssignment.insertMany(assignments, {
//       ordered: false,
//     });

//     return NextResponse.json(
//       { message: "Teaching assignments seeded", result },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("[SEED_ERROR]", error);
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

// import { connectToDB }  from "@/lib/db";
// import Subject from "@/models/exams/subject.model";
// import { NextResponse } from "next/server";

// export const dynamic = "force-dynamic";

// const subjects = [
//   {
//     name: "Digital VLSI Design",
//     code: "ECE601",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Machine Learning",
//     code: "CS601",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Sensor and Instrumentation",
//     code: "ECE602",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Web Engineering",
//     code: "CS602",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "AVR",
//     code: "CS603",
//     credits: 2,
//     isElective: false,
//     isPractical: true,
//   },
//   {
//     name: "Information Security",
//     code: "CS604",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Data Mining and Data Warehousing",
//     code: "CS605",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
// ];

// export async function POST() {
//   try {
//     await connectToDB();

//     const result = await Subject.insertMany(subjects, { ordered: false });

//     return NextResponse.json({
//       message: "Subjects seeded successfully",
//       result,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }
