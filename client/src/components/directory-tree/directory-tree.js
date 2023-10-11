import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderOpen, Folder } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTree, fetchSubTree as fetchST } from './directoryTreeSlice';
import { Box } from '@mui/material';


const TreeRecursiveItem = props => {
    const { tree, path } = props;
    const dispatch = useDispatch();

    const fetchSubTree = (path) => {
        //console.log(`${path}`)
        dispatch(fetchST(path));
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
                                return (
                                    <TreeItem key={i} nodeId={key} label={key}/>
                                );
                            }
                        }) 
                })()
            }
        </>
        
    );
}



const DirectoryTree = props => {
    const currentPath = useSelector(state => state.itemsContainer.currentPath);
    const history = useSelector(state => state.itemsContainer.history);
    const tree = useSelector(state => state.directoryTree.tree);
    
    const [treePath, setTreePath] = useState();
    const dispatch = useDispatch();

    useEffect(() => {
        if (history.length < 3) {
            setTreePath(currentPath);
            dispatch(fetchTree());
        }
    }, [currentPath, history]);

    
    return (
        <Box sx={{
            height: 'calc(100vh - 140px)',
            overflow: 'auto'
        }}>

            <TreeView
                defaultCollapseIcon={<FolderOpen/>}
                defaultExpandIcon={<Folder/>}
                style={{marginLeft: '20px'}}
            >
                <TreeRecursiveItem tree={tree} path={treePath}/>
            </TreeView>
        </Box>
    );
}

export default DirectoryTree;


/*
<TreeItem nodeId="root" label="Current folder">
    <TreeItem nodeId="folder1" label="Folder 1">
        <TreeItem nodeId="file1" label="File 1" />
        <TreeItem nodeId="file2" label="File 2" />
    </TreeItem>
    <TreeItem nodeId="folder2" label="Folder 2">
        <TreeItem nodeId="file3" label="File 3" />
    </TreeItem>
</TreeItem>
*/