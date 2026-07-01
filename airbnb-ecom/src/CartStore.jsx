import { atom, useAtom } from "jotai";
import axios from "axios";
import { useJwt } from "./UserStore";

export const cartAtom = atom([]);

export const useCart = () => {
    const [cart, setCart] = useAtom(cartAtom);
    const { getJwt } = useJwt();

    // GET /api/cart
    const fetchCart = async () => {
        const jwt = getJwt();
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/cart", {
            headers: { Authorization: "Bearer " + jwt }
        });
        setCart(response.data.cart);
    };

    // POST /api/cart add a booking
    const addToCart = async (listingId, checkIn, checkOut, guests) => {
        const jwt = getJwt();
        await axios.post(
            import.meta.env.VITE_API_URL + "/api/cart",
            { listingId: listingId, checkIn: checkIn, checkOut: checkOut, guests: guests },
            { headers: { Authorization: "Bearer " + jwt } }
        );
        fetchCart();
    };

    // DELETE /api/cart/:cartId
    const removeFromCart = async (cartId) => {
        const jwt = getJwt();
        await axios.delete(import.meta.env.VITE_API_URL + "/api/cart/" + cartId, {
            headers: { Authorization: "Bearer " + jwt }
        });
        fetchCart();
    };

    const getCartTotal = () => {
        let total = 0;
        for (let item of cart) {
            total += item.nights * item.price_per_night;
        }
        return total.toFixed(2);
    };

    return { cart, fetchCart, addToCart, removeFromCart, getCartTotal };
};
