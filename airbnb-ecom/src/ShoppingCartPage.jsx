import { useEffect } from "react";
import axios from "axios";
import { useCart } from "./CartStore";
import { useJwt } from "./UserStore";
import { useFlashMessage } from "./FlashMessageStore";

export default function ShoppingCartPage() {
    const { cart, fetchCart, removeFromCart, getCartTotal } = useCart();
    const { getJwt } = useJwt();
    const { showMessage } = useFlashMessage();

    useEffect(() => {
        fetchCart();
    }, []);

    // POST /api/checkout -> redirect the browser to Stripe (response.data.session.url)
    const checkout = async () => {
        try {
            const jwt = getJwt();
            const response = await axios.post(
                import.meta.env.VITE_API_URL + "/api/checkout",
                {},
                { headers: { Authorization: "Bearer " + jwt } }
            );
            window.location = response.data.session.url;
        } catch (e) {
            const msg = e.response && e.response.data ? e.response.data.error : "Checkout failed";
            showMessage(msg, "danger");
        }
    };

    return (
        <div className="container my-4">
            <h2 className="fw-bold mb-3">Your cart</h2>

            {cart.length === 0 ? (
                <p className="text-secondary">Your cart is empty.</p>
            ) : (
                <>
                    <ul className="list-group mb-3">
                        {cart.map((item) => (
                            <li key={item.cartId} className="list-group-item d-flex align-items-center">
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="rounded me-3 cart-thumb"
                                />
                                <div className="flex-grow-1">
                                    <h6 className="fw-bold mb-1">{item.title}</h6>
                                    <div className="text-secondary small">
                                        {item.checkIn.slice(0, 10)} → {item.checkOut.slice(0, 10)} · {item.guests} guest(s)
                                    </div>
                                    <div>
                                        {item.nights} night(s) × ${item.price_per_night} ={" "}
                                        <strong>${(item.nights * item.price_per_night).toFixed(2)}</strong>
                                    </div>
                                </div>
                                <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.cartId)}>
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="d-flex justify-content-between align-items-center">
                        <h4 className="mb-0">Total: ${getCartTotal()}</h4>
                        <button className="btn btn-rausch btn-lg" onClick={checkout}>Checkout</button>
                    </div>
                </>
            )}
        </div>
    );
}
