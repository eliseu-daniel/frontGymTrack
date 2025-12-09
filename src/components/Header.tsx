import { useApp } from "../context/AppContext";
import "../styles/app.css";
import Cards from "./Cards";

export default function Header() {
    const { user } = useApp();

    return (
        <div className="header-principal">
            <header className="w-full h-16 bg-bgLight flex-css items-center justify-end">
                <div className="user-name">
                    <img src="/userIcon.svg" alt="User Icon" />
                    {user?.nome}
                </div>
            </header>
            <main className="flex-css">
                <Cards />
            </main>
        </div>
    );
}