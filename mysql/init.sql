CREATE DATABASE IF NOT EXISTS nutrivida_catalogo;
CREATE DATABASE IF NOT EXISTS nutrivida_atencion;
CREATE DATABASE IF NOT EXISTS nutrivida_ventas;

GRANT ALL PRIVILEGES ON nutrivida_catalogo.* TO 'nutrivida'@'%';
GRANT ALL PRIVILEGES ON nutrivida_atencion.* TO 'nutrivida'@'%';
GRANT ALL PRIVILEGES ON nutrivida_ventas.* TO 'nutrivida'@'%';
