INSERT INTO clientes (rut, nombre, correo, telefono, direccion) VALUES
('12.345.678-5', 'María González Pérez', 'maria.gonzalez@gmail.com', '+56 9 8765 4321', 'Av. Collao 1202, Concepción'),
('15.678.234-K', 'Juan Muñoz Soto', 'jmunoz@outlook.com', '+56 9 7123 4567', 'O''Higgins 450, Concepción'),
('18.234.567-2', 'Camila Rojas Díaz', 'camila.rojas@gmail.com', '+56 9 6234 5678', 'Colón 3300, Talcahuano'),
('9.876.543-1', 'Pedro Fuentes Vera', 'pfuentes@empresa.cl', '+56 9 5345 6789', 'Los Carrera 820, Chillán'),
('20.123.456-7', 'Valentina Torres Lagos', 'vtorres@gmail.com', '+56 9 4456 7890', 'Av. Alemania 150, Los Ángeles');

INSERT INTO mascotas (cliente_id, nombre, especie, raza, fecha_nacimiento, peso) VALUES
(1, 'Luna', 'Perro', 'Labrador', '2021-03-14', 24.50),
(1, 'Michi', 'Gato', 'Siamés', '2023-07-02', 4.10),
(2, 'Rocky', 'Perro', 'Bulldog Francés', '2020-11-20', 12.30),
(3, 'Nala', 'Gato', 'Persa', '2022-05-08', 3.80),
(3, 'Coco', 'Ave', 'Cacatúa', '2019-09-15', 0.45),
(3, 'Max', 'Perro', 'Mestizo', '2018-01-30', 18.00),
(4, 'Toby', 'Perro', 'Beagle', '2022-02-11', 11.20),
(5, 'Simba', 'Gato', 'Mestizo', '2024-04-03', 3.20);

INSERT INTO veterinarios (nombre, especialidad, correo) VALUES
('Dr. Andrés Salazar', 'Medicina general', 'asalazar@petcare.cl'),
('Dra. Paula Fernández', 'Dermatología', 'pfernandez@petcare.cl'),
('Dr. Felipe Morales', 'Cirugía', 'fmorales@petcare.cl');

INSERT INTO horarios_veterinario (veterinario_id, dia_semana, hora_inicio, hora_fin) VALUES
(1, 'LUNES', '09:00', '13:00'),
(1, 'MARTES', '09:00', '13:00'),
(1, 'MIERCOLES', '09:00', '13:00'),
(1, 'JUEVES', '09:00', '13:00'),
(1, 'VIERNES', '09:00', '13:00'),
(1, 'LUNES', '15:00', '18:00'),
(1, 'MIERCOLES', '15:00', '18:00'),
(2, 'LUNES', '09:00', '13:00'),
(2, 'MIERCOLES', '09:00', '13:00'),
(2, 'JUEVES', '15:00', '19:00'),
(3, 'MARTES', '09:00', '14:00'),
(3, 'JUEVES', '09:00', '14:00'),
(3, 'SABADO', '10:00', '13:00');

INSERT INTO reservas (mascota_id, veterinario_id, fecha, hora, motivo, estado) VALUES
(1, 1, '2026-06-04', '10:00', 'Vómitos y decaimiento', 'ATENDIDA'),
(3, 1, '2026-10-19', '09:30', 'Vacuna antirrábica', 'ATENDIDA'),
(4, 2, '2026-10-28', '11:00', 'Caída de pelo', 'ATENDIDA'),
(1, 2, '2026-11-23', '10:00', 'Control anual y vacunas', 'CONFIRMADA'),
(7, 1, '2026-11-23', '10:00', 'Dolor en pata trasera', 'PENDIENTE'),
(4, 2, '2026-11-23', '11:30', 'Revisión dermatológica', 'PENDIENTE'),
(8, 2, '2026-11-23', '12:00', 'Control post operatorio', 'CANCELADA'),
(6, 3, '2026-11-24', '09:00', 'Evaluación prequirúrgica', 'CONFIRMADA');

INSERT INTO atenciones (reserva_id, diagnostico, observaciones) VALUES
(1, 'Gastroenteritis leve', 'Dieta blanda por 3 días'),
(2, 'Paciente sano, se aplica vacuna antirrábica', 'Próxima dosis en un año'),
(3, 'Dermatitis alérgica', 'Cambiar alimento a dieta hipoalergénica');

INSERT INTO tratamientos (atencion_id, medicamento, dosis, frecuencia, duracion) VALUES
(1, 'Metoclopramida 10 mg', 'Medio comprimido', 'Cada 8 horas', '3 días'),
(3, 'Apoquel 3,6 mg', '1 comprimido', 'Cada 12 horas', '14 días'),
(3, 'Shampoo de clorhexidina 2%', 'Un baño', 'Cada 3 días', '2 semanas');
