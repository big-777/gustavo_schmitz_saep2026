const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "consultorio",
    password: "senai",
    port: 5432
});


// usuarios


// listar usuários
app.get("/usuarios", async (req, res) => {
    try {
        const resultado = await pool.query(
            "SELECT * FROM usuarios ORDER BY id"
        );

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// buscar usuário por ID
app.get("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM usuarios WHERE id = $1",
            [id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// criar usuário
app.post("/usuarios", async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        const resultado = await pool.query(
            `INSERT INTO usuarios (nome, email, senha)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [nome, email, senha]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// atualizar usuário
app.put("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, email, senha } = req.body;

        const resultado = await pool.query(
            `UPDATE usuarios
             SET nome = $1, email = $2, senha = $3
             WHERE id = $4
             RETURNING *`,
            [nome, email, senha, id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// deletar usuário
app.delete("/usuarios/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM usuarios WHERE id = $1",
            [id]
        );

        res.json({ mensagem: "Usuário excluído com sucesso" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// DENTISTAS

// listar dentistas
app.get("/dentistas", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT 
                dentistas.id,
                usuarios.nome,
                usuarios.email,
                dentistas.cro,
                dentistas.especialidade
            FROM dentistas
            INNER JOIN usuarios
                ON dentistas.usuario_id = usuarios.id
            ORDER BY dentistas.id
        `);

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// buscar dentista por ID
app.get("/dentistas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            `SELECT * FROM dentistas
             WHERE id = $1`,
            [id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// criar dentista
app.post("/dentistas", async (req, res) => {
    try {
        const { usuario_id, cro, especialidade } = req.body;

        const resultado = await pool.query(
            `INSERT INTO dentistas
             (usuario_id, cro, especialidade)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [usuario_id, cro, especialidade]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// atualizar dentista
app.put("/dentistas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id, cro, especialidade } = req.body;

        const resultado = await pool.query(
            `UPDATE dentistas
             SET usuario_id = $1,
                 cro = $2,
                 especialidade = $3
             WHERE id = $4
             RETURNING *`,
            [usuario_id, cro, especialidade, id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// deletar dentista
app.delete("/dentistas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM dentistas WHERE id = $1",
            [id]
        );

        res.json({ mensagem: "Dentista excluído com sucesso" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});


// CLIENTES

// listar clientes
app.get("/clientes", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                clientes.id,
                usuarios.nome,
                usuarios.email
            FROM clientes
            INNER JOIN usuarios
                ON clientes.usuario_id = usuarios.id
            ORDER BY clientes.id
        `);

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// buscar cliente por ID
app.get("/clientes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM clientes WHERE id = $1",
            [id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// criar cliente
app.post("/clientes", async (req, res) => {
    try {
        const { usuario_id } = req.body;

        const resultado = await pool.query(
            `INSERT INTO clientes (usuario_id)
             VALUES ($1)
             RETURNING *`,
            [usuario_id]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// atualizar cliente
app.put("/clientes/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { usuario_id } = req.body;

        const resultado = await pool.query(
            `UPDATE clientes
             SET usuario_id = $1
             WHERE id = $2
             RETURNING *`,
            [usuario_id, id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// deletar cliente
app.delete("/clientes/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM clientes WHERE id = $1",
            [id]
        );

        res.json({ mensagem: "Cliente excluído com sucesso" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// consultas

// listar consultas
app.get("/consultas", async (req, res) => {
    try {
        const resultado = await pool.query(`
            SELECT
                consultas.id,
                consultas.data_hora,
                dentista.nome AS dentista,
                cliente.nome AS cliente,
                dentistas.cro,
                dentistas.especialidade
            FROM consultas

            INNER JOIN dentistas
                ON consultas.dentista_id = dentistas.id

            INNER JOIN usuarios AS dentista
                ON dentistas.usuario_id = dentista.id

            INNER JOIN clientes
                ON consultas.cliente_id = clientes.id

            INNER JOIN usuarios AS cliente
                ON clientes.usuario_id = cliente.id

            ORDER BY consultas.data_hora
        `);

        res.json(resultado.rows);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// buscar consulta por ID
app.get("/consultas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const resultado = await pool.query(
            "SELECT * FROM consultas WHERE id = $1",
            [id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});
// criar consulta
app.post("/consultas", async (req, res) => {
    try {
        const { dentista_id, cliente_id, data_hora } = req.body;

        const resultado = await pool.query(
            `INSERT INTO consultas
             (dentista_id, cliente_id, data_hora)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [dentista_id, cliente_id, data_hora]
        );

        res.status(201).json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});

// atualizar consulta
app.put("/consultas/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { dentista_id, cliente_id, data_hora } = req.body;

        const resultado = await pool.query(
            `UPDATE consultas
             SET dentista_id = $1,
                 cliente_id = $2,
                 data_hora = $3
             WHERE id = $4
             RETURNING *`,
            [dentista_id, cliente_id, data_hora, id]
        );

        res.json(resultado.rows[0]);
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});
// delet consulta
app.delete("/consultas/:id", async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query(
            "DELETE FROM consultas WHERE id = $1",
            [id]
        );

        res.json({ mensagem: "Consulta excluída com sucesso" });
    } catch (erro) {
        res.status(500).json({ erro: erro.message });
    }
});
// server
app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
});