import AppRouter from "./router";
import { AppProvider } from "./context/AppContext";
import "./styles/app.css";

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
