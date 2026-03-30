package ua.nure.medirepairtrack.LoadTest;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;

@SpringBootTest
class LoadTest {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Test
    void loadTest_queryPerformance() {

        String query = """
            SELECT d.id_diagnosis, d.status, d.estimated_cost, c.id_claim
            FROM diagnosis d
            JOIN claim c ON d.fk_claim = c.id_claim
            WHERE d.status = 'CONFIRMED'
        """;

        int iterations = 1000;

        long start = System.currentTimeMillis();

        for (int i = 0; i < iterations; i++) {
            jdbcTemplate.queryForList(query);
        }

        long end = System.currentTimeMillis();

        long totalTime = end - start;
        double avgTime = (double) totalTime / iterations;

        System.out.println("Кількість ітерацій: " + iterations);
        System.out.println("Сумарний час виконання (мс): " + totalTime);
        System.out.println("Середній час виконання одного  запиту (мс): " + avgTime);
        assert avgTime < 1000;
    }
}