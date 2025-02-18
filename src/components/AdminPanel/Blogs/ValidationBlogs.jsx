import * as Yup from "yup";

const validationBlogSchema = Yup.object({
  blogTitle: Yup.object({
    en: Yup.string().required("Blog title (English) is required"),
    ar: Yup.string().required("Blog title (Arabic) is required"),
  }),
  blogSubtitle: Yup.object({
    en: Yup.string().required("Blog subtitle (English) is required"),
    ar: Yup.string().required("Blog subtitle (Arabic) is required"),
  }),
  blogDescription: Yup.object({
    en: Yup.string().required("Blog description (English) is required"),
    ar: Yup.string().required("Blog description (Arabic) is required"),
  }),
  blogRelated: Yup.array()
    .of(
      Yup.object({
        en: Yup.string().required("Related blog (English) is required"),
        ar: Yup.string().required("Related blog (Arabic) is required"),
      })
    )
    .min(1, "At least one related blog is required"),
});

export default validationBlogSchema;
