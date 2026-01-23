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
        <div className="min-h-screen flex items-center justify-center px-6 py-12">
            <div className="w-full max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface shadow-xl shadow-black/10 grid md:grid-cols-[1.1fr_1fr] animate-[fade-up_600ms_ease-out_both]">
                <div className="relative hidden md:flex flex-col justify-between p-8 bg-brand-strong text-white">
                    <div>
                        <div className="text-xs uppercase tracking-[0.35em] text-white/70">
                            MediRepairTrack
                        </div>
                        <h1 className="mt-4 text-3xl font-semibold leading-tight">
                            Керування сервісом без зайвих дій
                        </h1>
                        <p className="mt-3 text-sm text-white/80">
                            Облік заявок, рахунків і доставок в одному кабінеті.
                        </p>
                    </div>
                    <div className="text-xs text-white/70">
                        Єдиний простір для сервісу та клієнтів
                    </div>
                    <div className="absolute -top-16 -right-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
                    <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full bg-accent-soft" />
                </div>

                <div className="p-6 md:p-8 space-y-5">
                    <div className="space-y-1">
                        <h2 className="text-2xl font-semibold">
                            Вхід до системи
                        </h2>
                        <p className="text-sm text-ink-muted">
                            Використайте робочу пошту і пароль.
                        </p>
                    </div>

                    {error && (
                        <div className="text-danger text-sm">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="animate-[fade-up_500ms_ease-out_both]" style={{ animationDelay: '60ms' }}>
                            <InputField label="Email" required showRequired={submitted && !email} error={emailError}>
                                <Input
                                    type="email"
                                    placeholder="Наприклад maksym.ivanov@gmail.com"
                                    value={email}
                                    onChange={handleEmailChange}
                                    invalid={submitted && !email}
                                />
                            </InputField>
                        </div>

                        <div className="animate-[fade-up_500ms_ease-out_both]" style={{ animationDelay: '120ms' }}>
                            <InputField label="Пароль" required showRequired={submitted && !password} error={passwordError}>
                                <PasswordInput
                                    value={password}
                                    onChange={handlePasswordChange}
                                    invalid={submitted && !password}
                                    placeholder="Введіть ваш пароль"
                                />
                            </InputField>
                        </div>
                    </div>

                    <div className="relative group animate-[fade-up_500ms_ease-out_both]" style={{ animationDelay: '180ms' }}>
                        <Button
                            variant="primary"
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
                                    rounded bg-ink px-2 py-1
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
        </div>
    );
}
