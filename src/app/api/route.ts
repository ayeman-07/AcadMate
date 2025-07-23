import { NextResponse } from "next/server";
import Subject from "@/models/exams/subject.model";
import { connectToDB } from "@/lib/db";
import Professor from "@/models/professor/professor.model";

export async function POST() {
  await connectToDB();

  const assignments = [
    // === EC 6th SEM ===
    {
      professorName: "Dr. Tanmay Dubey",
      subjectCode: "EC601",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Sudeep Sharma",
      subjectCode: "EC602",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Sudeep Sharma",
      subjectCode: "EC604",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Shriman Narayan",
      subjectCode: "EC603",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Ritesh Kumar",
      subjectCode: "EC602",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Archana Balmik",
      subjectCode: "EC605",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "EC606",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Nishad Deshpande",
      subjectCode: "EC604",
      batchCode: "UI22EC",
      semester: 6,
      year: "2025",
    },

    // === CS 6th SEM ===
    {
      professorName: "Dr. Reema Patel",
      subjectCode: "CS601",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Archana Balmik",
      subjectCode: "CS605",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Sudeep Sharma",
      subjectCode: "CS602",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Ritesh Kumar",
      subjectCode: "CS602",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Dr. Kaustubh Dhondge",
      subjectCode: "CS603",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "CS606",
      batchCode: "UI22CS",
      semester: 6,
      year: "2025",
    },

    // === EC 4th SEM ===
    {
      professorName: "Dr. Nishad Deshpande",
      subjectCode: "EC401",
      batchCode: "UI23EC",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Dr. Tanmay Dubey",
      subjectCode: "EC402",
      batchCode: "UI23EC",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Dr. Ritesh Kumar",
      subjectCode: "EC403",
      batchCode: "UI23EC",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "EC404",
      batchCode: "UI23EC",
      semester: 4,
      year: "2025",
    },

    // === CS 4th SEM ===
    {
      professorName: "Dr. Shriman Narayan",
      subjectCode: "CS401",
      batchCode: "UI23CS",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Dr. Archana Balmik",
      subjectCode: "CS402",
      batchCode: "UI23CS",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Dr. Sudeep Sharma",
      subjectCode: "CS403",
      batchCode: "UI23CS",
      semester: 4,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "CS404",
      batchCode: "UI23CS",
      semester: 4,
      year: "2025",
    },

    // === EC 2nd SEM ===
    {
      professorName: "Dr. Shriman Narayan",
      subjectCode: "EC201",
      batchCode: "UI24EC",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Dr. Reema Patel",
      subjectCode: "EC202",
      batchCode: "UI24EC",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Dr. Sudeep Sharma",
      subjectCode: "EC203",
      batchCode: "UI24EC",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "EC204",
      batchCode: "UI24EC",
      semester: 2,
      year: "2025",
    },

    // === CS 2nd SEM ===
    {
      professorName: "Dr. Tanmay Dubey",
      subjectCode: "CS201",
      batchCode: "UI24CS",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Dr. Nishad Deshpande",
      subjectCode: "CS202",
      batchCode: "UI24CS",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Dr. Kaustubh Dhondge",
      subjectCode: "CS203",
      batchCode: "UI24CS",
      semester: 2,
      year: "2025",
    },
    {
      professorName: "Nancy Sukhadia",
      subjectCode: "CS204",
      batchCode: "UI24CS",
      semester: 2,
      year: "2025",
    },
  ];
  

  try {

    for (const assign of assignments) {
      const professor = await Professor.findOne({ name: assign.professorName });
      const subject = await Subject.findOne({ code: assign.subjectCode });

      if (!professor || !subject) {
        throw new Error(
          `Missing professor or subject: ${assign.professorName}, ${assign.subjectCode}`
        );
      }

    //   const exists = await TeachingAssignment.findOne({
    //     professor: professor._id,
    //     subject: subject._id,
    //     batchCode: assign.batchCode,
    //     semester: assign.semester,
    //     year: assign.year,
    //   });

    //   if (!exists) {
    //     const record = await TeachingAssignment.create({
    //       professor: professor._id,
    //       subject: subject._id,
    //       batchCode: assign.batchCode,
    //       semester: assign.semester,
    //       year: assign.year,
    //     });
    //     results.push(record);
    //   }
    }

    return NextResponse.json({ message: "Teaching Assignments seeded successfully" }, { status: 201 });
    // return NextResponse.json(
    //   { message: "Teaching Assignments seeded", data: results },
    //   { status: 201 }
    // );
  } catch (error) {
    console.error("[SEED_TA_ERROR]", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}

// import { connectToDB } from "@/lib/db";
// import Professor from "@/models/professor/professor.model";
// import { NextResponse } from "next/server";

// // seed-route

// export const dynamic = "force-dynamic";

// const professors = [
//   {
//     name: "Dr. Tanmay Dubey",
//     email: "tanmay@iiitsurat.ac.in",
//     password: "tanmay123",
//     department: "EC",
//     phoneNumber: "9876543001",
//   },
//   {
//     name: "Dr. Sudeep Sharma",
//     email: "sudeep@iiitsurat.ac.in",
//     password: "sudeep123",
//     department: "EC",
//     phoneNumber: "9876543002",
//   },
//   {
//     name: "Dr. Shriman Narayan",
//     email: "shriman@iiitsurat.ac.in",
//     password: "shriman123",
//     department: "EC",
//     phoneNumber: "9876543003",
//   },
//   {
//     name: "Dr. Ritesh Kumar",
//     email: "ritesh@iiitsurat.ac.in",
//     password: "ritesh123",
//     department: "CS",
//     phoneNumber: "9876543004",
//   },
//   {
//     name: "Dr. Archana Balmik",
//     email: "archana@iiitsurat.ac.in",
//     password: "archana123",
//     department: "CS",
//     phoneNumber: "9876543005",
//   },
//   {
//     name: "Nancy Sukhadia",
//     email: "nancy@iiitsurat.ac.in",
//     password: "nancy123",
//     department: "CS",
//     phoneNumber: "9876543006",
//   },
//   {
//     name: "Dr. Nishad Deshpande",
//     email: "nishad@iiitsurat.ac.in",
//     password: "nishad123",
//     department: "EC",
//     phoneNumber: "9876543007",
//   },
//   {
//     name: "Dr. Reema Patel",
//     email: "reema@iiitsurat.ac.in",
//     password: "reema123",
//     department: "CS",
//     phoneNumber: "9876543008",
//   },
//   {
//     name: "Dr. Kaustubh Dhondge",
//     email: "kaustubh@iiitsurat.ac.in",
//     password: "kaustubh123",
//     department: "CS",
//     phoneNumber: "9876543009",
//   },
// ];

// export async function POST() {
//   try {
//     await connectToDB();

//     const created = [];
//     for (const prof of professors) {
//       const existing = await Professor.findOne({ email: prof.email });
//       if (!existing) {
//         const newProf = new Professor(prof);
//         await newProf.save();
//         created.push(newProf);
//       }
//     }

//     return NextResponse.json({
//       message: "Professors seeded successfully",
//       count: created.length,
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { error: (error as Error).message },
//       { status: 500 }
//     );
//   }
// }

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
//     subjectCode: "EC601",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "CS601",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "EC602",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Ritesh Kumar",
//     subjectCode: "CS601",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Archana Balmik",
//     subjectCode: "CS602",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Nancy Sukhadia",
//     subjectCode: "CS603",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Nishad Deshpande",
//     subjectCode: "EC602",
//     batchCode: "UI22EC",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Reema Patel",
//     subjectCode: "CS604",
//     batchCode: "UI22CS",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Archana Balmik",
//     subjectCode: "CS602",
//     batchCode: "UI22CS",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Sudeep Sharma",
//     subjectCode: "CS601",
//     batchCode: "UI22CS",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Ritesh Kumar",
//     subjectCode: "CS601",
//     batchCode: "UI22CS",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Dr. Kaustubh Dhondge",
//     subjectCode: "CS605",
//     batchCode: "UI22CS",
//     semester: 6,
//     year: "2025",
//   },
//   {
//     professorName: "Nancy Sukhadia",
//     subjectCode: "CS603",
//     batchCode: "UI22CS",
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

// // subject.seed.ts (or similar)
// const subjects = [
//   // === EC 20X ===
//   {
//     name: "Basic Electrical Engineering",
//     code: "EC201",
//     credits: 4,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Engineering Mathematics II",
//     code: "EC202",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Analog Electronics",
//     code: "EC203",
//     credits: 4,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Physics Lab",
//     code: "EC204",
//     credits: 2,
//     isElective: false,
//     isPractical: true,
//   },

//   // === EC 40X ===
//   {
//     name: "Microprocessors and Microcontrollers",
//     code: "EC401",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Control Systems",
//     code: "EC402",
//     credits: 4,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Communication Systems",
//     code: "EC403",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Digital Electronics Lab",
//     code: "EC404",
//     credits: 2,
//     isElective: false,
//     isPractical: true,
//   },

//   // === CS 20X ===
//   {
//     name: "Discrete Mathematics",
//     code: "CS201",
//     credits: 4,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Programming in C",
//     code: "CS202",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Engineering Chemistry",
//     code: "CS203",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "C Programming Lab",
//     code: "CS204",
//     credits: 2,
//     isElective: false,
//     isPractical: true,
//   },

//   // === CS 40X ===
//   {
//     name: "Operating Systems",
//     code: "CS401",
//     credits: 4,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Database Management Systems",
//     code: "CS402",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "Computer Organization",
//     code: "CS403",
//     credits: 3,
//     isElective: false,
//     isPractical: false,
//   },
//   {
//     name: "DBMS Lab",
//     code: "CS404",
//     credits: 2,
//     isElective: false,
//     isPractical: true,
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
