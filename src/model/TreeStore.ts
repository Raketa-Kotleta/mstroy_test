export type TreeNodeId = number | string;

export interface ITreeNode {
    id: TreeNodeId,
    parent: TreeNodeId | null | undefined
}

export default class TreeStore<T extends ITreeNode>{
    private treeMap: Map<TreeNodeId, T> = new Map();
    private childrenMap: Map<TreeNodeId, T[]> = new Map();
    
    constructor(data: T[]) {
        this.initTreeMap(data);
    }

    private initTreeMap(data: T[]) {
        this.treeMap = new Map();
        for (const element of data){
            this.addItem(element)
        } 
    }

    getAll(): T[]  {
        return Array.from(this.treeMap.values());
    }

    getItem(id: TreeNodeId): T | undefined {
        return this.treeMap.get(id);
    }

    getChildren(id: TreeNodeId): T[] {
        return this.childrenMap.get(id) ?? []; 
    }

    getAllChildren(id: TreeNodeId) {
        const item = this.getItem(id);
        if (!item) return;

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

    getAllParents(id: TreeNodeId) {
        const result: T[] = [];

        let current: T | undefined  = this.treeMap.get(id);
        while (current?.parent) {
            current = this.treeMap.get(current.parent);
            result.push(current!!);
        }

        return result;
    }

    addItem(item: T): void {
        this.treeMap.set(item.id, item);

        if (!item.parent) return;

        const items = this.childrenMap.get(item.parent)
        if (!items) {
            this.childrenMap.set(item.parent, []);
        }

        this.childrenMap.get(item.parent)?.push(item);
    }

    removeItem(id: TreeNodeId): void {
        this.treeMap.delete(id);
        const item = this.getItem(id);
        const children = this.childrenMap.get(id);

        if (!item || !children) return;

        const index = children.indexOf(item); 
        children.splice(index, 1);
    }

    updateItem(item: T): void {
        const existingItem = this.treeMap.get(item.id);
        if (!existingItem) return;

        if (existingItem.parent !== item.parent) {

            if (existingItem.parent) {
                const oldParentChildren = this.childrenMap.get(existingItem.parent);
                if (oldParentChildren) {
                    const index = oldParentChildren.findIndex(child => child.id === item.id);
                    if (index !== -1) {
                        oldParentChildren.splice(index, 1);
                    }
                }
            }

            if (item.parent) {
                if (!this.childrenMap.has(item.parent)) {
                    this.childrenMap.set(item.parent, []);
                }

                const newParentChildren = this.childrenMap.get(item.parent)!;
                if (!newParentChildren.some(child => child.id === item.id)) {
                    newParentChildren.push(item);
                }
            }
        }


        this.treeMap.set(item.id, item);
        
        const allParents = this.getAllParents(item.id);
        allParents.forEach(parent => {
            const children = this.childrenMap.get(parent.id);
            if (children) {
                const childIndex = children.findIndex(child => child.id === item.id);
                if (childIndex !== -1) {
                    children[childIndex] = item;
                }
            }
        });
    }
}