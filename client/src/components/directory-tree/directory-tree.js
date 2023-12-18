import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTree, fetchSubTree as fetchST } from './directoryTreeSlice';
import { Box } from '@mui/material';
import FolderImage from "../../images/folder.png";
import FolderImageOpened from "../../images/folder_opened.png";
import { defaultStyles, FileIcon } from 'react-file-icon';
import { appendToHistory, navigateFS, openItem, setCurrentPath } from '../items-container/itemsContainerSlice';


const TreeRecursiveItem = props => {
    const { tree, path } = props;
    const dispatch = useDispatch();

    const fetchSubTree = (path) => {
        dispatch(fetchST(path));
        path = path.slice(0, String(path).indexOf('\\')) + path.slice(String(path).indexOf('\\') + 1, path.length)
        dispatch(appendToHistory(path));
        //dispatch(setCurrentPath(path));
        //dispatch(navigateFS(path));
    }

    const openFile = (path) => {
        dispatch(openItem(path));
    }

    return (
        <>
            {
                tree
                &&
                (() => {
                    return Object.keys(tree)
                        .sort((a, b) => {
                            const isObjectA = typeof tree[a] === 'object' && tree[a] !== null;
                            const isObjectB = typeof tree[b] === 'object' && tree[b] !== null;

                            if (isObjectA && !isObjectB) {
                                return -1;
                            } else if (!isObjectA && isObjectB) {
                                return 1;
                            } else {
                                return 0;
                            }
                        })
                    
                        .map((key, i) => {
                            if (typeof tree[key] === 'object' && tree[key] !== null) {
                                return (
                                    <TreeItem 
                                        key={i} 
                                        nodeId={key + i} 
                                        label={key} 
                                        onClick={() => fetchSubTree(`${path}\\${key}`)}
                                    >
                                        <TreeRecursiveItem tree={tree[key]} path={`${path}\\${key}`} />
                                    </TreeItem>
                                );
                            } else {
                                let extension = key.split('.');
                                extension = extension.length > 1 ? extension[extension.length - 1] : extension[0];
                                return (
                                    <TreeItem onClick={() => {openFile(`${path}\\${key}`)}} key={i} nodeId={key} label={key} icon={<FileIcon extension={extension} {...defaultStyles[extension]} />}/>
                                );
                            }
                        }) 
                })()
            }
        </>
        
    );
}



const DirectoryTree = props => {
    // отримання значень із глобального стану компонентів застосунку
    const currentPath = useSelector(state => state.itemsContainer.currentPath);
    const history = useSelector(state => state.itemsContainer.history);
    const tree = useSelector(state => state.directoryTree.tree);
    
    // локальні змінні
    const [treePath, setTreePath] = useState();
    const dispatch = useDispatch();

    // логіка підвантаження піддиректорій
    useEffect(() => {
        if (history.length < 3) {
            setTreePath(currentPath);
            dispatch(fetchTree());
        }
    }, [currentPath, history]);

    // відображення
    return (
        <Box sx={{
            height: 'calc(100vh - 140px)',
            overflow: 'auto'
        }}>

            <TreeView
                defaultCollapseIcon={<img src={FolderImageOpened} width="16px"></img>}
                defaultExpandIcon={<img src={FolderImage} width="16px"></img>}
                style={{marginLeft: '20px'}}
            >
                <TreeRecursiveItem tree={tree} path={treePath}/>
            </TreeView>
        </Box>
    );
}

export default DirectoryTree;


