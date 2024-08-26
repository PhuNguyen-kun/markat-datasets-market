CREATE DATABASE markat_db;
\c markat_db   


CREATE TABLE Status (
    ID_Status SERIAL PRIMARY KEY,
    Status_name VARCHAR(255),
    Time TIMESTAMP
);

CREATE TABLE Users (
    ID_User SERIAL PRIMARY KEY,
    First_name VARCHAR(255),
    Last_name VARCHAR(255),
    Username VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
    Email VARCHAR(255),
    Birth_date DATE,
    Join_date TIMESTAMP,
    Current_location VARCHAR(255),
    Current_company VARCHAR(255),
    Primary_language VARCHAR(255),
    Phone_number VARCHAR(15),
    Desired_Payrate NUMERIC(10, 2),
	Available_time_per_week FLOAT,
    ID_Status INT REFERENCES Status(ID_Status)
);

CREATE TABLE Dataset (
    ID_Dataset SERIAL PRIMARY KEY,
    Reliability_minimum INT,
    Avatar TEXT,
	ID_user_click INT REFERENCES Users(ID_user),
    Name_dataset VARCHAR(255),
    Voucher FLOAT,
    Field INT
);

CREATE TABLE User_Click (
    ID_user_click SERIAL PRIMARY KEY,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	ID_User INT REFERENCES Users(ID_User),
    ID_Dataset INT REFERENCES Dataset(ID_Dataset)
);



CREATE TABLE Version (
    ID_Ver SERIAL PRIMARY KEY,
    ID_Dataset INT REFERENCES Dataset(ID_Dataset),
	Price NUMERIC(10, 2),
	Create_Date TIMESTAMP,
	Maximum_size NUMERIC(10, 5),
	Total_size NUMERIC(10, 5),
	Number_of_data INT,
    Data_sending_time_duration TIMESTAMP,
    Labeling_time_duration TIMESTAMP,
	Valuation_time_duration TIMESTAMP,
	Status INT,
    Stock_percent FLOAT,
    Link_data_mongo TEXT,
    Data_format INT,
    Number_parts INT
);

CREATE TABLE Admin (
    ID_Admin SERIAL PRIMARY KEY,
    Username VARCHAR(255) UNIQUE,
    Password VARCHAR(255),
	Permission INT
);


CREATE TABLE Data_sending_request (
    ID_data_sending_request SERIAL PRIMARY KEY,
    ID_User INT REFERENCES Users(ID_User),
    Data_type INT,
	ID_dataset INT REFERENCES Dataset(ID_Dataset),
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Description TEXT
);

CREATE TABLE Data_buying_request (
    ID_buying_request SERIAL PRIMARY KEY,
    ID_User INT REFERENCES Users(ID_User),
    ID_Dataset INT REFERENCES Dataset(ID_Dataset),
    Description TEXT,
    Deposit  NUMERIC(10, 2),
	Price NUMERIC(10, 2),
	Due_Date TIMESTAMP,
    Data_type INT
);

CREATE TABLE Censorship_DBR (
    ID_dbr SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
    ID_buying_request INT REFERENCES Data_buying_request(ID_buying_request),
    Confirm INT,
    Reason TEXT,
    Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Censorship_DSR (
    ID_dsr SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_data_sending_request INT REFERENCES Data_sending_request(ID_data_sending_request),
    Confirm INT, --1 la xac nhan , 0 la khong duoc xac nhan
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Censorship_complete_version(
	ID_complete_ver SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_Ver INT REFERENCES Version(ID_Ver),
    Confirm INT, --1 la xac nhan , 0 la khong duoc xac nhan
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE Expert_Register (
    ID_Expert_register SERIAL PRIMARY KEY,
    ID_User INT REFERENCES Users(ID_User),
    File_CV TEXT
);

CREATE TABLE Authen (
    ID_authen SERIAL PRIMARY KEY,
    ID_Admin INT REFERENCES Admin(ID_Admin),
	ID_Expert_register INT REFERENCES Expert_Register(ID_Expert_register),
    Confirm INT,
	Reason TEXT,
	Time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Expert (
    ID_Expert SERIAL PRIMARY KEY,
    ID_User INT REFERENCES Users(ID_User),
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
	ID_user INT REFERENCES Users(ID_User)
);

CREATE TABLE Valuation (
    ID_valuation SERIAL PRIMARY KEY,
    Time_valuation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_user INT REFERENCES Users(ID_User),
    ID_ver INT REFERENCES Version(ID_ver), 
    Price NUMERIC(10, 2)
);

CREATE TABLE Transaction (
    ID_transaction SERIAL PRIMARY KEY,
    Time_transaction TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ID_user INT REFERENCES Users(ID_User),
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

INSERT INTO Users (First_name, Last_name, Username, Password, Email, Birth_date, Join_date, Current_location, Current_company, Primary_language, Phone_number, Desired_Payrate, Available_time_per_week, ID_Status) 
VALUES ('John', 'Doe', 'johndoe', 'password123', 'johndoe@example.com', '1985-06-15', '2023-01-10 10:30:00', 'New York', 'TechCorp', 'English', '123-456-7890', 5000.00, 30.5, 1),
('Jane', 'Smith', 'janesmith', 'securepass', 'janesmith@example.com', '1990-09-22', '2023-02-14 14:20:00', 'Los Angeles', 'Innovate Ltd', 'Spanish', '234-567-8901', 6500.50, 25.0, 2),
('Michael', 'Johnson', 'mjohnson', 'mypassword', 'mjohnson@example.com', '1982-04-18', '2022-11-03 08:45:00', 'Chicago', 'Global Solutions', 'French', '345-678-9012', 7200.75, 35.5, 3),
('Emily', 'Davis', 'emilyd', 'password321', 'emilyd@example.com', '1995-12-30', '2023-03-22 09:15:00', 'San Francisco', 'WebWorks', 'English', '456-789-0123', 4800.00, 20.0, 1),
('David', 'Wilson', 'dwilson', 'pass1234', 'dwilson@example.com', '1988-07-05', '2022-12-15 11:30:00', 'Houston', 'Creative Minds', 'Japanese', '567-890-1234', 5300.25, 40.0, 2),
('Sophia', 'Martinez', 'smartinez', 'password987', 'smartinez@example.com', '1992-11-28', '2023-04-05 13:00:00', 'Miami', 'NextGen Inc.', 'Vietnamese', '678-901-2345', 6000.50, 15.5, 3),
('James', 'Brown', 'jbrown', 'mypassword123', 'jbrown@example.com', '1980-02-14', '2022-10-25 16:20:00', 'Seattle', 'Tech Innovations', 'English', '789-012-3456', 5600.75, 32.0, 1),
('Olivia', 'Garcia', 'oliviag', 'password654', 'oliviag@example.com', '1997-05-11', '2023-06-30 12:00:00', 'Austin', 'SmartTech', 'Spanish', '890-123-4567', 7000.00, 18.0, 2),
('William', 'Miller', 'wmiller', 'pass4567', 'wmiller@example.com', '1986-03-08', '2022-09-17 15:10:00', 'Boston', 'DesignPro', 'French', '901-234-5678', 6300.25, 28.5, 3),
('Isabella', 'Lopez', 'ilopez', 'password12345', 'ilopez@example.com', '1993-08-21', '2023-07-12 10:50:00', 'Phoenix', 'DataVision', 'Japanese', '012-345-6789', 7500.50, 22.0, 1),
('Alice', 'Anderson', 'alicea', 'passAlice1', 'alicea@example.com', '1990-01-15', '2022-01-10 09:00:00', 'New York', 'TechCorp', 'English', '123-456-7890', 7000.00, 40.0, 1),
('Bob', 'Brown', 'bobb', 'passBob1', 'bobb@example.com', '1985-03-22', '2022-02-14 10:30:00', 'San Francisco', 'WebWorks', 'English', '234-567-8901', 6500.50, 35.0, 2),
('Charlie', 'Clark', 'charliec', 'passCharlie1', 'charliec@example.com', '1992-06-18', '2022-03-05 11:00:00', 'Chicago', 'Global Solutions', 'Spanish', '345-678-9012', 8000.75, 20.0, 1),
('Diana', 'Davis', 'dianad', 'passDiana1', 'dianad@example.com', '1994-09-30', '2022-04-22 09:15:00', 'Miami', 'Innovate Ltd', 'French', '456-789-0123', 7800.00, 25.5, 2),
('Eve', 'Evans', 'evee', 'passEve1', 'evee@example.com', '1989-12-05', '2022-05-17 08:45:00', 'Los Angeles', 'NextGen Inc.', 'Japanese', '567-890-1234', 7200.25, 30.0, 3),
('Frank', 'Foster', 'frankf', 'passFrank1', 'frankf@example.com', '1995-04-10', '2022-06-25 14:20:00', 'Houston', 'Creative Minds', 'Vietnamese', '678-901-2345', 6000.50, 40.0, 1),
('Grace', 'Green', 'graceg', 'passGrace1', 'graceg@example.com', '1988-08-21', '2022-07-30 13:00:00', 'Boston', 'DataVision', 'English', '789-012-3456', 7500.75, 35.5, 2),
('Henry', 'Hill', 'henryh', 'passHenry1', 'henryh@example.com', '1991-11-10', '2022-08-15 16:20:00', 'Austin', 'SmartTech', 'Spanish', '890-123-4567', 6800.00, 32.0, 3),
('Isabel', 'Irvine', 'isabeli', 'passIsabel1', 'isabeli@example.com', '1993-02-17', '2022-09-08 15:10:00', 'Phoenix', 'Tech Innovations', 'French', '901-234-5678', 8500.25, 28.5, 1),
('Jack', 'Johnson', 'jackj', 'passJack1', 'jackj@example.com', '1990-05-14', '2022-10-01 12:00:00', 'Denver', 'DesignPro', 'English', '012-345-6789', 7700.50, 22.0, 2),
('Karen', 'King', 'karenk', 'passKaren1', 'karenk@example.com', '1987-07-28', '2022-11-11 10:50:00', 'Seattle', 'TechCorp', 'Japanese', '123-456-7890', 8200.75, 24.0, 3),
('Leo', 'Lewis', 'leol', 'passLeo1', 'leol@example.com', '1996-10-15', '2022-12-21 17:30:00', 'New Orleans', 'WebWorks', 'English', '234-567-8901', 6500.00, 18.0, 1),
('Mia', 'Moore', 'miam', 'passMia1', 'miam@example.com', '1986-01-05', '2023-01-30 14:00:00', 'Las Vegas', 'Global Solutions', 'Vietnamese', '345-678-9012', 9000.00, 30.5, 2),
('Nick', 'Nelson', 'nickn', 'passNick1', 'nickn@example.com', '1994-11-11', '2023-02-25 13:20:00', 'San Diego', 'Innovate Ltd', 'French', '456-789-0123', 7200.00, 25.0, 3),
('Olivia', 'Owen', 'oliviao', 'passOlivia1', 'oliviao@example.com', '1989-03-19', '2023-03-18 09:40:00', 'Atlanta', 'NextGen Inc.', 'Spanish', '567-890-1234', 8600.00, 29.5, 1),
('Paul', 'Parker', 'paulp', 'passPaul1', 'paulp@example.com', '1991-05-23', '2023-04-14 11:00:00', 'Orlando', 'Creative Minds', 'English', '678-901-2345', 6800.00, 40.0, 2),
('Quinn', 'Quincy', 'quinnq', 'passQuinn1', 'quinnq@example.com', '1988-07-31', '2023-05-22 08:15:00', 'Salt Lake City', 'DataVision', 'Vietnamese', '789-012-3456', 8000.00, 33.5, 3),
('Rose', 'Roberts', 'roser', 'passRose1', 'roser@example.com', '1993-09-09', '2023-06-30 10:00:00', 'Portland', 'SmartTech', 'Japanese', '890-123-4567', 9300.00, 35.0, 1),
('Sam', 'Smith', 'sams', 'passSam1', 'sams@example.com', '1995-12-15', '2023-07-14 09:30:00', 'San Jose', 'Tech Innovations', 'English', '901-234-5678', 8100.00, 20.0, 2),
('Tina', 'Taylor', 'tinat', 'passTina1', 'tinat@example.com', '1985-06-27', '2023-08-10 15:30:00', 'Dallas', 'DesignPro', 'French', '012-345-6789', 7000.00, 28.0, 3),
('Uma', 'Underwood', 'umau', 'passUma1', 'umau@example.com', '1991-10-12', '2023-09-05 12:20:00', 'Columbus', 'TechCorp', 'English', '123-456-7890', 7800.00, 34.0, 1),
('Vince', 'Vega', 'vincev', 'passVince1', 'vincev@example.com', '1992-01-30', '2023-10-02 11:40:00', 'Indianapolis', 'WebWorks', 'Spanish', '234-567-8901', 7200.00, 36.5, 2),
('Wendy', 'Wilson', 'wendyw', 'passWendy1', 'wendyw@example.com', '1988-04-20', '2023-11-18 13:00:00', 'Charlotte', 'Global Solutions', 'Japanese', '345-678-9012', 8700.00, 26.0, 3),
('Xander', 'Xavier', 'xanderx', 'passXander1', 'xanderx@example.com', '1997-02-03', '2023-12-07 10:15:00', 'El Paso', 'Innovate Ltd', 'English', '456-789-0123', 6600.00, 22.5, 1);

INSERT INTO Dataset (Reliability_minimum, Avatar, Name_dataset, Voucher, Field)
VALUES
(80, 'avatar1.png','Demographic Data Analysis', 10.0, 1),
(85, 'avatar2.png','Electronics Market Research', 15.5, 2),
(90, 'avatar3.png','Financial Transaction Data', 20.0, 3),
(75, 'avatar4.png','Retail Customer Feedback', 8.0, 1),
(88, 'avatar5.png','Healthcare Insurance Data', 12.5, 4),
(82, 'avatar6.png','Social Media Engagement', 9.0, 2),
(92, 'avatar7.png','Real Estate Transaction Data', 18.0, 5),
(78, 'avatar8.png','E-commerce Product Sales', 7.5, 1),
(87, 'avatar9.png', 'Climate Analysis Weather Data', 14.0, 6),
(83, 'avatar10.png', 'Mobile App User Behavior', 11.0, 3),
(84, 'avatar11.png', 'Sports Statistics', 16.0, 7),
(89, 'avatar12.png', 'Urban Planning Traffic Data', 19.5, 8),
(76, 'avatar13.png','Energy Consumption Data', 10.0, 4),
(90, 'avatar14.png','City Safety Crime Statistics', 13.0, 9),
(80, 'avatar15.png', 'Telecom Customer Analysis', 12.0, 3),
(88, 'avatar16.png', 'Automotive Sales Data', 15.0, 5),
(85, 'avatar17.png', 'Agricultural Production Data', 9.5, 10),
(77, 'avatar18.png', 'Tourism Statistics', 8.0, 1),
(91, 'avatar19.png', 'Education Enrollment Data', 17.5, 11),
(93, 'avatar20.png','Food Industry Consumer Preferences', 20.0, 2),
(85, 'avatar21.png', 'Global Demographics Data', 12.5, 1),
(90, 'avatar22.png', 'Tech Industry Market Research', 18.0, 2);

INSERT INTO User_Click (ID_User, ID_Dataset) VALUES
(1, 1), (2, 2),(3, 3),(4, 4), (5, 5),(6, 6),(7, 7),(8, 8),
(9, 9),(10, 10),(1, 11),(2, 12),(3, 13),(4, 14),(15, 15),(16, 16),(17, 17),
(21, 18),(16, 19),(17, 20),(20, 21),(25, 22),(16, 1),(12, 2),(13, 3);

INSERT INTO Version (ID_Dataset, Price, Create_Date, Maximum_size, Total_size, Number_of_data, Data_sending_time_duration, Labeling_time_duration, Valuation_time_duration, Status, 
    Stock_percent, 
    Link_data_mongo, 
    Data_format, 
    Number_parts
) VALUES
(1, 150.00, '2023-01-15 10:30:00', 500.12345, 300.54321, 10000, '2023-01-16 10:30:00', '2023-01-17 10:30:00', '2023-01-18 10:30:00', 1, 95.5, 'mongodb://dataset1', 1, 3),
(2, 175.50, '2023-02-20 11:20:00', 600.12345, 400.54321, 15000, '2023-02-21 11:20:00', '2023-02-22 11:20:00', '2023-02-23 11:20:00', 2, 85.0, 'mongodb://dataset2', 2, 4),
(3, 200.75, '2023-03-25 12:15:00', 700.12345, 500.54321, 20000, '2023-03-26 12:15:00', '2023-03-27 12:15:00', '2023-03-28 12:15:00', 1, 90.0, 'mongodb://dataset3', 1, 5),
(4, 225.00, '2023-04-10 13:10:00', 800.12345, 600.54321, 25000, '2023-04-11 13:10:00', '2023-04-12 13:10:00', '2023-04-13 13:10:00', 2, 80.0, 'mongodb://dataset4', 2, 6),
(5, 250.25, '2023-05-15 14:05:00', 900.12345, 700.54321, 30000, '2023-05-16 14:05:00', '2023-05-17 14:05:00', '2023-05-18 14:05:00', 1, 75.0, 'mongodb://dataset5', 1, 7),
(6, 275.50, '2023-06-20 15:00:00', 1000.12345, 800.54321, 35000, '2023-06-21 15:00:00', '2023-06-22 15:00:00', '2023-06-23 15:00:00', 2, 70.0, 'mongodb://dataset6', 2, 8),
(7, 300.75, '2023-07-25 15:55:00', 1100.12345, 900.54321, 40000, '2023-07-26 15:55:00', '2023-07-27 15:55:00', '2023-07-28 15:55:00', 1, 65.0, 'mongodb://dataset7', 1, 9),
(8, 325.00, '2023-08-30 16:50:00', 1200.12345, 1000.54321, 45000, '2023-08-31 16:50:00', '2023-09-01 16:50:00', '2023-09-02 16:50:00', 2, 60.0, 'mongodb://dataset8', 2, 10),
(9, 350.25, '2023-09-05 17:45:00', 1300.12345, 1100.54321, 50000, '2023-09-06 17:45:00', '2023-09-07 17:45:00', '2023-09-08 17:45:00', 1, 55.0, 'mongodb://dataset9', 1, 11),
(10, 375.50, '2023-10-10 18:40:00', 1400.12345, 1200.54321, 55000, '2023-10-11 18:40:00', '2023-10-12 18:40:00', '2023-10-13 18:40:00', 2, 50.0, 'mongodb://dataset10', 2, 12);

INSERT INTO Admin (Username, Password, Permission) VALUES
('admin1', 'password1', 1),
('admin2', 'password2', 2),
('admin3', 'password3', 1),
('admin4', 'password4', 2),
('admin5', 'password5', 1);

INSERT INTO Data_sending_request (ID_User, Data_type, ID_dataset, Description)
VALUES
(1, 1, 1, 'Sending demographic data analysis results'),
(2, 2, 2, 'Sending market research dataset for electronics'),
(3, 3, 3, 'Sending financial transaction dataset for bank analysis'),
(4, 1, 4, 'Sending customer feedback dataset for retail analysis'),
(10, 4, 5, 'Sending healthcare dataset for insurance analysis'),
(16, 2, 6, 'Sending social media engagement data'),
(17, 5, 7, 'Sending real estate transaction data'),
(28, 1, 8, 'Sending e-commerce product sales data'),
(19, 6, 9, 'Sending climate analysis weather data'),
(20, 3, 10, 'Sending mobile app user behavior dataset'); 

 INSERT INTO Data_buying_request (ID_User, ID_Dataset, Description, Deposit, Price, Due_Date, Data_type)
VALUES
(1, NULL, 'Request for demographic data analysis', 500.00, 2500.00, '2024-09-01 12:00:00', 1),
(2, 2, 'Market research dataset for electronics', 1000.00, 4500.00, '2024-09-10 15:30:00', 2),
(13, NULL, 'Financial transaction dataset for bank', 750.00, 3500.00, '2024-08-20 09:00:00', 3),
(14, NULL, 'Customer feedback dataset for retail', 300.00, 1500.00, '2024-09-05 11:45:00', 1),
(15, 5, 'Healthcare dataset for insurance analysis', 600.00, 3200.00, '2024-08-25 10:00:00', 4),
(26, NULL, 'Social media engagement dataset', 400.00, 2000.00, '2024-09-12 13:00:00', 2),
(17, 7, 'Real estate transaction dataset', 900.00, 4200.00, '2024-09-03 16:00:00', 5),
(8, NULL, 'Product sales dataset for e-commerce', 350.00, 1800.00, '2024-08-30 14:30:00', 1),
(9, 9, 'Weather data for climate analysis', 700.00, 3800.00, '2024-09-08 12:30:00', 6),
(10, NULL, 'User behavior dataset for mobile app', 500.00, 2400.00, '2024-09-15 09:45:00', 3);

INSERT INTO Censorship_DBR (ID_Admin, ID_buying_request, Confirm, Reason)
VALUES
(1, 1, 1, 'Approved after review.'),
(2, 2, 0, 'Rejected due to insufficient deposit.'),
(3, 3, 1, 'Approved with a note for further clarification.'),
(4, 4, 0, 'Not approved as the dataset type does not match.'),
(5, 5, 1, 'Approved. Deposit and price are correct.'),
(1, 6, 1, 'Approved. All conditions met.'),
(2, 7, 0, 'Rejected. The dataset does not meet the requirements.'),
(3, 8, 1, 'Approved after verifying the data type.'),
(4, 9, 1, 'Approved with no issues.'),
(5, 10, 0, 'Rejected due to high price.');

INSERT INTO Censorship_DSR (ID_Admin, ID_data_sending_request, Confirm, Reason)
VALUES
(1, 1, 1, 'Approved. The request is complete and correct.'),
(2, 2, 0, 'Rejected. Missing additional documentation.'),
(3, 3, 1, 'Approved. Dataset meets all criteria.'),
(4, 4, 0, 'Rejected. Incorrect dataset type.'),
(5, 5, 1, 'Approved. All information is accurate.'),
(1, 6, 1, 'Approved. The request conforms to guidelines.'),
(2, 7, 0, 'Rejected. Incomplete data description.'),
(3, 8, 1, 'Approved after verification of dataset.'),
(4, 9, 1, 'Approved. No issues found.'),
(5, 10, 0, 'Rejected. The description lacks details.');

INSERT INTO Censorship_complete_version (ID_Admin, ID_Ver, Confirm, Reason) VALUES
(1, 1, 1, 'Verified and approved for release.'),
(2, 2, 0, 'Incomplete documentation, requires more information.'),
(3, 3, 1, 'Compliant with all required standards.'),
(4, 4, 0, 'Failed security checks, needs revision.'),
(5, 5, 1, 'Approved after successful testing and review.'),
(1, 6, 1, 'All criteria met, approved for deployment.'),
(2, 7, 0, 'Non-compliance with data privacy regulations.'),
(3, 8, 1, 'Confirmed after thorough assessment.'),
(4, 9, 0, 'Issues detected during quality assurance.'),
(5, 10, 1, 'All issues resolved, confirmed for release.');

INSERT INTO Expert_Register (ID_User, File_CV)
VALUES (11, 'path/to/cv_john_doe.pdf'),
(12, 'path/to/cv_jane_smith.docx'),
(13, 'path/to/cv_michael_johnson.pdf'),
(14, 'path/to/cv_emily_davis.docx'),
(15, 'path/to/cv_david_wilson.pdf');

INSERT INTO Authen (ID_Admin, ID_Expert_register, Confirm, Reason)
VALUES (1, 1, 1, 'Approved without issues.'),
(2, 2, 0, 'Missing required documentation.'),
(3, 3, 1, 'Approved after minor corrections.'),
(4, 4, 0, 'Incomplete CV provided.'),
(5, 5, 1, 'Expert registration approved.');

INSERT INTO Expert (ID_User, Field, Description)
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

INSERT INTO Valuation (Time_valuation, ID_user, ID_ver, Price) VALUES
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
('2024-04-03 09:45:00', 34, 9, 5000.00),
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


INSERT INTO Transaction (ID_user, ID_ver) VALUES
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


