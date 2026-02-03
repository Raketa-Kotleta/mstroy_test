import { toRaw } from "vue";

export type TreeNodeId = number | string;

export interface ITreeNode {
    id: TreeNodeId;
    parent: TreeNodeId | null | undefined;
}

export default class TreeStore<T extends ITreeNode> {
    private initialData: T[] = [];
    private treeMap: Map<TreeNodeId, T> = new Map();
    private childrenMap: Map<TreeNodeId, T[]> = new Map();

    constructor(data: T[]) {
        this.initialData = toRaw(data).map((item: T) => structuredClone<T>(item));
        this.initTreeMap(data);
    }

    private initTreeMap(data: T[]) {
        this.treeMap = new Map();
        for (const element of data) {
            this.addItem(element);
        }
    }
    //ВОЗВРАЩАЕТ ИЗНАЧАЛЬНЫЙ МАССИВ ЭЛЕМЕНТОВ, КАК СКАЗАНО В ТЗ
    getAll(): T[] {
        return this.initialData;
    }

    getItem(id: TreeNodeId): T | undefined {
        return this.treeMap.get(id);
    }

    getChildren(id: TreeNodeId): T[] {
        return this.childrenMap.get(id) ?? [];
    }

    getAllChildren(id: TreeNodeId): T[] {
        const item = this.getItem(id);
        if (!item) return [];

        const result: T[] = [];
        const stack: T[] = [item];

        while (stack.length > 0) {
            const currentChild = stack.pop()!;
            const children = this.getChildren(currentChild.id);

            for (const child of children) {
                result.push(child);
                stack.push(child);
            }
        }

        return result;
    }

    getAllParents(id: TreeNodeId): T[] {
        const item: T | undefined = this.treeMap.get(id);
        let current: T | undefined  = item;

        if (!current) return [];

        const result: T[] = [current];

        while (current?.parent !== null && current?.parent !== undefined) {
            current = this.treeMap.get(current.parent);
            result.push(current!!);
        }

        return result;
    }

    addItem(item: T): void {
        this.treeMap.set(item.id, item);

        if (item.parent === null || item.parent === undefined) return;

        const items = this.childrenMap.get(item.parent);
        if (!items) {
            this.childrenMap.set(item.parent, []);
        }

        this.childrenMap.get(item.parent)?.push(item);
    }

    removeItem(id: TreeNodeId): void {
        const targetItem: T | undefined = this.treeMap.get(id);
        if (!targetItem) return;

        const idsToRemove: TreeNodeId[] = [id];
        const stack: TreeNodeId[] = [id];

        while (stack.length > 0) {
            const currentId: TreeNodeId = stack.pop()!;
            const children: T[] | undefined = this.childrenMap.get(currentId);

            if (children) {
                for (const child of children) {
                    idsToRemove.push(child.id);
                    stack.push(child.id);
                }
            }
        }

        const parentId: TreeNodeId | null | undefined = targetItem.parent;
        if (parentId !== null && parentId !== undefined) {
            const parentChildren: T[] | undefined = this.childrenMap.get(parentId);
            if (parentChildren) {
                const index: number = parentChildren.findIndex((child: T) => child.id === id);
                if (index !== -1) {
                    parentChildren.splice(index, 1);
                }
            }
        }

        for (const idToDelete of idsToRemove) {
            this.treeMap.delete(idToDelete);
            this.childrenMap.delete(idToDelete);
        }
    }

    updateItem(item: T): void {
        const oldItem: T | undefined = this.treeMap.get(item.id);
        if (!oldItem) return;

        if (oldItem.parent !== item.parent) {
            if (oldItem.parent !== null && oldItem.parent !== undefined) {
                const oldChildren: T[] | undefined = this.childrenMap.get(oldItem.parent);
                if (oldChildren) {
                    const index: number = oldChildren.findIndex((child: T) => child.id === item.id);
                    if (index !== -1) oldChildren.splice(index, 1);
                }
            }

            if (item.parent !== null && item.parent !== undefined) {
                if (!this.childrenMap.has(item.parent)) {
                    this.childrenMap.set(item.parent, []);
                }
                this.childrenMap.get(item.parent)!.push(item);
            }
        } else {
            if (item.parent !== null && item.parent !== undefined) {
                const children: T[] | undefined = this.childrenMap.get(item.parent);
                if (children) {
                    const index: number = children.findIndex((child: T) => child.id === item.id);
                    if (index !== -1) children[index] = item;
                }
            }
        }

        this.treeMap.set(item.id, item);
    }
}
