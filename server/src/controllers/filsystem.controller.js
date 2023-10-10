const fs = require('fs');
const path = require('path');


/*
enumerateDisks(): Функція для отримання списку дисків
*/
const enumerateDisks = (req, res, next) => {
    try {
        // list of drives
        const drvs = [];
        // go through chars
        for (let i = 65; i <= 90; i++) {
            const drvPath = String.fromCharCode(i) + ':\\';
            // check if disk exists
            if (fs.existsSync(drvPath)) {
                drvs.push(drvPath);
            }
        }
        // ok
        return res.status(200).json({
            drives: drvs,
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}



/*
navigateFileSystem(path): Функція для навігації файловою системою
*/
const navigateFileSystem = (req, res, next) => {
    // path
    const requestedPath = req.query.path;

    try {
        // normalize path 
        const normalizedPath = path.normalize(requestedPath);
        // read directory using normalized path
        let items = fs.readdirSync(normalizedPath);
        items = items.map(item => {
            try {
                const stat = fs.statSync(path.join(normalizedPath, item));
                item = {item, ...stat, isFile: stat.isFile(), isDirectory: stat.isDirectory()}
            } catch (error) {
                item = {item, isFile: true, isDirectory: false}
            }
            return item;
        });
        // ok
        return res.status(200).json({
            path: normalizedPath,
            items,
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
createFileOrFolder(path, name, type): Функція для створення нового файлу чи
папки з вказаним ім'ям та типом.
*/
const createFileOrFolder = (req, res, next) => {
    // get POST args
    const requestedPath = req.body.path,
        name = req.body.name,
        type = req.body.type;

    try {
        const normalizedPath = path.normalize(requestedPath);
        if (type !== "folder") {
            fs.writeFileSync(path.join(normalizedPath, `${name}.${type}`), "");
        } else {
            fs.mkdirSync(path.join(normalizedPath, `${name}`));
        }

        return res.status(201).json({
            target: {
                path: normalizedPath,
                type,
                name,
            },
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
deleteFileOrFolder(path): Функція для видалення файлу чи папки за вказаним
шляхом.
*/
const deleteFileOrFolder = (req, res, next) => {
    // get POST args
    const requestedPath = req.body.path,
        type = req.body.type;

    try {
        // normalize and remove file or dir
        const normalizedPath = path.normalize(requestedPath);
        fs.rmSync(normalizedPath, { recursive: type === "folder" ? true : false });
        // ok
        return res.status(204).json({
            target: {
                path: normalizedPath,
            },
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
copyFileOrFolder(sourcePath, destinationPath): Функція для копіювання файлу
чи папки з вказаного джерела до вказаного призначення.
*/
const copyFileOrFolder = (req, res, next) => {
    // get POST args
    const requestedSource = req.body.source,
        requestedDestination = req.body.destination,
        type = req.body.type;
    
    try {
        // normalize
        const normalizedSource = path.normalize(requestedSource);
        const normalizedDestination = path.normalize(requestedDestination);
        // copy
        fs.cpSync(normalizedSource, normalizedDestination, { recursive: type === "folder" ? true : false });
        // ok
        return res.status(200).json({
            target: {
                source: normalizedSource,
                destination: normalizedDestination,
            },
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
moveFileOrFolder(sourcePath, destinationPath): Функція для переміщення
файлу чи папки з вказаного джерела до вказаного призначення.
*/
const moveFileOrFolder = (req, res, next) => {
    // get POST args
    const requestedSource = req.body.source,
        requestedDestination = req.body.destination;
    
    try {
        // normalize
        const normalizedSource = path.normalize(requestedSource);
        const normalizedDestination = path.normalize(requestedDestination);
        // move
        fs.renameSync(normalizedSource, normalizedDestination);
        // ok
        return res.status(200).json({
            target: {
                source: normalizedSource,
                destination: normalizedDestination,
            },
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
searchFilesAndFolders(path, query): Функція для пошуку файлів та папок за
вказаним запитом.
*/
const searchFilesAndFolders = (req, res, next) => {
    // get GET args
    const requestedPath = req.query.path,
        query = req.query.query;
    
    try {
        // items to return
        const foundItems = [];
        // normalize path
        const normalizedPath = path.normalize(requestedPath); 
        
        // search files and folders recursively
        const search = (p, query) => {
            const pathItems = fs.readdirSync(p);
            for (const item of pathItems) {
                const itemPath = path.join(p, item);
                const stats = fs.statSync(itemPath);
    
                if (stats.isDirectory()) {
                    search(itemPath, query);
                } else if (item.includes(query)) {
                    foundItems.push(itemPath);
                }
            }
        }
        search(normalizedPath, query);
        
        return res.status(200).json({
            path: normalizedPath,
            query,
            items: foundItems,
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
getFileProperties(path): Функція для отримання властивостей та інформації
про файл за вказаним шляхом
*/
const getFileProperties = (req, res, next) => {
    const requestedPath = req.query.path;

    try {
        // normalized path
        const normalizedPath = path.normalize(requestedPath);
        const statistics = fs.statSync(normalizedPath);

        /*
            size: The size of the file in bytes.
            isFile(): A method that returns true if the path is a regular file.
            isDirectory(): A method that returns true if the path is a directory.
            isSymbolicLink(): A method that returns true if the path is a symbolic link.
            atime: The timestamp when the file or directory was last accessed.
            mtime: The timestamp when the file or directory was last modified.
            ctime: The timestamp when the file or directory status was last changed.
        */
        return res.status(200).json({
            target: {
                path: normalizedPath,
                properties: {
                    ...statistics, 
                    isFile: statistics.isFile(),
                    isDirectory: statistics.isDirectory(),
                    isSymbolikLink: statistics.isSymbolicLink(),
                },
            },
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}

/*
getDirectoryTree(path): Функція для отримання дерева каталогів
*/
const getDirectoryTree = (req, res, next) => {
    const requestedPath = req.query.path;

    try {
        // normalized path
        const normalizedPath = path.normalize(requestedPath);
        
        // function to build tree
        function buildTree(directory) {
            const tree = {};
            const items = fs.readdirSync(directory);
        
            items.forEach(item => {
                const itemPath = path.join(directory, item);
                const stat = fs.statSync(itemPath);

                if (stat.isDirectory()) {
                    tree[item] = buildTree(itemPath);
                } else {
                    tree[item] = null;
                }
            });
        
            return tree;
        }

        // tree
        const tree = buildTree(normalizedPath);

        return res.status(200).json({
            tree,
            done: true,
        });
    } catch (error) {
        return next(error);
    }
}





module.exports = {
    enumerateDisks,
    navigateFileSystem,
    createFileOrFolder,
    deleteFileOrFolder,
    copyFileOrFolder,
    moveFileOrFolder,
    searchFilesAndFolders,
    getFileProperties,
    getDirectoryTree,
};