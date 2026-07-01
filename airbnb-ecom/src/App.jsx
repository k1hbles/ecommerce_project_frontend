import "./App.css";
import { Route, Switch } from "wouter";

import Navbar from "./Navbar";
import FlashMessageDisplay from "./FlashMessageDisplay";
import Homepage from "./Homepage";
import ListingDetail from "./ListingDetail";
import UserLogin from "./UserLogin";
import RegisterPage from "./RegisterPage";
import ShoppingCartPage from "./ShoppingCartPage";
import OrdersPage from "./OrdersPage";

export default function App() {
    return (
        <>
            <Navbar />
            <FlashMessageDisplay />
            <Switch>
                <Route path="/" component={Homepage} />
                <Route path="/listings/:id" component={ListingDetail} />
                <Route path="/login" component={UserLogin} />
                <Route path="/register" component={RegisterPage} />
                <Route path="/cart" component={ShoppingCartPage} />
                <Route path="/orders" component={OrdersPage} />
            </Switch>
        </>
    );
}
