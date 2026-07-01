import { useEffect, useState } from "react";
import { Link } from "wouter";
import axios from "axios";

// Category ids match the seeded categories table. Icons are just emoji.
const CATEGORIES = [
    { id: "", label: "All", icon: "🌍" },
    { id: 1, label: "Beachfront", icon: "🏖️" },
    { id: 2, label: "Cabins", icon: "🛖" },
    { id: 3, label: "City", icon: "🏙️" },
    { id: 4, label: "Countryside", icon: "🌾" },
    { id: 5, label: "Luxury", icon: "💎" }
];

export default function Homepage() {
    const [listings, setListings] = useState([]);
    const [category, setCategory] = useState("");
    const [search, setSearch] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // fetch listings with the current filters (the backend ignores empty ones)
    const fetchListings = async () => {
        const response = await axios.get(import.meta.env.VITE_API_URL + "/api/listings", {
            params: { category: category, search: search, maxPrice: maxPrice }
        });
        setListings(response.data.listings);
    };

    // run on first load, and again whenever the category changes
    useEffect(() => {
        fetchListings();
    }, [category]);

    return (
        <div className="container my-4">
            <div className="text-center mb-3">
                <h1 className="fw-bold mb-1">Find your next <span className="text-rausch">stay</span></h1>
                <p className="text-secondary">Unique homes, booked in a few clicks.</p>
            </div>

            {/* search pill */}
            <div className="searchbar mx-auto">
                <div className="searchbar-field grow">
                    <label>Where</label>
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search stays or places"
                    />
                </div>
                <div className="searchbar-field">
                    <label>Max price</label>
                    <input
                        type="number"
                        min="0"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="Any"
                    />
                </div>
                <button className="searchbar-btn" onClick={() => fetchListings()} aria-label="Search">🔍</button>
            </div>

            {/* category strip */}
            <div className="category-strip">
                {CATEGORIES.map((c) => (
                    <button
                        key={c.id}
                        className={`category-item ${category === c.id ? "active" : ""}`}
                        onClick={() => setCategory(c.id)}
                    >
                        <span className="category-icon">{c.icon}</span>
                        <span>{c.label}</span>
                    </button>
                ))}
            </div>

            {/* listings grid */}
            <div className="row">
                {listings.map((listing) => (
                    <div className="col-md-3 mb-4" key={listing.listingId}>
                        <Link href={"/listings/" + listing.listingId} className="text-decoration-none text-dark">
                            <div className="card listing-card h-100">
                                <img src={listing.imageUrl} className="card-img-top" alt={listing.title} />
                                <span className="card-heart">♥</span>
                                <div className="card-body px-2">
                                    <h6 className="card-title fw-bold mb-1">{listing.title}</h6>
                                    <p className="card-text text-secondary small mb-1 text-truncate">{listing.description}</p>
                                    <p className="card-text mb-0">
                                        <span className="price-strong">${listing.price_per_night}</span> / night
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
