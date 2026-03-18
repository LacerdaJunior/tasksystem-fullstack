import sql from "../src/config/db.js";

async function createTable() {
  try {
    await sql`


CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    TEXT NOT NULL
)
        
`;
    console.log("Table created successfully ");
  } catch (error) {
    console.error("Error creating table", error);
  }
}
createTable();

// Para fins de testes de dev, segue abaixo as tabelas a serem adicionadas no PostgreSQL (Neon).
// IMPORTANTE: Execute a criação na ordem exata abaixo devido às chaves estrangeiras (Foreign Keys).

/* 1ª Tabela: Usuários (A base de tudo) */
/*
CREATE TABLE users (
  id          TEXT PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) UNIQUE NOT NULL,
  password    TEXT NOT NULL
); 
*/

/* 2ª Tabela: Categorias (Deve ser criada antes das Tasks) */
/*
CREATE TABLE categories (
  id          UUID PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  color       VARCHAR(20) DEFAULT '#6366f1',
  user_email  VARCHAR(150) NOT NULL,
    
  CONSTRAINT fk_category_user
    FOREIGN KEY(user_email) 
    REFERENCES users(email)
    ON DELETE CASCADE
);
*/

/* 3ª Tabela: Tarefas (Kanban atualizado com status, datas e categorias) */
/*
CREATE TABLE tasks (
  id          UUID PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20) DEFAULT 'TODO',
  due_date    TIMESTAMP,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  category_id UUID,
  user_email  VARCHAR(150) NOT NULL,

  CONSTRAINT fk_user
    FOREIGN KEY(user_email) 
    REFERENCES users(email)
    ON DELETE CASCADE,

  CONSTRAINT fk_task_category 
    FOREIGN KEY (category_id) 
    REFERENCES categories(id) 
    ON DELETE SET NULL
);
*/
