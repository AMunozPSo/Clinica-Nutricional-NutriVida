-- Datos de demostración del catálogo de NutriVida (categorías y servicios).
-- Se puede ejecutar varias veces: no borra nada y no duplica registros.
-- Uso: docker exec -i nutrivida-db-1 sh -c 'mysql --default-character-set=utf8mb4 -uroot -p"$MYSQL_ROOT_PASSWORD" nutrivida_catalogo' < datos-demo.sql
SET NAMES utf8mb4;

INSERT IGNORE INTO categoria (id_categoria, nombre) VALUES
  (UUID(), 'Evaluaciones'),
  (UUID(), 'Planes'),
  (UUID(), 'Talleres'),
  (UUID(), 'Control de Peso'),
  (UUID(), 'Nutrición Deportiva'),
  (UUID(), 'Vegetariana'),
  (UUID(), 'Bienestar y hábitos saludables');

INSERT INTO servicio (id_servicio, titulo, descripcion, precio, descuento_porcentaje, modalidad, duracion_minutos, imagen_url, id_categoria)
SELECT UUID(), t.titulo, t.descripcion, t.precio, t.descuento, t.modalidad, t.duracion, t.imagen, c.id_categoria
FROM (
  SELECT 'Consulta de hábitos saludables' AS titulo, 'Consulta de 45 minutos para revisar tus hábitos de alimentación y organizar una rutina equilibrada.' AS descripcion, 30000 AS precio, 20 AS descuento, 'PRESENCIAL' AS modalidad, 45 AS duracion, '/consulta.jpg' AS imagen, 'Bienestar y hábitos saludables' AS categoria
  UNION ALL SELECT 'Evaluación nutricional integral', 'Revisión de hábitos, composición corporal y objetivos personales en una consulta inicial de 60 minutos.', 28000, 15, 'PRESENCIAL', 60, '/consulta.jpg', 'Evaluaciones'
  UNION ALL SELECT 'Plan de alimentación personalizado', 'Consulta para organizar una pauta de alimentación según tus horarios, preferencias y objetivos de bienestar.', 40000, 20, 'PRESENCIAL', 60, '/consulta.jpg', 'Planes'
  UNION ALL SELECT 'Taller de cocina saludable', 'Aprende preparaciones sencillas, combinaciones equilibradas y consejos para cocinar durante la semana.', 18000, 10, 'PRESENCIAL', 90, '/talleres.jpg', 'Talleres'
  UNION ALL SELECT 'Seguimiento de hábitos y control de peso', 'Revisa tus avances y ajusta tus hábitos con acompañamiento nutricional centrado en metas sostenibles.', 26000, 15, 'PRESENCIAL', 30, '/consulta.jpg', 'Control de Peso'
  UNION ALL SELECT 'Evaluación de nutrición deportiva', 'Consulta para revisar alimentación, hidratación y recuperación de acuerdo con tu actividad física.', 45000, 20, 'PRESENCIAL', 60, '/consulta.jpg', 'Nutrición Deportiva'
  UNION ALL SELECT 'Consulta de alimentación vegetariana', 'Orientación para organizar comidas variadas y conocer fuentes vegetales de proteínas y otros nutrientes.', 32000, 15, 'PRESENCIAL', 45, '/consulta.jpg', 'Vegetariana'
  UNION ALL SELECT 'Taller de lectura de etiquetas', 'Aprende a interpretar porciones, ingredientes y sellos de advertencia con ejemplos de productos cotidianos.', 15000, 20, 'ONLINE', 60, '/talleres.jpg', 'Talleres'
  UNION ALL SELECT 'Organización del menú semanal', 'Sesión práctica para planificar tus comidas, preparar una lista de compras y aprovechar mejor tus alimentos.', 22000, 10, 'ONLINE', 60, '/consulta.jpg', 'Bienestar y hábitos saludables'
) AS t
JOIN categoria c ON c.nombre = t.categoria
WHERE NOT EXISTS (SELECT 1 FROM servicio s WHERE s.titulo = t.titulo);

SELECT CONCAT('categorias=', COUNT(*)) FROM categoria;
SELECT CONCAT('servicios=', COUNT(*)) FROM servicio;
