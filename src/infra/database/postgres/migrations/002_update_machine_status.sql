BEGIN;

-- Remove a regra antiga
ALTER TABLE machines
DROP CONSTRAINT IF EXISTS machines_status_check;

-- Atualiza registros que utilizam o status antigo
UPDATE machines
SET status = 'STOPPED_DUE_TO_FAILURE'
WHERE status = 'FAILED';

-- Adiciona a nova regra
ALTER TABLE machines
ADD CONSTRAINT machines_status_check
CHECK (
    status IN (
        'OPERATIONAL',
        'MAINTENANCE',
        'STOPPED_DUE_TO_FAILURE'
    )
);

COMMIT;