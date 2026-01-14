import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getHomeRoute } from '../../utils/roleRedirect';

import Input from '../../ui/Input';
import InputField from '../../ui/InputField';
import PasswordInput from '../../ui/PasswordInput';
import Button from '../../ui/Button';

export default function LoginPage() {
    const { signIn } = useAuth();
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const isFormValid = email.trim() !== '' && password.trim() !== '';
    const isButtonDisabled = loading || !isFormValid;

    const emailError = submitted && !email ? 'Поле email є обовʼязковим' : undefined;
    const passwordError = submitted && !password ? 'Поле пароль є обовʼязковим' : undefined;

    const missingFields: string[] = [];

    if (!email.trim()) missingFields.push('email');
    if (!password.trim()) missingFields.push('пароль');

    const showHint = missingFields.length > 0 && !submitted;

    const hintText =
        missingFields.length === 1
            ? `Заповніть ${missingFields[0]}`
            : `Заповніть: ${missingFields.join(', ')}`;


    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
        if (error) setError(null);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
        if (error) setError(null);
    };

    const handleLogin = async () => {
        setSubmitted(true);

        if (!isFormValid) return;

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

                <InputField label="Email" required showRequired={submitted && !email} error={emailError}>
                    <Input
                        type="email"
                        placeholder="Наприклад maksym.ivanov@gmail.com"
                        value={email}
                        onChange={handleEmailChange}
                        invalid={submitted && !email}
                    />
                </InputField>

                <InputField label="Пароль" required showRequired={submitted && !password} error={passwordError}>
                    <PasswordInput
                        value={password}
                        onChange={handlePasswordChange}
                        invalid={submitted && !password}
                        placeholder="Введіть ваш пароль"
                    />
                </InputField>

                <div className="relative group">
                    <Button
                        variant="default"
                        disabled={isButtonDisabled}
                        onClick={handleLogin}
                        className="w-full"
                    >
                        {loading ? 'Вхід...' : 'Увійти'}
                    </Button>

                    {showHint && (
                        <div
                            className="
                                pointer-events-none
                                absolute -top-8 left-1/2 -translate-x-1/2
                                whitespace-nowrap
                                rounded bg-gray-800 px-2 py-1
                                text-xs text-white
                                opacity-0
                                transition
                                group-hover:opacity-100
                            "
                        >
                            {hintText}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
