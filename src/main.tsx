import ReactDOM from 'react-dom/client'
import {App} from "./App.tsx";
import {AuthProvider} from "./components/Auth0/Auth0Provider.tsx";

const storedAuthState = JSON.parse(localStorage.getItem("authState") ?? "{}");
const initialAuthState = {
    isAuthenticated: storedAuthState.isAuthenticated ?? false,
    idToken: storedAuthState.idToken ?? "",
};

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AuthProvider initialAuthState={initialAuthState}>
        <App />
    </AuthProvider>
)
