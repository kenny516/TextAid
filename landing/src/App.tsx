import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { Home } from "./pages/Home";
import { Docs } from "./pages/Docs";
import { Navbar } from "./components/sections/navbar";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0a0a0a] text-white transition-colors">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route
                        path="/docs/*"
                        element={
                            <>
                                <Navbar />
                                <Docs />
                            </>
                        }
                    />
                </Routes>
            </div>
            <Analytics />
        </BrowserRouter>
    );
}
