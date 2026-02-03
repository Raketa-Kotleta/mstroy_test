
import { describe, it, expect, beforeEach } from 'vitest';
import TreeStore, {type TreeNodeId} from '@/model/TreeStore';
import TreeStoreItem from '@/model/TreeStoreItem';

describe('TreeStore with TreeStoreItem', () => {
    let initialData: TreeStoreItem[];
    let store: TreeStore<TreeStoreItem>;

    beforeEach((): void => {
        initialData = [
            new TreeStoreItem('root', null, 'Root'),
            new TreeStoreItem(1, 'root', 'Node 1'),
            new TreeStoreItem(2, 'root', 'Node 2'),
            new TreeStoreItem(3, 1, 'Node 1.1'),
            new TreeStoreItem(4, 1, 'Node 1.2'),
            new TreeStoreItem(5, 2, 'Node 2.1'),
            new TreeStoreItem(6, 3, 'Node 1.1.1'),
            new TreeStoreItem(7, 3, 'Node 1.1.2'),
            new TreeStoreItem(8, 4, 'Node 1.2.1'),
            new TreeStoreItem('extra', 2, 'Node 2.2'),
            new TreeStoreItem(10, 'extra', 'Node 2.2.1')
        ];
        store = new TreeStore<TreeStoreItem>(initialData);
    });

    it('getAll: should return all 11 items', (): void => {
        const result: TreeStoreItem[] = store.getAll();
        expect(result).toHaveLength(11);
    });
    
    it('getAll: should return exactly the same data as provided in constructor', (): void => {
        const result: TreeStoreItem[] = store.getAll();

        expect(result).toHaveLength(initialData.length);
        expect(result).toEqual(expect.arrayContaining(initialData));
    });

    it('getItem: should return item with string id', (): void => {
        const targetId: TreeNodeId = 'extra';
        const result: TreeStoreItem | undefined = store.getItem(targetId);
        expect(result).toBeInstanceOf(TreeStoreItem);
        expect(result?.label).toBe('Node 2.2');
    });

    it('getChildren: should return direct children for multiple nodes', (): void => {
        const childrenOf1: TreeNodeId[] = store.getChildren(1).map((n: TreeStoreItem) => n.id);
        const childrenOfRoot: TreeNodeId[] = store.getChildren('root').map((n: TreeStoreItem) => n.id);

        expect(childrenOf1).toEqual([3, 4]);
        expect(childrenOfRoot).toEqual([1, 2]);
    });

    it('getAllChildren: should return all descendants for a deep branch', (): void => {
        const rootId: TreeNodeId = 1;
        const expectedIds: TreeNodeId[] = [3, 4, 6, 7, 8];

        const result: TreeStoreItem[] | undefined = store.getAllChildren(rootId);
        const resultIds: TreeNodeId[] | undefined = result?.map((n: TreeStoreItem) => n.id);

        expect(resultIds).toHaveLength(5);
        expect(resultIds).toEqual(expect.arrayContaining(expectedIds));
    });

    it('getAllParents: should return full path to root from deep node', (): void => {
        const childId: TreeNodeId = 10;
        const expectedPath: TreeNodeId[] = ['extra', 2, 'root'];

        const result: TreeStoreItem[] = store.getAllParents(childId);
        const resultIds: TreeNodeId[] = result.map((n: TreeStoreItem) => n.id);

        expect(resultIds).toEqual(expectedPath);
    });

    it('addItem: should correctly integrate new node into deep structure', (): void => {
        const newNode: TreeStoreItem = new TreeStoreItem(99, 6, 'Node 1.1.1.1');

        store.addItem(newNode);

        expect(store.getItem(99)).toBe(newNode);
        expect(store.getChildren(6)).toContain(newNode);
        expect(store.getAllParents(99).map((n: TreeStoreItem) => n.id)).toContain(1);
    });

    it('updateItem: should move a whole branch to another parent', (): void => {
        const movedNode: TreeStoreItem = new TreeStoreItem(3, 'extra', 'Node 1.1 (moved)');
        const oldParentId: TreeNodeId = 1;
        const newParentId: TreeNodeId = 'extra';

        store.updateItem(movedNode);

        expect(store.getChildren(oldParentId).map((n: TreeStoreItem) => n.id)).not.toContain(3);
        expect(store.getChildren(newParentId).map((n: TreeStoreItem) => n.id)).toContain(3);
        expect(store.getAllParents(6).map((n: TreeStoreItem) => n.id)).toContain('extra');
    });

    it('removeItem: should remove node and break link from parent', (): void => {
        const idToRemove: TreeNodeId = 8;
        const parentId: TreeNodeId = 4;

        store.removeItem(idToRemove);

        expect(store.getItem(idToRemove)).toBeUndefined();
        expect(store.getChildren(parentId).find((n: TreeStoreItem) => n.id === idToRemove)).toBeUndefined();
    });
});