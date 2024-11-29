const express = require('express');
const router = express.Router();
const inscriptionController = require('../controllers/inscriptionController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { authenticateJWT, authorizePermission } = require('../middlewares/authMiddleware');


// Ruta para crear un registro en inscription_caracterizacion sin autenticación
router.post(
  '/inscriptions/tables/:table_name/record/public',
  inscriptionController.addRecord
);

// Ruta para crear un registro en la tabla 'inscription_caracterizacion' sin autenticación.
router.post(
  '/tables/:table_name/record/create',
  inscriptionController.createNewRecord
);

// Ruta para obtener los campos de una tabla específica (sin autenticación)
router.get('/tables/:table_name/fields', inscriptionController.getTableFields);

// Ruta para obtener datos relacionados de una tabla específica (sin autenticación)
router.get('/tables/:table_name/related-data', inscriptionController.getRelatedData);

// Ruta para validar si un campo ya existe (sin autenticación)
router.post(
  '/tables/:table_name/validate',
  inscriptionController.validateField
);

// Ruta para crear una nueva tabla (requiere permiso 'manage_tables')
router.post('/create-table', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.createTable);

// Ruta para listar todas las tablas creadas (requiere permiso 'view_tables')
router.get('/tables', authenticateJWT, authorizePermission('view_tables'), inscriptionController.listTables);

// Ruta para eliminar una tabla (requiere permiso 'manage_tables')
router.delete('/tables/:table_name', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.deleteTable);

// Ruta para editar una tabla (agregar o quitar columnas) (requiere permiso 'manage_tables')
router.put('/tables/:table_name', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.editTable);

// Ruta para agregar un registro a una tabla específica (requiere permiso 'manage_tables')
router.post('/tables/:table_name/record', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.addRecord);

// Ruta para descargar el CSV (requiere permiso 'view_tables')
router.get('/tables/:table_name/csv-template', authenticateJWT, authorizePermission('view_tables'), inscriptionController.downloadCsvTemplate);

// Ruta para cargar un archivo CSV (requiere permiso 'manage_tables')
router.post('/tables/:table_name/upload-csv', authenticateJWT, authorizePermission('manage_tables'), upload.single('file'), inscriptionController.uploadCsv);

// Ruta para descargar los datos de la tabla en formato CSV (requiere permiso 'view_tables')
router.get('/tables/:table_name/download-csv', authenticateJWT, authorizePermission('view_tables'), inscriptionController.downloadCsvData);

// Ruta para obtener los registros de una tabla (requiere permiso 'view_tables')
router.get('/tables/:table_name/records', authenticateJWT, authorizePermission('view_tables'), inscriptionController.getTableRecords);

// Ruta para obtener un registro específico (requiere permiso 'view_tables')
router.get('/tables/:table_name/record/:record_id', authenticateJWT, authorizePermission('view_tables'), inscriptionController.getTableRecordById);

// Ruta para actualizar un registro específico (requiere permiso 'manage_tables')
router.put('/tables/:table_name/record/:record_id', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.updateTableRecord);

// Ruta para actualizar el estado de principal de una tabla (requiere permiso 'manage_tables')
router.put('/tables/:table_name/principal', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.updatePrincipalStatus);

// Ruta para actualización masiva de registros (requiere permiso 'manage_tables')
router.put('/tables/:table_name/bulk-update', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.bulkUpdateRecords);

// Ruta para obtener opciones de un campo específico (requiere permiso 'view_tables')
router.get('/tables/:table_name/field-options/:field_name', authenticateJWT, authorizePermission('view_tables'), inscriptionController.getFieldOptions);

// Ruta para subir un archivo sin autenticación ni permisos específicos
router.post(
  '/tables/:table_name/record/:record_id/upload',
  upload.single('file'), // Configuración de multer para un solo archivo
  inscriptionController.uploadFile
);


// Ruta para obtener archivos asociados a un registro (requiere permiso 'view_tables')
router.get(
  '/tables/:table_name/record/:record_id/files',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getFiles
);

// Ruta para eliminar un archivo asociado a un registro (requiere permiso 'manage_tables')
router.delete(
  '/tables/:table_name/record/:record_id/file/:file_id',
  authenticateJWT,
  authorizePermission('manage_tables'),
  inscriptionController.deleteFile
);

router.get(
  '/tables/:table_name/record/:record_id/download-zip',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.downloadZip
);

router.post(
  '/download-multiple-zip',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.downloadMultipleZip
);

// Rutas específicas para Proveedores usando el mismo controlador
router.post('/provider/create-table', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.createTable);
router.get('/provider/tables', authenticateJWT, authorizePermission('view_tables'), inscriptionController.listTables);

// Rutas específicas para Plan de Inversión usando el mismo controlador
router.post('/pi/create-table', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.createTable);
router.get('/pi/tables', authenticateJWT, authorizePermission('view_tables'), inscriptionController.listTables);

// Ruta para obtener los campos de una tabla específica de PI (requiere permiso 'view_tables')
router.get(
  '/pi/tables/:table_name/fields',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getTableFields
);

// Ruta para obtener los registros de una tabla de PI (requiere permiso 'view_tables')
router.get(
  '/pi/tables/:table_name/records',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getTableRecords
);

// Ruta para obtener los registros de inscription_caracterizacion con estado 4
router.get(
  '/pi/caracterizacion/records',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getActiveCaracterizacionRecords
);

// Ruta para crear un nuevo registro en una tabla dinámica de PI
router.post('/pi/tables/:table_name/record', inscriptionController.createTableRecord);

// Ruta para actualizar un registro existente en una tabla dinámica de PI (nuevo controlador)
router.put('/pi/tables/:table_name/record/:record_id', authenticateJWT, authorizePermission('manage_tables'), inscriptionController.updatePiRecord);

// Ruta para guardar la configuración de columnas visibles para una tabla específica
router.post(
  '/tables/:table_name/visible-columns',
  authenticateJWT,
  authorizePermission('manage_tables'),
  inscriptionController.saveVisibleColumns
);

// Ruta para obtener la configuración de columnas visibles de una tabla específica
router.get(
  '/tables/:table_name/visible-columns',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getVisibleColumns
);

// Ruta para actualizar el cumplimiento de un archivo asociado a un registro (requiere permiso 'manage_tables')
router.put(
  '/tables/:table_name/record/:record_id/file/:file_id/compliance',
  authenticateJWT,
  authorizePermission('manage_tables'),
  inscriptionController.updateFileCompliance
);

// Ruta para guardar las preferencias de columnas visibles
router.post('/tables/:table_name/field-preferences', inscriptionController.saveFieldPreferences);

// Ruta para obtener las preferencias de columnas visibles
router.get('/tables/:table_name/field-preferences', inscriptionController.getFieldPreferences);

// Ruta para obtener datos relacionados en el contexto de PI (Plan de Inversión)
router.get(
  '/pi/tables/:table_name/related-data',
  authenticateJWT, 
  authorizePermission('view_tables'), 
  inscriptionController.getRelatedData
);

// Ruta para eliminar un registro específico en una tabla dinámica de PI
router.delete(
  '/pi/tables/:table_name/record/:record_id',
  authenticateJWT,
  authorizePermission('manage_tables'),
  inscriptionController.deleteTableRecord
);

// ----------------------------------------------------------------------------------------
// ------------------------------ NUEVA RUTA createComment -------------------------------
// ----------------------------------------------------------------------------------------

// Ruta para crear un nuevo comentario (requiere autenticación y permiso 'manage_comments')
router.post(
  '/tables/:table_name/record/:record_id/comments',
  authenticateJWT,
  authorizePermission('manage_tables'),
  inscriptionController.createComment
);

// Ruta para obtener comentarios de un registro (requiere autenticación y permiso 'view_comments')
router.get(
  '/tables/:table_name/record/:record_id/comments',
  authenticateJWT,
  authorizePermission('view_tables'),
  inscriptionController.getComments
);


module.exports = router;
