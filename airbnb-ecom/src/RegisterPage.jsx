import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from "yup";
import axios from "axios";
import { useLocation } from "wouter";
import { useFlashMessage } from "./FlashMessageStore";

const validationSchema = Yup.object({
    fullName: Yup.string().required("Name is required"),
    email: Yup.string().email().required(),
    password: Yup.string().min(6, "At least 6 characters").required(),
    salutation: Yup.string().required(),
    country: Yup.string().required()
});

export default function RegisterPage() {
    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    const initialValues = {
        fullName: "",
        email: "",
        password: "",
        salutation: "",
        country: "",
    };

    const handleSubmit = async (values, formikHelper) => {
        try {
            await axios.post(import.meta.env.VITE_API_URL + "/api/users", values);
            showMessage("Your account has been created, please log in", "success");
            setLocation("/login");
        } catch (e) {
            const msg = e.response && e.response.data ? e.response.data.error : "Registration failed";
            showMessage(msg, "danger");
        }
        formikHelper.setSubmitting(false);
    };

    return (
        <div className="container mt-5 form-narrow">
            <h2 className="fw-bold mb-3">Register</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {(formik) => (
                    <Form>
                        <div className="mb-3">
                            <label className="form-label">Full name</label>
                            <Field type="text" name="fullName" className="form-control" />
                            <ErrorMessage name="fullName" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <Field type="text" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <Field type="password" name="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Salutation</label>
                            <Field as="select" name="salutation" className="form-select">
                                <option value="">Select...</option>
                                <option value="Mr">Mr</option>
                                <option value="Ms">Ms</option>
                                <option value="Mrs">Mrs</option>
                                <option value="Dr">Dr</option>
                            </Field>
                            <ErrorMessage name="salutation" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Country</label>
                            <Field type="text" name="country" className="form-control" />
                            <ErrorMessage name="country" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-rausch" disabled={formik.isSubmitting}>
                            Register
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    )
}