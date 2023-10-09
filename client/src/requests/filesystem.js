import axios from "axios";


const API_URL = process.env.REACT_APP_API_URL;


// list drives
const httpListDrives = async() => {
    return await axios.get(`${API_URL}/drives`);
}

// navigate fs
const httpNavigateFileSystem = async(path) => {
    return await axios.get(`${API_URL}/path`, {
        params: {
            path,
        },
    });
}

// search file or folder in PATH where target like QUERY
const httpSearchFilesAndFolders = async(path, query) => {
    return await axios.get(`${API_URL}/search`, {
        params: {
            path, query,
        },
    });
}

// get file or folder info
const httpGetFileProps = async(path) => {
    return await axios.get(`${API_URL}/info`, {
        params: {
            path,
        },
    });
}

// get dir tree
const httpGetDirectoryTree = async(path) => {
    return await axios.get(`${API_URL}/tree`, {
        params: {
            path,
        },
    });
}


// create file or folder
const httpCreateFileOrFolder = async(target) => {
    return await axios.post(`${API_URL}/create`, {
        ...target // ...{path, name, type}
    });
}


// delete file or folder
// type (extension) or "folder" text must be specified!!!
const httpDeleteFileOrFolder = async(path, type) => {
    return await axios.post(`${API_URL}/delete`, {
        path, type,
    });
}

// copy file or folder
const httpCopyFileOrFolder = async(source, destination) => {
    return await axios.post(`${API_URL}/copy`, {
        source, destination,
    });
}

// move file or folder
const httpMoveFileOrFoler = async(source, destination) => {
    return await axios.post(`${API_URL}/move`, {
        source, destination
    });
}


export {
    // get
    httpListDrives,
    httpNavigateFileSystem,
    httpSearchFilesAndFolders,
    httpGetFileProps,
    httpGetDirectoryTree,

    // post
    httpCreateFileOrFolder,
    httpDeleteFileOrFolder,
    httpCopyFileOrFolder,
    httpMoveFileOrFoler,
};
