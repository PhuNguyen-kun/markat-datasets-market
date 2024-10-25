DROP DATABASE markat_db;
CREATE DATABASE markat_db;
\c markat_db


CREATE TABLE Status (
    ID_Status SERIAL PRIMARY KEY,
    Status_name VARCHAR(255),
    Time TIMESTAMP
);

CREATE TABLE Users (
    User_ID SERIAL PRIMARY KEY,
    Full_name VARCHAR(255),
    Password VARCHAR(255),
    Reliability INT,
    Kat FLOAT,
    Phone_number VARCHAR(15),
    Email VARCHAR(255) UNIQUE,
    Birth_date DATE,
    Join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Current_location VARCHAR(255),
    Current_company VARCHAR(255),
    Primary_language VARCHAR(255),
    Desired_Payrate NUMERIC(10, 2),
	Available_time_per_week FLOAT,
    ID_Status INT REFERENCES Status(ID_Status)
);

CREATE TABLE Dataset (
    ID_Dataset SERIAL PRIMARY KEY,
    Verified BOOLEAN, --update
    Avatar TEXT,
    Name_dataset VARCHAR(255),
    Voucher FLOAT,
    Data_type INT,
    Slug TEXT
);

CREATE TABLE User_Click (
    User_ID_click SERIAL PRIMARY KEY,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	User_ID INT REFERENCES Users(User_ID),
    ID_Dataset INT REFERENCES Dataset(ID_Dataset)
);



CREATE TABLE Version (
    ID_Ver SERIAL PRIMARY KEY,
    ID_Dataset INT REFERENCES Dataset(ID_Dataset),
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
    Link_data_mongo TEXT,
    Data_format INT,
    Status INT
);

CREATE TABLE User_Version_Participation (
    ID_user_version_participation SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID),
    ID_Version INT REFERENCES Version(ID_Ver),
    Participation_Type VARCHAR(50),
    Join_date TIMESTAMP
);

CREATE TABLE Admin (
    ID_Admin SERIAL PRIMARY KEY,
    Username VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
	Permission INT
);


CREATE TABLE Data_sending_request (
    ID_data_sending_request SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID),
    Data_type INT,
	ID_dataset INT REFERENCES Dataset(ID_Dataset),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT
);

CREATE TABLE Data_buying_request (
    ID_buying_request SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID),
    Public_data BOOLEAN,
    ID_Dataset INT REFERENCES Dataset(ID_Dataset),
    Description TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Deposit  NUMERIC(10, 2),
	Price NUMERIC(10, 2),
	Due_Date TIMESTAMP,
    Data_type INT
);

CREATE TABLE Censorship_DBR (
    ID_dbr SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
    ID_buying_request INT REFERENCES Data_buying_request(ID_buying_request),
    Confirm BOOLEAN,
    Reason TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Censorship_DSR (
    ID_dsr SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_data_sending_request INT REFERENCES Data_sending_request(ID_data_sending_request),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Censorship_complete_version(
	ID_complete_ver SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_Ver INT REFERENCES Version(ID_Ver),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Expert_Register (
    ID_Expert_register SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID),
    File_CV TEXT
);

CREATE TABLE Authen (
    ID_authen SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_Expert_register INT REFERENCES Expert_Register(ID_Expert_register),
    Confirm BOOlEAN,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Expert (
    ID_Expert SERIAL PRIMARY KEY,
    User_ID INT REFERENCES Users(User_ID),
    Field INT,
    Description TEXT
);


CREATE TABLE Database_Expert (
    ID_Database_Expert SERIAL PRIMARY KEY,
    ID_Expert INT REFERENCES Expert(ID_Expert),
	ID_Dataset INT REFERENCES Dataset(ID_Dataset)
);


CREATE TABLE Report (
    ID_Report SERIAL PRIMARY KEY,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	Content TEXT,
	User_ID INT REFERENCES Users(User_ID)
);

CREATE TABLE Valuation (
    ID_valuation SERIAL PRIMARY KEY,
    Time_valuation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    User_ID INT REFERENCES Users(User_ID),
    ID_ver INT REFERENCES Version(ID_ver),
    Price NUMERIC(10, 2)
);

CREATE TABLE Transaction (
    ID_transaction SERIAL PRIMARY KEY,
    Time_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    User_ID INT REFERENCES Users(User_ID),
    ID_ver INT REFERENCES Version(ID_ver)
);

-- Database
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

INSERT INTO Users (Full_name, Password, Reliability, Kat, Phone_number, Email, Birth_date, Join_date, Current_location, Current_company, Primary_language, Desired_Payrate, Available_time_per_week, ID_Status)
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

INSERT INTO Dataset (Verified, Avatar, Name_dataset, Voucher, Data_type, Slug)
VALUES
(TRUE, 'avatar1.png', 'Demographic Data Analysis', 10.0, 1, 'demographic-data-analysis'),
(FALSE, 'avatar2.png', 'Electronics Market Research', 15.5, 2, 'electronics-market-research'),
(TRUE, 'avatar3.png', 'Financial Transaction Data', 20.0, 3, 'financial-transaction-data'),
(TRUE, 'avatar4.png', 'Retail Customer Feedback', 8.0, 1, 'retail-customer-feedback'),
(FALSE, 'avatar5.png', 'Healthcare Insurance Data', 12.5, 4, 'healthcare-insurance-data'),
(TRUE, 'avatar6.png', 'Social Media Engagement', 9.0, 2, 'social-media-engagement'),
(FALSE, 'avatar7.png', 'Real Estate Transaction Data', 18.0, 5, 'real-estate-transaction-data'),
(TRUE, 'avatar8.png', 'E-commerce Product Sales', 7.5, 1, 'e-commerce-product-sales'),
(FALSE, 'avatar9.png', 'Climate Analysis Weather Data', 14.0, 6, 'climate-analysis-weather-data'),
(TRUE, 'avatar10.png', 'Mobile App User Behavior', 11.0, 3, 'mobile-app-user-behavior'),
(FALSE, 'avatar11.png', 'Sending market research dataset for electronics', 11.0, 2, 'sending-market-research-dataset-for-electronics'),
(TRUE, 'avatar12.png', 'Sending financial transaction dataset for bank analysis', 11.0, 3, 'sending-financial-transaction-dataset-for-bank-analysis'),
(FALSE, 'avatar13.png', 'Sending customer feedback dataset for retail analysis', 11.0, 1, 'sending-customer-feedback-dataset-for-retail-analysis'),
(TRUE, 'avatar14.png', 'Sending healthcare dataset for insurance analysis', 11.0, 4, 'sending-healthcare-dataset-for-insurance-analysis'),
(TRUE, 'avatar15.png', 'Sending social media engagement data', 11.0, 2, 'sending-social-media-engagement-data'),
(FALSE, 'avatar16.png', 'Sending real estate transaction data', 11.0, 5, 'sending-real-estate-transaction-data'),
(FALSE, 'avatar17.png', 'Sending e-commerce product sales data', 11.0, 1, 'sending-e-commerce-product-sales-data'),
(TRUE, 'avatar18.png', 'Sending climate analysis weather data', 11.0, 6, 'sending-climate-analysis-weather-data');

INSERT INTO User_Click (User_ID, ID_Dataset) VALUES
(1, 1), (2, 2),(3, 3),(4, 4), (5, 5),(6, 6),(7, 7),(8, 8),
(9, 9),(10, 10),(1, 4),(2, 3),(3, 4),(4, 5),(15, 1),(16, 2),(17, 3),
(21, 9),(16, 7),(17, 8),(20, 1),(25, 6),(16, 7),(12, 2),(13, 3);

INSERT INTO Version (
    ID_Dataset, Price, Number_parts, Reliability_minimum,
    Create_Date, Maximum_size, Total_size, Number_of_data,
    Data_sending_time_duration, Labeling_time_duration,
    Valuation_time_duration, Stock_percent, Link_data_mongo,
    Data_format, Status
) VALUES
(1, 500.00, 1, 85,  '2024-09-01 10:00:00', 50.12345, 45.54321, 1000, '2024-09-01 12:00:00', '2024-09-01 14:00:00', '2024-09-01 16:00:00', 75.0, 'mongodb://link1', 1, 1),
(2, 450.50, 1, 92, '2024-09-02 10:00:00', 60.54321, 55.32145, 1500, '2024-09-02 12:00:00', '2024-09-02 14:00:00', '2024-09-02 16:00:00', 80.0, 'mongodb://link2', 2, 2),
(3, 600.00, 1, 78,  '2024-09-03 10:00:00', 45.54321, 40.12345, 1200, '2024-09-03 12:00:00', '2024-09-03 14:00:00', '2024-09-03 16:00:00', 65.0, 'mongodb://link3', 1, 3),
(4, 520.75, 1, 95, '2024-09-04 10:00:00', 55.12345, 50.32145, 1100, '2024-09-04 12:00:00', '2024-09-04 14:00:00', '2024-09-04 16:00:00', 85.0, 'mongodb://link4', 3, 1),
(5, 480.25, 1, 60,  '2024-09-05 10:00:00', 65.32145, 60.54321, 1400, '2024-09-05 12:00:00', '2024-09-05 14:00:00', '2024-09-05 16:00:00', 70.0, 'mongodb://link5', 2, 2),
(6, 540.50, 1, 88,  '2024-09-06 10:00:00', 70.54321, 65.12345, 1300, '2024-09-06 12:00:00', '2024-09-06 14:00:00', '2024-09-06 16:00:00', 60.0, 'mongodb://link6', 1, 3),
(7, 510.00, 1, 45, '2024-09-07 10:00:00', 75.54321, 70.32145, 1700, '2024-09-07 12:00:00', '2024-09-07 14:00:00', '2024-09-07 16:00:00', 55.0, 'mongodb://link7', 3, 1),
(8, 495.00, 1, 99, '2024-09-08 10:00:00', 85.12345, 80.54321, 900, '2024-09-08 12:00:00', '2024-09-08 14:00:00', '2024-09-08 16:00:00', 90.0, 'mongodb://link8', 2, 2),
(9, 525.50, 1, 82,  '2024-09-09 10:00:00', 90.54321, 85.12345, 1600, '2024-09-09 12:00:00', '2024-09-09 14:00:00', '2024-09-09 16:00:00', 78.0, 'mongodb://link9', 1, 3),
(10, 470.75, 1, 55,  '2024-09-10 10:00:00', 95.54321, 90.32145, 1050, '2024-09-10 12:00:00', '2024-09-10 14:00:00', '2024-09-10 16:00:00', 72.0, 'mongodb://link10', 3, 1),
(1, 505.00, 2, 73,  '2024-09-11 10:00:00', 50.12345, 45.54321, 1000, '2024-09-11 12:00:00', '2024-09-11 14:00:00', '2024-09-11 16:00:00', 75.0, 'mongodb://link11', 1, 1),
(2, 425.50, 2, 80,  '2024-09-12 10:00:00', 60.54321, 55.32145, 1500, '2024-09-12 12:00:00', '2024-09-12 14:00:00', '2024-09-12 16:00:00', 80.0, 'mongodb://link12', 2, 2),
(3, 585.00, 2, 68,  '2024-09-13 10:00:00', 45.54321, 40.12345, 1200, '2024-09-13 12:00:00', '2024-09-13 14:00:00', '2024-09-13 16:00:00', 65.0, 'mongodb://link13', 1, 3),
(4, 510.75, 2, 92, '2024-09-14 10:00:00', 55.12345, 50.32145, 1100, '2024-09-14 12:00:00', '2024-09-14 14:00:00', '2024-09-14 16:00:00', 85.0, 'mongodb://link14', 3, 1),
(5, 460.25, 2, 64,  '2024-09-15 10:00:00', 65.32145, 60.54321, 1400, '2024-09-15 12:00:00', '2024-09-15 14:00:00', '2024-09-15 16:00:00', 70.0, 'mongodb://link15', 2, 2);


INSERT INTO User_Version_Participation (User_ID, ID_Version, Participation_Type, Join_date) VALUES
(1, 1, 'Sending', '2023-08-01 10:00:00'),
(1, 2, 'Labeling', '2024-08-02 11:00:00'),
(1, 3, 'Sending', '2024-08-03 12:00:00'),
(1, 4, 'Labeling', '2024-08-03 12:00:00'),
(1, 11, 'Sending', '2024-08-03 11:00:00'),
(2, 1, 'Labeling', '2024-08-01 09:30:00'),
(2, 4, 'Sending', '2024-09-02 10:30:00'),
(2, 5, 'Labeling', '2024-09-03 11:30:00'),
(13, 2, 'Sending', '2024-10-01 08:15:00'),
(23, 6, 'Labeling', '2024-10-02 09:15:00'),
(13, 7, 'Sending', '2024-10-03 10:15:00'),
(14, 1, 'Labeling', '2024-10-01 07:45:00'),
(24, 8, 'Sending', '2024-10-02 08:45:00'),
(24, 9, 'Labeling', '2024-10-03 09:45:00'),
(15, 5, 'Sending', '2024-10-01 07:00:00'),
(15, 10, 'Labeling', '2024-11-02 08:00:00'),
(15, 3, 'Sending', '2024-11-03 09:00:00'),
(26, 6, 'Labeling', '2024-11-01 08:00:00'),
(26, 4, 'Sending', '2024-11-02 09:00:00'),
(26, 1, 'Labeling', '2024-11-03 10:00:00'),
(17, 7, 'Sending', '2024-11-01 11:00:00'),
(17, 2, 'Labeling', '2024-11-02 12:00:00'),
(17, 5, 'Sending', '2024-12-03 13:00:00'),
(28, 8, 'Labeling', '2024-12-01 06:45:00'),
(28, 9, 'Sending', '2024-12-02 07:45:00'),
(28, 10, 'Labeling', '2024-12-03 08:45:00'),
(19, 1, 'Sending', '2024-12-01 07:15:00'),
(19, 3, 'Labeling', '2024-12-02 08:15:00'),
(19, 6, 'Sending', '2024-12-03 09:15:00'),
(20, 4, 'Labeling', '2024-12-01 09:50:00'),
(20, 5, 'Sending', '2024-12-02 10:50:00'),
(20, 7, 'Labeling', '2024-12-03 11:50:00');


INSERT INTO Admin (Username, Password, Permission) VALUES
('admin1', 'password1', 1),
('admin2', 'password2', 2),
('admin3', 'password3', 1),
('admin4', 'password4', 2),
('admin5', 'password5', 1);

INSERT INTO Data_sending_request (User_ID, Data_type, ID_dataset, Description)
VALUES
(1, 1, 1, 'Sending demographic data analysis results'),
(2, 2, 11, 'Sending market research dataset for electronics'),
(3, 3, 12, 'Sending financial transaction dataset for bank analysis'),
(4, 1, 13, 'Sending customer feedback dataset for retail analysis'),
(10, 4, 14, 'Sending healthcare dataset for insurance analysis'),
(16, 2, 15, 'Sending social media engagement data'),
(17, 5, 16, 'Sending real estate transaction data'),
(28, 1, 17, 'Sending e-commerce product sales data'),
(19, 6, 18, 'Sending climate analysis weather data'),
(20, 3, 10, 'Sending mobile app user behavior dataset');

INSERT INTO Data_buying_request (User_ID, Public_data, ID_Dataset, Description, Time, Deposit, Price, Due_Date, Data_type)
VALUES
(1, TRUE, NULL, 'Request for demographic data analysis', NOW(), 500.00, 2500.00, '2024-09-01 12:00:00', 1),
(2, FALSE, NULL, 'Market research dataset for electronics', NOW(), 1000.00, 4500.00, '2024-09-10 15:30:00', 2),
(13, TRUE, NULL, 'Financial transaction dataset for bank', NOW(), 750.00, 3500.00, '2024-08-20 09:00:00', 3),
(14, TRUE, NULL, 'Customer feedback dataset for retail', NOW(), 300.00, 1500.00, '2024-09-05 11:45:00', 1),
(15, TRUE, NULL, 'Healthcare dataset for insurance analysis', NOW(), 600.00, 3200.00, '2024-08-25 10:00:00', 4),
(26, FALSE, NULL, 'Social media engagement dataset', NOW(), 400.00, 2000.00, '2024-09-12 13:00:00', 2),
(17, TRUE, NULL, 'Real estate transaction dataset', NOW(), 900.00, 4200.00, '2024-09-03 16:00:00', 5),
(8, FALSE, NULL, 'Product sales dataset for e-commerce', NOW(), 350.00, 1800.00, '2024-08-30 14:30:00', 1),
(9, TRUE, NULL, 'Weather data for climate analysis', NOW(), 700.00, 3800.00, '2024-09-08 12:30:00', 6),
(10, FALSE, NULL, 'User behavior dataset for mobile app', NOW(), 500.00, 2400.00, '2024-09-15 09:45:00', 3);

INSERT INTO Censorship_DBR (ID_Admin, ID_buying_request, Confirm, Reason)
VALUES
(1, 1, FALSE, 'Approved after review.'),
(2, 2, FALSE, 'Rejected due to insufficient deposit.'),
(3, 3, TRUE, 'Approved with a note for further clarification.'),
(4, 4, FALSE, 'Not approved as the dataset type does not match.'),
(5, 5, TRUE, 'Approved. Deposit and price are correct.'),
(1, 6, TRUE, 'Approved. All conditions met.'),
(2, 7, FALSE, 'Rejected. The dataset does not meet the requirements.'),
(3, 8, TRUE, 'Approved after verifying the data type.'),
(4, 9, TRUE, 'Approved with no issues.'),
(5, 10, FALSE, 'Rejected due to high price.');

INSERT INTO Censorship_DSR (ID_Admin, ID_data_sending_request, Confirm, Reason)
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

INSERT INTO Censorship_complete_version (ID_Admin, ID_Ver, Confirm, Reason) VALUES
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

INSERT INTO Expert_Register (User_ID, File_CV)
VALUES (11, 'path/to/cv_john_doe.pdf'),
(12, 'path/to/cv_jane_smith.docx'),
(13, 'path/to/cv_michael_johnson.pdf'),
(14, 'path/to/cv_emily_davis.docx'),
(15, 'path/to/cv_david_wilson.pdf');

INSERT INTO Authen (ID_Admin, ID_Expert_register, Confirm, Reason)
VALUES (1, 1, TRUE, 'Approved without issues.'),
(2, 2, FALSE, 'Missing required documentation.'),
(3, 3, TRUE, 'Approved after minor corrections.'),
(4, 4, FALSE, 'Incomplete CV provided.'),
(5, 5, TRUE, 'Expert registration approved.');

INSERT INTO Expert (User_ID, Field, Description)
VALUES (1, 101, 'Expert in Data Science with a focus on machine learning and big data analysis.'),
(3, 102, 'Specialist in Cybersecurity, with extensive experience in ethical hacking and network security.'),
(8, 103, 'Software Engineering expert, specialized in full-stack development and cloud computing.'),
(5, 104, 'Expert in Artificial Intelligence, focusing on natural language processing and computer vision.'),
(2, 105, 'Renowned in Financial Technology (FinTech), with expertise in blockchain and cryptocurrency.');

INSERT INTO Database_Expert (ID_Expert, ID_Dataset) VALUES
(1, 1),(1, 2),(2, 3),(3, 4),
(4, 5),(5, 6),(1, 7),(2, 8),
(3, 9),(4, 10),(5, 11),(1, 5),
(2, 5),(5, 7),(1, 4),(2, 7),
(3, 2),(2, 10),(1, 11);

INSERT INTO Report (Content, User_ID)
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

INSERT INTO Valuation (Time_valuation, User_ID, ID_ver, Price) VALUES
('2024-01-01 10:00:00', 1, 1, 5000.00),
('2024-01-02 11:00:00', 1, 2, 5200.00),
('2024-01-03 12:00:00', 1, 3, 5300.00),
('2024-02-01 09:30:00', 2, 1, 6500.50),
('2024-02-02 10:30:00', 2, 4, 6600.50),
('2024-02-03 11:30:00', 2, 5, 6700.50),
('2024-03-01 08:15:00', 13, 2, 7200.75),
('2024-03-02 09:15:00', 23, 6, 7300.75),
('2024-03-03 10:15:00', 13, 7, 7400.75),
('2024-04-01 07:45:00', 14, 1, 4800.00),
('2024-04-02 08:45:00', 24, 8, 4900.00),
('2024-04-03 09:45:00', 24, 9, 5000.00),
('2024-05-01 07:00:00', 15, 5, 5300.25),
('2024-05-02 08:00:00', 15, 10, 5400.25),
('2024-05-03 09:00:00', 15, 3, 5500.25),
('2024-06-01 08:00:00', 26, 6, 6000.50),
('2024-06-02 09:00:00', 26, 4, 6100.50),
('2024-06-03 10:00:00', 26, 1, 6200.50),
('2024-07-01 11:00:00', 17, 7, 5600.75),
('2024-07-02 12:00:00', 17, 2, 5700.75),
('2024-07-03 13:00:00', 17, 5, 5800.75),
('2024-08-01 06:45:00', 28, 8, 7000.00),
('2024-08-02 07:45:00', 28, 9, 7100.00),
('2024-08-03 08:45:00', 28, 10, 7200.00),
('2024-09-01 07:15:00', 19, 1, 6300.25),
('2024-09-02 08:15:00', 19, 3, 6400.25),
('2024-09-03 09:15:00', 19, 6, 6500.25),
('2024-10-01 09:50:00', 20, 4, 7500.50),
('2024-10-02 10:50:00', 20, 5, 7600.50),
('2024-10-03 11:50:00', 20, 7, 7700.50);


INSERT INTO Transaction (User_ID, ID_ver) VALUES
(1, 1), -- User 1 (John Doe) transacts with Version 1
(1, 2), -- User 1 (John Doe) transacts with Version 2
(2, 1), -- User 2 (Jane Smith) transacts with Version 1
(3, 3), -- User 3 (Michael Johnson) transacts with Version 3
(4, 2), -- User 4 (Emily Davis) transacts with Version 2
(5, 1), -- User 5 (David Wilson) transacts with Version 1
(6, 3), -- User 6 (Sophia Martinez) transacts with Version 3
(7, 2), -- User 7 (James Brown) transacts with Version 2
(8, 1), -- User 8 (Olivia Garcia) transacts with Version 1
(9, 3), -- User 9 (William Miller) transacts with Version 3
(10, 4), -- User 10 (Isabella Lopez) transacts with Version 2
(11, 7), -- User 11 (Alice Anderson) transacts with Version 1
(12, 2), -- User 12 (Bob Brown) transacts with Version 2
(13, 9), -- User 13 (Charlie Clark) transacts with Version 1
(14, 10), -- User 14 (Diana Davis) transacts with Version 3
(15, 4), -- User 15 (Eve Evans) transacts with Version 2
(16, 7), -- User 16 (Frank Foster) transacts with Version 1
(17, 5), -- User 17 (Grace Green) transacts with Version 2
(18, 3), -- User 18 (Henry Hill) transacts with Version 3
(19, 1), -- User 19 (Isabel Irvine) transacts with Version 1
(20, 2), -- User 20 (Jack Johnson) transacts with Version 2
(21, 3), -- User 21 (Karen King) transacts with Version 3
(22, 1), -- User 22 (Leo Lewis) transacts with Version 1
(23, 6), -- User 23 (Mia Moore) transacts with Version 2
(24, 3), -- User 24 (Nick Nelson) transacts with Version 3
(25, 1), -- User 25 (Olivia Owen) transacts with Version 1
(26, 6), -- User 26 (Paul Parker) transacts with Version 2
(27, 3), -- User 27 (Quinn Quincy) transacts with Version 3
(28, 1), -- User 28 (Rose Roberts) transacts with Version 1
(29, 6), -- User 29 (Sam Smith) transacts with Version 2
(30, 3); -- User 30 (Tina Taylor) transacts with Version 3