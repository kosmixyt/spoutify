<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getToken } from '@/api';
import { useRouter } from 'vue-router';
import { toast } from 'vue3-toastify';
import { SecureStoragePlugin } from 'capacitor-secure-storage-plugin';
import { Capacitor } from '@capacitor/core';

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const isNativePlatform = ref(Capacitor.isNativePlatform());
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

const saveCredentials = async () => {
    if (!Capacitor.isNativePlatform()) {
        toast.error('This feature is only available on native platforms');
        return;
    }

    try {
        await SecureStoragePlugin.set({ key: 'username', value: username.value });
        await SecureStoragePlugin.set({ key: 'password', value: password.value });
        toast.success('Credentials saved securely!');
    } catch (error: any) {
        toast.error(error.message || 'Failed to save credentials');
    }
};

const tryAutoLogin = async () => {
    if (!Capacitor.isNativePlatform()) {
        return;
    }

    isLoading.value = true;
    try {
        const usernameData = await SecureStoragePlugin.get({ key: 'username' });
        const passwordData = await SecureStoragePlugin.get({ key: 'password' });

        if (usernameData.value && passwordData.value) {
            username.value = usernameData.value;
            password.value = passwordData.value;
            await login();
        }
    } catch (error) {
        // Silent fail - no credentials found or other error
        console.log('No saved credentials found');
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    tryAutoLogin();
});
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
                <button v-if="isNativePlatform" type="button"
                    class="w-full py-2 px-4 bg-gradient-to-r from-green-600 to-green-800 text-white font-medium rounded-md hover:from-green-700 hover:to-green-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                    @click="saveCredentials">
                    Save Credentials
                </button>
            </form>
        </div>
    </div>
</template>
