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

// the :id comes from the route -> wouter passes it as props.params
export default function ListingDetail(props) {
    const id = props.params.id;
    const [listing, setListing] = useState(null);

    const { getJwt } = useJwt();
    const { addToCart } = useCart();
    const { showMessage } = useFlashMessage();

    useEffect(() => {
        const fetchListing = async () => {
            const response = await axios.get(import.meta.env.VITE_API_URL + "/api/listings/" + id);
            setListing(response.data.listing);
        };
        fetchListing();
    }, [id]);

    if (!listing) {
        return <div className="container my-5">Loading...</div>;
    }

    const initialValues = { checkIn: "", checkOut: "", guests: 1 };

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
                                <div className="fw-semibold">{r.fullName}</div>
                                <div className="text-secondary small">Stayed here</div>
                            </div>
                        </div>
                    ))}
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
