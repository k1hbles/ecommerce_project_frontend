import { useEffect, useState } from "react";
import axios from "axios";
import { useJwt } from "./UserStore";

export default function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const { getJwt } = useJwt();
    
    useEffect(() => {
        const fetchOrders = async () => {
            const jwt = getJwt();
            const response = await axios.get(import.meta.env.VITE_API_URL + "/api/orders", {
                headers: { Authorization: "Bearer " + jwt}
            });

            setOrders(response.data.orders);
        };
        fetchOrders();
    }, []);
    
    // payment status with bootstrap
    const statusClass = (status) => {
        if (status === "paid") return "text-bg-success";
        if (status === "pending") return "text-bg-warning";
        return "text-bg-danger";
    };

    return (
         <div className="container my-4">
            <h2 className="fw-bold mb-3">Your trips</h2>

            {orders.length === 0 ? (
                <p className="text-secondary">No bookings yet.</p>
            ) : (
                orders.map((o) => (
                    <div key={o.orderId} className="card mb-3">
                        <div className="card-body d-flex align-items-center">
                            <img
                                src={o.imageUrl}
                                alt={o.title}
                                className="rounded me-3 order-thumb"
                            />
                            <div className="flex-grow-1">
                                <h6 className="fw-bold mb-1">{o.title}</h6>
                                <div className="text-secondary small">
                                    {o.checkIn.slice(0, 10)} → {o.checkOut.slice(0, 10)}
                                </div>
                                <div>Total: <strong>${o.totalPrice.toFixed(2)}</strong></div>
                            </div>
                            <span className={`badge ${statusClass(o.paymentStatus)}`}>{o.paymentStatus}</span>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}