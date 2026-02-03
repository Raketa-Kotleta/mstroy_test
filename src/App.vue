<template>
    <div class="ag-grid-container">
        <tree-store-table :tree-store="treeStore"> </tree-store-table>
    </div>
</template>

<style scoped></style>

<script setup lang="ts">
    import TreeStoreTable from '@/components/TreeStoreTable.vue';
    import TreeStore from './model/TreeStore';
    import TreeStoreItem from './model/TreeStoreItem';
    import { useDataStore } from './stores/data';

    const treeStore: TreeStore<TreeStoreItem> = new TreeStore(useDataStore().data);
</script>

<style>
    @import 'CSSApp.css';
</style>
