<template>
    <component :is="isInternalLink ? 'router-link' : 'a'"
        v-bind="isInternalLink ? { to: href } : { href, target: '_blank', rel: 'noopener noreferrer' }"
        v-on="isInternalLink ? {} : { click: handleExternalClick }" :class="className">
        <slot></slot>
    </component>

    <!-- Confirmation Dialog -->
    <Teleport to="body">
        <div v-if="showConfirmation" class="fixed inset-0 flex items-center justify-center z-50">
            <div class="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
                @click="cancelNavigation"></div>
            <div
                class="bg-gray-800 rounded-xl p-7 max-w-md w-full mx-4 relative z-10 border border-gray-700 shadow-2xl transform transition-all duration-300 ease-in-out">
                <h3 class="text-xl font-semibold text-white mb-4 flex items-center">
                    <span class="mr-3 text-indigo-400">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    Quitter le site
                </h3>
                <p class="text-gray-300 mb-3">Vous êtes sur le point de quitter ce site pour visiter:</p>
                <p
                    class="text-indigo-400 mb-6 break-all font-medium bg-gray-900/50 p-3 rounded-lg border border-gray-700">
                    {{ pendingUrl }}</p>

                <div class="grid grid-cols-3 gap-3">
                    <button @click="cancelNavigation"
                        class="col-span-1 px-4 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200 font-medium text-sm">
                        Annuler
                    </button>
                    <button @click="confirmNavigation"
                        class="col-span-1 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors duration-200 font-medium text-sm">
                        Continuer
                    </button>
                    <button @click="skipConfirmationsAndNavigate"
                        class="col-span-1 px-2 py-2.5 bg-gray-800 text-indigo-300 rounded-lg hover:bg-gray-700 border border-gray-700 transition-colors duration-200 font-medium text-sm">
                        Ne plus demander
                    </button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script lang="ts">
const SKIP_CONFIRMATION_KEY = 'skipExternalLinkConfirmation';

export default {
    props: {
        href: {
            type: String,
            required: true
        },
        className: {
            type: String,
            default: ''
        },
        forceConfirm: {
            type: Boolean,
            default: false
        }
    },

    data() {
        return {
            showConfirmation: false,
            pendingUrl: ''
        }
    },

    computed: {
        isInternalLink(): boolean {
            // Check if the link starts with / or # or is relative (doesn't have protocol)
            return this.forceConfirm ? false : (
                this.href.startsWith('/') ||
                this.href.startsWith('#') ||
                !this.href.includes('://')
            );
        },

        shouldSkipConfirmation(): boolean {
            return localStorage.getItem(SKIP_CONFIRMATION_KEY) === 'true';
        }
    },

    methods: {
        handleExternalClick(event: MouseEvent) {
            event.preventDefault();

            if (this.shouldSkipConfirmation) {
                // Skip confirmation if user has opted out
                window.open(this.href, '_blank', 'noopener,noreferrer');
                return;
            }

            this.pendingUrl = this.href;
            this.showConfirmation = true;
        },

        confirmNavigation() {
            this.showConfirmation = false;
            window.open(this.pendingUrl, '_blank', 'noopener,noreferrer');
        },

        skipConfirmationsAndNavigate() {
            // Save preference to localStorage
            localStorage.setItem(SKIP_CONFIRMATION_KEY, 'true');
            // Navigate as usual
            this.confirmNavigation();
        },

        cancelNavigation() {
            this.showConfirmation = false;
            this.pendingUrl = '';
        }
    }
}
</script>
