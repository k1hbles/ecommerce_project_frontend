import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useLocation } from "wouter";
import { useJwt } from "./UserStore";
import { useFlashMessage } from "./FlashMessageStore";

const validationSchema = Yup.object({
    email: Yup.string().email().required("required"),
    password: Yup.string().required("required")
});

export default function UserLogin() {
    const { setJwt } = useJwt();
    const [, setLocation] = useLocation();
    const { showMessage } = useFlashMessage();

    const initialValues = {email: "", password: ""};

    const handleSubmit = async (values, formikHelper) => {
        try {
            const response = await axios.post(import.meta.env.VITE_API_URL + "/api/users/login", values);
            setJwt(response.data.token);
            showMessage("Login successfull", "success");
            setLocation("/");
        } catch (e) {
            const msg = e.response && e.response.data ? e.response.data.error : "Login failed";
            showMessage(msg, "danger");
        }
        formikHelper.setSubmitting(false);
    };

    return (
        <div className="container mt-5 form-narrow">
            <h2 className="fw-bold mb-3">Login</h2>
            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                {(formik) => (
                    <Form>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <Field type="email" name="email" className="form-control" />
                            <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Password</label>
                            <Field type="password" name="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                        <button type="submit" className="btn btn-rausch" disabled={formik.isSubmitting}>
                            {formik.isSubmitting ? "Logging in..." : "Login"}
                        </button>
                    </Form>
                )}
            </Formik>
            <p className="text-secondary small mt-3">Demo: tester@example.com / password123</p>
        </div>
    )
}