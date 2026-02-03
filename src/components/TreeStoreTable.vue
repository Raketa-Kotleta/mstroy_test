<template>
    <ag-grid-vue
        :row-data="data"
        :column-defs="colDef"
        :tree-data="true"
        :tree-data-parent-id-field="parentId"
        :get-row-id="getRowId"
        @row-group-opened="updateRowNumbers"
        group-display-type="custom"
        style="height: 75vh"
    ></ag-grid-vue>
</template>

<script setup lang="ts">
    import TreeStore from '@/model/TreeStore';
    import TreeStoreItem from '@/model/TreeStoreItem';
    import { useDataStore } from '@/stores/data';
    import type { ColDef, GetRowIdFunc, RowGroupOpenedEvent } from 'ag-grid-enterprise';
    import { AgGridVue } from 'ag-grid-vue3';
    import { computed, reactive, ref, type ComputedRef, type Reactive, type Ref } from 'vue';

    const treeStore: Reactive<TreeStore<TreeStoreItem>> = reactive(
        new TreeStore(useDataStore().data)
    );
    const data: ComputedRef<TreeStoreItem[]> = computed(() => {
        return treeStore.getAllCurrentState();
    });

    const getRowId: GetRowIdFunc<TreeStoreItem> = (params) => {
        return params.data.id.toString();
    };
    const parentId: Ref<keyof TreeStoreItem> = ref('parent');
    const colDef: Reactive<ColDef<TreeStoreItem>[]> = reactive([
        {
            headerName: '№ п\\п',
            colId: 'rowNumber',
            valueGetter: (params) => {
                return params.node?.rowIndex != null ? params.node.rowIndex + 1 : null;
            },
            width: 120,
            resizable: false,
            sortable: false,
            suppressHeaderMenuButton: true,
        },
        {
            headerName: 'Категория',
            cellRenderer: 'agGroupCellRenderer',
            showRowGroup: true,
            cellRendererParams: {
                suppressCount: true,
            },
            flex: 1,
            resizable: false,
            sortable: false,
            suppressHeaderMenuButton: true,
            valueGetter: (params) => {
                const id = params.data?.id;
                if (!id) return 'Элемент';

                return treeStore.getChildren(id).length ? 'Группа' : 'Элемент';
            },
        },
        {
            field: 'label',
            headerName: 'Наименование',
            flex: 1,
            resizable: false,
            sortable: false,
            suppressHeaderMenuButton: true,
        },
    ]);

    const updateRowNumbers: (event: RowGroupOpenedEvent) => void = (event: RowGroupOpenedEvent) => {
        event.api.refreshCells({
            columns: ['rowNumber'],
            force: true,
        });
    };
</script>
