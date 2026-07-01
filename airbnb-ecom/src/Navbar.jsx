import { Link, useLocation } from "wouter";
import { useJwt } from "./UserStore";

export default function Navbar() {
    const { getJwt, clearJwt } = useJwt();
    const [, setLocation] = useLocation();
    const jwt = getJwt();

    const logout = () => {
        clearJwt();
        setLocation("/");
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
            <div className="container">
                <Link href="/" className="navbar-brand text-rausch">🏡 stayfinder</Link>
                <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                        <Link href="/" className="nav-link">Explore</Link>
                    </li>
                    {jwt && (
                        <li className="nav-item">
                            <Link href="/cart" className="nav-link">Cart</Link>
                        </li>
                    )}
                    {jwt && (
                        <li className="nav-item">
                            <Link href="/orders" className="nav-link">Trips</Link>
                        </li>
                    )}
                    {jwt ? (
                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={logout}>Logout</button>
                        </li>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link href="/login" className="nav-link">Login</Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/register" className="nav-link">Register</Link>
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    )
}