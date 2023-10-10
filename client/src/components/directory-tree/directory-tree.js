import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';
import { FolderOpen, Folder } from '@mui/icons-material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTree } from './directoryTreeSlice';


const TreeRecursiveItem = props => {
    const { tree } = props;

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
                            if (typeof tree[key] == 'object' && tree[key] !== null) {
                                return (
                                    <TreeItem key={i} nodeId={key} label={key}>
                                        <TreeRecursiveItem tree={tree[key]}/>
                                    </TreeItem>
                                );
                            } else {
                                return (
                                    <TreeItem key={i} nodeId={key} label={key}></TreeItem>
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
    const tree = useSelector(state => state.directoryTree.tree);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchTree());
    }, [currentPath]);

    
    return (
        <TreeView
            defaultCollapseIcon={<FolderOpen/>}
            defaultExpandIcon={<Folder/>}
            style={{marginLeft: '20px'}}
        >
            <TreeRecursiveItem tree={tree}/>
        </TreeView>
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