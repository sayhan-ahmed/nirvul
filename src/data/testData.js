export const DUMMY_QUESTIONS = [
  {
    _id: "q1",
    questionText: "কোনটি খাঁটি বাংলা উপসর্গ?",
    options: ["প্র", "পরা", "অজ", "সু"],
    correctAnswer: "অজ",
  },
  {
    _id: "q2",
    questionText: "ধ্বনি নির্দেশক চিহ্নকে কী বলে?",
    options: ["অক্ষর", "বর্ণ", "শব্দ", "বাক্য"],
    correctAnswer: "বর্ণ",
  },
  {
    _id: "q3",
    questionText: "কোন দুটি স্বরধ্বনির মিলে ‘ঐ’ হয়?",
    options: ["অ + ই", "অ + উ", "আ + উ", "অ + এ"],
    correctAnswer: "অ + ই",
  },
  {
    _id: "q4",
    questionText: "‘গবেষণা’ শব্দের সঠিক সন্ধি বিচ্ছেদ কোনটি?",
    options: ["গো + এষণা", "গবে + ষণা", "গব + এষণা", "গো + ষণা"],
    correctAnswer: "গো + এষণা",
  },
];

export const CLASSES = [
  { id: "9-10", name: "Class 9-10", active: true },
  { id: "11-12", name: "Class 11-12", active: false },
  { id: "admission", name: "Admission", active: false },
];

export const VERSIONS = [
  { id: "bangla", name: "Bangla Version", active: true },
  { id: "english", name: "English Version", active: true },
];

export const SUBJECT_DATA = {
  bangla: {
    common: [
      { id: "bangla1", name: "বাংলা ১ম পত্র", active: false },
      { id: "bangla2", name: "বাংলা ২য় পত্র", active: true },
      { id: "english1", name: "ইংরেজি ১ম পত্র", active: false },
      { id: "english2", name: "ইংরেজি ২য় পত্র", active: false },
      { id: "math", name: "গণিত", active: false },
      { id: "ict", name: "তথ্য ও যোগাযোগ প্রযুক্তি", active: false },
      { id: "religion", name: "ধর্ম ও নৈতিক শিক্ষা", active: false },
      { id: "bgs", name: "বাংলাদেশ ও বিশ্বপরিচয়", active: false },
    ],
    groups: [
      { id: "science", name: "বিজ্ঞান বিভাগ", active: true },
      { id: "commerce", name: "ব্যবসায় শিক্ষা বিভাগ", active: true },
      { id: "humanities", name: "মানবিক বিভাগ", active: true },
    ],
    groupSubjects: {
      science: [
        { id: "physics", name: "পদার্থবিজ্ঞান", active: false },
        { id: "chemistry", name: "রসায়ন", active: false },
        { id: "biology", name: "জীববিজ্ঞান", active: false },
        { id: "higher_math", name: "উচ্চতর গণিত", active: false },
      ],
      commerce: [
        { id: "accounting", name: "হিসাববিজ্ঞান", active: false },
        { id: "bus_ent", name: "ব্যবসায় উদ্যোগ", active: false },
        { id: "finance", name: "ফিন্যান্স ও ব্যাংকিং", active: false },
      ],
      humanities: [
        { id: "civics", name: "পৌরনীতি ও নাগরিকতা", active: false },
        {
          id: "history",
          name: "বাংলাদেশের ইতিহাস ও বিশ্বসভ্যতা",
          active: false,
        },
        { id: "geography", name: "ভূগোল ও পরিবেশ", active: false },
        { id: "economics", name: "অর্থনীতি", active: false },
      ],
    },
  },
  english: {
    common: [
      { id: "bangla1", name: "বাংলা ১ম পত্র", active: false },
      { id: "bangla2", name: "বাংলা ২য় পত্র", active: true },
      { id: "english1", name: "English 1st", active: false },
      { id: "english2", name: "English 2nd", active: false },
      { id: "math", name: "Mathematics", active: false },
      { id: "ict", name: "ICT", active: false },
      { id: "religion", name: "Religion and Moral Education", active: false },
      { id: "bgs", name: "Bangladesh and Global Studies", active: false },
    ],
    groups: [
      { id: "science", name: "Science", active: true },
      { id: "commerce", name: "Business Studies", active: true },
      { id: "humanities", name: "Humanities", active: true },
    ],
    groupSubjects: {
      science: [
        { id: "physics", name: "Physics", active: false },
        { id: "chemistry", name: "Chemistry", active: false },
        { id: "biology", name: "Biology", active: false },
        { id: "higher_math", name: "Higher Math", active: false },
      ],
      commerce: [
        { id: "accounting", name: "Accounting", active: false },
        { id: "bus_ent", name: "Business Entrepreneurship", active: false },
        { id: "finance", name: "Finance and Banking", active: false },
      ],
      humanities: [
        { id: "civics", name: "Civics and Citizenship", active: false },
        { id: "history", name: "History", active: false },
        { id: "geography", name: "Geography and Environment", active: false },
        { id: "economics", name: "Economics", active: false },
      ],
    },
  },
};
