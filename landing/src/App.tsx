import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Docs } from "./pages/Docs";
import { Navbar } from "./components/sections/navbar";

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen bg-[#0a0a0a] text-white">
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
        </BrowserRouter>
    );
}
