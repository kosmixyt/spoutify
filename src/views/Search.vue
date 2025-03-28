<template>

    <div class="text-white">
        {{ $route.query.q }}
    </div>
</template>

<script lang="ts">
import { Search } from '@/api';
import type { SearchItem } from '@/type';


export default {
    data() {
        return {
            loading: true,
            results: [] as SearchItem[],
            searchTimer: null as number | null,
        }
    },

    watch: {
        '$route.query.q': {
            immediate: true,
            handler() {
                const q = this.$route.query.q as string;
                if (!q) return;

                this.debouncedSearch(q);
            }
        }
    },

    methods: {
        debouncedSearch(query: string) {
            // Clear any existing timer
            if (this.searchTimer !== null) {
                clearTimeout(this.searchTimer);
            }

            // Set loading state
            this.loading = true;

            // Set a new timer
            this.searchTimer = setTimeout(async () => {
                console.log("Searching for:", query);
                this.results = await Search(query, "");
                console.log(this.results);
                this.loading = false;
                this.searchTimer = null;
            }, 500); // 500ms debounce time
        }
    }
}
</script>