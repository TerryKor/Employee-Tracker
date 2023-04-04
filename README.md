# Employee-Tracker


## Description

This application is created to keep companys information in a neat way and to be able to add or remove data when needed.<br />
Including following features:<br />
- View all employees<br />
- Add employee<br />
- Update Employee Role<br />
- View all roles<br />
- Add role<br />
- View all departments<br />
- Add department<br />
- Update employee managers<br />
- View employees by manager<br />
- View employees by department<br />
- Delete departments<br />
- Delete role<br />
- Delete employee<br />
- View the total utilized budget of a department<br />

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Contribution](#contribution)
- [Questions](#questions)
- [License](#license)

## Installation

- Clone application [Employee-Tracker](https://github.com/TerryKor/Employee-Tracker)<br />

- Then go in file directory, to install necessary dependencies, running following command:
```
npm i
```

- To run the app run the following command:
```
node server.js
```

- Note: please make sure you have installed [MySQL](https://www.mysql.com/downloads/) and created account;<br />

- To create schema run the following commands:<br />
login to MYSQL and enter password when prompted, run the following command:<br />
```
mysql -u root -p (where "root" is your user name)
```
then run these commands:
```
source ./db/schema.sql 
```
```
source ./db/seeds.sql 
```


## Usage

You can see demonstration video [here](https://drive.google.com/file/d/1s8fHJFTXreMa2GPD2fMlHTx02NloUb33/view)


## Contribution

Application was created by Terry Kornienko and if you want to contribute send me email.

## Questions

My Email:
[misterfreemann@gmail.com](mailto:misterfreemann@gmail.com)
My Github:
[TerryKor](https://github.com/TerryKor)

## License

![badge](https://img.shields.io/badge/license-MIT-blue)