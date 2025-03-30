<script setup lang="ts">
import { ref } from 'vue';
import { getToken } from '@/api';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const router = useRouter();

const login = async () => {
    if (!username.value || !password.value) {
        toast.error('Please enter both username and password');
        return;
    }

    isLoading.value = true;
    try {
        await getToken(username.value, password.value);
        router.push('/');
        toast.success('Successfully logged in!');
    } catch (error: any) {
        toast.error(error.message || 'Failed to login');
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="min-h-screen w-full flex items-center justify-center bg-[#0c0414] px-4 text-white">
        <div class="max-w-md w-full bg-[#1a0b2e] rounded-lg shadow-lg p-8">
            <div class="text-center mb-8">
                <img src="/icon.png" alt="Logo" class="mx-auto w-24 h-24 mb-2">
                <h2 class="text-2xl font-bold">Sign in to Spoutify</h2>
                <p class="text-gray-400 mt-2">Enter your credentials to continue</p>
            </div>

            <form @submit.prevent="login" class="space-y-6">
                <div>
                    <label for="username" class="block text-sm font-medium mb-2">Username</label>
                    <input v-model="username" id="username" type="email" required
                        class="w-full px-4 py-2 rounded-md bg-[#250e3d] border border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="your@email.com">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium mb-2">Password</label>
                    <input v-model="password" id="password" type="password" required
                        class="w-full px-4 py-2 rounded-md bg-[#250e3d] border border-violet-800 focus:outline-none focus:ring-2 focus:ring-violet-600"
                        placeholder="••••••••">
                </div>

                <button type="submit"
                    class="w-full py-2 px-4 bg-gradient-to-r from-purple-600 to-violet-800 text-white font-medium rounded-md hover:from-purple-700 hover:to-violet-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-violet-500 transition-colors"
                    :disabled="isLoading">
                    <span v-if="isLoading">Signing in...</span>
                    <span v-else>Sign In</span>
                </button>
            </form>
        </div>
    </div>
</template>
