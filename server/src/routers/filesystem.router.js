const express = require('express');
const fsController = require('../controllers/filsystem.controller');

// filesys router
const filesystemRouter = express.Router();

// endpoints
// GET
filesystemRouter.get('/drives', fsController.enumerateDisks);
filesystemRouter.get('/path',   fsController.navigateFileSystem);
filesystemRouter.get('/search', fsController.searchFilesAndFolders);
filesystemRouter.get('/info',   fsController.getFileProperties);
filesystemRouter.get('/tree',   fsController.getDirectoryTree);
// POST
filesystemRouter.post('/create', fsController.createFileOrFolder);
filesystemRouter.post('/delete', fsController.deleteFileOrFolder);
filesystemRouter.post('/copy',   fsController.copyFileOrFolder);
filesystemRouter.post('/move',   fsController.moveFileOrFolder);

// export
module.exports = filesystemRouter;