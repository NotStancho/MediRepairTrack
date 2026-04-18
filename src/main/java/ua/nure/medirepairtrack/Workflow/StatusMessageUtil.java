package ua.nure.medirepairtrack.Workflow;

import java.util.Set;

public class StatusMessageUtil {

    public static <E extends Enum<E>> String denied(
            String action,
            E current,
            Set<E> allowed
    ) {
        return String.format(
                "Неможливо %s у статусі %s. Дозволено у статусах: %s",
                action,
                current,
                allowed.stream()
                        .map(Enum::name)
                        .sorted()
                        .toList()
        );
    }

    public static <E extends Enum<E>> String invalidTransition(
            String entity,
            E from,
            E to
    ) {
        return String.format(
                "Недопустимий перехід статусу %s: %s → %s",
                entity,
                from,
                to
        );
    }
}

