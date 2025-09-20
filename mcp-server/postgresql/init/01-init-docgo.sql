-- DocGO Database Initialization Script
-- Created for DocGO project with congty.devgo2003@gmail.com

-- Create database if not exists
CREATE DATABASE docgo_db;

-- Connect to docgo_db
\c docgo_db;

-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create schemas
CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS contracts;
CREATE SCHEMA IF NOT EXISTS files;
CREATE SCHEMA IF NOT EXISTS ai_processing;

-- Create users table
CREATE TABLE IF NOT EXISTS auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    google_id VARCHAR(255) UNIQUE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create roles table
CREATE TABLE IF NOT EXISTS auth.roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS auth.user_roles (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role_id UUID REFERENCES auth.roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts.contracts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create files table
CREATE TABLE IF NOT EXISTS files.files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create ai_processing_jobs table
CREATE TABLE IF NOT EXISTS ai_processing.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    job_type VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    input_data JSONB,
    output_data JSONB,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Insert default roles
INSERT INTO auth.roles (name, description) VALUES 
    ('admin', 'System Administrator'),
    ('user', 'Regular User'),
    ('manager', 'Contract Manager'),
    ('viewer', 'Read-only User')
ON CONFLICT (name) DO NOTHING;

-- Insert default admin user (congty.devgo2003@gmail.com)
INSERT INTO auth.users (email, username, password_hash, first_name, last_name, google_id) VALUES 
    ('congty.devgo2003@gmail.com', 'congtydevgo2003', crypt('admin123', gen_salt('bf')), 'Cong Ty', 'DevGO2003', 'congty.devgo2003@gmail.com')
ON CONFLICT (email) DO NOTHING;

-- Assign admin role to default user
INSERT INTO auth.user_roles (user_id, role_id) 
SELECT u.id, r.id 
FROM auth.users u, auth.roles r 
WHERE u.email = 'congty.devgo2003@gmail.com' AND r.name = 'admin'
ON CONFLICT DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_email ON auth.users(email);
CREATE INDEX IF NOT EXISTS idx_users_google_id ON auth.users(google_id);
CREATE INDEX IF NOT EXISTS idx_contracts_created_by ON contracts.contracts(created_by);
CREATE INDEX IF NOT EXISTS idx_contracts_status ON contracts.contracts(status);
CREATE INDEX IF NOT EXISTS idx_files_uploaded_by ON files.files(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_created_by ON ai_processing.jobs(created_by);
CREATE INDEX IF NOT EXISTS idx_ai_jobs_status ON ai_processing.jobs(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON auth.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts.contracts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE docgo_db TO docgo_user;
GRANT ALL PRIVILEGES ON SCHEMA auth TO docgo_user;
GRANT ALL PRIVILEGES ON SCHEMA contracts TO docgo_user;
GRANT ALL PRIVILEGES ON SCHEMA files TO docgo_user;
GRANT ALL PRIVILEGES ON SCHEMA ai_processing TO docgo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA auth TO docgo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA contracts TO docgo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA files TO docgo_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA ai_processing TO docgo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA auth TO docgo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA contracts TO docgo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA files TO docgo_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA ai_processing TO docgo_user;
