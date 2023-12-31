const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');


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
        const targetPath = path.join(normalizedPath, `${name}`);
        if (type !== "folder") {
            fs.writeFileSync(targetPath, "");
        } else {
            fs.mkdirSync(targetPath);
        }

        let stat;
        let item;
        try {
            stat = fs.statSync(targetPath);
            item = {item: name, ...stat, isFile: stat.isFile(), isDirectory: stat.isDirectory()}
        } catch (error) {
            item = {item: name, isFile: type !== "directory" ? true : false, isDirectory: type === "directory" ? true : false}
        }

        return res.status(201).json({
            target: {
                path: normalizedPath,
                item,
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
        return res.status(201).json({
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
        requestedDestination = req.body.destination;
    
    try {
        // normalize
        const normalizedSource = path.normalize(requestedSource);
        const normalizedDestination = path.normalize(requestedDestination);

        // copy
        fs.cpSync(normalizedSource, normalizedDestination, { recursive: fs.statSync(normalizedSource).isDirectory() });

        const stat = fs.statSync(normalizedDestination);
        const item = {
            item: normalizedDestination.slice(normalizedDestination.lastIndexOf(path.sep), normalizedDestination.length).slice(1), 
            ...stat, 
            isFile: stat.isFile(), 
            isDirectory: stat.isDirectory()
        };
        // ok
        return res.status(200).json({
            target: {
                source: normalizedSource,
                destination: normalizedDestination,
                item,
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

        const stat = fs.statSync(normalizedDestination);
        const item = {
            item: normalizedDestination.slice(normalizedDestination.lastIndexOf(path.sep), normalizedDestination.length).slice(1),
            ...stat, 
            isFile: stat.isFile(), 
            isDirectory: stat.isDirectory()
        };
        // ok
        return res.status(200).json({
            target: {
                source: normalizedSource,
                destination: normalizedDestination,
                item,
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
        function buildTree(directory, depth = 0, maxDepth = 2) {
            if (depth === maxDepth) {
              return null;
            }
          
            const tree = {};
          
            const items = fs.readdirSync(directory);
          
            items.forEach(item => {
                const itemPath = path.join(directory, item);
                try {
                    const stats = fs.statSync(itemPath);
                    if (stats.isDirectory()) {
                        tree[item] = buildTree(itemPath, depth + 1, maxDepth);
                    } else {
                        tree[item] = null;
                    }
                } catch (error) {
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


// open file on different os
const openFile = (req, res, next) => {
    const requestedPath = req.query.path;

    try {
        const filePath = path.normalize(requestedPath);
        switch (os.platform()) {
            case 'darwin':
                exec(`open "${filePath}"`);
                break;
            case 'win32':
                exec(`start "" "${filePath}"`);
                break;
            default:
                exec(`xdg-open "${filePath}"`);
                break;
        }
        return res.status(200).json({
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
    openFile,
};