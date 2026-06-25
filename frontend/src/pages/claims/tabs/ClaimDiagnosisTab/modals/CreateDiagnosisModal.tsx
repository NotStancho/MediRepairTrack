// pages/claims/tabs/ClaimDiagnosisTab/modals/CreateDiagnosisModal.tsx

import { useState } from 'react';

import Modal from '../../../../../ui/Modal/Modal';
import ModalFooter from '../../../../../ui/Modal/ModalFooter';
import Button from '../../../../../ui/Button';
import FormField from '../../../../../ui/FormField';
import { inputBase } from '../../../../../ui/formStyles';
import Select from '../../../../../ui/Select';

import SimilaritySearchModeBadge from "../../../../../components/badges/SimilaritySearchModeBadge";

import { useAuth } from '../../../../../context/AuthContext';

import {
    createAutoDiagnosis,
    createManualDiagnosis
} from '../../../../../api/diagnosis/diagnosis';

import type {
    CreateAutoDiagnosisPayload,
    CreateManualDiagnosisPayload,
} from '../../../../../types/diagnosis/diagnosisPayloads';

import type { Diagnosis } from '../../../../../types/diagnosis/diagnosis';
import type { SimilaritySearchMode } from '../../../../../types/diagnosis/DSS/similaritySearchMode';

import {
    SIMILARITY_SEARCH_MODE_DESCRIPTIONS,
    SIMILARITY_SEARCH_MODE_LABELS,
    SIMILARITY_SEARCH_MODE_OPTIONS,
} from '../../../../../utils/similaritySearchModeLabels';

interface Props {
    claimId: number;
    onClose: () => void;
    onCreated: (d: Diagnosis) => void;
}

export default function CreateDiagnosisModal({
                                                 claimId,
                                                 onClose,
                                                 onCreated
                                             }: Props) {

    const { user } = useAuth();

    const isEngineer = user?.position === 'SERVICE_ENGINEER';
    const isManager = user?.position === 'MANAGER';

    const canManual = isEngineer || isManager;

    const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');
    const [similaritySearchMode, setSimilaritySearchMode] = useState<SimilaritySearchMode>('AUTO_HIERARCHICAL');

    const [form, setForm] = useState({
        preliminaryConclusion: '',
        estimatedCost: '',
        estimatedTimeHours: '',
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!user) return;

        setLoading(true);
        try {
            let res: Diagnosis;

            if (mode === 'AUTO') {
                const payload: CreateAutoDiagnosisPayload = {
                    claimId,
                    similaritySearchMode
                };
                res = await createAutoDiagnosis(payload);
            } else {
                const payload: CreateManualDiagnosisPayload = {
                    claimId,
                    engineerId: user.employeeId!,
                    preliminaryConclusion: form.preliminaryConclusion || undefined,
                    estimatedCost: form.estimatedCost
                        ? Number(form.estimatedCost)
                        : undefined,
                    estimatedTimeHours: form.estimatedTimeHours
                        ? Number(form.estimatedTimeHours)
                        : undefined,
                };

                res = await createManualDiagnosis(payload);
            }
            onCreated(res);

            setForm({
                preliminaryConclusion: '',
                estimatedCost: '',
                estimatedTimeHours: '',
            });

            onClose();

        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Створити діагностику"
            onClose={onClose}
            width="lg"
            backdrop="dim"
        >
            <div className="flex gap-2">
                <Button
                    variant={mode === 'AUTO' ? 'primary' : 'secondary'}
                    onClick={() => setMode('AUTO')}
                >
                    Автоматична
                </Button>

                {canManual && (
                    <Button
                        variant={mode === 'MANUAL' ? 'primary' : 'secondary'}
                        onClick={() => setMode('MANUAL')}
                    >
                        Ручна
                    </Button>
                )}
            </div>

            {mode === 'AUTO' && (
                <div className="space-y-3">
                    <div className="text-sm text-ink-muted">
                        Система автоматично сформує діагностику на основі аналізу опису несправності.
                    </div>

                    <FormField label="Стратегія пошуку схожих заявок">
                        <Select<SimilaritySearchMode, SimilaritySearchMode>
                            value={similaritySearchMode}
                            onChange={setSimilaritySearchMode}
                            options={SIMILARITY_SEARCH_MODE_OPTIONS}
                            getLabel={(mode) => SIMILARITY_SEARCH_MODE_LABELS[mode]}
                            getValue={(mode) => mode}
                            renderOption={(mode) =>
                                    <SimilaritySearchModeBadge mode={mode} shape="rounded" />
                            }
                            renderValue={(mode) =>
                                <SimilaritySearchModeBadge mode={mode} shape="rounded" />
                            }
                            placeholder="Оберіть режим пошуку"
                        />
                    </FormField>

                    <div className="rounded-lg border border-border bg-surface-muted px-3 py-2 text-xs text-ink-muted">
                        {SIMILARITY_SEARCH_MODE_DESCRIPTIONS[similaritySearchMode]}
                    </div>
                </div>
            )}

            {mode === 'MANUAL' && (
                <div className="space-y-3">
                    <FormField label="Попередній висновок">
                        <textarea
                            value={form.preliminaryConclusion}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    preliminaryConclusion: e.target.value,
                                })
                            }
                            className={`${inputBase} min-h-[80px] resize-none`}
                            placeholder="Опишіть попередній висновок..."
                        />
                    </FormField>

                    <div className="grid grid-cols-2 gap-2">
                        <FormField label="Оцінка вартості">
                            <input
                                type="number"
                                value={form.estimatedCost}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        estimatedCost: e.target.value,
                                    })
                                }
                                className={inputBase}
                                placeholder="₴"
                            />
                        </FormField>

                        <FormField label="Оцінка часу (год)">
                            <input
                                type="number"
                                value={form.estimatedTimeHours}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        estimatedTimeHours: e.target.value,
                                    })
                                }
                                className={inputBase}
                                placeholder="год"
                            />
                        </FormField>
                    </div>
                </div>
            )}

            <ModalFooter>
                <Button variant="secondary" onClick={onClose}>
                    Скасувати
                </Button>

                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Створення...' : 'Створити'}
                </Button>
            </ModalFooter>
        </Modal>
    );
}
