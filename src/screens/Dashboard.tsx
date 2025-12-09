import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function Dashboard() {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <Header />
        </div>
    );
}