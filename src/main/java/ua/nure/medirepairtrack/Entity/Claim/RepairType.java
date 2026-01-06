package ua.nure.medirepairtrack.Entity.Claim;

/**
 * Тип сервісного звернення клієнта.
 * Може включати ремонт, діагностику, калібрування, встановлення тощо.
 */
public enum RepairType {
    WAITING_DECISION,
    WARRANTY_REPAIR,
    POST_WARRANTY_REPAIR,
    DIAGNOSTIC,
    PREVENTIVE_REPAIR,
    URGENT_REPAIR,
    INSTALLATION,
    CALIBRATION,
    MAINTENANCE
}
