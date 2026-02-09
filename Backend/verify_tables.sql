-- Script pour vérifier la structure de la table Utilisateurs
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns
WHERE table_name = 'Utilisateurs'
ORDER BY ordinal_position;
