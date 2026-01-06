import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRoute } from '../../utils/roleRedirect';

export default function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            setError('Введіть email та пароль');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const loggedUser = await signIn(email, password);
            navigate(getHomeRoute(loggedUser), { replace: true });
        } catch {
            setError('Невірний email або пароль');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="w-96 p-6 bg-white border rounded-lg shadow space-y-4">
                <h1 className="text-xl font-bold text-center">
                    Вхід до системи
                </h1>

                {error && (
                    <div className="text-red-600 text-sm text-center">
                        {error}
                    </div>
                )}

                <input
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Пароль"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <button
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition disabled:opacity-50"
                    disabled={loading}
                    onClick={handleLogin}
                >
                    {loading ? 'Вхід...' : 'Увійти'}
                </button>
            </div>
        </div>
    );
}
