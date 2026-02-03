import { reactive, type Reactive } from 'vue';
import { defineStore } from 'pinia';
import TreeStoreItem from '@/model/TreeStoreItem';

export const useDataStore = defineStore('data', () => {
    const data: Reactive<TreeStoreItem[]> = reactive([
        new TreeStoreItem(1, null, 'Айтем 1'),
        new TreeStoreItem('91064cee', 1, 'Айтем 2'),
        new TreeStoreItem(3, 1, 'Айтем 3'),
        new TreeStoreItem(4, '91064cee', 'Айтем 4'),
        new TreeStoreItem(5, '91064cee', 'Айтем 5'),
        new TreeStoreItem(6, '91064cee', 'Айтем 6'),

        new TreeStoreItem(7, 4, 'Айтем 7'),
        new TreeStoreItem(8, 4, 'Айтем 8'),
    ]);

    return { data };
});
