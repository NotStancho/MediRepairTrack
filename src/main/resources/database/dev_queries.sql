SELECT * FROM claim;
SELECT * FROM claim_employee;
SELECT * FROM claim_work;
SELECT * FROM claim_work_part;
SELECT * FROM claim_history;

SELECT * FROM claim_embedding;

SELECT * FROM part;

SELECT * FROM diagnosis;

SELECT * FROM diagnosis_prediction;
SELECT * FROM diagnosis_similarity_result;
SELECT * FROM diagnosis_prediction_work;
SELECT * FROM diagnosis_predicted_work_part;
SELECT * FROM diagnosis_prediction_defect;

SELECT * FROM delivery;

SELECT * FROM user;
SELECT * FROM employee;

SELECT * FROM client;
SELECT * FROM client_contract;

SELECT * FROM complexity_level;
SELECT * FROM repair_work;

SELECT * FROM equipment;
SELECT * FROM equipment_model;

SELECT * FROM invoice;
SELECT * FROM invoice_detail;

SELECT * FROM payment;

SELECT * FROM pricing_config;


SELECT
    fk_claim,
    embedding_vector AS embedding,
    dimension AS embedding_dimension,
    model_name,
    created_at
FROM claim_embedding;

SELECT
    fk_claim,
    LEFT(HEX(embedding_vector), 48) AS embedding_preview,
    dimension AS embedding_dimension,
    model_name
FROM claim_embedding
    LIMIT 5;

DROP DATABASE MediRepairTrack;
CREATE DATABASE MediRepairTrack;