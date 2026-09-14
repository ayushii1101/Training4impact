export const COURSES = {
  f1: {
    name: 'One Year Fellowship in Cardiac Critical Care',
    slug: 'cardiac-critical-care',
    amount: 59000,
  },
  f2: {
    name: 'One Year Fellowship in Cardio Diabetes',
    slug: 'cardio-diabetes',
    amount: 47200,
  },
  f3: {
    name: 'One Year Fellowship in Echocardiography',
    slug: 'echocardiography',
    amount: 59000,
  },
  f4: {
    name: 'One Year Fellowship in ECMO',
    slug: 'ecmo',
    amount: 59000,
  },
  f5: {
    name: 'Certificate Course in ECHO',
    slug: 'certificate-course-echo',
    amount: 5900,
  },
  f6: {
    name: 'One Year Fellowship in ECMO Specialist',
    slug: 'ecmo-specialist',
    amount: 47200,
  },
  f7: {
    name: 'Certificate Course in ECMO',
    slug: 'certificate-course-ecmo',
    amount: 5900,
  },
  f8: {
    name: 'One Year Fellowship in Echocardiography Specialist',
    slug: 'echocardiography-specialist',
    amount: 47200,
  },
  f9: {
    name: 'Artificial Intelligence in Critical Care',
    slug: 'ai-in-critical-care',
    amount: 7080,
  },
};

export const getCourseById = (courseId) => COURSES[courseId] ?? null;