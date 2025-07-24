
export const fetchEdxCourses = async (params = {}) => {
  console.log("Generating edX courses with params:", params);
  
  try {
    const page = params.page || 1;
    const limit = params.limit || 20;
    const searchTerm = params.search || "";
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    return generateEdxCourses(page, limit, searchTerm);
  } catch (error) {
    console.error("Error generating edX courses:", error);
    return getEdxSampleCourses().map(course => ({
      ...course,
      id: course.id.replace("edx_", ""),
      uuid: course.id.replace("edx_", ""),
    }));
  }
};
const formatPrice = (priceString) => {
  if (priceString === 'Free') return 'Free';
  
  const match = priceString.match(/^(\$|€|£)?(\d+(\.\d+)?)$/);
  if (!match) return priceString;
  
  const currencySymbol = match[1] || '';
  const price = parseFloat(match[2]);
  
  return `${currencySymbol}${price.toFixed(2)}`;
};
const IMAGE_COLLECTION = [
  "1517694712202-14dd9538aa97", "1505238680356-667803448bb6", "1498050108023-c5249f4df085",
  "1519389950473-47ba0277781c", "1515879218367-ccf91210fb6f", "1550439062-609e1531270e", 
  "1526374965328-7f61d3f18734", "1550592704-6c76defa9985", "1526378787940-e23863fee911",
  "1523050854058-8df90110c9f1", "1562774603-ef8a160532a2", "1519452635265-7b1e89b79efa",
  "1541339907198-e08756dedf3f", "1564981797816-1c086d47bb10", "1588072432836-e10032774350",
  "1434030216411-0b793f4b4173", "1513475382585-d06e58bcb0e0", "1522202176988-66273c2fd55f",
  "1434626881859-194d67b2b86f", "1532012197267-da84d19b27e5", "1532619187746-279bd36f90ac",
  "1522071820081-009f0129c71c", "1523289333132-177670bc5afa", "1522202176988-66273c2fd55f",
  "1517486430290-35657dacd6c8", "1522071901217-67cb4d1afacc", "1622675363733-63f357656629"
];
const getRandomImage = (index) => {
  const idx = index !== undefined ? index : Math.floor(Math.random() * IMAGE_COLLECTION.length);
  const imageId = IMAGE_COLLECTION[idx % IMAGE_COLLECTION.length];
  return `https://images.unsplash.com/photo-${imageId}?q=80&w=1400&auto=format&fit=crop`;
};
const generateEdxCourses = (page, limit, searchTerm) => {
  const courses = [];
  const baseCount = (page - 1) * limit;
  const totalCourses = page === 1 ? Math.min(limit, 10) : limit;
  
  const universities = [
    "Harvard University", "MIT", "Stanford University", "Berkeley", 
    "Princeton", "Oxford", "Cambridge", "Yale", "Columbia", "Cornell"
  ];
  
  const subjects = [
    "Computer Science", "Data Science", "Business", "Economics", 
    "Physics", "Mathematics", "Biology", "Psychology", "History", 
    "Political Science", "Engineering", "AI", "Machine Learning"
  ];
  
  const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"];
  const durations = ["4 weeks", "6 weeks", "8 weeks", "12 weeks", "16 weeks", "Self-paced"];
  
  for (let i = 0; i < totalCourses; i++) {
    const courseNumber = baseCount + i;
    const id = `edx_course_${courseNumber}`;
    const universityIndex = courseNumber % universities.length;
    const subjectIndex = Math.floor(courseNumber / 2) % subjects.length;
    const levelIndex = courseNumber % levels.length;
    const durationIndex = courseNumber % durations.length;
    const rawPrice = courseNumber % 3 === 0 ? "Free" : `$${(courseNumber % 15) * 10 + 9.99}`;
    const price = formatPrice(rawPrice);
    const enrollmentBase = courseNumber % 10;
    const enrollment = enrollmentBase < 3 ? `${enrollmentBase + 1}K+` : 
                      enrollmentBase < 6 ? `${enrollmentBase * 10 + 5}K+` :
                      `${enrollmentBase * 100 + 50}K+`;
    
    const imageIndex = (courseNumber + i) % IMAGE_COLLECTION.length;
    
    let title = `${subjects[subjectIndex]} ${courseNumber}: ${getCourseName(subjects[subjectIndex], courseNumber)}`;
    let description = `Learn ${subjects[subjectIndex]} with ${universities[universityIndex]}. This comprehensive course covers both theory and practice.`;
    
    let matchesSearch = false;
    
    if (searchTerm && searchTerm.length > 0) {
      if (courseNumber % 3 === 0) {
        title = `${searchTerm} - ${title}`;
        matchesSearch = true;
      } else if (courseNumber % 3 === 1) {
        description = `${description} Includes material on ${searchTerm}.`;
        matchesSearch = true;
      } else {
        matchesSearch = title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        subjects[subjectIndex].toLowerCase().includes(searchTerm.toLowerCase()) ||
                        universities[universityIndex].toLowerCase().includes(searchTerm.toLowerCase());
      }
      
      if (searchTerm.length > 0 && !matchesSearch) {
        continue;
      }
    }
    
    courses.push({
      id: id,
      uuid: id,
      name: title,
      title: title,
      short_description: description,
      image: getRandomImage(imageIndex),
      subjects: [subjects[subjectIndex]],
      level_type: levels[levelIndex],
      price: price,
      rating: 4.0 + (courseNumber % 10) / 10,
      enrollment_count: enrollment,
      owners: [{ name: universities[universityIndex] }],
      length: durations[durationIndex],
      lastUpdated: new Date(Date.now() - (courseNumber * 1000000)).toISOString().split('T')[0]
    });
  }
  
  if (searchTerm && courses.length === 0) {
    const courseNumber = baseCount;
    courses.push({
      id: `edx_course_search_${courseNumber}`,
      uuid: `edx_course_search_${courseNumber}`,
      name: `${searchTerm} - Special Course`,
      title: `${searchTerm} - Special Course`,
      short_description: `This course specifically covers topics related to ${searchTerm}.`,
      image: getRandomImage(courseNumber),
      subjects: ["Special Topics"],
      level_type: levels[courseNumber % levels.length],
      price: "Free",
      rating: 4.8,
      enrollment_count: "New",
      owners: [{ name: universities[courseNumber % universities.length] }],
      length: durations[courseNumber % durations.length],
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  }
  
  return courses;
};
const getCourseName = (subject, courseNumber) => {
  const subjectMap = {
    "Computer Science": [
      "Introduction to Programming", 
      "Algorithms and Data Structures", 
      "Software Engineering", 
      "Web Development", 
      "Mobile App Development"
    ],
    "Data Science": [
      "Data Analytics Fundamentals", 
      "Machine Learning Basics", 
      "Big Data Processing", 
      "Statistical Analysis", 
      "Data Visualization"
    ],
    "Business": [
      "Business Strategy", 
      "Marketing Fundamentals", 
      "Financial Analysis", 
      "Entrepreneurship", 
      "Management Skills"
    ],
    "Economics": [
      "Microeconomics", 
      "Macroeconomics", 
      "Economic Policy", 
      "International Trade", 
      "Development Economics"
    ],
    "Physics": [
      "Classical Mechanics", 
      "Electromagnetism", 
      "Quantum Physics", 
      "Thermodynamics", 
      "Astrophysics"
    ]
  };
  
  const courseNames = subjectMap[subject] || [
    "Fundamentals", 
    "Advanced Concepts", 
    "Practical Applications", 
    "Theory and Practice", 
    "Professional Skills"
  ];
  
  return courseNames[courseNumber % courseNames.length];
};
export const fetchEdxCourseDetails = async (courseId) => {
  try {
    console.log(`Generating details for edX course: ${courseId}`);
    
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const courseNumMatch = courseId.match(/(\d+)/);
    const courseNumber = courseNumMatch ? parseInt(courseNumMatch[1]) : Math.floor(Math.random() * 1000);
    
    const universities = [
      "Harvard University", "MIT", "Stanford University", "Berkeley", 
      "Princeton", "Oxford", "Cambridge", "Yale", "Columbia", "Cornell"
    ];
    
    const subjects = [
      "Computer Science", "Data Science", "Business", "Economics", 
      "Physics", "Mathematics", "Biology", "Psychology", "History", 
      "Political Science", "Engineering", "AI", "Machine Learning"
    ];
    
    const universityIndex = courseNumber % universities.length;
    const subjectIndex = Math.floor(courseNumber / 2) % subjects.length;
    const subject = subjects[subjectIndex];
    const university = universities[universityIndex];
    
    const courseNames = {
      "Computer Science": [
        "Introduction to Programming", 
        "Algorithms and Data Structures", 
        "Software Engineering", 
        "Web Development", 
        "Mobile App Development"
      ],
      "Data Science": [
        "Data Analytics Fundamentals", 
        "Machine Learning Basics", 
        "Big Data Processing", 
        "Statistical Analysis", 
        "Data Visualization"
      ]
    };
    
    const defaultNames = [
      "Fundamentals", 
      "Advanced Concepts", 
      "Practical Applications", 
      "Theory and Practice", 
      "Professional Skills"
    ];
    
    const courseNameOptions = courseNames[subject] || defaultNames;
    const courseName = courseNameOptions[courseNumber % courseNameOptions.length];
    const title = `${subject} ${courseNumber}: ${courseName}`;
    const rawPrice = courseNumber % 3 === 0 ? "Free" : `$${(courseNumber % 15) * 10 + 9.99}`;
    const price = formatPrice(rawPrice);
    
    return {
      id: courseId,
      uuid: courseId,
      name: title,
      title: title,
      instructorTitle: "Professor",
      instructorName: `Dr. ${["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller"][courseNumber % 7]}`,
      instructorImage: `https://images.unsplash.com/photo-${1550000000000 + (courseNumber * 1000)}?auto=format&fit=crop&w=300&q=80`,
      short_description: `Learn ${subject} with ${university}. This comprehensive course covers both theory and practice.`,
      description: `This ${subject} course offered by ${university} provides a thorough understanding of ${courseName}. You will learn essential concepts, tools, and methodologies used in the field, with a focus on practical applications and real-world examples. The course includes lectures, hands-on exercises, projects, and assessments to ensure a comprehensive learning experience.`,
      image: getRandomImage(courseNumber),
      subjects: [subject],
      level_type: ["Beginner", "Intermediate", "Advanced", "All Levels"][courseNumber % 4],
      price: price,
      rating: 4.0 + (courseNumber % 10) / 10,
      enrollment_count: `${(courseNumber % 10) * 10 + 5}K+`,
      owners: [{ name: university }],
      length: ["4 weeks", "6 weeks", "8 weeks", "12 weeks", "16 weeks", "Self-paced"][courseNumber % 6],
      language: "English",
      lastUpdated: new Date(Date.now() - (courseNumber * 1000000)).toISOString().split('T')[0],
      courseUrl: `https://www.edx.org/course/${courseId}`,
      whatYouWillLearn: [
        `Master fundamental theories and principles of ${subject}`,
        `Apply ${subject} concepts to real-world problems`,
        "Develop critical thinking and analytical skills",
        `Complete ${courseNumber % 2 === 0 ? "individual" : "group"} projects to reinforce learning`,
        `Use industry-standard tools and methodologies in ${subject}`
      ],
      curriculum: [
        {
          title: "Introduction to Concepts",
          lessons: ["Foundations", "History and Context", "Basic Principles"]
        },
        {
          title: "Core Techniques",
          lessons: ["Methodology", "Tools and Applications", "Case Studies"]
        },
        {
          title: "Advanced Topics",
          lessons: ["Emerging Trends", "Research Areas", "Future Directions"]
        },
        {
          title: "Practical Applications",
          lessons: ["Project Planning", "Implementation", "Evaluation", "Presentation"]
        }
      ],
      requirements: [
        `Basic understanding of ${subject.includes("Programming") || subject.includes("Computer") ? "programming concepts" : "the field"}`,
        "Dedication to learning new concepts",
        "Access to required software and resources",
        courseNumber % 2 === 0 ? `Prior experience with ${["Python", "R", "Excel", "Statistics", "Mathematics"][courseNumber % 5]} is recommended` : null
      ].filter(Boolean)
    };
  } catch (error) {
    console.error(`Error generating edX course details for ${courseId}:`, error);
    return getEdxSampleCourseDetails(courseId);
  }
};
export const fetchCourseraCourses = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let courses = getCourseraSampleCourses();
  
  if (params.search && params.search.length > 0) {
    const searchTerm = params.search.toLowerCase();
    courses = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) || 
      course.platform.toLowerCase().includes(searchTerm) || 
      course.instructor.toLowerCase().includes(searchTerm) || 
      course.category.toLowerCase().includes(searchTerm)
    );
    
    if (courses.length === 0) {
      courses = [
        {
          id: `coursera_search_${Date.now()}`,
          title: `${params.search} - Special Coursera Course`,
          platform: "Coursera",
          instructor: "Coursera Instructor",
          rating: 4.7,
          students: "New",
          price: "Free",
          image: getRandomImage(),
          category: "Special Topics",
          level: "All Levels",
          duration: "Self-paced",
          description: `This course specifically covers topics related to ${params.search}.`
        }
      ];
    }
  }
  
  return courses;
};
export const fetchCourseraCourseDetails = async (courseId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return getCourseraSampleCourseDetails(courseId);
};
export const fetchUdemyCourses = async (params = {}) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  let courses = getUdemySampleCourses();
  
  if (params.search && params.search.length > 0) {
    const searchTerm = params.search.toLowerCase();
    courses = courses.filter(course => 
      course.title.toLowerCase().includes(searchTerm) || 
      course.platform.toLowerCase().includes(searchTerm) || 
      course.instructor.toLowerCase().includes(searchTerm) || 
      course.category.toLowerCase().includes(searchTerm)
    );
    
    if (courses.length === 0) {
      courses = [
        {
          id: `udemy_search_${Date.now()}`,
          title: `${params.search} - Special Udemy Course`,
          platform: "Udemy",
          instructor: "Udemy Instructor",
          rating: 4.6,
          students: "New",
          price: formatPrice("$19.99"),
          image: getRandomImage(),
          category: "Special Topics",
          level: "All Levels",
          duration: "Self-paced",
          description: `This course specifically covers topics related to ${params.search}.`
        }
      ];
    }
  }
  
  return courses;
};
export const fetchUdemyCourseDetails = async (courseId) => {
  await new Promise(resolve => setTimeout(resolve, 300));
  
  return getUdemySampleCourseDetails(courseId);
};
export const fetchAllCourses = async (params = {}) => {
  try {
    console.log("fetchAllCourses called with params:", params);
    
    if (params.page && params.page > 1) {
      console.log(`Pagination request: Page ${params.page}, limit ${params.limit || 20}`);
      const edxCourses = await fetchEdxCourses({
        ...params,
        limit: params.limit || 20,
        page: params.page
      });
      console.log(`Pagination page ${params.page}: Fetched ${edxCourses.length} edX courses`);
      
      const processedEdxCourses = edxCourses.map(course => ({
        id: `edx_${course.id || course.uuid}`,
        title: course.name || course.title,
        platform: "edX",
        instructor: course.owners?.[0]?.name || "edX Instructor",
        rating: course.rating || 4.5,
        students: course.enrollment_count || "10K+",
        price: course.price || "Free",
        image: course.media?.image?.raw || course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
        category: course.subjects?.[0] || "Computer Science",
        level: course.level_type || "Beginner",
        duration: course.length || "8 weeks",
        description: course.short_description || "",
        originalData: course,
      }));
      
      return processedEdxCourses;
    }
    
    console.log("Initial fetch - getting courses from all platforms");
    const [edxCourses, courseraCourses, udemyCourses] = await Promise.all([
      fetchEdxCourses({...params, limit: params.limit || 10, page: 1}),
      fetchCourseraCourses(params),
      fetchUdemyCourses(params),
    ]);
    console.log(`Fetched: ${edxCourses.length} edX, ${courseraCourses.length} Coursera, ${udemyCourses.length} Udemy courses`);
    const processedEdxCourses = edxCourses.map(course => ({
      id: `edx_${course.id || course.uuid}`,
      title: course.name || course.title,
      platform: "edX",
      instructor: course.owners?.[0]?.name || "edX Instructor",
      rating: course.rating || 4.5,
      students: course.enrollment_count || "10K+",
      price: course.price || "Free",
      image: course.media?.image?.raw || course.image || "https://images.unsplash.com/photo-1517694712202-14dd9538aa97",
      category: course.subjects?.[0] || "Computer Science",
      level: course.level_type || "Beginner",
      duration: course.length || "8 weeks",
      description: course.short_description || "",
      originalData: course,
    }));
    return [...processedEdxCourses, ...courseraCourses, ...udemyCourses];
  } catch (error) {
    console.error("Error fetching all courses:", error);
    return [...getEdxSampleCourses(), ...getCourseraSampleCourses(), ...getUdemySampleCourses()];
  }
};
export const fetchCourseDetails = async (courseId) => {
  try {
    console.log(`Fetching course details for: ${courseId}`);
    
    if (courseId.startsWith("edx_")) {
      const edxId = courseId.replace("edx_", "");
      console.log(`Fetching edX course details for ID: ${edxId}`);
      return await fetchEdxCourseDetails(edxId);
    } else if (courseId.startsWith("coursera_")) {
      return await fetchCourseraCourseDetails(courseId);
    } else if (courseId.startsWith("udemy_")) {
      return await fetchUdemyCourseDetails(courseId);
    } else {
      console.error("Unknown course platform for ID:", courseId);
      return getSampleCourseDetails(courseId);
    }
  } catch (error) {
    console.error(`Error fetching course details for ${courseId}:`, error);
    return getSampleCourseDetails(courseId);
  }
};
const getEdxSampleCourses = () => [
  {
    id: "edx_cs50",
    title: "Introduction to Computer Science",
    platform: "edX",
    instructor: "Harvard University",
    rating: 4.9,
    students: "2.4M+",
    price: "Free",
    image: getRandomImage(0),
    category: "Computer Science",
    level: "Beginner",
    duration: "12 weeks"
  },
  {
    id: "edx_datascience",
    title: "Data Science Professional Certificate",
    platform: "edX",
    instructor: "IBM",
    rating: 4.6,
    students: "125K+",
    price: formatPrice("$99"),
    image: getRandomImage(1),
    category: "Data Science",
    level: "Advanced",
    duration: "10 weeks"
  },
  {
    id: "edx_uxdesign",
    title: "UX Design Professional Certificate",
    platform: "edX",
    instructor: "Google",
    rating: 4.5,
    students: "82K+",
    price: formatPrice("$39"),
    image: getRandomImage(2),
    category: "Design",
    level: "Intermediate",
    duration: "6 months"
  }
];
const getEdxSampleCourseDetails = (courseId) => {
  return {
    id: courseId,
    title: "Sample edX Course",
    platform: "edX",
    instructorName: "Professor Smith",
    instructorTitle: "Distinguished Professor",
    instructorImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop",
    rating: 4.7,
    students: "50K+",
    price: "Free",
    image: getRandomImage(3),
    category: "Computer Science",
    level: "Intermediate",
    duration: "8 weeks",
    lastUpdated: "January 2024",
    language: "English",
    description: "This is a comprehensive course that covers all aspects of the subject. You will learn both theoretical concepts and practical applications.",
    courseUrl: `https://www.edx.org/course/${courseId.replace("edx_", "")}`,
    whatYouWillLearn: [
      "Master fundamental theories and principles",
      "Apply concepts to real-world problems",
      "Develop critical thinking and analytical skills",
      "Complete hands-on projects to reinforce learning"
    ],
    curriculum: [
      {
        title: "Introduction to Concepts",
        lessons: ["Foundations", "History and Context", "Basic Principles"]
      },
      {
        title: "Core Techniques",
        lessons: ["Methodology", "Tools and Applications", "Case Studies"]
      },
      {
        title: "Advanced Topics",
        lessons: ["Emerging Trends", "Research Areas", "Future Directions"]
      }
    ],
    requirements: [
      "Basic understanding of the field",
      "Dedication to learning new concepts",
      "Access to required software and resources"
    ]
  };
};
const getCourseraSampleCourses = () => [
  {
    id: "coursera_machine-learning",
    title: "Machine Learning",
    platform: "Coursera",
    instructor: "Andrew Ng",
    rating: 4.9,
    students: "3.8M+",
    price: "Free",
    image: getRandomImage(4),
    category: "Computer Science",
    level: "Intermediate",
    duration: "11 weeks"
  },
  {
    id: "coursera_python-for-everybody",
    title: "Python for Everybody",
    platform: "Coursera",
    instructor: "University of Michigan",
    rating: 4.8,
    students: "1.2M+",
    price: formatPrice("$49"),
    image: getRandomImage(5),
    category: "Programming",
    level: "Beginner",
    duration: "8 weeks"
  },
  {
    id: "coursera_blockchain",
    title: "Blockchain Fundamentals",
    platform: "Coursera",
    instructor: "UC Berkeley",
    rating: 4.5,
    students: "215K+",
    price: formatPrice("$79"),
    image: getRandomImage(6),
    category: "Blockchain",
    level: "Intermediate",
    duration: "6 weeks"
  },
  {
    id: "coursera_business-analytics",
    title: "Business Analytics Specialization",
    platform: "Coursera",
    instructor: "Wharton School",
    rating: 4.6,
    students: "450K+",
    price: formatPrice("$99"),
    image: getRandomImage(7),
    category: "Business",
    level: "Intermediate",
    duration: "5 months"
  },
  {
    id: "coursera_deep-learning",
    title: "Deep Learning Specialization",
    platform: "Coursera",
    instructor: "deeplearning.ai",
    rating: 4.9,
    students: "750K+",
    price: formatPrice("$49"),
    image: getRandomImage(8),
    category: "AI",
    level: "Advanced",
    duration: "3 months"
  }
];
const getCourseraSampleCourseDetails = (courseId) => {
  const baseDetails = {
    instructorTitle: "Professor",
    instructorImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=300&auto=format&fit=crop",
    lastUpdated: "December 2023",
    language: "English",
    whatYouWillLearn: [
      "Master the fundamentals of the subject",
      "Apply theoretical knowledge to practical scenarios",
      "Develop professional skills valued in the industry",
      "Complete projects with real-world applications"
    ],
    curriculum: [
      {
        title: "Getting Started",
        lessons: ["Introduction", "Setup", "Basic Concepts"]
      },
      {
        title: "Core Concepts",
        lessons: ["Fundamental Principles", "Key Techniques", "Practice Exercises"]
      },
      {
        title: "Advanced Applications",
        lessons: ["Real-world Cases", "Implementation Strategies", "Final Project"]
      }
    ],
    requirements: [
      "Basic understanding of the subject area",
      "Computer with internet connection",
      "Dedication to completing assignments",
      "Time commitment of 5-10 hours per week"
    ]
  };
  switch (courseId) {
    case "coursera_machine-learning":
      return {
        ...baseDetails,
        id: courseId,
        title: "Machine Learning",
        platform: "Coursera",
        instructorName: "Andrew Ng",
        rating: 4.9,
        students: "3.8M+",
        price: "Free",
        image: getRandomImage(4),
        category: "Computer Science",
        level: "Intermediate",
        duration: "11 weeks",
        description: "This course provides a broad introduction to machine learning, data mining, and statistical pattern recognition. Topics include supervised learning, unsupervised learning, best practices in machine learning, and AI ethics.",
        courseUrl: "https://www.coursera.org/learn/machine-learning"
      };
    case "coursera_python-for-everybody":
      return {
        ...baseDetails,
        id: courseId,
        title: "Python for Everybody",
        platform: "Coursera",
        instructorName: "Charles Severance",
        rating: 4.8,
        students: "1.2M+",
        price: formatPrice("$49"),
        image: getRandomImage(5),
        category: "Programming",
        level: "Beginner",
        duration: "8 weeks",
        description: "This specialization introduces fundamental programming concepts including data structures, networked application program interfaces, and databases, using Python. You'll gain the foundational skills needed to write programs to solve complex problems.",
        courseUrl: "https://www.coursera.org/specializations/python"
      };
    case "coursera_blockchain":
      return {
        ...baseDetails,
        id: courseId,
        title: "Blockchain Fundamentals",
        platform: "Coursera",
        instructorName: "UC Berkeley Faculty",
        rating: 4.5,
        students: "215K+",
        price: formatPrice("$79"),
        image: getRandomImage(6),
        category: "Blockchain",
        level: "Intermediate",
        duration: "6 weeks",
        description: "This course provides a comprehensive overview of blockchain technology and its applications beyond cryptocurrencies. Learn about consensus mechanisms, smart contracts, and how blockchain is transforming industries.",
        courseUrl: "https://www.coursera.org/learn/blockchain-fundamentals"
      };
    default:
      return {
        ...baseDetails,
        id: courseId,
        title: "Coursera Course",
        platform: "Coursera",
        instructorName: "Coursera Instructor",
        rating: 4.7,
        students: "100K+",
        price: formatPrice("$59"),
        image: getRandomImage(9),
        category: "General",
        level: "All Levels",
        duration: "4-6 weeks",
        description: "This is a comprehensive Coursera course that will help you master the subject through video lectures, hands-on projects, and peer feedback.",
        courseUrl: `https://www.coursera.org/learn/${courseId.replace("coursera_", "")}`
      };
  }
};
const getUdemySampleCourses = () => [
  {
    id: "udemy_complete-web-dev",
    title: "The Complete Web Developer Course",
    platform: "Udemy",
    instructor: "Rob Percival",
    rating: 4.7,
    students: "650K+",
    price: formatPrice("$19.99"),
    image: getRandomImage(10),
    category: "Web Development",
    level: "Beginner",
    duration: "30 hours"
  },
  {
    id: "udemy_python-bootcamp",
    title: "Complete Python Bootcamp",
    platform: "Udemy",
    instructor: "Jose Portilla",
    rating: 4.6,
    students: "1.5M+",
    price: formatPrice("$14.99"),
    image: getRandomImage(11),
    category: "Programming",
    level: "All Levels",
    duration: "22 hours"
  },
  {
    id: "udemy_digital-marketing",
    title: "Complete Digital Marketing Course",
    platform: "Udemy",
    instructor: "Rob Percival & Daragh Walsh",
    rating: 4.5,
    students: "425K+",
    price: formatPrice("$24.99"),
    image: getRandomImage(12),
    category: "Marketing",
    level: "Beginner",
    duration: "20 hours"
  },
  {
    id: "udemy_ui-ux-design",
    title: "UI/UX Design Bootcamp",
    platform: "Udemy",
    instructor: "Daniel Walter Scott",
    rating: 4.8,
    students: "210K+",
    price: formatPrice("$29.99"),
    image: getRandomImage(13),
    category: "Design",
    level: "Intermediate",
    duration: "18 hours"
  },
  {
    id: "udemy_ethical-hacking",
    title: "Learn Ethical Hacking From Scratch",
    platform: "Udemy",
    instructor: "Zaid Sabih",
    rating: 4.6,
    students: "520K+",
    price: formatPrice("$34.99"),
    image: getRandomImage(14),
    category: "Cybersecurity",
    level: "Beginner to Advanced",
    duration: "24 hours"
  }
];
const getUdemySampleCourseDetails = (courseId) => {
  const baseDetails = {
    instructorTitle: "Instructor",
    instructorImage: "https://images.unsplash.com/photo-1544168190-79c17527004f?q=80&w=300&auto=format&fit=crop",
    lastUpdated: "January 2024",
    language: "English",
    whatYouWillLearn: [
      "Develop practical skills in the subject area",
      "Build real-world projects for your portfolio",
      "Learn industry best practices and workflows",
      "Gain confidence to apply your skills professionally"
    ],
    requirements: [
      "No prior experience needed (for beginner courses)",
      "Computer with internet connection",
      "Basic computer skills",
      "Willingness to practice and complete exercises"
    ],
    reviews: [
      {
        name: "Michael S.",
        rating: 5,
        date: "2 weeks ago",
        comment: "Incredible course with detailed explanations. The instructor really knows how to break down complex topics."
      },
      {
        name: "Sarah L.",
        rating: 4,
        date: "1 month ago",
        comment: "Very practical content. I was able to apply what I learned to my work immediately."
      },
      {
        name: "David R.",
        rating: 5,
        date: "2 months ago",
        comment: "Best online course I've taken. The projects were challenging but doable."
      }
    ]
  };
  switch (courseId) {
    case "udemy_complete-web-dev":
      return {
        ...baseDetails,
        id: courseId,
        title: "The Complete Web Developer Course",
        platform: "Udemy",
        instructorName: "Rob Percival",
        rating: 4.7,
        students: "650K+",
        price: formatPrice("$19.99"),
        image: getRandomImage(10),
        category: "Web Development",
        level: "Beginner",
        duration: "30 hours",
        description: "Learn web development from scratch! This comprehensive course covers HTML, CSS, JavaScript, PHP, MySQL and more. By the end, you'll be able to build any website you can imagine.",
        courseUrl: "https://www.udemy.com/course/the-complete-web-developer-course-2/",
        curriculum: [
          {
            title: "HTML Fundamentals",
            lessons: ["Basic Structure", "Text Elements", "Links and Images"]
          },
          {
            title: "CSS Styling",
            lessons: ["Selectors", "Box Model", "Layouts", "Responsive Design"]
          },
          {
            title: "JavaScript Essentials",
            lessons: ["Variables", "Functions", "DOM Manipulation", "Events"]
          },
          {
            title: "Back-End Development",
            lessons: ["PHP Basics", "MySQL Databases", "Authentication", "APIs"]
          }
        ]
      };
    case "udemy_python-bootcamp":
      return {
        ...baseDetails,
        id: courseId,
        title: "Complete Python Bootcamp",
        platform: "Udemy",
        instructorName: "Jose Portilla",
        rating: 4.6,
        students: "1.5M+",
        price: formatPrice("$14.99"),
        image: getRandomImage(11),
        category: "Programming",
        level: "All Levels",
        duration: "22 hours",
        description: "Learn Python like a professional! Start from the basics and go all the way to creating your own applications and games. This course includes practical exercises and real-world projects.",
        courseUrl: "https://www.udemy.com/course/complete-python-bootcamp/",
        curriculum: [
          {
            title: "Python Basics",
            lessons: ["Installation", "Variables", "Data Types", "Control Flow"]
          },
          {
            title: "Data Structures",
            lessons: ["Lists", "Dictionaries", "Tuples", "Sets"]
          },
          {
            title: "Functions and OOP",
            lessons: ["Function Basics", "Lambda Expressions", "Classes", "Inheritance"]
          },
          {
            title: "Advanced Topics",
            lessons: ["Decorators", "Generators", "Error Handling", "Modules"]
          }
        ]
      };
    default:
      return {
        ...baseDetails,
        id: courseId,
        title: "Udemy Course",
        platform: "Udemy",
        instructorName: "Udemy Instructor",
        rating: 4.7,
        students: "200K+",
        price: formatPrice("$24.99"),
        image: getRandomImage(15),
        category: "General",
        level: "All Levels",
        duration: "15 hours",
        description: "This comprehensive Udemy course covers everything you need to know about the subject. With hands-on projects and practical examples, you'll gain valuable skills that you can apply immediately.",
        courseUrl: `https://www.udemy.com/course/${courseId.replace("udemy_", "")}`,
        curriculum: [
          {
            title: "Getting Started",
            lessons: ["Introduction", "Setup", "Basic Concepts"]
          },
          {
            title: "Core Skills",
            lessons: ["Key Techniques", "Tools", "Practice"]
          },
          {
            title: "Real-World Projects",
            lessons: ["Project Planning", "Implementation", "Troubleshooting"]
          }
        ]
      };
  }
};
const getSampleCourseDetails = (courseId) => {
  if (courseId.startsWith("edx_")) {
    return getEdxSampleCourseDetails(courseId);
  } else if (courseId.startsWith("coursera_")) {
    return getCourseraSampleCourseDetails(courseId);
  } else if (courseId.startsWith("udemy_")) {
    return getUdemySampleCourseDetails(courseId);
  } else {
    return {
      id: courseId,
      title: "Sample Course",
      platform: "Online Learning",
      instructorName: "Expert Instructor",
      instructorTitle: "Instructor",
      instructorImage: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=300&auto=format&fit=crop",
      rating: 4.5,
      students: "10K+",
      price: "Free",
      image: getRandomImage(),
      category: "General",
      level: "All Levels",
      duration: "Self-paced",
      description: "This is a sample course description.",
      courseUrl: "https://example.com/course",
      language: "English",
      lastUpdated: "Recently",
      whatYouWillLearn: ["Learn key concepts", "Develop practical skills"],
      curriculum: [{ title: "Introduction", lessons: ["Getting Started"] }],
      requirements: ["No prior knowledge required"]
    };
  }
}; 