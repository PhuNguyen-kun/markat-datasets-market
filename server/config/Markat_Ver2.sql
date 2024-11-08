DROP DATABASE markat_db;
CREATE DATABASE markat_db;
\c markat_db

--create table
CREATE TABLE Status (
    ID_status SERIAL PRIMARY KEY,
    Status_name VARCHAR(255),
    Time TIMESTAMP
);

CREATE TABLE Users (
    ID_user SERIAL PRIMARY KEY,
    Full_name VARCHAR(255),
    Password VARCHAR(255),
    Reliability INT,
    Kat FLOAT,
    Phone_number VARCHAR(15),
    Email VARCHAR(255) UNIQUE,
    Birth_date DATE,
    Join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    Current_location VARCHAR(255),
    Current_company VARCHAR(255),
    Primary_language VARCHAR(255),
    Desired_Payrate NUMERIC(10, 2),
	Available_time_per_week FLOAT,
    ID_status INT REFERENCES Status(ID_status)
);

CREATE TABLE Dataset (
    ID_dataset SERIAL PRIMARY KEY,
    Verified BOOLEAN,
    Avatar TEXT,
    Name_dataset VARCHAR(255),
    Voucher FLOAT,
    Data_type INT,
    Request_type VARCHAR(20),
    Slug TEXT
);

CREATE TABLE User_click (
    ID_user_click SERIAL PRIMARY KEY,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	ID_user INT REFERENCES Users(ID_user),
    ID_dataset INT REFERENCES Dataset(ID_dataset)
);

CREATE TABLE Version (
    ID_version SERIAL PRIMARY KEY,
    ID_dataset INT REFERENCES Dataset(ID_dataset),
	Price NUMERIC(10, 2),
    Number_parts INT,
    Reliability_minimum INT,
	Create_Date TIMESTAMP,
	Maximum_size NUMERIC(10, 5),
	Total_size NUMERIC(10, 5),
	Number_of_data INT,
    Data_sending_time_duration TIMESTAMP,
    Labeling_time_duration TIMESTAMP,
	Valuation_time_duration TIMESTAMP,
    Stock_percent FLOAT,
    Data_format INT,
    Status INT
);

CREATE TABLE Part (
    ID_part SERIAL PRIMARY KEY,
    ID_version INT REFERENCES Version(ID_version),
    Number_of_record Int
);

CREATE TABLE User_Version_Participation (
    ID_user_version_participation SERIAL PRIMARY KEY,
    ID_user INT REFERENCES Users(ID_user),
    ID_version INT REFERENCES Version(ID_version),
    Participation_Type VARCHAR(50),
    Join_date TIMESTAMP
);

CREATE TABLE Admin (
    ID_admin SERIAL PRIMARY KEY,
    Username VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
	Permission INT
);


CREATE TABLE Data_sending_request (
    ID_data_sending_request SERIAL PRIMARY KEY,
    ID_user INT REFERENCES Users(ID_user),
    Data_type INT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    ID_dataset INT REFERENCES Dataset(ID_dataset),
    Description TEXT
);

CREATE TABLE Data_buying_request (
    ID_data_buying_request SERIAL PRIMARY KEY,
    ID_user INT REFERENCES Users(ID_user),
    Public_data BOOLEAN,
    Description TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    Deposit  NUMERIC(10, 2),
	Price NUMERIC(10, 2),
	Due_Date TIMESTAMP,
    ID_dataset INT REFERENCES Dataset(ID_dataset),
    Data_type INT
);

CREATE TABLE Censorship_DBR (
    ID_dbr SERIAL PRIMARY KEY,
    ID_admin INT REFERENCES Admin(ID_admin),
    ID_data_buying_request INT REFERENCES Data_buying_request(ID_data_buying_request),
    Confirm BOOLEAN,
    Reason TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);


CREATE TABLE Censorship_DSR (
    ID_dsr SERIAL PRIMARY KEY,
    ID_admin INT REFERENCES Admin(ID_admin),
	ID_data_sending_request INT REFERENCES Data_sending_request(ID_data_sending_request),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);

CREATE TABLE Censorship_complete_version(
	ID_complete_ver SERIAL PRIMARY KEY,
    ID_admin INT REFERENCES Admin(ID_admin),
	ID_version INT REFERENCES Version(ID_version),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);


CREATE TABLE Expert_Register (
    ID_expert_register SERIAL PRIMARY KEY,
    ID_user INT REFERENCES Users(ID_user),
    File_CV TEXT
);

CREATE TABLE Authen (
    ID_authen SERIAL PRIMARY KEY,
    ID_admin INT REFERENCES Admin(ID_admin),
	ID_expert_register INT REFERENCES Expert_Register(ID_expert_register),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);

CREATE TABLE Expert (
    ID_expert SERIAL PRIMARY KEY,
    ID_user INT REFERENCES Users(ID_user),
    Field INT,
    Description TEXT
);


CREATE TABLE Dataset_Expert (
    ID_Dataset_Expert SERIAL PRIMARY KEY,
    ID_expert INT REFERENCES Expert(ID_expert),
	ID_dataset INT REFERENCES Dataset(ID_dataset)
);


CREATE TABLE Report (
    ID_report SERIAL PRIMARY KEY,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
	Content TEXT,
	ID_user INT REFERENCES Users(ID_user)
);

CREATE TABLE Valuation (
    ID_valuation SERIAL PRIMARY KEY,
    Time_valuation TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    ID_user INT REFERENCES Users(ID_user),
    ID_version INT REFERENCES Version(ID_version),
    Price NUMERIC(10, 2)
);

CREATE TABLE Transaction (
    ID_transaction SERIAL PRIMARY KEY,
    Time_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0),
    ID_buyer INT REFERENCES Users(ID_user),
    ID_version INT REFERENCES Version(ID_version)
);

CREATE TABLE TransactionDetails (
    ID_detail SERIAL PRIMARY KEY,
    ID_transaction INT REFERENCES Transaction(ID_transaction),
    ID_user INT REFERENCES Users(ID_user),
    ID_version INT REFERENCES Version(ID_version),
    Amount_earned DECIMAL(10, 2) NOT NULL,
    Role VARCHAR(50) CHECK (Role IN ('requester','labeler', 'sender')),
    Transaction_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP(0)
);


--trigger

-- Function: check_time_durations
-- This function checks the constraints for the fields Data_sending_time_duration,
-- Labeling_time_duration, and Valuation_time_duration in the Version table.
-- It ensures that Data_sending_time_duration < Labeling_time_duration < Valuation_time_duration.
-- If this condition is violated, the function raises an exception to prevent the operation.
CREATE OR REPLACE FUNCTION check_time_durations()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.Data_sending_time_duration > NEW.Labeling_time_duration OR
       NEW.Labeling_time_duration > NEW.Valuation_time_duration THEN
        RAISE EXCEPTION 'Constraint violation: Ensure that Data_sending_time_duration < Labeling_time_duration < Valuation_time_duration';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: check_time_durations_trigger
-- This trigger is set to execute before every INSERT or UPDATE operation on the Version table.
-- It calls the check_time_durations function to validate that the time durations meet the required constraint.
-- If the constraint is violated, the trigger prevents the operation by raising an exception.
CREATE TRIGGER check_time_durations_trigger
BEFORE INSERT OR UPDATE ON Version
FOR EACH ROW
EXECUTE FUNCTION check_time_durations();

-- Function: check_participation_time
-- This function ensures that the Join_date of a user in the User_Version_Participation table
-- is earlier than the end time of the respective activity in the Version table.
-- It checks the Join_date based on the Participation_Type (either 'Sending' or 'Labeling').
-- If Join_date is later than or equal to the end time of the activity, the function raises an exception.
CREATE OR REPLACE FUNCTION check_participation_time()
RETURNS TRIGGER AS $$
DECLARE
    end_time TIMESTAMP;
BEGIN
    IF NEW.Participation_Type = 'Sending' THEN
        SELECT Data_sending_time_duration INTO end_time
        FROM Version
        WHERE ID_version = NEW.ID_version;
        IF NEW.Join_date >= end_time THEN
            RAISE EXCEPTION 'Participation time constraint violation: Join_date must be earlier than Data_sending_time_duration for Sending activity';
        END IF;
    ELSIF NEW.Participation_Type = 'Labeling' THEN
        SELECT Labeling_time_duration INTO end_time
        FROM Version
        WHERE ID_version = NEW.ID_version;
        IF NEW.Join_date >= end_time OR NEW.Join_date <= (SELECT Data_sending_time_duration FROM Version WHERE ID_version = NEW.ID_version) THEN
            RAISE EXCEPTION 'Participation time constraint violation: Join_date for Labeling must be between Data_sending_time_duration and Labeling_time_duration';
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: trigger_check_participation_time
-- This trigger executes before every INSERT or UPDATE operation on the User_Version_Participation table.
-- It calls the check_participation_time function to ensure that the Join_date for Sending or Labeling
-- meets the constraints defined in the Version table.
-- If the condition is violated, the trigger raises an exception to prevent the operation.

CREATE TRIGGER trigger_check_participation_time
BEFORE INSERT OR UPDATE ON User_Version_Participation
FOR EACH ROW
EXECUTE FUNCTION check_participation_time();

CREATE OR REPLACE FUNCTION check_time_valuation()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.time_valuation <= (SELECT Labeling_time_duration
                              FROM version
                              WHERE version.ID_version = NEW.ID_version)
       OR NEW.time_valuation >= (SELECT Valuation_time_duration
                                 FROM version
                                 WHERE version.ID_version = NEW.ID_version) THEN
        RAISE EXCEPTION 'Validation error: time_valuation must be between Labeling_time_duration and Valuation_time_duration in the version table';
    END IF;

    IF EXISTS (
        SELECT 1
        FROM valuation
        WHERE ID_user = NEW.ID_user AND ID_version = NEW.ID_version
    ) THEN
        RAISE EXCEPTION 'Validation error: Each user can only have one valuation per version';
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: trigger_check_time_valuation
-- This trigger executes before every INSERT or UPDATE operation on the valuation table.
-- It calls the check_time_valuation function to validate that the time_valuation of the new
-- or updated record is between Labeling_time_duration and Valuation_time_duration in the associated Version record.
-- It also checks that each user can only have one valuation per version.
-- If the condition is violated, the trigger raises an exception to prevent the operation.
CREATE TRIGGER trigger_check_time_valuation
BEFORE INSERT OR UPDATE ON valuation
FOR EACH ROW
EXECUTE FUNCTION check_time_valuation();

--insert
INSERT INTO Status (Status_name, Time)
VALUES ('Active', '2023-01-01 09:00:00'),
('Inactive', '2023-01-02 10:15:00'),
('Pending', '2023-01-03 11:30:00'),
('Suspended', '2023-01-04 12:45:00'),
('Deleted', '2023-01-05 14:00:00'),
('Verified', '2023-01-06 15:15:00'),
('Unverified', '2023-01-07 16:30:00'),
('Banned', '2023-01-08 17:45:00'),
('Archived', '2023-01-09 19:00:00'),
('Locked', '2023-01-10 20:15:00');

INSERT INTO Users (Full_name, Password, Reliability, Kat, Phone_number, Email, Birth_date, Join_date, Current_location, Current_company, Primary_language, Desired_Payrate, Available_time_per_week, ID_status)
VALUES
('John Doe', 'password123', 85, 20000, '1234567890', 'johndoe@example.com', '1985-01-15', '2023-06-10 10:00:00', 'New York', 'TechCorp', 'English', 25.00, 40, 1),
('Jane Smith', 'password456', 90, 351222, '0987654321', 'janesmith@example.com', '1990-04-22', '2023-07-12 15:30:00', 'Los Angeles', 'HealthCare Inc.', 'English', 30.00, 35, 2),
('Alice Brown', 'pass789', 70, 1000000, '1231231234', 'alicebrown@example.com', '1988-09-10', '2023-05-19 09:45:00', 'Chicago', 'FinanceCorp', 'English', 28.50, 25, 1),
('Bob Johnson', 'pass101112', 75, 25000, '3213213210', 'bobjohnson@example.com', '1983-03-08', '2023-03-28 14:00:00', 'Houston', 'Consulting LLC', 'Spanish', 35.00, 40, 2),
('Carlos Garcia', 'pass131415', 80, 1500000, '4564564567', 'carlosgarcia@example.com', '1992-06-17', '2023-08-11 08:15:00', 'Miami', 'RealEstate Pro', 'Spanish', 22.00, 30, 1),
('Maria Lee', 'pass161718', 88, 10235.45, '7897897891', 'marialee@example.com', '1987-11-02', '2023-09-01 12:00:00', 'Seattle', 'TechCorp', 'Korean', 29.00, 40, 1),
('James White', 'pass192021', 65, 300500.8, '9879879876', 'jameswhite@example.com', '1995-02-15', '2023-04-30 10:30:00', 'Austin', 'StartupX', 'English', 20.00, 20, 3),
('Emma Wilson', 'pass222324', 95, 20100.94, '6546546543', 'emmawilson@example.com', '1993-08-30', '2023-05-15 13:20:00', 'San Francisco', 'HealthCare Inc.', 'French', 40.00, 50, 2),
('Michael Kim', 'pass252627', 72, 100200.2, '3216549870', 'michaelkim@example.com', '1991-07-09', '2023-07-20 09:30:00', 'Boston', 'FinanceCorp', 'Korean', 32.00, 40, 1),
('Olivia Davis', 'pass282930', 85, 153002.5, '7891234567', 'oliviadavis@example.com', '1989-10-19', '2023-06-05 11:45:00', 'Dallas', 'Consulting LLC', 'English', 27.50, 35, 2),
('Ethan Clark', 'pass313233', 60, 250000, '6549873210', 'ethanclark@example.com', '1984-12-13', '2023-09-15 16:10:00', 'Orlando', 'TechCorp', 'English', 24.00, 25, 3),
('Sophia Harris', 'pass343536', 78, 30000, '8529637412', 'sophiaharris@example.com', '1996-05-24', '2023-04-22 09:00:00', 'Denver', 'RealEstate Pro', 'Spanish', 26.00, 30, 1),
('Lucas Rodriguez', 'pass373839', 82, 200, '7531598526', 'lucasrodriguez@example.com', '1986-11-08', '2023-07-28 14:45:00', 'Phoenix', 'StartupX', 'Spanish', 33.00, 40, 2),
('Ava Martinez', 'pass404142', 90, 105.3, '9517532584', 'avamartinez@example.com', '1994-02-07', '2023-06-23 12:15:00', 'Las Vegas', 'HealthCare Inc.', 'English', 38.00, 45, 1),
('Logan Thompson', 'pass434445', 68, 20, '1597534862', 'logan.thompson@example.com', '1992-01-05', '2023-09-21 13:30:00', 'Atlanta', 'TechCorp', 'English', 21.00, 30, 2),
('Mia Nguyen', 'pass464748', 93, 1000, '7531234567', 'mian.nguyen@example.com', '1987-04-14', '2023-03-12 14:20:00', 'New Orleans', 'Consulting LLC', 'Vietnamese', 42.00, 50, 1),
('William Baker', 'pass495051', 70, 1500, '6549517532', 'williambaker@example.com', '1995-03-10', '2023-08-09 11:00:00', 'San Diego', 'FinanceCorp', 'English', 29.50, 35, 3),
('Amelia Perez', 'pass525354', 89, 10, '9876541230', 'ameliaperez@example.com', '1991-12-01', '2023-07-05 10:40:00', 'Houston', 'RealEstate Pro', 'Spanish', 34.00, 40, 2),
('Henry Carter', 'pass555657', 74, 0, '3211236547', 'henrycarter@example.com', '1988-06-22', '2023-06-10 08:55:00', 'Chicago', 'StartupX', 'English', 25.50, 30, 1),
('Isabella Ramirez', 'pass585960', 83, 0, '1596549871', 'isabellaramirez@example.com', '1990-09-15', '2023-05-08 16:50:00', 'Seattle', 'HealthCare Inc.', 'Spanish', 36.00, 45, 2),
('Daniel Green', 'pass616263', 67, 0, '7534569871', 'danielgreen@example.com', '1992-07-30', '2023-04-18 12:35:00', 'Phoenix', 'TechCorp', 'English', 23.00, 20, 3),
('Charlotte White', 'pass646566', 91, 0, '4567891234', 'charlottewhite@example.com', '1994-11-03', '2023-09-11 09:25:00', 'New York', 'Consulting LLC', 'French', 39.50, 50, 1),
('David Hernandez', 'pass676869', 77, 0, '9513571596', 'davidhernandez@example.com', '1986-05-28', '2023-08-19 08:45:00', 'Los Angeles', 'FinanceCorp', 'Spanish', 30.00, 40, 2),
('Harper King', 'pass707172', 65, 0, '9517896543', 'harperking@example.com', '1996-10-22', '2023-06-25 14:35:00', 'Miami', 'RealEstate Pro', 'English', 24.50, 25, 3),
('Matthew Wright', 'pass737475', 88, 100000000, '3579514562', 'matthewwright@example.com', '1989-08-13', '2023-05-03 11:10:00', 'Denver', 'StartupX', 'English', 35.00, 40, 1),
('Evelyn Scott', 'pass767778', 92, 15000, '1593574568', 'evelynscott@example.com', '1993-02-09', '2023-04-01 10:00:00', 'Boston', 'HealthCare Inc.', 'Spanish', 41.00, 50, 2),
('Jackson Adams', 'pass798081', 62, 12, '7537891596', 'jacksonadams@example.com', '1991-09-19', '2023-09-17 15:45:00', 'San Francisco', 'TechCorp', 'English', 22.50, 30, 3),
('Lily Roberts', 'pass828384', 85, 0, '9516543571', 'lilyroberts@example.com', '1994-03-24', '2023-07-25 13:50:00', 'Orlando', 'Consulting LLC', 'French', 37.00, 45, 1),
('Sebastian Young', 'pass858687', 79, 120, '1594567538', 'sebastianyoung@example.com', '1987-10-11', '2023-03-22 09:55:00', 'Austin', 'FinanceCorp', 'English', 28.00, 35, 2),
('Zoe Walker', 'pass888990', 94, 0, '7539513578', 'zoewalker@example.com', '1995-01-07', '2023-08-30 11:30:00', 'Las Vegas', 'RealEstate Pro', 'Spanish', 40.50, 50, 3);

INSERT INTO Dataset (Verified, Avatar, Name_dataset, Voucher, Data_type, Request_type, Slug)
VALUES
(TRUE, 'avatar1.png', 'Flowers Dataset', 10.0, 1, 'Sending', 'flowers_dataset'),
(FALSE, 'avatar2.png', 'Hair Type Dataset', 15.5, 2, 'Buying', 'hair_type_dataset'),
(TRUE, 'avatar3.png', 'Stanford Cars Dataset', 20.0, 3, 'Buying', 'stanford_cars_dataset'),
(TRUE, 'avatar4.png', 'Brain Tumor MRI Dataset', 8.0, 1, 'Buying', 'brain_tumor_mri_dataset'),
(FALSE, 'avatar5.png', 'Lung Cancer', 12.5, 4, 'Buying', 'lung_cancer'),
(TRUE, 'avatar6.png', 'CelebFaces Attributes Dataset', 9.0, 2, 'Buying', 'celebFaces_attributes_dataset'),
(FALSE, 'avatar7.png', 'Skin Cancer', 18.0, 5, 'Buying', 'skin_cancer'),
(TRUE, 'avatar8.png', 'Chest X-rays Labeled by 13 Classes - 150 studies', 7.5, 1, 'Buying', 'chest_c-rays_labeled_by_13_classes'),
(FALSE, 'avatar9.png', 'House Plant Species', 14.0, 6, 'Buying', 'house_plant_species'),
(TRUE, 'avatar10.png', 'Image Classification - 64 Classes - Animal', 11.0, 3, 'Sending', 'image_classification-64classes-animal'),
(FALSE, 'avatar11.png', 'Cat Dataset', 11.0, 2, 'Sending', 'cat_dataset'),
(TRUE, 'avatar12.png', 'Animal Faces', 11.0, 3, 'Sending', 'animal_faces'),
(FALSE, 'avatar13.png', 'Sea Animals Image Dataset', 11.0, 1, 'Sending', 'sea_animals_image_dataset'),
(TRUE, 'avatar14.png', 'Celebrity Face Image Dataset', 11.0, 4, 'Sending', 'celebrity_face_image_dataset'),
(TRUE, 'avatar15.png', 'Drone Dataset', 11.0, 2, 'Sending', 'drone_dataset'),
(FALSE, 'avatar16.png', 'Date Fruit Datasets', 11.0, 5, 'Sending', 'date_fruit_datasets'),
(FALSE, 'avatar17.png', 'Yoga Posture Dataset', 11.0, 1, 'Sending', 'yoga_posture_dataset'),
(TRUE, 'avatar18.png', 'Dog vs Cat', 11.0, 6, 'Sending', 'dog_vs_cat');

INSERT INTO User_click (ID_user, ID_dataset) VALUES
(1, 1), (2, 2),(3, 3),(4, 4), (5, 5),(6, 6),(7, 7),(8, 8),
(9, 9),(10, 10),(1, 4),(2, 3),(3, 4),(4, 5),(15, 1),(16, 2),(17, 3),
(21, 9),(16, 7),(17, 8),(20, 1),(25, 6),(16, 7),(12, 2),(13, 3);

INSERT INTO Version (
    ID_dataset, Price, Number_parts, Reliability_minimum,
    Create_Date, Maximum_size, Total_size, Number_of_data,
    Data_sending_time_duration, Labeling_time_duration,
    Valuation_time_duration, Stock_percent,
    Data_format, Status
) VALUES
(1, 500.00, 10, 85, '2024-01-01 10:00:00', 50.12345, 45.54321, 1000, '2024-01-05 01:04:11', '2024-07-11 21:37:19', '2024-12-19 01:39:10', 75.0, 1, 1),
(2, 450.50, 10, 92, '2024-01-01 10:00:00', 60.54321, 55.32145, 1500, '2024-05-12 12:20:30', '2024-12-26 16:39:59', '2024-12-29 11:16:51', 80.0, 2, 2),
(3, 600.00, 10, 78, '2024-01-01 10:00:00', 45.54321, 40.12345, 1200, '2024-08-17 17:20:04', '2024-11-12 04:30:49', '2024-12-01 13:55:40', 65.0, 1, 3),
(4, 520.75, 10, 95, '2024-01-01 10:00:00', 55.12345, 50.32145, 1100, '2024-03-09 09:26:32', '2024-09-12 15:57:20', '2024-12-09 12:02:55', 85.0, 3, 1),
(5, 480.25, 10, 60, '2024-01-01 10:00:00', 65.32145, 60.54321, 1400, '2024-01-30 19:25:57', '2024-07-24 11:27:05', '2024-12-02 18:37:14', 70.0, 2, 2),
(6, 540.50, 10, 88, '2024-01-01 10:00:00', 70.54321, 65.12345, 1300, '2024-06-17 02:11:36', '2024-10-28 04:13:01', '2024-12-08 16:56:49', 60.0, 1, 3),
(7, 510.00, 10, 45, '2024-01-01 10:00:00', 75.54321, 70.32145, 1700, '2024-08-10 01:26:04', '2024-12-14 22:03:59', '2024-12-16 16:21:16', 55.0, 3, 1),
(8, 495.00, 10, 99, '2024-01-01 10:00:00', 85.12345, 80.54321, 900, '2024-05-05 02:41:05', '2024-09-04 05:37:35', '2024-10-25 02:27:18', 90.0, 2, 2),
(9, 525.50, 10, 82, '2024-01-01 10:00:00', 90.54321, 85.12345, 1600, '2024-12-10 04:22:36', '2024-12-12 02:40:09', '2024-12-26 04:24:26', 78.0, 1, 3),
(10, 470.75, 10, 55, '2024-01-01 10:00:00', 95.54321, 90.32145, 1050, '2024-11-28 06:08:28', '2024-12-18 17:14:10', '2024-12-29 08:07:14', 72.0, 3, 1),
(1, 505.00, 12, 73, '2025-01-01 10:00:00', 50.12345, 45.54321, 1000, '2025-12-04 07:27:30', '2025-12-07 17:18:42', '2025-12-21 19:37:43', 75.0, 1, 1),
(2, 425.50, 12, 80, '2025-01-01 10:00:00', 60.54321, 55.32145, 1500, '2025-09-22 10:04:16', '2025-10-29 20:47:02', '2025-12-25 09:37:18', 80.0, 2, 2),
(3, 585.00, 12, 68, '2025-01-01 10:00:00', 45.54321, 40.12345, 1200, '2025-02-08 17:43:01', '2025-03-30 10:57:59', '2025-12-31 04:50:52', 65.0, 1, 3),
(4, 510.75, 12, 92, '2025-01-01 10:00:00', 55.12345, 50.32145, 1100, '2025-03-18 08:06:41', '2025-12-23 20:49:48', '2025-12-31 06:59:40', 85.0, 3, 1),
(5, 460.25, 12, 64, '2025-01-01 10:00:00', 65.32145, 60.54321, 1400, '2025-12-11 16:22:33', '2025-12-28 06:39:54', '2025-12-31 02:41:49', 70.0, 2, 2);

INSERT INTO Part (ID_version, Number_of_record) VALUES
(1, 8), (1, 13), (1, 10), (1, 8), (1, 7),
(1, 5), (1, 8), (1, 8), (1, 3), (1, 10),
(11, 6), (11, 8), (11, 12), (11, 7), (11, 7),
(11, 9), (11, 10), (11, 9), (11, 5), (11, 7),
(2, 7), (2, 7), (2, 6), (2, 11), (2, 13),
(2, 8), (2, 5), (2, 11), (2, 8), (2, 5);



INSERT INTO User_Version_Participation (ID_user, ID_version, Participation_Type, Join_date) VALUES
(1, 1, 'Sending', '2024-01-03 12:00:00'),
(1, 2, 'Labeling', '2024-12-20 12:00:00'),
(1, 3, 'Sending', '2024-08-16 12:00:00'),
(1, 4, 'Labeling', '2024-06-15 15:00:00'),
(1, 11, 'Sending', '2025-12-03 10:00:00'),
(1, 11, 'Labeling', '2025-12-05 10:00:00'),
(2, 1, 'Labeling', '2024-06-15 10:30:00'),
(2, 4, 'Sending', '2024-02-20 10:00:00'),
(2, 5, 'Labeling', '2024-06-20 13:30:00'),
(13, 2, 'Sending', '2024-03-01 09:30:00'),
(23, 6, 'Labeling', '2024-07-25 10:00:00'),
(13, 7, 'Sending', '2024-07-01 11:00:00'),
(14, 1, 'Labeling', '2024-06-10 12:45:00'),
(24, 8, 'Sending', '2024-04-01 09:00:00'),
(24, 9, 'Labeling', '2024-12-11 14:00:00'),
(15, 5, 'Sending', '2024-01-15 08:00:00'),
(15, 10, 'Labeling', '2024-12-10 09:30:00'),
(15, 3, 'Sending', '2024-08-17 10:00:00'),
(26, 6, 'Labeling', '2024-08-10 10:30:00'),
(26, 4, 'Sending', '2024-02-25 10:30:00'),
(26, 1, 'Labeling', '2024-06-05 10:30:00'),
(17, 7, 'Sending', '2024-06-10 11:30:00'),
(17, 2, 'Labeling', '2024-10-25 13:00:00'),
(17, 5, 'Sending', '2024-01-10 10:00:00'),
(28, 8, 'Labeling', '2024-07-10 11:00:00'),
(28, 9, 'Sending', '2024-06-20 09:30:00'),
(28, 10, 'Labeling', '2024-11-29 08:45:00'),
(19, 1, 'Sending', '2024-01-03 09:15:00'), --
(19, 3, 'Labeling', '2024-08-20 09:30:00'),
(19, 6, 'Sending', '2024-05-20 09:30:00'),
(20, 4, 'Labeling', '2024-07-10 11:30:00'),
(20, 5, 'Sending', '2024-01-10 09:50:00'),
(20, 7, 'Labeling', '2024-11-30 11:00:00');


INSERT INTO Admin (Username, Password, Permission) VALUES
('admin1', 'password1', 1),
('admin2', 'password2', 2),
('admin3', 'password3', 1),
('admin4', 'password4', 2),
('admin5', 'password5', 1);

INSERT INTO Data_sending_request (ID_user, Data_type, ID_dataset, Description)
VALUES
(1, 1, 1, 'This dataset consists of images from five distinct flower species, ideal for tasks like image classification and computer vision projects. It provides a diverse range of floral images, enabling models to learn the subtle differences between species.'),
(2, 2, 11, 'The CAT dataset includes over 9,000 cat images. For each image, there are annotations of the head of cat with nine points, two for eyes, one for mouth, and six for ears.'),
(3, 3, 12, 'This dataset, also known as Animal Faces-HQ (AFHQ), consists of 16,130 high-quality images at 512×512 resolution.'),
(4, 1, 13, 'Most life forms began their evolution in aquatic environments. About 90% of the worlds living space is provided by the oceans in terms of volume. Fish, which are only found in water, are the first known vertebrates. Some of these transformed into amphibians, which dwell both on land and in water for parts of the day'),
(10, 4, 14, 'This dataset contains images of 18 Hollywood celebrities with 100 images of each celebrity'),
(16, 2, 15, 'This dataset collected by me Mehdi Özel for a UAV Competition. When I search about "Drone (UAV) Dataset", I realized that the datasets only contain photos taken by UAVs(drone-to earth view mostly).'),
(17, 5, 16, 'A great number of fruits are grown around the world, each of which has various types. The factors that determine the type of fruit are the external appearance features such as color, length, diameter, and shape. '),
(28, 1, 17, 'Yoga is a group of physical, mental, and spiritual practices or disciplines that originated in ancient India and aim to control and still the mind, recognizing a detached witness-consciousness untouched by the mind and mundane suffering. There is a wide variety of schools of yoga, practices, and goals in Hinduism, Buddhism, and Jainism, and traditional and modern yoga is practiced worldwide.'),
(19, 6, 18, 'This dataset contains a total of 1000 images, with an equal distribution of 500 images of dog and 500 images of cat. The images are standardized to a resolution of 512x512 pixels.'),
(20, 3, 10, 'This dataset contains 64 animal image classes for multi-class image classification tasks. Each folder corresponds to a distinct class, and the images in each folder represent different types of animals.');

INSERT INTO Data_buying_request (ID_user, Public_data, ID_dataset, Description, Time, Deposit, Price, Due_Date, Data_type)
VALUES
(1, TRUE, 2, 'The Hair Type Dataset is an image dataset designed to classify various hair types. It includes high-quality images of individuals with diverse hair types. The dataset is helpful for training machine learning models to recognize and classify hair types.', NOW(), 500.00, 2500.00, '2024-09-01 12:00:00', 1),
(2, FALSE, 3, 'The Cars dataset contains 16,185 images of 196 classes of cars. The data is split into 8,144 training images and 8,041 testing images, where each class has been split roughly in a 50-50 split. Classes are typically at the level of Make, Model, Year, ex. 2012 Tesla Model S or 2012 BMW M3 coupe.', NOW(), 1000.00, 4500.00, '2024-09-10 15:30:00', 2),
(13, TRUE, 4, 'The dataset is divided into two separate parts. The first part is a dataset created for classification. Here, brain tumors are divided into 4 different classes. These are: glioma, meningioma, pituitarity and no tumor. Training and test separation is made in the folder. cThe second part is created for segmentation. Here, two different classes are created only to detect the presence or absence of the tumor, and only for cases where the tumor is present, the coordinates of the tumor are in the labels folder. Training-validation-test split is made in the folder', NOW(), 750.00, 3500.00, '2024-08-20 09:00:00', 3),
(14, TRUE, 5, 'The original dataset was published by https://arxiv.org/abs/1912.12142v1 at https://github.com/tampapath/lung_colon_image_set. To cite this dataset, write "Borkowski AA, Bui MM, Thomas LB, Wilson CP, DeLand LA, Mastorides SM. Lung and Colon Cancer Histopathological Image Dataset (LC25000). arXiv:1912.12142v1 [eess.IV], 2019"', NOW(), 300.00, 1500.00, '2024-09-05 11:45:00', 1),
(15, TRUE, 6, 'A popular component of computer vision and deep learning revolves around identifying faces for various applications from logging into your phone with your face or searching through surveillance images for a particular suspect. This dataset is great for training and testing models for face detection, particularly for recognising facial attributes such as finding people with brown hair, are smiling, or wearing glasses. Images cover large pose variations, background clutter, diverse people, supported by a large quantity of images and rich annotations. This data was originally collected by researchers at MMLAB, The Chinese University of Hong Kong (specific reference in Acknowledgment section).', NOW(), 600.00, 3200.00, '2024-08-25 10:00:00', 4),
(26, FALSE, 7, 'This is a balanced dataset of benign (healthy) and malignant (infected) skin spots. Transfer learning and CNNs can be used to classify the images into these two categories. The rules for using the data are detailed at https://www.isic-archive.com/#!/topWithHeader/wideContentTop/main.', NOW(), 400.00, 2000.00, '2024-09-12 13:00:00', 2),
(17, TRUE, 8, 'This dataset consists of 150 medical studies with chest X-ray (CXR) images primarily focused on the detection of lung diseases, including COVID-19 cases and pneumonias. The collection includes frontal chest radiographs and chest radiography scans in DICOM format. The dataset is ideal for medical research, disease detection, and classification tasks, particularly for developing computer-aided diagnosis and machine learning models', NOW(), 900.00, 4200.00, '2024-09-03 16:00:00', 5),
(8, FALSE, 9, 'This plant image dataset consists of 14,790 images categorized into 47 distinct plant species classes. The dataset was compiled by collecting images from Bing Images and manually curating them, although not by professional biologist. I collected this images for a project aimed at classifying plant species as either toxic or safe for cats.', NOW(), 350.00, 1800.00, '2024-08-30 14:30:00', 1);

INSERT INTO Censorship_DBR (ID_admin, ID_data_buying_request, Confirm, Reason)
VALUES
(1, 1, FALSE, 'Approved after review.'),
(2, 2, FALSE, 'Rejected due to insufficient deposit.'),
(3, 3, TRUE, 'Approved with a note for further clarification.'),
(4, 4, FALSE, 'Not approved as the dataset type does not match.'),
(5, 5, TRUE, 'Approved. Deposit and price are correct.'),
(1, 6, TRUE, 'Approved. All conditions met.'),
(2, 7, FALSE, 'Rejected. The dataset does not meet the requirements.'),
(3, 8, TRUE, 'Approved after verifying the data type.');

INSERT INTO Censorship_DSR (ID_admin, ID_data_sending_request, Confirm, Reason)
VALUES
(1, 1, FALSE, 'Approved. The request is complete and correct.'),
(2, 2, TRUE, 'Rejected. Missing additional documentation.'),
(3, 3, TRUE, 'Approved. Dataset meets all criteria.'),
(4, 4, TRUE, 'Rejected. Incorrect dataset type.'),
(5, 5, TRUE, 'Approved. All information is accurate.'),
(1, 6, TRUE, 'Approved. The request conforms to guidelines.'),
(2, 7, TRUE, 'Rejected. Incomplete data description.'),
(3, 8, TRUE, 'Approved after verification of dataset.'),
(4, 9, TRUE, 'Approved. No issues found.'),
(5, 10, FALSE, 'Rejected. The description lacks details.');

INSERT INTO Censorship_complete_version (ID_admin, ID_version, Confirm, Reason) VALUES
(1, 1, TRUE, 'Verified and approved for release.'),
(2, 2, FALSE, 'Incomplete documentation, requires more information.'),
(3, 3, TRUE, 'Compliant with all required standards.'),
(4, 4, FALSE, 'Failed security checks, needs revision.'),
(5, 5, TRUE, 'Approved after successful testing and review.'),
(1, 6, TRUE, 'All criteria met, approved for deployment.'),
(2, 7, FALSE, 'Non-compliance with data privacy regulations.'),
(3, 8, TRUE, 'Confirmed after thorough assessment.'),
(4, 9, FALSE, 'Issues detected during quality assurance.'),
(5, 10, TRUE, 'All issues resolved, confirmed for release.');

INSERT INTO Expert_Register (ID_user, File_CV)
VALUES (11, 'path/to/cv_john_doe.pdf'),
(12, 'path/to/cv_jane_smith.docx'),
(13, 'path/to/cv_michael_johnson.pdf'),
(14, 'path/to/cv_emily_davis.docx'),
(15, 'path/to/cv_david_wilson.pdf');

INSERT INTO Authen (ID_admin, ID_expert_register, Confirm, Reason)
VALUES (1, 1, TRUE, 'Approved without issues.'),
(2, 2, FALSE, 'Missing required documentation.'),
(3, 3, TRUE, 'Approved after minor corrections.'),
(4, 4, FALSE, 'Incomplete CV provided.'),
(5, 5, TRUE, 'Expert registration approved.');

INSERT INTO Expert (ID_user, Field, Description)
VALUES (1, 101, 'Data Sciencist'),
(3, 102, 'Cybersecurity'),
(8, 103, 'Software Engineering'),
(5, 104, 'Artificial Intelligence'),
(2, 105, 'FinTech');

INSERT INTO Dataset_Expert (ID_expert, ID_dataset) VALUES
(1, 1),(1, 2),(2, 3),(3, 4),
(4, 5),(5, 6),(1, 7),(2, 8),
(3, 9),(4, 10),(5, 11),(1, 5),
(2, 5),(5, 7),(1, 4),(2, 7),
(3, 2),(2, 10),(1, 11);

INSERT INTO Report (Content, ID_user)
VALUES
('Quarterly report on user engagement.', 1),
('Analysis of market trends for Q2.', 2),
('Financial report for the last fiscal year.', 3),
('Customer feedback and satisfaction survey results.', 4),
('Healthcare data privacy compliance report.', 15),
('Social media campaign performance analysis.', 16),
('Real estate market overview for H1.', 17),
('E-commerce sales growth report.', 28),
('Climate change impact assessment.', 15),
('User behavior analysis in mobile app.', 6);

INSERT INTO Valuation (Time_valuation, ID_user, ID_version, Price) VALUES
('2024-07-12 10:00:00', 1, 1, 5000.00),
('2024-12-27 12:00:00', 1, 2, 5200.00),
('2024-11-20 14:00:00', 1, 3, 5300.00),
('2024-09-15 11:30:00', 1, 4, 5000.00),
('2024-07-15 21:37:19', 2, 1, 6500.50),
('2024-09-15 11:30:00', 2, 4, 6600.50),
('2024-08-01 12:00:00', 2, 5, 6700.50),
('2024-12-27 09:00:00', 13, 2, 7200.75),
('2024-11-01 08:00:00', 23, 6, 7300.75),
('2024-12-15 22:03:59', 13, 7, 7400.75),
('2024-08-16 21:37:19', 14, 1, 4800.00),
('2024-10-15 09:45:00', 24, 8, 4900.00),
('2024-12-15 09:30:00', 24, 9, 5000.00),
('2024-09-15 10:00:00', 15, 5, 5300.25),
('2024-12-20 08:00:00', 15, 10, 5400.25),
('2024-11-15 09:00:00', 15, 3, 5500.25),
('2024-11-15 09:30:00', 26, 6, 6000.50),
('2024-10-10 10:30:00', 26, 4, 6100.50),
('2024-08-10 10:15:00', 26, 1, 6200.50),
('2024-12-15 11:00:00', 17, 7, 5600.75),
('2024-12-27 11:00:00', 17, 2, 5700.75),
('2024-09-20 08:30:00', 17, 5, 5800.75),
('2024-09-15 07:30:00', 28, 8, 7000.00),
('2024-12-20 08:00:00', 28, 9, 7100.00),
('2024-12-24 08:30:00', 28, 10, 7200.00),
('2024-09-15 08:15:00', 19, 1, 6300.25),
('2024-11-20 08:45:00', 19, 3, 6400.25),
('2024-12-01 09:30:00', 19, 6, 6500.25),
('2024-11-15 10:15:00', 20, 4, 7500.50),
('2024-10-15 09:45:00', 20, 5, 7600.50),
('2024-12-15 12:00:00', 20, 7, 7700.50);


