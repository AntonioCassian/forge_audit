-- Migration 003: Configurar geração automática de UUID para usuários

ALTER TABLE users
ALTER COLUMN id SET DEFAULT gen_random_uuid();