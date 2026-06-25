-- ---------------------------------------------------------------------------------------------------------------------
-- 1. USERS
-- ---------------------------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Table `MediRepairTrack`.`user`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`user` (
  `id_user` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(254) NOT NULL COMMENT 'Електронна пошта (унікальна)',
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('CLIENT', 'EMPLOYEE', 'ADMIN') NOT NULL COMMENT 'Роль користувача в системі',
  `first_name` VARCHAR(45) NOT NULL,
  `middle_name` VARCHAR(45) NULL,
  `last_name` VARCHAR(45) NOT NULL,
  `phone` VARCHAR(20) NOT NULL COMMENT 'Контактний телефон користувача',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення запису',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата останнього оновлення запису',
  PRIMARY KEY (`id_user`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`client`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`client` (
  `id_client` INT NOT NULL AUTO_INCREMENT,
  `fk_user` INT NULL COMMENT 'Посилання на користувача, якщо клієнт має акаунт',
  `organization_name` VARCHAR(255) NOT NULL COMMENT 'Назва організації-клієнта',
  `organization_email` VARCHAR(254) NOT NULL COMMENT 'Офіційний email організації',
  `organization_phone_number` VARCHAR(20) NOT NULL COMMENT 'Телефон організації',
  `contact_person_name` VARCHAR(100) NULL COMMENT 'ПІБ контактної особи',
  `address` TEXT NOT NULL COMMENT 'Адрес організації',
  `notes` TEXT NULL,
  PRIMARY KEY (`id_client`),
  UNIQUE INDEX `fk_client_user1_idx` (`fk_user` ASC) VISIBLE,
  CONSTRAINT `fk_client_user1`
    FOREIGN KEY (`fk_user`)
    REFERENCES `MediRepairTrack`.`user` (`id_user`)
    ON DELETE SET NULL
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`employee` (
  `id_employee` INT NOT NULL AUTO_INCREMENT,
  `fk_user` INT NOT NULL,
  `position` ENUM('SERVICE_ENGINEER', 'MANAGER', 'COURIER', 'TECHNICIAN', 'SYSTEM') NOT NULL COMMENT 'Посада працівника',
  `rate_per_hour` DECIMAL(10,2) NOT NULL COMMENT 'Годинна ставка працівника',
  `specialization` VARCHAR(100) NOT NULL COMMENT 'Основна спеціалізація (тип обладнання)',
  `availability_status` ENUM('AVAILABLE', 'BUSY', 'ON_LEAVE', 'OFF_SHIFT', 'SICK') NOT NULL COMMENT 'Поточна доступність працівника',
  `hire_date` DATE NOT NULL COMMENT 'Дата найму',
  PRIMARY KEY (`id_employee`),
  UNIQUE INDEX `fk_employee_user1_idx` (`fk_user` ASC) VISIBLE,
  CONSTRAINT `fk_employee_user1`
    FOREIGN KEY (`fk_user`)
    REFERENCES `MediRepairTrack`.`user` (`id_user`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;

-- ---------------------------------------------------------------------------------------------------------------------
-- 2. REFERENCE / CATALOG TABLES
-- ---------------------------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Table `MediRepairTrack`.`equipment_model`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`equipment_model` (
  `id_model` INT NOT NULL AUTO_INCREMENT,
  `model_name` VARCHAR(100) NOT NULL COMMENT 'Модель обладнання',
  `manufacturer` VARCHAR(100) NOT NULL COMMENT 'Виробник',
  `type` ENUM('HEMOGLOBINOMETER', 'MICROSCOPE', 'ANALYZER', 'CENTRIFUGE', 'ELECTROCARDIOGRAPH', 'ULTRASOUND', 'XRAY') NOT NULL,
  `release_date` DATE NOT NULL COMMENT 'Дата виходу моделі на ринок',
  `description` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_model`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`equipment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`equipment` (
  `id_equipment` INT NOT NULL AUTO_INCREMENT,
  `fk_model` INT NOT NULL,
  `serial_number` VARCHAR(45) NOT NULL COMMENT 'Серійний номер обладнання',
  `purchase_date` DATE NOT NULL COMMENT 'Дата покупки обладнання',
  `price` DECIMAL(12,2) NOT NULL COMMENT 'Вартість обладнання',
  `description` TEXT NULL COMMENT 'Примітки щодо стану або комплектації',
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_equipment`),
  INDEX `fk_equipment_equipment_model1_idx` (`fk_model` ASC) VISIBLE,
  UNIQUE INDEX `uq_equipment_model_serial_number` (`fk_model` ASC, `serial_number` ASC) VISIBLE,
  CONSTRAINT `fk_equipment_equipment_model1`
    FOREIGN KEY (`fk_model`)
    REFERENCES `MediRepairTrack`.`equipment_model` (`id_model`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`part`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`part` (
  `id_part` INT NOT NULL AUTO_INCREMENT,
  `supplier_name` VARCHAR(45) NOT NULL COMMENT 'Постачальник запчастини',
  `part_code` VARCHAR(50) NOT NULL COMMENT 'Унікальний код запчастини (внутрішній)',
  `part_name` VARCHAR(100) NOT NULL COMMENT 'Назва запчастини',
  `stock_quantity` DECIMAL(10,3) NOT NULL COMMENT 'Кількість на складі',
  `price` DECIMAL(12,2) NOT NULL COMMENT 'Ціна за одиницю',
  `unit_name` VARCHAR(20) NOT NULL COMMENT 'Одиниця вимірювання (шт, л, м тощо)',
  `unit_type` ENUM('PIECE','FRACTIONAL') NOT NULL,
  `description` TEXT NULL COMMENT 'Опис та примітки',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата додавання',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата оновлення',
  PRIMARY KEY (`id_part`),
  UNIQUE INDEX `part_code_UNIQUE` (`part_code` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`defect_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`defect_category` (
  `id_defect_category` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `typical_symptoms` TEXT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_defect_category`)
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`complexity_level`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`complexity_level` (
  `id_complexity_level` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  PRIMARY KEY (`id_complexity_level`)
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`repair_work`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`repair_work` (
  `id_repair_work` INT NOT NULL AUTO_INCREMENT,
  `fk_complexity_level` INT NOT NULL,
  `name` VARCHAR(50) NOT NULL,
  `description` TEXT NOT NULL,
  `created_by_employee` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_repair_work`),
  UNIQUE KEY `unique_repair_work_name` (`name`),
  INDEX `fk_repair_work_complexity_idx` (`fk_complexity_level`),
  INDEX `fk_repair_work_employee_idx` (`created_by_employee`),
  CONSTRAINT `fk_repair_work_complexity`
    FOREIGN KEY (`fk_complexity_level`)
    REFERENCES `MediRepairTrack`.`complexity_level` (`id_complexity_level`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_repair_work_employee`
    FOREIGN KEY (`created_by_employee`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- -----------------------------------------------------
-- Table `MediRepairTrack`.`pricing_config`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`pricing_config` (
  `repair_type` ENUM('WAITING_DECISION', 'WARRANTY_REPAIR', 'POST_WARRANTY_REPAIR', 'DIAGNOSTIC', 'PREVENTIVE_REPAIR', 'URGENT_REPAIR', 'INSTALLATION', 'CALIBRATION', 'MAINTENANCE') NOT NULL COMMENT 'Тип ремонту, для якого застосовується тарифна конфігурація',
  `labor_price_per_hour` DECIMAL(12,2) NOT NULL COMMENT 'Базова ціна для клієнта за 1 годину виконання робіт (не є зарплатою працівника)',
  `labor_min_hours` DECIMAL(5,2) NULL COMMENT 'Мінімальна кількість оплачуваних годин для даного типу ремонту',
  `parts_coefficient` DECIMAL(5,2) NOT NULL COMMENT 'Коефіцієнт коригування вартості запчастин залежно від типу ремонту',
  `delivery_coefficient` DECIMAL(5,2) NOT NULL COMMENT 'Коефіцієнт коригування вартості доставки або виїзду інженера',
  `description` TEXT NULL COMMENT 'Опис тарифної політики для даного типу ремонту',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення тарифної конфігурації',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата останнього оновлення тарифної конфігурації',
  PRIMARY KEY (`repair_type`))
ENGINE = InnoDB;

-- ---------------------------------------------------------------------------------------------------------------------
-- 3. CLAIM CORE
-- ---------------------------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim` (
  `id_claim` INT NOT NULL AUTO_INCREMENT,
  `fk_client` INT NULL COMMENT 'Клієнт, який подав заявку',
  `fk_equipment` INT NOT NULL COMMENT 'Обладнання, яке потребує ремонту',
  `repair_type` ENUM('WAITING_DECISION', 'WARRANTY_REPAIR', 'POST_WARRANTY_REPAIR', 'DIAGNOSTIC', 'PREVENTIVE_REPAIR', 'URGENT_REPAIR', 'INSTALLATION', 'CALIBRATION', 'MAINTENANCE') NOT NULL COMMENT 'Тип ремонту',
  `status` ENUM('NEW', 'IN_REVIEW', 'ACCEPTED', 'REJECTED', 'IN_PROGRESS', 'ASSIGNED_TO_ENGINEER', 'WAITING_FOR_PARTS', 'COMPLETED', 'CANCELED') NOT NULL COMMENT 'Поточний стан заявки',
  `defect_description` TEXT NOT NULL COMMENT 'Опис несправності',
  `total_time_spent` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT 'Підсумок витрачених годин (кеш)',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення заявки',
  `closed_at` TIMESTAMP NULL COMMENT 'Дата завершення заявки',
  PRIMARY KEY (`id_claim`),
  INDEX `fk_claim_client_idx` (`fk_client` ASC) VISIBLE,
  INDEX `fk_claim_equipment1_idx` (`fk_equipment` ASC) VISIBLE,
  CONSTRAINT `fk_claim_client`
    FOREIGN KEY (`fk_client`)
    REFERENCES `MediRepairTrack`.`client` (`id_client`)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_equipment1`
    FOREIGN KEY (`fk_equipment`)
    REFERENCES `MediRepairTrack`.`equipment` (`id_equipment`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_history`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_history` (
  `id_claim_history` INT NOT NULL AUTO_INCREMENT,
  `fk_claim` INT NOT NULL COMMENT 'Посилання на заявку',
  `fk_employee` INT NOT NULL COMMENT 'Працівник, який виконав дію',
  `action_type` ENUM('STATUS_CHANGE', 'EMPLOYEE_ASSIGNMENT', 'WORK_LOG', 'COMMENT', 'SYSTEM_EVENT', 'PART_USED', 'DELIVERY_EVENT') NOT NULL COMMENT 'Тип події',
  `action_date` TIMESTAMP NOT NULL COMMENT 'Дата та час події',
  `action_description` TEXT NOT NULL COMMENT 'Опис події',
  PRIMARY KEY (`id_claim_history`),
  INDEX `fk_claim_history_claim1_idx` (`fk_claim` ASC) VISIBLE,
  INDEX `fk_claim_history_employee1_idx` (`fk_employee` ASC) VISIBLE,
  CONSTRAINT `fk_claim_history_claim1`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_history_employee1`
    FOREIGN KEY (`fk_employee`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_employee`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_employee` (
  `fk_claim` INT NOT NULL COMMENT 'Заявка, у якій брав участь працівник',
  `fk_employee` INT NOT NULL COMMENT 'Працівник, який виконував роботи',
  `role_in_claim` ENUM('LEAD', 'ASSISTANT', 'DIAGNOSTIC', 'INSTALLER', 'EXPERT') NOT NULL COMMENT 'Роль працівника у заявці',
  `hours_worked` DECIMAL(5,2) NOT NULL COMMENT 'Сумарний відпрацьований час',
  `notes` TEXT NULL,
  INDEX `fk_claim_employee_claim1_idx` (`fk_claim` ASC) VISIBLE,
  INDEX `fk_claim_employee_employee1_idx` (`fk_employee` ASC) VISIBLE,
  PRIMARY KEY (`fk_claim`, `fk_employee`),
  CONSTRAINT `fk_claim_employee_claim1`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_claim_employee_employee1`
    FOREIGN KEY (`fk_employee`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_work`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_work` (
  `id_claim_work` INT NOT NULL AUTO_INCREMENT,
  `fk_claim` INT NOT NULL,
  `fk_repair_work` INT NOT NULL,
  `fk_employee` INT NOT NULL,
  `time_spent` DECIMAL(5,2) NOT NULL,
  `note` TEXT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_claim_work`),
  INDEX `fk_crw_claim_idx` (`fk_claim`),
  INDEX `fk_crw_repair_work_idx` (`fk_repair_work`),
  INDEX `fk_crw_employee_idx` (`fk_employee`),
  CONSTRAINT `fk_crw_claim`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_crw_repair_work`
    FOREIGN KEY (`fk_repair_work`)
    REFERENCES `MediRepairTrack`.`repair_work` (`id_repair_work`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_crw_employee`
    FOREIGN KEY (`fk_employee`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_work_part`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_work_part` (
    `fk_claim_work` INT NOT NULL COMMENT 'Ремонтна робота, в якій використана запчастина',
    `fk_part` INT NOT NULL COMMENT 'Запчастина, яка була використана',
    `quantity` DECIMAL(10,3) NOT NULL COMMENT 'Кількість використаних одиниць',
    `created_at` TIMESTAMP NOT NULL COMMENT 'Дата додавання запчастини до роботи',
    `updated_at` TIMESTAMP NULL COMMENT 'Дата оновлення запису',
    INDEX `fk_claim_work_part_claim1_idx` (`fk_claim_work` ASC) VISIBLE,
    INDEX `fk_claim_work_part_part1_idx` (`fk_part` ASC) VISIBLE,
    PRIMARY KEY (`fk_claim_work`, `fk_part`),
    CONSTRAINT `fk_claim_work_part_claim1`
      FOREIGN KEY (`fk_claim_work`)
      REFERENCES `MediRepairTrack`.`claim_work` (`id_claim_work`)
      ON DELETE RESTRICT
      ON UPDATE CASCADE,
    CONSTRAINT `fk_claim_work_part_part1`
      FOREIGN KEY (`fk_part`)
      REFERENCES `MediRepairTrack`.`part` (`id_part`)
      ON DELETE RESTRICT
      ON UPDATE CASCADE
) ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_defect_category`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_defect_category` (
  `fk_claim` INT NOT NULL,
  `fk_defect_category` INT NOT NULL,
  `fk_employee` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_claim`, `fk_defect_category`),
  INDEX `fk_cdc_defect_idx` (`fk_defect_category`),
  INDEX `fk_cdc_employee_idx` (`fk_employee`),
  CONSTRAINT `fk_cdc_claim`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cdc_defect`
    FOREIGN KEY (`fk_defect_category`)
    REFERENCES `MediRepairTrack`.`defect_category` (`id_defect_category`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_cdc_employee`
    FOREIGN KEY (`fk_employee`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`claim_embedding`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`claim_embedding` (
  `fk_claim` INT NOT NULL,
  `vector_embedding` BLOB NOT NULL,
  `vector_dimension` INT NOT NULL,
  `model_name` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_claim`),
  CONSTRAINT `fk_claim_embedding_claim`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`delivery`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`delivery` (
  `id_delivery` INT NOT NULL AUTO_INCREMENT,
  `fk_claim` INT NOT NULL,
  `type` ENUM('CLIENT_DROP_OFF', 'CLIENT_PICKUP', 'COURIER_TO_SERVICE', 'SERVICE_TO_CLIENT', 'COURIER_INTER_CENTER', 'ENGINEER_ON_SITE', 'COURIER_RETURN_TO_CLIENT', 'OTHER') NOT NULL COMMENT 'Тип доставки',
  `provider` ENUM('NOVA_POSHTA', 'UKRPOSHTA', 'MEEST', 'SELF', 'ENGINEER', 'OTHER') NOT NULL COMMENT 'Хто здійснює доставку',
  `status` ENUM('CREATED', 'IN_TRANSIT', 'DELIVERED', 'FAILED', 'CANCELED') NOT NULL COMMENT 'Статус доставки',
  `tracking_code` VARCHAR(45) NULL COMMENT 'Трек-номер для поштових служб (NULL для виїзду інженера)',
  `distance_km` DECIMAL(10,2) NULL COMMENT 'Відстань у кілометрах (використовується ТІЛЬКИ для type = ENGINEER_ON_SITE)',
  `price_per_unit` DECIMAL(12,2) NULL COMMENT 'Ціна за 1 км (для ENGINEER_ON_SITE). NULL для поштових служб або самостійної доставки.',
  `price` DECIMAL(12,2) NULL COMMENT 'Повна вартість доставки (для курʼєрів та поштових сервісів). Ігнорується при ENGINEER_ON_SITE.',
  `description` TEXT NULL COMMENT 'Додаткові примітки щодо доставки',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення запису доставки',
  `performed_at` TIMESTAMP NULL COMMENT 'Дата фактичного виконання доставки',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата останнього оновлення',
  PRIMARY KEY (`id_delivery`),
  INDEX `fk_delivery_claim1_idx` (`fk_claim` ASC) VISIBLE,
  CONSTRAINT `fk_delivery_claim1`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- ---------------------------------------------------------------------------------------------------------------------
-- 4. BILLING / CONTRACTS
-- ---------------------------------------------------------------------------------------------------------------------

-- -----------------------------------------------------
-- Table `MediRepairTrack`.`client_contract`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`client_contract` (
  `id_contract` INT NOT NULL AUTO_INCREMENT,
  `fk_client` INT NOT NULL COMMENT 'Клієнт, який має контракт',
  `contract_name` VARCHAR(100) NOT NULL COMMENT 'Назва контракту',
  `contract_type` ENUM('BASIC', 'SILVER', 'GOLD', 'PLATINUM', 'CUSTOM') NOT NULL COMMENT 'Тип пакету обслуговування',
  `is_active` ENUM('ACTIVE', 'INACTIVE') NOT NULL COMMENT 'Статус дії контракту',
  `valid_from` DATE NOT NULL COMMENT 'Початок дії',
  `valid_to` DATE NOT NULL COMMENT 'Закінчення дії',
  `discount_labor` DECIMAL(5,2) NOT NULL COMMENT 'Знижка на роботу (%)',
  `discount_parts` DECIMAL(5,2) NOT NULL COMMENT 'Знижка на запчастини (%)',
  `discount_delivery` DECIMAL(5,2) NOT NULL COMMENT 'Знижка на доставку (%)',
  `notes` TEXT NULL COMMENT 'Додаткова інформація',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення контракту',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата оновлення',
  PRIMARY KEY (`id_contract`),
  INDEX `fk_client_contract_client1_idx` (`fk_client` ASC) VISIBLE,
  CONSTRAINT `fk_client_contract_client1`
    FOREIGN KEY (`fk_client`)
    REFERENCES `MediRepairTrack`.`client` (`id_client`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`invoice`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`invoice` (
  `id_invoice` INT NOT NULL AUTO_INCREMENT COMMENT 'Унікальний ідентифікатор рахунку',
  `fk_claim` INT NOT NULL COMMENT 'Посилання на заявку (Claim)',
  `invoice_number` VARCHAR(40) NOT NULL COMMENT 'Номер рахунку',
  `total_before_discount` DECIMAL(12,2) NULL COMMENT 'Сума до знижок (фіксується при виставленні)',
  `discount_amount` DECIMAL(12,2) NULL COMMENT 'Сума знижки за контрактом',
  `total_amount` DECIMAL(12,2) NOT NULL COMMENT 'Загальна сума рахунку',
  `total_paid` DECIMAL(12,2) NOT NULL COMMENT 'Сплачена сума',
  `status` ENUM('DRAFT', 'ISSUED', 'PARTIALLY_PAID', 'PAID', 'CANCELED', 'OVERDUE') NOT NULL COMMENT 'Статус рахунку',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення рахунку',
  `updated_at` TIMESTAMP NULL COMMENT 'Дата останнього оновлення рахунку',
  `due_at` TIMESTAMP NULL COMMENT 'Крайній термін оплати',
  `issued_at` TIMESTAMP NULL COMMENT 'Дата виставлення рахунку',
  `closed_at` TIMESTAMP NULL COMMENT 'Дата закриття рахунку або скасування рахунку',
  PRIMARY KEY (`id_invoice`),
  INDEX `fk_invoice_Claim_idx` (`fk_claim` ASC) VISIBLE,
  UNIQUE INDEX `invoice_number_UNIQUE` (`invoice_number` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_claim1`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`invoice_detail`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`invoice_detail` (
  `id_detail` INT NOT NULL AUTO_INCREMENT COMMENT 'Ідентифікатор деталі рахунку',
  `fk_invoice` INT NOT NULL COMMENT 'Посилання на рахунок (invoice)',
  `item_type` ENUM('LABOR', 'PARTS', 'TRANSPORT', 'OTHER') NOT NULL COMMENT 'Тип елемента (робота, запчастини, транспортування, інше)',
  `description` TEXT NOT NULL COMMENT 'Опис елемента',
  `quantity` DECIMAL(10,3) NOT NULL COMMENT 'Дробові одиниці (год, л, м...)',
  `unit_name` VARCHAR(20) NOT NULL COMMENT 'Одиниця вимірювання (год, шт, км, л, послуга тощо)',
  `price_per_unit` DECIMAL(12,2) NOT NULL COMMENT 'Ціна за одиницю',
  `total_price` DECIMAL(12,2) NOT NULL COMMENT 'Загальна вартість',
  PRIMARY KEY (`id_detail`),
  INDEX `fk_invoice_detail_invoice1_idx` (`fk_invoice` ASC) VISIBLE,
  CONSTRAINT `fk_invoice_detail_invoice1`
    FOREIGN KEY (`fk_invoice`)
    REFERENCES `MediRepairTrack`.`invoice` (`id_invoice`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`payment` (
  `id_payment` INT NOT NULL AUTO_INCREMENT COMMENT 'Ідентифікатор оплати',
  `fk_invoice` INT NOT NULL COMMENT 'Посилання на рахунок (invoice)',
  `amount` DECIMAL(12,2) NOT NULL COMMENT 'Сума оплати',
  `method` ENUM('CASH', 'CARD', 'BANK_TRANSFER', 'INVOICE_TRANSFER', 'OTHER') NOT NULL COMMENT 'Метод оплати',
  `status` ENUM('PENDING', 'COMPLETED', 'FAILED', 'CANCELED', 'REFUNDED', 'CHARGEBACK') NOT NULL COMMENT 'Статус оплати',
  `provider` VARCHAR(100) NULL COMMENT 'Назва платіжного провайдера або банку',
  `external_ref` VARCHAR(128) NULL COMMENT 'Зовнішній ID транзакції у платіжному шлюзі або банку',
  `paid_at` TIMESTAMP NULL COMMENT 'Дата та час здійснення оплати',
  `created_at` TIMESTAMP NOT NULL COMMENT 'Дата створення запису про оплату',
  PRIMARY KEY (`id_payment`),
  INDEX `fk_payment_invoice1_idx` (`fk_invoice` ASC) VISIBLE,
  CONSTRAINT `fk_payment_invoice1`
    FOREIGN KEY (`fk_invoice`)
    REFERENCES `MediRepairTrack`.`invoice` (`id_invoice`)
    ON DELETE CASCADE
    ON UPDATE CASCADE)
ENGINE = InnoDB;


-- ---------------------------------------------------------------------------------------------------------------------
-- 5. DIAGNOSIS / DSS
-- ---------------------------------------------------------------------------------------------------------------------


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis` (
  `id_diagnosis` INT NOT NULL AUTO_INCREMENT,
  `fk_engineer` INT NULL,
  `fk_claim` INT NOT NULL,
  `preliminary_conclusion` TEXT NOT NULL,
  `final_conclusion` TEXT NULL,
  `estimated_cost` DECIMAL(12,2) NOT NULL,
  `estimated_time_hours` DECIMAL(10,2) NOT NULL,
  `diagnosis_type` ENUM('AUTOMATED', 'MANUAL', 'HYBRID') NOT NULL,
  `status` ENUM('DRAFT', 'PREDICTED', 'CONFIRMED', 'REJECTED', 'ARCHIVED') NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  `confirmed_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_diagnosis`),
  INDEX `fk_diagnosis_engineer_idx` (`fk_engineer`),
  INDEX `fk_diagnosis_claim_idx` (`fk_claim`),
  CONSTRAINT `fk_diagnosis_engineer`
    FOREIGN KEY (`fk_engineer`)
    REFERENCES `MediRepairTrack`.`employee` (`id_employee`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_diagnosis_claim`
    FOREIGN KEY (`fk_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_prediction`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_prediction` (
  `id_prediction` INT NOT NULL AUTO_INCREMENT,
  `fk_diagnosis` INT NOT NULL,
  `fk_predicted_complexity_level` INT NOT NULL,
  `prediction_source` ENUM('AUTOMATED','MANUAL','HYBRID') NOT NULL,
  `predicted_cost` DECIMAL(12,2) NOT NULL,
  `predicted_time_hours` DECIMAL(10,2) NOT NULL,
  `prediction_explanation` TEXT NOT NULL,
  `predicted_warranty_probability` DECIMAL(5,4) NOT NULL,
  `confidence_score` DECIMAL(5,4) NOT NULL,
  `similarity_search_mode` ENUM('AUTO_HIERARCHICAL', 'SAME_MODEL', 'SAME_MANUFACTURER_AND_EQUIPMENT_TYPE', 'SAME_EQUIPMENT_TYPE', 'SAME_MANUFACTURER', 'ALL') NULL,
  `resolved_similarity_search_mode` ENUM('AUTO_HIERARCHICAL', 'SAME_MODEL', 'SAME_MANUFACTURER_AND_EQUIPMENT_TYPE', 'SAME_EQUIPMENT_TYPE', 'SAME_MANUFACTURER', 'ALL') NULL,
  `model_version` VARCHAR(50) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  `updated_at` TIMESTAMP NULL,
  PRIMARY KEY (`id_prediction`),
  INDEX `fk_prediction_diagnosis_idx` (`fk_diagnosis`),
  INDEX `fk_prediction_complexity_idx` (`fk_predicted_complexity_level`),
  CONSTRAINT `fk_prediction_diagnosis`
    FOREIGN KEY (`fk_diagnosis`)
    REFERENCES `MediRepairTrack`.`diagnosis` (`id_diagnosis`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_prediction_complexity`
    FOREIGN KEY (`fk_predicted_complexity_level`)
    REFERENCES `MediRepairTrack`.`complexity_level` (`id_complexity_level`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_prediction_defect`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_prediction_defect` (
  `fk_prediction` INT NOT NULL,
  `fk_defect_category` INT NOT NULL,
  `probability_score` DECIMAL(5,4) NOT NULL,
  `rank_position` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_prediction`, `fk_defect_category`),
  INDEX `fk_dpd_defect_idx` (`fk_defect_category`),
  CONSTRAINT `fk_dpd_prediction`
    FOREIGN KEY (`fk_prediction`)
    REFERENCES `MediRepairTrack`.`diagnosis_prediction` (`id_prediction`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_dpd_defect`
    FOREIGN KEY (`fk_defect_category`)
    REFERENCES `MediRepairTrack`.`defect_category` (`id_defect_category`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_prediction_work`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_prediction_work` (
  `fk_prediction` INT NOT NULL,
  `fk_repair_work` INT NOT NULL,
  `probability_score` DECIMAL(5,4) NOT NULL,
  `rank_position` INT NOT NULL,
  `predicted_time_spent` DECIMAL(5,2) NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_prediction`, `fk_repair_work`),
  INDEX `fk_dpw_repair_work_idx` (`fk_repair_work`),
  CONSTRAINT `fk_dpw_prediction`
    FOREIGN KEY (`fk_prediction`)
    REFERENCES `MediRepairTrack`.`diagnosis_prediction` (`id_prediction`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_dpw_repair_work`
    FOREIGN KEY (`fk_repair_work`)
    REFERENCES `MediRepairTrack`.`repair_work` (`id_repair_work`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_predicted_work_part`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_predicted_work_part` (
  `fk_prediction` INT NOT NULL,
  `fk_repair_work` INT NOT NULL,
  `fk_part` INT NOT NULL,
  `predicted_quantity` DECIMAL(10, 3) NOT NULL,
  `probability_score` DECIMAL(5,4) NOT NULL,
  `rank_position` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_prediction`, `fk_repair_work`, `fk_part`),
  INDEX `fk_dpwp_part_idx` (`fk_part`),
  CONSTRAINT `fk_dpwp_predicted_work`
    FOREIGN KEY (`fk_prediction`, `fk_repair_work`)
    REFERENCES `MediRepairTrack`.`diagnosis_prediction_work` (`fk_prediction`, `fk_repair_work`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_predicted_part_part`
    FOREIGN KEY (`fk_part`)
    REFERENCES `MediRepairTrack`.`part` (`id_part`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_similarity_result`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_similarity_result` (
  `fk_prediction` INT NOT NULL,
  `fk_similar_claim` INT NOT NULL,
  `similarity_score` DECIMAL(5,4) NOT NULL,
  `rank_position` INT NOT NULL,
  `created_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_prediction`,`fk_similar_claim`),
  INDEX `fk_similarity_prediction_idx` (`fk_prediction`),
  INDEX `fk_similarity_claim_idx` (`fk_similar_claim`),
  CONSTRAINT `fk_similarity_prediction`
    FOREIGN KEY (`fk_prediction`)
    REFERENCES `MediRepairTrack`.`diagnosis_prediction` (`id_prediction`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_similarity_claim`
    FOREIGN KEY (`fk_similar_claim`)
    REFERENCES `MediRepairTrack`.`claim` (`id_claim`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;


-- -----------------------------------------------------
-- Table `MediRepairTrack`.`diagnosis_evaluation`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `MediRepairTrack`.`diagnosis_evaluation` (
  `fk_prediction` INT NOT NULL,
  `fk_actual_defect_category` INT NOT NULL,
  `fk_actual_complexity_level` INT NOT NULL,
  `is_correct_category` BOOLEAN NOT NULL,
  `is_correct_complexity` BOOLEAN NOT NULL,
  `absolute_cost_error` DECIMAL(12,2) NOT NULL,
  `absolute_time_error` DECIMAL(10,2) NOT NULL,
  `evaluated_at` TIMESTAMP NOT NULL,
  PRIMARY KEY (`fk_prediction`),
  INDEX `fk_eval_defect_idx` (`fk_actual_defect_category`),
  INDEX `fk_eval_complexity_idx` (`fk_actual_complexity_level`),
  CONSTRAINT `fk_eval_prediction`
    FOREIGN KEY (`fk_prediction`)
    REFERENCES `MediRepairTrack`.`diagnosis_prediction` (`id_prediction`)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT `fk_eval_defect`
    FOREIGN KEY (`fk_actual_defect_category`)
    REFERENCES `MediRepairTrack`.`defect_category` (`id_defect_category`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE,
  CONSTRAINT `fk_eval_complexity`
    FOREIGN KEY (`fk_actual_complexity_level`)
    REFERENCES `MediRepairTrack`.`complexity_level` (`id_complexity_level`)
    ON DELETE RESTRICT
    ON UPDATE CASCADE
) ENGINE=InnoDB;
