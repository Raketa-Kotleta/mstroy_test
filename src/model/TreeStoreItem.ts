import type { ITreeNode, TreeNodeId } from "@/model/TreeStore";
export default class TreeStoreItem implements ITreeNode {
    id: TreeNodeId;
    parent: TreeNodeId | null | undefined;
    label: string;

    constructor(id: TreeNodeId, parent: TreeNodeId | null | undefined, label: string) {
        this.id = id;
        this.parent = parent;
        this.label = label;
    }
}