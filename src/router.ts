import { createRouter, createWebHistory } from 'vue-router'
import HomeView from './views/HomeView.vue'
import JobsView from './views/JobsView.vue'
import JobDetailView from './views/JobDetailView.vue'
import MapView from './views/MapView.vue'
import SkillsView from './views/SkillsView.vue'
import ProfileView from './views/ProfileView.vue'
import AboutView from './views/AboutView.vue'
import AuthView from './views/AuthView.vue'
import OwnerJobsView from './views/OwnerJobsView.vue'
import JobFormView from './views/JobFormView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/peluang-kerja', name: 'jobs', component: JobsView },
    { path: '/peluang-kerja/:id', name: 'job-detail', component: JobDetailView, props: true },
    { path: '/map', name: 'map', component: MapView },
    { path: '/belajar-skill', name: 'skills', component: SkillsView },
    { path: '/profil', name: 'profile', component: ProfileView },
    { path: '/tentang', name: 'about', component: AboutView },
    { path: '/masuk', name: 'auth', component: AuthView },
    { path: '/kelola-lowongan', name: 'owner-jobs', component: OwnerJobsView },
    { path: '/kelola-lowongan/baru', name: 'job-new', component: JobFormView },
    { path: '/kelola-lowongan/:id/ubah', name: 'job-edit', component: JobFormView, props: true },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, _from, savedPosition) {
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    return savedPosition ?? { top: 0 }
  },
})
