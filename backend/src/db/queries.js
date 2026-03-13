const createUsersTableQuery = `
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const createVerificationsTableQuery = `
CREATE TABLE IF NOT EXISTS verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    otp VARCHAR(6) NOT NULL,
    token UUID DEFAULT gen_random_uuid(),
    otp_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    last_resent_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
`;

const dropUsersTableQuery = `
DROP TABLE IF EXISTS verifications;
DROP TABLE IF EXISTS users;
`;

export { createUsersTableQuery, createVerificationsTableQuery, dropUsersTableQuery };