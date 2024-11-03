CREATE DATABASE db_ticketing;
USE db_ticketing;

CREATE TABLE tbl_users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    userName VARCHAR(255) NOT NULL,
    userEmail VARCHAR(255) NOT NULL,
    userPhone VARCHAR(15) NOT NULL, 
    userRole INT NOT NULL, 
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_tickets (
    ticketId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    ticketTitle VARCHAR(255) NOT NULL,
    ticketDesc VARCHAR(255) NOT NULL, 
    ticketStatus VARCHAR(255) NOT NULL,
    ticketResoDate VARCHAR(255), 
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES tbl_users(userId)
);

CREATE TABLE tbl_responses (
    responseId INT PRIMARY KEY AUTO_INCREMENT,
    ticketId INT,
    userId INT,
    responseText VARCHAR(255) NOT NULL, 
    responseDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticketId) REFERENCES tbl_tickets(ticketId),
    FOREIGN KEY (userId) REFERENCES tbl_users(userId)
);

CREATE TABLE tbl_categories (
    categoryId INT PRIMARY KEY AUTO_INCREMENT,
    categoryName VARCHAR(255) NOT NULL,
    categoryDesc VARCHAR(255) NOT NULL, 
    created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE tbl_ticketCategory (
    ticketId INT,
    categoryId INT,
    FOREIGN KEY (ticketId) REFERENCES tbl_tickets(ticketId), 
    FOREIGN KEY (categoryId) REFERENCES tbl_categories(categoryId),
    PRIMARY KEY (ticketId, categoryId) 
);

CREATE TABLE tbl_departmentBranch(
    departmentId INT PRIMARY KEY AUTO_INCREMENT,
    departmentName VARCHAR(255) NOT NULL
    
);

ALTER TABLE tbl_users
ADD COLUMN username VARCHAR(255) NOT NULL;
ADD COLUMN passwrd VARCHAR(255) NOT NULL;


ALTER TABLE tbl_users
ADD COLUMN passwrd VARCHAR(255) NOT NULL;

ALTER TABLE tbl_users
DROP COLUMN userRole;

ALTER TABLE tbl_tickets
ADD COLUMN ticketService VARCHAR(255) NOT NULL;

ALTER TABLE tbl_tickets
ADD COLUMN ticketDeleteStatus VARCHAR(255) NOT NULL;


ALTER TABLE tbl_tickets
ADD COLUMN ticketNumberOfComp VARCHAR(255) NOT NULL;

ALTER TABLE tbl_tickets
ADD COLUMN ticketNumberOfUsers VARCHAR(255) NOT NULL;