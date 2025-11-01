CREATE DATABASE db_contabilidad;
GO

USE db_contabilidad;
GO

CREATE TABLE especialidad(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Nombre VARCHAR(50)
);
GO

CREATE TABLE profesional (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Nombre VARCHAR(50),
	Apellido VARCHAR(50),
	Correo VARCHAR(50),
	Descripcion VARCHAR(100),
	Foto VARCHAR(50),
);
GO

CREATE TABLE servicio (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Nombre VARCHAR(50),
	Precio DECIMAL(20,2),
	Duracion DECIMAL(10,2),
	Estado bit,
	IdEspecialidad INT FOREIGN KEY references especialidad(Id)
);
GO

CREATE TABLE profesional_servicio_detalle(
	Id INT IDENTITY(1,1) PRIMARY KEY,
	IdServicio INT FOREIGN KEY REFERENCES servicio(Id),
	IdProfesional INT FOREIGN KEY REFERENCES profesional(Id)
);
GO

CREATE TABLE paciente (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	Nombre VARCHAR(50),
	Apellido VARCHAR(50),
	Correo VARCHAR(50),
	Descripcion VARCHAR(100),
	Rut VARCHAR(50),
	Foto VARCHAR(50),
	Direccion VARCHAR(100),
	Telefono VARCHAR(20),
);
GO

CREATE TABLE cita (
	Id INT IDENTITY(1,1) PRIMARY KEY,
	FechaHora DATETIME,
	IdPaciente INT FOREIGN KEY REFERENCES paciente(Id),
	IdServicio INT FOREIGN KEY REFERENCES servicio(Id),
	IdProfesional INT FOREIGN KEY REFERENCES profesional(Id)
);
GO


SELECT * FROM especialidad;
GO

SELECT * FROM profesional;
GO

SELECT * FROM servicio;
GO

SELECT * FROM paciente;
GO

SELECT * FROM cita;
GO