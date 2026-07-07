import { useEffect, useState } from "react";
import { Link } from "wouter";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useJwt } from "./UserStore";
import { useCart } from "./CartStore";
import { useFlashMessage } from "./FlashMessageStore";

const validationSchema = Yup.object({
    checkIn: Yup.string().required("Required"),
    checkOut: Yup.string().required("Required"),
    guests: Yup.number().min(1, "At least 1 guest").required("Required")
});

const reviewSchema = Yup.object({
    rating: Yup.number().required("Required"),
    comment: Yup.string().required("Please write a comment")
});

// the :id comes from the route -> wouter passes it as props.params
export default function ListingDetail(props) {
    const id = props.params.id;
    const [listing, setListing] = useState(null);

    const { getJwt } = useJwt();
    const { addToCart } = useCart();
    const { showMessage } = useFlashMessage();

    // fetch the listing (also called again after posting a review)
    const fetchListing = async () => {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/listings/" + id);
        setListing(response.data.listing);
    };

    useEffect(() => {
        fetchListing();
    }, [id]);

    if (!listing) {
        return <div className="container my-5">Loading...</div>;
    }

    const initialValues = { checkIn: "", checkOut: "", guests: 1 };
    const reviewInitialValues = { rating: 5, comment: "" };

    const handleSubmit = async (values, formikHelper) => {
        try {
            await addToCart(listing.listingId, values.checkIn, values.checkOut, values.guests);
            showMessage("Added to your cart", "success");
        } catch (e) {
            const msg = e.response && e.response.data ? e.response.data.error : "Could not add to cart";
            showMessage(msg, "danger");
        }
        formikHelper.setSubmitting(false);
    };

    // POST a review, then re-fetch the listing so the new review shows
    const handleReview = async (values, formikHelper) => {
        try {
            const jwt = getJwt();
            await axios.post(
                import.meta.env.VITE_API_URL + "/api/listings/" + id + "/reviews",
                { rating: values.rating, comment: values.comment },
                { headers: { Authorization: "Bearer " + jwt } }
            );
            showMessage("Thanks for your review", "success");
            formikHelper.resetForm();
            fetchListing();
        } catch (e) {
            const msg = e.response && e.response.data ? e.response.data.error : "Could not post review";
            showMessage(msg, "danger");
        }
        formikHelper.setSubmitting(false);
    };

    return (
        <div className="container detail-wrap my-4">
            {/* title + summary */}
            <h1 className="fw-bold mb-1">{listing.title}</h1>
            <p className="text-secondary mb-3">★ New · Entire place hosted on stayfinder</p>

            {/* hero image (fixed ratio, never stretched) */}
            <img src={listing.imageUrl} className="detail-img rounded-4 mb-4" alt={listing.title} />

            <div className="row g-4">
                {/* left column: details */}
                <div className="col-lg-7">
                    <h4 className="fw-bold mb-1">About this place</h4>
                    <p className="fs-6 lh-lg">{listing.description}</p>
                    <hr />

                    <h5 className="fw-bold mb-3">What this place offers</h5>
                    <div className="amenity-grid mb-1">
                        {listing.amenities.map((a) => (
                            <span key={a.amenitiesId} className="amenity-item">{a.amenitie_name}</span>
                        ))}
                    </div>
                    <hr />

                    <h5 className="fw-bold mb-3">Reviews</h5>
                    {listing.reviews.length === 0 && <p className="text-secondary">No reviews yet.</p>}
                    {listing.reviews.map((r) => (
                        <div key={r.reviewId} className="review-item">
                            <div className="review-avatar">{r.fullName.slice(0, 1)}</div>
                            <div>
                                <div className="fw-semibold">
                                    {r.fullName} <span className="text-warning">★ {r.rating}</span>
                                </div>
                                <div className="text-secondary small">{r.comment}</div>
                            </div>
                        </div>
                    ))}

                    {/* review form (only when logged in) */}
                    {getJwt() && (
                        <div className="mt-4">
                            <h6 className="fw-bold">Leave a review</h6>
                            <Formik initialValues={reviewInitialValues} validationSchema={reviewSchema} onSubmit={handleReview}>
                                {(formik) => (
                                    <Form>
                                        <div className="mb-2">
                                            <label className="form-label">Rating</label>
                                            <Field as="select" name="rating" className="form-select">
                                                <option value="5">5 - Excellent</option>
                                                <option value="4">4 - Good</option>
                                                <option value="3">3 - Okay</option>
                                                <option value="2">2 - Poor</option>
                                                <option value="1">1 - Bad</option>
                                            </Field>
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label">Comment</label>
                                            <Field as="textarea" name="comment" rows="2" className="form-control" />
                                            <ErrorMessage name="comment" component="div" className="text-danger small" />
                                        </div>
                                        <button type="submit" className="btn btn-rausch btn-sm" disabled={formik.isSubmitting}>
                                            Post review
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        </div>
                    )}
                </div>

                {/* right column: sticky booking card */}
                <div className="col-lg-5">
                    <div className="booking-card p-4">
                        <p className="mb-3">
                            <span className="price-strong fs-4">${listing.price_per_night}</span>
                            <span className="text-secondary"> / night</span>
                        </p>

                        {!getJwt() ? (
                            <p className="text-secondary mb-0">
                                Please <Link href="/login">log in</Link> to book this stay.
                            </p>
                        ) : (
                            <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
                                {(formik) => (
                                    <Form>
                                        <div className="mb-3">
                                            <label className="form-label">Check-in</label>
                                            <Field type="date" name="checkIn" className="form-control" />
                                            <ErrorMessage name="checkIn" component="div" className="text-danger small" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Check-out</label>
                                            <Field type="date" name="checkOut" className="form-control" />
                                            <ErrorMessage name="checkOut" component="div" className="text-danger small" />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Guests</label>
                                            <Field type="number" name="guests" min="1" className="form-control" />
                                            <ErrorMessage name="guests" component="div" className="text-danger small" />
                                        </div>
                                        <button type="submit" className="btn btn-rausch btn-lg w-100" disabled={formik.isSubmitting}>
                                            Add to cart
                                        </button>
                                        <p className="text-secondary small text-center mt-2 mb-0">You won't be charged yet</p>
                                    </Form>
                                )}
                            </Formik>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
