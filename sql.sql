CREATE TABLE usuarios (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    senha VARCHAR(255) NOT NULL
);
CREATE TABLE dentistas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    cro VARCHAR(20) NOT NULL UNIQUE,
    especialidade VARCHAR(100) NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE clientes (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    usuario_id INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
CREATE TABLE consultas (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    dentista_id INT NOT NULL,
    cliente_id INT NOT NULL,
    data_hora TIMESTAMP NOT NULL,
    FOREIGN KEY (dentista_id) REFERENCES dentistas(id),
    FOREIGN KEY (cliente_id) REFERENCES clientes(id)
);