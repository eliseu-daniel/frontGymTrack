import { createContext, useContext, useState, type ReactNode } from "react";


export type User = {
    id: number;
    nome: string;
    email: string;
};


export type Paciente = {
    id: number;
    nome: string;
    email: string;
    plano: string;
    status: string;
};


interface AppContextType {
    user: User | null;
    setUser: (u: User | null) => void;


    pacienteSelecionado: Paciente | null;
    setPacienteSelecionado: (p: Paciente | null) => void;
}


const AppContext = createContext<AppContextType>({} as AppContextType);


export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>({
        id: 1,
        nome: "Eliseu",
        email: "admin@synchrofit.com",
    });


    const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);


    return (
        <AppContext.Provider value={{ user, setUser, pacienteSelecionado, setPacienteSelecionado }}>
            {children}
        </AppContext.Provider>
    );
};


export const useApp = () => useContext(AppContext);