import * as Yup from "yup";

const validationCourseSchema = Yup.object({
  CourseName: Yup.object({
    en: Yup.string().required("Course name (English) is required"),
    ar: Yup.string().required("Course name (Arabic) is required"),
  }),
  CourseDescription: Yup.object({
    en: Yup.string().required("Course description (English) is required"),
    ar: Yup.string().required("Course description (Arabic) is required"),
  }),
  CourseDuration: Yup.string().required("Course duration is required"),
  DeadLine: Yup.date().nullable().required("Deadline is required"),
  CourseFees: Yup.number().nullable().required("Course fees are required"),
  ModeOfStudy: Yup.array().of(
    Yup.object({
      en: Yup.string().required("Mode of study (English) is required"),
      ar: Yup.string().required("Mode of study (Arabic) is required"),
    })
  ).min(1, "At least one mode of study is required"),
  Requirements: Yup.array().of(
    Yup.object({
      en: Yup.string().required("Requirement (English) is required"),
      ar: Yup.string().required("Requirement (Arabic) is required"),
    })
  ).min(1, "At least one requirement is required"),

});

export default validationCourseSchema;