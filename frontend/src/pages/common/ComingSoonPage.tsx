interface Props {
    title: string;
}

export default function ComingSoonPage({ title }: Props) {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{title}</h1>
            <p className="text-slate-600">
                Сторінка-заглушка для демонстрації меню.
                Функціональність буде реалізована на наступних етапах.
            </p>
        </div>
    );
}
